
# ⚙️ 5️⃣ Decorator Pattern — *Add logging, caching, retries dynamically*

> Wrap existing services with additional behavior without changing them.

---

### 🧩 Example — Logging + Caching decorators for an API service

```csharp
public interface IPriceService
{
    double GetPrice(string symbol);
}

public class RealPriceService : IPriceService
{
    public double GetPrice(string symbol)
    {
        Console.WriteLine($"Fetching {symbol} from API...");
        return symbol switch
        {
            "EURUSD" => 1.0745,
            "GBPUSD" => 1.2459,
            _ => 0.0
        };
    }
}

// --- Logging decorator ---
public class LoggingPriceService : IPriceService
{
    private readonly IPriceService _inner;
    public LoggingPriceService(IPriceService inner) => _inner = inner;

    public double GetPrice(string symbol)
    {
        Console.WriteLine($"[LOG] Requesting {symbol}");
        var price = _inner.GetPrice(symbol);
        Console.WriteLine($"[LOG] {symbol} = {price}");
        return price;
    }
}

// --- Caching decorator ---
public class CachingPriceService : IPriceService
{
    private readonly IPriceService _inner;
    private readonly Dictionary<string, double> _cache = new();

    public CachingPriceService(IPriceService inner) => _inner = inner;

    public double GetPrice(string symbol)
    {
        if (_cache.TryGetValue(symbol, out var cached))
            return cached;

        var price = _inner.GetPrice(symbol);
        _cache[symbol] = price;
        return price;
    }
}

// --- Usage ---
var service = new LoggingPriceService(new CachingPriceService(new RealPriceService()));

Console.WriteLine(service.GetPrice("EURUSD"));
Console.WriteLine(service.GetPrice("EURUSD")); // second call cached
```

✅ **Why it matters:**

* Wraps cross-cutting behavior (logging, caching, retries, metrics) around core logic.
* Keeps core services clean and focused.
* Combine decorators freely (e.g., logging → caching → retry).

---

# 🧱 BONUS: How these patterns fit together (in a trading system)

| Concern                        | Pattern       | Purpose                                |
| ------------------------------ | ------------- | -------------------------------------- |
| Different execution algorithms | **Strategy**  | Swap trading logic dynamically         |
| Market data distribution       | **Observer**  | Publish ticks to multiple consumers    |
| Platform creation              | **Factory**   | Choose MT4/MT5/FIX handler dynamically |
| Read/write separation          | **CQRS**      | Separate trading commands from queries |
| Cross-cutting features         | **Decorator** | Add logging, caching, retries safely   |

---

## Questions & Answers

**Q: Why use decorators instead of inheritance for cross-cutting behavior?**

A: Decorators wrap existing implementations at runtime without modifying classes or exploding inheritance hierarchies. They preserve the original behavior and let you compose features like logging, caching, and retries in any order.

**Q: How do you wire decorators with ASP.NET Core DI?**

A: Register the core implementation and then use `services.Decorate<IPriceService, LoggingPriceService>();` (via Scrutor) or manual factory delegates to wrap dependencies in the desired order.

**Q: How do decorators interact with async services?**

A: Implement `Task`-returning methods and ensure decorators await the inner call, adding behavior before/after. For example, a retry decorator can wrap `await _inner.ExecuteAsync(...)` in Polly policies.

**Q: How do you prevent duplicate decoration?**

A: Centralize registration so each service gets decorated once. Use DI scanning rules or tests to ensure there’s a single decorator pipeline per service type.

**Q: When does the decorator pattern become overkill?**

A: If you only need a single concern (e.g., logging) or behavior is global (middleware), decorators might be unnecessary. Use them when behaviors vary per service or must be combined flexibly.

**Q: How does decorator order affect behavior?**

A: Order matters—logging outside caching sees all calls, while caching outside logging hides repeated hits. Be intentional about stacking order and document expectations.

**Q: How do you share state between decorators?**

A: Pass shared dependencies (e.g., metrics registry) into each decorator via DI, or include context objects in method parameters so decorators can enrich them without coupling.

**Q: Can decorators modify return types?**

A: They should adhere to the same interface, but they can wrap results (e.g., attach metadata) or transform responses before returning. Keep transformations predictable so callers aren’t surprised.

**Q: How do you unit test decorators?**

A: Provide a fake inner service and assert the decorator calls it and adds the expected behavior (logging, caching, etc.). Since decorators depend on the same interface, tests remain simple.

**Q: How do decorators compare to middleware?**

A: Middleware operates at the application pipeline level (HTTP). Decorators operate at service boundaries, allowing fine-grained per-service behavior and reusability outside web pipelines.
