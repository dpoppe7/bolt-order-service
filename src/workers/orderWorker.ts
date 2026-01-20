/**
 * @file orderWorker.ts
 * @description Background Worker (Consumer) for the Order Queue.
 * Listens for new jobs in Redis and performs heavy-lifting tasks 
 * like PostgreSQL persistence and external notifications.
 */

import { Worker, Job } from 'bullmq';
import redis from '../config/redis';

export const worker = new Worker('order-queue', async (job: Job) => {
    const { productId, quantity } = job.data;

    console.log('* Periodic task executed!');
    console.log('  Job data:', job.data);
    console.log('  Picked up job for Product ID:', productId);
    console.log('  Processing order for quantity:', quantity);
}, { connection: redis.options });

worker.on('completed', (job) => {
    console.log(`Job with ID ${job.id} has been completed.`);
});

worker.on('failed', (job, err) => {
    console.error(`Job with ID ${job?.id} has failed with error: ${err.message}`);
});
