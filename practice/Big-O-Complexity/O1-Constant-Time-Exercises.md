# O(1) - Constant Time Complexity Exercises

## Overview

O(1) means the operation takes the same amount of time regardless of input size. The algorithm accesses a fixed number of memory locations or performs a fixed number of operations.

**Key Characteristics:**
- Runtime doesn't depend on input size
- May still have different constant factors (O(1) can be slower than another O(1))
- Most efficient complexity class
- Common in: array access, hash table operations, arithmetic

## Exercise 1: Array Element Access

**Problem**: Access an element at a specific index in an array.

```csharp
// Time: O(1) - Direct memory address calculation
// Space: O(1) - No additional space needed
public int GetElementAtIndex(int[] arr, int index)
{
    return arr[index];
}
```

**Analysis:**
- Arrays store elements in contiguous memory
- Address = base_address + (index × element_size)
- Single calculation, regardless of array size
- **Best/Average/Worst**: All O(1)

**Interview Insight**: This is the foundation of why arrays are so fast for random access!

---

## Exercise 2: Dictionary Lookup

**Problem**: Retrieve a value from a dictionary by key.

```csharp
// Time: O(1) average case - Hash table lookup
// Space: O(1) - No additional space needed
public string GetValueByKey(Dictionary<int, string> dict, int key)
{
    if (dict.ContainsKey(key))
        return dict[key];
    return null;
}
```

**Analysis:**
- **Average Case**: O(1) - Direct hash bucket access
- **Worst Case**: O(n) - All keys hash to same bucket (rare with good hash function)
- Hash function computes bucket index in constant time
- Most real-world scenarios: O(1)

**Complexity Breakdown:**
```csharp
// Both operations are O(1) average:
dict.ContainsKey(key);  // O(1) average
dict[key];              // O(1) average
dict.TryGetValue(key, out var value);  // O(1) average - preferred approach
```

**Gotcha**: While average is O(1), worst case is O(n) due to hash collisions!

---

## Exercise 3: Stack Push and Pop

**Problem**: Implement stack operations.

```csharp
// Time: O(1) for both operations
// Space: O(1) per operation
public class StackOperations
{
    private Stack<int> stack = new Stack<int>();

    // O(1) - Add to top of stack
    public void Push(int value)
    {
        stack.Push(value);
    }

    // O(1) - Remove from top of stack
    public int Pop()
    {
        return stack.Pop();
    }

    // O(1) - View top without removing
    public int Peek()
    {
        return stack.Peek();
    }
}
```

**Analysis:**
- Stack maintains pointer to top element
- Push: increment pointer, store value
- Pop: retrieve value, decrement pointer
- No iteration needed
- **Best/Average/Worst**: All O(1)

---

## Exercise 4: Queue Enqueue and Dequeue

**Problem**: Implement queue operations.

```csharp
// Time: O(1) for both operations
// Space: O(1) per operation
public class QueueOperations
{
    private Queue<int> queue = new Queue<int>();

    // O(1) - Add to end of queue
    public void Enqueue(int value)
    {
        queue.Enqueue(value);
    }

    // O(1) - Remove from front of queue
    public int Dequeue()
    {
        return queue.Dequeue();
    }

    // O(1) - View front without removing
    public int Peek()
    {
        return queue.Peek();
    }
}
```

**Analysis:**
- Queue maintains pointers to front and rear
- Enqueue: add at rear, update rear pointer
- Dequeue: remove from front, update front pointer
- **Implementation Detail**: C# Queue<T> uses circular buffer

---

## Exercise 5: Get First or Last Element

**Problem**: Retrieve first or last element from a list.

```csharp
// Time: O(1) - Direct access by index
// Space: O(1) - No additional space
public class FirstLastAccess
{
    public int GetFirst(List<int> list)
    {
        return list[0];  // O(1)
    }

    public int GetLast(List<int> list)
    {
        return list[list.Count - 1];  // O(1)
    }

    // LINQ alternatives (also O(1) for List<T>)
    public int GetFirstLinq(List<int> list)
    {
        return list.First();  // O(1) for IList<T>
    }

    public int GetLastLinq(List<int> list)
    {
        return list.Last();  // O(1) for IList<T>
    }
}
```

**Gotcha**: `First()` on `IEnumerable<T>` that's not a list could be O(n)!

---

## Exercise 6: HashSet Add and Contains

**Problem**: Add elements and check membership in a HashSet.

```csharp
// Time: O(1) average for both operations
// Space: O(1) per operation
public class HashSetOperations
{
    private HashSet<int> set = new HashSet<int>();

    // O(1) average - Add element
    public bool Add(int value)
    {
        return set.Add(value);
    }

    // O(1) average - Check if element exists
    public bool Contains(int value)
    {
        return set.Contains(value);
    }

    // O(1) average - Remove element
    public bool Remove(int value)
    {
        return set.Remove(value);
    }
}
```

**Analysis:**
- Hash-based storage like Dictionary
- **Average**: O(1) for add, contains, remove
- **Worst**: O(n) with many hash collisions

---

## Exercise 7: LinkedList Add First/Last

**Problem**: Add elements to the beginning or end of a linked list.

```csharp
// Time: O(1) - Direct pointer manipulation
// Space: O(1) per operation
public class LinkedListOperations
{
    private LinkedList<int> list = new LinkedList<int>();

    // O(1) - Add at beginning
    public void AddFirst(int value)
    {
        list.AddFirst(value);
    }

    // O(1) - Add at end
    public void AddLast(int value)
    {
        list.AddLast(value);
    }

    // O(1) - Remove first
    public void RemoveFirst()
    {
        list.RemoveFirst();
    }

    // O(1) - Remove last
    public void RemoveLast()
    {
        list.RemoveLast();
    }
}
```

**Analysis:**
- LinkedList maintains head and tail pointers
- Only updates pointers, no shifting
- **Compare to List<T>**: AddFirst would be O(n) for List<T> due to shifting

---

## Exercise 8: Mathematical Formula Calculation

**Problem**: Calculate sum of first n natural numbers.

```csharp
// Time: O(1) - Single formula calculation
// Space: O(1) - Only result variable
public long SumOfFirstN(int n)
{
    // Sum = n * (n + 1) / 2
    return (long)n * (n + 1) / 2;
}

// WRONG APPROACH - O(n)
public long SumOfFirstN_Slow(int n)
{
    long sum = 0;
    for (int i = 1; i <= n; i++)
    {
        sum += i;
    }
    return sum;
}
```

**Analysis:**
- Formula approach: O(1) - just arithmetic operations
- Loop approach: O(n) - must iterate through all numbers
- **Interview Insight**: Mathematical formulas can transform O(n) to O(1)!

**Other Constant Formula Examples:**
```csharp
// Arithmetic series sum: O(1)
public long ArithmeticSum(int first, int last, int count)
{
    return (long)count * (first + last) / 2;
}

// Circle area: O(1)
public double CircleArea(double radius)
{
    return Math.PI * radius * radius;
}

// Even number check: O(1)
public bool IsEven(int n)
{
    return n % 2 == 0;
}
```

---

## Exercise 9: Swap Two Variables

**Problem**: Swap two variables without using a temporary variable.

```csharp
// Time: O(1) - Fixed number of operations
// Space: O(1) - No additional space
public void Swap(ref int a, ref int b)
{
    // Method 1: XOR swap (O(1) time, O(1) space)
    a = a ^ b;
    b = a ^ b;
    a = a ^ b;
}

// More readable approach (also O(1))
public void SwapWithTemp(ref int a, ref int b)
{
    int temp = a;
    a = b;
    b = temp;
}

// C# tuple deconstruction (O(1))
public void SwapWithTuple(ref int a, ref int b)
{
    (a, b) = (b, a);
}
```

**Analysis:**
- All approaches: fixed number of operations
- No loops or recursion
- **Best/Average/Worst**: All O(1)

---

## Exercise 10: Check if Number is Power of Two

**Problem**: Determine if a number is a power of 2.

```csharp
// Time: O(1) - Single bitwise operation
// Space: O(1) - No additional space
public bool IsPowerOfTwo(int n)
{
    return n > 0 && (n & (n - 1)) == 0;
}

// SLOW approach - O(log n)
public bool IsPowerOfTwo_Slow(int n)
{
    if (n <= 0) return false;
    while (n > 1)
    {
        if (n % 2 != 0) return false;
        n /= 2;
    }
    return true;
}
```

**Analysis:**
- Bitwise trick: power of 2 has only one bit set
- n & (n-1) clears the lowest bit
- If result is 0, only one bit was set
- **Optimization**: Bit manipulation often reduces complexity!

**How it works:**
```
8:    1000
8-1:  0111
&:    0000  ✓ Power of 2

6:    0110
6-1:  0101
&:    0100  ✗ Not power of 2
```

---

## Exercise 11: Get Middle Element with Two Pointers

**Problem**: When you already know the length, find the middle element.

```csharp
// Time: O(1) - Direct calculation and access
// Space: O(1) - No additional space
public int GetMiddleElement(int[] arr)
{
    int middleIndex = arr.Length / 2;
    return arr[middleIndex];
}

// For LinkedList - NOT O(1), this is O(n)
public int GetMiddleElement_LinkedList(LinkedList<int> list)
{
    // Must traverse - this is O(n)!
    int count = list.Count;  // O(1) in C#, but conceptually O(n) operation
    int middleIndex = count / 2;
    var current = list.First;
    for (int i = 0; i < middleIndex; i++)
    {
        current = current.Next;
    }
    return current.Value;
}
```

**Gotcha**: LinkedList.Count is O(1) in C#, but getting the middle element is still O(n) because you must traverse!

---

## Exercise 12: Insert at End of List (Amortized)

**Problem**: Understand amortized O(1) complexity.

```csharp
// Time: O(1) amortized - Occasionally O(n) when resizing
// Space: O(1) amortized
public void AddToEndOfList(List<int> list, int value)
{
    list.Add(value);
}
```

**Amortized Analysis:**
- **Most operations**: O(1) - just insert
- **Occasional resize**: O(n) - copy to new array (capacity doubles)
- **Frequency**: resize happens at 1, 2, 4, 8, 16, 32... elements
- **Over n operations**: Total work is O(n), so O(1) per operation

**Breakdown of First 9 Insertions:**
```
Insert 1: resize to cap 4    → 1 copy   (O(n) where n=1)
Insert 2: no resize          → 0 copies (O(1))
Insert 3: no resize          → 0 copies (O(1))
Insert 4: no resize          → 0 copies (O(1))
Insert 5: resize to cap 8    → 4 copies (O(n) where n=4)
Insert 6: no resize          → 0 copies (O(1))
Insert 7: no resize          → 0 copies (O(1))
Insert 8: no resize          → 0 copies (O(1))
Insert 9: resize to cap 16   → 8 copies (O(n) where n=8)

Total copies: 1 + 4 + 8 = 13
Total inserts: 9
Average: ~1.4 copies per insert → O(1) amortized
```

---

## Exercise 13: Dictionary Add (Amortized)

**Problem**: Understand dictionary insertion complexity.

```csharp
// Time: O(1) amortized - Occasionally O(n) during rehashing
// Space: O(1) amortized per element
public void AddToDictionary(Dictionary<int, string> dict, int key, string value)
{
    dict[key] = value;
}
```

**Amortized Analysis:**
- **Normal case**: O(1) - hash, find bucket, insert
- **Rare case**: O(n) - rehash all elements when load factor exceeded
- **Load factor**: typically rehashes at 75% full
- **Amortized**: O(1) over many operations

---

## Exercise 14: Set Bit at Position

**Problem**: Set a specific bit in an integer.

```csharp
// Time: O(1) - Single bitwise OR operation
// Space: O(1) - No additional space
public int SetBit(int number, int position)
{
    return number | (1 << position);
}

// Clear bit at position: O(1)
public int ClearBit(int number, int position)
{
    return number & ~(1 << position);
}

// Toggle bit at position: O(1)
public int ToggleBit(int number, int position)
{
    return number ^ (1 << position);
}

// Check if bit is set: O(1)
public bool IsBitSet(int number, int position)
{
    return (number & (1 << position)) != 0;
}
```

**Analysis:**
- All bit operations: constant time
- No loops or recursion
- Works on fixed-size integers (32 or 64 bits)

---

## Exercise 15: Min/Max of Two Numbers

**Problem**: Find minimum or maximum of two numbers.

```csharp
// Time: O(1) - Single comparison
// Space: O(1) - No additional space
public int Min(int a, int b)
{
    return a < b ? a : b;
}

public int Max(int a, int b)
{
    return a > b ? a : b;
}

// Bitwise trick without branching (also O(1))
public int MinBitwise(int a, int b)
{
    return b ^ ((a ^ b) & -(a < b ? 1 : 0));
}
```

**Note**: `Math.Min()` and `Math.Max()` are also O(1)

---

## Exercise 16: Count Property Access

**Problem**: Get the count of elements in a collection.

```csharp
// Time: O(1) for most C# collections
// Space: O(1) - No additional space
public class CountOperations
{
    // O(1) - Arrays have Length property
    public int GetArrayLength(int[] arr)
    {
        return arr.Length;
    }

    // O(1) - List<T> maintains count
    public int GetListCount(List<int> list)
    {
        return list.Count;
    }

    // O(1) - Dictionary maintains count
    public int GetDictionaryCount(Dictionary<int, string> dict)
    {
        return dict.Count;
    }

    // O(1) - HashSet maintains count
    public int GetHashSetCount(HashSet<int> set)
    {
        return set.Count;
    }

    // O(1) - LinkedList maintains count
    public int GetLinkedListCount(LinkedList<int> list)
    {
        return list.Count;  // C# caches this!
    }
}
```

**Gotcha with IEnumerable:**
```csharp
// O(n) - Must enumerate to count!
public int GetEnumerableCount(IEnumerable<int> enumerable)
{
    return enumerable.Count();  // O(n) unless it's ICollection
}

// O(1) or early exit - check if any elements
public bool HasElements(IEnumerable<int> enumerable)
{
    return enumerable.Any();  // O(1) for collections, can exit early for streams
}
```

---

## Exercise 17: Null Coalescing and Null Check

**Problem**: Check for null and provide default.

```csharp
// Time: O(1) - Single comparison
// Space: O(1) - No additional space
public string GetValueOrDefault(string input)
{
    // Null coalescing: O(1)
    return input ?? "default";
}

public string GetValueOrDefault2(string input, string defaultValue)
{
    // Ternary operator: O(1)
    return input != null ? input : defaultValue;
}

// Null conditional: O(1)
public int? GetLength(string input)
{
    return input?.Length;
}
```

**Analysis:**
- All null checks: single comparison
- No iteration or recursion
- **Best/Average/Worst**: All O(1)

---

## Exercise 18: StringBuilder Append (Amortized)

**Problem**: Append to a StringBuilder.

```csharp
// Time: O(1) amortized - Occasionally O(n) when expanding
// Space: O(1) amortized per character
public void AppendToStringBuilder(StringBuilder sb, string value)
{
    sb.Append(value);
}
```

**Why StringBuilder is Better than String Concatenation:**
```csharp
// O(n²) - Each concatenation creates new string
string result = "";
for (int i = 0; i < n; i++)
{
    result += "a";  // O(i) at iteration i, total O(n²)
}

// O(n) - StringBuilder reuses buffer
var sb = new StringBuilder();
for (int i = 0; i < n; i++)
{
    sb.Append("a");  // O(1) amortized
}
string result = sb.ToString();  // O(n) final conversion
```

**Amortized Analysis:**
- StringBuilder doubles capacity when full
- Similar to List<T> growth pattern
- Individual append: O(1) amortized

---

## Exercise 19: Access Nested Object Property

**Problem**: Access a property of an object.

```csharp
// Time: O(1) - Direct memory access
// Space: O(1) - No additional space
public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
    public Address Address { get; set; }
}

public class Address
{
    public string Street { get; set; }
    public string City { get; set; }
}

public string GetPersonCity(Person person)
{
    // Each property access is O(1)
    return person?.Address?.City;  // O(1)
}
```

**Analysis:**
- Property access: direct memory offset
- Multiple property accesses: still O(1)
- Chain length doesn't depend on data size

---

## Exercise 20: Random Number Generation

**Problem**: Generate a random number.

```csharp
// Time: O(1) - Fixed number of operations
// Space: O(1) - No additional space
public int GenerateRandomNumber(Random random, int min, int max)
{
    return random.Next(min, max);
}

// Generate random from array: O(1)
public T GetRandomElement<T>(T[] array, Random random)
{
    int index = random.Next(array.Length);
    return array[index];
}
```

**Analysis:**
- Random.Next(): constant time operation
- Array access: O(1)
- Combined: still O(1)

---

## Exercise 21: Absolute Value

**Problem**: Get absolute value of a number.

```csharp
// Time: O(1) - Single comparison and operation
// Space: O(1) - No additional space
public int Abs(int n)
{
    return n < 0 ? -n : n;
}

// Using Math.Abs (also O(1))
public int AbsMath(int n)
{
    return Math.Abs(n);
}

// Bitwise trick (O(1), no branching)
public int AbsBitwise(int n)
{
    int mask = n >> 31;  // All 1s if negative, all 0s if positive
    return (n + mask) ^ mask;
}
```

---

## Exercise 22: Check if List is Empty

**Problem**: Determine if a collection has no elements.

```csharp
// Time: O(1) - Check count property
// Space: O(1) - No additional space
public bool IsEmpty<T>(List<T> list)
{
    return list.Count == 0;
}

// For IEnumerable: prefer Any() for safety
public bool IsEmptyEnumerable<T>(IEnumerable<T> enumerable)
{
    return !enumerable.Any();  // O(1) for collections, early exit for streams
}

// AVOID Count() on IEnumerable
public bool IsEmptyWrong<T>(IEnumerable<T> enumerable)
{
    return enumerable.Count() == 0;  // Could be O(n) if not ICollection!
}
```

**Best Practice:**
- For known collections (List, Array): use `Count == 0` or `Length == 0`
- For IEnumerable: use `Any()` (with `!` for checking empty)

---

## Exercise 23: Update Array Element

**Problem**: Modify an array element at a specific index.

```csharp
// Time: O(1) - Direct memory write
// Space: O(1) - No additional space
public void UpdateElement(int[] arr, int index, int newValue)
{
    arr[index] = newValue;
}

// Update multiple known positions: still O(1)
public void UpdateFirstAndLast(int[] arr, int firstValue, int lastValue)
{
    arr[0] = firstValue;              // O(1)
    arr[arr.Length - 1] = lastValue;  // O(1)
    // Total: O(1) - fixed number of operations
}
```

**Interview Insight**: "O(1) with 2 operations is still O(1) - we drop constants!"

---

## Exercise 24: Circular Buffer Index Calculation

**Problem**: Calculate next position in a circular buffer.

```csharp
// Time: O(1) - Modulo operation
// Space: O(1) - No additional space
public class CircularBuffer
{
    private int[] buffer;
    private int head;
    private int tail;
    private int capacity;

    public CircularBuffer(int size)
    {
        buffer = new int[size];
        capacity = size;
        head = 0;
        tail = 0;
    }

    // O(1) - Calculate next position
    private int NextPosition(int position)
    {
        return (position + 1) % capacity;
    }

    // O(1) - Add element
    public void Enqueue(int value)
    {
        buffer[tail] = value;
        tail = NextPosition(tail);
    }

    // O(1) - Remove element
    public int Dequeue()
    {
        int value = buffer[head];
        head = NextPosition(head);
        return value;
    }
}
```

**Analysis:**
- Modulo operation: O(1)
- Index calculation: O(1)
- No loops needed for wraparound

---

## Exercise 25: When O(1) Operations Aren't Actually O(1)

**Problem**: Identify hidden complexity in seemingly constant operations.

```csharp
public class HiddenComplexity
{
    // Looks O(1), but string comparison is O(m) where m = string length
    public bool CompareStrings(string a, string b)
    {
        return a == b;  // O(m) not O(1)!
    }

    // Looks O(1), but array copy is O(n)
    public int[] CloneArray(int[] arr)
    {
        return (int[])arr.Clone();  // O(n) not O(1)!
    }

    // Dictionary lookup is O(1) average, but key comparison might not be
    public bool DictionaryLookup(Dictionary<string, int> dict, string key)
    {
        return dict.ContainsKey(key);  // O(1) + O(m) for string hashing
    }

    // LINQ Count() on IEnumerable - could be O(n)!
    public int CountEnumerable(IEnumerable<int> items)
    {
        return items.Count();  // O(n) if not ICollection!
    }

    // HashSet with custom object - O(1) assuming good GetHashCode
    public class CustomObject
    {
        public string Name { get; set; }

        // BAD: O(n) hash code calculation
        public override int GetHashCode()
        {
            int hash = 0;
            foreach (char c in Name)  // O(n) operation!
            {
                hash = hash * 31 + c;
            }
            return hash;
        }

        // BETTER: Use string's O(n) cached hash
        public override int GetHashCodeBetter()
        {
            return Name?.GetHashCode() ?? 0;  // String caches hash
        }
    }
}
```

**Key Takeaways:**
1. **String operations**: Often O(m) where m = string length
2. **Collection copying**: Always O(n) where n = collection size
3. **LINQ on IEnumerable**: May enumerate entire sequence
4. **Custom hash codes**: Should be truly O(1), not iterate over data
5. **Object comparison**: Can be O(n) for complex objects

---

## Common Interview Questions

### Q1: "Is accessing a C# List<T> by index always O(1)?"
**Answer**: Yes, List<T> is backed by an array, so index access is O(1). However, operations like Insert(0, item) or RemoveAt(0) are O(n) because elements must shift.

### Q2: "Why is Dictionary lookup O(1) average but O(n) worst case?"
**Answer**: Dictionaries use hash tables. With a good hash function, items distribute evenly across buckets (O(1) lookup). With hash collisions, all items might end up in one bucket, requiring linear search (O(n)). In practice, modern implementations use good hash functions making O(n) extremely rare.

### Q3: "Is StringBuilder.Append() truly O(1)?"
**Answer**: It's O(1) amortized. Most appends are O(1), but when the internal buffer is full, it must resize (O(n) to copy existing characters). Over many operations, the average is O(1) per append.

### Q4: "Can mathematical formulas always convert O(n) to O(1)?"
**Answer**: Only for specific problems with closed-form solutions. Sum of first n numbers has formula n*(n+1)/2 (O(1)), but finding the nth Fibonacci number doesn't have a simple O(1) integer formula.

### Q5: "What's the difference between O(1) and constant time?"
**Answer**: They're the same. O(1) means constant time - the operation takes the same amount of time regardless of input size. However, one O(1) operation can still be slower than another O(1) operation (different constants).

---

## Practice Tips

1. **Recognize True O(1)**: Direct array access, hash table operations with good hash functions, arithmetic operations

2. **Amortized O(1)**: List.Add(), StringBuilder.Append(), Dictionary.Add()

3. **Hidden Complexity**: String operations, collection copying, LINQ on IEnumerable

4. **Interview Strategy**:
   - Always clarify data structure (array vs linked list changes complexity)
   - State assumptions about hash function quality
   - Mention amortized vs worst-case when relevant

5. **Optimization Mindset**: Look for opportunities to use formulas, precomputation, or better data structures to achieve O(1)

---

## Summary

O(1) operations are the gold standard of efficiency. Key points:

- **True O(1)**: Array access, hash operations, arithmetic
- **Amortized O(1)**: Dynamic array growth, hash table resizing
- **Gotchas**: String operations, hidden iterations, LINQ
- **In Interviews**: Be precise about average vs worst case, identify hidden complexity

**Next**: Move on to [OLogN-Logarithmic-Time-Exercises.md](./OLogN-Logarithmic-Time-Exercises.md) to learn about O(log n) complexity!
