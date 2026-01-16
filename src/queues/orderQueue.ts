import { Queue } from 'bullmq';
import redis from '../config/redis';

// Interface: Contract for what an order looks like
interface OrderJobsData {
    productId: string;
    quantity: number;
}

const connection = redis.options;
const orderQueue = new Queue('order-queue', { connection });

async function addOrderToQueue(orderData: OrderJobsData) {
    await orderQueue.add('order-job', orderData);
    console.log(`Ticket: Order for product ${orderData.productId} added to the queue.`);
}



