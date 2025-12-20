# System Design Practice Exercises

Master distributed systems architecture, scalability patterns, and real-world system design for trading and financial applications.

---

## Foundational Questions

**Q: Design a service that ingests MT5 tick data, normalizes it, caches latest prices, and exposes them via REST/WebSocket.**

A: Components: Ingestion (connectors to MT5), normalization workers, cache (Redis), API (REST/WebSocket), persistence. Add replay storage (Kafka topic or time-series DB) for audit and late subscribers. Use message queue (Kafka) for fan-out and resilient decoupling of ingestion from delivery.

```csharp
while (await mt5Stream.MoveNextAsync())
{
    var normalized = Normalize(mt5Stream.Current);
    await cache.SetAsync(normalized.Symbol, normalized.Price);
    await hubContext.Clients.Group(normalized.Symbol)
        .SendAsync("price", normalized);
}
```

Use when need low-latency price dissemination. Avoid when low-frequency batch updates suffice.

**Q: Design an API that receives orders, validates, routes to MT4/MT5, and confirms execution. Include failure recovery.**

A: Steps: receive REST order → validate (risk, compliance) → persist pending state → route to MT4/MT5 → await ack → publish result. Include idempotency keys on inbound requests and a reconciliation process for missing confirmations. Use saga/outbox for reliability and to coordinate compensating actions when downstream legs fail.

```csharp
public async Task<IActionResult> Submit(OrderRequest dto)
{
    var order = await _validator.ValidateAsync(dto);
    await _repository.SavePending(order);
    var result = await _mtGateway.SendAsync(order);
    await _repository.UpdateStatus(order.Id, result.Status);
    await _bus.Publish(new OrderStatusChanged(order.Id, result.Status));
    return Ok(result);
}
```

Use when real-time trading with external platforms. Avoid when simple internal workflows—overkill.

**Q: Architect a system to collect metrics from trading microservices and alert on anomalies.**

A: Collect metrics via OpenTelemetry exporters, push to time-series DB (Prometheus), visualize in Grafana, alert via Alertmanager. Tag metrics with dimensions (service, region, environment) to support slicing and alert thresholds. Include streaming logs via ELK stack and trace sampling via Jaeger/Tempo.

```csharp
var meter = new Meter("Trading.Services");
var orderLatency = meter.CreateHistogram<double>("order_latency_ms");
orderLatency.Record(latencyMs, KeyValuePair.Create<string, object?>("service", serviceName));
```

Use when need proactive observability. Avoid when prototype with low SLA.

**Q: Discuss how you would integrate an external risk management engine into an existing microservices ecosystem.**

A: Use async messaging or REST; maintain schema adapters; ensure idempotency. Map risk statuses to domain-specific responses and version contracts to avoid breaking changes. Add caching for rules, circuit breakers, fallback decisions, and health checks to remove unhealthy nodes from rotation.

```csharp
var riskResponse = await _riskClient.EvaluateAsync(order, ct);
if (!riskResponse.Approved)
    return OrderDecision.Rejected(riskResponse.Reason);
```

Use when external compliance requirement. Avoid when latency-critical path can't tolerate external dependency—consider in-process rules.

---

## Microservices Architecture

**Q: Design a microservices architecture for an e-commerce platform with orders, inventory, payments, and shipping.**

A: Break into bounded contexts with clear ownership and data isolation.

```
Architecture Components:
1. API Gateway (YARP, Ocelot, or Kong)
   - Authentication/Authorization
   - Rate limiting
   - Request routing
   - Response aggregation

2. Order Service
   - Order placement
   - Order status tracking
   - Saga orchestration
   - Database: Orders, OrderItems

3. Inventory Service
   - Stock management
   - Reservation system
   - Database: Products, Stock

4. Payment Service
   - Payment processing
   - Refunds
   - Database: Transactions

5. Shipping Service
   - Shipping label generation
   - Tracking
   - Database: Shipments

6. Notification Service
   - Email/SMS notifications
   - Event-driven (consumes from message bus)

7. Infrastructure
   - Message Bus: RabbitMQ/Kafka
   - Cache: Redis
   - Service Discovery: Consul/Kubernetes
   - Config: Consul/Azure App Config
   - Observability: Prometheus + Grafana + Jaeger
```

**Example Saga Implementation:**

```csharp
public class OrderSaga
{
    private readonly IInventoryService _inventory;
    private readonly IPaymentService _payment;
    private readonly IShippingService _shipping;
    private readonly IMessageBus _bus;

    public async Task<OrderResult> ProcessOrderAsync(CreateOrderCommand command)
    {
        var orderId = Guid.NewGuid();
        var reservationId = Guid.Empty;
        var paymentId = Guid.Empty;

        try
        {
            // Step 1: Reserve inventory
            reservationId = await _inventory.ReserveAsync(
                command.Items,
                TimeSpan.FromMinutes(10));

            // Step 2: Process payment
            paymentId = await _payment.ChargeAsync(
                command.CustomerId,
                command.TotalAmount);

            // Step 3: Create shipment
            var shipmentId = await _shipping.CreateShipmentAsync(
                orderId,
                command.ShippingAddress);

            // Step 4: Complete order
            await _bus.PublishAsync(new OrderCompletedEvent
            {
                OrderId = orderId,
                PaymentId = paymentId,
                ShipmentId = shipmentId
            });

            return OrderResult.Success(orderId);
        }
        catch (Exception ex)
        {
            // Compensating transactions
            if (paymentId != Guid.Empty)
            {
                await _payment.RefundAsync(paymentId);
            }

            if (reservationId != Guid.Empty)
            {
                await _inventory.ReleaseReservationAsync(reservationId);
            }

            await _bus.PublishAsync(new OrderFailedEvent
            {
                OrderId = orderId,
                Reason = ex.Message
            });

            return OrderResult.Failed(ex.Message);
        }
    }
}
```

**Q: Design service-to-service communication strategy: when to use sync vs async?**

A: Choose based on coupling, latency, and failure tolerance requirements.

```csharp
// Synchronous (HTTP/gRPC) - Use when:
// - Immediate response needed
// - Simple request/response
// - Strong consistency required
public class OrderController : ControllerBase
{
    private readonly IInventoryClient _inventoryClient;

    [HttpPost]
    public async Task<IActionResult> CreateOrder(OrderDto dto)
    {
        // Synchronous call for immediate stock check
        var available = await _inventoryClient.CheckAvailabilityAsync(dto.Items);
        if (!available)
            return BadRequest("Insufficient stock");

        // Process order...
        return Ok();
    }
}

// Asynchronous (Message Bus) - Use when:
// - Fire-and-forget acceptable
// - Eventual consistency OK
// - Decoupling important
// - Multiple consumers
public class OrderCreatedHandler : IMessageHandler<OrderCreatedEvent>
{
    private readonly IEmailService _emailService;
    private readonly IAnalyticsService _analytics;

    public async Task HandleAsync(OrderCreatedEvent evt)
    {
        // Multiple services can react independently
        await _emailService.SendConfirmationAsync(evt.CustomerId);
        await _analytics.TrackOrderAsync(evt);
    }
}

// Hybrid Approach - Request/Response over Message Bus
public class InventoryQueryHandler
{
    private readonly IMessageBus _bus;

    public async Task<StockLevel> GetStockAsync(string productId)
    {
        var correlationId = Guid.NewGuid().ToString();
        var tcs = new TaskCompletionSource<StockLevel>();

        // Register one-time response handler
        _bus.Subscribe<StockLevelResponse>(correlationId, response =>
        {
            tcs.SetResult(response.Level);
        });

        // Send query
        await _bus.PublishAsync(new StockLevelQuery
        {
            ProductId = productId,
            CorrelationId = correlationId
        });

        // Wait for response with timeout
        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
        return await tcs.Task.WaitAsync(cts.Token);
    }
}
```

**Q: Implement service discovery pattern for dynamic service registration.**

A: Use Consul or Kubernetes service discovery.

```csharp
// Service Registration
public class ConsulServiceRegistration : IHostedService
{
    private readonly IConsulClient _consulClient;
    private readonly IConfiguration _configuration;
    private string _registrationId;

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        _registrationId = $"{_configuration["ServiceName"]}-{Guid.NewGuid()}";

        var registration = new AgentServiceRegistration
        {
            ID = _registrationId,
            Name = _configuration["ServiceName"],
            Address = _configuration["ServiceAddress"],
            Port = int.Parse(_configuration["ServicePort"]),
            Tags = new[] { "api", "v1" },
            Check = new AgentServiceCheck
            {
                HTTP = $"http://{_configuration["ServiceAddress"]}:{_configuration["ServicePort"]}/health",
                Interval = TimeSpan.FromSeconds(10),
                Timeout = TimeSpan.FromSeconds(5),
                DeregisterCriticalServiceAfter = TimeSpan.FromMinutes(1)
            }
        };

        await _consulClient.Agent.ServiceRegister(registration, cancellationToken);
    }

    public async Task StopAsync(CancellationToken cancellationToken)
    {
        await _consulClient.Agent.ServiceDeregister(_registrationId, cancellationToken);
    }
}

// Service Discovery
public class ConsulServiceDiscovery
{
    private readonly IConsulClient _consulClient;
    private readonly IMemoryCache _cache;

    public async Task<ServiceEndpoint> DiscoverServiceAsync(string serviceName)
    {
        return await _cache.GetOrCreateAsync($"service:{serviceName}", async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30);

            var services = await _consulClient.Health.Service(serviceName, tag: null, passingOnly: true);
            var service = services.Response
                .OrderBy(_ => Guid.NewGuid()) // Random selection
                .FirstOrDefault();

            if (service == null)
                throw new ServiceNotFoundException(serviceName);

            return new ServiceEndpoint
            {
                Address = service.Service.Address,
                Port = service.Service.Port
            };
        });
    }
}
```

---

## CQRS & Event Sourcing

**Q: Implement CQRS pattern for an order management system.**

A: Separate read and write models with different databases.

```csharp
// Write Model (Commands)
public class CreateOrderCommand
{
    public Guid CustomerId { get; set; }
    public List<OrderItem> Items { get; set; }
    public Address ShippingAddress { get; set; }
}

public class CreateOrderCommandHandler
{
    private readonly OrderDbContext _writeDb;
    private readonly IMessageBus _bus;

    public async Task<Guid> HandleAsync(CreateOrderCommand command)
    {
        var order = new Order
        {
            Id = Guid.NewGuid(),
            CustomerId = command.CustomerId,
            Items = command.Items,
            Status = OrderStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        _writeDb.Orders.Add(order);
        await _writeDb.SaveChangesAsync();

        // Publish event for read model update
        await _bus.PublishAsync(new OrderCreatedEvent
        {
            OrderId = order.Id,
            CustomerId = order.CustomerId,
            Items = order.Items,
            Total = order.Items.Sum(i => i.Price * i.Quantity),
            CreatedAt = order.CreatedAt
        });

        return order.Id;
    }
}

// Read Model (Queries)
public class OrderSummaryQuery
{
    public Guid CustomerId { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}

public class OrderSummaryQueryHandler
{
    private readonly IMongoDatabase _readDb; // Denormalized read database

    public async Task<List<OrderSummary>> HandleAsync(OrderSummaryQuery query)
    {
        var collection = _readDb.GetCollection<OrderSummary>("order_summaries");

        var filter = Builders<OrderSummary>.Filter.Eq(o => o.CustomerId, query.CustomerId);

        if (query.FromDate.HasValue)
            filter &= Builders<OrderSummary>.Filter.Gte(o => o.CreatedAt, query.FromDate.Value);

        if (query.ToDate.HasValue)
            filter &= Builders<OrderSummary>.Filter.Lte(o => o.CreatedAt, query.ToDate.Value);

        return await collection.Find(filter).ToListAsync();
    }
}

// Read Model Updater (Event Handler)
public class OrderCreatedEventHandler : IMessageHandler<OrderCreatedEvent>
{
    private readonly IMongoDatabase _readDb;

    public async Task HandleAsync(OrderCreatedEvent evt)
    {
        var collection = _readDb.GetCollection<OrderSummary>("order_summaries");

        var summary = new OrderSummary
        {
            OrderId = evt.OrderId,
            CustomerId = evt.CustomerId,
            ItemCount = evt.Items.Count,
            TotalAmount = evt.Total,
            CreatedAt = evt.CreatedAt,
            Status = "Pending"
        };

        await collection.InsertOneAsync(summary);
    }
}
```

**Q: Design event sourcing system for account transactions.**

A: Store all state changes as events, rebuild state by replaying events.

```csharp
// Domain Events
public abstract record DomainEvent
{
    public Guid AggregateId { get; init; }
    public long Version { get; init; }
    public DateTime Timestamp { get; init; }
}

public record AccountCreatedEvent : DomainEvent
{
    public string AccountNumber { get; init; }
    public string CustomerName { get; init; }
}

public record FundsDepositedEvent : DomainEvent
{
    public decimal Amount { get; init; }
    public string Description { get; init; }
}

public record FundsWithdrawnEvent : DomainEvent
{
    public decimal Amount { get; init; }
    public string Description { get; init; }
}

// Aggregate
public class Account
{
    private readonly List<DomainEvent> _uncommittedEvents = new();

    public Guid Id { get; private set; }
    public string AccountNumber { get; private set; }
    public decimal Balance { get; private set; }
    public long Version { get; private set; }

    // Factory method
    public static Account Create(Guid id, string accountNumber, string customerName)
    {
        var account = new Account();
        account.Apply(new AccountCreatedEvent
        {
            AggregateId = id,
            AccountNumber = accountNumber,
            CustomerName = customerName,
            Version = 1,
            Timestamp = DateTime.UtcNow
        });
        return account;
    }

    // Command methods
    public void Deposit(decimal amount, string description)
    {
        if (amount <= 0)
            throw new InvalidOperationException("Amount must be positive");

        Apply(new FundsDepositedEvent
        {
            AggregateId = Id,
            Amount = amount,
            Description = description,
            Version = Version + 1,
            Timestamp = DateTime.UtcNow
        });
    }

    public void Withdraw(decimal amount, string description)
    {
        if (amount <= 0)
            throw new InvalidOperationException("Amount must be positive");

        if (Balance < amount)
            throw new InvalidOperationException("Insufficient funds");

        Apply(new FundsWithdrawnEvent
        {
            AggregateId = Id,
            Amount = amount,
            Description = description,
            Version = Version + 1,
            Timestamp = DateTime.UtcNow
        });
    }

    // Event application
    private void Apply(DomainEvent @event)
    {
        When(@event);
        _uncommittedEvents.Add(@event);
    }

    private void When(DomainEvent @event)
    {
        switch (@event)
        {
            case AccountCreatedEvent e:
                Id = e.AggregateId;
                AccountNumber = e.AccountNumber;
                Balance = 0;
                Version = e.Version;
                break;

            case FundsDepositedEvent e:
                Balance += e.Amount;
                Version = e.Version;
                break;

            case FundsWithdrawnEvent e:
                Balance -= e.Amount;
                Version = e.Version;
                break;
        }
    }

    // Reconstitution from event stream
    public static Account FromEvents(IEnumerable<DomainEvent> events)
    {
        var account = new Account();
        foreach (var @event in events)
        {
            account.When(@event);
        }
        return account;
    }

    public IReadOnlyList<DomainEvent> GetUncommittedEvents() => _uncommittedEvents;
    public void MarkEventsAsCommitted() => _uncommittedEvents.Clear();
}

// Event Store
public class EventStore
{
    private readonly DbContext _dbContext;

    public async Task SaveEventsAsync(Guid aggregateId, IEnumerable<DomainEvent> events, long expectedVersion)
    {
        // Optimistic concurrency check
        var currentVersion = await _dbContext.Events
            .Where(e => e.AggregateId == aggregateId)
            .MaxAsync(e => (long?)e.Version) ?? 0;

        if (currentVersion != expectedVersion)
            throw new ConcurrencyException($"Expected version {expectedVersion}, but found {currentVersion}");

        foreach (var @event in events)
        {
            _dbContext.Events.Add(new EventRecord
            {
                AggregateId = aggregateId,
                EventType = @event.GetType().Name,
                EventData = JsonSerializer.Serialize(@event),
                Version = @event.Version,
                Timestamp = @event.Timestamp
            });
        }

        await _dbContext.SaveChangesAsync();
    }

    public async Task<List<DomainEvent>> GetEventsAsync(Guid aggregateId)
    {
        var records = await _dbContext.Events
            .Where(e => e.AggregateId == aggregateId)
            .OrderBy(e => e.Version)
            .ToListAsync();

        return records.Select(r => DeserializeEvent(r.EventType, r.EventData)).ToList();
    }

    private DomainEvent DeserializeEvent(string eventType, string eventData)
    {
        var type = Type.GetType($"YourNamespace.{eventType}");
        return (DomainEvent)JsonSerializer.Deserialize(eventData, type);
    }
}
```

---

## Caching Strategies

**Q: Design a multi-layer caching strategy (L1: in-memory, L2: Redis, L3: database).**

A: Implement cache-aside pattern with fallback layers.

```csharp
public class MultiLayerCache<T>
{
    private readonly IMemoryCache _l1Cache;
    private readonly IDistributedCache _l2Cache;
    private readonly Func<string, Task<T>> _l3Loader;
    private readonly ILogger<MultiLayerCache<T>> _logger;

    public MultiLayerCache(
        IMemoryCache l1Cache,
        IDistributedCache l2Cache,
        Func<string, Task<T>> l3Loader,
        ILogger<MultiLayerCache<T>> logger)
    {
        _l1Cache = l1Cache;
        _l2Cache = l2Cache;
        _l3Loader = l3Loader;
        _logger = logger;
    }

    public async Task<T> GetAsync(string key)
    {
        // L1: Memory cache
        if (_l1Cache.TryGetValue(key, out T value))
        {
            _logger.LogDebug("Cache hit: L1 (Memory) for key {Key}", key);
            return value;
        }

        // L2: Redis cache
        var l2Data = await _l2Cache.GetStringAsync(key);
        if (l2Data != null)
        {
            _logger.LogDebug("Cache hit: L2 (Redis) for key {Key}", key);
            value = JsonSerializer.Deserialize<T>(l2Data);

            // Populate L1
            _l1Cache.Set(key, value, TimeSpan.FromMinutes(5));

            return value;
        }

        // L3: Database
        _logger.LogDebug("Cache miss: Loading from database for key {Key}", key);
        value = await _l3Loader(key);

        if (value != null)
        {
            // Populate L2 and L1
            var serialized = JsonSerializer.Serialize(value);
            await _l2Cache.SetStringAsync(
                key,
                serialized,
                new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
                });

            _l1Cache.Set(key, value, TimeSpan.FromMinutes(5));
        }

        return value;
    }

    public async Task SetAsync(string key, T value)
    {
        // Write through all layers
        _l1Cache.Set(key, value, TimeSpan.FromMinutes(5));

        var serialized = JsonSerializer.Serialize(value);
        await _l2Cache.SetStringAsync(
            key,
            serialized,
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
            });
    }

    public async Task InvalidateAsync(string key)
    {
        _l1Cache.Remove(key);
        await _l2Cache.RemoveAsync(key);
    }
}

// Usage
public class ProductService
{
    private readonly MultiLayerCache<Product> _cache;
    private readonly DbContext _db;

    public ProductService(
        IMemoryCache memoryCache,
        IDistributedCache distributedCache,
        DbContext db,
        ILogger<MultiLayerCache<Product>> logger)
    {
        _db = db;
        _cache = new MultiLayerCache<Product>(
            memoryCache,
            distributedCache,
            async (key) => await _db.Products.FindAsync(key),
            logger);
    }

    public async Task<Product> GetProductAsync(string id)
    {
        return await _cache.GetAsync($"product:{id}");
    }
}
```

**Q: Implement cache invalidation strategy for distributed systems.**

A: Use pub/sub pattern for cache invalidation.

```csharp
public class DistributedCacheInvalidator
{
    private readonly IConnectionMultiplexer _redis;
    private readonly IMemoryCache _localCache;
    private readonly ILogger<DistributedCacheInvalidator> _logger;
    private ISubscriber _subscriber;

    public DistributedCacheInvalidator(
        IConnectionMultiplexer redis,
        IMemoryCache localCache,
        ILogger<DistributedCacheInvalidator> logger)
    {
        _redis = redis;
        _localCache = localCache;
        _logger = logger;
    }

    public async Task InitializeAsync()
    {
        _subscriber = _redis.GetSubscriber();
        await _subscriber.SubscribeAsync("cache:invalidate", (channel, message) =>
        {
            _logger.LogInformation("Received cache invalidation for: {Key}", message);
            _localCache.Remove(message);
        });
    }

    public async Task InvalidateAsync(string key)
    {
        // Remove from local cache
        _localCache.Remove(key);

        // Remove from Redis
        var db = _redis.GetDatabase();
        await db.KeyDeleteAsync(key);

        // Notify other instances
        await _subscriber.PublishAsync("cache:invalidate", key);
        _logger.LogInformation("Published cache invalidation for: {Key}", key);
    }

    public async Task InvalidatePatternAsync(string pattern)
    {
        var db = _redis.GetDatabase();
        var endpoints = _redis.GetEndPoints();

        foreach (var endpoint in endpoints)
        {
            var server = _redis.GetServer(endpoint);
            var keys = server.Keys(pattern: pattern);

            foreach (var key in keys)
            {
                await InvalidateAsync(key);
            }
        }
    }
}
```

---

## Database Scaling

**Q: Design read replica strategy for handling high read traffic.**

A: Separate read and write database connections.

```csharp
public class DatabaseConnectionFactory
{
    private readonly string _writeConnectionString;
    private readonly List<string> _readConnectionStrings;
    private int _currentReadIndex = 0;

    public DatabaseConnectionFactory(IConfiguration configuration)
    {
        _writeConnectionString = configuration.GetConnectionString("WriteDatabase");
        _readConnectionStrings = configuration.GetSection("ReadDatabases")
            .Get<List<string>>();
    }

    public DbConnection GetWriteConnection()
    {
        return new SqlConnection(_writeConnectionString);
    }

    public DbConnection GetReadConnection()
    {
        // Round-robin load balancing
        var index = Interlocked.Increment(ref _currentReadIndex) % _readConnectionStrings.Count;
        return new SqlConnection(_readConnectionStrings[index]);
    }
}

// DbContext with read/write separation
public class TradingDbContext : DbContext
{
    private readonly DatabaseConnectionFactory _connectionFactory;
    private readonly bool _isReadOnly;

    public TradingDbContext(
        DbContextOptions<TradingDbContext> options,
        DatabaseConnectionFactory connectionFactory,
        bool isReadOnly = false)
        : base(options)
    {
        _connectionFactory = connectionFactory;
        _isReadOnly = isReadOnly;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            var connection = _isReadOnly
                ? _connectionFactory.GetReadConnection()
                : _connectionFactory.GetWriteConnection();

            optionsBuilder.UseSqlServer(connection);
        }
    }
}

// Repository with read/write contexts
public class OrderRepository
{
    private readonly IDbContextFactory<TradingDbContext> _contextFactory;

    public async Task<Order> GetByIdAsync(Guid id)
    {
        // Use read replica
        await using var context = _contextFactory.CreateDbContext();
        context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;

        return await context.Orders
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<Guid> CreateAsync(Order order)
    {
        // Use write database
        await using var context = _contextFactory.CreateDbContext();

        context.Orders.Add(order);
        await context.SaveChangesAsync();

        return order.Id;
    }
}
```

**Q: Design database sharding strategy for multi-tenant application.**

A: Implement tenant-based sharding.

```csharp
public interface IShardSelector
{
    string SelectShard(string tenantId);
}

public class HashBasedShardSelector : IShardSelector
{
    private readonly List<string> _shardConnectionStrings;

    public HashBasedShardSelector(IConfiguration configuration)
    {
        _shardConnectionStrings = configuration.GetSection("Shards")
            .Get<List<string>>();
    }

    public string SelectShard(string tenantId)
    {
        var hash = tenantId.GetHashCode();
        var shardIndex = Math.Abs(hash) % _shardConnectionStrings.Count;
        return _shardConnectionStrings[shardIndex];
    }
}

public class ShardedDbContextFactory
{
    private readonly IShardSelector _shardSelector;
    private readonly ITenantService _tenantService;

    public ShardedDbContextFactory(
        IShardSelector shardSelector,
        ITenantService tenantService)
    {
        _shardSelector = shardSelector;
        _tenantService = tenantService;
    }

    public TradingDbContext CreateContext()
    {
        var tenantId = _tenantService.GetCurrentTenantId();
        var connectionString = _shardSelector.SelectShard(tenantId);

        var optionsBuilder = new DbContextOptionsBuilder<TradingDbContext>();
        optionsBuilder.UseSqlServer(connectionString);

        return new TradingDbContext(optionsBuilder.Options);
    }
}
```

---

## High Availability Patterns

**Q: Design circuit breaker pattern for external API calls.**

A: Already covered in async-resilience.md, but here's a distributed version using Redis:

```csharp
public class DistributedCircuitBreaker
{
    private readonly IConnectionMultiplexer _redis;
    private readonly string _serviceKey;
    private readonly int _failureThreshold;
    private readonly TimeSpan _timeout;

    public DistributedCircuitBreaker(
        IConnectionMultiplexer redis,
        string serviceKey,
        int failureThreshold,
        TimeSpan timeout)
    {
        _redis = redis;
        _serviceKey = $"circuit:{serviceKey}";
        _failureThreshold = failureThreshold;
        _timeout = timeout;
    }

    public async Task<T> ExecuteAsync<T>(Func<Task<T>> operation)
    {
        var db = _redis.GetDatabase();

        // Check circuit state
        var state = await db.StringGetAsync($"{_serviceKey}:state");
        if (state == "open")
        {
            var openedAt = await db.StringGetAsync($"{_serviceKey}:opened_at");
            if (!openedAt.IsNullOrEmpty)
            {
                var openTime = DateTimeOffset.FromUnixTimeSeconds((long)openedAt);
                if (DateTimeOffset.UtcNow - openTime < _timeout)
                {
                    throw new CircuitBreakerOpenException();
                }

                // Try half-open
                await db.StringSetAsync($"{_serviceKey}:state", "half-open");
            }
        }

        try
        {
            var result = await operation();

            // Success - reset if half-open
            if (state == "half-open")
            {
                await db.KeyDeleteAsync($"{_serviceKey}:failures");
                await db.StringSetAsync($"{_serviceKey}:state", "closed");
            }

            return result;
        }
        catch (Exception)
        {
            var failures = await db.StringIncrementAsync($"{_serviceKey}:failures");

            if (failures >= _failureThreshold)
            {
                await db.StringSetAsync($"{_serviceKey}:state", "open");
                await db.StringSetAsync(
                    $"{_serviceKey}:opened_at",
                    DateTimeOffset.UtcNow.ToUnixTimeSeconds());
            }

            throw;
        }
    }
}
```

**Q: Implement health check aggregator for microservices.**

A: Collect health status from all services.

```csharp
public class AggregatedHealthCheck : IHealthCheck
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        var services = _configuration.GetSection("DependentServices")
            .Get<List<ServiceEndpoint>>();

        var tasks = services.Select(async service =>
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                var response = await client.GetAsync(
                    $"{service.Url}/health",
                    cancellationToken);

                return new ServiceHealth
                {
                    ServiceName = service.Name,
                    IsHealthy = response.IsSuccessStatusCode,
                    ResponseTime = response.Headers.Age?.TotalMilliseconds ?? 0
                };
            }
            catch (Exception ex)
            {
                return new ServiceHealth
                {
                    ServiceName = service.Name,
                    IsHealthy = false,
                    Error = ex.Message
                };
            }
        });

        var results = await Task.WhenAll(tasks);
        var unhealthy = results.Where(r => !r.IsHealthy).ToList();

        if (unhealthy.Any())
        {
            return HealthCheckResult.Degraded(
                $"Services unhealthy: {string.Join(", ", unhealthy.Select(u => u.ServiceName))}",
                data: results.ToDictionary(r => r.ServiceName, r => (object)r));
        }

        return HealthCheckResult.Healthy("All services healthy",
            data: results.ToDictionary(r => r.ServiceName, r => (object)r));
    }
}
```

---

## Observability

**Q: Design distributed tracing system using OpenTelemetry.**

A: Implement tracing across microservices.

```csharp
// Startup configuration
var tracerProvider = Sdk.CreateTracerProviderBuilder()
    .AddSource("TradingService")
    .SetResourceBuilder(ResourceBuilder.CreateDefault()
        .AddService("TradingService", serviceVersion: "1.0.0"))
    .AddAspNetCoreInstrumentation(options =>
    {
        options.RecordException = true;
        options.Filter = (httpContext) =>
        {
            // Don't trace health checks
            return !httpContext.Request.Path.StartsWithSegments("/health");
        };
    })
    .AddHttpClientInstrumentation()
    .AddSqlClientInstrumentation(options =>
    {
        options.SetDbStatementForText = true;
        options.RecordException = true;
    })
    .AddJaegerExporter(options =>
    {
        options.AgentHost = "jaeger";
        options.AgentPort = 6831;
    })
    .Build();

// Custom tracing in business logic
public class OrderService
{
    private static readonly ActivitySource ActivitySource = new("TradingService");
    private readonly ILogger<OrderService> _logger;

    public async Task<OrderResult> ProcessOrderAsync(CreateOrderRequest request)
    {
        using var activity = ActivitySource.StartActivity("ProcessOrder", ActivityKind.Server);
        activity?.SetTag("order.customer_id", request.CustomerId);
        activity?.SetTag("order.item_count", request.Items.Count);

        try
        {
            // Step 1: Validate
            using (var validateActivity = ActivitySource.StartActivity("ValidateOrder"))
            {
                await ValidateOrderAsync(request);
                validateActivity?.SetTag("validation.result", "success");
            }

            // Step 2: Create order
            Guid orderId;
            using (var createActivity = ActivitySource.StartActivity("CreateOrder"))
            {
                orderId = await CreateOrderInDatabaseAsync(request);
                createActivity?.SetTag("order.id", orderId);
            }

            // Step 3: Publish event
            using (var publishActivity = ActivitySource.StartActivity("PublishOrderEvent"))
            {
                await PublishOrderCreatedEventAsync(orderId);
            }

            activity?.SetStatus(ActivityStatusCode.Ok);
            return OrderResult.Success(orderId);
        }
        catch (Exception ex)
        {
            activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
            activity?.RecordException(ex);
            _logger.LogError(ex, "Failed to process order");
            throw;
        }
    }
}
```

**Q: Implement centralized logging with correlation IDs.**

A: Use structured logging with correlation tracking.

```csharp
public class CorrelationIdMiddleware
{
    private readonly RequestDelegate _next;
    private const string CorrelationIdHeader = "X-Correlation-ID";

    public async Task InvokeAsync(HttpContext context)
    {
        var correlationId = context.Request.Headers[CorrelationIdHeader].FirstOrDefault()
            ?? Guid.NewGuid().ToString();

        context.Items["CorrelationId"] = correlationId;
        context.Response.Headers.Add(CorrelationIdHeader, correlationId);

        using (_logger.BeginScope(new Dictionary<string, object>
        {
            ["CorrelationId"] = correlationId,
            ["RequestPath"] = context.Request.Path
        }))
        {
            await _next(context);
        }
    }
}

// Propagate to downstream services
public class CorrelationIdDelegatingHandler : DelegatingHandler
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        var correlationId = _httpContextAccessor.HttpContext?.Items["CorrelationId"] as string;
        if (!string.IsNullOrEmpty(correlationId))
        {
            request.Headers.Add("X-Correlation-ID", correlationId);
        }

        return await base.SendAsync(request, cancellationToken);
    }
}

// Register handler
services.AddHttpClient("DownstreamService")
    .AddHttpMessageHandler<CorrelationIdDelegatingHandler>();
```

---

## Advanced System Design Prompts

**Q: Design a multi-region failover strategy for a trading platform.**

A: Use active-active for read-heavy services, active-passive for write-heavy, with DNS failover, replicated data stores, and idempotent writes.

**Q: How would you shard a multi-tenant database for scale?**

A: Choose a shard key (tenant id), use consistent hashing, route via a shard map, and ensure cross-shard queries are minimized or handled via read models.

**Q: Describe a cache invalidation strategy for price snapshots.**

A: Use short TTLs, write-through cache for authoritative updates, and a pub/sub channel to invalidate per-symbol keys on updates.

**Q: When would you use event sourcing versus state storage?**

A: Event sourcing is useful for auditability and replay; state storage is simpler for CRUD-heavy systems. Consider storage costs, query complexity, and regulatory requirements.

**Q: How do you handle backpressure in a streaming system?**

A: Apply bounded queues, adaptive batching, and consumer-side flow control. Drop or coalesce low-priority updates when queues exceed thresholds.

---

**Total Exercises: 30+**

Master these patterns to design scalable, resilient distributed systems!
