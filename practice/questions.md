# Practice Questions & Prompts

Use these prompts while working through the [prep plan](../prep-plan.md). Aim to answer out loud and capture key points in your notes.

---

## LINQ & Collections
1. Given a list of trades with timestamps, return the latest trade per account using LINQ.
2. Implement a method that flattens nested lists of instrument codes while preserving ordering.
3. Explain the difference between `SelectMany` and nested loops. When is each preferable?
4. How would you detect duplicate orders in a stream using `GroupBy` and produce a summary?

## Async & Resilience
1. Sketch code to call three REST endpoints concurrently, cancel if any take longer than 3 seconds, and aggregate results.
2. Implement a resilient HTTP client with retry and circuit breaker policies using Polly.
3. How would you handle backpressure when consuming a fast message queue with a slower downstream API?
4. Explain why you might use `SemaphoreSlim` with async code over `lock`.

## API & Lifecycle
1. Describe the ASP.NET Core middleware pipeline for a request hitting an authenticated endpoint with custom exception handling.
2. How do you implement API versioning and backward compatibility?
3. Discuss strategies for rate limiting and request throttling.
4. How would you log correlation IDs across services and propagate them to downstream dependencies?

## System Design
1. **Price Streaming Service:** Design a service that ingests MT5 tick data, normalizes it, caches latest prices, and exposes them via REST/WebSocket.
2. **Order Execution Workflow:** Design an API that receives orders, validates, routes to MT4/MT5, and confirms execution. Include failure recovery.
3. **Real-Time Monitoring Dashboard:** Architect a system to collect metrics from trading microservices and alert on anomalies.
4. Discuss how you would integrate an external risk management engine into an existing microservices ecosystem.

## Messaging & Integration
1. Compare RabbitMQ and ZeroMQ for distributing price updates. When would you choose one over the other?
2. Explain how to ensure at-least-once delivery with RabbitMQ while preventing duplicate processing.
3. How would you design a saga pattern to coordinate account funding across multiple services?
4. Discuss the outbox pattern and how it prevents message loss in event-driven systems.

## Data Layer
1. Write a SQL query to calculate the rolling 7-day trade volume per instrument.
2. Explain how you would choose between normalized schemas and denormalized tables for reporting.
3. Describe the differences between clustered and non-clustered indexes and when to use covering indexes.
4. Walk through handling a long-running report query that impacts OLTP performance.

## Trading Domain Knowledge
1. Describe the lifecycle of a forex trade from placement to settlement.
2. How would you integrate with MT4/MT5 APIs for trade execution in C#? Mention authentication, session management, and error handling.
3. What are common risk checks before executing a client order (e.g., margin, exposure limits)?
4. Explain how youd handle market data bursts without dropping updates.

## Behavioral & Soft Skills
1. Tell me about a time you led a critical production fix under pressure.
2. Describe a situation where you improved a process by automating manual work.
3. Discuss a conflict within a team and how you resolved it.
4. Share a story that demonstrates your commitment to documentation or knowledge sharing.

## Questions for the Interviewer
1. How does HFM structure collaboration between developers, QA, and trading desks?
2. What are the biggest technical challenges facing the MT4/MT5 integration team right now?
3. How do you measure success for developers in this role within the first 6 months?
4. What opportunities exist for continuous learning and innovation within the engineering org?

---

Answer as many as you can out loud. For each, note concise bullet responses to reference right before the interview.

## Access Modifiers  `public`, `private`, `internal`, `protected` (and variants)

Quick summary:
- `public`: accessible from any code that can see the type.
- `private`: accessible only within the containing type (default for members).
- `internal`: accessible to code within the same assembly (project output).
- `protected`: accessible within the containing type and its derived types.
- `protected internal`: accessible from derived types or any code in the same assembly.
- `private protected` (C# 7.2+): accessible within the containing class or derived types in the same assembly.

Examples:

```csharp
public class Base
{
    private int _secret;                 // only inside Base
    protected int ProtectedValue;        // Base + derived classes
    internal int InternalValue;          // same assembly
    public int PublicValue;              // everyone
}

public class Derived : Base
{
    void Demo()
    {
        // can access ProtectedValue and InternalValue and PublicValue
        // cannot access _secret
    }
}

// Top-level types (classes) without a modifier default to internal.
```

Notes:
- Use `private` to encapsulate implementation details.
- Use `internal` to expose APIs across your project but hide them from other assemblies.
- Prefer `protected` sparingly; heavy use can expose internal invariants to subclasses and increase coupling.

## Dependency Injection Lifetimes  `Transient`, `Scoped`, `Singleton` (and tips)

Quick summary (Microsoft.Extensions.DependencyInjection semantics):
- `Transient`: a new instance is created every time the service is requested.
- `Scoped`: a single instance is created per scope (in ASP.NET Core a scope is typically a single HTTP request).
- `Singleton`: a single instance is created for the application's lifetime (or until the container is disposed).

Examples and behavior:

```csharp
services.AddTransient<IRepo, Repo>();   // new Repo each injection
services.AddScoped<IRepo, Repo>();      // one Repo per request/scope
services.AddSingleton<IRepo, Repo>();   // single Repo for the app lifetime
```

Important tips:
- Use `Scoped` for per-request services that hold state tied to the request (e.g., `DbContext`).
- Use `Singleton` for stateless, thread-safe services (caches, configuration providers). Be careful with mutable singletons.
- Avoid injecting a `Scoped` service into a `Singleton`  the scoped service may be captured incorrectly leading to unintended shared state or runtime errors.
- `Transient` is good for lightweight, stateless services; it can be used when you explicitly want fresh instances.

Pitfall example:

```csharp
// Bad: singleton holding a scoped dependency
services.AddSingleton<MySingleton>();
services.AddScoped<MyScopedDependency>();

public class MySingleton
{
    public MySingleton(MyScopedDependency dep) { /* captured scoped dep = problematic */ }
}
```

If you need to use a scoped service from a singleton, resolve scoped instances using `IServiceScopeFactory` or limit the singleton to factory-style resolution at operation time.

---

## Code Assessment Questions & Answers (with snippets)

Use these to rehearse typical coding test prompts. Aim to talk through complexity trade-offs and add small notes about edge cases.

1. **Async REST fan-out with cancellation and timeout**

   *Question (real-life style):* "You have to hit three quote endpoints in parallel and bail out if any call takes longer than 3 seconds, while still honoring upstream cancellation. Return only non-null quotes. Sketch the method you'd drop into the pricing client."

```csharp
public static async Task<IReadOnlyList<Quote>> FetchQuotesAsync(HttpClient client, CancellationToken cancellationToken)
{
    using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
    cts.CancelAfter(TimeSpan.FromSeconds(3));

    var endpoints = new[] {"prices/eurusd", "prices/gbpusd", "prices/usdjpy"};
    var tasks = endpoints.Select(e => client.GetFromJsonAsync<Quote>(e, cts.Token)).ToArray();

    var results = await Task.WhenAll(tasks);
    return results!
        .Where(q => q is not null)
        .ToArray();
}
```

Notes: Use `CancellationTokenSource.CreateLinkedTokenSource` to respect upstream cancellation. Consider wrapping each call with `Try/Finally` or `Task.WhenAny` if partial failures should be tolerated instead of throwing.

2. **LRU cache for price lookups**

   *Question (real-life style):* "Implement an in-memory LRU cache (single-threaded is fine) for up to N price lookups with O(1) `Put`/`TryGet`. Show the class you would hand to another team to reuse in a console app."

```csharp
public sealed class LruCache<TKey, TValue>
{
    private readonly int _capacity;
    private readonly Dictionary<TKey, LinkedListNode<(TKey Key, TValue Value)>> _map = new();
    private readonly LinkedList<(TKey Key, TValue Value)> _list = new();

    public LruCache(int capacity) => _capacity = capacity;

    public void Put(TKey key, TValue value)
    {
        if (_map.TryGetValue(key, out var node))
        {
            node.Value = (key, value);
            _list.Remove(node);
            _list.AddFirst(node);
            return;
        }

        if (_map.Count == _capacity)
        {
            var toRemove = _list.Last!;
            _map.Remove(toRemove.Value.Key);
            _list.RemoveLast();
        }

        var newNode = new LinkedListNode<(TKey, TValue)>((key, value));
        _list.AddFirst(newNode);
        _map[key] = newNode;
    }

    public bool TryGet(TKey key, out TValue value)
    {
        if (_map.TryGetValue(key, out var node))
        {
            _list.Remove(node);
            _list.AddFirst(node);
            value = node.Value.Value;
            return true;
        }

        value = default!;
        return false;
    }
}
```

Notes: `Put` and `TryGet` are O(1). Thread-safety can be added with `SemaphoreSlim` for async scenarios or `lock` for synchronous use.

3. **Concurrent producer/consumer pipeline for order enrichment**

   *Question (real-life style):* "We ingest orders into a channel and need to enrich them via an async call before publishing. Write the enrichment pipeline so it can fan out work and push enriched orders to the outbound channel." 

```csharp
public static async Task StartEnrichmentPipeline(Channel<Order> inbound, Func<Order, Task<Order>> enrich, Channel<Order> outbound)
{
    await foreach (var order in inbound.Reader.ReadAllAsync())
    {
        _ = Task.Run(async () =>
        {
            var enriched = await enrich(order);
            await outbound.Writer.WriteAsync(enriched);
        });
    }
}
```

Notes: Use `Channel.CreateBounded<Order>(capacity)` to add backpressure. For stricter ordering, await tasks or use `Parallel.ForEachAsync` with `MaxDegreeOfParallelism`.

4. **SQL: find latest fill per order**

   *Question (real-life style):* "Given a `fills` table with `order_id`, `fill_price`, and `filled_at`, write a query that returns only the most recent fill per order for a compliance report."

```sql
SELECT DISTINCT ON (order_id) order_id, fill_price, filled_at
FROM fills
ORDER BY order_id, filled_at DESC;
```

Notes: `DISTINCT ON` is PostgreSQL-specific; in SQL Server, use `ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY filled_at DESC)` and filter on `ROW_NUMBER = 1`.

5. **Minimal API health endpoint with dependency injection**

   *Question (real-life style):* "Expose a `/health` endpoint in a minimal API that reports `200` when a price feed is connected, otherwise `503`. Keep the composition root small and use DI for the feed implementation."

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<IPriceFeed, PriceFeed>();
var app = builder.Build();

app.MapGet("/health", (IPriceFeed feed) => feed.IsConnected
    ? Results.Ok(new { status = "ok" })
    : Results.StatusCode(StatusCodes.Status503ServiceUnavailable));

await app.RunAsync();
```

Notes: Mapping the health check keeps the app’s composition root small. Consider adding `UseHealthChecks` or custom readiness/liveness probes for Kubernetes deployments.

6. **Secure parameterized data access to prevent SQL injection**

   *Question (real-life style):* "Refactor a repository method that currently concatenates `accountId` into SQL. Show a safe, parameterized implementation that streams results asynchronously." 

```csharp
public async Task<IReadOnlyList<Order>> GetOrdersAsync(
    SqlConnection connection,
    int accountId,
    CancellationToken cancellationToken)
{
    const string sql = "SELECT order_id, symbol, qty, status FROM dbo.Orders WHERE account_id = @AccountId";

    await using var cmd = new SqlCommand(sql, connection);
    cmd.Parameters.Add(new SqlParameter("@AccountId", SqlDbType.Int) { Value = accountId });

    await using var reader = await cmd.ExecuteReaderAsync(cancellationToken);
    var orders = new List<Order>();
    while (await reader.ReadAsync(cancellationToken))
    {
        orders.Add(new Order
        {
            Id = reader.GetInt32(0),
            Symbol = reader.GetString(1),
            Quantity = reader.GetDecimal(2),
            Status = reader.GetString(3)
        });
    }

    return orders;
}
```

Notes: Always bind parameters instead of string interpolation to avoid SQL injection. Use least-privileged SQL logins and timeouts to limit blast radius, and validate `accountId` ranges before querying.

7. **JWT authentication with audience validation and clock skew control**

   *Question (real-life style):* "You need to secure an API with JWT bearer auth. Configure validation to lock issuer/audience, tighten clock skew, and require a symmetric signing key from configuration. What does the startup code look like?"

```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "https://issuer.example.com",
            ValidateAudience = true,
            ValidAudience = "trading-api",
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1),
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:SigningKey"]))
        };
    });
```

Notes: Tighten `ClockSkew` to reduce replay windows, ensure HTTPS-only transport, and rotate signing keys. Add `RequireAuthorization()` on sensitive endpoints and propagate correlation IDs for audit logs.

8. **Performance: span-based parsing to reduce allocations**

   *Question (real-life style):* "We parse numeric quantities from protocol buffers and want to avoid string allocations. Implement a span-based parser that returns `-1` on invalid input." 

```csharp
public static int ParseQuantity(ReadOnlySpan<char> span)
{
    // Expects numeric ASCII; returns -1 for invalid input.
    int value = 0;
    foreach (var ch in span)
    {
        if ((uint)(ch - '0') > 9) return -1;
        value = unchecked(value * 10 + (ch - '0'));
    }
    return value;
}
```

Notes: Using `ReadOnlySpan<char>` avoids string allocations when parsing slices from protocol buffers or HTTP headers. Consider `int.TryParse(ReadOnlySpan<char>, NumberStyles, IFormatProvider, out int)` for built-in validation and benchmark with BenchmarkDotNet to confirm gains.

9. **Performance: async streaming to lower memory footprint**

   *Question (real-life style):* "Show how you would stream trades from an HTTP endpoint without buffering the whole payload, yielding trades as they arrive and honoring cancellation." 

```csharp
public static async IAsyncEnumerable<Trade> StreamTradesAsync(
    HttpClient client,
    [EnumeratorCancellation] CancellationToken cancellationToken)
{
    await using var stream = await client.GetStreamAsync("trades/stream", cancellationToken);
    await foreach (var trade in JsonSerializer.DeserializeAsyncEnumerable<Trade>(stream, cancellationToken: cancellationToken))
    {
        if (trade is not null)
            yield return trade;
    }
}
```

Notes: Streaming deserialization prevents buffering large payloads. Combine with `HttpClientFactory` for connection reuse and set `MaxResponseContentBufferSize` when buffering is unavoidable. Add defensive cancellation to avoid stuck I/O.



