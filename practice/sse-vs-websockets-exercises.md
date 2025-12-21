# SSE vs WebSockets - Practice Exercises

Exercises to choose and implement the right streaming transport.

---

## Foundations

**Q: What is the core difference between SSE and WebSockets?**

A: SSE is unidirectional (server to client) over HTTP, while WebSockets are full-duplex (bi-directional) over a persistent TCP connection.

---

**Q: When is SSE a better choice than WebSockets?**

A: When the client only needs server updates, such as price ticks, notifications, or progress streams. SSE is simpler and works well with standard HTTP infrastructure.

---

## Implementation Drill

**Q: Implement a simple SSE endpoint that streams prices every second.**

A:

```csharp
app.MapGet("/stream", async context =>
{
    context.Response.Headers.Append("Content-Type", "text/event-stream");
    context.Response.Headers.Append("Cache-Control", "no-cache");

    var ct = context.RequestAborted;
    while (!ct.IsCancellationRequested)
    {
        var price = new { Symbol = "EURUSD", Bid = 1.1021m, Ask = 1.1023m };
        await context.Response.WriteAsync($"data: {JsonSerializer.Serialize(price)}\n\n", ct);
        await context.Response.Body.FlushAsync(ct);
        await Task.Delay(TimeSpan.FromSeconds(1), ct);
    }
});
```

---

**Q: Add a heartbeat to keep SSE connections alive.**

A: Send a comment line every 15-30 seconds:

```csharp
await context.Response.WriteAsync(": ping\n\n", ct);
await context.Response.Body.FlushAsync(ct);
```

---

## Design Decisions

**Q: You need a trading terminal where clients submit orders and receive execution updates in real time. Which transport do you choose?**

A: WebSockets. The client needs bi-directional communication and low-latency interaction.

---

**Q: How do you scale WebSockets behind a load balancer?**

A: Use sticky sessions or a WebSocket-aware load balancer, keep connection state external (Redis), and design reconnect logic with session resumption.

---

## Troubleshooting

**Q: Your SSE stream stops after a few minutes in production. What do you check?**

A: Idle timeouts, proxies closing long-lived HTTP connections, missing heartbeat, and missing `Cache-Control: no-cache` or response buffering in reverse proxies.

---

**Total Exercises:** 8+
