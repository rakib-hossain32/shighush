import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { PageFrame } from "@/components/page-frame";
import { ProcessGuide } from "@/components/sections/report-form/process-guide";
import { ReportSubmissionForm } from "@/components/sections/report-form/report-submission-form";
import { SafetyRail, SafetyStrip, TrackingCard } from "@/components/sections/report-form/safety-rail";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "নিরাপদে অভিযোগ জমা দিন",
  description:
    "পরিচয় সুরক্ষিত রেখে শিবচরের জনসেবা-সংক্রান্ত অভিজ্ঞতা নথিভুক্ত করুন।",
  path: "/report/new",
  index: false,
});

export default function NewReportPage() {
  return (
    <PageFrame
      badgeText="এনক্রিপ্টেড ও পরিচয়-মুক্ত"
      breadcrumbs={[{ label: "অভিযোগ জমা দিন" }]}
      copy="পরিচয় সম্পূর্ণ গোপন রেখে ঘটনার বস্তুনিষ্ঠ তথ্য দিন। নিজের বা অন্য কারও ব্যক্তিগত ফোন নম্বর বা NID লিখবেন না।"
      eyebrow="নিরাপদ অভিযোগ ফরম"
      title="নাগরিক অভিযোগ জমা দিন"
      action={
        <Link
          className="inline-flex cursor-pointer items-center gap-1.5 border-2 border-foreground bg-primary px-3.5 py-1.5 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          href="/safety"
        >
          <ShieldCheck aria-hidden="true" className="size-3.5" />
          <span>সুরক্ষা নীতি</span>
        </Link>
      }
    >
      <div className="flex flex-col gap-6 sm:gap-8">
        {/* On desktop (lg+), the full process overview is shown above the columns */}
        <div className="hidden lg:block">
          <ProcessGuide />
        </div>

        <div className="grid items-start gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex min-w-0 flex-col gap-6 sm:gap-8">
            <ReportSubmissionForm />
            <TrackingCard className="lg:hidden" />
          </div>

          <SafetyRail />
        </div>
      </div>
    </PageFrame>
  );
}
