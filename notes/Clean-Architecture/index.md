# Clean Architecture - Layered Design for Trading Systems

> Keep business rules independent of frameworks, UI, and data stores by forcing dependencies inward.

![alt text](image.png)

---

## Quick Overview

- **Domain:** Entities, value objects, aggregates, invariants. No external dependencies.
- **Application:** Use cases, CQRS handlers, validators, interfaces.
- **Infrastructure:** Databases, MT4/MT5 bridges, message brokers, external APIs.
- **Presentation:** Controllers, endpoints, UI components.
- **Rule:** Dependencies always point inward.

---

## Detailed Explanation

### Layer Responsibilities

```
+-------------------------------+
|        Presentation           |  Controllers, endpoints
+-------------------------------+
|          Application          |  Use cases, CQRS
+-------------------------------+
|             Domain            |  Entities, invariants
+-------------------------------+
|        Infrastructure         |  DBs, brokers, APIs
+-------------------------------+
```

### Dependency Flow

```
Presentation -> Application -> Domain
Infrastructure -> Application (via interfaces)
```

### Example in a Trading Context

**Domain layer (core rules):**

```csharp
public sealed class Order
{
    public Guid Id { get; } = Guid.NewGuid();
    public string Symbol { get; private set; }
    public decimal Quantity { get; private set; }

    private Order() { }

    public static Order Create(string symbol, decimal quantity)
    {
        if (string.IsNullOrWhiteSpace(symbol))
            throw new ArgumentException("Symbol is required", nameof(symbol));
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be positive", nameof(quantity));

        return new Order { Symbol = symbol.ToUpperInvariant(), Quantity = quantity };
    }
}
```

**Application layer (use case):**

```csharp
public sealed record PlaceOrderCommand(string Symbol, decimal Quantity) : IRequest<Guid>;

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

**Infrastructure layer (implementation):**

```csharp
public sealed class SqlOrderRepository : IOrderRepository
{
    private readonly TradingDbContext _db;

    public SqlOrderRepository(TradingDbContext db)
    {
        _db = db;
    }

    public async Task AddAsync(Order order, CancellationToken ct)
    {
        _db.Orders.Add(order);
        await _db.SaveChangesAsync(ct);
    }
}
```

**Presentation layer (API):**

```csharp
[ApiController]
[Route("api/orders")]
public sealed class OrdersController : ControllerBase
{
    private readonly IMediator _mediator;

    public OrdersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] PlaceOrderCommand command, CancellationToken ct)
    {
        var orderId = await _mediator.Send(command, ct);
        return Ok(new { orderId });
    }
}
```

---

## Why It Matters for Interviews

- You can explain **how dependencies flow** and why it protects business rules.
- You can show **testability** by mocking infrastructure in application tests.
- You can link architecture to **maintainability** in trading systems.

---

## Common Pitfalls

- Putting database or HTTP code in the Domain layer.
- Over-abstracting everything before the domain is understood.
- Letting DTOs and EF Core entities leak into the Domain.
- Ignoring use case boundaries and building anemic services.

---

## Quick Reference

- **Domain:** No dependencies, enforce invariants.
- **Application:** Use cases, interfaces, orchestration.
- **Infrastructure:** Implement interfaces, handle IO.
- **Presentation:** HTTP/UI, composition root.

---

## Sample Interview Q&A

- **Q:** Where do CQRS handlers live?
  - **A:** In the Application layer because they orchestrate use cases.

- **Q:** How do you keep Infrastructure replaceable?
  - **A:** Define interfaces in Application/Domain, implement in Infrastructure, and wire with DI.

- **Q:** How does Clean Architecture relate to DDD and vertical slices?
  - **A:** DDD shapes the Domain model, while vertical slices organize Application use cases. Clean Architecture defines dependency flow around them.

- **Q:** When would you relax strict layering?
  - **A:** Only when performance profiling proves a bottleneck and the decision is documented.
