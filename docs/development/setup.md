# Local Development Setup

Follow steps 1-5 to get Bolt running in your environment.

### 1. Infrastructure

#### Option A: Using Docker (Heavier)
Ensure Docker is running, then start the services. 
```bash
docker-compose up -d
```

#### Option B: Native Setup
Open two separate terminal windows and start the services manually:
* **Postgress**: `postgres -D /usr/local/var/postgresql@14`
* **Redis**: `redis-server`

Note: If you don't want Postgress and Redis running in the baackground, close these terminals or press Ctrl+C when finished coding to free up memory.

### 2. Environment Variables
Create a .env file in the root:

<pre>
# Database Connection (Postgres)
DATABASE_URL="postgresql://user:password@localhost:5432/bolt"

# Cache & State (Redis)
REDIS_URL="redis://localhost:6379"

# App Settings
PORT=3000
NODE_ENV=development
</pre>

**Note:** 
* **When using Docker**, it ses a virtual user (usually user or postgres) and a password because it’s a separate, locked-down system. Hence DATABASE_URL would look like: 
`DATABASE_URL="postgresql://user:password@localhost:5432/bolt"`. 
* **When setting up locally**, native setup will require your macOS login name and usually no password, because you are already logged into the machine that owns the database. Hence DATABASE_URL would look like: 
`DATABASE_URL="postgresql://myMacUsername@localhost:5432/orderdb?schema=public"`


### 3. Database Migration
Create the DB **(Run once)**.

```bash
createdb orderdb
```

Sync your Prisma schema with the database, and Generate Client.

```bash
npx prisma db push
npx prisma generate
```

### 4. Seed Data
Synchronize the Source of Truth (Postgres) with the High-Speed Cache (Redis).
**Ensure Redis is running before starting.**

```bash
npx prisma db seed
```

### 5. Launch
Start the API Worker:
```bash
npm run dev
```

### Notes
[Prisma Generate](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/introduction): Whenever you make changes to your database that are reflected in the **Prisma schema**, you need to manually re-generate Prisma Client to update the generated code in your output directory:
```bash
npx prisma generate
```