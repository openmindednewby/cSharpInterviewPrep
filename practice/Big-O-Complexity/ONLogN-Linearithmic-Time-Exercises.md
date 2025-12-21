# O(n log n) - Linearithmic Time Complexity Exercises

## Overview

O(n log n) means the algorithm's runtime grows at a rate of n × log n. This complexity is typical of efficient sorting algorithms and algorithms that combine linear work with logarithmic divisions.

**Key Characteristics:**
- More expensive than O(n) but much better than O(n²)
- Best achievable for comparison-based sorting
- Common in divide-and-conquer algorithms
- Sweet spot for many practical algorithms

**Growth Comparison:**
```
n = 100       → n log n ≈ 664 operations
n = 1,000     → n log n ≈ 9,966 operations
n = 1,000,000 → n log n ≈ 19,931,569 operations

Compare to:
O(n) = 1,000,000
O(n²) = 1,000,000,000,000
```

**Common Patterns:**
- Sorting algorithms (Merge Sort, Quick Sort, Heap Sort)
- Divide-and-conquer with linear merge
- Building balanced trees

## Exercise 1: Merge Sort

**Problem**: Sort an array using merge sort algorithm.

```csharp
// Time: O(n log n) - Divides log n times, merges n elements each level
// Space: O(n) - Temporary arrays for merging
public class MergeSort
{
    public void Sort(int[] arr)
    {
        if (arr.Length <= 1)
            return;

        MergeSortHelper(arr, 0, arr.Length - 1);
    }

    private void MergeSortHelper(int[] arr, int left, int right)
    {
        if (left >= right)
            return;

        int mid = left + (right - left) / 2;

        // Divide: O(log n) levels
        MergeSortHelper(arr, left, mid);
        MergeSortHelper(arr, mid + 1, right);

        // Conquer: O(n) work per level
        Merge(arr, left, mid, right);
    }

    private void Merge(int[] arr, int left, int mid, int right)
    {
        int n1 = mid - left + 1;
        int n2 = right - mid;

        int[] leftArr = new int[n1];
        int[] rightArr = new int[n2];

        Array.Copy(arr, left, leftArr, 0, n1);
        Array.Copy(arr, mid + 1, rightArr, 0, n2);

        int i = 0, j = 0, k = left;

        while (i < n1 && j < n2)
        {
            if (leftArr[i] <= rightArr[j])
            {
                arr[k] = leftArr[i];
                i++;
            }
            else
            {
                arr[k] = rightArr[j];
                j++;
            }
            k++;
        }

        while (i < n1)
        {
            arr[k] = leftArr[i];
            i++;
            k++;
        }

        while (j < n2)
        {
            arr[k] = rightArr[j];
            j++;
            k++;
        }
    }
}
```

**Analysis:**
- **Divide**: log n levels (halving each time)
- **Conquer**: O(n) work at each level (merging)
- **Total**: O(n log n)
- **Space**: O(n) for temporary arrays
- **Stable**: Yes (preserves relative order of equal elements)
- **Best/Average/Worst**: All O(n log n) - consistent performance!

**Why O(n log n)?**
```
Array size 8:
Level 0: [8] → 8 elements to merge
Level 1: [4][4] → 8 elements total to merge
Level 2: [2][2][2][2] → 8 elements total to merge
Level 3: [1][1][1][1][1][1][1][1] → base case

Levels: log₂(8) = 3
Work per level: 8 = n
Total: 3 × 8 = 24 = n log n
```

---

## Exercise 2: Quick Sort

**Problem**: Sort an array using quick sort algorithm.

```csharp
// Time: O(n log n) average, O(n²) worst case
// Space: O(log n) average for recursion stack
public class QuickSort
{
    public void Sort(int[] arr)
    {
        QuickSortHelper(arr, 0, arr.Length - 1);
    }

    private void QuickSortHelper(int[] arr, int low, int high)
    {
        if (low < high)
        {
            int pivotIndex = Partition(arr, low, high);

            QuickSortHelper(arr, low, pivotIndex - 1);
            QuickSortHelper(arr, pivotIndex + 1, high);
        }
    }

    private int Partition(int[] arr, int low, int high)
    {
        int pivot = arr[high];
        int i = low - 1;

        for (int j = low; j < high; j++)
        {
            if (arr[j] <= pivot)
            {
                i++;
                Swap(arr, i, j);
            }
        }

        Swap(arr, i + 1, high);
        return i + 1;
    }

    private void Swap(int[] arr, int i, int j)
    {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}

// Randomized Quick Sort (better average case)
public class RandomizedQuickSort
{
    private Random random = new Random();

    public void Sort(int[] arr)
    {
        QuickSortHelper(arr, 0, arr.Length - 1);
    }

    private void QuickSortHelper(int[] arr, int low, int high)
    {
        if (low < high)
        {
            int pivotIndex = RandomizedPartition(arr, low, high);

            QuickSortHelper(arr, low, pivotIndex - 1);
            QuickSortHelper(arr, pivotIndex + 1, high);
        }
    }

    private int RandomizedPartition(int[] arr, int low, int high)
    {
        int randomIndex = random.Next(low, high + 1);
        Swap(arr, randomIndex, high);

        return Partition(arr, low, high);
    }

    private int Partition(int[] arr, int low, int high)
    {
        int pivot = arr[high];
        int i = low - 1;

        for (int j = low; j < high; j++)
        {
            if (arr[j] <= pivot)
            {
                i++;
                Swap(arr, i, j);
            }
        }

        Swap(arr, i + 1, high);
        return i + 1;
    }

    private void Swap(int[] arr, int i, int j)
    {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}
```

**Analysis:**
- **Best Case**: O(n log n) - balanced partitions
- **Average Case**: O(n log n) - random pivots
- **Worst Case**: O(n²) - already sorted with bad pivot choice
- **Space**: O(log n) recursion stack (average)
- **Stable**: No
- **In-Place**: Yes (unlike merge sort)

**Why Worst Case is O(n²)?**
```
Sorted array [1, 2, 3, 4, 5] with last element as pivot:
Partition 1: n comparisons, pivot at end
Partition 2: n-1 comparisons, pivot at end
...
Total: n + (n-1) + (n-2) + ... + 1 = n(n+1)/2 = O(n²)
```

---

## Exercise 3: Heap Sort

**Problem**: Sort using a heap data structure.

```csharp
// Time: O(n log n) - Build heap + n deletions
// Space: O(1) - In-place (if we don't count recursion stack)
public class HeapSort
{
    public void Sort(int[] arr)
    {
        int n = arr.Length;

        // Build max heap: O(n)
        for (int i = n / 2 - 1; i >= 0; i--)
        {
            Heapify(arr, n, i);
        }

        // Extract elements from heap: O(n log n)
        for (int i = n - 1; i > 0; i--)
        {
            // Move current root to end
            Swap(arr, 0, i);

            // Heapify reduced heap: O(log n)
            Heapify(arr, i, 0);
        }
    }

    private void Heapify(int[] arr, int n, int i)
    {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;

        if (left < n && arr[left] > arr[largest])
            largest = left;

        if (right < n && arr[right] > arr[largest])
            largest = right;

        if (largest != i)
        {
            Swap(arr, i, largest);
            Heapify(arr, n, largest);
        }
    }

    private void Swap(int[] arr, int i, int j)
    {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}
```

**Analysis:**
- **Build Heap**: O(n) - surprisingly not O(n log n)!
- **Extract Max n times**: n × O(log n) = O(n log n)
- **Total**: O(n) + O(n log n) = O(n log n)
- **Best/Average/Worst**: All O(n log n) - consistent!
- **Space**: O(1) - in-place
- **Stable**: No

---

## Exercise 4: Sort Array by Frequency

**Problem**: Sort elements by their frequency of occurrence.

```csharp
// Time: O(n log n) - Due to sorting
// Space: O(n) - Dictionary and sorted list
public int[] SortByFrequency(int[] nums)
{
    // Count frequencies: O(n)
    var freqMap = new Dictionary<int, int>();
    foreach (int num in nums)
    {
        if (freqMap.ContainsKey(num))
            freqMap[num]++;
        else
            freqMap[num] = 1;
    }

    // Sort by frequency: O(n log n)
    var sorted = nums.OrderBy(x => freqMap[x])
                    .ThenBy(x => x)
                    .ToArray();

    return sorted;
}

// Alternative using custom comparator
public int[] SortByFrequencyManual(int[] nums)
{
    var freqMap = new Dictionary<int, int>();
    foreach (int num in nums)
    {
        if (freqMap.ContainsKey(num))
            freqMap[num]++;
        else
            freqMap[num] = 1;
    }

    Array.Sort(nums, (a, b) =>
    {
        int freqCompare = freqMap[a].CompareTo(freqMap[b]);
        if (freqCompare != 0)
            return freqCompare;
        return a.CompareTo(b);
    });

    return nums;
}
```

**Example:**
```
Input: [1, 1, 2, 2, 2, 3]
Frequencies: 1→2, 2→3, 3→1
Output: [3, 1, 1, 2, 2, 2]
```

**Analysis:**
- Counting: O(n)
- Sorting: O(n log n)
- Total: O(n + n log n) = O(n log n)

---

## Exercise 5: Merge K Sorted Lists

**Problem**: Merge k sorted linked lists into one sorted list.

```csharp
public class ListNode
{
    public int val;
    public ListNode next;
    public ListNode(int val = 0) { this.val = val; }
}

// Time: O(n log k) where n = total nodes, k = number of lists
// Space: O(k) - Priority queue size
public class MergeKSortedLists
{
    public ListNode MergeKLists(ListNode[] lists)
    {
        if (lists == null || lists.Length == 0)
            return null;

        // Min heap (priority queue)
        var pq = new SortedSet<(int val, int listIndex, ListNode node)>(
            Comparer<(int val, int listIndex, ListNode node)>.Create((a, b) =>
            {
                int valCompare = a.val.CompareTo(b.val);
                if (valCompare != 0) return valCompare;
                return a.listIndex.CompareTo(b.listIndex);
            })
        );

        // Add first node from each list: O(k log k)
        for (int i = 0; i < lists.Length; i++)
        {
            if (lists[i] != null)
            {
                pq.Add((lists[i].val, i, lists[i]));
            }
        }

        var dummy = new ListNode(0);
        var current = dummy;

        // Extract min and add next: O(n log k)
        while (pq.Count > 0)
        {
            var min = pq.Min;
            pq.Remove(min);

            current.next = min.node;
            current = current.next;

            if (min.node.next != null)
            {
                pq.Add((min.node.next.val, min.listIndex, min.node.next));
            }
        }

        return dummy.next;
    }
}

// Divide and Conquer approach
public class MergeKSortedListsDivideConquer
{
    public ListNode MergeKLists(ListNode[] lists)
    {
        if (lists == null || lists.Length == 0)
            return null;

        return MergeListsHelper(lists, 0, lists.Length - 1);
    }

    private ListNode MergeListsHelper(ListNode[] lists, int left, int right)
    {
        if (left == right)
            return lists[left];

        if (left > right)
            return null;

        int mid = left + (right - left) / 2;

        ListNode leftList = MergeListsHelper(lists, left, mid);
        ListNode rightList = MergeListsHelper(lists, mid + 1, right);

        return MergeTwoLists(leftList, rightList);
    }

    private ListNode MergeTwoLists(ListNode l1, ListNode l2)
    {
        var dummy = new ListNode(0);
        var current = dummy;

        while (l1 != null && l2 != null)
        {
            if (l1.val <= l2.val)
            {
                current.next = l1;
                l1 = l1.next;
            }
            else
            {
                current.next = l2;
                l2 = l2.next;
            }
            current = current.next;
        }

        current.next = l1 ?? l2;

        return dummy.next;
    }
}
```

**Analysis:**
- **Priority Queue Approach**: O(n log k) where n = total nodes
  - Each of n nodes: inserted/removed from heap of size k
  - Each operation: O(log k)
- **Divide & Conquer**: O(n log k)
  - log k levels of merging
  - O(n) work per level

---

## Exercise 6: Sort Colors (Dutch National Flag)

**Problem**: Sort array with only 0s, 1s, and 2s.

```csharp
// Time: O(n) - Single pass (not O(n log n), but worth mentioning)
// Space: O(1) - In-place
public void SortColors(int[] nums)
{
    int low = 0, mid = 0, high = nums.Length - 1;

    while (mid <= high)
    {
        if (nums[mid] == 0)
        {
            Swap(nums, low, mid);
            low++;
            mid++;
        }
        else if (nums[mid] == 1)
        {
            mid++;
        }
        else  // nums[mid] == 2
        {
            Swap(nums, mid, high);
            high--;
        }
    }
}

private void Swap(int[] nums, int i, int j)
{
    int temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
}

// Compare to sorting: O(n log n)
public void SortColorsUsingSorting(int[] nums)
{
    Array.Sort(nums);  // O(n log n) - overkill for this problem!
}
```

**Note**: This is actually O(n), not O(n log n), but demonstrates when sorting is overkill. For limited value range, counting/bucketing can be better than general sorting.

---

## Exercise 7: Meeting Rooms II

**Problem**: Find minimum number of conference rooms needed.

```csharp
public class Interval
{
    public int start;
    public int end;
    public Interval(int s, int e) { start = s; end = e; }
}

// Time: O(n log n) - Sorting intervals
// Space: O(n) - Priority queue
public int MinMeetingRooms(Interval[] intervals)
{
    if (intervals.Length == 0)
        return 0;

    // Sort by start time: O(n log n)
    Array.Sort(intervals, (a, b) => a.start.CompareTo(b.start));

    // Min heap for end times
    var endTimes = new SortedSet<(int endTime, int id)>();
    int roomId = 0;

    endTimes.Add((intervals[0].end, roomId++));

    for (int i = 1; i < intervals.Length; i++)
    {
        var earliest = endTimes.Min;

        // If earliest meeting ends before current starts, reuse room
        if (earliest.endTime <= intervals[i].start)
        {
            endTimes.Remove(earliest);
        }

        endTimes.Add((intervals[i].end, roomId++));
    }

    return endTimes.Count;
}

// Alternative: Separate start/end arrays
public int MinMeetingRoomsAlternative(Interval[] intervals)
{
    if (intervals.Length == 0)
        return 0;

    int[] starts = new int[intervals.Length];
    int[] ends = new int[intervals.Length];

    for (int i = 0; i < intervals.Length; i++)
    {
        starts[i] = intervals[i].start;
        ends[i] = intervals[i].end;
    }

    Array.Sort(starts);  // O(n log n)
    Array.Sort(ends);    // O(n log n)

    int rooms = 0;
    int maxRooms = 0;
    int endPtr = 0;

    for (int i = 0; i < starts.Length; i++)
    {
        if (starts[i] < ends[endPtr])
        {
            rooms++;
        }
        else
        {
            endPtr++;
        }
        maxRooms = Math.Max(maxRooms, rooms);
    }

    return maxRooms;
}
```

**Analysis:**
- Sorting: O(n log n)
- Processing: O(n log n) with heap operations
- Total: O(n log n)

---

## Exercise 8: Top K Frequent Elements

**Problem**: Find k most frequent elements.

```csharp
// Time: O(n log k) - Heap of size k
// Space: O(n) - Frequency map
public int[] TopKFrequent(int[] nums, int k)
{
    // Count frequencies: O(n)
    var freqMap = new Dictionary<int, int>();
    foreach (int num in nums)
    {
        if (freqMap.ContainsKey(num))
            freqMap[num]++;
        else
            freqMap[num] = 1;
    }

    // Min heap of size k: O(n log k)
    var minHeap = new SortedSet<(int freq, int num)>();

    foreach (var pair in freqMap)
    {
        minHeap.Add((pair.Value, pair.Key));

        if (minHeap.Count > k)
        {
            minHeap.Remove(minHeap.Min);
        }
    }

    return minHeap.Select(x => x.num).ToArray();
}

// Using sorting: O(n log n)
public int[] TopKFrequentSort(int[] nums, int k)
{
    var freqMap = new Dictionary<int, int>();
    foreach (int num in nums)
    {
        if (freqMap.ContainsKey(num))
            freqMap[num]++;
        else
            freqMap[num] = 1;
    }

    return freqMap.OrderByDescending(x => x.Value)
                  .Take(k)
                  .Select(x => x.Key)
                  .ToArray();
}
```

**Analysis:**
- Heap approach: O(n log k) - better when k is small
- Sort approach: O(n log n) - simpler but slower
- Bucket sort approach exists: O(n) - best but more complex

---

## Exercise 9: Largest Number

**Problem**: Arrange numbers to form the largest number.

```csharp
// Time: O(n log n) - Custom sorting
// Space: O(n) - String array
public string LargestNumber(int[] nums)
{
    // Convert to strings
    string[] strs = nums.Select(x => x.ToString()).ToArray();

    // Custom sort: O(n log n)
    Array.Sort(strs, (a, b) =>
    {
        string order1 = a + b;
        string order2 = b + a;
        return order2.CompareTo(order1);  // Descending
    });

    // Handle all zeros case
    if (strs[0] == "0")
        return "0";

    return string.Join("", strs);
}
```

**Example:**
```
Input: [3, 30, 34, 5, 9]

Comparisons:
3 vs 30: "330" vs "303" → 3 > 30
9 vs 5: "95" vs "59" → 9 > 5
9 vs 34: "934" vs "349" → 9 > 34

Output: "9534330"
```

**Analysis:**
- Custom comparator determines optimal order
- Sorting: O(n log n)
- Each comparison: O(k) where k = average number length
- Total: O(n log n × k)

---

## Exercise 10: Kth Largest Element

**Problem**: Find kth largest element in unsorted array.

```csharp
// Using sorting: O(n log n)
public int FindKthLargestSort(int[] nums, int k)
{
    Array.Sort(nums);
    return nums[nums.Length - k];
}

// Using min heap: O(n log k) - Better!
public int FindKthLargestHeap(int[] nums, int k)
{
    var minHeap = new SortedSet<(int val, int index)>();

    for (int i = 0; i < nums.Length; i++)
    {
        minHeap.Add((nums[i], i));

        if (minHeap.Count > k)
        {
            minHeap.Remove(minHeap.Min);
        }
    }

    return minHeap.Min.val;
}

// Using QuickSelect: O(n) average, O(n²) worst - Best average case!
public int FindKthLargestQuickSelect(int[] nums, int k)
{
    return QuickSelect(nums, 0, nums.Length - 1, nums.Length - k);
}

private int QuickSelect(int[] nums, int left, int right, int kSmallest)
{
    if (left == right)
        return nums[left];

    int pivotIndex = Partition(nums, left, right);

    if (kSmallest == pivotIndex)
        return nums[kSmallest];
    else if (kSmallest < pivotIndex)
        return QuickSelect(nums, left, pivotIndex - 1, kSmallest);
    else
        return QuickSelect(nums, pivotIndex + 1, right, kSmallest);
}

private int Partition(int[] nums, int left, int right)
{
    int pivot = nums[right];
    int i = left;

    for (int j = left; j < right; j++)
    {
        if (nums[j] <= pivot)
        {
            Swap(nums, i, j);
            i++;
        }
    }

    Swap(nums, i, right);
    return i;
}

private void Swap(int[] nums, int i, int j)
{
    int temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
}
```

**Comparison:**
- **Sorting**: O(n log n) time, O(1) space
- **Min Heap**: O(n log k) time, O(k) space
- **QuickSelect**: O(n) average, O(n²) worst, O(1) space

---

## Exercise 11: Sort List (Linked List)

**Problem**: Sort a linked list using merge sort.

```csharp
// Time: O(n log n) - Merge sort for linked list
// Space: O(log n) - Recursion stack
public ListNode SortList(ListNode head)
{
    if (head == null || head.next == null)
        return head;

    // Find middle using slow/fast pointers
    ListNode slow = head;
    ListNode fast = head;
    ListNode prev = null;

    while (fast != null && fast.next != null)
    {
        prev = slow;
        slow = slow.next;
        fast = fast.next.next;
    }

    // Split into two halves
    prev.next = null;

    // Recursively sort both halves
    ListNode left = SortList(head);
    ListNode right = SortList(slow);

    // Merge sorted halves
    return Merge(left, right);
}

private ListNode Merge(ListNode l1, ListNode l2)
{
    var dummy = new ListNode(0);
    var current = dummy;

    while (l1 != null && l2 != null)
    {
        if (l1.val <= l2.val)
        {
            current.next = l1;
            l1 = l1.next;
        }
        else
        {
            current.next = l2;
            l2 = l2.next;
        }
        current = current.next;
    }

    current.next = l1 ?? l2;

    return dummy.next;
}
```

**Analysis:**
- Can't use random access (no indexing in linked list)
- Merge sort is ideal for linked lists
- O(n log n) time, O(log n) space (recursion)

---

## Exercise 12: Valid Anagram Using Sorting

**Problem**: Check if two strings are anagrams using sorting.

```csharp
// Time: O(n log n) - Sorting both strings
// Space: O(n) - Character arrays
public bool IsAnagram(string s, string t)
{
    if (s.Length != t.Length)
        return false;

    char[] sArr = s.ToCharArray();
    char[] tArr = t.ToCharArray();

    Array.Sort(sArr);  // O(n log n)
    Array.Sort(tArr);  // O(n log n)

    return new string(sArr) == new string(tArr);
}
```

**Note**: This is O(n log n), but counting approach is O(n). Sometimes sorting is easier to implement even if not optimal.

---

## Exercise 13: Merge Intervals

**Problem**: Merge overlapping intervals.

```csharp
// Time: O(n log n) - Sorting intervals
// Space: O(n) - Result list
public int[][] Merge(int[][] intervals)
{
    if (intervals.Length <= 1)
        return intervals;

    // Sort by start time: O(n log n)
    Array.Sort(intervals, (a, b) => a[0].CompareTo(b[0]));

    var merged = new List<int[]>();
    int[] current = intervals[0];

    for (int i = 1; i < intervals.Length; i++)
    {
        if (intervals[i][0] <= current[1])
        {
            // Overlapping, merge
            current[1] = Math.Max(current[1], intervals[i][1]);
        }
        else
        {
            // No overlap, add current and start new
            merged.Add(current);
            current = intervals[i];
        }
    }

    merged.Add(current);

    return merged.ToArray();
}
```

**Example:**
```
Input: [[1,3],[2,6],[8,10],[15,18]]
After sort: same
Merge [1,3] and [2,6] → [1,6]
Output: [[1,6],[8,10],[15,18]]
```

**Analysis:**
- Sorting: O(n log n)
- Merging: O(n)
- Total: O(n log n)

---

## Exercise 14: Reorder Log Files

**Problem**: Reorder logs with letter-logs before digit-logs.

```csharp
// Time: O(n log n) - Sorting with custom comparator
// Space: O(n) - Storage for sorted result
public string[] ReorderLogFiles(string[] logs)
{
    return logs.OrderBy(log =>
    {
        var parts = log.Split(' ', 2);
        return char.IsDigit(parts[1][0]) ? 1 : 0;  // Digit logs last
    })
    .ThenBy(log =>
    {
        var parts = log.Split(' ', 2);
        return char.IsDigit(parts[1][0]) ? "" : parts[1];  // Sort letter logs
    })
    .ThenBy(log =>
    {
        var parts = log.Split(' ', 2);
        return char.IsDigit(parts[1][0]) ? "" : parts[0];  // Then by identifier
    })
    .ToArray();
}

// Manual sorting approach
public string[] ReorderLogFilesManual(string[] logs)
{
    Array.Sort(logs, (log1, log2) =>
    {
        var parts1 = log1.Split(' ', 2);
        var parts2 = log2.Split(' ', 2);

        bool isDigit1 = char.IsDigit(parts1[1][0]);
        bool isDigit2 = char.IsDigit(parts2[1][0]);

        // Both letter logs
        if (!isDigit1 && !isDigit2)
        {
            int comp = parts1[1].CompareTo(parts2[1]);
            if (comp != 0) return comp;
            return parts1[0].CompareTo(parts2[0]);
        }

        // One digit, one letter
        if (!isDigit1 && isDigit2) return -1;
        if (isDigit1 && !isDigit2) return 1;

        // Both digit logs (maintain original order)
        return 0;
    });

    return logs;
}
```

**Analysis:**
- Sorting with custom comparator: O(n log n)
- Each comparison: O(m) where m = average log length
- Total: O(n log n × m)

---

## Exercise 15: Binary Search on Sorted Array then Sort Result

**Problem**: Find all elements in range then sort them.

```csharp
// Time: O(log n + k log k) where k = elements in range
// Space: O(k) - Result array
public int[] FindAndSortInRange(int[] arr, int min, int max)
{
    // Binary search for range start: O(log n)
    int start = BinarySearchLeft(arr, min);
    int end = BinarySearchRight(arr, max);

    if (start > end)
        return new int[0];

    // Extract range: O(k)
    int[] range = new int[end - start + 1];
    Array.Copy(arr, start, range, 0, range.Length);

    // Sort range: O(k log k)
    Array.Sort(range);

    return range;
}

private int BinarySearchLeft(int[] arr, int target)
{
    int left = 0, right = arr.Length - 1;
    int result = arr.Length;

    while (left <= right)
    {
        int mid = left + (right - left) / 2;
        if (arr[mid] >= target)
        {
            result = mid;
            right = mid - 1;
        }
        else
        {
            left = mid + 1;
        }
    }

    return result;
}

private int BinarySearchRight(int[] arr, int target)
{
    int left = 0, right = arr.Length - 1;
    int result = -1;

    while (left <= right)
    {
        int mid = left + (right - left) / 2;
        if (arr[mid] <= target)
        {
            result = mid;
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

---

## Exercise 16: Sort Characters by Frequency

**Problem**: Sort characters by frequency of occurrence.

```csharp
// Time: O(n log n) - Sorting characters
// Space: O(n) - Frequency map and result
public string FrequencySort(string s)
{
    // Count frequencies: O(n)
    var freqMap = new Dictionary<char, int>();
    foreach (char c in s)
    {
        if (freqMap.ContainsKey(c))
            freqMap[c]++;
        else
            freqMap[c] = 1;
    }

    // Sort by frequency: O(n log n)
    var sorted = freqMap.OrderByDescending(x => x.Value)
                       .ThenBy(x => x.Key);

    // Build result: O(n)
    var result = new StringBuilder();
    foreach (var pair in sorted)
    {
        result.Append(pair.Key, pair.Value);
    }

    return result.ToString();
}
```

**Example:**
```
Input: "tree"
Frequencies: t→1, r→1, e→2
Output: "eert" or "eetr"
```

---

## Exercise 17: Custom Sort String

**Problem**: Sort string based on custom order.

```csharp
// Time: O(n log n) - Sorting with custom comparator
// Space: O(n) - Character array
public string CustomSortString(string order, string s)
{
    // Create order map: O(m) where m = order.Length
    var orderMap = new Dictionary<char, int>();
    for (int i = 0; i < order.Length; i++)
    {
        orderMap[order[i]] = i;
    }

    // Sort string: O(n log n)
    var chars = s.ToCharArray();
    Array.Sort(chars, (a, b) =>
    {
        int orderA = orderMap.ContainsKey(a) ? orderMap[a] : int.MaxValue;
        int orderB = orderMap.ContainsKey(b) ? orderMap[b] : int.MaxValue;
        return orderA.CompareTo(orderB);
    });

    return new string(chars);
}
```

**Example:**
```
order = "cba"
s = "abcd"
Output: "cbad"
```

---

## Exercise 18: Sort Array by Parity

**Problem**: Sort array so even numbers come before odd numbers.

```csharp
// Using sorting: O(n log n)
public int[] SortArrayByParitySort(int[] nums)
{
    Array.Sort(nums, (a, b) =>
    {
        return (a % 2).CompareTo(b % 2);
    });
    return nums;
}

// Two-pointer approach: O(n) - Better!
public int[] SortArrayByParityTwoPointer(int[] nums)
{
    int left = 0, right = nums.Length - 1;

    while (left < right)
    {
        if (nums[left] % 2 > nums[right] % 2)
        {
            int temp = nums[left];
            nums[left] = nums[right];
            nums[right] = temp;
        }

        if (nums[left] % 2 == 0) left++;
        if (nums[right] % 2 == 1) right--;
    }

    return nums;
}
```

**Note**: Sorting is O(n log n) but two-pointer is O(n). Another case where sorting isn't optimal.

---

## Exercise 19: Insert Interval

**Problem**: Insert new interval and merge if necessary.

```csharp
// Time: O(n log n) if we sort, O(n) if already sorted
// Space: O(n) - Result list
public int[][] Insert(int[][] intervals, int[] newInterval)
{
    var result = new List<int[]>();
    int i = 0;
    int n = intervals.Length;

    // Add all intervals before newInterval
    while (i < n && intervals[i][1] < newInterval[0])
    {
        result.Add(intervals[i]);
        i++;
    }

    // Merge overlapping intervals
    while (i < n && intervals[i][0] <= newInterval[1])
    {
        newInterval[0] = Math.Min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.Max(newInterval[1], intervals[i][1]);
        i++;
    }
    result.Add(newInterval);

    // Add remaining intervals
    while (i < n)
    {
        result.Add(intervals[i]);
        i++;
    }

    return result.ToArray();
}
```

**Analysis:**
- If intervals are sorted: O(n)
- If need to sort first: O(n log n)

---

## Exercise 20: Closest Points to Origin

**Problem**: Find k closest points to origin.

```csharp
// Time: O(n log n) - Sorting all points
// Space: O(1) - Sort in place
public int[][] KClosest(int[][] points, int k)
{
    Array.Sort(points, (a, b) =>
    {
        int distA = a[0] * a[0] + a[1] * a[1];
        int distB = b[0] * b[0] + b[1] * b[1];
        return distA.CompareTo(distB);
    });

    int[][] result = new int[k][];
    Array.Copy(points, result, k);
    return result;
}

// Using max heap: O(n log k) - Better when k is small!
public int[][] KClosestHeap(int[][] points, int k)
{
    var maxHeap = new SortedSet<(int dist, int index)>(
        Comparer<(int dist, int index)>.Create((a, b) =>
        {
            int distCompare = b.dist.CompareTo(a.dist);
            if (distCompare != 0) return distCompare;
            return b.index.CompareTo(a.index);
        })
    );

    for (int i = 0; i < points.Length; i++)
    {
        int dist = points[i][0] * points[i][0] + points[i][1] * points[i][1];
        maxHeap.Add((dist, i));

        if (maxHeap.Count > k)
        {
            maxHeap.Remove(maxHeap.Min);
        }
    }

    var result = new int[k][];
    int idx = 0;
    foreach (var item in maxHeap)
    {
        result[idx++] = points[item.index];
    }

    return result;
}
```

---

## Common Interview Questions

### Q1: "Why is merge sort O(n log n) and not O(n²)?"
**Answer**: Even though we have log n levels and do O(n) work per level, we're not doing n² comparisons. Each element is merged once per level. Total work = (log n levels) × (n work per level) = n log n.

### Q2: "Which sorting algorithm should I use in interviews?"
**Answer**:
- **Default**: Mention you'd use built-in sort (O(n log n))
- **Stable sort needed**: Merge Sort
- **In-place required**: Quick Sort or Heap Sort
- **Nearly sorted data**: Insertion Sort can be better
- **Small arrays**: Insertion Sort
- **Linked List**: Merge Sort

### Q3: "Is quick sort always better than merge sort?"
**Answer**: No. Quick sort has O(n²) worst case (already sorted array with bad pivot). Merge sort is always O(n log n). However, quick sort is often faster in practice due to better cache performance and in-place sorting. Use randomized quick sort to avoid worst case.

### Q4: "Can we sort faster than O(n log n)?"
**Answer**: Not with comparison-based sorting. However, non-comparison sorts (Counting Sort, Radix Sort, Bucket Sort) can be O(n) for specific types of data.

### Q5: "When should I use sorting vs. a heap for 'top k' problems?"
**Answer**:
- **Full sort**: O(n log n) - simple, works when k ≈ n
- **Min/Max heap**: O(n log k) - better when k << n
- **QuickSelect**: O(n) average - best average case, but O(n²) worst case

---

## Summary

O(n log n) is the best we can do for comparison-based sorting. Key points:

- **Main Pattern**: Divide-and-conquer with linear merge
- **Common Uses**: Sorting, merging, divide-and-conquer algorithms
- **Best Sorts**: Merge Sort (stable, consistent), Quick Sort (in-place, fast average), Heap Sort (in-place, consistent)
- **Optimal**: For comparison-based sorting, O(n log n) is provably optimal

**Next**: Move on to [ON2-Quadratic-Time-Exercises.md](./ON2-Quadratic-Time-Exercises.md) to learn about O(n²) complexity!
