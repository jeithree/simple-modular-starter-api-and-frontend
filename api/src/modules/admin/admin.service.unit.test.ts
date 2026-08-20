import {it, describe, expect, vi, beforeEach} from 'vitest';
import {createInitialAdminUser, updateUser} from './admin.service.ts';
import prisma from '../../prisma.ts';
import {hashPassword} from '../../helpers/password.ts';
import {ADMIN_PASSWORD} from '../../configs/basics.ts';

vi.mock('../../prisma.ts', () => ({
	default: {
		user: {
			findFirst: vi.fn(),
			findUnique: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
		},
	},
}));

vi.mock('../../helpers/password.ts', () => ({
	hashPassword: vi.fn(),
}));

vi.mock('../../helpers/logger.ts', () => ({
	logger: {
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
		debug: vi.fn(),
	},
}));

const mockFindFirst = vi.mocked(prisma.user.findFirst);
const mockFindUnique = vi.mocked(prisma.user.findUnique);
const mockCreate = vi.mocked(prisma.user.create);
const mockHashPassword = vi.mocked(hashPassword);

const createMockUser = (overrides = {}) =>
	({
		id: '1',
		email: 'juan@gmail.com',
		username: 'juanOne',
		name: 'Juan',
		role: 'USER',
		isActive: true,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	}) as any;

describe('Admin', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('createInitialAdminUser', () => {
		it('should create an initial admin user when no admin exists', async () => {
			mockFindFirst.mockResolvedValue(null);
			mockHashPassword.mockResolvedValue('hashed_password');

			await createInitialAdminUser();

			expect(mockFindFirst).toHaveBeenCalledWith({where: {role: 'ADMIN'}});
			expect(mockHashPassword).toHaveBeenCalled();
			expect(mockHashPassword).toHaveBeenCalledWith(ADMIN_PASSWORD);
			expect(mockCreate).toHaveBeenCalledOnce();
			expect(mockCreate).toHaveBeenCalledWith({
				data: expect.objectContaining({
					role: 'ADMIN',
					password: 'hashed_password',
				}),
			});
		});

		it('should not create a user if an admin already exists', async () => {
			mockFindFirst.mockResolvedValue({id: '1', role: 'ADMIN'} as any);

			await createInitialAdminUser();

			expect(mockCreate).not.toHaveBeenCalled();
		});

		it('should throw if prisma create fails', async () => {
			mockFindFirst.mockResolvedValue(null);
			mockHashPassword.mockResolvedValue('hashed_password');
			mockCreate.mockRejectedValue(new Error('DB Error'));

			await expect(createInitialAdminUser()).rejects.toThrow('DB Error');
		});
	});

	describe('updateUser', () => {
		it('should not query for existing email if email wasnt changed', async () => {
			const userId = '1';
			const userDataToUpdate = {name: 'juan'};

			mockFindUnique.mockResolvedValueOnce(
				createMockUser({
					id: userId,
					email: 'juan@gmail.com',
					username: 'carlosOne',
					name: 'carlos',
				}),
			);

			await updateUser(userId, userDataToUpdate);

			expect(mockFindUnique).toHaveBeenCalledTimes(1);
			expect(mockFindUnique).toHaveBeenCalledWith({
				where: {id: '1'},
			});
		});
	});
});
