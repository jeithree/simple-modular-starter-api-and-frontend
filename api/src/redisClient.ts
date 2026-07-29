import {createClient} from 'redis';
import {
	IS_DEV_MODE,
	IS_TEST_MODE,
	REDIS_PASSWORD,
	REDIS_URL,
} from './configs/basics.ts';
import {logger} from './helpers/logger.ts';

const USE_PASSWORD = IS_DEV_MODE || IS_TEST_MODE ? false : true;

const redisClient = createClient({
	url: REDIS_URL,
	password: USE_PASSWORD ? REDIS_PASSWORD : undefined,
});

redisClient.on('error', (err) => logger.error({err}, 'Redis client error'));
redisClient.on('connect', () => logger.info('Redis: connecting...'));
redisClient.on('ready', () => logger.info('Redis: ready'));

await redisClient.connect();
export default redisClient;
