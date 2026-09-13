import Link from "next/link";
import { Check, Filter, RotateCcw, SlidersHorizontal } from "lucide-react";

import {
  REPORT_CATEGORIES,
  REPORT_CATEGORY_META,
  VERIFICATION_LEVELS,
  VERIFICATION_LEVEL_META,
} from "@/lib/domain/enums";
import { AREAS } from "@/lib/domain/geo";
import type { ReportFilterInput } from "@/lib/domain/schemas";
import { cn } from "@/lib/utils";

export function ReportsFilterPanel({
  filters,
  className,
}: {
  filters: ReportFilterInput;
  className?: string;
}) {
  const groups = [
    {
      legend: "অভিযোগের ধরন",
      name: "category",
      selected: (filters.category || []) as string[],
      options: REPORT_CATEGORIES.map((value) => ({
        value,
        label: REPORT_CATEGORY_META[value].label,
      })),
    },
    {
      legend: "যাচাইয়ের স্তর",
      name: "verificationLevel",
      selected: (filters.verificationLevel || []) as string[],
      options: VERIFICATION_LEVELS.map((value) => ({
        value,
        label: VERIFICATION_LEVEL_META[value].label,
      })),
    },
    {
      legend: "ইউনিয়ন / এলাকা",
      name: "area",
      selected: (filters.area || []) as string[],
      options: AREAS.map((area) => ({ value: area.slug, label: area.nameBn })),
      scroll: true,
    },
  ];

  const activeCount =
    (filters.category?.length || 0) +
    (filters.verificationLevel?.length || 0) +
    (filters.area?.length || 0) +
    (filters.search ? 1 : 0);

  return (
    <div className={cn("h-fit border-2 border-border bg-card p-4 sm:p-5 shadow-[3px_3px_0_var(--foreground)]", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-border pb-3.5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-primary" />
          <span className="text-sm font-bold text-foreground font-heading">
            ফিল্টার
          </span>
          {activeCount > 0 && (
            <span className="border border-primary/40 bg-primary/10 px-1.5 py-0.25  text-[10px] font-bold text-primary">
              {activeCount}
            </span>
          )}
        </div>

        {activeCount > 0 && (
          <Link
            className="inline-flex items-center gap-1 text-xs  font-bold text-muted-foreground hover:text-primary transition-colors"
            href="/reports"
          >
            <RotateCcw className="size-3" />
            <span>রিসেট</span>
          </Link>
        )}
      </div>

      <div className="divide-y-2 divide-border">
        {groups.map((group) => (
          <fieldset className="py-4 first:pt-3.5 last:pb-2" key={group.name}>
            <legend className="text-xs font-bold uppercase tracking-wider text-primary ">
              {group.legend}
            </legend>
            <div
              className={cn(
                "mt-2.5 grid gap-1.5",
                group.scroll && "max-h-52 overflow-y-auto pr-1 scrollbar-thin"
              )}
            >
              {group.options.map((option) => {
                const isChecked = group.selected.includes(option.value);
                return (
                  <label
                    key={option.value}
                    className={cn(
                      "flex cursor-pointer items-center justify-between px-2.5 py-1.5 text-xs font-medium transition-all select-none border",
                      isChecked
                        ? "bg-primary/10 text-primary font-bold border-primary/40"
                        : "border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground hover:border-border"
                    )}
                  >
                    <span className="truncate pr-2">{option.label}</span>
                    <input
                      className="sr-only"
                      defaultChecked={isChecked}
                      name={group.name}
                      type="checkbox"
                      value={option.value}
                    />
                    <span
                      className={cn(
                        "grid size-4 shrink-0 place-items-center border-2 transition-colors",
                        isChecked
                          ? "border-primary bg-primary text-foreground"
                          : "border-border bg-background"
                      )}
                    >
                      {isChecked && <Check className="size-3 stroke-[3]" />}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}

        <div className="pt-4">
          <button
            className="w-full border-2 border-foreground bg-primary py-2.5 text-xs font-bold text-foreground shadow-[3px_3px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
            type="submit"
          >
            ফিল্টার প্রয়োগ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
