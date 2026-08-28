import type {Request, Response, NextFunction} from 'express';
import type {RegisterDto, LoginDto} from './auth.types.ts';
import * as authService from './auth.service.ts';
import {successResponse} from '../../lib/apiResponse.ts';
import {logger} from '../../helpers/logger.ts';
import redisClient from '../../redisClient.ts';
import {SESSION_COOKIE} from '../../configs/cookies.ts';
import {USER_SESSION_SET_PREFIX} from '../../configs/basics.ts';

export const register = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const data = req.body as RegisterDto;
		const user = await authService.register(data);

		return res.status(201).json(
			successResponse('User registered successfully', {
				user,
			}),
		);
	} catch (error) {
		return next(error);
	}
};

export const login = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const data = req.body as LoginDto;
		const user = await authService.login(data);

		// Set session
		req.session.userId = user.id;
		req.session.username = user.username;
		req.session.email = user.email;
		req.session.role = user.role;
		req.session.createdAt = new Date().toISOString();
		req.session.cookie.maxAge = SESSION_COOKIE.maxAge;

		// Make sure the session is saved
		await new Promise<void>((resolve, reject) => {
			req.session.save((err) => {
				if (err) reject(err);
				else resolve();
			});
		});

		// Keep own track of sessions, to invalidate later
		await redisClient.sAdd(
			`${USER_SESSION_SET_PREFIX}${user.id}`,
			req.session.id,
		);
		await redisClient.expire(
			`${USER_SESSION_SET_PREFIX}${user.id}`,
			Math.ceil(SESSION_COOKIE.maxAge / 1000),
		);

		return res.status(200).json(successResponse('Login successful', user));
	} catch (error) {
		return next(error);
	}
};

export const logout = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const userId = req.session.userId;
		const sessionId = req.sessionID;

		if (userId) {
			try {
				await redisClient.sRem(
					`${USER_SESSION_SET_PREFIX}${userId}`,
					sessionId,
				);
			} catch (err) {
				logger.error({err, method: 'logout'}, 'Error removing tracked session');
			}
		}

		await new Promise<void>((resolve, reject) => {
			req.session.destroy((err) => {
				if (err) {
					reject(err);
					return;
				}

				resolve();
			});
		});

		res.clearCookie(SESSION_COOKIE.name, SESSION_COOKIE.options);

		return res.status(200).json(successResponse('Logout successful', null));
	} catch (error) {
		return next(error);
	}
};

export const getSession = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		// console.log('Session data:', req.session);
		return res.status(200).json(
			successResponse('Session retrieved', {
				isAuthenticated: !!req.session.userId,
				user: req.session.userId
					? {
							id: req.session.userId,
							username: req.session.username,
							email: req.session.email,
							role: req.session.role,
						}
					: null,
			}),
		);
	} catch (error) {
		return next(error);
	}
};
