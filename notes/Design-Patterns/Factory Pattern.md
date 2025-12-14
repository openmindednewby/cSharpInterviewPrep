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

## Questions & Answers

**Q: When should you use a Factory pattern in .NET services?**

A: When object creation depends on runtime context (config, tenant, instrument) and you want to isolate creation logic from consumers. Factories prevent scattered `new` calls and keep construction consistent.

**Q: How does DI interact with factories?**

A: You can register implementations in DI and inject `Func<Key, ITradeExecutor>` or an `IExecutorFactory` that resolves services by key. This keeps factories composable with scoped dependencies.

**Q: How do you avoid giant switch statements as platforms grow?**

A: Use a dictionary of delegates, reflection-based registration, or DI `IServiceProvider` lookups keyed by platform. Alternatively, combine with the Strategy pattern so each executor registers itself.

**Q: What’s the benefit of abstract factories?**

A: When you need to create families of related objects (e.g., executor + validator + serializer per platform), an abstract factory ensures compatible components are produced together.

**Q: How do factories aid testing?**

A: Tests can inject fake factories returning mock executors, isolating code under test without hitting real integrations. It also simplifies verifying that the correct executor is chosen for a scenario.

**Q: How do you handle configuration-driven factories?**

A: Load mappings from configuration or feature flags, then let the factory instantiate types via DI. This enables runtime toggles (e.g., route VIP tenants to a premium executor) without code changes.

**Q: When is the factory pattern overkill?**

A: When only two concrete types exist and creation logic is trivial. Start simple, and introduce a factory once switching logic repeats or needs shared validation/logging.

**Q: How do you ensure factories remain SRP-compliant?**

A: Keep them focused on creation. Any orchestration, validation, or logging should be delegated to other components or decorators so factories don't become god objects.

**Q: Can factories return async results?**

A: Yes—define methods returning `Task<T>` if creation involves I/O (e.g., pulling secrets). Just ensure callers understand the lifecycle and avoid blocking `.Result`.

**Q: How do you register factories in DI?**

A: Register each concrete type and a factory delegate: `services.AddTransient<ExecutorFactory>();` or `services.AddSingleton<Func<string, ITradeExecutor>>(provider => key => provider.GetRequiredKeyedService<ITradeExecutor>(key));`.
