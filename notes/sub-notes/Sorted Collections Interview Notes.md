# Sorted Collections & Interview Talking Points

| Collection | Ordering | Duplicates | Big-O (lookup/insert) | Interview Highlights |
| ---------- | -------- | ---------- | ---------------------- | -------------------- |
| `List<T>` + `List<T>.Sort()` | Custom comparer | Allows duplicates | Lookup: `O(n)`, Insert (sorted): `O(n)` | Use when you can sort once and traverse. Mention `Array.Sort` vs `List<T>.Sort` and `Span<T>` overloads. |
| `SortedList<TKey,TValue>` | Sorted by key (array-backed) | Keys must be unique | Lookup: `O(log n)`, Insert: `O(n)` | Compact memory footprint, but expensive inserts due to array shifts. Great for mostly-read scenarios. |
| `SortedDictionary<TKey,TValue>` | Sorted by key (red-black tree) | Keys must be unique | Lookup/Insert: `O(log n)` | Balanced tree handles frequent inserts/removals better than `SortedList`. |
| `SortedSet<T>` | Sorted by value (tree) | No duplicates | Lookup/Insert: `O(log n)` | Ideal for maintaining a sorted unique set—mention `GetViewBetween`. |
| `PriorityQueue<TElement,TPriority>` | Min-heap by priority | Allows duplicates | Enqueue: `O(log n)`, Peek: `O(1)` | Perfect for Dijkstra/A* discussions. Talk about customizing priority comparer. |

> 🧠 **Practice Prompt:** Explain how you’d pick between `SortedList` and `SortedDictionary` for a price ladder updated multiple times per second.

---

## Questions & Answers

**Q: When would you use `SortedList` over `SortedDictionary`?**

A: When reads dominate and the key set doesn’t change frequently. `SortedList` uses arrays, so lookups are `O(log n)`, but inserts shift elements (`O(n)`), making it best for mostly-static data.

**Q: How do `SortedDictionary` and `SortedSet` differ?**

A: `SortedDictionary` stores key/value pairs with unique keys. `SortedSet` stores unique values only. Both use balanced trees with `O(log n)` operations; choose based on whether you need values associated with keys.

**Q: What’s a practical use of `SortedSet.GetViewBetween`?**

A: Maintaining sliding windows or retrieving ranges (e.g., trades between two timestamps) without copying data.

**Q: How do you implement a max-heap with `PriorityQueue`?**

A: Provide a comparer that flips the priority ordering (e.g., `Comparer<int>.Create((a,b) => b.CompareTo(a))`) so highest values bubble to the top.

**Q: How do sorted collections handle custom ordering?**

A: Pass an `IComparer<T>` or implement `IComparable<T>` on keys/elements. This enables domain-specific ordering (e.g., price descending, timestamp ascending).

**Q: When is `List<T>.BinarySearch` enough?**

A: If you can maintain a sorted list and only need lookups/removals occasionally. Inserts remain `O(n)`, but the simplicity might beat tree-based structures.

**Q: How do you keep sorted collections thread-safe?**

A: Wrap access with locks or use immutable snapshots. There’s no built-in concurrent sorted collection, so you must manage synchronization yourself.

**Q: How does memory usage compare between `SortedList` and `SortedDictionary`?**

A: `SortedList` uses contiguous arrays (less overhead). `SortedDictionary` stores nodes with pointers (higher overhead) but faster inserts/removals.

**Q: How do you maintain a top-N leaderboard efficiently?**

A: Use `SortedSet` or `PriorityQueue` bounded to N items. When a new value arrives, compare against the smallest/largest and adjust accordingly.

**Q: What are alternatives for huge sorted datasets?**

A: Consider B-trees or sorted indexes at the storage layer (SQL ORDER BY/indexes), or specialized libraries like `ImmutableSortedSet` for functional requirements.
