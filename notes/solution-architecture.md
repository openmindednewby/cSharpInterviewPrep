# Solution Architecture - Structuring Code and Use Cases

> Organize code by business boundaries so change stays local, testable, and easy to reason about.

---

## Quick Overview

- **Clean Architecture:** Layered design with dependencies pointing inward; stable core, replaceable outer layers.
- **DDD (Domain-Driven Design):** Model the business with bounded contexts, aggregates, and ubiquitous language.
- **Vertical Slices:** Organize by feature/use case instead of technical layers to minimize cross-cutting changes.
- **MVVM:** UI architecture for desktop/mobile apps (WPF/MAUI); separates view, state, and behavior.
- **You can combine them:** DDD inside Clean Architecture, vertical slices inside the Application layer, MVVM in the UI.

---

## Detailed Explanation

### Clean Architecture (Layered, Dependencies Inward)

**What it is:** A layered architecture where the Domain has zero dependencies. Application orchestrates use cases. Infrastructure and UI sit on the outside.

```
+-------------------------------+
|     Presentation / UI         |
+-------------------------------+
|       Application             |  Use cases, CQRS handlers
+-------------------------------+
|          Domain               |  Entities, Value Objects
+-------------------------------+
|       Infrastructure          |  DBs, brokers, APIs
+-------------------------------+
```

**Use it when:** You have long-lived business rules and want infrastructure swaps (SQL, Kafka, MT5 bridges) without touching domain logic.

**Trade-offs:** More projects and abstractions; can be overkill for tiny apps.

---

### Domain-Driven Design (DDD)

**What it is:** A modeling approach that focuses on the business language and boundaries.

**Core elements:**
- **Bounded Contexts:** Clear ownership boundaries (e.g., Orders, Risk, Pricing).
- **Aggregates:** Consistency boundaries with invariants enforced in one place.
- **Ubiquitous Language:** Shared vocabulary with business + engineering.

**Use it when:** The domain is complex and business rules change often (trading rules, risk limits, compliance).

**Trade-offs:** Requires strong collaboration and discipline; adds modeling overhead.

---

### Vertical Slice Architecture

**What it is:** Organize code by feature/use case so each slice includes its handler, validation, and DTOs.

```
Application/
  Orders/
    PlaceOrder/
      PlaceOrderCommand.cs
      PlaceOrderHandler.cs
      PlaceOrderValidator.cs
      PlaceOrderDto.cs
```

**Benefits:**
- Change stays in one folder (low cognitive load).
- Tests and handlers stay close to their use case.
- Avoids over-abstraction by feature.

**Trade-offs:** Can duplicate infrastructure concerns if you skip shared abstractions.

---

### MVVM (Model-View-ViewModel)

**What it is:** UI pattern for desktop/mobile apps where the View binds to a ViewModel (state + commands).

```
View  <->  ViewModel  <->  Model
XAML       C# state        Domain/DTOs
```

**Use it when:** You need testable UI logic and clean separation in WPF/MAUI apps.

**Trade-offs:** Extra plumbing for bindings and property change notifications.

---

## Example - Vertical Slice Use Case

```csharp
// Application/Orders/PlaceOrder/PlaceOrderCommand.cs
public sealed record PlaceOrderCommand(string Symbol, decimal Quantity) : IRequest<Guid>;

// Application/Orders/PlaceOrder/PlaceOrderHandler.cs
public sealed class PlaceOrderHandler : IRequestHandler<PlaceOrderCommand, Guid>
{
    private readonly IOrderRepository _orders;

    public PlaceOrderHandler(IOrderRepository orders)
    {
        _orders = orders;
    }

    public async Task<Guid> Handle(PlaceOrderCommand request, CancellationToken ct)
    {
        var order = Order.Create(request.Symbol, request.Quantity);
        await _orders.AddAsync(order, ct);
        return order.Id;
    }
}
```

---

## Choosing the Right Approach

- **Clean Architecture:** Long-lived backend systems with multiple integrations.
- **DDD:** Complex domains that need strict language and boundaries.
- **Vertical Slices:** Fast-moving teams, feature-driven development.
- **MVVM:** Desktop/mobile UI with heavy interaction and binding.

---

## Why It Matters for Interviews

- You can justify **how you structure a solution** and why it scales with team size.
- You can explain **trade-offs** (complexity vs flexibility, speed vs rigor).
- You can show how architecture supports **testability and maintainability**.

---

## Common Pitfalls

- Treating Clean Architecture as a strict template instead of a guide.
- Building a massive shared kernel that becomes a dependency sink.
- Splitting into micro-layers too early without proven complexity.
- Putting UI logic in Views instead of ViewModels (MVVM violations).

---

## Quick Reference

- **Clean Architecture:** Dependencies flow inward; domain has zero dependencies.
- **DDD:** Bounded contexts + aggregates + ubiquitous language.
- **Vertical Slice:** Organize by feature, not technical layer.
- **MVVM:** View binds to ViewModel; Model stays pure.

---

## Sample Interview Q&A

- **Q:** Can Clean Architecture and DDD coexist?
  - **A:** Yes. DDD provides the modeling approach inside the Domain layer, while Clean Architecture provides the dependency and layering rules around it.

- **Q:** Why choose vertical slices over layered folders?
  - **A:** Vertical slices keep related code together, reduce navigation overhead, and keep changes localized to a feature.

- **Q:** When would MVVM be a bad fit?
  - **A:** For simple screens with minimal state; MVVM overhead may outweigh benefits. For complex UI, it pays off quickly.
