# 🧠 ⏱️ Big O Complexity — Deep Dive with Examples

---

- [O(1) — Constant Time](O1-Constant-Time.md)
- [O(log n) — Logarithmic Time](OLogN-Logarithmic-Time.md)
- [O(n) — Linear Time](ON-Linear-Time.md)
- [O(n log n) — Linearithmic Time](ONLogN-Linearithmic-Time.md)
- [O(n²) — Quadratic Time](ON2-Quadratic-Time.md)
- [Space Complexity — Memory Usage](Space-Complexity.md)

---

## Questions & Answers

**Q: Why does Big O matter for senior engineers?**

A: Understanding complexity lets you predict scalability. A trading system processing millions of ticks can't afford O(n²) algorithms. Big O guides data structure choices and identifies bottlenecks before production.

**Q: How does Big O relate to real-world performance?**

A: Big O describes growth rate, not absolute speed. O(n) with 1000 operations might beat O(1) with 100 operations for small n. Always profile, but use Big O to predict scaling behavior.

**Q: What's the difference between time and space complexity?**

A: Time complexity measures computational steps; space complexity measures memory usage. Some algorithms trade space for speed (caching, hash tables) or vice versa (in-place sorting).

**Q: How do you measure Big O for LINQ queries?**

A: Depends on the operation and underlying collection. `.Where()` on IEnumerable<T> is O(n), `.First()` is O(1) on IList<T> but O(n) on IEnumerable<T>. Know your data structures.

**Q: Can Big O help with database queries?**

A: Yes. Missing indexes turn O(1) lookups into O(n) table scans. JOIN operations, sorting, and aggregations have complexity costs. Use execution plans to identify O(n²) nested loops.

**Q: How does amortized complexity differ from worst-case?**

A: Amortized spreads cost over many operations. List<T>.Add() is O(1) amortized (occasional resizing is O(n)), but worst-case for a single Add() is O(n). Most analyses use amortized for collections.

**Q: What's the complexity of Dictionary<TKey, TValue> operations?**

A: Average case: O(1) for Add, Remove, ContainsKey due to hashing. Worst case: O(n) if all keys hash to the same bucket (rare with good hash functions). EqualityComparer matters.

**Q: How do you optimize O(n²) code?**

A: Use hash sets for lookups (O(1) vs O(n)), sort then binary search (O(n log n) vs O(n²)), or use dictionaries to cache results. Avoid nested loops over the same dataset.

**Q: What's the complexity of string concatenation in loops?**

A: `str += value` in a loop is O(n²) because strings are immutable—each concat allocates a new string. Use StringBuilder for O(n) complexity.

**Q: How does Big O apply to async/await?**

A: Async doesn't change algorithmic complexity; it changes latency/throughput. Calling 1000 APIs sequentially is still O(n) time, but parallel execution (Task.WhenAll) improves wall-clock time, not Big O.
