import { PageFrame } from "@/components/page-frame";
import { ReviewLedger } from "@/components/sections/methodology/review-ledger";
import { VerificationGuide } from "@/components/sections/methodology/verification-guide";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({ title: "নথি প্রকাশের পদ্ধতি", description: "গোপনীয়তা, প্রমাণ, প্রকাশনীতি ও আপিল—শিঘুষ কীভাবে নাগরিক প্রতিবেদন review করে জানুন।", path: "/methodology" });

export default function MethodologyPage() {
  return <PageFrame eyebrow="পদ্ধতি / স্বচ্ছতা" title="নথি কীভাবে প্রকাশ হয়" copy="শিঘুষ কোনো অভিযোগকে চূড়ান্ত রায় হিসেবে উপস্থাপন করে না। গোপনীয়তা, প্রমাণ, নিরপেক্ষ ভাষা এবং জবাব দেওয়ার সুযোগ—এই নীতিতে প্রতিটি নথি দেখা হয়।"><ReviewLedger /><VerificationGuide /></PageFrame>;
}
