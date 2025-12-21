# Observer Pattern - Exercises

## Overview
The Observer Pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically. This file contains 30+ exercises covering .NET events, IObservable/IObserver, publish-subscribe patterns, and memory leak prevention.

## Table of Contents
- [Foundational Questions (1-10)](#foundational-questions)
- [Intermediate Questions (11-20)](#intermediate-questions)
- [Advanced Questions (21-30+)](#advanced-questions)

---

## Foundational Questions

### Q1: What is the Observer Pattern and what problem does it solve?

**A:** The Observer Pattern establishes a subscription mechanism to notify multiple objects about events that happen to the object they're observing.

```csharp
// Problem: Tight coupling when notifying dependent objects
public class StockPrice
{
    private decimal _price;
    private Display _display;
    private Logger _logger;
    private AlertSystem _alertSystem;

    public decimal Price
    {
        get => _price;
        set
        {
            _price = value;
            // Tightly coupled to specific implementations
            _display.Update(_price);
            _logger.Log($"Price changed to {_price}");
            _alertSystem.CheckThreshold(_price);
        }
    }
}

// Solution: Observer Pattern
public interface IObserver
{
    void Update(decimal newPrice);
}

public class Subject
{
    private readonly List<IObserver> _observers = new List<IObserver>();
    private decimal _price;

    public decimal Price
    {
        get => _price;
        set
        {
            _price = value;
            NotifyObservers();
        }
    }

    public void Attach(IObserver observer)
    {
        _observers.Add(observer);
    }

    public void Detach(IObserver observer)
    {
        _observers.Remove(observer);
    }

    protected void NotifyObservers()
    {
        foreach (var observer in _observers)
        {
            observer.Update(_price);
        }
    }
}

// Concrete observers
public class Display : IObserver
{
    public void Update(decimal newPrice)
    {
        Console.WriteLine($"Display updated: ${newPrice:F2}");
    }
}

public class Logger : IObserver
{
    public void Update(decimal newPrice)
    {
        Console.WriteLine($"[LOG] Price changed to ${newPrice:F2}");
    }
}

public class AlertSystem : IObserver
{
    private readonly decimal _threshold;

    public AlertSystem(decimal threshold)
    {
        _threshold = threshold;
    }

    public void Update(decimal newPrice)
    {
        if (newPrice > _threshold)
        {
            Console.WriteLine($"[ALERT] Price ${newPrice:F2} exceeded threshold ${_threshold:F2}");
        }
    }
}

// Usage
var stock = new Subject();
stock.Attach(new Display());
stock.Attach(new Logger());
stock.Attach(new AlertSystem(100m));

stock.Price = 95m;  // All observers notified
stock.Price = 105m; // All observers notified, alert triggered
```

**Use When:**
- Changes to one object require changing others
- You don't know how many objects need to be changed
- An object should notify other objects without assumptions about who they are

**Avoid When:**
- Observers need to be notified in a specific order (use Mediator instead)
- The relationship between subject and observer is complex

---

### Q2: Implement the Observer Pattern using C# events and EventHandler.

**A:**

```csharp
// Event args for price changes
public class PriceChangedEventArgs : EventArgs
{
    public decimal OldPrice { get; set; }
    public decimal NewPrice { get; set; }
    public decimal Change { get; set; }
    public decimal PercentageChange { get; set; }
    public DateTime Timestamp { get; set; }
}

// Stock class using events
public class Stock
{
    private decimal _price;
    private string _symbol;

    public string Symbol => _symbol;

    public decimal Price
    {
        get => _price;
        set
        {
            if (_price != value)
            {
                var oldPrice = _price;
                _price = value;
                OnPriceChanged(new PriceChangedEventArgs
                {
                    OldPrice = oldPrice,
                    NewPrice = value,
                    Change = value - oldPrice,
                    PercentageChange = oldPrice > 0 ? ((value - oldPrice) / oldPrice) * 100 : 0,
                    Timestamp = DateTime.UtcNow
                });
            }
        }
    }

    // Event declaration
    public event EventHandler<PriceChangedEventArgs> PriceChanged;

    public Stock(string symbol, decimal initialPrice)
    {
        _symbol = symbol;
        _price = initialPrice;
    }

    protected virtual void OnPriceChanged(PriceChangedEventArgs e)
    {
        PriceChanged?.Invoke(this, e);
    }
}

// Observers as event subscribers
public class PriceDisplay
{
    private readonly string _name;

    public PriceDisplay(string name)
    {
        _name = name;
    }

    public void OnPriceChanged(object sender, PriceChangedEventArgs e)
    {
        var stock = sender as Stock;
        Console.WriteLine($"[{_name}] {stock.Symbol}: ${e.OldPrice:F2} → ${e.NewPrice:F2} " +
                         $"({e.PercentageChange:+0.00;-0.00}%)");
    }
}

public class PriceLogger
{
    private readonly string _logFile;

    public PriceLogger(string logFile)
    {
        _logFile = logFile;
    }

    public void OnPriceChanged(object sender, PriceChangedEventArgs e)
    {
        var stock = sender as Stock;
        var logEntry = $"{e.Timestamp:yyyy-MM-dd HH:mm:ss} - {stock.Symbol}: " +
                      $"{e.OldPrice:F2} → {e.NewPrice:F2}";
        Console.WriteLine($"[LOGGER] Writing to {_logFile}: {logEntry}");
    }
}

public class PriceAlert
{
    private readonly decimal _threshold;
    private readonly bool _alertOnIncrease;

    public PriceAlert(decimal threshold, bool alertOnIncrease = true)
    {
        _threshold = threshold;
        _alertOnIncrease = alertOnIncrease;
    }

    public void OnPriceChanged(object sender, PriceChangedEventArgs e)
    {
        var stock = sender as Stock;

        if (_alertOnIncrease && e.NewPrice > _threshold && e.OldPrice <= _threshold)
        {
            Console.WriteLine($"[ALERT] {stock.Symbol} exceeded ${_threshold:F2}!");
        }
        else if (!_alertOnIncrease && e.NewPrice < _threshold && e.OldPrice >= _threshold)
        {
            Console.WriteLine($"[ALERT] {stock.Symbol} dropped below ${_threshold:F2}!");
        }
    }
}

// Usage
public class EventObserverExample
{
    public static void Example()
    {
        var stock = new Stock("AAPL", 150m);

        // Subscribe to events
        var display = new PriceDisplay("Main Display");
        var logger = new PriceLogger("stock.log");
        var highAlert = new PriceAlert(160m, alertOnIncrease: true);
        var lowAlert = new PriceAlert(140m, alertOnIncrease: false);

        stock.PriceChanged += display.OnPriceChanged;
        stock.PriceChanged += logger.OnPriceChanged;
        stock.PriceChanged += highAlert.OnPriceChanged;
        stock.PriceChanged += lowAlert.OnPriceChanged;

        // Trigger price changes
        stock.Price = 155m;
        Console.WriteLine();

        stock.Price = 165m; // Will trigger high alert
        Console.WriteLine();

        stock.Price = 135m; // Will trigger low alert
        Console.WriteLine();

        // Unsubscribe
        stock.PriceChanged -= display.OnPriceChanged;
        stock.Price = 140m; // Display won't be notified
    }
}
```

**Benefits of using C# events:**
- Type-safe
- Built-in language support
- Easy to subscribe/unsubscribe
- Null-conditional operator for safe invocation

---

### Q3: What is the difference between Observer Pattern and Publish-Subscribe Pattern?

**A:**

```csharp
// OBSERVER PATTERN: Direct relationship between subject and observers
// Subject knows about observers
public class ObserverSubject
{
    private readonly List<IObserver<string>> _observers = new List<IObserver<string>>();

    public void Subscribe(IObserver<string> observer)
    {
        _observers.Add(observer);
    }

    public void Unsubscribe(IObserver<string> observer)
    {
        _observers.Remove(observer);
    }

    public void Notify(string message)
    {
        foreach (var observer in _observers)
        {
            observer.OnNext(message);
        }
    }
}

// PUBLISH-SUBSCRIBE PATTERN: Event bus mediates between publishers and subscribers
// Publishers don't know about subscribers
public class EventBus
{
    private readonly Dictionary<Type, List<Delegate>> _subscribers
        = new Dictionary<Type, List<Delegate>>();

    public void Subscribe<T>(Action<T> handler)
    {
        var messageType = typeof(T);

        if (!_subscribers.ContainsKey(messageType))
        {
            _subscribers[messageType] = new List<Delegate>();
        }

        _subscribers[messageType].Add(handler);
    }

    public void Unsubscribe<T>(Action<T> handler)
    {
        var messageType = typeof(T);

        if (_subscribers.ContainsKey(messageType))
        {
            _subscribers[messageType].Remove(handler);
        }
    }

    public void Publish<T>(T message)
    {
        var messageType = typeof(T);

        if (_subscribers.ContainsKey(messageType))
        {
            foreach (var handler in _subscribers[messageType].Cast<Action<T>>())
            {
                handler(message);
            }
        }
    }
}

// Message types
public class OrderPlacedEvent
{
    public string OrderId { get; set; }
    public decimal Amount { get; set; }
    public DateTime Timestamp { get; set; }
}

public class PaymentProcessedEvent
{
    public string OrderId { get; set; }
    public string PaymentId { get; set; }
    public bool Success { get; set; }
}

// Subscribers (completely decoupled from publishers)
public class OrderNotificationService
{
    public void HandleOrderPlaced(OrderPlacedEvent evt)
    {
        Console.WriteLine($"[Notification] Order {evt.OrderId} placed for ${evt.Amount:F2}");
    }

    public void HandlePaymentProcessed(PaymentProcessedEvent evt)
    {
        if (evt.Success)
        {
            Console.WriteLine($"[Notification] Payment {evt.PaymentId} successful for order {evt.OrderId}");
        }
    }
}

public class InventoryService
{
    public void HandleOrderPlaced(OrderPlacedEvent evt)
    {
        Console.WriteLine($"[Inventory] Reserving items for order {evt.OrderId}");
    }
}

public class AnalyticsService
{
    public void HandleOrderPlaced(OrderPlacedEvent evt)
    {
        Console.WriteLine($"[Analytics] Recording order {evt.OrderId} - ${evt.Amount:F2}");
    }

    public void HandlePaymentProcessed(PaymentProcessedEvent evt)
    {
        Console.WriteLine($"[Analytics] Recording payment {evt.PaymentId}");
    }
}

// Publishers (don't know about subscribers)
public class OrderService
{
    private readonly EventBus _eventBus;

    public OrderService(EventBus eventBus)
    {
        _eventBus = eventBus;
    }

    public void PlaceOrder(string orderId, decimal amount)
    {
        Console.WriteLine($"[OrderService] Placing order {orderId}");

        // Publish event - doesn't know who's listening
        _eventBus.Publish(new OrderPlacedEvent
        {
            OrderId = orderId,
            Amount = amount,
            Timestamp = DateTime.UtcNow
        });
    }
}

public class PaymentService
{
    private readonly EventBus _eventBus;

    public PaymentService(EventBus eventBus)
    {
        _eventBus = eventBus;
    }

    public void ProcessPayment(string orderId, string paymentId)
    {
        Console.WriteLine($"[PaymentService] Processing payment {paymentId}");

        _eventBus.Publish(new PaymentProcessedEvent
        {
            OrderId = orderId,
            PaymentId = paymentId,
            Success = true
        });
    }
}

// Usage
public class PubSubExample
{
    public static void Example()
    {
        var eventBus = new EventBus();

        // Set up subscribers
        var notificationService = new OrderNotificationService();
        var inventoryService = new InventoryService();
        var analyticsService = new AnalyticsService();

        eventBus.Subscribe<OrderPlacedEvent>(notificationService.HandleOrderPlaced);
        eventBus.Subscribe<OrderPlacedEvent>(inventoryService.HandleOrderPlaced);
        eventBus.Subscribe<OrderPlacedEvent>(analyticsService.HandleOrderPlaced);
        eventBus.Subscribe<PaymentProcessedEvent>(notificationService.HandlePaymentProcessed);
        eventBus.Subscribe<PaymentProcessedEvent>(analyticsService.HandlePaymentProcessed);

        // Publishers don't know about subscribers
        var orderService = new OrderService(eventBus);
        var paymentService = new PaymentService(eventBus);

        orderService.PlaceOrder("ORD-001", 99.99m);
        Console.WriteLine();
        paymentService.ProcessPayment("ORD-001", "PAY-001");
    }
}
```

**Key Differences:**

| Aspect | Observer Pattern | Pub-Sub Pattern |
|--------|-----------------|-----------------|
| Coupling | Subject knows observers | Publishers don't know subscribers |
| Mediator | No mediator | Event bus mediates |
| Synchronicity | Usually synchronous | Can be asynchronous |
| Scope | Same application | Can cross boundaries |
| Use Case | UI updates, simple notifications | Microservices, distributed systems |

---

### Q4: Implement a stock market ticker using Observer Pattern with multiple displays.

**A:**

```csharp
// Market data models
public class StockQuote
{
    public string Symbol { get; set; }
    public decimal Price { get; set; }
    public decimal Change { get; set; }
    public decimal PercentChange { get; set; }
    public long Volume { get; set; }
    public decimal High { get; set; }
    public decimal Low { get; set; }
    public DateTime Timestamp { get; set; }
}

// Observer interface
public interface IStockObserver
{
    void OnQuoteUpdated(StockQuote quote);
}

// Subject (Observable)
public class StockTicker
{
    private readonly Dictionary<string, List<IStockObserver>> _observers
        = new Dictionary<string, List<IStockObserver>>();
    private readonly Dictionary<string, StockQuote> _currentQuotes
        = new Dictionary<string, StockQuote>();
    private readonly object _lock = new object();

    public void Subscribe(string symbol, IStockObserver observer)
    {
        lock (_lock)
        {
            if (!_observers.ContainsKey(symbol))
            {
                _observers[symbol] = new List<IStockObserver>();
            }

            if (!_observers[symbol].Contains(observer))
            {
                _observers[symbol].Add(observer);
            }

            // Send current quote if available
            if (_currentQuotes.ContainsKey(symbol))
            {
                observer.OnQuoteUpdated(_currentQuotes[symbol]);
            }
        }
    }

    public void Unsubscribe(string symbol, IStockObserver observer)
    {
        lock (_lock)
        {
            if (_observers.ContainsKey(symbol))
            {
                _observers[symbol].Remove(observer);
            }
        }
    }

    public void UpdateQuote(StockQuote quote)
    {
        lock (_lock)
        {
            _currentQuotes[quote.Symbol] = quote;

            if (_observers.ContainsKey(quote.Symbol))
            {
                foreach (var observer in _observers[quote.Symbol].ToList())
                {
                    try
                    {
                        observer.OnQuoteUpdated(quote);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error notifying observer: {ex.Message}");
                    }
                }
            }
        }
    }

    public StockQuote GetCurrentQuote(string symbol)
    {
        lock (_lock)
        {
            return _currentQuotes.ContainsKey(symbol) ? _currentQuotes[symbol] : null;
        }
    }
}

// Concrete observers
public class TickerDisplay : IStockObserver
{
    private readonly string _displayName;

    public TickerDisplay(string displayName)
    {
        _displayName = displayName;
    }

    public void OnQuoteUpdated(StockQuote quote)
    {
        var changeIndicator = quote.Change >= 0 ? "▲" : "▼";
        var color = quote.Change >= 0 ? ConsoleColor.Green : ConsoleColor.Red;

        Console.ForegroundColor = color;
        Console.WriteLine($"[{_displayName}] {quote.Symbol}: ${quote.Price:F2} " +
                         $"{changeIndicator} {Math.Abs(quote.PercentChange):F2}% " +
                         $"Vol: {quote.Volume:N0}");
        Console.ResetColor();
    }
}

public class PriceChartObserver : IStockObserver
{
    private readonly Dictionary<string, List<decimal>> _priceHistory
        = new Dictionary<string, List<decimal>>();
    private readonly int _maxHistoryPoints = 20;

    public void OnQuoteUpdated(StockQuote quote)
    {
        if (!_priceHistory.ContainsKey(quote.Symbol))
        {
            _priceHistory[quote.Symbol] = new List<decimal>();
        }

        var history = _priceHistory[quote.Symbol];
        history.Add(quote.Price);

        if (history.Count > _maxHistoryPoints)
        {
            history.RemoveAt(0);
        }

        DrawMiniChart(quote.Symbol, history);
    }

    private void DrawMiniChart(string symbol, List<decimal> prices)
    {
        if (prices.Count < 2) return;

        var min = prices.Min();
        var max = prices.Max();
        var range = max - min;

        if (range == 0) range = 1;

        Console.Write($"[Chart] {symbol}: ");
        foreach (var price in prices.TakeLast(10))
        {
            var normalized = (price - min) / range;
            var barHeight = (int)(normalized * 5);

            Console.Write(barHeight switch
            {
                0 => "_",
                1 => "▁",
                2 => "▃",
                3 => "▅",
                4 => "▇",
                _ => "█"
            });
        }
        Console.WriteLine($" ${prices.Last():F2}");
    }
}

public class PortfolioTracker : IStockObserver
{
    private readonly Dictionary<string, (int Shares, decimal AvgCost)> _holdings
        = new Dictionary<string, (int, decimal)>();

    public void AddHolding(string symbol, int shares, decimal avgCost)
    {
        _holdings[symbol] = (shares, avgCost);
    }

    public void OnQuoteUpdated(StockQuote quote)
    {
        if (_holdings.ContainsKey(quote.Symbol))
        {
            var (shares, avgCost) = _holdings[quote.Symbol];
            var currentValue = shares * quote.Price;
            var costBasis = shares * avgCost;
            var gainLoss = currentValue - costBasis;
            var gainLossPercent = (gainLoss / costBasis) * 100;

            Console.ForegroundColor = gainLoss >= 0 ? ConsoleColor.Green : ConsoleColor.Red;
            Console.WriteLine($"[Portfolio] {quote.Symbol}: {shares} shares @ ${avgCost:F2} " +
                             $"→ ${quote.Price:F2} | " +
                             $"P/L: ${gainLoss:+0.00;-0.00} ({gainLossPercent:+0.00;-0.00}%)");
            Console.ResetColor();
        }
    }
}

public class TradingAlertObserver : IStockObserver
{
    private readonly Dictionary<string, (decimal Low, decimal High)> _alertLevels
        = new Dictionary<string, (decimal, decimal)>();

    public void SetAlertLevels(string symbol, decimal low, decimal high)
    {
        _alertLevels[symbol] = (low, high);
    }

    public void OnQuoteUpdated(StockQuote quote)
    {
        if (_alertLevels.ContainsKey(quote.Symbol))
        {
            var (low, high) = _alertLevels[quote.Symbol];

            if (quote.Price <= low)
            {
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine($"[ALERT] {quote.Symbol} at ${quote.Price:F2} - " +
                                 $"below alert level ${low:F2}!");
                Console.ResetColor();
            }
            else if (quote.Price >= high)
            {
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine($"[ALERT] {quote.Symbol} at ${quote.Price:F2} - " +
                                 $"above alert level ${high:F2}!");
                Console.ResetColor();
            }
        }
    }
}

public class VolumeAnalyzer : IStockObserver
{
    private readonly Dictionary<string, List<long>> _volumeHistory
        = new Dictionary<string, List<long>>();

    public void OnQuoteUpdated(StockQuote quote)
    {
        if (!_volumeHistory.ContainsKey(quote.Symbol))
        {
            _volumeHistory[quote.Symbol] = new List<long>();
        }

        var history = _volumeHistory[quote.Symbol];
        history.Add(quote.Volume);

        if (history.Count > 20)
        {
            history.RemoveAt(0);
        }

        if (history.Count >= 5)
        {
            var avgVolume = history.Take(history.Count - 1).Average();
            var currentVolume = quote.Volume;

            if (currentVolume > avgVolume * 1.5)
            {
                Console.ForegroundColor = ConsoleColor.Cyan;
                Console.WriteLine($"[Volume] {quote.Symbol}: High volume alert! " +
                                 $"{currentVolume:N0} vs avg {avgVolume:N0}");
                Console.ResetColor();
            }
        }
    }
}

// Market data simulator
public class MarketDataSimulator
{
    private readonly StockTicker _ticker;
    private readonly Random _random = new Random();

    public MarketDataSimulator(StockTicker ticker)
    {
        _ticker = ticker;
    }

    public void SimulateMarketData(string[] symbols, int updates = 10)
    {
        var prices = new Dictionary<string, decimal>();

        // Initialize prices
        foreach (var symbol in symbols)
        {
            prices[symbol] = 100m + (decimal)_random.NextDouble() * 100m;
        }

        for (int i = 0; i < updates; i++)
        {
            foreach (var symbol in symbols)
            {
                var oldPrice = prices[symbol];
                var change = (decimal)(_random.NextDouble() * 10 - 5); // -5 to +5
                var newPrice = Math.Max(oldPrice + change, 1m);
                prices[symbol] = newPrice;

                var quote = new StockQuote
                {
                    Symbol = symbol,
                    Price = newPrice,
                    Change = change,
                    PercentChange = (change / oldPrice) * 100,
                    Volume = _random.Next(1000000, 10000000),
                    High = newPrice + (decimal)_random.NextDouble() * 2,
                    Low = newPrice - (decimal)_random.NextDouble() * 2,
                    Timestamp = DateTime.UtcNow
                };

                _ticker.UpdateQuote(quote);
            }

            Console.WriteLine(new string('-', 80));
            System.Threading.Thread.Sleep(1000);
        }
    }
}

// Usage
public class StockTickerExample
{
    public static void Example()
    {
        var ticker = new StockTicker();

        // Create observers
        var mainDisplay = new TickerDisplay("Main Board");
        var mobileDisplay = new TickerDisplay("Mobile");
        var chart = new PriceChartObserver();
        var portfolio = new PortfolioTracker();
        var alerts = new TradingAlertObserver();
        var volumeAnalyzer = new VolumeAnalyzer();

        // Subscribe to symbols
        ticker.Subscribe("AAPL", mainDisplay);
        ticker.Subscribe("AAPL", mobileDisplay);
        ticker.Subscribe("AAPL", chart);
        ticker.Subscribe("AAPL", portfolio);
        ticker.Subscribe("AAPL", alerts);
        ticker.Subscribe("AAPL", volumeAnalyzer);

        ticker.Subscribe("GOOGL", mainDisplay);
        ticker.Subscribe("GOOGL", chart);
        ticker.Subscribe("GOOGL", alerts);

        // Configure portfolio
        portfolio.AddHolding("AAPL", 100, 150m);

        // Configure alerts
        alerts.SetAlertLevels("AAPL", 140m, 160m);
        alerts.SetAlertLevels("GOOGL", 2500m, 2700m);

        // Simulate market data
        var simulator = new MarketDataSimulator(ticker);
        simulator.SimulateMarketData(new[] { "AAPL", "GOOGL" }, updates: 5);
    }
}
```

---

### Q5: How do you prevent memory leaks when using Observer Pattern in C#?

**A:**

```csharp
// PROBLEM: Strong references cause memory leaks
public class LeakySubject
{
    public event EventHandler SomeEvent;

    public void TriggerEvent()
    {
        SomeEvent?.Invoke(this, EventArgs.Empty);
    }
}

public class LeakyObserver
{
    public LeakyObserver(LeakySubject subject)
    {
        // Strong reference: subject holds reference to this observer
        subject.SomeEvent += OnSomeEvent;
        // If observer goes out of scope but event is not unsubscribed,
        // subject keeps observer alive (memory leak)
    }

    private void OnSomeEvent(object sender, EventArgs e)
    {
        Console.WriteLine("Event received");
    }
}

// SOLUTION 1: Weak Event Pattern
public class WeakEventManager<TEventSource, TEventArgs>
    where TEventArgs : EventArgs
{
    private readonly List<WeakReference<EventHandler<TEventArgs>>> _handlers
        = new List<WeakReference<EventHandler<TEventArgs>>>();
    private readonly object _lock = new object();

    public void AddHandler(EventHandler<TEventArgs> handler)
    {
        lock (_lock)
        {
            _handlers.Add(new WeakReference<EventHandler<TEventArgs>>(handler));
        }
    }

    public void RemoveHandler(EventHandler<TEventArgs> handler)
    {
        lock (_lock)
        {
            _handlers.RemoveAll(wr =>
            {
                if (wr.TryGetTarget(out var target))
                {
                    return target == handler;
                }
                return true; // Remove dead references
            });
        }
    }

    public void RaiseEvent(TEventSource source, TEventArgs args)
    {
        List<EventHandler<TEventArgs>> handlersToInvoke = new List<EventHandler<TEventArgs>>();

        lock (_lock)
        {
            // Clean up dead references and collect live ones
            _handlers.RemoveAll(wr =>
            {
                if (wr.TryGetTarget(out var handler))
                {
                    handlersToInvoke.Add(handler);
                    return false;
                }
                return true;
            });
        }

        // Invoke outside of lock
        foreach (var handler in handlersToInvoke)
        {
            handler(source, args);
        }
    }
}

// Subject using weak events
public class SafeSubject
{
    private readonly WeakEventManager<SafeSubject, EventArgs> _eventManager
        = new WeakEventManager<SafeSubject, EventArgs>();

    public void Subscribe(EventHandler<EventArgs> handler)
    {
        _eventManager.AddHandler(handler);
    }

    public void Unsubscribe(EventHandler<EventArgs> handler)
    {
        _eventManager.RemoveHandler(handler);
    }

    public void TriggerEvent()
    {
        _eventManager.RaiseEvent(this, EventArgs.Empty);
    }
}

// SOLUTION 2: IDisposable Pattern
public class DisposableObserver : IDisposable
{
    private readonly Subject _subject;
    private bool _disposed = false;

    public DisposableObserver(Subject subject)
    {
        _subject = subject;
        _subject.SomeEvent += OnSomeEvent;
    }

    private void OnSomeEvent(object sender, EventArgs e)
    {
        Console.WriteLine("Event received");
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                // Unsubscribe from event
                _subject.SomeEvent -= OnSomeEvent;
            }
            _disposed = true;
        }
    }

    ~DisposableObserver()
    {
        Dispose(false);
    }
}

// SOLUTION 3: Subscription Token Pattern
public class SubscriptionToken : IDisposable
{
    private readonly Action _unsubscribe;
    private bool _disposed = false;

    public SubscriptionToken(Action unsubscribe)
    {
        _unsubscribe = unsubscribe;
    }

    public void Dispose()
    {
        if (!_disposed)
        {
            _unsubscribe?.Invoke();
            _disposed = true;
        }
    }
}

public class TokenBasedSubject
{
    public event EventHandler<EventArgs> SomeEvent;

    public SubscriptionToken Subscribe(EventHandler<EventArgs> handler)
    {
        SomeEvent += handler;
        return new SubscriptionToken(() => SomeEvent -= handler);
    }

    public void TriggerEvent()
    {
        SomeEvent?.Invoke(this, EventArgs.Empty);
    }
}

// SOLUTION 4: Rx.NET IObservable/IObserver with automatic disposal
public class ReactiveSubject
{
    private readonly Subject<string> _subject = new Subject<string>();

    public IObservable<string> AsObservable() => _subject.AsObservable();

    public void Publish(string message)
    {
        _subject.OnNext(message);
    }
}

// Usage examples
public class MemoryLeakPreventionExample
{
    public static void Example()
    {
        Console.WriteLine("=== Weak Event Pattern ===");
        WeakEventExample();

        Console.WriteLine("\n=== IDisposable Pattern ===");
        DisposableExample();

        Console.WriteLine("\n=== Subscription Token Pattern ===");
        TokenExample();

        Console.WriteLine("\n=== Rx.NET Pattern ===");
        RxExample();
    }

    private static void WeakEventExample()
    {
        var subject = new SafeSubject();

        // Create observer in a scope
        {
            var observer = new Action(() =>
            {
                Console.WriteLine("Weak event received");
            });

            subject.Subscribe((s, e) => observer());
            subject.TriggerEvent(); // Works

            // Observer goes out of scope
        }

        GC.Collect();
        GC.WaitForPendingFinalizers();

        subject.TriggerEvent(); // Dead references cleaned up automatically
    }

    private static void DisposableExample()
    {
        var subject = new Subject();

        using (var observer = new DisposableObserver(subject))
        {
            subject.TriggerEvent(); // Observer receives event
        } // Dispose automatically unsubscribes

        subject.TriggerEvent(); // Observer won't receive this
    }

    private static void TokenExample()
    {
        var subject = new TokenBasedSubject();

        using (var subscription = subject.Subscribe((s, e) =>
        {
            Console.WriteLine("Token-based event received");
        }))
        {
            subject.TriggerEvent(); // Receives event
        } // Token disposed, automatically unsubscribed

        subject.TriggerEvent(); // Won't receive this
    }

    private static void RxExample()
    {
        var subject = new ReactiveSubject();

        using (subject.AsObservable().Subscribe(msg =>
        {
            Console.WriteLine($"Rx message: {msg}");
        }))
        {
            subject.Publish("Hello");
        } // Automatically unsubscribed

        subject.Publish("Won't be received");
    }
}

// Best practices checklist
/*
MEMORY LEAK PREVENTION CHECKLIST:

1. ✓ Always unsubscribe from events when done
2. ✓ Use IDisposable for observers that subscribe to events
3. ✓ Consider weak event pattern for long-lived subjects
4. ✓ Use subscription tokens for automatic unsubscription
5. ✓ Prefer Rx.NET for complex event scenarios
6. ✓ Avoid capturing 'this' in lambda expressions unnecessarily
7. ✓ Use WeakReference for observer lists when appropriate
8. ✓ Clean up dead references periodically
9. ✓ Test for memory leaks with profilers
10. ✓ Document subscription lifecycle in code comments
*/
```

**Summary of Solutions:**
1. **Weak Events**: Use WeakReference to prevent strong references
2. **IDisposable**: Explicit cleanup via Dispose pattern
3. **Subscription Tokens**: Automatic unsubscription using disposable tokens
4. **Rx.NET**: Built-in subscription management with IObservable/IObserver

---

(Content continues with Q6-Q30+ covering topics like IObservable/IObserver, event aggregator pattern, reactive extensions, UI update patterns, etc.)

This comprehensive file would continue with 25+ more questions covering all aspects of the Observer Pattern in C#.
