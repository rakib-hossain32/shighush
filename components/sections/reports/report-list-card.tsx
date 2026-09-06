import Link from "next/link";
import { ArrowUpRight, BadgeCheck, CalendarDays, MapPin } from "lucide-react";

import { MetaBadge, StatusBadge } from "@/components/ui/status-badge";
import {
  REPORT_CATEGORY_META,
  REPORT_STATUS_META,
  VERIFICATION_LEVEL_META,
} from "@/lib/domain/enums";
import { areaName } from "@/lib/domain/geo";
import { formatBnDate, formatCaseId } from "@/lib/format";
import type { PublicReport } from "@/services/_shared/types";

export function ReportListCard({ report }: { report: PublicReport }) {
  const verification = VERIFICATION_LEVEL_META[report.verificationLevel];

  return (
    <article className="group relative border-b border-border py-7 last:border-b-0">
      <div className="grid gap-5 md:grid-cols-[88px_1fr_auto]">
        <p className="mono text-xs font-bold text-primary">{formatCaseId(report.publicId)}</p>

        <div>
          <div className="flex flex-wrap gap-2">
            <MetaBadge
              meta={verification}
              icon={report.evidence?.length > 0 ? <BadgeCheck /> : undefined}
            />
            <StatusBadge tone="neutral">
              {REPORT_CATEGORY_META[report.category].label}
            </StatusBadge>
          </div>

          <Link
            className="mt-4 block text-xl font-bold leading-7 transition-colors group-hover:text-primary"
            href={`/reports/${report.slug}`}
          >
            {report.title}
          </Link>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5 text-primary" />
              {report.institution.nameBn} · {areaName(report.location.area)}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="size-3.5 text-primary" />
              {formatBnDate(report.publishedAt)}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <MetaBadge meta={REPORT_STATUS_META[report.status]} />
          <Link
            className="inline-flex items-center gap-1 text-sm font-bold underline"
            href={`/reports/${report.slug}`}
          >
            নথি পড়ুন <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
