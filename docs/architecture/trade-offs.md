# ⚖️ Design Trade-offs

### 1. Eventual Consistency vs. Strong Consistency
In a flash sale, hitting a database for every click causes a bottleneck. 
* **Choice**: **Eventual Consistency** for the order record.
* **Trade-off**: The user gets a "Success" message instantly, even if the database write happens 200ms later.

### 2. SQL (Postgres) vs. NoSQL (MongoDB)
* **Choice**: **PostgreSQL**.
* **Trade-off**: While NoSQL is easier to scale horizontally, orders require **strict relational integrity**. Using Postgres to guarantee that every order has a valid `productId` and `quantity`.

### 3. Redis as a Broker
* **Choice**: **BullMQ (Redis)**.
* **Trade-off**: Redis over RabbitMQ or Kafka for its extreme speed and low configuration overhead for this specific use case.

### 4. Monolith vs Distributed event-driven System
**The Monolith Problem:** If the Database is slow or experiences a "spike" in traffic, the entire API hangs. Users see a spinning loading icon, and eventually, the request times out.

* **Choice**: **(Producer-Consumer)**
This project decoupled the Ingestion (API) from the Persistence (Worker) using BullMQ.

* **Trade-off**: Implementing a Producer-Consumer architecture introduces *Architectural Complexity*, requiring to manage a Redis instance and a background process. However, we gained System Resilience: the API can now handle thousands of orders per second without waiting for the disk to spin.