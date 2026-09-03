import "server-only";
import { apiRequest } from "@/services/_shared/server-api-client";
import type { ApiListResponse, ApiSuccessResponse, Institution, InstitutionListParams } from "@/services/_shared/types";
export function getInstitutions(params: InstitutionListParams = {}) { return apiRequest<ApiListResponse<Institution>>("institutions", { query: params, tags: ["institutions"], revalidate: 300 }); }
export function getInstitutionBySlug(slug: string) { return apiRequest<ApiSuccessResponse<Institution>>(`institutions/${encodeURIComponent(slug)}`, { tags: ["institutions", `institution:${slug}`], revalidate: 300 }); }
