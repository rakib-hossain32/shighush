import { PageFrame } from "@/components/page-frame";
import { Pagination } from "@/components/pagination";
import { InstitutionCard } from "@/components/sections/institutions/institution-card";
import { InstitutionSummary } from "@/components/sections/institutions/institution-summary";
import { InstitutionToolbar } from "@/components/sections/institutions/institution-toolbar";
import { AREAS } from "@/lib/domain/geo";
import { institutionFilterSchema, parseFilters } from "@/lib/domain/schemas";
import { getStatistics, getInstitutions } from "@/services";
import type { InstitutionCategory } from "@/lib/domain/enums";
import { createPageMetadata } from "@/lib/seo";
import { formatBnCount } from "@/lib/format";

export const metadata = createPageMetadata({
  title: "সেবা প্রতিষ্ঠানের রেকর্ড",
  description:
    "শিবচরের সরকারি ও আধা-সরকারি প্রতিষ্ঠানের নাগরিক প্রতিবেদন ও জবাবদিহিতার রেকর্ড।",
  path: "/institutions",
});

type InstitutionsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function InstitutionsPage({ searchParams }: InstitutionsPageProps) {
  const raw = await searchParams;
  const filters = parseFilters(institutionFilterSchema, raw);

  const response = await getInstitutions({
    page: filters.page,
    limit: 12,
    search: filters.search,
    category: filters.category as InstitutionCategory | InstitutionCategory[] | undefined,
    area: filters.area,
  });

  const institutions = response?.data ?? [];
  const meta = response?.meta ?? { total: 0, page: 1, limit: 12, totalPages: 0 };

  // Platform-wide evidence rate, from the same source as every other figure.
  const statsResponse = await getStatistics("year");
  const stats = statsResponse?.data;
  const evidenceRate =
    !stats || stats.totals.reports === 0
      ? 0
      : stats.totals.evidenceAttachedReports / stats.totals.reports;

  return (
    <PageFrame
      badgeText={`${meta.total} প্রতিষ্ঠান তালিকাভুক্ত`}
      breadcrumbs={[{ label: "সেবা প্রতিষ্ঠানের রেকর্ড" }]}
      copy="শিবচরের সরকারি ও আধা-সরকারি প্রতিষ্ঠানের প্রাথমিক সূচি। প্রতিটি প্রোফাইলে প্রাসঙ্গিক রিপোর্ট, যাচাইয়ের স্তর, আপডেটের সময় এবং প্রতিষ্ঠানের উত্তর এক জায়গায় থাকবে।"
      eyebrow="প্রতিষ্ঠান সূচি / শিবচর উপজেলা"
      title="সেবা প্রতিষ্ঠানের রেকর্ড"
    >
      <div className="grid gap-8">
        <InstitutionSummary
          areaCount={AREAS.length}
          evidenceRate={evidenceRate}
          institutionCount={meta.total}
        />

        <InstitutionToolbar
          category={filters.category}
          count={meta.total}
          search={filters.search}
        />

        <section>
          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h2 className="display text-3xl font-bold">প্রতিষ্ঠানসমূহ</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                প্রকাশিত রিপোর্টের সংখ্যা অনুযায়ী সাজানো; এটি কোনো অপরাধের চূড়ান্ত পরিমাপ নয়।
              </p>
            </div>
            <p className=" text-[11px] font-bold tracking-[.13em] text-primary">
              {formatBnCount(institutions.length)} দেখানো হচ্ছে
            </p>
          </div>

          {institutions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {institutions.map((institution) => (
                <InstitutionCard institution={institution} key={institution.slug} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-border bg-muted p-8 text-center">
              <p className="font-bold">এই ফিল্টারে কোনো প্রতিষ্ঠান পাওয়া যায়নি</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                অন্য শ্রেণি বেছে দেখুন, বা অনুসন্ধান খালি রেখে সম্পূর্ণ তালিকা দেখুন।
              </p>
            </div>
          )}

          <Pagination basePath="/institutions" meta={meta} params={raw} />
        </section>

        <section className="border-l-4 border-secondary bg-muted p-5 text-sm leading-6">
          <strong>তালিকায় কোনো প্রতিষ্ঠান নেই?</strong>
          <p className="mt-1 text-muted-foreground">
            আপনার রিপোর্ট জমা দেওয়ার সময় প্রতিষ্ঠানের নাম লিখতে পারবেন। মডারেটর যাচাই করে
            সেটিকে canonical প্রতিষ্ঠান তালিকায় যুক্ত করবেন।
          </p>
        </section>
      </div>
    </PageFrame>
  );
}
