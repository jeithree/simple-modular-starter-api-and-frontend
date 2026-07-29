import pino, {type LoggerOptions} from 'pino';
import {IS_DEV_MODE, IS_TEST_MODE} from '../configs/basics.ts';

const level = IS_TEST_MODE ? 'silent' : IS_DEV_MODE ? 'debug' : 'info';

const options: LoggerOptions = {
	level,
	redact: {
		paths: [
			'req.headers.cookie',
			'req.headers.authorization',
			'req.headers["x-api-key"]',
		],
		censor: '[Redacted]',
	},
};

if (IS_DEV_MODE) {
	options.transport = {
		target: 'pino-pretty',
		options: {
			colorize: true,
			translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
			ignore: 'pid,hostname',
		},
	};
}

export const logger = pino(options);
