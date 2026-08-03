import {z} from 'zod';
import {registry} from '../../openapi/registry.ts';
import {UserSchema} from '../../openapi/schemas/user.ts';
import {
	ErrorResponseSchema,
	createSuccessResponseSchema,
} from '../../openapi/schemas/apiResponse.ts';
import {updateProfileSchema} from './user.types.ts';

export const registerUserOpenApi = () => {
	const MeResponseSchema = registry.register(
		'MeResponse',
		createSuccessResponseSchema(UserSchema),
	);

	const UpdateProfileResponseSchema = registry.register(
		'UpdateProfileResponse',
		createSuccessResponseSchema(UserSchema),
	);

	const SessionsResponseSchema = registry.register(
		'SessionsResponse',
		createSuccessResponseSchema(
			z.object({count: z.number().int().nonnegative()}),
		),
	);

	registry.registerPath({
		method: 'get',
		path: '/api/v1/users/me',
		summary: 'Get the current user',
		tags: ['Users'],
		responses: {
			200: {
				description: 'User retrieved',
				content: {'application/json': {schema: MeResponseSchema}},
			},
			401: {
				description: 'Authentication required',
				content: {'application/json': {schema: ErrorResponseSchema}},
			},
			404: {
				description: 'User not found',
				content: {'application/json': {schema: ErrorResponseSchema}},
			},
		},
	});

	registry.registerPath({
		method: 'patch',
		path: '/api/v1/users',
		summary: 'Update the current user profile',
		tags: ['Users'],
		request: {
			body: {
				content: {'application/json': {schema: updateProfileSchema}},
			},
		},
		responses: {
			200: {
				description: 'Profile updated',
				content: {'application/json': {schema: UpdateProfileResponseSchema}},
			},
			400: {
				description: 'Validation error',
				content: {'application/json': {schema: ErrorResponseSchema}},
			},
			401: {
				description: 'Authentication required',
				content: {'application/json': {schema: ErrorResponseSchema}},
			},
		},
	});

	registry.registerPath({
		method: 'get',
		path: '/api/v1/users/sessions',
		summary: 'Count active sessions for the current user',
		tags: ['Users'],
		responses: {
			200: {
				description: 'Sessions retrieved',
				content: {'application/json': {schema: SessionsResponseSchema}},
			},
			401: {
				description: 'Authentication required',
				content: {'application/json': {schema: ErrorResponseSchema}},
			},
		},
	});

	registry.registerPath({
		method: 'delete',
		path: '/api/v1/users/sessions',
		summary: 'Kill all sessions for the current user',
		tags: ['Users'],
		responses: {
			200: {
				description: 'All sessions killed',
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
};
