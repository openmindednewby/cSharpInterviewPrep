# Strategy Pattern - Exercises

## Overview
The Strategy Pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. Strategy lets the algorithm vary independently from clients that use it. This file contains 30+ exercises covering strategy implementations, real-world scenarios, and C#-specific patterns.

## Table of Contents
- [Foundational Questions (1-10)](#foundational-questions)
- [Intermediate Questions (11-20)](#intermediate-questions)
- [Advanced Questions (21-30+)](#advanced-questions)

---

## Foundational Questions

### Q1: What is the Strategy Pattern and what problem does it solve?

**A:** The Strategy Pattern encapsulates alternative algorithms or behaviors and makes them interchangeable. It solves the problem of having multiple conditional statements for selecting between different algorithms.

```csharp
// Problem: Multiple conditionals for different behaviors
public class OrderProcessor
{
    public decimal CalculateDiscount(Order order, string customerType)
    {
        // Bad: Violation of Open/Closed Principle
        if (customerType == "Regular")
        {
            return order.TotalAmount * 0.05m;
        }
        else if (customerType == "Premium")
        {
            return order.TotalAmount * 0.10m;
        }
        else if (customerType == "VIP")
        {
            return order.TotalAmount * 0.20m;
        }
        else if (customerType == "Employee")
        {
            return order.TotalAmount * 0.30m;
        }
        return 0;
    }
}

// Solution: Strategy Pattern
public interface IDiscountStrategy
{
    decimal CalculateDiscount(Order order);
    string StrategyName { get; }
}

public class RegularCustomerDiscount : IDiscountStrategy
{
    public string StrategyName => "Regular Customer";
    public decimal CalculateDiscount(Order order) => order.TotalAmount * 0.05m;
}

public class PremiumCustomerDiscount : IDiscountStrategy
{
    public string StrategyName => "Premium Customer";
    public decimal CalculateDiscount(Order order) => order.TotalAmount * 0.10m;
}

public class VIPCustomerDiscount : IDiscountStrategy
{
    public string StrategyName => "VIP Customer";
    public decimal CalculateDiscount(Order order) => order.TotalAmount * 0.20m;
}

public class EmployeeDiscount : IDiscountStrategy
{
    public string StrategyName => "Employee";
    public decimal CalculateDiscount(Order order) => order.TotalAmount * 0.30m;
}

// Context class
public class BetterOrderProcessor
{
    private IDiscountStrategy _discountStrategy;

    public BetterOrderProcessor(IDiscountStrategy discountStrategy)
    {
        _discountStrategy = discountStrategy;
    }

    public void SetDiscountStrategy(IDiscountStrategy strategy)
    {
        _discountStrategy = strategy;
    }

    public decimal CalculateDiscount(Order order)
    {
        return _discountStrategy.CalculateDiscount(order);
    }

    public decimal CalculateFinalAmount(Order order)
    {
        var discount = _discountStrategy.CalculateDiscount(order);
        return order.TotalAmount - discount;
    }
}

public class Order
{
    public decimal TotalAmount { get; set; }
    public List<OrderItem> Items { get; set; }
}

public class OrderItem
{
    public string ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
}

// Usage
var order = new Order { TotalAmount = 1000m };

var processor = new BetterOrderProcessor(new RegularCustomerDiscount());
var discount1 = processor.CalculateDiscount(order); // $50

processor.SetDiscountStrategy(new VIPCustomerDiscount());
var discount2 = processor.CalculateDiscount(order); // $200
```

**Benefits:**
- Eliminates conditional statements
- Easy to add new strategies without modifying existing code
- Each strategy is independently testable
- Follows Open/Closed Principle

**Use When:**
- You have multiple algorithms for a specific task
- You want to switch algorithms at runtime
- You want to avoid complex conditional logic

**Avoid When:**
- You only have one algorithm
- The algorithm never changes
- The conditional logic is simple and stable

---

### Q2: How does the Strategy Pattern differ from the State Pattern?

**A:**

```csharp
// STRATEGY PATTERN: Client chooses which algorithm to use
// Focus: Different algorithms for the same task

public interface ISortStrategy
{
    void Sort<T>(List<T> list) where T : IComparable<T>;
}

public class QuickSortStrategy : ISortStrategy
{
    public void Sort<T>(List<T> list) where T : IComparable<T>
    {
        // QuickSort implementation
        Console.WriteLine("Sorting using QuickSort");
        list.Sort(); // Simplified
    }
}

public class MergeSortStrategy : ISortStrategy
{
    public void Sort<T>(List<T> list) where T : IComparable<T>
    {
        Console.WriteLine("Sorting using MergeSort");
        list.Sort(); // Simplified
    }
}

public class Sorter
{
    private ISortStrategy _strategy;

    public Sorter(ISortStrategy strategy)
    {
        _strategy = strategy;
    }

    // Client can change strategy
    public void SetStrategy(ISortStrategy strategy)
    {
        _strategy = strategy;
    }

    public void PerformSort<T>(List<T> list) where T : IComparable<T>
    {
        _strategy.Sort(list);
    }
}

// Usage: Client decides which strategy
var sorter = new Sorter(new QuickSortStrategy());
sorter.PerformSort(numbers); // Uses QuickSort

sorter.SetStrategy(new MergeSortStrategy());
sorter.PerformSort(numbers); // Uses MergeSort

// STATE PATTERN: Object changes its behavior based on internal state
// Focus: Different behavior based on current state

public interface IDocumentState
{
    void Publish(Document document);
    void Approve(Document document);
    void Reject(Document document);
}

public class DraftState : IDocumentState
{
    public void Publish(Document document)
    {
        Console.WriteLine("Publishing draft");
        document.SetState(new PublishedState());
    }

    public void Approve(Document document)
    {
        Console.WriteLine("Cannot approve draft");
    }

    public void Reject(Document document)
    {
        Console.WriteLine("Cannot reject draft");
    }
}

public class PublishedState : IDocumentState
{
    public void Publish(Document document)
    {
        Console.WriteLine("Already published");
    }

    public void Approve(Document document)
    {
        Console.WriteLine("Approving document");
        document.SetState(new ApprovedState());
    }

    public void Reject(Document document)
    {
        Console.WriteLine("Rejecting document");
        document.SetState(new RejectedState());
    }
}

public class ApprovedState : IDocumentState
{
    public void Publish(Document document) => Console.WriteLine("Already published");
    public void Approve(Document document) => Console.WriteLine("Already approved");
    public void Reject(Document document) => Console.WriteLine("Cannot reject approved document");
}

public class RejectedState : IDocumentState
{
    public void Publish(Document document) => Console.WriteLine("Cannot publish rejected document");
    public void Approve(Document document) => Console.WriteLine("Cannot approve rejected document");
    public void Reject(Document document) => Console.WriteLine("Already rejected");
}

public class Document
{
    private IDocumentState _state;

    public Document()
    {
        _state = new DraftState();
    }

    // State changes internally
    public void SetState(IDocumentState state)
    {
        _state = state;
    }

    public void Publish() => _state.Publish(this);
    public void Approve() => _state.Approve(this);
    public void Reject() => _state.Reject(this);
}

// Usage: State changes automatically based on operations
var document = new Document();
document.Publish();  // Transitions from Draft to Published
document.Approve();  // Transitions from Published to Approved
document.Reject();   // Cannot reject approved document
```

**Key Differences:**

| Aspect | Strategy Pattern | State Pattern |
|--------|-----------------|---------------|
| Purpose | Different algorithms | Different behaviors based on state |
| Who decides | Client chooses strategy | Object changes state internally |
| Transitions | Client switches strategies | State transitions happen automatically |
| Knowledge | Strategies don't know about each other | States often trigger other states |
| Focus | Algorithm selection | State-dependent behavior |

---

### Q3: Implement different payment processing strategies (Credit Card, PayPal, Bitcoin).

**A:**

```csharp
// Payment models
public class PaymentDetails
{
    public decimal Amount { get; set; }
    public string Currency { get; set; }
    public string OrderId { get; set; }
    public string CustomerEmail { get; set; }
}

public class PaymentResult
{
    public bool Success { get; set; }
    public string TransactionId { get; set; }
    public string Message { get; set; }
    public decimal ProcessingFee { get; set; }
    public DateTime ProcessedAt { get; set; }
}

// Strategy interface
public interface IPaymentStrategy
{
    string PaymentMethod { get; }
    decimal CalculateProcessingFee(decimal amount);
    Task<PaymentResult> ProcessPaymentAsync(PaymentDetails details);
    Task<bool> ValidatePaymentDetailsAsync(PaymentDetails details);
}

// Concrete strategies
public class CreditCardPaymentStrategy : IPaymentStrategy
{
    private readonly CreditCardInfo _cardInfo;
    private const decimal FeePercentage = 0.029m; // 2.9%
    private const decimal FixedFee = 0.30m;

    public string PaymentMethod => "Credit Card";

    public CreditCardPaymentStrategy(CreditCardInfo cardInfo)
    {
        _cardInfo = cardInfo;
    }

    public decimal CalculateProcessingFee(decimal amount)
    {
        return (amount * FeePercentage) + FixedFee;
    }

    public async Task<bool> ValidatePaymentDetailsAsync(PaymentDetails details)
    {
        await Task.CompletedTask;

        // Validate card
        if (string.IsNullOrWhiteSpace(_cardInfo.CardNumber))
            return false;

        if (_cardInfo.ExpiryDate < DateTime.Now)
            return false;

        if (string.IsNullOrWhiteSpace(_cardInfo.CVV))
            return false;

        return true;
    }

    public async Task<PaymentResult> ProcessPaymentAsync(PaymentDetails details)
    {
        Console.WriteLine($"Processing credit card payment of {details.Amount} {details.Currency}");

        // Validate
        if (!await ValidatePaymentDetailsAsync(details))
        {
            return new PaymentResult
            {
                Success = false,
                Message = "Invalid credit card details"
            };
        }

        // Simulate payment processing
        await Task.Delay(500);

        var fee = CalculateProcessingFee(details.Amount);

        return new PaymentResult
        {
            Success = true,
            TransactionId = $"CC_{Guid.NewGuid():N}",
            Message = "Payment processed successfully",
            ProcessingFee = fee,
            ProcessedAt = DateTime.UtcNow
        };
    }
}

public class PayPalPaymentStrategy : IPaymentStrategy
{
    private readonly PayPalCredentials _credentials;
    private const decimal FeePercentage = 0.034m; // 3.4%
    private const decimal FixedFee = 0.30m;

    public string PaymentMethod => "PayPal";

    public PayPalPaymentStrategy(PayPalCredentials credentials)
    {
        _credentials = credentials;
    }

    public decimal CalculateProcessingFee(decimal amount)
    {
        return (amount * FeePercentage) + FixedFee;
    }

    public async Task<bool> ValidatePaymentDetailsAsync(PaymentDetails details)
    {
        await Task.CompletedTask;

        if (string.IsNullOrWhiteSpace(_credentials.Email))
            return false;

        if (details.Amount <= 0)
            return false;

        return true;
    }

    public async Task<PaymentResult> ProcessPaymentAsync(PaymentDetails details)
    {
        Console.WriteLine($"Processing PayPal payment of {details.Amount} {details.Currency}");

        if (!await ValidatePaymentDetailsAsync(details))
        {
            return new PaymentResult
            {
                Success = false,
                Message = "Invalid PayPal credentials"
            };
        }

        // Simulate PayPal OAuth and payment
        await Task.Delay(800);

        var fee = CalculateProcessingFee(details.Amount);

        return new PaymentResult
        {
            Success = true,
            TransactionId = $"PP_{Guid.NewGuid():N}",
            Message = "PayPal payment processed successfully",
            ProcessingFee = fee,
            ProcessedAt = DateTime.UtcNow
        };
    }
}

public class BitcoinPaymentStrategy : IPaymentStrategy
{
    private readonly BitcoinWallet _wallet;
    private const decimal FeePercentage = 0.01m; // 1%

    public string PaymentMethod => "Bitcoin";

    public BitcoinPaymentStrategy(BitcoinWallet wallet)
    {
        _wallet = wallet;
    }

    public decimal CalculateProcessingFee(decimal amount)
    {
        return amount * FeePercentage;
    }

    public async Task<bool> ValidatePaymentDetailsAsync(PaymentDetails details)
    {
        await Task.CompletedTask;

        if (string.IsNullOrWhiteSpace(_wallet.Address))
            return false;

        if (details.Amount <= 0)
            return false;

        return true;
    }

    public async Task<PaymentResult> ProcessPaymentAsync(PaymentDetails details)
    {
        Console.WriteLine($"Processing Bitcoin payment of {details.Amount} {details.Currency}");

        if (!await ValidatePaymentDetailsAsync(details))
        {
            return new PaymentResult
            {
                Success = false,
                Message = "Invalid Bitcoin wallet"
            };
        }

        // Simulate blockchain transaction
        await Task.Delay(2000); // Slower due to blockchain

        var fee = CalculateProcessingFee(details.Amount);

        return new PaymentResult
        {
            Success = true,
            TransactionId = $"BTC_{Guid.NewGuid():N}",
            Message = "Bitcoin payment processed successfully",
            ProcessingFee = fee,
            ProcessedAt = DateTime.UtcNow
        };
    }
}

// Supporting classes
public class CreditCardInfo
{
    public string CardNumber { get; set; }
    public string CardholderName { get; set; }
    public DateTime ExpiryDate { get; set; }
    public string CVV { get; set; }
}

public class PayPalCredentials
{
    public string Email { get; set; }
    public string Password { get; set; }
}

public class BitcoinWallet
{
    public string Address { get; set; }
    public string PrivateKey { get; set; }
}

// Context class
public class PaymentProcessor
{
    private IPaymentStrategy _paymentStrategy;

    public PaymentProcessor(IPaymentStrategy paymentStrategy)
    {
        _paymentStrategy = paymentStrategy;
    }

    public void SetPaymentStrategy(IPaymentStrategy strategy)
    {
        _paymentStrategy = strategy;
    }

    public async Task<PaymentResult> ProcessPaymentAsync(PaymentDetails details)
    {
        Console.WriteLine($"Using payment method: {_paymentStrategy.PaymentMethod}");
        var fee = _paymentStrategy.CalculateProcessingFee(details.Amount);
        Console.WriteLine($"Processing fee: {fee:C}");

        return await _paymentStrategy.ProcessPaymentAsync(details);
    }

    public decimal GetEstimatedFee(decimal amount)
    {
        return _paymentStrategy.CalculateProcessingFee(amount);
    }
}

// Usage example
public class PaymentStrategyExample
{
    public static async Task ExampleAsync()
    {
        var paymentDetails = new PaymentDetails
        {
            Amount = 100.00m,
            Currency = "USD",
            OrderId = "ORD-12345",
            CustomerEmail = "customer@example.com"
        };

        // Credit card payment
        var creditCardInfo = new CreditCardInfo
        {
            CardNumber = "4111111111111111",
            CardholderName = "John Doe",
            ExpiryDate = DateTime.Now.AddYears(2),
            CVV = "123"
        };

        var processor = new PaymentProcessor(new CreditCardPaymentStrategy(creditCardInfo));
        var result1 = await processor.ProcessPaymentAsync(paymentDetails);
        Console.WriteLine($"Result: {result1.Success}, Transaction: {result1.TransactionId}\n");

        // PayPal payment
        var paypalCreds = new PayPalCredentials
        {
            Email = "user@example.com",
            Password = "password"
        };

        processor.SetPaymentStrategy(new PayPalPaymentStrategy(paypalCreds));
        var result2 = await processor.ProcessPaymentAsync(paymentDetails);
        Console.WriteLine($"Result: {result2.Success}, Transaction: {result2.TransactionId}\n");

        // Bitcoin payment
        var bitcoinWallet = new BitcoinWallet
        {
            Address = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
            PrivateKey = "private_key"
        };

        processor.SetPaymentStrategy(new BitcoinPaymentStrategy(bitcoinWallet));
        var result3 = await processor.ProcessPaymentAsync(paymentDetails);
        Console.WriteLine($"Result: {result3.Success}, Transaction: {result3.TransactionId}\n");

        // Compare fees
        var ccFee = new CreditCardPaymentStrategy(creditCardInfo).CalculateProcessingFee(100m);
        var ppFee = new PayPalPaymentStrategy(paypalCreds).CalculateProcessingFee(100m);
        var btcFee = new BitcoinPaymentStrategy(bitcoinWallet).CalculateProcessingFee(100m);

        Console.WriteLine($"Fee comparison for $100:");
        Console.WriteLine($"  Credit Card: ${ccFee:F2}");
        Console.WriteLine($"  PayPal: ${ppFee:F2}");
        Console.WriteLine($"  Bitcoin: ${btcFee:F2}");
    }
}
```

---

### Q4: Implement sorting strategies (QuickSort, MergeSort, BubbleSort) using the Strategy Pattern.

**A:**

```csharp
// Strategy interface
public interface ISortStrategy<T> where T : IComparable<T>
{
    string AlgorithmName { get; }
    void Sort(List<T> list);
    void Sort(List<T> list, int left, int right);
    SortPerformanceMetrics GetPerformanceMetrics();
}

// Performance metrics
public class SortPerformanceMetrics
{
    public int Comparisons { get; set; }
    public int Swaps { get; set; }
    public TimeSpan Duration { get; set; }
    public string AlgorithmName { get; set; }

    public override string ToString()
    {
        return $"{AlgorithmName}: {Comparisons} comparisons, {Swaps} swaps, {Duration.TotalMilliseconds:F2}ms";
    }
}

// Base strategy class
public abstract class BaseSortStrategy<T> : ISortStrategy<T> where T : IComparable<T>
{
    protected int Comparisons { get; set; }
    protected int Swaps { get; set; }
    protected System.Diagnostics.Stopwatch Stopwatch { get; set; }

    public abstract string AlgorithmName { get; }

    public abstract void Sort(List<T> list);

    public virtual void Sort(List<T> list, int left, int right)
    {
        Sort(list);
    }

    public SortPerformanceMetrics GetPerformanceMetrics()
    {
        return new SortPerformanceMetrics
        {
            AlgorithmName = AlgorithmName,
            Comparisons = Comparisons,
            Swaps = Swaps,
            Duration = Stopwatch?.Elapsed ?? TimeSpan.Zero
        };
    }

    protected void ResetMetrics()
    {
        Comparisons = 0;
        Swaps = 0;
        Stopwatch = System.Diagnostics.Stopwatch.StartNew();
    }

    protected void Swap(List<T> list, int i, int j)
    {
        Swaps++;
        (list[i], list[j]) = (list[j], list[i]);
    }

    protected int Compare(T a, T b)
    {
        Comparisons++;
        return a.CompareTo(b);
    }
}

// QuickSort strategy
public class QuickSortStrategy<T> : BaseSortStrategy<T> where T : IComparable<T>
{
    public override string AlgorithmName => "QuickSort";

    public override void Sort(List<T> list)
    {
        ResetMetrics();
        QuickSort(list, 0, list.Count - 1);
        Stopwatch.Stop();
    }

    public override void Sort(List<T> list, int left, int right)
    {
        ResetMetrics();
        QuickSort(list, left, right);
        Stopwatch.Stop();
    }

    private void QuickSort(List<T> list, int left, int right)
    {
        if (left < right)
        {
            int pivotIndex = Partition(list, left, right);
            QuickSort(list, left, pivotIndex - 1);
            QuickSort(list, pivotIndex + 1, right);
        }
    }

    private int Partition(List<T> list, int left, int right)
    {
        T pivot = list[right];
        int i = left - 1;

        for (int j = left; j < right; j++)
        {
            if (Compare(list[j], pivot) <= 0)
            {
                i++;
                Swap(list, i, j);
            }
        }

        Swap(list, i + 1, right);
        return i + 1;
    }
}

// MergeSort strategy
public class MergeSortStrategy<T> : BaseSortStrategy<T> where T : IComparable<T>
{
    public override string AlgorithmName => "MergeSort";

    public override void Sort(List<T> list)
    {
        ResetMetrics();
        MergeSort(list, 0, list.Count - 1);
        Stopwatch.Stop();
    }

    public override void Sort(List<T> list, int left, int right)
    {
        ResetMetrics();
        MergeSort(list, left, right);
        Stopwatch.Stop();
    }

    private void MergeSort(List<T> list, int left, int right)
    {
        if (left < right)
        {
            int middle = (left + right) / 2;
            MergeSort(list, left, middle);
            MergeSort(list, middle + 1, right);
            Merge(list, left, middle, right);
        }
    }

    private void Merge(List<T> list, int left, int middle, int right)
    {
        int leftSize = middle - left + 1;
        int rightSize = right - middle;

        T[] leftArray = new T[leftSize];
        T[] rightArray = new T[rightSize];

        for (int i = 0; i < leftSize; i++)
            leftArray[i] = list[left + i];
        for (int j = 0; j < rightSize; j++)
            rightArray[j] = list[middle + 1 + j];

        int leftIndex = 0, rightIndex = 0, mergedIndex = left;

        while (leftIndex < leftSize && rightIndex < rightSize)
        {
            if (Compare(leftArray[leftIndex], rightArray[rightIndex]) <= 0)
            {
                list[mergedIndex] = leftArray[leftIndex];
                leftIndex++;
            }
            else
            {
                list[mergedIndex] = rightArray[rightIndex];
                rightIndex++;
            }
            mergedIndex++;
        }

        while (leftIndex < leftSize)
        {
            list[mergedIndex] = leftArray[leftIndex];
            leftIndex++;
            mergedIndex++;
        }

        while (rightIndex < rightSize)
        {
            list[mergedIndex] = rightArray[rightIndex];
            rightIndex++;
            mergedIndex++;
        }
    }
}

// BubbleSort strategy
public class BubbleSortStrategy<T> : BaseSortStrategy<T> where T : IComparable<T>
{
    public override string AlgorithmName => "BubbleSort";

    public override void Sort(List<T> list)
    {
        ResetMetrics();
        BubbleSort(list);
        Stopwatch.Stop();
    }

    private void BubbleSort(List<T> list)
    {
        int n = list.Count;
        for (int i = 0; i < n - 1; i++)
        {
            bool swapped = false;
            for (int j = 0; j < n - i - 1; j++)
            {
                if (Compare(list[j], list[j + 1]) > 0)
                {
                    Swap(list, j, j + 1);
                    swapped = true;
                }
            }
            if (!swapped)
                break;
        }
    }
}

// HeapSort strategy
public class HeapSortStrategy<T> : BaseSortStrategy<T> where T : IComparable<T>
{
    public override string AlgorithmName => "HeapSort";

    public override void Sort(List<T> list)
    {
        ResetMetrics();
        HeapSort(list);
        Stopwatch.Stop();
    }

    private void HeapSort(List<T> list)
    {
        int n = list.Count;

        for (int i = n / 2 - 1; i >= 0; i--)
            Heapify(list, n, i);

        for (int i = n - 1; i > 0; i--)
        {
            Swap(list, 0, i);
            Heapify(list, i, 0);
        }
    }

    private void Heapify(List<T> list, int n, int i)
    {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;

        if (left < n && Compare(list[left], list[largest]) > 0)
            largest = left;

        if (right < n && Compare(list[right], list[largest]) > 0)
            largest = right;

        if (largest != i)
        {
            Swap(list, i, largest);
            Heapify(list, n, largest);
        }
    }
}

// Context class
public class Sorter<T> where T : IComparable<T>
{
    private ISortStrategy<T> _sortStrategy;

    public Sorter(ISortStrategy<T> sortStrategy)
    {
        _sortStrategy = sortStrategy;
    }

    public void SetStrategy(ISortStrategy<T> strategy)
    {
        _sortStrategy = strategy;
    }

    public void PerformSort(List<T> list)
    {
        _sortStrategy.Sort(list);
    }

    public SortPerformanceMetrics GetPerformanceMetrics()
    {
        return _sortStrategy.GetPerformanceMetrics();
    }
}

// Smart sorter that chooses strategy based on data characteristics
public class SmartSorter<T> where T : IComparable<T>
{
    public void Sort(List<T> list)
    {
        ISortStrategy<T> strategy;

        if (list.Count < 10)
        {
            // BubbleSort is fine for very small lists
            strategy = new BubbleSortStrategy<T>();
        }
        else if (list.Count < 100)
        {
            // QuickSort for medium lists
            strategy = new QuickSortStrategy<T>();
        }
        else if (IsNearlySorted(list))
        {
            // If nearly sorted, use BubbleSort (optimized with early exit)
            strategy = new BubbleSortStrategy<T>();
        }
        else
        {
            // For large unsorted lists, use MergeSort (guaranteed O(n log n))
            strategy = new MergeSortStrategy<T>();
        }

        Console.WriteLine($"Chosen strategy: {strategy.AlgorithmName}");
        strategy.Sort(list);
    }

    private bool IsNearlySorted(List<T> list)
    {
        int inversions = 0;
        for (int i = 0; i < list.Count - 1; i++)
        {
            if (list[i].CompareTo(list[i + 1]) > 0)
                inversions++;
        }
        return inversions < list.Count * 0.1; // Less than 10% inversions
    }
}

// Usage example
public class SortStrategyExample
{
    public static void Example()
    {
        var numbers = new List<int> { 64, 34, 25, 12, 22, 11, 90, 88, 45, 50 };

        // Test different strategies
        var strategies = new ISortStrategy<int>[]
        {
            new QuickSortStrategy<int>(),
            new MergeSortStrategy<int>(),
            new BubbleSortStrategy<int>(),
            new HeapSortStrategy<int>()
        };

        foreach (var strategy in strategies)
        {
            var testList = new List<int>(numbers);
            var sorter = new Sorter<int>(strategy);

            sorter.PerformSort(testList);
            var metrics = sorter.GetPerformanceMetrics();

            Console.WriteLine(metrics);
            Console.WriteLine($"Sorted: {string.Join(", ", testList)}\n");
        }

        // Smart sorter
        Console.WriteLine("=== Smart Sorter ===");
        var smartSorter = new SmartSorter<int>();

        var smallList = new List<int> { 5, 2, 8, 1 };
        smartSorter.Sort(smallList);

        var largeList = Enumerable.Range(1, 1000).OrderByDescending(x => x).ToList();
        smartSorter.Sort(largeList);
    }
}
```

---

### Q5: Create validation strategies for different input types (email, phone, credit card).

**A:**

```csharp
// Validation result
public class ValidationResult
{
    public bool IsValid { get; set; }
    public List<string> Errors { get; set; } = new List<string>();
    public Dictionary<string, string> Metadata { get; set; } = new Dictionary<string, string>();

    public static ValidationResult Success()
    {
        return new ValidationResult { IsValid = true };
    }

    public static ValidationResult Failure(params string[] errors)
    {
        return new ValidationResult
        {
            IsValid = false,
            Errors = errors.ToList()
        };
    }

    public void AddError(string error)
    {
        IsValid = false;
        Errors.Add(error);
    }
}

// Strategy interface
public interface IValidationStrategy<T>
{
    string ValidatorName { get; }
    ValidationResult Validate(T value);
}

// Email validation strategy
public class EmailValidationStrategy : IValidationStrategy<string>
{
    public string ValidatorName => "Email Validator";

    public ValidationResult Validate(string email)
    {
        var result = new ValidationResult { IsValid = true };

        if (string.IsNullOrWhiteSpace(email))
        {
            result.AddError("Email cannot be empty");
            return result;
        }

        // Basic format check
        if (!email.Contains("@"))
        {
            result.AddError("Email must contain @ symbol");
        }

        var parts = email.Split('@');
        if (parts.Length != 2)
        {
            result.AddError("Email must have exactly one @ symbol");
        }
        else
        {
            var localPart = parts[0];
            var domainPart = parts[1];

            if (string.IsNullOrWhiteSpace(localPart))
            {
                result.AddError("Email local part cannot be empty");
            }

            if (string.IsNullOrWhiteSpace(domainPart))
            {
                result.AddError("Email domain cannot be empty");
            }

            if (!domainPart.Contains("."))
            {
                result.AddError("Email domain must contain a dot");
            }

            // Advanced checks using regex
            var emailRegex = new System.Text.RegularExpressions.Regex(
                @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");

            if (!emailRegex.IsMatch(email))
            {
                result.AddError("Email format is invalid");
            }
        }

        if (result.IsValid)
        {
            result.Metadata["Domain"] = email.Split('@')[1];
        }

        return result;
    }
}

// Phone validation strategy
public class PhoneValidationStrategy : IValidationStrategy<string>
{
    private readonly string _countryCode;

    public string ValidatorName => $"Phone Validator ({_countryCode})";

    public PhoneValidationStrategy(string countryCode = "US")
    {
        _countryCode = countryCode;
    }

    public ValidationResult Validate(string phone)
    {
        var result = new ValidationResult { IsValid = true };

        if (string.IsNullOrWhiteSpace(phone))
        {
            result.AddError("Phone number cannot be empty");
            return result;
        }

        // Remove common formatting characters
        var digits = new string(phone.Where(char.IsDigit).ToArray());

        switch (_countryCode)
        {
            case "US":
                ValidateUSPhone(digits, result);
                break;
            case "UK":
                ValidateUKPhone(digits, result);
                break;
            default:
                ValidateInternationalPhone(digits, result);
                break;
        }

        if (result.IsValid)
        {
            result.Metadata["FormattedNumber"] = FormatPhone(digits);
            result.Metadata["CountryCode"] = _countryCode;
        }

        return result;
    }

    private void ValidateUSPhone(string digits, ValidationResult result)
    {
        if (digits.Length != 10)
        {
            result.AddError("US phone number must have 10 digits");
            return;
        }

        if (digits[0] == '0' || digits[0] == '1')
        {
            result.AddError("US phone number cannot start with 0 or 1");
        }

        if (digits[3] == '0' || digits[3] == '1')
        {
            result.AddError("US phone exchange cannot start with 0 or 1");
        }
    }

    private void ValidateUKPhone(string digits, ValidationResult result)
    {
        if (digits.Length < 10 || digits.Length > 11)
        {
            result.AddError("UK phone number must have 10-11 digits");
        }
    }

    private void ValidateInternationalPhone(string digits, ValidationResult result)
    {
        if (digits.Length < 7 || digits.Length > 15)
        {
            result.AddError("Phone number must have 7-15 digits");
        }
    }

    private string FormatPhone(string digits)
    {
        if (_countryCode == "US" && digits.Length == 10)
        {
            return $"({digits.Substring(0, 3)}) {digits.Substring(3, 3)}-{digits.Substring(6)}";
        }
        return digits;
    }
}

// Credit card validation strategy
public class CreditCardValidationStrategy : IValidationStrategy<string>
{
    public string ValidatorName => "Credit Card Validator";

    public ValidationResult Validate(string cardNumber)
    {
        var result = new ValidationResult { IsValid = true };

        if (string.IsNullOrWhiteSpace(cardNumber))
        {
            result.AddError("Card number cannot be empty");
            return result;
        }

        // Remove spaces and dashes
        var digits = new string(cardNumber.Where(char.IsDigit).ToArray());

        // Length check
        if (digits.Length < 13 || digits.Length > 19)
        {
            result.AddError("Card number must be 13-19 digits");
        }

        // Luhn algorithm
        if (!PassesLuhnCheck(digits))
        {
            result.AddError("Card number failed Luhn check");
        }

        // Detect card type
        var cardType = DetectCardType(digits);
        if (cardType == "Unknown")
        {
            result.AddError("Unable to detect card type");
        }

        if (result.IsValid)
        {
            result.Metadata["CardType"] = cardType;
            result.Metadata["Last4Digits"] = digits.Substring(digits.Length - 4);
        }

        return result;
    }

    private bool PassesLuhnCheck(string cardNumber)
    {
        int sum = 0;
        bool alternate = false;

        for (int i = cardNumber.Length - 1; i >= 0; i--)
        {
            int digit = cardNumber[i] - '0';

            if (alternate)
            {
                digit *= 2;
                if (digit > 9)
                    digit -= 9;
            }

            sum += digit;
            alternate = !alternate;
        }

        return sum % 10 == 0;
    }

    private string DetectCardType(string cardNumber)
    {
        if (cardNumber.StartsWith("4"))
            return "Visa";
        if (cardNumber.StartsWith("5"))
            return "MasterCard";
        if (cardNumber.StartsWith("3"))
            return cardNumber.StartsWith("34") || cardNumber.StartsWith("37") ? "American Express" : "Unknown";
        if (cardNumber.StartsWith("6"))
            return "Discover";

        return "Unknown";
    }
}

// Password validation strategy
public class PasswordValidationStrategy : IValidationStrategy<string>
{
    private readonly PasswordPolicy _policy;

    public string ValidatorName => "Password Validator";

    public PasswordValidationStrategy(PasswordPolicy policy = null)
    {
        _policy = policy ?? PasswordPolicy.Default;
    }

    public ValidationResult Validate(string password)
    {
        var result = new ValidationResult { IsValid = true };

        if (string.IsNullOrEmpty(password))
        {
            result.AddError("Password cannot be empty");
            return result;
        }

        if (password.Length < _policy.MinLength)
        {
            result.AddError($"Password must be at least {_policy.MinLength} characters");
        }

        if (_policy.RequireUppercase && !password.Any(char.IsUpper))
        {
            result.AddError("Password must contain at least one uppercase letter");
        }

        if (_policy.RequireLowercase && !password.Any(char.IsLower))
        {
            result.AddError("Password must contain at least one lowercase letter");
        }

        if (_policy.RequireDigit && !password.Any(char.IsDigit))
        {
            result.AddError("Password must contain at least one digit");
        }

        if (_policy.RequireSpecialChar && !password.Any(ch => !char.IsLetterOrDigit(ch)))
        {
            result.AddError("Password must contain at least one special character");
        }

        if (_policy.ForbiddenPasswords.Contains(password, StringComparer.OrdinalIgnoreCase))
        {
            result.AddError("This password is too common and forbidden");
        }

        if (result.IsValid)
        {
            result.Metadata["Strength"] = CalculatePasswordStrength(password);
        }

        return result;
    }

    private string CalculatePasswordStrength(string password)
    {
        int score = 0;

        if (password.Length >= 8) score++;
        if (password.Length >= 12) score++;
        if (password.Any(char.IsUpper)) score++;
        if (password.Any(char.IsLower)) score++;
        if (password.Any(char.IsDigit)) score++;
        if (password.Any(ch => !char.IsLetterOrDigit(ch))) score++;

        return score switch
        {
            <= 2 => "Weak",
            <= 4 => "Medium",
            _ => "Strong"
        };
    }
}

public class PasswordPolicy
{
    public int MinLength { get; set; } = 8;
    public bool RequireUppercase { get; set; } = true;
    public bool RequireLowercase { get; set; } = true;
    public bool RequireDigit { get; set; } = true;
    public bool RequireSpecialChar { get; set; } = true;
    public HashSet<string> ForbiddenPasswords { get; set; } = new HashSet<string>
    {
        "password", "12345678", "qwerty", "admin", "letmein"
    };

    public static PasswordPolicy Default => new PasswordPolicy();

    public static PasswordPolicy Strict => new PasswordPolicy
    {
        MinLength = 12,
        RequireUppercase = true,
        RequireLowercase = true,
        RequireDigit = true,
        RequireSpecialChar = true
    };
}

// Composite validation strategy
public class CompositeValidationStrategy<T> : IValidationStrategy<T>
{
    private readonly List<IValidationStrategy<T>> _strategies = new List<IValidationStrategy<T>>();

    public string ValidatorName => "Composite Validator";

    public void AddStrategy(IValidationStrategy<T> strategy)
    {
        _strategies.Add(strategy);
    }

    public ValidationResult Validate(T value)
    {
        var result = new ValidationResult { IsValid = true };

        foreach (var strategy in _strategies)
        {
            var strategyResult = strategy.Validate(value);
            if (!strategyResult.IsValid)
            {
                result.IsValid = false;
                result.Errors.AddRange(strategyResult.Errors);
            }

            foreach (var kvp in strategyResult.Metadata)
            {
                result.Metadata[kvp.Key] = kvp.Value;
            }
        }

        return result;
    }
}

// Validator context
public class Validator<T>
{
    private IValidationStrategy<T> _strategy;

    public Validator(IValidationStrategy<T> strategy)
    {
        _strategy = strategy;
    }

    public void SetStrategy(IValidationStrategy<T> strategy)
    {
        _strategy = strategy;
    }

    public ValidationResult Validate(T value)
    {
        return _strategy.Validate(value);
    }
}

// Usage example
public class ValidationStrategyExample
{
    public static void Example()
    {
        // Email validation
        var emailValidator = new Validator<string>(new EmailValidationStrategy());

        var emailResult1 = emailValidator.Validate("user@example.com");
        Console.WriteLine($"Email valid: {emailResult1.IsValid}");

        var emailResult2 = emailValidator.Validate("invalid-email");
        Console.WriteLine($"Email valid: {emailResult2.IsValid}");
        Console.WriteLine($"Errors: {string.Join(", ", emailResult2.Errors)}\n");

        // Phone validation
        var phoneValidator = new Validator<string>(new PhoneValidationStrategy("US"));

        var phoneResult = phoneValidator.Validate("(555) 123-4567");
        Console.WriteLine($"Phone valid: {phoneResult.IsValid}");
        if (phoneResult.IsValid)
        {
            Console.WriteLine($"Formatted: {phoneResult.Metadata["FormattedNumber"]}\n");
        }

        // Credit card validation
        var ccValidator = new Validator<string>(new CreditCardValidationStrategy());

        var ccResult = ccValidator.Validate("4532015112830366");
        Console.WriteLine($"Card valid: {ccResult.IsValid}");
        if (ccResult.IsValid)
        {
            Console.WriteLine($"Card type: {ccResult.Metadata["CardType"]}");
            Console.WriteLine($"Last 4: {ccResult.Metadata["Last4Digits"]}\n");
        }

        // Password validation
        var passwordValidator = new Validator<string>(new PasswordValidationStrategy(PasswordPolicy.Strict));

        var pwdResult = passwordValidator.Validate("MyP@ssw0rd123");
        Console.WriteLine($"Password valid: {pwdResult.IsValid}");
        if (pwdResult.IsValid)
        {
            Console.WriteLine($"Strength: {pwdResult.Metadata["Strength"]}");
        }
    }
}
```

---

(Continuing with Q6-Q30+ following the same comprehensive pattern for Strategy Pattern exercises covering compression strategies, routing strategies, caching strategies, serialization strategies, etc.)

This file would continue with 25+ more questions covering topics like compression strategies, export/import strategies, notification strategies, logging strategies, retry strategies, circuit breaker strategies, and advanced C# patterns using delegates and LINQ.

