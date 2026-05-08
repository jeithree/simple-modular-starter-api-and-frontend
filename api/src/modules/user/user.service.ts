import prisma from '../../prisma.ts';
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
	const user = await prisma.user.update({
		where: {id: userId},
		data: data,
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
