# GoLang (Go)

Go is a statically typed, compiled programming language designed at Google. It's known for its simplicity, efficiency, and excellent support for concurrent programming.

## Core Concepts

### Basic Features
- **Statically Typed**: Type checking at compile time
- **Compiled**: Compiles to native machine code
- **Garbage Collected**: Automatic memory management
- **Fast Compilation**: Quick build times
- **Built-in Concurrency**: Goroutines and channels

### Package System
- Code is organized into packages
- `main` package is the entry point
- Import packages with `import` statement
- Exported names start with capital letters

### Types
```go
// Basic types
int, int8, int16, int32, int64
uint, uint8, uint16, uint32, uint64
float32, float64
string
bool
byte (alias for uint8)
rune (alias for int32, represents Unicode code point)

// Composite types
array, slice, map, struct, pointer, function, interface, channel
```

## Key Features

### Goroutines
Lightweight threads managed by Go runtime:

```go
go functionName()  // Run function concurrently

func main() {
    go sayHello()
    time.Sleep(time.Second)
}

func sayHello() {
    fmt.Println("Hello from goroutine")
}
```

### Channels
Communication between goroutines:

```go
ch := make(chan int)

// Send to channel
ch <- value

// Receive from channel
value := <-ch

// Buffered channel
ch := make(chan int, 100)
```

### Interfaces
Define behavior, not implementation:

```go
type Reader interface {
    Read(p []byte) (n int, err error)
}

// Any type that implements Read is a Reader
```

### Defer, Panic, Recover
Error handling mechanisms:

```go
// Defer: Execute after surrounding function returns
defer file.Close()

// Panic: Stop execution, run deferred functions
panic("something went wrong")

// Recover: Regain control after panic (in deferred function)
defer func() {
    if r := recover(); r != nil {
        fmt.Println("Recovered:", r)
    }
}()
```

## Common Patterns

### Error Handling
Go uses explicit error returns instead of exceptions:

```go
func doSomething() (result int, err error) {
    if somethingWrong {
        return 0, errors.New("error message")
    }
    return result, nil
}

// Usage
result, err := doSomething()
if err != nil {
    // Handle error
    return err
}
// Use result
```

### Struct Embedding
Composition over inheritance:

```go
type Person struct {
    Name string
    Age  int
}

type Employee struct {
    Person  // Embedded struct
    EmployeeID string
}
```

### Method Receivers
Methods on types:

```go
// Value receiver
func (p Person) GetName() string {
    return p.Name
}

// Pointer receiver (can modify receiver)
func (p *Person) SetName(name string) {
    p.Name = name
}
```

## Concurrency Patterns

### Worker Pool
```go
jobs := make(chan int, 100)
results := make(chan int, 100)

// Start workers
for w := 1; w <= 3; w++ {
    go worker(w, jobs, results)
}

// Send jobs
for j := 1; j <= 5; j++ {
    jobs <- j
}
close(jobs)
```

### Select Statement
Choose from multiple channel operations:

```go
select {
case msg1 := <-ch1:
    fmt.Println("Received", msg1)
case msg2 := <-ch2:
    fmt.Println("Received", msg2)
case <-time.After(1 * time.Second):
    fmt.Println("Timeout")
}
```

## Integration with C# Services

### REST API Client
```go
import (
    "encoding/json"
    "net/http"
)

resp, err := http.Get("https://api.example.com/data")
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()

var data MyStruct
json.NewDecoder(resp.Body).Decode(&data)
```

### gRPC Communication
Efficient RPC framework for microservices:

```go
import (
    "google.golang.org/grpc"
    pb "path/to/protobuf"
)

conn, err := grpc.Dial("localhost:50051", grpc.WithInsecure())
defer conn.Close()

client := pb.NewMyServiceClient(conn)
response, err := client.MyMethod(context.Background(), request)
```

## Interview Topics

### Common Questions
1. What are goroutines and how do they differ from threads?
2. Explain channels and their types (buffered vs unbuffered)
3. What is the difference between a value receiver and pointer receiver?
4. How does Go handle errors?
5. What is an interface in Go and how is it different from other languages?
6. Explain defer, panic, and recover
7. What is the difference between arrays and slices?
8. How does Go's garbage collector work?
9. What are some concurrency patterns in Go?
10. Explain the `select` statement

### Performance Considerations
- **Goroutines are cheap**: Can create millions
- **Channel operations**: Some overhead, use wisely
- **Memory allocation**: Prefer stack over heap
- **Profiling**: Use pprof for performance analysis
- **Escape analysis**: Compiler optimization

## Best Practices

1. **Effective Go**: Follow official style guide
2. **Error Handling**: Always check errors, don't ignore
3. **Use `go fmt`**: Format code consistently
4. **Avoid Goroutine Leaks**: Always ensure goroutines can exit
5. **Use Context**: For cancellation and timeouts
6. **Pointer vs Value**: Use pointers for large structs or when mutation needed
7. **Interfaces**: Keep them small and focused
8. **Testing**: Write table-driven tests

## Common Packages

### Standard Library
- `net/http`: HTTP client and server
- `encoding/json`: JSON encoding/decoding
- `database/sql`: Database interface
- `context`: Cancellation and timeouts
- `sync`: Synchronization primitives
- `io`: I/O operations
- `fmt`: Formatted I/O
- `log`: Logging

### Popular Third-Party
- **Gin/Echo**: Web frameworks
- **GORM**: ORM library
- **go-redis**: Redis client
- **testify**: Testing toolkit
- **zap/logrus**: Structured logging

## Comparison with C#

| Feature | Go | C# |
|---------|----|----|
| Concurrency | Goroutines, channels | async/await, Tasks |
| Type System | Structural typing | Nominal typing |
| Inheritance | Composition via embedding | Class inheritance |
| Error Handling | Multiple return values | Exceptions |
| Generics | Yes (since Go 1.18) | Yes |
| Memory Management | Garbage collected | Garbage collected |
| Performance | Very fast, compiled | Fast, JIT compiled |

## Resources

- [Official Go Documentation](https://go.dev/doc/)
- [Effective Go](https://go.dev/doc/effective_go)
- [Go by Example](https://gobyexample.com/)
- [Go Concurrency Patterns](https://go.dev/blog/pipelines)

## Related Topics

- [Microservices Architecture](../../system-architecture.md)
- [gRPC](../gRPC/index.md)
- [Message Queues](../../sub-notes/RabbitMQ.md)
