# O(n²) - Quadratic Time Complexity Exercises

## Overview

O(n²) means the algorithm's runtime grows quadratically with input size. If input doubles, runtime quadruples. This is generally inefficient but sometimes unavoidable.

**Key Characteristics:**
- Common with nested loops
- Acceptable for small inputs (n < 1000)
- Often a sign of brute force approach
- Sometimes the only solution (or simplest)

**Growth Comparison:**
```
n = 10        → n² = 100 operations
n = 100       → n² = 10,000 operations
n = 1,000     → n² = 1,000,000 operations
n = 10,000    → n² = 100,000,000 operations (slow!)
```

**Common Patterns:**
- Nested loops over same data
- Comparing all pairs
- Simple sorting algorithms
- Brute force solutions

## Exercise 1: Bubble Sort

**Problem**: Sort array by repeatedly swapping adjacent elements.

```csharp
// Time: O(n²) - Nested loops
// Space: O(1) - In-place sorting
public void BubbleSort(int[] arr)
{
    int n = arr.Length;

    for (int i = 0; i < n - 1; i++)  // Outer loop: n iterations
    {
        bool swapped = false;

        for (int j = 0; j < n - i - 1; j++)  // Inner loop: ~n iterations
        {
            if (arr[j] > arr[j + 1])
            {
                // Swap
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }

        // Optimization: stop if no swaps (already sorted)
        if (!swapped)
            break;
    }
}
```

**Analysis:**
- **Worst Case**: O(n²) - array in reverse order
  - First pass: n-1 comparisons
  - Second pass: n-2 comparisons
  - Total: (n-1) + (n-2) + ... + 1 = n(n-1)/2 = O(n²)
- **Best Case**: O(n) - already sorted with optimization
- **Average Case**: O(n²)
- **Space**: O(1)
- **Stable**: Yes

**Why O(n²)?**
```
Array [5, 3, 8, 4, 2], n = 5
Pass 1: 4 comparisons
Pass 2: 3 comparisons
Pass 3: 2 comparisons
Pass 4: 1 comparison
Total: 4+3+2+1 = 10 = n(n-1)/2 = O(n²)
```

---

## Exercise 2: Selection Sort

**Problem**: Sort by repeatedly finding minimum and placing it at beginning.

```csharp
// Time: O(n²) - Always, even if sorted
// Space: O(1) - In-place
public void SelectionSort(int[] arr)
{
    int n = arr.Length;

    for (int i = 0; i < n - 1; i++)  // Outer loop: n iterations
    {
        int minIndex = i;

        // Find minimum in remaining array
        for (int j = i + 1; j < n; j++)  // Inner loop: n-i iterations
        {
            if (arr[j] < arr[minIndex])
            {
                minIndex = j;
            }
        }

        // Swap minimum with current position
        if (minIndex != i)
        {
            int temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
    }
}
```

**Analysis:**
- **All Cases**: O(n²) - always does same comparisons
- Comparisons: (n-1) + (n-2) + ... + 1 = O(n²)
- Swaps: O(n) - at most n swaps
- **Space**: O(1)
- **Stable**: No (but can be made stable)

**Use Case**: When writes are expensive (minimizes swaps)

---

## Exercise 3: Insertion Sort

**Problem**: Sort by building sorted portion one element at a time.

```csharp
// Time: O(n²) worst case, O(n) best case
// Space: O(1) - In-place
public void InsertionSort(int[] arr)
{
    int n = arr.Length;

    for (int i = 1; i < n; i++)  // Outer loop: n iterations
    {
        int key = arr[i];
        int j = i - 1;

        // Shift elements greater than key
        while (j >= 0 && arr[j] > key)  // Inner loop: up to i iterations
        {
            arr[j + 1] = arr[j];
            j--;
        }

        arr[j + 1] = key;
    }
}
```

**Analysis:**
- **Worst Case**: O(n²) - reverse sorted array
- **Best Case**: O(n) - already sorted
- **Average Case**: O(n²)
- **Space**: O(1)
- **Stable**: Yes

**When to Use**:
- Small arrays (n < 10-20)
- Nearly sorted data
- Online algorithm (can sort as data arrives)

---

## Exercise 4: Check for Duplicate Pairs (Brute Force)

**Problem**: Find if array contains any duplicate values.

```csharp
// Time: O(n²) - Brute force with nested loops
// Space: O(1) - No extra space
public bool ContainsDuplicate(int[] nums)
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

// Better approach: O(n) with HashSet
public bool ContainsDuplicateOptimized(int[] nums)
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
```

**Analysis:**
- Brute force: O(n²) time, O(1) space
- Optimized: O(n) time, O(n) space
- **Classic time-space tradeoff!**

---

## Exercise 5: Find All Pairs with Given Sum

**Problem**: Find all pairs of numbers that sum to target.

```csharp
// Time: O(n²) - Check all pairs
// Space: O(1) - Not counting output
public List<(int, int)> FindPairsWithSum(int[] arr, int target)
{
    var pairs = new List<(int, int)>();

    for (int i = 0; i < arr.Length; i++)
    {
        for (int j = i + 1; j < arr.Length; j++)
        {
            if (arr[i] + arr[j] == target)
            {
                pairs.Add((arr[i], arr[j]));
            }
        }
    }

    return pairs;
}

// Optimized with HashSet: O(n)
public List<(int, int)> FindPairsWithSumOptimized(int[] arr, int target)
{
    var pairs = new List<(int, int)>();
    var seen = new HashSet<int>();

    foreach (int num in arr)
    {
        int complement = target - num;
        if (seen.Contains(complement))
        {
            pairs.Add((complement, num));
        }
        seen.Add(num);
    }

    return pairs;
}

// For sorted array: Two pointers O(n)
public List<(int, int)> FindPairsWithSumSorted(int[] arr, int target)
{
    var pairs = new List<(int, int)>();
    int left = 0, right = arr.Length - 1;

    while (left < right)
    {
        int sum = arr[left] + arr[right];

        if (sum == target)
        {
            pairs.Add((arr[left], arr[right]));
            left++;
            right--;
        }
        else if (sum < target)
        {
            left++;
        }
        else
        {
            right--;
        }
    }

    return pairs;
}
```

**Comparison:**
- Brute force: O(n²) time, O(1) space
- Hash set: O(n) time, O(n) space
- Two pointers (sorted): O(n) time, O(1) space

---

## Exercise 6: Count Inversions

**Problem**: Count pairs where i < j but arr[i] > arr[j].

```csharp
// Time: O(n²) - Brute force
// Space: O(1)
public int CountInversions(int[] arr)
{
    int count = 0;

    for (int i = 0; i < arr.Length; i++)
    {
        for (int j = i + 1; j < arr.Length; j++)
        {
            if (arr[i] > arr[j])
            {
                count++;
            }
        }
    }

    return count;
}

// Optimized using merge sort: O(n log n)
public int CountInversionsMergeSort(int[] arr)
{
    return MergeSortAndCount(arr, 0, arr.Length - 1);
}

private int MergeSortAndCount(int[] arr, int left, int right)
{
    int count = 0;

    if (left < right)
    {
        int mid = left + (right - left) / 2;

        count += MergeSortAndCount(arr, left, mid);
        count += MergeSortAndCount(arr, mid + 1, right);
        count += MergeAndCount(arr, left, mid, right);
    }

    return count;
}

private int MergeAndCount(int[] arr, int left, int mid, int right)
{
    int[] leftArr = new int[mid - left + 1];
    int[] rightArr = new int[right - mid];

    Array.Copy(arr, left, leftArr, 0, leftArr.Length);
    Array.Copy(arr, mid + 1, rightArr, 0, rightArr.Length);

    int i = 0, j = 0, k = left;
    int inversions = 0;

    while (i < leftArr.Length && j < rightArr.Length)
    {
        if (leftArr[i] <= rightArr[j])
        {
            arr[k++] = leftArr[i++];
        }
        else
        {
            arr[k++] = rightArr[j++];
            inversions += (leftArr.Length - i);  // All remaining left elements
        }
    }

    while (i < leftArr.Length)
        arr[k++] = leftArr[i++];

    while (j < rightArr.Length)
        arr[k++] = rightArr[j++];

    return inversions;
}
```

**Example:**
```
[2, 4, 1, 3, 5]
Inversions: (2,1), (4,1), (4,3)
Count: 3
```

---

## Exercise 7: Matrix Diagonal Sum

**Problem**: Sum all diagonal elements in a matrix.

```csharp
// Time: O(n²) - Must visit all elements for general case
// Space: O(1)
public int DiagonalSum(int[][] matrix)
{
    int n = matrix.Length;
    int sum = 0;

    for (int i = 0; i < n; i++)
    {
        for (int j = 0; j < n; j++)
        {
            if (i == j || i + j == n - 1)  // Main or anti diagonal
            {
                sum += matrix[i][j];
            }
        }
    }

    return sum;
}

// Optimized: O(n) - Only visit diagonal elements
public int DiagonalSumOptimized(int[][] matrix)
{
    int n = matrix.Length;
    int sum = 0;

    for (int i = 0; i < n; i++)
    {
        sum += matrix[i][i];  // Main diagonal

        if (i != n - 1 - i)  // Avoid counting center twice for odd n
        {
            sum += matrix[i][n - 1 - i];  // Anti diagonal
        }
    }

    return sum;
}
```

**Analysis:**
- First approach: O(n²) visits all elements
- Optimized: O(n) visits only diagonal elements
- **Lesson**: Don't always need nested loops for 2D arrays!

---

## Exercise 8: Rotate Matrix 90 Degrees

**Problem**: Rotate n×n matrix 90 degrees clockwise in-place.

```csharp
// Time: O(n²) - Must visit all elements
// Space: O(1) - In-place rotation
public void Rotate(int[][] matrix)
{
    int n = matrix.Length;

    // Transpose: O(n²)
    for (int i = 0; i < n; i++)
    {
        for (int j = i + 1; j < n; j++)
        {
            int temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }

    // Reverse each row: O(n²)
    for (int i = 0; i < n; i++)
    {
        Array.Reverse(matrix[i]);
    }
}
```

**Example:**
```
[1, 2, 3]      [7, 4, 1]
[4, 5, 6]  →   [8, 5, 2]
[7, 8, 9]      [9, 6, 3]
```

**Analysis:**
- Must touch every element: O(n²) is optimal
- This is a case where O(n²) is unavoidable!

---

## Exercise 9: Set Matrix Zeros

**Problem**: If element is 0, set entire row and column to 0.

```csharp
// Time: O(m × n) - Visit all cells
// Space: O(m + n) - Track rows and columns
public void SetZeroes(int[][] matrix)
{
    int m = matrix.Length;
    int n = matrix[0].Length;

    var zeroRows = new HashSet<int>();
    var zeroCols = new HashSet<int>();

    // Find zeros: O(m × n)
    for (int i = 0; i < m; i++)
    {
        for (int j = 0; j < n; j++)
        {
            if (matrix[i][j] == 0)
            {
                zeroRows.Add(i);
                zeroCols.Add(j);
            }
        }
    }

    // Set rows to zero: O(m × n)
    for (int i = 0; i < m; i++)
    {
        for (int j = 0; j < n; j++)
        {
            if (zeroRows.Contains(i) || zeroCols.Contains(j))
            {
                matrix[i][j] = 0;
            }
        }
    }
}

// O(1) space solution using first row/column as markers
public void SetZeroesConstantSpace(int[][] matrix)
{
    int m = matrix.Length;
    int n = matrix[0].Length;
    bool firstRowZero = false;
    bool firstColZero = false;

    // Check if first row has zero
    for (int j = 0; j < n; j++)
    {
        if (matrix[0][j] == 0)
        {
            firstRowZero = true;
            break;
        }
    }

    // Check if first column has zero
    for (int i = 0; i < m; i++)
    {
        if (matrix[i][0] == 0)
        {
            firstColZero = true;
            break;
        }
    }

    // Use first row and column as markers
    for (int i = 1; i < m; i++)
    {
        for (int j = 1; j < n; j++)
        {
            if (matrix[i][j] == 0)
            {
                matrix[i][0] = 0;
                matrix[0][j] = 0;
            }
        }
    }

    // Set zeros based on markers
    for (int i = 1; i < m; i++)
    {
        for (int j = 1; j < n; j++)
        {
            if (matrix[i][0] == 0 || matrix[0][j] == 0)
            {
                matrix[i][j] = 0;
            }
        }
    }

    // Handle first row
    if (firstRowZero)
    {
        for (int j = 0; j < n; j++)
        {
            matrix[0][j] = 0;
        }
    }

    // Handle first column
    if (firstColZero)
    {
        for (int i = 0; i < m; i++)
        {
            matrix[i][0] = 0;
        }
    }
}
```

**Analysis:**
- Both versions: O(m × n) time
- First: O(m + n) space
- Second: O(1) space (clever!)

---

## Exercise 10: Spiral Matrix

**Problem**: Return all elements of matrix in spiral order.

```csharp
// Time: O(m × n) - Visit each element once
// Space: O(1) - Not counting output
public List<int> SpiralOrder(int[][] matrix)
{
    var result = new List<int>();

    if (matrix.Length == 0)
        return result;

    int top = 0;
    int bottom = matrix.Length - 1;
    int left = 0;
    int right = matrix[0].Length - 1;

    while (top <= bottom && left <= right)
    {
        // Traverse right
        for (int j = left; j <= right; j++)
        {
            result.Add(matrix[top][j]);
        }
        top++;

        // Traverse down
        for (int i = top; i <= bottom; i++)
        {
            result.Add(matrix[i][right]);
        }
        right--;

        // Traverse left (if still have rows)
        if (top <= bottom)
        {
            for (int j = right; j >= left; j--)
            {
                result.Add(matrix[bottom][j]);
            }
            bottom--;
        }

        // Traverse up (if still have columns)
        if (left <= right)
        {
            for (int i = bottom; i >= top; i--)
            {
                result.Add(matrix[i][left]);
            }
            left++;
        }
    }

    return result;
}
```

**Example:**
```
[1, 2, 3]
[4, 5, 6]
[7, 8, 9]

Output: [1, 2, 3, 6, 9, 8, 7, 4, 5]
```

---

## Exercise 11: Valid Sudoku

**Problem**: Check if Sudoku board is valid (no duplicates in rows/cols/boxes).

```csharp
// Time: O(1) - Board is always 9×9 = 81 cells
// But generalizing: O(n²) for n×n board
// Space: O(1) - Fixed size sets
public bool IsValidSudoku(char[][] board)
{
    var rows = new HashSet<char>[9];
    var cols = new HashSet<char>[9];
    var boxes = new HashSet<char>[9];

    for (int i = 0; i < 9; i++)
    {
        rows[i] = new HashSet<char>();
        cols[i] = new HashSet<char>();
        boxes[i] = new HashSet<char>();
    }

    for (int i = 0; i < 9; i++)
    {
        for (int j = 0; j < 9; j++)
        {
            char c = board[i][j];

            if (c == '.')
                continue;

            int boxIndex = (i / 3) * 3 + (j / 3);

            if (rows[i].Contains(c) ||
                cols[j].Contains(c) ||
                boxes[boxIndex].Contains(c))
            {
                return false;
            }

            rows[i].Add(c);
            cols[j].Add(c);
            boxes[boxIndex].Add(c);
        }
    }

    return true;
}
```

**Analysis:**
- 9×9 board: O(1) - constant size
- General n×n board: O(n²)
- Must check all cells

---

## Exercise 12: Game of Life

**Problem**: Compute next state of Game of Life board.

```csharp
// Time: O(m × n) - Visit each cell and its neighbors
// Space: O(m × n) - New board for next state
public void GameOfLife(int[][] board)
{
    int m = board.Length;
    int n = board[0].Length;

    int[][] next = new int[m][];
    for (int i = 0; i < m; i++)
    {
        next[i] = new int[n];
    }

    int[] dx = { -1, -1, -1, 0, 0, 1, 1, 1 };
    int[] dy = { -1, 0, 1, -1, 1, -1, 0, 1 };

    for (int i = 0; i < m; i++)
    {
        for (int j = 0; j < n; j++)
        {
            int liveNeighbors = 0;

            // Count live neighbors
            for (int k = 0; k < 8; k++)
            {
                int ni = i + dx[k];
                int nj = j + dy[k];

                if (ni >= 0 && ni < m && nj >= 0 && nj < n)
                {
                    liveNeighbors += board[ni][nj];
                }
            }

            // Apply rules
            if (board[i][j] == 1)
            {
                // Live cell
                if (liveNeighbors == 2 || liveNeighbors == 3)
                    next[i][j] = 1;
            }
            else
            {
                // Dead cell
                if (liveNeighbors == 3)
                    next[i][j] = 1;
            }
        }
    }

    // Copy next state to board
    for (int i = 0; i < m; i++)
    {
        for (int j = 0; j < n; j++)
        {
            board[i][j] = next[i][j];
        }
    }
}
```

**Analysis:**
- Each cell checks 8 neighbors: O(1) per cell
- m×n cells: O(m × n) total
- Space: O(m × n) for next state

---

## Exercise 13: Maximum Product Subarray (Brute Force)

**Problem**: Find contiguous subarray with largest product.

```csharp
// Time: O(n²) - Check all subarrays
// Space: O(1)
public int MaxProduct(int[] nums)
{
    int maxProduct = nums[0];

    for (int i = 0; i < nums.Length; i++)
    {
        int product = 1;

        for (int j = i; j < nums.Length; j++)
        {
            product *= nums[j];
            maxProduct = Math.Max(maxProduct, product);
        }
    }

    return maxProduct;
}

// Optimized: O(n) using dynamic programming
public int MaxProductOptimized(int[] nums)
{
    int maxSoFar = nums[0];
    int maxEndingHere = nums[0];
    int minEndingHere = nums[0];

    for (int i = 1; i < nums.Length; i++)
    {
        int temp = maxEndingHere;

        maxEndingHere = Math.Max(nums[i],
                        Math.Max(maxEndingHere * nums[i],
                                minEndingHere * nums[i]));

        minEndingHere = Math.Min(nums[i],
                        Math.Min(temp * nums[i],
                                minEndingHere * nums[i]));

        maxSoFar = Math.Max(maxSoFar, maxEndingHere);
    }

    return maxSoFar;
}
```

---

## Exercise 14: Unique Paths in Grid

**Problem**: Count paths from top-left to bottom-right (only move right/down).

```csharp
// Time: O(m × n) - Fill entire grid
// Space: O(m × n) - DP table
public int UniquePaths(int m, int n)
{
    int[,] dp = new int[m, n];

    // Initialize first row and column
    for (int i = 0; i < m; i++)
        dp[i, 0] = 1;

    for (int j = 0; j < n; j++)
        dp[0, j] = 1;

    // Fill rest of table
    for (int i = 1; i < m; i++)
    {
        for (int j = 1; j < n; j++)
        {
            dp[i, j] = dp[i - 1, j] + dp[i, j - 1];
        }
    }

    return dp[m - 1, n - 1];
}

// Space optimized: O(n)
public int UniquePathsOptimized(int m, int n)
{
    int[] dp = new int[n];
    Array.Fill(dp, 1);

    for (int i = 1; i < m; i++)
    {
        for (int j = 1; j < n; j++)
        {
            dp[j] = dp[j] + dp[j - 1];
        }
    }

    return dp[n - 1];
}
```

**Analysis:**
- Must compute all cells: O(m × n) unavoidable
- Can optimize space to O(n)

---

## Exercise 15: Longest Palindromic Substring

**Problem**: Find longest palindromic substring.

```csharp
// Time: O(n²) - Expand around center
// Space: O(1)
public string LongestPalindrome(string s)
{
    if (string.IsNullOrEmpty(s))
        return "";

    int start = 0;
    int maxLen = 1;

    for (int i = 0; i < s.Length; i++)
    {
        // Odd length palindromes (single center)
        int len1 = ExpandAroundCenter(s, i, i);

        // Even length palindromes (two centers)
        int len2 = ExpandAroundCenter(s, i, i + 1);

        int len = Math.Max(len1, len2);

        if (len > maxLen)
        {
            maxLen = len;
            start = i - (len - 1) / 2;
        }
    }

    return s.Substring(start, maxLen);
}

private int ExpandAroundCenter(string s, int left, int right)
{
    while (left >= 0 && right < s.Length && s[left] == s[right])
    {
        left--;
        right++;
    }

    return right - left - 1;
}

// Brute force: O(n³)
public string LongestPalindromeBruteForce(string s)
{
    int maxLen = 0;
    string longest = "";

    for (int i = 0; i < s.Length; i++)  // O(n)
    {
        for (int j = i; j < s.Length; j++)  // O(n)
        {
            string sub = s.Substring(i, j - i + 1);
            if (IsPalindrome(sub) && sub.Length > maxLen)  // O(n)
            {
                maxLen = sub.Length;
                longest = sub;
            }
        }
    }

    return longest;
}

private bool IsPalindrome(string s)
{
    int left = 0, right = s.Length - 1;
    while (left < right)
    {
        if (s[left] != s[right])
            return false;
        left++;
        right--;
    }
    return true;
}
```

**Analysis:**
- Expand around center: O(n²) - n centers, O(n) expansion each
- Brute force: O(n³) - all substrings, check each
- DP solution: O(n²) time, O(n²) space

---

## Exercise 16: Three Sum

**Problem**: Find all unique triplets that sum to zero.

```csharp
// Time: O(n²) - Sort + nested iteration
// Space: O(1) - Not counting output
public List<List<int>> ThreeSum(int[] nums)
{
    var result = new List<List<int>>();
    Array.Sort(nums);  // O(n log n)

    for (int i = 0; i < nums.Length - 2; i++)
    {
        // Skip duplicates for first element
        if (i > 0 && nums[i] == nums[i - 1])
            continue;

        int left = i + 1;
        int right = nums.Length - 1;
        int target = -nums[i];

        // Two pointers: O(n)
        while (left < right)
        {
            int sum = nums[left] + nums[right];

            if (sum == target)
            {
                result.Add(new List<int> { nums[i], nums[left], nums[right] });

                // Skip duplicates
                while (left < right && nums[left] == nums[left + 1])
                    left++;
                while (left < right && nums[right] == nums[right - 1])
                    right--;

                left++;
                right--;
            }
            else if (sum < target)
            {
                left++;
            }
            else
            {
                right--;
            }
        }
    }

    return result;
}

// Brute force: O(n³)
public List<List<int>> ThreeSumBruteForce(int[] nums)
{
    var result = new List<List<int>>();
    var seen = new HashSet<string>();

    for (int i = 0; i < nums.Length; i++)
    {
        for (int j = i + 1; j < nums.Length; j++)
        {
            for (int k = j + 1; k < nums.Length; k++)
            {
                if (nums[i] + nums[j] + nums[k] == 0)
                {
                    var triplet = new[] { nums[i], nums[j], nums[k] };
                    Array.Sort(triplet);
                    string key = string.Join(",", triplet);

                    if (!seen.Contains(key))
                    {
                        seen.Add(key);
                        result.Add(new List<int>(triplet));
                    }
                }
            }
        }
    }

    return result;
}
```

**Analysis:**
- Optimized: O(n log n) sort + O(n²) two pointers = O(n²)
- Brute force: O(n³)

---

## Exercise 17: Container With Most Water

**Problem**: Find two lines that contain most water with x-axis.

```csharp
// Time: O(n) - Two pointers (surprisingly not O(n²)!)
// Space: O(1)
public int MaxArea(int[] height)
{
    int left = 0;
    int right = height.Length - 1;
    int maxArea = 0;

    while (left < right)
    {
        int width = right - left;
        int h = Math.Min(height[left], height[right]);
        int area = width * h;

        maxArea = Math.Max(maxArea, area);

        // Move pointer with smaller height
        if (height[left] < height[right])
            left++;
        else
            right--;
    }

    return maxArea;
}

// Brute force: O(n²)
public int MaxAreaBruteForce(int[] height)
{
    int maxArea = 0;

    for (int i = 0; i < height.Length; i++)
    {
        for (int j = i + 1; j < height.Length; j++)
        {
            int width = j - i;
            int h = Math.Min(height[i], height[j]);
            int area = width * h;

            maxArea = Math.Max(maxArea, area);
        }
    }

    return maxArea;
}
```

**Note**: This looks like it should be here but is actually O(n)! Shows how two-pointer technique can optimize.

---

## Exercise 18: Generate Pascal's Triangle

**Problem**: Generate first n rows of Pascal's triangle.

```csharp
// Time: O(n²) - n rows, row i has i elements
// Space: O(n²) - Store all elements
public List<List<int>> Generate(int numRows)
{
    var triangle = new List<List<int>>();

    for (int i = 0; i < numRows; i++)
    {
        var row = new List<int>(new int[i + 1]);
        row[0] = 1;
        row[i] = 1;

        for (int j = 1; j < i; j++)
        {
            row[j] = triangle[i - 1][j - 1] + triangle[i - 1][j];
        }

        triangle.Add(row);
    }

    return triangle;
}
```

**Analysis:**
- Row 0: 1 element
- Row 1: 2 elements
- Row n-1: n elements
- Total: 1 + 2 + ... + n = n(n+1)/2 = O(n²)

---

## Exercise 19: Minimum Path Sum in Grid

**Problem**: Find path from top-left to bottom-right with minimum sum.

```csharp
// Time: O(m × n) - DP table
// Space: O(m × n) - DP table
public int MinPathSum(int[][] grid)
{
    int m = grid.Length;
    int n = grid[0].Length;

    int[,] dp = new int[m, n];
    dp[0, 0] = grid[0][0];

    // Initialize first row
    for (int j = 1; j < n; j++)
    {
        dp[0, j] = dp[0, j - 1] + grid[0][j];
    }

    // Initialize first column
    for (int i = 1; i < m; i++)
    {
        dp[i, 0] = dp[i - 1, 0] + grid[i][0];
    }

    // Fill rest of table
    for (int i = 1; i < m; i++)
    {
        for (int j = 1; j < n; j++)
        {
            dp[i, j] = grid[i][j] + Math.Min(dp[i - 1, j], dp[i, j - 1]);
        }
    }

    return dp[m - 1, n - 1];
}

// Space optimized: O(n)
public int MinPathSumOptimized(int[][] grid)
{
    int m = grid.Length;
    int n = grid[0].Length;
    int[] dp = new int[n];

    dp[0] = grid[0][0];

    for (int j = 1; j < n; j++)
    {
        dp[j] = dp[j - 1] + grid[0][j];
    }

    for (int i = 1; i < m; i++)
    {
        dp[0] += grid[i][0];

        for (int j = 1; j < n; j++)
        {
            dp[j] = grid[i][j] + Math.Min(dp[j], dp[j - 1]);
        }
    }

    return dp[n - 1];
}
```

---

## Exercise 20: Word Search in Grid

**Problem**: Find if word exists in grid (adjacent cells).

```csharp
// Time: O(m × n × 4^L) where L = word length
// Worst case checks all cells, each has 4 directions
// Space: O(L) - Recursion depth
public bool Exist(char[][] board, string word)
{
    int m = board.Length;
    int n = board[0].Length;

    for (int i = 0; i < m; i++)
    {
        for (int j = 0; j < n; j++)
        {
            if (DFS(board, word, i, j, 0))
                return true;
        }
    }

    return false;
}

private bool DFS(char[][] board, string word, int i, int j, int index)
{
    if (index == word.Length)
        return true;

    if (i < 0 || i >= board.Length ||
        j < 0 || j >= board[0].Length ||
        board[i][j] != word[index])
        return false;

    char temp = board[i][j];
    board[i][j] = '#';  // Mark as visited

    bool found = DFS(board, word, i + 1, j, index + 1) ||
                 DFS(board, word, i - 1, j, index + 1) ||
                 DFS(board, word, i, j + 1, index + 1) ||
                 DFS(board, word, i, j - 1, index + 1);

    board[i][j] = temp;  // Restore

    return found;
}
```

---

## Common Interview Questions

### Q1: "When is O(n²) acceptable?"
**Answer**:
- Small inputs (n < 1000-5000)
- No better algorithm exists (some problems are inherently quadratic)
- Simplicity matters more than performance
- Interview scenarios where you discuss optimization as follow-up

### Q2: "How can I recognize O(n²) in my code?"
**Answer**: Look for:
- Nested loops over the same or similar data
- Checking all pairs of elements
- For each element, scanning through all others
- Not always obvious - some O(n²) algorithms don't look nested

### Q3: "Can all O(n²) algorithms be optimized?"
**Answer**: Not always. Some problems:
- Matrix operations (rotation, transpose) genuinely need to touch all n² elements
- Some DP problems require O(n²) table
- However, many naive O(n²) solutions can be improved to O(n log n) or O(n) with better approach

### Q4: "Is bubble sort ever useful?"
**Answer**: Rarely in practice, but:
- Educational value (easy to understand)
- Nearly sorted data (can be O(n) with optimization)
- Very small arrays
- Situations requiring stable, in-place sort with no recursion

### Q5: "What's better than nested loops for finding pairs?"
**Answer**:
- Hash maps: O(n) time, O(n) space
- Two pointers (sorted data): O(n) time, O(1) space
- Sorting first: O(n log n) time, O(1) space

---

## Summary

O(n²) is common but often improvable. Key points:

- **Main Pattern**: Nested loops, checking all pairs
- **Sometimes Necessary**: Matrix operations, some DP problems
- **Often Avoidable**: Hash maps, two pointers, sorting can help
- **Acceptable**: Small inputs, no better algorithm, simplicity priority

**Next**: Move on to [Space-Complexity-Exercises.md](./Space-Complexity-Exercises.md) to master space complexity analysis!
