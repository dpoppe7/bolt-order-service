/**
 * @file orderWorker.ts
 * @description Background Worker (Consumer) for the Order Queue.
 * Listens for new jobs in Redis and performs heavy-lifting tasks 
 * like PostgreSQL persistence and external notifications.
 */

import 'dotenv/config';
import { Worker, Job } from 'bullmq';
import redis from '../config/redis';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// prefix for all logs in this file
const LOG_PREFIX = '[Worker 👷]';

// Prisma Client instance for DB operations, this is the "Bridge" to Postgres.
// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Prisma Client instance with adapter
const prisma = new PrismaClient({ adapter });

export const worker = new Worker('order-queue', async (job: Job) => {
    const { productId, quantity } = job.data;

    console.log(`${LOG_PREFIX} Processing job ${job.id}`);
    console.log('  📦 Job data:', job.data);
    console.log('  Picked up job for Product ID:', productId);
    console.log('  Processing order for Qty:', quantity);

    // Add order to the postgres database
    const order = await prisma.order.create({
        data: {
            // schema default field: Id (autoincremente)
            productId: productId,
            quantity: quantity
            // schema default field: Status (COMPLETED)
            // schema default field: Created At (now)
        },
    });
    console.log(`${LOG_PREFIX} Order persisted to Postgres with ID: ${order.id}`);
        
}, { connection: redis.options });

worker.on('completed', (job) => {
    console.log(`${LOG_PREFIX} ✅ Job ${job.id} finished successfully.`);
});

worker.on('failed', (job, err) => {
    console.error(`${LOG_PREFIX} ❌ Job ${job?.id} failed: ${err.message}`);
});
