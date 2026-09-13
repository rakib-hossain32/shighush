import Link from "next/link";
import { ArrowUpRight, BarChart3, MapPin } from "lucide-react";

import { formatBnNumber } from "@/lib/format";

const unions = [
  { name: "শিবচর পৌরসভা", count: 8, mainFactor: "ঘুষ / অতিরিক্ত অর্থ", percent: 100 },
  { name: "কাঁঠালবাড়ী", count: 5, mainFactor: "সেবা-বঞ্চনা ও লাইসেন্স", percent: 62.5 },
  { name: "পাঁচচর", count: 4, mainFactor: "তথ্য গোপন ও দীর্ঘসূত্রতা", percent: 50 },
  { name: "বাঁশকান্দি", count: 3, mainFactor: "কৃষি ও সেচ হয়রানি", percent: 37.5 },
  { name: "কুতুবপুর", count: 2, mainFactor: "স্বাস্থ্যসেবা বিলম্ব", percent: 25 },
  { name: "মাদবরেরচর", count: 2, mainFactor: "ত্রাণ ও বরাদ্দ অনিয়ম", percent: 25 },
  { name: "ভদ্রাসন", count: 1, mainFactor: "বিদ্যুৎ সংযোগ দীর্ঘসূত্রতা", percent: 12.5 },
];

export function UnionComparisonSection() {
  return (
    <div className="border-2 border-border bg-card shadow-[4px_4px_0_var(--foreground)]">
      <div className="border-b-2 border-border p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <BarChart3 className="size-4 text-primary" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                AREA BREAKDOWN
              </span>
            </div>
            <h3 className="text-xl font-extrabold font-heading mt-1 text-foreground">
              ইউনিয়নভিত্তিক অভিযোগের আপেক্ষিক বিস্তার
            </h3>
          </div>

          <Link
            href="/map"
            className="inline-flex items-center gap-1 border-2 border-foreground bg-background px-3.5 py-1.5 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer self-start sm:self-auto"
          >
            <span>ম্যাপে সরাসরি দেখুন</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          উপজেলার কোন প্রশাসনিক অঞ্চলে কতগুলো নাগরিক অভিজ্ঞতা নথিভুক্ত হয়েছে তার তুলনামূলক বার-চিত্র।
        </p>
      </div>

      <div className="p-5 sm:p-6 space-y-3.5">
        {unions.map((item) => (
          <div
            key={item.name}
            className="group border-2 border-border bg-background p-3.5 sm:p-4 transition-all hover:border-foreground hover:shadow-[2px_2px_0_var(--foreground)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5 text-primary" />
                <span className="text-sm font-bold text-foreground font-heading">
                  {item.name}
                </span>
                <span className="text-xs text-muted-foreground hidden sm:inline">·</span>
                <span className="text-xs text-muted-foreground hidden sm:inline ">
                  প্রধান উল্লিখিত ক্ষেত্র: <strong className="text-foreground">{item.mainFactor}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="border border-primary/30 bg-primary/10 px-2 py-0.5  text-xs font-bold text-primary">
                  {formatBnNumber(item.count)}টি রিপোর্ট
                </span>
              </div>
            </div>

            {/* Brutalist Sharp Progress Bar */}
            <div className="relative h-2.5 w-full bg-muted border border-border overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${item.percent}%` }}
              />
            </div>

            <p className="mt-2 text-[11px] text-muted-foreground sm:hidden">
              প্রধান বিষয়: {item.mainFactor}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
