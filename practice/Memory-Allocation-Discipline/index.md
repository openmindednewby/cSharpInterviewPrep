# Memory Allocation Discipline - Practice Exercises

Exercises covering allocation behavior, GC tuning, and zero-allocation patterns. Content migrated from `performance-memory.md` with additional practice items.

## Stack vs Heap Memory Allocation

### Exercise 1: Stack vs Heap Allocation
**Question:** Analyze the following code and identify what gets allocated on the stack vs heap. Explain why.

```csharp
public class MemoryAllocationDemo
{
    public void DemonstrateAllocation()
    {
        int x = 10;                           // Where?
        string name = "John";                 // Where?
        Person person = new Person();         // Where?
        int[] numbers = new int[5];           // Where?
        DateTime date = DateTime.Now;         // Where?
    }
}

public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
}
```

<details>
<summary>Answer</summary>

**Stack allocations:**
- `int x = 10` - value type, allocated on stack
- `Person person` - reference itself on stack
- `int[] numbers` - reference itself on stack
- `DateTime date` - struct (value type), allocated on stack

**Heap allocations:**
- `string name = "John"` - reference on stack, actual string object on heap
- `new Person()` - object allocated on heap
- `new int[5]` - array allocated on heap

**Why:**
- Value types (int, DateTime, structs) are allocated on stack when they're local variables
- Reference types (classes, arrays, strings) are allocated on heap
- References to heap objects are stored on stack
- This applies to local variables; class fields follow different rules
</details>

---

### Exercise 2: Boxing and Unboxing Performance
**Question:** Identify boxing operations in this code and rewrite to avoid them.

```csharp
public class BoxingDemo
{
    public void ProcessNumbers()
    {
        ArrayList list = new ArrayList();

        for (int i = 0; i < 1000; i++)
        {
            list.Add(i);  // Boxing occurs
        }

        int sum = 0;
        foreach (object obj in list)
        {
            sum += (int)obj;  // Unboxing occurs
        }
    }
}
```

<details>
<summary>Answer</summary>

**Problem:** Each `Add` boxes the int, each cast unboxes it. For 1000 iterations, this creates 1000 heap allocations.

**Solution:**

```csharp
public class OptimizedDemo
{
    public void ProcessNumbers()
    {
        List<int> list = new List<int>();

        for (int i = 0; i < 1000; i++)
        {
            list.Add(i);  // No boxing
        }

        int sum = 0;
        foreach (int num in list)
        {
            sum += num;  // No unboxing
        }
    }
}
```

**Performance impact:**
- Original: ~1000 heap allocations, GC pressure
- Optimized: Single heap allocation for List<int>, no boxing/unboxing
- Use generic collections to avoid boxing value types
</details>

---

## Garbage Collection

### Exercise 3: Understanding GC Generations
**Question:** Write code to demonstrate which generation objects are in after various GC cycles.

<details>
<summary>Answer</summary>

```csharp
public class GCGenerationDemo
{
    public static void DemonstrateGenerations()
    {
        // Create short-lived object
        object shortLived = new object();
        Console.WriteLine($"Short-lived Gen: {GC.GetGeneration(shortLived)}"); // Gen 0

        // Create long-lived object
        object longLived = new object();

        // Force GC collections
        GC.Collect(0);  // Gen 0 collection
        Console.WriteLine($"After Gen 0 GC - Long-lived: {GC.GetGeneration(longLived)}"); // Gen 1

        GC.Collect(1);  // Gen 0 and 1 collection
        Console.WriteLine($"After Gen 1 GC - Long-lived: {GC.GetGeneration(longLived)}"); // Gen 2

        // Display GC info
        Console.WriteLine($"Gen 0 collections: {GC.CollectionCount(0)}");
        Console.WriteLine($"Gen 1 collections: {GC.CollectionCount(1)}");
        Console.WriteLine($"Gen 2 collections: {GC.CollectionCount(2)}");

        // Prevent GC during measurement
        GC.KeepAlive(longLived);
    }
}
```

**Key points:**
- Gen 0: Short-lived objects, collected frequently
- Gen 1: Medium-lived objects, buffer between Gen 0 and 2
- Gen 2: Long-lived objects, collected infrequently
- Gen 2 collections are expensive (full GC)
</details>

---

### Exercise 4: GC Modes - Workstation vs Server
**Question:** Explain the difference between Workstation and Server GC modes. When would you use each?

<details>
<summary>Answer</summary>

**Workstation GC:**
```xml
<!-- App.config or csproj -->
<configuration>
  <runtime>
    <gcServer enabled="false"/>
    <gcConcurrent enabled="true"/>
  </runtime>
</configuration>
```

```csharp
// Or in code (read-only, for info)
bool isServerGC = GCSettings.IsServerGC;
```

**Server GC:**
```xml
<configuration>
  <runtime>
    <gcServer enabled="true"/>
  </runtime>
</configuration>
```

**Differences:**

| Feature | Workstation GC | Server GC |
|---------|---------------|-----------|
| Heap count | 1 heap | 1 heap per logical CPU |
| Thread count | 1 GC thread | 1 thread per heap |
| Throughput | Lower | Higher |
| Latency | Lower pauses | Longer pauses |
| Memory usage | Lower | Higher |
| Best for | Client apps, UI | Web servers, services |

**When to use:**
- Workstation: Desktop apps, lower latency requirements
- Server: ASP.NET, high-throughput services
- Can also use concurrent GC for background collection
</details>

---

### Exercise 5: Large Object Heap (LOH)
**Question:** Write code demonstrating LOH behavior and how to avoid LOH fragmentation.

<details>
<summary>Answer</summary>

```csharp
public class LOHDemo
{
    // Objects >= 85,000 bytes go to LOH
    private const int LOH_THRESHOLD = 85000;

    public static void DemonstrateLOH()
    {
        // This goes to LOH
        byte[] largeArray = new byte[100000];
        Console.WriteLine($"Large array generation: {GC.GetGeneration(largeArray)}"); // Gen 2

        // This stays in normal heap
        byte[] smallArray = new byte[1000];
        Console.WriteLine($"Small array generation: {GC.GetGeneration(smallArray)}"); // Gen 0
    }

    // Problem: LOH fragmentation
    public static void CauseFragmentation()
    {
        List<byte[]> arrays = new List<byte[]>();

        for (int i = 0; i < 100; i++)
        {
            arrays.Add(new byte[90000]); // LOH allocation
        }

        // Release every other array - causes fragmentation
        for (int i = 0; i < arrays.Count; i += 2)
        {
            arrays[i] = null;
        }

        GC.Collect();
        // LOH is now fragmented
    }

    // Solution 1: Use ArrayPool for large arrays
    public static void UseArrayPool()
    {
        var pool = ArrayPool<byte>.Shared;

        byte[] buffer = pool.Rent(100000);
        try
        {
            // Use buffer
        }
        finally
        {
            pool.Return(buffer);
        }
    }

    // Solution 2: Compact LOH (NET Core 2.0+)
    public static void CompactLOH()
    {
        GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce;
        GC.Collect();
    }

    // Solution 3: Split large allocations
    public static void SplitAllocations()
    {
        // Instead of one 1MB array
        // byte[] huge = new byte[1000000];

        // Use multiple smaller arrays
        byte[][] chunks = new byte[12][];
        for (int i = 0; i < 12; i++)
        {
            chunks[i] = new byte[84000]; // Just under LOH threshold
        }
    }
}
```

---

## Practice Prompts (Q and A)

**Q: When should you use `ArrayPool<T>`?**

A: Use it for large or frequent temporary buffers to reduce GC pressure. Always return buffers in a `finally` block.

```csharp
var pool = ArrayPool<byte>.Shared;
byte[] buffer = pool.Rent(4096);
try
{
    // Use buffer
}
finally
{
    pool.Return(buffer);
}
```

**Q: Show how `Span<T>` can avoid allocations when parsing.**

A: Slice strings with spans to reduce intermediate allocations.

```csharp
ReadOnlySpan<char> line = input.AsSpan();
var first = line.Slice(0, 3);
```

**Q: When would you use `ValueTask` instead of `Task`?**

A: Use `ValueTask` for hot paths that often complete synchronously to avoid allocations.

**Q: Why is string concatenation in a loop expensive, and how do you fix it?**

A: Strings are immutable, so concatenation allocates new strings. Use `StringBuilder`.

```csharp
var sb = new StringBuilder();
foreach (var part in parts)
{
    sb.Append(part);
}
var result = sb.ToString();
```

**Q: How do closures create hidden allocations?**

A: Lambdas capture outer variables into heap-allocated objects. Avoid captures in hot paths or use static lambdas.

```csharp
// Avoid capture
var count = items.Count(static i => i.IsActive);
```

**Key points:**
- Objects >= 85KB go to LOH
- LOH is part of Gen 2
- LOH doesn't get compacted by default (can cause fragmentation)
- Use ArrayPool or compact LOH manually
</details>

---

## Span<T> and Memory<T>

### Exercise 6: Span<T> Basics
**Question:** Rewrite this string parsing method to use Span<T> and avoid allocations.

```csharp
public class StringParser
{
    public (string firstName, string lastName) ParseName(string fullName)
    {
        string[] parts = fullName.Split(' ');
        return (parts[0], parts[1]);
    }
}
```

<details>
<summary>Answer</summary>

```csharp
public class OptimizedStringParser
{
    public (ReadOnlySpan<char> firstName, ReadOnlySpan<char> lastName) ParseName(string fullName)
    {
        ReadOnlySpan<char> span = fullName.AsSpan();
        int spaceIndex = span.IndexOf(' ');

        if (spaceIndex == -1)
            return (span, ReadOnlySpan<char>.Empty);

        return (span.Slice(0, spaceIndex), span.Slice(spaceIndex + 1));
    }

    // If you need strings, create them only when necessary
    public (string firstName, string lastName) ParseNameToString(string fullName)
    {
        ReadOnlySpan<char> span = fullName.AsSpan();
        int spaceIndex = span.IndexOf(' ');

        if (spaceIndex == -1)
            return (fullName, string.Empty);

        return (
            span.Slice(0, spaceIndex).ToString(),
            span.Slice(spaceIndex + 1).ToString()
        );
    }
}
```

**Performance benefits:**
- Original: Creates array, allocates string array
- Optimized: Zero allocations until ToString() is called
- Span<T> is a ref struct (stack-only)
</details>

---

### Exercise 7: Memory<T> vs Span<T>
**Question:** Explain when to use Memory<T> vs Span<T>. Provide examples.

<details>
<summary>Answer</summary>

```csharp
public class SpanVsMemoryDemo
{
    // Span<T> - Cannot be stored in fields, stack-only
    public void UseSpan()
    {
        Span<int> numbers = stackalloc int[100];
        ProcessSpan(numbers);
    }

    public void ProcessSpan(Span<int> data)
    {
        for (int i = 0; i < data.Length; i++)
        {
            data[i] = i;
        }
    }

    // Memory<T> - Can be stored in fields, used in async
    private Memory<byte> _buffer;

    public async Task UseMemoryAsync()
    {
        _buffer = new byte[1024];
        await ProcessMemoryAsync(_buffer);
    }

    public async Task ProcessMemoryAsync(Memory<byte> data)
    {
        // Can use Memory<T> across await
        await Task.Delay(100);

        // Get Span when needed
        Span<byte> span = data.Span;
        span[0] = 42;
    }

    // Practical example: Buffer pooling
    public class BufferManager
    {
        private readonly Memory<byte> _buffer;

        public BufferManager(int size)
        {
            _buffer = new byte[size];
        }

        public async Task<int> ReadDataAsync(Stream stream)
        {
            // Can store Memory<T> in field
            // Get Span<T> when doing actual work
            return await stream.ReadAsync(_buffer);
        }
    }
}
```

**Key differences:**

| Feature | Span<T> | Memory<T> |
|---------|---------|-----------|
| Storage | ref struct, stack-only | Regular struct, can be stored |
| Async/await | Cannot cross await | Can cross await |
| Performance | Faster | Slightly slower |
| Use case | Synchronous code | Async code, fields |
| Allocation | Zero | Minimal |

</details>

---

### Exercise 8: Zero-Allocation String Parsing
**Question:** Implement a CSV parser that produces zero allocations using Span<T>.

<details>
<summary>Answer</summary>

```csharp
public class ZeroAllocCSVParser
{
    public void ParseCSVLine(ReadOnlySpan<char> line, Span<ReadOnlySpan<char>> output)
    {
        int fieldIndex = 0;
        int start = 0;

        for (int i = 0; i < line.Length; i++)
        {
            if (line[i] == ',')
            {
                output[fieldIndex++] = line.Slice(start, i - start);
                start = i + 1;
            }
        }

        // Last field
        if (start < line.Length)
        {
            output[fieldIndex] = line.Slice(start);
        }
    }

    public void Example()
    {
        string csv = "John,Doe,30,Engineer";
        Span<ReadOnlySpan<char>> fields = stackalloc ReadOnlySpan<char>[4];

        ParseCSVLine(csv, fields);

        // Process fields without allocation
        foreach (var field in fields)
        {
            // Do something with field
            Console.WriteLine(field.ToString()); // ToString only when needed
        }
    }

    // Advanced: Parse to strongly-typed data
    public ref struct Person
    {
        public ReadOnlySpan<char> FirstName;
        public ReadOnlySpan<char> LastName;
        public int Age;
        public ReadOnlySpan<char> Occupation;
    }

    public Person ParsePerson(ReadOnlySpan<char> line)
    {
        Span<ReadOnlySpan<char>> fields = stackalloc ReadOnlySpan<char>[4];
        ParseCSVLine(line, fields);

        return new Person
        {
            FirstName = fields[0],
            LastName = fields[1],
            Age = int.Parse(fields[2]),
            Occupation = fields[3]
        };
    }
}
```

**Benefits:**
- Zero string allocations during parsing
- Works directly with original string memory
- Only allocate when converting to permanent strings
</details>

---

## ValueTask vs Task

### Exercise 9: When to Use ValueTask
**Question:** Explain when to use ValueTask<T> vs Task<T>. Provide examples.

<details>
<summary>Answer</summary>

```csharp
public class ValueTaskDemo
{
    private Dictionary<string, string> _cache = new();

    // BAD: Task<T> when result is often cached
    public async Task<string> GetDataTask(string key)
    {
        if (_cache.TryGetValue(key, out var cached))
        {
            return cached; // Still allocates Task object!
        }

        var data = await FetchFromDatabaseAsync(key);
        _cache[key] = data;
        return data;
    }

    // GOOD: ValueTask<T> for synchronous path
    public async ValueTask<string> GetDataValueTask(string key)
    {
        if (_cache.TryGetValue(key, out var cached))
        {
            return cached; // No allocation!
        }

        var data = await FetchFromDatabaseAsync(key);
        _cache[key] = data;
        return data;
    }

    // Example with IValueTaskSource for pooling
    public class PooledValueTaskExample
    {
        private static readonly ObjectPool<CachedResult> _pool =
            ObjectPool.Create<CachedResult>();

        public ValueTask<int> GetCachedValueAsync(bool useCache)
        {
            if (useCache)
            {
                return new ValueTask<int>(42); // No allocation
            }

            var pooled = _pool.Get();
            return new ValueTask<int>(pooled, 0);
        }

        private class CachedResult : IValueTaskSource<int>
        {
            public int GetResult(short token) => 42;
            public ValueTaskSourceStatus GetStatus(short token) => ValueTaskSourceStatus.Succeeded;
            public void OnCompleted(Action<object> continuation, object state, short token, ValueTaskSourceOnCompletedFlags flags) { }
        }
    }

    private Task<string> FetchFromDatabaseAsync(string key)
    {
        return Task.FromResult($"Data for {key}");
    }
}
```

**Use ValueTask<T> when:**
- Result is often available synchronously (cache hits)
- High-frequency operations
- Want to avoid Task allocation

**Use Task<T> when:**
- Always asynchronous
- Need to await multiple times
- Need to use Task-specific APIs (WhenAll, etc.)

**Important rules:**
- Never await ValueTask twice
- Never await ValueTask after it completes
- Convert to Task if needed: `valueTask.AsTask()`

</details>

---

## Object Pooling

### Exercise 10: ArrayPool<T> Usage
**Question:** Implement a high-performance buffer manager using ArrayPool<T>.

<details>
<summary>Answer</summary>

```csharp
public class BufferManager
{
    private static readonly ArrayPool<byte> _pool = ArrayPool<byte>.Shared;

    // BAD: Allocates and GC collects
    public byte[] ProcessDataBad(int size)
    {
        byte[] buffer = new byte[size];
        // Process buffer
        return buffer; // Caller must manage
    }

    // GOOD: Uses pooling
    public void ProcessDataGood(int size)
    {
        byte[] buffer = _pool.Rent(size);
        try
        {
            // Process buffer
            // Note: Rent might return larger array
            int actualLength = Math.Min(size, buffer.Length);

            for (int i = 0; i < actualLength; i++)
            {
                buffer[i] = (byte)(i % 256);
            }
        }
        finally
        {
            // CRITICAL: Always return to pool
            _pool.Return(buffer, clearArray: true);
        }
    }

    // Advanced: Custom pool configuration
    public class CustomPoolExample
    {
        private static readonly ArrayPool<byte> _customPool =
            ArrayPool<byte>.Create(maxArrayLength: 1024 * 1024, maxArraysPerBucket: 50);

        public async Task ProcessStreamAsync(Stream stream)
        {
            byte[] buffer = _customPool.Rent(8192);
            try
            {
                int bytesRead;
                while ((bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length)) > 0)
                {
                    // Process buffer
                    ProcessChunk(buffer.AsSpan(0, bytesRead));
                }
            }
            finally
            {
                _customPool.Return(buffer);
            }
        }

        private void ProcessChunk(ReadOnlySpan<byte> data)
        {
            // Process data
        }
    }

    // Real-world example: HTTP response buffering
    public class HttpBufferManager
    {
        private static readonly ArrayPool<char> _charPool = ArrayPool<char>.Shared;

        public string BuildJsonResponse(int estimatedSize)
        {
            char[] buffer = _charPool.Rent(estimatedSize);
            try
            {
                int position = 0;

                // Build JSON without string concatenation
                AppendString(buffer, ref position, "{\"status\":\"success\",\"data\":");
                AppendString(buffer, ref position, "\"Hello World\"}");

                return new string(buffer, 0, position);
            }
            finally
            {
                _charPool.Return(buffer);
            }
        }

        private void AppendString(char[] buffer, ref int position, string value)
        {
            value.AsSpan().CopyTo(buffer.AsSpan(position));
            position += value.Length;
        }
    }
}
```

**Key points:**
- Always return arrays to pool in finally block
- Consider clearArray parameter for security
- Rented array might be larger than requested
- Use for temporary buffers, not long-lived data
</details>

---

### Exercise 11: ObjectPool<T> Pattern
**Question:** Implement a custom object pool for expensive objects.

<details>
<summary>Answer</summary>

```csharp
using Microsoft.Extensions.ObjectPool;

public class ObjectPoolDemo
{
    // Using built-in ObjectPool
    public class ExpensiveObject
    {
        public byte[] Buffer { get; set; }
        public StringBuilder Builder { get; set; }

        public ExpensiveObject()
        {
            Buffer = new byte[10000];
            Builder = new StringBuilder(1000);
        }

        public void Reset()
        {
            Array.Clear(Buffer, 0, Buffer.Length);
            Builder.Clear();
        }
    }

    public class ExpensiveObjectPolicy : IPooledObjectPolicy<ExpensiveObject>
    {
        public ExpensiveObject Create()
        {
            return new ExpensiveObject();
        }

        public bool Return(ExpensiveObject obj)
        {
            obj.Reset();
            return true; // Accept back into pool
        }
    }

    public class ServiceUsingPool
    {
        private readonly ObjectPool<ExpensiveObject> _pool;

        public ServiceUsingPool()
        {
            var policy = new ExpensiveObjectPolicy();
            _pool = new DefaultObjectPool<ExpensiveObject>(policy, maximumRetained: 100);
        }

        public void ProcessRequest()
        {
            ExpensiveObject obj = _pool.Get();
            try
            {
                // Use object
                obj.Builder.Append("Processing...");
            }
            finally
            {
                _pool.Return(obj);
            }
        }
    }

    // Custom implementation for learning
    public class SimpleObjectPool<T> where T : class, new()
    {
        private readonly ConcurrentBag<T> _objects = new();
        private readonly Func<T> _objectGenerator;
        private readonly Action<T> _resetAction;
        private readonly int _maxSize;

        public SimpleObjectPool(Func<T> objectGenerator, Action<T> resetAction, int maxSize = 100)
        {
            _objectGenerator = objectGenerator ?? (() => new T());
            _resetAction = resetAction;
            _maxSize = maxSize;
        }

        public T Rent()
        {
            return _objects.TryTake(out T item) ? item : _objectGenerator();
        }

        public void Return(T item)
        {
            if (_objects.Count < _maxSize)
            {
                _resetAction?.Invoke(item);
                _objects.Add(item);
            }
        }
    }

    // Usage example
    public class PoolUsageExample
    {
        private static readonly SimpleObjectPool<StringBuilder> _stringBuilderPool =
            new SimpleObjectPool<StringBuilder>(
                () => new StringBuilder(1000),
                sb => sb.Clear(),
                maxSize: 50
            );

        public string BuildLargeString()
        {
            StringBuilder sb = _stringBuilderPool.Rent();
            try
            {
                for (int i = 0; i < 1000; i++)
                {
                    sb.Append(i).Append(',');
                }
                return sb.ToString();
            }
            finally
            {
                _stringBuilderPool.Return(sb);
            }
        }
    }
}
```

**When to use object pooling:**
- Object creation is expensive
- Objects are used frequently
- Objects can be reset/reused
- Managing object lifecycle is acceptable overhead
</details>

---

## StringBuilder vs String Concatenation

### Exercise 12: String Concatenation Performance
**Question:** Benchmark different string concatenation approaches.

<details>
<summary>Answer</summary>

```csharp
using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Running;

[MemoryDiagnoser]
public class StringConcatenationBenchmarks
{
    private const int Iterations = 1000;

    [Benchmark]
    public string UsingPlusOperator()
    {
        string result = "";
        for (int i = 0; i < Iterations; i++)
        {
            result += i.ToString(); // Very bad!
        }
        return result;
    }

    [Benchmark]
    public string UsingStringBuilder()
    {
        var sb = new StringBuilder();
        for (int i = 0; i < Iterations; i++)
        {
            sb.Append(i);
        }
        return sb.ToString();
    }

    [Benchmark]
    public string UsingStringBuilderWithCapacity()
    {
        var sb = new StringBuilder(Iterations * 4); // Estimate capacity
        for (int i = 0; i < Iterations; i++)
        {
            sb.Append(i);
        }
        return sb.ToString();
    }

    [Benchmark]
    public string UsingStringCreate()
    {
        return string.Create(Iterations * 4, Iterations, (span, count) =>
        {
            int position = 0;
            for (int i = 0; i < count; i++)
            {
                i.TryFormat(span.Slice(position), out int written);
                position += written;
            }
        });
    }

    [Benchmark]
    public string UsingStringJoin()
    {
        return string.Join("", Enumerable.Range(0, Iterations));
    }

    [Benchmark]
    public string UsingStringConcat()
    {
        return string.Concat(Enumerable.Range(0, Iterations).Select(i => i.ToString()));
    }
}

// Results (approximate):
// |                         Method |        Mean |     Error |    StdDev |  Gen 0 | Gen 1 | Gen 2 | Allocated |
// |------------------------------- |------------:|----------:|----------:|-------:|------:|------:|----------:|
// |              UsingPlusOperator | 25,000.0 us | 100.00 us |  90.00 us | 15000  | 5000  | 1000  |   50 MB   |
// |           UsingStringBuilder   |    150.0 us |   5.00 us |   4.00 us |   20   |   5   |   -   |   80 KB   |
// | UsingStringBuilderWithCapacity |    130.0 us |   3.00 us |   2.50 us |   15   |   -   |   -   |   60 KB   |
// |            UsingStringCreate   |    120.0 us |   2.00 us |   1.80 us |   10   |   -   |   -   |   40 KB   |
// |             UsingStringJoin    |    160.0 us |   4.00 us |   3.50 us |   18   |   -   |   -   |   70 KB   |
// |            UsingStringConcat   |    155.0 us |   4.50 us |   4.00 us |   17   |   -   |   -   |   68 KB   |

public class StringConcatenationGuidelines
{
    // Rule of thumb:
    // - Few strings (2-4): Use string interpolation or +
    // - Loop/many strings: Use StringBuilder
    // - Known exact size: Use string.Create
    // - Collection of strings: Use string.Join or string.Concat

    public string ConcatenateFewStrings(string a, string b, string c)
    {
        return $"{a}{b}{c}"; // Compiler optimizes this
    }

    public string ConcatenateInLoop(IEnumerable<string> items)
    {
        var sb = new StringBuilder();
        foreach (var item in items)
        {
            sb.Append(item);
        }
        return sb.ToString();
    }

    public string ConcatenateCollection(IEnumerable<string> items)
    {
        return string.Join("", items); // Efficient for collections
    }
}
```
</details>

---

## Struct vs Class Performance

### Exercise 13: Struct vs Class Performance Analysis
**Question:** Compare the performance implications of using struct vs class.

<details>
<summary>Answer</summary>

```csharp
using BenchmarkDotNet.Attributes;

// Class version
public class PointClass
{
    public double X { get; set; }
    public double Y { get; set; }

    public PointClass(double x, double y)
    {
        X = x;
        Y = y;
    }
}

// Struct version
public struct PointStruct
{
    public double X { get; set; }
    public double Y { get; set; }

    public PointStruct(double x, double y)
    {
        X = x;
        Y = y;
    }
}

// Readonly struct (best performance)
public readonly struct PointReadonlyStruct
{
    public double X { get; }
    public double Y { get; }

    public PointReadonlyStruct(double x, double y)
    {
        X = x;
        Y = y;
    }
}

[MemoryDiagnoser]
public class StructVsClassBenchmarks
{
    private const int Count = 10000;

    [Benchmark]
    public double SumWithClass()
    {
        var points = new PointClass[Count];
        for (int i = 0; i < Count; i++)
        {
            points[i] = new PointClass(i, i); // Heap allocation each time
        }

        double sum = 0;
        foreach (var point in points)
        {
            sum += point.X + point.Y;
        }
        return sum;
    }

    [Benchmark]
    public double SumWithStruct()
    {
        var points = new PointStruct[Count];
        for (int i = 0; i < Count; i++)
        {
            points[i] = new PointStruct(i, i); // No heap allocation
        }

        double sum = 0;
        foreach (var point in points)
        {
            sum += point.X + point.Y;
        }
        return sum;
    }

    [Benchmark]
    public double SumWithReadonlyStruct()
    {
        var points = new PointReadonlyStruct[Count];
        for (int i = 0; i < Count; i++)
        {
            points[i] = new PointReadonlyStruct(i, i);
        }

        double sum = 0;
        foreach (var point in points)
        {
            sum += point.X + point.Y; // No defensive copy
        }
        return sum;
    }
}

// Guidelines for struct usage
public class StructGuidelines
{
    // GOOD struct candidates:
    // - Small size (< 16 bytes recommended)
    // - Immutable
    // - Value semantics
    // - Short-lived

    public readonly struct GoodStruct
    {
        public readonly int Id;
        public readonly double Value;

        public GoodStruct(int id, double value)
        {
            Id = id;
            Value = value;
        }
    }

    // BAD struct candidates:
    // - Large size
    // - Mutable
    // - Reference semantics needed
    // - Long-lived

    // This should be a class!
    public struct BadStruct
    {
        public int Field1;
        public int Field2;
        public int Field3;
        public int Field4;
        public int Field5;
        public string Name; // Reference type in struct
        // ... many more fields
    }

    // Defensive copies problem
    public struct MutableStruct
    {
        public int Value { get; set; }

        public void Increment()
        {
            Value++; // If called on readonly field, operates on copy!
        }
    }

    public void DemonstratDefensiveCopy()
    {
        var items = new List<MutableStruct> { new MutableStruct() };

        // This doesn't work as expected!
        items[0].Increment(); // Operates on copy, original unchanged

        // Correct way:
        var item = items[0];
        item.Increment();
        items[0] = item;
    }
}
```

**Performance results:**
- Class: Higher memory, GC pressure, indirection
- Struct: Lower memory, no GC, but copying cost
- Readonly struct: Best performance, no defensive copies

**Use struct when:**
- Size <= 16 bytes
- Immutable
- Value semantics
- Short-lived

**Use class when:**
- Larger than 16 bytes
- Mutable
- Reference semantics
- Long-lived
- Need inheritance
</details>

---

## ref, in, out Parameters

### Exercise 14: ref, in, out Performance
**Question:** Demonstrate the performance benefits of ref, in, and out parameters.

<details>
<summary>Answer</summary>

```csharp
using BenchmarkDotNet.Attributes;

public struct LargeStruct
{
    public long Field1, Field2, Field3, Field4;
    public long Field5, Field6, Field7, Field8;
    // 64 bytes total
}

[MemoryDiagnoser]
public class RefParameterBenchmarks
{
    private LargeStruct _data = new LargeStruct { Field1 = 100 };

    [Benchmark]
    public long PassByValue()
    {
        return ProcessByValue(_data); // Copies 64 bytes
    }

    [Benchmark]
    public long PassByRef()
    {
        return ProcessByRef(ref _data); // Passes reference (8 bytes)
    }

    [Benchmark]
    public long PassByIn()
    {
        return ProcessByIn(in _data); // Readonly reference
    }

    private long ProcessByValue(LargeStruct data)
    {
        return data.Field1 + data.Field2;
    }

    private long ProcessByRef(ref LargeStruct data)
    {
        return data.Field1 + data.Field2;
    }

    private long ProcessByIn(in LargeStruct data)
    {
        return data.Field1 + data.Field2;
    }
}

// Practical examples
public class RefParameterExamples
{
    // out: Must be assigned before method returns
    public bool TryParse(string input, out int result)
    {
        return int.TryParse(input, out result);
    }

    // ref: Can read and write
    public void Swap<T>(ref T a, ref T b)
    {
        T temp = a;
        a = b;
        b = temp;
    }

    // in: Readonly reference, prevents copying
    public double CalculateDistance(in PointStruct p1, in PointStruct p2)
    {
        double dx = p2.X - p1.X;
        double dy = p2.Y - p1.Y;
        return Math.Sqrt(dx * dx + dy * dy);
    }

    // Multiple out parameters
    public void GetMinMax(int[] array, out int min, out int max)
    {
        min = array[0];
        max = array[0];

        foreach (int value in array)
        {
            if (value < min) min = value;
            if (value > max) max = value;
        }
    }

    // ref with structs
    public void UpdatePoint(ref PointStruct point, double newX, double newY)
    {
        point = new PointStruct(newX, newY);
    }

    public void Example()
    {
        // out usage
        if (TryParse("42", out int value))
        {
            Console.WriteLine(value);
        }

        // ref usage
        int a = 10, b = 20;
        Swap(ref a, ref b);

        // in usage
        var p1 = new PointStruct(0, 0);
        var p2 = new PointStruct(3, 4);
        double distance = CalculateDistance(in p1, in p2);
    }
}

// Advanced: ref returns
public class RefReturnExamples
{
    private int[] _array = new int[100];

    // Return reference to array element
    public ref int FindElement(int index)
    {
        return ref _array[index];
    }

    public void ModifyArrayElement()
    {
        ref int element = ref FindElement(10);
        element = 999; // Modifies array directly
    }

    // Ref return from property
    private int _value;

    public ref int Value => ref _value;

    public void ModifyProperty()
    {
        Value = 42; // Works like normal property

        ref int valueRef = ref Value;
        valueRef = 100; // Also modifies _value
    }

    // Find and modify pattern
    public ref int FindFirst(Predicate<int> predicate)
    {
        for (int i = 0; i < _array.Length; i++)
        {
            if (predicate(_array[i]))
            {
                return ref _array[i];
            }
        }

        throw new InvalidOperationException("Not found");
    }

    public void ExampleFindFirst()
    {
        ref int firstEven = ref FindFirst(x => x % 2 == 0);
        firstEven *= 2; // Modifies array element directly
    }
}
```

**Guidelines:**
- Use `in` for large readonly structs (> 16 bytes)
- Use `ref` when you need to modify the parameter
- Use `out` when returning multiple values
- Use ref returns to avoid copying large structs
</details>

---

### Exercise 15: ref locals and Performance
**Question:** Demonstrate the use of ref locals for performance optimization.

<details>
<summary>Answer</summary>

```csharp
public class RefLocalExamples
{
    public struct Vector3
    {
        public float X, Y, Z;

        public Vector3(float x, float y, float z)
        {
            X = x; Y = y; Z = z;
        }
    }

    // Without ref local - multiple copies
    public void ProcessVectorsSlow(Vector3[] vectors)
    {
        for (int i = 0; i < vectors.Length; i++)
        {
            vectors[i].X *= 2; // Copies struct, modifies, copies back
            vectors[i].Y *= 2; // Copies struct, modifies, copies back
            vectors[i].Z *= 2; // Copies struct, modifies, copies back
        }
    }

    // With ref local - single reference
    public void ProcessVectorsFast(Vector3[] vectors)
    {
        for (int i = 0; i < vectors.Length; i++)
        {
            ref Vector3 vector = ref vectors[i]; // Reference to array element
            vector.X *= 2; // Direct modification
            vector.Y *= 2;
            vector.Z *= 2;
        }
    }

    // Span<T> with ref
    public void ProcessWithSpan(Span<Vector3> vectors)
    {
        foreach (ref Vector3 vector in vectors)
        {
            vector.X *= 2;
            vector.Y *= 2;
            vector.Z *= 2;
        }
    }

    // ref readonly local
    public float CalculateSum(Vector3[] vectors)
    {
        float sum = 0;
        foreach (ref readonly Vector3 vector in vectors.AsSpan())
        {
            sum += vector.X + vector.Y + vector.Z; // No copying
            // vector.X = 0; // Compiler error - readonly
        }
        return sum;
    }

    // Finding maximum with ref
    public ref Vector3 FindMax(Vector3[] vectors)
    {
        ref Vector3 max = ref vectors[0];

        for (int i = 1; i < vectors.Length; i++)
        {
            ref Vector3 current = ref vectors[i];
            if (current.X + current.Y + current.Z > max.X + max.Y + max.Z)
            {
                max = ref current; // Update reference
            }
        }

        return ref max;
    }

    // Advanced: ref ternary
    public ref int GetLarger(ref int a, ref int b)
    {
        return ref (a > b ? ref a : ref b);
    }

    public void Example()
    {
        int x = 10, y = 20;
        ref int larger = ref GetLarger(ref x, ref y);
        larger = 100; // Modifies y

        Console.WriteLine($"x={x}, y={y}"); // x=10, y=100
    }
}
```
</details>

---

## stackalloc

### Exercise 16: stackalloc for Stack Allocation
**Question:** Demonstrate safe and efficient use of stackalloc.

<details>
<summary>Answer</summary>

```csharp
public class StackAllocExamples
{
    // Basic stackalloc with Span<T>
    public int SumSmallArray()
    {
        Span<int> numbers = stackalloc int[10]; // Stack allocated

        for (int i = 0; i < numbers.Length; i++)
        {
            numbers[i] = i;
        }

        int sum = 0;
        foreach (int n in numbers)
        {
            sum += n;
        }

        return sum;
    }

    // Conditional stackalloc
    public int ProcessArray(int size)
    {
        // Use stack for small arrays, heap for large
        Span<int> buffer = size <= 128
            ? stackalloc int[size]
            : new int[size];

        for (int i = 0; i < buffer.Length; i++)
        {
            buffer[i] = i * i;
        }

        return buffer[0];
    }

    // String formatting with stackalloc
    public string FormatNumber(int number)
    {
        Span<char> buffer = stackalloc char[16];

        if (number.TryFormat(buffer, out int written))
        {
            return new string(buffer.Slice(0, written));
        }

        return number.ToString();
    }

    // Binary data processing
    public uint ReadUInt32(ReadOnlySpan<byte> data)
    {
        Span<byte> reversed = stackalloc byte[4];
        data.Slice(0, 4).CopyTo(reversed);
        reversed.Reverse();

        return BitConverter.ToUInt32(reversed);
    }

    // Temporary calculations
    public double CalculateAverage(ReadOnlySpan<int> values)
    {
        int count = values.Length;
        Span<double> normalized = stackalloc double[count];

        for (int i = 0; i < count; i++)
        {
            normalized[i] = values[i] / 100.0;
        }

        double sum = 0;
        foreach (double value in normalized)
        {
            sum += value;
        }

        return sum / count;
    }

    // DANGER: Stack overflow
    public void StackOverflowDanger()
    {
        // DON'T DO THIS!
        // Span<byte> huge = stackalloc byte[1000000]; // Stack overflow!

        // Stack is limited (typically 1MB)
        // Use heap allocation or ArrayPool for large buffers
    }

    // Safe pattern with threshold
    public void SafePattern(int size)
    {
        const int StackAllocThreshold = 512;

        if (size <= StackAllocThreshold)
        {
            Span<byte> buffer = stackalloc byte[size];
            ProcessBuffer(buffer);
        }
        else
        {
            byte[] rented = ArrayPool<byte>.Shared.Rent(size);
            try
            {
                ProcessBuffer(rented.AsSpan(0, size));
            }
            finally
            {
                ArrayPool<byte>.Shared.Return(rented);
            }
        }
    }

    private void ProcessBuffer(Span<byte> buffer)
    {
        // Process buffer
    }

    // Performance comparison
    [MemoryDiagnoser]
    public class StackAllocBenchmarks
    {
        [Benchmark]
        public int HeapAllocation()
        {
            int[] buffer = new int[100];
            for (int i = 0; i < buffer.Length; i++)
                buffer[i] = i;
            return buffer[0];
        }

        [Benchmark]
        public int StackAllocation()
        {
            Span<int> buffer = stackalloc int[100];
            for (int i = 0; i < buffer.Length; i++)
                buffer[i] = i;
            return buffer[0];
        }
    }
}

// Results:
// HeapAllocation:   ~40ns, 424 B allocated
// StackAllocation:  ~30ns,   0 B allocated
```

**Guidelines:**
- Use for small, temporary buffers (< 1KB)
- Always use with Span<T> for safety
- Consider threshold pattern for variable sizes
- Never stackalloc in loops
- Stack size is limited (typically 1MB)
</details>

---

## BenchmarkDotNet

### Exercise 17: BenchmarkDotNet Basics
**Question:** Create a comprehensive benchmark comparing different LINQ vs for loop approaches.

<details>
<summary>Answer</summary>

```csharp
using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Running;
using BenchmarkDotNet.Configs;
using BenchmarkDotNet.Jobs;

[MemoryDiagnoser]
[RankColumn]
[Orderer(BenchmarkDotNet.Order.SummaryOrderPolicy.FastestToSlowest)]
public class LinqVsLoopBenchmarks
{
    private int[] _data;

    [Params(100, 1000, 10000)]
    public int Size { get; set; }

    [GlobalSetup]
    public void Setup()
    {
        _data = Enumerable.Range(0, Size).ToArray();
    }

    [Benchmark(Baseline = true)]
    public int ForLoop()
    {
        int sum = 0;
        for (int i = 0; i < _data.Length; i++)
        {
            if (_data[i] % 2 == 0)
                sum += _data[i];
        }
        return sum;
    }

    [Benchmark]
    public int ForeachLoop()
    {
        int sum = 0;
        foreach (int value in _data)
        {
            if (value % 2 == 0)
                sum += value;
        }
        return sum;
    }

    [Benchmark]
    public int LinqQuery()
    {
        return _data.Where(x => x % 2 == 0).Sum();
    }

    [Benchmark]
    public int LinqMethodChain()
    {
        return _data.Where(x => x % 2 == 0).Aggregate(0, (acc, x) => acc + x);
    }

    [Benchmark]
    public int SpanLoop()
    {
        int sum = 0;
        ReadOnlySpan<int> span = _data;
        for (int i = 0; i < span.Length; i++)
        {
            if (span[i] % 2 == 0)
                sum += span[i];
        }
        return sum;
    }
}

// Advanced benchmarking features
[Config(typeof(CustomConfig))]
public class AdvancedBenchmarks
{
    private class CustomConfig : ManualConfig
    {
        public CustomConfig()
        {
            AddJob(Job.Default
                .WithWarmupCount(5)
                .WithIterationCount(10)
                .WithInvocationCount(1000));
        }
    }

    [Benchmark]
    [Arguments(100)]
    [Arguments(1000)]
    public int ParameterizedBenchmark(int size)
    {
        int sum = 0;
        for (int i = 0; i < size; i++)
            sum += i;
        return sum;
    }

    [IterationSetup]
    public void IterationSetup()
    {
        // Called before each iteration
    }

    [IterationCleanup]
    public void IterationCleanup()
    {
        // Called after each iteration
    }
}

// Running benchmarks
public class Program
{
    public static void Main(string[] args)
    {
        var summary = BenchmarkRunner.Run<LinqVsLoopBenchmarks>();

        // Or run specific benchmark
        // BenchmarkRunner.Run<AdvancedBenchmarks>();

        // Or run all benchmarks in assembly
        // BenchmarkSwitcher.FromAssembly(typeof(Program).Assembly).Run(args);
    }
}
```

**Output interpretation:**
```
|          Method |  Size |        Mean |     Error |    StdDev | Ratio | Gen 0 | Allocated |
|---------------- |------ |------------:|----------:|----------:|------:|------:|----------:|
|         ForLoop |   100 |    45.23 ns |  0.234 ns |  0.219 ns |  1.00 |     - |         - |
|     ForeachLoop |   100 |    46.12 ns |  0.298 ns |  0.279 ns |  1.02 |     - |         - |
|        SpanLoop |   100 |    44.89 ns |  0.187 ns |  0.175 ns |  0.99 |     - |         - |
|       LinqQuery |   100 |   389.45 ns |  2.145 ns |  2.007 ns |  8.61 | 0.024 |     104 B |
| LinqMethodChain |   100 |   425.78 ns |  3.421 ns |  3.200 ns |  9.41 | 0.029 |     128 B |
```
</details>

---

### Exercise 18: Micro-Benchmarking Pitfalls
**Question:** Identify and fix common benchmarking mistakes.

<details>
<summary>Answer</summary>

```csharp
using BenchmarkDotNet.Attributes;

[MemoryDiagnoser]
public class BenchmarkingMistakes
{
    // MISTAKE 1: Dead code elimination
    [Benchmark]
    public void DeadCodeBad()
    {
        int x = 5 + 5; // Compiler optimizes this away!
    }

    [Benchmark]
    public int DeadCodeGood()
    {
        int x = 5 + 5;
        return x; // Return to prevent elimination
    }

    // MISTAKE 2: Not using GlobalSetup
    [Benchmark]
    public void NoSetupBad()
    {
        var data = new int[1000]; // Allocation included in benchmark!
        Array.Sort(data);
    }

    private int[] _data;

    [GlobalSetup]
    public void Setup()
    {
        _data = new int[1000];
        var random = new Random(42);
        for (int i = 0; i < _data.Length; i++)
            _data[i] = random.Next();
    }

    [Benchmark]
    public void WithSetupGood()
    {
        Array.Sort(_data); // Only sorts, not allocation
    }

    // MISTAKE 3: Modifying shared state
    [Benchmark]
    public void SharedStateBad()
    {
        Array.Sort(_data); // Modifies _data!
        // Next iteration uses sorted array!
    }

    [Benchmark]
    public void SharedStateGood()
    {
        int[] copy = (int[])_data.Clone();
        Array.Sort(copy);
    }

    // BETTER: Use IterationSetup
    [IterationSetup]
    public void ResetData()
    {
        var random = new Random(42);
        for (int i = 0; i < _data.Length; i++)
            _data[i] = random.Next();
    }

    [Benchmark]
    public void WithIterationSetup()
    {
        Array.Sort(_data); // Fresh data each iteration
    }

    // MISTAKE 4: Not considering JIT
    [Benchmark]
    public void NoWarmupBad()
    {
        // First runs include JIT time
        SomeComplexMethod();
    }

    // Solution: BenchmarkDotNet handles this automatically
    // But you can configure it
    [Benchmark]
    [WarmupCount(10)] // 10 warmup iterations
    [IterationCount(20)] // 20 actual iterations
    public void WithProperWarmup()
    {
        SomeComplexMethod();
    }

    private void SomeComplexMethod() { }

    // MISTAKE 5: Comparing different machines
    // Always run benchmarks on same machine
    // Use [Baseline] to compare against reference implementation

    [Benchmark(Baseline = true)]
    public int ReferenceImplementation()
    {
        return _data.Sum();
    }

    [Benchmark]
    public int OptimizedImplementation()
    {
        int sum = 0;
        for (int i = 0; i < _data.Length; i++)
            sum += _data[i];
        return sum;
    }

    // MISTAKE 6: Not using MemoryDiagnoser
    // Always add [MemoryDiagnoser] to see allocations!
}

// Best practices summary
[MemoryDiagnoser]
[RankColumn]
public class BestPracticesBenchmark
{
    private byte[] _data;

    [Params(100, 1000, 10000)]
    public int Size { get; set; }

    [GlobalSetup]
    public void GlobalSetup()
    {
        _data = new byte[Size];
        new Random(42).NextBytes(_data);
    }

    [IterationSetup]
    public void IterationSetup()
    {
        // Reset state if needed
    }

    [Benchmark(Baseline = true)]
    public int Baseline()
    {
        return ProcessData(_data);
    }

    [Benchmark]
    public int Optimized()
    {
        return ProcessDataOptimized(_data);
    }

    private int ProcessData(byte[] data)
    {
        int sum = 0;
        foreach (byte b in data)
            sum += b;
        return sum;
    }

    private int ProcessDataOptimized(byte[] data)
    {
        int sum = 0;
        ReadOnlySpan<byte> span = data;
        for (int i = 0; i < span.Length; i++)
            sum += span[i];
        return sum;
    }
}
```
</details>

---

## Memory Profiling

### Exercise 19: Detecting Memory Leaks
**Question:** Identify and fix memory leaks in the following code.

<details>
<summary>Answer</summary>

```csharp
// LEAK 1: Event handler not unsubscribed
public class EventLeakExample
{
    public class Publisher
    {
        public event EventHandler DataChanged;

        public void NotifyChange()
        {
            DataChanged?.Invoke(this, EventArgs.Empty);
        }
    }

    public class SubscriberBad
    {
        private Publisher _publisher;

        public SubscriberBad(Publisher publisher)
        {
            _publisher = publisher;
            _publisher.DataChanged += OnDataChanged; // LEAK: Never unsubscribed
        }

        private void OnDataChanged(object sender, EventArgs e)
        {
            // Handle event
        }
    }

    public class SubscriberGood : IDisposable
    {
        private Publisher _publisher;

        public SubscriberGood(Publisher publisher)
        {
            _publisher = publisher;
            _publisher.DataChanged += OnDataChanged;
        }

        public void Dispose()
        {
            if (_publisher != null)
            {
                _publisher.DataChanged -= OnDataChanged;
                _publisher = null;
            }
        }

        private void OnDataChanged(object sender, EventArgs e)
        {
            // Handle event
        }
    }
}

// LEAK 2: Static references
public class StaticReferenceLeakExample
{
    // LEAK: Static list keeps everything alive
    public static class CacheBad
    {
        private static List<object> _items = new List<object>();

        public static void Add(object item)
        {
            _items.Add(item); // Never removed!
        }
    }

    // GOOD: WeakReference or cleanup mechanism
    public static class CacheGood
    {
        private static List<WeakReference> _items = new List<WeakReference>();

        public static void Add(object item)
        {
            _items.Add(new WeakReference(item));
            Cleanup(); // Periodically remove dead references
        }

        private static void Cleanup()
        {
            _items.RemoveAll(wr => !wr.IsAlive);
        }

        public static IEnumerable<object> GetAliveItems()
        {
            foreach (var wr in _items)
            {
                if (wr.Target is object target)
                    yield return target;
            }
        }
    }
}

// LEAK 3: Unmanaged resources
public class UnmanagedResourceLeakExample
{
    // BAD: No disposal
    public class ResourceLeakBad
    {
        private IntPtr _unmanagedResource;

        public ResourceLeakBad()
        {
            _unmanagedResource = AllocateUnmanaged();
        }

        // LEAK: Never freed!
    }

    // GOOD: Proper disposal pattern
    public class ResourceLeakGood : IDisposable
    {
        private IntPtr _unmanagedResource;
        private bool _disposed = false;

        public ResourceLeakGood()
        {
            _unmanagedResource = AllocateUnmanaged();
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    // Dispose managed resources
                }

                // Free unmanaged resources
                if (_unmanagedResource != IntPtr.Zero)
                {
                    FreeUnmanaged(_unmanagedResource);
                    _unmanagedResource = IntPtr.Zero;
                }

                _disposed = true;
            }
        }

        ~ResourceLeakGood()
        {
            Dispose(false);
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }

    private static IntPtr AllocateUnmanaged() => IntPtr.Zero;
    private static void FreeUnmanaged(IntPtr ptr) { }
}

// LEAK 4: Timer not disposed
public class TimerLeakExample
{
    // BAD: Timer keeps object alive
    public class ServiceBad
    {
        private System.Threading.Timer _timer;

        public ServiceBad()
        {
            _timer = new System.Threading.Timer(
                callback: _ => DoWork(),
                state: null,
                dueTime: 1000,
                period: 1000
            );
            // LEAK: Timer never disposed
        }

        private void DoWork() { }
    }

    // GOOD: Dispose timer
    public class ServiceGood : IDisposable
    {
        private System.Threading.Timer _timer;

        public ServiceGood()
        {
            _timer = new System.Threading.Timer(
                callback: _ => DoWork(),
                state: null,
                dueTime: 1000,
                period: 1000
            );
        }

        public void Dispose()
        {
            _timer?.Dispose();
            _timer = null;
        }

        private void DoWork() { }
    }
}

// LEAK 5: Large closures
public class ClosureLeakExample
{
    public class ClosureLeak
    {
        public Action CreateLeakyAction()
        {
            byte[] largeArray = new byte[10_000_000]; // 10 MB
            int smallValue = 42;

            // BAD: Closure captures entire largeArray
            return () => Console.WriteLine(smallValue);
            // largeArray kept alive even though not used!
        }

        public Action CreateNonLeakyAction()
        {
            byte[] largeArray = new byte[10_000_000];
            int smallValue = 42;

            // Process largeArray
            ProcessArray(largeArray);

            // GOOD: Only capture what's needed
            int capturedValue = smallValue;
            return () => Console.WriteLine(capturedValue);
            // largeArray can be collected
        }

        private void ProcessArray(byte[] array) { }
    }
}

// Tools for detecting leaks:
public class LeakDetectionTools
{
    public static void MonitorMemory()
    {
        long before = GC.GetTotalMemory(forceFullCollection: true);

        // Run suspicious code
        DoSomething();

        long after = GC.GetTotalMemory(forceFullCollection: true);

        Console.WriteLine($"Memory delta: {(after - before) / 1024.0:F2} KB");
    }

    public static void ProfileWithWeakReference()
    {
        WeakReference wr = CreateAndReleaseObject();

        GC.Collect();
        GC.WaitForPendingFinalizers();
        GC.Collect();

        if (wr.IsAlive)
        {
            Console.WriteLine("LEAK: Object still alive!");
        }
        else
        {
            Console.WriteLine("OK: Object collected");
        }
    }

    private static WeakReference CreateAndReleaseObject()
    {
        object obj = new object();
        return new WeakReference(obj);
    }

    private static void DoSomething() { }
}
```

**Detection tools:**
- Visual Studio Diagnostic Tools
- dotMemory
- PerfView
- ANTS Memory Profiler
- Use WeakReference for testing
- Monitor GC.GetTotalMemory()
</details>

---

## IDisposable and Finalizers

### Exercise 20: Proper Dispose Pattern
**Question:** Implement the complete IDisposable pattern with finalizer.

<details>
<summary>Answer</summary>

```csharp
using System;
using System.Runtime.InteropServices;

// Full disposal pattern
public class ProperDisposalPattern : IDisposable
{
    // Managed resources
    private FileStream _managedResource;

    // Unmanaged resources
    private IntPtr _unmanagedResource;

    // Track disposal
    private bool _disposed = false;

    public ProperDisposalPattern()
    {
        _managedResource = new FileStream("temp.txt", FileMode.Create);
        _unmanagedResource = Marshal.AllocHGlobal(1024);
    }

    // Protected virtual method for inheritance
    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                // Dispose managed resources
                _managedResource?.Dispose();
                _managedResource = null;
            }

            // Free unmanaged resources
            if (_unmanagedResource != IntPtr.Zero)
            {
                Marshal.FreeHGlobal(_unmanagedResource);
                _unmanagedResource = IntPtr.Zero;
            }

            _disposed = true;
        }
    }

    // Finalizer (destructor)
    ~ProperDisposalPattern()
    {
        Dispose(disposing: false);
    }

    // Public Dispose method
    public void Dispose()
    {
        Dispose(disposing: true);
        GC.SuppressFinalize(this); // Prevent finalizer from running
    }

    // Helper to check if disposed
    private void ThrowIfDisposed()
    {
        if (_disposed)
        {
            throw new ObjectDisposedException(GetType().Name);
        }
    }

    public void DoSomething()
    {
        ThrowIfDisposed();
        // Use resources
    }
}

// Derived class pattern
public class DerivedDisposableClass : ProperDisposalPattern
{
    private Stream _derivedResource;
    private bool _disposed = false;

    protected override void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                // Dispose derived managed resources
                _derivedResource?.Dispose();
            }

            // Free derived unmanaged resources if any

            _disposed = true;
        }

        // Call base class Dispose
        base.Dispose(disposing);
    }
}

// SafeHandle pattern (preferred for unmanaged resources)
public class SafeHandleExample : IDisposable
{
    private MySafeHandle _handle;
    private bool _disposed = false;

    public SafeHandleExample()
    {
        _handle = new MySafeHandle(AllocateResource());
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                _handle?.Dispose();
            }

            _disposed = true;
        }
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    private class MySafeHandle : SafeHandle
    {
        public MySafeHandle(IntPtr handle) : base(IntPtr.Zero, ownsHandle: true)
        {
            SetHandle(handle);
        }

        public override bool IsInvalid => handle == IntPtr.Zero;

        protected override bool ReleaseHandle()
        {
            // Free the resource
            FreeResource(handle);
            return true;
        }
    }

    private static IntPtr AllocateResource() => Marshal.AllocHGlobal(1024);
    private static void FreeResource(IntPtr ptr) => Marshal.FreeHGlobal(ptr);
}

// Async disposal (IAsyncDisposable)
public class AsyncDisposableExample : IAsyncDisposable, IDisposable
{
    private Stream _stream;
    private bool _disposed = false;

    public async ValueTask DisposeAsync()
    {
        if (!_disposed)
        {
            if (_stream != null)
            {
                await _stream.FlushAsync();
                await _stream.DisposeAsync();
            }

            _disposed = true;
        }

        GC.SuppressFinalize(this);
    }

    public void Dispose()
    {
        if (!_disposed)
        {
            _stream?.Dispose();
            _disposed = true;
        }

        GC.SuppressFinalize(this);
    }
}

// Usage patterns
public class DisposalUsageExamples
{
    public void UsingStatement()
    {
        using (var resource = new ProperDisposalPattern())
        {
            resource.DoSomething();
        } // Dispose called automatically
    }

    public void UsingDeclaration()
    {
        using var resource = new ProperDisposalPattern();
        resource.DoSomething();
        // Dispose called at end of scope
    }

    public async Task UsingAsyncDisposable()
    {
        await using var resource = new AsyncDisposableExample();
        // Use resource
        // DisposeAsync called at end of scope
    }

    public void TryFinallyPattern()
    {
        var resource = new ProperDisposalPattern();
        try
        {
            resource.DoSomething();
        }
        finally
        {
            resource?.Dispose();
        }
    }

    public void MultipleResources()
    {
        using var resource1 = new ProperDisposalPattern();
        using var resource2 = new ProperDisposalPattern();

        // Both disposed in reverse order at end of scope
    }
}

// Common mistakes
public class DisposalMistakes
{
    // MISTAKE 1: Not calling base.Dispose
    public class BadDerived : ProperDisposalPattern
    {
        protected override void Dispose(bool disposing)
        {
            // Clean up
            // MISTAKE: Forgot base.Dispose(disposing);
        }
    }

    // MISTAKE 2: Suppressing finalizer without freeing resources
    public class BadSuppressFinalizer : IDisposable
    {
        private IntPtr _resource;

        public void Dispose()
        {
            GC.SuppressFinalize(this);
            // MISTAKE: Didn't free _resource!
        }
    }

    // MISTAKE 3: Disposing multiple times not handled
    public class NoDisposedFlag : IDisposable
    {
        private Stream _stream;

        public void Dispose()
        {
            _stream.Dispose(); // Throws if already disposed!
            // Should check _disposed flag
        }
    }
}
```

**Key points:**
- Always implement dispose pattern correctly
- Use SafeHandle for unmanaged resources
- Support both Dispose and DisposeAsync when needed
- Call GC.SuppressFinalize if you have a finalizer
- Make Dispose safe to call multiple times
- Dispose managed resources only in Dispose(true)
- Free unmanaged resources in both Dispose(true) and Dispose(false)
</details>

---

## Advanced Performance Topics

### Exercise 21: String.Create for Zero-Allocation Strings
**Question:** Use String.Create to build strings without allocations.

<details>
<summary>Answer</summary>

```csharp
public class StringCreateExamples
{
    // Traditional approach - multiple allocations
    public string FormatTraditional(int id, string name, decimal price)
    {
        return $"ID: {id}, Name: {name}, Price: ${price:F2}";
        // Creates intermediate strings
    }

    // String.Create - zero intermediate allocations
    public string FormatOptimized(int id, string name, decimal price)
    {
        int estimatedLength = 50;

        return string.Create(estimatedLength, (id, name, price), (span, state) =>
        {
            int pos = 0;

            "ID: ".AsSpan().CopyTo(span);
            pos += 4;

            state.id.TryFormat(span.Slice(pos), out int written);
            pos += written;

            ", Name: ".AsSpan().CopyTo(span.Slice(pos));
            pos += 8;

            state.name.AsSpan().CopyTo(span.Slice(pos));
            pos += state.name.Length;

            ", Price: $".AsSpan().CopyTo(span.Slice(pos));
            pos += 10;

            state.price.TryFormat(span.Slice(pos), out written, "F2");
            pos += written;

            // Resize span to actual length
            span = span.Slice(0, pos);
        });
    }

    // Simplified with helper
    public string FormatWithHelper(int number)
    {
        return string.Create(10, number, static (span, value) =>
        {
            value.TryFormat(span, out int written);
            span[written] = '!';
        });
    }

    // Building CSV line
    public string BuildCsvLine(int[] values)
    {
        if (values.Length == 0) return string.Empty;

        // Estimate: each int ~10 chars + comma
        int estimatedLength = values.Length * 11;

        return string.Create(estimatedLength, values, (span, vals) =>
        {
            int pos = 0;

            for (int i = 0; i < vals.Length; i++)
            {
                if (i > 0)
                {
                    span[pos++] = ',';
                }

                vals[i].TryFormat(span.Slice(pos), out int written);
                pos += written;
            }

            // Return actual used portion
            span = span.Slice(0, pos);
        });
    }

    // URL encoding
    public string BuildUrl(string baseUrl, Dictionary<string, string> parameters)
    {
        int estimatedLength = baseUrl.Length + parameters.Sum(p => p.Key.Length + p.Value.Length + 2);

        return string.Create(estimatedLength, (baseUrl, parameters), (span, state) =>
        {
            int pos = 0;

            state.baseUrl.AsSpan().CopyTo(span);
            pos += state.baseUrl.Length;

            span[pos++] = '?';

            bool first = true;
            foreach (var param in state.parameters)
            {
                if (!first)
                    span[pos++] = '&';
                first = false;

                param.Key.AsSpan().CopyTo(span.Slice(pos));
                pos += param.Key.Length;

                span[pos++] = '=';

                param.Value.AsSpan().CopyTo(span.Slice(pos));
                pos += param.Value.Length;
            }
        });
    }
}

[MemoryDiagnoser]
public class StringCreateBenchmarks
{
    [Benchmark]
    public string TraditionalConcat()
    {
        return "Value: " + 42 + ", Status: " + true;
    }

    [Benchmark]
    public string InterpolatedString()
    {
        return $"Value: {42}, Status: {true}";
    }

    [Benchmark]
    public string StringCreate()
    {
        return string.Create(30, (value: 42, status: true), (span, state) =>
        {
            int pos = 0;
            "Value: ".AsSpan().CopyTo(span);
            pos += 7;
            state.value.TryFormat(span.Slice(pos), out int w1);
            pos += w1;
            ", Status: ".AsSpan().CopyTo(span.Slice(pos));
            pos += 10;
            state.status.ToString().AsSpan().CopyTo(span.Slice(pos));
        });
    }
}
```
</details>

---

### Exercise 22: Collection Performance
**Question:** Compare performance of different collection types and operations.

<details>
<summary>Answer</summary>

```csharp
using BenchmarkDotNet.Attributes;
using System.Collections.Concurrent;

[MemoryDiagnoser]
public class CollectionBenchmarks
{
    private const int ItemCount = 10000;

    [Benchmark]
    public List<int> ListAdd()
    {
        var list = new List<int>();
        for (int i = 0; i < ItemCount; i++)
            list.Add(i);
        return list;
    }

    [Benchmark]
    public List<int> ListAddWithCapacity()
    {
        var list = new List<int>(ItemCount); // Pre-allocate
        for (int i = 0; i < ItemCount; i++)
            list.Add(i);
        return list;
    }

    [Benchmark]
    public HashSet<int> HashSetAdd()
    {
        var set = new HashSet<int>();
        for (int i = 0; i < ItemCount; i++)
            set.Add(i);
        return set;
    }

    [Benchmark]
    public Dictionary<int, int> DictionaryAdd()
    {
        var dict = new Dictionary<int, int>();
        for (int i = 0; i < ItemCount; i++)
            dict[i] = i;
        return dict;
    }

    [Benchmark]
    public Dictionary<int, int> DictionaryAddWithCapacity()
    {
        var dict = new Dictionary<int, int>(ItemCount);
        for (int i = 0; i < ItemCount; i++)
            dict[i] = i;
        return dict;
    }
}

// Collection selection guide
public class CollectionSelectionGuide
{
    // Use List<T> when:
    // - Need ordered collection
    // - Frequent access by index
    // - Occasional additions/removals
    public void UseList()
    {
        var list = new List<int>(capacity: 1000); // Pre-allocate if size known
        list.Add(1);
        int value = list[0]; // O(1) access
    }

    // Use HashSet<T> when:
    // - Need unique items
    // - Frequent Contains checks
    // - Order doesn't matter
    public void UseHashSet()
    {
        var set = new HashSet<int>();
        set.Add(1);
        bool contains = set.Contains(1); // O(1) lookup
    }

    // Use Dictionary<TKey, TValue> when:
    // - Key-value pairs
    // - Fast lookup by key
    public void UseDictionary()
    {
        var dict = new Dictionary<string, int>();
        dict["key"] = 42;
        int value = dict["key"]; // O(1) lookup
    }

    // Use LinkedList<T> when:
    // - Frequent insertions/deletions in middle
    // - Don't need index access
    public void UseLinkedList()
    {
        var list = new LinkedList<int>();
        var node = list.AddLast(1);
        list.AddAfter(node, 2); // O(1) insertion
    }

    // Use Queue<T> for FIFO
    public void UseQueue()
    {
        var queue = new Queue<int>();
        queue.Enqueue(1);
        int first = queue.Dequeue();
    }

    // Use Stack<T> for LIFO
    public void UseStack()
    {
        var stack = new Stack<int>();
        stack.Push(1);
        int last = stack.Pop();
    }

    // Use ConcurrentDictionary for thread-safe access
    public void UseConcurrentDictionary()
    {
        var dict = new ConcurrentDictionary<string, int>();
        dict.TryAdd("key", 42);
        dict.AddOrUpdate("key", 1, (key, old) => old + 1);
    }

    // Use SortedSet for sorted unique items
    public void UseSortedSet()
    {
        var set = new SortedSet<int>();
        set.Add(3);
        set.Add(1);
        set.Add(2);
        // Enumeration is sorted: 1, 2, 3
    }

    // Use SortedDictionary for sorted key-value pairs
    public void UseSortedDictionary()
    {
        var dict = new SortedDictionary<string, int>();
        dict["c"] = 3;
        dict["a"] = 1;
        dict["b"] = 2;
        // Enumeration is sorted by key
    }
}

// Enumeration performance
[MemoryDiagnoser]
public class EnumerationBenchmarks
{
    private List<int> _list;
    private int[] _array;

    [GlobalSetup]
    public void Setup()
    {
        _list = Enumerable.Range(0, 10000).ToList();
        _array = _list.ToArray();
    }

    [Benchmark]
    public int ForEachList()
    {
        int sum = 0;
        foreach (int item in _list)
            sum += item;
        return sum;
    }

    [Benchmark]
    public int ForLoopList()
    {
        int sum = 0;
        for (int i = 0; i < _list.Count; i++)
            sum += _list[i];
        return sum;
    }

    [Benchmark]
    public int ForEachArray()
    {
        int sum = 0;
        foreach (int item in _array)
            sum += item;
        return sum;
    }

    [Benchmark]
    public int ForLoopArray()
    {
        int sum = 0;
        for (int i = 0; i < _array.Length; i++)
            sum += _array[i];
        return sum;
    }

    [Benchmark]
    public int SpanArray()
    {
        int sum = 0;
        ReadOnlySpan<int> span = _array;
        for (int i = 0; i < span.Length; i++)
            sum += span[i];
        return sum;
    }
}
```
</details>

---

### Exercise 23: Lazy<T> vs Manual Lazy Loading
**Question:** Compare Lazy<T> with manual lazy initialization patterns.

<details>
<summary>Answer</summary>

```csharp
using BenchmarkDotNet.Attributes;

public class LazyInitializationExamples
{
    // Eager initialization
    public class EagerInit
    {
        private readonly ExpensiveObject _object = new ExpensiveObject();

        public ExpensiveObject GetObject() => _object;
    }

    // Manual lazy initialization (not thread-safe)
    public class ManualLazy
    {
        private ExpensiveObject _object;

        public ExpensiveObject GetObject()
        {
            if (_object == null)
            {
                _object = new ExpensiveObject();
            }
            return _object;
        }
    }

    // Manual lazy with locking (thread-safe)
    public class ManualLazyThreadSafe
    {
        private readonly object _lock = new object();
        private ExpensiveObject _object;

        public ExpensiveObject GetObject()
        {
            if (_object == null)
            {
                lock (_lock)
                {
                    if (_object == null)
                    {
                        _object = new ExpensiveObject();
                    }
                }
            }
            return _object;
        }
    }

    // Lazy<T> (thread-safe by default)
    public class LazyInit
    {
        private readonly Lazy<ExpensiveObject> _object =
            new Lazy<ExpensiveObject>(() => new ExpensiveObject());

        public ExpensiveObject GetObject() => _object.Value;
    }

    // Lazy<T> with different thread-safety modes
    public class LazyThreadSafetyModes
    {
        // Default: LazyThreadSafetyMode.ExecutionAndPublication
        // - Thread-safe
        // - Only one thread executes factory
        // - All threads see same instance
        private readonly Lazy<ExpensiveObject> _default =
            new Lazy<ExpensiveObject>(() => new ExpensiveObject());

        // PublicationOnly
        // - Multiple threads may execute factory
        // - First completed instance wins
        private readonly Lazy<ExpensiveObject> _publicationOnly =
            new Lazy<ExpensiveObject>(
                () => new ExpensiveObject(),
                LazyThreadSafetyMode.PublicationOnly);

        // None
        // - Not thread-safe
        // - Fastest for single-threaded scenarios
        private readonly Lazy<ExpensiveObject> _none =
            new Lazy<ExpensiveObject>(
                () => new ExpensiveObject(),
                LazyThreadSafetyMode.None);
    }

    // Lazy<T> with isValueCreated check
    public class LazyWithCheck
    {
        private readonly Lazy<ExpensiveObject> _object =
            new Lazy<ExpensiveObject>(() => new ExpensiveObject());

        public bool IsInitialized => _object.IsValueCreated;

        public void ResetIfInitialized()
        {
            if (_object.IsValueCreated)
            {
                // Can't reset Lazy<T>, must create new instance
                // This is a limitation of Lazy<T>
            }
        }
    }

    // Custom resettable lazy
    public class ResettableLazy<T> where T : class
    {
        private readonly Func<T> _factory;
        private readonly object _lock = new object();
        private T _value;

        public ResettableLazy(Func<T> factory)
        {
            _factory = factory ?? throw new ArgumentNullException(nameof(factory));
        }

        public T Value
        {
            get
            {
                if (_value == null)
                {
                    lock (_lock)
                    {
                        if (_value == null)
                        {
                            _value = _factory();
                        }
                    }
                }
                return _value;
            }
        }

        public bool IsValueCreated => _value != null;

        public void Reset()
        {
            lock (_lock)
            {
                _value = null;
            }
        }
    }

    private class ExpensiveObject
    {
        public ExpensiveObject()
        {
            // Simulate expensive initialization
            Thread.Sleep(10);
        }
    }
}

[MemoryDiagnoser]
public class LazyBenchmarks
{
    private readonly EagerInit _eager = new();
    private readonly ManualLazy _manual = new();
    private readonly LazyInit _lazy = new();

    [Benchmark]
    public object EagerInitialization()
    {
        return _eager.GetObject();
    }

    [Benchmark]
    public object ManualLazyInitialization()
    {
        return _manual.GetObject();
    }

    [Benchmark]
    public object LazyInitialization()
    {
        return _lazy.GetObject();
    }
}

// Real-world examples
public class LazyRealWorldExamples
{
    // Lazy configuration loading
    public class ConfigurationManager
    {
        private readonly Lazy<Configuration> _config =
            new Lazy<Configuration>(() => LoadConfiguration());

        public Configuration Config => _config.Value;

        private static Configuration LoadConfiguration()
        {
            // Load from file, database, etc.
            return new Configuration();
        }
    }

    // Lazy database connection
    public class DatabaseService
    {
        private readonly Lazy<DbConnection> _connection;

        public DatabaseService(string connectionString)
        {
            _connection = new Lazy<DbConnection>(() =>
            {
                var conn = new SqlConnection(connectionString);
                conn.Open();
                return conn;
            });
        }

        public DbConnection Connection => _connection.Value;
    }

    // Lazy with dependency injection
    public class ServiceWithLazyDependency
    {
        private readonly Lazy<IExpensiveService> _service;

        public ServiceWithLazyDependency(Lazy<IExpensiveService> service)
        {
            _service = service;
        }

        public void DoWork()
        {
            if (SomeCondition())
            {
                _service.Value.DoExpensiveWork();
            }
        }

        private bool SomeCondition() => true;
    }

    private class Configuration { }
    private interface IExpensiveService { void DoExpensiveWork(); }
    private class SqlConnection : DbConnection
    {
        public SqlConnection(string connectionString) { }
        public override void Open() { }
        protected override DbTransaction BeginDbTransaction(IsolationLevel isolationLevel) => null;
        public override void Close() { }
        public override void ChangeDatabase(string databaseName) { }
        protected override DbCommand CreateDbCommand() => null;
        public override string ConnectionString { get; set; }
        public override string Database => "";
        public override string DataSource => "";
        public override string ServerVersion => "";
        public override ConnectionState State => ConnectionState.Closed;
    }
}
```

**When to use Lazy<T>:**
- Expensive object initialization
- May not be needed in all code paths
- Thread-safety needed
- Don't need to reset value

**When to use manual lazy:**
- Need custom reset logic
- Very performance-critical (avoid Lazy<T> overhead)
- Single-threaded scenario
</details>

---

### Exercise 24: Allocation-Free Async Patterns
**Question:** Implement allocation-free async patterns using ValueTask and pooling.

<details>
<summary>Answer</summary>

```csharp
using System.Threading.Tasks.Sources;

public class AllocationFreeAsyncExamples
{
    // Traditional async - allocates Task
    public async Task<int> TraditionalAsync()
    {
        await Task.Delay(100);
        return 42;
    }

    // ValueTask - no allocation if synchronous
    public async ValueTask<int> ValueTaskAsync(bool useCache)
    {
        if (useCache)
        {
            return 42; // No allocation!
        }

        await Task.Delay(100);
        return 42; // Still allocates Task for async path
    }

    // Pooled ValueTask with IValueTaskSource
    public class PooledValueTaskExample
    {
        private static readonly ObjectPool<PooledTask> _pool =
            ObjectPool.Create<PooledTask>();

        public ValueTask<int> GetValueAsync(bool immediate)
        {
            if (immediate)
            {
                return new ValueTask<int>(42); // No allocation
            }

            var pooled = _pool.Get();
            pooled.Start();
            return new ValueTask<int>(pooled, pooled.Version);
        }

        private class PooledTask : IValueTaskSource<int>
        {
            private ManualResetValueTaskSourceCore<int> _core;

            public short Version => _core.Version;

            public void Start()
            {
                _core.Reset();
                Task.Run(async () =>
                {
                    await Task.Delay(100);
                    _core.SetResult(42);
                });
            }

            public int GetResult(short token)
            {
                try
                {
                    return _core.GetResult(token);
                }
                finally
                {
                    _pool.Return(this);
                }
            }

            public ValueTaskSourceStatus GetStatus(short token) =>
                _core.GetStatus(token);

            public void OnCompleted(Action<object> continuation, object state,
                short token, ValueTaskSourceOnCompletedFlags flags) =>
                _core.OnCompleted(continuation, state, token, flags);
        }
    }

    // Cached ValueTask
    public class CachedValueTaskExample
    {
        private static readonly ValueTask<int> _cached = new ValueTask<int>(42);
        private readonly Dictionary<string, string> _cache = new();

        public ValueTask<string> GetDataAsync(string key)
        {
            if (_cache.TryGetValue(key, out var value))
            {
                return new ValueTask<string>(value); // No allocation
            }

            return LoadDataAsync(key); // Allocates
        }

        private async ValueTask<string> LoadDataAsync(string key)
        {
            await Task.Delay(100);
            var value = $"Data for {key}";
            _cache[key] = value;
            return value;
        }
    }

    // Synchronous ValueTask
    public class SyncValueTaskExample
    {
        public ValueTask<int> GetFromCacheOrDefault(string key)
        {
            // Always completes synchronously - no allocation
            return new ValueTask<int>(42);
        }
    }
}

// Benchmarks
[MemoryDiagnoser]
public class AsyncAllocationBenchmarks
{
    [Benchmark]
    public async Task<int> TaskAlwaysAllocates()
    {
        return await Task.FromResult(42); // Allocates Task
    }

    [Benchmark]
    public async ValueTask<int> ValueTaskNoAllocation()
    {
        return await new ValueTask<int>(42); // No allocation
    }

    [Benchmark]
    public async Task<int> TaskWithActualAsync()
    {
        await Task.Delay(1);
        return 42;
    }

    [Benchmark]
    public async ValueTask<int> ValueTaskWithActualAsync()
    {
        await Task.Delay(1);
        return 42; // Same allocation as Task for async path
    }
}

// Best practices
public class ValueTaskBestPractices
{
    // GOOD: Synchronous path common
    public ValueTask<int> GoodUseCase(string key, Dictionary<string, int> cache)
    {
        if (cache.TryGetValue(key, out int value))
        {
            return new ValueTask<int>(value); // Fast path
        }

        return LoadFromDatabaseAsync(key);
    }

    // BAD: Always asynchronous
    public ValueTask<int> BadUseCase()
    {
        // Always await = no benefit over Task
        return LoadFromDatabaseAsync("key");
    }

    // GOOD: Await once
    public async Task UseValueTaskCorrectly()
    {
        var result = await GoodUseCase("key", new Dictionary<string, int>());
        Console.WriteLine(result);
    }

    // BAD: Await multiple times
    public async Task UseValueTaskIncorrectly()
    {
        var task = GoodUseCase("key", new Dictionary<string, int>());
        var result1 = await task; // First await
        // var result2 = await task; // ERROR: Can't await twice!
    }

    // GOOD: Convert to Task if needed
    public async Task ConvertToTask()
    {
        var valueTask = GoodUseCase("key", new Dictionary<string, int>());
        Task<int> task = valueTask.AsTask(); // Now can await multiple times

        var result1 = await task;
        var result2 = await task; // OK
    }

    private async ValueTask<int> LoadFromDatabaseAsync(string key)
    {
        await Task.Delay(100);
        return 42;
    }
}
```
</details>

---

### Exercise 25: GC.Collect and GC Tuning
**Question:** Demonstrate when and how to use GC.Collect and configure GC behavior.

<details>
<summary>Answer</summary>

```csharp
public class GCControlExamples
{
    // When GC.Collect is acceptable
    public class AcceptableGCCollect
    {
        // After large data processing
        public void ProcessLargeDataBatch()
        {
            byte[] largeData = new byte[100_000_000];
            ProcessData(largeData);
            largeData = null;

            // Large data no longer needed, free memory before next operation
            GC.Collect();
            GC.WaitForPendingFinalizers();
            GC.Collect();
        }

        // Before memory-intensive operation
        public void BeforeMemoryIntensiveWork()
        {
            // Clean up before allocating large amount
            GC.Collect();

            // Now perform memory-intensive work
            AllocateLargeStructures();
        }

        // In unit tests
        [Test]
        public void TestMemoryLeak()
        {
            WeakReference wr = CreateAndRelease();

            GC.Collect();
            GC.WaitForPendingFinalizers();
            GC.Collect();

            Assert.IsFalse(wr.IsAlive, "Memory leak detected");
        }

        private WeakReference CreateAndRelease()
        {
            object obj = new object();
            return new WeakReference(obj);
        }

        private void ProcessData(byte[] data) { }
        private void AllocateLargeStructures() { }
    }

    // GC modes configuration
    public class GCConfiguration
    {
        public void ConfigureGC()
        {
            // Check current mode
            bool isServerGC = GCSettings.IsServerGC;
            Console.WriteLine($"Server GC: {isServerGC}");

            // Set latency mode
            GCLatencyMode oldMode = GCSettings.LatencyMode;

            try
            {
                // Low latency for interactive operations
                GCSettings.LatencyMode = GCLatencyMode.LowLatency;

                // Perform time-sensitive work
                PerformInteractiveWork();
            }
            finally
            {
                // Restore previous mode
                GCSettings.LatencyMode = oldMode;
            }
        }

        public void UseSustainedLowLatency()
        {
            // For sustained low-latency scenarios
            GCLatencyMode oldMode = GCSettings.LatencyMode;

            try
            {
                GCSettings.LatencyMode = GCLatencyMode.SustainedLowLatency;

                // Long-running low-latency work
                RunRealtimeProcessing();
            }
            finally
            {
                GCSettings.LatencyMode = oldMode;
            }
        }

        public void ConfigureLOH()
        {
            // Compact LOH
            GCSettings.LargeObjectHeapCompactionMode =
                GCLargeObjectHeapCompactionMode.CompactOnce;

            GC.Collect();

            // LOH will be compacted during this collection
        }

        private void PerformInteractiveWork() { }
        private void RunRealtimeProcessing() { }
    }

    // GC notifications
    public class GCNotificationExample
    {
        public void RegisterForGCNotifications()
        {
            // Register for full GC notifications
            GC.RegisterForFullGCNotification(10, 10);

            Task.Run(() => MonitorGC());
        }

        private void MonitorGC()
        {
            while (true)
            {
                // Wait for approaching full GC
                GCNotificationStatus status = GC.WaitForFullGCApproach();

                if (status == GCNotificationStatus.Succeeded)
                {
                    Console.WriteLine("Full GC approaching...");
                    // Redirect traffic, prepare for GC pause
                }

                // Wait for full GC to complete
                status = GC.WaitForFullGCComplete();

                if (status == GCNotificationStatus.Succeeded)
                {
                    Console.WriteLine("Full GC completed");
                    // Resume normal operations
                }
            }
        }
    }

    // GC memory info
    public class GCMemoryInfo
    {
        public void DisplayMemoryInfo()
        {
            GCMemoryInfo info = GC.GetGCMemoryInfo();

            Console.WriteLine($"Total available memory: {info.TotalAvailableMemoryBytes / 1024 / 1024} MB");
            Console.WriteLine($"Heap size: {info.HeapSizeBytes / 1024 / 1024} MB");
            Console.WriteLine($"Memory load: {info.MemoryLoadBytes / 1024 / 1024} MB");
            Console.WriteLine($"High memory load threshold: {info.HighMemoryLoadThresholdBytes / 1024 / 1024} MB");
            Console.WriteLine($"Fragmented bytes: {info.FragmentedBytes / 1024 / 1024} MB");
            Console.WriteLine($"Generation 0 size: {info.GenerationInfo[0].SizeBytes / 1024} KB");
            Console.WriteLine($"Generation 1 size: {info.GenerationInfo[1].SizeBytes / 1024} KB");
            Console.WriteLine($"Generation 2 size: {info.GenerationInfo[2].SizeBytes / 1024 / 1024} MB");
        }

        public void MonitorMemoryPressure()
        {
            long before = GC.GetTotalMemory(forceFullCollection: false);

            // Perform work
            DoWork();

            long after = GC.GetTotalMemory(forceFullCollection: false);

            Console.WriteLine($"Memory allocated: {(after - before) / 1024} KB");
        }

        public void AddMemoryPressure()
        {
            // Allocate unmanaged memory
            IntPtr ptr = Marshal.AllocHGlobal(10_000_000);

            try
            {
                // Inform GC about external memory
                GC.AddMemoryPressure(10_000_000);

                // Use memory
            }
            finally
            {
                // Remove pressure and free
                GC.RemoveMemoryPressure(10_000_000);
                Marshal.FreeHGlobal(ptr);
            }
        }

        private void DoWork() { }
    }

    // GC.TryStartNoGCRegion
    public class NoGCRegionExample
    {
        public void CriticalOperation()
        {
            long size = 1024 * 1024; // 1 MB

            if (GC.TryStartNoGCRegion(size))
            {
                try
                {
                    // Critical code that must not be interrupted by GC
                    PerformCriticalWork();
                }
                finally
                {
                    GC.EndNoGCRegion();
                }
            }
            else
            {
                // Fallback if no-GC region couldn't be established
                PerformCriticalWork();
            }
        }

        private void PerformCriticalWork()
        {
            // Time-critical code
        }
    }
}

// Configuration via runtimeconfig.json
/*
{
  "runtimeOptions": {
    "configProperties": {
      "System.GC.Server": true,
      "System.GC.Concurrent": true,
      "System.GC.RetainVM": true,
      "System.GC.HeapCount": 4,
      "System.GC.HeapAffinitizeMask": 15
    }
  }
}
*/

// Best practices summary
public class GCBestPractices
{
    // DON'T: Call GC.Collect in normal code
    public void DontDoThis()
    {
        var data = new byte[1000];
        // Process data
        GC.Collect(); // BAD! Let GC manage itself
    }

    // DO: Let GC manage itself
    public void DoThis()
    {
        var data = new byte[1000];
        // Process data
        // GC will collect when appropriate
    }

    // DO: Reduce allocations
    public void ReduceAllocations()
    {
        // Use object pooling
        var buffer = ArrayPool<byte>.Shared.Rent(1000);
        try
        {
            // Use buffer
        }
        finally
        {
            ArrayPool<byte>.Shared.Return(buffer);
        }
    }

    // DO: Use struct for small types
    public readonly struct Point
    {
        public readonly double X, Y;
        public Point(double x, double y) => (X, Y) = (x, y);
    }

    // DO: Reuse objects
    private readonly StringBuilder _reusable = new StringBuilder();

    public string BuildString()
    {
        _reusable.Clear();
        _reusable.Append("Hello");
        return _reusable.ToString();
    }
}
```

**Key takeaways:**
- Avoid GC.Collect() in production code
- Let GC manage itself
- Use appropriate GC mode (Workstation vs Server)
- Consider GC latency modes for specific scenarios
- Monitor GC behavior with GC.GetGCMemoryInfo()
- Use no-GC regions for critical operations
- Configure GC via runtime config
</details>

---

### Exercise 26: Pinned Objects and Fragmentation
**Question:** Show how to pin a buffer for interop and explain the GC trade-offs.

<details>
<summary>Answer</summary>

```csharp
byte[] buffer = new byte[1024];
var handle = GCHandle.Alloc(buffer, GCHandleType.Pinned);
try
{
    IntPtr ptr = handle.AddrOfPinnedObject();
    NativeApi.Write(ptr, buffer.Length);
}
finally
{
    handle.Free();
}
```

Pinned objects prevent the GC from moving memory, which can fragment the heap and slow collections. Keep pinned lifetimes short and prefer stackalloc or native buffers for hot paths.
</details>

---

### Exercise 27: LOH Compaction Mode
**Question:** Enable LOH compaction and trigger a full collection after a large allocation spike.

<details>
<summary>Answer</summary>

```csharp
GCSettings.LargeObjectHeapCompactionMode =
    GCLargeObjectHeapCompactionMode.CompactOnce;

// Trigger a full GC to compact LOH once
GC.Collect(2, GCCollectionMode.Forced, blocking: true, compacting: true);
```

Use sparingly during low-traffic windows; compaction can introduce pauses.
</details>

---

### Exercise 28: MemoryPool<T> for Reusable Buffers
**Question:** Allocate a buffer from MemoryPool and return it safely.

<details>
<summary>Answer</summary>

```csharp
using IMemoryOwner<byte> owner = MemoryPool<byte>.Shared.Rent(4096);
Memory<byte> buffer = owner.Memory;

// Use buffer for parsing or IO
Process(buffer.Span);
```

MemoryPool provides reusable buffers without per-request allocations and works well with pipelines.
</details>

---

### Exercise 29: CollectionsMarshal.AsSpan for List Hot Paths
**Question:** Update a List<T> in place without enumerator allocations.

<details>
<summary>Answer</summary>

```csharp
var prices = new List<decimal> { 1.2m, 1.3m, 1.4m };
Span<decimal> span = CollectionsMarshal.AsSpan(prices);

for (int i = 0; i < span.Length; i++)
{
    span[i] *= 1.01m;
}
```

Use only when you control the list and understand the safety constraints.
</details>

---

### Exercise 30: Avoid Closure Allocations
**Question:** Refactor a lambda to avoid closure allocations.

<details>
<summary>Answer</summary>

```csharp
// Allocates a closure for threshold
int threshold = 100;
var hot = trades.Where(t => t.Size > threshold);

// No closure allocation
var hotStatic = trades.Where(static t => t.Size > 100);
```

Static lambdas prevent capturing locals and reduce allocations in hot paths.
</details>

---

### Exercise 31: Replace LINQ with Loops in Hot Paths
**Question:** Convert a LINQ aggregation to a loop and explain why it helps.

<details>
<summary>Answer</summary>

```csharp
// LINQ - allocates enumerator/delegates
var total = prices.Where(p => p > 0).Sum();

// Loop - allocation free
decimal totalLoop = 0;
foreach (var p in prices)
{
    if (p > 0)
        totalLoop += p;
}
```

LINQ is fine for most code, but loops avoid delegate/enumerator allocations in critical paths.
</details>

---

### Exercise 32: ArrayPool<T> with Clear and Return
**Question:** Rent a buffer, use it, and return it safely with clearing.

<details>
<summary>Answer</summary>

```csharp
var pool = ArrayPool<byte>.Shared;
byte[] buffer = pool.Rent(8192);
try
{
    Fill(buffer);
    Write(buffer);
}
finally
{
    pool.Return(buffer, clearArray: true);
}
```

Clearing prevents data leaks when buffers may contain sensitive data.
</details>

---

### Exercise 33: TryStartNoGCRegion for Low-Latency Windows
**Question:** Demonstrate a short no-GC region during a critical burst.

<details>
<summary>Answer</summary>

```csharp
if (GC.TryStartNoGCRegion(256 * 1024 * 1024))
{
    try
    {
        ProcessCriticalBurst();
    }
    finally
    {
        GC.EndNoGCRegion();
    }
}
```

Use only when you can bound allocations; otherwise it throws and can harm latency.
</details>

---

### Exercise 34: ReadOnlySpan<char> Parsing Without Substring
**Question:** Parse a symbol and price from a CSV line without allocations.

<details>
<summary>Answer</summary>

```csharp
ReadOnlySpan<char> line = "EURUSD,1.07421".AsSpan();
int comma = line.IndexOf(',');
ReadOnlySpan<char> symbol = line[..comma];
ReadOnlySpan<char> priceSpan = line[(comma + 1)..];

decimal price = decimal.Parse(priceSpan, CultureInfo.InvariantCulture);
```

Using spans avoids allocating new strings for slices.
</details>

---

### Exercise 35: Monitor Allocation Rate
**Question:** Use dotnet-counters to observe allocation rate while a test runs.

<details>
<summary>Answer</summary>

```bash
dotnet-counters monitor --process-id <pid> System.Runtime
```

Watch `alloc-rate` and `gc-heap-size` to confirm allocation reductions.
</details>

---

## Summary

This exercise set covers:
- Memory allocation patterns (Stack vs Heap)
- GC generations and strategies
- Span<T> and Memory<T> for zero-allocation code
- ValueTask vs Task for async efficiency
- Object pooling (ArrayPool, ObjectPool)
- String performance optimizations
- Struct vs Class performance
- ref, in, out parameters
- stackalloc for stack allocation
- BenchmarkDotNet for accurate measurements
- Memory leak detection
- LOH management
- IDisposable pattern
- GC configuration and tuning

Each exercise includes practical examples, benchmarks, and best practices for writing high-performance C# code.
