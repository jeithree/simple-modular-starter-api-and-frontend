import type {ApiResponse, ApiError} from '@/types/api';
import {API_URL} from '@/config';

const createApiUrl = (endpoint: string) => {
	if (/^https?:\/\//i.test(endpoint)) return endpoint;
	return `${API_URL}/${endpoint.replace(/^\/+/, '')}`;
};

export async function apiFetch<T = unknown>(
	endpoint: string,
	options?: RequestInit
): Promise<ApiResponse<T>> {
	try {
		const response = await fetch(createApiUrl(endpoint), {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...options?.headers,
			},
			credentials: 'include',
		});

		const data: ApiResponse<T> = await response.json();

		if (!response.ok || !data.success) {
			throw data.error as ApiError;
		}

		return data;
	} catch (error) {
		if (error && typeof error === 'object' && 'code' in error) {
			throw error as ApiError;
		}
		throw {
			code: 'NETWORK_ERROR',
			message: 'Failed to connect to the server',
		} as ApiError;
	}
}
