"use client";

import Link from "next/link";
import { FilterX, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  REPORT_CATEGORY_META,
  VERIFICATION_LEVEL_META,
} from "@/lib/domain/enums";
import { areaName } from "@/lib/domain/geo";
import type { ReportFilterInput } from "@/lib/domain/schemas";

type Props = {
  filters: ReportFilterInput;
};

function removeFilterUrl(
  filters: ReportFilterInput,
  removeKey: string,
  removeValue?: string
): string {
  const params = new URLSearchParams();

  if (filters.search && removeKey !== "search") {
    params.set("search", filters.search);
  }
  if (filters.institution && removeKey !== "institution") {
    params.set("institution", filters.institution);
  }
  if (filters.sort && filters.sort !== "newest") {
    params.set("sort", filters.sort);
  }

  filters.category.forEach((c) => {
    if (removeKey === "category" && c === removeValue) return;
    params.append("category", c);
  });

  filters.verificationLevel.forEach((v) => {
    if (removeKey === "verificationLevel" && v === removeValue) return;
    params.append("verificationLevel", v);
  });

  filters.area.forEach((a) => {
    if (removeKey === "area" && a === removeValue) return;
    params.append("area", a);
  });

  const query = params.toString();
  return query ? `/reports?${query}` : "/reports";
}

export function ReportsActiveChips({ filters }: Props) {
  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.institution) ||
    filters.category.length > 0 ||
    filters.verificationLevel.length > 0 ||
    filters.area.length > 0;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 pt-1">
      <span className="text-[11px] font-bold text-muted-foreground mr-1">
        সক্রিয় ফিল্টার:
      </span>

      {/* Search chip */}
      {filters.search && (
        <Link
          href={removeFilterUrl(filters, "search")}
          className="inline-flex items-center gap-1 border border-foreground bg-primary/15 px-2 py-0.5 text-xs font-bold text-foreground transition-colors hover:bg-destructive/20 hover:text-destructive"
          title="অনুসন্ধান ফিল্টার মুছুন"
        >
          <span>অনুসন্ধান: &ldquo;{filters.search}&rdquo;</span>
          <X className="size-3" />
        </Link>
      )}

      {/* Institution chip */}
      {filters.institution && (
        <Link
          href={removeFilterUrl(filters, "institution")}
          className="inline-flex items-center gap-1 border border-foreground bg-primary/15 px-2 py-0.5 text-xs font-bold text-foreground transition-colors hover:bg-destructive/20 hover:text-destructive"
          title="প্রতিষ্ঠান ফিল্টার মুছুন"
        >
          <span>প্রতিষ্ঠান: &ldquo;{filters.institution}&rdquo;</span>
          <X className="size-3" />
        </Link>
      )}

      {/* Category chips */}
      {filters.category.map((cat) => {
        const meta =
          REPORT_CATEGORY_META[cat as keyof typeof REPORT_CATEGORY_META];
        const label = meta ? meta.label : cat;
        return (
          <Link
            key={`cat-${cat}`}
            href={removeFilterUrl(filters, "category", cat)}
            className="inline-flex items-center gap-1 border border-foreground bg-card px-2 py-0.5 text-xs font-bold text-foreground shadow-[1px_1px_0_var(--foreground)] transition-colors hover:bg-destructive/20 hover:text-destructive"
            title={`${label} ফিল্টার মুছুন`}
          >
            <span>{label}</span>
            <X className="size-3" />
          </Link>
        );
      })}

      {/* Verification Level chips */}
      {filters.verificationLevel.map((lvl) => {
        const meta =
          VERIFICATION_LEVEL_META[lvl as keyof typeof VERIFICATION_LEVEL_META];
        const label = meta ? meta.label : lvl;
        return (
          <Link
            key={`lvl-${lvl}`}
            href={removeFilterUrl(filters, "verificationLevel", lvl)}
            className="inline-flex items-center gap-1 border border-foreground bg-accent/20 px-2 py-0.5 text-xs font-bold text-foreground shadow-[1px_1px_0_var(--foreground)] transition-colors hover:bg-destructive/20 hover:text-destructive"
            title={`${label} ফিল্টার মুছুন`}
          >
            <span>{label}</span>
            <X className="size-3" />
          </Link>
        );
      })}

      {/* Area chips */}
      {filters.area.map((a) => {
        const label = areaName(a);
        return (
          <Link
            key={`area-${a}`}
            href={removeFilterUrl(filters, "area", a)}
            className="inline-flex items-center gap-1 border border-foreground bg-card px-2 py-0.5 text-xs font-bold text-foreground shadow-[1px_1px_0_var(--foreground)] transition-colors hover:bg-destructive/20 hover:text-destructive"
            title={`${label} এলাকা ফিল্টার মুছুন`}
          >
            <span>{label}</span>
            <X className="size-3" />
          </Link>
        );
      })}

      {/* Clear all link */}
      <Link
        href={filters.sort ? `/reports?sort=${filters.sort}` : "/reports"}
        className="inline-flex items-center gap-1 border border-dashed border-border px-2 py-0.5 text-[11px] font-bold text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
      >
        <FilterX className="size-3" />
        <span>সব মুছুন</span>
      </Link>
    </div>
  );
}
