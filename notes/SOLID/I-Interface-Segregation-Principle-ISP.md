## **I — Interface Segregation Principle (ISP)**

> “Clients should not be forced to depend on methods they do not use.”

### ❌ Bad example:

```csharp
public interface ITradingPlatform
{
    void ExecuteOrder(Order order);
    void StreamMarketData();
    void SendNotification();
}
```

Each implementation is forced to implement everything, even if it doesn’t need to.

### ✅ Good example:

```csharp
public interface ITradeExecutor { void ExecuteOrder(Order order); }
public interface IMarketDataFeed { void StreamMarketData(); }
public interface INotifier { void SendNotification(); }
```

💡 **In trading:**

* `IPriceFeed` for market data
* `ITradeExecutor` for execution
* `IRiskService` for validation

You can plug each service independently into different workflows.

---

## Questions & Answers

**Q: How does ISP improve system evolvability?**

A: Narrow interfaces reduce the blast radius of changes. Updating `ITradeExecutor` doesn’t force unrelated services (like notifications) to recompile or implement dummy methods.

**Q: What’s a sign you need ISP?**

A: Clients implementing “not required” methods or throwing `NotSupportedException`. Interfaces with dozens of members or mixed responsibilities are prime candidates.

**Q: How does ISP relate to microservices?**

A: External contracts should expose purpose-built endpoints, not monolithic APIs. Clients consume only what they need, reducing coupling and versioning risks.

**Q: How do interface segregations interact with DI?**

A: DI allows registering multiple interfaces per class. For example, a service implementing both `ITradeExecutor` and `IRiskService` can be resolved through whichever interface the consumer needs.

**Q: How do you avoid explosion of tiny interfaces?**

A: Segregate by cohesive responsibilities, not per method. Keep interfaces meaningful and group operations that change together.

**Q: How does ISP benefit testing?**

A: Smaller interfaces mean simpler mocks/stubs. Tests focus on the behavior under test without faking unrelated members.

**Q: Can versioning break ISP?**

A: Adding methods to a fat interface forces consumers to adapt. With segregated interfaces, you can introduce new interfaces or extension methods without breaking existing ones.

**Q: How do you enforce ISP in reviews?**

A: Ask “which clients need each member?” and require justification for multi-purpose interfaces. NetArchTest or custom analyzers can flag interfaces exceeding size thresholds.

**Q: How does ISP apply to domain events?**

A: Publish separate events per concern instead of mega-events containing everything. Consumers subscribe only to relevant payloads, mirroring ISP.

**Q: How does ISP help with performance?**

A: Clients avoid referencing heavy dependencies they don't use (e.g., price feeds requiring streaming libs). This reduces memory footprint and simplifies deployment.
