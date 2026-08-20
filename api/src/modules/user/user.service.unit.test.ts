import {describe, it, vi, expect, beforeEach} from 'vitest';
import {getUserSessionCount} from './user.service.ts';
import redisClient from '../../redisClient.ts';
import {USER_SESSION_SET_PREFIX} from '../../configs/basics.ts';

vi.mock('../../helpers/logger.ts', () => ({
	logger: {
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
		debug: vi.fn(),
	},
}));

vi.mock('../../redisClient.ts', () => ({
	default: {
		sMembers: vi.fn(),
	},
}));

const mockSMembers = vi.mocked(redisClient.sMembers);

describe('User', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('getUserSessionCount', () => {
		it('should return 0 if there is an error while fetching sessions', async () => {
			const userId = '1';
			mockSMembers.mockRejectedValue(new Error('Redis Error'));

			const sessionCount = await getUserSessionCount(userId);

			expect(mockSMembers).toHaveBeenCalledOnce();
			expect(mockSMembers).toHaveBeenCalledWith(
				`${USER_SESSION_SET_PREFIX}${userId}`,
			);
			expect(sessionCount).toBe(0);
		});
	});
});
