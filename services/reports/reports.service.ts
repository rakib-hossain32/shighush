import "server-only";
import { apiRequest } from "@/services/_shared/server-api-client";
import type {
  ApiListResponse,
  ApiSuccessResponse,
  PublicReport,
  ReportListParams,
  ReportStatus,
  VerificationLevel,
} from "@/services/_shared/types";

export type CaseTrackResult = {
  caseId: string;
  status: ReportStatus;
  verificationLevel: VerificationLevel;
  enableAnonymousInbox: boolean;
  category: string;
  area: string;
  incidentDate: string | null;
  submittedAt: string;
  updatedAt: string;
  publishedAt: string | null;
  publicTitle: string | null;
  moderatorNote: string | null;
  timeline: Array<{ id: string; status: string; note: string; at: string }>;
  messages: Array<{
    id: string;
    from: "moderator" | "reporter";
    body: string;
    at: string;
  }>;
};

export function getReports(params: ReportListParams = {}) {
  return apiRequest<ApiListResponse<PublicReport>>("reports", {
    query: {
      status: "published",
      ...params,
    },
    tags: ["reports"],
    revalidate: 60,
  });
}
export function getReportBySlug(slug: string) {
  return apiRequest<ApiSuccessResponse<PublicReport>>(
    `reports/${encodeURIComponent(slug)}`,
    { tags: ["reports", `report:${slug}`], revalidate: 60 },
  );
}
export function submitReport<TPayload, TResult>(payload: TPayload) {
  return apiRequest<ApiSuccessResponse<TResult>>("reports", {
    method: "POST",
    body: payload,
    revalidate: false,
  });
}

/** Private case tracking — requires the one-time secretToken issued at submission. */
export function getReportByCase(caseId: string, token: string) {
  return apiRequest<ApiSuccessResponse<CaseTrackResult>>(
    `reports/track/${encodeURIComponent(caseId)}`,
    { query: { token }, revalidate: false, cache: "no-store" },
  );
}
