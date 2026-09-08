import type {Request, Response} from 'express';
import {successResponse} from '../../lib/apiResponse.ts';

export const healthCheck = (_req: Request, res: Response) => {
	return res.status(200).json(successResponse('API is healthy'));
};
