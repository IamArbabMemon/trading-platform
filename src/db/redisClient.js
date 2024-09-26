import { createClient } from 'redis';

const redisClient = createClient({
    // host: process.env.REDIS_HOST || 'localhost',
    // port: process.env.REDIS_PORT || 6379,
    // password: process.env.REDIS_PASSWORD, // If your Redis instance requires authentication
      url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
});

export {
  redisClient
}
