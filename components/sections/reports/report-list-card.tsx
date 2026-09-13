import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Calendar,
  Coins,
  FileCheck2,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { MetaBadge } from "@/components/ui/status-badge";
import {
  REPORT_CATEGORY_META,
  VERIFICATION_LEVEL_META,
} from "@/lib/domain/enums";
import { areaName } from "@/lib/domain/geo";
import { formatBnDate, formatBnNumber, formatCaseId } from "@/lib/format";
import type { PublicReport } from "@/services/_shared/types";

export function ReportListCard({ report }: { report: PublicReport }) {
  const verification = VERIFICATION_LEVEL_META[report.verificationLevel] || {
    label: report.verificationLevel,
    short: report.verificationLevel,
    tone: "muted" as const,
  };

  const category = REPORT_CATEGORY_META[report.category] || {
    label: report.category,
    short: report.category,
    tone: "neutral" as const,
  };

  const hasEvidence = Boolean(report.evidence && report.evidence.length > 0);
  const moneyAmount = report.money?.amount;
  const institutionName = report.institution?.nameBn || "শিবচর প্রশাসনিক দপ্তর";
  const displayTitle = report.title || `${institutionName}-এ অনিয়মের অভিযোগ`;
  const targetHref = `/reports/${report.slug || report.publicId || report.id}`;

  return (
    <article className="group relative mb-4 border-2 border-border bg-card p-5 transition-all duration-200 hover:border-foreground hover:shadow-[4px_4px_0_var(--foreground)] hover:-translate-y-0.5">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border/60 pb-3">
        {/* Left: Case ID & Category */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center border-2 border-primary/40 bg-primary/10 px-2.5 py-0.5 font-mono text-xs font-bold tracking-wider text-primary">
            {formatCaseId(report.publicId)}
          </span>

          <span className="border border-border bg-background px-2.5 py-0.5 text-xs font-bold text-foreground/80">
            {category.label}
          </span>

          {hasEvidence && (
            <span className="inline-flex items-center gap-1 border border-emerald-600/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
              <FileCheck2 className="size-3" />
              <span>প্রমাণপত্র যুক্ত</span>
            </span>
          )}
        </div>

        {/* Right: Verification Level & Date */}
        <div className="flex items-center gap-2.5">
          <MetaBadge
            meta={verification}
            icon={hasEvidence ? <BadgeCheck className="size-3.5" /> : undefined}
          />

          {report.publishedAt && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
              <Calendar className="size-3" />
              <span>{formatBnDate(report.publishedAt)}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="pt-3.5 pb-2">
        <Link
          className="block group-hover:text-primary transition-colors focus:outline-none"
          href={targetHref}
        >
          <h3 className="font-heading text-base font-bold text-foreground transition-colors group-hover:text-primary sm:text-lg leading-snug">
            {displayTitle}
          </h3>
        </Link>

        {report.summary ? (
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {report.summary}
          </p>
        ) : null}
      </div>

      {/* Bottom Metadata & Action Footer */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3">
        {/* Info Tags */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 font-medium text-foreground/90">
            <Building2 className="size-3.5 text-primary shrink-0" />
            <span>{institutionName}</span>
          </span>

          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5 text-muted-foreground shrink-0" />
            <span>{areaName(report.location?.area)}</span>
          </span>

          {moneyAmount ? (
            <span className="inline-flex items-center gap-1 font-semibold text-destructive">
              <Coins className="size-3.5 shrink-0" />
              <span>দাবিকৃত অর্থ: ৳{formatBnNumber(moneyAmount)}</span>
            </span>
          ) : null}
        </div>

        {/* Read Action Button */}
        <Link
          className="inline-flex items-center gap-1.5 border-2 border-foreground bg-background px-3.5 py-1.5 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none hover:bg-primary hover:text-primary-foreground cursor-pointer"
          href={targetHref}
        >
          <span>নথি বিস্তারিত</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}
