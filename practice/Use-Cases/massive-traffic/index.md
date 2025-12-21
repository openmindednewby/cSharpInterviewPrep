# Massive Traffic - Practice Exercises

Short set of practice prompts for high-throughput scenarios. Additional topic files will expand this area.

---

### Exercise 1: Load Shedding Strategy
**Q:** When should you drop requests and how do you signal it to clients?

A: Use 429/503 with retry hints when the system is saturated.

---

### Exercise 2: Rate Limiting Design
**Q:** Compare token bucket vs sliding window.

A: Token bucket smooths bursts; sliding window gives tighter limits.

---

### Exercise 3: Backpressure with Channels
**Q:** Use a bounded channel to prevent overload.

A: Bounded channels block producers when full, protecting downstream.

---

### Exercise 4: Cache-Aside for Hot Reads
**Q:** Implement a cache-aside pattern for quote lookups.

A: Check cache first, fall back to DB, then populate cache.

---

### Exercise 5: Read Replica Routing
**Q:** Route read-only queries to replicas.

A: Use separate read/write connections or a query router.

---

### Exercise 6: Idempotent Commands
**Q:** Make order placement idempotent during retries.

A: Use idempotency keys and dedupe storage.

---

### Exercise 7: Circuit Breakers
**Q:** Protect a downstream price service.

A: Trip the breaker after repeated failures and serve cached data.

---

### Exercise 8: Queue Consumer Scaling
**Q:** Scale consumers based on backlog.

A: Use metrics on queue depth to scale horizontally.

---

### Exercise 9: Observability Signals
**Q:** Which metrics matter most under massive traffic?

A: Latency percentiles, error rate, queue depth, and saturation.

---

### Exercise 10: Graceful Degradation
**Q:** How do you degrade features under load?

A: Disable non-critical endpoints and serve cached responses.
