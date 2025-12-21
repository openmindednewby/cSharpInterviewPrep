# O(log n) - Logarithmic Time Complexity Exercises

## Overview

O(log n) means the algorithm's runtime grows logarithmically as input size increases. These algorithms typically divide the problem in half (or by some factor) at each step.

**Key Characteristics:**
- Very efficient, second only to O(1)
- Common pattern: halving the search space each iteration
- Typical of divide-and-conquer algorithms
- Log base doesn't matter (we drop constants in Big-O)

**Growth Comparison:**
```
n = 100       → log n ≈ 7 operations
n = 1,000     → log n ≈ 10 operations
n = 1,000,000 → log n ≈ 20 operations
n = 1 billion → log n ≈ 30 operations
```

## Exercise 1: Binary Search (Classic)

**Problem**: Find target value in a sorted array.

```csharp
// Time: O(log n) - Halves search space each iteration
// Space: O(1) - Only uses a few variables
public int BinarySearch(int[] arr, int target)
{
    int left = 0;
    int right = arr.Length - 1;

    while (left <= right)
    {
        int mid = left + (right - left) / 2;  // Avoid overflow

        if (arr[mid] == target)
            return mid;

        if (arr[mid] < target)
            left = mid + 1;  // Search right half
        else
            right = mid - 1;  // Search left half
    }

    return -1;  // Not found
}
```

**Analysis:**
- **Each iteration**: Eliminates half the remaining elements
- **Iterations needed**: log₂(n) where n = array length
- **Best Case**: O(1) - target is at middle
- **Average/Worst Case**: O(log n) - must keep dividing

**Why O(log n)?**
```
n = 16: 16 → 8 → 4 → 2 → 1 (4 steps, log₂(16) = 4)
n = 32: 32 → 16 → 8 → 4 → 2 → 1 (5 steps, log₂(32) = 5)
n = 64: 64 → 32 → 16 → 8 → 4 → 2 → 1 (6 steps, log₂(64) = 6)
```

**Interview Insights:**
- Only works on sorted arrays
- `mid = left + (right - left) / 2` prevents integer overflow
- C#: `Array.BinarySearch()` is built-in

---

## Exercise 2: Binary Search (Recursive)

**Problem**: Implement binary search recursively.

```csharp
// Time: O(log n) - Halves search space each call
// Space: O(log n) - Recursion stack depth
public int BinarySearchRecursive(int[] arr, int target, int left, int right)
{
    if (left > right)
        return -1;

    int mid = left + (right - left) / 2;

    if (arr[mid] == target)
        return mid;

    if (arr[mid] < target)
        return BinarySearchRecursive(arr, target, mid + 1, right);
    else
        return BinarySearchRecursive(arr, target, left, mid - 1);
}

// Wrapper method
public int BinarySearchRecursive(int[] arr, int target)
{
    return BinarySearchRecursive(arr, target, 0, arr.Length - 1);
}
```

**Analysis:**
- **Time**: O(log n) - same as iterative
- **Space**: O(log n) - recursion stack (each call adds to stack)
- **Trade-off**: Iterative version has O(1) space

**Recursion Depth:**
```
n = 1000 → max ~10 recursive calls on stack
n = 1,000,000 → max ~20 recursive calls on stack
```

---

## Exercise 3: Find First Occurrence in Sorted Array

**Problem**: Find the first occurrence of target in a sorted array with duplicates.

```csharp
// Time: O(log n) - Modified binary search
// Space: O(1) - Only uses variables
public int FindFirstOccurrence(int[] arr, int target)
{
    int left = 0;
    int right = arr.Length - 1;
    int result = -1;

    while (left <= right)
    {
        int mid = left + (right - left) / 2;

        if (arr[mid] == target)
        {
            result = mid;        // Found it, but keep searching left
            right = mid - 1;     // Continue searching in left half
        }
        else if (arr[mid] < target)
        {
            left = mid + 1;
        }
        else
        {
            right = mid - 1;
        }
    }

    return result;
}

// Find last occurrence (similar approach)
public int FindLastOccurrence(int[] arr, int target)
{
    int left = 0;
    int right = arr.Length - 1;
    int result = -1;

    while (left <= right)
    {
        int mid = left + (right - left) / 2;

        if (arr[mid] == target)
        {
            result = mid;
            left = mid + 1;      // Continue searching in right half
        }
        else if (arr[mid] < target)
        {
            left = mid + 1;
        }
        else
        {
            right = mid - 1;
        }
    }

    return result;
}
```

**Analysis:**
- Still halves search space each iteration
- Even with duplicates, O(log n) complexity
- **Use Case**: Finding range of values in sorted array

---

## Exercise 4: SortedSet Operations

**Problem**: Use C# SortedSet which has O(log n) operations.

```csharp
// All major operations are O(log n) - Red-Black Tree implementation
public class SortedSetOperations
{
    private SortedSet<int> set = new SortedSet<int>();

    // O(log n) - Insert into balanced tree
    public bool Add(int value)
    {
        return set.Add(value);
    }

    // O(log n) - Search in balanced tree
    public bool Contains(int value)
    {
        return set.Contains(value);
    }

    // O(log n) - Remove from balanced tree
    public bool Remove(int value)
    {
        return set.Remove(value);
    }

    // O(log n) - Find minimum (leftmost node)
    public int GetMin()
    {
        return set.Min;
    }

    // O(log n) - Find maximum (rightmost node)
    public int GetMax()
    {
        return set.Max;
    }

    // O(log n) - Get values in range
    public IEnumerable<int> GetRange(int min, int max)
    {
        return set.GetViewBetween(min, max);  // O(log n) to find bounds
    }
}
```

**Analysis:**
- SortedSet uses Red-Black Tree (self-balancing BST)
- Tree height: O(log n)
- All operations traverse from root to leaf: O(log n)

**Comparison:**
```
HashSet<T>:        Add/Remove/Contains: O(1) average, no ordering
SortedSet<T>:      Add/Remove/Contains: O(log n), maintains order
List<T>:           Add: O(1), Contains: O(n), no automatic sorting
```

---

## Exercise 5: SortedDictionary Operations

**Problem**: Use SortedDictionary for O(log n) operations.

```csharp
// Time: O(log n) for most operations
public class SortedDictionaryOperations
{
    private SortedDictionary<int, string> dict = new SortedDictionary<int, string>();

    // O(log n) - Insert into tree
    public void Add(int key, string value)
    {
        dict[key] = value;
    }

    // O(log n) - Search tree
    public bool ContainsKey(int key)
    {
        return dict.ContainsKey(key);
    }

    // O(log n) - Remove from tree
    public bool Remove(int key)
    {
        return dict.Remove(key);
    }

    // O(log n) - Get smallest key
    public int GetMinKey()
    {
        return dict.Keys.First();
    }

    // O(log n) - Get largest key
    public int GetMaxKey()
    {
        return dict.Keys.Last();
    }
}
```

**Comparison:**
```
Dictionary<K,V>:        O(1) average, O(n) worst, unordered
SortedDictionary<K,V>:  O(log n) guaranteed, ordered by key
```

---

## Exercise 6: Find Peak Element

**Problem**: Find a peak element in an array where peak is greater than its neighbors.

```csharp
// Time: O(log n) - Binary search approach
// Space: O(1) - Only uses variables
public int FindPeakElement(int[] arr)
{
    int left = 0;
    int right = arr.Length - 1;

    while (left < right)
    {
        int mid = left + (right - left) / 2;

        // If mid is less than next element, peak is on right
        if (arr[mid] < arr[mid + 1])
        {
            left = mid + 1;
        }
        else  // Peak is on left (including mid)
        {
            right = mid;
        }
    }

    return left;  // left == right, peak found
}
```

**Analysis:**
- Doesn't require sorted array
- Binary search on condition (slope direction)
- Guarantees finding a peak in O(log n)

**Why it works:**
- If arr[mid] < arr[mid+1], there must be a peak to the right
- If arr[mid] > arr[mid+1], there must be a peak to the left (or mid is peak)
- Eventually converges to a peak

---

## Exercise 7: Search in Rotated Sorted Array

**Problem**: Search in a sorted array that has been rotated.

```csharp
// Time: O(log n) - Modified binary search
// Space: O(1) - Only uses variables
public int SearchRotatedArray(int[] arr, int target)
{
    int left = 0;
    int right = arr.Length - 1;

    while (left <= right)
    {
        int mid = left + (right - left) / 2;

        if (arr[mid] == target)
            return mid;

        // Determine which half is sorted
        if (arr[left] <= arr[mid])  // Left half is sorted
        {
            if (target >= arr[left] && target < arr[mid])
                right = mid - 1;  // Target in left half
            else
                left = mid + 1;   // Target in right half
        }
        else  // Right half is sorted
        {
            if (target > arr[mid] && target <= arr[right])
                left = mid + 1;   // Target in right half
            else
                right = mid - 1;  // Target in left half
        }
    }

    return -1;
}
```

**Example:**
```
Array: [4, 5, 6, 7, 0, 1, 2]  (rotated at index 4)
Target: 0

Step 1: left=0, right=6, mid=3 (value=7)
        Left half [4,5,6,7] is sorted
        Target 0 not in [4,7], search right

Step 2: left=4, right=6, mid=5 (value=1)
        Right half [1,2] is sorted
        Target 0 not in [1,2], search left

Step 3: left=4, right=4, mid=4 (value=0)
        Found! Return 4
```

**Analysis:**
- Still O(log n) despite rotation
- Key insight: one half is always sorted
- Use sorted half to determine direction

---

## Exercise 8: Find Minimum in Rotated Sorted Array

**Problem**: Find the minimum element in a rotated sorted array.

```csharp
// Time: O(log n) - Binary search for rotation point
// Space: O(1) - Only uses variables
public int FindMinInRotatedArray(int[] arr)
{
    int left = 0;
    int right = arr.Length - 1;

    // If array is not rotated
    if (arr[left] < arr[right])
        return arr[left];

    while (left < right)
    {
        int mid = left + (right - left) / 2;

        // If mid element is greater than right element,
        // minimum is in right half
        if (arr[mid] > arr[right])
        {
            left = mid + 1;
        }
        else  // Minimum is in left half (including mid)
        {
            right = mid;
        }
    }

    return arr[left];
}
```

**Analysis:**
- Minimum is at the rotation point
- Binary search to find where rotation occurs
- O(log n) complexity

---

## Exercise 9: Square Root (Integer)

**Problem**: Find integer square root using binary search.

```csharp
// Time: O(log n) - Binary search on answer
// Space: O(1) - Only uses variables
public int Sqrt(int x)
{
    if (x < 2) return x;

    int left = 1;
    int right = x / 2;  // sqrt(x) can't be more than x/2 for x >= 2

    while (left <= right)
    {
        int mid = left + (right - left) / 2;
        long square = (long)mid * mid;  // Use long to avoid overflow

        if (square == x)
            return mid;
        else if (square < x)
            left = mid + 1;
        else
            right = mid - 1;
    }

    return right;  // Return floor of sqrt
}
```

**Analysis:**
- Binary search on the range [1, x/2]
- Each iteration halves the search space
- O(log n) where n is the input value

**Example:**
```
Sqrt(25):
Range [1, 12]
12² = 144 > 25, try lower
6² = 36 > 25, try lower
3² = 9 < 25, try higher
4² = 16 < 25, try higher
5² = 25 ✓ Found!
```

---

## Exercise 10: Find Insert Position

**Problem**: Find position where target should be inserted in sorted array.

```csharp
// Time: O(log n) - Binary search
// Space: O(1) - Only uses variables
public int SearchInsertPosition(int[] arr, int target)
{
    int left = 0;
    int right = arr.Length - 1;

    while (left <= right)
    {
        int mid = left + (right - left) / 2;

        if (arr[mid] == target)
            return mid;
        else if (arr[mid] < target)
            left = mid + 1;
        else
            right = mid - 1;
    }

    return left;  // Insert position
}
```

**Analysis:**
- Modified binary search
- Returns index where element should be inserted
- Maintains sorted order

**Example:**
```
Array: [1, 3, 5, 6]
Target: 4
Result: 2 (insert between 3 and 5)

Target: 7
Result: 4 (insert at end)
```

---

## Exercise 11: Power Calculation (Optimized)

**Problem**: Calculate x^n efficiently.

```csharp
// Time: O(log n) - Divide exponent by 2 each step
// Space: O(log n) - Recursion stack
public double Power(double x, int n)
{
    if (n == 0) return 1;

    // Handle negative exponents
    long N = n;
    if (N < 0)
    {
        x = 1 / x;
        N = -N;
    }

    return PowerHelper(x, N);
}

private double PowerHelper(double x, long n)
{
    if (n == 0) return 1;

    double half = PowerHelper(x, n / 2);

    if (n % 2 == 0)
        return half * half;
    else
        return half * half * x;
}

// Iterative version: O(log n) time, O(1) space
public double PowerIterative(double x, int n)
{
    if (n == 0) return 1;

    long N = n;
    if (N < 0)
    {
        x = 1 / x;
        N = -N;
    }

    double result = 1;
    double currentProduct = x;

    while (N > 0)
    {
        if (N % 2 == 1)
            result *= currentProduct;

        currentProduct *= currentProduct;
        N /= 2;
    }

    return result;
}
```

**Analysis:**
- **Naive approach**: x * x * x ... n times = O(n)
- **Optimized approach**: Uses exponentiation by squaring = O(log n)

**How it works:**
```
x^8 = x^4 * x^4
x^4 = x^2 * x^2
x^2 = x * x

Steps: 3 (log₂(8) = 3)
Instead of 8 multiplications!

x^10 = x^5 * x^5
x^5 = x^2 * x^2 * x
x^2 = x * x

Steps: 4 (⌈log₂(10)⌉ = 4)
```

---

## Exercise 12: Find Kth Smallest Element in BST

**Problem**: Find kth smallest element in a Binary Search Tree.

```csharp
public class TreeNode
{
    public int val;
    public TreeNode left;
    public TreeNode right;
}

// Time: O(log n) average for balanced BST
// Space: O(log n) for recursion stack
public int KthSmallest(TreeNode root, int k)
{
    int count = CountNodes(root.left);

    if (k <= count)
        return KthSmallest(root.left, k);
    else if (k > count + 1)
        return KthSmallest(root.right, k - count - 1);
    else
        return root.val;
}

private int CountNodes(TreeNode node)
{
    if (node == null) return 0;
    return 1 + CountNodes(node.left) + CountNodes(node.right);
}
```

**Analysis:**
- **For balanced BST**: O(log n) - goes down one path
- **For skewed BST**: O(n) - may need to traverse all
- **Best case**: Element is at root or near root
- **Space**: O(h) where h is height (log n for balanced)

---

## Exercise 13: Median of Two Sorted Arrays

**Problem**: Find median of two sorted arrays in O(log(min(m,n))).

```csharp
// Time: O(log(min(m,n))) - Binary search on smaller array
// Space: O(1) - Only uses variables
public double FindMedianSortedArrays(int[] nums1, int[] nums2)
{
    // Ensure nums1 is the smaller array
    if (nums1.Length > nums2.Length)
        return FindMedianSortedArrays(nums2, nums1);

    int m = nums1.Length;
    int n = nums2.Length;
    int left = 0;
    int right = m;

    while (left <= right)
    {
        int partition1 = (left + right) / 2;
        int partition2 = (m + n + 1) / 2 - partition1;

        int maxLeft1 = (partition1 == 0) ? int.MinValue : nums1[partition1 - 1];
        int minRight1 = (partition1 == m) ? int.MaxValue : nums1[partition1];

        int maxLeft2 = (partition2 == 0) ? int.MinValue : nums2[partition2 - 1];
        int minRight2 = (partition2 == n) ? int.MaxValue : nums2[partition2];

        if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1)
        {
            if ((m + n) % 2 == 0)
                return (Math.Max(maxLeft1, maxLeft2) + Math.Min(minRight1, minRight2)) / 2.0;
            else
                return Math.Max(maxLeft1, maxLeft2);
        }
        else if (maxLeft1 > minRight2)
            right = partition1 - 1;
        else
            left = partition1 + 1;
    }

    throw new ArgumentException("Input arrays are not sorted");
}
```

**Analysis:**
- Binary search on smaller array
- O(log(min(m,n))) complexity
- Very tricky but important interview problem

---

## Exercise 14: Finding Majority Element (Divide and Conquer)

**Problem**: Find element that appears more than n/2 times.

```csharp
// Time: O(n log n) - Divide and conquer
// Space: O(log n) - Recursion stack
public int MajorityElement(int[] nums)
{
    return MajorityElementRec(nums, 0, nums.Length - 1);
}

private int MajorityElementRec(int[] nums, int left, int right)
{
    // Base case
    if (left == right)
        return nums[left];

    // Divide
    int mid = left + (right - left) / 2;
    int leftMajority = MajorityElementRec(nums, left, mid);
    int rightMajority = MajorityElementRec(nums, mid + 1, right);

    // If same, it's the majority
    if (leftMajority == rightMajority)
        return leftMajority;

    // Count each in the range
    int leftCount = CountInRange(nums, leftMajority, left, right);
    int rightCount = CountInRange(nums, rightMajority, left, right);

    return leftCount > rightCount ? leftMajority : rightMajority;
}

private int CountInRange(int[] nums, int target, int left, int right)
{
    int count = 0;
    for (int i = left; i <= right; i++)
    {
        if (nums[i] == target)
            count++;
    }
    return count;
}
```

**Note**: This is actually O(n log n) due to counting, but demonstrates divide-and-conquer pattern. Better solution is Boyer-Moore voting (O(n)).

---

## Exercise 15: Binary Indexed Tree (Fenwick Tree) - Range Query

**Problem**: Efficiently compute prefix sums with updates.

```csharp
// Time: O(log n) for update and query
// Space: O(n) for tree array
public class BinaryIndexedTree
{
    private int[] tree;
    private int n;

    public BinaryIndexedTree(int size)
    {
        n = size;
        tree = new int[n + 1];
    }

    // O(log n) - Update value at index
    public void Update(int index, int delta)
    {
        index++;  // BIT is 1-indexed
        while (index <= n)
        {
            tree[index] += delta;
            index += index & (-index);  // Add last set bit
        }
    }

    // O(log n) - Get prefix sum from 0 to index
    public int Query(int index)
    {
        index++;  // BIT is 1-indexed
        int sum = 0;
        while (index > 0)
        {
            sum += tree[index];
            index -= index & (-index);  // Remove last set bit
        }
        return sum;
    }

    // O(log n) - Get sum in range [left, right]
    public int RangeQuery(int left, int right)
    {
        return Query(right) - (left > 0 ? Query(left - 1) : 0);
    }
}
```

**Analysis:**
- Each update/query traverses tree height: O(log n)
- Much faster than recalculating sums: O(n)
- Space: O(n) for tree

**Use Cases:**
- Range sum queries with updates
- Counting inversions
- Frequency counting

---

## Exercise 16: GCD (Greatest Common Divisor) - Euclidean Algorithm

**Problem**: Find GCD of two numbers.

```csharp
// Time: O(log(min(a,b))) - Number of divisions
// Space: O(1) - Iterative version
public int GCD(int a, int b)
{
    while (b != 0)
    {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Recursive version: O(log(min(a,b))) time, O(log(min(a,b))) space
public int GCDRecursive(int a, int b)
{
    if (b == 0) return a;
    return GCDRecursive(b, a % b);
}
```

**Why O(log n)?**
- Each step reduces the larger number by at least half
- After two iterations: b ≤ a/2
- Number of steps: O(log(min(a,b)))

**Example:**
```
GCD(48, 18):
48 % 18 = 12
18 % 12 = 6
12 % 6 = 0
Result: 6

Steps: 3 (log₂(18) ≈ 4.17)
```

---

## Exercise 17: Counting Bits

**Problem**: Count number of 1s in binary representation.

```csharp
// Time: O(log n) - Number of bits
// Space: O(1) - Only uses variables
public int CountOnes(int n)
{
    int count = 0;
    while (n != 0)
    {
        count++;
        n = n & (n - 1);  // Remove rightmost 1
    }
    return count;
}

// Alternative: O(log n)
public int CountOnesSimple(int n)
{
    int count = 0;
    while (n != 0)
    {
        count += n & 1;
        n >>= 1;
    }
    return count;
}
```

**Analysis:**
- Number of iterations = number of 1 bits
- At most log₂(n) bits in n
- O(log n) worst case

**Example:**
```
n = 13 (binary: 1101)
Has 3 ones
Iterations: 3
```

---

## Exercise 18: Binary Search on Answer

**Problem**: Find minimum capacity to ship packages within D days.

```csharp
// Time: O(n log(sum)) where sum is total weight
// Space: O(1)
public int ShipWithinDays(int[] weights, int days)
{
    int left = weights.Max();      // Min capacity (largest package)
    int right = weights.Sum();     // Max capacity (all at once)

    while (left < right)
    {
        int mid = left + (right - left) / 2;
        if (CanShip(weights, days, mid))
            right = mid;  // Try smaller capacity
        else
            left = mid + 1;  // Need larger capacity
    }

    return left;
}

private bool CanShip(int[] weights, int days, int capacity)
{
    int daysNeeded = 1;
    int currentLoad = 0;

    foreach (int weight in weights)
    {
        if (currentLoad + weight > capacity)
        {
            daysNeeded++;
            currentLoad = weight;
        }
        else
        {
            currentLoad += weight;
        }
    }

    return daysNeeded <= days;
}
```

**Analysis:**
- Binary search on the answer (capacity)
- Each validation: O(n)
- Total: O(n log(sum))

**Pattern**: When you need to find minimum/maximum value satisfying a condition, try binary search on the answer!

---

## Exercise 19: Split Array Largest Sum

**Problem**: Split array into m subarrays to minimize the largest sum.

```csharp
// Time: O(n log(sum)) - Binary search on answer
// Space: O(1)
public int SplitArray(int[] nums, int m)
{
    int left = nums.Max();   // Min possible (largest element)
    int right = nums.Sum();  // Max possible (no splits)

    while (left < right)
    {
        int mid = left + (right - left) / 2;
        if (CanSplit(nums, m, mid))
            right = mid;
        else
            left = mid + 1;
    }

    return left;
}

private bool CanSplit(int[] nums, int m, int maxSum)
{
    int subarrays = 1;
    int currentSum = 0;

    foreach (int num in nums)
    {
        if (currentSum + num > maxSum)
        {
            subarrays++;
            currentSum = num;
            if (subarrays > m)
                return false;
        }
        else
        {
            currentSum += num;
        }
    }

    return true;
}
```

**Analysis:**
- Binary search on maximum sum
- Each check: O(n)
- Total: O(n log(sum))

---

## Exercise 20: Find Duplicate Number

**Problem**: Find duplicate in array [1..n] with n+1 elements using binary search.

```csharp
// Time: O(n log n) - Binary search on value range
// Space: O(1) - Only uses variables
public int FindDuplicate(int[] nums)
{
    int left = 1;
    int right = nums.Length - 1;

    while (left < right)
    {
        int mid = left + (right - left) / 2;

        // Count how many numbers are <= mid
        int count = 0;
        foreach (int num in nums)
        {
            if (num <= mid)
                count++;
        }

        // If count > mid, duplicate is in [left, mid]
        if (count > mid)
            right = mid;
        else
            left = mid + 1;
    }

    return left;
}
```

**Analysis:**
- Binary search on value range [1, n]
- Each iteration counts: O(n)
- Total: O(n log n)

**Pigeonhole Principle**: If count of numbers ≤ mid is greater than mid, duplicate must be in [1, mid].

---

## Exercise 21: Kth Element in Two Sorted Arrays

**Problem**: Find kth smallest element from two sorted arrays.

```csharp
// Time: O(log(min(m,n))) - Binary search
// Space: O(1) - Only uses variables
public int FindKthElement(int[] nums1, int[] nums2, int k)
{
    int m = nums1.Length;
    int n = nums2.Length;

    // Ensure nums1 is smaller
    if (m > n)
        return FindKthElement(nums2, nums1, k);

    int left = Math.Max(0, k - n);
    int right = Math.Min(k, m);

    while (left <= right)
    {
        int partition1 = (left + right) / 2;
        int partition2 = k - partition1;

        int maxLeft1 = (partition1 == 0) ? int.MinValue : nums1[partition1 - 1];
        int minRight1 = (partition1 == m) ? int.MaxValue : nums1[partition1];

        int maxLeft2 = (partition2 == 0) ? int.MinValue : nums2[partition2 - 1];
        int minRight2 = (partition2 == n) ? int.MaxValue : nums2[partition2];

        if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1)
        {
            return Math.Max(maxLeft1, maxLeft2);
        }
        else if (maxLeft1 > minRight2)
        {
            right = partition1 - 1;
        }
        else
        {
            left = partition1 + 1;
        }
    }

    throw new ArgumentException();
}
```

---

## Exercise 22: Balanced Binary Tree Height

**Problem**: Calculate height of balanced binary tree.

```csharp
// Time: O(n) but demonstrates O(log n) space for balanced tree
// Space: O(log n) - Recursion depth for balanced tree
public int Height(TreeNode root)
{
    if (root == null)
        return 0;

    int leftHeight = Height(root.left);
    int rightHeight = Height(root.right);

    return 1 + Math.Max(leftHeight, rightHeight);
}
```

**Analysis:**
- **Time**: O(n) - must visit all nodes
- **Space**: O(h) where h is height
  - Balanced tree: O(log n) space
  - Skewed tree: O(n) space

---

## Common Interview Questions

### Q1: "Why is binary search O(log n) and not O(n/2)?"
**Answer**: O(n/2) is O(n) after dropping constants. Binary search halves the remaining elements *each time*, creating a geometric series: n, n/2, n/4, n/8... The number of times you can halve n before reaching 1 is log₂(n).

### Q2: "What's the difference between O(log n) and O(n) in practice?"
**Answer**: Massive! For n=1,000,000: O(log n) ≈ 20 operations vs O(n) = 1,000,000 operations. For n=1 billion: O(log n) ≈ 30 operations vs O(n) = 1 billion operations.

### Q3: "Can I use binary search if the array is unsorted?"
**Answer**: No! Binary search requires the array to be sorted. If unsorted, you'd need to sort first (O(n log n)), which defeats the purpose for a single search. For multiple searches, sorting once + binary searches can be worth it.

### Q4: "Is recursive binary search better than iterative?"
**Answer**: Iterative is generally better: same time complexity O(log n), but space is O(1) instead of O(log n) for the recursion stack. Recursive is more elegant but uses extra memory.

### Q5: "What data structures have O(log n) operations?"
**Answer**:
- Balanced BSTs (Red-Black Trees, AVL Trees)
- Heaps (insert, delete)
- SortedSet, SortedDictionary in C#
- Binary Indexed Trees (Fenwick Trees)
- Segment Trees

---

## Summary

O(log n) is excellent complexity, second only to O(1). Key points:

- **Main Pattern**: Halving the problem size each step
- **Common Uses**: Binary search, balanced trees, divide-and-conquer
- **Space Consideration**: Recursive solutions add O(log n) space
- **Interview Tip**: Always ask "Is the data sorted?" - enables binary search!

**Next**: Move on to [ON-Linear-Time-Exercises.md](./ON-Linear-Time-Exercises.md) to learn about O(n) complexity!
