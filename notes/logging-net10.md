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
