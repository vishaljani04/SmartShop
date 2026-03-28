const Redis = require('ioredis');

let redis;

const connectRedis = () => {
  try {
    redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) {
          console.warn('Redis connection failed. Cart will use DB fallback.');
          return null;
        }
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true
    });

    redis.on('connect', () => console.log('Redis Connected'));
    redis.on('error', (err) => {
      console.warn('Redis Error (using DB fallback):', err.message);
    });

    redis.connect().catch(() => {
      console.warn('Redis unavailable — using MongoDB for cart storage');
    });
  } catch (error) {
    console.warn('Redis init failed — using MongoDB for cart storage');
    redis = null;
  }

  return redis;
};

const getRedis = () => redis;

module.exports = { connectRedis, getRedis };
