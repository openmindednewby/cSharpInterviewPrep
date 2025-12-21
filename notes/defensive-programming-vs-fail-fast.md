# Defensive Programming vs Fail-Fast

A comprehensive guide to two fundamental error handling philosophies in software development.

---

## Quick Comparison

| Aspect | Defensive Programming | Fail-Fast |
|--------|----------------------|-----------|
| **Philosophy** | Anticipate and handle invalid input | Detect invalid state early and stop immediately |
| **When to use** | System boundaries, external input | Core business logic, internal contracts |
| **Error handling** | Graceful degradation | Immediate exception |
| **Example** | `if (price <= 0) return 0;` | `if (price <= 0) throw new ArgumentException();` |
| **Goal** | Keep system running | Surface bugs early |

---

## Defensive Programming

**Definition:**
Defensive programming means **anticipating invalid or unexpected input** and handling it safely to keep the system running.

### Core Principles

1. **Never trust external input**
2. **Validate at boundaries**
3. **Provide fallback values**
4. **Log anomalies but continue**
5. **Protect against nulls and edge cases**

### Example: Basic Defensive Check

```csharp
public decimal CalculateDiscount(decimal? price)
{
    // Defensive: handle null and invalid values gracefully
    if (price == null || price <= 0)
    {
        _logger.LogWarning("Invalid price received: {Price}", price);
        return 0;
    }

    return price.Value * 0.1m;
}
```

### Example: API Controller (Defensive Layer)

```csharp
[HttpPost("orders")]
public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
{
    // Defensive programming at the API boundary
    if (request == null)
    {
        return BadRequest("Request body is required");
    }

    if (string.IsNullOrWhiteSpace(request.Symbol))
    {
        return BadRequest("Symbol is required");
    }

    if (request.Quantity <= 0)
    {
        return BadRequest("Quantity must be positive");
    }

    if (request.Price < 0)
    {
        return BadRequest("Price cannot be negative");
    }

    try
    {
        var order = await _orderService.CreateOrderAsync(request);
        return Ok(order);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Failed to create order");
        return StatusCode(500, "An error occurred while processing your request");
    }
}
```

### Example: External Data Integration

```csharp
public class MarketDataAdapter
{
    public decimal? ParsePrice(string priceData)
    {
        // Defensive: external data may be malformed
        if (string.IsNullOrWhiteSpace(priceData))
        {
            _logger.LogWarning("Empty price data received");
            return null;
        }

        if (!decimal.TryParse(priceData, out var price))
        {
            _logger.LogWarning("Could not parse price: {PriceData}", priceData);
            return null;
        }

        if (price < 0)
        {
            _logger.LogWarning("Negative price received: {Price}", price);
            return null;
        }

        return price;
    }
}
```

### Pros

✅ Prevents runtime crashes
✅ More resilient to bad input or external systems
✅ Useful at system boundaries (APIs, user input, integrations)
✅ Keeps services running under adverse conditions
✅ Good for production stability

### Cons

❌ Can hide bugs if overused
❌ Adds extra checks and complexity
❌ May mask incorrect usage instead of fixing it
❌ Silent failures can be hard to debug
❌ Performance overhead from excessive validation

### Best Used When

- Dealing with **user input**
- Handling **third-party or external data**
- **System must stay up** at all costs
- At **API boundaries and controllers**
- Integrating with **unreliable external systems**
- Processing **untrusted data** (webhooks, file uploads)

---

## Fail-Fast

**Definition:**
Fail-fast means **detecting invalid states early and stopping execution immediately** rather than trying to recover.

### Core Principles

1. **Validate assumptions immediately**
2. **Fail loudly with clear errors**
3. **Enforce invariants strictly**
4. **Don't silently absorb errors**
5. **Make bugs visible**

### Example: Basic Fail-Fast

```csharp
public decimal CalculateDiscount(decimal price)
{
    // Fail-fast: enforce preconditions strictly
    if (price <= 0)
        throw new ArgumentException("Price must be positive", nameof(price));

    return price * 0.1m;
}
```

### Example: Domain Entity (Fail-Fast Validation)

```csharp
public class Order
{
    public Guid Id { get; private set; }
    public string Symbol { get; private set; }
    public decimal Quantity { get; private set; }
    public decimal Price { get; private set; }
    public OrderStatus Status { get; private set; }

    public Order(string symbol, decimal quantity, decimal price)
    {
        // Fail-fast: enforce invariants at construction
        if (string.IsNullOrWhiteSpace(symbol))
            throw new ArgumentException("Symbol cannot be empty", nameof(symbol));

        if (symbol.Length > 10)
            throw new ArgumentException("Symbol too long", nameof(symbol));

        if (quantity <= 0)
            throw new ArgumentException("Quantity must be positive", nameof(quantity));

        if (price < 0)
            throw new ArgumentException("Price cannot be negative", nameof(price));

        Id = Guid.NewGuid();
        Symbol = symbol.ToUpperInvariant();
        Quantity = quantity;
        Price = price;
        Status = OrderStatus.Pending;
    }

    public void Execute(decimal executedPrice)
    {
        // Fail-fast: enforce state machine rules
        if (Status != OrderStatus.Pending)
            throw new InvalidOperationException(
                $"Cannot execute order in {Status} status");

        if (executedPrice < 0)
            throw new ArgumentException(
                "Executed price cannot be negative", nameof(executedPrice));

        Price = executedPrice;
        Status = OrderStatus.Executed;
    }
}
```

### Example: Trading Risk Validation

```csharp
public class RiskValidator
{
    public void ValidateTradeRisk(Trade trade, Account account)
    {
        // Fail-fast: critical business rules must be enforced

        if (trade == null)
            throw new ArgumentNullException(nameof(trade));

        if (account == null)
            throw new ArgumentNullException(nameof(account));

        // Position limit check
        var currentExposure = account.GetExposure(trade.Symbol);
        var newExposure = currentExposure + trade.Notional;

        if (newExposure > account.MaxExposurePerSymbol)
            throw new RiskLimitExceededException(
                $"Position limit exceeded for {trade.Symbol}. " +
                $"Current: {currentExposure:C}, New: {newExposure:C}, " +
                $"Limit: {account.MaxExposurePerSymbol:C}");

        // Margin check
        var requiredMargin = trade.CalculateRequiredMargin();
        if (account.AvailableMargin < requiredMargin)
            throw new InsufficientMarginException(
                $"Insufficient margin. Required: {requiredMargin:C}, " +
                $"Available: {account.AvailableMargin:C}");

        // Credit limit check
        if (account.TotalExposure + trade.Notional > account.CreditLimit)
            throw new CreditLimitExceededException(
                $"Credit limit would be exceeded. " +
                $"Limit: {account.CreditLimit:C}");
    }
}
```

### Pros

✅ Bugs surface early and clearly
✅ Easier debugging
✅ Enforces correct usage and invariants
✅ Clear contract violations
✅ Prevents invalid state propagation
✅ Better for development and testing

### Cons

❌ Can cause crashes if not handled
❌ Not suitable for user-facing or unstable inputs
❌ Requires proper exception handling strategy
❌ May reduce system availability
❌ Needs mature error handling infrastructure

### Best Used When

- Inside **core business logic**
- In **internal services** with strong contracts
- Enforcing **domain invariants**
- **Critical calculations** (pricing, risk, settlements)
- During **development and testing**
- When **correctness > availability**

---

## Combining Both Approaches

Good systems **combine both** strategies appropriately:

### Architecture Pattern: Defensive at Edges, Fail-Fast at Core

```
┌─────────────────────────────────────────┐
│   API Layer (Defensive)                 │
│   - Validate user input                 │
│   - Handle malformed requests           │
│   - Return friendly error messages      │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│   Application Layer (Mixed)             │
│   - Validate business rules             │
│   - Transform external to internal      │
│   - Orchestrate workflows               │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│   Domain Layer (Fail-Fast)              │
│   - Enforce invariants strictly         │
│   - Protect aggregate consistency       │
│   - Validate state transitions          │
└─────────────────────────────────────────┘
```

### Example: Complete Order Flow

```csharp
// 1. API Layer - Defensive Programming
[HttpPost("orders")]
public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
{
    // Defensive: protect against bad client input
    if (request == null)
        return BadRequest("Request is required");

    var validationResult = await _validator.ValidateAsync(request);
    if (!validationResult.IsValid)
        return BadRequest(validationResult.Errors);

    try
    {
        var order = await _orderService.CreateOrderAsync(request);
        return Ok(order);
    }
    catch (RiskLimitExceededException ex)
    {
        // Expected business exception - return appropriate error
        return BadRequest(new { error = ex.Message });
    }
    catch (Exception ex)
    {
        // Unexpected - log and return generic error
        _logger.LogError(ex, "Unexpected error creating order");
        return StatusCode(500, "An unexpected error occurred");
    }
}

// 2. Application Layer - Mixed Approach
public class OrderService
{
    public async Task<OrderDto> CreateOrderAsync(CreateOrderRequest request)
    {
        // Defensive: external data might be unreliable
        var account = await _accountRepository.GetByIdAsync(request.AccountId);
        if (account == null)
        {
            _logger.LogWarning("Account not found: {AccountId}", request.AccountId);
            throw new NotFoundException($"Account {request.AccountId} not found");
        }

        // Fail-fast: domain object creation with strict validation
        var order = new Order(
            request.Symbol,
            request.Quantity,
            request.Price
        ); // Throws if invalid

        // Fail-fast: business rule enforcement
        _riskValidator.ValidateTradeRisk(order, account); // Throws if risk limits exceeded

        await _orderRepository.AddAsync(order);
        await _unitOfWork.CommitAsync();

        return _mapper.Map<OrderDto>(order);
    }
}

// 3. Domain Layer - Fail-Fast
public class Order
{
    public Order(string symbol, decimal quantity, decimal price)
    {
        // Fail-fast: enforce invariants strictly
        if (string.IsNullOrWhiteSpace(symbol))
            throw new ArgumentException("Symbol is required", nameof(symbol));

        if (quantity <= 0)
            throw new ArgumentException("Quantity must be positive", nameof(quantity));

        if (price < 0)
            throw new ArgumentException("Price cannot be negative", nameof(price));

        Symbol = symbol;
        Quantity = quantity;
        Price = price;
    }
}
```

### Example: External Integration with Fallback

```csharp
public class PriceService
{
    private readonly IExternalPriceProvider _primaryProvider;
    private readonly IExternalPriceProvider _fallbackProvider;
    private readonly IMemoryCache _cache;

    public async Task<decimal> GetPriceAsync(string symbol)
    {
        // Fail-fast: validate internal contract
        if (string.IsNullOrWhiteSpace(symbol))
            throw new ArgumentException("Symbol is required", nameof(symbol));

        // Defensive: try cache first
        if (_cache.TryGetValue($"price:{symbol}", out decimal cachedPrice))
            return cachedPrice;

        // Defensive: try primary provider with fallback
        try
        {
            var price = await _primaryProvider.GetPriceAsync(symbol);

            // Defensive: validate external data
            if (price <= 0)
            {
                _logger.LogWarning("Invalid price from primary provider: {Price}", price);
                return await TryFallbackProvider(symbol);
            }

            _cache.Set($"price:{symbol}", price, TimeSpan.FromSeconds(30));
            return price;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Primary provider failed for {Symbol}", symbol);
            return await TryFallbackProvider(symbol);
        }
    }

    private async Task<decimal> TryFallbackProvider(string symbol)
    {
        try
        {
            var price = await _fallbackProvider.GetPriceAsync(symbol);

            if (price <= 0)
            {
                // Fail-fast: both providers failed
                throw new PriceUnavailableException(
                    $"Could not get valid price for {symbol}");
            }

            _cache.Set($"price:{symbol}", price, TimeSpan.FromSeconds(30));
            return price;
        }
        catch (PriceUnavailableException)
        {
            throw; // Re-throw business exception
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Fallback provider failed for {Symbol}", symbol);
            throw new PriceUnavailableException(
                $"All price providers failed for {symbol}", ex);
        }
    }
}
```

---

## Decision Matrix

### Use Defensive Programming When:

| Scenario | Reason |
|----------|--------|
| Parsing user input | Users make mistakes |
| Reading configuration files | Files may be corrupted or edited incorrectly |
| Consuming external APIs | APIs may change or return unexpected data |
| Handling file uploads | Files may be malformed or malicious |
| Processing third-party data feeds | Data quality varies |
| Legacy system integration | Unknown edge cases |

### Use Fail-Fast When:

| Scenario | Reason |
|----------|--------|
| Domain entity construction | Enforce invariants |
| Internal service contracts | Catch programming errors early |
| Critical calculations | Ensure correctness |
| State machine transitions | Prevent invalid states |
| Aggregate root methods | Maintain consistency |
| Unit tests | Validate assumptions |

---

## Real-World Trading System Example

```csharp
public class TradingSystem
{
    // Defensive: External market data feed
    public async Task<MarketPrice> GetMarketPriceAsync(string symbol)
    {
        try
        {
            var rawData = await _marketDataFeed.GetPriceAsync(symbol);

            // Defensive: validate external data
            if (rawData == null || string.IsNullOrEmpty(rawData.Price))
            {
                _logger.LogWarning("Invalid market data for {Symbol}", symbol);
                return await GetCachedPriceAsync(symbol); // Fallback
            }

            if (!decimal.TryParse(rawData.Price, out var price) || price <= 0)
            {
                _logger.LogWarning("Invalid price format: {Price}", rawData.Price);
                return await GetCachedPriceAsync(symbol); // Fallback
            }

            return new MarketPrice(symbol, price, DateTime.UtcNow);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Market data feed error for {Symbol}", symbol);
            return await GetCachedPriceAsync(symbol); // Fallback
        }
    }

    // Fail-Fast: Internal order execution
    public async Task ExecuteOrderAsync(Order order, decimal executionPrice)
    {
        // Fail-fast: validate preconditions
        if (order == null)
            throw new ArgumentNullException(nameof(order));

        if (order.Status != OrderStatus.Pending)
            throw new InvalidOperationException(
                $"Cannot execute order in {order.Status} status");

        if (executionPrice <= 0)
            throw new ArgumentException(
                "Execution price must be positive", nameof(executionPrice));

        // Fail-fast: check risk limits
        var account = await _accountRepository.GetByIdAsync(order.AccountId);
        if (account == null)
            throw new InvalidOperationException(
                $"Account {order.AccountId} not found");

        _riskValidator.ValidateExecution(order, account, executionPrice);

        // Execute
        order.Execute(executionPrice);
        account.UpdatePosition(order);

        await _unitOfWork.CommitAsync();
    }
}
```

---

## Interview One-Liner

> **"Defensive programming protects the system from bad input at boundaries, while fail-fast exposes bugs early by enforcing strict contracts in core logic. Use defensive at the edges, fail-fast at the core."**

---

## Common Anti-Patterns

### ❌ Anti-Pattern 1: Overly Defensive Core Logic

```csharp
// Bad: Hiding bugs with defensive checks in domain logic
public class Order
{
    public void SetQuantity(decimal quantity)
    {
        // Too defensive - silently ignoring invalid input
        if (quantity <= 0)
        {
            _logger.LogWarning("Invalid quantity ignored");
            return; // BUG IS HIDDEN!
        }
        Quantity = quantity;
    }
}

// Good: Fail-fast in domain logic
public class Order
{
    public void SetQuantity(decimal quantity)
    {
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be positive");

        Quantity = quantity;
    }
}
```

### ❌ Anti-Pattern 2: Fail-Fast at API Boundaries

```csharp
// Bad: Throwing raw exceptions from controller
[HttpPost]
public IActionResult CreateOrder([FromBody] CreateOrderRequest request)
{
    // Too fail-fast - letting exceptions crash through
    var order = new Order(request.Symbol, request.Quantity, request.Price);
    // ArgumentException crashes the request
    return Ok(order);
}

// Good: Defensive at boundary
[HttpPost]
public IActionResult CreateOrder([FromBody] CreateOrderRequest request)
{
    try
    {
        var order = new Order(request.Symbol, request.Quantity, request.Price);
        return Ok(order);
    }
    catch (ArgumentException ex)
    {
        return BadRequest(ex.Message);
    }
}
```

### ❌ Anti-Pattern 3: Silent Failures

```csharp
// Bad: Swallowing exceptions
public decimal CalculatePrice()
{
    try
    {
        return _priceCalculator.Calculate();
    }
    catch
    {
        return 0; // Silent failure - debugging nightmare
    }
}

// Good: Log and re-throw or handle appropriately
public decimal CalculatePrice()
{
    try
    {
        return _priceCalculator.Calculate();
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Price calculation failed");
        throw new PriceCalculationException("Failed to calculate price", ex);
    }
}
```

---

## Summary

| Layer | Strategy | Example |
|-------|----------|---------|
| **API/Controllers** | Defensive | Validate input, return user-friendly errors |
| **Application Services** | Mixed | Transform external data (defensive), enforce business rules (fail-fast) |
| **Domain Entities** | Fail-Fast | Enforce invariants strictly |
| **External Integrations** | Defensive | Handle unreliable data, provide fallbacks |
| **Critical Calculations** | Fail-Fast | Ensure correctness, fail loudly on errors |

**Key Takeaway:** Balance resilience (defensive) with correctness (fail-fast) based on the layer and criticality of the operation.
