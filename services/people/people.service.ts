import "server-only";
import { apiRequest } from "@/services/_shared/server-api-client";
import type { ApiListResponse, ApiSuccessResponse, PublicPerson } from "@/services/_shared/types";

/**
 * People List Params
 */
export type PeopleListParams = {
  page?: number;
  limit?: number;
  visibility?: string;
  search?: string;
};

/**
 * Get list of people (Public - only published names)
 */
export function getPeople(params: PeopleListParams = {}) {
  return apiRequest<ApiListResponse<PublicPerson>>("people", {
    query: params,
    tags: ["people"],
    revalidate: 60,
  });
}

/**
 * Get person by slug
 */
export function getPersonBySlug(slug: string) {
  return apiRequest<ApiSuccessResponse<PublicPerson>>(`people/${encodeURIComponent(slug)}`, {
    tags: ["people", `person:${slug}`],
    revalidate: 60,
  });
}

/**
 * Create person (Admin only)
 */
export function createPerson<TPayload, TResult>(payload: TPayload) {
  return apiRequest<ApiSuccessResponse<TResult>>("people", {
    method: "POST",
    body: payload,
    revalidate: false,
  });
}

/**
 * Update person visibility (Admin only)
 */
export function updatePersonVisibility<TPayload, TResult>(
  personId: string,
  payload: TPayload
) {
  return apiRequest<ApiSuccessResponse<TResult>>(`people/${personId}/visibility`, {
    method: "PATCH",
    body: payload,
    revalidate: false,
  });
}
