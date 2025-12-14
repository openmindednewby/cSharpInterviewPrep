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

---

## Questions & Answers

**Q: When is AutoMapper a good fit vs hand-written mapping?**

A: Use AutoMapper when mappings are mostly 1:1 and you want centralized profiles plus query projections. If mappings involve conditional branching, heavy domain logic, or large object graphs where clarity matters, hand-written mapping is safer.

**Q: How do profiles improve maintainability?**

A: Profiles group mapping configuration per aggregate or feature, keeping conventions together and discoverable. They can be scanned automatically via `AddAutoMapper`, ensuring new mappings only require adding a profile class.

**Q: What’s the benefit of `.ProjectTo<T>()` with EF Core?**

A: It translates mapping expressions into SQL so the database returns DTO-shaped data directly, eliminating extra materialization and reducing memory usage in the API layer.

**Q: How do you customize property names that don’t match?**

A: Use `.ForMember(dest => dest.Property, opt => opt.MapFrom(src => src.OtherName))` or `.ForPath` for nested members. AutoMapper falls back to conventions for matching names but explicit configuration handles mismatches cleanly.

**Q: How do you avoid runtime mapping errors?**

A: Call `mapper.ConfigurationProvider.AssertConfigurationIsValid()` during startup/tests, and enable `CreateMissingTypeMaps = false` so AutoMapper throws configuration errors early.

**Q: What are best practices for DI registration?**

A: Register profiles via `services.AddAutoMapper(typeof(SomeProfile))` or assembly scanning. Inject `IMapper` where needed; avoid static mapper instances so you respect scoped dependencies in custom value resolvers.

**Q: How do you handle mapping collections efficiently?**

A: Map queryables using `.ProjectTo<T>()` to avoid per-item mapping in memory. For in-memory collections, `IMapper.Map<IEnumerable<Dest>>(source)` reuses configuration and executes efficiently without additional setup.

**Q: Can AutoMapper handle complex value conversions like formatting currency?**

A: Yes, via `ForMember(...).ConvertUsing(...)`, custom value resolvers, or type converters. Keep heavy logic in domain services; use converters for presentation formatting or simple transforms (e.g., decimal to string).

**Q: How do you map inheritance hierarchies?**

A: Configure `Include`/`IncludeBase` to map derived types and ensure discriminators map to correct DTOs. AutoMapper can project derived types so long as the EF model supports it.

**Q: How do you test mappings?**

A: Instantiate the mapper configuration in tests, call `AssertConfigurationIsValid()`, and perform sample `Map`/`ProjectTo` calls on fixture data to ensure custom resolvers behave as intended.
