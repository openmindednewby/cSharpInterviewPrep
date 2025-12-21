# Single Responsibility Principle (SRP) - Exercises

A class should have one, and only one, reason to change.

---

## Foundational Exercises

**Q: Identify the SRP violations in this User class and refactor it.**

```csharp
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }

    public void SaveToDatabase()
    {
        // Database logic
        var connection = new SqlConnection("...");
        // Save user
    }

    public void SendWelcomeEmail()
    {
        // Email logic
        var smtp = new SmtpClient();
        // Send email
    }

    public string GenerateUserReport()
    {
        // Report generation logic
        return $"User Report: {Name}";
    }

    public bool ValidateEmail()
    {
        // Validation logic
        return Email.Contains("@");
    }
}
```

A: The User class has multiple responsibilities: data storage, email sending, report generation, and validation. Refactor into separate classes:

```csharp
// Single responsibility: User data
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
}

// Single responsibility: Data persistence
public class UserRepository
{
    private readonly string _connectionString;

    public UserRepository(string connectionString)
    {
        _connectionString = connectionString;
    }

    public void Save(User user)
    {
        using var connection = new SqlConnection(_connectionString);
        // Save user
    }
}

// Single responsibility: Email notifications
public class EmailService
{
    private readonly SmtpClient _smtpClient;

    public EmailService(SmtpClient smtpClient)
    {
        _smtpClient = smtpClient;
    }

    public void SendWelcomeEmail(User user)
    {
        // Send email
    }
}

// Single responsibility: Report generation
public class UserReportGenerator
{
    public string Generate(User user)
    {
        return $"User Report: {user.Name}";
    }
}

// Single responsibility: Validation
public class EmailValidator
{
    public bool Validate(string email)
    {
        return !string.IsNullOrEmpty(email) && email.Contains("@");
    }
}
```

Use when: Building maintainable applications where changes to one concern shouldn't affect others.
Avoid when: Over-engineering simple DTOs or models that are pure data containers.

---

**Q: Refactor this OrderProcessor class to follow SRP.**

```csharp
public class OrderProcessor
{
    public void ProcessOrder(Order order)
    {
        // Validate order
        if (order.Items.Count == 0)
            throw new Exception("Order must have items");

        // Calculate total
        decimal total = 0;
        foreach (var item in order.Items)
        {
            total += item.Price * item.Quantity;
        }
        order.Total = total;

        // Apply discount
        if (order.Customer.IsPremium)
        {
            order.Total *= 0.9m;
        }

        // Save to database
        var db = new SqlConnection("...");
        // Save order

        // Send confirmation email
        var smtp = new SmtpClient();
        // Send email

        // Log
        Console.WriteLine($"Order {order.Id} processed");
    }
}
```

A: Separate into distinct responsibilities:

```csharp
public class Order
{
    public int Id { get; set; }
    public Customer Customer { get; set; }
    public List<OrderItem> Items { get; set; } = new();
    public decimal Total { get; set; }
}

// Responsibility: Order validation
public class OrderValidator
{
    public void Validate(Order order)
    {
        if (order.Items.Count == 0)
            throw new InvalidOperationException("Order must have items");

        if (order.Customer == null)
            throw new InvalidOperationException("Order must have a customer");
    }
}

// Responsibility: Price calculation
public class OrderPriceCalculator
{
    public decimal CalculateTotal(Order order)
    {
        return order.Items.Sum(item => item.Price * item.Quantity);
    }
}

// Responsibility: Discount application
public class DiscountService
{
    public decimal ApplyDiscount(decimal amount, Customer customer)
    {
        return customer.IsPremium ? amount * 0.9m : amount;
    }
}

// Responsibility: Data persistence
public class OrderRepository
{
    private readonly IDbConnection _connection;

    public OrderRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    public void Save(Order order)
    {
        // Save to database
    }
}

// Responsibility: Email notifications
public class OrderNotificationService
{
    private readonly IEmailService _emailService;

    public OrderNotificationService(IEmailService emailService)
    {
        _emailService = emailService;
    }

    public void SendConfirmation(Order order)
    {
        _emailService.Send(order.Customer.Email, "Order Confirmation", $"Order {order.Id}");
    }
}

// Responsibility: Logging
public class OrderLogger
{
    private readonly ILogger _logger;

    public OrderLogger(ILogger logger)
    {
        _logger = logger;
    }

    public void LogProcessed(Order order)
    {
        _logger.LogInformation($"Order {order.Id} processed");
    }
}

// Orchestrator: Coordinates the workflow
public class OrderProcessor
{
    private readonly OrderValidator _validator;
    private readonly OrderPriceCalculator _calculator;
    private readonly DiscountService _discountService;
    private readonly OrderRepository _repository;
    private readonly OrderNotificationService _notificationService;
    private readonly OrderLogger _logger;

    public OrderProcessor(
        OrderValidator validator,
        OrderPriceCalculator calculator,
        DiscountService discountService,
        OrderRepository repository,
        OrderNotificationService notificationService,
        OrderLogger logger)
    {
        _validator = validator;
        _calculator = calculator;
        _discountService = discountService;
        _repository = repository;
        _notificationService = notificationService;
        _logger = logger;
    }

    public void ProcessOrder(Order order)
    {
        _validator.Validate(order);

        var subtotal = _calculator.CalculateTotal(order);
        order.Total = _discountService.ApplyDiscount(subtotal, order.Customer);

        _repository.Save(order);
        _notificationService.SendConfirmation(order);
        _logger.LogProcessed(order);
    }
}
```

---

## Intermediate Exercises

**Q: Identify SRP violations in this ReportGenerator class.**

```csharp
public class ReportGenerator
{
    public string GenerateReport(List<Sale> sales)
    {
        // Fetch data
        var connection = new SqlConnection("...");
        var salesData = FetchSalesData(connection);

        // Calculate metrics
        var totalSales = salesData.Sum(s => s.Amount);
        var averageSale = salesData.Average(s => s.Amount);

        // Format report
        var report = new StringBuilder();
        report.AppendLine($"Total Sales: {totalSales}");
        report.AppendLine($"Average Sale: {averageSale}");

        // Save to file
        File.WriteAllText("report.txt", report.ToString());

        // Send via email
        var smtp = new SmtpClient();
        // Send email

        return report.ToString();
    }

    private List<Sale> FetchSalesData(SqlConnection connection)
    {
        // Fetch from database
        return new List<Sale>();
    }
}
```

A: Separate into distinct responsibilities:

```csharp
// Responsibility: Data access
public class SalesRepository
{
    private readonly IDbConnection _connection;

    public SalesRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    public List<Sale> GetAll()
    {
        // Fetch from database
        return new List<Sale>();
    }
}

// Responsibility: Business calculations
public class SalesMetricsCalculator
{
    public SalesMetrics Calculate(List<Sale> sales)
    {
        return new SalesMetrics
        {
            TotalSales = sales.Sum(s => s.Amount),
            AverageSale = sales.Average(s => s.Amount),
            SaleCount = sales.Count
        };
    }
}

// Responsibility: Report formatting
public class ReportFormatter
{
    public string Format(SalesMetrics metrics)
    {
        var report = new StringBuilder();
        report.AppendLine($"Total Sales: {metrics.TotalSales:C}");
        report.AppendLine($"Average Sale: {metrics.AverageSale:C}");
        report.AppendLine($"Number of Sales: {metrics.SaleCount}");
        return report.ToString();
    }
}

// Responsibility: File operations
public class ReportFileWriter
{
    public void WriteToFile(string content, string filePath)
    {
        File.WriteAllText(filePath, content);
    }
}

// Responsibility: Email delivery
public class ReportEmailService
{
    private readonly IEmailService _emailService;

    public ReportEmailService(IEmailService emailService)
    {
        _emailService = emailService;
    }

    public void SendReport(string report, string recipient)
    {
        _emailService.Send(recipient, "Sales Report", report);
    }
}

// Orchestrator
public class ReportGenerator
{
    private readonly SalesRepository _repository;
    private readonly SalesMetricsCalculator _calculator;
    private readonly ReportFormatter _formatter;
    private readonly ReportFileWriter _fileWriter;
    private readonly ReportEmailService _emailService;

    public ReportGenerator(
        SalesRepository repository,
        SalesMetricsCalculator calculator,
        ReportFormatter formatter,
        ReportFileWriter fileWriter,
        ReportEmailService emailService)
    {
        _repository = repository;
        _calculator = calculator;
        _formatter = formatter;
        _fileWriter = fileWriter;
        _emailService = emailService;
    }

    public string GenerateAndDistributeReport(string recipient, string filePath)
    {
        var sales = _repository.GetAll();
        var metrics = _calculator.Calculate(sales);
        var report = _formatter.Format(metrics);

        _fileWriter.WriteToFile(report, filePath);
        _emailService.SendReport(report, recipient);

        return report;
    }
}
```

---

**Q: Refactor this Employee class that handles both employee data and payroll calculations.**

```csharp
public class Employee
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal HourlyRate { get; set; }
    public int HoursWorked { get; set; }

    public decimal CalculatePayment()
    {
        var regularHours = Math.Min(HoursWorked, 40);
        var overtimeHours = Math.Max(HoursWorked - 40, 0);

        var regularPay = regularHours * HourlyRate;
        var overtimePay = overtimeHours * HourlyRate * 1.5m;

        return regularPay + overtimePay;
    }

    public decimal CalculateTax()
    {
        var payment = CalculatePayment();
        if (payment < 1000) return payment * 0.1m;
        if (payment < 5000) return payment * 0.2m;
        return payment * 0.3m;
    }

    public void SaveToDatabase()
    {
        var connection = new SqlConnection("...");
        // Save employee
    }

    public string GeneratePayslip()
    {
        return $"Employee: {Name}, Payment: {CalculatePayment():C}, Tax: {CalculateTax():C}";
    }
}
```

A: Separate into focused classes:

```csharp
// Responsibility: Employee data
public class Employee
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal HourlyRate { get; set; }
    public int HoursWorked { get; set; }
}

// Responsibility: Payroll calculations
public class PayrollCalculator
{
    private const int StandardHours = 40;
    private const decimal OvertimeMultiplier = 1.5m;

    public decimal CalculatePayment(Employee employee)
    {
        var regularHours = Math.Min(employee.HoursWorked, StandardHours);
        var overtimeHours = Math.Max(employee.HoursWorked - StandardHours, 0);

        var regularPay = regularHours * employee.HourlyRate;
        var overtimePay = overtimeHours * employee.HourlyRate * OvertimeMultiplier;

        return regularPay + overtimePay;
    }
}

// Responsibility: Tax calculations
public class TaxCalculator
{
    public decimal CalculateTax(decimal payment)
    {
        if (payment < 1000) return payment * 0.1m;
        if (payment < 5000) return payment * 0.2m;
        return payment * 0.3m;
    }
}

// Responsibility: Data persistence
public class EmployeeRepository
{
    private readonly IDbConnection _connection;

    public EmployeeRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    public void Save(Employee employee)
    {
        // Save to database
    }

    public Employee GetById(int id)
    {
        // Retrieve from database
        return null;
    }
}

// Responsibility: Document generation
public class PayslipGenerator
{
    private readonly PayrollCalculator _payrollCalculator;
    private readonly TaxCalculator _taxCalculator;

    public PayslipGenerator(PayrollCalculator payrollCalculator, TaxCalculator taxCalculator)
    {
        _payrollCalculator = payrollCalculator;
        _taxCalculator = taxCalculator;
    }

    public string Generate(Employee employee)
    {
        var payment = _payrollCalculator.CalculatePayment(employee);
        var tax = _taxCalculator.CalculateTax(payment);

        return $"Employee: {employee.Name}\n" +
               $"Payment: {payment:C}\n" +
               $"Tax: {tax:C}\n" +
               $"Net Pay: {payment - tax:C}";
    }
}
```

---

## Advanced Exercises

**Q: Design a logging system that follows SRP. It should support multiple log levels, formats, and destinations.**

A: Create separate classes for each responsibility:

```csharp
// Responsibility: Log entry data
public class LogEntry
{
    public DateTime Timestamp { get; set; }
    public LogLevel Level { get; set; }
    public string Message { get; set; }
    public string Category { get; set; }
    public Exception Exception { get; set; }
}

public enum LogLevel
{
    Debug, Info, Warning, Error, Critical
}

// Responsibility: Log formatting
public interface ILogFormatter
{
    string Format(LogEntry entry);
}

public class JsonLogFormatter : ILogFormatter
{
    public string Format(LogEntry entry)
    {
        return JsonSerializer.Serialize(entry);
    }
}

public class PlainTextLogFormatter : ILogFormatter
{
    public string Format(LogEntry entry)
    {
        return $"[{entry.Timestamp:yyyy-MM-dd HH:mm:ss}] [{entry.Level}] {entry.Message}";
    }
}

// Responsibility: Log destination
public interface ILogDestination
{
    void Write(string formattedLog);
}

public class FileLogDestination : ILogDestination
{
    private readonly string _filePath;

    public FileLogDestination(string filePath)
    {
        _filePath = filePath;
    }

    public void Write(string formattedLog)
    {
        File.AppendAllText(_filePath, formattedLog + Environment.NewLine);
    }
}

public class ConsoleLogDestination : ILogDestination
{
    public void Write(string formattedLog)
    {
        Console.WriteLine(formattedLog);
    }
}

public class DatabaseLogDestination : ILogDestination
{
    private readonly IDbConnection _connection;

    public DatabaseLogDestination(IDbConnection connection)
    {
        _connection = connection;
    }

    public void Write(string formattedLog)
    {
        // Write to database
    }
}

// Responsibility: Log filtering
public interface ILogFilter
{
    bool ShouldLog(LogEntry entry);
}

public class LogLevelFilter : ILogFilter
{
    private readonly LogLevel _minLevel;

    public LogLevelFilter(LogLevel minLevel)
    {
        _minLevel = minLevel;
    }

    public bool ShouldLog(LogEntry entry)
    {
        return entry.Level >= _minLevel;
    }
}

// Responsibility: Orchestrating logging
public class Logger
{
    private readonly List<ILogDestination> _destinations;
    private readonly ILogFormatter _formatter;
    private readonly ILogFilter _filter;

    public Logger(
        ILogFormatter formatter,
        ILogFilter filter,
        params ILogDestination[] destinations)
    {
        _formatter = formatter;
        _filter = filter;
        _destinations = new List<ILogDestination>(destinations);
    }

    public void Log(LogLevel level, string message, string category = null, Exception exception = null)
    {
        var entry = new LogEntry
        {
            Timestamp = DateTime.UtcNow,
            Level = level,
            Message = message,
            Category = category,
            Exception = exception
        };

        if (!_filter.ShouldLog(entry))
            return;

        var formattedLog = _formatter.Format(entry);

        foreach (var destination in _destinations)
        {
            destination.Write(formattedLog);
        }
    }

    public void Debug(string message) => Log(LogLevel.Debug, message);
    public void Info(string message) => Log(LogLevel.Info, message);
    public void Warning(string message) => Log(LogLevel.Warning, message);
    public void Error(string message, Exception ex = null) => Log(LogLevel.Error, message, exception: ex);
}

// Usage
var logger = new Logger(
    new JsonLogFormatter(),
    new LogLevelFilter(LogLevel.Info),
    new FileLogDestination("app.log"),
    new ConsoleLogDestination()
);

logger.Info("Application started");
logger.Error("An error occurred", new Exception("Test exception"));
```

---

**Q: Create a file processing system that reads, validates, transforms, and stores data while following SRP.**

A: Separate each step into its own class:

```csharp
// Responsibility: File reading
public interface IFileReader
{
    Task<string> ReadAsync(string filePath);
}

public class TextFileReader : IFileReader
{
    public async Task<string> ReadAsync(string filePath)
    {
        return await File.ReadAllTextAsync(filePath);
    }
}

// Responsibility: Data parsing
public interface IDataParser<T>
{
    T Parse(string content);
}

public class CsvParser : IDataParser<List<Dictionary<string, string>>>
{
    public List<Dictionary<string, string>> Parse(string content)
    {
        var lines = content.Split('\n');
        var headers = lines[0].Split(',');

        return lines.Skip(1)
            .Select(line =>
            {
                var values = line.Split(',');
                return headers.Zip(values, (h, v) => new { h, v })
                    .ToDictionary(x => x.h, x => x.v);
            })
            .ToList();
    }
}

// Responsibility: Data validation
public interface IDataValidator<T>
{
    ValidationResult Validate(T data);
}

public class ValidationResult
{
    public bool IsValid { get; set; }
    public List<string> Errors { get; set; } = new();
}

public class OrderDataValidator : IDataValidator<List<Dictionary<string, string>>>
{
    public ValidationResult Validate(List<Dictionary<string, string>> data)
    {
        var result = new ValidationResult { IsValid = true };

        foreach (var row in data)
        {
            if (!row.ContainsKey("OrderId") || string.IsNullOrEmpty(row["OrderId"]))
            {
                result.IsValid = false;
                result.Errors.Add("OrderId is required");
            }

            if (row.ContainsKey("Amount") && !decimal.TryParse(row["Amount"], out _))
            {
                result.IsValid = false;
                result.Errors.Add($"Invalid amount in order {row.GetValueOrDefault("OrderId")}");
            }
        }

        return result;
    }
}

// Responsibility: Data transformation
public interface IDataTransformer<TInput, TOutput>
{
    TOutput Transform(TInput data);
}

public class OrderTransformer : IDataTransformer<List<Dictionary<string, string>>, List<Order>>
{
    public List<Order> Transform(List<Dictionary<string, string>> data)
    {
        return data.Select(row => new Order
        {
            Id = row["OrderId"],
            Amount = decimal.Parse(row["Amount"]),
            CustomerId = row.GetValueOrDefault("CustomerId")
        }).ToList();
    }
}

// Responsibility: Data storage
public interface IDataRepository<T>
{
    Task SaveAsync(T data);
}

public class OrderRepository : IDataRepository<List<Order>>
{
    private readonly IDbConnection _connection;

    public OrderRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    public async Task SaveAsync(List<Order> orders)
    {
        // Save to database
        await Task.CompletedTask;
    }
}

// Responsibility: Error handling and logging
public interface IProcessingLogger
{
    void LogStart(string filePath);
    void LogValidationErrors(ValidationResult result);
    void LogSuccess(int recordCount);
    void LogError(Exception ex);
}

public class ProcessingLogger : IProcessingLogger
{
    private readonly ILogger _logger;

    public ProcessingLogger(ILogger logger)
    {
        _logger = logger;
    }

    public void LogStart(string filePath)
    {
        _logger.LogInformation($"Starting to process file: {filePath}");
    }

    public void LogValidationErrors(ValidationResult result)
    {
        foreach (var error in result.Errors)
        {
            _logger.LogWarning($"Validation error: {error}");
        }
    }

    public void LogSuccess(int recordCount)
    {
        _logger.LogInformation($"Successfully processed {recordCount} records");
    }

    public void LogError(Exception ex)
    {
        _logger.LogError(ex, "Error processing file");
    }
}

// Orchestrator: Coordinates the workflow
public class FileProcessingService
{
    private readonly IFileReader _fileReader;
    private readonly IDataParser<List<Dictionary<string, string>>> _parser;
    private readonly IDataValidator<List<Dictionary<string, string>>> _validator;
    private readonly IDataTransformer<List<Dictionary<string, string>>, List<Order>> _transformer;
    private readonly IDataRepository<List<Order>> _repository;
    private readonly IProcessingLogger _logger;

    public FileProcessingService(
        IFileReader fileReader,
        IDataParser<List<Dictionary<string, string>>> parser,
        IDataValidator<List<Dictionary<string, string>>> validator,
        IDataTransformer<List<Dictionary<string, string>>, List<Order>> transformer,
        IDataRepository<List<Order>> repository,
        IProcessingLogger logger)
    {
        _fileReader = fileReader;
        _parser = parser;
        _validator = validator;
        _transformer = transformer;
        _repository = repository;
        _logger = logger;
    }

    public async Task ProcessFileAsync(string filePath)
    {
        try
        {
            _logger.LogStart(filePath);

            // Read
            var content = await _fileReader.ReadAsync(filePath);

            // Parse
            var rawData = _parser.Parse(content);

            // Validate
            var validationResult = _validator.Validate(rawData);
            if (!validationResult.IsValid)
            {
                _logger.LogValidationErrors(validationResult);
                return;
            }

            // Transform
            var orders = _transformer.Transform(rawData);

            // Store
            await _repository.SaveAsync(orders);

            _logger.LogSuccess(orders.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex);
            throw;
        }
    }
}
```

---

## Real-World Scenarios

**Q: Design an e-commerce checkout system following SRP. Include inventory checking, payment processing, order creation, and notifications.**

A: Create focused services for each responsibility:

```csharp
// Domain entities
public class Cart
{
    public string CustomerId { get; set; }
    public List<CartItem> Items { get; set; } = new();
}

public class CartItem
{
    public string ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
}

public class Order
{
    public string Id { get; set; }
    public string CustomerId { get; set; }
    public List<OrderItem> Items { get; set; } = new();
    public decimal Total { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }
}

// Responsibility: Inventory management
public interface IInventoryService
{
    Task<bool> CheckAvailabilityAsync(string productId, int quantity);
    Task ReserveAsync(string productId, int quantity);
    Task ReleaseAsync(string productId, int quantity);
}

public class InventoryService : IInventoryService
{
    private readonly IInventoryRepository _repository;

    public InventoryService(IInventoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> CheckAvailabilityAsync(string productId, int quantity)
    {
        var stock = await _repository.GetStockAsync(productId);
        return stock >= quantity;
    }

    public async Task ReserveAsync(string productId, int quantity)
    {
        await _repository.DecrementStockAsync(productId, quantity);
    }

    public async Task ReleaseAsync(string productId, int quantity)
    {
        await _repository.IncrementStockAsync(productId, quantity);
    }
}

// Responsibility: Payment processing
public interface IPaymentService
{
    Task<PaymentResult> ProcessPaymentAsync(string customerId, decimal amount, string paymentMethod);
}

public class PaymentResult
{
    public bool Success { get; set; }
    public string TransactionId { get; set; }
    public string ErrorMessage { get; set; }
}

public class PaymentService : IPaymentService
{
    private readonly IPaymentGateway _gateway;

    public PaymentService(IPaymentGateway gateway)
    {
        _gateway = gateway;
    }

    public async Task<PaymentResult> ProcessPaymentAsync(string customerId, decimal amount, string paymentMethod)
    {
        return await _gateway.ChargeAsync(customerId, amount, paymentMethod);
    }
}

// Responsibility: Order creation
public interface IOrderFactory
{
    Order CreateOrder(Cart cart);
}

public class OrderFactory : IOrderFactory
{
    public Order CreateOrder(Cart cart)
    {
        return new Order
        {
            Id = Guid.NewGuid().ToString(),
            CustomerId = cart.CustomerId,
            Items = cart.Items.Select(ci => new OrderItem
            {
                ProductId = ci.ProductId,
                Quantity = ci.Quantity,
                Price = ci.Price
            }).ToList(),
            Total = cart.Items.Sum(ci => ci.Price * ci.Quantity),
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };
    }
}

// Responsibility: Order persistence
public interface IOrderRepository
{
    Task SaveAsync(Order order);
    Task UpdateStatusAsync(string orderId, string status);
}

// Responsibility: Customer notifications
public interface INotificationService
{
    Task SendOrderConfirmationAsync(Order order);
    Task SendPaymentFailureAsync(string customerId, string reason);
}

public class NotificationService : INotificationService
{
    private readonly IEmailService _emailService;
    private readonly ISmsService _smsService;

    public NotificationService(IEmailService emailService, ISmsService smsService)
    {
        _emailService = emailService;
        _smsService = smsService;
    }

    public async Task SendOrderConfirmationAsync(Order order)
    {
        await _emailService.SendAsync(order.CustomerId, "Order Confirmation", $"Order {order.Id} confirmed");
    }

    public async Task SendPaymentFailureAsync(string customerId, string reason)
    {
        await _emailService.SendAsync(customerId, "Payment Failed", reason);
    }
}

// Orchestrator: Checkout process
public class CheckoutService
{
    private readonly IInventoryService _inventoryService;
    private readonly IPaymentService _paymentService;
    private readonly IOrderFactory _orderFactory;
    private readonly IOrderRepository _orderRepository;
    private readonly INotificationService _notificationService;
    private readonly ILogger<CheckoutService> _logger;

    public CheckoutService(
        IInventoryService inventoryService,
        IPaymentService paymentService,
        IOrderFactory orderFactory,
        IOrderRepository orderRepository,
        INotificationService notificationService,
        ILogger<CheckoutService> logger)
    {
        _inventoryService = inventoryService;
        _paymentService = paymentService;
        _orderFactory = orderFactory;
        _orderRepository = orderRepository;
        _notificationService = notificationService;
        _logger = logger;
    }

    public async Task<CheckoutResult> CheckoutAsync(Cart cart, string paymentMethod)
    {
        try
        {
            // Step 1: Check inventory
            foreach (var item in cart.Items)
            {
                var available = await _inventoryService.CheckAvailabilityAsync(item.ProductId, item.Quantity);
                if (!available)
                {
                    return CheckoutResult.Failed($"Product {item.ProductId} is out of stock");
                }
            }

            // Step 2: Reserve inventory
            foreach (var item in cart.Items)
            {
                await _inventoryService.ReserveAsync(item.ProductId, item.Quantity);
            }

            // Step 3: Create order
            var order = _orderFactory.CreateOrder(cart);
            await _orderRepository.SaveAsync(order);

            // Step 4: Process payment
            var paymentResult = await _paymentService.ProcessPaymentAsync(
                cart.CustomerId,
                order.Total,
                paymentMethod);

            if (!paymentResult.Success)
            {
                // Rollback inventory
                foreach (var item in cart.Items)
                {
                    await _inventoryService.ReleaseAsync(item.ProductId, item.Quantity);
                }

                await _orderRepository.UpdateStatusAsync(order.Id, "PaymentFailed");
                await _notificationService.SendPaymentFailureAsync(cart.CustomerId, paymentResult.ErrorMessage);

                return CheckoutResult.Failed(paymentResult.ErrorMessage);
            }

            // Step 5: Confirm order
            await _orderRepository.UpdateStatusAsync(order.Id, "Confirmed");
            await _notificationService.SendOrderConfirmationAsync(order);

            _logger.LogInformation($"Checkout completed for order {order.Id}");

            return CheckoutResult.Success(order.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Checkout failed");
            throw;
        }
    }
}

public class CheckoutResult
{
    public bool Success { get; set; }
    public string OrderId { get; set; }
    public string ErrorMessage { get; set; }

    public static CheckoutResult Success(string orderId) =>
        new() { Success = true, OrderId = orderId };

    public static CheckoutResult Failed(string message) =>
        new() { Success = false, ErrorMessage = message };
}
```

---

**Total Exercises: 25+**

Each refactoring demonstrates how SRP makes code more maintainable, testable, and easier to change. Remember: a class should have only one reason to change!
