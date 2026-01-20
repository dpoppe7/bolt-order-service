/**
 * @file redis.ts
 * @description Centralized Redis client configuration.
 * Implements the Singleton pattern to ensure a shared connection pool 
 * across the application.
 */

import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

export default redis;