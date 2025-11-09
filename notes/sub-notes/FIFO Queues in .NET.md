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
