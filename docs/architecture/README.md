# 🏗️ System Architecture

Bolt follows a **Producer-Consumer** architecture to ensure high availability and resilience.

### The Life of an Order
1.  **Incoming Request**: The user sends a POST to /order.
2.  **Atomic Reservation**: The controller performs a DECRBY in **Redis**. Success (if stock is grater than 0) it proceeds, otherwise Fail (stock is less than 0) the controller increments back and returns 400 Insufficient Stock **immediately**.
3. **Queueing**: Only succesful reservations are pushed to **BullMQ**.
4.  **Processing**: The `[Worker 👷]` pulls the job from the queue.
5.  **Persistence**: The Worker records the order in **Postrgres** and performs a final sync to ensure Redis matched the DB.


### Connection Points
* **Express → Redis**: Fast, in-memory handoff.
* **Redis → Worker**: Decoupled background processing.
* **Worker → Postgres**: Final source of truth.
* **Worker → Redis**: Sync the cache back to the DB value.

#### Entry Point: Express
**Files:**

`src/index.ts` (Server initialization, request handling, route definitions)

- When a user hits the /order endpoint, the server acts as a Gatekeeper. It uses Redis DECRBY to subtract stock immediately. If the result is negative, it rolls back the count and rejects the request before it even touches the queue.
- Validation: It validates the payload and ensures the requested quantity is available in the high-speed cache.
- Handoff: Once stock is reserved in Redis, the Controller creates a "Job" and hands it to BullMQ.
- Hybrid Consistency: The API returns a success message in milliseconds. While the database hasn't been written to yet, the stock is "locked" in Redis, preventing over-selling.

#### Memory: Redis & BullMQ
**Files:**

`docker-compose.yml` (Infrastructure definition)

`src/config/redis.ts` 

`src/queue/orderQueue.ts` (Queue configuration)

- The stock counts are already safe in Redis, allowing the system to handle thousands of concurrent checkous without hitting Postre bottleneck.
- Atomic Operation: BullMQ manages the queue logic, ensuring that if we spin up 5 workers, an order is never processed twice. Use Case: two people buy at the exact same millisecond, the stock won't "double-count".
- ACID Compliance: Atomicity, "all or nothing".
- Resilience: If the Worker or Database is temporarily down, the "Reserved" orders sit safely in Redis until the system recovers.

#### Background Worker
**Files:**

`src/workers/orderWorker.ts` (Worker entry point)

- This is the Consumer. It lives in a separate process from the API. Its only job is to watch Redis and wait for work.
- The Worker is separate, the API can start without stopping the Worker, and vice-versa.
- The Worker pulls the productId and quantity from the job data.
- Transaction: It wraps the Postgre update in a Prisma Transaction. If the DB update fails (e.g. stock mismatch), the transaction rolls back the entire operation
- After a successful DB write, the Worker performs redis.set() to overwrite the redis stock with the exact DB.

#### Persistance: Prisma & PostgreSQL
**Files:**

`prisma/schema.prisma` (Database schema)

`src/lib/prisma.ts` (Prisma client singleton)

`.env` (Database connection strings)

`prisma/seed.ts` (synchronizes the starting stock)

- Prisma (ORM) translates the TypeScript code into optimized SQL queries. It uses the DATABASE_URL from .env to find the PostgreSQL container.
- Postgress ensures that the order is written to disk permanently.
- Schema Migrations: Running **prisma db push** ensures the "shape" of the data (Table: Order, Fields: id, productId, status) is consistent across every developer's machine.
- prisma/seed.ts script is essential to synchronize the starting stock between the Database and the Redis cache.