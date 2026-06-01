import type {Request, Response, NextFunction} from 'express';
import type {UpdateUserDto} from './admin.types.ts';
import * as adminService from './admin.service.ts';
import {successResponse} from '../../lib/apiResponse.ts';

export const searchUsers = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const q = (req.query.q as string) || '';
		const users = await adminService.searchUsers(q);
		return res.status(200).json(successResponse('Users retrieved successfully', users));
	} catch (error) {
		return next(error);
	}
};

export const updateUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const {id} = req.params as {id: string};
		const data = req.body as UpdateUserDto;
		const user = await adminService.updateUser(id, data);
		return res
			.status(200)
			.json(successResponse('User updated successfully', user));
	} catch (error) {
		return next(error);
	}
};

export const deactivateUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const {id} = req.params as {id: string};
		const user = await adminService.deactivateUser(id);
		return res
			.status(200)
			.json(successResponse('User deactivated successfully', user));
	} catch (error) {
		return next(error);
	}
};

export const reactivateUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const {id} = req.params as {id: string};
		const user = await adminService.reactivateUser(id);
		return res
			.status(200)
			.json(successResponse('User reactivated successfully', user));
	} catch (error) {
		return next(error);
	}
};
