/**
 * @file seed.ts
 * @description Data Seeding / Environment Provisioning Script.
 * This file ensures the initial state of the database is correct before the application logic begins.
 * Seeds initial product data into the PostgreSQL database via Prisma Client.
 * @howto Run: npx prisma db seed
 *  - Verify package.json has this config:
 *      "prisma": { "seed": "ts-node prisma/seed.ts" }
 *  - Execute command: npx prisma db seed
 *  - Purpose: Resets/initializes product stock in PostgreSQL so the OrderWorker has data to process.
 */ 

import { PrismaClient } from '../src/generated/prisma';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import Redis from 'ioredis';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// This tells Redis to connect to the specified URL from env or default to localhost, to talk to our Redis container.
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

async function main() {
    // Seed initial products
    const products = [
        { id: 'iphone', name: 'iPhone 15', stock: 20 },
        { id: 'macbook', name: 'MacBook Pro', stock: 10 },
    ];

    // Upsert products to ensure idempotent seeding. This will create the product if it doesn't exist,
    // or update the stock if it does.
    for (const product of products) {
        // asyncronous opeation
        await prisma.product.upsert({
            where: { id: product.id },
            update: { stock: product.stock }, // Reset stock on every seed
            create: product,
        });

        // Also set initial stock in Redis for fast access, using the same stock value
        await redis.set(`stock:${product.id}`, product.stock);
    }

    console.log('✅ Database seeded with initial products.');
}

main()
    // Handling the Promise Lifecycle
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { 
        await prisma.$disconnect();
        await redis.quit(); // Closing Redis connection
    }); // Closing the connect pool