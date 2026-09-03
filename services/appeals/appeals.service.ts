import "server-only";
import { apiRequest } from "@/services/_shared/server-api-client";
import type { ApiListResponse, ApiSuccessResponse, Appeal } from "@/services/_shared/types";

/**
 * Appeal List Params
 */
export type AppealListParams = {
  page?: number;
  limit?: number;
  status?: string;
  reason?: string;
};

/**
 * Get list of appeals (Admin/Moderator only)
 */
export function getAppeals(params: AppealListParams = {}) {
  return apiRequest<ApiListResponse<Appeal>>("appeals", {
    query: params,
    tags: ["appeals"],
    revalidate: 30,
  });
}

/**
 * Get single appeal by ID
 */
export function getAppealById(id: string) {
  return apiRequest<ApiSuccessResponse<Appeal>>(`appeals/${id}`, {
    tags: ["appeals", `appeal:${id}`],
    revalidate: 30,
  });
}

/**
 * Create appeal (Public)
 */
export function submitAppeal<TPayload, TResult>(payload: TPayload) {
  return apiRequest<ApiSuccessResponse<TResult>>("appeals", {
    method: "POST",
    body: payload,
    revalidate: false,
  });
}

/**
 * Update appeal status (Admin/Moderator only)
 */
export function updateAppealStatus<TPayload, TResult>(
  appealId: string,
  payload: TPayload
) {
  return apiRequest<ApiSuccessResponse<TResult>>(`appeals/${appealId}/status`, {
    method: "PATCH",
    body: payload,
    revalidate: false,
  });
}
