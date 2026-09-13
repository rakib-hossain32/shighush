import type { Metadata } from "next";

import { PageFrame } from "@/components/page-frame";
import { PersonRecordPolicy } from "@/components/sections/person-detail/person-record-policy";
import { createPageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createPageMetadata({
    title: "সীমিত ব্যক্তি-রেকর্ড ও দায়িত্বশীলতা নীতি",
    description:
      "নাম উল্লেখের threshold, গোপনীয়তা এবং সংশোধনের অধিকার সম্পর্কে জানুন।",
    index: false,
  });
}

export default function PersonPage() {
  return (
    <PageFrame
      badgeText="ব্যতিক্রমী প্রকাশ নীতি"
      breadcrumbs={[
        { label: "নাগরিক ডিরেক্টরি", href: "/institutions" },
        { label: "ব্যক্তি সংক্রান্ত নীতি" },
      ]}
      copy="কোনো ব্যক্তির নাম কেবল নীতিগত threshold ও নির্ভরযোগ্য প্রামাণ্য ভিত্তি পূরণ হলেই অত্যন্ত সীমিত আকারে প্রদর্শনযোগ্য। একটি অভিযোগ কখনোই আদালতের চূড়ান্ত সিদ্ধান্ত নয়।"
      eyebrow="সীমিত ব্যক্তি-রেকর্ড / প্রকাশনীতি"
      title="নাম প্রকাশের আগে সুরক্ষানীতি"
    >
      <PersonRecordPolicy />
    </PageFrame>
  );
}
