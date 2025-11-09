# Dependency Injection Lifetimes at a Glance

| Lifetime      | Description                                              | Common Registration                 | Best For |
| ------------- | -------------------------------------------------------- | ----------------------------------- | -------- |
| **Transient** | A new instance is created **every time** it’s requested. | `AddTransient<IService, Service>()` | Lightweight, stateless work such as formatters, command objects, or EF Core DbContext factories. |
| **Scoped**    | One instance per **HTTP request (scope)**.               | `AddScoped<IService, Service>()`    | Request-based state such as per-request caches, unit-of-work patterns, or EF Core `DbContext`. |
| **Singleton** | One instance for the **entire application lifetime**.    | `AddSingleton<IService, Service>()` | Cross-request services like configuration, logging, caching, or HTTP clients created via `IHttpClientFactory`. |

> 🔐 **Tip:** Never capture a scoped service inside a singleton—inject `IServiceScopeFactory` instead and create a scope per operation.
