## **L — Liskov Substitution Principle (LSP)**

> “Derived classes should be substitutable for their base classes.”

Derived classes must behave consistently with their base abstraction.

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
