# Database Optimization & Scaling for High-Traffic Systems

## Why Database Performance Matters

**The Reality:**
- Most applications are database-bound, not CPU-bound
- A single slow query can bring down your entire system
- At scale, every millisecond of query time costs money

**The Goal:** Make database the "cold path" (via caching), and when you do hit it, make it fast.

---

## 1. Indexing: The Foundation of Fast Queries

### The Problem: Missing Indexes

```sql
-- SLOW: Full table scan on 10 million rows
SELECT * FROM Orders
WHERE UserId = 12345
  AND Status = 'Pending'
  AND CreatedAt > '2024-01-01';

-- Execution plan shows: Table Scan (cost: 10,000,000)
```

### The Solution: Composite Indexes

```sql
-- Create covering index (index contains all needed columns)
CREATE NONCLUSTERED INDEX IX_Orders_UserId_Status_CreatedAt
ON Orders (UserId, Status, CreatedAt)
INCLUDE (OrderTotal, ShippingAddress); -- Add frequently selected columns

-- Now query uses index seek (cost: 10)
```

### C# Code: Ensure Queries Use Indexes

```csharp
public class OrderRepository
{
    private readonly IDbConnection _db;

    // ✅ GOOD: Query aligns with index
    public async Task<IEnumerable<Order>> GetPendingOrdersAsync(
        int userId,
        DateTime since,
        CancellationToken ct)
    {
        // Uses index: IX_Orders_UserId_Status_CreatedAt
        return await _db.QueryAsync<Order>(new CommandDefinition(
            commandText: @"
                SELECT OrderId, UserId, Status, CreatedAt, OrderTotal, ShippingAddress
                FROM Orders
                WHERE UserId = @UserId
                  AND Status = @Status
                  AND CreatedAt > @Since
                ORDER BY CreatedAt DESC",
            parameters: new { UserId = userId, Status = "Pending", Since = since },
            cancellationToken: ct
        ));
    }

    // ❌ BAD: Function in WHERE prevents index usage
    public async Task<IEnumerable<Order>> GetOrdersByDateBad(DateTime date)
    {
        // Index not used because of CONVERT function
        return await _db.QueryAsync<Order>(@"
            SELECT * FROM Orders
            WHERE CONVERT(DATE, CreatedAt) = @Date",
            new { Date = date }
        );
    }

    // ✅ GOOD: Query structure allows index usage
    public async Task<IEnumerable<Order>> GetOrdersByDateGood(DateTime date)
    {
        var startOfDay = date.Date;
        var endOfDay = date.Date.AddDays(1);

        // Index can be used with range
        return await _db.QueryAsync<Order>(@"
            SELECT * FROM Orders
            WHERE CreatedAt >= @Start AND CreatedAt < @End",
            new { Start = startOfDay, End = endOfDay }
        );
    }
}
```

### Index Strategy Rules

1. **Column order matters:** Most selective column first
   ```sql
   -- GOOD: UserId is highly selective (filters to one user)
   CREATE INDEX IX_Orders ON Orders (UserId, Status, CreatedAt);

   -- BAD: Status has low selectivity (only a few values)
   CREATE INDEX IX_Orders_Bad ON Orders (Status, UserId, CreatedAt);
   ```

2. **Include frequently selected columns** to avoid lookups
3. **Don't over-index:** Every index slows writes (INSERT/UPDATE/DELETE)
4. **Monitor index usage:**
   ```sql
   -- Find unused indexes
   SELECT
       OBJECT_NAME(i.object_id) AS TableName,
       i.name AS IndexName,
       s.user_seeks,
       s.user_scans,
       s.user_updates
   FROM sys.indexes i
   LEFT JOIN sys.dm_db_index_usage_stats s
       ON i.object_id = s.object_id AND i.index_id = s.index_id
   WHERE s.user_seeks = 0
     AND s.user_scans = 0
     AND s.user_updates > 0; -- Written to but never read
   ```

---

## 2. Avoid N+1 Query Problem

### ❌ The Problem

```csharp
// Loads 1 query for users, then 1 query per user for orders = N+1 queries
public async Task<List<UserWithOrders>> GetUsersWithOrdersBad(CancellationToken ct)
{
    var users = await _db.QueryAsync<User>("SELECT * FROM Users");

    var result = new List<UserWithOrders>();
    foreach (var user in users) // N iterations
    {
        // 🔥 1 query per user!
        var orders = await _db.QueryAsync<Order>(
            "SELECT * FROM Orders WHERE UserId = @UserId",
            new { UserId = user.Id }
        );

        result.Add(new UserWithOrders { User = user, Orders = orders.ToList() });
    }

    return result;
}
// 1 + N queries for N users = 1,001 queries for 1,000 users
```

### ✅ Solution 1: Join in SQL

```csharp
public async Task<List<UserWithOrders>> GetUsersWithOrdersJoin(CancellationToken ct)
{
    var sql = @"
        SELECT
            u.Id, u.Name, u.Email,
            o.OrderId, o.UserId, o.OrderTotal, o.CreatedAt
        FROM Users u
        LEFT JOIN Orders o ON u.Id = o.UserId";

    var userDictionary = new Dictionary<int, UserWithOrders>();

    await _db.QueryAsync<User, Order, UserWithOrders>(
        sql,
        (user, order) =>
        {
            if (!userDictionary.TryGetValue(user.Id, out var userWithOrders))
            {
                userWithOrders = new UserWithOrders { User = user, Orders = new List<Order>() };
                userDictionary.Add(user.Id, userWithOrders);
            }

            if (order != null)
            {
                userWithOrders.Orders.Add(order);
            }

            return userWithOrders;
        },
        splitOn: "OrderId"
    );

    return userDictionary.Values.ToList();
}
// 1 query total
```

### ✅ Solution 2: Batch Load (when JOIN is impractical)

```csharp
public async Task<List<UserWithOrders>> GetUsersWithOrdersBatched(CancellationToken ct)
{
    // 1 query: get all users
    var users = (await _db.QueryAsync<User>("SELECT * FROM Users")).ToList();

    var userIds = users.Select(u => u.Id).ToList();

    // 2nd query: get all orders for these users in one query
    var orders = (await _db.QueryAsync<Order>(
        "SELECT * FROM Orders WHERE UserId IN @UserIds",
        new { UserIds = userIds }
    )).ToList();

    // Group in memory
    var ordersByUser = orders.GroupBy(o => o.UserId).ToDictionary(g => g.Key, g => g.ToList());

    return users.Select(u => new UserWithOrders
    {
        User = u,
        Orders = ordersByUser.GetValueOrDefault(u.Id, new List<Order>())
    }).ToList();
}
// 2 queries total, regardless of number of users
```

### EF Core: Use Include to avoid N+1

```csharp
public async Task<List<User>> GetUsersWithOrdersEFCore(CancellationToken ct)
{
    return await _dbContext.Users
        .Include(u => u.Orders) // Single query with JOIN
        .ToListAsync(ct);
}

// For deep graphs, use ThenInclude
public async Task<List<Order>> GetOrdersWithDetailsEFCore(CancellationToken ct)
{
    return await _dbContext.Orders
        .Include(o => o.User)
        .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
        .ToListAsync(ct);
}
```

---

## 3. Pagination: Never Use OFFSET for Large Tables

### ❌ Bad: OFFSET (gets slower as offset increases)

```csharp
// Page 1,000 of 10,000,000 records = scans 1,000,000 rows
public async Task<PagedResult<Order>> GetOrdersOffset(int page, int pageSize, CancellationToken ct)
{
    var offset = (page - 1) * pageSize;

    var orders = await _db.QueryAsync<Order>(@"
        SELECT * FROM Orders
        ORDER BY CreatedAt DESC
        OFFSET @Offset ROWS
        FETCH NEXT @PageSize ROWS ONLY",
        new { Offset = offset, PageSize = pageSize }
    );

    var total = await _db.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM Orders");

    return new PagedResult<Order>
    {
        Items = orders.ToList(),
        TotalCount = total,
        Page = page,
        PageSize = pageSize
    };
}
// Performance degrades linearly with page number
```

### ✅ Good: Keyset Pagination (Seek Method)

```csharp
public async Task<PagedResult<Order>> GetOrdersKeyset(
    DateTime? lastCreatedAt,
    int? lastOrderId,
    int pageSize,
    CancellationToken ct)
{
    var sql = lastCreatedAt == null
        ? @"SELECT TOP(@PageSize) * FROM Orders ORDER BY CreatedAt DESC, OrderId DESC"
        : @"SELECT TOP(@PageSize) * FROM Orders
           WHERE CreatedAt < @LastCreatedAt
              OR (CreatedAt = @LastCreatedAt AND OrderId < @LastOrderId)
           ORDER BY CreatedAt DESC, OrderId DESC";

    var orders = await _db.QueryAsync<Order>(sql, new
    {
        PageSize = pageSize,
        LastCreatedAt = lastCreatedAt,
        LastOrderId = lastOrderId
    });

    var ordersList = orders.ToList();

    return new PagedResult<Order>
    {
        Items = ordersList,
        PageSize = pageSize,
        // Return cursor for next page
        NextCursor = ordersList.Count > 0
            ? new { ordersList.Last().CreatedAt, ordersList.Last().OrderId }
            : null
    };
}
// Consistent performance regardless of position in dataset
```

**Why keyset pagination:**
- Constant performance (no OFFSET scan)
- Works for infinite scroll
- Handles concurrent writes (no missing/duplicate items)

---

## 4. Connection Pooling & Management

### Configure Connection Pool

```csharp
// appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=myserver;Database=mydb;User Id=user;Password=pass;
                          Min Pool Size=10;
                          Max Pool Size=100;
                          Connection Lifetime=300;
                          Connection Timeout=30;
                          Pooling=true;"
  }
}
```

### Pool Size Guidelines

```csharp
// Rule of thumb: Max Pool Size = (Number of CPU cores * 2) + effective spindle count
// For cloud databases with connection limits:

public static class DatabaseConfig
{
    public static int CalculateMaxPoolSize(int maxConnections, int instanceCount)
    {
        // Leave 20% headroom for admin connections, background jobs
        var usableConnections = (int)(maxConnections * 0.8);

        // Divide among instances
        return usableConnections / instanceCount;
    }
}

// Example:
// RDS PostgreSQL max_connections = 100
// Running 4 instances
// Max pool size per instance = (100 * 0.8) / 4 = 20 connections
```

### Monitor Connection Pool

```csharp
public class DatabaseHealthCheck : IHealthCheck
{
    private readonly IDbConnection _db;

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken ct = default)
    {
        try
        {
            await _db.ExecuteScalarAsync<int>("SELECT 1", cancellationToken: ct);

            // For SqlConnection, check pool stats
            if (_db is SqlConnection sqlConn)
            {
                SqlConnection.ClearPool(sqlConn); // Only for diagnostics, not production
            }

            return HealthCheckResult.Healthy("Database is reachable");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Database is unreachable", ex);
        }
    }
}
```

---

## 5. Read Replicas for Read-Heavy Workloads

### Setup Multi-Database Routing

```csharp
public enum DatabaseRole
{
    Primary,
    Replica
}

public interface IDatabaseConnectionFactory
{
    IDbConnection CreateConnection(DatabaseRole role);
}

public class DatabaseConnectionFactory : IDatabaseConnectionFactory
{
    private readonly IConfiguration _config;

    public IDbConnection CreateConnection(DatabaseRole role)
    {
        var connectionString = role == DatabaseRole.Primary
            ? _config.GetConnectionString("Primary")
            : _config.GetConnectionString("Replica");

        return new SqlConnection(connectionString);
    }
}

// Repository with read/write separation
public class OrderRepository
{
    private readonly IDatabaseConnectionFactory _dbFactory;

    // Read from replica
    public async Task<Order> GetOrderAsync(int orderId, CancellationToken ct)
    {
        using var db = _dbFactory.CreateConnection(DatabaseRole.Replica);
        return await db.QueryFirstOrDefaultAsync<Order>(
            "SELECT * FROM Orders WHERE OrderId = @OrderId",
            new { OrderId = orderId }
        );
    }

    // Write to primary
    public async Task<int> CreateOrderAsync(Order order, CancellationToken ct)
    {
        using var db = _dbFactory.CreateConnection(DatabaseRole.Primary);
        return await db.ExecuteAsync(@"
            INSERT INTO Orders (UserId, OrderTotal, Status, CreatedAt)
            VALUES (@UserId, @OrderTotal, @Status, @CreatedAt)",
            order
        );
    }
}
```

### Handle Replication Lag

```csharp
public class ReplicationAwareRepository
{
    private readonly IDatabaseConnectionFactory _dbFactory;

    // After write, read from primary for consistency
    public async Task<Order> CreateAndGetOrderAsync(Order order, CancellationToken ct)
    {
        using var db = _dbFactory.CreateConnection(DatabaseRole.Primary);

        var orderId = await db.QuerySingleAsync<int>(@"
            INSERT INTO Orders (UserId, OrderTotal, Status, CreatedAt)
            OUTPUT INSERTED.OrderId
            VALUES (@UserId, @OrderTotal, @Status, @CreatedAt)",
            order
        );

        // Read from same connection (primary) to avoid replication lag
        return await db.QueryFirstAsync<Order>(
            "SELECT * FROM Orders WHERE OrderId = @OrderId",
            new { OrderId = orderId }
        );
    }

    // For eventual consistency scenarios
    public async Task<Order?> GetOrderWithRetryAsync(int orderId, CancellationToken ct)
    {
        for (int attempt = 0; attempt < 3; attempt++)
        {
            using var db = _dbFactory.CreateConnection(DatabaseRole.Replica);
            var order = await db.QueryFirstOrDefaultAsync<Order>(
                "SELECT * FROM Orders WHERE OrderId = @OrderId",
                new { OrderId = orderId }
            );

            if (order != null)
                return order;

            // Wait for replication
            await Task.Delay(TimeSpan.FromMilliseconds(100), ct);
        }

        // Fall back to primary if still not found
        using var primaryDb = _dbFactory.CreateConnection(DatabaseRole.Primary);
        return await primaryDb.QueryFirstOrDefaultAsync<Order>(
            "SELECT * FROM Orders WHERE OrderId = @OrderId",
            new { OrderId = orderId }
        );
    }
}
```

---

## 6. Database Partitioning/Sharding

### Horizontal Partitioning (Sharding by User ID)

```csharp
public interface IShardingStrategy
{
    int GetShardId(int userId);
    IDbConnection GetConnection(int shardId);
}

public class UserIdShardingStrategy : IShardingStrategy
{
    private readonly IConfiguration _config;
    private readonly int _shardCount;

    public UserIdShardingStrategy(IConfiguration config)
    {
        _config = config;
        _shardCount = _config.GetValue<int>("Sharding:ShardCount");
    }

    public int GetShardId(int userId)
    {
        // Consistent hashing
        return userId % _shardCount;
    }

    public IDbConnection GetConnection(int shardId)
    {
        var connectionString = _config.GetConnectionString($"Shard{shardId}");
        return new SqlConnection(connectionString);
    }
}

public class ShardedOrderRepository
{
    private readonly IShardingStrategy _sharding;

    // All queries must include userId for shard routing
    public async Task<IEnumerable<Order>> GetUserOrdersAsync(
        int userId,
        CancellationToken ct)
    {
        var shardId = _sharding.GetShardId(userId);
        using var db = _sharding.GetConnection(shardId);

        return await db.QueryAsync<Order>(
            "SELECT * FROM Orders WHERE UserId = @UserId",
            new { UserId = userId }
        );
    }

    // Cross-shard queries require scatter-gather
    public async Task<int> GetTotalOrderCountAsync(CancellationToken ct)
    {
        var tasks = new List<Task<int>>();

        for (int shardId = 0; shardId < _sharding.ShardCount; shardId++)
        {
            var shard = shardId; // Capture for closure
            tasks.Add(Task.Run(async () =>
            {
                using var db = _sharding.GetConnection(shard);
                return await db.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM Orders");
            }, ct));
        }

        var results = await Task.WhenAll(tasks);
        return results.Sum();
    }
}
```

**Warning:** Sharding adds complexity. Only shard when:
- Single database can't handle the load
- Data naturally partitions (by user, tenant, region)
- You've exhausted vertical scaling and read replicas

---

## 7. Query Optimization Techniques

### Use Compiled Queries (EF Core)

```csharp
public class OrderQueries
{
    // Compiled query: parsed once, executed many times
    private static readonly Func<AppDbContext, int, Task<Order?>> _getOrderById =
        EF.CompileAsyncQuery((AppDbContext db, int orderId) =>
            db.Orders.FirstOrDefault(o => o.OrderId == orderId));

    public async Task<Order?> GetOrderAsync(AppDbContext db, int orderId)
    {
        return await _getOrderById(db, orderId);
    }
}
```

### Use AsNoTracking for Read-Only Queries

```csharp
// ❌ Bad: Change tracking overhead for read-only data
var orders = await _dbContext.Orders.ToListAsync();

// ✅ Good: No tracking = faster
var orders = await _dbContext.Orders.AsNoTracking().ToListAsync();
```

### Project Only Needed Columns

```csharp
// ❌ Bad: Selects all columns, loads entire object graph
var users = await _dbContext.Users
    .Include(u => u.Orders)
    .Include(u => u.Addresses)
    .ToListAsync();

// ✅ Good: Project to DTO with only needed data
var users = await _dbContext.Users
    .Select(u => new UserSummaryDto
    {
        Id = u.Id,
        Name = u.Name,
        OrderCount = u.Orders.Count
    })
    .ToListAsync();
```

---

## Summary: Database Scaling Checklist

✅ **Proper indexes**: Composite indexes aligned with query patterns
✅ **Avoid N+1**: Use JOINs or batch loading
✅ **Keyset pagination**: For large datasets
✅ **Connection pooling**: Tune pool size for your workload
✅ **Read replicas**: For read-heavy workloads
✅ **Sharding**: Only when necessary, with clear partition key
✅ **Query optimization**: Compiled queries, AsNoTracking, projection
✅ **Monitor**: Slow query log, index usage, connection pool stats

**Key Insight:** Most performance problems are query problems. Indexing, N+1 elimination, and proper pagination solve 90% of database issues.

**Next:** [Message Queues & Async Processing](./05-message-queues.md) - Decouple heavy work from request/response cycle.
