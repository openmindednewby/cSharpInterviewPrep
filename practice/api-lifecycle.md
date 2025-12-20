# API & Lifecycle Practice Exercises

Master ASP.NET Core middleware pipeline, dependency injection, API design, and request lifecycle management.

---

## Foundational Questions

**Q: Describe the ASP.NET Core middleware pipeline for a request hitting an authenticated endpoint with custom exception handling.**

A: Typical order: `UseRouting` → auth middleware → custom exception handling (usually early) → `UseAuthentication`/`UseAuthorization` → endpoint execution. Static file middleware, response compression, and caching can be interleaved before routing. Include correlation logging, caching, validation, and telemetry instrumentation.

```csharp
app.UseMiddleware<CorrelationMiddleware>();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
```

Use when building consistent request handling. Avoid when for minimal APIs you might use delegate pipeline but still similar.

**Q: How do you implement API versioning and backward compatibility?**

A: Strategies: URL segment (`/v1/`), header, query string. Use `Asp.Versioning` package.

```csharp
services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
});
services.AddVersionedApiExplorer();
```

Use when breaking changes; maintain backward compatibility by keeping old controllers. Avoid when internal services with clients you control; choose contract-first to avoid version explosion.

**Q: Discuss strategies for rate limiting and request throttling.**

A: Use ASP.NET rate limiting middleware or gateway. Techniques: token bucket, fixed window, sliding window.

```csharp
services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("per-account", opt =>
    {
        opt.Window = TimeSpan.FromMinutes(1);
        opt.PermitLimit = 60;
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 20;
    });
});

app.UseRateLimiter();
```

Use when protecting downstream resources. Avoid when latency-critical internal traffic; consider other forms of protection.

**Q: How would you log correlation IDs across services and propagate them to downstream dependencies?**

A: Generate ID in middleware, add to headers/log context, forward via `HttpClient`. Ensure asynchronous logging frameworks flow the correlation ID across threads (e.g., using `AsyncLocal`).

```csharp
context.TraceIdentifier = context.TraceIdentifier ?? Guid.NewGuid().ToString();
_logger.LogInformation("{CorrelationId} handling {Path}", context.TraceIdentifier, context.Request.Path);
httpClient.DefaultRequestHeaders.Add("X-Correlation-ID", context.TraceIdentifier);
```

Use when need distributed tracing. Avoid when truly isolated services—rare.

**Q: Explain the difference between Transient, Scoped, and Singleton dependency injection lifetimes.**

A: Quick summary (Microsoft.Extensions.DependencyInjection semantics):
- `Transient`: a new instance is created every time the service is requested.
- `Scoped`: a single instance is created per scope (in ASP.NET Core a scope is typically a single HTTP request).
- `Singleton`: a single instance is created for the application's lifetime (or until the container is disposed).

```csharp
services.AddTransient<IRepo, Repo>();   // new Repo each injection
services.AddScoped<IRepo, Repo>();      // one Repo per request/scope
services.AddSingleton<IRepo, Repo>();   // single Repo for the app lifetime
```

Important tips:
- Use `Scoped` for per-request services that hold state tied to the request (e.g., `DbContext`).
- Use `Singleton` for stateless, thread-safe services (caches, configuration providers). Be careful with mutable singletons.
- Avoid injecting a `Scoped` service into a `Singleton` - the scoped service may be captured incorrectly leading to unintended shared state or runtime errors.
- `Transient` is good for lightweight, stateless services; it can be used when you explicitly want fresh instances.

---

## Intermediate Exercises

**Q: Create custom middleware that validates API keys from request headers.**

A: Implement middleware with authentication logic.

```csharp
public class ApiKeyMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;

    public ApiKeyMiddleware(RequestDelegate next, IConfiguration configuration)
    {
        _next = next;
        _configuration = configuration;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (!context.Request.Headers.TryGetValue("X-Api-Key", out var extractedApiKey))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("API Key missing");
            return;
        }

        var apiKey = _configuration.GetValue<string>("ApiKey");
        if (!apiKey.Equals(extractedApiKey))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Invalid API Key");
            return;
        }

        await _next(context);
    }
}

// Register middleware
app.UseMiddleware<ApiKeyMiddleware>();
```

**Q: Implement global exception handling middleware that returns consistent error responses.**

A: Create middleware that catches exceptions and formats responses.

```csharp
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Validation error occurred");
            await HandleExceptionAsync(context, ex, StatusCodes.Status400BadRequest);
        }
        catch (NotFoundException ex)
        {
            _logger.LogWarning(ex, "Resource not found");
            await HandleExceptionAsync(context, ex, StatusCodes.Status404NotFound);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred");
            await HandleExceptionAsync(context, ex, StatusCodes.Status500InternalServerError);
        }
    }

    private static async Task HandleExceptionAsync(
        HttpContext context,
        Exception exception,
        int statusCode)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;

        var response = new ErrorResponse
        {
            StatusCode = statusCode,
            Message = exception.Message,
            TraceId = context.TraceIdentifier
        };

        await context.Response.WriteAsJsonAsync(response);
    }
}

public record ErrorResponse
{
    public int StatusCode { get; init; }
    public string Message { get; init; }
    public string TraceId { get; init; }
}
```

**Q: Design a health check endpoint that verifies database connectivity, external API availability, and cache status.**

A: Use ASP.NET Core health checks with custom checks.

```csharp
// Custom health check
public class DatabaseHealthCheck : IHealthCheck
{
    private readonly DbContext _dbContext;

    public DatabaseHealthCheck(DbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            await _dbContext.Database.CanConnectAsync(cancellationToken);
            return HealthCheckResult.Healthy("Database is reachable");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Database is unreachable", ex);
        }
    }
}

// Startup configuration
builder.Services.AddHealthChecks()
    .AddCheck<DatabaseHealthCheck>("database")
    .AddUrlGroup(new Uri("https://api.example.com/health"), "external-api")
    .AddRedis(connectionString, "cache");

app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        var result = JsonSerializer.Serialize(new
        {
            status = report.Status.ToString(),
            checks = report.Entries.Select(e => new
            {
                name = e.Key,
                status = e.Value.Status.ToString(),
                description = e.Value.Description,
                duration = e.Value.Duration.TotalMilliseconds
            }),
            totalDuration = report.TotalDuration.TotalMilliseconds
        });
        await context.Response.WriteAsync(result);
    }
});
```

**Q: Implement request/response logging middleware with performance tracking.**

A: Create middleware that logs request details and timing.

```csharp
public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(
        RequestDelegate next,
        ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var sw = Stopwatch.StartNew();
        var correlationId = context.TraceIdentifier;

        // Log request
        _logger.LogInformation(
            "[{CorrelationId}] Request {Method} {Path} started",
            correlationId,
            context.Request.Method,
            context.Request.Path);

        // Capture response body
        var originalBodyStream = context.Response.Body;
        using var responseBody = new MemoryStream();
        context.Response.Body = responseBody;

        try
        {
            await _next(context);

            sw.Stop();

            // Log response
            _logger.LogInformation(
                "[{CorrelationId}] Request {Method} {Path} completed with {StatusCode} in {ElapsedMs}ms",
                correlationId,
                context.Request.Method,
                context.Request.Path,
                context.Response.StatusCode,
                sw.ElapsedMilliseconds);
        }
        catch (Exception ex)
        {
            sw.Stop();
            _logger.LogError(
                ex,
                "[{CorrelationId}] Request {Method} {Path} failed after {ElapsedMs}ms",
                correlationId,
                context.Request.Method,
                context.Request.Path,
                sw.ElapsedMilliseconds);
            throw;
        }
        finally
        {
            responseBody.Seek(0, SeekOrigin.Begin);
            await responseBody.CopyToAsync(originalBodyStream);
        }
    }
}
```

**Q: Create a minimal API health endpoint with dependency injection.**

A: Expose a `/health` endpoint in a minimal API that reports `200` when a price feed is connected, otherwise `503`.

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<IPriceFeed, PriceFeed>();
var app = builder.Build();

app.MapGet("/health", (IPriceFeed feed) => feed.IsConnected
    ? Results.Ok(new { status = "ok" })
    : Results.StatusCode(StatusCodes.Status503ServiceUnavailable));

await app.RunAsync();
```

Notes: Mapping the health check keeps the app's composition root small. Consider adding `UseHealthChecks` or custom readiness/liveness probes for Kubernetes deployments.

---

## Advanced Exercises

**Q: Implement middleware that enforces request size limits and prevents large payload attacks.**

A: Create middleware with request body size validation.

```csharp
public class RequestSizeLimitMiddleware
{
    private readonly RequestDelegate _next;
    private readonly long _maxRequestBodySize;

    public RequestSizeLimitMiddleware(RequestDelegate next, long maxRequestBodySize)
    {
        _next = next;
        _maxRequestBodySize = maxRequestBodySize;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.ContentLength.HasValue &&
            context.Request.ContentLength.Value > _maxRequestBodySize)
        {
            context.Response.StatusCode = StatusCodes.Status413PayloadTooLarge;
            await context.Response.WriteAsync(
                $"Request body too large. Maximum size: {_maxRequestBodySize} bytes");
            return;
        }

        // Wrap the request body stream
        var originalBody = context.Request.Body;
        try
        {
            using var limitedStream = new LimitedStream(originalBody, _maxRequestBodySize);
            context.Request.Body = limitedStream;
            await _next(context);
        }
        catch (InvalidOperationException) when (context.Response.StatusCode == 413)
        {
            // Stream limit exceeded during reading
            return;
        }
        finally
        {
            context.Request.Body = originalBody;
        }
    }
}

public class LimitedStream : Stream
{
    private readonly Stream _innerStream;
    private readonly long _maxLength;
    private long _totalBytesRead;

    public LimitedStream(Stream innerStream, long maxLength)
    {
        _innerStream = innerStream;
        _maxLength = maxLength;
    }

    public override async Task<int> ReadAsync(
        byte[] buffer,
        int offset,
        int count,
        CancellationToken cancellationToken)
    {
        var bytesRead = await _innerStream.ReadAsync(buffer, offset, count, cancellationToken);
        _totalBytesRead += bytesRead;

        if (_totalBytesRead > _maxLength)
        {
            throw new InvalidOperationException("Request body size limit exceeded");
        }

        return bytesRead;
    }

    // Implement other required Stream members...
    public override bool CanRead => _innerStream.CanRead;
    public override bool CanSeek => false;
    public override bool CanWrite => false;
    public override long Length => throw new NotSupportedException();
    public override long Position
    {
        get => throw new NotSupportedException();
        set => throw new NotSupportedException();
    }
    public override void Flush() { }
    public override int Read(byte[] buffer, int offset, int count) =>
        throw new NotSupportedException("Use ReadAsync");
    public override long Seek(long offset, SeekOrigin origin) =>
        throw new NotSupportedException();
    public override void SetLength(long value) =>
        throw new NotSupportedException();
    public override void Write(byte[] buffer, int offset, int count) =>
        throw new NotSupportedException();
}
```

**Q: Design a dependency injection container configuration that uses factory patterns for complex object creation.**

A: Implement factory-based DI registration.

```csharp
// Service interface and implementation
public interface IOrderService
{
    Task ProcessOrderAsync(Order order);
}

public class OrderService : IOrderService
{
    private readonly IPaymentGateway _paymentGateway;
    private readonly IInventoryService _inventory;
    private readonly string _merchantId;

    public OrderService(
        IPaymentGateway paymentGateway,
        IInventoryService inventory,
        string merchantId)
    {
        _paymentGateway = paymentGateway;
        _inventory = inventory;
        _merchantId = merchantId;
    }

    public async Task ProcessOrderAsync(Order order)
    {
        // Implementation
    }
}

// Factory interface
public interface IOrderServiceFactory
{
    IOrderService Create(string merchantId);
}

// Factory implementation
public class OrderServiceFactory : IOrderServiceFactory
{
    private readonly IPaymentGateway _paymentGateway;
    private readonly IInventoryService _inventory;

    public OrderServiceFactory(
        IPaymentGateway paymentGateway,
        IInventoryService inventory)
    {
        _paymentGateway = paymentGateway;
        _inventory = inventory;
    }

    public IOrderService Create(string merchantId)
    {
        return new OrderService(_paymentGateway, _inventory, merchantId);
    }
}

// Registration
services.AddScoped<IPaymentGateway, PaymentGateway>();
services.AddScoped<IInventoryService, InventoryService>();
services.AddScoped<IOrderServiceFactory, OrderServiceFactory>();

// Usage in controller
public class OrdersController : ControllerBase
{
    private readonly IOrderServiceFactory _factory;

    public OrdersController(IOrderServiceFactory factory)
    {
        _factory = factory;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] OrderDto dto)
    {
        var orderService = _factory.Create(dto.MerchantId);
        await orderService.ProcessOrderAsync(dto.ToOrder());
        return Ok();
    }
}
```

**Q: Implement multi-tenant support using scoped service provider per tenant.**

A: Create tenant resolution and scoped services.

```csharp
public interface ITenantService
{
    string GetCurrentTenantId();
}

public class TenantService : ITenantService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public TenantService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string GetCurrentTenantId()
    {
        // Extract from subdomain, header, or claim
        var context = _httpContextAccessor.HttpContext;
        if (context.Request.Headers.TryGetValue("X-Tenant-Id", out var tenantId))
        {
            return tenantId;
        }

        // Or from subdomain
        var host = context.Request.Host.Host;
        var parts = host.Split('.');
        return parts.Length > 2 ? parts[0] : "default";
    }
}

public class TenantDbContext : DbContext
{
    private readonly ITenantService _tenantService;

    public TenantDbContext(
        DbContextOptions<TenantDbContext> options,
        ITenantService tenantService)
        : base(options)
    {
        _tenantService = tenantService;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Add global query filter for tenant isolation
        modelBuilder.Entity<Order>()
            .HasQueryFilter(o => o.TenantId == _tenantService.GetCurrentTenantId());

        modelBuilder.Entity<Customer>()
            .HasQueryFilter(c => c.TenantId == _tenantService.GetCurrentTenantId());
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Automatically set TenantId on new entities
        var tenantId = _tenantService.GetCurrentTenantId();
        var entries = ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Added &&
                       e.Entity is ITenantEntity);

        foreach (var entry in entries)
        {
            ((ITenantEntity)entry.Entity).TenantId = tenantId;
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}

// Registration
services.AddHttpContextAccessor();
services.AddScoped<ITenantService, TenantService>();
services.AddDbContext<TenantDbContext>();
```

**Q: Create request validation middleware using FluentValidation.**

A: Implement automatic model validation.

```csharp
public class ValidationMiddleware
{
    private readonly RequestDelegate _next;

    public ValidationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, IServiceProvider serviceProvider)
    {
        // Only validate POST/PUT requests
        if (context.Request.Method != "POST" && context.Request.Method != "PUT")
        {
            await _next(context);
            return;
        }

        var endpoint = context.GetEndpoint();
        if (endpoint == null)
        {
            await _next(context);
            return;
        }

        // Get the endpoint metadata to find request type
        var metadata = endpoint.Metadata.GetMetadata<ValidatableRequestAttribute>();
        if (metadata == null)
        {
            await _next(context);
            return;
        }

        // Read and deserialize request body
        context.Request.EnableBuffering();
        var body = await new StreamReader(context.Request.Body).ReadToEndAsync();
        context.Request.Body.Position = 0;

        var requestType = metadata.RequestType;
        var request = JsonSerializer.Deserialize(body, requestType);

        // Get validator from DI
        var validatorType = typeof(IValidator<>).MakeGenericType(requestType);
        var validator = serviceProvider.GetService(validatorType) as IValidator;

        if (validator != null)
        {
            var validationContext = new ValidationContext<object>(request);
            var validationResult = await validator.ValidateAsync(validationContext);

            if (!validationResult.IsValid)
            {
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                await context.Response.WriteAsJsonAsync(new
                {
                    errors = validationResult.Errors.Select(e => new
                    {
                        property = e.PropertyName,
                        message = e.ErrorMessage
                    })
                });
                return;
            }
        }

        await _next(context);
    }
}

[AttributeUsage(AttributeTargets.Method)]
public class ValidatableRequestAttribute : Attribute
{
    public Type RequestType { get; }

    public ValidatableRequestAttribute(Type requestType)
    {
        RequestType = requestType;
    }
}

// Usage in controller
[HttpPost]
[ValidatableRequest(typeof(CreateOrderRequest))]
public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
{
    // Validation already done by middleware
    return Ok();
}
```

**Q: Implement authentication with multiple schemes (JWT + API Key).**

A: Configure multiple authentication schemes.

```csharp
public class ApiKeyAuthenticationHandler : AuthenticationHandler<ApiKeyAuthenticationOptions>
{
    private readonly IConfiguration _configuration;

    public ApiKeyAuthenticationHandler(
        IOptionsMonitor<ApiKeyAuthenticationOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock,
        IConfiguration configuration)
        : base(options, logger, encoder, clock)
    {
        _configuration = configuration;
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.TryGetValue("X-Api-Key", out var apiKeyHeaderValues))
        {
            return Task.FromResult(AuthenticateResult.NoResult());
        }

        var providedApiKey = apiKeyHeaderValues.FirstOrDefault();
        var validApiKey = _configuration["ApiKey"];

        if (string.IsNullOrWhiteSpace(providedApiKey) || providedApiKey != validApiKey)
        {
            return Task.FromResult(AuthenticateResult.Fail("Invalid API Key"));
        }

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, "ApiKeyUser"),
            new Claim("ApiKey", providedApiKey)
        };

        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}

public class ApiKeyAuthenticationOptions : AuthenticationSchemeOptions
{
}

// Startup configuration
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "https://issuer.example.com",
            ValidateAudience = true,
            ValidAudience = "trading-api",
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1),
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration["Jwt:SigningKey"]))
        };
    })
    .AddScheme<ApiKeyAuthenticationOptions, ApiKeyAuthenticationHandler>(
        "ApiKey",
        options => { });

// Configure authorization policies
services.AddAuthorization(options =>
{
    var defaultAuthBuilder = new AuthorizationPolicyBuilder(
        JwtBearerDefaults.AuthenticationScheme,
        "ApiKey");
    defaultAuthBuilder = defaultAuthBuilder.RequireAuthenticatedUser();
    options.DefaultPolicy = defaultAuthBuilder.Build();

    // Policy for JWT only
    options.AddPolicy("JwtOnly", policy =>
        policy.RequireAuthenticatedUser()
              .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme));

    // Policy for API Key only
    options.AddPolicy("ApiKeyOnly", policy =>
        policy.RequireAuthenticatedUser()
              .AddAuthenticationSchemes("ApiKey"));
});

// Usage in controller
[Authorize(Policy = "JwtOnly")]
public class SecureController : ControllerBase
{
}

[Authorize(Policy = "ApiKeyOnly")]
public class ApiController : ControllerBase
{
}
```

---

## Rate Limiting & Throttling

**Q: Implement a custom rate limiting policy based on user subscription tier.**

A: Create custom rate limiter with different limits per tier.

```csharp
public class TieredRateLimiterPolicy : IRateLimiterPolicy<string>
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public TieredRateLimiterPolicy(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Func<OnRejectedContext, CancellationToken, ValueTask>? OnRejected { get; } =
        (context, cancellationToken) =>
        {
            context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
            return new ValueTask();
        };

    public RateLimitPartition<string> GetPartition(HttpContext httpContext)
    {
        // Get user tier from claims or header
        var tier = httpContext.User.FindFirst("Tier")?.Value ?? "Free";
        var userId = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "anonymous";

        return tier switch
        {
            "Premium" => RateLimitPartition.GetFixedWindowLimiter(userId, _ =>
                new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 1000,
                    Window = TimeSpan.FromMinutes(1),
                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                    QueueLimit = 0
                }),
            "Standard" => RateLimitPartition.GetFixedWindowLimiter(userId, _ =>
                new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 100,
                    Window = TimeSpan.FromMinutes(1),
                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                    QueueLimit = 0
                }),
            _ => RateLimitPartition.GetFixedWindowLimiter(userId, _ =>
                new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 10,
                    Window = TimeSpan.FromMinutes(1),
                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                    QueueLimit = 0
                })
        };
    }
}

// Registration
services.AddHttpContextAccessor();
services.AddRateLimiter(options =>
{
    options.AddPolicy<string, TieredRateLimiterPolicy>("tiered");
});

// Usage
app.MapGet("/api/data", () => Results.Ok("Data"))
   .RequireRateLimiting("tiered");
```

**Q: Create a distributed rate limiter using Redis.**

A: Implement Redis-based rate limiting.

```csharp
public class RedisRateLimiter
{
    private readonly IConnectionMultiplexer _redis;
    private readonly ILogger<RedisRateLimiter> _logger;

    public RedisRateLimiter(
        IConnectionMultiplexer redis,
        ILogger<RedisRateLimiter> logger)
    {
        _redis = redis;
        _logger = logger;
    }

    public async Task<bool> AllowRequestAsync(
        string key,
        int maxRequests,
        TimeSpan window)
    {
        var db = _redis.GetDatabase();
        var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var windowStart = now - (long)window.TotalSeconds;

        var transaction = db.CreateTransaction();

        // Remove old entries
        var removeTask = transaction.SortedSetRemoveRangeByScoreAsync(
            key,
            double.NegativeInfinity,
            windowStart);

        // Add current request
        var addTask = transaction.SortedSetAddAsync(key, now, now);

        // Get count
        var countTask = transaction.SortedSetLengthAsync(key);

        // Set expiry
        var expireTask = transaction.KeyExpireAsync(key, window);

        var executed = await transaction.ExecuteAsync();

        if (!executed)
        {
            _logger.LogWarning("Rate limit transaction failed for key: {Key}", key);
            return false;
        }

        var count = await countTask;
        return count <= maxRequests;
    }

    public async Task<RateLimitInfo> GetRateLimitInfoAsync(
        string key,
        int maxRequests,
        TimeSpan window)
    {
        var db = _redis.GetDatabase();
        var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var windowStart = now - (long)window.TotalSeconds;

        var count = await db.SortedSetLengthAsync(
            key,
            windowStart,
            double.PositiveInfinity);

        var remaining = Math.Max(0, maxRequests - (int)count);
        var oldestEntry = await db.SortedSetRangeByScoreAsync(
            key,
            windowStart,
            double.PositiveInfinity,
            take: 1);

        var resetTime = oldestEntry.Length > 0
            ? DateTimeOffset.FromUnixTimeSeconds((long)oldestEntry[0]).Add(window)
            : DateTimeOffset.UtcNow.Add(window);

        return new RateLimitInfo
        {
            Limit = maxRequests,
            Remaining = remaining,
            Reset = resetTime
        };
    }
}

public record RateLimitInfo
{
    public int Limit { get; init; }
    public int Remaining { get; init; }
    public DateTimeOffset Reset { get; init; }
}

// Middleware integration
public class RedisRateLimitMiddleware
{
    private readonly RequestDelegate _next;
    private readonly RedisRateLimiter _rateLimiter;

    public RedisRateLimitMiddleware(
        RequestDelegate next,
        RedisRateLimiter rateLimiter)
    {
        _next = next;
        _rateLimiter = rateLimiter;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "anonymous";
        var key = $"rate_limit:{userId}";

        var allowed = await _rateLimiter.AllowRequestAsync(
            key,
            maxRequests: 100,
            window: TimeSpan.FromMinutes(1));

        if (!allowed)
        {
            var info = await _rateLimiter.GetRateLimitInfoAsync(
                key,
                maxRequests: 100,
                window: TimeSpan.FromMinutes(1));

            context.Response.Headers.Add("X-RateLimit-Limit", info.Limit.ToString());
            context.Response.Headers.Add("X-RateLimit-Remaining", "0");
            context.Response.Headers.Add("X-RateLimit-Reset", info.Reset.ToUnixTimeSeconds().ToString());

            context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
            await context.Response.WriteAsync("Rate limit exceeded");
            return;
        }

        await _next(context);
    }
}
```

---

## Real-World Scenarios

**Q: Design an API gateway pattern that routes requests to different microservices based on path.**

A: Implement simple reverse proxy with routing.

```csharp
public class ApiGatewayMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<ApiGatewayMiddleware> _logger;
    private readonly Dictionary<string, string> _routes;

    public ApiGatewayMiddleware(
        RequestDelegate next,
        IHttpClientFactory httpClientFactory,
        ILogger<ApiGatewayMiddleware> logger,
        IConfiguration configuration)
    {
        _next = next;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
        _routes = configuration.GetSection("Gateway:Routes")
            .Get<Dictionary<string, string>>();
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var path = context.Request.Path.Value;
        var matchedRoute = _routes.FirstOrDefault(r => path.StartsWith(r.Key));

        if (matchedRoute.Key == null)
        {
            await _next(context);
            return;
        }

        var targetUrl = matchedRoute.Value + path.Substring(matchedRoute.Key.Length);
        if (context.Request.QueryString.HasValue)
        {
            targetUrl += context.Request.QueryString.Value;
        }

        var httpClient = _httpClientFactory.CreateClient();
        var requestMessage = new HttpRequestMessage
        {
            Method = new HttpMethod(context.Request.Method),
            RequestUri = new Uri(targetUrl)
        };

        // Copy headers
        foreach (var header in context.Request.Headers)
        {
            if (!header.Key.StartsWith(":") &&
                header.Key != "Host" &&
                header.Key != "Content-Length")
            {
                requestMessage.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
            }
        }

        // Copy body for POST/PUT
        if (context.Request.Method == "POST" || context.Request.Method == "PUT")
        {
            var streamContent = new StreamContent(context.Request.Body);
            requestMessage.Content = streamContent;
        }

        try
        {
            var response = await httpClient.SendAsync(
                requestMessage,
                HttpCompletionOption.ResponseHeadersRead,
                context.RequestAborted);

            context.Response.StatusCode = (int)response.StatusCode;

            // Copy response headers
            foreach (var header in response.Headers)
            {
                context.Response.Headers[header.Key] = header.Value.ToArray();
            }

            foreach (var header in response.Content.Headers)
            {
                context.Response.Headers[header.Key] = header.Value.ToArray();
            }

            await response.Content.CopyToAsync(context.Response.Body);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error proxying request to {TargetUrl}", targetUrl);
            context.Response.StatusCode = StatusCodes.Status502BadGateway;
        }
    }
}

// appsettings.json
{
  "Gateway": {
    "Routes": {
      "/api/orders": "http://orders-service",
      "/api/products": "http://products-service",
      "/api/customers": "http://customers-service"
    }
  }
}
```

**Q: Implement request deduplication middleware using distributed cache.**

A: Prevent duplicate requests within a time window.

```csharp
public class RequestDeduplicationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IDistributedCache _cache;
    private readonly ILogger<RequestDeduplicationMiddleware> _logger;

    public RequestDeduplicationMiddleware(
        RequestDelegate next,
        IDistributedCache cache,
        ILogger<RequestDeduplicationMiddleware> logger)
    {
        _next = next;
        _cache = cache;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Only deduplicate POST/PUT requests
        if (context.Request.Method != "POST" && context.Request.Method != "PUT")
        {
            await _next(context);
            return;
        }

        // Get idempotency key from header
        if (!context.Request.Headers.TryGetValue("Idempotency-Key", out var idempotencyKey))
        {
            await _next(context);
            return;
        }

        var cacheKey = $"idempotency:{idempotencyKey}";
        var cachedResponse = await _cache.GetStringAsync(cacheKey);

        if (cachedResponse != null)
        {
            _logger.LogInformation(
                "Returning cached response for idempotency key: {IdempotencyKey}",
                idempotencyKey);

            var response = JsonSerializer.Deserialize<CachedResponse>(cachedResponse);
            context.Response.StatusCode = response.StatusCode;
            context.Response.ContentType = response.ContentType;
            await context.Response.WriteAsync(response.Body);
            return;
        }

        // Capture response
        var originalBodyStream = context.Response.Body;
        using var responseBody = new MemoryStream();
        context.Response.Body = responseBody;

        await _next(context);

        // Cache successful responses
        if (context.Response.StatusCode >= 200 && context.Response.StatusCode < 300)
        {
            responseBody.Seek(0, SeekOrigin.Begin);
            var body = await new StreamReader(responseBody).ReadToEndAsync();
            responseBody.Seek(0, SeekOrigin.Begin);

            var cachedResponseObj = new CachedResponse
            {
                StatusCode = context.Response.StatusCode,
                ContentType = context.Response.ContentType,
                Body = body
            };

            var serialized = JsonSerializer.Serialize(cachedResponseObj);
            await _cache.SetStringAsync(
                cacheKey,
                serialized,
                new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(24)
                });

            _logger.LogInformation(
                "Cached response for idempotency key: {IdempotencyKey}",
                idempotencyKey);
        }

        await responseBody.CopyToAsync(originalBodyStream);
    }

    private class CachedResponse
    {
        public int StatusCode { get; set; }
        public string ContentType { get; set; }
        public string Body { get; set; }
    }
}
```

**Q: Create a background service that performs periodic health checks on external dependencies.**

A: Implement IHostedService for background monitoring.

```csharp
public class HealthCheckBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<HealthCheckBackgroundService> _logger;
    private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(1);

    public HealthCheckBackgroundService(
        IServiceProvider serviceProvider,
        ILogger<HealthCheckBackgroundService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Health Check Background Service started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await PerformHealthChecksAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error performing health checks");
            }

            await Task.Delay(_checkInterval, stoppingToken);
        }

        _logger.LogInformation("Health Check Background Service stopped");
    }

    private async Task PerformHealthChecksAsync(CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var healthCheckService = scope.ServiceProvider
            .GetRequiredService<HealthCheckService>();

        var result = await healthCheckService.CheckHealthAsync(cancellationToken);

        foreach (var entry in result.Entries)
        {
            if (entry.Value.Status != HealthStatus.Healthy)
            {
                _logger.LogWarning(
                    "Health check {Name} is {Status}: {Description}",
                    entry.Key,
                    entry.Value.Status,
                    entry.Value.Description);

                // Could send alerts, update metrics, etc.
            }
        }

        _logger.LogInformation(
            "Health check completed. Overall status: {Status}",
            result.Status);
    }
}

// Registration
services.AddHostedService<HealthCheckBackgroundService>();
```

---

## Authorization & Security

**Q: Implement resource-based authorization for multi-tenant applications.**

A: Create authorization handlers for tenant-specific resources.

```csharp
public class TenantAuthorizationHandler :
    AuthorizationHandler<TenantAccessRequirement, Order>
{
    private readonly ITenantService _tenantService;

    public TenantAuthorizationHandler(ITenantService tenantService)
    {
        _tenantService = tenantService;
    }

    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        TenantAccessRequirement requirement,
        Order resource)
    {
        var currentTenantId = _tenantService.GetCurrentTenantId();

        if (resource.TenantId == currentTenantId)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}

public class TenantAccessRequirement : IAuthorizationRequirement
{
}

// Registration
services.AddAuthorization(options =>
{
    options.AddPolicy("TenantAccess", policy =>
        policy.Requirements.Add(new TenantAccessRequirement()));
});

services.AddSingleton<IAuthorizationHandler, TenantAuthorizationHandler>();

// Usage in controller
[HttpGet("{id}")]
public async Task<IActionResult> GetOrder(int id)
{
    var order = await _orderService.GetByIdAsync(id);

    var authResult = await _authorizationService.AuthorizeAsync(
        User,
        order,
        "TenantAccess");

    if (!authResult.Succeeded)
    {
        return Forbid();
    }

    return Ok(order);
}
```

**Q: Implement CORS policy dynamically based on database configuration.**

A: Create dynamic CORS policy provider.

```csharp
public interface ICorsConfigurationService
{
    Task<List<string>> GetAllowedOriginsAsync();
}

public class DatabaseCorsConfigurationService : ICorsConfigurationService
{
    private readonly DbContext _dbContext;
    private readonly IMemoryCache _cache;

    public DatabaseCorsConfigurationService(DbContext dbContext, IMemoryCache cache)
    {
        _dbContext = dbContext;
        _cache = cache;
    }

    public async Task<List<string>> GetAllowedOriginsAsync()
    {
        return await _cache.GetOrCreateAsync("cors-origins", async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);

            return await _dbContext.Set<CorsOrigin>()
                .Where(o => o.IsEnabled)
                .Select(o => o.Origin)
                .ToListAsync();
        });
    }
}

public class DynamicCorsMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ICorsConfigurationService _corsConfig;

    public DynamicCorsMiddleware(
        RequestDelegate next,
        ICorsConfigurationService corsConfig)
    {
        _next = next;
        _corsConfig = corsConfig;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var origin = context.Request.Headers["Origin"].ToString();

        if (!string.IsNullOrEmpty(origin))
        {
            var allowedOrigins = await _corsConfig.GetAllowedOriginsAsync();

            if (allowedOrigins.Contains(origin))
            {
                context.Response.Headers.Add("Access-Control-Allow-Origin", origin);
                context.Response.Headers.Add("Access-Control-Allow-Credentials", "true");

                if (context.Request.Method == "OPTIONS")
                {
                    context.Response.Headers.Add(
                        "Access-Control-Allow-Methods",
                        "GET, POST, PUT, DELETE, OPTIONS");
                    context.Response.Headers.Add(
                        "Access-Control-Allow-Headers",
                        "Content-Type, Authorization");
                    context.Response.StatusCode = StatusCodes.Status204NoContent;
                    return;
                }
            }
        }

        await _next(context);
    }
}
```

---

## Advanced API Scenarios

**Q: Implement ETag support for GET endpoints with conditional requests.**

A: Compute a hash and honor `If-None-Match`.

```csharp
app.MapGet("/orders/{id}", async (int id, HttpContext context, IOrderRepo repo) =>
{
    var order = await repo.GetByIdAsync(id);
    if (order is null)
        return Results.NotFound();

    var etag = $"\"{order.UpdatedAt.Ticks}\"";
    if (context.Request.Headers.IfNoneMatch == etag)
        return Results.StatusCode(StatusCodes.Status304NotModified);

    context.Response.Headers.ETag = etag;
    return Results.Ok(order);
});
```

**Q: Enforce request body size limits for upload endpoints.**

A: Use `RequestSizeLimit` attributes or middleware.

```csharp
[RequestSizeLimit(2 * 1024 * 1024)]
[HttpPost("upload")]
public async Task<IActionResult> Upload(IFormFile file)
{
    // ...
    return Ok();
}
```

**Q: Create a readiness endpoint that checks dependencies.**

A: Use health checks with tags.

```csharp
builder.Services.AddHealthChecks()
    .AddSqlServer(connectionString, name: "db")
    .AddRedis(redisConnection, name: "cache");

app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready")
});
```

**Q: Implement resource-based authorization with policies.**

A: Use `IAuthorizationService` in handlers.

```csharp
app.MapGet("/accounts/{id}", async (
    int id,
    ClaimsPrincipal user,
    IAuthorizationService auth,
    IAccountRepo repo) =>
{
    var account = await repo.GetByIdAsync(id);
    var result = await auth.AuthorizeAsync(user, account, "CanReadAccount");
    return result.Succeeded ? Results.Ok(account) : Results.Forbid();
});
```

**Q: Apply per-tenant rate limits with a custom policy.**

A: Partition limits by tenant identifier.

```csharp
builder.Services.AddRateLimiter(options =>
{
    options.AddPolicy("per-tenant", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.User.FindFirst("tenant")?.Value ?? "anon",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 60,
                Window = TimeSpan.FromMinutes(1)
            }));
});

app.UseRateLimiter();
```

---

**Total Exercises: 45+**

Master these patterns to build robust, scalable APIs with proper lifecycle management!
