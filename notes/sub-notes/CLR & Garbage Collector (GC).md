# CLR & Garbage Collector (GC) — Deep but Practical

## 1) Heap layout & generations (what actually happens)

* **Two main heaps:**

  * **SOH (Small Object Heap):** most objects. Split into **Gen0**, **Gen1**, **Gen2**.
  * **LOH (Large Object Heap):** objects **≥ ~85,000 bytes** (arrays/large strings). Allocating on LOH skips Gen0/Gen1.
* **Promotion rule:** survive a collection → promoted (Gen0 → Gen1 → Gen2). Long-lived objects end up in Gen2.
* **Segments:** The GC manages memory in **segments** (ephemeral segments hold Gen0/Gen1). Collections reclaim from the youngest gen that’s “full enough”.
* **Compaction:** SOH is compacted by default (reduces fragmentation). **LOH is not compacted by default**; it can fragment—there is an opt-in compaction knob (see tuning).

**Mental model**

```
Stack → short-lived refs
         │
         ▼
 Gen0 ──► Gen1 ──► Gen2        LOH (≥ ~85 KB)
 small     medium   long        massive arrays/strings
 (compacts) (compacts) (compacts)   (not by default)
```

## 2) GC flavors & latency modes (pick the right one)

* **Server vs Workstation GC**
  * **Server GC:** one dedicated GC thread **per core**, larger segments, throughput-optimized. Best for **ASP.NET Core / services**.
  * **Workstation GC:** aims for desktop responsiveness (WPF/WinForms/dev tools).
  * Check via `GCSettings.IsServerGC`. In containers, .NET is **container-aware**; set env vars to tune (see §7).
* **Concurrent/Background GC**
  * Background (Gen2) collections run concurrently with the app; Gen0/Gen1 are still stop-the-world but short.
* **Latency modes** (`GCSettings.LatencyMode`)
  * **Batch:** max throughput, longer pauses OK (default on server GC during blocking GCs).
  * **Interactive:** balanced (workstation default).
  * **SustainedLowLatency:** fewer Gen2 collections; use around latency-sensitive windows.
  * **NoGCRegion:** ask GC to **avoid any collections** while you do a critical operation—must pre-reserve memory (`GC.TryStartNoGCRegion(...)`). Fails if you allocate more than reserved or cause LOH pressure.

## 3) Allocation discipline (the #1 lever you control)

* **Avoid allocations in hot paths:** every avoidable allocation is one less Gen0 pressure spike.

  * Reuse buffers (**`ArrayPool<T>`**, **`IMemoryOwner<T>`**), cache common arrays, and prefer **`StringBuilder`** for concatenation in loops.
  * Be mindful with LINQ in tight loops (iterator/lambda allocations); favor hand-written loops where perf matters.
  * Use `struct` for tiny, immutable value types that are frequently created; **don’t** make them huge (copy cost) or mutable (defensive copies).
  * Prefer **`ValueTask`** over `Task` for sync-completing async methods to reduce allocations.
* **Pinned objects** (e.g., for interop) **impede compaction**; pin rarely and briefly (copy to a staging buffer if needed).
* **Strings:** avoid excessive substringing/slicing that creates new strings; parse with spans, or use `ReadOnlyMemory<char>`.

## 4) `Span<T>` / `Memory<T>` (zero-alloc parsing & slicing)

* **`Span<T>`** is a **`ref struct`** that can point to **stack**, **array**, **native**, or **unmanaged** memory without allocating.

  * Great for **protocol frame parsing**, **ASCII/UTF8 decoding**, **CSV/JSON tokenization**, and **binary** manipulations.
  * **Zero allocations** for slicing: `span = span.Slice(offset, length)`.
  * **Restrictions:** cannot be boxed, captured by closures, stored in fields of reference types, or used across `await`/iterator boundaries (stack-bound).
* **`ReadOnlySpan<T>`** for read-only views (e.g., over `string` via `AsSpan()`).
* **`Memory<T>`/`ReadOnlyMemory<T>`**: heap-safe counterpart you can **store and pass across async** boundaries. Use when you need to **persist** a view or **await**.
* **Buffers & pools:**

  * Acquire with `ArrayPool<T>.Shared.Rent(n)` → get **`T[]`**; present it as `Memory<T>`/`Span<T>`; return it with `Return`.
  * For pipelines or I/O heavy paths, consider **`System.IO.Pipelines`** which surfaces spans/memory natively.

**Interview tie-in (MT4/MT5 / market data):**
Parsing tick/quote frames from sockets: read into a pooled buffer → slice using `Span<byte>` → parse fields with `BinaryPrimitives`/`Utf8Parser` → avoid intermediate strings → map to structs → publish.

## 5) Finalization, disposal & handles (don’t leak)

* **`IDisposable` pattern:** free **unmanaged resources** deterministically (`using`/`await using`). Prefer **`SafeHandle`** over raw IntPtr in finalizers.
* **Finalizers:** expensive. Object enters **F-reachable** queue; requires **at least one extra GC** to clean. Keep finalizable objects minimal and lightweight.
* **`using`** is your friend—especially around sockets/streams where LOH buffers could be held inadvertently.

## 6) Diagnostics (how you prove it)

* **Counters:** `dotnet-counters monitor System.Runtime` (GC Heap Size, Gen0/1/2 Count, % Time in GC).
* **Traces:** `dotnet-trace`, **PerfView**, Windows **ETW**, or **dotnet-gcdump** to analyze object graphs and hot types.
* **AspNetCore:** enable event source providers for request rates + GC to correlate pauses with traffic.

A crisp story to tell:

> “We saw frequent Gen2s during peak quotes. Using counters we correlated high LOH allocations from JSON serialization. We switched to `Utf8JsonReader` + pooled buffers, cut LOH churn by 80%, Gen2 frequency dropped 5×, p95 latency improved from 120 ms to 35 ms.”

## 7) Tuning knobs (what to adjust when)

* **Enable Server GC** for services: env var `DOTNET_GCServer=1` (usually default in ASP.NET Core).
* **Heap limits in containers:**

  * `DOTNET_GCHeapHardLimit` / `DOTNET_GCHeapHardLimitPercent` to cap; or rely on container-aware defaults (Core 3.0+).
* **LOH compaction:** `GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce; GC.Collect(GC.MaxGeneration, GCCollectionMode.Forced);`
  Use **sparingly** during maintenance windows; it’s a **blocking** full GC.
* **Latency windows:**

  * Before a critical burst (e.g., market open): `GC.TryStartNoGCRegion(...)` with enough headroom; `GC.EndNoGCRegion()` after.
  * Or `SustainedLowLatency` around time-sensitive processing (expect more memory use).

## 8) Async & threading interactions (common pitfalls)

* **Async hot paths** allocate continuations; use `ValueTask` when appropriate, and **avoid async** if the path completes synchronously.
* **Thread safety vs allocations:** prefer **`ConcurrentDictionary`** sparingly; in very hot paths use sharded locks or lock-free patterns.
* **Backpressure:** when deserializing streams at line-rate, use pipelines to **avoid intermediate buffers** and enforce backpressure.

## 9) Quick do/don’t checklist (interview-ready)

**Do**

* Pool large arrays and reuse buffers.
* Parse with `Span<T>`/`Utf8JsonReader` instead of allocating substrings/`JObject`.
* Measure with counters/traces before changing GC settings.
* Prefer Server GC for services; confirm in prod.

**Don’t**

* Pin big objects for long (crushes compaction).
* Sprinkle LINQ/closures in micro-paths.
* Force `GC.Collect()` routinely (it **hurts** overall throughput).
* Leave finalizers doing heavy work.

---

## One-minute “explain it like a senior” answer

> “.NET uses a **generational GC**: most objects die young in **Gen0/Gen1**, long-lived objects are promoted to **Gen2**; very large allocations go to the **LOH**, which isn’t compacted by default. For services we run **Server GC** to maximize throughput with background Gen2 collections. We keep **allocation pressure** low in hot paths—pool buffers, use **`Span<T>`** for zero-alloc parsing, and use **`Memory<T>`** across async boundaries. We monitor **GC counters** to spot excessive Gen2/LOH activity. If fragmentation creeps into LOH we schedule a one-off compaction. We only tweak latency modes for short, critical windows and never force collections in steady state.”

If you want, I can give you a **10-minute hands-on drill**: a tiny price-tick parser using `Span<byte>`, `ArrayPool<byte>`, and counters you can discuss live.

---

## Questions & Answers

**Q: What are the primary heaps managed by the CLR GC?**

A: The Small Object Heap (Gen0, Gen1, Gen2) for most allocations and the Large Object Heap (LOH) for objects ≥ ~85 KB. LOH skips Gen0/1 and isn’t compacted by default.

**Q: When would you enable Server GC vs Workstation GC?**

A: Server GC is ideal for ASP.NET/services because it uses per-core GC threads and larger segments for throughput. Workstation GC suits desktop apps needing responsiveness.

**Q: How do you reduce Gen2 collections?**

A: Lower allocation pressure (pool buffers, reuse objects), fix leaks, and avoid promoting long-lived caches unnecessarily. Monitor `Gen 2 GC Count` and LOH allocations.

**Q: What is `NoGCRegion` and when should you use it?**

A: It temporarily disables GC by pre-reserving memory for critical sections (e.g., market open). Use sparingly; exceeding the reserved size or hitting LOH allocations ends it prematurely.

**Q: How do you minimize LOH fragmentation?**

A: Avoid frequent large allocations, reuse arrays via `ArrayPool<T>`, and schedule `GCLargeObjectHeapCompactionMode.CompactOnce` only during maintenance windows.

**Q: Why is forcing `GC.Collect()` usually a bad idea?**

A: It induces full, blocking collections that hurt throughput. Let the GC decide when to collect unless you’re in a very specific maintenance scenario.

**Q: How do spans/memory types impact GC?**

A: `Span<T>`/`Memory<T>` enable zero-copy operations, reducing allocations that would otherwise add pressure on Gen0/1. They help keep critical paths GC-neutral.

**Q: Which diagnostics do you rely on to understand GC behavior?**

A: `dotnet-counters` (Allocated Bytes/sec, % Time in GC), `dotnet-trace`, PerfView, and `dotnet-gcdump` to inspect heap composition and collection frequency.

**Q: How do you tune GC in containers?**

A: Use container-aware defaults (.NET 6+), but override with `DOTNET_GCHeapHardLimit` or `DOTNET_GCHeapHardLimitPercent` for strict caps. Ensure CPU/memory limits align with GC thread counts.

**Q: How do latency modes affect runtime behavior?**

A: Modes like `SustainedLowLatency` reduce Gen2 frequency at the cost of higher memory usage. `Batch` maximizes throughput but tolerates longer pauses. Choose based on workload requirements.
