# Complete Example: High-Traffic E-Commerce Order API

This is a production-ready implementation combining all patterns: async I/O, caching, rate limiting, resilience, queues, and observability.

## System Architecture

```
Client Request
    ↓
Load Balancer (NGINX/AWS ALB)
    ↓
API Gateway (Rate Limiting)
    ↓
Order Service (Stateless, Horizontal Scaling)
    ↓
├─→ Redis Cache (L2)
├─→ PostgreSQL (Primary + Read Replicas)
├─→ RabbitMQ (Async Processing)
└─→ External Services (Inventory, Payment)
    ↓
Background Workers (Order Processing, Notifications)
```

---

## Project Structure

```
OrderService/
├── Controllers/
│   └── OrdersController.cs
├── Services/
│   ├── OrderService.cs
│   ├── CacheService.cs
│   ├── InventoryService.cs
│   └── PaymentService.cs
├── Repositories/
│   └── OrderRepository.cs
├── BackgroundServices/
│   ├── OrderProcessingWorker.cs
│   └── MetricsCollector.cs
├── Models/
│   ├── Order.cs
│   ├── OrderMessage.cs
│   └── DTOs/
├── Infrastructure/
│   ├── RabbitMQ/
│   │   ├── RabbitMQConnection.cs
│   │   └── MessagePublisher.cs
│   └── Middleware/
│       ├── CorrelationIdMiddleware.cs
│       └── ExceptionHandlingMiddleware.cs
├── Metrics/
│   └── ApplicationMetrics.cs
└── Program.cs
```

---

## Complete Implementation

### Program.cs - Bootstrap Everything

```csharp
using System.Data;
using Dapper;
using Microsoft.AspNetCore.RateLimiting;
using Npgsql;
using Polly;
using Polly.Extensions.Http;
using Prometheus;
using Serilog;
using StackExchange.Redis;
using System.Threading.RateLimiting;
using OrderService.Services;
using OrderService.Repositories;
using OrderService.Infrastructure;
using OrderService.BackgroundServices;

var builder = WebApplication.CreateBuilder(args);

// ============ LOGGING ============
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .Enrich.WithMachineName()
    .Enrich.WithProperty("Application", "OrderService")
    .WriteTo.Console()
    .WriteTo.File("logs/app-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// ============ CONTROLLERS & API ============
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ============ RATE LIMITING ============
builder.Services.AddRateLimiter(options =>
{
    options.AddSlidingWindowLimiter("api", opt =>
    {
        opt.PermitLimit = 100;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.SegmentsPerWindow = 6;
        opt.QueueLimit = 0;
    });

    options.OnRejected = async (context, ct) =>
    {
        context.HttpContext.Response.StatusCode = 429;
        await context.HttpContext.Response.WriteAsJsonAsync(new
        {
            error = "Rate limit exceeded. Please retry later."
        }, ct);
    };
});

// ============ DATABASE ============
builder.Services.AddScoped<IDbConnection>(sp =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    return new NpgsqlConnection(connectionString);
});

builder.Services.AddScoped<IOrderRepository, OrderRepository>();

// ============ REDIS CACHE ============
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    var config = ConfigurationOptions.Parse(
        builder.Configuration.GetConnectionString("Redis")!
    );
    config.AbortOnConnectFail = false;
    config.ConnectTimeout = 5000;
    return ConnectionMultiplexer.Connect(config);
});

builder.Services.AddSingleton<ICacheService, RedisCacheService>();
builder.Services.AddMemoryCache();

// ============ MESSAGE QUEUE ============
builder.Services.AddSingleton<IRabbitMQConnection, RabbitMQConnection>();
builder.Services.AddSingleton<IMessagePublisher, RabbitMQPublisher>();

// ============ HTTP CLIENTS WITH RESILIENCE ============
builder.Services.AddHttpClient<IInventoryService, InventoryService>(client =>
{
    client.BaseAddress = new Uri(builder.Configuration["Services:Inventory"]!);
    client.Timeout = TimeSpan.FromSeconds(10);
})
.AddPolicyHandler(GetRetryPolicy())
.AddPolicyHandler(GetCircuitBreakerPolicy());

builder.Services.AddHttpClient<IPaymentService, PaymentService>(client =>
{
    client.BaseAddress = new Uri(builder.Configuration["Services:Payment"]!);
    client.Timeout = TimeSpan.FromSeconds(10);
})
.AddPolicyHandler(GetRetryPolicy())
.AddPolicyHandler(GetCircuitBreakerPolicy());

// ============ SERVICES ============
builder.Services.AddScoped<IOrderService, Services.OrderService>();

// ============ BACKGROUND WORKERS ============
builder.Services.AddHostedService<OrderProcessingWorker>();
builder.Services.AddHostedService<MetricsCollector>();

// ============ HEALTH CHECKS ============
builder.Services.AddHealthChecks()
    .AddNpgSql(builder.Configuration.GetConnectionString("DefaultConnection")!)
    .AddRedis(builder.Configuration.GetConnectionString("Redis")!);

var app = builder.Build();

// ============ MIDDLEWARE PIPELINE ============
app.UseMiddleware<CorrelationIdMiddleware>();
app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRateLimiter();

app.UseHttpMetrics(); // Prometheus
app.MapMetrics();     // /metrics endpoint

app.MapHealthChecks("/health");
app.MapControllers();

app.Run();

// ============ RESILIENCE POLICIES ============
static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
{
    return HttpPolicyExtensions
        .HandleTransientHttpError()
        .WaitAndRetryAsync(
            retryCount: 3,
            sleepDurationProvider: retryAttempt =>
                TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)) +
                TimeSpan.FromMilliseconds(Random.Shared.Next(0, 1000)),
            onRetry: (outcome, timespan, retryAttempt, context) =>
            {
                Log.Warning(
                    "Retry {RetryAttempt} after {Delay}s due to {Exception}",
                    retryAttempt, timespan.TotalSeconds, outcome.Exception?.Message
                );
            }
        );
}

static IAsyncPolicy<HttpResponseMessage> GetCircuitBreakerPolicy()
{
    return HttpPolicyExtensions
        .HandleTransientHttpError()
        .CircuitBreakerAsync(
            handledEventsAllowedBeforeBreaking: 5,
            durationOfBreak: TimeSpan.FromSeconds(30),
            onBreak: (outcome, duration) =>
            {
                Log.Error("Circuit breaker opened for {Duration}s", duration.TotalSeconds);
            },
            onReset: () =>
            {
                Log.Information("Circuit breaker reset");
            }
        );
}
```

---

### OrdersController.cs

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using OrderService.Models;
using OrderService.Services;
using Prometheus;

namespace OrderService.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableRateLimiting("api")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly ILogger<OrdersController> _logger;

    private static readonly Counter OrderRequestsTotal = Metrics.CreateCounter(
        "order_requests_total",
        "Total order requests",
        new CounterConfiguration { LabelNames = new[] { "action", "status" } }
    );

    public OrdersController(
        IOrderService orderService,
        ILogger<OrdersController> logger)
    {
        _orderService = orderService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrderAsync(
        [FromBody] CreateOrderRequest request,
        CancellationToken ct)
    {
        try
        {
            var order = await _orderService.CreateOrderAsync(request, ct);

            OrderRequestsTotal.Labels("create", "success").Inc();

            return Accepted(new
            {
                orderId = order.Id,
                status = order.Status,
                message = "Order is being processed"
            });
        }
        catch (InvalidOperationException ex)
        {
            OrderRequestsTotal.Labels("create", "validation_error").Inc();
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            OrderRequestsTotal.Labels("create", "error").Inc();
            _logger.LogError(ex, "Error creating order");
            return StatusCode(500, new { error = "An error occurred processing your order" });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrderAsync(int id, CancellationToken ct)
    {
        try
        {
            var order = await _orderService.GetOrderAsync(id, ct);

            if (order == null)
            {
                OrderRequestsTotal.Labels("get", "not_found").Inc();
                return NotFound();
            }

            OrderRequestsTotal.Labels("get", "success").Inc();
            return Ok(order);
        }
        catch (Exception ex)
        {
            OrderRequestsTotal.Labels("get", "error").Inc();
            _logger.LogError(ex, "Error retrieving order {OrderId}", id);
            return StatusCode(500, new { error = "An error occurred" });
        }
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserOrdersAsync(
        int userId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        try
        {
            var orders = await _orderService.GetUserOrdersAsync(userId, page, pageSize, ct);
            return Ok(orders);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving orders for user {UserId}", userId);
            return StatusCode(500, new { error = "An error occurred" });
        }
    }
}
```

---

### OrderService.cs - Business Logic

```csharp
using System.Diagnostics;
using OrderService.Infrastructure;
using OrderService.Models;
using OrderService.Repositories;
using Prometheus;

namespace OrderService.Services;

public interface IOrderService
{
    Task<Order> CreateOrderAsync(CreateOrderRequest request, CancellationToken ct);
    Task<Order?> GetOrderAsync(int orderId, CancellationToken ct);
    Task<IEnumerable<Order>> GetUserOrdersAsync(int userId, int page, int pageSize, CancellationToken ct);
}

public class OrderService : IOrderService
{
    private readonly IOrderRepository _repository;
    private readonly ICacheService _cache;
    private readonly IInventoryService _inventoryService;
    private readonly IPaymentService _paymentService;
    private readonly IMessagePublisher _publisher;
    private readonly ILogger<OrderService> _logger;

    private static readonly ActivitySource ActivitySource = new("OrderService");

    private static readonly Histogram OrderProcessingDuration = Metrics.CreateHistogram(
        "order_processing_duration_seconds",
        "Duration of order processing"
    );

    public OrderService(
        IOrderRepository repository,
        ICacheService cache,
        IInventoryService inventoryService,
        IPaymentService paymentService,
        IMessagePublisher publisher,
        ILogger<OrderService> logger)
    {
        _repository = repository;
        _cache = cache;
        _inventoryService = inventoryService;
        _paymentService = paymentService;
        _publisher = publisher;
        _logger = logger;
    }

    public async Task<Order> CreateOrderAsync(CreateOrderRequest request, CancellationToken ct)
    {
        using var activity = ActivitySource.StartActivity("CreateOrder");
        activity?.SetTag("user.id", request.UserId);
        activity?.SetTag("order.total", request.Total);

        using (OrderProcessingDuration.NewTimer())
        {
            _logger.LogInformation(
                "Creating order for user {UserId} with total {Total}",
                request.UserId,
                request.Total
            );

            // 1. Check inventory (external service)
            using (var inventoryActivity = ActivitySource.StartActivity("CheckInventory"))
            {
                var inventoryAvailable = await _inventoryService.CheckAvailabilityAsync(
                    request.ProductId,
                    request.Quantity,
                    ct
                );

                if (!inventoryAvailable)
                {
                    _logger.LogWarning(
                        "Insufficient inventory for product {ProductId}",
                        request.ProductId
                    );
                    throw new InvalidOperationException("Insufficient inventory");
                }
            }

            // 2. Create order in database
            var order = new Order
            {
                UserId = request.UserId,
                ProductId = request.ProductId,
                Quantity = request.Quantity,
                Total = request.Total,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            using (var dbActivity = ActivitySource.StartActivity("SaveOrder"))
            {
                order.Id = await _repository.CreateAsync(order, ct);
            }

            _logger.LogInformation("Order {OrderId} created", order.Id);

            // 3. Publish message for async processing (payment, notifications)
            await _publisher.PublishAsync("order-processing", new OrderMessage
            {
                OrderId = order.Id,
                UserId = order.UserId,
                ProductId = order.ProductId,
                Quantity = order.Quantity,
                Total = order.Total,
                PaymentMethod = request.PaymentMethod
            }, ct);

            _logger.LogInformation("Order {OrderId} queued for processing", order.Id);

            activity?.SetTag("order.id", order.Id);
            activity?.SetStatus(ActivityStatusCode.Ok);

            return order;
        }
    }

    public async Task<Order?> GetOrderAsync(int orderId, CancellationToken ct)
    {
        var cacheKey = $"order:{orderId}";

        // Try cache first
        var cached = await _cache.GetAsync<Order>(cacheKey, ct);
        if (cached != null)
        {
            _logger.LogDebug("Cache hit for order {OrderId}", orderId);
            return cached;
        }

        _logger.LogDebug("Cache miss for order {OrderId}", orderId);

        // Load from database
        var order = await _repository.GetByIdAsync(orderId, ct);

        if (order != null)
        {
            // Cache for 5 minutes
            await _cache.SetAsync(cacheKey, order, TimeSpan.FromMinutes(5), ct);
        }

        return order;
    }

    public async Task<IEnumerable<Order>> GetUserOrdersAsync(
        int userId,
        int page,
        int pageSize,
        CancellationToken ct)
    {
        return await _repository.GetUserOrdersAsync(userId, page, pageSize, ct);
    }
}
```

---

### OrderRepository.cs - Database Access

```csharp
using System.Data;
using Dapper;
using OrderService.Models;

namespace OrderService.Repositories;

public interface IOrderRepository
{
    Task<int> CreateAsync(Order order, CancellationToken ct);
    Task<Order?> GetByIdAsync(int orderId, CancellationToken ct);
    Task<IEnumerable<Order>> GetUserOrdersAsync(int userId, int page, int pageSize, CancellationToken ct);
    Task UpdateStatusAsync(int orderId, string status, CancellationToken ct);
}

public class OrderRepository : IOrderRepository
{
    private readonly IDbConnection _db;

    public OrderRepository(IDbConnection db)
    {
        _db = db;
    }

    public async Task<int> CreateAsync(Order order, CancellationToken ct)
    {
        var sql = @"
            INSERT INTO Orders (UserId, ProductId, Quantity, Total, Status, CreatedAt)
            VALUES (@UserId, @ProductId, @Quantity, @Total, @Status, @CreatedAt)
            RETURNING Id";

        return await _db.ExecuteScalarAsync<int>(new CommandDefinition(
            commandText: sql,
            parameters: order,
            cancellationToken: ct
        ));
    }

    public async Task<Order?> GetByIdAsync(int orderId, CancellationToken ct)
    {
        var sql = "SELECT * FROM Orders WHERE Id = @OrderId";

        return await _db.QueryFirstOrDefaultAsync<Order>(new CommandDefinition(
            commandText: sql,
            parameters: new { OrderId = orderId },
            commandTimeout: 5,
            cancellationToken: ct
        ));
    }

    public async Task<IEnumerable<Order>> GetUserOrdersAsync(
        int userId,
        int page,
        int pageSize,
        CancellationToken ct)
    {
        // Keyset pagination for better performance
        var sql = @"
            SELECT * FROM Orders
            WHERE UserId = @UserId
            ORDER BY CreatedAt DESC, Id DESC
            LIMIT @PageSize
            OFFSET @Offset";

        return await _db.QueryAsync<Order>(new CommandDefinition(
            commandText: sql,
            parameters: new
            {
                UserId = userId,
                PageSize = pageSize,
                Offset = (page - 1) * pageSize
            },
            commandTimeout: 5,
            cancellationToken: ct
        ));
    }

    public async Task UpdateStatusAsync(int orderId, string status, CancellationToken ct)
    {
        var sql = "UPDATE Orders SET Status = @Status WHERE Id = @OrderId";

        await _db.ExecuteAsync(new CommandDefinition(
            commandText: sql,
            parameters: new { OrderId = orderId, Status = status },
            commandTimeout: 5,
            cancellationToken: ct
        ));
    }
}
```

---

### OrderProcessingWorker.cs - Background Processing

```csharp
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using OrderService.Infrastructure;
using OrderService.Models;
using OrderService.Repositories;
using OrderService.Services;

namespace OrderService.BackgroundServices;

public class OrderProcessingWorker : BackgroundService
{
    private readonly IRabbitMQConnection _rabbitConnection;
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<OrderProcessingWorker> _logger;
    private IModel? _channel;

    public OrderProcessingWorker(
        IRabbitMQConnection rabbitConnection,
        IServiceProvider serviceProvider,
        ILogger<OrderProcessingWorker> logger)
    {
        _rabbitConnection = rabbitConnection;
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _channel = _rabbitConnection.GetConnection().CreateModel();
        _channel.BasicQos(0, 10, false);

        var queueName = "order-processing";
        _channel.QueueDeclare(queueName, durable: true, exclusive: false, autoDelete: false);

        var consumer = new EventingBasicConsumer(_channel);

        consumer.Received += async (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);

            try
            {
                var orderMessage = JsonSerializer.Deserialize<OrderMessage>(message);

                _logger.LogInformation("Processing order {OrderId}", orderMessage?.OrderId);

                using var scope = _serviceProvider.CreateScope();
                var paymentService = scope.ServiceProvider.GetRequiredService<IPaymentService>();
                var repository = scope.ServiceProvider.GetRequiredService<IOrderRepository>();

                // Process payment
                var paymentResult = await paymentService.ProcessPaymentAsync(
                    orderMessage!.OrderId,
                    orderMessage.Total,
                    orderMessage.PaymentMethod,
                    stoppingToken
                );

                if (paymentResult.Success)
                {
                    await repository.UpdateStatusAsync(
                        orderMessage.OrderId,
                        "Completed",
                        stoppingToken
                    );

                    _logger.LogInformation("Order {OrderId} completed", orderMessage.OrderId);
                }
                else
                {
                    await repository.UpdateStatusAsync(
                        orderMessage.OrderId,
                        "Failed",
                        stoppingToken
                    );

                    _logger.LogWarning("Order {OrderId} payment failed", orderMessage.OrderId);
                }

                _channel.BasicAck(ea.DeliveryTag, false);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing order message: {Message}", message);
                _channel.BasicNack(ea.DeliveryTag, false, requeue: true);
            }
        };

        _channel.BasicConsume(queueName, autoAck: false, consumer: consumer);

        return Task.CompletedTask;
    }

    public override void Dispose()
    {
        _channel?.Close();
        _channel?.Dispose();
        base.Dispose();
    }
}
```

---

## Database Schema

```sql
CREATE TABLE Orders (
    Id SERIAL PRIMARY KEY,
    UserId INT NOT NULL,
    ProductId INT NOT NULL,
    Quantity INT NOT NULL,
    Total DECIMAL(10, 2) NOT NULL,
    Status VARCHAR(50) NOT NULL,
    CreatedAt TIMESTAMP NOT NULL,
    UpdatedAt TIMESTAMP
);

CREATE INDEX IX_Orders_UserId_CreatedAt ON Orders (UserId, CreatedAt DESC);
CREATE INDEX IX_Orders_Status ON Orders (Status);
```

---

## Configuration (appsettings.json)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=orderdb;Username=postgres;Password=password;Max Pool Size=100",
    "Redis": "localhost:6379"
  },
  "Services": {
    "Inventory": "https://inventory-api",
    "Payment": "https://payment-api"
  },
  "Serilog": {
    "MinimumLevel": "Information"
  }
}
```

---

## Summary: What This Example Demonstrates

✅ **Async/await**: All I/O is non-blocking
✅ **Rate limiting**: Built-in ASP.NET Core rate limiter
✅ **Caching**: Redis with cache-aside pattern
✅ **Database**: Dapper with proper indexing and pagination
✅ **Message queues**: RabbitMQ for async processing
✅ **Resilience**: Polly retry + circuit breaker on HTTP clients
✅ **Observability**: Structured logging, Prometheus metrics, OpenTelemetry tracing
✅ **Health checks**: Database and Redis health endpoints
✅ **Clean architecture**: Separation of concerns (controllers, services, repositories)

**This is interview-ready code** that demonstrates you understand how to build systems that scale to millions of users.
