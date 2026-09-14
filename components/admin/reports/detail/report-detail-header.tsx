"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { MetaBadge, StatusBadge } from "@/components/ui/status-badge";
import {
  REPORT_CATEGORY_META,
  REPORT_STATUS_META,
  VERIFICATION_LEVEL_META,
} from "@/lib/domain/enums";
import { areaName } from "@/lib/domain/geo";
import { formatCaseId } from "@/lib/format";
import type { ModerationReport } from "@/services/_shared/types";

type ReportDetailHeaderProps = {
  report: ModerationReport;
  isPublished: boolean;
};

export function ReportDetailHeader({ report, isPublished }: ReportDetailHeaderProps) {
  const [copied, setCopied] = useState(false);
  const caseIdFormatted = formatCaseId(report.publicId);

  const handleCopy = () => {
    navigator.clipboard.writeText(caseIdFormatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-2 border-foreground bg-card p-5 shadow-[4px_4px_0_var(--foreground)] sm:p-6">
      {/* Top Bar: Navigation & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <Button
          asChild
          className="h-8 gap-1.5 rounded-none border-2 border-border bg-background px-3 text-xs font-bold text-foreground hover:border-foreground hover:bg-muted"
          variant="outline"
        >
          <Link href="/admin/reports">
            <ArrowLeft className="size-3.5" />
            কিউতে ফিরুন
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          {/* Copy Case ID */}
          <Button
            className="h-8 gap-1.5 rounded-none border-2 border-border bg-background px-2.5 text-xs font-mono font-bold text-foreground hover:border-foreground"
            onClick={handleCopy}
            type="button"
            variant="outline"
          >
            {copied ? (
              <>
                <Check className="size-3 text-primary" />
                <span>কপি হয়েছে</span>
              </>
            ) : (
              <>
                <Copy className="size-3 text-muted-foreground" />
                <span>{caseIdFormatted}</span>
              </>
            )}
          </Button>

          {/* Public Page Link if published */}
          {isPublished && (
            <Button
              asChild
              className="h-8 gap-1.5 rounded-none border-2 border-foreground bg-primary px-3 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            >
              <Link href={`/reports/${report.slug}`} rel="noreferrer" target="_blank">
                <span>পাবলিক পেজ</span>
                <ExternalLink className="size-3" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div className="mt-5 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[.15em] text-primary">
            CASE DOSSIER · {caseIdFormatted}
          </span>
          {report.assignedTo ? (
            <span className="inline-flex items-center gap-1 rounded-none border border-foreground/20 bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
              <UserCheck className="size-3 text-primary" />
              <span>দায়িত্বপ্রাপ্ত: <strong>{report.assignedTo.name}</strong></span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-none border border-dashed border-destructive/60 bg-destructive/5 px-2 py-0.5 text-xs font-bold text-destructive">
              <span>দায়িত্বহীন কিউ</span>
            </span>
          )}
        </div>

        <h1 className="font-heading text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          {report.title || `নথি ${caseIdFormatted}`}
        </h1>

        <p className="text-xs font-medium text-muted-foreground sm:text-sm">
          {report.institution?.nameBn || "প্রতিষ্ঠান অজ্ঞাত"}
          {" · "}
          {areaName(report.location?.area)}
          {report.location?.officeName && ` (${report.location.officeName})`}
        </p>
      </div>

      {/* Badges Bar */}
      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <MetaBadge meta={REPORT_STATUS_META[report.status]} />
        <MetaBadge meta={REPORT_CATEGORY_META[report.category]} />
        <MetaBadge meta={VERIFICATION_LEVEL_META[report.verificationLevel]} />
        <StatusBadge icon={<ShieldCheck className="size-3.5" />} tone="neutral">
          মডারেশন কিউ
        </StatusBadge>
      </div>
    </div>
  );
}
