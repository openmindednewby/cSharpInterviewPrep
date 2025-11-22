# 🧠 1️⃣ SOLID Principles — Deep Dive with Examples

---

## **S — Single Responsibility Principle (SRP)**

> “A class should have one and only one reason to change.”

### ❌ Bad example:

```csharp
public class TradeManager
{
    public void ValidateOrder(Order order) { /* ... */ }
    public void ExecuteOrder(Order order) { /* ... */ }
    public void LogOrder(Order order) { /* ... */ }
}
```

One class does *too much*: validation, execution, and logging.
Changing any of these reasons breaks others.

### ✅ Good example:

```csharp
public class OrderValidator
{
    public bool Validate(Order order) => order.Amount > 0;
}

public class OrderExecutor
{
    private readonly ITradeGateway _gateway;
    public OrderExecutor(ITradeGateway gateway) => _gateway = gateway;

    public void Execute(Order order)
    {
        _gateway.SendOrder(order);
    }
}

public class OrderLogger
{
    public void Log(Order order) => Console.WriteLine($"Executed {order.Id}");
}
```

👉 Each class does one thing — easier to test, maintain, and evolve.

💡 **In trading systems:**

* Separate **validation**, **risk checks**, and **execution**.
* Each layer can evolve independently (e.g., compliance rules, broker APIs).

---

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

## **L — Liskov Substitution Principle (LSP)**

> “Derived classes should be substitutable for their base classes.”

Derived classes must behave consistently with their base abstraction.

### ❌ Bad example:

```csharp
public abstract class Order
{
    public abstract void Cancel();
}

public class MarketOrder : Order
{
    public override void Cancel() => Console.WriteLine("Cancelled");
}

public class InstantOrder : Order
{
    public override void Cancel() => throw new NotSupportedException();
}
```

❌ Violates LSP — an `InstantOrder` cannot cancel, so substituting it breaks code.

### ✅ Good example:

```csharp
public interface ICancelableOrder
{
    void Cancel();
}
public class MarketOrder : ICancelableOrder { public void Cancel() { /* ... */ } }
```

💡 **In trading systems:**
If you design a `Strategy` base class, ensure all derived strategies behave consistently and safely under the same interface.

---

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

---

## **D — Dependency Inversion Principle (DIP)**