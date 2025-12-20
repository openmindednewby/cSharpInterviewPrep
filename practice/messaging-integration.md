# Messaging & Integration Practice Exercises

Master message-driven architecture, event-driven patterns, and reliable integration strategies for distributed systems.

---

## Foundational Questions

**Q: Compare RabbitMQ and ZeroMQ for distributing price updates. When would you choose one over the other?**

A: RabbitMQ: brokered, supports persistence, routing, acknowledgments, management UI, plugins. ZeroMQ: brokerless sockets, ultra-low latency but manual patterns, no persistence out of the box. Use RabbitMQ for durable, complex routing, enterprise integration, where administrators need visibility and security. Use ZeroMQ for high-throughput, in-process/edge messaging; avoid if you need persistence or central management.

**Q: Explain how to ensure at-least-once delivery with RabbitMQ while preventing duplicate processing.**

A: Use durable queues, persistent messages, manual ack, idempotent consumers. Enable publisher confirms to ensure the broker persisted the message before acknowledging to the producer.

```csharp
channel.BasicConsume(queue, autoAck: false, consumer);
consumer.Received += (sender, ea) =>
{
    Handle(ea.Body);
    channel.BasicAck(ea.DeliveryTag, multiple: false);
};
```

Use when you can tolerate duplicates; critical to ensure no loss. Avoid when exactly-once semantics required—use transactional outbox + dedup.

**Q: How would you design a saga pattern to coordinate account funding across multiple services?**

A: Orchestrator or choreography; manage compensations (reverse ledger entry, refund payment).

```csharp
public async Task Handle(FundAccount command)
{
    var transferId = await _payments.DebitAsync(command.PaymentId);
    try
    {
        await _ledger.CreditAsync(command.AccountId, command.Amount);
        await _notifications.SendAsync(command.AccountId, "Funding complete");
    }
    catch
    {
        await _payments.RefundAsync(transferId);
        throw;
    }
}
```

Use when multi-step, distributed transactions. Avoid when single system handles all steps—simple ACID transaction suffices.

**Q: Discuss the outbox pattern and how it prevents message loss in event-driven systems.**

A: Write domain event to outbox table within same transaction, then relay to message bus. A background dispatcher polls the outbox table, publishes events, and marks them as processed (with retries and exponential backoff).

```csharp
await using var tx = await db.Database.BeginTransactionAsync();
order.Status = OrderStatus.Accepted;
db.Outbox.Add(new OutboxMessage(order.Id, new OrderAccepted(order.Id)));
await db.SaveChangesAsync();
await tx.CommitAsync();
```

Use when need atomic DB + message publish. Avoid when no shared database or eventual consistency acceptable without duplication.

---

## RabbitMQ Advanced Patterns

**Q: Implement a publisher with confirmation to ensure messages are persisted.**

A: Use publisher confirms for reliability.

```csharp
public class ReliableRabbitMqPublisher
{
    private readonly IConnection _connection;
    private readonly ILogger<ReliableRabbitMqPublisher> _logger;

    public ReliableRabbitMqPublisher(
        ConnectionFactory factory,
        ILogger<ReliableRabbitMqPublisher> logger)
    {
        _connection = factory.CreateConnection();
        _logger = logger;
    }

    public async Task PublishAsync<T>(string exchange, string routingKey, T message)
    {
        using var channel = _connection.CreateModel();

        // Enable publisher confirms
        channel.ConfirmSelect();

        // Declare exchange as durable
        channel.ExchangeDeclare(
            exchange: exchange,
            type: ExchangeType.Topic,
            durable: true,
            autoDelete: false);

        var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));
        var properties = channel.CreateBasicProperties();
        properties.Persistent = true;  // Make message persistent
        properties.MessageId = Guid.NewGuid().ToString();
        properties.Timestamp = new AmqpTimestamp(DateTimeOffset.UtcNow.ToUnixTimeSeconds());

        channel.BasicPublish(
            exchange: exchange,
            routingKey: routingKey,
            basicProperties: properties,
            body: body);

        // Wait for confirmation
        var confirmed = channel.WaitForConfirms(TimeSpan.FromSeconds(5));

        if (!confirmed)
        {
            _logger.LogError("Message {MessageId} was not confirmed by broker", properties.MessageId);
            throw new Exception("Message publish failed - not confirmed");
        }

        _logger.LogInformation("Message {MessageId} published and confirmed", properties.MessageId);
    }

    public async Task PublishBatchAsync<T>(string exchange, string routingKey, List<T> messages)
    {
        using var channel = _connection.CreateModel();
        channel.ConfirmSelect();

        channel.ExchangeDeclare(
            exchange: exchange,
            type: ExchangeType.Topic,
            durable: true,
            autoDelete: false);

        // Publish all messages in batch
        foreach (var message in messages)
        {
            var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));
            var properties = channel.CreateBasicProperties();
            properties.Persistent = true;
            properties.MessageId = Guid.NewGuid().ToString();

            channel.BasicPublish(
                exchange: exchange,
                routingKey: routingKey,
                basicProperties: properties,
                body: body);
        }

        // Wait for all confirms
        channel.WaitForConfirmsOrDie(TimeSpan.FromSeconds(30));
        _logger.LogInformation("Batch of {Count} messages published and confirmed", messages.Count);
    }
}
```

**Q: Implement a resilient consumer with retry logic and dead letter queue.**

A: Handle failures with retries and DLQ.

```csharp
public class ResilientRabbitMqConsumer
{
    private readonly IConnection _connection;
    private readonly ILogger<ResilientRabbitMqConsumer> _logger;

    public void StartConsuming<T>(
        string queueName,
        Func<T, Task> messageHandler,
        int maxRetries = 3)
    {
        var channel = _connection.CreateModel();

        // Declare main queue
        var mainQueueArgs = new Dictionary<string, object>
        {
            { "x-dead-letter-exchange", $"{queueName}.dlx" },
            { "x-dead-letter-routing-key", $"{queueName}.dlq" }
        };

        channel.QueueDeclare(
            queue: queueName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: mainQueueArgs);

        // Declare dead letter exchange and queue
        channel.ExchangeDeclare($"{queueName}.dlx", ExchangeType.Direct, durable: true);
        channel.QueueDeclare($"{queueName}.dlq", durable: true, exclusive: false, autoDelete: false);
        channel.QueueBind($"{queueName}.dlq", $"{queueName}.dlx", $"{queueName}.dlq");

        // Declare retry queue with TTL
        var retryQueueArgs = new Dictionary<string, object>
        {
            { "x-dead-letter-exchange", "" },  // Default exchange
            { "x-dead-letter-routing-key", queueName },
            { "x-message-ttl", 5000 }  // 5 second delay
        };

        channel.QueueDeclare(
            queue: $"{queueName}.retry",
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: retryQueueArgs);

        var consumer = new EventingBasicConsumer(channel);
        consumer.Received += async (sender, ea) =>
        {
            try
            {
                var body = Encoding.UTF8.GetString(ea.Body.ToArray());
                var message = JsonSerializer.Deserialize<T>(body);

                await messageHandler(message);

                // Success - acknowledge
                channel.BasicAck(ea.DeliveryTag, multiple: false);
                _logger.LogInformation("Message {MessageId} processed successfully", ea.BasicProperties.MessageId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing message {MessageId}", ea.BasicProperties.MessageId);

                // Check retry count
                var retryCount = GetRetryCount(ea.BasicProperties);

                if (retryCount < maxRetries)
                {
                    // Send to retry queue
                    _logger.LogInformation(
                        "Retrying message {MessageId} (attempt {Attempt}/{MaxRetries})",
                        ea.BasicProperties.MessageId,
                        retryCount + 1,
                        maxRetries);

                    var retryProperties = channel.CreateBasicProperties();
                    retryProperties.Persistent = true;
                    retryProperties.MessageId = ea.BasicProperties.MessageId;
                    retryProperties.Headers = ea.BasicProperties.Headers ?? new Dictionary<string, object>();
                    retryProperties.Headers["x-retry-count"] = retryCount + 1;

                    channel.BasicPublish(
                        exchange: "",
                        routingKey: $"{queueName}.retry",
                        basicProperties: retryProperties,
                        body: ea.Body);

                    channel.BasicAck(ea.DeliveryTag, multiple: false);
                }
                else
                {
                    // Max retries exceeded - reject to DLQ
                    _logger.LogError(
                        "Message {MessageId} exceeded max retries, sending to DLQ",
                        ea.BasicProperties.MessageId);

                    channel.BasicReject(ea.DeliveryTag, requeue: false);
                }
            }
        };

        channel.BasicConsume(
            queue: queueName,
            autoAck: false,
            consumer: consumer);

        _logger.LogInformation("Started consuming from queue: {QueueName}", queueName);
    }

    private int GetRetryCount(IBasicProperties properties)
    {
        if (properties.Headers != null &&
            properties.Headers.TryGetValue("x-retry-count", out var value))
        {
            return Convert.ToInt32(value);
        }
        return 0;
    }
}
```

**Q: Implement priority queue pattern for urgent messages.**

A: Use RabbitMQ priority queues.

```csharp
public class PriorityQueuePublisher
{
    private readonly IModel _channel;

    public PriorityQueuePublisher(IConnection connection)
    {
        _channel = connection.CreateModel();

        // Declare priority queue
        var args = new Dictionary<string, object>
        {
            { "x-max-priority", 10 }
        };

        _channel.QueueDeclare(
            queue: "orders.priority",
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: args);
    }

    public void PublishOrder(Order order, int priority)
    {
        var properties = _channel.CreateBasicProperties();
        properties.Persistent = true;
        properties.Priority = (byte)Math.Min(priority, 10);  // 0-10 range

        var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(order));

        _channel.BasicPublish(
            exchange: "",
            routingKey: "orders.priority",
            basicProperties: properties,
            body: body);
    }
}

// Usage
publisher.PublishOrder(urgentOrder, priority: 10);    // High priority
publisher.PublishOrder(normalOrder, priority: 5);     // Normal priority
publisher.PublishOrder(bulkOrder, priority: 1);       // Low priority
```

---

## Kafka Integration

**Q: Implement Kafka producer with idempotent writes and transactions.**

A: Use Kafka transactional producer.

```csharp
public class TransactionalKafkaProducer
{
    private readonly IProducer<string, string> _producer;
    private readonly ILogger<TransactionalKafkaProducer> _logger;

    public TransactionalKafkaProducer(IConfiguration configuration, ILogger<TransactionalKafkaProducer> logger)
    {
        var config = new ProducerConfig
        {
            BootstrapServers = configuration["Kafka:BootstrapServers"],
            TransactionalId = $"producer-{Guid.NewGuid()}",
            EnableIdempotence = true,  // Exactly-once semantics
            Acks = Acks.All,           // Wait for all replicas
            MaxInFlight = 5,
            MessageSendMaxRetries = 10,
            RetryBackoffMs = 100
        };

        _producer = new ProducerBuilder<string, string>(config).Build();
        _producer.InitTransactions(TimeSpan.FromSeconds(30));
        _logger = logger;
    }

    public async Task PublishInTransactionAsync(
        Dictionary<string, List<Message<string, string>>> messagesByTopic)
    {
        _producer.BeginTransaction();

        try
        {
            var deliveryTasks = new List<Task<DeliveryResult<string, string>>>();

            foreach (var (topic, messages) in messagesByTopic)
            {
                foreach (var message in messages)
                {
                    var task = _producer.ProduceAsync(topic, message);
                    deliveryTasks.Add(task);
                }
            }

            // Wait for all messages to be sent
            var results = await Task.WhenAll(deliveryTasks);

            _producer.CommitTransaction();

            _logger.LogInformation("Transaction committed with {Count} messages", results.Length);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Transaction failed, aborting");
            _producer.AbortTransaction();
            throw;
        }
    }

    public void Dispose()
    {
        _producer?.Dispose();
    }
}
```

**Q: Implement Kafka consumer with manual offset management and exactly-once processing.**

A: Use consumer with manual commit and idempotency.

```csharp
public class ExactlyOnceKafkaConsumer
{
    private readonly IConsumer<string, string> _consumer;
    private readonly DbContext _dbContext;
    private readonly ILogger<ExactlyOnceKafkaConsumer> _logger;

    public ExactlyOnceKafkaConsumer(
        IConfiguration configuration,
        DbContext dbContext,
        ILogger<ExactlyOnceKafkaConsumer> logger)
    {
        var config = new ConsumerConfig
        {
            BootstrapServers = configuration["Kafka:BootstrapServers"],
            GroupId = configuration["Kafka:ConsumerGroup"],
            EnableAutoCommit = false,  // Manual commit
            AutoOffsetReset = AutoOffsetReset.Earliest,
            IsolationLevel = IsolationLevel.ReadCommitted  // Only read committed messages
        };

        _consumer = new ConsumerBuilder<string, string>(config).Build();
        _dbContext = dbContext;
        _logger = logger;
    }

    public async Task StartConsumingAsync(
        string topic,
        Func<string, Task> messageHandler,
        CancellationToken cancellationToken)
    {
        _consumer.Subscribe(topic);

        while (!cancellationToken.IsCancellationRequested)
        {
            try
            {
                var consumeResult = _consumer.Consume(cancellationToken);

                // Check if already processed (idempotency)
                var messageId = consumeResult.Message.Key;
                var alreadyProcessed = await _dbContext.ProcessedMessages
                    .AnyAsync(m => m.MessageId == messageId, cancellationToken);

                if (alreadyProcessed)
                {
                    _logger.LogInformation("Message {MessageId} already processed, skipping", messageId);
                    _consumer.Commit(consumeResult);
                    continue;
                }

                await using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);

                try
                {
                    // Process message
                    await messageHandler(consumeResult.Message.Value);

                    // Record processed message
                    _dbContext.ProcessedMessages.Add(new ProcessedMessage
                    {
                        MessageId = messageId,
                        ProcessedAt = DateTime.UtcNow,
                        Partition = consumeResult.Partition.Value,
                        Offset = consumeResult.Offset.Value
                    });

                    await _dbContext.SaveChangesAsync(cancellationToken);
                    await transaction.CommitAsync(cancellationToken);

                    // Commit offset to Kafka
                    _consumer.Commit(consumeResult);

                    _logger.LogInformation(
                        "Processed message {MessageId} at offset {Offset}",
                        messageId,
                        consumeResult.Offset.Value);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing message {MessageId}", messageId);
                    await transaction.RollbackAsync(cancellationToken);
                    throw;
                }
            }
            catch (ConsumeException ex)
            {
                _logger.LogError(ex, "Kafka consume error");
            }
        }
    }
}
```

**Q: Implement Kafka consumer group rebalancing with state management.**

A: Handle partition assignment and revocation.

```csharp
public class StatefulKafkaConsumer
{
    private readonly IConsumer<string, string> _consumer;
    private readonly Dictionary<int, long> _partitionOffsets = new();
    private readonly ILogger<StatefulKafkaConsumer> _logger;

    public StatefulKafkaConsumer(IConfiguration configuration, ILogger<StatefulKafkaConsumer> logger)
    {
        var config = new ConsumerConfig
        {
            BootstrapServers = configuration["Kafka:BootstrapServers"],
            GroupId = configuration["Kafka:ConsumerGroup"],
            EnableAutoCommit = false
        };

        _consumer = new ConsumerBuilder<string, string>(config)
            .SetPartitionsAssignedHandler(OnPartitionsAssigned)
            .SetPartitionsRevokedHandler(OnPartitionsRevoked)
            .Build();

        _logger = logger;
    }

    private void OnPartitionsAssigned(
        IConsumer<string, string> consumer,
        List<TopicPartition> partitions)
    {
        _logger.LogInformation("Partitions assigned: {Partitions}",
            string.Join(", ", partitions.Select(p => p.Partition.Value)));

        // Load state for assigned partitions
        foreach (var partition in partitions)
        {
            // Could load from database, cache, etc.
            _partitionOffsets[partition.Partition.Value] = 0;
        }
    }

    private void OnPartitionsRevoked(
        IConsumer<string, string> consumer,
        List<TopicPartitionOffset> partitions)
    {
        _logger.LogInformation("Partitions revoked: {Partitions}",
            string.Join(", ", partitions.Select(p => p.Partition.Value)));

        // Save state before losing partitions
        foreach (var partition in partitions)
        {
            var offset = _partitionOffsets.GetValueOrDefault(partition.Partition.Value);
            _logger.LogInformation("Saving offset {Offset} for partition {Partition}",
                offset, partition.Partition.Value);

            // Could save to database, cache, etc.
        }

        // Commit offsets before rebalance
        consumer.Commit(partitions);

        // Clear local state
        foreach (var partition in partitions)
        {
            _partitionOffsets.Remove(partition.Partition.Value);
        }
    }
}
```

---

## Saga Pattern

**Q: Implement orchestration-based saga for order processing.**

A: Centralized orchestrator manages saga flow.

```csharp
public class OrderSagaOrchestrator
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IMessageBus _messageBus;
    private readonly ISagaRepository _sagaRepository;
    private readonly ILogger<OrderSagaOrchestrator> _logger;

    public async Task<Guid> StartSagaAsync(CreateOrderCommand command)
    {
        var sagaId = Guid.NewGuid();
        var saga = new OrderSaga
        {
            Id = sagaId,
            State = SagaState.Started,
            Command = command,
            CreatedAt = DateTime.UtcNow
        };

        await _sagaRepository.SaveAsync(saga);

        // Start saga execution
        await ExecuteSagaStepAsync(sagaId, OrderSagaStep.ReserveInventory);

        return sagaId;
    }

    private async Task ExecuteSagaStepAsync(Guid sagaId, OrderSagaStep step)
    {
        var saga = await _sagaRepository.GetAsync(sagaId);

        try
        {
            switch (step)
            {
                case OrderSagaStep.ReserveInventory:
                    await ReserveInventoryAsync(saga);
                    saga.CurrentStep = OrderSagaStep.ProcessPayment;
                    await ExecuteSagaStepAsync(sagaId, OrderSagaStep.ProcessPayment);
                    break;

                case OrderSagaStep.ProcessPayment:
                    await ProcessPaymentAsync(saga);
                    saga.CurrentStep = OrderSagaStep.CreateShipment;
                    await ExecuteSagaStepAsync(sagaId, OrderSagaStep.CreateShipment);
                    break;

                case OrderSagaStep.CreateShipment:
                    await CreateShipmentAsync(saga);
                    saga.State = SagaState.Completed;
                    await _sagaRepository.SaveAsync(saga);
                    await _messageBus.PublishAsync(new OrderSagaCompletedEvent { SagaId = sagaId });
                    break;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Saga step {Step} failed for saga {SagaId}", step, sagaId);
            saga.State = SagaState.Compensating;
            await _sagaRepository.SaveAsync(saga);
            await CompensateSagaAsync(sagaId, step);
        }
    }

    private async Task CompensateSagaAsync(Guid sagaId, OrderSagaStep failedStep)
    {
        var saga = await _sagaRepository.GetAsync(sagaId);

        _logger.LogWarning("Starting compensation for saga {SagaId} at step {Step}", sagaId, failedStep);

        // Compensate in reverse order
        switch (failedStep)
        {
            case OrderSagaStep.CreateShipment:
                await CancelPaymentAsync(saga);
                goto case OrderSagaStep.ProcessPayment;

            case OrderSagaStep.ProcessPayment:
                await ReleaseInventoryAsync(saga);
                break;
        }

        saga.State = SagaState.Compensated;
        await _sagaRepository.SaveAsync(saga);
        await _messageBus.PublishAsync(new OrderSagaFailedEvent { SagaId = sagaId });
    }

    private async Task ReserveInventoryAsync(OrderSaga saga)
    {
        using var scope = _serviceProvider.CreateScope();
        var inventoryService = scope.ServiceProvider.GetRequiredService<IInventoryService>();

        saga.ReservationId = await inventoryService.ReserveAsync(
            saga.Command.Items,
            TimeSpan.FromMinutes(10));

        await _sagaRepository.SaveAsync(saga);
    }

    private async Task ReleaseInventoryAsync(OrderSaga saga)
    {
        if (saga.ReservationId.HasValue)
        {
            using var scope = _serviceProvider.CreateScope();
            var inventoryService = scope.ServiceProvider.GetRequiredService<IInventoryService>();
            await inventoryService.ReleaseAsync(saga.ReservationId.Value);
        }
    }

    private async Task ProcessPaymentAsync(OrderSaga saga)
    {
        using var scope = _serviceProvider.CreateScope();
        var paymentService = scope.ServiceProvider.GetRequiredService<IPaymentService>();

        saga.PaymentId = await paymentService.ChargeAsync(
            saga.Command.CustomerId,
            saga.Command.TotalAmount);

        await _sagaRepository.SaveAsync(saga);
    }

    private async Task CancelPaymentAsync(OrderSaga saga)
    {
        if (saga.PaymentId.HasValue)
        {
            using var scope = _serviceProvider.CreateScope();
            var paymentService = scope.ServiceProvider.GetRequiredService<IPaymentService>();
            await paymentService.RefundAsync(saga.PaymentId.Value);
        }
    }

    private async Task CreateShipmentAsync(OrderSaga saga)
    {
        using var scope = _serviceProvider.CreateScope();
        var shippingService = scope.ServiceProvider.GetRequiredService<IShippingService>();

        saga.ShipmentId = await shippingService.CreateShipmentAsync(
            saga.Id,
            saga.Command.ShippingAddress);

        await _sagaRepository.SaveAsync(saga);
    }
}

public class OrderSaga
{
    public Guid Id { get; set; }
    public SagaState State { get; set; }
    public OrderSagaStep CurrentStep { get; set; }
    public CreateOrderCommand Command { get; set; }
    public Guid? ReservationId { get; set; }
    public Guid? PaymentId { get; set; }
    public Guid? ShipmentId { get; set; }
    public DateTime CreatedAt { get; set; }
}

public enum SagaState
{
    Started,
    Compensating,
    Compensated,
    Completed
}

public enum OrderSagaStep
{
    ReserveInventory,
    ProcessPayment,
    CreateShipment
}
```

**Q: Implement choreography-based saga using events.**

A: Decentralized saga coordination through events.

```csharp
// Each service publishes events and listens for relevant events

// Inventory Service
public class InventoryService
{
    private readonly IMessageBus _messageBus;

    public async Task HandleOrderCreatedAsync(OrderCreatedEvent evt)
    {
        try
        {
            var reservationId = await ReserveInventoryAsync(evt.Items);

            await _messageBus.PublishAsync(new InventoryReservedEvent
            {
                OrderId = evt.OrderId,
                ReservationId = reservationId,
                Items = evt.Items
            });
        }
        catch (Exception ex)
        {
            await _messageBus.PublishAsync(new InventoryReservationFailedEvent
            {
                OrderId = evt.OrderId,
                Reason = ex.Message
            });
        }
    }

    public async Task HandlePaymentFailedAsync(PaymentFailedEvent evt)
    {
        // Compensate: release inventory
        await ReleaseInventoryAsync(evt.ReservationId);

        await _messageBus.PublishAsync(new InventoryReleasedEvent
        {
            OrderId = evt.OrderId,
            ReservationId = evt.ReservationId
        });
    }
}

// Payment Service
public class PaymentService
{
    private readonly IMessageBus _messageBus;

    public async Task HandleInventoryReservedAsync(InventoryReservedEvent evt)
    {
        try
        {
            var paymentId = await ProcessPaymentAsync(evt.OrderId);

            await _messageBus.PublishAsync(new PaymentProcessedEvent
            {
                OrderId = evt.OrderId,
                PaymentId = paymentId,
                ReservationId = evt.ReservationId
            });
        }
        catch (Exception ex)
        {
            await _messageBus.PublishAsync(new PaymentFailedEvent
            {
                OrderId = evt.OrderId,
                ReservationId = evt.ReservationId,
                Reason = ex.Message
            });
        }
    }

    public async Task HandleShipmentFailedAsync(ShipmentFailedEvent evt)
    {
        // Compensate: refund payment
        await RefundPaymentAsync(evt.PaymentId);

        await _messageBus.PublishAsync(new PaymentRefundedEvent
        {
            OrderId = evt.OrderId,
            PaymentId = evt.PaymentId
        });
    }
}

// Shipping Service
public class ShippingService
{
    private readonly IMessageBus _messageBus;

    public async Task HandlePaymentProcessedAsync(PaymentProcessedEvent evt)
    {
        try
        {
            var shipmentId = await CreateShipmentAsync(evt.OrderId);

            await _messageBus.PublishAsync(new ShipmentCreatedEvent
            {
                OrderId = evt.OrderId,
                ShipmentId = shipmentId,
                PaymentId = evt.PaymentId
            });
        }
        catch (Exception ex)
        {
            await _messageBus.PublishAsync(new ShipmentFailedEvent
            {
                OrderId = evt.OrderId,
                PaymentId = evt.PaymentId,
                Reason = ex.Message
            });
        }
    }
}

// Order Service - tracks overall saga state
public class OrderService
{
    public async Task HandleShipmentCreatedAsync(ShipmentCreatedEvent evt)
    {
        // Saga completed successfully
        await UpdateOrderStatusAsync(evt.OrderId, OrderStatus.Shipped);
    }

    public async Task HandleInventoryReservationFailedAsync(InventoryReservationFailedEvent evt)
    {
        // Saga failed at first step
        await UpdateOrderStatusAsync(evt.OrderId, OrderStatus.Cancelled);
    }

    public async Task HandlePaymentRefundedAsync(PaymentRefundedEvent evt)
    {
        // Saga fully compensated
        await UpdateOrderStatusAsync(evt.OrderId, OrderStatus.Cancelled);
    }
}
```

---

## Outbox Pattern

**Q: Implement transactional outbox pattern with background processor.**

A: Ensure atomic database updates and message publishing.

```csharp
// Outbox entity
public class OutboxMessage
{
    public Guid Id { get; set; }
    public string AggregateId { get; set; }
    public string EventType { get; set; }
    public string Payload { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ProcessedAt { get; set; }
    public int RetryCount { get; set; }
    public string Error { get; set; }
}

// Domain event handler
public class OrderCommandHandler
{
    private readonly DbContext _dbContext;

    public async Task HandleCreateOrderAsync(CreateOrderCommand command)
    {
        await using var transaction = await _dbContext.Database.BeginTransactionAsync();

        try
        {
            // 1. Update domain entities
            var order = new Order
            {
                Id = Guid.NewGuid(),
                CustomerId = command.CustomerId,
                Items = command.Items,
                Status = OrderStatus.Pending
            };

            _dbContext.Orders.Add(order);

            // 2. Write to outbox
            var orderCreatedEvent = new OrderCreatedEvent
            {
                OrderId = order.Id,
                CustomerId = order.CustomerId,
                Items = order.Items
            };

            var outboxMessage = new OutboxMessage
            {
                Id = Guid.NewGuid(),
                AggregateId = order.Id.ToString(),
                EventType = nameof(OrderCreatedEvent),
                Payload = JsonSerializer.Serialize(orderCreatedEvent),
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.OutboxMessages.Add(outboxMessage);

            // 3. Commit transaction (atomic!)
            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}

// Background outbox processor
public class OutboxProcessor : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<OutboxProcessor> _logger;
    private readonly TimeSpan _processingInterval = TimeSpan.FromSeconds(5);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Outbox Processor started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessOutboxMessagesAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing outbox messages");
            }

            await Task.Delay(_processingInterval, stoppingToken);
        }
    }

    private async Task ProcessOutboxMessagesAsync(CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<DbContext>();
        var messageBus = scope.ServiceProvider.GetRequiredService<IMessageBus>();

        // Get unprocessed messages
        var messages = await dbContext.OutboxMessages
            .Where(m => m.ProcessedAt == null && m.RetryCount < 5)
            .OrderBy(m => m.CreatedAt)
            .Take(100)
            .ToListAsync(cancellationToken);

        foreach (var message in messages)
        {
            try
            {
                // Publish to message bus
                await messageBus.PublishRawAsync(
                    message.EventType,
                    message.Payload,
                    cancellationToken);

                // Mark as processed
                message.ProcessedAt = DateTime.UtcNow;

                _logger.LogInformation(
                    "Published outbox message {MessageId} of type {EventType}",
                    message.Id,
                    message.EventType);
            }
            catch (Exception ex)
            {
                message.RetryCount++;
                message.Error = ex.Message;

                _logger.LogError(
                    ex,
                    "Failed to publish outbox message {MessageId} (retry {RetryCount})",
                    message.Id,
                    message.RetryCount);
            }
        }

        if (messages.Any())
        {
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
```

---

## Idempotency

**Q: Implement idempotency using distributed cache.**

A: Track processed requests to prevent duplicates.

```csharp
public class IdempotencyMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IDistributedCache _cache;
    private readonly ILogger<IdempotencyMiddleware> _logger;

    public async Task InvokeAsync(HttpContext context)
    {
        // Only handle POST/PUT/PATCH
        if (context.Request.Method != "POST" &&
            context.Request.Method != "PUT" &&
            context.Request.Method != "PATCH")
        {
            await _next(context);
            return;
        }

        // Get idempotency key
        if (!context.Request.Headers.TryGetValue("Idempotency-Key", out var idempotencyKey) ||
            string.IsNullOrEmpty(idempotencyKey))
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            await context.Response.WriteAsJsonAsync(new { error = "Idempotency-Key header required" });
            return;
        }

        var cacheKey = $"idempotency:{idempotencyKey}";

        // Check if request already processed
        var cachedResponse = await _cache.GetStringAsync(cacheKey);
        if (cachedResponse != null)
        {
            _logger.LogInformation("Returning cached response for idempotency key: {Key}", idempotencyKey);

            var response = JsonSerializer.Deserialize<IdempotentResponse>(cachedResponse);
            context.Response.StatusCode = response.StatusCode;
            context.Response.ContentType = "application/json";

            foreach (var header in response.Headers)
            {
                context.Response.Headers[header.Key] = header.Value;
            }

            await context.Response.WriteAsync(response.Body);
            return;
        }

        // Acquire lock to prevent concurrent processing
        var lockKey = $"{cacheKey}:lock";
        var lockAcquired = await TryAcquireLockAsync(lockKey, TimeSpan.FromSeconds(30));

        if (!lockAcquired)
        {
            context.Response.StatusCode = StatusCodes.Status409Conflict;
            await context.Response.WriteAsJsonAsync(new
            {
                error = "Request with this idempotency key is currently being processed"
            });
            return;
        }

        try
        {
            // Capture response
            var originalBodyStream = context.Response.Body;
            using var responseBody = new MemoryStream();
            context.Response.Body = responseBody;

            await _next(context);

            // Cache successful response
            if (context.Response.StatusCode >= 200 && context.Response.StatusCode < 300)
            {
                responseBody.Seek(0, SeekOrigin.Begin);
                var body = await new StreamReader(responseBody).ReadToEndAsync();
                responseBody.Seek(0, SeekOrigin.Begin);

                var idempotentResponse = new IdempotentResponse
                {
                    StatusCode = context.Response.StatusCode,
                    Headers = context.Response.Headers.ToDictionary(h => h.Key, h => h.Value.ToString()),
                    Body = body
                };

                await _cache.SetStringAsync(
                    cacheKey,
                    JsonSerializer.Serialize(idempotentResponse),
                    new DistributedCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(24)
                    });
            }

            await responseBody.CopyToAsync(originalBodyStream);
        }
        finally
        {
            await ReleaseLockAsync(lockKey);
        }
    }

    private async Task<bool> TryAcquireLockAsync(string lockKey, TimeSpan timeout)
    {
        var expiry = DateTime.UtcNow.Add(timeout);

        while (DateTime.UtcNow < expiry)
        {
            var acquired = await _cache.GetStringAsync(lockKey) == null;
            if (acquired)
            {
                await _cache.SetStringAsync(lockKey, "locked", new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = timeout
                });
                return true;
            }

            await Task.Delay(100);
        }

        return false;
    }

    private async Task ReleaseLockAsync(string lockKey)
    {
        await _cache.RemoveAsync(lockKey);
    }

    private class IdempotentResponse
    {
        public int StatusCode { get; set; }
        public Dictionary<string, string> Headers { get; set; }
        public string Body { get; set; }
    }
}
```

---

## Event Streaming

**Q: Implement event store with snapshots for performance.**

A: Optimize event replay with periodic snapshots.

```csharp
public class EventStoreWithSnapshots
{
    private readonly DbContext _dbContext;
    private readonly int _snapshotInterval = 100; // Snapshot every 100 events

    public async Task<T> LoadAggregateAsync<T>(Guid aggregateId) where T : Aggregate, new()
    {
        // Try to load latest snapshot
        var snapshot = await _dbContext.Snapshots
            .Where(s => s.AggregateId == aggregateId)
            .OrderByDescending(s => s.Version)
            .FirstOrDefaultAsync();

        T aggregate;
        long fromVersion;

        if (snapshot != null)
        {
            // Deserialize snapshot
            aggregate = JsonSerializer.Deserialize<T>(snapshot.Data);
            fromVersion = snapshot.Version + 1;
        }
        else
        {
            aggregate = new T();
            fromVersion = 0;
        }

        // Load events after snapshot
        var events = await _dbContext.Events
            .Where(e => e.AggregateId == aggregateId && e.Version >= fromVersion)
            .OrderBy(e => e.Version)
            .ToListAsync();

        foreach (var eventRecord in events)
        {
            var @event = DeserializeEvent(eventRecord);
            aggregate.ApplyEvent(@event);
        }

        return aggregate;
    }

    public async Task SaveAggregateAsync<T>(T aggregate) where T : Aggregate
    {
        var uncommittedEvents = aggregate.GetUncommittedEvents();

        foreach (var @event in uncommittedEvents)
        {
            _dbContext.Events.Add(new EventRecord
            {
                AggregateId = aggregate.Id,
                EventType = @event.GetType().Name,
                Data = JsonSerializer.Serialize(@event),
                Version = @event.Version,
                Timestamp = @event.Timestamp
            });
        }

        await _dbContext.SaveChangesAsync();

        // Check if snapshot needed
        if (aggregate.Version % _snapshotInterval == 0)
        {
            await CreateSnapshotAsync(aggregate);
        }

        aggregate.MarkEventsAsCommitted();
    }

    private async Task CreateSnapshotAsync<T>(T aggregate) where T : Aggregate
    {
        var snapshot = new SnapshotRecord
        {
            AggregateId = aggregate.Id,
            AggregateType = typeof(T).Name,
            Version = aggregate.Version,
            Data = JsonSerializer.Serialize(aggregate),
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Snapshots.Add(snapshot);
        await _dbContext.SaveChangesAsync();

        // Clean up old snapshots (keep last 3)
        var oldSnapshots = await _dbContext.Snapshots
            .Where(s => s.AggregateId == aggregate.Id)
            .OrderByDescending(s => s.Version)
            .Skip(3)
            .ToListAsync();

        _dbContext.Snapshots.RemoveRange(oldSnapshots);
        await _dbContext.SaveChangesAsync();
    }
}
```

---

## Advanced Messaging Scenarios

**Q: How do you handle poison messages without blocking a queue?**

A: Use a dead letter queue (DLQ) and track retry attempts via headers.

```csharp
if (retryCount >= 5)
{
    await _dlqPublisher.PublishAsync(message);
    return;
}
```

**Q: Describe an idempotency strategy for message consumers.**

A: Use an idempotency key table with unique constraint and short TTL for cleanup.

```sql
CREATE TABLE message_dedup (
    message_id TEXT PRIMARY KEY,
    processed_at TIMESTAMP NOT NULL
);
```

**Q: How would you preserve ordering for a specific key in Kafka?**

A: Use the key as the partition key and run a single consumer per partition.

**Q: How do you evolve a message schema safely?**

A: Use backward-compatible changes, versioned fields, and schema registry validation. Avoid breaking field removals.

**Q: Implement a retry policy with exponential backoff and max delay.**

A: Increase delay per attempt and cap the maximum delay.

```csharp
var delayMs = Math.Min(30_000, 200 * (int)Math.Pow(2, attempt));
await Task.Delay(delayMs, ct);
```

---

**Total Exercises: 35+**

Master messaging patterns for building resilient, event-driven distributed systems!
