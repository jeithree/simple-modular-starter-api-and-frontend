import prisma from '../../prisma.ts';
import {hashPassword} from '../../helpers/password.ts';
import redisClient from '../../redisClient.ts';
import {SESSION_REDIS_PREFIX} from '../../configs/basics.ts';
import {type UpdateProfileDto} from './user.types.ts';

export const getUserById = async (userId: string) => {
	const user = await prisma.user.findUnique({
		where: {id: userId},
		select: {
			id: true,
			username: true,
			email: true,
			name: true,
			avatar: true,
			role: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	return user;
};

export const updateUser = async (userId: string, data: UpdateProfileDto) => {
	const updateData: Record<string, unknown> = {};
	if (data.name !== undefined) updateData.name = data.name;
	if (data.avatar !== undefined) updateData.avatar = data.avatar;
	if (data.password) updateData.password = await hashPassword(data.password);

	const user = await prisma.user.update({
		where: {id: userId},
		data: updateData,
		select: {
			id: true,
			username: true,
			email: true,
			name: true,
			avatar: true,
			role: true,
			updatedAt: true,
		},
	});

	return user;
};

export const getUserSessionCount = async (userId: string) => {
	const keys = await redisClient.keys(`${SESSION_REDIS_PREFIX}*`);
	let count = 0;
	for (const key of keys) {
		const raw = await redisClient.get(key);
		if (!raw) continue;
		try {
			const parsed = JSON.parse(raw);
			if (parsed.userId === userId) count++;
		} catch {
			// skip unparseable session
		}
	}
	return count;
};

export const killAllUserSessions = async (userId: string) => {
	const keys = await redisClient.keys(`${SESSION_REDIS_PREFIX}*`);
	for (const key of keys) {
		const raw = await redisClient.get(key);
		if (!raw) continue;
		try {
			const parsed = JSON.parse(raw);
			if (parsed.userId === userId) await redisClient.del(key);
		} catch {
			// skip unparseable session
		}
	}
};
