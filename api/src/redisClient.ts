import {createClient} from 'redis';
import {IS_DEV_MODE, REDIS_PASSWORD, REDIS_URL} from './configs/basics.ts';
import * as Logger from './helpers/logger.ts';

const redisClient = createClient({
	url: REDIS_URL,
	password: IS_DEV_MODE ? undefined : REDIS_PASSWORD,
});

redisClient.on('error', (err) =>
	Logger.log(`Redis Client Error: ${err}`, 'error')
);
redisClient.on('connect', () => Logger.log('Redis: connecting...', 'info'));
redisClient.on('ready', () => Logger.log('Redis: ready', 'info'));

await redisClient.connect();
export default redisClient;
