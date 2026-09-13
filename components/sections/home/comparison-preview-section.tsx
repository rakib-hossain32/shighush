import Link from "next/link";
import { ArrowUpRight, BarChart3, Banknote, MapPinned, TrendingUp } from "lucide-react";
import { toBnDigits } from "@/lib/format";

const unionStats = [
  {
    name: "শিবচর পৌরসভা",
    count: 8,
    percentage: 85,
    primaryIssue: "ঘুষ / অতিরিক্ত অর্থ",
    color: "bg-primary",
  },
  {
    name: "কাঁঠালবাড়ী ইউনিয়ন",
    count: 5,
    percentage: 55,
    primaryIssue: "সেবা-বঞ্চনা ও বিলম্ব",
    color: "bg-amber-500",
  },
  {
    name: "পাঁচচর ইউনিয়ন",
    count: 4,
    percentage: 42,
    primaryIssue: "তথ্য গোপন ও নিয়ম বহির্ভূত ফি",
    color: "bg-blue-500",
  },
  {
    name: "মাদবরেরচর ইউনিয়ন",
    count: 3,
    percentage: 32,
    primaryIssue: "দাপ্তরিক হয়রানি",
    color: "bg-rose-500",
  },
];

export function ComparisonPreviewSection() {
  return (
    <section className="relative border-b-2 border-border bg-card/40 py-18 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          {/* Left Column: Context & Overview */}
          <div>
            <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold tracking-wider text-primary">
              <BarChart3 className="size-3.5" />
              <span>০৬ — ভৌগোলিক ও আর্থিক বিশ্লেষণ</span>
            </div>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              কোথায় কী ধরনের<br className="hidden sm:inline" />
              অভিযোগ সবচেয়ে বেশি?
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              শিবচরের বিভিন্ন ইউনিয়ন, অভিযোগের ধরন, প্রমাণ সংযুক্তির হার এবং নথিতে
              উল্লিখিত টাকার অঙ্ক—সব এক জায়গায় তুলনা করে অনিয়মের সামগ্রিক প্যাটার্ন
              অনুধাবন করুন।
            </p>

            {/* Micro Stats Grid */}
            <div className="mt-8 grid grid-cols-2 gap-4 border-y border-border py-6 sm:grid-cols-3">
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <MapPinned className="size-3.5 text-primary" />
                  এলাকা কভারেজ
                </span>
                <span className="text-xl font-extrabold text-foreground">
                  {toBnDigits("12")}টি ইউনিয়ন
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Banknote className="size-3.5 text-primary" />
                  নথিকৃত অর্থ
                </span>
                <span className="text-xl font-extrabold text-foreground">
                  ৳ {toBnDigits("72,500")}
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1 flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <TrendingUp className="size-3.5 text-primary" />
                  প্রধান অনিয়ম
                </span>
                <span className="text-sm font-bold text-foreground">
                  ঘুষ ও সেবা-বঞ্চনা
                </span>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/statistics"
                className="inline-flex items-center gap-2 border-2 border-foreground bg-primary px-6 py-3.5 text-sm font-bold text-foreground shadow-[3px_3px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
              >
                <span>সম্পূর্ণ পরিসংখ্যান ড্যাশবোর্ড দেখুন</span>
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Comparative Visual Card */}
          <div className="border-2 border-border bg-background p-6 sm:p-8 shadow-[4px_4px_0_var(--foreground)]">
            <div className="flex items-center justify-between border-b border-border pb-5">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  ইউনিয়নভিত্তিক রিপোর্ট ঘনত্ব
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  গত ৩০ দিনে নাগরিক দাখিলকৃত শীর্ষ এলাকা
                </p>
              </div>
              <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-1 text-[11px] font-bold text-primary">
                লাইভ প্রিভিউ
              </span>
            </div>

            {/* Progress Bars List */}
            <div className="mt-6 space-y-6">
              {unionStats.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div>
                      <span className="font-bold text-foreground">{item.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({item.primaryIssue})
                      </span>
                    </div>
                    <span className=" text-sm font-extrabold text-primary">
                      {toBnDigits(item.count)}টি
                    </span>
                  </div>

                  {/* Visual Progress Track */}
                  <div className="h-2.5 w-full overflow-hidden rounded-none bg-muted border border-border/40">
                    <div
                      className={`h-full ${item.color} transition-all duration-700`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Disclaimer Footer Note */}
            <p className="mt-8 border-t border-border/70 pt-4 text-xs leading-relaxed text-muted-foreground">
              * প্রকাশিত সংখ্যা কোনো এলাকার নৈতিক বা আইনি রায় নির্দেশ করে না; এটি শুধু
              নাগরিক সচেতনতা ও রিপোর্ট দাখিলের অনুপাত প্রদর্শন করে।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
