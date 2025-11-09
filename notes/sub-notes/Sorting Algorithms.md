# Sorting Algorithms Interview Primer

Use this sheet to describe trade-offs quickly and reference C# examples when whiteboarding or coding live.

## Comparison Sorts

| Algorithm | Time (avg) | Time (worst) | Space | Stable | Notes |
| --------- | ---------- | ------------ | ----- | ------ | ----- |
| **Insertion Sort** | `O(n²)` | `O(n²)` | `O(1)` | ✅ | Fast on nearly sorted data; used for small partitions within hybrid sorts. |
| **Selection Sort** | `O(n²)` | `O(n²)` | `O(1)` | ❌ | Minimal swaps—works when writing to flash memory where writes are expensive. |
| **Bubble Sort** | `O(n²)` | `O(n²)` | `O(1)` | ✅ | Easy to explain; mention the flag optimization for already-sorted input. |
| **Heap Sort** | `O(n log n)` | `O(n log n)` | `O(1)` | ❌ | Deterministic `O(n log n)` with no extra space; basis for priority queues. |
| **Merge Sort** | `O(n log n)` | `O(n log n)` | `O(n)` | ✅ | Streaming-friendly; `Enumerable.OrderBy` pipelines to merge sort under the hood. |
| **Quick Sort / Introsort** | `O(n log n)` | `O(n²)` | `O(log n)` | ❌ | .NET’s `Array.Sort` uses introspective sort (quick + heap + insertion) to avoid worst-case. |

```csharp
// In-place quicksort with Hoare partitioning
public static void QuickSort(Span<int> data)
{
    if (data.Length <= 1) return;
    int i = 0, j = data.Length - 1;
    var pivot = data[data.Length / 2];
    while (i <= j)
    {
        while (data[i] < pivot) i++;
        while (data[j] > pivot) j--;
        if (i <= j)
        {
            (data[i], data[j]) = (data[j], data[i]);
            i++; j--;
        }
    }
    QuickSort(data[..(j + 1)]);
    QuickSort(data[i..]);
}
```

## Non-Comparison Sorts

| Algorithm | Complexity | Stable | When to Use |
| --------- | ---------- | ------ | ----------- |
| **Counting Sort** | `O(n + k)` | ✅ | Small integer ranges (e.g., enum buckets, ASCII chars). |
| **Radix Sort** | `O(d * (n + k))` | ✅ | Fixed-length integers/strings; combine with counting sort per digit. |
| **Bucket Sort** | `O(n)` avg | ✅ | Uniformly distributed floats (0–1); use for histograms or frequency analysis. |

```csharp
public static int[] CountingSort(int[] source, int maxValue)
{
    var counts = new int[maxValue + 1];
    foreach (var value in source)
    {
        counts[value]++;
    }

    var index = 0;
    for (var value = 0; value < counts.Length; value++)
    {
        while (counts[value]-- > 0)
        {
            source[index++] = value;
        }
    }
    return source;
}
```

## Talking Points

- **Stability** matters for multi-key sorts (e.g., primary key price, secondary key timestamp).
- **Space vs time:** Highlight why merge sort is stable but allocates, while heap sort saves memory but reorders equals.
- **Parallel sorting:** Mention `Array.ParallelSort` (planned) or PLINQ + `OrderBy` trade-offs.
- **Real-world usage:** .NET uses introspective sort for arrays/lists; SQL Server uses variations of merge/hash sorts for query plans.

Practice describing algorithm choices tailored to finance/trading data structures like order books and time-series snapshots.
