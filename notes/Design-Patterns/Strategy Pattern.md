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

## Questions & Answers

**Q: When do you apply the Strategy pattern?**

A: When behavior varies by configuration, tenant, or runtime data (e.g., aggressive vs passive execution) and you want to encapsulate algorithms behind a shared interface instead of branching all over the codebase.

**Q: How do you select a strategy at runtime?**

A: Inject a factory that chooses the correct `ITradeStrategy` based on market conditions, order metadata, or feature flags. Strategies can be swapped via DI or resolved dynamically.

**Q: How does Strategy differ from State?**

A: Strategy changes behavior per request/order; State models transitions over time. Strategy is stateless and pluggable, whereas State encapsulates transitions inside the object.

**Q: How do you unit test strategies?**

A: Instantiate each strategy with fake dependencies and assert their behavior independently. Tests stay small because the interface isolates algorithms from the rest of the system.

**Q: What happens when strategy selection itself becomes complex?**

A: Combine Strategy with Factory or Specification. The factory encapsulates selection logic; strategies stay focused on execution.

**Q: How do you prevent strategy explosion?**

A: Group related variations via configuration or policy objects, and extract shared behavior into base classes or decorators. Only add new strategies when behavior genuinely differs.

**Q: Can strategies maintain state?**

A: They should be stateless or encapsulate state tightly (e.g., cached calculations). For long-lived state machines, consider the State pattern or per-order context objects passed into strategies.

**Q: How does dependency injection help?**

A: Register strategies and inject them via constructor or keyed services, enabling easy swapping in tests and runtime. Feature flags can toggle which strategy is resolved.

**Q: How do strategies interact with telemetry?**

A: Decorate strategies or wrap them with interceptors to log execution time and outcomes. This keeps telemetry consistent regardless of which strategy executed.

**Q: What’s the performance impact?**

A: Minimal—just an extra virtual call. The clarity and extensibility gained typically outweigh the small overhead, especially compared to complex branching logic.
