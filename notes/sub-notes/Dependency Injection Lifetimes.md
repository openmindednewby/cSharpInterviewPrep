# Dependency Injection Lifetimes at a Glance

| Lifetime      | Description                                              | Common Registration                 | Best For |
| ------------- | -------------------------------------------------------- | ----------------------------------- | -------- |
| **Transient** | A new instance is created **every time** it’s requested. | `AddTransient<IService, Service>()` | Lightweight, stateless work such as formatters, command objects, or EF Core DbContext factories. |
| **Scoped**    | One instance per **HTTP request (scope)**.               | `AddScoped<IService, Service>()`    | Request-based state such as per-request caches, unit-of-work patterns, or EF Core `DbContext`. |
| **Singleton** | One instance for the **entire application lifetime**.    | `AddSingleton<IService, Service>()` | Cross-request services like configuration, logging, caching, or HTTP clients created via `IHttpClientFactory`. |

> 🔐 **Tip:** Never capture a scoped service inside a singleton—inject `IServiceScopeFactory` instead and create a scope per operation.

---

## Questions & Answers

**Q: When do you choose transient over scoped?**

A: Use transient for stateless, lightweight services or short-lived operations (formatters, handlers). Use scoped when the service holds per-request state or depends on scoped services like `DbContext`.

**Q: Why does capturing a scoped service in a singleton cause issues?**

A: The singleton outlives the request scope, so it holds onto disposed or cross-request state, leading to race conditions, memory leaks, or `ObjectDisposedException`.

**Q: How do you use scoped services from a singleton safely?**

A: Inject `IServiceScopeFactory`, create a scope when needed, resolve the scoped service inside it, and dispose the scope afterward.

**Q: What lifetime should HttpClient instances have?**

A: Use `IHttpClientFactory` (singleton-managed) to create clients per use, which internally pools handlers and avoids socket exhaustion.

**Q: Can singletons depend on transients?**

A: Yes, but the transient effectively becomes a singleton because the DI container creates it once for the singleton. Prefer injecting interfaces with the right lifetime semantics.

**Q: How do lifetimes work in background services?**

A: Hosted services run outside HTTP scopes. If they need scoped services, create scopes manually per iteration to avoid cross-thread leaks.

**Q: How do you test scoped services without ASP.NET hosting?**

A: Create a `ServiceScope` via the provider in tests, resolve scoped services, and dispose the scope when done. This mimics per-request behavior.

**Q: What happens if you register `DbContext` as singleton?**

A: It becomes shared across requests, causing threading issues, stale state, and memory leaks. EF contexts must be scoped or transient.

**Q: How do you ensure deterministic disposal for transients?**

A: The container disposes transients when the scope disposing them ends. If they hold unmanaged resources, ensure they are resolved and disposed within a scope.

**Q: What about custom lifetimes?**

A: You can implement `IServiceScopeFactory` or use keyed services, but keep the mental model simple—most cases are solved with transient/scoped/singleton.
