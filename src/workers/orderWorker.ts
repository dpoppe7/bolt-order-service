/**
 * @file orderWorker.ts
 * @description Background Worker (Consumer) for the Order Queue.
 * Listens for new jobs in Redis and performs heavy-lifting tasks 
 * like PostgreSQL persistence and external notifications.
 */

import { Worker, Job } from 'bullmq';
import redis from '../config/redis';

// prefix for all logs in this file
const LOG_PREFIX = '[Worker 👷]';

export const worker = new Worker('order-queue', async (job: Job) => {
    const { productId, quantity } = job.data;

    console.log(`${LOG_PREFIX} Processing job ${job.id}`);
    console.log('  📦 Job data:', job.data);
    console.log('  Picked up job for Product ID:', productId);
    console.log('  Processing order for Qty:', quantity);
}, { connection: redis.options });

worker.on('completed', (job) => {
    console.log(`${LOG_PREFIX} ✅ Job ${job.id} finished successfully.`);
});

worker.on('failed', (job, err) => {
    console.error(`${LOG_PREFIX} ❌ Job ${job?.id} failed: ${err.message}`);
});
