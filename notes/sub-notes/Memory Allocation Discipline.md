# 🧠 Allocation Discipline in .NET — Deep Dive

---

## 1️⃣ What it means

**Allocation discipline** means designing your code so that you:

* Allocate **only when necessary**
* **Reuse** what you already allocated
* **Minimize copying** of data
* Keep **object lifetimes short** (so they die in Gen 0)
* Prevent **accidental heap allocations** in tight loops or latency-sensitive paths

Basically:

> “Don’t let your code throw objects at the GC faster than it can clean them up.”

---

## 2️⃣ Why it matters

Allocations aren’t “free.” Each heap allocation:

* Consumes CPU (for pointer bumping)
* Increases memory footprint
* Puts pressure on Gen 0 → more GC cycles
  (eventually promotions → Gen 2 → **long pauses**)

In **low-latency systems** (like trade execution or tick feeds), GC pauses = missed ticks or delayed quotes — unacceptable.

So the best GC strategy is often:

> “Don’t make the GC do work at all.”

---

## 3️⃣ Common allocation traps (and how to fix them)

| Bad Practice                           | Why it’s bad                    | Fix                                      |
| -------------------------------------- | ------------------------------- | ---------------------------------------- |
| Using `new` objects inside tight loops | Floods Gen 0                    | Reuse pooled objects                     |
| `string.Concat` or `+` in loops        | Creates new string every time   | Use `StringBuilder` or spans             |
| LINQ in hot paths                      | Allocates enumerators, closures | Use `for` loops                          |
| Boxing value types                     | Allocates on heap               | Use generics / avoid casting to `object` |
| Repeatedly allocating buffers          | LOH churn                       | Use `ArrayPool<T>`                       |
| Returning large arrays                 | LOH growth                      | Reuse pooled arrays or slice spans       |

---

## 4️⃣ Reuse patterns that eliminate GC churn

### ✅ **Object pooling**

.NET has built-in pools for common cases:

```csharp
using Microsoft.Extensions.ObjectPool;

var pool = ObjectPool.Create<MyReusableObject>();
var item = pool.Get();
// use item...
pool.Return(item);
```

💡 Great for: serializers, parsers, `StringBuilder`s, temp containers.

**Example:**

```csharp
var sb = StringBuilderCache.Acquire();
// build a string
var result = StringBuilderCache.GetStringAndRelease(sb);
```

→ zero allocations between calls.

---

### ✅ **Buffer pooling**

The `ArrayPool<T>` API lets you rent and return arrays instead of allocating new ones.

```csharp
var pool = ArrayPool<byte>.Shared;
byte[] buffer = pool.Rent(1024);
// use it
pool.Return(buffer);
```

💡 Use this for:

* I/O buffers
* Network streams
* Deserialization
* Message batching

🚀 Benefit: Avoids **Large Object Heap churn** (LOH fragmentation) and constant GC pressure.

---

### ✅ **String interning or caching**

Instead of creating new string instances for common identifiers (e.g., “EURUSD”):

```csharp
string symbol = string.Intern("EURUSD");
```

Or better — store common symbols in a static `Dictionary<string, string>` and reuse the reference.

---

### ✅ **Structs and value types**

For small, immutable data (ticks, coordinates, etc.), use **structs**:

* Stored inline → no GC tracking
* Can live and die on the stack
* No heap allocations for short-lived data

```csharp
readonly struct Tick
{
    public string Symbol { get; }
    public double Bid { get; }
    public double Ask { get; }
}
```

But ⚠️ keep them **small** (≤ 16–32 bytes). Large structs hurt performance due to copy costs.

---

### ✅ **Using `Span<T>` / `Memory<T>` for zero-copy**

`Span<T>` and `Memory<T>` let you **operate directly on existing memory** — without allocating new arrays or substrings.

Example: parsing a price line

```csharp
ReadOnlySpan<byte> span = Encoding.ASCII.GetBytes("EURUSD,1.0743,1.0745");

int comma = span.IndexOf((byte)',');
var symbol = Encoding.ASCII.GetString(span[..comma]); // one allocation

Utf8Parser.TryParse(span[(comma + 1)..], out double bid, out _);
```

No string splitting, no array allocations, no GC.

💡 **Rule:**
Use `Span<T>` for synchronous parsing; `Memory<T>` when data crosses async boundaries.

---

## 5️⃣ Avoiding hidden allocations

Even code that *looks innocent* can allocate. Some hidden examples:

| Code                                     | Hidden allocation                       |
| ---------------------------------------- | --------------------------------------- |
| `foreach (var x in list)`                | Enumerator struct may box               |
| `async` methods                          | Allocates a state machine object        |
| `lambda` or `delegate` captures variable | Allocates closure object                |
| `ToString()`                             | Often allocates new string              |
| `Task.FromResult(...)`                   | Reuses task, good ✅                     |
| `await` on `Task` that already completed | Allocates continuation unless optimized |

💡 Use tools like:

```bash
dotnet-trace collect --process-id <pid>
dotnet-counters monitor System.Runtime
```

to watch **Allocated Bytes/sec**.

---

## 6️⃣ Temporal allocation awareness (lifetime patterns)

The key to designing allocation-efficient systems is understanding **lifetime scopes**:

| Lifetime          | Strategy                                                         |
| ----------------- | ---------------------------------------------------------------- |
| **Per-request**   | Avoid allocations in controllers; reuse service-scoped resources |
| **Per-session**   | Use dependency injection scopes for per-user data                |
| **Global/static** | Cache immutable data, don’t recreate                             |
| **Transient**     | Keep short-lived structs or pooled objects                       |

Example: in a market data service

* Buffer per connection (rented from pool)
* Parser per connection (reused object)
* Tick structs per message (stack-allocated)

No GC churn in steady state.

---

## 7️⃣ Measuring & validating allocation discipline

Use:

```bash
dotnet-counters monitor System.Runtime
```

Watch:

```
Allocated Bytes/sec
Gen 0 GC Count
% Time in GC
```

or use code:

```csharp
Console.WriteLine(GC.GetTotalAllocatedBytes(true));
```

✅ Healthy pattern:

* High throughput with low Allocated Bytes/sec
* Frequent Gen0, rare Gen1/2
* % Time in GC < 2–3%

---

## 8️⃣ Interview-ready example (say this at HFM)

> “Allocation discipline means being intentional about where and how you allocate.
> In latency-sensitive systems, even Gen0 collections matter. I use `ArrayPool<T>` and `ObjectPool<T>` to reuse memory, `Span<T>` for parsing binary and textual data, and avoid LINQ or string concatenation in tight loops.
> I measure Allocated Bytes/sec and Gen0 frequency in production to ensure the system stays allocation-stable.
> Our goal isn’t zero GC — it’s **predictable, bounded GC behavior**.”

---

## 9️⃣ Trading-system tie-in (concrete example)

**Without discipline:**

```csharp
foreach (var msg in feed)
{
    var parts = msg.Split(',');
    var tick = new Tick(parts[0], double.Parse(parts[1]), double.Parse(parts[2]));
    Publish(tick);
}
```

→ Creates new string arrays, substrings, doubles → Gen0/Gen1 churn.

**With discipline:**

```csharp
byte[] buffer = ArrayPool<byte>.Shared.Rent(1024);
ReadOnlySpan<byte> span = buffer.AsSpan(0, bytesRead);
ParseTick(span);
ArrayPool<byte>.Shared.Return(buffer);
```

→ Zero heap allocations, predictable performance, stable GC profile.

---

## 10️⃣ TL;DR Summary (say this confidently)

> “Allocation discipline is about **controlling your memory behavior**.
> I design code to **minimize heap allocations**, **reuse buffers**, and **operate directly on memory** using `Span<T>` and `ArrayPool<T>`.
> That keeps the GC quiet, prevents Gen2 promotions, and delivers low-latency performance.
> In production, I watch GC metrics and tune allocation-heavy paths continuously.”

---

Would you like me to show you **a before-and-after microbenchmark** example using `BenchmarkDotNet`, comparing naive allocation-heavy code vs pooled + span-based parsing?
It’s an awesome way to explain “I don’t just know it — I’ve measured it.”
