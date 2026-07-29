import {it, describe, expect, vi, beforeEach} from 'vitest';
import {createInitialAdminUser} from './admin.service.ts';
import prisma from '../../prisma.ts';
import {hashPassword} from '../../helpers/password.ts';

vi.mock('../../prisma.ts', () => ({
	default: {
		user: {
			findFirst: vi.fn(),
			create: vi.fn(),
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
const mockCreate = vi.mocked(prisma.user.create);
const mockHashPassword = vi.mocked(hashPassword);

describe('Admin', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should create an initial admin user when no admin exists', async () => {
		mockFindFirst.mockResolvedValue(null);
		mockHashPassword.mockResolvedValue('hashed_password');

		await createInitialAdminUser();

		expect(mockFindFirst).toHaveBeenCalledWith({where: {role: 'ADMIN'}});
		expect(mockHashPassword).toHaveBeenCalled();
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
