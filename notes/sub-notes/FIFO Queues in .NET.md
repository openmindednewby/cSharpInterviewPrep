# FIFO Queues in .NET

- **Definition:** *First-In, First-Out* data structure where the earliest enqueued item is dequeued first.
- **API Surface:** Use `Queue<T>` for in-memory work, `Channel<T>` for async producers/consumers, and `ConcurrentQueue<T>` in multi-threaded scenarios.

```csharp
var orders = new Queue<Order>();
orders.Enqueue(new Order("EURUSD", 1_000_000m));
orders.Enqueue(new Order("GBPUSD", 750_000m));

while (orders.TryDequeue(out var next))
{
    await _executionService.ExecuteAsync(next);
}
```

> ⚙️ **Threading Tip:** Prefer `Channel<T>` or `System.Threading.Channels` when you need async waiting rather than spin-checking a `Queue<T>`.

---

## Questions & Answers

**Q: When should you use `Queue<T>` vs `ConcurrentQueue<T>`?**

A: Use `Queue<T>` for single-threaded scenarios. Use `ConcurrentQueue<T>` when multiple threads enqueue/dequeue concurrently, but note it lacks blocking reads.

**Q: Why choose `Channel<T>` over `BlockingCollection<T>`?**

A: `Channel<T>` supports async producers/consumers, backpressure, and high performance without legacy `BlockingCollection` overhead. It integrates well with async/await.

**Q: How do you implement backpressure with FIFO queues?**

A: Use bounded `Channel<T>` so producers await when the queue is full, preventing memory blowups and throttling upstream systems.

**Q: How do you ensure ordering when scaling consumers?**

A: Single consumer preserves strict FIFO. If you scale out, partition by key (e.g., account ID) so each partition maintains order, or accept eventual ordering per partition only.

**Q: How do you persist FIFO semantics across process restarts?**

A: Use durable queues (RabbitMQ, Azure Service Bus) with FIFO support, or persist queue state in a database/outbox to resume processing after failure.

**Q: What’s the cost of peeking?**

A: `Queue<T>.Peek()` is O(1) and non-destructive. For channels, peeking isn’t supported; you’d need to buffer manually if you must inspect before processing.

**Q: How do you avoid busy-wait loops with `Queue<T>`?**

A: Use synchronization primitives (`SemaphoreSlim`, `AutoResetEvent`) or switch to `Channel<T>`/`BlockingCollection<T>` which provide blocking/async waits.

**Q: How do FIFO queues interact with metrics?**

A: Track enqueue/dequeue rates, queue length, and processing latency. Alert when queue length grows unexpectedly—indicates downstream slowness.

**Q: How do you handle poison messages?**

A: Implement retries with exponential backoff, move failures to a dead-letter queue, and avoid blocking the FIFO by skipping or quarantining bad entries.

**Q: How do you throttle producers?**

A: Combine bounded channels with `SemaphoreSlim` or token buckets. Producers await when the channel is full, smoothing load on downstream services.
