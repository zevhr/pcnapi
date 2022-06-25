import { createClient } from 'redis';
import config from '../config.json';

export const redisClient = createClient({url: config.redis.url});
redisClient.connect();