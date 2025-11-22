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
