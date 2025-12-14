# Forcing Garbage Collection (Rarely Needed)

```csharp
GC.Collect(GC.MaxGeneration, GCCollectionMode.Forced, blocking: true, compacting: true);
GC.WaitForPendingFinalizers();
GC.Collect();
```

- Forces collection of **all generations** and waits for finalizers. Use only for diagnostic tools or when transitioning between phases (e.g., benchmark setup vs measurement).
- In production code, let the GC run heuristically—manual collection can hurt throughput and latency.

---

## Questions & Answers

**Q: When is it acceptable to call `GC.Collect()`?**

A: During benchmarking (to start from a clean slate) or tooling scenarios (e.g., before capturing a memory snapshot). Avoid in normal application flow.

**Q: What’s the impact of forcing a full GC in production?**

A: It pauses all managed threads, potentially causing latency spikes and throughput loss, negating the GC’s heuristics.

**Q: How do you compact the LOH manually?**

A: Set `GCSettings.LargeObjectHeapCompactionMode = CompactOnce`, call `GC.Collect()` with compacting enabled, typically during maintenance windows.

**Q: Why call `GC.WaitForPendingFinalizers()` between collections?**

A: To ensure finalizers from the first collection run before initiating another GC pass, guaranteeing cleanup of finalizable objects.

**Q: How do you trigger GC in benchmarks without skewing results?**

A: Force GC during setup/cleanup phases, not inside the measured benchmark method, so the measurement represents steady-state behavior.

**Q: Can `GC.Collect()` free native resources?**

A: Only indirectly—finalizers may release native handles. For deterministic cleanup, implement `IDisposable` instead of relying on GC.

**Q: How do you monitor if someone accidentally added `GC.Collect()` in production?**

A: Use ETW/EventPipe or `dotnet-trace` to capture GC start reasons. Forced GCs show up with reason `Induced`.

**Q: What alternatives exist for managing memory spikes?**

A: Reduce allocation rates, pool objects, and fix leaks rather than forcing collections. Use `GC.TryStartNoGCRegion` for temporary low-latency windows instead.

**Q: How does forcing GC affect NoGCRegion?**

A: Calling `GC.Collect()` invalidates `NoGCRegion`. Instead, exit the region properly or avoid entering it if you plan to induce GC.

**Q: Can you request Gen0-only collections?**

A: Yes via `GC.Collect(0)`, but even that incurs overhead. Rely on GC heuristics unless you have a proven diagnostic need.
