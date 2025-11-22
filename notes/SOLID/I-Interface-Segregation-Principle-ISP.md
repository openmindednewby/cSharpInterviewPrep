## **I — Interface Segregation Principle (ISP)**

> “Clients should not be forced to depend on methods they do not use.”

### ❌ Bad example:

```csharp
public interface ITradingPlatform
{
    void ExecuteOrder(Order order);
    void StreamMarketData();
    void SendNotification();
}
```

Each implementation is forced to implement everything, even if it doesn’t need to.

### ✅ Good example:

```csharp
public interface ITradeExecutor { void ExecuteOrder(Order order); }
public interface IMarketDataFeed { void StreamMarketData(); }
public interface INotifier { void SendNotification(); }
```

💡 **In trading:**

* `IPriceFeed` for market data
* `ITradeExecutor` for execution
* `IRiskService` for validation

You can plug each service independently into different workflows.
