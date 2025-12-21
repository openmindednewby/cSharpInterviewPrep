# System Architecture - System-Level Structure and Trade-offs

> Choose a system topology that matches scale, team size, and operational maturity.

---

## Quick Overview

- **Modular Monolith:** Single deployable with strong internal boundaries.
- **Microservices:** Independent services with separate deploys and data stores.
- **Event-Driven Architecture:** Services communicate via events and queues.
- **Micro-kernel (Plugin):** Core system with pluggable extensions.
- **Layered / N-Tier:** Classic presentation, business, data tiers.

---

## Detailed Explanation

### Modular Monolith

**What it is:** A single deployment with strict module boundaries (e.g., Orders, Pricing, Risk).

**Pros:**
- Simple deployment and debugging
- Strong consistency and transactions
- Clear boundaries without distributed complexity

**Cons:**
- Scaling is all-or-nothing
- Boundary violations creep in without discipline

**Use it when:** Team is small to medium and you want fast delivery with strong consistency.

---

### Microservices

**What it is:** Independent services owning their data and deploy lifecycle.

```
[API Gateway]
   |      |      |
[Orders][Pricing][Risk]
   |       |      |
 [DB]    [DB]   [DB]
```

**Pros:**
- Independent scaling and deployments
- Clear ownership boundaries
- Technology flexibility per service

**Cons:**
- Distributed systems complexity
- Data consistency challenges
- Higher operational overhead (observability, tracing, CI/CD)

**Use it when:** You have multiple teams, different scaling needs, and strong DevOps maturity.

---

### Event-Driven Architecture

**What it is:** Services publish events; consumers react asynchronously.

**Pros:**
- Loose coupling
- Natural fit for streaming (price ticks, trade events)
- Resilient under bursts

**Cons:**
- Eventual consistency
- Harder debugging without tracing
- Need idempotency and deduplication

**Use it when:** You need high throughput, asynchronous workflows, or streaming pipelines.

---

### Micro-kernel (Plugin Architecture)

**What it is:** A small core with extensible plugins.

**Pros:**
- Extend behavior without changing core
- Clear contract for integrations

**Cons:**
- Plugin lifecycle and versioning complexity
- Requires strict API contracts

**Use it when:** You need a stable core with customizable extensions (e.g., risk engines per client).

---

### Layered / N-Tier

**What it is:** Classic tier separation (UI, business, data) often deployed together.

**Pros:**
- Easy to understand
- Works well for small internal apps

**Cons:**
- Can become tightly coupled
- Hard to scale parts independently

---

## Choosing a System Architecture

- **Need fast delivery and strong consistency?** Start with a modular monolith.
- **Need independent scaling and multi-team ownership?** Consider microservices.
- **Need streaming or decoupled workflows?** Add event-driven messaging.
- **Need extensibility for clients/plugins?** Use micro-kernel patterns.

---

## Why It Matters for Interviews

- You can explain **trade-offs** instead of repeating buzzwords.
- You can tie topology to **operational maturity** (observability, CI/CD, on-call).
- You can articulate **data consistency and failure modes**.

---

## Common Pitfalls

- Jumping to microservices without operational readiness.
- Ignoring data ownership boundaries between services.
- Mixing synchronous calls with event-driven flows without clear SLAs.
- Treating a monolith as a microservice without modular boundaries.

---

## Quick Reference

- **Modular Monolith:** One deploy, clear boundaries, strong consistency.
- **Microservices:** Multiple deploys, independent scaling, higher ops cost.
- **Event-Driven:** Async workflows, eventual consistency, needs idempotency.
- **Micro-kernel:** Core + plugins, strict contracts.

---

## Sample Interview Q&A

- **Q:** When would you prefer a modular monolith over microservices?
  - **A:** When you need speed, strong consistency, and your team/ops maturity is not ready for distributed complexity.

- **Q:** How do you avoid data inconsistency in microservices?
  - **A:** Use clear data ownership, outbox/inbox patterns, idempotent consumers, and sagas for workflows.

- **Q:** Why is event-driven architecture common in trading systems?
  - **A:** Market data and trades are naturally streams of events, and async pipelines handle bursts without blocking request paths.
