## **O(n) — Linear Time**

> "Operation time grows proportionally with input size—doubling input doubles execution time."

### ❌ Bad example:

```csharp
public class TradeAnalyzer
{
    public decimal CalculateAveragePrice(List<Trade> trades)
    {
        decimal sum = 0;
        foreach (var trade in trades)
        {
            sum += trade.Price; // O(n)
        }

        decimal count = 0;
        foreach (var trade in trades)
        {
            count++; // O(n) - unnecessary second pass
        }

        return sum / count;
    }
}
```

Two separate O(n) passes when one would suffice—wasted cycles.

### ✅ Good example:

```csharp
public class TradeAnalyzer
{
    public decimal CalculateAveragePrice(List<Trade> trades)
    {
        if (trades.Count == 0) return 0;

        decimal sum = 0;
        foreach (var trade in trades)
        {
            sum += trade.Price;
        }

        // O(1) - Count property is cached
        return sum / trades.Count;
    }

    // Alternative LINQ (still O(n), more readable)
    public decimal CalculateAveragePriceLINQ(List<Trade> trades)
    {
        return trades.Any() ? trades.Average(t => t.Price) : 0;
    }
}
```

👉 Single pass through data, use cached Count for O(1) access.

### 🔥 Filtering with Where:

```csharp
public class OrderFilter
{
    public IEnumerable<Order> GetLargeOrders(IEnumerable<Order> orders, decimal threshold)
    {
        // O(n) - single pass when enumerated
        return orders.Where(o => o.Amount > threshold);
    }

    public List<Order> GetLargeOrdersMaterialized(List<Order> orders, decimal threshold)
    {
        var result = new List<Order>();
        foreach (var order in orders)
        {
            if (order.Amount > threshold)
                result.Add(order); // O(1) amortized per Add
        }
        return result; // Total: O(n)
    }
}
```

👉 LINQ Where() is O(n) during enumeration—iterates once through all items.

### 🔥 Finding maximum:

```csharp
public class PriceTracker
{
    public decimal FindMaxPrice(decimal[] prices)
    {
        if (prices.Length == 0) throw new ArgumentException("Empty array");

        decimal max = prices[0];
        for (int i = 1; i < prices.Length; i++)
        {
            if (prices[i] > max)
                max = prices[i];
        }
        return max; // O(n) - must check every element
    }

    // LINQ alternative (same complexity)
    public decimal FindMaxPriceLINQ(decimal[] prices)
    {
        return prices.Max(); // O(n)
    }
}
```

👉 Finding min/max in unsorted data requires checking every element.

### 🔥 String operations:

```csharp
public class SymbolValidator
{
    public bool IsValidSymbol(string symbol)
    {
        // O(n) - where n is symbol.Length
        return symbol.All(c => char.IsLetterOrDigit(c));
    }

    public string FormatSymbol(string symbol)
    {
        // O(n) - creates new string with all chars uppercase
        return symbol.ToUpper();
    }
}
```

👉 String operations typically iterate through all characters: O(n).

💡 **In trading systems:**

* **Summing positions**, calculating totals, or aggregating trades is O(n).
* **Filtering orders** by criteria (price, symbol, time) requires scanning all.
* Accept O(n) when necessary, but avoid repeated scans—combine operations.

---

## Questions & Answers

**Q: How can I optimize O(n) algorithms?**

A: You often can't—some problems require checking every element. Focus on: (1) single pass instead of multiple, (2) early termination when possible, (3) parallel processing for independent work.

**Q: Is foreach always O(n)?**

A: Yes, foreach iterates through all elements once. Complexity is O(n) where n is the collection size.

**Q: What's the difference between O(n) and O(2n)?**

A: Same complexity class—O(2n) simplifies to O(n). Big O drops constants. But in practice, 2 passes vs 1 pass matters for performance.

**Q: Are LINQ operations always O(n)?**

A: Most are. Where, Select, Sum, Average, Any, All are O(n). But Count() on IEnumerable<T> is O(n), while Count on ICollection<T> is O(1).

**Q: Can O(n) be parallelized?**

A: Yes. Parallel.ForEach or PLINQ can split O(n) work across cores, reducing wall-clock time. Algorithmic complexity stays O(n), but throughput improves.

**Q: What's the complexity of Contains() on List<T>?**

A: O(n). List<T>.Contains() must scan all elements. Use HashSet<T>.Contains() for O(1).

**Q: Is string concatenation in a loop O(n)?**

A: No, it's O(n²). Each concat creates a new string, copying all previous chars. For n iterations: 1 + 2 + 3 + ... + n = O(n²). Use StringBuilder.

**Q: What's the complexity of ToList() on IEnumerable<T>?**

A: O(n). It iterates through all elements and copies them into a new List<T>.

**Q: How does O(n) relate to database queries?**

A: A table scan (no index) is O(n). Retrieving all rows, filtering in memory, or aggregating without indexes all scale linearly with row count.

**Q: Can you turn O(n) into O(1)?**

A: Sometimes, with preprocessing. Build a Dictionary (O(n) once), then lookups are O(1). Trade space for time, and upfront cost for faster queries.
