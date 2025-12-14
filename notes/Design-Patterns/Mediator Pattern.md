# ⚙️ 2️⃣ Mediator Pattern — *Decouple components by introducing a controller* 

![alt text](image.png)

> Define an object that encapsulates how a set of objects interact. The mediator promotes loose coupling by keeping objects from referring to each other explicitly.

---

### 🧩 Example — Mediator coordinating order validation, risk and execution

```csharp
public interface ITradeMediator
{
    void Notify(object sender, string ev, Order order);
}

public class TradeMediator : ITradeMediator
{
    private readonly OrderValidator _validator;
    private readonly RiskService _risk;
    private readonly TradeExecutor _executor;

    public TradeMediator(OrderValidator validator, RiskService risk, TradeExecutor executor)
    {
        _validator = validator;
        _risk = risk;
        _executor = executor;
    }

    public void Notify(object sender, string ev, Order order)
    {
        if (ev == "PlaceOrder")
        {
            if (!_validator.Validate(order))
            {
                Console.WriteLine("Validation failed");
                return;
            }

            if (!_risk.Check(order))
            {
                Console.WriteLine("Risk check failed");
                return;
            }

            _executor.Execute(order);
        }
    }
}

public class OrderValidator
{
    private readonly ITradeMediator _mediator;
    public OrderValidator(ITradeMediator mediator) => _mediator = mediator;
    public bool Validate(Order order) => order != null && order.Amount > 0;
}

public class RiskService
{
    private readonly ITradeMediator _mediator;
    public RiskService(ITradeMediator mediator) => _mediator = mediator;
    public bool Check(Order order) => order.Amount <= 100000; // simple rule
}

public class TradeExecutor
{
    private readonly ITradeMediator _mediator;
    public TradeExecutor(ITradeMediator mediator) => _mediator = mediator;
    public void Execute(Order order) => Console.WriteLine($"Executed {order.Id} for {order.Amount}");
}

// --- Usage ---
// Compose mediator with concrete components
// var mediator = new TradeMediator(new OrderValidator(null), new RiskService(null), new TradeExecutor(null));
// Wire mediator into components and use mediator.Notify(this, "PlaceOrder", order);
```

✅ **Why it matters:**

* Centralizes interaction logic between components (validation, risk, execution).
* Reduces direct dependencies between components, improving testability and maintainability.
* Makes it easier to change coordination rules without touching each component.

---

## Questions & Answers

**Q: What problem does the Mediator pattern solve?**

A: It avoids spaghetti dependencies among collaborating components (validator, risk, executor) by centralizing communication in a mediator. Components interact via the mediator instead of referencing each other directly.

**Q: How does MediatR implement the Mediator pattern in .NET?**

A: MediatR routes requests (commands/queries/notifications) to their handlers through a central mediator, letting senders remain unaware of receivers. Pipeline behaviors provide cross-cutting features without tight coupling.

**Q: When would you build a custom mediator vs using MediatR?**

A: Use MediatR for request/response flows in application layers. Build custom mediators when orchestrating domain services with bespoke protocols or when you need full control over orchestration semantics.

**Q: How do mediators improve testability?**

A: Components depend only on the mediator interface, so tests can supply stub mediators to assert interactions. You can validate coordination logic by testing the mediator in isolation.

**Q: What’s a downside of mediators?**

A: The mediator can become a god object if it accumulates too much logic. Mitigate by splitting mediators per feature or layering policies/pipeline behaviors to keep responsibilities focused.

**Q: How do you prevent mediator logic from duplicating domain rules?**

A: Keep mediators focused on coordination (who to notify next) and delegate business invariants to domain services/entities. If logic belongs to the domain, move it there rather than hiding it in the mediator.

**Q: How do you handle asynchronous workflows with a mediator?**

A: Define async methods (`Task NotifyAsync(...)`) and await dependent operations. MediatR supports async handlers out of the box, ensuring non-blocking orchestration.

**Q: What patterns complement mediators?**

A: Combine with CQRS (commands/queries flow through the mediator), decorators (pipeline behaviors like logging/validation), and event sourcing (mediator publishes domain events).

**Q: How can mediators support extensibility?**

A: Register handlers or collaborators via DI so new behaviors can be added without changing existing code. For example, add a compliance handler to the notification pipeline without modifying producer services.

**Q: How do you monitor mediator pipelines?**

A: Instrument pipeline behaviors or interceptors to log request duration, handler outcomes, and errors. This keeps observability centralized and avoids duplicating logging in every handler.
