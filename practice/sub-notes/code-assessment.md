# Code Assessment Practice Exercises

Master coding challenges through hands-on practice. This file contains practical coding exercises commonly found in technical interviews.

---

## Core Code Assessment Questions

### 1. Async REST Fan-Out with Cancellation and Timeout

**Question:** You have to hit three quote endpoints in parallel and bail out if any call takes longer than 3 seconds, while still honoring upstream cancellation. Return only non-null quotes. Sketch the method you'd drop into the pricing client.

**Answer:**

```csharp
public static async Task<IReadOnlyList<Quote>> FetchQuotesAsync(HttpClient client, CancellationToken cancellationToken)
{
    using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
    cts.CancelAfter(TimeSpan.FromSeconds(3));

    var endpoints = new[] {"prices/eurusd", "prices/gbpusd", "prices/usdjpy"};
    var tasks = endpoints.Select(e => client.GetFromJsonAsync<Quote>(e, cts.Token)).ToArray();

    var results = await Task.WhenAll(tasks);
    return results!
        .Where(q => q is not null)
        .ToArray();
}
```

**Notes:** Use `CancellationTokenSource.CreateLinkedTokenSource` to respect upstream cancellation. Consider wrapping each call with `Try/Finally` or `Task.WhenAny` if partial failures should be tolerated instead of throwing.

---

### 2. LRU Cache for Price Lookups

**Question:** Implement an in-memory LRU cache (single-threaded is fine) for up to N price lookups with O(1) `Put`/`TryGet`. Show the class you would hand to another team to reuse in a console app.

**Answer:**

```csharp
public sealed class LruCache<TKey, TValue>
{
    private readonly int _capacity;
    private readonly Dictionary<TKey, LinkedListNode<(TKey Key, TValue Value)>> _map = new();
    private readonly LinkedList<(TKey Key, TValue Value)> _list = new();

    public LruCache(int capacity) => _capacity = capacity;

    public void Put(TKey key, TValue value)
    {
        if (_map.TryGetValue(key, out var node))
        {
            node.Value = (key, value);
            _list.Remove(node);
            _list.AddFirst(node);
            return;
        }

        if (_map.Count == _capacity)
        {
            var toRemove = _list.Last!;
            _map.Remove(toRemove.Value.Key);
            _list.RemoveLast();
        }

        var newNode = new LinkedListNode<(TKey, TValue)>((key, value));
        _list.AddFirst(newNode);
        _map[key] = newNode;
    }

    public bool TryGet(TKey key, out TValue value)
    {
        if (_map.TryGetValue(key, out var node))
        {
            _list.Remove(node);
            _list.AddFirst(node);
            value = node.Value.Value;
            return true;
        }

        value = default!;
        return false;
    }
}
```

**Notes:** `Put` and `TryGet` are O(1). Thread-safety can be added with `SemaphoreSlim` for async scenarios or `lock` for synchronous use.

---

### 3. Concurrent Producer/Consumer Pipeline for Order Enrichment

**Question:** We ingest orders into a channel and need to enrich them via an async call before publishing. Write the enrichment pipeline so it can fan out work and push enriched orders to the outbound channel.

**Answer:**

```csharp
public static async Task StartEnrichmentPipeline(Channel<Order> inbound, Func<Order, Task<Order>> enrich, Channel<Order> outbound)
{
    await foreach (var order in inbound.Reader.ReadAllAsync())
    {
        _ = Task.Run(async () =>
        {
            var enriched = await enrich(order);
            await outbound.Writer.WriteAsync(enriched);
        });
    }
}
```

**Notes:** Use `Channel.CreateBounded<Order>(capacity)` to add backpressure. For stricter ordering, await tasks or use `Parallel.ForEachAsync` with `MaxDegreeOfParallelism`.

---

### 4. SQL: Find Latest Fill Per Order

**Question:** Given a `fills` table with `order_id`, `fill_price`, and `filled_at`, write a query that returns only the most recent fill per order for a compliance report.

**Answer:**

```sql
-- PostgreSQL
SELECT DISTINCT ON (order_id) order_id, fill_price, filled_at
FROM fills
ORDER BY order_id, filled_at DESC;

-- SQL Server
WITH RankedFills AS (
    SELECT order_id, fill_price, filled_at,
           ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY filled_at DESC) AS rn
    FROM fills
)
SELECT order_id, fill_price, filled_at
FROM RankedFills
WHERE rn = 1;
```

**Notes:** `DISTINCT ON` is PostgreSQL-specific; in SQL Server, use `ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY filled_at DESC)` and filter on `ROW_NUMBER = 1`.

---

### 5. Minimal API Health Endpoint with Dependency Injection

**Question:** Expose a `/health` endpoint in a minimal API that reports `200` when a price feed is connected, otherwise `503`. Keep the composition root small and use DI for the feed implementation.

**Answer:**

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<IPriceFeed, PriceFeed>();
var app = builder.Build();

app.MapGet("/health", (IPriceFeed feed) => feed.IsConnected
    ? Results.Ok(new { status = "ok" })
    : Results.StatusCode(StatusCodes.Status503ServiceUnavailable));

await app.RunAsync();
```

**Notes:** Mapping the health check keeps the app's composition root small. Consider adding `UseHealthChecks` or custom readiness/liveness probes for Kubernetes deployments.

---

### 6. Secure Parameterized Data Access to Prevent SQL Injection

**Question:** Refactor a repository method that currently concatenates `accountId` into SQL. Show a safe, parameterized implementation that streams results asynchronously.

**Answer:**

```csharp
public async Task<IReadOnlyList<Order>> GetOrdersAsync(
    SqlConnection connection,
    int accountId,
    CancellationToken cancellationToken)
{
    const string sql = "SELECT order_id, symbol, qty, status FROM dbo.Orders WHERE account_id = @AccountId";

    await using var cmd = new SqlCommand(sql, connection);
    cmd.Parameters.Add(new SqlParameter("@AccountId", SqlDbType.Int) { Value = accountId });

    await using var reader = await cmd.ExecuteReaderAsync(cancellationToken);
    var orders = new List<Order>();
    while (await reader.ReadAsync(cancellationToken))
    {
        orders.Add(new Order
        {
            Id = reader.GetInt32(0),
            Symbol = reader.GetString(1),
            Quantity = reader.GetDecimal(2),
            Status = reader.GetString(3)
        });
    }

    return orders;
}
```

**Notes:** Always bind parameters instead of string interpolation to avoid SQL injection. Use least-privileged SQL logins and timeouts to limit blast radius, and validate `accountId` ranges before querying.

---

### 7. JWT Authentication with Audience Validation and Clock Skew Control

**Question:** You need to secure an API with JWT bearer auth. Configure validation to lock issuer/audience, tighten clock skew, and require a symmetric signing key from configuration. What does the startup code look like?

**Answer:**

```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "https://issuer.example.com",
            ValidateAudience = true,
            ValidAudience = "trading-api",
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1),
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:SigningKey"]))
        };
    });
```

**Notes:** Tighten `ClockSkew` to reduce replay windows, ensure HTTPS-only transport, and rotate signing keys. Add `RequireAuthorization()` on sensitive endpoints and propagate correlation IDs for audit logs.

---

### 8. Performance: Span-Based Parsing to Reduce Allocations

**Question:** We parse numeric quantities from protocol buffers and want to avoid string allocations. Implement a span-based parser that returns `-1` on invalid input.

**Answer:**

```csharp
public static int ParseQuantity(ReadOnlySpan<char> span)
{
    // Expects numeric ASCII; returns -1 for invalid input.
    int value = 0;
    foreach (var ch in span)
    {
        if ((uint)(ch - '0') > 9) return -1;
        value = unchecked(value * 10 + (ch - '0'));
    }
    return value;
}
```

**Notes:** Using `ReadOnlySpan<char>` avoids string allocations when parsing slices from protocol buffers or HTTP headers. Consider `int.TryParse(ReadOnlySpan<char>, NumberStyles, IFormatProvider, out int)` for built-in validation and benchmark with BenchmarkDotNet to confirm gains.

---

### 9. Performance: Async Streaming to Lower Memory Footprint

**Question:** Show how you would stream trades from an HTTP endpoint without buffering the whole payload, yielding trades as they arrive and honoring cancellation.

**Answer:**

```csharp
public static async IAsyncEnumerable<Trade> StreamTradesAsync(
    HttpClient client,
    [EnumeratorCancellation] CancellationToken cancellationToken)
{
    await using var stream = await client.GetStreamAsync("trades/stream", cancellationToken);
    await foreach (var trade in JsonSerializer.DeserializeAsyncEnumerable<Trade>(stream, cancellationToken: cancellationToken))
    {
        if (trade is not null)
            yield return trade;
    }
}
```

**Notes:** Streaming deserialization prevents buffering large payloads. Combine with `HttpClientFactory` for connection reuse and set `MaxResponseContentBufferSize` when buffering is unavoidable. Add defensive cancellation to avoid stuck I/O.

---

## Algorithm Implementation

### 10. QuickSort Implementation

**Question:** Implement QuickSort algorithm with in-place sorting. Explain time and space complexity.

**Answer:**

```csharp
public static void QuickSort<T>(T[] array, int left, int right) where T : IComparable<T>
{
    if (left < right)
    {
        int pivotIndex = Partition(array, left, right);
        QuickSort(array, left, pivotIndex - 1);
        QuickSort(array, pivotIndex + 1, right);
    }
}

private static int Partition<T>(T[] array, int left, int right) where T : IComparable<T>
{
    T pivot = array[right];
    int i = left - 1;

    for (int j = left; j < right; j++)
    {
        if (array[j].CompareTo(pivot) <= 0)
        {
            i++;
            Swap(array, i, j);
        }
    }

    Swap(array, i + 1, right);
    return i + 1;
}

private static void Swap<T>(T[] array, int i, int j)
{
    T temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

// Usage
var numbers = new[] { 5, 2, 9, 1, 7, 6, 3 };
QuickSort(numbers, 0, numbers.Length - 1);
```

**Complexity:**
- Time: O(n log n) average, O(n²) worst case
- Space: O(log n) for recursion stack

**Notes:** Use randomized pivot selection to avoid worst-case scenarios. For small subarrays, switch to insertion sort for better performance.

---

### 11. Binary Search Implementation

**Question:** Implement binary search for a sorted array. Return the index of the target or -1 if not found.

**Answer:**

```csharp
public static int BinarySearch<T>(T[] array, T target) where T : IComparable<T>
{
    int left = 0;
    int right = array.Length - 1;

    while (left <= right)
    {
        int mid = left + (right - left) / 2;  // Avoid overflow
        int comparison = array[mid].CompareTo(target);

        if (comparison == 0)
            return mid;
        else if (comparison < 0)
            left = mid + 1;
        else
            right = mid - 1;
    }

    return -1;  // Not found
}

// Recursive version
public static int BinarySearchRecursive<T>(T[] array, T target, int left, int right) where T : IComparable<T>
{
    if (left > right)
        return -1;

    int mid = left + (right - left) / 2;
    int comparison = array[mid].CompareTo(target);

    if (comparison == 0)
        return mid;
    else if (comparison < 0)
        return BinarySearchRecursive(array, target, mid + 1, right);
    else
        return BinarySearchRecursive(array, target, left, mid - 1);
}
```

**Complexity:**
- Time: O(log n)
- Space: O(1) iterative, O(log n) recursive

---

### 12. Merge Sort Implementation

**Question:** Implement merge sort algorithm. Explain why it's stable and when to prefer it over quicksort.

**Answer:**

```csharp
public static T[] MergeSort<T>(T[] array) where T : IComparable<T>
{
    if (array.Length <= 1)
        return array;

    int mid = array.Length / 2;
    T[] left = MergeSort(array.Take(mid).ToArray());
    T[] right = MergeSort(array.Skip(mid).ToArray());

    return Merge(left, right);
}

private static T[] Merge<T>(T[] left, T[] right) where T : IComparable<T>
{
    T[] result = new T[left.Length + right.Length];
    int i = 0, j = 0, k = 0;

    while (i < left.Length && j < right.Length)
    {
        if (left[i].CompareTo(right[j]) <= 0)
            result[k++] = left[i++];
        else
            result[k++] = right[j++];
    }

    while (i < left.Length)
        result[k++] = left[i++];

    while (j < right.Length)
        result[k++] = right[j++];

    return result;
}
```

**Complexity:**
- Time: O(n log n) guaranteed
- Space: O(n)

**Notes:** Merge sort is stable (preserves relative order of equal elements) and has guaranteed O(n log n) time. Prefer it when stability matters or when dealing with linked lists. QuickSort is faster in practice for arrays due to better cache locality.

---

### 13. Depth-First Search (DFS) on Graph

**Question:** Implement DFS traversal for a graph represented as an adjacency list.

**Answer:**

```csharp
public class Graph
{
    private Dictionary<int, List<int>> _adjacencyList = new();

    public void AddEdge(int from, int to)
    {
        if (!_adjacencyList.ContainsKey(from))
            _adjacencyList[from] = new List<int>();
        _adjacencyList[from].Add(to);
    }

    public List<int> DFS(int start)
    {
        var visited = new HashSet<int>();
        var result = new List<int>();
        DFSRecursive(start, visited, result);
        return result;
    }

    private void DFSRecursive(int node, HashSet<int> visited, List<int> result)
    {
        visited.Add(node);
        result.Add(node);

        if (_adjacencyList.ContainsKey(node))
        {
            foreach (var neighbor in _adjacencyList[node])
            {
                if (!visited.Contains(neighbor))
                    DFSRecursive(neighbor, visited, result);
            }
        }
    }

    // Iterative version using Stack
    public List<int> DFSIterative(int start)
    {
        var visited = new HashSet<int>();
        var result = new List<int>();
        var stack = new Stack<int>();

        stack.Push(start);

        while (stack.Count > 0)
        {
            int node = stack.Pop();

            if (!visited.Contains(node))
            {
                visited.Add(node);
                result.Add(node);

                if (_adjacencyList.ContainsKey(node))
                {
                    foreach (var neighbor in _adjacencyList[node].Reverse<int>())
                        stack.Push(neighbor);
                }
            }
        }

        return result;
    }
}
```

**Complexity:**
- Time: O(V + E) where V is vertices and E is edges
- Space: O(V) for visited set and recursion stack

---

### 14. Breadth-First Search (BFS) on Graph

**Question:** Implement BFS traversal and use it to find the shortest path between two nodes.

**Answer:**

```csharp
public class Graph
{
    private Dictionary<int, List<int>> _adjacencyList = new();

    public void AddEdge(int from, int to)
    {
        if (!_adjacencyList.ContainsKey(from))
            _adjacencyList[from] = new List<int>();
        _adjacencyList[from].Add(to);
    }

    public List<int> BFS(int start)
    {
        var visited = new HashSet<int>();
        var result = new List<int>();
        var queue = new Queue<int>();

        queue.Enqueue(start);
        visited.Add(start);

        while (queue.Count > 0)
        {
            int node = queue.Dequeue();
            result.Add(node);

            if (_adjacencyList.ContainsKey(node))
            {
                foreach (var neighbor in _adjacencyList[node])
                {
                    if (!visited.Contains(neighbor))
                    {
                        visited.Add(neighbor);
                        queue.Enqueue(neighbor);
                    }
                }
            }
        }

        return result;
    }

    public List<int> ShortestPath(int start, int end)
    {
        var parent = new Dictionary<int, int>();
        var visited = new HashSet<int>();
        var queue = new Queue<int>();

        queue.Enqueue(start);
        visited.Add(start);
        parent[start] = -1;

        while (queue.Count > 0)
        {
            int node = queue.Dequeue();

            if (node == end)
                break;

            if (_adjacencyList.ContainsKey(node))
            {
                foreach (var neighbor in _adjacencyList[node])
                {
                    if (!visited.Contains(neighbor))
                    {
                        visited.Add(neighbor);
                        parent[neighbor] = node;
                        queue.Enqueue(neighbor);
                    }
                }
            }
        }

        // Reconstruct path
        var path = new List<int>();
        if (parent.ContainsKey(end))
        {
            int current = end;
            while (current != -1)
            {
                path.Add(current);
                current = parent[current];
            }
            path.Reverse();
        }

        return path;
    }
}
```

**Complexity:**
- Time: O(V + E)
- Space: O(V)

---

### 15. Dijkstra's Shortest Path Algorithm

**Question:** Implement Dijkstra's algorithm for finding shortest paths in a weighted graph.

**Answer:**

```csharp
public class WeightedGraph
{
    private Dictionary<int, List<(int node, int weight)>> _adjacencyList = new();

    public void AddEdge(int from, int to, int weight)
    {
        if (!_adjacencyList.ContainsKey(from))
            _adjacencyList[from] = new List<(int, int)>();
        _adjacencyList[from].Add((to, weight));
    }

    public Dictionary<int, int> Dijkstra(int start)
    {
        var distances = new Dictionary<int, int>();
        var priorityQueue = new PriorityQueue<int, int>();
        var visited = new HashSet<int>();

        // Initialize distances
        foreach (var node in _adjacencyList.Keys)
            distances[node] = int.MaxValue;
        distances[start] = 0;

        priorityQueue.Enqueue(start, 0);

        while (priorityQueue.Count > 0)
        {
            int current = priorityQueue.Dequeue();

            if (visited.Contains(current))
                continue;

            visited.Add(current);

            if (_adjacencyList.ContainsKey(current))
            {
                foreach (var (neighbor, weight) in _adjacencyList[current])
                {
                    int newDistance = distances[current] + weight;

                    if (newDistance < distances[neighbor])
                    {
                        distances[neighbor] = newDistance;
                        priorityQueue.Enqueue(neighbor, newDistance);
                    }
                }
            }
        }

        return distances;
    }
}
```

**Complexity:**
- Time: O((V + E) log V) with priority queue
- Space: O(V)

---

## Data Structure Design

### 16. Custom Min Stack

**Question:** Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

**Answer:**

```csharp
public class MinStack
{
    private Stack<int> _stack = new();
    private Stack<int> _minStack = new();

    public void Push(int value)
    {
        _stack.Push(value);

        if (_minStack.Count == 0 || value <= _minStack.Peek())
            _minStack.Push(value);
    }

    public int Pop()
    {
        int value = _stack.Pop();

        if (value == _minStack.Peek())
            _minStack.Pop();

        return value;
    }

    public int Top() => _stack.Peek();

    public int GetMin() => _minStack.Peek();
}

// Alternative single-stack approach
public class MinStackSingle
{
    private Stack<(int value, int min)> _stack = new();

    public void Push(int value)
    {
        int min = _stack.Count == 0 ? value : Math.Min(value, _stack.Peek().min);
        _stack.Push((value, min));
    }

    public int Pop() => _stack.Pop().value;

    public int Top() => _stack.Peek().value;

    public int GetMin() => _stack.Peek().min;
}
```

**Complexity:** All operations O(1)

---

### 17. Binary Search Tree Implementation

**Question:** Implement a binary search tree with insert, search, and in-order traversal.

**Answer:**

```csharp
public class BSTNode<T> where T : IComparable<T>
{
    public T Value { get; set; }
    public BSTNode<T> Left { get; set; }
    public BSTNode<T> Right { get; set; }

    public BSTNode(T value)
    {
        Value = value;
    }
}

public class BinarySearchTree<T> where T : IComparable<T>
{
    private BSTNode<T> _root;

    public void Insert(T value)
    {
        _root = InsertRecursive(_root, value);
    }

    private BSTNode<T> InsertRecursive(BSTNode<T> node, T value)
    {
        if (node == null)
            return new BSTNode<T>(value);

        int comparison = value.CompareTo(node.Value);

        if (comparison < 0)
            node.Left = InsertRecursive(node.Left, value);
        else if (comparison > 0)
            node.Right = InsertRecursive(node.Right, value);

        return node;
    }

    public bool Search(T value)
    {
        return SearchRecursive(_root, value);
    }

    private bool SearchRecursive(BSTNode<T> node, T value)
    {
        if (node == null)
            return false;

        int comparison = value.CompareTo(node.Value);

        if (comparison == 0)
            return true;
        else if (comparison < 0)
            return SearchRecursive(node.Left, value);
        else
            return SearchRecursive(node.Right, value);
    }

    public List<T> InOrderTraversal()
    {
        var result = new List<T>();
        InOrderRecursive(_root, result);
        return result;
    }

    private void InOrderRecursive(BSTNode<T> node, List<T> result)
    {
        if (node == null)
            return;

        InOrderRecursive(node.Left, result);
        result.Add(node.Value);
        InOrderRecursive(node.Right, result);
    }
}
```

**Complexity:**
- Insert/Search: O(log n) average, O(n) worst case
- Traversal: O(n)

---

### 18. Min Heap Implementation

**Question:** Implement a min heap with insert and extract-min operations.

**Answer:**

```csharp
public class MinHeap<T> where T : IComparable<T>
{
    private List<T> _heap = new();

    public int Count => _heap.Count;

    public void Insert(T value)
    {
        _heap.Add(value);
        HeapifyUp(_heap.Count - 1);
    }

    public T ExtractMin()
    {
        if (_heap.Count == 0)
            throw new InvalidOperationException("Heap is empty");

        T min = _heap[0];
        _heap[0] = _heap[^1];
        _heap.RemoveAt(_heap.Count - 1);

        if (_heap.Count > 0)
            HeapifyDown(0);

        return min;
    }

    public T Peek()
    {
        if (_heap.Count == 0)
            throw new InvalidOperationException("Heap is empty");

        return _heap[0];
    }

    private void HeapifyUp(int index)
    {
        while (index > 0)
        {
            int parentIndex = (index - 1) / 2;

            if (_heap[index].CompareTo(_heap[parentIndex]) >= 0)
                break;

            Swap(index, parentIndex);
            index = parentIndex;
        }
    }

    private void HeapifyDown(int index)
    {
        while (true)
        {
            int smallest = index;
            int leftChild = 2 * index + 1;
            int rightChild = 2 * index + 2;

            if (leftChild < _heap.Count && _heap[leftChild].CompareTo(_heap[smallest]) < 0)
                smallest = leftChild;

            if (rightChild < _heap.Count && _heap[rightChild].CompareTo(_heap[smallest]) < 0)
                smallest = rightChild;

            if (smallest == index)
                break;

            Swap(index, smallest);
            index = smallest;
        }
    }

    private void Swap(int i, int j)
    {
        T temp = _heap[i];
        _heap[i] = _heap[j];
        _heap[j] = temp;
    }
}
```

**Complexity:**
- Insert: O(log n)
- Extract-Min: O(log n)
- Peek: O(1)

---

### 19. Trie (Prefix Tree) Implementation

**Question:** Implement a trie for efficient string prefix searches.

**Answer:**

```csharp
public class TrieNode
{
    public Dictionary<char, TrieNode> Children { get; } = new();
    public bool IsEndOfWord { get; set; }
}

public class Trie
{
    private readonly TrieNode _root = new();

    public void Insert(string word)
    {
        var current = _root;

        foreach (char ch in word)
        {
            if (!current.Children.ContainsKey(ch))
                current.Children[ch] = new TrieNode();

            current = current.Children[ch];
        }

        current.IsEndOfWord = true;
    }

    public bool Search(string word)
    {
        var node = FindNode(word);
        return node != null && node.IsEndOfWord;
    }

    public bool StartsWith(string prefix)
    {
        return FindNode(prefix) != null;
    }

    private TrieNode FindNode(string prefix)
    {
        var current = _root;

        foreach (char ch in prefix)
        {
            if (!current.Children.ContainsKey(ch))
                return null;

            current = current.Children[ch];
        }

        return current;
    }

    public List<string> AutoComplete(string prefix)
    {
        var results = new List<string>();
        var node = FindNode(prefix);

        if (node == null)
            return results;

        CollectWords(node, prefix, results);
        return results;
    }

    private void CollectWords(TrieNode node, string currentWord, List<string> results)
    {
        if (node.IsEndOfWord)
            results.Add(currentWord);

        foreach (var (ch, childNode) in node.Children)
        {
            CollectWords(childNode, currentWord + ch, results);
        }
    }
}
```

**Complexity:**
- Insert: O(m) where m is word length
- Search: O(m)
- StartsWith: O(m)

---

### 20. LFU (Least Frequently Used) Cache

**Question:** Implement an LFU cache with O(1) get and put operations.

**Answer:**

```csharp
public class LFUCache<TKey, TValue>
{
    private class Node
    {
        public TKey Key { get; set; }
        public TValue Value { get; set; }
        public int Frequency { get; set; }
    }

    private readonly int _capacity;
    private int _minFrequency;
    private readonly Dictionary<TKey, Node> _cache = new();
    private readonly Dictionary<int, LinkedList<Node>> _frequencyMap = new();
    private readonly Dictionary<TKey, LinkedListNode<Node>> _nodeMap = new();

    public LFUCache(int capacity)
    {
        _capacity = capacity;
        _minFrequency = 0;
    }

    public bool TryGet(TKey key, out TValue value)
    {
        if (!_cache.TryGetValue(key, out var node))
        {
            value = default;
            return false;
        }

        UpdateFrequency(node);
        value = node.Value;
        return true;
    }

    public void Put(TKey key, TValue value)
    {
        if (_capacity <= 0)
            return;

        if (_cache.TryGetValue(key, out var existingNode))
        {
            existingNode.Value = value;
            UpdateFrequency(existingNode);
            return;
        }

        if (_cache.Count >= _capacity)
        {
            var listToRemoveFrom = _frequencyMap[_minFrequency];
            var nodeToRemove = listToRemoveFrom.Last!.Value;
            listToRemoveFrom.RemoveLast();
            _cache.Remove(nodeToRemove.Key);
            _nodeMap.Remove(nodeToRemove.Key);
        }

        var newNode = new Node { Key = key, Value = value, Frequency = 1 };
        _cache[key] = newNode;

        if (!_frequencyMap.ContainsKey(1))
            _frequencyMap[1] = new LinkedList<Node>();

        var linkedNode = _frequencyMap[1].AddFirst(newNode);
        _nodeMap[key] = linkedNode;
        _minFrequency = 1;
    }

    private void UpdateFrequency(Node node)
    {
        int freq = node.Frequency;
        var listNode = _nodeMap[node.Key];

        _frequencyMap[freq].Remove(listNode);

        if (_frequencyMap[freq].Count == 0 && freq == _minFrequency)
            _minFrequency++;

        node.Frequency++;
        if (!_frequencyMap.ContainsKey(node.Frequency))
            _frequencyMap[node.Frequency] = new LinkedList<Node>();

        var newListNode = _frequencyMap[node.Frequency].AddFirst(node);
        _nodeMap[node.Key] = newListNode;
    }
}
```

**Complexity:** Both get and put are O(1)

---

## String Manipulation

### 21. String Compression

**Question:** Implement string compression using counts of repeated characters. If compressed string is not smaller, return original.

**Answer:**

```csharp
public static string Compress(string input)
{
    if (string.IsNullOrEmpty(input))
        return input;

    var sb = new StringBuilder();
    int count = 1;

    for (int i = 1; i < input.Length; i++)
    {
        if (input[i] == input[i - 1])
        {
            count++;
        }
        else
        {
            sb.Append(input[i - 1]);
            sb.Append(count);
            count = 1;
        }
    }

    // Append the last character and its count
    sb.Append(input[^1]);
    sb.Append(count);

    string compressed = sb.ToString();
    return compressed.Length < input.Length ? compressed : input;
}

// Example: "aabcccccaaa" -> "a2b1c5a3"
```

**Complexity:**
- Time: O(n)
- Space: O(n)

---

### 22. Palindrome Check with Preprocessing

**Question:** Check if a string is a palindrome, ignoring spaces, punctuation, and case.

**Answer:**

```csharp
public static bool IsPalindrome(string input)
{
    if (string.IsNullOrEmpty(input))
        return true;

    int left = 0;
    int right = input.Length - 1;

    while (left < right)
    {
        while (left < right && !char.IsLetterOrDigit(input[left]))
            left++;

        while (left < right && !char.IsLetterOrDigit(input[right]))
            right--;

        if (char.ToLower(input[left]) != char.ToLower(input[right]))
            return false;

        left++;
        right--;
    }

    return true;
}

// Examples:
// "A man, a plan, a canal: Panama" -> true
// "race a car" -> false
```

**Complexity:**
- Time: O(n)
- Space: O(1)

---

### 23. Longest Substring Without Repeating Characters

**Question:** Find the length of the longest substring without repeating characters.

**Answer:**

```csharp
public static int LengthOfLongestSubstring(string s)
{
    var charIndex = new Dictionary<char, int>();
    int maxLength = 0;
    int start = 0;

    for (int end = 0; end < s.Length; end++)
    {
        char currentChar = s[end];

        if (charIndex.ContainsKey(currentChar) && charIndex[currentChar] >= start)
        {
            start = charIndex[currentChar] + 1;
        }

        charIndex[currentChar] = end;
        maxLength = Math.Max(maxLength, end - start + 1);
    }

    return maxLength;
}

// Example: "abcabcbb" -> 3 ("abc")
// Example: "bbbbb" -> 1 ("b")
// Example: "pwwkew" -> 3 ("wke")
```

**Complexity:**
- Time: O(n)
- Space: O(min(n, m)) where m is charset size

---

### 24. String Pattern Matching (KMP Algorithm)

**Question:** Implement the KMP (Knuth-Morris-Pratt) algorithm for pattern matching.

**Answer:**

```csharp
public static int KMPSearch(string text, string pattern)
{
    if (string.IsNullOrEmpty(pattern))
        return 0;

    int[] lps = ComputeLPSArray(pattern);
    int i = 0; // index for text
    int j = 0; // index for pattern

    while (i < text.Length)
    {
        if (text[i] == pattern[j])
        {
            i++;
            j++;
        }

        if (j == pattern.Length)
            return i - j; // Pattern found

        if (i < text.Length && text[i] != pattern[j])
        {
            if (j != 0)
                j = lps[j - 1];
            else
                i++;
        }
    }

    return -1; // Pattern not found
}

private static int[] ComputeLPSArray(string pattern)
{
    int[] lps = new int[pattern.Length];
    int len = 0;
    int i = 1;

    while (i < pattern.Length)
    {
        if (pattern[i] == pattern[len])
        {
            len++;
            lps[i] = len;
            i++;
        }
        else
        {
            if (len != 0)
                len = lps[len - 1];
            else
            {
                lps[i] = 0;
                i++;
            }
        }
    }

    return lps;
}
```

**Complexity:**
- Time: O(n + m) where n is text length, m is pattern length
- Space: O(m)

---

### 25. Anagram Grouping

**Question:** Group an array of strings into anagrams.

**Answer:**

```csharp
public static List<List<string>> GroupAnagrams(string[] strings)
{
    var groups = new Dictionary<string, List<string>>();

    foreach (var str in strings)
    {
        var sorted = new string(str.OrderBy(c => c).ToArray());

        if (!groups.ContainsKey(sorted))
            groups[sorted] = new List<string>();

        groups[sorted].Add(str);
    }

    return groups.Values.ToList();
}

// Alternative: Using character count as key
public static List<List<string>> GroupAnagramsOptimized(string[] strings)
{
    var groups = new Dictionary<string, List<string>>();

    foreach (var str in strings)
    {
        var count = new int[26];
        foreach (char c in str)
            count[c - 'a']++;

        string key = string.Join(",", count);

        if (!groups.ContainsKey(key))
            groups[key] = new List<string>();

        groups[key].Add(str);
    }

    return groups.Values.ToList();
}

// Example: ["eat","tea","tan","ate","nat","bat"]
// Output: [["bat"],["nat","tan"],["ate","eat","tea"]]
```

**Complexity:**
- Time: O(n * k log k) where k is max string length (or O(n * k) for optimized)
- Space: O(n * k)

---

## Array and Matrix Problems

### 26. Two Sum Problem

**Question:** Find two numbers in an array that add up to a target sum.

**Answer:**

```csharp
public static int[] TwoSum(int[] numbers, int target)
{
    var map = new Dictionary<int, int>();

    for (int i = 0; i < numbers.Length; i++)
    {
        int complement = target - numbers[i];

        if (map.ContainsKey(complement))
            return new[] { map[complement], i };

        map[numbers[i]] = i;
    }

    return null; // No solution found
}

// For sorted array (two-pointer approach)
public static int[] TwoSumSorted(int[] numbers, int target)
{
    int left = 0;
    int right = numbers.Length - 1;

    while (left < right)
    {
        int sum = numbers[left] + numbers[right];

        if (sum == target)
            return new[] { left, right };
        else if (sum < target)
            left++;
        else
            right--;
    }

    return null;
}
```

**Complexity:**
- Hash map approach: O(n) time, O(n) space
- Two-pointer approach: O(n) time, O(1) space

---

### 27. Rotate Matrix 90 Degrees

**Question:** Rotate an N×N matrix 90 degrees clockwise in-place.

**Answer:**

```csharp
public static void RotateMatrix(int[][] matrix)
{
    int n = matrix.Length;

    // Transpose the matrix
    for (int i = 0; i < n; i++)
    {
        for (int j = i + 1; j < n; j++)
        {
            int temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }

    // Reverse each row
    for (int i = 0; i < n; i++)
    {
        Array.Reverse(matrix[i]);
    }
}

// Example:
// [1,2,3]    [7,4,1]
// [4,5,6] -> [8,5,2]
// [7,8,9]    [9,6,3]
```

**Complexity:**
- Time: O(n²)
- Space: O(1)

---

### 28. Spiral Matrix Traversal

**Question:** Return all elements of a matrix in spiral order.

**Answer:**

```csharp
public static List<int> SpiralOrder(int[][] matrix)
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
        for (int i = left; i <= right; i++)
            result.Add(matrix[top][i]);
        top++;

        // Traverse down
        for (int i = top; i <= bottom; i++)
            result.Add(matrix[i][right]);
        right--;

        // Traverse left
        if (top <= bottom)
        {
            for (int i = right; i >= left; i--)
                result.Add(matrix[bottom][i]);
            bottom--;
        }

        // Traverse up
        if (left <= right)
        {
            for (int i = bottom; i >= top; i--)
                result.Add(matrix[i][left]);
            left++;
        }
    }

    return result;
}
```

**Complexity:**
- Time: O(m * n)
- Space: O(1) excluding output

---

### 29. Maximum Subarray Sum (Kadane's Algorithm)

**Question:** Find the contiguous subarray with the maximum sum.

**Answer:**

```csharp
public static int MaxSubarraySum(int[] numbers)
{
    int maxSum = numbers[0];
    int currentSum = numbers[0];

    for (int i = 1; i < numbers.Length; i++)
    {
        currentSum = Math.Max(numbers[i], currentSum + numbers[i]);
        maxSum = Math.Max(maxSum, currentSum);
    }

    return maxSum;
}

// With indices
public static (int maxSum, int start, int end) MaxSubarraySumWithIndices(int[] numbers)
{
    int maxSum = numbers[0];
    int currentSum = numbers[0];
    int start = 0, end = 0, tempStart = 0;

    for (int i = 1; i < numbers.Length; i++)
    {
        if (numbers[i] > currentSum + numbers[i])
        {
            currentSum = numbers[i];
            tempStart = i;
        }
        else
        {
            currentSum += numbers[i];
        }

        if (currentSum > maxSum)
        {
            maxSum = currentSum;
            start = tempStart;
            end = i;
        }
    }

    return (maxSum, start, end);
}
```

**Complexity:**
- Time: O(n)
- Space: O(1)

---

### 30. Merge Intervals

**Question:** Merge overlapping intervals.

**Answer:**

```csharp
public class Interval
{
    public int Start { get; set; }
    public int End { get; set; }
}

public static List<Interval> MergeIntervals(List<Interval> intervals)
{
    if (intervals.Count <= 1)
        return intervals;

    // Sort by start time
    intervals.Sort((a, b) => a.Start.CompareTo(b.Start));

    var merged = new List<Interval>();
    var current = intervals[0];

    for (int i = 1; i < intervals.Count; i++)
    {
        if (intervals[i].Start <= current.End)
        {
            // Overlapping intervals, merge them
            current.End = Math.Max(current.End, intervals[i].End);
        }
        else
        {
            // Non-overlapping interval, add current and move to next
            merged.Add(current);
            current = intervals[i];
        }
    }

    merged.Add(current);
    return merged;
}

// Example: [[1,3],[2,6],[8,10],[15,18]] -> [[1,6],[8,10],[15,18]]
```

**Complexity:**
- Time: O(n log n) due to sorting
- Space: O(n)

---

## Performance Optimization Challenges

### 31. Object Pooling for High-Frequency Allocations

**Question:** Implement an object pool to reduce GC pressure for frequently allocated objects.

**Answer:**

```csharp
public class ObjectPool<T> where T : class, new()
{
    private readonly ConcurrentBag<T> _objects = new();
    private readonly Func<T> _objectGenerator;
    private readonly Action<T> _resetAction;

    public ObjectPool(Func<T> objectGenerator = null, Action<T> resetAction = null)
    {
        _objectGenerator = objectGenerator ?? (() => new T());
        _resetAction = resetAction ?? (_ => { });
    }

    public T Rent()
    {
        return _objects.TryTake(out T item) ? item : _objectGenerator();
    }

    public void Return(T item)
    {
        _resetAction(item);
        _objects.Add(item);
    }
}

// Usage example
public class OrderProcessor
{
    private static readonly ObjectPool<StringBuilder> _stringBuilderPool = new(
        () => new StringBuilder(256),
        sb => sb.Clear()
    );

    public string FormatOrder(Order order)
    {
        var sb = _stringBuilderPool.Rent();
        try
        {
            sb.Append("Order #").Append(order.Id);
            sb.Append(" - Amount: ").Append(order.Amount);
            return sb.ToString();
        }
        finally
        {
            _stringBuilderPool.Return(sb);
        }
    }
}
```

**Notes:** Use `ObjectPool<T>` from Microsoft.Extensions.ObjectPool in production. Custom implementations should handle thread safety.

---

### 32. Batch Processing for Database Operations

**Question:** Optimize database inserts by batching operations.

**Answer:**

```csharp
public class BatchedRepository
{
    private readonly DbContext _context;
    private const int BatchSize = 1000;

    public async Task BulkInsertOrdersAsync(IEnumerable<Order> orders)
    {
        var batch = new List<Order>(BatchSize);

        foreach (var order in orders)
        {
            batch.Add(order);

            if (batch.Count >= BatchSize)
            {
                await _context.Orders.AddRangeAsync(batch);
                await _context.SaveChangesAsync();
                batch.Clear();
                _context.ChangeTracker.Clear(); // Prevent memory bloat
            }
        }

        // Insert remaining items
        if (batch.Count > 0)
        {
            await _context.Orders.AddRangeAsync(batch);
            await _context.SaveChangesAsync();
        }
    }

    // Using bulk insert library for better performance
    public async Task BulkInsertOptimizedAsync(IEnumerable<Order> orders)
    {
        // Using EFCore.BulkExtensions or similar
        await _context.BulkInsertAsync(orders.ToList());
    }
}
```

**Performance gains:** 10-100x faster than individual inserts

---

### 33. Memoization for Expensive Calculations

**Question:** Implement memoization to cache expensive function results.

**Answer:**

```csharp
public class Memoizer<TKey, TResult>
{
    private readonly ConcurrentDictionary<TKey, Lazy<TResult>> _cache = new();
    private readonly Func<TKey, TResult> _function;

    public Memoizer(Func<TKey, TResult> function)
    {
        _function = function ?? throw new ArgumentNullException(nameof(function));
    }

    public TResult GetOrCompute(TKey key)
    {
        return _cache.GetOrAdd(key, k => new Lazy<TResult>(() => _function(k))).Value;
    }

    public void Clear() => _cache.Clear();
}

// Usage: Fibonacci with memoization
public class FibonacciCalculator
{
    private readonly Memoizer<int, long> _memoizer;

    public FibonacciCalculator()
    {
        _memoizer = new Memoizer<int, long>(ComputeFibonacci);
    }

    private long ComputeFibonacci(int n)
    {
        if (n <= 1)
            return n;

        return _memoizer.GetOrCompute(n - 1) + _memoizer.GetOrCompute(n - 2);
    }

    public long Calculate(int n) => _memoizer.GetOrCompute(n);
}
```

**Notes:** `Lazy<T>` ensures thread-safe, one-time initialization even under concurrent access.

---

### 34. ArrayPool for Reducing Array Allocations

**Question:** Use `ArrayPool<T>` to reduce allocations in performance-critical code.

**Answer:**

```csharp
public class BufferProcessor
{
    public static byte[] ProcessData(byte[] input)
    {
        // Rent buffer from pool
        byte[] buffer = ArrayPool<byte>.Shared.Rent(input.Length * 2);

        try
        {
            // Process data using buffer
            for (int i = 0; i < input.Length; i++)
            {
                buffer[i * 2] = input[i];
                buffer[i * 2 + 1] = (byte)(input[i] ^ 0xFF);
            }

            // Create result array with exact size
            var result = new byte[input.Length * 2];
            Array.Copy(buffer, result, result.Length);
            return result;
        }
        finally
        {
            // Always return buffer to pool
            ArrayPool<byte>.Shared.Return(buffer);
        }
    }
}

// Async streaming with ArrayPool
public static async Task ProcessLargeFileAsync(Stream input, Stream output)
{
    byte[] buffer = ArrayPool<byte>.Shared.Rent(4096);

    try
    {
        int bytesRead;
        while ((bytesRead = await input.ReadAsync(buffer, 0, buffer.Length)) > 0)
        {
            // Process buffer
            for (int i = 0; i < bytesRead; i++)
                buffer[i] = (byte)(buffer[i] ^ 0xFF);

            await output.WriteAsync(buffer, 0, bytesRead);
        }
    }
    finally
    {
        ArrayPool<byte>.Shared.Return(buffer);
    }
}
```

**Performance:** Eliminates GC pressure from temporary buffers

---

## Concurrent Programming Problems

### 35. Producer-Consumer with BlockingCollection

**Question:** Implement a thread-safe producer-consumer pattern.

**Answer:**

```csharp
public class ProducerConsumer
{
    private readonly BlockingCollection<WorkItem> _queue = new(boundedCapacity: 100);

    public void StartProducers(int count)
    {
        for (int i = 0; i < count; i++)
        {
            int producerId = i;
            Task.Run(() => Producer(producerId));
        }
    }

    public void StartConsumers(int count)
    {
        for (int i = 0; i < count; i++)
        {
            int consumerId = i;
            Task.Run(() => Consumer(consumerId));
        }
    }

    private void Producer(int id)
    {
        try
        {
            for (int i = 0; i < 10; i++)
            {
                var item = new WorkItem { Id = $"P{id}-{i}", Data = $"Data from producer {id}" };
                _queue.Add(item);
                Console.WriteLine($"Producer {id} added {item.Id}");
                Thread.Sleep(100);
            }
        }
        catch (InvalidOperationException)
        {
            // Collection was completed
        }
    }

    private void Consumer(int id)
    {
        try
        {
            foreach (var item in _queue.GetConsumingEnumerable())
            {
                Console.WriteLine($"Consumer {id} processing {item.Id}");
                Thread.Sleep(200); // Simulate work
            }
        }
        catch (InvalidOperationException)
        {
            // Collection was completed
        }
    }

    public void Complete()
    {
        _queue.CompleteAdding();
    }
}

public class WorkItem
{
    public string Id { get; set; }
    public string Data { get; set; }
}
```

---

### 36. Parallel.ForEach with Degree of Parallelism

**Question:** Process items in parallel with controlled concurrency.

**Answer:**

```csharp
public async Task ProcessOrdersInParallelAsync(List<Order> orders)
{
    var options = new ParallelOptions
    {
        MaxDegreeOfParallelism = Environment.ProcessorCount,
        CancellationToken = CancellationToken.None
    };

    await Parallel.ForEachAsync(orders, options, async (order, ct) =>
    {
        await ProcessOrderAsync(order, ct);
    });
}

// With custom partitioning for better load balancing
public void ProcessWithPartitioning<T>(IEnumerable<T> items, Action<T> process)
{
    var partitioner = Partitioner.Create(items, EnumerablePartitionerOptions.NoBuffering);

    Parallel.ForEach(partitioner, new ParallelOptions
    {
        MaxDegreeOfParallelism = Environment.ProcessorCount
    }, item =>
    {
        process(item);
    });
}

// Thread-safe aggregation
public int ParallelSum(int[] numbers)
{
    int total = 0;

    Parallel.ForEach(numbers, () => 0, // Local init
        (item, state, localSum) => localSum + item, // Body
        localSum => Interlocked.Add(ref total, localSum)); // Local finally

    return total;
}
```

---

### 37. Async Throttling with SemaphoreSlim

**Question:** Limit concurrent async operations to prevent resource exhaustion.

**Answer:**

```csharp
public class ThrottledHttpClient
{
    private readonly HttpClient _httpClient;
    private readonly SemaphoreSlim _semaphore;

    public ThrottledHttpClient(HttpClient httpClient, int maxConcurrency = 10)
    {
        _httpClient = httpClient;
        _semaphore = new SemaphoreSlim(maxConcurrency, maxConcurrency);
    }

    public async Task<string> GetAsync(string url, CancellationToken cancellationToken = default)
    {
        await _semaphore.WaitAsync(cancellationToken);
        try
        {
            return await _httpClient.GetStringAsync(url, cancellationToken);
        }
        finally
        {
            _semaphore.Release();
        }
    }

    public async Task<List<string>> FetchAllAsync(IEnumerable<string> urls, CancellationToken cancellationToken = default)
    {
        var tasks = urls.Select(url => GetAsync(url, cancellationToken));
        return (await Task.WhenAll(tasks)).ToList();
    }
}

// Usage
var client = new ThrottledHttpClient(httpClient, maxConcurrency: 5);
var results = await client.FetchAllAsync(urls, cancellationToken);
```

---

### 38. Thread-Safe Lazy Initialization

**Question:** Implement thread-safe lazy initialization patterns.

**Answer:**

```csharp
// Using Lazy<T> (recommended)
public class SingletonService
{
    private static readonly Lazy<SingletonService> _instance =
        new Lazy<SingletonService>(() => new SingletonService(), LazyThreadSafetyMode.ExecutionAndPublication);

    private SingletonService()
    {
        // Expensive initialization
    }

    public static SingletonService Instance => _instance.Value;
}

// Double-check locking pattern
public class ConfigurationManager
{
    private static volatile ConfigurationManager _instance;
    private static readonly object _lock = new object();

    private ConfigurationManager()
    {
        // Load configuration
    }

    public static ConfigurationManager Instance
    {
        get
        {
            if (_instance == null)
            {
                lock (_lock)
                {
                    if (_instance == null)
                    {
                        _instance = new ConfigurationManager();
                    }
                }
            }
            return _instance;
        }
    }
}

// Async lazy initialization
public class AsyncLazy<T>
{
    private readonly Lazy<Task<T>> _instance;

    public AsyncLazy(Func<Task<T>> factory)
    {
        _instance = new Lazy<Task<T>>(() => Task.Run(factory));
    }

    public Task<T> Value => _instance.Value;
}

// Usage
private static readonly AsyncLazy<DatabaseConnection> _connection =
    new AsyncLazy<DatabaseConnection>(async () => await DatabaseConnection.CreateAsync());
```

---

## Security Best Practices

### 39. Input Validation and Sanitization

**Question:** Implement comprehensive input validation for API endpoints.

**Answer:**

```csharp
public class OrderRequest
{
    [Required]
    [StringLength(50, MinimumLength = 1)]
    [RegularExpression(@"^[a-zA-Z0-9-]+$")]
    public string OrderId { get; set; }

    [Range(0.01, 1000000)]
    public decimal Amount { get; set; }

    [Required]
    [EmailAddress]
    public string CustomerEmail { get; set; }

    [Url]
    public string CallbackUrl { get; set; }
}

public class OrderValidator : AbstractValidator<OrderRequest>
{
    public OrderValidator()
    {
        RuleFor(x => x.OrderId)
            .NotEmpty()
            .MaximumLength(50)
            .Matches(@"^[a-zA-Z0-9-]+$")
            .WithMessage("Order ID contains invalid characters");

        RuleFor(x => x.Amount)
            .GreaterThan(0)
            .LessThanOrEqualTo(1000000);

        RuleFor(x => x.CustomerEmail)
            .NotEmpty()
            .EmailAddress()
            .Must(BeValidEmailDomain)
            .WithMessage("Email domain not allowed");
    }

    private bool BeValidEmailDomain(string email)
    {
        var allowedDomains = new[] { "example.com", "company.com" };
        var domain = email.Split('@').LastOrDefault();
        return allowedDomains.Contains(domain);
    }
}

// Sanitization helper
public static class InputSanitizer
{
    public static string SanitizeHtml(string input)
    {
        if (string.IsNullOrEmpty(input))
            return input;

        return System.Net.WebUtility.HtmlEncode(input);
    }

    public static string SanitizeSql(string input)
    {
        if (string.IsNullOrEmpty(input))
            return input;

        // Remove dangerous characters
        return Regex.Replace(input, @"[';--/**/]", "");
    }

    public static string SanitizeFilePath(string path)
    {
        var invalidChars = Path.GetInvalidFileNameChars();
        return string.Join("", path.Split(invalidChars));
    }
}
```

---

### 40. Secure Password Hashing

**Question:** Implement secure password hashing using industry standards.

**Answer:**

```csharp
public class PasswordHasher
{
    private const int SaltSize = 16;
    private const int HashSize = 32;
    private const int Iterations = 100000;

    public static string HashPassword(string password)
    {
        // Generate salt
        byte[] salt = new byte[SaltSize];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(salt);
        }

        // Hash password with salt
        using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations, HashAlgorithmName.SHA256);
        byte[] hash = pbkdf2.GetBytes(HashSize);

        // Combine salt and hash
        byte[] combined = new byte[SaltSize + HashSize];
        Array.Copy(salt, 0, combined, 0, SaltSize);
        Array.Copy(hash, 0, combined, SaltSize, HashSize);

        return Convert.ToBase64String(combined);
    }

    public static bool VerifyPassword(string password, string hashedPassword)
    {
        byte[] combined = Convert.FromBase64String(hashedPassword);

        // Extract salt
        byte[] salt = new byte[SaltSize];
        Array.Copy(combined, 0, salt, 0, SaltSize);

        // Extract hash
        byte[] storedHash = new byte[HashSize];
        Array.Copy(combined, SaltSize, storedHash, 0, HashSize);

        // Compute hash of provided password
        using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations, HashAlgorithmName.SHA256);
        byte[] computedHash = pbkdf2.GetBytes(HashSize);

        // Compare hashes
        return CryptographicOperations.FixedTimeEquals(storedHash, computedHash);
    }
}

// Using ASP.NET Core Identity PasswordHasher (recommended)
public class UserService
{
    private readonly IPasswordHasher<User> _passwordHasher;

    public UserService()
    {
        _passwordHasher = new PasswordHasher<User>();
    }

    public string HashPassword(User user, string password)
    {
        return _passwordHasher.HashPassword(user, password);
    }

    public bool VerifyPassword(User user, string hashedPassword, string providedPassword)
    {
        var result = _passwordHasher.VerifyHashedPassword(user, hashedPassword, providedPassword);
        return result == PasswordVerificationResult.Success;
    }
}
```

---

### 41. Rate Limiting Implementation

**Question:** Implement rate limiting to prevent abuse.

**Answer:**

```csharp
public class RateLimiter
{
    private readonly ConcurrentDictionary<string, SlidingWindowCounter> _counters = new();
    private readonly int _maxRequests;
    private readonly TimeSpan _window;

    public RateLimiter(int maxRequests, TimeSpan window)
    {
        _maxRequests = maxRequests;
        _window = window;
    }

    public bool IsAllowed(string clientId)
    {
        var counter = _counters.GetOrAdd(clientId, _ => new SlidingWindowCounter());
        return counter.TryIncrement(_maxRequests, _window);
    }

    private class SlidingWindowCounter
    {
        private readonly Queue<DateTime> _timestamps = new();
        private readonly object _lock = new object();

        public bool TryIncrement(int maxRequests, TimeSpan window)
        {
            lock (_lock)
            {
                var now = DateTime.UtcNow;
                var cutoff = now - window;

                // Remove old timestamps
                while (_timestamps.Count > 0 && _timestamps.Peek() < cutoff)
                    _timestamps.Dequeue();

                if (_timestamps.Count < maxRequests)
                {
                    _timestamps.Enqueue(now);
                    return true;
                }

                return false;
            }
        }
    }
}

// Middleware implementation
public class RateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly RateLimiter _rateLimiter;

    public RateLimitingMiddleware(RequestDelegate next)
    {
        _next = next;
        _rateLimiter = new RateLimiter(maxRequests: 100, window: TimeSpan.FromMinutes(1));
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var clientId = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";

        if (!_rateLimiter.IsAllowed(clientId))
        {
            context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
            await context.Response.WriteAsync("Rate limit exceeded. Please try again later.");
            return;
        }

        await _next(context);
    }
}
```

---

### 42. CSRF Token Validation

**Question:** Implement CSRF protection for state-changing operations.

**Answer:**

```csharp
public class CsrfTokenService
{
    private readonly IDataProtector _protector;

    public CsrfTokenService(IDataProtectionProvider provider)
    {
        _protector = provider.CreateProtector("CsrfTokenProtection");
    }

    public string GenerateToken(string userId, string sessionId)
    {
        var data = $"{userId}:{sessionId}:{DateTime.UtcNow.Ticks}";
        return _protector.Protect(data);
    }

    public bool ValidateToken(string token, string userId, string sessionId, TimeSpan maxAge)
    {
        try
        {
            var unprotected = _protector.Unprotect(token);
            var parts = unprotected.Split(':');

            if (parts.Length != 3)
                return false;

            if (parts[0] != userId || parts[1] != sessionId)
                return false;

            var timestamp = new DateTime(long.Parse(parts[2]));
            return DateTime.UtcNow - timestamp < maxAge;
        }
        catch
        {
            return false;
        }
    }
}

// Anti-forgery filter attribute
public class ValidateCsrfTokenAttribute : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        var csrfService = context.HttpContext.RequestServices.GetRequiredService<CsrfTokenService>();
        var token = context.HttpContext.Request.Headers["X-CSRF-Token"].FirstOrDefault();
        var userId = context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var sessionId = context.HttpContext.Session.Id;

        if (string.IsNullOrEmpty(token) ||
            !csrfService.ValidateToken(token, userId, sessionId, TimeSpan.FromHours(1)))
        {
            context.Result = new StatusCodeResult(StatusCodes.Status403Forbidden);
        }

        base.OnActionExecuting(context);
    }
}
```

---

## Code Refactoring Scenarios

### 43. Extract Method Refactoring

**Question:** Refactor a long method into smaller, focused methods.

**Answer:**

```csharp
// Before: Long, complex method
public class OrderProcessor
{
    public void ProcessOrder_Bad(Order order)
    {
        // Validate
        if (string.IsNullOrEmpty(order.CustomerId))
            throw new ArgumentException("Customer ID required");
        if (order.Items == null || order.Items.Count == 0)
            throw new ArgumentException("Order must have items");
        foreach (var item in order.Items)
        {
            if (item.Quantity <= 0)
                throw new ArgumentException("Invalid quantity");
            if (item.Price < 0)
                throw new ArgumentException("Invalid price");
        }

        // Calculate
        decimal subtotal = 0;
        foreach (var item in order.Items)
            subtotal += item.Price * item.Quantity;
        decimal tax = subtotal * 0.08m;
        decimal shipping = subtotal > 100 ? 0 : 10;
        decimal total = subtotal + tax + shipping;

        // Save
        using var connection = new SqlConnection(_connectionString);
        connection.Open();
        using var command = connection.CreateCommand();
        command.CommandText = "INSERT INTO Orders...";
        command.ExecuteNonQuery();
    }
}

// After: Refactored into focused methods
public class OrderProcessor
{
    public void ProcessOrder_Good(Order order)
    {
        ValidateOrder(order);
        var pricing = CalculatePricing(order);
        SaveOrder(order, pricing);
    }

    private void ValidateOrder(Order order)
    {
        ValidateCustomer(order.CustomerId);
        ValidateOrderItems(order.Items);
    }

    private void ValidateCustomer(string customerId)
    {
        if (string.IsNullOrEmpty(customerId))
            throw new ArgumentException("Customer ID required", nameof(customerId));
    }

    private void ValidateOrderItems(List<OrderItem> items)
    {
        if (items == null || items.Count == 0)
            throw new ArgumentException("Order must have items", nameof(items));

        foreach (var item in items)
        {
            if (item.Quantity <= 0)
                throw new ArgumentException($"Invalid quantity for item {item.ProductId}");
            if (item.Price < 0)
                throw new ArgumentException($"Invalid price for item {item.ProductId}");
        }
    }

    private OrderPricing CalculatePricing(Order order)
    {
        var subtotal = CalculateSubtotal(order.Items);
        var tax = CalculateTax(subtotal);
        var shipping = CalculateShipping(subtotal);

        return new OrderPricing
        {
            Subtotal = subtotal,
            Tax = tax,
            Shipping = shipping,
            Total = subtotal + tax + shipping
        };
    }

    private decimal CalculateSubtotal(List<OrderItem> items)
    {
        return items.Sum(item => item.Price * item.Quantity);
    }

    private decimal CalculateTax(decimal subtotal)
    {
        const decimal TaxRate = 0.08m;
        return subtotal * TaxRate;
    }

    private decimal CalculateShipping(decimal subtotal)
    {
        const decimal FreeShippingThreshold = 100m;
        const decimal ShippingCost = 10m;
        return subtotal >= FreeShippingThreshold ? 0 : ShippingCost;
    }

    private void SaveOrder(Order order, OrderPricing pricing)
    {
        // Simplified - use repository pattern in practice
        using var connection = new SqlConnection(_connectionString);
        connection.Open();
        using var command = connection.CreateCommand();
        command.CommandText = "INSERT INTO Orders (CustomerId, Total, Tax, Shipping) VALUES (@CustomerId, @Total, @Tax, @Shipping)";
        command.Parameters.AddWithValue("@CustomerId", order.CustomerId);
        command.Parameters.AddWithValue("@Total", pricing.Total);
        command.Parameters.AddWithValue("@Tax", pricing.Tax);
        command.Parameters.AddWithValue("@Shipping", pricing.Shipping);
        command.ExecuteNonQuery();
    }
}
```

---

### 44. Replace Conditional with Polymorphism

**Question:** Refactor type-checking conditionals to use polymorphism.

**Answer:**

```csharp
// Before: Type-checking with conditionals
public class PaymentProcessor_Bad
{
    public void ProcessPayment(Payment payment)
    {
        if (payment.Type == "CreditCard")
        {
            var card = payment as CreditCardPayment;
            // Validate credit card
            // Charge credit card
            Console.WriteLine($"Processing credit card ending in {card.LastFourDigits}");
        }
        else if (payment.Type == "PayPal")
        {
            var paypal = payment as PayPalPayment;
            // Validate PayPal account
            // Process PayPal payment
            Console.WriteLine($"Processing PayPal account {paypal.Email}");
        }
        else if (payment.Type == "BankTransfer")
        {
            var transfer = payment as BankTransferPayment;
            // Validate bank account
            // Process transfer
            Console.WriteLine($"Processing bank transfer from {transfer.AccountNumber}");
        }
    }
}

// After: Using polymorphism
public abstract class Payment
{
    public decimal Amount { get; set; }
    public abstract void Process();
    public abstract bool Validate();
}

public class CreditCardPayment : Payment
{
    public string CardNumber { get; set; }
    public string LastFourDigits => CardNumber?.Substring(CardNumber.Length - 4);

    public override bool Validate()
    {
        // Credit card validation logic
        return !string.IsNullOrEmpty(CardNumber) && CardNumber.Length == 16;
    }

    public override void Process()
    {
        Console.WriteLine($"Processing credit card ending in {LastFourDigits}");
        // Credit card processing logic
    }
}

public class PayPalPayment : Payment
{
    public string Email { get; set; }

    public override bool Validate()
    {
        // PayPal validation logic
        return !string.IsNullOrEmpty(Email) && Email.Contains("@");
    }

    public override void Process()
    {
        Console.WriteLine($"Processing PayPal account {Email}");
        // PayPal processing logic
    }
}

public class BankTransferPayment : Payment
{
    public string AccountNumber { get; set; }

    public override bool Validate()
    {
        // Bank account validation logic
        return !string.IsNullOrEmpty(AccountNumber);
    }

    public override void Process()
    {
        Console.WriteLine($"Processing bank transfer from {AccountNumber}");
        // Bank transfer processing logic
    }
}

public class PaymentProcessor_Good
{
    public void ProcessPayment(Payment payment)
    {
        if (payment.Validate())
        {
            payment.Process();
        }
        else
        {
            throw new InvalidOperationException("Payment validation failed");
        }
    }
}
```

---

### 45. Strategy Pattern for Algorithm Selection

**Question:** Refactor conditional logic for different algorithms into Strategy pattern.

**Answer:**

```csharp
// Before: Conditional algorithm selection
public class PricingCalculator_Bad
{
    public decimal CalculatePrice(Order order, string customerType)
    {
        decimal basePrice = order.Items.Sum(i => i.Price * i.Quantity);

        if (customerType == "Regular")
        {
            return basePrice;
        }
        else if (customerType == "Premium")
        {
            return basePrice * 0.9m; // 10% discount
        }
        else if (customerType == "VIP")
        {
            return basePrice * 0.8m; // 20% discount
        }
        else if (customerType == "Wholesale")
        {
            return basePrice * 0.7m; // 30% discount
        }

        return basePrice;
    }
}

// After: Strategy pattern
public interface IPricingStrategy
{
    decimal CalculatePrice(Order order);
}

public class RegularPricingStrategy : IPricingStrategy
{
    public decimal CalculatePrice(Order order)
    {
        return order.Items.Sum(i => i.Price * i.Quantity);
    }
}

public class PremiumPricingStrategy : IPricingStrategy
{
    public decimal CalculatePrice(Order order)
    {
        decimal basePrice = order.Items.Sum(i => i.Price * i.Quantity);
        return basePrice * 0.9m; // 10% discount
    }
}

public class VIPPricingStrategy : IPricingStrategy
{
    public decimal CalculatePrice(Order order)
    {
        decimal basePrice = order.Items.Sum(i => i.Price * i.Quantity);
        return basePrice * 0.8m; // 20% discount
    }
}

public class WholesalePricingStrategy : IPricingStrategy
{
    public decimal CalculatePrice(Order order)
    {
        decimal basePrice = order.Items.Sum(i => i.Price * i.Quantity);
        return basePrice * 0.7m; // 30% discount
    }
}

public class PricingCalculator_Good
{
    private readonly Dictionary<string, IPricingStrategy> _strategies;

    public PricingCalculator_Good()
    {
        _strategies = new Dictionary<string, IPricingStrategy>
        {
            ["Regular"] = new RegularPricingStrategy(),
            ["Premium"] = new PremiumPricingStrategy(),
            ["VIP"] = new VIPPricingStrategy(),
            ["Wholesale"] = new WholesalePricingStrategy()
        };
    }

    public decimal CalculatePrice(Order order, string customerType)
    {
        if (_strategies.TryGetValue(customerType, out var strategy))
        {
            return strategy.CalculatePrice(order);
        }

        // Default to regular pricing
        return _strategies["Regular"].CalculatePrice(order);
    }
}
```

---

## Bug Fixing Exercises

### 46. Race Condition in Cache

**Question:** Identify and fix the race condition in this cache implementation.

**Answer:**

```csharp
// Bug: Race condition in cache check-and-set
public class BuggyCache<TKey, TValue>
{
    private readonly Dictionary<TKey, TValue> _cache = new();

    public TValue GetOrAdd(TKey key, Func<TKey, TValue> factory)
    {
        // BUG: Multiple threads can pass this check simultaneously
        if (!_cache.ContainsKey(key))
        {
            // BUG: Factory might be called multiple times for the same key
            var value = factory(key);
            _cache[key] = value;
            return value;
        }

        return _cache[key];
    }
}

// Fixed version 1: Using lock
public class FixedCache<TKey, TValue>
{
    private readonly Dictionary<TKey, TValue> _cache = new();
    private readonly object _lock = new object();

    public TValue GetOrAdd(TKey key, Func<TKey, TValue> factory)
    {
        lock (_lock)
        {
            if (!_cache.ContainsKey(key))
            {
                var value = factory(key);
                _cache[key] = value;
                return value;
            }

            return _cache[key];
        }
    }
}

// Fixed version 2: Using ConcurrentDictionary (preferred)
public class OptimizedCache<TKey, TValue>
{
    private readonly ConcurrentDictionary<TKey, TValue> _cache = new();

    public TValue GetOrAdd(TKey key, Func<TKey, TValue> factory)
    {
        return _cache.GetOrAdd(key, factory);
    }

    // Even better: Lazy initialization to ensure factory runs once
    public TValue GetOrAddLazy(TKey key, Func<TKey, TValue> factory)
    {
        var lazy = _cache.GetOrAdd(key, k => new Lazy<TValue>(() => factory(k)));
        return ((Lazy<TValue>)lazy).Value;
    }
}
```

---

### 47. Memory Leak from Event Handlers

**Question:** Fix the memory leak caused by event subscription.

**Answer:**

```csharp
// Bug: Memory leak - event handler prevents garbage collection
public class BuggySubscriber : IDisposable
{
    private readonly EventPublisher _publisher;

    public BuggySubscriber(EventPublisher publisher)
    {
        _publisher = publisher;
        // BUG: Subscribing without unsubscribing keeps this instance alive
        _publisher.DataReceived += OnDataReceived;
    }

    private void OnDataReceived(object sender, DataEventArgs e)
    {
        Console.WriteLine($"Received: {e.Data}");
    }

    public void Dispose()
    {
        // BUG: Not unsubscribing from event
    }
}

// Fixed version
public class FixedSubscriber : IDisposable
{
    private readonly EventPublisher _publisher;
    private bool _disposed;

    public FixedSubscriber(EventPublisher publisher)
    {
        _publisher = publisher;
        _publisher.DataReceived += OnDataReceived;
    }

    private void OnDataReceived(object sender, DataEventArgs e)
    {
        Console.WriteLine($"Received: {e.Data}");
    }

    public void Dispose()
    {
        if (!_disposed)
        {
            _publisher.DataReceived -= OnDataReceived;
            _disposed = true;
        }
    }
}

// Alternative: Using WeakEventManager (WPF)
public class WeakEventSubscriber
{
    public WeakEventSubscriber(EventPublisher publisher)
    {
        WeakEventManager<EventPublisher, DataEventArgs>.AddHandler(
            publisher,
            nameof(EventPublisher.DataReceived),
            OnDataReceived);
    }

    private void OnDataReceived(object sender, DataEventArgs e)
    {
        Console.WriteLine($"Received: {e.Data}");
    }
}
```

---

### 48. Async Void Bug

**Question:** Fix issues with async void methods.

**Answer:**

```csharp
// Bug: async void swallows exceptions and can't be awaited
public class BuggyAsyncCode
{
    public async void ProcessData(string data) // BUG: async void
    {
        await Task.Delay(1000);

        if (string.IsNullOrEmpty(data))
            throw new ArgumentException("Data is null"); // BUG: Exception not observable

        Console.WriteLine($"Processed: {data}");
    }

    public void StartProcessing()
    {
        ProcessData("test"); // BUG: Fire and forget, no way to know when it completes
        Console.WriteLine("Started"); // Might print before processing completes
    }
}

// Fixed version
public class FixedAsyncCode
{
    public async Task ProcessDataAsync(string data)
    {
        await Task.Delay(1000);

        if (string.IsNullOrEmpty(data))
            throw new ArgumentException("Data is null");

        Console.WriteLine($"Processed: {data}");
    }

    public async Task StartProcessingAsync()
    {
        try
        {
            await ProcessDataAsync("test");
            Console.WriteLine("Completed successfully");
        }
        catch (ArgumentException ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }

    // Only use async void for event handlers
    public async void Button_Click(object sender, EventArgs e)
    {
        try
        {
            await ProcessDataAsync("test");
        }
        catch (Exception ex)
        {
            // Log exception - it won't propagate
            Console.WriteLine($"Error in event handler: {ex.Message}");
        }
    }
}
```

---

### 49. Disposed Object Access

**Question:** Fix the bug where a disposed object is accessed.

**Answer:**

```csharp
// Bug: Using disposed object
public class BuggyDatabaseQuery
{
    public async Task<List<Order>> GetOrdersAsync()
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();

        using var command = new SqlCommand("SELECT * FROM Orders", connection);
        using var reader = await command.ExecuteReaderAsync();

        var orders = new List<Order>();

        // BUG: Reader is disposed after this using block
        return orders;
    }

    // BUG: Trying to process reader after it's disposed
    private async Task ProcessResults(SqlDataReader reader)
    {
        while (await reader.ReadAsync()) // Will fail - reader is disposed
        {
            // Process row
        }
    }
}

// Fixed version
public class FixedDatabaseQuery
{
    public async Task<List<Order>> GetOrdersAsync()
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();

        using var command = new SqlCommand("SELECT * FROM Orders", connection);
        using var reader = await command.ExecuteReaderAsync();

        var orders = new List<Order>();

        // Read all data while reader is still open
        while (await reader.ReadAsync())
        {
            orders.Add(new Order
            {
                Id = reader.GetInt32(0),
                CustomerId = reader.GetString(1),
                Total = reader.GetDecimal(2)
            });
        }

        return orders;
    }

    // Alternative: Use Dapper or EF Core to avoid manual disposal
    public async Task<List<Order>> GetOrdersWithDapperAsync()
    {
        using var connection = new SqlConnection(_connectionString);
        return (await connection.QueryAsync<Order>("SELECT * FROM Orders")).ToList();
    }
}
```

---

### 50. Off-by-One Error in Array Processing

**Question:** Find and fix the off-by-one error.

**Answer:**

```csharp
// Bug: Off-by-one error in loop
public class BuggyArrayProcessor
{
    public int[] CalculateRunningSum(int[] numbers)
    {
        int[] result = new int[numbers.Length];
        result[0] = numbers[0];

        // BUG: Loop goes one past the array bounds
        for (int i = 1; i <= numbers.Length; i++)
        {
            result[i] = result[i - 1] + numbers[i]; // IndexOutOfRangeException
        }

        return result;
    }

    public void ProcessPairs(int[] numbers)
    {
        // BUG: Will skip last element if array has odd length
        for (int i = 0; i < numbers.Length - 1; i += 2)
        {
            Console.WriteLine($"Pair: {numbers[i]}, {numbers[i + 1]}");
        }
    }
}

// Fixed version
public class FixedArrayProcessor
{
    public int[] CalculateRunningSum(int[] numbers)
    {
        int[] result = new int[numbers.Length];
        result[0] = numbers[0];

        // Fix: Use < instead of <=
        for (int i = 1; i < numbers.Length; i++)
        {
            result[i] = result[i - 1] + numbers[i];
        }

        return result;
    }

    public void ProcessPairs(int[] numbers)
    {
        // Process pairs
        for (int i = 0; i < numbers.Length - 1; i += 2)
        {
            Console.WriteLine($"Pair: {numbers[i]}, {numbers[i + 1]}");
        }

        // Handle last element if odd length
        if (numbers.Length % 2 == 1)
        {
            Console.WriteLine($"Unpaired: {numbers[^1]}");
        }
    }

    // Alternative using LINQ
    public void ProcessPairsLinq(int[] numbers)
    {
        var pairs = numbers
            .Select((value, index) => new { value, index })
            .GroupBy(x => x.index / 2)
            .Select(g => g.Select(x => x.value).ToList());

        foreach (var pair in pairs)
        {
            if (pair.Count == 2)
                Console.WriteLine($"Pair: {pair[0]}, {pair[1]}");
            else
                Console.WriteLine($"Unpaired: {pair[0]}");
        }
    }
}
```

---

## Supplemental Practice Prompts

**Q: Implement a token bucket rate limiter (single-threaded).**

A: Use a refill timer and allow up to capacity tokens.

```csharp
public sealed class TokenBucket
{
    private readonly int _capacity;
    private readonly int _refillPerSecond;
    private int _tokens;
    private DateTime _lastRefill;

    public TokenBucket(int capacity, int refillPerSecond)
    {
        _capacity = capacity;
        _refillPerSecond = refillPerSecond;
        _tokens = capacity;
        _lastRefill = DateTime.UtcNow;
    }

    public bool TryConsume()
    {
        Refill();
        if (_tokens <= 0) return false;
        _tokens -= 1;
        return true;
    }

    private void Refill()
    {
        var now = DateTime.UtcNow;
        var seconds = (int)(now - _lastRefill).TotalSeconds;
        if (seconds <= 0) return;
        _tokens = Math.Min(_capacity, _tokens + seconds * _refillPerSecond);
        _lastRefill = now;
    }
}
```

**Q: Build a bounded in-memory queue with backpressure signals.**

A: Track capacity and return a boolean to indicate enqueue success.

```csharp
public sealed class BoundedQueue<T>
{
    private readonly Queue<T> _queue = new();
    private readonly int _capacity;

    public BoundedQueue(int capacity) => _capacity = capacity;

    public bool TryEnqueue(T item)
    {
        if (_queue.Count >= _capacity) return false;
        _queue.Enqueue(item);
        return true;
    }

    public bool TryDequeue(out T? item) => _queue.TryDequeue(out item);
}
```

**Q: Implement a simple TTL cache with expiration.**

A: Store expiration and evict on read.

```csharp
public sealed class TtlCache<TKey, TValue>
{
    private readonly Dictionary<TKey, (TValue Value, DateTime ExpiresAt)> _map = new();

    public void Set(TKey key, TValue value, TimeSpan ttl)
    {
        _map[key] = (value, DateTime.UtcNow.Add(ttl));
    }

    public bool TryGet(TKey key, out TValue value)
    {
        if (_map.TryGetValue(key, out var entry) && entry.ExpiresAt > DateTime.UtcNow)
        {
            value = entry.Value;
            return true;
        }

        _map.Remove(key);
        value = default!;
        return false;
    }
}
```

**Q: Parse a CSV stream into records without loading the full file.**

A: Read line-by-line and yield rows.

```csharp
public static IEnumerable<string[]> ReadCsv(Stream stream)
{
    using var reader = new StreamReader(stream);
    string? line;
    while ((line = reader.ReadLine()) is not null)
    {
        yield return line.Split(',');
    }
}
```

**Q: Compute a rolling VWAP from a stream of trades.**

A: Maintain running sums of price * volume and volume.

```csharp
decimal notional = 0m;
decimal volume = 0m;
foreach (var trade in trades)
{
    notional += trade.Price * trade.Volume;
    volume += trade.Volume;
    var vwap = volume == 0 ? 0 : notional / volume;
}
```

---

## Summary

This collection contains 50+ comprehensive coding challenges covering:

- **Core assessments** (9 exercises): Async operations, caching, concurrency, SQL, security
- **Algorithms** (6 exercises): Sorting, searching, graph traversal
- **Data structures** (5 exercises): Custom collections, trees, heaps, tries
- **String manipulation** (5 exercises): Compression, palindromes, pattern matching
- **Array/Matrix** (5 exercises): Two-sum, rotation, traversal, sliding window
- **Performance** (4 exercises): Object pooling, batching, memoization, ArrayPool
- **Concurrency** (4 exercises): Producer-consumer, parallel processing, throttling
- **Security** (4 exercises): Input validation, password hashing, rate limiting, CSRF
- **Refactoring** (3 exercises): Method extraction, polymorphism, strategy pattern
- **Bug fixing** (5 exercises): Race conditions, memory leaks, async issues, disposal

**Practice Tips:**
1. Implement each solution from scratch
2. Test with edge cases
3. Analyze time and space complexity
4. Consider alternative approaches
5. Review code for potential bugs
6. Practice explaining your solution out loud

---

**Total Exercises: 55+**

Work through these systematically to build strong coding interview skills!
