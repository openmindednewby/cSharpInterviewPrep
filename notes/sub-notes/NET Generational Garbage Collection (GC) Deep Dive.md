# 🧠 .NET Generational Garbage Collection (GC) Deep Dive

---

## 1️⃣ The “why”: Why generational GC exists

In most real-world programs:

* Most objects are **short-lived** (local variables, temporary data, buffers, LINQ results).
* Some objects are **long-lived** (caches, connection pools, singletons, static config).

This is known as the **generational hypothesis**:

> “Most objects die young.”

So instead of scanning the entire heap every time, .NET uses a **generational GC** — it **divides the heap into generations** and **collects the youngest first**, because they’re most likely garbage.

That gives you **massive efficiency** and predictable pause times.

---

## 2️⃣ The three main generations

| Generation | Description                        | Frequency                      | Typical objects                      |
| ---------- | ---------------------------------- | ------------------------------ | ------------------------------------ |
| **Gen 0**  | Newest, youngest objects           | Collected **most frequently**  | Locals, temp lists, short-lived data |
| **Gen 1**  | “Middle-aged” survivors from Gen 0 | Collected occasionally         | Transient mid-term data              |
| **Gen 2**  | Long-lived survivors               | Collected **rarely** (full GC) | Caches, singletons, static data      |
| **LOH**    | Large Object Heap (≥ 85,000 bytes) | Collected **with Gen 2**       | Large arrays, strings, buffers       |

---

## 3️⃣ Visual mental model

```
Gen0 ──► Gen1 ──► Gen2 ──► LOH
 short   medium   long     very large (>85KB)
 lived   lived    lived    objects (arrays, strings)
```

Each arrow means *“survive one more collection → promoted”*.

---

## 4️⃣ How it works step by step

### 🧩 Allocation

When you create a new object:

```csharp
var o = new object();
```

* Memory is allocated in **Gen 0** segment (on the heap).
* .NET uses a **bump pointer** allocator — incredibly fast (just moves a pointer).

---

### 🧩 Gen 0 Collection

When Gen 0 is full:

* GC pauses threads (short pause, typically sub-millisecond).
* It scans Gen 0 roots (stack references, static fields, registers).
* **Live objects survive → promoted to Gen 1**.
* **Dead objects → reclaimed**.

```text
Before:
Gen0: [A, B, C]
After GC0:
  A dead, B/C alive → B,C moved to Gen1
```

---

### 🧩 Gen 1 Collection

When Gen 1 fills:

* GC collects Gen 0 + Gen 1.
* Survivors move to **Gen 2**.

---

### 🧩 Gen 2 Collection (Full GC)

When Gen 2 fills (or memory pressure triggers it):

* GC collects all generations.
* This is the **most expensive collection** (may take tens or hundreds of ms).

---

### 🧩 LOH (Large Object Heap)

Objects **≥ 85,000 bytes** (like large arrays, bitmaps, or JSON buffers):

* Allocated directly into the **LOH**.
* Not compacted by default (can fragment memory).
* Collected **only with Gen 2** — so expensive.

💡 **Tip:**
Avoid frequent large allocations. Reuse buffers via `ArrayPool<T>.Shared` to keep the LOH stable.

---

## 5️⃣ Compacting vs Non-Compacting

* **SOH (Small Object Heap)** — compacts after GC (moves survivors to eliminate gaps).
  ➜ Keeps memory tight, improves cache performance.
* **LOH (Large Object Heap)** — **does not compact by default**, to avoid moving huge memory blocks.
  ➜ Can fragment over time.

Optional:
You can compact LOH manually (rarely needed):

```csharp
GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce;
GC.Collect(GC.MaxGeneration, GCCollectionMode.Forced);
```

---

## 6️⃣ What triggers a GC?

The CLR decides to collect when:

1. **Gen 0 segment fills up** (most common).
2. **Gen 1/2 segment fills up** (promotion pressure).
3. **System memory pressure** (OS signal).
4. You explicitly call `GC.Collect()` (almost never do this).

💡 Pro tip:
Avoid manual `GC.Collect()` — it often *hurts* performance because it interrupts the GC’s adaptive tuning.

---

## 7️⃣ GC stats and diagnostics

You can observe GC behavior in real-time:

```bash
dotnet-counters monitor System.Runtime
```

You’ll see counters like:

```
Gen 0 GC Count: 345
Gen 1 GC Count: 12
Gen 2 GC Count: 1
% Time in GC: 0.25
Allocated Bytes/sec: 1,024,000
```

✅ Healthy app:

* Many Gen 0s
* Occasional Gen 1s
* Rare Gen 2s
* Low “% Time in GC”

---

## 8️⃣ Performance design tips for GC-friendly code

| Goal                             | Best Practice                                               |
| -------------------------------- | ----------------------------------------------------------- |
| Minimize Gen 0 churn             | Avoid allocating in tight loops or hot paths                |
| Prevent Gen 2 pressure           | Reuse objects and buffers (`ArrayPool<T>`, `ObjectPool<T>`) |
| Avoid LOH fragmentation          | Use pooled or chunked buffers                               |
| Keep structs small and immutable | No unnecessary copying or boxing                            |
| Monitor allocations              | Use `dotnet-trace` or `dotMemory` to find hotspots          |

---

## 9️⃣ Trading-system example (HFM context)

In a **price feed processor** that handles thousands of ticks per second:

❌ **Bad design:**

```csharp
foreach (var msg in messages)
{
    var parts = msg.Split(','); // allocates string[] and substrings each iteration
    var tick = new Tick { Symbol = parts[0], Bid = double.Parse(parts[1]) };
}
```

* Massive Gen 0 churn
* Frequent Gen 1/2 GCs under load

✅ **Good design:**

```csharp
var buffer = ArrayPool<byte>.Shared.Rent(4096);
ReadOnlySpan<byte> span = buffer.AsSpan(0, length);
ParseSpan(span); // no allocations
ArrayPool<byte>.Shared.Return(buffer);
```

* Almost no heap allocations
* GC barely runs
* Stable latency (critical for trading)

---

## 10️⃣ TL;DR — How to summarize it in your interview

> “.NET uses a **generational GC** because most objects die young.
> New objects go into **Gen 0**, survivors are promoted to **Gen 1**, then **Gen 2**.
> The **Large Object Heap (LOH)** stores objects above ~85 KB and is only collected with Gen 2.
>
> The key to performance is keeping allocations short-lived so they die in Gen 0, reusing large buffers to avoid LOH fragmentation, and preventing unnecessary promotions that trigger full GCs.”

---

Would you like me to show you a **diagram of the generational heap** — with arrows showing object lifecycles (Gen0→Gen1→Gen2→LOH) and what happens during collections?
It’s one of the best ways to visualize promotions and GC compaction.
