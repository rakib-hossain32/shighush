import { PageFrame } from "@/components/page-frame";
import { AnalyticsFilterBar } from "@/components/sections/statistics/analytics-filter-bar";
import { ComparisonSummary } from "@/components/sections/statistics/comparison-summary";
import { DataNotice } from "@/components/sections/statistics/data-notice";
import { FactorAndMoneySection } from "@/components/sections/statistics/factor-and-money-section";
import { PeopleComparisonSection } from "@/components/sections/statistics/people-comparison-section";
import { UnionComparisonSection } from "@/components/sections/statistics/union-comparison-section";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({ title: "তুলনামূলক বিশ্লেষণ", description: "শিবচরের ইউনিয়ন, অভিযোগের ধরন ও প্রতিবেদনে উল্লিখিত অর্থের তুলনামূলক চিত্র।", path: "/statistics" });

type StatisticsPageProps = {
  searchParams: Promise<{ period?: string }>;
};

export default async function StatisticsPage({
  searchParams,
}: StatisticsPageProps) {
  const { period = "30d" } = await searchParams;

  return (
    <PageFrame
      eyebrow="পরিসংখ্যান / তুলনামূলক বিশ্লেষণ"
      title="কোথায়, কীভাবে, কত টাকার রিপোর্ট?"
      copy="ইউনিয়ন, অভিযোগের ধরন ও রিপোর্টে উল্লিখিত অর্থের তুলনামূলক চিত্র। কোনো সংখ্যা বাস্তব দুর্নীতি বা অপরাধ প্রমাণ করে না।"
    >
      <div className="grid gap-8">
        <AnalyticsFilterBar period={period} />
        <DataNotice />
        <ComparisonSummary />
        <UnionComparisonSection />
        <FactorAndMoneySection />
        <PeopleComparisonSection />
      </div>
    </PageFrame>
  );
}
