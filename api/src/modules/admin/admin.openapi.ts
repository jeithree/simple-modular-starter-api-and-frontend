import {z} from 'zod';
import {registry} from '../../openapi/registry.ts';
import {UserSchema} from '../../openapi/schemas/user.ts';
import {
	ErrorResponseSchema,
	createSuccessResponseSchema,
} from '../../openapi/schemas/apiResponse.ts';
import {updateUserSchema} from './admin.types.ts';

export const registerAdminOpenApi = () => {
	const UsersListResponseSchema = registry.register(
		'UsersListResponse',
		createSuccessResponseSchema(
			z.object({
				users: z.array(UserSchema),
			}),
		),
	);

	const UpdateUserResponseSchema = registry.register(
		'UpdateUserResponse',
		createSuccessResponseSchema(UserSchema),
	);

	const userIdParam = z.object({id: z.string()});

	registry.registerPath({
		method: 'get',
		path: '/api/v1/admin/users',
		summary: 'Search users',
		tags: ['Admin'],
		request: {
			query: z.object({q: z.string().optional()}),
		},
		responses: {
			200: {
				description: 'Users retrieved',
				content: {'application/json': {schema: UsersListResponseSchema}},
			},
			401: {
				description: 'Authentication required',
				content: {'application/json': {schema: ErrorResponseSchema}},
			},
		},
	});

	registry.registerPath({
		method: 'patch',
		path: '/api/v1/admin/users/{id}',
		summary: 'Update a user',
		tags: ['Admin'],
		request: {
			params: userIdParam,
			body: {content: {'application/json': {schema: updateUserSchema}}},
		},
		responses: {
			200: {
				description: 'User updated',
				content: {'application/json': {schema: UpdateUserResponseSchema}},
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
		method: 'patch',
		path: '/api/v1/admin/users/{id}/deactivate',
		summary: 'Deactivate a user',
		tags: ['Admin'],
		request: {params: userIdParam},
		responses: {
			200: {
				description: 'User deactivated',
				content: {'application/json': {schema: UpdateUserResponseSchema}},
			},
			401: {
				description: 'Authentication required',
				content: {'application/json': {schema: ErrorResponseSchema}},
			},
		},
	});

	registry.registerPath({
		method: 'patch',
		path: '/api/v1/admin/users/{id}/reactivate',
		summary: 'Reactivate a user',
		tags: ['Admin'],
		request: {params: userIdParam},
		responses: {
			200: {
				description: 'User reactivated',
				content: {'application/json': {schema: UpdateUserResponseSchema}},
			},
			401: {
				description: 'Authentication required',
				content: {'application/json': {schema: ErrorResponseSchema}},
			},
		},
	});
};
