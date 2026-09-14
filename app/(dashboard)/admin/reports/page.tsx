import Link from "next/link";
import { ExternalLink, Info, ShieldCheck } from "lucide-react";

import { AccessDenied } from "@/components/admin/access-denied";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminReportsFilterBar,
  AdminReportsQuickPresets,
  AdminReportsStats,
  AdminReportsTable,
} from "@/components/admin/reports";
import { Pagination } from "@/components/pagination";
import { guard } from "@/lib/auth/dal";
import type { ReportCategory, ReportStatus } from "@/lib/domain/enums";
import { moderationQueueSchema, parseFilters } from "@/lib/domain/schemas";
import { formatBnNumber } from "@/lib/format";
import { getModerationQueue } from "@/services";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "নথি ব্যবস্থাপনা ও মডারেশন",
  description: "মডারেশন কিউ ও প্রকাশিত নাগরিক নথির তালিকা।",
  index: false,
});

type QueuePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminReportsPage({ searchParams }: QueuePageProps) {
  const access = await guard("report:review", "/admin/reports");
  if (!access.allowed) {
    return <AccessDenied capability={access.capability} role={access.session.role} />;
  }

  const raw = await searchParams;
  const filters = parseFilters(moderationQueueSchema, raw);

  // Explicit status takes precedence over generic view
  const effectiveView = filters.status.length > 0 ? undefined : (filters.view ?? "all");

  const response = await getModerationQueue({
    page: filters.page,
    limit: filters.limit,
    view: effectiveView,
    assignment: filters.assignment ?? (access.session.role === "Moderator" ? "mine" : "all"),
    search: filters.search,
    status: filters.status as readonly ReportStatus[],
    category: filters.category as readonly ReportCategory[],
    area: filters.area,
    flaggedOnly: filters.flaggedOnly,
    sort: filters.sort,
  });

  const reports = Array.isArray(response?.data) ? response.data : [];
  const meta = response?.meta || { page: 1, limit: 20, total: 0, totalPages: 0 };

  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.view !== "all" ||
    Boolean(filters.assignment && filters.assignment !== (access.session.role === "Moderator" ? "mine" : "all")) ||
    filters.status.length > 0 ||
    filters.category.length > 0 ||
    filters.area.length > 0 ||
    Boolean(filters.flaggedOnly);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        actions={
          <Link
            className="inline-flex items-center gap-1.5 border-2 border-border bg-card px-3.5 py-1.5 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:border-foreground hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            href="/reports"
            target="_blank"
          >
            <span>পাবলিক আর্কাইভ</span>
            <ExternalLink className="size-3.5" />
          </Link>
        }
        description="নাগরিকদের জমা দেওয়া অভিযোগের পর্যালোচনা, যাচাইকরণ ও প্রকাশের নিয়ন্ত্রণ কেন্দ্র। প্রকাশের পূর্বে সব ব্যক্তিগত তথ্য (PII) অপসারণ বাধ্যতামূলক।"
        title="নথি ব্যবস্থাপনা"
      />

      {/* Moderation Guidance Banner */}
      <div className="flex items-start gap-3 border-2 border-primary/40 bg-primary/5 p-3.5 shadow-[2px_2px_0_var(--foreground)]">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        <div className="text-xs leading-relaxed text-muted-foreground">
          <strong className="text-foreground font-bold">মডারেটর নির্দেশিকা:</strong>{" "}
          নথির প্রাতিষ্ঠানিক তথ্য ও প্রশাসনিক এলাকা যাচাই করে সিদ্ধান্ত নিন। যেসব নথিতে ব্যক্তিগত তথ্যের সতর্কতা (PII) রয়েছে, সেগুলো প্রকাশের পূর্বে অবশ্যই সংবেদনশীল অংশ মুছে (Redact) নিতে হবে।
        </div>
      </div>

      {/* Quick Presets Bar */}
      <AdminReportsQuickPresets filters={filters} role={access.session.role} />

      {/* Stats Cards */}
      <AdminReportsStats
        effectiveView={effectiveView}
        reports={reports}
        total={meta.total}
      />

      {/* Search & Filter Controls */}
      <AdminReportsFilterBar
        filters={filters}
        role={access.session.role}
        total={meta.total}
      />

      {/* Reports Table & Card View */}
      <AdminReportsTable
        hasActiveFilters={hasActiveFilters}
        reports={reports}
      />

      {/* Pagination Controls */}
      <Pagination basePath="/admin/reports" meta={meta} params={raw} showSinglePage />
    </div>
  );
}
