# Design Patterns - Quick Reference Guide

## Overview
This directory contains comprehensive exercises for common design patterns used in C# development. Each pattern includes 25-30+ exercises organized by difficulty level.

## Pattern Categories

### Creational Patterns
Patterns that deal with object creation mechanisms.

#### Factory Pattern
- **Purpose**: Create objects without specifying the exact class
- **Variants**: Simple Factory, Factory Method, Abstract Factory
- **Use When**: Object creation logic is complex or needs to be centralized
- **File**: [Factory-Pattern-Exercises.md](./Factory-Pattern-Exercises.md)

### Behavioral Patterns
Patterns concerned with algorithms and the assignment of responsibilities between objects.

#### Strategy Pattern
- **Purpose**: Define a family of algorithms, encapsulate each one, and make them interchangeable
- **Use When**: You need different variants of an algorithm, or when you have multiple related classes that differ only in behavior
- **File**: [Strategy-Pattern-Exercises.md](./Strategy-Pattern-Exercises.md)

#### Observer Pattern
- **Purpose**: Define a one-to-many dependency between objects so when one object changes state, all dependents are notified
- **Use When**: Changes to one object require changing others, and you don't know how many objects need to be changed
- **File**: [Observer-Pattern-Exercises.md](./Observer-Pattern-Exercises.md)

#### Mediator Pattern
- **Purpose**: Define an object that encapsulates how a set of objects interact
- **Use When**: You want to reduce coupling between components that communicate with each other
- **File**: [Mediator-Pattern-Exercises.md](./Mediator-Pattern-Exercises.md)

### Structural Patterns
Patterns concerned with how classes and objects are composed to form larger structures.

#### Decorator Pattern
- **Purpose**: Attach additional responsibilities to an object dynamically
- **Use When**: You need to add responsibilities to individual objects dynamically and transparently, without affecting other objects
- **File**: [Decorator-Pattern-Exercises.md](./Decorator-Pattern-Exercises.md)

### Architectural Patterns

#### CQRS Pattern
- **Purpose**: Segregate read and write operations for a data store
- **Use When**: Read and write workloads are asymmetrical, or you need different optimization strategies for reads vs writes
- **File**: [CQRS-Pattern-Exercises.md](./CQRS-Pattern-Exercises.md)

## Pattern Comparison Matrix

| Pattern | Primary Purpose | Complexity | .NET Integration | Common Use Cases |
|---------|----------------|------------|------------------|------------------|
| **Factory** | Object Creation | Low-Medium | DI Container | Database providers, loggers, plugins |
| **Strategy** | Algorithm Selection | Low | Func<T>, delegates | Payment processing, validation, sorting |
| **Observer** | Event Notification | Medium | Events, IObservable | UI updates, pub-sub systems |
| **Decorator** | Dynamic Behavior Addition | Medium | Stream classes | Logging, caching, authorization |
| **Mediator** | Reduce Coupling | Medium-High | MediatR library | CQRS, message passing |
| **CQRS** | Read/Write Separation | High | MediatR, EF Core | High-performance apps, event sourcing |

## Quick Decision Guide

### Choose Factory When:
- Object creation logic is complex
- You need to create different objects based on configuration
- You want to centralize object creation logic
- You're implementing dependency injection

### Choose Strategy When:
- You have multiple algorithms for a specific task
- You want to switch algorithms at runtime
- You want to avoid complex conditional statements
- Different clients need different algorithm variants

### Choose Observer When:
- One object changes and others need to be notified
- You need loose coupling between subject and observers
- You're implementing event-driven systems
- You need publish-subscribe functionality

### Choose Decorator When:
- You need to add responsibilities to objects dynamically
- Extension by subclassing is impractical
- You want to add features to individual objects, not entire classes
- You need to combine multiple behaviors

### Choose Mediator When:
- You have many objects communicating in complex ways
- Reusing objects is difficult due to many dependencies
- You want to centralize complex communications and control
- You're implementing CQRS or message-based architecture

### Choose CQRS When:
- Read and write workloads differ significantly
- You need different data models for reading vs writing
- You're building high-performance or scalable systems
- You need to implement event sourcing
- You want to optimize queries separately from commands

## Common Anti-Patterns to Avoid

### Factory Anti-Patterns
- Creating factories for simple object construction
- Not using dependency injection with factories
- Creating too many factory variants for similar objects

### Strategy Anti-Patterns
- Using strategy for a single algorithm
- Not considering simple delegates/lambdas first
- Creating strategies that depend on each other

### Observer Anti-Patterns
- Creating memory leaks with strong event references
- Not unsubscribing from events
- Making observers depend on notification order

### Decorator Anti-Patterns
- Creating too many decorator layers (complexity)
- Using decorators when simple inheritance would work
- Not maintaining the component interface properly

### Mediator Anti-Patterns
- Creating a "god object" mediator that does too much
- Using mediator for simple object communication
- Not leveraging MediatR library in .NET applications

### CQRS Anti-Patterns
- Using CQRS for simple CRUD applications
- Not considering eventual consistency implications
- Duplicating logic between command and query sides
- Over-engineering simple scenarios

## Learning Path

### Beginner (Start Here)
1. **Strategy Pattern** - Easiest to understand and implement
2. **Factory Pattern** - Common in .NET, good DI integration
3. **Observer Pattern** - Familiar if you've used .NET events

### Intermediate
4. **Decorator Pattern** - More complex composition
5. **Mediator Pattern** - Introduction to message-based architecture

### Advanced
6. **CQRS Pattern** - Architectural pattern, complex but powerful

## Real-World .NET Examples

### Factory Pattern
- `DbProviderFactory` for database providers
- `LoggerFactory` in Microsoft.Extensions.Logging
- `HttpClientFactory` in ASP.NET Core

### Strategy Pattern
- `IComparer<T>` for sorting strategies
- Validation attributes in ASP.NET
- Routing strategies in ASP.NET Core

### Observer Pattern
- .NET Events and EventHandler
- `IObservable<T>` and `IObserver<T>` (Reactive Extensions)
- Change tracking in Entity Framework

### Decorator Pattern
- Stream classes (`FileStream`, `BufferedStream`, `CryptoStream`)
- Middleware in ASP.NET Core
- `ActionFilterAttribute` in MVC

### Mediator Pattern
- MediatR library for CQRS
- ASP.NET Core middleware pipeline
- WPF command pattern

### CQRS Pattern
- Event-sourced systems with MediatR
- Microservices with separate read/write databases
- High-traffic applications with query optimization

## Testing Considerations

### Factory Pattern Testing
- Mock the factory to return test objects
- Test factory logic independently
- Verify correct object types are created

### Strategy Pattern Testing
- Test each strategy independently
- Test strategy selection logic
- Mock strategies for context testing

### Observer Pattern Testing
- Test notification delivery
- Test subscription/unsubscription
- Verify observer state changes

### Decorator Pattern Testing
- Test each decorator independently
- Test decorator chains
- Verify core component behavior preserved

### Mediator Pattern Testing
- Test handlers independently (unit tests)
- Test pipeline behaviors separately
- Use in-memory mediator for integration tests

### CQRS Pattern Testing
- Test commands and queries independently
- Test validation separately
- Use in-memory databases for integration tests
- Test eventual consistency scenarios

## Performance Considerations

| Pattern | Performance Impact | Memory Impact | Scalability |
|---------|-------------------|---------------|-------------|
| Factory | Minimal | Minimal | Excellent |
| Strategy | Minimal | Low | Excellent |
| Observer | Low-Medium | Medium | Good (watch for memory leaks) |
| Decorator | Low | Medium | Good (avoid deep nesting) |
| Mediator | Low-Medium | Medium | Excellent |
| CQRS | Variable | Higher | Excellent (with proper design) |

## Additional Resources

### Books
- "Design Patterns: Elements of Reusable Object-Oriented Software" (Gang of Four)
- "Head First Design Patterns"
- "C# Design Patterns" by Vaskaran Sarcar

### Online Resources
- Microsoft Docs: Design Patterns
- Refactoring Guru: Design Patterns
- Source Making: Design Patterns

### Libraries
- **MediatR**: Mediator pattern implementation for .NET
- **Autofac/Microsoft.Extensions.DependencyInjection**: Dependency injection containers
- **Rx.NET**: Reactive Extensions for Observer pattern
- **Scrutor**: Assembly scanning for decorator registration

## Contributing
When adding new exercises:
1. Follow the Q&A format
2. Include code examples
3. Provide real-world scenarios
4. Note common mistakes
5. Organize by difficulty level

## Exercise Format
Each exercise file follows this structure:
- **Foundational Questions** - Basic understanding and simple implementations
- **Intermediate Questions** - Real-world scenarios and integrations
- **Advanced Questions** - Complex scenarios, optimizations, and best practices
