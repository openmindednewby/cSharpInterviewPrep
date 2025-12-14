## **O — Open/Closed Principle (OCP)**

> “Software entities should be open for extension but closed for modification.”

You should add new behavior **without editing existing code**.

### ✅ Example: New trade execution channels

```csharp
public interface ITradeExecutor
{
    void Execute(Order order);
}

public class Mt4Executor : ITradeExecutor
{
    public void Execute(Order order) => Console.WriteLine("MT4 order executed");
}

public class Mt5Executor : ITradeExecutor
{
    public void Execute(Order order) => Console.WriteLine("MT5 order executed");
}

// Add new platform without touching existing code
public class TradeService
{
    private readonly ITradeExecutor _executor;
    public TradeService(ITradeExecutor executor) => _executor = executor;

    public void Execute(Order order) => _executor.Execute(order);
}
```

✅ Adding a new trading platform (like cTrader or FIX API) just means creating another `ITradeExecutor` implementation — no code modification, only **extension**.

---

## Questions & Answers

**Q: How do you ensure new features don’t require modifying existing classes?**

A: Depend on abstractions and register new implementations via DI. Use patterns like Strategy or Decorator so new behavior plugs in without touching existing code.

**Q: What signals an OCP violation?**

A: If every new platform or workflow requires editing the same switch statement or base class, you’re modifying existing code instead of extending via new types.

**Q: How do feature flags interact with OCP?**

A: Feature flags can select between implementations at runtime without modifying code. Register both paths and toggle via configuration, respecting OCP.

**Q: How do you balance OCP with readability?**

A: Don’t over-abstract. Introduce extension points only when change pressure exists. Keep base abstractions small so extensions remain straightforward.

**Q: How does OCP apply to APIs?**

A: Version APIs instead of changing contracts. Add new endpoints or fields while keeping existing behavior untouched to avoid breaking clients.

**Q: What tooling helps enforce OCP?**

A: Architecture tests verifying dependencies, code analyzers warning on large switch statements, and DI/registration conventions that encourage extending via new classes.

**Q: How do templates or generics aid OCP?**

A: Generics let you inject behavior (e.g., `IRepository<T>`) without rewriting code for each type. Base functionality stays closed; new types extend usage.

**Q: How do you vet extension points for security/compliance?**

A: Document allowed extensions, run threat modeling on new implementations, and add automated tests to ensure they honor validation/risk rules like existing types.

**Q: Can configuration count as “extension”?**

A: If behavior is data-driven (rules engine, config-based workflows), adding entries might be enough. Ensure validation guards keep config changes safe.

**Q: How does OCP help with plugin architectures?**

A: Plugins implement known interfaces and register themselves. The host never changes; you drop in new assemblies to extend behavior safely.
