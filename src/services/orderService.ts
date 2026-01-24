/**
 * @file orderService.ts
 * @description Domain logic for order processing.
 * Handles atomic stock reservations in Redis and coordinates 
 * background job creation for order persistence.
 */

import redis from '../config/redis';
import { addOrderToQueue } from '../queues/orderQueue';

export interface ReserveStockResponse {
    success: boolean;
    message?: string;
    newStock?: number;
}

export class OrderService {
    static async reserveStock(productId: string, quantity: number) {
       
        // substracts the amount immediately (atomic)
        const newStock = await redis.decrby(`stock:${productId}`, quantity);

        // Bussiness logic: if stock goes negative, revert the operation
        if (newStock < 0) {
            // adding back the stock
            await redis.incrby(`stock:${productId}`, quantity);
            return { success: false, message: "Insufficient stock" };
        }

        await addOrderToQueue({ productId, quantity });

        return { 
            success: true,
            message: "Order queued successfully", 
            newStock: newStock 
        };
    }
}