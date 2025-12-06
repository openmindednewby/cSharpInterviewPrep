# Copilot Instructions

These guidelines help Copilot produce production-grade suggestions for any project. Keep prompts short, specify intent and constraints, and prune noisy context files before invoking Copilot.

## General principles
- Default to minimal, composable designs with clear separation of concerns. Prefer pure functions and small objects with single responsibilities.
- Optimize for clarity: explicit names, predictable control flow, and comments only where intent is non-obvious.
- Keep solutions framework- and domain-agnostic unless the prompt demands otherwise. Avoid vendor lock-in and hidden magic.
- Prefer immutability and side-effect containment. Make data flows explicit and avoid global state.

## Coding standards
- Match existing style and conventions in the repo (language syntax, lint rules, formatting). Use the linter/formatter instead of hand-formatting.
- Write defensive APIs: validate inputs early, use guard clauses, and document preconditions/postconditions.
- Fail fast on programmer errors; use structured errors/results for expected outcomes. Surface actionable messages.
- Avoid premature abstraction; extract shared pieces only after clear duplication appears.

## Performance & reliability
- Choose algorithms and data structures for big-O impact first; measure before micro-optimizing.
- Prefer async/non-blocking I/O; avoid unnecessary allocation or reflection in hot paths. Reuse buffers/objects when safe.
- Honour cancellation/timeouts, especially around external calls. Design operations to be idempotent.
- Wrap remote calls with resilience patterns (timeouts, retries with jitter, circuit breakers, bulkheads) and avoid cascading failures.

## Security & privacy
- Never log secrets, tokens, or PII. Use secure defaults for crypto, TLS, and random number generation.
- Validate and encode all untrusted inputs to prevent injection (SQL, command, path, HTML/JS). Enforce least privilege for credentials and APIs.
- Store secrets outside source control; integrate with the project's secret manager or environment configuration.
- Follow secure-by-default headers, CORS rules, and CSRF protections for web surfaces.

## Logging, telemetry, and diagnostics
- Emit structured logs with consistent keys. Keep log levels appropriate; avoid noisy loops or large payloads.
- Correlate requests with trace/span IDs and include dependency outcomes and latency. Capture metrics for throughput, errors, and saturation.
- Provide actionable error details while protecting sensitive information. Prefer centralized error handling over scattered try/catch blocks.

## Testing expectations
- Use AAA/Given-When-Then structure and descriptive test names. Keep tests deterministic, isolated, and fast by default.
- Prefer unit tests for logic, integration tests for wiring/contracts, and end-to-end tests for critical flows. Mock only necessary boundaries.
- Cover edge cases, error paths, and concurrency. For regressions, add a focused test before fixing.
- Ensure tests are parallel-friendly and clean up external resources.

## Documentation & readiness
- Update README/docs when adding features, flags, or behaviors. Include usage examples and operational notes.
- Provide migration/rollback guidance for breaking changes. Note configuration defaults and tunable limits.
- Add inline docs for public surfaces and non-obvious algorithms. Keep comments truthful and current.

## Pull requests & reviewability
- Keep diffs small and coherent. Explain intent, risks, and testing performed. List follow-ups explicitly.
- Ensure formatting/linting/tests pass before requesting review. Avoid generated noise and unrelated refactors.
- Prefer self-contained commits with clear messages. Describe user-visible changes and operational impacts.
