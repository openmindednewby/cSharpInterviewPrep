# Core Concepts Cheat Sheet

Use these snapshots alongside the [prep plan](../prep-plan.md). Each section includes talking points, tips, and quick reminders tailored to the HFM Senior C#/.NET role.

---

## Runtime & Language Essentials

### .NET Core vs .NET Framework
- **Platform reach:** .NET Core/.NET (5+) is cross-platform and ships a self-contained runtime. .NET Framework stays Windows-only and upgrades via the OS.
- **Deployment model:** Publish as framework-dependent or self-contained. Self-contained bundles the runtime so each service can run side-by-side (`dotnet publish -r linux-x64 --self-contained`).
- **Performance tooling:**
  - **Kestrel** is the default cross-platform web server—highlight HTTPS, HTTP/2, and libuv/socket transport choices.
  - **GC improvements** (background server GC, heap compaction modes) arrive first in .NET Core.
  - **Trimming** and ReadyToRun images shrink microservices and speed cold starts.
- **When to pick which:** Keep legacy WinForms/WPF on .NET Framework; new services, cloud workloads, or containerized apps go with .NET.
- **Example:** Containerized pricing API published as self-contained for deterministic runtime, while legacy back-office WinForms app remains on .NET Framework 4.8.

```
            ┌────────────────────┐
            │   .NET Framework   │  Windows only, machine-wide
            └────────────────────┘
                     ▲
                     │
            ┌────────────────────┐
            │   .NET (Core)      │  Cross-platform, per-app runtime
            └────────────────────┘
```

### CLR & Garbage Collector (GC)

- [CLR & Garbage Collector (GC)](./sub-notes/CLR%20&%20Garbage%20Collector%20(GC).md)
- [CLR & Garbage Collector (GC) Practical Example](./sub-notes/CLR%20&%20Garbage%20Collector%20(GC)%20Practical%20Example.md)
- [struct vs class when to use which.md](./sub-notes/struct%20vs%20class%20when%20to%20use%20which.md)
- [struct vs class questions and answers.md](./sub-notes/struct%20vs%20class%20questions%20and%20answers.md)
- [`IDisposable` & Deterministic Cleanup](./sub-notes/IDisposable%20Patterns.md)
- [Forcing Garbage Collection (Rarely Needed)](./sub-notes/Forcing%20Garbage%20Collection.md)

- **Generational model:** Short-lived objects die young (Gen 0/1), long-lived promote to Gen 2. Large Object Heap (LOH) stores objects > 85 KB. [NET Generational Garbage Collection (GC) Deep Dive.md](./sub-notes/NET%20Generational%20Garbage%20Collection%20(GC)%20Deep%20Dive.md)
- **Server vs workstation GC:** Server GC uses dedicated background threads per core—great for ASP.NET services. Workstation GC favors desktop responsiveness. [Server vs Workstation GC.md](./sub-notes/Server vs Workstation GC.md)
- **Allocation discipline:** Reduce allocations in hot paths (e.g., reuse buffers, pool objects, prefer `Span<T>`/`Memory<T>` to avoid copying).
- **`Span<T>` usage:** Operates on stack or native memory without allocations—perfect for parsing protocol frames or slicing arrays. Remember `Span<T>` is stack-only; use `Memory<T>` for async boundaries.
- **Diagram:**

```
Gen0 ──► Gen1 ──► Gen2 ──► LOH
 small    medium   long     massive arrays/strings
```

### Async/Await Deep Dive
- [Async/Await Deep Dive reference](./sub-notes/Async%20Await%20Deep%20Dive.md)
- **State machine transformation:** The compiler rewrites `async` methods into a struct-based state machine that awaits continuations. Local variables become fields, so keep them light.
- **Context capture:** UI/ASP.NET SynchronizationContext captures by default. Use `ConfigureAwait(false)` in libraries/background work to avoid deadlocks and excess marshaling.
- **Exception propagation:** Exceptions bubble through the returned `Task`; always await to observe them. For fire-and-forget work, capture exceptions via continuations or hosted services.
- **Deadlock scenario:** Blocking on `task.Result` inside a context that disallows re-entry (e.g., UI thread) stalls the continuation—keep the call chain async end-to-end.
- **Lock coordination:** `lock` is synchronous. Use `SemaphoreSlim`/`AsyncLock` when awaiting inside critical sections.
- **Fan-out patterns:** Use `Task.WhenAll`/`Task.WhenAny` to parallelize I/O and accept `CancellationToken` all the way through.
- **I/O-bound gains:** Use `await` for database calls, HTTP requests—threads return to the pool while awaiting.
- **Example:**

```csharp
public async Task<Order> PlaceAsync(OrderRequest request)
{
    using var activity = _activitySource.StartActivity("PlaceOrder");
    var quote = await _pricingClient.GetQuoteAsync(request.Symbol)
                                     .ConfigureAwait(false);
    return await _orderGateway.ExecuteAsync(request with { Price = quote })
                              .ConfigureAwait(false);
}
```

### Reflection Basics
- [Reflection Overview](./sub-notes/Reflection%20Overview.md)
- **When to reach for it:** Discover handlers, apply attributes, build dynamic proxies or serializers.
- **Performance tip:** Cache `PropertyInfo`/`MethodInfo` lookups or emit delegates to avoid repeated reflection overhead.

### Value vs Reference Types
- **Stack vs heap:** Value types (`struct`, `record struct`) live inline; reference types allocate on the heap.
- **Boxing/unboxing:** Converting a value type to `object` boxes; avoid in hot loops (e.g., use generic collections over `ArrayList`).
- **When to use structs:** Keep them small (<16 bytes), immutable, and logically represent a single value (e.g., `PriceTick` with `decimal Bid`/`Ask`).
- **`record struct`:** Offers value semantics with concise syntax and generated equality members.
- **Heap vs stack visualization:**

```
Stack Frame
┌─────────────────────┐
│ PriceTick tick;     │◄─ value copied
└─────────────────────┘

Managed Heap
┌─────────────────────┐
│ Order order ─────┐  │◄─ reference points here
│   Id = 42        │  │
└──────────────────┴──┘
```

### Collections & LINQ
- **Deferred execution:** Query operators (e.g., `Where`, `Select`) defer work until enumerated. Beware of multiple iterations.
- **`IEnumerable<T>` vs `IQueryable<T>`:** `IQueryable<T>` builds an expression tree for remote providers (EF Core). Avoid running client-side filters inadvertently.
- **Materialization:** Use `ToList()`/`ToArray()` when you need a snapshot (e.g., before caching or multi-pass traversal).
- **Avoid multiple enumeration:** Cache results with `var list = source.ToList();` if you'll iterate twice.
- [Sorted Collections & Interview Talking Points](./sub-notes/Sorted%20Collections%20Interview%20Notes.md)
- [Sorting Algorithms Interview Primer](./sub-notes/Sorting%20Algorithms.md)
- [FIFO Queues in .NET](./sub-notes/FIFO%20Queues%20in%20.NET.md)
- **Example:**

```csharp
var recentOrders = await _dbContext.Orders
    .Where(o => o.ExecutedAt >= cutoff)
    .OrderByDescending(o => o.ExecutedAt)
    .Take(100)
    .ToListAsync(); // materialize once before logging & response

var topSymbols = recentOrders
    .GroupBy(o => o.Symbol)
    .Select(g => new { Symbol = g.Key, Volume = g.Sum(o => o.Quantity) });
```

- **Memory-friendly pipeline:** Combine `Span<T>` + LINQ alternatives (`ArrayPool<T>`, `ValueTask`) when optimizing allocations.

## Architecture & Patterns

- [Arhcitecture-&-patterins-examples.md](./sub-notes/Arhcitecture-&-patterins-examples.md)
- **SOLID:**
  - *Single Responsibility:* Keep classes focused; e.g., split order validation from execution.
  - *Open/Closed:* Extend via interfaces/inheritance; plug new execution channels without touching existing code.
  - *Liskov Substitution:* Ensure derived classes honor base contracts—critical for strategy objects.
  - *Interface Segregation:* Prefer fine-grained service contracts (e.g., `IPriceFeed`, `ITradeExecutor`).
  - *Dependency Inversion:* Depend on abstractions; mention DI containers.
- **Patterns to Highlight:** Strategy (switching trading logic), Observer (market data broadcast), Factory (creating platform-specific handlers), CQRS (command/query split for trading ops), Decorator (enriching services with logging/caching).
  - [Decorator Pattern](./sub-notes/Decorator%20Pattern.md) And **Decorator** wraps services with cross-cutting features like logging, caching, and retry without touching core logic.
  - [Factory Pattern](./sub-notes/Factory%20Pattern.md) The **Factory** pattern instantiates platform-specific executors like MT4/MT5.
  - [Observer Pattern](./sub-notes/Observer%20Pattern.md) The **Observer** pattern pushes ticks to multiple subscribers like charts and risk systems.
  - [CQRS Pattern](./sub-notes/CQRS%20Pattern.md) **CQRS** splits commands like ‘PlaceOrder’ from queries like ‘GetOrder’.
  - [Strategy Pattern](./sub-notes/Strategy%20Pattern.md) The **Strategy** pattern lets me swap trading logic dynamically (e.g., aggressive vs passive).

## ASP.NET Core & Service Design
- **Pipeline:** Middleware order, short-circuiting, exception handling, logging. Mention custom middleware for correlation IDs.
- **Dependency Injection:** Service lifetimes—singleton (stateless), scoped (per request), transient (lightweight). Know pitfalls of capturing scoped services in singletons. [Dependency Injection Lifetimes at a Glance](./sub-notes/Dependency%20Injection%20Lifetimes.md)
- **Controllers & Minimal APIs:** Choosing between them, versioning strategies, attribute routing.
- **Resilience:** Use Polly for retries/circuit breakers, `HttpClientFactory` to avoid socket exhaustion, health checks, and structured logging.

## Service Architecture Playbook
- **Building Blocks:** API gateway, service layer, message broker, background workers, caching, persistence, monitoring.
- **Scalability:** Horizontal scaling, stateless services, containerization, readiness/liveness probes.
- **Observability:** OpenTelemetry, distributed tracing, correlation IDs, dashboards with Grafana/Kibana.
- **Security:** OAuth2/JWT, refresh tokens, rate limiting, data encryption in transit and at rest.

## Messaging & Distributed Coordination
- **RabbitMQ:** Broker-based, supports routing (fanout, topic, direct). Use for work queues, acknowledgements, durable queues.
- **ZeroMQ:** Lightweight socket library without broker; great for high-throughput, but requires you to manage topology/reliability.
- **Delivery Guarantees:**
  - *At-most-once:* Fast, risk of data loss.
  - *At-least-once:* Requires idempotency.
  - *Exactly-once:* Difficult; usually simulated with deduplication + idempotent consumers.
- **Idempotency Strategies:** Unique message IDs, dedupe stores, database upserts.

## Data Layer Essentials
- **SQL:** Normalize core entities, use indexes (clustered vs non-clustered), parameterized queries, stored procs for heavy logic. Understand isolation levels (Read Committed default, Snapshot to reduce locks).
- **Query Performance:** Use execution plans, avoid SELECT *, prefer filtered indexes. For analytics, mention window functions.
- **Transactions:** ACID, handling distributed transactions via outbox pattern.
- **NoSQL:**
  - *MongoDB:* Flexible schema, good for hierarchical data, but design for access patterns.
  - *Redis:* In-memory cache, data structures (strings, hashes, sorted sets), TTLs, pub/sub, caching patterns (cache-aside, write-through).

## Trading & MT4/MT5 Context
- **Platform Overview:** MetaTrader platforms for forex/CFD trading. Provide APIs for order execution, account management, and market data.
- **Integration Notes:** Connect via bridge services or APIs, handle authentication, manage session state, process asynchronous events.
- **Risk & Latency:** Emphasize low-latency data processing, resilient error handling, and compliance logging.
- **Example Use Case:** Ingest tick data, normalize, publish via RabbitMQ, and expose aggregated prices through .NET service.

## Behavioral Framing
- **Ownership:** Highlight times you drove initiatives end-to-end—especially performance optimizations or incident response.
- **Collaboration:** Discuss cross-team alignment (e.g., working with QA, DevOps, product).
- **Pressure Handling:** Production outages, tight deadlines—focus on calm triage, communication, and retrospectives.
- **Continuous Improvement:** Automation efforts, reducing manual ops, writing documentation.

---

## Quick Formulas & Snippets
- **Retry with Polly:** `Policy.Handle<HttpRequestException>().WaitAndRetryAsync(...)`
- **Parallel LINQ Caution:** Use PLINQ sparingly; ensure thread safety.
- **SQL Window Example:**
  ```sql
  SELECT AccountId, TradeId, Price,
         ROW_NUMBER() OVER (PARTITION BY AccountId ORDER BY ExecutedAt DESC) AS rn
  FROM Trades
  WHERE ExecutedAt >= DATEADD(day, -7, SYSUTCDATETIME());
  ```
- **Cache-Aside Pattern:** Try cache, fall back to DB, store result with TTL, handle cache invalidation on writes.

---

Keep this cheat sheet nearby as you run through the plan. Update with your own notes if you have time.
