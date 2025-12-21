# Logging - Practice Exercises

Practice structured logging for production-grade .NET services.

---

## Foundations

### Exercise 1: Structured Logging Basics
**Q:** Log a trade event using structured logging.

A:
```csharp
_logger.LogInformation("Trade executed {TradeId} {Symbol} {Quantity}", trade.Id, trade.Symbol, trade.Quantity);
```

---

### Exercise 2: Log Levels
**Q:** When do you use Debug vs Information vs Warning?

A: Debug for developer diagnostics, Information for normal business events, Warning for unusual but handled conditions.

---

### Exercise 3: Correlation IDs
**Q:** Attach a correlation ID to all logs in a request.

A: Use middleware to set a scope with the correlation ID.

---

### Exercise 4: Log Scopes
**Q:** Use `BeginScope` to include request context.

A:
```csharp
using (_logger.BeginScope(new Dictionary<string, object> { ["CorrelationId"] = cid }))
{
    _logger.LogInformation("Processing request");
}
```

---

### Exercise 5: Avoid Logging PII
**Q:** Identify PII and prevent it from being logged.

A: Redact names, emails, tokens, and account numbers; log hashes or partial values.

---

### Exercise 6: Request Logging Middleware
**Q:** Log incoming requests with path, method, and latency.

A: Use middleware to time and log the request before and after the next delegate.

---

### Exercise 7: Exception Logging
**Q:** Log an exception with relevant context.

A:
```csharp
_logger.LogError(ex, "Order {OrderId} failed for {Symbol}", orderId, symbol);
```

---

### Exercise 8: Message Templates
**Q:** Why should you avoid string interpolation in log messages?

A: Templates allow structured fields and defer formatting until needed.

---

### Exercise 9: ILogger<T> Injection
**Q:** Inject and use a typed logger in a handler.

A:
```csharp
public class PlaceOrderHandler
{
    private readonly ILogger<PlaceOrderHandler> _logger;
}
```

---

### Exercise 10: Configure Providers
**Q:** Configure console and JSON logging in ASP.NET Core.

A: Use `AddConsole()` and a JSON formatter or Serilog for structured sinks.

---

## Intermediate

### Exercise 11: Serilog File Sink
**Q:** Configure Serilog to write JSON logs to a file.

A:
```csharp
Log.Logger = new LoggerConfiguration()
    .WriteTo.File(new JsonFormatter(), "logs/app.json")
    .CreateLogger();
```

---

### Exercise 12: Enrichers
**Q:** Add machine name and environment to each log.

A: Use Serilog enrichers or custom scope properties.

---

### Exercise 13: Sampling
**Q:** Reduce log volume for high-frequency debug events.

A: Apply sampling filters or log only every Nth event.

---

### Exercise 14: Aggregation Pipelines
**Q:** Why send logs to a centralized system?

A: Centralized logs enable search, correlation, and retention policies across services.

---

### Exercise 15: Distributed Tracing Context
**Q:** Include trace/span IDs in logs.

A: Enrich logs with `Activity.Current.TraceId` and `SpanId`.

---

### Exercise 16: EventId Usage
**Q:** Use `EventId` for stable log classification.

A:
```csharp
_logger.LogWarning(new EventId(2001, "RiskLimit"), "Risk limit reached");
```

---

### Exercise 17: Avoid Expensive Formatting
**Q:** Log only when level is enabled.

A:
```csharp
if (_logger.IsEnabled(LogLevel.Debug))
    _logger.LogDebug("Payload: {Payload}", Serialize(payload));
```

---

### Exercise 18: HTTP Body Logging
**Q:** When is it safe to log request/response bodies?

A: Only for non-sensitive data and in non-production or sampled paths.

---

### Exercise 19: Background Service Logging
**Q:** Add structured logs around a scheduled job.

A: Log job start, duration, and items processed with metrics-like fields.

---

### Exercise 20: Domain Event Logging
**Q:** Log domain events without leaking internal state.

A: Log identifiers and summaries, not full objects or secrets.

---

## Advanced

### Exercise 21: Correlation Across Queues
**Q:** Propagate correlation IDs across message queues.

A: Include correlation ID in message headers and restore it into logging scopes.

---

### Exercise 22: Redaction and Masking
**Q:** Implement masking for account numbers.

A:
```csharp
string Mask(string value) => value.Length <= 4 ? "****" : $"****{value[^4..]}";
```

---

### Exercise 23: Logs vs Metrics
**Q:** When should you emit a metric instead of a log?

A: Use metrics for high-frequency counters and latency percentiles.

---

### Exercise 24: Logging Failures
**Q:** What happens if a logging sink fails?

A: Use async/buffered sinks and avoid crashing the app on logging errors.

---

### Exercise 25: High-Throughput Logging
**Q:** How do you minimize logging overhead in hot paths?

A: Use minimal log levels, sampling, and avoid allocations in message construction.

---

### Exercise 26: Retention Policies
**Q:** Define a retention strategy for logs.

A: Retain high-value audit logs longer and rotate verbose logs faster.

---

### Exercise 27: Compliance Considerations
**Q:** What logging considerations exist for regulated domains?

A: PII redaction, audit trails, tamper resistance, and controlled access.

---

### Exercise 28: OpenTelemetry Logging
**Q:** Export logs using OpenTelemetry.

A: Configure OTel logging provider and export to your collector.

---

### Exercise 29: Testing Logs
**Q:** Assert that a handler writes a warning log.

A: Use a test logger or capture logs via `ILoggerProvider`.

---

### Exercise 30: Log Schema Design
**Q:** Define common fields for log consistency.

A: Use fields like `correlation_id`, `service`, `environment`, `event`, and `duration_ms`.
