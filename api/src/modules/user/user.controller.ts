import type {Request, Response, NextFunction} from 'express';
import type {UpdateProfileDto} from './user.types.ts';
import * as userService from './user.service.ts';
import {successResponse} from '../../lib/apiResponse.ts';
import {NotFoundError} from '../../lib/appError.ts';
import {SESSION_COOKIE} from '../../configs/cookies.ts';
import {logger} from '../../helpers/logger.ts';

export const getMe = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const userId = req.session.userId as string;
		const user = await userService.getUserById(userId);

		if (!user) {
			throw new NotFoundError('User not found');
		}

		return res.status(200).json(successResponse('User retrieved', user));
	} catch (error) {
		return next(error);
	}
};

export const updateMe = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const userId = req.session.userId as string;
		const data = req.body as UpdateProfileDto;

		const user = await userService.updateUser(userId, data);
		return res
			.status(200)
			.json(successResponse('Profile updated successfully', user));
	} catch (error) {
		return next(error);
	}
};

export const getSessions = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const userId = req.session.userId as string;
		const count = await userService.getUserSessionCount(userId);
		return res.status(200).json(successResponse('Sessions retrieved', {count}));
	} catch (error) {
		return next(error);
	}
};

export const killAllSessions = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const userId = req.session.userId as string;
		await userService.killAllUserSessions(userId);

		req.session.destroy((err) => {
			if (err) {
				logger.error(
					{err, method: 'killAllSessions'},
					'Error destroying session',
				);
			}
		});

		res.clearCookie(SESSION_COOKIE.name, SESSION_COOKIE.options);
		return res
			.status(200)
			.json(successResponse('All sessions killed successfully', null));
	} catch (error) {
		return next(error);
	}
};
