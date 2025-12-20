## **O(n log n) — Linearithmic Time**

> "Combines linear and logarithmic—typical of efficient sorting and divide-and-conquer algorithms."

### ❌ Bad example:

```csharp
public class TradeProcessor
{
    public List<Trade> SortTradesByPriceBubbleSort(List<Trade> trades)
    {
        // O(n²) - bubble sort, avoid in production
        var sorted = new List<Trade>(trades);
        for (int i = 0; i < sorted.Count; i++)
        {
            for (int j = 0; j < sorted.Count - 1; j++)
            {
                if (sorted[j].Price > sorted[j + 1].Price)
                {
                    var temp = sorted[j];
                    sorted[j] = sorted[j + 1];
                    sorted[j + 1] = temp;
                }
            }
        }
        return sorted;
    }
}

// Sorting 10,000 trades: ~100 million comparisons
```

Bubble sort is O(n²)—catastrophic for large datasets.

### ✅ Good example:

```csharp
public class TradeProcessor
{
    public List<Trade> SortTradesByPrice(List<Trade> trades)
    {
        // O(n log n) - uses quicksort/introsort internally
        return trades.OrderBy(t => t.Price).ToList();
    }

    public void SortTradesInPlace(List<Trade> trades)
    {
        // O(n log n) - sorts in-place, no allocation
        trades.Sort((a, b) => a.Price.CompareTo(b.Price));
    }

    public List<Trade> SortByMultipleCriteria(List<Trade> trades)
    {
        // O(n log n) - LINQ stable sort
        return trades
            .OrderBy(t => t.Symbol)      // primary sort
            .ThenBy(t => t.Timestamp)     // secondary sort
            .ToList();
    }
}

// Sorting 10,000 trades: ~133,000 comparisons (10,000 * log₂(10,000) ≈ 133K)
```

👉 Built-in sorting uses optimized O(n log n) algorithms (quicksort, mergesort, heapsort).

### 🔥 Merge sorted sequences:

```csharp
public class MarketDataMerger
{
    public List<Trade> MergeSortedFeeds(List<Trade> feed1, List<Trade> feed2)
    {
        // O(n + m) - merge two sorted lists
        var result = new List<Trade>(feed1.Count + feed2.Count);
        int i = 0, j = 0;

        while (i < feed1.Count && j < feed2.Count)
        {
            if (feed1[i].Timestamp <= feed2[j].Timestamp)
                result.Add(feed1[i++]);
            else
                result.Add(feed2[j++]);
        }

        while (i < feed1.Count) result.Add(feed1[i++]);
        while (j < feed2.Count) result.Add(feed2[j++]);

        return result; // Total: O(n + m), but sorting feeds first was O(n log n)
    }
}
```

👉 Merging pre-sorted data is O(n), but initial sorting is O(n log n).

### 🔥 GroupBy with sorting:

```csharp
public class OrderAnalyzer
{
    public Dictionary<string, List<Order>> GroupAndSortOrders(List<Order> orders)
    {
        // O(n log n) - grouping is O(n), but sorting within groups adds log n factor
        return orders
            .GroupBy(o => o.Symbol)
            .ToDictionary(
                g => g.Key,
                g => g.OrderByDescending(o => o.Amount).ToList()
            );
    }
}
```

👉 Combining O(n) operations with O(log n) sorting yields O(n log n).

### 🔥 Finding median (requires sorting):

```csharp
public class StatisticsCalculator
{
    public decimal CalculateMedianPrice(List<Trade> trades)
    {
        if (trades.Count == 0) throw new ArgumentException("Empty list");

        // O(n log n) - must sort to find median
        var sorted = trades.OrderBy(t => t.Price).ToList();

        int mid = sorted.Count / 2;
        if (sorted.Count % 2 == 0)
            return (sorted[mid - 1].Price + sorted[mid].Price) / 2;
        else
            return sorted[mid].Price;
    }
}
```

👉 Median requires sorting—can't be computed in O(n) without specialized algorithms.

💡 **In trading systems:**

* **Sorting order books** by price level is O(n log n) for unordered data.
* **Aggregating and sorting** daily trade summaries requires linearithmic time.
* Most real-world sorting problems are O(n log n)—optimal for comparison-based sorting.

---

## Questions & Answers

**Q: Why is sorting O(n log n) and not O(n)?**

A: Comparison-based sorting requires at least n log n comparisons in the worst case. You must compare elements multiple times to establish order—proven lower bound.

**Q: What sorting algorithms are O(n log n)?**

A: Mergesort, heapsort, quicksort (average case). C# List<T>.Sort() uses introsort (hybrid of quicksort, heapsort, insertion sort).

**Q: Can sorting ever be faster than O(n log n)?**

A: Yes, with non-comparison sorts for specific data: counting sort, radix sort, bucket sort can achieve O(n) if key range is limited.

**Q: What's the difference between O(n log n) and O(n²)?**

A: Huge. For n=10,000: O(n log n) ≈ 133,000 operations, O(n²) = 100,000,000 operations. That's ~750x difference.

**Q: Is LINQ OrderBy() stable?**

A: Yes. OrderBy() preserves relative order of equal elements. List<T>.Sort() is not stable by default (quicksort), but Array.Sort() uses stable algorithms for reference types.

**Q: What's the space complexity of sorting?**

A: Depends. Mergesort is O(n) space, heapsort is O(1) space, quicksort is O(log n) space (recursion stack). List<T>.Sort() is in-place with O(log n) stack.

**Q: Can I sort in O(n) time?**

A: Only with non-comparison sorts for specific data patterns (integers in small range, strings with limited prefixes). General comparison sorting is O(n log n) minimum.

**Q: What's the complexity of Distinct().OrderBy()?**

A: Distinct() is O(n), OrderBy() is O(n log n), so combined is O(n log n). The dominant term wins.

**Q: How does database ORDER BY relate to O(n log n)?**

A: Database sorts use similar algorithms. Unindexed ORDER BY requires sorting result set: O(n log n). Indexed columns can return sorted data without explicit sort.

**Q: Should I avoid sorting in hot paths?**

A: If possible, yes. Maintain sorted invariants (SortedSet, insertion sort for streaming data) to avoid repeated O(n log n) sorts. Or cache sorted results.
