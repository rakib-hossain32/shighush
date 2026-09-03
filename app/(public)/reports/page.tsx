import { PageFrame } from "@/components/page-frame";
import { Pagination } from "@/components/pagination";
import { MobileFilterSheet } from "@/components/sections/reports/mobile-filter-sheet";
import { ReportListCard } from "@/components/sections/reports/report-list-card";
import { ReportsFilterPanel } from "@/components/sections/reports/reports-filter-panel";
import { ReportsToolbar } from "@/components/sections/reports/reports-toolbar";
import { parseFilters, reportFilterSchema } from "@/lib/domain/schemas";
import { getReports } from "@/services";
import { createPageMetadata } from "@/lib/seo";

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
    category: filters.category,
    verificationLevel: filters.verificationLevel,
    area: filters.area,
    institution: filters.institution,
    sort: filters.sort,
  });

  const reports = response.data;
  const meta = response.meta;

  return (
    <PageFrame
      copy="প্রতিটি নথি একটি নাগরিক-প্রতিবেদন; এটি কোনো অপরাধের চূড়ান্ত প্রমাণ নয়। যাচাইয়ের স্তর, প্রকাশের তারিখ এবং প্রাসঙ্গিক তথ্য আলাদা করে দেখানো হয়।"
      eyebrow="নথি ভাণ্ডার / প্রকাশিত প্রতিবেদন"
      title="অভিযোগের রেকর্ড"
    >
      {/*
        One GET form wraps both the toolbar and the filter panel. Submitting either
        rewrites the query string and this Server Component re-renders — so search,
        sort and filters compose instead of overwriting one another, with no client state.
      */}
      <form
        action="/reports"
        className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]"
        method="GET"
      >
        <section className="lg:order-2">
          <ReportsToolbar count={meta.total} search={filters.search} sort={filters.sort} />
          <MobileFilterSheet filters={filters} />

          {reports.length > 0 ? (
            <div className="mt-1">
              {reports.map((report) => (
                <ReportListCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <div className="mt-8 border border-dashed border-border bg-muted p-8 text-center">
              <p className="font-bold">এই ফিল্টারে কোনো নথি পাওয়া যায়নি</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                অন্য ধরন, এলাকা বা যাচাইয়ের স্তর বেছে দেখুন। নতুন নথি রিভিউ শেষে এখানে যোগ
                হবে।
              </p>
            </div>
          )}

          <Pagination basePath="/reports" meta={meta} params={raw} />
        </section>

        <ReportsFilterPanel
          className="order-3 hidden lg:order-1 lg:sticky lg:top-20 lg:block"
          filters={filters}
        />
      </form>
    </PageFrame>
  );
}
