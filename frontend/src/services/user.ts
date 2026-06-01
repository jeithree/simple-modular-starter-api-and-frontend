import {apiFetch} from '@/lib/fetcher';
import type {UserResponse, UpdateProfileData} from '@/types/user';

export async function getProfile() {
	const res = await apiFetch<UserResponse>('/api/v1/users/me');
	return res.data!;
}

export async function updateProfile(data: UpdateProfileData) {
	return apiFetch<UserResponse>('/api/v1/users', {
		method: 'PATCH',
		body: JSON.stringify(data),
	});
}

export async function getSessionCount() {
	const res = await apiFetch<{count: number}>('/api/v1/users/sessions');
	return res.data!;
}

export async function killAllSessions() {
	return apiFetch('/api/v1/users/sessions', {method: 'DELETE'});
}
