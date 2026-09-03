import "server-only";
import { apiRequest } from "@/services/_shared/server-api-client";
import type { ApiListResponse, ApiSuccessResponse, PublicReport, ReportListParams } from "@/services/_shared/types";
export function getReports(params: ReportListParams = {}) { return apiRequest<ApiListResponse<PublicReport>>("reports", { query: params, tags: ["reports"], revalidate: 60 }); }
export function getReportBySlug(slug: string) { return apiRequest<ApiSuccessResponse<PublicReport>>(`reports/${encodeURIComponent(slug)}`, { tags: ["reports", `report:${slug}`], revalidate: 60 }); }
export function submitReport<TPayload, TResult>(payload: TPayload) { return apiRequest<ApiSuccessResponse<TResult>>("reports", { method: "POST", body: payload, revalidate: false }); }
