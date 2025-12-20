# Async & Resilience Practice Exercises

Master asynchronous programming, concurrency, and resilient patterns through comprehensive exercises.

---

## Foundational Async Questions

**Q: Sketch code to call three REST endpoints concurrently, cancel if any take longer than 3 seconds, and aggregate results.**

A: Use `Task.WhenAll` with `CancellationTokenSource` + timeout. Ensure the `HttpClient` is a singleton to avoid socket exhaustion and that partial results are handled gracefully when cancellation occurs.

```csharp
using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(3));
var tasks = endpoints.Select(url => httpClient.GetStringAsync(url, cts.Token));
string[] responses = await Task.WhenAll(tasks);
```

Use when limited number of independent calls; want fail-fast. Avoid when endpoints depend on each other or you must gracefully degrade per-call.

**Q: Implement a resilient HTTP client with retry and circuit breaker policies using Polly.**

A: Define policies and wrap HTTP calls.

```csharp
var policy = Policy.WrapAsync(
    Policy.Handle<HttpRequestException>()
          .OrResult<HttpResponseMessage>(r => (int)r.StatusCode >= 500)
          .WaitAndRetryAsync(3, attempt => TimeSpan.FromMilliseconds(200 * attempt)),
    Policy.Handle<HttpRequestException>()
          .CircuitBreakerAsync(5, TimeSpan.FromSeconds(30))
);

var response = await policy.ExecuteAsync(() => httpClient.SendAsync(request));
```

Use when downstream instability; need resilience. Avoid when operations must not be retried (e.g., non-idempotent commands without safeguards).

**Q: How would you handle backpressure when consuming a fast message queue with a slower downstream API?**

A: Use bounded channels, buffering, or throttling. Consider load shedding by dropping low-priority messages or scaling consumers horizontally when queue lengths grow.

```csharp
var channel = Channel.CreateBounded<Message>(new BoundedChannelOptions(100)
{
    FullMode = BoundedChannelFullMode.Wait
});

// Producer
_ = Task.Run(async () =>
{
    await foreach (var msg in source.ReadAllAsync())
        await channel.Writer.WriteAsync(msg);
});

// Consumer
await foreach (var msg in channel.Reader.ReadAllAsync())
{
    await ProcessAsync(msg);
}
```

Use when consumer slower than producer; need to avoid overload. Avoid when throughput must be maximized with zero buffering—consider scaling consumers instead.

**Q: Explain why you might use `SemaphoreSlim` with async code over `lock`.**

A: `SemaphoreSlim` supports async waiting and throttling concurrency. It can represent both mutual exclusion (1 permit) and limited resource pools (>1 permits).

```csharp
private readonly SemaphoreSlim _mutex = new(1, 1);

public async Task UseSharedAsync()
{
    await _mutex.WaitAsync();
    try { await SharedAsyncOperation(); }
    finally { _mutex.Release(); }
}
```

Use `SemaphoreSlim` when async code needs mutual exclusion or limited parallelism. Avoid when code is synchronous—`lock` has less overhead.

---

## Intermediate Async Patterns

**Q: Implement an async method that times out after a specified duration and returns a default value.**

A: Use `Task.WhenAny` with a delay task or `CancellationTokenSource`.

```csharp
public static async Task<T> WithTimeout<T>(
    Task<T> task,
    TimeSpan timeout,
    T defaultValue = default)
{
    using var cts = new CancellationTokenSource(timeout);
    try
    {
        return await task.WaitAsync(timeout);  // .NET 6+
    }
    catch (TimeoutException)
    {
        return defaultValue;
    }
}

// Pre-.NET 6 approach
public static async Task<T> WithTimeoutClassic<T>(
    Task<T> task,
    TimeSpan timeout,
    T defaultValue = default)
{
    var delayTask = Task.Delay(timeout);
    var completedTask = await Task.WhenAny(task, delayTask);

    if (completedTask == delayTask)
        return defaultValue;

    return await task;
}
```

**Q: Create a method that retries an operation with exponential backoff.**

A: Implement retry logic with increasing delays.

```csharp
public static async Task<T> RetryWithBackoff<T>(
    Func<Task<T>> operation,
    int maxRetries = 3,
    int initialDelayMs = 100)
{
    for (int attempt = 0; attempt < maxRetries; attempt++)
    {
        try
        {
            return await operation();
        }
        catch (Exception ex) when (attempt < maxRetries - 1)
        {
            var delay = initialDelayMs * Math.Pow(2, attempt);
            await Task.Delay((int)delay);
        }
    }

    // Last attempt without catching
    return await operation();
}

// Usage
var result = await RetryWithBackoff(
    () => httpClient.GetStringAsync("https://api.example.com/data"),
    maxRetries: 5,
    initialDelayMs: 200
);
```

**Q: Implement a method that processes items in batches with a maximum degree of parallelism.**

A: Use `SemaphoreSlim` to limit concurrency or `Parallel.ForEachAsync`.

```csharp
// Using SemaphoreSlim
public static async Task ProcessInParallel<T>(
    IEnumerable<T> items,
    Func<T, Task> processor,
    int maxDegreeOfParallelism)
{
    using var semaphore = new SemaphoreSlim(maxDegreeOfParallelism);
    var tasks = items.Select(async item =>
    {
        await semaphore.WaitAsync();
        try
        {
            await processor(item);
        }
        finally
        {
            semaphore.Release();
        }
    });

    await Task.WhenAll(tasks);
}

// Using Parallel.ForEachAsync (.NET 6+)
public static async Task ProcessInParallelModern<T>(
    IEnumerable<T> items,
    Func<T, CancellationToken, ValueTask> processor,
    int maxDegreeOfParallelism)
{
    var options = new ParallelOptions
    {
        MaxDegreeOfParallelism = maxDegreeOfParallelism
    };

    await Parallel.ForEachAsync(items, options, processor);
}
```

**Q: Create an async producer-consumer pattern using `Channel<T>`.**

A: Implement coordinated producer and consumer tasks.

```csharp
public class AsyncProducerConsumer<T>
{
    private readonly Channel<T> _channel;

    public AsyncProducerConsumer(int capacity)
    {
        _channel = Channel.CreateBounded<T>(capacity);
    }

    public async Task ProduceAsync(IAsyncEnumerable<T> items)
    {
        await foreach (var item in items)
        {
            await _channel.Writer.WriteAsync(item);
        }
        _channel.Writer.Complete();
    }

    public async Task ConsumeAsync(
        Func<T, Task> processor,
        CancellationToken cancellationToken = default)
    {
        await foreach (var item in _channel.Reader.ReadAllAsync(cancellationToken))
        {
            await processor(item);
        }
    }

    public async Task RunAsync(
        IAsyncEnumerable<T> items,
        Func<T, Task> processor,
        CancellationToken cancellationToken = default)
    {
        var produceTask = ProduceAsync(items);
        var consumeTask = ConsumeAsync(processor, cancellationToken);

        await Task.WhenAll(produceTask, consumeTask);
    }
}
```

**Q: Implement proper cancellation handling in an async method that makes multiple API calls.**

A: Check cancellation token at strategic points and pass it through.

```csharp
public async Task<OrderResult> ProcessOrderAsync(
    Order order,
    CancellationToken cancellationToken)
{
    cancellationToken.ThrowIfCancellationRequested();

    // Step 1: Validate
    var validation = await ValidateOrderAsync(order, cancellationToken);
    if (!validation.IsValid)
        return OrderResult.Failed(validation.Errors);

    cancellationToken.ThrowIfCancellationRequested();

    // Step 2: Reserve inventory
    var reservation = await ReserveInventoryAsync(order, cancellationToken);

    cancellationToken.ThrowIfCancellationRequested();

    // Step 3: Process payment
    try
    {
        var payment = await ProcessPaymentAsync(order, cancellationToken);
        return OrderResult.Success(payment.TransactionId);
    }
    catch (OperationCanceledException)
    {
        // Rollback reservation
        await ReleaseInventoryAsync(reservation, CancellationToken.None);
        throw;
    }
}
```

---

## Advanced Async Patterns

**Q: Implement an async lazy initialization pattern that ensures a resource is initialized only once.**

A: Use `Lazy<Task<T>>` or custom lazy initialization.

```csharp
public class AsyncLazy<T>
{
    private readonly Lazy<Task<T>> _instance;

    public AsyncLazy(Func<Task<T>> factory)
    {
        _instance = new Lazy<Task<T>>(factory);
    }

    public Task<T> Value => _instance.Value;
}

// Usage
private readonly AsyncLazy<DatabaseConnection> _connection;

public MyService()
{
    _connection = new AsyncLazy<DatabaseConnection>(
        async () => await DatabaseConnection.ConnectAsync());
}

public async Task<Data> GetDataAsync()
{
    var conn = await _connection.Value;
    return await conn.QueryAsync("SELECT * FROM Data");
}
```

**Q: Create a rate limiter using `SemaphoreSlim` and `Timer` for token bucket algorithm.**

A: Implement token bucket pattern with async semaphore.

```csharp
public class RateLimiter : IDisposable
{
    private readonly SemaphoreSlim _semaphore;
    private readonly Timer _timer;
    private readonly int _maxTokens;
    private readonly TimeSpan _refillInterval;

    public RateLimiter(int maxTokens, TimeSpan refillInterval)
    {
        _maxTokens = maxTokens;
        _refillInterval = refillInterval;
        _semaphore = new SemaphoreSlim(maxTokens, maxTokens);
        _timer = new Timer(RefillTokens, null, refillInterval, refillInterval);
    }

    private void RefillTokens(object state)
    {
        // Add tokens up to max
        if (_semaphore.CurrentCount < _maxTokens)
        {
            _semaphore.Release();
        }
    }

    public async Task<bool> TryAcquireAsync(
        TimeSpan timeout,
        CancellationToken cancellationToken = default)
    {
        return await _semaphore.WaitAsync(timeout, cancellationToken);
    }

    public void Dispose()
    {
        _timer?.Dispose();
        _semaphore?.Dispose();
    }
}

// Usage
var rateLimiter = new RateLimiter(maxTokens: 10, TimeSpan.FromSeconds(1));
if (await rateLimiter.TryAcquireAsync(TimeSpan.FromMilliseconds(100)))
{
    await MakeApiCallAsync();
}
```

**Q: Implement async dispose pattern (IAsyncDisposable) for a resource that requires async cleanup.**

A: Implement `IAsyncDisposable` interface.

```csharp
public class AsyncResource : IAsyncDisposable
{
    private readonly HttpClient _httpClient;
    private readonly Stream _stream;
    private bool _disposed;

    public AsyncResource()
    {
        _httpClient = new HttpClient();
        _stream = new MemoryStream();
    }

    public async ValueTask DisposeAsync()
    {
        if (_disposed) return;

        await DisposeAsyncCore();

        Dispose(disposing: false);
        GC.SuppressFinalize(this);

        _disposed = true;
    }

    protected virtual async ValueTask DisposeAsyncCore()
    {
        // Async cleanup
        if (_stream != null)
        {
            await _stream.FlushAsync();
            await _stream.DisposeAsync();
        }
    }

    protected virtual void Dispose(bool disposing)
    {
        if (disposing)
        {
            _httpClient?.Dispose();
        }
    }
}

// Usage
await using var resource = new AsyncResource();
```

**Q: Create a circuit breaker implementation from scratch.**

A: Implement state machine for circuit breaker pattern.

```csharp
public class CircuitBreaker
{
    private enum State { Closed, Open, HalfOpen }

    private State _state = State.Closed;
    private int _failureCount;
    private DateTime _lastFailureTime;

    private readonly int _failureThreshold;
    private readonly TimeSpan _timeout;
    private readonly SemaphoreSlim _lock = new(1, 1);

    public CircuitBreaker(int failureThreshold, TimeSpan timeout)
    {
        _failureThreshold = failureThreshold;
        _timeout = timeout;
    }

    public async Task<T> ExecuteAsync<T>(Func<Task<T>> operation)
    {
        await _lock.WaitAsync();
        try
        {
            // Check if we should transition from Open to HalfOpen
            if (_state == State.Open &&
                DateTime.UtcNow - _lastFailureTime >= _timeout)
            {
                _state = State.HalfOpen;
            }

            if (_state == State.Open)
            {
                throw new CircuitBreakerOpenException(
                    "Circuit breaker is open");
            }
        }
        finally
        {
            _lock.Release();
        }

        try
        {
            var result = await operation();

            // Success - reset if in HalfOpen
            if (_state == State.HalfOpen)
            {
                await ResetAsync();
            }

            return result;
        }
        catch (Exception ex)
        {
            await RecordFailureAsync(ex);
            throw;
        }
    }

    private async Task RecordFailureAsync(Exception ex)
    {
        await _lock.WaitAsync();
        try
        {
            _failureCount++;
            _lastFailureTime = DateTime.UtcNow;

            if (_failureCount >= _failureThreshold)
            {
                _state = State.Open;
            }
        }
        finally
        {
            _lock.Release();
        }
    }

    private async Task ResetAsync()
    {
        await _lock.WaitAsync();
        try
        {
            _failureCount = 0;
            _state = State.Closed;
        }
        finally
        {
            _lock.Release();
        }
    }
}
```

**Q: Implement a parallel batch processor that maintains order of results.**

A: Process in parallel but preserve order.

```csharp
public static async Task<List<TResult>> ProcessInOrderAsync<TSource, TResult>(
    IEnumerable<TSource> items,
    Func<TSource, Task<TResult>> processor,
    int maxDegreeOfParallelism)
{
    var semaphore = new SemaphoreSlim(maxDegreeOfParallelism);
    var tasks = items.Select(async (item, index) =>
    {
        await semaphore.WaitAsync();
        try
        {
            var result = await processor(item);
            return (Index: index, Result: result);
        }
        finally
        {
            semaphore.Release();
        }
    });

    var results = await Task.WhenAll(tasks);

    return results
        .OrderBy(x => x.Index)
        .Select(x => x.Result)
        .ToList();
}
```

---

## Task Coordination Patterns

**Q: Implement a fan-out/fan-in pattern where multiple workers process items and results are aggregated.**

A: Distribute work and collect results.

```csharp
public async Task<Summary> FanOutFanIn<T>(
    IEnumerable<T> items,
    Func<T, Task<Result>> processor)
{
    var channel = Channel.CreateUnbounded<Result>();

    // Fan-out: Start workers
    var workers = Enumerable.Range(0, Environment.ProcessorCount)
        .Select(i => Task.Run(async () =>
        {
            await foreach (var item in GetWorkItems(items, i))
            {
                var result = await processor(item);
                await channel.Writer.WriteAsync(result);
            }
        }))
        .ToArray();

    // Signal completion
    _ = Task.Run(async () =>
    {
        await Task.WhenAll(workers);
        channel.Writer.Complete();
    });

    // Fan-in: Aggregate results
    var summary = new Summary();
    await foreach (var result in channel.Reader.ReadAllAsync())
    {
        summary.Add(result);
    }

    return summary;
}
```

**Q: Create a coordinated shutdown mechanism for multiple background tasks.**

A: Implement graceful shutdown with cancellation.

```csharp
public class BackgroundWorkerCoordinator : IDisposable
{
    private readonly List<Task> _workers = new();
    private readonly CancellationTokenSource _cts = new();

    public void Start(Func<CancellationToken, Task> workerFactory, int workerCount)
    {
        for (int i = 0; i < workerCount; i++)
        {
            var worker = Task.Run(() => workerFactory(_cts.Token));
            _workers.Add(worker);
        }
    }

    public async Task StopAsync(TimeSpan gracePeriod)
    {
        // Signal cancellation
        _cts.Cancel();

        // Wait for graceful shutdown
        var shutdownTask = Task.WhenAll(_workers);
        var timeoutTask = Task.Delay(gracePeriod);

        var completedTask = await Task.WhenAny(shutdownTask, timeoutTask);

        if (completedTask == timeoutTask)
        {
            // Forced shutdown after timeout
            throw new TimeoutException("Workers did not complete in time");
        }

        await shutdownTask;  // Propagate exceptions
    }

    public void Dispose()
    {
        _cts?.Cancel();
        _cts?.Dispose();
    }
}
```

**Q: Implement async event aggregation that batches events before processing.**

A: Buffer events and process in batches.

```csharp
public class EventBatcher<T>
{
    private readonly Channel<T> _channel;
    private readonly int _batchSize;
    private readonly TimeSpan _batchTimeout;

    public EventBatcher(int batchSize, TimeSpan batchTimeout)
    {
        _channel = Channel.CreateUnbounded<T>();
        _batchSize = batchSize;
        _batchTimeout = batchTimeout;
    }

    public async Task AddAsync(T item)
    {
        await _channel.Writer.WriteAsync(item);
    }

    public async Task ProcessAsync(
        Func<List<T>, Task> batchProcessor,
        CancellationToken cancellationToken)
    {
        var batch = new List<T>(_batchSize);
        using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);

        while (!cancellationToken.IsCancellationRequested)
        {
            try
            {
                // Wait for first item or cancellation
                var item = await _channel.Reader.ReadAsync(cancellationToken);
                batch.Add(item);

                // Collect more items until batch full or timeout
                using var timeoutCts = new CancellationTokenSource(_batchTimeout);
                while (batch.Count < _batchSize &&
                       _channel.Reader.TryRead(out var nextItem))
                {
                    batch.Add(nextItem);
                }

                // Process batch
                await batchProcessor(batch);
                batch.Clear();
            }
            catch (OperationCanceledException)
            {
                break;
            }
        }

        // Process remaining items
        if (batch.Any())
        {
            await batchProcessor(batch);
        }
    }
}
```

---

## Error Handling & Resilience

**Q: Implement a bulkhead pattern to isolate failures.**

A: Separate resource pools for different operations.

```csharp
public class Bulkhead
{
    private readonly SemaphoreSlim _semaphore;
    private readonly int _maxConcurrent;

    public Bulkhead(int maxConcurrent)
    {
        _maxConcurrent = maxConcurrent;
        _semaphore = new SemaphoreSlim(maxConcurrent);
    }

    public async Task<T> ExecuteAsync<T>(
        Func<Task<T>> operation,
        TimeSpan? timeout = null)
    {
        var acquired = await _semaphore.WaitAsync(timeout ?? Timeout.InfiniteTimeSpan);
        if (!acquired)
        {
            throw new BulkheadRejectedException(
                $"Bulkhead full: {_maxConcurrent} concurrent executions");
        }

        try
        {
            return await operation();
        }
        finally
        {
            _semaphore.Release();
        }
    }

    public int AvailableSlots => _semaphore.CurrentCount;
}

// Usage: Separate bulkheads for different services
var criticalServiceBulkhead = new Bulkhead(10);
var nonCriticalServiceBulkhead = new Bulkhead(5);
```

**Q: Create a fallback mechanism that returns cached data when an API call fails.**

A: Implement cache-aside pattern with fallback.

```csharp
public class ResilientDataService
{
    private readonly HttpClient _httpClient;
    private readonly IMemoryCache _cache;

    public async Task<Data> GetDataAsync(string key)
    {
        // Try cache first
        if (_cache.TryGetValue(key, out Data cachedData))
        {
            return cachedData;
        }

        try
        {
            // Try API
            var data = await _httpClient.GetFromJsonAsync<Data>($"/api/data/{key}");

            // Update cache
            _cache.Set(key, data, TimeSpan.FromMinutes(5));

            return data;
        }
        catch (HttpRequestException ex)
        {
            // Fallback to stale cache if available
            if (_cache.TryGetValue($"stale_{key}", out Data staleData))
            {
                return staleData;
            }

            throw;
        }
    }
}
```

**Q: Implement timeout policies for different types of operations (fast, medium, slow).**

A: Configure different timeout strategies.

```csharp
public class TimeoutPolicies
{
    public static IAsyncPolicy<HttpResponseMessage> FastOperation =>
        Policy.TimeoutAsync<HttpResponseMessage>(TimeSpan.FromSeconds(2));

    public static IAsyncPolicy<HttpResponseMessage> MediumOperation =>
        Policy.TimeoutAsync<HttpResponseMessage>(TimeSpan.FromSeconds(10));

    public static IAsyncPolicy<HttpResponseMessage> SlowOperation =>
        Policy.TimeoutAsync<HttpResponseMessage>(TimeSpan.FromSeconds(30));

    public static IAsyncPolicy<HttpResponseMessage> WithRetry(
        IAsyncPolicy<HttpResponseMessage> timeoutPolicy)
    {
        var retryPolicy = Policy
            .HandleResult<HttpResponseMessage>(r => !r.IsSuccessStatusCode)
            .Or<TimeoutRejectedException>()
            .WaitAndRetryAsync(3, attempt => TimeSpan.FromMilliseconds(100 * attempt));

        return Policy.WrapAsync(retryPolicy, timeoutPolicy);
    }
}

// Usage
var response = await TimeoutPolicies.WithRetry(TimeoutPolicies.FastOperation)
    .ExecuteAsync(() => httpClient.GetAsync("/api/quick"));
```

---

## Real-World Scenarios

**Q: Implement a download manager that downloads multiple files concurrently with progress reporting.**

A: Track progress across parallel downloads.

```csharp
public class DownloadManager
{
    public async Task DownloadFilesAsync(
        List<string> urls,
        string outputDirectory,
        IProgress<DownloadProgress> progress,
        int maxConcurrent = 3)
    {
        var semaphore = new SemaphoreSlim(maxConcurrent);
        var totalBytes = 0L;
        var downloadedBytes = 0L;
        var completed = 0;

        var tasks = urls.Select(async (url, index) =>
        {
            await semaphore.WaitAsync();
            try
            {
                var fileName = Path.GetFileName(url);
                var outputPath = Path.Combine(outputDirectory, fileName);

                using var client = new HttpClient();
                using var response = await client.GetAsync(url, HttpCompletionOption.ResponseHeadersRead);

                var fileSize = response.Content.Headers.ContentLength ?? 0;
                Interlocked.Add(ref totalBytes, fileSize);

                await using var contentStream = await response.Content.ReadAsStreamAsync();
                await using var fileStream = File.Create(outputPath);

                var buffer = new byte[8192];
                int bytesRead;
                while ((bytesRead = await contentStream.ReadAsync(buffer)) > 0)
                {
                    await fileStream.WriteAsync(buffer.AsMemory(0, bytesRead));

                    Interlocked.Add(ref downloadedBytes, bytesRead);

                    progress?.Report(new DownloadProgress
                    {
                        TotalFiles = urls.Count,
                        CompletedFiles = Volatile.Read(ref completed),
                        TotalBytes = Volatile.Read(ref totalBytes),
                        DownloadedBytes = Volatile.Read(ref downloadedBytes)
                    });
                }

                Interlocked.Increment(ref completed);
            }
            finally
            {
                semaphore.Release();
            }
        });

        await Task.WhenAll(tasks);
    }
}

public record DownloadProgress
{
    public int TotalFiles { get; init; }
    public int CompletedFiles { get; init; }
    public long TotalBytes { get; init; }
    public long DownloadedBytes { get; init; }
    public double PercentComplete => TotalBytes > 0
        ? (double)DownloadedBytes / TotalBytes * 100
        : 0;
}
```

---

**Total Exercises: 30+**

Focus on understanding cancellation, error handling, and coordination patterns!
