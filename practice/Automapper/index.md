# AutoMapper - Comprehensive Practice Exercises

## Table of Contents
1. [Basic Mapping Configuration](#basic-mapping-configuration)
2. [Custom Value Resolvers](#custom-value-resolvers)
3. [Custom Type Converters](#custom-type-converters)
4. [Projection to DTOs](#projection-to-dtos)
5. [Flattening and Unflattening](#flattening-and-unflattening)
6. [Conditional Mapping](#conditional-mapping)
7. [Value Transformations](#value-transformations)
8. [Collections Mapping](#collections-mapping)
9. [Mapping Validation](#mapping-validation)
10. [Performance Considerations](#performance-considerations)
11. [When to Use vs Manual Mapping](#when-to-use-vs-manual-mapping)
12. [Advanced Mapping Scenarios](#advanced-mapping-scenarios)
13. [Testing & Troubleshooting](#testing--troubleshooting)

---

## Basic Mapping Configuration

### Exercise 1: Simple Property Mapping
**Question:** Configure AutoMapper to map between a domain entity and a DTO with matching property names.

<details>
<summary>Answer</summary>

```csharp
// Domain/Entities/Product.cs
public class Product
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; }
    public DateTime CreatedAt { get; set; }
}

// Application/DTOs/ProductDto.cs
public class ProductDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; }
    public DateTime CreatedAt { get; set; }
}

// Application/Mappings/ProductMappingProfile.cs
public class ProductMappingProfile : Profile
{
    public ProductMappingProfile()
    {
        // Simple mapping - properties match by name
        CreateMap<Product, ProductDto>();

        // Reverse mapping
        CreateMap<ProductDto, Product>();
    }
}

// Usage
public class ProductService
{
    private readonly IMapper _mapper;
    private readonly IProductRepository _repository;

    public ProductService(IMapper mapper, IProductRepository repository)
    {
        _mapper = mapper;
        _repository = repository;
    }

    public async Task<ProductDto> GetProductAsync(Guid id)
    {
        var product = await _repository.GetByIdAsync(id);
        return _mapper.Map<ProductDto>(product);
    }

    public async Task<List<ProductDto>> GetAllProductsAsync()
    {
        var products = await _repository.GetAllAsync();
        return _mapper.Map<List<ProductDto>>(products);
    }
}

// Startup Configuration
// Program.cs
builder.Services.AddAutoMapper(typeof(ProductMappingProfile).Assembly);
```

</details>

---

### Exercise 2: Different Property Names
**Question:** Map properties with different names between source and destination.

<details>
<summary>Answer</summary>

```csharp
// Domain/Entities/Customer.cs
public class Customer
{
    public Guid CustomerId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string EmailAddress { get; set; }
    public DateTime DateOfBirth { get; set; }
}

// Application/DTOs/CustomerDto.cs
public class CustomerDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public int Age { get; set; }
}

// Application/Mappings/CustomerMappingProfile.cs
public class CustomerMappingProfile : Profile
{
    public CustomerMappingProfile()
    {
        CreateMap<Customer, CustomerDto>()
            // Map CustomerId to Id
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.CustomerId))
            // Map EmailAddress to Email
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.EmailAddress))
            // Combine FirstName and LastName into FullName
            .ForMember(dest => dest.FullName,
                opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"))
            // Calculate Age from DateOfBirth
            .ForMember(dest => dest.Age,
                opt => opt.MapFrom(src => CalculateAge(src.DateOfBirth)));
    }

    private static int CalculateAge(DateTime dateOfBirth)
    {
        var today = DateTime.Today;
        var age = today.Year - dateOfBirth.Year;
        if (dateOfBirth.Date > today.AddYears(-age))
            age--;
        return age;
    }
}

// Usage Example
var customer = new Customer
{
    CustomerId = Guid.NewGuid(),
    FirstName = "John",
    LastName = "Doe",
    EmailAddress = "john.doe@example.com",
    DateOfBirth = new DateTime(1990, 5, 15)
};

var dto = _mapper.Map<CustomerDto>(customer);
// dto.Id = customer.CustomerId
// dto.FullName = "John Doe"
// dto.Email = "john.doe@example.com"
// dto.Age = 33
```

</details>

---

### Exercise 3: Ignoring Properties
**Question:** Configure AutoMapper to ignore certain properties during mapping.

<details>
<summary>Answer</summary>

```csharp
// Domain/Entities/User.cs
public class User
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string Salt { get; set; }
    public DateTime LastLoginAt { get; set; }
    public int LoginAttempts { get; set; }
}

// Application/DTOs/UserDto.cs
public class UserDto
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public DateTime LastLoginAt { get; set; }
    public string PasswordHash { get; set; } // Should not be mapped!
    public string Salt { get; set; } // Should not be mapped!
}

// Application/Mappings/UserMappingProfile.cs
public class UserMappingProfile : Profile
{
    public UserMappingProfile()
    {
        CreateMap<User, UserDto>()
            // Ignore sensitive properties
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForMember(dest => dest.Salt, opt => opt.Ignore());

        // Reverse mapping (for updates)
        CreateMap<UserDto, User>()
            // Don't overwrite password from DTO
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForMember(dest => dest.Salt, opt => opt.Ignore())
            .ForMember(dest => dest.LoginAttempts, opt => opt.Ignore());
    }
}

// Better approach: Don't include sensitive fields in DTO at all
public class SafeUserDto
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public DateTime LastLoginAt { get; set; }
}

public class SafeUserMappingProfile : Profile
{
    public SafeUserMappingProfile()
    {
        CreateMap<User, SafeUserDto>();
        // No password-related fields in DTO = no risk
    }
}
```

</details>

---

### Exercise 4: Null Value Handling
**Question:** Configure how AutoMapper handles null values in source properties.

<details>
<summary>Answer</summary>

```csharp
// Domain/Entities/Order.cs
public class Order
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; }
    public Address ShippingAddress { get; set; }
    public Address BillingAddress { get; set; }
    public string Notes { get; set; }
}

public class Address
{
    public string Street { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string ZipCode { get; set; }
}

// Application/DTOs/OrderDto.cs
public class OrderDto
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; }
    public AddressDto ShippingAddress { get; set; }
    public AddressDto BillingAddress { get; set; }
    public string Notes { get; set; }
}

public class AddressDto
{
    public string Street { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string ZipCode { get; set; }
}

// Application/Mappings/OrderMappingProfile.cs
public class OrderMappingProfile : Profile
{
    public OrderMappingProfile()
    {
        // Option 1: Default behavior (null source = null destination)
        CreateMap<Order, OrderDto>();
        CreateMap<Address, AddressDto>();

        // Option 2: Use NullSubstitute for specific properties
        CreateMap<Order, OrderDto>()
            .ForMember(dest => dest.Notes,
                opt => opt.NullSubstitute("No notes"));

        // Option 3: Condition - only map if not null
        CreateMap<Order, OrderDto>()
            .ForMember(dest => dest.BillingAddress,
                opt => opt.Condition(src => src.BillingAddress != null));

        // Option 4: Map null source to empty object
        CreateMap<Order, OrderDto>()
            .ForMember(dest => dest.ShippingAddress,
                opt => opt.MapFrom(src => src.ShippingAddress ?? new Address()));

        // Global configuration for all mappings
        // In Program.cs:
        // builder.Services.AddAutoMapper(cfg =>
        // {
        //     cfg.AllowNullCollections = true;
        //     cfg.AllowNullDestinationValues = true;
        // }, typeof(Program).Assembly);
    }
}

// Usage with null handling
public class OrderService
{
    private readonly IMapper _mapper;

    public OrderDto MapOrder(Order order)
    {
        // If order is null, will return null (default behavior)
        var dto = _mapper.Map<OrderDto>(order);

        // Safe mapping with null check
        var safeDto = order != null
            ? _mapper.Map<OrderDto>(order)
            : null;

        return safeDto;
    }
}
```

</details>

---

## Custom Value Resolvers

### Exercise 5: Implement Custom Value Resolver
**Question:** Create a custom value resolver to calculate a complex property.

<details>
<summary>Answer</summary>

```csharp
// Domain/Entities/Order.cs
public class Order
{
    public Guid Id { get; set; }
    public List<OrderItem> Items { get; set; } = new();
    public string DiscountCode { get; set; }
    public decimal ShippingCost { get; set; }
}

public class OrderItem
{
    public string ProductName { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
}

// Application/DTOs/OrderSummaryDto.cs
public class OrderSummaryDto
{
    public Guid Id { get; set; }
    public decimal Subtotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal Tax { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal Total { get; set; }
}

// Application/Mappings/Resolvers/OrderTotalResolver.cs
public class OrderTotalResolver : IValueResolver<Order, OrderSummaryDto, decimal>
{
    public decimal Resolve(Order source, OrderSummaryDto destination,
        decimal destMember, ResolutionContext context)
    {
        var subtotal = source.Items.Sum(i => i.UnitPrice * i.Quantity);
        var discountAmount = CalculateDiscount(subtotal, source.DiscountCode);
        var tax = (subtotal - discountAmount) * 0.08m; // 8% tax
        var total = subtotal - discountAmount + tax + source.ShippingCost;

        return total;
    }

    private decimal CalculateDiscount(decimal subtotal, string discountCode)
    {
        return discountCode switch
        {
            "SAVE10" => subtotal * 0.10m,
            "SAVE20" => subtotal * 0.20m,
            "FREESHIP" => 0m,
            _ => 0m
        };
    }
}

// Application/Mappings/Resolvers/SubtotalResolver.cs
public class SubtotalResolver : IValueResolver<Order, OrderSummaryDto, decimal>
{
    public decimal Resolve(Order source, OrderSummaryDto destination,
        decimal destMember, ResolutionContext context)
    {
        return source.Items.Sum(i => i.UnitPrice * i.Quantity);
    }
}

// Application/Mappings/Resolvers/DiscountAmountResolver.cs
public class DiscountAmountResolver : IValueResolver<Order, OrderSummaryDto, decimal>
{
    public decimal Resolve(Order source, OrderSummaryDto destination,
        decimal destMember, ResolutionContext context)
    {
        var subtotal = source.Items.Sum(i => i.UnitPrice * i.Quantity);

        return source.DiscountCode switch
        {
            "SAVE10" => subtotal * 0.10m,
            "SAVE20" => subtotal * 0.20m,
            _ => 0m
        };
    }
}

// Application/Mappings/Resolvers/TaxResolver.cs
public class TaxResolver : IValueResolver<Order, OrderSummaryDto, decimal>
{
    private readonly decimal _taxRate = 0.08m;

    public decimal Resolve(Order source, OrderSummaryDto destination,
        decimal destMember, ResolutionContext context)
    {
        var subtotal = source.Items.Sum(i => i.UnitPrice * i.Quantity);
        var discount = context.Mapper.Map<Order, decimal>(source); // Reuse discount resolver

        return (subtotal - discount) * _taxRate;
    }
}

// Application/Mappings/OrderMappingProfile.cs
public class OrderMappingProfile : Profile
{
    public OrderMappingProfile()
    {
        CreateMap<Order, OrderSummaryDto>()
            .ForMember(dest => dest.Subtotal,
                opt => opt.MapFrom<SubtotalResolver>())
            .ForMember(dest => dest.DiscountAmount,
                opt => opt.MapFrom<DiscountAmountResolver>())
            .ForMember(dest => dest.Tax,
                opt => opt.MapFrom<TaxResolver>())
            .ForMember(dest => dest.Total,
                opt => opt.MapFrom<OrderTotalResolver>());
    }
}

// Usage
var order = new Order
{
    Id = Guid.NewGuid(),
    DiscountCode = "SAVE10",
    ShippingCost = 9.99m,
    Items = new List<OrderItem>
    {
        new() { ProductName = "Product A", UnitPrice = 29.99m, Quantity = 2 },
        new() { ProductName = "Product B", UnitPrice = 49.99m, Quantity = 1 }
    }
};

var summary = _mapper.Map<OrderSummaryDto>(order);
// summary.Subtotal = 109.97
// summary.DiscountAmount = 10.997
// summary.Tax = 7.918
// summary.Total = 106.891
```

</details>

---

### Exercise 6: Value Resolver with Dependency Injection
**Question:** Create a value resolver that uses injected services to resolve values.

<details>
<summary>Answer</summary>

```csharp
// Domain/Entities/Product.cs
public class Product
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public decimal BasePrice { get; set; }
    public string Currency { get; set; }
}

// Application/DTOs/ProductDto.cs
public class ProductDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Currency { get; set; }
    public decimal PriceInUsd { get; set; }
}

// Application/Interfaces/ICurrencyConverter.cs
public interface ICurrencyConverter
{
    Task<decimal> ConvertToUsdAsync(decimal amount, string fromCurrency);
}

// Infrastructure/Services/CurrencyConverter.cs
public class CurrencyConverter : ICurrencyConverter
{
    private readonly HttpClient _httpClient;

    public CurrencyConverter(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<decimal> ConvertToUsdAsync(decimal amount, string fromCurrency)
    {
        if (fromCurrency == "USD")
            return amount;

        // Call external API or use cached rates
        var rate = await GetExchangeRateAsync(fromCurrency, "USD");
        return amount * rate;
    }

    private async Task<decimal> GetExchangeRateAsync(string from, string to)
    {
        // Simplified - would call real API
        return from switch
        {
            "EUR" => 1.10m,
            "GBP" => 1.25m,
            _ => 1.00m
        };
    }
}

// Application/Mappings/Resolvers/UsdPriceResolver.cs
public class UsdPriceResolver : IValueResolver<Product, ProductDto, decimal>
{
    private readonly ICurrencyConverter _currencyConverter;

    // AutoMapper will inject ICurrencyConverter
    public UsdPriceResolver(ICurrencyConverter currencyConverter)
    {
        _currencyConverter = currencyConverter;
    }

    public decimal Resolve(Product source, ProductDto destination,
        decimal destMember, ResolutionContext context)
    {
        // Note: Synchronous mapping with async service is problematic
        // See better solution below
        var task = _currencyConverter.ConvertToUsdAsync(source.BasePrice, source.Currency);
        return task.GetAwaiter().GetResult(); // Not ideal!
    }
}

// Application/Mappings/ProductMappingProfile.cs
public class ProductMappingProfile : Profile
{
    public ProductMappingProfile()
    {
        CreateMap<Product, ProductDto>()
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.BasePrice))
            .ForMember(dest => dest.PriceInUsd,
                opt => opt.MapFrom<UsdPriceResolver>());
    }
}

// Better approach: Manual mapping for async operations
public class ProductService
{
    private readonly IProductRepository _repository;
    private readonly IMapper _mapper;
    private readonly ICurrencyConverter _currencyConverter;

    public ProductService(
        IProductRepository repository,
        IMapper mapper,
        ICurrencyConverter currencyConverter)
    {
        _repository = repository;
        _mapper = mapper;
        _currencyConverter = currencyConverter;
    }

    public async Task<ProductDto> GetProductAsync(Guid id)
    {
        var product = await _repository.GetByIdAsync(id);
        var dto = _mapper.Map<ProductDto>(product);

        // Manually resolve async property after mapping
        dto.PriceInUsd = await _currencyConverter.ConvertToUsdAsync(
            product.BasePrice,
            product.Currency
        );

        return dto;
    }
}

// Configuration in Program.cs
builder.Services.AddHttpClient<ICurrencyConverter, CurrencyConverter>();
builder.Services.AddAutoMapper(typeof(ProductMappingProfile).Assembly);
```

**Key Points:**
- Value resolvers can use constructor injection
- Avoid async operations in value resolvers (AutoMapper is synchronous)
- For async operations, map synchronously then enhance manually
- AutoMapper will resolve dependencies from DI container

</details>

---

## Custom Type Converters

### Exercise 7: Create Custom Type Converter
**Question:** Implement a custom type converter for converting between incompatible types.

<details>
<summary>Answer</summary>

```csharp
// Domain/ValueObjects/Money.cs
public class Money
{
    public decimal Amount { get; set; }
    public string Currency { get; set; }

    public Money(decimal amount, string currency)
    {
        Amount = amount;
        Currency = currency;
    }
}

// Application/DTOs/MoneyDto.cs
public class MoneyDto
{
    public string FormattedAmount { get; set; } // "$123.45 USD"
}

// Application/Mappings/Converters/MoneyToStringConverter.cs
public class MoneyToStringConverter : ITypeConverter<Money, string>
{
    public string Convert(Money source, string destination, ResolutionContext context)
    {
        if (source == null)
            return null;

        var symbol = GetCurrencySymbol(source.Currency);
        return $"{symbol}{source.Amount:N2} {source.Currency}";
    }

    private string GetCurrencySymbol(string currency)
    {
        return currency switch
        {
            "USD" => "$",
            "EUR" => "€",
            "GBP" => "£",
            "JPY" => "¥",
            _ => ""
        };
    }
}

// Application/Mappings/Converters/StringToMoneyConverter.cs
public class StringToMoneyConverter : ITypeConverter<string, Money>
{
    public Money Convert(string source, Money destination, ResolutionContext context)
    {
        if (string.IsNullOrWhiteSpace(source))
            return null;

        // Parse "$123.45 USD" format
        var parts = source.Split(' ');
        if (parts.Length != 2)
            throw new ArgumentException("Invalid money format");

        var amountStr = parts[0].TrimStart('$', '€', '£', '¥');
        var currency = parts[1];

        if (!decimal.TryParse(amountStr, out var amount))
            throw new ArgumentException("Invalid amount");

        return new Money(amount, currency);
    }
}

// More examples: DateTime to string converter
public class DateTimeToStringConverter : ITypeConverter<DateTime, string>
{
    public string Convert(DateTime source, string destination, ResolutionContext context)
    {
        return source.ToString("yyyy-MM-dd HH:mm:ss");
    }
}

// String to DateTime converter
public class StringToDateTimeConverter : ITypeConverter<string, DateTime>
{
    public DateTime Convert(string source, DateTime destination, ResolutionContext context)
    {
        if (DateTime.TryParse(source, out var result))
            return result;

        return DateTime.MinValue;
    }
}

// Enum to string converter (with description)
public class OrderStatusConverter : ITypeConverter<OrderStatus, string>
{
    public string Convert(OrderStatus source, string destination, ResolutionContext context)
    {
        return source switch
        {
            OrderStatus.Pending => "Awaiting Processing",
            OrderStatus.Processing => "Being Processed",
            OrderStatus.Shipped => "On Its Way",
            OrderStatus.Delivered => "Delivered Successfully",
            OrderStatus.Cancelled => "Order Cancelled",
            _ => "Unknown Status"
        };
    }
}

// Application/Mappings/MappingProfile.cs
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Register type converters
        CreateMap<Money, string>().ConvertUsing<MoneyToStringConverter>();
        CreateMap<string, Money>().ConvertUsing<StringToMoneyConverter>();
        CreateMap<DateTime, string>().ConvertUsing<DateTimeToStringConverter>();
        CreateMap<string, DateTime>().ConvertUsing<StringToDateTimeConverter>();
        CreateMap<OrderStatus, string>().ConvertUsing<OrderStatusConverter>();

        // Use in mappings
        CreateMap<Order, OrderDto>()
            .ForMember(dest => dest.TotalAmount,
                opt => opt.ConvertUsing<MoneyToStringConverter, Money>(src => src.Total));
    }
}

// Domain/Entities/Order.cs
public class Order
{
    public Guid Id { get; set; }
    public Money Total { get; set; }
    public OrderStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}

// Application/DTOs/OrderDto.cs
public class OrderDto
{
    public Guid Id { get; set; }
    public string TotalAmount { get; set; } // "$123.45 USD"
    public string Status { get; set; } // "Awaiting Processing"
    public string CreatedAt { get; set; } // "2024-01-15 14:30:00"
}

// Usage
var order = new Order
{
    Id = Guid.NewGuid(),
    Total = new Money(123.45m, "USD"),
    Status = OrderStatus.Pending,
    CreatedAt = DateTime.Now
};

var dto = _mapper.Map<OrderDto>(order);
// dto.TotalAmount = "$123.45 USD"
// dto.Status = "Awaiting Processing"
// dto.CreatedAt = "2024-01-15 14:30:00"
```

</details>

---

### Exercise 8: Collection Type Converter
**Question:** Create a converter that transforms collections in custom ways.

<details>
<summary>Answer</summary>

```csharp
// Domain/Entities/Product.cs
public class Product
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public List<string> Tags { get; set; } = new();
}

// Application/DTOs/ProductDto.cs
public class ProductDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string TagsAsString { get; set; } // "tag1, tag2, tag3"
}

// Application/Mappings/Converters/ListToCommaSeparatedStringConverter.cs
public class ListToCommaSeparatedStringConverter : ITypeConverter<List<string>, string>
{
    public string Convert(List<string> source, string destination, ResolutionContext context)
    {
        return source == null || !source.Any()
            ? string.Empty
            : string.Join(", ", source);
    }
}

// Application/Mappings/Converters/CommaSeparatedStringToListConverter.cs
public class CommaSeparatedStringToListConverter : ITypeConverter<string, List<string>>
{
    public List<string> Convert(string source, List<string> destination, ResolutionContext context)
    {
        if (string.IsNullOrWhiteSpace(source))
            return new List<string>();

        return source.Split(',')
            .Select(s => s.Trim())
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .ToList();
    }
}

// Dictionary converter example
public class DictionaryToJsonConverter : ITypeConverter<Dictionary<string, object>, string>
{
    public string Convert(Dictionary<string, object> source, string destination,
        ResolutionContext context)
    {
        return source == null
            ? "{}"
            : JsonSerializer.Serialize(source);
    }
}

public class JsonToDictionaryConverter : ITypeConverter<string, Dictionary<string, object>>
{
    public Dictionary<string, object> Convert(string source,
        Dictionary<string, object> destination, ResolutionContext context)
    {
        if (string.IsNullOrWhiteSpace(source))
            return new Dictionary<string, object>();

        try
        {
            return JsonSerializer.Deserialize<Dictionary<string, object>>(source);
        }
        catch
        {
            return new Dictionary<string, object>();
        }
    }
}

// Application/Mappings/ProductMappingProfile.cs
public class ProductMappingProfile : Profile
{
    public ProductMappingProfile()
    {
        CreateMap<List<string>, string>()
            .ConvertUsing<ListToCommaSeparatedStringConverter>();

        CreateMap<string, List<string>>()
            .ConvertUsing<CommaSeparatedStringToListConverter>();

        CreateMap<Product, ProductDto>()
            .ForMember(dest => dest.TagsAsString,
                opt => opt.MapFrom(src => src.Tags));

        CreateMap<ProductDto, Product>()
            .ForMember(dest => dest.Tags,
                opt => opt.MapFrom(src => src.TagsAsString));
    }
}

// Usage
var product = new Product
{
    Id = Guid.NewGuid(),
    Name = "Widget",
    Tags = new List<string> { "electronics", "gadget", "new" }
};

var dto = _mapper.Map<ProductDto>(product);
// dto.TagsAsString = "electronics, gadget, new"

var productFromDto = _mapper.Map<Product>(dto);
// productFromDto.Tags = ["electronics", "gadget", "new"]
```

</details>

---

## Projection to DTOs

### Exercise 9: LINQ Projection with AutoMapper
**Question:** Use AutoMapper's ProjectTo for efficient database queries with Entity Framework.

<details>
<summary>Answer</summary>

```csharp
// Domain/Entities/Order.cs
public class Order
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; }
    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; }
    public List<OrderItem> Items { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public OrderStatus Status { get; set; }
}

public class OrderItem
{
    public Guid Id { get; set; }
    public string ProductName { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
}

public class Customer
{
    public Guid Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
}

// Application/DTOs/OrderListDto.cs
public class OrderListDto
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; }
    public string CustomerName { get; set; }
    public int ItemCount { get; set; }
    public decimal Total { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Status { get; set; }
}

// Application/Mappings/OrderMappingProfile.cs
public class OrderMappingProfile : Profile
{
    public OrderMappingProfile()
    {
        CreateMap<Order, OrderListDto>()
            .ForMember(dest => dest.CustomerName,
                opt => opt.MapFrom(src => $"{src.Customer.FirstName} {src.Customer.LastName}"))
            .ForMember(dest => dest.ItemCount,
                opt => opt.MapFrom(src => src.Items.Count))
            .ForMember(dest => dest.Total,
                opt => opt.MapFrom(src => src.Items.Sum(i => i.UnitPrice * i.Quantity)))
            .ForMember(dest => dest.Status,
                opt => opt.MapFrom(src => src.Status.ToString()));
    }
}

// Application/Queries/GetOrders/GetOrdersHandler.cs
public class GetOrdersHandler
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IConfigurationProvider _configurationProvider;

    public GetOrdersHandler(
        ApplicationDbContext context,
        IMapper mapper,
        IConfigurationProvider configurationProvider)
    {
        _context = context;
        _mapper = mapper;
        _configurationProvider = configurationProvider;
    }

    // BAD: Loads entire entities then maps (N+1 query problem)
    public async Task<List<OrderListDto>> GetOrdersBad()
    {
        var orders = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Items)
            .ToListAsync();

        return _mapper.Map<List<OrderListDto>>(orders);
        // Loads all data, then projects in memory - inefficient!
    }

    // GOOD: Projects in database using ProjectTo
    public async Task<List<OrderListDto>> GetOrdersGood()
    {
        return await _context.Orders
            .ProjectTo<OrderListDto>(_configurationProvider)
            .ToListAsync();
        // Generates optimized SQL that only selects needed columns!
    }

    // With filtering
    public async Task<List<OrderListDto>> GetOrdersByStatus(OrderStatus status)
    {
        return await _context.Orders
            .Where(o => o.Status == status)
            .ProjectTo<OrderListDto>(_configurationProvider)
            .ToListAsync();
    }

    // With pagination
    public async Task<PagedResult<OrderListDto>> GetOrdersPaged(int page, int pageSize)
    {
        var query = _context.Orders
            .OrderByDescending(o => o.CreatedAt)
            .ProjectTo<OrderListDto>(_configurationProvider);

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<OrderListDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }
}

// Generated SQL comparison

// BAD approach SQL (multiple queries):
// SELECT * FROM Orders
// SELECT * FROM Customers WHERE Id IN (...)
// SELECT * FROM OrderItems WHERE OrderId IN (...)

// GOOD approach SQL (single optimized query):
// SELECT
//     o.Id,
//     o.OrderNumber,
//     o.CreatedAt,
//     o.Status,
//     c.FirstName + ' ' + c.LastName AS CustomerName,
//     COUNT(oi.Id) AS ItemCount,
//     SUM(oi.UnitPrice * oi.Quantity) AS Total
// FROM Orders o
// INNER JOIN Customers c ON o.CustomerId = c.Id
// LEFT JOIN OrderItems oi ON o.Id = oi.OrderId
// GROUP BY o.Id, o.OrderNumber, o.CreatedAt, o.Status, c.FirstName, c.LastName

public class PagedResult<T>
{
    public List<T> Items { get; set; }
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}
```

**Key Benefits of ProjectTo:**
1. Generates optimized SQL - only selects needed columns
2. Avoids N+1 query problems
3. Reduces memory usage
4. Faster execution
5. Works with EF Core's query translation

</details>

---

### Exercise 10: Nested Projection
**Question:** Project complex nested objects efficiently.

<details>
<summary>Answer</summary>

```csharp
// Domain/Entities/Course.cs
public class Course
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public Instructor Instructor { get; set; }
    public List<Module> Modules { get; set; } = new();
}

public class Instructor
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Bio { get; set; }
    public string ProfileImageUrl { get; set; }
}

public class Module
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public int Order { get; set; }
    public List<Lesson> Lessons { get; set; } = new();
}

public class Lesson
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public int DurationMinutes { get; set; }
}

// Application/DTOs/CourseDto.cs
public class CourseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public InstructorDto Instructor { get; set; }
    public List<ModuleDto> Modules { get; set; }
    public int TotalLessons { get; set; }
    public int TotalDurationMinutes { get; set; }
}

public class InstructorDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string ProfileImageUrl { get; set; }
}

public class ModuleDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public int Order { get; set; }
    public int LessonCount { get; set; }
    public List<LessonDto> Lessons { get; set; }
}

public class LessonDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public int DurationMinutes { get; set; }
}

// Application/Mappings/CourseMappingProfile.cs
public class CourseMappingProfile : Profile
{
    public CourseMappingProfile()
    {
        CreateMap<Course, CourseDto>()
            .ForMember(dest => dest.TotalLessons,
                opt => opt.MapFrom(src => src.Modules.Sum(m => m.Lessons.Count)))
            .ForMember(dest => dest.TotalDurationMinutes,
                opt => opt.MapFrom(src => src.Modules.SelectMany(m => m.Lessons).Sum(l => l.DurationMinutes)));

        CreateMap<Instructor, InstructorDto>();

        CreateMap<Module, ModuleDto>()
            .ForMember(dest => dest.LessonCount,
                opt => opt.MapFrom(src => src.Lessons.Count));

        CreateMap<Lesson, LessonDto>();
    }
}

// Application/Queries/GetCourse/GetCourseHandler.cs
public class GetCourseHandler
{
    private readonly ApplicationDbContext _context;
    private readonly IConfigurationProvider _configurationProvider;

    public async Task<CourseDto> Handle(Guid courseId)
    {
        // ProjectTo handles all nested mappings automatically
        return await _context.Courses
            .Where(c => c.Id == courseId)
            .ProjectTo<CourseDto>(_configurationProvider)
            .FirstOrDefaultAsync();
    }

    public async Task<List<CourseDto>> GetAllCourses()
    {
        return await _context.Courses
            .ProjectTo<CourseDto>(_configurationProvider)
            .ToListAsync();
    }
}
```

</details>

---

## Flattening and Unflattening

### Exercise 11: Automatic Flattening
**Question:** Demonstrate AutoMapper's automatic flattening feature.

<details>
<summary>Answer</summary>

```csharp
// Domain/Entities/Order.cs
public class Order
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; }
    public Customer Customer { get; set; }
    public Address ShippingAddress { get; set; }
}

public class Customer
{
    public Guid Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
}

public class Address
{
    public string Street { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string ZipCode { get; set; }
    public string Country { get; set; }
}

// Application/DTOs/OrderFlatDto.cs (Flattened)
public class OrderFlatDto
{
    // Order properties
    public Guid Id { get; set; }
    public string OrderNumber { get; set; }

    // Customer properties (flattened with "Customer" prefix)
    public Guid CustomerId { get; set; }
    public string CustomerFirstName { get; set; }
    public string CustomerLastName { get; set; }
    public string CustomerEmail { get; set; }

    // Address properties (flattened with "ShippingAddress" prefix)
    public string ShippingAddressStreet { get; set; }
    public string ShippingAddressCity { get; set; }
    public string ShippingAddressState { get; set; }
    public string ShippingAddressZipCode { get; set; }
    public string ShippingAddressCountry { get; set; }
}

// Application/Mappings/OrderMappingProfile.cs
public class OrderMappingProfile : Profile
{
    public OrderMappingProfile()
    {
        // AutoMapper automatically flattens!
        CreateMap<Order, OrderFlatDto>();
        // No configuration needed - it matches by naming convention

        // Reverse mapping (unflattening)
        CreateMap<OrderFlatDto, Order>()
            .ForPath(dest => dest.Customer.Id, opt => opt.MapFrom(src => src.CustomerId))
            .ForPath(dest => dest.Customer.FirstName, opt => opt.MapFrom(src => src.CustomerFirstName))
            .ForPath(dest => dest.Customer.LastName, opt => opt.MapFrom(src => src.CustomerLastName))
            .ForPath(dest => dest.Customer.Email, opt => opt.MapFrom(src => src.CustomerEmail))
            .ForPath(dest => dest.ShippingAddress.Street, opt => opt.MapFrom(src => src.ShippingAddressStreet))
            .ForPath(dest => dest.ShippingAddress.City, opt => opt.MapFrom(src => src.ShippingAddressCity))
            .ForPath(dest => dest.ShippingAddress.State, opt => opt.MapFrom(src => src.ShippingAddressState))
            .ForPath(dest => dest.ShippingAddress.ZipCode, opt => opt.MapFrom(src => src.ShippingAddressZipCode))
            .ForPath(dest => dest.ShippingAddress.Country, opt => opt.MapFrom(src => src.ShippingAddressCountry));
    }
}

// Advanced flattening example
public class Product
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public Category Category { get; set; }
    public decimal GetPrice() => 99.99m; // Method
}

public class Category
{
    public string Name { get; set; }
    public string GetDisplayName() => $"Category: {Name}"; // Method
}

public class ProductFlatDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string CategoryName { get; set; } // Flattens Category.Name
    public decimal Price { get; set; } // Maps from GetPrice() method
    public string CategoryDisplayName { get; set; } // Maps from Category.GetDisplayName()
}

public class ProductMappingProfile : Profile
{
    public ProductMappingProfile()
    {
        CreateMap<Product, ProductFlatDto>();
        // AutoMapper maps:
        // - CategoryName from Category.Name
        // - Price from GetPrice()
        // - CategoryDisplayName from Category.GetDisplayName()
    }
}
```

**Flattening Rules:**
1. Matches by prefixing with navigation property name (e.g., CustomerFirstName → Customer.FirstName)
2. Can map from methods (e.g., GetPrice() → Price)
3. Can map from nested methods (e.g., Category.GetDisplayName() → CategoryDisplayName)

</details>

---

## Conditional Mapping

### Exercise 12: PreCondition and Condition
**Question:** Use conditional mapping to control when properties are mapped.

<details>
<summary>Answer</summary>

```csharp
// Domain/Entities/User.cs
public class User
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public bool IsEmailVerified { get; set; }
    public bool IsPhoneVerified { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public int LoginCount { get; set; }
}

// Application/DTOs/UserDto.cs
public class UserDto
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public string LoginStatus { get; set; }
}

// Application/Mappings/UserMappingProfile.cs
public class UserMappingProfile : Profile
{
    public UserMappingProfile()
    {
        CreateMap<User, UserDto>()
            // Only map Email if it's verified
            .ForMember(dest => dest.Email,
                opt => opt.PreCondition(src => src.IsEmailVerified))

            // Only map Phone if it's verified
            .ForMember(dest => dest.Phone,
                opt => opt.PreCondition(src => src.IsPhoneVerified))

            // Only map LastLoginAt if not null
            .ForMember(dest => dest.LastLoginAt,
                opt => opt.Condition(src => src.LastLoginAt.HasValue))

            // Calculate login status
            .ForMember(dest => dest.LoginStatus,
                opt => opt.MapFrom(src =>
                    src.LoginCount == 0 ? "Never logged in" :
                    src.LastLoginAt.HasValue && src.LastLoginAt.Value > DateTime.UtcNow.AddDays(-7)
                        ? "Active"
                        : "Inactive"));

        // More complex conditional example
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.Email,
                opt =>
                {
                    // PreCondition: check before attempting to map
                    opt.PreCondition(src => src.IsEmailVerified);
                    // Condition: check source AND destination
                    opt.Condition((src, dest) => src.IsEmailVerified && dest.Email == null);
                });
    }
}

// Example with update scenarios
public class UpdateUserMappingProfile : Profile
{
    public UpdateUserMappingProfile()
    {
        CreateMap<UpdateUserRequest, User>()
            // Only update email if provided in request
            .ForMember(dest => dest.Email,
                opt =>
                {
                    opt.PreCondition(src => !string.IsNullOrWhiteSpace(src.Email));
                })
            // Only update phone if provided
            .ForMember(dest => dest.Phone,
                opt =>
                {
                    opt.PreCondition(src => !string.IsNullOrWhiteSpace(src.Phone));
                })
            // Never update from request
            .ForMember(dest => dest.LastLoginAt, opt => opt.Ignore())
            .ForMember(dest => dest.LoginCount, opt => opt.Ignore());
    }
}

public class UpdateUserRequest
{
    public string Username { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
}

// Usage
public class UserService
{
    private readonly IMapper _mapper;
    private readonly IUserRepository _repository;

    public async Task<UserDto> GetUserAsync(Guid id)
    {
        var user = await _repository.GetByIdAsync(id);
        var dto = _mapper.Map<UserDto>(user);

        // If email not verified, dto.Email will be null
        // If phone not verified, dto.Phone will be null

        return dto;
    }

    public async Task UpdateUserAsync(Guid id, UpdateUserRequest request)
    {
        var user = await _repository.GetByIdAsync(id);

        // Only updates properties that are provided in request
        _mapper.Map(request, user);

        await _repository.UpdateAsync(user);
    }
}
```

**PreCondition vs Condition:**
- **PreCondition**: Evaluated before mapping, only has access to source
- **Condition**: Evaluated during mapping, has access to both source and destination

</details>

---

## Value Transformations

### Exercise 13: BeforeMap and AfterMap
**Question:** Use BeforeMap and AfterMap to perform custom logic during mapping.

<details>
<summary>Answer</summary>

```csharp
// Domain/Entities/Article.cs
public class Article
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public Guid AuthorId { get; set; }
    public DateTime PublishedAt { get; set; }
    public int ViewCount { get; set; }
    public List<string> Tags { get; set; } = new();
}

// Application/DTOs/ArticleDto.cs
public class ArticleDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string ContentPreview { get; set; }
    public string AuthorName { get; set; }
    public string PublishedDate { get; set; }
    public int ViewCount { get; set; }
    public string TagsDisplay { get; set; }
    public string Slug { get; set; }
}

// Application/Mappings/ArticleMappingProfile.cs
public class ArticleMappingProfile : Profile
{
    public ArticleMappingProfile()
    {
        CreateMap<Article, ArticleDto>()
            .BeforeMap((src, dest) =>
            {
                // Execute before mapping starts
                // Can modify source or destination
                Console.WriteLine($"Starting to map article: {src.Title}");
            })
            .AfterMap((src, dest, context) =>
            {
                // Execute after mapping completes
                // Generate slug from title
                dest.Slug = GenerateSlug(src.Title);

                // Create content preview (first 200 chars)
                dest.ContentPreview = src.Content.Length > 200
                    ? src.Content.Substring(0, 200) + "..."
                    : src.Content;

                // Format tags
                dest.TagsDisplay = src.Tags.Any()
                    ? string.Join(" | ", src.Tags)
                    : "No tags";

                // Increment view count (side effect - usually avoid this!)
                src.ViewCount++;

                Console.WriteLine($"Finished mapping article: {dest.Title}");
            });
    }

    private static string GenerateSlug(string title)
    {
        return title.ToLowerInvariant()
            .Replace(" ", "-")
            .Replace("&", "and")
            .Replace(",", "")
            .Replace(".", "");
    }
}

// More advanced example with dependency injection
public class OrderMappingProfile : Profile
{
    public OrderMappingProfile()
    {
        CreateMap<Order, OrderDto>()
            .BeforeMap<EnrichOrderAction>()
            .AfterMap<CalculateOrderTotalsAction>();
    }
}

// Custom mapping action with DI
public class EnrichOrderAction : IMappingAction<Order, OrderDto>
{
    private readonly ICustomerRepository _customerRepository;

    public EnrichOrderAction(ICustomerRepository customerRepository)
    {
        _customerRepository = customerRepository;
    }

    public void Process(Order source, OrderDto destination, ResolutionContext context)
    {
        // Enrich with customer data
        var customer = _customerRepository.GetByIdAsync(source.CustomerId).Result;
        destination.CustomerName = $"{customer.FirstName} {customer.LastName}";
    }
}

public class CalculateOrderTotalsAction : IMappingAction<Order, OrderDto>
{
    public void Process(Order source, OrderDto destination, ResolutionContext context)
    {
        // Calculate totals after mapping
        destination.Subtotal = source.Items.Sum(i => i.UnitPrice * i.Quantity);
        destination.Tax = destination.Subtotal * 0.08m;
        destination.Total = destination.Subtotal + destination.Tax;
    }
}

// Example with validation
public class ValidatedMappingProfile : Profile
{
    public ValidatedMappingProfile()
    {
        CreateMap<CreateProductRequest, Product>()
            .BeforeMap((src, dest, context) =>
            {
                // Validate before mapping
                if (string.IsNullOrWhiteSpace(src.Name))
                    throw new ValidationException("Product name is required");

                if (src.Price <= 0)
                    throw new ValidationException("Price must be positive");
            })
            .AfterMap((src, dest, context) =>
            {
                // Set audit fields
                dest.CreatedAt = DateTime.UtcNow;
                dest.CreatedBy = context.Items["CurrentUserId"] as string;
            });
    }
}

// Usage with context items
public class ProductService
{
    private readonly IMapper _mapper;

    public Product CreateProduct(CreateProductRequest request, string currentUserId)
    {
        var product = _mapper.Map<Product>(request, opt =>
        {
            opt.Items["CurrentUserId"] = currentUserId;
        });

        return product;
    }
}
```

**Key Points:**
- BeforeMap: Runs before mapping starts
- AfterMap: Runs after mapping completes
- Can use inline lambdas or separate IMappingAction classes
- IMappingAction supports dependency injection
- Context.Items allows passing data between mapping stages

</details>

---

## Collections Mapping

### Exercise 14: Collection Mapping Strategies
**Question:** Demonstrate different strategies for mapping collections.

<details>
<summary>Answer</summary>

```csharp
// Domain/Entities/Playlist.cs
public class Playlist
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public List<Song> Songs { get; set; } = new();
    public HashSet<string> Tags { get; set; } = new();
    public Dictionary<string, string> Metadata { get; set; } = new();
}

public class Song
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Artist { get; set; }
    public int DurationSeconds { get; set; }
}

// Application/DTOs/PlaylistDto.cs
public class PlaylistDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public List<SongDto> Songs { get; set; }
    public List<string> Tags { get; set; }
    public Dictionary<string, string> Metadata { get; set; }
    public int TotalDuration { get; set; }
}

public class SongDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Artist { get; set; }
    public string Duration { get; set; } // Formatted as "3:45"
}

// Application/Mappings/PlaylistMappingProfile.cs
public class PlaylistMappingProfile : Profile
{
    public PlaylistMappingProfile()
    {
        // List to List mapping
        CreateMap<Playlist, PlaylistDto>()
            .ForMember(dest => dest.TotalDuration,
                opt => opt.MapFrom(src => src.Songs.Sum(s => s.DurationSeconds)))
            // HashSet to List
            .ForMember(dest => dest.Tags,
                opt => opt.MapFrom(src => src.Tags.ToList()));

        CreateMap<Song, SongDto>()
            .ForMember(dest => dest.Duration,
                opt => opt.MapFrom(src => FormatDuration(src.DurationSeconds)));

        // Reverse mapping with collection preservation
        CreateMap<PlaylistDto, Playlist>()
            .ForMember(dest => dest.Songs, opt => opt.Ignore()) // Handle separately
            .AfterMap((src, dest) =>
            {
                // Clear and repopulate
                dest.Songs.Clear();
                dest.Songs.AddRange(src.Songs.Select(s => new Song
                {
                    Id = s.Id,
                    Title = s.Title,
                    Artist = s.Artist
                }));
            });
    }

    private static string FormatDuration(int seconds)
    {
        var minutes = seconds / 60;
        var secs = seconds % 60;
        return $"{minutes}:{secs:D2}";
    }
}

// Array mapping example
public class ArrayMappingProfile : Profile
{
    public ArrayMappingProfile()
    {
        // Array to List
        CreateMap<Product[], List<ProductDto>>();

        // List to Array
        CreateMap<List<ProductDto>, Product[]>();

        // IEnumerable to List
        CreateMap<IEnumerable<Product>, List<ProductDto>>();
    }
}

// Advanced collection scenarios
public class AdvancedCollectionProfile : Profile
{
    public AdvancedCollectionProfile()
    {
        // Dictionary mapping
        CreateMap<Dictionary<string, Product>, Dictionary<string, ProductDto>>();

        // Collection with filtering
        CreateMap<Order, OrderDto>()
            .ForMember(dest => dest.ActiveItems,
                opt => opt.MapFrom(src =>
                    src.Items.Where(i => i.IsActive).ToList()));

        // Collection with ordering
        CreateMap<Course, CourseDto>()
            .ForMember(dest => dest.Modules,
                opt => opt.MapFrom(src =>
                    src.Modules.OrderBy(m => m.Order).ToList()));

        // Collection with transformation
        CreateMap<ShoppingCart, ShoppingCartDto>()
            .ForMember(dest => dest.ItemGroups,
                opt => opt.MapFrom(src =>
                    src.Items.GroupBy(i => i.Category)
                        .Select(g => new ItemGroup
                        {
                            Category = g.Key,
                            Items = g.ToList()
                        })));

        // Nested collection mapping
        CreateMap<Department, DepartmentDto>()
            .ForMember(dest => dest.Employees,
                opt => opt.MapFrom(src => src.Employees))
            .ForMember(dest => dest.TotalEmployees,
                opt => opt.MapFrom(src => src.Employees.Count))
            .ForMember(dest => dest.SubDepartments,
                opt => opt.MapFrom(src => src.SubDepartments));
    }
}

// Usage examples
public class PlaylistService
{
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _context;

    // Projection with collections
    public async Task<List<PlaylistDto>> GetPlaylistsAsync()
    {
        return await _context.Playlists
            .ProjectTo<PlaylistDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
        // Efficiently projects all collections in single query
    }

    // Manual collection mapping
    public PlaylistDto MapWithCustomLogic(Playlist playlist)
    {
        var dto = _mapper.Map<PlaylistDto>(playlist);

        // Additional collection processing
        dto.Songs = playlist.Songs
            .Where(s => s.DurationSeconds > 60) // Only songs > 1 minute
            .OrderBy(s => s.Title)
            .Take(10) // Top 10
            .Select(s => _mapper.Map<SongDto>(s))
            .ToList();

        return dto;
    }

    // Update collection mapping
    public async Task UpdatePlaylistAsync(Guid id, UpdatePlaylistDto dto)
    {
        var playlist = await _context.Playlists
            .Include(p => p.Songs)
            .FirstOrDefaultAsync(p => p.Id == id);

        // Map non-collection properties
        _mapper.Map(dto, playlist);

        // Manually handle collection update
        playlist.Songs.Clear();
        playlist.Songs.AddRange(
            dto.SongIds.Select(songId => new Song { Id = songId })
        );

        await _context.SaveChangesAsync();
    }
}
```

**Collection Mapping Tips:**
1. AutoMapper automatically maps between collection types (List, Array, IEnumerable, etc.)
2. Use ProjectTo for efficient database queries
3. Use ForMember with MapFrom for custom collection transformations
4. Be careful with update scenarios - may need manual handling
5. Consider using AfterMap for complex collection logic

</details>

---

## Mapping Validation

### Exercise 15: Validate Mapping Configuration
**Question:** Set up mapping validation to catch configuration errors at startup.

<details>
<summary>Answer</summary>

```csharp
// Application/Mappings/ProductMappingProfile.cs
public class ProductMappingProfile : Profile
{
    public ProductMappingProfile()
    {
        CreateMap<Product, ProductDto>();
        CreateMap<ProductDto, Product>();

        // This will fail validation - missing mapping for unmapped properties
        CreateMap<Product, ProductSummaryDto>();
        // ProductSummaryDto has CategoryName property but no mapping configured!
    }
}

public class ProductSummaryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string CategoryName { get; set; } // This property has no source!
}

// Program.cs - Configuration with validation
var builder = WebApplication.CreateBuilder(args);

// Add AutoMapper with validation
builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddMaps(typeof(Program).Assembly);

    // Development: Assert configuration validity at startup
    #if DEBUG
    cfg.Advanced.BeforeSealing(c =>
    {
        // Will throw exception if any mapping is invalid
        c.AssertConfigurationIsValid();
    });
    #endif
}, typeof(Program).Assembly);

// Alternative: Manually validate in development
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var mapper = scope.ServiceProvider.GetRequiredService<IMapper>();

    try
    {
        mapper.ConfigurationProvider.AssertConfigurationIsValid();
        Console.WriteLine("✓ AutoMapper configuration is valid");
    }
    catch (AutoMapperConfigurationException ex)
    {
        Console.WriteLine("✗ AutoMapper configuration errors:");
        Console.WriteLine(ex.Message);
        // Optionally throw to prevent startup with invalid config
        throw;
    }
}

// Fix the invalid mapping
public class FixedProductMappingProfile : Profile
{
    public FixedProductMappingProfile()
    {
        CreateMap<Product, ProductSummaryDto>()
            // Explicitly configure the missing mapping
            .ForMember(dest => dest.CategoryName,
                opt => opt.MapFrom(src => src.Category.Name));

        // Or ignore if not needed
        CreateMap<Product, ProductSummaryDto>()
            .ForMember(dest => dest.CategoryName, opt => opt.Ignore());
    }
}

// Unit tests for mapping configuration
public class MappingProfileTests
{
    private readonly IMapper _mapper;

    public MappingProfileTests()
    {
        var config = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<ProductMappingProfile>();
            cfg.AddProfile<OrderMappingProfile>();
            cfg.AddProfile<CustomerMappingProfile>();
        });

        _mapper = config.CreateMapper();
    }

    [Fact]
    public void Configuration_ShouldBeValid()
    {
        // This will throw if configuration is invalid
        _mapper.ConfigurationProvider.AssertConfigurationIsValid();
    }

    [Fact]
    public void ProductMapping_ShouldMapAllProperties()
    {
        // Arrange
        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = "Test Product",
            Price = 99.99m,
            Category = new Category { Name = "Electronics" }
        };

        // Act
        var dto = _mapper.Map<ProductDto>(product);

        // Assert
        Assert.Equal(product.Id, dto.Id);
        Assert.Equal(product.Name, dto.Name);
        Assert.Equal(product.Price, dto.Price);
    }
}

// Integration test
public class AutoMapperConfigurationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public AutoMapperConfigurationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public void AutoMapper_Configuration_IsValid()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var mapper = scope.ServiceProvider.GetRequiredService<IMapper>();

        // Act & Assert
        mapper.ConfigurationProvider.AssertConfigurationIsValid();
    }
}

// Custom validation for specific scenarios
public class CustomValidationProfile : Profile
{
    public CustomValidationProfile()
    {
        CreateMap<Source, Destination>()
            .ForAllMembers(opts =>
            {
                // Custom validation logic
                opts.Condition((src, dest, srcMember, destMember, context) =>
                {
                    // Only map non-null values
                    return srcMember != null;
                });
            });
    }
}
```

**Validation Best Practices:**
1. Always validate configuration in development
2. Use AssertConfigurationIsValid() at startup
3. Write unit tests for mapping profiles
4. Explicitly configure or ignore all destination properties
5. Catch errors early rather than at runtime

</details>

---

## Performance Considerations

### Exercise 16: Optimize AutoMapper Performance
**Question:** Demonstrate techniques to optimize AutoMapper performance.

<details>
<summary>Answer</summary>

```csharp
// 1. Use ProjectTo for database queries (most important!)
public class OrderService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IConfigurationProvider _configuration;

    // BAD: Load all data then map
    public async Task<List<OrderDto>> GetOrdersBad()
    {
        var orders = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Items)
            .ToListAsync();

        return _mapper.Map<List<OrderDto>>(orders);
        // Performance: Loads ALL columns, ALL relationships, then maps in memory
        // Memory: High - loads entire entities
        // Database: Multiple queries or large JOIN
    }

    // GOOD: Project in database
    public async Task<List<OrderDto>> GetOrdersGood()
    {
        return await _context.Orders
            .ProjectTo<OrderDto>(_configuration)
            .ToListAsync();
        // Performance: Only selects needed columns in optimized SQL
        // Memory: Low - only creates DTOs
        // Database: Single optimized query
    }
}

// 2. Avoid expensive operations in mapping
public class SlowMappingProfile : Profile
{
    public SlowMappingProfile()
    {
        CreateMap<Product, ProductDto>()
            .ForMember(dest => dest.ThumbnailUrl,
                opt => opt.MapFrom(src => GenerateThumbnail(src.ImageUrl))); // SLOW!
    }

    private string GenerateThumbnail(string imageUrl)
    {
        // This is expensive and runs for EACH product!
        Thread.Sleep(100); // Simulating image processing
        return $"thumbnail_{imageUrl}";
    }
}

public class FastMappingProfile : Profile
{
    public FastMappingProfile()
    {
        CreateMap<Product, ProductDto>()
            // Just map the URL, generate thumbnail asynchronously later
            .ForMember(dest => dest.ThumbnailUrl,
                opt => opt.MapFrom(src => src.ImageUrl));
    }
}

// 3. Use static configuration (don't create MapperConfiguration repeatedly)
public class Startup
{
    // BAD: Creating configuration on every request
    public class BadService
    {
        public OrderDto GetOrder(Order order)
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<OrderMappingProfile>();
            });
            var mapper = config.CreateMapper();

            return mapper.Map<OrderDto>(order);
            // Creates new configuration and mapper each time!
        }
    }

    // GOOD: Use DI with singleton configuration
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddAutoMapper(typeof(Program).Assembly);
        // Configuration is created once and cached
    }
}

// 4. Avoid mapping inside loops
public class ProductService
{
    private readonly IMapper _mapper;

    // BAD: Map one at a time
    public List<ProductDto> GetProductsBad(List<Product> products)
    {
        var dtos = new List<ProductDto>();

        foreach (var product in products)
        {
            dtos.Add(_mapper.Map<ProductDto>(product));
            // Overhead for each mapping
        }

        return dtos;
    }

    // GOOD: Map collection at once
    public List<ProductDto> GetProductsGood(List<Product> products)
    {
        return _mapper.Map<List<ProductDto>>(products);
        // Single mapping operation, more efficient
    }
}

// 5. Cache compiled mappings
public class CachedMappingService
{
    private readonly IMapper _mapper;
    private static readonly ConcurrentDictionary<Type, object> _mapperCache = new();

    public TDest Map<TSource, TDest>(TSource source)
    {
        // AutoMapper already caches compiled mappings internally
        // No need to manually cache
        return _mapper.Map<TDest>(source);
    }
}

// 6. Profile performance
public class PerformanceTests
{
    private readonly IMapper _mapper;

    [Fact]
    public void Measure_Mapping_Performance()
    {
        var products = GenerateProducts(10000);
        var stopwatch = Stopwatch.StartNew();

        var dtos = _mapper.Map<List<ProductDto>>(products);

        stopwatch.Stop();
        _output.WriteLine($"Mapped 10,000 products in {stopwatch.ElapsedMilliseconds}ms");
        Assert.True(stopwatch.ElapsedMilliseconds < 1000, "Mapping too slow!");
    }

    [Benchmark]
    public void Benchmark_AutoMapper()
    {
        var product = new Product { /* ... */ };
        _mapper.Map<ProductDto>(product);
    }

    [Benchmark]
    public void Benchmark_ManualMapping()
    {
        var product = new Product { /* ... */ };
        var dto = new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price
        };
    }
}

// 7. Optimize complex mappings with explicit configuration
public class OptimizedProfile : Profile
{
    public OptimizedProfile()
    {
        CreateMap<Order, OrderDto>()
            // Explicitly configure all properties
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.OrderNumber, opt => opt.MapFrom(src => src.OrderNumber))
            .ForMember(dest => dest.Total, opt => opt.MapFrom(src => src.Total))
            // Pre-calculate expensive values
            .ForMember(dest => dest.ItemCount, opt => opt.MapFrom(src => src.Items.Count))
            // Skip expensive calculations if possible
            .ForMember(dest => dest.DetailedSummary, opt => opt.Ignore());

        // Use value converters for reusable transformations
        CreateMap<Money, string>().ConvertUsing<MoneyToStringConverter>();
    }
}

// 8. Benchmarking AutoMapper vs Manual Mapping
public class MappingBenchmarks
{
    private IMapper _mapper;
    private List<Product> _products;

    [GlobalSetup]
    public void Setup()
    {
        var config = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<ProductMappingProfile>();
        });
        _mapper = config.CreateMapper();
        _products = Enumerable.Range(1, 1000)
            .Select(i => new Product
            {
                Id = Guid.NewGuid(),
                Name = $"Product {i}",
                Price = i * 10.0m
            })
            .ToList();
    }

    [Benchmark]
    public List<ProductDto> AutoMapper_Mapping()
    {
        return _mapper.Map<List<ProductDto>>(_products);
    }

    [Benchmark]
    public List<ProductDto> Manual_Mapping()
    {
        return _products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Price = p.Price
        }).ToList();
    }
}
```

**Performance Tips:**
1. **Use ProjectTo** for EF Core queries (biggest impact!)
2. **Avoid expensive operations** in value resolvers
3. **Use DI** - don't create MapperConfiguration repeatedly
4. **Map collections**, not individual items in loops
5. **Profile performance** to identify bottlenecks
6. **Consider manual mapping** for extremely hot paths
7. **Cache nothing** - AutoMapper already optimizes internally

**Benchmarks (approximate):**
- AutoMapper: ~2-3x slower than manual mapping
- ProjectTo: Can be 10-100x faster than loading entities then mapping
- First mapping: Slower (compilation), subsequent: Fast (cached)

</details>

---

## When to Use vs Manual Mapping

### Exercise 17: Choose Mapping Strategy
**Question:** Provide guidelines and examples for when to use AutoMapper vs manual mapping.

<details>
<summary>Answer</summary>

```csharp
// ===== USE AUTOMAPPER =====

// 1. Simple property mapping with many properties
public class CustomerMappingProfile : Profile
{
    public CustomerMappingProfile()
    {
        // 20+ properties, all matching names
        CreateMap<Customer, CustomerDto>();
        // AutoMapper: Save tons of boilerplate
    }
}

// Manual equivalent would be verbose:
public CustomerDto ManualMap(Customer customer)
{
    return new CustomerDto
    {
        Id = customer.Id,
        FirstName = customer.FirstName,
        LastName = customer.LastName,
        Email = customer.Email,
        Phone = customer.Phone,
        Address = customer.Address,
        City = customer.City,
        State = customer.State,
        ZipCode = customer.ZipCode,
        // ... 15 more properties
    };
}

// 2. Flattening complex object graphs
public class OrderFlatteningProfile : Profile
{
    public OrderFlatteningProfile()
    {
        CreateMap<Order, OrderFlatDto>();
        // Automatically flattens nested properties
    }
}

// 3. Database projections (EF Core)
public async Task<List<ProductDto>> GetProducts()
{
    return await _context.Products
        .ProjectTo<ProductDto>(_mapper.ConfigurationProvider)
        .ToListAsync();
    // AutoMapper generates optimized SQL
}

// 4. Consistent mapping across application
// Define once, use everywhere
public class UserService
{
    public UserDto GetUser(Guid id)
    {
        var user = _repository.GetById(id);
        return _mapper.Map<UserDto>(user);
        // Consistent mapping logic
    }
}

public class UserController
{
    public IActionResult GetUser(Guid id)
    {
        var user = _userService.GetUser(id);
        return Ok(_mapper.Map<UserViewModel>(user));
        // Reuse same mapping configuration
    }
}

// ===== USE MANUAL MAPPING =====

// 1. Performance-critical hot paths
public class HighPerformanceService
{
    public List<ProductDto> GetTopProducts(List<Product> products)
    {
        // Called millions of times per second
        return products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Price = p.Price
        }).ToList();
        // Manual: 2-3x faster than AutoMapper
    }
}

// 2. Complex business logic during mapping
public OrderDto MapOrder(Order order)
{
    var dto = new OrderDto
    {
        Id = order.Id,
        OrderNumber = order.OrderNumber,
        // Complex calculation
        Total = CalculateTotal(order),
        // Conditional logic
        Status = DetermineStatus(order),
        // External service call
        ShippingEstimate = _shippingService.EstimateDelivery(order).Result,
        // Multiple data sources
        CustomerRating = _customerService.GetRating(order.CustomerId)
    };

    return dto;
}

// 3. Async operations required
public async Task<OrderDto> MapOrderAsync(Order order)
{
    return new OrderDto
    {
        Id = order.Id,
        OrderNumber = order.OrderNumber,
        // Await async operations
        CustomerName = await _customerService.GetCustomerNameAsync(order.CustomerId),
        ShippingCost = await _shippingService.CalculateCostAsync(order),
        TaxAmount = await _taxService.CalculateTaxAsync(order)
    };
    // AutoMapper is synchronous - manual mapping required
}

// 4. Very few properties
public ProductSummary CreateSummary(Product product)
{
    // Only 2-3 properties - AutoMapper overhead not worth it
    return new ProductSummary
    {
        Name = product.Name,
        Price = product.Price
    };
}

// 5. Mapping with validation/error handling
public Result<UserDto> MapUser(User user)
{
    if (user == null)
        return Result.Failure<UserDto>("User not found");

    if (!user.IsActive)
        return Result.Failure<UserDto>("User is inactive");

    return Result.Success(new UserDto
    {
        Id = user.Id,
        Username = user.Username,
        Email = user.Email
    });
    // Complex control flow easier with manual mapping
}

// ===== HYBRID APPROACH =====

// Use AutoMapper for basic mapping, enhance manually
public class HybridMappingService
{
    private readonly IMapper _mapper;
    private readonly IExternalService _externalService;

    public async Task<OrderDto> GetOrderAsync(Guid id)
    {
        var order = await _repository.GetByIdAsync(id);

        // AutoMapper for standard properties
        var dto = _mapper.Map<OrderDto>(order);

        // Manual for complex/async operations
        dto.EstimatedDelivery = await _externalService.GetDeliveryEstimateAsync(order);
        dto.RecommendedProducts = await GetRecommendationsAsync(order);
        dto.CustomerLifetimeValue = await CalculateLifetimeValueAsync(order.CustomerId);

        return dto;
    }
}

// Decision Tree
public class MappingStrategyDecisionTree
{
    public string DetermineStrategy(MappingScenario scenario)
    {
        if (scenario.IsPerformanceCritical && scenario.PropertyCount < 5)
            return "Manual Mapping - Performance critical with few properties";

        if (scenario.RequiresAsyncOperations)
            return "Manual Mapping - Async required";

        if (scenario.HasComplexBusinessLogic)
            return "Manual Mapping - Complex logic easier to express";

        if (scenario.IsEFCoreProjection)
            return "AutoMapper ProjectTo - Optimized database queries";

        if (scenario.PropertyCount > 10 && scenario.MostPropertiesMatch)
            return "AutoMapper - Many properties with matching names";

        if (scenario.RequiresFlattening)
            return "AutoMapper - Automatic flattening";

        if (scenario.PropertyCount < 5)
            return "Manual Mapping - Few properties, not worth AutoMapper overhead";

        return "AutoMapper - Default choice for standard mappings";
    }
}

public class MappingScenario
{
    public bool IsPerformanceCritical { get; set; }
    public int PropertyCount { get; set; }
    public bool RequiresAsyncOperations { get; set; }
    public bool HasComplexBusinessLogic { get; set; }
    public bool IsEFCoreProjection { get; set; }
    public bool MostPropertiesMatch { get; set; }
    public bool RequiresFlattening { get; set; }
}

// Guidelines Summary
/*
USE AUTOMAPPER WHEN:
✓ Many properties (>10)
✓ Property names match
✓ Need flattening
✓ EF Core projections
✓ Consistent mapping across app
✓ Reverse mapping needed
✓ Development speed important

USE MANUAL MAPPING WHEN:
✓ Performance critical (hot path)
✓ Few properties (<5)
✓ Complex business logic
✓ Async operations required
✓ Need precise control
✓ Error handling important
✓ Conditional mapping complex

USE HYBRID WHEN:
✓ Standard properties + complex logic
✓ AutoMapper + async enhancements
✓ Basic mapping + external service calls
*/
```

</details>

---

## Advanced Mapping Scenarios

### Exercise 18: Inheritance Mapping
**Question:** Map a base type and derived types using AutoMapper inheritance features.

<details>
<summary>Answer</summary>

```csharp
public class Order { public Guid Id { get; set; } }
public class MarketOrder : Order { public decimal LimitPrice { get; set; } }
public class StopOrder : Order { public decimal StopPrice { get; set; } }

public class OrderDto { public Guid Id { get; set; } }
public class MarketOrderDto : OrderDto { public decimal LimitPrice { get; set; } }
public class StopOrderDto : OrderDto { public decimal StopPrice { get; set; } }

public class OrderProfile : Profile
{
    public OrderProfile()
    {
        CreateMap<Order, OrderDto>()
            .Include<MarketOrder, MarketOrderDto>()
            .Include<StopOrder, StopOrderDto>();

        CreateMap<MarketOrder, MarketOrderDto>();
        CreateMap<StopOrder, StopOrderDto>();
    }
}
```

</details>

---

### Exercise 19: Mapping to Records
**Question:** Map into a record type with constructor parameters.

<details>
<summary>Answer</summary>

```csharp
public record TradeDto(Guid Id, string Symbol, decimal Price);

public class Trade
{
    public Guid Id { get; set; }
    public string Symbol { get; set; }
    public decimal Price { get; set; }
}

CreateMap<Trade, TradeDto>();
```

AutoMapper will bind by constructor parameter names.
</details>

---

### Exercise 20: ForPath for Nested Properties
**Question:** Map a flattened DTO into a nested domain model.

<details>
<summary>Answer</summary>

```csharp
public class OrderDto
{
    public string City { get; set; }
    public string Country { get; set; }
}

public class Order
{
    public Address Shipping { get; set; } = new();
}

public class Address
{
    public string City { get; set; }
    public string Country { get; set; }
}

CreateMap<OrderDto, Order>()
    .ForPath(d => d.Shipping.City, o => o.MapFrom(s => s.City))
    .ForPath(d => d.Shipping.Country, o => o.MapFrom(s => s.Country));
```

</details>

---

### Exercise 21: Map into Existing Instance
**Question:** Update an existing entity without creating a new instance.

<details>
<summary>Answer</summary>

```csharp
var existing = await _repo.GetByIdAsync(id);
_mapper.Map(updateDto, existing); // updates existing instance
```

Configure maps to ignore immutable fields like `Id`.
</details>

---

### Exercise 22: Ignore Nulls on Update
**Question:** Ignore null source values so partial updates do not overwrite fields.

<details>
<summary>Answer</summary>

```csharp
CreateMap<UpdateUserDto, User>()
    .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
```

</details>

---

### Exercise 23: BeforeMap/AfterMap Hooks
**Question:** Add audit timestamps during mapping.

<details>
<summary>Answer</summary>

```csharp
CreateMap<CreateOrderDto, Order>()
    .BeforeMap((src, dest) => dest.CreatedBy = "system")
    .AfterMap((src, dest) => dest.UpdatedAt = DateTime.UtcNow);
```

</details>

---

### Exercise 24: Global Value Converter
**Question:** Configure a global converter for money formatting.

<details>
<summary>Answer</summary>

```csharp
var config = new MapperConfiguration(cfg =>
{
    cfg.CreateMap<Money, string>().ConvertUsing(m => $"{m.Amount:N2} {m.Currency}");
    cfg.AddProfile<OrderProfile>();
});
```

</details>

---

### Exercise 25: Enum Mapping
**Question:** Map enums to strings and back safely.

<details>
<summary>Answer</summary>

```csharp
CreateMap<OrderStatus, string>().ConvertUsing(s => s.ToString());
CreateMap<string, OrderStatus>().ConvertUsing(s => Enum.Parse<OrderStatus>(s));
```

Guard against invalid strings in input DTOs.
</details>

---

## Testing & Troubleshooting

### Exercise 26: ProjectTo with Parameters
**Question:** Pass runtime parameters into ProjectTo for queries.

<details>
<summary>Answer</summary>

```csharp
var parameters = new Dictionary<string, object>
{
    ["cutoff"] = cutoffDate
};

var dtos = await _context.Orders
    .ProjectTo<OrderDto>(_mapper.ConfigurationProvider, parameters)
    .ToListAsync();
```

</details>

---

### Exercise 27: PreserveReferences for Cycles
**Question:** Prevent infinite loops when mapping cyclical graphs.

<details>
<summary>Answer</summary>

```csharp
CreateMap<Node, NodeDto>().PreserveReferences();
```

Use `MaxDepth` as needed for deep graphs.
</details>

---

### Exercise 28: UseEqualityComparison for Collections
**Question:** Update child collections without recreating every item.

<details>
<summary>Answer</summary>

```csharp
CreateMap<OrderDto, Order>()
    .ForMember(d => d.Items, opt =>
    {
        opt.MapFrom(s => s.Items);
        opt.UseDestinationValue();
        opt.EqualityComparison((src, dest) => src.Id == dest.Id);
    });
```

</details>

---

### Exercise 29: Diagnose Missing Maps
**Question:** Force configuration validation at startup.

<details>
<summary>Answer</summary>

```csharp
var mapper = app.Services.GetRequiredService<IMapper>();
mapper.ConfigurationProvider.AssertConfigurationIsValid();
```

This fails fast when mappings are missing or ambiguous.
</details>

---

### Exercise 30: Unit Test a Mapping Profile
**Question:** Write a unit test that validates a profile.

<details>
<summary>Answer</summary>

```csharp
var config = new MapperConfiguration(cfg => cfg.AddProfile<OrderProfile>());
config.AssertConfigurationIsValid();
```

Add test cases that map representative objects to catch regressions.
</details>

