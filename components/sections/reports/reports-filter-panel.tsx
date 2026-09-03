import Link from "next/link";
import { Filter, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  REPORT_CATEGORIES,
  REPORT_CATEGORY_META,
  VERIFICATION_LEVELS,
  VERIFICATION_LEVEL_META,
} from "@/lib/domain/enums";
import { AREAS } from "@/lib/domain/geo";
import type { ReportFilterInput } from "@/lib/domain/schemas";

/**
 * Checkbox groups whose `name` attributes are the keys of `reportFilterSchema`.
 * Multiple checked boxes submit as repeated params (`?category=bribery&category=fraud`),
 * which the schema's `multi()` helper already accepts.
 *
 * Renders fields only; the `<form method="GET">` is in the page.
 */
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
      selected: filters.category as string[],
      options: REPORT_CATEGORIES.map((value) => ({
        value,
        label: REPORT_CATEGORY_META[value].label,
      })),
    },
    {
      legend: "যাচাইয়ের স্তর",
      name: "verificationLevel",
      selected: filters.verificationLevel as string[],
      options: VERIFICATION_LEVELS.map((value) => ({
        value,
        label: VERIFICATION_LEVEL_META[value].label,
      })),
    },
    {
      legend: "এলাকা",
      name: "area",
      selected: filters.area as string[],
      // 19 areas is a long list in a sidebar; the ones with reports come first via AREAS
      // order (municipality first), and the group scrolls rather than pushing the page.
      options: AREAS.map((area) => ({ value: area.slug, label: area.nameBn })),
      scroll: true,
    },
  ];

  const hasActiveFilter =
    filters.category.length > 0 ||
    filters.verificationLevel.length > 0 ||
    filters.area.length > 0 ||
    Boolean(filters.search);

  return (
    <aside
      className={`h-fit border border-border bg-card p-5 ${className ?? ""}`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border pb-4">
        <span className="flex items-center gap-2 font-bold">
          <Filter className="size-4 text-primary" />
          ফিল্টার
        </span>
        {hasActiveFilter && (
          <Link
            className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground underline"
            href="/reports"
          >
            <RotateCcw className="size-3.5" />
            রিসেট
          </Link>
        )}
      </div>

      <div className="divide-y divide-border">
        {groups.map((group) => (
          <fieldset className="py-5" key={group.name}>
            <legend className="text-sm font-bold">{group.legend}</legend>
            <div
              className={`mt-3 grid gap-2.5 ${
                group.scroll ? "max-h-56 overflow-y-auto pr-1" : ""
              }`}
            >
              {group.options.map((option) => (
                <label
                  className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground"
                  key={option.value}
                >
                  <input
                    className="size-4 accent-primary"
                    defaultChecked={group.selected.includes(option.value)}
                    name={group.name}
                    type="checkbox"
                    value={option.value}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <Button className="mt-2 w-full" type="submit" variant="outline">
        ফিল্টার প্রয়োগ করুন
      </Button>
    </aside>
  );
}
