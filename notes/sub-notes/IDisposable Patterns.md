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

---

## Questions & Answers

**Q: When should a class implement `IDisposable`?**

A: When it owns unmanaged resources or wraps objects that implement `IDisposable` (streams, DbContexts, timers) and must release them deterministically.

**Q: Why call `GC.SuppressFinalize(this)`?**

A: It prevents the GC from invoking the finalizer once you’ve disposed the object, saving an extra GC cycle and improving performance.

**Q: How do you dispose async resources?**

A: Implement `IAsyncDisposable` and use `await using` to asynchronously release resources like pooled connections or streams.

**Q: What happens if you forget to dispose?**

A: Resources leak—sockets stay open, file handles remain locked, and finalizers eventually run, adding GC pressure. In services, this can lead to outages.

**Q: How do you handle multiple disposals safely?**

A: Guard with an `_disposed` flag, throw `ObjectDisposedException` when methods run after disposal, and make `Dispose` idempotent.

**Q: When do you need a finalizer?**

A: Rarely—only when you wrap unmanaged resources without safe handles. Prefer `SafeHandle` + `IDisposable` instead of writing finalizers yourself.

**Q: How do you dispose child services resolved from DI scopes?**

A: The scope disposes services when it ends. Don’t capture scoped services beyond scope lifetime; create scopes per operation if needed.

**Q: How do you unit test disposal behavior?**

A: Use `Mock<IDisposable>` to verify `Dispose` is called, or check resource state (e.g., timer disposed). For async disposal, assert tasks complete and resources release handles.

**Q: What’s the difference between `DisposeAsync` and `Dispose`?**

A: `DisposeAsync` returns a `ValueTask` and awaits asynchronous cleanup. `Dispose` runs synchronously. Implement both when supporting async resource release but ensure `Dispose` calls `DisposeAsync().GetAwaiter().GetResult()` if needed.

**Q: How does `using` translate in IL?**

A: It compiles to a try/finally block where `Dispose` is invoked in the finally clause, guaranteeing cleanup even if exceptions occur.
