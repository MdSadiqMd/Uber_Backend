import { createClient } from 'redis';

import logger from './logger.config';

const redisClient = createClient({
    url: process.env.REDIS_URI as string,
});

redisClient.on('connect', () => {
    logger.info('Connected to Redis from Config');
});

redisClient.on('error', (error: Error) => {
    logger.error(`Error in Connecting to Redis: ${error}`);
});

redisClient.connect();

export { redisClient };