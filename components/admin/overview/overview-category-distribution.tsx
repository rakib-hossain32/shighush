import Link from "next/link";
import { ArrowUpRight, BarChart3, ShieldCheck } from "lucide-react";

import { MetaBadge } from "@/components/ui/status-badge";
import { REPORT_CATEGORY_META, VERIFICATION_LEVEL_META } from "@/lib/domain/enums";
import { formatBnNumber, toBnDigits } from "@/lib/format";
import type { ReportCategory, VerificationLevel } from "@/services/_shared/types";

export function OverviewCategoryDistribution({
  byCategory,
  byVerification,
  totalReports,
}: {
  byCategory: Array<{ category: ReportCategory; count: number }>;
  byVerification: Array<{ level: VerificationLevel; count: number }>;
  totalReports: number;
}) {
  const safeTotal = totalReports > 0 ? totalReports : 1;

  // Sort categories by highest count
  const sortedCategories = [...byCategory].sort((a, b) => b.count - a.count);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Category Breakdown */}
      <div className="border-2 border-foreground bg-card p-5 shadow-[3px_3px_0_var(--foreground)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center border border-foreground bg-primary/20 text-primary">
                <BarChart3 className="size-3.5" />
              </span>
              <h3 className="font-heading text-sm font-bold text-foreground">
                অভিযোগের ক্যাটাগরি বণ্টন
              </h3>
            </div>
            <Link
              href="/admin/reports"
              className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground"
            >
              সকল ক্যাটাগরি <ArrowUpRight className="size-3" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {sortedCategories.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                কোনো ক্যাটাগরি ডাটা পাওয়া যায়নি।
              </p>
            ) : (
              sortedCategories.slice(0, 6).map((item) => {
                const meta = REPORT_CATEGORY_META[item.category];
                const percentage = Math.round((item.count / safeTotal) * 100);

                return (
                  <div key={item.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">
                        {meta?.label || item.category}
                      </span>
                      <div className="flex items-center gap-2 text-muted-foreground ">
                        <span>{formatBnNumber(item.count)}টি</span>
                        <span className="font-bold text-foreground">
                          ({toBnDigits(percentage)}%)
                        </span>
                      </div>
                    </div>
                    {/* Progress meter */}
                    <div className="h-2 w-full overflow-hidden border border-border bg-muted/50">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(4, percentage))}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <p className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
          * নাগরিকদের জমা দেওয়া নথির মূল অভিযোগের ভিত্তিতে ক্যাটাগরিগুলো নির্ধারিত।
        </p>
      </div>

      {/* Verification Level Breakdown */}
      <div className="border-2 border-foreground bg-card p-5 shadow-[3px_3px_0_var(--foreground)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center border border-foreground bg-accent/20 text-accent-foreground">
                <ShieldCheck className="size-3.5" />
              </span>
              <h3 className="font-heading text-sm font-bold text-foreground">
                যাচাই স্তর ও বিশ্বাসযোগ্যতা
              </h3>
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              মডারেশন মানদণ্ড
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {byVerification.map((item) => {
              const meta = VERIFICATION_LEVEL_META[item.level];
              const percentage = Math.round((item.count / safeTotal) * 100);

              return (
                <div
                  key={item.level}
                  className="border border-border bg-muted/20 p-3.5 transition-colors hover:border-foreground"
                >
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-xs font-bold text-foreground">
                      {meta?.label || item.level}
                    </span>
                    <span className=" text-xs font-bold text-primary">
                      {toBnDigits(percentage)}%
                    </span>
                  </div>
                  <p className="text-2xl font-black font-heading text-foreground">
                    {formatBnNumber(item.count)}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">
                    {meta?.short ? `শ্রেণি: ${meta.short}` : "যাচাইকৃত নথি"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
          প্রমাণের গ্রহণযোগ্যতা এবং দালিলিক প্রমাণের ভিত্তিতে প্রকাশনা নিশ্চিত করা হয়।
        </div>
      </div>
    </div>
  );
}
