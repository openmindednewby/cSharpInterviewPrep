## **D — Dependency Inversion Principle (DIP)**

> “High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details. Details should depend on abstractions.”

The Dependency Inversion Principle shifts coupling away from concrete implementations toward stable abstractions (interfaces or abstract classes). This reduces the ripple effect when implementation details change and makes code easier to test and extend.

### ❌ Bad example (high-level depends on low-level concrete types)

```csharp
public class SqlOrderRepository
{
	public void Save(Order order) { /* writes to SQL */ }
}

public class OrderService
{
	private readonly SqlOrderRepository _repo;
	public OrderService() { _repo = new SqlOrderRepository(); }

	public void PlaceOrder(Order order)
	{
		// business logic
		_repo.Save(order);
	}
}
```

Problems: `OrderService` is tightly coupled to `SqlOrderRepository`. You cannot easily replace persistence (e.g., with an in-memory repo for tests or a different database) without changing `OrderService`.

### ✅ Good example (depend on abstractions — constructor injection)

```csharp
public interface IOrderRepository { void Save(Order order); }

public class SqlOrderRepository : IOrderRepository
{
	public void Save(Order order) { /* writes to SQL */ }
}

public class OrderService
{
	private readonly IOrderRepository _repo;
	public OrderService(IOrderRepository repo) => _repo = repo;

	public void PlaceOrder(Order order)
	{
		// business logic
		_repo.Save(order);
	}
}
```

Now `OrderService` depends only on `IOrderRepository`. You can provide any implementation (SQL, NoSQL, mock) without changing `OrderService`.

### Notes on usage and patterns
- **Prefer constructor injection** for mandatory dependencies — it makes required collaborators explicit and easy to test.
- **Use interfaces or abstract base classes** to define stable contracts for behavior. Keep these contracts small and focused.
- **Inversion of Control (IoC) / DI containers** can wire concrete implementations to abstractions at composition root, keeping production wiring out of business classes.
- **Avoid service-locators** embedded inside classes — they hide dependencies and complicate testing.

### DIP benefits
- Decouples high-level policy from low-level details.
- Makes unit testing trivial by allowing replacement with fakes/mocks.
- Improves flexibility to change implementations (datastores, external APIs) without touching business code.

