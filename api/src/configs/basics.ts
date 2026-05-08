if (!process.env.PORT) {
	throw new Error('PORT is not defined in environment variables');
}
if (!process.env.NODE_ENV) {
	throw new Error('NODE_ENV is not defined in environment variables');
}
if (!process.env.API_URL) {
	throw new Error('API_URL is not defined in environment variables');
}
if (!process.env.SITE_URL) {
	throw new Error('SITE_URL is not defined in environment variables');
}
if (!process.env.TIME_ZONE) {
	throw new Error('TIME_ZONE is not defined in environment variables');
}
if (!process.env.SESSION_SECRET) {
	throw new Error('SESSION_SECRET is not defined in environment variables');
}
if (!process.env.SESSION_REDIS_PREFIX) {
	throw new Error(
		'SESSION_REDIS_PREFIX is not defined in environment variables'
	);
}

export const PORT = Number(process.env.PORT);
export const IS_DEV_MODE = process.env.NODE_ENV === 'development';
export const API_URL = IS_DEV_MODE
	? 'http://localhost:' + PORT
	: process.env.API_URL;
export const TIME_ZONE = process.env.TIME_ZONE;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const SESSION_REDIS_PREFIX = process.env.SESSION_REDIS_PREFIX;

if (!process.env.REDIS_HOST) {
	throw new Error('REDIS_HOST is not defined in environment variables');
}
if (!process.env.REDIS_PORT) {
	throw new Error('REDIS_PORT is not defined in environment variables');
}
if (!IS_DEV_MODE && !process.env.REDIS_PASSWORD) {
	throw new Error('REDIS_PASSWORD is not defined in environment variables');
}

export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = Number(process.env.REDIS_PORT);
export const REDIS_URL = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
