# Error Handling for High-Performance, Highly Available .NET Services

Use these notes to articulate how you design resilient error-handling flows that protect throughput, minimize tail latency, and keep services debuggable under load.

---

## Principles and Goals
- **Fail fast, fail safely:** Validate inputs early and return meaningful errors without cascading failures.
- **Defensive at edges, fail-fast at core:** Use defensive programming at system boundaries (APIs, external data) and fail-fast in domain logic. See [Defensive Programming vs Fail-Fast](./defensive-programming-vs-fail-fast.md) for comprehensive guidance.
- **Deterministic paths:** Prefer predictable control flow over broad exception handling; reserve exceptions for truly exceptional conditions.
- **Low-overhead:** Avoid unnecessary allocations and reflection in hot paths; keep the happy-path zero-cost when possible.
- **Observability built-in:** Emit structured errors with correlation IDs and key context (tenant, region, feature flag) for fast triage.
- **Graceful degradation:** Prefer partial availability (cached responses, degraded features) over total failure.

## Patterns to Prefer
- **Guard clauses:** Validate arguments and state up front to keep the main logic clear and predictable.
- **Typed results:** Use `OneOf`, `ErrorOr`, or `Result`-style return types for expected domain errors; avoid exceptions for flow control.
- **Exception filters:** Use `catch (Exception ex) when (...)` to separate retryable from terminal failures and avoid broad catch blocks.
- **Retry with jitter:** Apply exponential backoff plus jitter for transient faults; cap retries to protect latency budgets.
- **Circuit breakers and bulkheads:** Short-circuit unhealthy dependencies and isolate pools to prevent resource exhaustion.
- **Timeouts and cancellation:** Set timeouts per dependency; honor `CancellationToken` to shed load quickly.
- **Idempotency:** Design operations to be retry-safe (idempotency keys, upserts) so recovery paths don't create duplicates.

## Implementation Guidelines
- **Boundary enforcement:** Validate DTOs with FluentValidation or `IValidatableObject`; return `400`-series responses with actionable messages.
- **Centralized exception handling:** Use middleware/filters to translate exceptions into consistent problem-details payloads.
- **Structured error contracts:** Standardize fields like `errorCode`, `correlationId`, `source`, and `retryable` for clients.
- **Dependency hygiene:** Wrap external calls (HTTP, DB, queues) with polly policies for retry, circuit-breaker, timeout, and fallback.
- **Resource protection:** Use bounded channels/queues; reject requests when buffers are full instead of blocking threads.
- **Telemetry alignment:** Log errors with event IDs; emit metrics for error rates, retry counts, circuit state, and fallback usage.

## Minimal API Example (Problem Details + Resilience)
```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddProblemDetails(options =>
{
    options.CustomizeProblemDetails = context =>
    {
        context.ProblemDetails.Extensions["correlationId"] = context.HttpContext.TraceIdentifier;
    };
});

builder.Services.AddHttpClient<InventoryClient>(client =>
    client.BaseAddress = new Uri("https://inventory"))
    .AddTransientHttpErrorPolicy(policy => policy
        .WaitAndRetryAsync(3, retry => TimeSpan.FromMilliseconds(50 * Math.Pow(2, retry)))
        .WrapAsync(Policy.TimeoutAsync<HttpResponseMessage>(TimeSpan.FromSeconds(1))));

var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();
app.UseMiddleware<RequestCorrelationMiddleware>();
app.UseProblemDetails();

app.MapGet("/items/{sku}", async (
    string sku,
    InventoryClient client,
    CancellationToken ct) =>
{
    if (string.IsNullOrWhiteSpace(sku))
    {
        return Results.BadRequest(new ProblemDetails
        {
            Title = "Invalid SKU",
            Detail = "SKU must be provided",
            Status = StatusCodes.Status400BadRequest
        });
    }

    var result = await client.FetchAsync(sku, ct);
    return result.Match(
        success => Results.Ok(success),
        notFound => Results.NotFound(),
        _ => Results.StatusCode(StatusCodes.Status503ServiceUnavailable));
});

app.Run();
```

## Sample Resilient Client
```csharp
public sealed record InventoryResponse(string Sku, int Quantity);

public class InventoryClient
{
    private static readonly OneOf<InventoryResponse, NotFound> NotFoundResult = new(new NotFound());
    private readonly HttpClient _httpClient;

    public InventoryClient(HttpClient httpClient) => _httpClient = httpClient;

    public async Task<OneOf<InventoryResponse, NotFound, Error>> FetchAsync(string sku, CancellationToken ct)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, $"/inventory/{sku}");
        request.Headers.Add("X-Correlation-ID", ct.GetHashCode().ToString());

        try
        {
            using var response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, ct);

            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return NotFoundResult;
            }

            response.EnsureSuccessStatusCode();

            await using var stream = await response.Content.ReadAsStreamAsync(ct);
            var payload = await JsonSerializer.DeserializeAsync<InventoryResponse>(stream, cancellationToken: ct);

            return payload ?? new Error("Empty response", retryable: false);
        }
        catch (OperationCanceledException) when (ct.IsCancellationRequested)
        {
            return new Error("Request canceled", retryable: true);
        }
        catch (HttpRequestException ex) when (ex.StatusCode is null or HttpStatusCode.TooManyRequests)
        {
            return new Error("Transient HTTP failure", retryable: true);
        }
        catch (Exception ex)
        {
            return new Error(ex.Message, retryable: false);
        }
    }
}

public sealed record Error(string Message, bool retryable);
public sealed record NotFound;
```

## Operational Best Practices
- **SLO-aware retries:** Align retry budgets with p99 latency targets; prefer 1–3 retries with jitter and a global timeout per request.
- **Fast-path success:** Keep happy-path allocations low; cache serializers and validators, pre-size collections, and avoid string formatting unless needed.
- **Fallbacks:** Serve from cache, return stale data with warnings, or downgrade features (e.g., no recommendations) when dependencies fail.
- **Load shedding:** Use request queues and concurrency limits; return `429`/`503` quickly when the system is saturated.
- **Chaos-ready:** Continuously inject faults (latency, timeouts, dependency outages) in staging to validate resilience policies.
- **Consistent surface area:** Map errors to stable codes and types so clients can automate handling and avoid brittle parsing.

## Sample Interview Q&A
- **Q:** When do you choose exceptions vs. result types?
  - **A:** Use exceptions for unexpected, rare failures (null reference, protocol violation). Use `Result`/`OneOf` for expected domain outcomes (validation errors, not found) to avoid control-flow via exceptions and keep the hot path allocation-free.
- **Q:** How do you keep retries from hurting availability?
  - **A:** Enforce timeouts, cap retry counts, add jitter to prevent thundering herds, and combine retries with circuit breakers and load shedding.
- **Q:** How do you propagate context for debugging?
  - **A:** Attach correlation IDs and tenant/region info to log scopes and problem-details responses; ensure trace context flows through HTTP/messaging clients.
- **Q:** What makes an error contract client-friendly?
  - **A:** Stable error codes, actionable messages, explicit `retryable` hints, and sample remediation steps so clients can automate retries or fallbacks.
- **Q:** How do you avoid exception cost in hot paths?
  - **A:** Prefer guard clauses and result types, pre-validate inputs, avoid throwing for predictable states, and use exception filters to keep catch blocks narrow.
- **Q:** When do you choose graceful degradation over hard failure?
  - **A:** If the dependency is non-critical or you can safely serve stale data, fall back to caches, simplified logic, or partial responses (e.g., show cached recommendations). For critical flows (payments, compliance), fail fast to prevent bad states. Always instrument fallbacks so you know when you’re degraded.
- **Q:** What’s your approach to cancellation and timeouts in async services?
  - **A:** Flow `CancellationToken` through all async APIs, set per-dependency timeouts (Polly `TimeoutPolicy` or `HttpClient` timeouts), and treat `OperationCanceledException` as a signal to stop work quickly. Combine with load shedding so saturated servers free threads instead of hanging.
- **Q:** How do you centralize error handling in ASP.NET Core?
  - **A:** Configure the exception handler middleware + `ProblemDetails` to translate unhandled exceptions into consistent payloads, add filters for domain exceptions, and wrap them with correlation IDs. This keeps controllers thin and ensures every failure path returns structured diagnostics.
- **Q:** How do you validate resilience policies before production?
  - **A:** Use integration tests and chaos drills that inject latency, drop connections, and spike errors while asserting on retry counts, circuit breaker transitions, and emitted metrics/logs. Automated fault injection ensures policies fire as expected and keeps runbooks current.
- **Q:** How do you enforce idempotency across retries or duplicate messages?
  - **A:** Include idempotency keys (request IDs, message IDs), use database upserts or stored procedure guards, and track processed messages in an inbox/outbox table. Consumers check for prior processing before mutating state so at-least-once delivery doesn’t double charge or double execute.
