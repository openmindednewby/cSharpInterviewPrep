
# DRY — Don't Repeat Yourself

> "Every piece of knowledge must have a single, unambiguous, authoritative representation within a system." — Andy Hunt & Dave Thomas

The DRY principle encourages reducing duplication in code, documentation, and design. Duplicate logic leads to more bugs, harder maintenance, and inconsistent behavior when requirements change.

### ❌ Common anti-pattern (duplicated code)

```csharp
public class OrderService
{
	public void PlaceOrder(Order order)
	{
		// validate
		if (order == null || order.Amount <= 0) throw new ArgumentException("Invalid order");
		// save
		SaveOrder(order);
		// notify
		Email.Send("order@company", "Order placed");
	}

	public void CancelOrder(Order order)
	{
		// duplicated validate
		if (order == null || order.Amount <= 0) throw new ArgumentException("Invalid order");
		// cancel
		Cancel(order);
		// notify
		Email.Send("order@company", "Order cancelled");
	}
}
```

Problems: validation and notification logic are duplicated across methods — bug fixes or behaviour changes must be applied in multiple places.

### ✅ DRY refactor (single source of truth)

```csharp
public class OrderService
{
	public void PlaceOrder(Order order)
	{
		Validate(order);
		SaveOrder(order);
		Notify("Order placed");
	}

	public void CancelOrder(Order order)
	{
		Validate(order);
		Cancel(order);
		Notify("Order cancelled");
	}

	private void Validate(Order order)
	{
		if (order == null || order.Amount <= 0) throw new ArgumentException("Invalid order");
	}

	private void Notify(string message) => Email.Send("order@company", message);
}
```
