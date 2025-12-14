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

## Questions & Answers

**Q: How do you recognize SRP violations?**

A: When a class changes for multiple reasons—new logging needs, validation tweaks, and execution rules all touching the same file. High churn and wide unit tests are red flags.

**Q: How does SRP improve deploy cadence?**

A: Focused classes let teams modify one area without risk to others, reducing merge conflicts and enabling independent deployments with fewer regression tests.

**Q: Can a class coordinate other classes and still obey SRP?**

A: Yes, if its sole reason is orchestration. For example, `OrderProcessor` can call validator, risk, and executor; its responsibility is orchestration, not validation logic itself.

**Q: How does SRP influence folder/project structure?**

A: Group types by feature/use case, not by type (e.g., `Orders/OrderValidator.cs`). This keeps responsibilities cohesive and discoverable.

**Q: What role do interfaces play in SRP?**

A: Interfaces define focused contracts (`IOrderValidator`, `IRiskService`), ensuring implementations stay narrow and substitution-friendly.

**Q: How do you refactor SRP violations safely?**

A: Extract class responsibilities incrementally, add unit tests, and use DI to wire new components. Feature toggles can help decouple releases.

**Q: Can modules (not just classes) violate SRP?**

A: Absolutely. Services that mix API logic, data access, and scheduling also violate SRP; break them into modules or microservices with single purposes.

**Q: How does SRP impact observability?**

A: Focused components emit targeted metrics/logs, making it easier to pinpoint issues (e.g., validation vs execution failures).

**Q: What tooling catches SRP issues?**

A: Static analysis for cyclomatic complexity, architecture tests (NetArchTest), and code reviews that demand clear reasons-to-change statements.

**Q: How do you communicate SRP to non-technical stakeholders?**

A: Describe it as separating responsibilities like accounting vs trading—each workflow has its own owner, reducing risk when requirements change.
