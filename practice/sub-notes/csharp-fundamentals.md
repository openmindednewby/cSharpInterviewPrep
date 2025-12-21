# C# Fundamentals Practice Exercises

Build strong core language fundamentals through targeted exercises.

---

## Types, Memory, and Immutability

**Q: Explain the difference between value types and reference types with a simple example.**

A: Value types copy the data; reference types copy the reference. Mutations affect only the copied value, but references point to the same object.

```csharp
var a = new Point { X = 1, Y = 2 };
var b = a; // copy
b.X = 99;
// a.X is still 1

var c = new Person { Name = "Ana" };
var d = c; // reference copy
d.Name = "Zoe";
// c.Name is now "Zoe"
```

**Q: When should you choose a struct over a class?**

A: Use structs for small, immutable, short-lived data without inheritance. Use classes for identity, polymorphism, or large mutable state. Structs reduce GC pressure by living inline and being collected with stack frames. Its data is stored on the stack (for locals), or inline inside another object (as part of that object’s memory). This means 

- No separate heap allocation
- No object header
- No pointer indirection

Stack memory is automatically reclaimed when a method returns. No garbage collection is needed for stack-allocated data. This is much cheaper than heap allocation + GC.

```csharp
public readonly struct Money
{
    public Money(decimal amount, string currency)
    {
        Amount = amount;
        Currency = currency;
    }

    public decimal Amount { get; }
    public string Currency { get; }
}

void Calculate()
{
    Money price = new Money(100, "USD");
    // price is on the stack
} // stack frame is popped → memory reclaimed immediately
```

**⚠️ Structs are not always stack-allocated:**

- If they are fields of a heap object, they live inside that object
- If they are boxed (cast to object or interface), they go to the heap
- Large structs copied often can hurt performance

**Q: Demonstrate how to reduce copying with `in` parameters.**

A: Use `in` for large structs to avoid defensive copies. A defensive copy is an automatic copy the runtime or compiler makes to protect data from being modified.


```csharp
public static decimal CalculateTax(in Money price, decimal rate)
{
    return price.Amount * rate;
}
```

In C#, structs are value types, so they are normally copied when:

- Passed to a method
- Returned from a method
- Accessed through certain properties or interfaces

The copy exists to ensure that the original value cannot be changed unintentionally.

- `in` passes the struct by reference, not by value
- The method receives a read-only reference
- No full struct copy is made

---

## Nullability and Defensive Programming

**Q: Show how nullable reference types prevent null bugs.**

A: Enable nullability and use `?` for optional references.

```csharp
#nullable enable
public string FormatName(string? name)
{
    if (string.IsNullOrWhiteSpace(name))
        return "Unknown";

    return name.Trim();
}
```

**Q: Write a guard clause extension for argument validation.**

A: Throw early for invalid inputs.

```csharp
public static class Guard
{
    public static string NotNullOrEmpty(string? value, string paramName)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Value is required", paramName);
        return value;
    }
}
```

---

## Generics and Constraints

**Q: Implement a generic method with a constraint for a parameterless constructor.**

A: Use `where T : new()` when the type must be created.

```csharp
public static T Create<T>() where T : new()
{
    return new T();
}
```

**Q: Write a repository interface with type constraints.**

A: Constrain to a base entity so the repository can rely on shared properties.

```csharp
public interface IRepository<T> where T : Entity
{
    Task<T?> GetByIdAsync(int id, CancellationToken ct = default);
    Task AddAsync(T entity, CancellationToken ct = default);
}

public abstract class Entity
{
    public int Id { get; set; }
}
```

---

## Delegates, Events, and Lambdas

**Q: Show a simple event pattern with `EventHandler<T>`.**

A: Use events to publish changes without tight coupling.

```csharp
public class PriceTicker
{
    public event EventHandler<decimal>? PriceUpdated;

    public void Update(decimal price)
    {
        PriceUpdated?.Invoke(this, price);
    }
}
```

**Q: When would you prefer `Func<T>` over a custom delegate type?**

A: Use `Func` for small, simple signatures; custom delegates for clarity and documentation.

```csharp
Func<int, int> square = x => x * x;
```

---

## Pattern Matching and Switch Expressions

**Q: Use pattern matching to categorize input.**

A: Switch expressions make branching concise.

```csharp
public static string Classify(object input) => input switch
{
    null => "null",
    int i when i < 0 => "negative int",
    int => "positive int",
    string s when s.Length == 0 => "empty string",
    string => "string",
    _ => "other"
};
```

---

## Records and Immutability

**Q: Create a record and use `with` to clone it.**

A: Records simplify immutable data structures.

```csharp
public record Trade(string Symbol, decimal Price, int Quantity);

var original = new Trade("EURUSD", 1.0912m, 1000);
var updated = original with { Price = 1.0920m };
```

---

## Exceptions and Error Flow

**Q: Show how to throw and wrap exceptions with context.**

A: Use specific exceptions and include context for debugging.

```csharp
public static Order FindOrder(int id, IDictionary<int, Order> map)
{
    if (!map.TryGetValue(id, out var order))
        throw new KeyNotFoundException($"Order {id} was not found.");

    return order;
}
```

---

## Access Modifiers and Encapsulation

**Q: Summarize access modifiers and demonstrate a safe class design.**

A: Use private fields, expose behavior through public methods, and keep invariants inside.

```csharp
public class Position
{
    private decimal _quantity;

    public decimal Quantity => _quantity;

    public void Add(decimal quantity)
    {
        if (quantity <= 0)
            throw new ArgumentOutOfRangeException(nameof(quantity));

        _quantity += quantity;
    }
}
```

---

## OOP Principles (Inheritance, Polymorphism, Abstraction)

**Q: Demonstrate inheritance with a base order type and a specialized derived type.**

A: Use inheritance for true "is-a" relationships and keep the base class focused.

```csharp
public abstract class Order
{
    public Guid Id { get; init; }
    public abstract decimal CalculateFees();
}

public sealed class MarketOrder : Order
{
    public decimal Slippage { get; init; }
    public override decimal CalculateFees() => Slippage * 0.1m;
}
```

**Q: Show polymorphism by swapping fee calculators via an interface.**

A: Code to an interface so the call site does not change when behavior changes.

```csharp
public interface IFeeCalculator
{
    decimal Calculate(decimal notional);
}

public sealed class MakerFeeCalculator : IFeeCalculator
{
    public decimal Calculate(decimal notional) => notional * 0.0002m;
}

public sealed class TakerFeeCalculator : IFeeCalculator
{
    public decimal Calculate(decimal notional) => notional * 0.0005m;
}

public decimal ComputeFees(IFeeCalculator calculator, decimal notional)
{
    return calculator.Calculate(notional);
}
```

**Q: Use abstraction to define a minimal contract for a price feed.**

A: Expose only the required behavior and hide implementation details.

```csharp
public abstract class PriceFeed
{
    public abstract decimal GetBid(string symbol);
}

public sealed class CachedPriceFeed : PriceFeed
{
    private readonly IDictionary<string, decimal> _cache;
    public CachedPriceFeed(IDictionary<string, decimal> cache) => _cache = cache;
    public override decimal GetBid(string symbol) => _cache[symbol];
}
```

**Q: When should you prefer composition over inheritance?**

A: Prefer composition when behavior changes at runtime or when you only need to reuse a small piece of behavior.

---

## Collections and Initialization

**Q: Show object and collection initialization with target-typed `new`.**

A: Use concise syntax for readability.

```csharp
var orders = new List<Order>
{
    new("A", 10),
    new("B", 20)
};
```

---

**Total Exercises: 16+**

Practice each exercise by writing the code and explaining your choices out loud.
