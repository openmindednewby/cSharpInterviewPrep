# ⚙️ 4️⃣ CQRS Pattern — *Command/Query split for trading operations*

> Separate **commands** (change system state) from **queries** (read state).

---

### 🧩 Example — PlaceOrder (Command) vs GetOrder (Query)

```csharp
public record PlaceOrderCommand(string Symbol, double Amount);
public record GetOrderQuery(Guid OrderId);

public class Order
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Symbol { get; set; }
    public double Amount { get; set; }
}

public class OrderCommandHandler
{
    private readonly ITradeExecutor _executor;

    public OrderCommandHandler(ITradeExecutor executor) => _executor = executor;

    public void Handle(PlaceOrderCommand command)
    {
        var order = new Order { Symbol = command.Symbol, Amount = command.Amount };
        _executor.Execute(order);
    }
}

public class OrderQueryHandler
{
    private readonly Dictionary<Guid, Order> _orders = new();

    public Order Handle(GetOrderQuery query)
        => _orders.TryGetValue(query.OrderId, out var order)
            ? order
            : throw new KeyNotFoundException("Order not found");
}

// --- Usage ---
var executor = new Mt5Executor();
var commandHandler = new OrderCommandHandler(executor);
commandHandler.Handle(new PlaceOrderCommand("EURUSD", 1000));

var queryHandler = new OrderQueryHandler();
// queryHandler.Handle(new GetOrderQuery(...));
```

✅ **Why it matters:**

* Commands → mutate state (place/cancel order).
* Queries → fetch data (get portfolio, prices).
* Enables **scalability** (separate read/write services) and **event sourcing** (audit trading actions).

---
