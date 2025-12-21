# Error Handling - Practice Exercises

Exercises focused on robust error handling for high-throughput .NET services.

---

## Foundations

### Exercise 1: Exceptions vs Result Types
**Q:** When do you use exceptions instead of a `Result<T>` type?

A: Use exceptions for unexpected, exceptional conditions (null reference, infrastructure failures). Use `Result<T>` for expected domain outcomes (validation, not found) to keep the hot path allocation-light.

---

### Exercise 2: Custom Exception Type
**Q:** Create a custom `BadRequestException` that carries validation errors.

A:
```csharp
public class BadRequestException : Exception
{
    public IReadOnlyList<string> Errors { get; }

    public BadRequestException(string message, IReadOnlyList<string> errors)
        : base(message)
    {
        Errors = errors;
    }
}
```

---

### Exercise 3: Try/Catch/Finally
**Q:** Ensure a file handle is always released even when parsing fails.

A:
```csharp
try
{
    using var reader = File.OpenText(path);
    return Parse(reader.ReadToEnd());
}
catch (FormatException ex)
{
    throw new BadRequestException("Invalid file format", new[] { ex.Message });
}
```

---

### Exercise 4: Guard Clauses
**Q:** Add guard clauses to fail fast on invalid input.

A:
```csharp
if (string.IsNullOrWhiteSpace(symbol))
    throw new ArgumentException("Symbol is required", nameof(symbol));
```

---

### Exercise 5: Rethrow Correctly
**Q:** Preserve stack trace when rethrowing.

A:
```csharp
catch (Exception)
{
    throw; // preserves original stack
}
```

---

### Exercise 6: Exception Filters
**Q:** Use an exception filter to handle only timeout exceptions.

A:
```csharp
catch (HttpRequestException ex) when (ex.InnerException is TimeoutException)
{
    // handle timeout
}
```

---

### Exercise 7: Using Statements
**Q:** Ensure `IDisposable` resources are always released.

A:
```csharp
using var stream = File.OpenRead(path);
```

---

### Exercise 8: Global Exception Middleware
**Q:** Implement middleware that catches exceptions and returns a JSON response.

A: Register a custom middleware early in the pipeline and map to `ProblemDetails`.

---

### Exercise 9: Map Exceptions to HTTP Status
**Q:** Map `NotFoundException` to 404 and `BadRequestException` to 400.

A: Translate exceptions at the API boundary with a single centralized handler.

---

### Exercise 10: Avoid Catch-All
**Q:** Why should you avoid `catch (Exception ex)` in business logic?

A: Catching everything hides failures, makes retries harder, and can mask bugs; catch only what you can handle.

---

## Intermediate

### Exercise 11: Retry Policy
**Q:** Add a Polly retry policy for transient HTTP errors.

A:
```csharp
var policy = Policy
    .Handle<HttpRequestException>()
    .OrResult<HttpResponseMessage>(r => (int)r.StatusCode >= 500)
    .WaitAndRetryAsync(3, i => TimeSpan.FromMilliseconds(200 * i));
```

---

### Exercise 12: Circuit Breaker
**Q:** Configure a circuit breaker for a flaky dependency.

A:
```csharp
var breaker = Policy
    .Handle<Exception>()
    .CircuitBreakerAsync(5, TimeSpan.FromSeconds(30));
```

---

### Exercise 13: Timeout Policy
**Q:** Add a timeout policy for slow calls.

A:
```csharp
var timeout = Policy.TimeoutAsync(TimeSpan.FromSeconds(2));
```

---

### Exercise 14: Bulkhead Isolation
**Q:** Limit concurrent calls to a dependency.

A:
```csharp
var bulkhead = Policy.BulkheadAsync(20, int.MaxValue);
```

---

### Exercise 15: Fallback Strategy
**Q:** Return cached data when an API call fails.

A:
```csharp
var fallback = Policy<PriceQuote>
    .Handle<Exception>()
    .FallbackAsync(_ => cache.GetLastQuoteAsync(symbol));
```

---

### Exercise 16: Idempotency Keys
**Q:** How do idempotency keys reduce error handling complexity?

A: They make retries safe by ensuring duplicate requests do not duplicate side effects.

---

### Exercise 17: Log with Context
**Q:** Include key identifiers when logging exceptions.

A:
```csharp
_logger.LogError(ex, "Failed to place order {OrderId} for {Symbol}", orderId, symbol);
```

---

### Exercise 18: ProblemDetails Response
**Q:** Return RFC7807 error details for API failures.

A: Use `ProblemDetails` with type, title, status, and correlation ID.

---

### Exercise 19: Result<T> Pattern
**Q:** Implement a simple `Result<T>` type for validation failures.

A:
```csharp
public record Result<T>(bool IsSuccess, T? Value, string? Error);
```

---

### Exercise 20: Aggregate Validation Errors
**Q:** Collect all validation errors instead of failing fast.

A: Use FluentValidation and return all error messages in a single response.

---

### Exercise 21: Task.WhenAll Exception Handling
**Q:** Handle exceptions when running multiple tasks.

A:
```csharp
try
{
    await Task.WhenAll(tasks);
}
catch
{
    var errors = tasks.Where(t => t.IsFaulted).Select(t => t.Exception);
    throw;
}
```

---

### Exercise 22: Cancellation vs Timeout
**Q:** Differentiate a user cancellation from a timeout.

A: Use distinct exception types and log them separately to avoid misclassifying failures.

---

## Advanced

### Exercise 23: Background Service Failures
**Q:** Prevent a hosted service from crashing on a single failure.

A: Wrap the loop in try/catch, log, and continue with backoff.

---

### Exercise 24: EF Core Transient Failures
**Q:** Enable SQL retry policies for EF Core.

A:
```csharp
options.UseSqlServer(conn, o => o.EnableRetryOnFailure());
```

---

### Exercise 25: MediatR Error Pipeline
**Q:** Convert exceptions to `Result<T>` in a pipeline behavior.

A: Wrap `next()` in try/catch and map known exceptions to error results.

---

### Exercise 26: Exception Hierarchy
**Q:** Define an exception hierarchy for domain and application layers.

A: `DomainException` (Domain), `ValidationException` (Application), `InfrastructureException` (Infrastructure).

---

### Exercise 27: Error Codes
**Q:** Return stable error codes for client handling.

A: Map exceptions to codes like `ORDER_NOT_FOUND` and include them in responses.

---

### Exercise 28: Preserve Stack Trace
**Q:** Re-throw an exception while preserving stack trace across boundaries.

A:
```csharp
ExceptionDispatchInfo.Capture(ex).Throw();
```

---

### Exercise 29: Partial Failure Handling
**Q:** Process a batch where some items fail.

A: Return per-item results and avoid failing the entire batch unless required.

---

### Exercise 30: Outbox Error Handling
**Q:** How should you handle publish failures in an outbox processor?

A: Retry with exponential backoff and leave the outbox record until success.

---

## Scenarios

### Exercise 31: Price Feed Failure
**Q:** A price feed is down during order placement. What do you do?

A: Circuit break the feed, return a clear error, and optionally fall back to last known price with an expiry.

---

### Exercise 32: Market Data Ingestion
**Q:** How do you handle poison messages in a market data queue?

A: Send to a dead-letter queue and alert; do not block the pipeline.

---

### Exercise 33: Graceful Degradation
**Q:** How do you degrade a quote API during partial outages?

A: Serve cached quotes with a stale flag and shorten TTLs until dependencies recover.

---

### Exercise 34: Timeouts at Multiple Layers
**Q:** Coordinate timeouts across API, downstream HTTP, and database.

A: Use shorter timeouts downstream than upstream and pass a single cancellation token.

---

### Exercise 35: Post-Incident Checklist
**Q:** List key items for an error-handling postmortem.

A: Root cause, blast radius, detection gap, recovery time, remediation tasks, and tests to prevent recurrence.
