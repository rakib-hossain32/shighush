import Link from "next/link";
import { ArrowUpRight, Building2, Clock3, MapPin } from "lucide-react";

import { INSTITUTION_CATEGORY_META } from "@/lib/domain/enums";
import { areaName, DISTRICT_BN } from "@/lib/domain/geo";
import { formatBnNumber, formatBnPercent, formatBnRelative } from "@/lib/format";
import type { Institution } from "@/services/_shared/types";

export function InstitutionCard({ institution }: { institution: Institution }) {
  const metrics = institution.metrics;
  const categoryMeta = INSTITUTION_CATEGORY_META[institution.category];
  const evidenceRate = metrics?.evidenceRate ?? 0;
  const evidencePct = Math.round(evidenceRate * 100);

  return (
    <article className="group flex min-h-64 flex-col justify-between border-2 border-border bg-card p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-foreground hover:shadow-[3px_3px_0_var(--foreground)]">
      <div>
        {/* Top bar: Category Badge & Icon */}
        <div className="flex items-start justify-between gap-3">
          <span className="border border-border bg-background px-2 py-0.5  text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {categoryMeta.label}
          </span>
          <span className="grid size-8 shrink-0 place-items-center border-2 border-border bg-background text-primary transition-colors group-hover:border-primary group-hover:bg-primary/10">
            <Building2 className="size-4" />
          </span>
        </div>

        {/* Title */}
        <h2 className="mt-3.5 text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors font-heading">
          {institution.nameBn}
        </h2>

        {/* Location */}
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3.5 text-primary" />
          <span>{areaName(institution.location.area)}, {DISTRICT_BN}</span>
        </p>

        {/* Evidence Rate Bar */}
        {metrics && (
          <div className="mt-4 mb-3 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground ">
              <span>প্রমাণ সংযুক্তির হার</span>
              <span className="font-bold text-foreground">{formatBnPercent(evidenceRate)}</span>
            </div>
            <div className="h-1.5 w-full bg-muted border border-border/80 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${evidencePct}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 border-t-2 border-border pt-3.5 mt-4">
          <div>
            <p className="text-2xl font-extrabold text-foreground ">
              {formatBnNumber(metrics?.totalReports ?? 0)}
            </p>
            <p className="text-[11px] font-medium text-muted-foreground">মোট রিপোর্ট</p>
          </div>
          <div className="border-l-2 border-border pl-4">
            <p className="text-2xl font-extrabold text-foreground ">
              {formatBnNumber(metrics?.recentReports ?? 0)}
            </p>
            <p className="text-[11px] font-medium text-muted-foreground">সাম্প্রতিক (৯০ দিন)</p>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-5 flex items-center justify-between gap-3 border-t-2 border-border pt-3">
        <span className="inline-flex items-center gap-1.5 text-[11px]  text-muted-foreground">
          <Clock3 className="size-3 text-primary" />
          {metrics?.lastUpdatedAt ? (
            <>{formatBnRelative(metrics.lastUpdatedAt)}</>
          ) : (
            <>এখনো রিপোর্ট নেই</>
          )}
        </span>
        <Link
          className="inline-flex items-center gap-1 border-2 border-foreground bg-background px-3 py-1.5 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none whitespace-nowrap cursor-pointer"
          href={`/institutions/${institution.slug}`}
        >
          <span>প্রোফাইল</span>
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}
