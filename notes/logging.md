# Logging in .NET 10 for High-Performance, Highly Available Systems

Use these notes to explain how you design resilient, low-overhead logging pipelines for .NET 10 services. Emphasize structured data, predictable latency, and operability under load.

---

## Principles and Goals
- **Observability first:** Capture structured events (no free-form strings) with fields for correlation IDs, tenant, region, and service version.
- **Consistency across tiers:** Standardize `ILogger` scopes and message templates so API, workers, and background jobs emit comparable fields.
- **Backpressure-aware:** Protect the app by sampling noisy events (e.g., debug traces) and using bounded queues for async sinks.
- **Fail-safe:** Logging must never block request completion; prefer drop-and-alert over throttling callers.

## Recommended Stack
- **Microsoft.Extensions.Logging** as the facade for framework integrations.
- **Structured logger:** Serilog or Seq sink for JSON; use message-template placeholders (`{OrderId}`) instead of string interpolation.
- **OpenTelemetry:** Export traces/logs/metrics consistently; include W3C trace/context propagation headers.
- **Shipping:** Centralize via OTLP/HTTP, gRPC, or Kafka; avoid writing to local disk in containers except for bootstrap/debug.
- **NLog context:**
  - **Where it shines:** Mature ecosystem with **rich target support** (file, database, email, Azure Log Analytics), high-performance async targets, and **flexible routing/layouts** for multi-tenant or blue/green rollouts.
  - **Advantages:** Simple XML/JSON configuration, fast text file output, built-in filtering/rules, and battle-tested community extensions. Great when you need to fan out to multiple sinks without custom code.
  - **Trade-offs:** Configuration can become verbose, JSON structure requires explicit layouts, and mixing NLog APIs with `ILogger` can create duplicate pipelines. Prefer running NLog **behind `Microsoft.Extensions.Logging`** via the NLog provider to keep a single abstraction and leverage dependency injection.
  - **Operational note:** Keep targets async, set `overflowAction="Discard"` or sampling for noisy rules, and set per-environment config (dev = verbose file, prod = centralized structured logs) through `NLog.config` transforms.

## Patterns to Prefer
- **Message templates over interpolation:** `logger.LogInformation("Processed {Count} items", count);` avoids unnecessary string formatting when disabled.
- **Enriched scopes:** Wrap requests with `using var scope = logger.BeginScope(new { CorrelationId = traceId, Tenant = tenant });` so child logs inherit fields.
- **Categorized loggers:** Request typed loggers per class (`ILogger<CheckoutHandler>`) for filters and metrics alignment.
- **Level hygiene:**
  - `Critical/Error`: actionable failures only.
  - `Warning`: degradation/path to failure.
  - `Information`: business milestones.
  - `Debug/Trace`: development and short-term diagnostics; gate behind config.
- **Async/buffered sinks:** Use non-blocking background queues with bounded capacity; drop oldest or sample when full.
- **Health/availability focus:** Emit heartbeats and dependency outcome events (latency, status, retries) to support SLO dashboards.

## Configuration Example (Minimal API)
```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole(options =>
{
    options.IncludeScopes = true;
    options.TimestampFormat = "yyyy-MM-ddTHH:mm:ss.fffZ ";
});

builder.Services.AddOpenTelemetry()
    .WithTracing(trace => trace
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddSource("Orders"))
    .WithMetrics(metrics => metrics
        .AddRuntimeInstrumentation())
    .WithLogging(logging => logging
        .AddConsoleExporter());

var app = builder.Build();

app.MapPost("/orders", async (
    ILogger<Program> logger,
    HttpContext context) =>
{
    using var scope = logger.BeginScope(new
    {
        CorrelationId = context.TraceIdentifier,
        Tenant = context.Request.Headers["X-Tenant"].FirstOrDefault() ?? "unknown"
    });

    logger.LogInformation("Received order request from {Tenant}");

    // Simulate work
    await Task.Delay(10);

    logger.LogInformation("Order accepted", DateTimeOffset.UtcNow);
    return Results.Accepted();
});

app.Run();
```

## High-Performance Techniques
- **Avoid allocations:** Prefer value types for high-frequency metrics; avoid `string` concatenation in hot paths.
- **Batch and flush strategically:** Batch OTLP/HTTP exports; tune `MaxBatchSize` and `FlushInterval` to keep p99 latency stable.
- **Guard noisy paths:** Add feature flags for trace/debug logs in critical loops; enable temporarily for investigations.
- **Pre-allocate logger scopes:** Reuse static state where possible; avoid dynamic object creation for unchanged fields.
- **Tune buffers:** Size async channels based on peak RPS and expected burst size; expose metrics for dropped events.

## Operational Best Practices
- **Correlate everything:** Propagate trace/span IDs across HTTP, messaging, and background jobs.
- **Schema discipline:** Maintain a central log schema (event name, category, correlation, tenant, outcome, duration).
- **PII controls:** Classify fields and redact at the edge; log tokens/credentials only in secure staging with strict retention.
- **Deployment safety:** Use configuration-driven sinks/levels; favor hot-reloadable changes (appsettings, feature flags) over redeploys.
- **Alerting:** Alert on error-rate deltas, burst of dropped events, and missing heartbeats rather than raw log volume.
- **What to log (and not):**
  - **Log:** Request/response envelope metadata (not bodies) for public APIs, dependency outcomes (latency/status/retries), domain milestones (order accepted/settled), security-relevant events (authn/z decisions), and **drop reason** when sampling/discarding.
  - **Avoid:** Large payloads, secrets, personal data, high-cardinality values (raw GUID lists), and repetitive success spam in hot loops. Summarize counts instead.
  - **Environments:**
    - **Local/dev:** Enable `Debug/Trace`, file/console targets, and payload logging only with synthetic data.
    - **Staging:** Mirror production sinks/levels; allow short-term `Debug` with sampling for reproductions.
    - **Production:** Default to `Information` for business events and `Warning/Error` for issues; enable `Debug/Trace` only via time-bound flags with sampling to protect throughput and cost.
  - **Performance guardrails:** Keep hot-path logging off by default, prefer structured summaries, and set per-rule rate limits so troubleshooting toggles don't DOS the service.

## Sample Diagnostic Pattern (Resilient HTTP Client)
```csharp
public class InventoryClient
{
    private static readonly EventId FetchInventory = new(1001, nameof(FetchAsync));
    private readonly HttpClient _httpClient;
    private readonly ILogger<InventoryClient> _logger;

    public InventoryClient(HttpClient httpClient, ILogger<InventoryClient> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<InventoryResponse?> FetchAsync(string sku, CancellationToken ct)
    {
        using var scope = _logger.BeginScope(new { Sku = sku });

        _logger.LogInformation(FetchInventory, "Fetching inventory");

        try
        {
            var response = await _httpClient.GetAsync($"/inventory/{sku}", ct);
            var body = await response.Content.ReadAsStringAsync(ct);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Inventory lookup failed with {StatusCode} and body length {Length}",
                    (int)response.StatusCode, body.Length);
                return null;
            }

            _logger.LogInformation("Inventory fetched successfully in {ElapsedMs} ms",
                response.Headers.GetValues("X-ElapsedMs").FirstOrDefault());

            return JsonSerializer.Deserialize<InventoryResponse>(body);
        }
        catch (OperationCanceledException) when (ct.IsCancellationRequested)
        {
            _logger.LogWarning("Inventory fetch canceled by caller");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected failure during inventory fetch");
            throw;
        }
    }
}
```

## Sample Interview Q&A
- **Q:** How do you prevent logging from degrading throughput?
  - **A:** Use async/buffered sinks with bounded capacity, sample debug/trace logs, and rely on message templates to avoid string allocations when the level is disabled.
- **Q:** What do you log to support SLOs in a multi-tenant service?
  - **A:** Log per-request correlation IDs, tenant, region, outcome, duration, and retry counts; emit heartbeats and dependency statuses for dashboards.
- **Q:** How do you handle sensitive data in logs?
  - **A:** Apply a schema with field-level classification, default to redaction, and restrict sinks/retention for sensitive environments; validate with automated scanners.
- **Q:** How do you integrate logging with tracing?
  - **A:** Propagate W3C trace context, attach span IDs to log scopes, export via OpenTelemetry so logs/metrics/traces share correlation IDs.
- **Q:** What patterns help during incident response?
  - **A:** Toggle verbose levels via config, enable sampling to capture representative failures, and use structured events with consistent keys for quick querying.
- **Q:** Why run Serilog or NLog behind `Microsoft.Extensions.Logging` instead of using them directly? 
  - **A:** The facade lets ASP.NET Core, EF Core, and custom services share the same pipeline and DI story. Providers (Serilog/NLog) plug in via `AddSerilog()`/`AddNLog()`, so you avoid duplicate configuration, keep scopes consistent, and can swap sinks without touching app code.
- **Q:** How do you keep correlation data consistent across APIs, queues, and workers?
  - **A:** Wrap each request/message in a logger scope containing `CorrelationId`, tenant, region, and trace/span IDs. Forward these fields on outbound HTTP/messaging headers so downstream services enrich their scopes too, creating an unbroken chain for querying dashboards.
- **Q:** When would you favor synchronous logging and how do you mitigate its risk?
  - **A:** Only for small local dev tooling or early startup when async infrastructure isn’t ready. Even then, keep messages tiny and avoid blocking network calls. In production, always switch to async/buffered sinks with drop policies to shield request threads.
- **Q:** How do you tune OpenTelemetry or OTLP exporters for logging?
  - **A:** Batch records (tens-hundreds per batch), tune `FlushInterval` to balance latency and throughput, and size the export queue to absorb bursts. Watch metrics for dropped spans/logs and adjust `MaxConcurrency` or sampling rates accordingly.
- **Q:** How do you verify logging instrumentation in CI?
  - **A:** Use in-memory sinks/exporters during integration tests, execute key scenarios, and assert on emitted event names, scopes, and structured fields. This catches schema regressions or missing context before they hit observability platforms.
- **Q:** How do you control log level explosions when temporarily enabling `Debug` or `Trace`?
  - **A:** Flip levels via config/feature flags with TTLs, scope the change to specific categories, and combine with sampling or rate limiting. Always capture the reason in runbooks so toggles are reverted quickly and storage cost stays predictable.
