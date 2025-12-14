### Type Choices — `class`, `record`, `struct`, `static` (where & why)

Choosing the right kind of type affects memory layout, equality semantics, mutability, and API contracts. Use these rules of thumb when designing models and DTOs:

- `class` (reference type):
  - Use for objects with identity, lifecycle, or potentially large mutable state (e.g., domain entities, services).
  - Instances are allocated on the heap; assignments copy references, not state.
  - Good when you want shared mutable state or polymorphism (virtual methods, inheritance).
  - Example: `public class Order { public int Id; public decimal Amount; }`

- `struct` (value type):
  - Use for small, immutable, copy-by-value types that represent a single value (e.g., `Price`, `Coordinate`).
  - Avoid large structs (copying cost) or mutable structs (surprising semantics when boxed or assigned).
  - Prefer `readonly struct` for immutable value semantics.
  - Example: `public readonly struct Price { public decimal Amount { get; } }`

- `record` (reference-record, C# 9+):
  - Use when you want concise immutable data carriers with value-based equality and non-destructive mutation (`with` expressions).
  - Ideal for DTOs, messages, and snapshots where equality by content is helpful.
  - Records are reference types by default (there is also `record struct` for value semantics).
  - Example: `public record OrderDto(int Id, string Symbol, decimal Amount);`

- `record struct` (C# 10+):
  - Combines record conveniences (auto equality, `with`) with value-type semantics — useful for small immutable value objects where structural equality is desired.

- `static` classes / members:
  - Use `static` classes for stateless helpers, extension method containers, and singletons without state.
  - `static` members belong to the type rather than instances; no instantiation possible.
  - Be cautious: `static` mutable state is effectively global and introduces thread-safety concerns.
  - Example: `public static class Email { public static void Send(...) { ... } }`

### Practical guidance & trade-offs

- Prefer `record` for DTOs and immutable data transfer where content equality is useful.
- Prefer `class` for domain entities that have an identity (database ID) and lifecycle; they usually need to be mutable or proxied by ORMs.
- Use `struct`/`record struct` for very small value objects (e.g., `PriceTick`, `Timestamp`) to avoid heap allocation when copying is cheap.
- Favour immutability for simple data carriers — it reduces shared-state bugs and simplifies reasoning, especially across threads.
- Avoid mutable singletons or `static` mutable fields; prefer injected, testable services with clear lifetimes.

### Quick examples

```csharp
// record for DTO
public record OrderDto(int Id, string Symbol, decimal Amount);

// class for entity
public class Order
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
}

// small readonly struct for value
public readonly struct PriceTick
{
    public decimal Bid { get; }
    public decimal Ask { get; }
    public PriceTick(decimal bid, decimal ask) => (Bid, Ask) = (bid, ask);
}

// static helper
public static class MathHelpers { public static decimal RoundPrice(decimal p) => Math.Round(p, 5); }
```

If you'd like, I can link this file from `core-concepts.md` and/or expand it with interview bullet points for quick review.

---

## Questions & Answers

**Q: When do you use `record` vs `class`?**

A: Use records when you want concise immutable data carriers with value-based equality (DTOs, events). Use classes when identity/lifecycle matters or when you need mutable state and inheritance.

**Q: What’s the benefit of `record struct`?**

A: It combines value semantics (no heap allocation) with generated equality/`with` expressions. Ideal for small immutable value objects where structural equality is desired.

**Q: Why avoid large structs?**

A: Copying them is expensive and negates GC benefits. Keep structs small (≤16 bytes) or pass by `in`/`ref` to avoid copies.

**Q: When do you choose `static` classes?**

A: For stateless helpers or extension method containers. Avoid `static` mutable state because it’s effectively global and complicates testing/threading.

**Q: How do `record` equality semantics work?**

A: Records implement value-based equality by comparing declared properties/fields. Classes use reference equality unless you override `Equals`/`GetHashCode`.

**Q: Can records be mutable?**

A: Yes, but it defeats their primary benefit. Prefer init-only setters or positional parameters to keep them immutable and safe across threads.

**Q: When does `record` inheritance make sense?**

A: When modeling hierarchies of immutable data (e.g., different message types). Remember records default to value equality, so ensure derived records add properties carefully.

**Q: When should you convert a record to a class?**

A: If you need identity semantics, lazy-loaded navigation properties (e.g., EF proxies), or mutable behavior beyond data transfer.

**Q: How do you select between `struct` and `record struct`?**

A: If you need value semantics plus generated equality/`with`, use `record struct`. If you want full control over equality/toString, a regular `struct` might suffice.

**Q: How do type choices impact serialization?**

A: Many serializers support classes/records out of the box. Structs serialize fine but be mindful of default values and boxing when using polymorphic serialization.
