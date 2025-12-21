# Practice Folder Structure - Complete Guide

This document outlines the comprehensive practice folder structure that mirrors the notes folder organization at `c:\desktopContents\projects\cSharpInterviewPrep`.

---

## Completed Structure

### Collections-And-Enumerables/
- **index.md** ✓ - Comprehensive LINQ & Collections exercises (40+ exercises)
  - Foundational LINQ queries
  - Intermediate join and grouping operations
  - Advanced custom LINQ extensions
  - Performance optimization
  - Real-world scenarios

### SOLID/
- **index.md** ✓ - Overview of all SOLID principles with quick reference
- **S-Single-Responsibility-Principle-Exercises.md** ✓ - 25+ exercises on SRP
  - Class refactoring exercises
  - Real-world e-commerce scenarios
  - Logging and file processing systems

---

## To Be Created

### SOLID/ (Remaining Files)

- **O-Open-Closed-Principle-Exercises.md** - 25+ exercises
  - Strategy pattern implementations
  - Plugin architectures
  - Payment processing extensibility
  - Notification systems

- **L-Liskov-Substitution-Principle-Exercises.md** - 25+ exercises
  - Rectangle/Square problem
  - Collection hierarchies
  - Abstract base class scenarios
  - Substitution violations and fixes

- **I-Interface-Segregation-Principle-Exercises.md** - 25+ exercises
  - Fat interface refactoring
  - Role-based interfaces
  - Worker/Robot examples
  - Repository pattern segregation

- **D-Dependency-Inversion-Principle-Exercises.md** - 25+ exercises
  - Dependency injection examples
  - IoC container usage
  - Service abstractions
  - Testing with mocks

### Design-Patterns/

- **index.md** - Overview of design patterns
- **Factory-Pattern-Exercises.md** - 20+ exercises
  - Simple factory
  - Factory method
  - Abstract factory
  - Payment processor factories

- **Strategy-Pattern-Exercises.md** - 20+ exercises
  - Sorting strategies
  - Pricing strategies
  - Validation strategies
  - Compression algorithms

- **Observer-Pattern-Exercises.md** - 20+ exercises
  - Event handling
  - Stock price monitoring
  - UI updates
  - Pub/sub implementations

- **Decorator-Pattern-Exercises.md** - 20+ exercises
  - Stream decorators
  - Logging decorators
  - Caching decorators
  - Authorization decorators

- **Mediator-Pattern-Exercises.md** - 20+ exercises
  - Chat room mediator
  - Flight control system
  - UI component coordination
  - CQRS with MediatR

- **CQRS-Pattern-Exercises.md** - 20+ exercises
  - Command handlers
  - Query handlers
  - Event sourcing basics
  - Read/write separation

### Collections-And-Enumerables/ (Additional Files)

- **IEnumerable-Exercises.md** - 20+ exercises
  - Deferred execution
  - Custom iterators
  - Yield return patterns
  - Streaming data

- **ICollection-Exercises.md** - 15+ exercises
  - Add/Remove operations
  - Count optimizations
  - Custom collections
  - Thread-safe collections

- **IList-Exercises.md** - 15+ exercises
  - Indexing scenarios
  - Insert/RemoveAt operations
  - Sorted lists
  - Custom list implementations

- **IReadOnly-Exercises.md** - 15+ exercises
  - Immutability patterns
  - ReadOnlyCollection usage
  - IReadOnlyList implementations
  - Defensive copying

- **IQueryable-Exercises.md** - 20+ exercises
  - Expression trees
  - Dynamic queries
  - Database query optimization
  - Provider patterns

### Big-O-Complexity/

- **index.md** - Overview of time/space complexity
- **O1-Constant-Time-Exercises.md** - 15+ exercises
  - Dictionary lookups
  - Array access
  - Hash table operations

- **OLogN-Logarithmic-Time-Exercises.md** - 15+ exercises
  - Binary search
  - Balanced tree operations
  - Divide and conquer algorithms

- **ON-Linear-Time-Exercises.md** - 15+ exercises
  - Array traversals
  - Linear search
  - Single-pass algorithms

- **ONLogN-Linearithmic-Time-Exercises.md** - 15+ exercises
  - Merge sort
  - Quick sort
  - Heap sort

- **ON2-Quadratic-Time-Exercises.md** - 15+ exercises
  - Nested loops
  - Bubble sort
  - Selection sort
  - Optimization techniques

- **Space-Complexity-Exercises.md** - 20+ exercises
  - In-place algorithms
  - Auxiliary space analysis
  - Recursion stack space
  - Memory optimization

### Clean-Architecture/

- **index.md** - 30+ exercises
  - Layered architecture
  - Domain-driven design
  - Ports and adapters
  - Hexagonal architecture
  - Dependency rules
  - Use case implementation

### Automapper/

- **index.md** - 25+ exercises
  - Basic mappings
  - Custom resolvers
  - Projection queries
  - Flattening objects
  - Reverse mapping
  - Configuration validation

### FluentValidation/

- **index.md** - 25+ exercises
  - Basic validators
  - Custom validation rules
  - Async validation
  - Conditional validation
  - Complex object validation
  - Error message customization

### Memory-Allocation-Discipline/

- **index.md** - 20+ exercises (incorporating performance-memory.md content)
  - Stack vs heap allocation
  - Boxing/unboxing
  - Garbage collection
  - Span<T> and Memory<T>
  - ArrayPool usage
  - Large Object Heap optimization

### DRY/

- **index.md** - 20+ exercises
  - Code duplication detection
  - Abstraction patterns
  - Helper methods
  - Extension methods
  - Generic solutions
  - Configuration extraction

### Core Practice Files

- **error-handling-exercises.md** - 30+ exercises
  - Exception hierarchy
  - Try-catch patterns
  - Custom exceptions
  - Exception filters
  - Retry policies
  - Circuit breakers
  - Fallback strategies

- **logging-exercises.md** - 25+ exercises
  - Structured logging
  - Log levels
  - Correlation IDs
  - Logging best practices
  - Serilog/NLog usage
  - Performance considerations

- **testing-strategies-exercises.md** - 35+ exercises
  - Unit testing
  - Integration testing
  - E2E testing
  - TDD practices
  - Mocking with Moq
  - Test data builders
  - AAA pattern

### Use-Cases/massive-traffic/

- **index.md** - Overview of handling massive traffic
- **async-patterns-exercises.md** - 20+ exercises
  - Task.WhenAll/WhenAny
  - Async/await patterns
  - Cancellation tokens
  - Async streams
  - ValueTask usage

- **backpressure-rate-limiting-exercises.md** - 20+ exercises
  - Token bucket algorithm
  - Sliding window rate limiter
  - Backpressure handling
  - Channel bounded capacity
  - Load shedding

- **caching-strategies-exercises.md** - 25+ exercises
  - In-memory caching
  - Distributed caching
  - Cache-aside pattern
  - Write-through/write-behind
  - Cache invalidation
  - Redis integration

- **database-scaling-exercises.md** - 20+ exercises
  - Read replicas
  - Sharding strategies
  - Connection pooling
  - Query optimization
  - Indexing strategies
  - Materialized views

- **message-queues-exercises.md** - 20+ exercises
  - RabbitMQ patterns
  - Kafka usage
  - Message routing
  - Dead letter queues
  - Exactly-once delivery
  - Saga patterns

- **resilience-patterns-exercises.md** - 25+ exercises
  - Retry policies
  - Circuit breaker
  - Bulkhead isolation
  - Timeout policies
  - Fallback strategies
  - Health checks

- **observability-exercises.md** - 20+ exercises
  - Metrics collection
  - Distributed tracing
  - Log aggregation
  - OpenTelemetry
  - Prometheus/Grafana
  - Alert configuration

### advanced-topics/

- **async-await-exercises.md** - Content from async-resilience.md (40+ exercises)
  - Foundational async patterns
  - Producer-consumer patterns
  - Coordination patterns
  - Error handling
  - Real-world scenarios

- **clr-gc-exercises.md** - 25+ exercises
  - CLR internals
  - Garbage collector modes
  - Generation promotion
  - Finalization
  - GC tuning

- **dependency-injection-exercises.md** - 30+ exercises
  - DI lifetimes
  - Service registration
  - Constructor injection
  - Property injection
  - Factory patterns
  - Scope validation

- **reflection-exercises.md** - 20+ exercises
  - Type discovery
  - Dynamic invocation
  - Attribute inspection
  - Emit IL code
  - Performance considerations

- **rabbitmq-exercises.md** - 25+ exercises
  - Queue declaration
  - Exchange types
  - Routing patterns
  - Consumer patterns
  - Publisher confirms
  - Dead letter exchanges

---

## Migration Notes

### Content Moved
- `linq-collections.md` → `Collections-And-Enumerables/index.md` ✓
- `async-resilience.md` → `advanced-topics/async-await-exercises.md` (pending)
- `performance-memory.md` → `Memory-Allocation-Discipline/index.md` (pending)

### Content to Preserve
All questions from the following files should be integrated into the appropriate new files:
- `questions.md` - Distribute to relevant topic files
- `async-resilience.md` - Keep all async/await questions
- `linq-collections.md` - Already moved ✓
- `performance-memory.md` - Integrate into Memory-Allocation-Discipline

---

## Exercise Format Standard

All exercise files follow this format:

```markdown
# [Topic Name] - Exercises

Brief description of the topic.

---

## Foundational Questions

**Q: [Question text]**

A: [Answer with explanation]

```csharp
// Code example
```

Use when: [When to use this approach]
Avoid when: [When NOT to use this approach]

---

## Intermediate Exercises

[Similar format]

---

## Advanced Exercises

[Similar format]

---

## Real-World Scenarios

[Practical applications]

---

## Expert/Challenge Problems

[Complex scenarios]

---

**Total Exercises: [Count]+**
```

---

## Next Steps

1. Create remaining SOLID principle files (4 files)
2. Create Design Patterns exercise files (7 files)
3. Create Collections detailed files (5 files)
4. Create Big-O Complexity files (7 files)
5. Create remaining topic files
6. Migrate content from existing practice files
7. Verify all questions are preserved

---

## File Creation Priority

### High Priority (Core Learning)
1. SOLID principles (remaining 4 files)
2. Design Patterns (7 files)
3. Big-O Complexity (7 files)
4. Memory-Allocation-Discipline (1 file)

### Medium Priority (Specialized Topics)
5. Clean Architecture (1 file)
6. Automapper (1 file)
7. FluentValidation (1 file)
8. Testing Strategies (1 file)

### Lower Priority (Advanced/Supplementary)
9. Use-Cases/massive-traffic (7 files)
10. advanced-topics (remaining 4 files)
11. Collections detailed files (5 files)

---

**Total Files to Create: 50+ comprehensive exercise files**
**Estimated Total Exercises: 1,000+ practice questions and scenarios**
