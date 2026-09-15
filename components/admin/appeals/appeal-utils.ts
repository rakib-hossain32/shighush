import type { Appeal } from "@/services";
import { REPORT_CATEGORY_META, type ReportCategory } from "@/lib/domain/enums";

export function isAppealPending(appeal: Appeal) {
  return appeal.status === "received" || appeal.status === "in_review";
}

export function appealCategoryLabel(category?: string) {
  return category ? REPORT_CATEGORY_META[category as ReportCategory]?.label || category : "ধরন উল্লেখ নেই";
}

export function appealReportHref(appeal: Appeal) {
  const id = appeal.reportId || appeal.reportSlug;
  return id ? `/admin/reports/${encodeURIComponent(id)}` : null;
}

export type AppealStatusUpdater = (id: string, status: "in_review" | "upheld" | "rejected", resolution?: string) => Promise<boolean>;
