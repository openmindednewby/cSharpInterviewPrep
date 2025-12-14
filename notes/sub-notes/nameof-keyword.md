# Using `nameof` in C# — safe names for refactoring and diagnostics

The `nameof` operator returns the simple (unqualified) string name of a variable, type, or member at compile time. It's a small but powerful tool for writing safer, refactor-friendly code.

---

### ✅ Why use `nameof` instead of string literals

- **Refactor-safe:** `nameof(SomeProperty)` is updated by refactoring tools (or will fail to compile if renamed), while `"SomeProperty"` can become stale and lead to bugs.
- **Compile-time checked:** If the symbol doesn't exist, code using `nameof` will not compile.
- **Clear intent:** It expresses that the string is a program symbol name (not arbitrary text).

---

### 📌 Basic examples

```csharp
public class Order
{
    public int Id { get; set; }
}

// get property name
var prop = nameof(Order.Id); // "Id"

string local = "value";
var name = nameof(local); // "local"

// type name
var typeName = nameof(Dictionary<int, string>); // "Dictionary"
```

Note: `nameof` returns only the identifier portion — for generic types it returns the unqualified generic type name (not type arguments).

---

### Common usages

- Argument validation and exceptions:

```csharp
public void SetPrice(decimal price)
{
    if (price <= 0) throw new ArgumentOutOfRangeException(nameof(price), "Price must be positive");
}
```

- INotifyPropertyChanged implementations:

```csharp
private void Notify(string property) => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(property));

public void UpdateName(string name)
{
    _name = name;
    Notify(nameof(Name));
}
```

- Logging and diagnostics (to avoid stale literal names):

```csharp
_logger.LogInformation("Started processing {Handler}", nameof(MyHandler));
```

---

### Edge cases & notes

- `nameof` is evaluated at compile time and produces a `string` literal in the compiled IL.
- `nameof` does not evaluate expressions — only identifiers (types, members, local variables, parameters).
- Using `nameof` on overloaded member groups (e.g., methods with same name) yields the single name string; it does not encode the signature.
- For nested types `nameof(Outer.Inner)` returns `Inner`.

---

### Quick summary

- **Use `nameof(...)`** whenever you need the name of a symbol in code (argument checks, property-changed events, logging) to stay safe during refactoring.
- It reduces bugs caused by mismatched string literals and improves maintainability.

---

If you'd like, I can add a short section showing `nameof` combined with `CallerMemberName` for compact `INotifyPropertyChanged` helpers. Would you like that included?

---

## Questions & Answers

**Q: Why prefer `nameof` over hard-coded strings?**

A: It’s refactor-safe. Renaming a symbol updates `nameof` usage automatically; string literals would silently become stale.

**Q: Is `nameof` evaluated at runtime?**

A: No, it’s compile-time. The compiler replaces `nameof(Symbol)` with a string literal, so there’s zero runtime cost.

**Q: Can `nameof` handle fully qualified names?**

A: You can pass `Namespace.Type.Member`, but it returns only the last identifier (e.g., `Member`). Use `typeof(Type).FullName` if you need the full name.

**Q: How does `nameof` help with exceptions?**

A: Use it in `ArgumentNullException(nameof(param))` so parameter names stay accurate even after refactors.

**Q: Can you use `nameof` with generics?**

A: Yes, but it returns the unqualified type name (e.g., `nameof(Dictionary<int,string>)` yields `"Dictionary"`). It doesn’t include type arguments.

**Q: Does `nameof` support aliases?**

A: Yes—it respects `using alias = ...;`. `nameof(alias)` returns the alias name, not the underlying type.

**Q: Can `nameof` reference private members?**

A: Absolutely. It works with any accessible symbol at compile time, including locals, parameters, and private members.

**Q: How does `nameof` interact with `CallerMemberName`?**

A: `CallerMemberName` auto-fills the calling member name. Use `nameof` when referencing other members explicitly, and `CallerMemberName` when you want the current member at call site.

**Q: Can `nameof` reference methods?**

A: Yes—`nameof(MyMethod)` returns `"MyMethod"`, regardless of overloads. It doesn’t encode signatures.

**Q: How do you ensure localization isn’t impacted?**

A: `nameof` is for developer-oriented strings (logging, diagnostics), not user-visible text. Keep localized strings separate from `nameof` usage.
