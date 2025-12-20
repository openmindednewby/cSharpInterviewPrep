## **O(1) — Constant Time**

> "Operation time is independent of input size—always takes the same number of steps."

### ❌ Bad example:

```csharp
public class OrderBook
{
    private List<Order> _orders = new();

    public Order FindOrderById(int orderId)
    {
        // O(n) - must scan entire list
        return _orders.FirstOrDefault(o => o.Id == orderId);
    }
}

// Finding order in 1 million orders requires scanning all
var order = orderBook.FindOrderById(12345); // slow!
```

Linear search scales poorly—doubling orders doubles search time.

### ✅ Good example:

```csharp
public class OrderBook
{
    private Dictionary<int, Order> _orders = new();

    public Order FindOrderById(int orderId)
    {
        // O(1) - hash table lookup
        _orders.TryGetValue(orderId, out var order);
        return order;
    }

    public void AddOrder(Order order)
    {
        // O(1) - hash table insert
        _orders[order.Id] = order;
    }
}

// Finding order in 1 million orders is instant
var order = orderBook.FindOrderById(12345); // fast!
```

👉 Dictionary uses hashing for O(1) lookups regardless of size.

### 🔥 Array indexing:

```csharp
public class PriceHistory
{
    private decimal[] _prices = new decimal[1000];

    public decimal GetPriceAt(int index)
    {
        // O(1) - direct memory access
        return _prices[index];
    }

    public void SetPriceAt(int index, decimal price)
    {
        // O(1) - direct memory write
        _prices[index] = price;
    }
}
```

👉 Array indexing is O(1)—memory address is calculated directly.

### 🔥 Stack/Queue operations:

```csharp
public class TradeQueue
{
    private Queue<Trade> _pendingTrades = new();

    public void EnqueueTrade(Trade trade)
    {
        // O(1) - add to end
        _pendingTrades.Enqueue(trade);
    }

    public Trade ProcessNextTrade()
    {
        // O(1) - remove from front
        return _pendingTrades.Dequeue();
    }
}
```

👉 Queue operations are O(1) because they maintain head/tail pointers.

💡 **In trading systems:**

* Use Dictionary<T> for **order lookups by ID**—critical for cancel/modify operations.
* Cache **latest prices** in arrays or dictionaries for O(1) access.
* Use HashSet<T> for **duplicate detection** during order validation.

---

## Questions & Answers

**Q: Are all dictionary operations O(1)?**

A: Average case yes, worst case O(n) if all keys hash to the same bucket. Good hash functions and load factor management keep this rare.

**Q: What's the complexity of List<T>[index]?**

A: O(1). Lists are backed by arrays, so indexing calculates memory address directly: `baseAddress + (index * elementSize)`.

**Q: Is accessing a property O(1)?**

A: Usually, if it's an auto-property or simple field access. But if the getter runs complex logic or queries a database, it could be O(n) or worse.

**Q: What's the difference between O(1) and constant time?**

A: They're the same. O(1) means constant time—the number of operations doesn't depend on input size.

**Q: Can loops ever be O(1)?**

A: Yes, if the loop count is fixed and doesn't depend on input size. For example, `for (int i = 0; i < 10; i++)` is O(1) even though it loops.

**Q: What's the complexity of checking if a HashSet<T> contains an item?**

A: O(1) average case. HashSet uses hashing, same as Dictionary. Worst case O(n) with hash collisions, but rare.

**Q: Is StringBuilder.Append() O(1)?**

A: Amortized O(1). Occasional resizing costs O(n), but averaged over many appends, each append is effectively O(1).

**Q: What's the complexity of getting List<T>.Count?**

A: O(1). List<T> maintains a cached count that updates on Add/Remove, so accessing Count is just a field read.

**Q: Can database queries be O(1)?**

A: Yes, with proper indexing. A lookup by primary key or unique index is O(1) effectively (hash or B-tree root access). Without indexes, it's O(n).

**Q: What's the tradeoff for O(1) operations?**

A: Often space. Dictionaries use more memory than lists. Caching enables O(1) reads but increases memory footprint. Balance time vs space based on requirements.
