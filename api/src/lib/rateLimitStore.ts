import {RedisStore} from 'rate-limit-redis';
import redisClient from '../redisClient.ts';

export const createRateLimitStore = (prefix: string) => {
  return new RedisStore({
    prefix,
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  });
};

export default createRateLimitStore;
