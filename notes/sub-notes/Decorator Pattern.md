
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