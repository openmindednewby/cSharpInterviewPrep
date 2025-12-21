# Clean Architecture - Comprehensive Practice Exercises

## Table of Contents
1. [Layered Architecture Fundamentals](#layered-architecture-fundamentals)
2. [Dependency Flow Rules](#dependency-flow-rules)
3. [Ports and Adapters Pattern](#ports-and-adapters-pattern)
4. [Domain-Driven Design Basics](#domain-driven-design-basics)
5. [Entity vs Value Object](#entity-vs-value-object)
6. [Aggregate Design](#aggregate-design)
7. [Repository Pattern](#repository-pattern)
8. [Use Case/Interactor Implementation](#use-caseinteractor-implementation)
9. [Clean Architecture in ASP.NET Core](#clean-architecture-in-aspnet-core)
10. [Testing Strategies](#testing-strategies)
11. [Cross-Cutting Concerns](#cross-cutting-concerns)
12. [Integration Boundaries](#integration-boundaries)
13. [Operational Concerns](#operational-concerns)
14. [Refactoring & Migration](#refactoring--migration)

---

## Layered Architecture Fundamentals

### Exercise 1: Identify the Four Layers
**Question:** Explain each layer in Clean Architecture and what belongs in each layer. Give examples of classes that would live in each layer.

<details>
<summary>Answer</summary>

The four main layers in Clean Architecture (from innermost to outermost):

**1. Domain Layer (Entities):**
- Core business rules and entities
- No dependencies on outer layers
- Examples:
```csharp
// Domain/Entities/Product.cs
public class Product
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public Money Price { get; private set; }

    public void UpdatePrice(Money newPrice)
    {
        if (newPrice.Amount <= 0)
            throw new DomainException("Price must be positive");

        Price = newPrice;
    }
}

// Domain/ValueObjects/Money.cs
public class Money
{
    public decimal Amount { get; }
    public string Currency { get; }

    public Money(decimal amount, string currency)
    {
        Amount = amount;
        Currency = currency;
    }
}
```

**2. Application Layer (Use Cases):**
- Application-specific business rules
- Orchestrates domain objects
- Depends only on Domain layer
- Examples:
```csharp
// Application/UseCases/CreateProduct/CreateProductCommand.cs
public record CreateProductCommand(string Name, decimal Price, string Currency);

// Application/UseCases/CreateProduct/CreateProductHandler.cs
public class CreateProductHandler
{
    private readonly IProductRepository _repository;

    public async Task<Result<Guid>> Handle(CreateProductCommand command)
    {
        var product = Product.Create(
            command.Name,
            new Money(command.Price, command.Currency)
        );

        await _repository.AddAsync(product);
        return Result.Success(product.Id);
    }
}
```

**3. Infrastructure Layer:**
- External concerns (database, file system, web services)
- Implements interfaces defined in Application layer
- Examples:
```csharp
// Infrastructure/Persistence/ProductRepository.cs
public class ProductRepository : IProductRepository
{
    private readonly ApplicationDbContext _context;

    public async Task<Product> GetByIdAsync(Guid id)
    {
        return await _context.Products.FindAsync(id);
    }
}

// Infrastructure/Persistence/ApplicationDbContext.cs
public class ApplicationDbContext : DbContext
{
    public DbSet<Product> Products { get; set; }
}
```

**4. Presentation Layer (UI/API):**
- User interface or API controllers
- Handles HTTP, serialization, authentication
- Examples:
```csharp
// Presentation/Controllers/ProductsController.cs
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    [HttpPost]
    public async Task<IActionResult> Create(CreateProductRequest request)
    {
        var command = new CreateProductCommand(
            request.Name,
            request.Price,
            request.Currency
        );

        var result = await _mediator.Send(command);
        return result.IsSuccess
            ? Ok(result.Value)
            : BadRequest(result.Error);
    }
}
```

**Key Principle:** Dependencies point inward. Outer layers depend on inner layers, never the reverse.

</details>

---

### Exercise 2: Violation Detection
**Question:** Identify all architectural violations in this code and explain how to fix them.

```csharp
// Domain/Entities/Order.cs
public class Order
{
    public Guid Id { get; set; }
    public List<OrderItem> Items { get; set; }

    public void Save()
    {
        var context = new ApplicationDbContext();
        context.Orders.Add(this);
        context.SaveChanges();
    }

    public void SendEmail()
    {
        var smtpClient = new SmtpClient("smtp.gmail.com");
        smtpClient.Send("order@company.com", "Order confirmation");
    }
}

// Application/Services/OrderService.cs
public class OrderService
{
    public void CreateOrder(CreateOrderRequest request)
    {
        var order = new Order
        {
            Id = Guid.NewGuid(),
            Items = request.Items
        };

        var controller = new OrdersController();
        controller.ProcessOrder(order);
    }
}
```

<details>
<summary>Answer</summary>

**Violations:**

1. **Domain layer depends on Infrastructure** (DbContext in Domain)
2. **Domain layer depends on External services** (SmtpClient in Domain)
3. **Application layer depends on Presentation** (Controller in Service)
4. **Anemic domain model** (public setters, no business logic)

**Fixed version:**

```csharp
// Domain/Entities/Order.cs
public class Order
{
    public Guid Id { get; private set; }
    private readonly List<OrderItem> _items = new();
    public IReadOnlyCollection<OrderItem> Items => _items.AsReadOnly();

    private Order() { } // EF Core

    public static Order Create()
    {
        return new Order { Id = Guid.NewGuid() };
    }

    public void AddItem(Product product, int quantity)
    {
        if (quantity <= 0)
            throw new DomainException("Quantity must be positive");

        var item = new OrderItem(product, quantity);
        _items.Add(item);
    }
}

// Application/Interfaces/IOrderRepository.cs
public interface IOrderRepository
{
    Task AddAsync(Order order);
    Task<Order> GetByIdAsync(Guid id);
}

// Application/Interfaces/IEmailService.cs
public interface IEmailService
{
    Task SendOrderConfirmationAsync(Order order);
}

// Application/UseCases/CreateOrder/CreateOrderHandler.cs
public class CreateOrderHandler
{
    private readonly IOrderRepository _repository;
    private readonly IEmailService _emailService;

    public CreateOrderHandler(IOrderRepository repository, IEmailService emailService)
    {
        _repository = repository;
        _emailService = emailService;
    }

    public async Task<Guid> Handle(CreateOrderCommand command)
    {
        var order = Order.Create();

        foreach (var item in command.Items)
        {
            order.AddItem(item.Product, item.Quantity);
        }

        await _repository.AddAsync(order);
        await _emailService.SendOrderConfirmationAsync(order);

        return order.Id;
    }
}

// Infrastructure/Persistence/OrderRepository.cs
public class OrderRepository : IOrderRepository
{
    private readonly ApplicationDbContext _context;

    public async Task AddAsync(Order order)
    {
        await _context.Orders.AddAsync(order);
        await _context.SaveChangesAsync();
    }
}

// Infrastructure/Email/EmailService.cs
public class EmailService : IEmailService
{
    private readonly SmtpClient _smtpClient;

    public async Task SendOrderConfirmationAsync(Order order)
    {
        // Email implementation
    }
}
```

**Key fixes:**
- Remove all infrastructure dependencies from Domain
- Define interfaces in Application layer
- Implement interfaces in Infrastructure layer
- Use dependency injection
- Encapsulate domain logic with private setters

</details>

---

### Exercise 3: Project Structure Setup
**Question:** Create a proper folder structure for a Clean Architecture e-commerce solution. Include all necessary projects and folders.

<details>
<summary>Answer</summary>

```
ECommerce.sln
│
├── src/
│   ├── ECommerce.Domain/
│   │   ├── Entities/
│   │   │   ├── Product.cs
│   │   │   ├── Order.cs
│   │   │   ├── Customer.cs
│   │   │   └── OrderItem.cs
│   │   ├── ValueObjects/
│   │   │   ├── Money.cs
│   │   │   ├── Address.cs
│   │   │   └── Email.cs
│   │   ├── Enums/
│   │   │   ├── OrderStatus.cs
│   │   │   └── PaymentMethod.cs
│   │   ├── Exceptions/
│   │   │   ├── DomainException.cs
│   │   │   └── BusinessRuleViolationException.cs
│   │   └── Events/
│   │       ├── OrderCreatedEvent.cs
│   │       └── PaymentProcessedEvent.cs
│   │
│   ├── ECommerce.Application/
│   │   ├── Interfaces/
│   │   │   ├── Persistence/
│   │   │   │   ├── IOrderRepository.cs
│   │   │   │   ├── IProductRepository.cs
│   │   │   │   └── IUnitOfWork.cs
│   │   │   ├── Services/
│   │   │   │   ├── IEmailService.cs
│   │   │   │   ├── IPaymentService.cs
│   │   │   │   └── IInventoryService.cs
│   │   ├── UseCases/
│   │   │   ├── Orders/
│   │   │   │   ├── CreateOrder/
│   │   │   │   │   ├── CreateOrderCommand.cs
│   │   │   │   │   └── CreateOrderHandler.cs
│   │   │   │   ├── GetOrderById/
│   │   │   │   │   ├── GetOrderByIdQuery.cs
│   │   │   │   │   └── GetOrderByIdHandler.cs
│   │   │   ├── Products/
│   │   │   │   ├── CreateProduct/
│   │   │   │   └── UpdateProduct/
│   │   ├── DTOs/
│   │   │   ├── OrderDto.cs
│   │   │   └── ProductDto.cs
│   │   ├── Behaviors/
│   │   │   ├── ValidationBehavior.cs
│   │   │   └── LoggingBehavior.cs
│   │   └── Common/
│   │       ├── Result.cs
│   │       └── Error.cs
│   │
│   ├── ECommerce.Infrastructure/
│   │   ├── Persistence/
│   │   │   ├── ApplicationDbContext.cs
│   │   │   ├── Configurations/
│   │   │   │   ├── OrderConfiguration.cs
│   │   │   │   └── ProductConfiguration.cs
│   │   │   ├── Repositories/
│   │   │   │   ├── OrderRepository.cs
│   │   │   │   └── ProductRepository.cs
│   │   │   └── UnitOfWork.cs
│   │   ├── Services/
│   │   │   ├── EmailService.cs
│   │   │   └── PaymentService.cs
│   │   ├── Migrations/
│   │   └── DependencyInjection.cs
│   │
│   └── ECommerce.API/
│       ├── Controllers/
│       │   ├── OrdersController.cs
│       │   └── ProductsController.cs
│       ├── Middleware/
│       │   ├── ExceptionHandlingMiddleware.cs
│       │   └── RequestLoggingMiddleware.cs
│       ├── Filters/
│       │   └── ValidationFilter.cs
│       ├── Models/
│       │   ├── Requests/
│       │   │   ├── CreateOrderRequest.cs
│       │   │   └── UpdateProductRequest.cs
│       │   └── Responses/
│       │       ├── OrderResponse.cs
│       │       └── ProductResponse.cs
│       ├── Program.cs
│       └── appsettings.json
│
└── tests/
    ├── ECommerce.Domain.Tests/
    ├── ECommerce.Application.Tests/
    ├── ECommerce.Infrastructure.Tests/
    └── ECommerce.API.Tests/
```

**Project dependencies:**
```
Domain → (no dependencies)
Application → Domain
Infrastructure → Application, Domain
API → Application, Infrastructure (for DI only), Domain
```

**Key principles:**
- Domain has zero dependencies
- Application only depends on Domain
- Infrastructure implements Application interfaces
- API is composition root (DI configuration)

</details>

---

## Dependency Flow Rules

### Exercise 4: Dependency Inversion Principle
**Question:** Demonstrate how to apply the Dependency Inversion Principle when the Application layer needs to send emails.

<details>
<summary>Answer</summary>

**Problem:** Application layer needs email functionality but shouldn't depend on concrete email implementations.

**Solution:**

```csharp
// Application/Interfaces/IEmailService.cs (Application layer defines interface)
public interface IEmailService
{
    Task SendAsync(string to, string subject, string body);
    Task SendOrderConfirmationAsync(Guid orderId, string customerEmail);
}

// Application/UseCases/Orders/CompleteOrder/CompleteOrderHandler.cs
public class CompleteOrderHandler
{
    private readonly IOrderRepository _orderRepository;
    private readonly IEmailService _emailService; // Depends on abstraction

    public CompleteOrderHandler(
        IOrderRepository orderRepository,
        IEmailService emailService)
    {
        _orderRepository = orderRepository;
        _emailService = emailService;
    }

    public async Task<Result> Handle(CompleteOrderCommand command)
    {
        var order = await _orderRepository.GetByIdAsync(command.OrderId);
        if (order == null)
            return Result.Failure("Order not found");

        order.Complete();
        await _orderRepository.UpdateAsync(order);

        // Use abstraction - no knowledge of SMTP, SendGrid, etc.
        await _emailService.SendOrderConfirmationAsync(
            order.Id,
            order.Customer.Email
        );

        return Result.Success();
    }
}

// Infrastructure/Email/SmtpEmailService.cs (Infrastructure implements)
public class SmtpEmailService : IEmailService
{
    private readonly SmtpClient _smtpClient;
    private readonly ILogger<SmtpEmailService> _logger;

    public SmtpEmailService(
        IOptions<EmailSettings> settings,
        ILogger<SmtpEmailService> logger)
    {
        _logger = logger;
        _smtpClient = new SmtpClient(settings.Value.Host)
        {
            Port = settings.Value.Port,
            Credentials = new NetworkCredential(
                settings.Value.Username,
                settings.Value.Password
            )
        };
    }

    public async Task SendAsync(string to, string subject, string body)
    {
        var message = new MailMessage("noreply@company.com", to, subject, body);
        await _smtpClient.SendMailAsync(message);
        _logger.LogInformation("Email sent to {Email}", to);
    }

    public async Task SendOrderConfirmationAsync(Guid orderId, string customerEmail)
    {
        var subject = $"Order Confirmation - {orderId}";
        var body = $"Your order {orderId} has been confirmed.";
        await SendAsync(customerEmail, subject, body);
    }
}

// Infrastructure/Email/SendGridEmailService.cs (Alternative implementation)
public class SendGridEmailService : IEmailService
{
    private readonly ISendGridClient _client;

    public async Task SendAsync(string to, string subject, string body)
    {
        var msg = new SendGridMessage
        {
            From = new EmailAddress("noreply@company.com"),
            Subject = subject,
            PlainTextContent = body
        };
        msg.AddTo(new EmailAddress(to));

        await _client.SendEmailAsync(msg);
    }

    public async Task SendOrderConfirmationAsync(Guid orderId, string customerEmail)
    {
        // SendGrid-specific implementation
    }
}

// API/Program.cs (Composition Root - where dependency is resolved)
builder.Services.AddScoped<IEmailService, SmtpEmailService>();
// OR
builder.Services.AddScoped<IEmailService, SendGridEmailService>();
```

**Key benefits:**
1. Application layer doesn't know about SMTP, SendGrid, etc.
2. Easy to swap implementations
3. Easy to test (mock IEmailService)
4. Application layer defines what it needs
5. Infrastructure provides implementation

**Testing:**
```csharp
// Application.Tests/CompleteOrderHandlerTests.cs
public class CompleteOrderHandlerTests
{
    [Fact]
    public async Task Handle_ShouldSendEmail_WhenOrderCompleted()
    {
        // Arrange
        var mockEmailService = new Mock<IEmailService>();
        var handler = new CompleteOrderHandler(
            mockOrderRepository.Object,
            mockEmailService.Object
        );

        // Act
        await handler.Handle(new CompleteOrderCommand(orderId));

        // Assert
        mockEmailService.Verify(
            x => x.SendOrderConfirmationAsync(orderId, It.IsAny<string>()),
            Times.Once
        );
    }
}
```

</details>

---

### Exercise 5: Breaking Circular Dependencies
**Question:** Fix the circular dependency in this code structure.

```csharp
// Application/Services/OrderService.cs
public class OrderService
{
    private readonly ProductService _productService;

    public void CreateOrder(CreateOrderDto dto)
    {
        var product = _productService.GetProduct(dto.ProductId);
        // Create order
    }
}

// Application/Services/ProductService.cs
public class ProductService
{
    private readonly OrderService _orderService;

    public void UpdateStock(Guid productId)
    {
        var orders = _orderService.GetOrdersForProduct(productId);
        // Update stock
    }
}
```

<details>
<summary>Answer</summary>

**Problem:** OrderService → ProductService → OrderService (circular dependency)

**Solution 1: Extract Common Logic to Domain**

```csharp
// Domain/Entities/Product.cs
public class Product
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public int StockQuantity { get; private set; }

    public bool HasSufficientStock(int quantity)
    {
        return StockQuantity >= quantity;
    }

    public void ReserveStock(int quantity)
    {
        if (!HasSufficientStock(quantity))
            throw new DomainException("Insufficient stock");

        StockQuantity -= quantity;
    }
}

// Application/UseCases/Orders/CreateOrder/CreateOrderHandler.cs
public class CreateOrderHandler
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;

    public async Task<Result<Guid>> Handle(CreateOrderCommand command)
    {
        var product = await _productRepository.GetByIdAsync(command.ProductId);
        if (product == null)
            return Result.Failure<Guid>("Product not found");

        // Domain logic handles stock
        product.ReserveStock(command.Quantity);

        var order = Order.Create(command.CustomerId);
        order.AddItem(product, command.Quantity);

        await _productRepository.UpdateAsync(product);
        await _orderRepository.AddAsync(order);

        return Result.Success(order.Id);
    }
}

// Application/UseCases/Products/UpdateStock/UpdateStockHandler.cs
public class UpdateStockHandler
{
    private readonly IProductRepository _productRepository;

    public async Task<Result> Handle(UpdateStockCommand command)
    {
        var product = await _productRepository.GetByIdAsync(command.ProductId);
        if (product == null)
            return Result.Failure("Product not found");

        product.AddStock(command.Quantity);
        await _productRepository.UpdateAsync(product);

        return Result.Success();
    }
}
```

**Solution 2: Use Domain Events**

```csharp
// Domain/Events/OrderCreatedEvent.cs
public record OrderCreatedEvent(Guid OrderId, Guid ProductId, int Quantity);

// Domain/Entities/Order.cs
public class Order
{
    private readonly List<IDomainEvent> _domainEvents = new();
    public IReadOnlyList<IDomainEvent> DomainEvents => _domainEvents;

    public static Order Create(Guid customerId, Guid productId, int quantity)
    {
        var order = new Order { Id = Guid.NewGuid() };
        order._domainEvents.Add(new OrderCreatedEvent(order.Id, productId, quantity));
        return order;
    }

    public void ClearDomainEvents() => _domainEvents.Clear();
}

// Application/EventHandlers/OrderCreatedEventHandler.cs
public class OrderCreatedEventHandler : INotificationHandler<OrderCreatedEvent>
{
    private readonly IProductRepository _productRepository;

    public async Task Handle(OrderCreatedEvent notification, CancellationToken ct)
    {
        var product = await _productRepository.GetByIdAsync(notification.ProductId);
        product.ReserveStock(notification.Quantity);
        await _productRepository.UpdateAsync(product);
    }
}

// Infrastructure/Persistence/ApplicationDbContext.cs
public override async Task<int> SaveChangesAsync(CancellationToken ct = default)
{
    var domainEvents = ChangeTracker.Entries<Entity>()
        .SelectMany(e => e.Entity.DomainEvents)
        .ToList();

    var result = await base.SaveChangesAsync(ct);

    foreach (var domainEvent in domainEvents)
    {
        await _mediator.Publish(domainEvent, ct);
    }

    return result;
}
```

**Solution 3: Use Mediator Pattern (if really needed)**

```csharp
// Application/UseCases/Orders/CreateOrder/CreateOrderHandler.cs
public class CreateOrderHandler
{
    private readonly IMediator _mediator;
    private readonly IOrderRepository _orderRepository;

    public async Task<Result<Guid>> Handle(CreateOrderCommand command)
    {
        // Query for product instead of direct dependency
        var productResult = await _mediator.Send(
            new GetProductQuery(command.ProductId)
        );

        if (!productResult.IsSuccess)
            return Result.Failure<Guid>(productResult.Error);

        var order = Order.Create(command.CustomerId);
        await _orderRepository.AddAsync(order);

        return Result.Success(order.Id);
    }
}
```

**Key principles:**
- Prefer domain logic over services
- Use domain events for decoupling
- Use mediator for queries between use cases
- Avoid service-to-service dependencies

</details>

---

## Ports and Adapters Pattern

### Exercise 6: Implement Ports and Adapters
**Question:** Implement a payment processing system using the Ports and Adapters pattern that supports multiple payment providers.

<details>
<summary>Answer</summary>

```csharp
// Application/Ports/IPaymentGateway.cs (Port - defined in Application)
public interface IPaymentGateway
{
    Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request);
    Task<RefundResult> RefundPaymentAsync(string transactionId, decimal amount);
    Task<PaymentStatus> GetPaymentStatusAsync(string transactionId);
}

// Application/DTOs/Payment.cs
public record PaymentRequest(
    decimal Amount,
    string Currency,
    string CardNumber,
    string CVV,
    DateTime ExpiryDate
);

public record PaymentResult(
    bool Success,
    string TransactionId,
    string Message,
    DateTime ProcessedAt
);

public record RefundResult(bool Success, string RefundId, string Message);

public enum PaymentStatus
{
    Pending,
    Completed,
    Failed,
    Refunded
}

// Application/UseCases/ProcessPayment/ProcessPaymentHandler.cs
public class ProcessPaymentHandler
{
    private readonly IPaymentGateway _paymentGateway;
    private readonly IOrderRepository _orderRepository;
    private readonly ILogger<ProcessPaymentHandler> _logger;

    public ProcessPaymentHandler(
        IPaymentGateway paymentGateway,
        IOrderRepository orderRepository,
        ILogger<ProcessPaymentHandler> logger)
    {
        _paymentGateway = paymentGateway;
        _orderRepository = orderRepository;
        _logger = logger;
    }

    public async Task<Result> Handle(ProcessPaymentCommand command)
    {
        var order = await _orderRepository.GetByIdAsync(command.OrderId);
        if (order == null)
            return Result.Failure("Order not found");

        var request = new PaymentRequest(
            order.TotalAmount,
            "USD",
            command.CardNumber,
            command.CVV,
            command.ExpiryDate
        );

        var result = await _paymentGateway.ProcessPaymentAsync(request);

        if (result.Success)
        {
            order.MarkAsPaid(result.TransactionId);
            await _orderRepository.UpdateAsync(order);
            _logger.LogInformation("Payment processed: {TransactionId}", result.TransactionId);
        }

        return result.Success
            ? Result.Success()
            : Result.Failure(result.Message);
    }
}

// Infrastructure/Adapters/Stripe/StripePaymentAdapter.cs (Adapter)
public class StripePaymentAdapter : IPaymentGateway
{
    private readonly StripeClient _stripeClient;
    private readonly ILogger<StripePaymentAdapter> _logger;

    public StripePaymentAdapter(
        IOptions<StripeSettings> settings,
        ILogger<StripePaymentAdapter> logger)
    {
        _stripeClient = new StripeClient(settings.Value.ApiKey);
        _logger = logger;
    }

    public async Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request)
    {
        try
        {
            var options = new ChargeCreateOptions
            {
                Amount = (long)(request.Amount * 100), // Stripe uses cents
                Currency = request.Currency.ToLower(),
                Source = CreateTokenFromCard(request),
                Description = "Order payment"
            };

            var service = new ChargeService(_stripeClient);
            var charge = await service.CreateAsync(options);

            return new PaymentResult(
                Success: charge.Status == "succeeded",
                TransactionId: charge.Id,
                Message: charge.Status,
                ProcessedAt: DateTime.UtcNow
            );
        }
        catch (StripeException ex)
        {
            _logger.LogError(ex, "Stripe payment failed");
            return new PaymentResult(false, null, ex.Message, DateTime.UtcNow);
        }
    }

    public async Task<RefundResult> RefundPaymentAsync(string transactionId, decimal amount)
    {
        var options = new RefundCreateOptions
        {
            Charge = transactionId,
            Amount = (long)(amount * 100)
        };

        var service = new RefundService(_stripeClient);
        var refund = await service.CreateAsync(options);

        return new RefundResult(
            refund.Status == "succeeded",
            refund.Id,
            refund.Status
        );
    }

    public async Task<PaymentStatus> GetPaymentStatusAsync(string transactionId)
    {
        var service = new ChargeService(_stripeClient);
        var charge = await service.GetAsync(transactionId);

        return charge.Status switch
        {
            "pending" => PaymentStatus.Pending,
            "succeeded" => PaymentStatus.Completed,
            "failed" => PaymentStatus.Failed,
            "refunded" => PaymentStatus.Refunded,
            _ => PaymentStatus.Failed
        };
    }
}

// Infrastructure/Adapters/PayPal/PayPalPaymentAdapter.cs (Alternative Adapter)
public class PayPalPaymentAdapter : IPaymentGateway
{
    private readonly PayPalHttpClient _payPalClient;
    private readonly ILogger<PayPalPaymentAdapter> _logger;

    public PayPalPaymentAdapter(
        IOptions<PayPalSettings> settings,
        ILogger<PayPalPaymentAdapter> logger)
    {
        var environment = new SandboxEnvironment(
            settings.Value.ClientId,
            settings.Value.ClientSecret
        );
        _payPalClient = new PayPalHttpClient(environment);
        _logger = logger;
    }

    public async Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request)
    {
        var orderRequest = new OrderRequest
        {
            CheckoutPaymentIntent = "CAPTURE",
            PurchaseUnits = new List<PurchaseUnitRequest>
            {
                new PurchaseUnitRequest
                {
                    AmountWithBreakdown = new AmountWithBreakdown
                    {
                        CurrencyCode = request.Currency,
                        Value = request.Amount.ToString("F2")
                    }
                }
            }
        };

        var createRequest = new OrdersCreateRequest();
        createRequest.Prefer("return=representation");
        createRequest.RequestBody(orderRequest);

        try
        {
            var response = await _payPalClient.Execute(createRequest);
            var order = response.Result<Order>();

            return new PaymentResult(
                Success: order.Status == "COMPLETED",
                TransactionId: order.Id,
                Message: order.Status,
                ProcessedAt: DateTime.UtcNow
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "PayPal payment failed");
            return new PaymentResult(false, null, ex.Message, DateTime.UtcNow);
        }
    }

    public async Task<RefundResult> RefundPaymentAsync(string transactionId, decimal amount)
    {
        // PayPal refund implementation
        throw new NotImplementedException();
    }

    public async Task<PaymentStatus> GetPaymentStatusAsync(string transactionId)
    {
        // PayPal status check implementation
        throw new NotImplementedException();
    }
}

// Infrastructure/Adapters/MockPaymentAdapter.cs (For Testing)
public class MockPaymentAdapter : IPaymentGateway
{
    public Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request)
    {
        // Always succeeds for testing
        return Task.FromResult(new PaymentResult(
            Success: true,
            TransactionId: Guid.NewGuid().ToString(),
            Message: "Mock payment processed",
            ProcessedAt: DateTime.UtcNow
        ));
    }

    public Task<RefundResult> RefundPaymentAsync(string transactionId, decimal amount)
    {
        return Task.FromResult(new RefundResult(true, Guid.NewGuid().ToString(), "Refunded"));
    }

    public Task<PaymentStatus> GetPaymentStatusAsync(string transactionId)
    {
        return Task.FromResult(PaymentStatus.Completed);
    }
}

// API/Program.cs (Configuration)
var builder = WebApplication.CreateBuilder(args);

// Choose adapter based on configuration
var paymentProvider = builder.Configuration["PaymentProvider"];

switch (paymentProvider)
{
    case "Stripe":
        builder.Services.AddScoped<IPaymentGateway, StripePaymentAdapter>();
        builder.Services.Configure<StripeSettings>(
            builder.Configuration.GetSection("Stripe")
        );
        break;

    case "PayPal":
        builder.Services.AddScoped<IPaymentGateway, PayPalPaymentAdapter>();
        builder.Services.Configure<PayPalSettings>(
            builder.Configuration.GetSection("PayPal")
        );
        break;

    case "Mock":
        builder.Services.AddScoped<IPaymentGateway, MockPaymentAdapter>();
        break;

    default:
        throw new InvalidOperationException("Invalid payment provider");
}
```

**Key benefits:**
1. Application layer defines interface (port)
2. Infrastructure provides implementations (adapters)
3. Easy to swap payment providers
4. Easy to test with mock adapter
5. No vendor lock-in

</details>

---

### Exercise 7: Database Adapter Pattern
**Question:** Create adapters for both SQL and MongoDB databases using the same port interface.

<details>
<summary>Answer</summary>

```csharp
// Application/Ports/IProductRepository.cs (Port)
public interface IProductRepository
{
    Task<Product> GetByIdAsync(Guid id);
    Task<IEnumerable<Product>> GetAllAsync();
    Task<IEnumerable<Product>> SearchAsync(string searchTerm);
    Task AddAsync(Product product);
    Task UpdateAsync(Product product);
    Task DeleteAsync(Guid id);
}

// Domain/Entities/Product.cs
public class Product
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string Description { get; private set; }
    public decimal Price { get; private set; }
    public int StockQuantity { get; private set; }

    private Product() { }

    public static Product Create(string name, string description, decimal price, int stock)
    {
        return new Product
        {
            Id = Guid.NewGuid(),
            Name = name,
            Description = description,
            Price = price,
            StockQuantity = stock
        };
    }
}

// Infrastructure/Adapters/SqlServer/SqlProductRepository.cs (SQL Adapter)
public class SqlProductRepository : IProductRepository
{
    private readonly ApplicationDbContext _context;

    public SqlProductRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Product> GetByIdAsync(Guid id)
    {
        return await _context.Products
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<Product>> GetAllAsync()
    {
        return await _context.Products.ToListAsync();
    }

    public async Task<IEnumerable<Product>> SearchAsync(string searchTerm)
    {
        return await _context.Products
            .Where(p => EF.Functions.Like(p.Name, $"%{searchTerm}%") ||
                       EF.Functions.Like(p.Description, $"%{searchTerm}%"))
            .ToListAsync();
    }

    public async Task AddAsync(Product product)
    {
        await _context.Products.AddAsync(product);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Product product)
    {
        _context.Products.Update(product);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var product = await GetByIdAsync(id);
        if (product != null)
        {
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
        }
    }
}

// Infrastructure/Adapters/MongoDB/MongoProductRepository.cs (MongoDB Adapter)
public class MongoProductRepository : IProductRepository
{
    private readonly IMongoCollection<ProductDocument> _collection;

    public MongoProductRepository(IMongoDatabase database)
    {
        _collection = database.GetCollection<ProductDocument>("products");
    }

    public async Task<Product> GetByIdAsync(Guid id)
    {
        var filter = Builders<ProductDocument>.Filter.Eq(p => p.Id, id);
        var document = await _collection.Find(filter).FirstOrDefaultAsync();
        return document?.ToDomain();
    }

    public async Task<IEnumerable<Product>> GetAllAsync()
    {
        var documents = await _collection.Find(_ => true).ToListAsync();
        return documents.Select(d => d.ToDomain());
    }

    public async Task<IEnumerable<Product>> SearchAsync(string searchTerm)
    {
        var filter = Builders<ProductDocument>.Filter.Or(
            Builders<ProductDocument>.Filter.Regex(p => p.Name, new BsonRegularExpression(searchTerm, "i")),
            Builders<ProductDocument>.Filter.Regex(p => p.Description, new BsonRegularExpression(searchTerm, "i"))
        );

        var documents = await _collection.Find(filter).ToListAsync();
        return documents.Select(d => d.ToDomain());
    }

    public async Task AddAsync(Product product)
    {
        var document = ProductDocument.FromDomain(product);
        await _collection.InsertOneAsync(document);
    }

    public async Task UpdateAsync(Product product)
    {
        var document = ProductDocument.FromDomain(product);
        var filter = Builders<ProductDocument>.Filter.Eq(p => p.Id, product.Id);
        await _collection.ReplaceOneAsync(filter, document);
    }

    public async Task DeleteAsync(Guid id)
    {
        var filter = Builders<ProductDocument>.Filter.Eq(p => p.Id, id);
        await _collection.DeleteOneAsync(filter);
    }
}

// Infrastructure/Adapters/MongoDB/ProductDocument.cs (MongoDB Document Model)
public class ProductDocument
{
    [BsonId]
    public Guid Id { get; set; }

    [BsonElement("name")]
    public string Name { get; set; }

    [BsonElement("description")]
    public string Description { get; set; }

    [BsonElement("price")]
    public decimal Price { get; set; }

    [BsonElement("stock_quantity")]
    public int StockQuantity { get; set; }

    public Product ToDomain()
    {
        // Use reflection or create method to construct Product
        return Product.Create(Name, Description, Price, StockQuantity);
    }

    public static ProductDocument FromDomain(Product product)
    {
        return new ProductDocument
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            StockQuantity = product.StockQuantity
        };
    }
}

// Infrastructure/Adapters/InMemory/InMemoryProductRepository.cs (Testing Adapter)
public class InMemoryProductRepository : IProductRepository
{
    private readonly Dictionary<Guid, Product> _products = new();

    public Task<Product> GetByIdAsync(Guid id)
    {
        _products.TryGetValue(id, out var product);
        return Task.FromResult(product);
    }

    public Task<IEnumerable<Product>> GetAllAsync()
    {
        return Task.FromResult(_products.Values.AsEnumerable());
    }

    public Task<IEnumerable<Product>> SearchAsync(string searchTerm)
    {
        var results = _products.Values
            .Where(p => p.Name.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                       p.Description.Contains(searchTerm, StringComparison.OrdinalIgnoreCase));
        return Task.FromResult(results);
    }

    public Task AddAsync(Product product)
    {
        _products[product.Id] = product;
        return Task.CompletedTask;
    }

    public Task UpdateAsync(Product product)
    {
        _products[product.Id] = product;
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Guid id)
    {
        _products.Remove(id);
        return Task.CompletedTask;
    }
}

// API/Program.cs (Configuration)
var databaseProvider = builder.Configuration["DatabaseProvider"];

switch (databaseProvider)
{
    case "SqlServer":
        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("SqlServer"))
        );
        builder.Services.AddScoped<IProductRepository, SqlProductRepository>();
        break;

    case "MongoDB":
        builder.Services.AddSingleton<IMongoClient>(sp =>
            new MongoClient(builder.Configuration.GetConnectionString("MongoDB"))
        );
        builder.Services.AddScoped<IMongoDatabase>(sp =>
        {
            var client = sp.GetRequiredService<IMongoClient>();
            return client.GetDatabase("ECommerceDb");
        });
        builder.Services.AddScoped<IProductRepository, MongoProductRepository>();
        break;

    case "InMemory":
        builder.Services.AddSingleton<IProductRepository, InMemoryProductRepository>();
        break;
}
```

**Key benefits:**
- Same interface works with SQL, MongoDB, or In-Memory
- Application layer doesn't know about database implementation
- Easy to switch databases
- Easy to test with in-memory implementation

</details>

---

## Domain-Driven Design Basics

### Exercise 8: Ubiquitous Language
**Question:** Refactor this code to use ubiquitous language from the e-commerce domain instead of technical jargon.

```csharp
public class DataItem
{
    public int Id { get; set; }
    public string Field1 { get; set; }
    public decimal Field2 { get; set; }
    public int Field3 { get; set; }
    public DateTime Field4 { get; set; }
    public bool Field5 { get; set; }
}

public class DataProcessor
{
    public void ProcessData(DataItem item)
    {
        if (item.Field3 > 0 && !item.Field5)
        {
            item.Field5 = true;
            item.Field4 = DateTime.Now;
        }
    }
}
```

<details>
<summary>Answer</summary>

```csharp
// Domain/Entities/Order.cs
public class Order
{
    public Guid Id { get; private set; }
    public string OrderNumber { get; private set; }
    public Money TotalAmount { get; private set; }
    public int ItemCount { get; private set; }
    public DateTime PlacedAt { get; private set; }
    public OrderStatus Status { get; private set; }

    private readonly List<OrderItem> _items = new();
    public IReadOnlyCollection<OrderItem> Items => _items.AsReadOnly();

    private Order() { }

    public static Order Create(string orderNumber, Guid customerId)
    {
        return new Order
        {
            Id = Guid.NewGuid(),
            OrderNumber = orderNumber,
            PlacedAt = DateTime.UtcNow,
            Status = OrderStatus.Pending
        };
    }

    public void AddItem(Product product, int quantity)
    {
        if (Status != OrderStatus.Pending)
            throw new DomainException("Cannot add items to a confirmed order");

        var item = OrderItem.Create(product, quantity);
        _items.Add(item);
        ItemCount += quantity;
        RecalculateTotal();
    }

    public void ConfirmOrder()
    {
        if (ItemCount == 0)
            throw new DomainException("Cannot confirm an empty order");

        if (Status != OrderStatus.Pending)
            throw new DomainException("Order has already been confirmed");

        Status = OrderStatus.Confirmed;
        PlacedAt = DateTime.UtcNow;
    }

    public void CancelOrder()
    {
        if (Status == OrderStatus.Shipped)
            throw new DomainException("Cannot cancel a shipped order");

        Status = OrderStatus.Cancelled;
    }

    public void ShipOrder()
    {
        if (Status != OrderStatus.Confirmed)
            throw new DomainException("Can only ship confirmed orders");

        Status = OrderStatus.Shipped;
    }

    private void RecalculateTotal()
    {
        var total = _items.Sum(item => item.LineTotal.Amount);
        TotalAmount = new Money(total, "USD");
    }
}

// Domain/Enums/OrderStatus.cs
public enum OrderStatus
{
    Pending,
    Confirmed,
    Shipped,
    Delivered,
    Cancelled
}

// Domain/Entities/OrderItem.cs
public class OrderItem
{
    public Guid Id { get; private set; }
    public Product Product { get; private set; }
    public int Quantity { get; private set; }
    public Money UnitPrice { get; private set; }
    public Money LineTotal { get; private set; }

    private OrderItem() { }

    public static OrderItem Create(Product product, int quantity)
    {
        if (quantity <= 0)
            throw new DomainException("Quantity must be positive");

        var unitPrice = product.Price;
        var lineTotal = new Money(unitPrice.Amount * quantity, unitPrice.Currency);

        return new OrderItem
        {
            Id = Guid.NewGuid(),
            Product = product,
            Quantity = quantity,
            UnitPrice = unitPrice,
            LineTotal = lineTotal
        };
    }

    public void UpdateQuantity(int newQuantity)
    {
        if (newQuantity <= 0)
            throw new DomainException("Quantity must be positive");

        Quantity = newQuantity;
        LineTotal = new Money(UnitPrice.Amount * newQuantity, UnitPrice.Currency);
    }
}

// Application/UseCases/Orders/ConfirmOrder/ConfirmOrderHandler.cs
public class ConfirmOrderHandler
{
    private readonly IOrderRepository _orderRepository;
    private readonly IInventoryService _inventoryService;
    private readonly ILogger<ConfirmOrderHandler> _logger;

    public async Task<Result> Handle(ConfirmOrderCommand command)
    {
        var order = await _orderRepository.GetByIdAsync(command.OrderId);
        if (order == null)
            return Result.Failure("Order not found");

        // Check inventory for all items
        foreach (var item in order.Items)
        {
            var hasStock = await _inventoryService.CheckAvailabilityAsync(
                item.Product.Id,
                item.Quantity
            );

            if (!hasStock)
                return Result.Failure($"Insufficient stock for {item.Product.Name}");
        }

        // Confirm order (domain logic)
        order.ConfirmOrder();

        // Reserve inventory
        foreach (var item in order.Items)
        {
            await _inventoryService.ReserveStockAsync(
                item.Product.Id,
                item.Quantity
            );
        }

        await _orderRepository.UpdateAsync(order);

        _logger.LogInformation(
            "Order {OrderNumber} confirmed with {ItemCount} items",
            order.OrderNumber,
            order.ItemCount
        );

        return Result.Success();
    }
}
```

**Before vs After:**

| Technical Term | Domain Term |
|---------------|-------------|
| DataItem | Order |
| Field1 | OrderNumber |
| Field2 | TotalAmount |
| Field3 | ItemCount |
| Field4 | PlacedAt |
| Field5 | IsConfirmed → Status |
| ProcessData | ConfirmOrder |

**Benefits:**
- Code reads like business requirements
- Developers and domain experts speak same language
- Easier to understand and maintain
- Reduced translation errors

</details>

---

### Exercise 9: Bounded Contexts
**Question:** Identify bounded contexts in an e-commerce system and show how the same concept (like "Product") might differ across contexts.

<details>
<summary>Answer</summary>

**Identified Bounded Contexts:**
1. **Catalog Context** - Product browsing and searching
2. **Inventory Context** - Stock management
3. **Sales Context** - Order processing
4. **Shipping Context** - Fulfillment and delivery

```csharp
// ===== CATALOG CONTEXT =====
// Catalog/Domain/Entities/Product.cs
namespace Catalog.Domain.Entities
{
    public class Product
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; }
        public string Description { get; private set; }
        public Money Price { get; private set; }
        public string Category { get; private set; }
        public List<string> ImageUrls { get; private set; }
        public List<ProductAttribute> Attributes { get; private set; } // Color, Size, etc.
        public decimal AverageRating { get; private set; }
        public int ReviewCount { get; private set; }
        public bool IsPublished { get; private set; }

        public void Publish()
        {
            if (!IsValid())
                throw new DomainException("Cannot publish invalid product");
            IsPublished = true;
        }

        public void UpdateRating(decimal newRating)
        {
            // Recalculate average
        }

        private bool IsValid()
        {
            return !string.IsNullOrEmpty(Name) &&
                   Price.Amount > 0 &&
                   ImageUrls.Any();
        }
    }
}

// Catalog/Application/Queries/SearchProducts/SearchProductsQuery.cs
namespace Catalog.Application.Queries
{
    public record SearchProductsQuery(
        string SearchTerm,
        string Category,
        decimal? MinPrice,
        decimal? MaxPrice,
        int PageNumber,
        int PageSize
    );
}

// ===== INVENTORY CONTEXT =====
// Inventory/Domain/Entities/InventoryItem.cs
namespace Inventory.Domain.Entities
{
    public class InventoryItem
    {
        public Guid ProductId { get; private set; } // References Catalog Product
        public string SKU { get; private set; }
        public int QuantityOnHand { get; private set; }
        public int QuantityReserved { get; private set; }
        public int ReorderLevel { get; private set; }
        public int ReorderQuantity { get; private set; }
        public Location WarehouseLocation { get; private set; }

        public int AvailableQuantity => QuantityOnHand - QuantityReserved;

        public bool NeedsReorder => AvailableQuantity <= ReorderLevel;

        public void ReserveStock(int quantity)
        {
            if (AvailableQuantity < quantity)
                throw new InsufficientStockException(ProductId, quantity, AvailableQuantity);

            QuantityReserved += quantity;
        }

        public void ReceiveStock(int quantity)
        {
            if (quantity <= 0)
                throw new DomainException("Quantity must be positive");

            QuantityOnHand += quantity;
        }

        public void AdjustStock(int newQuantity, string reason)
        {
            // Stock adjustment logic with audit
            QuantityOnHand = newQuantity;
        }
    }

    public record Location(string Warehouse, string Aisle, string Shelf, string Bin);
}

// ===== SALES CONTEXT =====
// Sales/Domain/Entities/OrderLine.cs
namespace Sales.Domain.Entities
{
    public class OrderLine
    {
        public Guid ProductId { get; private set; } // References Catalog Product
        public string ProductName { get; private set; } // Denormalized
        public string SKU { get; private set; }
        public int Quantity { get; private set; }
        public Money UnitPrice { get; private set; } // Price at time of order
        public Money LineTotal { get; private set; }
        public decimal DiscountPercentage { get; private set; }
        public Money DiscountAmount { get; private set; }

        public void ApplyDiscount(decimal percentage)
        {
            if (percentage < 0 || percentage > 100)
                throw new DomainException("Invalid discount percentage");

            DiscountPercentage = percentage;
            DiscountAmount = new Money(
                LineTotal.Amount * (percentage / 100),
                LineTotal.Currency
            );
        }

        // In Sales context, product is immutable snapshot at time of order
    }

    public class Order
    {
        public Guid Id { get; private set; }
        public string OrderNumber { get; private set; }
        public Guid CustomerId { get; private set; }
        private readonly List<OrderLine> _lines = new();
        public IReadOnlyCollection<OrderLine> Lines => _lines.AsReadOnly();

        public Money Subtotal { get; private set; }
        public Money TaxAmount { get; private set; }
        public Money Total { get; private set; }
        public OrderStatus Status { get; private set; }

        public void CalculateTotals()
        {
            var subtotal = _lines.Sum(l => l.LineTotal.Amount - l.DiscountAmount.Amount);
            Subtotal = new Money(subtotal, "USD");

            TaxAmount = new Money(subtotal * 0.08m, "USD"); // 8% tax
            Total = new Money(Subtotal.Amount + TaxAmount.Amount, "USD");
        }
    }
}

// ===== SHIPPING CONTEXT =====
// Shipping/Domain/Entities/ShipmentItem.cs
namespace Shipping.Domain.Entities
{
    public class ShipmentItem
    {
        public Guid ProductId { get; private set; }
        public string SKU { get; private set; }
        public string ProductName { get; private set; }
        public int Quantity { get; private set; }
        public Weight Weight { get; private set; }
        public Dimensions Dimensions { get; private set; }
        public bool IsFragile { get; private set; }
        public bool RequiresColdStorage { get; private set; }

        // In Shipping context, we care about physical properties
        public decimal CalculateVolumetricWeight()
        {
            var volumetricWeight = (Dimensions.Length * Dimensions.Width * Dimensions.Height) / 5000;
            return Math.Max(Weight.Kilograms, volumetricWeight);
        }
    }

    public class Shipment
    {
        public Guid Id { get; private set; }
        public Guid OrderId { get; private set; } // References Sales Order
        private readonly List<ShipmentItem> _items = new();
        public IReadOnlyCollection<ShipmentItem> Items => _items.AsReadOnly();

        public Address ShippingAddress { get; private set; }
        public ShippingMethod Method { get; private set; }
        public string TrackingNumber { get; private set; }
        public DateTime? ShippedAt { get; private set; }
        public DateTime? EstimatedDelivery { get; private set; }

        public void AssignTrackingNumber(string trackingNumber)
        {
            if (string.IsNullOrWhiteSpace(trackingNumber))
                throw new DomainException("Tracking number is required");

            TrackingNumber = trackingNumber;
        }

        public void Ship()
        {
            if (string.IsNullOrEmpty(TrackingNumber))
                throw new DomainException("Cannot ship without tracking number");

            ShippedAt = DateTime.UtcNow;
            EstimatedDelivery = CalculateEstimatedDelivery();
        }

        private DateTime CalculateEstimatedDelivery()
        {
            return Method switch
            {
                ShippingMethod.Standard => DateTime.UtcNow.AddDays(5),
                ShippingMethod.Express => DateTime.UtcNow.AddDays(2),
                ShippingMethod.Overnight => DateTime.UtcNow.AddDays(1),
                _ => throw new NotImplementedException()
            };
        }
    }

    public record Weight(decimal Kilograms);
    public record Dimensions(decimal Length, decimal Width, decimal Height);
    public enum ShippingMethod { Standard, Express, Overnight }
}

// ===== CONTEXT MAPPING =====
// Shared/Integration/Events/ProductCreatedEvent.cs
namespace Shared.Integration.Events
{
    // Integration event to sync Product across contexts
    public record ProductCreatedEvent(
        Guid ProductId,
        string Name,
        string SKU,
        decimal PriceAmount,
        string Currency,
        decimal WeightKg,
        decimal Length,
        decimal Width,
        decimal Height
    );
}

// Catalog/Application/EventHandlers/PublishProductEventHandler.cs
namespace Catalog.Application.EventHandlers
{
    public class PublishProductEventHandler
    {
        private readonly IEventBus _eventBus;

        public async Task Handle(ProductPublishedDomainEvent domainEvent)
        {
            // Translate domain event to integration event
            var integrationEvent = new ProductCreatedEvent(
                domainEvent.ProductId,
                domainEvent.Name,
                domainEvent.SKU,
                domainEvent.Price.Amount,
                domainEvent.Price.Currency,
                // ... other properties
            );

            await _eventBus.PublishAsync(integrationEvent);
        }
    }
}

// Inventory/Application/EventHandlers/ProductCreatedEventHandler.cs
namespace Inventory.Application.EventHandlers
{
    public class ProductCreatedEventHandler
    {
        private readonly IInventoryRepository _repository;

        public async Task Handle(ProductCreatedEvent @event)
        {
            // Create inventory item in Inventory context
            var inventoryItem = InventoryItem.Create(
                @event.ProductId,
                @event.SKU,
                initialQuantity: 0,
                reorderLevel: 10
            );

            await _repository.AddAsync(inventoryItem);
        }
    }
}
```

**Key Points:**

| Context | Product Representation | Primary Concerns |
|---------|----------------------|------------------|
| Catalog | Rich product info, images, reviews | Browsing, searching, merchandising |
| Inventory | SKU, quantities, location | Stock levels, warehouse management |
| Sales | Price snapshot, line items | Orders, pricing, discounts |
| Shipping | Weight, dimensions, fragility | Logistics, delivery, tracking |

**Context Integration:**
- Each context has its own model of "Product"
- Integration events synchronize data across contexts
- Anti-Corruption Layer prevents external models from polluting domain
- Shared Kernel only for truly shared concepts (like Money)

</details>

---

## Entity vs Value Object

### Exercise 10: Identify Entities and Value Objects
**Question:** Classify each of these as Entity or Value Object and explain why:
1. Customer
2. Address
3. Money
4. Order
5. Email
6. ProductReview
7. DateRange

<details>
<summary>Answer</summary>

**Classification:**

**1. Customer - ENTITY**
```csharp
public class Customer
{
    public Guid Id { get; private set; } // Identity
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public Email Email { get; private set; }
    public DateTime RegisteredAt { get; private set; }

    // Identity is important - same customer even if email changes
    public void UpdateEmail(Email newEmail)
    {
        Email = newEmail;
        // Still the same customer!
    }
}
```
**Why:** Has identity, mutable, lifecycle matters, two customers with identical data are still different customers.

**2. Address - VALUE OBJECT**
```csharp
public record Address(
    string Street,
    string City,
    string State,
    string ZipCode,
    string Country)
{
    public static Address Create(string street, string city, string state, string zip, string country)
    {
        // Validation
        if (string.IsNullOrWhiteSpace(street))
            throw new ArgumentException("Street is required");

        return new Address(street, city, state, zip, country);
    }
}

// Usage
var address1 = new Address("123 Main St", "NYC", "NY", "10001", "USA");
var address2 = new Address("123 Main St", "NYC", "NY", "10001", "USA");
// address1 == address2 (value equality)
```
**Why:** No identity, immutable, equality based on values, interchangeable if values match.

**3. Money - VALUE OBJECT**
```csharp
public record Money(decimal Amount, string Currency)
{
    public Money Add(Money other)
    {
        if (Currency != other.Currency)
            throw new InvalidOperationException("Cannot add different currencies");

        return new Money(Amount + other.Amount, Currency);
    }

    public Money Multiply(decimal factor)
    {
        return new Money(Amount * factor, Currency);
    }
}

// Usage
var price1 = new Money(100, "USD");
var price2 = new Money(100, "USD");
// price1 == price2 (value equality)
```
**Why:** No identity, immutable, defined by its value, 100 USD is always 100 USD.

**4. Order - ENTITY**
```csharp
public class Order
{
    public Guid Id { get; private set; } // Identity
    public string OrderNumber { get; private set; }
    public OrderStatus Status { get; private set; }
    public DateTime PlacedAt { get; private set; }

    // Lifecycle and state changes matter
    public void Ship()
    {
        if (Status != OrderStatus.Confirmed)
            throw new InvalidOperationException("Can only ship confirmed orders");
        Status = OrderStatus.Shipped;
        // Still the same order, just different status
    }
}
```
**Why:** Has identity, mutable, lifecycle matters, tracks state changes over time.

**5. Email - VALUE OBJECT**
```csharp
public record Email
{
    public string Value { get; }

    private Email(string value)
    {
        Value = value;
    }

    public static Result<Email> Create(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return Result.Failure<Email>("Email is required");

        if (!IsValidEmail(email))
            return Result.Failure<Email>("Invalid email format");

        return Result.Success(new Email(email.ToLowerInvariant()));
    }

    private static bool IsValidEmail(string email)
    {
        return Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$");
    }
}

// Usage
var email1 = Email.Create("john@example.com").Value;
var email2 = Email.Create("john@example.com").Value;
// email1 == email2 (value equality)
```
**Why:** No identity, immutable, validated at creation, two identical emails are interchangeable.

**6. ProductReview - ENTITY**
```csharp
public class ProductReview
{
    public Guid Id { get; private set; } // Identity
    public Guid ProductId { get; private set; }
    public Guid CustomerId { get; private set; }
    public int Rating { get; private set; }
    public string Comment { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public int HelpfulVotes { get; private set; }

    // Can be edited, votes can change
    public void Edit(int newRating, string newComment)
    {
        Rating = newRating;
        Comment = newComment;
        UpdatedAt = DateTime.UtcNow;
        // Still the same review!
    }

    public void AddHelpfulVote()
    {
        HelpfulVotes++;
    }
}
```
**Why:** Has identity, mutable, tracks who wrote it and when, can be edited, accumulates votes.

**7. DateRange - VALUE OBJECT**
```csharp
public record DateRange
{
    public DateTime Start { get; }
    public DateTime End { get; }

    private DateRange(DateTime start, DateTime end)
    {
        Start = start;
        End = end;
    }

    public static Result<DateRange> Create(DateTime start, DateTime end)
    {
        if (start > end)
            return Result.Failure<DateRange>("Start date must be before end date");

        return Result.Success(new DateRange(start, end));
    }

    public bool Contains(DateTime date)
    {
        return date >= Start && date <= End;
    }

    public bool Overlaps(DateRange other)
    {
        return Start <= other.End && End >= other.Start;
    }

    public int DurationInDays => (End - Start).Days;
}

// Usage
var range1 = DateRange.Create(DateTime.Today, DateTime.Today.AddDays(7)).Value;
var range2 = DateRange.Create(DateTime.Today, DateTime.Today.AddDays(7)).Value;
// range1 == range2 (value equality)
```
**Why:** No identity, immutable, defined by its values, provides behavior based on values.

**Summary:**

| Concept | Type | Key Characteristic |
|---------|------|-------------------|
| Customer | Entity | Has identity, mutable |
| Address | Value Object | No identity, immutable, value equality |
| Money | Value Object | No identity, immutable, mathematical operations |
| Order | Entity | Has identity, lifecycle, state changes |
| Email | Value Object | No identity, validated, immutable |
| ProductReview | Entity | Has identity, mutable, tracks authorship |
| DateRange | Value Object | No identity, immutable, defined by dates |

**Decision Criteria:**
- **Entity:** Ask "Is this the same thing even if properties change?" → YES = Entity
- **Value Object:** Ask "Does identity matter or just the values?" → Values only = Value Object

</details>

---

### Exercise 11: Implement Value Object with Validation
**Question:** Create a PhoneNumber value object with comprehensive validation and formatting.

<details>
<summary>Answer</summary>

```csharp
// Domain/ValueObjects/PhoneNumber.cs
public record PhoneNumber
{
    public string CountryCode { get; }
    public string Number { get; }
    public PhoneNumberType Type { get; }

    private PhoneNumber(string countryCode, string number, PhoneNumberType type)
    {
        CountryCode = countryCode;
        Number = number;
        Type = type;
    }

    public static Result<PhoneNumber> Create(
        string phoneNumber,
        PhoneNumberType type = PhoneNumberType.Mobile)
    {
        if (string.IsNullOrWhiteSpace(phoneNumber))
            return Result.Failure<PhoneNumber>("Phone number is required");

        // Remove formatting characters
        var cleaned = CleanPhoneNumber(phoneNumber);

        // Extract country code and number
        var (countryCode, number, error) = ExtractComponents(cleaned);
        if (error != null)
            return Result.Failure<PhoneNumber>(error);

        // Validate
        var validationError = Validate(countryCode, number);
        if (validationError != null)
            return Result.Failure<PhoneNumber>(validationError);

        return Result.Success(new PhoneNumber(countryCode, number, type));
    }

    private static string CleanPhoneNumber(string phoneNumber)
    {
        // Remove spaces, dashes, parentheses, etc.
        return Regex.Replace(phoneNumber, @"[\s\-\(\)\.]", "");
    }

    private static (string countryCode, string number, string error) ExtractComponents(string cleaned)
    {
        // Handle +1 (555) 123-4567 or 15551234567 or 5551234567
        if (cleaned.StartsWith("+"))
        {
            cleaned = cleaned.Substring(1);
        }

        // USA/Canada (starts with 1)
        if (cleaned.StartsWith("1") && cleaned.Length == 11)
        {
            return ("+1", cleaned.Substring(1), null);
        }

        // Assume USA if 10 digits
        if (cleaned.Length == 10 && cleaned.All(char.IsDigit))
        {
            return ("+1", cleaned, null);
        }

        // Other countries - require + and country code
        if (cleaned.Length > 10 && cleaned.All(char.IsDigit))
        {
            // Extract first 1-3 digits as country code
            var countryCode = $"+{cleaned.Substring(0, Math.Min(3, cleaned.Length))}";
            var number = cleaned.Substring(Math.Min(3, cleaned.Length));
            return (countryCode, number, null);
        }

        return (null, null, "Invalid phone number format");
    }

    private static string Validate(string countryCode, string number)
    {
        if (!number.All(char.IsDigit))
            return "Phone number must contain only digits";

        // USA/Canada validation
        if (countryCode == "+1")
        {
            if (number.Length != 10)
                return "USA/Canada phone numbers must be 10 digits";

            var areaCode = number.Substring(0, 3);
            var prefix = number.Substring(3, 3);

            // Area code can't start with 0 or 1
            if (areaCode[0] == '0' || areaCode[0] == '1')
                return "Invalid area code";

            // Prefix can't start with 0 or 1
            if (prefix[0] == '0' || prefix[0] == '1')
                return "Invalid prefix";
        }

        // General validation
        if (number.Length < 7 || number.Length > 15)
            return "Phone number must be between 7 and 15 digits";

        return null;
    }

    // Formatted output
    public string ToFormattedString()
    {
        if (CountryCode == "+1" && Number.Length == 10)
        {
            // Format as (555) 123-4567
            return $"({Number.Substring(0, 3)}) {Number.Substring(3, 3)}-{Number.Substring(6)}";
        }

        return $"{CountryCode} {Number}";
    }

    public string ToInternationalFormat()
    {
        return $"{CountryCode}{Number}";
    }

    // Override ToString for display
    public override string ToString() => ToFormattedString();
}

// Domain/Enums/PhoneNumberType.cs
public enum PhoneNumberType
{
    Mobile,
    Home,
    Work,
    Fax
}

// Domain/ValueObjects/Result.cs (Helper)
public class Result<T>
{
    public bool IsSuccess { get; }
    public T Value { get; }
    public string Error { get; }

    private Result(bool isSuccess, T value, string error)
    {
        IsSuccess = isSuccess;
        Value = value;
        Error = error;
    }

    public static Result<T> Success(T value) => new(true, value, null);
    public static Result<T> Failure(string error) => new(false, default, error);
}

// Usage Examples
public class PhoneNumberExamples
{
    public void Examples()
    {
        // Valid formats
        var phone1 = PhoneNumber.Create("+1 (555) 123-4567");
        var phone2 = PhoneNumber.Create("555-123-4567");
        var phone3 = PhoneNumber.Create("15551234567");
        var phone4 = PhoneNumber.Create("+44 20 7946 0958", PhoneNumberType.Work);

        if (phone1.IsSuccess)
        {
            Console.WriteLine(phone1.Value.ToFormattedString()); // (555) 123-4567
            Console.WriteLine(phone1.Value.ToInternationalFormat()); // +15551234567
        }

        // Invalid formats
        var invalidPhone = PhoneNumber.Create("123"); // Too short
        if (!invalidPhone.IsSuccess)
        {
            Console.WriteLine(invalidPhone.Error); // "Phone number must be between 7 and 15 digits"
        }

        // Value equality
        var phoneA = PhoneNumber.Create("555-123-4567").Value;
        var phoneB = PhoneNumber.Create("(555) 123-4567").Value;
        Console.WriteLine(phoneA == phoneB); // True - same values

        // Immutability - must create new instance
        var newPhone = PhoneNumber.Create("555-999-8888").Value;
        // Can't modify phoneA, must replace with newPhone
    }
}

// Entity using PhoneNumber value object
public class Customer
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public PhoneNumber MobilePhone { get; private set; }
    public PhoneNumber HomePhone { get; private set; }
    public PhoneNumber WorkPhone { get; private set; }

    public void UpdateMobilePhone(PhoneNumber newPhone)
    {
        if (newPhone.Type != PhoneNumberType.Mobile)
            throw new DomainException("Mobile phone must be of type Mobile");

        MobilePhone = newPhone;
    }

    public PhoneNumber GetPreferredPhone()
    {
        return MobilePhone ?? HomePhone ?? WorkPhone;
    }
}

// EF Core Configuration
public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        // Value object as owned entity
        builder.OwnsOne(c => c.MobilePhone, phone =>
        {
            phone.Property(p => p.CountryCode).HasColumnName("MobilePhoneCountryCode");
            phone.Property(p => p.Number).HasColumnName("MobilePhoneNumber");
            phone.Property(p => p.Type).HasColumnName("MobilePhoneType");
        });

        builder.OwnsOne(c => c.HomePhone, phone =>
        {
            phone.Property(p => p.CountryCode).HasColumnName("HomePhoneCountryCode");
            phone.Property(p => p.Number).HasColumnName("HomePhoneNumber");
            phone.Property(p => p.Type).HasColumnName("HomePhoneType");
        });
    }
}

// Testing
public class PhoneNumberTests
{
    [Theory]
    [InlineData("+1 (555) 123-4567", true)]
    [InlineData("555-123-4567", true)]
    [InlineData("5551234567", true)]
    [InlineData("(555) 123-4567", true)]
    [InlineData("+44 20 7946 0958", true)]
    [InlineData("123", false)] // Too short
    [InlineData("abc-def-ghij", false)] // Not digits
    [InlineData("", false)] // Empty
    public void Create_ShouldValidatePhoneNumber(string input, bool shouldSucceed)
    {
        // Act
        var result = PhoneNumber.Create(input);

        // Assert
        Assert.Equal(shouldSucceed, result.IsSuccess);
    }

    [Fact]
    public void TwoPhoneNumbers_WithSameValue_ShouldBeEqual()
    {
        // Arrange
        var phone1 = PhoneNumber.Create("555-123-4567").Value;
        var phone2 = PhoneNumber.Create("(555) 123-4567").Value;

        // Assert
        Assert.Equal(phone1, phone2);
    }

    [Fact]
    public void PhoneNumber_ShouldFormatCorrectly()
    {
        // Arrange
        var phone = PhoneNumber.Create("5551234567").Value;

        // Assert
        Assert.Equal("(555) 123-4567", phone.ToFormattedString());
        Assert.Equal("+15551234567", phone.ToInternationalFormat());
    }
}
```

**Key Features:**
1. Immutable - uses record type
2. Self-validating - validation in Create method
3. No invalid state possible - private constructor
4. Value equality - records provide this automatically
5. Multiple formats - formatted output methods
6. Rich behavior - country code extraction, formatting
7. Returns Result<T> - explicit success/failure
8. EF Core integration - configured as owned entity

</details>

---

(Continuing with more exercises... Due to length, I'll create the complete file)

</details>

---

## Aggregate Design

### Exercise 12: Design an Aggregate
**Question:** Design an Order aggregate that maintains consistency across Order, OrderItems, and applies business rules.

<details>
<summary>Answer</summary>

```csharp
// Domain/Aggregates/OrderAggregate/Order.cs
public class Order : AggregateRoot
{
    public Guid Id { get; private set; }
    public string OrderNumber { get; private set; }
    public Guid CustomerId { get; private set; }

    private readonly List<OrderItem> _items = new();
    public IReadOnlyCollection<OrderItem> Items => _items.AsReadOnly();

    public OrderStatus Status { get; private set; }
    public DateTime PlacedAt { get; private set; }
    public Money Subtotal { get; private set; }
    public Money Tax { get; private set; }
    public Money Total { get; private set; }
    public Address ShippingAddress { get; private set; }

    // Aggregate invariant: Max 50 items per order
    private const int MaxItemsPerOrder = 50;

    // Aggregate invariant: Order must have at least one item to confirm
    private const int MinItemsToConfirm = 1;

    private Order() { } // EF Core

    public static Order Create(Guid customerId, Address shippingAddress)
    {
        var order = new Order
        {
            Id = Guid.NewGuid(),
            OrderNumber = GenerateOrderNumber(),
            CustomerId = customerId,
            Status = OrderStatus.Draft,
            PlacedAt = DateTime.UtcNow,
            ShippingAddress = shippingAddress ?? throw new ArgumentNullException(nameof(shippingAddress))
        };

        order.AddDomainEvent(new OrderCreatedEvent(order.Id, customerId));
        return order;
    }

    public void AddItem(Guid productId, string productName, Money unitPrice, int quantity)
    {
        // Enforce invariants
        if (Status != OrderStatus.Draft)
            throw new DomainException("Cannot add items to a non-draft order");

        if (_items.Count >= MaxItemsPerOrder)
            throw new DomainException($"Cannot add more than {MaxItemsPerOrder} items");

        // Check if item already exists
        var existingItem = _items.FirstOrDefault(i => i.ProductId == productId);
        if (existingItem != null)
        {
            existingItem.UpdateQuantity(existingItem.Quantity + quantity);
        }
        else
        {
            var item = OrderItem.Create(productId, productName, unitPrice, quantity);
            _items.Add(item);
        }

        RecalculateTotals();
        AddDomainEvent(new OrderItemAddedEvent(Id, productId, quantity));
    }

    public void RemoveItem(Guid itemId)
    {
        if (Status != OrderStatus.Draft)
            throw new DomainException("Cannot remove items from a non-draft order");

        var item = _items.FirstOrDefault(i => i.Id == itemId);
        if (item == null)
            throw new DomainException("Item not found");

        _items.Remove(item);
        RecalculateTotals();
        AddDomainEvent(new OrderItemRemovedEvent(Id, itemId));
    }

    public void UpdateItemQuantity(Guid itemId, int newQuantity)
    {
        if (Status != OrderStatus.Draft)
            throw new DomainException("Cannot update items in a non-draft order");

        var item = _items.FirstOrDefault(i => i.Id == itemId);
        if (item == null)
            throw new DomainException("Item not found");

        item.UpdateQuantity(newQuantity);
        RecalculateTotals();
    }

    public void Confirm()
    {
        // Enforce invariants
        if (Status != OrderStatus.Draft)
            throw new DomainException("Only draft orders can be confirmed");

        if (_items.Count < MinItemsToConfirm)
            throw new DomainException("Order must have at least one item");

        Status = OrderStatus.Confirmed;
        PlacedAt = DateTime.UtcNow;
        AddDomainEvent(new OrderConfirmedEvent(Id, Total.Amount));
    }

    public void Cancel(string reason)
    {
        if (Status == OrderStatus.Shipped || Status == OrderStatus.Delivered)
            throw new DomainException("Cannot cancel a shipped or delivered order");

        if (Status == OrderStatus.Cancelled)
            throw new DomainException("Order is already cancelled");

        Status = OrderStatus.Cancelled;
        AddDomainEvent(new OrderCancelledEvent(Id, reason));
    }

    public void Ship(string trackingNumber)
    {
        if (Status != OrderStatus.Confirmed)
            throw new DomainException("Only confirmed orders can be shipped");

        if (string.IsNullOrWhiteSpace(trackingNumber))
            throw new ArgumentException("Tracking number is required");

        Status = OrderStatus.Shipped;
        AddDomainEvent(new OrderShippedEvent(Id, trackingNumber));
    }

    private void RecalculateTotals()
    {
        if (!_items.Any())
        {
            Subtotal = Money.Zero("USD");
            Tax = Money.Zero("USD");
            Total = Money.Zero("USD");
            return;
        }

        var subtotal = _items.Sum(i => i.LineTotal.Amount);
        Subtotal = new Money(subtotal, "USD");

        // Calculate tax (8%)
        var taxAmount = subtotal * 0.08m;
        Tax = new Money(taxAmount, "USD");

        Total = new Money(Subtotal.Amount + Tax.Amount, "USD");
    }

    private static string GenerateOrderNumber()
    {
        return $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";
    }
}

// Domain/Aggregates/OrderAggregate/OrderItem.cs (Entity within aggregate)
public class OrderItem : Entity
{
    public Guid Id { get; private set; }
    public Guid ProductId { get; private set; }
    public string ProductName { get; private set; }
    public Money UnitPrice { get; private set; }
    public int Quantity { get; private set; }
    public Money LineTotal { get; private set; }

    private OrderItem() { }

    internal static OrderItem Create(Guid productId, string productName, Money unitPrice, int quantity)
    {
        if (quantity <= 0)
            throw new DomainException("Quantity must be positive");

        var item = new OrderItem
        {
            Id = Guid.NewGuid(),
            ProductId = productId,
            ProductName = productName,
            UnitPrice = unitPrice,
            Quantity = quantity
        };

        item.CalculateLineTotal();
        return item;
    }

    internal void UpdateQuantity(int newQuantity)
    {
        if (newQuantity <= 0)
            throw new DomainException("Quantity must be positive");

        Quantity = newQuantity;
        CalculateLineTotal();
    }

    private void CalculateLineTotal()
    {
        LineTotal = new Money(UnitPrice.Amount * Quantity, UnitPrice.Currency);
    }
}

// Domain/Common/AggregateRoot.cs
public abstract class AggregateRoot : Entity
{
    private readonly List<IDomainEvent> _domainEvents = new();
    public IReadOnlyList<IDomainEvent> DomainEvents => _domainEvents.AsReadOnly();

    protected void AddDomainEvent(IDomainEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }

    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }
}

// Application/UseCases/Orders/CreateOrder/CreateOrderHandler.cs
public class CreateOrderHandler
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;

    public async Task<Result<Guid>> Handle(CreateOrderCommand command)
    {
        // Create aggregate
        var address = Address.Create(
            command.Street,
            command.City,
            command.State,
            command.ZipCode,
            command.Country
        );

        var order = Order.Create(command.CustomerId, address);

        // Add items
        foreach (var item in command.Items)
        {
            var product = await _productRepository.GetByIdAsync(item.ProductId);
            if (product == null)
                return Result.Failure<Guid>($"Product {item.ProductId} not found");

            order.AddItem(
                product.Id,
                product.Name,
                product.Price,
                item.Quantity
            );
        }

        // Persist aggregate as a whole
        await _orderRepository.AddAsync(order);

        return Result.Success(order.Id);
    }
}
```

**Aggregate Design Principles:**
1. Order is the aggregate root
2. OrderItems are entities within the aggregate
3. Can only modify OrderItems through Order
4. All invariants enforced by Order
5. Changes to aggregate generate domain events
6. Repository operates on aggregate root
7. Transactional consistency within aggregate boundary

</details>

---

## Repository Pattern

### Exercise 13: Implement Repository Pattern
**Question:** Implement a repository for the Order aggregate with proper abstraction.

<details>
<summary>Answer</summary>

```csharp
// Application/Interfaces/IOrderRepository.cs
public interface IOrderRepository
{
    Task<Order> GetByIdAsync(Guid id);
    Task<Order> GetByOrderNumberAsync(string orderNumber);
    Task<IEnumerable<Order>> GetByCustomerIdAsync(Guid customerId);
    Task<IEnumerable<Order>> GetPendingOrdersAsync();
    Task AddAsync(Order order);
    Task UpdateAsync(Order order);
    Task DeleteAsync(Guid id);
}

// Infrastructure/Persistence/OrderRepository.cs
public class OrderRepository : IOrderRepository
{
    private readonly ApplicationDbContext _context;
    private readonly IMediator _mediator;

    public OrderRepository(ApplicationDbContext context, IMediator mediator)
    {
        _context = context;
        _mediator = mediator;
    }

    public async Task<Order> GetByIdAsync(Guid id)
    {
        return await _context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<Order> GetByOrderNumberAsync(string orderNumber)
    {
        return await _context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);
    }

    public async Task<IEnumerable<Order>> GetByCustomerIdAsync(Guid customerId)
    {
        return await _context.Orders
            .Include(o => o.Items)
            .Where(o => o.CustomerId == customerId)
            .OrderByDescending(o => o.PlacedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetPendingOrdersAsync()
    {
        return await _context.Orders
            .Include(o => o.Items)
            .Where(o => o.Status == OrderStatus.Confirmed)
            .ToListAsync();
    }

    public async Task AddAsync(Order order)
    {
        await _context.Orders.AddAsync(order);
        await SaveChangesAndDispatchEventsAsync(order);
    }

    public async Task UpdateAsync(Order order)
    {
        _context.Orders.Update(order);
        await SaveChangesAndDispatchEventsAsync(order);
    }

    public async Task DeleteAsync(Guid id)
    {
        var order = await GetByIdAsync(id);
        if (order != null)
        {
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
        }
    }

    private async Task SaveChangesAndDispatchEventsAsync(Order order)
    {
        await _context.SaveChangesAsync();

        // Dispatch domain events
        foreach (var domainEvent in order.DomainEvents)
        {
            await _mediator.Publish(domainEvent);
        }

        order.ClearDomainEvents();
    }
}
```

</details>

---

## Use Case/Interactor Implementation

### Exercise 14: CQRS with MediatR
**Question:** Implement a complete use case for placing an order using CQRS pattern with MediatR.

<details>
<summary>Answer</summary>

```csharp
// Application/UseCases/Orders/PlaceOrder/PlaceOrderCommand.cs
public record PlaceOrderCommand(
    Guid CustomerId,
    Address ShippingAddress,
    List<OrderItemDto> Items
) : IRequest<Result<PlaceOrderResponse>>;

public record OrderItemDto(Guid ProductId, int Quantity);

public record PlaceOrderResponse(
    Guid OrderId,
    string OrderNumber,
    decimal TotalAmount
);

// Application/UseCases/Orders/PlaceOrder/PlaceOrderHandler.cs
public class PlaceOrderHandler : IRequestHandler<PlaceOrderCommand, Result<PlaceOrderResponse>>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;
    private readonly IInventoryService _inventoryService;
    private readonly ILogger<PlaceOrderHandler> _logger;

    public PlaceOrderHandler(
        IOrderRepository orderRepository,
        IProductRepository productRepository,
        IInventoryService inventoryService,
        ILogger<PlaceOrderHandler> logger)
    {
        _orderRepository = orderRepository;
        _productRepository = productRepository;
        _inventoryService = inventoryService;
        _logger = logger;
    }

    public async Task<Result<PlaceOrderResponse>> Handle(
        PlaceOrderCommand command,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Placing order for customer {CustomerId}", command.CustomerId);

        // Create order aggregate
        var order = Order.Create(command.CustomerId, command.ShippingAddress);

        // Add items and check inventory
        foreach (var itemDto in command.Items)
        {
            var product = await _productRepository.GetByIdAsync(itemDto.ProductId);
            if (product == null)
            {
                _logger.LogWarning("Product {ProductId} not found", itemDto.ProductId);
                return Result.Failure<PlaceOrderResponse>($"Product {itemDto.ProductId} not found");
            }

            // Check inventory
            var hasStock = await _inventoryService.CheckAvailabilityAsync(
                itemDto.ProductId,
                itemDto.Quantity
            );

            if (!hasStock)
            {
                _logger.LogWarning("Insufficient stock for product {ProductName}", product.Name);
                return Result.Failure<PlaceOrderResponse>($"Insufficient stock for {product.Name}");
            }

            order.AddItem(product.Id, product.Name, product.Price, itemDto.Quantity);
        }

        // Confirm order
        order.Confirm();

        // Reserve inventory
        foreach (var item in order.Items)
        {
            await _inventoryService.ReserveStockAsync(item.ProductId, item.Quantity);
        }

        // Save
        await _orderRepository.AddAsync(order);

        _logger.LogInformation(
            "Order {OrderNumber} placed successfully with total {Total}",
            order.OrderNumber,
            order.Total.Amount
        );

        return Result.Success(new PlaceOrderResponse(
            order.Id,
            order.OrderNumber,
            order.Total.Amount
        ));
    }
}

// Application/UseCases/Orders/PlaceOrder/PlaceOrderValidator.cs
public class PlaceOrderValidator : AbstractValidator<PlaceOrderCommand>
{
    public PlaceOrderValidator()
    {
        RuleFor(x => x.CustomerId)
            .NotEmpty().WithMessage("Customer ID is required");

        RuleFor(x => x.ShippingAddress)
            .NotNull().WithMessage("Shipping address is required");

        RuleFor(x => x.Items)
            .NotEmpty().WithMessage("Order must have at least one item")
            .Must(items => items.Count <= 50).WithMessage("Order cannot have more than 50 items");

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.ProductId)
                .NotEmpty().WithMessage("Product ID is required");

            item.RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("Quantity must be positive")
                .LessThanOrEqualTo(100).WithMessage("Quantity cannot exceed 100");
        });
    }
}

// API/Controllers/OrdersController.cs
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
    public async Task<IActionResult> PlaceOrder([FromBody] PlaceOrderRequest request)
    {
        var address = Address.Create(
            request.Street,
            request.City,
            request.State,
            request.ZipCode,
            request.Country
        );

        var command = new PlaceOrderCommand(
            request.CustomerId,
            address,
            request.Items.Select(i => new OrderItemDto(i.ProductId, i.Quantity)).ToList()
        );

        var result = await _mediator.Send(command);

        return result.IsSuccess
            ? Ok(result.Value)
            : BadRequest(new { error = result.Error });
    }
}
```

</details>

---

## Clean Architecture in ASP.NET Core

### Exercise 15: Configure DI Container
**Question:** Set up the dependency injection container following Clean Architecture principles.

<details>
<summary>Answer</summary>

```csharp
// API/Program.cs
var builder = WebApplication.CreateBuilder(args);

// Add Application services
builder.Services.AddApplication();

// Add Infrastructure services
builder.Services.AddInfrastructure(builder.Configuration);

// Add Presentation services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

// Application/DependencyInjection.cs
public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg => {
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
        });

        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));

        services.AddAutoMapper(Assembly.GetExecutingAssembly());

        return services;
    }
}

// Infrastructure/DependencyInjection.cs
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Database
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)
            )
        );

        // Repositories
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<ICustomerRepository, CustomerRepository>();

        // External Services
        services.AddScoped<IEmailService, SmtpEmailService>();
        services.AddScoped<IPaymentGateway, StripePaymentAdapter>();

        // Caching
        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = configuration.GetConnectionString("Redis");
        });

        return services;
    }
}
```

</details>

---

## Testing Strategies

### Exercise 16: Unit Test Domain Logic
**Question:** Write comprehensive unit tests for the Order aggregate.

<details>
<summary>Answer</summary>

```csharp
public class OrderTests
{
    [Fact]
    public void Create_ShouldCreateOrderInDraftStatus()
    {
        // Arrange
        var customerId = Guid.NewGuid();
        var address = CreateValidAddress();

        // Act
        var order = Order.Create(customerId, address);

        // Assert
        Assert.NotNull(order);
        Assert.Equal(customerId, order.CustomerId);
        Assert.Equal(OrderStatus.Draft, order.Status);
        Assert.Empty(order.Items);
    }

    [Fact]
    public void AddItem_ShouldAddItemToOrder()
    {
        // Arrange
        var order = CreateValidOrder();
        var productId = Guid.NewGuid();
        var price = new Money(10.00m, "USD");

        // Act
        order.AddItem(productId, "Product", price, 2);

        // Assert
        Assert.Single(order.Items);
        Assert.Equal(20.00m, order.Subtotal.Amount);
    }

    [Fact]
    public void Confirm_WithNoItems_ShouldThrowException()
    {
        // Arrange
        var order = CreateValidOrder();

        // Act & Assert
        Assert.Throws<DomainException>(() => order.Confirm());
    }

    [Fact]
    public void AddItem_ToConfirmedOrder_ShouldThrowException()
    {
        // Arrange
        var order = CreateValidOrderWithItems();
        order.Confirm();

        // Act & Assert
        Assert.Throws<DomainException>(() =>
            order.AddItem(Guid.NewGuid(), "Product", new Money(10, "USD"), 1)
        );
    }

    private Order CreateValidOrder()
    {
        return Order.Create(Guid.NewGuid(), CreateValidAddress());
    }

    private Address CreateValidAddress()
    {
        return Address.Create("123 Main St", "City", "State", "12345", "USA");
    }
}
```

</details>

---

## Cross-Cutting Concerns

### Exercise 17: Add a Validation Pipeline Behavior
**Question:** Implement a MediatR pipeline behavior that runs FluentValidation before handlers.

<details>
<summary>Answer</summary>

```csharp
public class ValidationBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken ct)
    {
        if (_validators.Any())
        {
            var context = new ValidationContext<TRequest>(request);
            var results = await Task.WhenAll(
                _validators.Select(v => v.ValidateAsync(context, ct)));

            var failures = results.SelectMany(r => r.Errors)
                .Where(f => f != null)
                .ToList();

            if (failures.Count > 0)
                throw new BadRequestException("Validation failed", failures);
        }

        return await next();
    }
}
```

Register the behavior in the Application layer so validation is enforced consistently.
</details>

---

### Exercise 18: Add Logging Around Use Cases
**Question:** Add structured logging around a use case without polluting domain code.

<details>
<summary>Answer</summary>

Use a pipeline behavior or decorator:

```csharp
public class LoggingBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken ct)
    {
        _logger.LogInformation("Handling {Request}", typeof(TRequest).Name);
        var response = await next();
        _logger.LogInformation("Handled {Request}", typeof(TRequest).Name);
        return response;
    }
}
```

This keeps cross-cutting concerns out of domain entities and handlers.
</details>

---

### Exercise 19: Cache-Aside Decorator
**Question:** Add a cache decorator for a query handler without changing the handler logic.

<details>
<summary>Answer</summary>

```csharp
public class CachedGetOrderHandler
    : IRequestHandler<GetOrderQuery, OrderDto>
{
    private readonly IRequestHandler<GetOrderQuery, OrderDto> _inner;
    private readonly ICache _cache;

    public CachedGetOrderHandler(
        IRequestHandler<GetOrderQuery, OrderDto> inner,
        ICache cache)
    {
        _inner = inner;
        _cache = cache;
    }

    public async Task<OrderDto> Handle(GetOrderQuery request, CancellationToken ct)
    {
        var key = $"order:{request.Id}";
        if (_cache.TryGet(key, out OrderDto cached))
            return cached;

        var result = await _inner.Handle(request, ct);
        _cache.Set(key, result, TimeSpan.FromMinutes(5));
        return result;
    }
}
```

Register the decorator in the composition root.
</details>

---

## Integration Boundaries

### Exercise 20: Anti-Corruption Layer
**Question:** Wrap an external pricing API so its model does not leak into your domain.

<details>
<summary>Answer</summary>

Create an adapter in Infrastructure and map to domain models:

```csharp
public interface IPriceFeed
{
    Task<PriceQuote> GetQuoteAsync(Symbol symbol, CancellationToken ct);
}

public class ExternalPriceFeedAdapter : IPriceFeed
{
    private readonly ExternalClient _client;

    public async Task<PriceQuote> GetQuoteAsync(Symbol symbol, CancellationToken ct)
    {
        var response = await _client.GetQuoteAsync(symbol.Value, ct);
        return new PriceQuote(symbol, response.Bid, response.Ask, response.Timestamp);
    }
}
```

The domain sees only `PriceQuote`, not the external DTOs.
</details>

---

### Exercise 21: Domain Events vs Integration Events
**Question:** Distinguish domain events from integration events and place them in the correct layer.

<details>
<summary>Answer</summary>

Domain events live in the Domain layer and capture business facts. Integration events live in Application/Infrastructure and are published externally.

```csharp
// Domain
public record OrderConfirmedEvent(Guid OrderId) : IDomainEvent;

// Application/Infrastructure
public record OrderConfirmedIntegrationEvent(Guid OrderId, DateTime OccurredAt);
```

Map domain events to integration events in Application/Infrastructure.
</details>

---

### Exercise 22: Outbox Pattern Placement
**Question:** Where does the outbox belong, and how does it flow?

<details>
<summary>Answer</summary>

The outbox is Infrastructure (storage) with orchestration in Application. The Application persists domain changes and an outbox record in the same transaction, then Infrastructure publishes.
</details>

---

### Exercise 23: External API Retry Policy
**Question:** Add Polly retries to an external adapter without leaking to use cases.

<details>
<summary>Answer</summary>

Wrap the HTTP client in Infrastructure:

```csharp
services.AddHttpClient<IPriceFeed, ExternalPriceFeedAdapter>()
    .AddTransientHttpErrorPolicy(p => p.WaitAndRetryAsync(3, i => TimeSpan.FromMilliseconds(200 * i)));
```

Use cases still depend only on `IPriceFeed`.
</details>

---

## Operational Concerns

### Exercise 24: Centralized Error Handling
**Question:** Implement middleware that converts exceptions to ProblemDetails.

<details>
<summary>Answer</summary>

```csharp
app.UseMiddleware<ExceptionMiddleware>();
```

Keep exception types in Application/Domain and translate at the API boundary.
</details>

---

### Exercise 25: Configuration via Options
**Question:** Inject configuration into Infrastructure using the options pattern.

<details>
<summary>Answer</summary>

```csharp
builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("Email"));

builder.Services.AddTransient<IEmailService, SmtpEmailService>();
```

Options live in Infrastructure; Application depends only on interfaces.
</details>

---

### Exercise 26: Multi-Tenancy Context
**Question:** Introduce tenant context without leaking HTTP concerns into Application.

<details>
<summary>Answer</summary>

Define `ITenantContext` in Application and implement in API/Infrastructure:

```csharp
public interface ITenantContext
{
    string TenantId { get; }
}
```

Use middleware to set it per request.
</details>

---

### Exercise 27: Background Jobs in Clean Architecture
**Question:** Place a scheduled job that reconciles trades each night.

<details>
<summary>Answer</summary>

Implement `IHostedService` in Infrastructure or API and call Application use cases:

```csharp
public class ReconciliationJob : BackgroundService
{
    private readonly IMediator _mediator;

    protected override Task ExecuteAsync(CancellationToken ct) =>
        _mediator.Send(new ReconcileTradesCommand(), ct);
}
```

The job is orchestration; business logic stays in Application/Domain.
</details>

---

### Exercise 28: Use a Clock Abstraction
**Question:** Avoid `DateTime.UtcNow` in domain logic.

<details>
<summary>Answer</summary>

Define `IClock` in Application and inject:

```csharp
public interface IClock { DateTime UtcNow { get; } }
```

This improves testability and deterministic behavior.
</details>

---

## Refactoring & Migration

### Exercise 29: Feature-Slice vs Layered Folders
**Question:** Compare organizing Application by feature vs by technical layer.

<details>
<summary>Answer</summary>

Feature slices keep commands, handlers, DTOs, and validators together per use case, reducing cross-folder navigation. Layered folders can scale but often scatter related files.
</details>

---

### Exercise 30: Introduce Clean Architecture Gradually
**Question:** Sketch steps to migrate a legacy MVC app to Clean Architecture.

<details>
<summary>Answer</summary>

Start by extracting Domain models, then add Application use cases, then move data access to Infrastructure and keep controllers thin. Migrate per feature to reduce risk.
</details>

---

### Exercise 31: Avoid the Anemic Domain
**Question:** Refactor an anemic entity into a richer domain model.

<details>
<summary>Answer</summary>

Move invariants into entity methods, make setters private, and expose behaviors like `Confirm()` or `ReserveStock()` instead of raw property changes.
</details>

---

### Exercise 32: DTO Mapping Boundaries
**Question:** Decide where mapping belongs and justify it.

<details>
<summary>Answer</summary>

Map at the Application boundary (handlers) so Domain remains pure and Presentation stays thin. Avoid passing DTOs into Domain.
</details>

---

### Exercise 33: Versioning Use Cases
**Question:** Support breaking changes in commands without duplicating infrastructure.

<details>
<summary>Answer</summary>

Create a new command/handler version and map from v1/v2 API models. Keep shared domain logic in services or domain entities.
</details>

---

### Exercise 34: Modular Monolith Boundaries
**Question:** Define a module boundary for trading and risk in the same codebase.

<details>
<summary>Answer</summary>

Use separate Application/Domain namespaces per module, restrict references via project files, and communicate via events or interfaces to avoid direct coupling.
</details>

---

### Exercise 35: Define a Unit of Work
**Question:** Explain where Unit of Work belongs and how it is used.

<details>
<summary>Answer</summary>

The interface lives in Application, implementation in Infrastructure. Handlers coordinate repository changes and call `SaveChangesAsync` once per use case.
</details>
