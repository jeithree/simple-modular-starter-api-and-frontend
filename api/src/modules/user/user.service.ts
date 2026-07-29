import prisma from '../../prisma.ts';
import {hashPassword} from '../../helpers/password.ts';
import redisClient from '../../redisClient.ts';
import {SESSION_REDIS_PREFIX} from '../../configs/basics.ts';
import {type UpdateProfileDto} from './user.types.ts';
import {logger} from '../../helpers/logger.ts';

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
	try {
		const sessionIds = await redisClient.sMembers(`user_sessions:${userId}`);
		return sessionIds.length;
	} catch (err) {
		logger.error(
			{
				err,
				userId,
			},
			'Error getting user session count',
		);

		return 0;
	}
};

export const killAllUserSessions = async (userId: string) => {
	try {
		const sessionIds = await redisClient.sMembers(`user_sessions:${userId}`);

		if (sessionIds.length === 0) {
			return;
		}

		const sessionKeys = sessionIds.map(
			(sessionId) => `${SESSION_REDIS_PREFIX}${sessionId}`,
		);

		await redisClient.del(sessionKeys);
		await redisClient.del(`user_sessions:${userId}`);

		logger.info(
			{
				userId,
				sessionsDeleted: sessionIds.length,
			},
			'All user sessions killed',
		);
	} catch (err) {
		logger.error(
			{
				err,
				userId,
			},
			'Error killing user sessions',
		);
	}
};
