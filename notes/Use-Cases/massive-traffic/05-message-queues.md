# Message Queues & Async Processing: Decoupling for Scale

## Why Message Queues Matter

**The Problem:**
- User submits order → triggers inventory check, payment, email, SMS, analytics
- If all happen synchronously: slow response (5+ seconds)
- If any fails: entire request fails
- Under load: threads blocked waiting for slow operations

**The Solution:**
- Accept request → validate → return 202 Accepted (fast)
- Push work to queue → background workers process
- User gets instant response, work happens asynchronously

**Key Benefits:**
- Fast response times
- Fault tolerance (retry failed work)
- Load leveling (workers process at sustainable rate)
- Scalability (add more workers independently)

---

## 1. In-Process Background Queues (Simple Cases)

For lightweight background work within a single application.

### Channel-Based Background Queue

```csharp
public interface IBackgroundTaskQueue
{
    ValueTask QueueAsync(Func<CancellationToken, ValueTask> workItem);
    ValueTask<Func<CancellationToken, ValueTask>> DequeueAsync(CancellationToken ct);
}

public class BackgroundTaskQueue : IBackgroundTaskQueue
{
    private readonly Channel<Func<CancellationToken, ValueTask>> _queue;

    public BackgroundTaskQueue(int capacity = 1000)
    {
        var options = new BoundedChannelOptions(capacity)
        {
            FullMode = BoundedChannelFullMode.Wait // Block when full
        };
        _queue = Channel.CreateBounded<Func<CancellationToken, ValueTask>>(options);
    }

    public async ValueTask QueueAsync(Func<CancellationToken, ValueTask> workItem)
    {
        if (workItem == null)
            throw new ArgumentNullException(nameof(workItem));

        await _queue.Writer.WriteAsync(workItem);
    }

    public async ValueTask<Func<CancellationToken, ValueTask>> DequeueAsync(
        CancellationToken ct)
    {
        var workItem = await _queue.Reader.ReadAsync(ct);
        return workItem;
    }
}

// Background service to process queue
public class QueuedHostedService : BackgroundService
{
    private readonly IBackgroundTaskQueue _taskQueue;
    private readonly ILogger<QueuedHostedService> _logger;

    public QueuedHostedService(
        IBackgroundTaskQueue taskQueue,
        ILogger<QueuedHostedService> logger)
    {
        _taskQueue = taskQueue;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Queued Hosted Service is starting.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var workItem = await _taskQueue.DequeueAsync(stoppingToken);

                await workItem(stoppingToken);
            }
            catch (OperationCanceledException)
            {
                // Expected on shutdown
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred executing task work item.");
            }
        }

        _logger.LogInformation("Queued Hosted Service is stopping.");
    }
}

// Usage in controller
[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly IBackgroundTaskQueue _queue;
    private readonly IEmailService _emailService;

    [HttpPost]
    public async Task<IActionResult> CreateOrderAsync(
        CreateOrderRequest request,
        CancellationToken ct)
    {
        // Validate and create order (fast, synchronous)
        var orderId = await CreateOrderInDbAsync(request, ct);

        // Queue background work (email, analytics, etc.)
        await _queue.QueueAsync(async token =>
        {
            await _emailService.SendOrderConfirmationAsync(orderId, token);
            await _analyticsService.TrackOrderAsync(orderId, token);
        });

        // Return immediately
        return Accepted(new { orderId, message = "Order created successfully" });
    }
}

// Registration
builder.Services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>();
builder.Services.AddHostedService<QueuedHostedService>();
```

**When to use:**
- Single-instance deployments
- Non-critical background work (failures acceptable)
- Low volume (< 1000 jobs/minute)

**When NOT to use:**
- Multi-instance deployments (work lost on restart)
- Mission-critical work (no durability)
- High volume (needs distributed queue)

---

## 2. RabbitMQ for Distributed Work Queues

Production-grade message queue with durability, retries, and acknowledgments.

### Setup RabbitMQ Client

```csharp
// Install: RabbitMQ.Client
// appsettings.json
{
  "RabbitMQ": {
    "Host": "localhost",
    "Port": 5672,
    "Username": "guest",
    "Password": "guest",
    "VirtualHost": "/"
  }
}

// Connection factory
public interface IRabbitMQConnection
{
    IConnection GetConnection();
}

public class RabbitMQConnection : IRabbitMQConnection, IDisposable
{
    private readonly IConfiguration _config;
    private IConnection? _connection;
    private readonly object _lock = new();

    public RabbitMQConnection(IConfiguration config)
    {
        _config = config;
    }

    public IConnection GetConnection()
    {
        if (_connection != null && _connection.IsOpen)
            return _connection;

        lock (_lock)
        {
            if (_connection != null && _connection.IsOpen)
                return _connection;

            var factory = new ConnectionFactory
            {
                HostName = _config["RabbitMQ:Host"],
                Port = _config.GetValue<int>("RabbitMQ:Port"),
                UserName = _config["RabbitMQ:Username"],
                Password = _config["RabbitMQ:Password"],
                VirtualHost = _config["RabbitMQ:VirtualHost"],
                AutomaticRecoveryEnabled = true,
                NetworkRecoveryInterval = TimeSpan.FromSeconds(10),
                RequestedHeartbeat = TimeSpan.FromSeconds(60)
            };

            _connection = factory.CreateConnection();
            return _connection;
        }
    }

    public void Dispose()
    {
        _connection?.Close();
        _connection?.Dispose();
    }
}
```

### Publisher: Queue Messages

```csharp
public interface IMessagePublisher
{
    Task PublishAsync<T>(string queueName, T message, CancellationToken ct);
}

public class RabbitMQPublisher : IMessagePublisher
{
    private readonly IRabbitMQConnection _rabbitConnection;
    private readonly ILogger<RabbitMQPublisher> _logger;

    public RabbitMQPublisher(
        IRabbitMQConnection rabbitConnection,
        ILogger<RabbitMQPublisher> logger)
    {
        _rabbitConnection = rabbitConnection;
        _logger = logger;
    }

    public Task PublishAsync<T>(string queueName, T message, CancellationToken ct)
    {
        try
        {
            using var channel = _rabbitConnection.GetConnection().CreateModel();

            // Declare queue (idempotent)
            channel.QueueDeclare(
                queue: queueName,
                durable: true, // Survives broker restart
                exclusive: false,
                autoDelete: false,
                arguments: null
            );

            var json = JsonSerializer.Serialize(message);
            var body = Encoding.UTF8.GetBytes(json);

            var properties = channel.CreateBasicProperties();
            properties.Persistent = true; // Message survives restart
            properties.ContentType = "application/json";
            properties.DeliveryMode = 2; // Persistent

            channel.BasicPublish(
                exchange: "",
                routingKey: queueName,
                basicProperties: properties,
                body: body
            );

            _logger.LogInformation(
                "Published message to queue {Queue}: {Message}",
                queueName,
                json
            );

            return Task.CompletedTask;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to publish message to queue {Queue}", queueName);
            throw;
        }
    }
}
```

### Consumer: Process Messages

```csharp
public class OrderProcessingConsumer : BackgroundService
{
    private readonly IRabbitMQConnection _rabbitConnection;
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<OrderProcessingConsumer> _logger;
    private IModel? _channel;

    public OrderProcessingConsumer(
        IRabbitMQConnection rabbitConnection,
        IServiceProvider serviceProvider,
        ILogger<OrderProcessingConsumer> logger)
    {
        _rabbitConnection = rabbitConnection;
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _channel = _rabbitConnection.GetConnection().CreateModel();

        // Set prefetch count: how many messages to fetch at once
        _channel.BasicQos(
            prefetchSize: 0,
            prefetchCount: 10, // Process 10 messages at a time
            global: false
        );

        var queueName = "order-processing";
        _channel.QueueDeclare(
            queue: queueName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: null
        );

        var consumer = new EventingBasicConsumer(_channel);

        consumer.Received += async (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);

            try
            {
                var order = JsonSerializer.Deserialize<OrderMessage>(message);

                _logger.LogInformation(
                    "Processing order {OrderId}",
                    order?.OrderId
                );

                // Process with scoped services
                using var scope = _serviceProvider.CreateScope();
                var orderService = scope.ServiceProvider.GetRequiredService<IOrderService>();

                await orderService.ProcessOrderAsync(order!, stoppingToken);

                // Acknowledge message (remove from queue)
                _channel.BasicAck(ea.DeliveryTag, multiple: false);

                _logger.LogInformation("Order {OrderId} processed successfully", order?.OrderId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing message: {Message}", message);

                // Reject and requeue (will retry)
                // Use dead-letter queue for poison messages
                _channel.BasicNack(
                    deliveryTag: ea.DeliveryTag,
                    multiple: false,
                    requeue: ea.BasicProperties.Headers?.ContainsKey("x-retry-count") != true
                );
            }
        };

        _channel.BasicConsume(
            queue: queueName,
            autoAck: false, // Manual acknowledgment
            consumer: consumer
        );

        return Task.CompletedTask;
    }

    public override void Dispose()
    {
        _channel?.Close();
        _channel?.Dispose();
        base.Dispose();
    }
}

public record OrderMessage(int OrderId, int UserId, decimal Total);
```

### Dead Letter Queue (DLQ) for Failed Messages

```csharp
public class QueueSetup
{
    public static void ConfigureQueuesWithDLQ(IModel channel)
    {
        var dlqName = "order-processing-dlq";
        var mainQueueName = "order-processing";

        // Create DLQ
        channel.QueueDeclare(
            queue: dlqName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: null
        );

        // Create main queue with DLQ configured
        var args = new Dictionary<string, object>
        {
            { "x-dead-letter-exchange", "" },
            { "x-dead-letter-routing-key", dlqName },
            { "x-message-ttl", 3600000 } // 1 hour TTL
        };

        channel.QueueDeclare(
            queue: mainQueueName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: args
        );
    }
}
```

---

## 3. Idempotency: Critical for Retries

Messages may be delivered more than once. Ensure operations are idempotent.

### Idempotency Key Pattern

```csharp
public class IdempotentOrderService
{
    private readonly IDbConnection _db;
    private readonly ILogger<IdempotentOrderService> _logger;

    public async Task ProcessPaymentAsync(
        PaymentMessage message,
        CancellationToken ct)
    {
        var idempotencyKey = message.IdempotencyKey;

        // Check if already processed
        var existing = await _db.QueryFirstOrDefaultAsync<ProcessedMessage>(
            "SELECT * FROM ProcessedMessages WHERE IdempotencyKey = @Key",
            new { Key = idempotencyKey }
        );

        if (existing != null)
        {
            _logger.LogInformation(
                "Payment {IdempotencyKey} already processed, skipping",
                idempotencyKey
            );
            return;
        }

        // Process payment
        using var transaction = _db.BeginTransaction();
        try
        {
            await ProcessPaymentInternalAsync(message, ct);

            // Mark as processed
            await _db.ExecuteAsync(@"
                INSERT INTO ProcessedMessages (IdempotencyKey, ProcessedAt, MessageData)
                VALUES (@Key, @ProcessedAt, @Data)",
                new
                {
                    Key = idempotencyKey,
                    ProcessedAt = DateTime.UtcNow,
                    Data = JsonSerializer.Serialize(message)
                },
                transaction: transaction
            );

            transaction.Commit();

            _logger.LogInformation("Payment {IdempotencyKey} processed", idempotencyKey);
        }
        catch (Exception ex)
        {
            transaction.Rollback();
            _logger.LogError(ex, "Failed to process payment {IdempotencyKey}", idempotencyKey);
            throw;
        }
    }
}

public record PaymentMessage(
    string IdempotencyKey, // GUID or composite key
    int OrderId,
    decimal Amount
);

// Table schema
/*
CREATE TABLE ProcessedMessages (
    IdempotencyKey NVARCHAR(255) PRIMARY KEY,
    ProcessedAt DATETIME2 NOT NULL,
    MessageData NVARCHAR(MAX) NOT NULL,
    INDEX IX_ProcessedMessages_ProcessedAt (ProcessedAt) -- For cleanup
);
*/
```

---

## 4. Outbox Pattern (Transactional Messaging)

Ensure database changes and message publishing are atomic.

### The Problem

```csharp
// ❌ Race condition: DB commits but message publish fails
await _db.ExecuteAsync("INSERT INTO Orders ...");
await _messagePublisher.PublishAsync("order-created", orderMessage); // Fails = lost event
```

### The Solution: Outbox Pattern

```csharp
public class OutboxMessage
{
    public Guid Id { get; set; }
    public string QueueName { get; set; } = string.Empty;
    public string Payload { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? ProcessedAt { get; set; }
    public int RetryCount { get; set; }
}

public class OrderServiceWithOutbox
{
    private readonly IDbConnection _db;

    public async Task CreateOrderAsync(Order order, CancellationToken ct)
    {
        using var transaction = _db.BeginTransaction();

        try
        {
            // Insert order
            await _db.ExecuteAsync(@"
                INSERT INTO Orders (UserId, Total, Status, CreatedAt)
                VALUES (@UserId, @Total, @Status, @CreatedAt)",
                order,
                transaction: transaction
            );

            // Insert outbox message in same transaction
            var outboxMessage = new OutboxMessage
            {
                Id = Guid.NewGuid(),
                QueueName = "order-created",
                Payload = JsonSerializer.Serialize(new OrderCreatedEvent
                {
                    OrderId = order.Id,
                    UserId = order.UserId,
                    Total = order.Total
                }),
                CreatedAt = DateTime.UtcNow
            };

            await _db.ExecuteAsync(@"
                INSERT INTO OutboxMessages (Id, QueueName, Payload, CreatedAt)
                VALUES (@Id, @QueueName, @Payload, @CreatedAt)",
                outboxMessage,
                transaction: transaction
            );

            transaction.Commit();
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }
}

// Background service to publish outbox messages
public class OutboxPublisher : BackgroundService
{
    private readonly IDbConnection _db;
    private readonly IMessagePublisher _publisher;
    private readonly ILogger<OutboxPublisher> _logger;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                // Fetch unprocessed messages
                var messages = await _db.QueryAsync<OutboxMessage>(@"
                    SELECT TOP 100 * FROM OutboxMessages
                    WHERE ProcessedAt IS NULL AND RetryCount < 5
                    ORDER BY CreatedAt");

                foreach (var message in messages)
                {
                    try
                    {
                        await _publisher.PublishAsync(
                            message.QueueName,
                            message.Payload,
                            stoppingToken
                        );

                        // Mark as processed
                        await _db.ExecuteAsync(@"
                            UPDATE OutboxMessages
                            SET ProcessedAt = @ProcessedAt
                            WHERE Id = @Id",
                            new { ProcessedAt = DateTime.UtcNow, Id = message.Id }
                        );
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to publish outbox message {Id}", message.Id);

                        // Increment retry count
                        await _db.ExecuteAsync(@"
                            UPDATE OutboxMessages
                            SET RetryCount = RetryCount + 1
                            WHERE Id = @Id",
                            new { Id = message.Id }
                        );
                    }
                }

                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in outbox publisher");
                await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
            }
        }
    }
}
```

**Why Outbox Pattern:**
- Atomic: DB write and message enqueue in same transaction
- Reliable: No lost messages
- At-least-once delivery guaranteed

---

## 5. MassTransit: Abstraction Over Message Brokers

Production-ready library with retry, saga, and observability built-in.

### Setup MassTransit with RabbitMQ

```csharp
// Install: MassTransit.RabbitMQ

builder.Services.AddMassTransit(x =>
{
    // Register consumers
    x.AddConsumer<OrderCreatedConsumer>();

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host("localhost", "/", h =>
        {
            h.Username("guest");
            h.Password("guest");
        });

        // Configure retry
        cfg.UseMessageRetry(r => r.Incremental(
            retryLimit: 5,
            initialInterval: TimeSpan.FromSeconds(1),
            intervalIncrement: TimeSpan.FromSeconds(2)
        ));

        // Configure endpoints
        cfg.ConfigureEndpoints(context);
    });
});

// Consumer
public class OrderCreatedConsumer : IConsumer<OrderCreatedEvent>
{
    private readonly ILogger<OrderCreatedConsumer> _logger;
    private readonly IEmailService _emailService;

    public async Task Consume(ConsumeContext<OrderCreatedEvent> context)
    {
        var order = context.Message;

        _logger.LogInformation("Processing order created event: {OrderId}", order.OrderId);

        await _emailService.SendOrderConfirmationAsync(order.OrderId, context.CancellationToken);

        // Message automatically acknowledged on success
        // Automatically retried on exception (per retry policy)
    }
}

// Publisher
public class OrderService
{
    private readonly IPublishEndpoint _publishEndpoint;

    public async Task CreateOrderAsync(Order order, CancellationToken ct)
    {
        // Save to database
        await SaveOrderAsync(order, ct);

        // Publish event
        await _publishEndpoint.Publish(new OrderCreatedEvent
        {
            OrderId = order.Id,
            UserId = order.UserId,
            Total = order.Total
        }, ct);
    }
}
```

---

## Summary: Message Queue Checklist

✅ **In-process queues**: For simple, single-instance scenarios
✅ **RabbitMQ/Kafka**: For distributed, durable message queues
✅ **Idempotency**: All message handlers are idempotent
✅ **Dead letter queues**: For poison messages
✅ **Outbox pattern**: For transactional messaging
✅ **Retry policies**: Exponential backoff, max retries
✅ **Monitoring**: Queue depth, processing time, error rate

**Key Insight:** Async processing via queues is what enables scale. Fast API responses + reliable background processing = happy users + stable system.

**Next:** [Resilience Patterns](./06-resilience-patterns.md) - Handle failures gracefully.
