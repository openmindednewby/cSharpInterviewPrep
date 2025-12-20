# Data Layer Practice Exercises

Master Entity Framework Core, SQL optimization, database design, and data access patterns for high-performance applications.

---

## Foundational Questions

**Q: Write a SQL query to calculate the rolling 7-day trade volume per instrument.**

A: Use window functions to calculate rolling aggregates.

```sql
WITH daily AS (
    SELECT instrument_id,
           trade_timestamp::date AS trade_date,
           SUM(volume) AS daily_volume
    FROM trades
    GROUP BY instrument_id, trade_timestamp::date
)
SELECT instrument_id,
       trade_date,
       daily_volume,
       SUM(daily_volume) OVER (
           PARTITION BY instrument_id
           ORDER BY trade_date
           ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
       ) AS rolling_7d_volume
FROM daily
ORDER BY instrument_id, trade_date;
```

Use when need rolling metrics in SQL. Avoid when database lacks window functions—use app-side aggregation.

**Q: Explain how you would choose between normalized schemas and denormalized tables for reporting.**

A: Normalized: reduces redundancy, good for OLTP. Changes cascade predictably, but reporting joins can be expensive. Denormalized: duplicates data for fast reads (reporting, analytics). Updates are more complex; rely on ETL pipelines to keep facts in sync. Choose based on workload: mixed? use hybrid star schema or CQRS approach with read-optimized projections.

**Q: Describe the differences between clustered and non-clustered indexes and when to use covering indexes.**

A: Clustered: defines physical order, one per table; great for range scans. Non-clustered: separate structure pointing to data; can include columns.

```sql
CREATE NONCLUSTERED INDEX IX_Orders_Account_Status
    ON Orders(AccountId, Status)
    INCLUDE (CreatedAt, Amount);
```

Use covering index when query needs subset of columns; avoid extra lookups. Avoid when frequent writes—maintaining many indexes hurts performance.

**Q: Walk through handling a long-running report query that impacts OLTP performance.**

A: Strategies: read replicas, materialized views, batching, query hints, schedule off-peak. Consider breaking the query into smaller windowed segments and streaming results to avoid locking. Implement caching, pre-aggregation, and monitor execution plans for regressions.

---

## Entity Framework Core Fundamentals

**Q: Configure a many-to-many relationship with a junction table containing additional properties.**

A: Use explicit junction entity with Fluent API.

```csharp
// Entities
public class Student
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<StudentCourse> StudentCourses { get; set; }
}

public class Course
{
    public int Id { get; set; }
    public string Title { get; set; }
    public List<StudentCourse> StudentCourses { get; set; }
}

public class StudentCourse
{
    public int StudentId { get; set; }
    public Student Student { get; set; }

    public int CourseId { get; set; }
    public Course Course { get; set; }

    // Additional properties
    public DateTime EnrolledDate { get; set; }
    public decimal Grade { get; set; }
}

// Configuration
public class StudentCourseConfiguration : IEntityTypeConfiguration<StudentCourse>
{
    public void Configure(EntityTypeBuilder<StudentCourse> builder)
    {
        builder.HasKey(sc => new { sc.StudentId, sc.CourseId });

        builder.HasOne(sc => sc.Student)
            .WithMany(s => s.StudentCourses)
            .HasForeignKey(sc => sc.StudentId);

        builder.HasOne(sc => sc.Course)
            .WithMany(c => c.StudentCourses)
            .HasForeignKey(sc => sc.CourseId);

        builder.Property(sc => sc.EnrolledDate)
            .HasDefaultValueSql("GETUTCDATE()");
    }
}
```

**Q: Implement soft delete with global query filters.**

A: Use query filters to exclude deleted records automatically.

```csharp
public interface ISoftDeletable
{
    bool IsDeleted { get; set; }
    DateTime? DeletedAt { get; set; }
}

public class Order : ISoftDeletable
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
}

public class TradingDbContext : DbContext
{
    public DbSet<Order> Orders { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Apply global query filter
        modelBuilder.Entity<Order>()
            .HasQueryFilter(o => !o.IsDeleted);

        // Can apply to all entities implementing interface
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(ISoftDeletable).IsAssignableFrom(entityType.ClrType))
            {
                var parameter = Expression.Parameter(entityType.ClrType, "e");
                var property = Expression.Property(parameter, nameof(ISoftDeletable.IsDeleted));
                var condition = Expression.Equal(property, Expression.Constant(false));
                var lambda = Expression.Lambda(condition, parameter);

                modelBuilder.Entity(entityType.ClrType).HasQueryFilter(lambda);
            }
        }
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Intercept deletions and mark as soft deleted
        foreach (var entry in ChangeTracker.Entries<ISoftDeletable>())
        {
            if (entry.State == EntityState.Deleted)
            {
                entry.State = EntityState.Modified;
                entry.Entity.IsDeleted = true;
                entry.Entity.DeletedAt = DateTime.UtcNow;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}

// Query without filter (include deleted)
var allOrders = await context.Orders
    .IgnoreQueryFilters()
    .ToListAsync();
```

**Q: Implement optimistic concurrency control using row versioning.**

A: Use timestamp/rowversion for conflict detection.

```csharp
public class Account
{
    public Guid Id { get; set; }
    public string AccountNumber { get; set; }
    public decimal Balance { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; }
}

// Or with Fluent API
public class AccountConfiguration : IEntityTypeConfiguration<Account>
{
    public void Configure(EntityTypeBuilder<Account> builder)
    {
        builder.Property(a => a.RowVersion)
            .IsRowVersion();
    }
}

// Usage
public class AccountService
{
    private readonly TradingDbContext _context;

    public async Task<bool> UpdateBalanceAsync(Guid accountId, decimal newBalance)
    {
        var maxRetries = 3;
        var retryCount = 0;

        while (retryCount < maxRetries)
        {
            try
            {
                var account = await _context.Accounts.FindAsync(accountId);
                account.Balance = newBalance;

                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                retryCount++;

                if (retryCount >= maxRetries)
                {
                    throw;
                }

                // Reload entity with current database values
                var entry = ex.Entries.Single();
                await entry.ReloadAsync();

                // Optionally merge changes or apply custom logic
            }
        }

        return false;
    }
}
```

**Q: Configure table splitting to map multiple entities to a single table.**

A: Share table between related entities.

```csharp
public class Order
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; }
    public OrderDetails Details { get; set; }
}

public class OrderDetails
{
    public Guid OrderId { get; set; }
    public string Notes { get; set; }
    public string ShippingInstructions { get; set; }
}

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders");
        builder.HasKey(o => o.Id);

        builder.HasOne(o => o.Details)
            .WithOne()
            .HasForeignKey<OrderDetails>(d => d.OrderId);

        builder.OwnsOne(o => o.Details, details =>
        {
            details.ToTable("Orders"); // Same table
        });
    }
}
```

**Q: Implement audit trail using change tracking.**

A: Track who/when modified entities.

```csharp
public interface IAuditable
{
    DateTime CreatedAt { get; set; }
    string CreatedBy { get; set; }
    DateTime? ModifiedAt { get; set; }
    string ModifiedBy { get; set; }
}

public class Order : IAuditable
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; }
    public DateTime? ModifiedAt { get; set; }
    public string ModifiedBy { get; set; }
}

public class TradingDbContext : DbContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public TradingDbContext(
        DbContextOptions<TradingDbContext> options,
        IHttpContextAccessor httpContextAccessor)
        : base(options)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var userId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? "system";

        var entries = ChangeTracker.Entries<IAuditable>();

        foreach (var entry in entries)
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    entry.Entity.CreatedBy = userId;
                    break;

                case EntityState.Modified:
                    entry.Entity.ModifiedAt = DateTime.UtcNow;
                    entry.Entity.ModifiedBy = userId;
                    break;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
```

---

## Advanced Entity Framework Patterns

**Q: Implement repository pattern with specification pattern for complex queries.**

A: Encapsulate query logic in reusable specifications.

```csharp
// Specification interface
public interface ISpecification<T>
{
    Expression<Func<T, bool>> Criteria { get; }
    List<Expression<Func<T, object>>> Includes { get; }
    List<string> IncludeStrings { get; }
    Expression<Func<T, object>> OrderBy { get; }
    Expression<Func<T, object>> OrderByDescending { get; }
    int Take { get; }
    int Skip { get; }
    bool IsPagingEnabled { get; }
}

// Base specification
public abstract class BaseSpecification<T> : ISpecification<T>
{
    public Expression<Func<T, bool>> Criteria { get; private set; }
    public List<Expression<Func<T, object>>> Includes { get; } = new();
    public List<string> IncludeStrings { get; } = new();
    public Expression<Func<T, object>> OrderBy { get; private set; }
    public Expression<Func<T, object>> OrderByDescending { get; private set; }
    public int Take { get; private set; }
    public int Skip { get; private set; }
    public bool IsPagingEnabled { get; private set; }

    protected BaseSpecification(Expression<Func<T, bool>> criteria)
    {
        Criteria = criteria;
    }

    protected void AddInclude(Expression<Func<T, object>> includeExpression)
    {
        Includes.Add(includeExpression);
    }

    protected void AddInclude(string includeString)
    {
        IncludeStrings.Add(includeString);
    }

    protected void ApplyOrderBy(Expression<Func<T, object>> orderByExpression)
    {
        OrderBy = orderByExpression;
    }

    protected void ApplyOrderByDescending(Expression<Func<T, object>> orderByDescExpression)
    {
        OrderByDescending = orderByDescExpression;
    }

    protected void ApplyPaging(int skip, int take)
    {
        Skip = skip;
        Take = take;
        IsPagingEnabled = true;
    }
}

// Concrete specification
public class OrdersByCustomerSpec : BaseSpecification<Order>
{
    public OrdersByCustomerSpec(Guid customerId, DateTime? fromDate = null, DateTime? toDate = null)
        : base(o => o.CustomerId == customerId &&
                   (!fromDate.HasValue || o.CreatedAt >= fromDate.Value) &&
                   (!toDate.HasValue || o.CreatedAt <= toDate.Value))
    {
        AddInclude(o => o.Items);
        AddInclude(o => o.Customer);
        ApplyOrderByDescending(o => o.CreatedAt);
    }
}

// Repository with specification support
public class Repository<T> : IRepository<T> where T : class
{
    private readonly DbContext _context;

    public Repository(DbContext context)
    {
        _context = context;
    }

    public async Task<List<T>> ListAsync(ISpecification<T> spec)
    {
        var query = ApplySpecification(spec);
        return await query.ToListAsync();
    }

    public async Task<int> CountAsync(ISpecification<T> spec)
    {
        var query = ApplySpecification(spec);
        return await query.CountAsync();
    }

    private IQueryable<T> ApplySpecification(ISpecification<T> spec)
    {
        return SpecificationEvaluator<T>.GetQuery(_context.Set<T>().AsQueryable(), spec);
    }
}

// Specification evaluator
public class SpecificationEvaluator<T> where T : class
{
    public static IQueryable<T> GetQuery(IQueryable<T> inputQuery, ISpecification<T> spec)
    {
        var query = inputQuery;

        if (spec.Criteria != null)
        {
            query = query.Where(spec.Criteria);
        }

        query = spec.Includes.Aggregate(query, (current, include) => current.Include(include));
        query = spec.IncludeStrings.Aggregate(query, (current, include) => current.Include(include));

        if (spec.OrderBy != null)
        {
            query = query.OrderBy(spec.OrderBy);
        }
        else if (spec.OrderByDescending != null)
        {
            query = query.OrderByDescending(spec.OrderByDescending);
        }

        if (spec.IsPagingEnabled)
        {
            query = query.Skip(spec.Skip).Take(spec.Take);
        }

        return query;
    }
}

// Usage
var spec = new OrdersByCustomerSpec(customerId, fromDate: DateTime.UtcNow.AddDays(-30));
var orders = await repository.ListAsync(spec);
```

**Q: Implement Unit of Work pattern for transaction management.**

A: Coordinate multiple repositories in a single transaction.

```csharp
public interface IUnitOfWork : IDisposable
{
    IRepository<T> Repository<T>() where T : class;
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}

public class UnitOfWork : IUnitOfWork
{
    private readonly DbContext _context;
    private IDbContextTransaction _transaction;
    private readonly Dictionary<Type, object> _repositories = new();

    public UnitOfWork(DbContext context)
    {
        _context = context;
    }

    public IRepository<T> Repository<T>() where T : class
    {
        var type = typeof(T);

        if (!_repositories.ContainsKey(type))
        {
            _repositories[type] = new Repository<T>(_context);
        }

        return (IRepository<T>)_repositories[type];
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        try
        {
            await _context.SaveChangesAsync();
            await _transaction.CommitAsync();
        }
        catch
        {
            await RollbackTransactionAsync();
            throw;
        }
        finally
        {
            _transaction?.Dispose();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        await _transaction?.RollbackAsync();
        _transaction?.Dispose();
        _transaction = null;
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context?.Dispose();
    }
}

// Usage
public class OrderService
{
    private readonly IUnitOfWork _unitOfWork;

    public async Task CreateOrderAsync(CreateOrderCommand command)
    {
        await _unitOfWork.BeginTransactionAsync();

        try
        {
            var order = new Order { /* ... */ };
            await _unitOfWork.Repository<Order>().AddAsync(order);

            var inventory = await _unitOfWork.Repository<Inventory>()
                .GetByIdAsync(command.ProductId);
            inventory.Quantity -= command.Quantity;

            await _unitOfWork.CommitTransactionAsync();
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }
}
```

**Q: Implement custom value converter for complex types.**

A: Convert between property types and database columns.

```csharp
public class Money
{
    public decimal Amount { get; }
    public string Currency { get; }

    public Money(decimal amount, string currency)
    {
        Amount = amount;
        Currency = currency ?? throw new ArgumentNullException(nameof(currency));
    }
}

public class MoneyConverter : ValueConverter<Money, string>
{
    public MoneyConverter()
        : base(
            money => $"{money.Amount}|{money.Currency}",
            str => FromString(str))
    {
    }

    private static Money FromString(string value)
    {
        var parts = value.Split('|');
        return new Money(decimal.Parse(parts[0]), parts[1]);
    }
}

// Configuration
public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.Property(o => o.TotalAmount)
            .HasConversion(new MoneyConverter())
            .HasColumnName("TotalAmount");
    }
}

// Alternative: JSON conversion for complex objects
public class Address
{
    public string Street { get; set; }
    public string City { get; set; }
    public string ZipCode { get; set; }
}

public class AddressConverter : ValueConverter<Address, string>
{
    public AddressConverter()
        : base(
            address => JsonSerializer.Serialize(address, (JsonSerializerOptions)null),
            json => JsonSerializer.Deserialize<Address>(json, (JsonSerializerOptions)null))
    {
    }
}
```

---

## SQL Optimization

**Q: Optimize a query with multiple joins and aggregations.**

A: Analyze execution plan and apply optimizations.

```sql
-- ❌ Slow query
SELECT c.CustomerName,
       COUNT(o.OrderId) AS OrderCount,
       SUM(oi.Quantity * oi.UnitPrice) AS TotalSpent
FROM Customers c
LEFT JOIN Orders o ON c.CustomerId = o.CustomerId
LEFT JOIN OrderItems oi ON o.OrderId = oi.OrderId
WHERE o.OrderDate >= '2024-01-01'
GROUP BY c.CustomerId, c.CustomerName
HAVING SUM(oi.Quantity * oi.UnitPrice) > 1000
ORDER BY TotalSpent DESC;

-- ✅ Optimized with CTE and proper indexing
-- First, create covering indexes:
CREATE NONCLUSTERED INDEX IX_Orders_CustomerId_OrderDate
    ON Orders(CustomerId, OrderDate)
    INCLUDE (OrderId);

CREATE NONCLUSTERED INDEX IX_OrderItems_OrderId
    ON OrderItems(OrderId)
    INCLUDE (Quantity, UnitPrice);

-- Optimized query
WITH OrderTotals AS (
    SELECT o.CustomerId,
           COUNT(DISTINCT o.OrderId) AS OrderCount,
           SUM(oi.Quantity * oi.UnitPrice) AS TotalSpent
    FROM Orders o
    INNER JOIN OrderItems oi ON o.OrderId = oi.OrderId
    WHERE o.OrderDate >= '2024-01-01'
    GROUP BY o.CustomerId
    HAVING SUM(oi.Quantity * oi.UnitPrice) > 1000
)
SELECT c.CustomerName,
       ot.OrderCount,
       ot.TotalSpent
FROM Customers c
INNER JOIN OrderTotals ot ON c.CustomerId = ot.CustomerId
ORDER BY ot.TotalSpent DESC;
```

**Q: Implement pagination efficiently for large datasets.**

A: Use OFFSET/FETCH or keyset pagination.

```sql
-- ❌ Slow for large offsets
SELECT OrderId, OrderNumber, CreatedAt
FROM Orders
ORDER BY CreatedAt DESC
OFFSET 10000 ROWS
FETCH NEXT 20 ROWS ONLY;

-- ✅ Keyset pagination (seek method)
-- First page
SELECT TOP 20 OrderId, OrderNumber, CreatedAt
FROM Orders
ORDER BY CreatedAt DESC, OrderId DESC;

-- Next page (using last CreatedAt and OrderId from previous page)
SELECT TOP 20 OrderId, OrderNumber, CreatedAt
FROM Orders
WHERE CreatedAt < @LastCreatedAt
   OR (CreatedAt = @LastCreatedAt AND OrderId < @LastOrderId)
ORDER BY CreatedAt DESC, OrderId DESC;

-- Index for keyset pagination
CREATE NONCLUSTERED INDEX IX_Orders_CreatedAt_OrderId
    ON Orders(CreatedAt DESC, OrderId DESC)
    INCLUDE (OrderNumber);
```

**Q: Optimize EXISTS vs IN vs JOIN.**

A: Choose based on data characteristics and cardinality.

```sql
-- Scenario: Find customers who have placed orders

-- ✅ EXISTS - Best when checking existence (stops at first match)
SELECT c.CustomerId, c.CustomerName
FROM Customers c
WHERE EXISTS (
    SELECT 1
    FROM Orders o
    WHERE o.CustomerId = c.CustomerId
);

-- ❌ IN - Slower with large subquery results
SELECT c.CustomerId, c.CustomerName
FROM Customers c
WHERE c.CustomerId IN (
    SELECT DISTINCT CustomerId
    FROM Orders
);

-- ✅ INNER JOIN with DISTINCT - Good for retrieving additional columns
SELECT DISTINCT c.CustomerId, c.CustomerName
FROM Customers c
INNER JOIN Orders o ON c.CustomerId = o.CustomerId;

-- NOT EXISTS vs NOT IN
-- ✅ NOT EXISTS - Handles NULLs correctly
SELECT c.CustomerId, c.CustomerName
FROM Customers c
WHERE NOT EXISTS (
    SELECT 1
    FROM Orders o
    WHERE o.CustomerId = c.CustomerId
);

-- ❌ NOT IN - Returns empty if subquery contains NULL
SELECT c.CustomerId, c.CustomerName
FROM Customers c
WHERE c.CustomerId NOT IN (
    SELECT CustomerId
    FROM Orders
    WHERE CustomerId IS NOT NULL  -- Must exclude NULLs!
);
```

**Q: Use window functions for ranking and percentiles.**

A: Calculate rankings without self-joins.

```csharp
-- Rank products by sales within each category
SELECT ProductId,
       CategoryId,
       ProductName,
       TotalSales,
       ROW_NUMBER() OVER (PARTITION BY CategoryId ORDER BY TotalSales DESC) AS SalesRank,
       RANK() OVER (PARTITION BY CategoryId ORDER BY TotalSales DESC) AS SalesRankWithTies,
       DENSE_RANK() OVER (PARTITION BY CategoryId ORDER BY TotalSales DESC) AS DenseSalesRank,
       PERCENT_RANK() OVER (PARTITION BY CategoryId ORDER BY TotalSales DESC) AS PercentileRank,
       NTILE(4) OVER (PARTITION BY CategoryId ORDER BY TotalSales DESC) AS Quartile
FROM (
    SELECT p.ProductId,
           p.CategoryId,
           p.ProductName,
           SUM(oi.Quantity * oi.UnitPrice) AS TotalSales
    FROM Products p
    INNER JOIN OrderItems oi ON p.ProductId = oi.ProductId
    GROUP BY p.ProductId, p.CategoryId, p.ProductName
) AS ProductSales;

-- Calculate running totals
SELECT OrderDate,
       OrderId,
       Amount,
       SUM(Amount) OVER (ORDER BY OrderDate, OrderId ROWS UNBOUNDED PRECEDING) AS RunningTotal,
       AVG(Amount) OVER (ORDER BY OrderDate ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS MovingAvg7Day
FROM Orders
ORDER BY OrderDate, OrderId;
```

---

## Indexing Strategies

**Q: Design composite index for a multi-column WHERE clause.**

A: Order columns by selectivity and usage patterns.

```sql
-- Query pattern
SELECT OrderId, CustomerId, OrderDate, Status, TotalAmount
FROM Orders
WHERE CustomerId = @CustomerId
  AND Status = @Status
  AND OrderDate >= @StartDate
  AND OrderDate < @EndDate;

-- ✅ Optimal composite index (equality → range)
CREATE NONCLUSTERED INDEX IX_Orders_CustomerId_Status_OrderDate
    ON Orders(CustomerId, Status, OrderDate)
    INCLUDE (TotalAmount);

-- Index usage statistics
SELECT OBJECT_NAME(s.object_id) AS TableName,
       i.name AS IndexName,
       s.user_seeks,
       s.user_scans,
       s.user_lookups,
       s.user_updates,
       s.last_user_seek,
       s.last_user_scan
FROM sys.dm_db_index_usage_stats s
INNER JOIN sys.indexes i ON s.object_id = i.object_id AND s.index_id = i.index_id
WHERE s.database_id = DB_ID()
  AND OBJECT_NAME(s.object_id) = 'Orders'
ORDER BY s.user_seeks + s.user_scans + s.user_lookups DESC;
```

**Q: Identify and remove unused or duplicate indexes.**

A: Find indexes with low usage and high maintenance cost.

```sql
-- Find unused indexes
SELECT OBJECT_NAME(i.object_id) AS TableName,
       i.name AS IndexName,
       i.type_desc AS IndexType,
       s.user_seeks,
       s.user_scans,
       s.user_lookups,
       s.user_updates,
       (s.user_updates - (s.user_seeks + s.user_scans + s.user_lookups)) AS UpdateOverhead
FROM sys.indexes i
LEFT JOIN sys.dm_db_index_usage_stats s
    ON i.object_id = s.object_id AND i.index_id = s.index_id AND s.database_id = DB_ID()
WHERE OBJECTPROPERTY(i.object_id, 'IsUserTable') = 1
  AND i.type_desc <> 'CLUSTERED'
  AND i.is_primary_key = 0
  AND i.is_unique_constraint = 0
  AND (s.user_seeks + s.user_scans + s.user_lookups = 0 OR s.user_seeks IS NULL)
ORDER BY s.user_updates DESC;

-- Find duplicate indexes
WITH IndexColumns AS (
    SELECT i.object_id,
           i.index_id,
           i.name AS IndexName,
           STRING_AGG(c.name, ', ') WITHIN GROUP (ORDER BY ic.key_ordinal) AS KeyColumns,
           STRING_AGG(c.name, ', ') WITHIN GROUP (ORDER BY ic.index_column_id) AS IncludedColumns
    FROM sys.indexes i
    INNER JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
    INNER JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
    WHERE i.type_desc = 'NONCLUSTERED'
    GROUP BY i.object_id, i.index_id, i.name
)
SELECT OBJECT_NAME(a.object_id) AS TableName,
       a.IndexName AS Index1,
       b.IndexName AS Index2,
       a.KeyColumns,
       a.IncludedColumns
FROM IndexColumns a
INNER JOIN IndexColumns b
    ON a.object_id = b.object_id
   AND a.index_id < b.index_id
   AND a.KeyColumns = b.KeyColumns
   AND (a.IncludedColumns = b.IncludedColumns OR a.IncludedColumns IS NULL AND b.IncludedColumns IS NULL);
```

**Q: Implement filtered index for specific query patterns.**

A: Create indexes for subsets of data.

```sql
-- Only index active orders
CREATE NONCLUSTERED INDEX IX_Orders_Active_CreatedAt
    ON Orders(CreatedAt DESC)
    INCLUDE (CustomerId, TotalAmount)
    WHERE Status IN ('Pending', 'Processing');

-- Index non-null values only
CREATE NONCLUSTERED INDEX IX_Orders_CompletedDate
    ON Orders(CompletedDate)
    WHERE CompletedDate IS NOT NULL;

-- Index specific date range (partitioning effect)
CREATE NONCLUSTERED INDEX IX_Orders_Recent
    ON Orders(OrderDate DESC, CustomerId)
    INCLUDE (TotalAmount)
    WHERE OrderDate >= '2024-01-01';
```

---

## Transactions & Concurrency

**Q: Implement distributed transaction across multiple databases.**

A: Use TransactionScope for coordinated transactions.

```csharp
public class DistributedTransactionService
{
    private readonly DbContext _ordersContext;
    private readonly DbContext _inventoryContext;
    private readonly DbContext _accountingContext;

    public async Task ProcessOrderAsync(CreateOrderCommand command)
    {
        var transactionOptions = new TransactionOptions
        {
            IsolationLevel = System.Transactions.IsolationLevel.ReadCommitted,
            Timeout = TimeSpan.FromSeconds(30)
        };

        using var scope = new TransactionScope(
            TransactionScopeOption.Required,
            transactionOptions,
            TransactionScopeAsyncFlowOption.Enabled);

        try
        {
            // Database 1: Orders
            var order = new Order
            {
                Id = Guid.NewGuid(),
                CustomerId = command.CustomerId,
                TotalAmount = command.TotalAmount
            };
            _ordersContext.Orders.Add(order);
            await _ordersContext.SaveChangesAsync();

            // Database 2: Inventory
            var inventory = await _inventoryContext.Inventory
                .FirstOrDefaultAsync(i => i.ProductId == command.ProductId);
            inventory.Quantity -= command.Quantity;
            await _inventoryContext.SaveChangesAsync();

            // Database 3: Accounting
            var transaction = new AccountingTransaction
            {
                OrderId = order.Id,
                Amount = command.TotalAmount,
                Type = TransactionType.Sale
            };
            _accountingContext.Transactions.Add(transaction);
            await _accountingContext.SaveChangesAsync();

            // Commit all or rollback all
            scope.Complete();
        }
        catch (Exception ex)
        {
            // Transaction automatically rolls back if scope.Complete() not called
            throw;
        }
    }
}
```

**Q: Handle deadlocks with retry logic.**

A: Detect and retry deadlock victims.

```csharp
public class DeadlockRetryService
{
    private const int MaxRetries = 3;
    private static readonly int[] DeadlockErrorNumbers = { 1205 }; // SQL Server deadlock

    public async Task<T> ExecuteWithRetryAsync<T>(Func<Task<T>> operation)
    {
        for (int attempt = 0; attempt < MaxRetries; attempt++)
        {
            try
            {
                return await operation();
            }
            catch (DbUpdateException ex) when (IsDeadlock(ex) && attempt < MaxRetries - 1)
            {
                var delay = TimeSpan.FromMilliseconds(Math.Pow(2, attempt) * 100);
                await Task.Delay(delay);
            }
        }

        return await operation(); // Last attempt without catching
    }

    private bool IsDeadlock(Exception ex)
    {
        if (ex.InnerException is SqlException sqlEx)
        {
            return DeadlockErrorNumbers.Contains(sqlEx.Number);
        }
        return false;
    }
}

// Usage
var result = await _retryService.ExecuteWithRetryAsync(async () =>
{
    await using var transaction = await _context.Database.BeginTransactionAsync(
        IsolationLevel.ReadCommitted);

    try
    {
        // Perform operations
        var account = await _context.Accounts.FindAsync(accountId);
        account.Balance += amount;

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return account.Balance;
    }
    catch
    {
        await transaction.RollbackAsync();
        throw;
    }
});
```

**Q: Implement pessimistic locking for critical sections.**

A: Use row-level locks to prevent concurrent modifications.

```csharp
// SQL Server
public async Task<Account> GetAccountWithLockAsync(Guid accountId)
{
    var account = await _context.Accounts
        .FromSqlRaw(@"
            SELECT * FROM Accounts WITH (UPDLOCK, ROWLOCK)
            WHERE Id = {0}",
            accountId)
        .FirstOrDefaultAsync();

    return account;
}

// PostgreSQL
public async Task<Account> GetAccountWithLockPgAsync(Guid accountId)
{
    var account = await _context.Accounts
        .FromSqlRaw(@"
            SELECT * FROM ""Accounts""
            WHERE ""Id"" = {0}
            FOR UPDATE",
            accountId)
        .FirstOrDefaultAsync();

    return account;
}

// Usage in transaction
await using var transaction = await _context.Database.BeginTransactionAsync();

try
{
    var account = await GetAccountWithLockAsync(accountId);
    account.Balance += amount;

    await _context.SaveChangesAsync();
    await transaction.CommitAsync();
}
catch
{
    await transaction.RollbackAsync();
    throw;
}
```

---

## Migrations & Schema Management

**Q: Create a data migration to transform existing records.**

A: Use migration with custom SQL or code.

```csharp
public partial class MigrateOrderStatuses : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // Add new column
        migrationBuilder.AddColumn<string>(
            name: "StatusV2",
            table: "Orders",
            type: "nvarchar(50)",
            nullable: true);

        // Migrate data
        migrationBuilder.Sql(@"
            UPDATE Orders
            SET StatusV2 = CASE Status
                WHEN 0 THEN 'Pending'
                WHEN 1 THEN 'Processing'
                WHEN 2 THEN 'Shipped'
                WHEN 3 THEN 'Delivered'
                WHEN 4 THEN 'Cancelled'
                ELSE 'Unknown'
            END");

        // Make new column required
        migrationBuilder.AlterColumn<string>(
            name: "StatusV2",
            table: "Orders",
            type: "nvarchar(50)",
            nullable: false);

        // Drop old column
        migrationBuilder.DropColumn(
            name: "Status",
            table: "Orders");

        // Rename column
        migrationBuilder.RenameColumn(
            name: "StatusV2",
            table: "Orders",
            newName: "Status");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        // Reverse migration
        migrationBuilder.RenameColumn(
            name: "Status",
            table: "Orders",
            newName: "StatusV2");

        migrationBuilder.AddColumn<int>(
            name: "Status",
            table: "Orders",
            type: "int",
            nullable: false,
            defaultValue: 0);

        migrationBuilder.Sql(@"
            UPDATE Orders
            SET Status = CASE StatusV2
                WHEN 'Pending' THEN 0
                WHEN 'Processing' THEN 1
                WHEN 'Shipped' THEN 2
                WHEN 'Delivered' THEN 3
                WHEN 'Cancelled' THEN 4
                ELSE 0
            END");

        migrationBuilder.DropColumn(
            name: "StatusV2",
            table: "Orders");
    }
}
```

**Q: Implement zero-downtime deployment with backward-compatible migrations.**

A: Use expand-contract pattern.

```csharp
// Step 1: Expand - Add new column (backward compatible)
public partial class AddEmailColumn : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(
            name: "Email",
            table: "Customers",
            nullable: true);  // Allow null for backward compatibility
    }
}

// Step 2: Deploy new code that writes to both old and new columns

// Step 3: Backfill - Migrate existing data
public partial class BackfillEmail : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(@"
            UPDATE Customers
            SET Email = ContactEmail
            WHERE Email IS NULL AND ContactEmail IS NOT NULL");
    }
}

// Step 4: Deploy code that reads from new column only

// Step 5: Contract - Remove old column
public partial class RemoveContactEmailColumn : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "ContactEmail",
            table: "Customers");

        // Make new column required
        migrationBuilder.AlterColumn<string>(
            name: "Email",
            table: "Customers",
            nullable: false);
    }
}
```

---

## Dapper Integration

**Q: Use Dapper for high-performance bulk operations.**

A: Execute raw SQL with minimal overhead.

```csharp
public class DapperOrderRepository
{
    private readonly IDbConnection _connection;

    public DapperOrderRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    public async Task<IEnumerable<Order>> GetOrdersByCustomerAsync(Guid customerId)
    {
        const string sql = @"
            SELECT o.OrderId, o.OrderNumber, o.CustomerId, o.TotalAmount, o.CreatedAt,
                   oi.OrderItemId, oi.OrderId, oi.ProductId, oi.Quantity, oi.UnitPrice
            FROM Orders o
            INNER JOIN OrderItems oi ON o.OrderId = oi.OrderId
            WHERE o.CustomerId = @CustomerId
            ORDER BY o.CreatedAt DESC";

        var orderDict = new Dictionary<Guid, Order>();

        var orders = await _connection.QueryAsync<Order, OrderItem, Order>(
            sql,
            (order, orderItem) =>
            {
                if (!orderDict.TryGetValue(order.OrderId, out var currentOrder))
                {
                    currentOrder = order;
                    currentOrder.Items = new List<OrderItem>();
                    orderDict.Add(order.OrderId, currentOrder);
                }

                currentOrder.Items.Add(orderItem);
                return currentOrder;
            },
            new { CustomerId = customerId },
            splitOn: "OrderItemId");

        return orderDict.Values;
    }

    public async Task<int> BulkInsertOrdersAsync(IEnumerable<Order> orders)
    {
        const string sql = @"
            INSERT INTO Orders (OrderId, OrderNumber, CustomerId, TotalAmount, CreatedAt)
            VALUES (@OrderId, @OrderNumber, @CustomerId, @TotalAmount, @CreatedAt)";

        return await _connection.ExecuteAsync(sql, orders);
    }

    public async Task<IEnumerable<OrderSummary>> GetOrderSummariesAsync(DateTime fromDate)
    {
        const string sql = @"
            SELECT c.CustomerName,
                   COUNT(o.OrderId) AS OrderCount,
                   SUM(o.TotalAmount) AS TotalSpent
            FROM Customers c
            INNER JOIN Orders o ON c.CustomerId = o.CustomerId
            WHERE o.CreatedAt >= @FromDate
            GROUP BY c.CustomerId, c.CustomerName
            HAVING SUM(o.TotalAmount) > 1000
            ORDER BY TotalSpent DESC";

        return await _connection.QueryAsync<OrderSummary>(sql, new { FromDate = fromDate });
    }

    public async Task<int> UpdateOrderStatusAsync(Guid orderId, string status)
    {
        const string sql = @"
            UPDATE Orders
            SET Status = @Status, ModifiedAt = GETUTCDATE()
            WHERE OrderId = @OrderId";

        return await _connection.ExecuteAsync(sql, new { OrderId = orderId, Status = status });
    }
}
```

**Q: Combine EF Core and Dapper for optimal performance.**

A: Use EF Core for writes, Dapper for complex reads.

```csharp
public class HybridOrderRepository
{
    private readonly TradingDbContext _context;
    private readonly IDbConnection _dapperConnection;

    public HybridOrderRepository(TradingDbContext context, IDbConnection dapperConnection)
    {
        _context = context;
        _dapperConnection = dapperConnection;
    }

    // Write with EF Core (change tracking, navigation properties)
    public async Task<Guid> CreateOrderAsync(Order order)
    {
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
        return order.Id;
    }

    // Complex read with Dapper (performance)
    public async Task<OrderAnalytics> GetOrderAnalyticsAsync(Guid customerId, DateTime fromDate)
    {
        const string sql = @"
            WITH OrderStats AS (
                SELECT o.CustomerId,
                       COUNT(DISTINCT o.OrderId) AS TotalOrders,
                       SUM(o.TotalAmount) AS TotalSpent,
                       AVG(o.TotalAmount) AS AvgOrderValue,
                       MIN(o.CreatedAt) AS FirstOrderDate,
                       MAX(o.CreatedAt) AS LastOrderDate
                FROM Orders o
                WHERE o.CustomerId = @CustomerId
                  AND o.CreatedAt >= @FromDate
                GROUP BY o.CustomerId
            ),
            ProductPreferences AS (
                SELECT TOP 5
                       p.ProductName,
                       SUM(oi.Quantity) AS TotalQuantity
                FROM Orders o
                INNER JOIN OrderItems oi ON o.OrderId = oi.OrderId
                INNER JOIN Products p ON oi.ProductId = p.ProductId
                WHERE o.CustomerId = @CustomerId
                  AND o.CreatedAt >= @FromDate
                GROUP BY p.ProductId, p.ProductName
                ORDER BY SUM(oi.Quantity) DESC
            )
            SELECT os.*, pp.ProductName, pp.TotalQuantity
            FROM OrderStats os
            CROSS APPLY (SELECT * FROM ProductPreferences) pp";

        var analytics = await _dapperConnection.QueryAsync(
            sql,
            new { CustomerId = customerId, FromDate = fromDate });

        return MapToOrderAnalytics(analytics);
    }
}
```

---

**Total Exercises: 30+**

Master data access patterns for building high-performance, scalable applications!
