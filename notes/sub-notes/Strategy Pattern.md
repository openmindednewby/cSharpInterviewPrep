# ⚙️ 1️⃣ Strategy Pattern — *Switching trading logic at runtime*

> Encapsulate different trading algorithms or execution strategies under a common interface.

---

### 🧩 Example — Switching between Aggressive and Passive strategies

```csharp
public interface ITradeStrategy
{
    void Execute(Order order);
}

public class AggressiveStrategy : ITradeStrategy
{
    public void Execute(Order order)
    {
        Console.WriteLine($"[Aggressive] Sending order {order.Symbol} immediately at market price");
    }
}

public class PassiveStrategy : ITradeStrategy
{
    public void Execute(Order order)
    {
        Console.WriteLine($"[Passive] Placing limit order for {order.Symbol} to wait for better price");
    }
}

public class Trader
{
    private readonly ITradeStrategy _strategy;

    public Trader(ITradeStrategy strategy) => _strategy = strategy;

    public void Trade(Order order) => _strategy.Execute(order);
}

// --- Usage ---
var order = new Order { Symbol = "EURUSD", Amount = 1000 };
var trader = new Trader(new AggressiveStrategy());
trader.Trade(order); // can switch strategy dynamically
```

✅ **Why it matters:**

* Switch trading behaviors (aggressive, passive, hedging) dynamically.
* Avoids `if/else` hell.
* New strategies plug in easily without code modification.

---
