# Solution Architecture - Practice Exercises

Exercises focused on how to structure a codebase (Clean Architecture, DDD, vertical slices, MVVM).

---

## Foundations

**Q: Compare Clean Architecture, DDD, and Vertical Slice architecture in one paragraph.**

A: Clean Architecture is a dependency rule and layering approach that keeps the Domain independent. DDD is a modeling approach that defines bounded contexts and aggregates to reflect the business. Vertical slices organize code by use case to keep changes localized. They can be combined: DDD shapes the Domain, vertical slices organize the Application layer, and Clean Architecture defines dependency flow.

---

## Scenario Decisions

**Q: You are building a trading order management API with evolving rules and multiple integrations. Which solution architecture would you choose and why?**

A: Use Clean Architecture with DDD in the Domain. It isolates business rules from infrastructure and allows swapping integrations (brokers, databases). Organize Application by vertical slices to keep use cases cohesive and testable.

---

**Q: You are building a desktop trading terminal (WPF). Which pattern do you apply for the UI and why?**

A: MVVM. It separates UI from behavior, enables binding, and supports unit testing for view models.

---

## Design Exercises

**Q: Draft a vertical slice folder layout for a "CancelOrder" use case.**

A:

```
Application/
  Orders/
    CancelOrder/
      CancelOrderCommand.cs
      CancelOrderHandler.cs
      CancelOrderValidator.cs
      CancelOrderResult.cs
```

---

**Q: Identify the bounded contexts for a trading platform and list one aggregate per context.**

A:
- **Orders Context:** Aggregate = Order
- **Risk Context:** Aggregate = RiskLimit
- **Pricing Context:** Aggregate = Quote
- **Accounts Context:** Aggregate = Account

---

## Implementation Drill

**Q: Write a simple MVVM ViewModel for placing an order.**

A:

```csharp
public sealed class PlaceOrderViewModel : INotifyPropertyChanged
{
    private string _symbol = string.Empty;
    private decimal _quantity;

    public string Symbol
    {
        get => _symbol;
        set { _symbol = value; OnPropertyChanged(nameof(Symbol)); }
    }

    public decimal Quantity
    {
        get => _quantity;
        set { _quantity = value; OnPropertyChanged(nameof(Quantity)); }
    }

    public ICommand PlaceOrderCommand { get; }

    public PlaceOrderViewModel(IOrderService orderService)
    {
        PlaceOrderCommand = new RelayCommand(() => orderService.Place(Symbol, Quantity));
    }

    public event PropertyChangedEventHandler? PropertyChanged;
    private void OnPropertyChanged(string name) =>
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
}
```

---

## Advanced Trade-offs

**Q: What do you lose if you over-abstract Clean Architecture in a small app?**

A: You add unnecessary layers, projects, and interfaces that slow delivery and make debugging harder without real benefits.

---

**Q: How do you avoid a shared kernel becoming a dependency sink in DDD?**

A: Keep the shared kernel tiny and stable, focused only on truly shared concepts (e.g., Money, Currency). Everything else stays in each bounded context.

---

## Trading Scenario

**Q: Your team wants to add a new pricing rule without touching API controllers. Where should the change go in Clean Architecture?**

A: Inside the Domain (entity or domain service) or Application (use case orchestration) layer, never in the API layer.

---

**Total Exercises:** 10+
