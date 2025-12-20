# LINQ & Collections Practice Exercises

Master LINQ queries and collection manipulation through hands-on exercises.

---

## Foundational Questions

**Q: Given a list of trades with timestamps, return the latest trade per account using LINQ.**

A: Sort or group by account and pick the trade with the max timestamp using `GroupBy` + `OrderByDescending`/`MaxBy`. This keeps the logic declarative and pushes the temporal ordering into the query rather than manual loops.

```csharp
var latestTrades = trades
    .GroupBy(t => t.AccountId)
    .Select(g => g.OrderByDescending(t => t.Timestamp).First());
```

Use when you need the most recent entry per key without mutating state, such as building dashboards or reconciling snapshots. Avoid when the dataset is huge and you'd benefit from streaming/SQL aggregation; consider database query with `ROW_NUMBER` or a materialized view to avoid loading everything into memory.

**Q: Implement a method that flattens nested lists of instrument codes while preserving ordering.**

A: Use `SelectMany` to flatten while keeping inner order.

```csharp
var flat = nestedCodes.SelectMany(list => list);
```

Use when you have nested enumerables and simply need to concatenate them. Avoid when you must retain hierarchy boundaries—use nested loops instead.

**Q: Explain the difference between `SelectMany` and nested loops. When is each preferable?**

A: `SelectMany` projects each element to a sequence and flattens; nested loops make iteration explicit and allow more control over flow.

```csharp
// SelectMany
var pairs = accounts.SelectMany(a => a.Orders, (a, o) => new { a.Id, o.Id });

// Nested loops
foreach (var a in accounts)
    foreach (var o in a.Orders)
        yield return (a.Id, o.Id);
```

Use `SelectMany` when you want a fluent declarative pipeline or need joins. Use loops when performance-critical, complex control flow, or break/continue needed.

**Q: How would you detect duplicate orders in a stream using `GroupBy` and produce a summary?**

A: Group by unique order keys and filter groups with count > 1. Summaries can include counts, timestamps, and other aggregate metadata that drive remediation.

```csharp
var duplicates = orders
    .GroupBy(o => new { o.AccountId, o.ClientOrderId })
    .Where(g => g.Count() > 1)
    .Select(g => new {
        g.Key.AccountId,
        g.Key.ClientOrderId,
        Count = g.Count(),
        LatestTimestamp = g.Max(o => o.Timestamp)
    });
```

Use when you need summaries and easy grouping. Avoid when data volume exceeds in-memory capabilities—use database aggregates or streaming dedup.

---

## Intermediate Exercises

**Q: Find all customers who have placed orders in the last 30 days and calculate their total order value.**

A: Use `Where` to filter by date range, then `GroupBy` customer and `Sum` the order values.

```csharp
var cutoffDate = DateTime.UtcNow.AddDays(-30);
var customerTotals = orders
    .Where(o => o.OrderDate >= cutoffDate)
    .GroupBy(o => o.CustomerId)
    .Select(g => new {
        CustomerId = g.Key,
        TotalValue = g.Sum(o => o.TotalAmount),
        OrderCount = g.Count()
    });
```

**Q: Given two lists (products and categories), perform a left join to get all products with their category names (null if no category).**

A: Use `GroupJoin` or `LeftJoin` pattern with `DefaultIfEmpty`.

```csharp
var result = products
    .GroupJoin(
        categories,
        p => p.CategoryId,
        c => c.Id,
        (product, cats) => new { product, cats })
    .SelectMany(
        x => x.cats.DefaultIfEmpty(),
        (x, category) => new {
            x.product.Name,
            CategoryName = category?.Name ?? "Uncategorized"
        });
```

**Q: Implement a LINQ query to find the top 5 most expensive products in each category.**

A: Group by category, order by price descending, take 5.

```csharp
var topProducts = products
    .GroupBy(p => p.CategoryId)
    .Select(g => new {
        CategoryId = g.Key,
        TopProducts = g.OrderByDescending(p => p.Price).Take(5).ToList()
    });
```

**Q: Find all pairs of employees who work in the same department (avoid duplicates like (A,B) and (B,A)).**

A: Self-join with condition to avoid duplicates.

```csharp
var pairs = employees
    .SelectMany(e1 => employees, (e1, e2) => new { e1, e2 })
    .Where(p => p.e1.DepartmentId == p.e2.DepartmentId && p.e1.Id < p.e2.Id)
    .Select(p => new { Employee1 = p.e1.Name, Employee2 = p.e2.Name });
```

**Q: Calculate running totals for daily sales.**

A: Use `Aggregate` with accumulator or window function approach.

```csharp
var runningTotal = sales
    .OrderBy(s => s.Date)
    .Select((sale, index) => new {
        sale.Date,
        sale.Amount,
        RunningTotal = sales
            .OrderBy(s => s.Date)
            .Take(index + 1)
            .Sum(s => s.Amount)
    });

// More efficient approach
decimal total = 0;
var runningTotals = sales
    .OrderBy(s => s.Date)
    .Select(s => new {
        s.Date,
        s.Amount,
        RunningTotal = total += s.Amount
    })
    .ToList();
```

---

## Advanced Exercises

**Q: Implement a custom LINQ extension method `DistinctBy` that takes a key selector.**

A: Create an extension method that uses HashSet for tracking seen keys.

```csharp
public static class LinqExtensions
{
    public static IEnumerable<TSource> DistinctBy<TSource, TKey>(
        this IEnumerable<TSource> source,
        Func<TSource, TKey> keySelector)
    {
        var seenKeys = new HashSet<TKey>();
        foreach (var element in source)
        {
            if (seenKeys.Add(keySelector(element)))
                yield return element;
        }
    }
}

// Usage
var uniqueProducts = products.DistinctBy(p => p.Name);
```

**Q: Write a LINQ query to find all employees whose salary is above the average salary in their department.**

A: Use subquery or join with calculated averages.

```csharp
var departmentAvgs = employees
    .GroupBy(e => e.DepartmentId)
    .Select(g => new { DeptId = g.Key, AvgSalary = g.Average(e => e.Salary) })
    .ToDictionary(x => x.DeptId, x => x.AvgSalary);

var aboveAverage = employees
    .Where(e => e.Salary > departmentAvgs[e.DepartmentId])
    .Select(e => new {
        e.Name,
        e.Salary,
        DeptAverage = departmentAvgs[e.DepartmentId]
    });
```

**Q: Implement pagination with LINQ (Skip/Take) and explain potential issues with IQueryable vs IEnumerable.**

A: Use `Skip` and `Take` for pagination.

```csharp
public IEnumerable<Product> GetProductsPage(int pageNumber, int pageSize)
{
    return dbContext.Products
        .OrderBy(p => p.Id)  // IMPORTANT: Must order for consistent pagination
        .Skip((pageNumber - 1) * pageSize)
        .Take(pageSize)
        .ToList();  // Execute query here
}
```

**Potential Issues:**
- IQueryable: Translates to SQL, efficient but can cause N+1 queries if not careful
- IEnumerable: Loads all data into memory before Skip/Take, very inefficient
- Always order before Skip/Take to ensure consistent results
- Consider total count query for UI pagination info

**Q: Write a LINQ query to pivot data (convert rows to columns).**

A: Use `GroupBy` and dynamic property creation.

```csharp
// Input: Sales with Year, Quarter, Amount
// Output: Year with Q1, Q2, Q3, Q4 columns

var pivoted = sales
    .GroupBy(s => s.Year)
    .Select(g => new {
        Year = g.Key,
        Q1 = g.Where(s => s.Quarter == 1).Sum(s => s.Amount),
        Q2 = g.Where(s => s.Quarter == 2).Sum(s => s.Amount),
        Q3 = g.Where(s => s.Quarter == 3).Sum(s => s.Amount),
        Q4 = g.Where(s => s.Quarter == 4).Sum(s => s.Amount)
    });
```

**Q: Implement a LINQ query with multiple grouping levels (hierarchical grouping).**

A: Nest `GroupBy` operations.

```csharp
var hierarchicalGroups = sales
    .GroupBy(s => s.Year)
    .Select(yearGroup => new {
        Year = yearGroup.Key,
        Quarters = yearGroup
            .GroupBy(s => s.Quarter)
            .Select(quarterGroup => new {
                Quarter = quarterGroup.Key,
                TotalSales = quarterGroup.Sum(s => s.Amount),
                Transactions = quarterGroup.ToList()
            })
            .ToList()
    });
```

**Q: Find all consecutive sequences of at least 3 days where sales exceeded $10,000.**

A: Use windowing logic with LINQ.

```csharp
var threshold = 10000m;
var consecutiveHighSales = sales
    .OrderBy(s => s.Date)
    .Select((sale, index) => new {
        sale,
        index,
        IsHigh = sale.Amount > threshold
    })
    .Where(x => x.IsHigh)
    .GroupBy(x => x.index - sales
        .OrderBy(s => s.Date)
        .TakeWhile((s, i) => i < x.index)
        .Count(s => s.Amount > threshold))
    .Where(g => g.Count() >= 3)
    .Select(g => new {
        StartDate = g.First().sale.Date,
        EndDate = g.Last().sale.Date,
        DayCount = g.Count()
    });
```

---

## Performance & Optimization

**Q: Explain deferred execution and when it can cause performance issues.**

A: LINQ queries using IEnumerable are not executed until enumerated. Multiple enumerations re-execute the query.

```csharp
// ❌ Bad: Query executes 3 times
var expensiveQuery = dbContext.Orders
    .Where(o => ComplexCalculation(o));

var count = expensiveQuery.Count();          // Executes query
var first = expensiveQuery.FirstOrDefault(); // Executes query again
var list = expensiveQuery.ToList();          // Executes query again

// ✅ Good: Materialize once
var results = dbContext.Orders
    .Where(o => ComplexCalculation(o))
    .ToList();  // Single execution

var count = results.Count;
var first = results.FirstOrDefault();
```

**Q: Compare the performance implications of `Count()` vs `Any()` for checking if a collection has items.**

A: `Any()` stops at first match; `Count()` must enumerate everything.

```csharp
// ❌ Bad: Counts all items
if (orders.Count() > 0)
{
    // ...
}

// ✅ Good: Stops at first item
if (orders.Any())
{
    // ...
}

// For checking specific count
if (orders.Count() >= 100)  // Bad: counts all
if (orders.Skip(99).Any())  // Better: stops at 100th
```

**Q: Identify and fix performance issues in this query.**

```csharp
// ❌ Bad: Multiple database round trips
var orders = dbContext.Orders.ToList();
foreach (var order in orders)
{
    order.Customer = dbContext.Customers.Find(order.CustomerId);
    order.Items = dbContext.OrderItems.Where(i => i.OrderId == order.Id).ToList();
}
```

A: Use eager loading with `Include`.

```csharp
// ✅ Good: Single query with joins
var orders = dbContext.Orders
    .Include(o => o.Customer)
    .Include(o => o.Items)
    .ToList();
```

**Q: Write a LINQ query that uses `AsParallel` appropriately for CPU-bound operations.**

A: Use PLINQ for computationally expensive operations.

```csharp
// CPU-bound operation
var results = largeDataset
    .AsParallel()
    .WithDegreeOfParallelism(Environment.ProcessorCount)
    .Where(item => ExpensiveComputation(item))
    .Select(item => TransformItem(item))
    .ToList();

// Don't use for I/O-bound operations or small datasets
```

---

## Collection-Specific Exercises

**Q: When should you use `List<T>` vs `IEnumerable<T>` as a return type?**

A: Return `IEnumerable<T>` for flexibility; use `List<T>` when caller needs indexing/modification.

```csharp
// ✅ Good: Flexible, caller can decide materialization
public IEnumerable<Order> GetOrders()
{
    return dbContext.Orders.Where(o => o.IsActive);
}

// Use List<T> when:
// 1. Multiple enumerations are expected
// 2. Caller needs random access
// 3. Caller needs to modify the collection
public List<Order> GetOrdersForProcessing()
{
    return dbContext.Orders.Where(o => o.Status == "Pending").ToList();
}
```

**Q: Implement a LookupTable using `ToLookup` and explain when to use it vs `GroupBy`.**

A: `ToLookup` immediately executes and creates an immutable lookup structure.

```csharp
// ToLookup - immediate execution, multiple lookups
var ordersByCustomer = orders.ToLookup(o => o.CustomerId);
var customer1Orders = ordersByCustomer[customerId1];  // O(1) lookup
var customer2Orders = ordersByCustomer[customerId2];  // Another O(1) lookup

// GroupBy - deferred execution, single enumeration
var grouped = orders.GroupBy(o => o.CustomerId);
foreach (var customerOrders in grouped)  // Single pass
{
    ProcessOrders(customerOrders);
}
```

**Q: Use `Zip` to combine two sequences and explain its behavior when sequences have different lengths.**

A: `Zip` combines elements pairwise, stops at shortest sequence.

```csharp
var numbers = new[] { 1, 2, 3, 4 };
var letters = new[] { "A", "B", "C" };

var zipped = numbers.Zip(letters, (n, l) => $"{n}-{l}");
// Result: ["1-A", "2-B", "3-C"]  - 4 is ignored

// C# 9+ Tuple syntax
var zipped2 = numbers.Zip(letters);
// Result: [(1, "A"), (2, "B"), (3, "C")]
```

**Q: Implement a method that chunks a collection into batches of N items.**

A: Use `Chunk` (C# 9+) or implement custom batching.

```csharp
// C# 9+
var batches = items.Chunk(100);

// Custom implementation
public static IEnumerable<IEnumerable<T>> Batch<T>(
    this IEnumerable<T> source, int batchSize)
{
    var batch = new List<T>(batchSize);
    foreach (var item in source)
    {
        batch.Add(item);
        if (batch.Count == batchSize)
        {
            yield return batch;
            batch = new List<T>(batchSize);
        }
    }

    if (batch.Any())
        yield return batch;
}
```

---

## Real-World Scenarios

**Q: You need to merge data from multiple sources (database, API, cache) and remove duplicates. Implement this efficiently.**

A: Combine sources and use `DistinctBy` or `HashSet`.

```csharp
public async Task<List<Product>> GetMergedProducts()
{
    var dbProducts = await dbContext.Products.ToListAsync();
    var apiProducts = await apiClient.GetProductsAsync();
    var cachedProducts = cache.Get<List<Product>>("products") ?? new List<Product>();

    var allProducts = dbProducts
        .Concat(apiProducts)
        .Concat(cachedProducts)
        .DistinctBy(p => p.Id)
        .ToList();

    return allProducts;
}
```

**Q: Implement a search feature with multiple optional filters (name, category, price range, tags).**

A: Build query dynamically with conditional `Where` clauses.

```csharp
public IEnumerable<Product> SearchProducts(
    string name = null,
    int? categoryId = null,
    decimal? minPrice = null,
    decimal? maxPrice = null,
    string[] tags = null)
{
    IQueryable<Product> query = dbContext.Products;

    if (!string.IsNullOrEmpty(name))
        query = query.Where(p => p.Name.Contains(name));

    if (categoryId.HasValue)
        query = query.Where(p => p.CategoryId == categoryId.Value);

    if (minPrice.HasValue)
        query = query.Where(p => p.Price >= minPrice.Value);

    if (maxPrice.HasValue)
        query = query.Where(p => p.Price <= maxPrice.Value);

    if (tags != null && tags.Any())
        query = query.Where(p => p.Tags.Any(t => tags.Contains(t)));

    return query.ToList();
}
```

**Q: Calculate month-over-month growth percentage for sales data.**

A: Join current month with previous month data.

```csharp
var monthlySales = sales
    .GroupBy(s => new { s.Year, s.Month })
    .Select(g => new {
        g.Key.Year,
        g.Key.Month,
        Total = g.Sum(s => s.Amount)
    })
    .OrderBy(m => m.Year).ThenBy(m => m.Month)
    .ToList();

var growth = monthlySales
    .Zip(monthlySales.Skip(1), (prev, curr) => new {
        curr.Year,
        curr.Month,
        CurrentTotal = curr.Total,
        PreviousTotal = prev.Total,
        GrowthPercent = ((curr.Total - prev.Total) / prev.Total) * 100
    });
```

---

## Challenge Problems

**Q: Implement an expression builder that allows dynamic LINQ query construction from user input.**

A: Use `Expression` trees to build dynamic queries.

```csharp
public static class DynamicQueryBuilder
{
    public static IQueryable<T> ApplyFilter<T>(
        IQueryable<T> query,
        string propertyName,
        string operation,
        object value)
    {
        var parameter = Expression.Parameter(typeof(T), "x");
        var property = Expression.Property(parameter, propertyName);
        var constant = Expression.Constant(value);

        Expression comparison = operation switch
        {
            "=" => Expression.Equal(property, constant),
            ">" => Expression.GreaterThan(property, constant),
            "<" => Expression.LessThan(property, constant),
            "contains" => Expression.Call(property, "Contains", null, constant),
            _ => throw new ArgumentException("Invalid operation")
        };

        var lambda = Expression.Lambda<Func<T, bool>>(comparison, parameter);
        return query.Where(lambda);
    }
}

// Usage
var query = dbContext.Products.AsQueryable();
query = DynamicQueryBuilder.ApplyFilter(query, "Price", ">", 100m);
query = DynamicQueryBuilder.ApplyFilter(query, "Name", "contains", "Widget");
```

**Q: Implement a method that finds all possible combinations of products that sum to a target price (subset sum problem).**

A: Recursive LINQ approach or dynamic programming.

```csharp
public static IEnumerable<List<Product>> FindCombinations(
    List<Product> products,
    decimal targetPrice,
    decimal tolerance = 0.01m)
{
    for (int i = 0; i < products.Count; i++)
    {
        var product = products[i];

        if (Math.Abs(product.Price - targetPrice) <= tolerance)
        {
            yield return new List<Product> { product };
        }

        if (product.Price < targetPrice)
        {
            var remaining = products.Skip(i + 1).ToList();
            var subCombos = FindCombinations(
                remaining,
                targetPrice - product.Price,
                tolerance);

            foreach (var combo in subCombos)
            {
                yield return new List<Product> { product }.Concat(combo).ToList();
            }
        }
    }
}
```

---

**Total Exercises: 30+**

Practice these exercises by actually writing the code. Don't just read—implement and test!
