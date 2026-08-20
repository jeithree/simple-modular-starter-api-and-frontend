import request from 'supertest';
import prisma from '../../src/prisma.ts';
import {hashPassword} from '../../src/helpers/password.ts';
import {
	SESSION_KEY_PREFIX,
	USER_SESSION_SET_PREFIX,
} from '../../src/configs/basics.ts';
import redisClient from '../../src/redisClient.ts';

export const generateRandomTestUser = () => {
	const randomId = Math.random().toString(36).substring(2, 10);
	return {
		username: `testuser_${randomId}`,
		email: `user_${randomId}@test.com`,
		password: 'Password123!',
	};
};

export const createDBTestUser = async (
	override: {
		name?: string;
		username?: string;
		email?: string;
		password?: string;
		role?: 'USER' | 'ADMIN';
		isActive?: boolean;
	} = {},
) => {
	const plainPassword = override.password || 'Password123!';
	const hashedPassword = await hashPassword(plainPassword);
	const randomId = Math.random().toString(36).substring(2, 10);

	const user = await prisma.user.create({
		data: {
			name: override.name || null,
			username: override.username || `testuser_${randomId}`,
			email: override.email || `user_${randomId}@test.com`,
			password: hashedPassword,
			role: override.role || 'USER',
			isActive: override.isActive !== undefined ? override.isActive : true,
		},
	});

	// Return user with plain password for testing
	return {
		...user,
		password: plainPassword,
	};
};

export const updateUser = async (
	userId: string,
	data: {
		name?: string | null;
		username?: string;
		email?: string;
		role?: 'USER' | 'ADMIN';
		isActive?: boolean;
	},
) => {
	const updateData: Record<string, any> = {};
	if (data.name !== undefined) updateData.name = data.name;
	if (data.username) updateData.username = data.username;
	if (data.email) updateData.email = data.email;
	if (data.role) updateData.role = data.role;
	if (data.isActive !== undefined) updateData.isActive = data.isActive;

	const updatedUser = await prisma.user.update({
		where: {id: userId},
		data: updateData,
		select: {
			id: true,
			username: true,
			email: true,
			name: true,
			role: true,
			isActive: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	return updatedUser;
};

export const getUserByEmail = async (email: string) => {
	const dbUser = await prisma.user.findUnique({
		where: {email: email},
	});
	return dbUser;
};

export const clearUserTable = async () => {
	await prisma.user.deleteMany({});
};

export const loginWithAgent = async (
	agent: ReturnType<typeof request.agent>,
	email: string,
	password: string,
) => {
	const res = await agent.post('/api/v1/auth/login').send({email, password});

	if (res.status !== 200) {
		throw new Error('Login failed in test helper');
	}
};

export const getUserSessionCount = async (userId: string) => {
	const sessionIds = await redisClient.sMembers(
		`${USER_SESSION_SET_PREFIX}${userId}`,
	);
	return sessionIds.length;
};

export const clearRedisSessions = async () => {
	const keys = await redisClient.keys(`${SESSION_KEY_PREFIX}*`);
	if (keys.length > 0) {
		await redisClient.del(keys);
	}
};
