# 🏗️ System Architecture

Bolt follows a **Producer-Consumer** architecture to ensure high availability and resilience.

### The Life of an Order
1.  **Incoming Request**: The user sends a POST request to `[Controller 📩]`.
2.  **Queueing**: The controller validates the request and pushes a job to **Redis** via BullMQ.
3.  **Response**: The user receives a `200 OK` immediately. The system is now **Stateless**.
4.  **Processing**: The `[Worker 👷]` pulls the job from the queue.
5.  **Persistence**: The Worker uses **Prisma** to record the order in **PostgreSQL**.


### Connection Points
* **Express → Redis**: Fast, in-memory handoff.
* **Redis → Worker**: Decoupled background processing.
* **Worker → Postgres**: Final source of truth.

#### Entry Point: Express
**Files:**

`src/index.ts` (Server initialization, request handling, route definitions)

- When a user hits the /order endpoint, the Express server acts as the *Producer*.
- Validation: It first checks the incoming JSON payload (using the environment variables to ensure hit the right port)
- Handoff: Instead of talking to the heavy Database immediately, the Controller creates a "Job" and hands it to BullMQ.
- Statelessness: Express return a 200 OK in milliseconds. The API doesn't need to "wait" or "remember" the order; it's already safe in the queue.

#### Memory: Redis & BullMQ
**Files:**

`docker-compose.yml` (Infrastructure definition)

`src/queue/orderQueue.ts` (Queue configuration)

- The jobs are already safe in Redis.
- Atomic Operation: BullMQ manages the queue logic, ensuring that if we spin up 5 workers, an order is never processed twice. Use Case: two people buy at the exact same millisecond, the stock won't "double-count".
- ACID Compliance: Atomicity, "all or nothing".

#### Background Worker
**Files:**

`src/workers/orderWorker.ts` (Worker entry point)

- This is the Consumer. It lives in a separate process from the API. Its only job is to watch Redis and wait for work.
- The Worker is separate, the API can start without stopping the Worker, and vice-versa.
- The Worker pulls the productId and quantity from the job data.

#### Persistance: Prisma & PostgreSQL
**Files:**

`prisma/schema.prisma` (Database schema)

`src/lib/prisma.ts` (Prisma client singleton)

`.env` (Database connection strings)

- Prisma (ORM) translates the TypeScript code into optimized SQL queries. It uses the DATABASE_URL from .env to find the PostgreSQL container.
- Postgress ensures that the order is written to disk permanently.
- Schema Migrations: Running **prisma db push** ensures the "shape" of the data (Table: Order, Fields: id, productId, status) is consistent across every developer's machine.