# RabbitMQ Deep Dive (Interview & On-Call Ready)

## What RabbitMQ Is For
- **Brokered messaging** with rich routing (direct, fanout, topic, headers) and per-message acknowledgements.
- Excellent for **work queues**, **event fan-out**, **request/response over AMQP**, and **asynchronous integration** between services.
- Shines when you need **durability** (persisted queues/exchanges), **flow control** (prefetch/QoS), and **operational tooling** (management UI/CLI).

## Core Building Blocks
- **Exchanges** route messages to queues based on type:
  - *Direct:* Exact routing key match (work queues, point-to-point commands).
  - *Topic:* Pattern-based routing with wildcards; great for multi-tenant/event streams (e.g., `trades.usd.nyse`).
  - *Fanout:* Broadcast to all bound queues (cache invalidation, notifications).
  - *Headers:* Route via headers (rare; use when routing key isn’t enough).
- **Queues** hold messages; define durability and exclusivity per use case.
- **Bindings** connect exchanges to queues with routing keys/patterns.
- **Consumers** subscribe to queues and **ack** messages after successful processing.
- **Dead-letter exchanges (DLX)** capture rejected/expired messages for inspection or retry policies.

## Designing for Reliability & Throughput
- **Durable queues + persistent messages:** `durable: true` queues and `IBasicProperties.Persistent = true` survive broker restarts.
- **Publisher confirms:** Use `ConfirmSelect` + `WaitForConfirmsOrDie` (or async confirms) to ensure the broker received and persisted the publish.
- **Consumer acknowledgements:** Manual `BasicAck`/`BasicNack` lets you avoid losing work; pair with **idempotent handlers** to tolerate redelivery.
- **Prefetch/QoS:** Set `BasicQos(prefetchCount: N)` to avoid overwhelming consumers and to enable fair dispatch.
- **Ordering:** RabbitMQ preserves per-queue order; multiple consumers can reorder. Keep a single consumer per queue if strict ordering matters.
- **Retries:** Prefer **delayed queues** or **dead-letter routing** to a retry queue with backoff instead of immediate requeue loops.
- **Idempotency & dedupe:** Use message IDs + idempotent writes (upserts), or an outbox table feeding RabbitMQ to ensure at-least-once delivery without duplication.

## How to Use It from .NET (RabbitMQ.Client)
```csharp
var factory = new ConnectionFactory
{
    HostName = "rabbitmq", // or URI via Uri property
    DispatchConsumersAsync = true,
    UserName = "app", Password = "secret"
};
using var connection = factory.CreateConnection();
using var channel = connection.CreateModel();
channel.ExchangeDeclare("orders", ExchangeType.Topic, durable: true);
channel.QueueDeclare("orders.matching", durable: true, exclusive: false, autoDelete: false);
channel.QueueBind("orders.matching", "orders", routingKey: "order.*");
channel.BasicQos(prefetchSize: 0, prefetchCount: 50, global: false);

var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(command));
var props = channel.CreateBasicProperties();
props.Persistent = true; // durable message
channel.BasicPublish("orders", routingKey: "order.new", basicProperties: props, body: body);
```

### Consumer (Async EventingBasicConsumer)
```csharp
var consumer = new AsyncEventingBasicConsumer(channel);
consumer.Received += async (sender, ea) =>
{
    var payload = Encoding.UTF8.GetString(ea.Body.ToArray());
    await handler.HandleAsync(payload, ea.BasicProperties.MessageId);
    channel.BasicAck(ea.DeliveryTag, multiple: false);
};
channel.BasicConsume("orders.matching", autoAck: false, consumer: consumer);
```

> **Tip:** Wrap the channel in a **Hosted Service** and expose health checks (e.g., check connection + passive queue declare) for Kubernetes.

## Operational Playbook (What to Say in an Interview)
- **Provisioning:** Use **classic queues** for general workloads; **quorum queues** for HA and strong durability (RAFT-based) at the cost of memory/IO.
- **Observability:** Turn on the management plugin; monitor **queue depth**, **unacked count**, **connection churn**, and **consumer utilization**.
- **Back-pressure:** Control publishers with confirms + timeouts; throttle consumers via prefetch and CPU-aware worker scaling.
- **Security:** Use TLS, per-vhost credentials, and minimal permissions; rotate credentials and enable LDAP/OIDC if offered by ops.
- **Schema & compatibility:** Version message contracts; use headers for schema versioning and keep handlers backward compatible.
- **Disaster recovery:** Mirror (quorum) queues across nodes; test failover and ensure producers handle `IConnection`/`IModel` recreation.

## Pros
- Mature **AMQP 0-9-1** broker with rich routing and plugins (delayed messages, tracing, shovel/federation).
- **Operationally friendly**: management UI, CLI (`rabbitmqctl`, `rabbitmq-diagnostics`), easy local dev via Docker.
- Strong **durability options** (quorum queues, publisher confirms) and **fine-grained flow control** (prefetch/QoS).
- Great **polyglot support** and client libraries, including first-class .NET support.

## Cons
- **Throughput** lower than partitioned logs like Kafka; not ideal for massive immutable event streams.
- **Ordering** only per queue; multiple consumers or requeueing can reorder messages.
- **Backpressure** requires careful tuning (prefetch, confirms); naive `autoAck` leads to drops on consumer crash.
- **Cluster complexity:** Quorum queues use more memory/IO; network partitions can require operator intervention.

## Quick Usage Checklist (On the Job)
- Declare exchanges/queues in code at startup with explicit durability flags.
- Enable **publisher confirms** and retry publishes with exponential backoff.
- Use **manual acks** + **prefetch** sized to the handler’s latency.
- Keep handlers **idempotent**; store a processed message ID or use database upserts.
- Route failures to a **DLX** with alerting; inspect DLQ metrics regularly.
- Version payloads and keep consumers **backward compatible** during rollouts.
- Add **health checks** for connection + passive declare to catch topology drift early.
