export const API_BASE_URL = 'http://localhost:8000/api/v1';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
	const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
	
	const headers = new Headers(options.headers);
	headers.set('Content-Type', 'application/json');
	headers.set('Accept', 'application/json');
	
	if (token) {
		headers.set('Authorization', `Bearer ${token}`);
	}

	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...options,
		headers
	});

	return response;
}
