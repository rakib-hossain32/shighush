import { ArrowUpDown, FileText, Search } from "lucide-react";

import { REPORT_SORTS, REPORT_SORT_META } from "@/lib/domain/enums";
import { formatBnNumber } from "@/lib/format";

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
    <div className="flex flex-col gap-4 border-2 border-border bg-card p-3.5 sm:p-4 shadow-[3px_3px_0_var(--foreground)] sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input Box */}
      <div className="relative flex-1 min-w-0 max-w-md">
        <label className="relative flex items-center">
          <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
          <span className="sr-only">প্রতিষ্ঠান, এলাকা বা নথি নম্বর</span>
          <input
            className="h-10 w-full border-2 border-border bg-background pl-9 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground transition-colors focus:border-foreground focus:outline-none"
            defaultValue={search ?? ""}
            name="search"
            placeholder="প্রতিষ্ঠান, এলাকা বা নথি নম্বর খুঁজুন..."
            type="search"
          />
        </label>
      </div>

      {/* Counter and Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground ">
          <FileText className="size-3.5 text-primary" />
          <span>মোট <strong className="text-foreground">{formatBnNumber(count)}</strong>টি নথি</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <ArrowUpDown className="pointer-events-none absolute left-2.5 size-3.5 text-muted-foreground" />
            <select
              aria-label="সাজানোর ক্রম"
              className="h-10 cursor-pointer appearance-none border-2 border-border bg-background pl-8 pr-7 text-xs  font-bold text-foreground transition-colors hover:border-foreground focus:outline-none"
              defaultValue={sort}
              name="sort"
            >
              {REPORT_SORTS.map((value) => (
                <option key={value} value={value}>
                  {REPORT_SORT_META[value].label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="h-10 inline-flex items-center justify-center border-2 border-foreground bg-primary px-4 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
          >
            ফিল্টার করুন
          </button>
        </div>
      </div>
    </div>
  );
}
