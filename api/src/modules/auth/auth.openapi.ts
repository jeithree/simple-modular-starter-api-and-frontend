import {z} from 'zod';
import {registry} from '../../openapi/registry.ts';
import {UserSchema} from '../../openapi/schemas/user.ts';
import {
	ErrorResponseSchema,
	createSuccessResponseSchema,
} from '../../openapi/schemas/apiResponse.ts';
import {registerSchema, loginSchema} from './auth.types.ts';

export const registerAuthOpenApi = () => {
	const RegisterResponseSchema = registry.register(
		'RegisterResponse',
		createSuccessResponseSchema(UserSchema),
	);

	const LoginResponseSchema = registry.register(
		'LoginResponse',
		createSuccessResponseSchema(UserSchema),
	);

	const SessionResponseSchema = registry.register(
		'SessionResponse',
		createSuccessResponseSchema(
			z.object({
				isAuthenticated: z.boolean(),
				user: z
					.object({
						id: z.string(),
						username: z.string(),
						email: z.email(),
						role: z.enum(['USER', 'ADMIN']),
					})
					.nullable(),
			}),
		),
	);

	registry.registerPath({
		method: 'post',
		path: '/api/v1/auth/register',
		summary: 'Register a new user',
		tags: ['Auth'],
		request: {
			body: {
				content: {'application/json': {schema: registerSchema}},
			},
		},
		responses: {
			201: {
				description: 'User registered successfully',
				content: {'application/json': {schema: RegisterResponseSchema}},
			},
			400: {
				description: 'Validation error',
				content: {'application/json': {schema: ErrorResponseSchema}},
			},
			401: {
				description: 'Already authenticated',
				content: {'application/json': {schema: ErrorResponseSchema}},
			},
			409: {
				description: 'Username or email already exists',
				content: {'application/json': {schema: ErrorResponseSchema}},
			},
		},
	});

	registry.registerPath({
		method: 'post',
		path: '/api/v1/auth/login',
		summary: 'Login with email and password',
		tags: ['Auth'],
		request: {
			body: {
				content: {'application/json': {schema: loginSchema}},
			},
		},
		responses: {
			200: {
				description: 'Login successful',
				content: {'application/json': {schema: LoginResponseSchema}},
			},
			400: {
				description: 'Invalid credentials or validation error',
				content: {'application/json': {schema: ErrorResponseSchema}},
			},
			401: {
				description: 'Already authenticated',
				content: {'application/json': {schema: ErrorResponseSchema}},
			},
		},
	});

	registry.registerPath({
		method: 'post',
		path: '/api/v1/auth/logout',
		summary: 'Logout the current session',
		tags: ['Auth'],
		responses: {
			200: {
				description: 'Logout successful',
				content: {
					'application/json': {schema: createSuccessResponseSchema(z.null())},
				},
			},
			401: {
				description: 'Authentication required',
				content: {'application/json': {schema: ErrorResponseSchema}},
			},
		},
	});

	registry.registerPath({
		method: 'get',
		path: '/api/v1/auth/session',
		summary: 'Get session details',
		tags: ['Auth'],
		responses: {
			200: {
				description: 'Session retrieved',
				content: {'application/json': {schema: SessionResponseSchema}},
			},
		},
	});
};
