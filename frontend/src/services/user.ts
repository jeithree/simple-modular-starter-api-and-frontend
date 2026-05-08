import {apiFetch} from '@/lib/fetcher';
import type {UpdateProfileData} from '@/types/auth';
import type {UserResponse} from '@/types/user';

export async function getProfile() {
	return apiFetch<{user: UserResponse}>('/api/v1/users/me');
}

export async function updateProfile(data: UpdateProfileData) {
	return apiFetch<{user: UserResponse}>('/api/v1/users/me', {
		method: 'PATCH',
		body: JSON.stringify(data),
	});
}
