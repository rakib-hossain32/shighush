import "server-only";
import { apiRequest } from "@/services/_shared/server-api-client";
import type { ApiListResponse, ApiSuccessResponse, Flag } from "@/services/_shared/types";

/**
 * Flag List Params
 */
export type FlagListParams = {
  page?: number;
  limit?: number;
  status?: string;
  reason?: string;
};

/**
 * Get list of flags (Admin/Moderator only)
 */
export function getFlags(params: FlagListParams = {}) {
  return apiRequest<ApiListResponse<Flag>>("flags", {
    query: params,
    tags: ["flags"],
    revalidate: 30,
  });
}

/**
 * Get single flag by ID
 */
export function getFlagById(id: string) {
  return apiRequest<ApiSuccessResponse<Flag>>(`flags/${id}`, {
    tags: ["flags", `flag:${id}`],
    revalidate: 30,
  });
}

/**
 * Create flag (Public)
 */
export function submitFlag<TPayload, TResult>(payload: TPayload) {
  return apiRequest<ApiSuccessResponse<TResult>>("flags", {
    method: "POST",
    body: payload,
    revalidate: false,
  });
}

/**
 * Update flag status (Admin/Moderator only)
 */
export function updateFlagStatus<TPayload, TResult>(flagId: string, payload: TPayload) {
  return apiRequest<ApiSuccessResponse<TResult>>(`flags/${flagId}/status`, {
    method: "PATCH",
    body: payload,
    revalidate: false,
  });
}
