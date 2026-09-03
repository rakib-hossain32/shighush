import "server-only";
import { apiRequest } from "@/services/_shared/server-api-client";
import type { ApiListResponse, ApiSuccessResponse, EvidenceRecord } from "@/services/_shared/types";

/**
 * Get evidence for a report
 */
export function getReportEvidence(reportId: string) {
  return apiRequest<ApiListResponse<EvidenceRecord>>(`reports/${reportId}/evidence`, {
    tags: ["evidence", `report-evidence:${reportId}`],
    revalidate: 60,
  });
}

/**
 * Upload evidence (Public)
 * Note: This uses FormData, so it's handled differently
 */
export async function uploadEvidence(reportId: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);

  // Direct fetch for file upload
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
  const response = await fetch(`${API_URL}/reports/${reportId}/evidence`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload evidence');
  }

  return response.json();
}

/**
 * Verify evidence (Admin/Moderator only)
 */
export function verifyEvidence<TPayload, TResult>(
  evidenceId: string,
  payload: TPayload
) {
  return apiRequest<ApiSuccessResponse<TResult>>(`evidence/${evidenceId}/verify`, {
    method: "PATCH",
    body: payload,
    revalidate: false,
  });
}

/**
 * Delete evidence (Admin only)
 */
export function deleteEvidence(evidenceId: string) {
  return apiRequest<ApiSuccessResponse<void>>(`evidence/${evidenceId}`, {
    method: "DELETE",
    revalidate: false,
  });
}
