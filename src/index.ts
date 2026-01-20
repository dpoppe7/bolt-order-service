/**
 * @file index.ts
 * @description Entry point for the Order Service API. 
 * Orchestrates the Express server, middleware, and route registration.
 */

import express from 'express';
import redis from './config/redis';
import { OrderService, ReserveStockResponse } from './services/orderService';
import { worker } from './workers/orderWorker';
import { orderQueue } from './queues/orderQueue';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Bolt');
});

// GET /health - route that checks Redis connectivity
app.get('/health', async (req, res) => {
  try {
    await redis.ping();
    res.send('OK');
  } catch (error) {
    res.status(500).send('Redis not connected');
  }
});

// POST /order - route to reserve stock for an order
app.post('/order', async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid productId or quantity' });
    }

    const result : ReserveStockResponse = await OrderService.reserveStock(productId, quantity);

    if (!result) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (result.success) {
      res.status(200).json({ message: 'Order placed successfully', newStock: result.newStock });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error('Error reserving stock:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nGraceful shutdown initiated...');
  
  try {
    // Mark the worker as closed so it will not pick up new jobs, 
    // andat the same time it will wait for all the current jobs to be processed (or failed).
    await worker.close();
    console.log('Worker closed.');

    // Close the queue connection
    await orderQueue.close();
    console.log('Queue closed.');

    // Disconnect Redis client
    await redis.quit();
    console.log('Redis client disconnected.');

    console.log('Shutdown complete.');
    process.exit(0);
  } catch (err) {
    console.error('Error during graceful shutdown:', err);
    process.exit(1);
  }
});
