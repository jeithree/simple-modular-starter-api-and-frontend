import {z} from 'zod';

export const updateUserSchema = z.object({
	name: z
		.string()
		.max(100, 'Name must be at most 100 characters')
		.optional(),
	email: z.email('Invalid email address').optional(),
	password: z
		.string()
		.refine(
			(val) => !val || val.length >= 8,
			'Password must be at least 8 characters',
		)
		.refine(
			(val) => !val || val.length <= 100,
			'Password must be at most 100 characters',
		)
		.refine(
			(val) => !val || /[a-z]/.test(val),
			'Password must contain at least one lowercase letter',
		)
		.refine(
			(val) => !val || /[A-Z]/.test(val),
			'Password must contain at least one uppercase letter',
		)
		.refine(
			(val) => !val || /[0-9]/.test(val),
			'Password must contain at least one number',
		)
		.refine(
			(val) => !val || /[^a-zA-Z0-9]/.test(val),
			'Password must contain at least one special character',
		)
		.optional(),
});
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export type AdminUser = {
	id: string;
	username: string;
	email: string;
	name?: string | null;
	role: 'USER';
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
};
