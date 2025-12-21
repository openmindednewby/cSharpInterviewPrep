# Testing Strategies - Practice Exercises

A comprehensive set of exercises covering unit, integration, and system testing.

---

## Foundations

### Exercise 1: AAA Structure
**Q:** Rewrite a test to use Arrange-Act-Assert.

A: Separate setup, execution, and assertions with clear sections.

---

### Exercise 2: Pure Function Unit Test
**Q:** Write a unit test for a method that calculates fees.

A: Provide inputs, call the method, and assert the exact output.

---

### Exercise 3: Mocking a Repository
**Q:** Mock a repository to return a fixed entity.

A:
```csharp
_repo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(entity);
```

---

### Exercise 4: Exception Assertions
**Q:** Assert that a handler throws `BadRequestException`.

A:
```csharp
await Should.ThrowAsync<BadRequestException>(() => handler.Handle(cmd, ct));
```

---

### Exercise 5: Parameterized Tests
**Q:** Use `[Theory]` with `[InlineData]` to test multiple inputs.

A: Parameterized tests reduce duplication and improve coverage.

---

### Exercise 6: Test Naming
**Q:** Use the `Method_Scenario_Expected` naming pattern.

A: Example: `Handle_InvalidCommand_ThrowsBadRequest`.

---

### Exercise 7: Test Data Builders
**Q:** Create a builder for a complex Order entity.

A: Builders keep tests focused and avoid repeated setup.

---

### Exercise 8: Test Isolation
**Q:** Ensure tests do not depend on shared static state.

A: Reset shared data between tests or use fresh fixtures per test.

---

### Exercise 9: Stub vs Mock
**Q:** Explain when to use a stub vs a mock.

A: Use stubs for data, mocks for verifying interactions.

---

### Exercise 10: Assertions with Shouldly
**Q:** Convert `Assert.Equal` to Shouldly syntax.

A:
```csharp
result.ShouldBe(expected);
```

---

### Exercise 11: Edge Case Coverage
**Q:** Add tests for null inputs and empty collections.

A: Validate defensive behavior and error handling paths.

---

### Exercise 12: Avoid Over-Mocking
**Q:** Why is over-mocking risky?

A: It couples tests to implementation details and can miss integration issues.

---

## Integration

### Exercise 13: Testcontainers for Databases
**Q:** Spin up a temporary SQL container for integration tests.

A: Use Testcontainers to start a database per test run.

---

### Exercise 14: WebApplicationFactory
**Q:** Use `WebApplicationFactory` for API tests.

A: Create a client and call endpoints in memory.

---

### Exercise 15: Middleware Tests
**Q:** Test an exception-handling middleware.

A: Use a test server and verify the response status and body.

---

### Exercise 16: Contract Tests for HTTP Clients
**Q:** Validate assumptions about a downstream API.

A: Use Pact or similar tools to enforce contracts.

---

### Exercise 17: Consumer-Driven Contracts
**Q:** Explain how CDC reduces integration failures.

A: Consumers specify expectations, providers verify them in CI.

---

### Exercise 18: SQLite In-Memory EF Core
**Q:** Use SQLite in-memory for EF Core integration tests.

A: It supports relational behavior better than the InMemory provider.

---

### Exercise 19: Transaction Rollback
**Q:** Roll back DB changes after each test.

A: Use a transaction scope and rollback in teardown.

---

### Exercise 20: Background Service Integration Test
**Q:** Test a hosted service end-to-end.

A: Start the host and observe side effects or emitted events.

---

### Exercise 21: Message Handler Testing
**Q:** Test a message handler with an in-memory bus.

A: Publish a message and assert state changes or produced events.

---

### Exercise 22: Retry Policy Verification
**Q:** Verify a retry policy is applied to HTTP calls.

A: Use a fake HTTP handler and assert call count.

---

### Exercise 23: Snapshot Testing
**Q:** When is snapshot testing useful?

A: For stable outputs like API docs or structured responses.

---

### Exercise 24: Integration Test Cleanup
**Q:** Ensure tests clean up queues or caches.

A: Use teardown hooks to clear state and avoid test bleed.

---

## Advanced

### Exercise 25: TDD Cycle
**Q:** Describe the Red-Green-Refactor cycle.

A: Write a failing test, make it pass, then refactor safely.

---

### Exercise 26: Property-Based Testing
**Q:** Use property-based testing to validate invariants.

A: Generate many inputs and assert a property always holds.

---

### Exercise 27: Mutation Testing
**Q:** What does mutation testing reveal?

A: It identifies weak tests that do not fail when code is mutated.

---

### Exercise 28: Idempotency Tests
**Q:** Ensure a command is safe to retry.

A: Run the same command twice and assert no duplicate side effects.

---

### Exercise 29: Concurrency Tests
**Q:** Test a handler under parallel execution.

A: Use `Parallel.ForEachAsync` and assert thread-safe outcomes.

---

### Exercise 30: Timeout and Cancellation
**Q:** Verify cancellation tokens are honored.

A: Pass a canceled token and assert early exit.

---

### Exercise 31: Fake Clock
**Q:** Test time-dependent logic without real delays.

A: Inject `IClock` and control time in tests.

---

### Exercise 32: Cache Behavior
**Q:** Ensure cache hits avoid repository calls.

A: Use a mock repository and verify `Get` is not called on cache hit.

---

### Exercise 33: Logging Assertions
**Q:** Assert warning logs on invalid input.

A: Capture logs with a test logger and assert message templates.

---

### Exercise 34: Allocation Tests
**Q:** Detect allocations in a hot path.

A: Use BenchmarkDotNet or dotnet-counters to confirm zero allocations.

---

### Exercise 35: Resilience Under Failure
**Q:** Simulate partial dependency failures.

A: Stub downstream calls to fail and assert graceful degradation.

---

## Scenarios

### Exercise 36: Order Placement Integration
**Q:** Test a full order placement flow.

A: Call the API, verify DB state, and ensure events are emitted.

---

### Exercise 37: Market Data Ingestion
**Q:** Validate a pipeline processes messages in order.

A: Publish ordered messages and assert output ordering.

---

### Exercise 38: API Versioning Test
**Q:** Ensure v1 and v2 endpoints both work.

A: Call both versions and verify compatible responses.

---

### Exercise 39: Auth and Role Tests
**Q:** Test role-based access to endpoints.

A: Use a test auth handler and verify 403 for unauthorized roles.

---

### Exercise 40: Smoke Test Checklist
**Q:** Define a smoke test for deployment.

A: Health checks, basic CRUD, and a latency budget assertion.
