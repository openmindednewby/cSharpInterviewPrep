# 🧠 1️⃣ SOLID Principles — Deep Dive with Examples

---

- [S — Single Responsibility Principle (SRP)](S-Single-Responsibility-Principle-SRP.md)
- [O — Open/Closed Principle (OCP)](O-Open-Closed-Principle-OCP.md)
- [L — Liskov Substitution Principle (LSP)](L-Liskov-Substitution-Principle-LSP.md)
- [I — Interface Segregation Principle (ISP)](I-Interface-Segregation-Principle-ISP.md)
- [D — Dependency Inversion Principle (DIP)](D-Dependency-Inversion-Principle-DIP.md)

---

## Questions & Answers

**Q: Why are SOLID principles important for senior engineers?**

A: They’re heuristics for keeping codebases maintainable and evolvable. Applying SOLID reduces regressions, eases testing, and makes large systems like trading platforms adaptable to new requirements.

**Q: How do SOLID principles interact with Clean Architecture?**

A: Clean Architecture enforces layer boundaries; SOLID guides class-level design inside those layers. Together they ensure domains stay decoupled from infrastructure and classes remain focused.

**Q: Can you break SOLID intentionally?**

A: Yes, when performance or simplicity demands it. Document deviations, ensure tests cover the risk, and revisit later. SOLID is guidance, not dogma.

**Q: How do SOLID principles apply to microservices?**

A: Each service should have a single bounded context (SRP), expose stable contracts (OCP), adhere to interface segregation for clients, and depend on abstractions so infrastructure can evolve independently.

**Q: What metrics signal SOLID violations?**

A: High cyclomatic complexity, low cohesion, many reasons to change a class (SRP), or ripple effects from small requirements. Code reviews and architecture fitness functions can catch these.

**Q: How do SOLID principles improve testing?**

A: Focused classes are easier to test (SRP), abstractions enable mocking (DIP), and segregated interfaces prevent massive fakes. This reduces flakiness and speeds CI feedback.

**Q: How does LSP relate to API design?**

A: Derived types must honor base contracts; otherwise substitutability fails and consumers break. In APIs, ensure new versions remain backward compatible, mirroring LSP.

**Q: How does ISP influence public contracts?**

A: Expose narrow interfaces tailored to specific clients so they don't depend on methods they don't use. This minimizes breaking changes and improves clarity.

**Q: How does DIP show up in ASP.NET Core?**

A: Services depend on abstractions registered in DI containers. Infrastructure injects concrete implementations, enabling easier testing and swapping components like data stores.

**Q: How do you balance SOLID with performance?**

A: Apply SOLID first, measure, and only optimize hotspots. If adding an abstraction hurts perf, encapsulate the optimized path while documenting why the deviation exists.
