import { CategoryOverviewSection } from "@/components/sections/home/category-overview-section";
import { ComparisonPreviewSection } from "@/components/sections/home/comparison-preview-section";
import { FinalCtaSection } from "@/components/sections/home/final-cta-section";
import { HeroSection } from "@/components/sections/home/hero-section";
import { InstitutionPreviewSection } from "@/components/sections/home/institution-preview-section";
import { LocationSection } from "@/components/sections/home/location-section";
import { PlatformIntroSection } from "@/components/sections/home/platform-intro-section";
import { ProcessSection } from "@/components/sections/home/process-section";
import { RecentReportsSection } from "@/components/sections/home/recent-reports-section";
import { VerificationSection } from "@/components/sections/home/verification-section";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({ title: "শিবচরের নাগরিক নথি", description: "শিবচরের জনসেবা, অনিয়ম ও জবাবদিহিতার নাগরিক-প্রতিবেদন এক জায়গায় দেখুন।", path: "/" });

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <PlatformIntroSection />
      <RecentReportsSection />
      <CategoryOverviewSection />
      <ComparisonPreviewSection />
      <ProcessSection />
      <InstitutionPreviewSection />
      <VerificationSection />
      <LocationSection />
      <FinalCtaSection />
    </div>
  );
}
