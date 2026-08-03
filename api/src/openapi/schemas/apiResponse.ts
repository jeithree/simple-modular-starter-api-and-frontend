import {z} from 'zod';
import {registry} from '../registry.ts';

export const ErrorResponseSchema = registry.register(
	'ErrorResponse',
	z.object({
		success: z.literal(false),
		error: z.object({
			code: z.string(),
			message: z.string(),
		}),
	}),
);

export const createSuccessResponseSchema = <T extends z.ZodTypeAny>(
	dataSchema: T,
) =>
	z.object({
		success: z.literal(true),
		message: z.string().optional(),
		data: dataSchema,
	});
