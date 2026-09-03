/**
 * API Client for backend communication
 * 
 * Replaces mock data with real API calls
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export class ApiError extends Error {
	constructor(
		public status: number,
		message: string,
		public errors?: any[]
	) {
		super(message);
		this.name = 'ApiError';
	}
}

async function fetchApi<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const url = `${API_URL}${endpoint}`;

	// Get token from cookie (if exists)
	const token = typeof window !== 'undefined' 
		? document.cookie
				.split('; ')
				.find(row => row.startsWith('session='))
				?.split('=')[1]
		: null;

	const headers: HeadersInit = {
		'Content-Type': 'application/json',
		...options.headers,
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	const response = await fetch(url, {
		...options,
		headers,
	});

	const data = await response.json();

	if (!response.ok) {
		throw new ApiError(
			response.status,
			data.message || 'Something went wrong',
			data.errors
		);
	}

	return data.data as T;
}

export const api = {
	// Health check
	async health() {
		return fetchApi('/health');
	},

	// Auth
	async login(email: string, password: string) {
		return fetchApi<{ user: any; token: string }>('/auth/login', {
			method: 'POST',
			body: JSON.stringify({ email, password }),
		});
	},

	// Reports
	async createReport(data: any) {
		return fetchApi<{ caseId: string; id: string; message: string }>(
			'/reports',
			{
				method: 'POST',
				body: JSON.stringify(data),
			}
		);
	},

	async listReports(params?: {
		page?: number;
		limit?: number;
		status?: string;
		category?: string;
		area?: string;
	}) {
		const query = new URLSearchParams();
		if (params?.page) query.set('page', params.page.toString());
		if (params?.limit) query.set('limit', params.limit.toString());
		if (params?.status) query.set('status', params.status);
		if (params?.category) query.set('category', params.category);
		if (params?.area) query.set('area', params.area);

		return fetchApi<{
			reports: any[];
			pagination: {
				page: number;
				limit: number;
				total: number;
				pages: number;
			};
		}>(`/reports?${query}`);
	},

	async getReportByCaseId(caseId: string) {
		return fetchApi<any>(`/reports/${caseId}`);
	},

	async updateReportStatus(id: string, status: string) {
		return fetchApi<any>(`/reports/${id}/status`, {
			method: 'PATCH',
			body: JSON.stringify({ status }),
		});
	},

	async redactReport(id: string, narrative: string) {
		return fetchApi<any>(`/reports/${id}/redact`, {
			method: 'PATCH',
			body: JSON.stringify({ narrative }),
		});
	},

	// Institutions
	async listInstitutions(params?: {
		page?: number;
		limit?: number;
		category?: string;
		area?: string;
		type?: string;
		search?: string;
	}) {
		const query = new URLSearchParams();
		if (params?.page) query.set('page', params.page.toString());
		if (params?.limit) query.set('limit', params.limit.toString());
		if (params?.category) query.set('category', params.category);
		if (params?.area) query.set('area', params.area);
		if (params?.type) query.set('type', params.type);
		if (params?.search) query.set('search', params.search);

		return fetchApi<{
			institutions: any[];
			pagination: any;
		}>(`/institutions?${query}`);
	},

	async getInstitutionBySlug(slug: string) {
		return fetchApi<any>(`/institutions/${slug}`);
	},

	async createInstitution(data: any) {
		return fetchApi<any>('/institutions', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	async updateInstitution(id: string, data: any) {
		return fetchApi<any>(`/institutions/${id}`, {
			method: 'PATCH',
			body: JSON.stringify(data),
		});
	},

	async deleteInstitution(id: string) {
		return fetchApi<any>(`/institutions/${id}`, {
			method: 'DELETE',
		});
	},

	// Appeals
	async createAppeal(data: { caseId: string; reason: string; description: string }) {
		return fetchApi<{ message: string }>('/appeals', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	async listAppeals(params?: {
		page?: number;
		limit?: number;
		status?: string;
		reason?: string;
	}) {
		const query = new URLSearchParams();
		if (params?.page) query.set('page', params.page.toString());
		if (params?.limit) query.set('limit', params.limit.toString());
		if (params?.status) query.set('status', params.status);
		if (params?.reason) query.set('reason', params.reason);

		return fetchApi<{
			appeals: any[];
			pagination: any;
		}>(`/appeals?${query}`);
	},

	async getAppealById(id: string) {
		return fetchApi<any>(`/appeals/${id}`);
	},

	async updateAppealStatus(id: string, status: string, resolution?: string) {
		return fetchApi<any>(`/appeals/${id}/status`, {
			method: 'PATCH',
			body: JSON.stringify({ status, resolution }),
		});
	},

	// Flags
	async createFlag(data: { reportId: string; reason: string; details?: string }) {
		return fetchApi<{ message: string }>('/flags', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	async listFlags(params?: {
		page?: number;
		limit?: number;
		status?: string;
		reason?: string;
	}) {
		const query = new URLSearchParams();
		if (params?.page) query.set('page', params.page.toString());
		if (params?.limit) query.set('limit', params.limit.toString());
		if (params?.status) query.set('status', params.status);
		if (params?.reason) query.set('reason', params.reason);

		return fetchApi<{
			flags: any[];
			pagination: any;
		}>(`/flags?${query}`);
	},

	async getFlagById(id: string) {
		return fetchApi<any>(`/flags/${id}`);
	},

	async updateFlagStatus(id: string, status: string, reviewNotes?: string) {
		return fetchApi<any>(`/flags/${id}/status`, {
			method: 'PATCH',
			body: JSON.stringify({ status, reviewNotes }),
		});
	},

	// People
	async listPeople(params?: {
		page?: number;
		limit?: number;
		visibility?: string;
		search?: string;
	}) {
		const query = new URLSearchParams();
		if (params?.page) query.set('page', params.page.toString());
		if (params?.limit) query.set('limit', params.limit.toString());
		if (params?.visibility) query.set('visibility', params.visibility);
		if (params?.search) query.set('search', params.search);

		return fetchApi<{
			people: any[];
			pagination: any;
		}>(`/people?${query}`);
	},

	async getPersonBySlug(slug: string) {
		return fetchApi<any>(`/people/${slug}`);
	},

	async createPerson(data: any) {
		return fetchApi<any>('/people', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	async updatePersonVisibility(id: string, nameVisibility: string) {
		return fetchApi<any>(`/people/${id}/visibility`, {
			method: 'PATCH',
			body: JSON.stringify({ nameVisibility }),
		});
	},

	// Evidence
	async uploadEvidence(reportId: string, file: File) {
		const formData = new FormData();
		formData.append('file', file);

		const token = typeof window !== 'undefined' 
			? document.cookie
					.split('; ')
					.find(row => row.startsWith('session='))
					?.split('=')[1]
			: null;

		const headers: HeadersInit = {};
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		const response = await fetch(`${API_URL}/reports/${reportId}/evidence`, {
			method: 'POST',
			headers,
			body: formData,
		});

		const data = await response.json();

		if (!response.ok) {
			throw new ApiError(
				response.status,
				data.message || 'Upload failed',
				data.errors
			);
		}

		return data.data;
	},

	async listEvidence(reportId: string) {
		return fetchApi<any[]>(`/reports/${reportId}/evidence`);
	},

	async verifyEvidence(id: string, verified: boolean) {
		return fetchApi<any>(`/evidence/${id}/verify`, {
			method: 'PATCH',
			body: JSON.stringify({ verified }),
		});
	},

	async deleteEvidence(id: string) {
		return fetchApi<any>(`/evidence/${id}`, {
			method: 'DELETE',
		});
	},

	// Admin
	async getDashboardStats() {
		return fetchApi<{
			metrics: Array<{ key: string; label: string; value: number }>;
			piiAlerts: number;
		}>('/admin/stats');
	},

	async listUsers(params?: {
		page?: number;
		limit?: number;
		role?: string;
	}) {
		const query = new URLSearchParams();
		if (params?.page) query.set('page', params.page.toString());
		if (params?.limit) query.set('limit', params.limit.toString());
		if (params?.role) query.set('role', params.role);

		return fetchApi<{
			users: any[];
			pagination: any;
		}>(`/admin/users?${query}`);
	},

	async createUser(data: {
		name: string;
		email: string;
		password: string;
		role: 'Admin' | 'Moderator';
	}) {
		return fetchApi<any>('/admin/users', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	async updateUserRole(id: string, role: string) {
		return fetchApi<any>(`/admin/users/${id}/role`, {
			method: 'PATCH',
			body: JSON.stringify({ role }),
		});
	},

	async listAuditLogs(params?: {
		page?: number;
		limit?: number;
		userId?: string;
		action?: string;
		targetType?: string;
	}) {
		const query = new URLSearchParams();
		if (params?.page) query.set('page', params.page.toString());
		if (params?.limit) query.set('limit', params.limit.toString());
		if (params?.userId) query.set('userId', params.userId);
		if (params?.action) query.set('action', params.action);
		if (params?.targetType) query.set('targetType', params.targetType);

		return fetchApi<{
			logs: any[];
			pagination: any;
		}>(`/admin/audit-logs?${query}`);
	},
};
