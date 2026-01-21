# Local Development Setup

Follow these steps to get Bolt running in your environment.

### 1. Infrastructure
Ensure Docker is running, then start the services:
```bash
docker-compose up -d
```

### 2. Environment Variables
Create a .env file in the root:
<pre>
DATABASE_URL="postgresql://user:pass@localhost:5432/bolt"
REDIS_URL="redis://localhost:6379"
</pre>

### 3. Database Migration
Sync your Prisma schema with the database:
```bash
npx prisma db push
npx prisma generate
```

### 4. Launch
Start the API Worker:
```bash
npm run dev
```