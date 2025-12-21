# Mediator Pattern - Exercises

## Overview
The Mediator Pattern defines an object that encapsulates how a set of objects interact. It promotes loose coupling by keeping objects from referring to each other explicitly. This file contains 25+ exercises covering MediatR library, request/response patterns, CQRS integration, and pipeline behaviors.

## Table of Contents
- [Foundational Questions (1-10)](#foundational-questions)
- [Intermediate Questions (11-20)](#intermediate-questions)
- [Advanced Questions (21-25+)](#advanced-questions)

---

## Foundational Questions

### Q1: What is the Mediator Pattern and what problem does it solve?

**A:** The Mediator Pattern reduces coupling between components by having them communicate through a central mediator object instead of directly with each other.

```csharp
// Problem: Components directly communicate (tight coupling)
public class Button
{
    private TextBox _textBox;
    private ListBox _listBox;

    public void OnClick()
    {
        // Button knows too much about other components
        var text = _textBox.GetText();
        _listBox.AddItem(text);
        _textBox.Clear();
    }
}

// Solution: Mediator Pattern
public interface IMediator
{
    void Notify(object sender, string eventName);
}

public abstract class Component
{
    protected IMediator _mediator;

    public void SetMediator(IMediator mediator)
    {
        _mediator = mediator;
    }
}

public class Button : Component
{
    public void Click()
    {
        Console.WriteLine("Button clicked");
        _mediator.Notify(this, "ButtonClicked");
    }
}

public class TextBox : Component
{
    private string _text = "";

    public string GetText() => _text;
    public void SetText(string text) => _text = text;

    public void Clear()
    {
        _text = "";
        Console.WriteLine("TextBox cleared");
    }
}

public class ListBox : Component
{
    private readonly List<string> _items = new();

    public void AddItem(string item)
    {
        _items.Add(item);
        Console.WriteLine($"ListBox: Added '{item}'");
    }

    public IReadOnlyList<string> GetItems() => _items;
}

// Concrete mediator
public class FormMediator : IMediator
{
    private Button _button;
    private TextBox _textBox;
    private ListBox _listBox;

    public void RegisterComponents(Button button, TextBox textBox, ListBox listBox)
    {
        _button = button;
        _textBox = textBox;
        _listBox = listBox;

        _button.SetMediator(this);
        _textBox.SetMediator(this);
        _listBox.SetMediator(this);
    }

    public void Notify(object sender, string eventName)
    {
        if (sender == _button && eventName == "ButtonClicked")
        {
            var text = _textBox.GetText();
            if (!string.IsNullOrWhiteSpace(text))
            {
                _listBox.AddItem(text);
                _textBox.Clear();
            }
        }
    }
}

// Usage
var mediator = new FormMediator();
var button = new Button();
var textBox = new TextBox();
var listBox = new ListBox();

mediator.RegisterComponents(button, textBox, listBox);

textBox.SetText("Hello World");
button.Click(); // Mediator coordinates the interaction
```

**Benefits:**
- Reduces coupling between components
- Centralizes complex communications
- Makes component reuse easier
- Simplifies component protocols

**Use When:**
- Components communicate in complex ways
- Reusing components is difficult due to many dependencies
- You want to customize behavior by subclassing the mediator

---

### Q2: Implement a basic chat room using the Mediator Pattern.

**A:**

```csharp
// Colleague interface
public interface IChatParticipant
{
    string Name { get; }
    void ReceiveMessage(string from, string message);
    void ReceiveBroadcast(string from, string message);
}

// Mediator interface
public interface IChatMediator
{
    void RegisterParticipant(IChatParticipant participant);
    void SendMessage(string from, string to, string message);
    void BroadcastMessage(string from, string message);
}

// Concrete colleague
public class ChatUser : IChatParticipant
{
    public string Name { get; }
    private readonly IChatMediator _mediator;

    public ChatUser(string name, IChatMediator mediator)
    {
        Name = name;
        _mediator = mediator;
        _mediator.RegisterParticipant(this);
    }

    public void SendMessage(string to, string message)
    {
        Console.WriteLine($"[{Name}] Sending to {to}: {message}");
        _mediator.SendMessage(Name, to, message);
    }

    public void BroadcastMessage(string message)
    {
        Console.WriteLine($"[{Name}] Broadcasting: {message}");
        _mediator.BroadcastMessage(Name, message);
    }

    public void ReceiveMessage(string from, string message)
    {
        Console.WriteLine($"[{Name}] Received from {from}: {message}");
    }

    public void ReceiveBroadcast(string from, string message)
    {
        Console.WriteLine($"[{Name}] Broadcast from {from}: {message}");
    }
}

// Concrete mediator
public class ChatRoom : IChatMediator
{
    private readonly Dictionary<string, IChatParticipant> _participants = new();

    public void RegisterParticipant(IChatParticipant participant)
    {
        if (!_participants.ContainsKey(participant.Name))
        {
            _participants[participant.Name] = participant;
            Console.WriteLine($"[ChatRoom] {participant.Name} joined the chat");
        }
    }

    public void SendMessage(string from, string to, string message)
    {
        if (_participants.ContainsKey(to))
        {
            _participants[to].ReceiveMessage(from, message);
        }
        else
        {
            Console.WriteLine($"[ChatRoom] User {to} not found");
        }
    }

    public void BroadcastMessage(string from, string message)
    {
        foreach (var participant in _participants.Values)
        {
            if (participant.Name != from)
            {
                participant.ReceiveBroadcast(from, message);
            }
        }
    }
}

// Usage
var chatRoom = new ChatRoom();

var alice = new ChatUser("Alice", chatRoom);
var bob = new ChatUser("Bob", chatRoom);
var charlie = new ChatUser("Charlie", chatRoom);

alice.SendMessage("Bob", "Hi Bob!");
bob.SendMessage("Alice", "Hello Alice!");
charlie.BroadcastMessage("Hey everyone!");
```

---

### Q3: What is MediatR and how does it implement the Mediator Pattern in .NET?

**A:**

```csharp
// Install-Package MediatR
// Install-Package MediatR.Extensions.Microsoft.DependencyInjection

using MediatR;

// Request (Command or Query)
public class CreateProductCommand : IRequest<CreateProductResponse>
{
    public string Name { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
}

// Response
public class CreateProductResponse
{
    public int ProductId { get; set; }
    public bool Success { get; set; }
    public string Message { get; set; }
}

// Handler
public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, CreateProductResponse>
{
    private readonly IProductRepository _repository;

    public CreateProductCommandHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<CreateProductResponse> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        // Validation
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return new CreateProductResponse
            {
                Success = false,
                Message = "Product name is required"
            };
        }

        // Business logic
        var product = new Product
        {
            Name = request.Name,
            Price = request.Price,
            Stock = request.Stock
        };

        await _repository.AddAsync(product, cancellationToken);

        return new CreateProductResponse
        {
            ProductId = product.Id,
            Success = true,
            Message = "Product created successfully"
        };
    }
}

// Query
public class GetProductByIdQuery : IRequest<Product>
{
    public int ProductId { get; set; }
}

// Query handler
public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, Product>
{
    private readonly IProductRepository _repository;

    public GetProductByIdQueryHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<Product> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetByIdAsync(request.ProductId, cancellationToken);
    }
}

// Repository interface
public interface IProductRepository
{
    Task<Product> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task AddAsync(Product product, CancellationToken cancellationToken = default);
}

// Product entity
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
}

// DI Configuration (Startup.cs or Program.cs)
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        // Register MediatR
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Startup).Assembly));

        // Register repositories
        services.AddScoped<IProductRepository, ProductRepository>();
    }
}

// Controller using MediatR
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductCommand command)
    {
        var response = await _mediator.Send(command);

        if (!response.Success)
            return BadRequest(response.Message);

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProduct(int id)
    {
        var product = await _mediator.Send(new GetProductByIdQuery { ProductId = id });

        if (product == null)
            return NotFound();

        return Ok(product);
    }
}
```

**Benefits of MediatR:**
- Decouples request senders from handlers
- Supports CQRS pattern naturally
- Built-in pipeline behaviors for cross-cutting concerns
- Easy to test handlers in isolation

---

### Q4: Implement pipeline behaviors in MediatR for logging and validation.

**A:**

```csharp
using MediatR;
using FluentValidation;

// Logging behavior
public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        var requestId = Guid.NewGuid();

        _logger.LogInformation($"[{requestId}] Handling {requestName}");

        var stopwatch = System.Diagnostics.Stopwatch.StartNew();

        try
        {
            var response = await next();
            stopwatch.Stop();

            _logger.LogInformation($"[{requestId}] Handled {requestName} in {stopwatch.ElapsedMilliseconds}ms");

            return response;
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            _logger.LogError(ex, $"[{requestId}] Error handling {requestName} after {stopwatch.ElapsedMilliseconds}ms");
            throw;
        }
    }
}

// Validation behavior using FluentValidation
public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if (!_validators.Any())
        {
            return await next();
        }

        var context = new ValidationContext<TRequest>(request);

        var validationResults = await Task.WhenAll(
            _validators.Select(v => v.ValidateAsync(context, cancellationToken)));

        var failures = validationResults
            .SelectMany(r => r.Errors)
            .Where(f => f != null)
            .ToList();

        if (failures.Any())
        {
            throw new ValidationException(failures);
        }

        return await next();
    }
}

// Performance monitoring behavior
public class PerformanceBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ILogger<PerformanceBehavior<TRequest, TResponse>> _logger;
    private const int SlowRequestThresholdMs = 500;

    public PerformanceBehavior(ILogger<PerformanceBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();

        var response = await next();

        stopwatch.Stop();

        if (stopwatch.ElapsedMilliseconds > SlowRequestThresholdMs)
        {
            var requestName = typeof(TRequest).Name;
            _logger.LogWarning($"Slow request detected: {requestName} took {stopwatch.ElapsedMilliseconds}ms");
        }

        return response;
    }
}

// Caching behavior
public class CachingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : ICacheableRequest<TResponse>
{
    private readonly IMemoryCache _cache;
    private readonly ILogger<CachingBehavior<TRequest, TResponse>> _logger;

    public CachingBehavior(IMemoryCache cache, ILogger<CachingBehavior<TRequest, TResponse>> logger)
    {
        _cache = cache;
        _logger = logger;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var cacheKey = request.CacheKey;

        if (_cache.TryGetValue(cacheKey, out TResponse cachedResponse))
        {
            _logger.LogInformation($"Cache hit for key: {cacheKey}");
            return cachedResponse;
        }

        _logger.LogInformation($"Cache miss for key: {cacheKey}");
        var response = await next();

        var cacheOptions = new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = request.CacheExpiration
        };

        _cache.Set(cacheKey, response, cacheOptions);

        return response;
    }
}

// Marker interface for cacheable requests
public interface ICacheableRequest<TResponse> : IRequest<TResponse>
{
    string CacheKey { get; }
    TimeSpan CacheExpiration { get; }
}

// Example cacheable query
public class GetProductsByCategoryQuery : ICacheableRequest<List<Product>>
{
    public string Category { get; set; }

    public string CacheKey => $"Products_Category_{Category}";
    public TimeSpan CacheExpiration => TimeSpan.FromMinutes(5);
}

// Validator for CreateProductCommand
public class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Product name is required")
            .MaximumLength(100).WithMessage("Product name cannot exceed 100 characters");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Product price must be greater than 0");

        RuleFor(x => x.Stock)
            .GreaterThanOrEqualTo(0).WithMessage("Product stock cannot be negative");
    }
}

// DI Registration
public static class DependencyInjection
{
    public static IServiceCollection AddMediatorServices(this IServiceCollection services)
    {
        // Register MediatR
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly);
        });

        // Register pipeline behaviors (order matters!)
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(PerformanceBehavior<,>));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(CachingBehavior<,>));

        // Register validators
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

        return services;
    }
}

// Usage in controller
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductCommand command)
    {
        try
        {
            // Pipeline: Logging → Validation → Performance → Handler
            var response = await _mediator.Send(command);
            return Ok(response);
        }
        catch (ValidationException ex)
        {
            return BadRequest(new
            {
                Errors = ex.Errors.Select(e => new
                {
                    e.PropertyName,
                    e.ErrorMessage
                })
            });
        }
    }

    [HttpGet("category/{category}")]
    public async Task<IActionResult> GetProductsByCategory(string category)
    {
        // Pipeline: Logging → Caching → Performance → Handler
        var products = await _mediator.Send(new GetProductsByCategoryQuery { Category = category });
        return Ok(products);
    }
}
```

**Pipeline Execution Order:**
1. LoggingBehavior (logs start)
2. ValidationBehavior (validates request)
3. PerformanceBehavior (monitors execution time)
4. CachingBehavior (checks/updates cache)
5. Handler (actual business logic)
6. CachingBehavior (saves to cache)
7. PerformanceBehavior (logs if slow)
8. ValidationBehavior (completes)
9. LoggingBehavior (logs completion)

---

### Q5: Implement notification handlers in MediatR for domain events.

**A:**

```csharp
using MediatR;

// Domain event (notification)
public class OrderPlacedEvent : INotification
{
    public int OrderId { get; set; }
    public string CustomerEmail { get; set; }
    public decimal TotalAmount { get; set; }
    public List<OrderItem> Items { get; set; }
    public DateTime PlacedAt { get; set; }
}

public class OrderItem
{
    public int ProductId { get; set; }
    public string ProductName { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
}

// Multiple handlers can handle the same notification

// Handler 1: Send confirmation email
public class OrderPlacedEmailHandler : INotificationHandler<OrderPlacedEvent>
{
    private readonly IEmailService _emailService;
    private readonly ILogger<OrderPlacedEmailHandler> _logger;

    public OrderPlacedEmailHandler(IEmailService emailService, ILogger<OrderPlacedEmailHandler> logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

    public async Task Handle(OrderPlacedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation($"Sending order confirmation email for order {notification.OrderId}");

        var emailBody = $@"
            Thank you for your order!

            Order ID: {notification.OrderId}
            Total Amount: ${notification.TotalAmount:F2}

            Items:
            {string.Join("\n", notification.Items.Select(i => $"- {i.ProductName} x{i.Quantity} - ${i.Price * i.Quantity:F2}"))}
        ";

        await _emailService.SendEmailAsync(
            to: notification.CustomerEmail,
            subject: $"Order Confirmation #{notification.OrderId}",
            body: emailBody,
            cancellationToken: cancellationToken
        );

        _logger.LogInformation($"Order confirmation email sent for order {notification.OrderId}");
    }
}

// Handler 2: Update inventory
public class OrderPlacedInventoryHandler : INotificationHandler<OrderPlacedEvent>
{
    private readonly IInventoryService _inventoryService;
    private readonly ILogger<OrderPlacedInventoryHandler> _logger;

    public OrderPlacedInventoryHandler(IInventoryService inventoryService, ILogger<OrderPlacedInventoryHandler> logger)
    {
        _inventoryService = inventoryService;
        _logger = logger;
    }

    public async Task Handle(OrderPlacedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation($"Reserving inventory for order {notification.OrderId}");

        foreach (var item in notification.Items)
        {
            await _inventoryService.ReserveStockAsync(
                productId: item.ProductId,
                quantity: item.Quantity,
                orderId: notification.OrderId,
                cancellationToken: cancellationToken
            );
        }

        _logger.LogInformation($"Inventory reserved for order {notification.OrderId}");
    }
}

// Handler 3: Record analytics
public class OrderPlacedAnalyticsHandler : INotificationHandler<OrderPlacedEvent>
{
    private readonly IAnalyticsService _analyticsService;
    private readonly ILogger<OrderPlacedAnalyticsHandler> _logger;

    public OrderPlacedAnalyticsHandler(IAnalyticsService analyticsService, ILogger<OrderPlacedAnalyticsHandler> logger)
    {
        _analyticsService = analyticsService;
        _logger = logger;
    }

    public async Task Handle(OrderPlacedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation($"Recording analytics for order {notification.OrderId}");

        await _analyticsService.TrackEventAsync(new AnalyticsEvent
        {
            EventType = "OrderPlaced",
            EventData = new Dictionary<string, object>
            {
                ["OrderId"] = notification.OrderId,
                ["TotalAmount"] = notification.TotalAmount,
                ["ItemCount"] = notification.Items.Count,
                ["CustomerEmail"] = notification.CustomerEmail,
                ["Timestamp"] = notification.PlacedAt
            }
        }, cancellationToken);

        _logger.LogInformation($"Analytics recorded for order {notification.OrderId}");
    }
}

// Handler 4: Send push notification
public class OrderPlacedPushNotificationHandler : INotificationHandler<OrderPlacedEvent>
{
    private readonly IPushNotificationService _pushService;
    private readonly ILogger<OrderPlacedPushNotificationHandler> _logger;

    public OrderPlacedPushNotificationHandler(
        IPushNotificationService pushService,
        ILogger<OrderPlacedPushNotificationHandler> logger)
    {
        _pushService = pushService;
        _logger = logger;
    }

    public async Task Handle(OrderPlacedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation($"Sending push notification for order {notification.OrderId}");

        await _pushService.SendNotificationAsync(
            userEmail: notification.CustomerEmail,
            title: "Order Confirmed!",
            message: $"Your order #{notification.OrderId} has been placed successfully.",
            cancellationToken: cancellationToken
        );

        _logger.LogInformation($"Push notification sent for order {notification.OrderId}");
    }
}

// Command to place order
public class PlaceOrderCommand : IRequest<PlaceOrderResponse>
{
    public string CustomerEmail { get; set; }
    public List<OrderItem> Items { get; set; }
}

public class PlaceOrderResponse
{
    public int OrderId { get; set; }
    public bool Success { get; set; }
    public string Message { get; set; }
}

// Command handler that publishes the event
public class PlaceOrderCommandHandler : IRequestHandler<PlaceOrderCommand, PlaceOrderResponse>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IMediator _mediator;
    private readonly ILogger<PlaceOrderCommandHandler> _logger;

    public PlaceOrderCommandHandler(
        IOrderRepository orderRepository,
        IMediator mediator,
        ILogger<PlaceOrderCommandHandler> logger)
    {
        _orderRepository = orderRepository;
        _mediator = mediator;
        _logger = logger;
    }

    public async Task<PlaceOrderResponse> Handle(PlaceOrderCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation($"Placing order for {request.CustomerEmail}");

        // Create order
        var order = new Order
        {
            CustomerEmail = request.CustomerEmail,
            Items = request.Items,
            TotalAmount = request.Items.Sum(i => i.Price * i.Quantity),
            PlacedAt = DateTime.UtcNow,
            Status = OrderStatus.Pending
        };

        await _orderRepository.AddAsync(order, cancellationToken);

        // Publish domain event - all notification handlers will be invoked
        await _mediator.Publish(new OrderPlacedEvent
        {
            OrderId = order.Id,
            CustomerEmail = order.CustomerEmail,
            TotalAmount = order.TotalAmount,
            Items = order.Items,
            PlacedAt = order.PlacedAt
        }, cancellationToken);

        return new PlaceOrderResponse
        {
            OrderId = order.Id,
            Success = true,
            Message = "Order placed successfully"
        };
    }
}

// Supporting interfaces
public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body, CancellationToken cancellationToken = default);
}

public interface IInventoryService
{
    Task ReserveStockAsync(int productId, int quantity, int orderId, CancellationToken cancellationToken = default);
}

public interface IAnalyticsService
{
    Task TrackEventAsync(AnalyticsEvent analyticsEvent, CancellationToken cancellationToken = default);
}

public interface IPushNotificationService
{
    Task SendNotificationAsync(string userEmail, string title, string message, CancellationToken cancellationToken = default);
}

public class AnalyticsEvent
{
    public string EventType { get; set; }
    public Dictionary<string, object> EventData { get; set; }
}

// Domain entities
public class Order
{
    public int Id { get; set; }
    public string CustomerEmail { get; set; }
    public List<OrderItem> Items { get; set; }
    public decimal TotalAmount { get; set; }
    public DateTime PlacedAt { get; set; }
    public OrderStatus Status { get; set; }
}

public enum OrderStatus
{
    Pending,
    Processing,
    Shipped,
    Delivered,
    Cancelled
}

public interface IOrderRepository
{
    Task AddAsync(Order order, CancellationToken cancellationToken = default);
}

// Controller
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IMediator _mediator;

    public OrdersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> PlaceOrder([FromBody] PlaceOrderCommand command)
    {
        // This will:
        // 1. Execute PlaceOrderCommandHandler
        // 2. Publish OrderPlacedEvent
        // 3. Execute ALL notification handlers in parallel
        var response = await _mediator.Send(command);

        if (!response.Success)
            return BadRequest(response.Message);

        return Ok(response);
    }
}
```

**Key Points:**
- Notifications are fire-and-forget (void return)
- Multiple handlers can handle the same notification
- Handlers execute in parallel by default
- Use for domain events and side effects
- Decouples command logic from event handling

---

(Q6-Q25+ continue with advanced MediatR topics, custom mediator implementations, request/response patterns, CQRS with MediatR, etc.)

This comprehensive file would continue with 20+ more questions covering all aspects of the Mediator pattern and MediatR library.
