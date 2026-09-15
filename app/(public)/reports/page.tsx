import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  FileQuestion,
  FilterX,
  Home,
  Plus,
  Shield,
} from "lucide-react";

import { Pagination } from "@/components/pagination";
import { ReportListCard } from "@/components/sections/reports/report-list-card";
import { ReportsActiveChips } from "@/components/sections/reports/reports-active-chips";
import { ReportsFilterBar } from "@/components/sections/reports/reports-filter-bar";
import { ReportsQuickPills } from "@/components/sections/reports/reports-quick-pills";
import type { ReportCategory, VerificationLevel } from "@/lib/domain/enums";
import { parseFilters, reportFilterSchema } from "@/lib/domain/schemas";
import { formatBnNumber, toBnDigits } from "@/lib/format";
import { createPageMetadata } from "@/lib/seo";
import { getReports } from "@/services";

export const metadata = createPageMetadata({
  title: "অভিযোগের রেকর্ড",
  description:
    "শিবচরের প্রকাশিত নাগরিক প্রতিবেদন, যাচাইয়ের স্তর ও প্রাসঙ্গিক তথ্য দেখুন।",
  path: "/reports",
});

type ReportsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

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
    <div className="min-h-screen bg-background text-foreground">
      {/* 1. Header Section — Clean Editorial Header */}
      <section className="relative border-b-2 border-border bg-card overflow-hidden">
        {/* Paper-grid background texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[size:32px_32px] [background-image:linear-gradient(var(--foreground)_1px,transparent_1px),linear-gradient(90deg,var(--foreground)_1px,transparent_1px)]"
        />

        <div className="relative mx-auto max-w-7xl px-3.5 py-3 sm:px-6 sm:py-5 lg:px-8">
          {/* Top Row: Breadcrumbs + Platform Badge */}
          <div className="flex items-center justify-between gap-2 border-b border-border/70 pb-2 sm:pb-3">
            <nav
              aria-label="ব্রেডক্রাম্ব"
              className="flex items-center gap-1.5 text-[11px] sm:text-xs"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-1 font-bold text-muted-foreground hover:text-primary transition-colors"
              >
                <Home className="size-3 sm:size-3.5" />
                <span className="hidden xs:inline">হোম</span>
              </Link>
              <ChevronRight className="size-3 text-muted-foreground/60" />
              <span className="font-bold text-foreground bg-muted px-1.5 py-0.5 text-[10px] sm:text-xs">
                অভিযোগের রেকর্ড
              </span>
            </nav>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-primary">
                <span className="size-1.5 rounded-none bg-primary inline-block animate-pulse" />
                <span>{formatBnNumber(meta.total)} নথি প্রকাশিত</span>
              </span>
              <div className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-muted-foreground border border-border bg-background px-2 py-0.5">
                <Shield className="size-3 text-primary" />
                <span>নাগরিক সংরক্ষিত রেকর্ড</span>
              </div>
            </div>
          </div>

          {/* Main Title Row: Heading & Action in one line */}
          <div className="py-2 sm:py-3.5 flex items-center justify-between gap-2.5">
            <div className="min-w-0 flex-1">
              <div className="hidden sm:inline-flex items-center gap-1.5 border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary mb-1">
                <span>নথি ভাণ্ডার / নাগরিক রেকর্ড</span>
              </div>
              <h1 className="font-heading text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground leading-[1.15] sm:text-wrap">
                অভিযোগের আর্কাইভ ও রেকর্ড
              </h1>
              <p className="hidden md:block mt-1 text-xs text-muted-foreground max-w-2xl leading-relaxed">
                প্রতিটি নথির শিরোনাম অভিযোগকারী নিজে লিখেছেন। প্রতিষ্ঠান, শাখা/অফিস ও
                যাচাইয়ের স্তর আলাদা করে দেখানো হয়; কোনো নথিই অপরাধের চূড়ান্ত প্রমাণ নয়।
              </p>
            </div>

            {/* Desktop Stats + Action Button */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden md:flex items-center gap-2">
                <div className="border-2 border-foreground bg-background px-3 py-1 text-center shadow-[1.5px_1.5px_0_var(--foreground)]">
                  <span className="block text-sm font-black text-foreground leading-none ">
                    {formatBnNumber(meta.total)}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-medium">মোট নথি</span>
                </div>
                <div className="border-2 border-foreground bg-background px-3 py-1 text-center shadow-[1.5px_1.5px_0_var(--foreground)]">
                  <span className="block text-sm font-black text-foreground leading-none ">
                    {toBnDigits(meta.page)}/{toBnDigits(meta.totalPages || 1)}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-medium">পাতা</span>
                </div>
              </div>

              <Link
                href="/report/new"
                className="inline-flex items-center gap-1 border-2 border-foreground bg-primary px-2.5 py-1 sm:px-3.5 sm:py-2 text-[11px] sm:text-xs font-bold text-foreground shadow-[1.5px_1.5px_0_var(--foreground)] sm:shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer whitespace-nowrap"
              >
                <Plus className="size-3 sm:size-3.5" />
                <span className="sm:hidden">অভিযোগ লিখুন</span>
                <span className="hidden sm:inline">নতুন অভিযোগ লিখুন</span>
              </Link>
            </div>
          </div>

          {/* Quick Presets Bar */}
          <div className="pt-2 border-t border-border/60">
            <ReportsQuickPills filters={filters} />
          </div>
        </div>
      </section>

      {/* 2. Main Body — NO SIDEBAR, 2-Column Responsive Dossier Grid */}
      <main className="mx-auto max-w-7xl px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8 space-y-4">
        {/* Horizontal Command Center Hub (Search + Popover Filters + Sort) */}
        <ReportsFilterBar filters={filters} />

        {/* Active Filters Dismissible Chips */}
        <ReportsActiveChips filters={filters} />

        {/* Reports Record Count Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>
            প্রদর্শিত হচ্ছে <strong className="text-foreground font-bold">{formatBnNumber(reports.length)}</strong>টি রেকর্ড (মোট <strong className="text-foreground font-bold">{formatBnNumber(meta.total)}</strong>টি থেকে)
          </span>
        </div>

        {/* Reports Case Dossier Grid (2 Columns on Desktop & Tablet, 1 Column on Mobile) */}
        {reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
            {reports.map((report) => (
              <ReportListCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          /* Elevated Neo-Brutalist Empty State */
          <div className="border-2 border-dashed border-foreground bg-card p-8 sm:p-12 text-center shadow-[4px_4px_0_var(--foreground)] rounded-none">
            <div className="mx-auto flex size-14 items-center justify-center border-2 border-foreground bg-muted text-foreground">
              <FileQuestion className="size-7" />
            </div>
            <h3 className="mt-4 font-heading text-lg font-black text-foreground">
              এই ফিল্টারে কোনো নাগরিক নথি পাওয়া যায়নি
            </h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              অন্য কোনো এলাকা, সেবার ধরন বা অনুসন্ধান শব্দ পরিবর্তন করে দেখতে পারেন।
              অথবা ফিল্টার রিসেট করুন।
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {hasActiveFilters && (
                <Link
                  href="/reports"
                  className="inline-flex items-center gap-1.5 border-2 border-border bg-background px-4 py-2 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer"
                >
                  <FilterX className="size-3.5" />
                  <span>সব ফিল্টার মুছে দিন</span>
                </Link>
              )}
              <Link
                href="/report/new"
                className="inline-flex items-center gap-1.5 border-2 border-foreground bg-primary px-4 py-2 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer"
              >
                <span>নতুন অভিযোগ নথিভুক্ত করুন</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        {meta.totalPages > 1 && (
          <div className="pt-3">
            <Pagination basePath="/reports" meta={meta} params={raw} />
          </div>
        )}
      </main>
    </div>
  );
}
