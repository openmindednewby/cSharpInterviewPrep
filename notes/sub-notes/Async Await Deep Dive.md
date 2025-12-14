# Async/Await Deep Dive

Use this sheet to unpack what happens when the compiler rewrites an `async` method and how to keep code responsive under load.

## Compiler-Generated State Machine

- The compiler transforms every `async` method into a **struct-based state machine** implementing `IAsyncStateMachine`.
- Local variables become fields on the state machine; `await` points split the method into states that resume via `MoveNext`.
- Hot-path tip: keep locals small (e.g., avoid large structs) to limit the generated state machine size.

```csharp
public async Task<int> SumAsync(int a, int b)
{
    await Task.Yield();
    return a + b;
}
```

> Decompile with ILSpy/dotnet-ildasm to show the generated `MoveNext` method when interviewing.

## Synchronization Context Capture

- **UI/WPF/WinForms & ASP.NET (pre-Core)** capture a `SynchronizationContext`; continuations post back to the captured context.
- In ASP.NET Core/background services, the default context is the thread pool so no extra marshaling is needed.
- Call `.ConfigureAwait(false)` inside reusable libraries/background jobs to avoid deadlocks and reduce context switches.

```csharp
public async Task<string> DownloadAsync(HttpClient client, Uri uri)
    => await (await client.GetAsync(uri).ConfigureAwait(false))
        .Content.ReadAsStringAsync().ConfigureAwait(false);
```

## Deadlocks & Blocking Calls

- Blocking on `Task.Result` or `.Wait()` inside a context that disallows re-entrancy prevents the continuation from running.
- Fix deadlocks by keeping the call chain `async` all the way up or by using `ConfigureAwait(false)` in library code.

```csharp
// ❌ Deadlocks on UI thread
var content = client.GetStringAsync(url).Result;

// ✅ Allow the message loop to process the continuation
var content = await client.GetStringAsync(url).ConfigureAwait(false);
```

## Exception Propagation

- Exceptions thrown inside an `async` method are captured and placed on the returned `Task`.
- Always `await` the task to observe the exception; otherwise you risk unobserved task exceptions.
- For fire-and-forget work, log via `Task.Run(...).ContinueWith` or use `IHostedService`/background queue patterns.

## Locks & Async Coordination

- `lock`/`Monitor` stay synchronous—only use around code that never `await`s.
- Reach for `SemaphoreSlim`, `AsyncLock`, or channels when coordinating asynchronous work.

```csharp
private readonly SemaphoreSlim _mutex = new(1, 1);

public async Task UpdateAsync()
{
    await _mutex.WaitAsync();
    try
    {
        await PersistAsync();
    }
    finally
    {
        _mutex.Release();
    }
}
```

## I/O-Bound vs CPU-Bound

- `await` frees the thread to return to the pool while the I/O operation runs (HTTP, DB, queues).
- For CPU-bound workloads, offload to `Task.Run` or dedicated worker threads to avoid blocking the caller.

## Performance Considerations

- Prefer `ValueTask` when the result often completes synchronously (e.g., cached data) to avoid allocating a `Task`.
- Avoid capturing the current context by default in library code—`ConfigureAwait(false)` becomes muscle memory.
- Use `Task.WhenAll`/`Task.WhenAny` to fan out concurrent operations without repeated awaits.
- **Cancellation:** Accept `CancellationToken` parameters and forward them to downstream async APIs.

```csharp
public async Task<Order> PlaceAsync(OrderRequest request, CancellationToken cancellationToken)
{
    using var activity = _activitySource.StartActivity("PlaceOrder");

    var quote = await _pricingClient.GetQuoteAsync(request.Symbol, cancellationToken)
                                    .ConfigureAwait(false);

    return await _orderGateway.ExecuteAsync(request with { Price = quote }, cancellationToken)
                              .ConfigureAwait(false);
}
```

## Interview Quick Hits

- Explain how async improves scalability by releasing threads during I/O waits.
- Contrast `Task`, `Task<T>`, `ValueTask<T>`, and `IAsyncEnumerable<T>`.
- Mention tooling: `dotnet-trace`, `EventPipe`, and the **Tasks** view in Visual Studio for diagnosing hung awaits.

Keep this page handy to answer deep-dive follow-ups confidently.

---

## Questions & Answers

**Q: What happens under the hood when you mark a method `async`?**

A: The compiler generates a struct implementing `IAsyncStateMachine`. Locals become fields, `await` points split into states, and continuations resume via `MoveNext`. Understanding this helps avoid capturing large objects or struct copies.

**Q: Why does `ConfigureAwait(false)` matter in library code?**

A: It prevents continuations from posting back to captured contexts (UI, legacy ASP.NET), reducing deadlock risk and unnecessary context switches. Libraries should default to `false`; apps decide when context capture is needed.

**Q: How do you avoid deadlocks when mixing sync and async code?**

A: Keep the entire call chain async, don’t block on `.Result` or `.Wait()`, and use `ConfigureAwait(false)` inside lower layers so continuations can resume on the thread pool.

**Q: When should you use `ValueTask`?**

A: When an async method often completes synchronously (e.g., cache hits) and you want to avoid allocating a `Task`. Only expose `ValueTask` sparingly; consumers must await it immediately or convert to `Task`.

**Q: How do you coordinate exclusive access in async code?**

A: Use `SemaphoreSlim`, `AsyncLock`, or channels. Never `await` inside a `lock` statement because it can deadlock; the compiler forbids it.

**Q: How are exceptions handled in async methods?**

A: They’re captured on the returned `Task`. Await to observe them; otherwise, they surface as unobserved task exceptions. For fire-and-forget, attach continuations or use hosted services to log failures.

**Q: What’s the difference between I/O-bound and CPU-bound async work?**

A: I/O-bound tasks release threads while waiting for external operations, improving scalability. CPU-bound work still needs threads; push it to `Task.Run` or dedicated workers to keep request threads free.

**Q: How do you monitor asynchronous operations in production?**

A: Use distributed tracing, `EventSource`/`EventPipe`, `dotnet-trace`, or Visual Studio’s Tasks view. Instrument awaited calls with activity IDs and correlate them to metrics/logs.

**Q: How do you pass cancellation effectively?**

A: Accept `CancellationToken` parameters, honor them in loops, and forward them to all awaited calls. Check `ct.ThrowIfCancellationRequested()` where appropriate to exit quickly.

**Q: How can `Task.WhenAll` improve performance?**

A: It allows parallel execution of independent async operations, awaiting once rather than sequentially. Always handle aggregated exceptions and consider throttling to avoid saturating dependencies.
