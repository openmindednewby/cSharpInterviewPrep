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
