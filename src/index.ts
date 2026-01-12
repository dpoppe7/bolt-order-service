import express from 'express';
import redis from './config/redis';
import { OrderService } from './services/orderService';

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

    const result = await OrderService.reserveStock(productId, quantity);

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
