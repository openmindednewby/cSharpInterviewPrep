// Auto-generated flash card data from notes/ and practice/ folders
// Generated on: 2025-12-20T13:21:11.465Z
// Total cards: 1027 (512 Q&A, 453 sections, 62 concepts)

window.FLASH_CARD_DATA = [
  {
    "question": "When is AutoMapper a good fit vs hand-written mapping?",
    "answer": [
      {
        "type": "text",
        "content": "Use AutoMapper when mappings are mostly 1:1 and you want centralized profiles plus query projections. If mappings involve conditional branching, heavy domain logic, or large object graphs where clarity matters, hand-written mapping is safer."
      }
    ],
    "category": "notes",
    "topic": "Automapper",
    "source": "notes/Automapper/AutoMapper.md",
    "id": "card-1"
  },
  {
    "question": "How do profiles improve maintainability?",
    "answer": [
      {
        "type": "text",
        "content": "Profiles group mapping configuration per aggregate or feature, keeping conventions together and discoverable. They can be scanned automatically via AddAutoMapper, ensuring new mappings only require adding a profile class."
      }
    ],
    "category": "notes",
    "topic": "Automapper",
    "source": "notes/Automapper/AutoMapper.md",
    "id": "card-2"
  },
  {
    "question": "What’s the benefit of .ProjectTo<T>() with EF Core?",
    "answer": [
      {
        "type": "text",
        "content": "It translates mapping expressions into SQL so the database returns DTO-shaped data directly, eliminating extra materialization and reducing memory usage in the API layer."
      }
    ],
    "category": "notes",
    "topic": "Automapper",
    "source": "notes/Automapper/AutoMapper.md",
    "id": "card-3"
  },
  {
    "question": "How do you customize property names that don’t match?",
    "answer": [
      {
        "type": "text",
        "content": "Use .ForMember(dest => dest.Property, opt => opt.MapFrom(src => src.OtherName)) or .ForPath for nested members. AutoMapper falls back to conventions for matching names but explicit configuration handles mismatches cleanly."
      }
    ],
    "category": "notes",
    "topic": "Automapper",
    "source": "notes/Automapper/AutoMapper.md",
    "id": "card-4"
  },
  {
    "question": "How do you avoid runtime mapping errors?",
    "answer": [
      {
        "type": "text",
        "content": "Call mapper.ConfigurationProvider.AssertConfigurationIsValid() during startup/tests, and enable CreateMissingTypeMaps = false so AutoMapper throws configuration errors early."
      }
    ],
    "category": "notes",
    "topic": "Automapper",
    "source": "notes/Automapper/AutoMapper.md",
    "id": "card-5"
  },
  {
    "question": "What are best practices for DI registration?",
    "answer": [
      {
        "type": "text",
        "content": "Register profiles via services.AddAutoMapper(typeof(SomeProfile)) or assembly scanning. Inject IMapper where needed; avoid static mapper instances so you respect scoped dependencies in custom value resolvers."
      }
    ],
    "category": "notes",
    "topic": "Automapper",
    "source": "notes/Automapper/AutoMapper.md",
    "id": "card-6"
  },
  {
    "question": "How do you handle mapping collections efficiently?",
    "answer": [
      {
        "type": "text",
        "content": "Map queryables using .ProjectTo<T>() to avoid per-item mapping in memory. For in-memory collections, IMapper.Map<IEnumerable<Dest>>(source) reuses configuration and executes efficiently without additional setup."
      }
    ],
    "category": "notes",
    "topic": "Automapper",
    "source": "notes/Automapper/AutoMapper.md",
    "id": "card-7"
  },
  {
    "question": "Can AutoMapper handle complex value conversions like formatting currency?",
    "answer": [
      {
        "type": "text",
        "content": "Yes, via ForMember(...).ConvertUsing(...), custom value resolvers, or type converters. Keep heavy logic in domain services; use converters for presentation formatting or simple transforms (e.g., decimal to string)."
      }
    ],
    "category": "notes",
    "topic": "Automapper",
    "source": "notes/Automapper/AutoMapper.md",
    "id": "card-8"
  },
  {
    "question": "How do you map inheritance hierarchies?",
    "answer": [
      {
        "type": "text",
        "content": "Configure Include/IncludeBase to map derived types and ensure discriminators map to correct DTOs. AutoMapper can project derived types so long as the EF model supports it."
      }
    ],
    "category": "notes",
    "topic": "Automapper",
    "source": "notes/Automapper/AutoMapper.md",
    "id": "card-9"
  },
  {
    "question": "How do you test mappings?",
    "answer": [
      {
        "type": "text",
        "content": "Instantiate the mapper configuration in tests, call AssertConfigurationIsValid(), and perform sample Map/ProjectTo calls on fixture data to ensure custom resolvers behave as intended."
      }
    ],
    "category": "notes",
    "topic": "Automapper",
    "source": "notes/Automapper/AutoMapper.md",
    "id": "card-10"
  },
  {
    "question": "✅ Why use AutoMapper",
    "answer": [
      {
        "type": "list",
        "items": [
          "Reduces repetitive property-to-property assignment code.",
          "Centralizes mapping rules in Profile classes.",
          "Supports projection (e.g., .ProjectTo<T>()) for efficient queries with LINQ providers."
        ]
      }
    ],
    "category": "notes",
    "topic": "Automapper",
    "source": "notes/Automapper/AutoMapper.md",
    "isSection": true,
    "id": "card-11"
  },
  {
    "question": "🧩 Example — DTO ↔ Domain mapping with a Profile",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class Order\n{\n    public int Id { get; set; }\n    public string Symbol { get; set; }\n    public decimal Amount { get; set; }\n    public DateTime CreatedAt { get; set; }\n}\n\npublic class OrderDto\n{\n    public int Id { get; set; }\n    public string Symbol { get; set; }\n    public decimal Amount { get; set; }\n}\n\npublic class OrderProfile : Profile\n{\n    public OrderProfile()\n    {\n        // Simple convention-based mapping\n        CreateMap<Order, OrderDto>();\n\n        // Reverse map if you want to convert back\n        CreateMap<OrderDto, Order>();\n\n        // Custom mapping example\n        CreateMap<Order, OrderViewModel>()\n            .ForMember(dest => dest.DisplayAmount, opt => opt.MapFrom(src => $\"{src.Amount:C}\"));\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Automapper",
    "source": "notes/Automapper/AutoMapper.md",
    "isSection": true,
    "id": "card-12"
  },
  {
    "question": "DI registration (ASP.NET Core)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// Program.cs / Startup.cs\nservices.AddAutoMapper(typeof(OrderProfile));\n\n// or scan the assembly\nservices.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "AutoMapper will discover Profile classes and register IMapper in the DI container."
      }
    ],
    "category": "notes",
    "topic": "Automapper",
    "source": "notes/Automapper/AutoMapper.md",
    "isSection": true,
    "id": "card-13"
  },
  {
    "question": "Usage examples",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrdersController : ControllerBase\n{\n    private readonly IMapper _mapper;\n    public OrdersController(IMapper mapper) => _mapper = mapper;\n\n    [HttpGet(\"{id}\")]\n    public ActionResult<OrderDto> Get(int id)\n    {\n        var order = _repo.Get(id); // domain model\n        var dto = _mapper.Map<OrderDto>(order);\n        return Ok(dto);\n    }\n\n    [HttpPost]\n    public ActionResult Create(OrderDto dto)\n    {\n        var order = _mapper.Map<Order>(dto);\n        _repo.Save(order);\n        return CreatedAtAction(nameof(Get), new { id = order.Id }, null);\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Projection example (Entity Framework Core):"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var dtos = dbContext.Orders\n    .Where(o => o.Amount > 1000)\n    .ProjectTo<OrderDto>(configuration) // translates to SQL-select projection\n    .ToList();",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Automapper",
    "source": "notes/Automapper/AutoMapper.md",
    "isSection": true,
    "id": "card-14"
  },
  {
    "question": "Tips & caveats",
    "answer": [
      {
        "type": "list",
        "items": [
          "AutoMapper is best when mapping mostly 1:1 properties; for complex mappings consider manual mapping to keep intent explicit.",
          "Avoid mapping heavy domain logic — prefer mapping for DTOs/view models only.",
          "For performance-critical hot-paths, measure the overhead; .ProjectTo<T>() reduces materialization overhead for queries.",
          "Keep Profile classes small and focused (e.g., OrderProfile, UserProfile)."
        ]
      }
    ],
    "category": "notes",
    "topic": "Automapper",
    "source": "notes/Automapper/AutoMapper.md",
    "isSection": true,
    "id": "card-15"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: Use AutoMapper when mappings are mostly 1:1 and you want centralized profiles plus query projections. If mappings involve conditional branching, heavy domain logic, or large object graphs where clarity matters, hand-written mapping is safer."
      },
      {
        "type": "text",
        "content": "A: Profiles group mapping configuration per aggregate or feature, keeping conventions together and discoverable. They can be scanned automatically via AddAutoMapper, ensuring new mappings only require adding a profile class."
      },
      {
        "type": "text",
        "content": "A: It translates mapping expressions into SQL so the database returns DTO-shaped data directly, eliminating extra materialization and reducing memory usage in the API layer."
      },
      {
        "type": "text",
        "content": "A: Use .ForMember(dest => dest.Property, opt => opt.MapFrom(src => src.OtherName)) or .ForPath for nested members. AutoMapper falls back to conventions for matching names but explicit configuration handles mismatches cleanly."
      },
      {
        "type": "text",
        "content": "A: Call mapper.ConfigurationProvider.AssertConfigurationIsValid() during startup/tests, and enable CreateMissingTypeMaps = false so AutoMapper throws configuration errors early."
      },
      {
        "type": "text",
        "content": "A: Register profiles via services.AddAutoMapper(typeof(SomeProfile)) or assembly scanning. Inject IMapper where needed; avoid static mapper instances so you respect scoped dependencies in custom value resolvers."
      },
      {
        "type": "text",
        "content": "A: Map queryables using .ProjectTo<T>() to avoid per-item mapping in memory. For in-memory collections, IMapper.Map<IEnumerable<Dest>>(source) reuses configuration and executes efficiently without additional setup."
      },
      {
        "type": "text",
        "content": "A: Yes, via ForMember(...).ConvertUsing(...), custom value resolvers, or type converters. Keep heavy logic in domain services; use converters for presentation formatting or simple transforms (e.g., decimal to string)."
      },
      {
        "type": "text",
        "content": "A: Configure Include/IncludeBase to map derived types and ensure discriminators map to correct DTOs. AutoMapper can project derived types so long as the EF model supports it."
      },
      {
        "type": "text",
        "content": "A: Instantiate the mapper configuration in tests, call AssertConfigurationIsValid(), and perform sample Map/ProjectTo calls on fixture data to ensure custom resolvers behave as intended."
      }
    ],
    "category": "notes",
    "topic": "Automapper",
    "source": "notes/Automapper/AutoMapper.md",
    "isSection": true,
    "id": "card-16"
  },
  {
    "question": "Why does Big O matter for senior engineers?",
    "answer": [
      {
        "type": "text",
        "content": "Understanding complexity lets you predict scalability. A trading system processing millions of ticks can't afford O(n²) algorithms. Big O guides data structure choices and identifies bottlenecks before production."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/index.md",
    "id": "card-17"
  },
  {
    "question": "How does Big O relate to real-world performance?",
    "answer": [
      {
        "type": "text",
        "content": "Big O describes growth rate, not absolute speed. O(n) with 1000 operations might beat O(1) with 100 operations for small n. Always profile, but use Big O to predict scaling behavior."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/index.md",
    "id": "card-18"
  },
  {
    "question": "What's the difference between time and space complexity?",
    "answer": [
      {
        "type": "text",
        "content": "Time complexity measures computational steps; space complexity measures memory usage. Some algorithms trade space for speed (caching, hash tables) or vice versa (in-place sorting)."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/index.md",
    "id": "card-19"
  },
  {
    "question": "How do you measure Big O for LINQ queries?",
    "answer": [
      {
        "type": "text",
        "content": "Depends on the operation and underlying collection. .Where() on IEnumerable<T> is O(n), .First() is O(1) on IList<T> but O(n) on IEnumerable<T>. Know your data structures."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/index.md",
    "id": "card-20"
  },
  {
    "question": "Can Big O help with database queries?",
    "answer": [
      {
        "type": "text",
        "content": "Yes. Missing indexes turn O(1) lookups into O(n) table scans. JOIN operations, sorting, and aggregations have complexity costs. Use execution plans to identify O(n²) nested loops."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/index.md",
    "id": "card-21"
  },
  {
    "question": "How does amortized complexity differ from worst-case?",
    "answer": [
      {
        "type": "text",
        "content": "Amortized spreads cost over many operations. List<T>.Add() is O(1) amortized (occasional resizing is O(n)), but worst-case for a single Add() is O(n). Most analyses use amortized for collections."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/index.md",
    "id": "card-22"
  },
  {
    "question": "What's the complexity of Dictionary<TKey, TValue> operations?",
    "answer": [
      {
        "type": "text",
        "content": "Average case: O(1) for Add, Remove, ContainsKey due to hashing. Worst case: O(n) if all keys hash to the same bucket (rare with good hash functions). EqualityComparer matters."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/index.md",
    "id": "card-23"
  },
  {
    "question": "How do you optimize O(n²) code?",
    "answer": [
      {
        "type": "text",
        "content": "Use hash sets for lookups (O(1) vs O(n)), sort then binary search (O(n log n) vs O(n²)), or use dictionaries to cache results. Avoid nested loops over the same dataset."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/index.md",
    "id": "card-24"
  },
  {
    "question": "What's the complexity of string concatenation in loops?",
    "answer": [
      {
        "type": "text",
        "content": "str += value in a loop is O(n²) because strings are immutable—each concat allocates a new string. Use StringBuilder for O(n) complexity."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/index.md",
    "id": "card-25"
  },
  {
    "question": "How does Big O apply to async/await?",
    "answer": [
      {
        "type": "text",
        "content": "Async doesn't change algorithmic complexity; it changes latency/throughput. Calling 1000 APIs sequentially is still O(n) time, but parallel execution (Task.WhenAll) improves wall-clock time, not Big O."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/index.md",
    "id": "card-26"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: Understanding complexity lets you predict scalability. A trading system processing millions of ticks can't afford O(n²) algorithms. Big O guides data structure choices and identifies bottlenecks before production."
      },
      {
        "type": "text",
        "content": "A: Big O describes growth rate, not absolute speed. O(n) with 1000 operations might beat O(1) with 100 operations for small n. Always profile, but use Big O to predict scaling behavior."
      },
      {
        "type": "text",
        "content": "A: Time complexity measures computational steps; space complexity measures memory usage. Some algorithms trade space for speed (caching, hash tables) or vice versa (in-place sorting)."
      },
      {
        "type": "text",
        "content": "A: Depends on the operation and underlying collection. .Where() on IEnumerable<T> is O(n), .First() is O(1) on IList<T> but O(n) on IEnumerable<T>. Know your data structures."
      },
      {
        "type": "text",
        "content": "A: Yes. Missing indexes turn O(1) lookups into O(n) table scans. JOIN operations, sorting, and aggregations have complexity costs. Use execution plans to identify O(n²) nested loops."
      },
      {
        "type": "text",
        "content": "A: Amortized spreads cost over many operations. List<T>.Add() is O(1) amortized (occasional resizing is O(n)), but worst-case for a single Add() is O(n). Most analyses use amortized for collections."
      },
      {
        "type": "text",
        "content": "A: Average case: O(1) for Add, Remove, ContainsKey due to hashing. Worst case: O(n) if all keys hash to the same bucket (rare with good hash functions). EqualityComparer matters."
      },
      {
        "type": "text",
        "content": "A: Use hash sets for lookups (O(1) vs O(n)), sort then binary search (O(n log n) vs O(n²)), or use dictionaries to cache results. Avoid nested loops over the same dataset."
      },
      {
        "type": "text",
        "content": "A: str += value in a loop is O(n²) because strings are immutable—each concat allocates a new string. Use StringBuilder for O(n) complexity."
      },
      {
        "type": "text",
        "content": "A: Async doesn't change algorithmic complexity; it changes latency/throughput. Calling 1000 APIs sequentially is still O(n) time, but parallel execution (Task.WhenAll) improves wall-clock time, not Big O."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/index.md",
    "isSection": true,
    "id": "card-27"
  },
  {
    "question": "Are all dictionary operations O(1)?",
    "answer": [
      {
        "type": "text",
        "content": "Average case yes, worst case O(n) if all keys hash to the same bucket. Good hash functions and load factor management keep this rare."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/O1-Constant-Time.md",
    "id": "card-28"
  },
  {
    "question": "What's the complexity of List<T>[index]?",
    "answer": [
      {
        "type": "text",
        "content": "O(1). Lists are backed by arrays, so indexing calculates memory address directly: baseAddress + (index * elementSize)."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/O1-Constant-Time.md",
    "id": "card-29"
  },
  {
    "question": "Is accessing a property O(1)?",
    "answer": [
      {
        "type": "text",
        "content": "Usually, if it's an auto-property or simple field access. But if the getter runs complex logic or queries a database, it could be O(n) or worse."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/O1-Constant-Time.md",
    "id": "card-30"
  },
  {
    "question": "What's the difference between O(1) and constant time?",
    "answer": [
      {
        "type": "text",
        "content": "They're the same. O(1) means constant time—the number of operations doesn't depend on input size."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/O1-Constant-Time.md",
    "id": "card-31"
  },
  {
    "question": "Can loops ever be O(1)?",
    "answer": [
      {
        "type": "text",
        "content": "Yes, if the loop count is fixed and doesn't depend on input size. For example, for (int i = 0; i < 10; i++) is O(1) even though it loops."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/O1-Constant-Time.md",
    "id": "card-32"
  },
  {
    "question": "What's the complexity of checking if a HashSet<T> contains an item?",
    "answer": [
      {
        "type": "text",
        "content": "O(1) average case. HashSet uses hashing, same as Dictionary. Worst case O(n) with hash collisions, but rare."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/O1-Constant-Time.md",
    "id": "card-33"
  },
  {
    "question": "Is StringBuilder.Append() O(1)?",
    "answer": [
      {
        "type": "text",
        "content": "Amortized O(1). Occasional resizing costs O(n), but averaged over many appends, each append is effectively O(1)."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/O1-Constant-Time.md",
    "id": "card-34"
  },
  {
    "question": "What's the complexity of getting List<T>.Count?",
    "answer": [
      {
        "type": "text",
        "content": "O(1). List<T> maintains a cached count that updates on Add/Remove, so accessing Count is just a field read."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/O1-Constant-Time.md",
    "id": "card-35"
  },
  {
    "question": "Can database queries be O(1)?",
    "answer": [
      {
        "type": "text",
        "content": "Yes, with proper indexing. A lookup by primary key or unique index is O(1) effectively (hash or B-tree root access). Without indexes, it's O(n)."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/O1-Constant-Time.md",
    "id": "card-36"
  },
  {
    "question": "What's the tradeoff for O(1) operations?",
    "answer": [
      {
        "type": "text",
        "content": "Often space. Dictionaries use more memory than lists. Caching enables O(1) reads but increases memory footprint. Balance time vs space based on requirements."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/O1-Constant-Time.md",
    "id": "card-37"
  },
  {
    "question": "❌ Bad example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderBook\n{\n    private List<Order> _orders = new();\n\n    public Order FindOrderById(int orderId)\n    {\n        // O(n) - must scan entire list\n        return _orders.FirstOrDefault(o => o.Id == orderId);\n    }\n}\n\n// Finding order in 1 million orders requires scanning all\nvar order = orderBook.FindOrderById(12345); // slow!",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Linear search scales poorly—doubling orders doubles search time."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/O1-Constant-Time.md",
    "isSection": true,
    "id": "card-38"
  },
  {
    "question": "✅ Good example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderBook\n{\n    private Dictionary<int, Order> _orders = new();\n\n    public Order FindOrderById(int orderId)\n    {\n        // O(1) - hash table lookup\n        _orders.TryGetValue(orderId, out var order);\n        return order;\n    }\n\n    public void AddOrder(Order order)\n    {\n        // O(1) - hash table insert\n        _orders[order.Id] = order;\n    }\n}\n\n// Finding order in 1 million orders is instant\nvar order = orderBook.FindOrderById(12345); // fast!",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 Dictionary uses hashing for O(1) lookups regardless of size."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/O1-Constant-Time.md",
    "isSection": true,
    "id": "card-39"
  },
  {
    "question": "🔥 Array indexing:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class PriceHistory\n{\n    private decimal[] _prices = new decimal[1000];\n\n    public decimal GetPriceAt(int index)\n    {\n        // O(1) - direct memory access\n        return _prices[index];\n    }\n\n    public void SetPriceAt(int index, decimal price)\n    {\n        // O(1) - direct memory write\n        _prices[index] = price;\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 Array indexing is O(1)—memory address is calculated directly."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/O1-Constant-Time.md",
    "isSection": true,
    "id": "card-40"
  },
  {
    "question": "🔥 Stack/Queue operations:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TradeQueue\n{\n    private Queue<Trade> _pendingTrades = new();\n\n    public void EnqueueTrade(Trade trade)\n    {\n        // O(1) - add to end\n        _pendingTrades.Enqueue(trade);\n    }\n\n    public Trade ProcessNextTrade()\n    {\n        // O(1) - remove from front\n        return _pendingTrades.Dequeue();\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 Queue operations are O(1) because they maintain head/tail pointers."
      },
      {
        "type": "text",
        "content": "💡 In trading systems:"
      },
      {
        "type": "list",
        "items": [
          "Use Dictionary<T> for order lookups by ID—critical for cancel/modify operations.",
          "Cache latest prices in arrays or dictionaries for O(1) access.",
          "Use HashSet<T> for duplicate detection during order validation."
        ]
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/O1-Constant-Time.md",
    "isSection": true,
    "id": "card-41"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: Average case yes, worst case O(n) if all keys hash to the same bucket. Good hash functions and load factor management keep this rare."
      },
      {
        "type": "text",
        "content": "A: O(1). Lists are backed by arrays, so indexing calculates memory address directly: baseAddress + (index * elementSize)."
      },
      {
        "type": "text",
        "content": "A: Usually, if it's an auto-property or simple field access. But if the getter runs complex logic or queries a database, it could be O(n) or worse."
      },
      {
        "type": "text",
        "content": "A: They're the same. O(1) means constant time—the number of operations doesn't depend on input size."
      },
      {
        "type": "text",
        "content": "A: Yes, if the loop count is fixed and doesn't depend on input size. For example, for (int i = 0; i < 10; i++) is O(1) even though it loops."
      },
      {
        "type": "text",
        "content": "A: O(1) average case. HashSet uses hashing, same as Dictionary. Worst case O(n) with hash collisions, but rare."
      },
      {
        "type": "text",
        "content": "A: Amortized O(1). Occasional resizing costs O(n), but averaged over many appends, each append is effectively O(1)."
      },
      {
        "type": "text",
        "content": "A: O(1). List<T> maintains a cached count that updates on Add/Remove, so accessing Count is just a field read."
      },
      {
        "type": "text",
        "content": "A: Yes, with proper indexing. A lookup by primary key or unique index is O(1) effectively (hash or B-tree root access). Without indexes, it's O(n)."
      },
      {
        "type": "text",
        "content": "A: Often space. Dictionaries use more memory than lists. Caching enables O(1) reads but increases memory footprint. Balance time vs space based on requirements."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/O1-Constant-Time.md",
    "isSection": true,
    "id": "card-42"
  },
  {
    "question": "O(1) — Constant Time",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderBook\n{\n    private List<Order> _orders = new();\n\n    public Order FindOrderById(int orderId)\n    {\n        // O(n) - must scan entire list\n        return _orders.FirstOrDefault(o => o.Id == orderId);\n    }\n}\n\n// Finding order in 1 million orders requires scanning all\nvar order = orderBook.FindOrderById(12345); // slow!",
        "codeType": "bad"
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/O1-Constant-Time.md",
    "isConcept": true,
    "id": "card-43"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderBook\n{\n    private Dictionary<int, Order> _orders = new();\n\n    public Order FindOrderById(int orderId)\n    {\n        // O(1) - hash table lookup\n        _orders.TryGetValue(orderId, out var order);\n        return order;\n    }\n\n    public void AddOrder(Order order)\n    {\n        // O(1) - hash table insert\n        _orders[order.Id] = order;\n    }\n}\n\n// Finding order in 1 million orders is instant\nvar order = orderBook.FindOrderById(12345); // fast!",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/O1-Constant-Time.md",
    "isConcept": true,
    "id": "card-44"
  },
  {
    "question": "Why is binary search O(log n)?",
    "answer": [
      {
        "type": "text",
        "content": "Each comparison eliminates half the remaining elements. For n=1,000,000: step 1 = 500,000, step 2 = 250,000, ..., step 20 = 1. That's log₂(1,000,000) ≈ 20 steps."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/OLogN-Logarithmic-Time.md",
    "id": "card-45"
  },
  {
    "question": "What data structures provide O(log n) operations?",
    "answer": [
      {
        "type": "text",
        "content": "Balanced trees (red-black, AVL), SortedSet<T>, SortedDictionary<T>, B-trees (database indexes), heaps (priority queues for min/max)."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/OLogN-Logarithmic-Time.md",
    "id": "card-46"
  },
  {
    "question": "Is SortedDictionary<T> better than Dictionary<T>?",
    "answer": [
      {
        "type": "text",
        "content": "Depends. Dictionary is O(1) average for lookup, SortedDictionary is O(log n). Use SortedDictionary when you need ordered keys or range queries."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/OLogN-Logarithmic-Time.md",
    "id": "card-47"
  },
  {
    "question": "What's the complexity of List<T>.BinarySearch()?",
    "answer": [
      {
        "type": "text",
        "content": "O(log n), but list must be sorted first. Sorting is O(n log n), so binary search only makes sense for multiple queries on static data."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/OLogN-Logarithmic-Time.md",
    "id": "card-48"
  },
  {
    "question": "How does O(log n) compare to O(1)?",
    "answer": [
      {
        "type": "text",
        "content": "O(1) is faster, but O(log n) is still very fast. log₂(1 billion) ≈ 30. For practical purposes, O(log n) scales well even for massive datasets."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/OLogN-Logarithmic-Time.md",
    "id": "card-49"
  },
  {
    "question": "Can O(log n) be better than O(1) in practice?",
    "answer": [
      {
        "type": "text",
        "content": "Rarely, but yes. SortedSet uses less memory than Dictionary for sparse data, and cache locality can make tree traversal competitive with hash table lookups."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/OLogN-Logarithmic-Time.md",
    "id": "card-50"
  },
  {
    "question": "What's the complexity of finding min/max in SortedSet<T>?",
    "answer": [
      {
        "type": "text",
        "content": "O(log n) for Min/Max. Internally it traverses left/right to leaf nodes. For frequent min/max, use a heap (O(1) peek, O(log n) removal)."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/OLogN-Logarithmic-Time.md",
    "id": "card-51"
  },
  {
    "question": "How does database indexing relate to O(log n)?",
    "answer": [
      {
        "type": "text",
        "content": "B-tree indexes enable O(log n) lookups. A table with 1 billion rows and a B-tree index (depth ~4) needs only 4 disk seeks for a lookup."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/OLogN-Logarithmic-Time.md",
    "id": "card-52"
  },
  {
    "question": "What's the difference between O(log n) and O(n)?",
    "answer": [
      {
        "type": "text",
        "content": "Massive. O(log n) for n=1,000,000 is ~20 steps. O(n) is 1,000,000 steps. Logarithmic algorithms scale dramatically better."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/OLogN-Logarithmic-Time.md",
    "id": "card-53"
  },
  {
    "question": "Can loops be O(log n)?",
    "answer": [
      {
        "type": "text",
        "content": "Yes, if the loop variable doubles/halves each iteration. Example: for (int i = 1; i < n; i *= 2) runs log₂(n) times."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/OLogN-Logarithmic-Time.md",
    "id": "card-54"
  },
  {
    "question": "❌ Bad example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class PriceLookup\n{\n    private List<PriceLevel> _prices = new(); // unsorted\n\n    public decimal FindPriceNearTarget(decimal target)\n    {\n        // O(n) - must check every price\n        return _prices\n            .Select(p => p.Price)\n            .OrderBy(p => Math.Abs(p - target))\n            .First();\n    }\n}\n\n// Searching 1 million prices requires checking all\nvar price = lookup.FindPriceNearTarget(150.00m);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Linear search doesn't exploit any structure—wasteful for large datasets."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/OLogN-Logarithmic-Time.md",
    "isSection": true,
    "id": "card-55"
  },
  {
    "question": "✅ Good example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class PriceLookup\n{\n    private List<PriceLevel> _prices = new(); // sorted\n\n    public decimal FindPriceNearTarget(decimal target)\n    {\n        // O(log n) - binary search\n        int index = _prices.BinarySearch(new PriceLevel { Price = target });\n        if (index < 0) index = ~index; // insertion point\n\n        // Check nearby prices\n        return _prices[Math.Max(0, index - 1)].Price;\n    }\n\n    public void AddPrice(PriceLevel price)\n    {\n        int index = _prices.BinarySearch(price);\n        if (index < 0) index = ~index;\n        _prices.Insert(index, price); // O(n) insert, but search is O(log n)\n    }\n}\n\n// Searching 1 million sorted prices takes ~20 comparisons\nvar price = lookup.FindPriceNearTarget(150.00m);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 Binary search halves the search space each step: O(log₂ n)."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/OLogN-Logarithmic-Time.md",
    "isSection": true,
    "id": "card-56"
  },
  {
    "question": "🔥 SortedSet for automatic ordering:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderPriceIndex\n{\n    private SortedSet<decimal> _buyPrices = new();\n    private SortedSet<decimal> _sellPrices = new();\n\n    public void AddBuyOrder(decimal price)\n    {\n        // O(log n) - balanced tree insert\n        _buyPrices.Add(price);\n    }\n\n    public decimal GetBestBid()\n    {\n        // O(log n) - find max in tree\n        return _buyPrices.Max;\n    }\n\n    public IEnumerable<decimal> GetPricesInRange(decimal min, decimal max)\n    {\n        // O(log n + k) - where k is result count\n        return _buyPrices.GetViewBetween(min, max);\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 SortedSet (red-black tree) maintains order with O(log n) operations."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/OLogN-Logarithmic-Time.md",
    "isSection": true,
    "id": "card-57"
  },
  {
    "question": "🔥 Dictionary resizing:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TradeCache\n{\n    // Dictionary internal resizing is O(n), but happens O(log n) times\n    // as capacity doubles: 4, 8, 16, 32, 64...\n    private Dictionary<int, Trade> _trades = new();\n\n    public void AddTrade(Trade trade)\n    {\n        // Amortized O(1), but understanding the log n resize pattern is key\n        _trades[trade.Id] = trade;\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 Doubling strategy means O(log n) resizes over n insertions."
      },
      {
        "type": "text",
        "content": "💡 In trading systems:"
      },
      {
        "type": "list",
        "items": [
          "Use binary search for finding price levels in sorted order books.",
          "SortedSet for maintaining best bid/ask with efficient range queries.",
          "B-tree indexes in databases provide O(log n) lookups for billions of records."
        ]
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/OLogN-Logarithmic-Time.md",
    "isSection": true,
    "id": "card-58"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: Each comparison eliminates half the remaining elements. For n=1,000,000: step 1 = 500,000, step 2 = 250,000, ..., step 20 = 1. That's log₂(1,000,000) ≈ 20 steps."
      },
      {
        "type": "text",
        "content": "A: Balanced trees (red-black, AVL), SortedSet<T>, SortedDictionary<T>, B-trees (database indexes), heaps (priority queues for min/max)."
      },
      {
        "type": "text",
        "content": "A: Depends. Dictionary is O(1) average for lookup, SortedDictionary is O(log n). Use SortedDictionary when you need ordered keys or range queries."
      },
      {
        "type": "text",
        "content": "A: O(log n), but list must be sorted first. Sorting is O(n log n), so binary search only makes sense for multiple queries on static data."
      },
      {
        "type": "text",
        "content": "A: O(1) is faster, but O(log n) is still very fast. log₂(1 billion) ≈ 30. For practical purposes, O(log n) scales well even for massive datasets."
      },
      {
        "type": "text",
        "content": "A: Rarely, but yes. SortedSet uses less memory than Dictionary for sparse data, and cache locality can make tree traversal competitive with hash table lookups."
      },
      {
        "type": "text",
        "content": "A: O(log n) for Min/Max. Internally it traverses left/right to leaf nodes. For frequent min/max, use a heap (O(1) peek, O(log n) removal)."
      },
      {
        "type": "text",
        "content": "A: B-tree indexes enable O(log n) lookups. A table with 1 billion rows and a B-tree index (depth ~4) needs only 4 disk seeks for a lookup."
      },
      {
        "type": "text",
        "content": "A: Massive. O(log n) for n=1,000,000 is ~20 steps. O(n) is 1,000,000 steps. Logarithmic algorithms scale dramatically better."
      },
      {
        "type": "text",
        "content": "A: Yes, if the loop variable doubles/halves each iteration. Example: for (int i = 1; i < n; i *= 2) runs log₂(n) times."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/OLogN-Logarithmic-Time.md",
    "isSection": true,
    "id": "card-59"
  },
  {
    "question": "O(log n) — Logarithmic Time",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class PriceLookup\n{\n    private List<PriceLevel> _prices = new(); // unsorted\n\n    public decimal FindPriceNearTarget(decimal target)\n    {\n        // O(n) - must check every price\n        return _prices\n            .Select(p => p.Price)\n            .OrderBy(p => Math.Abs(p - target))\n            .First();\n    }\n}\n\n// Searching 1 million prices requires checking all\nvar price = lookup.FindPriceNearTarget(150.00m);",
        "codeType": "bad"
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/OLogN-Logarithmic-Time.md",
    "isConcept": true,
    "id": "card-60"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class PriceLookup\n{\n    private List<PriceLevel> _prices = new(); // sorted\n\n    public decimal FindPriceNearTarget(decimal target)\n    {\n        // O(log n) - binary search\n        int index = _prices.BinarySearch(new PriceLevel { Price = target });\n        if (index < 0) index = ~index; // insertion point\n\n        // Check nearby prices\n        return _prices[Math.Max(0, index - 1)].Price;\n    }\n\n    public void AddPrice(PriceLevel price)\n    {\n        int index = _prices.BinarySearch(price);\n        if (index < 0) index = ~index;\n        _prices.Insert(index, price); // O(n) insert, but search is O(log n)\n    }\n}\n\n// Searching 1 million sorted prices takes ~20 comparisons\nvar price = lookup.FindPriceNearTarget(150.00m);",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/OLogN-Logarithmic-Time.md",
    "isConcept": true,
    "id": "card-61"
  },
  {
    "question": "How can I optimize O(n) algorithms?",
    "answer": [
      {
        "type": "text",
        "content": "You often can't—some problems require checking every element. Focus on: (1) single pass instead of multiple, (2) early termination when possible, (3) parallel processing for independent work."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON-Linear-Time.md",
    "id": "card-62"
  },
  {
    "question": "Is foreach always O(n)?",
    "answer": [
      {
        "type": "text",
        "content": "Yes, foreach iterates through all elements once. Complexity is O(n) where n is the collection size."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON-Linear-Time.md",
    "id": "card-63"
  },
  {
    "question": "What's the difference between O(n) and O(2n)?",
    "answer": [
      {
        "type": "text",
        "content": "Same complexity class—O(2n) simplifies to O(n). Big O drops constants. But in practice, 2 passes vs 1 pass matters for performance."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON-Linear-Time.md",
    "id": "card-64"
  },
  {
    "question": "Are LINQ operations always O(n)?",
    "answer": [
      {
        "type": "text",
        "content": "Most are. Where, Select, Sum, Average, Any, All are O(n). But Count() on IEnumerable<T> is O(n), while Count on ICollection<T> is O(1)."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON-Linear-Time.md",
    "id": "card-65"
  },
  {
    "question": "Can O(n) be parallelized?",
    "answer": [
      {
        "type": "text",
        "content": "Yes. Parallel.ForEach or PLINQ can split O(n) work across cores, reducing wall-clock time. Algorithmic complexity stays O(n), but throughput improves."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON-Linear-Time.md",
    "id": "card-66"
  },
  {
    "question": "What's the complexity of Contains() on List<T>?",
    "answer": [
      {
        "type": "text",
        "content": "O(n). List<T>.Contains() must scan all elements. Use HashSet<T>.Contains() for O(1)."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON-Linear-Time.md",
    "id": "card-67"
  },
  {
    "question": "Is string concatenation in a loop O(n)?",
    "answer": [
      {
        "type": "text",
        "content": "No, it's O(n²). Each concat creates a new string, copying all previous chars. For n iterations: 1 + 2 + 3 + ... + n = O(n²). Use StringBuilder."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON-Linear-Time.md",
    "id": "card-68"
  },
  {
    "question": "What's the complexity of ToList() on IEnumerable<T>?",
    "answer": [
      {
        "type": "text",
        "content": "O(n). It iterates through all elements and copies them into a new List<T>."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON-Linear-Time.md",
    "id": "card-69"
  },
  {
    "question": "How does O(n) relate to database queries?",
    "answer": [
      {
        "type": "text",
        "content": "A table scan (no index) is O(n). Retrieving all rows, filtering in memory, or aggregating without indexes all scale linearly with row count."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON-Linear-Time.md",
    "id": "card-70"
  },
  {
    "question": "Can you turn O(n) into O(1)?",
    "answer": [
      {
        "type": "text",
        "content": "Sometimes, with preprocessing. Build a Dictionary (O(n) once), then lookups are O(1). Trade space for time, and upfront cost for faster queries."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON-Linear-Time.md",
    "id": "card-71"
  },
  {
    "question": "❌ Bad example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TradeAnalyzer\n{\n    public decimal CalculateAveragePrice(List<Trade> trades)\n    {\n        decimal sum = 0;\n        foreach (var trade in trades)\n        {\n            sum += trade.Price; // O(n)\n        }\n\n        decimal count = 0;\n        foreach (var trade in trades)\n        {\n            count++; // O(n) - unnecessary second pass\n        }\n\n        return sum / count;\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Two separate O(n) passes when one would suffice—wasted cycles."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON-Linear-Time.md",
    "isSection": true,
    "id": "card-72"
  },
  {
    "question": "✅ Good example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TradeAnalyzer\n{\n    public decimal CalculateAveragePrice(List<Trade> trades)\n    {\n        if (trades.Count == 0) return 0;\n\n        decimal sum = 0;\n        foreach (var trade in trades)\n        {\n            sum += trade.Price;\n        }\n\n        // O(1) - Count property is cached\n        return sum / trades.Count;\n    }\n\n    // Alternative LINQ (still O(n), more readable)\n    public decimal CalculateAveragePriceLINQ(List<Trade> trades)\n    {\n        return trades.Any() ? trades.Average(t => t.Price) : 0;\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 Single pass through data, use cached Count for O(1) access."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON-Linear-Time.md",
    "isSection": true,
    "id": "card-73"
  },
  {
    "question": "🔥 Filtering with Where:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderFilter\n{\n    public IEnumerable<Order> GetLargeOrders(IEnumerable<Order> orders, decimal threshold)\n    {\n        // O(n) - single pass when enumerated\n        return orders.Where(o => o.Amount > threshold);\n    }\n\n    public List<Order> GetLargeOrdersMaterialized(List<Order> orders, decimal threshold)\n    {\n        var result = new List<Order>();\n        foreach (var order in orders)\n        {\n            if (order.Amount > threshold)\n                result.Add(order); // O(1) amortized per Add\n        }\n        return result; // Total: O(n)\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 LINQ Where() is O(n) during enumeration—iterates once through all items."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON-Linear-Time.md",
    "isSection": true,
    "id": "card-74"
  },
  {
    "question": "🔥 Finding maximum:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class PriceTracker\n{\n    public decimal FindMaxPrice(decimal[] prices)\n    {\n        if (prices.Length == 0) throw new ArgumentException(\"Empty array\");\n\n        decimal max = prices[0];\n        for (int i = 1; i < prices.Length; i++)\n        {\n            if (prices[i] > max)\n                max = prices[i];\n        }\n        return max; // O(n) - must check every element\n    }\n\n    // LINQ alternative (same complexity)\n    public decimal FindMaxPriceLINQ(decimal[] prices)\n    {\n        return prices.Max(); // O(n)\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 Finding min/max in unsorted data requires checking every element."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON-Linear-Time.md",
    "isSection": true,
    "id": "card-75"
  },
  {
    "question": "🔥 String operations:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class SymbolValidator\n{\n    public bool IsValidSymbol(string symbol)\n    {\n        // O(n) - where n is symbol.Length\n        return symbol.All(c => char.IsLetterOrDigit(c));\n    }\n\n    public string FormatSymbol(string symbol)\n    {\n        // O(n) - creates new string with all chars uppercase\n        return symbol.ToUpper();\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 String operations typically iterate through all characters: O(n)."
      },
      {
        "type": "text",
        "content": "💡 In trading systems:"
      },
      {
        "type": "list",
        "items": [
          "Summing positions, calculating totals, or aggregating trades is O(n).",
          "Filtering orders by criteria (price, symbol, time) requires scanning all.",
          "Accept O(n) when necessary, but avoid repeated scans—combine operations."
        ]
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON-Linear-Time.md",
    "isSection": true,
    "id": "card-76"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: You often can't—some problems require checking every element. Focus on: (1) single pass instead of multiple, (2) early termination when possible, (3) parallel processing for independent work."
      },
      {
        "type": "text",
        "content": "A: Yes, foreach iterates through all elements once. Complexity is O(n) where n is the collection size."
      },
      {
        "type": "text",
        "content": "A: Same complexity class—O(2n) simplifies to O(n). Big O drops constants. But in practice, 2 passes vs 1 pass matters for performance."
      },
      {
        "type": "text",
        "content": "A: Most are. Where, Select, Sum, Average, Any, All are O(n). But Count() on IEnumerable<T> is O(n), while Count on ICollection<T> is O(1)."
      },
      {
        "type": "text",
        "content": "A: Yes. Parallel.ForEach or PLINQ can split O(n) work across cores, reducing wall-clock time. Algorithmic complexity stays O(n), but throughput improves."
      },
      {
        "type": "text",
        "content": "A: O(n). List<T>.Contains() must scan all elements. Use HashSet<T>.Contains() for O(1)."
      },
      {
        "type": "text",
        "content": "A: No, it's O(n²). Each concat creates a new string, copying all previous chars. For n iterations: 1 + 2 + 3 + ... + n = O(n²). Use StringBuilder."
      },
      {
        "type": "text",
        "content": "A: O(n). It iterates through all elements and copies them into a new List<T>."
      },
      {
        "type": "text",
        "content": "A: A table scan (no index) is O(n). Retrieving all rows, filtering in memory, or aggregating without indexes all scale linearly with row count."
      },
      {
        "type": "text",
        "content": "A: Sometimes, with preprocessing. Build a Dictionary (O(n) once), then lookups are O(1). Trade space for time, and upfront cost for faster queries."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON-Linear-Time.md",
    "isSection": true,
    "id": "card-77"
  },
  {
    "question": "O(n) — Linear Time",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TradeAnalyzer\n{\n    public decimal CalculateAveragePrice(List<Trade> trades)\n    {\n        decimal sum = 0;\n        foreach (var trade in trades)\n        {\n            sum += trade.Price; // O(n)\n        }\n\n        decimal count = 0;\n        foreach (var trade in trades)\n        {\n            count++; // O(n) - unnecessary second pass\n        }\n\n        return sum / count;\n    }\n}",
        "codeType": "bad"
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON-Linear-Time.md",
    "isConcept": true,
    "id": "card-78"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TradeAnalyzer\n{\n    public decimal CalculateAveragePrice(List<Trade> trades)\n    {\n        if (trades.Count == 0) return 0;\n\n        decimal sum = 0;\n        foreach (var trade in trades)\n        {\n            sum += trade.Price;\n        }\n\n        // O(1) - Count property is cached\n        return sum / trades.Count;\n    }\n\n    // Alternative LINQ (still O(n), more readable)\n    public decimal CalculateAveragePriceLINQ(List<Trade> trades)\n    {\n        return trades.Any() ? trades.Average(t => t.Price) : 0;\n    }\n}",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON-Linear-Time.md",
    "isConcept": true,
    "id": "card-79"
  },
  {
    "question": "How do I identify O(n²) code?",
    "answer": [
      {
        "type": "text",
        "content": "Look for nested loops over the same or related datasets. Patterns: for (i) { for (j) { ... } }, calling Contains() inside a loop on a List<T>."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON2-Quadratic-Time.md",
    "id": "card-80"
  },
  {
    "question": "Is O(n²) always bad?",
    "answer": [
      {
        "type": "text",
        "content": "Not always. For small datasets (n < 100), O(n²) is fine. Problems arise when n scales. Also, some algorithms (matrix multiplication) are inherently O(n²) or worse."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON2-Quadratic-Time.md",
    "id": "card-81"
  },
  {
    "question": "What's the difference between O(n²) and O(n * m)?",
    "answer": [
      {
        "type": "text",
        "content": "O(n * m) is two different inputs (e.g., matching buy vs sell orders). If n ≈ m, it's effectively O(n²). Still quadratic scaling."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON2-Quadratic-Time.md",
    "id": "card-82"
  },
  {
    "question": "Can LINQ cause O(n²)?",
    "answer": [
      {
        "type": "text",
        "content": "Yes. Using .Contains() on a List<T> inside a loop: list.Where(x => otherList.Contains(x)) is O(n * m). Convert otherList to HashSet<T> for O(n)."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON2-Quadratic-Time.md",
    "id": "card-83"
  },
  {
    "question": "What's the complexity of SelectMany with nested collections?",
    "answer": [
      {
        "type": "text",
        "content": "Depends on data. If each element has k sub-items, SelectMany is O(n * k). If k grows with n, it's O(n²)."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON2-Quadratic-Time.md",
    "id": "card-84"
  },
  {
    "question": "How can I refactor O(n²) to O(n)?",
    "answer": [
      {
        "type": "text",
        "content": "Common strategies: (1) Use HashSet for O(1) lookups instead of List, (2) Index data by key using Dictionary, (3) Sort then merge instead of nested loops."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON2-Quadratic-Time.md",
    "id": "card-85"
  },
  {
    "question": "What's the practical limit for O(n²)?",
    "answer": [
      {
        "type": "text",
        "content": "Depends on hardware and latency requirements. For n=1,000, O(n²) = 1 million ops (milliseconds). For n=10,000, O(n²) = 100 million ops (seconds). Avoid for n > 1,000."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON2-Quadratic-Time.md",
    "id": "card-86"
  },
  {
    "question": "Is bubble sort ever acceptable?",
    "answer": [
      {
        "type": "text",
        "content": "Only for teaching or nearly-sorted data with n < 10. Production code should use O(n log n) sorts (List<T>.Sort, OrderBy)."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON2-Quadratic-Time.md",
    "id": "card-87"
  },
  {
    "question": "What's the complexity of checking all pairs?",
    "answer": [
      {
        "type": "text",
        "content": "O(n²). For n items, there are n(n-1)/2 pairs. Simplifies to O(n²). This is unavoidable if all pairs must be examined."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON2-Quadratic-Time.md",
    "id": "card-88"
  },
  {
    "question": "Can parallelization help O(n²)?",
    "answer": [
      {
        "type": "text",
        "content": "It reduces wall-clock time but doesn't change algorithmic complexity. Parallel O(n²) is still O(n²)—better to fix the algorithm than throw cores at it."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON2-Quadratic-Time.md",
    "id": "card-89"
  },
  {
    "question": "❌ Bad example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class DuplicateDetector\n{\n    public List<Trade> FindDuplicateTrades(List<Trade> trades)\n    {\n        // O(n²) - nested loop comparing every pair\n        var duplicates = new List<Trade>();\n\n        for (int i = 0; i < trades.Count; i++)\n        {\n            for (int j = i + 1; j < trades.Count; j++)\n            {\n                if (trades[i].Id == trades[j].Id)\n                {\n                    duplicates.Add(trades[j]);\n                }\n            }\n        }\n\n        return duplicates;\n    }\n}\n\n// 10,000 trades = 50 million comparisons\n// 100,000 trades = 5 billion comparisons (system grinds to halt)",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Nested loops over same dataset—classic O(n²) antipattern."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON2-Quadratic-Time.md",
    "isSection": true,
    "id": "card-90"
  },
  {
    "question": "✅ Good example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class DuplicateDetector\n{\n    public List<Trade> FindDuplicateTrades(List<Trade> trades)\n    {\n        // O(n) - single pass with hash set\n        var seen = new HashSet<int>();\n        var duplicates = new List<Trade>();\n\n        foreach (var trade in trades)\n        {\n            if (!seen.Add(trade.Id)) // Add returns false if already exists\n            {\n                duplicates.Add(trade);\n            }\n        }\n\n        return duplicates;\n    }\n\n    // Alternative: find all duplicate groups\n    public Dictionary<int, List<Trade>> GroupDuplicates(List<Trade> trades)\n    {\n        // O(n) - group by ID\n        return trades\n            .GroupBy(t => t.Id)\n            .Where(g => g.Count() > 1)\n            .ToDictionary(g => g.Key, g => g.ToList());\n    }\n}\n\n// 100,000 trades = 100,000 operations (hash lookups)",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 HashSet eliminates nested loop—O(1) lookups reduce O(n²) to O(n)."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON2-Quadratic-Time.md",
    "isSection": true,
    "id": "card-91"
  },
  {
    "question": "🔥 Cartesian product (intentional O(n²)):",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class PairGenerator\n{\n    public List<(Order Buy, Order Sell)> GenerateAllPairs(List<Order> buyOrders, List<Order> sellOrders)\n    {\n        // O(n * m) - intentionally generating all combinations\n        var pairs = new List<(Order, Order)>();\n\n        foreach (var buy in buyOrders)\n        {\n            foreach (var sell in sellOrders)\n            {\n                if (buy.Symbol == sell.Symbol)\n                {\n                    pairs.Add((buy, sell));\n                }\n            }\n        }\n\n        return pairs;\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 Sometimes O(n²) is necessary (all pairs, matrix operations), but minimize data size."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON2-Quadratic-Time.md",
    "isSection": true,
    "id": "card-92"
  },
  {
    "question": "🔥 String concatenation in loops:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// ❌ O(n²) - avoid\npublic string BuildReport(List<Trade> trades)\n{\n    string report = \"\";\n    foreach (var trade in trades)\n    {\n        report += $\"{trade.Symbol},{trade.Price}\\n\"; // creates new string each iteration\n    }\n    return report;\n}\n\n// ✅ O(n) - use StringBuilder\npublic string BuildReportOptimized(List<Trade> trades)\n{\n    var sb = new StringBuilder();\n    foreach (var trade in trades)\n    {\n        sb.AppendLine($\"{trade.Symbol},{trade.Price}\"); // modifies buffer in-place\n    }\n    return sb.ToString();\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 String immutability makes concatenation O(n²)—use StringBuilder."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON2-Quadratic-Time.md",
    "isSection": true,
    "id": "card-93"
  },
  {
    "question": "🔥 Avoiding nested loops:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// ❌ O(n²) - finding matching orders\npublic List<(Order, Order)> MatchOrders(List<Order> buyOrders, List<Order> sellOrders)\n{\n    var matches = new List<(Order, Order)>();\n    foreach (var buy in buyOrders)\n    {\n        foreach (var sell in sellOrders) // nested loop\n        {\n            if (buy.Symbol == sell.Symbol && buy.Price >= sell.Price)\n            {\n                matches.Add((buy, sell));\n            }\n        }\n    }\n    return matches;\n}\n\n// ✅ O(n + m) - index by symbol first\npublic List<(Order, Order)> MatchOrdersOptimized(List<Order> buyOrders, List<Order> sellOrders)\n{\n    // O(n) - group sell orders by symbol\n    var sellsBySymbol = sellOrders\n        .GroupBy(o => o.Symbol)\n        .ToDictionary(g => g.Key, g => g.ToList());\n\n    var matches = new List<(Order, Order)>();\n\n    // O(n) - iterate buy orders and lookup matching sells\n    foreach (var buy in buyOrders)\n    {\n        if (sellsBySymbol.TryGetValue(buy.Symbol, out var sells))\n        {\n            foreach (var sell in sells.Where(s => buy.Price >= s.Price))\n            {\n                matches.Add((buy, sell));\n            }\n        }\n    }\n\n    return matches;\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 Index one collection to avoid scanning it repeatedly—reduces O(n * m) to O(n + m)."
      },
      {
        "type": "text",
        "content": "💡 In trading systems:"
      },
      {
        "type": "list",
        "items": [
          "Never use O(n²) for matching engines, order lookups, or real-time processing.",
          "Profile nested loops—if data grows, O(n²) becomes bottleneck.",
          "Use dictionaries, hash sets, or sorting to eliminate inner loops."
        ]
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON2-Quadratic-Time.md",
    "isSection": true,
    "id": "card-94"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: Look for nested loops over the same or related datasets. Patterns: for (i) { for (j) { ... } }, calling Contains() inside a loop on a List<T>."
      },
      {
        "type": "text",
        "content": "A: Not always. For small datasets (n < 100), O(n²) is fine. Problems arise when n scales. Also, some algorithms (matrix multiplication) are inherently O(n²) or worse."
      },
      {
        "type": "text",
        "content": "A: O(n * m) is two different inputs (e.g., matching buy vs sell orders). If n ≈ m, it's effectively O(n²). Still quadratic scaling."
      },
      {
        "type": "text",
        "content": "A: Yes. Using .Contains() on a List<T> inside a loop: list.Where(x => otherList.Contains(x)) is O(n * m). Convert otherList to HashSet<T> for O(n)."
      },
      {
        "type": "text",
        "content": "A: Depends on data. If each element has k sub-items, SelectMany is O(n * k). If k grows with n, it's O(n²)."
      },
      {
        "type": "text",
        "content": "A: Common strategies: (1) Use HashSet for O(1) lookups instead of List, (2) Index data by key using Dictionary, (3) Sort then merge instead of nested loops."
      },
      {
        "type": "text",
        "content": "A: Depends on hardware and latency requirements. For n=1,000, O(n²) = 1 million ops (milliseconds). For n=10,000, O(n²) = 100 million ops (seconds). Avoid for n > 1,000."
      },
      {
        "type": "text",
        "content": "A: Only for teaching or nearly-sorted data with n < 10. Production code should use O(n log n) sorts (List<T>.Sort, OrderBy)."
      },
      {
        "type": "text",
        "content": "A: O(n²). For n items, there are n(n-1)/2 pairs. Simplifies to O(n²). This is unavoidable if all pairs must be examined."
      },
      {
        "type": "text",
        "content": "A: It reduces wall-clock time but doesn't change algorithmic complexity. Parallel O(n²) is still O(n²)—better to fix the algorithm than throw cores at it."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON2-Quadratic-Time.md",
    "isSection": true,
    "id": "card-95"
  },
  {
    "question": "O(n²) — Quadratic Time",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class DuplicateDetector\n{\n    public List<Trade> FindDuplicateTrades(List<Trade> trades)\n    {\n        // O(n²) - nested loop comparing every pair\n        var duplicates = new List<Trade>();\n\n        for (int i = 0; i < trades.Count; i++)\n        {\n            for (int j = i + 1; j < trades.Count; j++)\n            {\n                if (trades[i].Id == trades[j].Id)\n                {\n                    duplicates.Add(trades[j]);\n                }\n            }\n        }\n\n        return duplicates;\n    }\n}\n\n// 10,000 trades = 50 million comparisons\n// 100,000 trades = 5 billion comparisons (system grinds to halt)",
        "codeType": "bad"
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON2-Quadratic-Time.md",
    "isConcept": true,
    "id": "card-96"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class DuplicateDetector\n{\n    public List<Trade> FindDuplicateTrades(List<Trade> trades)\n    {\n        // O(n) - single pass with hash set\n        var seen = new HashSet<int>();\n        var duplicates = new List<Trade>();\n\n        foreach (var trade in trades)\n        {\n            if (!seen.Add(trade.Id)) // Add returns false if already exists\n            {\n                duplicates.Add(trade);\n            }\n        }\n\n        return duplicates;\n    }\n\n    // Alternative: find all duplicate groups\n    public Dictionary<int, List<Trade>> GroupDuplicates(List<Trade> trades)\n    {\n        // O(n) - group by ID\n        return trades\n            .GroupBy(t => t.Id)\n            .Where(g => g.Count() > 1)\n            .ToDictionary(g => g.Key, g => g.ToList());\n    }\n}\n\n// 100,000 trades = 100,000 operations (hash lookups)",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ON2-Quadratic-Time.md",
    "isConcept": true,
    "id": "card-97"
  },
  {
    "question": "Why is sorting O(n log n) and not O(n)?",
    "answer": [
      {
        "type": "text",
        "content": "Comparison-based sorting requires at least n log n comparisons in the worst case. You must compare elements multiple times to establish order—proven lower bound."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ONLogN-Linearithmic-Time.md",
    "id": "card-98"
  },
  {
    "question": "What sorting algorithms are O(n log n)?",
    "answer": [
      {
        "type": "text",
        "content": "Mergesort, heapsort, quicksort (average case). C# List<T>.Sort() uses introsort (hybrid of quicksort, heapsort, insertion sort)."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ONLogN-Linearithmic-Time.md",
    "id": "card-99"
  },
  {
    "question": "Can sorting ever be faster than O(n log n)?",
    "answer": [
      {
        "type": "text",
        "content": "Yes, with non-comparison sorts for specific data: counting sort, radix sort, bucket sort can achieve O(n) if key range is limited."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ONLogN-Linearithmic-Time.md",
    "id": "card-100"
  },
  {
    "question": "What's the difference between O(n log n) and O(n²)?",
    "answer": [
      {
        "type": "text",
        "content": "Huge. For n=10,000: O(n log n) ≈ 133,000 operations, O(n²) = 100,000,000 operations. That's ~750x difference."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ONLogN-Linearithmic-Time.md",
    "id": "card-101"
  },
  {
    "question": "Is LINQ OrderBy() stable?",
    "answer": [
      {
        "type": "text",
        "content": "Yes. OrderBy() preserves relative order of equal elements. List<T>.Sort() is not stable by default (quicksort), but Array.Sort() uses stable algorithms for reference types."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ONLogN-Linearithmic-Time.md",
    "id": "card-102"
  },
  {
    "question": "What's the space complexity of sorting?",
    "answer": [
      {
        "type": "text",
        "content": "Depends. Mergesort is O(n) space, heapsort is O(1) space, quicksort is O(log n) space (recursion stack). List<T>.Sort() is in-place with O(log n) stack."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ONLogN-Linearithmic-Time.md",
    "id": "card-103"
  },
  {
    "question": "Can I sort in O(n) time?",
    "answer": [
      {
        "type": "text",
        "content": "Only with non-comparison sorts for specific data patterns (integers in small range, strings with limited prefixes). General comparison sorting is O(n log n) minimum."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ONLogN-Linearithmic-Time.md",
    "id": "card-104"
  },
  {
    "question": "What's the complexity of Distinct().OrderBy()?",
    "answer": [
      {
        "type": "text",
        "content": "Distinct() is O(n), OrderBy() is O(n log n), so combined is O(n log n). The dominant term wins."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ONLogN-Linearithmic-Time.md",
    "id": "card-105"
  },
  {
    "question": "How does database ORDER BY relate to O(n log n)?",
    "answer": [
      {
        "type": "text",
        "content": "Database sorts use similar algorithms. Unindexed ORDER BY requires sorting result set: O(n log n). Indexed columns can return sorted data without explicit sort."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ONLogN-Linearithmic-Time.md",
    "id": "card-106"
  },
  {
    "question": "Should I avoid sorting in hot paths?",
    "answer": [
      {
        "type": "text",
        "content": "If possible, yes. Maintain sorted invariants (SortedSet, insertion sort for streaming data) to avoid repeated O(n log n) sorts. Or cache sorted results."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ONLogN-Linearithmic-Time.md",
    "id": "card-107"
  },
  {
    "question": "❌ Bad example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TradeProcessor\n{\n    public List<Trade> SortTradesByPriceBubbleSort(List<Trade> trades)\n    {\n        // O(n²) - bubble sort, avoid in production\n        var sorted = new List<Trade>(trades);\n        for (int i = 0; i < sorted.Count; i++)\n        {\n            for (int j = 0; j < sorted.Count - 1; j++)\n            {\n                if (sorted[j].Price > sorted[j + 1].Price)\n                {\n                    var temp = sorted[j];\n                    sorted[j] = sorted[j + 1];\n                    sorted[j + 1] = temp;\n                }\n            }\n        }\n        return sorted;\n    }\n}\n\n// Sorting 10,000 trades: ~100 million comparisons",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Bubble sort is O(n²)—catastrophic for large datasets."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ONLogN-Linearithmic-Time.md",
    "isSection": true,
    "id": "card-108"
  },
  {
    "question": "✅ Good example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TradeProcessor\n{\n    public List<Trade> SortTradesByPrice(List<Trade> trades)\n    {\n        // O(n log n) - uses quicksort/introsort internally\n        return trades.OrderBy(t => t.Price).ToList();\n    }\n\n    public void SortTradesInPlace(List<Trade> trades)\n    {\n        // O(n log n) - sorts in-place, no allocation\n        trades.Sort((a, b) => a.Price.CompareTo(b.Price));\n    }\n\n    public List<Trade> SortByMultipleCriteria(List<Trade> trades)\n    {\n        // O(n log n) - LINQ stable sort\n        return trades\n            .OrderBy(t => t.Symbol)      // primary sort\n            .ThenBy(t => t.Timestamp)     // secondary sort\n            .ToList();\n    }\n}\n\n// Sorting 10,000 trades: ~133,000 comparisons (10,000 * log₂(10,000) ≈ 133K)",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 Built-in sorting uses optimized O(n log n) algorithms (quicksort, mergesort, heapsort)."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ONLogN-Linearithmic-Time.md",
    "isSection": true,
    "id": "card-109"
  },
  {
    "question": "🔥 Merge sorted sequences:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class MarketDataMerger\n{\n    public List<Trade> MergeSortedFeeds(List<Trade> feed1, List<Trade> feed2)\n    {\n        // O(n + m) - merge two sorted lists\n        var result = new List<Trade>(feed1.Count + feed2.Count);\n        int i = 0, j = 0;\n\n        while (i < feed1.Count && j < feed2.Count)\n        {\n            if (feed1[i].Timestamp <= feed2[j].Timestamp)\n                result.Add(feed1[i++]);\n            else\n                result.Add(feed2[j++]);\n        }\n\n        while (i < feed1.Count) result.Add(feed1[i++]);\n        while (j < feed2.Count) result.Add(feed2[j++]);\n\n        return result; // Total: O(n + m), but sorting feeds first was O(n log n)\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 Merging pre-sorted data is O(n), but initial sorting is O(n log n)."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ONLogN-Linearithmic-Time.md",
    "isSection": true,
    "id": "card-110"
  },
  {
    "question": "🔥 GroupBy with sorting:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderAnalyzer\n{\n    public Dictionary<string, List<Order>> GroupAndSortOrders(List<Order> orders)\n    {\n        // O(n log n) - grouping is O(n), but sorting within groups adds log n factor\n        return orders\n            .GroupBy(o => o.Symbol)\n            .ToDictionary(\n                g => g.Key,\n                g => g.OrderByDescending(o => o.Amount).ToList()\n            );\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 Combining O(n) operations with O(log n) sorting yields O(n log n)."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ONLogN-Linearithmic-Time.md",
    "isSection": true,
    "id": "card-111"
  },
  {
    "question": "🔥 Finding median (requires sorting):",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class StatisticsCalculator\n{\n    public decimal CalculateMedianPrice(List<Trade> trades)\n    {\n        if (trades.Count == 0) throw new ArgumentException(\"Empty list\");\n\n        // O(n log n) - must sort to find median\n        var sorted = trades.OrderBy(t => t.Price).ToList();\n\n        int mid = sorted.Count / 2;\n        if (sorted.Count % 2 == 0)\n            return (sorted[mid - 1].Price + sorted[mid].Price) / 2;\n        else\n            return sorted[mid].Price;\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 Median requires sorting—can't be computed in O(n) without specialized algorithms."
      },
      {
        "type": "text",
        "content": "💡 In trading systems:"
      },
      {
        "type": "list",
        "items": [
          "Sorting order books by price level is O(n log n) for unordered data.",
          "Aggregating and sorting daily trade summaries requires linearithmic time.",
          "Most real-world sorting problems are O(n log n)—optimal for comparison-based sorting."
        ]
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ONLogN-Linearithmic-Time.md",
    "isSection": true,
    "id": "card-112"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: Comparison-based sorting requires at least n log n comparisons in the worst case. You must compare elements multiple times to establish order—proven lower bound."
      },
      {
        "type": "text",
        "content": "A: Mergesort, heapsort, quicksort (average case). C# List<T>.Sort() uses introsort (hybrid of quicksort, heapsort, insertion sort)."
      },
      {
        "type": "text",
        "content": "A: Yes, with non-comparison sorts for specific data: counting sort, radix sort, bucket sort can achieve O(n) if key range is limited."
      },
      {
        "type": "text",
        "content": "A: Huge. For n=10,000: O(n log n) ≈ 133,000 operations, O(n²) = 100,000,000 operations. That's ~750x difference."
      },
      {
        "type": "text",
        "content": "A: Yes. OrderBy() preserves relative order of equal elements. List<T>.Sort() is not stable by default (quicksort), but Array.Sort() uses stable algorithms for reference types."
      },
      {
        "type": "text",
        "content": "A: Depends. Mergesort is O(n) space, heapsort is O(1) space, quicksort is O(log n) space (recursion stack). List<T>.Sort() is in-place with O(log n) stack."
      },
      {
        "type": "text",
        "content": "A: Only with non-comparison sorts for specific data patterns (integers in small range, strings with limited prefixes). General comparison sorting is O(n log n) minimum."
      },
      {
        "type": "text",
        "content": "A: Distinct() is O(n), OrderBy() is O(n log n), so combined is O(n log n). The dominant term wins."
      },
      {
        "type": "text",
        "content": "A: Database sorts use similar algorithms. Unindexed ORDER BY requires sorting result set: O(n log n). Indexed columns can return sorted data without explicit sort."
      },
      {
        "type": "text",
        "content": "A: If possible, yes. Maintain sorted invariants (SortedSet, insertion sort for streaming data) to avoid repeated O(n log n) sorts. Or cache sorted results."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ONLogN-Linearithmic-Time.md",
    "isSection": true,
    "id": "card-113"
  },
  {
    "question": "O(n log n) — Linearithmic Time",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TradeProcessor\n{\n    public List<Trade> SortTradesByPriceBubbleSort(List<Trade> trades)\n    {\n        // O(n²) - bubble sort, avoid in production\n        var sorted = new List<Trade>(trades);\n        for (int i = 0; i < sorted.Count; i++)\n        {\n            for (int j = 0; j < sorted.Count - 1; j++)\n            {\n                if (sorted[j].Price > sorted[j + 1].Price)\n                {\n                    var temp = sorted[j];\n                    sorted[j] = sorted[j + 1];\n                    sorted[j + 1] = temp;\n                }\n            }\n        }\n        return sorted;\n    }\n}\n\n// Sorting 10,000 trades: ~100 million comparisons",
        "codeType": "bad"
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ONLogN-Linearithmic-Time.md",
    "isConcept": true,
    "id": "card-114"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TradeProcessor\n{\n    public List<Trade> SortTradesByPrice(List<Trade> trades)\n    {\n        // O(n log n) - uses quicksort/introsort internally\n        return trades.OrderBy(t => t.Price).ToList();\n    }\n\n    public void SortTradesInPlace(List<Trade> trades)\n    {\n        // O(n log n) - sorts in-place, no allocation\n        trades.Sort((a, b) => a.Price.CompareTo(b.Price));\n    }\n\n    public List<Trade> SortByMultipleCriteria(List<Trade> trades)\n    {\n        // O(n log n) - LINQ stable sort\n        return trades\n            .OrderBy(t => t.Symbol)      // primary sort\n            .ThenBy(t => t.Timestamp)     // secondary sort\n            .ToList();\n    }\n}\n\n// Sorting 10,000 trades: ~133,000 comparisons (10,000 * log₂(10,000) ≈ 133K)",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/ONLogN-Linearithmic-Time.md",
    "isConcept": true,
    "id": "card-115"
  },
  {
    "question": "What's the difference between time and space complexity?",
    "answer": [
      {
        "type": "text",
        "content": "Time measures computational steps; space measures memory used. Some algorithms trade one for the other (caching uses space to save time)."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/Space-Complexity.md",
    "id": "card-116"
  },
  {
    "question": "Does O(1) space mean no memory allocation?",
    "answer": [
      {
        "type": "text",
        "content": "No. O(1) means constant memory regardless of input size. A few variables or a fixed-size buffer is O(1), even if it allocates."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/Space-Complexity.md",
    "id": "card-117"
  },
  {
    "question": "What's the space complexity of LINQ queries?",
    "answer": [
      {
        "type": "text",
        "content": "Depends. Deferred queries (Where, Select) are O(1) until materialized. ToList() is O(n). OrderBy() allocates O(n) for sorting."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/Space-Complexity.md",
    "id": "card-118"
  },
  {
    "question": "How do I reduce space complexity?",
    "answer": [
      {
        "type": "text",
        "content": "(1) Use streaming instead of materializing, (2) Operate in-place when possible, (3) Reuse buffers with ArrayPool<T> or stackalloc."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/Space-Complexity.md",
    "id": "card-119"
  },
  {
    "question": "What's the space complexity of recursion?",
    "answer": [
      {
        "type": "text",
        "content": "O(d) where d is recursion depth. Each call adds a stack frame. Deep recursion can cause StackOverflowException—use iteration for unbounded depth."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/Space-Complexity.md",
    "id": "card-120"
  },
  {
    "question": "Can space complexity be negative?",
    "answer": [
      {
        "type": "text",
        "content": "No. O(0) doesn't exist. Minimum is O(1) (constant space for variables). Algorithms always use some memory."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/Space-Complexity.md",
    "id": "card-121"
  },
  {
    "question": "What's the space complexity of StringBuilder?",
    "answer": [
      {
        "type": "text",
        "content": "O(n) where n is the final string length. StringBuilder allocates a buffer and resizes as needed, but total space scales with content."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/Space-Complexity.md",
    "id": "card-122"
  },
  {
    "question": "How does GC relate to space complexity?",
    "answer": [
      {
        "type": "text",
        "content": "Space complexity measures peak memory. GC reclaims unused objects, but high allocation rates cause GC pressure. Minimize allocations in hot paths."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/Space-Complexity.md",
    "id": "card-123"
  },
  {
    "question": "What's ArrayPool<T> and when should I use it?",
    "answer": [
      {
        "type": "text",
        "content": "ArrayPool<T> reuses arrays to reduce allocations. Use for temporary buffers in high-frequency paths (parsing, serialization). Return arrays after use."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/Space-Complexity.md",
    "id": "card-124"
  },
  {
    "question": "How do I measure space complexity in practice?",
    "answer": [
      {
        "type": "text",
        "content": "Use profilers (dotMemory, PerfView) to track allocations. Look for O(n) growth in object count or heap size as input scales."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/Space-Complexity.md",
    "id": "card-125"
  },
  {
    "question": "❌ Bad example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TradeTransformer\n{\n    public List<Trade> FilterAndTransform(List<Trade> trades)\n    {\n        // O(n) space - creates 3 intermediate collections\n        var filtered = trades.Where(t => t.Amount > 1000).ToList();     // copy 1\n        var sorted = filtered.OrderBy(t => t.Price).ToList();           // copy 2\n        var projected = sorted.Select(t => new Trade\n        {\n            Id = t.Id,\n            Symbol = t.Symbol,\n            Price = t.Price * 1.05m\n        }).ToList();                                                     // copy 3\n\n        return projected; // 3 full copies in memory simultaneously\n    }\n}\n\n// Processing 1 million trades: ~3 million Trade objects in memory",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Multiple intermediate collections waste memory—especially bad for large datasets."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/Space-Complexity.md",
    "isSection": true,
    "id": "card-126"
  },
  {
    "question": "✅ Good example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TradeTransformer\n{\n    public IEnumerable<Trade> FilterAndTransform(IEnumerable<Trade> trades)\n    {\n        // O(1) space (excluding result) - streaming with deferred execution\n        return trades\n            .Where(t => t.Amount > 1000)          // no allocation\n            .OrderBy(t => t.Price)                // O(n) when enumerated\n            .Select(t => new Trade\n            {\n                Id = t.Id,\n                Symbol = t.Symbol,\n                Price = t.Price * 1.05m\n            });                                    // creates items on demand\n    }\n\n    // If materialization is needed, single allocation\n    public List<Trade> FilterAndTransformMaterialized(List<Trade> trades)\n    {\n        return trades\n            .Where(t => t.Amount > 1000)\n            .OrderBy(t => t.Price)\n            .Select(t => new Trade\n            {\n                Id = t.Id,\n                Symbol = t.Symbol,\n                Price = t.Price * 1.05m\n            })\n            .ToList(); // single allocation for result\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 LINQ deferred execution avoids intermediate collections—only final result is allocated."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/Space-Complexity.md",
    "isSection": true,
    "id": "card-127"
  },
  {
    "question": "🔥 In-place operations (O(1) space):",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class ArrayProcessor\n{\n    public void ReverseArray(int[] array)\n    {\n        // O(1) space - modifies in-place\n        int left = 0, right = array.Length - 1;\n        while (left < right)\n        {\n            int temp = array[left];\n            array[left] = array[right];\n            array[right] = temp;\n            left++;\n            right--;\n        }\n    }\n\n    public void SortInPlace(List<Trade> trades)\n    {\n        // O(log n) space - quicksort recursion stack\n        trades.Sort((a, b) => a.Price.CompareTo(b.Price));\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 In-place algorithms minimize memory allocation—critical for embedded systems or low-latency paths."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/Space-Complexity.md",
    "isSection": true,
    "id": "card-128"
  },
  {
    "question": "🔥 Trading space for time:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class PriceCache\n{\n    // O(n) space - cache all prices for O(1) lookups\n    private Dictionary<string, decimal> _priceCache = new();\n\n    public void LoadPrices(List<(string Symbol, decimal Price)> prices)\n    {\n        // O(n) space - store all prices\n        foreach (var (symbol, price) in prices)\n        {\n            _priceCache[symbol] = price;\n        }\n    }\n\n    public decimal GetPrice(string symbol)\n    {\n        // O(1) time - instant lookup\n        return _priceCache.TryGetValue(symbol, out var price) ? price : 0;\n    }\n}\n\n// Alternative: no cache, query each time\npublic class PriceLookupNoCache\n{\n    private List<(string Symbol, decimal Price)> _prices;\n\n    public decimal GetPrice(string symbol)\n    {\n        // O(1) space, but O(n) time - must scan list\n        return _prices.FirstOrDefault(p => p.Symbol == symbol).Price;\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 Caching uses O(n) space but reduces lookups from O(n) to O(1) time."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/Space-Complexity.md",
    "isSection": true,
    "id": "card-129"
  },
  {
    "question": "🔥 Recursive space complexity:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TreeProcessor\n{\n    public int CalculateDepth(TreeNode node)\n    {\n        // O(h) space - recursion stack depth\n        // h = tree height (log n for balanced, n for skewed)\n        if (node == null) return 0;\n\n        return 1 + Math.Max(\n            CalculateDepth(node.Left),\n            CalculateDepth(node.Right)\n        );\n    }\n\n    // Iterative alternative - explicit stack\n    public int CalculateDepthIterative(TreeNode root)\n    {\n        // O(h) space - explicit stack\n        if (root == null) return 0;\n\n        var stack = new Stack<(TreeNode Node, int Depth)>();\n        stack.Push((root, 1));\n        int maxDepth = 0;\n\n        while (stack.Count > 0)\n        {\n            var (node, depth) = stack.Pop();\n            maxDepth = Math.Max(maxDepth, depth);\n\n            if (node.Left != null) stack.Push((node.Left, depth + 1));\n            if (node.Right != null) stack.Push((node.Right, depth + 1));\n        }\n\n        return maxDepth;\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 Recursion uses call stack—O(h) where h is recursion depth."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/Space-Complexity.md",
    "isSection": true,
    "id": "card-130"
  },
  {
    "question": "🔥 Avoiding memory leaks:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class EventProcessor\n{\n    // ❌ Bad: event handlers create memory leaks\n    public void ProcessEvents(IEventSource source)\n    {\n        source.OnEvent += (s, e) => HandleEvent(e); // captures 'this', prevents GC\n    }\n\n    // ✅ Good: explicit unsubscribe\n    public void ProcessEventsCorrectly(IEventSource source)\n    {\n        EventHandler<Event> handler = (s, e) => HandleEvent(e);\n        source.OnEvent += handler;\n\n        // Later: unsubscribe\n        source.OnEvent -= handler;\n    }\n\n    // ✅ Alternative: weak references for long-lived publishers\n    public void ProcessEventsWeak(IEventSource source)\n    {\n        var weakHandler = new WeakEventHandler(this, source);\n    }\n\n    private void HandleEvent(Event e) { /* ... */ }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 Unmanaged subscriptions create unbounded space growth—always clean up."
      },
      {
        "type": "text",
        "content": "💡 In trading systems:"
      },
      {
        "type": "list",
        "items": [
          "Use streaming (IEnumerable<T>) for large result sets to avoid loading everything.",
          "Cache frequently accessed reference data (symbols, limits) for O(1) access.",
          "Profile memory with tools—identify allocations in hot paths causing GC pressure."
        ]
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/Space-Complexity.md",
    "isSection": true,
    "id": "card-131"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: Time measures computational steps; space measures memory used. Some algorithms trade one for the other (caching uses space to save time)."
      },
      {
        "type": "text",
        "content": "A: No. O(1) means constant memory regardless of input size. A few variables or a fixed-size buffer is O(1), even if it allocates."
      },
      {
        "type": "text",
        "content": "A: Depends. Deferred queries (Where, Select) are O(1) until materialized. ToList() is O(n). OrderBy() allocates O(n) for sorting."
      },
      {
        "type": "text",
        "content": "A: (1) Use streaming instead of materializing, (2) Operate in-place when possible, (3) Reuse buffers with ArrayPool<T> or stackalloc."
      },
      {
        "type": "text",
        "content": "A: O(d) where d is recursion depth. Each call adds a stack frame. Deep recursion can cause StackOverflowException—use iteration for unbounded depth."
      },
      {
        "type": "text",
        "content": "A: No. O(0) doesn't exist. Minimum is O(1) (constant space for variables). Algorithms always use some memory."
      },
      {
        "type": "text",
        "content": "A: O(n) where n is the final string length. StringBuilder allocates a buffer and resizes as needed, but total space scales with content."
      },
      {
        "type": "text",
        "content": "A: Space complexity measures peak memory. GC reclaims unused objects, but high allocation rates cause GC pressure. Minimize allocations in hot paths."
      },
      {
        "type": "text",
        "content": "A: ArrayPool<T> reuses arrays to reduce allocations. Use for temporary buffers in high-frequency paths (parsing, serialization). Return arrays after use."
      },
      {
        "type": "text",
        "content": "A: Use profilers (dotMemory, PerfView) to track allocations. Look for O(n) growth in object count or heap size as input scales."
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/Space-Complexity.md",
    "isSection": true,
    "id": "card-132"
  },
  {
    "question": "Space Complexity — Memory Usage",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TradeTransformer\n{\n    public List<Trade> FilterAndTransform(List<Trade> trades)\n    {\n        // O(n) space - creates 3 intermediate collections\n        var filtered = trades.Where(t => t.Amount > 1000).ToList();     // copy 1\n        var sorted = filtered.OrderBy(t => t.Price).ToList();           // copy 2\n        var projected = sorted.Select(t => new Trade\n        {\n            Id = t.Id,\n            Symbol = t.Symbol,\n            Price = t.Price * 1.05m\n        }).ToList();                                                     // copy 3\n\n        return projected; // 3 full copies in memory simultaneously\n    }\n}\n\n// Processing 1 million trades: ~3 million Trade objects in memory",
        "codeType": "bad"
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/Space-Complexity.md",
    "isConcept": true,
    "id": "card-133"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TradeTransformer\n{\n    public IEnumerable<Trade> FilterAndTransform(IEnumerable<Trade> trades)\n    {\n        // O(1) space (excluding result) - streaming with deferred execution\n        return trades\n            .Where(t => t.Amount > 1000)          // no allocation\n            .OrderBy(t => t.Price)                // O(n) when enumerated\n            .Select(t => new Trade\n            {\n                Id = t.Id,\n                Symbol = t.Symbol,\n                Price = t.Price * 1.05m\n            });                                    // creates items on demand\n    }\n\n    // If materialization is needed, single allocation\n    public List<Trade> FilterAndTransformMaterialized(List<Trade> trades)\n    {\n        return trades\n            .Where(t => t.Amount > 1000)\n            .OrderBy(t => t.Price)\n            .Select(t => new Trade\n            {\n                Id = t.Id,\n                Symbol = t.Symbol,\n                Price = t.Price * 1.05m\n            })\n            .ToList(); // single allocation for result\n    }\n}",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "Big-O-Complexity",
    "source": "notes/Big-O-Complexity/Space-Complexity.md",
    "isConcept": true,
    "id": "card-134"
  },
  {
    "question": "What problem does Clean Architecture solve in a trading backend?",
    "answer": [
      {
        "type": "text",
        "content": "It isolates business invariants (domain) from volatile infrastructure (MT4 bridges, databases, queues). That way, compliance or pricing rules can evolve independently of transport/protocol changes, improving testability and longevity."
      }
    ],
    "category": "notes",
    "topic": "Clean-Architecture",
    "source": "notes/Clean-Architecture/index.md",
    "id": "card-135"
  },
  {
    "question": "How do dependencies flow between layers?",
    "answer": [
      {
        "type": "text",
        "content": "They always point inward: Presentation → Application → Domain, an Infrastructure → Application/Domain via abstractions. Outer layers depend on interfaces defined closer to the domain so high-level policy doesn't reference implementation details."
      }
    ],
    "category": "notes",
    "topic": "Clean-Architecture",
    "source": "notes/Clean-Architecture/index.md",
    "id": "card-136"
  },
  {
    "question": "Where do MediatR handlers and validators belong?",
    "answer": [
      {
        "type": "text",
        "content": "They live in the Application layer because they orchestrate use cases. Handlers depend on domain abstractions and infrastructure contracts, but they shouldn't contain transport or framework-specific code beyond orchestration."
      }
    ],
    "category": "notes",
    "topic": "Clean-Architecture",
    "source": "notes/Clean-Architecture/index.md",
    "id": "card-137"
  },
  {
    "question": "How do you keep Infrastructure replaceable?",
    "answer": [
      {
        "type": "text",
        "content": "Define interfaces (repositories, message gateways) inside the Application/Domain layers and implement them in Infrastructure. Register implementations via DI so you can swap SQL for Cosmos, or RabbitMQ for Kafka, without touching business logic."
      }
    ],
    "category": "notes",
    "topic": "Clean-Architecture",
    "source": "notes/Clean-Architecture/index.md",
    "id": "card-138"
  },
  {
    "question": "When would you introduce a shared kernel or cross-cutting project?",
    "answer": [
      {
        "type": "text",
        "content": "Only for concepts shared across bounded contexts (e.g., identity, currency). Keep it tiny and stable. Everything else should stay in each feature's domain to avoid reintroducing tight coupling."
      }
    ],
    "category": "notes",
    "topic": "Clean-Architecture",
    "source": "notes/Clean-Architecture/index.md",
    "id": "card-139"
  },
  {
    "question": "How do you test Application-layer use cases?",
    "answer": [
      {
        "type": "text",
        "content": "Mock Infrastructure dependencies behind interfaces and test handlers/services directly. Since the Application layer has no UI/DB concerns, unit tests stay deterministic and focus on orchestration, validation, and domain invariants."
      }
    ],
    "category": "notes",
    "topic": "Clean-Architecture",
    "source": "notes/Clean-Architecture/index.md",
    "id": "card-140"
  },
  {
    "question": "What belongs in the Domain layer vs Application?",
    "answer": [
      {
        "type": "text",
        "content": "Domain contains entities, value objects, domain services, aggregates, and events—the core business rules. Application coordinates those rules in use cases, orchestrating repositories, external services, and transactions."
      }
    ],
    "category": "notes",
    "topic": "Clean-Architecture",
    "source": "notes/Clean-Architecture/index.md",
    "id": "card-141"
  },
  {
    "question": "How do you handle cross-cutting concerns like logging or caching?",
    "answer": [
      {
        "type": "text",
        "content": "Apply decorators or pipeline behaviors (e.g., MediatR behaviors, middleware) in outer layers. They wrap use cases without polluting domain logic, keeping Clean Architecture boundaries intact."
      }
    ],
    "category": "notes",
    "topic": "Clean-Architecture",
    "source": "notes/Clean-Architecture/index.md",
    "id": "card-142"
  },
  {
    "question": "How does Clean Architecture interact with CQRS?",
    "answer": [
      {
        "type": "text",
        "content": "Commands and queries fit naturally into the Application layer as separate handlers. Read models can use dedicated infrastructure (e.g., optimized query stores) while writes go through domain entities and aggregates."
      }
    ],
    "category": "notes",
    "topic": "Clean-Architecture",
    "source": "notes/Clean-Architecture/index.md",
    "id": "card-143"
  },
  {
    "question": "When would you relax strict layering?",
    "answer": [
      {
        "type": "text",
        "content": "Only when profiling shows a clear performance bottleneck and you've validated that bypassing a layer (e.g., read-only projections accessing Infrastructure directly) won't compromise maintainability. Even then, document the decision and keep dependencies pointing inward."
      }
    ],
    "category": "notes",
    "topic": "Clean-Architecture",
    "source": "notes/Clean-Architecture/index.md",
    "id": "card-144"
  },
  {
    "question": "🏗️ Layers Overview",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "┌───────────────────────────────┐\n│       Presentation Layer      │ → Controllers, APIs, UI\n├───────────────────────────────┤\n│     Application Layer         │ → Use cases, CQRS handlers, services\n├───────────────────────────────┤\n│       Domain Layer            │ → Entities, Aggregates, Value Objects\n├───────────────────────────────┤\n│   Infrastructure Layer        │ → DBs, APIs, MT4/MT5, message brokers\n└───────────────────────────────┘",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Clean-Architecture",
    "source": "notes/Clean-Architecture/index.md",
    "isSection": true,
    "id": "card-145"
  },
  {
    "question": "🧩 Domain Layer",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class Order\n{\n    public Guid Id { get; } = Guid.NewGuid();\n    public string Symbol { get; set; }\n    public double Amount { get; set; }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Clean-Architecture",
    "source": "notes/Clean-Architecture/index.md",
    "isSection": true,
    "id": "card-146"
  },
  {
    "question": "🧩 Application Layer",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class PlaceOrderHandler\n{\n    private readonly ITradeExecutor _executor;\n    private readonly IOrderValidator _validator;\n\n    public PlaceOrderHandler(ITradeExecutor executor, IOrderValidator validator)\n    {\n        _executor = executor;\n        _validator = validator;\n    }\n\n    public void Handle(Order order)\n    {\n        if (!_validator.Validate(order))\n            throw new InvalidOperationException(\"Invalid order\");\n        _executor.Execute(order);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Clean-Architecture",
    "source": "notes/Clean-Architecture/index.md",
    "isSection": true,
    "id": "card-147"
  },
  {
    "question": "🧩 Infrastructure Layer",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class Mt5Executor : ITradeExecutor\n{\n    public void Execute(Order order) => Console.WriteLine($\"[MT5] Executing {order.Symbol}\");\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Clean-Architecture",
    "source": "notes/Clean-Architecture/index.md",
    "isSection": true,
    "id": "card-148"
  },
  {
    "question": "🧩 Presentation Layer",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "[ApiController]\n[Route(\"api/[controller]\")]\npublic class OrdersController : ControllerBase\n{\n    private readonly PlaceOrderHandler _handler;\n    public OrdersController(PlaceOrderHandler handler) => _handler = handler;\n\n    [HttpPost]\n    public IActionResult Post(Order order)\n    {\n        _handler.Handle(order);\n        return Ok(\"Order executed\");\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Clean-Architecture",
    "source": "notes/Clean-Architecture/index.md",
    "isSection": true,
    "id": "card-149"
  },
  {
    "question": "⚙️ How it all connects",
    "answer": [
      {
        "type": "list",
        "items": [
          "Domain layer = pure business rules",
          "Application layer = orchestration and use cases",
          "Infrastructure = implementation details (DBs, APIs, message buses)",
          "Presentation = web, console, or UI"
        ]
      },
      {
        "type": "text",
        "content": "> “Dependencies always point inward — nothing in domain depends on outer layers.”"
      },
      {
        "type": "text",
        "content": "This separation makes your system testable, extensible, and resilient to change."
      }
    ],
    "category": "notes",
    "topic": "Clean-Architecture",
    "source": "notes/Clean-Architecture/index.md",
    "isSection": true,
    "id": "card-150"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: It isolates business invariants (domain) from volatile infrastructure (MT4 bridges, databases, queues). That way, compliance or pricing rules can evolve independently of transport/protocol changes, improving testability and longevity."
      },
      {
        "type": "text",
        "content": "A: They always point inward: Presentation → Application → Domain, an Infrastructure → Application/Domain via abstractions. Outer layers depend on interfaces defined closer to the domain so high-level policy doesn't reference implementation details."
      },
      {
        "type": "text",
        "content": "A: They live in the Application layer because they orchestrate use cases. Handlers depend on domain abstractions and infrastructure contracts, but they shouldn't contain transport or framework-specific code beyond orchestration."
      },
      {
        "type": "text",
        "content": "A: Define interfaces (repositories, message gateways) inside the Application/Domain layers and implement them in Infrastructure. Register implementations via DI so you can swap SQL for Cosmos, or RabbitMQ for Kafka, without touching business logic."
      },
      {
        "type": "text",
        "content": "A: Only for concepts shared across bounded contexts (e.g., identity, currency). Keep it tiny and stable. Everything else should stay in each feature's domain to avoid reintroducing tight coupling."
      },
      {
        "type": "text",
        "content": "A: Mock Infrastructure dependencies behind interfaces and test handlers/services directly. Since the Application layer has no UI/DB concerns, unit tests stay deterministic and focus on orchestration, validation, and domain invariants."
      },
      {
        "type": "text",
        "content": "A: Domain contains entities, value objects, domain services, aggregates, and events—the core business rules. Application coordinates those rules in use cases, orchestrating repositories, external services, and transactions."
      },
      {
        "type": "text",
        "content": "A: Apply decorators or pipeline behaviors (e.g., MediatR behaviors, middleware) in outer layers. They wrap use cases without polluting domain logic, keeping Clean Architecture boundaries intact."
      },
      {
        "type": "text",
        "content": "A: Commands and queries fit naturally into the Application layer as separate handlers. Read models can use dedicated infrastructure (e.g., optimized query stores) while writes go through domain entities and aggregates."
      },
      {
        "type": "text",
        "content": "A: Only when profiling shows a clear performance bottleneck and you've validated that bypassing a layer (e.g., read-only projections accessing Infrastructure directly) won't compromise maintainability. Even then, document the decision and keep dependencies pointing inward."
      }
    ],
    "category": "notes",
    "topic": "Clean-Architecture",
    "source": "notes/Clean-Architecture/index.md",
    "isSection": true,
    "id": "card-151"
  },
  {
    "question": "What's the difference between IEnumerable<T> and ICollection<T>?",
    "answer": [
      {
        "type": "text",
        "content": "ICollection<T> extends IEnumerable<T> and adds Count, Add(), Remove(), Clear(), Contains(), and CopyTo(). Use ICollection<T> when these operations are needed."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/ICollection.md",
    "id": "card-152"
  },
  {
    "question": "Does ICollection<T> guarantee O(1) Count?",
    "answer": [
      {
        "type": "text",
        "content": "Not strictly, but most implementations (List<T>, HashSet<T>) cache Count. LinkedList<T> also has O(1) Count. IEnumerable<T>.Count() enumerates everything."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/ICollection.md",
    "id": "card-153"
  },
  {
    "question": "Should I return ICollection<T> from methods?",
    "answer": [
      {
        "type": "text",
        "content": "Only if callers legitimately need Count or Add/Remove. Otherwise, IEnumerable<T> is preferable—narrower contract, better encapsulation."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/ICollection.md",
    "id": "card-154"
  },
  {
    "question": "Can I expose ICollection<T> without allowing modification?",
    "answer": [
      {
        "type": "text",
        "content": "Use IReadOnlyCollection<T> instead. It provides Count but no Add/Remove, preventing unintended mutations."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/ICollection.md",
    "id": "card-155"
  },
  {
    "question": "What's the risk of returning ICollection<T>?",
    "answer": [
      {
        "type": "text",
        "content": "Callers can mutate the collection, potentially breaking invariants. Return defensive copies or IReadOnlyCollection<T> if modification isn't intended."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/ICollection.md",
    "id": "card-156"
  },
  {
    "question": "How does ICollection<T> relate to arrays?",
    "answer": [
      {
        "type": "text",
        "content": "Arrays implement ICollection<T>, but Add/Remove throw NotSupportedException because arrays are fixed-size. Check IsReadOnly before assuming mutability."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/ICollection.md",
    "id": "card-157"
  },
  {
    "question": "When should I use HashSet<T> vs List<T> for ICollection<T>?",
    "answer": [
      {
        "type": "text",
        "content": "HashSet<T> when uniqueness matters and Contains() is frequent (O(1)). List<T> when order matters and indexed access is needed. Both implement ICollection<T>."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/ICollection.md",
    "id": "card-158"
  },
  {
    "question": "Can ICollection<T> be lazy like IEnumerable<T>?",
    "answer": [
      {
        "type": "text",
        "content": "No. Count property implies materialization. Returning ICollection<T> signals that data is already loaded and countable."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/ICollection.md",
    "id": "card-159"
  },
  {
    "question": "How do I mock ICollection<T> in tests?",
    "answer": [
      {
        "type": "text",
        "content": "Use List<T> or HashSet<T> directly, or create a custom fake. Most mocking frameworks (Moq, NSubstitute) can stub ICollection<T> methods."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/ICollection.md",
    "id": "card-160"
  },
  {
    "question": "What's the performance of Contains() on ICollection<T>?",
    "answer": [
      {
        "type": "text",
        "content": "Depends on implementation. HashSet<T> is O(1), List<T> is O(n). Always consider the concrete type when performance matters, even if accepting ICollection<T>."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/ICollection.md",
    "id": "card-161"
  },
  {
    "question": "❌ Bad example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public IEnumerable<Position> GetPositions()\n{\n    return _positions.Where(p => p.IsOpen);\n}\n\n// Caller\npublic void ValidatePositions(IEnumerable<Position> positions)\n{\n    int count = positions.Count(); // enumerates entire sequence\n    if (count > MaxPositions)\n        throw new InvalidOperationException(\"Too many positions\");\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Using .Count() on IEnumerable<T> enumerates the whole sequence—inefficient for validation."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/ICollection.md",
    "isSection": true,
    "id": "card-162"
  },
  {
    "question": "✅ Good example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public ICollection<Position> GetPositions()\n{\n    return _positions.Where(p => p.IsOpen).ToList();\n}\n\n// Caller\npublic void ValidatePositions(ICollection<Position> positions)\n{\n    if (positions.Count > MaxPositions) // O(1) property access\n        throw new InvalidOperationException(\"Too many positions\");\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 ICollection<T>.Count is a property (O(1) for most collections), not an enumeration."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/ICollection.md",
    "isSection": true,
    "id": "card-163"
  },
  {
    "question": "🔥 When Add/Remove matters:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface IOrderQueue\n{\n    ICollection<Order> PendingOrders { get; }\n}\n\npublic class OrderProcessor\n{\n    private readonly IOrderQueue _queue;\n\n    public void CancelOrder(int orderId)\n    {\n        var order = _queue.PendingOrders.FirstOrDefault(o => o.Id == orderId);\n        if (order != null)\n            _queue.PendingOrders.Remove(order); // mutation supported\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 Callers can modify the collection via Add/Remove without exposing concrete type."
      },
      {
        "type": "text",
        "content": "💡 In trading systems:"
      },
      {
        "type": "list",
        "items": [
          "Use ICollection<T> for position snapshots where count validation is critical.",
          "Expose ICollection<T> when callers need to add/remove pending orders or alerts.",
          "Prefer IEnumerable<T> if Count isn't needed—keeps API minimal."
        ]
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/ICollection.md",
    "isSection": true,
    "id": "card-164"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: ICollection<T> extends IEnumerable<T> and adds Count, Add(), Remove(), Clear(), Contains(), and CopyTo(). Use ICollection<T> when these operations are needed."
      },
      {
        "type": "text",
        "content": "A: Not strictly, but most implementations (List<T>, HashSet<T>) cache Count. LinkedList<T> also has O(1) Count. IEnumerable<T>.Count() enumerates everything."
      },
      {
        "type": "text",
        "content": "A: Only if callers legitimately need Count or Add/Remove. Otherwise, IEnumerable<T> is preferable—narrower contract, better encapsulation."
      },
      {
        "type": "text",
        "content": "A: Use IReadOnlyCollection<T> instead. It provides Count but no Add/Remove, preventing unintended mutations."
      },
      {
        "type": "text",
        "content": "A: Callers can mutate the collection, potentially breaking invariants. Return defensive copies or IReadOnlyCollection<T> if modification isn't intended."
      },
      {
        "type": "text",
        "content": "A: Arrays implement ICollection<T>, but Add/Remove throw NotSupportedException because arrays are fixed-size. Check IsReadOnly before assuming mutability."
      },
      {
        "type": "text",
        "content": "A: HashSet<T> when uniqueness matters and Contains() is frequent (O(1)). List<T> when order matters and indexed access is needed. Both implement ICollection<T>."
      },
      {
        "type": "text",
        "content": "A: No. Count property implies materialization. Returning ICollection<T> signals that data is already loaded and countable."
      },
      {
        "type": "text",
        "content": "A: Use List<T> or HashSet<T> directly, or create a custom fake. Most mocking frameworks (Moq, NSubstitute) can stub ICollection<T> methods."
      },
      {
        "type": "text",
        "content": "A: Depends on implementation. HashSet<T> is O(1), List<T> is O(n). Always consider the concrete type when performance matters, even if accepting ICollection<T>."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/ICollection.md",
    "isSection": true,
    "id": "card-165"
  },
  {
    "question": "ICollection<T> — Countable, Modifiable Collections",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public IEnumerable<Position> GetPositions()\n{\n    return _positions.Where(p => p.IsOpen);\n}\n\n// Caller\npublic void ValidatePositions(IEnumerable<Position> positions)\n{\n    int count = positions.Count(); // enumerates entire sequence\n    if (count > MaxPositions)\n        throw new InvalidOperationException(\"Too many positions\");\n}",
        "codeType": "bad"
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/ICollection.md",
    "isConcept": true,
    "id": "card-166"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public ICollection<Position> GetPositions()\n{\n    return _positions.Where(p => p.IsOpen).ToList();\n}\n\n// Caller\npublic void ValidatePositions(ICollection<Position> positions)\n{\n    if (positions.Count > MaxPositions) // O(1) property access\n        throw new InvalidOperationException(\"Too many positions\");\n}",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/ICollection.md",
    "isConcept": true,
    "id": "card-167"
  },
  {
    "question": "What's the difference between IEnumerable<T> and IEnumerator<T>?",
    "answer": [
      {
        "type": "text",
        "content": "IEnumerable<T> represents a sequence you can iterate; IEnumerator<T> is the cursor that tracks position. GetEnumerator() creates the cursor. Use IEnumerable<T> in APIs, not IEnumerator<T>."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IEnumerable.md",
    "id": "card-168"
  },
  {
    "question": "Can IEnumerable<T> be enumerated multiple times?",
    "answer": [
      {
        "type": "text",
        "content": "Depends on implementation. Arrays/lists can be re-enumerated; LINQ queries and yield-based iterators re-execute. Avoid enumerating twice without .ToList() if side effects exist."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IEnumerable.md",
    "id": "card-169"
  },
  {
    "question": "How does deferred execution work with IEnumerable<T>?",
    "answer": [
      {
        "type": "text",
        "content": "LINQ operations build a query pipeline without executing. Enumeration (foreach, .ToList(), .Count()) triggers execution. This enables composing filters cheaply before materializing."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IEnumerable.md",
    "id": "card-170"
  },
  {
    "question": "When should I call .ToList() on IEnumerable<T>?",
    "answer": [
      {
        "type": "text",
        "content": "When you need to enumerate multiple times, require random access, or want to snapshot state. Otherwise, keep it lazy to save memory and enable streaming."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IEnumerable.md",
    "id": "card-171"
  },
  {
    "question": "What's the cost of multiple Where() clauses on IEnumerable<T>?",
    "answer": [
      {
        "type": "text",
        "content": "Minimal until enumeration. Each Where() wraps the previous iterator. During enumeration, predicates chain efficiently without intermediate collections."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IEnumerable.md",
    "id": "card-172"
  },
  {
    "question": "Can IEnumerable<T> represent infinite sequences?",
    "answer": [
      {
        "type": "text",
        "content": "Yes. Yield-based iterators can generate endless items (e.g., Fibonacci). Callers use .Take(n) to limit consumption. This is impossible with List<T>."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IEnumerable.md",
    "id": "card-173"
  },
  {
    "question": "How does foreach work with IEnumerable<T>?",
    "answer": [
      {
        "type": "text",
        "content": "Compiler calls GetEnumerator(), then repeatedly calls MoveNext() and accesses Current. Finally calls Dispose(). You rarely implement IEnumerable<T> manually; use yield."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IEnumerable.md",
    "id": "card-174"
  },
  {
    "question": "What happens if I modify a collection while enumerating?",
    "answer": [
      {
        "type": "text",
        "content": "Most collections throw InvalidOperationException. Use .ToList() first if modification during iteration is required, or redesign to collect changes separately."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IEnumerable.md",
    "id": "card-175"
  },
  {
    "question": "How does IEnumerable<T> relate to memory allocation?",
    "answer": [
      {
        "type": "text",
        "content": "Iterator blocks allocate a state machine (heap object), but items are yielded on demand. This trades small upfront allocation for avoiding large arrays."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IEnumerable.md",
    "id": "card-176"
  },
  {
    "question": "Should I return IEnumerable<T> from async methods?",
    "answer": [
      {
        "type": "text",
        "content": "No, use IAsyncEnumerable<T> for async streaming. Returning IEnumerable<T> from an async method forces full materialization (.ToListAsync()) before returning, losing laziness."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IEnumerable.md",
    "id": "card-177"
  },
  {
    "question": "❌ Bad example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public List<Order> GetActiveOrders()\n{\n    var orders = _repository.GetAll(); // loads everything\n    return orders.Where(o => o.IsActive).ToList(); // filters in memory\n}\n\n// Caller\npublic void ProcessOrders()\n{\n    List<Order> orders = GetActiveOrders(); // forces concrete type\n    foreach (var order in orders) { /* ... */ }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Returning List<T> exposes mutability, couples caller to implementation, and forces immediate materialization."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IEnumerable.md",
    "isSection": true,
    "id": "card-178"
  },
  {
    "question": "✅ Good example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public IEnumerable<Order> GetActiveOrders()\n{\n    var orders = _repository.GetAll();\n    return orders.Where(o => o.IsActive); // deferred execution\n}\n\n// Caller\npublic void ProcessOrders()\n{\n    IEnumerable<Order> orders = GetActiveOrders(); // flexible contract\n    foreach (var order in orders) { /* ... */ }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 Returns interface, enables lazy evaluation, and hides implementation."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IEnumerable.md",
    "isSection": true,
    "id": "card-179"
  },
  {
    "question": "🔥 Using yield return for streaming:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public IEnumerable<Trade> GetTradesForDate(DateTime date)\n{\n    using var reader = _database.ExecuteReader($\"SELECT * FROM Trades WHERE Date = '{date}'\");\n    while (reader.Read())\n    {\n        yield return new Trade\n        {\n            Id = reader.GetInt32(0),\n            Symbol = reader.GetString(1),\n            Price = reader.GetDecimal(2)\n        };\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 Streams results one at a time, reducing memory pressure for large datasets."
      },
      {
        "type": "text",
        "content": "💡 In trading systems:"
      },
      {
        "type": "list",
        "items": [
          "Use IEnumerable<T> for large result sets from databases (avoid loading millions of trades).",
          "Enable deferred execution so filters/transformations compose efficiently.",
          "Prevent callers from modifying source collections accidentally."
        ]
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IEnumerable.md",
    "isSection": true,
    "id": "card-180"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: IEnumerable<T> represents a sequence you can iterate; IEnumerator<T> is the cursor that tracks position. GetEnumerator() creates the cursor. Use IEnumerable<T> in APIs, not IEnumerator<T>."
      },
      {
        "type": "text",
        "content": "A: Depends on implementation. Arrays/lists can be re-enumerated; LINQ queries and yield-based iterators re-execute. Avoid enumerating twice without .ToList() if side effects exist."
      },
      {
        "type": "text",
        "content": "A: LINQ operations build a query pipeline without executing. Enumeration (foreach, .ToList(), .Count()) triggers execution. This enables composing filters cheaply before materializing."
      },
      {
        "type": "text",
        "content": "A: When you need to enumerate multiple times, require random access, or want to snapshot state. Otherwise, keep it lazy to save memory and enable streaming."
      },
      {
        "type": "text",
        "content": "A: Minimal until enumeration. Each Where() wraps the previous iterator. During enumeration, predicates chain efficiently without intermediate collections."
      },
      {
        "type": "text",
        "content": "A: Yes. Yield-based iterators can generate endless items (e.g., Fibonacci). Callers use .Take(n) to limit consumption. This is impossible with List<T>."
      },
      {
        "type": "text",
        "content": "A: Compiler calls GetEnumerator(), then repeatedly calls MoveNext() and accesses Current. Finally calls Dispose(). You rarely implement IEnumerable<T> manually; use yield."
      },
      {
        "type": "text",
        "content": "A: Most collections throw InvalidOperationException. Use .ToList() first if modification during iteration is required, or redesign to collect changes separately."
      },
      {
        "type": "text",
        "content": "A: Iterator blocks allocate a state machine (heap object), but items are yielded on demand. This trades small upfront allocation for avoiding large arrays."
      },
      {
        "type": "text",
        "content": "A: No, use IAsyncEnumerable<T> for async streaming. Returning IEnumerable<T> from an async method forces full materialization (.ToListAsync()) before returning, losing laziness."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IEnumerable.md",
    "isSection": true,
    "id": "card-181"
  },
  {
    "question": "IEnumerable<T> — Read-Only Forward Iteration",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public List<Order> GetActiveOrders()\n{\n    var orders = _repository.GetAll(); // loads everything\n    return orders.Where(o => o.IsActive).ToList(); // filters in memory\n}\n\n// Caller\npublic void ProcessOrders()\n{\n    List<Order> orders = GetActiveOrders(); // forces concrete type\n    foreach (var order in orders) { /* ... */ }\n}",
        "codeType": "bad"
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IEnumerable.md",
    "isConcept": true,
    "id": "card-182"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public IEnumerable<Order> GetActiveOrders()\n{\n    var orders = _repository.GetAll();\n    return orders.Where(o => o.IsActive); // deferred execution\n}\n\n// Caller\npublic void ProcessOrders()\n{\n    IEnumerable<Order> orders = GetActiveOrders(); // flexible contract\n    foreach (var order in orders) { /* ... */ }\n}",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IEnumerable.md",
    "isConcept": true,
    "id": "card-183"
  },
  {
    "question": "What's the difference between ICollection<T> and IList<T>?",
    "answer": [
      {
        "type": "text",
        "content": "IList<T> extends ICollection<T> and adds indexed access (this[int]), Insert(), RemoveAt(), and IndexOf(). Use IList<T> when position matters."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IList.md",
    "id": "card-184"
  },
  {
    "question": "Does IList<T> guarantee O(1) indexed access?",
    "answer": [
      {
        "type": "text",
        "content": "Not strictly. List<T> and arrays are O(1), but custom implementations (e.g., linked lists) could be O(n). Documentation should clarify performance."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IList.md",
    "id": "card-185"
  },
  {
    "question": "Should I return IList<T> from methods?",
    "answer": [
      {
        "type": "text",
        "content": "Only if callers need indexed access or Insert/RemoveAt. Otherwise, IEnumerable<T> or IReadOnlyList<T> are better—narrower contracts prevent misuse."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IList.md",
    "id": "card-186"
  },
  {
    "question": "Can IList<T> be read-only?",
    "answer": [
      {
        "type": "text",
        "content": "Yes. Arrays are fixed-size, so Add/Remove throw NotSupportedException. Check IsReadOnly before assuming mutability. Prefer IReadOnlyList<T> for clarity."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IList.md",
    "id": "card-187"
  },
  {
    "question": "How does IList<T> relate to arrays?",
    "answer": [
      {
        "type": "text",
        "content": "Arrays implement IList<T>, providing O(1) indexed access. They're IList<T> but fixed-size, so Add/Remove fail. Use Array.AsReadOnly() for IReadOnlyList<T>."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IList.md",
    "id": "card-188"
  },
  {
    "question": "When should I use for vs foreach with IList<T>?",
    "answer": [
      {
        "type": "text",
        "content": "Use for (int i = 0; i < list.Count; i++) when you need the index or modify elements by index. Use foreach for clarity when index isn't needed."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IList.md",
    "id": "card-189"
  },
  {
    "question": "What's the performance of IndexOf() on IList<T>?",
    "answer": [
      {
        "type": "text",
        "content": "O(n) for List<T> (linear search). If frequent lookups are needed, use Dictionary<TKey, TValue> or HashSet<T> instead."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IList.md",
    "id": "card-190"
  },
  {
    "question": "Can I pass an array as IList<T>?",
    "answer": [
      {
        "type": "text",
        "content": "Yes. Arrays implement IList<T>, but Add/Remove throw exceptions. This enables accepting both arrays and lists without overloads."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IList.md",
    "id": "card-191"
  },
  {
    "question": "How do I mock IList<T> in tests?",
    "answer": [
      {
        "type": "text",
        "content": "Use List<T> or arrays directly for simple cases. For complex scenarios, mocking frameworks (Moq, NSubstitute) can stub IList<T> behavior."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IList.md",
    "id": "card-192"
  },
  {
    "question": "What happens if I access IList<T>[index] out of bounds?",
    "answer": [
      {
        "type": "text",
        "content": "Throws IndexOutOfRangeException (arrays) or ArgumentOutOfRangeException (List<T>). Always validate index < Count before accessing."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IList.md",
    "id": "card-193"
  },
  {
    "question": "❌ Bad example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public IEnumerable<Trade> GetRecentTrades()\n{\n    return _trades.OrderByDescending(t => t.Timestamp).Take(10);\n}\n\n// Caller\npublic void DisplayLastTrade(IEnumerable<Trade> trades)\n{\n    var lastTrade = trades.Last(); // enumerates entire sequence\n    Console.WriteLine(lastTrade.Symbol);\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Using .Last() on IEnumerable<T> requires full enumeration—inefficient."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IList.md",
    "isSection": true,
    "id": "card-194"
  },
  {
    "question": "✅ Good example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public IList<Trade> GetRecentTrades()\n{\n    return _trades.OrderByDescending(t => t.Timestamp).Take(10).ToList();\n}\n\n// Caller\npublic void DisplayLastTrade(IList<Trade> trades)\n{\n    var lastTrade = trades[trades.Count - 1]; // O(1) indexed access\n    Console.WriteLine(lastTrade.Symbol);\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 IList<T> enables O(1) random access via indexer, avoiding enumeration."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IList.md",
    "isSection": true,
    "id": "card-195"
  },
  {
    "question": "🔥 When Insert/RemoveAt matters:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderBook\n{\n    public IList<Order> BuyOrders { get; } = new List<Order>();\n\n    public void InsertOrderAtPrice(Order order)\n    {\n        // Binary search to find insertion point\n        int index = BuyOrders.BinarySearch(order, new PriceComparer());\n        if (index < 0) index = ~index;\n\n        BuyOrders.Insert(index, order); // insert at specific position\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 IList<T> supports Insert() and RemoveAt() for positional mutations."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IList.md",
    "isSection": true,
    "id": "card-196"
  },
  {
    "question": "🔥 Avoiding unnecessary copies:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// ❌ Bad: forces caller to know concrete type\npublic List<decimal> CalculatePrices(List<decimal> basePrices)\n{\n    for (int i = 0; i < basePrices.Count; i++)\n        basePrices[i] *= 1.05m;\n    return basePrices;\n}\n\n// ✅ Good: accepts interface, returns interface\npublic IList<decimal> CalculatePrices(IList<decimal> basePrices)\n{\n    for (int i = 0; i < basePrices.Count; i++)\n        basePrices[i] *= 1.05m;\n    return basePrices;\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 Accepting IList<T> allows arrays or lists without forcing specific types."
      },
      {
        "type": "text",
        "content": "💡 In trading systems:"
      },
      {
        "type": "list",
        "items": [
          "Use IList<T> for order books where indexed access is critical for price levels.",
          "Enable efficient batch processing with index-based loops (faster than foreach for large arrays).",
          "Prefer IEnumerable<T> unless random access is genuinely needed—narrower contract."
        ]
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IList.md",
    "isSection": true,
    "id": "card-197"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: IList<T> extends ICollection<T> and adds indexed access (this[int]), Insert(), RemoveAt(), and IndexOf(). Use IList<T> when position matters."
      },
      {
        "type": "text",
        "content": "A: Not strictly. List<T> and arrays are O(1), but custom implementations (e.g., linked lists) could be O(n). Documentation should clarify performance."
      },
      {
        "type": "text",
        "content": "A: Only if callers need indexed access or Insert/RemoveAt. Otherwise, IEnumerable<T> or IReadOnlyList<T> are better—narrower contracts prevent misuse."
      },
      {
        "type": "text",
        "content": "A: Yes. Arrays are fixed-size, so Add/Remove throw NotSupportedException. Check IsReadOnly before assuming mutability. Prefer IReadOnlyList<T> for clarity."
      },
      {
        "type": "text",
        "content": "A: Arrays implement IList<T>, providing O(1) indexed access. They're IList<T> but fixed-size, so Add/Remove fail. Use Array.AsReadOnly() for IReadOnlyList<T>."
      },
      {
        "type": "text",
        "content": "A: Use for (int i = 0; i < list.Count; i++) when you need the index or modify elements by index. Use foreach for clarity when index isn't needed."
      },
      {
        "type": "text",
        "content": "A: O(n) for List<T> (linear search). If frequent lookups are needed, use Dictionary<TKey, TValue> or HashSet<T> instead."
      },
      {
        "type": "text",
        "content": "A: Yes. Arrays implement IList<T>, but Add/Remove throw exceptions. This enables accepting both arrays and lists without overloads."
      },
      {
        "type": "text",
        "content": "A: Use List<T> or arrays directly for simple cases. For complex scenarios, mocking frameworks (Moq, NSubstitute) can stub IList<T> behavior."
      },
      {
        "type": "text",
        "content": "A: Throws IndexOutOfRangeException (arrays) or ArgumentOutOfRangeException (List<T>). Always validate index < Count before accessing."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IList.md",
    "isSection": true,
    "id": "card-198"
  },
  {
    "question": "IList<T> — Indexed Access Collections",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public IEnumerable<Trade> GetRecentTrades()\n{\n    return _trades.OrderByDescending(t => t.Timestamp).Take(10);\n}\n\n// Caller\npublic void DisplayLastTrade(IEnumerable<Trade> trades)\n{\n    var lastTrade = trades.Last(); // enumerates entire sequence\n    Console.WriteLine(lastTrade.Symbol);\n}",
        "codeType": "bad"
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IList.md",
    "isConcept": true,
    "id": "card-199"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public IList<Trade> GetRecentTrades()\n{\n    return _trades.OrderByDescending(t => t.Timestamp).Take(10).ToList();\n}\n\n// Caller\npublic void DisplayLastTrade(IList<Trade> trades)\n{\n    var lastTrade = trades[trades.Count - 1]; // O(1) indexed access\n    Console.WriteLine(lastTrade.Symbol);\n}",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IList.md",
    "isConcept": true,
    "id": "card-200"
  },
  {
    "question": "Why should I return IEnumerable<T> instead of List<T>?",
    "answer": [
      {
        "type": "text",
        "content": "IEnumerable<T> exposes only iteration, hiding mutability and implementation details. Callers can't modify the source, and you can swap concrete types (arrays, lists, query results) without breaking contracts."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/index.md",
    "id": "card-201"
  },
  {
    "question": "When should I use ICollection<T> over IEnumerable<T>?",
    "answer": [
      {
        "type": "text",
        "content": "When you need Count without enumerating everything, or when callers need Add/Remove. Trading systems use ICollection<T> for position snapshots where count matters for validation."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/index.md",
    "id": "card-202"
  },
  {
    "question": "What's the performance difference between IEnumerable<T> and IList<T>?",
    "answer": [
      {
        "type": "text",
        "content": "IList<T> supports O(1) indexed access; IEnumerable<T> is forward-only. Use IList<T> when random access is needed; otherwise prefer IEnumerable<T> for flexibility and deferred execution."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/index.md",
    "id": "card-203"
  },
  {
    "question": "How does IQueryable<T> enable LINQ-to-SQL?",
    "answer": [
      {
        "type": "text",
        "content": "IQueryable<T> builds expression trees instead of executing code. Providers like Entity Framework translate these trees into SQL, pushing filtering/sorting to the database instead of memory."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/index.md",
    "id": "card-204"
  },
  {
    "question": "Should I return IReadOnlyCollection<T> or IEnumerable<T>?",
    "answer": [
      {
        "type": "text",
        "content": "IReadOnlyCollection<T> when Count is cheap and useful to callers (e.g., pre-allocated arrays). IEnumerable<T> when iteration might be lazy or infinite, or when hiding collection semantics."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/index.md",
    "id": "card-205"
  },
  {
    "question": "What happens if I call .ToList() on every IEnumerable<T>?",
    "answer": [
      {
        "type": "text",
        "content": "You materialize the entire sequence into memory immediately, losing lazy evaluation benefits. This hurts performance with large datasets and breaks streaming scenarios."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/index.md",
    "id": "card-206"
  },
  {
    "question": "How do these interfaces relate to LINQ?",
    "answer": [
      {
        "type": "text",
        "content": "LINQ methods extend IEnumerable<T> and IQueryable<T>. IEnumerable<T> uses LINQ-to-Objects (in-memory), IQueryable<T> uses providers (LINQ-to-SQL, LINQ-to-Entities) for remote execution."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/index.md",
    "id": "card-207"
  },
  {
    "question": "Can I cast IEnumerable<T> to List<T> safely?",
    "answer": [
      {
        "type": "text",
        "content": "Not always. Use source as List<T> for null-safe casting, but prefer enumeration. Casting breaks abstraction and assumes implementation details callers shouldn't know."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/index.md",
    "id": "card-208"
  },
  {
    "question": "How do collection interfaces improve testability?",
    "answer": [
      {
        "type": "text",
        "content": "Accepting IEnumerable<T> lets tests pass arrays, lists, or mock sequences. Returning interfaces enables stub implementations, avoiding heavyweight setup."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/index.md",
    "id": "card-209"
  },
  {
    "question": "What's the memory impact of yielding with IEnumerable<T>?",
    "answer": [
      {
        "type": "text",
        "content": "Iterator blocks (yield return) create state machines that produce items on demand, reducing peak memory. This is critical for processing large datasets or infinite sequences."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/index.md",
    "id": "card-210"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: IEnumerable<T> exposes only iteration, hiding mutability and implementation details. Callers can't modify the source, and you can swap concrete types (arrays, lists, query results) without breaking contracts."
      },
      {
        "type": "text",
        "content": "A: When you need Count without enumerating everything, or when callers need Add/Remove. Trading systems use ICollection<T> for position snapshots where count matters for validation."
      },
      {
        "type": "text",
        "content": "A: IList<T> supports O(1) indexed access; IEnumerable<T> is forward-only. Use IList<T> when random access is needed; otherwise prefer IEnumerable<T> for flexibility and deferred execution."
      },
      {
        "type": "text",
        "content": "A: IQueryable<T> builds expression trees instead of executing code. Providers like Entity Framework translate these trees into SQL, pushing filtering/sorting to the database instead of memory."
      },
      {
        "type": "text",
        "content": "A: IReadOnlyCollection<T> when Count is cheap and useful to callers (e.g., pre-allocated arrays). IEnumerable<T> when iteration might be lazy or infinite, or when hiding collection semantics."
      },
      {
        "type": "text",
        "content": "A: You materialize the entire sequence into memory immediately, losing lazy evaluation benefits. This hurts performance with large datasets and breaks streaming scenarios."
      },
      {
        "type": "text",
        "content": "A: LINQ methods extend IEnumerable<T> and IQueryable<T>. IEnumerable<T> uses LINQ-to-Objects (in-memory), IQueryable<T> uses providers (LINQ-to-SQL, LINQ-to-Entities) for remote execution."
      },
      {
        "type": "text",
        "content": "A: Not always. Use source as List<T> for null-safe casting, but prefer enumeration. Casting breaks abstraction and assumes implementation details callers shouldn't know."
      },
      {
        "type": "text",
        "content": "A: Accepting IEnumerable<T> lets tests pass arrays, lists, or mock sequences. Returning interfaces enables stub implementations, avoiding heavyweight setup."
      },
      {
        "type": "text",
        "content": "A: Iterator blocks (yield return) create state machines that produce items on demand, reducing peak memory. This is critical for processing large datasets or infinite sequences."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/index.md",
    "isSection": true,
    "id": "card-211"
  },
  {
    "question": "What's the difference between IEnumerable<T> and IQueryable<T>?",
    "answer": [
      {
        "type": "text",
        "content": "IEnumerable<T> executes in-memory (LINQ-to-Objects), IQueryable<T> builds expression trees for remote execution (LINQ-to-SQL, LINQ-to-Entities). Use IQueryable<T> for databases."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IQueryable.md",
    "id": "card-212"
  },
  {
    "question": "When should I return IQueryable<T> vs IEnumerable<T>?",
    "answer": [
      {
        "type": "text",
        "content": "Return IQueryable<T> from repository methods so callers can compose queries before execution. Return IEnumerable<T> when data is already in memory or query composition isn't needed."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IQueryable.md",
    "id": "card-213"
  },
  {
    "question": "Can IQueryable<T> be enumerated multiple times?",
    "answer": [
      {
        "type": "text",
        "content": "Yes, but each enumeration re-executes the query against the database. Cache results with .ToList() if multiple enumerations are needed."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IQueryable.md",
    "id": "card-214"
  },
  {
    "question": "What happens if I use unsupported operations in IQueryable<T>?",
    "answer": [
      {
        "type": "text",
        "content": "Providers throw runtime exceptions if they can't translate operations to SQL (e.g., calling custom C# methods). Use .AsEnumerable() to switch to in-memory for unsupported logic."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IQueryable.md",
    "id": "card-215"
  },
  {
    "question": "How do I switch from IQueryable<T> to IEnumerable<T>?",
    "answer": [
      {
        "type": "text",
        "content": "Call .AsEnumerable(). This forces remaining operations to execute in-memory via LINQ-to-Objects. Useful for operations EF can't translate."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IQueryable.md",
    "id": "card-216"
  },
  {
    "question": "What's the performance cost of IQueryable<T>?",
    "answer": [
      {
        "type": "text",
        "content": "Building expression trees has overhead, but it's negligible compared to database I/O. The benefit is pushing work to the database, reducing memory and network costs."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IQueryable.md",
    "id": "card-217"
  },
  {
    "question": "Can IQueryable<T> be used outside EF Core?",
    "answer": [
      {
        "type": "text",
        "content": "Yes. Any provider implementing IQueryProvider can expose IQueryable<T> (e.g., LINQ-to-MongoDB, OData). Custom providers require implementing expression visitors."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IQueryable.md",
    "id": "card-218"
  },
  {
    "question": "How does IQueryable<T> relate to SQL injection?",
    "answer": [
      {
        "type": "text",
        "content": "Parameterized queries are generated by providers like EF Core, preventing SQL injection. Never concatenate strings into IQueryable<T> predicates—use variables instead."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IQueryable.md",
    "id": "card-219"
  },
  {
    "question": "Should I expose IQueryable<T> from repositories?",
    "answer": [
      {
        "type": "text",
        "content": "Controversial. Pros: flexible querying. Cons: leaks data access concerns to callers. Consider returning IQueryable<T> for read-only queries, but encapsulate writes."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IQueryable.md",
    "id": "card-220"
  },
  {
    "question": "What's deferred execution in IQueryable<T>?",
    "answer": [
      {
        "type": "text",
        "content": "Query construction doesn't execute; only enumeration (.ToList(), .First(), foreach) triggers execution. This enables composing filters/projections cheaply before hitting the database."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IQueryable.md",
    "id": "card-221"
  },
  {
    "question": "❌ Bad example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public IEnumerable<Trade> GetTradesForSymbol(string symbol)\n{\n    return _dbContext.Trades.ToList() // loads ALL trades into memory\n                            .Where(t => t.Symbol == symbol); // filters in memory\n}\n\n// Caller\nvar trades = repository.GetTradesForSymbol(\"AAPL\"); // loads millions of rows",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Using IEnumerable<T> forces full materialization before filtering—catastrophic for large datasets."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IQueryable.md",
    "isSection": true,
    "id": "card-222"
  },
  {
    "question": "✅ Good example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public IQueryable<Trade> GetTradesForSymbol(string symbol)\n{\n    return _dbContext.Trades.Where(t => t.Symbol == symbol); // builds expression tree\n}\n\n// Caller\nvar trades = repository.GetTradesForSymbol(\"AAPL\")\n                       .OrderByDescending(t => t.Timestamp)\n                       .Take(100); // SQL: SELECT TOP 100 ... WHERE Symbol = 'AAPL' ORDER BY ...",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 IQueryable<T> builds expression trees; EF Core translates to SQL and executes on database."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IQueryable.md",
    "isSection": true,
    "id": "card-223"
  },
  {
    "question": "🔥 Composing queries before execution:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public IQueryable<Order> GetOrders()\n{\n    return _dbContext.Orders;\n}\n\n// Caller composes query further\nvar recentLargeOrders = orderService.GetOrders()\n    .Where(o => o.Amount > 10000)\n    .Where(o => o.CreatedAt > DateTime.UtcNow.AddDays(-7))\n    .OrderByDescending(o => o.Amount); // still no execution\n\nvar results = recentLargeOrders.ToList(); // NOW executes as single SQL query",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 Query composition is deferred until materialization (.ToList(), .First(), foreach)."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IQueryable.md",
    "isSection": true,
    "id": "card-224"
  },
  {
    "question": "🔥 Avoiding N+1 queries:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// ❌ Bad: N+1 problem\npublic IEnumerable<Order> GetOrdersWithCustomers()\n{\n    var orders = _dbContext.Orders.ToList(); // 1 query\n    foreach (var order in orders)\n    {\n        var customer = order.Customer; // N queries (lazy loading)\n    }\n    return orders;\n}\n\n// ✅ Good: single query with join\npublic IQueryable<Order> GetOrdersWithCustomers()\n{\n    return _dbContext.Orders.Include(o => o.Customer); // SQL JOIN\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 IQueryable<T> enables Include() for eager loading, avoiding N+1 queries."
      },
      {
        "type": "text",
        "content": "💡 In trading systems:"
      },
      {
        "type": "list",
        "items": [
          "Use IQueryable<T> for database repositories to push filtering/sorting to SQL.",
          "Enable dynamic query composition for flexible reporting without loading everything.",
          "Avoid materializing with .ToList() prematurely—keep query deferred until final shape is known."
        ]
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IQueryable.md",
    "isSection": true,
    "id": "card-225"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: IEnumerable<T> executes in-memory (LINQ-to-Objects), IQueryable<T> builds expression trees for remote execution (LINQ-to-SQL, LINQ-to-Entities). Use IQueryable<T> for databases."
      },
      {
        "type": "text",
        "content": "A: Return IQueryable<T> from repository methods so callers can compose queries before execution. Return IEnumerable<T> when data is already in memory or query composition isn't needed."
      },
      {
        "type": "text",
        "content": "A: Yes, but each enumeration re-executes the query against the database. Cache results with .ToList() if multiple enumerations are needed."
      },
      {
        "type": "text",
        "content": "A: Providers throw runtime exceptions if they can't translate operations to SQL (e.g., calling custom C# methods). Use .AsEnumerable() to switch to in-memory for unsupported logic."
      },
      {
        "type": "text",
        "content": "A: Call .AsEnumerable(). This forces remaining operations to execute in-memory via LINQ-to-Objects. Useful for operations EF can't translate."
      },
      {
        "type": "text",
        "content": "A: Building expression trees has overhead, but it's negligible compared to database I/O. The benefit is pushing work to the database, reducing memory and network costs."
      },
      {
        "type": "text",
        "content": "A: Yes. Any provider implementing IQueryProvider can expose IQueryable<T> (e.g., LINQ-to-MongoDB, OData). Custom providers require implementing expression visitors."
      },
      {
        "type": "text",
        "content": "A: Parameterized queries are generated by providers like EF Core, preventing SQL injection. Never concatenate strings into IQueryable<T> predicates—use variables instead."
      },
      {
        "type": "text",
        "content": "A: Controversial. Pros: flexible querying. Cons: leaks data access concerns to callers. Consider returning IQueryable<T> for read-only queries, but encapsulate writes."
      },
      {
        "type": "text",
        "content": "A: Query construction doesn't execute; only enumeration (.ToList(), .First(), foreach) triggers execution. This enables composing filters/projections cheaply before hitting the database."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IQueryable.md",
    "isSection": true,
    "id": "card-226"
  },
  {
    "question": "IQueryable<T> — Expression Trees for Remote Queries",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public IEnumerable<Trade> GetTradesForSymbol(string symbol)\n{\n    return _dbContext.Trades.ToList() // loads ALL trades into memory\n                            .Where(t => t.Symbol == symbol); // filters in memory\n}\n\n// Caller\nvar trades = repository.GetTradesForSymbol(\"AAPL\"); // loads millions of rows",
        "codeType": "bad"
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IQueryable.md",
    "isConcept": true,
    "id": "card-227"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public IQueryable<Trade> GetTradesForSymbol(string symbol)\n{\n    return _dbContext.Trades.Where(t => t.Symbol == symbol); // builds expression tree\n}\n\n// Caller\nvar trades = repository.GetTradesForSymbol(\"AAPL\")\n                       .OrderByDescending(t => t.Timestamp)\n                       .Take(100); // SQL: SELECT TOP 100 ... WHERE Symbol = 'AAPL' ORDER BY ...",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IQueryable.md",
    "isConcept": true,
    "id": "card-228"
  },
  {
    "question": "What's the difference between IReadOnlyCollection<T> and IReadOnlyList<T>?",
    "answer": [
      {
        "type": "text",
        "content": "IReadOnlyList<T> extends IReadOnlyCollection<T> and adds indexed access (this[int]). Use IReadOnlyList<T> when callers need random access without mutation."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IReadOnly.md",
    "id": "card-229"
  },
  {
    "question": "Does IReadOnly* guarantee immutability?",
    "answer": [
      {
        "type": "text",
        "content": "No. It prevents modification through the interface, but underlying data can still change. If the backing List<T> is modified, IReadOnlyCollection<T> reflects changes. Use ReadOnlyCollection<T> for true immutability."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IReadOnly.md",
    "id": "card-230"
  },
  {
    "question": "Can I cast List<T> to IReadOnlyCollection<T>?",
    "answer": [
      {
        "type": "text",
        "content": "Yes. List<T> implements IReadOnlyCollection<T> and IReadOnlyList<T>. Casting is a zero-cost abstraction—no allocation or copying."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IReadOnly.md",
    "id": "card-231"
  },
  {
    "question": "What's ReadOnlyCollection<T> vs IReadOnlyCollection<T>?",
    "answer": [
      {
        "type": "text",
        "content": "ReadOnlyCollection<T> is a wrapper class that prevents modification entirely, even if you have the underlying list. IReadOnlyCollection<T> is an interface; if you cast back to List<T>, you can mutate."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IReadOnly.md",
    "id": "card-232"
  },
  {
    "question": "Should I return IReadOnlyList<T> instead of IEnumerable<T>?",
    "answer": [
      {
        "type": "text",
        "content": "If Count and indexed access are useful to callers and data is already materialized (not lazy), yes. IReadOnlyList<T> is more informative without exposing mutability."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IReadOnly.md",
    "id": "card-233"
  },
  {
    "question": "How do I create a truly immutable collection?",
    "answer": [
      {
        "type": "text",
        "content": "Use ImmutableList<T> from System.Collections.Immutable. Modifications return new instances. Or wrap with new ReadOnlyCollection<T>(list)."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IReadOnly.md",
    "id": "card-234"
  },
  {
    "question": "Can I expose arrays as IReadOnlyList<T>?",
    "answer": [
      {
        "type": "text",
        "content": "Yes, arrays implement IReadOnlyList<T>. But callers can cast back to T[] and mutate. Use Array.AsReadOnly(array) for true protection."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IReadOnly.md",
    "id": "card-235"
  },
  {
    "question": "What's the performance of IReadOnlyList<T> vs List<T>?",
    "answer": [
      {
        "type": "text",
        "content": "Identical. IReadOnlyList<T> is just an interface restriction. Indexing and iteration have the same performance as the underlying collection."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IReadOnly.md",
    "id": "card-236"
  },
  {
    "question": "How do I mock IReadOnlyCollection<T> in tests?",
    "answer": [
      {
        "type": "text",
        "content": "Use arrays or List<T> directly. Most mocking frameworks can stub IReadOnlyCollection<T>, but real collections are often simpler in tests."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IReadOnly.md",
    "id": "card-237"
  },
  {
    "question": "When should I use IReadOnlyCollection<T> over IEnumerable<T>?",
    "answer": [
      {
        "type": "text",
        "content": "When Count is useful to callers and data is already materialized. IEnumerable<T> is better for lazy sequences or when hiding collection semantics."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IReadOnly.md",
    "id": "card-238"
  },
  {
    "question": "❌ Bad example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class Portfolio\n{\n    private List<Position> _positions = new();\n\n    public List<Position> Positions => _positions; // exposes internal list\n}\n\n// Caller can mutate internal state\nvar portfolio = new Portfolio();\nportfolio.Positions.Add(new Position()); // breaks encapsulation\nportfolio.Positions.Clear(); // disaster!",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Exposing mutable collections lets callers break invariants and bypass validation."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IReadOnly.md",
    "isSection": true,
    "id": "card-239"
  },
  {
    "question": "✅ Good example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class Portfolio\n{\n    private List<Position> _positions = new();\n\n    public IReadOnlyCollection<Position> Positions => _positions;\n\n    public void AddPosition(Position position)\n    {\n        ValidatePosition(position);\n        _positions.Add(position);\n    }\n}\n\n// Caller can only read\nvar portfolio = new Portfolio();\nint count = portfolio.Positions.Count; // ✅ allowed\n// portfolio.Positions.Add(...); // ❌ compiler error",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 IReadOnlyCollection<T> provides Count and iteration, but no Add/Remove."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IReadOnly.md",
    "isSection": true,
    "id": "card-240"
  },
  {
    "question": "🔥 Using IReadOnlyList<T> for indexed access:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TradingDay\n{\n    private List<Trade> _trades = new();\n\n    public IReadOnlyList<Trade> Trades => _trades;\n\n    public void RecordTrade(Trade trade)\n    {\n        _trades.Add(trade);\n    }\n}\n\n// Caller can access by index, but not modify\nvar day = new TradingDay();\nvar firstTrade = day.Trades[0]; // ✅ indexed access\nint count = day.Trades.Count;   // ✅ count\n// day.Trades.Add(...);          // ❌ compiler error",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 IReadOnlyList<T> adds indexed access without exposing mutability."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IReadOnly.md",
    "isSection": true,
    "id": "card-241"
  },
  {
    "question": "🔥 Avoiding defensive copies:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// ❌ Bad: creates unnecessary copy\npublic IEnumerable<Order> GetOrders()\n{\n    return _orders.ToList(); // allocates new list every call\n}\n\n// ✅ Good: exposes read-only view without copying\npublic IReadOnlyCollection<Order> GetOrders()\n{\n    return _orders; // no allocation, just interface cast\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 List<T> implements IReadOnlyCollection<T>, so casting is free."
      },
      {
        "type": "text",
        "content": "💡 In trading systems:"
      },
      {
        "type": "list",
        "items": [
          "Expose position snapshots as IReadOnlyCollection<T> to prevent accidental modifications.",
          "Return IReadOnlyList<T> for price history where indexed access is useful.",
          "Prevent invariant violations by hiding Add/Remove while keeping data accessible."
        ]
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IReadOnly.md",
    "isSection": true,
    "id": "card-242"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: IReadOnlyList<T> extends IReadOnlyCollection<T> and adds indexed access (this[int]). Use IReadOnlyList<T> when callers need random access without mutation."
      },
      {
        "type": "text",
        "content": "A: No. It prevents modification through the interface, but underlying data can still change. If the backing List<T> is modified, IReadOnlyCollection<T> reflects changes. Use ReadOnlyCollection<T> for true immutability."
      },
      {
        "type": "text",
        "content": "A: Yes. List<T> implements IReadOnlyCollection<T> and IReadOnlyList<T>. Casting is a zero-cost abstraction—no allocation or copying."
      },
      {
        "type": "text",
        "content": "A: ReadOnlyCollection<T> is a wrapper class that prevents modification entirely, even if you have the underlying list. IReadOnlyCollection<T> is an interface; if you cast back to List<T>, you can mutate."
      },
      {
        "type": "text",
        "content": "A: If Count and indexed access are useful to callers and data is already materialized (not lazy), yes. IReadOnlyList<T> is more informative without exposing mutability."
      },
      {
        "type": "text",
        "content": "A: Use ImmutableList<T> from System.Collections.Immutable. Modifications return new instances. Or wrap with new ReadOnlyCollection<T>(list)."
      },
      {
        "type": "text",
        "content": "A: Yes, arrays implement IReadOnlyList<T>. But callers can cast back to T[] and mutate. Use Array.AsReadOnly(array) for true protection."
      },
      {
        "type": "text",
        "content": "A: Identical. IReadOnlyList<T> is just an interface restriction. Indexing and iteration have the same performance as the underlying collection."
      },
      {
        "type": "text",
        "content": "A: Use arrays or List<T> directly. Most mocking frameworks can stub IReadOnlyCollection<T>, but real collections are often simpler in tests."
      },
      {
        "type": "text",
        "content": "A: When Count is useful to callers and data is already materialized. IEnumerable<T> is better for lazy sequences or when hiding collection semantics."
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IReadOnly.md",
    "isSection": true,
    "id": "card-243"
  },
  {
    "question": "IReadOnlyCollection<T> & IReadOnlyList<T> — Immutable Access",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class Portfolio\n{\n    private List<Position> _positions = new();\n\n    public List<Position> Positions => _positions; // exposes internal list\n}\n\n// Caller can mutate internal state\nvar portfolio = new Portfolio();\nportfolio.Positions.Add(new Position()); // breaks encapsulation\nportfolio.Positions.Clear(); // disaster!",
        "codeType": "bad"
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IReadOnly.md",
    "isConcept": true,
    "id": "card-244"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class Portfolio\n{\n    private List<Position> _positions = new();\n\n    public IReadOnlyCollection<Position> Positions => _positions;\n\n    public void AddPosition(Position position)\n    {\n        ValidatePosition(position);\n        _positions.Add(position);\n    }\n}\n\n// Caller can only read\nvar portfolio = new Portfolio();\nint count = portfolio.Positions.Count; // ✅ allowed\n// portfolio.Positions.Add(...); // ❌ compiler error",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "Collections-And-Enumerables",
    "source": "notes/Collections-And-Enumerables/IReadOnly.md",
    "isConcept": true,
    "id": "card-245"
  },
  {
    "question": "When would you choose .NET (Core/5+) over .NET Framework for a service?",
    "answer": [
      {
        "type": "text",
        "content": "Default to .NET for any new cross-platform, containerized, or cloud workload because you gain side-by-side deployments, self-contained publishing, trimming, and the latest GC/runtime improvements. Stick with .NET Framework only when you have heavy WinForms/WPF dependencies or Windows-only vendors you cannot port yet."
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "id": "card-246"
  },
  {
    "question": "How do framework-dependent and self-contained deployments change runtime management?",
    "answer": [
      {
        "type": "text",
        "content": "Framework-dependent deployments rely on the target machine’s installed runtime, which keeps packages smaller but couples you to host patch cadence. Self-contained deployments bundle the runtime/version with the app (dotnet publish -r linux-x64 --self-contained), increasing size but guaranteeing deterministic behavior and enabling multiple runtime versions per box—ideal for microservices."
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "id": "card-247"
  },
  {
    "question": "Can you explain the generational GC model and when to tune it?",
    "answer": [
      {
        "type": "text",
        "content": "The CLR splits the heap into Gen0/Gen1/Gen2 plus the LOH (>85 KB). Short-lived allocations collect in Gen0 and promote when they survive; long-lived objects reside in Gen2/LOH. Tuning usually means enabling server GC for ASP.NET workloads, pinning GC heaps per processor group, or activating background compaction for LOH fragmentation. Manual collections are almost never needed; instead fix allocation pressure (pool buffers, use Span<T>)."
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "id": "card-248"
  },
  {
    "question": "What criteria guide you in choosing between class, struct, record, or record struct?",
    "answer": [
      {
        "type": "text",
        "content": "Use class for reference semantics, inheritance, or large/mutable state. Choose record when you need concise immutable reference types with value-based equality (DTOs, commands). Reach for struct/record struct for tiny (≤16 bytes), immutable value types that must live inline to avoid allocations (e.g., PriceTick). Avoid large mutable structs since they copy by value and can hurt perf."
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "id": "card-249"
  },
  {
    "question": "How does the async/await state machine affect design choices?",
    "answer": [
      {
        "type": "text",
        "content": "Each async method compiles into a struct-based state machine that captures locals as fields and resumes via continuations. That means extra allocations when you capture the context. Use ConfigureAwait(false) in library/background code to skip marshaling to SynchronizationContext, avoid blocking on Task.Result to prevent deadlocks, and prefer async-friendly coordination primitives (SemaphoreSlim, channels)."
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "id": "card-250"
  },
  {
    "question": "When do you rely on Span<T>/Memory<T> and what are the constraints?",
    "answer": [
      {
        "type": "text",
        "content": "Use Span<T> for high-throughput parsing, slicing, and buffer pooling because it can project stack/heap/native memory without copying. It’s stack-only and cannot escape async boundaries, so wrap it in Memory<T> or ReadOnlyMemory<T> when you need to store it or await between operations. Combine with ArrayPool<T> or pipelines to minimize GC pressure."
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "id": "card-251"
  },
  {
    "question": "How do you avoid accidental boxing and heap churn with value types?",
    "answer": [
      {
        "type": "text",
        "content": "Stick to generic collections (List<T>, Dictionary<TKey,TValue>), avoid storing value types as object, and pass them by in reference when appropriate. When you need polymorphism, consider record struct + interfaces or type-safe discriminated unions rather than boxing."
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "id": "card-252"
  },
  {
    "question": "What pitfalls come with ASP.NET Core DI lifetimes?",
    "answer": [
      {
        "type": "text",
        "content": "Capturing a scoped service in a singleton causes cross-request state leakage and race conditions. Register lightweight, stateless services as transient; stateful caches/policies as singleton; and request-bound dependencies (DbContext, HttpClient handlers) as scoped. If you need scoped data inside singletons, flow it explicitly (e.g., IHttpContextAccessor, IOptionsSnapshot) or restructure dependencies."
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "id": "card-253"
  },
  {
    "question": "How do you design resilient outbound calls in .NET services?",
    "answer": [
      {
        "type": "text",
        "content": "Wrap HTTP/DB/broker calls with HttpClientFactory (typed clients), Polly policies for retries/circuit breakers/timeouts, and structured logging/metrics. Honor CancellationToken, propagate correlation IDs, and keep idempotency keys so at-least-once delivery doesn’t create duplicates. Use Task.WhenAll for fan-out, but cap concurrency via SemaphoreSlim to avoid exhausting sockets."
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "id": "card-254"
  },
  {
    "question": "What strategies ensure messaging idempotency and delivery guarantees?",
    "answer": [
      {
        "type": "text",
        "content": "For at-least-once systems like RabbitMQ/Kafka, include message IDs, dedupe tables, or optimistic concurrency checks so replays are safe. Prefer outbox/inbox patterns to bridge DB + queue consistency, and design consumers to handle duplicates (upserts, INSERT ... ON CONFLICT). Exactly-once semantics are simulated through idempotent consumers plus dedupe storage—not by relying on the broker alone."
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "id": "card-255"
  },
  {
    "question": "How do you articulate trade-offs between SQL and NoSQL from these notes?",
    "answer": [
      {
        "type": "text",
        "content": "SQL gives strict schema, ACID transactions, mature indexing, and complex queries (window functions). Use it for core trading entities where referential integrity matters. NoSQL (MongoDB, Redis) shines for flexible schemas, caching, and high-throughput document access, but you design for access patterns and enforce consistency in code. Often you pair them—SQL as source of truth, Redis for hot caches—with cache-aside and TTL discipline."
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "id": "card-256"
  },
  {
    "question": "What’s unique about integrating with MT4/MT5 from .NET?",
    "answer": [
      {
        "type": "text",
        "content": "MT4/5 expose broker APIs requiring bridge services for order routing and market-data streaming. Emphasize managing session lifecycles, low-latency tick handling, resilience to broker disconnects, and compliance logging. A typical solution ingests ticks, normalizes them, publishes over RabbitMQ, and exposes aggregated data via ASP.NET Core APIs with strict SLAs."
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "id": "card-257"
  },
  {
    "question": ".NET Core vs .NET Framework",
    "answer": [
      {
        "type": "list",
        "items": [
          "Platform reach: .NET Core/.NET (5+) is cross-platform and ships a self-contained runtime. .NET Framework stays Windows-only and upgrades via the OS.",
          "Deployment model: Publish as framework-dependent or self-contained. Self-contained bundles the runtime so each service can run side-by-side (dotnet publish -r linux-x64 --self-contained).",
          "Performance tooling:",
          "Kestrel is the default cross-platform web server—highlight HTTPS, HTTP/2, and libuv/socket transport choices.",
          "GC improvements (background server GC, heap compaction modes) arrive first in .NET Core.",
          "Trimming and ReadyToRun images shrink microservices and speed cold starts.",
          "When to pick which: Keep legacy WinForms/WPF on .NET Framework; new services, cloud workloads, or containerized apps go with .NET.",
          "Example: Containerized pricing API published as self-contained for deterministic runtime, while legacy back-office WinForms app remains on .NET Framework 4.8."
        ]
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "            ┌────────────────────┐\n            │   .NET Framework   │  Windows only, machine-wide\n            └────────────────────┘\n                     ▲\n                     │\n            ┌────────────────────┐\n            │   .NET (Core)      │  Cross-platform, per-app runtime\n            └────────────────────┘",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "isSection": true,
    "id": "card-258"
  },
  {
    "question": "CLR & Garbage Collector (GC)",
    "answer": [
      {
        "type": "list",
        "items": [
          "CLR & Garbage Collector (GC).md)",
          "CLR & Garbage Collector (GC) Practical Example%20Practical%20Example.md)",
          "struct vs class when to use which.md",
          "struct vs class questions and answers.md",
          "IDisposable & Deterministic Cleanup",
          "Forcing Garbage Collection (Rarely Needed)"
        ]
      },
      {
        "type": "list",
        "items": [
          "Generational model: Short-lived objects die young (Gen 0/1), long-lived promote to Gen 2. Large Object Heap (LOH) stores objects > 85 KB. NET Generational Garbage Collection (GC) Deep Dive.md%20Deep%20Dive.md)",
          "Server vs workstation GC: Server GC uses dedicated background threads per core—great for ASP.NET services. Workstation GC favors desktop responsiveness. Server vs Workstation GC.md",
          "Allocation discipline: Reduce allocations in hot paths (e.g., reuse buffers, pool objects, prefer Span<T>/Memory<T> to avoid copying).",
          "Span<T> usage: Operates on stack or native memory without allocations—perfect for parsing protocol frames or slicing arrays. Remember Span<T> is stack-only; use Memory<T> for async boundaries.",
          "Diagram:"
        ]
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "Gen0 ──► Gen1 ──► Gen2 ──► LOH\n small    medium   long     massive arrays/strings",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "isSection": true,
    "id": "card-259"
  },
  {
    "question": "Type Choices — class, record, struct, static (where & why)",
    "answer": [
      {
        "type": "text",
        "content": "The detailed guidance for choosing class, record, struct, and static types has been moved to a dedicated sub-note for easier maintenance and reuse:"
      },
      {
        "type": "list",
        "items": [
          "Type Choices — class, record, struct, static (where & why)"
        ]
      },
      {
        "type": "text",
        "content": "If you'd like the content kept inline instead, I can revert this change; otherwise the sub-note is ready for expansion."
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "isSection": true,
    "id": "card-260"
  },
  {
    "question": "Async/Await Deep Dive",
    "answer": [
      {
        "type": "list",
        "items": [
          "Async/Await Deep Dive reference",
          "State machine transformation: The compiler rewrites async methods into a struct-based state machine that awaits continuations. Local variables become fields, so keep them light.",
          "Context capture: UI/ASP.NET SynchronizationContext captures by default. Use ConfigureAwait(false) in libraries/background work to avoid deadlocks and excess marshaling.",
          "Exception propagation: Exceptions bubble through the returned Task; always await to observe them. For fire-and-forget work, capture exceptions via continuations or hosted services.",
          "Deadlock scenario: Blocking on task.Result inside a context that disallows re-entry (e.g., UI thread) stalls the continuation—keep the call chain async end-to-end.",
          "Lock coordination: lock is synchronous. Use SemaphoreSlim/AsyncLock when awaiting inside critical sections.",
          "Fan-out patterns: Use Task.WhenAll/Task.WhenAny to parallelize I/O and accept CancellationToken all the way through.",
          "I/O-bound gains: Use await for database calls, HTTP requests—threads return to the pool while awaiting.",
          "Example:"
        ]
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public async Task<Order> PlaceAsync(OrderRequest request)\n{\n    using var activity = _activitySource.StartActivity(\"PlaceOrder\");\n    var quote = await _pricingClient.GetQuoteAsync(request.Symbol)\n                                     .ConfigureAwait(false);\n    return await _orderGateway.ExecuteAsync(request with { Price = quote })\n                              .ConfigureAwait(false);\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "isSection": true,
    "id": "card-261"
  },
  {
    "question": "Reflection Basics",
    "answer": [
      {
        "type": "list",
        "items": [
          "Reflection Overview",
          "When to reach for it: Discover handlers, apply attributes, build dynamic proxies or serializers.",
          "Performance tip: Cache PropertyInfo/MethodInfo lookups or emit delegates to avoid repeated reflection overhead."
        ]
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "isSection": true,
    "id": "card-262"
  },
  {
    "question": "Value vs Reference Types",
    "answer": [
      {
        "type": "list",
        "items": [
          "Stack vs heap: Value types (struct, record struct) live inline; reference types allocate on the heap.",
          "Boxing/unboxing: Converting a value type to object boxes; avoid in hot loops (e.g., use generic collections over ArrayList).",
          "When to use structs: Keep them small (<16 bytes), immutable, and logically represent a single value (e.g., PriceTick with decimal Bid/Ask).",
          "record struct: Offers value semantics with concise syntax and generated equality members.",
          "Heap vs stack visualization:"
        ]
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "Stack Frame\n┌─────────────────────┐\n│ PriceTick tick;     │◄─ value copied\n└─────────────────────┘\n\nManaged Heap\n┌─────────────────────┐\n│ Order order ─────┐  │◄─ reference points here\n│   Id = 42        │  │\n└──────────────────┴──┘",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "isSection": true,
    "id": "card-263"
  },
  {
    "question": "Collections & LINQ",
    "answer": [
      {
        "type": "list",
        "items": [
          "Deferred execution: Query operators (e.g., Where, Select) defer work until enumerated. Beware of multiple iterations.",
          "IEnumerable<T> vs IQueryable<T>: IQueryable<T> builds an expression tree for remote providers (EF Core). Avoid running client-side filters inadvertently.",
          "Materialization: Use ToList()/ToArray() when you need a snapshot (e.g., before caching or multi-pass traversal).",
          "Avoid multiple enumeration: Cache results with var list = source.ToList(); if you'll iterate twice.",
          "Sorted Collections & Interview Talking Points",
          "Sorting Algorithms Interview Primer",
          "FIFO Queues in .NET",
          "Example:"
        ]
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var recentOrders = await _dbContext.Orders\n    .Where(o => o.ExecutedAt >= cutoff)\n    .OrderByDescending(o => o.ExecutedAt)\n    .Take(100)\n    .ToListAsync(); // materialize once before logging & response\n\nvar topSymbols = recentOrders\n    .GroupBy(o => o.Symbol)\n    .Select(g => new { Symbol = g.Key, Volume = g.Sum(o => o.Quantity) });",
        "codeType": "neutral"
      },
      {
        "type": "list",
        "items": [
          "Memory-friendly pipeline: Combine Span<T> + LINQ alternatives (ArrayPool<T>, ValueTask) when optimizing allocations."
        ]
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "isSection": true,
    "id": "card-264"
  },
  {
    "question": "Architecture & Patterns",
    "answer": [
      {
        "type": "list",
        "items": [
          "Arhcitecture-&-patterins-examples.md",
          "SOLID:",
          "Single Responsibility: Keep classes focused; e.g., split order validation from execution.",
          "Open/Closed: Extend via interfaces/inheritance; plug new execution channels without touching existing code.",
          "Liskov Substitution: Ensure derived classes honor base contracts—critical for strategy objects.",
          "Interface Segregation: Prefer fine-grained service contracts (e.g., IPriceFeed, ITradeExecutor).",
          "Dependency Inversion: Depend on abstractions; mention DI containers.",
          "Patterns to Highlight: Strategy (switching trading logic), Observer (market data broadcast), Factory (creating platform-specific handlers), CQRS (command/query split for trading ops), Decorator (enriching services with logging/caching).",
          "Decorator Pattern And Decorator wraps services with cross-cutting features like logging, caching, and retry without touching core logic.",
          "Factory Pattern The Factory pattern instantiates platform-specific executors like MT4/MT5.",
          "Observer Pattern The Observer pattern pushes ticks to multiple subscribers like charts and risk systems.",
          "CQRS Pattern CQRS splits commands like ‘PlaceOrder’ from queries like ‘GetOrder’.",
          "Strategy Pattern The Strategy pattern lets me swap trading logic dynamically (e.g., aggressive vs passive)."
        ]
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "isSection": true,
    "id": "card-265"
  },
  {
    "question": "ASP.NET Core & Service Design",
    "answer": [
      {
        "type": "list",
        "items": [
          "Pipeline: Middleware order, short-circuiting, exception handling, logging. Mention custom middleware for correlation IDs.",
          "Dependency Injection: Service lifetimes—singleton (stateless), scoped (per request), transient (lightweight). Know pitfalls of capturing scoped services in singletons. Dependency Injection Lifetimes at a Glance",
          "Controllers & Minimal APIs: Choosing between them, versioning strategies, attribute routing.",
          "Resilience: Use Polly for retries/circuit breakers, HttpClientFactory to avoid socket exhaustion, health checks, and structured logging."
        ]
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "isSection": true,
    "id": "card-266"
  },
  {
    "question": "Service Architecture Playbook",
    "answer": [
      {
        "type": "list",
        "items": [
          "Building Blocks: API gateway, service layer, message broker, background workers, caching, persistence, monitoring.",
          "Scalability: Horizontal scaling, stateless services, containerization, readiness/liveness probes.",
          "Observability: OpenTelemetry, distributed tracing, correlation IDs, dashboards with Grafana/Kibana.",
          "Security: OAuth2/JWT, refresh tokens, rate limiting, data encryption in transit and at rest."
        ]
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "isSection": true,
    "id": "card-267"
  },
  {
    "question": "Messaging & Distributed Coordination",
    "answer": [
      {
        "type": "list",
        "items": [
          "RabbitMQ: Broker-based AMQP with routing (fanout/topic/direct), acknowledgements, and durable queues. See RabbitMQ Deep Dive for operational notes, pros/cons, and .NET usage.",
          "ZeroMQ: Lightweight socket library without broker; great for high-throughput, but requires you to manage topology/reliability.",
          "Delivery Guarantees:",
          "At-most-once: Fast, risk of data loss.",
          "At-least-once: Requires idempotency.",
          "Exactly-once: Difficult; usually simulated with deduplication + idempotent consumers.",
          "Idempotency Strategies: Unique message IDs, dedupe stores, database upserts."
        ]
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "isSection": true,
    "id": "card-268"
  },
  {
    "question": "Data Layer Essentials",
    "answer": [
      {
        "type": "list",
        "items": [
          "SQL: Normalize core entities, use indexes (clustered vs non-clustered), parameterized queries, stored procs for heavy logic. Understand isolation levels (Read Committed default, Snapshot to reduce locks).",
          "Query Performance: Use execution plans, avoid SELECT *, prefer filtered indexes. For analytics, mention window functions.",
          "Transactions: ACID, handling distributed transactions via outbox pattern.",
          "NoSQL:",
          "MongoDB: Flexible schema, good for hierarchical data, but design for access patterns.",
          "Redis: In-memory cache, data structures (strings, hashes, sorted sets), TTLs, pub/sub, caching patterns (cache-aside, write-through)."
        ]
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "isSection": true,
    "id": "card-269"
  },
  {
    "question": "Trading & MT4/MT5 Context",
    "answer": [
      {
        "type": "list",
        "items": [
          "Platform Overview: MetaTrader platforms for forex/CFD trading. Provide APIs for order execution, account management, and market data.",
          "Integration Notes: Connect via bridge services or APIs, handle authentication, manage session state, process asynchronous events.",
          "Risk & Latency: Emphasize low-latency data processing, resilient error handling, and compliance logging.",
          "Example Use Case: Ingest tick data, normalize, publish via RabbitMQ, and expose aggregated prices through .NET service."
        ]
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "isSection": true,
    "id": "card-270"
  },
  {
    "question": "Behavioral Framing",
    "answer": [
      {
        "type": "list",
        "items": [
          "Ownership: Highlight times you drove initiatives end-to-end—especially performance optimizations or incident response.",
          "Collaboration: Discuss cross-team alignment (e.g., working with QA, DevOps, product).",
          "Pressure Handling: Production outages, tight deadlines—focus on calm triage, communication, and retrospectives.",
          "Continuous Improvement: Automation efforts, reducing manual ops, writing documentation."
        ]
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "isSection": true,
    "id": "card-271"
  },
  {
    "question": "Quick Formulas & Snippets",
    "answer": [
      {
        "type": "list",
        "items": [
          "Retry with Polly: Policy.Handle<HttpRequestException>().WaitAndRetryAsync(...)",
          "Parallel LINQ Caution: Use PLINQ sparingly; ensure thread safety.",
          "SQL Window Example: `sql SELECT AccountId, TradeId, Price, ROW_NUMBER() OVER (PARTITION BY AccountId ORDER BY ExecutedAt DESC) AS rn FROM Trades WHERE ExecutedAt >= DATEADD(day, -7, SYSUTCDATETIME()); `",
          "Cache-Aside Pattern: Try cache, fall back to DB, store result with TTL, handle cache invalidation on writes."
        ]
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "isSection": true,
    "id": "card-272"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: Default to .NET for any new cross-platform, containerized, or cloud workload because you gain side-by-side deployments, self-contained publishing, trimming, and the latest GC/runtime improvements. Stick with .NET Framework only when you have heavy WinForms/WPF dependencies or Windows-only vendors you cannot port yet."
      },
      {
        "type": "text",
        "content": "A: Framework-dependent deployments rely on the target machine’s installed runtime, which keeps packages smaller but couples you to host patch cadence. Self-contained deployments bundle the runtime/version with the app (dotnet publish -r linux-x64 --self-contained), increasing size but guaranteeing deterministic behavior and enabling multiple runtime versions per box—ideal for microservices."
      },
      {
        "type": "text",
        "content": "A: The CLR splits the heap into Gen0/Gen1/Gen2 plus the LOH (>85 KB). Short-lived allocations collect in Gen0 and promote when they survive; long-lived objects reside in Gen2/LOH. Tuning usually means enabling server GC for ASP.NET workloads, pinning GC heaps per processor group, or activating background compaction for LOH fragmentation. Manual collections are almost never needed; instead fix allocation pressure (pool buffers, use Span<T>)."
      },
      {
        "type": "text",
        "content": "A: Use class for reference semantics, inheritance, or large/mutable state. Choose record when you need concise immutable reference types with value-based equality (DTOs, commands). Reach for struct/record struct for tiny (≤16 bytes), immutable value types that must live inline to avoid allocations (e.g., PriceTick). Avoid large mutable structs since they copy by value and can hurt perf."
      },
      {
        "type": "text",
        "content": "A: Each async method compiles into a struct-based state machine that captures locals as fields and resumes via continuations. That means extra allocations when you capture the context. Use ConfigureAwait(false) in library/background code to skip marshaling to SynchronizationContext, avoid blocking on Task.Result to prevent deadlocks, and prefer async-friendly coordination primitives (SemaphoreSlim, channels)."
      },
      {
        "type": "text",
        "content": "A: Use Span<T> for high-throughput parsing, slicing, and buffer pooling because it can project stack/heap/native memory without copying. It’s stack-only and cannot escape async boundaries, so wrap it in Memory<T> or ReadOnlyMemory<T> when you need to store it or await between operations. Combine with ArrayPool<T> or pipelines to minimize GC pressure."
      },
      {
        "type": "text",
        "content": "A: Stick to generic collections (List<T>, Dictionary<TKey,TValue>), avoid storing value types as object, and pass them by in reference when appropriate. When you need polymorphism, consider record struct + interfaces or type-safe discriminated unions rather than boxing."
      },
      {
        "type": "text",
        "content": "A: Capturing a scoped service in a singleton causes cross-request state leakage and race conditions. Register lightweight, stateless services as transient; stateful caches/policies as singleton; and request-bound dependencies (DbContext, HttpClient handlers) as scoped. If you need scoped data inside singletons, flow it explicitly (e.g., IHttpContextAccessor, IOptionsSnapshot) or restructure dependencies."
      },
      {
        "type": "text",
        "content": "A: Wrap HTTP/DB/broker calls with HttpClientFactory (typed clients), Polly policies for retries/circuit breakers/timeouts, and structured logging/metrics. Honor CancellationToken, propagate correlation IDs, and keep idempotency keys so at-least-once delivery doesn’t create duplicates. Use Task.WhenAll for fan-out, but cap concurrency via SemaphoreSlim to avoid exhausting sockets."
      },
      {
        "type": "text",
        "content": "A: For at-least-once systems like RabbitMQ/Kafka, include message IDs, dedupe tables, or optimistic concurrency checks so replays are safe. Prefer outbox/inbox patterns to bridge DB + queue consistency, and design consumers to handle duplicates (upserts, INSERT ... ON CONFLICT). Exactly-once semantics are simulated through idempotent consumers plus dedupe storage—not by relying on the broker alone."
      },
      {
        "type": "text",
        "content": "A: SQL gives strict schema, ACID transactions, mature indexing, and complex queries (window functions). Use it for core trading entities where referential integrity matters. NoSQL (MongoDB, Redis) shines for flexible schemas, caching, and high-throughput document access, but you design for access patterns and enforce consistency in code. Often you pair them—SQL as source of truth, Redis for hot caches—with cache-aside and TTL discipline."
      },
      {
        "type": "text",
        "content": "A: MT4/5 expose broker APIs requiring bridge services for order routing and market-data streaming. Emphasize managing session lifecycles, low-latency tick handling, resilience to broker disconnects, and compliance logging. A typical solution ingests ticks, normalizes them, publishes over RabbitMQ, and exposes aggregated data via ASP.NET Core APIs with strict SLAs."
      }
    ],
    "category": "notes",
    "topic": "core-concepts.md",
    "source": "notes/core-concepts.md",
    "isSection": true,
    "id": "card-273"
  },
  {
    "question": "Why split commands and queries in a trading platform?",
    "answer": [
      {
        "type": "text",
        "content": "It allows optimizing writes (placing trades, cancelling orders) separately from reads (dashboards, risk reports). Each side scales independently, and commands can enforce invariants while queries use denormalized projections for speed."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/CQRS Pattern.md",
    "id": "card-274"
  },
  {
    "question": "How does CQRS relate to MediatR in .NET?",
    "answer": [
      {
        "type": "text",
        "content": "MediatR naturally models CQRS—commands and queries implement IRequest<T> handled by dedicated handlers. Pipeline behaviors add validation, logging, or retries without mixing concerns."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/CQRS Pattern.md",
    "id": "card-275"
  },
  {
    "question": "Do commands ever return values?",
    "answer": [
      {
        "type": "text",
        "content": "Prefer returning void or minimal identifiers, encouraging clients to query for the latest state separately. This keeps commands focused on side effects and simplifies testing."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/CQRS Pattern.md",
    "id": "card-276"
  },
  {
    "question": "How do you keep read models updated?",
    "answer": [
      {
        "type": "text",
        "content": "Use domain events or the outbox pattern to publish changes that projection handlers consume. They update materialized views, caches, or search indexes asynchronously."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/CQRS Pattern.md",
    "id": "card-277"
  },
  {
    "question": "How does CQRS enable event sourcing?",
    "answer": [
      {
        "type": "text",
        "content": "Commands append events to a store. Queries rebuild state or read from projections fed by those events. This provides a complete audit trail for compliance-heavy domains."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/CQRS Pattern.md",
    "id": "card-278"
  },
  {
    "question": "When is CQRS overkill?",
    "answer": [
      {
        "type": "text",
        "content": "For small services with simple CRUD needs, splitting handlers adds complexity. Start simple and adopt CQRS when read/write workloads diverge or when you need auditability and segregation."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/CQRS Pattern.md",
    "id": "card-279"
  },
  {
    "question": "How do you enforce validation and authorization?",
    "answer": [
      {
        "type": "text",
        "content": "Apply behaviors or decorators on the command pipeline to run validators and authorization checks pre-handler. Queries can apply read-specific policies separately."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/CQRS Pattern.md",
    "id": "card-280"
  },
  {
    "question": "How does CQRS aid scaling databases?",
    "answer": [
      {
        "type": "text",
        "content": "Commands can target a write-optimized store (e.g., SQL with strict constraints) while queries hit read replicas or NoSQL caches tuned for fast lookups. This reduces contention and lock waits."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/CQRS Pattern.md",
    "id": "card-281"
  },
  {
    "question": "How do you test CQRS handlers?",
    "answer": [
      {
        "type": "text",
        "content": "Unit test commands with mocked dependencies to assert events or repository calls. Integration test queries against seed data or projections to ensure mapping and filtering work as expected."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/CQRS Pattern.md",
    "id": "card-282"
  },
  {
    "question": "How do you handle consistency between reads and writes?",
    "answer": [
      {
        "type": "text",
        "content": "Accept eventual consistency for views, communicate lag expectations, and provide read-your-writes mechanisms when necessary (e.g., direct query fallback or wait-for-projection acknowledgments)."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/CQRS Pattern.md",
    "id": "card-283"
  },
  {
    "question": "🧩 Example — PlaceOrder (Command) vs GetOrder (Query)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public record PlaceOrderCommand(string Symbol, double Amount);\npublic record GetOrderQuery(Guid OrderId);\n\npublic class Order\n{\n    public Guid Id { get; set; } = Guid.NewGuid();\n    public string Symbol { get; set; }\n    public double Amount { get; set; }\n}\n\npublic class OrderCommandHandler\n{\n    private readonly ITradeExecutor _executor;\n\n    public OrderCommandHandler(ITradeExecutor executor) => _executor = executor;\n\n    public void Handle(PlaceOrderCommand command)\n    {\n        var order = new Order { Symbol = command.Symbol, Amount = command.Amount };\n        _executor.Execute(order);\n    }\n}\n\npublic class OrderQueryHandler\n{\n    private readonly Dictionary<Guid, Order> _orders = new();\n\n    public Order Handle(GetOrderQuery query)\n        => _orders.TryGetValue(query.OrderId, out var order)\n            ? order\n            : throw new KeyNotFoundException(\"Order not found\");\n}\n\n// --- Usage ---\nvar executor = new Mt5Executor();\nvar commandHandler = new OrderCommandHandler(executor);\ncommandHandler.Handle(new PlaceOrderCommand(\"EURUSD\", 1000));\n\nvar queryHandler = new OrderQueryHandler();\n// queryHandler.Handle(new GetOrderQuery(...));",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "✅ Why it matters:"
      },
      {
        "type": "list",
        "items": [
          "Commands → mutate state (place/cancel order).",
          "Queries → fetch data (get portfolio, prices).",
          "Enables scalability (separate read/write services) and event sourcing (audit trading actions)."
        ]
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/CQRS Pattern.md",
    "isSection": true,
    "id": "card-284"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: It allows optimizing writes (placing trades, cancelling orders) separately from reads (dashboards, risk reports). Each side scales independently, and commands can enforce invariants while queries use denormalized projections for speed."
      },
      {
        "type": "text",
        "content": "A: MediatR naturally models CQRS—commands and queries implement IRequest<T> handled by dedicated handlers. Pipeline behaviors add validation, logging, or retries without mixing concerns."
      },
      {
        "type": "text",
        "content": "A: Prefer returning void or minimal identifiers, encouraging clients to query for the latest state separately. This keeps commands focused on side effects and simplifies testing."
      },
      {
        "type": "text",
        "content": "A: Use domain events or the outbox pattern to publish changes that projection handlers consume. They update materialized views, caches, or search indexes asynchronously."
      },
      {
        "type": "text",
        "content": "A: Commands append events to a store. Queries rebuild state or read from projections fed by those events. This provides a complete audit trail for compliance-heavy domains."
      },
      {
        "type": "text",
        "content": "A: For small services with simple CRUD needs, splitting handlers adds complexity. Start simple and adopt CQRS when read/write workloads diverge or when you need auditability and segregation."
      },
      {
        "type": "text",
        "content": "A: Apply behaviors or decorators on the command pipeline to run validators and authorization checks pre-handler. Queries can apply read-specific policies separately."
      },
      {
        "type": "text",
        "content": "A: Commands can target a write-optimized store (e.g., SQL with strict constraints) while queries hit read replicas or NoSQL caches tuned for fast lookups. This reduces contention and lock waits."
      },
      {
        "type": "text",
        "content": "A: Unit test commands with mocked dependencies to assert events or repository calls. Integration test queries against seed data or projections to ensure mapping and filtering work as expected."
      },
      {
        "type": "text",
        "content": "A: Accept eventual consistency for views, communicate lag expectations, and provide read-your-writes mechanisms when necessary (e.g., direct query fallback or wait-for-projection acknowledgments)."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/CQRS Pattern.md",
    "isSection": true,
    "id": "card-285"
  },
  {
    "question": "Why use decorators instead of inheritance for cross-cutting behavior?",
    "answer": [
      {
        "type": "text",
        "content": "Decorators wrap existing implementations at runtime without modifying classes or exploding inheritance hierarchies. They preserve the original behavior and let you compose features like logging, caching, and retries in any order."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Decorator Pattern.md",
    "id": "card-286"
  },
  {
    "question": "How do you wire decorators with ASP.NET Core DI?",
    "answer": [
      {
        "type": "text",
        "content": "Register the core implementation and then use services.Decorate<IPriceService, LoggingPriceService>(); (via Scrutor) or manual factory delegates to wrap dependencies in the desired order."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Decorator Pattern.md",
    "id": "card-287"
  },
  {
    "question": "How do decorators interact with async services?",
    "answer": [
      {
        "type": "text",
        "content": "Implement Task-returning methods and ensure decorators await the inner call, adding behavior before/after. For example, a retry decorator can wrap await _inner.ExecuteAsync(...) in Polly policies."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Decorator Pattern.md",
    "id": "card-288"
  },
  {
    "question": "How do you prevent duplicate decoration?",
    "answer": [
      {
        "type": "text",
        "content": "Centralize registration so each service gets decorated once. Use DI scanning rules or tests to ensure there’s a single decorator pipeline per service type."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Decorator Pattern.md",
    "id": "card-289"
  },
  {
    "question": "When does the decorator pattern become overkill?",
    "answer": [
      {
        "type": "text",
        "content": "If you only need a single concern (e.g., logging) or behavior is global (middleware), decorators might be unnecessary. Use them when behaviors vary per service or must be combined flexibly."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Decorator Pattern.md",
    "id": "card-290"
  },
  {
    "question": "How does decorator order affect behavior?",
    "answer": [
      {
        "type": "text",
        "content": "Order matters—logging outside caching sees all calls, while caching outside logging hides repeated hits. Be intentional about stacking order and document expectations."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Decorator Pattern.md",
    "id": "card-291"
  },
  {
    "question": "How do you share state between decorators?",
    "answer": [
      {
        "type": "text",
        "content": "Pass shared dependencies (e.g., metrics registry) into each decorator via DI, or include context objects in method parameters so decorators can enrich them without coupling."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Decorator Pattern.md",
    "id": "card-292"
  },
  {
    "question": "Can decorators modify return types?",
    "answer": [
      {
        "type": "text",
        "content": "They should adhere to the same interface, but they can wrap results (e.g., attach metadata) or transform responses before returning. Keep transformations predictable so callers aren’t surprised."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Decorator Pattern.md",
    "id": "card-293"
  },
  {
    "question": "How do you unit test decorators?",
    "answer": [
      {
        "type": "text",
        "content": "Provide a fake inner service and assert the decorator calls it and adds the expected behavior (logging, caching, etc.). Since decorators depend on the same interface, tests remain simple."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Decorator Pattern.md",
    "id": "card-294"
  },
  {
    "question": "How do decorators compare to middleware?",
    "answer": [
      {
        "type": "text",
        "content": "Middleware operates at the application pipeline level (HTTP). Decorators operate at service boundaries, allowing fine-grained per-service behavior and reusability outside web pipelines."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Decorator Pattern.md",
    "id": "card-295"
  },
  {
    "question": "🧩 Example — Logging + Caching decorators for an API service",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface IPriceService\n{\n    double GetPrice(string symbol);\n}\n\npublic class RealPriceService : IPriceService\n{\n    public double GetPrice(string symbol)\n    {\n        Console.WriteLine($\"Fetching {symbol} from API...\");\n        return symbol switch\n        {\n            \"EURUSD\" => 1.0745,\n            \"GBPUSD\" => 1.2459,\n            _ => 0.0\n        };\n    }\n}\n\n// --- Logging decorator ---\npublic class LoggingPriceService : IPriceService\n{\n    private readonly IPriceService _inner;\n    public LoggingPriceService(IPriceService inner) => _inner = inner;\n\n    public double GetPrice(string symbol)\n    {\n        Console.WriteLine($\"[LOG] Requesting {symbol}\");\n        var price = _inner.GetPrice(symbol);\n        Console.WriteLine($\"[LOG] {symbol} = {price}\");\n        return price;\n    }\n}\n\n// --- Caching decorator ---\npublic class CachingPriceService : IPriceService\n{\n    private readonly IPriceService _inner;\n    private readonly Dictionary<string, double> _cache = new();\n\n    public CachingPriceService(IPriceService inner) => _inner = inner;\n\n    public double GetPrice(string symbol)\n    {\n        if (_cache.TryGetValue(symbol, out var cached))\n            return cached;\n\n        var price = _inner.GetPrice(symbol);\n        _cache[symbol] = price;\n        return price;\n    }\n}\n\n// --- Usage ---\nvar service = new LoggingPriceService(new CachingPriceService(new RealPriceService()));\n\nConsole.WriteLine(service.GetPrice(\"EURUSD\"));\nConsole.WriteLine(service.GetPrice(\"EURUSD\")); // second call cached",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "✅ Why it matters:"
      },
      {
        "type": "list",
        "items": [
          "Wraps cross-cutting behavior (logging, caching, retries, metrics) around core logic.",
          "Keeps core services clean and focused.",
          "Combine decorators freely (e.g., logging → caching → retry)."
        ]
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Decorator Pattern.md",
    "isSection": true,
    "id": "card-296"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: Decorators wrap existing implementations at runtime without modifying classes or exploding inheritance hierarchies. They preserve the original behavior and let you compose features like logging, caching, and retries in any order."
      },
      {
        "type": "text",
        "content": "A: Register the core implementation and then use services.Decorate<IPriceService, LoggingPriceService>(); (via Scrutor) or manual factory delegates to wrap dependencies in the desired order."
      },
      {
        "type": "text",
        "content": "A: Implement Task-returning methods and ensure decorators await the inner call, adding behavior before/after. For example, a retry decorator can wrap await _inner.ExecuteAsync(...) in Polly policies."
      },
      {
        "type": "text",
        "content": "A: Centralize registration so each service gets decorated once. Use DI scanning rules or tests to ensure there’s a single decorator pipeline per service type."
      },
      {
        "type": "text",
        "content": "A: If you only need a single concern (e.g., logging) or behavior is global (middleware), decorators might be unnecessary. Use them when behaviors vary per service or must be combined flexibly."
      },
      {
        "type": "text",
        "content": "A: Order matters—logging outside caching sees all calls, while caching outside logging hides repeated hits. Be intentional about stacking order and document expectations."
      },
      {
        "type": "text",
        "content": "A: Pass shared dependencies (e.g., metrics registry) into each decorator via DI, or include context objects in method parameters so decorators can enrich them without coupling."
      },
      {
        "type": "text",
        "content": "A: They should adhere to the same interface, but they can wrap results (e.g., attach metadata) or transform responses before returning. Keep transformations predictable so callers aren’t surprised."
      },
      {
        "type": "text",
        "content": "A: Provide a fake inner service and assert the decorator calls it and adds the expected behavior (logging, caching, etc.). Since decorators depend on the same interface, tests remain simple."
      },
      {
        "type": "text",
        "content": "A: Middleware operates at the application pipeline level (HTTP). Decorators operate at service boundaries, allowing fine-grained per-service behavior and reusability outside web pipelines."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Decorator Pattern.md",
    "isSection": true,
    "id": "card-297"
  },
  {
    "question": "When should you use a Factory pattern in .NET services?",
    "answer": [
      {
        "type": "text",
        "content": "When object creation depends on runtime context (config, tenant, instrument) and you want to isolate creation logic from consumers. Factories prevent scattered new calls and keep construction consistent."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Factory Pattern.md",
    "id": "card-298"
  },
  {
    "question": "How does DI interact with factories?",
    "answer": [
      {
        "type": "text",
        "content": "You can register implementations in DI and inject Func<Key, ITradeExecutor> or an IExecutorFactory that resolves services by key. This keeps factories composable with scoped dependencies."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Factory Pattern.md",
    "id": "card-299"
  },
  {
    "question": "How do you avoid giant switch statements as platforms grow?",
    "answer": [
      {
        "type": "text",
        "content": "Use a dictionary of delegates, reflection-based registration, or DI IServiceProvider lookups keyed by platform. Alternatively, combine with the Strategy pattern so each executor registers itself."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Factory Pattern.md",
    "id": "card-300"
  },
  {
    "question": "What’s the benefit of abstract factories?",
    "answer": [
      {
        "type": "text",
        "content": "When you need to create families of related objects (e.g., executor + validator + serializer per platform), an abstract factory ensures compatible components are produced together."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Factory Pattern.md",
    "id": "card-301"
  },
  {
    "question": "How do factories aid testing?",
    "answer": [
      {
        "type": "text",
        "content": "Tests can inject fake factories returning mock executors, isolating code under test without hitting real integrations. It also simplifies verifying that the correct executor is chosen for a scenario."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Factory Pattern.md",
    "id": "card-302"
  },
  {
    "question": "How do you handle configuration-driven factories?",
    "answer": [
      {
        "type": "text",
        "content": "Load mappings from configuration or feature flags, then let the factory instantiate types via DI. This enables runtime toggles (e.g., route VIP tenants to a premium executor) without code changes."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Factory Pattern.md",
    "id": "card-303"
  },
  {
    "question": "When is the factory pattern overkill?",
    "answer": [
      {
        "type": "text",
        "content": "When only two concrete types exist and creation logic is trivial. Start simple, and introduce a factory once switching logic repeats or needs shared validation/logging."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Factory Pattern.md",
    "id": "card-304"
  },
  {
    "question": "How do you ensure factories remain SRP-compliant?",
    "answer": [
      {
        "type": "text",
        "content": "Keep them focused on creation. Any orchestration, validation, or logging should be delegated to other components or decorators so factories don't become god objects."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Factory Pattern.md",
    "id": "card-305"
  },
  {
    "question": "Can factories return async results?",
    "answer": [
      {
        "type": "text",
        "content": "Yes—define methods returning Task<T> if creation involves I/O (e.g., pulling secrets). Just ensure callers understand the lifecycle and avoid blocking .Result."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Factory Pattern.md",
    "id": "card-306"
  },
  {
    "question": "How do you register factories in DI?",
    "answer": [
      {
        "type": "text",
        "content": "Register each concrete type and a factory delegate: services.AddTransient<ExecutorFactory>(); or services.AddSingleton<Func<string, ITradeExecutor>>(provider => key => provider.GetRequiredKeyedService<ITradeExecutor>(key));."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Factory Pattern.md",
    "id": "card-307"
  },
  {
    "question": "🧩 Example — Trading platform executor factory",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface ITradeExecutor\n{\n    void Execute(Order order);\n}\n\npublic class Mt4Executor : ITradeExecutor\n{\n    public void Execute(Order order) =>\n        Console.WriteLine($\"[MT4] Executing {order.Symbol}\");\n}\n\npublic class Mt5Executor : ITradeExecutor\n{\n    public void Execute(Order order) =>\n        Console.WriteLine($\"[MT5] Executing {order.Symbol}\");\n}\n\npublic static class ExecutorFactory\n{\n    public static ITradeExecutor Create(string platform) => platform switch\n    {\n        \"MT4\" => new Mt4Executor(),\n        \"MT5\" => new Mt5Executor(),\n        _ => throw new ArgumentException(\"Unknown platform\")\n    };\n}\n\n// --- Usage ---\nvar platform = \"MT5\";\nvar executor = ExecutorFactory.Create(platform);\nexecutor.Execute(new Order { Symbol = \"USDJPY\", Amount = 5000 });",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "✅ Why it matters:"
      },
      {
        "type": "list",
        "items": [
          "Simplifies platform switching (MT4, MT5, FIX, cTrader).",
          "New platforms require no refactor — just a new class and switch entry."
        ]
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Factory Pattern.md",
    "isSection": true,
    "id": "card-308"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: When object creation depends on runtime context (config, tenant, instrument) and you want to isolate creation logic from consumers. Factories prevent scattered new calls and keep construction consistent."
      },
      {
        "type": "text",
        "content": "A: You can register implementations in DI and inject Func<Key, ITradeExecutor> or an IExecutorFactory that resolves services by key. This keeps factories composable with scoped dependencies."
      },
      {
        "type": "text",
        "content": "A: Use a dictionary of delegates, reflection-based registration, or DI IServiceProvider lookups keyed by platform. Alternatively, combine with the Strategy pattern so each executor registers itself."
      },
      {
        "type": "text",
        "content": "A: When you need to create families of related objects (e.g., executor + validator + serializer per platform), an abstract factory ensures compatible components are produced together."
      },
      {
        "type": "text",
        "content": "A: Tests can inject fake factories returning mock executors, isolating code under test without hitting real integrations. It also simplifies verifying that the correct executor is chosen for a scenario."
      },
      {
        "type": "text",
        "content": "A: Load mappings from configuration or feature flags, then let the factory instantiate types via DI. This enables runtime toggles (e.g., route VIP tenants to a premium executor) without code changes."
      },
      {
        "type": "text",
        "content": "A: When only two concrete types exist and creation logic is trivial. Start simple, and introduce a factory once switching logic repeats or needs shared validation/logging."
      },
      {
        "type": "text",
        "content": "A: Keep them focused on creation. Any orchestration, validation, or logging should be delegated to other components or decorators so factories don't become god objects."
      },
      {
        "type": "text",
        "content": "A: Yes—define methods returning Task<T> if creation involves I/O (e.g., pulling secrets). Just ensure callers understand the lifecycle and avoid blocking .Result."
      },
      {
        "type": "text",
        "content": "A: Register each concrete type and a factory delegate: services.AddTransient<ExecutorFactory>(); or services.AddSingleton<Func<string, ITradeExecutor>>(provider => key => provider.GetRequiredKeyedService<ITradeExecutor>(key));."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Factory Pattern.md",
    "isSection": true,
    "id": "card-309"
  },
  {
    "question": "What problem does the Mediator pattern solve?",
    "answer": [
      {
        "type": "text",
        "content": "It avoids spaghetti dependencies among collaborating components (validator, risk, executor) by centralizing communication in a mediator. Components interact via the mediator instead of referencing each other directly."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Mediator Pattern.md",
    "id": "card-310"
  },
  {
    "question": "How does MediatR implement the Mediator pattern in .NET?",
    "answer": [
      {
        "type": "text",
        "content": "MediatR routes requests (commands/queries/notifications) to their handlers through a central mediator, letting senders remain unaware of receivers. Pipeline behaviors provide cross-cutting features without tight coupling."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Mediator Pattern.md",
    "id": "card-311"
  },
  {
    "question": "When would you build a custom mediator vs using MediatR?",
    "answer": [
      {
        "type": "text",
        "content": "Use MediatR for request/response flows in application layers. Build custom mediators when orchestrating domain services with bespoke protocols or when you need full control over orchestration semantics."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Mediator Pattern.md",
    "id": "card-312"
  },
  {
    "question": "How do mediators improve testability?",
    "answer": [
      {
        "type": "text",
        "content": "Components depend only on the mediator interface, so tests can supply stub mediators to assert interactions. You can validate coordination logic by testing the mediator in isolation."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Mediator Pattern.md",
    "id": "card-313"
  },
  {
    "question": "What’s a downside of mediators?",
    "answer": [
      {
        "type": "text",
        "content": "The mediator can become a god object if it accumulates too much logic. Mitigate by splitting mediators per feature or layering policies/pipeline behaviors to keep responsibilities focused."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Mediator Pattern.md",
    "id": "card-314"
  },
  {
    "question": "How do you prevent mediator logic from duplicating domain rules?",
    "answer": [
      {
        "type": "text",
        "content": "Keep mediators focused on coordination (who to notify next) and delegate business invariants to domain services/entities. If logic belongs to the domain, move it there rather than hiding it in the mediator."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Mediator Pattern.md",
    "id": "card-315"
  },
  {
    "question": "How do you handle asynchronous workflows with a mediator?",
    "answer": [
      {
        "type": "text",
        "content": "Define async methods (Task NotifyAsync(...)) and await dependent operations. MediatR supports async handlers out of the box, ensuring non-blocking orchestration."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Mediator Pattern.md",
    "id": "card-316"
  },
  {
    "question": "What patterns complement mediators?",
    "answer": [
      {
        "type": "text",
        "content": "Combine with CQRS (commands/queries flow through the mediator), decorators (pipeline behaviors like logging/validation), and event sourcing (mediator publishes domain events)."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Mediator Pattern.md",
    "id": "card-317"
  },
  {
    "question": "How can mediators support extensibility?",
    "answer": [
      {
        "type": "text",
        "content": "Register handlers or collaborators via DI so new behaviors can be added without changing existing code. For example, add a compliance handler to the notification pipeline without modifying producer services."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Mediator Pattern.md",
    "id": "card-318"
  },
  {
    "question": "How do you monitor mediator pipelines?",
    "answer": [
      {
        "type": "text",
        "content": "Instrument pipeline behaviors or interceptors to log request duration, handler outcomes, and errors. This keeps observability centralized and avoids duplicating logging in every handler."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Mediator Pattern.md",
    "id": "card-319"
  },
  {
    "question": "🧩 Example — Mediator coordinating order validation, risk and execution",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface ITradeMediator\n{\n    void Notify(object sender, string ev, Order order);\n}\n\npublic class TradeMediator : ITradeMediator\n{\n    private readonly OrderValidator _validator;\n    private readonly RiskService _risk;\n    private readonly TradeExecutor _executor;\n\n    public TradeMediator(OrderValidator validator, RiskService risk, TradeExecutor executor)\n    {\n        _validator = validator;\n        _risk = risk;\n        _executor = executor;\n    }\n\n    public void Notify(object sender, string ev, Order order)\n    {\n        if (ev == \"PlaceOrder\")\n        {\n            if (!_validator.Validate(order))\n            {\n                Console.WriteLine(\"Validation failed\");\n                return;\n            }\n\n            if (!_risk.Check(order))\n            {\n                Console.WriteLine(\"Risk check failed\");\n                return;\n            }\n\n            _executor.Execute(order);\n        }\n    }\n}\n\npublic class OrderValidator\n{\n    private readonly ITradeMediator _mediator;\n    public OrderValidator(ITradeMediator mediator) => _mediator = mediator;\n    public bool Validate(Order order) => order != null && order.Amount > 0;\n}\n\npublic class RiskService\n{\n    private readonly ITradeMediator _mediator;\n    public RiskService(ITradeMediator mediator) => _mediator = mediator;\n    public bool Check(Order order) => order.Amount <= 100000; // simple rule\n}\n\npublic class TradeExecutor\n{\n    private readonly ITradeMediator _mediator;\n    public TradeExecutor(ITradeMediator mediator) => _mediator = mediator;\n    public void Execute(Order order) => Console.WriteLine($\"Executed {order.Id} for {order.Amount}\");\n}\n\n// --- Usage ---\n// Compose mediator with concrete components\n// var mediator = new TradeMediator(new OrderValidator(null), new RiskService(null), new TradeExecutor(null));\n// Wire mediator into components and use mediator.Notify(this, \"PlaceOrder\", order);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "✅ Why it matters:"
      },
      {
        "type": "list",
        "items": [
          "Centralizes interaction logic between components (validation, risk, execution).",
          "Reduces direct dependencies between components, improving testability and maintainability.",
          "Makes it easier to change coordination rules without touching each component."
        ]
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Mediator Pattern.md",
    "isSection": true,
    "id": "card-320"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: It avoids spaghetti dependencies among collaborating components (validator, risk, executor) by centralizing communication in a mediator. Components interact via the mediator instead of referencing each other directly."
      },
      {
        "type": "text",
        "content": "A: MediatR routes requests (commands/queries/notifications) to their handlers through a central mediator, letting senders remain unaware of receivers. Pipeline behaviors provide cross-cutting features without tight coupling."
      },
      {
        "type": "text",
        "content": "A: Use MediatR for request/response flows in application layers. Build custom mediators when orchestrating domain services with bespoke protocols or when you need full control over orchestration semantics."
      },
      {
        "type": "text",
        "content": "A: Components depend only on the mediator interface, so tests can supply stub mediators to assert interactions. You can validate coordination logic by testing the mediator in isolation."
      },
      {
        "type": "text",
        "content": "A: The mediator can become a god object if it accumulates too much logic. Mitigate by splitting mediators per feature or layering policies/pipeline behaviors to keep responsibilities focused."
      },
      {
        "type": "text",
        "content": "A: Keep mediators focused on coordination (who to notify next) and delegate business invariants to domain services/entities. If logic belongs to the domain, move it there rather than hiding it in the mediator."
      },
      {
        "type": "text",
        "content": "A: Define async methods (Task NotifyAsync(...)) and await dependent operations. MediatR supports async handlers out of the box, ensuring non-blocking orchestration."
      },
      {
        "type": "text",
        "content": "A: Combine with CQRS (commands/queries flow through the mediator), decorators (pipeline behaviors like logging/validation), and event sourcing (mediator publishes domain events)."
      },
      {
        "type": "text",
        "content": "A: Register handlers or collaborators via DI so new behaviors can be added without changing existing code. For example, add a compliance handler to the notification pipeline without modifying producer services."
      },
      {
        "type": "text",
        "content": "A: Instrument pipeline behaviors or interceptors to log request duration, handler outcomes, and errors. This keeps observability centralized and avoids duplicating logging in every handler."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Mediator Pattern.md",
    "isSection": true,
    "id": "card-321"
  },
  {
    "question": "When do you reach for the Observer pattern in .NET systems?",
    "answer": [
      {
        "type": "text",
        "content": "Whenever multiple components need to react to the same event stream—market ticks, order fills, health changes—without tight coupling. It decouples publishers from subscribers so you can add/remove listeners without touching producers."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Observer Pattern.md",
    "id": "card-322"
  },
  {
    "question": "How does Observer compare to pub/sub messaging?",
    "answer": [
      {
        "type": "text",
        "content": "Observer is in-process and synchronous (events raised inside the same app), while pub/sub uses brokers for cross-process communication. Start with Observer for local notifications; graduate to brokers (RabbitMQ, Kafka) for distributed systems."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Observer Pattern.md",
    "id": "card-323"
  },
  {
    "question": "How do you prevent event handlers from crashing the publisher?",
    "answer": [
      {
        "type": "text",
        "content": "Wrap subscriber invocations in try/catch, run them asynchronously, or use mediator pipelines that isolate failures. Consider IObservable<T> + Rx to provide built-in error handling semantics."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Observer Pattern.md",
    "id": "card-324"
  },
  {
    "question": "How do you unsubscribe to avoid memory leaks?",
    "answer": [
      {
        "type": "text",
        "content": "Keep references to event handlers and detach them (feed.OnTick -= handler). With IObservable<T>, dispose the subscription. In DI scenarios, use weak references or lifetime-managed subscriptions."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Observer Pattern.md",
    "id": "card-325"
  },
  {
    "question": "When would you use IObservable<T>/Reactive Extensions instead of custom events?",
    "answer": [
      {
        "type": "text",
        "content": "When you need advanced operators (buffering, throttling, filtering) or asynchronous streams. Rx provides a richer API and backpressure controls."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Observer Pattern.md",
    "id": "card-326"
  },
  {
    "question": "How do you scale observers across services?",
    "answer": [
      {
        "type": "text",
        "content": "Push ticks to a message broker (RabbitMQ topics, Kafka) and let downstream services subscribe. The Observer concept still applies, but the transport ensures durability and fan-out across machines."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Observer Pattern.md",
    "id": "card-327"
  },
  {
    "question": "How do you ensure observers don’t block the publisher?",
    "answer": [
      {
        "type": "text",
        "content": "Execute callbacks on thread pool tasks, channels, or use asynchronous event handlers returning Task. Alternatively, push events into bounded queues so slow consumers don’t back up producers."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Observer Pattern.md",
    "id": "card-328"
  },
  {
    "question": "What patterns pair well with Observer?",
    "answer": [
      {
        "type": "text",
        "content": "Combine with Strategy (different reaction logic per subscriber), Decorator (add logging around event handling), or CQRS (publish domain events that feed read models)."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Observer Pattern.md",
    "id": "card-329"
  },
  {
    "question": "How do you test observers?",
    "answer": [
      {
        "type": "text",
        "content": "Subscribe fake handlers or use spies to capture events, then assert they received the expected sequence when the publisher produces certain ticks."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Observer Pattern.md",
    "id": "card-330"
  },
  {
    "question": "How do you handle ordering guarantees?",
    "answer": [
      {
        "type": "text",
        "content": "Document whether observers receive events in publish order; if ordering matters, process events synchronously per subscriber or use ordered queues. For distributed observers, leverage partitions/keys to maintain order."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Observer Pattern.md",
    "id": "card-331"
  },
  {
    "question": "🧩 Example — PriceFeed with multiple subscribers",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class Tick\n{\n    public string Symbol { get; init; }\n    public double Bid { get; init; }\n    public double Ask { get; init; }\n}\n\npublic class PriceFeed\n{\n    public event Action<Tick>? OnTick;\n\n    public void Publish(Tick tick)\n    {\n        OnTick?.Invoke(tick);\n    }\n}\n\n// --- Observers ---\npublic class ChartService\n{\n    public void Subscribe(PriceFeed feed) => feed.OnTick += Display;\n\n    private void Display(Tick tick)\n        => Console.WriteLine($\"Chart updated: {tick.Symbol} = {tick.Bid}/{tick.Ask}\");\n}\n\npublic class AlertService\n{\n    public void Subscribe(PriceFeed feed) => feed.OnTick += Alert;\n\n    private void Alert(Tick tick)\n    {\n        if (tick.Bid > 1.25)\n            Console.WriteLine($\"🚨 Alert: {tick.Symbol} > 1.25\");\n    }\n}\n\n// --- Usage ---\nvar feed = new PriceFeed();\nvar chart = new ChartService();\nvar alert = new AlertService();\n\nchart.Subscribe(feed);\nalert.Subscribe(feed);\n\nfeed.Publish(new Tick { Symbol = \"GBPUSD\", Bid = 1.2520, Ask = 1.2522 });",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "✅ Why it matters:"
      },
      {
        "type": "list",
        "items": [
          "Perfect for real-time streaming (price feeds, notifications, updates).",
          "Loose coupling between publisher and subscribers.",
          "Scales to multiple observers (UI, loggers, analytics, etc.)."
        ]
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Observer Pattern.md",
    "isSection": true,
    "id": "card-332"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: Whenever multiple components need to react to the same event stream—market ticks, order fills, health changes—without tight coupling. It decouples publishers from subscribers so you can add/remove listeners without touching producers."
      },
      {
        "type": "text",
        "content": "A: Observer is in-process and synchronous (events raised inside the same app), while pub/sub uses brokers for cross-process communication. Start with Observer for local notifications; graduate to brokers (RabbitMQ, Kafka) for distributed systems."
      },
      {
        "type": "text",
        "content": "A: Wrap subscriber invocations in try/catch, run them asynchronously, or use mediator pipelines that isolate failures. Consider IObservable<T> + Rx to provide built-in error handling semantics."
      },
      {
        "type": "text",
        "content": "A: Keep references to event handlers and detach them (feed.OnTick -= handler). With IObservable<T>, dispose the subscription. In DI scenarios, use weak references or lifetime-managed subscriptions."
      },
      {
        "type": "text",
        "content": "A: When you need advanced operators (buffering, throttling, filtering) or asynchronous streams. Rx provides a richer API and backpressure controls."
      },
      {
        "type": "text",
        "content": "A: Push ticks to a message broker (RabbitMQ topics, Kafka) and let downstream services subscribe. The Observer concept still applies, but the transport ensures durability and fan-out across machines."
      },
      {
        "type": "text",
        "content": "A: Execute callbacks on thread pool tasks, channels, or use asynchronous event handlers returning Task. Alternatively, push events into bounded queues so slow consumers don’t back up producers."
      },
      {
        "type": "text",
        "content": "A: Combine with Strategy (different reaction logic per subscriber), Decorator (add logging around event handling), or CQRS (publish domain events that feed read models)."
      },
      {
        "type": "text",
        "content": "A: Subscribe fake handlers or use spies to capture events, then assert they received the expected sequence when the publisher produces certain ticks."
      },
      {
        "type": "text",
        "content": "A: Document whether observers receive events in publish order; if ordering matters, process events synchronously per subscriber or use ordered queues. For distributed observers, leverage partitions/keys to maintain order."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Observer Pattern.md",
    "isSection": true,
    "id": "card-333"
  },
  {
    "question": "When do you apply the Strategy pattern?",
    "answer": [
      {
        "type": "text",
        "content": "When behavior varies by configuration, tenant, or runtime data (e.g., aggressive vs passive execution) and you want to encapsulate algorithms behind a shared interface instead of branching all over the codebase."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Strategy Pattern.md",
    "id": "card-334"
  },
  {
    "question": "How do you select a strategy at runtime?",
    "answer": [
      {
        "type": "text",
        "content": "Inject a factory that chooses the correct ITradeStrategy based on market conditions, order metadata, or feature flags. Strategies can be swapped via DI or resolved dynamically."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Strategy Pattern.md",
    "id": "card-335"
  },
  {
    "question": "How does Strategy differ from State?",
    "answer": [
      {
        "type": "text",
        "content": "Strategy changes behavior per request/order; State models transitions over time. Strategy is stateless and pluggable, whereas State encapsulates transitions inside the object."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Strategy Pattern.md",
    "id": "card-336"
  },
  {
    "question": "How do you unit test strategies?",
    "answer": [
      {
        "type": "text",
        "content": "Instantiate each strategy with fake dependencies and assert their behavior independently. Tests stay small because the interface isolates algorithms from the rest of the system."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Strategy Pattern.md",
    "id": "card-337"
  },
  {
    "question": "What happens when strategy selection itself becomes complex?",
    "answer": [
      {
        "type": "text",
        "content": "Combine Strategy with Factory or Specification. The factory encapsulates selection logic; strategies stay focused on execution."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Strategy Pattern.md",
    "id": "card-338"
  },
  {
    "question": "How do you prevent strategy explosion?",
    "answer": [
      {
        "type": "text",
        "content": "Group related variations via configuration or policy objects, and extract shared behavior into base classes or decorators. Only add new strategies when behavior genuinely differs."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Strategy Pattern.md",
    "id": "card-339"
  },
  {
    "question": "Can strategies maintain state?",
    "answer": [
      {
        "type": "text",
        "content": "They should be stateless or encapsulate state tightly (e.g., cached calculations). For long-lived state machines, consider the State pattern or per-order context objects passed into strategies."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Strategy Pattern.md",
    "id": "card-340"
  },
  {
    "question": "How does dependency injection help?",
    "answer": [
      {
        "type": "text",
        "content": "Register strategies and inject them via constructor or keyed services, enabling easy swapping in tests and runtime. Feature flags can toggle which strategy is resolved."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Strategy Pattern.md",
    "id": "card-341"
  },
  {
    "question": "How do strategies interact with telemetry?",
    "answer": [
      {
        "type": "text",
        "content": "Decorate strategies or wrap them with interceptors to log execution time and outcomes. This keeps telemetry consistent regardless of which strategy executed."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Strategy Pattern.md",
    "id": "card-342"
  },
  {
    "question": "What’s the performance impact?",
    "answer": [
      {
        "type": "text",
        "content": "Minimal—just an extra virtual call. The clarity and extensibility gained typically outweigh the small overhead, especially compared to complex branching logic."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Strategy Pattern.md",
    "id": "card-343"
  },
  {
    "question": "🧩 Example — Switching between Aggressive and Passive strategies",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface ITradeStrategy\n{\n    void Execute(Order order);\n}\n\npublic class AggressiveStrategy : ITradeStrategy\n{\n    public void Execute(Order order)\n    {\n        Console.WriteLine($\"[Aggressive] Sending order {order.Symbol} immediately at market price\");\n    }\n}\n\npublic class PassiveStrategy : ITradeStrategy\n{\n    public void Execute(Order order)\n    {\n        Console.WriteLine($\"[Passive] Placing limit order for {order.Symbol} to wait for better price\");\n    }\n}\n\npublic class Trader\n{\n    private readonly ITradeStrategy _strategy;\n\n    public Trader(ITradeStrategy strategy) => _strategy = strategy;\n\n    public void Trade(Order order) => _strategy.Execute(order);\n}\n\n// --- Usage ---\nvar order = new Order { Symbol = \"EURUSD\", Amount = 1000 };\nvar trader = new Trader(new AggressiveStrategy());\ntrader.Trade(order); // can switch strategy dynamically",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "✅ Why it matters:"
      },
      {
        "type": "list",
        "items": [
          "Switch trading behaviors (aggressive, passive, hedging) dynamically.",
          "Avoids if/else hell.",
          "New strategies plug in easily without code modification."
        ]
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Strategy Pattern.md",
    "isSection": true,
    "id": "card-344"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: When behavior varies by configuration, tenant, or runtime data (e.g., aggressive vs passive execution) and you want to encapsulate algorithms behind a shared interface instead of branching all over the codebase."
      },
      {
        "type": "text",
        "content": "A: Inject a factory that chooses the correct ITradeStrategy based on market conditions, order metadata, or feature flags. Strategies can be swapped via DI or resolved dynamically."
      },
      {
        "type": "text",
        "content": "A: Strategy changes behavior per request/order; State models transitions over time. Strategy is stateless and pluggable, whereas State encapsulates transitions inside the object."
      },
      {
        "type": "text",
        "content": "A: Instantiate each strategy with fake dependencies and assert their behavior independently. Tests stay small because the interface isolates algorithms from the rest of the system."
      },
      {
        "type": "text",
        "content": "A: Combine Strategy with Factory or Specification. The factory encapsulates selection logic; strategies stay focused on execution."
      },
      {
        "type": "text",
        "content": "A: Group related variations via configuration or policy objects, and extract shared behavior into base classes or decorators. Only add new strategies when behavior genuinely differs."
      },
      {
        "type": "text",
        "content": "A: They should be stateless or encapsulate state tightly (e.g., cached calculations). For long-lived state machines, consider the State pattern or per-order context objects passed into strategies."
      },
      {
        "type": "text",
        "content": "A: Register strategies and inject them via constructor or keyed services, enabling easy swapping in tests and runtime. Feature flags can toggle which strategy is resolved."
      },
      {
        "type": "text",
        "content": "A: Decorate strategies or wrap them with interceptors to log execution time and outcomes. This keeps telemetry consistent regardless of which strategy executed."
      },
      {
        "type": "text",
        "content": "A: Minimal—just an extra virtual call. The clarity and extensibility gained typically outweigh the small overhead, especially compared to complex branching logic."
      }
    ],
    "category": "notes",
    "topic": "Design-Patterns",
    "source": "notes/Design-Patterns/Strategy Pattern.md",
    "isSection": true,
    "id": "card-345"
  },
  {
    "question": "What does DRY mean beyond code duplication?",
    "answer": [
      {
        "type": "text",
        "content": "It means every business rule or piece of knowledge should exist in a single authoritative place—code, schema, docs, config—so updates propagate consistently and you avoid divergence."
      }
    ],
    "category": "notes",
    "topic": "DRY",
    "source": "notes/DRY/index.md",
    "id": "card-346"
  },
  {
    "question": "How do you enforce DRY when multiple services need the same validation?",
    "answer": [
      {
        "type": "text",
        "content": "Extract reusable components (shared libraries, NuGet packages, API endpoints) or define contracts/validators consumed by each service. Avoid copy/paste; instead share via versioned packages or centralized services."
      }
    ],
    "category": "notes",
    "topic": "DRY",
    "source": "notes/DRY/index.md",
    "id": "card-347"
  },
  {
    "question": "When is duplication acceptable?",
    "answer": [
      {
        "type": "text",
        "content": "For small, stable snippets where abstraction would add accidental complexity. Sometimes duplication is cheaper than coupling; but document the rationale and revisit if requirements evolve."
      }
    ],
    "category": "notes",
    "topic": "DRY",
    "source": "notes/DRY/index.md",
    "id": "card-348"
  },
  {
    "question": "How does DRY relate to domain events?",
    "answer": [
      {
        "type": "text",
        "content": "Domain events ensure state changes happen in one place, notifying interested parties without duplicating logic. Each event encapsulates the rule once and publishes it for subscribers."
      }
    ],
    "category": "notes",
    "topic": "DRY",
    "source": "notes/DRY/index.md",
    "id": "card-349"
  },
  {
    "question": "What tools help detect DRY violations?",
    "answer": [
      {
        "type": "text",
        "content": "Static analysis (Sonar, Roslyn analyzers), architectural decision records, shared test suites, and code reviews focusing on repeated patterns or query filters across services."
      }
    ],
    "category": "notes",
    "topic": "DRY",
    "source": "notes/DRY/index.md",
    "id": "card-350"
  },
  {
    "question": "How can configuration drift break DRY?",
    "answer": [
      {
        "type": "text",
        "content": "When each environment or microservice copies JSON/YAML settings manually, the \"knowledge\" about e.g., retry policies diverges. Use centralized config or templates to keep settings single-sourced."
      }
    ],
    "category": "notes",
    "topic": "DRY",
    "source": "notes/DRY/index.md",
    "id": "card-351"
  },
  {
    "question": "How do you keep SQL queries DRY across codebases?",
    "answer": [
      {
        "type": "text",
        "content": "Encapsulate queries in repositories/projections, use database views/stored procedures where appropriate, or define LINQ extension methods to reuse filtering/grouping logic."
      }
    ],
    "category": "notes",
    "topic": "DRY",
    "source": "notes/DRY/index.md",
    "id": "card-352"
  },
  {
    "question": "Does DRY conflict with SRP?",
    "answer": [
      {
        "type": "text",
        "content": "They complement each other. SRP encourages focused classes; DRY ensures functionality isn’t scattered. When refactoring to DRY, verify the resulting abstraction still has a single responsibility."
      }
    ],
    "category": "notes",
    "topic": "DRY",
    "source": "notes/DRY/index.md",
    "id": "card-353"
  },
  {
    "question": "How do you DRY test code without making tests brittle?",
    "answer": [
      {
        "type": "text",
        "content": "Use builders, helper methods, and data-driven tests for shared setup, but keep assertions explicit. Avoid hiding intent behind overly generic helpers, and prefer per-feature fixture classes."
      }
    ],
    "category": "notes",
    "topic": "DRY",
    "source": "notes/DRY/index.md",
    "id": "card-354"
  },
  {
    "question": "What’s the relationship between DRY and documentation?",
    "answer": [
      {
        "type": "text",
        "content": "Document procedures and APIs once, then reference that source elsewhere (wikis, runbooks). Automation (code generation, doc tooling) helps ensure docs derive from code or schemas to stay in sync."
      }
    ],
    "category": "notes",
    "topic": "DRY",
    "source": "notes/DRY/index.md",
    "id": "card-355"
  },
  {
    "question": "❌ Common anti-pattern (duplicated code)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderService\n{\n\tpublic void PlaceOrder(Order order)\n\t{\n\t\t// validate\n\t\tif (order == null || order.Amount <= 0) throw new ArgumentException(\"Invalid order\");\n\t\t// save\n\t\tSaveOrder(order);\n\t\t// notify\n\t\tEmail.Send(\"order@company\", \"Order placed\");\n\t}\n\n\tpublic void CancelOrder(Order order)\n\t{\n\t\t// duplicated validate\n\t\tif (order == null || order.Amount <= 0) throw new ArgumentException(\"Invalid order\");\n\t\t// cancel\n\t\tCancel(order);\n\t\t// notify\n\t\tEmail.Send(\"order@company\", \"Order cancelled\");\n\t}\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Problems: validation and notification logic are duplicated across methods — bug fixes or behaviour changes must be applied in multiple places."
      }
    ],
    "category": "notes",
    "topic": "DRY",
    "source": "notes/DRY/index.md",
    "isSection": true,
    "id": "card-356"
  },
  {
    "question": "✅ DRY refactor (single source of truth)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderService\n{\n\tpublic void PlaceOrder(Order order)\n\t{\n\t\tValidate(order);\n\t\tSaveOrder(order);\n\t\tNotify(\"Order placed\");\n\t}\n\n\tpublic void CancelOrder(Order order)\n\t{\n\t\tValidate(order);\n\t\tCancel(order);\n\t\tNotify(\"Order cancelled\");\n\t}\n\n\tprivate void Validate(Order order)\n\t{\n\t\tif (order == null || order.Amount <= 0) throw new ArgumentException(\"Invalid order\");\n\t}\n\n\tprivate void Notify(string message) => Email.Send(\"order@company\", message);\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "DRY",
    "source": "notes/DRY/index.md",
    "isSection": true,
    "id": "card-357"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: It means every business rule or piece of knowledge should exist in a single authoritative place—code, schema, docs, config—so updates propagate consistently and you avoid divergence."
      },
      {
        "type": "text",
        "content": "A: Extract reusable components (shared libraries, NuGet packages, API endpoints) or define contracts/validators consumed by each service. Avoid copy/paste; instead share via versioned packages or centralized services."
      },
      {
        "type": "text",
        "content": "A: For small, stable snippets where abstraction would add accidental complexity. Sometimes duplication is cheaper than coupling; but document the rationale and revisit if requirements evolve."
      },
      {
        "type": "text",
        "content": "A: Domain events ensure state changes happen in one place, notifying interested parties without duplicating logic. Each event encapsulates the rule once and publishes it for subscribers."
      },
      {
        "type": "text",
        "content": "A: Static analysis (Sonar, Roslyn analyzers), architectural decision records, shared test suites, and code reviews focusing on repeated patterns or query filters across services."
      },
      {
        "type": "text",
        "content": "A: When each environment or microservice copies JSON/YAML settings manually, the \"knowledge\" about e.g., retry policies diverges. Use centralized config or templates to keep settings single-sourced."
      },
      {
        "type": "text",
        "content": "A: Encapsulate queries in repositories/projections, use database views/stored procedures where appropriate, or define LINQ extension methods to reuse filtering/grouping logic."
      },
      {
        "type": "text",
        "content": "A: They complement each other. SRP encourages focused classes; DRY ensures functionality isn’t scattered. When refactoring to DRY, verify the resulting abstraction still has a single responsibility."
      },
      {
        "type": "text",
        "content": "A: Use builders, helper methods, and data-driven tests for shared setup, but keep assertions explicit. Avoid hiding intent behind overly generic helpers, and prefer per-feature fixture classes."
      },
      {
        "type": "text",
        "content": "A: Document procedures and APIs once, then reference that source elsewhere (wikis, runbooks). Automation (code generation, doc tooling) helps ensure docs derive from code or schemas to stay in sync."
      }
    ],
    "category": "notes",
    "topic": "DRY",
    "source": "notes/DRY/index.md",
    "isSection": true,
    "id": "card-358"
  },
  {
    "question": "Bad Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderService\n{\n\tpublic void PlaceOrder(Order order)\n\t{\n\t\t// validate\n\t\tif (order == null || order.Amount <= 0) throw new ArgumentException(\"Invalid order\");\n\t\t// save\n\t\tSaveOrder(order);\n\t\t// notify\n\t\tEmail.Send(\"order@company\", \"Order placed\");\n\t}\n\n\tpublic void CancelOrder(Order order)\n\t{\n\t\t// duplicated validate\n\t\tif (order == null || order.Amount <= 0) throw new ArgumentException(\"Invalid order\");\n\t\t// cancel\n\t\tCancel(order);\n\t\t// notify\n\t\tEmail.Send(\"order@company\", \"Order cancelled\");\n\t}\n}",
        "codeType": "bad"
      }
    ],
    "category": "notes",
    "topic": "DRY",
    "source": "notes/DRY/index.md",
    "isConcept": true,
    "id": "card-359"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderService\n{\n\tpublic void PlaceOrder(Order order)\n\t{\n\t\tValidate(order);\n\t\tSaveOrder(order);\n\t\tNotify(\"Order placed\");\n\t}\n\n\tpublic void CancelOrder(Order order)\n\t{\n\t\tValidate(order);\n\t\tCancel(order);\n\t\tNotify(\"Order cancelled\");\n\t}\n\n\tprivate void Validate(Order order)\n\t{\n\t\tif (order == null || order.Amount <= 0) throw new ArgumentException(\"Invalid order\");\n\t}\n\n\tprivate void Notify(string message) => Email.Send(\"order@company\", message);\n}",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "DRY",
    "source": "notes/DRY/index.md",
    "isConcept": true,
    "id": "card-360"
  },
  {
    "question": "Principles and Goals",
    "answer": [
      {
        "type": "list",
        "items": [
          "Fail fast, fail safely: Validate inputs early and return meaningful errors without cascading failures.",
          "Deterministic paths: Prefer predictable control flow over broad exception handling; reserve exceptions for truly exceptional conditions.",
          "Low-overhead: Avoid unnecessary allocations and reflection in hot paths; keep the happy-path zero-cost when possible.",
          "Observability built-in: Emit structured errors with correlation IDs and key context (tenant, region, feature flag) for fast triage.",
          "Graceful degradation: Prefer partial availability (cached responses, degraded features) over total failure."
        ]
      }
    ],
    "category": "notes",
    "topic": "error-handling.md",
    "source": "notes/error-handling.md",
    "isSection": true,
    "id": "card-361"
  },
  {
    "question": "Patterns to Prefer",
    "answer": [
      {
        "type": "list",
        "items": [
          "Guard clauses: Validate arguments and state up front to keep the main logic clear and predictable.",
          "Typed results: Use OneOf, ErrorOr, or Result-style return types for expected domain errors; avoid exceptions for flow control.",
          "Exception filters: Use catch (Exception ex) when (...) to separate retryable from terminal failures and avoid broad catch blocks.",
          "Retry with jitter: Apply exponential backoff plus jitter for transient faults; cap retries to protect latency budgets.",
          "Circuit breakers and bulkheads: Short-circuit unhealthy dependencies and isolate pools to prevent resource exhaustion.",
          "Timeouts and cancellation: Set timeouts per dependency; honor CancellationToken to shed load quickly.",
          "Idempotency: Design operations to be retry-safe (idempotency keys, upserts) so recovery paths don't create duplicates."
        ]
      }
    ],
    "category": "notes",
    "topic": "error-handling.md",
    "source": "notes/error-handling.md",
    "isSection": true,
    "id": "card-362"
  },
  {
    "question": "Implementation Guidelines",
    "answer": [
      {
        "type": "list",
        "items": [
          "Boundary enforcement: Validate DTOs with FluentValidation or IValidatableObject; return 400-series responses with actionable messages.",
          "Centralized exception handling: Use middleware/filters to translate exceptions into consistent problem-details payloads.",
          "Structured error contracts: Standardize fields like errorCode, correlationId, source, and retryable for clients.",
          "Dependency hygiene: Wrap external calls (HTTP, DB, queues) with polly policies for retry, circuit-breaker, timeout, and fallback.",
          "Resource protection: Use bounded channels/queues; reject requests when buffers are full instead of blocking threads.",
          "Telemetry alignment: Log errors with event IDs; emit metrics for error rates, retry counts, circuit state, and fallback usage."
        ]
      }
    ],
    "category": "notes",
    "topic": "error-handling.md",
    "source": "notes/error-handling.md",
    "isSection": true,
    "id": "card-363"
  },
  {
    "question": "Minimal API Example (Problem Details + Resilience)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "var builder = WebApplication.CreateBuilder(args);\n\nbuilder.Services.AddProblemDetails(options =>\n{\n    options.CustomizeProblemDetails = context =>\n    {\n        context.ProblemDetails.Extensions[\"correlationId\"] = context.HttpContext.TraceIdentifier;\n    };\n});\n\nbuilder.Services.AddHttpClient<InventoryClient>(client =>\n    client.BaseAddress = new Uri(\"https://inventory\"))\n    .AddTransientHttpErrorPolicy(policy => policy\n        .WaitAndRetryAsync(3, retry => TimeSpan.FromMilliseconds(50 * Math.Pow(2, retry)))\n        .WrapAsync(Policy.TimeoutAsync<HttpResponseMessage>(TimeSpan.FromSeconds(1))));\n\nvar app = builder.Build();\n\napp.UseExceptionHandler();\napp.UseStatusCodePages();\napp.UseMiddleware<RequestCorrelationMiddleware>();\napp.UseProblemDetails();\n\napp.MapGet(\"/items/{sku}\", async (\n    string sku,\n    InventoryClient client,\n    CancellationToken ct) =>\n{\n    if (string.IsNullOrWhiteSpace(sku))\n    {\n        return Results.BadRequest(new ProblemDetails\n        {\n            Title = \"Invalid SKU\",\n            Detail = \"SKU must be provided\",\n            Status = StatusCodes.Status400BadRequest\n        });\n    }\n\n    var result = await client.FetchAsync(sku, ct);\n    return result.Match(\n        success => Results.Ok(success),\n        notFound => Results.NotFound(),\n        _ => Results.StatusCode(StatusCodes.Status503ServiceUnavailable));\n});\n\napp.Run();",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "error-handling.md",
    "source": "notes/error-handling.md",
    "isSection": true,
    "id": "card-364"
  },
  {
    "question": "Sample Resilient Client",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public sealed record InventoryResponse(string Sku, int Quantity);\n\npublic class InventoryClient\n{\n    private static readonly OneOf<InventoryResponse, NotFound> NotFoundResult = new(new NotFound());\n    private readonly HttpClient _httpClient;\n\n    public InventoryClient(HttpClient httpClient) => _httpClient = httpClient;\n\n    public async Task<OneOf<InventoryResponse, NotFound, Error>> FetchAsync(string sku, CancellationToken ct)\n    {\n        using var request = new HttpRequestMessage(HttpMethod.Get, $\"/inventory/{sku}\");\n        request.Headers.Add(\"X-Correlation-ID\", ct.GetHashCode().ToString());\n\n        try\n        {\n            using var response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, ct);\n\n            if (response.StatusCode == HttpStatusCode.NotFound)\n            {\n                return NotFoundResult;\n            }\n\n            response.EnsureSuccessStatusCode();\n\n            await using var stream = await response.Content.ReadAsStreamAsync(ct);\n            var payload = await JsonSerializer.DeserializeAsync<InventoryResponse>(stream, cancellationToken: ct);\n\n            return payload ?? new Error(\"Empty response\", retryable: false);\n        }\n        catch (OperationCanceledException) when (ct.IsCancellationRequested)\n        {\n            return new Error(\"Request canceled\", retryable: true);\n        }\n        catch (HttpRequestException ex) when (ex.StatusCode is null or HttpStatusCode.TooManyRequests)\n        {\n            return new Error(\"Transient HTTP failure\", retryable: true);\n        }\n        catch (Exception ex)\n        {\n            return new Error(ex.Message, retryable: false);\n        }\n    }\n}\n\npublic sealed record Error(string Message, bool retryable);\npublic sealed record NotFound;",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "error-handling.md",
    "source": "notes/error-handling.md",
    "isSection": true,
    "id": "card-365"
  },
  {
    "question": "Operational Best Practices",
    "answer": [
      {
        "type": "list",
        "items": [
          "SLO-aware retries: Align retry budgets with p99 latency targets; prefer 1–3 retries with jitter and a global timeout per request.",
          "Fast-path success: Keep happy-path allocations low; cache serializers and validators, pre-size collections, and avoid string formatting unless needed.",
          "Fallbacks: Serve from cache, return stale data with warnings, or downgrade features (e.g., no recommendations) when dependencies fail.",
          "Load shedding: Use request queues and concurrency limits; return 429/503 quickly when the system is saturated.",
          "Chaos-ready: Continuously inject faults (latency, timeouts, dependency outages) in staging to validate resilience policies.",
          "Consistent surface area: Map errors to stable codes and types so clients can automate handling and avoid brittle parsing."
        ]
      }
    ],
    "category": "notes",
    "topic": "error-handling.md",
    "source": "notes/error-handling.md",
    "isSection": true,
    "id": "card-366"
  },
  {
    "question": "Sample Interview Q&A",
    "answer": [
      {
        "type": "list",
        "items": [
          "Q: When do you choose exceptions vs. result types?",
          "A: Use exceptions for unexpected, rare failures (null reference, protocol violation). Use Result/OneOf for expected domain outcomes (validation errors, not found) to avoid control-flow via exceptions and keep the hot path allocation-free.",
          "Q: How do you keep retries from hurting availability?",
          "A: Enforce timeouts, cap retry counts, add jitter to prevent thundering herds, and combine retries with circuit breakers and load shedding.",
          "Q: How do you propagate context for debugging?",
          "A: Attach correlation IDs and tenant/region info to log scopes and problem-details responses; ensure trace context flows through HTTP/messaging clients.",
          "Q: What makes an error contract client-friendly?",
          "A: Stable error codes, actionable messages, explicit retryable hints, and sample remediation steps so clients can automate retries or fallbacks.",
          "Q: How do you avoid exception cost in hot paths?",
          "A: Prefer guard clauses and result types, pre-validate inputs, avoid throwing for predictable states, and use exception filters to keep catch blocks narrow.",
          "Q: When do you choose graceful degradation over hard failure?",
          "A: If the dependency is non-critical or you can safely serve stale data, fall back to caches, simplified logic, or partial responses (e.g., show cached recommendations). For critical flows (payments, compliance), fail fast to prevent bad states. Always instrument fallbacks so you know when you’re degraded.",
          "Q: What’s your approach to cancellation and timeouts in async services?",
          "A: Flow CancellationToken through all async APIs, set per-dependency timeouts (Polly TimeoutPolicy or HttpClient timeouts), and treat OperationCanceledException as a signal to stop work quickly. Combine with load shedding so saturated servers free threads instead of hanging.",
          "Q: How do you centralize error handling in ASP.NET Core?",
          "A: Configure the exception handler middleware + ProblemDetails to translate unhandled exceptions into consistent payloads, add filters for domain exceptions, and wrap them with correlation IDs. This keeps controllers thin and ensures every failure path returns structured diagnostics.",
          "Q: How do you validate resilience policies before production?",
          "A: Use integration tests and chaos drills that inject latency, drop connections, and spike errors while asserting on retry counts, circuit breaker transitions, and emitted metrics/logs. Automated fault injection ensures policies fire as expected and keeps runbooks current.",
          "Q: How do you enforce idempotency across retries or duplicate messages?",
          "A: Include idempotency keys (request IDs, message IDs), use database upserts or stored procedure guards, and track processed messages in an inbox/outbox table. Consumers check for prior processing before mutating state so at-least-once delivery doesn’t double charge or double execute."
        ]
      }
    ],
    "category": "notes",
    "topic": "error-handling.md",
    "source": "notes/error-handling.md",
    "isSection": true,
    "id": "card-367"
  },
  {
    "question": "When should you reach for FluentValidation over data annotations?",
    "answer": [
      {
        "type": "text",
        "content": "When validation is complex, needs async checks, localization, or cross-field logic. FluentValidation keeps rules in dedicated classes, making them testable and composable, whereas data annotations are limited to attribute-based, synchronous checks."
      }
    ],
    "category": "notes",
    "topic": "FluentValidation",
    "source": "notes/FluentValidation/FluentValidation.md",
    "id": "card-368"
  },
  {
    "question": "How do you share rules between create and update flows?",
    "answer": [
      {
        "type": "text",
        "content": "Use Include() to compose validators, RuleSet to toggle groups, or separate DTOs per use case. Avoid giant conditional validators—split contexts when rules diverge significantly."
      }
    ],
    "category": "notes",
    "topic": "FluentValidation",
    "source": "notes/FluentValidation/FluentValidation.md",
    "id": "card-369"
  },
  {
    "question": "How do you keep validators from doing business logic?",
    "answer": [
      {
        "type": "text",
        "content": "Limit them to pure validation (checking invariants, referencing read-only dependencies). For workflows or state changes, push logic into application/domain services. Validators can query read models but shouldn’t mutate state or call external systems beyond existence checks."
      }
    ],
    "category": "notes",
    "topic": "FluentValidation",
    "source": "notes/FluentValidation/FluentValidation.md",
    "id": "card-370"
  },
  {
    "question": "What’s the role of CascadeMode?",
    "answer": [
      {
        "type": "text",
        "content": "It controls whether subsequent rules run after a failure. CascadeMode.Stop short-circuits to reduce noise and redundant work, which is useful for perf or to avoid duplicate messages."
      }
    ],
    "category": "notes",
    "topic": "FluentValidation",
    "source": "notes/FluentValidation/FluentValidation.md",
    "id": "card-371"
  },
  {
    "question": "How do you validate collections?",
    "answer": [
      {
        "type": "text",
        "content": "Use RuleForEach(x => x.Items).SetValidator(new ItemValidator()); to apply nested validators per element, or RuleFor(x => x.Items).NotEmpty() for aggregate-level checks. Each nested validator has access to the child item context."
      }
    ],
    "category": "notes",
    "topic": "FluentValidation",
    "source": "notes/FluentValidation/FluentValidation.md",
    "id": "card-372"
  },
  {
    "question": "How do you handle async validators hitting external services?",
    "answer": [
      {
        "type": "text",
        "content": "Use MustAsync or CustomAsync, inject the dependency (e.g., repository, API client), and ensure it supports cancellation tokens. Batch expensive checks to avoid N+1 calls."
      }
    ],
    "category": "notes",
    "topic": "FluentValidation",
    "source": "notes/FluentValidation/FluentValidation.md",
    "id": "card-373"
  },
  {
    "question": "How do you integrate FluentValidation with MediatR pipelines?",
    "answer": [
      {
        "type": "text",
        "content": "Register validators in DI and add a pipeline behavior that resolves IValidator<TRequest>, executes them before the handler, and throws a ValidationException if failures exist. This keeps controllers thin and centralizes validation."
      }
    ],
    "category": "notes",
    "topic": "FluentValidation",
    "source": "notes/FluentValidation/FluentValidation.md",
    "id": "card-374"
  },
  {
    "question": "How do you test validators that depend on services?",
    "answer": [
      {
        "type": "text",
        "content": "Provide fake implementations or mocks for the dependencies, instantiate the validator with them, and assert Validate results. Since validators are regular classes, tests run fast without ASP.NET hosting."
      }
    ],
    "category": "notes",
    "topic": "FluentValidation",
    "source": "notes/FluentValidation/FluentValidation.md",
    "id": "card-375"
  },
  {
    "question": "How can you customize error messages for localization?",
    "answer": [
      {
        "type": "text",
        "content": "Use WithMessage(localizer[\"Key\"]), configure ValidatorOptions.Global.LanguageManager, or override IStringSource to supply localized strings. Keep messages in resource files rather than hard-coding text."
      }
    ],
    "category": "notes",
    "topic": "FluentValidation",
    "source": "notes/FluentValidation/FluentValidation.md",
    "id": "card-376"
  },
  {
    "question": "How do you prevent validators from capturing scoped services incorrectly?",
    "answer": [
      {
        "type": "text",
        "content": "Register validators with matching lifetimes (usually transient), inject scoped services via constructor, and avoid static validators. When using AddValidatorsFromAssemblyContaining, it defaults to transient, which honors DI scopes."
      }
    ],
    "category": "notes",
    "topic": "FluentValidation",
    "source": "notes/FluentValidation/FluentValidation.md",
    "id": "card-377"
  },
  {
    "question": "Quick overview",
    "answer": [
      {
        "type": "text",
        "content": "FluentValidation is a popular .NET library for building strongly-typed validation rules using a fluent API. It separates validation rules from models and supports composition, async checks, localization, and easy testing."
      },
      {
        "type": "text",
        "content": "NuGet package: FluentValidation and for ASP.NET Core integration FluentValidation.AspNetCore."
      }
    ],
    "category": "notes",
    "topic": "FluentValidation",
    "source": "notes/FluentValidation/FluentValidation.md",
    "isSection": true,
    "id": "card-378"
  },
  {
    "question": "Core concepts and API",
    "answer": [
      {
        "type": "list",
        "items": [
          "Create a validator by implementing AbstractValidator<T>.",
          "Add rules with RuleFor(x => x.Property).NotEmpty().Length(5, 50).Must(...);",
          "Supports When, Unless, CascadeMode and RuleSet for conditional and grouped validation.",
          "Validators support async via MustAsync, custom IValidator<T> implementations, and SetValidator to compose nested validators."
        ]
      },
      {
        "type": "text",
        "content": "Example:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class CreateOrderDto\n{\n    public string Symbol { get; set; }\n    public decimal Amount { get; set; }\n    public string CustomerId { get; set; }\n}\n\npublic class CreateOrderDtoValidator : AbstractValidator<CreateOrderDto>\n{\n    private readonly ILeaveTypeRepository _leaveTypeRepository;\n\n    public CreateOrderDtoValidator(ILeaveTypeRepository leaveTypeRepository)\n    {\n        CascadeMode = CascadeMode.Stop;\n\n        RuleFor(x => x.Symbol)\n            .NotEmpty()\n            .Length(3, 10);\n\n        RuleFor(x => x.Amount)\n            .GreaterThan(0);\n\n        RuleFor(x => x.CustomerId)\n            .NotEmpty()\n            .MustAsync(async (id, ct) => await CustomerExists(id))\n            .WithMessage(\"Customer does not exist\");\n\n        // Example of nested validator\n        RuleFor(x => x.Address).SetValidator(new AddressValidator());\n        RuleFor(q => q)\n        .MustAsync(LeaveTypeNameUnique).WithMessage(\"Leave type already exists\");\n\n        _leaveTypeRepository = leaveTypeRepository;\n    }\n\n    private async Task<bool> LeaveTypeNameUnique(CreateLeaveTypeCommand command, CancellationToken token)\n    {\n        return await _leaveTypeRepository.IsLeaveTypeUniqe(command.Name); \n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "FluentValidation",
    "source": "notes/FluentValidation/FluentValidation.md",
    "isSection": true,
    "id": "card-379"
  },
  {
    "question": "Integration with ASP.NET Core",
    "answer": [
      {
        "type": "list",
        "items": [
          "Register validators in DI and enable automatic model validation."
        ]
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "services.AddControllers()\n        .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<CreateOrderDtoValidator>());",
        "codeType": "neutral"
      },
      {
        "type": "list",
        "items": [
          "You can also register IValidator<T> explicitly:"
        ]
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "services.AddTransient<IValidator<CreateOrderDto>, CreateOrderDtoValidator>();",
        "codeType": "neutral"
      },
      {
        "type": "list",
        "items": [
          "By default FluentValidation integrates with ASP.NET Core's model validation pipeline. Customize behavior with FluentValidationModelValidatorProvider.Configure(...) or by disabling automatic validation and invoking validators manually."
        ]
      }
    ],
    "category": "notes",
    "topic": "FluentValidation",
    "source": "notes/FluentValidation/FluentValidation.md",
    "isSection": true,
    "id": "card-380"
  },
  {
    "question": "Senior-level best practices",
    "answer": [
      {
        "type": "list",
        "items": [
          "Keep validators thin: validation expresses rules, not business processes. Avoid embedding heavy domain logic or side effects in validators.",
          "Prefer composition: extract reusable rule sets and nested validators via SetValidator or separate AbstractValidator<T> types.",
          "Use CascadeMode.Stop when you want to short-circuit rules to reduce noise and unnecessary checks.",
          "Use When/Unless sparingly for conditional validation; prefer explicit DTOs per use-case if the validation surface differs greatly.",
          "For cross-field validation, use DependentRules or Must on a root object:"
        ]
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "RuleFor(x => x).Must(x => IsValidCombination(x.Some, x.Other));",
        "codeType": "neutral"
      },
      {
        "type": "list",
        "items": [
          "Validate externally for expensive checks (network/db) and consider running them asynchronously with MustAsync.",
          "Use RuleForEach for collection items and Include to reuse other validators."
        ]
      }
    ],
    "category": "notes",
    "topic": "FluentValidation",
    "source": "notes/FluentValidation/FluentValidation.md",
    "isSection": true,
    "id": "card-381"
  },
  {
    "question": "Testing validators",
    "answer": [
      {
        "type": "list",
        "items": [
          "Unit test validators directly — instantiating the validator and calling Validate/ValidateAsync is fast and deterministic."
        ]
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var validator = new CreateOrderDtoValidator();\nvar result = validator.Validate(dto);\nAssert.False(result.IsValid);\nAssert.Contains(result.Errors, e => e.PropertyName == \"Amount\");",
        "codeType": "neutral"
      },
      {
        "type": "list",
        "items": [
          "Mock external dependencies for async rules using test doubles or extract the dependency behind an interface passed into the validator's constructor."
        ]
      }
    ],
    "category": "notes",
    "topic": "FluentValidation",
    "source": "notes/FluentValidation/FluentValidation.md",
    "isSection": true,
    "id": "card-382"
  },
  {
    "question": "Error mapping and API responses",
    "answer": [
      {
        "type": "list",
        "items": [
          "FluentValidation produces ValidationFailure objects containing PropertyName, ErrorMessage, and AttemptedValue.",
          "Map failures to API error response models consistently (problem details, field errors list).",
          "Consider grouping errors by field and return a compact payload for clients."
        ]
      }
    ],
    "category": "notes",
    "topic": "FluentValidation",
    "source": "notes/FluentValidation/FluentValidation.md",
    "isSection": true,
    "id": "card-383"
  },
  {
    "question": "Performance considerations",
    "answer": [
      {
        "type": "list",
        "items": [
          "Avoid expensive synchronous work in rule delegates — prefer async variants.",
          "If validators call DB or service methods, ensure they are async and avoid N+1 patterns; batch checks where possible (e.g., prefetch referenced ids before validation).",
          "Keep CascadeMode behavior in mind; short-circuit can reduce extra checks."
        ]
      }
    ],
    "category": "notes",
    "topic": "FluentValidation",
    "source": "notes/FluentValidation/FluentValidation.md",
    "isSection": true,
    "id": "card-384"
  },
  {
    "question": "Advanced topics (senior-level)",
    "answer": [
      {
        "type": "list",
        "items": [
          "Custom property validators: implement IPropertyValidator for reusable complex checks.",
          "Interceptors: use IValidatorInterceptor to hook into validation execution for logging or transformation.",
          "Validators as filters: using validators within a MediatR pipeline behavior to validate requests before handlers run."
        ]
      },
      {
        "type": "text",
        "content": "Example MediatR pipeline registration:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>\n{\n    private readonly IEnumerable<IValidator<TRequest>> _validators;\n    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators) => _validators = validators;\n\n    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)\n    {\n        var failures = _validators\n            .Select(v => v.Validate(request))\n            .SelectMany(r => r.Errors)\n            .Where(f => f != null)\n            .ToList();\n\n        if (failures.Any()) throw new ValidationException(failures);\n\n        return await next();\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "list",
        "items": [
          "Localization: FluentValidation supports localized messages. Avoid composing error messages in validators; prefer resource keys.",
          "Using RuleSet to group validations by scenario (e.g., Create, Update) and call specific rule sets when required."
        ]
      }
    ],
    "category": "notes",
    "topic": "FluentValidation",
    "source": "notes/FluentValidation/FluentValidation.md",
    "isSection": true,
    "id": "card-385"
  },
  {
    "question": "Common pitfalls & how to avoid them",
    "answer": [
      {
        "type": "list",
        "items": [
          "Do not put persistence or side effects inside validators (e.g., saving logs, sending events).",
          "Avoid long synchronous I/O (DB or HTTP) that will block the threadpool; use MustAsync instead.",
          "Don't capture scoped services in singletons when injecting services into validators — prefer constructor-injected scoped/transient services and register validators with correct lifetimes.",
          "Watch for ambiguous PropertyName when using RuleFor(x => x) root validators — map errors to clear property paths."
        ]
      }
    ],
    "category": "notes",
    "topic": "FluentValidation",
    "source": "notes/FluentValidation/FluentValidation.md",
    "isSection": true,
    "id": "card-386"
  },
  {
    "question": "Checklist for senior devs when reviewing validation",
    "answer": [
      {
        "type": "list",
        "items": [
          "Are validators isolated and focused on rules only?",
          "Are expensive checks async and stubbed in tests?",
          "Is composition used instead of duplication (Include/SetValidator)?",
          "Are messages localizable and consistent?",
          "Are validators registered and resolved correctly in DI (right lifetime)?",
          "Are validators used in the pipeline (MediatR/Controller) consistently?",
          "Are cross-field validations explicit and tested?"
        ]
      }
    ],
    "category": "notes",
    "topic": "FluentValidation",
    "source": "notes/FluentValidation/FluentValidation.md",
    "isSection": true,
    "id": "card-387"
  },
  {
    "question": "Quick code snippets",
    "answer": [
      {
        "type": "text",
        "content": "Register validators:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "services.AddFluentValidationAutoValidation();\nservices.AddValidatorsFromAssemblyContaining<CreateOrderDtoValidator>();",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Conditional rule example:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "RuleFor(x => x.Discount)\n    .GreaterThan(0)\n    .When(x => x.HasDiscount);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Async rule example:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "RuleFor(x => x.CustomerId)\n    .MustAsync(async (id, ct) => await _customerService.Exists(id))\n    .WithMessage(\"Customer not found\");",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "FluentValidation",
    "source": "notes/FluentValidation/FluentValidation.md",
    "isSection": true,
    "id": "card-388"
  },
  {
    "question": "Further reading & references",
    "answer": [
      {
        "type": "list",
        "items": [
          "FluentValidation docs: https://docs.fluentvalidation.net/",
          "Patterns: using FluentValidation with MediatR, ASP.NET Core model binding, and localization."
        ]
      }
    ],
    "category": "notes",
    "topic": "FluentValidation",
    "source": "notes/FluentValidation/FluentValidation.md",
    "isSection": true,
    "id": "card-389"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: When validation is complex, needs async checks, localization, or cross-field logic. FluentValidation keeps rules in dedicated classes, making them testable and composable, whereas data annotations are limited to attribute-based, synchronous checks."
      },
      {
        "type": "text",
        "content": "A: Use Include() to compose validators, RuleSet to toggle groups, or separate DTOs per use case. Avoid giant conditional validators—split contexts when rules diverge significantly."
      },
      {
        "type": "text",
        "content": "A: Limit them to pure validation (checking invariants, referencing read-only dependencies). For workflows or state changes, push logic into application/domain services. Validators can query read models but shouldn’t mutate state or call external systems beyond existence checks."
      },
      {
        "type": "text",
        "content": "A: It controls whether subsequent rules run after a failure. CascadeMode.Stop short-circuits to reduce noise and redundant work, which is useful for perf or to avoid duplicate messages."
      },
      {
        "type": "text",
        "content": "A: Use RuleForEach(x => x.Items).SetValidator(new ItemValidator()); to apply nested validators per element, or RuleFor(x => x.Items).NotEmpty() for aggregate-level checks. Each nested validator has access to the child item context."
      },
      {
        "type": "text",
        "content": "A: Use MustAsync or CustomAsync, inject the dependency (e.g., repository, API client), and ensure it supports cancellation tokens. Batch expensive checks to avoid N+1 calls."
      },
      {
        "type": "text",
        "content": "A: Register validators in DI and add a pipeline behavior that resolves IValidator<TRequest>, executes them before the handler, and throws a ValidationException if failures exist. This keeps controllers thin and centralizes validation."
      },
      {
        "type": "text",
        "content": "A: Provide fake implementations or mocks for the dependencies, instantiate the validator with them, and assert Validate results. Since validators are regular classes, tests run fast without ASP.NET hosting."
      },
      {
        "type": "text",
        "content": "A: Use WithMessage(localizer[\"Key\"]), configure ValidatorOptions.Global.LanguageManager, or override IStringSource to supply localized strings. Keep messages in resource files rather than hard-coding text."
      },
      {
        "type": "text",
        "content": "A: Register validators with matching lifetimes (usually transient), inject scoped services via constructor, and avoid static validators. When using AddValidatorsFromAssemblyContaining, it defaults to transient, which honors DI scopes."
      }
    ],
    "category": "notes",
    "topic": "FluentValidation",
    "source": "notes/FluentValidation/FluentValidation.md",
    "isSection": true,
    "id": "card-390"
  },
  {
    "question": "Principles and Goals",
    "answer": [
      {
        "type": "list",
        "items": [
          "Observability first: Capture structured events (no free-form strings) with fields for correlation IDs, tenant, region, and service version.",
          "Consistency across tiers: Standardize ILogger scopes and message templates so API, workers, and background jobs emit comparable fields.",
          "Backpressure-aware: Protect the app by sampling noisy events (e.g., debug traces) and using bounded queues for async sinks.",
          "Fail-safe: Logging must never block request completion; prefer drop-and-alert over throttling callers."
        ]
      }
    ],
    "category": "notes",
    "topic": "logging.md",
    "source": "notes/logging.md",
    "isSection": true,
    "id": "card-391"
  },
  {
    "question": "Recommended Stack",
    "answer": [
      {
        "type": "list",
        "items": [
          "Microsoft.Extensions.Logging as the facade for framework integrations.",
          "Structured logger: Serilog or Seq sink for JSON; use message-template placeholders ({OrderId}) instead of string interpolation.",
          "OpenTelemetry: Export traces/logs/metrics consistently; include W3C trace/context propagation headers.",
          "Shipping: Centralize via OTLP/HTTP, gRPC, or Kafka; avoid writing to local disk in containers except for bootstrap/debug.",
          "NLog context:",
          "Where it shines: Mature ecosystem with rich target support (file, database, email, Azure Log Analytics), high-performance async targets, and flexible routing/layouts for multi-tenant or blue/green rollouts.",
          "Advantages: Simple XML/JSON configuration, fast text file output, built-in filtering/rules, and battle-tested community extensions. Great when you need to fan out to multiple sinks without custom code.",
          "Trade-offs: Configuration can become verbose, JSON structure requires explicit layouts, and mixing NLog APIs with ILogger can create duplicate pipelines. Prefer running NLog behind Microsoft.Extensions.Logging via the NLog provider to keep a single abstraction and leverage dependency injection.",
          "Operational note: Keep targets async, set overflowAction=\"Discard\" or sampling for noisy rules, and set per-environment config (dev = verbose file, prod = centralized structured logs) through NLog.config transforms."
        ]
      }
    ],
    "category": "notes",
    "topic": "logging.md",
    "source": "notes/logging.md",
    "isSection": true,
    "id": "card-392"
  },
  {
    "question": "Patterns to Prefer",
    "answer": [
      {
        "type": "list",
        "items": [
          "Message templates over interpolation: logger.LogInformation(\"Processed {Count} items\", count); avoids unnecessary string formatting when disabled.",
          "Enriched scopes: Wrap requests with using var scope = logger.BeginScope(new { CorrelationId = traceId, Tenant = tenant }); so child logs inherit fields.",
          "Categorized loggers: Request typed loggers per class (ILogger<CheckoutHandler>) for filters and metrics alignment.",
          "Level hygiene:",
          "Critical/Error: actionable failures only.",
          "Warning: degradation/path to failure.",
          "Information: business milestones.",
          "Debug/Trace: development and short-term diagnostics; gate behind config.",
          "Async/buffered sinks: Use non-blocking background queues with bounded capacity; drop oldest or sample when full.",
          "Health/availability focus: Emit heartbeats and dependency outcome events (latency, status, retries) to support SLO dashboards."
        ]
      }
    ],
    "category": "notes",
    "topic": "logging.md",
    "source": "notes/logging.md",
    "isSection": true,
    "id": "card-393"
  },
  {
    "question": "Configuration Example (Minimal API)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "var builder = WebApplication.CreateBuilder(args);\n\nbuilder.Logging.ClearProviders();\nbuilder.Logging.AddConsole(options =>\n{\n    options.IncludeScopes = true;\n    options.TimestampFormat = \"yyyy-MM-ddTHH:mm:ss.fffZ \";\n});\n\nbuilder.Services.AddOpenTelemetry()\n    .WithTracing(trace => trace\n        .AddAspNetCoreInstrumentation()\n        .AddHttpClientInstrumentation()\n        .AddSource(\"Orders\"))\n    .WithMetrics(metrics => metrics\n        .AddRuntimeInstrumentation())\n    .WithLogging(logging => logging\n        .AddConsoleExporter());\n\nvar app = builder.Build();\n\napp.MapPost(\"/orders\", async (\n    ILogger<Program> logger,\n    HttpContext context) =>\n{\n    using var scope = logger.BeginScope(new\n    {\n        CorrelationId = context.TraceIdentifier,\n        Tenant = context.Request.Headers[\"X-Tenant\"].FirstOrDefault() ?? \"unknown\"\n    });\n\n    logger.LogInformation(\"Received order request from {Tenant}\");\n\n    // Simulate work\n    await Task.Delay(10);\n\n    logger.LogInformation(\"Order accepted\", DateTimeOffset.UtcNow);\n    return Results.Accepted();\n});\n\napp.Run();",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "logging.md",
    "source": "notes/logging.md",
    "isSection": true,
    "id": "card-394"
  },
  {
    "question": "High-Performance Techniques",
    "answer": [
      {
        "type": "list",
        "items": [
          "Avoid allocations: Prefer value types for high-frequency metrics; avoid string concatenation in hot paths.",
          "Batch and flush strategically: Batch OTLP/HTTP exports; tune MaxBatchSize and FlushInterval to keep p99 latency stable.",
          "Guard noisy paths: Add feature flags for trace/debug logs in critical loops; enable temporarily for investigations.",
          "Pre-allocate logger scopes: Reuse static state where possible; avoid dynamic object creation for unchanged fields.",
          "Tune buffers: Size async channels based on peak RPS and expected burst size; expose metrics for dropped events."
        ]
      }
    ],
    "category": "notes",
    "topic": "logging.md",
    "source": "notes/logging.md",
    "isSection": true,
    "id": "card-395"
  },
  {
    "question": "Operational Best Practices",
    "answer": [
      {
        "type": "list",
        "items": [
          "Correlate everything: Propagate trace/span IDs across HTTP, messaging, and background jobs.",
          "Schema discipline: Maintain a central log schema (event name, category, correlation, tenant, outcome, duration).",
          "PII controls: Classify fields and redact at the edge; log tokens/credentials only in secure staging with strict retention.",
          "Deployment safety: Use configuration-driven sinks/levels; favor hot-reloadable changes (appsettings, feature flags) over redeploys.",
          "Alerting: Alert on error-rate deltas, burst of dropped events, and missing heartbeats rather than raw log volume.",
          "What to log (and not):",
          "Log: Request/response envelope metadata (not bodies) for public APIs, dependency outcomes (latency/status/retries), domain milestones (order accepted/settled), security-relevant events (authn/z decisions), and drop reason when sampling/discarding.",
          "Avoid: Large payloads, secrets, personal data, high-cardinality values (raw GUID lists), and repetitive success spam in hot loops. Summarize counts instead.",
          "Environments:",
          "Local/dev: Enable Debug/Trace, file/console targets, and payload logging only with synthetic data.",
          "Staging: Mirror production sinks/levels; allow short-term Debug with sampling for reproductions.",
          "Production: Default to Information for business events and Warning/Error for issues; enable Debug/Trace only via time-bound flags with sampling to protect throughput and cost.",
          "Performance guardrails: Keep hot-path logging off by default, prefer structured summaries, and set per-rule rate limits so troubleshooting toggles don't DOS the service."
        ]
      }
    ],
    "category": "notes",
    "topic": "logging.md",
    "source": "notes/logging.md",
    "isSection": true,
    "id": "card-396"
  },
  {
    "question": "Sample Diagnostic Pattern (Resilient HTTP Client)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class InventoryClient\n{\n    private static readonly EventId FetchInventory = new(1001, nameof(FetchAsync));\n    private readonly HttpClient _httpClient;\n    private readonly ILogger<InventoryClient> _logger;\n\n    public InventoryClient(HttpClient httpClient, ILogger<InventoryClient> logger)\n    {\n        _httpClient = httpClient;\n        _logger = logger;\n    }\n\n    public async Task<InventoryResponse?> FetchAsync(string sku, CancellationToken ct)\n    {\n        using var scope = _logger.BeginScope(new { Sku = sku });\n\n        _logger.LogInformation(FetchInventory, \"Fetching inventory\");\n\n        try\n        {\n            var response = await _httpClient.GetAsync($\"/inventory/{sku}\", ct);\n            var body = await response.Content.ReadAsStringAsync(ct);\n\n            if (!response.IsSuccessStatusCode)\n            {\n                _logger.LogWarning(\"Inventory lookup failed with {StatusCode} and body length {Length}\",\n                    (int)response.StatusCode, body.Length);\n                return null;\n            }\n\n            _logger.LogInformation(\"Inventory fetched successfully in {ElapsedMs} ms\",\n                response.Headers.GetValues(\"X-ElapsedMs\").FirstOrDefault());\n\n            return JsonSerializer.Deserialize<InventoryResponse>(body);\n        }\n        catch (OperationCanceledException) when (ct.IsCancellationRequested)\n        {\n            _logger.LogWarning(\"Inventory fetch canceled by caller\");\n            throw;\n        }\n        catch (Exception ex)\n        {\n            _logger.LogError(ex, \"Unexpected failure during inventory fetch\");\n            throw;\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "logging.md",
    "source": "notes/logging.md",
    "isSection": true,
    "id": "card-397"
  },
  {
    "question": "Sample Interview Q&A",
    "answer": [
      {
        "type": "list",
        "items": [
          "Q: How do you prevent logging from degrading throughput?",
          "A: Use async/buffered sinks with bounded capacity, sample debug/trace logs, and rely on message templates to avoid string allocations when the level is disabled.",
          "Q: What do you log to support SLOs in a multi-tenant service?",
          "A: Log per-request correlation IDs, tenant, region, outcome, duration, and retry counts; emit heartbeats and dependency statuses for dashboards.",
          "Q: How do you handle sensitive data in logs?",
          "A: Apply a schema with field-level classification, default to redaction, and restrict sinks/retention for sensitive environments; validate with automated scanners.",
          "Q: How do you integrate logging with tracing?",
          "A: Propagate W3C trace context, attach span IDs to log scopes, export via OpenTelemetry so logs/metrics/traces share correlation IDs.",
          "Q: What patterns help during incident response?",
          "A: Toggle verbose levels via config, enable sampling to capture representative failures, and use structured events with consistent keys for quick querying.",
          "Q: Why run Serilog or NLog behind Microsoft.Extensions.Logging instead of using them directly?",
          "A: The facade lets ASP.NET Core, EF Core, and custom services share the same pipeline and DI story. Providers (Serilog/NLog) plug in via AddSerilog()/AddNLog(), so you avoid duplicate configuration, keep scopes consistent, and can swap sinks without touching app code.",
          "Q: How do you keep correlation data consistent across APIs, queues, and workers?",
          "A: Wrap each request/message in a logger scope containing CorrelationId, tenant, region, and trace/span IDs. Forward these fields on outbound HTTP/messaging headers so downstream services enrich their scopes too, creating an unbroken chain for querying dashboards.",
          "Q: When would you favor synchronous logging and how do you mitigate its risk?",
          "A: Only for small local dev tooling or early startup when async infrastructure isn’t ready. Even then, keep messages tiny and avoid blocking network calls. In production, always switch to async/buffered sinks with drop policies to shield request threads.",
          "Q: How do you tune OpenTelemetry or OTLP exporters for logging?",
          "A: Batch records (tens-hundreds per batch), tune FlushInterval to balance latency and throughput, and size the export queue to absorb bursts. Watch metrics for dropped spans/logs and adjust MaxConcurrency or sampling rates accordingly.",
          "Q: How do you verify logging instrumentation in CI?",
          "A: Use in-memory sinks/exporters during integration tests, execute key scenarios, and assert on emitted event names, scopes, and structured fields. This catches schema regressions or missing context before they hit observability platforms.",
          "Q: How do you control log level explosions when temporarily enabling Debug or Trace?",
          "A: Flip levels via config/feature flags with TTLs, scope the change to specific categories, and combine with sampling or rate limiting. Always capture the reason in runbooks so toggles are reverted quickly and storage cost stays predictable."
        ]
      }
    ],
    "category": "notes",
    "topic": "logging.md",
    "source": "notes/logging.md",
    "isSection": true,
    "id": "card-398"
  },
  {
    "question": "Why does allocation discipline matter for trading services?",
    "answer": [
      {
        "type": "text",
        "content": "High-frequency workloads process millions of ticks per minute. Excess allocations trigger frequent GC cycles, inflating tail latency and risking missed market data. Disciplined allocation keeps GC quiet so SLAs stay predictable."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "id": "card-399"
  },
  {
    "question": "How do you decide when to optimize allocations?",
    "answer": [
      {
        "type": "text",
        "content": "Profile first. Use BenchmarkDotNet or dotnet-trace to find hot spots with high allocated bytes/op. Only refactor critical paths—premature optimization everywhere reduces readability."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "id": "card-400"
  },
  {
    "question": "What tools do you use to monitor allocations in production?",
    "answer": [
      {
        "type": "text",
        "content": "dotnet-counters monitor System.Runtime for Allocated Bytes/sec, Prometheus/OpenTelemetry metrics, Azure App Insights, or PerfView ETW traces. Alert when allocations or GC pause time exceed thresholds."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "id": "card-401"
  },
  {
    "question": "How does ArrayPool<T> help avoid LOH pressure?",
    "answer": [
      {
        "type": "text",
        "content": "Renting buffers from the shared pool reuses large arrays instead of allocating >85 KB objects per request, which would otherwise land on the LOH and cause expensive, fragmented Gen2 collections."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "id": "card-402"
  },
  {
    "question": "When would you choose structs over classes?",
    "answer": [
      {
        "type": "text",
        "content": "For small immutable data (ticks, coordinates) that you pass frequently. Structs live inline/on the stack, so they avoid heap allocations and GC tracking. Keep them small (≤16 bytes) to minimize copy cost."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "id": "card-403"
  },
  {
    "question": "How do Span<T> and Memory<T> reduce allocations?",
    "answer": [
      {
        "type": "text",
        "content": "They let you slice and parse existing buffers without creating new arrays or substrings. Span<T> stays within synchronous scopes; Memory<T> handles async flows while still pointing to the same backing buffer."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "id": "card-404"
  },
  {
    "question": "How do you avoid boxing in logging or metrics code?",
    "answer": [
      {
        "type": "text",
        "content": "Use structured logging with value-type overloads or interpolated string handlers, keep APIs generic, and avoid casting to object. When necessary, wrap primitives in custom struct formatters or use spans."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "id": "card-405"
  },
  {
    "question": "How can System.IO.Pipelines improve allocation profile?",
    "answer": [
      {
        "type": "text",
        "content": "Pipelines manage pooled buffers and expose ReadOnlySequence<T> so you can parse streaming data without copying. They also support backpressure and reduce per-message allocations vs manual Stream.ReadAsync."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "id": "card-406"
  },
  {
    "question": "What’s your approach to verifying improvements?",
    "answer": [
      {
        "type": "text",
        "content": "Write microbenchmarks with MemoryDiagnoser, run load tests, and compare GC metrics before/after. Only merge when data shows lower allocations and stable latency."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "id": "card-407"
  },
  {
    "question": "How do you keep the team aligned on allocation discipline?",
    "answer": [
      {
        "type": "text",
        "content": "Document guidelines (span usage, pooling patterns), add analyzers/tests for accidental allocations, and review PRs with perf instrumentation results so everyone understands the cost model."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "id": "card-408"
  },
  {
    "question": "1️⃣ What it means",
    "answer": [
      {
        "type": "text",
        "content": "Allocation discipline means designing your code so that you:"
      },
      {
        "type": "list",
        "items": [
          "Allocate only when necessary",
          "Reuse what you already allocated",
          "Minimize copying of data",
          "Keep object lifetimes short (so they die in Gen 0)",
          "Prevent accidental heap allocations in tight loops or latency-sensitive paths"
        ]
      },
      {
        "type": "text",
        "content": "Basically:"
      },
      {
        "type": "text",
        "content": "> “Don’t let your code throw objects at the GC faster than it can clean them up.”"
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "isSection": true,
    "id": "card-409"
  },
  {
    "question": "2️⃣ Why it matters",
    "answer": [
      {
        "type": "text",
        "content": "Allocations aren’t “free.” Each heap allocation:"
      },
      {
        "type": "list",
        "items": [
          "Consumes CPU (for pointer bumping)",
          "Increases memory footprint",
          "Puts pressure on Gen 0 → more GC cycles (eventually promotions → Gen 2 → long pauses)"
        ]
      },
      {
        "type": "text",
        "content": "In low-latency systems (like trade execution or tick feeds), GC pauses = missed ticks or delayed quotes — unacceptable."
      },
      {
        "type": "text",
        "content": "So the best GC strategy is often:"
      },
      {
        "type": "text",
        "content": "> “Don’t make the GC do work at all.”"
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "isSection": true,
    "id": "card-410"
  },
  {
    "question": "3️⃣ Common allocation traps (and how to fix them)",
    "answer": [
      {
        "type": "table",
        "headers": [
          "Bad Practice",
          "Why it’s bad",
          "Fix"
        ],
        "rows": [
          [
            "Using new objects inside tight loops",
            "Floods Gen 0",
            "Reuse pooled objects"
          ],
          [
            "string.Concat or + in loops",
            "Creates new string every time",
            "Use StringBuilder or spans"
          ],
          [
            "LINQ in hot paths",
            "Allocates enumerators, closures",
            "Use for loops"
          ],
          [
            "Boxing value types",
            "Allocates on heap",
            "Use generics / avoid casting to object"
          ],
          [
            "Repeatedly allocating buffers",
            "LOH churn",
            "Use ArrayPool<T>"
          ],
          [
            "Returning large arrays",
            "LOH growth",
            "Reuse pooled arrays or slice spans"
          ]
        ]
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "isSection": true,
    "id": "card-411"
  },
  {
    "question": "✅ Object pooling",
    "answer": [
      {
        "type": "text",
        "content": ".NET has built-in pools for common cases:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "using Microsoft.Extensions.ObjectPool;\n\nvar pool = ObjectPool.Create<MyReusableObject>();\nvar item = pool.Get();\n// use item...\npool.Return(item);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "💡 Great for: serializers, parsers, StringBuilders, temp containers."
      },
      {
        "type": "text",
        "content": "Example:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var sb = StringBuilderCache.Acquire();\n// build a string\nvar result = StringBuilderCache.GetStringAndRelease(sb);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "→ zero allocations between calls."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "isSection": true,
    "id": "card-412"
  },
  {
    "question": "✅ Buffer pooling",
    "answer": [
      {
        "type": "text",
        "content": "The ArrayPool<T> API lets you rent and return arrays instead of allocating new ones."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var pool = ArrayPool<byte>.Shared;\nbyte[] buffer = pool.Rent(1024);\n// use it\npool.Return(buffer);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "💡 Use this for:"
      },
      {
        "type": "list",
        "items": [
          "I/O buffers",
          "Network streams",
          "Deserialization",
          "Message batching"
        ]
      },
      {
        "type": "text",
        "content": "🚀 Benefit: Avoids Large Object Heap churn (LOH fragmentation) and constant GC pressure."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "isSection": true,
    "id": "card-413"
  },
  {
    "question": "✅ String interning or caching",
    "answer": [
      {
        "type": "text",
        "content": "Instead of creating new string instances for common identifiers (e.g., “EURUSD”):"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "string symbol = string.Intern(\"EURUSD\");",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Or better — store common symbols in a static Dictionary<string, string> and reuse the reference."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "isSection": true,
    "id": "card-414"
  },
  {
    "question": "✅ Structs and value types",
    "answer": [
      {
        "type": "text",
        "content": "For small, immutable data (ticks, coordinates, etc.), use structs:"
      },
      {
        "type": "list",
        "items": [
          "Stored inline → no GC tracking",
          "Can live and die on the stack",
          "No heap allocations for short-lived data"
        ]
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "readonly struct Tick\n{\n    public string Symbol { get; }\n    public double Bid { get; }\n    public double Ask { get; }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "But ⚠️ keep them small (≤ 16–32 bytes). Large structs hurt performance due to copy costs."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "isSection": true,
    "id": "card-415"
  },
  {
    "question": "✅ Using Span<T> / Memory<T> for zero-copy",
    "answer": [
      {
        "type": "text",
        "content": "Span<T> and Memory<T> let you operate directly on existing memory — without allocating new arrays or substrings."
      },
      {
        "type": "text",
        "content": "Example: parsing a price line"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "ReadOnlySpan<byte> span = Encoding.ASCII.GetBytes(\"EURUSD,1.0743,1.0745\");\n\nint comma = span.IndexOf((byte)',');\nvar symbol = Encoding.ASCII.GetString(span[..comma]); // one allocation\n\nUtf8Parser.TryParse(span[(comma + 1)..], out double bid, out _);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "No string splitting, no array allocations, no GC."
      },
      {
        "type": "text",
        "content": "💡 Rule:"
      },
      {
        "type": "text",
        "content": "Use Span<T> for synchronous parsing; Memory<T> when data crosses async boundaries."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "isSection": true,
    "id": "card-416"
  },
  {
    "question": "5️⃣ Avoiding hidden allocations",
    "answer": [
      {
        "type": "text",
        "content": "Even code that looks innocent can allocate. Some hidden examples:"
      },
      {
        "type": "table",
        "headers": [
          "Code",
          "Hidden allocation"
        ],
        "rows": [
          [
            "foreach (var x in list)",
            "Enumerator struct may box"
          ],
          [
            "async methods",
            "Allocates a state machine object"
          ],
          [
            "lambda or delegate captures variable",
            "Allocates closure object"
          ],
          [
            "ToString()",
            "Often allocates new string"
          ],
          [
            "Task.FromResult(...)",
            "Reuses task, good ✅"
          ],
          [
            "await on Task that already completed",
            "Allocates continuation unless optimized"
          ]
        ]
      },
      {
        "type": "text",
        "content": "💡 Use tools like:"
      },
      {
        "type": "code",
        "language": "bash",
        "code": "dotnet-trace collect --process-id <pid>\ndotnet-counters monitor System.Runtime",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "to watch Allocated Bytes/sec."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "isSection": true,
    "id": "card-417"
  },
  {
    "question": "6️⃣ Temporal allocation awareness (lifetime patterns)",
    "answer": [
      {
        "type": "text",
        "content": "The key to designing allocation-efficient systems is understanding lifetime scopes:"
      },
      {
        "type": "table",
        "headers": [
          "Lifetime",
          "Strategy"
        ],
        "rows": [
          [
            "Per-request",
            "Avoid allocations in controllers; reuse service-scoped resources"
          ],
          [
            "Per-session",
            "Use dependency injection scopes for per-user data"
          ],
          [
            "Global/static",
            "Cache immutable data, don’t recreate"
          ],
          [
            "Transient",
            "Keep short-lived structs or pooled objects"
          ]
        ]
      },
      {
        "type": "text",
        "content": "Example: in a market data service"
      },
      {
        "type": "list",
        "items": [
          "Buffer per connection (rented from pool)",
          "Parser per connection (reused object)",
          "Tick structs per message (stack-allocated)"
        ]
      },
      {
        "type": "text",
        "content": "No GC churn in steady state."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "isSection": true,
    "id": "card-418"
  },
  {
    "question": "7️⃣ Measuring & validating allocation discipline",
    "answer": [
      {
        "type": "text",
        "content": "Use:"
      },
      {
        "type": "code",
        "language": "bash",
        "code": "dotnet-counters monitor System.Runtime",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Watch:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "Allocated Bytes/sec\nGen 0 GC Count\n% Time in GC",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "or use code:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "Console.WriteLine(GC.GetTotalAllocatedBytes(true));",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "✅ Healthy pattern:"
      },
      {
        "type": "list",
        "items": [
          "High throughput with low Allocated Bytes/sec",
          "Frequent Gen0, rare Gen1/2",
          "% Time in GC < 2–3%"
        ]
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "isSection": true,
    "id": "card-419"
  },
  {
    "question": "8️⃣ Interview-ready example (say this at)",
    "answer": [
      {
        "type": "text",
        "content": "> “Allocation discipline means being intentional about where and how you allocate."
      },
      {
        "type": "text",
        "content": "> In latency-sensitive systems, even Gen0 collections matter. I use ArrayPool<T> and ObjectPool<T> to reuse memory, Span<T> for parsing binary and textual data, and avoid LINQ or string concatenation in tight loops."
      },
      {
        "type": "text",
        "content": "> I measure Allocated Bytes/sec and Gen0 frequency in production to ensure the system stays allocation-stable."
      },
      {
        "type": "text",
        "content": "> Our goal isn’t zero GC — it’s predictable, bounded GC behavior.”"
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "isSection": true,
    "id": "card-420"
  },
  {
    "question": "9️⃣ Trading-system tie-in (concrete example)",
    "answer": [
      {
        "type": "text",
        "content": "Without discipline:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "foreach (var msg in feed)\n{\n    var parts = msg.Split(',');\n    var tick = new Tick(parts[0], double.Parse(parts[1]), double.Parse(parts[2]));\n    Publish(tick);\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "→ Creates new string arrays, substrings, doubles → Gen0/Gen1 churn."
      },
      {
        "type": "text",
        "content": "With discipline:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "byte[] buffer = ArrayPool<byte>.Shared.Rent(1024);\nReadOnlySpan<byte> span = buffer.AsSpan(0, bytesRead);\nParseTick(span);\nArrayPool<byte>.Shared.Return(buffer);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "→ Zero heap allocations, predictable performance, stable GC profile."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "isSection": true,
    "id": "card-421"
  },
  {
    "question": "10️⃣ TL;DR Summary (say this confidently)",
    "answer": [
      {
        "type": "text",
        "content": "> “Allocation discipline is about controlling your memory behavior."
      },
      {
        "type": "text",
        "content": "> I design code to minimize heap allocations, reuse buffers, and operate directly on memory using Span<T> and ArrayPool<T>."
      },
      {
        "type": "text",
        "content": "> That keeps the GC quiet, prevents Gen2 promotions, and delivers low-latency performance."
      },
      {
        "type": "text",
        "content": "> In production, I watch GC metrics and tune allocation-heavy paths continuously.”"
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "isSection": true,
    "id": "card-422"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: High-frequency workloads process millions of ticks per minute. Excess allocations trigger frequent GC cycles, inflating tail latency and risking missed market data. Disciplined allocation keeps GC quiet so SLAs stay predictable."
      },
      {
        "type": "text",
        "content": "A: Profile first. Use BenchmarkDotNet or dotnet-trace to find hot spots with high allocated bytes/op. Only refactor critical paths—premature optimization everywhere reduces readability."
      },
      {
        "type": "text",
        "content": "A: dotnet-counters monitor System.Runtime for Allocated Bytes/sec, Prometheus/OpenTelemetry metrics, Azure App Insights, or PerfView ETW traces. Alert when allocations or GC pause time exceed thresholds."
      },
      {
        "type": "text",
        "content": "A: Renting buffers from the shared pool reuses large arrays instead of allocating >85 KB objects per request, which would otherwise land on the LOH and cause expensive, fragmented Gen2 collections."
      },
      {
        "type": "text",
        "content": "A: For small immutable data (ticks, coordinates) that you pass frequently. Structs live inline/on the stack, so they avoid heap allocations and GC tracking. Keep them small (≤16 bytes) to minimize copy cost."
      },
      {
        "type": "text",
        "content": "A: They let you slice and parse existing buffers without creating new arrays or substrings. Span<T> stays within synchronous scopes; Memory<T> handles async flows while still pointing to the same backing buffer."
      },
      {
        "type": "text",
        "content": "A: Use structured logging with value-type overloads or interpolated string handlers, keep APIs generic, and avoid casting to object. When necessary, wrap primitives in custom struct formatters or use spans."
      },
      {
        "type": "text",
        "content": "A: Pipelines manage pooled buffers and expose ReadOnlySequence<T> so you can parse streaming data without copying. They also support backpressure and reduce per-message allocations vs manual Stream.ReadAsync."
      },
      {
        "type": "text",
        "content": "A: Write microbenchmarks with MemoryDiagnoser, run load tests, and compare GC metrics before/after. Only merge when data shows lower allocations and stable latency."
      },
      {
        "type": "text",
        "content": "A: Document guidelines (span usage, pooling patterns), add analyzers/tests for accidental allocations, and review PRs with perf instrumentation results so everyone understands the cost model."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "isSection": true,
    "id": "card-423"
  },
  {
    "question": "4️⃣ Reuse patterns that eliminate GC churn",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "using Microsoft.Extensions.ObjectPool;\n\nvar pool = ObjectPool.Create<MyReusableObject>();\nvar item = pool.Get();\n// use item...\npool.Return(item);",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "isConcept": true,
    "id": "card-424"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "var pool = ArrayPool<byte>.Shared;\nbyte[] buffer = pool.Rent(1024);\n// use it\npool.Return(buffer);",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "isConcept": true,
    "id": "card-425"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "string symbol = string.Intern(\"EURUSD\");",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "isConcept": true,
    "id": "card-426"
  },
  {
    "question": "5️⃣ Avoiding hidden allocations",
    "answer": [
      {
        "type": "code",
        "language": "bash",
        "code": "dotnet-trace collect --process-id <pid>\ndotnet-counters monitor System.Runtime",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/index.md",
    "isConcept": true,
    "id": "card-427"
  },
  {
    "question": "Why choose System.IO.Pipelines over raw Stream APIs?",
    "answer": [
      {
        "type": "text",
        "content": "Pipelines manage pooled buffers, handle partial reads, and support zero-copy parsing via ReadOnlySequence<T>, drastically reducing allocations and simplifying producer/consumer coordination for high-volume streams."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example Async.md",
    "id": "card-428"
  },
  {
    "question": "How do ReadOnlySequence<T> and Span<T> interact in this sample?",
    "answer": [
      {
        "type": "text",
        "content": "ReadOnlySequence<T> represents potentially multi-segment buffers from the pipeline. For simple cases, you use line.FirstSpan to get a contiguous Span<T>; otherwise, you can copy segments or use SequenceReader<T> to parse without copying."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example Async.md",
    "id": "card-429"
  },
  {
    "question": "Why run FillPipeAsync and ReadPipeAsync concurrently?",
    "answer": [
      {
        "type": "text",
        "content": "It decouples I/O from parsing, letting each stage run at its own pace. The pipe provides backpressure so writers pause when readers lag, preventing unbounded memory growth."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example Async.md",
    "id": "card-430"
  },
  {
    "question": "How do you ensure the parser handles partial messages?",
    "answer": [
      {
        "type": "text",
        "content": "The code searches for newline separators with PositionOf, only consuming complete messages. Partial lines remain in the buffer until more data arrives, avoiding premature consumption."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example Async.md",
    "id": "card-431"
  },
  {
    "question": "What’s the GC profile of this pipeline-based approach?",
    "answer": [
      {
        "type": "text",
        "content": "Aside from immutable symbol strings, there are no per-tick allocations—buffers come from the pipe’s pool, Utf8Parser works on spans, and structs stay on the stack. GC activity remains negligible even under heavy load."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example Async.md",
    "id": "card-432"
  },
  {
    "question": "How would you extend this example for TLS/SSL sockets?",
    "answer": [
      {
        "type": "text",
        "content": "Wrap the network stream (e.g., SslStream) but keep using pipelines. The pipe sits on top of any stream; as long as you feed decrypted bytes, the parsing logic remains the same."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example Async.md",
    "id": "card-433"
  },
  {
    "question": "How do you shut down gracefully?",
    "answer": [
      {
        "type": "text",
        "content": "When the stream closes, ReadAsync returns 0, so the writer completes. The reader loop detects result.IsCompleted, finishes processing remaining data, and completes the reader to release resources."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example Async.md",
    "id": "card-434"
  },
  {
    "question": "How can you integrate this with message brokers?",
    "answer": [
      {
        "type": "text",
        "content": "Replace OnTick with publisher code that writes to RabbitMQ/Kafka using pooled producers, ensuring you serialize ticks without allocations (e.g., using IBufferWriter<byte> to write to message bodies)."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example Async.md",
    "id": "card-435"
  },
  {
    "question": "What safeguards prevent slow consumers from OOMing the process?",
    "answer": [
      {
        "type": "text",
        "content": "Set bounded pipe limits or apply flow control by awaiting _pipe.Writer.FlushAsync(); pipelines use backpressure to throttle producers when readers fall behind."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example Async.md",
    "id": "card-436"
  },
  {
    "question": "How do you test this pipeline logic?",
    "answer": [
      {
        "type": "text",
        "content": "Use Pipe directly in tests with synthetic data, or feed a MemoryStream as shown. Assert on parsed ticks and monitor GC.GetAllocatedBytesForCurrentThread() to verify allocation behavior. > “I’d use System.IO.Pipelines for reading from the socket directly into pooled memory segments. > Then, using Span<byte> and Utf8Parser, I’d parse ticks inline — zero-copy. > Since Pipelines reuses buffers internally, the GC stays quiet, and the system scales linearly with load. > The parsing happens incrementally as data arrives — perfect for tick-by-tick streaming.” If you want to impress even more: > “We can even extend this with Channel<T> for backpressure and fan-out to multiple consumers, maintaining bounded memory while processing millions of ticks per second.”"
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example Async.md",
    "id": "card-437"
  },
  {
    "question": "🧩 Why use Pipelines instead of plain Stream.ReadAsync()",
    "answer": [
      {
        "type": "list",
        "items": [
          "NetworkStream.ReadAsync() requires you to manage buffers manually → risk of copying and extra allocations.",
          "Pipelines automatically manage buffer boundaries, reuse memory, and let you parse incoming data directly from pooled segments.",
          "It integrates with Span<T> and ReadOnlySequence<T> — perfect for zero-copy parsing."
        ]
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example Async.md",
    "isSection": true,
    "id": "card-438"
  },
  {
    "question": "⚙️ The scenario",
    "answer": [
      {
        "type": "text",
        "content": "Imagine a trading feed sending data like this:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "EURUSD,1.07432,1.07436\\n\nGBPUSD,1.24587,1.24592\\n\nUSDJPY,151.229,151.238\\n",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "We want to:"
      },
      {
        "type": "list",
        "items": [
          "Read from a network stream continuously",
          "Parse each tick line as it arrives (may arrive in chunks!)",
          "Process it with zero extra allocations"
        ]
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example Async.md",
    "isSection": true,
    "id": "card-439"
  },
  {
    "question": "📄 Full Example: AsyncTickStreamProcessor.cs",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "using System;\nusing System.Buffers;\nusing System.Buffers.Text;\nusing System.IO;\nusing System.IO.Pipelines;\nusing System.Net.Sockets;\nusing System.Text;\nusing System.Threading.Tasks;\n\npublic readonly struct Tick\n{\n    public string Symbol { get; }\n    public double Bid { get; }\n    public double Ask { get; }\n\n    public Tick(string symbol, double bid, double ask)\n    {\n        Symbol = symbol;\n        Bid = bid;\n        Ask = ask;\n    }\n\n    public override string ToString() => $\"{Symbol}: {Bid:F5}/{Ask:F5}\";\n}\n\npublic class TickStreamProcessor\n{\n    private readonly Pipe _pipe = new();\n\n    public async Task StartAsync(NetworkStream stream)\n    {\n        // Run reading and processing concurrently\n        var fill = FillPipeAsync(stream);\n        var read = ReadPipeAsync();\n        await Task.WhenAll(fill, read);\n    }\n\n    private async Task FillPipeAsync(NetworkStream stream)\n    {\n        const int MIN_BUFFER_SIZE = 512;\n\n        while (true)\n        {\n            Memory<byte> memory = _pipe.Writer.GetMemory(MIN_BUFFER_SIZE);\n            int bytesRead = await stream.ReadAsync(memory);\n\n            if (bytesRead == 0)\n                break; // client closed connection\n\n            // Tell the PipeWriter how much was read\n            _pipe.Writer.Advance(bytesRead);\n\n            // Make the data available to the reader\n            FlushResult result = await _pipe.Writer.FlushAsync();\n\n            if (result.IsCompleted)\n                break;\n        }\n\n        await _pipe.Writer.CompleteAsync();\n    }\n\n    private async Task ReadPipeAsync()\n    {\n        while (true)\n        {\n            ReadResult result = await _pipe.Reader.ReadAsync();\n            ReadOnlySequence<byte> buffer = result.Buffer;\n\n            SequencePosition? position;\n            do\n            {\n                position = buffer.PositionOf((byte)'\\n');\n\n                if (position != null)\n                {\n                    // Slice out one full line (tick)\n                    var line = buffer.Slice(0, position.Value);\n                    ParseAndProcess(line);\n\n                    // Skip past the newline\n                    buffer = buffer.Slice(buffer.GetPosition(1, position.Value));\n                }\n            } while (position != null);\n\n            // Tell the pipe how much we’ve consumed\n            _pipe.Reader.AdvanceTo(buffer.Start, buffer.End);\n\n            if (result.IsCompleted)\n                break;\n        }\n\n        await _pipe.Reader.CompleteAsync();\n    }\n\n    private static void ParseAndProcess(ReadOnlySequence<byte> line)\n    {\n        // We can safely work with single segment in this simple example\n        ReadOnlySpan<byte> span = line.FirstSpan;\n\n        int firstComma = span.IndexOf((byte)',');\n        if (firstComma == -1) return;\n\n        int secondComma = span.Slice(firstComma + 1).IndexOf((byte)',');\n        if (secondComma == -1) return;\n\n        secondComma += firstComma + 1;\n\n        string symbol = Encoding.ASCII.GetString(span[..firstComma]);\n        Utf8Parser.TryParse(span[(firstComma + 1)..secondComma], out double bid, out _);\n        Utf8Parser.TryParse(span[(secondComma + 1)..], out double ask, out _);\n\n        var tick = new Tick(symbol, bid, ask);\n        OnTick(tick);\n    }\n\n    private static void OnTick(in Tick tick)\n    {\n        // Process the tick (send to MQ, write to DB, etc.)\n        Console.WriteLine($\"{DateTime.UtcNow:HH:mm:ss.fff} {tick}\");\n    }\n}\n\npublic static class Program\n{\n    public static async Task Main()\n    {\n        // Demo: simulate network stream with a MemoryStream\n        var data = Encoding.ASCII.GetBytes(\n            \"EURUSD,1.07432,1.07436\\nGBPUSD,1.24587,1.24592\\nUSDJPY,151.229,151.238\\n\");\n        using var memStream = new MemoryStream(data);\n        using var fakeNetwork = new NetworkStream(memStream, FileAccess.Read);\n\n        var processor = new TickStreamProcessor();\n        await processor.StartAsync(fakeNetwork);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example Async.md",
    "isSection": true,
    "id": "card-440"
  },
  {
    "question": "🧠 What makes this “senior-level”",
    "answer": [
      {
        "type": "table",
        "headers": [
          "Feature",
          "Why it matters"
        ],
        "rows": [
          [
            "✅ System.IO.Pipelines",
            "Uses pre-allocated pooled memory segments (no per-read allocations)"
          ],
          [
            "✅ ReadOnlySequence<byte>",
            "Supports multi-segment data without copying"
          ],
          [
            "✅ Utf8Parser",
            "Parses directly from bytes — no string parsing overhead"
          ],
          [
            "✅ Tick is a readonly struct",
            "Stack-friendly, immutable, no GC tracking"
          ],
          [
            "✅ Async producer-consumer model",
            "Perfect for real-time stream ingestion"
          ],
          [
            "✅ Zero-copy",
            "Data flows from socket → pipeline → span → parsed → done"
          ]
        ]
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example Async.md",
    "isSection": true,
    "id": "card-441"
  },
  {
    "question": "⚡ GC Profile (steady state)",
    "answer": [
      {
        "type": "list",
        "items": [
          "No heap allocations per tick (except the symbol string).",
          "Data parsed directly from pooled pipeline buffers.",
          "Gen0 GC barely runs.",
          "No Gen1/Gen2 or LOH activity.",
          "Predictable latency even under 1M ticks/sec."
        ]
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example Async.md",
    "isSection": true,
    "id": "card-442"
  },
  {
    "question": "💬 Interview-ready talking points",
    "answer": [
      {
        "type": "text",
        "content": "When they ask “How would you handle a continuous high-volume data stream efficiently?”:"
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example Async.md",
    "isSection": true,
    "id": "card-443"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: Pipelines manage pooled buffers, handle partial reads, and support zero-copy parsing via ReadOnlySequence<T>, drastically reducing allocations and simplifying producer/consumer coordination for high-volume streams."
      },
      {
        "type": "text",
        "content": "A: ReadOnlySequence<T> represents potentially multi-segment buffers from the pipeline. For simple cases, you use line.FirstSpan to get a contiguous Span<T>; otherwise, you can copy segments or use SequenceReader<T> to parse without copying."
      },
      {
        "type": "text",
        "content": "A: It decouples I/O from parsing, letting each stage run at its own pace. The pipe provides backpressure so writers pause when readers lag, preventing unbounded memory growth."
      },
      {
        "type": "text",
        "content": "A: The code searches for newline separators with PositionOf, only consuming complete messages. Partial lines remain in the buffer until more data arrives, avoiding premature consumption."
      },
      {
        "type": "text",
        "content": "A: Aside from immutable symbol strings, there are no per-tick allocations—buffers come from the pipe’s pool, Utf8Parser works on spans, and structs stay on the stack. GC activity remains negligible even under heavy load."
      },
      {
        "type": "text",
        "content": "A: Wrap the network stream (e.g., SslStream) but keep using pipelines. The pipe sits on top of any stream; as long as you feed decrypted bytes, the parsing logic remains the same."
      },
      {
        "type": "text",
        "content": "A: When the stream closes, ReadAsync returns 0, so the writer completes. The reader loop detects result.IsCompleted, finishes processing remaining data, and completes the reader to release resources."
      },
      {
        "type": "text",
        "content": "A: Replace OnTick with publisher code that writes to RabbitMQ/Kafka using pooled producers, ensuring you serialize ticks without allocations (e.g., using IBufferWriter<byte> to write to message bodies)."
      },
      {
        "type": "text",
        "content": "A: Set bounded pipe limits or apply flow control by awaiting _pipe.Writer.FlushAsync(); pipelines use backpressure to throttle producers when readers fall behind."
      },
      {
        "type": "text",
        "content": "A: Use Pipe directly in tests with synthetic data, or feed a MemoryStream as shown. Assert on parsed ticks and monitor GC.GetAllocatedBytesForCurrentThread() to verify allocation behavior."
      },
      {
        "type": "text",
        "content": "> “I’d use System.IO.Pipelines for reading from the socket directly into pooled memory segments."
      },
      {
        "type": "text",
        "content": "> Then, using Span<byte> and Utf8Parser, I’d parse ticks inline — zero-copy."
      },
      {
        "type": "text",
        "content": "> Since Pipelines reuses buffers internally, the GC stays quiet, and the system scales linearly with load."
      },
      {
        "type": "text",
        "content": "> The parsing happens incrementally as data arrives — perfect for tick-by-tick streaming.”"
      },
      {
        "type": "text",
        "content": "If you want to impress even more:"
      },
      {
        "type": "text",
        "content": "> “We can even extend this with Channel<T> for backpressure and fan-out to multiple consumers, maintaining bounded memory while processing millions of ticks per second.”"
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example Async.md",
    "isSection": true,
    "id": "card-444"
  },
  {
    "question": "🧩 Optional extensions (for your learning or extra credit)",
    "answer": [
      {
        "type": "list",
        "items": [
          "Integrate with Channel<Tick> for multi-consumer processing (e.g., persistence, analytics, UI).",
          "Add benchmarking hooks using BenchmarkDotNet to measure ticks/sec and GC stats.",
          "Integrate ValueTask for hot async paths that complete synchronously.",
          "Enable DOTNET_GCServer=1 for throughput GC mode (you already know this 😉)."
        ]
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example Async.md",
    "isSection": true,
    "id": "card-445"
  },
  {
    "question": "✅ TL;DR Summary (for your interview answer)",
    "answer": [
      {
        "type": "text",
        "content": "> “In high-throughput systems like trading feeds, allocation discipline and efficient streaming are key."
      },
      {
        "type": "text",
        "content": "> I’d use System.IO.Pipelines to read network data asynchronously, parse directly with Span<T>/Utf8Parser, and avoid all per-tick allocations."
      },
      {
        "type": "text",
        "content": "> This design keeps Gen0 allocations minimal, avoids LOH churn, and provides stable, low-latency performance — even under sustained millions of ticks per second.”"
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example Async.md",
    "isSection": true,
    "id": "card-446"
  },
  {
    "question": "What does the benchmark prove when comparing Split vs Span parsing?",
    "answer": [
      {
        "type": "text",
        "content": "It shows the optimized implementation is faster and uses dramatically fewer allocations (tens of bytes vs kilobytes per tick). That reduction scales to gigabytes saved per second in production."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example.md",
    "id": "card-447"
  },
  {
    "question": "Why is Utf8Parser preferred over double.Parse here?",
    "answer": [
      {
        "type": "text",
        "content": "Utf8Parser operates directly on byte spans, avoiding string allocations and culture-dependent parsing. It’s ideal for fixed-format protocols and keeps parsing allocation-free."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example.md",
    "id": "card-448"
  },
  {
    "question": "How does renting buffers from ArrayPool<byte> help batch processing?",
    "answer": [
      {
        "type": "text",
        "content": "Each tick lines uses the same reusable buffer instead of creating a new byte array. Returning the buffer keeps the LOH clean and ensures steady-state memory usage regardless of batch size."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example.md",
    "id": "card-449"
  },
  {
    "question": "Why make Tick a readonly struct?",
    "answer": [
      {
        "type": "text",
        "content": "It keeps the data inline, prevents accidental mutation, and avoids heap allocations when passing ticks around. Combined with in Tick parameters, we avoid copies even for frequent calls."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example.md",
    "id": "card-450"
  },
  {
    "question": "What’s the benefit of in Tick on the OnTick method?",
    "answer": [
      {
        "type": "text",
        "content": "It passes the struct by readonly reference, eliminating defensive copies for large structs and preserving immutability guarantees without GC cost."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example.md",
    "id": "card-451"
  },
  {
    "question": "How would you extend this pattern for multi-threaded processing?",
    "answer": [
      {
        "type": "text",
        "content": "Use channels or System.Threading.Channels to fan out parsed ticks, but keep parsed structs allocation-free. Each consumer should reuse buffers or work with spans until serialization boundaries."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example.md",
    "id": "card-452"
  },
  {
    "question": "How do you verify there are no hidden allocations?",
    "answer": [
      {
        "type": "text",
        "content": "Run the benchmark with MemoryDiagnoser, inspect ETW events, or instrument code with GC.GetAllocatedBytesForCurrentThread() to ensure the optimized method stays within expected allocation budgets."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example.md",
    "id": "card-453"
  },
  {
    "question": "What happens if you forget to return buffers to the pool?",
    "answer": [
      {
        "type": "text",
        "content": "The pool will grow and eventually allocate new arrays, defeating the purpose and potentially causing memory leaks. Always return inside finally blocks to ensure deterministic cleanup."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example.md",
    "id": "card-454"
  },
  {
    "question": "How can you adapt this sample for binary protocols?",
    "answer": [
      {
        "type": "text",
        "content": "Replace ASCII parsing with direct span slicing over binary fields, using BinaryPrimitives or custom parsing logic; the same pooling and span principles apply."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example.md",
    "id": "card-455"
  },
  {
    "question": "How do you integrate this with logging or metrics without reintroducing allocations?",
    "answer": [
      {
        "type": "text",
        "content": "Emit structured logs with message templates, avoid string concatenation, and aggregate metrics using counters/gauges. When necessary, log summaries rather than per-tick details to keep the hot path clean."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example.md",
    "id": "card-456"
  },
  {
    "question": "📄 TickParsingBenchmarks.cs",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "using System;\nusing System.Buffers;\nusing System.Buffers.Text;\nusing System.Text;\nusing BenchmarkDotNet.Attributes;\nusing BenchmarkDotNet.Running;\n\n[MemoryDiagnoser] // shows allocations in bytes per operation\npublic class TickParsingBenchmarks\n{\n    private readonly string tickLine = \"EURUSD,1.07432,1.07436\";\n\n    [Benchmark(Baseline = true)]\n    public (string, double, double) NaiveParse()\n    {\n        var parts = tickLine.Split(',');\n        var symbol = parts[0];\n        var bid = double.Parse(parts[1]);\n        var ask = double.Parse(parts[2]);\n        return (symbol, bid, ask);\n    }\n\n    [Benchmark]\n    public (string, double, double) SpanParse()\n    {\n        ReadOnlySpan<byte> span = Encoding.ASCII.GetBytes(tickLine);\n\n        int firstComma = span.IndexOf((byte)',');\n        int secondComma = span.Slice(firstComma + 1).IndexOf((byte)',') + firstComma + 1;\n\n        string symbol = Encoding.ASCII.GetString(span[..firstComma]);\n        Utf8Parser.TryParse(span[(firstComma + 1)..secondComma], out double bid, out _);\n        Utf8Parser.TryParse(span[(secondComma + 1)..], out double ask, out _);\n\n        return (symbol, bid, ask);\n    }\n\n    public static void Main() => BenchmarkRunner.Run<TickParsingBenchmarks>();\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example.md",
    "isSection": true,
    "id": "card-457"
  },
  {
    "question": "⚙️ Run it:",
    "answer": [
      {
        "type": "code",
        "language": "bash",
        "code": "dotnet add package BenchmarkDotNet\ndotnet run -c Release",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example.md",
    "isSection": true,
    "id": "card-458"
  },
  {
    "question": "🧾 Expected results (typical output):",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "|    Method |       Mean |   Allocated |\n|----------- |-----------:|------------:|\n| NaiveParse |   1.200 μs |     1.24 KB |\n| SpanParse  |   0.245 μs |       32 B  |",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "💡 Interpretation:"
      },
      {
        "type": "list",
        "items": [
          "The optimized version is ~5× faster.",
          "It reduces allocations from ~1.2 KB → ~32 bytes per tick.",
          "Over 1M ticks/sec, that’s ~1.2 GB less allocation per second 🤯 — huge difference for a trading backend."
        ]
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example.md",
    "isSection": true,
    "id": "card-459"
  },
  {
    "question": "📄 TickProcessor.cs",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "using System;\nusing System.Buffers;\nusing System.Buffers.Text;\nusing System.Text;\n\npublic readonly struct Tick\n{\n    public string Symbol { get; }\n    public double Bid { get; }\n    public double Ask { get; }\n\n    public Tick(string symbol, double bid, double ask)\n    {\n        Symbol = symbol;\n        Bid = bid;\n        Ask = ask;\n    }\n\n    public override string ToString() => $\"{Symbol}: {Bid:F5}/{Ask:F5}\";\n}\n\npublic class TickProcessor\n{\n    private readonly ArrayPool<byte> _bufferPool = ArrayPool<byte>.Shared;\n\n    public void ProcessBatch(string[] rawTicks)\n    {\n        foreach (var tickStr in rawTicks)\n        {\n            // Rent a buffer (to avoid allocating new byte[] each time)\n            var buffer = _bufferPool.Rent(256);\n            try\n            {\n                int bytesWritten = Encoding.ASCII.GetBytes(tickStr, buffer);\n                var span = new ReadOnlySpan<byte>(buffer, 0, bytesWritten);\n\n                var tick = ParseTick(span);\n                OnTick(tick);\n            }\n            finally\n            {\n                _bufferPool.Return(buffer);\n            }\n        }\n    }\n\n    private static Tick ParseTick(ReadOnlySpan<byte> span)\n    {\n        // EURUSD,1.07432,1.07436\n        int firstComma = span.IndexOf((byte)',');\n        int secondComma = span.Slice(firstComma + 1).IndexOf((byte)',') + firstComma + 1;\n\n        string symbol = Encoding.ASCII.GetString(span[..firstComma]);\n        Utf8Parser.TryParse(span[(firstComma + 1)..secondComma], out double bid, out _);\n        Utf8Parser.TryParse(span[(secondComma + 1)..], out double ask, out _);\n\n        return new Tick(symbol, bid, ask);\n    }\n\n    private void OnTick(in Tick tick)\n    {\n        // Simulate publishing or processing the tick\n        Console.WriteLine(tick);\n    }\n}\n\npublic static class Program\n{\n    public static void Main()\n    {\n        var ticks = new[]\n        {\n            \"EURUSD,1.07432,1.07436\",\n            \"GBPUSD,1.24587,1.24592\",\n            \"USDJPY,151.229,151.238\",\n        };\n\n        var processor = new TickProcessor();\n        processor.ProcessBatch(ticks);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example.md",
    "isSection": true,
    "id": "card-460"
  },
  {
    "question": "💡 Key improvements explained",
    "answer": [
      {
        "type": "table",
        "headers": [
          "Improvement",
          "Why it matters"
        ],
        "rows": [
          [
            "ArrayPool<byte>.Shared",
            "Reuses buffers, avoids LOH churn"
          ],
          [
            "ReadOnlySpan<byte>",
            "Zero-copy slicing of incoming data"
          ],
          [
            "Utf8Parser",
            "Parses numeric values directly from bytes (no string allocations)"
          ],
          [
            "readonly struct Tick",
            "Stack-friendly immutable type, no GC tracking"
          ],
          [
            "in Tick (if used)",
            "Passes struct by ref → no copying"
          ]
        ]
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example.md",
    "isSection": true,
    "id": "card-461"
  },
  {
    "question": "🧩 Memory profile",
    "answer": [
      {
        "type": "list",
        "items": [
          "✅ Only one small string allocation per tick (Symbol)",
          "✅ No arrays or temporary strings per line",
          "✅ All other memory reused via pool",
          "✅ Negligible GC activity — steady-state latency"
        ]
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example.md",
    "isSection": true,
    "id": "card-462"
  },
  {
    "question": "🧠 Discussion points for your interview",
    "answer": [
      {
        "type": "text",
        "content": "When asked “How do you ensure your system stays fast under high load?” — say:"
      },
      {
        "type": "text",
        "content": "> “I design for allocation discipline — especially in tight loops."
      },
      {
        "type": "text",
        "content": "> For example, in our tick processor, we rent buffers from ArrayPool<T>, parse with Span<byte> and Utf8Parser to avoid string and array allocations, and use small readonly structs for data."
      },
      {
        "type": "text",
        "content": "> That keeps all transient data in Gen 0 and prevents Gen 2 pressure or LOH fragmentation."
      },
      {
        "type": "text",
        "content": "> In load tests, we confirmed negligible GC activity and stable latency even at millions of ticks per second.”"
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example.md",
    "isSection": true,
    "id": "card-463"
  },
  {
    "question": "✅ Pro tip",
    "answer": [
      {
        "type": "text",
        "content": "You can mention:"
      },
      {
        "type": "text",
        "content": "> “In production, I monitor dotnet-counters — if Gen 2 GC Count increases, that’s a red flag that something’s allocating too much. Then I use dotnet-trace or dotMemory to find the source.”"
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example.md",
    "isSection": true,
    "id": "card-464"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: It shows the optimized implementation is faster and uses dramatically fewer allocations (tens of bytes vs kilobytes per tick). That reduction scales to gigabytes saved per second in production."
      },
      {
        "type": "text",
        "content": "A: Utf8Parser operates directly on byte spans, avoiding string allocations and culture-dependent parsing. It’s ideal for fixed-format protocols and keeps parsing allocation-free."
      },
      {
        "type": "text",
        "content": "A: Each tick lines uses the same reusable buffer instead of creating a new byte array. Returning the buffer keeps the LOH clean and ensures steady-state memory usage regardless of batch size."
      },
      {
        "type": "text",
        "content": "A: It keeps the data inline, prevents accidental mutation, and avoids heap allocations when passing ticks around. Combined with in Tick parameters, we avoid copies even for frequent calls."
      },
      {
        "type": "text",
        "content": "A: It passes the struct by readonly reference, eliminating defensive copies for large structs and preserving immutability guarantees without GC cost."
      },
      {
        "type": "text",
        "content": "A: Use channels or System.Threading.Channels to fan out parsed ticks, but keep parsed structs allocation-free. Each consumer should reuse buffers or work with spans until serialization boundaries."
      },
      {
        "type": "text",
        "content": "A: Run the benchmark with MemoryDiagnoser, inspect ETW events, or instrument code with GC.GetAllocatedBytesForCurrentThread() to ensure the optimized method stays within expected allocation budgets."
      },
      {
        "type": "text",
        "content": "A: The pool will grow and eventually allocate new arrays, defeating the purpose and potentially causing memory leaks. Always return inside finally blocks to ensure deterministic cleanup."
      },
      {
        "type": "text",
        "content": "A: Replace ASCII parsing with direct span slicing over binary fields, using BinaryPrimitives or custom parsing logic; the same pooling and span principles apply."
      },
      {
        "type": "text",
        "content": "A: Emit structured logs with message templates, avoid string concatenation, and aggregate metrics using counters/gauges. When necessary, log summaries rather than per-tick details to keep the hot path clean."
      }
    ],
    "category": "notes",
    "topic": "Memory-Allocation-Discipline",
    "source": "notes/Memory-Allocation-Discipline/Memory Allocation Discipline Example.md",
    "isSection": true,
    "id": "card-465"
  },
  {
    "question": "How does DIP differ from simple dependency injection?",
    "answer": [
      {
        "type": "text",
        "content": "DIP is the principle (depend on abstractions). Dependency injection is a technique to supply those abstractions at runtime. You can inject dependencies manually or via a container, but DIP guides the design."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/D-Dependency-Inversion-Principle-DIP.md",
    "id": "card-466"
  },
  {
    "question": "What is the composition root, and why is it important?",
    "answer": [
      {
        "type": "text",
        "content": "It’s the startup/wiring area where concrete implementations are composed. Keeping all bindings there ensures the rest of the system depends only on abstractions, honoring DIP."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/D-Dependency-Inversion-Principle-DIP.md",
    "id": "card-467"
  },
  {
    "question": "How does DIP help with testing?",
    "answer": [
      {
        "type": "text",
        "content": "You can swap real implementations with mocks/stubs when classes depend on interfaces. Tests instantiate high-level modules with fake collaborators, keeping them fast and deterministic."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/D-Dependency-Inversion-Principle-DIP.md",
    "id": "card-468"
  },
  {
    "question": "When should you avoid introducing an interface?",
    "answer": [
      {
        "type": "text",
        "content": "If there’s only one implementation with no foreseeable variation, an interface may add noise. Start with concrete classes and extract interfaces when change pressure or testing needs arise."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/D-Dependency-Inversion-Principle-DIP.md",
    "id": "card-469"
  },
  {
    "question": "How does DIP interact with plug-in architectures?",
    "answer": [
      {
        "type": "text",
        "content": "Plugins implement shared abstractions and register themselves. The host app depends only on the abstraction, so new plugins drop in without code changes."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/D-Dependency-Inversion-Principle-DIP.md",
    "id": "card-470"
  },
  {
    "question": "How do you keep abstractions stable?",
    "answer": [
      {
        "type": "text",
        "content": "Define them in higher-level projects (Domain/Application) and keep them small. Avoid leaking infrastructure concerns (SQL-specific types) into the interface."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/D-Dependency-Inversion-Principle-DIP.md",
    "id": "card-471"
  },
  {
    "question": "What’s wrong with service locators?",
    "answer": [
      {
        "type": "text",
        "content": "They invert control but hide dependencies, making testing harder and violating SRP. Constructor injection makes dependencies explicit and honors DIP."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/D-Dependency-Inversion-Principle-DIP.md",
    "id": "card-472"
  },
  {
    "question": "How do you manage lifetimes when using DIP?",
    "answer": [
      {
        "type": "text",
        "content": "Use DI containers to manage transient/scoped/singleton lifetimes. Ensure high-level modules don’t own disposal of low-level resources—they rely on the container/composition root."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/D-Dependency-Inversion-Principle-DIP.md",
    "id": "card-473"
  },
  {
    "question": "How does DIP help with feature toggles?",
    "answer": [
      {
        "type": "text",
        "content": "You can register different implementations based on configuration (e.g., mock gateway vs real) without touching consuming code."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/D-Dependency-Inversion-Principle-DIP.md",
    "id": "card-474"
  },
  {
    "question": "How do you enforce DIP in architecture?",
    "answer": [
      {
        "type": "text",
        "content": "Use project references to ensure inner layers define interfaces while outer layers implement them. Architecture tests (NetArchTest) can verify that domain projects don’t depend on infrastructure assemblies."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/D-Dependency-Inversion-Principle-DIP.md",
    "id": "card-475"
  },
  {
    "question": "❌ Bad example (high-level depends on low-level concrete types)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class SqlOrderRepository\n{\n\tpublic void Save(Order order) { /* writes to SQL */ }\n}\n\npublic class OrderService\n{\n\tprivate readonly SqlOrderRepository _repo;\n\tpublic OrderService() { _repo = new SqlOrderRepository(); }\n\n\tpublic void PlaceOrder(Order order)\n\t{\n\t\t// business logic\n\t\t_repo.Save(order);\n\t}\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Problems: OrderService is tightly coupled to SqlOrderRepository. You cannot easily replace persistence (e.g., with an in-memory repo for tests or a different database) without changing OrderService."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/D-Dependency-Inversion-Principle-DIP.md",
    "isSection": true,
    "id": "card-476"
  },
  {
    "question": "✅ Good example (depend on abstractions — constructor injection)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface IOrderRepository { void Save(Order order); }\n\npublic class SqlOrderRepository : IOrderRepository\n{\n\tpublic void Save(Order order) { /* writes to SQL */ }\n}\n\npublic class OrderService\n{\n\tprivate readonly IOrderRepository _repo;\n\tpublic OrderService(IOrderRepository repo) => _repo = repo;\n\n\tpublic void PlaceOrder(Order order)\n\t{\n\t\t// business logic\n\t\t_repo.Save(order);\n\t}\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Now OrderService depends only on IOrderRepository. You can provide any implementation (SQL, NoSQL, mock) without changing OrderService."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/D-Dependency-Inversion-Principle-DIP.md",
    "isSection": true,
    "id": "card-477"
  },
  {
    "question": "Notes on usage and patterns",
    "answer": [
      {
        "type": "list",
        "items": [
          "Prefer constructor injection for mandatory dependencies — it makes required collaborators explicit and easy to test.",
          "Use interfaces or abstract base classes to define stable contracts for behavior. Keep these contracts small and focused.",
          "Inversion of Control (IoC) / DI containers can wire concrete implementations to abstractions at composition root, keeping production wiring out of business classes.",
          "Avoid service-locators embedded inside classes — they hide dependencies and complicate testing."
        ]
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/D-Dependency-Inversion-Principle-DIP.md",
    "isSection": true,
    "id": "card-478"
  },
  {
    "question": "DIP benefits",
    "answer": [
      {
        "type": "list",
        "items": [
          "Decouples high-level policy from low-level details.",
          "Makes unit testing trivial by allowing replacement with fakes/mocks.",
          "Improves flexibility to change implementations (datastores, external APIs) without touching business code."
        ]
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/D-Dependency-Inversion-Principle-DIP.md",
    "isSection": true,
    "id": "card-479"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: DIP is the principle (depend on abstractions). Dependency injection is a technique to supply those abstractions at runtime. You can inject dependencies manually or via a container, but DIP guides the design."
      },
      {
        "type": "text",
        "content": "A: It’s the startup/wiring area where concrete implementations are composed. Keeping all bindings there ensures the rest of the system depends only on abstractions, honoring DIP."
      },
      {
        "type": "text",
        "content": "A: You can swap real implementations with mocks/stubs when classes depend on interfaces. Tests instantiate high-level modules with fake collaborators, keeping them fast and deterministic."
      },
      {
        "type": "text",
        "content": "A: If there’s only one implementation with no foreseeable variation, an interface may add noise. Start with concrete classes and extract interfaces when change pressure or testing needs arise."
      },
      {
        "type": "text",
        "content": "A: Plugins implement shared abstractions and register themselves. The host app depends only on the abstraction, so new plugins drop in without code changes."
      },
      {
        "type": "text",
        "content": "A: Define them in higher-level projects (Domain/Application) and keep them small. Avoid leaking infrastructure concerns (SQL-specific types) into the interface."
      },
      {
        "type": "text",
        "content": "A: They invert control but hide dependencies, making testing harder and violating SRP. Constructor injection makes dependencies explicit and honors DIP."
      },
      {
        "type": "text",
        "content": "A: Use DI containers to manage transient/scoped/singleton lifetimes. Ensure high-level modules don’t own disposal of low-level resources—they rely on the container/composition root."
      },
      {
        "type": "text",
        "content": "A: You can register different implementations based on configuration (e.g., mock gateway vs real) without touching consuming code."
      },
      {
        "type": "text",
        "content": "A: Use project references to ensure inner layers define interfaces while outer layers implement them. Architecture tests (NetArchTest) can verify that domain projects don’t depend on infrastructure assemblies."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/D-Dependency-Inversion-Principle-DIP.md",
    "isSection": true,
    "id": "card-480"
  },
  {
    "question": "D — Dependency Inversion Principle (DIP)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class SqlOrderRepository\n{\n\tpublic void Save(Order order) { /* writes to SQL */ }\n}\n\npublic class OrderService\n{\n\tprivate readonly SqlOrderRepository _repo;\n\tpublic OrderService() { _repo = new SqlOrderRepository(); }\n\n\tpublic void PlaceOrder(Order order)\n\t{\n\t\t// business logic\n\t\t_repo.Save(order);\n\t}\n}",
        "codeType": "bad"
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/D-Dependency-Inversion-Principle-DIP.md",
    "isConcept": true,
    "id": "card-481"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface IOrderRepository { void Save(Order order); }\n\npublic class SqlOrderRepository : IOrderRepository\n{\n\tpublic void Save(Order order) { /* writes to SQL */ }\n}\n\npublic class OrderService\n{\n\tprivate readonly IOrderRepository _repo;\n\tpublic OrderService(IOrderRepository repo) => _repo = repo;\n\n\tpublic void PlaceOrder(Order order)\n\t{\n\t\t// business logic\n\t\t_repo.Save(order);\n\t}\n}",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/D-Dependency-Inversion-Principle-DIP.md",
    "isConcept": true,
    "id": "card-482"
  },
  {
    "question": "How does ISP improve system evolvability?",
    "answer": [
      {
        "type": "text",
        "content": "Narrow interfaces reduce the blast radius of changes. Updating ITradeExecutor doesn’t force unrelated services (like notifications) to recompile or implement dummy methods."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/I-Interface-Segregation-Principle-ISP.md",
    "id": "card-483"
  },
  {
    "question": "What’s a sign you need ISP?",
    "answer": [
      {
        "type": "text",
        "content": "Clients implementing “not required” methods or throwing NotSupportedException. Interfaces with dozens of members or mixed responsibilities are prime candidates."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/I-Interface-Segregation-Principle-ISP.md",
    "id": "card-484"
  },
  {
    "question": "How does ISP relate to microservices?",
    "answer": [
      {
        "type": "text",
        "content": "External contracts should expose purpose-built endpoints, not monolithic APIs. Clients consume only what they need, reducing coupling and versioning risks."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/I-Interface-Segregation-Principle-ISP.md",
    "id": "card-485"
  },
  {
    "question": "How do interface segregations interact with DI?",
    "answer": [
      {
        "type": "text",
        "content": "DI allows registering multiple interfaces per class. For example, a service implementing both ITradeExecutor and IRiskService can be resolved through whichever interface the consumer needs."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/I-Interface-Segregation-Principle-ISP.md",
    "id": "card-486"
  },
  {
    "question": "How do you avoid explosion of tiny interfaces?",
    "answer": [
      {
        "type": "text",
        "content": "Segregate by cohesive responsibilities, not per method. Keep interfaces meaningful and group operations that change together."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/I-Interface-Segregation-Principle-ISP.md",
    "id": "card-487"
  },
  {
    "question": "How does ISP benefit testing?",
    "answer": [
      {
        "type": "text",
        "content": "Smaller interfaces mean simpler mocks/stubs. Tests focus on the behavior under test without faking unrelated members."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/I-Interface-Segregation-Principle-ISP.md",
    "id": "card-488"
  },
  {
    "question": "Can versioning break ISP?",
    "answer": [
      {
        "type": "text",
        "content": "Adding methods to a fat interface forces consumers to adapt. With segregated interfaces, you can introduce new interfaces or extension methods without breaking existing ones."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/I-Interface-Segregation-Principle-ISP.md",
    "id": "card-489"
  },
  {
    "question": "How do you enforce ISP in reviews?",
    "answer": [
      {
        "type": "text",
        "content": "Ask “which clients need each member?” and require justification for multi-purpose interfaces. NetArchTest or custom analyzers can flag interfaces exceeding size thresholds."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/I-Interface-Segregation-Principle-ISP.md",
    "id": "card-490"
  },
  {
    "question": "How does ISP apply to domain events?",
    "answer": [
      {
        "type": "text",
        "content": "Publish separate events per concern instead of mega-events containing everything. Consumers subscribe only to relevant payloads, mirroring ISP."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/I-Interface-Segregation-Principle-ISP.md",
    "id": "card-491"
  },
  {
    "question": "How does ISP help with performance?",
    "answer": [
      {
        "type": "text",
        "content": "Clients avoid referencing heavy dependencies they don't use (e.g., price feeds requiring streaming libs). This reduces memory footprint and simplifies deployment."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/I-Interface-Segregation-Principle-ISP.md",
    "id": "card-492"
  },
  {
    "question": "❌ Bad example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface ITradingPlatform\n{\n    void ExecuteOrder(Order order);\n    void StreamMarketData();\n    void SendNotification();\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Each implementation is forced to implement everything, even if it doesn’t need to."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/I-Interface-Segregation-Principle-ISP.md",
    "isSection": true,
    "id": "card-493"
  },
  {
    "question": "✅ Good example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface ITradeExecutor { void ExecuteOrder(Order order); }\npublic interface IMarketDataFeed { void StreamMarketData(); }\npublic interface INotifier { void SendNotification(); }",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "💡 In trading:"
      },
      {
        "type": "list",
        "items": [
          "IPriceFeed for market data",
          "ITradeExecutor for execution",
          "IRiskService for validation"
        ]
      },
      {
        "type": "text",
        "content": "You can plug each service independently into different workflows."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/I-Interface-Segregation-Principle-ISP.md",
    "isSection": true,
    "id": "card-494"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: Narrow interfaces reduce the blast radius of changes. Updating ITradeExecutor doesn’t force unrelated services (like notifications) to recompile or implement dummy methods."
      },
      {
        "type": "text",
        "content": "A: Clients implementing “not required” methods or throwing NotSupportedException. Interfaces with dozens of members or mixed responsibilities are prime candidates."
      },
      {
        "type": "text",
        "content": "A: External contracts should expose purpose-built endpoints, not monolithic APIs. Clients consume only what they need, reducing coupling and versioning risks."
      },
      {
        "type": "text",
        "content": "A: DI allows registering multiple interfaces per class. For example, a service implementing both ITradeExecutor and IRiskService can be resolved through whichever interface the consumer needs."
      },
      {
        "type": "text",
        "content": "A: Segregate by cohesive responsibilities, not per method. Keep interfaces meaningful and group operations that change together."
      },
      {
        "type": "text",
        "content": "A: Smaller interfaces mean simpler mocks/stubs. Tests focus on the behavior under test without faking unrelated members."
      },
      {
        "type": "text",
        "content": "A: Adding methods to a fat interface forces consumers to adapt. With segregated interfaces, you can introduce new interfaces or extension methods without breaking existing ones."
      },
      {
        "type": "text",
        "content": "A: Ask “which clients need each member?” and require justification for multi-purpose interfaces. NetArchTest or custom analyzers can flag interfaces exceeding size thresholds."
      },
      {
        "type": "text",
        "content": "A: Publish separate events per concern instead of mega-events containing everything. Consumers subscribe only to relevant payloads, mirroring ISP."
      },
      {
        "type": "text",
        "content": "A: Clients avoid referencing heavy dependencies they don't use (e.g., price feeds requiring streaming libs). This reduces memory footprint and simplifies deployment."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/I-Interface-Segregation-Principle-ISP.md",
    "isSection": true,
    "id": "card-495"
  },
  {
    "question": "I — Interface Segregation Principle (ISP)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface ITradingPlatform\n{\n    void ExecuteOrder(Order order);\n    void StreamMarketData();\n    void SendNotification();\n}",
        "codeType": "bad"
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/I-Interface-Segregation-Principle-ISP.md",
    "isConcept": true,
    "id": "card-496"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface ITradeExecutor { void ExecuteOrder(Order order); }\npublic interface IMarketDataFeed { void StreamMarketData(); }\npublic interface INotifier { void SendNotification(); }",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/I-Interface-Segregation-Principle-ISP.md",
    "isConcept": true,
    "id": "card-497"
  },
  {
    "question": "Why are SOLID principles important for senior engineers?",
    "answer": [
      {
        "type": "text",
        "content": "They’re heuristics for keeping codebases maintainable and evolvable. Applying SOLID reduces regressions, eases testing, and makes large systems like trading platforms adaptable to new requirements."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/index.md",
    "id": "card-498"
  },
  {
    "question": "How do SOLID principles interact with Clean Architecture?",
    "answer": [
      {
        "type": "text",
        "content": "Clean Architecture enforces layer boundaries; SOLID guides class-level design inside those layers. Together they ensure domains stay decoupled from infrastructure and classes remain focused."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/index.md",
    "id": "card-499"
  },
  {
    "question": "Can you break SOLID intentionally?",
    "answer": [
      {
        "type": "text",
        "content": "Yes, when performance or simplicity demands it. Document deviations, ensure tests cover the risk, and revisit later. SOLID is guidance, not dogma."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/index.md",
    "id": "card-500"
  },
  {
    "question": "How do SOLID principles apply to microservices?",
    "answer": [
      {
        "type": "text",
        "content": "Each service should have a single bounded context (SRP), expose stable contracts (OCP), adhere to interface segregation for clients, and depend on abstractions so infrastructure can evolve independently."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/index.md",
    "id": "card-501"
  },
  {
    "question": "What metrics signal SOLID violations?",
    "answer": [
      {
        "type": "text",
        "content": "High cyclomatic complexity, low cohesion, many reasons to change a class (SRP), or ripple effects from small requirements. Code reviews and architecture fitness functions can catch these."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/index.md",
    "id": "card-502"
  },
  {
    "question": "How do SOLID principles improve testing?",
    "answer": [
      {
        "type": "text",
        "content": "Focused classes are easier to test (SRP), abstractions enable mocking (DIP), and segregated interfaces prevent massive fakes. This reduces flakiness and speeds CI feedback."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/index.md",
    "id": "card-503"
  },
  {
    "question": "How does LSP relate to API design?",
    "answer": [
      {
        "type": "text",
        "content": "Derived types must honor base contracts; otherwise substitutability fails and consumers break. In APIs, ensure new versions remain backward compatible, mirroring LSP."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/index.md",
    "id": "card-504"
  },
  {
    "question": "How does ISP influence public contracts?",
    "answer": [
      {
        "type": "text",
        "content": "Expose narrow interfaces tailored to specific clients so they don't depend on methods they don't use. This minimizes breaking changes and improves clarity."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/index.md",
    "id": "card-505"
  },
  {
    "question": "How does DIP show up in ASP.NET Core?",
    "answer": [
      {
        "type": "text",
        "content": "Services depend on abstractions registered in DI containers. Infrastructure injects concrete implementations, enabling easier testing and swapping components like data stores."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/index.md",
    "id": "card-506"
  },
  {
    "question": "How do you balance SOLID with performance?",
    "answer": [
      {
        "type": "text",
        "content": "Apply SOLID first, measure, and only optimize hotspots. If adding an abstraction hurts perf, encapsulate the optimized path while documenting why the deviation exists."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/index.md",
    "id": "card-507"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: They’re heuristics for keeping codebases maintainable and evolvable. Applying SOLID reduces regressions, eases testing, and makes large systems like trading platforms adaptable to new requirements."
      },
      {
        "type": "text",
        "content": "A: Clean Architecture enforces layer boundaries; SOLID guides class-level design inside those layers. Together they ensure domains stay decoupled from infrastructure and classes remain focused."
      },
      {
        "type": "text",
        "content": "A: Yes, when performance or simplicity demands it. Document deviations, ensure tests cover the risk, and revisit later. SOLID is guidance, not dogma."
      },
      {
        "type": "text",
        "content": "A: Each service should have a single bounded context (SRP), expose stable contracts (OCP), adhere to interface segregation for clients, and depend on abstractions so infrastructure can evolve independently."
      },
      {
        "type": "text",
        "content": "A: High cyclomatic complexity, low cohesion, many reasons to change a class (SRP), or ripple effects from small requirements. Code reviews and architecture fitness functions can catch these."
      },
      {
        "type": "text",
        "content": "A: Focused classes are easier to test (SRP), abstractions enable mocking (DIP), and segregated interfaces prevent massive fakes. This reduces flakiness and speeds CI feedback."
      },
      {
        "type": "text",
        "content": "A: Derived types must honor base contracts; otherwise substitutability fails and consumers break. In APIs, ensure new versions remain backward compatible, mirroring LSP."
      },
      {
        "type": "text",
        "content": "A: Expose narrow interfaces tailored to specific clients so they don't depend on methods they don't use. This minimizes breaking changes and improves clarity."
      },
      {
        "type": "text",
        "content": "A: Services depend on abstractions registered in DI containers. Infrastructure injects concrete implementations, enabling easier testing and swapping components like data stores."
      },
      {
        "type": "text",
        "content": "A: Apply SOLID first, measure, and only optimize hotspots. If adding an abstraction hurts perf, encapsulate the optimized path while documenting why the deviation exists."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/index.md",
    "isSection": true,
    "id": "card-508"
  },
  {
    "question": "How do you detect LSP violations?",
    "answer": [
      {
        "type": "text",
        "content": "When derived types throw or ignore base contract requirements (e.g., methods not supported) or when client code needs is checks before calling base members. Unit tests failing when swapping implementations are another sign."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/L-Liskov-Substitution-Principle-LSP.md",
    "id": "card-509"
  },
  {
    "question": "How does LSP relate to API compatibility?",
    "answer": [
      {
        "type": "text",
        "content": "New API versions must remain substitutable for clients expecting older behavior. Breaking contract expectations (return types, error codes) violates LSP-like guarantees."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/L-Liskov-Substitution-Principle-LSP.md",
    "id": "card-510"
  },
  {
    "question": "How can preconditions/postconditions break LSP?",
    "answer": [
      {
        "type": "text",
        "content": "Derived classes shouldn’t strengthen preconditions (require extra setup) nor weaken postconditions (provide less result). Keep invariants consistent with the base definition."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/L-Liskov-Substitution-Principle-LSP.md",
    "id": "card-511"
  },
  {
    "question": "When should you refactor inheritance into composition?",
    "answer": [
      {
        "type": "text",
        "content": "If derived classes must disable base behavior or add flags to avoid inherited logic, switch to composition/strategies. This keeps contracts honest and avoids LSP pitfalls."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/L-Liskov-Substitution-Principle-LSP.md",
    "id": "card-512"
  },
  {
    "question": "How do you test for LSP compliance?",
    "answer": [
      {
        "type": "text",
        "content": "Create contract tests that run against the base interface and execute them for every implementation. If any fail, the type isn’t substitutable."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/L-Liskov-Substitution-Principle-LSP.md",
    "id": "card-513"
  },
  {
    "question": "Does LSP apply to generics or covariance?",
    "answer": [
      {
        "type": "text",
        "content": "Yes—ensure generic constraints and variance don't allow incompatible substitutions that break runtime behavior (e.g., returning base types where derived specifics are expected)."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/L-Liskov-Substitution-Principle-LSP.md",
    "id": "card-514"
  },
  {
    "question": "How does LSP affect exception handling?",
    "answer": [
      {
        "type": "text",
        "content": "Derived classes should not introduce new unchecked exceptions for operations the base class promised to handle. Keep the failure semantics consistent."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/L-Liskov-Substitution-Principle-LSP.md",
    "id": "card-515"
  },
  {
    "question": "How does LSP influence serialization/deserialization?",
    "answer": [
      {
        "type": "text",
        "content": "When polymorphic types are serialized, derived classes must adhere to expected schema so consumers can deserialize using the base contract without surprises."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/L-Liskov-Substitution-Principle-LSP.md",
    "id": "card-516"
  },
  {
    "question": "What design smell indicates an LSP issue?",
    "answer": [
      {
        "type": "text",
        "content": "Methods in base types throwing NotImplementedException in derived classes, or switch statements on type codes. These indicate the hierarchy is mis-modeled."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/L-Liskov-Substitution-Principle-LSP.md",
    "id": "card-517"
  },
  {
    "question": "How does LSP tie into SOLID overall?",
    "answer": [
      {
        "type": "text",
        "content": "Without LSP, OCP fails—extensions break existing clients. Ensuring substitutability keeps abstractions reliable and enables safe extension."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/L-Liskov-Substitution-Principle-LSP.md",
    "id": "card-518"
  },
  {
    "question": "❌ Bad example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public abstract class Order\n{\n    public abstract void Cancel();\n}\n\npublic class MarketOrder : Order\n{\n    public override void Cancel() => Console.WriteLine(\"Cancelled\");\n}\n\npublic class InstantOrder : Order\n{\n    public override void Cancel() => throw new NotSupportedException();\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "❌ Violates LSP — an InstantOrder cannot cancel, so substituting it breaks code."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/L-Liskov-Substitution-Principle-LSP.md",
    "isSection": true,
    "id": "card-519"
  },
  {
    "question": "✅ Good example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface ICancelableOrder\n{\n    void Cancel();\n}\npublic class MarketOrder : ICancelableOrder { public void Cancel() { /* ... */ } }",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "💡 In trading systems:"
      },
      {
        "type": "text",
        "content": "If you design a Strategy base class, ensure all derived strategies behave consistently and safely under the same interface."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/L-Liskov-Substitution-Principle-LSP.md",
    "isSection": true,
    "id": "card-520"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: When derived types throw or ignore base contract requirements (e.g., methods not supported) or when client code needs is checks before calling base members. Unit tests failing when swapping implementations are another sign."
      },
      {
        "type": "text",
        "content": "A: New API versions must remain substitutable for clients expecting older behavior. Breaking contract expectations (return types, error codes) violates LSP-like guarantees."
      },
      {
        "type": "text",
        "content": "A: Derived classes shouldn’t strengthen preconditions (require extra setup) nor weaken postconditions (provide less result). Keep invariants consistent with the base definition."
      },
      {
        "type": "text",
        "content": "A: If derived classes must disable base behavior or add flags to avoid inherited logic, switch to composition/strategies. This keeps contracts honest and avoids LSP pitfalls."
      },
      {
        "type": "text",
        "content": "A: Create contract tests that run against the base interface and execute them for every implementation. If any fail, the type isn’t substitutable."
      },
      {
        "type": "text",
        "content": "A: Yes—ensure generic constraints and variance don't allow incompatible substitutions that break runtime behavior (e.g., returning base types where derived specifics are expected)."
      },
      {
        "type": "text",
        "content": "A: Derived classes should not introduce new unchecked exceptions for operations the base class promised to handle. Keep the failure semantics consistent."
      },
      {
        "type": "text",
        "content": "A: When polymorphic types are serialized, derived classes must adhere to expected schema so consumers can deserialize using the base contract without surprises."
      },
      {
        "type": "text",
        "content": "A: Methods in base types throwing NotImplementedException in derived classes, or switch statements on type codes. These indicate the hierarchy is mis-modeled."
      },
      {
        "type": "text",
        "content": "A: Without LSP, OCP fails—extensions break existing clients. Ensuring substitutability keeps abstractions reliable and enables safe extension."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/L-Liskov-Substitution-Principle-LSP.md",
    "isSection": true,
    "id": "card-521"
  },
  {
    "question": "L — Liskov Substitution Principle (LSP)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public abstract class Order\n{\n    public abstract void Cancel();\n}\n\npublic class MarketOrder : Order\n{\n    public override void Cancel() => Console.WriteLine(\"Cancelled\");\n}\n\npublic class InstantOrder : Order\n{\n    public override void Cancel() => throw new NotSupportedException();\n}",
        "codeType": "bad"
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/L-Liskov-Substitution-Principle-LSP.md",
    "isConcept": true,
    "id": "card-522"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface ICancelableOrder\n{\n    void Cancel();\n}\npublic class MarketOrder : ICancelableOrder { public void Cancel() { /* ... */ } }",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/L-Liskov-Substitution-Principle-LSP.md",
    "isConcept": true,
    "id": "card-523"
  },
  {
    "question": "How do you ensure new features don’t require modifying existing classes?",
    "answer": [
      {
        "type": "text",
        "content": "Depend on abstractions and register new implementations via DI. Use patterns like Strategy or Decorator so new behavior plugs in without touching existing code."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/O-Open-Closed-Principle-OCP.md",
    "id": "card-524"
  },
  {
    "question": "What signals an OCP violation?",
    "answer": [
      {
        "type": "text",
        "content": "If every new platform or workflow requires editing the same switch statement or base class, you’re modifying existing code instead of extending via new types."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/O-Open-Closed-Principle-OCP.md",
    "id": "card-525"
  },
  {
    "question": "How do feature flags interact with OCP?",
    "answer": [
      {
        "type": "text",
        "content": "Feature flags can select between implementations at runtime without modifying code. Register both paths and toggle via configuration, respecting OCP."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/O-Open-Closed-Principle-OCP.md",
    "id": "card-526"
  },
  {
    "question": "How do you balance OCP with readability?",
    "answer": [
      {
        "type": "text",
        "content": "Don’t over-abstract. Introduce extension points only when change pressure exists. Keep base abstractions small so extensions remain straightforward."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/O-Open-Closed-Principle-OCP.md",
    "id": "card-527"
  },
  {
    "question": "How does OCP apply to APIs?",
    "answer": [
      {
        "type": "text",
        "content": "Version APIs instead of changing contracts. Add new endpoints or fields while keeping existing behavior untouched to avoid breaking clients."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/O-Open-Closed-Principle-OCP.md",
    "id": "card-528"
  },
  {
    "question": "What tooling helps enforce OCP?",
    "answer": [
      {
        "type": "text",
        "content": "Architecture tests verifying dependencies, code analyzers warning on large switch statements, and DI/registration conventions that encourage extending via new classes."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/O-Open-Closed-Principle-OCP.md",
    "id": "card-529"
  },
  {
    "question": "How do templates or generics aid OCP?",
    "answer": [
      {
        "type": "text",
        "content": "Generics let you inject behavior (e.g., IRepository<T>) without rewriting code for each type. Base functionality stays closed; new types extend usage."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/O-Open-Closed-Principle-OCP.md",
    "id": "card-530"
  },
  {
    "question": "How do you vet extension points for security/compliance?",
    "answer": [
      {
        "type": "text",
        "content": "Document allowed extensions, run threat modeling on new implementations, and add automated tests to ensure they honor validation/risk rules like existing types."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/O-Open-Closed-Principle-OCP.md",
    "id": "card-531"
  },
  {
    "question": "Can configuration count as “extension”?",
    "answer": [
      {
        "type": "text",
        "content": "If behavior is data-driven (rules engine, config-based workflows), adding entries might be enough. Ensure validation guards keep config changes safe."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/O-Open-Closed-Principle-OCP.md",
    "id": "card-532"
  },
  {
    "question": "How does OCP help with plugin architectures?",
    "answer": [
      {
        "type": "text",
        "content": "Plugins implement known interfaces and register themselves. The host never changes; you drop in new assemblies to extend behavior safely."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/O-Open-Closed-Principle-OCP.md",
    "id": "card-533"
  },
  {
    "question": "✅ Example: New trade execution channels",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface ITradeExecutor\n{\n    void Execute(Order order);\n}\n\npublic class Mt4Executor : ITradeExecutor\n{\n    public void Execute(Order order) => Console.WriteLine(\"MT4 order executed\");\n}\n\npublic class Mt5Executor : ITradeExecutor\n{\n    public void Execute(Order order) => Console.WriteLine(\"MT5 order executed\");\n}\n\n// Add new platform without touching existing code\npublic class TradeService\n{\n    private readonly ITradeExecutor _executor;\n    public TradeService(ITradeExecutor executor) => _executor = executor;\n\n    public void Execute(Order order) => _executor.Execute(order);\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "✅ Adding a new trading platform (like cTrader or FIX API) just means creating another ITradeExecutor implementation — no code modification, only extension."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/O-Open-Closed-Principle-OCP.md",
    "isSection": true,
    "id": "card-534"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: Depend on abstractions and register new implementations via DI. Use patterns like Strategy or Decorator so new behavior plugs in without touching existing code."
      },
      {
        "type": "text",
        "content": "A: If every new platform or workflow requires editing the same switch statement or base class, you’re modifying existing code instead of extending via new types."
      },
      {
        "type": "text",
        "content": "A: Feature flags can select between implementations at runtime without modifying code. Register both paths and toggle via configuration, respecting OCP."
      },
      {
        "type": "text",
        "content": "A: Don’t over-abstract. Introduce extension points only when change pressure exists. Keep base abstractions small so extensions remain straightforward."
      },
      {
        "type": "text",
        "content": "A: Version APIs instead of changing contracts. Add new endpoints or fields while keeping existing behavior untouched to avoid breaking clients."
      },
      {
        "type": "text",
        "content": "A: Architecture tests verifying dependencies, code analyzers warning on large switch statements, and DI/registration conventions that encourage extending via new classes."
      },
      {
        "type": "text",
        "content": "A: Generics let you inject behavior (e.g., IRepository<T>) without rewriting code for each type. Base functionality stays closed; new types extend usage."
      },
      {
        "type": "text",
        "content": "A: Document allowed extensions, run threat modeling on new implementations, and add automated tests to ensure they honor validation/risk rules like existing types."
      },
      {
        "type": "text",
        "content": "A: If behavior is data-driven (rules engine, config-based workflows), adding entries might be enough. Ensure validation guards keep config changes safe."
      },
      {
        "type": "text",
        "content": "A: Plugins implement known interfaces and register themselves. The host never changes; you drop in new assemblies to extend behavior safely."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/O-Open-Closed-Principle-OCP.md",
    "isSection": true,
    "id": "card-535"
  },
  {
    "question": "O — Open/Closed Principle (OCP)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface ITradeExecutor\n{\n    void Execute(Order order);\n}\n\npublic class Mt4Executor : ITradeExecutor\n{\n    public void Execute(Order order) => Console.WriteLine(\"MT4 order executed\");\n}\n\npublic class Mt5Executor : ITradeExecutor\n{\n    public void Execute(Order order) => Console.WriteLine(\"MT5 order executed\");\n}\n\n// Add new platform without touching existing code\npublic class TradeService\n{\n    private readonly ITradeExecutor _executor;\n    public TradeService(ITradeExecutor executor) => _executor = executor;\n\n    public void Execute(Order order) => _executor.Execute(order);\n}",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/O-Open-Closed-Principle-OCP.md",
    "isConcept": true,
    "id": "card-536"
  },
  {
    "question": "How do you recognize SRP violations?",
    "answer": [
      {
        "type": "text",
        "content": "When a class changes for multiple reasons—new logging needs, validation tweaks, and execution rules all touching the same file. High churn and wide unit tests are red flags."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/S-Single-Responsibility-Principle-SRP.md",
    "id": "card-537"
  },
  {
    "question": "How does SRP improve deploy cadence?",
    "answer": [
      {
        "type": "text",
        "content": "Focused classes let teams modify one area without risk to others, reducing merge conflicts and enabling independent deployments with fewer regression tests."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/S-Single-Responsibility-Principle-SRP.md",
    "id": "card-538"
  },
  {
    "question": "Can a class coordinate other classes and still obey SRP?",
    "answer": [
      {
        "type": "text",
        "content": "Yes, if its sole reason is orchestration. For example, OrderProcessor can call validator, risk, and executor; its responsibility is orchestration, not validation logic itself."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/S-Single-Responsibility-Principle-SRP.md",
    "id": "card-539"
  },
  {
    "question": "How does SRP influence folder/project structure?",
    "answer": [
      {
        "type": "text",
        "content": "Group types by feature/use case, not by type (e.g., Orders/OrderValidator.cs). This keeps responsibilities cohesive and discoverable."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/S-Single-Responsibility-Principle-SRP.md",
    "id": "card-540"
  },
  {
    "question": "What role do interfaces play in SRP?",
    "answer": [
      {
        "type": "text",
        "content": "Interfaces define focused contracts (IOrderValidator, IRiskService), ensuring implementations stay narrow and substitution-friendly."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/S-Single-Responsibility-Principle-SRP.md",
    "id": "card-541"
  },
  {
    "question": "How do you refactor SRP violations safely?",
    "answer": [
      {
        "type": "text",
        "content": "Extract class responsibilities incrementally, add unit tests, and use DI to wire new components. Feature toggles can help decouple releases."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/S-Single-Responsibility-Principle-SRP.md",
    "id": "card-542"
  },
  {
    "question": "Can modules (not just classes) violate SRP?",
    "answer": [
      {
        "type": "text",
        "content": "Absolutely. Services that mix API logic, data access, and scheduling also violate SRP; break them into modules or microservices with single purposes."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/S-Single-Responsibility-Principle-SRP.md",
    "id": "card-543"
  },
  {
    "question": "How does SRP impact observability?",
    "answer": [
      {
        "type": "text",
        "content": "Focused components emit targeted metrics/logs, making it easier to pinpoint issues (e.g., validation vs execution failures)."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/S-Single-Responsibility-Principle-SRP.md",
    "id": "card-544"
  },
  {
    "question": "What tooling catches SRP issues?",
    "answer": [
      {
        "type": "text",
        "content": "Static analysis for cyclomatic complexity, architecture tests (NetArchTest), and code reviews that demand clear reasons-to-change statements."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/S-Single-Responsibility-Principle-SRP.md",
    "id": "card-545"
  },
  {
    "question": "How do you communicate SRP to non-technical stakeholders?",
    "answer": [
      {
        "type": "text",
        "content": "Describe it as separating responsibilities like accounting vs trading—each workflow has its own owner, reducing risk when requirements change."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/S-Single-Responsibility-Principle-SRP.md",
    "id": "card-546"
  },
  {
    "question": "❌ Bad example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TradeManager\n{\n    public void ValidateOrder(Order order) { /* ... */ }\n    public void ExecuteOrder(Order order) { /* ... */ }\n    public void LogOrder(Order order) { /* ... */ }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "One class does too much: validation, execution, and logging."
      },
      {
        "type": "text",
        "content": "Changing any of these reasons breaks others."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/S-Single-Responsibility-Principle-SRP.md",
    "isSection": true,
    "id": "card-547"
  },
  {
    "question": "✅ Good example:",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderValidator\n{\n    public bool Validate(Order order) => order.Amount > 0;\n}\n\npublic class OrderExecutor\n{\n    private readonly ITradeGateway _gateway;\n    public OrderExecutor(ITradeGateway gateway) => _gateway = gateway;\n\n    public void Execute(Order order)\n    {\n        _gateway.SendOrder(order);\n    }\n}\n\npublic class OrderLogger\n{\n    public void Log(Order order) => Console.WriteLine($\"Executed {order.Id}\");\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "👉 Each class does one thing — easier to test, maintain, and evolve."
      },
      {
        "type": "text",
        "content": "💡 In trading systems:"
      },
      {
        "type": "list",
        "items": [
          "Separate validation, risk checks, and execution.",
          "Each layer can evolve independently (e.g., compliance rules, broker APIs)."
        ]
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/S-Single-Responsibility-Principle-SRP.md",
    "isSection": true,
    "id": "card-548"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: When a class changes for multiple reasons—new logging needs, validation tweaks, and execution rules all touching the same file. High churn and wide unit tests are red flags."
      },
      {
        "type": "text",
        "content": "A: Focused classes let teams modify one area without risk to others, reducing merge conflicts and enabling independent deployments with fewer regression tests."
      },
      {
        "type": "text",
        "content": "A: Yes, if its sole reason is orchestration. For example, OrderProcessor can call validator, risk, and executor; its responsibility is orchestration, not validation logic itself."
      },
      {
        "type": "text",
        "content": "A: Group types by feature/use case, not by type (e.g., Orders/OrderValidator.cs). This keeps responsibilities cohesive and discoverable."
      },
      {
        "type": "text",
        "content": "A: Interfaces define focused contracts (IOrderValidator, IRiskService), ensuring implementations stay narrow and substitution-friendly."
      },
      {
        "type": "text",
        "content": "A: Extract class responsibilities incrementally, add unit tests, and use DI to wire new components. Feature toggles can help decouple releases."
      },
      {
        "type": "text",
        "content": "A: Absolutely. Services that mix API logic, data access, and scheduling also violate SRP; break them into modules or microservices with single purposes."
      },
      {
        "type": "text",
        "content": "A: Focused components emit targeted metrics/logs, making it easier to pinpoint issues (e.g., validation vs execution failures)."
      },
      {
        "type": "text",
        "content": "A: Static analysis for cyclomatic complexity, architecture tests (NetArchTest), and code reviews that demand clear reasons-to-change statements."
      },
      {
        "type": "text",
        "content": "A: Describe it as separating responsibilities like accounting vs trading—each workflow has its own owner, reducing risk when requirements change."
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/S-Single-Responsibility-Principle-SRP.md",
    "isSection": true,
    "id": "card-549"
  },
  {
    "question": "S — Single Responsibility Principle (SRP)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TradeManager\n{\n    public void ValidateOrder(Order order) { /* ... */ }\n    public void ExecuteOrder(Order order) { /* ... */ }\n    public void LogOrder(Order order) { /* ... */ }\n}",
        "codeType": "bad"
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/S-Single-Responsibility-Principle-SRP.md",
    "isConcept": true,
    "id": "card-550"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderValidator\n{\n    public bool Validate(Order order) => order.Amount > 0;\n}\n\npublic class OrderExecutor\n{\n    private readonly ITradeGateway _gateway;\n    public OrderExecutor(ITradeGateway gateway) => _gateway = gateway;\n\n    public void Execute(Order order)\n    {\n        _gateway.SendOrder(order);\n    }\n}\n\npublic class OrderLogger\n{\n    public void Log(Order order) => Console.WriteLine($\"Executed {order.Id}\");\n}",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "SOLID",
    "source": "notes/SOLID/S-Single-Responsibility-Principle-SRP.md",
    "isConcept": true,
    "id": "card-551"
  },
  {
    "question": "What happens under the hood when you mark a method async?",
    "answer": [
      {
        "type": "text",
        "content": "The compiler generates a struct implementing IAsyncStateMachine. Locals become fields, await points split into states, and continuations resume via MoveNext. Understanding this helps avoid capturing large objects or struct copies."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Async Await Deep Dive.md",
    "id": "card-552"
  },
  {
    "question": "Why does ConfigureAwait(false) matter in library code?",
    "answer": [
      {
        "type": "text",
        "content": "It prevents continuations from posting back to captured contexts (UI, legacy ASP.NET), reducing deadlock risk and unnecessary context switches. Libraries should default to false; apps decide when context capture is needed."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Async Await Deep Dive.md",
    "id": "card-553"
  },
  {
    "question": "How do you avoid deadlocks when mixing sync and async code?",
    "answer": [
      {
        "type": "text",
        "content": "Keep the entire call chain async, don’t block on .Result or .Wait(), and use ConfigureAwait(false) inside lower layers so continuations can resume on the thread pool."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Async Await Deep Dive.md",
    "id": "card-554"
  },
  {
    "question": "When should you use ValueTask?",
    "answer": [
      {
        "type": "text",
        "content": "When an async method often completes synchronously (e.g., cache hits) and you want to avoid allocating a Task. Only expose ValueTask sparingly; consumers must await it immediately or convert to Task."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Async Await Deep Dive.md",
    "id": "card-555"
  },
  {
    "question": "How do you coordinate exclusive access in async code?",
    "answer": [
      {
        "type": "text",
        "content": "Use SemaphoreSlim, AsyncLock, or channels. Never await inside a lock statement because it can deadlock; the compiler forbids it."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Async Await Deep Dive.md",
    "id": "card-556"
  },
  {
    "question": "How are exceptions handled in async methods?",
    "answer": [
      {
        "type": "text",
        "content": "They’re captured on the returned Task. Await to observe them; otherwise, they surface as unobserved task exceptions. For fire-and-forget, attach continuations or use hosted services to log failures."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Async Await Deep Dive.md",
    "id": "card-557"
  },
  {
    "question": "What’s the difference between I/O-bound and CPU-bound async work?",
    "answer": [
      {
        "type": "text",
        "content": "I/O-bound tasks release threads while waiting for external operations, improving scalability. CPU-bound work still needs threads; push it to Task.Run or dedicated workers to keep request threads free."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Async Await Deep Dive.md",
    "id": "card-558"
  },
  {
    "question": "How do you monitor asynchronous operations in production?",
    "answer": [
      {
        "type": "text",
        "content": "Use distributed tracing, EventSource/EventPipe, dotnet-trace, or Visual Studio’s Tasks view. Instrument awaited calls with activity IDs and correlate them to metrics/logs."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Async Await Deep Dive.md",
    "id": "card-559"
  },
  {
    "question": "How do you pass cancellation effectively?",
    "answer": [
      {
        "type": "text",
        "content": "Accept CancellationToken parameters, honor them in loops, and forward them to all awaited calls. Check ct.ThrowIfCancellationRequested() where appropriate to exit quickly."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Async Await Deep Dive.md",
    "id": "card-560"
  },
  {
    "question": "How can Task.WhenAll improve performance?",
    "answer": [
      {
        "type": "text",
        "content": "It allows parallel execution of independent async operations, awaiting once rather than sequentially. Always handle aggregated exceptions and consider throttling to avoid saturating dependencies."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Async Await Deep Dive.md",
    "id": "card-561"
  },
  {
    "question": "Compiler-Generated State Machine",
    "answer": [
      {
        "type": "list",
        "items": [
          "The compiler transforms every async method into a struct-based state machine implementing IAsyncStateMachine.",
          "Local variables become fields on the state machine; await points split the method into states that resume via MoveNext.",
          "Hot-path tip: keep locals small (e.g., avoid large structs) to limit the generated state machine size."
        ]
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public async Task<int> SumAsync(int a, int b)\n{\n    await Task.Yield();\n    return a + b;\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "> Decompile with ILSpy/dotnet-ildasm to show the generated MoveNext method when interviewing."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Async Await Deep Dive.md",
    "isSection": true,
    "id": "card-562"
  },
  {
    "question": "Synchronization Context Capture",
    "answer": [
      {
        "type": "list",
        "items": [
          "UI/WPF/WinForms & ASP.NET (pre-Core) capture a SynchronizationContext; continuations post back to the captured context.",
          "In ASP.NET Core/background services, the default context is the thread pool so no extra marshaling is needed.",
          "Call .ConfigureAwait(false) inside reusable libraries/background jobs to avoid deadlocks and reduce context switches."
        ]
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public async Task<string> DownloadAsync(HttpClient client, Uri uri)\n    => await (await client.GetAsync(uri).ConfigureAwait(false))\n        .Content.ReadAsStringAsync().ConfigureAwait(false);",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Async Await Deep Dive.md",
    "isSection": true,
    "id": "card-563"
  },
  {
    "question": "Deadlocks & Blocking Calls",
    "answer": [
      {
        "type": "list",
        "items": [
          "Blocking on Task.Result or .Wait() inside a context that disallows re-entrancy prevents the continuation from running.",
          "Fix deadlocks by keeping the call chain async all the way up or by using ConfigureAwait(false) in library code."
        ]
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// ❌ Deadlocks on UI thread\nvar content = client.GetStringAsync(url).Result;\n\n// ✅ Allow the message loop to process the continuation\nvar content = await client.GetStringAsync(url).ConfigureAwait(false);",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Async Await Deep Dive.md",
    "isSection": true,
    "id": "card-564"
  },
  {
    "question": "Exception Propagation",
    "answer": [
      {
        "type": "list",
        "items": [
          "Exceptions thrown inside an async method are captured and placed on the returned Task.",
          "Always await the task to observe the exception; otherwise you risk unobserved task exceptions.",
          "For fire-and-forget work, log via Task.Run(...).ContinueWith or use IHostedService/background queue patterns."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Async Await Deep Dive.md",
    "isSection": true,
    "id": "card-565"
  },
  {
    "question": "Locks & Async Coordination",
    "answer": [
      {
        "type": "list",
        "items": [
          "lock/Monitor stay synchronous—only use around code that never awaits.",
          "Reach for SemaphoreSlim, AsyncLock, or channels when coordinating asynchronous work."
        ]
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "private readonly SemaphoreSlim _mutex = new(1, 1);\n\npublic async Task UpdateAsync()\n{\n    await _mutex.WaitAsync();\n    try\n    {\n        await PersistAsync();\n    }\n    finally\n    {\n        _mutex.Release();\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Async Await Deep Dive.md",
    "isSection": true,
    "id": "card-566"
  },
  {
    "question": "I/O-Bound vs CPU-Bound",
    "answer": [
      {
        "type": "list",
        "items": [
          "await frees the thread to return to the pool while the I/O operation runs (HTTP, DB, queues).",
          "For CPU-bound workloads, offload to Task.Run or dedicated worker threads to avoid blocking the caller."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Async Await Deep Dive.md",
    "isSection": true,
    "id": "card-567"
  },
  {
    "question": "Performance Considerations",
    "answer": [
      {
        "type": "list",
        "items": [
          "Prefer ValueTask when the result often completes synchronously (e.g., cached data) to avoid allocating a Task.",
          "Avoid capturing the current context by default in library code—ConfigureAwait(false) becomes muscle memory.",
          "Use Task.WhenAll/Task.WhenAny to fan out concurrent operations without repeated awaits.",
          "Cancellation: Accept CancellationToken parameters and forward them to downstream async APIs."
        ]
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public async Task<Order> PlaceAsync(OrderRequest request, CancellationToken cancellationToken)\n{\n    using var activity = _activitySource.StartActivity(\"PlaceOrder\");\n\n    var quote = await _pricingClient.GetQuoteAsync(request.Symbol, cancellationToken)\n                                    .ConfigureAwait(false);\n\n    return await _orderGateway.ExecuteAsync(request with { Price = quote }, cancellationToken)\n                              .ConfigureAwait(false);\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Async Await Deep Dive.md",
    "isSection": true,
    "id": "card-568"
  },
  {
    "question": "Interview Quick Hits",
    "answer": [
      {
        "type": "list",
        "items": [
          "Explain how async improves scalability by releasing threads during I/O waits.",
          "Contrast Task, Task<T>, ValueTask<T>, and IAsyncEnumerable<T>.",
          "Mention tooling: dotnet-trace, EventPipe, and the Tasks view in Visual Studio for diagnosing hung awaits."
        ]
      },
      {
        "type": "text",
        "content": "Keep this page handy to answer deep-dive follow-ups confidently."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Async Await Deep Dive.md",
    "isSection": true,
    "id": "card-569"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: The compiler generates a struct implementing IAsyncStateMachine. Locals become fields, await points split into states, and continuations resume via MoveNext. Understanding this helps avoid capturing large objects or struct copies."
      },
      {
        "type": "text",
        "content": "A: It prevents continuations from posting back to captured contexts (UI, legacy ASP.NET), reducing deadlock risk and unnecessary context switches. Libraries should default to false; apps decide when context capture is needed."
      },
      {
        "type": "text",
        "content": "A: Keep the entire call chain async, don’t block on .Result or .Wait(), and use ConfigureAwait(false) inside lower layers so continuations can resume on the thread pool."
      },
      {
        "type": "text",
        "content": "A: When an async method often completes synchronously (e.g., cache hits) and you want to avoid allocating a Task. Only expose ValueTask sparingly; consumers must await it immediately or convert to Task."
      },
      {
        "type": "text",
        "content": "A: Use SemaphoreSlim, AsyncLock, or channels. Never await inside a lock statement because it can deadlock; the compiler forbids it."
      },
      {
        "type": "text",
        "content": "A: They’re captured on the returned Task. Await to observe them; otherwise, they surface as unobserved task exceptions. For fire-and-forget, attach continuations or use hosted services to log failures."
      },
      {
        "type": "text",
        "content": "A: I/O-bound tasks release threads while waiting for external operations, improving scalability. CPU-bound work still needs threads; push it to Task.Run or dedicated workers to keep request threads free."
      },
      {
        "type": "text",
        "content": "A: Use distributed tracing, EventSource/EventPipe, dotnet-trace, or Visual Studio’s Tasks view. Instrument awaited calls with activity IDs and correlate them to metrics/logs."
      },
      {
        "type": "text",
        "content": "A: Accept CancellationToken parameters, honor them in loops, and forward them to all awaited calls. Check ct.ThrowIfCancellationRequested() where appropriate to exit quickly."
      },
      {
        "type": "text",
        "content": "A: It allows parallel execution of independent async operations, awaiting once rather than sequentially. Always handle aggregated exceptions and consider throttling to avoid saturating dependencies."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Async Await Deep Dive.md",
    "isSection": true,
    "id": "card-570"
  },
  {
    "question": "What does base reference inside a derived class?",
    "answer": [
      {
        "type": "text",
        "content": "The immediate parent class—not grandparents. In a chain Animal → Mammal → Dog, base inside Dog refers to Mammal."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/base-keyword.md",
    "id": "card-571"
  },
  {
    "question": "When do you need to call a base constructor explicitly?",
    "answer": [
      {
        "type": "text",
        "content": "When the base class lacks a parameterless constructor or you must initialize base state with specific arguments. Use : base(args) in the derived constructor."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/base-keyword.md",
    "id": "card-572"
  },
  {
    "question": "How does base differ from this?",
    "answer": [
      {
        "type": "text",
        "content": "this refers to the current instance (including overridden members). base lets you access the base implementation, bypassing overrides in the derived class."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/base-keyword.md",
    "id": "card-573"
  },
  {
    "question": "Can you access private members via base?",
    "answer": [
      {
        "type": "text",
        "content": "No. base respects access modifiers. You can call protected/internal members exposed by the base class."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/base-keyword.md",
    "id": "card-574"
  },
  {
    "question": "When might you call base.Method() inside an override?",
    "answer": [
      {
        "type": "text",
        "content": "When you want to extend base behavior rather than replace it entirely—e.g., log additional data before or after invoking the base implementation."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/base-keyword.md",
    "id": "card-575"
  },
  {
    "question": "What happens if the base implementation throws?",
    "answer": [
      {
        "type": "text",
        "content": "Exceptions propagate like any method call; wrap base calls in try/catch only when you can handle failures meaningfully."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/base-keyword.md",
    "id": "card-576"
  },
  {
    "question": "Can interfaces have a base equivalent?",
    "answer": [
      {
        "type": "text",
        "content": "No. base only applies to classes/structs. Interfaces support default implementations in C# 8+, but you don’t call them via base."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/base-keyword.md",
    "id": "card-577"
  },
  {
    "question": "How do you reference the base indexer?",
    "answer": [
      {
        "type": "text",
        "content": "Within a derived class, you can call base[index] to use the parent’s indexer when overriding."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/base-keyword.md",
    "id": "card-578"
  },
  {
    "question": "What about virtual properties or events?",
    "answer": [
      {
        "type": "text",
        "content": "Use base.Property or base.Event to interact with the parent’s implementation when overriding getters/setters or event accessors."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/base-keyword.md",
    "id": "card-579"
  },
  {
    "question": "How does base behave in multiple inheritance?",
    "answer": [
      {
        "type": "text",
        "content": "C# classes don’t support multiple inheritance, so base is always unambiguous. With interfaces, you implement each separately; no base keyword exists for them."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/base-keyword.md",
    "id": "card-580"
  },
  {
    "question": "✅ What “immediate base class” refers to",
    "answer": [
      {
        "type": "text",
        "content": "If you have a class that inherits from another class, the class it inherits from is called its base class."
      },
      {
        "type": "text",
        "content": "Inside the derived class, the keyword base lets you access:"
      },
      {
        "type": "list",
        "items": [
          "The base class’s methods",
          "The base class’s properties",
          "The base class’s constructors",
          "The base class’s indexers"
        ]
      },
      {
        "type": "text",
        "content": "…even if they are hidden or overridden in the derived class."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/base-keyword.md",
    "isSection": true,
    "id": "card-581"
  },
  {
    "question": "📌 Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "class Animal\n{\n    public void MakeSound()\n    {\n        Console.WriteLine(\"Animal sound\");\n    }\n}\n\nclass Dog : Animal\n{\n    public void MakeSound()\n    {\n        Console.WriteLine(\"Dog sound\");\n    }\n\n    public void CallBaseSound()\n    {\n        base.MakeSound(); // calls Animal.MakeSound()\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Here:"
      },
      {
        "type": "list",
        "items": [
          "Animal is the base class.",
          "Dog is the derived class.",
          "Inside Dog, the keyword base refers specifically to Animal, which is the immediate parent."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/base-keyword.md",
    "isSection": true,
    "id": "card-582"
  },
  {
    "question": "📌 Why \"immediate\" base class?",
    "answer": [
      {
        "type": "text",
        "content": "If there is a long inheritance chain, like:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "Animal → Mammal → Dog",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Inside Dog, base always means Mammal, not Animal."
      },
      {
        "type": "text",
        "content": "So base refers only to the direct parent class."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/base-keyword.md",
    "isSection": true,
    "id": "card-583"
  },
  {
    "question": "✔ Summary",
    "answer": [
      {
        "type": "list",
        "items": [
          "base = direct parent class of the current class",
          "Used to access overridden or hidden members of the parent class",
          "Also used to call parent class constructors"
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/base-keyword.md",
    "isSection": true,
    "id": "card-584"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: The immediate parent class—not grandparents. In a chain Animal → Mammal → Dog, base inside Dog refers to Mammal."
      },
      {
        "type": "text",
        "content": "A: When the base class lacks a parameterless constructor or you must initialize base state with specific arguments. Use : base(args) in the derived constructor."
      },
      {
        "type": "text",
        "content": "A: this refers to the current instance (including overridden members). base lets you access the base implementation, bypassing overrides in the derived class."
      },
      {
        "type": "text",
        "content": "A: No. base respects access modifiers. You can call protected/internal members exposed by the base class."
      },
      {
        "type": "text",
        "content": "A: When you want to extend base behavior rather than replace it entirely—e.g., log additional data before or after invoking the base implementation."
      },
      {
        "type": "text",
        "content": "A: Exceptions propagate like any method call; wrap base calls in try/catch only when you can handle failures meaningfully."
      },
      {
        "type": "text",
        "content": "A: No. base only applies to classes/structs. Interfaces support default implementations in C# 8+, but you don’t call them via base."
      },
      {
        "type": "text",
        "content": "A: Within a derived class, you can call base[index] to use the parent’s indexer when overriding."
      },
      {
        "type": "text",
        "content": "A: Use base.Property or base.Event to interact with the parent’s implementation when overriding getters/setters or event accessors."
      },
      {
        "type": "text",
        "content": "A: C# classes don’t support multiple inheritance, so base is always unambiguous. With interfaces, you implement each separately; no base keyword exists for them."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/base-keyword.md",
    "isSection": true,
    "id": "card-585"
  },
  {
    "question": "How does this parser minimize allocations?",
    "answer": [
      {
        "type": "text",
        "content": "It uses ReadOnlySpan<byte> to slice the input buffer, Utf8Parser to parse primitives directly from bytes, and ArrayPool<byte> to reuse buffers, leaving only one small string allocation per tick."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC) Practical Example.md",
    "id": "card-586"
  },
  {
    "question": "Why is Utf8Parser preferred here?",
    "answer": [
      {
        "type": "text",
        "content": "It avoids converting byte segments into strings before parsing numbers, eliminating temporary allocations and respecting culture-invariant formats ideal for market data."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC) Practical Example.md",
    "id": "card-587"
  },
  {
    "question": "How do you process partial messages with this approach?",
    "answer": [
      {
        "type": "text",
        "content": "Maintain leftover spans between reads or use System.IO.Pipelines, which handles split frames by giving you ReadOnlySequence<byte> to process once a newline delimiter appears."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC) Practical Example.md",
    "id": "card-588"
  },
  {
    "question": "How would you adapt this for asynchronous sockets?",
    "answer": [
      {
        "type": "text",
        "content": "Swap buffer handling for PipeReader/PipeWriter, consume ReadOnlySequence<byte> segments, and use Memory<byte> to cross await boundaries safely while keeping parsing logic identical."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC) Practical Example.md",
    "id": "card-589"
  },
  {
    "question": "What GC metrics confirm success?",
    "answer": [
      {
        "type": "text",
        "content": "Gen0 GC Count stays low relative to throughput, Gen2 GC Count remains near zero, and Allocated Bytes/sec is minimal. Use dotnet-counters to observe these while the parser runs."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC) Practical Example.md",
    "id": "card-590"
  },
  {
    "question": "How do you reuse symbol strings to avoid per-message allocations?",
    "answer": [
      {
        "type": "text",
        "content": "Maintain a dictionary of interned symbols or use ReadOnlyMemory<byte> pointing to shared symbol tables, so repeated symbols reuse references instead of allocating new strings."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC) Practical Example.md",
    "id": "card-591"
  },
  {
    "question": "What happens if you allocate 100 KB buffers per message?",
    "answer": [
      {
        "type": "text",
        "content": "They land on the LOH, leading to fragmentation and long Gen2 pauses. Renting from ArrayPool<byte> avoids repeated LOH allocations."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC) Practical Example.md",
    "id": "card-592"
  },
  {
    "question": "How do you handle parsing failures?",
    "answer": [
      {
        "type": "text",
        "content": "Check the boolean return from Utf8Parser.TryParse and decide whether to drop/log the tick or route it to a poison queue. Avoid throwing in the hot path to keep allocation-free behavior."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC) Practical Example.md",
    "id": "card-593"
  },
  {
    "question": "Can you pool Tick instances too?",
    "answer": [
      {
        "type": "text",
        "content": "Yes—use ObjectPool<Tick> or a struct pool if you need to reuse containers. Ensure pooled objects are reset before reuse to avoid leaking data."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC) Practical Example.md",
    "id": "card-594"
  },
  {
    "question": "How would you extend this to publish to RabbitMQ/Kafka?",
    "answer": [
      {
        "type": "text",
        "content": "Serialize ticks using IBufferWriter<byte> or spans to keep serialization allocation-free, then push to the broker client that supports span-friendly APIs."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC) Practical Example.md",
    "id": "card-595"
  },
  {
    "question": "⚡ GOAL",
    "answer": [
      {
        "type": "text",
        "content": "Parse and process a stream of price tick data efficiently,"
      },
      {
        "type": "text",
        "content": "without allocating, without creating new strings, and with GC-friendly design."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC) Practical Example.md",
    "isSection": true,
    "id": "card-596"
  },
  {
    "question": "🧩 1. The scenario",
    "answer": [
      {
        "type": "text",
        "content": "You receive a TCP stream of bytes like this:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "EURUSD,1.07432,1.07436\nGBPUSD,1.24587,1.24592",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "You need to:"
      },
      {
        "type": "list",
        "items": [
          "Parse each line into fields (symbol, bid, ask)",
          "Convert to typed data (struct Tick)",
          "Reuse buffers instead of new allocations",
          "Avoid string allocations except for the final symbol if needed"
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC) Practical Example.md",
    "isSection": true,
    "id": "card-597"
  },
  {
    "question": "💻 2. The C# code",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "using System;\nusing System.Buffers;\nusing System.Buffers.Text;\nusing System.Text;\n\nstruct Tick\n{\n    public string Symbol { get; init; }\n    public double Bid { get; init; }\n    public double Ask { get; init; }\n}\n\nclass TickParser\n{\n    private readonly ArrayPool<byte> _pool = ArrayPool<byte>.Shared;\n\n    public Tick Parse(ReadOnlySpan<byte> line)\n    {\n        // EURUSD,1.07432,1.07436\n        int firstComma = line.IndexOf((byte)',');\n        int secondComma = line.Slice(firstComma + 1).IndexOf((byte)',') + firstComma + 1;\n\n        // symbol bytes -> string (only one allocation)\n        string symbol = Encoding.ASCII.GetString(line[..firstComma]);\n\n        // Parse Bid\n        Utf8Parser.TryParse(line[(firstComma + 1)..secondComma], out double bid, out _);\n\n        // Parse Ask\n        Utf8Parser.TryParse(line[(secondComma + 1)..], out double ask, out _);\n\n        return new Tick { Symbol = symbol, Bid = bid, Ask = ask };\n    }\n\n    public void ProcessBatch(byte[] data)\n    {\n        var span = new ReadOnlySpan<byte>(data);\n        while (true)\n        {\n            int newline = span.IndexOf((byte)'\\n');\n            if (newline == -1) break;\n            var line = span[..newline];\n            var tick = Parse(line);\n            // Do something: e.g., publish to queue\n            Console.WriteLine($\"{tick.Symbol}: {tick.Bid} / {tick.Ask}\");\n            span = span[(newline + 1)..];\n        }\n    }\n\n    public void Run()\n    {\n        byte[] buffer = _pool.Rent(1024);\n        try\n        {\n            string sample = \"EURUSD,1.07432,1.07436\\nGBPUSD,1.24587,1.24592\\n\";\n            int bytes = Encoding.ASCII.GetBytes(sample, buffer);\n            ProcessBatch(buffer.AsSpan(0, bytes).ToArray());\n        }\n        finally\n        {\n            _pool.Return(buffer);\n        }\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var parser = new TickParser();\n        parser.Run();\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC) Practical Example.md",
    "isSection": true,
    "id": "card-598"
  },
  {
    "question": "🧠 3. What to highlight in the interview",
    "answer": [
      {
        "type": "text",
        "content": "Memory-efficient design:"
      },
      {
        "type": "list",
        "items": [
          "Uses ReadOnlySpan<byte> to slice input lines → no string splits or temporary arrays.",
          "Utf8Parser parses directly from bytes into doubles → no string allocations.",
          "ArrayPool<byte> reuses buffers → avoids per-message allocation pressure on Gen0.",
          "Only one small string allocation per line (Symbol), which could also be interned or replaced by a dictionary of symbols in a real system."
        ]
      },
      {
        "type": "text",
        "content": "GC impact:"
      },
      {
        "type": "list",
        "items": [
          "Minimal Gen0 churn; no Gen1/Gen2 or LOH allocations.",
          "Perfect candidate for low-latency message processing (market data, trade events).",
          "If you wrap this in an async TCP stream, you’d use Memory<byte> instead of Span<byte> to cross await boundaries safely."
        ]
      },
      {
        "type": "text",
        "content": "Potential improvements to mention:"
      },
      {
        "type": "list",
        "items": [
          "Pool parsed Tick objects if needed (e.g., ObjectPool<Tick> or reuse structs).",
          "Replace symbol string allocation with a symbol lookup table.",
          "Integrate with System.IO.Pipelines for streaming input."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC) Practical Example.md",
    "isSection": true,
    "id": "card-599"
  },
  {
    "question": "🔍 4. Practice questions you can expect",
    "answer": [
      {
        "type": "list",
        "items": [
          "“Why is Span<T> faster than using Split or string.Substring()?” → Because it slices existing memory without allocating."
        ]
      },
      {
        "type": "list",
        "items": [
          "“Why use ArrayPool<byte> instead of new byte[]?” → It reuses buffers, drastically reducing GC pressure in high-throughput systems."
        ]
      },
      {
        "type": "list",
        "items": [
          "“Can you use Span<T> inside an async method?” → No, because Span<T> is stack-only. Use Memory<T> instead."
        ]
      },
      {
        "type": "list",
        "items": [
          "“What generation would this data typically live in?” → These short-lived spans die in Gen0, never get promoted — ideal for throughput."
        ]
      },
      {
        "type": "list",
        "items": [
          "“What happens if we allocate a 100 KB buffer?” → It goes on the Large Object Heap (LOH), which isn’t compacted by default and can fragment memory."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC) Practical Example.md",
    "isSection": true,
    "id": "card-600"
  },
  {
    "question": "🧩 5. Optional 5-min extension: Counter check",
    "answer": [
      {
        "type": "text",
        "content": "If you have .NET SDK, run:"
      },
      {
        "type": "code",
        "language": "bash",
        "code": "dotnet-counters monitor System.Runtime",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Then run your parser."
      },
      {
        "type": "text",
        "content": "Watch:"
      },
      {
        "type": "list",
        "items": [
          "Gen0 GC Count barely increases",
          "Gen2 GC Count stays at 0",
          "Allocated Bytes/sec minimal"
        ]
      },
      {
        "type": "text",
        "content": "That’s your evidence you’ve optimized allocations correctly."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC) Practical Example.md",
    "isSection": true,
    "id": "card-601"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: It uses ReadOnlySpan<byte> to slice the input buffer, Utf8Parser to parse primitives directly from bytes, and ArrayPool<byte> to reuse buffers, leaving only one small string allocation per tick."
      },
      {
        "type": "text",
        "content": "A: It avoids converting byte segments into strings before parsing numbers, eliminating temporary allocations and respecting culture-invariant formats ideal for market data."
      },
      {
        "type": "text",
        "content": "A: Maintain leftover spans between reads or use System.IO.Pipelines, which handles split frames by giving you ReadOnlySequence<byte> to process once a newline delimiter appears."
      },
      {
        "type": "text",
        "content": "A: Swap buffer handling for PipeReader/PipeWriter, consume ReadOnlySequence<byte> segments, and use Memory<byte> to cross await boundaries safely while keeping parsing logic identical."
      },
      {
        "type": "text",
        "content": "A: Gen0 GC Count stays low relative to throughput, Gen2 GC Count remains near zero, and Allocated Bytes/sec is minimal. Use dotnet-counters to observe these while the parser runs."
      },
      {
        "type": "text",
        "content": "A: Maintain a dictionary of interned symbols or use ReadOnlyMemory<byte> pointing to shared symbol tables, so repeated symbols reuse references instead of allocating new strings."
      },
      {
        "type": "text",
        "content": "A: They land on the LOH, leading to fragmentation and long Gen2 pauses. Renting from ArrayPool<byte> avoids repeated LOH allocations."
      },
      {
        "type": "text",
        "content": "A: Check the boolean return from Utf8Parser.TryParse and decide whether to drop/log the tick or route it to a poison queue. Avoid throwing in the hot path to keep allocation-free behavior."
      },
      {
        "type": "text",
        "content": "A: Yes—use ObjectPool<Tick> or a struct pool if you need to reuse containers. Ensure pooled objects are reset before reuse to avoid leaking data."
      },
      {
        "type": "text",
        "content": "A: Serialize ticks using IBufferWriter<byte> or spans to keep serialization allocation-free, then push to the broker client that supports span-friendly APIs."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC) Practical Example.md",
    "isSection": true,
    "id": "card-602"
  },
  {
    "question": "What are the primary heaps managed by the CLR GC?",
    "answer": [
      {
        "type": "text",
        "content": "The Small Object Heap (Gen0, Gen1, Gen2) for most allocations and the Large Object Heap (LOH) for objects ≥ ~85 KB. LOH skips Gen0/1 and isn’t compacted by default."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC).md",
    "id": "card-603"
  },
  {
    "question": "When would you enable Server GC vs Workstation GC?",
    "answer": [
      {
        "type": "text",
        "content": "Server GC is ideal for ASP.NET/services because it uses per-core GC threads and larger segments for throughput. Workstation GC suits desktop apps needing responsiveness."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC).md",
    "id": "card-604"
  },
  {
    "question": "How do you reduce Gen2 collections?",
    "answer": [
      {
        "type": "text",
        "content": "Lower allocation pressure (pool buffers, reuse objects), fix leaks, and avoid promoting long-lived caches unnecessarily. Monitor Gen 2 GC Count and LOH allocations."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC).md",
    "id": "card-605"
  },
  {
    "question": "What is NoGCRegion and when should you use it?",
    "answer": [
      {
        "type": "text",
        "content": "It temporarily disables GC by pre-reserving memory for critical sections (e.g., market open). Use sparingly; exceeding the reserved size or hitting LOH allocations ends it prematurely."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC).md",
    "id": "card-606"
  },
  {
    "question": "How do you minimize LOH fragmentation?",
    "answer": [
      {
        "type": "text",
        "content": "Avoid frequent large allocations, reuse arrays via ArrayPool<T>, and schedule GCLargeObjectHeapCompactionMode.CompactOnce only during maintenance windows."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC).md",
    "id": "card-607"
  },
  {
    "question": "Why is forcing GC.Collect() usually a bad idea?",
    "answer": [
      {
        "type": "text",
        "content": "It induces full, blocking collections that hurt throughput. Let the GC decide when to collect unless you’re in a very specific maintenance scenario."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC).md",
    "id": "card-608"
  },
  {
    "question": "How do spans/memory types impact GC?",
    "answer": [
      {
        "type": "text",
        "content": "Span<T>/Memory<T> enable zero-copy operations, reducing allocations that would otherwise add pressure on Gen0/1. They help keep critical paths GC-neutral."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC).md",
    "id": "card-609"
  },
  {
    "question": "Which diagnostics do you rely on to understand GC behavior?",
    "answer": [
      {
        "type": "text",
        "content": "dotnet-counters (Allocated Bytes/sec, % Time in GC), dotnet-trace, PerfView, and dotnet-gcdump to inspect heap composition and collection frequency."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC).md",
    "id": "card-610"
  },
  {
    "question": "How do you tune GC in containers?",
    "answer": [
      {
        "type": "text",
        "content": "Use container-aware defaults (.NET 6+), but override with DOTNET_GCHeapHardLimit or DOTNET_GCHeapHardLimitPercent for strict caps. Ensure CPU/memory limits align with GC thread counts."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC).md",
    "id": "card-611"
  },
  {
    "question": "How do latency modes affect runtime behavior?",
    "answer": [
      {
        "type": "text",
        "content": "Modes like SustainedLowLatency reduce Gen2 frequency at the cost of higher memory usage. Batch maximizes throughput but tolerates longer pauses. Choose based on workload requirements."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC).md",
    "id": "card-612"
  },
  {
    "question": "1) Heap layout & generations (what actually happens)",
    "answer": [
      {
        "type": "list",
        "items": [
          "Two main heaps:"
        ]
      },
      {
        "type": "list",
        "items": [
          "SOH (Small Object Heap): most objects. Split into Gen0, Gen1, Gen2.",
          "LOH (Large Object Heap): objects ≥ ~85,000 bytes (arrays/large strings). Allocating on LOH skips Gen0/Gen1.",
          "Promotion rule: survive a collection → promoted (Gen0 → Gen1 → Gen2). Long-lived objects end up in Gen2.",
          "Segments: The GC manages memory in segments (ephemeral segments hold Gen0/Gen1). Collections reclaim from the youngest gen that’s “full enough”.",
          "Compaction: SOH is compacted by default (reduces fragmentation). LOH is not compacted by default; it can fragment—there is an opt-in compaction knob (see tuning)."
        ]
      },
      {
        "type": "text",
        "content": "Mental model"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "Stack → short-lived refs\n         │\n         ▼\n Gen0 ──► Gen1 ──► Gen2        LOH (≥ ~85 KB)\n small     medium   long        massive arrays/strings\n (compacts) (compacts) (compacts)   (not by default)",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC).md",
    "isSection": true,
    "id": "card-613"
  },
  {
    "question": "2) GC flavors & latency modes (pick the right one)",
    "answer": [
      {
        "type": "list",
        "items": [
          "Server vs Workstation GC",
          "Server GC: one dedicated GC thread per core, larger segments, throughput-optimized. Best for ASP.NET Core / services.",
          "Workstation GC: aims for desktop responsiveness (WPF/WinForms/dev tools).",
          "Check via GCSettings.IsServerGC. In containers, .NET is container-aware; set env vars to tune (see §7).",
          "Concurrent/Background GC",
          "Background (Gen2) collections run concurrently with the app; Gen0/Gen1 are still stop-the-world but short.",
          "Latency modes (GCSettings.LatencyMode)",
          "Batch: max throughput, longer pauses OK (default on server GC during blocking GCs).",
          "Interactive: balanced (workstation default).",
          "SustainedLowLatency: fewer Gen2 collections; use around latency-sensitive windows.",
          "NoGCRegion: ask GC to avoid any collections while you do a critical operation—must pre-reserve memory (GC.TryStartNoGCRegion(...)). Fails if you allocate more than reserved or cause LOH pressure."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC).md",
    "isSection": true,
    "id": "card-614"
  },
  {
    "question": "3) Allocation discipline (the #1 lever you control)",
    "answer": [
      {
        "type": "list",
        "items": [
          "Avoid allocations in hot paths: every avoidable allocation is one less Gen0 pressure spike."
        ]
      },
      {
        "type": "list",
        "items": [
          "Reuse buffers (ArrayPool<T>, IMemoryOwner<T>), cache common arrays, and prefer StringBuilder for concatenation in loops.",
          "Be mindful with LINQ in tight loops (iterator/lambda allocations); favor hand-written loops where perf matters.",
          "Use struct for tiny, immutable value types that are frequently created; don’t make them huge (copy cost) or mutable (defensive copies).",
          "Prefer ValueTask over Task for sync-completing async methods to reduce allocations.",
          "Pinned objects (e.g., for interop) impede compaction; pin rarely and briefly (copy to a staging buffer if needed).",
          "Strings: avoid excessive substringing/slicing that creates new strings; parse with spans, or use ReadOnlyMemory<char>."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC).md",
    "isSection": true,
    "id": "card-615"
  },
  {
    "question": "4) Span<T> / Memory<T> (zero-alloc parsing & slicing)",
    "answer": [
      {
        "type": "list",
        "items": [
          "Span<T> is a ref struct that can point to stack, array, native, or unmanaged memory without allocating."
        ]
      },
      {
        "type": "list",
        "items": [
          "Great for protocol frame parsing, ASCII/UTF8 decoding, CSV/JSON tokenization, and binary manipulations.",
          "Zero allocations for slicing: span = span.Slice(offset, length).",
          "Restrictions: cannot be boxed, captured by closures, stored in fields of reference types, or used across await/iterator boundaries (stack-bound).",
          "ReadOnlySpan<T> for read-only views (e.g., over string via AsSpan()).",
          "Memory<T>/ReadOnlyMemory<T>: heap-safe counterpart you can store and pass across async boundaries. Use when you need to persist a view or await.",
          "Buffers & pools:"
        ]
      },
      {
        "type": "list",
        "items": [
          "Acquire with ArrayPool<T>.Shared.Rent(n) → get T[]; present it as Memory<T>/Span<T>; return it with Return.",
          "For pipelines or I/O heavy paths, consider System.IO.Pipelines which surfaces spans/memory natively."
        ]
      },
      {
        "type": "text",
        "content": "Interview tie-in (MT4/MT5 / market data):"
      },
      {
        "type": "text",
        "content": "Parsing tick/quote frames from sockets: read into a pooled buffer → slice using Span<byte> → parse fields with BinaryPrimitives/Utf8Parser → avoid intermediate strings → map to structs → publish."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC).md",
    "isSection": true,
    "id": "card-616"
  },
  {
    "question": "5) Finalization, disposal & handles (don’t leak)",
    "answer": [
      {
        "type": "list",
        "items": [
          "IDisposable pattern: free unmanaged resources deterministically (using/await using). Prefer SafeHandle over raw IntPtr in finalizers.",
          "Finalizers: expensive. Object enters F-reachable queue; requires at least one extra GC to clean. Keep finalizable objects minimal and lightweight.",
          "using is your friend—especially around sockets/streams where LOH buffers could be held inadvertently."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC).md",
    "isSection": true,
    "id": "card-617"
  },
  {
    "question": "6) Diagnostics (how you prove it)",
    "answer": [
      {
        "type": "list",
        "items": [
          "Counters: dotnet-counters monitor System.Runtime (GC Heap Size, Gen0/1/2 Count, % Time in GC).",
          "Traces: dotnet-trace, PerfView, Windows ETW, or dotnet-gcdump to analyze object graphs and hot types.",
          "AspNetCore: enable event source providers for request rates + GC to correlate pauses with traffic."
        ]
      },
      {
        "type": "text",
        "content": "A crisp story to tell:"
      },
      {
        "type": "text",
        "content": "> “We saw frequent Gen2s during peak quotes. Using counters we correlated high LOH allocations from JSON serialization. We switched to Utf8JsonReader + pooled buffers, cut LOH churn by 80%, Gen2 frequency dropped 5×, p95 latency improved from 120 ms to 35 ms.”"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC).md",
    "isSection": true,
    "id": "card-618"
  },
  {
    "question": "7) Tuning knobs (what to adjust when)",
    "answer": [
      {
        "type": "list",
        "items": [
          "Enable Server GC for services: env var DOTNET_GCServer=1 (usually default in ASP.NET Core).",
          "Heap limits in containers:"
        ]
      },
      {
        "type": "list",
        "items": [
          "DOTNET_GCHeapHardLimit / DOTNET_GCHeapHardLimitPercent to cap; or rely on container-aware defaults (Core 3.0+).",
          "LOH compaction: GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce; GC.Collect(GC.MaxGeneration, GCCollectionMode.Forced); Use sparingly during maintenance windows; it’s a blocking full GC.",
          "Latency windows:"
        ]
      },
      {
        "type": "list",
        "items": [
          "Before a critical burst (e.g., market open): GC.TryStartNoGCRegion(...) with enough headroom; GC.EndNoGCRegion() after.",
          "Or SustainedLowLatency around time-sensitive processing (expect more memory use)."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC).md",
    "isSection": true,
    "id": "card-619"
  },
  {
    "question": "8) Async & threading interactions (common pitfalls)",
    "answer": [
      {
        "type": "list",
        "items": [
          "Async hot paths allocate continuations; use ValueTask when appropriate, and avoid async if the path completes synchronously.",
          "Thread safety vs allocations: prefer ConcurrentDictionary sparingly; in very hot paths use sharded locks or lock-free patterns.",
          "Backpressure: when deserializing streams at line-rate, use pipelines to avoid intermediate buffers and enforce backpressure."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC).md",
    "isSection": true,
    "id": "card-620"
  },
  {
    "question": "9) Quick do/don’t checklist (interview-ready)",
    "answer": [
      {
        "type": "text",
        "content": "Do"
      },
      {
        "type": "list",
        "items": [
          "Pool large arrays and reuse buffers.",
          "Parse with Span<T>/Utf8JsonReader instead of allocating substrings/JObject.",
          "Measure with counters/traces before changing GC settings.",
          "Prefer Server GC for services; confirm in prod."
        ]
      },
      {
        "type": "text",
        "content": "Don’t"
      },
      {
        "type": "list",
        "items": [
          "Pin big objects for long (crushes compaction).",
          "Sprinkle LINQ/closures in micro-paths.",
          "Force GC.Collect() routinely (it hurts overall throughput).",
          "Leave finalizers doing heavy work."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC).md",
    "isSection": true,
    "id": "card-621"
  },
  {
    "question": "One-minute “explain it like a senior” answer",
    "answer": [
      {
        "type": "text",
        "content": "> “.NET uses a generational GC: most objects die young in Gen0/Gen1, long-lived objects are promoted to Gen2; very large allocations go to the LOH, which isn’t compacted by default. For services we run Server GC to maximize throughput with background Gen2 collections. We keep allocation pressure low in hot paths—pool buffers, use Span<T> for zero-alloc parsing, and use Memory<T> across async boundaries. We monitor GC counters to spot excessive Gen2/LOH activity. If fragmentation creeps into LOH we schedule a one-off compaction. We only tweak latency modes for short, critical windows and never force collections in steady state.”"
      },
      {
        "type": "text",
        "content": "If you want, I can give you a 10-minute hands-on drill: a tiny price-tick parser using Span<byte>, ArrayPool<byte>, and counters you can discuss live."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC).md",
    "isSection": true,
    "id": "card-622"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: The Small Object Heap (Gen0, Gen1, Gen2) for most allocations and the Large Object Heap (LOH) for objects ≥ ~85 KB. LOH skips Gen0/1 and isn’t compacted by default."
      },
      {
        "type": "text",
        "content": "A: Server GC is ideal for ASP.NET/services because it uses per-core GC threads and larger segments for throughput. Workstation GC suits desktop apps needing responsiveness."
      },
      {
        "type": "text",
        "content": "A: Lower allocation pressure (pool buffers, reuse objects), fix leaks, and avoid promoting long-lived caches unnecessarily. Monitor Gen 2 GC Count and LOH allocations."
      },
      {
        "type": "text",
        "content": "A: It temporarily disables GC by pre-reserving memory for critical sections (e.g., market open). Use sparingly; exceeding the reserved size or hitting LOH allocations ends it prematurely."
      },
      {
        "type": "text",
        "content": "A: Avoid frequent large allocations, reuse arrays via ArrayPool<T>, and schedule GCLargeObjectHeapCompactionMode.CompactOnce only during maintenance windows."
      },
      {
        "type": "text",
        "content": "A: It induces full, blocking collections that hurt throughput. Let the GC decide when to collect unless you’re in a very specific maintenance scenario."
      },
      {
        "type": "text",
        "content": "A: Span<T>/Memory<T> enable zero-copy operations, reducing allocations that would otherwise add pressure on Gen0/1. They help keep critical paths GC-neutral."
      },
      {
        "type": "text",
        "content": "A: dotnet-counters (Allocated Bytes/sec, % Time in GC), dotnet-trace, PerfView, and dotnet-gcdump to inspect heap composition and collection frequency."
      },
      {
        "type": "text",
        "content": "A: Use container-aware defaults (.NET 6+), but override with DOTNET_GCHeapHardLimit or DOTNET_GCHeapHardLimitPercent for strict caps. Ensure CPU/memory limits align with GC thread counts."
      },
      {
        "type": "text",
        "content": "A: Modes like SustainedLowLatency reduce Gen2 frequency at the cost of higher memory usage. Batch maximizes throughput but tolerates longer pauses. Choose based on workload requirements."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/CLR & Garbage Collector (GC).md",
    "isSection": true,
    "id": "card-623"
  },
  {
    "question": "When do you choose transient over scoped?",
    "answer": [
      {
        "type": "text",
        "content": "Use transient for stateless, lightweight services or short-lived operations (formatters, handlers). Use scoped when the service holds per-request state or depends on scoped services like DbContext."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Dependency Injection Lifetimes.md",
    "id": "card-624"
  },
  {
    "question": "Why does capturing a scoped service in a singleton cause issues?",
    "answer": [
      {
        "type": "text",
        "content": "The singleton outlives the request scope, so it holds onto disposed or cross-request state, leading to race conditions, memory leaks, or ObjectDisposedException."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Dependency Injection Lifetimes.md",
    "id": "card-625"
  },
  {
    "question": "How do you use scoped services from a singleton safely?",
    "answer": [
      {
        "type": "text",
        "content": "Inject IServiceScopeFactory, create a scope when needed, resolve the scoped service inside it, and dispose the scope afterward."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Dependency Injection Lifetimes.md",
    "id": "card-626"
  },
  {
    "question": "What lifetime should HttpClient instances have?",
    "answer": [
      {
        "type": "text",
        "content": "Use IHttpClientFactory (singleton-managed) to create clients per use, which internally pools handlers and avoids socket exhaustion."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Dependency Injection Lifetimes.md",
    "id": "card-627"
  },
  {
    "question": "Can singletons depend on transients?",
    "answer": [
      {
        "type": "text",
        "content": "Yes, but the transient effectively becomes a singleton because the DI container creates it once for the singleton. Prefer injecting interfaces with the right lifetime semantics."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Dependency Injection Lifetimes.md",
    "id": "card-628"
  },
  {
    "question": "How do lifetimes work in background services?",
    "answer": [
      {
        "type": "text",
        "content": "Hosted services run outside HTTP scopes. If they need scoped services, create scopes manually per iteration to avoid cross-thread leaks."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Dependency Injection Lifetimes.md",
    "id": "card-629"
  },
  {
    "question": "How do you test scoped services without ASP.NET hosting?",
    "answer": [
      {
        "type": "text",
        "content": "Create a ServiceScope via the provider in tests, resolve scoped services, and dispose the scope when done. This mimics per-request behavior."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Dependency Injection Lifetimes.md",
    "id": "card-630"
  },
  {
    "question": "What happens if you register DbContext as singleton?",
    "answer": [
      {
        "type": "text",
        "content": "It becomes shared across requests, causing threading issues, stale state, and memory leaks. EF contexts must be scoped or transient."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Dependency Injection Lifetimes.md",
    "id": "card-631"
  },
  {
    "question": "How do you ensure deterministic disposal for transients?",
    "answer": [
      {
        "type": "text",
        "content": "The container disposes transients when the scope disposing them ends. If they hold unmanaged resources, ensure they are resolved and disposed within a scope."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Dependency Injection Lifetimes.md",
    "id": "card-632"
  },
  {
    "question": "What about custom lifetimes?",
    "answer": [
      {
        "type": "text",
        "content": "You can implement IServiceScopeFactory or use keyed services, but keep the mental model simple—most cases are solved with transient/scoped/singleton."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Dependency Injection Lifetimes.md",
    "id": "card-633"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: Use transient for stateless, lightweight services or short-lived operations (formatters, handlers). Use scoped when the service holds per-request state or depends on scoped services like DbContext."
      },
      {
        "type": "text",
        "content": "A: The singleton outlives the request scope, so it holds onto disposed or cross-request state, leading to race conditions, memory leaks, or ObjectDisposedException."
      },
      {
        "type": "text",
        "content": "A: Inject IServiceScopeFactory, create a scope when needed, resolve the scoped service inside it, and dispose the scope afterward."
      },
      {
        "type": "text",
        "content": "A: Use IHttpClientFactory (singleton-managed) to create clients per use, which internally pools handlers and avoids socket exhaustion."
      },
      {
        "type": "text",
        "content": "A: Yes, but the transient effectively becomes a singleton because the DI container creates it once for the singleton. Prefer injecting interfaces with the right lifetime semantics."
      },
      {
        "type": "text",
        "content": "A: Hosted services run outside HTTP scopes. If they need scoped services, create scopes manually per iteration to avoid cross-thread leaks."
      },
      {
        "type": "text",
        "content": "A: Create a ServiceScope via the provider in tests, resolve scoped services, and dispose the scope when done. This mimics per-request behavior."
      },
      {
        "type": "text",
        "content": "A: It becomes shared across requests, causing threading issues, stale state, and memory leaks. EF contexts must be scoped or transient."
      },
      {
        "type": "text",
        "content": "A: The container disposes transients when the scope disposing them ends. If they hold unmanaged resources, ensure they are resolved and disposed within a scope."
      },
      {
        "type": "text",
        "content": "A: You can implement IServiceScopeFactory or use keyed services, but keep the mental model simple—most cases are solved with transient/scoped/singleton."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Dependency Injection Lifetimes.md",
    "isSection": true,
    "id": "card-634"
  },
  {
    "question": "When should you use Queue<T> vs ConcurrentQueue<T>?",
    "answer": [
      {
        "type": "text",
        "content": "Use Queue<T> for single-threaded scenarios. Use ConcurrentQueue<T> when multiple threads enqueue/dequeue concurrently, but note it lacks blocking reads."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/FIFO Queues in .NET.md",
    "id": "card-635"
  },
  {
    "question": "Why choose Channel<T> over BlockingCollection<T>?",
    "answer": [
      {
        "type": "text",
        "content": "Channel<T> supports async producers/consumers, backpressure, and high performance without legacy BlockingCollection overhead. It integrates well with async/await."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/FIFO Queues in .NET.md",
    "id": "card-636"
  },
  {
    "question": "How do you implement backpressure with FIFO queues?",
    "answer": [
      {
        "type": "text",
        "content": "Use bounded Channel<T> so producers await when the queue is full, preventing memory blowups and throttling upstream systems."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/FIFO Queues in .NET.md",
    "id": "card-637"
  },
  {
    "question": "How do you ensure ordering when scaling consumers?",
    "answer": [
      {
        "type": "text",
        "content": "Single consumer preserves strict FIFO. If you scale out, partition by key (e.g., account ID) so each partition maintains order, or accept eventual ordering per partition only."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/FIFO Queues in .NET.md",
    "id": "card-638"
  },
  {
    "question": "How do you persist FIFO semantics across process restarts?",
    "answer": [
      {
        "type": "text",
        "content": "Use durable queues (RabbitMQ, Azure Service Bus) with FIFO support, or persist queue state in a database/outbox to resume processing after failure."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/FIFO Queues in .NET.md",
    "id": "card-639"
  },
  {
    "question": "What’s the cost of peeking?",
    "answer": [
      {
        "type": "text",
        "content": "Queue<T>.Peek() is O(1) and non-destructive. For channels, peeking isn’t supported; you’d need to buffer manually if you must inspect before processing."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/FIFO Queues in .NET.md",
    "id": "card-640"
  },
  {
    "question": "How do you avoid busy-wait loops with Queue<T>?",
    "answer": [
      {
        "type": "text",
        "content": "Use synchronization primitives (SemaphoreSlim, AutoResetEvent) or switch to Channel<T>/BlockingCollection<T> which provide blocking/async waits."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/FIFO Queues in .NET.md",
    "id": "card-641"
  },
  {
    "question": "How do FIFO queues interact with metrics?",
    "answer": [
      {
        "type": "text",
        "content": "Track enqueue/dequeue rates, queue length, and processing latency. Alert when queue length grows unexpectedly—indicates downstream slowness."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/FIFO Queues in .NET.md",
    "id": "card-642"
  },
  {
    "question": "How do you handle poison messages?",
    "answer": [
      {
        "type": "text",
        "content": "Implement retries with exponential backoff, move failures to a dead-letter queue, and avoid blocking the FIFO by skipping or quarantining bad entries."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/FIFO Queues in .NET.md",
    "id": "card-643"
  },
  {
    "question": "How do you throttle producers?",
    "answer": [
      {
        "type": "text",
        "content": "Combine bounded channels with SemaphoreSlim or token buckets. Producers await when the channel is full, smoothing load on downstream services."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/FIFO Queues in .NET.md",
    "id": "card-644"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: Use Queue<T> for single-threaded scenarios. Use ConcurrentQueue<T> when multiple threads enqueue/dequeue concurrently, but note it lacks blocking reads."
      },
      {
        "type": "text",
        "content": "A: Channel<T> supports async producers/consumers, backpressure, and high performance without legacy BlockingCollection overhead. It integrates well with async/await."
      },
      {
        "type": "text",
        "content": "A: Use bounded Channel<T> so producers await when the queue is full, preventing memory blowups and throttling upstream systems."
      },
      {
        "type": "text",
        "content": "A: Single consumer preserves strict FIFO. If you scale out, partition by key (e.g., account ID) so each partition maintains order, or accept eventual ordering per partition only."
      },
      {
        "type": "text",
        "content": "A: Use durable queues (RabbitMQ, Azure Service Bus) with FIFO support, or persist queue state in a database/outbox to resume processing after failure."
      },
      {
        "type": "text",
        "content": "A: Queue<T>.Peek() is O(1) and non-destructive. For channels, peeking isn’t supported; you’d need to buffer manually if you must inspect before processing."
      },
      {
        "type": "text",
        "content": "A: Use synchronization primitives (SemaphoreSlim, AutoResetEvent) or switch to Channel<T>/BlockingCollection<T> which provide blocking/async waits."
      },
      {
        "type": "text",
        "content": "A: Track enqueue/dequeue rates, queue length, and processing latency. Alert when queue length grows unexpectedly—indicates downstream slowness."
      },
      {
        "type": "text",
        "content": "A: Implement retries with exponential backoff, move failures to a dead-letter queue, and avoid blocking the FIFO by skipping or quarantining bad entries."
      },
      {
        "type": "text",
        "content": "A: Combine bounded channels with SemaphoreSlim or token buckets. Producers await when the channel is full, smoothing load on downstream services."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/FIFO Queues in .NET.md",
    "isSection": true,
    "id": "card-645"
  },
  {
    "question": "When is it acceptable to call GC.Collect()?",
    "answer": [
      {
        "type": "text",
        "content": "During benchmarking (to start from a clean slate) or tooling scenarios (e.g., before capturing a memory snapshot). Avoid in normal application flow."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Forcing Garbage Collection.md",
    "id": "card-646"
  },
  {
    "question": "What’s the impact of forcing a full GC in production?",
    "answer": [
      {
        "type": "text",
        "content": "It pauses all managed threads, potentially causing latency spikes and throughput loss, negating the GC’s heuristics."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Forcing Garbage Collection.md",
    "id": "card-647"
  },
  {
    "question": "How do you compact the LOH manually?",
    "answer": [
      {
        "type": "text",
        "content": "Set GCSettings.LargeObjectHeapCompactionMode = CompactOnce, call GC.Collect() with compacting enabled, typically during maintenance windows."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Forcing Garbage Collection.md",
    "id": "card-648"
  },
  {
    "question": "Why call GC.WaitForPendingFinalizers() between collections?",
    "answer": [
      {
        "type": "text",
        "content": "To ensure finalizers from the first collection run before initiating another GC pass, guaranteeing cleanup of finalizable objects."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Forcing Garbage Collection.md",
    "id": "card-649"
  },
  {
    "question": "How do you trigger GC in benchmarks without skewing results?",
    "answer": [
      {
        "type": "text",
        "content": "Force GC during setup/cleanup phases, not inside the measured benchmark method, so the measurement represents steady-state behavior."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Forcing Garbage Collection.md",
    "id": "card-650"
  },
  {
    "question": "Can GC.Collect() free native resources?",
    "answer": [
      {
        "type": "text",
        "content": "Only indirectly—finalizers may release native handles. For deterministic cleanup, implement IDisposable instead of relying on GC."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Forcing Garbage Collection.md",
    "id": "card-651"
  },
  {
    "question": "How do you monitor if someone accidentally added GC.Collect() in production?",
    "answer": [
      {
        "type": "text",
        "content": "Use ETW/EventPipe or dotnet-trace to capture GC start reasons. Forced GCs show up with reason Induced."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Forcing Garbage Collection.md",
    "id": "card-652"
  },
  {
    "question": "What alternatives exist for managing memory spikes?",
    "answer": [
      {
        "type": "text",
        "content": "Reduce allocation rates, pool objects, and fix leaks rather than forcing collections. Use GC.TryStartNoGCRegion for temporary low-latency windows instead."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Forcing Garbage Collection.md",
    "id": "card-653"
  },
  {
    "question": "How does forcing GC affect NoGCRegion?",
    "answer": [
      {
        "type": "text",
        "content": "Calling GC.Collect() invalidates NoGCRegion. Instead, exit the region properly or avoid entering it if you plan to induce GC."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Forcing Garbage Collection.md",
    "id": "card-654"
  },
  {
    "question": "Can you request Gen0-only collections?",
    "answer": [
      {
        "type": "text",
        "content": "Yes via GC.Collect(0), but even that incurs overhead. Rely on GC heuristics unless you have a proven diagnostic need."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Forcing Garbage Collection.md",
    "id": "card-655"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: During benchmarking (to start from a clean slate) or tooling scenarios (e.g., before capturing a memory snapshot). Avoid in normal application flow."
      },
      {
        "type": "text",
        "content": "A: It pauses all managed threads, potentially causing latency spikes and throughput loss, negating the GC’s heuristics."
      },
      {
        "type": "text",
        "content": "A: Set GCSettings.LargeObjectHeapCompactionMode = CompactOnce, call GC.Collect() with compacting enabled, typically during maintenance windows."
      },
      {
        "type": "text",
        "content": "A: To ensure finalizers from the first collection run before initiating another GC pass, guaranteeing cleanup of finalizable objects."
      },
      {
        "type": "text",
        "content": "A: Force GC during setup/cleanup phases, not inside the measured benchmark method, so the measurement represents steady-state behavior."
      },
      {
        "type": "text",
        "content": "A: Only indirectly—finalizers may release native handles. For deterministic cleanup, implement IDisposable instead of relying on GC."
      },
      {
        "type": "text",
        "content": "A: Use ETW/EventPipe or dotnet-trace to capture GC start reasons. Forced GCs show up with reason Induced."
      },
      {
        "type": "text",
        "content": "A: Reduce allocation rates, pool objects, and fix leaks rather than forcing collections. Use GC.TryStartNoGCRegion for temporary low-latency windows instead."
      },
      {
        "type": "text",
        "content": "A: Calling GC.Collect() invalidates NoGCRegion. Instead, exit the region properly or avoid entering it if you plan to induce GC."
      },
      {
        "type": "text",
        "content": "A: Yes via GC.Collect(0), but even that incurs overhead. Rely on GC heuristics unless you have a proven diagnostic need."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Forcing Garbage Collection.md",
    "isSection": true,
    "id": "card-656"
  },
  {
    "question": "When should a class implement IDisposable?",
    "answer": [
      {
        "type": "text",
        "content": "When it owns unmanaged resources or wraps objects that implement IDisposable (streams, DbContexts, timers) and must release them deterministically."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/IDisposable Patterns.md",
    "id": "card-657"
  },
  {
    "question": "Why call GC.SuppressFinalize(this)?",
    "answer": [
      {
        "type": "text",
        "content": "It prevents the GC from invoking the finalizer once you’ve disposed the object, saving an extra GC cycle and improving performance."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/IDisposable Patterns.md",
    "id": "card-658"
  },
  {
    "question": "How do you dispose async resources?",
    "answer": [
      {
        "type": "text",
        "content": "Implement IAsyncDisposable and use await using to asynchronously release resources like pooled connections or streams."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/IDisposable Patterns.md",
    "id": "card-659"
  },
  {
    "question": "What happens if you forget to dispose?",
    "answer": [
      {
        "type": "text",
        "content": "Resources leak—sockets stay open, file handles remain locked, and finalizers eventually run, adding GC pressure. In services, this can lead to outages."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/IDisposable Patterns.md",
    "id": "card-660"
  },
  {
    "question": "How do you handle multiple disposals safely?",
    "answer": [
      {
        "type": "text",
        "content": "Guard with an _disposed flag, throw ObjectDisposedException when methods run after disposal, and make Dispose idempotent."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/IDisposable Patterns.md",
    "id": "card-661"
  },
  {
    "question": "When do you need a finalizer?",
    "answer": [
      {
        "type": "text",
        "content": "Rarely—only when you wrap unmanaged resources without safe handles. Prefer SafeHandle + IDisposable instead of writing finalizers yourself."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/IDisposable Patterns.md",
    "id": "card-662"
  },
  {
    "question": "How do you dispose child services resolved from DI scopes?",
    "answer": [
      {
        "type": "text",
        "content": "The scope disposes services when it ends. Don’t capture scoped services beyond scope lifetime; create scopes per operation if needed."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/IDisposable Patterns.md",
    "id": "card-663"
  },
  {
    "question": "How do you unit test disposal behavior?",
    "answer": [
      {
        "type": "text",
        "content": "Use Mock<IDisposable> to verify Dispose is called, or check resource state (e.g., timer disposed). For async disposal, assert tasks complete and resources release handles."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/IDisposable Patterns.md",
    "id": "card-664"
  },
  {
    "question": "What’s the difference between DisposeAsync and Dispose?",
    "answer": [
      {
        "type": "text",
        "content": "DisposeAsync returns a ValueTask and awaits asynchronous cleanup. Dispose runs synchronously. Implement both when supporting async resource release but ensure Dispose calls DisposeAsync().GetAwaiter().GetResult() if needed."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/IDisposable Patterns.md",
    "id": "card-665"
  },
  {
    "question": "How does using translate in IL?",
    "answer": [
      {
        "type": "text",
        "content": "It compiles to a try/finally block where Dispose is invoked in the finally clause, guaranteeing cleanup even if exceptions occur."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/IDisposable Patterns.md",
    "id": "card-666"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: When it owns unmanaged resources or wraps objects that implement IDisposable (streams, DbContexts, timers) and must release them deterministically."
      },
      {
        "type": "text",
        "content": "A: It prevents the GC from invoking the finalizer once you’ve disposed the object, saving an extra GC cycle and improving performance."
      },
      {
        "type": "text",
        "content": "A: Implement IAsyncDisposable and use await using to asynchronously release resources like pooled connections or streams."
      },
      {
        "type": "text",
        "content": "A: Resources leak—sockets stay open, file handles remain locked, and finalizers eventually run, adding GC pressure. In services, this can lead to outages."
      },
      {
        "type": "text",
        "content": "A: Guard with an _disposed flag, throw ObjectDisposedException when methods run after disposal, and make Dispose idempotent."
      },
      {
        "type": "text",
        "content": "A: Rarely—only when you wrap unmanaged resources without safe handles. Prefer SafeHandle + IDisposable instead of writing finalizers yourself."
      },
      {
        "type": "text",
        "content": "A: The scope disposes services when it ends. Don’t capture scoped services beyond scope lifetime; create scopes per operation if needed."
      },
      {
        "type": "text",
        "content": "A: Use Mock<IDisposable> to verify Dispose is called, or check resource state (e.g., timer disposed). For async disposal, assert tasks complete and resources release handles."
      },
      {
        "type": "text",
        "content": "A: DisposeAsync returns a ValueTask and awaits asynchronous cleanup. Dispose runs synchronously. Implement both when supporting async resource release but ensure Dispose calls DisposeAsync().GetAwaiter().GetResult() if needed."
      },
      {
        "type": "text",
        "content": "A: It compiles to a try/finally block where Dispose is invoked in the finally clause, guaranteeing cleanup even if exceptions occur."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/IDisposable Patterns.md",
    "isSection": true,
    "id": "card-667"
  },
  {
    "question": "Why prefer nameof over hard-coded strings?",
    "answer": [
      {
        "type": "text",
        "content": "It’s refactor-safe. Renaming a symbol updates nameof usage automatically; string literals would silently become stale."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/nameof-keyword.md",
    "id": "card-668"
  },
  {
    "question": "Is nameof evaluated at runtime?",
    "answer": [
      {
        "type": "text",
        "content": "No, it’s compile-time. The compiler replaces nameof(Symbol) with a string literal, so there’s zero runtime cost."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/nameof-keyword.md",
    "id": "card-669"
  },
  {
    "question": "Can nameof handle fully qualified names?",
    "answer": [
      {
        "type": "text",
        "content": "You can pass Namespace.Type.Member, but it returns only the last identifier (e.g., Member). Use typeof(Type).FullName if you need the full name."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/nameof-keyword.md",
    "id": "card-670"
  },
  {
    "question": "How does nameof help with exceptions?",
    "answer": [
      {
        "type": "text",
        "content": "Use it in ArgumentNullException(nameof(param)) so parameter names stay accurate even after refactors."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/nameof-keyword.md",
    "id": "card-671"
  },
  {
    "question": "Can you use nameof with generics?",
    "answer": [
      {
        "type": "text",
        "content": "Yes, but it returns the unqualified type name (e.g., nameof(Dictionary<int,string>) yields \"Dictionary\"). It doesn’t include type arguments."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/nameof-keyword.md",
    "id": "card-672"
  },
  {
    "question": "Does nameof support aliases?",
    "answer": [
      {
        "type": "text",
        "content": "Yes—it respects using alias = ...;. nameof(alias) returns the alias name, not the underlying type."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/nameof-keyword.md",
    "id": "card-673"
  },
  {
    "question": "Can nameof reference private members?",
    "answer": [
      {
        "type": "text",
        "content": "Absolutely. It works with any accessible symbol at compile time, including locals, parameters, and private members."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/nameof-keyword.md",
    "id": "card-674"
  },
  {
    "question": "How does nameof interact with CallerMemberName?",
    "answer": [
      {
        "type": "text",
        "content": "CallerMemberName auto-fills the calling member name. Use nameof when referencing other members explicitly, and CallerMemberName when you want the current member at call site."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/nameof-keyword.md",
    "id": "card-675"
  },
  {
    "question": "Can nameof reference methods?",
    "answer": [
      {
        "type": "text",
        "content": "Yes—nameof(MyMethod) returns \"MyMethod\", regardless of overloads. It doesn’t encode signatures."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/nameof-keyword.md",
    "id": "card-676"
  },
  {
    "question": "How do you ensure localization isn’t impacted?",
    "answer": [
      {
        "type": "text",
        "content": "nameof is for developer-oriented strings (logging, diagnostics), not user-visible text. Keep localized strings separate from nameof usage."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/nameof-keyword.md",
    "id": "card-677"
  },
  {
    "question": "✅ Why use nameof instead of string literals",
    "answer": [
      {
        "type": "list",
        "items": [
          "Refactor-safe: nameof(SomeProperty) is updated by refactoring tools (or will fail to compile if renamed), while \"SomeProperty\" can become stale and lead to bugs.",
          "Compile-time checked: If the symbol doesn't exist, code using nameof will not compile.",
          "Clear intent: It expresses that the string is a program symbol name (not arbitrary text)."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/nameof-keyword.md",
    "isSection": true,
    "id": "card-678"
  },
  {
    "question": "📌 Basic examples",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class Order\n{\n    public int Id { get; set; }\n}\n\n// get property name\nvar prop = nameof(Order.Id); // \"Id\"\n\nstring local = \"value\";\nvar name = nameof(local); // \"local\"\n\n// type name\nvar typeName = nameof(Dictionary<int, string>); // \"Dictionary\"",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Note: nameof returns only the identifier portion — for generic types it returns the unqualified generic type name (not type arguments)."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/nameof-keyword.md",
    "isSection": true,
    "id": "card-679"
  },
  {
    "question": "Common usages",
    "answer": [
      {
        "type": "list",
        "items": [
          "Argument validation and exceptions:"
        ]
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public void SetPrice(decimal price)\n{\n    if (price <= 0) throw new ArgumentOutOfRangeException(nameof(price), \"Price must be positive\");\n}",
        "codeType": "neutral"
      },
      {
        "type": "list",
        "items": [
          "INotifyPropertyChanged implementations:"
        ]
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "private void Notify(string property) => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(property));\n\npublic void UpdateName(string name)\n{\n    _name = name;\n    Notify(nameof(Name));\n}",
        "codeType": "neutral"
      },
      {
        "type": "list",
        "items": [
          "Logging and diagnostics (to avoid stale literal names):"
        ]
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "_logger.LogInformation(\"Started processing {Handler}\", nameof(MyHandler));",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/nameof-keyword.md",
    "isSection": true,
    "id": "card-680"
  },
  {
    "question": "Edge cases & notes",
    "answer": [
      {
        "type": "list",
        "items": [
          "nameof is evaluated at compile time and produces a string literal in the compiled IL.",
          "nameof does not evaluate expressions — only identifiers (types, members, local variables, parameters).",
          "Using nameof on overloaded member groups (e.g., methods with same name) yields the single name string; it does not encode the signature.",
          "For nested types nameof(Outer.Inner) returns Inner."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/nameof-keyword.md",
    "isSection": true,
    "id": "card-681"
  },
  {
    "question": "Quick summary",
    "answer": [
      {
        "type": "list",
        "items": [
          "Use nameof(...) whenever you need the name of a symbol in code (argument checks, property-changed events, logging) to stay safe during refactoring.",
          "It reduces bugs caused by mismatched string literals and improves maintainability."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/nameof-keyword.md",
    "isSection": true,
    "id": "card-682"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: It’s refactor-safe. Renaming a symbol updates nameof usage automatically; string literals would silently become stale."
      },
      {
        "type": "text",
        "content": "A: No, it’s compile-time. The compiler replaces nameof(Symbol) with a string literal, so there’s zero runtime cost."
      },
      {
        "type": "text",
        "content": "A: You can pass Namespace.Type.Member, but it returns only the last identifier (e.g., Member). Use typeof(Type).FullName if you need the full name."
      },
      {
        "type": "text",
        "content": "A: Use it in ArgumentNullException(nameof(param)) so parameter names stay accurate even after refactors."
      },
      {
        "type": "text",
        "content": "A: Yes, but it returns the unqualified type name (e.g., nameof(Dictionary<int,string>) yields \"Dictionary\"). It doesn’t include type arguments."
      },
      {
        "type": "text",
        "content": "A: Yes—it respects using alias = ...;. nameof(alias) returns the alias name, not the underlying type."
      },
      {
        "type": "text",
        "content": "A: Absolutely. It works with any accessible symbol at compile time, including locals, parameters, and private members."
      },
      {
        "type": "text",
        "content": "A: CallerMemberName auto-fills the calling member name. Use nameof when referencing other members explicitly, and CallerMemberName when you want the current member at call site."
      },
      {
        "type": "text",
        "content": "A: Yes—nameof(MyMethod) returns \"MyMethod\", regardless of overloads. It doesn’t encode signatures."
      },
      {
        "type": "text",
        "content": "A: nameof is for developer-oriented strings (logging, diagnostics), not user-visible text. Keep localized strings separate from nameof usage."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/nameof-keyword.md",
    "isSection": true,
    "id": "card-683"
  },
  {
    "question": "Why does .NET use a generational GC design?",
    "answer": [
      {
        "type": "text",
        "content": "Because most objects die young. Generational collection optimizes for this by collecting Gen0 frequently (cheap) and Gen2 rarely, reducing pause times."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "id": "card-684"
  },
  {
    "question": "What triggers promotion between generations?",
    "answer": [
      {
        "type": "text",
        "content": "Surviving a collection promotes objects to the next generation. Gen0 survivors go to Gen1; Gen1 survivors go to Gen2. LOH allocations skip to a separate heap."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "id": "card-685"
  },
  {
    "question": "When do Gen2 collections occur?",
    "answer": [
      {
        "type": "text",
        "content": "When Gen2 fills, system memory pressure rises, or you force a full GC. They’re expensive, so minimizing promotions reduces their frequency."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "id": "card-686"
  },
  {
    "question": "How does the LOH differ from the SOH?",
    "answer": [
      {
        "type": "text",
        "content": "LOH holds objects ≥85 KB, isn’t compacted by default, and is only collected during Gen2 GCs. Excessive LOH allocations cause fragmentation and long pauses."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "id": "card-687"
  },
  {
    "question": "How can you keep objects in Gen0?",
    "answer": [
      {
        "type": "text",
        "content": "Reduce lifetimes (e.g., avoid caching everything), reuse buffers, and design streaming pipelines where data lives briefly before being discarded."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "id": "card-688"
  },
  {
    "question": "What’s the role of pinned objects?",
    "answer": [
      {
        "type": "text",
        "content": "Pins prevent the GC from moving objects during compaction, potentially fragmenting memory. Pin sparingly and for short durations."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "id": "card-689"
  },
  {
    "question": "How do you monitor generational activity?",
    "answer": [
      {
        "type": "text",
        "content": "Use dotnet-counters, PerfView, or EventPipe to track Gen0/1/2 counts, induced vs background collections, and % time in GC."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "id": "card-690"
  },
  {
    "question": "Why avoid manual GC.Collect()?",
    "answer": [
      {
        "type": "text",
        "content": "It forces full collections, negating the GC’s adaptive heuristics and causing unnecessary pauses. Let the runtime decide except for diagnostic scenarios."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "id": "card-691"
  },
  {
    "question": "How do spans/pools interact with GC generations?",
    "answer": [
      {
        "type": "text",
        "content": "They reduce allocations, keeping more work in Gen0 or on the stack, preventing promotions and LOH allocations."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "id": "card-692"
  },
  {
    "question": "How do you explain generational GC quickly to interviewers?",
    "answer": [
      {
        "type": "text",
        "content": "Emphasize the generational hypothesis, heap layout, promotion rules, LOH behavior, and how allocation discipline keeps the GC efficient."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "id": "card-693"
  },
  {
    "question": "1️⃣ The “why”: Why generational GC exists",
    "answer": [
      {
        "type": "text",
        "content": "In most real-world programs:"
      },
      {
        "type": "list",
        "items": [
          "Most objects are short-lived (local variables, temporary data, buffers, LINQ results).",
          "Some objects are long-lived (caches, connection pools, singletons, static config)."
        ]
      },
      {
        "type": "text",
        "content": "This is known as the generational hypothesis:"
      },
      {
        "type": "text",
        "content": "> “Most objects die young.”"
      },
      {
        "type": "text",
        "content": "So instead of scanning the entire heap every time, .NET uses a generational GC — it divides the heap into generations and collects the youngest first, because they’re most likely garbage."
      },
      {
        "type": "text",
        "content": "That gives you massive efficiency and predictable pause times."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "isSection": true,
    "id": "card-694"
  },
  {
    "question": "2️⃣ The three main generations",
    "answer": [
      {
        "type": "table",
        "headers": [
          "Generation",
          "Description",
          "Frequency",
          "Typical objects"
        ],
        "rows": [
          [
            "Gen 0",
            "Newest, youngest objects",
            "Collected most frequently",
            "Locals, temp lists, short-lived data"
          ],
          [
            "Gen 1",
            "“Middle-aged” survivors from Gen 0",
            "Collected occasionally",
            "Transient mid-term data"
          ],
          [
            "Gen 2",
            "Long-lived survivors",
            "Collected rarely (full GC)",
            "Caches, singletons, static data"
          ],
          [
            "LOH",
            "Large Object Heap (≥ 85,000 bytes)",
            "Collected with Gen 2",
            "Large arrays, strings, buffers"
          ]
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "isSection": true,
    "id": "card-695"
  },
  {
    "question": "3️⃣ Visual mental model",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "Gen0 ──► Gen1 ──► Gen2 ──► LOH\n short   medium   long     very large (>85KB)\n lived   lived    lived    objects (arrays, strings)",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Each arrow means “survive one more collection → promoted”."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "isSection": true,
    "id": "card-696"
  },
  {
    "question": "🧩 Allocation",
    "answer": [
      {
        "type": "text",
        "content": "When you create a new object:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var o = new object();",
        "codeType": "neutral"
      },
      {
        "type": "list",
        "items": [
          "Memory is allocated in Gen 0 segment (on the heap).",
          ".NET uses a bump pointer allocator — incredibly fast (just moves a pointer)."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "isSection": true,
    "id": "card-697"
  },
  {
    "question": "🧩 Gen 0 Collection",
    "answer": [
      {
        "type": "text",
        "content": "When Gen 0 is full:"
      },
      {
        "type": "list",
        "items": [
          "GC pauses threads (short pause, typically sub-millisecond).",
          "It scans Gen 0 roots (stack references, static fields, registers).",
          "Live objects survive → promoted to Gen 1.",
          "Dead objects → reclaimed."
        ]
      },
      {
        "type": "code",
        "language": "text",
        "code": "Before:\nGen0: [A, B, C]\nAfter GC0:\n  A dead, B/C alive → B,C moved to Gen1",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "isSection": true,
    "id": "card-698"
  },
  {
    "question": "🧩 Gen 1 Collection",
    "answer": [
      {
        "type": "text",
        "content": "When Gen 1 fills:"
      },
      {
        "type": "list",
        "items": [
          "GC collects Gen 0 + Gen 1.",
          "Survivors move to Gen 2."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "isSection": true,
    "id": "card-699"
  },
  {
    "question": "🧩 Gen 2 Collection (Full GC)",
    "answer": [
      {
        "type": "text",
        "content": "When Gen 2 fills (or memory pressure triggers it):"
      },
      {
        "type": "list",
        "items": [
          "GC collects all generations.",
          "This is the most expensive collection (may take tens or hundreds of ms)."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "isSection": true,
    "id": "card-700"
  },
  {
    "question": "🧩 LOH (Large Object Heap)",
    "answer": [
      {
        "type": "text",
        "content": "Objects ≥ 85,000 bytes (like large arrays, bitmaps, or JSON buffers):"
      },
      {
        "type": "list",
        "items": [
          "Allocated directly into the LOH.",
          "Not compacted by default (can fragment memory).",
          "Collected only with Gen 2 — so expensive."
        ]
      },
      {
        "type": "text",
        "content": "💡 Tip:"
      },
      {
        "type": "text",
        "content": "Avoid frequent large allocations. Reuse buffers via ArrayPool<T>.Shared to keep the LOH stable."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "isSection": true,
    "id": "card-701"
  },
  {
    "question": "5️⃣ Compacting vs Non-Compacting",
    "answer": [
      {
        "type": "list",
        "items": [
          "SOH (Small Object Heap) — compacts after GC (moves survivors to eliminate gaps). ➜ Keeps memory tight, improves cache performance.",
          "LOH (Large Object Heap) — does not compact by default, to avoid moving huge memory blocks. ➜ Can fragment over time."
        ]
      },
      {
        "type": "text",
        "content": "Optional:"
      },
      {
        "type": "text",
        "content": "You can compact LOH manually (rarely needed):"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce;\nGC.Collect(GC.MaxGeneration, GCCollectionMode.Forced);",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "isSection": true,
    "id": "card-702"
  },
  {
    "question": "6️⃣ What triggers a GC?",
    "answer": [
      {
        "type": "text",
        "content": "The CLR decides to collect when:"
      },
      {
        "type": "list",
        "items": [
          "Gen 0 segment fills up (most common).",
          "Gen 1/2 segment fills up (promotion pressure).",
          "System memory pressure (OS signal).",
          "You explicitly call GC.Collect() (almost never do this)."
        ]
      },
      {
        "type": "text",
        "content": "💡 Pro tip:"
      },
      {
        "type": "text",
        "content": "Avoid manual GC.Collect() — it often hurts performance because it interrupts the GC’s adaptive tuning."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "isSection": true,
    "id": "card-703"
  },
  {
    "question": "7️⃣ GC stats and diagnostics",
    "answer": [
      {
        "type": "text",
        "content": "You can observe GC behavior in real-time:"
      },
      {
        "type": "code",
        "language": "bash",
        "code": "dotnet-counters monitor System.Runtime",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "You’ll see counters like:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "Gen 0 GC Count: 345\nGen 1 GC Count: 12\nGen 2 GC Count: 1\n% Time in GC: 0.25\nAllocated Bytes/sec: 1,024,000",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "✅ Healthy app:"
      },
      {
        "type": "list",
        "items": [
          "Many Gen 0s",
          "Occasional Gen 1s",
          "Rare Gen 2s",
          "Low “% Time in GC”"
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "isSection": true,
    "id": "card-704"
  },
  {
    "question": "8️⃣ Performance design tips for GC-friendly code",
    "answer": [
      {
        "type": "table",
        "headers": [
          "Goal",
          "Best Practice"
        ],
        "rows": [
          [
            "Minimize Gen 0 churn",
            "Avoid allocating in tight loops or hot paths"
          ],
          [
            "Prevent Gen 2 pressure",
            "Reuse objects and buffers (ArrayPool<T>, ObjectPool<T>)"
          ],
          [
            "Avoid LOH fragmentation",
            "Use pooled or chunked buffers"
          ],
          [
            "Keep structs small and immutable",
            "No unnecessary copying or boxing"
          ],
          [
            "Monitor allocations",
            "Use dotnet-trace or dotMemory to find hotspots"
          ]
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "isSection": true,
    "id": "card-705"
  },
  {
    "question": "9️⃣ Trading-system example (HFM context)",
    "answer": [
      {
        "type": "text",
        "content": "In a price feed processor that handles thousands of ticks per second:"
      },
      {
        "type": "text",
        "content": "❌ Bad design:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "foreach (var msg in messages)\n{\n    var parts = msg.Split(','); // allocates string[] and substrings each iteration\n    var tick = new Tick { Symbol = parts[0], Bid = double.Parse(parts[1]) };\n}",
        "codeType": "neutral"
      },
      {
        "type": "list",
        "items": [
          "Massive Gen 0 churn",
          "Frequent Gen 1/2 GCs under load"
        ]
      },
      {
        "type": "text",
        "content": "✅ Good design:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var buffer = ArrayPool<byte>.Shared.Rent(4096);\nReadOnlySpan<byte> span = buffer.AsSpan(0, length);\nParseSpan(span); // no allocations\nArrayPool<byte>.Shared.Return(buffer);",
        "codeType": "neutral"
      },
      {
        "type": "list",
        "items": [
          "Almost no heap allocations",
          "GC barely runs",
          "Stable latency (critical for trading)"
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "isSection": true,
    "id": "card-706"
  },
  {
    "question": "10️⃣ TL;DR — How to summarize it in your interview",
    "answer": [
      {
        "type": "text",
        "content": "> “.NET uses a generational GC because most objects die young."
      },
      {
        "type": "text",
        "content": "> New objects go into Gen 0, survivors are promoted to Gen 1, then Gen 2."
      },
      {
        "type": "text",
        "content": "> The Large Object Heap (LOH) stores objects above ~85 KB and is only collected with Gen 2."
      },
      {
        "type": "text",
        "content": ">"
      },
      {
        "type": "text",
        "content": "> The key to performance is keeping allocations short-lived so they die in Gen 0, reusing large buffers to avoid LOH fragmentation, and preventing unnecessary promotions that trigger full GCs.”"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "isSection": true,
    "id": "card-707"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: Because most objects die young. Generational collection optimizes for this by collecting Gen0 frequently (cheap) and Gen2 rarely, reducing pause times."
      },
      {
        "type": "text",
        "content": "A: Surviving a collection promotes objects to the next generation. Gen0 survivors go to Gen1; Gen1 survivors go to Gen2. LOH allocations skip to a separate heap."
      },
      {
        "type": "text",
        "content": "A: When Gen2 fills, system memory pressure rises, or you force a full GC. They’re expensive, so minimizing promotions reduces their frequency."
      },
      {
        "type": "text",
        "content": "A: LOH holds objects ≥85 KB, isn’t compacted by default, and is only collected during Gen2 GCs. Excessive LOH allocations cause fragmentation and long pauses."
      },
      {
        "type": "text",
        "content": "A: Reduce lifetimes (e.g., avoid caching everything), reuse buffers, and design streaming pipelines where data lives briefly before being discarded."
      },
      {
        "type": "text",
        "content": "A: Pins prevent the GC from moving objects during compaction, potentially fragmenting memory. Pin sparingly and for short durations."
      },
      {
        "type": "text",
        "content": "A: Use dotnet-counters, PerfView, or EventPipe to track Gen0/1/2 counts, induced vs background collections, and % time in GC."
      },
      {
        "type": "text",
        "content": "A: It forces full collections, negating the GC’s adaptive heuristics and causing unnecessary pauses. Let the runtime decide except for diagnostic scenarios."
      },
      {
        "type": "text",
        "content": "A: They reduce allocations, keeping more work in Gen0 or on the stack, preventing promotions and LOH allocations."
      },
      {
        "type": "text",
        "content": "A: Emphasize the generational hypothesis, heap layout, promotion rules, LOH behavior, and how allocation discipline keeps the GC efficient."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "isSection": true,
    "id": "card-708"
  },
  {
    "question": "9️⃣ Trading-system example (HFM context)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "foreach (var msg in messages)\n{\n    var parts = msg.Split(','); // allocates string[] and substrings each iteration\n    var tick = new Tick { Symbol = parts[0], Bid = double.Parse(parts[1]) };\n}",
        "codeType": "bad"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "isConcept": true,
    "id": "card-709"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "var buffer = ArrayPool<byte>.Shared.Rent(4096);\nReadOnlySpan<byte> span = buffer.AsSpan(0, length);\nParseSpan(span); // no allocations\nArrayPool<byte>.Shared.Return(buffer);",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/NET Generational Garbage Collection (GC) Deep Dive.md",
    "isConcept": true,
    "id": "card-710"
  },
  {
    "question": "When do you choose RabbitMQ over Kafka?",
    "answer": [
      {
        "type": "text",
        "content": "RabbitMQ excels at command/work queues, request/response, and flexible routing with acknowledgements. Kafka shines for immutable event streams and massive throughput. Use RabbitMQ when you need rich routing, per-message ack, or TTL/dead-lettering."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/RabbitMQ.md",
    "id": "card-711"
  },
  {
    "question": "How do you guarantee message durability?",
    "answer": [
      {
        "type": "text",
        "content": "Declare durable queues/exchanges, publish persistent messages, and enable publisher confirms to ensure the broker has persisted the message before the producer proceeds."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/RabbitMQ.md",
    "id": "card-712"
  },
  {
    "question": "How does prefetch affect consumers?",
    "answer": [
      {
        "type": "text",
        "content": "BasicQos controls how many unacked messages a consumer can hold. Tuning it prevents overloading workers and enables fair dispatch; too high causes memory bloat and slow retries."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/RabbitMQ.md",
    "id": "card-713"
  },
  {
    "question": "What’s the role of dead-letter exchanges?",
    "answer": [
      {
        "type": "text",
        "content": "DLXs catch messages that expire or are rejected/nacked with requeue=false. You can inspect/retry them later, implement backoff flows, and avoid clogging primary queues with poison messages."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/RabbitMQ.md",
    "id": "card-714"
  },
  {
    "question": "How do you handle retries without poisoning the queue?",
    "answer": [
      {
        "type": "text",
        "content": "Use delayed exchanges or route failed messages to a retry queue with TTL, then back to the main queue. Avoid immediate requeue loops that block other messages."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/RabbitMQ.md",
    "id": "card-715"
  },
  {
    "question": "How do you scale consumers safely?",
    "answer": [
      {
        "type": "text",
        "content": "Add instances with sensible prefetch counts, monitor unacked counts, and ensure handlers are idempotent so redelivery is safe. Use quorum queues for HA if scaling across nodes."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/RabbitMQ.md",
    "id": "card-716"
  },
  {
    "question": "How do you detect lost connections?",
    "answer": [
      {
        "type": "text",
        "content": "Monitor heartbeats, handle exceptions on IConnection/IModel, and recreate channels with exponential backoff. Health checks should attempt passive declares or simple RPCs."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/RabbitMQ.md",
    "id": "card-717"
  },
  {
    "question": "How do you ensure idempotent consumers?",
    "answer": [
      {
        "type": "text",
        "content": "Include message IDs, dedupe in storage (upserts, uniqueness constraints), and design handlers so rerunning the same message is safe, which is essential with at-least-once delivery."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/RabbitMQ.md",
    "id": "card-718"
  },
  {
    "question": "What operational metrics matter most?",
    "answer": [
      {
        "type": "text",
        "content": "Queue depth, unacked message count, consumer utilization, connection/channel counts, publish confirms latency, and DLQ rates. Alert when thresholds are breached."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/RabbitMQ.md",
    "id": "card-719"
  },
  {
    "question": "How do you secure RabbitMQ?",
    "answer": [
      {
        "type": "text",
        "content": "Enforce TLS, use per-vhost credentials with least privilege, rotate passwords/creds, and restrict management UI access. Enable LDAP/OIDC integration when possible."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/RabbitMQ.md",
    "id": "card-720"
  },
  {
    "question": "What RabbitMQ Is For",
    "answer": [
      {
        "type": "list",
        "items": [
          "Brokered messaging with rich routing (direct, fanout, topic, headers) and per-message acknowledgements.",
          "Excellent for work queues, event fan-out, request/response over AMQP, and asynchronous integration between services.",
          "Shines when you need durability (persisted queues/exchanges), flow control (prefetch/QoS), and operational tooling (management UI/CLI)."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/RabbitMQ.md",
    "isSection": true,
    "id": "card-721"
  },
  {
    "question": "Core Building Blocks",
    "answer": [
      {
        "type": "list",
        "items": [
          "Exchanges route messages to queues based on type:",
          "Direct: Exact routing key match (work queues, point-to-point commands).",
          "Topic: Pattern-based routing with wildcards; great for multi-tenant/event streams (e.g., trades.usd.nyse).",
          "Fanout: Broadcast to all bound queues (cache invalidation, notifications).",
          "Headers: Route via headers (rare; use when routing key isn’t enough).",
          "Queues hold messages; define durability and exclusivity per use case.",
          "Bindings connect exchanges to queues with routing keys/patterns.",
          "Consumers subscribe to queues and ack messages after successful processing.",
          "Dead-letter exchanges (DLX) capture rejected/expired messages for inspection or retry policies."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/RabbitMQ.md",
    "isSection": true,
    "id": "card-722"
  },
  {
    "question": "Designing for Reliability & Throughput",
    "answer": [
      {
        "type": "list",
        "items": [
          "Durable queues + persistent messages: durable: true queues and IBasicProperties.Persistent = true survive broker restarts.",
          "Publisher confirms: Use ConfirmSelect + WaitForConfirmsOrDie (or async confirms) to ensure the broker received and persisted the publish.",
          "Consumer acknowledgements: Manual BasicAck/BasicNack lets you avoid losing work; pair with idempotent handlers to tolerate redelivery.",
          "Prefetch/QoS: Set BasicQos(prefetchCount: N) to avoid overwhelming consumers and to enable fair dispatch.",
          "Ordering: RabbitMQ preserves per-queue order; multiple consumers can reorder. Keep a single consumer per queue if strict ordering matters.",
          "Retries: Prefer delayed queues or dead-letter routing to a retry queue with backoff instead of immediate requeue loops.",
          "Idempotency & dedupe: Use message IDs + idempotent writes (upserts), or an outbox table feeding RabbitMQ to ensure at-least-once delivery without duplication."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/RabbitMQ.md",
    "isSection": true,
    "id": "card-723"
  },
  {
    "question": "Consumer (Async EventingBasicConsumer)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "var consumer = new AsyncEventingBasicConsumer(channel);\nconsumer.Received += async (sender, ea) =>\n{\n    var payload = Encoding.UTF8.GetString(ea.Body.ToArray());\n    await handler.HandleAsync(payload, ea.BasicProperties.MessageId);\n    channel.BasicAck(ea.DeliveryTag, multiple: false);\n};\nchannel.BasicConsume(\"orders.matching\", autoAck: false, consumer: consumer);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "> Tip: Wrap the channel in a Hosted Service and expose health checks (e.g., check connection + passive queue declare) for Kubernetes."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/RabbitMQ.md",
    "isSection": true,
    "id": "card-724"
  },
  {
    "question": "Operational Playbook (What to Say in an Interview)",
    "answer": [
      {
        "type": "list",
        "items": [
          "Provisioning: Use classic queues for general workloads; quorum queues for HA and strong durability (RAFT-based) at the cost of memory/IO.",
          "Observability: Turn on the management plugin; monitor queue depth, unacked count, connection churn, and consumer utilization.",
          "Back-pressure: Control publishers with confirms + timeouts; throttle consumers via prefetch and CPU-aware worker scaling.",
          "Security: Use TLS, per-vhost credentials, and minimal permissions; rotate credentials and enable LDAP/OIDC if offered by ops.",
          "Schema & compatibility: Version message contracts; use headers for schema versioning and keep handlers backward compatible.",
          "Disaster recovery: Mirror (quorum) queues across nodes; test failover and ensure producers handle IConnection/IModel recreation."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/RabbitMQ.md",
    "isSection": true,
    "id": "card-725"
  },
  {
    "question": "Pros",
    "answer": [
      {
        "type": "list",
        "items": [
          "Mature AMQP 0-9-1 broker with rich routing and plugins (delayed messages, tracing, shovel/federation).",
          "Operationally friendly: management UI, CLI (rabbitmqctl, rabbitmq-diagnostics), easy local dev via Docker.",
          "Strong durability options (quorum queues, publisher confirms) and fine-grained flow control (prefetch/QoS).",
          "Great polyglot support and client libraries, including first-class .NET support."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/RabbitMQ.md",
    "isSection": true,
    "id": "card-726"
  },
  {
    "question": "Cons",
    "answer": [
      {
        "type": "list",
        "items": [
          "Throughput lower than partitioned logs like Kafka; not ideal for massive immutable event streams.",
          "Ordering only per queue; multiple consumers or requeueing can reorder messages.",
          "Backpressure requires careful tuning (prefetch, confirms); naive autoAck leads to drops on consumer crash.",
          "Cluster complexity: Quorum queues use more memory/IO; network partitions can require operator intervention."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/RabbitMQ.md",
    "isSection": true,
    "id": "card-727"
  },
  {
    "question": "Quick Usage Checklist (On the Job)",
    "answer": [
      {
        "type": "list",
        "items": [
          "Declare exchanges/queues in code at startup with explicit durability flags.",
          "Enable publisher confirms and retry publishes with exponential backoff.",
          "Use manual acks + prefetch sized to the handler’s latency.",
          "Keep handlers idempotent; store a processed message ID or use database upserts.",
          "Route failures to a DLX with alerting; inspect DLQ metrics regularly.",
          "Version payloads and keep consumers backward compatible during rollouts.",
          "Add health checks for connection + passive declare to catch topology drift early."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/RabbitMQ.md",
    "isSection": true,
    "id": "card-728"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: RabbitMQ excels at command/work queues, request/response, and flexible routing with acknowledgements. Kafka shines for immutable event streams and massive throughput. Use RabbitMQ when you need rich routing, per-message ack, or TTL/dead-lettering."
      },
      {
        "type": "text",
        "content": "A: Declare durable queues/exchanges, publish persistent messages, and enable publisher confirms to ensure the broker has persisted the message before the producer proceeds."
      },
      {
        "type": "text",
        "content": "A: BasicQos controls how many unacked messages a consumer can hold. Tuning it prevents overloading workers and enables fair dispatch; too high causes memory bloat and slow retries."
      },
      {
        "type": "text",
        "content": "A: DLXs catch messages that expire or are rejected/nacked with requeue=false. You can inspect/retry them later, implement backoff flows, and avoid clogging primary queues with poison messages."
      },
      {
        "type": "text",
        "content": "A: Use delayed exchanges or route failed messages to a retry queue with TTL, then back to the main queue. Avoid immediate requeue loops that block other messages."
      },
      {
        "type": "text",
        "content": "A: Add instances with sensible prefetch counts, monitor unacked counts, and ensure handlers are idempotent so redelivery is safe. Use quorum queues for HA if scaling across nodes."
      },
      {
        "type": "text",
        "content": "A: Monitor heartbeats, handle exceptions on IConnection/IModel, and recreate channels with exponential backoff. Health checks should attempt passive declares or simple RPCs."
      },
      {
        "type": "text",
        "content": "A: Include message IDs, dedupe in storage (upserts, uniqueness constraints), and design handlers so rerunning the same message is safe, which is essential with at-least-once delivery."
      },
      {
        "type": "text",
        "content": "A: Queue depth, unacked message count, consumer utilization, connection/channel counts, publish confirms latency, and DLQ rates. Alert when thresholds are breached."
      },
      {
        "type": "text",
        "content": "A: Enforce TLS, use per-vhost credentials with least privilege, rotate passwords/creds, and restrict management UI access. Enable LDAP/OIDC integration when possible."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/RabbitMQ.md",
    "isSection": true,
    "id": "card-729"
  },
  {
    "question": "When is reflection appropriate despite its cost?",
    "answer": [
      {
        "type": "text",
        "content": "For dynamic scenarios like plugin discovery, serialization, attribute-driven behavior, or tooling where compile-time knowledge is limited. Use it outside hot paths or cache results."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Reflection Overview.md",
    "id": "card-730"
  },
  {
    "question": "How do you mitigate reflection performance penalties?",
    "answer": [
      {
        "type": "text",
        "content": "Cache PropertyInfo/MethodInfo, create delegates via CreateDelegate, or use Expression trees to generate accessors. Source generators can precompute metadata to avoid runtime reflection entirely."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Reflection Overview.md",
    "id": "card-731"
  },
  {
    "question": "What are alternatives to reflection for DI?",
    "answer": [
      {
        "type": "text",
        "content": "Compile-time registration, source generators, or manual wiring. Reflection simplifies auto-discovery but can slow startup; balance convenience with performance."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Reflection Overview.md",
    "id": "card-732"
  },
  {
    "question": "How does reflection interact with trimming/AOT?",
    "answer": [
      {
        "type": "text",
        "content": "Trimming can remove unused members. Reflection needs preserved metadata, so mark types with DynamicallyAccessedMembers or Preserve attributes when building self-contained apps."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Reflection Overview.md",
    "id": "card-733"
  },
  {
    "question": "How do you secure reflection usage?",
    "answer": [
      {
        "type": "text",
        "content": "Validate assembly paths, restrict loaded types/namespaces, and avoid executing untrusted code. Reflection can bypass encapsulation, so enforce security at the host/application level."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Reflection Overview.md",
    "id": "card-734"
  },
  {
    "question": "Can reflection access private members?",
    "answer": [
      {
        "type": "text",
        "content": "Yes via BindingFlags.NonPublic, but it should be used sparingly (e.g., for testing). It can break encapsulation and may fail under IL trimming."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Reflection Overview.md",
    "id": "card-735"
  },
  {
    "question": "How do you use reflection emit or System.Reflection.Emit?",
    "answer": [
      {
        "type": "text",
        "content": "To generate types/methods at runtime (dynamic proxies, serialization). It’s powerful but complex; prefer Expression trees or source generators when possible."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Reflection Overview.md",
    "id": "card-736"
  },
  {
    "question": "What’s the cost of Activator.CreateInstance vs new?",
    "answer": [
      {
        "type": "text",
        "content": "Activator.CreateInstance is slower because it uses reflection. Cache constructors via compiled delegates when instantiating frequently."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Reflection Overview.md",
    "id": "card-737"
  },
  {
    "question": "How does JsonSerializer leverage reflection?",
    "answer": [
      {
        "type": "text",
        "content": "It inspects types at runtime to discover properties/attributes. In .NET 6+, source generators can precompute serializers to avoid reflection overhead and enable trimming."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Reflection Overview.md",
    "id": "card-738"
  },
  {
    "question": "How do you test reflection-heavy code?",
    "answer": [
      {
        "type": "text",
        "content": "Write unit tests for discovery logic (ensuring correct types are found) and integration tests that verify attributes/config drive expected behavior. Mock metadata where possible."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Reflection Overview.md",
    "id": "card-739"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: For dynamic scenarios like plugin discovery, serialization, attribute-driven behavior, or tooling where compile-time knowledge is limited. Use it outside hot paths or cache results."
      },
      {
        "type": "text",
        "content": "A: Cache PropertyInfo/MethodInfo, create delegates via CreateDelegate, or use Expression trees to generate accessors. Source generators can precompute metadata to avoid runtime reflection entirely."
      },
      {
        "type": "text",
        "content": "A: Compile-time registration, source generators, or manual wiring. Reflection simplifies auto-discovery but can slow startup; balance convenience with performance."
      },
      {
        "type": "text",
        "content": "A: Trimming can remove unused members. Reflection needs preserved metadata, so mark types with DynamicallyAccessedMembers or Preserve attributes when building self-contained apps."
      },
      {
        "type": "text",
        "content": "A: Validate assembly paths, restrict loaded types/namespaces, and avoid executing untrusted code. Reflection can bypass encapsulation, so enforce security at the host/application level."
      },
      {
        "type": "text",
        "content": "A: Yes via BindingFlags.NonPublic, but it should be used sparingly (e.g., for testing). It can break encapsulation and may fail under IL trimming."
      },
      {
        "type": "text",
        "content": "A: To generate types/methods at runtime (dynamic proxies, serialization). It’s powerful but complex; prefer Expression trees or source generators when possible."
      },
      {
        "type": "text",
        "content": "A: Activator.CreateInstance is slower because it uses reflection. Cache constructors via compiled delegates when instantiating frequently."
      },
      {
        "type": "text",
        "content": "A: It inspects types at runtime to discover properties/attributes. In .NET 6+, source generators can precompute serializers to avoid reflection overhead and enable trimming."
      },
      {
        "type": "text",
        "content": "A: Write unit tests for discovery logic (ensuring correct types are found) and integration tests that verify attributes/config drive expected behavior. Mock metadata where possible."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Reflection Overview.md",
    "isSection": true,
    "id": "card-740"
  },
  {
    "question": "How do you switch between Server and Workstation GC?",
    "answer": [
      {
        "type": "text",
        "content": "Set DOTNET_GCServer=1 (or configure in runtimeconfig) for Server GC. Without it, Workstation GC is used by default for desktop apps. Always verify with GCSettings.IsServerGC."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Server vs Workstation GC.md",
    "id": "card-741"
  },
  {
    "question": "Why is Server GC ideal for web APIs?",
    "answer": [
      {
        "type": "text",
        "content": "It creates a GC worker per core and uses larger segments, reducing collection frequency and keeping throughput high under heavy allocation workloads common in APIs."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Server vs Workstation GC.md",
    "id": "card-742"
  },
  {
    "question": "When would Workstation GC outperform Server GC?",
    "answer": [
      {
        "type": "text",
        "content": "In small, CPU-limited containers or interactive desktop apps where shorter individual pauses matter more than raw throughput. Always measure both modes."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Server vs Workstation GC.md",
    "id": "card-743"
  },
  {
    "question": "Do latency modes differ between Server and Workstation GC?",
    "answer": [
      {
        "type": "text",
        "content": "Both support GCSettings.LatencyMode options (Interactive, Batch, SustainedLowLatency, NoGCRegion). Choose based on workload, not GC flavor."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Server vs Workstation GC.md",
    "id": "card-744"
  },
  {
    "question": "How does containerization affect GC choice?",
    "answer": [
      {
        "type": "text",
        "content": ".NET respects container CPU/memory limits when sizing GC segments and threads. If you limit CPUs, Server GC creates fewer worker threads accordingly."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Server vs Workstation GC.md",
    "id": "card-745"
  },
  {
    "question": "How do you monitor GC mode effectiveness?",
    "answer": [
      {
        "type": "text",
        "content": "Track % Time in GC, Gen2 counts, and LOH size via dotnet-counters or App Insights. Compare metrics when toggling between modes to justify the configuration."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Server vs Workstation GC.md",
    "id": "card-746"
  },
  {
    "question": "Can you mix modes within the same process?",
    "answer": [
      {
        "type": "text",
        "content": "No. GC mode is a process-wide setting configured at startup. You can’t run Server GC for some components and Workstation GC for others."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Server vs Workstation GC.md",
    "id": "card-747"
  },
  {
    "question": "How do pinned objects behave under each mode?",
    "answer": [
      {
        "type": "text",
        "content": "Pinning affects compaction regardless of GC mode. However, Server GC’s larger segments mean fragmentation can be more noticeable if you pin frequently."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Server vs Workstation GC.md",
    "id": "card-748"
  },
  {
    "question": "Does background GC behave differently between modes?",
    "answer": [
      {
        "type": "text",
        "content": "Server GC runs background Gen2 collections in parallel. Workstation GC also supports background GC but with fewer worker threads, so concurrency benefits are smaller."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Server vs Workstation GC.md",
    "id": "card-749"
  },
  {
    "question": "What’s your quick pitch comparing the two?",
    "answer": [
      {
        "type": "text",
        "content": "“Server GC maximizes throughput on multi-core servers via parallel collections; Workstation GC prioritizes responsiveness with shorter pauses. Choose based on workload and validate with GC metrics.”"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Server vs Workstation GC.md",
    "id": "card-750"
  },
  {
    "question": "Server GC",
    "answer": [
      {
        "type": "list",
        "items": [
          "On startup, CLR creates one GC worker per core. During a blocking GC, all managed threads hit a safepoint; GC workers run in parallel to mark/compact.",
          "Background (concurrent) Gen2 collections run alongside the app. Gen0/Gen1 are still short stop-the-world.",
          "Bigger segments (ephemeral & Gen2) reduce GC frequency under high allocation rates (typical on APIs parsing JSON, serializing, buffering).",
          "Pauses can be longer, but total % time in GC is usually lower, boosting throughput."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Server vs Workstation GC.md",
    "isSection": true,
    "id": "card-751"
  },
  {
    "question": "Workstation GC",
    "answer": [
      {
        "type": "list",
        "items": [
          "Designed to feel snappy on a single user’s machine.",
          "Smaller segments → more frequent, shorter GCs.",
          "Background GC also exists, but there’s no parallel army of GC workers per core."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Server vs Workstation GC.md",
    "isSection": true,
    "id": "card-752"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: Set DOTNET_GCServer=1 (or configure in runtimeconfig) for Server GC. Without it, Workstation GC is used by default for desktop apps. Always verify with GCSettings.IsServerGC."
      },
      {
        "type": "text",
        "content": "A: It creates a GC worker per core and uses larger segments, reducing collection frequency and keeping throughput high under heavy allocation workloads common in APIs."
      },
      {
        "type": "text",
        "content": "A: In small, CPU-limited containers or interactive desktop apps where shorter individual pauses matter more than raw throughput. Always measure both modes."
      },
      {
        "type": "text",
        "content": "A: Both support GCSettings.LatencyMode options (Interactive, Batch, SustainedLowLatency, NoGCRegion). Choose based on workload, not GC flavor."
      },
      {
        "type": "text",
        "content": "A: .NET respects container CPU/memory limits when sizing GC segments and threads. If you limit CPUs, Server GC creates fewer worker threads accordingly."
      },
      {
        "type": "text",
        "content": "A: Track % Time in GC, Gen2 counts, and LOH size via dotnet-counters or App Insights. Compare metrics when toggling between modes to justify the configuration."
      },
      {
        "type": "text",
        "content": "A: No. GC mode is a process-wide setting configured at startup. You can’t run Server GC for some components and Workstation GC for others."
      },
      {
        "type": "text",
        "content": "A: Pinning affects compaction regardless of GC mode. However, Server GC’s larger segments mean fragmentation can be more noticeable if you pin frequently."
      },
      {
        "type": "text",
        "content": "A: Server GC runs background Gen2 collections in parallel. Workstation GC also supports background GC but with fewer worker threads, so concurrency benefits are smaller."
      },
      {
        "type": "text",
        "content": "A: “Server GC maximizes throughput on multi-core servers via parallel collections; Workstation GC prioritizes responsiveness with shorter pauses. Choose based on workload and validate with GC metrics.”"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Server vs Workstation GC.md",
    "isSection": true,
    "id": "card-753"
  },
  {
    "question": "When would you use SortedList over SortedDictionary?",
    "answer": [
      {
        "type": "text",
        "content": "When reads dominate and the key set doesn’t change frequently. SortedList uses arrays, so lookups are O(log n), but inserts shift elements (O(n)), making it best for mostly-static data."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorted Collections Interview Notes.md",
    "id": "card-754"
  },
  {
    "question": "How do SortedDictionary and SortedSet differ?",
    "answer": [
      {
        "type": "text",
        "content": "SortedDictionary stores key/value pairs with unique keys. SortedSet stores unique values only. Both use balanced trees with O(log n) operations; choose based on whether you need values associated with keys."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorted Collections Interview Notes.md",
    "id": "card-755"
  },
  {
    "question": "What’s a practical use of SortedSet.GetViewBetween?",
    "answer": [
      {
        "type": "text",
        "content": "Maintaining sliding windows or retrieving ranges (e.g., trades between two timestamps) without copying data."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorted Collections Interview Notes.md",
    "id": "card-756"
  },
  {
    "question": "How do you implement a max-heap with PriorityQueue?",
    "answer": [
      {
        "type": "text",
        "content": "Provide a comparer that flips the priority ordering (e.g., Comparer<int>.Create((a,b) => b.CompareTo(a))) so highest values bubble to the top."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorted Collections Interview Notes.md",
    "id": "card-757"
  },
  {
    "question": "How do sorted collections handle custom ordering?",
    "answer": [
      {
        "type": "text",
        "content": "Pass an IComparer<T> or implement IComparable<T> on keys/elements. This enables domain-specific ordering (e.g., price descending, timestamp ascending)."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorted Collections Interview Notes.md",
    "id": "card-758"
  },
  {
    "question": "When is List<T>.BinarySearch enough?",
    "answer": [
      {
        "type": "text",
        "content": "If you can maintain a sorted list and only need lookups/removals occasionally. Inserts remain O(n), but the simplicity might beat tree-based structures."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorted Collections Interview Notes.md",
    "id": "card-759"
  },
  {
    "question": "How do you keep sorted collections thread-safe?",
    "answer": [
      {
        "type": "text",
        "content": "Wrap access with locks or use immutable snapshots. There’s no built-in concurrent sorted collection, so you must manage synchronization yourself."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorted Collections Interview Notes.md",
    "id": "card-760"
  },
  {
    "question": "How does memory usage compare between SortedList and SortedDictionary?",
    "answer": [
      {
        "type": "text",
        "content": "SortedList uses contiguous arrays (less overhead). SortedDictionary stores nodes with pointers (higher overhead) but faster inserts/removals."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorted Collections Interview Notes.md",
    "id": "card-761"
  },
  {
    "question": "How do you maintain a top-N leaderboard efficiently?",
    "answer": [
      {
        "type": "text",
        "content": "Use SortedSet or PriorityQueue bounded to N items. When a new value arrives, compare against the smallest/largest and adjust accordingly."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorted Collections Interview Notes.md",
    "id": "card-762"
  },
  {
    "question": "What are alternatives for huge sorted datasets?",
    "answer": [
      {
        "type": "text",
        "content": "Consider B-trees or sorted indexes at the storage layer (SQL ORDER BY/indexes), or specialized libraries like ImmutableSortedSet for functional requirements."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorted Collections Interview Notes.md",
    "id": "card-763"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: When reads dominate and the key set doesn’t change frequently. SortedList uses arrays, so lookups are O(log n), but inserts shift elements (O(n)), making it best for mostly-static data."
      },
      {
        "type": "text",
        "content": "A: SortedDictionary stores key/value pairs with unique keys. SortedSet stores unique values only. Both use balanced trees with O(log n) operations; choose based on whether you need values associated with keys."
      },
      {
        "type": "text",
        "content": "A: Maintaining sliding windows or retrieving ranges (e.g., trades between two timestamps) without copying data."
      },
      {
        "type": "text",
        "content": "A: Provide a comparer that flips the priority ordering (e.g., Comparer<int>.Create((a,b) => b.CompareTo(a))) so highest values bubble to the top."
      },
      {
        "type": "text",
        "content": "A: Pass an IComparer<T> or implement IComparable<T> on keys/elements. This enables domain-specific ordering (e.g., price descending, timestamp ascending)."
      },
      {
        "type": "text",
        "content": "A: If you can maintain a sorted list and only need lookups/removals occasionally. Inserts remain O(n), but the simplicity might beat tree-based structures."
      },
      {
        "type": "text",
        "content": "A: Wrap access with locks or use immutable snapshots. There’s no built-in concurrent sorted collection, so you must manage synchronization yourself."
      },
      {
        "type": "text",
        "content": "A: SortedList uses contiguous arrays (less overhead). SortedDictionary stores nodes with pointers (higher overhead) but faster inserts/removals."
      },
      {
        "type": "text",
        "content": "A: Use SortedSet or PriorityQueue bounded to N items. When a new value arrives, compare against the smallest/largest and adjust accordingly."
      },
      {
        "type": "text",
        "content": "A: Consider B-trees or sorted indexes at the storage layer (SQL ORDER BY/indexes), or specialized libraries like ImmutableSortedSet for functional requirements."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorted Collections Interview Notes.md",
    "isSection": true,
    "id": "card-764"
  },
  {
    "question": "When would you pick insertion sort in production?",
    "answer": [
      {
        "type": "text",
        "content": "For tiny datasets or nearly sorted inputs (e.g., maintaining a small sorted window). It’s simple, cache-friendly, and used inside hybrid algorithms for small partitions."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorting Algorithms.md",
    "id": "card-765"
  },
  {
    "question": "Why is quicksort’s worst case O(n²) and how does .NET avoid it?",
    "answer": [
      {
        "type": "text",
        "content": "Poor pivot choices cause unbalanced partitions. .NET’s introsort switches from quicksort to heapsort when recursion depth exceeds a threshold, guaranteeing O(n log n)."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorting Algorithms.md",
    "id": "card-766"
  },
  {
    "question": "What makes merge sort stable?",
    "answer": [
      {
        "type": "text",
        "content": "It combines sorted halves without swapping equal elements out of order, preserving the original relative order—critical for multi-key sorts."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorting Algorithms.md",
    "id": "card-767"
  },
  {
    "question": "When is counting sort better than comparison sorts?",
    "answer": [
      {
        "type": "text",
        "content": "When the key range (k) is small relative to n (e.g., rating 0-100). It runs in O(n+k) and is stable, making it ideal for bucketed enums or ASCII data."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorting Algorithms.md",
    "id": "card-768"
  },
  {
    "question": "What’s the trade-off between heap sort and merge sort?",
    "answer": [
      {
        "type": "text",
        "content": "Heap sort is in-place with O(1) extra space but not stable. Merge sort is stable but needs O(n) auxiliary storage. Choose based on stability requirements vs memory constraints."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorting Algorithms.md",
    "id": "card-769"
  },
  {
    "question": "How do you keep an order book sorted efficiently?",
    "answer": [
      {
        "type": "text",
        "content": "Use a balanced tree (SortedDictionary, SortedSet) or a heap for top-k operations; for full snapshots, maintain sorted arrays and apply incremental updates with binary insertions."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorting Algorithms.md",
    "id": "card-770"
  },
  {
    "question": "How does radix sort work for integers?",
    "answer": [
      {
        "type": "text",
        "content": "It processes digits (LSB or MSB) using counting sort per digit, achieving linear time for fixed-width integers. It’s stable and non-comparison-based."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorting Algorithms.md",
    "id": "card-771"
  },
  {
    "question": "What’s the complexity of bucket sort and when is it optimal?",
    "answer": [
      {
        "type": "text",
        "content": "Average O(n) when inputs are uniformly distributed. Useful for hashing floats into buckets (e.g., histogram of trade sizes) before sorting within buckets."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorting Algorithms.md",
    "id": "card-772"
  },
  {
    "question": "Why is stability important for multi-key sorts?",
    "answer": [
      {
        "type": "text",
        "content": "It preserves relative ordering of equal keys, allowing sequential sorting by secondary keys without losing primary-order guarantees."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorting Algorithms.md",
    "id": "card-773"
  },
  {
    "question": "How do you parallelize sorting in .NET?",
    "answer": [
      {
        "type": "text",
        "content": "Split data into chunks, sort in parallel via Parallel.For or PLINQ, then merge. For huge arrays, consider Array.Sort for baseline and only parallelize when CPU resources justify the overhead."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorting Algorithms.md",
    "id": "card-774"
  },
  {
    "question": "Comparison Sorts",
    "answer": [
      {
        "type": "table",
        "headers": [
          "Algorithm",
          "Time (avg)",
          "Time (worst)",
          "Space",
          "Stable",
          "Notes"
        ],
        "rows": [
          [
            "Insertion Sort",
            "O(n²)",
            "O(n²)",
            "O(1)",
            "✅",
            "Fast on nearly sorted data; used for small partitions within hybrid sorts."
          ],
          [
            "Selection Sort",
            "O(n²)",
            "O(n²)",
            "O(1)",
            "❌",
            "Minimal swaps—works when writing to flash memory where writes are expensive."
          ],
          [
            "Bubble Sort",
            "O(n²)",
            "O(n²)",
            "O(1)",
            "✅",
            "Easy to explain; mention the flag optimization for already-sorted input."
          ],
          [
            "Heap Sort",
            "O(n log n)",
            "O(n log n)",
            "O(1)",
            "❌",
            "Deterministic O(n log n) with no extra space; basis for priority queues."
          ],
          [
            "Merge Sort",
            "O(n log n)",
            "O(n log n)",
            "O(n)",
            "✅",
            "Streaming-friendly; Enumerable.OrderBy pipelines to merge sort under the hood."
          ],
          [
            "Quick Sort / Introsort",
            "O(n log n)",
            "O(n²)",
            "O(log n)",
            "❌",
            ".NET’s Array.Sort uses introspective sort (quick + heap + insertion) to avoid worst-case."
          ]
        ]
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// In-place quicksort with Hoare partitioning\npublic static void QuickSort(Span<int> data)\n{\n    if (data.Length <= 1) return;\n    int i = 0, j = data.Length - 1;\n    var pivot = data[data.Length / 2];\n    while (i <= j)\n    {\n        while (data[i] < pivot) i++;\n        while (data[j] > pivot) j--;\n        if (i <= j)\n        {\n            (data[i], data[j]) = (data[j], data[i]);\n            i++; j--;\n        }\n    }\n    QuickSort(data[..(j + 1)]);\n    QuickSort(data[i..]);\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorting Algorithms.md",
    "isSection": true,
    "id": "card-775"
  },
  {
    "question": "Non-Comparison Sorts",
    "answer": [
      {
        "type": "table",
        "headers": [
          "Algorithm",
          "Complexity",
          "Stable",
          "When to Use"
        ],
        "rows": [
          [
            "Counting Sort",
            "O(n + k)",
            "✅",
            "Small integer ranges (e.g., enum buckets, ASCII chars)."
          ],
          [
            "Radix Sort",
            "O(d * (n + k))",
            "✅",
            "Fixed-length integers/strings; combine with counting sort per digit."
          ],
          [
            "Bucket Sort",
            "O(n) avg",
            "✅",
            "Uniformly distributed floats (0–1); use for histograms or frequency analysis."
          ]
        ]
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public static int[] CountingSort(int[] source, int maxValue)\n{\n    var counts = new int[maxValue + 1];\n    foreach (var value in source)\n    {\n        counts[value]++;\n    }\n\n    var index = 0;\n    for (var value = 0; value < counts.Length; value++)\n    {\n        while (counts[value]-- > 0)\n        {\n            source[index++] = value;\n        }\n    }\n    return source;\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorting Algorithms.md",
    "isSection": true,
    "id": "card-776"
  },
  {
    "question": "Talking Points",
    "answer": [
      {
        "type": "list",
        "items": [
          "Stability matters for multi-key sorts (e.g., primary key price, secondary key timestamp).",
          "Space vs time: Highlight why merge sort is stable but allocates, while heap sort saves memory but reorders equals.",
          "Parallel sorting: Mention Array.ParallelSort (planned) or PLINQ + OrderBy trade-offs.",
          "Real-world usage: .NET uses introspective sort for arrays/lists; SQL Server uses variations of merge/hash sorts for query plans."
        ]
      },
      {
        "type": "text",
        "content": "Practice describing algorithm choices tailored to finance/trading data structures like order books and time-series snapshots."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorting Algorithms.md",
    "isSection": true,
    "id": "card-777"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: For tiny datasets or nearly sorted inputs (e.g., maintaining a small sorted window). It’s simple, cache-friendly, and used inside hybrid algorithms for small partitions."
      },
      {
        "type": "text",
        "content": "A: Poor pivot choices cause unbalanced partitions. .NET’s introsort switches from quicksort to heapsort when recursion depth exceeds a threshold, guaranteeing O(n log n)."
      },
      {
        "type": "text",
        "content": "A: It combines sorted halves without swapping equal elements out of order, preserving the original relative order—critical for multi-key sorts."
      },
      {
        "type": "text",
        "content": "A: When the key range (k) is small relative to n (e.g., rating 0-100). It runs in O(n+k) and is stable, making it ideal for bucketed enums or ASCII data."
      },
      {
        "type": "text",
        "content": "A: Heap sort is in-place with O(1) extra space but not stable. Merge sort is stable but needs O(n) auxiliary storage. Choose based on stability requirements vs memory constraints."
      },
      {
        "type": "text",
        "content": "A: Use a balanced tree (SortedDictionary, SortedSet) or a heap for top-k operations; for full snapshots, maintain sorted arrays and apply incremental updates with binary insertions."
      },
      {
        "type": "text",
        "content": "A: It processes digits (LSB or MSB) using counting sort per digit, achieving linear time for fixed-width integers. It’s stable and non-comparison-based."
      },
      {
        "type": "text",
        "content": "A: Average O(n) when inputs are uniformly distributed. Useful for hashing floats into buckets (e.g., histogram of trade sizes) before sorting within buckets."
      },
      {
        "type": "text",
        "content": "A: It preserves relative ordering of equal keys, allowing sequential sorting by secondary keys without losing primary-order guarantees."
      },
      {
        "type": "text",
        "content": "A: Split data into chunks, sort in parallel via Parallel.For or PLINQ, then merge. For huge arrays, consider Array.Sort for baseline and only parallelize when CPU resources justify the overhead."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorting Algorithms.md",
    "isSection": true,
    "id": "card-778"
  },
  {
    "question": "Comparison Sorts",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// In-place quicksort with Hoare partitioning\npublic static void QuickSort(Span<int> data)\n{\n    if (data.Length <= 1) return;\n    int i = 0, j = data.Length - 1;\n    var pivot = data[data.Length / 2];\n    while (i <= j)\n    {\n        while (data[i] < pivot) i++;\n        while (data[j] > pivot) j--;\n        if (i <= j)\n        {\n            (data[i], data[j]) = (data[j], data[i]);\n            i++; j--;\n        }\n    }\n    QuickSort(data[..(j + 1)]);\n    QuickSort(data[i..]);\n}",
        "codeType": "bad"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorting Algorithms.md",
    "isConcept": true,
    "id": "card-779"
  },
  {
    "question": "Non-Comparison Sorts",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public static int[] CountingSort(int[] source, int maxValue)\n{\n    var counts = new int[maxValue + 1];\n    foreach (var value in source)\n    {\n        counts[value]++;\n    }\n\n    var index = 0;\n    for (var value = 0; value < counts.Length; value++)\n    {\n        while (counts[value]-- > 0)\n        {\n            source[index++] = value;\n        }\n    }\n    return source;\n}",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/Sorting Algorithms.md",
    "isConcept": true,
    "id": "card-780"
  },
  {
    "question": "When should you choose a struct over a class?",
    "answer": [
      {
        "type": "text",
        "content": "When the data is small (≤16 bytes), immutable, frequently created, and benefits from value semantics. Structs reduce GC pressure by living inline and being collected with stack frames."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "id": "card-781"
  },
  {
    "question": "What pitfalls occur when structs are too large?",
    "answer": [
      {
        "type": "text",
        "content": "Copies become expensive, especially when passing by value. This can negate performance gains and increase stack usage. Use in/ref parameters or switch to classes if the struct grows."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "id": "card-782"
  },
  {
    "question": "How does boxing affect struct performance?",
    "answer": [
      {
        "type": "text",
        "content": "Boxing copies the struct onto the heap and allocates, defeating the GC benefits. Avoid passing structs to APIs expecting object or non-generic interfaces to prevent boxing."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "id": "card-783"
  },
  {
    "question": "Can structs have parameterless constructors?",
    "answer": [
      {
        "type": "text",
        "content": "Starting with C# 10, yes, but they must be public/private and initialize all fields. Historically, structs always had an implicit default constructor. Remember that every struct has a zeroed default state."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "id": "card-784"
  },
  {
    "question": "How do you prevent copying when passing structs to methods?",
    "answer": [
      {
        "type": "text",
        "content": "Use in (readonly ref) for read-only access, or ref/ref readonly when you need to mutate or avoid copies. This keeps performance predictable for larger structs."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "id": "card-785"
  },
  {
    "question": "Can structs inherit from classes?",
    "answer": [
      {
        "type": "text",
        "content": "No. Structs are sealed value types that inherit from ValueType. They can implement interfaces but cannot participate in class inheritance hierarchies."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "id": "card-786"
  },
  {
    "question": "When do structs hurt cache locality?",
    "answer": [
      {
        "type": "text",
        "content": "Rarely—they often improve locality. However, large structs embedded in arrays can cause cache misses due to size. Evaluate data layout to ensure structs remain lean."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "id": "card-787"
  },
  {
    "question": "How do you model optional structs?",
    "answer": [
      {
        "type": "text",
        "content": "Use Nullable<T> (Tick?). It wraps the struct with a HasValue flag, allowing null-like semantics without resorting to classes."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "id": "card-788"
  },
  {
    "question": "What about mutability?",
    "answer": [
      {
        "type": "text",
        "content": "Prefer immutable structs to avoid accidental copies followed by mutation. Mutable structs can lead to confusing bugs when copies diverge silently."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "id": "card-789"
  },
  {
    "question": "How do structs interact with pattern matching and deconstruction?",
    "answer": [
      {
        "type": "text",
        "content": "They support Deconstruct methods and pattern matching just like classes. This makes them ergonomic for lightweight domain data while still keeping value semantics."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "id": "card-790"
  },
  {
    "question": "🧠 Conceptual Summary",
    "answer": [
      {
        "type": "table",
        "headers": [
          "Feature",
          "struct",
          "class"
        ],
        "rows": [
          [
            "Type category",
            "Value type",
            "Reference type"
          ],
          [
            "Memory allocation",
            "Stored inline (stack, or inside another object)",
            "Stored on heap, referenced via pointer"
          ],
          [
            "Default behavior",
            "Copied by value (creates a full copy)",
            "Copied by reference (points to same object)"
          ],
          [
            "Nullability",
            "Cannot be null (unless Nullable<T>)",
            "Can be null"
          ],
          [
            "Inheritance",
            "Cannot inherit from another struct or class; only from ValueType",
            "Supports inheritance and polymorphism"
          ],
          [
            "Interfaces",
            "Can implement interfaces",
            "Can implement interfaces and base classes"
          ],
          [
            "Default constructor",
            "Cannot define a custom parameterless constructor (C# 10 adds limited support)",
            "Can freely define constructors"
          ],
          [
            "Finalizer / Destructor",
            "Not supported",
            "Supported"
          ],
          [
            "GC behavior",
            "Usually short-lived, reclaimed when out of scope",
            "Managed by the Garbage Collector"
          ],
          [
            "Boxing / Unboxing",
            "Converting to/from object/interface causes allocation",
            "No boxing/unboxing issues"
          ],
          [
            "Thread safety",
            "Safer for small immutable data",
            "Reference types require synchronization if shared"
          ]
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "isSection": true,
    "id": "card-791"
  },
  {
    "question": "🧩 struct",
    "answer": [
      {
        "type": "list",
        "items": [
          "Lives inline — if it’s a local variable, it’s on the stack; if it’s a field in another object, it’s inside that object’s memory layout.",
          "When passed to a method, a full copy is made (unless passed by ref or in).",
          "Ideal for small, immutable, lightweight data — e.g., coordinates, ticks, prices, GUIDs."
        ]
      },
      {
        "type": "text",
        "content": "Example:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "struct Point\n{\n    public int X;\n    public int Y;\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Each Point lives inline — no GC pressure."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "isSection": true,
    "id": "card-792"
  },
  {
    "question": "🧩 class",
    "answer": [
      {
        "type": "list",
        "items": [
          "Lives on the managed heap. Variables hold a reference (pointer) to the actual object.",
          "Passed around by reference, so multiple variables can point to the same instance.",
          "Managed by the Garbage Collector."
        ]
      },
      {
        "type": "text",
        "content": "Example:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "class Order\n{\n    public string Symbol { get; set; }\n    public double Price { get; set; }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Each Order allocation hits the heap and is tracked by the GC."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "isSection": true,
    "id": "card-793"
  },
  {
    "question": "✅ When to use struct",
    "answer": [
      {
        "type": "text",
        "content": "Use when:"
      },
      {
        "type": "list",
        "items": [
          "The object is small (≤ 16 bytes typically).",
          "It’s immutable.",
          "You’ll create many of them (e.g., millions per second) and want no GC overhead.",
          "Value semantics make sense (copying creates independence)."
        ]
      },
      {
        "type": "text",
        "content": "Example (trading context):"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "readonly struct Tick\n{\n    public string Symbol { get; }\n    public double Bid { get; }\n    public double Ask { get; }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Each Tick represents an immutable market data point. Perfect as a struct."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "isSection": true,
    "id": "card-794"
  },
  {
    "question": "🚫 When NOT to use struct",
    "answer": [
      {
        "type": "text",
        "content": "Avoid when:"
      },
      {
        "type": "list",
        "items": [
          "It’s large (lots of fields) → copying becomes expensive.",
          "You need polymorphism, inheritance, or shared references.",
          "You mutate the same instance in multiple places."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "isSection": true,
    "id": "card-795"
  },
  {
    "question": "⚠️ Boxing and Hidden Allocations",
    "answer": [
      {
        "type": "text",
        "content": "When a struct is treated as an object or cast to an interface, it gets boxed — copied onto the heap."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "struct Point { public int X, Y; }\n\nobject obj = new Point(); // BOXED: allocates on heap\nPoint p = (Point)obj;     // UNBOXED: copy back to stack",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "So: value types are not automatically zero-GC — you must use them carefully."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "isSection": true,
    "id": "card-796"
  },
  {
    "question": "🧩 Real-World Example (HFM context)",
    "answer": [
      {
        "type": "text",
        "content": "If you’re processing millions of tick messages per second:"
      },
      {
        "type": "list",
        "items": [
          "Use a struct (or readonly struct) for individual ticks (lightweight, immutable).",
          "Use a class for services and entities that manage state, like OrderBook, TradeSession, or CacheManager."
        ]
      },
      {
        "type": "text",
        "content": "Example:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "readonly struct Tick\n{\n    public string Symbol { get; init; }\n    public double Bid { get; init; }\n    public double Ask { get; init; }\n}\n\nclass PriceFeedProcessor\n{\n    private readonly List<Tick> _ticks = new();\n\n    public void OnTick(Tick tick) => _ticks.Add(tick);\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "isSection": true,
    "id": "card-797"
  },
  {
    "question": "🧩 Memory Visualization",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "Stack:\n ├─ Tick t1 { X=1, Y=2 }   (struct: inline)\n ├─ Tick t2 = t1 (copied!)\n └─ Order ref ─┐\n               ▼\nHeap:\n └─ { Symbol=\"EURUSD\", Price=1.0734 }  (class: heap object)",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "isSection": true,
    "id": "card-798"
  },
  {
    "question": "🎯 Senior-level 20-second summary (how to answer in interview)",
    "answer": [
      {
        "type": "text",
        "content": "> “A struct is a value type, stored inline and copied by value — great for small, immutable data and reducing GC pressure."
      },
      {
        "type": "text",
        "content": "> A class is a reference type, stored on the heap, supporting inheritance and polymorphism."
      },
      {
        "type": "text",
        "content": "> Structs avoid GC but can cost more to copy if large, and boxing them defeats their advantage."
      },
      {
        "type": "text",
        "content": "> In low-latency systems, we often use small structs like Tick or Point to keep memory tight and predictable.”"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "isSection": true,
    "id": "card-799"
  },
  {
    "question": "1️⃣ Basic memory layout",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "┌──────────────────────────────┐\n│          Stack               │\n│ ┌─────────────────────────┐  │\n│ │ int x = 10;             │  │\n│ │ Point p = {X=1,Y=2};    │  │  ← Struct (value type)\n│ └─────────────────────────┘  │\n│   (lives inline here)        │\n│                              │\n│ ┌─────────────────────────┐  │\n│ │ Order o ────────────────┼──┼──► Heap\n│ └─────────────────────────┘  │\n└──────────────────────────────┘\n\n┌──────────────────────────────┐\n│           Heap               │\n│ ┌─────────────────────────┐  │\n│ │ Order { Id=1, Price=99 }│  │  ← Class (reference type)\n│ └─────────────────────────┘  │\n└──────────────────────────────┘",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Explanation:"
      },
      {
        "type": "list",
        "items": [
          "Struct (Point) is stored directly on the stack or inline within another object.",
          "Class (Order) is stored on the heap; variables on the stack hold a reference (pointer) to it."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "isSection": true,
    "id": "card-800"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: When the data is small (≤16 bytes), immutable, frequently created, and benefits from value semantics. Structs reduce GC pressure by living inline and being collected with stack frames."
      },
      {
        "type": "text",
        "content": "A: Copies become expensive, especially when passing by value. This can negate performance gains and increase stack usage. Use in/ref parameters or switch to classes if the struct grows."
      },
      {
        "type": "text",
        "content": "A: Boxing copies the struct onto the heap and allocates, defeating the GC benefits. Avoid passing structs to APIs expecting object or non-generic interfaces to prevent boxing."
      },
      {
        "type": "text",
        "content": "A: Starting with C# 10, yes, but they must be public/private and initialize all fields. Historically, structs always had an implicit default constructor. Remember that every struct has a zeroed default state."
      },
      {
        "type": "text",
        "content": "A: Use in (readonly ref) for read-only access, or ref/ref readonly when you need to mutate or avoid copies. This keeps performance predictable for larger structs."
      },
      {
        "type": "text",
        "content": "A: No. Structs are sealed value types that inherit from ValueType. They can implement interfaces but cannot participate in class inheritance hierarchies."
      },
      {
        "type": "text",
        "content": "A: Rarely—they often improve locality. However, large structs embedded in arrays can cause cache misses due to size. Evaluate data layout to ensure structs remain lean."
      },
      {
        "type": "text",
        "content": "A: Use Nullable<T> (Tick?). It wraps the struct with a HasValue flag, allowing null-like semantics without resorting to classes."
      },
      {
        "type": "text",
        "content": "A: Prefer immutable structs to avoid accidental copies followed by mutation. Mutable structs can lead to confusing bugs when copies diverge silently."
      },
      {
        "type": "text",
        "content": "A: They support Deconstruct methods and pattern matching just like classes. This makes them ergonomic for lightweight domain data while still keeping value semantics."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "isSection": true,
    "id": "card-801"
  },
  {
    "question": "✅ Struct (value type)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "Point a = new Point { X = 1, Y = 2 };\nPoint b = a;    // copy!\nb.X = 99;\nConsole.WriteLine(a.X); // 1 (a unaffected)",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Memory:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "Stack:\n a { X=1, Y=2 }\n b { X=99, Y=2 }   ← completely separate copy",
        "codeType": "neutral"
      },
      {
        "type": "list",
        "items": [
          "Structs are copied by value.",
          "Each variable has its own independent copy.",
          "No heap allocation → no GC pressure."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "isSection": true,
    "id": "card-802"
  },
  {
    "question": "✅ Class (reference type)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "Order o1 = new Order { Id = 1, Price = 99 };\nOrder o2 = o1;  // copy reference!\no2.Price = 120;\nConsole.WriteLine(o1.Price); // 120",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Memory:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "Stack:\n o1 ─┐\n o2 ─┘──► Heap: { Id=1, Price=120 }",
        "codeType": "neutral"
      },
      {
        "type": "list",
        "items": [
          "Classes are copied by reference — both variables point to the same heap object.",
          "Modifying one affects the other."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "isSection": true,
    "id": "card-803"
  },
  {
    "question": "3️⃣ Struct inside a class (inline layout)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "class Trade\n{\n    public string Symbol;\n    public Point Position;\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Memory:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "Heap: Trade\n ├─ Symbol → \"EURUSD\"   (heap reference)\n └─ Position { X=10, Y=20 }  (inline in Trade object)",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Insight:"
      },
      {
        "type": "text",
        "content": "Even though the struct is inside a class (on heap), its fields are embedded inline — not separate allocations."
      },
      {
        "type": "text",
        "content": "This reduces pointer indirection and helps cache locality."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "isSection": true,
    "id": "card-804"
  },
  {
    "question": "4️⃣ Passing to methods",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "void Move(Point p) { p.X += 10; } // copy!\nvoid MoveRef(ref Point p) { p.X += 10; } // modifies original",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Memory visualization:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "By value (copy):\n Caller: a { X=1 }\n Method: p { X=1 } → modified to X=11 (copy destroyed)\n\nBy ref:\n Caller: a { X=1 }\n Method: p ─┐\n             └─ modifies same memory → X=11 persists",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "💡 Interview tip:"
      },
      {
        "type": "text",
        "content": "> “Structs are copied on method calls unless passed by ref or in."
      },
      {
        "type": "text",
        "content": "> Large structs should be passed by in to avoid copy overhead — especially in tight loops or latency-critical code.”"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "isSection": true,
    "id": "card-805"
  },
  {
    "question": "5️⃣ Heap fragmentation and GC difference",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "Structs:\n[Stack]\n[Stack frame destroyed → data gone instantly]\n→ No GC involvement.\n\nClasses:\n[Heap]\n[Objects live until unreachable]\n→ GC scans and collects them (Gen0→Gen1→Gen2)",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Key insight:"
      },
      {
        "type": "list",
        "items": [
          "Structs vanish when they go out of scope → predictable lifetime.",
          "Classes depend on GC cycles → non-deterministic reclamation.",
          "Overusing classes in a high-frequency path (like market ticks) causes GC churn and pauses."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "isSection": true,
    "id": "card-806"
  },
  {
    "question": "6️⃣ ⚙️ Summary Diagram",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "STRUCT (Value Type)\n ┌──────────────┐\n │ Inline Data  │\n ├──────────────┤\n │ Copied on =  │\n ├──────────────┤\n │ No GC        │\n ├──────────────┤\n │ Pass by ref  │\n └──────────────┘\n     ↓\n  Great for small immutable data\n\nCLASS (Reference Type)\n ┌──────────────┐\n │ Heap Object  │\n ├──────────────┤\n │ Copied ref   │\n ├──────────────┤\n │ Managed by GC│\n ├──────────────┤\n │ Supports OOP │\n └──────────────┘\n     ↓\n  Great for shared mutable state",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "isSection": true,
    "id": "card-807"
  },
  {
    "question": "🧠 Quick “whiteboard pitch” for your interview",
    "answer": [
      {
        "type": "text",
        "content": "> “Structs are value types — stored inline, copied by value, no GC involvement, ideal for small immutable data like ticks or coordinates."
      },
      {
        "type": "text",
        "content": "> Classes are reference types — heap-allocated, reference-based, and managed by GC."
      },
      {
        "type": "text",
        "content": "> I use structs where I want predictable lifetimes and zero allocations; classes when I need shared, long-lived state or polymorphism.”"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "isSection": true,
    "id": "card-808"
  },
  {
    "question": "2️⃣ Assignment behavior",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "Point a = new Point { X = 1, Y = 2 };\nPoint b = a;    // copy!\nb.X = 99;\nConsole.WriteLine(a.X); // 1 (a unaffected)",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "isConcept": true,
    "id": "card-809"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "Order o1 = new Order { Id = 1, Price = 99 };\nOrder o2 = o1;  // copy reference!\no2.Price = 120;\nConsole.WriteLine(o1.Price); // 120",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/struct vs class when to use which.md",
    "isConcept": true,
    "id": "card-810"
  },
  {
    "question": "When do you use record vs class?",
    "answer": [
      {
        "type": "text",
        "content": "Use records when you want concise immutable data carriers with value-based equality (DTOs, events). Use classes when identity/lifecycle matters or when you need mutable state and inheritance."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/types.md",
    "id": "card-811"
  },
  {
    "question": "What’s the benefit of record struct?",
    "answer": [
      {
        "type": "text",
        "content": "It combines value semantics (no heap allocation) with generated equality/with expressions. Ideal for small immutable value objects where structural equality is desired."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/types.md",
    "id": "card-812"
  },
  {
    "question": "Why avoid large structs?",
    "answer": [
      {
        "type": "text",
        "content": "Copying them is expensive and negates GC benefits. Keep structs small (≤16 bytes) or pass by in/ref to avoid copies."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/types.md",
    "id": "card-813"
  },
  {
    "question": "When do you choose static classes?",
    "answer": [
      {
        "type": "text",
        "content": "For stateless helpers or extension method containers. Avoid static mutable state because it’s effectively global and complicates testing/threading."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/types.md",
    "id": "card-814"
  },
  {
    "question": "How do record equality semantics work?",
    "answer": [
      {
        "type": "text",
        "content": "Records implement value-based equality by comparing declared properties/fields. Classes use reference equality unless you override Equals/GetHashCode."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/types.md",
    "id": "card-815"
  },
  {
    "question": "Can records be mutable?",
    "answer": [
      {
        "type": "text",
        "content": "Yes, but it defeats their primary benefit. Prefer init-only setters or positional parameters to keep them immutable and safe across threads."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/types.md",
    "id": "card-816"
  },
  {
    "question": "When does record inheritance make sense?",
    "answer": [
      {
        "type": "text",
        "content": "When modeling hierarchies of immutable data (e.g., different message types). Remember records default to value equality, so ensure derived records add properties carefully."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/types.md",
    "id": "card-817"
  },
  {
    "question": "When should you convert a record to a class?",
    "answer": [
      {
        "type": "text",
        "content": "If you need identity semantics, lazy-loaded navigation properties (e.g., EF proxies), or mutable behavior beyond data transfer."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/types.md",
    "id": "card-818"
  },
  {
    "question": "How do you select between struct and record struct?",
    "answer": [
      {
        "type": "text",
        "content": "If you need value semantics plus generated equality/with, use record struct. If you want full control over equality/toString, a regular struct might suffice."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/types.md",
    "id": "card-819"
  },
  {
    "question": "How do type choices impact serialization?",
    "answer": [
      {
        "type": "text",
        "content": "Many serializers support classes/records out of the box. Structs serialize fine but be mindful of default values and boxing when using polymorphic serialization."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/types.md",
    "id": "card-820"
  },
  {
    "question": "Type Choices — class, record, struct, static (where & why)",
    "answer": [
      {
        "type": "text",
        "content": "Choosing the right kind of type affects memory layout, equality semantics, mutability, and API contracts. Use these rules of thumb when designing models and DTOs:"
      },
      {
        "type": "list",
        "items": [
          "class (reference type):",
          "Use for objects with identity, lifecycle, or potentially large mutable state (e.g., domain entities, services).",
          "Instances are allocated on the heap; assignments copy references, not state.",
          "Good when you want shared mutable state or polymorphism (virtual methods, inheritance).",
          "Example: public class Order { public int Id; public decimal Amount; }"
        ]
      },
      {
        "type": "list",
        "items": [
          "struct (value type):",
          "Use for small, immutable, copy-by-value types that represent a single value (e.g., Price, Coordinate).",
          "Avoid large structs (copying cost) or mutable structs (surprising semantics when boxed or assigned).",
          "Prefer readonly struct for immutable value semantics.",
          "Example: public readonly struct Price { public decimal Amount { get; } }"
        ]
      },
      {
        "type": "list",
        "items": [
          "record (reference-record, C# 9+):",
          "Use when you want concise immutable data carriers with value-based equality and non-destructive mutation (with expressions).",
          "Ideal for DTOs, messages, and snapshots where equality by content is helpful.",
          "Records are reference types by default (there is also record struct for value semantics).",
          "Example: public record OrderDto(int Id, string Symbol, decimal Amount);"
        ]
      },
      {
        "type": "list",
        "items": [
          "record struct (C# 10+):",
          "Combines record conveniences (auto equality, with) with value-type semantics — useful for small immutable value objects where structural equality is desired."
        ]
      },
      {
        "type": "list",
        "items": [
          "static classes / members:",
          "Use static classes for stateless helpers, extension method containers, and singletons without state.",
          "static members belong to the type rather than instances; no instantiation possible.",
          "Be cautious: static mutable state is effectively global and introduces thread-safety concerns.",
          "Example: public static class Email { public static void Send(...) { ... } }"
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/types.md",
    "isSection": true,
    "id": "card-821"
  },
  {
    "question": "Practical guidance & trade-offs",
    "answer": [
      {
        "type": "list",
        "items": [
          "Prefer record for DTOs and immutable data transfer where content equality is useful.",
          "Prefer class for domain entities that have an identity (database ID) and lifecycle; they usually need to be mutable or proxied by ORMs.",
          "Use struct/record struct for very small value objects (e.g., PriceTick, Timestamp) to avoid heap allocation when copying is cheap.",
          "Favour immutability for simple data carriers — it reduces shared-state bugs and simplifies reasoning, especially across threads.",
          "Avoid mutable singletons or static mutable fields; prefer injected, testable services with clear lifetimes."
        ]
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/types.md",
    "isSection": true,
    "id": "card-822"
  },
  {
    "question": "Quick examples",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// record for DTO\npublic record OrderDto(int Id, string Symbol, decimal Amount);\n\n// class for entity\npublic class Order\n{\n    public int Id { get; set; }\n    public decimal Amount { get; set; }\n}\n\n// small readonly struct for value\npublic readonly struct PriceTick\n{\n    public decimal Bid { get; }\n    public decimal Ask { get; }\n    public PriceTick(decimal bid, decimal ask) => (Bid, Ask) = (bid, ask);\n}\n\n// static helper\npublic static class MathHelpers { public static decimal RoundPrice(decimal p) => Math.Round(p, 5); }",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "If you'd like, I can link this file from core-concepts.md and/or expand it with interview bullet points for quick review."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/types.md",
    "isSection": true,
    "id": "card-823"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: Use records when you want concise immutable data carriers with value-based equality (DTOs, events). Use classes when identity/lifecycle matters or when you need mutable state and inheritance."
      },
      {
        "type": "text",
        "content": "A: It combines value semantics (no heap allocation) with generated equality/with expressions. Ideal for small immutable value objects where structural equality is desired."
      },
      {
        "type": "text",
        "content": "A: Copying them is expensive and negates GC benefits. Keep structs small (≤16 bytes) or pass by in/ref to avoid copies."
      },
      {
        "type": "text",
        "content": "A: For stateless helpers or extension method containers. Avoid static mutable state because it’s effectively global and complicates testing/threading."
      },
      {
        "type": "text",
        "content": "A: Records implement value-based equality by comparing declared properties/fields. Classes use reference equality unless you override Equals/GetHashCode."
      },
      {
        "type": "text",
        "content": "A: Yes, but it defeats their primary benefit. Prefer init-only setters or positional parameters to keep them immutable and safe across threads."
      },
      {
        "type": "text",
        "content": "A: When modeling hierarchies of immutable data (e.g., different message types). Remember records default to value equality, so ensure derived records add properties carefully."
      },
      {
        "type": "text",
        "content": "A: If you need identity semantics, lazy-loaded navigation properties (e.g., EF proxies), or mutable behavior beyond data transfer."
      },
      {
        "type": "text",
        "content": "A: If you need value semantics plus generated equality/with, use record struct. If you want full control over equality/toString, a regular struct might suffice."
      },
      {
        "type": "text",
        "content": "A: Many serializers support classes/records out of the box. Structs serialize fine but be mindful of default values and boxing when using polymorphic serialization."
      }
    ],
    "category": "notes",
    "topic": "sub-notes",
    "source": "notes/sub-notes/types.md",
    "isSection": true,
    "id": "card-824"
  },
  {
    "question": "How do you prevent performance regressions from slipping through unit tests?",
    "answer": [
      {
        "type": "text",
        "content": "Keep micro-benchmarks in BenchmarkDotNet projects, but add lightweight latency guards to hot-path unit tests (e.g., ShouldBeLessThan on critical methods) and fail builds on meaningful percentile shifts in CI metrics exports. Use deterministic data builders to avoid noisy allocations that mask regressions."
      }
    ],
    "category": "notes",
    "topic": "testing-strategies.md",
    "source": "notes/testing-strategies.md",
    "id": "card-825"
  },
  {
    "question": "What is your approach to testing high-availability scenarios in integration tests?",
    "answer": [
      {
        "type": "text",
        "content": "Exercise failure modes intentionally: kill containers, drop network connections, or poison queue messages using Testcontainers hooks. Assert that retries, circuit breakers, and bulkheads recover within error budgets, and verify observability signals (logs/metrics/traces) show the expected degradation and recovery steps."
      }
    ],
    "category": "notes",
    "topic": "testing-strategies.md",
    "source": "notes/testing-strategies.md",
    "id": "card-826"
  },
  {
    "question": "How do you keep integration tests parallelizable without flakiness?",
    "answer": [
      {
        "type": "text",
        "content": "Use unique resource identifiers (database names, queue topics, blob prefixes) per test run, isolate shared state through fixtures, and ensure teardown cleans resources. Mark collection fixtures to avoid serial bottlenecks and rely on containerized dependencies to avoid cross-test interference."
      }
    ],
    "category": "notes",
    "topic": "testing-strategies.md",
    "source": "notes/testing-strategies.md",
    "id": "card-827"
  },
  {
    "question": "When is it appropriate to include chaos testing in CI?",
    "answer": [
      {
        "type": "text",
        "content": "Run minimal chaos probes (like restarting a dependency once) on main-branch merges to catch regressions early, but reserve heavier scenarios (multi-node failovers, prolonged network partitions) for nightly or pre-release pipelines to balance feedback speed with stability."
      }
    ],
    "category": "notes",
    "topic": "testing-strategies.md",
    "source": "notes/testing-strategies.md",
    "id": "card-828"
  },
  {
    "question": "How do you validate observability instrumentation through tests?",
    "answer": [
      {
        "type": "text",
        "content": "Attach in-memory exporters for OpenTelemetry during integration tests, trigger key user journeys, and assert on emitted spans/metrics/logs (names, attributes, and error flags). This ensures dashboards and alerts stay trustworthy without requiring external telemetry backends."
      }
    ],
    "category": "notes",
    "topic": "testing-strategies.md",
    "source": "notes/testing-strategies.md",
    "id": "card-829"
  },
  {
    "question": "How do you keep the test pyramid healthy for high-performance services?",
    "answer": [
      {
        "type": "text",
        "content": "Push most coverage into deterministic unit tests, use focused integration tests for DI/middleware/wiring, and reserve a handful of end-to-end tests for golden paths. That keeps feedback fast while still exercising resilience features like retries and telemetry in realistic environments."
      }
    ],
    "category": "notes",
    "topic": "testing-strategies.md",
    "source": "notes/testing-strategies.md",
    "id": "card-830"
  },
  {
    "question": "Where do contract tests fit into your integration strategy?",
    "answer": [
      {
        "type": "text",
        "content": "Use consumer-driven contract tests for HTTP/gRPC/messaging boundaries. They validate payload shapes and behavior without spinning up the entire dependency graph, giving you rapid feedback whenever a producer changes schemas or status codes."
      }
    ],
    "category": "notes",
    "topic": "testing-strategies.md",
    "source": "notes/testing-strategies.md",
    "id": "card-831"
  },
  {
    "question": "How do you keep test data realistic without becoming brittle?",
    "answer": [
      {
        "type": "text",
        "content": "Centralize builders/AutoFixture customizations so payload size/shape mirrors production, randomize optional fields to catch null-handling bugs, and snapshot baseline objects when you need explicit comparisons. Builders live next to the domain so updates ripple automatically."
      }
    ],
    "category": "notes",
    "topic": "testing-strategies.md",
    "source": "notes/testing-strategies.md",
    "id": "card-832"
  },
  {
    "question": "How do you enforce deterministic time and randomness in tests?",
    "answer": [
      {
        "type": "text",
        "content": "Abstract clock/random dependencies (ISystemClock, deterministic Random seeds) and inject test doubles that you can fast-forward. Avoid DateTime.UtcNow or Guid.NewGuid() inside tests; use deterministic sequences so assertions stay stable and failures are reproducible."
      }
    ],
    "category": "notes",
    "topic": "testing-strategies.md",
    "source": "notes/testing-strategies.md",
    "id": "card-833"
  },
  {
    "question": "What’s your CI strategy for mixing fast and slow test suites?",
    "answer": [
      {
        "type": "text",
        "content": "Run unit tests + lightweight integration tests on every PR to keep cycle times low. Schedule heavier suites (full container stacks, chaos scenarios, long-running benchmarks) nightly or before releases, and promote artifacts/logs to speed triage when they fail."
      }
    ],
    "category": "notes",
    "topic": "testing-strategies.md",
    "source": "notes/testing-strategies.md",
    "id": "card-834"
  },
  {
    "question": "Unit Tests",
    "answer": [
      {
        "type": "list",
        "items": [
          "Purpose: Validate a single class/function in isolation with deterministic inputs/outputs.",
          "Isolation:",
          "Mock external dependencies (I/O, network, time) with interfaces and test doubles.",
          "Use in-memory fakes for lightweight state (e.g., InMemoryRepository) but prefer mocks for behavior verification.",
          "Patterns:",
          "Arrange-Act-Assert (AAA): Make the phases explicit; minimize setup repetition with builders/AutoFixture.",
          "Given-When-Then naming: GivenHealthyAccount_WhenWithdraw_ThenBalanceUpdated for intent clarity.",
          "Table-driven tests: Iterate over scenarios via Theory/InlineData in xUnit to keep cases compact.",
          "xUnit + Moq + Shouldly example: `csharp public class BalanceServiceTests { private readonly Mock<IAccountStore> _store = new(); private readonly BalanceService _sut;"
        ]
      },
      {
        "type": "text",
        "content": "public BalanceServiceTests()"
      },
      {
        "type": "text",
        "content": "{"
      },
      {
        "type": "text",
        "content": "_sut = new BalanceService(_store.Object);"
      },
      {
        "type": "text",
        "content": "}"
      },
      {
        "type": "text",
        "content": "[Theory]"
      },
      {
        "type": "text",
        "content": "[InlineData(100, 40, 60)]"
      },
      {
        "type": "text",
        "content": "[InlineData(50, 25, 25)]"
      },
      {
        "type": "text",
        "content": "public async Task GivenBalance_WhenWithdraw_ThenBalanceUpdated(decimal starting, decimal debit, decimal expected)"
      },
      {
        "type": "text",
        "content": "{"
      },
      {
        "type": "text",
        "content": "// Arrange"
      },
      {
        "type": "text",
        "content": "_store.Setup(s => s.GetAsync(\"id\", It.IsAny<CancellationToken>()))"
      },
      {
        "type": "text",
        "content": ".ReturnsAsync(new Account(\"id\", starting));"
      },
      {
        "type": "text",
        "content": "// Act"
      },
      {
        "type": "text",
        "content": "await _sut.WithdrawAsync(\"id\", debit, CancellationToken.None);"
      },
      {
        "type": "text",
        "content": "// Assert"
      },
      {
        "type": "text",
        "content": "_store.Verify(s => s.SaveAsync(It.Is<Account>(a => a.Balance == expected), It.IsAny<CancellationToken>()));"
      },
      {
        "type": "text",
        "content": "_sut.LastLatencyMs.ShouldBeLessThan(5); // Cheap guardrail for perf-sensitive code paths"
      },
      {
        "type": "text",
        "content": "}"
      },
      {
        "type": "text",
        "content": "}"
      },
      {
        "type": "text",
        "content": "`"
      },
      {
        "type": "list",
        "items": [
          "Performance-aware design:",
          "Avoid sleeping; use TestScheduler/ManualResetEventSlim for timing-sensitive logic.",
          "Keep allocations predictable—reuse fixture data/builders instead of newing objects per assertion.",
          "Target micro-benchmarks separately with BenchmarkDotNet rather than overloading unit tests.",
          "Reliability:",
          "No hidden global state; reset static caches/singletons between runs.",
          "Keep unit tests idempotent and order-independent."
        ]
      }
    ],
    "category": "notes",
    "topic": "testing-strategies.md",
    "source": "notes/testing-strategies.md",
    "isSection": true,
    "id": "card-835"
  },
  {
    "question": "Integration Tests",
    "answer": [
      {
        "type": "list",
        "items": [
          "Purpose: Validate real wiring: DI container, middleware, persistence, messaging, and observability hooks.",
          "Environment strategy:",
          "Run against ephemeral infra (Testcontainers/Docker Compose) with realistic versions of databases/queues.",
          "Seed data via migrations + fixtures; tear down cleanly to avoid cross-test coupling.",
          "Use unique resource names (DB names, queues) per test run to enable parallel execution.",
          "Patterns:",
          "WebApplicationFactory/MinimalApiFactory: Spin up APIs in-memory with production middleware, swapping only endpoints you must stub (e.g., external HTTP clients).",
          "Contract tests: Validate message schemas and HTTP contracts against consumer/provider expectations.",
          "Idempotency checks: Re-run the same operation twice and assert consistent results to mirror at-least-once delivery.",
          "Minimal integration test example (xUnit + WebApplicationFactory + Shouldly): `csharp public class HealthEndpointTests : IClassFixture<WebApplicationFactory<Program>> { private readonly HttpClient _client;"
        ]
      },
      {
        "type": "text",
        "content": "public HealthEndpointTests(WebApplicationFactory<Program> factory)"
      },
      {
        "type": "text",
        "content": "{"
      },
      {
        "type": "text",
        "content": "_client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });"
      },
      {
        "type": "text",
        "content": "}"
      },
      {
        "type": "text",
        "content": "[Fact]"
      },
      {
        "type": "text",
        "content": "public async Task GetHealth_ReturnsOkAndBudgetedLatency()"
      },
      {
        "type": "text",
        "content": "{"
      },
      {
        "type": "text",
        "content": "var stopwatch = ValueStopwatch.StartNew();"
      },
      {
        "type": "text",
        "content": "var response = await _client.GetAsync(\"/health\");"
      },
      {
        "type": "text",
        "content": "var elapsedMs = stopwatch.GetElapsedTime().TotalMilliseconds;"
      },
      {
        "type": "text",
        "content": "response.StatusCode.ShouldBe(HttpStatusCode.OK);"
      },
      {
        "type": "text",
        "content": "elapsedMs.ShouldBeLessThan(50, \"health endpoints must stay fast to avoid liveness probe churn\");"
      },
      {
        "type": "text",
        "content": "}"
      },
      {
        "type": "text",
        "content": "}"
      },
      {
        "type": "text",
        "content": "`"
      },
      {
        "type": "list",
        "items": [
          "Performance & HA focus:",
          "Assert on latency budgets (e.g., middleware response times) with histogram/percentile metrics exposed in tests.",
          "Simulate failure modes: kill containers, drop network, poison queue messages, exhaust connection pools—verify graceful degradation and recovery.",
          "Validate circuit breakers, bulkheads, and timeouts are configured with realistic thresholds."
        ]
      }
    ],
    "category": "notes",
    "topic": "testing-strategies.md",
    "source": "notes/testing-strategies.md",
    "isSection": true,
    "id": "card-836"
  },
  {
    "question": "Cross-Cutting Testing Practices",
    "answer": [
      {
        "type": "list",
        "items": [
          "Test data discipline: Centralize builders/fixtures to avoid duplication and to make hot-path payloads realistic (size, shape, field optionality).",
          "Observability hooks: Assert logs/metrics/traces for key scenarios (success, validation errors, retries). Use in-memory exporters for OpenTelemetry.",
          "Deterministic time & randomness: Inject clocks/Random seeds; freeze time in tests to avoid flakiness.",
          "Parallelism: Mark tests Collection-safe; isolate shared resources to allow high-concurrency runs in CI without interference.",
          "CI pipeline:",
          "Run unit tests fast on every push; gate integration/system tests on main merge or nightly.",
          "Capture artifacts (logs, coverage, traces) to speed triage when failures occur.",
          "Coverage mindset: Optimize for risk: critical paths (auth, payments, risk controls), failure handling, and regression-prone areas get deeper coverage."
        ]
      }
    ],
    "category": "notes",
    "topic": "testing-strategies.md",
    "source": "notes/testing-strategies.md",
    "isSection": true,
    "id": "card-837"
  },
  {
    "question": "When Discussing in an Interview",
    "answer": [
      {
        "type": "list",
        "items": [
          "Narrative: Outline pyramid strategy—fast unit tests, targeted integration, and a few end-to-end paths covering the golden user journeys.",
          "Performance posture: Emphasize how tests enforce latency/error budgets and protect against resource exhaustion (threads, sockets, DB connections).",
          "Availability posture: Highlight chaos/failover scenarios you automate (leader election, connection drop, retry storms) and how you keep tests isolated and repeatable.",
          "Tooling: Mention xUnit, AutoFixture/FluentAssertions for clarity; Testcontainers/Docker Compose for realistic environments; Polly + OpenTelemetry assertions for resilience."
        ]
      }
    ],
    "category": "notes",
    "topic": "testing-strategies.md",
    "source": "notes/testing-strategies.md",
    "isSection": true,
    "id": "card-838"
  },
  {
    "question": "Questions & Answers",
    "answer": [
      {
        "type": "text",
        "content": "A: Keep micro-benchmarks in BenchmarkDotNet projects, but add lightweight latency guards to hot-path unit tests (e.g., ShouldBeLessThan on critical methods) and fail builds on meaningful percentile shifts in CI metrics exports. Use deterministic data builders to avoid noisy allocations that mask regressions."
      },
      {
        "type": "text",
        "content": "A: Exercise failure modes intentionally: kill containers, drop network connections, or poison queue messages using Testcontainers hooks. Assert that retries, circuit breakers, and bulkheads recover within error budgets, and verify observability signals (logs/metrics/traces) show the expected degradation and recovery steps."
      },
      {
        "type": "text",
        "content": "A: Use unique resource identifiers (database names, queue topics, blob prefixes) per test run, isolate shared state through fixtures, and ensure teardown cleans resources. Mark collection fixtures to avoid serial bottlenecks and rely on containerized dependencies to avoid cross-test interference."
      },
      {
        "type": "text",
        "content": "A: Run minimal chaos probes (like restarting a dependency once) on main-branch merges to catch regressions early, but reserve heavier scenarios (multi-node failovers, prolonged network partitions) for nightly or pre-release pipelines to balance feedback speed with stability."
      },
      {
        "type": "text",
        "content": "A: Attach in-memory exporters for OpenTelemetry during integration tests, trigger key user journeys, and assert on emitted spans/metrics/logs (names, attributes, and error flags). This ensures dashboards and alerts stay trustworthy without requiring external telemetry backends."
      },
      {
        "type": "text",
        "content": "A: Push most coverage into deterministic unit tests, use focused integration tests for DI/middleware/wiring, and reserve a handful of end-to-end tests for golden paths. That keeps feedback fast while still exercising resilience features like retries and telemetry in realistic environments."
      },
      {
        "type": "text",
        "content": "A: Use consumer-driven contract tests for HTTP/gRPC/messaging boundaries. They validate payload shapes and behavior without spinning up the entire dependency graph, giving you rapid feedback whenever a producer changes schemas or status codes."
      },
      {
        "type": "text",
        "content": "A: Centralize builders/AutoFixture customizations so payload size/shape mirrors production, randomize optional fields to catch null-handling bugs, and snapshot baseline objects when you need explicit comparisons. Builders live next to the domain so updates ripple automatically."
      },
      {
        "type": "text",
        "content": "A: Abstract clock/random dependencies (ISystemClock, deterministic Random seeds) and inject test doubles that you can fast-forward. Avoid DateTime.UtcNow or Guid.NewGuid() inside tests; use deterministic sequences so assertions stay stable and failures are reproducible."
      },
      {
        "type": "text",
        "content": "A: Run unit tests + lightweight integration tests on every PR to keep cycle times low. Schedule heavier suites (full container stacks, chaos scenarios, long-running benchmarks) nightly or before releases, and promote artifacts/logs to speed triage when they fail."
      }
    ],
    "category": "notes",
    "topic": "testing-strategies.md",
    "source": "notes/testing-strategies.md",
    "isSection": true,
    "id": "card-839"
  },
  {
    "question": "Why This Matters at Scale",
    "answer": [
      {
        "type": "text",
        "content": "When handling millions of requests, threads are your most precious resource. Blocking a thread while waiting for I/O (database query, HTTP call, file read) means that thread can't process other requests. With only hundreds of threads available, you'll hit a wall fast."
      },
      {
        "type": "text",
        "content": "The Math:"
      },
      {
        "type": "list",
        "items": [
          "Default thread pool: ~hundreds of threads (varies by cores)",
          "Average database query: 50ms",
          "If threads block waiting: 200 threads = 4,000 requests/second max",
          "With async/await (no blocking): Same threads = 50,000+ requests/second"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/01-async-patterns.md",
    "isSection": true,
    "id": "card-840"
  },
  {
    "question": "❌ Bad: Blocking Code (Thread Starvation)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderController : ControllerBase\n{\n    private readonly HttpClient _httpClient;\n    private readonly IDbConnection _db;\n\n    [HttpPost(\"orders\")]\n    public IActionResult CreateOrder(CreateOrderRequest request)\n    {\n        // WRONG: .Result blocks the thread The CPU is doing nothing, but the thread is unavailable.\n        var inventory = _httpClient\n            .GetAsync($\"https://inventory-api/check/{request.ProductId}\")\n            .Result;  // 🔥 Thread blocked here\n\n        // WRONG: Synchronous DB call The CPU is doing nothing, but the thread is unavailable.\n        var product = _db.Query<Product>(\n            \"SELECT * FROM Products WHERE Id = @Id\",\n            new { Id = request.ProductId }\n        ).First();  // 🔥 Thread blocked here\n\n        // More blocking...\n        var result = ProcessOrder(product, inventory).Result;\n\n        return Ok(result);\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "What happens under load:"
      },
      {
        "type": "list",
        "items": [
          "500 concurrent requests come in",
          "All 500 grab a thread and block",
          "Thread pool exhausted",
          "New requests queue up or timeout",
          "System dies under load"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/01-async-patterns.md",
    "isSection": true,
    "id": "card-841"
  },
  {
    "question": "❓ “Is async always better?”",
    "answer": [
      {
        "type": "text",
        "content": "“Only for I/O-bound work. For CPU-bound work, async doesn’t help; you need parallelism or offloading to background workers.”"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/01-async-patterns.md",
    "isSection": true,
    "id": "card-842"
  },
  {
    "question": "❓ “What about Task.Run?”",
    "answer": [
      {
        "type": "text",
        "content": "“Task.Run just moves blocking work to another thread — it doesn’t solve scalability and can make it worse under load.”"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/01-async-patterns.md",
    "isSection": true,
    "id": "card-843"
  },
  {
    "question": "❌ Bad: Creating HttpClient Instances",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// WRONG: Creates new sockets, doesn't respect DNS TTL\npublic class PaymentService\n{\n    public async Task<PaymentResult> ChargeCardAsync(string cardToken)\n    {\n        using var client = new HttpClient(); // 🔥 New sockets every time\n\n        var response = await client.PostAsJsonAsync(\n            \"https://payment-gateway/charge\",\n            new { Token = cardToken }\n        );\n\n        return await response.Content.ReadFromJsonAsync<PaymentResult>();\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Problems:"
      },
      {
        "type": "list",
        "items": [
          "Socket exhaustion: Each instance creates new sockets",
          "DNS changes ignored: Doesn't respect DNS TTL",
          "Under load: TIME_WAIT sockets pile up → connection failures"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/01-async-patterns.md",
    "isSection": true,
    "id": "card-844"
  },
  {
    "question": "What is a socket and why does it matter?",
    "answer": [
      {
        "type": "text",
        "content": "“A socket is an OS-managed network connection. Creating too many too fast exhausts system resources, which is why socket reuse is critical at scale.”"
      },
      {
        "type": "list",
        "items": [
          "It’s a temporary connection between your application and another machine. Used to send and receive data over the network (TCP/UDP)",
          "Managed by the OS, not by your application code",
          "Think of a socket like a phone line:",
          "You open it",
          "Talk (send data)",
          "Hang up",
          "The OS cleans it up later"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/01-async-patterns.md",
    "isSection": true,
    "id": "card-845"
  },
  {
    "question": "✅ Proper Cancellation Propagation",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class ReportController : ControllerBase\n{\n    private readonly IReportGenerator _reportGen;\n    private readonly IDbConnection _db;\n\n    [HttpGet(\"reports/{id}\")]\n    public async Task<IActionResult> GetReportAsync(\n        int id,\n        CancellationToken ct) // ASP.NET provides this\n    {\n        // Propagate to all async operations\n        var data = await _db.QueryAsync<ReportData>(\n            \"SELECT * FROM LargeReportTable WHERE ReportId = @Id\",\n            new { Id = id }\n            // Note: Dapper doesn't natively support CT, use wrapper\n        );\n\n        var report = await _reportGen.GenerateAsync(data, ct);\n\n        return File(report, \"application/pdf\");\n    }\n}\n\npublic class ReportGenerator : IReportGenerator\n{\n    public async Task<byte[]> GenerateAsync(\n        IEnumerable<ReportData> data,\n        CancellationToken ct)\n    {\n        using var stream = new MemoryStream();\n\n        foreach (var item in data)\n        {\n            // Check cancellation in loops\n            ct.ThrowIfCancellationRequested();\n\n            await ProcessItemAsync(item, stream, ct);\n        }\n\n        return stream.ToArray();\n    }\n\n    private async Task ProcessItemAsync(\n        ReportData item,\n        Stream stream,\n        CancellationToken ct)\n    {\n        // Expensive operation\n        await Task.Delay(100, ct); // Honors cancellation\n\n        var bytes = Encoding.UTF8.GetBytes(item.ToString());\n        await stream.WriteAsync(bytes, ct);\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Why this matters:"
      },
      {
        "type": "list",
        "items": [
          "User closes browser → cancel DB query, stop report generation",
          "Saves CPU, DB connections, memory",
          "At scale: prevents pile-up of abandoned work"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/01-async-patterns.md",
    "isSection": true,
    "id": "card-846"
  },
  {
    "question": "❌ Deadly Antipatterns",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// ANTIPATTERN #1: .Result / .Wait()\nvar user = _userService.GetUserAsync(id).Result; // Deadlock risk + blocks thread\n\n// ANTIPATTERN #2: .GetAwaiter().GetResult()\nvar user = _userService.GetUserAsync(id).GetAwaiter().GetResult(); // Same problems\n\n// ANTIPATTERN #3: Task.Run for fake async\npublic async Task<User> GetUserAsync(int id)\n{\n    // WRONG: Just wrapping sync code in Task.Run\n    return await Task.Run(() =>\n    {\n        return _db.Query<User>(\"SELECT * FROM Users WHERE Id = @Id\", new { Id = id })\n                  .First();\n    });\n    // This STILL uses a thread for the duration of the query\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/01-async-patterns.md",
    "isSection": true,
    "id": "card-847"
  },
  {
    "question": "❓ “Is .GetAwaiter().GetResult() safer?”",
    "answer": [
      {
        "type": "text",
        "content": "“No, it has the same deadlock and blocking issues as .Result. Always prefer async all the way.”"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/01-async-patterns.md",
    "isSection": true,
    "id": "card-848"
  },
  {
    "question": "❓ “Is Task.Run ever okay?”",
    "answer": [
      {
        "type": "text",
        "content": "“Only for CPU-bound work that you want to offload from the main thread, not for I/O-bound work. For I/O, always use async methods directly.”"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/01-async-patterns.md",
    "isSection": true,
    "id": "card-849"
  },
  {
    "question": "Advanced: ValueTask for Hot Paths",
    "answer": [
      {
        "type": "text",
        "content": "When an operation completes synchronously most of the time (e.g., cache hit), use ValueTask<T> to avoid Task allocation."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface ICacheService\n{\n    ValueTask<T?> GetAsync<T>(string key, CancellationToken ct);\n    ValueTask SetAsync<T>(string key, T value, CancellationToken ct);\n}\n\npublic class RedisCacheService : ICacheService\n{\n    private readonly IDatabase _redis;\n\n    public async ValueTask<T?> GetAsync<T>(string key, CancellationToken ct)\n    {\n        var value = await _redis.StringGetAsync(key);\n\n        if (value.IsNullOrEmpty)\n            return default;\n\n        return JsonSerializer.Deserialize<T>(value!);\n    }\n\n    public async ValueTask SetAsync<T>(\n        string key,\n        T value,\n        CancellationToken ct)\n    {\n        var json = JsonSerializer.Serialize(value);\n        await _redis.StringSetAsync(key, json);\n    }\n}\n\npublic class UserService\n{\n    private readonly ICacheService _cache;\n    private readonly IUserRepository _repo;\n\n    // ValueTask: if cache hits (common), avoids Task allocation\n    public async ValueTask<User> GetUserAsync(int id, CancellationToken ct)\n    {\n        var cacheKey = $\"user:{id}\";\n\n        // Might complete synchronously if in memory cache\n        var cached = await _cache.GetAsync<User>(cacheKey, ct);\n        if (cached != null)\n            return cached;\n\n        var user = await _repo.GetByIdAsync(id, ct);\n        await _cache.SetAsync(cacheKey, user, ct);\n\n        return user;\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "When to use ValueTask:"
      },
      {
        "type": "list",
        "items": [
          "Operations that often complete synchronously (cache hits, pooled resources)",
          "Hot paths called millions of times",
          "Trade-off: Slightly more complex, harder to debug"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/01-async-patterns.md",
    "isSection": true,
    "id": "card-850"
  },
  {
    "question": "Thread Pool Tuning (Last Resort)",
    "answer": [
      {
        "type": "text",
        "content": "Default settings work for 99% of cases. Only tune if you've:"
      },
      {
        "type": "list",
        "items": [
          "Measured with profiling",
          "Confirmed thread pool starvation",
          "Made everything async first"
        ]
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Program.cs - ONLY if measurements show it's needed\nThreadPool.GetMinThreads(out var minWorker, out var minIOCP);\nConsole.WriteLine($\"Default min threads: Worker={minWorker}, IOCP={minIOCP}\");\n\n// Increase min threads to reduce ramp-up time under bursts\n// Rule of thumb: cores * 2 to cores * 4\nThreadPool.SetMinThreads(\n    workerThreads: Environment.ProcessorCount * 2,\n    completionPortThreads: Environment.ProcessorCount * 2\n);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Warning: Increasing max threads doesn't help with async I/O. If you need more max threads, you're doing something wrong (probably blocking somewhere)."
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/01-async-patterns.md",
    "isSection": true,
    "id": "card-851"
  },
  {
    "question": "Summary: The Async Checklist",
    "answer": [
      {
        "type": "text",
        "content": "✅ All I/O operations are async (DB, HTTP, file, Redis, queue)"
      },
      {
        "type": "text",
        "content": "✅ No .Result, .Wait(), or GetAwaiter().GetResult()"
      },
      {
        "type": "text",
        "content": "✅ HttpClientFactory configured with timeouts and connection limits"
      },
      {
        "type": "text",
        "content": "✅ CancellationToken passed to all async methods"
      },
      {
        "type": "text",
        "content": "✅ Using truly async libraries (EF Core, Dapper async, StackExchange.Redis)"
      },
      {
        "type": "text",
        "content": "✅ ValueTask for hot paths with frequent sync completion"
      },
      {
        "type": "text",
        "content": "✅ Measured thread pool metrics before tuning"
      },
      {
        "type": "text",
        "content": "Next: Backpressure & Rate Limiting - Even with perfect async code, you need limits to protect the system."
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/01-async-patterns.md",
    "isSection": true,
    "id": "card-852"
  },
  {
    "question": "Rule #1: Never Block Threads on I/O",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderController : ControllerBase\n{\n    private readonly HttpClient _httpClient;\n    private readonly IDbConnection _db;\n\n    [HttpPost(\"orders\")]\n    public IActionResult CreateOrder(CreateOrderRequest request)\n    {\n        // WRONG: .Result blocks the thread The CPU is doing nothing, but the thread is unavailable.\n        var inventory = _httpClient\n            .GetAsync($\"https://inventory-api/check/{request.ProductId}\")\n            .Result;  // 🔥 Thread blocked here\n\n        // WRONG: Synchronous DB call The CPU is doing nothing, but the thread is unavailable.\n        var product = _db.Query<Product>(\n            \"SELECT * FROM Products WHERE Id = @Id\",\n            new { Id = request.ProductId }\n        ).First();  // 🔥 Thread blocked here\n\n        // More blocking...\n        var result = ProcessOrder(product, inventory).Result;\n\n        return Ok(result);\n    }\n}",
        "codeType": "bad"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/01-async-patterns.md",
    "isConcept": true,
    "id": "card-853"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderController : ControllerBase\n{\n    private readonly HttpClient _httpClient;\n    private readonly IDbConnection _db;\n\n    [HttpPost(\"orders\")]\n    public async Task<IActionResult> CreateOrderAsync(\n        CreateOrderRequest request,\n        CancellationToken ct)\n    {\n        // ✅ Thread released while waiting\n        var inventoryTask = _httpClient\n            .GetAsync($\"https://inventory-api/check/{request.ProductId}\", ct);\n\n        // ✅ Thread released while waiting\n        var productTask = _db.QueryFirstAsync<Product>(\n            \"SELECT * FROM Products WHERE Id = @Id\",\n            new { Id = request.ProductId }\n        );\n\n        // Run both in parallel, await both\n        await Task.WhenAll(inventoryTask, productTask);\n\n        var inventory = await inventoryTask;\n        var product = await productTask;\n\n        // ✅ Process async\n        var result = await ProcessOrderAsync(product, inventory, ct);\n\n        return Ok(result);\n    }\n\n    private async Task<OrderResult> ProcessOrderAsync(\n        Product product,\n        HttpResponseMessage inventory,\n        CancellationToken ct)\n    {\n        var inventoryData = await inventory.Content\n            .ReadFromJsonAsync<InventoryResponse>(ct);\n\n        if (!inventoryData.Available)\n            throw new OutOfStockException();\n\n        // Write to DB async\n        await _db.ExecuteAsync(\n            \"INSERT INTO Orders (ProductId, Quantity) VALUES (@ProductId, @Qty)\",\n            new { ProductId = product.Id, Qty = 1 }\n        );\n\n        return new OrderResult { OrderId = Guid.NewGuid(), Status = \"Created\" };\n    }\n}",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/01-async-patterns.md",
    "isConcept": true,
    "id": "card-854"
  },
  {
    "question": "Rule #2: Use HttpClientFactory (Prevent Socket Exhaustion)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// WRONG: Creates new sockets, doesn't respect DNS TTL\npublic class PaymentService\n{\n    public async Task<PaymentResult> ChargeCardAsync(string cardToken)\n    {\n        using var client = new HttpClient(); // 🔥 New sockets every time\n\n        var response = await client.PostAsJsonAsync(\n            \"https://payment-gateway/charge\",\n            new { Token = cardToken }\n        );\n\n        return await response.Content.ReadFromJsonAsync<PaymentResult>();\n    }\n}",
        "codeType": "bad"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/01-async-patterns.md",
    "isConcept": true,
    "id": "card-855"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// Startup.cs / Program.cs\nbuilder.Services.AddHttpClient<PaymentService>(client =>\n{\n    client.BaseAddress = new Uri(\"https://payment-gateway\");\n    client.Timeout = TimeSpan.FromSeconds(10); // Always set timeout\n    client.DefaultRequestHeaders.Add(\"Accept\", \"application/json\");\n})\n.ConfigurePrimaryHttpMessageHandler(() => new SocketsHttpHandler\n{\n    PooledConnectionLifetime = TimeSpan.FromMinutes(2), // DNS refresh\n    MaxConnectionsPerServer = 100 // Tune based on downstream capacity\n});\n\n// Service\npublic class PaymentService\n{\n    private readonly HttpClient _httpClient;\n\n    // Injected from factory - reuses sockets correctly\n    public PaymentService(HttpClient httpClient)\n    {\n        _httpClient = httpClient;\n    }\n\n    public async Task<PaymentResult> ChargeCardAsync(\n        string cardToken,\n        CancellationToken ct)\n    {\n        var response = await _httpClient.PostAsJsonAsync(\n            \"/charge\",\n            new { Token = cardToken },\n            ct\n        );\n\n        response.EnsureSuccessStatusCode();\n        return await response.Content.ReadFromJsonAsync<PaymentResult>(ct);\n    }\n}",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/01-async-patterns.md",
    "isConcept": true,
    "id": "card-856"
  },
  {
    "question": "Rule #3: Always Pass CancellationToken",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class ReportController : ControllerBase\n{\n    private readonly IReportGenerator _reportGen;\n    private readonly IDbConnection _db;\n\n    [HttpGet(\"reports/{id}\")]\n    public async Task<IActionResult> GetReportAsync(\n        int id,\n        CancellationToken ct) // ASP.NET provides this\n    {\n        // Propagate to all async operations\n        var data = await _db.QueryAsync<ReportData>(\n            \"SELECT * FROM LargeReportTable WHERE ReportId = @Id\",\n            new { Id = id }\n            // Note: Dapper doesn't natively support CT, use wrapper\n        );\n\n        var report = await _reportGen.GenerateAsync(data, ct);\n\n        return File(report, \"application/pdf\");\n    }\n}\n\npublic class ReportGenerator : IReportGenerator\n{\n    public async Task<byte[]> GenerateAsync(\n        IEnumerable<ReportData> data,\n        CancellationToken ct)\n    {\n        using var stream = new MemoryStream();\n\n        foreach (var item in data)\n        {\n            // Check cancellation in loops\n            ct.ThrowIfCancellationRequested();\n\n            await ProcessItemAsync(item, stream, ct);\n        }\n\n        return stream.ToArray();\n    }\n\n    private async Task ProcessItemAsync(\n        ReportData item,\n        Stream stream,\n        CancellationToken ct)\n    {\n        // Expensive operation\n        await Task.Delay(100, ct); // Honors cancellation\n\n        var bytes = Encoding.UTF8.GetBytes(item.ToString());\n        await stream.WriteAsync(bytes, ct);\n    }\n}",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/01-async-patterns.md",
    "isConcept": true,
    "id": "card-857"
  },
  {
    "question": "Rule #4: Avoid Sync-Over-Async Antipatterns",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// ANTIPATTERN #1: .Result / .Wait()\nvar user = _userService.GetUserAsync(id).Result; // Deadlock risk + blocks thread\n\n// ANTIPATTERN #2: .GetAwaiter().GetResult()\nvar user = _userService.GetUserAsync(id).GetAwaiter().GetResult(); // Same problems\n\n// ANTIPATTERN #3: Task.Run for fake async\npublic async Task<User> GetUserAsync(int id)\n{\n    // WRONG: Just wrapping sync code in Task.Run\n    return await Task.Run(() =>\n    {\n        return _db.Query<User>(\"SELECT * FROM Users WHERE Id = @Id\", new { Id = id })\n                  .First();\n    });\n    // This STILL uses a thread for the duration of the query\n}",
        "codeType": "bad"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/01-async-patterns.md",
    "isConcept": true,
    "id": "card-858"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// Use truly async libraries\npublic async Task<User> GetUserAsync(int id, CancellationToken ct)\n{\n    // EF Core - truly async\n    return await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id, ct);\n\n    // Dapper - truly async\n    return await _db.QueryFirstOrDefaultAsync<User>(\n        \"SELECT * FROM Users WHERE Id = @Id\",\n        new { Id = id }\n    );\n\n    // SqlClient - truly async\n    await using var conn = new SqlConnection(_connectionString);\n    await conn.OpenAsync(ct);\n    await using var cmd = new SqlCommand(\"SELECT * FROM Users WHERE Id = @Id\", conn);\n    cmd.Parameters.AddWithValue(\"@Id\", id);\n    await using var reader = await cmd.ExecuteReaderAsync(ct);\n    // ... read results\n}",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/01-async-patterns.md",
    "isConcept": true,
    "id": "card-859"
  },
  {
    "question": "Why You MUST Have Backpressure",
    "answer": [
      {
        "type": "text",
        "content": "The Problem: When traffic spikes, accepting every request leads to:"
      },
      {
        "type": "list",
        "items": [
          "Queue explosion (memory exhaustion)",
          "Database connection pool exhaustion",
          "Cascading failures to downstream services",
          "Increased latency for ALL users (death spiral)"
        ]
      },
      {
        "type": "text",
        "content": "The Solution: Reject requests early when you're at capacity. Better to serve 10,000 requests fast with 1,000 rejections than have all 11,000 requests time out."
      },
      {
        "type": "text",
        "content": "Key Principle: Fail fast, fail explicitly, preserve capacity for requests you can handle."
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/02-backpressure-rate-limiting.md",
    "isSection": true,
    "id": "card-860"
  },
  {
    "question": "Basic Setup",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// Program.cs\nusing System.Threading.RateLimiting;\nusing Microsoft.AspNetCore.RateLimiting;\n\nvar builder = WebApplication.CreateBuilder(args);\n\nbuilder.Services.AddRateLimiter(options =>\n{\n    // Fixed window: X requests per time window\n    options.AddFixedWindowLimiter(\"fixed\", opt =>\n    {\n        opt.PermitLimit = 100;\n        opt.Window = TimeSpan.FromMinutes(1);\n        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;\n        opt.QueueLimit = 10; // How many can queue waiting for a slot\n    });\n\n    // Sliding window: Smoother than fixed (prevents reset spike)\n    options.AddSlidingWindowLimiter(\"sliding\", opt =>\n    {\n        opt.PermitLimit = 100;\n        opt.Window = TimeSpan.FromMinutes(1);\n        opt.SegmentsPerWindow = 6; // 6 segments of 10 seconds each\n        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;\n        opt.QueueLimit = 0; // Reject immediately when full\n    });\n\n    // Token bucket: Allows bursts\n    options.AddTokenBucketLimiter(\"token\", opt =>\n    {\n        opt.TokenLimit = 100;\n        opt.ReplenishmentPeriod = TimeSpan.FromMinutes(1);\n        opt.TokensPerPeriod = 100;\n        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;\n        opt.QueueLimit = 0;\n    });\n\n    // Concurrency limiter: Max simultaneous requests\n    options.AddConcurrencyLimiter(\"concurrent\", opt =>\n    {\n        opt.PermitLimit = 50; // Only 50 requests executing at once\n        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;\n        opt.QueueLimit = 25; // 25 more can wait\n    });\n\n    // Default rejection response\n    options.OnRejected = async (context, ct) =>\n    {\n        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;\n\n        if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))\n        {\n            context.HttpContext.Response.Headers.RetryAfter = retryAfter.TotalSeconds.ToString();\n        }\n\n        await context.HttpContext.Response.WriteAsJsonAsync(new\n        {\n            error = \"Too many requests. Please retry later.\",\n            retryAfter = retryAfter?.TotalSeconds\n        }, cancellationToken: ct);\n    };\n});\n\nvar app = builder.Build();\n\n// Apply globally\napp.UseRateLimiter();\n\napp.MapControllers();\napp.Run();",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/02-backpressure-rate-limiting.md",
    "isSection": true,
    "id": "card-861"
  },
  {
    "question": "Apply to Specific Endpoints",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "[ApiController]\n[Route(\"api/[controller]\")]\npublic class OrdersController : ControllerBase\n{\n    // High-traffic endpoint: strict limit\n    [HttpPost]\n    [EnableRateLimiting(\"sliding\")]\n    public async Task<IActionResult> CreateOrderAsync(\n        CreateOrderRequest request,\n        CancellationToken ct)\n    {\n        // Process order\n        return Ok();\n    }\n\n    // Read endpoint: more lenient\n    [HttpGet(\"{id}\")]\n    [EnableRateLimiting(\"token\")]\n    public async Task<IActionResult> GetOrderAsync(int id, CancellationToken ct)\n    {\n        // Fetch order\n        return Ok();\n    }\n\n    // Expensive report: concurrency limit\n    [HttpGet(\"reports/{id}\")]\n    [EnableRateLimiting(\"concurrent\")]\n    public async Task<IActionResult> GetReportAsync(int id, CancellationToken ct)\n    {\n        // Generate report (expensive)\n        return Ok();\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/02-backpressure-rate-limiting.md",
    "isSection": true,
    "id": "card-862"
  },
  {
    "question": "2. Per-User/Per-IP Rate Limiting",
    "answer": [
      {
        "type": "text",
        "content": "Prevent a single user from monopolizing resources."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Custom partition key resolver\nbuilder.Services.AddRateLimiter(options =>\n{\n    options.AddSlidingWindowLimiter(\"per-user\", opt =>\n    {\n        opt.PermitLimit = 10;\n        opt.Window = TimeSpan.FromSeconds(10);\n        opt.SegmentsPerWindow = 2;\n        opt.QueueLimit = 0;\n    }).AddPolicy(\"per-user-policy\", context =>\n    {\n        // Get user ID from claims or API key\n        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value\n                     ?? context.Request.Headers[\"X-API-Key\"].ToString()\n                     ?? context.Connection.RemoteIpAddress?.ToString()\n                     ?? \"anonymous\";\n\n        return RateLimitPartition.GetSlidingWindowLimiter(userId, _ => new SlidingWindowRateLimiterOptions\n        {\n            PermitLimit = 100,\n            Window = TimeSpan.FromMinutes(1),\n            SegmentsPerWindow = 6,\n            QueueLimit = 0\n        });\n    });\n});\n\n// Apply to controller\n[EnableRateLimiting(\"per-user-policy\")]\n[ApiController]\n[Route(\"api/[controller]\")]\npublic class UserController : ControllerBase\n{\n    // Each user gets their own 100 req/min limit\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Why this matters:"
      },
      {
        "type": "list",
        "items": [
          "One abusive user doesn't affect others",
          "Prevents scraping/abuse",
          "Fair resource distribution"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/02-backpressure-rate-limiting.md",
    "isSection": true,
    "id": "card-863"
  },
  {
    "question": "Manual Semaphore Implementation",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface IExpensiveService\n{\n    Task<ReportData> GenerateReportAsync(int userId, CancellationToken ct);\n}\n\npublic class ExpensiveReportService : IExpensiveService\n{\n    private readonly SemaphoreSlim _concurrencyLimit;\n    private readonly IDbConnection _db;\n    private readonly ILogger<ExpensiveReportService> _logger;\n\n    public ExpensiveReportService(\n        IDbConnection db,\n        ILogger<ExpensiveReportService> logger)\n    {\n        _db = db;\n        _logger = logger;\n\n        // Only 20 reports generating at once\n        // Tune based on: CPU cores, memory, DB connection pool size\n        _concurrencyLimit = new SemaphoreSlim(\n            initialCount: 20,\n            maxCount: 20\n        );\n    }\n\n    public async Task<ReportData> GenerateReportAsync(\n        int userId,\n        CancellationToken ct)\n    {\n        // Try to acquire a slot, wait max 2 seconds\n        var acquired = await _concurrencyLimit.WaitAsync(\n            TimeSpan.FromSeconds(2),\n            ct\n        );\n\n        if (!acquired)\n        {\n            _logger.LogWarning(\n                \"Report generation rejected for user {UserId} - concurrency limit reached\",\n                userId\n            );\n            throw new TooManyRequestsException(\n                \"System is under heavy load. Please retry in a moment.\"\n            );\n        }\n\n        try\n        {\n            _logger.LogInformation(\n                \"Starting report generation for user {UserId}. Current concurrency: {Current}/{Max}\",\n                userId,\n                20 - _concurrencyLimit.CurrentCount,\n                20\n            );\n\n            // Expensive work here\n            var data = await _db.QueryAsync<ReportData>(\n                \"EXEC GenerateUserReport @UserId\",\n                new { UserId = userId }\n            );\n\n            // Simulate heavy processing\n            await ProcessDataAsync(data, ct);\n\n            return new ReportData { /* ... */ };\n        }\n        finally\n        {\n            _concurrencyLimit.Release();\n\n            _logger.LogInformation(\n                \"Completed report for user {UserId}. Current concurrency: {Current}/{Max}\",\n                userId,\n                20 - _concurrencyLimit.CurrentCount,\n                20\n            );\n        }\n    }\n\n    private async Task ProcessDataAsync(\n        IEnumerable<ReportData> data,\n        CancellationToken ct)\n    {\n        foreach (var item in data)\n        {\n            ct.ThrowIfCancellationRequested();\n            // Heavy CPU work\n            await Task.Delay(50, ct);\n        }\n    }\n}\n\npublic class TooManyRequestsException : Exception\n{\n    public TooManyRequestsException(string message) : base(message) { }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/02-backpressure-rate-limiting.md",
    "isSection": true,
    "id": "card-864"
  },
  {
    "question": "Middleware for Global Concurrency Limit",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class ConcurrencyLimitMiddleware\n{\n    private readonly RequestDelegate _next;\n    private readonly SemaphoreSlim _semaphore;\n    private readonly ILogger<ConcurrencyLimitMiddleware> _logger;\n\n    public ConcurrencyLimitMiddleware(\n        RequestDelegate next,\n        ILogger<ConcurrencyLimitMiddleware> logger,\n        int maxConcurrency = 1000)\n    {\n        _next = next;\n        _logger = logger;\n        _semaphore = new SemaphoreSlim(maxConcurrency, maxConcurrency);\n    }\n\n    public async Task InvokeAsync(HttpContext context)\n    {\n        var acquired = await _semaphore.WaitAsync(TimeSpan.FromMilliseconds(100));\n\n        if (!acquired)\n        {\n            _logger.LogWarning(\n                \"Request rejected - global concurrency limit reached. Path: {Path}\",\n                context.Request.Path\n            );\n\n            context.Response.StatusCode = StatusCodes.Status503ServiceUnavailable;\n            context.Response.Headers.RetryAfter = \"5\";\n\n            await context.Response.WriteAsJsonAsync(new\n            {\n                error = \"Service temporarily overloaded. Please retry.\",\n                retryAfter = 5\n            });\n\n            return;\n        }\n\n        try\n        {\n            await _next(context);\n        }\n        finally\n        {\n            _semaphore.Release();\n        }\n    }\n}\n\n// Register in Program.cs\napp.UseMiddleware<ConcurrencyLimitMiddleware>(maxConcurrency: 2000);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "When to use:"
      },
      {
        "type": "list",
        "items": [
          "CPU-intensive endpoints (reports, image processing)",
          "Memory-intensive operations",
          "Expensive database queries",
          "Calls to rate-limited external APIs"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/02-backpressure-rate-limiting.md",
    "isSection": true,
    "id": "card-865"
  },
  {
    "question": "4. Bounded Queues for Background Work",
    "answer": [
      {
        "type": "text",
        "content": "Don't let background job queues grow unbounded."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface IBackgroundJobQueue\n{\n    ValueTask<bool> QueueAsync(Func<CancellationToken, Task> workItem, CancellationToken ct);\n    ValueTask<Func<CancellationToken, Task>?> DequeueAsync(CancellationToken ct);\n}\n\npublic class BoundedBackgroundJobQueue : IBackgroundJobQueue\n{\n    private readonly Channel<Func<CancellationToken, Task>> _queue;\n    private readonly ILogger<BoundedBackgroundJobQueue> _logger;\n\n    public BoundedBackgroundJobQueue(\n        int capacity,\n        ILogger<BoundedBackgroundJobQueue> logger)\n    {\n        _logger = logger;\n\n        // Bounded channel: reject writes when full\n        var options = new BoundedChannelOptions(capacity)\n        {\n            FullMode = BoundedChannelFullMode.DropWrite // Or DropOldest, Wait\n        };\n\n        _queue = Channel.CreateBounded<Func<CancellationToken, Task>>(options);\n    }\n\n    public async ValueTask<bool> QueueAsync(\n        Func<CancellationToken, Task> workItem,\n        CancellationToken ct)\n    {\n        var queued = await _queue.Writer.WaitToWriteAsync(ct);\n\n        if (!queued)\n        {\n            _logger.LogWarning(\"Background queue is full - job rejected\");\n            return false;\n        }\n\n        if (!_queue.Writer.TryWrite(workItem))\n        {\n            _logger.LogWarning(\"Failed to write to background queue\");\n            return false;\n        }\n\n        return true;\n    }\n\n    public async ValueTask<Func<CancellationToken, Task>?> DequeueAsync(\n        CancellationToken ct)\n    {\n        var workItem = await _queue.Reader.ReadAsync(ct);\n        return workItem;\n    }\n}\n\n// Background service processing the queue\npublic class BackgroundJobProcessor : BackgroundService\n{\n    private readonly IBackgroundJobQueue _queue;\n    private readonly ILogger<BackgroundJobProcessor> _logger;\n\n    public BackgroundJobProcessor(\n        IBackgroundJobQueue queue,\n        ILogger<BackgroundJobProcessor> logger)\n    {\n        _queue = queue;\n        _logger = logger;\n    }\n\n    protected override async Task ExecuteAsync(CancellationToken stoppingToken)\n    {\n        _logger.LogInformation(\"Background job processor started\");\n\n        while (!stoppingToken.IsCancellationRequested)\n        {\n            try\n            {\n                var workItem = await _queue.DequeueAsync(stoppingToken);\n\n                if (workItem != null)\n                {\n                    await workItem(stoppingToken);\n                }\n            }\n            catch (OperationCanceledException)\n            {\n                // Expected on shutdown\n                break;\n            }\n            catch (Exception ex)\n            {\n                _logger.LogError(ex, \"Error processing background job\");\n            }\n        }\n\n        _logger.LogInformation(\"Background job processor stopped\");\n    }\n}\n\n// Usage in controller\n[ApiController]\n[Route(\"api/[controller]\")]\npublic class NotificationController : ControllerBase\n{\n    private readonly IBackgroundJobQueue _jobQueue;\n\n    [HttpPost(\"send\")]\n    public async Task<IActionResult> SendNotificationAsync(\n        NotificationRequest request,\n        CancellationToken ct)\n    {\n        var queued = await _jobQueue.QueueAsync(async token =>\n        {\n            // Expensive work: send email, SMS, push notification\n            await SendEmailAsync(request.Email, token);\n            await SendSmsAsync(request.Phone, token);\n        }, ct);\n\n        if (!queued)\n        {\n            return StatusCode(\n                StatusCodes.Status503ServiceUnavailable,\n                \"System is overloaded. Please retry later.\"\n            );\n        }\n\n        return Accepted(new { message = \"Notification queued for processing\" });\n    }\n\n    private Task SendEmailAsync(string email, CancellationToken ct)\n    {\n        // Implementation\n        return Task.CompletedTask;\n    }\n\n    private Task SendSmsAsync(string phone, CancellationToken ct)\n    {\n        // Implementation\n        return Task.CompletedTask;\n    }\n}\n\n// Registration\nbuilder.Services.AddSingleton<IBackgroundJobQueue>(\n    sp => new BoundedBackgroundJobQueue(\n        capacity: 10000, // Tune based on memory\n        sp.GetRequiredService<ILogger<BoundedBackgroundJobQueue>>()\n    )\n);\nbuilder.Services.AddHostedService<BackgroundJobProcessor>();",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Why bounded queues:"
      },
      {
        "type": "list",
        "items": [
          "Prevents memory exhaustion",
          "Fails fast when overloaded",
          "Forces clients to retry (with backoff)",
          "Preserves system stability"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/02-backpressure-rate-limiting.md",
    "isSection": true,
    "id": "card-866"
  },
  {
    "question": "5. Distributed Rate Limiting with Redis",
    "answer": [
      {
        "type": "text",
        "content": "For multi-instance deployments, use Redis for shared rate limit state."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface IDistributedRateLimiter\n{\n    Task<bool> AllowRequestAsync(string key, int limit, TimeSpan window, CancellationToken ct);\n}\n\npublic class RedisRateLimiter : IDistributedRateLimiter\n{\n    private readonly IDatabase _redis;\n    private readonly ILogger<RedisRateLimiter> _logger;\n\n    public RedisRateLimiter(\n        IConnectionMultiplexer redis,\n        ILogger<RedisRateLimiter> logger)\n    {\n        _redis = redis.GetDatabase();\n        _logger = logger;\n    }\n\n    public async Task<bool> AllowRequestAsync(\n        string key,\n        int limit,\n        TimeSpan window,\n        CancellationToken ct)\n    {\n        var redisKey = $\"ratelimit:{key}\";\n\n        try\n        {\n            // Sliding window log algorithm using Redis sorted set\n            var now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();\n            var windowStart = now - (long)window.TotalMilliseconds;\n\n            // Remove old entries outside the window\n            await _redis.SortedSetRemoveRangeByScoreAsync(\n                redisKey,\n                double.NegativeInfinity,\n                windowStart\n            );\n\n            // Count current entries in window\n            var currentCount = await _redis.SortedSetLengthAsync(redisKey);\n\n            if (currentCount >= limit)\n            {\n                _logger.LogWarning(\n                    \"Rate limit exceeded for key {Key}. Current: {Current}, Limit: {Limit}\",\n                    key, currentCount, limit\n                );\n                return false;\n            }\n\n            // Add current request\n            await _redis.SortedSetAddAsync(redisKey, now, now);\n\n            // Set expiry to clean up old keys\n            await _redis.KeyExpireAsync(redisKey, window);\n\n            return true;\n        }\n        catch (Exception ex)\n        {\n            _logger.LogError(ex, \"Redis rate limiter error for key {Key}. Allowing request.\", key);\n            // Fail open: allow request if Redis is down\n            return true;\n        }\n    }\n}\n\n// Lua script for atomic sliding window (more efficient)\npublic class RedisRateLimiterOptimized : IDistributedRateLimiter\n{\n    private readonly IDatabase _redis;\n    private readonly ILogger<RedisRateLimiterOptimized> _logger;\n\n    private const string LuaScript = @\"\n        local key = KEYS[1]\n        local now = tonumber(ARGV[1])\n        local window = tonumber(ARGV[2])\n        local limit = tonumber(ARGV[3])\n\n        local clearBefore = now - window\n        redis.call('ZREMRANGEBYSCORE', key, 0, clearBefore)\n\n        local amount = redis.call('ZCARD', key)\n        if amount < limit then\n            redis.call('ZADD', key, now, now)\n            redis.call('EXPIRE', key, window / 1000)\n            return 1\n        end\n        return 0\n    \";\n\n    public async Task<bool> AllowRequestAsync(\n        string key,\n        int limit,\n        TimeSpan window,\n        CancellationToken ct)\n    {\n        var redisKey = $\"ratelimit:{key}\";\n        var now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();\n\n        try\n        {\n            var result = await _redis.ScriptEvaluateAsync(\n                LuaScript,\n                new RedisKey[] { redisKey },\n                new RedisValue[]\n                {\n                    now,\n                    (long)window.TotalMilliseconds,\n                    limit\n                }\n            );\n\n            return (int)result == 1;\n        }\n        catch (Exception ex)\n        {\n            _logger.LogError(ex, \"Redis rate limiter error. Allowing request.\");\n            return true; // Fail open\n        }\n    }\n}\n\n// Usage in middleware\npublic class DistributedRateLimitMiddleware\n{\n    private readonly RequestDelegate _next;\n    private readonly IDistributedRateLimiter _rateLimiter;\n\n    public async Task InvokeAsync(HttpContext context)\n    {\n        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value\n                     ?? context.Connection.RemoteIpAddress?.ToString()\n                     ?? \"anonymous\";\n\n        var allowed = await _rateLimiter.AllowRequestAsync(\n            key: userId,\n            limit: 100,\n            window: TimeSpan.FromMinutes(1),\n            ct: context.RequestAborted\n        );\n\n        if (!allowed)\n        {\n            context.Response.StatusCode = StatusCodes.Status429TooManyRequests;\n            await context.Response.WriteAsJsonAsync(new\n            {\n                error = \"Rate limit exceeded\"\n            });\n            return;\n        }\n\n        await _next(context);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/02-backpressure-rate-limiting.md",
    "isSection": true,
    "id": "card-867"
  },
  {
    "question": "Summary: Backpressure Checklist",
    "answer": [
      {
        "type": "text",
        "content": "✅ Built-in rate limiting configured for public endpoints"
      },
      {
        "type": "text",
        "content": "✅ Per-user/per-IP limits to prevent monopolization"
      },
      {
        "type": "text",
        "content": "✅ Concurrency limits on expensive operations (semaphore pattern)"
      },
      {
        "type": "text",
        "content": "✅ Bounded queues for background work"
      },
      {
        "type": "text",
        "content": "✅ Distributed rate limiting (Redis) for multi-instance deployments"
      },
      {
        "type": "text",
        "content": "✅ Fail fast with proper 429/503 responses and Retry-After headers"
      },
      {
        "type": "text",
        "content": "✅ Monitoring of rejection rates, queue depth, semaphore contention"
      },
      {
        "type": "text",
        "content": "Key Insight: Backpressure is not about blocking users — it's about preserving system health so you can serve the requests you accept with good latency. A 429 response in 10ms is better than a timeout after 30 seconds."
      },
      {
        "type": "text",
        "content": "Next: Caching Strategies - The fastest request is one you don't have to process."
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/02-backpressure-rate-limiting.md",
    "isSection": true,
    "id": "card-868"
  },
  {
    "question": "Why Caching is Critical at Scale",
    "answer": [
      {
        "type": "text",
        "content": "The Math:"
      },
      {
        "type": "list",
        "items": [
          "Database query: 50ms average",
          "Redis cache hit: 1-2ms",
          "In-memory cache hit: 0.01ms (10 microseconds)"
        ]
      },
      {
        "type": "text",
        "content": "With millions of users, your database is the bottleneck. Caching moves the \"hot path\" from slow storage to fast memory."
      },
      {
        "type": "text",
        "content": "Key Principle: The fastest request is one you never have to process."
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/03-caching-strategies.md",
    "isSection": true,
    "id": "card-869"
  },
  {
    "question": "Why Multiple Layers?",
    "answer": [
      {
        "type": "list",
        "items": [
          "L1 (In-Memory): Ultra-fast for per-instance hot data",
          "L2 (Redis): Shared across instances, survives restarts",
          "L3 (Database): Source of truth"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/03-caching-strategies.md",
    "isSection": true,
    "id": "card-870"
  },
  {
    "question": "Cache Stampede Protection (Critical!)",
    "answer": [
      {
        "type": "text",
        "content": "When cache expires and 1000 requests hit at once, they all query the DB. Use per-key locking."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class StampededProofCacheService<T> where T : class\n{\n    private readonly IMemoryCache _cache;\n    private static readonly ConcurrentDictionary<string, SemaphoreSlim> _locks = new();\n    private readonly ILogger<StampededProofCacheService<T>> _logger;\n\n    public StampededProofCacheService(\n        IMemoryCache cache,\n        ILogger<StampededProofCacheService<T>> logger)\n    {\n        _cache = cache;\n        _logger = logger;\n    }\n\n    public async Task<T> GetOrCreateAsync(\n        string key,\n        Func<CancellationToken, Task<T>> factory,\n        TimeSpan expiration,\n        CancellationToken ct)\n    {\n        // Fast path: cache hit\n        if (_cache.TryGetValue(key, out T? cached))\n        {\n            return cached!;\n        }\n\n        // Slow path: acquire per-key lock\n        var semaphore = _locks.GetOrAdd(key, _ => new SemaphoreSlim(1, 1));\n\n        await semaphore.WaitAsync(ct);\n        try\n        {\n            // Double-check after acquiring lock (another thread may have loaded it)\n            if (_cache.TryGetValue(key, out cached))\n            {\n                _logger.LogDebug(\"Cache hit after lock acquisition for {Key}\", key);\n                return cached!;\n            }\n\n            _logger.LogDebug(\"Loading data for {Key}\", key);\n\n            // Only one thread executes this\n            var value = await factory(ct);\n\n            // Add jitter to TTL to prevent thundering herd\n            var jitter = TimeSpan.FromSeconds(Random.Shared.Next(0, 30));\n            var ttl = expiration + jitter;\n\n            _cache.Set(key, value, new MemoryCacheEntryOptions\n            {\n                AbsoluteExpirationRelativeToNow = ttl\n            });\n\n            return value;\n        }\n        finally\n        {\n            semaphore.Release();\n\n            // Cleanup: remove lock if no waiters (prevent dictionary bloat)\n            if (semaphore.CurrentCount == 1 && _locks.TryRemove(key, out var removed))\n            {\n                removed.Dispose();\n            }\n        }\n    }\n}\n\n// Usage\npublic class UserService\n{\n    private readonly StampededProofCacheService<User> _cache;\n    private readonly IUserRepository _repo;\n\n    public async Task<User> GetUserAsync(int userId, CancellationToken ct)\n    {\n        return await _cache.GetOrCreateAsync(\n            key: $\"user:{userId}\",\n            factory: async token => await _repo.GetByIdAsync(userId, token),\n            expiration: TimeSpan.FromMinutes(5),\n            ct: ct\n        );\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Why this matters:"
      },
      {
        "type": "list",
        "items": [
          "Without locking: 1000 concurrent requests → 1000 DB queries",
          "With locking: 1000 concurrent requests → 1 DB query, 999 wait for result"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/03-caching-strategies.md",
    "isSection": true,
    "id": "card-871"
  },
  {
    "question": "Setup StackExchange.Redis",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// Program.cs\nbuilder.Services.AddSingleton<IConnectionMultiplexer>(sp =>\n{\n    var config = ConfigurationOptions.Parse(\n        builder.Configuration.GetConnectionString(\"Redis\")!\n    );\n\n    config.AbortOnConnectFail = false; // Retry on connect failure\n    config.ConnectTimeout = 5000;\n    config.SyncTimeout = 5000;\n    config.AsyncTimeout = 5000;\n    config.ConnectRetry = 3;\n    config.KeepAlive = 60;\n\n    // Connection pool settings\n    config.DefaultDatabase = 0;\n\n    var connection = ConnectionMultiplexer.Connect(config);\n\n    // Log connection events\n    connection.ConnectionFailed += (sender, args) =>\n    {\n        var logger = sp.GetRequiredService<ILogger<Program>>();\n        logger.LogError(\n            \"Redis connection failed: {EndPoint}, {FailureType}\",\n            args.EndPoint, args.FailureType\n        );\n    };\n\n    connection.ConnectionRestored += (sender, args) =>\n    {\n        var logger = sp.GetRequiredService<ILogger<Program>>();\n        logger.LogInformation(\"Redis connection restored: {EndPoint}\", args.EndPoint);\n    };\n\n    return connection;\n});\n\nbuilder.Services.AddSingleton<IDistributedCache>(sp =>\n{\n    var redis = sp.GetRequiredService<IConnectionMultiplexer>();\n    return new RedisCache(new RedisCacheOptions\n    {\n        ConnectionMultiplexerFactory = () => Task.FromResult(redis),\n        InstanceName = \"MyApp:\" // Prefix for all keys\n    });\n});",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/03-caching-strategies.md",
    "isSection": true,
    "id": "card-872"
  },
  {
    "question": "Cache-Aside Pattern",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface ICacheService\n{\n    Task<T?> GetAsync<T>(string key, CancellationToken ct) where T : class;\n    Task SetAsync<T>(string key, T value, TimeSpan expiration, CancellationToken ct) where T : class;\n    Task RemoveAsync(string key, CancellationToken ct);\n}\n\npublic class RedisCacheService : ICacheService\n{\n    private readonly IDatabase _redis;\n    private readonly ILogger<RedisCacheService> _logger;\n\n    public RedisCacheService(\n        IConnectionMultiplexer multiplexer,\n        ILogger<RedisCacheService> logger)\n    {\n        _redis = multiplexer.GetDatabase();\n        _logger = logger;\n    }\n\n    public async Task<T?> GetAsync<T>(string key, CancellationToken ct) where T : class\n    {\n        try\n        {\n            var value = await _redis.StringGetAsync(key);\n\n            if (value.IsNullOrEmpty)\n            {\n                return null;\n            }\n\n            return JsonSerializer.Deserialize<T>(value!);\n        }\n        catch (Exception ex)\n        {\n            _logger.LogError(ex, \"Redis GET failed for key {Key}\", key);\n            return null; // Fail gracefully\n        }\n    }\n\n    public async Task SetAsync<T>(\n        string key,\n        T value,\n        TimeSpan expiration,\n        CancellationToken ct) where T : class\n    {\n        try\n        {\n            var json = JsonSerializer.Serialize(value);\n\n            await _redis.StringSetAsync(\n                key,\n                json,\n                expiration,\n                flags: CommandFlags.FireAndForget // Don't wait for confirmation\n            );\n        }\n        catch (Exception ex)\n        {\n            _logger.LogError(ex, \"Redis SET failed for key {Key}\", key);\n            // Don't throw - cache failures shouldn't break the app\n        }\n    }\n\n    public async Task RemoveAsync(string key, CancellationToken ct)\n    {\n        try\n        {\n            await _redis.KeyDeleteAsync(key, CommandFlags.FireAndForget);\n        }\n        catch (Exception ex)\n        {\n            _logger.LogError(ex, \"Redis DELETE failed for key {Key}\", key);\n        }\n    }\n}\n\n// Usage in service\npublic class OrderService\n{\n    private readonly ICacheService _cache;\n    private readonly IOrderRepository _repo;\n    private readonly ILogger<OrderService> _logger;\n\n    public async Task<Order> GetOrderAsync(int orderId, CancellationToken ct)\n    {\n        var cacheKey = $\"order:{orderId}\";\n\n        // Try cache first\n        var cached = await _cache.GetAsync<Order>(cacheKey, ct);\n        if (cached != null)\n        {\n            _logger.LogDebug(\"Redis cache HIT for order {OrderId}\", orderId);\n            return cached;\n        }\n\n        _logger.LogDebug(\"Redis cache MISS for order {OrderId}\", orderId);\n\n        // Load from DB\n        var order = await _repo.GetByIdAsync(orderId, ct);\n\n        // Update cache (fire and forget)\n        _ = _cache.SetAsync(cacheKey, order, TimeSpan.FromMinutes(10), ct);\n\n        return order;\n    }\n\n    public async Task UpdateOrderAsync(Order order, CancellationToken ct)\n    {\n        // Update DB\n        await _repo.UpdateAsync(order, ct);\n\n        // Invalidate cache\n        await _cache.RemoveAsync($\"order:{order.Id}\", ct);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/03-caching-strategies.md",
    "isSection": true,
    "id": "card-873"
  },
  {
    "question": "4. Two-Layer Cache (L1 + L2)",
    "answer": [
      {
        "type": "text",
        "content": "Combine in-memory and Redis for best performance."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TwoLayerCacheService\n{\n    private readonly IMemoryCache _l1Cache;\n    private readonly IDatabase _redis;\n    private readonly ILogger<TwoLayerCacheService> _logger;\n\n    public TwoLayerCacheService(\n        IMemoryCache memoryCache,\n        IConnectionMultiplexer redis,\n        ILogger<TwoLayerCacheService> logger)\n    {\n        _l1Cache = memoryCache;\n        _redis = redis.GetDatabase();\n        _logger = logger;\n    }\n\n    public async Task<T?> GetAsync<T>(\n        string key,\n        Func<CancellationToken, Task<T>> factory,\n        TimeSpan expiration,\n        CancellationToken ct) where T : class\n    {\n        // L1 (in-memory) check\n        if (_l1Cache.TryGetValue(key, out T? l1Value))\n        {\n            _logger.LogDebug(\"L1 cache HIT for {Key}\", key);\n            return l1Value;\n        }\n\n        // L2 (Redis) check\n        try\n        {\n            var redisValue = await _redis.StringGetAsync(key);\n            if (!redisValue.IsNullOrEmpty)\n            {\n                _logger.LogDebug(\"L2 cache HIT for {Key}\", key);\n\n                var l2Value = JsonSerializer.Deserialize<T>(redisValue!);\n\n                // Backfill L1\n                _l1Cache.Set(key, l2Value, new MemoryCacheEntryOptions\n                {\n                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(1) // Shorter than L2\n                });\n\n                return l2Value;\n            }\n        }\n        catch (Exception ex)\n        {\n            _logger.LogWarning(ex, \"L2 cache read failed for {Key}\", key);\n        }\n\n        _logger.LogDebug(\"Cache MISS for {Key}, loading from source\", key);\n\n        // Load from source\n        var value = await factory(ct);\n\n        // Write to both layers\n        _l1Cache.Set(key, value, new MemoryCacheEntryOptions\n        {\n            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(1)\n        });\n\n        try\n        {\n            var json = JsonSerializer.Serialize(value);\n            await _redis.StringSetAsync(key, json, expiration);\n        }\n        catch (Exception ex)\n        {\n            _logger.LogWarning(ex, \"L2 cache write failed for {Key}\", key);\n        }\n\n        return value;\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Why two layers:"
      },
      {
        "type": "list",
        "items": [
          "L1 eliminates network latency for hot items",
          "L2 shares data across instances",
          "Survives instance restarts",
          "Best of both worlds"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/03-caching-strategies.md",
    "isSection": true,
    "id": "card-874"
  },
  {
    "question": "Strategy 1: TTL with Jitter",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public static TimeSpan GetTTLWithJitter(TimeSpan baseTTL)\n{\n    var jitterSeconds = Random.Shared.Next(0, (int)(baseTTL.TotalSeconds * 0.1));\n    return baseTTL + TimeSpan.FromSeconds(jitterSeconds);\n}\n\n// Usage\nvar ttl = GetTTLWithJitter(TimeSpan.FromMinutes(10)); // 10-11 minutes\nawait _cache.SetAsync(key, value, ttl, ct);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Why jitter: Prevents cache stampede when many entries expire simultaneously."
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/03-caching-strategies.md",
    "isSection": true,
    "id": "card-875"
  },
  {
    "question": "Strategy 2: Write-Through (Update cache on write)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public async Task UpdateUserAsync(User user, CancellationToken ct)\n{\n    // Update database\n    await _repo.UpdateAsync(user, ct);\n\n    // Update cache immediately\n    var cacheKey = $\"user:{user.Id}\";\n    await _cache.SetAsync(cacheKey, user, TimeSpan.FromMinutes(10), ct);\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/03-caching-strategies.md",
    "isSection": true,
    "id": "card-876"
  },
  {
    "question": "Strategy 3: Cache Invalidation via Events",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class UserUpdatedEvent\n{\n    public int UserId { get; set; }\n}\n\npublic class UserCacheInvalidationHandler : INotificationHandler<UserUpdatedEvent>\n{\n    private readonly ICacheService _cache;\n\n    public async Task Handle(UserUpdatedEvent notification, CancellationToken ct)\n    {\n        await _cache.RemoveAsync($\"user:{notification.UserId}\", ct);\n        // Could also remove related keys: $\"user:{userId}:orders\", etc.\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/03-caching-strategies.md",
    "isSection": true,
    "id": "card-877"
  },
  {
    "question": "Strategy 4: Tag-Based Invalidation (Redis)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TaggedCacheService\n{\n    private readonly IDatabase _redis;\n\n    public async Task SetWithTagsAsync(\n        string key,\n        object value,\n        string[] tags,\n        TimeSpan expiration,\n        CancellationToken ct)\n    {\n        var json = JsonSerializer.Serialize(value);\n\n        // Store the value\n        await _redis.StringSetAsync(key, json, expiration);\n\n        // Store key in tag sets\n        foreach (var tag in tags)\n        {\n            await _redis.SetAddAsync($\"tag:{tag}\", key);\n        }\n    }\n\n    public async Task InvalidateByTagAsync(string tag, CancellationToken ct)\n    {\n        // Get all keys with this tag\n        var keys = await _redis.SetMembersAsync($\"tag:{tag}\");\n\n        // Delete all\n        foreach (var key in keys)\n        {\n            await _redis.KeyDeleteAsync(key.ToString());\n        }\n\n        // Remove the tag set\n        await _redis.KeyDeleteAsync($\"tag:{tag}\");\n    }\n}\n\n// Usage\nawait _taggedCache.SetWithTagsAsync(\n    \"product:123\",\n    product,\n    new[] { \"products\", \"category:electronics\", \"brand:apple\" },\n    TimeSpan.FromMinutes(10),\n    ct\n);\n\n// Invalidate all Apple products\nawait _taggedCache.InvalidateByTagAsync(\"brand:apple\", ct);",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/03-caching-strategies.md",
    "isSection": true,
    "id": "card-878"
  },
  {
    "question": "6. HTTP Caching (ETags & 304 Not Modified)",
    "answer": [
      {
        "type": "text",
        "content": "Reduce bandwidth and processing for GET requests."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class ProductsController : ControllerBase\n{\n    private readonly IProductService _productService;\n\n    [HttpGet(\"{id}\")]\n    [ResponseCache(Duration = 60, VaryByQueryKeys = new[] { \"id\" })]\n    public async Task<IActionResult> GetProductAsync(int id, CancellationToken ct)\n    {\n        var product = await _productService.GetProductAsync(id, ct);\n\n        // Generate ETag from product version or hash\n        var etag = $\"\\\"{product.Version}\\\"\";\n        Response.Headers.ETag = etag;\n\n        // Check if client has current version\n        if (Request.Headers.IfNoneMatch == etag)\n        {\n            return StatusCode(StatusCodes.Status304NotModified);\n        }\n\n        return Ok(product);\n    }\n}\n\n// Or use middleware for automatic ETag generation\npublic class ETagMiddleware\n{\n    private readonly RequestDelegate _next;\n\n    public async Task InvokeAsync(HttpContext context)\n    {\n        var originalStream = context.Response.Body;\n\n        using var memoryStream = new MemoryStream();\n        context.Response.Body = memoryStream;\n\n        await _next(context);\n\n        if (context.Response.StatusCode == 200)\n        {\n            var hash = ComputeHash(memoryStream.ToArray());\n            var etag = $\"\\\"{hash}\\\"\";\n\n            context.Response.Headers.ETag = etag;\n\n            if (context.Request.Headers.IfNoneMatch == etag)\n            {\n                context.Response.StatusCode = 304;\n                context.Response.ContentLength = 0;\n                return;\n            }\n        }\n\n        memoryStream.Position = 0;\n        await memoryStream.CopyToAsync(originalStream);\n    }\n\n    private string ComputeHash(byte[] data)\n    {\n        using var sha256 = SHA256.Create();\n        var hash = sha256.ComputeHash(data);\n        return Convert.ToBase64String(hash);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/03-caching-strategies.md",
    "isSection": true,
    "id": "card-879"
  },
  {
    "question": "7. CDN for Static Content",
    "answer": [
      {
        "type": "text",
        "content": "Serve static files (images, CSS, JS) from edge locations."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Serve images with far-future expires\napp.UseStaticFiles(new StaticFileOptions\n{\n    OnPrepareResponse = ctx =>\n    {\n        // Cache for 1 year\n        ctx.Context.Response.Headers.CacheControl = \"public,max-age=31536000\";\n\n        // Use versioned URLs: /images/logo.v123.png\n        // When file changes, change version → new URL → cache busted\n    }\n});",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/03-caching-strategies.md",
    "isSection": true,
    "id": "card-880"
  },
  {
    "question": "Summary: Caching Checklist",
    "answer": [
      {
        "type": "text",
        "content": "✅ Multi-layer caching: In-memory (L1) + Redis (L2)"
      },
      {
        "type": "text",
        "content": "✅ Stampede protection: Per-key locks for cache misses"
      },
      {
        "type": "text",
        "content": "✅ TTL with jitter: Prevent thundering herd"
      },
      {
        "type": "text",
        "content": "✅ Fail gracefully: Cache failures don't break the app"
      },
      {
        "type": "text",
        "content": "✅ Invalidation strategy: Write-through, events, or tag-based"
      },
      {
        "type": "text",
        "content": "✅ HTTP caching: ETags, 304 responses, response caching"
      },
      {
        "type": "text",
        "content": "✅ CDN: For static assets and cacheable API responses"
      },
      {
        "type": "text",
        "content": "✅ Monitor: Cache hit rate, eviction rate, memory usage"
      },
      {
        "type": "text",
        "content": "Key Insight: At scale, cache hit rate is everything. A 90% hit rate means 10x less database load. A 99% hit rate means 100x less load."
      },
      {
        "type": "text",
        "content": "Next: Database Optimization & Scaling - When you do hit the database, make it fast."
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/03-caching-strategies.md",
    "isSection": true,
    "id": "card-881"
  },
  {
    "question": "Why Database Performance Matters",
    "answer": [
      {
        "type": "text",
        "content": "The Reality:"
      },
      {
        "type": "list",
        "items": [
          "Most applications are database-bound, not CPU-bound",
          "A single slow query can bring down your entire system",
          "At scale, every millisecond of query time costs money"
        ]
      },
      {
        "type": "text",
        "content": "The Goal: Make database the \"cold path\" (via caching), and when you do hit it, make it fast."
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isSection": true,
    "id": "card-882"
  },
  {
    "question": "The Problem: Missing Indexes",
    "answer": [
      {
        "type": "code",
        "language": "sql",
        "code": "-- SLOW: Full table scan on 10 million rows\nSELECT * FROM Orders\nWHERE UserId = 12345\n  AND Status = 'Pending'\n  AND CreatedAt > '2024-01-01';\n\n-- Execution plan shows: Table Scan (cost: 10,000,000)",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isSection": true,
    "id": "card-883"
  },
  {
    "question": "The Solution: Composite Indexes",
    "answer": [
      {
        "type": "code",
        "language": "sql",
        "code": "-- Create covering index (index contains all needed columns)\nCREATE NONCLUSTERED INDEX IX_Orders_UserId_Status_CreatedAt\nON Orders (UserId, Status, CreatedAt)\nINCLUDE (OrderTotal, ShippingAddress); -- Add frequently selected columns\n\n-- Now query uses index seek (cost: 10)",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isSection": true,
    "id": "card-884"
  },
  {
    "question": "C# Code: Ensure Queries Use Indexes",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderRepository\n{\n    private readonly IDbConnection _db;\n\n    // ✅ GOOD: Query aligns with index\n    public async Task<IEnumerable<Order>> GetPendingOrdersAsync(\n        int userId,\n        DateTime since,\n        CancellationToken ct)\n    {\n        // Uses index: IX_Orders_UserId_Status_CreatedAt\n        return await _db.QueryAsync<Order>(new CommandDefinition(\n            commandText: @\"\n                SELECT OrderId, UserId, Status, CreatedAt, OrderTotal, ShippingAddress\n                FROM Orders\n                WHERE UserId = @UserId\n                  AND Status = @Status\n                  AND CreatedAt > @Since\n                ORDER BY CreatedAt DESC\",\n            parameters: new { UserId = userId, Status = \"Pending\", Since = since },\n            cancellationToken: ct\n        ));\n    }\n\n    // ❌ BAD: Function in WHERE prevents index usage\n    public async Task<IEnumerable<Order>> GetOrdersByDateBad(DateTime date)\n    {\n        // Index not used because of CONVERT function\n        return await _db.QueryAsync<Order>(@\"\n            SELECT * FROM Orders\n            WHERE CONVERT(DATE, CreatedAt) = @Date\",\n            new { Date = date }\n        );\n    }\n\n    // ✅ GOOD: Query structure allows index usage\n    public async Task<IEnumerable<Order>> GetOrdersByDateGood(DateTime date)\n    {\n        var startOfDay = date.Date;\n        var endOfDay = date.Date.AddDays(1);\n\n        // Index can be used with range\n        return await _db.QueryAsync<Order>(@\"\n            SELECT * FROM Orders\n            WHERE CreatedAt >= @Start AND CreatedAt < @End\",\n            new { Start = startOfDay, End = endOfDay }\n        );\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isSection": true,
    "id": "card-885"
  },
  {
    "question": "Index Strategy Rules",
    "answer": [
      {
        "type": "list",
        "items": [
          "Column order matters: Most selective column first `sql -- GOOD: UserId is highly selective (filters to one user) CREATE INDEX IX_Orders ON Orders (UserId, Status, CreatedAt);"
        ]
      },
      {
        "type": "text",
        "content": "-- BAD: Status has low selectivity (only a few values)"
      },
      {
        "type": "text",
        "content": "CREATE INDEX IX_Orders_Bad ON Orders (Status, UserId, CreatedAt);"
      },
      {
        "type": "text",
        "content": "`"
      },
      {
        "type": "list",
        "items": [
          "Include frequently selected columns to avoid lookups",
          "Don't over-index: Every index slows writes (INSERT/UPDATE/DELETE)",
          "Monitor index usage: `sql -- Find unused indexes SELECT OBJECT_NAME(i.object_id) AS TableName, i.name AS IndexName, s.user_seeks, s.user_scans, s.user_updates FROM sys.indexes i LEFT JOIN sys.dm_db_index_usage_stats s ON i.object_id = s.object_id AND i.index_id = s.index_id WHERE s.user_seeks = 0 AND s.user_scans = 0 AND s.user_updates > 0; -- Written to but never read `"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isSection": true,
    "id": "card-886"
  },
  {
    "question": "❌ The Problem",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// Loads 1 query for users, then 1 query per user for orders = N+1 queries\npublic async Task<List<UserWithOrders>> GetUsersWithOrdersBad(CancellationToken ct)\n{\n    var users = await _db.QueryAsync<User>(\"SELECT * FROM Users\");\n\n    var result = new List<UserWithOrders>();\n    foreach (var user in users) // N iterations\n    {\n        // 🔥 1 query per user!\n        var orders = await _db.QueryAsync<Order>(\n            \"SELECT * FROM Orders WHERE UserId = @UserId\",\n            new { UserId = user.Id }\n        );\n\n        result.Add(new UserWithOrders { User = user, Orders = orders.ToList() });\n    }\n\n    return result;\n}\n// 1 + N queries for N users = 1,001 queries for 1,000 users",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isSection": true,
    "id": "card-887"
  },
  {
    "question": "✅ Solution 1: Join in SQL",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public async Task<List<UserWithOrders>> GetUsersWithOrdersJoin(CancellationToken ct)\n{\n    var sql = @\"\n        SELECT\n            u.Id, u.Name, u.Email,\n            o.OrderId, o.UserId, o.OrderTotal, o.CreatedAt\n        FROM Users u\n        LEFT JOIN Orders o ON u.Id = o.UserId\";\n\n    var userDictionary = new Dictionary<int, UserWithOrders>();\n\n    await _db.QueryAsync<User, Order, UserWithOrders>(\n        sql,\n        (user, order) =>\n        {\n            if (!userDictionary.TryGetValue(user.Id, out var userWithOrders))\n            {\n                userWithOrders = new UserWithOrders { User = user, Orders = new List<Order>() };\n                userDictionary.Add(user.Id, userWithOrders);\n            }\n\n            if (order != null)\n            {\n                userWithOrders.Orders.Add(order);\n            }\n\n            return userWithOrders;\n        },\n        splitOn: \"OrderId\"\n    );\n\n    return userDictionary.Values.ToList();\n}\n// 1 query total",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isSection": true,
    "id": "card-888"
  },
  {
    "question": "✅ Solution 2: Batch Load (when JOIN is impractical)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public async Task<List<UserWithOrders>> GetUsersWithOrdersBatched(CancellationToken ct)\n{\n    // 1 query: get all users\n    var users = (await _db.QueryAsync<User>(\"SELECT * FROM Users\")).ToList();\n\n    var userIds = users.Select(u => u.Id).ToList();\n\n    // 2nd query: get all orders for these users in one query\n    var orders = (await _db.QueryAsync<Order>(\n        \"SELECT * FROM Orders WHERE UserId IN @UserIds\",\n        new { UserIds = userIds }\n    )).ToList();\n\n    // Group in memory\n    var ordersByUser = orders.GroupBy(o => o.UserId).ToDictionary(g => g.Key, g => g.ToList());\n\n    return users.Select(u => new UserWithOrders\n    {\n        User = u,\n        Orders = ordersByUser.GetValueOrDefault(u.Id, new List<Order>())\n    }).ToList();\n}\n// 2 queries total, regardless of number of users",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isSection": true,
    "id": "card-889"
  },
  {
    "question": "EF Core: Use Include to avoid N+1",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public async Task<List<User>> GetUsersWithOrdersEFCore(CancellationToken ct)\n{\n    return await _dbContext.Users\n        .Include(u => u.Orders) // Single query with JOIN\n        .ToListAsync(ct);\n}\n\n// For deep graphs, use ThenInclude\npublic async Task<List<Order>> GetOrdersWithDetailsEFCore(CancellationToken ct)\n{\n    return await _dbContext.Orders\n        .Include(o => o.User)\n        .Include(o => o.OrderItems)\n            .ThenInclude(oi => oi.Product)\n        .ToListAsync(ct);\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isSection": true,
    "id": "card-890"
  },
  {
    "question": "❌ Bad: OFFSET (gets slower as offset increases)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// Page 1,000 of 10,000,000 records = scans 1,000,000 rows\npublic async Task<PagedResult<Order>> GetOrdersOffset(int page, int pageSize, CancellationToken ct)\n{\n    var offset = (page - 1) * pageSize;\n\n    var orders = await _db.QueryAsync<Order>(@\"\n        SELECT * FROM Orders\n        ORDER BY CreatedAt DESC\n        OFFSET @Offset ROWS\n        FETCH NEXT @PageSize ROWS ONLY\",\n        new { Offset = offset, PageSize = pageSize }\n    );\n\n    var total = await _db.ExecuteScalarAsync<int>(\"SELECT COUNT(*) FROM Orders\");\n\n    return new PagedResult<Order>\n    {\n        Items = orders.ToList(),\n        TotalCount = total,\n        Page = page,\n        PageSize = pageSize\n    };\n}\n// Performance degrades linearly with page number",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isSection": true,
    "id": "card-891"
  },
  {
    "question": "✅ Good: Keyset Pagination (Seek Method)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public async Task<PagedResult<Order>> GetOrdersKeyset(\n    DateTime? lastCreatedAt,\n    int? lastOrderId,\n    int pageSize,\n    CancellationToken ct)\n{\n    var sql = lastCreatedAt == null\n        ? @\"SELECT TOP(@PageSize) * FROM Orders ORDER BY CreatedAt DESC, OrderId DESC\"\n        : @\"SELECT TOP(@PageSize) * FROM Orders\n           WHERE CreatedAt < @LastCreatedAt\n              OR (CreatedAt = @LastCreatedAt AND OrderId < @LastOrderId)\n           ORDER BY CreatedAt DESC, OrderId DESC\";\n\n    var orders = await _db.QueryAsync<Order>(sql, new\n    {\n        PageSize = pageSize,\n        LastCreatedAt = lastCreatedAt,\n        LastOrderId = lastOrderId\n    });\n\n    var ordersList = orders.ToList();\n\n    return new PagedResult<Order>\n    {\n        Items = ordersList,\n        PageSize = pageSize,\n        // Return cursor for next page\n        NextCursor = ordersList.Count > 0\n            ? new { ordersList.Last().CreatedAt, ordersList.Last().OrderId }\n            : null\n    };\n}\n// Consistent performance regardless of position in dataset",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Why keyset pagination:"
      },
      {
        "type": "list",
        "items": [
          "Constant performance (no OFFSET scan)",
          "Works for infinite scroll",
          "Handles concurrent writes (no missing/duplicate items)"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isSection": true,
    "id": "card-892"
  },
  {
    "question": "Configure Connection Pool",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// appsettings.json\n{\n  \"ConnectionStrings\": {\n    \"DefaultConnection\": \"Server=myserver;Database=mydb;User Id=user;Password=pass;\n                          Min Pool Size=10;\n                          Max Pool Size=100;\n                          Connection Lifetime=300;\n                          Connection Timeout=30;\n                          Pooling=true;\"\n  }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isSection": true,
    "id": "card-893"
  },
  {
    "question": "Pool Size Guidelines",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// Rule of thumb: Max Pool Size = (Number of CPU cores * 2) + effective spindle count\n// For cloud databases with connection limits:\n\npublic static class DatabaseConfig\n{\n    public static int CalculateMaxPoolSize(int maxConnections, int instanceCount)\n    {\n        // Leave 20% headroom for admin connections, background jobs\n        var usableConnections = (int)(maxConnections * 0.8);\n\n        // Divide among instances\n        return usableConnections / instanceCount;\n    }\n}\n\n// Example:\n// RDS PostgreSQL max_connections = 100\n// Running 4 instances\n// Max pool size per instance = (100 * 0.8) / 4 = 20 connections",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isSection": true,
    "id": "card-894"
  },
  {
    "question": "Monitor Connection Pool",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class DatabaseHealthCheck : IHealthCheck\n{\n    private readonly IDbConnection _db;\n\n    public async Task<HealthCheckResult> CheckHealthAsync(\n        HealthCheckContext context,\n        CancellationToken ct = default)\n    {\n        try\n        {\n            await _db.ExecuteScalarAsync<int>(\"SELECT 1\", cancellationToken: ct);\n\n            // For SqlConnection, check pool stats\n            if (_db is SqlConnection sqlConn)\n            {\n                SqlConnection.ClearPool(sqlConn); // Only for diagnostics, not production\n            }\n\n            return HealthCheckResult.Healthy(\"Database is reachable\");\n        }\n        catch (Exception ex)\n        {\n            return HealthCheckResult.Unhealthy(\"Database is unreachable\", ex);\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isSection": true,
    "id": "card-895"
  },
  {
    "question": "Setup Multi-Database Routing",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public enum DatabaseRole\n{\n    Primary,\n    Replica\n}\n\npublic interface IDatabaseConnectionFactory\n{\n    IDbConnection CreateConnection(DatabaseRole role);\n}\n\npublic class DatabaseConnectionFactory : IDatabaseConnectionFactory\n{\n    private readonly IConfiguration _config;\n\n    public IDbConnection CreateConnection(DatabaseRole role)\n    {\n        var connectionString = role == DatabaseRole.Primary\n            ? _config.GetConnectionString(\"Primary\")\n            : _config.GetConnectionString(\"Replica\");\n\n        return new SqlConnection(connectionString);\n    }\n}\n\n// Repository with read/write separation\npublic class OrderRepository\n{\n    private readonly IDatabaseConnectionFactory _dbFactory;\n\n    // Read from replica\n    public async Task<Order> GetOrderAsync(int orderId, CancellationToken ct)\n    {\n        using var db = _dbFactory.CreateConnection(DatabaseRole.Replica);\n        return await db.QueryFirstOrDefaultAsync<Order>(\n            \"SELECT * FROM Orders WHERE OrderId = @OrderId\",\n            new { OrderId = orderId }\n        );\n    }\n\n    // Write to primary\n    public async Task<int> CreateOrderAsync(Order order, CancellationToken ct)\n    {\n        using var db = _dbFactory.CreateConnection(DatabaseRole.Primary);\n        return await db.ExecuteAsync(@\"\n            INSERT INTO Orders (UserId, OrderTotal, Status, CreatedAt)\n            VALUES (@UserId, @OrderTotal, @Status, @CreatedAt)\",\n            order\n        );\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isSection": true,
    "id": "card-896"
  },
  {
    "question": "Handle Replication Lag",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class ReplicationAwareRepository\n{\n    private readonly IDatabaseConnectionFactory _dbFactory;\n\n    // After write, read from primary for consistency\n    public async Task<Order> CreateAndGetOrderAsync(Order order, CancellationToken ct)\n    {\n        using var db = _dbFactory.CreateConnection(DatabaseRole.Primary);\n\n        var orderId = await db.QuerySingleAsync<int>(@\"\n            INSERT INTO Orders (UserId, OrderTotal, Status, CreatedAt)\n            OUTPUT INSERTED.OrderId\n            VALUES (@UserId, @OrderTotal, @Status, @CreatedAt)\",\n            order\n        );\n\n        // Read from same connection (primary) to avoid replication lag\n        return await db.QueryFirstAsync<Order>(\n            \"SELECT * FROM Orders WHERE OrderId = @OrderId\",\n            new { OrderId = orderId }\n        );\n    }\n\n    // For eventual consistency scenarios\n    public async Task<Order?> GetOrderWithRetryAsync(int orderId, CancellationToken ct)\n    {\n        for (int attempt = 0; attempt < 3; attempt++)\n        {\n            using var db = _dbFactory.CreateConnection(DatabaseRole.Replica);\n            var order = await db.QueryFirstOrDefaultAsync<Order>(\n                \"SELECT * FROM Orders WHERE OrderId = @OrderId\",\n                new { OrderId = orderId }\n            );\n\n            if (order != null)\n                return order;\n\n            // Wait for replication\n            await Task.Delay(TimeSpan.FromMilliseconds(100), ct);\n        }\n\n        // Fall back to primary if still not found\n        using var primaryDb = _dbFactory.CreateConnection(DatabaseRole.Primary);\n        return await primaryDb.QueryFirstOrDefaultAsync<Order>(\n            \"SELECT * FROM Orders WHERE OrderId = @OrderId\",\n            new { OrderId = orderId }\n        );\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isSection": true,
    "id": "card-897"
  },
  {
    "question": "Horizontal Partitioning (Sharding by User ID)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface IShardingStrategy\n{\n    int GetShardId(int userId);\n    IDbConnection GetConnection(int shardId);\n}\n\npublic class UserIdShardingStrategy : IShardingStrategy\n{\n    private readonly IConfiguration _config;\n    private readonly int _shardCount;\n\n    public UserIdShardingStrategy(IConfiguration config)\n    {\n        _config = config;\n        _shardCount = _config.GetValue<int>(\"Sharding:ShardCount\");\n    }\n\n    public int GetShardId(int userId)\n    {\n        // Consistent hashing\n        return userId % _shardCount;\n    }\n\n    public IDbConnection GetConnection(int shardId)\n    {\n        var connectionString = _config.GetConnectionString($\"Shard{shardId}\");\n        return new SqlConnection(connectionString);\n    }\n}\n\npublic class ShardedOrderRepository\n{\n    private readonly IShardingStrategy _sharding;\n\n    // All queries must include userId for shard routing\n    public async Task<IEnumerable<Order>> GetUserOrdersAsync(\n        int userId,\n        CancellationToken ct)\n    {\n        var shardId = _sharding.GetShardId(userId);\n        using var db = _sharding.GetConnection(shardId);\n\n        return await db.QueryAsync<Order>(\n            \"SELECT * FROM Orders WHERE UserId = @UserId\",\n            new { UserId = userId }\n        );\n    }\n\n    // Cross-shard queries require scatter-gather\n    public async Task<int> GetTotalOrderCountAsync(CancellationToken ct)\n    {\n        var tasks = new List<Task<int>>();\n\n        for (int shardId = 0; shardId < _sharding.ShardCount; shardId++)\n        {\n            var shard = shardId; // Capture for closure\n            tasks.Add(Task.Run(async () =>\n            {\n                using var db = _sharding.GetConnection(shard);\n                return await db.ExecuteScalarAsync<int>(\"SELECT COUNT(*) FROM Orders\");\n            }, ct));\n        }\n\n        var results = await Task.WhenAll(tasks);\n        return results.Sum();\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Warning: Sharding adds complexity. Only shard when:"
      },
      {
        "type": "list",
        "items": [
          "Single database can't handle the load",
          "Data naturally partitions (by user, tenant, region)",
          "You've exhausted vertical scaling and read replicas"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isSection": true,
    "id": "card-898"
  },
  {
    "question": "Use Compiled Queries (EF Core)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderQueries\n{\n    // Compiled query: parsed once, executed many times\n    private static readonly Func<AppDbContext, int, Task<Order?>> _getOrderById =\n        EF.CompileAsyncQuery((AppDbContext db, int orderId) =>\n            db.Orders.FirstOrDefault(o => o.OrderId == orderId));\n\n    public async Task<Order?> GetOrderAsync(AppDbContext db, int orderId)\n    {\n        return await _getOrderById(db, orderId);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isSection": true,
    "id": "card-899"
  },
  {
    "question": "Use AsNoTracking for Read-Only Queries",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// ❌ Bad: Change tracking overhead for read-only data\nvar orders = await _dbContext.Orders.ToListAsync();\n\n// ✅ Good: No tracking = faster\nvar orders = await _dbContext.Orders.AsNoTracking().ToListAsync();",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isSection": true,
    "id": "card-900"
  },
  {
    "question": "Project Only Needed Columns",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// ❌ Bad: Selects all columns, loads entire object graph\nvar users = await _dbContext.Users\n    .Include(u => u.Orders)\n    .Include(u => u.Addresses)\n    .ToListAsync();\n\n// ✅ Good: Project to DTO with only needed data\nvar users = await _dbContext.Users\n    .Select(u => new UserSummaryDto\n    {\n        Id = u.Id,\n        Name = u.Name,\n        OrderCount = u.Orders.Count\n    })\n    .ToListAsync();",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isSection": true,
    "id": "card-901"
  },
  {
    "question": "Summary: Database Scaling Checklist",
    "answer": [
      {
        "type": "text",
        "content": "✅ Proper indexes: Composite indexes aligned with query patterns"
      },
      {
        "type": "text",
        "content": "✅ Avoid N+1: Use JOINs or batch loading"
      },
      {
        "type": "text",
        "content": "✅ Keyset pagination: For large datasets"
      },
      {
        "type": "text",
        "content": "✅ Connection pooling: Tune pool size for your workload"
      },
      {
        "type": "text",
        "content": "✅ Read replicas: For read-heavy workloads"
      },
      {
        "type": "text",
        "content": "✅ Sharding: Only when necessary, with clear partition key"
      },
      {
        "type": "text",
        "content": "✅ Query optimization: Compiled queries, AsNoTracking, projection"
      },
      {
        "type": "text",
        "content": "✅ Monitor: Slow query log, index usage, connection pool stats"
      },
      {
        "type": "text",
        "content": "Key Insight: Most performance problems are query problems. Indexing, N+1 elimination, and proper pagination solve 90% of database issues."
      },
      {
        "type": "text",
        "content": "Next: Message Queues & Async Processing - Decouple heavy work from request/response cycle."
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isSection": true,
    "id": "card-902"
  },
  {
    "question": "2. Avoid N+1 Query Problem",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// Loads 1 query for users, then 1 query per user for orders = N+1 queries\npublic async Task<List<UserWithOrders>> GetUsersWithOrdersBad(CancellationToken ct)\n{\n    var users = await _db.QueryAsync<User>(\"SELECT * FROM Users\");\n\n    var result = new List<UserWithOrders>();\n    foreach (var user in users) // N iterations\n    {\n        // 🔥 1 query per user!\n        var orders = await _db.QueryAsync<Order>(\n            \"SELECT * FROM Orders WHERE UserId = @UserId\",\n            new { UserId = user.Id }\n        );\n\n        result.Add(new UserWithOrders { User = user, Orders = orders.ToList() });\n    }\n\n    return result;\n}\n// 1 + N queries for N users = 1,001 queries for 1,000 users",
        "codeType": "bad"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isConcept": true,
    "id": "card-903"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public async Task<List<UserWithOrders>> GetUsersWithOrdersJoin(CancellationToken ct)\n{\n    var sql = @\"\n        SELECT\n            u.Id, u.Name, u.Email,\n            o.OrderId, o.UserId, o.OrderTotal, o.CreatedAt\n        FROM Users u\n        LEFT JOIN Orders o ON u.Id = o.UserId\";\n\n    var userDictionary = new Dictionary<int, UserWithOrders>();\n\n    await _db.QueryAsync<User, Order, UserWithOrders>(\n        sql,\n        (user, order) =>\n        {\n            if (!userDictionary.TryGetValue(user.Id, out var userWithOrders))\n            {\n                userWithOrders = new UserWithOrders { User = user, Orders = new List<Order>() };\n                userDictionary.Add(user.Id, userWithOrders);\n            }\n\n            if (order != null)\n            {\n                userWithOrders.Orders.Add(order);\n            }\n\n            return userWithOrders;\n        },\n        splitOn: \"OrderId\"\n    );\n\n    return userDictionary.Values.ToList();\n}\n// 1 query total",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isConcept": true,
    "id": "card-904"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public async Task<List<UserWithOrders>> GetUsersWithOrdersBatched(CancellationToken ct)\n{\n    // 1 query: get all users\n    var users = (await _db.QueryAsync<User>(\"SELECT * FROM Users\")).ToList();\n\n    var userIds = users.Select(u => u.Id).ToList();\n\n    // 2nd query: get all orders for these users in one query\n    var orders = (await _db.QueryAsync<Order>(\n        \"SELECT * FROM Orders WHERE UserId IN @UserIds\",\n        new { UserIds = userIds }\n    )).ToList();\n\n    // Group in memory\n    var ordersByUser = orders.GroupBy(o => o.UserId).ToDictionary(g => g.Key, g => g.ToList());\n\n    return users.Select(u => new UserWithOrders\n    {\n        User = u,\n        Orders = ordersByUser.GetValueOrDefault(u.Id, new List<Order>())\n    }).ToList();\n}\n// 2 queries total, regardless of number of users",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isConcept": true,
    "id": "card-905"
  },
  {
    "question": "3. Pagination: Never Use OFFSET for Large Tables",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// Page 1,000 of 10,000,000 records = scans 1,000,000 rows\npublic async Task<PagedResult<Order>> GetOrdersOffset(int page, int pageSize, CancellationToken ct)\n{\n    var offset = (page - 1) * pageSize;\n\n    var orders = await _db.QueryAsync<Order>(@\"\n        SELECT * FROM Orders\n        ORDER BY CreatedAt DESC\n        OFFSET @Offset ROWS\n        FETCH NEXT @PageSize ROWS ONLY\",\n        new { Offset = offset, PageSize = pageSize }\n    );\n\n    var total = await _db.ExecuteScalarAsync<int>(\"SELECT COUNT(*) FROM Orders\");\n\n    return new PagedResult<Order>\n    {\n        Items = orders.ToList(),\n        TotalCount = total,\n        Page = page,\n        PageSize = pageSize\n    };\n}\n// Performance degrades linearly with page number",
        "codeType": "bad"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isConcept": true,
    "id": "card-906"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public async Task<PagedResult<Order>> GetOrdersKeyset(\n    DateTime? lastCreatedAt,\n    int? lastOrderId,\n    int pageSize,\n    CancellationToken ct)\n{\n    var sql = lastCreatedAt == null\n        ? @\"SELECT TOP(@PageSize) * FROM Orders ORDER BY CreatedAt DESC, OrderId DESC\"\n        : @\"SELECT TOP(@PageSize) * FROM Orders\n           WHERE CreatedAt < @LastCreatedAt\n              OR (CreatedAt = @LastCreatedAt AND OrderId < @LastOrderId)\n           ORDER BY CreatedAt DESC, OrderId DESC\";\n\n    var orders = await _db.QueryAsync<Order>(sql, new\n    {\n        PageSize = pageSize,\n        LastCreatedAt = lastCreatedAt,\n        LastOrderId = lastOrderId\n    });\n\n    var ordersList = orders.ToList();\n\n    return new PagedResult<Order>\n    {\n        Items = ordersList,\n        PageSize = pageSize,\n        // Return cursor for next page\n        NextCursor = ordersList.Count > 0\n            ? new { ordersList.Last().CreatedAt, ordersList.Last().OrderId }\n            : null\n    };\n}\n// Consistent performance regardless of position in dataset",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/04-database-scaling.md",
    "isConcept": true,
    "id": "card-907"
  },
  {
    "question": "Why Message Queues Matter",
    "answer": [
      {
        "type": "text",
        "content": "The Problem:"
      },
      {
        "type": "list",
        "items": [
          "User submits order → triggers inventory check, payment, email, SMS, analytics",
          "If all happen synchronously: slow response (5+ seconds)",
          "If any fails: entire request fails",
          "Under load: threads blocked waiting for slow operations"
        ]
      },
      {
        "type": "text",
        "content": "The Solution:"
      },
      {
        "type": "list",
        "items": [
          "Accept request → validate → return 202 Accepted (fast)",
          "Push work to queue → background workers process",
          "User gets instant response, work happens asynchronously"
        ]
      },
      {
        "type": "text",
        "content": "Key Benefits:"
      },
      {
        "type": "list",
        "items": [
          "Fast response times",
          "Fault tolerance (retry failed work)",
          "Load leveling (workers process at sustainable rate)",
          "Scalability (add more workers independently)"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/05-message-queues.md",
    "isSection": true,
    "id": "card-908"
  },
  {
    "question": "Channel-Based Background Queue",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface IBackgroundTaskQueue\n{\n    ValueTask QueueAsync(Func<CancellationToken, ValueTask> workItem);\n    ValueTask<Func<CancellationToken, ValueTask>> DequeueAsync(CancellationToken ct);\n}\n\npublic class BackgroundTaskQueue : IBackgroundTaskQueue\n{\n    private readonly Channel<Func<CancellationToken, ValueTask>> _queue;\n\n    public BackgroundTaskQueue(int capacity = 1000)\n    {\n        var options = new BoundedChannelOptions(capacity)\n        {\n            FullMode = BoundedChannelFullMode.Wait // Block when full\n        };\n        _queue = Channel.CreateBounded<Func<CancellationToken, ValueTask>>(options);\n    }\n\n    public async ValueTask QueueAsync(Func<CancellationToken, ValueTask> workItem)\n    {\n        if (workItem == null)\n            throw new ArgumentNullException(nameof(workItem));\n\n        await _queue.Writer.WriteAsync(workItem);\n    }\n\n    public async ValueTask<Func<CancellationToken, ValueTask>> DequeueAsync(\n        CancellationToken ct)\n    {\n        var workItem = await _queue.Reader.ReadAsync(ct);\n        return workItem;\n    }\n}\n\n// Background service to process queue\npublic class QueuedHostedService : BackgroundService\n{\n    private readonly IBackgroundTaskQueue _taskQueue;\n    private readonly ILogger<QueuedHostedService> _logger;\n\n    public QueuedHostedService(\n        IBackgroundTaskQueue taskQueue,\n        ILogger<QueuedHostedService> logger)\n    {\n        _taskQueue = taskQueue;\n        _logger = logger;\n    }\n\n    protected override async Task ExecuteAsync(CancellationToken stoppingToken)\n    {\n        _logger.LogInformation(\"Queued Hosted Service is starting.\");\n\n        while (!stoppingToken.IsCancellationRequested)\n        {\n            try\n            {\n                var workItem = await _taskQueue.DequeueAsync(stoppingToken);\n\n                await workItem(stoppingToken);\n            }\n            catch (OperationCanceledException)\n            {\n                // Expected on shutdown\n            }\n            catch (Exception ex)\n            {\n                _logger.LogError(ex, \"Error occurred executing task work item.\");\n            }\n        }\n\n        _logger.LogInformation(\"Queued Hosted Service is stopping.\");\n    }\n}\n\n// Usage in controller\n[ApiController]\n[Route(\"api/[controller]\")]\npublic class OrderController : ControllerBase\n{\n    private readonly IBackgroundTaskQueue _queue;\n    private readonly IEmailService _emailService;\n\n    [HttpPost]\n    public async Task<IActionResult> CreateOrderAsync(\n        CreateOrderRequest request,\n        CancellationToken ct)\n    {\n        // Validate and create order (fast, synchronous)\n        var orderId = await CreateOrderInDbAsync(request, ct);\n\n        // Queue background work (email, analytics, etc.)\n        await _queue.QueueAsync(async token =>\n        {\n            await _emailService.SendOrderConfirmationAsync(orderId, token);\n            await _analyticsService.TrackOrderAsync(orderId, token);\n        });\n\n        // Return immediately\n        return Accepted(new { orderId, message = \"Order created successfully\" });\n    }\n}\n\n// Registration\nbuilder.Services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>();\nbuilder.Services.AddHostedService<QueuedHostedService>();",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "When to use:"
      },
      {
        "type": "list",
        "items": [
          "Single-instance deployments",
          "Non-critical background work (failures acceptable)",
          "Low volume (< 1000 jobs/minute)"
        ]
      },
      {
        "type": "text",
        "content": "When NOT to use:"
      },
      {
        "type": "list",
        "items": [
          "Multi-instance deployments (work lost on restart)",
          "Mission-critical work (no durability)",
          "High volume (needs distributed queue)"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/05-message-queues.md",
    "isSection": true,
    "id": "card-909"
  },
  {
    "question": "Setup RabbitMQ Client",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// Install: RabbitMQ.Client\n// appsettings.json\n{\n  \"RabbitMQ\": {\n    \"Host\": \"localhost\",\n    \"Port\": 5672,\n    \"Username\": \"guest\",\n    \"Password\": \"guest\",\n    \"VirtualHost\": \"/\"\n  }\n}\n\n// Connection factory\npublic interface IRabbitMQConnection\n{\n    IConnection GetConnection();\n}\n\npublic class RabbitMQConnection : IRabbitMQConnection, IDisposable\n{\n    private readonly IConfiguration _config;\n    private IConnection? _connection;\n    private readonly object _lock = new();\n\n    public RabbitMQConnection(IConfiguration config)\n    {\n        _config = config;\n    }\n\n    public IConnection GetConnection()\n    {\n        if (_connection != null && _connection.IsOpen)\n            return _connection;\n\n        lock (_lock)\n        {\n            if (_connection != null && _connection.IsOpen)\n                return _connection;\n\n            var factory = new ConnectionFactory\n            {\n                HostName = _config[\"RabbitMQ:Host\"],\n                Port = _config.GetValue<int>(\"RabbitMQ:Port\"),\n                UserName = _config[\"RabbitMQ:Username\"],\n                Password = _config[\"RabbitMQ:Password\"],\n                VirtualHost = _config[\"RabbitMQ:VirtualHost\"],\n                AutomaticRecoveryEnabled = true,\n                NetworkRecoveryInterval = TimeSpan.FromSeconds(10),\n                RequestedHeartbeat = TimeSpan.FromSeconds(60)\n            };\n\n            _connection = factory.CreateConnection();\n            return _connection;\n        }\n    }\n\n    public void Dispose()\n    {\n        _connection?.Close();\n        _connection?.Dispose();\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/05-message-queues.md",
    "isSection": true,
    "id": "card-910"
  },
  {
    "question": "Publisher: Queue Messages",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface IMessagePublisher\n{\n    Task PublishAsync<T>(string queueName, T message, CancellationToken ct);\n}\n\npublic class RabbitMQPublisher : IMessagePublisher\n{\n    private readonly IRabbitMQConnection _rabbitConnection;\n    private readonly ILogger<RabbitMQPublisher> _logger;\n\n    public RabbitMQPublisher(\n        IRabbitMQConnection rabbitConnection,\n        ILogger<RabbitMQPublisher> logger)\n    {\n        _rabbitConnection = rabbitConnection;\n        _logger = logger;\n    }\n\n    public Task PublishAsync<T>(string queueName, T message, CancellationToken ct)\n    {\n        try\n        {\n            using var channel = _rabbitConnection.GetConnection().CreateModel();\n\n            // Declare queue (idempotent)\n            channel.QueueDeclare(\n                queue: queueName,\n                durable: true, // Survives broker restart\n                exclusive: false,\n                autoDelete: false,\n                arguments: null\n            );\n\n            var json = JsonSerializer.Serialize(message);\n            var body = Encoding.UTF8.GetBytes(json);\n\n            var properties = channel.CreateBasicProperties();\n            properties.Persistent = true; // Message survives restart\n            properties.ContentType = \"application/json\";\n            properties.DeliveryMode = 2; // Persistent\n\n            channel.BasicPublish(\n                exchange: \"\",\n                routingKey: queueName,\n                basicProperties: properties,\n                body: body\n            );\n\n            _logger.LogInformation(\n                \"Published message to queue {Queue}: {Message}\",\n                queueName,\n                json\n            );\n\n            return Task.CompletedTask;\n        }\n        catch (Exception ex)\n        {\n            _logger.LogError(ex, \"Failed to publish message to queue {Queue}\", queueName);\n            throw;\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/05-message-queues.md",
    "isSection": true,
    "id": "card-911"
  },
  {
    "question": "Consumer: Process Messages",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderProcessingConsumer : BackgroundService\n{\n    private readonly IRabbitMQConnection _rabbitConnection;\n    private readonly IServiceProvider _serviceProvider;\n    private readonly ILogger<OrderProcessingConsumer> _logger;\n    private IModel? _channel;\n\n    public OrderProcessingConsumer(\n        IRabbitMQConnection rabbitConnection,\n        IServiceProvider serviceProvider,\n        ILogger<OrderProcessingConsumer> logger)\n    {\n        _rabbitConnection = rabbitConnection;\n        _serviceProvider = serviceProvider;\n        _logger = logger;\n    }\n\n    protected override Task ExecuteAsync(CancellationToken stoppingToken)\n    {\n        _channel = _rabbitConnection.GetConnection().CreateModel();\n\n        // Set prefetch count: how many messages to fetch at once\n        _channel.BasicQos(\n            prefetchSize: 0,\n            prefetchCount: 10, // Process 10 messages at a time\n            global: false\n        );\n\n        var queueName = \"order-processing\";\n        _channel.QueueDeclare(\n            queue: queueName,\n            durable: true,\n            exclusive: false,\n            autoDelete: false,\n            arguments: null\n        );\n\n        var consumer = new EventingBasicConsumer(_channel);\n\n        consumer.Received += async (model, ea) =>\n        {\n            var body = ea.Body.ToArray();\n            var message = Encoding.UTF8.GetString(body);\n\n            try\n            {\n                var order = JsonSerializer.Deserialize<OrderMessage>(message);\n\n                _logger.LogInformation(\n                    \"Processing order {OrderId}\",\n                    order?.OrderId\n                );\n\n                // Process with scoped services\n                using var scope = _serviceProvider.CreateScope();\n                var orderService = scope.ServiceProvider.GetRequiredService<IOrderService>();\n\n                await orderService.ProcessOrderAsync(order!, stoppingToken);\n\n                // Acknowledge message (remove from queue)\n                _channel.BasicAck(ea.DeliveryTag, multiple: false);\n\n                _logger.LogInformation(\"Order {OrderId} processed successfully\", order?.OrderId);\n            }\n            catch (Exception ex)\n            {\n                _logger.LogError(ex, \"Error processing message: {Message}\", message);\n\n                // Reject and requeue (will retry)\n                // Use dead-letter queue for poison messages\n                _channel.BasicNack(\n                    deliveryTag: ea.DeliveryTag,\n                    multiple: false,\n                    requeue: ea.BasicProperties.Headers?.ContainsKey(\"x-retry-count\") != true\n                );\n            }\n        };\n\n        _channel.BasicConsume(\n            queue: queueName,\n            autoAck: false, // Manual acknowledgment\n            consumer: consumer\n        );\n\n        return Task.CompletedTask;\n    }\n\n    public override void Dispose()\n    {\n        _channel?.Close();\n        _channel?.Dispose();\n        base.Dispose();\n    }\n}\n\npublic record OrderMessage(int OrderId, int UserId, decimal Total);",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/05-message-queues.md",
    "isSection": true,
    "id": "card-912"
  },
  {
    "question": "Dead Letter Queue (DLQ) for Failed Messages",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class QueueSetup\n{\n    public static void ConfigureQueuesWithDLQ(IModel channel)\n    {\n        var dlqName = \"order-processing-dlq\";\n        var mainQueueName = \"order-processing\";\n\n        // Create DLQ\n        channel.QueueDeclare(\n            queue: dlqName,\n            durable: true,\n            exclusive: false,\n            autoDelete: false,\n            arguments: null\n        );\n\n        // Create main queue with DLQ configured\n        var args = new Dictionary<string, object>\n        {\n            { \"x-dead-letter-exchange\", \"\" },\n            { \"x-dead-letter-routing-key\", dlqName },\n            { \"x-message-ttl\", 3600000 } // 1 hour TTL\n        };\n\n        channel.QueueDeclare(\n            queue: mainQueueName,\n            durable: true,\n            exclusive: false,\n            autoDelete: false,\n            arguments: args\n        );\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/05-message-queues.md",
    "isSection": true,
    "id": "card-913"
  },
  {
    "question": "Idempotency Key Pattern",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class IdempotentOrderService\n{\n    private readonly IDbConnection _db;\n    private readonly ILogger<IdempotentOrderService> _logger;\n\n    public async Task ProcessPaymentAsync(\n        PaymentMessage message,\n        CancellationToken ct)\n    {\n        var idempotencyKey = message.IdempotencyKey;\n\n        // Check if already processed\n        var existing = await _db.QueryFirstOrDefaultAsync<ProcessedMessage>(\n            \"SELECT * FROM ProcessedMessages WHERE IdempotencyKey = @Key\",\n            new { Key = idempotencyKey }\n        );\n\n        if (existing != null)\n        {\n            _logger.LogInformation(\n                \"Payment {IdempotencyKey} already processed, skipping\",\n                idempotencyKey\n            );\n            return;\n        }\n\n        // Process payment\n        using var transaction = _db.BeginTransaction();\n        try\n        {\n            await ProcessPaymentInternalAsync(message, ct);\n\n            // Mark as processed\n            await _db.ExecuteAsync(@\"\n                INSERT INTO ProcessedMessages (IdempotencyKey, ProcessedAt, MessageData)\n                VALUES (@Key, @ProcessedAt, @Data)\",\n                new\n                {\n                    Key = idempotencyKey,\n                    ProcessedAt = DateTime.UtcNow,\n                    Data = JsonSerializer.Serialize(message)\n                },\n                transaction: transaction\n            );\n\n            transaction.Commit();\n\n            _logger.LogInformation(\"Payment {IdempotencyKey} processed\", idempotencyKey);\n        }\n        catch (Exception ex)\n        {\n            transaction.Rollback();\n            _logger.LogError(ex, \"Failed to process payment {IdempotencyKey}\", idempotencyKey);\n            throw;\n        }\n    }\n}\n\npublic record PaymentMessage(\n    string IdempotencyKey, // GUID or composite key\n    int OrderId,\n    decimal Amount\n);\n\n// Table schema\n/*\nCREATE TABLE ProcessedMessages (\n    IdempotencyKey NVARCHAR(255) PRIMARY KEY,\n    ProcessedAt DATETIME2 NOT NULL,\n    MessageData NVARCHAR(MAX) NOT NULL,\n    INDEX IX_ProcessedMessages_ProcessedAt (ProcessedAt) -- For cleanup\n);\n*/",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/05-message-queues.md",
    "isSection": true,
    "id": "card-914"
  },
  {
    "question": "The Problem",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// ❌ Race condition: DB commits but message publish fails\nawait _db.ExecuteAsync(\"INSERT INTO Orders ...\");\nawait _messagePublisher.PublishAsync(\"order-created\", orderMessage); // Fails = lost event",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/05-message-queues.md",
    "isSection": true,
    "id": "card-915"
  },
  {
    "question": "The Solution: Outbox Pattern",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OutboxMessage\n{\n    public Guid Id { get; set; }\n    public string QueueName { get; set; } = string.Empty;\n    public string Payload { get; set; } = string.Empty;\n    public DateTime CreatedAt { get; set; }\n    public DateTime? ProcessedAt { get; set; }\n    public int RetryCount { get; set; }\n}\n\npublic class OrderServiceWithOutbox\n{\n    private readonly IDbConnection _db;\n\n    public async Task CreateOrderAsync(Order order, CancellationToken ct)\n    {\n        using var transaction = _db.BeginTransaction();\n\n        try\n        {\n            // Insert order\n            await _db.ExecuteAsync(@\"\n                INSERT INTO Orders (UserId, Total, Status, CreatedAt)\n                VALUES (@UserId, @Total, @Status, @CreatedAt)\",\n                order,\n                transaction: transaction\n            );\n\n            // Insert outbox message in same transaction\n            var outboxMessage = new OutboxMessage\n            {\n                Id = Guid.NewGuid(),\n                QueueName = \"order-created\",\n                Payload = JsonSerializer.Serialize(new OrderCreatedEvent\n                {\n                    OrderId = order.Id,\n                    UserId = order.UserId,\n                    Total = order.Total\n                }),\n                CreatedAt = DateTime.UtcNow\n            };\n\n            await _db.ExecuteAsync(@\"\n                INSERT INTO OutboxMessages (Id, QueueName, Payload, CreatedAt)\n                VALUES (@Id, @QueueName, @Payload, @CreatedAt)\",\n                outboxMessage,\n                transaction: transaction\n            );\n\n            transaction.Commit();\n        }\n        catch\n        {\n            transaction.Rollback();\n            throw;\n        }\n    }\n}\n\n// Background service to publish outbox messages\npublic class OutboxPublisher : BackgroundService\n{\n    private readonly IDbConnection _db;\n    private readonly IMessagePublisher _publisher;\n    private readonly ILogger<OutboxPublisher> _logger;\n\n    protected override async Task ExecuteAsync(CancellationToken stoppingToken)\n    {\n        while (!stoppingToken.IsCancellationRequested)\n        {\n            try\n            {\n                // Fetch unprocessed messages\n                var messages = await _db.QueryAsync<OutboxMessage>(@\"\n                    SELECT TOP 100 * FROM OutboxMessages\n                    WHERE ProcessedAt IS NULL AND RetryCount < 5\n                    ORDER BY CreatedAt\");\n\n                foreach (var message in messages)\n                {\n                    try\n                    {\n                        await _publisher.PublishAsync(\n                            message.QueueName,\n                            message.Payload,\n                            stoppingToken\n                        );\n\n                        // Mark as processed\n                        await _db.ExecuteAsync(@\"\n                            UPDATE OutboxMessages\n                            SET ProcessedAt = @ProcessedAt\n                            WHERE Id = @Id\",\n                            new { ProcessedAt = DateTime.UtcNow, Id = message.Id }\n                        );\n                    }\n                    catch (Exception ex)\n                    {\n                        _logger.LogError(ex, \"Failed to publish outbox message {Id}\", message.Id);\n\n                        // Increment retry count\n                        await _db.ExecuteAsync(@\"\n                            UPDATE OutboxMessages\n                            SET RetryCount = RetryCount + 1\n                            WHERE Id = @Id\",\n                            new { Id = message.Id }\n                        );\n                    }\n                }\n\n                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);\n            }\n            catch (Exception ex)\n            {\n                _logger.LogError(ex, \"Error in outbox publisher\");\n                await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);\n            }\n        }\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Why Outbox Pattern:"
      },
      {
        "type": "list",
        "items": [
          "Atomic: DB write and message enqueue in same transaction",
          "Reliable: No lost messages",
          "At-least-once delivery guaranteed"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/05-message-queues.md",
    "isSection": true,
    "id": "card-916"
  },
  {
    "question": "Setup MassTransit with RabbitMQ",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// Install: MassTransit.RabbitMQ\n\nbuilder.Services.AddMassTransit(x =>\n{\n    // Register consumers\n    x.AddConsumer<OrderCreatedConsumer>();\n\n    x.UsingRabbitMq((context, cfg) =>\n    {\n        cfg.Host(\"localhost\", \"/\", h =>\n        {\n            h.Username(\"guest\");\n            h.Password(\"guest\");\n        });\n\n        // Configure retry\n        cfg.UseMessageRetry(r => r.Incremental(\n            retryLimit: 5,\n            initialInterval: TimeSpan.FromSeconds(1),\n            intervalIncrement: TimeSpan.FromSeconds(2)\n        ));\n\n        // Configure endpoints\n        cfg.ConfigureEndpoints(context);\n    });\n});\n\n// Consumer\npublic class OrderCreatedConsumer : IConsumer<OrderCreatedEvent>\n{\n    private readonly ILogger<OrderCreatedConsumer> _logger;\n    private readonly IEmailService _emailService;\n\n    public async Task Consume(ConsumeContext<OrderCreatedEvent> context)\n    {\n        var order = context.Message;\n\n        _logger.LogInformation(\"Processing order created event: {OrderId}\", order.OrderId);\n\n        await _emailService.SendOrderConfirmationAsync(order.OrderId, context.CancellationToken);\n\n        // Message automatically acknowledged on success\n        // Automatically retried on exception (per retry policy)\n    }\n}\n\n// Publisher\npublic class OrderService\n{\n    private readonly IPublishEndpoint _publishEndpoint;\n\n    public async Task CreateOrderAsync(Order order, CancellationToken ct)\n    {\n        // Save to database\n        await SaveOrderAsync(order, ct);\n\n        // Publish event\n        await _publishEndpoint.Publish(new OrderCreatedEvent\n        {\n            OrderId = order.Id,\n            UserId = order.UserId,\n            Total = order.Total\n        }, ct);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/05-message-queues.md",
    "isSection": true,
    "id": "card-917"
  },
  {
    "question": "Summary: Message Queue Checklist",
    "answer": [
      {
        "type": "text",
        "content": "✅ In-process queues: For simple, single-instance scenarios"
      },
      {
        "type": "text",
        "content": "✅ RabbitMQ/Kafka: For distributed, durable message queues"
      },
      {
        "type": "text",
        "content": "✅ Idempotency: All message handlers are idempotent"
      },
      {
        "type": "text",
        "content": "✅ Dead letter queues: For poison messages"
      },
      {
        "type": "text",
        "content": "✅ Outbox pattern: For transactional messaging"
      },
      {
        "type": "text",
        "content": "✅ Retry policies: Exponential backoff, max retries"
      },
      {
        "type": "text",
        "content": "✅ Monitoring: Queue depth, processing time, error rate"
      },
      {
        "type": "text",
        "content": "Key Insight: Async processing via queues is what enables scale. Fast API responses + reliable background processing = happy users + stable system."
      },
      {
        "type": "text",
        "content": "Next: Resilience Patterns - Handle failures gracefully."
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/05-message-queues.md",
    "isSection": true,
    "id": "card-918"
  },
  {
    "question": "Why Resilience is Critical at Scale",
    "answer": [
      {
        "type": "text",
        "content": "The Reality:"
      },
      {
        "type": "list",
        "items": [
          "Networks fail",
          "Services go down",
          "Databases get slow",
          "Dependencies time out"
        ]
      },
      {
        "type": "text",
        "content": "At scale, failures are not edge cases — they're guaranteed."
      },
      {
        "type": "text",
        "content": "Key Principle: Design for failure. Your system should degrade gracefully, not catastrophically."
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/06-resilience-patterns.md",
    "isSection": true,
    "id": "card-919"
  },
  {
    "question": "❌ Bad: No Timeout",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class PaymentService\n{\n    private readonly HttpClient _httpClient;\n\n    public async Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request)\n    {\n        // 🔥 No timeout = can hang forever\n        var response = await _httpClient.PostAsJsonAsync(\n            \"https://payment-gateway/charge\",\n            request\n        );\n\n        return await response.Content.ReadFromJsonAsync<PaymentResult>();\n    }\n}\n// Under load: all threads hang waiting for slow gateway → system dies",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/06-resilience-patterns.md",
    "isSection": true,
    "id": "card-920"
  },
  {
    "question": "✅ Good: Always Set Timeouts",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class PaymentService\n{\n    private readonly HttpClient _httpClient;\n    private readonly ILogger<PaymentService> _logger;\n\n    public PaymentService(HttpClient httpClient, ILogger<PaymentService> logger)\n    {\n        _httpClient = httpClient;\n        _logger = logger;\n\n        // Set default timeout at HttpClient level\n        _httpClient.Timeout = TimeSpan.FromSeconds(10);\n    }\n\n    public async Task<PaymentResult> ProcessPaymentAsync(\n        PaymentRequest request,\n        CancellationToken ct)\n    {\n        try\n        {\n            // Per-request timeout (overrides default)\n            using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);\n            cts.CancelAfter(TimeSpan.FromSeconds(5));\n\n            var response = await _httpClient.PostAsJsonAsync(\n                \"https://payment-gateway/charge\",\n                request,\n                cts.Token\n            );\n\n            response.EnsureSuccessStatusCode();\n            return await response.Content.ReadFromJsonAsync<PaymentResult>(cts.Token);\n        }\n        catch (TaskCanceledException ex)\n        {\n            _logger.LogWarning(ex, \"Payment gateway timeout for request {RequestId}\", request.Id);\n            throw new PaymentTimeoutException(\"Payment processing timed out\", ex);\n        }\n        catch (HttpRequestException ex)\n        {\n            _logger.LogError(ex, \"Payment gateway error for request {RequestId}\", request.Id);\n            throw new PaymentFailedException(\"Payment gateway unavailable\", ex);\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/06-resilience-patterns.md",
    "isSection": true,
    "id": "card-921"
  },
  {
    "question": "Database Timeouts",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderRepository\n{\n    private readonly IDbConnection _db;\n\n    public async Task<Order> GetOrderAsync(int orderId, CancellationToken ct)\n    {\n        // Dapper: use CommandDefinition for timeout\n        var command = new CommandDefinition(\n            commandText: \"SELECT * FROM Orders WHERE OrderId = @OrderId\",\n            parameters: new { OrderId = orderId },\n            commandTimeout: 5, // 5 seconds\n            cancellationToken: ct\n        );\n\n        return await _db.QueryFirstOrDefaultAsync<Order>(command);\n    }\n}\n\n// EF Core: set timeout\npublic class AppDbContext : DbContext\n{\n    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)\n    {\n        optionsBuilder.UseSqlServer(\n            connectionString,\n            options => options.CommandTimeout(5) // 5 seconds\n        );\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Timeout Guidelines:"
      },
      {
        "type": "list",
        "items": [
          "HTTP calls: 5-10 seconds",
          "Database queries: 3-5 seconds",
          "Third-party APIs: 10-30 seconds (depends on SLA)",
          "Internal microservices: 2-5 seconds"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/06-resilience-patterns.md",
    "isSection": true,
    "id": "card-922"
  },
  {
    "question": "The Pattern",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "Closed (normal) → failures exceed threshold → Open (reject immediately)\n                ↓\nOpen → after timeout → Half-Open (try one request)\n                ↓\nHalf-Open → success → Closed (resume normal)\nHalf-Open → failure → Open (back to rejecting)",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/06-resilience-patterns.md",
    "isSection": true,
    "id": "card-923"
  },
  {
    "question": "Using Polly Library",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// Install: Polly, Microsoft.Extensions.Http.Polly\n\n// Program.cs\nbuilder.Services.AddHttpClient<IInventoryService, InventoryService>(client =>\n{\n    client.BaseAddress = new Uri(\"https://inventory-api\");\n    client.Timeout = TimeSpan.FromSeconds(10);\n})\n.AddTransientHttpErrorPolicy(policyBuilder =>\n    policyBuilder.CircuitBreakerAsync(\n        handledEventsAllowedBeforeBreaking: 5, // Open after 5 failures\n        durationOfBreak: TimeSpan.FromSeconds(30) // Stay open for 30 seconds\n    )\n)\n.AddTransientHttpErrorPolicy(policyBuilder =>\n    policyBuilder.WaitAndRetryAsync(new[]\n    {\n        TimeSpan.FromSeconds(1),\n        TimeSpan.FromSeconds(2),\n        TimeSpan.FromSeconds(4)\n    })\n);\n\n// Service\npublic class InventoryService : IInventoryService\n{\n    private readonly HttpClient _httpClient;\n    private readonly ILogger<InventoryService> _logger;\n\n    // HttpClient already has circuit breaker from configuration\n    public async Task<InventoryStatus> CheckInventoryAsync(\n        int productId,\n        CancellationToken ct)\n    {\n        try\n        {\n            var response = await _httpClient.GetAsync($\"/api/inventory/{productId}\", ct);\n            response.EnsureSuccessStatusCode();\n            return await response.Content.ReadFromJsonAsync<InventoryStatus>(ct);\n        }\n        catch (BrokenCircuitException ex)\n        {\n            _logger.LogWarning(\n                \"Circuit breaker open for inventory service, product {ProductId}\",\n                productId\n            );\n\n            // Return fallback value\n            return new InventoryStatus { Available = false, Reason = \"Service unavailable\" };\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/06-resilience-patterns.md",
    "isSection": true,
    "id": "card-924"
  },
  {
    "question": "Manual Circuit Breaker Implementation",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class CircuitBreaker\n{\n    private readonly int _threshold;\n    private readonly TimeSpan _timeout;\n    private int _failureCount;\n    private DateTime _lastFailureTime;\n    private CircuitState _state = CircuitState.Closed;\n    private readonly object _lock = new();\n\n    public CircuitBreaker(int threshold, TimeSpan timeout)\n    {\n        _threshold = threshold;\n        _timeout = timeout;\n    }\n\n    public async Task<T> ExecuteAsync<T>(Func<Task<T>> operation)\n    {\n        lock (_lock)\n        {\n            if (_state == CircuitState.Open)\n            {\n                if (DateTime.UtcNow - _lastFailureTime > _timeout)\n                {\n                    _state = CircuitState.HalfOpen;\n                }\n                else\n                {\n                    throw new CircuitBreakerOpenException(\"Circuit breaker is open\");\n                }\n            }\n        }\n\n        try\n        {\n            var result = await operation();\n\n            lock (_lock)\n            {\n                if (_state == CircuitState.HalfOpen)\n                {\n                    _state = CircuitState.Closed;\n                    _failureCount = 0;\n                }\n            }\n\n            return result;\n        }\n        catch (Exception)\n        {\n            lock (_lock)\n            {\n                _failureCount++;\n                _lastFailureTime = DateTime.UtcNow;\n\n                if (_failureCount >= _threshold)\n                {\n                    _state = CircuitState.Open;\n                }\n            }\n\n            throw;\n        }\n    }\n}\n\npublic enum CircuitState\n{\n    Closed,\n    Open,\n    HalfOpen\n}\n\npublic class CircuitBreakerOpenException : Exception\n{\n    public CircuitBreakerOpenException(string message) : base(message) { }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/06-resilience-patterns.md",
    "isSection": true,
    "id": "card-925"
  },
  {
    "question": "✅ Good Retry Strategy",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "builder.Services.AddHttpClient<IEmailService, EmailService>()\n    .AddTransientHttpErrorPolicy(policyBuilder =>\n        policyBuilder.WaitAndRetryAsync(\n            retryCount: 3,\n            sleepDurationProvider: retryAttempt =>\n                TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)), // Exponential backoff: 2s, 4s, 8s\n            onRetry: (outcome, timespan, retryAttempt, context) =>\n            {\n                var logger = context.GetLogger();\n                logger?.LogWarning(\n                    \"Retry {RetryAttempt} after {Delay}s due to {Exception}\",\n                    retryAttempt,\n                    timespan.TotalSeconds,\n                    outcome.Exception?.Message\n                );\n            }\n        )\n    );",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/06-resilience-patterns.md",
    "isSection": true,
    "id": "card-926"
  },
  {
    "question": "Advanced: Retry with Jitter",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public static class RetryPolicies\n{\n    private static readonly Random _jitterer = new();\n\n    public static IAsyncPolicy<HttpResponseMessage> GetRetryPolicyWithJitter()\n    {\n        return Policy\n            .HandleResult<HttpResponseMessage>(r =>\n                (int)r.StatusCode >= 500 || r.StatusCode == System.Net.HttpStatusCode.RequestTimeout)\n            .Or<HttpRequestException>()\n            .Or<TaskCanceledException>()\n            .WaitAndRetryAsync(\n                retryCount: 3,\n                sleepDurationProvider: retryAttempt =>\n                {\n                    // Exponential backoff with jitter\n                    var exponentialDelay = TimeSpan.FromSeconds(Math.Pow(2, retryAttempt));\n                    var jitter = TimeSpan.FromMilliseconds(_jitterer.Next(0, 1000));\n                    return exponentialDelay + jitter;\n                },\n                onRetry: (outcome, timespan, retryAttempt, context) =>\n                {\n                    Console.WriteLine($\"Retry {retryAttempt} after {timespan.TotalSeconds:F2}s\");\n                }\n            );\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Why jitter? Prevents thundering herd (all clients retrying at exactly the same time)."
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/06-resilience-patterns.md",
    "isSection": true,
    "id": "card-927"
  },
  {
    "question": "Database Retries (EF Core)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class AppDbContext : DbContext\n{\n    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)\n    {\n        optionsBuilder.UseSqlServer(\n            connectionString,\n            options => options.EnableRetryOnFailure(\n                maxRetryCount: 3,\n                maxRetryDelay: TimeSpan.FromSeconds(5),\n                errorNumbersToAdd: null\n            )\n        );\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/06-resilience-patterns.md",
    "isSection": true,
    "id": "card-928"
  },
  {
    "question": "Retry Guidelines",
    "answer": [
      {
        "type": "text",
        "content": "DO retry:"
      },
      {
        "type": "list",
        "items": [
          "Network timeouts (TCP)",
          "HTTP 5xx errors (server errors)",
          "HTTP 429 (rate limit) with exponential backoff",
          "Transient database errors (deadlocks, connection issues)"
        ]
      },
      {
        "type": "text",
        "content": "DON'T retry:"
      },
      {
        "type": "list",
        "items": [
          "HTTP 4xx errors (client errors: 400, 401, 403, 404)",
          "Business logic failures",
          "Validation errors",
          "Non-idempotent operations (unless using idempotency keys)"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/06-resilience-patterns.md",
    "isSection": true,
    "id": "card-929"
  },
  {
    "question": "Thread Pool Bulkheads",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class BulkheadService\n{\n    private readonly SemaphoreSlim _paymentSemaphore = new(20, 20); // 20 concurrent payments\n    private readonly SemaphoreSlim _emailSemaphore = new(50, 50);   // 50 concurrent emails\n\n    public async Task<PaymentResult> ProcessPaymentAsync(\n        PaymentRequest request,\n        CancellationToken ct)\n    {\n        if (!await _paymentSemaphore.WaitAsync(TimeSpan.FromMilliseconds(100), ct))\n        {\n            throw new BulkheadRejectedException(\"Payment bulkhead full\");\n        }\n\n        try\n        {\n            return await CallPaymentGatewayAsync(request, ct);\n        }\n        finally\n        {\n            _paymentSemaphore.Release();\n        }\n    }\n\n    public async Task SendEmailAsync(EmailMessage message, CancellationToken ct)\n    {\n        if (!await _emailSemaphore.WaitAsync(TimeSpan.FromMilliseconds(100), ct))\n        {\n            throw new BulkheadRejectedException(\"Email bulkhead full\");\n        }\n\n        try\n        {\n            await CallEmailServiceAsync(message, ct);\n        }\n        finally\n        {\n            _emailSemaphore.Release();\n        }\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Why bulkheads? If payment gateway is slow/down, it won't prevent emails from being sent. Failures are isolated."
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/06-resilience-patterns.md",
    "isSection": true,
    "id": "card-930"
  },
  {
    "question": "Polly Bulkhead",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "var bulkheadPolicy = Policy.BulkheadAsync<HttpResponseMessage>(\n    maxParallelization: 20,\n    maxQueuingActions: 10,\n    onBulkheadRejectedAsync: context =>\n    {\n        Console.WriteLine(\"Bulkhead rejected request\");\n        return Task.CompletedTask;\n    }\n);\n\n// Combine with retry and circuit breaker\nvar resilientPolicy = Policy.WrapAsync(\n    bulkheadPolicy,\n    circuitBreakerPolicy,\n    retryPolicy\n);\n\nvar result = await resilientPolicy.ExecuteAsync(() =>\n    _httpClient.GetAsync(\"https://api.example.com/data\")\n);",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/06-resilience-patterns.md",
    "isSection": true,
    "id": "card-931"
  },
  {
    "question": "Fallback Examples",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class RecommendationService\n{\n    private readonly HttpClient _httpClient;\n    private readonly ICache _cache;\n    private readonly ILogger<RecommendationService> _logger;\n\n    public async Task<List<Product>> GetRecommendationsAsync(\n        int userId,\n        CancellationToken ct)\n    {\n        try\n        {\n            // Try ML-based recommendations\n            var response = await _httpClient.GetAsync($\"/recommendations/{userId}\", ct);\n            response.EnsureSuccessStatusCode();\n            return await response.Content.ReadFromJsonAsync<List<Product>>(ct);\n        }\n        catch (Exception ex)\n        {\n            _logger.LogWarning(ex, \"Recommendation service failed, using fallback\");\n\n            // Fallback 1: Cached recommendations\n            var cached = await _cache.GetAsync<List<Product>>($\"recommendations:{userId}\", ct);\n            if (cached != null)\n            {\n                _logger.LogInformation(\"Returning cached recommendations for user {UserId}\", userId);\n                return cached;\n            }\n\n            // Fallback 2: Popular products (global)\n            _logger.LogInformation(\"Returning popular products for user {UserId}\", userId);\n            return await GetPopularProductsAsync(ct);\n        }\n    }\n\n    private async Task<List<Product>> GetPopularProductsAsync(CancellationToken ct)\n    {\n        // Simple fallback: top 10 popular products\n        return new List<Product>\n        {\n            // Static or from simple DB query\n        };\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/06-resilience-patterns.md",
    "isSection": true,
    "id": "card-932"
  },
  {
    "question": "Polly Fallback Policy",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "var fallbackPolicy = Policy<List<Product>>\n    .Handle<Exception>()\n    .FallbackAsync(\n        fallbackValue: new List<Product>(), // Empty list\n        onFallbackAsync: async (outcome, context) =>\n        {\n            var logger = context.GetLogger();\n            logger?.LogWarning(\"Fallback triggered: {Exception}\", outcome.Exception?.Message);\n            await Task.CompletedTask;\n        }\n    );\n\nvar recommendations = await fallbackPolicy.ExecuteAsync(async () =>\n{\n    var response = await _httpClient.GetAsync($\"/recommendations/{userId}\");\n    response.EnsureSuccessStatusCode();\n    return await response.Content.ReadFromJsonAsync<List<Product>>();\n});",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/06-resilience-patterns.md",
    "isSection": true,
    "id": "card-933"
  },
  {
    "question": "Custom Health Check",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class MessageQueueHealthCheck : IHealthCheck\n{\n    private readonly IRabbitMQConnection _rabbitConnection;\n\n    public async Task<HealthCheckResult> CheckHealthAsync(\n        HealthCheckContext context,\n        CancellationToken ct = default)\n    {\n        try\n        {\n            var connection = _rabbitConnection.GetConnection();\n\n            if (!connection.IsOpen)\n            {\n                return HealthCheckResult.Unhealthy(\"RabbitMQ connection is closed\");\n            }\n\n            using var channel = connection.CreateModel();\n            // Check if we can declare a queue (lightweight operation)\n            channel.QueueDeclarePassive(\"health-check\");\n\n            return HealthCheckResult.Healthy(\"RabbitMQ is reachable\");\n        }\n        catch (Exception ex)\n        {\n            return HealthCheckResult.Unhealthy(\"RabbitMQ is unreachable\", ex);\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/06-resilience-patterns.md",
    "isSection": true,
    "id": "card-934"
  },
  {
    "question": "7. Combining Resilience Patterns (The Full Stack)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// Program.cs - Production-ready HTTP client configuration\nbuilder.Services.AddHttpClient<IPaymentService, PaymentService>(client =>\n{\n    client.BaseAddress = new Uri(\"https://payment-gateway\");\n    client.Timeout = TimeSpan.FromSeconds(10);\n})\n.AddPolicyHandler((services, request) =>\n{\n    // Combine multiple policies\n    var retryPolicy = Policy\n        .HandleResult<HttpResponseMessage>(r => !r.IsSuccessStatusCode)\n        .Or<HttpRequestException>()\n        .WaitAndRetryAsync(\n            retryCount: 3,\n            sleepDurationProvider: retryAttempt =>\n                TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)) +\n                TimeSpan.FromMilliseconds(Random.Shared.Next(0, 1000)) // Jitter\n        );\n\n    var circuitBreakerPolicy = Policy\n        .HandleResult<HttpResponseMessage>(r => !r.IsSuccessStatusCode)\n        .Or<HttpRequestException>()\n        .CircuitBreakerAsync(\n            handledEventsAllowedBeforeBreaking: 5,\n            durationOfBreak: TimeSpan.FromSeconds(30)\n        );\n\n    var bulkheadPolicy = Policy.BulkheadAsync<HttpResponseMessage>(\n        maxParallelization: 20,\n        maxQueuingActions: 10\n    );\n\n    var timeoutPolicy = Policy.TimeoutAsync<HttpResponseMessage>(\n        TimeSpan.FromSeconds(5)\n    );\n\n    // Order matters: timeout → retry → circuit breaker → bulkhead\n    return Policy.WrapAsync(timeoutPolicy, retryPolicy, circuitBreakerPolicy, bulkheadPolicy);\n});",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/06-resilience-patterns.md",
    "isSection": true,
    "id": "card-935"
  },
  {
    "question": "Summary: Resilience Checklist",
    "answer": [
      {
        "type": "text",
        "content": "✅ Timeouts on all I/O: HTTP, database, cache, queues"
      },
      {
        "type": "text",
        "content": "✅ Circuit breakers: For external dependencies"
      },
      {
        "type": "text",
        "content": "✅ Retry policies: Exponential backoff with jitter for transient failures"
      },
      {
        "type": "text",
        "content": "✅ Bulkheads: Isolate resource pools per dependency"
      },
      {
        "type": "text",
        "content": "✅ Fallbacks: Graceful degradation with cached/default data"
      },
      {
        "type": "text",
        "content": "✅ Health checks: For load balancer and monitoring"
      },
      {
        "type": "text",
        "content": "✅ Combine patterns: Timeout + retry + circuit breaker + bulkhead"
      },
      {
        "type": "text",
        "content": "Key Insight: At scale, failures happen constantly. Resilience patterns ensure one failing service doesn't cascade and bring down your entire system."
      },
      {
        "type": "text",
        "content": "Next: Observability & Monitoring - You can't fix what you can't see."
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/06-resilience-patterns.md",
    "isSection": true,
    "id": "card-936"
  },
  {
    "question": "1. Timeouts: The Foundation of Resilience",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class PaymentService\n{\n    private readonly HttpClient _httpClient;\n\n    public async Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request)\n    {\n        // 🔥 No timeout = can hang forever\n        var response = await _httpClient.PostAsJsonAsync(\n            \"https://payment-gateway/charge\",\n            request\n        );\n\n        return await response.Content.ReadFromJsonAsync<PaymentResult>();\n    }\n}\n// Under load: all threads hang waiting for slow gateway → system dies",
        "codeType": "bad"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/06-resilience-patterns.md",
    "isConcept": true,
    "id": "card-937"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class PaymentService\n{\n    private readonly HttpClient _httpClient;\n    private readonly ILogger<PaymentService> _logger;\n\n    public PaymentService(HttpClient httpClient, ILogger<PaymentService> logger)\n    {\n        _httpClient = httpClient;\n        _logger = logger;\n\n        // Set default timeout at HttpClient level\n        _httpClient.Timeout = TimeSpan.FromSeconds(10);\n    }\n\n    public async Task<PaymentResult> ProcessPaymentAsync(\n        PaymentRequest request,\n        CancellationToken ct)\n    {\n        try\n        {\n            // Per-request timeout (overrides default)\n            using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);\n            cts.CancelAfter(TimeSpan.FromSeconds(5));\n\n            var response = await _httpClient.PostAsJsonAsync(\n                \"https://payment-gateway/charge\",\n                request,\n                cts.Token\n            );\n\n            response.EnsureSuccessStatusCode();\n            return await response.Content.ReadFromJsonAsync<PaymentResult>(cts.Token);\n        }\n        catch (TaskCanceledException ex)\n        {\n            _logger.LogWarning(ex, \"Payment gateway timeout for request {RequestId}\", request.Id);\n            throw new PaymentTimeoutException(\"Payment processing timed out\", ex);\n        }\n        catch (HttpRequestException ex)\n        {\n            _logger.LogError(ex, \"Payment gateway error for request {RequestId}\", request.Id);\n            throw new PaymentFailedException(\"Payment gateway unavailable\", ex);\n        }\n    }\n}",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/06-resilience-patterns.md",
    "isConcept": true,
    "id": "card-938"
  },
  {
    "question": "3. Retry Policies: Handling Transient Failures",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "builder.Services.AddHttpClient<IEmailService, EmailService>()\n    .AddTransientHttpErrorPolicy(policyBuilder =>\n        policyBuilder.WaitAndRetryAsync(\n            retryCount: 3,\n            sleepDurationProvider: retryAttempt =>\n                TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)), // Exponential backoff: 2s, 4s, 8s\n            onRetry: (outcome, timespan, retryAttempt, context) =>\n            {\n                var logger = context.GetLogger();\n                logger?.LogWarning(\n                    \"Retry {RetryAttempt} after {Delay}s due to {Exception}\",\n                    retryAttempt,\n                    timespan.TotalSeconds,\n                    outcome.Exception?.Message\n                );\n            }\n        )\n    );",
        "codeType": "good"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/06-resilience-patterns.md",
    "isConcept": true,
    "id": "card-939"
  },
  {
    "question": "Why Observability is Critical",
    "answer": [
      {
        "type": "text",
        "content": "The Problem:"
      },
      {
        "type": "list",
        "items": [
          "At scale, you can't SSH into servers to debug",
          "Logs alone don't tell you what's slow or broken",
          "You need to see: traffic patterns, latency, errors, saturation"
        ]
      },
      {
        "type": "text",
        "content": "Three Pillars of Observability:"
      },
      {
        "type": "list",
        "items": [
          "Metrics - What is happening? (RPS, latency, error rate)",
          "Logs - What happened? (structured events with context)",
          "Traces - Where is time spent? (distributed request tracking)"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/07-observability.md",
    "isSection": true,
    "id": "card-940"
  },
  {
    "question": "Setup Serilog",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// Install: Serilog.AspNetCore, Serilog.Sinks.Console, Serilog.Sinks.File, Serilog.Sinks.Seq\n\n// Program.cs\nusing Serilog;\nusing Serilog.Events;\n\nvar builder = WebApplication.CreateBuilder(args);\n\n// Configure Serilog\nLog.Logger = new LoggerConfiguration()\n    .MinimumLevel.Information()\n    .MinimumLevel.Override(\"Microsoft\", LogEventLevel.Warning)\n    .MinimumLevel.Override(\"Microsoft.AspNetCore\", LogEventLevel.Warning)\n    .Enrich.FromLogContext()\n    .Enrich.WithMachineName()\n    .Enrich.WithThreadId()\n    .Enrich.WithProperty(\"Application\", \"OrderService\")\n    .WriteTo.Console(outputTemplate:\n        \"[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}\")\n    .WriteTo.File(\n        path: \"logs/app-.log\",\n        rollingInterval: RollingInterval.Day,\n        retainedFileCountLimit: 7,\n        outputTemplate: \"{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}\"\n    )\n    .WriteTo.Seq(\"http://localhost:5341\") // Centralized log aggregation\n    .CreateLogger();\n\nbuilder.Host.UseSerilog();\n\nvar app = builder.Build();\n\n// Add request logging middleware\napp.UseSerilogRequestLogging(options =>\n{\n    options.MessageTemplate = \"HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000}ms\";\n    options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>\n    {\n        diagnosticContext.Set(\"RequestHost\", httpContext.Request.Host.Value);\n        diagnosticContext.Set(\"UserAgent\", httpContext.Request.Headers[\"User-Agent\"].ToString());\n        diagnosticContext.Set(\"UserId\", httpContext.User.FindFirst(\"sub\")?.Value);\n    };\n});\n\napp.MapControllers();\napp.Run();",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/07-observability.md",
    "isSection": true,
    "id": "card-941"
  },
  {
    "question": "Structured Logging in Code",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderService\n{\n    private readonly ILogger<OrderService> _logger;\n\n    public async Task<Order> CreateOrderAsync(CreateOrderRequest request, CancellationToken ct)\n    {\n        // ❌ Bad: String interpolation (not structured)\n        _logger.LogInformation($\"Creating order for user {request.UserId} with total {request.Total}\");\n\n        // ✅ Good: Structured logging with named properties\n        _logger.LogInformation(\n            \"Creating order for user {UserId} with total {Total} and {ItemCount} items\",\n            request.UserId,\n            request.Total,\n            request.Items.Count\n        );\n\n        try\n        {\n            var order = await ProcessOrderAsync(request, ct);\n\n            _logger.LogInformation(\n                \"Order {OrderId} created successfully for user {UserId}\",\n                order.Id,\n                request.UserId\n            );\n\n            return order;\n        }\n        catch (OutOfStockException ex)\n        {\n            _logger.LogWarning(\n                ex,\n                \"Order creation failed due to out of stock. User {UserId}, Product {ProductId}\",\n                request.UserId,\n                ex.ProductId\n            );\n            throw;\n        }\n        catch (Exception ex)\n        {\n            _logger.LogError(\n                ex,\n                \"Order creation failed for user {UserId}\",\n                request.UserId\n            );\n            throw;\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/07-observability.md",
    "isSection": true,
    "id": "card-942"
  },
  {
    "question": "Correlation IDs for Request Tracking",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// Middleware to add correlation ID\npublic class CorrelationIdMiddleware\n{\n    private readonly RequestDelegate _next;\n    private const string CorrelationIdHeader = \"X-Correlation-ID\";\n\n    public async Task InvokeAsync(HttpContext context)\n    {\n        var correlationId = context.Request.Headers[CorrelationIdHeader].FirstOrDefault()\n                            ?? Guid.NewGuid().ToString();\n\n        context.Items[\"CorrelationId\"] = correlationId;\n        context.Response.Headers[CorrelationIdHeader] = correlationId;\n\n        // Add to log context\n        using (Serilog.Context.LogContext.PushProperty(\"CorrelationId\", correlationId))\n        {\n            await _next(context);\n        }\n    }\n}\n\n// Register\napp.UseMiddleware<CorrelationIdMiddleware>();\n\n// Now all logs automatically include CorrelationId\n// [15:23:45 INF] Creating order {UserId: 123, CorrelationId: \"abc-123-def\"}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/07-observability.md",
    "isSection": true,
    "id": "card-943"
  },
  {
    "question": "Setup Prometheus Metrics",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// Install: prometheus-net.AspNetCore\n\n// Program.cs\nusing Prometheus;\n\nbuilder.Services.AddControllers();\n\nvar app = builder.Build();\n\n// Enable metrics endpoint\napp.UseHttpMetrics(); // Track HTTP metrics automatically\n\n// Expose /metrics endpoint\napp.MapMetrics();\n\napp.MapControllers();\napp.Run();",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/07-observability.md",
    "isSection": true,
    "id": "card-944"
  },
  {
    "question": "Custom Metrics",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "using Prometheus;\n\npublic class OrderMetrics\n{\n    // Counter: monotonically increasing (total orders)\n    public static readonly Counter OrdersCreated = Metrics.CreateCounter(\n        \"orders_created_total\",\n        \"Total number of orders created\",\n        new CounterConfiguration\n        {\n            LabelNames = new[] { \"status\", \"payment_method\" }\n        }\n    );\n\n    // Gauge: value that can go up and down (queue depth)\n    public static readonly Gauge QueueDepth = Metrics.CreateGauge(\n        \"order_queue_depth\",\n        \"Current depth of order processing queue\"\n    );\n\n    // Histogram: distribution of values (latency)\n    public static readonly Histogram OrderProcessingDuration = Metrics.CreateHistogram(\n        \"order_processing_duration_seconds\",\n        \"Duration of order processing in seconds\",\n        new HistogramConfiguration\n        {\n            LabelNames = new[] { \"order_type\" },\n            Buckets = Histogram.ExponentialBuckets(0.01, 2, 10) // 10ms to 5s\n        }\n    );\n\n    // Summary: like histogram but calculates percentiles\n    public static readonly Summary PaymentProcessingDuration = Metrics.CreateSummary(\n        \"payment_processing_duration_seconds\",\n        \"Duration of payment processing\",\n        new SummaryConfiguration\n        {\n            Objectives = new[]\n            {\n                new QuantileEpsilonPair(0.5, 0.05),  // p50\n                new QuantileEpsilonPair(0.95, 0.01), // p95\n                new QuantileEpsilonPair(0.99, 0.01)  // p99\n            }\n        }\n    );\n}\n\npublic class OrderService\n{\n    public async Task<Order> CreateOrderAsync(CreateOrderRequest request, CancellationToken ct)\n    {\n        // Track latency\n        using (OrderMetrics.OrderProcessingDuration.Labels(\"standard\").NewTimer())\n        {\n            var order = await ProcessOrderAsync(request, ct);\n\n            // Increment counter\n            OrderMetrics.OrdersCreated.Labels(\n                status: order.Status,\n                payment_method: request.PaymentMethod\n            ).Inc();\n\n            return order;\n        }\n    }\n\n    public void UpdateQueueDepth(int depth)\n    {\n        OrderMetrics.QueueDepth.Set(depth);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/07-observability.md",
    "isSection": true,
    "id": "card-945"
  },
  {
    "question": "Key Metrics to Track",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public static class ApplicationMetrics\n{\n    // RED method: Rate, Errors, Duration\n    public static readonly Counter RequestsTotal = Metrics.CreateCounter(\n        \"http_requests_total\",\n        \"Total HTTP requests\",\n        new CounterConfiguration { LabelNames = new[] { \"method\", \"endpoint\", \"status\" } }\n    );\n\n    public static readonly Histogram RequestDuration = Metrics.CreateHistogram(\n        \"http_request_duration_seconds\",\n        \"HTTP request duration\",\n        new HistogramConfiguration\n        {\n            LabelNames = new[] { \"method\", \"endpoint\" },\n            Buckets = Histogram.ExponentialBuckets(0.001, 2, 15) // 1ms to 16s\n        }\n    );\n\n    public static readonly Counter ErrorsTotal = Metrics.CreateCounter(\n        \"errors_total\",\n        \"Total errors\",\n        new CounterConfiguration { LabelNames = new[] { \"type\", \"endpoint\" } }\n    );\n\n    // USE method: Utilization, Saturation, Errors\n    public static readonly Gauge ThreadPoolAvailableThreads = Metrics.CreateGauge(\n        \"threadpool_available_threads\",\n        \"Available thread pool threads\"\n    );\n\n    public static readonly Gauge MemoryUsageBytes = Metrics.CreateGauge(\n        \"memory_usage_bytes\",\n        \"Memory usage in bytes\"\n    );\n\n    public static readonly Gauge CpuUsagePercent = Metrics.CreateGauge(\n        \"cpu_usage_percent\",\n        \"CPU usage percentage\"\n    );\n\n    // Database\n    public static readonly Gauge DatabaseConnectionPoolActive = Metrics.CreateGauge(\n        \"database_connection_pool_active\",\n        \"Active database connections\"\n    );\n\n    public static readonly Counter DatabaseQueriesTotal = Metrics.CreateCounter(\n        \"database_queries_total\",\n        \"Total database queries\",\n        new CounterConfiguration { LabelNames = new[] { \"query_type\", \"table\" } }\n    );\n\n    public static readonly Histogram DatabaseQueryDuration = Metrics.CreateHistogram(\n        \"database_query_duration_seconds\",\n        \"Database query duration\"\n    );\n\n    // Cache\n    public static readonly Counter CacheHitsTotal = Metrics.CreateCounter(\n        \"cache_hits_total\",\n        \"Total cache hits\",\n        new CounterConfiguration { LabelNames = new[] { \"cache_type\" } }\n    );\n\n    public static readonly Counter CacheMissesTotal = Metrics.CreateCounter(\n        \"cache_misses_total\",\n        \"Total cache misses\",\n        new CounterConfiguration { LabelNames = new[] { \"cache_type\" } }\n    );\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/07-observability.md",
    "isSection": true,
    "id": "card-946"
  },
  {
    "question": "Background Service for System Metrics",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class SystemMetricsCollector : BackgroundService\n{\n    protected override async Task ExecuteAsync(CancellationToken stoppingToken)\n    {\n        while (!stoppingToken.IsCancellationRequested)\n        {\n            try\n            {\n                // Thread pool metrics\n                ThreadPool.GetAvailableThreads(out var availableWorker, out var availableIO);\n                ApplicationMetrics.ThreadPoolAvailableThreads.Set(availableWorker);\n\n                // Memory metrics\n                var memoryUsed = GC.GetTotalMemory(forceFullCollection: false);\n                ApplicationMetrics.MemoryUsageBytes.Set(memoryUsed);\n\n                // CPU metrics (requires System.Diagnostics.PerformanceCounter or Process)\n                var process = Process.GetCurrentProcess();\n                var cpuUsage = process.TotalProcessorTime.TotalMilliseconds /\n                               (Environment.ProcessorCount * process.TotalProcessorTime.TotalMilliseconds) * 100;\n                ApplicationMetrics.CpuUsagePercent.Set(cpuUsage);\n\n                await Task.Delay(TimeSpan.FromSeconds(15), stoppingToken);\n            }\n            catch (Exception ex)\n            {\n                // Log but don't crash\n                Console.WriteLine($\"Error collecting system metrics: {ex.Message}\");\n            }\n        }\n    }\n}\n\n// Register\nbuilder.Services.AddHostedService<SystemMetricsCollector>();",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/07-observability.md",
    "isSection": true,
    "id": "card-947"
  },
  {
    "question": "Setup OpenTelemetry",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// Install: OpenTelemetry.Exporter.Console, OpenTelemetry.Exporter.Jaeger,\n//          OpenTelemetry.Instrumentation.AspNetCore, OpenTelemetry.Instrumentation.Http,\n//          OpenTelemetry.Instrumentation.SqlClient\n\nusing OpenTelemetry.Resources;\nusing OpenTelemetry.Trace;\n\nbuilder.Services.AddOpenTelemetry()\n    .ConfigureResource(resource => resource.AddService(\"OrderService\"))\n    .WithTracing(tracing => tracing\n        .AddAspNetCoreInstrumentation(options =>\n        {\n            options.RecordException = true;\n            options.EnrichWithHttpRequest = (activity, request) =>\n            {\n                activity.SetTag(\"user_id\", request.HttpContext.User.FindFirst(\"sub\")?.Value);\n            };\n        })\n        .AddHttpClientInstrumentation(options =>\n        {\n            options.RecordException = true;\n        })\n        .AddSqlClientInstrumentation(options =>\n        {\n            options.SetDbStatementForText = true;\n            options.RecordException = true;\n        })\n        .AddSource(\"OrderService\")\n        .AddConsoleExporter()\n        .AddJaegerExporter(options =>\n        {\n            options.AgentHost = \"localhost\";\n            options.AgentPort = 6831;\n        })\n    );",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/07-observability.md",
    "isSection": true,
    "id": "card-948"
  },
  {
    "question": "Manual Instrumentation",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "using System.Diagnostics;\n\npublic class OrderService\n{\n    private static readonly ActivitySource ActivitySource = new(\"OrderService\");\n    private readonly ILogger<OrderService> _logger;\n\n    public async Task<Order> CreateOrderAsync(CreateOrderRequest request, CancellationToken ct)\n    {\n        // Create custom span\n        using var activity = ActivitySource.StartActivity(\"CreateOrder\", ActivityKind.Server);\n        activity?.SetTag(\"order.user_id\", request.UserId);\n        activity?.SetTag(\"order.total\", request.Total);\n        activity?.SetTag(\"order.item_count\", request.Items.Count);\n\n        try\n        {\n            // Child span for validation\n            using (var validationActivity = ActivitySource.StartActivity(\"ValidateOrder\"))\n            {\n                await ValidateOrderAsync(request, ct);\n            }\n\n            // Child span for payment\n            using (var paymentActivity = ActivitySource.StartActivity(\"ProcessPayment\"))\n            {\n                await ProcessPaymentAsync(request, ct);\n                paymentActivity?.SetTag(\"payment.method\", request.PaymentMethod);\n            }\n\n            // Child span for database\n            using (var dbActivity = ActivitySource.StartActivity(\"SaveOrder\"))\n            {\n                var order = await SaveOrderToDbAsync(request, ct);\n                dbActivity?.SetTag(\"order.id\", order.Id);\n\n                activity?.SetTag(\"order.id\", order.Id);\n                activity?.SetStatus(ActivityStatusCode.Ok);\n\n                return order;\n            }\n        }\n        catch (Exception ex)\n        {\n            activity?.SetStatus(ActivityStatusCode.Error, ex.Message);\n            activity?.RecordException(ex);\n            throw;\n        }\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "What you get:"
      },
      {
        "type": "list",
        "items": [
          "Request flows across services visualized",
          "Slow operations identified (e.g., \"payment service took 2s\")",
          "Error propagation tracked"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/07-observability.md",
    "isSection": true,
    "id": "card-949"
  },
  {
    "question": "Setup Application Insights (Azure)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// Install: Microsoft.ApplicationInsights.AspNetCore\n\nbuilder.Services.AddApplicationInsightsTelemetry(options =>\n{\n    options.ConnectionString = builder.Configuration[\"ApplicationInsights:ConnectionString\"];\n    options.EnableAdaptiveSampling = true; // Sample at high traffic\n});\n\n// Track custom events\npublic class OrderService\n{\n    private readonly TelemetryClient _telemetry;\n\n    public async Task<Order> CreateOrderAsync(CreateOrderRequest request, CancellationToken ct)\n    {\n        var stopwatch = Stopwatch.StartNew();\n\n        try\n        {\n            var order = await ProcessOrderAsync(request, ct);\n\n            // Track custom metric\n            _telemetry.TrackMetric(\"OrderValue\", request.Total);\n\n            // Track custom event\n            _telemetry.TrackEvent(\"OrderCreated\", new Dictionary<string, string>\n            {\n                { \"OrderId\", order.Id.ToString() },\n                { \"UserId\", request.UserId.ToString() },\n                { \"PaymentMethod\", request.PaymentMethod }\n            });\n\n            stopwatch.Stop();\n            _telemetry.TrackMetric(\"OrderProcessingTime\", stopwatch.ElapsedMilliseconds);\n\n            return order;\n        }\n        catch (Exception ex)\n        {\n            _telemetry.TrackException(ex, new Dictionary<string, string>\n            {\n                { \"UserId\", request.UserId.ToString() },\n                { \"Total\", request.Total.ToString() }\n            });\n            throw;\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/07-observability.md",
    "isSection": true,
    "id": "card-950"
  },
  {
    "question": "Prometheus Alerting Rules",
    "answer": [
      {
        "type": "code",
        "language": "yaml",
        "code": "# prometheus-alerts.yml\ngroups:\n  - name: api_alerts\n    interval: 30s\n    rules:\n      # High error rate\n      - alert: HighErrorRate\n        expr: rate(http_requests_total{status=~\"5..\"}[5m]) > 0.05\n        for: 5m\n        labels:\n          severity: critical\n        annotations:\n          summary: \"High error rate detected\"\n          description: \"Error rate is {{ $value }} errors/sec\"\n\n      # High latency\n      - alert: HighLatency\n        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2\n        for: 5m\n        labels:\n          severity: warning\n        annotations:\n          summary: \"High latency detected\"\n          description: \"p95 latency is {{ $value }}s\"\n\n      # Database connection pool exhaustion\n      - alert: DatabaseConnectionPoolExhausted\n        expr: database_connection_pool_active / database_connection_pool_max > 0.9\n        for: 2m\n        labels:\n          severity: warning\n        annotations:\n          summary: \"Database connection pool nearly exhausted\"\n\n      # Queue depth growing\n      - alert: QueueDepthGrowing\n        expr: delta(order_queue_depth[5m]) > 1000\n        for: 5m\n        labels:\n          severity: warning\n        annotations:\n          summary: \"Order queue depth growing rapidly\"",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/07-observability.md",
    "isSection": true,
    "id": "card-951"
  },
  {
    "question": "Grafana Dashboard (Key Panels)",
    "answer": [
      {
        "type": "code",
        "language": "json",
        "code": "{\n  \"dashboard\": {\n    \"title\": \"Order Service Dashboard\",\n    \"panels\": [\n      {\n        \"title\": \"Requests per Second\",\n        \"targets\": [\n          {\n            \"expr\": \"rate(http_requests_total[1m])\"\n          }\n        ]\n      },\n      {\n        \"title\": \"Latency (p50, p95, p99)\",\n        \"targets\": [\n          {\n            \"expr\": \"histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))\",\n            \"legendFormat\": \"p50\"\n          },\n          {\n            \"expr\": \"histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))\",\n            \"legendFormat\": \"p95\"\n          },\n          {\n            \"expr\": \"histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))\",\n            \"legendFormat\": \"p99\"\n          }\n        ]\n      },\n      {\n        \"title\": \"Error Rate\",\n        \"targets\": [\n          {\n            \"expr\": \"rate(http_requests_total{status=~\\\"5..\\\"}[5m])\"\n          }\n        ]\n      },\n      {\n        \"title\": \"Cache Hit Rate\",\n        \"targets\": [\n          {\n            \"expr\": \"rate(cache_hits_total[5m]) / (rate(cache_hits_total[5m]) + rate(cache_misses_total[5m]))\"\n          }\n        ]\n      }\n    ]\n  }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/07-observability.md",
    "isSection": true,
    "id": "card-952"
  },
  {
    "question": "Summary: Observability Checklist",
    "answer": [
      {
        "type": "text",
        "content": "✅ Structured logging: Serilog with correlation IDs"
      },
      {
        "type": "text",
        "content": "✅ Metrics: Prometheus with RED (Rate, Errors, Duration) and USE (Utilization, Saturation, Errors)"
      },
      {
        "type": "text",
        "content": "✅ Distributed tracing: OpenTelemetry across services"
      },
      {
        "type": "text",
        "content": "✅ APM tool: Application Insights, Datadog, or New Relic"
      },
      {
        "type": "text",
        "content": "✅ Alerting: Critical alerts for error rate, latency, saturation"
      },
      {
        "type": "text",
        "content": "✅ Dashboards: Real-time visualization of system health"
      },
      {
        "type": "text",
        "content": "✅ Log aggregation: Centralized logs (Seq, Elasticsearch, Splunk)"
      },
      {
        "type": "text",
        "content": "Key Metrics to Always Track:"
      },
      {
        "type": "list",
        "items": [
          "Request rate (requests per second)",
          "Error rate (errors per second, percentage)",
          "Latency (p50, p95, p99)",
          "Saturation (CPU, memory, thread pool, DB connections, queue depth)"
        ]
      },
      {
        "type": "text",
        "content": "The Golden Signals (Google SRE):"
      },
      {
        "type": "list",
        "items": [
          "Latency: How long requests take",
          "Traffic: How many requests",
          "Errors: Rate of failed requests",
          "Saturation: How \"full\" your system is"
        ]
      },
      {
        "type": "text",
        "content": "Next: Complete Example Application - Putting it all together in a real-world example."
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/07-observability.md",
    "isSection": true,
    "id": "card-953"
  },
  {
    "question": "System Architecture",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "Client Request\n    ↓\nLoad Balancer (NGINX/AWS ALB)\n    ↓\nAPI Gateway (Rate Limiting)\n    ↓\nOrder Service (Stateless, Horizontal Scaling)\n    ↓\n├─→ Redis Cache (L2)\n├─→ PostgreSQL (Primary + Read Replicas)\n├─→ RabbitMQ (Async Processing)\n└─→ External Services (Inventory, Payment)\n    ↓\nBackground Workers (Order Processing, Notifications)",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/08-complete-example.md",
    "isSection": true,
    "id": "card-954"
  },
  {
    "question": "Project Structure",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "OrderService/\n├── Controllers/\n│   └── OrdersController.cs\n├── Services/\n│   ├── OrderService.cs\n│   ├── CacheService.cs\n│   ├── InventoryService.cs\n│   └── PaymentService.cs\n├── Repositories/\n│   └── OrderRepository.cs\n├── BackgroundServices/\n│   ├── OrderProcessingWorker.cs\n│   └── MetricsCollector.cs\n├── Models/\n│   ├── Order.cs\n│   ├── OrderMessage.cs\n│   └── DTOs/\n├── Infrastructure/\n│   ├── RabbitMQ/\n│   │   ├── RabbitMQConnection.cs\n│   │   └── MessagePublisher.cs\n│   └── Middleware/\n│       ├── CorrelationIdMiddleware.cs\n│       └── ExceptionHandlingMiddleware.cs\n├── Metrics/\n│   └── ApplicationMetrics.cs\n└── Program.cs",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/08-complete-example.md",
    "isSection": true,
    "id": "card-955"
  },
  {
    "question": "Program.cs - Bootstrap Everything",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "using System.Data;\nusing Dapper;\nusing Microsoft.AspNetCore.RateLimiting;\nusing Npgsql;\nusing Polly;\nusing Polly.Extensions.Http;\nusing Prometheus;\nusing Serilog;\nusing StackExchange.Redis;\nusing System.Threading.RateLimiting;\nusing OrderService.Services;\nusing OrderService.Repositories;\nusing OrderService.Infrastructure;\nusing OrderService.BackgroundServices;\n\nvar builder = WebApplication.CreateBuilder(args);\n\n// ============ LOGGING ============\nLog.Logger = new LoggerConfiguration()\n    .ReadFrom.Configuration(builder.Configuration)\n    .Enrich.FromLogContext()\n    .Enrich.WithMachineName()\n    .Enrich.WithProperty(\"Application\", \"OrderService\")\n    .WriteTo.Console()\n    .WriteTo.File(\"logs/app-.log\", rollingInterval: RollingInterval.Day)\n    .CreateLogger();\n\nbuilder.Host.UseSerilog();\n\n// ============ CONTROLLERS & API ============\nbuilder.Services.AddControllers();\nbuilder.Services.AddEndpointsApiExplorer();\nbuilder.Services.AddSwaggerGen();\n\n// ============ RATE LIMITING ============\nbuilder.Services.AddRateLimiter(options =>\n{\n    options.AddSlidingWindowLimiter(\"api\", opt =>\n    {\n        opt.PermitLimit = 100;\n        opt.Window = TimeSpan.FromMinutes(1);\n        opt.SegmentsPerWindow = 6;\n        opt.QueueLimit = 0;\n    });\n\n    options.OnRejected = async (context, ct) =>\n    {\n        context.HttpContext.Response.StatusCode = 429;\n        await context.HttpContext.Response.WriteAsJsonAsync(new\n        {\n            error = \"Rate limit exceeded. Please retry later.\"\n        }, ct);\n    };\n});\n\n// ============ DATABASE ============\nbuilder.Services.AddScoped<IDbConnection>(sp =>\n{\n    var connectionString = builder.Configuration.GetConnectionString(\"DefaultConnection\");\n    return new NpgsqlConnection(connectionString);\n});\n\nbuilder.Services.AddScoped<IOrderRepository, OrderRepository>();\n\n// ============ REDIS CACHE ============\nbuilder.Services.AddSingleton<IConnectionMultiplexer>(sp =>\n{\n    var config = ConfigurationOptions.Parse(\n        builder.Configuration.GetConnectionString(\"Redis\")!\n    );\n    config.AbortOnConnectFail = false;\n    config.ConnectTimeout = 5000;\n    return ConnectionMultiplexer.Connect(config);\n});\n\nbuilder.Services.AddSingleton<ICacheService, RedisCacheService>();\nbuilder.Services.AddMemoryCache();\n\n// ============ MESSAGE QUEUE ============\nbuilder.Services.AddSingleton<IRabbitMQConnection, RabbitMQConnection>();\nbuilder.Services.AddSingleton<IMessagePublisher, RabbitMQPublisher>();\n\n// ============ HTTP CLIENTS WITH RESILIENCE ============\nbuilder.Services.AddHttpClient<IInventoryService, InventoryService>(client =>\n{\n    client.BaseAddress = new Uri(builder.Configuration[\"Services:Inventory\"]!);\n    client.Timeout = TimeSpan.FromSeconds(10);\n})\n.AddPolicyHandler(GetRetryPolicy())\n.AddPolicyHandler(GetCircuitBreakerPolicy());\n\nbuilder.Services.AddHttpClient<IPaymentService, PaymentService>(client =>\n{\n    client.BaseAddress = new Uri(builder.Configuration[\"Services:Payment\"]!);\n    client.Timeout = TimeSpan.FromSeconds(10);\n})\n.AddPolicyHandler(GetRetryPolicy())\n.AddPolicyHandler(GetCircuitBreakerPolicy());\n\n// ============ SERVICES ============\nbuilder.Services.AddScoped<IOrderService, Services.OrderService>();\n\n// ============ BACKGROUND WORKERS ============\nbuilder.Services.AddHostedService<OrderProcessingWorker>();\nbuilder.Services.AddHostedService<MetricsCollector>();\n\n// ============ HEALTH CHECKS ============\nbuilder.Services.AddHealthChecks()\n    .AddNpgSql(builder.Configuration.GetConnectionString(\"DefaultConnection\")!)\n    .AddRedis(builder.Configuration.GetConnectionString(\"Redis\")!);\n\nvar app = builder.Build();\n\n// ============ MIDDLEWARE PIPELINE ============\napp.UseMiddleware<CorrelationIdMiddleware>();\napp.UseMiddleware<ExceptionHandlingMiddleware>();\n\napp.UseSerilogRequestLogging();\n\nif (app.Environment.IsDevelopment())\n{\n    app.UseSwagger();\n    app.UseSwaggerUI();\n}\n\napp.UseRateLimiter();\n\napp.UseHttpMetrics(); // Prometheus\napp.MapMetrics();     // /metrics endpoint\n\napp.MapHealthChecks(\"/health\");\napp.MapControllers();\n\napp.Run();\n\n// ============ RESILIENCE POLICIES ============\nstatic IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()\n{\n    return HttpPolicyExtensions\n        .HandleTransientHttpError()\n        .WaitAndRetryAsync(\n            retryCount: 3,\n            sleepDurationProvider: retryAttempt =>\n                TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)) +\n                TimeSpan.FromMilliseconds(Random.Shared.Next(0, 1000)),\n            onRetry: (outcome, timespan, retryAttempt, context) =>\n            {\n                Log.Warning(\n                    \"Retry {RetryAttempt} after {Delay}s due to {Exception}\",\n                    retryAttempt, timespan.TotalSeconds, outcome.Exception?.Message\n                );\n            }\n        );\n}\n\nstatic IAsyncPolicy<HttpResponseMessage> GetCircuitBreakerPolicy()\n{\n    return HttpPolicyExtensions\n        .HandleTransientHttpError()\n        .CircuitBreakerAsync(\n            handledEventsAllowedBeforeBreaking: 5,\n            durationOfBreak: TimeSpan.FromSeconds(30),\n            onBreak: (outcome, duration) =>\n            {\n                Log.Error(\"Circuit breaker opened for {Duration}s\", duration.TotalSeconds);\n            },\n            onReset: () =>\n            {\n                Log.Information(\"Circuit breaker reset\");\n            }\n        );\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/08-complete-example.md",
    "isSection": true,
    "id": "card-956"
  },
  {
    "question": "OrdersController.cs",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "using Microsoft.AspNetCore.Mvc;\nusing Microsoft.AspNetCore.RateLimiting;\nusing OrderService.Models;\nusing OrderService.Services;\nusing Prometheus;\n\nnamespace OrderService.Controllers;\n\n[ApiController]\n[Route(\"api/[controller]\")]\n[EnableRateLimiting(\"api\")]\npublic class OrdersController : ControllerBase\n{\n    private readonly IOrderService _orderService;\n    private readonly ILogger<OrdersController> _logger;\n\n    private static readonly Counter OrderRequestsTotal = Metrics.CreateCounter(\n        \"order_requests_total\",\n        \"Total order requests\",\n        new CounterConfiguration { LabelNames = new[] { \"action\", \"status\" } }\n    );\n\n    public OrdersController(\n        IOrderService orderService,\n        ILogger<OrdersController> logger)\n    {\n        _orderService = orderService;\n        _logger = logger;\n    }\n\n    [HttpPost]\n    public async Task<IActionResult> CreateOrderAsync(\n        [FromBody] CreateOrderRequest request,\n        CancellationToken ct)\n    {\n        try\n        {\n            var order = await _orderService.CreateOrderAsync(request, ct);\n\n            OrderRequestsTotal.Labels(\"create\", \"success\").Inc();\n\n            return Accepted(new\n            {\n                orderId = order.Id,\n                status = order.Status,\n                message = \"Order is being processed\"\n            });\n        }\n        catch (InvalidOperationException ex)\n        {\n            OrderRequestsTotal.Labels(\"create\", \"validation_error\").Inc();\n            return BadRequest(new { error = ex.Message });\n        }\n        catch (Exception ex)\n        {\n            OrderRequestsTotal.Labels(\"create\", \"error\").Inc();\n            _logger.LogError(ex, \"Error creating order\");\n            return StatusCode(500, new { error = \"An error occurred processing your order\" });\n        }\n    }\n\n    [HttpGet(\"{id}\")]\n    public async Task<IActionResult> GetOrderAsync(int id, CancellationToken ct)\n    {\n        try\n        {\n            var order = await _orderService.GetOrderAsync(id, ct);\n\n            if (order == null)\n            {\n                OrderRequestsTotal.Labels(\"get\", \"not_found\").Inc();\n                return NotFound();\n            }\n\n            OrderRequestsTotal.Labels(\"get\", \"success\").Inc();\n            return Ok(order);\n        }\n        catch (Exception ex)\n        {\n            OrderRequestsTotal.Labels(\"get\", \"error\").Inc();\n            _logger.LogError(ex, \"Error retrieving order {OrderId}\", id);\n            return StatusCode(500, new { error = \"An error occurred\" });\n        }\n    }\n\n    [HttpGet(\"user/{userId}\")]\n    public async Task<IActionResult> GetUserOrdersAsync(\n        int userId,\n        [FromQuery] int page = 1,\n        [FromQuery] int pageSize = 20,\n        CancellationToken ct = default)\n    {\n        try\n        {\n            var orders = await _orderService.GetUserOrdersAsync(userId, page, pageSize, ct);\n            return Ok(orders);\n        }\n        catch (Exception ex)\n        {\n            _logger.LogError(ex, \"Error retrieving orders for user {UserId}\", userId);\n            return StatusCode(500, new { error = \"An error occurred\" });\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/08-complete-example.md",
    "isSection": true,
    "id": "card-957"
  },
  {
    "question": "OrderService.cs - Business Logic",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "using System.Diagnostics;\nusing OrderService.Infrastructure;\nusing OrderService.Models;\nusing OrderService.Repositories;\nusing Prometheus;\n\nnamespace OrderService.Services;\n\npublic interface IOrderService\n{\n    Task<Order> CreateOrderAsync(CreateOrderRequest request, CancellationToken ct);\n    Task<Order?> GetOrderAsync(int orderId, CancellationToken ct);\n    Task<IEnumerable<Order>> GetUserOrdersAsync(int userId, int page, int pageSize, CancellationToken ct);\n}\n\npublic class OrderService : IOrderService\n{\n    private readonly IOrderRepository _repository;\n    private readonly ICacheService _cache;\n    private readonly IInventoryService _inventoryService;\n    private readonly IPaymentService _paymentService;\n    private readonly IMessagePublisher _publisher;\n    private readonly ILogger<OrderService> _logger;\n\n    private static readonly ActivitySource ActivitySource = new(\"OrderService\");\n\n    private static readonly Histogram OrderProcessingDuration = Metrics.CreateHistogram(\n        \"order_processing_duration_seconds\",\n        \"Duration of order processing\"\n    );\n\n    public OrderService(\n        IOrderRepository repository,\n        ICacheService cache,\n        IInventoryService inventoryService,\n        IPaymentService paymentService,\n        IMessagePublisher publisher,\n        ILogger<OrderService> logger)\n    {\n        _repository = repository;\n        _cache = cache;\n        _inventoryService = inventoryService;\n        _paymentService = paymentService;\n        _publisher = publisher;\n        _logger = logger;\n    }\n\n    public async Task<Order> CreateOrderAsync(CreateOrderRequest request, CancellationToken ct)\n    {\n        using var activity = ActivitySource.StartActivity(\"CreateOrder\");\n        activity?.SetTag(\"user.id\", request.UserId);\n        activity?.SetTag(\"order.total\", request.Total);\n\n        using (OrderProcessingDuration.NewTimer())\n        {\n            _logger.LogInformation(\n                \"Creating order for user {UserId} with total {Total}\",\n                request.UserId,\n                request.Total\n            );\n\n            // 1. Check inventory (external service)\n            using (var inventoryActivity = ActivitySource.StartActivity(\"CheckInventory\"))\n            {\n                var inventoryAvailable = await _inventoryService.CheckAvailabilityAsync(\n                    request.ProductId,\n                    request.Quantity,\n                    ct\n                );\n\n                if (!inventoryAvailable)\n                {\n                    _logger.LogWarning(\n                        \"Insufficient inventory for product {ProductId}\",\n                        request.ProductId\n                    );\n                    throw new InvalidOperationException(\"Insufficient inventory\");\n                }\n            }\n\n            // 2. Create order in database\n            var order = new Order\n            {\n                UserId = request.UserId,\n                ProductId = request.ProductId,\n                Quantity = request.Quantity,\n                Total = request.Total,\n                Status = \"Pending\",\n                CreatedAt = DateTime.UtcNow\n            };\n\n            using (var dbActivity = ActivitySource.StartActivity(\"SaveOrder\"))\n            {\n                order.Id = await _repository.CreateAsync(order, ct);\n            }\n\n            _logger.LogInformation(\"Order {OrderId} created\", order.Id);\n\n            // 3. Publish message for async processing (payment, notifications)\n            await _publisher.PublishAsync(\"order-processing\", new OrderMessage\n            {\n                OrderId = order.Id,\n                UserId = order.UserId,\n                ProductId = order.ProductId,\n                Quantity = order.Quantity,\n                Total = order.Total,\n                PaymentMethod = request.PaymentMethod\n            }, ct);\n\n            _logger.LogInformation(\"Order {OrderId} queued for processing\", order.Id);\n\n            activity?.SetTag(\"order.id\", order.Id);\n            activity?.SetStatus(ActivityStatusCode.Ok);\n\n            return order;\n        }\n    }\n\n    public async Task<Order?> GetOrderAsync(int orderId, CancellationToken ct)\n    {\n        var cacheKey = $\"order:{orderId}\";\n\n        // Try cache first\n        var cached = await _cache.GetAsync<Order>(cacheKey, ct);\n        if (cached != null)\n        {\n            _logger.LogDebug(\"Cache hit for order {OrderId}\", orderId);\n            return cached;\n        }\n\n        _logger.LogDebug(\"Cache miss for order {OrderId}\", orderId);\n\n        // Load from database\n        var order = await _repository.GetByIdAsync(orderId, ct);\n\n        if (order != null)\n        {\n            // Cache for 5 minutes\n            await _cache.SetAsync(cacheKey, order, TimeSpan.FromMinutes(5), ct);\n        }\n\n        return order;\n    }\n\n    public async Task<IEnumerable<Order>> GetUserOrdersAsync(\n        int userId,\n        int page,\n        int pageSize,\n        CancellationToken ct)\n    {\n        return await _repository.GetUserOrdersAsync(userId, page, pageSize, ct);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/08-complete-example.md",
    "isSection": true,
    "id": "card-958"
  },
  {
    "question": "OrderRepository.cs - Database Access",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "using System.Data;\nusing Dapper;\nusing OrderService.Models;\n\nnamespace OrderService.Repositories;\n\npublic interface IOrderRepository\n{\n    Task<int> CreateAsync(Order order, CancellationToken ct);\n    Task<Order?> GetByIdAsync(int orderId, CancellationToken ct);\n    Task<IEnumerable<Order>> GetUserOrdersAsync(int userId, int page, int pageSize, CancellationToken ct);\n    Task UpdateStatusAsync(int orderId, string status, CancellationToken ct);\n}\n\npublic class OrderRepository : IOrderRepository\n{\n    private readonly IDbConnection _db;\n\n    public OrderRepository(IDbConnection db)\n    {\n        _db = db;\n    }\n\n    public async Task<int> CreateAsync(Order order, CancellationToken ct)\n    {\n        var sql = @\"\n            INSERT INTO Orders (UserId, ProductId, Quantity, Total, Status, CreatedAt)\n            VALUES (@UserId, @ProductId, @Quantity, @Total, @Status, @CreatedAt)\n            RETURNING Id\";\n\n        return await _db.ExecuteScalarAsync<int>(new CommandDefinition(\n            commandText: sql,\n            parameters: order,\n            cancellationToken: ct\n        ));\n    }\n\n    public async Task<Order?> GetByIdAsync(int orderId, CancellationToken ct)\n    {\n        var sql = \"SELECT * FROM Orders WHERE Id = @OrderId\";\n\n        return await _db.QueryFirstOrDefaultAsync<Order>(new CommandDefinition(\n            commandText: sql,\n            parameters: new { OrderId = orderId },\n            commandTimeout: 5,\n            cancellationToken: ct\n        ));\n    }\n\n    public async Task<IEnumerable<Order>> GetUserOrdersAsync(\n        int userId,\n        int page,\n        int pageSize,\n        CancellationToken ct)\n    {\n        // Keyset pagination for better performance\n        var sql = @\"\n            SELECT * FROM Orders\n            WHERE UserId = @UserId\n            ORDER BY CreatedAt DESC, Id DESC\n            LIMIT @PageSize\n            OFFSET @Offset\";\n\n        return await _db.QueryAsync<Order>(new CommandDefinition(\n            commandText: sql,\n            parameters: new\n            {\n                UserId = userId,\n                PageSize = pageSize,\n                Offset = (page - 1) * pageSize\n            },\n            commandTimeout: 5,\n            cancellationToken: ct\n        ));\n    }\n\n    public async Task UpdateStatusAsync(int orderId, string status, CancellationToken ct)\n    {\n        var sql = \"UPDATE Orders SET Status = @Status WHERE Id = @OrderId\";\n\n        await _db.ExecuteAsync(new CommandDefinition(\n            commandText: sql,\n            parameters: new { OrderId = orderId, Status = status },\n            commandTimeout: 5,\n            cancellationToken: ct\n        ));\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/08-complete-example.md",
    "isSection": true,
    "id": "card-959"
  },
  {
    "question": "OrderProcessingWorker.cs - Background Processing",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "using RabbitMQ.Client;\nusing RabbitMQ.Client.Events;\nusing System.Text;\nusing System.Text.Json;\nusing OrderService.Infrastructure;\nusing OrderService.Models;\nusing OrderService.Repositories;\nusing OrderService.Services;\n\nnamespace OrderService.BackgroundServices;\n\npublic class OrderProcessingWorker : BackgroundService\n{\n    private readonly IRabbitMQConnection _rabbitConnection;\n    private readonly IServiceProvider _serviceProvider;\n    private readonly ILogger<OrderProcessingWorker> _logger;\n    private IModel? _channel;\n\n    public OrderProcessingWorker(\n        IRabbitMQConnection rabbitConnection,\n        IServiceProvider serviceProvider,\n        ILogger<OrderProcessingWorker> logger)\n    {\n        _rabbitConnection = rabbitConnection;\n        _serviceProvider = serviceProvider;\n        _logger = logger;\n    }\n\n    protected override Task ExecuteAsync(CancellationToken stoppingToken)\n    {\n        _channel = _rabbitConnection.GetConnection().CreateModel();\n        _channel.BasicQos(0, 10, false);\n\n        var queueName = \"order-processing\";\n        _channel.QueueDeclare(queueName, durable: true, exclusive: false, autoDelete: false);\n\n        var consumer = new EventingBasicConsumer(_channel);\n\n        consumer.Received += async (model, ea) =>\n        {\n            var body = ea.Body.ToArray();\n            var message = Encoding.UTF8.GetString(body);\n\n            try\n            {\n                var orderMessage = JsonSerializer.Deserialize<OrderMessage>(message);\n\n                _logger.LogInformation(\"Processing order {OrderId}\", orderMessage?.OrderId);\n\n                using var scope = _serviceProvider.CreateScope();\n                var paymentService = scope.ServiceProvider.GetRequiredService<IPaymentService>();\n                var repository = scope.ServiceProvider.GetRequiredService<IOrderRepository>();\n\n                // Process payment\n                var paymentResult = await paymentService.ProcessPaymentAsync(\n                    orderMessage!.OrderId,\n                    orderMessage.Total,\n                    orderMessage.PaymentMethod,\n                    stoppingToken\n                );\n\n                if (paymentResult.Success)\n                {\n                    await repository.UpdateStatusAsync(\n                        orderMessage.OrderId,\n                        \"Completed\",\n                        stoppingToken\n                    );\n\n                    _logger.LogInformation(\"Order {OrderId} completed\", orderMessage.OrderId);\n                }\n                else\n                {\n                    await repository.UpdateStatusAsync(\n                        orderMessage.OrderId,\n                        \"Failed\",\n                        stoppingToken\n                    );\n\n                    _logger.LogWarning(\"Order {OrderId} payment failed\", orderMessage.OrderId);\n                }\n\n                _channel.BasicAck(ea.DeliveryTag, false);\n            }\n            catch (Exception ex)\n            {\n                _logger.LogError(ex, \"Error processing order message: {Message}\", message);\n                _channel.BasicNack(ea.DeliveryTag, false, requeue: true);\n            }\n        };\n\n        _channel.BasicConsume(queueName, autoAck: false, consumer: consumer);\n\n        return Task.CompletedTask;\n    }\n\n    public override void Dispose()\n    {\n        _channel?.Close();\n        _channel?.Dispose();\n        base.Dispose();\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/08-complete-example.md",
    "isSection": true,
    "id": "card-960"
  },
  {
    "question": "Database Schema",
    "answer": [
      {
        "type": "code",
        "language": "sql",
        "code": "CREATE TABLE Orders (\n    Id SERIAL PRIMARY KEY,\n    UserId INT NOT NULL,\n    ProductId INT NOT NULL,\n    Quantity INT NOT NULL,\n    Total DECIMAL(10, 2) NOT NULL,\n    Status VARCHAR(50) NOT NULL,\n    CreatedAt TIMESTAMP NOT NULL,\n    UpdatedAt TIMESTAMP\n);\n\nCREATE INDEX IX_Orders_UserId_CreatedAt ON Orders (UserId, CreatedAt DESC);\nCREATE INDEX IX_Orders_Status ON Orders (Status);",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/08-complete-example.md",
    "isSection": true,
    "id": "card-961"
  },
  {
    "question": "Configuration (appsettings.json)",
    "answer": [
      {
        "type": "code",
        "language": "json",
        "code": "{\n  \"ConnectionStrings\": {\n    \"DefaultConnection\": \"Host=localhost;Database=orderdb;Username=postgres;Password=password;Max Pool Size=100\",\n    \"Redis\": \"localhost:6379\"\n  },\n  \"Services\": {\n    \"Inventory\": \"https://inventory-api\",\n    \"Payment\": \"https://payment-api\"\n  },\n  \"Serilog\": {\n    \"MinimumLevel\": \"Information\"\n  }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/08-complete-example.md",
    "isSection": true,
    "id": "card-962"
  },
  {
    "question": "Summary: What This Example Demonstrates",
    "answer": [
      {
        "type": "text",
        "content": "✅ Async/await: All I/O is non-blocking"
      },
      {
        "type": "text",
        "content": "✅ Rate limiting: Built-in ASP.NET Core rate limiter"
      },
      {
        "type": "text",
        "content": "✅ Caching: Redis with cache-aside pattern"
      },
      {
        "type": "text",
        "content": "✅ Database: Dapper with proper indexing and pagination"
      },
      {
        "type": "text",
        "content": "✅ Message queues: RabbitMQ for async processing"
      },
      {
        "type": "text",
        "content": "✅ Resilience: Polly retry + circuit breaker on HTTP clients"
      },
      {
        "type": "text",
        "content": "✅ Observability: Structured logging, Prometheus metrics, OpenTelemetry tracing"
      },
      {
        "type": "text",
        "content": "✅ Health checks: Database and Redis health endpoints"
      },
      {
        "type": "text",
        "content": "✅ Clean architecture: Separation of concerns (controllers, services, repositories)"
      },
      {
        "type": "text",
        "content": "This is interview-ready code that demonstrates you understand how to build systems that scale to millions of users."
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/08-complete-example.md",
    "isSection": true,
    "id": "card-963"
  },
  {
    "question": "Table of Contents",
    "answer": [
      {
        "type": "list",
        "items": [
          "Mental Model & Architecture Overview",
          "Async & Non-Blocking I/O Patterns - Deep dive into async/await, thread pool management",
          "Backpressure & Rate Limiting - Protecting your system under load",
          "Caching Strategies - Redis, in-memory, CDN patterns",
          "Database Optimization & Scaling - Indexes, partitioning, read replicas",
          "Message Queues & Async Processing - Decoupling heavy work",
          "Resilience Patterns - Circuit breakers, retries, timeouts",
          "Observability & Monitoring - Metrics, tracing, structured logging",
          "Complete Example Application - Real-world implementation"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/index.md",
    "isSection": true,
    "id": "card-964"
  },
  {
    "question": "The mental model",
    "answer": [
      {
        "type": "text",
        "content": "You handle massive request volume by combining:"
      },
      {
        "type": "list",
        "items": [
          "Stateless APIs + horizontal scaling",
          "Fast paths (cache) and slow paths (DB / downstream)",
          "Async I/O end-to-end (don’t block threads)",
          "Backpressure (bounded queues, rate limits)",
          "Resilience (timeouts, retries carefully, circuit breakers)",
          "Data design (indexes, read/write separation, partitioning)",
          "Observability (metrics + tracing, not just logs)"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/index.md",
    "isSection": true,
    "id": "card-965"
  },
  {
    "question": "1) Make your API async and non-blocking",
    "answer": [
      {
        "type": "list",
        "items": [
          "Use async/await for anything I/O (DB, HTTP, Redis, MQ).",
          "Avoid .Result / .Wait() (threadpool starvation under load).",
          "Use HttpClientFactory (prevents socket exhaustion)."
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/index.md",
    "isSection": true,
    "id": "card-966"
  },
  {
    "question": "2) Protect the system with limits (backpressure)",
    "answer": [
      {
        "type": "text",
        "content": "When traffic spikes, the worst thing is letting everything pile up until the system dies."
      },
      {
        "type": "text",
        "content": "Implement:"
      },
      {
        "type": "list",
        "items": [
          "Rate limiting (per user/IP/token)",
          "Concurrency limits for expensive endpoints",
          "Bounded queues for background work (reject/429 when full)"
        ]
      },
      {
        "type": "text",
        "content": "In ASP.NET Core you can use built-in rate limiting (good interview point)."
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/index.md",
    "isSection": true,
    "id": "card-967"
  },
  {
    "question": "3) Cache aggressively (but correctly)",
    "answer": [
      {
        "type": "text",
        "content": "For millions of users, your DB cannot be the “hot path”."
      },
      {
        "type": "list",
        "items": [
          "In-memory cache for per-instance hot items.",
          "Distributed cache (Redis) for shared hot items.",
          "Use cache-aside: read cache → if miss, load from DB → set cache.",
          "Add TTL + jitter to avoid stampedes."
        ]
      },
      {
        "type": "text",
        "content": "Also mention:"
      },
      {
        "type": "list",
        "items": [
          "ETags / 304 for GETs",
          "CDN for static and cacheable content"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/index.md",
    "isSection": true,
    "id": "card-968"
  },
  {
    "question": "4) Make DB the last resort and design it for scale",
    "answer": [
      {
        "type": "list",
        "items": [
          "Proper indexes (composite indexes aligned with query patterns)",
          "Avoid N+1 queries",
          "Use pagination (keyset pagination, not Skip/Take on huge tables)",
          "Consider read replicas for heavy read workloads",
          "Partition/shard by a key if you outgrow a single node",
          "Keep transactions small and short"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/index.md",
    "isSection": true,
    "id": "card-969"
  },
  {
    "question": "5) Decouple heavy work (queues, eventual consistency)",
    "answer": [
      {
        "type": "text",
        "content": "If a request triggers something expensive (emails, reports, settlement, heavy compute):"
      },
      {
        "type": "list",
        "items": [
          "Return fast (202 Accepted)",
          "Push message to RabbitMQ/ZeroMQ/Kafka (they mentioned RabbitMQ/ZeroMQ)",
          "Process in background workers",
          "Use idempotency keys so retries don’t double-apply actions"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/index.md",
    "isSection": true,
    "id": "card-970"
  },
  {
    "question": "6) Resilience patterns (you must say these out loud)",
    "answer": [
      {
        "type": "list",
        "items": [
          "Timeouts everywhere (DB + HTTP)",
          "Retries with exponential backoff only for transient failures",
          "Circuit breaker to stop hammering a failing dependency",
          "Bulkheads (separate pools/limits per downstream)",
          "Graceful degradation (serve stale cache if DB is sick)"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/index.md",
    "isSection": true,
    "id": "card-971"
  },
  {
    "question": "7) Observability to keep it alive in production",
    "answer": [
      {
        "type": "list",
        "items": [
          "Metrics: RPS, p95/p99 latency, error rate, saturation, queue depth",
          "Tracing: OpenTelemetry",
          "Logs: structured logs with correlation IDs"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/index.md",
    "isSection": true,
    "id": "card-972"
  },
  {
    "question": "A) Cache-aside with stampede protection (per-key lock)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "using Microsoft.Extensions.Caching.Memory;\nusing System.Collections.Concurrent;\n\npublic class CachedProfileService\n{\n    private readonly IMemoryCache _cache;\n    private static readonly ConcurrentDictionary<string, SemaphoreSlim> _locks = new();\n\n    public CachedProfileService(IMemoryCache cache) => _cache = cache;\n\n    public async Task<UserProfile> GetProfileAsync(\n        string userId,\n        Func<Task<UserProfile>> loadFromDb,\n        CancellationToken ct)\n    {\n        var cacheKey = $\"profile:{userId}\";\n        if (_cache.TryGetValue(cacheKey, out UserProfile cached))\n            return cached;\n\n        var sem = _locks.GetOrAdd(cacheKey, _ => new SemaphoreSlim(1, 1));\n        await sem.WaitAsync(ct);\n        try\n        {\n            // double-check after acquiring lock\n            if (_cache.TryGetValue(cacheKey, out cached))\n                return cached;\n\n            var profile = await loadFromDb();\n            _cache.Set(cacheKey, profile, TimeSpan.FromMinutes(5));\n            return profile;\n        }\n        finally\n        {\n            sem.Release();\n            // optional cleanup: don’t let dictionary grow forever\n            if (sem.CurrentCount == 1) _locks.TryRemove(cacheKey, out _);\n        }\n    }\n}\n\npublic record UserProfile(string Id, string Name);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "What this shows:"
      },
      {
        "type": "list",
        "items": [
          "async I/O",
          "caching",
          "stampede prevention (critical at scale)"
        ]
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/index.md",
    "isSection": true,
    "id": "card-973"
  },
  {
    "question": "B) Concurrency limit around an expensive call (backpressure)",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class ExpensiveGateway\n{\n    private readonly SemaphoreSlim _limit = new(initialCount: 200); // tune based on load tests\n\n    public async Task<string> CallAsync(Func<CancellationToken, Task<string>> operation, CancellationToken ct)\n    {\n        // if we can’t get a slot quickly, fail fast\n        if (!await _limit.WaitAsync(TimeSpan.FromMilliseconds(50), ct))\n            throw new TooManyRequestsException();\n\n        try\n        {\n            return await operation(ct);\n        }\n        finally\n        {\n            _limit.Release();\n        }\n    }\n}\n\npublic class TooManyRequestsException : Exception { }",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "This is the heart of “handling massive requests”: don’t let expensive work explode your resources."
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/index.md",
    "isSection": true,
    "id": "card-974"
  },
  {
    "question": "What interviewers love to hear (say this)",
    "answer": [
      {
        "type": "text",
        "content": "If they ask “how would you do it?” you can answer in 30–60 seconds like:"
      },
      {
        "type": "text",
        "content": "> “I’d keep the API stateless and async, scale horizontally behind a load balancer, put Redis in front of the database for hot reads, use rate limiting and bounded concurrency to apply backpressure, and move expensive tasks to a queue processed by background workers with idempotency. I’d add timeouts, circuit breakers, and good observability so the system degrades gracefully under spikes.”"
      }
    ],
    "category": "notes",
    "topic": "Use-Cases",
    "source": "notes/Use-Cases/massive-traffic/index.md",
    "isSection": true,
    "id": "card-975"
  },
  {
    "question": "LINQ & Collections",
    "answer": [
      {
        "type": "list",
        "items": [
          "Latest trade per account",
          "Approach: Sort or group by account and pick the trade with the max timestamp using GroupBy + OrderByDescending/MaxBy. This keeps the logic declarative and pushes the temporal ordering into the query rather than manual loops.",
          "Sample code: `csharp var latestTrades = trades .GroupBy(t => t.AccountId) .Select(g => g.OrderByDescending(t => t.Timestamp).First()); `",
          "Use when: You need the most recent entry per key without mutating state, such as building dashboards or reconciling snapshots.",
          "Avoid when: The dataset is huge and you'd benefit from streaming/SQL aggregation; consider database query with ROW_NUMBER or a materialized view to avoid loading everything into memory."
        ]
      },
      {
        "type": "list",
        "items": [
          "Flatten nested instrument codes",
          "Approach: Use SelectMany to flatten while keeping inner order.",
          "Sample code: `csharp var flat = nestedCodes.SelectMany(list => list); `",
          "Use when: You have nested enumerables and simply need to concatenate them.",
          "Avoid when: You must retain hierarchy boundaries—use nested loops instead."
        ]
      },
      {
        "type": "list",
        "items": [
          "SelectMany vs nested loops",
          "SelectMany projects each element to a sequence and flattens; nested loops make iteration explicit and allow more control over flow.",
          "Sample code: `csharp // SelectMany var pairs = accounts.SelectMany(a => a.Orders, (a, o) => new { a.Id, o.Id });"
        ]
      },
      {
        "type": "text",
        "content": "// Nested loops"
      },
      {
        "type": "text",
        "content": "foreach (var a in accounts)"
      },
      {
        "type": "text",
        "content": "foreach (var o in a.Orders)"
      },
      {
        "type": "text",
        "content": "yield return (a.Id, o.Id);"
      },
      {
        "type": "text",
        "content": "`"
      },
      {
        "type": "list",
        "items": [
          "Use SelectMany when: You want a fluent declarative pipeline or need joins.",
          "Use loops when: Performance-critical, complex control flow, or break/continue needed."
        ]
      },
      {
        "type": "list",
        "items": [
          "Detect duplicate orders with GroupBy",
          "Group by unique order keys and filter groups with count > 1. Summaries can include counts, timestamps, and other aggregate metadata that drive remediation.",
          "Sample code: `csharp var duplicates = orders .GroupBy(o => new { o.AccountId, o.ClientOrderId }) .Where(g => g.Count() > 1) .Select(g => new { g.Key.AccountId, g.Key.ClientOrderId, Count = g.Count(), LatestTimestamp = g.Max(o => o.Timestamp) }); `",
          "Use when: You need summaries and easy grouping.",
          "Avoid when: Data volume exceeds in-memory capabilities—use database aggregates or streaming dedup."
        ]
      }
    ],
    "category": "practice",
    "topic": "answers.md",
    "source": "practice/answers.md",
    "isSection": true,
    "id": "card-976"
  },
  {
    "question": "Async & Resilience",
    "answer": [
      {
        "type": "list",
        "items": [
          "Parallel REST calls with cancellation",
          "Approach: Use Task.WhenAll with CancellationTokenSource + timeout. Ensure the HttpClient is a singleton to avoid socket exhaustion and that partial results are handled gracefully when cancellation occurs.",
          "Sample code: `csharp using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(3)); var tasks = endpoints.Select(url => httpClient.GetStringAsync(url, cts.Token)); string[] responses = await Task.WhenAll(tasks); `",
          "Use when: Limited number of independent calls; want fail-fast.",
          "Avoid when: Endpoints depend on each other or you must gracefully degrade per-call."
        ]
      },
      {
        "type": "list",
        "items": [
          "Polly retry + circuit breaker",
          "Define policies and wrap HTTP calls.",
          "Sample code: `csharp var policy = Policy.WrapAsync( Policy.Handle<HttpRequestException>() .OrResult<HttpResponseMessage>(r => (int)r.StatusCode >= 500) .WaitAndRetryAsync(3, attempt => TimeSpan.FromMilliseconds(200 * attempt)), Policy.Handle<HttpRequestException>() .CircuitBreakerAsync(5, TimeSpan.FromSeconds(30)) );"
        ]
      },
      {
        "type": "text",
        "content": "var response = await policy.ExecuteAsync(() => httpClient.SendAsync(request));"
      },
      {
        "type": "text",
        "content": "`"
      },
      {
        "type": "list",
        "items": [
          "Use when: Downstream instability; need resilience.",
          "Avoid when: Operations must not be retried (e.g., non-idempotent commands without safeguards)."
        ]
      },
      {
        "type": "list",
        "items": [
          "Backpressure handling",
          "Use bounded channels, buffering, or throttling. Consider load shedding by dropping low-priority messages or scaling consumers horizontally when queue lengths grow.",
          "Sample code: `csharp var channel = Channel.CreateBounded<Message>(new BoundedChannelOptions(100) { FullMode = BoundedChannelFullMode.Wait });"
        ]
      },
      {
        "type": "text",
        "content": "// Producer"
      },
      {
        "type": "text",
        "content": "_ = Task.Run(async () =>"
      },
      {
        "type": "text",
        "content": "{"
      },
      {
        "type": "text",
        "content": "await foreach (var msg in source.ReadAllAsync())"
      },
      {
        "type": "text",
        "content": "await channel.Writer.WriteAsync(msg);"
      },
      {
        "type": "text",
        "content": "});"
      },
      {
        "type": "text",
        "content": "// Consumer"
      },
      {
        "type": "text",
        "content": "await foreach (var msg in channel.Reader.ReadAllAsync())"
      },
      {
        "type": "text",
        "content": "{"
      },
      {
        "type": "text",
        "content": "await ProcessAsync(msg);"
      },
      {
        "type": "text",
        "content": "}"
      },
      {
        "type": "text",
        "content": "`"
      },
      {
        "type": "list",
        "items": [
          "Use when: Consumer slower than producer; need to avoid overload.",
          "Avoid when: Throughput must be maximized with zero buffering—consider scaling consumers instead."
        ]
      },
      {
        "type": "list",
        "items": [
          "SemaphoreSlim vs lock",
          "SemaphoreSlim supports async waiting and throttling concurrency. It can represent both mutual exclusion (1 permit) and limited resource pools (>1 permits).",
          "Sample code: `csharp private readonly SemaphoreSlim _mutex = new(1, 1);"
        ]
      },
      {
        "type": "text",
        "content": "public async Task UseSharedAsync()"
      },
      {
        "type": "text",
        "content": "{"
      },
      {
        "type": "text",
        "content": "await _mutex.WaitAsync();"
      },
      {
        "type": "text",
        "content": "try { await SharedAsyncOperation(); }"
      },
      {
        "type": "text",
        "content": "finally { _mutex.Release(); }"
      },
      {
        "type": "text",
        "content": "}"
      },
      {
        "type": "text",
        "content": "`"
      },
      {
        "type": "list",
        "items": [
          "Use SemaphoreSlim when: Async code needs mutual exclusion or limited parallelism.",
          "Avoid when: Code is synchronous—lock has less overhead."
        ]
      }
    ],
    "category": "practice",
    "topic": "answers.md",
    "source": "practice/answers.md",
    "isSection": true,
    "id": "card-977"
  },
  {
    "question": "API & Lifecycle",
    "answer": [
      {
        "type": "list",
        "items": [
          "Middleware pipeline description",
          "Typical order: UseRouting → auth middleware → custom exception handling (usually early) → UseAuthentication/UseAuthorization → endpoint execution. Static file middleware, response compression, and caching can be interleaved before routing.",
          "Include correlation logging, caching, validation, and telemetry instrumentation.",
          "Sample code: `csharp app.UseMiddleware<CorrelationMiddleware>(); app.UseMiddleware<ExceptionHandlingMiddleware>(); app.UseRouting(); app.UseAuthentication(); app.UseAuthorization(); app.MapControllers(); `",
          "Use when: Building consistent request handling.",
          "Avoid when: For minimal APIs you might use delegate pipeline but still similar."
        ]
      },
      {
        "type": "list",
        "items": [
          "API versioning",
          "Strategies: URL segment (/v1/), header, query string.",
          "Use Asp.Versioning package.",
          "Sample code: `csharp services.AddApiVersioning(options => { options.DefaultApiVersion = new ApiVersion(1, 0); options.AssumeDefaultVersionWhenUnspecified = true; options.ReportApiVersions = true; }); services.AddVersionedApiExplorer(); `",
          "Use when: Breaking changes; maintain backward compatibility by keeping old controllers.",
          "Avoid when: Internal services with clients you control; choose contract-first to avoid version explosion."
        ]
      },
      {
        "type": "list",
        "items": [
          "Rate limiting & throttling",
          "Use ASP.NET rate limiting middleware or gateway.",
          "Techniques: token bucket, fixed window, sliding window.",
          "Sample code: `csharp services.AddRateLimiter(options => { options.AddFixedWindowLimiter(\"per-account\", opt => { opt.Window = TimeSpan.FromMinutes(1); opt.PermitLimit = 60; opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst; opt.QueueLimit = 20; }); });"
        ]
      },
      {
        "type": "text",
        "content": "app.UseRateLimiter();"
      },
      {
        "type": "text",
        "content": "`"
      },
      {
        "type": "list",
        "items": [
          "Use when: Protecting downstream resources.",
          "Avoid when: Latency-critical internal traffic; consider other forms of protection."
        ]
      },
      {
        "type": "list",
        "items": [
          "Correlation IDs propagation",
          "Generate ID in middleware, add to headers/log context, forward via HttpClient. Ensure asynchronous logging frameworks flow the correlation ID across threads (e.g., using AsyncLocal).",
          "Sample code: `csharp context.TraceIdentifier = context.TraceIdentifier ?? Guid.NewGuid().ToString(); _logger.LogInformation(\"{CorrelationId} handling {Path}\", context.TraceIdentifier, context.Request.Path); httpClient.DefaultRequestHeaders.Add(\"X-Correlation-ID\", context.TraceIdentifier); `",
          "Use when: Need distributed tracing.",
          "Avoid when: Truly isolated services—rare."
        ]
      }
    ],
    "category": "practice",
    "topic": "answers.md",
    "source": "practice/answers.md",
    "isSection": true,
    "id": "card-978"
  },
  {
    "question": "System Design",
    "answer": [
      {
        "type": "list",
        "items": [
          "Price Streaming Service",
          "Components: Ingestion (connectors to MT5), normalization workers, cache (Redis), API (REST/WebSocket), persistence. Add replay storage (Kafka topic or time-series DB) for audit and late subscribers.",
          "Use message queue (Kafka) for fan-out and resilient decoupling of ingestion from delivery.",
          "Sample pseudo-code: `csharp while (await mt5Stream.MoveNextAsync()) { var normalized = Normalize(mt5Stream.Current); await cache.SetAsync(normalized.Symbol, normalized.Price); await hubContext.Clients.Group(normalized.Symbol) .SendAsync(\"price\", normalized); } `",
          "Use when: Need low-latency price dissemination.",
          "Avoid when: Low-frequency batch updates suffice."
        ]
      },
      {
        "type": "list",
        "items": [
          "Order Execution Workflow",
          "Steps: receive REST order → validate (risk, compliance) → persist pending state → route to MT4/MT5 → await ack → publish result. Include idempotency keys on inbound requests and a reconciliation process for missing confirmations.",
          "Use saga/outbox for reliability and to coordinate compensating actions when downstream legs fail.",
          "Sample flow snippet: `csharp public async Task<IActionResult> Submit(OrderRequest dto) { var order = await _validator.ValidateAsync(dto); await _repository.SavePending(order); var result = await _mtGateway.SendAsync(order); await _repository.UpdateStatus(order.Id, result.Status); await _bus.Publish(new OrderStatusChanged(order.Id, result.Status)); return Ok(result); } `",
          "Use when: Real-time trading with external platforms.",
          "Avoid when: Simple internal workflows—overkill."
        ]
      },
      {
        "type": "list",
        "items": [
          "Real-Time Monitoring Dashboard",
          "Collect metrics via OpenTelemetry exporters, push to time-series DB (Prometheus), visualize in Grafana, alert via Alertmanager. Tag metrics with dimensions (service, region, environment) to support slicing and alert thresholds.",
          "Include streaming logs via ELK stack and trace sampling via Jaeger/Tempo.",
          "Sample instrumentation: `csharp var meter = new Meter(\"Trading.Services\"); var orderLatency = meter.CreateHistogram<double>(\"order_latency_ms\"); orderLatency.Record(latencyMs, KeyValuePair.Create<string, object?>(\"service\", serviceName)); `",
          "Use when: Need proactive observability.",
          "Avoid when: Prototype with low SLA."
        ]
      },
      {
        "type": "list",
        "items": [
          "Integrating external risk engine",
          "Use async messaging or REST; maintain schema adapters; ensure idempotency. Map risk statuses to domain-specific responses and version contracts to avoid breaking changes.",
          "Add caching for rules, circuit breakers, fallback decisions, and health checks to remove unhealthy nodes from rotation.",
          "Sample interaction: `csharp var riskResponse = await _riskClient.EvaluateAsync(order, ct); if (!riskResponse.Approved) return OrderDecision.Rejected(riskResponse.Reason); `",
          "Use when: External compliance requirement.",
          "Avoid when: Latency-critical path can't tolerate external dependency—consider in-process rules."
        ]
      }
    ],
    "category": "practice",
    "topic": "answers.md",
    "source": "practice/answers.md",
    "isSection": true,
    "id": "card-979"
  },
  {
    "question": "Messaging & Integration",
    "answer": [
      {
        "type": "list",
        "items": [
          "RabbitMQ vs ZeroMQ",
          "RabbitMQ: brokered, supports persistence, routing, acknowledgments, management UI, plugins.",
          "ZeroMQ: brokerless sockets, ultra-low latency but manual patterns, no persistence out of the box.",
          "Use RabbitMQ: Durable, complex routing, enterprise integration, where administrators need visibility and security.",
          "Use ZeroMQ: High-throughput, in-process/edge messaging; avoid if you need persistence or central management."
        ]
      },
      {
        "type": "list",
        "items": [
          "At-least-once with RabbitMQ",
          "Use durable queues, persistent messages, manual ack, idempotent consumers. Enable publisher confirms to ensure the broker persisted the message before acknowledging to the producer.",
          "Sample code: `csharp channel.BasicConsume(queue, autoAck: false, consumer); consumer.Received += (sender, ea) => { Handle(ea.Body); channel.BasicAck(ea.DeliveryTag, multiple: false); }; `",
          "Use when: You can tolerate duplicates; critical to ensure no loss.",
          "Avoid when: Exactly-once semantics required—use transactional outbox + dedup."
        ]
      },
      {
        "type": "list",
        "items": [
          "Saga pattern for account funding",
          "Orchestrator or choreography; manage compensations (reverse ledger entry, refund payment).",
          "Sample orchestrator: `csharp public async Task Handle(FundAccount command) { var transferId = await _payments.DebitAsync(command.PaymentId); try { await _ledger.CreditAsync(command.AccountId, command.Amount); await _notifications.SendAsync(command.AccountId, \"Funding complete\"); } catch { await _payments.RefundAsync(transferId); throw; } } `",
          "Use when: Multi-step, distributed transactions.",
          "Avoid when: Single system handles all steps—simple ACID transaction suffices."
        ]
      },
      {
        "type": "list",
        "items": [
          "Outbox pattern",
          "Write domain event to outbox table within same transaction, then relay to message bus. A background dispatcher polls the outbox table, publishes events, and marks them as processed (with retries and exponential backoff).",
          "Sample code: `csharp await using var tx = await db.Database.BeginTransactionAsync(); order.Status = OrderStatus.Accepted; db.Outbox.Add(new OutboxMessage(order.Id, new OrderAccepted(order.Id))); await db.SaveChangesAsync(); await tx.CommitAsync(); `",
          "Use when: Need atomic DB + message publish.",
          "Avoid when: No shared database or eventual consistency acceptable without duplication."
        ]
      }
    ],
    "category": "practice",
    "topic": "answers.md",
    "source": "practice/answers.md",
    "isSection": true,
    "id": "card-980"
  },
  {
    "question": "Data Layer",
    "answer": [
      {
        "type": "list",
        "items": [
          "Rolling 7-day trade volume",
          "SQL: `sql WITH daily AS ( SELECT instrument_id, trade_timestamp::date AS trade_date, SUM(volume) AS daily_volume FROM trades GROUP BY instrument_id, trade_timestamp::date ) SELECT instrument_id, trade_date, daily_volume, SUM(daily_volume) OVER ( PARTITION BY instrument_id ORDER BY trade_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW ) AS rolling_7d_volume FROM daily ORDER BY instrument_id, trade_date; `",
          "Use when: Need rolling metrics in SQL.",
          "Avoid when: Database lacks window functions—use app-side aggregation."
        ]
      },
      {
        "type": "list",
        "items": [
          "Normalized vs denormalized",
          "Normalized: reduces redundancy, good for OLTP. Changes cascade predictably, but reporting joins can be expensive.",
          "Denormalized: duplicates data for fast reads (reporting, analytics). Updates are more complex; rely on ETL pipelines to keep facts in sync.",
          "Choose based on workload: mixed? use hybrid star schema or CQRS approach with read-optimized projections."
        ]
      },
      {
        "type": "list",
        "items": [
          "Clustered vs non-clustered indexes",
          "Clustered: defines physical order, one per table; great for range scans.",
          "Non-clustered: separate structure pointing to data; can include columns.",
          "Covering index example: `sql CREATE NONCLUSTERED INDEX IX_Orders_Account_Status ON Orders(AccountId, Status) INCLUDE (CreatedAt, Amount); `",
          "Use covering index when: Query needs subset of columns; avoid extra lookups.",
          "Avoid when: Frequent writes—maintaining many indexes hurts performance."
        ]
      },
      {
        "type": "list",
        "items": [
          "Handling long-running report query",
          "Strategies: read replicas, materialized views, batching, query hints, schedule off-peak. Consider breaking the query into smaller windowed segments and streaming results to avoid locking.",
          "Implement caching, pre-aggregation, and monitor execution plans for regressions."
        ]
      }
    ],
    "category": "practice",
    "topic": "answers.md",
    "source": "practice/answers.md",
    "isSection": true,
    "id": "card-981"
  },
  {
    "question": "Trading Domain Knowledge",
    "answer": [
      {
        "type": "list",
        "items": [
          "Forex trade lifecycle",
          "Steps: quote, order placement, validation, routing, execution (fill/partial), confirmation, settlement (T+2), P&L updates. Post-trade, apply trade capture in back-office systems and reconcile with liquidity providers.",
          "Include margin checks and clearing, corporate actions, and overnight financing (swap) adjustments."
        ]
      },
      {
        "type": "list",
        "items": [
          "Integrating with MT4/MT5",
          "Use MetaTrader Manager/Server APIs via C# wrappers; handle session auth, keep-alive, throttle requests. Manage connections via dedicated service accounts and pre-allocate connection pools.",
          "Implement reconnect logic, map errors, ensure idempotent order submission. Translate MT-specific error codes into domain-level responses for clients.",
          "Sample pseudo-code: `csharp using var session = new Mt5Gateway(credentials); await session.ConnectAsync(); var ticket = await session.SendOrderAsync(request); `"
        ]
      },
      {
        "type": "list",
        "items": [
          "Risk checks before execution",
          "Margin availability, max exposure per instrument, credit limits, duplicate orders, fat-finger (price deviation).",
          "Implement pre-trade risk service."
        ]
      },
      {
        "type": "list",
        "items": [
          "Handling market data bursts",
          "Use batching, diff updates, UDP multicast ingestion, prioritized queues, snapshot + incremental updates. Utilize adaptive sampling—send every tick to VIP clients while throttling retail feeds.",
          "Apply throttling per client, drop non-critical updates after stale, and monitor queue depths to trigger auto-scaling."
        ]
      }
    ],
    "category": "practice",
    "topic": "answers.md",
    "source": "practice/answers.md",
    "isSection": true,
    "id": "card-982"
  },
  {
    "question": "Behavioral & Soft Skills",
    "answer": [
      {
        "type": "list",
        "items": [
          "Leading production fix",
          "Discuss scenario: triage, swarm, communication, root cause, postmortem. Highlight proactive rollback plans and customer communication cadence."
        ]
      },
      {
        "type": "list",
        "items": [
          "Process automation improvement",
          "Example: build CI pipeline, reduce manual deployment, measured time saved. Emphasize KPIs such as deployment frequency and lead time."
        ]
      },
      {
        "type": "list",
        "items": [
          "Team conflict resolution",
          "Example: align on goals, active listening, data-driven decision, mediation. Demonstrate neutral facilitation and follow-up agreements."
        ]
      },
      {
        "type": "list",
        "items": [
          "Commitment to documentation",
          "Example: created runbooks, knowledge base, improved onboarding. Include metrics such as onboarding time reduction and support ticket deflection."
        ]
      }
    ],
    "category": "practice",
    "topic": "answers.md",
    "source": "practice/answers.md",
    "isSection": true,
    "id": "card-983"
  },
  {
    "question": "Questions for the Interviewer",
    "answer": [
      {
        "type": "list",
        "items": [
          "Collaboration structure question demonstrates interest in cross-team dynamics.",
          "MT4/MT5 challenges question reveals curiosity about domain complexities.",
          "Success metrics question aligns expectations.",
          "Continuous learning question shows growth mindset."
        ]
      }
    ],
    "category": "practice",
    "topic": "answers.md",
    "source": "practice/answers.md",
    "isSection": true,
    "id": "card-984"
  },
  {
    "question": "C# Language & Runtime",
    "answer": [
      {
        "type": "list",
        "items": [
          "Explain the difference between value types and reference types. How do ref, out, and in parameters influence behavior?",
          "Answer: Value types live inline and copy by value; reference types live on the managed heap and are passed by reference to objects. ref passes a variable by reference for both read/write, out requires assignment inside the method, and in passes by readonly reference to avoid copies for large structs.",
          "How does the garbage collector work (generations, LOH, GC modes), and when would you use GC.TryStartNoGCRegion?",
          "Answer: .NET uses generational GC (0/1/2) plus the Large Object Heap; short-lived objects stay in gen0/1, long-lived survive to gen2/LOH. Workstation vs server modes tune throughput/latency. Use GC.TryStartNoGCRegion for short, allocation-free critical windows (e.g., low-latency operations) and call EndNoGCRegion afterward.",
          "Describe how IDisposable and the using/await using patterns work. When do you need a finalizer?",
          "Answer: IDisposable.Dispose releases unmanaged resources deterministically via using/await using to ensure disposal on success or exception. Finalizers are a safety net for unmanaged handles when Dispose is missed; combine with SafeHandle and GC.SuppressFinalize after successful disposal.",
          "Compare struct vs class trade-offs. When is readonly struct appropriate?",
          "Answer: Structs avoid heap allocations and have value semantics but can copy frequently and suffer boxing; classes allow inheritance, reference semantics, and polymorphism. Use readonly struct for small immutable value objects (e.g., coordinates, money types) to prevent defensive copies.",
          "How do you design immutable types in C#? What are common pitfalls when exposing collections?",
          "Answer: Make fields private, set via constructor, expose get-only properties, avoid setters/mutable state, and return defensive copies or IReadOnlyCollection<T>/ImmutableArray<T>. Avoid exposing mutable lists or arrays directly to prevent external mutation.",
          "Explain covariance and contravariance in generics. How do in and out keywords affect interfaces and delegates?",
          "Answer: Covariance (out) lets you use a more derived return type (e.g., IEnumerable<Derived> as IEnumerable<Base>); contravariance (in) allows consuming base types (e.g., IComparer<Base> for Derived). Delegates/interfaces marked out support producing types; in supports consuming types; both restrict usage (no in params on out types).",
          "When would you use Span<T>/Memory<T>? What are their constraints in async and iterator methods?",
          "Answer: Use for high-performance, allocation-free slicing over contiguous memory (stackalloc, arrays, native buffers). Span<T> is stack-only and cannot escape to async/iterator state machines; use Memory<T>/ReadOnlyMemory<T> for heap-backed, async-friendly scenarios.",
          "How do nullable reference types work? How do you enable them and handle warnings effectively?",
          "Answer: Enable via #nullable enable or <Nullable>enable</Nullable> to distinguish nullable vs non-nullable references. The compiler tracks null flow and issues warnings; address via proper initialization, null checks (! sparingly), and annotations (?, [NotNull], [MaybeNull]).",
          "What are the differences between dynamic dispatch (virtual/override), explicit interface implementation, and pattern matching dispatch?",
          "Answer: Virtual/override uses v-table dispatch on runtime type; explicit interface implementation hides members unless accessed through the interface; pattern matching dispatch uses switch expressions/is checks to branch on types/shapes at runtime without inheritance.",
          "How do records differ from classes and structs? When would you choose each?",
          "Answer: Records prioritize value-based equality and with-expressions; record class is reference-based, record struct is value-based. Use records for immutable data models/DTOs with equality semantics; use classes for behavior-heavy types; structs for small value types where copying is cheap."
        ]
      }
    ],
    "category": "practice",
    "topic": "csharp-system-design-questions.md",
    "source": "practice/csharp-system-design-questions.md",
    "isSection": true,
    "id": "card-985"
  },
  {
    "question": "Async, Parallelism & Concurrency",
    "answer": [
      {
        "type": "list",
        "items": [
          "Describe the async/await state machine and how the SynchronizationContext affects continuations.",
          "Answer: The compiler rewrites async methods into state machines that schedule continuations on await completion. SynchronizationContext (or TaskScheduler) determines where continuations run; in ASP.NET Core the context is minimal so continuations may hop threads, while UI contexts marshal back to the UI thread unless ConfigureAwait(false) is used.",
          "When would you use Task.Run versus async I/O? How do you avoid thread pool starvation?",
          "Answer: Use Task.Run for CPU-bound work; prefer async I/O to avoid blocking threads for I/O. Avoid starvation by keeping synchronous blocking off async paths, using ConfigureAwait(false) where appropriate, and measuring thread pool queues (EventCounters/PerfView) to detect exhaustion.",
          "How do you handle cancellation and timeouts cooperatively? Show how to link multiple CancellationTokenSource instances.",
          "Answer: Pass CancellationToken through APIs, check ThrowIfCancellationRequested, and use using var cts = CancellationTokenSource.CreateLinkedTokenSource(token1, token2); combined with CancelAfter for timeouts. Ensure resources are disposed and operations honor the token.",
          "Compare SemaphoreSlim, lock, Monitor, and ReaderWriterLockSlim. When is each appropriate?",
          "Answer: lock/Monitor provide mutual exclusion within a process; Monitor offers advanced features (pulse/wait). SemaphoreSlim supports async waiting and limited concurrency; ReaderWriterLockSlim allows multiple readers/single writer. Choose based on async support and contention patterns.",
          "How do you design a producer/consumer pipeline in C#? When would you pick System.Threading.Channels over TPL Dataflow or Reactive Extensions?",
          "Answer: Use bounded/unbounded channels, async readers/writers, and background consumers with cancellation and backpressure. Channels give low-overhead primitives; TPL Dataflow adds richer blocks/linking; Rx suits push-based composable queries. Use channels for lightweight server pipelines with tight control.",
          "Explain the difference between IAsyncEnumerable<T> and IEnumerable<T>. How do you cancel async streams?",
          "Answer: IEnumerable<T> is synchronous pull; IAsyncEnumerable<T> is async pull with await foreach. Cancel via await foreach (var item in source.WithCancellation(token)) or pass tokens into producers; dispose async enumerators to stop work.",
          "How do you detect and mitigate deadlocks in async code (e.g., ConfigureAwait(false), avoiding .Result/.Wait(), using timeouts)?",
          "Answer: Avoid blocking on async (.Result/.Wait()), use ConfigureAwait(false) to prevent context captures where safe, add timeouts and cancellation, use async all the way. Detect via dump analysis (Sync-over-async stacks), ETW traces, and logging of pending tasks.",
          "What tools and techniques do you use for profiling and diagnosing performance issues in async-heavy services?",
          "Answer: Use dotnet-trace/dotnet-counters, PerfView, EventPipe, Application Insights/OpenTelemetry traces, and BenchmarkDotNet for microbenchmarks. Correlate spans/logs and sample flame graphs to find hotspots/allocations."
        ]
      }
    ],
    "category": "practice",
    "topic": "csharp-system-design-questions.md",
    "source": "practice/csharp-system-design-questions.md",
    "isSection": true,
    "id": "card-986"
  },
  {
    "question": "Collections, LINQ & Data Access",
    "answer": [
      {
        "type": "list",
        "items": [
          "How do IEnumerable<T>, IQueryable<T>, and IAsyncEnumerable<T> differ? When is deferred execution helpful or harmful?",
          "Answer: IEnumerable<T> is in-memory synchronous enumeration; IQueryable<T> builds expression trees for remote providers; IAsyncEnumerable<T> streams asynchronously. Deferred execution enables composability and avoids work until iteration but can surprise with repeated queries or side effects; materialize when needed.",
          "Explain how LINQ query operators translate to SQL in EF Core. What are common pitfalls (client eval, N+1 queries, Include vs projection)?",
          "Answer: EF Core converts expression trees to SQL; unsupported methods fall back to client eval (often disabled). Avoid N+1 by using projections or Include judiciously; prefer shape-specific projections for performance and to reduce payloads.",
          "How do you design efficient pagination and filtering for large datasets? Compare keyset pagination to offset/limit.",
          "Answer: Use indexed filters, stable sort keys, and limit projections. Offset/limit is simple but slow at high offsets; keyset (seek) pagination uses WHERE key > lastKey ORDER BY key for faster scans and consistent latency.",
          "What strategies help manage memory when processing large collections (buffering, streaming, batching)?",
          "Answer: Stream results with AsAsyncEnumerable, process in batches, use pagination, avoid materializing large lists, and use ArrayPool<T>/MemoryPool<T> when appropriate.",
          "How do you model relationships in EF Core (owned types, value objects, many-to-many) and enforce invariants?",
          "Answer: Use owned types/value objects for aggregate-internal concepts, configure many-to-many with join entities when extra data is needed, and enforce invariants in the domain layer (constructors/factories) with validation in DbContext configurations.",
          "Describe optimistic concurrency control in EF Core. How do you detect and resolve conflicts?",
          "Answer: Use concurrency tokens (rowversion/timestamps) so EF includes them in WHERE clauses; conflicts throw DbUpdateConcurrencyException. Resolve by refreshing values, client- or store-wins policies, or merging changes before retrying."
        ]
      }
    ],
    "category": "practice",
    "topic": "csharp-system-design-questions.md",
    "source": "practice/csharp-system-design-questions.md",
    "isSection": true,
    "id": "card-987"
  },
  {
    "question": "APIs & ASP.NET Core",
    "answer": [
      {
        "type": "list",
        "items": [
          "Walk through the ASP.NET Core middleware pipeline. How do you add global exception handling and request logging?",
          "Answer: Requests flow through middleware in order. Add early middleware for correlation IDs and logging, use UseExceptionHandler/UseDeveloperExceptionPage for global handling, and UseSerilogRequestLogging or custom middleware for structured logs before routing.",
          "How do you implement authentication and authorization (JWT, cookies, policies, claims transformations)?",
          "Answer: Configure authentication schemes (JWT bearer, cookies, OAuth/OIDC). Add authorization policies with requirements/handlers, use [Authorize(Policy=\"name\")], and add claims transformation for enrichment after authentication.",
          "Compare minimal APIs, traditional controllers, and gRPC services. When would you choose each?",
          "Answer: Minimal APIs are lightweight for small services/HTTP endpoints; controllers provide structure, filters, and model binding for larger REST APIs; gRPC offers strongly-typed, high-performance contracts for service-to-service communication.",
          "How do you version APIs and deprecate endpoints gracefully? What contract testing approaches do you use?",
          "Answer: Use URL or header-based versioning, maintain parallel controllers/handlers, document deprecations, and add Sunset headers. Use consumer-driven contract tests (e.g., Pact), OpenAPI-based validation, and integration tests to guard contracts.",
          "How do you secure APIs against common attacks (CSRF, SSRF, SQL injection, deserialization issues, header validation)?",
          "Answer: Enable antiforgery for cookie-authenticated state-changing actions, validate/whitelist outbound URLs, use parameterized queries/EF Core to avoid injection, restrict JSON options (known types, max depth), validate headers, and apply input validation.",
          "Describe strategies for rate limiting, throttling, and backpressure in APIs.",
          "Answer: Use fixed/windowed/token-bucket rate limiting per client/API key, return 429 with Retry-After, apply circuit breakers and queue bounds, and shed load with graceful degradation or priority queues."
        ]
      }
    ],
    "category": "practice",
    "topic": "csharp-system-design-questions.md",
    "source": "practice/csharp-system-design-questions.md",
    "isSection": true,
    "id": "card-988"
  },
  {
    "question": "Testing, Quality & Observability",
    "answer": [
      {
        "type": "list",
        "items": [
          "How do you structure unit, integration, and contract tests in a .NET solution? What belongs in each layer?",
          "Answer: Unit tests target pure logic with mocks; integration tests cover real infrastructure (DB, messaging) and API endpoints; contract tests validate external contracts/consumers. Organize by project with parallel test assemblies and shared fixtures.",
          "When should you use test doubles (mocks/stubs/fakes) versus in-memory providers? What are the trade-offs of using TestServer or WebApplicationFactory?",
          "Answer: Use mocks/stubs for isolated logic; in-memory providers can mask behavior differences (e.g., EF in-memory vs SQL). TestServer/WebApplicationFactory enable end-to-end HTTP tests without network; trade-offs are slower execution but higher fidelity.",
          "How do you test async code and ensure deterministic timing (e.g., virtual time, Task.Delay wrappers)?",
          "Answer: Avoid real sleeps; abstract timers/delays, use virtual schedulers (Rx TestScheduler), and assert with Task.WhenAny plus timeouts. Use FakeTimeProvider in .NET 8 for deterministic time.",
          "What metrics, logs, and traces do you collect in production services? How do you correlate them (structured logging, OpenTelemetry)?",
          "Answer: Collect request rates/latency, error rates, resource utilization, and domain KPIs. Use structured logging with correlation IDs/trace IDs; emit OTLP traces/metrics and link logs via trace context.",
          "How do you design feature flags and configuration rollouts? How do you test them safely?",
          "Answer: Use centralized flag service with targeting and audit trails; default to safe values; wrap features with guard rails. Test via dark launches, A/B cohorts, and staged rollouts; implement kill switches and config validation on startup."
        ]
      }
    ],
    "category": "practice",
    "topic": "csharp-system-design-questions.md",
    "source": "practice/csharp-system-design-questions.md",
    "isSection": true,
    "id": "card-989"
  },
  {
    "question": "Security & Performance",
    "answer": [
      {
        "type": "list",
        "items": [
          "How do you handle secrets in .NET apps (user secrets, Key Vault, environment variables, Kubernetes secrets)?",
          "Answer: Store secrets outside code in user secrets for local dev, environment variables for simple deployments, managed secret stores (Azure Key Vault, AWS Secrets Manager), or Kubernetes secrets mounted/injected. Use IConfiguration binding and rotation-friendly design.",
          "What are common pitfalls with HttpClient? When would you use HttpClientFactory and why?",
          "Answer: Creating per-request clients causes socket exhaustion; forgetting timeouts leads to hung calls. HttpClientFactory manages handler lifetimes, pooling, Polly policies, and typed/named clients for configuration reuse.",
          "How do you cache effectively in .NET (MemoryCache, distributed cache, cache invalidation strategies, cache stampede prevention)?",
          "Answer: Choose MemoryCache for single-instance, distributed cache (Redis) for multi-instance. Set TTLs, use versioned keys, and handle stampedes with locks/async initialization. Implement cache-aside or write-through/write-behind depending on consistency needs.",
          "How do you approach performance tuning (benchmarking with BenchmarkDotNet, profiling allocations, minimizing boxing)?",
          "Answer: Benchmark critical code with BenchmarkDotNet, profile CPU/allocations with PerfView/dotnet-trace, reduce allocations/boxing, pool objects, and measure before/after with metrics.",
          "Describe strategies for minimizing locking and contention in high-throughput services.",
          "Answer: Prefer lock-free/low-contention structures (Concurrent collections, channels), shard state, reduce shared mutable data, use async I/O to free threads, and batch work.",
          "How do you approach secure serialization/deserialization (System.Text.Json settings, preserving type safety, limiting payload size)?",
          "Answer: Restrict known types, set max depth/buffer size, validate input, avoid polymorphic deserialization of untrusted data, and use JsonSerializerOptions with safe defaults (ignore comments, forbid trailing commas if needed)."
        ]
      }
    ],
    "category": "practice",
    "topic": "csharp-system-design-questions.md",
    "source": "practice/csharp-system-design-questions.md",
    "isSection": true,
    "id": "card-990"
  },
  {
    "question": "System Design Fundamentals",
    "answer": [
      {
        "type": "list",
        "items": [
          "How do you clarify functional and non-functional requirements before proposing an architecture?",
          "Answer: Elicit user journeys, data flows, SLAs (latency, availability), throughput goals, compliance, and constraints. Confirm priorities and success metrics before sketching architecture.",
          "Compare monolith, modular monolith, and microservices. What criteria drive the choice?",
          "Answer: Monolith is simplest to deploy; modular monolith enforces boundaries while staying single-deployable; microservices enable independent scaling and team autonomy but add ops/observability overhead. Choose based on team size, domain complexity, deployment independence, and reliability needs.",
          "How do you approach capacity planning and load estimation? What metrics do you need before sizing components?",
          "Answer: Gather QPS/RPS targets, payload sizes, P99 latency goals, growth rates, and traffic patterns. Model peak vs average, back-of-envelope compute/storage estimates, and validate with load tests.",
          "How do you design for elasticity and fault isolation? When do you use horizontal vs vertical scaling?",
          "Answer: Use stateless services with autoscaling, bulkheads per resource, and isolation per tenant/feature. Prefer horizontal scaling for resilience and elasticity; vertical scaling for quick wins or stateful components when horizontal is hard.",
          "Explain consistency models (strong vs eventual). When is each acceptable? How would you implement them?",
          "Answer: Strong consistency guarantees immediate visibility; eventual allows stale reads for availability/latency. Use strong for critical invariants (payments, inventory) and eventual for read-heavy, latency-sensitive scenarios via async replication, caches, or queues.",
          "How would you handle schema evolution and backward compatibility in distributed systems?",
          "Answer: Use additive changes first, versioned contracts/schemas, tolerant readers, feature flags, and dual-write/read paths during migrations. Maintain backward compatibility until all consumers upgrade; use blue/green migrations and data backfills."
        ]
      }
    ],
    "category": "practice",
    "topic": "csharp-system-design-questions.md",
    "source": "practice/csharp-system-design-questions.md",
    "isSection": true,
    "id": "card-991"
  },
  {
    "question": "Data, Storage & Caching",
    "answer": [
      {
        "type": "list",
        "items": [
          "How do you choose between relational and NoSQL stores for a given workload? When would you pair them (polyglot persistence)?",
          "Answer: Relational offers strong consistency and rich queries; NoSQL offers scalability and flexible schemas. Use polyglot when different workloads need different guarantees (e.g., SQL for transactions, NoSQL for analytics/search or high-velocity writes).",
          "How do you design read/write paths for high-traffic services (CQRS, read replicas, write-through vs write-behind caching)?",
          "Answer: Separate reads/writes with CQRS, use read replicas for scale, and apply caching. Write-through updates cache synchronously; write-behind buffers writes for throughput but risks loss—guard with durable queues/outbox.",
          "How would you design a multi-tenant data model? What isolation strategies do you consider?",
          "Answer: Options: shared schema with tenant keys, separate schemas, or separate databases. Consider noisy-neighbor isolation, encryption per tenant, throttling, and routing based on tenant metadata.",
          "What strategies ensure data durability and disaster recovery (backups, snapshots, multi-region replication, RPO/RTO)?",
          "Answer: Automate backups with tested restores, snapshots for speed, multi-AZ/region replication, and define RPO/RTO targets with failover runbooks and chaos drills.",
          "How do you design cache invalidation and freshness policies (TTL, versioned keys, soft expiration, cache warming)?",
          "Answer: Use TTLs with jitter, version keys on schema changes, apply soft expiration with background refresh, and warm caches on deploy/scale events for consistent latency."
        ]
      }
    ],
    "category": "practice",
    "topic": "csharp-system-design-questions.md",
    "source": "practice/csharp-system-design-questions.md",
    "isSection": true,
    "id": "card-992"
  },
  {
    "question": "Messaging, Eventing & Streaming",
    "answer": [
      {
        "type": "list",
        "items": [
          "Compare message brokers (RabbitMQ, Kafka, Azure Service Bus). How do you choose among them?",
          "Answer: RabbitMQ excels at flexible routing/low latency; Kafka offers high-throughput ordered logs and retention; Service Bus provides managed queues/topics with dead-lettering. Choose based on throughput, ordering, retention, and operational preferences.",
          "How do you design at-least-once, at-most-once, and exactly-once processing semantics? What trade-offs exist?",
          "Answer: At-least-once retries can duplicate work—requires idempotency. At-most-once avoids duplicates but risks loss. Exactly-once is approximated via idempotent writes/transactions; increases complexity and latency.",
          "How would you implement the outbox pattern? When is it necessary?",
          "Answer: Store outgoing events in the same DB transaction as state changes, then relay via background publisher to the broker, marking sent messages. Necessary when bridging DB and message broker to avoid lost/duplicated events.",
          "How do you design idempotent consumers and handle poison messages? What is a dead-letter queue strategy?",
          "Answer: Use idempotency keys, dedup tables, or UPSERTs; make handlers side-effect-safe. Send repeatedly failing messages to DLQ with metadata, alert, and provide replay/fix workflow.",
          "How do you handle ordering guarantees in distributed event streams? When do you shard by key vs use single partitions?",
          "Answer: Preserve order per key by routing to the same partition; single partition guarantees order globally but limits throughput. Shard by key for scalability while maintaining per-entity ordering; include sequence checks to detect gaps.",
          "How would you build a real-time streaming pipeline for pricing or telemetry data? How do you manage backpressure?",
          "Answer: Ingest via Kafka/Event Hubs, process with streaming processors, and serve via caches/WebSockets. Manage backpressure with bounded queues, rate limits, scaling consumers, and dropping/aggregating non-critical data when overloaded."
        ]
      }
    ],
    "category": "practice",
    "topic": "csharp-system-design-questions.md",
    "source": "practice/csharp-system-design-questions.md",
    "isSection": true,
    "id": "card-993"
  },
  {
    "question": "Reliability, Resilience & Operations",
    "answer": [
      {
        "type": "list",
        "items": [
          "How do you design circuit breakers, retries with jitter, and bulkheads? When should retries be disabled?",
          "Answer: Circuit breakers open on failure thresholds to stop thundering herds; retries with jitter spread load; bulkheads isolate resources (connection pools, queues). Disable retries for non-idempotent operations or when failures are persistent (e.g., validation errors).",
          "What strategies help with graceful degradation and feature kill switches during incidents?",
          "Answer: Provide fallback responses, disable non-essential features via flags, reduce quality (smaller payloads), and prioritize core paths. Kill switches should be fast, central, and auditable.",
          "How do you design health checks, readiness checks, and liveness checks for microservices? How should orchestrators react?",
          "Answer: Liveness detects stuck processes (restart); readiness ensures dependencies are available before traffic; health checks cover domain-level checks. Orchestrators should remove from load balancers on readiness fail and restart on liveness fail.",
          "How do you approach blue/green or canary deployments? What telemetry do you watch during rollouts?",
          "Answer: Deploy to a green environment or small canary slice, route partial traffic, and compare metrics. Watch error rates, latency, saturation, and business KPIs; roll back quickly on regressions.",
          "How do you perform chaos testing or game days? What metrics indicate resilience?",
          "Answer: Inject faults (latency, outages) in lower environments or controlled prod; observe recovery times, alerting, and SLO adherence. Metrics: success rate, recovery time, saturation, error budgets consumed.",
          "How do you detect and mitigate cascading failures in distributed systems?",
          "Answer: Use bulkheads, timeouts, circuit breakers, load shedding, and backpressure. Monitor dependency health and propagate cancellation; design graceful degradation to localize failures."
        ]
      }
    ],
    "category": "practice",
    "topic": "csharp-system-design-questions.md",
    "source": "practice/csharp-system-design-questions.md",
    "isSection": true,
    "id": "card-994"
  },
  {
    "question": "API & Client Experience",
    "answer": [
      {
        "type": "list",
        "items": [
          "How do you design contracts for longevity (e.g., tolerant readers, additive changes, schema registries)?",
          "Answer: Favor additive, backward-compatible changes; require tolerant readers; use versioned schemas/OpenAPI and registries; deprecate slowly with clear communication.",
          "What strategies help ensure backward compatibility for mobile or desktop clients with long upgrade cycles?",
          "Answer: Maintain old versions, use feature flags/capability negotiation, avoid breaking changes, and design server defaults to match legacy behavior. Provide migration guides and staged sunsets.",
          "How do you design pagination, filtering, and sorting APIs at scale? When would you expose GraphQL vs REST?",
          "Answer: Provide consistent pagination models (cursor/keyset preferred), allow filter/sort on indexed fields, and cap page sizes. Use GraphQL for flexible client-driven data shaping; REST for simpler, cache-friendly endpoints.",
          "How do you model eventual consistency to users (progress states, compensating actions, retries in UI)?",
          "Answer: Show intermediate states (pending/processing), allow idempotent retries, surface tracking IDs, and implement compensating actions (undo/cancel) when background work fails."
        ]
      }
    ],
    "category": "practice",
    "topic": "csharp-system-design-questions.md",
    "source": "practice/csharp-system-design-questions.md",
    "isSection": true,
    "id": "card-995"
  },
  {
    "question": "Domain-Driven Design & Architecture",
    "answer": [
      {
        "type": "list",
        "items": [
          "How do you identify bounded contexts and anti-corruption layers? When would you use domain events?",
          "Answer: Map language and workflows to find cohesive domains; use ACLs to translate between contexts and protect models. Emit domain events to decouple side effects within a boundary.",
          "How do you enforce invariants and aggregate boundaries? What belongs inside vs outside an aggregate?",
          "Answer: Keep invariants enforced inside aggregate methods/constructors; only expose behaviors that preserve rules. Keep transactional consistency within aggregates; reference others by ID; put long-running workflows outside (sagas/process managers).",
          "How do you design module boundaries to reduce coupling in a large solution? How do you keep assemblies from becoming god projects?",
          "Answer: Use clear namespaces, internal visibility, and dependency rules (architecture tests). Limit shared kernels, favor feature folders/modules, and enforce public APIs per module.",
          "What is your approach to layering (API, application, domain, infrastructure) and cross-cutting concerns?",
          "Answer: API layer handles transport, application orchestrates use cases, domain holds business logic, infrastructure implements persistence/messaging. Cross-cutting concerns use decorators/middleware/aspects without leaking into domain."
        ]
      }
    ],
    "category": "practice",
    "topic": "csharp-system-design-questions.md",
    "source": "practice/csharp-system-design-questions.md",
    "isSection": true,
    "id": "card-996"
  },
  {
    "question": "Trade & FinTech Scenarios (if relevant)",
    "answer": [
      {
        "type": "list",
        "items": [
          "How would you design a price streaming service with fan-out to WebSocket clients and downstream analytics?",
          "Answer: Ingest market data into a durable bus (Kafka), normalize, cache latest prices, and fan-out via WebSockets/SignalR with backpressure. Persist ticks for analytics and snapshots; shard by symbol for ordering.",
          "How do you design an order lifecycle with validation, risk checks, routing, and post-trade reconciliation?",
          "Answer: Use a state machine per order, apply pre-trade validations and risk limits, route via smart router to venues, capture executions, and reconcile with clearing/ledgers. Ensure idempotent events and audit trails.",
          "How do you build a reliable FIX/FAST/REST gateway for external brokers? How do you handle sequence gaps and retries?",
          "Answer: Implement session management, heartbeats, and sequence tracking; persist session state; recover gaps via resend requests; throttle/resend with backoff; isolate tenants; and validate messages strictly.",
          "How would you ensure auditability and traceability for regulatory requirements? What storage and retention strategies do you use?",
          "Answer: Use append-only logs, immutability (WORM storage), signed/hashed records, and durable retention per regulation. Include correlation IDs for events, maintain tamper-evident trails, and automate exports for compliance."
        ]
      }
    ],
    "category": "practice",
    "topic": "csharp-system-design-questions.md",
    "source": "practice/csharp-system-design-questions.md",
    "isSection": true,
    "id": "card-997"
  },
  {
    "question": "Behavioral & Collaboration",
    "answer": [
      {
        "type": "list",
        "items": [
          "Describe a time you had to simplify an over-engineered solution. How did you influence stakeholders?",
          "Answer: Explain the problem/impact, propose a simpler alternative with cost/benefit, present data (performance/maintainability), run a spike/prototype, and align stakeholders via demos and risk analysis.",
          "How do you lead technical design reviews? What artifacts do you produce and how do you gather feedback?",
          "Answer: Prepare a concise design doc (problem, goals, options, trade-offs), diagrams, and risks; share ahead of time, run a structured meeting, capture decisions, and follow up with action items.",
          "How do you prioritize refactoring and tech debt without slowing feature delivery?",
          "Answer: Tie debt to measurable risk/impact, bundle refactors with feature work, use small iterative changes, and maintain a prioritized debt backlog with dedicated capacity.",
          "When mentoring junior engineers, how do you balance guidance with letting them learn through mistakes?",
          "Answer: Provide guardrails (tests, checklists), pair program, set clear goals, allow safe experiments, and conduct constructive retros to reinforce learning while protecting quality."
        ]
      }
    ],
    "category": "practice",
    "topic": "csharp-system-design-questions.md",
    "source": "practice/csharp-system-design-questions.md",
    "isSection": true,
    "id": "card-998"
  },
  {
    "question": "LINQ & Collections",
    "answer": [
      {
        "type": "list",
        "items": [
          "Given a list of trades with timestamps, return the latest trade per account using LINQ.",
          "Implement a method that flattens nested lists of instrument codes while preserving ordering.",
          "Explain the difference between SelectMany and nested loops. When is each preferable?",
          "How would you detect duplicate orders in a stream using GroupBy and produce a summary?"
        ]
      }
    ],
    "category": "practice",
    "topic": "questions.md",
    "source": "practice/questions.md",
    "isSection": true,
    "id": "card-999"
  },
  {
    "question": "Async & Resilience",
    "answer": [
      {
        "type": "list",
        "items": [
          "Sketch code to call three REST endpoints concurrently, cancel if any take longer than 3 seconds, and aggregate results.",
          "Implement a resilient HTTP client with retry and circuit breaker policies using Polly.",
          "How would you handle backpressure when consuming a fast message queue with a slower downstream API?",
          "Explain why you might use SemaphoreSlim with async code over lock."
        ]
      }
    ],
    "category": "practice",
    "topic": "questions.md",
    "source": "practice/questions.md",
    "isSection": true,
    "id": "card-1000"
  },
  {
    "question": "API & Lifecycle",
    "answer": [
      {
        "type": "list",
        "items": [
          "Describe the ASP.NET Core middleware pipeline for a request hitting an authenticated endpoint with custom exception handling.",
          "How do you implement API versioning and backward compatibility?",
          "Discuss strategies for rate limiting and request throttling.",
          "How would you log correlation IDs across services and propagate them to downstream dependencies?"
        ]
      }
    ],
    "category": "practice",
    "topic": "questions.md",
    "source": "practice/questions.md",
    "isSection": true,
    "id": "card-1001"
  },
  {
    "question": "System Design",
    "answer": [
      {
        "type": "list",
        "items": [
          "Price Streaming Service: Design a service that ingests MT5 tick data, normalizes it, caches latest prices, and exposes them via REST/WebSocket.",
          "Order Execution Workflow: Design an API that receives orders, validates, routes to MT4/MT5, and confirms execution. Include failure recovery.",
          "Real-Time Monitoring Dashboard: Architect a system to collect metrics from trading microservices and alert on anomalies.",
          "Discuss how you would integrate an external risk management engine into an existing microservices ecosystem."
        ]
      }
    ],
    "category": "practice",
    "topic": "questions.md",
    "source": "practice/questions.md",
    "isSection": true,
    "id": "card-1002"
  },
  {
    "question": "Messaging & Integration",
    "answer": [
      {
        "type": "list",
        "items": [
          "Compare RabbitMQ and ZeroMQ for distributing price updates. When would you choose one over the other?",
          "Explain how to ensure at-least-once delivery with RabbitMQ while preventing duplicate processing.",
          "How would you design a saga pattern to coordinate account funding across multiple services?",
          "Discuss the outbox pattern and how it prevents message loss in event-driven systems."
        ]
      }
    ],
    "category": "practice",
    "topic": "questions.md",
    "source": "practice/questions.md",
    "isSection": true,
    "id": "card-1003"
  },
  {
    "question": "Data Layer",
    "answer": [
      {
        "type": "list",
        "items": [
          "Write a SQL query to calculate the rolling 7-day trade volume per instrument.",
          "Explain how you would choose between normalized schemas and denormalized tables for reporting.",
          "Describe the differences between clustered and non-clustered indexes and when to use covering indexes.",
          "Walk through handling a long-running report query that impacts OLTP performance."
        ]
      }
    ],
    "category": "practice",
    "topic": "questions.md",
    "source": "practice/questions.md",
    "isSection": true,
    "id": "card-1004"
  },
  {
    "question": "Trading Domain Knowledge",
    "answer": [
      {
        "type": "list",
        "items": [
          "Describe the lifecycle of a forex trade from placement to settlement.",
          "How would you integrate with MT4/MT5 APIs for trade execution in C#? Mention authentication, session management, and error handling.",
          "What are common risk checks before executing a client order (e.g., margin, exposure limits)?",
          "Explain how youd handle market data bursts without dropping updates."
        ]
      }
    ],
    "category": "practice",
    "topic": "questions.md",
    "source": "practice/questions.md",
    "isSection": true,
    "id": "card-1005"
  },
  {
    "question": "Behavioral & Soft Skills",
    "answer": [
      {
        "type": "list",
        "items": [
          "Tell me about a time you led a critical production fix under pressure.",
          "Describe a situation where you improved a process by automating manual work.",
          "Discuss a conflict within a team and how you resolved it.",
          "Share a story that demonstrates your commitment to documentation or knowledge sharing."
        ]
      }
    ],
    "category": "practice",
    "topic": "questions.md",
    "source": "practice/questions.md",
    "isSection": true,
    "id": "card-1006"
  },
  {
    "question": "Questions for the Interviewer",
    "answer": [
      {
        "type": "list",
        "items": [
          "How does structure collaboration between developers, QA, and trading desks?",
          "What are the biggest technical challenges facing the MT4/MT5 integration team right now?",
          "How do you measure success for developers in this role within the first 6 months?",
          "What opportunities exist for continuous learning and innovation within the engineering org?"
        ]
      }
    ],
    "category": "practice",
    "topic": "questions.md",
    "source": "practice/questions.md",
    "isSection": true,
    "id": "card-1007"
  },
  {
    "question": "Access Modifiers  public, private, internal, protected (and variants)",
    "answer": [
      {
        "type": "text",
        "content": "Quick summary:"
      },
      {
        "type": "list",
        "items": [
          "public: accessible from any code that can see the type.",
          "private: accessible only within the containing type (default for members).",
          "internal: accessible to code within the same assembly (project output).",
          "protected: accessible within the containing type and its derived types.",
          "protected internal: accessible from derived types or any code in the same assembly.",
          "private protected (C# 7.2+): accessible within the containing class or derived types in the same assembly."
        ]
      },
      {
        "type": "text",
        "content": "Examples:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class Base\n{\n    private int _secret;                 // only inside Base\n    protected int ProtectedValue;        // Base + derived classes\n    internal int InternalValue;          // same assembly\n    public int PublicValue;              // everyone\n}\n\npublic class Derived : Base\n{\n    void Demo()\n    {\n        // can access ProtectedValue and InternalValue and PublicValue\n        // cannot access _secret\n    }\n}\n\n// Top-level types (classes) without a modifier default to internal.",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Notes:"
      },
      {
        "type": "list",
        "items": [
          "Use private to encapsulate implementation details.",
          "Use internal to expose APIs across your project but hide them from other assemblies.",
          "Prefer protected sparingly; heavy use can expose internal invariants to subclasses and increase coupling."
        ]
      }
    ],
    "category": "practice",
    "topic": "questions.md",
    "source": "practice/questions.md",
    "isSection": true,
    "id": "card-1008"
  },
  {
    "question": "Dependency Injection Lifetimes  Transient, Scoped, Singleton (and tips)",
    "answer": [
      {
        "type": "text",
        "content": "Quick summary (Microsoft.Extensions.DependencyInjection semantics):"
      },
      {
        "type": "list",
        "items": [
          "Transient: a new instance is created every time the service is requested.",
          "Scoped: a single instance is created per scope (in ASP.NET Core a scope is typically a single HTTP request).",
          "Singleton: a single instance is created for the application's lifetime (or until the container is disposed)."
        ]
      },
      {
        "type": "text",
        "content": "Examples and behavior:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "services.AddTransient<IRepo, Repo>();   // new Repo each injection\nservices.AddScoped<IRepo, Repo>();      // one Repo per request/scope\nservices.AddSingleton<IRepo, Repo>();   // single Repo for the app lifetime",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Important tips:"
      },
      {
        "type": "list",
        "items": [
          "Use Scoped for per-request services that hold state tied to the request (e.g., DbContext).",
          "Use Singleton for stateless, thread-safe services (caches, configuration providers). Be careful with mutable singletons.",
          "Avoid injecting a Scoped service into a Singleton  the scoped service may be captured incorrectly leading to unintended shared state or runtime errors.",
          "Transient is good for lightweight, stateless services; it can be used when you explicitly want fresh instances."
        ]
      },
      {
        "type": "text",
        "content": "Pitfall example:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Bad: singleton holding a scoped dependency\nservices.AddSingleton<MySingleton>();\nservices.AddScoped<MyScopedDependency>();\n\npublic class MySingleton\n{\n    public MySingleton(MyScopedDependency dep) { /* captured scoped dep = problematic */ }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "If you need to use a scoped service from a singleton, resolve scoped instances using IServiceScopeFactory or limit the singleton to factory-style resolution at operation time."
      }
    ],
    "category": "practice",
    "topic": "questions.md",
    "source": "practice/questions.md",
    "isSection": true,
    "id": "card-1009"
  },
  {
    "question": "Code Assessment Questions & Answers (with snippets)",
    "answer": [
      {
        "type": "text",
        "content": "Use these to rehearse typical coding test prompts. Aim to talk through complexity trade-offs and add small notes about edge cases."
      },
      {
        "type": "list",
        "items": [
          "Async REST fan-out with cancellation and timeout"
        ]
      },
      {
        "type": "text",
        "content": "Question (real-life style): \"You have to hit three quote endpoints in parallel and bail out if any call takes longer than 3 seconds, while still honoring upstream cancellation. Return only non-null quotes. Sketch the method you'd drop into the pricing client.\""
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public static async Task<IReadOnlyList<Quote>> FetchQuotesAsync(HttpClient client, CancellationToken cancellationToken)\n{\n    using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);\n    cts.CancelAfter(TimeSpan.FromSeconds(3));\n\n    var endpoints = new[] {\"prices/eurusd\", \"prices/gbpusd\", \"prices/usdjpy\"};\n    var tasks = endpoints.Select(e => client.GetFromJsonAsync<Quote>(e, cts.Token)).ToArray();\n\n    var results = await Task.WhenAll(tasks);\n    return results!\n        .Where(q => q is not null)\n        .ToArray();\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Notes: Use CancellationTokenSource.CreateLinkedTokenSource to respect upstream cancellation. Consider wrapping each call with Try/Finally or Task.WhenAny if partial failures should be tolerated instead of throwing."
      },
      {
        "type": "list",
        "items": [
          "LRU cache for price lookups"
        ]
      },
      {
        "type": "text",
        "content": "Question (real-life style): \"Implement an in-memory LRU cache (single-threaded is fine) for up to N price lookups with O(1) Put/TryGet. Show the class you would hand to another team to reuse in a console app.\""
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public sealed class LruCache<TKey, TValue>\n{\n    private readonly int _capacity;\n    private readonly Dictionary<TKey, LinkedListNode<(TKey Key, TValue Value)>> _map = new();\n    private readonly LinkedList<(TKey Key, TValue Value)> _list = new();\n\n    public LruCache(int capacity) => _capacity = capacity;\n\n    public void Put(TKey key, TValue value)\n    {\n        if (_map.TryGetValue(key, out var node))\n        {\n            node.Value = (key, value);\n            _list.Remove(node);\n            _list.AddFirst(node);\n            return;\n        }\n\n        if (_map.Count == _capacity)\n        {\n            var toRemove = _list.Last!;\n            _map.Remove(toRemove.Value.Key);\n            _list.RemoveLast();\n        }\n\n        var newNode = new LinkedListNode<(TKey, TValue)>((key, value));\n        _list.AddFirst(newNode);\n        _map[key] = newNode;\n    }\n\n    public bool TryGet(TKey key, out TValue value)\n    {\n        if (_map.TryGetValue(key, out var node))\n        {\n            _list.Remove(node);\n            _list.AddFirst(node);\n            value = node.Value.Value;\n            return true;\n        }\n\n        value = default!;\n        return false;\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Notes: Put and TryGet are O(1). Thread-safety can be added with SemaphoreSlim for async scenarios or lock for synchronous use."
      },
      {
        "type": "list",
        "items": [
          "Concurrent producer/consumer pipeline for order enrichment"
        ]
      },
      {
        "type": "text",
        "content": "Question (real-life style): \"We ingest orders into a channel and need to enrich them via an async call before publishing. Write the enrichment pipeline so it can fan out work and push enriched orders to the outbound channel.\""
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public static async Task StartEnrichmentPipeline(Channel<Order> inbound, Func<Order, Task<Order>> enrich, Channel<Order> outbound)\n{\n    await foreach (var order in inbound.Reader.ReadAllAsync())\n    {\n        _ = Task.Run(async () =>\n        {\n            var enriched = await enrich(order);\n            await outbound.Writer.WriteAsync(enriched);\n        });\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Notes: Use Channel.CreateBounded<Order>(capacity) to add backpressure. For stricter ordering, await tasks or use Parallel.ForEachAsync with MaxDegreeOfParallelism."
      },
      {
        "type": "list",
        "items": [
          "SQL: find latest fill per order"
        ]
      },
      {
        "type": "text",
        "content": "Question (real-life style): \"Given a fills table with order_id, fill_price, and filled_at, write a query that returns only the most recent fill per order for a compliance report.\""
      },
      {
        "type": "code",
        "language": "sql",
        "code": "SELECT DISTINCT ON (order_id) order_id, fill_price, filled_at\nFROM fills\nORDER BY order_id, filled_at DESC;",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Notes: DISTINCT ON is PostgreSQL-specific; in SQL Server, use ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY filled_at DESC) and filter on ROW_NUMBER = 1."
      },
      {
        "type": "list",
        "items": [
          "Minimal API health endpoint with dependency injection"
        ]
      },
      {
        "type": "text",
        "content": "Question (real-life style): \"Expose a /health endpoint in a minimal API that reports 200 when a price feed is connected, otherwise 503. Keep the composition root small and use DI for the feed implementation.\""
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var builder = WebApplication.CreateBuilder(args);\nbuilder.Services.AddSingleton<IPriceFeed, PriceFeed>();\nvar app = builder.Build();\n\napp.MapGet(\"/health\", (IPriceFeed feed) => feed.IsConnected\n    ? Results.Ok(new { status = \"ok\" })\n    : Results.StatusCode(StatusCodes.Status503ServiceUnavailable));\n\nawait app.RunAsync();",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Notes: Mapping the health check keeps the app’s composition root small. Consider adding UseHealthChecks or custom readiness/liveness probes for Kubernetes deployments."
      },
      {
        "type": "list",
        "items": [
          "Secure parameterized data access to prevent SQL injection"
        ]
      },
      {
        "type": "text",
        "content": "Question (real-life style): \"Refactor a repository method that currently concatenates accountId into SQL. Show a safe, parameterized implementation that streams results asynchronously.\""
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public async Task<IReadOnlyList<Order>> GetOrdersAsync(\n    SqlConnection connection,\n    int accountId,\n    CancellationToken cancellationToken)\n{\n    const string sql = \"SELECT order_id, symbol, qty, status FROM dbo.Orders WHERE account_id = @AccountId\";\n\n    await using var cmd = new SqlCommand(sql, connection);\n    cmd.Parameters.Add(new SqlParameter(\"@AccountId\", SqlDbType.Int) { Value = accountId });\n\n    await using var reader = await cmd.ExecuteReaderAsync(cancellationToken);\n    var orders = new List<Order>();\n    while (await reader.ReadAsync(cancellationToken))\n    {\n        orders.Add(new Order\n        {\n            Id = reader.GetInt32(0),\n            Symbol = reader.GetString(1),\n            Quantity = reader.GetDecimal(2),\n            Status = reader.GetString(3)\n        });\n    }\n\n    return orders;\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Notes: Always bind parameters instead of string interpolation to avoid SQL injection. Use least-privileged SQL logins and timeouts to limit blast radius, and validate accountId ranges before querying."
      },
      {
        "type": "list",
        "items": [
          "JWT authentication with audience validation and clock skew control"
        ]
      },
      {
        "type": "text",
        "content": "Question (real-life style): \"You need to secure an API with JWT bearer auth. Configure validation to lock issuer/audience, tighten clock skew, and require a symmetric signing key from configuration. What does the startup code look like?\""
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)\n    .AddJwtBearer(options =>\n    {\n        options.TokenValidationParameters = new TokenValidationParameters\n        {\n            ValidateIssuer = true,\n            ValidIssuer = \"https://issuer.example.com\",\n            ValidateAudience = true,\n            ValidAudience = \"trading-api\",\n            ValidateLifetime = true,\n            ClockSkew = TimeSpan.FromMinutes(1),\n            ValidateIssuerSigningKey = true,\n            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config[\"Jwt:SigningKey\"]))\n        };\n    });",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Notes: Tighten ClockSkew to reduce replay windows, ensure HTTPS-only transport, and rotate signing keys. Add RequireAuthorization() on sensitive endpoints and propagate correlation IDs for audit logs."
      },
      {
        "type": "list",
        "items": [
          "Performance: span-based parsing to reduce allocations"
        ]
      },
      {
        "type": "text",
        "content": "Question (real-life style): \"We parse numeric quantities from protocol buffers and want to avoid string allocations. Implement a span-based parser that returns -1 on invalid input.\""
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public static int ParseQuantity(ReadOnlySpan<char> span)\n{\n    // Expects numeric ASCII; returns -1 for invalid input.\n    int value = 0;\n    foreach (var ch in span)\n    {\n        if ((uint)(ch - '0') > 9) return -1;\n        value = unchecked(value * 10 + (ch - '0'));\n    }\n    return value;\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Notes: Using ReadOnlySpan<char> avoids string allocations when parsing slices from protocol buffers or HTTP headers. Consider int.TryParse(ReadOnlySpan<char>, NumberStyles, IFormatProvider, out int) for built-in validation and benchmark with BenchmarkDotNet to confirm gains."
      },
      {
        "type": "list",
        "items": [
          "Performance: async streaming to lower memory footprint"
        ]
      },
      {
        "type": "text",
        "content": "Question (real-life style): \"Show how you would stream trades from an HTTP endpoint without buffering the whole payload, yielding trades as they arrive and honoring cancellation.\""
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public static async IAsyncEnumerable<Trade> StreamTradesAsync(\n    HttpClient client,\n    [EnumeratorCancellation] CancellationToken cancellationToken)\n{\n    await using var stream = await client.GetStreamAsync(\"trades/stream\", cancellationToken);\n    await foreach (var trade in JsonSerializer.DeserializeAsyncEnumerable<Trade>(stream, cancellationToken: cancellationToken))\n    {\n        if (trade is not null)\n            yield return trade;\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Notes: Streaming deserialization prevents buffering large payloads. Combine with HttpClientFactory for connection reuse and set MaxResponseContentBufferSize when buffering is unavoidable. Add defensive cancellation to avoid stuck I/O."
      }
    ],
    "category": "practice",
    "topic": "questions.md",
    "source": "practice/questions.md",
    "isSection": true,
    "id": "card-1010"
  },
  {
    "question": "⚙️ How it works",
    "answer": [
      {
        "type": "list",
        "items": [
          "Step 1: a temporarily holds the sum of both.",
          "Step 2: Subtracting b from sum gives original a.",
          "Step 3: Subtracting new b gives original b."
        ]
      }
    ],
    "category": "practice",
    "topic": "real exam questions answers",
    "source": "practice/real exam questions answers/replace int without variable.md",
    "isSection": true,
    "id": "card-1011"
  },
  {
    "question": "⚠️ Caveat",
    "answer": [
      {
        "type": "list",
        "items": [
          "Risk of integer overflow if a + b exceeds the data type’s range."
        ]
      }
    ],
    "category": "practice",
    "topic": "real exam questions answers",
    "source": "practice/real exam questions answers/replace int without variable.md",
    "isSection": true,
    "id": "card-1012"
  },
  {
    "question": "🧠 How it works",
    "answer": [
      {
        "type": "text",
        "content": "XOR has a neat property:"
      },
      {
        "type": "list",
        "items": [
          "x ^ x = 0",
          "x ^ 0 = x",
          "x ^ y ^ y = x"
        ]
      },
      {
        "type": "text",
        "content": "So:"
      },
      {
        "type": "list",
        "items": [
          "a = a ^ b → combined info of a & b",
          "b = a ^ b → becomes original a",
          "a = a ^ b → becomes original b"
        ]
      }
    ],
    "category": "practice",
    "topic": "real exam questions answers",
    "source": "practice/real exam questions answers/replace int without variable.md",
    "isSection": true,
    "id": "card-1013"
  },
  {
    "question": "✅ Pros",
    "answer": [
      {
        "type": "list",
        "items": [
          "No overflow risk",
          "Works perfectly for integers"
        ]
      }
    ],
    "category": "practice",
    "topic": "real exam questions answers",
    "source": "practice/real exam questions answers/replace int without variable.md",
    "isSection": true,
    "id": "card-1014"
  },
  {
    "question": "🔍 3️⃣ Comparison",
    "answer": [
      {
        "type": "table",
        "headers": [
          "Method",
          "Uses",
          "Overflow Risk",
          "Works For",
          "Readability"
        ],
        "rows": [
          [
            "Arithmetic",
            "+, -",
            "⚠️ Yes",
            "Numeric types",
            "Moderate"
          ],
          [
            "Bitwise XOR",
            "^",
            "✅ No",
            "Integers only",
            "Less intuitive"
          ]
        ]
      }
    ],
    "category": "practice",
    "topic": "real exam questions answers",
    "source": "practice/real exam questions answers/replace int without variable.md",
    "isSection": true,
    "id": "card-1015"
  },
  {
    "question": "🚀 Interview Tip",
    "answer": [
      {
        "type": "text",
        "content": "If asked in an interview, say:"
      },
      {
        "type": "text",
        "content": "> “There are two main ways — arithmetic or bitwise XOR. XOR is safer because it avoids overflow and doesn’t need extra storage.”"
      }
    ],
    "category": "practice",
    "topic": "real exam questions answers",
    "source": "practice/real exam questions answers/replace int without variable.md",
    "isSection": true,
    "id": "card-1016"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "a = 10, b = 5",
        "codeType": "good"
      }
    ],
    "category": "practice",
    "topic": "real exam questions answers",
    "source": "practice/real exam questions answers/replace int without variable.md",
    "isConcept": true,
    "id": "card-1017"
  },
  {
    "question": "Good Practice Example",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "a = 10, b = 5",
        "codeType": "good"
      }
    ],
    "category": "practice",
    "topic": "real exam questions answers",
    "source": "practice/real exam questions answers/replace int without variable.md",
    "isConcept": true,
    "id": "card-1018"
  },
  {
    "question": "✅ Expected answer:",
    "answer": [
      {
        "type": "text",
        "content": "By default, structs are passed by value, meaning a copy of all their fields is made."
      },
      {
        "type": "text",
        "content": "If the struct is large, this creates CPU overhead from copying."
      },
      {
        "type": "text",
        "content": "To avoid this, pass by reference using in, ref, or out."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "readonly struct Tick\n{\n    public string Symbol { get; }\n    public double Bid { get; }\n    public double Ask { get; }\n}\n\nvoid Process(in Tick tick)\n{\n    Console.WriteLine(tick.Symbol);\n}",
        "codeType": "neutral"
      },
      {
        "type": "list",
        "items": [
          "in → pass by ref, but readonly (no copy, safe from mutation).",
          "ref → pass by ref, can mutate.",
          "out → pass by ref, must assign inside method."
        ]
      },
      {
        "type": "text",
        "content": "💡 Mention:"
      },
      {
        "type": "text",
        "content": "> “In high-throughput systems, like a tick feed handler, we pass large structs in by reference to eliminate per-call copy cost.”"
      }
    ],
    "category": "practice",
    "topic": "real exam questions answers",
    "source": "practice/real exam questions answers/struct vs class questions and answers.md",
    "isSection": true,
    "id": "card-1019"
  },
  {
    "question": "✅ Expected answer:",
    "answer": [
      {
        "type": "text",
        "content": "Boxing occurs when a value type (struct) is converted to an object or interface type."
      },
      {
        "type": "text",
        "content": "The runtime must allocate a new object on the heap and copy the struct into it → triggering GC pressure."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "struct Point { public int X, Y; }\n\nobject o = new Point();  // boxing (heap allocation)",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Unboxing ((Point)o) copies it back — so you get two allocations + copies."
      },
      {
        "type": "text",
        "content": "💡 Mention:"
      },
      {
        "type": "text",
        "content": "> “Boxing kills the zero-allocation goal. In financial tick pipelines, I’d avoid it by using generics or struct-constrained interfaces like ISpanFormattable.”"
      }
    ],
    "category": "practice",
    "topic": "real exam questions answers",
    "source": "practice/real exam questions answers/struct vs class questions and answers.md",
    "isSection": true,
    "id": "card-1020"
  },
  {
    "question": "✅ Expected answer:",
    "answer": [
      {
        "type": "text",
        "content": "When you access a struct in a collection, you get a copy — not the original instance."
      },
      {
        "type": "text",
        "content": "So mutating it does not change the element inside the collection."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var list = new List<Point> { new Point { X = 1, Y = 1 } };\nlist[0].X = 99; // modifies the copy, not the original!\nConsole.WriteLine(list[0].X); // prints 1, not 99",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "To modify it properly, reassign:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var p = list[0];\np.X = 99;\nlist[0] = p;",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "💡 Mention:"
      },
      {
        "type": "text",
        "content": "> “This behavior can create hidden bugs when structs are used in collections. I use readonly struct where possible, to make them immutable and avoid accidental mutations.”"
      }
    ],
    "category": "practice",
    "topic": "real exam questions answers",
    "source": "practice/real exam questions answers/struct vs class questions and answers.md",
    "isSection": true,
    "id": "card-1021"
  },
  {
    "question": "✅ Expected answer:",
    "answer": [
      {
        "type": "text",
        "content": "A readonly struct guarantees no field will change after construction."
      },
      {
        "type": "text",
        "content": "This allows:"
      },
      {
        "type": "list",
        "items": [
          "Safer by-ref passing (in).",
          "The JIT to optimize away defensive copies.",
          "Reduced bugs in concurrent code."
        ]
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "readonly struct Price\n{\n    public double Bid { get; }\n    public double Ask { get; }\n    public Price(double bid, double ask) { Bid = bid; Ask = ask; }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "💡 Mention:"
      },
      {
        "type": "text",
        "content": "> “Readonly structs are crucial for passing by in reference in tight loops without the JIT inserting hidden defensive copies — essential in trading data parsing or serialization code.”"
      }
    ],
    "category": "practice",
    "topic": "real exam questions answers",
    "source": "practice/real exam questions answers/struct vs class questions and answers.md",
    "isSection": true,
    "id": "card-1022"
  },
  {
    "question": "✅ Expected answer:",
    "answer": [
      {
        "type": "list",
        "items": [
          "Small structs (≤ 16–32 bytes) → fast to copy, GC-friendly.",
          "Large structs (> 64 bytes) → expensive to copy by value, slower to pass around.",
          "Structs don’t hit GC directly, but large structs stored inside heap objects (like arrays/lists) increase heap size."
        ]
      },
      {
        "type": "text",
        "content": "💡 Rule of thumb:"
      },
      {
        "type": "text",
        "content": "Use structs for tiny, immutable data packets (ticks, coordinates, color, timestamps)."
      },
      {
        "type": "text",
        "content": "Use classes for entities with identity, behavior, or shared references."
      },
      {
        "type": "text",
        "content": "Example (HFM context):"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "readonly struct Tick\n{\n    public string Symbol { get; init; }\n    public double Bid { get; init; }\n    public double Ask { get; init; }\n}\nclass TickStreamProcessor { /* class that manages state */ }",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "💡 Mention:"
      },
      {
        "type": "text",
        "content": "> “At scale — where millions of ticks flow per second — keeping structs small and readonly helps stay in Gen0 and reduces GC load. If a struct becomes too big, I switch to a reference type.”"
      }
    ],
    "category": "practice",
    "topic": "real exam questions answers",
    "source": "practice/real exam questions answers/struct vs class questions and answers.md",
    "isSection": true,
    "id": "card-1023"
  },
  {
    "question": "🎯 Bonus (for “wow” points)",
    "answer": [
      {
        "type": "text",
        "content": "If the interviewer presses for memory-level behavior:"
      },
      {
        "type": "text",
        "content": "> “Structs are laid out inline, which improves locality of reference — CPU caches love that."
      },
      {
        "type": "text",
        "content": "> Classes live on the heap and require pointer indirection. That’s why structs are great for sequential data like price ticks or order books.”"
      }
    ],
    "category": "practice",
    "topic": "real exam questions answers",
    "source": "practice/real exam questions answers/struct vs class questions and answers.md",
    "isSection": true,
    "id": "card-1024"
  },
  {
    "question": "✅ Quick Summary Answer (say this in 20 seconds)",
    "answer": [
      {
        "type": "text",
        "content": "> “Structs are value types — stored inline, copied by value, and ideal for small, immutable data where GC avoidance and memory locality matter."
      },
      {
        "type": "text",
        "content": "> Classes are reference types, heap-allocated, reference-based, and better for shared mutable state or inheritance."
      },
      {
        "type": "text",
        "content": "> Boxing, large struct copies, and accidental mutation in collections are common pitfalls."
      },
      {
        "type": "text",
        "content": "> I use readonly struct with in parameters to write high-performance, zero-GC code — perfect for financial tick processing.”"
      }
    ],
    "category": "practice",
    "topic": "real exam questions answers",
    "source": "practice/real exam questions answers/struct vs class questions and answers.md",
    "isSection": true,
    "id": "card-1025"
  },
  {
    "question": "🧩 2. Why can boxing destroy the performance benefits of structs?",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "struct Point { public int X, Y; }\n\nobject o = new Point();  // boxing (heap allocation)",
        "codeType": "good"
      }
    ],
    "category": "practice",
    "topic": "real exam questions answers",
    "source": "practice/real exam questions answers/struct vs class questions and answers.md",
    "isConcept": true,
    "id": "card-1026"
  },
  {
    "question": "🧩 3. What happens when you mutate a struct that’s stored in a collection like a List<T>?",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "var list = new List<Point> { new Point { X = 1, Y = 1 } };\nlist[0].X = 99; // modifies the copy, not the original!\nConsole.WriteLine(list[0].X); // prints 1, not 99",
        "codeType": "good"
      }
    ],
    "category": "practice",
    "topic": "real exam questions answers",
    "source": "practice/real exam questions answers/struct vs class questions and answers.md",
    "isConcept": true,
    "id": "card-1027"
  }
];
