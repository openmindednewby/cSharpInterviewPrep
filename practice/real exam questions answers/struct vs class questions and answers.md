Excellent — here are **5 advanced, senior-level interview questions** on **`struct` vs `class`**, tuned specifically for **HFM’s kind of backend, high-performance, low-latency systems**.

Each includes:

* ✅ The **question**
* 💡 The **expected senior-level reasoning**
* ⚙️ A **bonus example or gotcha** you can mention to stand out

---

## 🧩 1. What happens when you pass a `struct` to a method — and how can you avoid performance issues?

### ✅ Expected answer:

By default, structs are **passed by value**, meaning a **copy** of all their fields is made.
If the struct is large, this creates **CPU overhead** from copying.

To avoid this, pass by **reference** using `in`, `ref`, or `out`.

```csharp
readonly struct Tick
{
    public string Symbol { get; }
    public double Bid { get; }
    public double Ask { get; }
}

void Process(in Tick tick)
{
    Console.WriteLine(tick.Symbol);
}
```

* `in` → pass by ref, but readonly (no copy, safe from mutation).
* `ref` → pass by ref, can mutate.
* `out` → pass by ref, must assign inside method.

💡 **Mention:**

> “In high-throughput systems, like a tick feed handler, we pass large structs `in` by reference to eliminate per-call copy cost.”

---

## 🧩 2. Why can boxing destroy the performance benefits of structs?

### ✅ Expected answer:

Boxing occurs when a value type (struct) is **converted to an `object` or interface type**.
The runtime must **allocate a new object on the heap** and **copy the struct** into it → triggering GC pressure.

```csharp
struct Point { public int X, Y; }

object o = new Point();  // boxing (heap allocation)
```

Unboxing (`(Point)o`) copies it back — so you get **two allocations + copies**.

💡 **Mention:**

> “Boxing kills the zero-allocation goal. In financial tick pipelines, I’d avoid it by using generics or struct-constrained interfaces like `ISpanFormattable`.”

---

## 🧩 3. What happens when you mutate a struct that’s stored in a collection like a `List<T>`?

### ✅ Expected answer:

When you access a struct in a collection, you get a **copy** — not the original instance.
So mutating it **does not change the element inside the collection**.

```csharp
var list = new List<Point> { new Point { X = 1, Y = 1 } };
list[0].X = 99; // modifies the copy, not the original!
Console.WriteLine(list[0].X); // prints 1, not 99
```

To modify it properly, reassign:

```csharp
var p = list[0];
p.X = 99;
list[0] = p;
```

💡 **Mention:**

> “This behavior can create hidden bugs when structs are used in collections. I use `readonly struct` where possible, to make them immutable and avoid accidental mutations.”

---

## 🧩 4. Why is a `readonly struct` important in high-performance code?

### ✅ Expected answer:

A `readonly struct` guarantees **no field will change** after construction.
This allows:

* Safer by-ref passing (`in`).
* The JIT to optimize away defensive copies.
* Reduced bugs in concurrent code.

```csharp
readonly struct Price
{
    public double Bid { get; }
    public double Ask { get; }
    public Price(double bid, double ask) { Bid = bid; Ask = ask; }
}
```

💡 **Mention:**

> “Readonly structs are crucial for passing by `in` reference in tight loops without the JIT inserting hidden defensive copies — essential in trading data parsing or serialization code.”

---

## 🧩 5. How does struct size affect performance and GC behavior?

### ✅ Expected answer:

* **Small structs (≤ 16–32 bytes)** → fast to copy, GC-friendly.
* **Large structs (> 64 bytes)** → expensive to copy by value, slower to pass around.
* Structs don’t hit GC directly, but large structs stored inside heap objects (like arrays/lists) **increase heap size**.

💡 **Rule of thumb:**
Use structs for **tiny, immutable data packets** (ticks, coordinates, color, timestamps).
Use classes for **entities with identity, behavior, or shared references**.

**Example (HFM context):**

```csharp
readonly struct Tick
{
    public string Symbol { get; init; }
    public double Bid { get; init; }
    public double Ask { get; init; }
}
class TickStreamProcessor { /* class that manages state */ }
```

💡 **Mention:**

> “At HFM scale — where millions of ticks flow per second — keeping structs small and readonly helps stay in Gen0 and reduces GC load. If a struct becomes too big, I switch to a reference type.”

---

## 🎯 Bonus (for “wow” points)

If the interviewer presses for memory-level behavior:

> “Structs are laid out *inline*, which improves **locality of reference** — CPU caches love that.
> Classes live on the heap and require pointer indirection. That’s why structs are great for sequential data like price ticks or order books.”

---

## ✅ Quick Summary Answer (say this in 20 seconds)

> “Structs are **value types** — stored inline, copied by value, and ideal for **small, immutable data** where GC avoidance and memory locality matter.
> Classes are **reference types**, heap-allocated, reference-based, and better for shared mutable state or inheritance.
> Boxing, large struct copies, and accidental mutation in collections are common pitfalls.
> I use `readonly struct` with `in` parameters to write high-performance, zero-GC code — perfect for financial tick processing.”

---

Would you like me to now give you **a visual memory diagram** comparing how structs and classes behave in memory (stack vs heap, copying, reference sharing)?
It’s great for visual learners and helps you explain your answer confidently if they give you a whiteboard.
