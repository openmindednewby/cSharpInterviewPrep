# Core Concepts Cheat Sheet

Use these snapshots alongside the [prep plan](../prep-plan.md). Each section includes talking points, tips, and quick reminders tailored to the HFM Senior C#/.NET role.

---

## Runtime & Language Essentials
- **.NET Core vs .NET Framework:** Cross-platform, improved performance, self-contained deployments, side-by-side versioning. Mention Kestrel, GC enhancements, and trimming for services.
- **CLR & GC:** Generational GC, LOH, server vs workstation modes. Explain how to reduce allocations and when to use `Span<T>`.
- **Async/Await:** State machine generation, context capture, `ConfigureAwait(false)` for libraries, exception propagation via `Task`. Be ready to discuss deadlocks and the benefits of I/O-bound async.
- **Value vs Reference Types:** Stack vs heap semantics, boxing/unboxing costs, use `struct` for small immutable data. Mention `record struct` for value semantics.
- **Collections & LINQ:** Deferred execution, `IEnumerable` vs `IQueryable`, avoiding multiple enumerations, and when to materialize with `ToList()`.

## Architecture & Patterns
- **SOLID:**
  - *Single Responsibility:* Keep classes focused; e.g., split order validation from execution.
  - *Open/Closed:* Extend via interfaces/inheritance; plug new execution channels without touching existing code.
  - *Liskov Substitution:* Ensure derived classes honor base contracts—critical for strategy objects.
  - *Interface Segregation:* Prefer fine-grained service contracts (e.g., `IPriceFeed`, `ITradeExecutor`).
  - *Dependency Inversion:* Depend on abstractions; mention DI containers.
- **Patterns to Highlight:** Strategy (switching trading logic), Observer (market data broadcast), Factory (creating platform-specific handlers), CQRS (command/query split for trading ops), Decorator (enriching services with logging/caching).
- **Clean Architecture:** Emphasize domain-driven layers, application services, and infrastructure adapters.

## ASP.NET Core & Service Design
- **Pipeline:** Middleware order, short-circuiting, exception handling, logging. Mention custom middleware for correlation IDs.
- **Dependency Injection:** Service lifetimes—singleton (stateless), scoped (per request), transient (lightweight). Know pitfalls of capturing scoped services in singletons.
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
