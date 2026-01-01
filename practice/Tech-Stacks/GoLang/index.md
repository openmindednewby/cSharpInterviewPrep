# GoLang - Practice Questions

Practice questions and exercises for Go development, with focus on building services that integrate with C#/.NET systems.

## Theory Questions

### Fundamentals

1. **What is Go, and when would you choose it over C#?**
   - Compiled, statically typed, fast startup
   - Strong standard library (`net/http`, `context`, `encoding/json`)
   - Great fit for small services, CLIs, networking, concurrency-heavy workloads
   - Trade-offs: fewer language features than C#, smaller ecosystem for some domains

2. **Explain packages vs modules (`go.mod`)**
   - Package: unit of compilation and import path
   - Module: versioned set of packages (dependency boundary)
   - `go.mod` defines module path + required versions

3. **What are “zero values” and why do they matter?**
   - Every type has a default value (`0`, `""`, `false`, `nil`)
   - Enables useful defaults but can hide “unset vs set” intent

4. **Arrays vs slices: what’s the difference?**
   - Array has fixed length and value semantics (`[3]int`)
   - Slice is a descriptor over an underlying array (`[]int`) with `len`/`cap`
   - Appends can reallocate; copying slices can share backing storage

5. **Maps: what should you know for interviews?**
   - Iteration order is intentionally randomized
   - Reads of missing keys return zero value
   - Not safe for concurrent writes (use `sync.Map` or locking)

6. **When do you use pointer receivers vs value receivers?**
   - Pointer receiver when mutating, avoiding copies, or method set consistency
   - Value receiver for small immutable types

### Interfaces, Errors, and Concurrency

7. **How do interfaces work in Go (vs C#)?**
   - Structural typing: “implements” is implicit
   - Small interfaces are idiomatic (`io.Reader`)
   - Common pitfall: `var x *T = nil` stored in an interface is not `nil`

8. **How do you handle and classify errors?**
   - Return `error` explicitly (no exceptions for control flow)
   - Wrap with `%w` and use `errors.Is/As`
   - Prefer sentinel errors or typed errors for programmatic checks

9. **Goroutines vs OS threads: what’s the difference?**
   - Goroutines are lightweight and scheduled by the Go runtime
   - Millions of goroutines are possible (within memory limits)
   - Blocking syscalls are handled via runtime integration

10. **Buffered vs unbuffered channels: when do you use each?**
   - Unbuffered: synchronization/hand-off
   - Buffered: decouple producer/consumer up to capacity
   - Too much buffering can hide backpressure problems

11. **What happens when you close a channel?**
   - Receives still work; they yield remaining buffered values, then zero value + `ok=false`
   - Only the sender should close
   - Sending on a closed channel panics

12. **How do you avoid goroutine leaks?**
   - Use `context.Context` for cancellation
   - Ensure goroutines can exit (select on `ctx.Done()`)
   - Don’t block forever on channel send/receive without a way out

13. **How do you prevent races when multiple goroutines share data?**
   - Prefer immutable data or ownership via channels
   - Otherwise use `sync.Mutex` / `sync.RWMutex` / `atomic`
   - Validate with `go test -race`

## Coding Exercises

### Exercise 1: HTTP Client for a C# Web API (Context + Timeouts)

Build a small client library in Go that calls a C# Web API and decodes JSON.

**Requirements:**
- `GetUser(ctx, id)` calls `GET /api/users/{id}`
- Uses a request timeout and respects `ctx` cancellation
- Validates HTTP status codes and returns meaningful errors
- Decodes JSON into a struct

<details>
<summary>Solution Outline</summary>

```go
package users

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"
)

type Client struct {
	baseURL string
	http    *http.Client
}

func NewClient(baseURL string) *Client {
	return &Client{
		baseURL: baseURL,
		http: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

type User struct {
	ID    int    `json:"id"`
	Email string `json:"email"`
}

var ErrNotFound = errors.New("user not found")

func (c *Client) GetUser(ctx context.Context, id int) (User, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, fmt.Sprintf("%s/api/users/%d", c.baseURL, id), nil)
	if err != nil {
		return User{}, err
	}

	resp, err := c.http.Do(req)
	if err != nil {
		return User{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusNotFound {
		return User{}, ErrNotFound
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return User{}, fmt.Errorf("unexpected status: %s", resp.Status)
	}

	var u User
	if err := json.NewDecoder(resp.Body).Decode(&u); err != nil {
		return User{}, err
	}
	return u, nil
}
```

</details>

### Exercise 2: Worker Pool with Cancellation (Fan-Out / Fan-In)

Implement a worker pool that processes jobs concurrently and returns results + errors.

**Requirements:**
- Start `N` workers
- Stop early when `ctx` is cancelled
- Ensure no goroutines leak
- Collect results in input order (optional extension)

<details>
<summary>Solution Outline</summary>

```go
type Job struct {
	ID int
}

type Result struct {
	ID  int
	Out string
}

func RunPool(ctx context.Context, workers int, jobs []Job, do func(context.Context, Job) (Result, error)) ([]Result, error) {
	jobCh := make(chan Job)
	resCh := make(chan Result)
	errCh := make(chan error, 1)

	worker := func() {
		for j := range jobCh {
			r, err := do(ctx, j)
			if err != nil {
				select {
				case errCh <- err:
				default:
				}
				return
			}
			select {
			case resCh <- r:
			case <-ctx.Done():
				return
			}
		}
	}

	for i := 0; i < workers; i++ {
		go worker()
	}

	go func() {
		defer close(jobCh)
		for _, j := range jobs {
			select {
			case jobCh <- j:
			case <-ctx.Done():
				return
			}
		}
	}()

	results := make([]Result, 0, len(jobs))
	for len(results) < len(jobs) {
		select {
		case r := <-resCh:
			results = append(results, r)
		case err := <-errCh:
			return nil, err
		case <-ctx.Done():
			return nil, ctx.Err()
		}
	}
	return results, nil
}
```

</details>

### Exercise 3: HTTP Server with Graceful Shutdown and Middleware

Create a small Go service that exposes endpoints and shuts down cleanly.

**Requirements:**
- `GET /healthz` returns `200 OK`
- `GET /users/{id}` calls a downstream C# API and returns JSON
- Adds a correlation ID header (`X-Correlation-Id`)
- Gracefully shuts down on SIGINT/SIGTERM

## Interview Scenarios

### Scenario 1: A goroutine leak in production

**Question:** Requests occasionally hang and memory keeps increasing. What do you look for?

**Answer:**
- Goroutines blocked on channel send/receive without cancellation path
- `context` not respected downstream (HTTP calls without `NewRequestWithContext`)
- Missing timeouts (`http.Client` without `Timeout`)
- Unbounded buffering (channels, queues) hiding backpressure

### Scenario 2: Integrating Go services with .NET

**Question:** How do you keep contracts stable between a Go service and ASP.NET Core?

**Answer:**
- Prefer OpenAPI for REST (generate clients), version endpoints
- Use idempotency keys and explicit retry semantics
- Share correlation IDs / trace context for observability
- Use message queues for async integration when coupling must be reduced

## Best Practices Questions

1. **How do you structure a Go service repo?**
   - `cmd/<service>` for entrypoints
   - `internal/` for private application code
   - Small packages with clear boundaries

2. **How do you test Go code effectively?**
   - Table-driven tests + subtests
   - Interfaces to mock external dependencies
   - Integration tests for HTTP handlers
   - Benchmarks for hot paths (`go test -bench`)

## Resources

For notes and theory, see [GoLang Notes](../../../notes/Tech-Stacks/GoLang/index.md).
Official docs: https://go.dev/doc/
