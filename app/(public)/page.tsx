import { CategoryOverviewSection } from "@/components/sections/home/category-overview-section";
import { ComparisonPreviewSection } from "@/components/sections/home/comparison-preview-section";
import { FinalCtaSection } from "@/components/sections/home/final-cta-section";
import { InstitutionPreviewSection } from "@/components/sections/home/institution-preview-section";
import { LocationSection } from "@/components/sections/home/location-section";
import { FaqSection } from "@/components/sections/home/faq-section";
import { PlatformIntroSection } from "@/components/sections/home/platform-intro-section";
import { ProcessSection } from "@/components/sections/home/process-section";
import { RecentReportsSection } from "@/components/sections/home/recent-reports-section";
import { VerificationSection } from "@/components/sections/home/verification-section";
import { createPageMetadata } from "@/lib/seo";
import { StatisticsSection } from "@/components/sections/home/statistics-section";
import HeroSection from "@/components/sections/home/hero-section";
import { getReports } from "@/services";
import type { PublicReport } from "@/services/_shared/types";

export const metadata = createPageMetadata({
  title: "শিবচরের নাগরিক নথি",
  description:
    "শিবচরের জনসেবা, অনিয়ম ও জবাবদিহিতার নাগরিক-প্রতিবেদন এক জায়গায় দেখুন।",
  path: "/",
});

export default async function HomePage() {
  let reports: PublicReport[] = [];
  try {
    const response = await getReports({ limit: 50 });
    if (response?.data && response.data.length > 0) {
      reports = response.data;
    }
  } catch (error) {
    console.error("Failed to fetch reports for homepage:", error);
  }

  const latestReport = reports.length > 0 ? reports[0] : null;

  return (
    <div className="overflow-hidden">
      <HeroSection latestReport={latestReport} reports={reports} />
      <StatisticsSection />
      <PlatformIntroSection />
      <RecentReportsSection />
      <CategoryOverviewSection />
      <ComparisonPreviewSection />
      <ProcessSection />
      <InstitutionPreviewSection />
      <VerificationSection />
      <LocationSection />
      <FaqSection />
      <FinalCtaSection />
    </div>
  );
}

