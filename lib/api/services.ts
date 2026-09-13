/**
 * API Service Layer
 * 
 * Server-side API calls for Next.js Server Components
 * Uses fetch with proper error handling and type safety
 */

import type {
  ReportListParams,
  ReportListResponse,
  ApiReport,
  InstitutionListParams,
  InstitutionListResponse,
  ApiInstitution,
  AppealListParams,
  AppealListResponse,
  FlagListParams,
  FlagListResponse,
  UserListParams,
  UserListResponse,
  AuditLogListParams,
  AuditLogListResponse,
  DashboardStatsResponse,
  PersonListParams,
  PersonListResponse,
  ApiPerson,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// Helper for server-side fetch
async function fetchServer<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      cache: options.cache || 'no-store', // Default to fresh data
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error(`API Error [${endpoint}]:`, error);
      throw new Error(error.message || 'API request failed');
    }

    const data = await response.json();
    return data.data as T;
  } catch (error) {
    console.error(`Fetch error [${endpoint}]:`, error);
    // Return empty/fallback data instead of throwing to prevent page crashes
    throw error;
  }
}

/**
 * Reports Service
 */
export const reportsService = {
  async list(params?: ReportListParams): Promise<ReportListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.status) query.set('status', params.status);
    if (params?.category) query.set('category', params.category);
    if (params?.area) query.set('area', params.area);
    if (params?.verificationLevel) query.set('verificationLevel', params.verificationLevel);
    if (params?.search) query.set('search', params.search);

    return fetchServer<ReportListResponse>(`/reports?${query}`);
  },

  async getById(caseId: string): Promise<ApiReport> {
    return fetchServer<ApiReport>(`/reports/${caseId}`);
  },
};

/**
 * Institutions Service
 */
export const institutionsService = {
  async list(params?: InstitutionListParams): Promise<InstitutionListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.category) query.set('category', params.category);
    if (params?.area) query.set('area', params.area);
    if (params?.type) query.set('type', params.type);
    if (params?.search) query.set('search', params.search);

    return fetchServer<InstitutionListResponse>(`/institutions?${query}`);
  },

  async getBySlug(slug: string): Promise<ApiInstitution> {
    return fetchServer<ApiInstitution>(`/institutions/${slug}`);
  },
};

/**
 * Appeals Service (Protected - needs auth)
 */
export const appealsService = {
  async list(token: string, params?: AppealListParams): Promise<AppealListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.status) query.set('status', params.status);
    if (params?.reason) query.set('reason', params.reason);

    return fetchServer<AppealListResponse>(`/appeals?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

/**
 * Flags Service (Protected - needs auth)
 */
export const flagsService = {
  async list(token: string, params?: FlagListParams): Promise<FlagListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.status) query.set('status', params.status);
    if (params?.reason) query.set('reason', params.reason);

    return fetchServer<FlagListResponse>(`/flags?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

/**
 * Admin Service (Protected - needs auth)
 */
export const adminService = {
  async getDashboardStats(token: string): Promise<DashboardStatsResponse> {
    return fetchServer<DashboardStatsResponse>('/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async listUsers(token: string, params?: UserListParams): Promise<UserListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.role) query.set('role', params.role);

    return fetchServer<UserListResponse>(`/admin/users?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async listAuditLogs(token: string, params?: AuditLogListParams): Promise<AuditLogListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.userId) query.set('userId', params.userId);
    if (params?.action) query.set('action', params.action);
    if (params?.targetType) query.set('targetType', params.targetType);

    return fetchServer<AuditLogListResponse>(`/admin/audit-logs?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

/**
 * People Service
 */
export const peopleService = {
  async list(params?: PersonListParams): Promise<PersonListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.visibility) query.set('visibility', params.visibility);
    if (params?.search) query.set('search', params.search);

    return fetchServer<PersonListResponse>(`/people?${query}`);
  },

  async getBySlug(slug: string): Promise<ApiPerson> {
    return fetchServer<ApiPerson>(`/people/${slug}`);
  },
};

/**
 * Statistics Service (can be public or use reports data)
 */
export const statisticsService = {
  async getOverview() {
    // This could aggregate from reports or have a dedicated endpoint
    // For now, we'll use the reports list to calculate stats
    try {
      const data = await reportsService.list({ limit: 100, status: 'published' });
      return {
        totalReports: data.pagination.total || 0,
        publishedReports: data.pagination.total || 0,
        // More stats can be calculated here
      };
    } catch (error) {
      console.error('Statistics fetch error:', error);
      return {
        totalReports: 0,
        publishedReports: 0,
      };
    }
  },
};

