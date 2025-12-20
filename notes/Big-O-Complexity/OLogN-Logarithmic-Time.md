## **O(log n) — Logarithmic Time**

> "Operation time grows logarithmically—doubling input size adds only one more step."

### ❌ Bad example:

```csharp
public class PriceLookup
{
    private List<PriceLevel> _prices = new(); // unsorted

    public decimal FindPriceNearTarget(decimal target)
    {
        // O(n) - must check every price
        return _prices
            .Select(p => p.Price)
            .OrderBy(p => Math.Abs(p - target))
            .First();
    }
}

// Searching 1 million prices requires checking all
var price = lookup.FindPriceNearTarget(150.00m);
```

Linear search doesn't exploit any structure—wasteful for large datasets.

### ✅ Good example:

```csharp
public class PriceLookup
{
    private List<PriceLevel> _prices = new(); // sorted

    public decimal FindPriceNearTarget(decimal target)
    {
        // O(log n) - binary search
        int index = _prices.BinarySearch(new PriceLevel { Price = target });
        if (index < 0) index = ~index; // insertion point

        // Check nearby prices
        return _prices[Math.Max(0, index - 1)].Price;
    }

    public void AddPrice(PriceLevel price)
    {
        int index = _prices.BinarySearch(price);
        if (index < 0) index = ~index;
        _prices.Insert(index, price); // O(n) insert, but search is O(log n)
    }
}

// Searching 1 million sorted prices takes ~20 comparisons
var price = lookup.FindPriceNearTarget(150.00m);
```

👉 Binary search halves the search space each step: O(log₂ n).

### 🔥 SortedSet for automatic ordering:

```csharp
public class OrderPriceIndex
{
    private SortedSet<decimal> _buyPrices = new();
    private SortedSet<decimal> _sellPrices = new();

    public void AddBuyOrder(decimal price)
    {
        // O(log n) - balanced tree insert
        _buyPrices.Add(price);
    }

    public decimal GetBestBid()
    {
        // O(log n) - find max in tree
        return _buyPrices.Max;
    }

    public IEnumerable<decimal> GetPricesInRange(decimal min, decimal max)
    {
        // O(log n + k) - where k is result count
        return _buyPrices.GetViewBetween(min, max);
    }
}
```

👉 SortedSet (red-black tree) maintains order with O(log n) operations.

### 🔥 Dictionary resizing:

```csharp
public class TradeCache
{
    // Dictionary internal resizing is O(n), but happens O(log n) times
    // as capacity doubles: 4, 8, 16, 32, 64...
    private Dictionary<int, Trade> _trades = new();

    public void AddTrade(Trade trade)
    {
        // Amortized O(1), but understanding the log n resize pattern is key
        _trades[trade.Id] = trade;
    }
}
```

👉 Doubling strategy means O(log n) resizes over n insertions.

💡 **In trading systems:**

* Use **binary search** for finding price levels in sorted order books.
* SortedSet for **maintaining best bid/ask** with efficient range queries.
* B-tree indexes in databases provide O(log n) lookups for billions of records.

---

## Questions & Answers

**Q: Why is binary search O(log n)?**

A: Each comparison eliminates half the remaining elements. For n=1,000,000: step 1 = 500,000, step 2 = 250,000, ..., step 20 = 1. That's log₂(1,000,000) ≈ 20 steps.

**Q: What data structures provide O(log n) operations?**

A: Balanced trees (red-black, AVL), SortedSet<T>, SortedDictionary<T>, B-trees (database indexes), heaps (priority queues for min/max).

**Q: Is SortedDictionary<T> better than Dictionary<T>?**

A: Depends. Dictionary is O(1) average for lookup, SortedDictionary is O(log n). Use SortedDictionary when you need ordered keys or range queries.

**Q: What's the complexity of List<T>.BinarySearch()?**

A: O(log n), but list must be sorted first. Sorting is O(n log n), so binary search only makes sense for multiple queries on static data.

**Q: How does O(log n) compare to O(1)?**

A: O(1) is faster, but O(log n) is still very fast. log₂(1 billion) ≈ 30. For practical purposes, O(log n) scales well even for massive datasets.

**Q: Can O(log n) be better than O(1) in practice?**

A: Rarely, but yes. SortedSet uses less memory than Dictionary for sparse data, and cache locality can make tree traversal competitive with hash table lookups.

**Q: What's the complexity of finding min/max in SortedSet<T>?**

A: O(log n) for Min/Max. Internally it traverses left/right to leaf nodes. For frequent min/max, use a heap (O(1) peek, O(log n) removal).

**Q: How does database indexing relate to O(log n)?**

A: B-tree indexes enable O(log n) lookups. A table with 1 billion rows and a B-tree index (depth ~4) needs only 4 disk seeks for a lookup.

**Q: What's the difference between O(log n) and O(n)?**

A: Massive. O(log n) for n=1,000,000 is ~20 steps. O(n) is 1,000,000 steps. Logarithmic algorithms scale dramatically better.

**Q: Can loops be O(log n)?**

A: Yes, if the loop variable doubles/halves each iteration. Example: `for (int i = 1; i < n; i *= 2)` runs log₂(n) times.
