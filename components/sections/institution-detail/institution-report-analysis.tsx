import { BarChart3 } from "lucide-react";

import {
  REPORT_CATEGORY_META,
  VERIFICATION_LEVEL_META,
} from "@/lib/domain/enums";
import { formatBnCount, formatBnNumber } from "@/lib/format";
import type {
  InstitutionMetrics,
  PublicReport,
} from "@/services/_shared/types";

/**
 * Category and verification breakdown for one institution.
 *
 * Bar widths are scaled against the largest bucket rather than a hardcoded divisor —
 * the previous `count * 12.5%` silently overflowed its container above 8.
 */
export function InstitutionReportAnalysis({
  reports,
  metrics,
}: {
  reports: PublicReport[];
  metrics?: InstitutionMetrics;
}) {
  const categories = (metrics?.byCategory ?? [])
    .slice()
    .sort((a, b) => b.count - a.count);
  const maxCount = Math.max(1, ...categories.map((c) => c.count));

  const verificationMix = Object.entries(
    reports.reduce<Record<string, number>>((acc, report) => {
      acc[report.verificationLevel] = (acc[report.verificationLevel] ?? 0) + 1;
      return acc;
    }, {}),
  ) as Array<[keyof typeof VERIFICATION_LEVEL_META, number]>;

  return (
    <section className="border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            ধরনভিত্তিক চিত্র
          </p>
          <h2 className="mt-2 text-xl font-bold">কোন বিষয়ে প্রতিবেদন এসেছে</h2>
        </div>
        <BarChart3 className="size-5 shrink-0 text-primary" />
      </div>

      {categories.length > 0 ? (
        <>
          <div className="mt-7 space-y-5">
            {categories.map(({ category, count }) => (
              <div key={category}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium">
                    {REPORT_CATEGORY_META[category].label}
                  </span>
                  <span className="font-bold">{formatBnCount(count)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {verificationMix.length > 0 && (
            <div className="mt-7 border-t border-border pt-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                যাচাইয়ের স্তর
              </p>
              <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                {verificationMix.map(([level, count]) => (
                  <li
                    className="flex items-center justify-between gap-3"
                    key={level}
                  >
                    <span className="text-muted-foreground">
                      {VERIFICATION_LEVEL_META[level].label}
                    </span>
                    <span className="font-bold">{formatBnNumber(count)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p className="mt-7 rounded-xl bg-muted p-4 text-sm leading-6 text-muted-foreground">
          এ প্রতিষ্ঠানের জন্য এখনো প্রকাশিত কোনো রিপোর্ট পাওয়া যায়নি। নতুন
          রিপোর্ট যাচাইয়ের পর এখানে যোগ হবে।
        </p>
      )}

      <p className="mt-6 text-xs leading-5 text-muted-foreground">
        একই ঘটনার একাধিক রিপোর্টকে স্বাধীনভাবে সত্য ধরে নেওয়া হয় না;
        যাচাই-স্তর আলাদা করে দেখা যায়।
      </p>
    </section>
  );
}
