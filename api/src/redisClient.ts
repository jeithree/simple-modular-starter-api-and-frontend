import {createClient} from 'redis';
import {
	IS_DEV_MODE,
	IS_TEST_MODE,
	REDIS_PASSWORD,
	REDIS_URL,
} from './configs/basics.ts';
import * as Logger from './helpers/logger.ts';

const USE_PASSWORD = IS_DEV_MODE || IS_TEST_MODE ? false : true;

const redisClient = createClient({
	url: REDIS_URL,
	password: USE_PASSWORD ? REDIS_PASSWORD : undefined,
});

redisClient.on('error', (err) =>
	Logger.log(`Redis Client Error: ${err}`, 'error'),
);
redisClient.on('connect', () => Logger.log('Redis: connecting...', 'info'));
redisClient.on('ready', () => Logger.log('Redis: ready', 'info'));

await redisClient.connect();
export default redisClient;
