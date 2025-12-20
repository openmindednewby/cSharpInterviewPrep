## **IList<T> — Indexed Access Collections**

> "Use IList<T> when you need random access by index, or when Insert/RemoveAt operations are required."

### ❌ Bad example:

```csharp
public IEnumerable<Trade> GetRecentTrades()
{
    return _trades.OrderByDescending(t => t.Timestamp).Take(10);
}

// Caller
public void DisplayLastTrade(IEnumerable<Trade> trades)
{
    var lastTrade = trades.Last(); // enumerates entire sequence
    Console.WriteLine(lastTrade.Symbol);
}
```

Using `.Last()` on IEnumerable<T> requires full enumeration—inefficient.

### ✅ Good example:

```csharp
public IList<Trade> GetRecentTrades()
{
    return _trades.OrderByDescending(t => t.Timestamp).Take(10).ToList();
}

// Caller
public void DisplayLastTrade(IList<Trade> trades)
{
    var lastTrade = trades[trades.Count - 1]; // O(1) indexed access
    Console.WriteLine(lastTrade.Symbol);
}
```

👉 IList<T> enables O(1) random access via indexer, avoiding enumeration.

### 🔥 When Insert/RemoveAt matters:

```csharp
public class OrderBook
{
    public IList<Order> BuyOrders { get; } = new List<Order>();

    public void InsertOrderAtPrice(Order order)
    {
        // Binary search to find insertion point
        int index = BuyOrders.BinarySearch(order, new PriceComparer());
        if (index < 0) index = ~index;

        BuyOrders.Insert(index, order); // insert at specific position
    }
}
```

👉 IList<T> supports Insert() and RemoveAt() for positional mutations.

### 🔥 Avoiding unnecessary copies:

```csharp
// ❌ Bad: forces caller to know concrete type
public List<decimal> CalculatePrices(List<decimal> basePrices)
{
    for (int i = 0; i < basePrices.Count; i++)
        basePrices[i] *= 1.05m;
    return basePrices;
}

// ✅ Good: accepts interface, returns interface
public IList<decimal> CalculatePrices(IList<decimal> basePrices)
{
    for (int i = 0; i < basePrices.Count; i++)
        basePrices[i] *= 1.05m;
    return basePrices;
}
```

👉 Accepting IList<T> allows arrays or lists without forcing specific types.

💡 **In trading systems:**

* Use IList<T> for **order books** where indexed access is critical for price levels.
* Enable **efficient batch processing** with index-based loops (faster than foreach for large arrays).
* Prefer IEnumerable<T> unless random access is genuinely needed—narrower contract.

---

## Questions & Answers

**Q: What's the difference between ICollection<T> and IList<T>?**

A: IList<T> extends ICollection<T> and adds indexed access (this[int]), Insert(), RemoveAt(), and IndexOf(). Use IList<T> when position matters.

**Q: Does IList<T> guarantee O(1) indexed access?**

A: Not strictly. List<T> and arrays are O(1), but custom implementations (e.g., linked lists) could be O(n). Documentation should clarify performance.

**Q: Should I return IList<T> from methods?**

A: Only if callers need indexed access or Insert/RemoveAt. Otherwise, IEnumerable<T> or IReadOnlyList<T> are better—narrower contracts prevent misuse.

**Q: Can IList<T> be read-only?**

A: Yes. Arrays are fixed-size, so Add/Remove throw NotSupportedException. Check IsReadOnly before assuming mutability. Prefer IReadOnlyList<T> for clarity.

**Q: How does IList<T> relate to arrays?**

A: Arrays implement IList<T>, providing O(1) indexed access. They're IList<T> but fixed-size, so Add/Remove fail. Use Array.AsReadOnly() for IReadOnlyList<T>.

**Q: When should I use for vs foreach with IList<T>?**

A: Use `for (int i = 0; i < list.Count; i++)` when you need the index or modify elements by index. Use foreach for clarity when index isn't needed.

**Q: What's the performance of IndexOf() on IList<T>?**

A: O(n) for List<T> (linear search). If frequent lookups are needed, use Dictionary<TKey, TValue> or HashSet<T> instead.

**Q: Can I pass an array as IList<T>?**

A: Yes. Arrays implement IList<T>, but Add/Remove throw exceptions. This enables accepting both arrays and lists without overloads.

**Q: How do I mock IList<T> in tests?**

A: Use List<T> or arrays directly for simple cases. For complex scenarios, mocking frameworks (Moq, NSubstitute) can stub IList<T> behavior.

**Q: What happens if I access IList<T>[index] out of bounds?**

A: Throws IndexOutOfRangeException (arrays) or ArgumentOutOfRangeException (List<T>). Always validate index < Count before accessing.
