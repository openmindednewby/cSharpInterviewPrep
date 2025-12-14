# Reflection Overview

- **Concept:** Inspect metadata and interact with types at runtime via `System.Reflection`.
- **Use Cases:** Plugin discovery, serialization, mapping attributes to behavior, building DI containers.
- **Cost:** Reflection is slower—cache `PropertyInfo`/`MethodInfo` or emit delegates (`CreateDelegate`) for hot paths.

```csharp
var assembly = Assembly.Load("Trading.Services");
var handlers = assembly.GetTypes()
    .Where(t => typeof(ICommandHandler).IsAssignableFrom(t) && !t.IsAbstract);

foreach (var handler in handlers)
{
    Console.WriteLine($"Discovered handler: {handler.Name}");
}
```

> 🔍 **Interview Angle:** Be ready to explain how `ActivatorUtilities` or `JsonSerializer` leverage reflection and how source generators reduce reflection cost in .NET 5+.

---

## Questions & Answers

**Q: When is reflection appropriate despite its cost?**

A: For dynamic scenarios like plugin discovery, serialization, attribute-driven behavior, or tooling where compile-time knowledge is limited. Use it outside hot paths or cache results.

**Q: How do you mitigate reflection performance penalties?**

A: Cache `PropertyInfo`/`MethodInfo`, create delegates via `CreateDelegate`, or use `Expression` trees to generate accessors. Source generators can precompute metadata to avoid runtime reflection entirely.

**Q: What are alternatives to reflection for DI?**

A: Compile-time registration, source generators, or manual wiring. Reflection simplifies auto-discovery but can slow startup; balance convenience with performance.

**Q: How does reflection interact with trimming/AOT?**

A: Trimming can remove unused members. Reflection needs preserved metadata, so mark types with `DynamicallyAccessedMembers` or `Preserve` attributes when building self-contained apps.

**Q: How do you secure reflection usage?**

A: Validate assembly paths, restrict loaded types/namespaces, and avoid executing untrusted code. Reflection can bypass encapsulation, so enforce security at the host/application level.

**Q: Can reflection access private members?**

A: Yes via `BindingFlags.NonPublic`, but it should be used sparingly (e.g., for testing). It can break encapsulation and may fail under IL trimming.

**Q: How do you use reflection emit or `System.Reflection.Emit`?**

A: To generate types/methods at runtime (dynamic proxies, serialization). It’s powerful but complex; prefer `Expression` trees or source generators when possible.

**Q: What’s the cost of `Activator.CreateInstance` vs `new`?**

A: `Activator.CreateInstance` is slower because it uses reflection. Cache constructors via compiled delegates when instantiating frequently.

**Q: How does `JsonSerializer` leverage reflection?**

A: It inspects types at runtime to discover properties/attributes. In .NET 6+, source generators can precompute serializers to avoid reflection overhead and enable trimming.

**Q: How do you test reflection-heavy code?**

A: Write unit tests for discovery logic (ensuring correct types are found) and integration tests that verify attributes/config drive expected behavior. Mock metadata where possible.
