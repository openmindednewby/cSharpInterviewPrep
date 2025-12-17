# Caching Strategies: Making Millions of Requests Feel Like Thousands

## Why Caching is Critical at Scale

**The Math:**
- Database query: 50ms average
- Redis cache hit: 1-2ms
- In-memory cache hit: 0.01ms (10 microseconds)

With millions of users, **your database is the bottleneck**. Caching moves the "hot path" from slow storage to fast memory.

**Key Principle:** The fastest request is one you never have to process.

---

## 1. Multi-Layer Caching Architecture

Use multiple cache layers for different access patterns:

```
Request → In-Memory (L1) → Redis (L2) → Database (L3)
   ↓           ↓               ↓             ↓
  10μs        1-2ms          50ms        100ms+
```

### Why Multiple Layers?

- **L1 (In-Memory)**: Ultra-fast for per-instance hot data
- **L2 (Redis)**: Shared across instances, survives restarts
- **L3 (Database)**: Source of truth

---

## 2. In-Memory Caching (IMemoryCache)

Best for: Frequently accessed, rarely changing data per instance.

```csharp
using Microsoft.Extensions.Caching.Memory;

public class ProductService
{
    private readonly IMemoryCache _cache;
    private readonly IProductRepository _repo;
    private readonly ILogger<ProductService> _logger;

    public ProductService(
        IMemoryCache cache,
        IProductRepository repo,
        ILogger<ProductService> logger)
    {
        _cache = cache;
        _repo = repo;
        _logger = logger;
    }

    public async Task<Product> GetProductAsync(int id, CancellationToken ct)
    {
        var cacheKey = $"product:{id}";

        // Try in-memory cache first
        if (_cache.TryGetValue(cacheKey, out Product? cached))
        {
            _logger.LogDebug("Cache HIT for product {ProductId}", id);
            return cached!;
        }

        _logger.LogDebug("Cache MISS for product {ProductId}", id);

        // Load from database
        var product = await _repo.GetByIdAsync(id, ct);

        // Cache with options
        var cacheOptions = new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),
            SlidingExpiration = TimeSpan.FromMinutes(2), // Renews if accessed
            Size = 1, // For size-based eviction
            Priority = CacheItemPriority.Normal
        };

        // Add callback to log eviction
        cacheOptions.RegisterPostEvictionCallback((key, value, reason, state) =>
        {
            _logger.LogDebug(
                "Cache eviction: {Key}, Reason: {Reason}",
                key, reason
            );
        });

        _cache.Set(cacheKey, product, cacheOptions);

        return product;
    }
}

// Configure memory cache in Program.cs
builder.Services.AddMemoryCache(options =>
{
    options.SizeLimit = 1024; // Limit number of entries
    options.CompactionPercentage = 0.25; // Compact 25% when limit hit
});
```

### Cache Stampede Protection (Critical!)

When cache expires and 1000 requests hit at once, they all query the DB. Use per-key locking.

```csharp
public class StampededProofCacheService<T> where T : class
{
    private readonly IMemoryCache _cache;
    private static readonly ConcurrentDictionary<string, SemaphoreSlim> _locks = new();
    private readonly ILogger<StampededProofCacheService<T>> _logger;

    public StampededProofCacheService(
        IMemoryCache cache,
        ILogger<StampededProofCacheService<T>> logger)
    {
        _cache = cache;
        _logger = logger;
    }

    public async Task<T> GetOrCreateAsync(
        string key,
        Func<CancellationToken, Task<T>> factory,
        TimeSpan expiration,
        CancellationToken ct)
    {
        // Fast path: cache hit
        if (_cache.TryGetValue(key, out T? cached))
        {
            return cached!;
        }

        // Slow path: acquire per-key lock
        var semaphore = _locks.GetOrAdd(key, _ => new SemaphoreSlim(1, 1));

        await semaphore.WaitAsync(ct);
        try
        {
            // Double-check after acquiring lock (another thread may have loaded it)
            if (_cache.TryGetValue(key, out cached))
            {
                _logger.LogDebug("Cache hit after lock acquisition for {Key}", key);
                return cached!;
            }

            _logger.LogDebug("Loading data for {Key}", key);

            // Only one thread executes this
            var value = await factory(ct);

            // Add jitter to TTL to prevent thundering herd
            var jitter = TimeSpan.FromSeconds(Random.Shared.Next(0, 30));
            var ttl = expiration + jitter;

            _cache.Set(key, value, new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = ttl
            });

            return value;
        }
        finally
        {
            semaphore.Release();

            // Cleanup: remove lock if no waiters (prevent dictionary bloat)
            if (semaphore.CurrentCount == 1 && _locks.TryRemove(key, out var removed))
            {
                removed.Dispose();
            }
        }
    }
}

// Usage
public class UserService
{
    private readonly StampededProofCacheService<User> _cache;
    private readonly IUserRepository _repo;

    public async Task<User> GetUserAsync(int userId, CancellationToken ct)
    {
        return await _cache.GetOrCreateAsync(
            key: $"user:{userId}",
            factory: async token => await _repo.GetByIdAsync(userId, token),
            expiration: TimeSpan.FromMinutes(5),
            ct: ct
        );
    }
}
```

**Why this matters:**
- Without locking: 1000 concurrent requests → 1000 DB queries
- With locking: 1000 concurrent requests → 1 DB query, 999 wait for result

---

## 3. Distributed Caching with Redis

Best for: Shared state across instances, session data, high-traffic reads.

### Setup StackExchange.Redis

```csharp
// Program.cs
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    var config = ConfigurationOptions.Parse(
        builder.Configuration.GetConnectionString("Redis")!
    );

    config.AbortOnConnectFail = false; // Retry on connect failure
    config.ConnectTimeout = 5000;
    config.SyncTimeout = 5000;
    config.AsyncTimeout = 5000;
    config.ConnectRetry = 3;
    config.KeepAlive = 60;

    // Connection pool settings
    config.DefaultDatabase = 0;

    var connection = ConnectionMultiplexer.Connect(config);

    // Log connection events
    connection.ConnectionFailed += (sender, args) =>
    {
        var logger = sp.GetRequiredService<ILogger<Program>>();
        logger.LogError(
            "Redis connection failed: {EndPoint}, {FailureType}",
            args.EndPoint, args.FailureType
        );
    };

    connection.ConnectionRestored += (sender, args) =>
    {
        var logger = sp.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("Redis connection restored: {EndPoint}", args.EndPoint);
    };

    return connection;
});

builder.Services.AddSingleton<IDistributedCache>(sp =>
{
    var redis = sp.GetRequiredService<IConnectionMultiplexer>();
    return new RedisCache(new RedisCacheOptions
    {
        ConnectionMultiplexerFactory = () => Task.FromResult(redis),
        InstanceName = "MyApp:" // Prefix for all keys
    });
});
```

### Cache-Aside Pattern

```csharp
public interface ICacheService
{
    Task<T?> GetAsync<T>(string key, CancellationToken ct) where T : class;
    Task SetAsync<T>(string key, T value, TimeSpan expiration, CancellationToken ct) where T : class;
    Task RemoveAsync(string key, CancellationToken ct);
}

public class RedisCacheService : ICacheService
{
    private readonly IDatabase _redis;
    private readonly ILogger<RedisCacheService> _logger;

    public RedisCacheService(
        IConnectionMultiplexer multiplexer,
        ILogger<RedisCacheService> logger)
    {
        _redis = multiplexer.GetDatabase();
        _logger = logger;
    }

    public async Task<T?> GetAsync<T>(string key, CancellationToken ct) where T : class
    {
        try
        {
            var value = await _redis.StringGetAsync(key);

            if (value.IsNullOrEmpty)
            {
                return null;
            }

            return JsonSerializer.Deserialize<T>(value!);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Redis GET failed for key {Key}", key);
            return null; // Fail gracefully
        }
    }

    public async Task SetAsync<T>(
        string key,
        T value,
        TimeSpan expiration,
        CancellationToken ct) where T : class
    {
        try
        {
            var json = JsonSerializer.Serialize(value);

            await _redis.StringSetAsync(
                key,
                json,
                expiration,
                flags: CommandFlags.FireAndForget // Don't wait for confirmation
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Redis SET failed for key {Key}", key);
            // Don't throw - cache failures shouldn't break the app
        }
    }

    public async Task RemoveAsync(string key, CancellationToken ct)
    {
        try
        {
            await _redis.KeyDeleteAsync(key, CommandFlags.FireAndForget);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Redis DELETE failed for key {Key}", key);
        }
    }
}

// Usage in service
public class OrderService
{
    private readonly ICacheService _cache;
    private readonly IOrderRepository _repo;
    private readonly ILogger<OrderService> _logger;

    public async Task<Order> GetOrderAsync(int orderId, CancellationToken ct)
    {
        var cacheKey = $"order:{orderId}";

        // Try cache first
        var cached = await _cache.GetAsync<Order>(cacheKey, ct);
        if (cached != null)
        {
            _logger.LogDebug("Redis cache HIT for order {OrderId}", orderId);
            return cached;
        }

        _logger.LogDebug("Redis cache MISS for order {OrderId}", orderId);

        // Load from DB
        var order = await _repo.GetByIdAsync(orderId, ct);

        // Update cache (fire and forget)
        _ = _cache.SetAsync(cacheKey, order, TimeSpan.FromMinutes(10), ct);

        return order;
    }

    public async Task UpdateOrderAsync(Order order, CancellationToken ct)
    {
        // Update DB
        await _repo.UpdateAsync(order, ct);

        // Invalidate cache
        await _cache.RemoveAsync($"order:{order.Id}", ct);
    }
}
```

---

## 4. Two-Layer Cache (L1 + L2)

Combine in-memory and Redis for best performance.

```csharp
public class TwoLayerCacheService
{
    private readonly IMemoryCache _l1Cache;
    private readonly IDatabase _redis;
    private readonly ILogger<TwoLayerCacheService> _logger;

    public TwoLayerCacheService(
        IMemoryCache memoryCache,
        IConnectionMultiplexer redis,
        ILogger<TwoLayerCacheService> logger)
    {
        _l1Cache = memoryCache;
        _redis = redis.GetDatabase();
        _logger = logger;
    }

    public async Task<T?> GetAsync<T>(
        string key,
        Func<CancellationToken, Task<T>> factory,
        TimeSpan expiration,
        CancellationToken ct) where T : class
    {
        // L1 (in-memory) check
        if (_l1Cache.TryGetValue(key, out T? l1Value))
        {
            _logger.LogDebug("L1 cache HIT for {Key}", key);
            return l1Value;
        }

        // L2 (Redis) check
        try
        {
            var redisValue = await _redis.StringGetAsync(key);
            if (!redisValue.IsNullOrEmpty)
            {
                _logger.LogDebug("L2 cache HIT for {Key}", key);

                var l2Value = JsonSerializer.Deserialize<T>(redisValue!);

                // Backfill L1
                _l1Cache.Set(key, l2Value, new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(1) // Shorter than L2
                });

                return l2Value;
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "L2 cache read failed for {Key}", key);
        }

        _logger.LogDebug("Cache MISS for {Key}, loading from source", key);

        // Load from source
        var value = await factory(ct);

        // Write to both layers
        _l1Cache.Set(key, value, new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(1)
        });

        try
        {
            var json = JsonSerializer.Serialize(value);
            await _redis.StringSetAsync(key, json, expiration);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "L2 cache write failed for {Key}", key);
        }

        return value;
    }
}
```

**Why two layers:**
- L1 eliminates network latency for hot items
- L2 shares data across instances
- Survives instance restarts
- Best of both worlds

---

## 5. Cache Invalidation Strategies

**The two hard problems in computer science:**
1. Cache invalidation
2. Naming things
3. Off-by-one errors

### Strategy 1: TTL with Jitter

```csharp
public static TimeSpan GetTTLWithJitter(TimeSpan baseTTL)
{
    var jitterSeconds = Random.Shared.Next(0, (int)(baseTTL.TotalSeconds * 0.1));
    return baseTTL + TimeSpan.FromSeconds(jitterSeconds);
}

// Usage
var ttl = GetTTLWithJitter(TimeSpan.FromMinutes(10)); // 10-11 minutes
await _cache.SetAsync(key, value, ttl, ct);
```

**Why jitter:** Prevents cache stampede when many entries expire simultaneously.

### Strategy 2: Write-Through (Update cache on write)

```csharp
public async Task UpdateUserAsync(User user, CancellationToken ct)
{
    // Update database
    await _repo.UpdateAsync(user, ct);

    // Update cache immediately
    var cacheKey = $"user:{user.Id}";
    await _cache.SetAsync(cacheKey, user, TimeSpan.FromMinutes(10), ct);
}
```

### Strategy 3: Cache Invalidation via Events

```csharp
public class UserUpdatedEvent
{
    public int UserId { get; set; }
}

public class UserCacheInvalidationHandler : INotificationHandler<UserUpdatedEvent>
{
    private readonly ICacheService _cache;

    public async Task Handle(UserUpdatedEvent notification, CancellationToken ct)
    {
        await _cache.RemoveAsync($"user:{notification.UserId}", ct);
        // Could also remove related keys: $"user:{userId}:orders", etc.
    }
}
```

### Strategy 4: Tag-Based Invalidation (Redis)

```csharp
public class TaggedCacheService
{
    private readonly IDatabase _redis;

    public async Task SetWithTagsAsync(
        string key,
        object value,
        string[] tags,
        TimeSpan expiration,
        CancellationToken ct)
    {
        var json = JsonSerializer.Serialize(value);

        // Store the value
        await _redis.StringSetAsync(key, json, expiration);

        // Store key in tag sets
        foreach (var tag in tags)
        {
            await _redis.SetAddAsync($"tag:{tag}", key);
        }
    }

    public async Task InvalidateByTagAsync(string tag, CancellationToken ct)
    {
        // Get all keys with this tag
        var keys = await _redis.SetMembersAsync($"tag:{tag}");

        // Delete all
        foreach (var key in keys)
        {
            await _redis.KeyDeleteAsync(key.ToString());
        }

        // Remove the tag set
        await _redis.KeyDeleteAsync($"tag:{tag}");
    }
}

// Usage
await _taggedCache.SetWithTagsAsync(
    "product:123",
    product,
    new[] { "products", "category:electronics", "brand:apple" },
    TimeSpan.FromMinutes(10),
    ct
);

// Invalidate all Apple products
await _taggedCache.InvalidateByTagAsync("brand:apple", ct);
```

---

## 6. HTTP Caching (ETags & 304 Not Modified)

Reduce bandwidth and processing for GET requests.

```csharp
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    [HttpGet("{id}")]
    [ResponseCache(Duration = 60, VaryByQueryKeys = new[] { "id" })]
    public async Task<IActionResult> GetProductAsync(int id, CancellationToken ct)
    {
        var product = await _productService.GetProductAsync(id, ct);

        // Generate ETag from product version or hash
        var etag = $"\"{product.Version}\"";
        Response.Headers.ETag = etag;

        // Check if client has current version
        if (Request.Headers.IfNoneMatch == etag)
        {
            return StatusCode(StatusCodes.Status304NotModified);
        }

        return Ok(product);
    }
}

// Or use middleware for automatic ETag generation
public class ETagMiddleware
{
    private readonly RequestDelegate _next;

    public async Task InvokeAsync(HttpContext context)
    {
        var originalStream = context.Response.Body;

        using var memoryStream = new MemoryStream();
        context.Response.Body = memoryStream;

        await _next(context);

        if (context.Response.StatusCode == 200)
        {
            var hash = ComputeHash(memoryStream.ToArray());
            var etag = $"\"{hash}\"";

            context.Response.Headers.ETag = etag;

            if (context.Request.Headers.IfNoneMatch == etag)
            {
                context.Response.StatusCode = 304;
                context.Response.ContentLength = 0;
                return;
            }
        }

        memoryStream.Position = 0;
        await memoryStream.CopyToAsync(originalStream);
    }

    private string ComputeHash(byte[] data)
    {
        using var sha256 = SHA256.Create();
        var hash = sha256.ComputeHash(data);
        return Convert.ToBase64String(hash);
    }
}
```

---

## 7. CDN for Static Content

Serve static files (images, CSS, JS) from edge locations.

```csharp
// Serve images with far-future expires
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        // Cache for 1 year
        ctx.Context.Response.Headers.CacheControl = "public,max-age=31536000";

        // Use versioned URLs: /images/logo.v123.png
        // When file changes, change version → new URL → cache busted
    }
});
```

---

## Summary: Caching Checklist

✅ **Multi-layer caching**: In-memory (L1) + Redis (L2)
✅ **Stampede protection**: Per-key locks for cache misses
✅ **TTL with jitter**: Prevent thundering herd
✅ **Fail gracefully**: Cache failures don't break the app
✅ **Invalidation strategy**: Write-through, events, or tag-based
✅ **HTTP caching**: ETags, 304 responses, response caching
✅ **CDN**: For static assets and cacheable API responses
✅ **Monitor**: Cache hit rate, eviction rate, memory usage

**Key Insight:** At scale, cache hit rate is everything. A 90% hit rate means 10x less database load. A 99% hit rate means 100x less load.

**Next:** [Database Optimization & Scaling](./04-database-scaling.md) - When you do hit the database, make it fast.
