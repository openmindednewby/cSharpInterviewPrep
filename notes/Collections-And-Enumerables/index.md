# 🧠 📚 Collection Interfaces — Deep Dive with Examples

---

- [IEnumerable<T> — Read-Only Forward Iteration](IEnumerable.md)
- [ICollection<T> — Countable, Modifiable Collections](ICollection.md)
- [IList<T> — Indexed Access Collections](IList.md)
- [IReadOnlyCollection<T> & IReadOnlyList<T> — Immutable Access](IReadOnly.md)
- [IQueryable<T> — Expression Trees for Remote Queries](IQueryable.md)

---

## Questions & Answers

**Q: Why should I return IEnumerable<T> instead of List<T>?**

A: IEnumerable<T> exposes only iteration, hiding mutability and implementation details. Callers can't modify the source, and you can swap concrete types (arrays, lists, query results) without breaking contracts.

**Q: When should I use ICollection<T> over IEnumerable<T>?**

A: When you need Count without enumerating everything, or when callers need Add/Remove. Trading systems use ICollection<T> for position snapshots where count matters for validation.

**Q: What's the performance difference between IEnumerable<T> and IList<T>?**

A: IList<T> supports O(1) indexed access; IEnumerable<T> is forward-only. Use IList<T> when random access is needed; otherwise prefer IEnumerable<T> for flexibility and deferred execution.

**Q: How does IQueryable<T> enable LINQ-to-SQL?**

A: IQueryable<T> builds expression trees instead of executing code. Providers like Entity Framework translate these trees into SQL, pushing filtering/sorting to the database instead of memory.

**Q: Should I return IReadOnlyCollection<T> or IEnumerable<T>?**

A: IReadOnlyCollection<T> when Count is cheap and useful to callers (e.g., pre-allocated arrays). IEnumerable<T> when iteration might be lazy or infinite, or when hiding collection semantics.

**Q: What happens if I call .ToList() on every IEnumerable<T>?**

A: You materialize the entire sequence into memory immediately, losing lazy evaluation benefits. This hurts performance with large datasets and breaks streaming scenarios.

**Q: How do these interfaces relate to LINQ?**

A: LINQ methods extend IEnumerable<T> and IQueryable<T>. IEnumerable<T> uses LINQ-to-Objects (in-memory), IQueryable<T> uses providers (LINQ-to-SQL, LINQ-to-Entities) for remote execution.

**Q: Can I cast IEnumerable<T> to List<T> safely?**

A: Not always. Use `source as List<T>` for null-safe casting, but prefer enumeration. Casting breaks abstraction and assumes implementation details callers shouldn't know.

**Q: How do collection interfaces improve testability?**

A: Accepting IEnumerable<T> lets tests pass arrays, lists, or mock sequences. Returning interfaces enables stub implementations, avoiding heavyweight setup.

**Q: What's the memory impact of yielding with IEnumerable<T>?**

A: Iterator blocks (`yield return`) create state machines that produce items on demand, reducing peak memory. This is critical for processing large datasets or infinite sequences.
