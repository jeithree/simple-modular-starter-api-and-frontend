import {z} from 'zod';

export const updateUserSchema = z
	.object({
		name: z.string().max(100, 'Name must be at most 100 characters').optional(),
		email: z.email('Invalid email format').optional(),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.max(100, 'Password must be at most 100 characters')
			.refine(
				(val) => /[a-z]/.test(val),
				'Password must contain at least one lowercase letter',
			)
			.refine(
				(val) => /[A-Z]/.test(val),
				'Password must contain at least one uppercase letter',
			)
			.refine(
				(val) => /[0-9]/.test(val),
				'Password must contain at least one number',
			)
			.refine(
				(val) => /[^a-zA-Z0-9]/.test(val),
				'Password must contain at least one special character',
			)
			.optional(),
	})
	.refine((data) => Object.values(data).some((v) => v !== undefined), {
		message: 'At least one field must be provided',
	});
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
