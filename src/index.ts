import express from 'express';
import redis from './config/redis';

const app = express();
const port = process.env.PORT || 3000;

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
