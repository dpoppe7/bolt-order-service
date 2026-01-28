/**
 * @file index.ts
 * @description Entry point for the Order Service API. 
 * Orchestrates the Express server, middleware, and route registration.
 */

import cors from 'cors';
import express from 'express';
import redis from './config/redis';
import { OrderService, ReserveStockResponse } from './services/orderService';
import { worker } from './workers/orderWorker';
import { orderQueue } from './queues/orderQueue';
import dotenv from 'dotenv';
dotenv.config();

const LOG_PREFIX = '[Server 🚀]';

const app = express();
// Enables CORS for all routes, allowing cross-origin requests, the browser client would not block the UI.
app.use(cors());
//app.use(cors({
//  origin: '*', // Allow absolutely everything
//  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//  allowedHeaders: ['Content-Type', 'Authorization']
//}));

const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Bolt');
});

// GET /health - route that checks Redis connectivity
app.get('/health', async (req, res) => {

  try {
    await redis.ping();
    res.send({
      status: 'online',
      redis: true,
      products: await OrderService.getFullInventory()
    });
  } catch (error) {
    console.error(`${LOG_PREFIX} Health check failed:`, error);
    res.status(500).send({
      status: 'offline',
      redis: false,
      products: []
    })
  }
});

// POST /order - route to reserve stock for an order
app.post('/order', async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ message: `${LOG_PREFIX} Invalid productId or quantity` });
    }

    const result : ReserveStockResponse = await OrderService.reserveStock(productId, quantity);

    if (!result) {
      return res.status(500).json({ message: `${LOG_PREFIX} Internal Server Error` });
    }

    if (result.success) {
      res.status(200).json({ message: `${LOG_PREFIX} Order placed successfully`, newStock: result.newStock });
    } else {
      res.status(400).json({ message: `${LOG_PREFIX} Order failed: ${result.message}` }); // e.g., "Insufficient stock"
    }
  } catch (error) {
    console.error(`${LOG_PREFIX} Error reserving stock:`, error);
    res.status(500).json({ message: `${LOG_PREFIX} Internal server error` });
  }
});

app.listen(port, () => {
  console.log(`${LOG_PREFIX} Server running on port ${port}. Ready to accept orders!`);
});

// graceful shutdown
process.on('SIGINT', async () => {
  console.log(`${LOG_PREFIX} Graceful shutdown initiated...`);
  
  try {
    // Mark the worker as closed so it will not pick up new jobs, 
    // and at the same time it will wait for all the current jobs to be processed (or failed).
    await worker.close();
    console.log('  Worker closed.');

    // Close the queue connection
    await orderQueue.close();
    console.log('  Queue closed.');

    // Disconnect Redis client
    await redis.quit();
    console.log('  Redis client disconnected.');

    console.log(`${LOG_PREFIX} Shutdown complete.`);
    process.exit(0);
  } catch (err) {
    console.error(`${LOG_PREFIX} Error during graceful shutdown:`, err);
    process.exit(1);
  }
});
