# Testing Strategies for High-Performance, Highly Available Systems

Use these notes to articulate how you design and execute tests that protect performance, availability, and correctness. Keep them alongside the core concepts cheat sheet and tailor examples to your services.

---

## Unit Tests
- **Purpose:** Validate a single class/function in isolation with deterministic inputs/outputs.
- **Isolation:**
  - Mock external dependencies (I/O, network, time) with interfaces and test doubles.
  - Use in-memory fakes for lightweight state (e.g., `InMemoryRepository`) but prefer mocks for behavior verification.
- **Patterns:**
  - **Arrange-Act-Assert (AAA):** Make the phases explicit; minimize setup repetition with builders/AutoFixture.
  - **Given-When-Then naming:** `GivenHealthyAccount_WhenWithdraw_ThenBalanceUpdated` for intent clarity.
  - **Table-driven tests:** Iterate over scenarios via `Theory`/`InlineData` in xUnit to keep cases compact.
- **xUnit + Moq + Shouldly example:**
  ```csharp
  public class BalanceServiceTests
  {
      private readonly Mock<IAccountStore> _store = new();
      private readonly BalanceService _sut;

      public BalanceServiceTests()
      {
          _sut = new BalanceService(_store.Object);
      }

      [Theory]
      [InlineData(100, 40, 60)]
      [InlineData(50, 25, 25)]
      public async Task GivenBalance_WhenWithdraw_ThenBalanceUpdated(decimal starting, decimal debit, decimal expected)
      {
          _store.Setup(s => s.GetAsync("id", It.IsAny<CancellationToken>()))
                .ReturnsAsync(new Account("id", starting));

          await _sut.WithdrawAsync("id", debit, CancellationToken.None);

          _store.Verify(s => s.SaveAsync(It.Is<Account>(a => a.Balance == expected), It.IsAny<CancellationToken>()));
          _sut.LastLatencyMs.ShouldBeLessThan(5); // Cheap guardrail for perf-sensitive code paths
      }
  }
  ```
- **Performance-aware design:**
  - Avoid sleeping; use `TestScheduler`/`ManualResetEventSlim` for timing-sensitive logic.
  - Keep allocations predictable—reuse fixture data/builders instead of newing objects per assertion.
  - Target micro-benchmarks separately with BenchmarkDotNet rather than overloading unit tests.
- **Reliability:**
  - No hidden global state; reset static caches/singletons between runs.
  - Keep unit tests idempotent and order-independent.

## Integration Tests
- **Purpose:** Validate real wiring: DI container, middleware, persistence, messaging, and observability hooks.
- **Environment strategy:**
  - Run against ephemeral infra (Testcontainers/Docker Compose) with realistic versions of databases/queues.
  - Seed data via migrations + fixtures; tear down cleanly to avoid cross-test coupling.
  - Use unique resource names (DB names, queues) per test run to enable parallel execution.
- **Patterns:**
  - **`WebApplicationFactory`/`MinimalApiFactory`:** Spin up APIs in-memory with production middleware, swapping only endpoints you must stub (e.g., external HTTP clients).
  - **Contract tests:** Validate message schemas and HTTP contracts against consumer/provider expectations.
  - **Idempotency checks:** Re-run the same operation twice and assert consistent results to mirror at-least-once delivery.
- **Minimal integration test example (xUnit + WebApplicationFactory + Shouldly):**
  ```csharp
  public class HealthEndpointTests : IClassFixture<WebApplicationFactory<Program>>
  {
      private readonly HttpClient _client;

      public HealthEndpointTests(WebApplicationFactory<Program> factory)
      {
          _client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
      }

      [Fact]
      public async Task GetHealth_ReturnsOkAndBudgetedLatency()
      {
          var stopwatch = ValueStopwatch.StartNew();
          var response = await _client.GetAsync("/health");
          var elapsedMs = stopwatch.GetElapsedTime().TotalMilliseconds;

          response.StatusCode.ShouldBe(HttpStatusCode.OK);
          elapsedMs.ShouldBeLessThan(50, "health endpoints must stay fast to avoid liveness probe churn");
      }
  }
  ```
- **Performance & HA focus:**
  - Assert on latency budgets (e.g., middleware response times) with histogram/percentile metrics exposed in tests.
  - Simulate failure modes: kill containers, drop network, poison queue messages, exhaust connection pools—verify graceful degradation and recovery.
  - Validate circuit breakers, bulkheads, and timeouts are configured with realistic thresholds.

## Cross-Cutting Testing Practices
- **Test data discipline:** Centralize builders/fixtures to avoid duplication and to make hot-path payloads realistic (size, shape, field optionality).
- **Observability hooks:** Assert logs/metrics/traces for key scenarios (success, validation errors, retries). Use in-memory exporters for OpenTelemetry.
- **Deterministic time & randomness:** Inject clocks/`Random` seeds; freeze time in tests to avoid flakiness.
- **Parallelism:** Mark tests `Collection`-safe; isolate shared resources to allow high-concurrency runs in CI without interference.
- **CI pipeline:**
  - Run unit tests fast on every push; gate integration/system tests on main merge or nightly.
  - Capture artifacts (logs, coverage, traces) to speed triage when failures occur.
- **Coverage mindset:** Optimize for risk: critical paths (auth, payments, risk controls), failure handling, and regression-prone areas get deeper coverage.

## When Discussing in an Interview
- **Narrative:** Outline pyramid strategy—fast unit tests, targeted integration, and a few end-to-end paths covering the golden user journeys.
- **Performance posture:** Emphasize how tests enforce latency/error budgets and protect against resource exhaustion (threads, sockets, DB connections).
- **Availability posture:** Highlight chaos/failover scenarios you automate (leader election, connection drop, retry storms) and how you keep tests isolated and repeatable.
- **Tooling:** Mention xUnit, AutoFixture/FluentAssertions for clarity; Testcontainers/Docker Compose for realistic environments; Polly + OpenTelemetry assertions for resilience.

---

Keep these patterns close to the code you ship—optimize for speed, determinism, and confidence without slowing delivery.
