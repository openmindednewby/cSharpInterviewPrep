# Defensive Programming vs Fail-Fast - Practice Exercises

Comprehensive exercises to master when to use defensive programming vs fail-fast approaches.

---

## Foundational Understanding

**Q: Explain the difference between defensive programming and fail-fast. When should each be used?**

A: **Defensive programming** anticipates and handles invalid input gracefully to keep the system running. Use it at system boundaries (APIs, external integrations, user input).

**Fail-fast** detects invalid states early and throws exceptions immediately. Use it in core business logic to enforce invariants and surface bugs early.

**Key principle:** Defensive at the edges, fail-fast at the core.

```csharp
// Defensive: API boundary
[HttpPost]
public IActionResult CreateOrder([FromBody] OrderRequest request)
{
    if (request == null || request.Quantity <= 0)
        return BadRequest("Invalid request");

    // Call domain logic...
}

// Fail-Fast: Domain entity
public class Order
{
    public Order(decimal quantity)
    {
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be positive");
        Quantity = quantity;
    }
}
```

**Q: What are the risks of being overly defensive in core business logic?**

A: Overly defensive code in the core can:
1. Hide bugs by silently ignoring invalid states
2. Make debugging difficult due to silent failures
3. Allow invalid data to propagate through the system
4. Create false sense of security
5. Violate fail-fast principle that catches errors early

```csharp
// ❌ Bad: Too defensive in domain logic
public class PriceCalculator
{
    public decimal Calculate(decimal price, decimal quantity)
    {
        // Silently returning 0 hides programming errors
        if (price <= 0 || quantity <= 0)
            return 0;

        return price * quantity;
    }
}

// ✅ Good: Fail-fast exposes the bug
public class PriceCalculator
{
    public decimal Calculate(decimal price, decimal quantity)
    {
        if (price <= 0)
            throw new ArgumentException("Price must be positive");
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be positive");

        return price * quantity;
    }
}
```

**Q: How do you handle exceptions from fail-fast code at the API layer?**

A: Catch domain exceptions at the API layer and translate them into appropriate HTTP responses.

```csharp
[HttpPost("orders")]
public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
{
    try
    {
        // Domain code may throw (fail-fast)
        var order = new Order(request.Symbol, request.Quantity, request.Price);
        await _orderService.CreateAsync(order);
        return Ok(order);
    }
    catch (ArgumentException ex)
    {
        // Translate to user-friendly error
        return BadRequest(new { error = ex.Message });
    }
    catch (RiskLimitExceededException ex)
    {
        return BadRequest(new { error = ex.Message, code = "RISK_LIMIT_EXCEEDED" });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Unexpected error creating order");
        return StatusCode(500, "An unexpected error occurred");
    }
}
```

---

## Intermediate Scenarios

**Q: Implement a defensive wrapper around an unreliable external price feed API.**

A: Create a defensive adapter that handles failures gracefully with fallback mechanisms.

```csharp
public class ResilientPriceFeedAdapter
{
    private readonly IPriceFeedClient _primaryFeed;
    private readonly IPriceFeedClient _fallbackFeed;
    private readonly IMemoryCache _cache;
    private readonly ILogger _logger;

    public async Task<decimal?> GetPriceAsync(string symbol)
    {
        // Defensive: validate input
        if (string.IsNullOrWhiteSpace(symbol))
        {
            _logger.LogWarning("Empty symbol provided");
            return null;
        }

        // Try cache first
        if (_cache.TryGetValue($"price:{symbol}", out decimal cachedPrice))
        {
            return cachedPrice;
        }

        // Try primary feed
        try
        {
            var price = await _primaryFeed.GetPriceAsync(symbol);

            // Defensive: validate response
            if (price.HasValue && price.Value > 0)
            {
                _cache.Set($"price:{symbol}", price.Value, TimeSpan.FromSeconds(30));
                return price;
            }

            _logger.LogWarning("Invalid price from primary feed: {Price}", price);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogWarning(ex, "Primary feed failed for {Symbol}", symbol);
        }
        catch (TimeoutException ex)
        {
            _logger.LogWarning(ex, "Primary feed timeout for {Symbol}", symbol);
        }

        // Try fallback feed
        try
        {
            var price = await _fallbackFeed.GetPriceAsync(symbol);

            if (price.HasValue && price.Value > 0)
            {
                _cache.Set($"price:{symbol}", price.Value, TimeSpan.FromSeconds(30));
                return price;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Fallback feed failed for {Symbol}", symbol);
        }

        // All sources failed - return null to indicate unavailability
        return null;
    }
}
```

**Q: Create a fail-fast domain entity for a trading Order with strict invariant enforcement.**

A: Implement an Order aggregate root that fails fast on any invariant violation.

```csharp
public class Order
{
    public Guid Id { get; private set; }
    public string Symbol { get; private set; }
    public decimal Quantity { get; private set; }
    public decimal Price { get; private set; }
    public OrderSide Side { get; private set; }
    public OrderStatus Status { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? ExecutedAt { get; private set; }

    public Order(string symbol, decimal quantity, decimal price, OrderSide side)
    {
        // Fail-fast: enforce construction invariants
        if (string.IsNullOrWhiteSpace(symbol))
            throw new ArgumentException("Symbol is required", nameof(symbol));

        if (symbol.Length > 20)
            throw new ArgumentException("Symbol too long (max 20 characters)", nameof(symbol));

        if (quantity <= 0)
            throw new ArgumentException("Quantity must be positive", nameof(quantity));

        if (quantity > 1_000_000)
            throw new ArgumentException("Quantity exceeds maximum allowed", nameof(quantity));

        if (price < 0)
            throw new ArgumentException("Price cannot be negative", nameof(price));

        if (price > 1_000_000)
            throw new ArgumentException("Price exceeds maximum allowed", nameof(price));

        Id = Guid.NewGuid();
        Symbol = symbol.ToUpperInvariant();
        Quantity = quantity;
        Price = price;
        Side = side;
        Status = OrderStatus.Pending;
        CreatedAt = DateTime.UtcNow;
    }

    public void Execute(decimal executedPrice, DateTime executedAt)
    {
        // Fail-fast: enforce state transitions
        if (Status != OrderStatus.Pending)
            throw new InvalidOperationException(
                $"Cannot execute order in {Status} status. Only Pending orders can be executed.");

        if (executedPrice <= 0)
            throw new ArgumentException("Executed price must be positive", nameof(executedPrice));

        if (executedAt < CreatedAt)
            throw new ArgumentException("Execution time cannot be before creation time", nameof(executedAt));

        if (executedAt > DateTime.UtcNow.AddMinutes(1))
            throw new ArgumentException("Execution time cannot be in the future", nameof(executedAt));

        Price = executedPrice;
        ExecutedAt = executedAt;
        Status = OrderStatus.Executed;
    }

    public void Cancel(string reason)
    {
        if (string.IsNullOrWhiteSpace(reason))
            throw new ArgumentException("Cancellation reason is required", nameof(reason));

        if (Status == OrderStatus.Executed)
            throw new InvalidOperationException("Cannot cancel executed order");

        if (Status == OrderStatus.Cancelled)
            throw new InvalidOperationException("Order is already cancelled");

        Status = OrderStatus.Cancelled;
    }
}

public enum OrderStatus { Pending, Executed, Cancelled }
public enum OrderSide { Buy, Sell }
```

**Q: Design a multi-layer validation strategy combining defensive and fail-fast approaches.**

A: Implement validation at multiple layers with appropriate strategy for each.

```csharp
// Layer 1: API Controller - Defensive
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly IValidator<CreateOrderRequest> _validator;

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
        // Defensive: validate DTO
        if (request == null)
            return BadRequest("Request body is required");

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
            return BadRequest(new { error = ex.Message, code = "RISK_LIMIT" });
        }
        catch (InsufficientFundsException ex)
        {
            return BadRequest(new { error = ex.Message, code = "INSUFFICIENT_FUNDS" });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error creating order");
            return StatusCode(500, "An unexpected error occurred");
        }
    }
}

// Layer 2: FluentValidation - Defensive
public class CreateOrderRequestValidator : AbstractValidator<CreateOrderRequest>
{
    public CreateOrderRequestValidator()
    {
        RuleFor(x => x.Symbol)
            .NotEmpty().WithMessage("Symbol is required")
            .MaximumLength(20).WithMessage("Symbol too long");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be positive")
            .LessThanOrEqualTo(1_000_000).WithMessage("Quantity too large");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).WithMessage("Price cannot be negative")
            .LessThanOrEqualTo(1_000_000).WithMessage("Price too large");

        RuleFor(x => x.AccountId)
            .NotEmpty().WithMessage("Account ID is required");
    }
}

// Layer 3: Application Service - Mixed
public class OrderService : IOrderService
{
    public async Task<OrderDto> CreateOrderAsync(CreateOrderRequest request)
    {
        // Defensive: check account exists
        var account = await _accountRepository.GetByIdAsync(request.AccountId);
        if (account == null)
            throw new NotFoundException($"Account {request.AccountId} not found");

        // Fail-fast: create domain entity (enforces invariants)
        var order = new Order(
            request.Symbol,
            request.Quantity,
            request.Price,
            request.Side
        );

        // Fail-fast: business rules
        _riskValidator.ValidateOrder(order, account); // Throws on violation
        _marginValidator.ValidateMargin(order, account); // Throws on violation

        // Defensive: external system integration
        var reservationResult = await TryReserveFundsAsync(account, order);
        if (!reservationResult.Success)
        {
            throw new InsufficientFundsException(
                $"Failed to reserve funds: {reservationResult.Reason}");
        }

        await _orderRepository.AddAsync(order);
        await _unitOfWork.CommitAsync();

        return _mapper.Map<OrderDto>(order);
    }

    private async Task<ReservationResult> TryReserveFundsAsync(Account account, Order order)
    {
        try
        {
            return await _fundingService.ReserveFundsAsync(account.Id, order.TotalValue);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to reserve funds for order");
            return ReservationResult.Failure("Service unavailable");
        }
    }
}

// Layer 4: Domain Entity - Fail-Fast (shown above)
```

---

## Advanced Scenarios

**Q: Implement a circuit breaker pattern that uses defensive programming for external services but fail-fast for internal state.**

A: Create a circuit breaker that protects against external failures defensively while enforcing internal state transitions with fail-fast.

```csharp
public class CircuitBreaker
{
    private CircuitState _state = CircuitState.Closed;
    private int _failureCount;
    private DateTime _lastFailureTime;
    private readonly int _failureThreshold;
    private readonly TimeSpan _openDuration;
    private readonly SemaphoreSlim _lock = new(1, 1);

    public CircuitBreaker(int failureThreshold, TimeSpan openDuration)
    {
        // Fail-fast: validate constructor parameters
        if (failureThreshold <= 0)
            throw new ArgumentException("Failure threshold must be positive", nameof(failureThreshold));

        if (openDuration <= TimeSpan.Zero)
            throw new ArgumentException("Open duration must be positive", nameof(openDuration));

        _failureThreshold = failureThreshold;
        _openDuration = openDuration;
    }

    public async Task<T> ExecuteAsync<T>(Func<Task<T>> operation)
    {
        // Fail-fast: null check
        if (operation == null)
            throw new ArgumentNullException(nameof(operation));

        await _lock.WaitAsync();
        try
        {
            // Check if we should transition from Open to HalfOpen
            if (_state == CircuitState.Open &&
                DateTime.UtcNow - _lastFailureTime >= _openDuration)
            {
                _state = CircuitState.HalfOpen;
            }

            // Fail-fast: enforce circuit state
            if (_state == CircuitState.Open)
            {
                throw new CircuitBreakerOpenException(
                    $"Circuit breaker is open. Will retry after {_openDuration}");
            }
        }
        finally
        {
            _lock.Release();
        }

        // Defensive: try operation and handle failures gracefully
        try
        {
            var result = await operation();

            // Success - reset if in HalfOpen
            if (_state == CircuitState.HalfOpen)
            {
                await ResetAsync();
            }

            return result;
        }
        catch (Exception ex) when (!(ex is CircuitBreakerOpenException))
        {
            // Defensive: record failure and decide state transition
            await RecordFailureAsync(ex);
            throw; // Re-throw original exception
        }
    }

    private async Task RecordFailureAsync(Exception ex)
    {
        await _lock.WaitAsync();
        try
        {
            _failureCount++;
            _lastFailureTime = DateTime.UtcNow;

            if (_state == CircuitState.HalfOpen)
            {
                // Fail immediately on failure in HalfOpen state
                _state = CircuitState.Open;
            }
            else if (_failureCount >= _failureThreshold)
            {
                _state = CircuitState.Open;
            }
        }
        finally
        {
            _lock.Release();
        }
    }

    private async Task ResetAsync()
    {
        await _lock.WaitAsync();
        try
        {
            _failureCount = 0;
            _state = CircuitState.Closed;
        }
        finally
        {
            _lock.Release();
        }
    }
}

public enum CircuitState { Closed, Open, HalfOpen }
```

**Q: Design a price validation system that combines defensive parsing with fail-fast business rule enforcement.**

A: Implement defensive parsing for external data and fail-fast validation for business rules.

```csharp
public class PriceValidationService
{
    public ValidatedPrice ValidateAndParsePrice(string symbol, string priceData)
    {
        // Fail-fast: validate inputs
        if (string.IsNullOrWhiteSpace(symbol))
            throw new ArgumentException("Symbol is required", nameof(symbol));

        // Defensive: parse external data
        if (string.IsNullOrWhiteSpace(priceData))
        {
            _logger.LogWarning("Empty price data for {Symbol}", symbol);
            return ValidatedPrice.Invalid("Price data is empty");
        }

        if (!decimal.TryParse(priceData, NumberStyles.Any, CultureInfo.InvariantCulture, out var price))
        {
            _logger.LogWarning("Invalid price format for {Symbol}: {PriceData}", symbol, priceData);
            return ValidatedPrice.Invalid($"Invalid price format: {priceData}");
        }

        // Fail-fast: enforce business rules
        if (price < 0)
            throw new InvalidPriceException($"Price cannot be negative: {price}");

        if (price == 0)
            throw new InvalidPriceException("Price cannot be zero");

        if (price > 1_000_000)
            throw new InvalidPriceException($"Price exceeds maximum allowed: {price}");

        // Defensive: check for suspicious prices (but don't fail)
        var previousPrice = _priceHistory.GetLastPrice(symbol);
        if (previousPrice.HasValue)
        {
            var change = Math.Abs((price - previousPrice.Value) / previousPrice.Value);
            if (change > 0.5m) // 50% change
            {
                _logger.LogWarning(
                    "Suspicious price change for {Symbol}: {PreviousPrice} -> {NewPrice} ({ChangePercent:P})",
                    symbol, previousPrice, price, change);

                // Flag for review but allow it
                return ValidatedPrice.Valid(price, isSuspicious: true);
            }
        }

        return ValidatedPrice.Valid(price, isSuspicious: false);
    }
}

public class ValidatedPrice
{
    public bool IsValid { get; }
    public decimal? Value { get; }
    public string ErrorMessage { get; }
    public bool IsSuspicious { get; }

    private ValidatedPrice(bool isValid, decimal? value, string errorMessage, bool isSuspicious)
    {
        IsValid = isValid;
        Value = value;
        ErrorMessage = errorMessage;
        IsSuspicious = isSuspicious;
    }

    public static ValidatedPrice Valid(decimal value, bool isSuspicious) =>
        new(true, value, null, isSuspicious);

    public static ValidatedPrice Invalid(string errorMessage) =>
        new(false, null, errorMessage, false);
}
```

**Q: Implement defensive retry logic with fail-fast on non-retryable errors.**

A: Create a retry mechanism that defensively handles transient failures but fails fast on permanent errors.

```csharp
public class ResilientHttpClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger _logger;

    public async Task<T> GetWithRetryAsync<T>(
        string url,
        int maxRetries = 3,
        CancellationToken cancellationToken = default)
    {
        // Fail-fast: validate parameters
        if (string.IsNullOrWhiteSpace(url))
            throw new ArgumentException("URL is required", nameof(url));

        if (maxRetries < 0)
            throw new ArgumentException("Max retries cannot be negative", nameof(maxRetries));

        Exception lastException = null;

        for (int attempt = 0; attempt <= maxRetries; attempt++)
        {
            try
            {
                var response = await _httpClient.GetAsync(url, cancellationToken);

                // Fail-fast: 4xx errors are not retryable (client errors)
                if ((int)response.StatusCode >= 400 && (int)response.StatusCode < 500)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    throw new HttpRequestException(
                        $"Client error {response.StatusCode}: {content}. This is not retryable.");
                }

                // Defensive: 5xx errors are retryable (server errors)
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning(
                        "Request failed with {StatusCode} on attempt {Attempt}/{MaxRetries}",
                        response.StatusCode, attempt + 1, maxRetries + 1);

                    if (attempt < maxRetries)
                    {
                        await DelayWithJitterAsync(attempt);
                        continue;
                    }

                    throw new HttpRequestException($"Request failed after {maxRetries + 1} attempts");
                }

                return await response.Content.ReadFromJsonAsync<T>(cancellationToken);
            }
            catch (HttpRequestException) when ((int?)null >= 400 && (int?)null < 500)
            {
                // Re-throw client errors immediately (fail-fast)
                throw;
            }
            catch (OperationCanceledException)
            {
                // Re-throw cancellation immediately (fail-fast)
                throw;
            }
            catch (Exception ex)
            {
                // Defensive: log and retry on transient errors
                lastException = ex;
                _logger.LogWarning(
                    ex,
                    "Transient error on attempt {Attempt}/{MaxRetries}",
                    attempt + 1, maxRetries + 1);

                if (attempt < maxRetries)
                {
                    await DelayWithJitterAsync(attempt);
                }
            }
        }

        throw new HttpRequestException(
            $"Request failed after {maxRetries + 1} attempts", lastException);
    }

    private async Task DelayWithJitterAsync(int attempt)
    {
        var baseDelay = TimeSpan.FromMilliseconds(100 * Math.Pow(2, attempt));
        var jitter = TimeSpan.FromMilliseconds(Random.Shared.Next(0, 100));
        await Task.Delay(baseDelay + jitter);
    }
}
```

---

## Real-World Trading Scenarios

**Q: Implement order validation with defensive checks for external data and fail-fast for business rules.**

A: Create a comprehensive order validator for a trading system.

```csharp
public class OrderValidator
{
    private readonly IAccountRepository _accountRepository;
    private readonly IMarketDataService _marketDataService;
    private readonly IRiskLimitService _riskLimitService;
    private readonly ILogger _logger;

    public async Task<ValidationResult> ValidateOrderAsync(CreateOrderRequest request)
    {
        // Fail-fast: null check
        if (request == null)
            throw new ArgumentNullException(nameof(request));

        var errors = new List<string>();

        // Defensive: validate symbol format
        if (string.IsNullOrWhiteSpace(request.Symbol))
        {
            errors.Add("Symbol is required");
        }
        else if (request.Symbol.Length > 20)
        {
            errors.Add("Symbol too long (max 20 characters)");
        }

        // Defensive: validate quantity
        if (request.Quantity <= 0)
        {
            errors.Add("Quantity must be positive");
        }
        else if (request.Quantity > 10_000_000)
        {
            errors.Add("Quantity exceeds maximum allowed");
        }

        // Defensive: validate price
        if (request.Price < 0)
        {
            errors.Add("Price cannot be negative");
        }
        else if (request.Price > 1_000_000)
        {
            errors.Add("Price exceeds maximum allowed");
        }

        // Return early if basic validation failed
        if (errors.Any())
        {
            return ValidationResult.Failure(errors);
        }

        // Defensive: check account exists
        var account = await _accountRepository.GetByIdAsync(request.AccountId);
        if (account == null)
        {
            errors.Add($"Account {request.AccountId} not found");
            return ValidationResult.Failure(errors);
        }

        // Fail-fast: account must be active
        if (!account.IsActive)
        {
            throw new InvalidOperationException($"Account {request.AccountId} is not active");
        }

        // Defensive: check if symbol is tradeable
        var marketData = await _marketDataService.GetMarketDataAsync(request.Symbol);
        if (marketData == null)
        {
            _logger.LogWarning("Market data not available for {Symbol}", request.Symbol);
            errors.Add($"Market data not available for {request.Symbol}");
        }
        else if (!marketData.IsTradeable)
        {
            errors.Add($"{request.Symbol} is not currently tradeable");
        }
        else
        {
            // Defensive: check price deviation
            var deviation = Math.Abs(request.Price - marketData.LastPrice) / marketData.LastPrice;
            if (deviation > 0.1m) // 10% deviation
            {
                _logger.LogWarning(
                    "Large price deviation for {Symbol}: requested {RequestPrice}, market {MarketPrice}",
                    request.Symbol, request.Price, marketData.LastPrice);
                errors.Add($"Price deviates significantly from market price ({deviation:P})");
            }
        }

        // Fail-fast: check risk limits (business rules)
        try
        {
            var orderValue = request.Quantity * request.Price;
            _riskLimitService.ValidateOrderValue(account, orderValue);
            _riskLimitService.ValidatePositionLimit(account, request.Symbol, request.Quantity);
            _riskLimitService.ValidateMarginRequirement(account, orderValue);
        }
        catch (RiskLimitException ex)
        {
            // Convert business rule violations to validation errors
            errors.Add(ex.Message);
        }

        return errors.Any()
            ? ValidationResult.Failure(errors)
            : ValidationResult.Success();
    }
}

public class ValidationResult
{
    public bool IsValid { get; }
    public IReadOnlyList<string> Errors { get; }

    private ValidationResult(bool isValid, IReadOnlyList<string> errors)
    {
        IsValid = isValid;
        Errors = errors ?? new List<string>();
    }

    public static ValidationResult Success() =>
        new(true, Array.Empty<string>());

    public static ValidationResult Failure(List<string> errors) =>
        new(false, errors);
}
```

---

**Total Exercises: 15+ comprehensive scenarios**

Practice implementing the right balance between defensive programming and fail-fast for different layers of your application!
