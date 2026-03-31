const Redis = require('ioredis');

let redis;

const connectRedis = () => {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  const isProd = process.env.NODE_ENV === 'production';

  // Skip Redis if in production and set to localhost
  if (isProd && redisUrl.includes('localhost')) {
    console.warn('Production Redis is set to localhost - bypassing to use MongoDB fallback.');
    return null;
  }

  try {
    redis = new Redis(redisUrl, {
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
