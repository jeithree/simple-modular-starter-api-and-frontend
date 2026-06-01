import {apiFetch} from '@/lib/fetcher';
import type {AdminUser, UpdateUserInput} from '@/types/admin';

export async function searchUsers(q: string) {
	const params = new URLSearchParams({q});
	const res = await apiFetch<AdminUser[]>(
		`/api/v1/admin/users?${params.toString()}`,
	);
	return res.data ?? [];
}

export async function updateUser(id: string, data: UpdateUserInput) {
	const res = await apiFetch<AdminUser>(`/api/v1/admin/users/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(data),
	});
	return res.data;
}

export async function deactivateUser(id: string) {
	const res = await apiFetch<AdminUser>(
		`/api/v1/admin/users/${id}/deactivate`,
		{
			method: 'PATCH',
		},
	);
	return res.data;
}

export async function reactivateUser(id: string) {
	const res = await apiFetch<AdminUser>(
		`/api/v1/admin/users/${id}/reactivate`,
		{
			method: 'PATCH',
		},
	);
	return res.data;
}
