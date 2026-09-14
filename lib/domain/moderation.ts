import { REPORT_STATUSES, type ReportStatus } from "@/lib/domain/enums";
import type { ModerationReport } from "@/services/_shared/types";

export const REVIEW_STATUSES: ReportStatus[] = ["submitted", "needs_info", "under_review"];
export const COMPLETED_STATUSES: ReportStatus[] = ["published", "resolved", "rejected", "removed", "archived"];

export function isReviewable(report: Pick<ModerationReport, "status" | "publishedAt">) {
  return REVIEW_STATUSES.includes(report.status) && !report.publishedAt;
}

/** Older API records may omit collections or use the original backend status names. */
export function normalizeModerationReport(value: Partial<ModerationReport>): ModerationReport {
  const status = String(value.status ?? "");
  const normalizedStatus = status === "received" ? "submitted" : status === "awaiting_redaction" ? "under_review" : status;
  return {
    ...value,
    id: value.id ?? "",
    publicId: value.publicId ?? 0,
    slug: value.slug ?? "",
    title: value.title || "শিরোনাম উল্লেখ করা হয়নি",
    summary: value.summary ?? "",
    rawNarrative: value.rawNarrative ?? value.narrative ?? "",
    category: value.category ?? "other",
    // Unknown states are read-only, never made publishable by a fallback.
    status: REPORT_STATUSES.includes(normalizedStatus as ReportStatus) ? normalizedStatus as ReportStatus : "archived",
    verificationLevel: value.verificationLevel ?? "unverified",
    institution: value.institution ?? { id: "", slug: "", nameBn: value.institutionName || "প্রতিষ্ঠানের নাম জানা নেই" },
    location: value.location ?? { area: "unknown" },
    evidence: Array.isArray(value.evidence) ? value.evidence.filter(Boolean) : [],
    piiFindings: Array.isArray(value.piiFindings) ? value.piiFindings.filter((item) => typeof item === "string") : [],
    moderatorNotes: Array.isArray(value.moderatorNotes) ? value.moderatorNotes.filter(Boolean) : [],
    timeline: Array.isArray(value.timeline) ? value.timeline.filter(Boolean) : [],
    accused: Array.isArray(value.accused) ? value.accused.filter(Boolean) : [],
    submittedAt: value.submittedAt ?? "",
    publishedAt: value.publishedAt ?? "",
    updatedAt: value.updatedAt ?? "",
    assignedTo: value.assignedTo?.id ? value.assignedTo : undefined,
  };
}
