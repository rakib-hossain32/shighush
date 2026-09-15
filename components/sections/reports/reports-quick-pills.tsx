"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ReportFilterInput } from "@/lib/domain/schemas";

type Props = {
  filters: ReportFilterInput;
};

const PRESETS = [
  {
    label: "সব নথি",
    href: "/reports",
    isActive: (f: ReportFilterInput) =>
      f.category.length === 0 &&
      f.verificationLevel.length === 0 &&
      f.area.length === 0 &&
      !f.institution &&
      !f.search,
  },
  {
    label: "প্রমাণ সংযুক্ত",
    href: "/reports?verificationLevel=evidence_attached",
    isActive: (f: ReportFilterInput) =>
      f.verificationLevel.includes("evidence_attached"),
  },
  {
    label: "ঘুষ ও অতিরিক্ত অর্থ",
    href: "/reports?category=bribery",
    isActive: (f: ReportFilterInput) => f.category.includes("bribery"),
  },
  {
    label: "সেবা-বঞ্চনা",
    href: "/reports?category=service_denial",
    isActive: (f: ReportFilterInput) => f.category.includes("service_denial"),
  },
  {
    label: "পৌরসভা এলাকা",
    href: "/reports?area=shibchar-municipality",
    isActive: (f: ReportFilterInput) =>
      f.area.includes("shibchar-municipality"),
  },
];

export function ReportsQuickPills({ filters }: Props) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
      <span className="shrink-0 flex items-center gap-1 font-bold text-muted-foreground mr-1 text-[11px] sm:text-xs">
        <Sparkles className="size-3.5 text-primary" />
        <span>দ্রুত দেখুন:</span>
      </span>

      {PRESETS.map((preset) => {
        const active = preset.isActive(filters);
        return (
          <Link
            key={preset.label}
            href={preset.href}
            className={cn(
              "shrink-0 border-2 px-3 py-1 font-bold transition-all text-xs",
              active
                ? "border-foreground bg-primary text-foreground shadow-[2px_2px_0_var(--foreground)]"
                : "border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground hover:shadow-[2px_2px_0_var(--foreground)]"
            )}
          >
            {preset.label}
          </Link>
        );
      })}
    </div>
  );
}
