# Async & Non-Blocking I/O Patterns for High-Throughput Systems

## Why This Matters at Scale

When handling millions of requests, **threads are your most precious resource**. Blocking a thread while waiting for I/O (database query, HTTP call, file read) means that thread can't process other requests. With only hundreds of threads available, you'll hit a wall fast.

**The Math:**
- Default thread pool: ~hundreds of threads (varies by cores)
- Average database query: 50ms
- If threads block waiting: **200 threads = 4,000 requests/second max**
- With async/await (no blocking): **Same threads = 50,000+ requests/second**

## Rule #1: Never Block Threads on I/O

### ❌ Bad: Blocking Code (Thread Starvation)

```csharp
public class OrderController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly IDbConnection _db;

    [HttpPost("orders")]
    public IActionResult CreateOrder(CreateOrderRequest request)
    {
        // WRONG: .Result blocks the thread The CPU is doing nothing, but the thread is unavailable.
        var inventory = _httpClient
            .GetAsync($"https://inventory-api/check/{request.ProductId}")
            .Result;  // 🔥 Thread blocked here

        // WRONG: Synchronous DB call The CPU is doing nothing, but the thread is unavailable.
        var product = _db.Query<Product>(
            "SELECT * FROM Products WHERE Id = @Id",
            new { Id = request.ProductId }
        ).First();  // 🔥 Thread blocked here

        // More blocking...
        var result = ProcessOrder(product, inventory).Result;

        return Ok(result);
    }
}
```

**What happens under load:**
1. 500 concurrent requests come in
2. All 500 grab a thread and block
3. Thread pool exhausted
4. New requests queue up or timeout
5. **System dies under load**

### ✅ Good: Async All The Way

```csharp
public class OrderController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly IDbConnection _db;

    [HttpPost("orders")]
    public async Task<IActionResult> CreateOrderAsync(
        CreateOrderRequest request,
        CancellationToken ct)
    {
        // ✅ Thread released while waiting
        var inventoryTask = _httpClient
            .GetAsync($"https://inventory-api/check/{request.ProductId}", ct);

        // ✅ Thread released while waiting
        var productTask = _db.QueryFirstAsync<Product>(
            "SELECT * FROM Products WHERE Id = @Id",
            new { Id = request.ProductId }
        );

        // Run both in parallel, await both
        await Task.WhenAll(inventoryTask, productTask);

        var inventory = await inventoryTask;
        var product = await productTask;

        // ✅ Process async
        var result = await ProcessOrderAsync(product, inventory, ct);

        return Ok(result);
    }

    private async Task<OrderResult> ProcessOrderAsync(
        Product product,
        HttpResponseMessage inventory,
        CancellationToken ct)
    {
        var inventoryData = await inventory.Content
            .ReadFromJsonAsync<InventoryResponse>(ct);

        if (!inventoryData.Available)
            throw new OutOfStockException();

        // Write to DB async
        await _db.ExecuteAsync(
            "INSERT INTO Orders (ProductId, Quantity) VALUES (@ProductId, @Qty)",
            new { ProductId = product.Id, Qty = 1 }
        );

        return new OrderResult { OrderId = Guid.NewGuid(), Status = "Created" };
    }
}
```

**What happens under load:**
1. 5,000 concurrent requests come in
2. Each starts on a thread, hits await, **releases the thread**
3. Threads return to pool, handle more requests
4. When I/O completes, continuation runs on available thread
5. **Same thread pool handles 10x more throughput**


“Async/await allows us to release threads while waiting for I/O, so the same threads can serve many more requests.”

**What async actually means (important explanation)**

When you await an I/O operation:
- ❌ The thread does NOT wait
- ✅ The thread is returned to the ThreadPool
- ✅ The request state is stored
- ✅ When I/O completes, execution continues on any available thread

This is not multithreading, it’s non-blocking I/O.

**“With blocking code, throughput is limited by thread count. With async code, throughput is limited by I/O capacity.”. “Async/await doesn’t make code faster, it makes the system scale by freeing threads during I/O.”**

| Model    | Threads | Avg I/O | Max Throughput |
| -------- | ------- | ------- | -------------- |
| Blocking | 200     | 50ms    | ~4,000 req/s   |
| Async    | 200     | 50ms    | 50,000+ req/s  |


#### ❓ “Is async always better?”

“Only for I/O-bound work. For CPU-bound work, async doesn’t help; you need parallelism or offloading to background workers.”

#### ❓ “What about Task.Run?”

“Task.Run just moves blocking work to another thread — it doesn’t solve scalability and can make it worse under load.”

---

## Rule #2: Use HttpClientFactory (Prevent Socket Exhaustion)

### ❌ Bad: Creating HttpClient Instances

```csharp
// WRONG: Creates new sockets, doesn't respect DNS TTL
public class PaymentService
{
    public async Task<PaymentResult> ChargeCardAsync(string cardToken)
    {
        using var client = new HttpClient(); // 🔥 New sockets every time

        var response = await client.PostAsJsonAsync(
            "https://payment-gateway/charge",
            new { Token = cardToken }
        );

        return await response.Content.ReadFromJsonAsync<PaymentResult>();
    }
}
```

**Problems:**
- **Socket exhaustion**: Each instance creates new sockets
- **DNS changes ignored**: Doesn't respect DNS TTL
- Under load: **TIME_WAIT sockets pile up → connection failures**

### ✅ Good: HttpClientFactory

```csharp
// Startup.cs / Program.cs
builder.Services.AddHttpClient<PaymentService>(client =>
{
    client.BaseAddress = new Uri("https://payment-gateway");
    client.Timeout = TimeSpan.FromSeconds(10); // Always set timeout
    client.DefaultRequestHeaders.Add("Accept", "application/json");
})
.ConfigurePrimaryHttpMessageHandler(() => new SocketsHttpHandler
{
    PooledConnectionLifetime = TimeSpan.FromMinutes(2), // DNS refresh
    MaxConnectionsPerServer = 100 // Tune based on downstream capacity
});

// Service
public class PaymentService
{
    private readonly HttpClient _httpClient;

    // Injected from factory - reuses sockets correctly
    public PaymentService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<PaymentResult> ChargeCardAsync(
        string cardToken,
        CancellationToken ct)
    {
        var response = await _httpClient.PostAsJsonAsync(
            "/charge",
            new { Token = cardToken },
            ct
        );

        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<PaymentResult>(ct);
    }
}
```

**Why this works:**
- Socket pooling managed correctly
- DNS TTL respected (PooledConnectionLifetime)
- Connection limits prevent overwhelming downstream
- Timeout prevents hanging requests

**“Without HttpClientFactory, each request creates new sockets, which quickly exhaust OS resources. HttpClientFactory centralizes connection pooling, respects DNS changes, and enforces connection limits, which is essential for high-throughput systems.”**

| Topic              | New HttpClient | HttpClientFactory |
| ------------------ | -------------- | ----------------- |
| Socket reuse       | ❌ No           | ✅ Yes             |
| DNS refresh        | ❌ No           | ✅ Yes             |
| Connection pooling | ❌ No           | ✅ Yes             |
| Under load         | 💥 Fails       | 🚀 Stable         |
| Recommended        | ❌ Never        | ✅ Always          |

#### What is a socket and why does it matter?

“A socket is an OS-managed network connection. Creating too many too fast exhausts system resources, which is why socket reuse is critical at scale.”

- It’s a **temporary** connection between your application and another machine. Used to send and receive data over the network (TCP/UDP)
- Managed by the OS, not by your application code
- Think of a socket like a phone line:
  - You open it
  - Talk (send data)
  - Hang up
  - The OS cleans it up later

---

## Rule #3: Always Pass CancellationToken

Cancellation lets you stop work that's no longer needed (user disconnected, timeout hit).

### ✅ Proper Cancellation Propagation

```csharp
public class ReportController : ControllerBase
{
    private readonly IReportGenerator _reportGen;
    private readonly IDbConnection _db;

    [HttpGet("reports/{id}")]
    public async Task<IActionResult> GetReportAsync(
        int id,
        CancellationToken ct) // ASP.NET provides this
    {
        // Propagate to all async operations
        var data = await _db.QueryAsync<ReportData>(
            "SELECT * FROM LargeReportTable WHERE ReportId = @Id",
            new { Id = id }
            // Note: Dapper doesn't natively support CT, use wrapper
        );

        var report = await _reportGen.GenerateAsync(data, ct);

        return File(report, "application/pdf");
    }
}

public class ReportGenerator : IReportGenerator
{
    public async Task<byte[]> GenerateAsync(
        IEnumerable<ReportData> data,
        CancellationToken ct)
    {
        using var stream = new MemoryStream();

        foreach (var item in data)
        {
            // Check cancellation in loops
            ct.ThrowIfCancellationRequested();

            await ProcessItemAsync(item, stream, ct);
        }

        return stream.ToArray();
    }

    private async Task ProcessItemAsync(
        ReportData item,
        Stream stream,
        CancellationToken ct)
    {
        // Expensive operation
        await Task.Delay(100, ct); // Honors cancellation

        var bytes = Encoding.UTF8.GetBytes(item.ToString());
        await stream.WriteAsync(bytes, ct);
    }
}
```

**Why this matters:**
- User closes browser → cancel DB query, stop report generation
- Saves CPU, DB connections, memory
- At scale: **prevents pile-up of abandoned work**

---

## Rule #4: Avoid Sync-Over-Async Antipatterns

**Sync-over-async means calling async code in a synchronous, blocking way.**

You have **Async method (Task<T>)** But you force it to run synchronously using:
- .Result
- .Wait()
- .GetAwaiter().GetResult()

This defeats the entire purpose of async.

### ❌ Deadly Antipatterns

```csharp
// ANTIPATTERN #1: .Result / .Wait()
var user = _userService.GetUserAsync(id).Result; // Deadlock risk + blocks thread

// ANTIPATTERN #2: .GetAwaiter().GetResult()
var user = _userService.GetUserAsync(id).GetAwaiter().GetResult(); // Same problems

// ANTIPATTERN #3: Task.Run for fake async
public async Task<User> GetUserAsync(int id)
{
    // WRONG: Just wrapping sync code in Task.Run
    return await Task.Run(() =>
    {
        return _db.Query<User>("SELECT * FROM Users WHERE Id = @Id", new { Id = id })
                  .First();
    });
    // This STILL uses a thread for the duration of the query
}
```

### ✅ Correct Patterns

**If a method is async, everything below it must be async.**

```csharp
// Use truly async libraries
public async Task<User> GetUserAsync(int id, CancellationToken ct)
{
    // EF Core - truly async
    return await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id, ct);

    // Dapper - truly async
    return await _db.QueryFirstOrDefaultAsync<User>(
        "SELECT * FROM Users WHERE Id = @Id",
        new { Id = id }
    );

    // SqlClient - truly async
    await using var conn = new SqlConnection(_connectionString);
    await conn.OpenAsync(ct);
    await using var cmd = new SqlCommand("SELECT * FROM Users WHERE Id = @Id", conn);
    cmd.Parameters.AddWithValue("@Id", id);
    await using var reader = await cmd.ExecuteReaderAsync(ct);
    // ... read results
}
```

#### ❓ “Is .GetAwaiter().GetResult() safer?”

“No, it has the same deadlock and blocking issues as .Result. Always prefer async all the way.”

#### ❓ “Is Task.Run ever okay?”

“Only for CPU-bound work that you want to offload from the main thread, not for I/O-bound work. For I/O, always use async methods directly.”

---

## Advanced: ValueTask for Hot Paths

When an operation **completes synchronously most of the time** (e.g., cache hit), use `ValueTask<T>` to avoid Task allocation.

```csharp
public interface ICacheService
{
    ValueTask<T?> GetAsync<T>(string key, CancellationToken ct);
    ValueTask SetAsync<T>(string key, T value, CancellationToken ct);
}

public class RedisCacheService : ICacheService
{
    private readonly IDatabase _redis;

    public async ValueTask<T?> GetAsync<T>(string key, CancellationToken ct)
    {
        var value = await _redis.StringGetAsync(key);

        if (value.IsNullOrEmpty)
            return default;

        return JsonSerializer.Deserialize<T>(value!);
    }

    public async ValueTask SetAsync<T>(
        string key,
        T value,
        CancellationToken ct)
    {
        var json = JsonSerializer.Serialize(value);
        await _redis.StringSetAsync(key, json);
    }
}

public class UserService
{
    private readonly ICacheService _cache;
    private readonly IUserRepository _repo;

    // ValueTask: if cache hits (common), avoids Task allocation
    public async ValueTask<User> GetUserAsync(int id, CancellationToken ct)
    {
        var cacheKey = $"user:{id}";

        // Might complete synchronously if in memory cache
        var cached = await _cache.GetAsync<User>(cacheKey, ct);
        if (cached != null)
            return cached;

        var user = await _repo.GetByIdAsync(id, ct);
        await _cache.SetAsync(cacheKey, user, ct);

        return user;
    }
}
```

**When to use ValueTask:**
- Operations that often complete synchronously (cache hits, pooled resources)
- Hot paths called millions of times
- **Trade-off**: Slightly more complex, harder to debug

---

## Thread Pool Tuning (Last Resort)

**Default settings work for 99% of cases**. Only tune if you've:
1. Measured with profiling
2. Confirmed thread pool starvation
3. Made everything async first

```csharp
// Program.cs - ONLY if measurements show it's needed
ThreadPool.GetMinThreads(out var minWorker, out var minIOCP);
Console.WriteLine($"Default min threads: Worker={minWorker}, IOCP={minIOCP}");

// Increase min threads to reduce ramp-up time under bursts
// Rule of thumb: cores * 2 to cores * 4
ThreadPool.SetMinThreads(
    workerThreads: Environment.ProcessorCount * 2,
    completionPortThreads: Environment.ProcessorCount * 2
);
```

**Warning**: Increasing max threads doesn't help with async I/O. If you need more max threads, you're doing something wrong (probably blocking somewhere).

---

## Summary: The Async Checklist

✅ **All I/O operations are async** (DB, HTTP, file, Redis, queue)
✅ **No `.Result`, `.Wait()`, or `GetAwaiter().GetResult()`**
✅ **HttpClientFactory configured with timeouts and connection limits**
✅ **CancellationToken passed to all async methods**
✅ **Using truly async libraries** (EF Core, Dapper async, StackExchange.Redis)
✅ **ValueTask for hot paths** with frequent sync completion
✅ **Measured thread pool metrics** before tuning

**Next:** [Backpressure & Rate Limiting](./02-backpressure-rate-limiting.md) - Even with perfect async code, you need limits to protect the system.
