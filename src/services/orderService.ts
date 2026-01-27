/**
 * @file orderService.ts
 * @description Domain logic for order processing.
 * Handles atomic stock reservations in Redis and coordinates 
 * background job creation for order persistence.
 */

import redis from '../config/redis';
import { addOrderToQueue } from '../queues/orderQueue';
import { PrismaClient, Product } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Prisma Client instance for DB operations, this is the "Bridge" to Postgres.
// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Prisma Client instance with adapter
const prisma = new PrismaClient({ adapter });

export interface ReserveStockResponse {
    success: boolean;
    message?: string;
    newStock?: number;
}

export class OrderService {
    // Method: Reserve stock atomically in Redis
    static async reserveStock(productId: string, quantity: number): Promise<ReserveStockResponse> {
       
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

    // Additional order-related methods
        
    // Method: Get current stock for a specific product from Redis
    static async getStock_redis(productId: string): Promise<number | null> {
        const stock = await redis.get(`stock:${productId}`);
        return stock ? parseInt(stock, 10) : null; // return null if not found
    }

    // Method: Combines stock info from Redis and product info from DB (e.g., redis: price, name | id and price as stored in db)
    static async getFullInventory(): Promise<Product[]> {
        // Fetch products from Postgres and stock from Redis in parallel
        const[dbProducts, redisKeys] = await Promise.all([
            prisma.product.findMany(), // from Postgres via Prisma
            redis.keys('stock:*')  // get all stock keys from Redis, returns string
        ]); 

        // Map redis keys to an Object. stockMap_redis will look like this:  { iphone: 10, ipad: 5, macbook: 0 }
        const stockMap_redis: { [productId: string]: number } = {};
        for (const key of redisKeys) {
            const stockValue = await redis.get(key); // key ='stock:iphone' => stockValue '10'
            const productName = key.split(':')[1]; // splits the key to get productId, e.g. from 'stock:iphone' take 'iphone' (take [1] right side)
            stockMap_redis[productName] = stockValue ? parseInt(stockValue, 10) : 0;
        }

        // Merge: Combine DB product info with Redis stock infor (stockMap)
        return dbProducts.map(product: Product => ({
            ...product, // spread operator to copy all fields from product (id, name, price) from Postgres
            stock: stockMap_redis[product.id] ?? 0 
        }))
    }
}