import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import request from 'supertest';
import app from '../../src/app/app.ts';
import {
	createDBTestUser,
	loginWithAgent,
	clearRedisSessions,
	clearUserTable,
	getUserSessionCount,
	getUserByEmail,
} from './testHelpers.ts';
import {comparePassword} from '../../src/helpers/password.ts';

describe('User Integration Tests', () => {
	let agent: ReturnType<typeof request.agent>;

	beforeEach(async () => {
		agent = request.agent(app);
	});

	afterEach(async () => {
		await clearRedisSessions();
		await clearUserTable();
	});

	describe('GET /me', () => {
		it('should fail if user is not authenticated', async () => {
			const res = await agent.get('/api/v1/users/me');
			expect(res.statusCode).toEqual(401);
			expect(res.body).toHaveProperty('success', false);
			expect(res.body.error).toStrictEqual({
				message: 'You must be logged in to access this resource',
				code: 'UNAUTHORIZED',
			});
		});

		it('should get current user profile', async () => {
			const user = await createDBTestUser();
			await loginWithAgent(agent, user.email, user.password);

			const res = await agent.get('/api/v1/users/me');

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty('success', true);
			expect(res.body.data).toStrictEqual({
				id: expect.any(String),
				username: user.username,
				email: user.email,
				name: null,
				avatar: null,
				role: 'USER',
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			});
		});
	});

	describe('PATCH /me', () => {
		it('should update the user name and avatar', async () => {
			const user = await createDBTestUser();
			await loginWithAgent(agent, user.email, user.password);

			const res = await agent.patch('/api/v1/users/me').send({
				name: 'juan',
				avatar: 'https://example.com/juan.jpg',
			});

			expect(res.statusCode).toBe(200);
			expect(res.body.data).toMatchObject({
				name: 'juan',
				avatar: 'https://example.com/juan.jpg',
			});
		});

		it('should update user profile', async () => {
			const user = await createDBTestUser();
			await loginWithAgent(agent, user.email, user.password);

			const res = await agent.patch('/api/v1/users/me').send({
				name: 'Updated Name',
				avatar: 'https://example.com/avatar.png',
			});

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty(
				'message',
				'Profile updated successfully',
			);
			expect(res.body).toHaveProperty('success', true);
			expect(res.body.data).toStrictEqual({
				id: expect.any(String),
				username: user.username,
				email: user.email,
				name: 'Updated Name',
				avatar: 'https://example.com/avatar.png',
				role: 'USER',
				updatedAt: expect.any(String),
			});
		});

		it('should update name and avatar to empty', async () => {
			const user = await createDBTestUser();
			await loginWithAgent(agent, user.email, user.password);

			const res = await agent.patch('/api/v1/users/me').send({
				name: '',
				avatar: '',
			});

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty(
				'message',
				'Profile updated successfully',
			);
			expect(res.body).toHaveProperty('success', true);
			expect(res.body.data).toStrictEqual({
				id: expect.any(String),
				username: user.username,
				email: user.email,
				name: '',
				avatar: '',
				role: 'USER',
				updatedAt: expect.any(String),
			});
		});

		it('should update the user password', async () => {
			const user = await createDBTestUser();
			await loginWithAgent(agent, user.email, user.password);

			const newPassword = 'NewPassword123!';

			const res = await agent.patch('/api/v1/users/me').send({
				password: newPassword,
			});

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty(
				'message',
				'Profile updated successfully',
			);
			expect(res.body).toHaveProperty('success', true);
			expect(res.body.data).toStrictEqual({
				id: expect.any(String),
				username: user.username,
				email: user.email,
				name: user.name,
				avatar: user.avatar,
				role: 'USER',
				updatedAt: expect.any(String),
			});

			const dbUser = await getUserByEmail(user.email);
			expect(dbUser?.password).not.toBe(newPassword);

			const isValid = await comparePassword(newPassword, dbUser!.password);
			expect(isValid).toBe(true);
		});
	});

	describe('GET /me/sessions', () => {
		it('should get user session count', async () => {
			const user = await createDBTestUser();
			const agent2 = request.agent(app);

			await loginWithAgent(agent, user.email, user.password);
			await loginWithAgent(agent2, user.email, user.password);

			const userSessionCount = await getUserSessionCount(user.id);
			expect(userSessionCount).toBe(2);

			const res = await agent.get('/api/v1/users/me/sessions');

			expect(res.statusCode).toEqual(200);
			expect(res.body).toHaveProperty('message', 'Sessions retrieved');
			expect(res.body).toHaveProperty('success', true);
			expect(res.body.data).toStrictEqual({
				count: 2,
			});
		});
	});

	describe('DELETE /me/sessions', () => {
		it('should delete user sessions', async () => {
			const user = await createDBTestUser();
			const agent2 = request.agent(app);

			await loginWithAgent(agent, user.email, user.password);
			await loginWithAgent(agent2, user.email, user.password);

			const userSessionCount = await getUserSessionCount(user.id);
			expect(userSessionCount).toBe(2);

			const meRes = await agent.get('/api/v1/users/me');

			expect(meRes.statusCode).toEqual(200);
			expect(meRes.body).toHaveProperty('success', true);

			const meAgent2Res = await agent2.get('/api/v1/users/me');

			expect(meAgent2Res.statusCode).toEqual(200);
			expect(meAgent2Res.body).toHaveProperty('success', true);

			const delSessRes = await agent.delete('/api/v1/users/me/sessions');

			expect(delSessRes.statusCode).toEqual(200);
			expect(delSessRes.body).toHaveProperty(
				'message',
				'All sessions killed successfully',
			);
			expect(delSessRes.body).toHaveProperty('success', true);

			const userSessionCountAfter = await getUserSessionCount(user.id);
			expect(userSessionCountAfter).toBe(0);

			const meTwoRes = await agent.get('/api/v1/users/me');

			expect(meTwoRes.statusCode).toEqual(401);
			expect(meTwoRes.body).toHaveProperty('success', false);

			const meTwoAgent2Res = await agent2.get('/api/v1/users/me');

			expect(meTwoAgent2Res.statusCode).toEqual(401);
			expect(meTwoAgent2Res.body).toHaveProperty('success', false);
		});
	});
});
