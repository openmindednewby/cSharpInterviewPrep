# Practice Questions & Prompts

Use these prompts while working through the [prep plan](../prep-plan.md). Aim to answer out loud and capture key points in your notes.

---

## LINQ & Collections

**Q: Given a list of trades with timestamps, return the latest trade per account using LINQ.**

A: Sort or group by account and pick the trade with the max timestamp using `GroupBy` + `OrderByDescending`/`MaxBy`. This keeps the logic declarative and pushes the temporal ordering into the query rather than manual loops.

```csharp
var latestTrades = trades
    .GroupBy(t => t.AccountId)
    .Select(g => g.OrderByDescending(t => t.Timestamp).First());
```

Use when you need the most recent entry per key without mutating state, such as building dashboards or reconciling snapshots. Avoid when the dataset is huge and you'd benefit from streaming/SQL aggregation; consider database query with `ROW_NUMBER` or a materialized view to avoid loading everything into memory.

**Q: Implement a method that flattens nested lists of instrument codes while preserving ordering.**

A: Use `SelectMany` to flatten while keeping inner order.

```csharp
var flat = nestedCodes.SelectMany(list => list);
```

Use when you have nested enumerables and simply need to concatenate them. Avoid when you must retain hierarchy boundaries—use nested loops instead.

**Q: Explain the difference between `SelectMany` and nested loops. When is each preferable?**

A: `SelectMany` projects each element to a sequence and flattens; nested loops make iteration explicit and allow more control over flow.

```csharp
// SelectMany
var pairs = accounts.SelectMany(a => a.Orders, (a, o) => new { a.Id, o.Id });

// Nested loops
foreach (var a in accounts)
    foreach (var o in a.Orders)
        yield return (a.Id, o.Id);
```

Use `SelectMany` when you want a fluent declarative pipeline or need joins. Use loops when performance-critical, complex control flow, or break/continue needed.

**Q: How would you detect duplicate orders in a stream using `GroupBy` and produce a summary?**

A: Group by unique order keys and filter groups with count > 1. Summaries can include counts, timestamps, and other aggregate metadata that drive remediation.

```csharp
var duplicates = orders
    .GroupBy(o => new { o.AccountId, o.ClientOrderId })
    .Where(g => g.Count() > 1)
    .Select(g => new {
        g.Key.AccountId,
        g.Key.ClientOrderId,
        Count = g.Count(),
        LatestTimestamp = g.Max(o => o.Timestamp)
    });
```

Use when you need summaries and easy grouping. Avoid when data volume exceeds in-memory capabilities—use database aggregates or streaming dedup.

---

## Async & Resilience

**Q: Sketch code to call three REST endpoints concurrently, cancel if any take longer than 3 seconds, and aggregate results.**

A: Use `Task.WhenAll` with `CancellationTokenSource` + timeout. Ensure the `HttpClient` is a singleton to avoid socket exhaustion and that partial results are handled gracefully when cancellation occurs.

```csharp
using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(3));
var tasks = endpoints.Select(url => httpClient.GetStringAsync(url, cts.Token));
string[] responses = await Task.WhenAll(tasks);
```

Use when limited number of independent calls; want fail-fast. Avoid when endpoints depend on each other or you must gracefully degrade per-call.

**Q: Implement a resilient HTTP client with retry and circuit breaker policies using Polly.**

A: Define policies and wrap HTTP calls.

```csharp
var policy = Policy.WrapAsync(
    Policy.Handle<HttpRequestException>()
          .OrResult<HttpResponseMessage>(r => (int)r.StatusCode >= 500)
          .WaitAndRetryAsync(3, attempt => TimeSpan.FromMilliseconds(200 * attempt)),
    Policy.Handle<HttpRequestException>()
          .CircuitBreakerAsync(5, TimeSpan.FromSeconds(30))
);

var response = await policy.ExecuteAsync(() => httpClient.SendAsync(request));
```

Use when downstream instability; need resilience. Avoid when operations must not be retried (e.g., non-idempotent commands without safeguards).

**Q: How would you handle backpressure when consuming a fast message queue with a slower downstream API?**

A: Use bounded channels, buffering, or throttling. Consider load shedding by dropping low-priority messages or scaling consumers horizontally when queue lengths grow.

```csharp
var channel = Channel.CreateBounded<Message>(new BoundedChannelOptions(100)
{
    FullMode = BoundedChannelFullMode.Wait
});

// Producer
_ = Task.Run(async () =>
{
    await foreach (var msg in source.ReadAllAsync())
        await channel.Writer.WriteAsync(msg);
});

// Consumer
await foreach (var msg in channel.Reader.ReadAllAsync())
{
    await ProcessAsync(msg);
}
```

Use when consumer slower than producer; need to avoid overload. Avoid when throughput must be maximized with zero buffering—consider scaling consumers instead.

**Q: Explain why you might use `SemaphoreSlim` with async code over `lock`.**

A: `SemaphoreSlim` supports async waiting and throttling concurrency. It can represent both mutual exclusion (1 permit) and limited resource pools (>1 permits).

```csharp
private readonly SemaphoreSlim _mutex = new(1, 1);

public async Task UseSharedAsync()
{
    await _mutex.WaitAsync();
    try { await SharedAsyncOperation(); }
    finally { _mutex.Release(); }
}
```

Use `SemaphoreSlim` when async code needs mutual exclusion or limited parallelism. Avoid when code is synchronous—`lock` has less overhead.

---

## API & Lifecycle

**Q: Describe the ASP.NET Core middleware pipeline for a request hitting an authenticated endpoint with custom exception handling.**

A: Typical order: `UseRouting` → auth middleware → custom exception handling (usually early) → `UseAuthentication`/`UseAuthorization` → endpoint execution. Static file middleware, response compression, and caching can be interleaved before routing. Include correlation logging, caching, validation, and telemetry instrumentation.

```csharp
app.UseMiddleware<CorrelationMiddleware>();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
```

Use when building consistent request handling. Avoid when for minimal APIs you might use delegate pipeline but still similar.

**Q: How do you implement API versioning and backward compatibility?**

A: Strategies: URL segment (`/v1/`), header, query string. Use `Asp.Versioning` package.

```csharp
services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
});
services.AddVersionedApiExplorer();
```

Use when breaking changes; maintain backward compatibility by keeping old controllers. Avoid when internal services with clients you control; choose contract-first to avoid version explosion.

**Q: Discuss strategies for rate limiting and request throttling.**

A: Use ASP.NET rate limiting middleware or gateway. Techniques: token bucket, fixed window, sliding window.

```csharp
services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("per-account", opt =>
    {
        opt.Window = TimeSpan.FromMinutes(1);
        opt.PermitLimit = 60;
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 20;
    });
});

app.UseRateLimiter();
```

Use when protecting downstream resources. Avoid when latency-critical internal traffic; consider other forms of protection.

**Q: How would you log correlation IDs across services and propagate them to downstream dependencies?**

A: Generate ID in middleware, add to headers/log context, forward via `HttpClient`. Ensure asynchronous logging frameworks flow the correlation ID across threads (e.g., using `AsyncLocal`).

```csharp
context.TraceIdentifier = context.TraceIdentifier ?? Guid.NewGuid().ToString();
_logger.LogInformation("{CorrelationId} handling {Path}", context.TraceIdentifier, context.Request.Path);
httpClient.DefaultRequestHeaders.Add("X-Correlation-ID", context.TraceIdentifier);
```

Use when need distributed tracing. Avoid when truly isolated services—rare.

---

## System Design

**Q: Design a service that ingests MT5 tick data, normalizes it, caches latest prices, and exposes them via REST/WebSocket.**

A: Components: Ingestion (connectors to MT5), normalization workers, cache (Redis), API (REST/WebSocket), persistence. Add replay storage (Kafka topic or time-series DB) for audit and late subscribers. Use message queue (Kafka) for fan-out and resilient decoupling of ingestion from delivery.

```csharp
while (await mt5Stream.MoveNextAsync())
{
    var normalized = Normalize(mt5Stream.Current);
    await cache.SetAsync(normalized.Symbol, normalized.Price);
    await hubContext.Clients.Group(normalized.Symbol)
        .SendAsync("price", normalized);
}
```

Use when need low-latency price dissemination. Avoid when low-frequency batch updates suffice.

**Q: Design an API that receives orders, validates, routes to MT4/MT5, and confirms execution. Include failure recovery.**

A: Steps: receive REST order → validate (risk, compliance) → persist pending state → route to MT4/MT5 → await ack → publish result. Include idempotency keys on inbound requests and a reconciliation process for missing confirmations. Use saga/outbox for reliability and to coordinate compensating actions when downstream legs fail.

```csharp
public async Task<IActionResult> Submit(OrderRequest dto)
{
    var order = await _validator.ValidateAsync(dto);
    await _repository.SavePending(order);
    var result = await _mtGateway.SendAsync(order);
    await _repository.UpdateStatus(order.Id, result.Status);
    await _bus.Publish(new OrderStatusChanged(order.Id, result.Status));
    return Ok(result);
}
```

Use when real-time trading with external platforms. Avoid when simple internal workflows—overkill.

**Q: Architect a system to collect metrics from trading microservices and alert on anomalies.**

A: Collect metrics via OpenTelemetry exporters, push to time-series DB (Prometheus), visualize in Grafana, alert via Alertmanager. Tag metrics with dimensions (service, region, environment) to support slicing and alert thresholds. Include streaming logs via ELK stack and trace sampling via Jaeger/Tempo.

```csharp
var meter = new Meter("Trading.Services");
var orderLatency = meter.CreateHistogram<double>("order_latency_ms");
orderLatency.Record(latencyMs, KeyValuePair.Create<string, object?>("service", serviceName));
```

Use when need proactive observability. Avoid when prototype with low SLA.

**Q: Discuss how you would integrate an external risk management engine into an existing microservices ecosystem.**

A: Use async messaging or REST; maintain schema adapters; ensure idempotency. Map risk statuses to domain-specific responses and version contracts to avoid breaking changes. Add caching for rules, circuit breakers, fallback decisions, and health checks to remove unhealthy nodes from rotation.

```csharp
var riskResponse = await _riskClient.EvaluateAsync(order, ct);
if (!riskResponse.Approved)
    return OrderDecision.Rejected(riskResponse.Reason);
```

Use when external compliance requirement. Avoid when latency-critical path can't tolerate external dependency—consider in-process rules.

---

## Messaging & Integration

**Q: Compare RabbitMQ and ZeroMQ for distributing price updates. When would you choose one over the other?**

A: RabbitMQ: brokered, supports persistence, routing, acknowledgments, management UI, plugins. ZeroMQ: brokerless sockets, ultra-low latency but manual patterns, no persistence out of the box. Use RabbitMQ for durable, complex routing, enterprise integration, where administrators need visibility and security. Use ZeroMQ for high-throughput, in-process/edge messaging; avoid if you need persistence or central management.

**Q: Explain how to ensure at-least-once delivery with RabbitMQ while preventing duplicate processing.**

A: Use durable queues, persistent messages, manual ack, idempotent consumers. Enable publisher confirms to ensure the broker persisted the message before acknowledging to the producer.

```csharp
channel.BasicConsume(queue, autoAck: false, consumer);
consumer.Received += (sender, ea) =>
{
    Handle(ea.Body);
    channel.BasicAck(ea.DeliveryTag, multiple: false);
};
```

Use when you can tolerate duplicates; critical to ensure no loss. Avoid when exactly-once semantics required—use transactional outbox + dedup.

**Q: How would you design a saga pattern to coordinate account funding across multiple services?**

A: Orchestrator or choreography; manage compensations (reverse ledger entry, refund payment).

```csharp
public async Task Handle(FundAccount command)
{
    var transferId = await _payments.DebitAsync(command.PaymentId);
    try
    {
        await _ledger.CreditAsync(command.AccountId, command.Amount);
        await _notifications.SendAsync(command.AccountId, "Funding complete");
    }
    catch
    {
        await _payments.RefundAsync(transferId);
        throw;
    }
}
```

Use when multi-step, distributed transactions. Avoid when single system handles all steps—simple ACID transaction suffices.

**Q: Discuss the outbox pattern and how it prevents message loss in event-driven systems.**

A: Write domain event to outbox table within same transaction, then relay to message bus. A background dispatcher polls the outbox table, publishes events, and marks them as processed (with retries and exponential backoff).

```csharp
await using var tx = await db.Database.BeginTransactionAsync();
order.Status = OrderStatus.Accepted;
db.Outbox.Add(new OutboxMessage(order.Id, new OrderAccepted(order.Id)));
await db.SaveChangesAsync();
await tx.CommitAsync();
```

Use when need atomic DB + message publish. Avoid when no shared database or eventual consistency acceptable without duplication.

---

## Data Layer

**Q: Write a SQL query to calculate the rolling 7-day trade volume per instrument.**

A: Use window functions to calculate rolling aggregates.

```sql
WITH daily AS (
    SELECT instrument_id,
           trade_timestamp::date AS trade_date,
           SUM(volume) AS daily_volume
    FROM trades
    GROUP BY instrument_id, trade_timestamp::date
)
SELECT instrument_id,
       trade_date,
       daily_volume,
       SUM(daily_volume) OVER (
           PARTITION BY instrument_id
           ORDER BY trade_date
           ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
       ) AS rolling_7d_volume
FROM daily
ORDER BY instrument_id, trade_date;
```

Use when need rolling metrics in SQL. Avoid when database lacks window functions—use app-side aggregation.

**Q: Explain how you would choose between normalized schemas and denormalized tables for reporting.**

A: Normalized: reduces redundancy, good for OLTP. Changes cascade predictably, but reporting joins can be expensive. Denormalized: duplicates data for fast reads (reporting, analytics). Updates are more complex; rely on ETL pipelines to keep facts in sync. Choose based on workload: mixed? use hybrid star schema or CQRS approach with read-optimized projections.

**Q: Describe the differences between clustered and non-clustered indexes and when to use covering indexes.**

A: Clustered: defines physical order, one per table; great for range scans. Non-clustered: separate structure pointing to data; can include columns.

```sql
CREATE NONCLUSTERED INDEX IX_Orders_Account_Status
    ON Orders(AccountId, Status)
    INCLUDE (CreatedAt, Amount);
```

Use covering index when query needs subset of columns; avoid extra lookups. Avoid when frequent writes—maintaining many indexes hurts performance.

**Q: Walk through handling a long-running report query that impacts OLTP performance.**

A: Strategies: read replicas, materialized views, batching, query hints, schedule off-peak. Consider breaking the query into smaller windowed segments and streaming results to avoid locking. Implement caching, pre-aggregation, and monitor execution plans for regressions.

---

## Trading Domain Knowledge

**Q: Describe the lifecycle of a forex trade from placement to settlement.**

A: Steps: quote, order placement, validation, routing, execution (fill/partial), confirmation, settlement (T+2), P&L updates. Post-trade, apply trade capture in back-office systems and reconcile with liquidity providers. Include margin checks and clearing, corporate actions, and overnight financing (swap) adjustments.

**Q: How would you integrate with MT4/MT5 APIs for trade execution in C#? Mention authentication, session management, and error handling.**

A: Use MetaTrader Manager/Server APIs via C# wrappers; handle session auth, keep-alive, throttle requests. Manage connections via dedicated service accounts and pre-allocate connection pools. Implement reconnect logic, map errors, ensure idempotent order submission. Translate MT-specific error codes into domain-level responses for clients.

```csharp
using var session = new Mt5Gateway(credentials);
await session.ConnectAsync();
var ticket = await session.SendOrderAsync(request);
```

**Q: What are common risk checks before executing a client order (e.g., margin, exposure limits)?**

A: Margin availability, max exposure per instrument, credit limits, duplicate orders, fat-finger (price deviation). Implement pre-trade risk service.

**Q: Explain how you'd handle market data bursts without dropping updates.**

A: Use batching, diff updates, UDP multicast ingestion, prioritized queues, snapshot + incremental updates. Utilize adaptive sampling—send every tick to VIP clients while throttling retail feeds. Apply throttling per client, drop non-critical updates after stale, and monitor queue depths to trigger auto-scaling.

---

## Behavioral & Soft Skills

**Q: Tell me about a time you led a critical production fix under pressure.**

A: Discuss scenario: triage, swarm, communication, root cause, postmortem. Highlight proactive rollback plans and customer communication cadence.

**Q: Describe a situation where you improved a process by automating manual work.**

A: Example: build CI pipeline, reduce manual deployment, measured time saved. Emphasize KPIs such as deployment frequency and lead time.

**Q: Discuss a conflict within a team and how you resolved it.**

A: Example: align on goals, active listening, data-driven decision, mediation. Demonstrate neutral facilitation and follow-up agreements.

**Q: Share a story that demonstrates your commitment to documentation or knowledge sharing.**

A: Example: created runbooks, knowledge base, improved onboarding. Include metrics such as onboarding time reduction and support ticket deflection.

---

## Questions for the Interviewer

1. How does structure collaboration between developers, QA, and trading desks?
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

Notes: Mapping the health check keeps the app's composition root small. Consider adding `UseHealthChecks` or custom readiness/liveness probes for Kubernetes deployments.

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
