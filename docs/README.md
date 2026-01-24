# ⚡ Bolt Order Service

A high-performance, distributed order processing system built with **Node.js**, **Redis**, and **PostgreSQL**.

## Overview
Bolt demonstrates how to handle "Flash Sale" concurrency by decoupling order reception from database persistence. By using a **Producer-Consumer** pattern, the API remains responsive under heavy load.

## Documentation Index
Click the links below to explore the project's design and setup:

* **[Architecture](./docs/architecture/README.md)**: System flow and connection points.
* **[Design Trade-offs](./docs/architecture/trade-offs.md)**: The "Why" of these specific technologies.
* **[Core Concepts](./docs/concepts/bullmq.md)**: Deep dive into BullMQ and background jobs.
* **[Setup Guide](./docs/development/setup.md)**: How to run Bolt in your local environment.

## Tech Stack
| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Runtime** | Node.js (TypeScript) | Non-blocking I/O |
| **API** | Express.js | RESTful Interface |
| **Queue** | BullMQ & Redis | Message Brokering |
| **Database** | PostgreSQL | ACID Persistence |
| **ORM** | Prisma | Schema & Migrations |