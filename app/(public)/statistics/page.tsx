import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageFrame } from "@/components/page-frame";
import { AnalyticsFilterBar } from "@/components/sections/statistics/analytics-filter-bar";
import { ComparisonSummary } from "@/components/sections/statistics/comparison-summary";
import { DataNotice } from "@/components/sections/statistics/data-notice";
import { FactorAndMoneySection } from "@/components/sections/statistics/factor-and-money-section";
import { PeopleComparisonSection } from "@/components/sections/statistics/people-comparison-section";
import { UnionComparisonSection } from "@/components/sections/statistics/union-comparison-section";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "তুলনামূলক বিশ্লেষণ ও পরিসংখ্যান",
  description:
    "শিবচরের ইউনিয়ন, অভিযোগের ধরন ও প্রতিবেদনে উল্লিখিত অর্থের তুলনামূলক চিত্র।",
  path: "/statistics",
});

type StatisticsPageProps = {
  searchParams: Promise<{ period?: string }>;
};

export default async function StatisticsPage({
  searchParams,
}: StatisticsPageProps) {
  const { period = "30d" } = await searchParams;

  return (
    <PageFrame
      badgeText="নাগরিক ডেটা ড্যাশবোর্ড"
      breadcrumbs={[{ label: "তুলনামূলক বিশ্লেষণ" }]}
      copy="ইউনিয়ন, অভিযোগের ধরন ও রিপোর্টে উল্লিখিত অর্থের তুলনামূলক চিত্র। কোনো সংখ্যাই বাস্তব দুর্নীতি বা অপরাধের চূড়ান্ত প্রমাণ নয়—এটি নাগরিক প্রতিবেদন থেকে নেওয়া aggregate দৃশ্য।"
      eyebrow="পরিসংখ্যান / তুলনামূলক বিশ্লেষণ"
      title="কোথায়, কীভাবে, কত টাকার রিপোর্ট?"
      action={
        <Link
          href="/map"
          className="inline-flex items-center gap-1.5 border-2 border-foreground bg-primary px-4 py-2 text-xs font-bold text-foreground shadow-[3px_3px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
        >
          <span>এলাকা ম্যাপ দেখুন</span>
          <ArrowRight className="size-3.5 ml-1" />
        </Link>
      }
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
