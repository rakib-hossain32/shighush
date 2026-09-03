import "server-only";
import { apiRequest } from "@/services/_shared/server-api-client";
import type {
  ApiListResponse,
  ApiSuccessResponse,
  StaffUser,
  ModerationReport,
  AuditLogEntry,
  ModerationListParams,
} from "@/services/_shared/types";

/**
 * Admin Dashboard Stats
 */
export type DashboardMetric = {
  key: string;
  label: string;
  value: number;
};

export type DashboardStats = {
  metrics: DashboardMetric[];
  piiAlerts: ModerationReport[];
};

export function getDashboardStats() {
  return apiRequest<ApiSuccessResponse<DashboardStats>>("admin/stats", {
    tags: ["admin-stats"],
    revalidate: 30, // Fresh data every 30 seconds
  });
}

/**
 * User Management
 */
export type UserListParams = {
  page?: number;
  limit?: number;
  role?: string;
};

export function getUsers(params: UserListParams = {}) {
  return apiRequest<ApiListResponse<StaffUser>>("admin/users", {
    query: params,
    tags: ["admin-users"],
    revalidate: 60,
  });
}

export function createUser<TPayload, TResult>(payload: TPayload) {
  return apiRequest<ApiSuccessResponse<TResult>>("admin/users", {
    method: "POST",
    body: payload,
    revalidate: false,
  });
}

export function updateUserRole(userId: string, role: string) {
  return apiRequest<ApiSuccessResponse<StaffUser>>(`admin/users/${userId}/role`, {
    method: "PATCH",
    body: { role },
    revalidate: false,
  });
}

/**
 * Audit Logs
 */
export type AuditLogListParams = {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  targetType?: string;
};

export function getAuditLogs(params: AuditLogListParams = {}) {
  return apiRequest<ApiListResponse<AuditLogEntry>>("admin/audit-logs", {
    query: params,
    tags: ["audit-logs"],
    revalidate: 30,
  });
}

/**
 * Moderation Queue
 */
export function getModerationQueue(params: ModerationListParams = {}) {
  return apiRequest<ApiListResponse<ModerationReport>>("reports", {
    query: {
      ...params,
      // Include all statuses for moderation view
      status: params.status || ["received", "under_review", "published", "rejected"],
    },
    tags: ["moderation-queue"],
    revalidate: 15, // Fresh data every 15 seconds for active queue
  });
}

export function getModerationReport(id: string) {
  return apiRequest<ApiSuccessResponse<ModerationReport>>(`reports/${id}`, {
    tags: ["moderation-queue", `report:${id}`],
    revalidate: 30,
  });
}

export function updateReportStatus<TPayload, TResult>(
  reportId: string,
  payload: TPayload
) {
  return apiRequest<ApiSuccessResponse<TResult>>(`reports/${reportId}/status`, {
    method: "PATCH",
    body: payload,
    revalidate: false,
  });
}

export function redactReport<TPayload, TResult>(reportId: string, payload: TPayload) {
  return apiRequest<ApiSuccessResponse<TResult>>(`reports/${reportId}/redact`, {
    method: "PATCH",
    body: payload,
    revalidate: false,
  });
}
