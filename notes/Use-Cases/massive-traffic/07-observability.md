# Observability & Monitoring: Seeing What's Happening at Scale

## Why Observability is Critical

**The Problem:**
- At scale, you can't SSH into servers to debug
- Logs alone don't tell you what's slow or broken
- You need to see: traffic patterns, latency, errors, saturation

**Three Pillars of Observability:**
1. **Metrics** - What is happening? (RPS, latency, error rate)
2. **Logs** - What happened? (structured events with context)
3. **Traces** - Where is time spent? (distributed request tracking)

---

## 1. Structured Logging with Serilog

Stop using `Console.WriteLine`. Use structured logs with correlation IDs.

### Setup Serilog

```csharp
// Install: Serilog.AspNetCore, Serilog.Sinks.Console, Serilog.Sinks.File, Serilog.Sinks.Seq

// Program.cs
using Serilog;
using Serilog.Events;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .Enrich.WithMachineName()
    .Enrich.WithThreadId()
    .Enrich.WithProperty("Application", "OrderService")
    .WriteTo.Console(outputTemplate:
        "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}")
    .WriteTo.File(
        path: "logs/app-.log",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 7,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}"
    )
    .WriteTo.Seq("http://localhost:5341") // Centralized log aggregation
    .CreateLogger();

builder.Host.UseSerilog();

var app = builder.Build();

// Add request logging middleware
app.UseSerilogRequestLogging(options =>
{
    options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000}ms";
    options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
    {
        diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value);
        diagnosticContext.Set("UserAgent", httpContext.Request.Headers["User-Agent"].ToString());
        diagnosticContext.Set("UserId", httpContext.User.FindFirst("sub")?.Value);
    };
});

app.MapControllers();
app.Run();
```

### Structured Logging in Code

```csharp
public class OrderService
{
    private readonly ILogger<OrderService> _logger;

    public async Task<Order> CreateOrderAsync(CreateOrderRequest request, CancellationToken ct)
    {
        // ❌ Bad: String interpolation (not structured)
        _logger.LogInformation($"Creating order for user {request.UserId} with total {request.Total}");

        // ✅ Good: Structured logging with named properties
        _logger.LogInformation(
            "Creating order for user {UserId} with total {Total} and {ItemCount} items",
            request.UserId,
            request.Total,
            request.Items.Count
        );

        try
        {
            var order = await ProcessOrderAsync(request, ct);

            _logger.LogInformation(
                "Order {OrderId} created successfully for user {UserId}",
                order.Id,
                request.UserId
            );

            return order;
        }
        catch (OutOfStockException ex)
        {
            _logger.LogWarning(
                ex,
                "Order creation failed due to out of stock. User {UserId}, Product {ProductId}",
                request.UserId,
                ex.ProductId
            );
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Order creation failed for user {UserId}",
                request.UserId
            );
            throw;
        }
    }
}
```

### Correlation IDs for Request Tracking

```csharp
// Middleware to add correlation ID
public class CorrelationIdMiddleware
{
    private readonly RequestDelegate _next;
    private const string CorrelationIdHeader = "X-Correlation-ID";

    public async Task InvokeAsync(HttpContext context)
    {
        var correlationId = context.Request.Headers[CorrelationIdHeader].FirstOrDefault()
                            ?? Guid.NewGuid().ToString();

        context.Items["CorrelationId"] = correlationId;
        context.Response.Headers[CorrelationIdHeader] = correlationId;

        // Add to log context
        using (Serilog.Context.LogContext.PushProperty("CorrelationId", correlationId))
        {
            await _next(context);
        }
    }
}

// Register
app.UseMiddleware<CorrelationIdMiddleware>();

// Now all logs automatically include CorrelationId
// [15:23:45 INF] Creating order {UserId: 123, CorrelationId: "abc-123-def"}
```

---

## 2. Metrics with Prometheus & Grafana

Track system health in real-time: requests per second, latency, error rate.

### Setup Prometheus Metrics

```csharp
// Install: prometheus-net.AspNetCore

// Program.cs
using Prometheus;

builder.Services.AddControllers();

var app = builder.Build();

// Enable metrics endpoint
app.UseHttpMetrics(); // Track HTTP metrics automatically

// Expose /metrics endpoint
app.MapMetrics();

app.MapControllers();
app.Run();
```

### Custom Metrics

```csharp
using Prometheus;

public class OrderMetrics
{
    // Counter: monotonically increasing (total orders)
    public static readonly Counter OrdersCreated = Metrics.CreateCounter(
        "orders_created_total",
        "Total number of orders created",
        new CounterConfiguration
        {
            LabelNames = new[] { "status", "payment_method" }
        }
    );

    // Gauge: value that can go up and down (queue depth)
    public static readonly Gauge QueueDepth = Metrics.CreateGauge(
        "order_queue_depth",
        "Current depth of order processing queue"
    );

    // Histogram: distribution of values (latency)
    public static readonly Histogram OrderProcessingDuration = Metrics.CreateHistogram(
        "order_processing_duration_seconds",
        "Duration of order processing in seconds",
        new HistogramConfiguration
        {
            LabelNames = new[] { "order_type" },
            Buckets = Histogram.ExponentialBuckets(0.01, 2, 10) // 10ms to 5s
        }
    );

    // Summary: like histogram but calculates percentiles
    public static readonly Summary PaymentProcessingDuration = Metrics.CreateSummary(
        "payment_processing_duration_seconds",
        "Duration of payment processing",
        new SummaryConfiguration
        {
            Objectives = new[]
            {
                new QuantileEpsilonPair(0.5, 0.05),  // p50
                new QuantileEpsilonPair(0.95, 0.01), // p95
                new QuantileEpsilonPair(0.99, 0.01)  // p99
            }
        }
    );
}

public class OrderService
{
    public async Task<Order> CreateOrderAsync(CreateOrderRequest request, CancellationToken ct)
    {
        // Track latency
        using (OrderMetrics.OrderProcessingDuration.Labels("standard").NewTimer())
        {
            var order = await ProcessOrderAsync(request, ct);

            // Increment counter
            OrderMetrics.OrdersCreated.Labels(
                status: order.Status,
                payment_method: request.PaymentMethod
            ).Inc();

            return order;
        }
    }

    public void UpdateQueueDepth(int depth)
    {
        OrderMetrics.QueueDepth.Set(depth);
    }
}
```

### Key Metrics to Track

```csharp
public static class ApplicationMetrics
{
    // RED method: Rate, Errors, Duration
    public static readonly Counter RequestsTotal = Metrics.CreateCounter(
        "http_requests_total",
        "Total HTTP requests",
        new CounterConfiguration { LabelNames = new[] { "method", "endpoint", "status" } }
    );

    public static readonly Histogram RequestDuration = Metrics.CreateHistogram(
        "http_request_duration_seconds",
        "HTTP request duration",
        new HistogramConfiguration
        {
            LabelNames = new[] { "method", "endpoint" },
            Buckets = Histogram.ExponentialBuckets(0.001, 2, 15) // 1ms to 16s
        }
    );

    public static readonly Counter ErrorsTotal = Metrics.CreateCounter(
        "errors_total",
        "Total errors",
        new CounterConfiguration { LabelNames = new[] { "type", "endpoint" } }
    );

    // USE method: Utilization, Saturation, Errors
    public static readonly Gauge ThreadPoolAvailableThreads = Metrics.CreateGauge(
        "threadpool_available_threads",
        "Available thread pool threads"
    );

    public static readonly Gauge MemoryUsageBytes = Metrics.CreateGauge(
        "memory_usage_bytes",
        "Memory usage in bytes"
    );

    public static readonly Gauge CpuUsagePercent = Metrics.CreateGauge(
        "cpu_usage_percent",
        "CPU usage percentage"
    );

    // Database
    public static readonly Gauge DatabaseConnectionPoolActive = Metrics.CreateGauge(
        "database_connection_pool_active",
        "Active database connections"
    );

    public static readonly Counter DatabaseQueriesTotal = Metrics.CreateCounter(
        "database_queries_total",
        "Total database queries",
        new CounterConfiguration { LabelNames = new[] { "query_type", "table" } }
    );

    public static readonly Histogram DatabaseQueryDuration = Metrics.CreateHistogram(
        "database_query_duration_seconds",
        "Database query duration"
    );

    // Cache
    public static readonly Counter CacheHitsTotal = Metrics.CreateCounter(
        "cache_hits_total",
        "Total cache hits",
        new CounterConfiguration { LabelNames = new[] { "cache_type" } }
    );

    public static readonly Counter CacheMissesTotal = Metrics.CreateCounter(
        "cache_misses_total",
        "Total cache misses",
        new CounterConfiguration { LabelNames = new[] { "cache_type" } }
    );
}
```

### Background Service for System Metrics

```csharp
public class SystemMetricsCollector : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                // Thread pool metrics
                ThreadPool.GetAvailableThreads(out var availableWorker, out var availableIO);
                ApplicationMetrics.ThreadPoolAvailableThreads.Set(availableWorker);

                // Memory metrics
                var memoryUsed = GC.GetTotalMemory(forceFullCollection: false);
                ApplicationMetrics.MemoryUsageBytes.Set(memoryUsed);

                // CPU metrics (requires System.Diagnostics.PerformanceCounter or Process)
                var process = Process.GetCurrentProcess();
                var cpuUsage = process.TotalProcessorTime.TotalMilliseconds /
                               (Environment.ProcessorCount * process.TotalProcessorTime.TotalMilliseconds) * 100;
                ApplicationMetrics.CpuUsagePercent.Set(cpuUsage);

                await Task.Delay(TimeSpan.FromSeconds(15), stoppingToken);
            }
            catch (Exception ex)
            {
                // Log but don't crash
                Console.WriteLine($"Error collecting system metrics: {ex.Message}");
            }
        }
    }
}

// Register
builder.Services.AddHostedService<SystemMetricsCollector>();
```

---

## 3. Distributed Tracing with OpenTelemetry

Track requests across multiple services (microservices, databases, queues).

### Setup OpenTelemetry

```csharp
// Install: OpenTelemetry.Exporter.Console, OpenTelemetry.Exporter.Jaeger,
//          OpenTelemetry.Instrumentation.AspNetCore, OpenTelemetry.Instrumentation.Http,
//          OpenTelemetry.Instrumentation.SqlClient

using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

builder.Services.AddOpenTelemetry()
    .ConfigureResource(resource => resource.AddService("OrderService"))
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation(options =>
        {
            options.RecordException = true;
            options.EnrichWithHttpRequest = (activity, request) =>
            {
                activity.SetTag("user_id", request.HttpContext.User.FindFirst("sub")?.Value);
            };
        })
        .AddHttpClientInstrumentation(options =>
        {
            options.RecordException = true;
        })
        .AddSqlClientInstrumentation(options =>
        {
            options.SetDbStatementForText = true;
            options.RecordException = true;
        })
        .AddSource("OrderService")
        .AddConsoleExporter()
        .AddJaegerExporter(options =>
        {
            options.AgentHost = "localhost";
            options.AgentPort = 6831;
        })
    );
```

### Manual Instrumentation

```csharp
using System.Diagnostics;

public class OrderService
{
    private static readonly ActivitySource ActivitySource = new("OrderService");
    private readonly ILogger<OrderService> _logger;

    public async Task<Order> CreateOrderAsync(CreateOrderRequest request, CancellationToken ct)
    {
        // Create custom span
        using var activity = ActivitySource.StartActivity("CreateOrder", ActivityKind.Server);
        activity?.SetTag("order.user_id", request.UserId);
        activity?.SetTag("order.total", request.Total);
        activity?.SetTag("order.item_count", request.Items.Count);

        try
        {
            // Child span for validation
            using (var validationActivity = ActivitySource.StartActivity("ValidateOrder"))
            {
                await ValidateOrderAsync(request, ct);
            }

            // Child span for payment
            using (var paymentActivity = ActivitySource.StartActivity("ProcessPayment"))
            {
                await ProcessPaymentAsync(request, ct);
                paymentActivity?.SetTag("payment.method", request.PaymentMethod);
            }

            // Child span for database
            using (var dbActivity = ActivitySource.StartActivity("SaveOrder"))
            {
                var order = await SaveOrderToDbAsync(request, ct);
                dbActivity?.SetTag("order.id", order.Id);

                activity?.SetTag("order.id", order.Id);
                activity?.SetStatus(ActivityStatusCode.Ok);

                return order;
            }
        }
        catch (Exception ex)
        {
            activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
            activity?.RecordException(ex);
            throw;
        }
    }
}
```

**What you get:**
- Request flows across services visualized
- Slow operations identified (e.g., "payment service took 2s")
- Error propagation tracked

---

## 4. Application Performance Monitoring (APM)

For production, use a full APM solution.

### Setup Application Insights (Azure)

```csharp
// Install: Microsoft.ApplicationInsights.AspNetCore

builder.Services.AddApplicationInsightsTelemetry(options =>
{
    options.ConnectionString = builder.Configuration["ApplicationInsights:ConnectionString"];
    options.EnableAdaptiveSampling = true; // Sample at high traffic
});

// Track custom events
public class OrderService
{
    private readonly TelemetryClient _telemetry;

    public async Task<Order> CreateOrderAsync(CreateOrderRequest request, CancellationToken ct)
    {
        var stopwatch = Stopwatch.StartNew();

        try
        {
            var order = await ProcessOrderAsync(request, ct);

            // Track custom metric
            _telemetry.TrackMetric("OrderValue", request.Total);

            // Track custom event
            _telemetry.TrackEvent("OrderCreated", new Dictionary<string, string>
            {
                { "OrderId", order.Id.ToString() },
                { "UserId", request.UserId.ToString() },
                { "PaymentMethod", request.PaymentMethod }
            });

            stopwatch.Stop();
            _telemetry.TrackMetric("OrderProcessingTime", stopwatch.ElapsedMilliseconds);

            return order;
        }
        catch (Exception ex)
        {
            _telemetry.TrackException(ex, new Dictionary<string, string>
            {
                { "UserId", request.UserId.ToString() },
                { "Total", request.Total.ToString() }
            });
            throw;
        }
    }
}
```

---

## 5. Alerting: Know When Things Break

### Prometheus Alerting Rules

```yaml
# prometheus-alerts.yml
groups:
  - name: api_alerts
    interval: 30s
    rules:
      # High error rate
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors/sec"

      # High latency
      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High latency detected"
          description: "p95 latency is {{ $value }}s"

      # Database connection pool exhaustion
      - alert: DatabaseConnectionPoolExhausted
        expr: database_connection_pool_active / database_connection_pool_max > 0.9
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "Database connection pool nearly exhausted"

      # Queue depth growing
      - alert: QueueDepthGrowing
        expr: delta(order_queue_depth[5m]) > 1000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Order queue depth growing rapidly"
```

---

## 6. Dashboards: Visualize System Health

### Grafana Dashboard (Key Panels)

```json
{
  "dashboard": {
    "title": "Order Service Dashboard",
    "panels": [
      {
        "title": "Requests per Second",
        "targets": [
          {
            "expr": "rate(http_requests_total[1m])"
          }
        ]
      },
      {
        "title": "Latency (p50, p95, p99)",
        "targets": [
          {
            "expr": "histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "p50"
          },
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "p95"
          },
          {
            "expr": "histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "p99"
          }
        ]
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])"
          }
        ]
      },
      {
        "title": "Cache Hit Rate",
        "targets": [
          {
            "expr": "rate(cache_hits_total[5m]) / (rate(cache_hits_total[5m]) + rate(cache_misses_total[5m]))"
          }
        ]
      }
    ]
  }
}
```

---

## Summary: Observability Checklist

✅ **Structured logging**: Serilog with correlation IDs
✅ **Metrics**: Prometheus with RED (Rate, Errors, Duration) and USE (Utilization, Saturation, Errors)
✅ **Distributed tracing**: OpenTelemetry across services
✅ **APM tool**: Application Insights, Datadog, or New Relic
✅ **Alerting**: Critical alerts for error rate, latency, saturation
✅ **Dashboards**: Real-time visualization of system health
✅ **Log aggregation**: Centralized logs (Seq, Elasticsearch, Splunk)

**Key Metrics to Always Track:**
1. **Request rate** (requests per second)
2. **Error rate** (errors per second, percentage)
3. **Latency** (p50, p95, p99)
4. **Saturation** (CPU, memory, thread pool, DB connections, queue depth)

**The Golden Signals (Google SRE):**
- **Latency**: How long requests take
- **Traffic**: How many requests
- **Errors**: Rate of failed requests
- **Saturation**: How "full" your system is

**Next:** [Complete Example Application](./08-complete-example.md) - Putting it all together in a real-world example.
