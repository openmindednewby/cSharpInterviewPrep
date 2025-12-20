## **ICollection<T> — Countable, Modifiable Collections**

> "Use ICollection<T> when you need Count without enumeration, and callers may Add/Remove items."

### ❌ Bad example:

```csharp
public IEnumerable<Position> GetPositions()
{
    return _positions.Where(p => p.IsOpen);
}

// Caller
public void ValidatePositions(IEnumerable<Position> positions)
{
    int count = positions.Count(); // enumerates entire sequence
    if (count > MaxPositions)
        throw new InvalidOperationException("Too many positions");
}
```

Using `.Count()` on IEnumerable<T> enumerates the whole sequence—inefficient for validation.

### ✅ Good example:

```csharp
public ICollection<Position> GetPositions()
{
    return _positions.Where(p => p.IsOpen).ToList();
}

// Caller
public void ValidatePositions(ICollection<Position> positions)
{
    if (positions.Count > MaxPositions) // O(1) property access
        throw new InvalidOperationException("Too many positions");
}
```

👉 ICollection<T>.Count is a property (O(1) for most collections), not an enumeration.

### 🔥 When Add/Remove matters:

```csharp
public interface IOrderQueue
{
    ICollection<Order> PendingOrders { get; }
}

public class OrderProcessor
{
    private readonly IOrderQueue _queue;

    public void CancelOrder(int orderId)
    {
        var order = _queue.PendingOrders.FirstOrDefault(o => o.Id == orderId);
        if (order != null)
            _queue.PendingOrders.Remove(order); // mutation supported
    }
}
```

👉 Callers can modify the collection via Add/Remove without exposing concrete type.

💡 **In trading systems:**

* Use ICollection<T> for **position snapshots** where count validation is critical.
* Expose ICollection<T> when callers need to **add/remove** pending orders or alerts.
* Prefer IEnumerable<T> if Count isn't needed—keeps API minimal.

---

## Questions & Answers

**Q: What's the difference between IEnumerable<T> and ICollection<T>?**

A: ICollection<T> extends IEnumerable<T> and adds Count, Add(), Remove(), Clear(), Contains(), and CopyTo(). Use ICollection<T> when these operations are needed.

**Q: Does ICollection<T> guarantee O(1) Count?**

A: Not strictly, but most implementations (List<T>, HashSet<T>) cache Count. LinkedList<T> also has O(1) Count. IEnumerable<T>.Count() enumerates everything.

**Q: Should I return ICollection<T> from methods?**

A: Only if callers legitimately need Count or Add/Remove. Otherwise, IEnumerable<T> is preferable—narrower contract, better encapsulation.

**Q: Can I expose ICollection<T> without allowing modification?**

A: Use IReadOnlyCollection<T> instead. It provides Count but no Add/Remove, preventing unintended mutations.

**Q: What's the risk of returning ICollection<T>?**

A: Callers can mutate the collection, potentially breaking invariants. Return defensive copies or IReadOnlyCollection<T> if modification isn't intended.

**Q: How does ICollection<T> relate to arrays?**

A: Arrays implement ICollection<T>, but Add/Remove throw NotSupportedException because arrays are fixed-size. Check IsReadOnly before assuming mutability.

**Q: When should I use HashSet<T> vs List<T> for ICollection<T>?**

A: HashSet<T> when uniqueness matters and Contains() is frequent (O(1)). List<T> when order matters and indexed access is needed. Both implement ICollection<T>.

**Q: Can ICollection<T> be lazy like IEnumerable<T>?**

A: No. Count property implies materialization. Returning ICollection<T> signals that data is already loaded and countable.

**Q: How do I mock ICollection<T> in tests?**

A: Use List<T> or HashSet<T> directly, or create a custom fake. Most mocking frameworks (Moq, NSubstitute) can stub ICollection<T> methods.

**Q: What's the performance of Contains() on ICollection<T>?**

A: Depends on implementation. HashSet<T> is O(1), List<T> is O(n). Always consider the concrete type when performance matters, even if accepting ICollection<T>.
