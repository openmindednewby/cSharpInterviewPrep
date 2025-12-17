# Backpressure & Rate Limiting: Protecting Your System Under Load

## Why You MUST Have Backpressure

**The Problem:** When traffic spikes, accepting every request leads to:
- Queue explosion (memory exhaustion)
- Database connection pool exhaustion
- Cascading failures to downstream services
- Increased latency for ALL users (death spiral)

**The Solution:** Reject requests early when you're at capacity. Better to serve 10,000 requests fast with 1,000 rejections than have all 11,000 requests time out.

**Key Principle:** Fail fast, fail explicitly, preserve capacity for requests you can handle.

---

## 1. ASP.NET Core Built-in Rate Limiting (.NET 7+)

The framework includes rate limiting middleware. Use it.

### Basic Setup

```csharp
// Program.cs
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRateLimiter(options =>
{
    // Fixed window: X requests per time window
    options.AddFixedWindowLimiter("fixed", opt =>
    {
        opt.PermitLimit = 100;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 10; // How many can queue waiting for a slot
    });

    // Sliding window: Smoother than fixed (prevents reset spike)
    options.AddSlidingWindowLimiter("sliding", opt =>
    {
        opt.PermitLimit = 100;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.SegmentsPerWindow = 6; // 6 segments of 10 seconds each
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 0; // Reject immediately when full
    });

    // Token bucket: Allows bursts
    options.AddTokenBucketLimiter("token", opt =>
    {
        opt.TokenLimit = 100;
        opt.ReplenishmentPeriod = TimeSpan.FromMinutes(1);
        opt.TokensPerPeriod = 100;
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 0;
    });

    // Concurrency limiter: Max simultaneous requests
    options.AddConcurrencyLimiter("concurrent", opt =>
    {
        opt.PermitLimit = 50; // Only 50 requests executing at once
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 25; // 25 more can wait
    });

    // Default rejection response
    options.OnRejected = async (context, ct) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;

        if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
        {
            context.HttpContext.Response.Headers.RetryAfter = retryAfter.TotalSeconds.ToString();
        }

        await context.HttpContext.Response.WriteAsJsonAsync(new
        {
            error = "Too many requests. Please retry later.",
            retryAfter = retryAfter?.TotalSeconds
        }, cancellationToken: ct);
    };
});

var app = builder.Build();

// Apply globally
app.UseRateLimiter();

app.MapControllers();
app.Run();
```

### Apply to Specific Endpoints

```csharp
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    // High-traffic endpoint: strict limit
    [HttpPost]
    [EnableRateLimiting("sliding")]
    public async Task<IActionResult> CreateOrderAsync(
        CreateOrderRequest request,
        CancellationToken ct)
    {
        // Process order
        return Ok();
    }

    // Read endpoint: more lenient
    [HttpGet("{id}")]
    [EnableRateLimiting("token")]
    public async Task<IActionResult> GetOrderAsync(int id, CancellationToken ct)
    {
        // Fetch order
        return Ok();
    }

    // Expensive report: concurrency limit
    [HttpGet("reports/{id}")]
    [EnableRateLimiting("concurrent")]
    public async Task<IActionResult> GetReportAsync(int id, CancellationToken ct)
    {
        // Generate report (expensive)
        return Ok();
    }
}
```

---

## 2. Per-User/Per-IP Rate Limiting

Prevent a single user from monopolizing resources.

```csharp
// Custom partition key resolver
builder.Services.AddRateLimiter(options =>
{
    options.AddSlidingWindowLimiter("per-user", opt =>
    {
        opt.PermitLimit = 10;
        opt.Window = TimeSpan.FromSeconds(10);
        opt.SegmentsPerWindow = 2;
        opt.QueueLimit = 0;
    }).AddPolicy("per-user-policy", context =>
    {
        // Get user ID from claims or API key
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                     ?? context.Request.Headers["X-API-Key"].ToString()
                     ?? context.Connection.RemoteIpAddress?.ToString()
                     ?? "anonymous";

        return RateLimitPartition.GetSlidingWindowLimiter(userId, _ => new SlidingWindowRateLimiterOptions
        {
            PermitLimit = 100,
            Window = TimeSpan.FromMinutes(1),
            SegmentsPerWindow = 6,
            QueueLimit = 0
        });
    });
});

// Apply to controller
[EnableRateLimiting("per-user-policy")]
[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    // Each user gets their own 100 req/min limit
}
```

**Why this matters:**
- One abusive user doesn't affect others
- Prevents scraping/abuse
- Fair resource distribution

---

## 3. Concurrency Limiter (Semaphore Pattern)

When rate limiting by time isn't enough (e.g., expensive operations), limit **how many run simultaneously**.

### Manual Semaphore Implementation

```csharp
public interface IExpensiveService
{
    Task<ReportData> GenerateReportAsync(int userId, CancellationToken ct);
}

public class ExpensiveReportService : IExpensiveService
{
    private readonly SemaphoreSlim _concurrencyLimit;
    private readonly IDbConnection _db;
    private readonly ILogger<ExpensiveReportService> _logger;

    public ExpensiveReportService(
        IDbConnection db,
        ILogger<ExpensiveReportService> logger)
    {
        _db = db;
        _logger = logger;

        // Only 20 reports generating at once
        // Tune based on: CPU cores, memory, DB connection pool size
        _concurrencyLimit = new SemaphoreSlim(
            initialCount: 20,
            maxCount: 20
        );
    }

    public async Task<ReportData> GenerateReportAsync(
        int userId,
        CancellationToken ct)
    {
        // Try to acquire a slot, wait max 2 seconds
        var acquired = await _concurrencyLimit.WaitAsync(
            TimeSpan.FromSeconds(2),
            ct
        );

        if (!acquired)
        {
            _logger.LogWarning(
                "Report generation rejected for user {UserId} - concurrency limit reached",
                userId
            );
            throw new TooManyRequestsException(
                "System is under heavy load. Please retry in a moment."
            );
        }

        try
        {
            _logger.LogInformation(
                "Starting report generation for user {UserId}. Current concurrency: {Current}/{Max}",
                userId,
                20 - _concurrencyLimit.CurrentCount,
                20
            );

            // Expensive work here
            var data = await _db.QueryAsync<ReportData>(
                "EXEC GenerateUserReport @UserId",
                new { UserId = userId }
            );

            // Simulate heavy processing
            await ProcessDataAsync(data, ct);

            return new ReportData { /* ... */ };
        }
        finally
        {
            _concurrencyLimit.Release();

            _logger.LogInformation(
                "Completed report for user {UserId}. Current concurrency: {Current}/{Max}",
                userId,
                20 - _concurrencyLimit.CurrentCount,
                20
            );
        }
    }

    private async Task ProcessDataAsync(
        IEnumerable<ReportData> data,
        CancellationToken ct)
    {
        foreach (var item in data)
        {
            ct.ThrowIfCancellationRequested();
            // Heavy CPU work
            await Task.Delay(50, ct);
        }
    }
}

public class TooManyRequestsException : Exception
{
    public TooManyRequestsException(string message) : base(message) { }
}
```

### Middleware for Global Concurrency Limit

```csharp
public class ConcurrencyLimitMiddleware
{
    private readonly RequestDelegate _next;
    private readonly SemaphoreSlim _semaphore;
    private readonly ILogger<ConcurrencyLimitMiddleware> _logger;

    public ConcurrencyLimitMiddleware(
        RequestDelegate next,
        ILogger<ConcurrencyLimitMiddleware> logger,
        int maxConcurrency = 1000)
    {
        _next = next;
        _logger = logger;
        _semaphore = new SemaphoreSlim(maxConcurrency, maxConcurrency);
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var acquired = await _semaphore.WaitAsync(TimeSpan.FromMilliseconds(100));

        if (!acquired)
        {
            _logger.LogWarning(
                "Request rejected - global concurrency limit reached. Path: {Path}",
                context.Request.Path
            );

            context.Response.StatusCode = StatusCodes.Status503ServiceUnavailable;
            context.Response.Headers.RetryAfter = "5";

            await context.Response.WriteAsJsonAsync(new
            {
                error = "Service temporarily overloaded. Please retry.",
                retryAfter = 5
            });

            return;
        }

        try
        {
            await _next(context);
        }
        finally
        {
            _semaphore.Release();
        }
    }
}

// Register in Program.cs
app.UseMiddleware<ConcurrencyLimitMiddleware>(maxConcurrency: 2000);
```

**When to use:**
- CPU-intensive endpoints (reports, image processing)
- Memory-intensive operations
- Expensive database queries
- Calls to rate-limited external APIs

---

## 4. Bounded Queues for Background Work

Don't let background job queues grow unbounded.

```csharp
public interface IBackgroundJobQueue
{
    ValueTask<bool> QueueAsync(Func<CancellationToken, Task> workItem, CancellationToken ct);
    ValueTask<Func<CancellationToken, Task>?> DequeueAsync(CancellationToken ct);
}

public class BoundedBackgroundJobQueue : IBackgroundJobQueue
{
    private readonly Channel<Func<CancellationToken, Task>> _queue;
    private readonly ILogger<BoundedBackgroundJobQueue> _logger;

    public BoundedBackgroundJobQueue(
        int capacity,
        ILogger<BoundedBackgroundJobQueue> logger)
    {
        _logger = logger;

        // Bounded channel: reject writes when full
        var options = new BoundedChannelOptions(capacity)
        {
            FullMode = BoundedChannelFullMode.DropWrite // Or DropOldest, Wait
        };

        _queue = Channel.CreateBounded<Func<CancellationToken, Task>>(options);
    }

    public async ValueTask<bool> QueueAsync(
        Func<CancellationToken, Task> workItem,
        CancellationToken ct)
    {
        var queued = await _queue.Writer.WaitToWriteAsync(ct);

        if (!queued)
        {
            _logger.LogWarning("Background queue is full - job rejected");
            return false;
        }

        if (!_queue.Writer.TryWrite(workItem))
        {
            _logger.LogWarning("Failed to write to background queue");
            return false;
        }

        return true;
    }

    public async ValueTask<Func<CancellationToken, Task>?> DequeueAsync(
        CancellationToken ct)
    {
        var workItem = await _queue.Reader.ReadAsync(ct);
        return workItem;
    }
}

// Background service processing the queue
public class BackgroundJobProcessor : BackgroundService
{
    private readonly IBackgroundJobQueue _queue;
    private readonly ILogger<BackgroundJobProcessor> _logger;

    public BackgroundJobProcessor(
        IBackgroundJobQueue queue,
        ILogger<BackgroundJobProcessor> logger)
    {
        _queue = queue;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Background job processor started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var workItem = await _queue.DequeueAsync(stoppingToken);

                if (workItem != null)
                {
                    await workItem(stoppingToken);
                }
            }
            catch (OperationCanceledException)
            {
                // Expected on shutdown
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing background job");
            }
        }

        _logger.LogInformation("Background job processor stopped");
    }
}

// Usage in controller
[ApiController]
[Route("api/[controller]")]
public class NotificationController : ControllerBase
{
    private readonly IBackgroundJobQueue _jobQueue;

    [HttpPost("send")]
    public async Task<IActionResult> SendNotificationAsync(
        NotificationRequest request,
        CancellationToken ct)
    {
        var queued = await _jobQueue.QueueAsync(async token =>
        {
            // Expensive work: send email, SMS, push notification
            await SendEmailAsync(request.Email, token);
            await SendSmsAsync(request.Phone, token);
        }, ct);

        if (!queued)
        {
            return StatusCode(
                StatusCodes.Status503ServiceUnavailable,
                "System is overloaded. Please retry later."
            );
        }

        return Accepted(new { message = "Notification queued for processing" });
    }

    private Task SendEmailAsync(string email, CancellationToken ct)
    {
        // Implementation
        return Task.CompletedTask;
    }

    private Task SendSmsAsync(string phone, CancellationToken ct)
    {
        // Implementation
        return Task.CompletedTask;
    }
}

// Registration
builder.Services.AddSingleton<IBackgroundJobQueue>(
    sp => new BoundedBackgroundJobQueue(
        capacity: 10000, // Tune based on memory
        sp.GetRequiredService<ILogger<BoundedBackgroundJobQueue>>()
    )
);
builder.Services.AddHostedService<BackgroundJobProcessor>();
```

**Why bounded queues:**
- Prevents memory exhaustion
- Fails fast when overloaded
- Forces clients to retry (with backoff)
- Preserves system stability

---

## 5. Distributed Rate Limiting with Redis

For multi-instance deployments, use Redis for shared rate limit state.

```csharp
public interface IDistributedRateLimiter
{
    Task<bool> AllowRequestAsync(string key, int limit, TimeSpan window, CancellationToken ct);
}

public class RedisRateLimiter : IDistributedRateLimiter
{
    private readonly IDatabase _redis;
    private readonly ILogger<RedisRateLimiter> _logger;

    public RedisRateLimiter(
        IConnectionMultiplexer redis,
        ILogger<RedisRateLimiter> logger)
    {
        _redis = redis.GetDatabase();
        _logger = logger;
    }

    public async Task<bool> AllowRequestAsync(
        string key,
        int limit,
        TimeSpan window,
        CancellationToken ct)
    {
        var redisKey = $"ratelimit:{key}";

        try
        {
            // Sliding window log algorithm using Redis sorted set
            var now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            var windowStart = now - (long)window.TotalMilliseconds;

            // Remove old entries outside the window
            await _redis.SortedSetRemoveRangeByScoreAsync(
                redisKey,
                double.NegativeInfinity,
                windowStart
            );

            // Count current entries in window
            var currentCount = await _redis.SortedSetLengthAsync(redisKey);

            if (currentCount >= limit)
            {
                _logger.LogWarning(
                    "Rate limit exceeded for key {Key}. Current: {Current}, Limit: {Limit}",
                    key, currentCount, limit
                );
                return false;
            }

            // Add current request
            await _redis.SortedSetAddAsync(redisKey, now, now);

            // Set expiry to clean up old keys
            await _redis.KeyExpireAsync(redisKey, window);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Redis rate limiter error for key {Key}. Allowing request.", key);
            // Fail open: allow request if Redis is down
            return true;
        }
    }
}

// Lua script for atomic sliding window (more efficient)
public class RedisRateLimiterOptimized : IDistributedRateLimiter
{
    private readonly IDatabase _redis;
    private readonly ILogger<RedisRateLimiterOptimized> _logger;

    private const string LuaScript = @"
        local key = KEYS[1]
        local now = tonumber(ARGV[1])
        local window = tonumber(ARGV[2])
        local limit = tonumber(ARGV[3])

        local clearBefore = now - window
        redis.call('ZREMRANGEBYSCORE', key, 0, clearBefore)

        local amount = redis.call('ZCARD', key)
        if amount < limit then
            redis.call('ZADD', key, now, now)
            redis.call('EXPIRE', key, window / 1000)
            return 1
        end
        return 0
    ";

    public async Task<bool> AllowRequestAsync(
        string key,
        int limit,
        TimeSpan window,
        CancellationToken ct)
    {
        var redisKey = $"ratelimit:{key}";
        var now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

        try
        {
            var result = await _redis.ScriptEvaluateAsync(
                LuaScript,
                new RedisKey[] { redisKey },
                new RedisValue[]
                {
                    now,
                    (long)window.TotalMilliseconds,
                    limit
                }
            );

            return (int)result == 1;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Redis rate limiter error. Allowing request.");
            return true; // Fail open
        }
    }
}

// Usage in middleware
public class DistributedRateLimitMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IDistributedRateLimiter _rateLimiter;

    public async Task InvokeAsync(HttpContext context)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                     ?? context.Connection.RemoteIpAddress?.ToString()
                     ?? "anonymous";

        var allowed = await _rateLimiter.AllowRequestAsync(
            key: userId,
            limit: 100,
            window: TimeSpan.FromMinutes(1),
            ct: context.RequestAborted
        );

        if (!allowed)
        {
            context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
            await context.Response.WriteAsJsonAsync(new
            {
                error = "Rate limit exceeded"
            });
            return;
        }

        await _next(context);
    }
}
```

---

## Summary: Backpressure Checklist

✅ **Built-in rate limiting** configured for public endpoints
✅ **Per-user/per-IP limits** to prevent monopolization
✅ **Concurrency limits** on expensive operations (semaphore pattern)
✅ **Bounded queues** for background work
✅ **Distributed rate limiting** (Redis) for multi-instance deployments
✅ **Fail fast** with proper 429/503 responses and Retry-After headers
✅ **Monitoring** of rejection rates, queue depth, semaphore contention

**Key Insight:** Backpressure is not about blocking users — it's about **preserving system health** so you can serve the requests you accept with good latency. A 429 response in 10ms is better than a timeout after 30 seconds.

**Next:** [Caching Strategies](./03-caching-strategies.md) - The fastest request is one you don't have to process.
