# C# Interview Prep - Practice Exercises

Comprehensive practice exercises organized by topic, mirroring the notes folder structure.

---

## Current Structure

### Completed Files ✓

1. **Collections-And-Enumerables/**
   - `index.md` - 40+ LINQ & Collections exercises (migrated from linq-collections.md)

2. **SOLID/**
   - `index.md` - Overview of all SOLID principles
   - `S-Single-Responsibility-Principle-Exercises.md` - 25+ SRP exercises

3. **advanced-topics/**
   - `async-await-exercises.md` - 40+ async/await exercises (migrated from async-resilience.md)

4. **Root Documentation/**
   - `PRACTICE-STRUCTURE.md` - Complete roadmap of all planned exercise files
   - `README.md` - This file

---

## Folder Structure Overview

```
practice/
├── SOLID/
│   ├── index.md ✓
│   ├── S-Single-Responsibility-Principle-Exercises.md ✓
│   ├── O-Open-Closed-Principle-Exercises.md (pending)
│   ├── L-Liskov-Substitution-Principle-Exercises.md (pending)
│   ├── I-Interface-Segregation-Principle-Exercises.md (pending)
│   └── D-Dependency-Inversion-Principle-Exercises.md (pending)
│
├── Design-Patterns/
│   ├── index.md (pending)
│   ├── Factory-Pattern-Exercises.md (pending)
│   ├── Strategy-Pattern-Exercises.md (pending)
│   ├── Observer-Pattern-Exercises.md (pending)
│   ├── Decorator-Pattern-Exercises.md (pending)
│   ├── Mediator-Pattern-Exercises.md (pending)
│   └── CQRS-Pattern-Exercises.md (pending)
│
├── Collections-And-Enumerables/
│   ├── index.md ✓ (40+ exercises)
│   ├── IEnumerable-Exercises.md (pending)
│   ├── ICollection-Exercises.md (pending)
│   ├── IList-Exercises.md (pending)
│   ├── IReadOnly-Exercises.md (pending)
│   └── IQueryable-Exercises.md (pending)
│
├── Big-O-Complexity/
│   ├── index.md (pending)
│   ├── O1-Constant-Time-Exercises.md (pending)
│   ├── OLogN-Logarithmic-Time-Exercises.md (pending)
│   ├── ON-Linear-Time-Exercises.md (pending)
│   ├── ONLogN-Linearithmic-Time-Exercises.md (pending)
│   ├── ON2-Quadratic-Time-Exercises.md (pending)
│   └── Space-Complexity-Exercises.md (pending)
│
├── Clean-Architecture/
│   └── index.md (pending - 30+ exercises)
│
├── Automapper/
│   └── index.md (pending - 25+ exercises)
│
├── FluentValidation/
│   └── index.md (pending - 25+ exercises)
│
├── Memory-Allocation-Discipline/
│   └── index.md (pending - migrate from performance-memory.md)
│
├── DRY/
│   └── index.md (pending - 20+ exercises)
│
├── Use-Cases/massive-traffic/
│   ├── index.md (pending)
│   ├── async-patterns-exercises.md (pending)
│   ├── backpressure-rate-limiting-exercises.md (pending)
│   ├── caching-strategies-exercises.md (pending)
│   ├── database-scaling-exercises.md (pending)
│   ├── message-queues-exercises.md (pending)
│   ├── resilience-patterns-exercises.md (pending)
│   └── observability-exercises.md (pending)
│
├── advanced-topics/
│   ├── async-await-exercises.md ✓ (40+ exercises)
│   ├── clr-gc-exercises.md (pending)
│   ├── dependency-injection-exercises.md (pending)
│   ├── reflection-exercises.md (pending)
│   └── rabbitmq-exercises.md (pending)
│
├── error-handling-exercises.md (pending)
├── logging-exercises.md (pending)
└── testing-strategies-exercises.md (pending)
```

---

## Quick Start Guide

### For Beginners
1. Start with `SOLID/index.md` for fundamental OOP principles
2. Move to `Collections-And-Enumerables/index.md` for LINQ mastery
3. Practice `advanced-topics/async-await-exercises.md` for async patterns

### For Intermediate Developers
1. Complete all SOLID principle exercises
2. Work through Design Pattern exercises
3. Master Big-O Complexity analysis
4. Practice Use-Cases/massive-traffic scenarios

### For Advanced Developers
1. Focus on Clean Architecture patterns
2. Deep dive into Memory-Allocation-Discipline
3. Master all resilience and observability patterns
4. Practice real-world massive-traffic scenarios

---

## Exercise Format

All exercises follow a consistent Q&A format:

```markdown
**Q: [Question describing the problem or scenario]**

A: [Answer with detailed explanation]

```csharp
// Code example demonstrating the solution
```

Use when: [When to apply this pattern/approach]
Avoid when: [When NOT to use this pattern/approach]
```

---

## Topics Covered

### Core Principles
- SOLID Principles (SRP, OCP, LSP, ISP, DIP)
- DRY (Don't Repeat Yourself)
- Clean Architecture

### Design Patterns
- Creational: Factory, Abstract Factory
- Behavioral: Strategy, Observer, Mediator
- Structural: Decorator
- Architectural: CQRS, Event Sourcing

### Data & Collections
- IEnumerable, ICollection, IList, IQueryable
- LINQ operators and query patterns
- Custom iterators and yield
- Deferred execution

### Performance & Optimization
- Big-O complexity analysis
- Memory allocation discipline
- Stack vs Heap
- Garbage collection
- Span<T> and Memory<T>

### Async & Concurrency
- Async/await patterns
- Task coordination
- Cancellation tokens
- Producer-consumer patterns
- Backpressure handling

### Architecture & Scalability
- Massive traffic handling
- Caching strategies
- Database scaling
- Message queues
- Resilience patterns
- Observability

### Quality & Testing
- Error handling strategies
- Logging best practices
- Testing strategies (Unit, Integration, E2E)
- TDD practices

### Libraries & Frameworks
- AutoMapper configurations
- FluentValidation rules
- Dependency Injection
- Polly resilience
- RabbitMQ messaging

---

## Progress Tracking

### Completed (3 files)
- Collections-And-Enumerables/index.md
- SOLID/index.md
- SOLID/S-Single-Responsibility-Principle-Exercises.md
- advanced-topics/async-await-exercises.md
- PRACTICE-STRUCTURE.md (roadmap)
- README.md (this file)

### High Priority (Create Next)
- SOLID remaining principles (4 files)
- Design Patterns (7 files)
- Big-O Complexity (7 files)
- Memory-Allocation-Discipline (1 file)

### Medium Priority
- Clean Architecture, Automapper, FluentValidation
- Error handling, logging, testing strategies
- Collections detailed files

### Lower Priority
- Use-Cases/massive-traffic files
- advanced-topics remaining files

---

## Content Migration Status

### Migrated ✓
- `linq-collections.md` → `Collections-And-Enumerables/index.md`
- `async-resilience.md` → `advanced-topics/async-await-exercises.md`

### To Be Migrated
- `performance-memory.md` → `Memory-Allocation-Discipline/index.md`
- `questions.md` → Distribute to relevant topic files
- Preserve all existing questions from all practice files

---

## Contributing Guidelines

When creating new exercise files:

1. **Follow the standard format**:
   - Q&A style with code examples
   - Include "Use when" and "Avoid when" guidance
   - Organize by difficulty: Foundational → Intermediate → Advanced → Expert

2. **Provide comprehensive examples**:
   - Real-world scenarios
   - Working code examples
   - Anti-patterns to avoid

3. **Include context**:
   - When to use the pattern
   - Common pitfalls
   - Performance implications

4. **Cross-reference**:
   - Link to related exercises
   - Reference corresponding notes files

---

## Estimated Total Content

- **Files**: 50+ comprehensive exercise files
- **Exercises**: 1,000+ practice questions
- **Code Examples**: 2,000+ code snippets
- **Topics**: 20+ major topic areas

---

## Next Steps

To continue building this comprehensive practice resource:

1. Create remaining SOLID principle exercises (O, L, I, D)
2. Build out Design Patterns exercises
3. Create Big-O Complexity analysis exercises
4. Develop Memory-Allocation-Discipline content
5. Complete Use-Cases/massive-traffic scenarios
6. Add error-handling, logging, and testing exercises

See `PRACTICE-STRUCTURE.md` for the complete roadmap and detailed file specifications.

---

## Study Recommendations

### Daily Practice Routine
1. Pick one topic from the current folder
2. Work through 5-10 exercises
3. Implement the code examples
4. Review "Use when" and "Avoid when" sections
5. Apply learnings to a personal project

### Weekly Goals
- Complete one major topic folder (e.g., all SOLID principles)
- Build a mini-project applying the patterns learned
- Review and refactor previous code with new knowledge

### Interview Preparation
- Focus on SOLID, Design Patterns, and Collections first
- Practice explaining answers out loud
- Time yourself on coding exercises
- Review real-world scenarios and architectural decisions

---

**Last Updated**: December 21, 2024

For questions or suggestions, refer to the main repository documentation.
