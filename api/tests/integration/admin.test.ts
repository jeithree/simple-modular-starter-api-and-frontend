import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import request from 'supertest';
import app from '../../src/app/app.ts';
import {
	clearRedisSessions,
	clearUserTable,
	createDBTestUser,
	getUserByEmail,
	loginWithAgent,
} from './testHelpers.ts';
import {comparePassword} from '../../src/helpers/password.ts';

describe('Admin Integrations Tests', () => {
	let agent: ReturnType<typeof request.agent>;

	beforeEach(async () => {
		agent = request.agent(app);
	});

	afterEach(async () => {
		await clearRedisSessions();
		await clearUserTable();
	});

	describe('GET /users', () => {
		it('should fail if admin is not authenticated', async () => {
			const res = await agent.get('/api/v1/admin/users?q=juan');
			expect(res.statusCode).toEqual(401);
			expect(res.body).toHaveProperty('success', false);
			expect(res.body.error).toStrictEqual({
				message: 'You must be logged in to access this resource',
				code: 'UNAUTHORIZED',
			});
		});

		it('should fail if authenticated user`s role is not admin', async () => {
			const user = await createDBTestUser();
			await loginWithAgent(agent, user.email, user.password);

			const res = await agent.get('/api/v1/admin/users?q=juan');

			expect(res.statusCode).toEqual(401);
			expect(res.body).toHaveProperty('success', false);
			expect(res.body.error).toStrictEqual({
				message: 'You do not have admin privileges',
				code: 'UNAUTHORIZED',
			});
		});

		it('should get users list when user is authenticated and has the role admin', async () => {
			const user1 = await createDBTestUser({username: 'juanOne'});
			const user2 = await createDBTestUser({username: 'juanTwo'});

			const adminUser = await createDBTestUser({role: 'ADMIN'});
			await loginWithAgent(agent, adminUser.email, adminUser.password);

			const res = await agent.get('/api/v1/admin/users?q=juan');

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty('success', true);
			expect(res.body.data).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: expect.any(String),
						username: user1.username,
						email: user1.email,
						name: null,
						role: 'USER',
						isActive: user1.isActive,
						createdAt: expect.any(String),
						updatedAt: expect.any(String),
					}),
					expect.objectContaining({
						id: expect.any(String),
						username: user2.username,
						email: user2.email,
						name: null,
						role: 'USER',
						isActive: user2.isActive,
						createdAt: expect.any(String),
						updatedAt: expect.any(String),
					}),
				]),
			);
		});

		it('should get the right user by the query passed', async () => {
			const user1 = await createDBTestUser({username: 'juanOne'});
			await createDBTestUser({username: 'juanTwo'});

			const adminUser = await createDBTestUser({role: 'ADMIN'});
			await loginWithAgent(agent, adminUser.email, adminUser.password);

			const res = await agent.get('/api/v1/admin/users?q=juanOne');

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty('success', true);
			expect(res.body.data).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: expect.any(String),
						username: user1.username,
						email: user1.email,
						name: null,
						role: 'USER',
						isActive: user1.isActive,
						createdAt: expect.any(String),
						updatedAt: expect.any(String),
					}),
				]),
			);
		});
	});

	describe('PATCH /users/:id', () => {
		it('should fail if user doesnt exists', async () => {
			await createDBTestUser();
			const fakeId = 'user_1';

			const adminUser = await createDBTestUser({role: 'ADMIN'});
			await loginWithAgent(agent, adminUser.email, adminUser.password);

			const res = await agent.patch(`/api/v1/admin/users/${fakeId}`).send({
				name: 'juan',
			});

			expect(res.statusCode).toEqual(404);
			expect(res.body).toHaveProperty('success', false);
			expect(res.body.error).toStrictEqual({
				message: 'User not found',
				code: 'NOT_FOUND',
			});
		});

		it('should not update email if the new email is already in use', async () => {
			const user1 = await createDBTestUser();
			const user2 = await createDBTestUser();

			const adminUser = await createDBTestUser({role: 'ADMIN'});
			await loginWithAgent(agent, adminUser.email, adminUser.password);

			const res = await agent.patch(`/api/v1/admin/users/${user1.id}`).send({
				email: user2.email,
			});

			expect(res.statusCode).toEqual(409);
			expect(res.body).toHaveProperty('success', false);
			expect(res.body.error).toStrictEqual({
				message: 'Email is already in use',
				code: 'EMAIL_TAKEN',
			});
		});

		it('should update only email, not name', async () => {
			const user = await createDBTestUser();
			const newEmail = 'new@test.com';

			const adminUser = await createDBTestUser({role: 'ADMIN'});
			await loginWithAgent(agent, adminUser.email, adminUser.password);

			const res = await agent.patch(`/api/v1/admin/users/${user.id}`).send({
				name: undefined,
				email: newEmail.toUpperCase(),
			});

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty('success', true);
			expect(res.body.data).toStrictEqual({
				id: expect.any(String),
				username: user.username,
				email: newEmail,
				name: null,
				role: 'USER',
				isActive: user.isActive,
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			});
		});

		it('should update only name, not email', async () => {
			const user = await createDBTestUser({name: 'juan'});

			const adminUser = await createDBTestUser({role: 'ADMIN'});
			await loginWithAgent(agent, adminUser.email, adminUser.password);

			const res = await agent.patch(`/api/v1/admin/users/${user.id}`).send({
				name: '',
				email: undefined,
			});

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty('success', true);
			expect(res.body.data).toStrictEqual({
				id: expect.any(String),
				username: user.username,
				email: user.email,
				name: '',
				role: 'USER',
				isActive: user.isActive,
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			});
		});

		it('should update and hash password', async () => {
			const user = await createDBTestUser();
			const newPassword = 'NewPassword123!';

			const adminUser = await createDBTestUser({role: 'ADMIN'});
			await loginWithAgent(agent, adminUser.email, adminUser.password);

			const res = await agent.patch(`/api/v1/admin/users/${user.id}`).send({
				password: newPassword,
			});

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty('success', true);
			expect(res.body.data).toStrictEqual({
				id: expect.any(String),
				username: user.username,
				email: user.email,
				name: null,
				role: 'USER',
				isActive: user.isActive,
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			});

			const dbUser = await getUserByEmail(user.email);
			expect(dbUser?.password).not.toBe(newPassword);

			const isValid = await comparePassword(newPassword, dbUser!.password);
			expect(isValid).toBe(true);
		});
	});

	describe('PATCH /users/:id/deactivate', () => {
		it('should fail if user doesnt exists', async () => {
			await createDBTestUser();
			const fakeId = 'user_1';

			const adminUser = await createDBTestUser({role: 'ADMIN'});
			await loginWithAgent(agent, adminUser.email, adminUser.password);

			const res = await agent.patch(`/api/v1/admin/users/${fakeId}/deactivate`);

			expect(res.statusCode).toEqual(404);
			expect(res.body).toHaveProperty('success', false);
			expect(res.body.error).toStrictEqual({
				message: 'User not found',
				code: 'NOT_FOUND',
			});
		});

		it('should deactivate user and invalidate his sessions', async () => {
			const user = await createDBTestUser();

			const adminUser = await createDBTestUser({role: 'ADMIN'});
			await loginWithAgent(agent, adminUser.email, adminUser.password);

			const res = await agent.patch(
				`/api/v1/admin/users/${user.id}/deactivate`,
			);

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty('success', true);

			expect(res.body.data).toStrictEqual({
				id: expect.any(String),
				username: user.username,
				email: user.email,
				name: null,
				role: 'USER',
				isActive: !user.isActive,
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			});
		});
	});

	describe('PATCH /users/:id/reactivate', () => {
		it('should fail if user doesnt exists', async () => {
			await createDBTestUser();
			const fakeId = 'user_1';

			const adminUser = await createDBTestUser({role: 'ADMIN'});
			await loginWithAgent(agent, adminUser.email, adminUser.password);

			const res = await agent.patch(`/api/v1/admin/users/${fakeId}/reactivate`);

			expect(res.statusCode).toEqual(404);
			expect(res.body).toHaveProperty('success', false);
			expect(res.body.error).toStrictEqual({
				message: 'User not found',
				code: 'NOT_FOUND',
			});
		});

		it('should activate an user', async () => {
			const user = await createDBTestUser({isActive: false});

			const adminUser = await createDBTestUser({role: 'ADMIN'});
			await loginWithAgent(agent, adminUser.email, adminUser.password);

			const res = await agent.patch(
				`/api/v1/admin/users/${user.id}/reactivate`,
			);

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty('success', true);

			expect(res.body.data).toStrictEqual({
				id: expect.any(String),
				username: user.username,
				email: user.email,
				name: null,
				role: 'USER',
				isActive: !user.isActive,
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			});
		});
	});
});
