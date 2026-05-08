import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import request from 'supertest';
import app from '../../src/app/app.ts';
import {
	clearRedisSessions,
	clearUserTable,
	createTestUser,
	generateRandomTestUser,
	loginWithAgent,
} from './testHelpers.ts';

describe('Authentication Integration Tests', () => {
	let agent: ReturnType<typeof request.agent>;

	beforeEach(async () => {
		agent = request.agent(app);
	});

	afterEach(async () => {
		await clearRedisSessions();
		await clearUserTable();
	});

	it('should fail if username is not allowed when registering', async () => {
		const user = generateRandomTestUser();

		const res = await agent.post('/api/v1/auth/register').send({
			username: 'administrator',
			email: user.email,
			password: user.password,
		});

		expect(res.statusCode).toEqual(409);
		expect(res.body).toStrictEqual({
			success: false,
			error: {
				message: 'The chosen username "administrator" is not allowed',
				code: 'USERNAME_NOT_ALLOWED',
			},
		});
	});

	it('should fail if a field is missing when registering', async () => {
		const user = generateRandomTestUser();

		const res = await agent.post('/api/v1/auth/register').send({
			username: user.username,
			password: user.password,
		});

		expect(res.statusCode).toEqual(400);
		expect(res.body).toHaveProperty('success', false);
		expect(res.body).toHaveProperty('error.code', 'VALIDATION_ERROR');
	});

	it('should register a new user', async () => {
		const user = generateRandomTestUser();
		const res = await agent.post('/api/v1/auth/register').send(user);

		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty('message', 'User registered successfully');
		expect(res.body.data.user).toStrictEqual({
			id: expect.any(String),
			username: user.username,
			email: user.email,
			name: null,
			role: 'USER',
			createdAt: expect.any(String),
		});
	});

	it('should fail if username is already registered when registering', async () => {
		const user = await createTestUser();
		const newUser = generateRandomTestUser();

		const res = await agent
			.post('/api/v1/auth/register')
			.send({...newUser, username: user.username});

		expect(res.statusCode).toEqual(409);
		expect(res.body).toStrictEqual({
			success: false,
			error: {message: 'Username already taken', code: 'USERNAME_TAKEN'},
		});
	});

	it('should fail if email is already registered when registering', async () => {
		const user = await createTestUser();
		const newUser = generateRandomTestUser();

		const res = await agent
			.post('/api/v1/auth/register')
			.send({...newUser, email: user.email});

		expect(res.statusCode).toEqual(409);
		expect(res.body).toStrictEqual({
			success: false,
			error: {message: 'Email already registered', code: 'EMAIL_TAKEN'},
		});
	});

	it('should fail login when incorrect password is passed', async () => {
		const user = await createTestUser();

		const res = await agent.post('/api/v1/auth/login').send({
			email: user.email,
			password: 'WrongPassword!',
		});

		expect(res.statusCode).toEqual(400);
		expect(res.body).toStrictEqual({
			success: false,
			error: {message: 'Invalid email or password', code: 'BAD_REQUEST'},
		});
	});

	it('should login successfully with correct credentials', async () => {
		const user = await createTestUser();

		const res = await agent.post('/api/v1/auth/login').send({
			email: user.email,
			password: user.password,
		});

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('message', 'Login successful');
		expect(res.body.data).toStrictEqual({
			id: expect.any(String),
			username: user.username,
			email: user.email,
			name: null,
			role: 'USER',
		});
		expect(res.headers['set-cookie']).toBeDefined();
	});

	it('should fail registering a new user when there is an active session', async () => {
		const user = await createTestUser();
		await loginWithAgent(agent, user.email, user.password);

		const newUser = generateRandomTestUser();
		const res = await agent.post('/api/v1/auth/register').send(newUser);

		expect(res.statusCode).toEqual(401);
		expect(res.body).toStrictEqual({
			success: false,
			error: {
				message: 'You are already logged in',
				code: 'UNAUTHORIZED',
			},
		});
	});

	it('should get session info successfully if there is an active session', async () => {
		const user = await createTestUser();
		await loginWithAgent(agent, user.email, user.password);

		const res = await agent.get('/api/v1/auth/session');

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('message', 'Session retrieved');
		expect(res.body.data).toStrictEqual({
			isAuthenticated: true,
			user: {
				id: expect.any(String),
				username: user.username,
				email: user.email,
				role: 'USER',
			},
		});
	});

	it('should logout successfully if there is an active session', async () => {
		const user = await createTestUser();
		await loginWithAgent(agent, user.email, user.password);

		const res = await agent.post('/api/v1/auth/logout');

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('message', 'Logout successful');
		expect(res.headers['set-cookie']).toBeDefined();
	});

	it('should have no active session after logout', async () => {
		const user = await createTestUser();
		await loginWithAgent(agent, user.email, user.password);

		const logoutRes = await agent.post('/api/v1/auth/logout');
		expect(logoutRes.headers['set-cookie']).toBeDefined();

		const res = await agent.get('/api/v1/auth/session');

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('message', 'Session retrieved');
		expect(res.body.data).toStrictEqual({
			isAuthenticated: false,
			user: null,
		});
	});
});
