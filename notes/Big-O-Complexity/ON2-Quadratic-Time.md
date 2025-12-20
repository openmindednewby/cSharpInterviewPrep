## **O(n²) — Quadratic Time**

> "Operation time grows with the square of input size—doubling input quadruples execution time. Avoid in production."

### ❌ Bad example:

```csharp
public class DuplicateDetector
{
    public List<Trade> FindDuplicateTrades(List<Trade> trades)
    {
        // O(n²) - nested loop comparing every pair
        var duplicates = new List<Trade>();

        for (int i = 0; i < trades.Count; i++)
        {
            for (int j = i + 1; j < trades.Count; j++)
            {
                if (trades[i].Id == trades[j].Id)
                {
                    duplicates.Add(trades[j]);
                }
            }
        }

        return duplicates;
    }
}

// 10,000 trades = 50 million comparisons
// 100,000 trades = 5 billion comparisons (system grinds to halt)
```

Nested loops over same dataset—classic O(n²) antipattern.

### ✅ Good example:

```csharp
public class DuplicateDetector
{
    public List<Trade> FindDuplicateTrades(List<Trade> trades)
    {
        // O(n) - single pass with hash set
        var seen = new HashSet<int>();
        var duplicates = new List<Trade>();

        foreach (var trade in trades)
        {
            if (!seen.Add(trade.Id)) // Add returns false if already exists
            {
                duplicates.Add(trade);
            }
        }

        return duplicates;
    }

    // Alternative: find all duplicate groups
    public Dictionary<int, List<Trade>> GroupDuplicates(List<Trade> trades)
    {
        // O(n) - group by ID
        return trades
            .GroupBy(t => t.Id)
            .Where(g => g.Count() > 1)
            .ToDictionary(g => g.Key, g => g.ToList());
    }
}

// 100,000 trades = 100,000 operations (hash lookups)
```

👉 HashSet eliminates nested loop—O(1) lookups reduce O(n²) to O(n).

### 🔥 Cartesian product (intentional O(n²)):

```csharp
public class PairGenerator
{
    public List<(Order Buy, Order Sell)> GenerateAllPairs(List<Order> buyOrders, List<Order> sellOrders)
    {
        // O(n * m) - intentionally generating all combinations
        var pairs = new List<(Order, Order)>();

        foreach (var buy in buyOrders)
        {
            foreach (var sell in sellOrders)
            {
                if (buy.Symbol == sell.Symbol)
                {
                    pairs.Add((buy, sell));
                }
            }
        }

        return pairs;
    }
}
```

👉 Sometimes O(n²) is necessary (all pairs, matrix operations), but minimize data size.

### 🔥 String concatenation in loops:

```csharp
// ❌ O(n²) - avoid
public string BuildReport(List<Trade> trades)
{
    string report = "";
    foreach (var trade in trades)
    {
        report += $"{trade.Symbol},{trade.Price}\n"; // creates new string each iteration
    }
    return report;
}

// ✅ O(n) - use StringBuilder
public string BuildReportOptimized(List<Trade> trades)
{
    var sb = new StringBuilder();
    foreach (var trade in trades)
    {
        sb.AppendLine($"{trade.Symbol},{trade.Price}"); // modifies buffer in-place
    }
    return sb.ToString();
}
```

👉 String immutability makes concatenation O(n²)—use StringBuilder.

### 🔥 Avoiding nested loops:

```csharp
// ❌ O(n²) - finding matching orders
public List<(Order, Order)> MatchOrders(List<Order> buyOrders, List<Order> sellOrders)
{
    var matches = new List<(Order, Order)>();
    foreach (var buy in buyOrders)
    {
        foreach (var sell in sellOrders) // nested loop
        {
            if (buy.Symbol == sell.Symbol && buy.Price >= sell.Price)
            {
                matches.Add((buy, sell));
            }
        }
    }
    return matches;
}

// ✅ O(n + m) - index by symbol first
public List<(Order, Order)> MatchOrdersOptimized(List<Order> buyOrders, List<Order> sellOrders)
{
    // O(n) - group sell orders by symbol
    var sellsBySymbol = sellOrders
        .GroupBy(o => o.Symbol)
        .ToDictionary(g => g.Key, g => g.ToList());

    var matches = new List<(Order, Order)>();

    // O(n) - iterate buy orders and lookup matching sells
    foreach (var buy in buyOrders)
    {
        if (sellsBySymbol.TryGetValue(buy.Symbol, out var sells))
        {
            foreach (var sell in sells.Where(s => buy.Price >= s.Price))
            {
                matches.Add((buy, sell));
            }
        }
    }

    return matches;
}
```

👉 Index one collection to avoid scanning it repeatedly—reduces O(n * m) to O(n + m).

💡 **In trading systems:**

* **Never** use O(n²) for matching engines, order lookups, or real-time processing.
* Profile nested loops—if data grows, O(n²) becomes bottleneck.
* Use dictionaries, hash sets, or sorting to eliminate inner loops.

---

## Questions & Answers

**Q: How do I identify O(n²) code?**

A: Look for nested loops over the same or related datasets. Patterns: `for (i) { for (j) { ... } }`, calling Contains() inside a loop on a List<T>.

**Q: Is O(n²) always bad?**

A: Not always. For small datasets (n < 100), O(n²) is fine. Problems arise when n scales. Also, some algorithms (matrix multiplication) are inherently O(n²) or worse.

**Q: What's the difference between O(n²) and O(n * m)?**

A: O(n * m) is two different inputs (e.g., matching buy vs sell orders). If n ≈ m, it's effectively O(n²). Still quadratic scaling.

**Q: Can LINQ cause O(n²)?**

A: Yes. Using .Contains() on a List<T> inside a loop: `list.Where(x => otherList.Contains(x))` is O(n * m). Convert otherList to HashSet<T> for O(n).

**Q: What's the complexity of SelectMany with nested collections?**

A: Depends on data. If each element has k sub-items, SelectMany is O(n * k). If k grows with n, it's O(n²).

**Q: How can I refactor O(n²) to O(n)?**

A: Common strategies: (1) Use HashSet for O(1) lookups instead of List, (2) Index data by key using Dictionary, (3) Sort then merge instead of nested loops.

**Q: What's the practical limit for O(n²)?**

A: Depends on hardware and latency requirements. For n=1,000, O(n²) = 1 million ops (milliseconds). For n=10,000, O(n²) = 100 million ops (seconds). Avoid for n > 1,000.

**Q: Is bubble sort ever acceptable?**

A: Only for teaching or nearly-sorted data with n < 10. Production code should use O(n log n) sorts (List<T>.Sort, OrderBy).

**Q: What's the complexity of checking all pairs?**

A: O(n²). For n items, there are n(n-1)/2 pairs. Simplifies to O(n²). This is unavoidable if all pairs must be examined.

**Q: Can parallelization help O(n²)?**

A: It reduces wall-clock time but doesn't change algorithmic complexity. Parallel O(n²) is still O(n²)—better to fix the algorithm than throw cores at it.
