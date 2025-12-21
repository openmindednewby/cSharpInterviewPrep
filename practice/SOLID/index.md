# SOLID Principles - Practice Exercises

Master the five SOLID principles through comprehensive exercises and real-world scenarios.

---

## Overview

The SOLID principles are fundamental design principles for creating maintainable, scalable, and robust object-oriented software:

- **S**ingle Responsibility Principle (SRP)
- **O**pen/Closed Principle (OCP)
- **L**iskov Substitution Principle (LSP)
- **I**nterface Segregation Principle (ISP)
- **D**ependency Inversion Principle (DIP)

## Exercise Files

- [Single Responsibility Principle Exercises](S-Single-Responsibility-Principle-Exercises.md) - 25+ exercises
- [Open/Closed Principle Exercises](O-Open-Closed-Principle-Exercises.md) - 25+ exercises
- [Liskov Substitution Principle Exercises](L-Liskov-Substitution-Principle-Exercises.md) - 25+ exercises
- [Interface Segregation Principle Exercises](I-Interface-Segregation-Principle-Exercises.md) - 25+ exercises
- [Dependency Inversion Principle Exercises](D-Dependency-Inversion-Principle-Exercises.md) - 25+ exercises

---

## Quick Reference

### Single Responsibility Principle (SRP)
A class should have one, and only one, reason to change.

```csharp
// Bad: Multiple responsibilities
public class User
{
    public void SaveToDatabase() { }
    public void SendEmail() { }
    public string GenerateReport() { }
}

// Good: Separated responsibilities
public class User { }
public class UserRepository { public void Save(User user) { } }
public class EmailService { public void SendEmail(User user) { } }
public class ReportGenerator { public string Generate(User user) { } }
```

### Open/Closed Principle (OCP)
Software entities should be open for extension but closed for modification.

```csharp
// Bad: Modifying existing code for new features
public class DiscountCalculator
{
    public decimal Calculate(string customerType, decimal amount)
    {
        if (customerType == "Regular") return amount;
        if (customerType == "Premium") return amount * 0.9m;
        return amount;
    }
}

// Good: Extending through abstraction
public interface IDiscountStrategy
{
    decimal Calculate(decimal amount);
}

public class RegularDiscount : IDiscountStrategy
{
    public decimal Calculate(decimal amount) => amount;
}

public class PremiumDiscount : IDiscountStrategy
{
    public decimal Calculate(decimal amount) => amount * 0.9m;
}
```

### Liskov Substitution Principle (LSP)
Derived classes must be substitutable for their base classes.

```csharp
// Bad: Square violates LSP
public class Rectangle
{
    public virtual int Width { get; set; }
    public virtual int Height { get; set; }
}

public class Square : Rectangle
{
    public override int Width
    {
        set { base.Width = base.Height = value; }
    }
}

// Good: Proper abstraction
public interface IShape
{
    int GetArea();
}

public class Rectangle : IShape
{
    public int Width { get; set; }
    public int Height { get; set; }
    public int GetArea() => Width * Height;
}

public class Square : IShape
{
    public int Side { get; set; }
    public int GetArea() => Side * Side;
}
```

### Interface Segregation Principle (ISP)
Clients should not be forced to depend on interfaces they don't use.

```csharp
// Bad: Fat interface
public interface IWorker
{
    void Work();
    void Eat();
    void Sleep();
}

// Good: Segregated interfaces
public interface IWorkable { void Work(); }
public interface IFeedable { void Eat(); }
public interface ISleepable { void Sleep(); }

public class Human : IWorkable, IFeedable, ISleepable
{
    public void Work() { }
    public void Eat() { }
    public void Sleep() { }
}

public class Robot : IWorkable
{
    public void Work() { }
}
```

### Dependency Inversion Principle (DIP)
High-level modules should not depend on low-level modules. Both should depend on abstractions.

```csharp
// Bad: Direct dependency on concrete class
public class OrderProcessor
{
    private SqlDatabase _database = new SqlDatabase();

    public void Process(Order order)
    {
        _database.Save(order);
    }
}

// Good: Depend on abstraction
public interface IDatabase
{
    void Save(Order order);
}

public class OrderProcessor
{
    private readonly IDatabase _database;

    public OrderProcessor(IDatabase database)
    {
        _database = database;
    }

    public void Process(Order order)
    {
        _database.Save(order);
    }
}
```

---

## Practice Approach

1. Read each principle's dedicated exercise file
2. Start with foundational exercises
3. Progress through intermediate and advanced levels
4. Apply principles to real-world scenarios
5. Combine multiple SOLID principles in expert exercises

## Benefits of SOLID Principles

- **Maintainability**: Easier to understand and modify code
- **Testability**: Classes with single responsibilities are easier to test
- **Flexibility**: Open for extension enables adding features without breaking existing code
- **Reusability**: Well-designed abstractions can be reused across projects
- **Scalability**: Clean architecture supports growth and team collaboration

---

Start with the [Single Responsibility Principle Exercises](S-Single-Responsibility-Principle-Exercises.md) to begin your SOLID principles journey!
