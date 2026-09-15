"use client";

import { ArrowUpDown, FileText, Search, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REPORT_SORTS, REPORT_SORT_META } from "@/lib/domain/enums";
import type { ReportFilterInput } from "@/lib/domain/schemas";
import { formatBnNumber } from "@/lib/format";
import { ReportsMobileSheet } from "@/components/sections/reports/reports-mobile-sheet";

type Props = {
  count: number;
  filters: ReportFilterInput;
};

export function ReportsToolbar({ count, filters }: Props) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(filters.search ?? "");

  const currentSort = (filters.sort as keyof typeof REPORT_SORT_META) || "newest";
  const currentSortLabel = REPORT_SORT_META[currentSort]?.label || "নতুন আগে";

  const handleSortChange = (newSort: string | null) => {
    if (!newSort) return;
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.institution) params.set("institution", filters.institution);
    if (newSort !== "newest") params.set("sort", newSort);

    filters.category.forEach((c) => params.append("category", c));
    filters.verificationLevel.forEach((v) => params.append("verificationLevel", v));
    filters.area.forEach((a) => params.append("area", a));

    const qs = params.toString();
    router.push(qs ? `/reports?${qs}` : "/reports");
  };

  const handleClearSearch = () => {
    setSearchValue("");
    const params = new URLSearchParams();
    if (filters.institution) params.set("institution", filters.institution);
    if (filters.sort && filters.sort !== "newest") params.set("sort", filters.sort);

    filters.category.forEach((c) => params.append("category", c));
    filters.verificationLevel.forEach((v) => params.append("verificationLevel", v));
    filters.area.forEach((a) => params.append("area", a));

    const qs = params.toString();
    router.push(qs ? `/reports?${qs}` : "/reports");
  };

  return (
    <div className="space-y-2.5">
      <div className="border-2 border-foreground bg-card p-3 sm:p-4 shadow-[3px_3px_0_var(--foreground)] rounded-none space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
        {/* Search Input using shadcn Input with rounded-none */}
        <form
          action="/reports"
          method="GET"
          className="relative flex-1 min-w-0"
        >
          {/* Preserve active filters */}
          {filters.institution && (
            <input type="hidden" name="institution" value={filters.institution} />
          )}
          {filters.sort && (
            <input type="hidden" name="sort" value={filters.sort} />
          )}
          {filters.category.map((c) => (
            <input key={`c-${c}`} type="hidden" name="category" value={c} />
          ))}
          {filters.verificationLevel.map((v) => (
            <input key={`v-${v}`} type="hidden" name="verificationLevel" value={v} />
          ))}
          {filters.area.map((a) => (
            <input key={`a-${a}`} type="hidden" name="area" value={a} />
          ))}

          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3 size-4 text-foreground shrink-0" />
            <Input
              name="search"
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="শিরোনাম, প্রতিষ্ঠান বা নথি নম্বর দিয়ে খুঁজুন..."
              className="h-10 w-full rounded-none border-2 border-foreground bg-background pl-9 pr-8 text-xs sm:text-sm font-medium text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-foreground"
            />
            {searchValue && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 grid size-5 place-items-center rounded-none bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                title="অনুসন্ধান মুছুন"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        </form>

        {/* Action Controls: Mobile Sheet + shadcn Select for Sort */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile & Tablet Filter Drawer Trigger */}
          <div className="lg:hidden flex-1 sm:flex-initial">
            <ReportsMobileSheet filters={filters} />
          </div>

          {/* shadcn Select for Sort with sharp corners & Bangla text */}
          <div className="flex-1 sm:flex-initial sm:w-44">
            <Select
              value={currentSort}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="h-10 w-full rounded-none border-2 border-foreground bg-background px-3 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] hover:bg-muted focus:ring-0 focus-visible:ring-0 cursor-pointer">
                <div className="flex items-center gap-1.5 truncate">
                  <ArrowUpDown className="size-3.5 text-primary shrink-0" />
                  <span>{currentSortLabel}</span>
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-none border-2 border-foreground bg-card text-foreground shadow-[4px_4px_0_var(--foreground)]">
                {REPORT_SORTS.map((val) => (
                  <SelectItem
                    key={val}
                    value={val}
                    className="rounded-none text-xs font-bold py-2 cursor-pointer hover:bg-primary/15"
                  >
                    {REPORT_SORT_META[val].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Record Counter */}
      <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <FileText className="size-3.5 text-primary" />
          <span>
            মোট <strong className="text-foreground">{formatBnNumber(count)}</strong>টি নাগরিক নথি পাওয়া গেছে
          </span>
        </div>
      </div>
    </div>
  );
}
