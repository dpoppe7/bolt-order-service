# ⚖️ Design Trade-offs

### 1. Hybrid Consistency vs. Strong Consistency
In a flash sale, hitting a database for every click causes a bottleneck. 
* **Choice**: **Hybrid Consistency** for the order record.
* **Trade-off**: We use Strong Consistency in the Redis Cache for stock levels (to prevent overselling) but Eventual Consistency for the permanent Order Record in Postgres (to keep the API fast).

### 2. SQL (Postgres) vs. NoSQL (MongoDB)
* **Choice**: **PostgreSQL**.
* **Trade-off**: While NoSQL is easier to scale horizontally, orders require **strict relational integrity**. Using Postgres to guarantee that every order has a valid `productId` and `quantity`.

### 3. Redis as a Broker
* **Choice**: **BullMQ (Redis)**.
* **Trade-off**: Redis over RabbitMQ or Kafka for its extreme speed and low configuration overhead for this specific use case.

### 4. Monolith vs Distributed event-driven System
**The Monolith Problem:** If the Database is slow or experiences a "spike" in traffic, the entire API hangs. Users see a spinning loading icon, and eventually, the request times out.

### Double Guard
By checking stock in Redis before queueing, we prevent the "Ghost Order" problem where a user thinks they bought something that is actually out of stock.

* **Choice**: **(Producer-Consumer)**
This project decoupled the Ingestion (API) from the Persistence (Worker) using BullMQ.

* **Trade-off**: Implementing a Producer-Consumer architecture introduces *Architectural Complexity*, requiring to manage a Redis instance and a background process. However, we gained System Resilience: the API can now handle thousands of orders per second without waiting for the disk to spin.