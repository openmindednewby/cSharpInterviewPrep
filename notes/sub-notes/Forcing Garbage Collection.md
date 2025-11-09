# Forcing Garbage Collection (Rarely Needed)

```csharp
GC.Collect(GC.MaxGeneration, GCCollectionMode.Forced, blocking: true, compacting: true);
GC.WaitForPendingFinalizers();
GC.Collect();
```

- Forces collection of **all generations** and waits for finalizers. Use only for diagnostic tools or when transitioning between phases (e.g., benchmark setup vs measurement).
- In production code, let the GC run heuristically—manual collection can hurt throughput and latency.
