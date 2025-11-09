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
