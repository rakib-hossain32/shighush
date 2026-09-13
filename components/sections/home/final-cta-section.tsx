import Link from "next/link";
import { ArrowUpRight, LockKeyhole, ShieldCheck, CheckCircle2, FileText } from "lucide-react";

export function FinalCtaSection() {
  return (
    <section className="relative border-b-2 border-foreground bg-foreground text-background py-20 sm:py-24 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            {/* Privacy Badge */}
            <div className="inline-flex items-center gap-2 border border-background/20 bg-background/10 px-3.5 py-1.5 text-xs font-bold text-background backdrop-blur-xs">
              <LockKeyhole className="size-3.5 text-primary" />
              <span>আপনার পরিচয় সম্পূর্ণ গোপন ও এনক্রিপ্টেড থাকবে</span>
            </div>

            {/* Main Headline */}
            <h2 className="mt-6 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl tracking-tight text-background">
              আপনার অভিজ্ঞতাকে কেবল ক্ষোভ নয়,<br className="hidden sm:inline" />
              একটি প্রামাণ্য নথিতে রূপ দিন।
            </h2>

            <p className="mt-5 text-sm sm:text-base leading-relaxed text-background/80 max-w-2xl">
              ঘটনাটি যত ছোটই মনে হোক না কেন, তা নথিভুক্ত হওয়া জরুরি। নির্ভয়ে তথ্য
              দিন, একটি গোপন ট্র্যাকিং কোড সংরক্ষণ করুন, আর জবাবদিহিতা নিশ্চিত
              করতে শিবচরের নাগরিকদের সঙ্গে যোগ দিন।
            </p>

            {/* 3 Citizen Guarantees */}
            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-background/90">
              <span className="inline-flex items-center gap-2 font-medium">
                <CheckCircle2 className="size-4 text-primary" />
                কোনো পরিচয় বা ফোন নম্বর লাগবে না
              </span>
              <span className="inline-flex items-center gap-2 font-medium">
                <ShieldCheck className="size-4 text-primary" />
                তথ্য সম্পূর্ণ নিরাপদ ও সংরক্ষিত
              </span>
              <span className="inline-flex items-center gap-2 font-medium">
                <FileText className="size-4 text-primary" />
                প্রমাণসহ বিনামূল্যে দাখিল
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0 w-full sm:w-auto">
            <Link
              href="/report/new"
              className="group inline-flex items-center justify-center gap-3 border-2 border-primary bg-primary px-7 py-4 text-base font-bold text-primary-foreground shadow-[4px_4px_0_var(--background)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
            >
              <span>অভিযোগ নথিভুক্ত করুন</span>
              <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <Link
              href="/safety"
              className="inline-flex items-center justify-center gap-2 border border-background/40 bg-transparent px-5 py-4 text-sm font-semibold text-background transition-colors hover:bg-background/10 hover:border-background cursor-pointer"
            >
              নিরাপত্তা নীতি জানুন
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
