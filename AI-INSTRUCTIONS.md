# AI Model Instructions - C# Interview Prep Repository

> Comprehensive guidance for AI assistants working with this C# interview preparation codebase. These instructions cover code development, testing, and documentation creation for a high-performance trading/fintech context.

---

## Part 1: Repository Context & Purpose

### Overview

This repository serves a dual purpose:
1. **Production-quality code examples** demonstrating Clean Architecture with CQRS patterns
2. **Interview preparation materials** for HFM Senior C#/.NET Developer positions

### Target Context
- **Domain**: High-frequency trading and fintech systems (MT4/MT5 platforms)
- **Focus**: Performance, low-latency, resilience, and scalability
- **Interview Level**: Senior developer with emphasis on architecture, distributed systems, and production-grade patterns
- **Time-boxed prep**: 2-hour intensive study sprint covering senior-level C#/.NET knowledge

### Repository Structure

```
cSharpInterviewPrep/
├── .github/
│   └── copilot-instructions.md          # General coding principles
├── notes/                                # Study materials (~40+ markdown files)
│   ├── core-concepts.md                 # Main cheat sheet
│   ├── error-handling.md                # Resilience patterns
│   ├── SOLID/                           # Design principles
│   ├── Design-Patterns/                 # Strategy, Observer, Factory, etc.
│   └── sub-notes/                       # Deep dives (GC, async, reflection)
├── practice/
│   ├── questions.md                     # Interview questions
│   └── answers.md                       # Detailed answers
├── exampleSolutions/
│   └── TrevoirWilliamsCourseCompleted/  # Full Clean Architecture example
│       ├── HR.LeaveManagement.Application/
│       ├── HR.LeaveManagement.Domain/
│       ├── HR.LeaveManagement.Api/
│       └── HR.LeaveManagement.Application.UnitTests/
├── prep-plan.md                         # 2-hour study schedule
└── resources.md                         # External links
```

---

## Part 2: Code Development Standards

### 2.1 Clean Architecture Implementation

Follow strict layer separation with dependencies pointing inward:

```
┌─────────────────────────────────────┐
│     Presentation Layer (API)        │  Controllers, Middleware, DI setup
├─────────────────────────────────────┤
│     Application Layer               │  Use cases, CQRS handlers, DTOs
│     - Features/                     │
│       - [Entity]/                   │
│         - Commands/                 │
│         - Queries/                  │
├─────────────────────────────────────┤
│     Domain Layer                    │  Entities, Value Objects, Aggregates
│     (Zero dependencies)             │
├─────────────────────────────────────┤
│     Infrastructure Layer            │  Repositories, External Services
└─────────────────────────────────────┘
```

**Key Principles:**
- Domain layer has ZERO external dependencies
- Application layer depends only on Domain
- Infrastructure implements Application interfaces
- API layer orchestrates via dependency injection

### 2.2 CQRS with MediatR Patterns

**Command Structure** (mutates state):

```csharp
// Pattern: [Action][Entity]Command.cs
public class CreateLeaveAllocationCommand : IRequest<Unit>
{
    public int LeaveTypeId { get; set; }
}

// Pattern: [Action][Entity]CommandHandler.cs
public class CreateLeaveAllocationCommandHandler : IRequestHandler<CreateLeaveAllocationCommand, Unit>
{
    private readonly IMapper _mapper;
    private readonly ILeaveAllocationRepository _repository;
    private readonly ILeaveTypeRepository _leaveTypeRepository;

    public CreateLeaveAllocationCommandHandler(
        IMapper mapper,
        ILeaveAllocationRepository repository,
        ILeaveTypeRepository leaveTypeRepository)
    {
        _mapper = mapper;
        _repository = repository;
        _leaveTypeRepository = leaveTypeRepository;
    }

    public async Task<Unit> Handle(CreateLeaveAllocationCommand request, CancellationToken cancellationToken)
    {
        // 1. Validate
        var validator = new CreateLeaveAllocationCommandValidator(_leaveTypeRepository);
        var validationResult = await validator.ValidateAsync(request, cancellationToken);

        if (validationResult.Errors.Any())
            throw new BadRequestException("Invalid Request", validationResult);

        // 2. Business logic
        var entity = _mapper.Map<LeaveAllocation>(request);

        // 3. Persist
        await _repository.CreateAsync(entity);

        return Unit.Value;
    }
}
```

**Query Structure** (reads data):

```csharp
// Pattern: Get[Entity][Details/List]Query.cs
public class GetLeaveAllocationDetailQuery : IRequest<LeaveAllocationDetailDto>
{
    public int Id { get; set; }
}

// Handler returns DTOs, never domain entities
public class GetLeaveAllocationDetailQueryHandler
    : IRequestHandler<GetLeaveAllocationDetailQuery, LeaveAllocationDetailDto>
{
    private readonly IMapper _mapper;
    private readonly ILeaveAllocationRepository _repository;

    public async Task<LeaveAllocationDetailDto> Handle(
        GetLeaveAllocationDetailQuery request,
        CancellationToken cancellationToken)
    {
        var allocation = await _repository.GetByIdAsync(request.Id);
        return _mapper.Map<LeaveAllocationDetailDto>(allocation);
    }
}
```

### 2.3 Repository Pattern & Dependency Injection

**Generic Repository Interface:**

```csharp
public interface IGenericRepository<T> where T : BaseEntity
{
    Task<IReadOnlyList<T>> GetAsync();
    Task<T> GetByIdAsync(int id);
    Task CreateAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
}

// Specialized repositories extend generic
public interface ILeaveAllocationRepository : IGenericRepository<LeaveAllocation>
{
    Task<bool> AllocationExists(string employeeId, int leaveTypeId, int period);
    Task AddAllocations(List<LeaveAllocation> allocations);
}
```

**Dependency Injection Pattern:**

```csharp
// Use readonly fields for all injected dependencies
private readonly IMapper _mapper;
private readonly ILeaveAllocationRepository _repository;
private readonly IAppLogger<CreateLeaveAllocationCommandHandler> _logger;

// Constructor injection (never property injection)
public CreateLeaveAllocationCommandHandler(
    IMapper mapper,
    ILeaveAllocationRepository repository,
    IAppLogger<CreateLeaveAllocationCommandHandler> logger)
{
    _mapper = mapper;
    _repository = repository;
    _logger = logger;
}
```

**Service Registration via Extension Methods:**

```csharp
// Pattern: [Layer]ServiceRegistration.cs
public static class ApplicationServiceRegistration
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
        return services;
    }
}

// Usage in Program.cs
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);
```

### 2.4 FluentValidation Standards

**Validator Pattern:**

```csharp
// Pattern: [Command]Validator.cs
public class CreateLeaveAllocationCommandValidator : AbstractValidator<CreateLeaveAllocationCommand>
{
    private readonly ILeaveTypeRepository _leaveTypeRepository;

    public CreateLeaveAllocationCommandValidator(ILeaveTypeRepository leaveTypeRepository)
    {
        _leaveTypeRepository = leaveTypeRepository;

        RuleFor(p => p.LeaveTypeId)
            .GreaterThan(0)
            .WithMessage("{PropertyName} must be greater than 0.")
            .MustAsync(LeaveTypeMustExist)
            .WithMessage("{PropertyName} does not exist.");
    }

    // Async validation for database/external checks
    private async Task<bool> LeaveTypeMustExist(int id, CancellationToken cancellationToken)
    {
        var leaveType = await _leaveTypeRepository.GetByIdAsync(id);
        return leaveType != null;
    }
}
```

**Key Conventions:**
- Use `{PropertyName}` placeholder in error messages
- Support async validation with `MustAsync` for database checks
- Inject repositories for cross-entity validation
- Validate in handler BEFORE business logic

### 2.5 Exception Handling & Middleware

**Custom Exception Types:**

```csharp
public class BadRequestException : Exception
{
    public BadRequestException(string message) : base(message) { }

    public BadRequestException(string message, ValidationResult validationResult) : base(message)
    {
        ValidationErrors = new List<string>();
        foreach (var error in validationResult.Errors)
        {
            ValidationErrors.Add(error.ErrorMessage);
        }
    }

    public List<string> ValidationErrors { get; set; } = new List<string>();
}

public class NotFoundException : Exception
{
    public NotFoundException(string name, object key)
        : base($"{name} ({key}) was not found") { }
}
```

**Global Exception Middleware:**

```csharp
public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext httpContext)
    {
        try
        {
            await _next(httpContext);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(httpContext, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext httpContext, Exception ex)
    {
        HttpStatusCode statusCode = HttpStatusCode.InternalServerError;
        CustomProblemDetails problem = new();

        switch (ex)
        {
            case BadRequestException badRequestException:
                statusCode = HttpStatusCode.BadRequest;
                problem = new CustomProblemDetails
                {
                    Title = badRequestException.Message,
                    Status = (int)statusCode,
                    Detail = badRequestException.InnerException?.Message,
                    Type = nameof(BadRequestException),
                    Errors = badRequestException.ValidationErrors
                };
                break;

            case NotFoundException notFound:
                statusCode = HttpStatusCode.NotFound;
                problem = new CustomProblemDetails
                {
                    Title = notFound.Message,
                    Status = (int)statusCode,
                    Type = nameof(NotFoundException)
                };
                break;

            default:
                problem = new CustomProblemDetails
                {
                    Title = ex.Message,
                    Status = (int)statusCode,
                    Type = nameof(HttpStatusCode.InternalServerError),
                    Detail = ex.StackTrace
                };
                break;
        }

        httpContext.Response.StatusCode = (int)statusCode;
        await httpContext.Response.WriteAsJsonAsync(problem);
    }
}

// Register FIRST in middleware pipeline
app.UseMiddleware<ExceptionMiddleware>();
```

### 2.6 AutoMapper Integration

**Mapping Profile Pattern:**

```csharp
// Pattern: [Entity]Profile.cs
public class LeaveAllocationProfile : Profile
{
    public LeaveAllocationProfile()
    {
        CreateMap<LeaveAllocation, LeaveAllocationDto>().ReverseMap();
        CreateMap<LeaveAllocation, LeaveAllocationDetailDto>();
        CreateMap<CreateLeaveAllocationCommand, LeaveAllocation>();

        // Custom mappings
        CreateMap<LeaveRequest, LeaveRequestDto>()
            .ForMember(dest => dest.DateRequested,
                      opt => opt.MapFrom(src => src.DateRequested.DateTime));
    }
}
```

**Usage in Handlers:**

```csharp
// Map command to entity
var entity = _mapper.Map<LeaveAllocation>(request);

// Map entity to DTO
var dto = _mapper.Map<LeaveAllocationDto>(entity);

// Map list
var dtos = _mapper.Map<List<LeaveAllocationDto>>(entities);
```

---

## Part 3: Testing Standards

### 3.1 Unit Testing with xUnit + Moq + Shouldly

**Test Class Structure:**

```csharp
public class CreateLeaveTypeCommandTests
{
    private readonly IMapper _mapper;
    private Mock<ILeaveTypeRepository> _mockRepo;

    // Constructor sets up dependencies
    public CreateLeaveTypeCommandTests()
    {
        // Setup mock repository with seed data
        _mockRepo = MockLeaveTypeRepository.GetMockLeaveTypeRepository();

        // Setup AutoMapper configuration
        var mapperConfig = new MapperConfiguration(c =>
        {
            c.AddProfile<LeaveTypeProfile>();
        });
        _mapper = mapperConfig.CreateMapper();
    }

    [Fact]
    public async Task Handle_ValidLeaveType_CreatesSuccessfully()
    {
        // Arrange
        var handler = new CreateLeaveTypeCommandHandler(_mapper, _mockRepo.Object);
        var command = new CreateLeaveTypeCommand
        {
            Name = "Test1",
            DefaultDays = 1
        };

        // Act
        await handler.Handle(command, CancellationToken.None);

        // Assert
        var leaveTypes = await _mockRepo.Object.GetAsync();
        leaveTypes.Count.ShouldBe(4);
    }

    [Fact]
    public async Task Handle_InvalidLeaveType_ThrowsBadRequestException()
    {
        // Arrange
        var handler = new CreateLeaveTypeCommandHandler(_mapper, _mockRepo.Object);
        var command = new CreateLeaveTypeCommand
        {
            Name = "", // Invalid
            DefaultDays = -1
        };

        // Act & Assert
        await Should.ThrowAsync<BadRequestException>(async () =>
            await handler.Handle(command, CancellationToken.None));
    }
}
```

### 3.2 Mock Repository Pattern

**Mock Repository Helper:**

```csharp
public class MockLeaveTypeRepository
{
    public static Mock<ILeaveTypeRepository> GetMockLeaveTypeRepository()
    {
        var leaveTypes = new List<LeaveType>
        {
            new LeaveType { Id = 1, Name = "Vacation", DefaultDays = 10 },
            new LeaveType { Id = 2, Name = "Sick", DefaultDays = 12 },
            new LeaveType { Id = 3, Name = "Personal", DefaultDays = 5 }
        };

        var mockRepo = new Mock<ILeaveTypeRepository>();

        mockRepo.Setup(r => r.GetAsync())
            .ReturnsAsync(leaveTypes);

        mockRepo.Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync((int id) => leaveTypes.FirstOrDefault(q => q.Id == id));

        mockRepo.Setup(r => r.CreateAsync(It.IsAny<LeaveType>()))
            .ReturnsAsync((LeaveType leaveType) =>
            {
                leaveTypes.Add(leaveType);
                return leaveType;
            });

        return mockRepo;
    }
}
```

### 3.3 AAA Structure (Arrange-Act-Assert)

**Conventions:**
- Clearly separate three sections with blank lines
- Use `// Arrange`, `// Act`, `// Assert` comments for clarity
- Keep each test focused on a single scenario
- Use descriptive test method names: `[Method]_[Scenario]_[ExpectedResult]`

**Examples:**
- `Handle_ValidLeaveType_CreatesSuccessfully`
- `Handle_InvalidLeaveType_ThrowsBadRequestException`
- `Handle_DuplicateLeaveType_ThrowsBadRequestException`

**Assertion Best Practices:**
- Use Shouldly for fluent assertions: `result.ShouldNotBeNull()`
- Verify mock calls: `_mockRepo.Verify(r => r.CreateAsync(It.IsAny<LeaveType>()), Times.Once)`
- Always pass `CancellationToken.None` in tests

---

## Part 4: Documentation & Content Creation

### 4.1 Study Note Formatting

**Standard Structure:**

```markdown
# [Concept] — [Context/Why It Matters]

> One-sentence principle or key takeaway

---

## Quick Overview
- Bullet points summarizing the concept
- Why senior developers need to know this
- How it applies to trading/fintech systems

## Detailed Explanation

[In-depth content with subsections]

### Code Example

```csharp
// Complete, runnable example with domain context
public class TradingExample
{
    // Implementation
}
```

## Why It Matters for Interviews
- Performance implications
- Scalability considerations
- Common questions and talking points

## Common Pitfalls
- What to avoid
- How to fix

## Quick Reference
- Actionable checklist bullets

---

## Sample Interview Q&A
- **Q:** When do you choose X over Y?
  - **A:** [Structured, senior-level answer with trade-offs]
```

**Reference Example:** See [error-handling.md](notes/error-handling.md) and [core-concepts.md](notes/core-concepts.md)

### 4.2 Visual Diagrams & ASCII Art

**Architecture Diagrams:**

```
┌───────────────────────────────┐
│       Presentation Layer      │ → Controllers, APIs, UI
├───────────────────────────────┤
│     Application Layer         │ → Use cases, CQRS handlers
├───────────────────────────────┤
│       Domain Layer            │ → Entities, Value Objects
├───────────────────────────────┤
│    Infrastructure Layer       │ → Repositories, External APIs
└───────────────────────────────┘
```

**Flow Diagrams:**

```
Request → Middleware → Controller → MediatR → Handler → Validator
                                                  ↓
                                            Repository → Database
```

**Memory/GC Diagrams:**

```
Gen0 ──► Gen1 ──► Gen2 ──► LOH
 small    medium   long     massive arrays/strings
```

### 4.3 Interview Q&A Sections

**Pattern:**

```markdown
## Sample Interview Q&A

- **Q:** When do you choose exceptions vs. result types?
  - **A:** Use exceptions for unexpected, rare failures (null reference, protocol violation). Use `Result`/`OneOf` for expected domain outcomes (validation errors, not found) to avoid control-flow via exceptions and keep the hot path allocation-free.

- **Q:** How do you keep retries from hurting availability?
  - **A:** Enforce timeouts, cap retry counts, add jitter to prevent thundering herds, and combine retries with circuit breakers and load shedding.
```

**Include:**
- Behavioral questions with STAR framework
- Technical deep dives
- Architecture trade-off questions
- Domain-specific scenarios (trading, order execution, price feeds)

### 4.4 Time-Boxing & Checklists

**Time Markers:**

```markdown
### Phase 1 – Setup (5 minutes)
⏱️ **Total time required:** 5 minutes

- ✅ Print or open this file
- ✅ Set a timer for each phase
- ✅ Keep notes ready
```

**Actionable Checklists:**

```markdown
## Pre-Interview Checklist (15 minutes)

- ☐ Review SOLID principles with examples
- ☐ Practice explaining Clean Architecture layers
- ☐ Rehearse CQRS command/query flow
- ☐ Prepare behavioral STAR stories
- ☐ Review trading domain vocabulary
```

---

## Part 5: Coding Conventions & Examples

### 5.1 Naming Conventions

**Files & Classes:**
- Commands: `Create[Entity]Command.cs`, `Update[Entity]Command.cs`, `Delete[Entity]Command.cs`
- Queries: `Get[Entity]Query.cs`, `Get[Entity]DetailsQuery.cs`, `Get[Entity]ListQuery.cs`
- Handlers: `[CommandOrQuery]Handler.cs`
- Validators: `[Command]Validator.cs` or `[Dto]Validator.cs`
- DTOs: `[Entity]Dto.cs`, `[Entity]DetailDto.cs`, `[Entity]ListDto.cs`
- Profiles: `[Entity]Profile.cs`
- Exceptions: `[ExceptionType]Exception.cs` (BadRequestException, NotFoundException)
- Tests: `[Handler]Tests.cs`

**Methods:**
- PascalCase: `CreateAsync()`, `GetByIdAsync()`, `IsLeaveTypeUnique()`
- Handler method: Always `Handle(TRequest request, CancellationToken cancellationToken)`
- Test methods: `[Method]_[Scenario]_[ExpectedResult]`

**Fields & Properties:**
- Private readonly fields: `_mapper`, `_repository`, `_logger` (camelCase with underscore)
- Public properties: PascalCase with auto-properties
- Default values: `= string.Empty` for strings, `= new List<T>()` for collections

**Interfaces:**
- PascalCase with `I` prefix: `ILeaveTypeRepository`, `IMediator`, `IMapper`

### 5.2 File Organization

```
Application/
├── Contracts/
│   ├── Persistence/
│   │   ├── IGenericRepository.cs
│   │   └── ILeaveTypeRepository.cs
│   ├── Identity/
│   ├── Email/
│   └── Logging/
├── Features/
│   └── LeaveType/
│       ├── Commands/
│       │   └── CreateLeaveType/
│       │       ├── CreateLeaveTypeCommand.cs
│       │       ├── CreateLeaveTypeCommandHandler.cs
│       │       └── CreateLeaveTypeCommandValidator.cs
│       └── Queries/
│           └── GetAllLeaveTypes/
│               ├── GetAllLeaveTypesQuery.cs
│               ├── GetAllLeaveTypesQueryHandler.cs
│               └── LeaveTypeDto.cs
├── DTOs/
├── Exceptions/
│   ├── BadRequestException.cs
│   └── NotFoundException.cs
├── MappingProfiles/
│   └── LeaveTypeProfile.cs
└── ApplicationServiceRegistration.cs
```

### 5.3 Complete Code Examples

**Full CQRS Command Flow:**

```csharp
// 1. Command
public class CreateLeaveAllocationCommand : IRequest<Unit>
{
    public int LeaveTypeId { get; set; }
}

// 2. Validator
public class CreateLeaveAllocationCommandValidator : AbstractValidator<CreateLeaveAllocationCommand>
{
    private readonly ILeaveTypeRepository _leaveTypeRepository;

    public CreateLeaveAllocationCommandValidator(ILeaveTypeRepository leaveTypeRepository)
    {
        _leaveTypeRepository = leaveTypeRepository;

        RuleFor(p => p.LeaveTypeId)
            .GreaterThan(0)
            .MustAsync(LeaveTypeMustExist)
            .WithMessage("{PropertyName} does not exist.");
    }

    private async Task<bool> LeaveTypeMustExist(int id, CancellationToken ct)
    {
        var leaveType = await _leaveTypeRepository.GetByIdAsync(id);
        return leaveType != null;
    }
}

// 3. Handler
public class CreateLeaveAllocationCommandHandler : IRequestHandler<CreateLeaveAllocationCommand, Unit>
{
    private readonly IMapper _mapper;
    private readonly ILeaveAllocationRepository _leaveAllocationRepository;
    private readonly ILeaveTypeRepository _leaveTypeRepository;
    private readonly IUserService _userService;

    public CreateLeaveAllocationCommandHandler(
        IMapper mapper,
        ILeaveAllocationRepository leaveAllocationRepository,
        ILeaveTypeRepository leaveTypeRepository,
        IUserService userService)
    {
        _mapper = mapper;
        _leaveAllocationRepository = leaveAllocationRepository;
        _leaveTypeRepository = leaveTypeRepository;
        _userService = userService;
    }

    public async Task<Unit> Handle(CreateLeaveAllocationCommand request, CancellationToken cancellationToken)
    {
        var validator = new CreateLeaveAllocationCommandValidator(_leaveTypeRepository);
        var validationResult = await validator.ValidateAsync(request, cancellationToken);

        if (validationResult.Errors.Any())
            throw new BadRequestException("Invalid Leave Allocation Request", validationResult);

        // Get Leave type for allocations
        var leaveType = await _leaveTypeRepository.GetByIdAsync(request.LeaveTypeId);

        // Get Employees
        var employees = await _userService.GetEmployees();

        // Get Period
        var period = DateTime.Now.Year;

        // Assign Allocations IF an allocation doesn't already exist for period and leave type
        var allocations = new List<LeaveAllocation>();
        foreach (var emp in employees)
        {
            var allocationExists = await _leaveAllocationRepository.AllocationExists(
                emp.Id, request.LeaveTypeId, period);

            if (allocationExists == false)
            {
                allocations.Add(new LeaveAllocation
                {
                    EmployeeId = emp.Id,
                    LeaveTypeId = leaveType.Id,
                    NumberOfDays = leaveType.DefaultDays,
                    Period = period,
                });
            }
        }

        if (allocations.Any())
        {
            await _leaveAllocationRepository.AddAllocations(allocations);
        }

        return Unit.Value;
    }
}

// 4. Controller
[Route("api/[controller]")]
[ApiController]
[Authorize]
public class LeaveAllocationsController : ControllerBase
{
    private readonly IMediator _mediator;

    public LeaveAllocationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> Post(CreateLeaveAllocationCommand command)
    {
        var response = await _mediator.Send(command);
        return Ok(response);
    }
}
```

---

## Part 6: General Best Practices

### 6.1 Design Principles (from existing copilot-instructions.md)

**General Principles:**
- Default to minimal, composable designs with clear separation of concerns
- Prefer pure functions and small objects with single responsibilities
- Optimize for clarity: explicit names, predictable control flow
- Keep solutions framework-agnostic unless required
- Prefer immutability and explicit data flows

**Coding Standards:**
- Match existing style and conventions in the repo
- Write defensive APIs: validate inputs early, use guard clauses
- Fail fast on programmer errors; use structured errors for expected outcomes
- Avoid premature abstraction; extract shared pieces only after clear duplication

### 6.2 Performance & Reliability

**Async/Await:**
- Prefer async/non-blocking I/O for all database and HTTP operations
- Always pass `CancellationToken` through the call stack
- Use `ConfigureAwait(false)` in libraries to avoid context capture
- Never block on async code with `.Result` or `.Wait()`

**Resilience Patterns:**
- Wrap external calls with Polly policies (timeout, retry, circuit breaker)
- Add jitter to retries to prevent thundering herds
- Design operations to be idempotent for retry safety
- Honor cancellation tokens, especially for external calls

**Memory Management:**
- Avoid allocations in hot paths (use `Span<T>`, `Memory<T>`, `ArrayPool<T>`)
- Reuse buffers/objects when safe
- Choose algorithms for big-O impact first; measure before micro-optimizing

### 6.3 Security & Privacy

**Never:**
- Log secrets, tokens, or PII
- Store secrets in source control

**Always:**
- Validate and encode all untrusted inputs (SQL injection, XSS, command injection)
- Use secure defaults for crypto, TLS, random number generation
- Enforce least privilege for credentials and APIs
- Follow secure-by-default headers, CORS rules, CSRF protections

### 6.4 Logging, Telemetry, and Diagnostics

**Structured Logging:**
- Emit structured logs with consistent keys
- Use appropriate log levels (Debug, Info, Warning, Error)
- Correlate requests with trace/span IDs
- Include dependency outcomes and latency

**Example:**

```csharp
_logger.LogInformation(
    "Leave allocation created for employee {EmployeeId} with {Days} days",
    allocation.EmployeeId,
    allocation.NumberOfDays);
```

### 6.5 Testing Expectations

**Test Structure:**
- Use AAA (Arrange-Act-Assert) or Given-When-Then structure
- Keep tests deterministic, isolated, and fast
- Prefer unit tests for logic, integration tests for wiring
- Cover edge cases, error paths, and validation scenarios
- Mock only necessary boundaries (repositories, external services)

### 6.6 Documentation & Pull Requests

**Documentation:**
- Update README/docs when adding features or behaviors
- Include usage examples and operational notes
- Add inline docs for public surfaces and non-obvious algorithms

**Pull Requests:**
- Keep diffs small and coherent
- Explain intent, risks, and testing performed
- Ensure formatting/linting/tests pass before review
- Use clear commit messages describing user-visible changes

---

## Part 7: Domain-Specific Context

### 7.1 Trading & Fintech Terminology

Use these terms when creating examples or documentation:

**Trading Concepts:**
- Orders, trades, executions, positions
- Symbols, instruments, tickers
- Price feeds, market data, tick data
- Order book, liquidity, spreads
- Long/short positions, margin, leverage

**MT4/MT5 Context:**
- MetaTrader platforms for forex/CFD trading
- Bridge services for API integration
- Session state management
- Asynchronous event processing

**Performance Context:**
- Low-latency data processing
- High-throughput systems
- Real-time price streaming
- Order execution speed
- Risk management and exposure tracking

### 7.2 Resilience in Trading Systems

**Critical Requirements:**
- Idempotent operations (duplicate orders prevention)
- Circuit breakers for failing dependencies
- Graceful degradation (serve cached prices when feed fails)
- Fast-path success (minimize allocations in price processing)
- Correlation IDs for distributed tracing
- Structured error responses with retry hints

**Example Scenario:**

```csharp
public class PriceStreamHandler
{
    private readonly IMediator _mediator;
    private readonly ILogger<PriceStreamHandler> _logger;

    public async Task HandlePriceTickAsync(PriceTick tick, CancellationToken ct)
    {
        using var activity = Activity.Current?.Source.StartActivity("ProcessPriceTick");
        activity?.SetTag("symbol", tick.Symbol);

        try
        {
            var command = new UpdatePriceCommand
            {
                Symbol = tick.Symbol,
                Bid = tick.Bid,
                Ask = tick.Ask,
                Timestamp = tick.Timestamp
            };

            await _mediator.Send(command, ct);

            _logger.LogInformation(
                "Price tick processed for {Symbol}: Bid={Bid}, Ask={Ask}",
                tick.Symbol, tick.Bid, tick.Ask);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Failed to process price tick for {Symbol}", tick.Symbol);
            throw;
        }
    }
}
```

---

## Quick Reference Checklist

When generating code or documentation for this repository:

### Code Generation:
- ☐ Identify Clean Architecture layer (Domain, Application, Infrastructure, API)
- ☐ Determine if CQRS Command or Query
- ☐ Create Command/Query, Handler, and Validator as a set
- ☐ Follow naming conventions strictly
- ☐ Add FluentValidation for all inputs
- ☐ Use constructor injection with readonly fields
- ☐ Include async/await with CancellationToken
- ☐ Add AutoMapper mappings for DTOs
- ☐ Handle exceptions via custom types caught in middleware
- ☐ Write unit tests with AAA pattern using xUnit + Moq + Shouldly

### Documentation Generation:
- ☐ Use markdown structure with title and blockquote summary
- ☐ Include ASCII art diagrams for architecture concepts
- ☐ Provide complete C# code examples with domain context
- ☐ Add "Why it matters" and "Interview talking points" sections
- ☐ Cross-reference related topics
- ☐ Keep content time-boxed and scannable
- ☐ Include checkmarks for actionable items
- ☐ Add Sample Interview Q&A section

### Interview Prep Content:
- ☐ Organize by topic/difficulty
- ☐ Include both coding and architectural questions
- ☐ Add domain-specific scenarios (trading, fintech, MT4/MT5)
- ☐ Provide STAR-format for behavioral questions
- ☐ Include time estimates for completion
- ☐ Add practical examples with real-world context

---

## Example Prompts for AI Assistants

**For Code Generation:**
> "Create a CQRS command to cancel a trade order in a trading system. Include the command, handler with validation, validator using FluentValidation, and corresponding unit tests."

**For Documentation:**
> "Create a study note explaining the Circuit Breaker pattern in the context of high-frequency trading systems. Include code examples, ASCII diagrams, interview talking points, and a sample Q&A section."

**For Testing:**
> "Write unit tests for the CreateLeaveAllocationCommandHandler using xUnit, Moq, and Shouldly. Cover success case, validation failure, and duplicate allocation scenarios."

---

## Conclusion

These instructions provide comprehensive guidance for AI assistants working with this C# interview prep repository. Follow the patterns, conventions, and examples provided to maintain consistency and quality across all code and documentation contributions.

For questions or clarifications, refer to:
- [.github/copilot-instructions.md](.github/copilot-instructions.md) - General principles
- [notes/error-handling.md](notes/error-handling.md) - Resilience patterns
- [notes/core-concepts.md](notes/core-concepts.md) - Study note examples
- Example solutions in `exampleSolutions/TrevoirWilliamsCourseCompleted/`
