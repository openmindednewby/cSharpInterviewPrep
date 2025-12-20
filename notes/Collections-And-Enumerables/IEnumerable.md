## **IEnumerable<T> — Read-Only Forward Iteration**

> "Use IEnumerable<T> when you only need to iterate once, forward-only, and want lazy evaluation."

### ❌ Bad example:

```csharp
public List<Order> GetActiveOrders()
{
    var orders = _repository.GetAll(); // loads everything
    return orders.Where(o => o.IsActive).ToList(); // filters in memory
}

// Caller
public void ProcessOrders()
{
    List<Order> orders = GetActiveOrders(); // forces concrete type
    foreach (var order in orders) { /* ... */ }
}
```

Returning `List<T>` exposes mutability, couples caller to implementation, and forces immediate materialization.

### ✅ Good example:

```csharp
public IEnumerable<Order> GetActiveOrders()
{
    var orders = _repository.GetAll();
    return orders.Where(o => o.IsActive); // deferred execution
}

// Caller
public void ProcessOrders()
{
    IEnumerable<Order> orders = GetActiveOrders(); // flexible contract
    foreach (var order in orders) { /* ... */ }
}
```

👉 Returns interface, enables lazy evaluation, and hides implementation.

### 🔥 Using `yield return` for streaming:

```csharp
public IEnumerable<Trade> GetTradesForDate(DateTime date)
{
    using var reader = _database.ExecuteReader($"SELECT * FROM Trades WHERE Date = '{date}'");
    while (reader.Read())
    {
        yield return new Trade
        {
            Id = reader.GetInt32(0),
            Symbol = reader.GetString(1),
            Price = reader.GetDecimal(2)
        };
    }
}
```

👉 Streams results one at a time, reducing memory pressure for large datasets.

💡 **In trading systems:**

* Use IEnumerable<T> for **large result sets** from databases (avoid loading millions of trades).
* Enable **deferred execution** so filters/transformations compose efficiently.
* Prevent callers from modifying source collections accidentally.

---

## Questions & Answers

**Q: What's the difference between IEnumerable<T> and IEnumerator<T>?**

A: IEnumerable<T> represents a sequence you can iterate; IEnumerator<T> is the cursor that tracks position. GetEnumerator() creates the cursor. Use IEnumerable<T> in APIs, not IEnumerator<T>.

**Q: Can IEnumerable<T> be enumerated multiple times?**

A: Depends on implementation. Arrays/lists can be re-enumerated; LINQ queries and yield-based iterators re-execute. Avoid enumerating twice without .ToList() if side effects exist.

**Q: How does deferred execution work with IEnumerable<T>?**

A: LINQ operations build a query pipeline without executing. Enumeration (foreach, .ToList(), .Count()) triggers execution. This enables composing filters cheaply before materializing.

**Q: When should I call .ToList() on IEnumerable<T>?**

A: When you need to enumerate multiple times, require random access, or want to snapshot state. Otherwise, keep it lazy to save memory and enable streaming.

**Q: What's the cost of multiple Where() clauses on IEnumerable<T>?**

A: Minimal until enumeration. Each Where() wraps the previous iterator. During enumeration, predicates chain efficiently without intermediate collections.

**Q: Can IEnumerable<T> represent infinite sequences?**

A: Yes. Yield-based iterators can generate endless items (e.g., Fibonacci). Callers use .Take(n) to limit consumption. This is impossible with List<T>.

**Q: How does foreach work with IEnumerable<T>?**

A: Compiler calls GetEnumerator(), then repeatedly calls MoveNext() and accesses Current. Finally calls Dispose(). You rarely implement IEnumerable<T> manually; use yield.

**Q: What happens if I modify a collection while enumerating?**

A: Most collections throw InvalidOperationException. Use .ToList() first if modification during iteration is required, or redesign to collect changes separately.

**Q: How does IEnumerable<T> relate to memory allocation?**

A: Iterator blocks allocate a state machine (heap object), but items are yielded on demand. This trades small upfront allocation for avoiding large arrays.

**Q: Should I return IEnumerable<T> from async methods?**

A: No, use IAsyncEnumerable<T> for async streaming. Returning IEnumerable<T> from an async method forces full materialization (.ToListAsync()) before returning, losing laziness.
