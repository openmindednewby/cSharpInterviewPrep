## ⚡ GOAL

Parse and process a stream of **price tick data** efficiently,
**without allocating**, **without creating new strings**, and **with GC-friendly design**.

---

## 🧩 1. The scenario

You receive a TCP stream of bytes like this:

```
EURUSD,1.07432,1.07436
GBPUSD,1.24587,1.24592
```

You need to:

1. Parse each line into fields (symbol, bid, ask)
2. Convert to typed data (`struct Tick`)
3. Reuse buffers instead of new allocations
4. Avoid string allocations except for the final symbol if needed

---

## 💻 2. The C# code

```csharp
using System;
using System.Buffers;
using System.Buffers.Text;
using System.Text;

struct Tick
{
    public string Symbol { get; init; }
    public double Bid { get; init; }
    public double Ask { get; init; }
}

class TickParser
{
    private readonly ArrayPool<byte> _pool = ArrayPool<byte>.Shared;

    public Tick Parse(ReadOnlySpan<byte> line)
    {
        // EURUSD,1.07432,1.07436
        int firstComma = line.IndexOf((byte)',');
        int secondComma = line.Slice(firstComma + 1).IndexOf((byte)',') + firstComma + 1;

        // symbol bytes -> string (only one allocation)
        string symbol = Encoding.ASCII.GetString(line[..firstComma]);

        // Parse Bid
        Utf8Parser.TryParse(line[(firstComma + 1)..secondComma], out double bid, out _);

        // Parse Ask
        Utf8Parser.TryParse(line[(secondComma + 1)..], out double ask, out _);

        return new Tick { Symbol = symbol, Bid = bid, Ask = ask };
    }

    public void ProcessBatch(byte[] data)
    {
        var span = new ReadOnlySpan<byte>(data);
        while (true)
        {
            int newline = span.IndexOf((byte)'\n');
            if (newline == -1) break;
            var line = span[..newline];
            var tick = Parse(line);
            // Do something: e.g., publish to queue
            Console.WriteLine($"{tick.Symbol}: {tick.Bid} / {tick.Ask}");
            span = span[(newline + 1)..];
        }
    }

    public void Run()
    {
        byte[] buffer = _pool.Rent(1024);
        try
        {
            string sample = "EURUSD,1.07432,1.07436\nGBPUSD,1.24587,1.24592\n";
            int bytes = Encoding.ASCII.GetBytes(sample, buffer);
            ProcessBatch(buffer.AsSpan(0, bytes).ToArray());
        }
        finally
        {
            _pool.Return(buffer);
        }
    }
}

class Program
{
    static void Main()
    {
        var parser = new TickParser();
        parser.Run();
    }
}
```

---

## 🧠 3. What to highlight in the interview

**Memory-efficient design:**

* Uses **`ReadOnlySpan<byte>`** to slice input lines → no string splits or temporary arrays.
* **`Utf8Parser`** parses directly from bytes into doubles → no string allocations.
* **`ArrayPool<byte>`** reuses buffers → avoids per-message allocation pressure on Gen0.
* Only **one small string allocation per line** (`Symbol`), which could also be interned or replaced by a dictionary of symbols in a real system.

**GC impact:**

* Minimal Gen0 churn; no Gen1/Gen2 or LOH allocations.
* Perfect candidate for **low-latency message processing** (market data, trade events).
* If you wrap this in an async TCP stream, you’d use **`Memory<byte>`** instead of `Span<byte>` to cross `await` boundaries safely.

**Potential improvements to mention:**

* Pool parsed `Tick` objects if needed (e.g., `ObjectPool<Tick>` or reuse structs).
* Replace symbol string allocation with a symbol lookup table.
* Integrate with **System.IO.Pipelines** for streaming input.

---

## 🔍 4. Practice questions you can expect

* *“Why is `Span<T>` faster than using `Split` or `string.Substring()`?”*
  → Because it slices existing memory without allocating.

* *“Why use `ArrayPool<byte>` instead of `new byte[]`?”*
  → It reuses buffers, drastically reducing GC pressure in high-throughput systems.

* *“Can you use `Span<T>` inside an async method?”*
  → No, because `Span<T>` is stack-only. Use `Memory<T>` instead.

* *“What generation would this data typically live in?”*
  → These short-lived spans die in **Gen0**, never get promoted — ideal for throughput.

* *“What happens if we allocate a 100 KB buffer?”*
  → It goes on the **Large Object Heap (LOH)**, which isn’t compacted by default and can fragment memory.

---

## 🧩 5. Optional 5-min extension: Counter check

If you have .NET SDK, run:

```bash
dotnet-counters monitor System.Runtime
```

Then run your parser.
Watch:

* `Gen0 GC Count` barely increases
* `Gen2 GC Count` stays at 0
* `Allocated Bytes/sec` minimal

That’s your **evidence** you’ve optimized allocations correctly.

---

Would you like me to follow up with a **bonus version using `System.IO.Pipelines`** — the way you’d implement this in a real HFM-style backend (async, streaming, zero-copy)?
That’s often a **senior-level differentiator question**.

---

## Questions & Answers

**Q: How does this parser minimize allocations?**

A: It uses `ReadOnlySpan<byte>` to slice the input buffer, `Utf8Parser` to parse primitives directly from bytes, and `ArrayPool<byte>` to reuse buffers, leaving only one small string allocation per tick.

**Q: Why is `Utf8Parser` preferred here?**

A: It avoids converting byte segments into strings before parsing numbers, eliminating temporary allocations and respecting culture-invariant formats ideal for market data.

**Q: How do you process partial messages with this approach?**

A: Maintain leftover spans between reads or use `System.IO.Pipelines`, which handles split frames by giving you `ReadOnlySequence<byte>` to process once a newline delimiter appears.

**Q: How would you adapt this for asynchronous sockets?**

A: Swap buffer handling for `PipeReader`/`PipeWriter`, consume `ReadOnlySequence<byte>` segments, and use `Memory<byte>` to cross `await` boundaries safely while keeping parsing logic identical.

**Q: What GC metrics confirm success?**

A: `Gen0 GC Count` stays low relative to throughput, `Gen2 GC Count` remains near zero, and `Allocated Bytes/sec` is minimal. Use `dotnet-counters` to observe these while the parser runs.

**Q: How do you reuse symbol strings to avoid per-message allocations?**

A: Maintain a dictionary of interned symbols or use `ReadOnlyMemory<byte>` pointing to shared symbol tables, so repeated symbols reuse references instead of allocating new strings.

**Q: What happens if you allocate 100 KB buffers per message?**

A: They land on the LOH, leading to fragmentation and long Gen2 pauses. Renting from `ArrayPool<byte>` avoids repeated LOH allocations.

**Q: How do you handle parsing failures?**

A: Check the boolean return from `Utf8Parser.TryParse` and decide whether to drop/log the tick or route it to a poison queue. Avoid throwing in the hot path to keep allocation-free behavior.

**Q: Can you pool `Tick` instances too?**

A: Yes—use `ObjectPool<Tick>` or a struct pool if you need to reuse containers. Ensure pooled objects are reset before reuse to avoid leaking data.

**Q: How would you extend this to publish to RabbitMQ/Kafka?**

A: Serialize ticks using `IBufferWriter<byte>` or spans to keep serialization allocation-free, then push to the broker client that supports span-friendly APIs.
