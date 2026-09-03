import Link from "next/link";
import { ArrowUpRight, Building2, Clock3, MapPin } from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";
import { INSTITUTION_CATEGORY_META } from "@/lib/domain/enums";
import { areaName, DISTRICT_BN } from "@/lib/domain/geo";
import { formatBnNumber, formatBnPercent, formatBnRelative } from "@/lib/format";
import type { Institution } from "@/services/_shared/types";

export function InstitutionCard({ institution }: { institution: Institution }) {
  const metrics = institution.metrics;

  return (
    <article className="group flex min-h-65 flex-col border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-foreground hover:shadow-[5px_5px_0_var(--foreground)]">
      <div className="flex items-start justify-between gap-3">
        <StatusBadge tone="muted">
          {INSTITUTION_CATEGORY_META[institution.category].label}
        </StatusBadge>
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
          <Building2 className="size-4" />
        </span>
      </div>

      <h2 className="mt-8 text-xl font-bold leading-7 group-hover:text-primary">
        {institution.nameBn}
      </h2>

      <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="size-4 text-primary" />
        {areaName(institution.location.area)}, {DISTRICT_BN}
      </p>

      <div className="mt-auto grid grid-cols-2 border-t border-border pt-5">
        <div>
          <p className="display text-2xl font-bold">
            {formatBnNumber(metrics?.totalReports ?? 0)}
          </p>
          <p className="text-xs text-muted-foreground">প্রকাশিত রিপোর্ট</p>
        </div>
        <div className="border-l border-border pl-4">
          <p className="display text-2xl font-bold">
            {formatBnPercent(metrics?.evidenceRate ?? 0)}
          </p>
          <p className="text-xs text-muted-foreground">প্রমাণ সংযুক্ত</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock3 className="size-3.5" />
          {metrics?.lastUpdatedAt ? (
            <>{formatBnRelative(metrics.lastUpdatedAt)} আপডেট</>
          ) : (
            <>এখনো রিপোর্ট নেই</>
          )}
        </span>
        <Link
          className="inline-flex items-center gap-1 text-sm font-bold underline"
          href={`/institutions/${institution.slug}`}
        >
          প্রোফাইল <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}
