# ⚙️ 3️⃣ Factory Pattern — *Creating platform-specific handlers*

> Centralize creation of objects (like API handlers or executors) based on configuration or environment.

---

### 🧩 Example — Trading platform executor factory

```csharp
public interface ITradeExecutor
{
    void Execute(Order order);
}

public class Mt4Executor : ITradeExecutor
{
    public void Execute(Order order) =>
        Console.WriteLine($"[MT4] Executing {order.Symbol}");
}

public class Mt5Executor : ITradeExecutor
{
    public void Execute(Order order) =>
        Console.WriteLine($"[MT5] Executing {order.Symbol}");
}

public static class ExecutorFactory
{
    public static ITradeExecutor Create(string platform) => platform switch
    {
        "MT4" => new Mt4Executor(),
        "MT5" => new Mt5Executor(),
        _ => throw new ArgumentException("Unknown platform")
    };
}

// --- Usage ---
var platform = "MT5";
var executor = ExecutorFactory.Create(platform);
executor.Execute(new Order { Symbol = "USDJPY", Amount = 5000 });
```

✅ **Why it matters:**

* Simplifies platform switching (MT4, MT5, FIX, cTrader).
* New platforms require no refactor — just a new class and switch entry.

---
