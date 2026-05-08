import prisma from '../../prisma.ts';
import {hashPassword} from '../../helpers/password.ts';
import {
	ADMIN_USERNAME,
	ADMIN_EMAIL,
	ADMIN_PASSWORD,
} from '../../configs/basics.ts';
import * as Logger from '../../helpers/logger.ts';

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
