import {z} from 'zod';
import {registry} from '../registry.ts';

export const UserSchema = registry.register(
	'User',
	z.object({
		id: z.string(),
		username: z.string(),
		email: z.email(),
		name: z.string().nullable(),
		role: z.enum(['USER', 'ADMIN']),
		createdAt: z.string(),
	}),
);
