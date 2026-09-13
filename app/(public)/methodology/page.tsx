import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageFrame } from "@/components/page-frame";
import { ReviewLedger } from "@/components/sections/methodology/review-ledger";
import { VerificationGuide } from "@/components/sections/methodology/verification-guide";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "নথি প্রকাশের পদ্ধতি ও যাচাইকরণ নীতি",
  description:
    "গোপনীয়তা, প্রমাণ, প্রকাশনীতি ও আপিল—শিঘুষ কীভাবে নাগরিক প্রতিবেদন পর্যালোচনা ও যাচাই করে তা বিস্তারিত জানুন।",
  path: "/methodology",
});

export default function MethodologyPage() {
  return (
    <PageFrame
      badgeText="স্বচ্ছ ও উন্মুক্ত পদ্ধতি"
      breadcrumbs={[{ label: "পদ্ধতি ও স্বচ্ছতা" }]}
      copy="শিঘুষ কোনো অভিযোগকে একতরফা বা চূড়ান্ত রায় হিসেবে উপস্থাপন করে না। গোপনীয়তা সুরক্ষা, প্রমাণ যাচাই, নিরপেক্ষ ভাষা এবং আত্মপক্ষ সমর্থনের অধিকার নিশ্চিত করে জনস্বার্থে প্রতিটি নাগরিক নথি প্রকাশ করা হয়।"
      eyebrow="পদ্ধতি / স্বচ্ছতা ও বিশ্বাসযোগ্যতা"
      title="নাগরিক নথি কীভাবে যাচাই ও প্রকাশ হয়"
      action={
        <Link
          href="/reports"
          className="inline-flex items-center gap-1.5 border-2 border-foreground bg-primary px-4 py-2 text-xs font-bold text-foreground shadow-[3px_3px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
        >
          <span>প্রকাশিত নথি দেখুন</span>
          <ArrowRight className="size-3.5 ml-1" />
        </Link>
      }
    >
      <div className="space-y-12">
        <ReviewLedger />
        <VerificationGuide />
      </div>
    </PageFrame>
  );
}
