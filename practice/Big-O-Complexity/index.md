# Big-O Complexity - Complete Guide

## Overview

Big-O notation describes the upper bound of algorithm complexity, expressing how runtime or space requirements grow as input size increases. It helps us analyze and compare algorithm efficiency.

## Why Big-O Matters in Interviews

- **Performance Analysis**: Demonstrates ability to write efficient code
- **Scalability**: Shows understanding of how code performs with large datasets
- **Trade-offs**: Ability to balance time vs. space complexity
- **Problem Solving**: Choose the right data structure and algorithm

## Common Complexity Classes

### Quick Reference Chart

| Notation | Name | Example Operations | Growth Rate |
|----------|------|-------------------|-------------|
| O(1) | Constant | Array access, Dictionary lookup, Stack push/pop | Best |
| O(log n) | Logarithmic | Binary search, Balanced tree operations | Excellent |
| O(n) | Linear | Array iteration, Linear search | Good |
| O(n log n) | Linearithmic | Merge sort, Quick sort (average), Heap sort | Fair |
| O(n²) | Quadratic | Nested loops, Bubble sort, Selection sort | Poor |
| O(n³) | Cubic | Triple nested loops, Matrix multiplication | Very Poor |
| O(2ⁿ) | Exponential | Recursive Fibonacci, Power set generation | Terrible |
| O(n!) | Factorial | Permutation generation, Traveling salesman (brute force) | Worst |

### Visual Comparison (n = 100)

```
O(1)      = 1 operation
O(log n)  = ~7 operations
O(n)      = 100 operations
O(n log n)= ~700 operations
O(n²)     = 10,000 operations
O(2ⁿ)     = 1,267,650,600,228,229,401,496,703,205,376 operations
```

## Complexity Analysis Rules

### 1. Drop Constants
```csharp
// O(2n) → O(n)
for (int i = 0; i < n; i++) { /* ... */ }
for (int i = 0; i < n; i++) { /* ... */ }
```

### 2. Drop Non-Dominant Terms
```csharp
// O(n² + n) → O(n²)
// O(n + log n) → O(n)
// O(5*2ⁿ + 1000n¹⁰⁰) → O(2ⁿ)
```

### 3. Consider All Variables
```csharp
// O(a + b) - two different inputs
void Process(int[] array1, int[] array2)
{
    foreach (var item in array1) { /* ... */ }  // O(a)
    foreach (var item in array2) { /* ... */ }  // O(b)
}
```

### 4. Different Steps Add or Multiply

**Sequential Steps Add:**
```csharp
DoStepA();  // O(a)
DoStepB();  // O(b)
// Total: O(a + b)
```

**Nested Steps Multiply:**
```csharp
foreach (var a in arrayA)  // O(a)
{
    foreach (var b in arrayB)  // O(b)
    {
        // ...
    }
}
// Total: O(a * b)
```

## Best, Average, and Worst Case

### Example: Quick Sort
- **Best Case**: O(n log n) - perfectly balanced partitions
- **Average Case**: O(n log n) - random pivot selection
- **Worst Case**: O(n²) - already sorted with bad pivot choice

### Example: Hash Table Lookup
- **Best/Average Case**: O(1) - good hash function, few collisions
- **Worst Case**: O(n) - all items hash to same bucket

## Common C# Data Structure Complexities

### Arrays / Lists

| Operation | Array | List<T> | Notes |
|-----------|-------|---------|-------|
| Access by index | O(1) | O(1) | Direct memory access |
| Search (unsorted) | O(n) | O(n) | Must check each element |
| Search (sorted) | O(log n) | O(log n) | Binary search possible |
| Insert at end | N/A | O(1) amortized | May need resize |
| Insert at position | N/A | O(n) | Must shift elements |
| Delete | N/A | O(n) | Must shift elements |

### Dictionary<TKey, TValue> / HashSet<T>

| Operation | Time Complexity | Notes |
|-----------|----------------|-------|
| Add | O(1) average | O(n) worst case (rehash) |
| Remove | O(1) average | O(n) worst case (collisions) |
| Lookup | O(1) average | O(n) worst case (collisions) |
| Contains | O(1) average | O(n) worst case (collisions) |

### SortedDictionary<TKey, TValue> / SortedSet<T>

| Operation | Time Complexity | Notes |
|-----------|----------------|-------|
| Add | O(log n) | Balanced tree structure |
| Remove | O(log n) | Rebalancing required |
| Lookup | O(log n) | Binary search in tree |
| Min/Max | O(log n) | Tree traversal |

### Stack<T> / Queue<T>

| Operation | Stack<T> | Queue<T> | Notes |
|-----------|----------|----------|-------|
| Push/Enqueue | O(1) | O(1) | Add to end |
| Pop/Dequeue | O(1) | O(1) | Remove from end/front |
| Peek | O(1) | O(1) | View without removing |

### LinkedList<T>

| Operation | Time Complexity | Notes |
|-----------|----------------|-------|
| Add First/Last | O(1) | Direct pointer access |
| Remove First/Last | O(1) | Direct pointer access |
| Insert After Node | O(1) | If you have the node |
| Search | O(n) | Must traverse |
| Access by index | O(n) | Must traverse |

## Space Complexity

Space complexity measures memory usage as input grows.

### Categories

1. **O(1) - Constant Space**: Fixed number of variables
2. **O(n) - Linear Space**: Space grows with input (arrays, lists)
3. **O(log n) - Logarithmic Space**: Recursion depth in divide-and-conquer
4. **O(n²) - Quadratic Space**: 2D arrays, adjacency matrices

### Example Analysis

```csharp
// Space: O(1) - only using a few variables
int Sum(int[] arr)
{
    int total = 0;
    foreach (int num in arr)
        total += num;
    return total;
}

// Space: O(n) - creating new array
int[] Double(int[] arr)
{
    int[] result = new int[arr.Length];
    for (int i = 0; i < arr.Length; i++)
        result[i] = arr[i] * 2;
    return result;
}

// Space: O(log n) - recursion stack for binary search
int BinarySearch(int[] arr, int target, int left, int right)
{
    if (left > right) return -1;
    int mid = left + (right - left) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] > target) return BinarySearch(arr, target, left, mid - 1);
    return BinarySearch(arr, target, mid + 1, right);
}
```

## Amortized Analysis

Some operations have different costs at different times. Amortized analysis looks at average cost over many operations.

### Example: Dynamic Array Growth

```csharp
// List<T>.Add() is O(1) amortized
// - Most adds: O(1) - just insert
// - Occasional resize: O(n) - copy all elements
// - Over n operations: O(n) total → O(1) amortized per operation
```

## Common Pitfalls and Gotchas

### 1. Hidden Complexity in LINQ

```csharp
// Looks simple, but Count() on IEnumerable is O(n)
if (collection.Count() > 0)  // O(n)
{
    // ...
}

// Better: use Any() which is O(1) for most cases
if (collection.Any())  // O(1) for collections, early exit for IEnumerable
{
    // ...
}
```

### 2. String Concatenation in Loops

```csharp
// O(n²) - strings are immutable, each + creates new string
string result = "";
for (int i = 0; i < n; i++)
{
    result += arr[i];  // O(n) operation in O(n) loop
}

// O(n) - StringBuilder reuses buffer
var sb = new StringBuilder();
for (int i = 0; i < n; i++)
{
    sb.Append(arr[i]);  // O(1) amortized
}
string result = sb.ToString();
```

### 3. Nested Collections Lookups

```csharp
// This is O(n * m), NOT O(n)
foreach (var item1 in list1)  // O(n)
{
    if (list2.Contains(item1))  // O(m) for List, O(1) for HashSet
    {
        // ...
    }
}

// Better: convert to HashSet first if doing multiple lookups
var set2 = new HashSet<T>(list2);  // O(m)
foreach (var item1 in list1)  // O(n)
{
    if (set2.Contains(item1))  // O(1)
    {
        // ...
    }
}
// Total: O(m + n) instead of O(n * m)
```

### 4. Recursive Complexity

```csharp
// This is O(2ⁿ), NOT O(n)!
int Fibonacci(int n)
{
    if (n <= 1) return n;
    return Fibonacci(n - 1) + Fibonacci(n - 2);  // Each call makes 2 more calls
}

// With memoization: O(n)
Dictionary<int, int> memo = new Dictionary<int, int>();
int FibonacciMemo(int n)
{
    if (n <= 1) return n;
    if (memo.ContainsKey(n)) return memo[n];
    memo[n] = FibonacciMemo(n - 1) + FibonacciMemo(n - 2);
    return memo[n];
}
```

## Interview Tips

### 1. Always State Your Assumptions
```
"I'm assuming the input array is unsorted. If it were sorted,
we could use binary search for O(log n) instead of O(n)."
```

### 2. Discuss Trade-offs
```
"We could use a HashMap for O(1) lookup, which gives us O(n) time
but O(n) space. Or we could sort and use binary search for
O(n log n) time but O(1) space if we sort in-place."
```

### 3. Consider All Cases
- Best case
- Average case
- Worst case
- Time complexity
- Space complexity

### 4. Optimize Step by Step
1. Get a working solution first
2. Analyze its complexity
3. Identify bottlenecks
4. Optimize (with trade-off discussion)

## Practice Exercises by Complexity

### O(1) - Constant Time
[O1-Constant-Time-Exercises.md](./O1-Constant-Time-Exercises.md)
- Array access and updates
- Dictionary operations
- Stack/Queue operations
- Mathematical formulas

### O(log n) - Logarithmic Time
[OLogN-Logarithmic-Time-Exercises.md](./OLogN-Logarithmic-Time-Exercises.md)
- Binary search variations
- Tree operations
- Divide-and-conquer algorithms
- SortedSet/SortedDictionary operations

### O(n) - Linear Time
[ON-Linear-Time-Exercises.md](./ON-Linear-Time-Exercises.md)
- Array/List iteration
- Linear search
- Single-pass algorithms
- String processing

### O(n log n) - Linearithmic Time
[ONLogN-Linearithmic-Time-Exercises.md](./ONLogN-Linearithmic-Time-Exercises.md)
- Merge sort
- Quick sort
- Heap sort
- Efficient sorting scenarios

### O(n²) - Quadratic Time
[ON2-Quadratic-Time-Exercises.md](./ON2-Quadratic-Time-Exercises.md)
- Nested loops
- Simple sorting algorithms
- Pairwise comparisons
- Matrix operations

### Space Complexity
[Space-Complexity-Exercises.md](./Space-Complexity-Exercises.md)
- In-place vs. out-of-place algorithms
- Recursive space analysis
- Memory optimization
- Time-space trade-offs

## Additional Resources

### Books
- "Introduction to Algorithms" (CLRS)
- "Cracking the Coding Interview" by Gayle Laakmann McDowell
- "Algorithm Design Manual" by Steven Skiena

### Online Tools
- [Big-O Cheat Sheet](https://www.bigocheatsheet.com/)
- [VisuAlgo](https://visualgo.net/) - Algorithm visualizations
- [LeetCode](https://leetcode.com/) - Practice problems

### Common Interview Problem Patterns
1. **Two Pointers**: Often O(n) time, O(1) space
2. **Sliding Window**: O(n) time, O(1) or O(k) space
3. **Hash Maps**: Trade space O(n) for time O(1) lookups
4. **Binary Search**: O(log n) when data is sorted
5. **BFS/DFS**: O(V + E) for graphs
6. **Dynamic Programming**: Often O(n²) time, O(n) or O(n²) space
7. **Divide and Conquer**: Often O(n log n)

## Key Takeaways

1. **Big-O describes growth rate**, not exact runtime
2. **Drop constants and non-dominant terms**
3. **Consider both time and space** complexity
4. **Best/Average/Worst cases** can differ significantly
5. **Amortized analysis** smooths out occasional expensive operations
6. **Real-world factors** (cache locality, constants) matter too
7. **Trade-offs are everywhere** - discuss them in interviews

## Next Steps

Work through the exercises in order:
1. Start with O(1) operations to build intuition
2. Progress through O(log n), O(n), O(n log n)
3. Understand when O(n²) is necessary
4. Master space complexity analysis
5. Practice analyzing unfamiliar code

Remember: **Understanding complexity helps you write better code and ace technical interviews!**
