import type {Request, Response, NextFunction} from 'express';
import rateLimit from 'express-rate-limit';
import {RateLimitError} from '../lib/appError.ts';

export const registerLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 10,
	handler: (req: Request, _res: Response, next: NextFunction) => {
		req.log.warn(
			{
				limiter: 'register',
				ip: req.ip,
				userAgent: req.headers['user-agent'],
				route: req.originalUrl,
				method: req.method,
			},
			'Rate limit exceeded',
		);
		next(
			new RateLimitError(
				'You have exceeded the maximum number of registration attempts. Please try again later.',
				'REGISTER_RATE_LIMIT_EXCEEDED',
			),
		);
	},
});

export const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
	handler: (req: Request, _res: Response, next: NextFunction) => {
		req.log.warn(
			{
				limiter: 'login',
				ip: req.ip,
				userAgent: req.headers['user-agent'],
				route: req.originalUrl,
				method: req.method,
			},
			'Rate limit exceeded',
		);
		next(
			new RateLimitError(
				'You have exceeded the maximum number of login attempts. Please try again later.',
				'LOGIN_RATE_LIMIT_EXCEEDED',
			),
		);
	},
});
