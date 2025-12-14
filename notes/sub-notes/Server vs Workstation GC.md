# What they are (in practice)

| Aspect                  | **Server GC**                                       | **Workstation GC**                                   |
| ----------------------- | --------------------------------------------------- | ---------------------------------------------------- |
| Goal                    | **Throughput** for multi-core servers               | **Responsiveness** for desktop/interactive apps      |
| Threads                 | **1 GC thread per logical core** (+ background GC)  | **1 GC thread total** (+ background GC)              |
| Segment sizes           | **Larger** heap segments → fewer GCs, longer pauses | **Smaller** segments → more frequent, shorter pauses |
| Compaction              | Parallel, wide                                      | Serial, narrower                                     |
| Default in ASP.NET Core | Usually **enabled**                                 | Not typical                                          |
| Best for                | Web APIs, services, batch jobs, high QPS            | WPF/WinForms, tools, dev utilities                   |

> Quick check at runtime:

```csharp
Console.WriteLine(System.Runtime.GCSettings.IsServerGC); // true = Server GC
```

---

# How they actually run

## Server GC

* On startup, CLR **creates one GC worker per core**. During a blocking GC, all managed threads hit a safepoint; GC workers run **in parallel** to mark/compact.
* **Background (concurrent) Gen2** collections run alongside the app. Gen0/Gen1 are still short stop-the-world.
* **Bigger segments** (ephemeral & Gen2) reduce GC frequency under high allocation rates (typical on APIs parsing JSON, serializing, buffering).
* Pauses can be **longer**, but total **% time in GC** is usually **lower**, boosting throughput.

## Workstation GC

* Designed to **feel snappy** on a single user’s machine.
* Smaller segments → **more frequent, shorter** GCs.
* Background GC also exists, but there’s **no parallel army** of GC workers per core.

---

# Latency & modes (apply to both flavors)

* **Background GC** (Gen2) is on by default; it overlaps some GC work with your app.
* **Latency modes** via `GCSettings.LatencyMode`:

  * `Interactive` (balance; default for workstation).
  * `Batch` (maximize throughput; longer pauses OK—common with server GC).
  * `SustainedLowLatency` (reduce Gen2 frequency; good around critical windows).
  * `NoGCRegion` (attempt zero collections during a critical section—must pre-reserve memory; avoid if you’ll hit LOH or exceed reservation).

Example:

```csharp
using System.Runtime;
GCSettings.LatencyMode = GCLatencyMode.SustainedLowLatency;
```

---

# Container & hosting notes (very relevant today)

* .NET is **container-aware**: CPU/memory limits influence GC heuristics.
* **Environment toggles**:

  * `DOTNET_GCServer=1` (or legacy `COMPlus_GCServer=1`) → Server GC on.
  * Heap caps: `DOTNET_GCHeapHardLimit` or `%` variant to avoid over-commit.
* If you CPU-cap a container (e.g., `--cpus=2`), Server GC will create GC workers according to the limit, not host machine total (Core 3.0+).
* Small microservices with very tight limits sometimes perform **better with Workstation GC** (fewer GC worker threads contending). Measure.

---

# Choosing the right one (simple rules)

Use **Server GC** when:

* ASP.NET Core APIs / gRPC / background services on multi-core hosts.
* High allocation rates (serialization, buffers, streams).
* You prioritize **throughput** and can tolerate slightly longer pauses.

Use **Workstation GC** when:

* UI/desktop apps where **interaction latency** matters.
* Tiny sandboxed processes with strict CPU quotas (1 vCPU) where Server GC parallelism provides little benefit.

---

# Tuning checklist for a trading/back-office service

1. **Ensure Server GC** in production:

   * Set `DOTNET_GCServer=1` in env or project runtimeconfig.
   * Verify with `GCSettings.IsServerGC`.
2. **Watch LOH churn** (≥ 85 KB allocations): pool large buffers (`ArrayPool<T>`), stream with `System.IO.Pipelines`, use `Utf8JsonReader`.
3. **Latency windows** (market open/rollover):

   * Temporarily set `SustainedLowLatency` or carefully use `NoGCRegion`.
4. **Measure, don’t guess**:

   * `dotnet-counters monitor System.Runtime`
   * Key signals: **Gen2 GC Count** (should be rare), **% Time in GC** (low single digits), **Allocated Bytes/sec** (track spikes).
5. **Avoid manual `GC.Collect()`** in steady state—only for controlled maintenance (e.g., one-off LOH compaction during off-peak).

---

# Pitfalls & gotchas (the “senior” bits)

* **Server GC isn’t always faster** if your service is CPU-starved (1 core) or allocation-light. Validate with load tests.
* **Background Gen2 is not free**: if promotion pressure is high (many objects reaching Gen2), you’ll still see noticeable pauses. Reduce promotions by:

  * Shortening object lifetimes (don’t cache what you don’t need).
  * Pooling and reusing (buffers, parsers).
* **Pinned memory** (interop) prevents compaction; pin briefly or copy into a staging buffer to keep the SOH healthy.
* **LOH fragmentation** grows pause times over days/weeks. If you must allocate ≥85 KB often, **restructure to chunk** (e.g., 64 KB + 32 KB) or reuse pooled slabs.

---

# Answers you can give quickly

**Q:** *Why is Server GC better for ASP.NET services?*
**A:** “It uses parallel GC workers per core and larger segments, so collections are less frequent and total GC time is lower. That boosts throughput under high allocation rates typical for APIs.”

**Q:** *When might Workstation GC be preferable on a server?*
**A:** “Very small, CPU-constrained processes—e.g., 1 vCPU containers—where Server GC’s parallelism offers little benefit and shorter workstation pauses feel better. But I’d measure both.”

**Q:** *How do you confirm and monitor this in prod?*
**A:** “`GCSettings.IsServerGC` at startup, and `dotnet-counters`/App Insights to watch Gen2 counts, % time in GC, and allocation rate. If Gen2 climbs or LOH grows, we pool buffers and reduce promotions.”

---

If you want, I can give you a **30-second script** you can say verbatim when they ask “Server vs Workstation GC—when and why?”

---

## Questions & Answers

**Q: How do you switch between Server and Workstation GC?**

A: Set `DOTNET_GCServer=1` (or configure in runtimeconfig) for Server GC. Without it, Workstation GC is used by default for desktop apps. Always verify with `GCSettings.IsServerGC`.

**Q: Why is Server GC ideal for web APIs?**

A: It creates a GC worker per core and uses larger segments, reducing collection frequency and keeping throughput high under heavy allocation workloads common in APIs.

**Q: When would Workstation GC outperform Server GC?**

A: In small, CPU-limited containers or interactive desktop apps where shorter individual pauses matter more than raw throughput. Always measure both modes.

**Q: Do latency modes differ between Server and Workstation GC?**

A: Both support `GCSettings.LatencyMode` options (Interactive, Batch, SustainedLowLatency, NoGCRegion). Choose based on workload, not GC flavor.

**Q: How does containerization affect GC choice?**

A: .NET respects container CPU/memory limits when sizing GC segments and threads. If you limit CPUs, Server GC creates fewer worker threads accordingly.

**Q: How do you monitor GC mode effectiveness?**

A: Track `% Time in GC`, Gen2 counts, and LOH size via `dotnet-counters` or App Insights. Compare metrics when toggling between modes to justify the configuration.

**Q: Can you mix modes within the same process?**

A: No. GC mode is a process-wide setting configured at startup. You can’t run Server GC for some components and Workstation GC for others.

**Q: How do pinned objects behave under each mode?**

A: Pinning affects compaction regardless of GC mode. However, Server GC’s larger segments mean fragmentation can be more noticeable if you pin frequently.

**Q: Does background GC behave differently between modes?**

A: Server GC runs background Gen2 collections in parallel. Workstation GC also supports background GC but with fewer worker threads, so concurrency benefits are smaller.

**Q: What’s your quick pitch comparing the two?**

A: “Server GC maximizes throughput on multi-core servers via parallel collections; Workstation GC prioritizes responsiveness with shorter pauses. Choose based on workload and validate with GC metrics.”
