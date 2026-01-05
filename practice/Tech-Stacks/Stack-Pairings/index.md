# Frontend ↔ Backend Stack Pairings - Practice Exercises

Practice answering “do some stacks work better together?” with clean, senior-level framing.

---

## Foundations

**Q: Do some frontend + backend stacks pair naturally? Why?**

A: Yes — not because of hard technical constraints, but because of ecosystem fit (tooling, conventions, hiring) and common architecture patterns. With clean API boundaries, the frontend becomes more interchangeable.

---

**Q: What are the three main reasons “natural pairings” happen?**

A: Ecosystem fit (libraries/tooling), architecture fit (SPA + API, BFF, real-time), and operational fit (deployment/observability defaults and team habits).

---

**Q: Give the ultra-short interview answer (10 seconds).**

A: “Angular + .NET is common in enterprise, React + .NET in dashboards/fintech, and React + Go in high-concurrency systems.”

---

## Pairing Recall Drills

**Q: Why is Angular + .NET a common enterprise pairing?**

A: Both are opinionated and structured, the TypeScript ↔ C# symmetry helps teams move faster, and it’s a common hiring/tooling match in large orgs.

---

**Q: What’s a typical Angular + .NET stack?**

A: Angular, ASP.NET Core Web API, EF Core, SQL Server/PostgreSQL, deployed on Azure/IIS/Docker.

---

**Q: Give an “interview sentence” for Angular + .NET.**

A: “Angular and .NET fit well because both enforce structure and scale nicely in large teams.”

---

**Q: Why is React + .NET a common pairing today?**

A: React is UI-flexible and backend-agnostic, while .NET provides stable APIs and great real-time options (SignalR), making it a strong combo for dashboards and line-of-business apps.

---

**Q: What’s a typical React + .NET stack?**

A: React, ASP.NET Core, REST/SignalR/WebSockets, Redis, and PostgreSQL/SQL Server.

---

**Q: Why is React + Node.js such a common pairing?**

A: TypeScript end-to-end, fast iteration, huge ecosystem, and strong community patterns (Next.js, Express/Nest, etc.).

---

**Q: What’s the main trade-off you should mention for Node.js backends?**

A: For CPU-heavy or performance-critical services, .NET/Go/Java are often better fits; Node still works well for BFF/API gateway layers.

---

**Q: Why do teams pair React with Go?**

A: Go is excellent for high concurrency and throughput with simple operational characteristics; React handles UI complexity while Go serves clean APIs (often REST or gRPC).

---

## Backend-First Thinking

**Q: What does “backend-first pairing” mean?**

A: The backend choice drives most constraints (performance, data consistency, integrations). If the backend exposes clean, versioned contracts, the frontend can be swapped with less risk.

---

**Q: Fill in the table of common backend-first pairings.**

A:

| Backend | Goes Well With  | Why                     |
| ------- | --------------- | ----------------------- |
| .NET    | Angular / React | Enterprise, fintech     |
| Go      | React / Svelte  | Performance, simplicity |
| Java    | Angular / React | Large orgs              |
| Node    | React / Vue     | TypeScript everywhere   |
| Python  | React           | AI / data APIs          |

---

## Scenario Prompts

**Q: You’re building a real-time trading dashboard (live prices + execution updates). What pairing do you choose and why?**

A: React + .NET is a strong default (stable APIs + SignalR for real-time). React + Go is also strong if you need very high concurrency; choose based on team skill and operational maturity.

---

**Q: You need to ship an internal CRUD tool fast with a small team. What pairing do you choose?**

A: React + Node or React + .NET can both work. Optimize for team familiarity and delivery speed, then protect the boundary with clear contracts and tests.

---

**Q: You have CPU-heavy pricing/analytics logic. How do you describe your stack choice?**

A: Put the CPU-heavy service in .NET/Go/Java, expose it via stable APIs, and use any frontend (React/Angular) as a consumer. Node can still be used as a BFF if it helps with aggregation.

---

## One-Minute Answer Drill

**Q: Give a 1-minute whiteboard answer to “Do some stacks work better together?”**

A: “Yes — not because of technical limitations, but because of ecosystem fit. For example, Angular often pairs with .NET in enterprise due to typing and structure, while React pairs well with .NET or Go because it’s backend-agnostic. The important part is clean API boundaries — stable contracts, auth, versioning, and observability — so the frontend stays replaceable as requirements evolve.”

---

## Resources

- For the full notes, see [Stack Pairings Notes](../../../notes/Tech-Stacks/Stack-Pairings/index.md).

---

**Total Exercises:** 14+
