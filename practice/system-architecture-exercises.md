# System Architecture - Practice Exercises

Exercises focused on system-level topology choices (microservices, modular monolith, event-driven, micro-kernel).

---

## Foundations

**Q: Explain the difference between a modular monolith and microservices.**

A: A modular monolith is a single deployable with strong internal boundaries, while microservices are independently deployed services with separate data ownership. The monolith is simpler operationally; microservices scale and deploy independently but introduce distributed complexity.

---

## Scenario Decisions

**Q: You are a 6-person team building a trading platform MVP. Which architecture should you start with and why?**

A: Start with a modular monolith. It enables fast delivery, strong consistency, and simpler operations. Design module boundaries so you can split services later if needed.

---

**Q: You need to process millions of price ticks per second and fan out to multiple consumers. Which system style fits best?**

A: Event-driven architecture. Use a broker (Kafka/RabbitMQ) to publish ticks and let consumers scale independently.

---

## Design Exercises

**Q: Sketch a high-level system architecture for an order execution system using microservices.**

A:

```
[API Gateway]
   |       |        |
[Orders] [Risk]  [Pricing]
   |        |       |
 [DB]    [DB]    [Cache]
   |
 [Broker] -> [Audit]
```

---

**Q: Explain how you would enforce data ownership in microservices.**

A: Each service owns its database and schema. Other services access data via APIs or events, not direct DB access. Cross-service workflows use sagas and events.

---

## Implementation Drill

**Q: Describe how you would implement an outbox pattern to keep DB and events consistent.**

A: Write domain changes and an outbox record in the same transaction. A background worker reads the outbox table and publishes events to the broker, marking them as sent.

---

## Advanced Trade-offs

**Q: What operational capabilities do you need before moving to microservices?**

A: Observability (logging, metrics, tracing), mature CI/CD, automated testing, service discovery, resilient networking, and on-call maturity.

---

**Q: Where does a micro-kernel architecture make sense in trading systems?**

A: When you need a stable core with customizable plugins, such as client-specific risk engines or pricing strategies.

---

## Trading Scenario

**Q: You are asked to move a trading system to microservices but latency is critical. How do you respond?**

A: Start with a modular monolith and prove performance. If microservices are required, keep latency-sensitive paths in fewer services, use async messaging for non-critical flows, and benchmark end-to-end latency.

---

**Total Exercises:** 10+
