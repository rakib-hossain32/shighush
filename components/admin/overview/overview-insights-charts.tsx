import Link from "next/link";
import {
  ArrowUpRight,
  Banknote,
  Building2,
  MapPin,
  UserSearch,
  Wrench,
} from "lucide-react";

import { areaName } from "@/lib/domain/geo";
import { REPORT_CATEGORY_META } from "@/lib/domain/enums";
import { formatBnCurrency, formatBnNumber, toBnDigits } from "@/lib/format";
import type { Statistics } from "@/services/_shared/types";

type OverviewInsightsProps = {
  byArea: Statistics["byArea"];
  byInstitution: Statistics["byInstitution"];
  byAccused: Statistics["byAccused"];
  byService: Statistics["byService"];
  totalReports: number;
};

export function OverviewInsightsCharts({
  byArea,
  byInstitution,
  byAccused,
  byService,
  totalReports,
}: OverviewInsightsProps) {
  const safeTotal = totalReports > 0 ? totalReports : 1;
  const sortedAreas = [...(byArea || [])].sort((a, b) => b.count - a.count);
  const sortedInstitutions = [...(byInstitution || [])].sort((a, b) => b.count - a.count);
  const sortedAccused = [...(byAccused || [])].sort((a, b) => b.count - a.count);
  const sortedServices = [...(byService || [])].sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      {/* Row 1: Area + Institution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Area Distribution */}
        <div className="border-2 border-foreground bg-card p-5 shadow-[3px_3px_0_var(--foreground)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center border border-foreground bg-accent/20 text-accent-foreground">
                  <MapPin className="size-3.5" />
                </span>
                <h3 className="font-heading text-sm font-bold text-foreground">
                  এলাকা অনুযায়ী অভিযোগের মানচিত্র
                </h3>
              </div>
              <Link
                href="/admin/reports"
                className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                সকল এলাকা <ArrowUpRight className="size-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {sortedAreas.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  কোনো এলাকাভিত্তিক ডাটা পাওয়া যায়নি।
                </p>
              ) : (
                sortedAreas.slice(0, 8).map((item) => {
                  const percentage = Math.round((item.count / safeTotal) * 100);
                  const catMeta = item.topCategory ? REPORT_CATEGORY_META[item.topCategory] : null;

                  return (
                    <div key={item.area} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-semibold text-foreground truncate">
                            {areaName(item.area)}
                          </span>
                          {catMeta && (
                            <span className="shrink-0 rounded-none border border-border bg-muted/40 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                              {catMeta.short}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0 text-muted-foreground ">
                          <span>{formatBnNumber(item.count)}টি</span>
                          <span className="font-bold text-foreground">
                            ({toBnDigits(percentage)}%)
                          </span>
                        </div>
                      </div>
                      <div className="h-2 w-full overflow-hidden border border-border bg-muted/50">
                        <div
                          className="h-full bg-accent transition-all duration-500"
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
            * কোন এলাকায় সবচেয়ে বেশি দুর্নীতির অভিযোগ এসেছে তার ভৌগলিক বণ্টন।
          </p>
        </div>

        {/* Institution Distribution */}
        <div className="border-2 border-foreground bg-card p-5 shadow-[3px_3px_0_var(--foreground)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center border border-foreground bg-primary/20 text-primary">
                  <Building2 className="size-3.5" />
                </span>
                <h3 className="font-heading text-sm font-bold text-foreground">
                  সর্বাধিক অভিযোগপ্রাপ্ত প্রতিষ্ঠান
                </h3>
              </div>
              <Link
                href="/admin/institutions"
                className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                সকল প্রতিষ্ঠান <ArrowUpRight className="size-3" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {sortedInstitutions.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  কোনো প্রতিষ্ঠানভিত্তিক ডাটা পাওয়া যায়নি।
                </p>
              ) : (
                sortedInstitutions.slice(0, 6).map((item, idx) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between border border-border bg-background p-3 transition-colors hover:border-foreground"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="grid size-7 shrink-0 place-items-center border border-foreground bg-muted font-heading text-xs font-bold text-foreground">
                        {toBnDigits(idx + 1)}
                      </span>
                      <span className="truncate font-heading text-xs font-bold text-foreground">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {item.totalAmount && item.totalAmount > 0 && (
                        <span className="inline-flex items-center gap-1 border border-border bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          <Banknote className="size-3" />
                          {formatBnCurrency(item.totalAmount)}
                        </span>
                      )}
                      <span className="rounded-none border border-foreground bg-primary px-2 py-0.5 text-[10px] font-bold text-foreground shadow-[1px_1px_0_var(--foreground)]">
                        {formatBnNumber(item.count)}টি
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <p className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
            * সবচেয়ে বেশি অভিযোগপ্রাপ্ত শীর্ষ প্রতিষ্ঠান ও সংশ্লিষ্ট অর্থের পরিমাণ।
          </p>
        </div>
      </div>

      {/* Row 2: Accused + Service */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Accused Persons */}
        <div className="border-2 border-foreground bg-card p-5 shadow-[3px_3px_0_var(--foreground)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center border border-foreground bg-destructive/15 text-destructive">
                  <UserSearch className="size-3.5" />
                </span>
                <h3 className="font-heading text-sm font-bold text-foreground">
                  অভিযুক্ত ব্যক্তি / পদবী
                </h3>
              </div>
            </div>

            <div className="space-y-2.5">
              {sortedAccused.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  কোনো অভিযুক্ত ব্যক্তির তথ্য পাওয়া যায়নি।
                </p>
              ) : (
                sortedAccused.slice(0, 6).map((item, idx) => {
                  const catMeta = item.category
                    ? REPORT_CATEGORY_META[item.category as keyof typeof REPORT_CATEGORY_META]
                    : null;

                  return (
                    <div
                      key={`${item.name}-${item.designation}-${idx}`}
                      className="border border-border bg-background p-3 transition-colors hover:border-foreground"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-heading text-xs font-bold text-foreground">
                              {item.name}
                            </span>
                            {catMeta && (
                              <span className="rounded-none border border-border bg-muted/40 px-1 py-0.2 text-[9px] font-medium text-muted-foreground">
                                {catMeta.short}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            {item.designation}
                            {item.institution ? ` — ${item.institution}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.totalAmount && item.totalAmount > 0 && (
                            <span className="text-[10px]   text-muted-foreground">
                              {formatBnCurrency(item.totalAmount)}
                            </span>
                          )}
                          <span className="rounded-none border border-foreground bg-destructive/10 px-1.5 py-0.5 text-[10px] font-bold text-destructive">
                            {formatBnNumber(item.count)}টি
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <p className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
            * নাগরিকদের প্রদত্ত তথ্যের ভিত্তিতে — চূড়ান্ত যাচাই নয়।
          </p>
        </div>

        {/* Service Breakdown */}
        <div className="border-2 border-foreground bg-card p-5 shadow-[3px_3px_0_var(--foreground)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center border border-foreground bg-muted text-foreground">
                  <Wrench className="size-3.5" />
                </span>
                <h3 className="font-heading text-sm font-bold text-foreground">
                  সেবা/কাজ অনুযায়ী অভিযোগ বিশ্লেষণ
                </h3>
              </div>
            </div>

            <div className="space-y-2.5">
              {sortedServices.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  কোনো সেবাভিত্তিক ডাটা পাওয়া যায়নি।
                </p>
              ) : (
                sortedServices.slice(0, 6).map((item, idx) => {
                  const percentage = Math.round((item.count / safeTotal) * 100);

                  return (
                    <div
                      key={item.service}
                      className="flex items-center justify-between border border-border bg-background p-3 transition-colors hover:border-foreground"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="grid size-7 shrink-0 place-items-center border border-foreground bg-muted font-heading text-xs font-bold text-foreground">
                          {toBnDigits(idx + 1)}
                        </span>
                        <span className="truncate font-heading text-xs font-bold text-foreground">
                          {item.service}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {item.totalAmount && item.totalAmount > 0 && (
                          <span className="inline-flex items-center gap-1 border border-border bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            <Banknote className="size-3" />
                            {formatBnCurrency(item.totalAmount)}
                          </span>
                        )}
                        <span className="rounded-none border border-foreground bg-muted px-2 py-0.5 text-[10px] font-bold text-foreground">
                          {formatBnNumber(item.count)}টি ({toBnDigits(percentage)}%)
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <p className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
            * কোন ধরনের সেবা নিতে গিয়ে সবচেয়ে বেশি অনিয়মের শিকার হয়েছেন নাগরিকরা।
          </p>
        </div>
      </div>
    </div>
  );
}
