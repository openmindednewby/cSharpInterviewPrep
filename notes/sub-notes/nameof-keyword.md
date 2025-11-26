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