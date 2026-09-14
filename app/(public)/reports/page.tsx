import Link from "next/link";
import {
  ArrowRight,
  FileQuestion,
  FilterX,
  Plus,
  Sparkles,
} from "lucide-react";

import { PageFrame } from "@/components/page-frame";
import { Pagination } from "@/components/pagination";
import { ReportListCard } from "@/components/sections/reports/report-list-card";
import { ReportsFilterControls } from "@/components/sections/reports/reports-filter-controls";
import { ReportsToolbar } from "@/components/sections/reports/reports-toolbar";
import { parseFilters, reportFilterSchema } from "@/lib/domain/schemas";
import { getReports } from "@/services";
import type { ReportCategory, VerificationLevel } from "@/lib/domain/enums";
import { createPageMetadata } from "@/lib/seo";
import { formatBnNumber } from "@/lib/format";

export const metadata = createPageMetadata({
  title: "অভিযোগের রেকর্ড",
  description:
    "শিবচরের প্রকাশিত নাগরিক প্রতিবেদন, যাচাইয়ের স্তর ও প্রাসঙ্গিক তথ্য দেখুন।",
  path: "/reports",
});

type ReportsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const QUICK_FILTERS = [
  { label: "সব নথি", href: "/reports" },
  {
    label: "প্রমাণ সংযুক্ত",
    href: "/reports?verificationLevel=evidence_attached",
  },
  { label: "ঘুষ ও অতিরিক্ত অর্থ", href: "/reports?category=bribery" },
  { label: "সেবা-বঞ্চনা", href: "/reports?category=service_denial" },
  { label: "পৌরসভা এলাকা", href: "/reports?area=shibchar-municipality" },
];

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const raw = await searchParams;
  const filters = parseFilters(reportFilterSchema, raw);

  const response = await getReports({
    page: filters.page,
    limit: filters.limit,
    search: filters.search,
    category: filters.category as ReportCategory | ReportCategory[] | undefined,
    verificationLevel: filters.verificationLevel as
      | VerificationLevel
      | VerificationLevel[]
      | undefined,
    area: filters.area,
    institution: filters.institution,
    sort: filters.sort,
  });

  const reports = response?.data ?? [];
  const meta = response?.meta ?? {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  };

  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.institution) ||
    (filters.category && filters.category.length > 0) ||
    (filters.verificationLevel && filters.verificationLevel.length > 0) ||
    (filters.area && filters.area.length > 0);

  return (
    <PageFrame
      badgeText={`${formatBnNumber(meta.total)} নথি প্রকাশিত`}
      breadcrumbs={[{ label: "অভিযোগের রেকর্ড" }]}
      copy="প্রতিটি নথির শিরোনাম অভিযোগকারী নিজে লিখেছেন। প্রতিষ্ঠান, শাখা/অফিস, প্রশাসনিক এলাকা ও যাচাইয়ের স্তর আলাদা করে দেখানো হয়; কোনো নথিই অপরাধের চূড়ান্ত প্রমাণ নয়।"
      eyebrow="নথি ভাণ্ডার / নাগরিক রেকর্ড"
      title="অভিযোগের আর্কাইভ ও রেকর্ড"
      action={
        <Link
          href="/report/new"
          className="inline-flex items-center gap-1.5 border-2 border-foreground bg-primary px-4 py-2 text-xs font-bold text-foreground shadow-[3px_3px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
        >
          <Plus className="size-3.5" />
          <span>নতুন অভিযোগ লিখুন</span>
        </Link>
      }
      stats={[
        { label: "মোট প্রকাশিত নথি", value: meta.total },
        {
          label: "বর্তমান পাতা",
          value: `${meta.page} / ${meta.totalPages || 1}`,
        },
      ]}
    >
      <div className="space-y-6">
        {/* Quick Presets Bar (Neo-Brutalist Badges) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="shrink-0 text-xs font-bold text-muted-foreground mr-1 flex items-center gap-1">
            <Sparkles className="size-3.5 text-primary" />
            দ্রুত দেখুন:
          </span>
          {QUICK_FILTERS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="shrink-0 border-2 border-border bg-card px-3 py-1  text-xs font-bold text-foreground transition-all hover:border-foreground hover:shadow-[2px_2px_0_var(--foreground)] hover:-translate-y-0.5"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-border bg-muted/30 px-3.5 py-3 text-xs text-muted-foreground sm:px-4">
          <span>
            <strong className="text-foreground">শিরোনাম:</strong> অভিযোগের মূল
            বক্তব্য
          </span>
          <span>
            <strong className="text-foreground">প্রতিষ্ঠান:</strong> লক্ষ্য অফিস
            বা সেবা-কেন্দ্র
          </span>
          <span>
            <strong className="text-foreground">এলাকা:</strong> ইউনিয়ন / পৌরসভা
            স্তর
          </span>
        </div>

        {/* Main Grid: Filters + List */}
        <form
          action="/reports"
          className="space-y-4"
          id="reports-filter-form"
          method="GET"
        >
          <div className="space-y-4">
            {/* Toolbar: Search + Sort */}
            <ReportsToolbar
              count={meta.total}
              filterControls={<ReportsFilterControls filters={filters} />}
              search={filters.search}
              sort={filters.sort}
            />

            {/* Reports List */}
            {reports.length > 0 ? (
              <div className="space-y-4">
                {reports.map((report) => (
                  <ReportListCard key={report.id} report={report} />
                ))}
              </div>
            ) : (
              /* Elevated Empty State */
              <div className="border-2 border-dashed border-border bg-card p-8 sm:p-12 text-center shadow-[3px_3px_0_var(--foreground)]">
                <div className="mx-auto flex size-14 items-center justify-center border-2 border-border bg-muted text-foreground">
                  <FileQuestion className="size-7" />
                </div>
                <h3 className="mt-4 text-base font-bold text-foreground font-heading">
                  এই ফিল্টারে কোনো নাগরিক নথি পাওয়া যায়নি
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  অন্য কোনো এলাকা, সেবার ধরন বা যাচাইয়ের স্তর নির্বাচন করে দেখতে
                  পারেন। অথবা ফিল্টার রিসেট করুন।
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  {hasActiveFilters && (
                    <Link
                      href="/reports"
                      className="inline-flex items-center gap-1.5 border-2 border-border bg-background px-4 py-2 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
                    >
                      <FilterX className="size-3.5 mr-1" />
                      <span>সব ফিল্টার মুছে দিন</span>
                    </Link>
                  )}
                  <Link
                    href="/report/new"
                    className="inline-flex items-center gap-1.5 border-2 border-foreground bg-primary px-4 py-2 text-xs font-bold text-foreground shadow-[3px_3px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
                  >
                    <span>নতুন অভিযোগ নথিভুক্ত করুন</span>
                    <ArrowRight className="size-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {meta.totalPages > 1 && (
              <div className="pt-2">
                <Pagination basePath="/reports" meta={meta} params={raw} />
              </div>
            )}
          </div>
        </form>
      </div>
    </PageFrame>
  );
}
