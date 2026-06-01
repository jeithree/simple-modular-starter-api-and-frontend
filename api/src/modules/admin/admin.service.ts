import type {UpdateUserDto} from './admin.types.ts';
import prisma from '../../prisma.ts';
import {hashPassword} from '../../helpers/password.ts';
import {ConflictError, NotFoundError} from '../../lib/appError.ts';
import {
	ADMIN_USERNAME,
	ADMIN_EMAIL,
	ADMIN_PASSWORD,
	SESSION_REDIS_PREFIX,
} from '../../configs/basics.ts';
import * as Logger from '../../helpers/logger.ts';
import redisClient from '../../redisClient.ts';

export const createInitialAdminUser = async () => {
	const existingAdmin = await prisma.user.findFirst({
		where: {role: 'ADMIN'},
	});
	if (existingAdmin) {
		return;
	}

	const hashedPassword = await hashPassword(ADMIN_PASSWORD);
	try {
		await prisma.user.create({
			data: {
				username: ADMIN_USERNAME.toLowerCase(),
				email: ADMIN_EMAIL.toLowerCase(),
				password: hashedPassword,
				role: 'ADMIN',
			},
		});
	} catch (error) {
		Logger.log(error, 'error');
		throw error;
	}
};

const USER_SELECT = {
	id: true,
	username: true,
	email: true,
	name: true,
	role: true,
	isActive: true,
	createdAt: true,
	updatedAt: true,
} as const;

export const searchUsers = async (query: string) => {
	const users = await prisma.user.findMany({
		where: {
			role: 'USER',
			OR: [
				{id: {contains: query}},
				{email: {contains: query.toLowerCase()}},
				{username: {contains: query.toLowerCase()}},
				{name: {contains: query}},
			],
		},
		select: USER_SELECT,
		orderBy: {createdAt: 'desc'},
		take: 50,
	});

	return users;
};

export const updateUser = async (userId: string, data: UpdateUserDto) => {
	const user = await prisma.user.findUnique({where: {id: userId}});
	if (!user) throw new NotFoundError('User not found');

	if (data.email && data.email.toLowerCase() !== user.email) {
		const existing = await prisma.user.findUnique({
			where: {email: data.email.toLowerCase()},
		});
		if (existing)
			throw new ConflictError('Email is already in use', 'EMAIL_TAKEN');
	}

	const updateData: Record<string, unknown> = {};
	if (data.name !== undefined) updateData.name = data.name;
	if (data.email) updateData.email = data.email.toLowerCase();
	if (data.password) updateData.password = await hashPassword(data.password);

	const updated = prisma.user.update({
		where: {id: userId},
		data: updateData,
		select: USER_SELECT,
	});

	return updated;
};

const invalidateUserSessions = async (userId: string) => {
	try {
		const keys = await redisClient.keys(`${SESSION_REDIS_PREFIX}*`);
		for (const key of keys) {
			const raw = await redisClient.get(key);
			if (!raw) continue;
			try {
				const parsed = JSON.parse(raw);
				if (parsed.userId === userId) {
					await redisClient.del(key);
				}
			} catch {
				// skip unparseable session
			}
		}
	} catch (err) {
		Logger.log(
			`Error invalidating sessions for user ${userId}: ${err}`,
			'error',
		);
	}
};

export const deactivateUser = async (userId: string) => {
	const user = await prisma.user.findUnique({where: {id: userId}});
	if (!user) throw new NotFoundError('User not found');

	const updated = await prisma.user.update({
		where: {id: userId},
		data: {isActive: false},
		select: USER_SELECT,
	});

	await invalidateUserSessions(userId);

	return updated;
};

export const reactivateUser = async (userId: string) => {
	const user = await prisma.user.findUnique({where: {id: userId}});
	if (!user) throw new NotFoundError('User not found');

	const updated = prisma.user.update({
		where: {id: userId},
		data: {isActive: true},
		select: USER_SELECT,
	});

	return updated;
};
