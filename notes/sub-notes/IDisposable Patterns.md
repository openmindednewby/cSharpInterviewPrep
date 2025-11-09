# `IDisposable` & Deterministic Cleanup

- Implement `IDisposable` when you own unmanaged resources (file handles, sockets, DB connections) or wrap disposables.
- Pattern:

```csharp
public sealed class PriceFeed : IDisposable
{
    private bool _disposed;
    private readonly Timer _timer;

    public PriceFeed()
    {
        _timer = new Timer(_ => PullAsync().GetAwaiter().GetResult());
    }

    public void Dispose()
    {
        if (_disposed) return;
        _timer.Dispose();
        _disposed = true;
        GC.SuppressFinalize(this);
    }
}
```

- **Usage:** Wrap with `using`/`await using` so cleanup runs even on exceptions.

```csharp
await using var connection = await _dbFactory.CreateConnectionAsync();
```
