import redis from 'redis';

import logger from './logger.config';

const redisClient = redis.createClient({
    url: process.env.REDIS_URI as string,
});

redisClient.on('connect', () => {
    logger.info(`Connected to Redis`);
});

redisClient.on('error', (error: Error) => {
    logger.error(`Error in Connecting to Redis: ${error}`);
});

redisClient.connect();

export { redisClient };