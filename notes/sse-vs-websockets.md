# Server-Sent Events vs WebSockets - Streaming Trade-offs

> SSE is one-way (server to client) over HTTP; WebSockets are two-way for low-latency interaction.

---

## Quick Overview

- **SSE:** Unidirectional (server to client), text-only, runs over HTTP.
- **WebSockets:** Bi-directional, full-duplex, supports binary and text.
- **SSE is simpler:** Works through proxies and load balancers with minimal setup.
- **WebSockets are powerful:** Best for interactive, low-latency apps.
- **Trading example:** Use SSE for price tick streams; use WebSockets for trading terminals with bidirectional commands.

---

## Detailed Explanation

### Server-Sent Events (SSE)

**What it is:** A long-lived HTTP response that streams events to the client.

**Strengths:**
- Simple HTTP-based streaming
- Automatic reconnect support in browsers
- Works well with HTTP/2 and standard infrastructure

**Constraints:**
- Server to client only
- Text-only payloads (JSON is common)

**C# example (ASP.NET Core):**

```csharp
app.MapGet("/prices/stream", async context =>
{
    context.Response.Headers.Append("Content-Type", "text/event-stream");
    context.Response.Headers.Append("Cache-Control", "no-cache");

    var ct = context.RequestAborted;
    while (!ct.IsCancellationRequested)
    {
        var tick = new { Symbol = "EURUSD", Bid = 1.0912m, Ask = 1.0914m };
        await context.Response.WriteAsync($"data: {JsonSerializer.Serialize(tick)}\n\n", ct);
        await context.Response.Body.FlushAsync(ct);
        await Task.Delay(TimeSpan.FromSeconds(1), ct);
    }
});
```

---

### WebSockets

**What it is:** A persistent TCP connection that allows full-duplex messaging.

**Strengths:**
- Bi-directional communication
- Low latency for interactive workflows
- Supports binary payloads

**Constraints:**
- More complex to scale and debug
- Requires explicit reconnection logic

**C# example (ASP.NET Core):**

```csharp
app.UseWebSockets();

app.Map("/ws", async context =>
{
    if (!context.WebSockets.IsWebSocketRequest)
    {
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
        return;
    }

    using var socket = await context.WebSockets.AcceptWebSocketAsync();
    var buffer = new byte[4096];

    while (true)
    {
        var result = await socket.ReceiveAsync(buffer, CancellationToken.None);
        if (result.MessageType == WebSocketMessageType.Close)
            break;

        await socket.SendAsync(buffer.AsMemory(0, result.Count), result.MessageType, result.EndOfMessage, CancellationToken.None);
    }

    await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Done", CancellationToken.None);
});
```

---

## Comparison Snapshot

| Topic | SSE | WebSockets |
| --- | --- | --- |
| Direction | Server to client | Bi-directional |
| Transport | HTTP | TCP (upgrade from HTTP) |
| Payload | Text (UTF-8) | Text or binary |
| Reconnect | Built-in (browser) | Manual |
| Best for | Streams, notifications | Interactive apps, trading terminals |

---

## Why It Matters for Interviews

- You can justify **when a simpler transport is enough** (SSE) vs when you need full-duplex.
- You can discuss **scaling constraints** (sticky sessions, backpressure, fan-out).
- You can tie decisions to **latency and operational complexity**.

---

## Common Pitfalls

- Using WebSockets for unidirectional updates where SSE is simpler.
- Forgetting heartbeats/pings and idle timeouts.
- Not handling reconnection or replay (event IDs) for SSE.
- Sending large payloads without backpressure control.

---

## Quick Reference

- **SSE:** Unidirectional, HTTP, easy to deploy, great for streaming data.
- **WebSockets:** Bi-directional, low latency, best for interactive workflows.

---

## Sample Interview Q&A

- **Q:** When would you choose SSE over WebSockets?
  - **A:** For server-to-client streams like price ticks or notifications where clients do not need to send frequent messages back.

- **Q:** How do you handle reconnects with SSE?
  - **A:** Use event IDs and allow clients to send `Last-Event-ID` so the server can replay missed data.

- **Q:** What is the biggest operational challenge with WebSockets?
  - **A:** Scaling long-lived connections (load balancers, sticky sessions) and handling reconnects on network churn.
