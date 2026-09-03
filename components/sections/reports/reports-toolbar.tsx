import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { REPORT_SORTS, REPORT_SORT_META } from "@/lib/domain/enums";
import { formatBnNumber } from "@/lib/format";

/**
 * Search + sort controls. Renders form fields only — the enclosing `<form method="GET">`
 * lives in the page so that these controls and the filter panel submit together and
 * neither wipes the other's selection.
 */
export function ReportsToolbar({
  count,
  search,
  sort,
}: {
  count: number;
  search?: string;
  sort: string;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 border-b-2 border-foreground pb-5 sm:flex-row sm:items-center">
      <label className="flex min-w-0 items-center gap-3 border border-foreground bg-card px-3 py-3 sm:w-90">
        <Search className="size-4 shrink-0 text-primary" />
        <span className="sr-only">প্রতিষ্ঠান, এলাকা বা নথি নম্বর</span>
        <input
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          defaultValue={search ?? ""}
          name="search"
          placeholder="প্রতিষ্ঠান, এলাকা বা নথি নম্বর খুঁজুন"
          type="search"
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">{formatBnNumber(count)}</strong>টি প্রকাশিত নথি
        </p>

        <label className="inline-flex items-center gap-2 text-sm font-bold">
          <span className="text-muted-foreground">সাজান</span>
          <select
            className="border border-border bg-card px-2 py-1.5 text-sm font-bold outline-none"
            defaultValue={sort}
            name="sort"
          >
            {REPORT_SORTS.map((value) => (
              <option key={value} value={value}>
                {REPORT_SORT_META[value].label}
              </option>
            ))}
          </select>
        </label>

        <Button className="h-9 px-4" size="sm" type="submit" variant="outline">
          প্রয়োগ করুন
        </Button>
      </div>
    </div>
  );
}
