## **IReadOnlyCollection<T> & IReadOnlyList<T> — Immutable Access**

> "Use IReadOnly* interfaces to expose collections without allowing modification."

### ❌ Bad example:

```csharp
public class Portfolio
{
    private List<Position> _positions = new();

    public List<Position> Positions => _positions; // exposes internal list
}

// Caller can mutate internal state
var portfolio = new Portfolio();
portfolio.Positions.Add(new Position()); // breaks encapsulation
portfolio.Positions.Clear(); // disaster!
```

Exposing mutable collections lets callers break invariants and bypass validation.

### ✅ Good example:

```csharp
public class Portfolio
{
    private List<Position> _positions = new();

    public IReadOnlyCollection<Position> Positions => _positions;

    public void AddPosition(Position position)
    {
        ValidatePosition(position);
        _positions.Add(position);
    }
}

// Caller can only read
var portfolio = new Portfolio();
int count = portfolio.Positions.Count; // ✅ allowed
// portfolio.Positions.Add(...); // ❌ compiler error
```

👉 IReadOnlyCollection<T> provides Count and iteration, but no Add/Remove.

### 🔥 Using IReadOnlyList<T> for indexed access:

```csharp
public class TradingDay
{
    private List<Trade> _trades = new();

    public IReadOnlyList<Trade> Trades => _trades;

    public void RecordTrade(Trade trade)
    {
        _trades.Add(trade);
    }
}

// Caller can access by index, but not modify
var day = new TradingDay();
var firstTrade = day.Trades[0]; // ✅ indexed access
int count = day.Trades.Count;   // ✅ count
// day.Trades.Add(...);          // ❌ compiler error
```

👉 IReadOnlyList<T> adds indexed access without exposing mutability.

### 🔥 Avoiding defensive copies:

```csharp
// ❌ Bad: creates unnecessary copy
public IEnumerable<Order> GetOrders()
{
    return _orders.ToList(); // allocates new list every call
}

// ✅ Good: exposes read-only view without copying
public IReadOnlyCollection<Order> GetOrders()
{
    return _orders; // no allocation, just interface cast
}
```

👉 List<T> implements IReadOnlyCollection<T>, so casting is free.

💡 **In trading systems:**

* Expose **position snapshots** as IReadOnlyCollection<T> to prevent accidental modifications.
* Return IReadOnlyList<T> for **price history** where indexed access is useful.
* Prevent **invariant violations** by hiding Add/Remove while keeping data accessible.

---

## Questions & Answers

**Q: What's the difference between IReadOnlyCollection<T> and IReadOnlyList<T>?**

A: IReadOnlyList<T> extends IReadOnlyCollection<T> and adds indexed access (this[int]). Use IReadOnlyList<T> when callers need random access without mutation.

**Q: Does IReadOnly* guarantee immutability?**

A: No. It prevents modification through the interface, but underlying data can still change. If the backing List<T> is modified, IReadOnlyCollection<T> reflects changes. Use ReadOnlyCollection<T> for true immutability.

**Q: Can I cast List<T> to IReadOnlyCollection<T>?**

A: Yes. List<T> implements IReadOnlyCollection<T> and IReadOnlyList<T>. Casting is a zero-cost abstraction—no allocation or copying.

**Q: What's ReadOnlyCollection<T> vs IReadOnlyCollection<T>?**

A: ReadOnlyCollection<T> is a wrapper class that prevents modification entirely, even if you have the underlying list. IReadOnlyCollection<T> is an interface; if you cast back to List<T>, you can mutate.

**Q: Should I return IReadOnlyList<T> instead of IEnumerable<T>?**

A: If Count and indexed access are useful to callers and data is already materialized (not lazy), yes. IReadOnlyList<T> is more informative without exposing mutability.

**Q: How do I create a truly immutable collection?**

A: Use `ImmutableList<T>` from System.Collections.Immutable. Modifications return new instances. Or wrap with `new ReadOnlyCollection<T>(list)`.

**Q: Can I expose arrays as IReadOnlyList<T>?**

A: Yes, arrays implement IReadOnlyList<T>. But callers can cast back to T[] and mutate. Use `Array.AsReadOnly(array)` for true protection.

**Q: What's the performance of IReadOnlyList<T> vs List<T>?**

A: Identical. IReadOnlyList<T> is just an interface restriction. Indexing and iteration have the same performance as the underlying collection.

**Q: How do I mock IReadOnlyCollection<T> in tests?**

A: Use arrays or List<T> directly. Most mocking frameworks can stub IReadOnlyCollection<T>, but real collections are often simpler in tests.

**Q: When should I use IReadOnlyCollection<T> over IEnumerable<T>?**

A: When Count is useful to callers and data is already materialized. IEnumerable<T> is better for lazy sequences or when hiding collection semantics.
