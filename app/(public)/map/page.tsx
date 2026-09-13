import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageFrame } from "@/components/page-frame";
import { AreaMapBoard } from "@/components/sections/map/area-map-board";
import { MapReadingNotes } from "@/components/sections/map/map-reading-notes";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "রিপোর্টের এলাকা-চিত্র ও ম্যাপ ভিউ",
  description:
    "শিবচরের ইউনিয়নভিত্তিক নাগরিক প্রতিবেদনের গোপনীয়তা-সুরক্ষিত aggregate view দেখুন।",
  path: "/map",
});

export default function MapPage() {
  return (
    <PageFrame
      badgeText="গোপনীয়তা-সুরক্ষিত ভিউ"
      breadcrumbs={[{ label: "এলাকা পর্যবেক্ষণ" }]}
      copy="কোন ইউনিয়ন বা পৌরসভায় কী ধরনের নাগরিক অভিযোগ নথিভুক্ত হচ্ছে, তার একটি aggregate পর্যবেক্ষণ। এটি কখনো কোনো অভিযোগকারীর বাড়ির ঠিকানা বা অবস্থান প্রকাশ করে না।"
      eyebrow="এলাকা পর্যবেক্ষণ / শিবচর উপজেলা"
      title="রিপোর্টের এলাকাভিত্তিক ম্যাপ"
      action={
        <Link
          href="/statistics"
          className="inline-flex items-center gap-1.5 border-2 border-foreground bg-primary px-4 py-2 text-xs font-bold text-foreground shadow-[3px_3px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
        >
          <span>বিস্তারিত পরিসংখ্যান</span>
          <ArrowRight className="size-3.5 ml-1" />
        </Link>
      }
    >
      <div className="space-y-10">
        <AreaMapBoard />
        <MapReadingNotes />
      </div>
    </PageFrame>
  );
}
