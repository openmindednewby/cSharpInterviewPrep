## **Space Complexity — Memory Usage**

> "Space complexity measures memory used by an algorithm relative to input size—critical for large datasets."

### ❌ Bad example:

```csharp
public class TradeTransformer
{
    public List<Trade> FilterAndTransform(List<Trade> trades)
    {
        // O(n) space - creates 3 intermediate collections
        var filtered = trades.Where(t => t.Amount > 1000).ToList();     // copy 1
        var sorted = filtered.OrderBy(t => t.Price).ToList();           // copy 2
        var projected = sorted.Select(t => new Trade
        {
            Id = t.Id,
            Symbol = t.Symbol,
            Price = t.Price * 1.05m
        }).ToList();                                                     // copy 3

        return projected; // 3 full copies in memory simultaneously
    }
}

// Processing 1 million trades: ~3 million Trade objects in memory
```

Multiple intermediate collections waste memory—especially bad for large datasets.

### ✅ Good example:

```csharp
public class TradeTransformer
{
    public IEnumerable<Trade> FilterAndTransform(IEnumerable<Trade> trades)
    {
        // O(1) space (excluding result) - streaming with deferred execution
        return trades
            .Where(t => t.Amount > 1000)          // no allocation
            .OrderBy(t => t.Price)                // O(n) when enumerated
            .Select(t => new Trade
            {
                Id = t.Id,
                Symbol = t.Symbol,
                Price = t.Price * 1.05m
            });                                    // creates items on demand
    }

    // If materialization is needed, single allocation
    public List<Trade> FilterAndTransformMaterialized(List<Trade> trades)
    {
        return trades
            .Where(t => t.Amount > 1000)
            .OrderBy(t => t.Price)
            .Select(t => new Trade
            {
                Id = t.Id,
                Symbol = t.Symbol,
                Price = t.Price * 1.05m
            })
            .ToList(); // single allocation for result
    }
}
```

👉 LINQ deferred execution avoids intermediate collections—only final result is allocated.

### 🔥 In-place operations (O(1) space):

```csharp
public class ArrayProcessor
{
    public void ReverseArray(int[] array)
    {
        // O(1) space - modifies in-place
        int left = 0, right = array.Length - 1;
        while (left < right)
        {
            int temp = array[left];
            array[left] = array[right];
            array[right] = temp;
            left++;
            right--;
        }
    }

    public void SortInPlace(List<Trade> trades)
    {
        // O(log n) space - quicksort recursion stack
        trades.Sort((a, b) => a.Price.CompareTo(b.Price));
    }
}
```

👉 In-place algorithms minimize memory allocation—critical for embedded systems or low-latency paths.

### 🔥 Trading space for time:

```csharp
public class PriceCache
{
    // O(n) space - cache all prices for O(1) lookups
    private Dictionary<string, decimal> _priceCache = new();

    public void LoadPrices(List<(string Symbol, decimal Price)> prices)
    {
        // O(n) space - store all prices
        foreach (var (symbol, price) in prices)
        {
            _priceCache[symbol] = price;
        }
    }

    public decimal GetPrice(string symbol)
    {
        // O(1) time - instant lookup
        return _priceCache.TryGetValue(symbol, out var price) ? price : 0;
    }
}

// Alternative: no cache, query each time
public class PriceLookupNoCache
{
    private List<(string Symbol, decimal Price)> _prices;

    public decimal GetPrice(string symbol)
    {
        // O(1) space, but O(n) time - must scan list
        return _prices.FirstOrDefault(p => p.Symbol == symbol).Price;
    }
}
```

👉 Caching uses O(n) space but reduces lookups from O(n) to O(1) time.

### 🔥 Recursive space complexity:

```csharp
public class TreeProcessor
{
    public int CalculateDepth(TreeNode node)
    {
        // O(h) space - recursion stack depth
        // h = tree height (log n for balanced, n for skewed)
        if (node == null) return 0;

        return 1 + Math.Max(
            CalculateDepth(node.Left),
            CalculateDepth(node.Right)
        );
    }

    // Iterative alternative - explicit stack
    public int CalculateDepthIterative(TreeNode root)
    {
        // O(h) space - explicit stack
        if (root == null) return 0;

        var stack = new Stack<(TreeNode Node, int Depth)>();
        stack.Push((root, 1));
        int maxDepth = 0;

        while (stack.Count > 0)
        {
            var (node, depth) = stack.Pop();
            maxDepth = Math.Max(maxDepth, depth);

            if (node.Left != null) stack.Push((node.Left, depth + 1));
            if (node.Right != null) stack.Push((node.Right, depth + 1));
        }

        return maxDepth;
    }
}
```

👉 Recursion uses call stack—O(h) where h is recursion depth.

### 🔥 Avoiding memory leaks:

```csharp
public class EventProcessor
{
    // ❌ Bad: event handlers create memory leaks
    public void ProcessEvents(IEventSource source)
    {
        source.OnEvent += (s, e) => HandleEvent(e); // captures 'this', prevents GC
    }

    // ✅ Good: explicit unsubscribe
    public void ProcessEventsCorrectly(IEventSource source)
    {
        EventHandler<Event> handler = (s, e) => HandleEvent(e);
        source.OnEvent += handler;

        // Later: unsubscribe
        source.OnEvent -= handler;
    }

    // ✅ Alternative: weak references for long-lived publishers
    public void ProcessEventsWeak(IEventSource source)
    {
        var weakHandler = new WeakEventHandler(this, source);
    }

    private void HandleEvent(Event e) { /* ... */ }
}
```

👉 Unmanaged subscriptions create unbounded space growth—always clean up.

💡 **In trading systems:**

* Use **streaming** (IEnumerable<T>) for large result sets to avoid loading everything.
* Cache **frequently accessed** reference data (symbols, limits) for O(1) access.
* Profile memory with tools—identify allocations in hot paths causing GC pressure.

---

## Questions & Answers

**Q: What's the difference between time and space complexity?**

A: Time measures computational steps; space measures memory used. Some algorithms trade one for the other (caching uses space to save time).

**Q: Does O(1) space mean no memory allocation?**

A: No. O(1) means constant memory regardless of input size. A few variables or a fixed-size buffer is O(1), even if it allocates.

**Q: What's the space complexity of LINQ queries?**

A: Depends. Deferred queries (Where, Select) are O(1) until materialized. ToList() is O(n). OrderBy() allocates O(n) for sorting.

**Q: How do I reduce space complexity?**

A: (1) Use streaming instead of materializing, (2) Operate in-place when possible, (3) Reuse buffers with ArrayPool<T> or stackalloc.

**Q: What's the space complexity of recursion?**

A: O(d) where d is recursion depth. Each call adds a stack frame. Deep recursion can cause StackOverflowException—use iteration for unbounded depth.

**Q: Can space complexity be negative?**

A: No. O(0) doesn't exist. Minimum is O(1) (constant space for variables). Algorithms always use some memory.

**Q: What's the space complexity of StringBuilder?**

A: O(n) where n is the final string length. StringBuilder allocates a buffer and resizes as needed, but total space scales with content.

**Q: How does GC relate to space complexity?**

A: Space complexity measures peak memory. GC reclaims unused objects, but high allocation rates cause GC pressure. Minimize allocations in hot paths.

**Q: What's ArrayPool<T> and when should I use it?**

A: ArrayPool<T> reuses arrays to reduce allocations. Use for temporary buffers in high-frequency paths (parsing, serialization). Return arrays after use.

**Q: How do I measure space complexity in practice?**

A: Use profilers (dotMemory, PerfView) to track allocations. Look for O(n) growth in object count or heap size as input scales.
