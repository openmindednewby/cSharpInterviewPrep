# O(n) - Linear Time Complexity Exercises

## Overview

O(n) means the algorithm's runtime grows linearly with input size. If input doubles, runtime roughly doubles. This is very common and often the best we can do for problems requiring examining all elements.

**Key Characteristics:**
- Must look at each element at least once
- Single loop through data
- Often optimal for many problems
- Very acceptable complexity

**Growth Comparison:**
```
n = 100       → 100 operations
n = 1,000     → 1,000 operations
n = 1,000,000 → 1,000,000 operations
```

**Common Patterns:**
- Single pass through array/list
- Linear search
- Building hash maps
- String processing

## Exercise 1: Linear Search

**Problem**: Find if target exists in unsorted array.

```csharp
// Time: O(n) - May need to check all elements
// Space: O(1) - Only uses a few variables
public int LinearSearch(int[] arr, int target)
{
    for (int i = 0; i < arr.Length; i++)
    {
        if (arr[i] == target)
            return i;
    }
    return -1;
}
```

**Analysis:**
- **Best Case**: O(1) - target is first element
- **Average Case**: O(n/2) → O(n) - target in middle
- **Worst Case**: O(n) - target at end or not present
- **When to use**: Unsorted data or very small arrays

**Comparison:**
- Unsorted: Linear search O(n)
- Sorted: Binary search O(log n)

---

## Exercise 2: Find Minimum/Maximum

**Problem**: Find the smallest or largest element in an array.

```csharp
// Time: O(n) - Must check every element
// Space: O(1) - Only stores min value
public int FindMin(int[] arr)
{
    if (arr.Length == 0)
        throw new ArgumentException("Array is empty");

    int min = arr[0];
    for (int i = 1; i < arr.Length; i++)
    {
        if (arr[i] < min)
            min = arr[i];
    }
    return min;
}

// Find both min and max: Still O(n)
public (int min, int max) FindMinMax(int[] arr)
{
    if (arr.Length == 0)
        throw new ArgumentException("Array is empty");

    int min = arr[0];
    int max = arr[0];

    for (int i = 1; i < arr.Length; i++)
    {
        if (arr[i] < min)
            min = arr[i];
        if (arr[i] > max)
            max = arr[i];
    }

    return (min, max);
}

// Using LINQ (also O(n))
public int FindMinLinq(int[] arr)
{
    return arr.Min();  // O(n)
}
```

**Analysis:**
- Must examine every element (can't skip any)
- No way to do better than O(n) without additional info
- **Optimization**: Find both min and max in one pass

---

## Exercise 3: Sum of Array Elements

**Problem**: Calculate sum of all elements.

```csharp
// Time: O(n) - Visit each element once
// Space: O(1) - Only stores sum
public long SumArray(int[] arr)
{
    long sum = 0;
    for (int i = 0; i < arr.Length; i++)
    {
        sum += arr[i];
    }
    return sum;
}

// Using LINQ (also O(n))
public long SumArrayLinq(int[] arr)
{
    return arr.Sum();  // O(n)
}

// Average: O(n)
public double Average(int[] arr)
{
    if (arr.Length == 0)
        throw new ArgumentException("Array is empty");

    return (double)arr.Sum() / arr.Length;  // O(n) + O(1)
}
```

**Analysis:**
- Single pass through array
- Can't compute sum without seeing all elements
- O(n) is optimal for this problem

---

## Exercise 4: Reverse an Array In-Place

**Problem**: Reverse array elements without extra space.

```csharp
// Time: O(n) - Visit n/2 elements, swap each
// Space: O(1) - Only uses temp variable
public void ReverseArray(int[] arr)
{
    int left = 0;
    int right = arr.Length - 1;

    while (left < right)
    {
        // Swap
        int temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;

        left++;
        right--;
    }
}

// Using Array.Reverse (also O(n))
public void ReverseArrayBuiltIn(int[] arr)
{
    Array.Reverse(arr);  // O(n)
}
```

**Analysis:**
- Swaps n/2 pairs
- O(n/2) → O(n) after dropping constants
- In-place: O(1) space

---

## Exercise 5: Remove Duplicates from Sorted Array

**Problem**: Remove duplicates in-place from sorted array.

```csharp
// Time: O(n) - Single pass through array
// Space: O(1) - Only uses index pointer
public int RemoveDuplicates(int[] nums)
{
    if (nums.Length == 0)
        return 0;

    int writeIndex = 1;

    for (int i = 1; i < nums.Length; i++)
    {
        if (nums[i] != nums[i - 1])
        {
            nums[writeIndex] = nums[i];
            writeIndex++;
        }
    }

    return writeIndex;  // New length
}
```

**Example:**
```
Input:  [1, 1, 2, 2, 3, 4, 4, 5]
Output: [1, 2, 3, 4, 5, _, _, _]
Length: 5

Process:
i=1: 1==1, skip
i=2: 2!=1, write at 1
i=3: 2==2, skip
i=4: 3!=2, write at 2
i=5: 4!=3, write at 3
i=6: 4==4, skip
i=7: 5!=4, write at 4
```

**Analysis:**
- Single pass: O(n)
- Two-pointer technique
- Only works because array is sorted!

---

## Exercise 6: Count Occurrences

**Problem**: Count how many times each element appears.

```csharp
// Time: O(n) - Single pass to build dictionary
// Space: O(n) - Dictionary stores unique elements
public Dictionary<int, int> CountOccurrences(int[] arr)
{
    var counts = new Dictionary<int, int>();

    foreach (int num in arr)
    {
        if (counts.ContainsKey(num))
            counts[num]++;
        else
            counts[num] = 1;
    }

    return counts;
}

// Using LINQ GroupBy (also O(n))
public Dictionary<int, int> CountOccurrencesLinq(int[] arr)
{
    return arr.GroupBy(x => x)
              .ToDictionary(g => g.Key, g => g.Count());
}

// Count specific value: O(n)
public int CountValue(int[] arr, int target)
{
    int count = 0;
    foreach (int num in arr)
    {
        if (num == target)
            count++;
    }
    return count;
}
```

**Analysis:**
- Each element processed once: O(n)
- Dictionary operations: O(1) average
- Total: O(n)

---

## Exercise 7: Two Sum (Hash Map Approach)

**Problem**: Find two numbers that add up to target.

```csharp
// Time: O(n) - Single pass with hash map
// Space: O(n) - Store up to n elements in dictionary
public int[] TwoSum(int[] nums, int target)
{
    var map = new Dictionary<int, int>();  // value -> index

    for (int i = 0; i < nums.Length; i++)
    {
        int complement = target - nums[i];

        if (map.ContainsKey(complement))
        {
            return new int[] { map[complement], i };
        }

        map[nums[i]] = i;
    }

    return null;  // No solution
}

// Brute force approach: O(n²)
public int[] TwoSumBruteForce(int[] nums, int target)
{
    for (int i = 0; i < nums.Length; i++)
    {
        for (int j = i + 1; j < nums.Length; j++)
        {
            if (nums[i] + nums[j] == target)
                return new int[] { i, j };
        }
    }
    return null;
}
```

**Analysis:**
- Hash map approach: O(n) time, O(n) space
- Brute force: O(n²) time, O(1) space
- Classic time-space tradeoff!

---

## Exercise 8: Move Zeros to End

**Problem**: Move all zeros to the end, maintaining order of non-zeros.

```csharp
// Time: O(n) - Single pass
// Space: O(1) - In-place
public void MoveZeros(int[] nums)
{
    int writeIndex = 0;

    // Move all non-zeros to front
    for (int i = 0; i < nums.Length; i++)
    {
        if (nums[i] != 0)
        {
            nums[writeIndex] = nums[i];
            writeIndex++;
        }
    }

    // Fill remaining with zeros
    for (int i = writeIndex; i < nums.Length; i++)
    {
        nums[i] = 0;
    }
}

// Alternative: swap approach (also O(n))
public void MoveZerosSwap(int[] nums)
{
    int writeIndex = 0;

    for (int i = 0; i < nums.Length; i++)
    {
        if (nums[i] != 0)
        {
            int temp = nums[writeIndex];
            nums[writeIndex] = nums[i];
            nums[i] = temp;
            writeIndex++;
        }
    }
}
```

**Example:**
```
Input:  [0, 1, 0, 3, 12]
Output: [1, 3, 12, 0, 0]
```

**Analysis:**
- Two passes: O(n) + O(n) = O(2n) → O(n)
- Two-pointer technique
- In-place modification

---

## Exercise 9: Contains Duplicate (Hash Set)

**Problem**: Check if array contains any duplicates.

```csharp
// Time: O(n) - Single pass with hash set
// Space: O(n) - Store up to n elements
public bool ContainsDuplicate(int[] nums)
{
    var seen = new HashSet<int>();

    foreach (int num in nums)
    {
        if (seen.Contains(num))
            return true;

        seen.Add(num);
    }

    return false;
}

// Using LINQ (also O(n))
public bool ContainsDuplicateLinq(int[] nums)
{
    return nums.Length != nums.Distinct().Count();
}

// Brute force: O(n²)
public bool ContainsDuplicateBruteForce(int[] nums)
{
    for (int i = 0; i < nums.Length; i++)
    {
        for (int j = i + 1; j < nums.Length; j++)
        {
            if (nums[i] == nums[j])
                return true;
        }
    }
    return false;
}

// Sort approach: O(n log n)
public bool ContainsDuplicateSort(int[] nums)
{
    Array.Sort(nums);  // O(n log n)
    for (int i = 1; i < nums.Length; i++)
    {
        if (nums[i] == nums[i - 1])
            return true;
    }
    return false;
}
```

**Comparison:**
- Hash set: O(n) time, O(n) space ✓ Best
- Sort: O(n log n) time, O(1) space
- Brute force: O(n²) time, O(1) space

---

## Exercise 10: Merge Two Sorted Arrays

**Problem**: Merge two sorted arrays into one sorted array.

```csharp
// Time: O(n + m) - Linear in total elements
// Space: O(n + m) - New array for result
public int[] MergeSortedArrays(int[] arr1, int[] arr2)
{
    int[] result = new int[arr1.Length + arr2.Length];
    int i = 0, j = 0, k = 0;

    while (i < arr1.Length && j < arr2.Length)
    {
        if (arr1[i] <= arr2[j])
        {
            result[k] = arr1[i];
            i++;
        }
        else
        {
            result[k] = arr2[j];
            j++;
        }
        k++;
    }

    // Copy remaining elements from arr1
    while (i < arr1.Length)
    {
        result[k] = arr1[i];
        i++;
        k++;
    }

    // Copy remaining elements from arr2
    while (j < arr2.Length)
    {
        result[k] = arr2[j];
        j++;
        k++;
    }

    return result;
}
```

**Analysis:**
- Each element from both arrays visited once
- Total: O(n + m) where n = arr1.Length, m = arr2.Length
- Core operation of merge sort!

---

## Exercise 11: Valid Palindrome

**Problem**: Check if string is a palindrome (ignoring non-alphanumeric).

```csharp
// Time: O(n) - Single pass with two pointers
// Space: O(1) - Only uses pointers
public bool IsPalindrome(string s)
{
    int left = 0;
    int right = s.Length - 1;

    while (left < right)
    {
        // Skip non-alphanumeric from left
        while (left < right && !char.IsLetterOrDigit(s[left]))
            left++;

        // Skip non-alphanumeric from right
        while (left < right && !char.IsLetterOrDigit(s[right]))
            right--;

        // Compare characters (case-insensitive)
        if (char.ToLower(s[left]) != char.ToLower(s[right]))
            return false;

        left++;
        right--;
    }

    return true;
}

// Using LINQ: O(n) but creates new string
public bool IsPalindromeLinq(string s)
{
    var cleaned = new string(s.Where(char.IsLetterOrDigit)
                              .Select(char.ToLower)
                              .ToArray());

    return cleaned.SequenceEqual(cleaned.Reverse());
}
```

**Example:**
```
"A man, a plan, a canal: Panama" → true
"race a car" → false
```

---

## Exercise 12: Longest Substring Without Repeating Characters

**Problem**: Find length of longest substring without duplicates.

```csharp
// Time: O(n) - Sliding window, each char visited at most twice
// Space: O(min(n, m)) - m is charset size
public int LengthOfLongestSubstring(string s)
{
    var charSet = new HashSet<char>();
    int left = 0;
    int maxLength = 0;

    for (int right = 0; right < s.Length; right++)
    {
        // Shrink window until no duplicates
        while (charSet.Contains(s[right]))
        {
            charSet.Remove(s[left]);
            left++;
        }

        charSet.Add(s[right]);
        maxLength = Math.Max(maxLength, right - left + 1);
    }

    return maxLength;
}

// Using Dictionary to track last index: O(n)
public int LengthOfLongestSubstringDict(string s)
{
    var lastIndex = new Dictionary<char, int>();
    int left = 0;
    int maxLength = 0;

    for (int right = 0; right < s.Length; right++)
    {
        if (lastIndex.ContainsKey(s[right]))
        {
            left = Math.Max(left, lastIndex[s[right]] + 1);
        }

        lastIndex[s[right]] = right;
        maxLength = Math.Max(maxLength, right - left + 1);
    }

    return maxLength;
}
```

**Example:**
```
"abcabcbb" → "abc" (length 3)
"bbbbb" → "b" (length 1)
"pwwkew" → "wke" (length 3)
```

**Analysis:**
- Sliding window technique
- Right pointer moves n times: O(n)
- Left pointer moves at most n times total: O(n)
- Total: O(2n) → O(n)

---

## Exercise 13: Maximum Subarray Sum (Kadane's Algorithm)

**Problem**: Find contiguous subarray with largest sum.

```csharp
// Time: O(n) - Single pass
// Space: O(1) - Only uses variables
public int MaxSubArray(int[] nums)
{
    int maxSoFar = nums[0];
    int maxEndingHere = nums[0];

    for (int i = 1; i < nums.Length; i++)
    {
        maxEndingHere = Math.Max(nums[i], maxEndingHere + nums[i]);
        maxSoFar = Math.Max(maxSoFar, maxEndingHere);
    }

    return maxSoFar;
}

// Track indices as well: O(n)
public (int sum, int start, int end) MaxSubArrayWithIndices(int[] nums)
{
    int maxSoFar = nums[0];
    int maxEndingHere = nums[0];
    int start = 0, end = 0, tempStart = 0;

    for (int i = 1; i < nums.Length; i++)
    {
        if (nums[i] > maxEndingHere + nums[i])
        {
            maxEndingHere = nums[i];
            tempStart = i;
        }
        else
        {
            maxEndingHere = maxEndingHere + nums[i];
        }

        if (maxEndingHere > maxSoFar)
        {
            maxSoFar = maxEndingHere;
            start = tempStart;
            end = i;
        }
    }

    return (maxSoFar, start, end);
}
```

**Example:**
```
[-2, 1, -3, 4, -1, 2, 1, -5, 4]
Best subarray: [4, -1, 2, 1] = 6
```

**Analysis:**
- Brilliant O(n) algorithm for classic problem
- Brute force would be O(n²) or O(n³)
- Named after Uyghur computer scientist Jay Kadane

---

## Exercise 14: Best Time to Buy and Sell Stock

**Problem**: Find maximum profit from one buy and one sell.

```csharp
// Time: O(n) - Single pass
// Space: O(1) - Only uses variables
public int MaxProfit(int[] prices)
{
    if (prices.Length == 0)
        return 0;

    int minPrice = prices[0];
    int maxProfit = 0;

    for (int i = 1; i < prices.Length; i++)
    {
        maxProfit = Math.Max(maxProfit, prices[i] - minPrice);
        minPrice = Math.Min(minPrice, prices[i]);
    }

    return maxProfit;
}
```

**Example:**
```
Prices: [7, 1, 5, 3, 6, 4]
Buy at 1, sell at 6 → Profit = 5
```

**Analysis:**
- Track minimum price seen so far
- Calculate profit if we sell today
- O(n) single pass solution

---

## Exercise 15: Rotate Array

**Problem**: Rotate array to the right by k steps.

```csharp
// Time: O(n) - Three reverses
// Space: O(1) - In-place
public void Rotate(int[] nums, int k)
{
    k = k % nums.Length;  // Handle k > n

    // Reverse entire array
    Reverse(nums, 0, nums.Length - 1);

    // Reverse first k elements
    Reverse(nums, 0, k - 1);

    // Reverse remaining elements
    Reverse(nums, k, nums.Length - 1);
}

private void Reverse(int[] nums, int start, int end)
{
    while (start < end)
    {
        int temp = nums[start];
        nums[start] = nums[end];
        nums[end] = temp;
        start++;
        end--;
    }
}
```

**Example:**
```
[1, 2, 3, 4, 5, 6, 7], k = 3

Step 1: Reverse all
[7, 6, 5, 4, 3, 2, 1]

Step 2: Reverse first 3
[5, 6, 7, 4, 3, 2, 1]

Step 3: Reverse remaining
[5, 6, 7, 1, 2, 3, 4]
```

**Analysis:**
- Three O(n) operations: O(3n) → O(n)
- Clever in-place algorithm
- Alternative: extra array (O(n) space)

---

## Exercise 16: Find All Numbers Disappeared in Array

**Problem**: Find all numbers from 1 to n that are missing.

```csharp
// Time: O(n) - Two passes
// Space: O(1) - If output doesn't count
public List<int> FindDisappearedNumbers(int[] nums)
{
    // Mark presence by negating value at index
    for (int i = 0; i < nums.Length; i++)
    {
        int index = Math.Abs(nums[i]) - 1;
        if (nums[index] > 0)
            nums[index] = -nums[index];
    }

    // Find indices with positive values (missing numbers)
    var result = new List<int>();
    for (int i = 0; i < nums.Length; i++)
    {
        if (nums[i] > 0)
            result.Add(i + 1);
    }

    return result;
}

// Using HashSet: O(n) time, O(n) space
public List<int> FindDisappearedNumbersSet(int[] nums)
{
    var present = new HashSet<int>(nums);
    var result = new List<int>();

    for (int i = 1; i <= nums.Length; i++)
    {
        if (!present.Contains(i))
            result.Add(i);
    }

    return result;
}
```

**Example:**
```
[4, 3, 2, 7, 8, 2, 3, 1]
Missing: [5, 6]
```

---

## Exercise 17: Intersection of Two Arrays

**Problem**: Find common elements between two arrays.

```csharp
// Time: O(n + m) - Build set + iterate
// Space: O(min(n, m)) - Store smaller set
public int[] Intersection(int[] nums1, int[] nums2)
{
    var set1 = new HashSet<int>(nums1);
    var result = new HashSet<int>();

    foreach (int num in nums2)
    {
        if (set1.Contains(num))
            result.Add(num);
    }

    return result.ToArray();
}

// With duplicates (intersection II)
public int[] Intersect(int[] nums1, int[] nums2)
{
    var counts = new Dictionary<int, int>();

    // Count occurrences in nums1
    foreach (int num in nums1)
    {
        if (counts.ContainsKey(num))
            counts[num]++;
        else
            counts[num] = 1;
    }

    var result = new List<int>();

    // Check nums2 against counts
    foreach (int num in nums2)
    {
        if (counts.ContainsKey(num) && counts[num] > 0)
        {
            result.Add(num);
            counts[num]--;
        }
    }

    return result.ToArray();
}
```

**Analysis:**
- Build hash set from first array: O(n)
- Check second array: O(m)
- Total: O(n + m)

---

## Exercise 18: Single Number

**Problem**: Find element that appears once (all others appear twice).

```csharp
// Time: O(n) - Single pass
// Space: O(1) - Only uses variable
public int SingleNumber(int[] nums)
{
    int result = 0;

    foreach (int num in nums)
    {
        result ^= num;  // XOR
    }

    return result;
}
```

**Why XOR Works:**
```
a ^ a = 0 (anything XOR itself is 0)
a ^ 0 = a (anything XOR 0 is itself)
XOR is commutative and associative

[2, 2, 1]:
2 ^ 2 ^ 1 = 0 ^ 1 = 1

[4, 1, 2, 1, 2]:
4 ^ 1 ^ 2 ^ 1 ^ 2 = 4 ^ (1^1) ^ (2^2) = 4 ^ 0 ^ 0 = 4
```

**Analysis:**
- Brilliant O(n) time, O(1) space solution
- Uses bit manipulation properties

---

## Exercise 19: Product of Array Except Self

**Problem**: Return array where each element is product of all others.

```csharp
// Time: O(n) - Three passes
// Space: O(1) - Output array doesn't count
public int[] ProductExceptSelf(int[] nums)
{
    int n = nums.Length;
    int[] result = new int[n];

    // Calculate prefix products
    result[0] = 1;
    for (int i = 1; i < n; i++)
    {
        result[i] = result[i - 1] * nums[i - 1];
    }

    // Calculate suffix products and combine
    int suffix = 1;
    for (int i = n - 1; i >= 0; i--)
    {
        result[i] *= suffix;
        suffix *= nums[i];
    }

    return result;
}
```

**Example:**
```
Input: [1, 2, 3, 4]

Prefix products:
[1, 1, 2, 6]

Suffix products:
[24, 12, 4, 1]

Result (prefix * suffix):
[24, 12, 8, 6]
```

**Analysis:**
- Can't use division (problem constraint)
- O(n) time with O(1) extra space (clever!)
- Uses prefix and suffix products

---

## Exercise 20: Valid Anagram

**Problem**: Check if two strings are anagrams.

```csharp
// Time: O(n) - Two passes
// Space: O(1) - Fixed size array (26 letters)
public bool IsAnagram(string s, string t)
{
    if (s.Length != t.Length)
        return false;

    int[] counts = new int[26];

    for (int i = 0; i < s.Length; i++)
    {
        counts[s[i] - 'a']++;
        counts[t[i] - 'a']--;
    }

    foreach (int count in counts)
    {
        if (count != 0)
            return false;
    }

    return true;
}

// Using Dictionary: O(n) time, O(k) space where k = unique chars
public bool IsAnagramDict(string s, string t)
{
    if (s.Length != t.Length)
        return false;

    var counts = new Dictionary<char, int>();

    foreach (char c in s)
    {
        if (counts.ContainsKey(c))
            counts[c]++;
        else
            counts[c] = 1;
    }

    foreach (char c in t)
    {
        if (!counts.ContainsKey(c))
            return false;

        counts[c]--;
        if (counts[c] < 0)
            return false;
    }

    return true;
}

// Sorting approach: O(n log n)
public bool IsAnagramSort(string s, string t)
{
    if (s.Length != t.Length)
        return false;

    char[] sArr = s.ToCharArray();
    char[] tArr = t.ToCharArray();

    Array.Sort(sArr);  // O(n log n)
    Array.Sort(tArr);

    return new string(sArr) == new string(tArr);
}
```

**Comparison:**
- Array counting: O(n) time, O(1) space ✓ Best for lowercase letters
- Dictionary: O(n) time, O(k) space (works with Unicode)
- Sorting: O(n log n) time, O(1) space

---

## Exercise 21: Group Anagrams

**Problem**: Group strings that are anagrams of each other.

```csharp
// Time: O(n * k) where n = number of strings, k = max string length
// Space: O(n * k) for storage
public List<List<string>> GroupAnagrams(string[] strs)
{
    var groups = new Dictionary<string, List<string>>();

    foreach (string str in strs)
    {
        // Create character count key
        char[] count = new char[26];
        foreach (char c in str)
        {
            count[c - 'a']++;
        }

        string key = new string(count);

        if (!groups.ContainsKey(key))
            groups[key] = new List<string>();

        groups[key].Add(str);
    }

    return new List<List<string>>(groups.Values);
}

// Alternative: sort strings as key (O(n * k log k))
public List<List<string>> GroupAnagramsSort(string[] strs)
{
    var groups = new Dictionary<string, List<string>>();

    foreach (string str in strs)
    {
        char[] chars = str.ToCharArray();
        Array.Sort(chars);  // O(k log k)
        string key = new string(chars);

        if (!groups.ContainsKey(key))
            groups[key] = new List<string>();

        groups[key].Add(str);
    }

    return new List<List<string>>(groups.Values);
}
```

**Analysis:**
- Character counting: O(n * k) where k = average string length
- Sorting approach: O(n * k log k)
- Both use O(n * k) space

---

## Exercise 22: Longest Consecutive Sequence

**Problem**: Find length of longest consecutive sequence.

```csharp
// Time: O(n) - Each number visited at most twice
// Space: O(n) - Hash set
public int LongestConsecutive(int[] nums)
{
    var numSet = new HashSet<int>(nums);
    int maxLength = 0;

    foreach (int num in numSet)
    {
        // Only start counting if it's the beginning of a sequence
        if (!numSet.Contains(num - 1))
        {
            int currentNum = num;
            int currentLength = 1;

            while (numSet.Contains(currentNum + 1))
            {
                currentNum++;
                currentLength++;
            }

            maxLength = Math.Max(maxLength, currentLength);
        }
    }

    return maxLength;
}
```

**Example:**
```
[100, 4, 200, 1, 3, 2]
Longest sequence: [1, 2, 3, 4] (length 4)
```

**Analysis:**
- Looks like O(n²) with nested loop, but actually O(n)!
- Each number counted only when it's start of sequence
- Each number in inner while visited only once across all iterations

---

## Exercise 23: String Compression

**Problem**: Compress string using count of repeated characters.

```csharp
// Time: O(n) - Single pass through string
// Space: O(n) - StringBuilder for result
public string Compress(string s)
{
    if (string.IsNullOrEmpty(s))
        return s;

    var result = new StringBuilder();
    int count = 1;

    for (int i = 1; i < s.Length; i++)
    {
        if (s[i] == s[i - 1])
        {
            count++;
        }
        else
        {
            result.Append(s[i - 1]);
            if (count > 1)
                result.Append(count);

            count = 1;
        }
    }

    // Add last group
    result.Append(s[s.Length - 1]);
    if (count > 1)
        result.Append(count);

    string compressed = result.ToString();
    return compressed.Length < s.Length ? compressed : s;
}
```

**Example:**
```
"aabcccccaaa" → "a2b1c5a3" → "a2bc5a3"
"abcd" → "abcd" (no compression)
```

---

## Exercise 24: Is Subsequence

**Problem**: Check if s is subsequence of t.

```csharp
// Time: O(n) where n = t.Length
// Space: O(1) - Only uses pointers
public bool IsSubsequence(string s, string t)
{
    int sIndex = 0;

    for (int i = 0; i < t.Length && sIndex < s.Length; i++)
    {
        if (t[i] == s[sIndex])
            sIndex++;
    }

    return sIndex == s.Length;
}
```

**Example:**
```
s = "abc", t = "ahbgdc" → true
s = "axc", t = "ahbgdc" → false
```

**Analysis:**
- Two-pointer technique
- Single pass through t
- O(n) time, O(1) space

---

## Exercise 25: Majority Element

**Problem**: Find element appearing more than n/2 times.

```csharp
// Time: O(n) - Boyer-Moore Voting Algorithm
// Space: O(1) - Only uses variables
public int MajorityElement(int[] nums)
{
    int candidate = nums[0];
    int count = 1;

    for (int i = 1; i < nums.Length; i++)
    {
        if (count == 0)
        {
            candidate = nums[i];
            count = 1;
        }
        else if (nums[i] == candidate)
        {
            count++;
        }
        else
        {
            count--;
        }
    }

    return candidate;
}

// Hash map approach: O(n) time, O(n) space
public int MajorityElementMap(int[] nums)
{
    var counts = new Dictionary<int, int>();
    int threshold = nums.Length / 2;

    foreach (int num in nums)
    {
        if (counts.ContainsKey(num))
            counts[num]++;
        else
            counts[num] = 1;

        if (counts[num] > threshold)
            return num;
    }

    return -1;  // No majority
}
```

**Boyer-Moore Analysis:**
- Brilliant O(n) time, O(1) space algorithm
- Works because majority element appears > n/2 times
- Pairs of different elements cancel out

---

## Common Interview Questions

### Q1: "Can we do better than O(n) for finding min/max?"
**Answer**: No, we must look at every element at least once. Any element could be the min/max. O(n) is optimal for this problem.

### Q2: "Is two nested loops always O(n²)?"
**Answer**: Usually yes, but not always! The longest consecutive sequence problem has a nested loop but is O(n) because each element is visited at most twice total, not once per outer iteration.

### Q3: "How can sorting strings be O(n * k) when sort is O(n log n)?"
**Answer**: It depends on what n and k represent. If n = number of strings and k = average string length, sorting each string is O(k log k), done n times = O(n * k log k).

### Q4: "Is O(2n) different from O(n)?"
**Answer**: No! We drop constants in Big-O. O(2n) = O(3n) = O(100n) = O(n). They all grow linearly.

### Q5: "When should I use O(n) space to improve time complexity?"
**Answer**: When:
- Time complexity improvement is significant (O(n²) → O(n))
- Space is available
- Trading O(n) space for O(n) time is often worth it
- Hash maps are common for this trade-off

---

## Summary

O(n) is very common and often optimal. Key points:

- **Main Pattern**: Single pass through data
- **Common Techniques**: Two pointers, sliding window, hash maps
- **Often Optimal**: Problems requiring examining all elements
- **Space Trade-offs**: O(n) space can reduce time complexity

**Next**: Move on to [ONLogN-Linearithmic-Time-Exercises.md](./ONLogN-Linearithmic-Time-Exercises.md) to learn about O(n log n) complexity!
