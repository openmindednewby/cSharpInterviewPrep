# Sorted Collections & Interview Talking Points

| Collection | Ordering | Duplicates | Big-O (lookup/insert) | Interview Highlights |
| ---------- | -------- | ---------- | ---------------------- | -------------------- |
| `List<T>` + `List<T>.Sort()` | Custom comparer | Allows duplicates | Lookup: `O(n)`, Insert (sorted): `O(n)` | Use when you can sort once and traverse. Mention `Array.Sort` vs `List<T>.Sort` and `Span<T>` overloads. |
| `SortedList<TKey,TValue>` | Sorted by key (array-backed) | Keys must be unique | Lookup: `O(log n)`, Insert: `O(n)` | Compact memory footprint, but expensive inserts due to array shifts. Great for mostly-read scenarios. |
| `SortedDictionary<TKey,TValue>` | Sorted by key (red-black tree) | Keys must be unique | Lookup/Insert: `O(log n)` | Balanced tree handles frequent inserts/removals better than `SortedList`. |
| `SortedSet<T>` | Sorted by value (tree) | No duplicates | Lookup/Insert: `O(log n)` | Ideal for maintaining a sorted unique set—mention `GetViewBetween`. |
| `PriorityQueue<TElement,TPriority>` | Min-heap by priority | Allows duplicates | Enqueue: `O(log n)`, Peek: `O(1)` | Perfect for Dijkstra/A* discussions. Talk about customizing priority comparer. |

> 🧠 **Practice Prompt:** Explain how you’d pick between `SortedList` and `SortedDictionary` for a price ladder updated multiple times per second.
