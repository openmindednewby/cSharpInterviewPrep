# ⚙️ 2️⃣ Observer Pattern — *Market data broadcast*

> Let multiple subscribers react to market data updates in real-time.

---

### 🧩 Example — PriceFeed with multiple subscribers

```csharp
public class Tick
{
    public string Symbol { get; init; }
    public double Bid { get; init; }
    public double Ask { get; init; }
}

public class PriceFeed
{
    public event Action<Tick>? OnTick;

    public void Publish(Tick tick)
    {
        OnTick?.Invoke(tick);
    }
}

// --- Observers ---
public class ChartService
{
    public void Subscribe(PriceFeed feed) => feed.OnTick += Display;

    private void Display(Tick tick)
        => Console.WriteLine($"Chart updated: {tick.Symbol} = {tick.Bid}/{tick.Ask}");
}

public class AlertService
{
    public void Subscribe(PriceFeed feed) => feed.OnTick += Alert;

    private void Alert(Tick tick)
    {
        if (tick.Bid > 1.25)
            Console.WriteLine($"🚨 Alert: {tick.Symbol} > 1.25");
    }
}

// --- Usage ---
var feed = new PriceFeed();
var chart = new ChartService();
var alert = new AlertService();

chart.Subscribe(feed);
alert.Subscribe(feed);

feed.Publish(new Tick { Symbol = "GBPUSD", Bid = 1.2520, Ask = 1.2522 });
```

✅ **Why it matters:**

* Perfect for **real-time streaming** (price feeds, notifications, updates).
* Loose coupling between publisher and subscribers.
* Scales to multiple observers (UI, loggers, analytics, etc.).

---

## Questions & Answers

**Q: When do you reach for the Observer pattern in .NET systems?**

A: Whenever multiple components need to react to the same event stream—market ticks, order fills, health changes—without tight coupling. It decouples publishers from subscribers so you can add/remove listeners without touching producers.

**Q: How does Observer compare to pub/sub messaging?**

A: Observer is in-process and synchronous (events raised inside the same app), while pub/sub uses brokers for cross-process communication. Start with Observer for local notifications; graduate to brokers (RabbitMQ, Kafka) for distributed systems.

**Q: How do you prevent event handlers from crashing the publisher?**

A: Wrap subscriber invocations in try/catch, run them asynchronously, or use mediator pipelines that isolate failures. Consider `IObservable<T>` + Rx to provide built-in error handling semantics.

**Q: How do you unsubscribe to avoid memory leaks?**

A: Keep references to event handlers and detach them (`feed.OnTick -= handler`). With `IObservable<T>`, dispose the subscription. In DI scenarios, use weak references or lifetime-managed subscriptions.

**Q: When would you use `IObservable<T>`/Reactive Extensions instead of custom events?**

A: When you need advanced operators (buffering, throttling, filtering) or asynchronous streams. Rx provides a richer API and backpressure controls.

**Q: How do you scale observers across services?**

A: Push ticks to a message broker (RabbitMQ topics, Kafka) and let downstream services subscribe. The Observer concept still applies, but the transport ensures durability and fan-out across machines.

**Q: How do you ensure observers don’t block the publisher?**

A: Execute callbacks on thread pool tasks, channels, or use asynchronous event handlers returning `Task`. Alternatively, push events into bounded queues so slow consumers don’t back up producers.

**Q: What patterns pair well with Observer?**

A: Combine with Strategy (different reaction logic per subscriber), Decorator (add logging around event handling), or CQRS (publish domain events that feed read models).

**Q: How do you test observers?**

A: Subscribe fake handlers or use spies to capture events, then assert they received the expected sequence when the publisher produces certain ticks.

**Q: How do you handle ordering guarantees?**

A: Document whether observers receive events in publish order; if ordering matters, process events synchronously per subscriber or use ordered queues. For distributed observers, leverage partitions/keys to maintain order.
