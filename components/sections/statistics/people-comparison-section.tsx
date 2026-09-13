import Link from "next/link";
import { ArrowUpRight, Scale, ShieldAlert, Users } from "lucide-react";

export function PeopleComparisonSection() {
  return (
    <div className="border-2 border-border bg-card shadow-[4px_4px_0_var(--foreground)]">
      <div className="border-b-2 border-border p-5 sm:p-6 bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center border-2 border-border bg-background text-primary">
              <Users className="size-4" />
            </span>
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                PERSONNEL & INTEGRITY BENCHMARKS
              </span>
              <h3 className="text-xl font-extrabold font-heading text-foreground">
                ব্যক্তি সংক্রান্ত রিপোর্ট ও দায়িত্বশীলতার মানদণ্ড
              </h3>
            </div>
          </div>
          <span className="border-2 border-amber-500/40 bg-amber-500/10 px-2.5 py-1  text-xs font-bold text-amber-700 dark:text-amber-400">
            কঠোর নিরপেক্ষতা নীতি
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
          <div className="space-y-3 max-w-3xl">
            <p className="text-sm text-foreground font-semibold leading-relaxed">
              শিঘুষ কোনো ব্যক্তিশত্রুতা বা চরিত্রহননের মাধ্যম নয়। এখানে কাউকে একতরফাভাবে দোষী সাব্যস্ত করা হয় না।
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              পর্যাপ্ত প্রামাণ্য প্রমাণ এবং ডাবল-মডারেশন যাচাই ছাড়া কোনো সরকারি কর্মকর্তার নাম বা পদবি পাবলিক ডেটাবেজে তালিকাভুক্ত করা হয় না। অভিযুক্ত ব্যক্তির আত্মপক্ষ সমর্থন ও দাপ্তরিক প্রতিক্রিয়া উপস্থাপনের পূর্ণ সুযোগ নিশ্চিত করা হয়।
            </p>

            <div className="border-2 border-border bg-secondary/40 p-3.5 flex items-start gap-2.5 mt-4">
              <ShieldAlert className="size-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                ব্যক্তির নাম প্রকাশের ক্ষেত্রে দুই স্তরের মানব পর্যালোচক এবং আইনি নির্দেশিকা প্রযোজ্য।
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center sm:items-end">
            <Link
              href="/methodology"
              className="inline-flex items-center gap-1.5 border-2 border-foreground bg-background px-4 py-2 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
            >
              <Scale className="size-3.5 text-primary" />
              <span>পূর্ণ মেথডোলজি ও আপিল নীতি</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

