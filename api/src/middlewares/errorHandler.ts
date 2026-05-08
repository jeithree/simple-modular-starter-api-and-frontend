import type {Request, Response, NextFunction} from 'express';
import {AppError} from '../lib/appError.ts';
import {errorResponse} from '../lib/apiResponse.ts';
import * as Logger from '../helpers/logger.ts';

export const errorHandler = async (
	err: Error | AppError,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	if (err instanceof AppError) {
		return res
			.status(err.statusCode)
			.json(errorResponse(err.errorCode, err.message));
	}

	// Unknown error
	Logger.log(`Unhandled error: ${err.stack || err.message}`, 'error');
	return res
		.status(500)
		.json(
			errorResponse('INTERNAL_SERVER_ERROR', 'An unexpected error occurred'),
		);
};
