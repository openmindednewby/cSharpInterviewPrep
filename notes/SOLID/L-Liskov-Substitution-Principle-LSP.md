## **L — Liskov Substitution Principle (LSP)**

> “Derived classes should be substitutable for their base classes.”

Derived classes must behave consistently with their base abstraction. If code works with a base type, it must also work with any derived type, without extra checks, exceptions, or special cases. Inheritance is a promise of behavior, not just shared code.

### ❌ Bad example:

```csharp
public abstract class Order
{
    public abstract void Cancel();
}

public class MarketOrder : Order
{
    public override void Cancel() => Console.WriteLine("Cancelled");
}

public class InstantOrder : Order
{
    public override void Cancel() => throw new NotSupportedException();
}
```

❌ Violates LSP — an `InstantOrder` cannot cancel, so substituting it breaks code.

### ✅ Good example:

```csharp
public interface ICancelableOrder
{
    void Cancel();
}
public class MarketOrder : ICancelableOrder { public void Cancel() { /* ... */ } }
```

💡 **In trading systems:**
If you design a `Strategy` base class, ensure all derived strategies behave consistently and safely under the same interface.

---

## Questions & Answers

**Q: How do you detect LSP violations?**

A: When derived types throw or ignore base contract requirements (e.g., methods not supported) or when client code needs `is` checks before calling base members. Unit tests failing when swapping implementations are another sign.

**Q: How does LSP relate to API compatibility?**

A: New API versions must remain substitutable for clients expecting older behavior. Breaking contract expectations (return types, error codes) violates LSP-like guarantees.

**Q: How can preconditions/postconditions break LSP?**

A: Derived classes shouldn’t strengthen preconditions (require extra setup) nor weaken postconditions (provide less result). Keep invariants consistent with the base definition.

**Q: When should you refactor inheritance into composition?**

A: If derived classes must disable base behavior or add flags to avoid inherited logic, switch to composition/strategies. This keeps contracts honest and avoids LSP pitfalls.

**Q: How do you test for LSP compliance?**

A: Create contract tests that run against the base interface and execute them for every implementation. If any fail, the type isn’t substitutable.

**Q: Does LSP apply to generics or covariance?**

A: Yes—ensure generic constraints and variance don't allow incompatible substitutions that break runtime behavior (e.g., returning base types where derived specifics are expected).

**Q: How does LSP affect exception handling?**

A: Derived classes should not introduce new unchecked exceptions for operations the base class promised to handle. Keep the failure semantics consistent.

**Q: How does LSP influence serialization/deserialization?**

A: When polymorphic types are serialized, derived classes must adhere to expected schema so consumers can deserialize using the base contract without surprises.

**Q: What design smell indicates an LSP issue?**

A: Methods in base types throwing `NotImplementedException` in derived classes, or `switch` statements on type codes. These indicate the hierarchy is mis-modeled.

**Q: How does LSP tie into SOLID overall?**

A: Without LSP, OCP fails—extensions break existing clients. Ensuring substitutability keeps abstractions reliable and enables safe extension.
