/**
 * @file orderQueue.ts
 * @description Message Producer for the Order Processing Queue.
 * Defines the BullMQ queue and provides a helper to 'dispatch' jobs 
 * to the Redis-backed message broker.
 */

import { Queue } from 'bullmq';
import redis from '../config/redis';

const LOG_PREFIX = '[Queue 📩]';

// Interface: Contract for what an order looks like
interface OrderJobsData {
    productId: string;
    quantity: number;
}

const connection = redis.options;
export const orderQueue = new Queue('order-queue', { connection });

export async function addOrderToQueue(orderData: OrderJobsData) {
    await orderQueue.add('order-job', orderData, { // Backoff setting for automatic retries if the job fails
        attempts: 3,
        backoff: { 
            type: 'exponential', // (prevents "hammering" a database) This means if it fails at 1s, it waits 2s, then 4s...
            delay: 1000,
        },
    });
    console.log(`${LOG_PREFIX} Ticket: Order for ${orderData.productId} added to queue.`);
}



