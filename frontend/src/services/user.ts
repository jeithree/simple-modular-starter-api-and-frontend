import {apiFetch} from '@/lib/fetcher';
import type {UserResponse, UpdateProfileData} from '@/types/user';

export async function getProfile() {
	return apiFetch<UserResponse>('/api/v1/users/me');
}

export async function updateProfile(data: UpdateProfileData) {
	return apiFetch<UserResponse>('/api/v1/users/me', {
		method: 'PATCH',
		body: JSON.stringify(data),
	});
}
