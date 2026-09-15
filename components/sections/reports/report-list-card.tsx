import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Calendar,
  Coins,
  FileCheck2,
  FileText,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import {
  REPORT_CATEGORY_META,
  VERIFICATION_LEVEL_META,
} from "@/lib/domain/enums";
import { areaName } from "@/lib/domain/geo";
import { officeNameBn } from "@/lib/domain/office-name";
import {
  formatBnCurrency,
  formatBnNumber,
  formatBnPublishedAge,
  formatCaseId,
} from "@/lib/format";
import type { PublicReport } from "@/services/_shared/types";
import { cn } from "@/lib/utils";

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
  const evidenceCount = report.evidence?.length ?? 0;
  const moneyAmount = report.money?.amount;
  const institutionName =
    report.institution?.nameBn ||
    report.institutionName ||
    "প্রতিষ্ঠানের নাম জানা নেই";
  const institutionUnknown =
    report.institutionNameUnknown ||
    institutionName === "অজানা প্রতিষ্ঠান" ||
    institutionName === "প্রতিষ্ঠানের নাম জানা নেই";
  const areaLabel =
    report.location?.area && report.location.area !== "unknown"
      ? areaName(report.location.area)
      : "এলাকা উল্লেখ নেই";
  const displayTitle = report.title || "শিরোনাম উল্লেখ করা হয়নি";
  const officeName = officeNameBn(report.location?.officeName);
  const targetHref = `/reports/${report.slug || report.publicId || report.id}`;

  return (
    <article className="group relative border-2 border-foreground bg-card rounded-none shadow-[3px_3px_0_var(--foreground)] hover:shadow-[5px_5px_0_var(--foreground)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top Banner: Dossier Stamp & Verification Seal */}
      <div className="border-b-2 border-foreground bg-muted/40 p-3 sm:px-4 sm:py-2.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left Stamps */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Official Tracking ID */}
          <span className="inline-flex items-center gap-1 border-2 border-foreground bg-background px-2 py-0.5 text-[11px] font-black tracking-wider text-foreground  shadow-[1px_1px_0_var(--foreground)]">
            <FileText className="size-3 text-primary" />
            <span>{formatCaseId(report.publicId)}</span>
          </span>

          {/* Category Tag */}
          <span className="inline-flex items-center gap-1 border border-foreground bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-foreground">
            <span className="size-1.5 rounded-none bg-primary inline-block" />
            <span>{category.label}</span>
          </span>
        </div>

        {/* Right Verification Status & Timestamp */}
        <div className="flex items-center gap-2">
          {/* Verification Badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1 border px-2 py-0.5 text-[10px] font-bold",
              report.verificationLevel === "official_record"
                ? "border-foreground bg-accent text-accent-foreground shadow-[1px_1px_0_var(--foreground)]"
                : report.verificationLevel === "corroborated" ||
                    report.verificationLevel === "evidence_attached"
                  ? "border-emerald-700 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                  : "border-border bg-muted/60 text-muted-foreground",
            )}
          >
            {hasEvidence ? (
              <BadgeCheck className="size-3 shrink-0" />
            ) : (
              <ShieldCheck className="size-3 shrink-0" />
            )}
            <span>{verification.label}</span>
          </span>

          {/* Published Time */}
          {report.publishedAt && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground ">
              <Calendar className="size-3" />
              <span>{formatBnPublishedAge(report.publishedAt)}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Title */}
          <Link
            href={targetHref}
            className="block group-hover:text-primary transition-colors"
          >
            <h3 className="font-heading text-base sm:text-lg font-black text-foreground group-hover:text-primary leading-snug transition-colors">
              {displayTitle}
            </h3>
          </Link>

          {/* Forensic Summary */}
          {report.summary ? (
            <div className="border-l-2 border-foreground/30 bg-muted/20 pl-3 py-1 text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {report.summary}
            </div>
          ) : null}
        </div>

        {/* 2x2 Bento Intelligence Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-border">
          {/* Institution */}
          <div className="border border-border bg-background p-2 flex items-start gap-2 min-w-0">
            <Building2 className="size-3.5 text-primary shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] text-muted-foreground font-medium">
                প্রতিষ্ঠান ও দপ্তর
              </span>
              <span className="block text-xs font-bold text-foreground truncate">
                {institutionUnknown
                  ? "প্রতিষ্ঠানের নাম জানা নেই"
                  : institutionName}
              </span>
              {officeName && (
                <span className="block text-[10px] text-muted-foreground truncate">
                  শাখা: {officeName}
                </span>
              )}
            </div>
          </div>

          {/* Area */}
          <div className="border border-border bg-background p-2 flex items-start gap-2 min-w-0">
            <MapPin className="size-3.5 text-primary shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] text-muted-foreground font-medium">
                ঘটনার এলাকা
              </span>
              <span className="block text-xs font-bold text-foreground truncate">
                {areaLabel}
              </span>
            </div>
          </div>

          {/* Money / Amount (if involved) */}
          {moneyAmount !== undefined && moneyAmount !== null ? (
            <div className="border border-destructive/40 bg-destructive/5 p-2 flex items-start gap-2 min-w-0 sm:col-span-2">
              <Coins className="size-3.5 text-destructive shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] text-destructive/80 font-medium">
                    {report.money?.type === "paid"
                      ? "পরিশোধিত অর্থের পরিমাণ"
                      : "দাবিকৃত অর্থের পরিমাণ"}
                  </span>
                  <span className="block text-xs font-extrabold text-destructive ">
                    {formatBnCurrency(moneyAmount)}
                  </span>
                </div>
                {hasEvidence && (
                  <span className="inline-flex items-center gap-1 border border-emerald-600/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                    <FileCheck2 className="size-3" />
                    <span>{formatBnNumber(evidenceCount)}টি প্রমাণপত্র</span>
                  </span>
                )}
              </div>
            </div>
          ) : hasEvidence ? (
            <div className="border border-emerald-600/30 bg-emerald-500/5 p-2 flex items-center gap-2 min-w-0 sm:col-span-2">
              <FileCheck2 className="size-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                এই নথির সাথে {formatBnNumber(evidenceCount)}টি প্রমাণপত্র
                সংযুক্ত রয়েছে
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Footer Action Strip */}
      <div className="border-t-2 border-foreground bg-background p-3 flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
          <span className="size-1.5 bg-primary inline-block" />
          <span>নাগরিক সংরক্ষিত রেকর্ড</span>
        </span>

        <Link
          href={targetHref}
          className="inline-flex items-center gap-1.5 border-2 border-foreground bg-primary px-3 py-1.5 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer"
        >
          <span>নথি বিস্তারিত দেখুন</span>
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}
