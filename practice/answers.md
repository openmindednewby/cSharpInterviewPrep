# Practice Question Answers

## LINQ & Collections

1. **Latest trade per account**
   - **Approach:** Sort or group by account and pick the trade with the max timestamp using `GroupBy` + `OrderByDescending`/`MaxBy`. This keeps the logic declarative and pushes the temporal ordering into the query rather than manual loops.
   - **Sample code:**

```csharp
     var latestTrades = trades
         .GroupBy(t => t.AccountId)
         .Select(g => g.OrderByDescending(t => t.Timestamp).First());
```

   - **Use when:** You need the most recent entry per key without mutating state, such as building dashboards or reconciling snapshots.
   - **Avoid when:** The dataset is huge and you'd benefit from streaming/SQL aggregation; consider database query with `ROW_NUMBER` or a materialized view to avoid loading everything into memory.

2. **Flatten nested instrument codes**
   - **Approach:** Use `SelectMany` to flatten while keeping inner order.
   - **Sample code:**

```csharp
     var flat = nestedCodes.SelectMany(list => list);
```

   - **Use when:** You have nested enumerables and simply need to concatenate them.
   - **Avoid when:** You must retain hierarchy boundaries—use nested loops instead.

3. **`SelectMany` vs nested loops**
   - `SelectMany` projects each element to a sequence and flattens; nested loops make iteration explicit and allow more control over flow.
   - **Sample code:**

```csharp
     // SelectMany
     var pairs = accounts.SelectMany(a => a.Orders, (a, o) => new { a.Id, o.Id });

     // Nested loops
     foreach (var a in accounts)
         foreach (var o in a.Orders)
             yield return (a.Id, o.Id);
```

   - **Use `SelectMany` when:** You want a fluent declarative pipeline or need joins.
   - **Use loops when:** Performance-critical, complex control flow, or break/continue needed.

4. **Detect duplicate orders with `GroupBy`**
   - Group by unique order keys and filter groups with count > 1. Summaries can include counts, timestamps, and other aggregate metadata that drive remediation.
   - **Sample code:**

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

   - **Use when:** You need summaries and easy grouping.
   - **Avoid when:** Data volume exceeds in-memory capabilities—use database aggregates or streaming dedup.

## Async & Resilience

1. **Parallel REST calls with cancellation**
   - **Approach:** Use `Task.WhenAll` with `CancellationTokenSource` + timeout. Ensure the `HttpClient` is a singleton to avoid socket exhaustion and that partial results are handled gracefully when cancellation occurs.
   - **Sample code:**

```csharp
     using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(3));
     var tasks = endpoints.Select(url => httpClient.GetStringAsync(url, cts.Token));
     string[] responses = await Task.WhenAll(tasks);
```

   - **Use when:** Limited number of independent calls; want fail-fast.
   - **Avoid when:** Endpoints depend on each other or you must gracefully degrade per-call.

2. **Polly retry + circuit breaker**
   - Define policies and wrap HTTP calls.
   - **Sample code:**

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

   - **Use when:** Downstream instability; need resilience.
   - **Avoid when:** Operations must not be retried (e.g., non-idempotent commands without safeguards).

3. **Backpressure handling**
   - Use bounded channels, buffering, or throttling. Consider load shedding by dropping low-priority messages or scaling consumers horizontally when queue lengths grow.
   - **Sample code:**

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

   - **Use when:** Consumer slower than producer; need to avoid overload.
   - **Avoid when:** Throughput must be maximized with zero buffering—consider scaling consumers instead.

4. **`SemaphoreSlim` vs `lock`**
   - `SemaphoreSlim` supports async waiting and throttling concurrency. It can represent both mutual exclusion (1 permit) and limited resource pools (>1 permits).
   - **Sample code:**

```csharp
     private readonly SemaphoreSlim _mutex = new(1, 1);

     public async Task UseSharedAsync()
     {
         await _mutex.WaitAsync();
         try { await SharedAsyncOperation(); }
         finally { _mutex.Release(); }
     }
```

   - **Use `SemaphoreSlim` when:** Async code needs mutual exclusion or limited parallelism.
   - **Avoid when:** Code is synchronous—`lock` has less overhead.

## API & Lifecycle

1. **Middleware pipeline description**
   - Typical order: `UseRouting` → auth middleware → custom exception handling (usually early) → `UseAuthentication`/`UseAuthorization` → endpoint execution. Static file middleware, response compression, and caching can be interleaved before routing.
   - Include correlation logging, caching, validation, and telemetry instrumentation.
   - **Sample code:**

```csharp
     app.UseMiddleware<CorrelationMiddleware>();
     app.UseMiddleware<ExceptionHandlingMiddleware>();
     app.UseRouting();
     app.UseAuthentication();
     app.UseAuthorization();
     app.MapControllers();
```

   - **Use when:** Building consistent request handling.
   - **Avoid when:** For minimal APIs you might use delegate pipeline but still similar.

2. **API versioning**
   - Strategies: URL segment (`/v1/`), header, query string.
   - Use `Asp.Versioning` package.
   - **Sample code:**

```csharp
     services.AddApiVersioning(options =>
     {
         options.DefaultApiVersion = new ApiVersion(1, 0);
         options.AssumeDefaultVersionWhenUnspecified = true;
         options.ReportApiVersions = true;
     });
     services.AddVersionedApiExplorer();
```

   - **Use when:** Breaking changes; maintain backward compatibility by keeping old controllers.
   - **Avoid when:** Internal services with clients you control; choose contract-first to avoid version explosion.

3. **Rate limiting & throttling**
   - Use ASP.NET rate limiting middleware or gateway.
   - Techniques: token bucket, fixed window, sliding window.
   - **Sample code:**

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

   - **Use when:** Protecting downstream resources.
   - **Avoid when:** Latency-critical internal traffic; consider other forms of protection.

4. **Correlation IDs propagation**
   - Generate ID in middleware, add to headers/log context, forward via `HttpClient`. Ensure asynchronous logging frameworks flow the correlation ID across threads (e.g., using `AsyncLocal`).
   - **Sample code:**

```csharp
     context.TraceIdentifier = context.TraceIdentifier ?? Guid.NewGuid().ToString();
     _logger.LogInformation("{CorrelationId} handling {Path}", context.TraceIdentifier, context.Request.Path);
     httpClient.DefaultRequestHeaders.Add("X-Correlation-ID", context.TraceIdentifier);
```

   - **Use when:** Need distributed tracing.
   - **Avoid when:** Truly isolated services—rare.

## System Design

1. **Price Streaming Service**
   - Components: Ingestion (connectors to MT5), normalization workers, cache (Redis), API (REST/WebSocket), persistence. Add replay storage (Kafka topic or time-series DB) for audit and late subscribers.
   - Use message queue (Kafka) for fan-out and resilient decoupling of ingestion from delivery.
   - **Sample pseudo-code:**

```csharp
     while (await mt5Stream.MoveNextAsync())
     {
         var normalized = Normalize(mt5Stream.Current);
         await cache.SetAsync(normalized.Symbol, normalized.Price);
         await hubContext.Clients.Group(normalized.Symbol)
             .SendAsync("price", normalized);
     }
```

   - **Use when:** Need low-latency price dissemination.
   - **Avoid when:** Low-frequency batch updates suffice.

2. **Order Execution Workflow**
   - Steps: receive REST order → validate (risk, compliance) → persist pending state → route to MT4/MT5 → await ack → publish result. Include idempotency keys on inbound requests and a reconciliation process for missing confirmations.
   - Use saga/outbox for reliability and to coordinate compensating actions when downstream legs fail.
   - **Sample flow snippet:**

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

   - **Use when:** Real-time trading with external platforms.
   - **Avoid when:** Simple internal workflows—overkill.

3. **Real-Time Monitoring Dashboard**
   - Collect metrics via OpenTelemetry exporters, push to time-series DB (Prometheus), visualize in Grafana, alert via Alertmanager. Tag metrics with dimensions (service, region, environment) to support slicing and alert thresholds.
   - Include streaming logs via ELK stack and trace sampling via Jaeger/Tempo.
   - **Sample instrumentation:**

```csharp
     var meter = new Meter("Trading.Services");
     var orderLatency = meter.CreateHistogram<double>("order_latency_ms");
     orderLatency.Record(latencyMs, KeyValuePair.Create<string, object?>("service", serviceName));
```

   - **Use when:** Need proactive observability.
   - **Avoid when:** Prototype with low SLA.

4. **Integrating external risk engine**
   - Use async messaging or REST; maintain schema adapters; ensure idempotency. Map risk statuses to domain-specific responses and version contracts to avoid breaking changes.
   - Add caching for rules, circuit breakers, fallback decisions, and health checks to remove unhealthy nodes from rotation.
   - **Sample interaction:**

```csharp
     var riskResponse = await _riskClient.EvaluateAsync(order, ct);
     if (!riskResponse.Approved)
         return OrderDecision.Rejected(riskResponse.Reason);
```

   - **Use when:** External compliance requirement.
   - **Avoid when:** Latency-critical path can't tolerate external dependency—consider in-process rules.

## Messaging & Integration

1. **RabbitMQ vs ZeroMQ**
   - RabbitMQ: brokered, supports persistence, routing, acknowledgments, management UI, plugins.
   - ZeroMQ: brokerless sockets, ultra-low latency but manual patterns, no persistence out of the box.
   - **Use RabbitMQ:** Durable, complex routing, enterprise integration, where administrators need visibility and security.
   - **Use ZeroMQ:** High-throughput, in-process/edge messaging; avoid if you need persistence or central management.

2. **At-least-once with RabbitMQ**
   - Use durable queues, persistent messages, manual ack, idempotent consumers. Enable publisher confirms to ensure the broker persisted the message before acknowledging to the producer.
   - **Sample code:**

```csharp
     channel.BasicConsume(queue, autoAck: false, consumer);
     consumer.Received += (sender, ea) =>
     {
         Handle(ea.Body);
         channel.BasicAck(ea.DeliveryTag, multiple: false);
     };
```

   - **Use when:** You can tolerate duplicates; critical to ensure no loss.
   - **Avoid when:** Exactly-once semantics required—use transactional outbox + dedup.

3. **Saga pattern for account funding**
   - Orchestrator or choreography; manage compensations (reverse ledger entry, refund payment).
   - **Sample orchestrator:**

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

   - **Use when:** Multi-step, distributed transactions.
   - **Avoid when:** Single system handles all steps—simple ACID transaction suffices.

4. **Outbox pattern**
   - Write domain event to outbox table within same transaction, then relay to message bus. A background dispatcher polls the outbox table, publishes events, and marks them as processed (with retries and exponential backoff).
   - **Sample code:**

```csharp
     await using var tx = await db.Database.BeginTransactionAsync();
     order.Status = OrderStatus.Accepted;
     db.Outbox.Add(new OutboxMessage(order.Id, new OrderAccepted(order.Id)));
     await db.SaveChangesAsync();
     await tx.CommitAsync();
```

   - **Use when:** Need atomic DB + message publish.
   - **Avoid when:** No shared database or eventual consistency acceptable without duplication.

## Data Layer

1. **Rolling 7-day trade volume**
   - **SQL:**
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

   - **Use when:** Need rolling metrics in SQL.
   - **Avoid when:** Database lacks window functions—use app-side aggregation.

2. **Normalized vs denormalized**
   - Normalized: reduces redundancy, good for OLTP. Changes cascade predictably, but reporting joins can be expensive.
   - Denormalized: duplicates data for fast reads (reporting, analytics). Updates are more complex; rely on ETL pipelines to keep facts in sync.
   - Choose based on workload: mixed? use hybrid star schema or CQRS approach with read-optimized projections.

3. **Clustered vs non-clustered indexes**
   - Clustered: defines physical order, one per table; great for range scans.
   - Non-clustered: separate structure pointing to data; can include columns.
   - **Covering index example:**
```sql
     CREATE NONCLUSTERED INDEX IX_Orders_Account_Status
         ON Orders(AccountId, Status)
         INCLUDE (CreatedAt, Amount);
```

   - **Use covering index when:** Query needs subset of columns; avoid extra lookups.
   - **Avoid when:** Frequent writes—maintaining many indexes hurts performance.

4. **Handling long-running report query**
   - Strategies: read replicas, materialized views, batching, query hints, schedule off-peak. Consider breaking the query into smaller windowed segments and streaming results to avoid locking.
   - Implement caching, pre-aggregation, and monitor execution plans for regressions.

## Trading Domain Knowledge

1. **Forex trade lifecycle**
   - Steps: quote, order placement, validation, routing, execution (fill/partial), confirmation, settlement (T+2), P&L updates. Post-trade, apply trade capture in back-office systems and reconcile with liquidity providers.
   - Include margin checks and clearing, corporate actions, and overnight financing (swap) adjustments.

2. **Integrating with MT4/MT5**
   - Use MetaTrader Manager/Server APIs via C# wrappers; handle session auth, keep-alive, throttle requests. Manage connections via dedicated service accounts and pre-allocate connection pools.
   - Implement reconnect logic, map errors, ensure idempotent order submission. Translate MT-specific error codes into domain-level responses for clients.
   - **Sample pseudo-code:**

```csharp
     using var session = new Mt5Gateway(credentials);
     await session.ConnectAsync();
     var ticket = await session.SendOrderAsync(request);
```

3. **Risk checks before execution**
   - Margin availability, max exposure per instrument, credit limits, duplicate orders, fat-finger (price deviation).
   - Implement pre-trade risk service.

4. **Handling market data bursts**
   - Use batching, diff updates, UDP multicast ingestion, prioritized queues, snapshot + incremental updates. Utilize adaptive sampling—send every tick to VIP clients while throttling retail feeds.
   - Apply throttling per client, drop non-critical updates after stale, and monitor queue depths to trigger auto-scaling.

## Behavioral & Soft Skills

1. **Leading production fix**
   - Discuss scenario: triage, swarm, communication, root cause, postmortem. Highlight proactive rollback plans and customer communication cadence.

2. **Process automation improvement**
   - Example: build CI pipeline, reduce manual deployment, measured time saved. Emphasize KPIs such as deployment frequency and lead time.

3. **Team conflict resolution**
   - Example: align on goals, active listening, data-driven decision, mediation. Demonstrate neutral facilitation and follow-up agreements.

4. **Commitment to documentation**
   - Example: created runbooks, knowledge base, improved onboarding. Include metrics such as onboarding time reduction and support ticket deflection.
