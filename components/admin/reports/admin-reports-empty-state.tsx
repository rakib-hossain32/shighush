import Link from "next/link";
import { FileQuestion, FilterX, RotateCcw } from "lucide-react";

type AdminReportsEmptyStateProps = {
  hasActiveFilters?: boolean;
};

export function AdminReportsEmptyState({ hasActiveFilters = false }: AdminReportsEmptyStateProps) {
  return (
    <div className="border-2 border-dashed border-border bg-card p-8 text-center shadow-[3px_3px_0_var(--foreground)] sm:p-12">
      <div className="mx-auto flex size-14 items-center justify-center border-2 border-border bg-muted text-foreground">
        <FileQuestion className="size-7 text-primary" />
      </div>

      <h3 className="mt-4 font-heading text-base font-bold text-foreground">
        এই ফিল্টারে কোনো নথি পাওয়া যায়নি
      </h3>

      <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted-foreground">
        অন্য কোনো ভিউ, দায়িত্বপ্রাপ্ত ব্যক্তি বা অবস্থা নির্বাচন করে দেখতে পারেন। অথবা সব ফিল্টার
        মুছে মূল তালিকায় ফিরে যান। কিউ সম্পূর্ণ খালি থাকাও সুসংবাদ!
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {hasActiveFilters && (
          <Link
            className="inline-flex items-center gap-1.5 border-2 border-border bg-background px-4 py-2 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            href="/admin/reports"
          >
            <FilterX className="size-3.5" />
            <span>ফিল্টার রিসেট করুন</span>
          </Link>
        )}

        <Link
          className="inline-flex items-center gap-1.5 border-2 border-foreground bg-primary px-4 py-2 text-xs font-bold text-foreground shadow-[3px_3px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          href="/admin/reports?view=active"
        >
          <RotateCcw className="size-3.5" />
          <span>চলমান মডারেশন কিউ দেখুন</span>
        </Link>
      </div>
    </div>
  );
}
