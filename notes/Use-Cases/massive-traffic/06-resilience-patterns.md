# Resilience Patterns: Building Systems That Handle Failures Gracefully

## Why Resilience is Critical at Scale

**The Reality:**
- Networks fail
- Services go down
- Databases get slow
- Dependencies time out

**At scale, failures are not edge cases — they're guaranteed.**

**Key Principle:** Design for failure. Your system should degrade gracefully, not catastrophically.

---

## 1. Timeouts: The Foundation of Resilience

Never call external services without a timeout. A hanging request is worse than a failed request.

### ❌ Bad: No Timeout

```csharp
public class PaymentService
{
    private readonly HttpClient _httpClient;

    public async Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request)
    {
        // 🔥 No timeout = can hang forever
        var response = await _httpClient.PostAsJsonAsync(
            "https://payment-gateway/charge",
            request
        );

        return await response.Content.ReadFromJsonAsync<PaymentResult>();
    }
}
// Under load: all threads hang waiting for slow gateway → system dies
```

### ✅ Good: Always Set Timeouts

```csharp
public class PaymentService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<PaymentService> _logger;

    public PaymentService(HttpClient httpClient, ILogger<PaymentService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;

        // Set default timeout at HttpClient level
        _httpClient.Timeout = TimeSpan.FromSeconds(10);
    }

    public async Task<PaymentResult> ProcessPaymentAsync(
        PaymentRequest request,
        CancellationToken ct)
    {
        try
        {
            // Per-request timeout (overrides default)
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
            cts.CancelAfter(TimeSpan.FromSeconds(5));

            var response = await _httpClient.PostAsJsonAsync(
                "https://payment-gateway/charge",
                request,
                cts.Token
            );

            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<PaymentResult>(cts.Token);
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogWarning(ex, "Payment gateway timeout for request {RequestId}", request.Id);
            throw new PaymentTimeoutException("Payment processing timed out", ex);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Payment gateway error for request {RequestId}", request.Id);
            throw new PaymentFailedException("Payment gateway unavailable", ex);
        }
    }
}
```

### Database Timeouts

```csharp
public class OrderRepository
{
    private readonly IDbConnection _db;

    public async Task<Order> GetOrderAsync(int orderId, CancellationToken ct)
    {
        // Dapper: use CommandDefinition for timeout
        var command = new CommandDefinition(
            commandText: "SELECT * FROM Orders WHERE OrderId = @OrderId",
            parameters: new { OrderId = orderId },
            commandTimeout: 5, // 5 seconds
            cancellationToken: ct
        );

        return await _db.QueryFirstOrDefaultAsync<Order>(command);
    }
}

// EF Core: set timeout
public class AppDbContext : DbContext
{
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(
            connectionString,
            options => options.CommandTimeout(5) // 5 seconds
        );
    }
}
```

**Timeout Guidelines:**
- HTTP calls: 5-10 seconds
- Database queries: 3-5 seconds
- Third-party APIs: 10-30 seconds (depends on SLA)
- Internal microservices: 2-5 seconds

---

## 2. Circuit Breaker: Stop Hammering Failed Services

When a dependency fails, stop calling it temporarily to let it recover.

### The Pattern

```
Closed (normal) → failures exceed threshold → Open (reject immediately)
                ↓
Open → after timeout → Half-Open (try one request)
                ↓
Half-Open → success → Closed (resume normal)
Half-Open → failure → Open (back to rejecting)
```

### Using Polly Library

```csharp
// Install: Polly, Microsoft.Extensions.Http.Polly

// Program.cs
builder.Services.AddHttpClient<IInventoryService, InventoryService>(client =>
{
    client.BaseAddress = new Uri("https://inventory-api");
    client.Timeout = TimeSpan.FromSeconds(10);
})
.AddTransientHttpErrorPolicy(policyBuilder =>
    policyBuilder.CircuitBreakerAsync(
        handledEventsAllowedBeforeBreaking: 5, // Open after 5 failures
        durationOfBreak: TimeSpan.FromSeconds(30) // Stay open for 30 seconds
    )
)
.AddTransientHttpErrorPolicy(policyBuilder =>
    policyBuilder.WaitAndRetryAsync(new[]
    {
        TimeSpan.FromSeconds(1),
        TimeSpan.FromSeconds(2),
        TimeSpan.FromSeconds(4)
    })
);

// Service
public class InventoryService : IInventoryService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<InventoryService> _logger;

    // HttpClient already has circuit breaker from configuration
    public async Task<InventoryStatus> CheckInventoryAsync(
        int productId,
        CancellationToken ct)
    {
        try
        {
            var response = await _httpClient.GetAsync($"/api/inventory/{productId}", ct);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<InventoryStatus>(ct);
        }
        catch (BrokenCircuitException ex)
        {
            _logger.LogWarning(
                "Circuit breaker open for inventory service, product {ProductId}",
                productId
            );

            // Return fallback value
            return new InventoryStatus { Available = false, Reason = "Service unavailable" };
        }
    }
}
```

### Manual Circuit Breaker Implementation

```csharp
public class CircuitBreaker
{
    private readonly int _threshold;
    private readonly TimeSpan _timeout;
    private int _failureCount;
    private DateTime _lastFailureTime;
    private CircuitState _state = CircuitState.Closed;
    private readonly object _lock = new();

    public CircuitBreaker(int threshold, TimeSpan timeout)
    {
        _threshold = threshold;
        _timeout = timeout;
    }

    public async Task<T> ExecuteAsync<T>(Func<Task<T>> operation)
    {
        lock (_lock)
        {
            if (_state == CircuitState.Open)
            {
                if (DateTime.UtcNow - _lastFailureTime > _timeout)
                {
                    _state = CircuitState.HalfOpen;
                }
                else
                {
                    throw new CircuitBreakerOpenException("Circuit breaker is open");
                }
            }
        }

        try
        {
            var result = await operation();

            lock (_lock)
            {
                if (_state == CircuitState.HalfOpen)
                {
                    _state = CircuitState.Closed;
                    _failureCount = 0;
                }
            }

            return result;
        }
        catch (Exception)
        {
            lock (_lock)
            {
                _failureCount++;
                _lastFailureTime = DateTime.UtcNow;

                if (_failureCount >= _threshold)
                {
                    _state = CircuitState.Open;
                }
            }

            throw;
        }
    }
}

public enum CircuitState
{
    Closed,
    Open,
    HalfOpen
}

public class CircuitBreakerOpenException : Exception
{
    public CircuitBreakerOpenException(string message) : base(message) { }
}
```

---

## 3. Retry Policies: Handling Transient Failures

Retry transient failures (network glitches, temporary overload), but not permanent failures (404, 401).

### ✅ Good Retry Strategy

```csharp
builder.Services.AddHttpClient<IEmailService, EmailService>()
    .AddTransientHttpErrorPolicy(policyBuilder =>
        policyBuilder.WaitAndRetryAsync(
            retryCount: 3,
            sleepDurationProvider: retryAttempt =>
                TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)), // Exponential backoff: 2s, 4s, 8s
            onRetry: (outcome, timespan, retryAttempt, context) =>
            {
                var logger = context.GetLogger();
                logger?.LogWarning(
                    "Retry {RetryAttempt} after {Delay}s due to {Exception}",
                    retryAttempt,
                    timespan.TotalSeconds,
                    outcome.Exception?.Message
                );
            }
        )
    );
```

### Advanced: Retry with Jitter

```csharp
public static class RetryPolicies
{
    private static readonly Random _jitterer = new();

    public static IAsyncPolicy<HttpResponseMessage> GetRetryPolicyWithJitter()
    {
        return Policy
            .HandleResult<HttpResponseMessage>(r =>
                (int)r.StatusCode >= 500 || r.StatusCode == System.Net.HttpStatusCode.RequestTimeout)
            .Or<HttpRequestException>()
            .Or<TaskCanceledException>()
            .WaitAndRetryAsync(
                retryCount: 3,
                sleepDurationProvider: retryAttempt =>
                {
                    // Exponential backoff with jitter
                    var exponentialDelay = TimeSpan.FromSeconds(Math.Pow(2, retryAttempt));
                    var jitter = TimeSpan.FromMilliseconds(_jitterer.Next(0, 1000));
                    return exponentialDelay + jitter;
                },
                onRetry: (outcome, timespan, retryAttempt, context) =>
                {
                    Console.WriteLine($"Retry {retryAttempt} after {timespan.TotalSeconds:F2}s");
                }
            );
    }
}
```

**Why jitter?** Prevents thundering herd (all clients retrying at exactly the same time).

### Database Retries (EF Core)

```csharp
public class AppDbContext : DbContext
{
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(
            connectionString,
            options => options.EnableRetryOnFailure(
                maxRetryCount: 3,
                maxRetryDelay: TimeSpan.FromSeconds(5),
                errorNumbersToAdd: null
            )
        );
    }
}
```

### Retry Guidelines

**DO retry:**
- Network timeouts (TCP)
- HTTP 5xx errors (server errors)
- HTTP 429 (rate limit) with exponential backoff
- Transient database errors (deadlocks, connection issues)

**DON'T retry:**
- HTTP 4xx errors (client errors: 400, 401, 403, 404)
- Business logic failures
- Validation errors
- Non-idempotent operations (unless using idempotency keys)

---

## 4. Bulkhead Pattern: Isolate Failures

Don't let one failing dependency exhaust all resources.

### Thread Pool Bulkheads

```csharp
public class BulkheadService
{
    private readonly SemaphoreSlim _paymentSemaphore = new(20, 20); // 20 concurrent payments
    private readonly SemaphoreSlim _emailSemaphore = new(50, 50);   // 50 concurrent emails

    public async Task<PaymentResult> ProcessPaymentAsync(
        PaymentRequest request,
        CancellationToken ct)
    {
        if (!await _paymentSemaphore.WaitAsync(TimeSpan.FromMilliseconds(100), ct))
        {
            throw new BulkheadRejectedException("Payment bulkhead full");
        }

        try
        {
            return await CallPaymentGatewayAsync(request, ct);
        }
        finally
        {
            _paymentSemaphore.Release();
        }
    }

    public async Task SendEmailAsync(EmailMessage message, CancellationToken ct)
    {
        if (!await _emailSemaphore.WaitAsync(TimeSpan.FromMilliseconds(100), ct))
        {
            throw new BulkheadRejectedException("Email bulkhead full");
        }

        try
        {
            await CallEmailServiceAsync(message, ct);
        }
        finally
        {
            _emailSemaphore.Release();
        }
    }
}
```

**Why bulkheads?** If payment gateway is slow/down, it won't prevent emails from being sent. Failures are isolated.

### Polly Bulkhead

```csharp
var bulkheadPolicy = Policy.BulkheadAsync<HttpResponseMessage>(
    maxParallelization: 20,
    maxQueuingActions: 10,
    onBulkheadRejectedAsync: context =>
    {
        Console.WriteLine("Bulkhead rejected request");
        return Task.CompletedTask;
    }
);

// Combine with retry and circuit breaker
var resilientPolicy = Policy.WrapAsync(
    bulkheadPolicy,
    circuitBreakerPolicy,
    retryPolicy
);

var result = await resilientPolicy.ExecuteAsync(() =>
    _httpClient.GetAsync("https://api.example.com/data")
);
```

---

## 5. Fallback: Graceful Degradation

When a dependency fails, serve degraded functionality instead of crashing.

### Fallback Examples

```csharp
public class RecommendationService
{
    private readonly HttpClient _httpClient;
    private readonly ICache _cache;
    private readonly ILogger<RecommendationService> _logger;

    public async Task<List<Product>> GetRecommendationsAsync(
        int userId,
        CancellationToken ct)
    {
        try
        {
            // Try ML-based recommendations
            var response = await _httpClient.GetAsync($"/recommendations/{userId}", ct);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<List<Product>>(ct);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Recommendation service failed, using fallback");

            // Fallback 1: Cached recommendations
            var cached = await _cache.GetAsync<List<Product>>($"recommendations:{userId}", ct);
            if (cached != null)
            {
                _logger.LogInformation("Returning cached recommendations for user {UserId}", userId);
                return cached;
            }

            // Fallback 2: Popular products (global)
            _logger.LogInformation("Returning popular products for user {UserId}", userId);
            return await GetPopularProductsAsync(ct);
        }
    }

    private async Task<List<Product>> GetPopularProductsAsync(CancellationToken ct)
    {
        // Simple fallback: top 10 popular products
        return new List<Product>
        {
            // Static or from simple DB query
        };
    }
}
```

### Polly Fallback Policy

```csharp
var fallbackPolicy = Policy<List<Product>>
    .Handle<Exception>()
    .FallbackAsync(
        fallbackValue: new List<Product>(), // Empty list
        onFallbackAsync: async (outcome, context) =>
        {
            var logger = context.GetLogger();
            logger?.LogWarning("Fallback triggered: {Exception}", outcome.Exception?.Message);
            await Task.CompletedTask;
        }
    );

var recommendations = await fallbackPolicy.ExecuteAsync(async () =>
{
    var response = await _httpClient.GetAsync($"/recommendations/{userId}");
    response.EnsureSuccessStatusCode();
    return await response.Content.ReadFromJsonAsync<List<Product>>();
});
```

---

## 6. Health Checks: Monitor Dependency Health

Expose health check endpoints for load balancers and monitoring.

```csharp
// Program.cs
builder.Services.AddHealthChecks()
    .AddCheck("self", () => HealthCheckResult.Healthy())
    .AddSqlServer(
        connectionString: builder.Configuration.GetConnectionString("DefaultConnection")!,
        name: "database",
        timeout: TimeSpan.FromSeconds(5)
    )
    .AddRedis(
        redisConnectionString: builder.Configuration.GetConnectionString("Redis")!,
        name: "redis",
        timeout: TimeSpan.FromSeconds(5)
    )
    .AddUrlGroup(
        new Uri("https://inventory-api/health"),
        name: "inventory-service",
        timeout: TimeSpan.FromSeconds(5)
    );

var app = builder.Build();

// Basic health check
app.MapHealthChecks("/health");

// Detailed health check (for monitoring)
app.MapHealthChecks("/health/detailed", new HealthCheckOptions
{
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";

        var result = new
        {
            status = report.Status.ToString(),
            checks = report.Entries.Select(e => new
            {
                name = e.Key,
                status = e.Value.Status.ToString(),
                duration = e.Value.Duration.TotalMilliseconds,
                exception = e.Value.Exception?.Message,
                data = e.Value.Data
            }),
            totalDuration = report.TotalDuration.TotalMilliseconds
        };

        await context.Response.WriteAsJsonAsync(result);
    }
});
```

### Custom Health Check

```csharp
public class MessageQueueHealthCheck : IHealthCheck
{
    private readonly IRabbitMQConnection _rabbitConnection;

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken ct = default)
    {
        try
        {
            var connection = _rabbitConnection.GetConnection();

            if (!connection.IsOpen)
            {
                return HealthCheckResult.Unhealthy("RabbitMQ connection is closed");
            }

            using var channel = connection.CreateModel();
            // Check if we can declare a queue (lightweight operation)
            channel.QueueDeclarePassive("health-check");

            return HealthCheckResult.Healthy("RabbitMQ is reachable");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("RabbitMQ is unreachable", ex);
        }
    }
}
```

---

## 7. Combining Resilience Patterns (The Full Stack)

```csharp
// Program.cs - Production-ready HTTP client configuration
builder.Services.AddHttpClient<IPaymentService, PaymentService>(client =>
{
    client.BaseAddress = new Uri("https://payment-gateway");
    client.Timeout = TimeSpan.FromSeconds(10);
})
.AddPolicyHandler((services, request) =>
{
    // Combine multiple policies
    var retryPolicy = Policy
        .HandleResult<HttpResponseMessage>(r => !r.IsSuccessStatusCode)
        .Or<HttpRequestException>()
        .WaitAndRetryAsync(
            retryCount: 3,
            sleepDurationProvider: retryAttempt =>
                TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)) +
                TimeSpan.FromMilliseconds(Random.Shared.Next(0, 1000)) // Jitter
        );

    var circuitBreakerPolicy = Policy
        .HandleResult<HttpResponseMessage>(r => !r.IsSuccessStatusCode)
        .Or<HttpRequestException>()
        .CircuitBreakerAsync(
            handledEventsAllowedBeforeBreaking: 5,
            durationOfBreak: TimeSpan.FromSeconds(30)
        );

    var bulkheadPolicy = Policy.BulkheadAsync<HttpResponseMessage>(
        maxParallelization: 20,
        maxQueuingActions: 10
    );

    var timeoutPolicy = Policy.TimeoutAsync<HttpResponseMessage>(
        TimeSpan.FromSeconds(5)
    );

    // Order matters: timeout → retry → circuit breaker → bulkhead
    return Policy.WrapAsync(timeoutPolicy, retryPolicy, circuitBreakerPolicy, bulkheadPolicy);
});
```

---

## Summary: Resilience Checklist

✅ **Timeouts on all I/O**: HTTP, database, cache, queues
✅ **Circuit breakers**: For external dependencies
✅ **Retry policies**: Exponential backoff with jitter for transient failures
✅ **Bulkheads**: Isolate resource pools per dependency
✅ **Fallbacks**: Graceful degradation with cached/default data
✅ **Health checks**: For load balancer and monitoring
✅ **Combine patterns**: Timeout + retry + circuit breaker + bulkhead

**Key Insight:** At scale, failures happen constantly. Resilience patterns ensure one failing service doesn't cascade and bring down your entire system.

**Next:** [Observability & Monitoring](./07-observability.md) - You can't fix what you can't see.
