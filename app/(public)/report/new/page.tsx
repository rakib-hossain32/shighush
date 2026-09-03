import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { PageFrame } from "@/components/page-frame";
import { ReportSubmissionForm } from "@/components/sections/report-form/report-submission-form";
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
      eyebrow="নতুন নথি / নিরাপদ ফর্ম"
      title="আপনার অভিজ্ঞতা লিখুন"
      copy="শুধু ঘটনার তথ্য দিন। নিজের বা অন্য কারও ব্যক্তিগত ফোন, NID, বাসার ঠিকানা বা অপ্রয়োজনীয় ব্যক্তিগত তথ্য লিখবেন না।"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <ReportSubmissionForm />
        
        <aside className="h-fit bg-foreground p-6 text-background">
          <LockKeyhole className="size-7 text-secondary" />
          <h2 className="display mt-6 text-3xl font-bold">
            আপনার পরিচয়
            <br />
            সুরক্ষিত থাকুক
          </h2>
          <ul className="mt-5 grid gap-4 text-sm leading-6 text-muted-foreground">
            <li>• জমার পরে একটি গোপন ট্র্যাকিং কোড পাবেন।</li>
            <li>• প্রকাশের আগে মডারেটর ব্যক্তিগত তথ্য বাদ দেবেন।</li>
            <li>• প্রমাণ থাকলে সেটি যাচাইয়ের স্তর বাড়াতে সাহায্য করে।</li>
          </ul>
          <Link
            href="/safety"
            className="mt-7 inline-flex border-b border-secondary pb-1 text-sm font-bold text-secondary"
          >
            নিরাপত্তার নিয়ম পড়ুন
          </Link>
        </aside>
      </div>
    </PageFrame>
  );
}
