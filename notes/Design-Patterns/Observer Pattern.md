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
