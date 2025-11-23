# Practice Questions & Prompts

Use these prompts while working through the [prep plan](../prep-plan.md). Aim to answer out loud and capture key points in your notes.

---

## LINQ & Collections
1. Given a list of trades with timestamps, return the latest trade per account using LINQ.
2. Implement a method that flattens nested lists of instrument codes while preserving ordering.
3. Explain the difference between `SelectMany` and nested loops. When is each preferable?
4. How would you detect duplicate orders in a stream using `GroupBy` and produce a summary?

## Async & Resilience
1. Sketch code to call three REST endpoints concurrently, cancel if any take longer than 3 seconds, and aggregate results.
2. Implement a resilient HTTP client with retry and circuit breaker policies using Polly.
3. How would you handle backpressure when consuming a fast message queue with a slower downstream API?
4. Explain why you might use `SemaphoreSlim` with async code over `lock`.

## API & Lifecycle
1. Describe the ASP.NET Core middleware pipeline for a request hitting an authenticated endpoint with custom exception handling.
2. How do you implement API versioning and backward compatibility?
3. Discuss strategies for rate limiting and request throttling.
4. How would you log correlation IDs across services and propagate them to downstream dependencies?

## System Design
1. **Price Streaming Service:** Design a service that ingests MT5 tick data, normalizes it, caches latest prices, and exposes them via REST/WebSocket.
2. **Order Execution Workflow:** Design an API that receives orders, validates, routes to MT4/MT5, and confirms execution. Include failure recovery.
3. **Real-Time Monitoring Dashboard:** Architect a system to collect metrics from trading microservices and alert on anomalies.
4. Discuss how you would integrate an external risk management engine into an existing microservices ecosystem.

## Messaging & Integration
1. Compare RabbitMQ and ZeroMQ for distributing price updates. When would you choose one over the other?
2. Explain how to ensure at-least-once delivery with RabbitMQ while preventing duplicate processing.
3. How would you design a saga pattern to coordinate account funding across multiple services?
4. Discuss the outbox pattern and how it prevents message loss in event-driven systems.

## Data Layer
1. Write a SQL query to calculate the rolling 7-day trade volume per instrument.
2. Explain how you would choose between normalized schemas and denormalized tables for reporting.
3. Describe the differences between clustered and non-clustered indexes and when to use covering indexes.
4. Walk through handling a long-running report query that impacts OLTP performance.

## Trading Domain Knowledge
1. Describe the lifecycle of a forex trade from placement to settlement.
2. How would you integrate with MT4/MT5 APIs for trade execution in C#? Mention authentication, session management, and error handling.
3. What are common risk checks before executing a client order (e.g., margin, exposure limits)?
4. Explain how youd handle market data bursts without dropping updates.

## Behavioral & Soft Skills
1. Tell me about a time you led a critical production fix under pressure.
2. Describe a situation where you improved a process by automating manual work.
3. Discuss a conflict within a team and how you resolved it.
4. Share a story that demonstrates your commitment to documentation or knowledge sharing.

## Questions for the Interviewer
1. How does HFM structure collaboration between developers, QA, and trading desks?
2. What are the biggest technical challenges facing the MT4/MT5 integration team right now?
3. How do you measure success for developers in this role within the first 6 months?
4. What opportunities exist for continuous learning and innovation within the engineering org?

---

Answer as many as you can out loud. For each, note concise bullet responses to reference right before the interview.

## Access Modifiers  `public`, `private`, `internal`, `protected` (and variants)

Quick summary:
- `public`: accessible from any code that can see the type.
- `private`: accessible only within the containing type (default for members).
- `internal`: accessible to code within the same assembly (project output).
- `protected`: accessible within the containing type and its derived types.
- `protected internal`: accessible from derived types or any code in the same assembly.
- `private protected` (C# 7.2+): accessible within the containing class or derived types in the same assembly.

Examples:

```csharp
public class Base
{
    private int _secret;                 // only inside Base
    protected int ProtectedValue;        // Base + derived classes
    internal int InternalValue;          // same assembly
    public int PublicValue;              // everyone
}

public class Derived : Base
{
    void Demo()
    {
        // can access ProtectedValue and InternalValue and PublicValue
        // cannot access _secret
    }
}

// Top-level types (classes) without a modifier default to internal.
```

Notes:
- Use `private` to encapsulate implementation details.
- Use `internal` to expose APIs across your project but hide them from other assemblies.
- Prefer `protected` sparingly; heavy use can expose internal invariants to subclasses and increase coupling.

## Dependency Injection Lifetimes  `Transient`, `Scoped`, `Singleton` (and tips)

Quick summary (Microsoft.Extensions.DependencyInjection semantics):
- `Transient`: a new instance is created every time the service is requested.
- `Scoped`: a single instance is created per scope (in ASP.NET Core a scope is typically a single HTTP request).
- `Singleton`: a single instance is created for the application's lifetime (or until the container is disposed).

Examples and behavior:

```csharp
services.AddTransient<IRepo, Repo>();   // new Repo each injection
services.AddScoped<IRepo, Repo>();      // one Repo per request/scope
services.AddSingleton<IRepo, Repo>();   // single Repo for the app lifetime
```

Important tips:
- Use `Scoped` for per-request services that hold state tied to the request (e.g., `DbContext`).
- Use `Singleton` for stateless, thread-safe services (caches, configuration providers). Be careful with mutable singletons.
- Avoid injecting a `Scoped` service into a `Singleton`  the scoped service may be captured incorrectly leading to unintended shared state or runtime errors.
- `Transient` is good for lightweight, stateless services; it can be used when you explicitly want fresh instances.

Pitfall example:

```csharp
// Bad: singleton holding a scoped dependency
services.AddSingleton<MySingleton>();
services.AddScoped<MyScopedDependency>();

public class MySingleton
{
    public MySingleton(MyScopedDependency dep) { /* captured scoped dep = problematic */ }
}
```

If you need to use a scoped service from a singleton, resolve scoped instances using `IServiceScopeFactory` or limit the singleton to factory-style resolution at operation time.

---


