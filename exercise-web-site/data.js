// Auto-generated practice Q&A data from practice/ folder
// Generated on: 2026-01-06T22:24:52.061Z
// Total cards: 366 Q&A

window.PRACTICE_DATA = [
  {
    "question": "Given a list of trades with timestamps, return the latest trade per account using LINQ.",
    "answer": [
      {
        "type": "text",
        "content": "Sort or group by account and pick the trade with the max timestamp using GroupBy + OrderByDescending/MaxBy. This keeps the logic declarative and pushes the temporal ordering into the query rather than manual loops."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var latestTrades = trades\n    .GroupBy(t => t.AccountId)\n    .Select(g => g.OrderByDescending(t => t.Timestamp).First());",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when you need the most recent entry per key without mutating state, such as building dashboards or reconciling snapshots. Avoid when the dataset is huge and you'd benefit from streaming/SQL aggregation; consider database query with ROW_NUMBER or a materialized view to avoid loading everything into memory."
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-1"
  },
  {
    "question": "Implement a method that flattens nested lists of instrument codes while preserving ordering.",
    "answer": [
      {
        "type": "text",
        "content": "Use SelectMany to flatten while keeping inner order."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var flat = nestedCodes.SelectMany(list => list);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when you have nested enumerables and simply need to concatenate them. Avoid when you must retain hierarchy boundaries—use nested loops instead."
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-2"
  },
  {
    "question": "Explain the difference between SelectMany and nested loops. When is each preferable?",
    "answer": [
      {
        "type": "text",
        "content": "SelectMany projects each element to a sequence and flattens; nested loops make iteration explicit and allow more control over flow."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// SelectMany\nvar pairs = accounts.SelectMany(a => a.Orders, (a, o) => new { a.Id, o.Id });\n\n// Nested loops\nforeach (var a in accounts)\n    foreach (var o in a.Orders)\n        yield return (a.Id, o.Id);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use SelectMany when you want a fluent declarative pipeline or need joins. Use loops when performance-critical, complex control flow, or break/continue needed."
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-3"
  },
  {
    "question": "How would you detect duplicate orders in a stream using GroupBy and produce a summary?",
    "answer": [
      {
        "type": "text",
        "content": "Group by unique order keys and filter groups with count > 1. Summaries can include counts, timestamps, and other aggregate metadata that drive remediation."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var duplicates = orders\n    .GroupBy(o => new { o.AccountId, o.ClientOrderId })\n    .Where(g => g.Count() > 1)\n    .Select(g => new {\n        g.Key.AccountId,\n        g.Key.ClientOrderId,\n        Count = g.Count(),\n        LatestTimestamp = g.Max(o => o.Timestamp)\n    });",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when you need summaries and easy grouping. Avoid when data volume exceeds in-memory capabilities—use database aggregates or streaming dedup."
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-4"
  },
  {
    "question": "Find all customers who have placed orders in the last 30 days and calculate their total order value.",
    "answer": [
      {
        "type": "text",
        "content": "Use Where to filter by date range, then GroupBy customer and Sum the order values."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var cutoffDate = DateTime.UtcNow.AddDays(-30);\nvar customerTotals = orders\n    .Where(o => o.OrderDate >= cutoffDate)\n    .GroupBy(o => o.CustomerId)\n    .Select(g => new {\n        CustomerId = g.Key,\n        TotalValue = g.Sum(o => o.TotalAmount),\n        OrderCount = g.Count()\n    });",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-5"
  },
  {
    "question": "Given two lists (products and categories), perform a left join to get all products with their category names (null if no category).",
    "answer": [
      {
        "type": "text",
        "content": "Use GroupJoin or LeftJoin pattern with DefaultIfEmpty."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var result = products\n    .GroupJoin(\n        categories,\n        p => p.CategoryId,\n        c => c.Id,\n        (product, cats) => new { product, cats })\n    .SelectMany(\n        x => x.cats.DefaultIfEmpty(),\n        (x, category) => new {\n            x.product.Name,\n            CategoryName = category?.Name ?? \"Uncategorized\"\n        });",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-6"
  },
  {
    "question": "Implement a LINQ query to find the top 5 most expensive products in each category.",
    "answer": [
      {
        "type": "text",
        "content": "Group by category, order by price descending, take 5."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var topProducts = products\n    .GroupBy(p => p.CategoryId)\n    .Select(g => new {\n        CategoryId = g.Key,\n        TopProducts = g.OrderByDescending(p => p.Price).Take(5).ToList()\n    });",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-7"
  },
  {
    "question": "Find all pairs of employees who work in the same department (avoid duplicates like (A,B) and (B,A)).",
    "answer": [
      {
        "type": "text",
        "content": "Self-join with condition to avoid duplicates."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var pairs = employees\n    .SelectMany(e1 => employees, (e1, e2) => new { e1, e2 })\n    .Where(p => p.e1.DepartmentId == p.e2.DepartmentId && p.e1.Id < p.e2.Id)\n    .Select(p => new { Employee1 = p.e1.Name, Employee2 = p.e2.Name });",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-8"
  },
  {
    "question": "Calculate running totals for daily sales.",
    "answer": [
      {
        "type": "text",
        "content": "Use Aggregate with accumulator or window function approach."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var runningTotal = sales\n    .OrderBy(s => s.Date)\n    .Select((sale, index) => new {\n        sale.Date,\n        sale.Amount,\n        RunningTotal = sales\n            .OrderBy(s => s.Date)\n            .Take(index + 1)\n            .Sum(s => s.Amount)\n    });\n\n// More efficient approach\ndecimal total = 0;\nvar runningTotals = sales\n    .OrderBy(s => s.Date)\n    .Select(s => new {\n        s.Date,\n        s.Amount,\n        RunningTotal = total += s.Amount\n    })\n    .ToList();",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-9"
  },
  {
    "question": "Implement a custom LINQ extension method DistinctBy that takes a key selector.",
    "answer": [
      {
        "type": "text",
        "content": "Create an extension method that uses HashSet for tracking seen keys."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public static class LinqExtensions\n{\n    public static IEnumerable<TSource> DistinctBy<TSource, TKey>(\n        this IEnumerable<TSource> source,\n        Func<TSource, TKey> keySelector)\n    {\n        var seenKeys = new HashSet<TKey>();\n        foreach (var element in source)\n        {\n            if (seenKeys.Add(keySelector(element)))\n                yield return element;\n        }\n    }\n}\n\n// Usage\nvar uniqueProducts = products.DistinctBy(p => p.Name);",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-10"
  },
  {
    "question": "Write a LINQ query to find all employees whose salary is above the average salary in their department.",
    "answer": [
      {
        "type": "text",
        "content": "Use subquery or join with calculated averages."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var departmentAvgs = employees\n    .GroupBy(e => e.DepartmentId)\n    .Select(g => new { DeptId = g.Key, AvgSalary = g.Average(e => e.Salary) })\n    .ToDictionary(x => x.DeptId, x => x.AvgSalary);\n\nvar aboveAverage = employees\n    .Where(e => e.Salary > departmentAvgs[e.DepartmentId])\n    .Select(e => new {\n        e.Name,\n        e.Salary,\n        DeptAverage = departmentAvgs[e.DepartmentId]\n    });",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-11"
  },
  {
    "question": "Implement pagination with LINQ (Skip/Take) and explain potential issues with IQueryable vs IEnumerable.",
    "answer": [
      {
        "type": "text",
        "content": "Use Skip and Take for pagination."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public IEnumerable<Product> GetProductsPage(int pageNumber, int pageSize)\n{\n    return dbContext.Products\n        .OrderBy(p => p.Id)  // IMPORTANT: Must order for consistent pagination\n        .Skip((pageNumber - 1) * pageSize)\n        .Take(pageSize)\n        .ToList();  // Execute query here\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Potential Issues:"
      },
      {
        "type": "list",
        "items": [
          "IQueryable: Translates to SQL, efficient but can cause N+1 queries if not careful",
          "IEnumerable: Loads all data into memory before Skip/Take, very inefficient",
          "Always order before Skip/Take to ensure consistent results",
          "Consider total count query for UI pagination info"
        ]
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-12"
  },
  {
    "question": "Write a LINQ query to pivot data (convert rows to columns).",
    "answer": [
      {
        "type": "text",
        "content": "Use GroupBy and dynamic property creation."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Input: Sales with Year, Quarter, Amount\n// Output: Year with Q1, Q2, Q3, Q4 columns\n\nvar pivoted = sales\n    .GroupBy(s => s.Year)\n    .Select(g => new {\n        Year = g.Key,\n        Q1 = g.Where(s => s.Quarter == 1).Sum(s => s.Amount),\n        Q2 = g.Where(s => s.Quarter == 2).Sum(s => s.Amount),\n        Q3 = g.Where(s => s.Quarter == 3).Sum(s => s.Amount),\n        Q4 = g.Where(s => s.Quarter == 4).Sum(s => s.Amount)\n    });",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-13"
  },
  {
    "question": "Implement a LINQ query with multiple grouping levels (hierarchical grouping).",
    "answer": [
      {
        "type": "text",
        "content": "Nest GroupBy operations."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var hierarchicalGroups = sales\n    .GroupBy(s => s.Year)\n    .Select(yearGroup => new {\n        Year = yearGroup.Key,\n        Quarters = yearGroup\n            .GroupBy(s => s.Quarter)\n            .Select(quarterGroup => new {\n                Quarter = quarterGroup.Key,\n                TotalSales = quarterGroup.Sum(s => s.Amount),\n                Transactions = quarterGroup.ToList()\n            })\n            .ToList()\n    });",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-14"
  },
  {
    "question": "Find all consecutive sequences of at least 3 days where sales exceeded $10,000.",
    "answer": [
      {
        "type": "text",
        "content": "Use windowing logic with LINQ."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var threshold = 10000m;\nvar consecutiveHighSales = sales\n    .OrderBy(s => s.Date)\n    .Select((sale, index) => new {\n        sale,\n        index,\n        IsHigh = sale.Amount > threshold\n    })\n    .Where(x => x.IsHigh)\n    .GroupBy(x => x.index - sales\n        .OrderBy(s => s.Date)\n        .TakeWhile((s, i) => i < x.index)\n        .Count(s => s.Amount > threshold))\n    .Where(g => g.Count() >= 3)\n    .Select(g => new {\n        StartDate = g.First().sale.Date,\n        EndDate = g.Last().sale.Date,\n        DayCount = g.Count()\n    });",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-15"
  },
  {
    "question": "Explain deferred execution and when it can cause performance issues.",
    "answer": [
      {
        "type": "text",
        "content": "LINQ queries using IEnumerable are not executed until enumerated. Multiple enumerations re-execute the query."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Bad: Query executes 3 times\nvar expensiveQuery = dbContext.Orders\n    .Where(o => ComplexCalculation(o));\n\nvar count = expensiveQuery.Count();          // Executes query\nvar first = expensiveQuery.FirstOrDefault(); // Executes query again\nvar list = expensiveQuery.ToList();          // Executes query again\n\n// Good: Materialize once\nvar results = dbContext.Orders\n    .Where(o => ComplexCalculation(o))\n    .ToList();  // Single execution\n\nvar count = results.Count;\nvar first = results.FirstOrDefault();",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-16"
  },
  {
    "question": "Compare the performance implications of Count() vs Any() for checking if a collection has items.",
    "answer": [
      {
        "type": "text",
        "content": "Any() stops at first match; Count() must enumerate everything."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Bad: Counts all items\nif (orders.Count() > 0)\n{\n    // ...\n}\n\n// Good: Stops at first item\nif (orders.Any())\n{\n    // ...\n}\n\n// For checking specific count\nif (orders.Count() >= 100)  // Bad: counts all\nif (orders.Skip(99).Any())  // Better: stops at 100th",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-17"
  },
  {
    "question": "Identify and fix performance issues in this query.",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// Bad: Multiple database round trips\nvar orders = dbContext.Orders.ToList();\nforeach (var order in orders)\n{\n    order.Customer = dbContext.Customers.Find(order.CustomerId);\n    order.Items = dbContext.OrderItems.Where(i => i.OrderId == order.Id).ToList();\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use eager loading with Include."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Good: Single query with joins\nvar orders = dbContext.Orders\n    .Include(o => o.Customer)\n    .Include(o => o.Items)\n    .ToList();",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-18"
  },
  {
    "question": "Write a LINQ query that uses AsParallel appropriately for CPU-bound operations.",
    "answer": [
      {
        "type": "text",
        "content": "Use PLINQ for computationally expensive operations."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// CPU-bound operation\nvar results = largeDataset\n    .AsParallel()\n    .WithDegreeOfParallelism(Environment.ProcessorCount)\n    .Where(item => ExpensiveComputation(item))\n    .Select(item => TransformItem(item))\n    .ToList();\n\n// Don't use for I/O-bound operations or small datasets",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-19"
  },
  {
    "question": "When should you use List<T> vs IEnumerable<T> as a return type?",
    "answer": [
      {
        "type": "text",
        "content": "Return IEnumerable<T> for flexibility; use List<T> when caller needs indexing/modification."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Good: Flexible, caller can decide materialization\npublic IEnumerable<Order> GetOrders()\n{\n    return dbContext.Orders.Where(o => o.IsActive);\n}\n\n// Use List<T> when:\n// 1. Multiple enumerations are expected\n// 2. Caller needs random access\n// 3. Caller needs to modify the collection\npublic List<Order> GetOrdersForProcessing()\n{\n    return dbContext.Orders.Where(o => o.Status == \"Pending\").ToList();\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-20"
  },
  {
    "question": "Implement a LookupTable using ToLookup and explain when to use it vs GroupBy.",
    "answer": [
      {
        "type": "text",
        "content": "ToLookup immediately executes and creates an immutable lookup structure."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// ToLookup - immediate execution, multiple lookups\nvar ordersByCustomer = orders.ToLookup(o => o.CustomerId);\nvar customer1Orders = ordersByCustomer[customerId1];  // O(1) lookup\nvar customer2Orders = ordersByCustomer[customerId2];  // Another O(1) lookup\n\n// GroupBy - deferred execution, single enumeration\nvar grouped = orders.GroupBy(o => o.CustomerId);\nforeach (var customerOrders in grouped)  // Single pass\n{\n    ProcessOrders(customerOrders);\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-21"
  },
  {
    "question": "Use Zip to combine two sequences and explain its behavior when sequences have different lengths.",
    "answer": [
      {
        "type": "text",
        "content": "Zip combines elements pairwise, stops at shortest sequence."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var numbers = new[] { 1, 2, 3, 4 };\nvar letters = new[] { \"A\", \"B\", \"C\" };\n\nvar zipped = numbers.Zip(letters, (n, l) => $\"{n}-{l}\");\n// Result: [\"1-A\", \"2-B\", \"3-C\"]  - 4 is ignored\n\n// C# 9+ Tuple syntax\nvar zipped2 = numbers.Zip(letters);\n// Result: [(1, \"A\"), (2, \"B\"), (3, \"C\")]",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-22"
  },
  {
    "question": "Implement a method that chunks a collection into batches of N items.",
    "answer": [
      {
        "type": "text",
        "content": "Use Chunk (C# 9+) or implement custom batching."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// C# 9+\nvar batches = items.Chunk(100);\n\n// Custom implementation\npublic static IEnumerable<IEnumerable<T>> Batch<T>(\n    this IEnumerable<T> source, int batchSize)\n{\n    var batch = new List<T>(batchSize);\n    foreach (var item in source)\n    {\n        batch.Add(item);\n        if (batch.Count == batchSize)\n        {\n            yield return batch;\n            batch = new List<T>(batchSize);\n        }\n    }\n\n    if (batch.Any())\n        yield return batch;\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-23"
  },
  {
    "question": "You need to merge data from multiple sources (database, API, cache) and remove duplicates. Implement this efficiently.",
    "answer": [
      {
        "type": "text",
        "content": "Combine sources and use DistinctBy or HashSet."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public async Task<List<Product>> GetMergedProducts()\n{\n    var dbProducts = await dbContext.Products.ToListAsync();\n    var apiProducts = await apiClient.GetProductsAsync();\n    var cachedProducts = cache.Get<List<Product>>(\"products\") ?? new List<Product>();\n\n    var allProducts = dbProducts\n        .Concat(apiProducts)\n        .Concat(cachedProducts)\n        .DistinctBy(p => p.Id)\n        .ToList();\n\n    return allProducts;\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-24"
  },
  {
    "question": "Implement a search feature with multiple optional filters (name, category, price range, tags).",
    "answer": [
      {
        "type": "text",
        "content": "Build query dynamically with conditional Where clauses."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public IEnumerable<Product> SearchProducts(\n    string name = null,\n    int? categoryId = null,\n    decimal? minPrice = null,\n    decimal? maxPrice = null,\n    string[] tags = null)\n{\n    IQueryable<Product> query = dbContext.Products;\n\n    if (!string.IsNullOrEmpty(name))\n        query = query.Where(p => p.Name.Contains(name));\n\n    if (categoryId.HasValue)\n        query = query.Where(p => p.CategoryId == categoryId.Value);\n\n    if (minPrice.HasValue)\n        query = query.Where(p => p.Price >= minPrice.Value);\n\n    if (maxPrice.HasValue)\n        query = query.Where(p => p.Price <= maxPrice.Value);\n\n    if (tags != null && tags.Any())\n        query = query.Where(p => p.Tags.Any(t => tags.Contains(t)));\n\n    return query.ToList();\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-25"
  },
  {
    "question": "Calculate month-over-month growth percentage for sales data.",
    "answer": [
      {
        "type": "text",
        "content": "Join current month with previous month data."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var monthlySales = sales\n    .GroupBy(s => new { s.Year, s.Month })\n    .Select(g => new {\n        g.Key.Year,\n        g.Key.Month,\n        Total = g.Sum(s => s.Amount)\n    })\n    .OrderBy(m => m.Year).ThenBy(m => m.Month)\n    .ToList();\n\nvar growth = monthlySales\n    .Zip(monthlySales.Skip(1), (prev, curr) => new {\n        curr.Year,\n        curr.Month,\n        CurrentTotal = curr.Total,\n        PreviousTotal = prev.Total,\n        GrowthPercent = ((curr.Total - prev.Total) / prev.Total) * 100\n    });",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-26"
  },
  {
    "question": "Implement an expression builder that allows dynamic LINQ query construction from user input.",
    "answer": [
      {
        "type": "text",
        "content": "Use Expression trees to build dynamic queries."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public static class DynamicQueryBuilder\n{\n    public static IQueryable<T> ApplyFilter<T>(\n        IQueryable<T> query,\n        string propertyName,\n        string operation,\n        object value)\n    {\n        var parameter = Expression.Parameter(typeof(T), \"x\");\n        var property = Expression.Property(parameter, propertyName);\n        var constant = Expression.Constant(value);\n\n        Expression comparison = operation switch\n        {\n            \"=\" => Expression.Equal(property, constant),\n            \">\" => Expression.GreaterThan(property, constant),\n            \"<\" => Expression.LessThan(property, constant),\n            \"contains\" => Expression.Call(property, \"Contains\", null, constant),\n            _ => throw new ArgumentException(\"Invalid operation\")\n        };\n\n        var lambda = Expression.Lambda<Func<T, bool>>(comparison, parameter);\n        return query.Where(lambda);\n    }\n}\n\n// Usage\nvar query = dbContext.Products.AsQueryable();\nquery = DynamicQueryBuilder.ApplyFilter(query, \"Price\", \">\", 100m);\nquery = DynamicQueryBuilder.ApplyFilter(query, \"Name\", \"contains\", \"Widget\");",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-27"
  },
  {
    "question": "Implement a method that finds all possible combinations of products that sum to a target price (subset sum problem).",
    "answer": [
      {
        "type": "text",
        "content": "Recursive LINQ approach or dynamic programming."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public static IEnumerable<List<Product>> FindCombinations(\n    List<Product> products,\n    decimal targetPrice,\n    decimal tolerance = 0.01m)\n{\n    for (int i = 0; i < products.Count; i++)\n    {\n        var product = products[i];\n\n        if (Math.Abs(product.Price - targetPrice) <= tolerance)\n        {\n            yield return new List<Product> { product };\n        }\n\n        if (product.Price < targetPrice)\n        {\n            var remaining = products.Skip(i + 1).ToList();\n            var subCombos = FindCombinations(\n                remaining,\n                targetPrice - product.Price,\n                tolerance);\n\n            foreach (var combo in subCombos)\n            {\n                yield return new List<Product> { product }.Concat(combo).ToList();\n            }\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-28"
  },
  {
    "question": "Use GroupJoin to build a customer summary with order counts and last order date.",
    "answer": [
      {
        "type": "text",
        "content": "GroupJoin collects orders per customer without losing customers who have no orders."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var summaries = customers\n    .GroupJoin(\n        orders,\n        c => c.Id,\n        o => o.CustomerId,\n        (c, customerOrders) => new {\n            c.Id,\n            c.Name,\n            OrderCount = customerOrders.Count(),\n            LastOrderDate = customerOrders\n                .OrderByDescending(o => o.OrderDate)\n                .Select(o => (DateTime?)o.OrderDate)\n                .FirstOrDefault()\n        });",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-29"
  },
  {
    "question": "Implement Distinct with a custom comparer for case-insensitive strings.",
    "answer": [
      {
        "type": "text",
        "content": "Provide an IEqualityComparer<T> to normalize comparisons."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var uniqueSymbols = symbols.Distinct(StringComparer.OrdinalIgnoreCase).ToList();",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-30"
  },
  {
    "question": "Convert a list to a dictionary safely when keys can repeat.",
    "answer": [
      {
        "type": "text",
        "content": "Group by the key first, then choose a resolution strategy."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var map = products\n    .GroupBy(p => p.Sku)\n    .ToDictionary(g => g.Key, g => g.OrderByDescending(p => p.UpdatedAt).First());",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-31"
  },
  {
    "question": "Use Select with index to assign ranks within a sorted sequence.",
    "answer": [
      {
        "type": "text",
        "content": "Sort once, then project with the index."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var ranked = trades\n    .OrderByDescending(t => t.Notional)\n    .Select((trade, index) => new { trade.Id, Rank = index + 1 });",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-32"
  },
  {
    "question": "Split a sequence into a prefix and the remaining items using TakeWhile and SkipWhile.",
    "answer": [
      {
        "type": "text",
        "content": "Use a predicate to find the boundary."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var prefix = prices.TakeWhile(p => p.IsValid).ToList();\nvar rest = prices.SkipWhile(p => p.IsValid).ToList();",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Total Exercises: 40+"
      },
      {
        "type": "text",
        "content": "Practice these exercises by actually writing the code. Don't just read—implement and test!"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Collections-And-Enumerables/index.md",
    "id": "card-33"
  },
  {
    "question": "Explain the difference between defensive programming and fail-fast. When should each be used?",
    "answer": [
      {
        "type": "text",
        "content": "Defensive programming anticipates and handles invalid input gracefully to keep the system running. Use it at system boundaries (APIs, external integrations, user input)."
      },
      {
        "type": "text",
        "content": "Fail-fast detects invalid states early and throws exceptions immediately. Use it in core business logic to enforce invariants and surface bugs early."
      },
      {
        "type": "text",
        "content": "Key principle: Defensive at the edges, fail-fast at the core."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Defensive: API boundary\n[HttpPost]\npublic IActionResult CreateOrder([FromBody] OrderRequest request)\n{\n    if (request == null || request.Quantity <= 0)\n        return BadRequest(\"Invalid request\");\n\n    // Call domain logic...\n}\n\n// Fail-Fast: Domain entity\npublic class Order\n{\n    public Order(decimal quantity)\n    {\n        if (quantity <= 0)\n            throw new ArgumentException(\"Quantity must be positive\");\n        Quantity = quantity;\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Defensive Programming Vs Fail Fast Exercises",
    "topicId": "defensive-programming-vs-fail-fast-exercises",
    "source": "practice/defensive-programming-vs-fail-fast-exercises.md",
    "id": "card-34"
  },
  {
    "question": "What are the risks of being overly defensive in core business logic?",
    "answer": [
      {
        "type": "text",
        "content": "Overly defensive code in the core can:"
      },
      {
        "type": "list",
        "items": [
          "Hide bugs by silently ignoring invalid states",
          "Make debugging difficult due to silent failures",
          "Allow invalid data to propagate through the system",
          "Create false sense of security",
          "Violate fail-fast principle that catches errors early"
        ]
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// ❌ Bad: Too defensive in domain logic\npublic class PriceCalculator\n{\n    public decimal Calculate(decimal price, decimal quantity)\n    {\n        // Silently returning 0 hides programming errors\n        if (price <= 0 || quantity <= 0)\n            return 0;\n\n        return price * quantity;\n    }\n}\n\n// ✅ Good: Fail-fast exposes the bug\npublic class PriceCalculator\n{\n    public decimal Calculate(decimal price, decimal quantity)\n    {\n        if (price <= 0)\n            throw new ArgumentException(\"Price must be positive\");\n        if (quantity <= 0)\n            throw new ArgumentException(\"Quantity must be positive\");\n\n        return price * quantity;\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Defensive Programming Vs Fail Fast Exercises",
    "topicId": "defensive-programming-vs-fail-fast-exercises",
    "source": "practice/defensive-programming-vs-fail-fast-exercises.md",
    "id": "card-35"
  },
  {
    "question": "How do you handle exceptions from fail-fast code at the API layer?",
    "answer": [
      {
        "type": "text",
        "content": "Catch domain exceptions at the API layer and translate them into appropriate HTTP responses."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "[HttpPost(\"orders\")]\npublic async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)\n{\n    try\n    {\n        // Domain code may throw (fail-fast)\n        var order = new Order(request.Symbol, request.Quantity, request.Price);\n        await _orderService.CreateAsync(order);\n        return Ok(order);\n    }\n    catch (ArgumentException ex)\n    {\n        // Translate to user-friendly error\n        return BadRequest(new { error = ex.Message });\n    }\n    catch (RiskLimitExceededException ex)\n    {\n        return BadRequest(new { error = ex.Message, code = \"RISK_LIMIT_EXCEEDED\" });\n    }\n    catch (Exception ex)\n    {\n        _logger.LogError(ex, \"Unexpected error creating order\");\n        return StatusCode(500, \"An unexpected error occurred\");\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Defensive Programming Vs Fail Fast Exercises",
    "topicId": "defensive-programming-vs-fail-fast-exercises",
    "source": "practice/defensive-programming-vs-fail-fast-exercises.md",
    "id": "card-36"
  },
  {
    "question": "Implement a defensive wrapper around an unreliable external price feed API.",
    "answer": [
      {
        "type": "text",
        "content": "Create a defensive adapter that handles failures gracefully with fallback mechanisms."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class ResilientPriceFeedAdapter\n{\n    private readonly IPriceFeedClient _primaryFeed;\n    private readonly IPriceFeedClient _fallbackFeed;\n    private readonly IMemoryCache _cache;\n    private readonly ILogger _logger;\n\n    public async Task<decimal?> GetPriceAsync(string symbol)\n    {\n        // Defensive: validate input\n        if (string.IsNullOrWhiteSpace(symbol))\n        {\n            _logger.LogWarning(\"Empty symbol provided\");\n            return null;\n        }\n\n        // Try cache first\n        if (_cache.TryGetValue($\"price:{symbol}\", out decimal cachedPrice))\n        {\n            return cachedPrice;\n        }\n\n        // Try primary feed\n        try\n        {\n            var price = await _primaryFeed.GetPriceAsync(symbol);\n\n            // Defensive: validate response\n            if (price.HasValue && price.Value > 0)\n            {\n                _cache.Set($\"price:{symbol}\", price.Value, TimeSpan.FromSeconds(30));\n                return price;\n            }\n\n            _logger.LogWarning(\"Invalid price from primary feed: {Price}\", price);\n        }\n        catch (HttpRequestException ex)\n        {\n            _logger.LogWarning(ex, \"Primary feed failed for {Symbol}\", symbol);\n        }\n        catch (TimeoutException ex)\n        {\n            _logger.LogWarning(ex, \"Primary feed timeout for {Symbol}\", symbol);\n        }\n\n        // Try fallback feed\n        try\n        {\n            var price = await _fallbackFeed.GetPriceAsync(symbol);\n\n            if (price.HasValue && price.Value > 0)\n            {\n                _cache.Set($\"price:{symbol}\", price.Value, TimeSpan.FromSeconds(30));\n                return price;\n            }\n        }\n        catch (Exception ex)\n        {\n            _logger.LogError(ex, \"Fallback feed failed for {Symbol}\", symbol);\n        }\n\n        // All sources failed - return null to indicate unavailability\n        return null;\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Defensive Programming Vs Fail Fast Exercises",
    "topicId": "defensive-programming-vs-fail-fast-exercises",
    "source": "practice/defensive-programming-vs-fail-fast-exercises.md",
    "id": "card-37"
  },
  {
    "question": "Create a fail-fast domain entity for a trading Order with strict invariant enforcement.",
    "answer": [
      {
        "type": "text",
        "content": "Implement an Order aggregate root that fails fast on any invariant violation."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class Order\n{\n    public Guid Id { get; private set; }\n    public string Symbol { get; private set; }\n    public decimal Quantity { get; private set; }\n    public decimal Price { get; private set; }\n    public OrderSide Side { get; private set; }\n    public OrderStatus Status { get; private set; }\n    public DateTime CreatedAt { get; private set; }\n    public DateTime? ExecutedAt { get; private set; }\n\n    public Order(string symbol, decimal quantity, decimal price, OrderSide side)\n    {\n        // Fail-fast: enforce construction invariants\n        if (string.IsNullOrWhiteSpace(symbol))\n            throw new ArgumentException(\"Symbol is required\", nameof(symbol));\n\n        if (symbol.Length > 20)\n            throw new ArgumentException(\"Symbol too long (max 20 characters)\", nameof(symbol));\n\n        if (quantity <= 0)\n            throw new ArgumentException(\"Quantity must be positive\", nameof(quantity));\n\n        if (quantity > 1_000_000)\n            throw new ArgumentException(\"Quantity exceeds maximum allowed\", nameof(quantity));\n\n        if (price < 0)\n            throw new ArgumentException(\"Price cannot be negative\", nameof(price));\n\n        if (price > 1_000_000)\n            throw new ArgumentException(\"Price exceeds maximum allowed\", nameof(price));\n\n        Id = Guid.NewGuid();\n        Symbol = symbol.ToUpperInvariant();\n        Quantity = quantity;\n        Price = price;\n        Side = side;\n        Status = OrderStatus.Pending;\n        CreatedAt = DateTime.UtcNow;\n    }\n\n    public void Execute(decimal executedPrice, DateTime executedAt)\n    {\n        // Fail-fast: enforce state transitions\n        if (Status != OrderStatus.Pending)\n            throw new InvalidOperationException(\n                $\"Cannot execute order in {Status} status. Only Pending orders can be executed.\");\n\n        if (executedPrice <= 0)\n            throw new ArgumentException(\"Executed price must be positive\", nameof(executedPrice));\n\n        if (executedAt < CreatedAt)\n            throw new ArgumentException(\"Execution time cannot be before creation time\", nameof(executedAt));\n\n        if (executedAt > DateTime.UtcNow.AddMinutes(1))\n            throw new ArgumentException(\"Execution time cannot be in the future\", nameof(executedAt));\n\n        Price = executedPrice;\n        ExecutedAt = executedAt;\n        Status = OrderStatus.Executed;\n    }\n\n    public void Cancel(string reason)\n    {\n        if (string.IsNullOrWhiteSpace(reason))\n            throw new ArgumentException(\"Cancellation reason is required\", nameof(reason));\n\n        if (Status == OrderStatus.Executed)\n            throw new InvalidOperationException(\"Cannot cancel executed order\");\n\n        if (Status == OrderStatus.Cancelled)\n            throw new InvalidOperationException(\"Order is already cancelled\");\n\n        Status = OrderStatus.Cancelled;\n    }\n}\n\npublic enum OrderStatus { Pending, Executed, Cancelled }\npublic enum OrderSide { Buy, Sell }",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Defensive Programming Vs Fail Fast Exercises",
    "topicId": "defensive-programming-vs-fail-fast-exercises",
    "source": "practice/defensive-programming-vs-fail-fast-exercises.md",
    "id": "card-38"
  },
  {
    "question": "Design a multi-layer validation strategy combining defensive and fail-fast approaches.",
    "answer": [
      {
        "type": "text",
        "content": "Implement validation at multiple layers with appropriate strategy for each."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Layer 1: API Controller - Defensive\n[ApiController]\n[Route(\"api/[controller]\")]\npublic class OrdersController : ControllerBase\n{\n    private readonly IOrderService _orderService;\n    private readonly IValidator<CreateOrderRequest> _validator;\n\n    [HttpPost]\n    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)\n    {\n        // Defensive: validate DTO\n        if (request == null)\n            return BadRequest(\"Request body is required\");\n\n        var validationResult = await _validator.ValidateAsync(request);\n        if (!validationResult.IsValid)\n            return BadRequest(validationResult.Errors);\n\n        try\n        {\n            var order = await _orderService.CreateOrderAsync(request);\n            return Ok(order);\n        }\n        catch (RiskLimitExceededException ex)\n        {\n            return BadRequest(new { error = ex.Message, code = \"RISK_LIMIT\" });\n        }\n        catch (InsufficientFundsException ex)\n        {\n            return BadRequest(new { error = ex.Message, code = \"INSUFFICIENT_FUNDS\" });\n        }\n        catch (ArgumentException ex)\n        {\n            return BadRequest(new { error = ex.Message });\n        }\n        catch (Exception ex)\n        {\n            _logger.LogError(ex, \"Unexpected error creating order\");\n            return StatusCode(500, \"An unexpected error occurred\");\n        }\n    }\n}\n\n// Layer 2: FluentValidation - Defensive\npublic class CreateOrderRequestValidator : AbstractValidator<CreateOrderRequest>\n{\n    public CreateOrderRequestValidator()\n    {\n        RuleFor(x => x.Symbol)\n            .NotEmpty().WithMessage(\"Symbol is required\")\n            .MaximumLength(20).WithMessage(\"Symbol too long\");\n\n        RuleFor(x => x.Quantity)\n            .GreaterThan(0).WithMessage(\"Quantity must be positive\")\n            .LessThanOrEqualTo(1_000_000).WithMessage(\"Quantity too large\");\n\n        RuleFor(x => x.Price)\n            .GreaterThanOrEqualTo(0).WithMessage(\"Price cannot be negative\")\n            .LessThanOrEqualTo(1_000_000).WithMessage(\"Price too large\");\n\n        RuleFor(x => x.AccountId)\n            .NotEmpty().WithMessage(\"Account ID is required\");\n    }\n}\n\n// Layer 3: Application Service - Mixed\npublic class OrderService : IOrderService\n{\n    public async Task<OrderDto> CreateOrderAsync(CreateOrderRequest request)\n    {\n        // Defensive: check account exists\n        var account = await _accountRepository.GetByIdAsync(request.AccountId);\n        if (account == null)\n            throw new NotFoundException($\"Account {request.AccountId} not found\");\n\n        // Fail-fast: create domain entity (enforces invariants)\n        var order = new Order(\n            request.Symbol,\n            request.Quantity,\n            request.Price,\n            request.Side\n        );\n\n        // Fail-fast: business rules\n        _riskValidator.ValidateOrder(order, account); // Throws on violation\n        _marginValidator.ValidateMargin(order, account); // Throws on violation\n\n        // Defensive: external system integration\n        var reservationResult = await TryReserveFundsAsync(account, order);\n        if (!reservationResult.Success)\n        {\n            throw new InsufficientFundsException(\n                $\"Failed to reserve funds: {reservationResult.Reason}\");\n        }\n\n        await _orderRepository.AddAsync(order);\n        await _unitOfWork.CommitAsync();\n\n        return _mapper.Map<OrderDto>(order);\n    }\n\n    private async Task<ReservationResult> TryReserveFundsAsync(Account account, Order order)\n    {\n        try\n        {\n            return await _fundingService.ReserveFundsAsync(account.Id, order.TotalValue);\n        }\n        catch (Exception ex)\n        {\n            _logger.LogError(ex, \"Failed to reserve funds for order\");\n            return ReservationResult.Failure(\"Service unavailable\");\n        }\n    }\n}\n\n// Layer 4: Domain Entity - Fail-Fast (shown above)",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Defensive Programming Vs Fail Fast Exercises",
    "topicId": "defensive-programming-vs-fail-fast-exercises",
    "source": "practice/defensive-programming-vs-fail-fast-exercises.md",
    "id": "card-39"
  },
  {
    "question": "Implement a circuit breaker pattern that uses defensive programming for external services but fail-fast for internal state.",
    "answer": [
      {
        "type": "text",
        "content": "Create a circuit breaker that protects against external failures defensively while enforcing internal state transitions with fail-fast."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class CircuitBreaker\n{\n    private CircuitState _state = CircuitState.Closed;\n    private int _failureCount;\n    private DateTime _lastFailureTime;\n    private readonly int _failureThreshold;\n    private readonly TimeSpan _openDuration;\n    private readonly SemaphoreSlim _lock = new(1, 1);\n\n    public CircuitBreaker(int failureThreshold, TimeSpan openDuration)\n    {\n        // Fail-fast: validate constructor parameters\n        if (failureThreshold <= 0)\n            throw new ArgumentException(\"Failure threshold must be positive\", nameof(failureThreshold));\n\n        if (openDuration <= TimeSpan.Zero)\n            throw new ArgumentException(\"Open duration must be positive\", nameof(openDuration));\n\n        _failureThreshold = failureThreshold;\n        _openDuration = openDuration;\n    }\n\n    public async Task<T> ExecuteAsync<T>(Func<Task<T>> operation)\n    {\n        // Fail-fast: null check\n        if (operation == null)\n            throw new ArgumentNullException(nameof(operation));\n\n        await _lock.WaitAsync();\n        try\n        {\n            // Check if we should transition from Open to HalfOpen\n            if (_state == CircuitState.Open &&\n                DateTime.UtcNow - _lastFailureTime >= _openDuration)\n            {\n                _state = CircuitState.HalfOpen;\n            }\n\n            // Fail-fast: enforce circuit state\n            if (_state == CircuitState.Open)\n            {\n                throw new CircuitBreakerOpenException(\n                    $\"Circuit breaker is open. Will retry after {_openDuration}\");\n            }\n        }\n        finally\n        {\n            _lock.Release();\n        }\n\n        // Defensive: try operation and handle failures gracefully\n        try\n        {\n            var result = await operation();\n\n            // Success - reset if in HalfOpen\n            if (_state == CircuitState.HalfOpen)\n            {\n                await ResetAsync();\n            }\n\n            return result;\n        }\n        catch (Exception ex) when (!(ex is CircuitBreakerOpenException))\n        {\n            // Defensive: record failure and decide state transition\n            await RecordFailureAsync(ex);\n            throw; // Re-throw original exception\n        }\n    }\n\n    private async Task RecordFailureAsync(Exception ex)\n    {\n        await _lock.WaitAsync();\n        try\n        {\n            _failureCount++;\n            _lastFailureTime = DateTime.UtcNow;\n\n            if (_state == CircuitState.HalfOpen)\n            {\n                // Fail immediately on failure in HalfOpen state\n                _state = CircuitState.Open;\n            }\n            else if (_failureCount >= _failureThreshold)\n            {\n                _state = CircuitState.Open;\n            }\n        }\n        finally\n        {\n            _lock.Release();\n        }\n    }\n\n    private async Task ResetAsync()\n    {\n        await _lock.WaitAsync();\n        try\n        {\n            _failureCount = 0;\n            _state = CircuitState.Closed;\n        }\n        finally\n        {\n            _lock.Release();\n        }\n    }\n}\n\npublic enum CircuitState { Closed, Open, HalfOpen }",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Defensive Programming Vs Fail Fast Exercises",
    "topicId": "defensive-programming-vs-fail-fast-exercises",
    "source": "practice/defensive-programming-vs-fail-fast-exercises.md",
    "id": "card-40"
  },
  {
    "question": "Design a price validation system that combines defensive parsing with fail-fast business rule enforcement.",
    "answer": [
      {
        "type": "text",
        "content": "Implement defensive parsing for external data and fail-fast validation for business rules."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class PriceValidationService\n{\n    public ValidatedPrice ValidateAndParsePrice(string symbol, string priceData)\n    {\n        // Fail-fast: validate inputs\n        if (string.IsNullOrWhiteSpace(symbol))\n            throw new ArgumentException(\"Symbol is required\", nameof(symbol));\n\n        // Defensive: parse external data\n        if (string.IsNullOrWhiteSpace(priceData))\n        {\n            _logger.LogWarning(\"Empty price data for {Symbol}\", symbol);\n            return ValidatedPrice.Invalid(\"Price data is empty\");\n        }\n\n        if (!decimal.TryParse(priceData, NumberStyles.Any, CultureInfo.InvariantCulture, out var price))\n        {\n            _logger.LogWarning(\"Invalid price format for {Symbol}: {PriceData}\", symbol, priceData);\n            return ValidatedPrice.Invalid($\"Invalid price format: {priceData}\");\n        }\n\n        // Fail-fast: enforce business rules\n        if (price < 0)\n            throw new InvalidPriceException($\"Price cannot be negative: {price}\");\n\n        if (price == 0)\n            throw new InvalidPriceException(\"Price cannot be zero\");\n\n        if (price > 1_000_000)\n            throw new InvalidPriceException($\"Price exceeds maximum allowed: {price}\");\n\n        // Defensive: check for suspicious prices (but don't fail)\n        var previousPrice = _priceHistory.GetLastPrice(symbol);\n        if (previousPrice.HasValue)\n        {\n            var change = Math.Abs((price - previousPrice.Value) / previousPrice.Value);\n            if (change > 0.5m) // 50% change\n            {\n                _logger.LogWarning(\n                    \"Suspicious price change for {Symbol}: {PreviousPrice} -> {NewPrice} ({ChangePercent:P})\",\n                    symbol, previousPrice, price, change);\n\n                // Flag for review but allow it\n                return ValidatedPrice.Valid(price, isSuspicious: true);\n            }\n        }\n\n        return ValidatedPrice.Valid(price, isSuspicious: false);\n    }\n}\n\npublic class ValidatedPrice\n{\n    public bool IsValid { get; }\n    public decimal? Value { get; }\n    public string ErrorMessage { get; }\n    public bool IsSuspicious { get; }\n\n    private ValidatedPrice(bool isValid, decimal? value, string errorMessage, bool isSuspicious)\n    {\n        IsValid = isValid;\n        Value = value;\n        ErrorMessage = errorMessage;\n        IsSuspicious = isSuspicious;\n    }\n\n    public static ValidatedPrice Valid(decimal value, bool isSuspicious) =>\n        new(true, value, null, isSuspicious);\n\n    public static ValidatedPrice Invalid(string errorMessage) =>\n        new(false, null, errorMessage, false);\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Defensive Programming Vs Fail Fast Exercises",
    "topicId": "defensive-programming-vs-fail-fast-exercises",
    "source": "practice/defensive-programming-vs-fail-fast-exercises.md",
    "id": "card-41"
  },
  {
    "question": "Implement defensive retry logic with fail-fast on non-retryable errors.",
    "answer": [
      {
        "type": "text",
        "content": "Create a retry mechanism that defensively handles transient failures but fails fast on permanent errors."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class ResilientHttpClient\n{\n    private readonly HttpClient _httpClient;\n    private readonly ILogger _logger;\n\n    public async Task<T> GetWithRetryAsync<T>(\n        string url,\n        int maxRetries = 3,\n        CancellationToken cancellationToken = default)\n    {\n        // Fail-fast: validate parameters\n        if (string.IsNullOrWhiteSpace(url))\n            throw new ArgumentException(\"URL is required\", nameof(url));\n\n        if (maxRetries < 0)\n            throw new ArgumentException(\"Max retries cannot be negative\", nameof(maxRetries));\n\n        Exception lastException = null;\n\n        for (int attempt = 0; attempt <= maxRetries; attempt++)\n        {\n            try\n            {\n                var response = await _httpClient.GetAsync(url, cancellationToken);\n\n                // Fail-fast: 4xx errors are not retryable (client errors)\n                if ((int)response.StatusCode >= 400 && (int)response.StatusCode < 500)\n                {\n                    var content = await response.Content.ReadAsStringAsync();\n                    throw new HttpRequestException(\n                        $\"Client error {response.StatusCode}: {content}. This is not retryable.\");\n                }\n\n                // Defensive: 5xx errors are retryable (server errors)\n                if (!response.IsSuccessStatusCode)\n                {\n                    _logger.LogWarning(\n                        \"Request failed with {StatusCode} on attempt {Attempt}/{MaxRetries}\",\n                        response.StatusCode, attempt + 1, maxRetries + 1);\n\n                    if (attempt < maxRetries)\n                    {\n                        await DelayWithJitterAsync(attempt);\n                        continue;\n                    }\n\n                    throw new HttpRequestException($\"Request failed after {maxRetries + 1} attempts\");\n                }\n\n                return await response.Content.ReadFromJsonAsync<T>(cancellationToken);\n            }\n            catch (HttpRequestException) when ((int?)null >= 400 && (int?)null < 500)\n            {\n                // Re-throw client errors immediately (fail-fast)\n                throw;\n            }\n            catch (OperationCanceledException)\n            {\n                // Re-throw cancellation immediately (fail-fast)\n                throw;\n            }\n            catch (Exception ex)\n            {\n                // Defensive: log and retry on transient errors\n                lastException = ex;\n                _logger.LogWarning(\n                    ex,\n                    \"Transient error on attempt {Attempt}/{MaxRetries}\",\n                    attempt + 1, maxRetries + 1);\n\n                if (attempt < maxRetries)\n                {\n                    await DelayWithJitterAsync(attempt);\n                }\n            }\n        }\n\n        throw new HttpRequestException(\n            $\"Request failed after {maxRetries + 1} attempts\", lastException);\n    }\n\n    private async Task DelayWithJitterAsync(int attempt)\n    {\n        var baseDelay = TimeSpan.FromMilliseconds(100 * Math.Pow(2, attempt));\n        var jitter = TimeSpan.FromMilliseconds(Random.Shared.Next(0, 100));\n        await Task.Delay(baseDelay + jitter);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Defensive Programming Vs Fail Fast Exercises",
    "topicId": "defensive-programming-vs-fail-fast-exercises",
    "source": "practice/defensive-programming-vs-fail-fast-exercises.md",
    "id": "card-42"
  },
  {
    "question": "Implement order validation with defensive checks for external data and fail-fast for business rules.",
    "answer": [
      {
        "type": "text",
        "content": "Create a comprehensive order validator for a trading system."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderValidator\n{\n    private readonly IAccountRepository _accountRepository;\n    private readonly IMarketDataService _marketDataService;\n    private readonly IRiskLimitService _riskLimitService;\n    private readonly ILogger _logger;\n\n    public async Task<ValidationResult> ValidateOrderAsync(CreateOrderRequest request)\n    {\n        // Fail-fast: null check\n        if (request == null)\n            throw new ArgumentNullException(nameof(request));\n\n        var errors = new List<string>();\n\n        // Defensive: validate symbol format\n        if (string.IsNullOrWhiteSpace(request.Symbol))\n        {\n            errors.Add(\"Symbol is required\");\n        }\n        else if (request.Symbol.Length > 20)\n        {\n            errors.Add(\"Symbol too long (max 20 characters)\");\n        }\n\n        // Defensive: validate quantity\n        if (request.Quantity <= 0)\n        {\n            errors.Add(\"Quantity must be positive\");\n        }\n        else if (request.Quantity > 10_000_000)\n        {\n            errors.Add(\"Quantity exceeds maximum allowed\");\n        }\n\n        // Defensive: validate price\n        if (request.Price < 0)\n        {\n            errors.Add(\"Price cannot be negative\");\n        }\n        else if (request.Price > 1_000_000)\n        {\n            errors.Add(\"Price exceeds maximum allowed\");\n        }\n\n        // Return early if basic validation failed\n        if (errors.Any())\n        {\n            return ValidationResult.Failure(errors);\n        }\n\n        // Defensive: check account exists\n        var account = await _accountRepository.GetByIdAsync(request.AccountId);\n        if (account == null)\n        {\n            errors.Add($\"Account {request.AccountId} not found\");\n            return ValidationResult.Failure(errors);\n        }\n\n        // Fail-fast: account must be active\n        if (!account.IsActive)\n        {\n            throw new InvalidOperationException($\"Account {request.AccountId} is not active\");\n        }\n\n        // Defensive: check if symbol is tradeable\n        var marketData = await _marketDataService.GetMarketDataAsync(request.Symbol);\n        if (marketData == null)\n        {\n            _logger.LogWarning(\"Market data not available for {Symbol}\", request.Symbol);\n            errors.Add($\"Market data not available for {request.Symbol}\");\n        }\n        else if (!marketData.IsTradeable)\n        {\n            errors.Add($\"{request.Symbol} is not currently tradeable\");\n        }\n        else\n        {\n            // Defensive: check price deviation\n            var deviation = Math.Abs(request.Price - marketData.LastPrice) / marketData.LastPrice;\n            if (deviation > 0.1m) // 10% deviation\n            {\n                _logger.LogWarning(\n                    \"Large price deviation for {Symbol}: requested {RequestPrice}, market {MarketPrice}\",\n                    request.Symbol, request.Price, marketData.LastPrice);\n                errors.Add($\"Price deviates significantly from market price ({deviation:P})\");\n            }\n        }\n\n        // Fail-fast: check risk limits (business rules)\n        try\n        {\n            var orderValue = request.Quantity * request.Price;\n            _riskLimitService.ValidateOrderValue(account, orderValue);\n            _riskLimitService.ValidatePositionLimit(account, request.Symbol, request.Quantity);\n            _riskLimitService.ValidateMarginRequirement(account, orderValue);\n        }\n        catch (RiskLimitException ex)\n        {\n            // Convert business rule violations to validation errors\n            errors.Add(ex.Message);\n        }\n\n        return errors.Any()\n            ? ValidationResult.Failure(errors)\n            : ValidationResult.Success();\n    }\n}\n\npublic class ValidationResult\n{\n    public bool IsValid { get; }\n    public IReadOnlyList<string> Errors { get; }\n\n    private ValidationResult(bool isValid, IReadOnlyList<string> errors)\n    {\n        IsValid = isValid;\n        Errors = errors ?? new List<string>();\n    }\n\n    public static ValidationResult Success() =>\n        new(true, Array.Empty<string>());\n\n    public static ValidationResult Failure(List<string> errors) =>\n        new(false, errors);\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Total Exercises: 15+ comprehensive scenarios"
      },
      {
        "type": "text",
        "content": "Practice implementing the right balance between defensive programming and fail-fast for different layers of your application!"
      }
    ],
    "category": "practice",
    "topic": "Defensive Programming Vs Fail Fast Exercises",
    "topicId": "defensive-programming-vs-fail-fast-exercises",
    "source": "practice/defensive-programming-vs-fail-fast-exercises.md",
    "id": "card-43"
  },
  {
    "question": "Practice Exercises - Index",
    "answer": [
      {
        "type": "text",
        "content": "A structured map of practice materials that mirrors the notes folder layout. Numbered sections move from foundations to advanced drills."
      },
      {
        "type": "text",
        "content": "1. Start Here"
      },
      {
        "type": "list",
        "items": [
          "Core Concepts Hub",
          "SOLID Principles",
          "Collections and LINQ",
          "Error Handling Exercises",
          "Logging Exercises",
          "Testing Strategies Exercises"
        ]
      },
      {
        "type": "text",
        "content": "2. Architecture and Design"
      },
      {
        "type": "list",
        "items": [
          "Clean Architecture",
          "Solution Architecture Exercises",
          "System Architecture Exercises",
          "Design Patterns",
          "DRY Exercises"
        ]
      },
      {
        "type": "text",
        "content": "3. Libraries and Tooling"
      },
      {
        "type": "list",
        "items": [
          "AutoMapper",
          "FluentValidation"
        ]
      },
      {
        "type": "text",
        "content": "4. Tech Stacks"
      },
      {
        "type": "list",
        "items": [
          "Tech Stacks"
        ]
      },
      {
        "type": "text",
        "content": "5. Performance"
      },
      {
        "type": "list",
        "items": [
          "Memory Allocation Discipline",
          "Big-O Complexity"
        ]
      },
      {
        "type": "text",
        "content": "6. Use Cases"
      },
      {
        "type": "list",
        "items": [
          "Massive Traffic Scenarios"
        ]
      },
      {
        "type": "text",
        "content": "7. Deep Dives (Advanced Sub-Notes)"
      },
      {
        "type": "list",
        "items": [
          "Async/Await Exercises",
          "API Lifecycle",
          "System Design",
          "Data Layer",
          "Messaging and Integration",
          "SSE vs WebSockets",
          "Trading Domain"
        ]
      },
      {
        "type": "text",
        "content": "8. All-in-One Lists"
      },
      {
        "type": "list",
        "items": [
          "Practice Questions and Prompts",
          "Practice Answers"
        ]
      }
    ],
    "category": "practice",
    "topic": "Practice Index",
    "topicId": "practice-index",
    "source": "practice/index.md",
    "isIndex": true,
    "id": "card-44"
  },
  {
    "question": "When should you use ArrayPool<T>?",
    "answer": [
      {
        "type": "text",
        "content": "Use it for large or frequent temporary buffers to reduce GC pressure. Always return buffers in a finally block."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var pool = ArrayPool<byte>.Shared;\nbyte[] buffer = pool.Rent(4096);\ntry\n{\n    // Use buffer\n}\nfinally\n{\n    pool.Return(buffer);\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Memory-Allocation-Discipline/index.md",
    "id": "card-45"
  },
  {
    "question": "Show how Span<T> can avoid allocations when parsing.",
    "answer": [
      {
        "type": "text",
        "content": "Slice strings with spans to reduce intermediate allocations."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "ReadOnlySpan<char> line = input.AsSpan();\nvar first = line.Slice(0, 3);",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Memory-Allocation-Discipline/index.md",
    "id": "card-46"
  },
  {
    "question": "When would you use ValueTask instead of Task?",
    "answer": [
      {
        "type": "text",
        "content": "Use ValueTask for hot paths that often complete synchronously to avoid allocations."
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Memory-Allocation-Discipline/index.md",
    "id": "card-47"
  },
  {
    "question": "Why is string concatenation in a loop expensive, and how do you fix it?",
    "answer": [
      {
        "type": "text",
        "content": "Strings are immutable, so concatenation allocates new strings. Use StringBuilder."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var sb = new StringBuilder();\nforeach (var part in parts)\n{\n    sb.Append(part);\n}\nvar result = sb.ToString();",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Memory-Allocation-Discipline/index.md",
    "id": "card-48"
  },
  {
    "question": "How do closures create hidden allocations?",
    "answer": [
      {
        "type": "text",
        "content": "Lambdas capture outer variables into heap-allocated objects. Avoid captures in hot paths or use static lambdas."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Avoid capture\nvar count = items.Count(static i => i.IsActive);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Key points:"
      },
      {
        "type": "list",
        "items": [
          "Objects >= 85KB go to LOH",
          "LOH is part of Gen 2",
          "LOH doesn't get compacted by default (can cause fragmentation)",
          "Use ArrayPool or compact LOH manually </details>"
        ]
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Memory-Allocation-Discipline/index.md",
    "id": "card-49"
  },
  {
    "question": "Given a list of trades with timestamps, return the latest trade per account using LINQ.",
    "answer": [
      {
        "type": "text",
        "content": "Sort or group by account and pick the trade with the max timestamp using GroupBy + OrderByDescending/MaxBy. This keeps the logic declarative and pushes the temporal ordering into the query rather than manual loops."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var latestTrades = trades\n    .GroupBy(t => t.AccountId)\n    .Select(g => g.OrderByDescending(t => t.Timestamp).First());",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when you need the most recent entry per key without mutating state, such as building dashboards or reconciling snapshots. Avoid when the dataset is huge and you'd benefit from streaming/SQL aggregation; consider database query with ROW_NUMBER or a materialized view to avoid loading everything into memory."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-50"
  },
  {
    "question": "Implement a method that flattens nested lists of instrument codes while preserving ordering.",
    "answer": [
      {
        "type": "text",
        "content": "Use SelectMany to flatten while keeping inner order."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var flat = nestedCodes.SelectMany(list => list);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when you have nested enumerables and simply need to concatenate them. Avoid when you must retain hierarchy boundaries—use nested loops instead."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-51"
  },
  {
    "question": "Explain the difference between SelectMany and nested loops. When is each preferable?",
    "answer": [
      {
        "type": "text",
        "content": "SelectMany projects each element to a sequence and flattens; nested loops make iteration explicit and allow more control over flow."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// SelectMany\nvar pairs = accounts.SelectMany(a => a.Orders, (a, o) => new { a.Id, o.Id });\n\n// Nested loops\nforeach (var a in accounts)\n    foreach (var o in a.Orders)\n        yield return (a.Id, o.Id);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use SelectMany when you want a fluent declarative pipeline or need joins. Use loops when performance-critical, complex control flow, or break/continue needed."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-52"
  },
  {
    "question": "How would you detect duplicate orders in a stream using GroupBy and produce a summary?",
    "answer": [
      {
        "type": "text",
        "content": "Group by unique order keys and filter groups with count > 1. Summaries can include counts, timestamps, and other aggregate metadata that drive remediation."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var duplicates = orders\n    .GroupBy(o => new { o.AccountId, o.ClientOrderId })\n    .Where(g => g.Count() > 1)\n    .Select(g => new {\n        g.Key.AccountId,\n        g.Key.ClientOrderId,\n        Count = g.Count(),\n        LatestTimestamp = g.Max(o => o.Timestamp)\n    });",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when you need summaries and easy grouping. Avoid when data volume exceeds in-memory capabilities—use database aggregates or streaming dedup."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-53"
  },
  {
    "question": "Sketch code to call three REST endpoints concurrently, cancel if any take longer than 3 seconds, and aggregate results.",
    "answer": [
      {
        "type": "text",
        "content": "Use Task.WhenAll with CancellationTokenSource + timeout. Ensure the HttpClient is a singleton to avoid socket exhaustion and that partial results are handled gracefully when cancellation occurs."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(3));\nvar tasks = endpoints.Select(url => httpClient.GetStringAsync(url, cts.Token));\nstring[] responses = await Task.WhenAll(tasks);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when limited number of independent calls; want fail-fast. Avoid when endpoints depend on each other or you must gracefully degrade per-call."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-54"
  },
  {
    "question": "Implement a resilient HTTP client with retry and circuit breaker policies using Polly.",
    "answer": [
      {
        "type": "text",
        "content": "Define policies and wrap HTTP calls."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var policy = Policy.WrapAsync(\n    Policy.Handle<HttpRequestException>()\n          .OrResult<HttpResponseMessage>(r => (int)r.StatusCode >= 500)\n          .WaitAndRetryAsync(3, attempt => TimeSpan.FromMilliseconds(200 * attempt)),\n    Policy.Handle<HttpRequestException>()\n          .CircuitBreakerAsync(5, TimeSpan.FromSeconds(30))\n);\n\nvar response = await policy.ExecuteAsync(() => httpClient.SendAsync(request));",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when downstream instability; need resilience. Avoid when operations must not be retried (e.g., non-idempotent commands without safeguards)."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-55"
  },
  {
    "question": "How would you handle backpressure when consuming a fast message queue with a slower downstream API?",
    "answer": [
      {
        "type": "text",
        "content": "Use bounded channels, buffering, or throttling. Consider load shedding by dropping low-priority messages or scaling consumers horizontally when queue lengths grow."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var channel = Channel.CreateBounded<Message>(new BoundedChannelOptions(100)\n{\n    FullMode = BoundedChannelFullMode.Wait\n});\n\n// Producer\n_ = Task.Run(async () =>\n{\n    await foreach (var msg in source.ReadAllAsync())\n        await channel.Writer.WriteAsync(msg);\n});\n\n// Consumer\nawait foreach (var msg in channel.Reader.ReadAllAsync())\n{\n    await ProcessAsync(msg);\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when consumer slower than producer; need to avoid overload. Avoid when throughput must be maximized with zero buffering—consider scaling consumers instead."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-56"
  },
  {
    "question": "Explain why you might use SemaphoreSlim with async code over lock.",
    "answer": [
      {
        "type": "text",
        "content": "SemaphoreSlim supports async waiting and throttling concurrency. It can represent both mutual exclusion (1 permit) and limited resource pools (>1 permits)."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "private readonly SemaphoreSlim _mutex = new(1, 1);\n\npublic async Task UseSharedAsync()\n{\n    await _mutex.WaitAsync();\n    try { await SharedAsyncOperation(); }\n    finally { _mutex.Release(); }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use SemaphoreSlim when async code needs mutual exclusion or limited parallelism. Avoid when code is synchronous—lock has less overhead."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-57"
  },
  {
    "question": "Describe the ASP.NET Core middleware pipeline for a request hitting an authenticated endpoint with custom exception handling.",
    "answer": [
      {
        "type": "text",
        "content": "Typical order: UseRouting → auth middleware → custom exception handling (usually early) → UseAuthentication/UseAuthorization → endpoint execution. Static file middleware, response compression, and caching can be interleaved before routing. Include correlation logging, caching, validation, and telemetry instrumentation."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "app.UseMiddleware<CorrelationMiddleware>();\napp.UseMiddleware<ExceptionHandlingMiddleware>();\napp.UseRouting();\napp.UseAuthentication();\napp.UseAuthorization();\napp.MapControllers();",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when building consistent request handling. Avoid when for minimal APIs you might use delegate pipeline but still similar."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-58"
  },
  {
    "question": "How do you implement API versioning and backward compatibility?",
    "answer": [
      {
        "type": "text",
        "content": "Strategies: URL segment (/v1/), header, query string. Use Asp.Versioning package."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "services.AddApiVersioning(options =>\n{\n    options.DefaultApiVersion = new ApiVersion(1, 0);\n    options.AssumeDefaultVersionWhenUnspecified = true;\n    options.ReportApiVersions = true;\n});\nservices.AddVersionedApiExplorer();",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when breaking changes; maintain backward compatibility by keeping old controllers. Avoid when internal services with clients you control; choose contract-first to avoid version explosion."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-59"
  },
  {
    "question": "Discuss strategies for rate limiting and request throttling.",
    "answer": [
      {
        "type": "text",
        "content": "Use ASP.NET rate limiting middleware or gateway. Techniques: token bucket, fixed window, sliding window."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "services.AddRateLimiter(options =>\n{\n    options.AddFixedWindowLimiter(\"per-account\", opt =>\n    {\n        opt.Window = TimeSpan.FromMinutes(1);\n        opt.PermitLimit = 60;\n        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;\n        opt.QueueLimit = 20;\n    });\n});\n\napp.UseRateLimiter();",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when protecting downstream resources. Avoid when latency-critical internal traffic; consider other forms of protection."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-60"
  },
  {
    "question": "How would you log correlation IDs across services and propagate them to downstream dependencies?",
    "answer": [
      {
        "type": "text",
        "content": "Generate ID in middleware, add to headers/log context, forward via HttpClient. Ensure asynchronous logging frameworks flow the correlation ID across threads (e.g., using AsyncLocal)."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "context.TraceIdentifier = context.TraceIdentifier ?? Guid.NewGuid().ToString();\n_logger.LogInformation(\"{CorrelationId} handling {Path}\", context.TraceIdentifier, context.Request.Path);\nhttpClient.DefaultRequestHeaders.Add(\"X-Correlation-ID\", context.TraceIdentifier);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when need distributed tracing. Avoid when truly isolated services—rare."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-61"
  },
  {
    "question": "Design a service that ingests MT5 tick data, normalizes it, caches latest prices, and exposes them via REST/WebSocket.",
    "answer": [
      {
        "type": "text",
        "content": "Components: Ingestion (connectors to MT5), normalization workers, cache (Redis), API (REST/WebSocket), persistence. Add replay storage (Kafka topic or time-series DB) for audit and late subscribers. Use message queue (Kafka) for fan-out and resilient decoupling of ingestion from delivery."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "while (await mt5Stream.MoveNextAsync())\n{\n    var normalized = Normalize(mt5Stream.Current);\n    await cache.SetAsync(normalized.Symbol, normalized.Price);\n    await hubContext.Clients.Group(normalized.Symbol)\n        .SendAsync(\"price\", normalized);\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when need low-latency price dissemination. Avoid when low-frequency batch updates suffice."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-62"
  },
  {
    "question": "Design an API that receives orders, validates, routes to MT4/MT5, and confirms execution. Include failure recovery.",
    "answer": [
      {
        "type": "text",
        "content": "Steps: receive REST order → validate (risk, compliance) → persist pending state → route to MT4/MT5 → await ack → publish result. Include idempotency keys on inbound requests and a reconciliation process for missing confirmations. Use saga/outbox for reliability and to coordinate compensating actions when downstream legs fail."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public async Task<IActionResult> Submit(OrderRequest dto)\n{\n    var order = await _validator.ValidateAsync(dto);\n    await _repository.SavePending(order);\n    var result = await _mtGateway.SendAsync(order);\n    await _repository.UpdateStatus(order.Id, result.Status);\n    await _bus.Publish(new OrderStatusChanged(order.Id, result.Status));\n    return Ok(result);\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when real-time trading with external platforms. Avoid when simple internal workflows—overkill."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-63"
  },
  {
    "question": "Architect a system to collect metrics from trading microservices and alert on anomalies.",
    "answer": [
      {
        "type": "text",
        "content": "Collect metrics via OpenTelemetry exporters, push to time-series DB (Prometheus), visualize in Grafana, alert via Alertmanager. Tag metrics with dimensions (service, region, environment) to support slicing and alert thresholds. Include streaming logs via ELK stack and trace sampling via Jaeger/Tempo."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var meter = new Meter(\"Trading.Services\");\nvar orderLatency = meter.CreateHistogram<double>(\"order_latency_ms\");\norderLatency.Record(latencyMs, KeyValuePair.Create<string, object?>(\"service\", serviceName));",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when need proactive observability. Avoid when prototype with low SLA."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-64"
  },
  {
    "question": "Discuss how you would integrate an external risk management engine into an existing microservices ecosystem.",
    "answer": [
      {
        "type": "text",
        "content": "Use async messaging or REST; maintain schema adapters; ensure idempotency. Map risk statuses to domain-specific responses and version contracts to avoid breaking changes. Add caching for rules, circuit breakers, fallback decisions, and health checks to remove unhealthy nodes from rotation."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var riskResponse = await _riskClient.EvaluateAsync(order, ct);\nif (!riskResponse.Approved)\n    return OrderDecision.Rejected(riskResponse.Reason);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when external compliance requirement. Avoid when latency-critical path can't tolerate external dependency—consider in-process rules."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-65"
  },
  {
    "question": "Compare RabbitMQ and ZeroMQ for distributing price updates. When would you choose one over the other?",
    "answer": [
      {
        "type": "text",
        "content": "RabbitMQ: brokered, supports persistence, routing, acknowledgments, management UI, plugins. ZeroMQ: brokerless sockets, ultra-low latency but manual patterns, no persistence out of the box. Use RabbitMQ for durable, complex routing, enterprise integration, where administrators need visibility and security. Use ZeroMQ for high-throughput, in-process/edge messaging; avoid if you need persistence or central management."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-66"
  },
  {
    "question": "Explain how to ensure at-least-once delivery with RabbitMQ while preventing duplicate processing.",
    "answer": [
      {
        "type": "text",
        "content": "Use durable queues, persistent messages, manual ack, idempotent consumers. Enable publisher confirms to ensure the broker persisted the message before acknowledging to the producer."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "channel.BasicConsume(queue, autoAck: false, consumer);\nconsumer.Received += (sender, ea) =>\n{\n    Handle(ea.Body);\n    channel.BasicAck(ea.DeliveryTag, multiple: false);\n};",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when you can tolerate duplicates; critical to ensure no loss. Avoid when exactly-once semantics required—use transactional outbox + dedup."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-67"
  },
  {
    "question": "How would you design a saga pattern to coordinate account funding across multiple services?",
    "answer": [
      {
        "type": "text",
        "content": "Orchestrator or choreography; manage compensations (reverse ledger entry, refund payment)."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public async Task Handle(FundAccount command)\n{\n    var transferId = await _payments.DebitAsync(command.PaymentId);\n    try\n    {\n        await _ledger.CreditAsync(command.AccountId, command.Amount);\n        await _notifications.SendAsync(command.AccountId, \"Funding complete\");\n    }\n    catch\n    {\n        await _payments.RefundAsync(transferId);\n        throw;\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when multi-step, distributed transactions. Avoid when single system handles all steps—simple ACID transaction suffices."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-68"
  },
  {
    "question": "Discuss the outbox pattern and how it prevents message loss in event-driven systems.",
    "answer": [
      {
        "type": "text",
        "content": "Write domain event to outbox table within same transaction, then relay to message bus. A background dispatcher polls the outbox table, publishes events, and marks them as processed (with retries and exponential backoff)."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "await using var tx = await db.Database.BeginTransactionAsync();\norder.Status = OrderStatus.Accepted;\ndb.Outbox.Add(new OutboxMessage(order.Id, new OrderAccepted(order.Id)));\nawait db.SaveChangesAsync();\nawait tx.CommitAsync();",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when need atomic DB + message publish. Avoid when no shared database or eventual consistency acceptable without duplication."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-69"
  },
  {
    "question": "Write a SQL query to calculate the rolling 7-day trade volume per instrument.",
    "answer": [
      {
        "type": "text",
        "content": "Use window functions to calculate rolling aggregates."
      },
      {
        "type": "code",
        "language": "sql",
        "code": "WITH daily AS (\n    SELECT instrument_id,\n           trade_timestamp::date AS trade_date,\n           SUM(volume) AS daily_volume\n    FROM trades\n    GROUP BY instrument_id, trade_timestamp::date\n)\nSELECT instrument_id,\n       trade_date,\n       daily_volume,\n       SUM(daily_volume) OVER (\n           PARTITION BY instrument_id\n           ORDER BY trade_date\n           ROWS BETWEEN 6 PRECEDING AND CURRENT ROW\n       ) AS rolling_7d_volume\nFROM daily\nORDER BY instrument_id, trade_date;",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when need rolling metrics in SQL. Avoid when database lacks window functions—use app-side aggregation."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-70"
  },
  {
    "question": "Explain how you would choose between normalized schemas and denormalized tables for reporting.",
    "answer": [
      {
        "type": "text",
        "content": "Normalized: reduces redundancy, good for OLTP. Changes cascade predictably, but reporting joins can be expensive. Denormalized: duplicates data for fast reads (reporting, analytics). Updates are more complex; rely on ETL pipelines to keep facts in sync. Choose based on workload: mixed? use hybrid star schema or CQRS approach with read-optimized projections."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-71"
  },
  {
    "question": "Describe the differences between clustered and non-clustered indexes and when to use covering indexes.",
    "answer": [
      {
        "type": "text",
        "content": "Clustered: defines physical order, one per table; great for range scans. Non-clustered: separate structure pointing to data; can include columns."
      },
      {
        "type": "code",
        "language": "sql",
        "code": "CREATE NONCLUSTERED INDEX IX_Orders_Account_Status\n    ON Orders(AccountId, Status)\n    INCLUDE (CreatedAt, Amount);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use covering index when query needs subset of columns; avoid extra lookups. Avoid when frequent writes—maintaining many indexes hurts performance."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-72"
  },
  {
    "question": "Walk through handling a long-running report query that impacts OLTP performance.",
    "answer": [
      {
        "type": "text",
        "content": "Strategies: read replicas, materialized views, batching, query hints, schedule off-peak. Consider breaking the query into smaller windowed segments and streaming results to avoid locking. Implement caching, pre-aggregation, and monitor execution plans for regressions."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-73"
  },
  {
    "question": "Describe the lifecycle of a forex trade from placement to settlement.",
    "answer": [
      {
        "type": "text",
        "content": "Steps: quote, order placement, validation, routing, execution (fill/partial), confirmation, settlement (T+2), P&L updates. Post-trade, apply trade capture in back-office systems and reconcile with liquidity providers. Include margin checks and clearing, corporate actions, and overnight financing (swap) adjustments."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-74"
  },
  {
    "question": "How would you integrate with MT4/MT5 APIs for trade execution in C#? Mention authentication, session management, and error handling.",
    "answer": [
      {
        "type": "text",
        "content": "Use MetaTrader Manager/Server APIs via C# wrappers; handle session auth, keep-alive, throttle requests. Manage connections via dedicated service accounts and pre-allocate connection pools. Implement reconnect logic, map errors, ensure idempotent order submission. Translate MT-specific error codes into domain-level responses for clients."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "using var session = new Mt5Gateway(credentials);\nawait session.ConnectAsync();\nvar ticket = await session.SendOrderAsync(request);",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-75"
  },
  {
    "question": "What are common risk checks before executing a client order (e.g., margin, exposure limits)?",
    "answer": [
      {
        "type": "text",
        "content": "Margin availability, max exposure per instrument, credit limits, duplicate orders, fat-finger (price deviation). Implement pre-trade risk service."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-76"
  },
  {
    "question": "Explain how you'd handle market data bursts without dropping updates.",
    "answer": [
      {
        "type": "text",
        "content": "Use batching, diff updates, UDP multicast ingestion, prioritized queues, snapshot + incremental updates. Utilize adaptive sampling—send every tick to VIP clients while throttling retail feeds. Apply throttling per client, drop non-critical updates after stale, and monitor queue depths to trigger auto-scaling."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-77"
  },
  {
    "question": "Tell me about a time you led a critical production fix under pressure.",
    "answer": [
      {
        "type": "text",
        "content": "Discuss scenario: triage, swarm, communication, root cause, postmortem. Highlight proactive rollback plans and customer communication cadence."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-78"
  },
  {
    "question": "Describe a situation where you improved a process by automating manual work.",
    "answer": [
      {
        "type": "text",
        "content": "Example: build CI pipeline, reduce manual deployment, measured time saved. Emphasize KPIs such as deployment frequency and lead time."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-79"
  },
  {
    "question": "Discuss a conflict within a team and how you resolved it.",
    "answer": [
      {
        "type": "text",
        "content": "Example: align on goals, active listening, data-driven decision, mediation. Demonstrate neutral facilitation and follow-up agreements."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-80"
  },
  {
    "question": "Share a story that demonstrates your commitment to documentation or knowledge sharing.",
    "answer": [
      {
        "type": "text",
        "content": "Example: created runbooks, knowledge base, improved onboarding. Include metrics such as onboarding time reduction and support ticket deflection."
      }
    ],
    "category": "practice",
    "topic": "Questions",
    "topicId": "questions",
    "source": "practice/questions.md",
    "id": "card-81"
  },
  {
    "question": "Identify the SRP violations in this User class and refactor it.",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class User\n{\n    public int Id { get; set; }\n    public string Name { get; set; }\n    public string Email { get; set; }\n\n    public void SaveToDatabase()\n    {\n        // Database logic\n        var connection = new SqlConnection(\"...\");\n        // Save user\n    }\n\n    public void SendWelcomeEmail()\n    {\n        // Email logic\n        var smtp = new SmtpClient();\n        // Send email\n    }\n\n    public string GenerateUserReport()\n    {\n        // Report generation logic\n        return $\"User Report: {Name}\";\n    }\n\n    public bool ValidateEmail()\n    {\n        // Validation logic\n        return Email.Contains(\"@\");\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "The User class has multiple responsibilities: data storage, email sending, report generation, and validation. Refactor into separate classes:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Single responsibility: User data\npublic class User\n{\n    public int Id { get; set; }\n    public string Name { get; set; }\n    public string Email { get; set; }\n}\n\n// Single responsibility: Data persistence\npublic class UserRepository\n{\n    private readonly string _connectionString;\n\n    public UserRepository(string connectionString)\n    {\n        _connectionString = connectionString;\n    }\n\n    public void Save(User user)\n    {\n        using var connection = new SqlConnection(_connectionString);\n        // Save user\n    }\n}\n\n// Single responsibility: Email notifications\npublic class EmailService\n{\n    private readonly SmtpClient _smtpClient;\n\n    public EmailService(SmtpClient smtpClient)\n    {\n        _smtpClient = smtpClient;\n    }\n\n    public void SendWelcomeEmail(User user)\n    {\n        // Send email\n    }\n}\n\n// Single responsibility: Report generation\npublic class UserReportGenerator\n{\n    public string Generate(User user)\n    {\n        return $\"User Report: {user.Name}\";\n    }\n}\n\n// Single responsibility: Validation\npublic class EmailValidator\n{\n    public bool Validate(string email)\n    {\n        return !string.IsNullOrEmpty(email) && email.Contains(\"@\");\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when: Building maintainable applications where changes to one concern shouldn't affect others. Avoid when: Over-engineering simple DTOs or models that are pure data containers."
      }
    ],
    "category": "practice",
    "topic": "S Single Responsibility Principle Exercises",
    "topicId": "s-single-responsibility-principle-exercises",
    "source": "practice/SOLID/S-Single-Responsibility-Principle-Exercises.md",
    "id": "card-82"
  },
  {
    "question": "Refactor this OrderProcessor class to follow SRP.",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderProcessor\n{\n    public void ProcessOrder(Order order)\n    {\n        // Validate order\n        if (order.Items.Count == 0)\n            throw new Exception(\"Order must have items\");\n\n        // Calculate total\n        decimal total = 0;\n        foreach (var item in order.Items)\n        {\n            total += item.Price * item.Quantity;\n        }\n        order.Total = total;\n\n        // Apply discount\n        if (order.Customer.IsPremium)\n        {\n            order.Total *= 0.9m;\n        }\n\n        // Save to database\n        var db = new SqlConnection(\"...\");\n        // Save order\n\n        // Send confirmation email\n        var smtp = new SmtpClient();\n        // Send email\n\n        // Log\n        Console.WriteLine($\"Order {order.Id} processed\");\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Separate into distinct responsibilities:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class Order\n{\n    public int Id { get; set; }\n    public Customer Customer { get; set; }\n    public List<OrderItem> Items { get; set; } = new();\n    public decimal Total { get; set; }\n}\n\n// Responsibility: Order validation\npublic class OrderValidator\n{\n    public void Validate(Order order)\n    {\n        if (order.Items.Count == 0)\n            throw new InvalidOperationException(\"Order must have items\");\n\n        if (order.Customer == null)\n            throw new InvalidOperationException(\"Order must have a customer\");\n    }\n}\n\n// Responsibility: Price calculation\npublic class OrderPriceCalculator\n{\n    public decimal CalculateTotal(Order order)\n    {\n        return order.Items.Sum(item => item.Price * item.Quantity);\n    }\n}\n\n// Responsibility: Discount application\npublic class DiscountService\n{\n    public decimal ApplyDiscount(decimal amount, Customer customer)\n    {\n        return customer.IsPremium ? amount * 0.9m : amount;\n    }\n}\n\n// Responsibility: Data persistence\npublic class OrderRepository\n{\n    private readonly IDbConnection _connection;\n\n    public OrderRepository(IDbConnection connection)\n    {\n        _connection = connection;\n    }\n\n    public void Save(Order order)\n    {\n        // Save to database\n    }\n}\n\n// Responsibility: Email notifications\npublic class OrderNotificationService\n{\n    private readonly IEmailService _emailService;\n\n    public OrderNotificationService(IEmailService emailService)\n    {\n        _emailService = emailService;\n    }\n\n    public void SendConfirmation(Order order)\n    {\n        _emailService.Send(order.Customer.Email, \"Order Confirmation\", $\"Order {order.Id}\");\n    }\n}\n\n// Responsibility: Logging\npublic class OrderLogger\n{\n    private readonly ILogger _logger;\n\n    public OrderLogger(ILogger logger)\n    {\n        _logger = logger;\n    }\n\n    public void LogProcessed(Order order)\n    {\n        _logger.LogInformation($\"Order {order.Id} processed\");\n    }\n}\n\n// Orchestrator: Coordinates the workflow\npublic class OrderProcessor\n{\n    private readonly OrderValidator _validator;\n    private readonly OrderPriceCalculator _calculator;\n    private readonly DiscountService _discountService;\n    private readonly OrderRepository _repository;\n    private readonly OrderNotificationService _notificationService;\n    private readonly OrderLogger _logger;\n\n    public OrderProcessor(\n        OrderValidator validator,\n        OrderPriceCalculator calculator,\n        DiscountService discountService,\n        OrderRepository repository,\n        OrderNotificationService notificationService,\n        OrderLogger logger)\n    {\n        _validator = validator;\n        _calculator = calculator;\n        _discountService = discountService;\n        _repository = repository;\n        _notificationService = notificationService;\n        _logger = logger;\n    }\n\n    public void ProcessOrder(Order order)\n    {\n        _validator.Validate(order);\n\n        var subtotal = _calculator.CalculateTotal(order);\n        order.Total = _discountService.ApplyDiscount(subtotal, order.Customer);\n\n        _repository.Save(order);\n        _notificationService.SendConfirmation(order);\n        _logger.LogProcessed(order);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "S Single Responsibility Principle Exercises",
    "topicId": "s-single-responsibility-principle-exercises",
    "source": "practice/SOLID/S-Single-Responsibility-Principle-Exercises.md",
    "id": "card-83"
  },
  {
    "question": "Identify SRP violations in this ReportGenerator class.",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class ReportGenerator\n{\n    public string GenerateReport(List<Sale> sales)\n    {\n        // Fetch data\n        var connection = new SqlConnection(\"...\");\n        var salesData = FetchSalesData(connection);\n\n        // Calculate metrics\n        var totalSales = salesData.Sum(s => s.Amount);\n        var averageSale = salesData.Average(s => s.Amount);\n\n        // Format report\n        var report = new StringBuilder();\n        report.AppendLine($\"Total Sales: {totalSales}\");\n        report.AppendLine($\"Average Sale: {averageSale}\");\n\n        // Save to file\n        File.WriteAllText(\"report.txt\", report.ToString());\n\n        // Send via email\n        var smtp = new SmtpClient();\n        // Send email\n\n        return report.ToString();\n    }\n\n    private List<Sale> FetchSalesData(SqlConnection connection)\n    {\n        // Fetch from database\n        return new List<Sale>();\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Separate into distinct responsibilities:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Responsibility: Data access\npublic class SalesRepository\n{\n    private readonly IDbConnection _connection;\n\n    public SalesRepository(IDbConnection connection)\n    {\n        _connection = connection;\n    }\n\n    public List<Sale> GetAll()\n    {\n        // Fetch from database\n        return new List<Sale>();\n    }\n}\n\n// Responsibility: Business calculations\npublic class SalesMetricsCalculator\n{\n    public SalesMetrics Calculate(List<Sale> sales)\n    {\n        return new SalesMetrics\n        {\n            TotalSales = sales.Sum(s => s.Amount),\n            AverageSale = sales.Average(s => s.Amount),\n            SaleCount = sales.Count\n        };\n    }\n}\n\n// Responsibility: Report formatting\npublic class ReportFormatter\n{\n    public string Format(SalesMetrics metrics)\n    {\n        var report = new StringBuilder();\n        report.AppendLine($\"Total Sales: {metrics.TotalSales:C}\");\n        report.AppendLine($\"Average Sale: {metrics.AverageSale:C}\");\n        report.AppendLine($\"Number of Sales: {metrics.SaleCount}\");\n        return report.ToString();\n    }\n}\n\n// Responsibility: File operations\npublic class ReportFileWriter\n{\n    public void WriteToFile(string content, string filePath)\n    {\n        File.WriteAllText(filePath, content);\n    }\n}\n\n// Responsibility: Email delivery\npublic class ReportEmailService\n{\n    private readonly IEmailService _emailService;\n\n    public ReportEmailService(IEmailService emailService)\n    {\n        _emailService = emailService;\n    }\n\n    public void SendReport(string report, string recipient)\n    {\n        _emailService.Send(recipient, \"Sales Report\", report);\n    }\n}\n\n// Orchestrator\npublic class ReportGenerator\n{\n    private readonly SalesRepository _repository;\n    private readonly SalesMetricsCalculator _calculator;\n    private readonly ReportFormatter _formatter;\n    private readonly ReportFileWriter _fileWriter;\n    private readonly ReportEmailService _emailService;\n\n    public ReportGenerator(\n        SalesRepository repository,\n        SalesMetricsCalculator calculator,\n        ReportFormatter formatter,\n        ReportFileWriter fileWriter,\n        ReportEmailService emailService)\n    {\n        _repository = repository;\n        _calculator = calculator;\n        _formatter = formatter;\n        _fileWriter = fileWriter;\n        _emailService = emailService;\n    }\n\n    public string GenerateAndDistributeReport(string recipient, string filePath)\n    {\n        var sales = _repository.GetAll();\n        var metrics = _calculator.Calculate(sales);\n        var report = _formatter.Format(metrics);\n\n        _fileWriter.WriteToFile(report, filePath);\n        _emailService.SendReport(report, recipient);\n\n        return report;\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "S Single Responsibility Principle Exercises",
    "topicId": "s-single-responsibility-principle-exercises",
    "source": "practice/SOLID/S-Single-Responsibility-Principle-Exercises.md",
    "id": "card-84"
  },
  {
    "question": "Refactor this Employee class that handles both employee data and payroll calculations.",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "public class Employee\n{\n    public int Id { get; set; }\n    public string Name { get; set; }\n    public decimal HourlyRate { get; set; }\n    public int HoursWorked { get; set; }\n\n    public decimal CalculatePayment()\n    {\n        var regularHours = Math.Min(HoursWorked, 40);\n        var overtimeHours = Math.Max(HoursWorked - 40, 0);\n\n        var regularPay = regularHours * HourlyRate;\n        var overtimePay = overtimeHours * HourlyRate * 1.5m;\n\n        return regularPay + overtimePay;\n    }\n\n    public decimal CalculateTax()\n    {\n        var payment = CalculatePayment();\n        if (payment < 1000) return payment * 0.1m;\n        if (payment < 5000) return payment * 0.2m;\n        return payment * 0.3m;\n    }\n\n    public void SaveToDatabase()\n    {\n        var connection = new SqlConnection(\"...\");\n        // Save employee\n    }\n\n    public string GeneratePayslip()\n    {\n        return $\"Employee: {Name}, Payment: {CalculatePayment():C}, Tax: {CalculateTax():C}\";\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Separate into focused classes:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Responsibility: Employee data\npublic class Employee\n{\n    public int Id { get; set; }\n    public string Name { get; set; }\n    public decimal HourlyRate { get; set; }\n    public int HoursWorked { get; set; }\n}\n\n// Responsibility: Payroll calculations\npublic class PayrollCalculator\n{\n    private const int StandardHours = 40;\n    private const decimal OvertimeMultiplier = 1.5m;\n\n    public decimal CalculatePayment(Employee employee)\n    {\n        var regularHours = Math.Min(employee.HoursWorked, StandardHours);\n        var overtimeHours = Math.Max(employee.HoursWorked - StandardHours, 0);\n\n        var regularPay = regularHours * employee.HourlyRate;\n        var overtimePay = overtimeHours * employee.HourlyRate * OvertimeMultiplier;\n\n        return regularPay + overtimePay;\n    }\n}\n\n// Responsibility: Tax calculations\npublic class TaxCalculator\n{\n    public decimal CalculateTax(decimal payment)\n    {\n        if (payment < 1000) return payment * 0.1m;\n        if (payment < 5000) return payment * 0.2m;\n        return payment * 0.3m;\n    }\n}\n\n// Responsibility: Data persistence\npublic class EmployeeRepository\n{\n    private readonly IDbConnection _connection;\n\n    public EmployeeRepository(IDbConnection connection)\n    {\n        _connection = connection;\n    }\n\n    public void Save(Employee employee)\n    {\n        // Save to database\n    }\n\n    public Employee GetById(int id)\n    {\n        // Retrieve from database\n        return null;\n    }\n}\n\n// Responsibility: Document generation\npublic class PayslipGenerator\n{\n    private readonly PayrollCalculator _payrollCalculator;\n    private readonly TaxCalculator _taxCalculator;\n\n    public PayslipGenerator(PayrollCalculator payrollCalculator, TaxCalculator taxCalculator)\n    {\n        _payrollCalculator = payrollCalculator;\n        _taxCalculator = taxCalculator;\n    }\n\n    public string Generate(Employee employee)\n    {\n        var payment = _payrollCalculator.CalculatePayment(employee);\n        var tax = _taxCalculator.CalculateTax(payment);\n\n        return $\"Employee: {employee.Name}\\n\" +\n               $\"Payment: {payment:C}\\n\" +\n               $\"Tax: {tax:C}\\n\" +\n               $\"Net Pay: {payment - tax:C}\";\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "S Single Responsibility Principle Exercises",
    "topicId": "s-single-responsibility-principle-exercises",
    "source": "practice/SOLID/S-Single-Responsibility-Principle-Exercises.md",
    "id": "card-85"
  },
  {
    "question": "Design a logging system that follows SRP. It should support multiple log levels, formats, and destinations.",
    "answer": [
      {
        "type": "text",
        "content": "Create separate classes for each responsibility:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Responsibility: Log entry data\npublic class LogEntry\n{\n    public DateTime Timestamp { get; set; }\n    public LogLevel Level { get; set; }\n    public string Message { get; set; }\n    public string Category { get; set; }\n    public Exception Exception { get; set; }\n}\n\npublic enum LogLevel\n{\n    Debug, Info, Warning, Error, Critical\n}\n\n// Responsibility: Log formatting\npublic interface ILogFormatter\n{\n    string Format(LogEntry entry);\n}\n\npublic class JsonLogFormatter : ILogFormatter\n{\n    public string Format(LogEntry entry)\n    {\n        return JsonSerializer.Serialize(entry);\n    }\n}\n\npublic class PlainTextLogFormatter : ILogFormatter\n{\n    public string Format(LogEntry entry)\n    {\n        return $\"[{entry.Timestamp:yyyy-MM-dd HH:mm:ss}] [{entry.Level}] {entry.Message}\";\n    }\n}\n\n// Responsibility: Log destination\npublic interface ILogDestination\n{\n    void Write(string formattedLog);\n}\n\npublic class FileLogDestination : ILogDestination\n{\n    private readonly string _filePath;\n\n    public FileLogDestination(string filePath)\n    {\n        _filePath = filePath;\n    }\n\n    public void Write(string formattedLog)\n    {\n        File.AppendAllText(_filePath, formattedLog + Environment.NewLine);\n    }\n}\n\npublic class ConsoleLogDestination : ILogDestination\n{\n    public void Write(string formattedLog)\n    {\n        Console.WriteLine(formattedLog);\n    }\n}\n\npublic class DatabaseLogDestination : ILogDestination\n{\n    private readonly IDbConnection _connection;\n\n    public DatabaseLogDestination(IDbConnection connection)\n    {\n        _connection = connection;\n    }\n\n    public void Write(string formattedLog)\n    {\n        // Write to database\n    }\n}\n\n// Responsibility: Log filtering\npublic interface ILogFilter\n{\n    bool ShouldLog(LogEntry entry);\n}\n\npublic class LogLevelFilter : ILogFilter\n{\n    private readonly LogLevel _minLevel;\n\n    public LogLevelFilter(LogLevel minLevel)\n    {\n        _minLevel = minLevel;\n    }\n\n    public bool ShouldLog(LogEntry entry)\n    {\n        return entry.Level >= _minLevel;\n    }\n}\n\n// Responsibility: Orchestrating logging\npublic class Logger\n{\n    private readonly List<ILogDestination> _destinations;\n    private readonly ILogFormatter _formatter;\n    private readonly ILogFilter _filter;\n\n    public Logger(\n        ILogFormatter formatter,\n        ILogFilter filter,\n        params ILogDestination[] destinations)\n    {\n        _formatter = formatter;\n        _filter = filter;\n        _destinations = new List<ILogDestination>(destinations);\n    }\n\n    public void Log(LogLevel level, string message, string category = null, Exception exception = null)\n    {\n        var entry = new LogEntry\n        {\n            Timestamp = DateTime.UtcNow,\n            Level = level,\n            Message = message,\n            Category = category,\n            Exception = exception\n        };\n\n        if (!_filter.ShouldLog(entry))\n            return;\n\n        var formattedLog = _formatter.Format(entry);\n\n        foreach (var destination in _destinations)\n        {\n            destination.Write(formattedLog);\n        }\n    }\n\n    public void Debug(string message) => Log(LogLevel.Debug, message);\n    public void Info(string message) => Log(LogLevel.Info, message);\n    public void Warning(string message) => Log(LogLevel.Warning, message);\n    public void Error(string message, Exception ex = null) => Log(LogLevel.Error, message, exception: ex);\n}\n\n// Usage\nvar logger = new Logger(\n    new JsonLogFormatter(),\n    new LogLevelFilter(LogLevel.Info),\n    new FileLogDestination(\"app.log\"),\n    new ConsoleLogDestination()\n);\n\nlogger.Info(\"Application started\");\nlogger.Error(\"An error occurred\", new Exception(\"Test exception\"));",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "S Single Responsibility Principle Exercises",
    "topicId": "s-single-responsibility-principle-exercises",
    "source": "practice/SOLID/S-Single-Responsibility-Principle-Exercises.md",
    "id": "card-86"
  },
  {
    "question": "Create a file processing system that reads, validates, transforms, and stores data while following SRP.",
    "answer": [
      {
        "type": "text",
        "content": "Separate each step into its own class:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Responsibility: File reading\npublic interface IFileReader\n{\n    Task<string> ReadAsync(string filePath);\n}\n\npublic class TextFileReader : IFileReader\n{\n    public async Task<string> ReadAsync(string filePath)\n    {\n        return await File.ReadAllTextAsync(filePath);\n    }\n}\n\n// Responsibility: Data parsing\npublic interface IDataParser<T>\n{\n    T Parse(string content);\n}\n\npublic class CsvParser : IDataParser<List<Dictionary<string, string>>>\n{\n    public List<Dictionary<string, string>> Parse(string content)\n    {\n        var lines = content.Split('\\n');\n        var headers = lines[0].Split(',');\n\n        return lines.Skip(1)\n            .Select(line =>\n            {\n                var values = line.Split(',');\n                return headers.Zip(values, (h, v) => new { h, v })\n                    .ToDictionary(x => x.h, x => x.v);\n            })\n            .ToList();\n    }\n}\n\n// Responsibility: Data validation\npublic interface IDataValidator<T>\n{\n    ValidationResult Validate(T data);\n}\n\npublic class ValidationResult\n{\n    public bool IsValid { get; set; }\n    public List<string> Errors { get; set; } = new();\n}\n\npublic class OrderDataValidator : IDataValidator<List<Dictionary<string, string>>>\n{\n    public ValidationResult Validate(List<Dictionary<string, string>> data)\n    {\n        var result = new ValidationResult { IsValid = true };\n\n        foreach (var row in data)\n        {\n            if (!row.ContainsKey(\"OrderId\") || string.IsNullOrEmpty(row[\"OrderId\"]))\n            {\n                result.IsValid = false;\n                result.Errors.Add(\"OrderId is required\");\n            }\n\n            if (row.ContainsKey(\"Amount\") && !decimal.TryParse(row[\"Amount\"], out _))\n            {\n                result.IsValid = false;\n                result.Errors.Add($\"Invalid amount in order {row.GetValueOrDefault(\"OrderId\")}\");\n            }\n        }\n\n        return result;\n    }\n}\n\n// Responsibility: Data transformation\npublic interface IDataTransformer<TInput, TOutput>\n{\n    TOutput Transform(TInput data);\n}\n\npublic class OrderTransformer : IDataTransformer<List<Dictionary<string, string>>, List<Order>>\n{\n    public List<Order> Transform(List<Dictionary<string, string>> data)\n    {\n        return data.Select(row => new Order\n        {\n            Id = row[\"OrderId\"],\n            Amount = decimal.Parse(row[\"Amount\"]),\n            CustomerId = row.GetValueOrDefault(\"CustomerId\")\n        }).ToList();\n    }\n}\n\n// Responsibility: Data storage\npublic interface IDataRepository<T>\n{\n    Task SaveAsync(T data);\n}\n\npublic class OrderRepository : IDataRepository<List<Order>>\n{\n    private readonly IDbConnection _connection;\n\n    public OrderRepository(IDbConnection connection)\n    {\n        _connection = connection;\n    }\n\n    public async Task SaveAsync(List<Order> orders)\n    {\n        // Save to database\n        await Task.CompletedTask;\n    }\n}\n\n// Responsibility: Error handling and logging\npublic interface IProcessingLogger\n{\n    void LogStart(string filePath);\n    void LogValidationErrors(ValidationResult result);\n    void LogSuccess(int recordCount);\n    void LogError(Exception ex);\n}\n\npublic class ProcessingLogger : IProcessingLogger\n{\n    private readonly ILogger _logger;\n\n    public ProcessingLogger(ILogger logger)\n    {\n        _logger = logger;\n    }\n\n    public void LogStart(string filePath)\n    {\n        _logger.LogInformation($\"Starting to process file: {filePath}\");\n    }\n\n    public void LogValidationErrors(ValidationResult result)\n    {\n        foreach (var error in result.Errors)\n        {\n            _logger.LogWarning($\"Validation error: {error}\");\n        }\n    }\n\n    public void LogSuccess(int recordCount)\n    {\n        _logger.LogInformation($\"Successfully processed {recordCount} records\");\n    }\n\n    public void LogError(Exception ex)\n    {\n        _logger.LogError(ex, \"Error processing file\");\n    }\n}\n\n// Orchestrator: Coordinates the workflow\npublic class FileProcessingService\n{\n    private readonly IFileReader _fileReader;\n    private readonly IDataParser<List<Dictionary<string, string>>> _parser;\n    private readonly IDataValidator<List<Dictionary<string, string>>> _validator;\n    private readonly IDataTransformer<List<Dictionary<string, string>>, List<Order>> _transformer;\n    private readonly IDataRepository<List<Order>> _repository;\n    private readonly IProcessingLogger _logger;\n\n    public FileProcessingService(\n        IFileReader fileReader,\n        IDataParser<List<Dictionary<string, string>>> parser,\n        IDataValidator<List<Dictionary<string, string>>> validator,\n        IDataTransformer<List<Dictionary<string, string>>, List<Order>> transformer,\n        IDataRepository<List<Order>> repository,\n        IProcessingLogger logger)\n    {\n        _fileReader = fileReader;\n        _parser = parser;\n        _validator = validator;\n        _transformer = transformer;\n        _repository = repository;\n        _logger = logger;\n    }\n\n    public async Task ProcessFileAsync(string filePath)\n    {\n        try\n        {\n            _logger.LogStart(filePath);\n\n            // Read\n            var content = await _fileReader.ReadAsync(filePath);\n\n            // Parse\n            var rawData = _parser.Parse(content);\n\n            // Validate\n            var validationResult = _validator.Validate(rawData);\n            if (!validationResult.IsValid)\n            {\n                _logger.LogValidationErrors(validationResult);\n                return;\n            }\n\n            // Transform\n            var orders = _transformer.Transform(rawData);\n\n            // Store\n            await _repository.SaveAsync(orders);\n\n            _logger.LogSuccess(orders.Count);\n        }\n        catch (Exception ex)\n        {\n            _logger.LogError(ex);\n            throw;\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "S Single Responsibility Principle Exercises",
    "topicId": "s-single-responsibility-principle-exercises",
    "source": "practice/SOLID/S-Single-Responsibility-Principle-Exercises.md",
    "id": "card-87"
  },
  {
    "question": "Design an e-commerce checkout system following SRP. Include inventory checking, payment processing, order creation, and notifications.",
    "answer": [
      {
        "type": "text",
        "content": "Create focused services for each responsibility:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Domain entities\npublic class Cart\n{\n    public string CustomerId { get; set; }\n    public List<CartItem> Items { get; set; } = new();\n}\n\npublic class CartItem\n{\n    public string ProductId { get; set; }\n    public int Quantity { get; set; }\n    public decimal Price { get; set; }\n}\n\npublic class Order\n{\n    public string Id { get; set; }\n    public string CustomerId { get; set; }\n    public List<OrderItem> Items { get; set; } = new();\n    public decimal Total { get; set; }\n    public string Status { get; set; }\n    public DateTime CreatedAt { get; set; }\n}\n\n// Responsibility: Inventory management\npublic interface IInventoryService\n{\n    Task<bool> CheckAvailabilityAsync(string productId, int quantity);\n    Task ReserveAsync(string productId, int quantity);\n    Task ReleaseAsync(string productId, int quantity);\n}\n\npublic class InventoryService : IInventoryService\n{\n    private readonly IInventoryRepository _repository;\n\n    public InventoryService(IInventoryRepository repository)\n    {\n        _repository = repository;\n    }\n\n    public async Task<bool> CheckAvailabilityAsync(string productId, int quantity)\n    {\n        var stock = await _repository.GetStockAsync(productId);\n        return stock >= quantity;\n    }\n\n    public async Task ReserveAsync(string productId, int quantity)\n    {\n        await _repository.DecrementStockAsync(productId, quantity);\n    }\n\n    public async Task ReleaseAsync(string productId, int quantity)\n    {\n        await _repository.IncrementStockAsync(productId, quantity);\n    }\n}\n\n// Responsibility: Payment processing\npublic interface IPaymentService\n{\n    Task<PaymentResult> ProcessPaymentAsync(string customerId, decimal amount, string paymentMethod);\n}\n\npublic class PaymentResult\n{\n    public bool Success { get; set; }\n    public string TransactionId { get; set; }\n    public string ErrorMessage { get; set; }\n}\n\npublic class PaymentService : IPaymentService\n{\n    private readonly IPaymentGateway _gateway;\n\n    public PaymentService(IPaymentGateway gateway)\n    {\n        _gateway = gateway;\n    }\n\n    public async Task<PaymentResult> ProcessPaymentAsync(string customerId, decimal amount, string paymentMethod)\n    {\n        return await _gateway.ChargeAsync(customerId, amount, paymentMethod);\n    }\n}\n\n// Responsibility: Order creation\npublic interface IOrderFactory\n{\n    Order CreateOrder(Cart cart);\n}\n\npublic class OrderFactory : IOrderFactory\n{\n    public Order CreateOrder(Cart cart)\n    {\n        return new Order\n        {\n            Id = Guid.NewGuid().ToString(),\n            CustomerId = cart.CustomerId,\n            Items = cart.Items.Select(ci => new OrderItem\n            {\n                ProductId = ci.ProductId,\n                Quantity = ci.Quantity,\n                Price = ci.Price\n            }).ToList(),\n            Total = cart.Items.Sum(ci => ci.Price * ci.Quantity),\n            Status = \"Pending\",\n            CreatedAt = DateTime.UtcNow\n        };\n    }\n}\n\n// Responsibility: Order persistence\npublic interface IOrderRepository\n{\n    Task SaveAsync(Order order);\n    Task UpdateStatusAsync(string orderId, string status);\n}\n\n// Responsibility: Customer notifications\npublic interface INotificationService\n{\n    Task SendOrderConfirmationAsync(Order order);\n    Task SendPaymentFailureAsync(string customerId, string reason);\n}\n\npublic class NotificationService : INotificationService\n{\n    private readonly IEmailService _emailService;\n    private readonly ISmsService _smsService;\n\n    public NotificationService(IEmailService emailService, ISmsService smsService)\n    {\n        _emailService = emailService;\n        _smsService = smsService;\n    }\n\n    public async Task SendOrderConfirmationAsync(Order order)\n    {\n        await _emailService.SendAsync(order.CustomerId, \"Order Confirmation\", $\"Order {order.Id} confirmed\");\n    }\n\n    public async Task SendPaymentFailureAsync(string customerId, string reason)\n    {\n        await _emailService.SendAsync(customerId, \"Payment Failed\", reason);\n    }\n}\n\n// Orchestrator: Checkout process\npublic class CheckoutService\n{\n    private readonly IInventoryService _inventoryService;\n    private readonly IPaymentService _paymentService;\n    private readonly IOrderFactory _orderFactory;\n    private readonly IOrderRepository _orderRepository;\n    private readonly INotificationService _notificationService;\n    private readonly ILogger<CheckoutService> _logger;\n\n    public CheckoutService(\n        IInventoryService inventoryService,\n        IPaymentService paymentService,\n        IOrderFactory orderFactory,\n        IOrderRepository orderRepository,\n        INotificationService notificationService,\n        ILogger<CheckoutService> logger)\n    {\n        _inventoryService = inventoryService;\n        _paymentService = paymentService;\n        _orderFactory = orderFactory;\n        _orderRepository = orderRepository;\n        _notificationService = notificationService;\n        _logger = logger;\n    }\n\n    public async Task<CheckoutResult> CheckoutAsync(Cart cart, string paymentMethod)\n    {\n        try\n        {\n            // Step 1: Check inventory\n            foreach (var item in cart.Items)\n            {\n                var available = await _inventoryService.CheckAvailabilityAsync(item.ProductId, item.Quantity);\n                if (!available)\n                {\n                    return CheckoutResult.Failed($\"Product {item.ProductId} is out of stock\");\n                }\n            }\n\n            // Step 2: Reserve inventory\n            foreach (var item in cart.Items)\n            {\n                await _inventoryService.ReserveAsync(item.ProductId, item.Quantity);\n            }\n\n            // Step 3: Create order\n            var order = _orderFactory.CreateOrder(cart);\n            await _orderRepository.SaveAsync(order);\n\n            // Step 4: Process payment\n            var paymentResult = await _paymentService.ProcessPaymentAsync(\n                cart.CustomerId,\n                order.Total,\n                paymentMethod);\n\n            if (!paymentResult.Success)\n            {\n                // Rollback inventory\n                foreach (var item in cart.Items)\n                {\n                    await _inventoryService.ReleaseAsync(item.ProductId, item.Quantity);\n                }\n\n                await _orderRepository.UpdateStatusAsync(order.Id, \"PaymentFailed\");\n                await _notificationService.SendPaymentFailureAsync(cart.CustomerId, paymentResult.ErrorMessage);\n\n                return CheckoutResult.Failed(paymentResult.ErrorMessage);\n            }\n\n            // Step 5: Confirm order\n            await _orderRepository.UpdateStatusAsync(order.Id, \"Confirmed\");\n            await _notificationService.SendOrderConfirmationAsync(order);\n\n            _logger.LogInformation($\"Checkout completed for order {order.Id}\");\n\n            return CheckoutResult.Success(order.Id);\n        }\n        catch (Exception ex)\n        {\n            _logger.LogError(ex, \"Checkout failed\");\n            throw;\n        }\n    }\n}\n\npublic class CheckoutResult\n{\n    public bool Success { get; set; }\n    public string OrderId { get; set; }\n    public string ErrorMessage { get; set; }\n\n    public static CheckoutResult Success(string orderId) =>\n        new() { Success = true, OrderId = orderId };\n\n    public static CheckoutResult Failed(string message) =>\n        new() { Success = false, ErrorMessage = message };\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Total Exercises: 25+"
      },
      {
        "type": "text",
        "content": "Each refactoring demonstrates how SRP makes code more maintainable, testable, and easier to change. Remember: a class should have only one reason to change!"
      }
    ],
    "category": "practice",
    "topic": "S Single Responsibility Principle Exercises",
    "topicId": "s-single-responsibility-principle-exercises",
    "source": "practice/SOLID/S-Single-Responsibility-Principle-Exercises.md",
    "id": "card-88"
  },
  {
    "question": "Compare Clean Architecture, DDD, and Vertical Slice architecture in one paragraph.",
    "answer": [
      {
        "type": "text",
        "content": "Clean Architecture is a dependency rule and layering approach that keeps the Domain independent. DDD is a modeling approach that defines bounded contexts and aggregates to reflect the business. Vertical slices organize code by use case to keep changes localized. They can be combined: DDD shapes the Domain, vertical slices organize the Application layer, and Clean Architecture defines dependency flow."
      }
    ],
    "category": "practice",
    "topic": "Solution Architecture Exercises",
    "topicId": "solution-architecture-exercises",
    "source": "practice/solution-architecture-exercises.md",
    "id": "card-89"
  },
  {
    "question": "You are building a trading order management API with evolving rules and multiple integrations. Which solution architecture would you choose and why?",
    "answer": [
      {
        "type": "text",
        "content": "Use Clean Architecture with DDD in the Domain. It isolates business rules from infrastructure and allows swapping integrations (brokers, databases). Organize Application by vertical slices to keep use cases cohesive and testable."
      }
    ],
    "category": "practice",
    "topic": "Solution Architecture Exercises",
    "topicId": "solution-architecture-exercises",
    "source": "practice/solution-architecture-exercises.md",
    "id": "card-90"
  },
  {
    "question": "You are building a desktop trading terminal (WPF). Which pattern do you apply for the UI and why?",
    "answer": [
      {
        "type": "text",
        "content": "MVVM. It separates UI from behavior, enables binding, and supports unit testing for view models."
      }
    ],
    "category": "practice",
    "topic": "Solution Architecture Exercises",
    "topicId": "solution-architecture-exercises",
    "source": "practice/solution-architecture-exercises.md",
    "id": "card-91"
  },
  {
    "question": "Draft a vertical slice folder layout for a \"CancelOrder\" use case.",
    "answer": [
      {
        "type": "text",
        "content": "A:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "Application/\n  Orders/\n    CancelOrder/\n      CancelOrderCommand.cs\n      CancelOrderHandler.cs\n      CancelOrderValidator.cs\n      CancelOrderResult.cs",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Solution Architecture Exercises",
    "topicId": "solution-architecture-exercises",
    "source": "practice/solution-architecture-exercises.md",
    "id": "card-92"
  },
  {
    "question": "Identify the bounded contexts for a trading platform and list one aggregate per context.",
    "answer": [
      {
        "type": "text",
        "content": "A:"
      },
      {
        "type": "list",
        "items": [
          "Orders Context: Aggregate = Order",
          "Risk Context: Aggregate = RiskLimit",
          "Pricing Context: Aggregate = Quote",
          "Accounts Context: Aggregate = Account"
        ]
      }
    ],
    "category": "practice",
    "topic": "Solution Architecture Exercises",
    "topicId": "solution-architecture-exercises",
    "source": "practice/solution-architecture-exercises.md",
    "id": "card-93"
  },
  {
    "question": "Write a simple MVVM ViewModel for placing an order.",
    "answer": [
      {
        "type": "text",
        "content": "A:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public sealed class PlaceOrderViewModel : INotifyPropertyChanged\n{\n    private string _symbol = string.Empty;\n    private decimal _quantity;\n\n    public string Symbol\n    {\n        get => _symbol;\n        set { _symbol = value; OnPropertyChanged(nameof(Symbol)); }\n    }\n\n    public decimal Quantity\n    {\n        get => _quantity;\n        set { _quantity = value; OnPropertyChanged(nameof(Quantity)); }\n    }\n\n    public ICommand PlaceOrderCommand { get; }\n\n    public PlaceOrderViewModel(IOrderService orderService)\n    {\n        PlaceOrderCommand = new RelayCommand(() => orderService.Place(Symbol, Quantity));\n    }\n\n    public event PropertyChangedEventHandler? PropertyChanged;\n    private void OnPropertyChanged(string name) =>\n        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Solution Architecture Exercises",
    "topicId": "solution-architecture-exercises",
    "source": "practice/solution-architecture-exercises.md",
    "id": "card-94"
  },
  {
    "question": "What do you lose if you over-abstract Clean Architecture in a small app?",
    "answer": [
      {
        "type": "text",
        "content": "You add unnecessary layers, projects, and interfaces that slow delivery and make debugging harder without real benefits."
      }
    ],
    "category": "practice",
    "topic": "Solution Architecture Exercises",
    "topicId": "solution-architecture-exercises",
    "source": "practice/solution-architecture-exercises.md",
    "id": "card-95"
  },
  {
    "question": "How do you avoid a shared kernel becoming a dependency sink in DDD?",
    "answer": [
      {
        "type": "text",
        "content": "Keep the shared kernel tiny and stable, focused only on truly shared concepts (e.g., Money, Currency). Everything else stays in each bounded context."
      }
    ],
    "category": "practice",
    "topic": "Solution Architecture Exercises",
    "topicId": "solution-architecture-exercises",
    "source": "practice/solution-architecture-exercises.md",
    "id": "card-96"
  },
  {
    "question": "Your team wants to add a new pricing rule without touching API controllers. Where should the change go in Clean Architecture?",
    "answer": [
      {
        "type": "text",
        "content": "Inside the Domain (entity or domain service) or Application (use case orchestration) layer, never in the API layer."
      },
      {
        "type": "text",
        "content": "Total Exercises: 10+"
      }
    ],
    "category": "practice",
    "topic": "Solution Architecture Exercises",
    "topicId": "solution-architecture-exercises",
    "source": "practice/solution-architecture-exercises.md",
    "id": "card-97"
  },
  {
    "question": "What is the core difference between SSE and WebSockets?",
    "answer": [
      {
        "type": "text",
        "content": "SSE is unidirectional (server to client) over HTTP, while WebSockets are full-duplex (bi-directional) over a persistent TCP connection."
      }
    ],
    "category": "practice",
    "topic": "Sse Vs Websockets Exercises",
    "topicId": "sse-vs-websockets-exercises",
    "source": "practice/sse-vs-websockets-exercises.md",
    "id": "card-98"
  },
  {
    "question": "When is SSE a better choice than WebSockets?",
    "answer": [
      {
        "type": "text",
        "content": "When the client only needs server updates, such as price ticks, notifications, or progress streams. SSE is simpler and works well with standard HTTP infrastructure."
      }
    ],
    "category": "practice",
    "topic": "Sse Vs Websockets Exercises",
    "topicId": "sse-vs-websockets-exercises",
    "source": "practice/sse-vs-websockets-exercises.md",
    "id": "card-99"
  },
  {
    "question": "Implement a simple SSE endpoint that streams prices every second.",
    "answer": [
      {
        "type": "text",
        "content": "A:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "app.MapGet(\"/stream\", async context =>\n{\n    context.Response.Headers.Append(\"Content-Type\", \"text/event-stream\");\n    context.Response.Headers.Append(\"Cache-Control\", \"no-cache\");\n\n    var ct = context.RequestAborted;\n    while (!ct.IsCancellationRequested)\n    {\n        var price = new { Symbol = \"EURUSD\", Bid = 1.1021m, Ask = 1.1023m };\n        await context.Response.WriteAsync($\"data: {JsonSerializer.Serialize(price)}\\n\\n\", ct);\n        await context.Response.Body.FlushAsync(ct);\n        await Task.Delay(TimeSpan.FromSeconds(1), ct);\n    }\n});",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Sse Vs Websockets Exercises",
    "topicId": "sse-vs-websockets-exercises",
    "source": "practice/sse-vs-websockets-exercises.md",
    "id": "card-100"
  },
  {
    "question": "Add a heartbeat to keep SSE connections alive.",
    "answer": [
      {
        "type": "text",
        "content": "Send a comment line every 15-30 seconds:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "await context.Response.WriteAsync(\": ping\\n\\n\", ct);\nawait context.Response.Body.FlushAsync(ct);",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Sse Vs Websockets Exercises",
    "topicId": "sse-vs-websockets-exercises",
    "source": "practice/sse-vs-websockets-exercises.md",
    "id": "card-101"
  },
  {
    "question": "You need a trading terminal where clients submit orders and receive execution updates in real time. Which transport do you choose?",
    "answer": [
      {
        "type": "text",
        "content": "WebSockets. The client needs bi-directional communication and low-latency interaction."
      }
    ],
    "category": "practice",
    "topic": "Sse Vs Websockets Exercises",
    "topicId": "sse-vs-websockets-exercises",
    "source": "practice/sse-vs-websockets-exercises.md",
    "id": "card-102"
  },
  {
    "question": "How do you scale WebSockets behind a load balancer?",
    "answer": [
      {
        "type": "text",
        "content": "Use sticky sessions or a WebSocket-aware load balancer, keep connection state external (Redis), and design reconnect logic with session resumption."
      }
    ],
    "category": "practice",
    "topic": "Sse Vs Websockets Exercises",
    "topicId": "sse-vs-websockets-exercises",
    "source": "practice/sse-vs-websockets-exercises.md",
    "id": "card-103"
  },
  {
    "question": "Your SSE stream stops after a few minutes in production. What do you check?",
    "answer": [
      {
        "type": "text",
        "content": "Idle timeouts, proxies closing long-lived HTTP connections, missing heartbeat, and missing Cache-Control: no-cache or response buffering in reverse proxies."
      },
      {
        "type": "text",
        "content": "Total Exercises: 8+"
      }
    ],
    "category": "practice",
    "topic": "Sse Vs Websockets Exercises",
    "topicId": "sse-vs-websockets-exercises",
    "source": "practice/sse-vs-websockets-exercises.md",
    "id": "card-104"
  },
  {
    "question": "Describe the ASP.NET Core middleware pipeline for a request hitting an authenticated endpoint with custom exception handling.",
    "answer": [
      {
        "type": "text",
        "content": "Typical order: UseRouting → auth middleware → custom exception handling (usually early) → UseAuthentication/UseAuthorization → endpoint execution. Static file middleware, response compression, and caching can be interleaved before routing. Include correlation logging, caching, validation, and telemetry instrumentation."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "app.UseMiddleware<CorrelationMiddleware>();\napp.UseMiddleware<ExceptionHandlingMiddleware>();\napp.UseRouting();\napp.UseAuthentication();\napp.UseAuthorization();\napp.MapControllers();",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when building consistent request handling. Avoid when for minimal APIs you might use delegate pipeline but still similar."
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-105"
  },
  {
    "question": "How do you implement API versioning and backward compatibility?",
    "answer": [
      {
        "type": "text",
        "content": "Strategies: URL segment (/v1/), header, query string. Use Asp.Versioning package."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "services.AddApiVersioning(options =>\n{\n    options.DefaultApiVersion = new ApiVersion(1, 0);\n    options.AssumeDefaultVersionWhenUnspecified = true;\n    options.ReportApiVersions = true;\n});\nservices.AddVersionedApiExplorer();",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when breaking changes; maintain backward compatibility by keeping old controllers. Avoid when internal services with clients you control; choose contract-first to avoid version explosion."
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-106"
  },
  {
    "question": "Discuss strategies for rate limiting and request throttling.",
    "answer": [
      {
        "type": "text",
        "content": "Use ASP.NET rate limiting middleware or gateway. Techniques: token bucket, fixed window, sliding window."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "services.AddRateLimiter(options =>\n{\n    options.AddFixedWindowLimiter(\"per-account\", opt =>\n    {\n        opt.Window = TimeSpan.FromMinutes(1);\n        opt.PermitLimit = 60;\n        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;\n        opt.QueueLimit = 20;\n    });\n});\n\napp.UseRateLimiter();",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when protecting downstream resources. Avoid when latency-critical internal traffic; consider other forms of protection."
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-107"
  },
  {
    "question": "How would you log correlation IDs across services and propagate them to downstream dependencies?",
    "answer": [
      {
        "type": "text",
        "content": "Generate ID in middleware, add to headers/log context, forward via HttpClient. Ensure asynchronous logging frameworks flow the correlation ID across threads (e.g., using AsyncLocal)."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "context.TraceIdentifier = context.TraceIdentifier ?? Guid.NewGuid().ToString();\n_logger.LogInformation(\"{CorrelationId} handling {Path}\", context.TraceIdentifier, context.Request.Path);\nhttpClient.DefaultRequestHeaders.Add(\"X-Correlation-ID\", context.TraceIdentifier);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when need distributed tracing. Avoid when truly isolated services—rare."
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-108"
  },
  {
    "question": "Explain the difference between Transient, Scoped, and Singleton dependency injection lifetimes.",
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
          "Avoid injecting a Scoped service into a Singleton - the scoped service may be captured incorrectly leading to unintended shared state or runtime errors.",
          "Transient is good for lightweight, stateless services; it can be used when you explicitly want fresh instances."
        ]
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-109"
  },
  {
    "question": "Create custom middleware that validates API keys from request headers.",
    "answer": [
      {
        "type": "text",
        "content": "Implement middleware with authentication logic."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class ApiKeyMiddleware\n{\n    private readonly RequestDelegate _next;\n    private readonly IConfiguration _configuration;\n\n    public ApiKeyMiddleware(RequestDelegate next, IConfiguration configuration)\n    {\n        _next = next;\n        _configuration = configuration;\n    }\n\n    public async Task InvokeAsync(HttpContext context)\n    {\n        if (!context.Request.Headers.TryGetValue(\"X-Api-Key\", out var extractedApiKey))\n        {\n            context.Response.StatusCode = 401;\n            await context.Response.WriteAsync(\"API Key missing\");\n            return;\n        }\n\n        var apiKey = _configuration.GetValue<string>(\"ApiKey\");\n        if (!apiKey.Equals(extractedApiKey))\n        {\n            context.Response.StatusCode = 401;\n            await context.Response.WriteAsync(\"Invalid API Key\");\n            return;\n        }\n\n        await _next(context);\n    }\n}\n\n// Register middleware\napp.UseMiddleware<ApiKeyMiddleware>();",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-110"
  },
  {
    "question": "Implement global exception handling middleware that returns consistent error responses.",
    "answer": [
      {
        "type": "text",
        "content": "Create middleware that catches exceptions and formats responses."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class ExceptionHandlingMiddleware\n{\n    private readonly RequestDelegate _next;\n    private readonly ILogger<ExceptionHandlingMiddleware> _logger;\n\n    public ExceptionHandlingMiddleware(\n        RequestDelegate next,\n        ILogger<ExceptionHandlingMiddleware> logger)\n    {\n        _next = next;\n        _logger = logger;\n    }\n\n    public async Task InvokeAsync(HttpContext context)\n    {\n        try\n        {\n            await _next(context);\n        }\n        catch (ValidationException ex)\n        {\n            _logger.LogWarning(ex, \"Validation error occurred\");\n            await HandleExceptionAsync(context, ex, StatusCodes.Status400BadRequest);\n        }\n        catch (NotFoundException ex)\n        {\n            _logger.LogWarning(ex, \"Resource not found\");\n            await HandleExceptionAsync(context, ex, StatusCodes.Status404NotFound);\n        }\n        catch (Exception ex)\n        {\n            _logger.LogError(ex, \"Unhandled exception occurred\");\n            await HandleExceptionAsync(context, ex, StatusCodes.Status500InternalServerError);\n        }\n    }\n\n    private static async Task HandleExceptionAsync(\n        HttpContext context,\n        Exception exception,\n        int statusCode)\n    {\n        context.Response.ContentType = \"application/json\";\n        context.Response.StatusCode = statusCode;\n\n        var response = new ErrorResponse\n        {\n            StatusCode = statusCode,\n            Message = exception.Message,\n            TraceId = context.TraceIdentifier\n        };\n\n        await context.Response.WriteAsJsonAsync(response);\n    }\n}\n\npublic record ErrorResponse\n{\n    public int StatusCode { get; init; }\n    public string Message { get; init; }\n    public string TraceId { get; init; }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-111"
  },
  {
    "question": "Design a health check endpoint that verifies database connectivity, external API availability, and cache status.",
    "answer": [
      {
        "type": "text",
        "content": "Use ASP.NET Core health checks with custom checks."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Custom health check\npublic class DatabaseHealthCheck : IHealthCheck\n{\n    private readonly DbContext _dbContext;\n\n    public DatabaseHealthCheck(DbContext dbContext)\n    {\n        _dbContext = dbContext;\n    }\n\n    public async Task<HealthCheckResult> CheckHealthAsync(\n        HealthCheckContext context,\n        CancellationToken cancellationToken = default)\n    {\n        try\n        {\n            await _dbContext.Database.CanConnectAsync(cancellationToken);\n            return HealthCheckResult.Healthy(\"Database is reachable\");\n        }\n        catch (Exception ex)\n        {\n            return HealthCheckResult.Unhealthy(\"Database is unreachable\", ex);\n        }\n    }\n}\n\n// Startup configuration\nbuilder.Services.AddHealthChecks()\n    .AddCheck<DatabaseHealthCheck>(\"database\")\n    .AddUrlGroup(new Uri(\"https://api.example.com/health\"), \"external-api\")\n    .AddRedis(connectionString, \"cache\");\n\napp.MapHealthChecks(\"/health\", new HealthCheckOptions\n{\n    ResponseWriter = async (context, report) =>\n    {\n        context.Response.ContentType = \"application/json\";\n        var result = JsonSerializer.Serialize(new\n        {\n            status = report.Status.ToString(),\n            checks = report.Entries.Select(e => new\n            {\n                name = e.Key,\n                status = e.Value.Status.ToString(),\n                description = e.Value.Description,\n                duration = e.Value.Duration.TotalMilliseconds\n            }),\n            totalDuration = report.TotalDuration.TotalMilliseconds\n        });\n        await context.Response.WriteAsync(result);\n    }\n});",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-112"
  },
  {
    "question": "Implement request/response logging middleware with performance tracking.",
    "answer": [
      {
        "type": "text",
        "content": "Create middleware that logs request details and timing."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class RequestLoggingMiddleware\n{\n    private readonly RequestDelegate _next;\n    private readonly ILogger<RequestLoggingMiddleware> _logger;\n\n    public RequestLoggingMiddleware(\n        RequestDelegate next,\n        ILogger<RequestLoggingMiddleware> logger)\n    {\n        _next = next;\n        _logger = logger;\n    }\n\n    public async Task InvokeAsync(HttpContext context)\n    {\n        var sw = Stopwatch.StartNew();\n        var correlationId = context.TraceIdentifier;\n\n        // Log request\n        _logger.LogInformation(\n            \"[{CorrelationId}] Request {Method} {Path} started\",\n            correlationId,\n            context.Request.Method,\n            context.Request.Path);\n\n        // Capture response body\n        var originalBodyStream = context.Response.Body;\n        using var responseBody = new MemoryStream();\n        context.Response.Body = responseBody;\n\n        try\n        {\n            await _next(context);\n\n            sw.Stop();\n\n            // Log response\n            _logger.LogInformation(\n                \"[{CorrelationId}] Request {Method} {Path} completed with {StatusCode} in {ElapsedMs}ms\",\n                correlationId,\n                context.Request.Method,\n                context.Request.Path,\n                context.Response.StatusCode,\n                sw.ElapsedMilliseconds);\n        }\n        catch (Exception ex)\n        {\n            sw.Stop();\n            _logger.LogError(\n                ex,\n                \"[{CorrelationId}] Request {Method} {Path} failed after {ElapsedMs}ms\",\n                correlationId,\n                context.Request.Method,\n                context.Request.Path,\n                sw.ElapsedMilliseconds);\n            throw;\n        }\n        finally\n        {\n            responseBody.Seek(0, SeekOrigin.Begin);\n            await responseBody.CopyToAsync(originalBodyStream);\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-113"
  },
  {
    "question": "Create a minimal API health endpoint with dependency injection.",
    "answer": [
      {
        "type": "text",
        "content": "Expose a /health endpoint in a minimal API that reports 200 when a price feed is connected, otherwise 503."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var builder = WebApplication.CreateBuilder(args);\nbuilder.Services.AddSingleton<IPriceFeed, PriceFeed>();\nvar app = builder.Build();\n\napp.MapGet(\"/health\", (IPriceFeed feed) => feed.IsConnected\n    ? Results.Ok(new { status = \"ok\" })\n    : Results.StatusCode(StatusCodes.Status503ServiceUnavailable));\n\nawait app.RunAsync();",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Notes: Mapping the health check keeps the app's composition root small. Consider adding UseHealthChecks or custom readiness/liveness probes for Kubernetes deployments."
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-114"
  },
  {
    "question": "Implement middleware that enforces request size limits and prevents large payload attacks.",
    "answer": [
      {
        "type": "text",
        "content": "Create middleware with request body size validation."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class RequestSizeLimitMiddleware\n{\n    private readonly RequestDelegate _next;\n    private readonly long _maxRequestBodySize;\n\n    public RequestSizeLimitMiddleware(RequestDelegate next, long maxRequestBodySize)\n    {\n        _next = next;\n        _maxRequestBodySize = maxRequestBodySize;\n    }\n\n    public async Task InvokeAsync(HttpContext context)\n    {\n        if (context.Request.ContentLength.HasValue &&\n            context.Request.ContentLength.Value > _maxRequestBodySize)\n        {\n            context.Response.StatusCode = StatusCodes.Status413PayloadTooLarge;\n            await context.Response.WriteAsync(\n                $\"Request body too large. Maximum size: {_maxRequestBodySize} bytes\");\n            return;\n        }\n\n        // Wrap the request body stream\n        var originalBody = context.Request.Body;\n        try\n        {\n            using var limitedStream = new LimitedStream(originalBody, _maxRequestBodySize);\n            context.Request.Body = limitedStream;\n            await _next(context);\n        }\n        catch (InvalidOperationException) when (context.Response.StatusCode == 413)\n        {\n            // Stream limit exceeded during reading\n            return;\n        }\n        finally\n        {\n            context.Request.Body = originalBody;\n        }\n    }\n}\n\npublic class LimitedStream : Stream\n{\n    private readonly Stream _innerStream;\n    private readonly long _maxLength;\n    private long _totalBytesRead;\n\n    public LimitedStream(Stream innerStream, long maxLength)\n    {\n        _innerStream = innerStream;\n        _maxLength = maxLength;\n    }\n\n    public override async Task<int> ReadAsync(\n        byte[] buffer,\n        int offset,\n        int count,\n        CancellationToken cancellationToken)\n    {\n        var bytesRead = await _innerStream.ReadAsync(buffer, offset, count, cancellationToken);\n        _totalBytesRead += bytesRead;\n\n        if (_totalBytesRead > _maxLength)\n        {\n            throw new InvalidOperationException(\"Request body size limit exceeded\");\n        }\n\n        return bytesRead;\n    }\n\n    // Implement other required Stream members...\n    public override bool CanRead => _innerStream.CanRead;\n    public override bool CanSeek => false;\n    public override bool CanWrite => false;\n    public override long Length => throw new NotSupportedException();\n    public override long Position\n    {\n        get => throw new NotSupportedException();\n        set => throw new NotSupportedException();\n    }\n    public override void Flush() { }\n    public override int Read(byte[] buffer, int offset, int count) =>\n        throw new NotSupportedException(\"Use ReadAsync\");\n    public override long Seek(long offset, SeekOrigin origin) =>\n        throw new NotSupportedException();\n    public override void SetLength(long value) =>\n        throw new NotSupportedException();\n    public override void Write(byte[] buffer, int offset, int count) =>\n        throw new NotSupportedException();\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-115"
  },
  {
    "question": "Design a dependency injection container configuration that uses factory patterns for complex object creation.",
    "answer": [
      {
        "type": "text",
        "content": "Implement factory-based DI registration."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Service interface and implementation\npublic interface IOrderService\n{\n    Task ProcessOrderAsync(Order order);\n}\n\npublic class OrderService : IOrderService\n{\n    private readonly IPaymentGateway _paymentGateway;\n    private readonly IInventoryService _inventory;\n    private readonly string _merchantId;\n\n    public OrderService(\n        IPaymentGateway paymentGateway,\n        IInventoryService inventory,\n        string merchantId)\n    {\n        _paymentGateway = paymentGateway;\n        _inventory = inventory;\n        _merchantId = merchantId;\n    }\n\n    public async Task ProcessOrderAsync(Order order)\n    {\n        // Implementation\n    }\n}\n\n// Factory interface\npublic interface IOrderServiceFactory\n{\n    IOrderService Create(string merchantId);\n}\n\n// Factory implementation\npublic class OrderServiceFactory : IOrderServiceFactory\n{\n    private readonly IPaymentGateway _paymentGateway;\n    private readonly IInventoryService _inventory;\n\n    public OrderServiceFactory(\n        IPaymentGateway paymentGateway,\n        IInventoryService inventory)\n    {\n        _paymentGateway = paymentGateway;\n        _inventory = inventory;\n    }\n\n    public IOrderService Create(string merchantId)\n    {\n        return new OrderService(_paymentGateway, _inventory, merchantId);\n    }\n}\n\n// Registration\nservices.AddScoped<IPaymentGateway, PaymentGateway>();\nservices.AddScoped<IInventoryService, InventoryService>();\nservices.AddScoped<IOrderServiceFactory, OrderServiceFactory>();\n\n// Usage in controller\npublic class OrdersController : ControllerBase\n{\n    private readonly IOrderServiceFactory _factory;\n\n    public OrdersController(IOrderServiceFactory factory)\n    {\n        _factory = factory;\n    }\n\n    [HttpPost]\n    public async Task<IActionResult> CreateOrder([FromBody] OrderDto dto)\n    {\n        var orderService = _factory.Create(dto.MerchantId);\n        await orderService.ProcessOrderAsync(dto.ToOrder());\n        return Ok();\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-116"
  },
  {
    "question": "Implement multi-tenant support using scoped service provider per tenant.",
    "answer": [
      {
        "type": "text",
        "content": "Create tenant resolution and scoped services."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface ITenantService\n{\n    string GetCurrentTenantId();\n}\n\npublic class TenantService : ITenantService\n{\n    private readonly IHttpContextAccessor _httpContextAccessor;\n\n    public TenantService(IHttpContextAccessor httpContextAccessor)\n    {\n        _httpContextAccessor = httpContextAccessor;\n    }\n\n    public string GetCurrentTenantId()\n    {\n        // Extract from subdomain, header, or claim\n        var context = _httpContextAccessor.HttpContext;\n        if (context.Request.Headers.TryGetValue(\"X-Tenant-Id\", out var tenantId))\n        {\n            return tenantId;\n        }\n\n        // Or from subdomain\n        var host = context.Request.Host.Host;\n        var parts = host.Split('.');\n        return parts.Length > 2 ? parts[0] : \"default\";\n    }\n}\n\npublic class TenantDbContext : DbContext\n{\n    private readonly ITenantService _tenantService;\n\n    public TenantDbContext(\n        DbContextOptions<TenantDbContext> options,\n        ITenantService tenantService)\n        : base(options)\n    {\n        _tenantService = tenantService;\n    }\n\n    protected override void OnModelCreating(ModelBuilder modelBuilder)\n    {\n        // Add global query filter for tenant isolation\n        modelBuilder.Entity<Order>()\n            .HasQueryFilter(o => o.TenantId == _tenantService.GetCurrentTenantId());\n\n        modelBuilder.Entity<Customer>()\n            .HasQueryFilter(c => c.TenantId == _tenantService.GetCurrentTenantId());\n    }\n\n    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)\n    {\n        // Automatically set TenantId on new entities\n        var tenantId = _tenantService.GetCurrentTenantId();\n        var entries = ChangeTracker.Entries()\n            .Where(e => e.State == EntityState.Added &&\n                       e.Entity is ITenantEntity);\n\n        foreach (var entry in entries)\n        {\n            ((ITenantEntity)entry.Entity).TenantId = tenantId;\n        }\n\n        return base.SaveChangesAsync(cancellationToken);\n    }\n}\n\n// Registration\nservices.AddHttpContextAccessor();\nservices.AddScoped<ITenantService, TenantService>();\nservices.AddDbContext<TenantDbContext>();",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-117"
  },
  {
    "question": "Create request validation middleware using FluentValidation.",
    "answer": [
      {
        "type": "text",
        "content": "Implement automatic model validation."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class ValidationMiddleware\n{\n    private readonly RequestDelegate _next;\n\n    public ValidationMiddleware(RequestDelegate next)\n    {\n        _next = next;\n    }\n\n    public async Task InvokeAsync(HttpContext context, IServiceProvider serviceProvider)\n    {\n        // Only validate POST/PUT requests\n        if (context.Request.Method != \"POST\" && context.Request.Method != \"PUT\")\n        {\n            await _next(context);\n            return;\n        }\n\n        var endpoint = context.GetEndpoint();\n        if (endpoint == null)\n        {\n            await _next(context);\n            return;\n        }\n\n        // Get the endpoint metadata to find request type\n        var metadata = endpoint.Metadata.GetMetadata<ValidatableRequestAttribute>();\n        if (metadata == null)\n        {\n            await _next(context);\n            return;\n        }\n\n        // Read and deserialize request body\n        context.Request.EnableBuffering();\n        var body = await new StreamReader(context.Request.Body).ReadToEndAsync();\n        context.Request.Body.Position = 0;\n\n        var requestType = metadata.RequestType;\n        var request = JsonSerializer.Deserialize(body, requestType);\n\n        // Get validator from DI\n        var validatorType = typeof(IValidator<>).MakeGenericType(requestType);\n        var validator = serviceProvider.GetService(validatorType) as IValidator;\n\n        if (validator != null)\n        {\n            var validationContext = new ValidationContext<object>(request);\n            var validationResult = await validator.ValidateAsync(validationContext);\n\n            if (!validationResult.IsValid)\n            {\n                context.Response.StatusCode = StatusCodes.Status400BadRequest;\n                await context.Response.WriteAsJsonAsync(new\n                {\n                    errors = validationResult.Errors.Select(e => new\n                    {\n                        property = e.PropertyName,\n                        message = e.ErrorMessage\n                    })\n                });\n                return;\n            }\n        }\n\n        await _next(context);\n    }\n}\n\n[AttributeUsage(AttributeTargets.Method)]\npublic class ValidatableRequestAttribute : Attribute\n{\n    public Type RequestType { get; }\n\n    public ValidatableRequestAttribute(Type requestType)\n    {\n        RequestType = requestType;\n    }\n}\n\n// Usage in controller\n[HttpPost]\n[ValidatableRequest(typeof(CreateOrderRequest))]\npublic async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)\n{\n    // Validation already done by middleware\n    return Ok();\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-118"
  },
  {
    "question": "Implement authentication with multiple schemes (JWT + API Key).",
    "answer": [
      {
        "type": "text",
        "content": "Configure multiple authentication schemes."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class ApiKeyAuthenticationHandler : AuthenticationHandler<ApiKeyAuthenticationOptions>\n{\n    private readonly IConfiguration _configuration;\n\n    public ApiKeyAuthenticationHandler(\n        IOptionsMonitor<ApiKeyAuthenticationOptions> options,\n        ILoggerFactory logger,\n        UrlEncoder encoder,\n        ISystemClock clock,\n        IConfiguration configuration)\n        : base(options, logger, encoder, clock)\n    {\n        _configuration = configuration;\n    }\n\n    protected override Task<AuthenticateResult> HandleAuthenticateAsync()\n    {\n        if (!Request.Headers.TryGetValue(\"X-Api-Key\", out var apiKeyHeaderValues))\n        {\n            return Task.FromResult(AuthenticateResult.NoResult());\n        }\n\n        var providedApiKey = apiKeyHeaderValues.FirstOrDefault();\n        var validApiKey = _configuration[\"ApiKey\"];\n\n        if (string.IsNullOrWhiteSpace(providedApiKey) || providedApiKey != validApiKey)\n        {\n            return Task.FromResult(AuthenticateResult.Fail(\"Invalid API Key\"));\n        }\n\n        var claims = new[]\n        {\n            new Claim(ClaimTypes.Name, \"ApiKeyUser\"),\n            new Claim(\"ApiKey\", providedApiKey)\n        };\n\n        var identity = new ClaimsIdentity(claims, Scheme.Name);\n        var principal = new ClaimsPrincipal(identity);\n        var ticket = new AuthenticationTicket(principal, Scheme.Name);\n\n        return Task.FromResult(AuthenticateResult.Success(ticket));\n    }\n}\n\npublic class ApiKeyAuthenticationOptions : AuthenticationSchemeOptions\n{\n}\n\n// Startup configuration\nservices.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)\n    .AddJwtBearer(options =>\n    {\n        options.TokenValidationParameters = new TokenValidationParameters\n        {\n            ValidateIssuer = true,\n            ValidIssuer = \"https://issuer.example.com\",\n            ValidateAudience = true,\n            ValidAudience = \"trading-api\",\n            ValidateLifetime = true,\n            ClockSkew = TimeSpan.FromMinutes(1),\n            ValidateIssuerSigningKey = true,\n            IssuerSigningKey = new SymmetricSecurityKey(\n                Encoding.UTF8.GetBytes(configuration[\"Jwt:SigningKey\"]))\n        };\n    })\n    .AddScheme<ApiKeyAuthenticationOptions, ApiKeyAuthenticationHandler>(\n        \"ApiKey\",\n        options => { });\n\n// Configure authorization policies\nservices.AddAuthorization(options =>\n{\n    var defaultAuthBuilder = new AuthorizationPolicyBuilder(\n        JwtBearerDefaults.AuthenticationScheme,\n        \"ApiKey\");\n    defaultAuthBuilder = defaultAuthBuilder.RequireAuthenticatedUser();\n    options.DefaultPolicy = defaultAuthBuilder.Build();\n\n    // Policy for JWT only\n    options.AddPolicy(\"JwtOnly\", policy =>\n        policy.RequireAuthenticatedUser()\n              .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme));\n\n    // Policy for API Key only\n    options.AddPolicy(\"ApiKeyOnly\", policy =>\n        policy.RequireAuthenticatedUser()\n              .AddAuthenticationSchemes(\"ApiKey\"));\n});\n\n// Usage in controller\n[Authorize(Policy = \"JwtOnly\")]\npublic class SecureController : ControllerBase\n{\n}\n\n[Authorize(Policy = \"ApiKeyOnly\")]\npublic class ApiController : ControllerBase\n{\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-119"
  },
  {
    "question": "Implement a custom rate limiting policy based on user subscription tier.",
    "answer": [
      {
        "type": "text",
        "content": "Create custom rate limiter with different limits per tier."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TieredRateLimiterPolicy : IRateLimiterPolicy<string>\n{\n    private readonly IHttpContextAccessor _httpContextAccessor;\n\n    public TieredRateLimiterPolicy(IHttpContextAccessor httpContextAccessor)\n    {\n        _httpContextAccessor = httpContextAccessor;\n    }\n\n    public Func<OnRejectedContext, CancellationToken, ValueTask>? OnRejected { get; } =\n        (context, cancellationToken) =>\n        {\n            context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;\n            return new ValueTask();\n        };\n\n    public RateLimitPartition<string> GetPartition(HttpContext httpContext)\n    {\n        // Get user tier from claims or header\n        var tier = httpContext.User.FindFirst(\"Tier\")?.Value ?? \"Free\";\n        var userId = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? \"anonymous\";\n\n        return tier switch\n        {\n            \"Premium\" => RateLimitPartition.GetFixedWindowLimiter(userId, _ =>\n                new FixedWindowRateLimiterOptions\n                {\n                    PermitLimit = 1000,\n                    Window = TimeSpan.FromMinutes(1),\n                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst,\n                    QueueLimit = 0\n                }),\n            \"Standard\" => RateLimitPartition.GetFixedWindowLimiter(userId, _ =>\n                new FixedWindowRateLimiterOptions\n                {\n                    PermitLimit = 100,\n                    Window = TimeSpan.FromMinutes(1),\n                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst,\n                    QueueLimit = 0\n                }),\n            _ => RateLimitPartition.GetFixedWindowLimiter(userId, _ =>\n                new FixedWindowRateLimiterOptions\n                {\n                    PermitLimit = 10,\n                    Window = TimeSpan.FromMinutes(1),\n                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst,\n                    QueueLimit = 0\n                })\n        };\n    }\n}\n\n// Registration\nservices.AddHttpContextAccessor();\nservices.AddRateLimiter(options =>\n{\n    options.AddPolicy<string, TieredRateLimiterPolicy>(\"tiered\");\n});\n\n// Usage\napp.MapGet(\"/api/data\", () => Results.Ok(\"Data\"))\n   .RequireRateLimiting(\"tiered\");",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-120"
  },
  {
    "question": "Create a distributed rate limiter using Redis.",
    "answer": [
      {
        "type": "text",
        "content": "Implement Redis-based rate limiting."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class RedisRateLimiter\n{\n    private readonly IConnectionMultiplexer _redis;\n    private readonly ILogger<RedisRateLimiter> _logger;\n\n    public RedisRateLimiter(\n        IConnectionMultiplexer redis,\n        ILogger<RedisRateLimiter> logger)\n    {\n        _redis = redis;\n        _logger = logger;\n    }\n\n    public async Task<bool> AllowRequestAsync(\n        string key,\n        int maxRequests,\n        TimeSpan window)\n    {\n        var db = _redis.GetDatabase();\n        var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();\n        var windowStart = now - (long)window.TotalSeconds;\n\n        var transaction = db.CreateTransaction();\n\n        // Remove old entries\n        var removeTask = transaction.SortedSetRemoveRangeByScoreAsync(\n            key,\n            double.NegativeInfinity,\n            windowStart);\n\n        // Add current request\n        var addTask = transaction.SortedSetAddAsync(key, now, now);\n\n        // Get count\n        var countTask = transaction.SortedSetLengthAsync(key);\n\n        // Set expiry\n        var expireTask = transaction.KeyExpireAsync(key, window);\n\n        var executed = await transaction.ExecuteAsync();\n\n        if (!executed)\n        {\n            _logger.LogWarning(\"Rate limit transaction failed for key: {Key}\", key);\n            return false;\n        }\n\n        var count = await countTask;\n        return count <= maxRequests;\n    }\n\n    public async Task<RateLimitInfo> GetRateLimitInfoAsync(\n        string key,\n        int maxRequests,\n        TimeSpan window)\n    {\n        var db = _redis.GetDatabase();\n        var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();\n        var windowStart = now - (long)window.TotalSeconds;\n\n        var count = await db.SortedSetLengthAsync(\n            key,\n            windowStart,\n            double.PositiveInfinity);\n\n        var remaining = Math.Max(0, maxRequests - (int)count);\n        var oldestEntry = await db.SortedSetRangeByScoreAsync(\n            key,\n            windowStart,\n            double.PositiveInfinity,\n            take: 1);\n\n        var resetTime = oldestEntry.Length > 0\n            ? DateTimeOffset.FromUnixTimeSeconds((long)oldestEntry[0]).Add(window)\n            : DateTimeOffset.UtcNow.Add(window);\n\n        return new RateLimitInfo\n        {\n            Limit = maxRequests,\n            Remaining = remaining,\n            Reset = resetTime\n        };\n    }\n}\n\npublic record RateLimitInfo\n{\n    public int Limit { get; init; }\n    public int Remaining { get; init; }\n    public DateTimeOffset Reset { get; init; }\n}\n\n// Middleware integration\npublic class RedisRateLimitMiddleware\n{\n    private readonly RequestDelegate _next;\n    private readonly RedisRateLimiter _rateLimiter;\n\n    public RedisRateLimitMiddleware(\n        RequestDelegate next,\n        RedisRateLimiter rateLimiter)\n    {\n        _next = next;\n        _rateLimiter = rateLimiter;\n    }\n\n    public async Task InvokeAsync(HttpContext context)\n    {\n        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? \"anonymous\";\n        var key = $\"rate_limit:{userId}\";\n\n        var allowed = await _rateLimiter.AllowRequestAsync(\n            key,\n            maxRequests: 100,\n            window: TimeSpan.FromMinutes(1));\n\n        if (!allowed)\n        {\n            var info = await _rateLimiter.GetRateLimitInfoAsync(\n                key,\n                maxRequests: 100,\n                window: TimeSpan.FromMinutes(1));\n\n            context.Response.Headers.Add(\"X-RateLimit-Limit\", info.Limit.ToString());\n            context.Response.Headers.Add(\"X-RateLimit-Remaining\", \"0\");\n            context.Response.Headers.Add(\"X-RateLimit-Reset\", info.Reset.ToUnixTimeSeconds().ToString());\n\n            context.Response.StatusCode = StatusCodes.Status429TooManyRequests;\n            await context.Response.WriteAsync(\"Rate limit exceeded\");\n            return;\n        }\n\n        await _next(context);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-121"
  },
  {
    "question": "Design an API gateway pattern that routes requests to different microservices based on path.",
    "answer": [
      {
        "type": "text",
        "content": "Implement simple reverse proxy with routing."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class ApiGatewayMiddleware\n{\n    private readonly RequestDelegate _next;\n    private readonly IHttpClientFactory _httpClientFactory;\n    private readonly ILogger<ApiGatewayMiddleware> _logger;\n    private readonly Dictionary<string, string> _routes;\n\n    public ApiGatewayMiddleware(\n        RequestDelegate next,\n        IHttpClientFactory httpClientFactory,\n        ILogger<ApiGatewayMiddleware> logger,\n        IConfiguration configuration)\n    {\n        _next = next;\n        _httpClientFactory = httpClientFactory;\n        _logger = logger;\n        _routes = configuration.GetSection(\"Gateway:Routes\")\n            .Get<Dictionary<string, string>>();\n    }\n\n    public async Task InvokeAsync(HttpContext context)\n    {\n        var path = context.Request.Path.Value;\n        var matchedRoute = _routes.FirstOrDefault(r => path.StartsWith(r.Key));\n\n        if (matchedRoute.Key == null)\n        {\n            await _next(context);\n            return;\n        }\n\n        var targetUrl = matchedRoute.Value + path.Substring(matchedRoute.Key.Length);\n        if (context.Request.QueryString.HasValue)\n        {\n            targetUrl += context.Request.QueryString.Value;\n        }\n\n        var httpClient = _httpClientFactory.CreateClient();\n        var requestMessage = new HttpRequestMessage\n        {\n            Method = new HttpMethod(context.Request.Method),\n            RequestUri = new Uri(targetUrl)\n        };\n\n        // Copy headers\n        foreach (var header in context.Request.Headers)\n        {\n            if (!header.Key.StartsWith(\":\") &&\n                header.Key != \"Host\" &&\n                header.Key != \"Content-Length\")\n            {\n                requestMessage.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());\n            }\n        }\n\n        // Copy body for POST/PUT\n        if (context.Request.Method == \"POST\" || context.Request.Method == \"PUT\")\n        {\n            var streamContent = new StreamContent(context.Request.Body);\n            requestMessage.Content = streamContent;\n        }\n\n        try\n        {\n            var response = await httpClient.SendAsync(\n                requestMessage,\n                HttpCompletionOption.ResponseHeadersRead,\n                context.RequestAborted);\n\n            context.Response.StatusCode = (int)response.StatusCode;\n\n            // Copy response headers\n            foreach (var header in response.Headers)\n            {\n                context.Response.Headers[header.Key] = header.Value.ToArray();\n            }\n\n            foreach (var header in response.Content.Headers)\n            {\n                context.Response.Headers[header.Key] = header.Value.ToArray();\n            }\n\n            await response.Content.CopyToAsync(context.Response.Body);\n        }\n        catch (Exception ex)\n        {\n            _logger.LogError(ex, \"Error proxying request to {TargetUrl}\", targetUrl);\n            context.Response.StatusCode = StatusCodes.Status502BadGateway;\n        }\n    }\n}\n\n// appsettings.json\n{\n  \"Gateway\": {\n    \"Routes\": {\n      \"/api/orders\": \"http://orders-service\",\n      \"/api/products\": \"http://products-service\",\n      \"/api/customers\": \"http://customers-service\"\n    }\n  }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-122"
  },
  {
    "question": "Implement request deduplication middleware using distributed cache.",
    "answer": [
      {
        "type": "text",
        "content": "Prevent duplicate requests within a time window."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class RequestDeduplicationMiddleware\n{\n    private readonly RequestDelegate _next;\n    private readonly IDistributedCache _cache;\n    private readonly ILogger<RequestDeduplicationMiddleware> _logger;\n\n    public RequestDeduplicationMiddleware(\n        RequestDelegate next,\n        IDistributedCache cache,\n        ILogger<RequestDeduplicationMiddleware> logger)\n    {\n        _next = next;\n        _cache = cache;\n        _logger = logger;\n    }\n\n    public async Task InvokeAsync(HttpContext context)\n    {\n        // Only deduplicate POST/PUT requests\n        if (context.Request.Method != \"POST\" && context.Request.Method != \"PUT\")\n        {\n            await _next(context);\n            return;\n        }\n\n        // Get idempotency key from header\n        if (!context.Request.Headers.TryGetValue(\"Idempotency-Key\", out var idempotencyKey))\n        {\n            await _next(context);\n            return;\n        }\n\n        var cacheKey = $\"idempotency:{idempotencyKey}\";\n        var cachedResponse = await _cache.GetStringAsync(cacheKey);\n\n        if (cachedResponse != null)\n        {\n            _logger.LogInformation(\n                \"Returning cached response for idempotency key: {IdempotencyKey}\",\n                idempotencyKey);\n\n            var response = JsonSerializer.Deserialize<CachedResponse>(cachedResponse);\n            context.Response.StatusCode = response.StatusCode;\n            context.Response.ContentType = response.ContentType;\n            await context.Response.WriteAsync(response.Body);\n            return;\n        }\n\n        // Capture response\n        var originalBodyStream = context.Response.Body;\n        using var responseBody = new MemoryStream();\n        context.Response.Body = responseBody;\n\n        await _next(context);\n\n        // Cache successful responses\n        if (context.Response.StatusCode >= 200 && context.Response.StatusCode < 300)\n        {\n            responseBody.Seek(0, SeekOrigin.Begin);\n            var body = await new StreamReader(responseBody).ReadToEndAsync();\n            responseBody.Seek(0, SeekOrigin.Begin);\n\n            var cachedResponseObj = new CachedResponse\n            {\n                StatusCode = context.Response.StatusCode,\n                ContentType = context.Response.ContentType,\n                Body = body\n            };\n\n            var serialized = JsonSerializer.Serialize(cachedResponseObj);\n            await _cache.SetStringAsync(\n                cacheKey,\n                serialized,\n                new DistributedCacheEntryOptions\n                {\n                    AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(24)\n                });\n\n            _logger.LogInformation(\n                \"Cached response for idempotency key: {IdempotencyKey}\",\n                idempotencyKey);\n        }\n\n        await responseBody.CopyToAsync(originalBodyStream);\n    }\n\n    private class CachedResponse\n    {\n        public int StatusCode { get; set; }\n        public string ContentType { get; set; }\n        public string Body { get; set; }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-123"
  },
  {
    "question": "Create a background service that performs periodic health checks on external dependencies.",
    "answer": [
      {
        "type": "text",
        "content": "Implement IHostedService for background monitoring."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class HealthCheckBackgroundService : BackgroundService\n{\n    private readonly IServiceProvider _serviceProvider;\n    private readonly ILogger<HealthCheckBackgroundService> _logger;\n    private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(1);\n\n    public HealthCheckBackgroundService(\n        IServiceProvider serviceProvider,\n        ILogger<HealthCheckBackgroundService> logger)\n    {\n        _serviceProvider = serviceProvider;\n        _logger = logger;\n    }\n\n    protected override async Task ExecuteAsync(CancellationToken stoppingToken)\n    {\n        _logger.LogInformation(\"Health Check Background Service started\");\n\n        while (!stoppingToken.IsCancellationRequested)\n        {\n            try\n            {\n                await PerformHealthChecksAsync(stoppingToken);\n            }\n            catch (Exception ex)\n            {\n                _logger.LogError(ex, \"Error performing health checks\");\n            }\n\n            await Task.Delay(_checkInterval, stoppingToken);\n        }\n\n        _logger.LogInformation(\"Health Check Background Service stopped\");\n    }\n\n    private async Task PerformHealthChecksAsync(CancellationToken cancellationToken)\n    {\n        using var scope = _serviceProvider.CreateScope();\n        var healthCheckService = scope.ServiceProvider\n            .GetRequiredService<HealthCheckService>();\n\n        var result = await healthCheckService.CheckHealthAsync(cancellationToken);\n\n        foreach (var entry in result.Entries)\n        {\n            if (entry.Value.Status != HealthStatus.Healthy)\n            {\n                _logger.LogWarning(\n                    \"Health check {Name} is {Status}: {Description}\",\n                    entry.Key,\n                    entry.Value.Status,\n                    entry.Value.Description);\n\n                // Could send alerts, update metrics, etc.\n            }\n        }\n\n        _logger.LogInformation(\n            \"Health check completed. Overall status: {Status}\",\n            result.Status);\n    }\n}\n\n// Registration\nservices.AddHostedService<HealthCheckBackgroundService>();",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-124"
  },
  {
    "question": "Implement resource-based authorization for multi-tenant applications.",
    "answer": [
      {
        "type": "text",
        "content": "Create authorization handlers for tenant-specific resources."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TenantAuthorizationHandler :\n    AuthorizationHandler<TenantAccessRequirement, Order>\n{\n    private readonly ITenantService _tenantService;\n\n    public TenantAuthorizationHandler(ITenantService tenantService)\n    {\n        _tenantService = tenantService;\n    }\n\n    protected override Task HandleRequirementAsync(\n        AuthorizationHandlerContext context,\n        TenantAccessRequirement requirement,\n        Order resource)\n    {\n        var currentTenantId = _tenantService.GetCurrentTenantId();\n\n        if (resource.TenantId == currentTenantId)\n        {\n            context.Succeed(requirement);\n        }\n\n        return Task.CompletedTask;\n    }\n}\n\npublic class TenantAccessRequirement : IAuthorizationRequirement\n{\n}\n\n// Registration\nservices.AddAuthorization(options =>\n{\n    options.AddPolicy(\"TenantAccess\", policy =>\n        policy.Requirements.Add(new TenantAccessRequirement()));\n});\n\nservices.AddSingleton<IAuthorizationHandler, TenantAuthorizationHandler>();\n\n// Usage in controller\n[HttpGet(\"{id}\")]\npublic async Task<IActionResult> GetOrder(int id)\n{\n    var order = await _orderService.GetByIdAsync(id);\n\n    var authResult = await _authorizationService.AuthorizeAsync(\n        User,\n        order,\n        \"TenantAccess\");\n\n    if (!authResult.Succeeded)\n    {\n        return Forbid();\n    }\n\n    return Ok(order);\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-125"
  },
  {
    "question": "Implement CORS policy dynamically based on database configuration.",
    "answer": [
      {
        "type": "text",
        "content": "Create dynamic CORS policy provider."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface ICorsConfigurationService\n{\n    Task<List<string>> GetAllowedOriginsAsync();\n}\n\npublic class DatabaseCorsConfigurationService : ICorsConfigurationService\n{\n    private readonly DbContext _dbContext;\n    private readonly IMemoryCache _cache;\n\n    public DatabaseCorsConfigurationService(DbContext dbContext, IMemoryCache cache)\n    {\n        _dbContext = dbContext;\n        _cache = cache;\n    }\n\n    public async Task<List<string>> GetAllowedOriginsAsync()\n    {\n        return await _cache.GetOrCreateAsync(\"cors-origins\", async entry =>\n        {\n            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);\n\n            return await _dbContext.Set<CorsOrigin>()\n                .Where(o => o.IsEnabled)\n                .Select(o => o.Origin)\n                .ToListAsync();\n        });\n    }\n}\n\npublic class DynamicCorsMiddleware\n{\n    private readonly RequestDelegate _next;\n    private readonly ICorsConfigurationService _corsConfig;\n\n    public DynamicCorsMiddleware(\n        RequestDelegate next,\n        ICorsConfigurationService corsConfig)\n    {\n        _next = next;\n        _corsConfig = corsConfig;\n    }\n\n    public async Task InvokeAsync(HttpContext context)\n    {\n        var origin = context.Request.Headers[\"Origin\"].ToString();\n\n        if (!string.IsNullOrEmpty(origin))\n        {\n            var allowedOrigins = await _corsConfig.GetAllowedOriginsAsync();\n\n            if (allowedOrigins.Contains(origin))\n            {\n                context.Response.Headers.Add(\"Access-Control-Allow-Origin\", origin);\n                context.Response.Headers.Add(\"Access-Control-Allow-Credentials\", \"true\");\n\n                if (context.Request.Method == \"OPTIONS\")\n                {\n                    context.Response.Headers.Add(\n                        \"Access-Control-Allow-Methods\",\n                        \"GET, POST, PUT, DELETE, OPTIONS\");\n                    context.Response.Headers.Add(\n                        \"Access-Control-Allow-Headers\",\n                        \"Content-Type, Authorization\");\n                    context.Response.StatusCode = StatusCodes.Status204NoContent;\n                    return;\n                }\n            }\n        }\n\n        await _next(context);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-126"
  },
  {
    "question": "Implement ETag support for GET endpoints with conditional requests.",
    "answer": [
      {
        "type": "text",
        "content": "Compute a hash and honor If-None-Match."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "app.MapGet(\"/orders/{id}\", async (int id, HttpContext context, IOrderRepo repo) =>\n{\n    var order = await repo.GetByIdAsync(id);\n    if (order is null)\n        return Results.NotFound();\n\n    var etag = $\"\\\"{order.UpdatedAt.Ticks}\\\"\";\n    if (context.Request.Headers.IfNoneMatch == etag)\n        return Results.StatusCode(StatusCodes.Status304NotModified);\n\n    context.Response.Headers.ETag = etag;\n    return Results.Ok(order);\n});",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-127"
  },
  {
    "question": "Enforce request body size limits for upload endpoints.",
    "answer": [
      {
        "type": "text",
        "content": "Use RequestSizeLimit attributes or middleware."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "[RequestSizeLimit(2 * 1024 * 1024)]\n[HttpPost(\"upload\")]\npublic async Task<IActionResult> Upload(IFormFile file)\n{\n    // ...\n    return Ok();\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-128"
  },
  {
    "question": "Create a readiness endpoint that checks dependencies.",
    "answer": [
      {
        "type": "text",
        "content": "Use health checks with tags."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "builder.Services.AddHealthChecks()\n    .AddSqlServer(connectionString, name: \"db\")\n    .AddRedis(redisConnection, name: \"cache\");\n\napp.MapHealthChecks(\"/health/ready\", new HealthCheckOptions\n{\n    Predicate = check => check.Tags.Contains(\"ready\")\n});",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-129"
  },
  {
    "question": "Implement resource-based authorization with policies.",
    "answer": [
      {
        "type": "text",
        "content": "Use IAuthorizationService in handlers."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "app.MapGet(\"/accounts/{id}\", async (\n    int id,\n    ClaimsPrincipal user,\n    IAuthorizationService auth,\n    IAccountRepo repo) =>\n{\n    var account = await repo.GetByIdAsync(id);\n    var result = await auth.AuthorizeAsync(user, account, \"CanReadAccount\");\n    return result.Succeeded ? Results.Ok(account) : Results.Forbid();\n});",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-130"
  },
  {
    "question": "Apply per-tenant rate limits with a custom policy.",
    "answer": [
      {
        "type": "text",
        "content": "Partition limits by tenant identifier."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "builder.Services.AddRateLimiter(options =>\n{\n    options.AddPolicy(\"per-tenant\", context =>\n        RateLimitPartition.GetFixedWindowLimiter(\n            partitionKey: context.User.FindFirst(\"tenant\")?.Value ?? \"anon\",\n            factory: _ => new FixedWindowRateLimiterOptions\n            {\n                PermitLimit = 60,\n                Window = TimeSpan.FromMinutes(1)\n            }));\n});\n\napp.UseRateLimiter();",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Total Exercises: 45+"
      },
      {
        "type": "text",
        "content": "Master these patterns to build robust, scalable APIs with proper lifecycle management!"
      }
    ],
    "category": "practice",
    "topic": "Api Lifecycle",
    "topicId": "api-lifecycle",
    "source": "practice/sub-notes/api-lifecycle.md",
    "id": "card-131"
  },
  {
    "question": "Sketch code to call three REST endpoints concurrently, cancel if any take longer than 3 seconds, and aggregate results.",
    "answer": [
      {
        "type": "text",
        "content": "Use Task.WhenAll with CancellationTokenSource + timeout. Ensure the HttpClient is a singleton to avoid socket exhaustion and that partial results are handled gracefully when cancellation occurs."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(3));\nvar tasks = endpoints.Select(url => httpClient.GetStringAsync(url, cts.Token));\nstring[] responses = await Task.WhenAll(tasks);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when: Limited number of independent calls; want fail-fast. Avoid when: Endpoints depend on each other or you must gracefully degrade per-call."
      }
    ],
    "category": "practice",
    "topic": "Async Await Exercises",
    "topicId": "async-await-exercises",
    "source": "practice/sub-notes/async-await-exercises.md",
    "id": "card-132"
  },
  {
    "question": "Implement a resilient HTTP client with retry and circuit breaker policies using Polly.",
    "answer": [
      {
        "type": "text",
        "content": "Define policies and wrap HTTP calls."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var policy = Policy.WrapAsync(\n    Policy.Handle<HttpRequestException>()\n          .OrResult<HttpResponseMessage>(r => (int)r.StatusCode >= 500)\n          .WaitAndRetryAsync(3, attempt => TimeSpan.FromMilliseconds(200 * attempt)),\n    Policy.Handle<HttpRequestException>()\n          .CircuitBreakerAsync(5, TimeSpan.FromSeconds(30))\n);\n\nvar response = await policy.ExecuteAsync(() => httpClient.SendAsync(request));",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when: Downstream instability; need resilience. Avoid when: Operations must not be retried (e.g., non-idempotent commands without safeguards)."
      }
    ],
    "category": "practice",
    "topic": "Async Await Exercises",
    "topicId": "async-await-exercises",
    "source": "practice/sub-notes/async-await-exercises.md",
    "id": "card-133"
  },
  {
    "question": "How would you handle backpressure when consuming a fast message queue with a slower downstream API?",
    "answer": [
      {
        "type": "text",
        "content": "Use bounded channels, buffering, or throttling. Consider load shedding by dropping low-priority messages or scaling consumers horizontally when queue lengths grow."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var channel = Channel.CreateBounded<Message>(new BoundedChannelOptions(100)\n{\n    FullMode = BoundedChannelFullMode.Wait\n});\n\n// Producer\n_ = Task.Run(async () =>\n{\n    await foreach (var msg in source.ReadAllAsync())\n        await channel.Writer.WriteAsync(msg);\n});\n\n// Consumer\nawait foreach (var msg in channel.Reader.ReadAllAsync())\n{\n    await ProcessAsync(msg);\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when: Consumer slower than producer; need to avoid overload. Avoid when: Throughput must be maximized with zero buffering—consider scaling consumers instead."
      }
    ],
    "category": "practice",
    "topic": "Async Await Exercises",
    "topicId": "async-await-exercises",
    "source": "practice/sub-notes/async-await-exercises.md",
    "id": "card-134"
  },
  {
    "question": "Explain why you might use SemaphoreSlim with async code over lock.",
    "answer": [
      {
        "type": "text",
        "content": "SemaphoreSlim supports async waiting and throttling concurrency. It can represent both mutual exclusion (1 permit) and limited resource pools (>1 permits)."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "private readonly SemaphoreSlim _mutex = new(1, 1);\n\npublic async Task UseSharedAsync()\n{\n    await _mutex.WaitAsync();\n    try { await SharedAsyncOperation(); }\n    finally { _mutex.Release(); }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use SemaphoreSlim when: Async code needs mutual exclusion or limited parallelism. Avoid when: Code is synchronous—lock has less overhead."
      }
    ],
    "category": "practice",
    "topic": "Async Await Exercises",
    "topicId": "async-await-exercises",
    "source": "practice/sub-notes/async-await-exercises.md",
    "id": "card-135"
  },
  {
    "question": "Implement an async method that times out after a specified duration and returns a default value.",
    "answer": [
      {
        "type": "text",
        "content": "Use Task.WhenAny with a delay task or CancellationTokenSource."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public static async Task<T> WithTimeout<T>(\n    Task<T> task,\n    TimeSpan timeout,\n    T defaultValue = default)\n{\n    using var cts = new CancellationTokenSource(timeout);\n    try\n    {\n        return await task.WaitAsync(timeout);  // .NET 6+\n    }\n    catch (TimeoutException)\n    {\n        return defaultValue;\n    }\n}\n\n// Pre-.NET 6 approach\npublic static async Task<T> WithTimeoutClassic<T>(\n    Task<T> task,\n    TimeSpan timeout,\n    T defaultValue = default)\n{\n    var delayTask = Task.Delay(timeout);\n    var completedTask = await Task.WhenAny(task, delayTask);\n\n    if (completedTask == delayTask)\n        return defaultValue;\n\n    return await task;\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Await Exercises",
    "topicId": "async-await-exercises",
    "source": "practice/sub-notes/async-await-exercises.md",
    "id": "card-136"
  },
  {
    "question": "Create a method that retries an operation with exponential backoff.",
    "answer": [
      {
        "type": "text",
        "content": "Implement retry logic with increasing delays."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public static async Task<T> RetryWithBackoff<T>(\n    Func<Task<T>> operation,\n    int maxRetries = 3,\n    int initialDelayMs = 100)\n{\n    for (int attempt = 0; attempt < maxRetries; attempt++)\n    {\n        try\n        {\n            return await operation();\n        }\n        catch (Exception ex) when (attempt < maxRetries - 1)\n        {\n            var delay = initialDelayMs * Math.Pow(2, attempt);\n            await Task.Delay((int)delay);\n        }\n    }\n\n    // Last attempt without catching\n    return await operation();\n}\n\n// Usage\nvar result = await RetryWithBackoff(\n    () => httpClient.GetStringAsync(\"https://api.example.com/data\"),\n    maxRetries: 5,\n    initialDelayMs: 200\n);",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Await Exercises",
    "topicId": "async-await-exercises",
    "source": "practice/sub-notes/async-await-exercises.md",
    "id": "card-137"
  },
  {
    "question": "Implement a method that processes items in batches with a maximum degree of parallelism.",
    "answer": [
      {
        "type": "text",
        "content": "Use SemaphoreSlim to limit concurrency or Parallel.ForEachAsync."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Using SemaphoreSlim\npublic static async Task ProcessInParallel<T>(\n    IEnumerable<T> items,\n    Func<T, Task> processor,\n    int maxDegreeOfParallelism)\n{\n    using var semaphore = new SemaphoreSlim(maxDegreeOfParallelism);\n    var tasks = items.Select(async item =>\n    {\n        await semaphore.WaitAsync();\n        try\n        {\n            await processor(item);\n        }\n        finally\n        {\n            semaphore.Release();\n        }\n    });\n\n    await Task.WhenAll(tasks);\n}\n\n// Using Parallel.ForEachAsync (.NET 6+)\npublic static async Task ProcessInParallelModern<T>(\n    IEnumerable<T> items,\n    Func<T, CancellationToken, ValueTask> processor,\n    int maxDegreeOfParallelism)\n{\n    var options = new ParallelOptions\n    {\n        MaxDegreeOfParallelism = maxDegreeOfParallelism\n    };\n\n    await Parallel.ForEachAsync(items, options, processor);\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Await Exercises",
    "topicId": "async-await-exercises",
    "source": "practice/sub-notes/async-await-exercises.md",
    "id": "card-138"
  },
  {
    "question": "Create an async producer-consumer pattern using Channel<T>.",
    "answer": [
      {
        "type": "text",
        "content": "Implement coordinated producer and consumer tasks."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class AsyncProducerConsumer<T>\n{\n    private readonly Channel<T> _channel;\n\n    public AsyncProducerConsumer(int capacity)\n    {\n        _channel = Channel.CreateBounded<T>(capacity);\n    }\n\n    public async Task ProduceAsync(IAsyncEnumerable<T> items)\n    {\n        await foreach (var item in items)\n        {\n            await _channel.Writer.WriteAsync(item);\n        }\n        _channel.Writer.Complete();\n    }\n\n    public async Task ConsumeAsync(\n        Func<T, Task> processor,\n        CancellationToken cancellationToken = default)\n    {\n        await foreach (var item in _channel.Reader.ReadAllAsync(cancellationToken))\n        {\n            await processor(item);\n        }\n    }\n\n    public async Task RunAsync(\n        IAsyncEnumerable<T> items,\n        Func<T, Task> processor,\n        CancellationToken cancellationToken = default)\n    {\n        var produceTask = ProduceAsync(items);\n        var consumeTask = ConsumeAsync(processor, cancellationToken);\n\n        await Task.WhenAll(produceTask, consumeTask);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Await Exercises",
    "topicId": "async-await-exercises",
    "source": "practice/sub-notes/async-await-exercises.md",
    "id": "card-139"
  },
  {
    "question": "Implement proper cancellation handling in an async method that makes multiple API calls.",
    "answer": [
      {
        "type": "text",
        "content": "Check cancellation token at strategic points and pass it through."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public async Task<OrderResult> ProcessOrderAsync(\n    Order order,\n    CancellationToken cancellationToken)\n{\n    cancellationToken.ThrowIfCancellationRequested();\n\n    // Step 1: Validate\n    var validation = await ValidateOrderAsync(order, cancellationToken);\n    if (!validation.IsValid)\n        return OrderResult.Failed(validation.Errors);\n\n    cancellationToken.ThrowIfCancellationRequested();\n\n    // Step 2: Reserve inventory\n    var reservation = await ReserveInventoryAsync(order, cancellationToken);\n\n    cancellationToken.ThrowIfCancellationRequested();\n\n    // Step 3: Process payment\n    try\n    {\n        var payment = await ProcessPaymentAsync(order, cancellationToken);\n        return OrderResult.Success(payment.TransactionId);\n    }\n    catch (OperationCanceledException)\n    {\n        // Rollback reservation\n        await ReleaseInventoryAsync(reservation, CancellationToken.None);\n        throw;\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Await Exercises",
    "topicId": "async-await-exercises",
    "source": "practice/sub-notes/async-await-exercises.md",
    "id": "card-140"
  },
  {
    "question": "Implement an async lazy initialization pattern that ensures a resource is initialized only once.",
    "answer": [
      {
        "type": "text",
        "content": "Use Lazy<Task<T>> or custom lazy initialization."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class AsyncLazy<T>\n{\n    private readonly Lazy<Task<T>> _instance;\n\n    public AsyncLazy(Func<Task<T>> factory)\n    {\n        _instance = new Lazy<Task<T>>(factory);\n    }\n\n    public Task<T> Value => _instance.Value;\n}\n\n// Usage\nprivate readonly AsyncLazy<DatabaseConnection> _connection;\n\npublic MyService()\n{\n    _connection = new AsyncLazy<DatabaseConnection>(\n        async () => await DatabaseConnection.ConnectAsync());\n}\n\npublic async Task<Data> GetDataAsync()\n{\n    var conn = await _connection.Value;\n    return await conn.QueryAsync(\"SELECT * FROM Data\");\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Await Exercises",
    "topicId": "async-await-exercises",
    "source": "practice/sub-notes/async-await-exercises.md",
    "id": "card-141"
  },
  {
    "question": "Create a rate limiter using SemaphoreSlim and Timer for token bucket algorithm.",
    "answer": [
      {
        "type": "text",
        "content": "Implement token bucket pattern with async semaphore."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class RateLimiter : IDisposable\n{\n    private readonly SemaphoreSlim _semaphore;\n    private readonly Timer _timer;\n    private readonly int _maxTokens;\n    private readonly TimeSpan _refillInterval;\n\n    public RateLimiter(int maxTokens, TimeSpan refillInterval)\n    {\n        _maxTokens = maxTokens;\n        _refillInterval = refillInterval;\n        _semaphore = new SemaphoreSlim(maxTokens, maxTokens);\n        _timer = new Timer(RefillTokens, null, refillInterval, refillInterval);\n    }\n\n    private void RefillTokens(object state)\n    {\n        // Add tokens up to max\n        if (_semaphore.CurrentCount < _maxTokens)\n        {\n            _semaphore.Release();\n        }\n    }\n\n    public async Task<bool> TryAcquireAsync(\n        TimeSpan timeout,\n        CancellationToken cancellationToken = default)\n    {\n        return await _semaphore.WaitAsync(timeout, cancellationToken);\n    }\n\n    public void Dispose()\n    {\n        _timer?.Dispose();\n        _semaphore?.Dispose();\n    }\n}\n\n// Usage\nvar rateLimiter = new RateLimiter(maxTokens: 10, TimeSpan.FromSeconds(1));\nif (await rateLimiter.TryAcquireAsync(TimeSpan.FromMilliseconds(100)))\n{\n    await MakeApiCallAsync();\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Await Exercises",
    "topicId": "async-await-exercises",
    "source": "practice/sub-notes/async-await-exercises.md",
    "id": "card-142"
  },
  {
    "question": "Implement async dispose pattern (IAsyncDisposable) for a resource that requires async cleanup.",
    "answer": [
      {
        "type": "text",
        "content": "Implement IAsyncDisposable interface."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class AsyncResource : IAsyncDisposable\n{\n    private readonly HttpClient _httpClient;\n    private readonly Stream _stream;\n    private bool _disposed;\n\n    public AsyncResource()\n    {\n        _httpClient = new HttpClient();\n        _stream = new MemoryStream();\n    }\n\n    public async ValueTask DisposeAsync()\n    {\n        if (_disposed) return;\n\n        await DisposeAsyncCore();\n\n        Dispose(disposing: false);\n        GC.SuppressFinalize(this);\n\n        _disposed = true;\n    }\n\n    protected virtual async ValueTask DisposeAsyncCore()\n    {\n        // Async cleanup\n        if (_stream != null)\n        {\n            await _stream.FlushAsync();\n            await _stream.DisposeAsync();\n        }\n    }\n\n    protected virtual void Dispose(bool disposing)\n    {\n        if (disposing)\n        {\n            _httpClient?.Dispose();\n        }\n    }\n}\n\n// Usage\nawait using var resource = new AsyncResource();",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Await Exercises",
    "topicId": "async-await-exercises",
    "source": "practice/sub-notes/async-await-exercises.md",
    "id": "card-143"
  },
  {
    "question": "Create a circuit breaker implementation from scratch.",
    "answer": [
      {
        "type": "text",
        "content": "Implement state machine for circuit breaker pattern."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class CircuitBreaker\n{\n    private enum State { Closed, Open, HalfOpen }\n\n    private State _state = State.Closed;\n    private int _failureCount;\n    private DateTime _lastFailureTime;\n\n    private readonly int _failureThreshold;\n    private readonly TimeSpan _timeout;\n    private readonly SemaphoreSlim _lock = new(1, 1);\n\n    public CircuitBreaker(int failureThreshold, TimeSpan timeout)\n    {\n        _failureThreshold = failureThreshold;\n        _timeout = timeout;\n    }\n\n    public async Task<T> ExecuteAsync<T>(Func<Task<T>> operation)\n    {\n        await _lock.WaitAsync();\n        try\n        {\n            // Check if we should transition from Open to HalfOpen\n            if (_state == State.Open &&\n                DateTime.UtcNow - _lastFailureTime >= _timeout)\n            {\n                _state = State.HalfOpen;\n            }\n\n            if (_state == State.Open)\n            {\n                throw new CircuitBreakerOpenException(\n                    \"Circuit breaker is open\");\n            }\n        }\n        finally\n        {\n            _lock.Release();\n        }\n\n        try\n        {\n            var result = await operation();\n\n            // Success - reset if in HalfOpen\n            if (_state == State.HalfOpen)\n            {\n                await ResetAsync();\n            }\n\n            return result;\n        }\n        catch (Exception ex)\n        {\n            await RecordFailureAsync(ex);\n            throw;\n        }\n    }\n\n    private async Task RecordFailureAsync(Exception ex)\n    {\n        await _lock.WaitAsync();\n        try\n        {\n            _failureCount++;\n            _lastFailureTime = DateTime.UtcNow;\n\n            if (_failureCount >= _failureThreshold)\n            {\n                _state = State.Open;\n            }\n        }\n        finally\n        {\n            _lock.Release();\n        }\n    }\n\n    private async Task ResetAsync()\n    {\n        await _lock.WaitAsync();\n        try\n        {\n            _failureCount = 0;\n            _state = State.Closed;\n        }\n        finally\n        {\n            _lock.Release();\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Await Exercises",
    "topicId": "async-await-exercises",
    "source": "practice/sub-notes/async-await-exercises.md",
    "id": "card-144"
  },
  {
    "question": "Implement a parallel batch processor that maintains order of results.",
    "answer": [
      {
        "type": "text",
        "content": "Process in parallel but preserve order."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public static async Task<List<TResult>> ProcessInOrderAsync<TSource, TResult>(\n    IEnumerable<TSource> items,\n    Func<TSource, Task<TResult>> processor,\n    int maxDegreeOfParallelism)\n{\n    var semaphore = new SemaphoreSlim(maxDegreeOfParallelism);\n    var tasks = items.Select(async (item, index) =>\n    {\n        await semaphore.WaitAsync();\n        try\n        {\n            var result = await processor(item);\n            return (Index: index, Result: result);\n        }\n        finally\n        {\n            semaphore.Release();\n        }\n    });\n\n    var results = await Task.WhenAll(tasks);\n\n    return results\n        .OrderBy(x => x.Index)\n        .Select(x => x.Result)\n        .ToList();\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Await Exercises",
    "topicId": "async-await-exercises",
    "source": "practice/sub-notes/async-await-exercises.md",
    "id": "card-145"
  },
  {
    "question": "Implement a fan-out/fan-in pattern where multiple workers process items and results are aggregated.",
    "answer": [
      {
        "type": "text",
        "content": "Distribute work and collect results."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public async Task<Summary> FanOutFanIn<T>(\n    IEnumerable<T> items,\n    Func<T, Task<Result>> processor)\n{\n    var channel = Channel.CreateUnbounded<Result>();\n\n    // Fan-out: Start workers\n    var workers = Enumerable.Range(0, Environment.ProcessorCount)\n        .Select(i => Task.Run(async () =>\n        {\n            await foreach (var item in GetWorkItems(items, i))\n            {\n                var result = await processor(item);\n                await channel.Writer.WriteAsync(result);\n            }\n        }))\n        .ToArray();\n\n    // Signal completion\n    _ = Task.Run(async () =>\n    {\n        await Task.WhenAll(workers);\n        channel.Writer.Complete();\n    });\n\n    // Fan-in: Aggregate results\n    var summary = new Summary();\n    await foreach (var result in channel.Reader.ReadAllAsync())\n    {\n        summary.Add(result);\n    }\n\n    return summary;\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Await Exercises",
    "topicId": "async-await-exercises",
    "source": "practice/sub-notes/async-await-exercises.md",
    "id": "card-146"
  },
  {
    "question": "Create a coordinated shutdown mechanism for multiple background tasks.",
    "answer": [
      {
        "type": "text",
        "content": "Implement graceful shutdown with cancellation."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class BackgroundWorkerCoordinator : IDisposable\n{\n    private readonly List<Task> _workers = new();\n    private readonly CancellationTokenSource _cts = new();\n\n    public void Start(Func<CancellationToken, Task> workerFactory, int workerCount)\n    {\n        for (int i = 0; i < workerCount; i++)\n        {\n            var worker = Task.Run(() => workerFactory(_cts.Token));\n            _workers.Add(worker);\n        }\n    }\n\n    public async Task StopAsync(TimeSpan gracePeriod)\n    {\n        // Signal cancellation\n        _cts.Cancel();\n\n        // Wait for graceful shutdown\n        var shutdownTask = Task.WhenAll(_workers);\n        var timeoutTask = Task.Delay(gracePeriod);\n\n        var completedTask = await Task.WhenAny(shutdownTask, timeoutTask);\n\n        if (completedTask == timeoutTask)\n        {\n            // Forced shutdown after timeout\n            throw new TimeoutException(\"Workers did not complete in time\");\n        }\n\n        await shutdownTask;  // Propagate exceptions\n    }\n\n    public void Dispose()\n    {\n        _cts?.Cancel();\n        _cts?.Dispose();\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Await Exercises",
    "topicId": "async-await-exercises",
    "source": "practice/sub-notes/async-await-exercises.md",
    "id": "card-147"
  },
  {
    "question": "Implement async event aggregation that batches events before processing.",
    "answer": [
      {
        "type": "text",
        "content": "Buffer events and process in batches."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class EventBatcher<T>\n{\n    private readonly Channel<T> _channel;\n    private readonly int _batchSize;\n    private readonly TimeSpan _batchTimeout;\n\n    public EventBatcher(int batchSize, TimeSpan batchTimeout)\n    {\n        _channel = Channel.CreateUnbounded<T>();\n        _batchSize = batchSize;\n        _batchTimeout = batchTimeout;\n    }\n\n    public async Task AddAsync(T item)\n    {\n        await _channel.Writer.WriteAsync(item);\n    }\n\n    public async Task ProcessAsync(\n        Func<List<T>, Task> batchProcessor,\n        CancellationToken cancellationToken)\n    {\n        var batch = new List<T>(_batchSize);\n        using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);\n\n        while (!cancellationToken.IsCancellationRequested)\n        {\n            try\n            {\n                // Wait for first item or cancellation\n                var item = await _channel.Reader.ReadAsync(cancellationToken);\n                batch.Add(item);\n\n                // Collect more items until batch full or timeout\n                using var timeoutCts = new CancellationTokenSource(_batchTimeout);\n                while (batch.Count < _batchSize &&\n                       _channel.Reader.TryRead(out var nextItem))\n                {\n                    batch.Add(nextItem);\n                }\n\n                // Process batch\n                await batchProcessor(batch);\n                batch.Clear();\n            }\n            catch (OperationCanceledException)\n            {\n                break;\n            }\n        }\n\n        // Process remaining items\n        if (batch.Any())\n        {\n            await batchProcessor(batch);\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Await Exercises",
    "topicId": "async-await-exercises",
    "source": "practice/sub-notes/async-await-exercises.md",
    "id": "card-148"
  },
  {
    "question": "Implement a bulkhead pattern to isolate failures.",
    "answer": [
      {
        "type": "text",
        "content": "Separate resource pools for different operations."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class Bulkhead\n{\n    private readonly SemaphoreSlim _semaphore;\n    private readonly int _maxConcurrent;\n\n    public Bulkhead(int maxConcurrent)\n    {\n        _maxConcurrent = maxConcurrent;\n        _semaphore = new SemaphoreSlim(maxConcurrent);\n    }\n\n    public async Task<T> ExecuteAsync<T>(\n        Func<Task<T>> operation,\n        TimeSpan? timeout = null)\n    {\n        var acquired = await _semaphore.WaitAsync(timeout ?? Timeout.InfiniteTimeSpan);\n        if (!acquired)\n        {\n            throw new BulkheadRejectedException(\n                $\"Bulkhead full: {_maxConcurrent} concurrent executions\");\n        }\n\n        try\n        {\n            return await operation();\n        }\n        finally\n        {\n            _semaphore.Release();\n        }\n    }\n\n    public int AvailableSlots => _semaphore.CurrentCount;\n}\n\n// Usage: Separate bulkheads for different services\nvar criticalServiceBulkhead = new Bulkhead(10);\nvar nonCriticalServiceBulkhead = new Bulkhead(5);",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Await Exercises",
    "topicId": "async-await-exercises",
    "source": "practice/sub-notes/async-await-exercises.md",
    "id": "card-149"
  },
  {
    "question": "Create a fallback mechanism that returns cached data when an API call fails.",
    "answer": [
      {
        "type": "text",
        "content": "Implement cache-aside pattern with fallback."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class ResilientDataService\n{\n    private readonly HttpClient _httpClient;\n    private readonly IMemoryCache _cache;\n\n    public async Task<Data> GetDataAsync(string key)\n    {\n        // Try cache first\n        if (_cache.TryGetValue(key, out Data cachedData))\n        {\n            return cachedData;\n        }\n\n        try\n        {\n            // Try API\n            var data = await _httpClient.GetFromJsonAsync<Data>($\"/api/data/{key}\");\n\n            // Update cache\n            _cache.Set(key, data, TimeSpan.FromMinutes(5));\n\n            return data;\n        }\n        catch (HttpRequestException ex)\n        {\n            // Fallback to stale cache if available\n            if (_cache.TryGetValue($\"stale_{key}\", out Data staleData))\n            {\n                return staleData;\n            }\n\n            throw;\n        }\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Total Exercises: 40+"
      },
      {
        "type": "text",
        "content": "Focus on understanding cancellation, error handling, and coordination patterns!"
      }
    ],
    "category": "practice",
    "topic": "Async Await Exercises",
    "topicId": "async-await-exercises",
    "source": "practice/sub-notes/async-await-exercises.md",
    "id": "card-150"
  },
  {
    "question": "Sketch code to call three REST endpoints concurrently, cancel if any take longer than 3 seconds, and aggregate results.",
    "answer": [
      {
        "type": "text",
        "content": "Use Task.WhenAll with CancellationTokenSource + timeout. Ensure the HttpClient is a singleton to avoid socket exhaustion and that partial results are handled gracefully when cancellation occurs."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(3));\nvar tasks = endpoints.Select(url => httpClient.GetStringAsync(url, cts.Token));\nstring[] responses = await Task.WhenAll(tasks);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when limited number of independent calls; want fail-fast. Avoid when endpoints depend on each other or you must gracefully degrade per-call."
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-151"
  },
  {
    "question": "Implement a resilient HTTP client with retry and circuit breaker policies using Polly.",
    "answer": [
      {
        "type": "text",
        "content": "Define policies and wrap HTTP calls."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var policy = Policy.WrapAsync(\n    Policy.Handle<HttpRequestException>()\n          .OrResult<HttpResponseMessage>(r => (int)r.StatusCode >= 500)\n          .WaitAndRetryAsync(3, attempt => TimeSpan.FromMilliseconds(200 * attempt)),\n    Policy.Handle<HttpRequestException>()\n          .CircuitBreakerAsync(5, TimeSpan.FromSeconds(30))\n);\n\nvar response = await policy.ExecuteAsync(() => httpClient.SendAsync(request));",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when downstream instability; need resilience. Avoid when operations must not be retried (e.g., non-idempotent commands without safeguards)."
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-152"
  },
  {
    "question": "How would you handle backpressure when consuming a fast message queue with a slower downstream API?",
    "answer": [
      {
        "type": "text",
        "content": "Use bounded channels, buffering, or throttling. Consider load shedding by dropping low-priority messages or scaling consumers horizontally when queue lengths grow."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var channel = Channel.CreateBounded<Message>(new BoundedChannelOptions(100)\n{\n    FullMode = BoundedChannelFullMode.Wait\n});\n\n// Producer\n_ = Task.Run(async () =>\n{\n    await foreach (var msg in source.ReadAllAsync())\n        await channel.Writer.WriteAsync(msg);\n});\n\n// Consumer\nawait foreach (var msg in channel.Reader.ReadAllAsync())\n{\n    await ProcessAsync(msg);\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when consumer slower than producer; need to avoid overload. Avoid when throughput must be maximized with zero buffering—consider scaling consumers instead."
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-153"
  },
  {
    "question": "Explain why you might use SemaphoreSlim with async code over lock.",
    "answer": [
      {
        "type": "text",
        "content": "SemaphoreSlim supports async waiting and throttling concurrency. It can represent both mutual exclusion (1 permit) and limited resource pools (>1 permits)."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "private readonly SemaphoreSlim _mutex = new(1, 1);\n\npublic async Task UseSharedAsync()\n{\n    await _mutex.WaitAsync();\n    try { await SharedAsyncOperation(); }\n    finally { _mutex.Release(); }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use SemaphoreSlim when async code needs mutual exclusion or limited parallelism. Avoid when code is synchronous—lock has less overhead."
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-154"
  },
  {
    "question": "Implement an async method that times out after a specified duration and returns a default value.",
    "answer": [
      {
        "type": "text",
        "content": "Use Task.WhenAny with a delay task or CancellationTokenSource."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public static async Task<T> WithTimeout<T>(\n    Task<T> task,\n    TimeSpan timeout,\n    T defaultValue = default)\n{\n    using var cts = new CancellationTokenSource(timeout);\n    try\n    {\n        return await task.WaitAsync(timeout);  // .NET 6+\n    }\n    catch (TimeoutException)\n    {\n        return defaultValue;\n    }\n}\n\n// Pre-.NET 6 approach\npublic static async Task<T> WithTimeoutClassic<T>(\n    Task<T> task,\n    TimeSpan timeout,\n    T defaultValue = default)\n{\n    var delayTask = Task.Delay(timeout);\n    var completedTask = await Task.WhenAny(task, delayTask);\n\n    if (completedTask == delayTask)\n        return defaultValue;\n\n    return await task;\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-155"
  },
  {
    "question": "Create a method that retries an operation with exponential backoff.",
    "answer": [
      {
        "type": "text",
        "content": "Implement retry logic with increasing delays."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public static async Task<T> RetryWithBackoff<T>(\n    Func<Task<T>> operation,\n    int maxRetries = 3,\n    int initialDelayMs = 100)\n{\n    for (int attempt = 0; attempt < maxRetries; attempt++)\n    {\n        try\n        {\n            return await operation();\n        }\n        catch (Exception ex) when (attempt < maxRetries - 1)\n        {\n            var delay = initialDelayMs * Math.Pow(2, attempt);\n            await Task.Delay((int)delay);\n        }\n    }\n\n    // Last attempt without catching\n    return await operation();\n}\n\n// Usage\nvar result = await RetryWithBackoff(\n    () => httpClient.GetStringAsync(\"https://api.example.com/data\"),\n    maxRetries: 5,\n    initialDelayMs: 200\n);",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-156"
  },
  {
    "question": "Implement a method that processes items in batches with a maximum degree of parallelism.",
    "answer": [
      {
        "type": "text",
        "content": "Use SemaphoreSlim to limit concurrency or Parallel.ForEachAsync."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Using SemaphoreSlim\npublic static async Task ProcessInParallel<T>(\n    IEnumerable<T> items,\n    Func<T, Task> processor,\n    int maxDegreeOfParallelism)\n{\n    using var semaphore = new SemaphoreSlim(maxDegreeOfParallelism);\n    var tasks = items.Select(async item =>\n    {\n        await semaphore.WaitAsync();\n        try\n        {\n            await processor(item);\n        }\n        finally\n        {\n            semaphore.Release();\n        }\n    });\n\n    await Task.WhenAll(tasks);\n}\n\n// Using Parallel.ForEachAsync (.NET 6+)\npublic static async Task ProcessInParallelModern<T>(\n    IEnumerable<T> items,\n    Func<T, CancellationToken, ValueTask> processor,\n    int maxDegreeOfParallelism)\n{\n    var options = new ParallelOptions\n    {\n        MaxDegreeOfParallelism = maxDegreeOfParallelism\n    };\n\n    await Parallel.ForEachAsync(items, options, processor);\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-157"
  },
  {
    "question": "Create an async producer-consumer pattern using Channel<T>.",
    "answer": [
      {
        "type": "text",
        "content": "Implement coordinated producer and consumer tasks."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class AsyncProducerConsumer<T>\n{\n    private readonly Channel<T> _channel;\n\n    public AsyncProducerConsumer(int capacity)\n    {\n        _channel = Channel.CreateBounded<T>(capacity);\n    }\n\n    public async Task ProduceAsync(IAsyncEnumerable<T> items)\n    {\n        await foreach (var item in items)\n        {\n            await _channel.Writer.WriteAsync(item);\n        }\n        _channel.Writer.Complete();\n    }\n\n    public async Task ConsumeAsync(\n        Func<T, Task> processor,\n        CancellationToken cancellationToken = default)\n    {\n        await foreach (var item in _channel.Reader.ReadAllAsync(cancellationToken))\n        {\n            await processor(item);\n        }\n    }\n\n    public async Task RunAsync(\n        IAsyncEnumerable<T> items,\n        Func<T, Task> processor,\n        CancellationToken cancellationToken = default)\n    {\n        var produceTask = ProduceAsync(items);\n        var consumeTask = ConsumeAsync(processor, cancellationToken);\n\n        await Task.WhenAll(produceTask, consumeTask);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-158"
  },
  {
    "question": "Implement proper cancellation handling in an async method that makes multiple API calls.",
    "answer": [
      {
        "type": "text",
        "content": "Check cancellation token at strategic points and pass it through."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public async Task<OrderResult> ProcessOrderAsync(\n    Order order,\n    CancellationToken cancellationToken)\n{\n    cancellationToken.ThrowIfCancellationRequested();\n\n    // Step 1: Validate\n    var validation = await ValidateOrderAsync(order, cancellationToken);\n    if (!validation.IsValid)\n        return OrderResult.Failed(validation.Errors);\n\n    cancellationToken.ThrowIfCancellationRequested();\n\n    // Step 2: Reserve inventory\n    var reservation = await ReserveInventoryAsync(order, cancellationToken);\n\n    cancellationToken.ThrowIfCancellationRequested();\n\n    // Step 3: Process payment\n    try\n    {\n        var payment = await ProcessPaymentAsync(order, cancellationToken);\n        return OrderResult.Success(payment.TransactionId);\n    }\n    catch (OperationCanceledException)\n    {\n        // Rollback reservation\n        await ReleaseInventoryAsync(reservation, CancellationToken.None);\n        throw;\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-159"
  },
  {
    "question": "Implement an async lazy initialization pattern that ensures a resource is initialized only once.",
    "answer": [
      {
        "type": "text",
        "content": "Use Lazy<Task<T>> or custom lazy initialization."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class AsyncLazy<T>\n{\n    private readonly Lazy<Task<T>> _instance;\n\n    public AsyncLazy(Func<Task<T>> factory)\n    {\n        _instance = new Lazy<Task<T>>(factory);\n    }\n\n    public Task<T> Value => _instance.Value;\n}\n\n// Usage\nprivate readonly AsyncLazy<DatabaseConnection> _connection;\n\npublic MyService()\n{\n    _connection = new AsyncLazy<DatabaseConnection>(\n        async () => await DatabaseConnection.ConnectAsync());\n}\n\npublic async Task<Data> GetDataAsync()\n{\n    var conn = await _connection.Value;\n    return await conn.QueryAsync(\"SELECT * FROM Data\");\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-160"
  },
  {
    "question": "Create a rate limiter using SemaphoreSlim and Timer for token bucket algorithm.",
    "answer": [
      {
        "type": "text",
        "content": "Implement token bucket pattern with async semaphore."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class RateLimiter : IDisposable\n{\n    private readonly SemaphoreSlim _semaphore;\n    private readonly Timer _timer;\n    private readonly int _maxTokens;\n    private readonly TimeSpan _refillInterval;\n\n    public RateLimiter(int maxTokens, TimeSpan refillInterval)\n    {\n        _maxTokens = maxTokens;\n        _refillInterval = refillInterval;\n        _semaphore = new SemaphoreSlim(maxTokens, maxTokens);\n        _timer = new Timer(RefillTokens, null, refillInterval, refillInterval);\n    }\n\n    private void RefillTokens(object state)\n    {\n        // Add tokens up to max\n        if (_semaphore.CurrentCount < _maxTokens)\n        {\n            _semaphore.Release();\n        }\n    }\n\n    public async Task<bool> TryAcquireAsync(\n        TimeSpan timeout,\n        CancellationToken cancellationToken = default)\n    {\n        return await _semaphore.WaitAsync(timeout, cancellationToken);\n    }\n\n    public void Dispose()\n    {\n        _timer?.Dispose();\n        _semaphore?.Dispose();\n    }\n}\n\n// Usage\nvar rateLimiter = new RateLimiter(maxTokens: 10, TimeSpan.FromSeconds(1));\nif (await rateLimiter.TryAcquireAsync(TimeSpan.FromMilliseconds(100)))\n{\n    await MakeApiCallAsync();\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-161"
  },
  {
    "question": "Implement async dispose pattern (IAsyncDisposable) for a resource that requires async cleanup.",
    "answer": [
      {
        "type": "text",
        "content": "Implement IAsyncDisposable interface."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class AsyncResource : IAsyncDisposable\n{\n    private readonly HttpClient _httpClient;\n    private readonly Stream _stream;\n    private bool _disposed;\n\n    public AsyncResource()\n    {\n        _httpClient = new HttpClient();\n        _stream = new MemoryStream();\n    }\n\n    public async ValueTask DisposeAsync()\n    {\n        if (_disposed) return;\n\n        await DisposeAsyncCore();\n\n        Dispose(disposing: false);\n        GC.SuppressFinalize(this);\n\n        _disposed = true;\n    }\n\n    protected virtual async ValueTask DisposeAsyncCore()\n    {\n        // Async cleanup\n        if (_stream != null)\n        {\n            await _stream.FlushAsync();\n            await _stream.DisposeAsync();\n        }\n    }\n\n    protected virtual void Dispose(bool disposing)\n    {\n        if (disposing)\n        {\n            _httpClient?.Dispose();\n        }\n    }\n}\n\n// Usage\nawait using var resource = new AsyncResource();",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-162"
  },
  {
    "question": "Create a circuit breaker implementation from scratch.",
    "answer": [
      {
        "type": "text",
        "content": "Implement state machine for circuit breaker pattern."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class CircuitBreaker\n{\n    private enum State { Closed, Open, HalfOpen }\n\n    private State _state = State.Closed;\n    private int _failureCount;\n    private DateTime _lastFailureTime;\n\n    private readonly int _failureThreshold;\n    private readonly TimeSpan _timeout;\n    private readonly SemaphoreSlim _lock = new(1, 1);\n\n    public CircuitBreaker(int failureThreshold, TimeSpan timeout)\n    {\n        _failureThreshold = failureThreshold;\n        _timeout = timeout;\n    }\n\n    public async Task<T> ExecuteAsync<T>(Func<Task<T>> operation)\n    {\n        await _lock.WaitAsync();\n        try\n        {\n            // Check if we should transition from Open to HalfOpen\n            if (_state == State.Open &&\n                DateTime.UtcNow - _lastFailureTime >= _timeout)\n            {\n                _state = State.HalfOpen;\n            }\n\n            if (_state == State.Open)\n            {\n                throw new CircuitBreakerOpenException(\n                    \"Circuit breaker is open\");\n            }\n        }\n        finally\n        {\n            _lock.Release();\n        }\n\n        try\n        {\n            var result = await operation();\n\n            // Success - reset if in HalfOpen\n            if (_state == State.HalfOpen)\n            {\n                await ResetAsync();\n            }\n\n            return result;\n        }\n        catch (Exception ex)\n        {\n            await RecordFailureAsync(ex);\n            throw;\n        }\n    }\n\n    private async Task RecordFailureAsync(Exception ex)\n    {\n        await _lock.WaitAsync();\n        try\n        {\n            _failureCount++;\n            _lastFailureTime = DateTime.UtcNow;\n\n            if (_failureCount >= _failureThreshold)\n            {\n                _state = State.Open;\n            }\n        }\n        finally\n        {\n            _lock.Release();\n        }\n    }\n\n    private async Task ResetAsync()\n    {\n        await _lock.WaitAsync();\n        try\n        {\n            _failureCount = 0;\n            _state = State.Closed;\n        }\n        finally\n        {\n            _lock.Release();\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-163"
  },
  {
    "question": "Implement a parallel batch processor that maintains order of results.",
    "answer": [
      {
        "type": "text",
        "content": "Process in parallel but preserve order."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public static async Task<List<TResult>> ProcessInOrderAsync<TSource, TResult>(\n    IEnumerable<TSource> items,\n    Func<TSource, Task<TResult>> processor,\n    int maxDegreeOfParallelism)\n{\n    var semaphore = new SemaphoreSlim(maxDegreeOfParallelism);\n    var tasks = items.Select(async (item, index) =>\n    {\n        await semaphore.WaitAsync();\n        try\n        {\n            var result = await processor(item);\n            return (Index: index, Result: result);\n        }\n        finally\n        {\n            semaphore.Release();\n        }\n    });\n\n    var results = await Task.WhenAll(tasks);\n\n    return results\n        .OrderBy(x => x.Index)\n        .Select(x => x.Result)\n        .ToList();\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-164"
  },
  {
    "question": "Implement a fan-out/fan-in pattern where multiple workers process items and results are aggregated.",
    "answer": [
      {
        "type": "text",
        "content": "Distribute work and collect results."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public async Task<Summary> FanOutFanIn<T>(\n    IEnumerable<T> items,\n    Func<T, Task<Result>> processor)\n{\n    var channel = Channel.CreateUnbounded<Result>();\n\n    // Fan-out: Start workers\n    var workers = Enumerable.Range(0, Environment.ProcessorCount)\n        .Select(i => Task.Run(async () =>\n        {\n            await foreach (var item in GetWorkItems(items, i))\n            {\n                var result = await processor(item);\n                await channel.Writer.WriteAsync(result);\n            }\n        }))\n        .ToArray();\n\n    // Signal completion\n    _ = Task.Run(async () =>\n    {\n        await Task.WhenAll(workers);\n        channel.Writer.Complete();\n    });\n\n    // Fan-in: Aggregate results\n    var summary = new Summary();\n    await foreach (var result in channel.Reader.ReadAllAsync())\n    {\n        summary.Add(result);\n    }\n\n    return summary;\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-165"
  },
  {
    "question": "Create a coordinated shutdown mechanism for multiple background tasks.",
    "answer": [
      {
        "type": "text",
        "content": "Implement graceful shutdown with cancellation."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class BackgroundWorkerCoordinator : IDisposable\n{\n    private readonly List<Task> _workers = new();\n    private readonly CancellationTokenSource _cts = new();\n\n    public void Start(Func<CancellationToken, Task> workerFactory, int workerCount)\n    {\n        for (int i = 0; i < workerCount; i++)\n        {\n            var worker = Task.Run(() => workerFactory(_cts.Token));\n            _workers.Add(worker);\n        }\n    }\n\n    public async Task StopAsync(TimeSpan gracePeriod)\n    {\n        // Signal cancellation\n        _cts.Cancel();\n\n        // Wait for graceful shutdown\n        var shutdownTask = Task.WhenAll(_workers);\n        var timeoutTask = Task.Delay(gracePeriod);\n\n        var completedTask = await Task.WhenAny(shutdownTask, timeoutTask);\n\n        if (completedTask == timeoutTask)\n        {\n            // Forced shutdown after timeout\n            throw new TimeoutException(\"Workers did not complete in time\");\n        }\n\n        await shutdownTask;  // Propagate exceptions\n    }\n\n    public void Dispose()\n    {\n        _cts?.Cancel();\n        _cts?.Dispose();\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-166"
  },
  {
    "question": "Implement async event aggregation that batches events before processing.",
    "answer": [
      {
        "type": "text",
        "content": "Buffer events and process in batches."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class EventBatcher<T>\n{\n    private readonly Channel<T> _channel;\n    private readonly int _batchSize;\n    private readonly TimeSpan _batchTimeout;\n\n    public EventBatcher(int batchSize, TimeSpan batchTimeout)\n    {\n        _channel = Channel.CreateUnbounded<T>();\n        _batchSize = batchSize;\n        _batchTimeout = batchTimeout;\n    }\n\n    public async Task AddAsync(T item)\n    {\n        await _channel.Writer.WriteAsync(item);\n    }\n\n    public async Task ProcessAsync(\n        Func<List<T>, Task> batchProcessor,\n        CancellationToken cancellationToken)\n    {\n        var batch = new List<T>(_batchSize);\n        using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);\n\n        while (!cancellationToken.IsCancellationRequested)\n        {\n            try\n            {\n                // Wait for first item or cancellation\n                var item = await _channel.Reader.ReadAsync(cancellationToken);\n                batch.Add(item);\n\n                // Collect more items until batch full or timeout\n                using var timeoutCts = new CancellationTokenSource(_batchTimeout);\n                while (batch.Count < _batchSize &&\n                       _channel.Reader.TryRead(out var nextItem))\n                {\n                    batch.Add(nextItem);\n                }\n\n                // Process batch\n                await batchProcessor(batch);\n                batch.Clear();\n            }\n            catch (OperationCanceledException)\n            {\n                break;\n            }\n        }\n\n        // Process remaining items\n        if (batch.Any())\n        {\n            await batchProcessor(batch);\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-167"
  },
  {
    "question": "Implement a bulkhead pattern to isolate failures.",
    "answer": [
      {
        "type": "text",
        "content": "Separate resource pools for different operations."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class Bulkhead\n{\n    private readonly SemaphoreSlim _semaphore;\n    private readonly int _maxConcurrent;\n\n    public Bulkhead(int maxConcurrent)\n    {\n        _maxConcurrent = maxConcurrent;\n        _semaphore = new SemaphoreSlim(maxConcurrent);\n    }\n\n    public async Task<T> ExecuteAsync<T>(\n        Func<Task<T>> operation,\n        TimeSpan? timeout = null)\n    {\n        var acquired = await _semaphore.WaitAsync(timeout ?? Timeout.InfiniteTimeSpan);\n        if (!acquired)\n        {\n            throw new BulkheadRejectedException(\n                $\"Bulkhead full: {_maxConcurrent} concurrent executions\");\n        }\n\n        try\n        {\n            return await operation();\n        }\n        finally\n        {\n            _semaphore.Release();\n        }\n    }\n\n    public int AvailableSlots => _semaphore.CurrentCount;\n}\n\n// Usage: Separate bulkheads for different services\nvar criticalServiceBulkhead = new Bulkhead(10);\nvar nonCriticalServiceBulkhead = new Bulkhead(5);",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-168"
  },
  {
    "question": "Create a fallback mechanism that returns cached data when an API call fails.",
    "answer": [
      {
        "type": "text",
        "content": "Implement cache-aside pattern with fallback."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class ResilientDataService\n{\n    private readonly HttpClient _httpClient;\n    private readonly IMemoryCache _cache;\n\n    public async Task<Data> GetDataAsync(string key)\n    {\n        // Try cache first\n        if (_cache.TryGetValue(key, out Data cachedData))\n        {\n            return cachedData;\n        }\n\n        try\n        {\n            // Try API\n            var data = await _httpClient.GetFromJsonAsync<Data>($\"/api/data/{key}\");\n\n            // Update cache\n            _cache.Set(key, data, TimeSpan.FromMinutes(5));\n\n            return data;\n        }\n        catch (HttpRequestException ex)\n        {\n            // Fallback to stale cache if available\n            if (_cache.TryGetValue($\"stale_{key}\", out Data staleData))\n            {\n                return staleData;\n            }\n\n            throw;\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-169"
  },
  {
    "question": "Implement timeout policies for different types of operations (fast, medium, slow).",
    "answer": [
      {
        "type": "text",
        "content": "Configure different timeout strategies."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TimeoutPolicies\n{\n    public static IAsyncPolicy<HttpResponseMessage> FastOperation =>\n        Policy.TimeoutAsync<HttpResponseMessage>(TimeSpan.FromSeconds(2));\n\n    public static IAsyncPolicy<HttpResponseMessage> MediumOperation =>\n        Policy.TimeoutAsync<HttpResponseMessage>(TimeSpan.FromSeconds(10));\n\n    public static IAsyncPolicy<HttpResponseMessage> SlowOperation =>\n        Policy.TimeoutAsync<HttpResponseMessage>(TimeSpan.FromSeconds(30));\n\n    public static IAsyncPolicy<HttpResponseMessage> WithRetry(\n        IAsyncPolicy<HttpResponseMessage> timeoutPolicy)\n    {\n        var retryPolicy = Policy\n            .HandleResult<HttpResponseMessage>(r => !r.IsSuccessStatusCode)\n            .Or<TimeoutRejectedException>()\n            .WaitAndRetryAsync(3, attempt => TimeSpan.FromMilliseconds(100 * attempt));\n\n        return Policy.WrapAsync(retryPolicy, timeoutPolicy);\n    }\n}\n\n// Usage\nvar response = await TimeoutPolicies.WithRetry(TimeoutPolicies.FastOperation)\n    .ExecuteAsync(() => httpClient.GetAsync(\"/api/quick\"));",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-170"
  },
  {
    "question": "Implement a download manager that downloads multiple files concurrently with progress reporting.",
    "answer": [
      {
        "type": "text",
        "content": "Track progress across parallel downloads."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class DownloadManager\n{\n    public async Task DownloadFilesAsync(\n        List<string> urls,\n        string outputDirectory,\n        IProgress<DownloadProgress> progress,\n        int maxConcurrent = 3)\n    {\n        var semaphore = new SemaphoreSlim(maxConcurrent);\n        var totalBytes = 0L;\n        var downloadedBytes = 0L;\n        var completed = 0;\n\n        var tasks = urls.Select(async (url, index) =>\n        {\n            await semaphore.WaitAsync();\n            try\n            {\n                var fileName = Path.GetFileName(url);\n                var outputPath = Path.Combine(outputDirectory, fileName);\n\n                using var client = new HttpClient();\n                using var response = await client.GetAsync(url, HttpCompletionOption.ResponseHeadersRead);\n\n                var fileSize = response.Content.Headers.ContentLength ?? 0;\n                Interlocked.Add(ref totalBytes, fileSize);\n\n                await using var contentStream = await response.Content.ReadAsStreamAsync();\n                await using var fileStream = File.Create(outputPath);\n\n                var buffer = new byte[8192];\n                int bytesRead;\n                while ((bytesRead = await contentStream.ReadAsync(buffer)) > 0)\n                {\n                    await fileStream.WriteAsync(buffer.AsMemory(0, bytesRead));\n\n                    Interlocked.Add(ref downloadedBytes, bytesRead);\n\n                    progress?.Report(new DownloadProgress\n                    {\n                        TotalFiles = urls.Count,\n                        CompletedFiles = Volatile.Read(ref completed),\n                        TotalBytes = Volatile.Read(ref totalBytes),\n                        DownloadedBytes = Volatile.Read(ref downloadedBytes)\n                    });\n                }\n\n                Interlocked.Increment(ref completed);\n            }\n            finally\n            {\n                semaphore.Release();\n            }\n        });\n\n        await Task.WhenAll(tasks);\n    }\n}\n\npublic record DownloadProgress\n{\n    public int TotalFiles { get; init; }\n    public int CompletedFiles { get; init; }\n    public long TotalBytes { get; init; }\n    public long DownloadedBytes { get; init; }\n    public double PercentComplete => TotalBytes > 0\n        ? (double)DownloadedBytes / TotalBytes * 100\n        : 0;\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-171"
  },
  {
    "question": "How do you run tasks in parallel but keep partial results when some fail?",
    "answer": [
      {
        "type": "text",
        "content": "Use Task.WhenAll with try/catch and record successes and failures."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public static async Task<(List<T> Results, List<Exception> Errors)> WhenAllSafe<T>(IEnumerable<Task<T>> tasks)\n{\n    var results = new List<T>();\n    var errors = new List<Exception>();\n\n    foreach (var task in tasks)\n    {\n        try\n        {\n            results.Add(await task);\n        }\n        catch (Exception ex)\n        {\n            errors.Add(ex);\n        }\n    }\n\n    return (results, errors);\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-172"
  },
  {
    "question": "Implement bounded parallelism using Parallel.ForEachAsync.",
    "answer": [
      {
        "type": "text",
        "content": "Use MaxDegreeOfParallelism to control concurrency."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "await Parallel.ForEachAsync(items, new ParallelOptions\n{\n    MaxDegreeOfParallelism = 4,\n    CancellationToken = ct\n}, async (item, token) =>\n{\n    await ProcessAsync(item, token);\n});",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-173"
  },
  {
    "question": "Add jitter to retry backoff to avoid thundering herds.",
    "answer": [
      {
        "type": "text",
        "content": "Randomize the delay window per attempt."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var rng = Random.Shared;\nvar delay = TimeSpan.FromMilliseconds(initialDelayMs * Math.Pow(2, attempt));\nvar jitter = TimeSpan.FromMilliseconds(rng.Next(0, 100));\nawait Task.Delay(delay + jitter, ct);",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-174"
  },
  {
    "question": "Stream results with IAsyncEnumerable and cancellation.",
    "answer": [
      {
        "type": "text",
        "content": "Use yield return with CancellationToken support."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public static async IAsyncEnumerable<Order> StreamOrdersAsync(\n    IOrderSource source,\n    [EnumeratorCancellation] CancellationToken ct)\n{\n    await foreach (var order in source.ReadAllAsync(ct))\n    {\n        yield return order;\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-175"
  },
  {
    "question": "Design a simple circuit breaker state machine.",
    "answer": [
      {
        "type": "text",
        "content": "Track failures and open the circuit for a timeout window."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public sealed class SimpleCircuitBreaker\n{\n    private int _failures;\n    private DateTime _openedAt;\n    private readonly int _threshold;\n    private readonly TimeSpan _openDuration;\n\n    public SimpleCircuitBreaker(int threshold, TimeSpan openDuration)\n    {\n        _threshold = threshold;\n        _openDuration = openDuration;\n    }\n\n    public bool CanExecute()\n    {\n        if (_failures < _threshold)\n            return true;\n\n        return DateTime.UtcNow - _openedAt > _openDuration;\n    }\n\n    public void RecordFailure()\n    {\n        _failures += 1;\n        if (_failures == _threshold)\n            _openedAt = DateTime.UtcNow;\n    }\n\n    public void RecordSuccess()\n    {\n        _failures = 0;\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Total Exercises: 40+"
      },
      {
        "type": "text",
        "content": "Focus on understanding cancellation, error handling, and coordination patterns!"
      }
    ],
    "category": "practice",
    "topic": "Async Resilience",
    "topicId": "async-resilience",
    "source": "practice/sub-notes/async-resilience.md",
    "id": "card-176"
  },
  {
    "question": "Tell me about a time you improved reliability under tight deadlines.",
    "answer": [
      {
        "type": "text",
        "content": "Emphasize triage, prioritization, and measurable reliability gains (reduced incidents, improved MTTR)."
      }
    ],
    "category": "practice",
    "topic": "Behavioral Questions",
    "topicId": "behavioral-questions",
    "source": "practice/sub-notes/behavioral-questions.md",
    "id": "card-177"
  },
  {
    "question": "Describe a time you pushed back on a requirement.",
    "answer": [
      {
        "type": "text",
        "content": "Explain how you gathered data, offered alternatives, and aligned on a better solution."
      }
    ],
    "category": "practice",
    "topic": "Behavioral Questions",
    "topicId": "behavioral-questions",
    "source": "practice/sub-notes/behavioral-questions.md",
    "id": "card-178"
  },
  {
    "question": "Share a story where you mentored a teammate.",
    "answer": [
      {
        "type": "text",
        "content": "Focus on coaching style, growth outcomes, and how you measured success."
      }
    ],
    "category": "practice",
    "topic": "Behavioral Questions",
    "topicId": "behavioral-questions",
    "source": "practice/sub-notes/behavioral-questions.md",
    "id": "card-179"
  },
  {
    "question": "Describe a time you resolved a production incident.",
    "answer": [
      {
        "type": "text",
        "content": "Highlight diagnostics, clear communication, and follow-up prevention steps."
      }
    ],
    "category": "practice",
    "topic": "Behavioral Questions",
    "topicId": "behavioral-questions",
    "source": "practice/sub-notes/behavioral-questions.md",
    "id": "card-180"
  },
  {
    "question": "Tell me about a technical decision that you later reconsidered.",
    "answer": [
      {
        "type": "text",
        "content": "Show humility, what you learned, and how you adapted your approach."
      }
    ],
    "category": "practice",
    "topic": "Behavioral Questions",
    "topicId": "behavioral-questions",
    "source": "practice/sub-notes/behavioral-questions.md",
    "id": "card-181"
  },
  {
    "question": "Describe a time you influenced without authority.",
    "answer": [
      {
        "type": "text",
        "content": "Explain how you built trust, used data, and aligned stakeholders."
      }
    ],
    "category": "practice",
    "topic": "Behavioral Questions",
    "topicId": "behavioral-questions",
    "source": "practice/sub-notes/behavioral-questions.md",
    "id": "card-182"
  },
  {
    "question": "How do you handle competing priorities?",
    "answer": [
      {
        "type": "text",
        "content": "Explain triage, stakeholder communication, and how you protect critical paths."
      }
    ],
    "category": "practice",
    "topic": "Behavioral Questions",
    "topicId": "behavioral-questions",
    "source": "practice/sub-notes/behavioral-questions.md",
    "id": "card-183"
  },
  {
    "question": "Tell me about a time you improved a process.",
    "answer": [
      {
        "type": "text",
        "content": "Describe the baseline, your change, and the measurable improvement."
      }
    ],
    "category": "practice",
    "topic": "Behavioral Questions",
    "topicId": "behavioral-questions",
    "source": "practice/sub-notes/behavioral-questions.md",
    "id": "card-184"
  },
  {
    "question": "Describe a conflict that you resolved successfully.",
    "answer": [
      {
        "type": "text",
        "content": "Focus on listening, shared goals, and outcome."
      }
    ],
    "category": "practice",
    "topic": "Behavioral Questions",
    "topicId": "behavioral-questions",
    "source": "practice/sub-notes/behavioral-questions.md",
    "id": "card-185"
  },
  {
    "question": "Share a time you handled ambiguous requirements.",
    "answer": [
      {
        "type": "text",
        "content": "Emphasize discovery, clarifying questions, and iterative delivery."
      }
    ],
    "category": "practice",
    "topic": "Behavioral Questions",
    "topicId": "behavioral-questions",
    "source": "practice/sub-notes/behavioral-questions.md",
    "id": "card-186"
  },
  {
    "question": "Implement a token bucket rate limiter (single-threaded).",
    "answer": [
      {
        "type": "text",
        "content": "Use a refill timer and allow up to capacity tokens."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public sealed class TokenBucket\n{\n    private readonly int _capacity;\n    private readonly int _refillPerSecond;\n    private int _tokens;\n    private DateTime _lastRefill;\n\n    public TokenBucket(int capacity, int refillPerSecond)\n    {\n        _capacity = capacity;\n        _refillPerSecond = refillPerSecond;\n        _tokens = capacity;\n        _lastRefill = DateTime.UtcNow;\n    }\n\n    public bool TryConsume()\n    {\n        Refill();\n        if (_tokens <= 0) return false;\n        _tokens -= 1;\n        return true;\n    }\n\n    private void Refill()\n    {\n        var now = DateTime.UtcNow;\n        var seconds = (int)(now - _lastRefill).TotalSeconds;\n        if (seconds <= 0) return;\n        _tokens = Math.Min(_capacity, _tokens + seconds * _refillPerSecond);\n        _lastRefill = now;\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Code Assessment",
    "topicId": "code-assessment",
    "source": "practice/sub-notes/code-assessment.md",
    "id": "card-187"
  },
  {
    "question": "Build a bounded in-memory queue with backpressure signals.",
    "answer": [
      {
        "type": "text",
        "content": "Track capacity and return a boolean to indicate enqueue success."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public sealed class BoundedQueue<T>\n{\n    private readonly Queue<T> _queue = new();\n    private readonly int _capacity;\n\n    public BoundedQueue(int capacity) => _capacity = capacity;\n\n    public bool TryEnqueue(T item)\n    {\n        if (_queue.Count >= _capacity) return false;\n        _queue.Enqueue(item);\n        return true;\n    }\n\n    public bool TryDequeue(out T? item) => _queue.TryDequeue(out item);\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Code Assessment",
    "topicId": "code-assessment",
    "source": "practice/sub-notes/code-assessment.md",
    "id": "card-188"
  },
  {
    "question": "Implement a simple TTL cache with expiration.",
    "answer": [
      {
        "type": "text",
        "content": "Store expiration and evict on read."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public sealed class TtlCache<TKey, TValue>\n{\n    private readonly Dictionary<TKey, (TValue Value, DateTime ExpiresAt)> _map = new();\n\n    public void Set(TKey key, TValue value, TimeSpan ttl)\n    {\n        _map[key] = (value, DateTime.UtcNow.Add(ttl));\n    }\n\n    public bool TryGet(TKey key, out TValue value)\n    {\n        if (_map.TryGetValue(key, out var entry) && entry.ExpiresAt > DateTime.UtcNow)\n        {\n            value = entry.Value;\n            return true;\n        }\n\n        _map.Remove(key);\n        value = default!;\n        return false;\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Code Assessment",
    "topicId": "code-assessment",
    "source": "practice/sub-notes/code-assessment.md",
    "id": "card-189"
  },
  {
    "question": "Parse a CSV stream into records without loading the full file.",
    "answer": [
      {
        "type": "text",
        "content": "Read line-by-line and yield rows."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public static IEnumerable<string[]> ReadCsv(Stream stream)\n{\n    using var reader = new StreamReader(stream);\n    string? line;\n    while ((line = reader.ReadLine()) is not null)\n    {\n        yield return line.Split(',');\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Code Assessment",
    "topicId": "code-assessment",
    "source": "practice/sub-notes/code-assessment.md",
    "id": "card-190"
  },
  {
    "question": "Compute a rolling VWAP from a stream of trades.",
    "answer": [
      {
        "type": "text",
        "content": "Maintain running sums of price * volume and volume."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "decimal notional = 0m;\ndecimal volume = 0m;\nforeach (var trade in trades)\n{\n    notional += trade.Price * trade.Volume;\n    volume += trade.Volume;\n    var vwap = volume == 0 ? 0 : notional / volume;\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Code Assessment",
    "topicId": "code-assessment",
    "source": "practice/sub-notes/code-assessment.md",
    "id": "card-191"
  },
  {
    "question": "Explain the difference between value types and reference types with a simple example.",
    "answer": [
      {
        "type": "text",
        "content": "Value types copy the data; reference types copy the reference. Mutations affect only the copied value, but references point to the same object."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var a = new Point { X = 1, Y = 2 };\nvar b = a; // copy\nb.X = 99;\n// a.X is still 1\n\nvar c = new Person { Name = \"Ana\" };\nvar d = c; // reference copy\nd.Name = \"Zoe\";\n// c.Name is now \"Zoe\"",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Csharp Fundamentals",
    "topicId": "csharp-fundamentals",
    "source": "practice/sub-notes/csharp-fundamentals.md",
    "id": "card-192"
  },
  {
    "question": "When should you choose a struct over a class?",
    "answer": [
      {
        "type": "text",
        "content": "Use structs for small, immutable, short-lived data without inheritance. Use classes for identity, polymorphism, or large mutable state. Structs reduce GC pressure by living inline and being collected with stack frames. Its data is stored on the stack (for locals), or inline inside another object (as part of that object’s memory). This means"
      },
      {
        "type": "list",
        "items": [
          "No separate heap allocation",
          "No object header",
          "No pointer indirection"
        ]
      },
      {
        "type": "text",
        "content": "Stack memory is automatically reclaimed when a method returns. No garbage collection is needed for stack-allocated data. This is much cheaper than heap allocation + GC."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public readonly struct Money\n{\n    public Money(decimal amount, string currency)\n    {\n        Amount = amount;\n        Currency = currency;\n    }\n\n    public decimal Amount { get; }\n    public string Currency { get; }\n}\n\nvoid Calculate()\n{\n    Money price = new Money(100, \"USD\");\n    // price is on the stack\n} // stack frame is popped → memory reclaimed immediately",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "⚠️ Structs are not always stack-allocated:"
      },
      {
        "type": "list",
        "items": [
          "If they are fields of a heap object, they live inside that object",
          "If they are boxed (cast to object or interface), they go to the heap",
          "Large structs copied often can hurt performance"
        ]
      }
    ],
    "category": "practice",
    "topic": "Csharp Fundamentals",
    "topicId": "csharp-fundamentals",
    "source": "practice/sub-notes/csharp-fundamentals.md",
    "id": "card-193"
  },
  {
    "question": "Demonstrate how to reduce copying with in parameters.",
    "answer": [
      {
        "type": "text",
        "content": "Use in for large structs to avoid defensive copies. A defensive copy is an automatic copy the runtime or compiler makes to protect data from being modified."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public static decimal CalculateTax(in Money price, decimal rate)\n{\n    return price.Amount * rate;\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "In C#, structs are value types, so they are normally copied when:"
      },
      {
        "type": "list",
        "items": [
          "Passed to a method",
          "Returned from a method",
          "Accessed through certain properties or interfaces"
        ]
      },
      {
        "type": "text",
        "content": "The copy exists to ensure that the original value cannot be changed unintentionally."
      },
      {
        "type": "list",
        "items": [
          "in passes the struct by reference, not by value",
          "The method receives a read-only reference",
          "No full struct copy is made"
        ]
      }
    ],
    "category": "practice",
    "topic": "Csharp Fundamentals",
    "topicId": "csharp-fundamentals",
    "source": "practice/sub-notes/csharp-fundamentals.md",
    "id": "card-194"
  },
  {
    "question": "What is defensive programming?",
    "answer": [
      {
        "type": "text",
        "content": "Defensive programming is the practice of anticipating invalid or unexpected inputs and handling them safely instead of assuming everything is correct."
      },
      {
        "type": "text",
        "content": "In practice, this means:"
      },
      {
        "type": "list",
        "items": [
          "Checking for null",
          "Validating inputs",
          "Failing early or providing safe defaults",
          "Making illegal states hard or impossible"
        ]
      }
    ],
    "category": "practice",
    "topic": "Csharp Fundamentals",
    "topicId": "csharp-fundamentals",
    "source": "practice/sub-notes/csharp-fundamentals.md",
    "id": "card-195"
  },
  {
    "question": "Show how nullable reference types prevent null bugs.",
    "answer": [
      {
        "type": "text",
        "content": "Enable nullability and use ? for optional references."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "#nullable enable\npublic string FormatName(string? name)\n{\n    if (string.IsNullOrWhiteSpace(name))\n        return \"Unknown\";\n\n    return name.Trim();\n}",
        "codeType": "neutral"
      },
      {
        "type": "list",
        "items": [
          "string? explicitly says: this value may be null",
          "The compiler forces you to handle the null case",
          "You can’t accidentally forget a null check without getting a warning"
        ]
      },
      {
        "type": "text",
        "content": "This moves defensive checks from runtime (NullReferenceException) to compile time (warnings/errors)"
      }
    ],
    "category": "practice",
    "topic": "Csharp Fundamentals",
    "topicId": "csharp-fundamentals",
    "source": "practice/sub-notes/csharp-fundamentals.md",
    "id": "card-196"
  },
  {
    "question": "Write a guard clause extension for argument validation.",
    "answer": [
      {
        "type": "text",
        "content": "Throw early for invalid inputs."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public static class Guard\n{\n    public static string NotNullOrEmpty(string? value, string paramName)\n    {\n        if (string.IsNullOrWhiteSpace(value))\n            throw new ArgumentException(\"Value is required\", paramName);\n        return value;\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Csharp Fundamentals",
    "topicId": "csharp-fundamentals",
    "source": "practice/sub-notes/csharp-fundamentals.md",
    "id": "card-197"
  },
  {
    "question": "Implement a generic method with a constraint for a parameterless constructor.",
    "answer": [
      {
        "type": "text",
        "content": "Use where T : new() when the type must be created. This allows instantiation inside the method (tells the compiler “T must be a type that has a public parameterless constructor.”)"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public static T Create<T>() where T : new()\n{\n    return new T();\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Csharp Fundamentals",
    "topicId": "csharp-fundamentals",
    "source": "practice/sub-notes/csharp-fundamentals.md",
    "id": "card-198"
  },
  {
    "question": "Write a repository interface with type constraints.",
    "answer": [
      {
        "type": "text",
        "content": "Constrain to a base entity so the repository can rely on shared properties."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface IRepository<T> where T : Entity\n{\n    Task<T?> GetByIdAsync(int id, CancellationToken ct = default);\n    Task AddAsync(T entity, CancellationToken ct = default);\n}\n\npublic abstract class Entity\n{\n    public int Id { get; set; }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Csharp Fundamentals",
    "topicId": "csharp-fundamentals",
    "source": "practice/sub-notes/csharp-fundamentals.md",
    "id": "card-199"
  },
  {
    "question": "Show a simple event pattern with EventHandler<T>.",
    "answer": [
      {
        "type": "text",
        "content": "Use events to publish changes without tight coupling."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class PriceTicker\n{\n    public event EventHandler<decimal>? PriceUpdated;\n\n    public void Update(decimal price)\n    {\n        PriceUpdated?.Invoke(this, price);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Csharp Fundamentals",
    "topicId": "csharp-fundamentals",
    "source": "practice/sub-notes/csharp-fundamentals.md",
    "id": "card-200"
  },
  {
    "question": "When would you prefer Func<T> over a custom delegate type?",
    "answer": [
      {
        "type": "text",
        "content": "Use Func for small, simple signatures; custom delegates for clarity and documentation."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "Func<int, int> square = x => x * x;",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Csharp Fundamentals",
    "topicId": "csharp-fundamentals",
    "source": "practice/sub-notes/csharp-fundamentals.md",
    "id": "card-201"
  },
  {
    "question": "Use pattern matching to categorize input.",
    "answer": [
      {
        "type": "text",
        "content": "Switch expressions make branching concise."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public static string Classify(object input) => input switch\n{\n    null => \"null\",\n    int i when i < 0 => \"negative int\",\n    int => \"positive int\",\n    string s when s.Length == 0 => \"empty string\",\n    string => \"string\",\n    _ => \"other\"\n};",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Csharp Fundamentals",
    "topicId": "csharp-fundamentals",
    "source": "practice/sub-notes/csharp-fundamentals.md",
    "id": "card-202"
  },
  {
    "question": "Create a record and use with to clone it.",
    "answer": [
      {
        "type": "text",
        "content": "Records simplify immutable data structures."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public record Trade(string Symbol, decimal Price, int Quantity);\n\nvar original = new Trade(\"EURUSD\", 1.0912m, 1000);\nvar updated = original with { Price = 1.0920m };",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Csharp Fundamentals",
    "topicId": "csharp-fundamentals",
    "source": "practice/sub-notes/csharp-fundamentals.md",
    "id": "card-203"
  },
  {
    "question": "Show how to throw and wrap exceptions with context.",
    "answer": [
      {
        "type": "text",
        "content": "Use specific exceptions and include context for debugging."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public static Order FindOrder(int id, IDictionary<int, Order> map)\n{\n    if (!map.TryGetValue(id, out var order))\n        throw new KeyNotFoundException($\"Order {id} was not found.\");\n\n    return order;\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Csharp Fundamentals",
    "topicId": "csharp-fundamentals",
    "source": "practice/sub-notes/csharp-fundamentals.md",
    "id": "card-204"
  },
  {
    "question": "Summarize access modifiers and demonstrate a safe class design.",
    "answer": [
      {
        "type": "text",
        "content": "Use private fields, expose behavior through public methods, and keep invariants inside."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class Position\n{\n    private decimal _quantity;\n\n    public decimal Quantity => _quantity;\n\n    public void Add(decimal quantity)\n    {\n        if (quantity <= 0)\n            throw new ArgumentOutOfRangeException(nameof(quantity));\n\n        _quantity += quantity;\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Csharp Fundamentals",
    "topicId": "csharp-fundamentals",
    "source": "practice/sub-notes/csharp-fundamentals.md",
    "id": "card-205"
  },
  {
    "question": "Demonstrate inheritance with a base order type and a specialized derived type.",
    "answer": [
      {
        "type": "text",
        "content": "Use inheritance for true \"is-a\" relationships and keep the base class focused."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public abstract class Order\n{\n    public Guid Id { get; init; }\n    public abstract decimal CalculateFees();\n}\n\npublic sealed class MarketOrder : Order\n{\n    public decimal Slippage { get; init; }\n    public override decimal CalculateFees() => Slippage * 0.1m;\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Csharp Fundamentals",
    "topicId": "csharp-fundamentals",
    "source": "practice/sub-notes/csharp-fundamentals.md",
    "id": "card-206"
  },
  {
    "question": "Show polymorphism by swapping fee calculators via an interface.",
    "answer": [
      {
        "type": "text",
        "content": "Code to an interface so the call site does not change when behavior changes."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface IFeeCalculator\n{\n    decimal Calculate(decimal notional);\n}\n\npublic sealed class MakerFeeCalculator : IFeeCalculator\n{\n    public decimal Calculate(decimal notional) => notional * 0.0002m;\n}\n\npublic sealed class TakerFeeCalculator : IFeeCalculator\n{\n    public decimal Calculate(decimal notional) => notional * 0.0005m;\n}\n\npublic decimal ComputeFees(IFeeCalculator calculator, decimal notional)\n{\n    return calculator.Calculate(notional);\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Csharp Fundamentals",
    "topicId": "csharp-fundamentals",
    "source": "practice/sub-notes/csharp-fundamentals.md",
    "id": "card-207"
  },
  {
    "question": "Use abstraction to define a minimal contract for a price feed.",
    "answer": [
      {
        "type": "text",
        "content": "Expose only the required behavior and hide implementation details."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public abstract class PriceFeed\n{\n    public abstract decimal GetBid(string symbol);\n}\n\npublic sealed class CachedPriceFeed : PriceFeed\n{\n    private readonly IDictionary<string, decimal> _cache;\n    public CachedPriceFeed(IDictionary<string, decimal> cache) => _cache = cache;\n    public override decimal GetBid(string symbol) => _cache[symbol];\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Csharp Fundamentals",
    "topicId": "csharp-fundamentals",
    "source": "practice/sub-notes/csharp-fundamentals.md",
    "id": "card-208"
  },
  {
    "question": "When should you prefer composition over inheritance?",
    "answer": [
      {
        "type": "text",
        "content": "Prefer composition when behavior changes at runtime or when you only need to reuse a small piece of behavior."
      }
    ],
    "category": "practice",
    "topic": "Csharp Fundamentals",
    "topicId": "csharp-fundamentals",
    "source": "practice/sub-notes/csharp-fundamentals.md",
    "id": "card-209"
  },
  {
    "question": "Show object and collection initialization with target-typed new.",
    "answer": [
      {
        "type": "text",
        "content": "Use concise syntax for readability."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var orders = new List<Order>\n{\n    new(\"A\", 10),\n    new(\"B\", 20)\n};",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Total Exercises: 16+"
      },
      {
        "type": "text",
        "content": "Practice each exercise by writing the code and explaining your choices out loud."
      }
    ],
    "category": "practice",
    "topic": "Csharp Fundamentals",
    "topicId": "csharp-fundamentals",
    "source": "practice/sub-notes/csharp-fundamentals.md",
    "id": "card-210"
  },
  {
    "question": "Write a SQL query to calculate the rolling 7-day trade volume per instrument.",
    "answer": [
      {
        "type": "text",
        "content": "Use window functions to calculate rolling aggregates."
      },
      {
        "type": "code",
        "language": "sql",
        "code": "WITH daily AS (\n    SELECT instrument_id,\n           trade_timestamp::date AS trade_date,\n           SUM(volume) AS daily_volume\n    FROM trades\n    GROUP BY instrument_id, trade_timestamp::date\n)\nSELECT instrument_id,\n       trade_date,\n       daily_volume,\n       SUM(daily_volume) OVER (\n           PARTITION BY instrument_id\n           ORDER BY trade_date\n           ROWS BETWEEN 6 PRECEDING AND CURRENT ROW\n       ) AS rolling_7d_volume\nFROM daily\nORDER BY instrument_id, trade_date;",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when need rolling metrics in SQL. Avoid when database lacks window functions—use app-side aggregation."
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-211"
  },
  {
    "question": "Explain how you would choose between normalized schemas and denormalized tables for reporting.",
    "answer": [
      {
        "type": "text",
        "content": "Normalized: reduces redundancy, good for OLTP. Changes cascade predictably, but reporting joins can be expensive. Denormalized: duplicates data for fast reads (reporting, analytics). Updates are more complex; rely on ETL pipelines to keep facts in sync. Choose based on workload: mixed? use hybrid star schema or CQRS approach with read-optimized projections."
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-212"
  },
  {
    "question": "Describe the differences between clustered and non-clustered indexes and when to use covering indexes.",
    "answer": [
      {
        "type": "text",
        "content": "Clustered: defines physical order, one per table; great for range scans. Non-clustered: separate structure pointing to data; can include columns."
      },
      {
        "type": "code",
        "language": "sql",
        "code": "CREATE NONCLUSTERED INDEX IX_Orders_Account_Status\n    ON Orders(AccountId, Status)\n    INCLUDE (CreatedAt, Amount);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use covering index when query needs subset of columns; avoid extra lookups. Avoid when frequent writes—maintaining many indexes hurts performance."
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-213"
  },
  {
    "question": "Walk through handling a long-running report query that impacts OLTP performance.",
    "answer": [
      {
        "type": "text",
        "content": "Strategies: read replicas, materialized views, batching, query hints, schedule off-peak. Consider breaking the query into smaller windowed segments and streaming results to avoid locking. Implement caching, pre-aggregation, and monitor execution plans for regressions."
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-214"
  },
  {
    "question": "Configure a many-to-many relationship with a junction table containing additional properties.",
    "answer": [
      {
        "type": "text",
        "content": "Use explicit junction entity with Fluent API."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Entities\npublic class Student\n{\n    public int Id { get; set; }\n    public string Name { get; set; }\n    public List<StudentCourse> StudentCourses { get; set; }\n}\n\npublic class Course\n{\n    public int Id { get; set; }\n    public string Title { get; set; }\n    public List<StudentCourse> StudentCourses { get; set; }\n}\n\npublic class StudentCourse\n{\n    public int StudentId { get; set; }\n    public Student Student { get; set; }\n\n    public int CourseId { get; set; }\n    public Course Course { get; set; }\n\n    // Additional properties\n    public DateTime EnrolledDate { get; set; }\n    public decimal Grade { get; set; }\n}\n\n// Configuration\npublic class StudentCourseConfiguration : IEntityTypeConfiguration<StudentCourse>\n{\n    public void Configure(EntityTypeBuilder<StudentCourse> builder)\n    {\n        builder.HasKey(sc => new { sc.StudentId, sc.CourseId });\n\n        builder.HasOne(sc => sc.Student)\n            .WithMany(s => s.StudentCourses)\n            .HasForeignKey(sc => sc.StudentId);\n\n        builder.HasOne(sc => sc.Course)\n            .WithMany(c => c.StudentCourses)\n            .HasForeignKey(sc => sc.CourseId);\n\n        builder.Property(sc => sc.EnrolledDate)\n            .HasDefaultValueSql(\"GETUTCDATE()\");\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-215"
  },
  {
    "question": "Implement soft delete with global query filters.",
    "answer": [
      {
        "type": "text",
        "content": "Use query filters to exclude deleted records automatically."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface ISoftDeletable\n{\n    bool IsDeleted { get; set; }\n    DateTime? DeletedAt { get; set; }\n}\n\npublic class Order : ISoftDeletable\n{\n    public Guid Id { get; set; }\n    public string OrderNumber { get; set; }\n    public bool IsDeleted { get; set; }\n    public DateTime? DeletedAt { get; set; }\n}\n\npublic class TradingDbContext : DbContext\n{\n    public DbSet<Order> Orders { get; set; }\n\n    protected override void OnModelCreating(ModelBuilder modelBuilder)\n    {\n        // Apply global query filter\n        modelBuilder.Entity<Order>()\n            .HasQueryFilter(o => !o.IsDeleted);\n\n        // Can apply to all entities implementing interface\n        foreach (var entityType in modelBuilder.Model.GetEntityTypes())\n        {\n            if (typeof(ISoftDeletable).IsAssignableFrom(entityType.ClrType))\n            {\n                var parameter = Expression.Parameter(entityType.ClrType, \"e\");\n                var property = Expression.Property(parameter, nameof(ISoftDeletable.IsDeleted));\n                var condition = Expression.Equal(property, Expression.Constant(false));\n                var lambda = Expression.Lambda(condition, parameter);\n\n                modelBuilder.Entity(entityType.ClrType).HasQueryFilter(lambda);\n            }\n        }\n    }\n\n    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)\n    {\n        // Intercept deletions and mark as soft deleted\n        foreach (var entry in ChangeTracker.Entries<ISoftDeletable>())\n        {\n            if (entry.State == EntityState.Deleted)\n            {\n                entry.State = EntityState.Modified;\n                entry.Entity.IsDeleted = true;\n                entry.Entity.DeletedAt = DateTime.UtcNow;\n            }\n        }\n\n        return base.SaveChangesAsync(cancellationToken);\n    }\n}\n\n// Query without filter (include deleted)\nvar allOrders = await context.Orders\n    .IgnoreQueryFilters()\n    .ToListAsync();",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-216"
  },
  {
    "question": "Implement optimistic concurrency control using row versioning.",
    "answer": [
      {
        "type": "text",
        "content": "Use timestamp/rowversion for conflict detection."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class Account\n{\n    public Guid Id { get; set; }\n    public string AccountNumber { get; set; }\n    public decimal Balance { get; set; }\n\n    [Timestamp]\n    public byte[] RowVersion { get; set; }\n}\n\n// Or with Fluent API\npublic class AccountConfiguration : IEntityTypeConfiguration<Account>\n{\n    public void Configure(EntityTypeBuilder<Account> builder)\n    {\n        builder.Property(a => a.RowVersion)\n            .IsRowVersion();\n    }\n}\n\n// Usage\npublic class AccountService\n{\n    private readonly TradingDbContext _context;\n\n    public async Task<bool> UpdateBalanceAsync(Guid accountId, decimal newBalance)\n    {\n        var maxRetries = 3;\n        var retryCount = 0;\n\n        while (retryCount < maxRetries)\n        {\n            try\n            {\n                var account = await _context.Accounts.FindAsync(accountId);\n                account.Balance = newBalance;\n\n                await _context.SaveChangesAsync();\n                return true;\n            }\n            catch (DbUpdateConcurrencyException ex)\n            {\n                retryCount++;\n\n                if (retryCount >= maxRetries)\n                {\n                    throw;\n                }\n\n                // Reload entity with current database values\n                var entry = ex.Entries.Single();\n                await entry.ReloadAsync();\n\n                // Optionally merge changes or apply custom logic\n            }\n        }\n\n        return false;\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-217"
  },
  {
    "question": "Configure table splitting to map multiple entities to a single table.",
    "answer": [
      {
        "type": "text",
        "content": "Share table between related entities."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class Order\n{\n    public Guid Id { get; set; }\n    public string OrderNumber { get; set; }\n    public OrderDetails Details { get; set; }\n}\n\npublic class OrderDetails\n{\n    public Guid OrderId { get; set; }\n    public string Notes { get; set; }\n    public string ShippingInstructions { get; set; }\n}\n\npublic class OrderConfiguration : IEntityTypeConfiguration<Order>\n{\n    public void Configure(EntityTypeBuilder<Order> builder)\n    {\n        builder.ToTable(\"Orders\");\n        builder.HasKey(o => o.Id);\n\n        builder.HasOne(o => o.Details)\n            .WithOne()\n            .HasForeignKey<OrderDetails>(d => d.OrderId);\n\n        builder.OwnsOne(o => o.Details, details =>\n        {\n            details.ToTable(\"Orders\"); // Same table\n        });\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-218"
  },
  {
    "question": "Implement audit trail using change tracking.",
    "answer": [
      {
        "type": "text",
        "content": "Track who/when modified entities."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface IAuditable\n{\n    DateTime CreatedAt { get; set; }\n    string CreatedBy { get; set; }\n    DateTime? ModifiedAt { get; set; }\n    string ModifiedBy { get; set; }\n}\n\npublic class Order : IAuditable\n{\n    public Guid Id { get; set; }\n    public string OrderNumber { get; set; }\n    public DateTime CreatedAt { get; set; }\n    public string CreatedBy { get; set; }\n    public DateTime? ModifiedAt { get; set; }\n    public string ModifiedBy { get; set; }\n}\n\npublic class TradingDbContext : DbContext\n{\n    private readonly IHttpContextAccessor _httpContextAccessor;\n\n    public TradingDbContext(\n        DbContextOptions<TradingDbContext> options,\n        IHttpContextAccessor httpContextAccessor)\n        : base(options)\n    {\n        _httpContextAccessor = httpContextAccessor;\n    }\n\n    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)\n    {\n        var userId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value\n            ?? \"system\";\n\n        var entries = ChangeTracker.Entries<IAuditable>();\n\n        foreach (var entry in entries)\n        {\n            switch (entry.State)\n            {\n                case EntityState.Added:\n                    entry.Entity.CreatedAt = DateTime.UtcNow;\n                    entry.Entity.CreatedBy = userId;\n                    break;\n\n                case EntityState.Modified:\n                    entry.Entity.ModifiedAt = DateTime.UtcNow;\n                    entry.Entity.ModifiedBy = userId;\n                    break;\n            }\n        }\n\n        return base.SaveChangesAsync(cancellationToken);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-219"
  },
  {
    "question": "Implement repository pattern with specification pattern for complex queries.",
    "answer": [
      {
        "type": "text",
        "content": "Encapsulate query logic in reusable specifications."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Specification interface\npublic interface ISpecification<T>\n{\n    Expression<Func<T, bool>> Criteria { get; }\n    List<Expression<Func<T, object>>> Includes { get; }\n    List<string> IncludeStrings { get; }\n    Expression<Func<T, object>> OrderBy { get; }\n    Expression<Func<T, object>> OrderByDescending { get; }\n    int Take { get; }\n    int Skip { get; }\n    bool IsPagingEnabled { get; }\n}\n\n// Base specification\npublic abstract class BaseSpecification<T> : ISpecification<T>\n{\n    public Expression<Func<T, bool>> Criteria { get; private set; }\n    public List<Expression<Func<T, object>>> Includes { get; } = new();\n    public List<string> IncludeStrings { get; } = new();\n    public Expression<Func<T, object>> OrderBy { get; private set; }\n    public Expression<Func<T, object>> OrderByDescending { get; private set; }\n    public int Take { get; private set; }\n    public int Skip { get; private set; }\n    public bool IsPagingEnabled { get; private set; }\n\n    protected BaseSpecification(Expression<Func<T, bool>> criteria)\n    {\n        Criteria = criteria;\n    }\n\n    protected void AddInclude(Expression<Func<T, object>> includeExpression)\n    {\n        Includes.Add(includeExpression);\n    }\n\n    protected void AddInclude(string includeString)\n    {\n        IncludeStrings.Add(includeString);\n    }\n\n    protected void ApplyOrderBy(Expression<Func<T, object>> orderByExpression)\n    {\n        OrderBy = orderByExpression;\n    }\n\n    protected void ApplyOrderByDescending(Expression<Func<T, object>> orderByDescExpression)\n    {\n        OrderByDescending = orderByDescExpression;\n    }\n\n    protected void ApplyPaging(int skip, int take)\n    {\n        Skip = skip;\n        Take = take;\n        IsPagingEnabled = true;\n    }\n}\n\n// Concrete specification\npublic class OrdersByCustomerSpec : BaseSpecification<Order>\n{\n    public OrdersByCustomerSpec(Guid customerId, DateTime? fromDate = null, DateTime? toDate = null)\n        : base(o => o.CustomerId == customerId &&\n                   (!fromDate.HasValue || o.CreatedAt >= fromDate.Value) &&\n                   (!toDate.HasValue || o.CreatedAt <= toDate.Value))\n    {\n        AddInclude(o => o.Items);\n        AddInclude(o => o.Customer);\n        ApplyOrderByDescending(o => o.CreatedAt);\n    }\n}\n\n// Repository with specification support\npublic class Repository<T> : IRepository<T> where T : class\n{\n    private readonly DbContext _context;\n\n    public Repository(DbContext context)\n    {\n        _context = context;\n    }\n\n    public async Task<List<T>> ListAsync(ISpecification<T> spec)\n    {\n        var query = ApplySpecification(spec);\n        return await query.ToListAsync();\n    }\n\n    public async Task<int> CountAsync(ISpecification<T> spec)\n    {\n        var query = ApplySpecification(spec);\n        return await query.CountAsync();\n    }\n\n    private IQueryable<T> ApplySpecification(ISpecification<T> spec)\n    {\n        return SpecificationEvaluator<T>.GetQuery(_context.Set<T>().AsQueryable(), spec);\n    }\n}\n\n// Specification evaluator\npublic class SpecificationEvaluator<T> where T : class\n{\n    public static IQueryable<T> GetQuery(IQueryable<T> inputQuery, ISpecification<T> spec)\n    {\n        var query = inputQuery;\n\n        if (spec.Criteria != null)\n        {\n            query = query.Where(spec.Criteria);\n        }\n\n        query = spec.Includes.Aggregate(query, (current, include) => current.Include(include));\n        query = spec.IncludeStrings.Aggregate(query, (current, include) => current.Include(include));\n\n        if (spec.OrderBy != null)\n        {\n            query = query.OrderBy(spec.OrderBy);\n        }\n        else if (spec.OrderByDescending != null)\n        {\n            query = query.OrderByDescending(spec.OrderByDescending);\n        }\n\n        if (spec.IsPagingEnabled)\n        {\n            query = query.Skip(spec.Skip).Take(spec.Take);\n        }\n\n        return query;\n    }\n}\n\n// Usage\nvar spec = new OrdersByCustomerSpec(customerId, fromDate: DateTime.UtcNow.AddDays(-30));\nvar orders = await repository.ListAsync(spec);",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-220"
  },
  {
    "question": "Implement Unit of Work pattern for transaction management.",
    "answer": [
      {
        "type": "text",
        "content": "Coordinate multiple repositories in a single transaction."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface IUnitOfWork : IDisposable\n{\n    IRepository<T> Repository<T>() where T : class;\n    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);\n    Task BeginTransactionAsync();\n    Task CommitTransactionAsync();\n    Task RollbackTransactionAsync();\n}\n\npublic class UnitOfWork : IUnitOfWork\n{\n    private readonly DbContext _context;\n    private IDbContextTransaction _transaction;\n    private readonly Dictionary<Type, object> _repositories = new();\n\n    public UnitOfWork(DbContext context)\n    {\n        _context = context;\n    }\n\n    public IRepository<T> Repository<T>() where T : class\n    {\n        var type = typeof(T);\n\n        if (!_repositories.ContainsKey(type))\n        {\n            _repositories[type] = new Repository<T>(_context);\n        }\n\n        return (IRepository<T>)_repositories[type];\n    }\n\n    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)\n    {\n        return await _context.SaveChangesAsync(cancellationToken);\n    }\n\n    public async Task BeginTransactionAsync()\n    {\n        _transaction = await _context.Database.BeginTransactionAsync();\n    }\n\n    public async Task CommitTransactionAsync()\n    {\n        try\n        {\n            await _context.SaveChangesAsync();\n            await _transaction.CommitAsync();\n        }\n        catch\n        {\n            await RollbackTransactionAsync();\n            throw;\n        }\n        finally\n        {\n            _transaction?.Dispose();\n            _transaction = null;\n        }\n    }\n\n    public async Task RollbackTransactionAsync()\n    {\n        await _transaction?.RollbackAsync();\n        _transaction?.Dispose();\n        _transaction = null;\n    }\n\n    public void Dispose()\n    {\n        _transaction?.Dispose();\n        _context?.Dispose();\n    }\n}\n\n// Usage\npublic class OrderService\n{\n    private readonly IUnitOfWork _unitOfWork;\n\n    public async Task CreateOrderAsync(CreateOrderCommand command)\n    {\n        await _unitOfWork.BeginTransactionAsync();\n\n        try\n        {\n            var order = new Order { /* ... */ };\n            await _unitOfWork.Repository<Order>().AddAsync(order);\n\n            var inventory = await _unitOfWork.Repository<Inventory>()\n                .GetByIdAsync(command.ProductId);\n            inventory.Quantity -= command.Quantity;\n\n            await _unitOfWork.CommitTransactionAsync();\n        }\n        catch\n        {\n            await _unitOfWork.RollbackTransactionAsync();\n            throw;\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-221"
  },
  {
    "question": "Implement custom value converter for complex types.",
    "answer": [
      {
        "type": "text",
        "content": "Convert between property types and database columns."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class Money\n{\n    public decimal Amount { get; }\n    public string Currency { get; }\n\n    public Money(decimal amount, string currency)\n    {\n        Amount = amount;\n        Currency = currency ?? throw new ArgumentNullException(nameof(currency));\n    }\n}\n\npublic class MoneyConverter : ValueConverter<Money, string>\n{\n    public MoneyConverter()\n        : base(\n            money => $\"{money.Amount}|{money.Currency}\",\n            str => FromString(str))\n    {\n    }\n\n    private static Money FromString(string value)\n    {\n        var parts = value.Split('|');\n        return new Money(decimal.Parse(parts[0]), parts[1]);\n    }\n}\n\n// Configuration\npublic class OrderConfiguration : IEntityTypeConfiguration<Order>\n{\n    public void Configure(EntityTypeBuilder<Order> builder)\n    {\n        builder.Property(o => o.TotalAmount)\n            .HasConversion(new MoneyConverter())\n            .HasColumnName(\"TotalAmount\");\n    }\n}\n\n// Alternative: JSON conversion for complex objects\npublic class Address\n{\n    public string Street { get; set; }\n    public string City { get; set; }\n    public string ZipCode { get; set; }\n}\n\npublic class AddressConverter : ValueConverter<Address, string>\n{\n    public AddressConverter()\n        : base(\n            address => JsonSerializer.Serialize(address, (JsonSerializerOptions)null),\n            json => JsonSerializer.Deserialize<Address>(json, (JsonSerializerOptions)null))\n    {\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-222"
  },
  {
    "question": "Optimize a query with multiple joins and aggregations.",
    "answer": [
      {
        "type": "text",
        "content": "Analyze execution plan and apply optimizations."
      },
      {
        "type": "code",
        "language": "sql",
        "code": "-- ❌ Slow query\nSELECT c.CustomerName,\n       COUNT(o.OrderId) AS OrderCount,\n       SUM(oi.Quantity * oi.UnitPrice) AS TotalSpent\nFROM Customers c\nLEFT JOIN Orders o ON c.CustomerId = o.CustomerId\nLEFT JOIN OrderItems oi ON o.OrderId = oi.OrderId\nWHERE o.OrderDate >= '2024-01-01'\nGROUP BY c.CustomerId, c.CustomerName\nHAVING SUM(oi.Quantity * oi.UnitPrice) > 1000\nORDER BY TotalSpent DESC;\n\n-- ✅ Optimized with CTE and proper indexing\n-- First, create covering indexes:\nCREATE NONCLUSTERED INDEX IX_Orders_CustomerId_OrderDate\n    ON Orders(CustomerId, OrderDate)\n    INCLUDE (OrderId);\n\nCREATE NONCLUSTERED INDEX IX_OrderItems_OrderId\n    ON OrderItems(OrderId)\n    INCLUDE (Quantity, UnitPrice);\n\n-- Optimized query\nWITH OrderTotals AS (\n    SELECT o.CustomerId,\n           COUNT(DISTINCT o.OrderId) AS OrderCount,\n           SUM(oi.Quantity * oi.UnitPrice) AS TotalSpent\n    FROM Orders o\n    INNER JOIN OrderItems oi ON o.OrderId = oi.OrderId\n    WHERE o.OrderDate >= '2024-01-01'\n    GROUP BY o.CustomerId\n    HAVING SUM(oi.Quantity * oi.UnitPrice) > 1000\n)\nSELECT c.CustomerName,\n       ot.OrderCount,\n       ot.TotalSpent\nFROM Customers c\nINNER JOIN OrderTotals ot ON c.CustomerId = ot.CustomerId\nORDER BY ot.TotalSpent DESC;",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-223"
  },
  {
    "question": "Implement pagination efficiently for large datasets.",
    "answer": [
      {
        "type": "text",
        "content": "Use OFFSET/FETCH or keyset pagination."
      },
      {
        "type": "code",
        "language": "sql",
        "code": "-- ❌ Slow for large offsets\nSELECT OrderId, OrderNumber, CreatedAt\nFROM Orders\nORDER BY CreatedAt DESC\nOFFSET 10000 ROWS\nFETCH NEXT 20 ROWS ONLY;\n\n-- ✅ Keyset pagination (seek method)\n-- First page\nSELECT TOP 20 OrderId, OrderNumber, CreatedAt\nFROM Orders\nORDER BY CreatedAt DESC, OrderId DESC;\n\n-- Next page (using last CreatedAt and OrderId from previous page)\nSELECT TOP 20 OrderId, OrderNumber, CreatedAt\nFROM Orders\nWHERE CreatedAt < @LastCreatedAt\n   OR (CreatedAt = @LastCreatedAt AND OrderId < @LastOrderId)\nORDER BY CreatedAt DESC, OrderId DESC;\n\n-- Index for keyset pagination\nCREATE NONCLUSTERED INDEX IX_Orders_CreatedAt_OrderId\n    ON Orders(CreatedAt DESC, OrderId DESC)\n    INCLUDE (OrderNumber);",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-224"
  },
  {
    "question": "Optimize EXISTS vs IN vs JOIN.",
    "answer": [
      {
        "type": "text",
        "content": "Choose based on data characteristics and cardinality."
      },
      {
        "type": "code",
        "language": "sql",
        "code": "-- Scenario: Find customers who have placed orders\n\n-- ✅ EXISTS - Best when checking existence (stops at first match)\nSELECT c.CustomerId, c.CustomerName\nFROM Customers c\nWHERE EXISTS (\n    SELECT 1\n    FROM Orders o\n    WHERE o.CustomerId = c.CustomerId\n);\n\n-- ❌ IN - Slower with large subquery results\nSELECT c.CustomerId, c.CustomerName\nFROM Customers c\nWHERE c.CustomerId IN (\n    SELECT DISTINCT CustomerId\n    FROM Orders\n);\n\n-- ✅ INNER JOIN with DISTINCT - Good for retrieving additional columns\nSELECT DISTINCT c.CustomerId, c.CustomerName\nFROM Customers c\nINNER JOIN Orders o ON c.CustomerId = o.CustomerId;\n\n-- NOT EXISTS vs NOT IN\n-- ✅ NOT EXISTS - Handles NULLs correctly\nSELECT c.CustomerId, c.CustomerName\nFROM Customers c\nWHERE NOT EXISTS (\n    SELECT 1\n    FROM Orders o\n    WHERE o.CustomerId = c.CustomerId\n);\n\n-- ❌ NOT IN - Returns empty if subquery contains NULL\nSELECT c.CustomerId, c.CustomerName\nFROM Customers c\nWHERE c.CustomerId NOT IN (\n    SELECT CustomerId\n    FROM Orders\n    WHERE CustomerId IS NOT NULL  -- Must exclude NULLs!\n);",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-225"
  },
  {
    "question": "Use window functions for ranking and percentiles.",
    "answer": [
      {
        "type": "text",
        "content": "Calculate rankings without self-joins."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "-- Rank products by sales within each category\nSELECT ProductId,\n       CategoryId,\n       ProductName,\n       TotalSales,\n       ROW_NUMBER() OVER (PARTITION BY CategoryId ORDER BY TotalSales DESC) AS SalesRank,\n       RANK() OVER (PARTITION BY CategoryId ORDER BY TotalSales DESC) AS SalesRankWithTies,\n       DENSE_RANK() OVER (PARTITION BY CategoryId ORDER BY TotalSales DESC) AS DenseSalesRank,\n       PERCENT_RANK() OVER (PARTITION BY CategoryId ORDER BY TotalSales DESC) AS PercentileRank,\n       NTILE(4) OVER (PARTITION BY CategoryId ORDER BY TotalSales DESC) AS Quartile\nFROM (\n    SELECT p.ProductId,\n           p.CategoryId,\n           p.ProductName,\n           SUM(oi.Quantity * oi.UnitPrice) AS TotalSales\n    FROM Products p\n    INNER JOIN OrderItems oi ON p.ProductId = oi.ProductId\n    GROUP BY p.ProductId, p.CategoryId, p.ProductName\n) AS ProductSales;\n\n-- Calculate running totals\nSELECT OrderDate,\n       OrderId,\n       Amount,\n       SUM(Amount) OVER (ORDER BY OrderDate, OrderId ROWS UNBOUNDED PRECEDING) AS RunningTotal,\n       AVG(Amount) OVER (ORDER BY OrderDate ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS MovingAvg7Day\nFROM Orders\nORDER BY OrderDate, OrderId;",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-226"
  },
  {
    "question": "Design composite index for a multi-column WHERE clause.",
    "answer": [
      {
        "type": "text",
        "content": "Order columns by selectivity and usage patterns."
      },
      {
        "type": "code",
        "language": "sql",
        "code": "-- Query pattern\nSELECT OrderId, CustomerId, OrderDate, Status, TotalAmount\nFROM Orders\nWHERE CustomerId = @CustomerId\n  AND Status = @Status\n  AND OrderDate >= @StartDate\n  AND OrderDate < @EndDate;\n\n-- ✅ Optimal composite index (equality → range)\nCREATE NONCLUSTERED INDEX IX_Orders_CustomerId_Status_OrderDate\n    ON Orders(CustomerId, Status, OrderDate)\n    INCLUDE (TotalAmount);\n\n-- Index usage statistics\nSELECT OBJECT_NAME(s.object_id) AS TableName,\n       i.name AS IndexName,\n       s.user_seeks,\n       s.user_scans,\n       s.user_lookups,\n       s.user_updates,\n       s.last_user_seek,\n       s.last_user_scan\nFROM sys.dm_db_index_usage_stats s\nINNER JOIN sys.indexes i ON s.object_id = i.object_id AND s.index_id = i.index_id\nWHERE s.database_id = DB_ID()\n  AND OBJECT_NAME(s.object_id) = 'Orders'\nORDER BY s.user_seeks + s.user_scans + s.user_lookups DESC;",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-227"
  },
  {
    "question": "Identify and remove unused or duplicate indexes.",
    "answer": [
      {
        "type": "text",
        "content": "Find indexes with low usage and high maintenance cost."
      },
      {
        "type": "code",
        "language": "sql",
        "code": "-- Find unused indexes\nSELECT OBJECT_NAME(i.object_id) AS TableName,\n       i.name AS IndexName,\n       i.type_desc AS IndexType,\n       s.user_seeks,\n       s.user_scans,\n       s.user_lookups,\n       s.user_updates,\n       (s.user_updates - (s.user_seeks + s.user_scans + s.user_lookups)) AS UpdateOverhead\nFROM sys.indexes i\nLEFT JOIN sys.dm_db_index_usage_stats s\n    ON i.object_id = s.object_id AND i.index_id = s.index_id AND s.database_id = DB_ID()\nWHERE OBJECTPROPERTY(i.object_id, 'IsUserTable') = 1\n  AND i.type_desc <> 'CLUSTERED'\n  AND i.is_primary_key = 0\n  AND i.is_unique_constraint = 0\n  AND (s.user_seeks + s.user_scans + s.user_lookups = 0 OR s.user_seeks IS NULL)\nORDER BY s.user_updates DESC;\n\n-- Find duplicate indexes\nWITH IndexColumns AS (\n    SELECT i.object_id,\n           i.index_id,\n           i.name AS IndexName,\n           STRING_AGG(c.name, ', ') WITHIN GROUP (ORDER BY ic.key_ordinal) AS KeyColumns,\n           STRING_AGG(c.name, ', ') WITHIN GROUP (ORDER BY ic.index_column_id) AS IncludedColumns\n    FROM sys.indexes i\n    INNER JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id\n    INNER JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id\n    WHERE i.type_desc = 'NONCLUSTERED'\n    GROUP BY i.object_id, i.index_id, i.name\n)\nSELECT OBJECT_NAME(a.object_id) AS TableName,\n       a.IndexName AS Index1,\n       b.IndexName AS Index2,\n       a.KeyColumns,\n       a.IncludedColumns\nFROM IndexColumns a\nINNER JOIN IndexColumns b\n    ON a.object_id = b.object_id\n   AND a.index_id < b.index_id\n   AND a.KeyColumns = b.KeyColumns\n   AND (a.IncludedColumns = b.IncludedColumns OR a.IncludedColumns IS NULL AND b.IncludedColumns IS NULL);",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-228"
  },
  {
    "question": "Implement filtered index for specific query patterns.",
    "answer": [
      {
        "type": "text",
        "content": "Create indexes for subsets of data."
      },
      {
        "type": "code",
        "language": "sql",
        "code": "-- Only index active orders\nCREATE NONCLUSTERED INDEX IX_Orders_Active_CreatedAt\n    ON Orders(CreatedAt DESC)\n    INCLUDE (CustomerId, TotalAmount)\n    WHERE Status IN ('Pending', 'Processing');\n\n-- Index non-null values only\nCREATE NONCLUSTERED INDEX IX_Orders_CompletedDate\n    ON Orders(CompletedDate)\n    WHERE CompletedDate IS NOT NULL;\n\n-- Index specific date range (partitioning effect)\nCREATE NONCLUSTERED INDEX IX_Orders_Recent\n    ON Orders(OrderDate DESC, CustomerId)\n    INCLUDE (TotalAmount)\n    WHERE OrderDate >= '2024-01-01';",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-229"
  },
  {
    "question": "Implement distributed transaction across multiple databases.",
    "answer": [
      {
        "type": "text",
        "content": "Use TransactionScope for coordinated transactions."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class DistributedTransactionService\n{\n    private readonly DbContext _ordersContext;\n    private readonly DbContext _inventoryContext;\n    private readonly DbContext _accountingContext;\n\n    public async Task ProcessOrderAsync(CreateOrderCommand command)\n    {\n        var transactionOptions = new TransactionOptions\n        {\n            IsolationLevel = System.Transactions.IsolationLevel.ReadCommitted,\n            Timeout = TimeSpan.FromSeconds(30)\n        };\n\n        using var scope = new TransactionScope(\n            TransactionScopeOption.Required,\n            transactionOptions,\n            TransactionScopeAsyncFlowOption.Enabled);\n\n        try\n        {\n            // Database 1: Orders\n            var order = new Order\n            {\n                Id = Guid.NewGuid(),\n                CustomerId = command.CustomerId,\n                TotalAmount = command.TotalAmount\n            };\n            _ordersContext.Orders.Add(order);\n            await _ordersContext.SaveChangesAsync();\n\n            // Database 2: Inventory\n            var inventory = await _inventoryContext.Inventory\n                .FirstOrDefaultAsync(i => i.ProductId == command.ProductId);\n            inventory.Quantity -= command.Quantity;\n            await _inventoryContext.SaveChangesAsync();\n\n            // Database 3: Accounting\n            var transaction = new AccountingTransaction\n            {\n                OrderId = order.Id,\n                Amount = command.TotalAmount,\n                Type = TransactionType.Sale\n            };\n            _accountingContext.Transactions.Add(transaction);\n            await _accountingContext.SaveChangesAsync();\n\n            // Commit all or rollback all\n            scope.Complete();\n        }\n        catch (Exception ex)\n        {\n            // Transaction automatically rolls back if scope.Complete() not called\n            throw;\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-230"
  },
  {
    "question": "Handle deadlocks with retry logic.",
    "answer": [
      {
        "type": "text",
        "content": "Detect and retry deadlock victims."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class DeadlockRetryService\n{\n    private const int MaxRetries = 3;\n    private static readonly int[] DeadlockErrorNumbers = { 1205 }; // SQL Server deadlock\n\n    public async Task<T> ExecuteWithRetryAsync<T>(Func<Task<T>> operation)\n    {\n        for (int attempt = 0; attempt < MaxRetries; attempt++)\n        {\n            try\n            {\n                return await operation();\n            }\n            catch (DbUpdateException ex) when (IsDeadlock(ex) && attempt < MaxRetries - 1)\n            {\n                var delay = TimeSpan.FromMilliseconds(Math.Pow(2, attempt) * 100);\n                await Task.Delay(delay);\n            }\n        }\n\n        return await operation(); // Last attempt without catching\n    }\n\n    private bool IsDeadlock(Exception ex)\n    {\n        if (ex.InnerException is SqlException sqlEx)\n        {\n            return DeadlockErrorNumbers.Contains(sqlEx.Number);\n        }\n        return false;\n    }\n}\n\n// Usage\nvar result = await _retryService.ExecuteWithRetryAsync(async () =>\n{\n    await using var transaction = await _context.Database.BeginTransactionAsync(\n        IsolationLevel.ReadCommitted);\n\n    try\n    {\n        // Perform operations\n        var account = await _context.Accounts.FindAsync(accountId);\n        account.Balance += amount;\n\n        await _context.SaveChangesAsync();\n        await transaction.CommitAsync();\n\n        return account.Balance;\n    }\n    catch\n    {\n        await transaction.RollbackAsync();\n        throw;\n    }\n});",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-231"
  },
  {
    "question": "Implement pessimistic locking for critical sections.",
    "answer": [
      {
        "type": "text",
        "content": "Use row-level locks to prevent concurrent modifications."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// SQL Server\npublic async Task<Account> GetAccountWithLockAsync(Guid accountId)\n{\n    var account = await _context.Accounts\n        .FromSqlRaw(@\"\n            SELECT * FROM Accounts WITH (UPDLOCK, ROWLOCK)\n            WHERE Id = {0}\",\n            accountId)\n        .FirstOrDefaultAsync();\n\n    return account;\n}\n\n// PostgreSQL\npublic async Task<Account> GetAccountWithLockPgAsync(Guid accountId)\n{\n    var account = await _context.Accounts\n        .FromSqlRaw(@\"\n            SELECT * FROM \"\"Accounts\"\"\n            WHERE \"\"Id\"\" = {0}\n            FOR UPDATE\",\n            accountId)\n        .FirstOrDefaultAsync();\n\n    return account;\n}\n\n// Usage in transaction\nawait using var transaction = await _context.Database.BeginTransactionAsync();\n\ntry\n{\n    var account = await GetAccountWithLockAsync(accountId);\n    account.Balance += amount;\n\n    await _context.SaveChangesAsync();\n    await transaction.CommitAsync();\n}\ncatch\n{\n    await transaction.RollbackAsync();\n    throw;\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-232"
  },
  {
    "question": "Create a data migration to transform existing records.",
    "answer": [
      {
        "type": "text",
        "content": "Use migration with custom SQL or code."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public partial class MigrateOrderStatuses : Migration\n{\n    protected override void Up(MigrationBuilder migrationBuilder)\n    {\n        // Add new column\n        migrationBuilder.AddColumn<string>(\n            name: \"StatusV2\",\n            table: \"Orders\",\n            type: \"nvarchar(50)\",\n            nullable: true);\n\n        // Migrate data\n        migrationBuilder.Sql(@\"\n            UPDATE Orders\n            SET StatusV2 = CASE Status\n                WHEN 0 THEN 'Pending'\n                WHEN 1 THEN 'Processing'\n                WHEN 2 THEN 'Shipped'\n                WHEN 3 THEN 'Delivered'\n                WHEN 4 THEN 'Cancelled'\n                ELSE 'Unknown'\n            END\");\n\n        // Make new column required\n        migrationBuilder.AlterColumn<string>(\n            name: \"StatusV2\",\n            table: \"Orders\",\n            type: \"nvarchar(50)\",\n            nullable: false);\n\n        // Drop old column\n        migrationBuilder.DropColumn(\n            name: \"Status\",\n            table: \"Orders\");\n\n        // Rename column\n        migrationBuilder.RenameColumn(\n            name: \"StatusV2\",\n            table: \"Orders\",\n            newName: \"Status\");\n    }\n\n    protected override void Down(MigrationBuilder migrationBuilder)\n    {\n        // Reverse migration\n        migrationBuilder.RenameColumn(\n            name: \"Status\",\n            table: \"Orders\",\n            newName: \"StatusV2\");\n\n        migrationBuilder.AddColumn<int>(\n            name: \"Status\",\n            table: \"Orders\",\n            type: \"int\",\n            nullable: false,\n            defaultValue: 0);\n\n        migrationBuilder.Sql(@\"\n            UPDATE Orders\n            SET Status = CASE StatusV2\n                WHEN 'Pending' THEN 0\n                WHEN 'Processing' THEN 1\n                WHEN 'Shipped' THEN 2\n                WHEN 'Delivered' THEN 3\n                WHEN 'Cancelled' THEN 4\n                ELSE 0\n            END\");\n\n        migrationBuilder.DropColumn(\n            name: \"StatusV2\",\n            table: \"Orders\");\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-233"
  },
  {
    "question": "Implement zero-downtime deployment with backward-compatible migrations.",
    "answer": [
      {
        "type": "text",
        "content": "Use expand-contract pattern."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Step 1: Expand - Add new column (backward compatible)\npublic partial class AddEmailColumn : Migration\n{\n    protected override void Up(MigrationBuilder migrationBuilder)\n    {\n        migrationBuilder.AddColumn<string>(\n            name: \"Email\",\n            table: \"Customers\",\n            nullable: true);  // Allow null for backward compatibility\n    }\n}\n\n// Step 2: Deploy new code that writes to both old and new columns\n\n// Step 3: Backfill - Migrate existing data\npublic partial class BackfillEmail : Migration\n{\n    protected override void Up(MigrationBuilder migrationBuilder)\n    {\n        migrationBuilder.Sql(@\"\n            UPDATE Customers\n            SET Email = ContactEmail\n            WHERE Email IS NULL AND ContactEmail IS NOT NULL\");\n    }\n}\n\n// Step 4: Deploy code that reads from new column only\n\n// Step 5: Contract - Remove old column\npublic partial class RemoveContactEmailColumn : Migration\n{\n    protected override void Up(MigrationBuilder migrationBuilder)\n    {\n        migrationBuilder.DropColumn(\n            name: \"ContactEmail\",\n            table: \"Customers\");\n\n        // Make new column required\n        migrationBuilder.AlterColumn<string>(\n            name: \"Email\",\n            table: \"Customers\",\n            nullable: false);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-234"
  },
  {
    "question": "Use Dapper for high-performance bulk operations.",
    "answer": [
      {
        "type": "text",
        "content": "Execute raw SQL with minimal overhead."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class DapperOrderRepository\n{\n    private readonly IDbConnection _connection;\n\n    public DapperOrderRepository(IDbConnection connection)\n    {\n        _connection = connection;\n    }\n\n    public async Task<IEnumerable<Order>> GetOrdersByCustomerAsync(Guid customerId)\n    {\n        const string sql = @\"\n            SELECT o.OrderId, o.OrderNumber, o.CustomerId, o.TotalAmount, o.CreatedAt,\n                   oi.OrderItemId, oi.OrderId, oi.ProductId, oi.Quantity, oi.UnitPrice\n            FROM Orders o\n            INNER JOIN OrderItems oi ON o.OrderId = oi.OrderId\n            WHERE o.CustomerId = @CustomerId\n            ORDER BY o.CreatedAt DESC\";\n\n        var orderDict = new Dictionary<Guid, Order>();\n\n        var orders = await _connection.QueryAsync<Order, OrderItem, Order>(\n            sql,\n            (order, orderItem) =>\n            {\n                if (!orderDict.TryGetValue(order.OrderId, out var currentOrder))\n                {\n                    currentOrder = order;\n                    currentOrder.Items = new List<OrderItem>();\n                    orderDict.Add(order.OrderId, currentOrder);\n                }\n\n                currentOrder.Items.Add(orderItem);\n                return currentOrder;\n            },\n            new { CustomerId = customerId },\n            splitOn: \"OrderItemId\");\n\n        return orderDict.Values;\n    }\n\n    public async Task<int> BulkInsertOrdersAsync(IEnumerable<Order> orders)\n    {\n        const string sql = @\"\n            INSERT INTO Orders (OrderId, OrderNumber, CustomerId, TotalAmount, CreatedAt)\n            VALUES (@OrderId, @OrderNumber, @CustomerId, @TotalAmount, @CreatedAt)\";\n\n        return await _connection.ExecuteAsync(sql, orders);\n    }\n\n    public async Task<IEnumerable<OrderSummary>> GetOrderSummariesAsync(DateTime fromDate)\n    {\n        const string sql = @\"\n            SELECT c.CustomerName,\n                   COUNT(o.OrderId) AS OrderCount,\n                   SUM(o.TotalAmount) AS TotalSpent\n            FROM Customers c\n            INNER JOIN Orders o ON c.CustomerId = o.CustomerId\n            WHERE o.CreatedAt >= @FromDate\n            GROUP BY c.CustomerId, c.CustomerName\n            HAVING SUM(o.TotalAmount) > 1000\n            ORDER BY TotalSpent DESC\";\n\n        return await _connection.QueryAsync<OrderSummary>(sql, new { FromDate = fromDate });\n    }\n\n    public async Task<int> UpdateOrderStatusAsync(Guid orderId, string status)\n    {\n        const string sql = @\"\n            UPDATE Orders\n            SET Status = @Status, ModifiedAt = GETUTCDATE()\n            WHERE OrderId = @OrderId\";\n\n        return await _connection.ExecuteAsync(sql, new { OrderId = orderId, Status = status });\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-235"
  },
  {
    "question": "Combine EF Core and Dapper for optimal performance.",
    "answer": [
      {
        "type": "text",
        "content": "Use EF Core for writes, Dapper for complex reads."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class HybridOrderRepository\n{\n    private readonly TradingDbContext _context;\n    private readonly IDbConnection _dapperConnection;\n\n    public HybridOrderRepository(TradingDbContext context, IDbConnection dapperConnection)\n    {\n        _context = context;\n        _dapperConnection = dapperConnection;\n    }\n\n    // Write with EF Core (change tracking, navigation properties)\n    public async Task<Guid> CreateOrderAsync(Order order)\n    {\n        _context.Orders.Add(order);\n        await _context.SaveChangesAsync();\n        return order.Id;\n    }\n\n    // Complex read with Dapper (performance)\n    public async Task<OrderAnalytics> GetOrderAnalyticsAsync(Guid customerId, DateTime fromDate)\n    {\n        const string sql = @\"\n            WITH OrderStats AS (\n                SELECT o.CustomerId,\n                       COUNT(DISTINCT o.OrderId) AS TotalOrders,\n                       SUM(o.TotalAmount) AS TotalSpent,\n                       AVG(o.TotalAmount) AS AvgOrderValue,\n                       MIN(o.CreatedAt) AS FirstOrderDate,\n                       MAX(o.CreatedAt) AS LastOrderDate\n                FROM Orders o\n                WHERE o.CustomerId = @CustomerId\n                  AND o.CreatedAt >= @FromDate\n                GROUP BY o.CustomerId\n            ),\n            ProductPreferences AS (\n                SELECT TOP 5\n                       p.ProductName,\n                       SUM(oi.Quantity) AS TotalQuantity\n                FROM Orders o\n                INNER JOIN OrderItems oi ON o.OrderId = oi.OrderId\n                INNER JOIN Products p ON oi.ProductId = p.ProductId\n                WHERE o.CustomerId = @CustomerId\n                  AND o.CreatedAt >= @FromDate\n                GROUP BY p.ProductId, p.ProductName\n                ORDER BY SUM(oi.Quantity) DESC\n            )\n            SELECT os.*, pp.ProductName, pp.TotalQuantity\n            FROM OrderStats os\n            CROSS APPLY (SELECT * FROM ProductPreferences) pp\";\n\n        var analytics = await _dapperConnection.QueryAsync(\n            sql,\n            new { CustomerId = customerId, FromDate = fromDate });\n\n        return MapToOrderAnalytics(analytics);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-236"
  },
  {
    "question": "Implement optimistic concurrency control with a row version column.",
    "answer": [
      {
        "type": "text",
        "content": "Add a rowversion column and use EF Core concurrency tokens."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class Order\n{\n    public int Id { get; set; }\n    public byte[] RowVersion { get; set; } = Array.Empty<byte>();\n}\n\nmodelBuilder.Entity<Order>()\n    .Property(o => o.RowVersion)\n    .IsRowVersion();",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-237"
  },
  {
    "question": "Implement soft delete with a global query filter.",
    "answer": [
      {
        "type": "text",
        "content": "Add IsDeleted and filter it globally."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class EntityBase\n{\n    public bool IsDeleted { get; set; }\n}\n\nmodelBuilder.Entity<EntityBase>()\n    .HasQueryFilter(e => !e.IsDeleted);",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-238"
  },
  {
    "question": "Create efficient pagination for large datasets.",
    "answer": [
      {
        "type": "text",
        "content": "Use keyset pagination for stability and performance."
      },
      {
        "type": "code",
        "language": "sql",
        "code": "SELECT *\nFROM Orders\nWHERE Id > @LastSeenId\nORDER BY Id\nOFFSET 0 ROWS FETCH NEXT @PageSize ROWS ONLY;",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-239"
  },
  {
    "question": "Compare isolation levels for read/write workloads.",
    "answer": [
      {
        "type": "text",
        "content": "Use Read Committed for OLTP, Snapshot for long reads, Serializable for strict consistency with higher contention."
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-240"
  },
  {
    "question": "Diagnose a slow query regression.",
    "answer": [
      {
        "type": "text",
        "content": "Capture the execution plan, check index usage, update stats, and validate parameter sniffing."
      },
      {
        "type": "text",
        "content": "Total Exercises: 35+"
      },
      {
        "type": "text",
        "content": "Master data access patterns for building high-performance, scalable applications!"
      }
    ],
    "category": "practice",
    "topic": "Data Layer",
    "topicId": "data-layer",
    "source": "practice/sub-notes/data-layer.md",
    "id": "card-241"
  },
  {
    "question": "Given a list of trades with timestamps, return the latest trade per account using LINQ.",
    "answer": [
      {
        "type": "text",
        "content": "Sort or group by account and pick the trade with the max timestamp using GroupBy + OrderByDescending/MaxBy. This keeps the logic declarative and pushes the temporal ordering into the query rather than manual loops."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var latestTrades = trades\n    .GroupBy(t => t.AccountId)\n    .Select(g => g.OrderByDescending(t => t.Timestamp).First());",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when you need the most recent entry per key without mutating state, such as building dashboards or reconciling snapshots. Avoid when the dataset is huge and you'd benefit from streaming/SQL aggregation; consider database query with ROW_NUMBER or a materialized view to avoid loading everything into memory."
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-242"
  },
  {
    "question": "Implement a method that flattens nested lists of instrument codes while preserving ordering.",
    "answer": [
      {
        "type": "text",
        "content": "Use SelectMany to flatten while keeping inner order."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var flat = nestedCodes.SelectMany(list => list);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when you have nested enumerables and simply need to concatenate them. Avoid when you must retain hierarchy boundaries—use nested loops instead."
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-243"
  },
  {
    "question": "Explain the difference between SelectMany and nested loops. When is each preferable?",
    "answer": [
      {
        "type": "text",
        "content": "SelectMany projects each element to a sequence and flattens; nested loops make iteration explicit and allow more control over flow."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// SelectMany\nvar pairs = accounts.SelectMany(a => a.Orders, (a, o) => new { a.Id, o.Id });\n\n// Nested loops\nforeach (var a in accounts)\n    foreach (var o in a.Orders)\n        yield return (a.Id, o.Id);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use SelectMany when you want a fluent declarative pipeline or need joins. Use loops when performance-critical, complex control flow, or break/continue needed."
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-244"
  },
  {
    "question": "How would you detect duplicate orders in a stream using GroupBy and produce a summary?",
    "answer": [
      {
        "type": "text",
        "content": "Group by unique order keys and filter groups with count > 1. Summaries can include counts, timestamps, and other aggregate metadata that drive remediation."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var duplicates = orders\n    .GroupBy(o => new { o.AccountId, o.ClientOrderId })\n    .Where(g => g.Count() > 1)\n    .Select(g => new {\n        g.Key.AccountId,\n        g.Key.ClientOrderId,\n        Count = g.Count(),\n        LatestTimestamp = g.Max(o => o.Timestamp)\n    });",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when you need summaries and easy grouping. Avoid when data volume exceeds in-memory capabilities—use database aggregates or streaming dedup."
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-245"
  },
  {
    "question": "Find all customers who have placed orders in the last 30 days and calculate their total order value.",
    "answer": [
      {
        "type": "text",
        "content": "Use Where to filter by date range, then GroupBy customer and Sum the order values."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var cutoffDate = DateTime.UtcNow.AddDays(-30);\nvar customerTotals = orders\n    .Where(o => o.OrderDate >= cutoffDate)\n    .GroupBy(o => o.CustomerId)\n    .Select(g => new {\n        CustomerId = g.Key,\n        TotalValue = g.Sum(o => o.TotalAmount),\n        OrderCount = g.Count()\n    });",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-246"
  },
  {
    "question": "Given two lists (products and categories), perform a left join to get all products with their category names (null if no category).",
    "answer": [
      {
        "type": "text",
        "content": "Use GroupJoin or LeftJoin pattern with DefaultIfEmpty."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var result = products\n    .GroupJoin(\n        categories,\n        p => p.CategoryId,\n        c => c.Id,\n        (product, cats) => new { product, cats })\n    .SelectMany(\n        x => x.cats.DefaultIfEmpty(),\n        (x, category) => new {\n            x.product.Name,\n            CategoryName = category?.Name ?? \"Uncategorized\"\n        });",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-247"
  },
  {
    "question": "Implement a LINQ query to find the top 5 most expensive products in each category.",
    "answer": [
      {
        "type": "text",
        "content": "Group by category, order by price descending, take 5."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var topProducts = products\n    .GroupBy(p => p.CategoryId)\n    .Select(g => new {\n        CategoryId = g.Key,\n        TopProducts = g.OrderByDescending(p => p.Price).Take(5).ToList()\n    });",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-248"
  },
  {
    "question": "Find all pairs of employees who work in the same department (avoid duplicates like (A,B) and (B,A)).",
    "answer": [
      {
        "type": "text",
        "content": "Self-join with condition to avoid duplicates."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var pairs = employees\n    .SelectMany(e1 => employees, (e1, e2) => new { e1, e2 })\n    .Where(p => p.e1.DepartmentId == p.e2.DepartmentId && p.e1.Id < p.e2.Id)\n    .Select(p => new { Employee1 = p.e1.Name, Employee2 = p.e2.Name });",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-249"
  },
  {
    "question": "Calculate running totals for daily sales.",
    "answer": [
      {
        "type": "text",
        "content": "Use Aggregate with accumulator or window function approach."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var runningTotal = sales\n    .OrderBy(s => s.Date)\n    .Select((sale, index) => new {\n        sale.Date,\n        sale.Amount,\n        RunningTotal = sales\n            .OrderBy(s => s.Date)\n            .Take(index + 1)\n            .Sum(s => s.Amount)\n    });\n\n// More efficient approach\ndecimal total = 0;\nvar runningTotals = sales\n    .OrderBy(s => s.Date)\n    .Select(s => new {\n        s.Date,\n        s.Amount,\n        RunningTotal = total += s.Amount\n    })\n    .ToList();",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-250"
  },
  {
    "question": "Implement a custom LINQ extension method DistinctBy that takes a key selector.",
    "answer": [
      {
        "type": "text",
        "content": "Create an extension method that uses HashSet for tracking seen keys."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public static class LinqExtensions\n{\n    public static IEnumerable<TSource> DistinctBy<TSource, TKey>(\n        this IEnumerable<TSource> source,\n        Func<TSource, TKey> keySelector)\n    {\n        var seenKeys = new HashSet<TKey>();\n        foreach (var element in source)\n        {\n            if (seenKeys.Add(keySelector(element)))\n                yield return element;\n        }\n    }\n}\n\n// Usage\nvar uniqueProducts = products.DistinctBy(p => p.Name);",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-251"
  },
  {
    "question": "Write a LINQ query to find all employees whose salary is above the average salary in their department.",
    "answer": [
      {
        "type": "text",
        "content": "Use subquery or join with calculated averages."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var departmentAvgs = employees\n    .GroupBy(e => e.DepartmentId)\n    .Select(g => new { DeptId = g.Key, AvgSalary = g.Average(e => e.Salary) })\n    .ToDictionary(x => x.DeptId, x => x.AvgSalary);\n\nvar aboveAverage = employees\n    .Where(e => e.Salary > departmentAvgs[e.DepartmentId])\n    .Select(e => new {\n        e.Name,\n        e.Salary,\n        DeptAverage = departmentAvgs[e.DepartmentId]\n    });",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-252"
  },
  {
    "question": "Implement pagination with LINQ (Skip/Take) and explain potential issues with IQueryable vs IEnumerable.",
    "answer": [
      {
        "type": "text",
        "content": "Use Skip and Take for pagination."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public IEnumerable<Product> GetProductsPage(int pageNumber, int pageSize)\n{\n    return dbContext.Products\n        .OrderBy(p => p.Id)  // IMPORTANT: Must order for consistent pagination\n        .Skip((pageNumber - 1) * pageSize)\n        .Take(pageSize)\n        .ToList();  // Execute query here\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Potential Issues:"
      },
      {
        "type": "list",
        "items": [
          "IQueryable: Translates to SQL, efficient but can cause N+1 queries if not careful",
          "IEnumerable: Loads all data into memory before Skip/Take, very inefficient",
          "Always order before Skip/Take to ensure consistent results",
          "Consider total count query for UI pagination info"
        ]
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-253"
  },
  {
    "question": "Write a LINQ query to pivot data (convert rows to columns).",
    "answer": [
      {
        "type": "text",
        "content": "Use GroupBy and dynamic property creation."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Input: Sales with Year, Quarter, Amount\n// Output: Year with Q1, Q2, Q3, Q4 columns\n\nvar pivoted = sales\n    .GroupBy(s => s.Year)\n    .Select(g => new {\n        Year = g.Key,\n        Q1 = g.Where(s => s.Quarter == 1).Sum(s => s.Amount),\n        Q2 = g.Where(s => s.Quarter == 2).Sum(s => s.Amount),\n        Q3 = g.Where(s => s.Quarter == 3).Sum(s => s.Amount),\n        Q4 = g.Where(s => s.Quarter == 4).Sum(s => s.Amount)\n    });",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-254"
  },
  {
    "question": "Implement a LINQ query with multiple grouping levels (hierarchical grouping).",
    "answer": [
      {
        "type": "text",
        "content": "Nest GroupBy operations."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var hierarchicalGroups = sales\n    .GroupBy(s => s.Year)\n    .Select(yearGroup => new {\n        Year = yearGroup.Key,\n        Quarters = yearGroup\n            .GroupBy(s => s.Quarter)\n            .Select(quarterGroup => new {\n                Quarter = quarterGroup.Key,\n                TotalSales = quarterGroup.Sum(s => s.Amount),\n                Transactions = quarterGroup.ToList()\n            })\n            .ToList()\n    });",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-255"
  },
  {
    "question": "Find all consecutive sequences of at least 3 days where sales exceeded $10,000.",
    "answer": [
      {
        "type": "text",
        "content": "Use windowing logic with LINQ."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var threshold = 10000m;\nvar consecutiveHighSales = sales\n    .OrderBy(s => s.Date)\n    .Select((sale, index) => new {\n        sale,\n        index,\n        IsHigh = sale.Amount > threshold\n    })\n    .Where(x => x.IsHigh)\n    .GroupBy(x => x.index - sales\n        .OrderBy(s => s.Date)\n        .TakeWhile((s, i) => i < x.index)\n        .Count(s => s.Amount > threshold))\n    .Where(g => g.Count() >= 3)\n    .Select(g => new {\n        StartDate = g.First().sale.Date,\n        EndDate = g.Last().sale.Date,\n        DayCount = g.Count()\n    });",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-256"
  },
  {
    "question": "Explain deferred execution and when it can cause performance issues.",
    "answer": [
      {
        "type": "text",
        "content": "LINQ queries using IEnumerable are not executed until enumerated. Multiple enumerations re-execute the query."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// ❌ Bad: Query executes 3 times\nvar expensiveQuery = dbContext.Orders\n    .Where(o => ComplexCalculation(o));\n\nvar count = expensiveQuery.Count();          // Executes query\nvar first = expensiveQuery.FirstOrDefault(); // Executes query again\nvar list = expensiveQuery.ToList();          // Executes query again\n\n// ✅ Good: Materialize once\nvar results = dbContext.Orders\n    .Where(o => ComplexCalculation(o))\n    .ToList();  // Single execution\n\nvar count = results.Count;\nvar first = results.FirstOrDefault();",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-257"
  },
  {
    "question": "Compare the performance implications of Count() vs Any() for checking if a collection has items.",
    "answer": [
      {
        "type": "text",
        "content": "Any() stops at first match; Count() must enumerate everything."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// ❌ Bad: Counts all items\nif (orders.Count() > 0)\n{\n    // ...\n}\n\n// ✅ Good: Stops at first item\nif (orders.Any())\n{\n    // ...\n}\n\n// For checking specific count\nif (orders.Count() >= 100)  // Bad: counts all\nif (orders.Skip(99).Any())  // Better: stops at 100th",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-258"
  },
  {
    "question": "Identify and fix performance issues in this query.",
    "answer": [
      {
        "type": "code",
        "language": "csharp",
        "code": "// ❌ Bad: Multiple database round trips\nvar orders = dbContext.Orders.ToList();\nforeach (var order in orders)\n{\n    order.Customer = dbContext.Customers.Find(order.CustomerId);\n    order.Items = dbContext.OrderItems.Where(i => i.OrderId == order.Id).ToList();\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use eager loading with Include."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// ✅ Good: Single query with joins\nvar orders = dbContext.Orders\n    .Include(o => o.Customer)\n    .Include(o => o.Items)\n    .ToList();",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-259"
  },
  {
    "question": "Write a LINQ query that uses AsParallel appropriately for CPU-bound operations.",
    "answer": [
      {
        "type": "text",
        "content": "Use PLINQ for computationally expensive operations."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// CPU-bound operation\nvar results = largeDataset\n    .AsParallel()\n    .WithDegreeOfParallelism(Environment.ProcessorCount)\n    .Where(item => ExpensiveComputation(item))\n    .Select(item => TransformItem(item))\n    .ToList();\n\n// Don't use for I/O-bound operations or small datasets",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-260"
  },
  {
    "question": "When should you use List<T> vs IEnumerable<T> as a return type?",
    "answer": [
      {
        "type": "text",
        "content": "Return IEnumerable<T> for flexibility; use List<T> when caller needs indexing/modification."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// ✅ Good: Flexible, caller can decide materialization\npublic IEnumerable<Order> GetOrders()\n{\n    return dbContext.Orders.Where(o => o.IsActive);\n}\n\n// Use List<T> when:\n// 1. Multiple enumerations are expected\n// 2. Caller needs random access\n// 3. Caller needs to modify the collection\npublic List<Order> GetOrdersForProcessing()\n{\n    return dbContext.Orders.Where(o => o.Status == \"Pending\").ToList();\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-261"
  },
  {
    "question": "Implement a LookupTable using ToLookup and explain when to use it vs GroupBy.",
    "answer": [
      {
        "type": "text",
        "content": "ToLookup immediately executes and creates an immutable lookup structure."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// ToLookup - immediate execution, multiple lookups\nvar ordersByCustomer = orders.ToLookup(o => o.CustomerId);\nvar customer1Orders = ordersByCustomer[customerId1];  // O(1) lookup\nvar customer2Orders = ordersByCustomer[customerId2];  // Another O(1) lookup\n\n// GroupBy - deferred execution, single enumeration\nvar grouped = orders.GroupBy(o => o.CustomerId);\nforeach (var customerOrders in grouped)  // Single pass\n{\n    ProcessOrders(customerOrders);\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-262"
  },
  {
    "question": "Use Zip to combine two sequences and explain its behavior when sequences have different lengths.",
    "answer": [
      {
        "type": "text",
        "content": "Zip combines elements pairwise, stops at shortest sequence."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var numbers = new[] { 1, 2, 3, 4 };\nvar letters = new[] { \"A\", \"B\", \"C\" };\n\nvar zipped = numbers.Zip(letters, (n, l) => $\"{n}-{l}\");\n// Result: [\"1-A\", \"2-B\", \"3-C\"]  - 4 is ignored\n\n// C# 9+ Tuple syntax\nvar zipped2 = numbers.Zip(letters);\n// Result: [(1, \"A\"), (2, \"B\"), (3, \"C\")]",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-263"
  },
  {
    "question": "Implement a method that chunks a collection into batches of N items.",
    "answer": [
      {
        "type": "text",
        "content": "Use Chunk (C# 9+) or implement custom batching."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// C# 9+\nvar batches = items.Chunk(100);\n\n// Custom implementation\npublic static IEnumerable<IEnumerable<T>> Batch<T>(\n    this IEnumerable<T> source, int batchSize)\n{\n    var batch = new List<T>(batchSize);\n    foreach (var item in source)\n    {\n        batch.Add(item);\n        if (batch.Count == batchSize)\n        {\n            yield return batch;\n            batch = new List<T>(batchSize);\n        }\n    }\n\n    if (batch.Any())\n        yield return batch;\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-264"
  },
  {
    "question": "You need to merge data from multiple sources (database, API, cache) and remove duplicates. Implement this efficiently.",
    "answer": [
      {
        "type": "text",
        "content": "Combine sources and use DistinctBy or HashSet."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public async Task<List<Product>> GetMergedProducts()\n{\n    var dbProducts = await dbContext.Products.ToListAsync();\n    var apiProducts = await apiClient.GetProductsAsync();\n    var cachedProducts = cache.Get<List<Product>>(\"products\") ?? new List<Product>();\n\n    var allProducts = dbProducts\n        .Concat(apiProducts)\n        .Concat(cachedProducts)\n        .DistinctBy(p => p.Id)\n        .ToList();\n\n    return allProducts;\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-265"
  },
  {
    "question": "Implement a search feature with multiple optional filters (name, category, price range, tags).",
    "answer": [
      {
        "type": "text",
        "content": "Build query dynamically with conditional Where clauses."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public IEnumerable<Product> SearchProducts(\n    string name = null,\n    int? categoryId = null,\n    decimal? minPrice = null,\n    decimal? maxPrice = null,\n    string[] tags = null)\n{\n    IQueryable<Product> query = dbContext.Products;\n\n    if (!string.IsNullOrEmpty(name))\n        query = query.Where(p => p.Name.Contains(name));\n\n    if (categoryId.HasValue)\n        query = query.Where(p => p.CategoryId == categoryId.Value);\n\n    if (minPrice.HasValue)\n        query = query.Where(p => p.Price >= minPrice.Value);\n\n    if (maxPrice.HasValue)\n        query = query.Where(p => p.Price <= maxPrice.Value);\n\n    if (tags != null && tags.Any())\n        query = query.Where(p => p.Tags.Any(t => tags.Contains(t)));\n\n    return query.ToList();\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-266"
  },
  {
    "question": "Calculate month-over-month growth percentage for sales data.",
    "answer": [
      {
        "type": "text",
        "content": "Join current month with previous month data."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var monthlySales = sales\n    .GroupBy(s => new { s.Year, s.Month })\n    .Select(g => new {\n        g.Key.Year,\n        g.Key.Month,\n        Total = g.Sum(s => s.Amount)\n    })\n    .OrderBy(m => m.Year).ThenBy(m => m.Month)\n    .ToList();\n\nvar growth = monthlySales\n    .Zip(monthlySales.Skip(1), (prev, curr) => new {\n        curr.Year,\n        curr.Month,\n        CurrentTotal = curr.Total,\n        PreviousTotal = prev.Total,\n        GrowthPercent = ((curr.Total - prev.Total) / prev.Total) * 100\n    });",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-267"
  },
  {
    "question": "Implement an expression builder that allows dynamic LINQ query construction from user input.",
    "answer": [
      {
        "type": "text",
        "content": "Use Expression trees to build dynamic queries."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public static class DynamicQueryBuilder\n{\n    public static IQueryable<T> ApplyFilter<T>(\n        IQueryable<T> query,\n        string propertyName,\n        string operation,\n        object value)\n    {\n        var parameter = Expression.Parameter(typeof(T), \"x\");\n        var property = Expression.Property(parameter, propertyName);\n        var constant = Expression.Constant(value);\n\n        Expression comparison = operation switch\n        {\n            \"=\" => Expression.Equal(property, constant),\n            \">\" => Expression.GreaterThan(property, constant),\n            \"<\" => Expression.LessThan(property, constant),\n            \"contains\" => Expression.Call(property, \"Contains\", null, constant),\n            _ => throw new ArgumentException(\"Invalid operation\")\n        };\n\n        var lambda = Expression.Lambda<Func<T, bool>>(comparison, parameter);\n        return query.Where(lambda);\n    }\n}\n\n// Usage\nvar query = dbContext.Products.AsQueryable();\nquery = DynamicQueryBuilder.ApplyFilter(query, \"Price\", \">\", 100m);\nquery = DynamicQueryBuilder.ApplyFilter(query, \"Name\", \"contains\", \"Widget\");",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-268"
  },
  {
    "question": "Implement a method that finds all possible combinations of products that sum to a target price (subset sum problem).",
    "answer": [
      {
        "type": "text",
        "content": "Recursive LINQ approach or dynamic programming."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public static IEnumerable<List<Product>> FindCombinations(\n    List<Product> products,\n    decimal targetPrice,\n    decimal tolerance = 0.01m)\n{\n    for (int i = 0; i < products.Count; i++)\n    {\n        var product = products[i];\n\n        if (Math.Abs(product.Price - targetPrice) <= tolerance)\n        {\n            yield return new List<Product> { product };\n        }\n\n        if (product.Price < targetPrice)\n        {\n            var remaining = products.Skip(i + 1).ToList();\n            var subCombos = FindCombinations(\n                remaining,\n                targetPrice - product.Price,\n                tolerance);\n\n            foreach (var combo in subCombos)\n            {\n                yield return new List<Product> { product }.Concat(combo).ToList();\n            }\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-269"
  },
  {
    "question": "Use GroupJoin to build a customer summary with order counts and last order date.",
    "answer": [
      {
        "type": "text",
        "content": "GroupJoin collects orders per customer without losing customers who have no orders."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var summaries = customers\n    .GroupJoin(\n        orders,\n        c => c.Id,\n        o => o.CustomerId,\n        (c, customerOrders) => new {\n            c.Id,\n            c.Name,\n            OrderCount = customerOrders.Count(),\n            LastOrderDate = customerOrders\n                .OrderByDescending(o => o.OrderDate)\n                .Select(o => (DateTime?)o.OrderDate)\n                .FirstOrDefault()\n        });",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-270"
  },
  {
    "question": "Implement Distinct with a custom comparer for case-insensitive strings.",
    "answer": [
      {
        "type": "text",
        "content": "Provide an IEqualityComparer<T> to normalize comparisons."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var uniqueSymbols = symbols.Distinct(StringComparer.OrdinalIgnoreCase).ToList();",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-271"
  },
  {
    "question": "Convert a list to a dictionary safely when keys can repeat.",
    "answer": [
      {
        "type": "text",
        "content": "Group by the key first, then choose a resolution strategy."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var map = products\n    .GroupBy(p => p.Sku)\n    .ToDictionary(g => g.Key, g => g.OrderByDescending(p => p.UpdatedAt).First());",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-272"
  },
  {
    "question": "Use Select with index to assign ranks within a sorted sequence.",
    "answer": [
      {
        "type": "text",
        "content": "Sort once, then project with the index."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var ranked = trades\n    .OrderByDescending(t => t.Notional)\n    .Select((trade, index) => new { trade.Id, Rank = index + 1 });",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-273"
  },
  {
    "question": "Split a sequence into a prefix and the remaining items using TakeWhile and SkipWhile.",
    "answer": [
      {
        "type": "text",
        "content": "Use a predicate to find the boundary."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var prefix = prices.TakeWhile(p => p.IsValid).ToList();\nvar rest = prices.SkipWhile(p => p.IsValid).ToList();",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Total Exercises: 40+"
      },
      {
        "type": "text",
        "content": "Practice these exercises by actually writing the code. Don't just read—implement and test!"
      }
    ],
    "category": "practice",
    "topic": "Linq Collections",
    "topicId": "linq-collections",
    "source": "practice/sub-notes/linq-collections.md",
    "id": "card-274"
  },
  {
    "question": "Compare RabbitMQ and ZeroMQ for distributing price updates. When would you choose one over the other?",
    "answer": [
      {
        "type": "text",
        "content": "RabbitMQ: brokered, supports persistence, routing, acknowledgments, management UI, plugins. ZeroMQ: brokerless sockets, ultra-low latency but manual patterns, no persistence out of the box. Use RabbitMQ for durable, complex routing, enterprise integration, where administrators need visibility and security. Use ZeroMQ for high-throughput, in-process/edge messaging; avoid if you need persistence or central management."
      }
    ],
    "category": "practice",
    "topic": "Messaging Integration",
    "topicId": "messaging-integration",
    "source": "practice/sub-notes/messaging-integration.md",
    "id": "card-275"
  },
  {
    "question": "Explain how to ensure at-least-once delivery with RabbitMQ while preventing duplicate processing.",
    "answer": [
      {
        "type": "text",
        "content": "Use durable queues, persistent messages, manual ack, idempotent consumers. Enable publisher confirms to ensure the broker persisted the message before acknowledging to the producer."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "channel.BasicConsume(queue, autoAck: false, consumer);\nconsumer.Received += (sender, ea) =>\n{\n    Handle(ea.Body);\n    channel.BasicAck(ea.DeliveryTag, multiple: false);\n};",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when you can tolerate duplicates; critical to ensure no loss. Avoid when exactly-once semantics required—use transactional outbox + dedup."
      }
    ],
    "category": "practice",
    "topic": "Messaging Integration",
    "topicId": "messaging-integration",
    "source": "practice/sub-notes/messaging-integration.md",
    "id": "card-276"
  },
  {
    "question": "How would you design a saga pattern to coordinate account funding across multiple services?",
    "answer": [
      {
        "type": "text",
        "content": "Orchestrator or choreography; manage compensations (reverse ledger entry, refund payment)."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public async Task Handle(FundAccount command)\n{\n    var transferId = await _payments.DebitAsync(command.PaymentId);\n    try\n    {\n        await _ledger.CreditAsync(command.AccountId, command.Amount);\n        await _notifications.SendAsync(command.AccountId, \"Funding complete\");\n    }\n    catch\n    {\n        await _payments.RefundAsync(transferId);\n        throw;\n    }\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when multi-step, distributed transactions. Avoid when single system handles all steps—simple ACID transaction suffices."
      }
    ],
    "category": "practice",
    "topic": "Messaging Integration",
    "topicId": "messaging-integration",
    "source": "practice/sub-notes/messaging-integration.md",
    "id": "card-277"
  },
  {
    "question": "Discuss the outbox pattern and how it prevents message loss in event-driven systems.",
    "answer": [
      {
        "type": "text",
        "content": "Write domain event to outbox table within same transaction, then relay to message bus. A background dispatcher polls the outbox table, publishes events, and marks them as processed (with retries and exponential backoff)."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "await using var tx = await db.Database.BeginTransactionAsync();\norder.Status = OrderStatus.Accepted;\ndb.Outbox.Add(new OutboxMessage(order.Id, new OrderAccepted(order.Id)));\nawait db.SaveChangesAsync();\nawait tx.CommitAsync();",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when need atomic DB + message publish. Avoid when no shared database or eventual consistency acceptable without duplication."
      }
    ],
    "category": "practice",
    "topic": "Messaging Integration",
    "topicId": "messaging-integration",
    "source": "practice/sub-notes/messaging-integration.md",
    "id": "card-278"
  },
  {
    "question": "Implement a publisher with confirmation to ensure messages are persisted.",
    "answer": [
      {
        "type": "text",
        "content": "Use publisher confirms for reliability."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class ReliableRabbitMqPublisher\n{\n    private readonly IConnection _connection;\n    private readonly ILogger<ReliableRabbitMqPublisher> _logger;\n\n    public ReliableRabbitMqPublisher(\n        ConnectionFactory factory,\n        ILogger<ReliableRabbitMqPublisher> logger)\n    {\n        _connection = factory.CreateConnection();\n        _logger = logger;\n    }\n\n    public async Task PublishAsync<T>(string exchange, string routingKey, T message)\n    {\n        using var channel = _connection.CreateModel();\n\n        // Enable publisher confirms\n        channel.ConfirmSelect();\n\n        // Declare exchange as durable\n        channel.ExchangeDeclare(\n            exchange: exchange,\n            type: ExchangeType.Topic,\n            durable: true,\n            autoDelete: false);\n\n        var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));\n        var properties = channel.CreateBasicProperties();\n        properties.Persistent = true;  // Make message persistent\n        properties.MessageId = Guid.NewGuid().ToString();\n        properties.Timestamp = new AmqpTimestamp(DateTimeOffset.UtcNow.ToUnixTimeSeconds());\n\n        channel.BasicPublish(\n            exchange: exchange,\n            routingKey: routingKey,\n            basicProperties: properties,\n            body: body);\n\n        // Wait for confirmation\n        var confirmed = channel.WaitForConfirms(TimeSpan.FromSeconds(5));\n\n        if (!confirmed)\n        {\n            _logger.LogError(\"Message {MessageId} was not confirmed by broker\", properties.MessageId);\n            throw new Exception(\"Message publish failed - not confirmed\");\n        }\n\n        _logger.LogInformation(\"Message {MessageId} published and confirmed\", properties.MessageId);\n    }\n\n    public async Task PublishBatchAsync<T>(string exchange, string routingKey, List<T> messages)\n    {\n        using var channel = _connection.CreateModel();\n        channel.ConfirmSelect();\n\n        channel.ExchangeDeclare(\n            exchange: exchange,\n            type: ExchangeType.Topic,\n            durable: true,\n            autoDelete: false);\n\n        // Publish all messages in batch\n        foreach (var message in messages)\n        {\n            var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));\n            var properties = channel.CreateBasicProperties();\n            properties.Persistent = true;\n            properties.MessageId = Guid.NewGuid().ToString();\n\n            channel.BasicPublish(\n                exchange: exchange,\n                routingKey: routingKey,\n                basicProperties: properties,\n                body: body);\n        }\n\n        // Wait for all confirms\n        channel.WaitForConfirmsOrDie(TimeSpan.FromSeconds(30));\n        _logger.LogInformation(\"Batch of {Count} messages published and confirmed\", messages.Count);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Messaging Integration",
    "topicId": "messaging-integration",
    "source": "practice/sub-notes/messaging-integration.md",
    "id": "card-279"
  },
  {
    "question": "Implement a resilient consumer with retry logic and dead letter queue.",
    "answer": [
      {
        "type": "text",
        "content": "Handle failures with retries and DLQ."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class ResilientRabbitMqConsumer\n{\n    private readonly IConnection _connection;\n    private readonly ILogger<ResilientRabbitMqConsumer> _logger;\n\n    public void StartConsuming<T>(\n        string queueName,\n        Func<T, Task> messageHandler,\n        int maxRetries = 3)\n    {\n        var channel = _connection.CreateModel();\n\n        // Declare main queue\n        var mainQueueArgs = new Dictionary<string, object>\n        {\n            { \"x-dead-letter-exchange\", $\"{queueName}.dlx\" },\n            { \"x-dead-letter-routing-key\", $\"{queueName}.dlq\" }\n        };\n\n        channel.QueueDeclare(\n            queue: queueName,\n            durable: true,\n            exclusive: false,\n            autoDelete: false,\n            arguments: mainQueueArgs);\n\n        // Declare dead letter exchange and queue\n        channel.ExchangeDeclare($\"{queueName}.dlx\", ExchangeType.Direct, durable: true);\n        channel.QueueDeclare($\"{queueName}.dlq\", durable: true, exclusive: false, autoDelete: false);\n        channel.QueueBind($\"{queueName}.dlq\", $\"{queueName}.dlx\", $\"{queueName}.dlq\");\n\n        // Declare retry queue with TTL\n        var retryQueueArgs = new Dictionary<string, object>\n        {\n            { \"x-dead-letter-exchange\", \"\" },  // Default exchange\n            { \"x-dead-letter-routing-key\", queueName },\n            { \"x-message-ttl\", 5000 }  // 5 second delay\n        };\n\n        channel.QueueDeclare(\n            queue: $\"{queueName}.retry\",\n            durable: true,\n            exclusive: false,\n            autoDelete: false,\n            arguments: retryQueueArgs);\n\n        var consumer = new EventingBasicConsumer(channel);\n        consumer.Received += async (sender, ea) =>\n        {\n            try\n            {\n                var body = Encoding.UTF8.GetString(ea.Body.ToArray());\n                var message = JsonSerializer.Deserialize<T>(body);\n\n                await messageHandler(message);\n\n                // Success - acknowledge\n                channel.BasicAck(ea.DeliveryTag, multiple: false);\n                _logger.LogInformation(\"Message {MessageId} processed successfully\", ea.BasicProperties.MessageId);\n            }\n            catch (Exception ex)\n            {\n                _logger.LogError(ex, \"Error processing message {MessageId}\", ea.BasicProperties.MessageId);\n\n                // Check retry count\n                var retryCount = GetRetryCount(ea.BasicProperties);\n\n                if (retryCount < maxRetries)\n                {\n                    // Send to retry queue\n                    _logger.LogInformation(\n                        \"Retrying message {MessageId} (attempt {Attempt}/{MaxRetries})\",\n                        ea.BasicProperties.MessageId,\n                        retryCount + 1,\n                        maxRetries);\n\n                    var retryProperties = channel.CreateBasicProperties();\n                    retryProperties.Persistent = true;\n                    retryProperties.MessageId = ea.BasicProperties.MessageId;\n                    retryProperties.Headers = ea.BasicProperties.Headers ?? new Dictionary<string, object>();\n                    retryProperties.Headers[\"x-retry-count\"] = retryCount + 1;\n\n                    channel.BasicPublish(\n                        exchange: \"\",\n                        routingKey: $\"{queueName}.retry\",\n                        basicProperties: retryProperties,\n                        body: ea.Body);\n\n                    channel.BasicAck(ea.DeliveryTag, multiple: false);\n                }\n                else\n                {\n                    // Max retries exceeded - reject to DLQ\n                    _logger.LogError(\n                        \"Message {MessageId} exceeded max retries, sending to DLQ\",\n                        ea.BasicProperties.MessageId);\n\n                    channel.BasicReject(ea.DeliveryTag, requeue: false);\n                }\n            }\n        };\n\n        channel.BasicConsume(\n            queue: queueName,\n            autoAck: false,\n            consumer: consumer);\n\n        _logger.LogInformation(\"Started consuming from queue: {QueueName}\", queueName);\n    }\n\n    private int GetRetryCount(IBasicProperties properties)\n    {\n        if (properties.Headers != null &&\n            properties.Headers.TryGetValue(\"x-retry-count\", out var value))\n        {\n            return Convert.ToInt32(value);\n        }\n        return 0;\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Messaging Integration",
    "topicId": "messaging-integration",
    "source": "practice/sub-notes/messaging-integration.md",
    "id": "card-280"
  },
  {
    "question": "Implement priority queue pattern for urgent messages.",
    "answer": [
      {
        "type": "text",
        "content": "Use RabbitMQ priority queues."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class PriorityQueuePublisher\n{\n    private readonly IModel _channel;\n\n    public PriorityQueuePublisher(IConnection connection)\n    {\n        _channel = connection.CreateModel();\n\n        // Declare priority queue\n        var args = new Dictionary<string, object>\n        {\n            { \"x-max-priority\", 10 }\n        };\n\n        _channel.QueueDeclare(\n            queue: \"orders.priority\",\n            durable: true,\n            exclusive: false,\n            autoDelete: false,\n            arguments: args);\n    }\n\n    public void PublishOrder(Order order, int priority)\n    {\n        var properties = _channel.CreateBasicProperties();\n        properties.Persistent = true;\n        properties.Priority = (byte)Math.Min(priority, 10);  // 0-10 range\n\n        var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(order));\n\n        _channel.BasicPublish(\n            exchange: \"\",\n            routingKey: \"orders.priority\",\n            basicProperties: properties,\n            body: body);\n    }\n}\n\n// Usage\npublisher.PublishOrder(urgentOrder, priority: 10);    // High priority\npublisher.PublishOrder(normalOrder, priority: 5);     // Normal priority\npublisher.PublishOrder(bulkOrder, priority: 1);       // Low priority",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Messaging Integration",
    "topicId": "messaging-integration",
    "source": "practice/sub-notes/messaging-integration.md",
    "id": "card-281"
  },
  {
    "question": "Implement Kafka producer with idempotent writes and transactions.",
    "answer": [
      {
        "type": "text",
        "content": "Use Kafka transactional producer."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TransactionalKafkaProducer\n{\n    private readonly IProducer<string, string> _producer;\n    private readonly ILogger<TransactionalKafkaProducer> _logger;\n\n    public TransactionalKafkaProducer(IConfiguration configuration, ILogger<TransactionalKafkaProducer> logger)\n    {\n        var config = new ProducerConfig\n        {\n            BootstrapServers = configuration[\"Kafka:BootstrapServers\"],\n            TransactionalId = $\"producer-{Guid.NewGuid()}\",\n            EnableIdempotence = true,  // Exactly-once semantics\n            Acks = Acks.All,           // Wait for all replicas\n            MaxInFlight = 5,\n            MessageSendMaxRetries = 10,\n            RetryBackoffMs = 100\n        };\n\n        _producer = new ProducerBuilder<string, string>(config).Build();\n        _producer.InitTransactions(TimeSpan.FromSeconds(30));\n        _logger = logger;\n    }\n\n    public async Task PublishInTransactionAsync(\n        Dictionary<string, List<Message<string, string>>> messagesByTopic)\n    {\n        _producer.BeginTransaction();\n\n        try\n        {\n            var deliveryTasks = new List<Task<DeliveryResult<string, string>>>();\n\n            foreach (var (topic, messages) in messagesByTopic)\n            {\n                foreach (var message in messages)\n                {\n                    var task = _producer.ProduceAsync(topic, message);\n                    deliveryTasks.Add(task);\n                }\n            }\n\n            // Wait for all messages to be sent\n            var results = await Task.WhenAll(deliveryTasks);\n\n            _producer.CommitTransaction();\n\n            _logger.LogInformation(\"Transaction committed with {Count} messages\", results.Length);\n        }\n        catch (Exception ex)\n        {\n            _logger.LogError(ex, \"Transaction failed, aborting\");\n            _producer.AbortTransaction();\n            throw;\n        }\n    }\n\n    public void Dispose()\n    {\n        _producer?.Dispose();\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Messaging Integration",
    "topicId": "messaging-integration",
    "source": "practice/sub-notes/messaging-integration.md",
    "id": "card-282"
  },
  {
    "question": "Implement Kafka consumer with manual offset management and exactly-once processing.",
    "answer": [
      {
        "type": "text",
        "content": "Use consumer with manual commit and idempotency."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class ExactlyOnceKafkaConsumer\n{\n    private readonly IConsumer<string, string> _consumer;\n    private readonly DbContext _dbContext;\n    private readonly ILogger<ExactlyOnceKafkaConsumer> _logger;\n\n    public ExactlyOnceKafkaConsumer(\n        IConfiguration configuration,\n        DbContext dbContext,\n        ILogger<ExactlyOnceKafkaConsumer> logger)\n    {\n        var config = new ConsumerConfig\n        {\n            BootstrapServers = configuration[\"Kafka:BootstrapServers\"],\n            GroupId = configuration[\"Kafka:ConsumerGroup\"],\n            EnableAutoCommit = false,  // Manual commit\n            AutoOffsetReset = AutoOffsetReset.Earliest,\n            IsolationLevel = IsolationLevel.ReadCommitted  // Only read committed messages\n        };\n\n        _consumer = new ConsumerBuilder<string, string>(config).Build();\n        _dbContext = dbContext;\n        _logger = logger;\n    }\n\n    public async Task StartConsumingAsync(\n        string topic,\n        Func<string, Task> messageHandler,\n        CancellationToken cancellationToken)\n    {\n        _consumer.Subscribe(topic);\n\n        while (!cancellationToken.IsCancellationRequested)\n        {\n            try\n            {\n                var consumeResult = _consumer.Consume(cancellationToken);\n\n                // Check if already processed (idempotency)\n                var messageId = consumeResult.Message.Key;\n                var alreadyProcessed = await _dbContext.ProcessedMessages\n                    .AnyAsync(m => m.MessageId == messageId, cancellationToken);\n\n                if (alreadyProcessed)\n                {\n                    _logger.LogInformation(\"Message {MessageId} already processed, skipping\", messageId);\n                    _consumer.Commit(consumeResult);\n                    continue;\n                }\n\n                await using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);\n\n                try\n                {\n                    // Process message\n                    await messageHandler(consumeResult.Message.Value);\n\n                    // Record processed message\n                    _dbContext.ProcessedMessages.Add(new ProcessedMessage\n                    {\n                        MessageId = messageId,\n                        ProcessedAt = DateTime.UtcNow,\n                        Partition = consumeResult.Partition.Value,\n                        Offset = consumeResult.Offset.Value\n                    });\n\n                    await _dbContext.SaveChangesAsync(cancellationToken);\n                    await transaction.CommitAsync(cancellationToken);\n\n                    // Commit offset to Kafka\n                    _consumer.Commit(consumeResult);\n\n                    _logger.LogInformation(\n                        \"Processed message {MessageId} at offset {Offset}\",\n                        messageId,\n                        consumeResult.Offset.Value);\n                }\n                catch (Exception ex)\n                {\n                    _logger.LogError(ex, \"Error processing message {MessageId}\", messageId);\n                    await transaction.RollbackAsync(cancellationToken);\n                    throw;\n                }\n            }\n            catch (ConsumeException ex)\n            {\n                _logger.LogError(ex, \"Kafka consume error\");\n            }\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Messaging Integration",
    "topicId": "messaging-integration",
    "source": "practice/sub-notes/messaging-integration.md",
    "id": "card-283"
  },
  {
    "question": "Implement Kafka consumer group rebalancing with state management.",
    "answer": [
      {
        "type": "text",
        "content": "Handle partition assignment and revocation."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class StatefulKafkaConsumer\n{\n    private readonly IConsumer<string, string> _consumer;\n    private readonly Dictionary<int, long> _partitionOffsets = new();\n    private readonly ILogger<StatefulKafkaConsumer> _logger;\n\n    public StatefulKafkaConsumer(IConfiguration configuration, ILogger<StatefulKafkaConsumer> logger)\n    {\n        var config = new ConsumerConfig\n        {\n            BootstrapServers = configuration[\"Kafka:BootstrapServers\"],\n            GroupId = configuration[\"Kafka:ConsumerGroup\"],\n            EnableAutoCommit = false\n        };\n\n        _consumer = new ConsumerBuilder<string, string>(config)\n            .SetPartitionsAssignedHandler(OnPartitionsAssigned)\n            .SetPartitionsRevokedHandler(OnPartitionsRevoked)\n            .Build();\n\n        _logger = logger;\n    }\n\n    private void OnPartitionsAssigned(\n        IConsumer<string, string> consumer,\n        List<TopicPartition> partitions)\n    {\n        _logger.LogInformation(\"Partitions assigned: {Partitions}\",\n            string.Join(\", \", partitions.Select(p => p.Partition.Value)));\n\n        // Load state for assigned partitions\n        foreach (var partition in partitions)\n        {\n            // Could load from database, cache, etc.\n            _partitionOffsets[partition.Partition.Value] = 0;\n        }\n    }\n\n    private void OnPartitionsRevoked(\n        IConsumer<string, string> consumer,\n        List<TopicPartitionOffset> partitions)\n    {\n        _logger.LogInformation(\"Partitions revoked: {Partitions}\",\n            string.Join(\", \", partitions.Select(p => p.Partition.Value)));\n\n        // Save state before losing partitions\n        foreach (var partition in partitions)\n        {\n            var offset = _partitionOffsets.GetValueOrDefault(partition.Partition.Value);\n            _logger.LogInformation(\"Saving offset {Offset} for partition {Partition}\",\n                offset, partition.Partition.Value);\n\n            // Could save to database, cache, etc.\n        }\n\n        // Commit offsets before rebalance\n        consumer.Commit(partitions);\n\n        // Clear local state\n        foreach (var partition in partitions)\n        {\n            _partitionOffsets.Remove(partition.Partition.Value);\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Messaging Integration",
    "topicId": "messaging-integration",
    "source": "practice/sub-notes/messaging-integration.md",
    "id": "card-284"
  },
  {
    "question": "Implement orchestration-based saga for order processing.",
    "answer": [
      {
        "type": "text",
        "content": "Centralized orchestrator manages saga flow."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderSagaOrchestrator\n{\n    private readonly IServiceProvider _serviceProvider;\n    private readonly IMessageBus _messageBus;\n    private readonly ISagaRepository _sagaRepository;\n    private readonly ILogger<OrderSagaOrchestrator> _logger;\n\n    public async Task<Guid> StartSagaAsync(CreateOrderCommand command)\n    {\n        var sagaId = Guid.NewGuid();\n        var saga = new OrderSaga\n        {\n            Id = sagaId,\n            State = SagaState.Started,\n            Command = command,\n            CreatedAt = DateTime.UtcNow\n        };\n\n        await _sagaRepository.SaveAsync(saga);\n\n        // Start saga execution\n        await ExecuteSagaStepAsync(sagaId, OrderSagaStep.ReserveInventory);\n\n        return sagaId;\n    }\n\n    private async Task ExecuteSagaStepAsync(Guid sagaId, OrderSagaStep step)\n    {\n        var saga = await _sagaRepository.GetAsync(sagaId);\n\n        try\n        {\n            switch (step)\n            {\n                case OrderSagaStep.ReserveInventory:\n                    await ReserveInventoryAsync(saga);\n                    saga.CurrentStep = OrderSagaStep.ProcessPayment;\n                    await ExecuteSagaStepAsync(sagaId, OrderSagaStep.ProcessPayment);\n                    break;\n\n                case OrderSagaStep.ProcessPayment:\n                    await ProcessPaymentAsync(saga);\n                    saga.CurrentStep = OrderSagaStep.CreateShipment;\n                    await ExecuteSagaStepAsync(sagaId, OrderSagaStep.CreateShipment);\n                    break;\n\n                case OrderSagaStep.CreateShipment:\n                    await CreateShipmentAsync(saga);\n                    saga.State = SagaState.Completed;\n                    await _sagaRepository.SaveAsync(saga);\n                    await _messageBus.PublishAsync(new OrderSagaCompletedEvent { SagaId = sagaId });\n                    break;\n            }\n        }\n        catch (Exception ex)\n        {\n            _logger.LogError(ex, \"Saga step {Step} failed for saga {SagaId}\", step, sagaId);\n            saga.State = SagaState.Compensating;\n            await _sagaRepository.SaveAsync(saga);\n            await CompensateSagaAsync(sagaId, step);\n        }\n    }\n\n    private async Task CompensateSagaAsync(Guid sagaId, OrderSagaStep failedStep)\n    {\n        var saga = await _sagaRepository.GetAsync(sagaId);\n\n        _logger.LogWarning(\"Starting compensation for saga {SagaId} at step {Step}\", sagaId, failedStep);\n\n        // Compensate in reverse order\n        switch (failedStep)\n        {\n            case OrderSagaStep.CreateShipment:\n                await CancelPaymentAsync(saga);\n                goto case OrderSagaStep.ProcessPayment;\n\n            case OrderSagaStep.ProcessPayment:\n                await ReleaseInventoryAsync(saga);\n                break;\n        }\n\n        saga.State = SagaState.Compensated;\n        await _sagaRepository.SaveAsync(saga);\n        await _messageBus.PublishAsync(new OrderSagaFailedEvent { SagaId = sagaId });\n    }\n\n    private async Task ReserveInventoryAsync(OrderSaga saga)\n    {\n        using var scope = _serviceProvider.CreateScope();\n        var inventoryService = scope.ServiceProvider.GetRequiredService<IInventoryService>();\n\n        saga.ReservationId = await inventoryService.ReserveAsync(\n            saga.Command.Items,\n            TimeSpan.FromMinutes(10));\n\n        await _sagaRepository.SaveAsync(saga);\n    }\n\n    private async Task ReleaseInventoryAsync(OrderSaga saga)\n    {\n        if (saga.ReservationId.HasValue)\n        {\n            using var scope = _serviceProvider.CreateScope();\n            var inventoryService = scope.ServiceProvider.GetRequiredService<IInventoryService>();\n            await inventoryService.ReleaseAsync(saga.ReservationId.Value);\n        }\n    }\n\n    private async Task ProcessPaymentAsync(OrderSaga saga)\n    {\n        using var scope = _serviceProvider.CreateScope();\n        var paymentService = scope.ServiceProvider.GetRequiredService<IPaymentService>();\n\n        saga.PaymentId = await paymentService.ChargeAsync(\n            saga.Command.CustomerId,\n            saga.Command.TotalAmount);\n\n        await _sagaRepository.SaveAsync(saga);\n    }\n\n    private async Task CancelPaymentAsync(OrderSaga saga)\n    {\n        if (saga.PaymentId.HasValue)\n        {\n            using var scope = _serviceProvider.CreateScope();\n            var paymentService = scope.ServiceProvider.GetRequiredService<IPaymentService>();\n            await paymentService.RefundAsync(saga.PaymentId.Value);\n        }\n    }\n\n    private async Task CreateShipmentAsync(OrderSaga saga)\n    {\n        using var scope = _serviceProvider.CreateScope();\n        var shippingService = scope.ServiceProvider.GetRequiredService<IShippingService>();\n\n        saga.ShipmentId = await shippingService.CreateShipmentAsync(\n            saga.Id,\n            saga.Command.ShippingAddress);\n\n        await _sagaRepository.SaveAsync(saga);\n    }\n}\n\npublic class OrderSaga\n{\n    public Guid Id { get; set; }\n    public SagaState State { get; set; }\n    public OrderSagaStep CurrentStep { get; set; }\n    public CreateOrderCommand Command { get; set; }\n    public Guid? ReservationId { get; set; }\n    public Guid? PaymentId { get; set; }\n    public Guid? ShipmentId { get; set; }\n    public DateTime CreatedAt { get; set; }\n}\n\npublic enum SagaState\n{\n    Started,\n    Compensating,\n    Compensated,\n    Completed\n}\n\npublic enum OrderSagaStep\n{\n    ReserveInventory,\n    ProcessPayment,\n    CreateShipment\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Messaging Integration",
    "topicId": "messaging-integration",
    "source": "practice/sub-notes/messaging-integration.md",
    "id": "card-285"
  },
  {
    "question": "Implement choreography-based saga using events.",
    "answer": [
      {
        "type": "text",
        "content": "Decentralized saga coordination through events."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Each service publishes events and listens for relevant events\n\n// Inventory Service\npublic class InventoryService\n{\n    private readonly IMessageBus _messageBus;\n\n    public async Task HandleOrderCreatedAsync(OrderCreatedEvent evt)\n    {\n        try\n        {\n            var reservationId = await ReserveInventoryAsync(evt.Items);\n\n            await _messageBus.PublishAsync(new InventoryReservedEvent\n            {\n                OrderId = evt.OrderId,\n                ReservationId = reservationId,\n                Items = evt.Items\n            });\n        }\n        catch (Exception ex)\n        {\n            await _messageBus.PublishAsync(new InventoryReservationFailedEvent\n            {\n                OrderId = evt.OrderId,\n                Reason = ex.Message\n            });\n        }\n    }\n\n    public async Task HandlePaymentFailedAsync(PaymentFailedEvent evt)\n    {\n        // Compensate: release inventory\n        await ReleaseInventoryAsync(evt.ReservationId);\n\n        await _messageBus.PublishAsync(new InventoryReleasedEvent\n        {\n            OrderId = evt.OrderId,\n            ReservationId = evt.ReservationId\n        });\n    }\n}\n\n// Payment Service\npublic class PaymentService\n{\n    private readonly IMessageBus _messageBus;\n\n    public async Task HandleInventoryReservedAsync(InventoryReservedEvent evt)\n    {\n        try\n        {\n            var paymentId = await ProcessPaymentAsync(evt.OrderId);\n\n            await _messageBus.PublishAsync(new PaymentProcessedEvent\n            {\n                OrderId = evt.OrderId,\n                PaymentId = paymentId,\n                ReservationId = evt.ReservationId\n            });\n        }\n        catch (Exception ex)\n        {\n            await _messageBus.PublishAsync(new PaymentFailedEvent\n            {\n                OrderId = evt.OrderId,\n                ReservationId = evt.ReservationId,\n                Reason = ex.Message\n            });\n        }\n    }\n\n    public async Task HandleShipmentFailedAsync(ShipmentFailedEvent evt)\n    {\n        // Compensate: refund payment\n        await RefundPaymentAsync(evt.PaymentId);\n\n        await _messageBus.PublishAsync(new PaymentRefundedEvent\n        {\n            OrderId = evt.OrderId,\n            PaymentId = evt.PaymentId\n        });\n    }\n}\n\n// Shipping Service\npublic class ShippingService\n{\n    private readonly IMessageBus _messageBus;\n\n    public async Task HandlePaymentProcessedAsync(PaymentProcessedEvent evt)\n    {\n        try\n        {\n            var shipmentId = await CreateShipmentAsync(evt.OrderId);\n\n            await _messageBus.PublishAsync(new ShipmentCreatedEvent\n            {\n                OrderId = evt.OrderId,\n                ShipmentId = shipmentId,\n                PaymentId = evt.PaymentId\n            });\n        }\n        catch (Exception ex)\n        {\n            await _messageBus.PublishAsync(new ShipmentFailedEvent\n            {\n                OrderId = evt.OrderId,\n                PaymentId = evt.PaymentId,\n                Reason = ex.Message\n            });\n        }\n    }\n}\n\n// Order Service - tracks overall saga state\npublic class OrderService\n{\n    public async Task HandleShipmentCreatedAsync(ShipmentCreatedEvent evt)\n    {\n        // Saga completed successfully\n        await UpdateOrderStatusAsync(evt.OrderId, OrderStatus.Shipped);\n    }\n\n    public async Task HandleInventoryReservationFailedAsync(InventoryReservationFailedEvent evt)\n    {\n        // Saga failed at first step\n        await UpdateOrderStatusAsync(evt.OrderId, OrderStatus.Cancelled);\n    }\n\n    public async Task HandlePaymentRefundedAsync(PaymentRefundedEvent evt)\n    {\n        // Saga fully compensated\n        await UpdateOrderStatusAsync(evt.OrderId, OrderStatus.Cancelled);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Messaging Integration",
    "topicId": "messaging-integration",
    "source": "practice/sub-notes/messaging-integration.md",
    "id": "card-286"
  },
  {
    "question": "Implement transactional outbox pattern with background processor.",
    "answer": [
      {
        "type": "text",
        "content": "Ensure atomic database updates and message publishing."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Outbox entity\npublic class OutboxMessage\n{\n    public Guid Id { get; set; }\n    public string AggregateId { get; set; }\n    public string EventType { get; set; }\n    public string Payload { get; set; }\n    public DateTime CreatedAt { get; set; }\n    public DateTime? ProcessedAt { get; set; }\n    public int RetryCount { get; set; }\n    public string Error { get; set; }\n}\n\n// Domain event handler\npublic class OrderCommandHandler\n{\n    private readonly DbContext _dbContext;\n\n    public async Task HandleCreateOrderAsync(CreateOrderCommand command)\n    {\n        await using var transaction = await _dbContext.Database.BeginTransactionAsync();\n\n        try\n        {\n            // 1. Update domain entities\n            var order = new Order\n            {\n                Id = Guid.NewGuid(),\n                CustomerId = command.CustomerId,\n                Items = command.Items,\n                Status = OrderStatus.Pending\n            };\n\n            _dbContext.Orders.Add(order);\n\n            // 2. Write to outbox\n            var orderCreatedEvent = new OrderCreatedEvent\n            {\n                OrderId = order.Id,\n                CustomerId = order.CustomerId,\n                Items = order.Items\n            };\n\n            var outboxMessage = new OutboxMessage\n            {\n                Id = Guid.NewGuid(),\n                AggregateId = order.Id.ToString(),\n                EventType = nameof(OrderCreatedEvent),\n                Payload = JsonSerializer.Serialize(orderCreatedEvent),\n                CreatedAt = DateTime.UtcNow\n            };\n\n            _dbContext.OutboxMessages.Add(outboxMessage);\n\n            // 3. Commit transaction (atomic!)\n            await _dbContext.SaveChangesAsync();\n            await transaction.CommitAsync();\n        }\n        catch\n        {\n            await transaction.RollbackAsync();\n            throw;\n        }\n    }\n}\n\n// Background outbox processor\npublic class OutboxProcessor : BackgroundService\n{\n    private readonly IServiceProvider _serviceProvider;\n    private readonly ILogger<OutboxProcessor> _logger;\n    private readonly TimeSpan _processingInterval = TimeSpan.FromSeconds(5);\n\n    protected override async Task ExecuteAsync(CancellationToken stoppingToken)\n    {\n        _logger.LogInformation(\"Outbox Processor started\");\n\n        while (!stoppingToken.IsCancellationRequested)\n        {\n            try\n            {\n                await ProcessOutboxMessagesAsync(stoppingToken);\n            }\n            catch (Exception ex)\n            {\n                _logger.LogError(ex, \"Error processing outbox messages\");\n            }\n\n            await Task.Delay(_processingInterval, stoppingToken);\n        }\n    }\n\n    private async Task ProcessOutboxMessagesAsync(CancellationToken cancellationToken)\n    {\n        using var scope = _serviceProvider.CreateScope();\n        var dbContext = scope.ServiceProvider.GetRequiredService<DbContext>();\n        var messageBus = scope.ServiceProvider.GetRequiredService<IMessageBus>();\n\n        // Get unprocessed messages\n        var messages = await dbContext.OutboxMessages\n            .Where(m => m.ProcessedAt == null && m.RetryCount < 5)\n            .OrderBy(m => m.CreatedAt)\n            .Take(100)\n            .ToListAsync(cancellationToken);\n\n        foreach (var message in messages)\n        {\n            try\n            {\n                // Publish to message bus\n                await messageBus.PublishRawAsync(\n                    message.EventType,\n                    message.Payload,\n                    cancellationToken);\n\n                // Mark as processed\n                message.ProcessedAt = DateTime.UtcNow;\n\n                _logger.LogInformation(\n                    \"Published outbox message {MessageId} of type {EventType}\",\n                    message.Id,\n                    message.EventType);\n            }\n            catch (Exception ex)\n            {\n                message.RetryCount++;\n                message.Error = ex.Message;\n\n                _logger.LogError(\n                    ex,\n                    \"Failed to publish outbox message {MessageId} (retry {RetryCount})\",\n                    message.Id,\n                    message.RetryCount);\n            }\n        }\n\n        if (messages.Any())\n        {\n            await dbContext.SaveChangesAsync(cancellationToken);\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Messaging Integration",
    "topicId": "messaging-integration",
    "source": "practice/sub-notes/messaging-integration.md",
    "id": "card-287"
  },
  {
    "question": "Implement idempotency using distributed cache.",
    "answer": [
      {
        "type": "text",
        "content": "Track processed requests to prevent duplicates."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class IdempotencyMiddleware\n{\n    private readonly RequestDelegate _next;\n    private readonly IDistributedCache _cache;\n    private readonly ILogger<IdempotencyMiddleware> _logger;\n\n    public async Task InvokeAsync(HttpContext context)\n    {\n        // Only handle POST/PUT/PATCH\n        if (context.Request.Method != \"POST\" &&\n            context.Request.Method != \"PUT\" &&\n            context.Request.Method != \"PATCH\")\n        {\n            await _next(context);\n            return;\n        }\n\n        // Get idempotency key\n        if (!context.Request.Headers.TryGetValue(\"Idempotency-Key\", out var idempotencyKey) ||\n            string.IsNullOrEmpty(idempotencyKey))\n        {\n            context.Response.StatusCode = StatusCodes.Status400BadRequest;\n            await context.Response.WriteAsJsonAsync(new { error = \"Idempotency-Key header required\" });\n            return;\n        }\n\n        var cacheKey = $\"idempotency:{idempotencyKey}\";\n\n        // Check if request already processed\n        var cachedResponse = await _cache.GetStringAsync(cacheKey);\n        if (cachedResponse != null)\n        {\n            _logger.LogInformation(\"Returning cached response for idempotency key: {Key}\", idempotencyKey);\n\n            var response = JsonSerializer.Deserialize<IdempotentResponse>(cachedResponse);\n            context.Response.StatusCode = response.StatusCode;\n            context.Response.ContentType = \"application/json\";\n\n            foreach (var header in response.Headers)\n            {\n                context.Response.Headers[header.Key] = header.Value;\n            }\n\n            await context.Response.WriteAsync(response.Body);\n            return;\n        }\n\n        // Acquire lock to prevent concurrent processing\n        var lockKey = $\"{cacheKey}:lock\";\n        var lockAcquired = await TryAcquireLockAsync(lockKey, TimeSpan.FromSeconds(30));\n\n        if (!lockAcquired)\n        {\n            context.Response.StatusCode = StatusCodes.Status409Conflict;\n            await context.Response.WriteAsJsonAsync(new\n            {\n                error = \"Request with this idempotency key is currently being processed\"\n            });\n            return;\n        }\n\n        try\n        {\n            // Capture response\n            var originalBodyStream = context.Response.Body;\n            using var responseBody = new MemoryStream();\n            context.Response.Body = responseBody;\n\n            await _next(context);\n\n            // Cache successful response\n            if (context.Response.StatusCode >= 200 && context.Response.StatusCode < 300)\n            {\n                responseBody.Seek(0, SeekOrigin.Begin);\n                var body = await new StreamReader(responseBody).ReadToEndAsync();\n                responseBody.Seek(0, SeekOrigin.Begin);\n\n                var idempotentResponse = new IdempotentResponse\n                {\n                    StatusCode = context.Response.StatusCode,\n                    Headers = context.Response.Headers.ToDictionary(h => h.Key, h => h.Value.ToString()),\n                    Body = body\n                };\n\n                await _cache.SetStringAsync(\n                    cacheKey,\n                    JsonSerializer.Serialize(idempotentResponse),\n                    new DistributedCacheEntryOptions\n                    {\n                        AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(24)\n                    });\n            }\n\n            await responseBody.CopyToAsync(originalBodyStream);\n        }\n        finally\n        {\n            await ReleaseLockAsync(lockKey);\n        }\n    }\n\n    private async Task<bool> TryAcquireLockAsync(string lockKey, TimeSpan timeout)\n    {\n        var expiry = DateTime.UtcNow.Add(timeout);\n\n        while (DateTime.UtcNow < expiry)\n        {\n            var acquired = await _cache.GetStringAsync(lockKey) == null;\n            if (acquired)\n            {\n                await _cache.SetStringAsync(lockKey, \"locked\", new DistributedCacheEntryOptions\n                {\n                    AbsoluteExpirationRelativeToNow = timeout\n                });\n                return true;\n            }\n\n            await Task.Delay(100);\n        }\n\n        return false;\n    }\n\n    private async Task ReleaseLockAsync(string lockKey)\n    {\n        await _cache.RemoveAsync(lockKey);\n    }\n\n    private class IdempotentResponse\n    {\n        public int StatusCode { get; set; }\n        public Dictionary<string, string> Headers { get; set; }\n        public string Body { get; set; }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Messaging Integration",
    "topicId": "messaging-integration",
    "source": "practice/sub-notes/messaging-integration.md",
    "id": "card-288"
  },
  {
    "question": "Implement event store with snapshots for performance.",
    "answer": [
      {
        "type": "text",
        "content": "Optimize event replay with periodic snapshots."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class EventStoreWithSnapshots\n{\n    private readonly DbContext _dbContext;\n    private readonly int _snapshotInterval = 100; // Snapshot every 100 events\n\n    public async Task<T> LoadAggregateAsync<T>(Guid aggregateId) where T : Aggregate, new()\n    {\n        // Try to load latest snapshot\n        var snapshot = await _dbContext.Snapshots\n            .Where(s => s.AggregateId == aggregateId)\n            .OrderByDescending(s => s.Version)\n            .FirstOrDefaultAsync();\n\n        T aggregate;\n        long fromVersion;\n\n        if (snapshot != null)\n        {\n            // Deserialize snapshot\n            aggregate = JsonSerializer.Deserialize<T>(snapshot.Data);\n            fromVersion = snapshot.Version + 1;\n        }\n        else\n        {\n            aggregate = new T();\n            fromVersion = 0;\n        }\n\n        // Load events after snapshot\n        var events = await _dbContext.Events\n            .Where(e => e.AggregateId == aggregateId && e.Version >= fromVersion)\n            .OrderBy(e => e.Version)\n            .ToListAsync();\n\n        foreach (var eventRecord in events)\n        {\n            var @event = DeserializeEvent(eventRecord);\n            aggregate.ApplyEvent(@event);\n        }\n\n        return aggregate;\n    }\n\n    public async Task SaveAggregateAsync<T>(T aggregate) where T : Aggregate\n    {\n        var uncommittedEvents = aggregate.GetUncommittedEvents();\n\n        foreach (var @event in uncommittedEvents)\n        {\n            _dbContext.Events.Add(new EventRecord\n            {\n                AggregateId = aggregate.Id,\n                EventType = @event.GetType().Name,\n                Data = JsonSerializer.Serialize(@event),\n                Version = @event.Version,\n                Timestamp = @event.Timestamp\n            });\n        }\n\n        await _dbContext.SaveChangesAsync();\n\n        // Check if snapshot needed\n        if (aggregate.Version % _snapshotInterval == 0)\n        {\n            await CreateSnapshotAsync(aggregate);\n        }\n\n        aggregate.MarkEventsAsCommitted();\n    }\n\n    private async Task CreateSnapshotAsync<T>(T aggregate) where T : Aggregate\n    {\n        var snapshot = new SnapshotRecord\n        {\n            AggregateId = aggregate.Id,\n            AggregateType = typeof(T).Name,\n            Version = aggregate.Version,\n            Data = JsonSerializer.Serialize(aggregate),\n            CreatedAt = DateTime.UtcNow\n        };\n\n        _dbContext.Snapshots.Add(snapshot);\n        await _dbContext.SaveChangesAsync();\n\n        // Clean up old snapshots (keep last 3)\n        var oldSnapshots = await _dbContext.Snapshots\n            .Where(s => s.AggregateId == aggregate.Id)\n            .OrderByDescending(s => s.Version)\n            .Skip(3)\n            .ToListAsync();\n\n        _dbContext.Snapshots.RemoveRange(oldSnapshots);\n        await _dbContext.SaveChangesAsync();\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Messaging Integration",
    "topicId": "messaging-integration",
    "source": "practice/sub-notes/messaging-integration.md",
    "id": "card-289"
  },
  {
    "question": "How do you handle poison messages without blocking a queue?",
    "answer": [
      {
        "type": "text",
        "content": "Use a dead letter queue (DLQ) and track retry attempts via headers."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "if (retryCount >= 5)\n{\n    await _dlqPublisher.PublishAsync(message);\n    return;\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Messaging Integration",
    "topicId": "messaging-integration",
    "source": "practice/sub-notes/messaging-integration.md",
    "id": "card-290"
  },
  {
    "question": "Describe an idempotency strategy for message consumers.",
    "answer": [
      {
        "type": "text",
        "content": "Use an idempotency key table with unique constraint and short TTL for cleanup."
      },
      {
        "type": "code",
        "language": "sql",
        "code": "CREATE TABLE message_dedup (\n    message_id TEXT PRIMARY KEY,\n    processed_at TIMESTAMP NOT NULL\n);",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Messaging Integration",
    "topicId": "messaging-integration",
    "source": "practice/sub-notes/messaging-integration.md",
    "id": "card-291"
  },
  {
    "question": "How would you preserve ordering for a specific key in Kafka?",
    "answer": [
      {
        "type": "text",
        "content": "Use the key as the partition key and run a single consumer per partition."
      }
    ],
    "category": "practice",
    "topic": "Messaging Integration",
    "topicId": "messaging-integration",
    "source": "practice/sub-notes/messaging-integration.md",
    "id": "card-292"
  },
  {
    "question": "How do you evolve a message schema safely?",
    "answer": [
      {
        "type": "text",
        "content": "Use backward-compatible changes, versioned fields, and schema registry validation. Avoid breaking field removals."
      }
    ],
    "category": "practice",
    "topic": "Messaging Integration",
    "topicId": "messaging-integration",
    "source": "practice/sub-notes/messaging-integration.md",
    "id": "card-293"
  },
  {
    "question": "Implement a retry policy with exponential backoff and max delay.",
    "answer": [
      {
        "type": "text",
        "content": "Increase delay per attempt and cap the maximum delay."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var delayMs = Math.Min(30_000, 200 * (int)Math.Pow(2, attempt));\nawait Task.Delay(delayMs, ct);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Total Exercises: 35+"
      },
      {
        "type": "text",
        "content": "Master messaging patterns for building resilient, event-driven distributed systems!"
      }
    ],
    "category": "practice",
    "topic": "Messaging Integration",
    "topicId": "messaging-integration",
    "source": "practice/sub-notes/messaging-integration.md",
    "id": "card-294"
  },
  {
    "question": "When should you use ArrayPool<T>?",
    "answer": [
      {
        "type": "text",
        "content": "Use it for large or frequent temporary buffers to reduce GC pressure. Always return buffers in a finally block."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var pool = ArrayPool<byte>.Shared;\nbyte[] buffer = pool.Rent(4096);\ntry\n{\n    // Use buffer\n}\nfinally\n{\n    pool.Return(buffer);\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Performance Memory",
    "topicId": "performance-memory",
    "source": "practice/sub-notes/performance-memory.md",
    "id": "card-295"
  },
  {
    "question": "Show how Span<T> can avoid allocations when parsing.",
    "answer": [
      {
        "type": "text",
        "content": "Slice strings with spans to reduce intermediate allocations."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "ReadOnlySpan<char> line = input.AsSpan();\nvar first = line.Slice(0, 3);",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Performance Memory",
    "topicId": "performance-memory",
    "source": "practice/sub-notes/performance-memory.md",
    "id": "card-296"
  },
  {
    "question": "When would you use ValueTask instead of Task?",
    "answer": [
      {
        "type": "text",
        "content": "Use ValueTask for hot paths that often complete synchronously to avoid allocations."
      }
    ],
    "category": "practice",
    "topic": "Performance Memory",
    "topicId": "performance-memory",
    "source": "practice/sub-notes/performance-memory.md",
    "id": "card-297"
  },
  {
    "question": "Why is string concatenation in a loop expensive, and how do you fix it?",
    "answer": [
      {
        "type": "text",
        "content": "Strings are immutable, so concatenation allocates new strings. Use StringBuilder."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var sb = new StringBuilder();\nforeach (var part in parts)\n{\n    sb.Append(part);\n}\nvar result = sb.ToString();",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Performance Memory",
    "topicId": "performance-memory",
    "source": "practice/sub-notes/performance-memory.md",
    "id": "card-298"
  },
  {
    "question": "How do closures create hidden allocations?",
    "answer": [
      {
        "type": "text",
        "content": "Lambdas capture outer variables into heap-allocated objects. Avoid captures in hot paths or use static lambdas."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Avoid capture\nvar count = items.Count(static i => i.IsActive);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Key points:"
      },
      {
        "type": "list",
        "items": [
          "Objects >= 85KB go to LOH",
          "LOH is part of Gen 2",
          "LOH doesn't get compacted by default (can cause fragmentation)",
          "Use ArrayPool or compact LOH manually </details>"
        ]
      }
    ],
    "category": "practice",
    "topic": "Performance Memory",
    "topicId": "performance-memory",
    "source": "practice/sub-notes/performance-memory.md",
    "id": "card-299"
  },
  {
    "question": "Design a service that ingests MT5 tick data, normalizes it, caches latest prices, and exposes them via REST/WebSocket.",
    "answer": [
      {
        "type": "text",
        "content": "Components: Ingestion (connectors to MT5), normalization workers, cache (Redis), API (REST/WebSocket), persistence. Add replay storage (Kafka topic or time-series DB) for audit and late subscribers. Use message queue (Kafka) for fan-out and resilient decoupling of ingestion from delivery."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "while (await mt5Stream.MoveNextAsync())\n{\n    var normalized = Normalize(mt5Stream.Current);\n    await cache.SetAsync(normalized.Symbol, normalized.Price);\n    await hubContext.Clients.Group(normalized.Symbol)\n        .SendAsync(\"price\", normalized);\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when need low-latency price dissemination. Avoid when low-frequency batch updates suffice."
      }
    ],
    "category": "practice",
    "topic": "System Design",
    "topicId": "system-design",
    "source": "practice/sub-notes/system-design.md",
    "id": "card-300"
  },
  {
    "question": "Design an API that receives orders, validates, routes to MT4/MT5, and confirms execution. Include failure recovery.",
    "answer": [
      {
        "type": "text",
        "content": "Steps: receive REST order → validate (risk, compliance) → persist pending state → route to MT4/MT5 → await ack → publish result. Include idempotency keys on inbound requests and a reconciliation process for missing confirmations. Use saga/outbox for reliability and to coordinate compensating actions when downstream legs fail."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public async Task<IActionResult> Submit(OrderRequest dto)\n{\n    var order = await _validator.ValidateAsync(dto);\n    await _repository.SavePending(order);\n    var result = await _mtGateway.SendAsync(order);\n    await _repository.UpdateStatus(order.Id, result.Status);\n    await _bus.Publish(new OrderStatusChanged(order.Id, result.Status));\n    return Ok(result);\n}",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when real-time trading with external platforms. Avoid when simple internal workflows—overkill."
      }
    ],
    "category": "practice",
    "topic": "System Design",
    "topicId": "system-design",
    "source": "practice/sub-notes/system-design.md",
    "id": "card-301"
  },
  {
    "question": "Architect a system to collect metrics from trading microservices and alert on anomalies.",
    "answer": [
      {
        "type": "text",
        "content": "Collect metrics via OpenTelemetry exporters, push to time-series DB (Prometheus), visualize in Grafana, alert via Alertmanager. Tag metrics with dimensions (service, region, environment) to support slicing and alert thresholds. Include streaming logs via ELK stack and trace sampling via Jaeger/Tempo."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var meter = new Meter(\"Trading.Services\");\nvar orderLatency = meter.CreateHistogram<double>(\"order_latency_ms\");\norderLatency.Record(latencyMs, KeyValuePair.Create<string, object?>(\"service\", serviceName));",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when need proactive observability. Avoid when prototype with low SLA."
      }
    ],
    "category": "practice",
    "topic": "System Design",
    "topicId": "system-design",
    "source": "practice/sub-notes/system-design.md",
    "id": "card-302"
  },
  {
    "question": "Discuss how you would integrate an external risk management engine into an existing microservices ecosystem.",
    "answer": [
      {
        "type": "text",
        "content": "Use async messaging or REST; maintain schema adapters; ensure idempotency. Map risk statuses to domain-specific responses and version contracts to avoid breaking changes. Add caching for rules, circuit breakers, fallback decisions, and health checks to remove unhealthy nodes from rotation."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "var riskResponse = await _riskClient.EvaluateAsync(order, ct);\nif (!riskResponse.Approved)\n    return OrderDecision.Rejected(riskResponse.Reason);",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Use when external compliance requirement. Avoid when latency-critical path can't tolerate external dependency—consider in-process rules."
      }
    ],
    "category": "practice",
    "topic": "System Design",
    "topicId": "system-design",
    "source": "practice/sub-notes/system-design.md",
    "id": "card-303"
  },
  {
    "question": "Design a microservices architecture for an e-commerce platform with orders, inventory, payments, and shipping.",
    "answer": [
      {
        "type": "text",
        "content": "Break into bounded contexts with clear ownership and data isolation."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "Architecture Components:\n1. API Gateway (YARP, Ocelot, or Kong)\n   - Authentication/Authorization\n   - Rate limiting\n   - Request routing\n   - Response aggregation\n\n2. Order Service\n   - Order placement\n   - Order status tracking\n   - Saga orchestration\n   - Database: Orders, OrderItems\n\n3. Inventory Service\n   - Stock management\n   - Reservation system\n   - Database: Products, Stock\n\n4. Payment Service\n   - Payment processing\n   - Refunds\n   - Database: Transactions\n\n5. Shipping Service\n   - Shipping label generation\n   - Tracking\n   - Database: Shipments\n\n6. Notification Service\n   - Email/SMS notifications\n   - Event-driven (consumes from message bus)\n\n7. Infrastructure\n   - Message Bus: RabbitMQ/Kafka\n   - Cache: Redis\n   - Service Discovery: Consul/Kubernetes\n   - Config: Consul/Azure App Config\n   - Observability: Prometheus + Grafana + Jaeger",
        "codeType": "neutral"
      },
      {
        "type": "text",
        "content": "Example Saga Implementation:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderSaga\n{\n    private readonly IInventoryService _inventory;\n    private readonly IPaymentService _payment;\n    private readonly IShippingService _shipping;\n    private readonly IMessageBus _bus;\n\n    public async Task<OrderResult> ProcessOrderAsync(CreateOrderCommand command)\n    {\n        var orderId = Guid.NewGuid();\n        var reservationId = Guid.Empty;\n        var paymentId = Guid.Empty;\n\n        try\n        {\n            // Step 1: Reserve inventory\n            reservationId = await _inventory.ReserveAsync(\n                command.Items,\n                TimeSpan.FromMinutes(10));\n\n            // Step 2: Process payment\n            paymentId = await _payment.ChargeAsync(\n                command.CustomerId,\n                command.TotalAmount);\n\n            // Step 3: Create shipment\n            var shipmentId = await _shipping.CreateShipmentAsync(\n                orderId,\n                command.ShippingAddress);\n\n            // Step 4: Complete order\n            await _bus.PublishAsync(new OrderCompletedEvent\n            {\n                OrderId = orderId,\n                PaymentId = paymentId,\n                ShipmentId = shipmentId\n            });\n\n            return OrderResult.Success(orderId);\n        }\n        catch (Exception ex)\n        {\n            // Compensating transactions\n            if (paymentId != Guid.Empty)\n            {\n                await _payment.RefundAsync(paymentId);\n            }\n\n            if (reservationId != Guid.Empty)\n            {\n                await _inventory.ReleaseReservationAsync(reservationId);\n            }\n\n            await _bus.PublishAsync(new OrderFailedEvent\n            {\n                OrderId = orderId,\n                Reason = ex.Message\n            });\n\n            return OrderResult.Failed(ex.Message);\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "System Design",
    "topicId": "system-design",
    "source": "practice/sub-notes/system-design.md",
    "id": "card-304"
  },
  {
    "question": "Design service-to-service communication strategy: when to use sync vs async?",
    "answer": [
      {
        "type": "text",
        "content": "Choose based on coupling, latency, and failure tolerance requirements."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Synchronous (HTTP/gRPC) - Use when:\n// - Immediate response needed\n// - Simple request/response\n// - Strong consistency required\npublic class OrderController : ControllerBase\n{\n    private readonly IInventoryClient _inventoryClient;\n\n    [HttpPost]\n    public async Task<IActionResult> CreateOrder(OrderDto dto)\n    {\n        // Synchronous call for immediate stock check\n        var available = await _inventoryClient.CheckAvailabilityAsync(dto.Items);\n        if (!available)\n            return BadRequest(\"Insufficient stock\");\n\n        // Process order...\n        return Ok();\n    }\n}\n\n// Asynchronous (Message Bus) - Use when:\n// - Fire-and-forget acceptable\n// - Eventual consistency OK\n// - Decoupling important\n// - Multiple consumers\npublic class OrderCreatedHandler : IMessageHandler<OrderCreatedEvent>\n{\n    private readonly IEmailService _emailService;\n    private readonly IAnalyticsService _analytics;\n\n    public async Task HandleAsync(OrderCreatedEvent evt)\n    {\n        // Multiple services can react independently\n        await _emailService.SendConfirmationAsync(evt.CustomerId);\n        await _analytics.TrackOrderAsync(evt);\n    }\n}\n\n// Hybrid Approach - Request/Response over Message Bus\npublic class InventoryQueryHandler\n{\n    private readonly IMessageBus _bus;\n\n    public async Task<StockLevel> GetStockAsync(string productId)\n    {\n        var correlationId = Guid.NewGuid().ToString();\n        var tcs = new TaskCompletionSource<StockLevel>();\n\n        // Register one-time response handler\n        _bus.Subscribe<StockLevelResponse>(correlationId, response =>\n        {\n            tcs.SetResult(response.Level);\n        });\n\n        // Send query\n        await _bus.PublishAsync(new StockLevelQuery\n        {\n            ProductId = productId,\n            CorrelationId = correlationId\n        });\n\n        // Wait for response with timeout\n        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));\n        return await tcs.Task.WaitAsync(cts.Token);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "System Design",
    "topicId": "system-design",
    "source": "practice/sub-notes/system-design.md",
    "id": "card-305"
  },
  {
    "question": "Implement service discovery pattern for dynamic service registration.",
    "answer": [
      {
        "type": "text",
        "content": "Use Consul or Kubernetes service discovery."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Service Registration\npublic class ConsulServiceRegistration : IHostedService\n{\n    private readonly IConsulClient _consulClient;\n    private readonly IConfiguration _configuration;\n    private string _registrationId;\n\n    public async Task StartAsync(CancellationToken cancellationToken)\n    {\n        _registrationId = $\"{_configuration[\"ServiceName\"]}-{Guid.NewGuid()}\";\n\n        var registration = new AgentServiceRegistration\n        {\n            ID = _registrationId,\n            Name = _configuration[\"ServiceName\"],\n            Address = _configuration[\"ServiceAddress\"],\n            Port = int.Parse(_configuration[\"ServicePort\"]),\n            Tags = new[] { \"api\", \"v1\" },\n            Check = new AgentServiceCheck\n            {\n                HTTP = $\"http://{_configuration[\"ServiceAddress\"]}:{_configuration[\"ServicePort\"]}/health\",\n                Interval = TimeSpan.FromSeconds(10),\n                Timeout = TimeSpan.FromSeconds(5),\n                DeregisterCriticalServiceAfter = TimeSpan.FromMinutes(1)\n            }\n        };\n\n        await _consulClient.Agent.ServiceRegister(registration, cancellationToken);\n    }\n\n    public async Task StopAsync(CancellationToken cancellationToken)\n    {\n        await _consulClient.Agent.ServiceDeregister(_registrationId, cancellationToken);\n    }\n}\n\n// Service Discovery\npublic class ConsulServiceDiscovery\n{\n    private readonly IConsulClient _consulClient;\n    private readonly IMemoryCache _cache;\n\n    public async Task<ServiceEndpoint> DiscoverServiceAsync(string serviceName)\n    {\n        return await _cache.GetOrCreateAsync($\"service:{serviceName}\", async entry =>\n        {\n            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30);\n\n            var services = await _consulClient.Health.Service(serviceName, tag: null, passingOnly: true);\n            var service = services.Response\n                .OrderBy(_ => Guid.NewGuid()) // Random selection\n                .FirstOrDefault();\n\n            if (service == null)\n                throw new ServiceNotFoundException(serviceName);\n\n            return new ServiceEndpoint\n            {\n                Address = service.Service.Address,\n                Port = service.Service.Port\n            };\n        });\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "System Design",
    "topicId": "system-design",
    "source": "practice/sub-notes/system-design.md",
    "id": "card-306"
  },
  {
    "question": "Implement CQRS pattern for an order management system.",
    "answer": [
      {
        "type": "text",
        "content": "Separate read and write models with different databases."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Write Model (Commands)\npublic class CreateOrderCommand\n{\n    public Guid CustomerId { get; set; }\n    public List<OrderItem> Items { get; set; }\n    public Address ShippingAddress { get; set; }\n}\n\npublic class CreateOrderCommandHandler\n{\n    private readonly OrderDbContext _writeDb;\n    private readonly IMessageBus _bus;\n\n    public async Task<Guid> HandleAsync(CreateOrderCommand command)\n    {\n        var order = new Order\n        {\n            Id = Guid.NewGuid(),\n            CustomerId = command.CustomerId,\n            Items = command.Items,\n            Status = OrderStatus.Pending,\n            CreatedAt = DateTime.UtcNow\n        };\n\n        _writeDb.Orders.Add(order);\n        await _writeDb.SaveChangesAsync();\n\n        // Publish event for read model update\n        await _bus.PublishAsync(new OrderCreatedEvent\n        {\n            OrderId = order.Id,\n            CustomerId = order.CustomerId,\n            Items = order.Items,\n            Total = order.Items.Sum(i => i.Price * i.Quantity),\n            CreatedAt = order.CreatedAt\n        });\n\n        return order.Id;\n    }\n}\n\n// Read Model (Queries)\npublic class OrderSummaryQuery\n{\n    public Guid CustomerId { get; set; }\n    public DateTime? FromDate { get; set; }\n    public DateTime? ToDate { get; set; }\n}\n\npublic class OrderSummaryQueryHandler\n{\n    private readonly IMongoDatabase _readDb; // Denormalized read database\n\n    public async Task<List<OrderSummary>> HandleAsync(OrderSummaryQuery query)\n    {\n        var collection = _readDb.GetCollection<OrderSummary>(\"order_summaries\");\n\n        var filter = Builders<OrderSummary>.Filter.Eq(o => o.CustomerId, query.CustomerId);\n\n        if (query.FromDate.HasValue)\n            filter &= Builders<OrderSummary>.Filter.Gte(o => o.CreatedAt, query.FromDate.Value);\n\n        if (query.ToDate.HasValue)\n            filter &= Builders<OrderSummary>.Filter.Lte(o => o.CreatedAt, query.ToDate.Value);\n\n        return await collection.Find(filter).ToListAsync();\n    }\n}\n\n// Read Model Updater (Event Handler)\npublic class OrderCreatedEventHandler : IMessageHandler<OrderCreatedEvent>\n{\n    private readonly IMongoDatabase _readDb;\n\n    public async Task HandleAsync(OrderCreatedEvent evt)\n    {\n        var collection = _readDb.GetCollection<OrderSummary>(\"order_summaries\");\n\n        var summary = new OrderSummary\n        {\n            OrderId = evt.OrderId,\n            CustomerId = evt.CustomerId,\n            ItemCount = evt.Items.Count,\n            TotalAmount = evt.Total,\n            CreatedAt = evt.CreatedAt,\n            Status = \"Pending\"\n        };\n\n        await collection.InsertOneAsync(summary);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "System Design",
    "topicId": "system-design",
    "source": "practice/sub-notes/system-design.md",
    "id": "card-307"
  },
  {
    "question": "Design event sourcing system for account transactions.",
    "answer": [
      {
        "type": "text",
        "content": "Store all state changes as events, rebuild state by replaying events."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Domain Events\npublic abstract record DomainEvent\n{\n    public Guid AggregateId { get; init; }\n    public long Version { get; init; }\n    public DateTime Timestamp { get; init; }\n}\n\npublic record AccountCreatedEvent : DomainEvent\n{\n    public string AccountNumber { get; init; }\n    public string CustomerName { get; init; }\n}\n\npublic record FundsDepositedEvent : DomainEvent\n{\n    public decimal Amount { get; init; }\n    public string Description { get; init; }\n}\n\npublic record FundsWithdrawnEvent : DomainEvent\n{\n    public decimal Amount { get; init; }\n    public string Description { get; init; }\n}\n\n// Aggregate\npublic class Account\n{\n    private readonly List<DomainEvent> _uncommittedEvents = new();\n\n    public Guid Id { get; private set; }\n    public string AccountNumber { get; private set; }\n    public decimal Balance { get; private set; }\n    public long Version { get; private set; }\n\n    // Factory method\n    public static Account Create(Guid id, string accountNumber, string customerName)\n    {\n        var account = new Account();\n        account.Apply(new AccountCreatedEvent\n        {\n            AggregateId = id,\n            AccountNumber = accountNumber,\n            CustomerName = customerName,\n            Version = 1,\n            Timestamp = DateTime.UtcNow\n        });\n        return account;\n    }\n\n    // Command methods\n    public void Deposit(decimal amount, string description)\n    {\n        if (amount <= 0)\n            throw new InvalidOperationException(\"Amount must be positive\");\n\n        Apply(new FundsDepositedEvent\n        {\n            AggregateId = Id,\n            Amount = amount,\n            Description = description,\n            Version = Version + 1,\n            Timestamp = DateTime.UtcNow\n        });\n    }\n\n    public void Withdraw(decimal amount, string description)\n    {\n        if (amount <= 0)\n            throw new InvalidOperationException(\"Amount must be positive\");\n\n        if (Balance < amount)\n            throw new InvalidOperationException(\"Insufficient funds\");\n\n        Apply(new FundsWithdrawnEvent\n        {\n            AggregateId = Id,\n            Amount = amount,\n            Description = description,\n            Version = Version + 1,\n            Timestamp = DateTime.UtcNow\n        });\n    }\n\n    // Event application\n    private void Apply(DomainEvent @event)\n    {\n        When(@event);\n        _uncommittedEvents.Add(@event);\n    }\n\n    private void When(DomainEvent @event)\n    {\n        switch (@event)\n        {\n            case AccountCreatedEvent e:\n                Id = e.AggregateId;\n                AccountNumber = e.AccountNumber;\n                Balance = 0;\n                Version = e.Version;\n                break;\n\n            case FundsDepositedEvent e:\n                Balance += e.Amount;\n                Version = e.Version;\n                break;\n\n            case FundsWithdrawnEvent e:\n                Balance -= e.Amount;\n                Version = e.Version;\n                break;\n        }\n    }\n\n    // Reconstitution from event stream\n    public static Account FromEvents(IEnumerable<DomainEvent> events)\n    {\n        var account = new Account();\n        foreach (var @event in events)\n        {\n            account.When(@event);\n        }\n        return account;\n    }\n\n    public IReadOnlyList<DomainEvent> GetUncommittedEvents() => _uncommittedEvents;\n    public void MarkEventsAsCommitted() => _uncommittedEvents.Clear();\n}\n\n// Event Store\npublic class EventStore\n{\n    private readonly DbContext _dbContext;\n\n    public async Task SaveEventsAsync(Guid aggregateId, IEnumerable<DomainEvent> events, long expectedVersion)\n    {\n        // Optimistic concurrency check\n        var currentVersion = await _dbContext.Events\n            .Where(e => e.AggregateId == aggregateId)\n            .MaxAsync(e => (long?)e.Version) ?? 0;\n\n        if (currentVersion != expectedVersion)\n            throw new ConcurrencyException($\"Expected version {expectedVersion}, but found {currentVersion}\");\n\n        foreach (var @event in events)\n        {\n            _dbContext.Events.Add(new EventRecord\n            {\n                AggregateId = aggregateId,\n                EventType = @event.GetType().Name,\n                EventData = JsonSerializer.Serialize(@event),\n                Version = @event.Version,\n                Timestamp = @event.Timestamp\n            });\n        }\n\n        await _dbContext.SaveChangesAsync();\n    }\n\n    public async Task<List<DomainEvent>> GetEventsAsync(Guid aggregateId)\n    {\n        var records = await _dbContext.Events\n            .Where(e => e.AggregateId == aggregateId)\n            .OrderBy(e => e.Version)\n            .ToListAsync();\n\n        return records.Select(r => DeserializeEvent(r.EventType, r.EventData)).ToList();\n    }\n\n    private DomainEvent DeserializeEvent(string eventType, string eventData)\n    {\n        var type = Type.GetType($\"YourNamespace.{eventType}\");\n        return (DomainEvent)JsonSerializer.Deserialize(eventData, type);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "System Design",
    "topicId": "system-design",
    "source": "practice/sub-notes/system-design.md",
    "id": "card-308"
  },
  {
    "question": "Design a multi-layer caching strategy (L1: in-memory, L2: Redis, L3: database).",
    "answer": [
      {
        "type": "text",
        "content": "Implement cache-aside pattern with fallback layers."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class MultiLayerCache<T>\n{\n    private readonly IMemoryCache _l1Cache;\n    private readonly IDistributedCache _l2Cache;\n    private readonly Func<string, Task<T>> _l3Loader;\n    private readonly ILogger<MultiLayerCache<T>> _logger;\n\n    public MultiLayerCache(\n        IMemoryCache l1Cache,\n        IDistributedCache l2Cache,\n        Func<string, Task<T>> l3Loader,\n        ILogger<MultiLayerCache<T>> logger)\n    {\n        _l1Cache = l1Cache;\n        _l2Cache = l2Cache;\n        _l3Loader = l3Loader;\n        _logger = logger;\n    }\n\n    public async Task<T> GetAsync(string key)\n    {\n        // L1: Memory cache\n        if (_l1Cache.TryGetValue(key, out T value))\n        {\n            _logger.LogDebug(\"Cache hit: L1 (Memory) for key {Key}\", key);\n            return value;\n        }\n\n        // L2: Redis cache\n        var l2Data = await _l2Cache.GetStringAsync(key);\n        if (l2Data != null)\n        {\n            _logger.LogDebug(\"Cache hit: L2 (Redis) for key {Key}\", key);\n            value = JsonSerializer.Deserialize<T>(l2Data);\n\n            // Populate L1\n            _l1Cache.Set(key, value, TimeSpan.FromMinutes(5));\n\n            return value;\n        }\n\n        // L3: Database\n        _logger.LogDebug(\"Cache miss: Loading from database for key {Key}\", key);\n        value = await _l3Loader(key);\n\n        if (value != null)\n        {\n            // Populate L2 and L1\n            var serialized = JsonSerializer.Serialize(value);\n            await _l2Cache.SetStringAsync(\n                key,\n                serialized,\n                new DistributedCacheEntryOptions\n                {\n                    AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)\n                });\n\n            _l1Cache.Set(key, value, TimeSpan.FromMinutes(5));\n        }\n\n        return value;\n    }\n\n    public async Task SetAsync(string key, T value)\n    {\n        // Write through all layers\n        _l1Cache.Set(key, value, TimeSpan.FromMinutes(5));\n\n        var serialized = JsonSerializer.Serialize(value);\n        await _l2Cache.SetStringAsync(\n            key,\n            serialized,\n            new DistributedCacheEntryOptions\n            {\n                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)\n            });\n    }\n\n    public async Task InvalidateAsync(string key)\n    {\n        _l1Cache.Remove(key);\n        await _l2Cache.RemoveAsync(key);\n    }\n}\n\n// Usage\npublic class ProductService\n{\n    private readonly MultiLayerCache<Product> _cache;\n    private readonly DbContext _db;\n\n    public ProductService(\n        IMemoryCache memoryCache,\n        IDistributedCache distributedCache,\n        DbContext db,\n        ILogger<MultiLayerCache<Product>> logger)\n    {\n        _db = db;\n        _cache = new MultiLayerCache<Product>(\n            memoryCache,\n            distributedCache,\n            async (key) => await _db.Products.FindAsync(key),\n            logger);\n    }\n\n    public async Task<Product> GetProductAsync(string id)\n    {\n        return await _cache.GetAsync($\"product:{id}\");\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "System Design",
    "topicId": "system-design",
    "source": "practice/sub-notes/system-design.md",
    "id": "card-309"
  },
  {
    "question": "Implement cache invalidation strategy for distributed systems.",
    "answer": [
      {
        "type": "text",
        "content": "Use pub/sub pattern for cache invalidation."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class DistributedCacheInvalidator\n{\n    private readonly IConnectionMultiplexer _redis;\n    private readonly IMemoryCache _localCache;\n    private readonly ILogger<DistributedCacheInvalidator> _logger;\n    private ISubscriber _subscriber;\n\n    public DistributedCacheInvalidator(\n        IConnectionMultiplexer redis,\n        IMemoryCache localCache,\n        ILogger<DistributedCacheInvalidator> logger)\n    {\n        _redis = redis;\n        _localCache = localCache;\n        _logger = logger;\n    }\n\n    public async Task InitializeAsync()\n    {\n        _subscriber = _redis.GetSubscriber();\n        await _subscriber.SubscribeAsync(\"cache:invalidate\", (channel, message) =>\n        {\n            _logger.LogInformation(\"Received cache invalidation for: {Key}\", message);\n            _localCache.Remove(message);\n        });\n    }\n\n    public async Task InvalidateAsync(string key)\n    {\n        // Remove from local cache\n        _localCache.Remove(key);\n\n        // Remove from Redis\n        var db = _redis.GetDatabase();\n        await db.KeyDeleteAsync(key);\n\n        // Notify other instances\n        await _subscriber.PublishAsync(\"cache:invalidate\", key);\n        _logger.LogInformation(\"Published cache invalidation for: {Key}\", key);\n    }\n\n    public async Task InvalidatePatternAsync(string pattern)\n    {\n        var db = _redis.GetDatabase();\n        var endpoints = _redis.GetEndPoints();\n\n        foreach (var endpoint in endpoints)\n        {\n            var server = _redis.GetServer(endpoint);\n            var keys = server.Keys(pattern: pattern);\n\n            foreach (var key in keys)\n            {\n                await InvalidateAsync(key);\n            }\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "System Design",
    "topicId": "system-design",
    "source": "practice/sub-notes/system-design.md",
    "id": "card-310"
  },
  {
    "question": "Design read replica strategy for handling high read traffic.",
    "answer": [
      {
        "type": "text",
        "content": "Separate read and write database connections."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class DatabaseConnectionFactory\n{\n    private readonly string _writeConnectionString;\n    private readonly List<string> _readConnectionStrings;\n    private int _currentReadIndex = 0;\n\n    public DatabaseConnectionFactory(IConfiguration configuration)\n    {\n        _writeConnectionString = configuration.GetConnectionString(\"WriteDatabase\");\n        _readConnectionStrings = configuration.GetSection(\"ReadDatabases\")\n            .Get<List<string>>();\n    }\n\n    public DbConnection GetWriteConnection()\n    {\n        return new SqlConnection(_writeConnectionString);\n    }\n\n    public DbConnection GetReadConnection()\n    {\n        // Round-robin load balancing\n        var index = Interlocked.Increment(ref _currentReadIndex) % _readConnectionStrings.Count;\n        return new SqlConnection(_readConnectionStrings[index]);\n    }\n}\n\n// DbContext with read/write separation\npublic class TradingDbContext : DbContext\n{\n    private readonly DatabaseConnectionFactory _connectionFactory;\n    private readonly bool _isReadOnly;\n\n    public TradingDbContext(\n        DbContextOptions<TradingDbContext> options,\n        DatabaseConnectionFactory connectionFactory,\n        bool isReadOnly = false)\n        : base(options)\n    {\n        _connectionFactory = connectionFactory;\n        _isReadOnly = isReadOnly;\n    }\n\n    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)\n    {\n        if (!optionsBuilder.IsConfigured)\n        {\n            var connection = _isReadOnly\n                ? _connectionFactory.GetReadConnection()\n                : _connectionFactory.GetWriteConnection();\n\n            optionsBuilder.UseSqlServer(connection);\n        }\n    }\n}\n\n// Repository with read/write contexts\npublic class OrderRepository\n{\n    private readonly IDbContextFactory<TradingDbContext> _contextFactory;\n\n    public async Task<Order> GetByIdAsync(Guid id)\n    {\n        // Use read replica\n        await using var context = _contextFactory.CreateDbContext();\n        context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;\n\n        return await context.Orders\n            .AsNoTracking()\n            .FirstOrDefaultAsync(o => o.Id == id);\n    }\n\n    public async Task<Guid> CreateAsync(Order order)\n    {\n        // Use write database\n        await using var context = _contextFactory.CreateDbContext();\n\n        context.Orders.Add(order);\n        await context.SaveChangesAsync();\n\n        return order.Id;\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "System Design",
    "topicId": "system-design",
    "source": "practice/sub-notes/system-design.md",
    "id": "card-311"
  },
  {
    "question": "Design database sharding strategy for multi-tenant application.",
    "answer": [
      {
        "type": "text",
        "content": "Implement tenant-based sharding."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface IShardSelector\n{\n    string SelectShard(string tenantId);\n}\n\npublic class HashBasedShardSelector : IShardSelector\n{\n    private readonly List<string> _shardConnectionStrings;\n\n    public HashBasedShardSelector(IConfiguration configuration)\n    {\n        _shardConnectionStrings = configuration.GetSection(\"Shards\")\n            .Get<List<string>>();\n    }\n\n    public string SelectShard(string tenantId)\n    {\n        var hash = tenantId.GetHashCode();\n        var shardIndex = Math.Abs(hash) % _shardConnectionStrings.Count;\n        return _shardConnectionStrings[shardIndex];\n    }\n}\n\npublic class ShardedDbContextFactory\n{\n    private readonly IShardSelector _shardSelector;\n    private readonly ITenantService _tenantService;\n\n    public ShardedDbContextFactory(\n        IShardSelector shardSelector,\n        ITenantService tenantService)\n    {\n        _shardSelector = shardSelector;\n        _tenantService = tenantService;\n    }\n\n    public TradingDbContext CreateContext()\n    {\n        var tenantId = _tenantService.GetCurrentTenantId();\n        var connectionString = _shardSelector.SelectShard(tenantId);\n\n        var optionsBuilder = new DbContextOptionsBuilder<TradingDbContext>();\n        optionsBuilder.UseSqlServer(connectionString);\n\n        return new TradingDbContext(optionsBuilder.Options);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "System Design",
    "topicId": "system-design",
    "source": "practice/sub-notes/system-design.md",
    "id": "card-312"
  },
  {
    "question": "Design circuit breaker pattern for external API calls.",
    "answer": [
      {
        "type": "text",
        "content": "Already covered in async-resilience.md, but here's a distributed version using Redis:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class DistributedCircuitBreaker\n{\n    private readonly IConnectionMultiplexer _redis;\n    private readonly string _serviceKey;\n    private readonly int _failureThreshold;\n    private readonly TimeSpan _timeout;\n\n    public DistributedCircuitBreaker(\n        IConnectionMultiplexer redis,\n        string serviceKey,\n        int failureThreshold,\n        TimeSpan timeout)\n    {\n        _redis = redis;\n        _serviceKey = $\"circuit:{serviceKey}\";\n        _failureThreshold = failureThreshold;\n        _timeout = timeout;\n    }\n\n    public async Task<T> ExecuteAsync<T>(Func<Task<T>> operation)\n    {\n        var db = _redis.GetDatabase();\n\n        // Check circuit state\n        var state = await db.StringGetAsync($\"{_serviceKey}:state\");\n        if (state == \"open\")\n        {\n            var openedAt = await db.StringGetAsync($\"{_serviceKey}:opened_at\");\n            if (!openedAt.IsNullOrEmpty)\n            {\n                var openTime = DateTimeOffset.FromUnixTimeSeconds((long)openedAt);\n                if (DateTimeOffset.UtcNow - openTime < _timeout)\n                {\n                    throw new CircuitBreakerOpenException();\n                }\n\n                // Try half-open\n                await db.StringSetAsync($\"{_serviceKey}:state\", \"half-open\");\n            }\n        }\n\n        try\n        {\n            var result = await operation();\n\n            // Success - reset if half-open\n            if (state == \"half-open\")\n            {\n                await db.KeyDeleteAsync($\"{_serviceKey}:failures\");\n                await db.StringSetAsync($\"{_serviceKey}:state\", \"closed\");\n            }\n\n            return result;\n        }\n        catch (Exception)\n        {\n            var failures = await db.StringIncrementAsync($\"{_serviceKey}:failures\");\n\n            if (failures >= _failureThreshold)\n            {\n                await db.StringSetAsync($\"{_serviceKey}:state\", \"open\");\n                await db.StringSetAsync(\n                    $\"{_serviceKey}:opened_at\",\n                    DateTimeOffset.UtcNow.ToUnixTimeSeconds());\n            }\n\n            throw;\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "System Design",
    "topicId": "system-design",
    "source": "practice/sub-notes/system-design.md",
    "id": "card-313"
  },
  {
    "question": "Implement health check aggregator for microservices.",
    "answer": [
      {
        "type": "text",
        "content": "Collect health status from all services."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class AggregatedHealthCheck : IHealthCheck\n{\n    private readonly IHttpClientFactory _httpClientFactory;\n    private readonly IConfiguration _configuration;\n\n    public async Task<HealthCheckResult> CheckHealthAsync(\n        HealthCheckContext context,\n        CancellationToken cancellationToken = default)\n    {\n        var services = _configuration.GetSection(\"DependentServices\")\n            .Get<List<ServiceEndpoint>>();\n\n        var tasks = services.Select(async service =>\n        {\n            try\n            {\n                var client = _httpClientFactory.CreateClient();\n                var response = await client.GetAsync(\n                    $\"{service.Url}/health\",\n                    cancellationToken);\n\n                return new ServiceHealth\n                {\n                    ServiceName = service.Name,\n                    IsHealthy = response.IsSuccessStatusCode,\n                    ResponseTime = response.Headers.Age?.TotalMilliseconds ?? 0\n                };\n            }\n            catch (Exception ex)\n            {\n                return new ServiceHealth\n                {\n                    ServiceName = service.Name,\n                    IsHealthy = false,\n                    Error = ex.Message\n                };\n            }\n        });\n\n        var results = await Task.WhenAll(tasks);\n        var unhealthy = results.Where(r => !r.IsHealthy).ToList();\n\n        if (unhealthy.Any())\n        {\n            return HealthCheckResult.Degraded(\n                $\"Services unhealthy: {string.Join(\", \", unhealthy.Select(u => u.ServiceName))}\",\n                data: results.ToDictionary(r => r.ServiceName, r => (object)r));\n        }\n\n        return HealthCheckResult.Healthy(\"All services healthy\",\n            data: results.ToDictionary(r => r.ServiceName, r => (object)r));\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "System Design",
    "topicId": "system-design",
    "source": "practice/sub-notes/system-design.md",
    "id": "card-314"
  },
  {
    "question": "Design distributed tracing system using OpenTelemetry.",
    "answer": [
      {
        "type": "text",
        "content": "Implement tracing across microservices."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "// Startup configuration\nvar tracerProvider = Sdk.CreateTracerProviderBuilder()\n    .AddSource(\"TradingService\")\n    .SetResourceBuilder(ResourceBuilder.CreateDefault()\n        .AddService(\"TradingService\", serviceVersion: \"1.0.0\"))\n    .AddAspNetCoreInstrumentation(options =>\n    {\n        options.RecordException = true;\n        options.Filter = (httpContext) =>\n        {\n            // Don't trace health checks\n            return !httpContext.Request.Path.StartsWithSegments(\"/health\");\n        };\n    })\n    .AddHttpClientInstrumentation()\n    .AddSqlClientInstrumentation(options =>\n    {\n        options.SetDbStatementForText = true;\n        options.RecordException = true;\n    })\n    .AddJaegerExporter(options =>\n    {\n        options.AgentHost = \"jaeger\";\n        options.AgentPort = 6831;\n    })\n    .Build();\n\n// Custom tracing in business logic\npublic class OrderService\n{\n    private static readonly ActivitySource ActivitySource = new(\"TradingService\");\n    private readonly ILogger<OrderService> _logger;\n\n    public async Task<OrderResult> ProcessOrderAsync(CreateOrderRequest request)\n    {\n        using var activity = ActivitySource.StartActivity(\"ProcessOrder\", ActivityKind.Server);\n        activity?.SetTag(\"order.customer_id\", request.CustomerId);\n        activity?.SetTag(\"order.item_count\", request.Items.Count);\n\n        try\n        {\n            // Step 1: Validate\n            using (var validateActivity = ActivitySource.StartActivity(\"ValidateOrder\"))\n            {\n                await ValidateOrderAsync(request);\n                validateActivity?.SetTag(\"validation.result\", \"success\");\n            }\n\n            // Step 2: Create order\n            Guid orderId;\n            using (var createActivity = ActivitySource.StartActivity(\"CreateOrder\"))\n            {\n                orderId = await CreateOrderInDatabaseAsync(request);\n                createActivity?.SetTag(\"order.id\", orderId);\n            }\n\n            // Step 3: Publish event\n            using (var publishActivity = ActivitySource.StartActivity(\"PublishOrderEvent\"))\n            {\n                await PublishOrderCreatedEventAsync(orderId);\n            }\n\n            activity?.SetStatus(ActivityStatusCode.Ok);\n            return OrderResult.Success(orderId);\n        }\n        catch (Exception ex)\n        {\n            activity?.SetStatus(ActivityStatusCode.Error, ex.Message);\n            activity?.RecordException(ex);\n            _logger.LogError(ex, \"Failed to process order\");\n            throw;\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "System Design",
    "topicId": "system-design",
    "source": "practice/sub-notes/system-design.md",
    "id": "card-315"
  },
  {
    "question": "Implement centralized logging with correlation IDs.",
    "answer": [
      {
        "type": "text",
        "content": "Use structured logging with correlation tracking."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class CorrelationIdMiddleware\n{\n    private readonly RequestDelegate _next;\n    private const string CorrelationIdHeader = \"X-Correlation-ID\";\n\n    public async Task InvokeAsync(HttpContext context)\n    {\n        var correlationId = context.Request.Headers[CorrelationIdHeader].FirstOrDefault()\n            ?? Guid.NewGuid().ToString();\n\n        context.Items[\"CorrelationId\"] = correlationId;\n        context.Response.Headers.Add(CorrelationIdHeader, correlationId);\n\n        using (_logger.BeginScope(new Dictionary<string, object>\n        {\n            [\"CorrelationId\"] = correlationId,\n            [\"RequestPath\"] = context.Request.Path\n        }))\n        {\n            await _next(context);\n        }\n    }\n}\n\n// Propagate to downstream services\npublic class CorrelationIdDelegatingHandler : DelegatingHandler\n{\n    private readonly IHttpContextAccessor _httpContextAccessor;\n\n    protected override async Task<HttpResponseMessage> SendAsync(\n        HttpRequestMessage request,\n        CancellationToken cancellationToken)\n    {\n        var correlationId = _httpContextAccessor.HttpContext?.Items[\"CorrelationId\"] as string;\n        if (!string.IsNullOrEmpty(correlationId))\n        {\n            request.Headers.Add(\"X-Correlation-ID\", correlationId);\n        }\n\n        return await base.SendAsync(request, cancellationToken);\n    }\n}\n\n// Register handler\nservices.AddHttpClient(\"DownstreamService\")\n    .AddHttpMessageHandler<CorrelationIdDelegatingHandler>();",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "System Design",
    "topicId": "system-design",
    "source": "practice/sub-notes/system-design.md",
    "id": "card-316"
  },
  {
    "question": "Design a multi-region failover strategy for a trading platform.",
    "answer": [
      {
        "type": "text",
        "content": "Use active-active for read-heavy services, active-passive for write-heavy, with DNS failover, replicated data stores, and idempotent writes."
      },
      {
        "type": "text",
        "content": "Reads (market data, reporting) can be served locally for low latency, while writes go to a single primary region to avoid conflicts. Failover is handled via health checks and traffic rerouting, with idempotency preventing duplicate orders during retries."
      }
    ],
    "category": "practice",
    "topic": "System Design",
    "topicId": "system-design",
    "source": "practice/sub-notes/system-design.md",
    "id": "card-317"
  },
  {
    "question": "How would you shard a multi-tenant database for scale?",
    "answer": [
      {
        "type": "text",
        "content": "Choose a shard key (tenant id), use consistent hashing, route via a shard map, and ensure cross-shard queries are minimized or handled via read models."
      },
      {
        "type": "text",
        "content": "A shard map allows moving or isolating large tenants without code changes. Global queries are usually served from aggregated read models instead of live cross-shard joins."
      }
    ],
    "category": "practice",
    "topic": "System Design",
    "topicId": "system-design",
    "source": "practice/sub-notes/system-design.md",
    "id": "card-318"
  },
  {
    "question": "Describe a cache invalidation strategy for price snapshots.",
    "answer": [
      {
        "type": "text",
        "content": "Use short TTLs, write-through cache for authoritative updates, and a pub/sub channel to invalidate per-symbol keys on updates."
      },
      {
        "type": "text",
        "content": "Short TTLs (Time-To-Live) limit staleness, while pub/sub (Publish–Subscribe) ensures fast propagation of price changes. Versioning or timestamps help prevent out-of-order updates from overwriting newer prices."
      }
    ],
    "category": "practice",
    "topic": "System Design",
    "topicId": "system-design",
    "source": "practice/sub-notes/system-design.md",
    "id": "card-319"
  },
  {
    "question": "When would you use event sourcing versus state storage?",
    "answer": [
      {
        "type": "text",
        "content": "Event sourcing is useful for auditability and replay; state storage is simpler for CRUD-heavy systems. Consider storage costs, query complexity, and regulatory requirements."
      },
      {
        "type": "text",
        "content": "Event sourcing fits domains like orders and trades where history and traceability matter. State storage is preferred when simplicity, performance, and direct querying are more important."
      }
    ],
    "category": "practice",
    "topic": "System Design",
    "topicId": "system-design",
    "source": "practice/sub-notes/system-design.md",
    "id": "card-320"
  },
  {
    "question": "How do you handle backpressure in a streaming system?",
    "answer": [
      {
        "type": "text",
        "content": "Apply bounded queues, adaptive batching, and consumer-side flow control. Drop or coalesce low-priority updates when queues exceed thresholds."
      },
      {
        "type": "text",
        "content": "Market data streams often coalesce updates per symbol to keep only the latest value. Critical messages are prioritized so correctness is preserved under load."
      },
      {
        "type": "text",
        "content": "Total Exercises: 30+"
      },
      {
        "type": "text",
        "content": "Master these patterns to design scalable, resilient distributed systems!"
      }
    ],
    "category": "practice",
    "topic": "System Design",
    "topicId": "system-design",
    "source": "practice/sub-notes/system-design.md",
    "id": "card-321"
  },
  {
    "question": "Describe the lifecycle of a forex trade from placement to settlement.",
    "answer": [
      {
        "type": "text",
        "content": "Steps: quote, order placement, validation, routing, execution (fill/partial), confirmation, settlement (T+2), P&L updates. Post-trade, apply trade capture in back-office systems and reconcile with liquidity providers. Include margin checks and clearing, corporate actions, and overnight financing (swap) adjustments."
      }
    ],
    "category": "practice",
    "topic": "Trading Domain",
    "topicId": "trading-domain",
    "source": "practice/sub-notes/trading-domain.md",
    "id": "card-322"
  },
  {
    "question": "How would you integrate with MT4/MT5 APIs for trade execution in C#? Mention authentication, session management, and error handling.",
    "answer": [
      {
        "type": "text",
        "content": "Use MetaTrader Manager/Server APIs via C# wrappers; handle session auth, keep-alive, throttle requests. Manage connections via dedicated service accounts and pre-allocate connection pools. Implement reconnect logic, map errors, ensure idempotent order submission. Translate MT-specific error codes into domain-level responses for clients."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "using var session = new Mt5Gateway(credentials);\nawait session.ConnectAsync();\nvar ticket = await session.SendOrderAsync(request);",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Trading Domain",
    "topicId": "trading-domain",
    "source": "practice/sub-notes/trading-domain.md",
    "id": "card-323"
  },
  {
    "question": "What are common risk checks before executing a client order (e.g., margin, exposure limits)?",
    "answer": [
      {
        "type": "text",
        "content": "Margin availability, max exposure per instrument, credit limits, duplicate orders, fat-finger (price deviation). Implement pre-trade risk service."
      }
    ],
    "category": "practice",
    "topic": "Trading Domain",
    "topicId": "trading-domain",
    "source": "practice/sub-notes/trading-domain.md",
    "id": "card-324"
  },
  {
    "question": "Explain how you'd handle market data bursts without dropping updates.",
    "answer": [
      {
        "type": "text",
        "content": "Use batching, diff updates, UDP multicast ingestion, prioritized queues, snapshot + incremental updates. Utilize adaptive sampling—send every tick to VIP clients while throttling retail feeds. Apply throttling per client, drop non-critical updates after stale, and monitor queue depths to trigger auto-scaling."
      }
    ],
    "category": "practice",
    "topic": "Trading Domain",
    "topicId": "trading-domain",
    "source": "practice/sub-notes/trading-domain.md",
    "id": "card-325"
  },
  {
    "question": "Implement order validation pipeline with multiple risk checks.",
    "answer": [
      {
        "type": "text",
        "content": "Chain validation steps before order execution."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface IOrderValidator\n{\n    Task<ValidationResult> ValidateAsync(Order order, CancellationToken ct = default);\n}\n\npublic class MarginValidator : IOrderValidator\n{\n    private readonly IAccountRepository _accountRepo;\n    private readonly IMarginCalculator _marginCalc;\n\n    public async Task<ValidationResult> ValidateAsync(Order order, CancellationToken ct)\n    {\n        var account = await _accountRepo.GetByIdAsync(order.AccountId, ct);\n\n        var requiredMargin = _marginCalc.CalculateRequiredMargin(\n            order.Symbol,\n            order.Volume,\n            order.Leverage);\n\n        var availableMargin = account.Equity - account.UsedMargin;\n\n        if (requiredMargin > availableMargin)\n        {\n            return ValidationResult.Failure(\n                \"INSUFFICIENT_MARGIN\",\n                $\"Required: {requiredMargin:F2}, Available: {availableMargin:F2}\");\n        }\n\n        return ValidationResult.Success();\n    }\n}\n\npublic class ExposureLimitValidator : IOrderValidator\n{\n    private readonly IPositionRepository _positionRepo;\n    private readonly IRiskConfigService _riskConfig;\n\n    public async Task<ValidationResult> ValidateAsync(Order order, CancellationToken ct)\n    {\n        var config = await _riskConfig.GetConfigAsync(order.AccountId, ct);\n        var currentPositions = await _positionRepo.GetByAccountAsync(order.AccountId, ct);\n\n        var symbolExposure = currentPositions\n            .Where(p => p.Symbol == order.Symbol)\n            .Sum(p => p.Volume);\n\n        var newExposure = order.Type == OrderType.Buy\n            ? symbolExposure + order.Volume\n            : symbolExposure - order.Volume;\n\n        if (Math.Abs(newExposure) > config.MaxExposurePerSymbol)\n        {\n            return ValidationResult.Failure(\n                \"EXPOSURE_LIMIT_EXCEEDED\",\n                $\"Max exposure: {config.MaxExposurePerSymbol}, New exposure: {Math.Abs(newExposure)}\");\n        }\n\n        return ValidationResult.Success();\n    }\n}\n\npublic class PriceDeviationValidator : IOrderValidator\n{\n    private readonly IMarketDataService _marketData;\n    private const decimal MaxDeviationPercent = 2.0m;\n\n    public async Task<ValidationResult> ValidateAsync(Order order, CancellationToken ct)\n    {\n        if (order.Type != OrderType.Limit && order.Type != OrderType.Stop)\n            return ValidationResult.Success();\n\n        var currentPrice = await _marketData.GetPriceAsync(order.Symbol, ct);\n        var referencePrice = order.Side == OrderSide.Buy ? currentPrice.Ask : currentPrice.Bid;\n\n        var deviation = Math.Abs((order.Price - referencePrice) / referencePrice) * 100;\n\n        if (deviation > MaxDeviationPercent)\n        {\n            return ValidationResult.Failure(\n                \"PRICE_DEVIATION\",\n                $\"Order price {order.Price} deviates {deviation:F2}% from market {referencePrice}\");\n        }\n\n        return ValidationResult.Success();\n    }\n}\n\n// Composite validator pipeline\npublic class OrderValidationPipeline\n{\n    private readonly IEnumerable<IOrderValidator> _validators;\n    private readonly ILogger<OrderValidationPipeline> _logger;\n\n    public OrderValidationPipeline(\n        IEnumerable<IOrderValidator> validators,\n        ILogger<OrderValidationPipeline> logger)\n    {\n        _validators = validators;\n        _logger = logger;\n    }\n\n    public async Task<ValidationResult> ValidateAsync(Order order, CancellationToken ct = default)\n    {\n        foreach (var validator in _validators)\n        {\n            var result = await validator.ValidateAsync(order, ct);\n            if (!result.IsValid)\n            {\n                _logger.LogWarning(\n                    \"Order {OrderId} failed validation: {ValidationError}\",\n                    order.Id,\n                    result.ErrorCode);\n                return result;\n            }\n        }\n\n        return ValidationResult.Success();\n    }\n}\n\n// DI registration\nservices.AddScoped<IOrderValidator, MarginValidator>();\nservices.AddScoped<IOrderValidator, ExposureLimitValidator>();\nservices.AddScoped<IOrderValidator, PriceDeviationValidator>();\nservices.AddScoped<IOrderValidator, DuplicateOrderValidator>();\nservices.AddScoped<OrderValidationPipeline>();",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Trading Domain",
    "topicId": "trading-domain",
    "source": "practice/sub-notes/trading-domain.md",
    "id": "card-326"
  },
  {
    "question": "Design state machine for order lifecycle tracking.",
    "answer": [
      {
        "type": "text",
        "content": "Implement order state transitions with guards."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public enum OrderState\n{\n    Pending,\n    Validated,\n    Submitted,\n    PartiallyFilled,\n    Filled,\n    Cancelled,\n    Rejected,\n    Expired\n}\n\npublic enum OrderEvent\n{\n    Validate,\n    Submit,\n    PartialFill,\n    Fill,\n    Cancel,\n    Reject,\n    Expire\n}\n\npublic class OrderStateMachine\n{\n    private static readonly Dictionary<(OrderState, OrderEvent), OrderState> _transitions = new()\n    {\n        { (OrderState.Pending, OrderEvent.Validate), OrderState.Validated },\n        { (OrderState.Pending, OrderEvent.Reject), OrderState.Rejected },\n\n        { (OrderState.Validated, OrderEvent.Submit), OrderState.Submitted },\n        { (OrderState.Validated, OrderEvent.Cancel), OrderState.Cancelled },\n\n        { (OrderState.Submitted, OrderEvent.PartialFill), OrderState.PartiallyFilled },\n        { (OrderState.Submitted, OrderEvent.Fill), OrderState.Filled },\n        { (OrderState.Submitted, OrderEvent.Cancel), OrderState.Cancelled },\n        { (OrderState.Submitted, OrderEvent.Reject), OrderState.Rejected },\n        { (OrderState.Submitted, OrderEvent.Expire), OrderState.Expired },\n\n        { (OrderState.PartiallyFilled, OrderEvent.PartialFill), OrderState.PartiallyFilled },\n        { (OrderState.PartiallyFilled, OrderEvent.Fill), OrderState.Filled },\n        { (OrderState.PartiallyFilled, OrderEvent.Cancel), OrderState.Cancelled },\n        { (OrderState.PartiallyFilled, OrderEvent.Expire), OrderState.Expired }\n    };\n\n    private readonly Order _order;\n    private readonly IEventPublisher _eventPublisher;\n    private readonly ILogger<OrderStateMachine> _logger;\n\n    public OrderStateMachine(\n        Order order,\n        IEventPublisher eventPublisher,\n        ILogger<OrderStateMachine> logger)\n    {\n        _order = order;\n        _eventPublisher = eventPublisher;\n        _logger = logger;\n    }\n\n    public async Task<bool> TransitionAsync(OrderEvent @event)\n    {\n        var currentState = _order.State;\n\n        if (!_transitions.TryGetValue((currentState, @event), out var newState))\n        {\n            _logger.LogWarning(\n                \"Invalid transition: Order {OrderId} cannot transition from {CurrentState} with event {@Event}\",\n                _order.Id,\n                currentState,\n                @event);\n            return false;\n        }\n\n        _order.State = newState;\n        _order.UpdatedAt = DateTime.UtcNow;\n\n        await _eventPublisher.PublishAsync(new OrderStateChangedEvent\n        {\n            OrderId = _order.Id,\n            PreviousState = currentState,\n            NewState = newState,\n            Event = @event,\n            Timestamp = _order.UpdatedAt\n        });\n\n        _logger.LogInformation(\n            \"Order {OrderId} transitioned from {PreviousState} to {NewState} via {@Event}\",\n            _order.Id,\n            currentState,\n            newState,\n            @event);\n\n        return true;\n    }\n\n    public bool CanTransition(OrderEvent @event)\n    {\n        return _transitions.ContainsKey((_order.State, @event));\n    }\n\n    public IEnumerable<OrderEvent> GetAllowedEvents()\n    {\n        return _transitions\n            .Where(kvp => kvp.Key.Item1 == _order.State)\n            .Select(kvp => kvp.Key.Item2);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Trading Domain",
    "topicId": "trading-domain",
    "source": "practice/sub-notes/trading-domain.md",
    "id": "card-327"
  },
  {
    "question": "Implement order reconciliation to detect missing confirmations.",
    "answer": [
      {
        "type": "text",
        "content": "Compare internal orders with broker confirmations."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class OrderReconciliationService : BackgroundService\n{\n    private readonly IServiceProvider _serviceProvider;\n    private readonly ILogger<OrderReconciliationService> _logger;\n    private readonly TimeSpan _reconciliationInterval = TimeSpan.FromMinutes(5);\n    private readonly TimeSpan _confirmationTimeout = TimeSpan.FromMinutes(2);\n\n    protected override async Task ExecuteAsync(CancellationToken stoppingToken)\n    {\n        while (!stoppingToken.IsCancellationRequested)\n        {\n            try\n            {\n                await ReconcileOrdersAsync(stoppingToken);\n            }\n            catch (Exception ex)\n            {\n                _logger.LogError(ex, \"Order reconciliation failed\");\n            }\n\n            await Task.Delay(_reconciliationInterval, stoppingToken);\n        }\n    }\n\n    private async Task ReconcileOrdersAsync(CancellationToken ct)\n    {\n        using var scope = _serviceProvider.CreateScope();\n        var orderRepo = scope.ServiceProvider.GetRequiredService<IOrderRepository>();\n        var mt5Gateway = scope.ServiceProvider.GetRequiredService<IMt5Gateway>();\n\n        // Find orders awaiting confirmation\n        var pendingOrders = await orderRepo.GetPendingConfirmationsAsync(\n            olderThan: DateTime.UtcNow - _confirmationTimeout,\n            ct);\n\n        _logger.LogInformation(\"Reconciling {Count} pending orders\", pendingOrders.Count);\n\n        foreach (var order in pendingOrders)\n        {\n            try\n            {\n                // Query broker for order status\n                var brokerOrder = await mt5Gateway.GetOrderByClientIdAsync(order.ClientOrderId, ct);\n\n                if (brokerOrder != null)\n                {\n                    // Order found at broker - update status\n                    await SyncOrderStatusAsync(order, brokerOrder, orderRepo, ct);\n                }\n                else\n                {\n                    // Order not found - may have been rejected or lost\n                    await HandleMissingOrderAsync(order, orderRepo, ct);\n                }\n            }\n            catch (Exception ex)\n            {\n                _logger.LogError(\n                    ex,\n                    \"Failed to reconcile order {OrderId}\",\n                    order.Id);\n            }\n        }\n    }\n\n    private async Task SyncOrderStatusAsync(\n        Order internalOrder,\n        BrokerOrder brokerOrder,\n        IOrderRepository orderRepo,\n        CancellationToken ct)\n    {\n        if (internalOrder.State != MapBrokerState(brokerOrder.State))\n        {\n            _logger.LogWarning(\n                \"Order {OrderId} state mismatch. Internal: {InternalState}, Broker: {BrokerState}\",\n                internalOrder.Id,\n                internalOrder.State,\n                brokerOrder.State);\n\n            internalOrder.State = MapBrokerState(brokerOrder.State);\n            internalOrder.BrokerOrderId = brokerOrder.OrderId;\n            internalOrder.FilledVolume = brokerOrder.FilledVolume;\n            internalOrder.AveragePrice = brokerOrder.AveragePrice;\n\n            await orderRepo.UpdateAsync(internalOrder, ct);\n        }\n    }\n\n    private async Task HandleMissingOrderAsync(\n        Order order,\n        IOrderRepository orderRepo,\n        CancellationToken ct)\n    {\n        _logger.LogError(\n            \"Order {OrderId} not found at broker after {Minutes} minutes\",\n            order.Id,\n            _confirmationTimeout.TotalMinutes);\n\n        // Mark as potentially lost\n        order.State = OrderState.Rejected;\n        order.RejectReason = \"Order not confirmed by broker - may be lost\";\n        await orderRepo.UpdateAsync(order, ct);\n\n        // Trigger alert for manual investigation\n        // await _alertService.SendAlertAsync(...)\n    }\n\n    private OrderState MapBrokerState(string brokerState)\n    {\n        return brokerState switch\n        {\n            \"PENDING\" => OrderState.Submitted,\n            \"PARTIAL\" => OrderState.PartiallyFilled,\n            \"FILLED\" => OrderState.Filled,\n            \"CANCELLED\" => OrderState.Cancelled,\n            \"REJECTED\" => OrderState.Rejected,\n            _ => OrderState.Pending\n        };\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Trading Domain",
    "topicId": "trading-domain",
    "source": "practice/sub-notes/trading-domain.md",
    "id": "card-328"
  },
  {
    "question": "Implement MT5 Gateway with connection pooling and failover.",
    "answer": [
      {
        "type": "text",
        "content": "Manage multiple MT5 connections for reliability."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public interface IMt5Gateway\n{\n    Task<string> SendOrderAsync(OrderRequest request, CancellationToken ct = default);\n    Task<BrokerOrder> GetOrderByClientIdAsync(string clientOrderId, CancellationToken ct = default);\n    Task<bool> CancelOrderAsync(string orderId, CancellationToken ct = default);\n}\n\npublic class Mt5ConnectionPool\n{\n    private readonly List<Mt5Connection> _connections = new();\n    private readonly SemaphoreSlim _lock = new(1, 1);\n    private readonly IConfiguration _configuration;\n    private readonly ILogger<Mt5ConnectionPool> _logger;\n    private int _currentIndex = 0;\n\n    public Mt5ConnectionPool(IConfiguration configuration, ILogger<Mt5ConnectionPool> logger)\n    {\n        _configuration = configuration;\n        _logger = logger;\n    }\n\n    public async Task InitializeAsync()\n    {\n        var servers = _configuration.GetSection(\"Mt5:Servers\").Get<List<Mt5ServerConfig>>();\n\n        foreach (var server in servers)\n        {\n            try\n            {\n                var connection = new Mt5Connection(server);\n                await connection.ConnectAsync();\n                _connections.Add(connection);\n\n                _logger.LogInformation(\n                    \"Connected to MT5 server: {Server}:{Port}\",\n                    server.Host,\n                    server.Port);\n            }\n            catch (Exception ex)\n            {\n                _logger.LogError(\n                    ex,\n                    \"Failed to connect to MT5 server: {Server}:{Port}\",\n                    server.Host,\n                    server.Port);\n            }\n        }\n\n        if (_connections.Count == 0)\n        {\n            throw new InvalidOperationException(\"No MT5 connections available\");\n        }\n    }\n\n    public async Task<Mt5Connection> GetConnectionAsync()\n    {\n        await _lock.WaitAsync();\n        try\n        {\n            // Round-robin with health check\n            for (int i = 0; i < _connections.Count; i++)\n            {\n                var index = (_currentIndex + i) % _connections.Count;\n                var connection = _connections[index];\n\n                if (await connection.IsHealthyAsync())\n                {\n                    _currentIndex = (index + 1) % _connections.Count;\n                    return connection;\n                }\n            }\n\n            throw new InvalidOperationException(\"No healthy MT5 connections available\");\n        }\n        finally\n        {\n            _lock.Release();\n        }\n    }\n\n    public async Task<T> ExecuteWithRetryAsync<T>(\n        Func<Mt5Connection, Task<T>> operation,\n        int maxRetries = 3)\n    {\n        Exception lastException = null;\n\n        for (int attempt = 0; attempt < maxRetries; attempt++)\n        {\n            try\n            {\n                var connection = await GetConnectionAsync();\n                return await operation(connection);\n            }\n            catch (Mt5ConnectionException ex)\n            {\n                lastException = ex;\n                _logger.LogWarning(\n                    ex,\n                    \"MT5 operation failed (attempt {Attempt}/{MaxRetries})\",\n                    attempt + 1,\n                    maxRetries);\n\n                if (attempt < maxRetries - 1)\n                {\n                    await Task.Delay(TimeSpan.FromMilliseconds(100 * Math.Pow(2, attempt)));\n                }\n            }\n        }\n\n        throw new Mt5GatewayException(\n            $\"MT5 operation failed after {maxRetries} attempts\",\n            lastException);\n    }\n}\n\npublic class Mt5Gateway : IMt5Gateway\n{\n    private readonly Mt5ConnectionPool _connectionPool;\n    private readonly ILogger<Mt5Gateway> _logger;\n\n    public Mt5Gateway(Mt5ConnectionPool connectionPool, ILogger<Mt5Gateway> logger)\n    {\n        _connectionPool = connectionPool;\n        _logger = logger;\n    }\n\n    public async Task<string> SendOrderAsync(OrderRequest request, CancellationToken ct = default)\n    {\n        return await _connectionPool.ExecuteWithRetryAsync(async connection =>\n        {\n            var mt5Order = new Mt5OrderRequest\n            {\n                Symbol = request.Symbol,\n                Volume = request.Volume,\n                Type = MapOrderType(request.Type),\n                Price = request.Price,\n                StopLoss = request.StopLoss,\n                TakeProfit = request.TakeProfit,\n                Comment = request.ClientOrderId,\n                Magic = CalculateMagicNumber(request.AccountId)\n            };\n\n            var result = await connection.SendOrderAsync(mt5Order, ct);\n\n            if (result.ReturnCode != Mt5ReturnCode.Success)\n            {\n                throw new Mt5OrderException(\n                    $\"Order rejected: {result.ReturnCode} - {result.Comment}\");\n            }\n\n            _logger.LogInformation(\n                \"Order sent to MT5. ClientOrderId: {ClientOrderId}, Ticket: {Ticket}\",\n                request.ClientOrderId,\n                result.OrderTicket);\n\n            return result.OrderTicket.ToString();\n        });\n    }\n\n    public async Task<BrokerOrder> GetOrderByClientIdAsync(\n        string clientOrderId,\n        CancellationToken ct = default)\n    {\n        return await _connectionPool.ExecuteWithRetryAsync(async connection =>\n        {\n            // Query orders by comment (where we store client order ID)\n            var orders = await connection.GetOrdersAsync(comment: clientOrderId, ct);\n            return orders.FirstOrDefault();\n        });\n    }\n\n    public async Task<bool> CancelOrderAsync(string orderId, CancellationToken ct = default)\n    {\n        return await _connectionPool.ExecuteWithRetryAsync(async connection =>\n        {\n            var result = await connection.CancelOrderAsync(long.Parse(orderId), ct);\n            return result.ReturnCode == Mt5ReturnCode.Success;\n        });\n    }\n\n    private Mt5OrderType MapOrderType(OrderType type)\n    {\n        return type switch\n        {\n            OrderType.Market => Mt5OrderType.Market,\n            OrderType.Limit => Mt5OrderType.Limit,\n            OrderType.Stop => Mt5OrderType.Stop,\n            OrderType.StopLimit => Mt5OrderType.StopLimit,\n            _ => throw new ArgumentException($\"Unsupported order type: {type}\")\n        };\n    }\n\n    private int CalculateMagicNumber(Guid accountId)\n    {\n        // Generate deterministic magic number from account ID\n        return Math.Abs(accountId.GetHashCode() % 999999);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Trading Domain",
    "topicId": "trading-domain",
    "source": "practice/sub-notes/trading-domain.md",
    "id": "card-329"
  },
  {
    "question": "Handle MT5 error codes and map to domain exceptions.",
    "answer": [
      {
        "type": "text",
        "content": "Translate MT5-specific errors to business errors."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public enum Mt5ReturnCode\n{\n    Success = 10009,\n    InvalidPrice = 10015,\n    InvalidStops = 10016,\n    InvalidVolume = 10014,\n    MarketClosed = 10018,\n    NoMoney = 10019,\n    PriceChanged = 10020,\n    Requote = 10004,\n    Timeout = 10024,\n    TooManyRequests = 10025,\n    TradeDisabled = 10017,\n    ConnectionError = 10030\n}\n\npublic class Mt5ErrorMapper\n{\n    private static readonly Dictionary<Mt5ReturnCode, (string Code, string Message)> _errorMap = new()\n    {\n        { Mt5ReturnCode.InvalidPrice, (\"INVALID_PRICE\", \"Order price is invalid or too far from market\") },\n        { Mt5ReturnCode.InvalidStops, (\"INVALID_STOPS\", \"Stop loss or take profit is invalid\") },\n        { Mt5ReturnCode.InvalidVolume, (\"INVALID_VOLUME\", \"Order volume is invalid\") },\n        { Mt5ReturnCode.MarketClosed, (\"MARKET_CLOSED\", \"Market is closed\") },\n        { Mt5ReturnCode.NoMoney, (\"INSUFFICIENT_MARGIN\", \"Insufficient margin to open position\") },\n        { Mt5ReturnCode.PriceChanged, (\"PRICE_CHANGED\", \"Price changed, retry with updated price\") },\n        { Mt5ReturnCode.Requote, (\"REQUOTE\", \"Broker requote received\") },\n        { Mt5ReturnCode.Timeout, (\"TIMEOUT\", \"Order execution timeout\") },\n        { Mt5ReturnCode.TooManyRequests, (\"RATE_LIMITED\", \"Too many requests to broker\") },\n        { Mt5ReturnCode.TradeDisabled, (\"TRADE_DISABLED\", \"Trading is disabled for this symbol\") },\n        { Mt5ReturnCode.ConnectionError, (\"CONNECTION_ERROR\", \"Connection to broker lost\") }\n    };\n\n    public static OrderException MapToException(Mt5ReturnCode returnCode, string additionalInfo = null)\n    {\n        if (_errorMap.TryGetValue(returnCode, out var error))\n        {\n            var message = additionalInfo != null\n                ? $\"{error.Message}. {additionalInfo}\"\n                : error.Message;\n\n            return new OrderException(error.Code, message)\n            {\n                IsRetryable = IsRetryable(returnCode),\n                RequiresClientAction = RequiresClientAction(returnCode)\n            };\n        }\n\n        return new OrderException(\n            \"BROKER_ERROR\",\n            $\"Unknown broker error: {returnCode}\")\n        {\n            IsRetryable = false\n        };\n    }\n\n    private static bool IsRetryable(Mt5ReturnCode returnCode)\n    {\n        return returnCode switch\n        {\n            Mt5ReturnCode.PriceChanged => true,\n            Mt5ReturnCode.Requote => true,\n            Mt5ReturnCode.Timeout => true,\n            Mt5ReturnCode.ConnectionError => true,\n            _ => false\n        };\n    }\n\n    private static bool RequiresClientAction(Mt5ReturnCode returnCode)\n    {\n        return returnCode switch\n        {\n            Mt5ReturnCode.NoMoney => true,\n            Mt5ReturnCode.InvalidPrice => true,\n            Mt5ReturnCode.InvalidStops => true,\n            Mt5ReturnCode.InvalidVolume => true,\n            Mt5ReturnCode.TradeDisabled => true,\n            _ => false\n        };\n    }\n}\n\npublic class OrderException : Exception\n{\n    public string ErrorCode { get; }\n    public bool IsRetryable { get; init; }\n    public bool RequiresClientAction { get; init; }\n\n    public OrderException(string errorCode, string message) : base(message)\n    {\n        ErrorCode = errorCode;\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Trading Domain",
    "topicId": "trading-domain",
    "source": "practice/sub-notes/trading-domain.md",
    "id": "card-330"
  },
  {
    "question": "Implement high-frequency tick data processor with conflation.",
    "answer": [
      {
        "type": "text",
        "content": "Process and aggregate tick updates efficiently."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class TickDataProcessor\n{\n    private readonly Channel<Tick> _inboundChannel;\n    private readonly IDistributedCache _cache;\n    private readonly IHubContext<PriceHub> _hubContext;\n    private readonly ILogger<TickDataProcessor> _logger;\n\n    private readonly Dictionary<string, TickAggregator> _aggregators = new();\n    private readonly TimeSpan _conflationWindow = TimeSpan.FromMilliseconds(100);\n\n    public TickDataProcessor(\n        IDistributedCache cache,\n        IHubContext<PriceHub> hubContext,\n        ILogger<TickDataProcessor> logger)\n    {\n        _inboundChannel = Channel.CreateBounded<Tick>(new BoundedChannelOptions(10000)\n        {\n            FullMode = BoundedChannelFullMode.DropOldest\n        });\n        _cache = cache;\n        _hubContext = hubContext;\n        _logger = logger;\n    }\n\n    public async Task ProcessTickAsync(Tick tick)\n    {\n        await _inboundChannel.Writer.WriteAsync(tick);\n    }\n\n    public async Task StartProcessingAsync(CancellationToken ct)\n    {\n        var processingTasks = Enumerable.Range(0, Environment.ProcessorCount)\n            .Select(i => ProcessTicksAsync(ct))\n            .ToArray();\n\n        // Periodic flush for low-frequency symbols\n        var flushTask = PeriodicFlushAsync(ct);\n\n        await Task.WhenAll(processingTasks.Concat(new[] { flushTask }));\n    }\n\n    private async Task ProcessTicksAsync(CancellationToken ct)\n    {\n        await foreach (var tick in _inboundChannel.Reader.ReadAllAsync(ct))\n        {\n            try\n            {\n                if (!_aggregators.TryGetValue(tick.Symbol, out var aggregator))\n                {\n                    aggregator = new TickAggregator(tick.Symbol, _conflationWindow);\n                    _aggregators[tick.Symbol] = aggregator;\n                }\n\n                var conflatedTick = aggregator.AddTick(tick);\n\n                if (conflatedTick != null)\n                {\n                    await PublishTickAsync(conflatedTick, ct);\n                }\n            }\n            catch (Exception ex)\n            {\n                _logger.LogError(ex, \"Error processing tick for {Symbol}\", tick.Symbol);\n            }\n        }\n    }\n\n    private async Task PeriodicFlushAsync(CancellationToken ct)\n    {\n        using var timer = new PeriodicTimer(_conflationWindow);\n\n        while (await timer.WaitForNextTickAsync(ct))\n        {\n            foreach (var aggregator in _aggregators.Values)\n            {\n                var tick = aggregator.Flush();\n                if (tick != null)\n                {\n                    await PublishTickAsync(tick, ct);\n                }\n            }\n        }\n    }\n\n    private async Task PublishTickAsync(Tick tick, CancellationToken ct)\n    {\n        // Update cache\n        var cacheKey = $\"price:{tick.Symbol}\";\n        await _cache.SetStringAsync(\n            cacheKey,\n            JsonSerializer.Serialize(tick),\n            new DistributedCacheEntryOptions\n            {\n                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)\n            },\n            ct);\n\n        // Broadcast to WebSocket clients\n        await _hubContext.Clients.Group(tick.Symbol)\n            .SendAsync(\"price\", tick, ct);\n\n        _logger.LogDebug(\n            \"Published tick: {Symbol} Bid={Bid} Ask={Ask}\",\n            tick.Symbol,\n            tick.Bid,\n            tick.Ask);\n    }\n}\n\npublic class TickAggregator\n{\n    private readonly string _symbol;\n    private readonly TimeSpan _window;\n    private Tick _pendingTick;\n    private DateTime _windowStart;\n\n    public TickAggregator(string symbol, TimeSpan window)\n    {\n        _symbol = symbol;\n        _window = window;\n        _windowStart = DateTime.UtcNow;\n    }\n\n    public Tick AddTick(Tick tick)\n    {\n        var now = DateTime.UtcNow;\n\n        if (_pendingTick == null)\n        {\n            _pendingTick = tick;\n            _windowStart = now;\n            return null;\n        }\n\n        // Aggregate tick data\n        _pendingTick = new Tick\n        {\n            Symbol = _symbol,\n            Bid = tick.Bid,  // Latest bid\n            Ask = tick.Ask,  // Latest ask\n            BidVolume = _pendingTick.BidVolume + tick.BidVolume,  // Sum volumes\n            AskVolume = _pendingTick.AskVolume + tick.AskVolume,\n            Timestamp = tick.Timestamp\n        };\n\n        // Check if window elapsed\n        if (now - _windowStart >= _window)\n        {\n            var result = _pendingTick;\n            _pendingTick = null;\n            return result;\n        }\n\n        return null;\n    }\n\n    public Tick Flush()\n    {\n        var result = _pendingTick;\n        _pendingTick = null;\n        return result;\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Trading Domain",
    "topicId": "trading-domain",
    "source": "practice/sub-notes/trading-domain.md",
    "id": "card-331"
  },
  {
    "question": "Implement VWAP (Volume-Weighted Average Price) calculator.",
    "answer": [
      {
        "type": "text",
        "content": "Calculate real-time VWAP from tick stream."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class VwapCalculator\n{\n    private readonly Dictionary<string, VwapData> _vwapBySymbol = new();\n    private readonly TimeSpan _window;\n\n    public VwapCalculator(TimeSpan window)\n    {\n        _window = window;\n    }\n\n    public decimal CalculateVwap(string symbol, decimal price, decimal volume, DateTime timestamp)\n    {\n        if (!_vwapBySymbol.TryGetValue(symbol, out var data))\n        {\n            data = new VwapData();\n            _vwapBySymbol[symbol] = data;\n        }\n\n        // Add new trade\n        data.Trades.Add(new Trade\n        {\n            Price = price,\n            Volume = volume,\n            Timestamp = timestamp\n        });\n\n        // Remove trades outside window\n        var cutoff = timestamp - _window;\n        data.Trades.RemoveAll(t => t.Timestamp < cutoff);\n\n        // Calculate VWAP\n        if (data.Trades.Count == 0)\n            return 0;\n\n        var totalValue = data.Trades.Sum(t => t.Price * t.Volume);\n        var totalVolume = data.Trades.Sum(t => t.Volume);\n\n        return totalVolume > 0 ? totalValue / totalVolume : 0;\n    }\n\n    private class VwapData\n    {\n        public List<Trade> Trades { get; } = new();\n    }\n\n    private class Trade\n    {\n        public decimal Price { get; set; }\n        public decimal Volume { get; set; }\n        public DateTime Timestamp { get; set; }\n    }\n}\n\n// Usage in tick processor\npublic class EnhancedTickProcessor\n{\n    private readonly VwapCalculator _vwapCalculator;\n\n    public async Task ProcessTradeAsync(Trade trade)\n    {\n        var vwap = _vwapCalculator.CalculateVwap(\n            trade.Symbol,\n            trade.Price,\n            trade.Volume,\n            trade.Timestamp);\n\n        await PublishMarketDataAsync(new MarketData\n        {\n            Symbol = trade.Symbol,\n            LastPrice = trade.Price,\n            Vwap = vwap,\n            Timestamp = trade.Timestamp\n        });\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Trading Domain",
    "topicId": "trading-domain",
    "source": "practice/sub-notes/trading-domain.md",
    "id": "card-332"
  },
  {
    "question": "Implement real-time P&L calculator for open positions.",
    "answer": [
      {
        "type": "text",
        "content": "Calculate unrealized profit/loss continuously."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class PnLCalculator\n{\n    private readonly IMarketDataService _marketData;\n    private readonly ILogger<PnLCalculator> _logger;\n\n    public async Task<PositionPnL> CalculatePnLAsync(Position position, CancellationToken ct = default)\n    {\n        var currentPrice = await _marketData.GetPriceAsync(position.Symbol, ct);\n\n        var closePrice = position.Type == PositionType.Long\n            ? currentPrice.Bid  // Close long at bid\n            : currentPrice.Ask;  // Close short at ask\n\n        // Calculate P&L in position currency\n        decimal pnl;\n        if (position.Type == PositionType.Long)\n        {\n            pnl = (closePrice - position.OpenPrice) * position.Volume;\n        }\n        else\n        {\n            pnl = (position.OpenPrice - closePrice) * position.Volume;\n        }\n\n        // Apply contract size\n        pnl *= position.ContractSize;\n\n        // Convert to account currency if needed\n        if (position.Currency != position.AccountCurrency)\n        {\n            var conversionRate = await GetConversionRateAsync(\n                position.Currency,\n                position.AccountCurrency,\n                ct);\n            pnl *= conversionRate;\n        }\n\n        // Calculate swap (overnight financing)\n        var swap = CalculateSwap(position);\n\n        // Calculate commission\n        var commission = CalculateCommission(position);\n\n        var netPnl = pnl + swap - commission;\n\n        return new PositionPnL\n        {\n            PositionId = position.Id,\n            GrossPnL = pnl,\n            Swap = swap,\n            Commission = commission,\n            NetPnL = netPnl,\n            PnLPercentage = (netPnl / (position.OpenPrice * position.Volume * position.ContractSize)) * 100,\n            CurrentPrice = closePrice,\n            Timestamp = DateTime.UtcNow\n        };\n    }\n\n    public async Task<AccountPnL> CalculateAccountPnLAsync(\n        Guid accountId,\n        CancellationToken ct = default)\n    {\n        var positions = await GetOpenPositionsAsync(accountId, ct);\n\n        var pnlTasks = positions.Select(p => CalculatePnLAsync(p, ct));\n        var pnls = await Task.WhenAll(pnlTasks);\n\n        return new AccountPnL\n        {\n            AccountId = accountId,\n            TotalGrossPnL = pnls.Sum(p => p.GrossPnL),\n            TotalSwap = pnls.Sum(p => p.Swap),\n            TotalCommission = pnls.Sum(p => p.Commission),\n            TotalNetPnL = pnls.Sum(p => p.NetPnL),\n            PositionCount = positions.Count,\n            Positions = pnls.ToList(),\n            Timestamp = DateTime.UtcNow\n        };\n    }\n\n    private decimal CalculateSwap(Position position)\n    {\n        var days = (DateTime.UtcNow - position.OpenTime).Days;\n        if (days == 0) return 0;\n\n        // Simplified swap calculation\n        var swapRate = position.Type == PositionType.Long\n            ? position.SwapLong\n            : position.SwapShort;\n\n        return swapRate * position.Volume * days;\n    }\n\n    private decimal CalculateCommission(Position position)\n    {\n        // Commission charged on open\n        return position.Commission;\n    }\n\n    private async Task<decimal> GetConversionRateAsync(\n        string fromCurrency,\n        string toCurrency,\n        CancellationToken ct)\n    {\n        if (fromCurrency == toCurrency)\n            return 1;\n\n        var symbol = $\"{fromCurrency}{toCurrency}\";\n        var price = await _marketData.GetPriceAsync(symbol, ct);\n\n        return (price.Bid + price.Ask) / 2;\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Trading Domain",
    "topicId": "trading-domain",
    "source": "practice/sub-notes/trading-domain.md",
    "id": "card-333"
  },
  {
    "question": "Implement margin calculator with different leverage levels.",
    "answer": [
      {
        "type": "text",
        "content": "Calculate required margin for positions."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class MarginCalculator\n{\n    private readonly ISymbolConfigService _symbolConfig;\n\n    public async Task<decimal> CalculateRequiredMarginAsync(\n        string symbol,\n        decimal volume,\n        int leverage,\n        CancellationToken ct = default)\n    {\n        var config = await _symbolConfig.GetConfigAsync(symbol, ct);\n\n        // Get current market price\n        var price = await GetMarketPriceAsync(symbol, ct);\n\n        // Calculate position value\n        var positionValue = volume * config.ContractSize * price;\n\n        // Apply leverage\n        var requiredMargin = positionValue / leverage;\n\n        // Apply margin requirements (can vary by symbol, time, volatility)\n        var marginMultiplier = await GetMarginMultiplierAsync(symbol, ct);\n        requiredMargin *= marginMultiplier;\n\n        return requiredMargin;\n    }\n\n    public async Task<MarginStatus> CalculateMarginStatusAsync(\n        Account account,\n        List<Position> positions,\n        CancellationToken ct = default)\n    {\n        // Calculate used margin\n        var usedMarginTasks = positions.Select(async p =>\n            await CalculateRequiredMarginAsync(p.Symbol, p.Volume, p.Leverage, ct));\n\n        var usedMargins = await Task.WhenAll(usedMarginTasks);\n        var totalUsedMargin = usedMargins.Sum();\n\n        // Calculate unrealized P&L\n        var pnlCalculator = new PnLCalculator(_marketDataService, _logger);\n        var accountPnl = await pnlCalculator.CalculateAccountPnLAsync(account.Id, ct);\n\n        // Calculate equity and free margin\n        var equity = account.Balance + accountPnl.TotalNetPnL;\n        var freeMargin = equity - totalUsedMargin;\n        var marginLevel = totalUsedMargin > 0 ? (equity / totalUsedMargin) * 100 : 0;\n\n        return new MarginStatus\n        {\n            Balance = account.Balance,\n            Equity = equity,\n            UsedMargin = totalUsedMargin,\n            FreeMargin = freeMargin,\n            MarginLevel = marginLevel,\n            UnrealizedPnL = accountPnl.TotalNetPnL,\n            IsMarginCall = marginLevel > 0 && marginLevel <= account.MarginCallLevel,\n            IsStopOut = marginLevel > 0 && marginLevel <= account.StopOutLevel\n        };\n    }\n\n    private async Task<decimal> GetMarginMultiplierAsync(string symbol, CancellationToken ct)\n    {\n        // Margin requirements can increase during:\n        // - High volatility periods\n        // - Weekend/overnight\n        // - Major news events\n        // - Low liquidity\n\n        var config = await _symbolConfig.GetConfigAsync(symbol, ct);\n\n        decimal multiplier = 1.0m;\n\n        // Weekend margin (typically higher)\n        if (IsWeekend())\n        {\n            multiplier *= config.WeekendMarginMultiplier;\n        }\n\n        // Overnight margin\n        if (IsOvernight())\n        {\n            multiplier *= config.OvernightMarginMultiplier;\n        }\n\n        // Volatility adjustment\n        var volatility = await GetCurrentVolatilityAsync(symbol, ct);\n        if (volatility > config.HighVolatilityThreshold)\n        {\n            multiplier *= config.HighVolatilityMarginMultiplier;\n        }\n\n        return multiplier;\n    }\n\n    private bool IsWeekend()\n    {\n        var now = DateTime.UtcNow;\n        return now.DayOfWeek == DayOfWeek.Saturday || now.DayOfWeek == DayOfWeek.Sunday;\n    }\n\n    private bool IsOvernight()\n    {\n        var now = DateTime.UtcNow.TimeOfDay;\n        return now < TimeSpan.FromHours(8) || now > TimeSpan.FromHours(22);\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Trading Domain",
    "topicId": "trading-domain",
    "source": "practice/sub-notes/trading-domain.md",
    "id": "card-334"
  },
  {
    "question": "Implement automatic stop-out mechanism.",
    "answer": [
      {
        "type": "text",
        "content": "Close positions when margin level falls below threshold."
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "public class StopOutService : BackgroundService\n{\n    private readonly IServiceProvider _serviceProvider;\n    private readonly ILogger<StopOutService> _logger;\n    private readonly TimeSpan _checkInterval = TimeSpan.FromSeconds(5);\n\n    protected override async Task ExecuteAsync(CancellationToken stoppingToken)\n    {\n        while (!stoppingToken.IsCancellationRequested)\n        {\n            try\n            {\n                await CheckStopOutLevelsAsync(stoppingToken);\n            }\n            catch (Exception ex)\n            {\n                _logger.LogError(ex, \"Error checking stop-out levels\");\n            }\n\n            await Task.Delay(_checkInterval, stoppingToken);\n        }\n    }\n\n    private async Task CheckStopOutLevelsAsync(CancellationToken ct)\n    {\n        using var scope = _serviceProvider.CreateScope();\n        var accountRepo = scope.ServiceProvider.GetRequiredService<IAccountRepository>();\n        var positionRepo = scope.ServiceProvider.GetRequiredService<IPositionRepository>();\n        var marginCalc = scope.ServiceProvider.GetRequiredService<MarginCalculator>();\n        var tradingService = scope.ServiceProvider.GetRequiredService<ITradingService>();\n\n        // Get accounts with open positions\n        var accounts = await accountRepo.GetAccountsWithPositionsAsync(ct);\n\n        foreach (var account in accounts)\n        {\n            var positions = await positionRepo.GetOpenPositionsAsync(account.Id, ct);\n\n            if (positions.Count == 0)\n                continue;\n\n            var marginStatus = await marginCalc.CalculateMarginStatusAsync(\n                account,\n                positions,\n                ct);\n\n            if (marginStatus.IsStopOut)\n            {\n                _logger.LogWarning(\n                    \"Stop-out triggered for account {AccountId}. Margin level: {MarginLevel}%\",\n                    account.Id,\n                    marginStatus.MarginLevel);\n\n                await ExecuteStopOutAsync(account, positions, marginStatus, tradingService, ct);\n            }\n            else if (marginStatus.IsMarginCall)\n            {\n                _logger.LogWarning(\n                    \"Margin call for account {AccountId}. Margin level: {MarginLevel}%\",\n                    account.Id,\n                    marginStatus.MarginLevel);\n\n                await SendMarginCallNotificationAsync(account, marginStatus, ct);\n            }\n        }\n    }\n\n    private async Task ExecuteStopOutAsync(\n        Account account,\n        List<Position> positions,\n        MarginStatus marginStatus,\n        ITradingService tradingService,\n        CancellationToken ct)\n    {\n        // Close positions starting with largest losing position\n        var positionsByLoss = positions\n            .OrderBy(p => p.UnrealizedPnL)\n            .ToList();\n\n        foreach (var position in positionsByLoss)\n        {\n            try\n            {\n                await tradingService.ClosePositionAsync(\n                    position.Id,\n                    reason: \"Stop-out\",\n                    ct);\n\n                _logger.LogInformation(\n                    \"Closed position {PositionId} due to stop-out. P&L: {PnL}\",\n                    position.Id,\n                    position.UnrealizedPnL);\n\n                // Recalculate margin status\n                var remainingPositions = positions.Where(p => p.Id != position.Id).ToList();\n                if (remainingPositions.Count == 0)\n                    break;\n\n                marginStatus = await _marginCalc.CalculateMarginStatusAsync(\n                    account,\n                    remainingPositions,\n                    ct);\n\n                // Stop if margin level recovered\n                if (!marginStatus.IsStopOut)\n                    break;\n            }\n            catch (Exception ex)\n            {\n                _logger.LogError(\n                    ex,\n                    \"Failed to close position {PositionId} during stop-out\",\n                    position.Id);\n            }\n        }\n    }\n}",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "Trading Domain",
    "topicId": "trading-domain",
    "source": "practice/sub-notes/trading-domain.md",
    "id": "card-335"
  },
  {
    "question": "Explain slippage and how you would measure it.",
    "answer": [
      {
        "type": "text",
        "content": "Slippage is the difference between expected and executed price. Measure average slippage per symbol and market condition, and alert when it exceeds thresholds."
      }
    ],
    "category": "practice",
    "topic": "Trading Domain",
    "topicId": "trading-domain",
    "source": "practice/sub-notes/trading-domain.md",
    "id": "card-336"
  },
  {
    "question": "How do you handle market data bursts without dropping critical updates?",
    "answer": [
      {
        "type": "text",
        "content": "Use conflation (latest per symbol), prioritize high-value symbols, and stream snapshots plus deltas."
      }
    ],
    "category": "practice",
    "topic": "Trading Domain",
    "topicId": "trading-domain",
    "source": "practice/sub-notes/trading-domain.md",
    "id": "card-337"
  },
  {
    "question": "Design an order book snapshot + delta model.",
    "answer": [
      {
        "type": "text",
        "content": "Publish a full snapshot periodically and send incremental updates in between, keyed by sequence numbers for replay and gap detection."
      }
    ],
    "category": "practice",
    "topic": "Trading Domain",
    "topicId": "trading-domain",
    "source": "practice/sub-notes/trading-domain.md",
    "id": "card-338"
  },
  {
    "question": "Implement a real-time PnL calculation at the account level.",
    "answer": [
      {
        "type": "text",
        "content": "Aggregate position PnL plus realized PnL; update on price ticks and trade fills."
      }
    ],
    "category": "practice",
    "topic": "Trading Domain",
    "topicId": "trading-domain",
    "source": "practice/sub-notes/trading-domain.md",
    "id": "card-339"
  },
  {
    "question": "Describe a reconciliation workflow for executed trades.",
    "answer": [
      {
        "type": "text",
        "content": "Compare internal fills to broker confirmations, identify mismatches, and run compensating adjustments with audit logs."
      },
      {
        "type": "text",
        "content": "Total Exercises: 30+"
      },
      {
        "type": "text",
        "content": "Master trading domain concepts for building robust, compliant trading platforms!"
      }
    ],
    "category": "practice",
    "topic": "Trading Domain",
    "topicId": "trading-domain",
    "source": "practice/sub-notes/trading-domain.md",
    "id": "card-340"
  },
  {
    "question": "Explain the difference between a modular monolith and microservices.",
    "answer": [
      {
        "type": "text",
        "content": "A modular monolith is a single deployable with strong internal boundaries, while microservices are independently deployed services with separate data ownership. The monolith is simpler operationally; microservices scale and deploy independently but introduce distributed complexity."
      }
    ],
    "category": "practice",
    "topic": "System Architecture Exercises",
    "topicId": "system-architecture-exercises",
    "source": "practice/system-architecture-exercises.md",
    "id": "card-341"
  },
  {
    "question": "You are a 6-person team building a trading platform MVP. Which architecture should you start with and why?",
    "answer": [
      {
        "type": "text",
        "content": "Start with a modular monolith. It enables fast delivery, strong consistency, and simpler operations. Design module boundaries so you can split services later if needed."
      }
    ],
    "category": "practice",
    "topic": "System Architecture Exercises",
    "topicId": "system-architecture-exercises",
    "source": "practice/system-architecture-exercises.md",
    "id": "card-342"
  },
  {
    "question": "You need to process millions of price ticks per second and fan out to multiple consumers. Which system style fits best?",
    "answer": [
      {
        "type": "text",
        "content": "Event-driven architecture. Use a broker (Kafka/RabbitMQ) to publish ticks and let consumers scale independently."
      }
    ],
    "category": "practice",
    "topic": "System Architecture Exercises",
    "topicId": "system-architecture-exercises",
    "source": "practice/system-architecture-exercises.md",
    "id": "card-343"
  },
  {
    "question": "Sketch a high-level system architecture for an order execution system using microservices.",
    "answer": [
      {
        "type": "text",
        "content": "A:"
      },
      {
        "type": "code",
        "language": "csharp",
        "code": "[API Gateway]\n   |       |        |\n[Orders] [Risk]  [Pricing]\n   |        |       |\n [DB]    [DB]    [Cache]\n   |\n [Broker] -> [Audit]",
        "codeType": "neutral"
      }
    ],
    "category": "practice",
    "topic": "System Architecture Exercises",
    "topicId": "system-architecture-exercises",
    "source": "practice/system-architecture-exercises.md",
    "id": "card-344"
  },
  {
    "question": "Explain how you would enforce data ownership in microservices.",
    "answer": [
      {
        "type": "text",
        "content": "Each service owns its database and schema. Other services access data via APIs or events, not direct DB access. Cross-service workflows use sagas and events."
      }
    ],
    "category": "practice",
    "topic": "System Architecture Exercises",
    "topicId": "system-architecture-exercises",
    "source": "practice/system-architecture-exercises.md",
    "id": "card-345"
  },
  {
    "question": "Describe how you would implement an outbox pattern to keep DB and events consistent.",
    "answer": [
      {
        "type": "text",
        "content": "Write domain changes and an outbox record in the same transaction. A background worker reads the outbox table and publishes events to the broker, marking them as sent."
      }
    ],
    "category": "practice",
    "topic": "System Architecture Exercises",
    "topicId": "system-architecture-exercises",
    "source": "practice/system-architecture-exercises.md",
    "id": "card-346"
  },
  {
    "question": "What operational capabilities do you need before moving to microservices?",
    "answer": [
      {
        "type": "text",
        "content": "Observability (logging, metrics, tracing), mature CI/CD, automated testing, service discovery, resilient networking, and on-call maturity."
      }
    ],
    "category": "practice",
    "topic": "System Architecture Exercises",
    "topicId": "system-architecture-exercises",
    "source": "practice/system-architecture-exercises.md",
    "id": "card-347"
  },
  {
    "question": "Where does a micro-kernel architecture make sense in trading systems?",
    "answer": [
      {
        "type": "text",
        "content": "When you need a stable core with customizable plugins, such as client-specific risk engines or pricing strategies."
      }
    ],
    "category": "practice",
    "topic": "System Architecture Exercises",
    "topicId": "system-architecture-exercises",
    "source": "practice/system-architecture-exercises.md",
    "id": "card-348"
  },
  {
    "question": "You are asked to move a trading system to microservices but latency is critical. How do you respond?",
    "answer": [
      {
        "type": "text",
        "content": "Start with a modular monolith and prove performance. If microservices are required, keep latency-sensitive paths in fewer services, use async messaging for non-critical flows, and benchmark end-to-end latency."
      },
      {
        "type": "text",
        "content": "Total Exercises: 10+"
      }
    ],
    "category": "practice",
    "topic": "System Architecture Exercises",
    "topicId": "system-architecture-exercises",
    "source": "practice/system-architecture-exercises.md",
    "id": "card-349"
  },
  {
    "question": "Do some frontend + backend stacks pair naturally? Why?",
    "answer": [
      {
        "type": "text",
        "content": "Yes — not because of hard technical constraints, but because of ecosystem fit (tooling, conventions, hiring) and common architecture patterns. With clean API boundaries, the frontend becomes more interchangeable."
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Tech-Stacks/Stack-Pairings/index.md",
    "id": "card-350"
  },
  {
    "question": "What are the three main reasons “natural pairings” happen?",
    "answer": [
      {
        "type": "text",
        "content": "Ecosystem fit (libraries/tooling), architecture fit (SPA + API, BFF, real-time), and operational fit (deployment/observability defaults and team habits)."
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Tech-Stacks/Stack-Pairings/index.md",
    "id": "card-351"
  },
  {
    "question": "Give the ultra-short interview answer (10 seconds).",
    "answer": [
      {
        "type": "text",
        "content": "“Angular + .NET is common in enterprise, React + .NET in dashboards/fintech, and React + Go in high-concurrency systems.”"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Tech-Stacks/Stack-Pairings/index.md",
    "id": "card-352"
  },
  {
    "question": "Why is Angular + .NET a common enterprise pairing?",
    "answer": [
      {
        "type": "text",
        "content": "Both are opinionated and structured, the TypeScript ↔ C# symmetry helps teams move faster, and it’s a common hiring/tooling match in large orgs."
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Tech-Stacks/Stack-Pairings/index.md",
    "id": "card-353"
  },
  {
    "question": "What’s a typical Angular + .NET stack?",
    "answer": [
      {
        "type": "text",
        "content": "Angular, ASP.NET Core Web API, EF Core, SQL Server/PostgreSQL, deployed on Azure/IIS/Docker."
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Tech-Stacks/Stack-Pairings/index.md",
    "id": "card-354"
  },
  {
    "question": "Give an “interview sentence” for Angular + .NET.",
    "answer": [
      {
        "type": "text",
        "content": "“Angular and .NET fit well because both enforce structure and scale nicely in large teams.”"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Tech-Stacks/Stack-Pairings/index.md",
    "id": "card-355"
  },
  {
    "question": "Why is React + .NET a common pairing today?",
    "answer": [
      {
        "type": "text",
        "content": "React is UI-flexible and backend-agnostic, while .NET provides stable APIs and great real-time options (SignalR), making it a strong combo for dashboards and line-of-business apps."
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Tech-Stacks/Stack-Pairings/index.md",
    "id": "card-356"
  },
  {
    "question": "What’s a typical React + .NET stack?",
    "answer": [
      {
        "type": "text",
        "content": "React, ASP.NET Core, REST/SignalR/WebSockets, Redis, and PostgreSQL/SQL Server."
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Tech-Stacks/Stack-Pairings/index.md",
    "id": "card-357"
  },
  {
    "question": "Why is React + Node.js such a common pairing?",
    "answer": [
      {
        "type": "text",
        "content": "TypeScript end-to-end, fast iteration, huge ecosystem, and strong community patterns (Next.js, Express/Nest, etc.)."
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Tech-Stacks/Stack-Pairings/index.md",
    "id": "card-358"
  },
  {
    "question": "What’s the main trade-off you should mention for Node.js backends?",
    "answer": [
      {
        "type": "text",
        "content": "For CPU-heavy or performance-critical services, .NET/Go/Java are often better fits; Node still works well for BFF/API gateway layers."
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Tech-Stacks/Stack-Pairings/index.md",
    "id": "card-359"
  },
  {
    "question": "Why do teams pair React with Go?",
    "answer": [
      {
        "type": "text",
        "content": "Go is excellent for high concurrency and throughput with simple operational characteristics; React handles UI complexity while Go serves clean APIs (often REST or gRPC)."
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Tech-Stacks/Stack-Pairings/index.md",
    "id": "card-360"
  },
  {
    "question": "What does “backend-first pairing” mean?",
    "answer": [
      {
        "type": "text",
        "content": "The backend choice drives most constraints (performance, data consistency, integrations). If the backend exposes clean, versioned contracts, the frontend can be swapped with less risk."
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Tech-Stacks/Stack-Pairings/index.md",
    "id": "card-361"
  },
  {
    "question": "Fill in the table of common backend-first pairings.",
    "answer": [
      {
        "type": "text",
        "content": "A:"
      },
      {
        "type": "table",
        "headers": [
          "Backend",
          "Goes Well With",
          "Why"
        ],
        "rows": [
          [
            ".NET",
            "Angular / React",
            "Enterprise, fintech"
          ],
          [
            "Go",
            "React / Svelte",
            "Performance, simplicity"
          ],
          [
            "Java",
            "Angular / React",
            "Large orgs"
          ],
          [
            "Node",
            "React / Vue",
            "TypeScript everywhere"
          ],
          [
            "Python",
            "React",
            "AI / data APIs"
          ]
        ]
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Tech-Stacks/Stack-Pairings/index.md",
    "id": "card-362"
  },
  {
    "question": "You’re building a real-time trading dashboard (live prices + execution updates). What pairing do you choose and why?",
    "answer": [
      {
        "type": "text",
        "content": "React + .NET is a strong default (stable APIs + SignalR for real-time). React + Go is also strong if you need very high concurrency; choose based on team skill and operational maturity."
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Tech-Stacks/Stack-Pairings/index.md",
    "id": "card-363"
  },
  {
    "question": "You need to ship an internal CRUD tool fast with a small team. What pairing do you choose?",
    "answer": [
      {
        "type": "text",
        "content": "React + Node or React + .NET can both work. Optimize for team familiarity and delivery speed, then protect the boundary with clear contracts and tests."
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Tech-Stacks/Stack-Pairings/index.md",
    "id": "card-364"
  },
  {
    "question": "You have CPU-heavy pricing/analytics logic. How do you describe your stack choice?",
    "answer": [
      {
        "type": "text",
        "content": "Put the CPU-heavy service in .NET/Go/Java, expose it via stable APIs, and use any frontend (React/Angular) as a consumer. Node can still be used as a BFF if it helps with aggregation."
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Tech-Stacks/Stack-Pairings/index.md",
    "id": "card-365"
  },
  {
    "question": "Give a 1-minute whiteboard answer to “Do some stacks work better together?”",
    "answer": [
      {
        "type": "text",
        "content": "“Yes — not because of technical limitations, but because of ecosystem fit. For example, Angular often pairs with .NET in enterprise due to typing and structure, while React pairs well with .NET or Go because it’s backend-agnostic. The important part is clean API boundaries — stable contracts, auth, versioning, and observability — so the frontend stays replaceable as requirements evolve.”"
      }
    ],
    "category": "practice",
    "topic": "Index",
    "topicId": "index",
    "source": "practice/Tech-Stacks/Stack-Pairings/index.md",
    "id": "card-366"
  }
];
