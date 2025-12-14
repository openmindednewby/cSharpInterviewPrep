
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

---

## Questions & Answers

**Q: What does DRY mean beyond code duplication?**

A: It means every business rule or piece of knowledge should exist in a single authoritative place—code, schema, docs, config—so updates propagate consistently and you avoid divergence.

**Q: How do you enforce DRY when multiple services need the same validation?**

A: Extract reusable components (shared libraries, NuGet packages, API endpoints) or define contracts/validators consumed by each service. Avoid copy/paste; instead share via versioned packages or centralized services.

**Q: When is duplication acceptable?**

A: For small, stable snippets where abstraction would add accidental complexity. Sometimes duplication is cheaper than coupling; but document the rationale and revisit if requirements evolve.

**Q: How does DRY relate to domain events?**

A: Domain events ensure state changes happen in one place, notifying interested parties without duplicating logic. Each event encapsulates the rule once and publishes it for subscribers.

**Q: What tools help detect DRY violations?**

A: Static analysis (Sonar, Roslyn analyzers), architectural decision records, shared test suites, and code reviews focusing on repeated patterns or query filters across services.

**Q: How can configuration drift break DRY?**

A: When each environment or microservice copies JSON/YAML settings manually, the "knowledge" about e.g., retry policies diverges. Use centralized config or templates to keep settings single-sourced.

**Q: How do you keep SQL queries DRY across codebases?**

A: Encapsulate queries in repositories/projections, use database views/stored procedures where appropriate, or define LINQ extension methods to reuse filtering/grouping logic.

**Q: Does DRY conflict with SRP?**

A: They complement each other. SRP encourages focused classes; DRY ensures functionality isn’t scattered. When refactoring to DRY, verify the resulting abstraction still has a single responsibility.

**Q: How do you DRY test code without making tests brittle?**

A: Use builders, helper methods, and data-driven tests for shared setup, but keep assertions explicit. Avoid hiding intent behind overly generic helpers, and prefer per-feature fixture classes.

**Q: What’s the relationship between DRY and documentation?**

A: Document procedures and APIs once, then reference that source elsewhere (wikis, runbooks). Automation (code generation, doc tooling) helps ensure docs derive from code or schemas to stay in sync.
