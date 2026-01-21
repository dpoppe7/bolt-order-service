# 📦 Background Processing with BullMQ

[BullMQ Docs](https://docs.bullmq.io)

### What is a Producer?
The **Producer** (our Express Controller) is responsible for creating a "Job." It doesn't do the heavy lifting; it just defines what needs to be done.

### What is a Consumer?
The **Consumer** (our Worker) is the logic engine. It runs in its own process, meaning if the Worker crashes, the API stays online.

### Why use a Queue?
* **Resilience**: If the Database goes down, jobs stay safe in Redis.
* **Rate Limiting**: No control how many orders hit the DB per second.
* **Concurrency**: It is possible to spin up multiple workers to process the queue faster.