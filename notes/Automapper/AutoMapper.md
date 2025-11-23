# 🔁 AutoMapper — Mapping DTOs and Domain Models

> AutoMapper reduces boilerplate mapping code by convention-based configuration.

---

AutoMapper is a popular .NET library for mapping between objects (for example, between DTOs and domain models). It favors convention over configuration but allows explicit mapping where needed.

### ✅ Why use AutoMapper

- Reduces repetitive property-to-property assignment code.
- Centralizes mapping rules in `Profile` classes.
- Supports projection (e.g., `.ProjectTo<T>()`) for efficient queries with LINQ providers.

---

### 🧩 Example — DTO ↔ Domain mapping with a Profile

```csharp
public class Order
{
    public int Id { get; set; }
    public string Symbol { get; set; }
    public decimal Amount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class OrderDto
{
    public int Id { get; set; }
    public string Symbol { get; set; }
    public decimal Amount { get; set; }
}

public class OrderProfile : Profile
{
    public OrderProfile()
    {
        // Simple convention-based mapping
        CreateMap<Order, OrderDto>();

        // Reverse map if you want to convert back
        CreateMap<OrderDto, Order>();

        // Custom mapping example
        CreateMap<Order, OrderViewModel>()
            .ForMember(dest => dest.DisplayAmount, opt => opt.MapFrom(src => $"{src.Amount:C}"));
    }
}
```

---

### DI registration (ASP.NET Core)

```csharp
// Program.cs / Startup.cs
services.AddAutoMapper(typeof(OrderProfile));

// or scan the assembly
services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
```

AutoMapper will discover `Profile` classes and register `IMapper` in the DI container.

---

### Usage examples

```csharp
public class OrdersController : ControllerBase
{
    private readonly IMapper _mapper;
    public OrdersController(IMapper mapper) => _mapper = mapper;

    [HttpGet("{id}")]
    public ActionResult<OrderDto> Get(int id)
    {
        var order = _repo.Get(id); // domain model
        var dto = _mapper.Map<OrderDto>(order);
        return Ok(dto);
    }

    [HttpPost]
    public ActionResult Create(OrderDto dto)
    {
        var order = _mapper.Map<Order>(dto);
        _repo.Save(order);
        return CreatedAtAction(nameof(Get), new { id = order.Id }, null);
    }
}
```

Projection example (Entity Framework Core):

```csharp
var dtos = dbContext.Orders
    .Where(o => o.Amount > 1000)
    .ProjectTo<OrderDto>(configuration) // translates to SQL-select projection
    .ToList();
```

---

### Tips & caveats

- AutoMapper is best when mapping mostly 1:1 properties; for complex mappings consider manual mapping to keep intent explicit.
- Avoid mapping heavy domain logic — prefer mapping for DTOs/view models only.
- For performance-critical hot-paths, measure the overhead; `.ProjectTo<T>()` reduces materialization overhead for queries.
- Keep `Profile` classes small and focused (e.g., `OrderProfile`, `UserProfile`).

---

If you want, I can add a short `README.md` showing how to add the NuGet package and include a minimal `Program.cs` example wiring AutoMapper in an ASP.NET Core app.
