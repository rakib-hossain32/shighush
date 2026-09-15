"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  FilterX,
  MapPin,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Tag,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  REPORT_CATEGORIES,
  REPORT_CATEGORY_META,
  REPORT_SORTS,
  REPORT_SORT_META,
  VERIFICATION_LEVELS,
  VERIFICATION_LEVEL_META,
} from "@/lib/domain/enums";
import { AREAS } from "@/lib/domain/geo";
import type { ReportFilterInput } from "@/lib/domain/schemas";
import { toBnDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ReportsMobileSheet } from "@/components/sections/reports/reports-mobile-sheet";

type Props = {
  filters: ReportFilterInput;
};

export function ReportsFilterBar({ filters }: Props) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(filters.search ?? "");
  const [areaSearch, setAreaSearch] = useState("");

  const currentSort = (filters.sort as keyof typeof REPORT_SORT_META) || "newest";
  const currentSortLabel = REPORT_SORT_META[currentSort]?.label || "নতুন আগে";

  // Navigation helper that updates query string
  const updateQuery = (changes: Partial<Record<string, string | string[] | undefined>>) => {
    const params = new URLSearchParams();

    // Search
    const searchVal = "search" in changes ? (changes.search as string) : filters.search;
    if (searchVal) params.set("search", searchVal);

    // Institution
    const instVal = "institution" in changes ? (changes.institution as string) : filters.institution;
    if (instVal) params.set("institution", instVal);

    // Sort
    const sortVal = "sort" in changes ? (changes.sort as string) : filters.sort;
    if (sortVal && sortVal !== "newest") params.set("sort", sortVal);

    // Categories
    const categories = "category" in changes ? (changes.category as string[]) : filters.category;
    categories?.forEach((c) => params.append("category", c));

    // Verification
    const verifications = "verificationLevel" in changes
      ? (changes.verificationLevel as string[])
      : filters.verificationLevel;
    verifications?.forEach((v) => params.append("verificationLevel", v));

    // Area
    const areas = "area" in changes ? (changes.area as string[]) : filters.area;
    areas?.forEach((a) => params.append("area", a));

    const qs = params.toString();
    router.push(qs ? `/reports?${qs}` : "/reports");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ search: searchValue || undefined });
  };

  const handleClearSearch = () => {
    setSearchValue("");
    updateQuery({ search: undefined });
  };

  const toggleCategory = (cat: string) => {
    const current = filters.category || [];
    const next = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat];
    updateQuery({ category: next });
  };

  const toggleVerification = (lvl: string) => {
    const current = filters.verificationLevel || [];
    const next = current.includes(lvl)
      ? current.filter((v) => v !== lvl)
      : [...current, lvl];
    updateQuery({ verificationLevel: next });
  };

  const toggleArea = (slug: string) => {
    const current = filters.area || [];
    const next = current.includes(slug)
      ? current.filter((a) => a !== slug)
      : [...current, slug];
    updateQuery({ area: next });
  };

  const handleClearAll = () => {
    setSearchValue("");
    router.push(filters.sort && filters.sort !== "newest" ? `/reports?sort=${filters.sort}` : "/reports");
  };

  const activeFiltersCount =
    (filters.category?.length || 0) +
    (filters.verificationLevel?.length || 0) +
    (filters.area?.length || 0) +
    (filters.institution ? 1 : 0) +
    (filters.search ? 1 : 0);

  const filteredAreas = AREAS.filter((a) =>
    a.nameBn.toLowerCase().includes(areaSearch.toLowerCase())
  );

  return (
    <div className="border-2 border-foreground bg-card p-3 sm:p-4 shadow-[4px_4px_0_var(--foreground)] rounded-none space-y-3">
      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
        {/* Search Input Box */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex-1 min-w-0"
        >
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3 size-4 text-foreground shrink-0" />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="শিরোনাম, প্রতিষ্ঠান বা নথি নম্বর দিয়ে তাৎক্ষণিক খুঁজুন..."
              className="h-10 w-full rounded-none border-2 border-foreground bg-background pl-9 pr-9 text-xs sm:text-sm font-medium text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-foreground"
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

        {/* Mobile & Tablet Drawer Trigger (hidden on desktop) */}
        <div className="md:hidden">
          <ReportsMobileSheet filters={filters} />
        </div>

        {/* Desktop Interactive Popover Filters (Visible on md and up) */}
        <div className="hidden md:flex items-center gap-2 flex-wrap">
          {/* 1. Category Popover */}
          <Popover>
            <PopoverTrigger
              type="button"
              className={cn(
                "inline-flex items-center justify-center h-10 rounded-none border-2 border-foreground bg-background px-3 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] hover:bg-muted cursor-pointer gap-1.5 transition-colors",
                filters.category.length > 0 && "bg-primary/20 border-primary"
              )}
            >
              <Tag className="size-3.5 text-primary shrink-0" />
              <span>অভিযোগের ধরন</span>
              {filters.category.length > 0 && (
                <span className="grid size-4.5 place-items-center rounded-none border border-foreground bg-primary text-[10px] font-bold text-foreground px-1">
                  {toBnDigits(filters.category.length)}
                </span>
              )}
              <ChevronDown className="size-3 text-muted-foreground shrink-0" />
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-80 rounded-none border-2 border-foreground bg-card p-3 shadow-[4px_4px_0_var(--foreground)] space-y-2 z-50"
            >
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-bold text-foreground">
                  অভিযোগের ধরন নির্বাচন করুন
                </span>
                {filters.category.length > 0 && (
                  <button
                    type="button"
                    onClick={() => updateQuery({ category: [] })}
                    className="text-[11px] font-bold text-destructive hover:underline cursor-pointer"
                  >
                    মুছুন
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-1 max-h-56 overflow-y-auto pr-1">
                {REPORT_CATEGORIES.map((cat) => {
                  const meta = REPORT_CATEGORY_META[cat];
                  const isChecked = filters.category.includes(cat);

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={cn(
                        "flex items-center justify-between px-2.5 py-1.5 text-xs font-medium border text-left transition-colors cursor-pointer",
                        isChecked
                          ? "border-foreground bg-primary/15 font-bold text-foreground"
                          : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      <span>{meta.label}</span>
                      <span
                        className={cn(
                          "grid size-4 shrink-0 place-items-center border transition-colors",
                          isChecked
                            ? "border-foreground bg-primary text-foreground"
                            : "border-border bg-background"
                        )}
                      >
                        {isChecked && <Check className="size-3 stroke-[3]" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          {/* 2. Verification Popover */}
          <Popover>
            <PopoverTrigger
              type="button"
              className={cn(
                "inline-flex items-center justify-center h-10 rounded-none border-2 border-foreground bg-background px-3 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] hover:bg-muted cursor-pointer gap-1.5 transition-colors",
                filters.verificationLevel.length > 0 && "bg-accent/30 border-accent-foreground"
              )}
            >
              <ShieldCheck className="size-3.5 text-primary shrink-0" />
              <span>যাচাইয়ের স্তর</span>
              {filters.verificationLevel.length > 0 && (
                <span className="grid size-4.5 place-items-center rounded-none border border-foreground bg-accent text-[10px] font-bold text-accent-foreground px-1">
                  {toBnDigits(filters.verificationLevel.length)}
                </span>
              )}
              <ChevronDown className="size-3 text-muted-foreground shrink-0" />
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-72 rounded-none border-2 border-foreground bg-card p-3 shadow-[4px_4px_0_var(--foreground)] space-y-2 z-50"
            >
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-bold text-foreground">
                  যাচাইয়ের স্তর নির্বাচন করুন
                </span>
                {filters.verificationLevel.length > 0 && (
                  <button
                    type="button"
                    onClick={() => updateQuery({ verificationLevel: [] })}
                    className="text-[11px] font-bold text-destructive hover:underline cursor-pointer"
                  >
                    মুছুন
                  </button>
                )}
              </div>
              <div className="space-y-1">
                {VERIFICATION_LEVELS.map((lvl) => {
                  const meta = VERIFICATION_LEVEL_META[lvl];
                  const isChecked = filters.verificationLevel.includes(lvl);

                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => toggleVerification(lvl)}
                      className={cn(
                        "flex w-full items-center justify-between px-2.5 py-1.5 text-xs font-medium border text-left transition-colors cursor-pointer",
                        isChecked
                          ? "border-foreground bg-accent/25 font-bold text-foreground"
                          : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      <span>{meta.label}</span>
                      <span
                        className={cn(
                          "grid size-4 shrink-0 place-items-center border transition-colors",
                          isChecked
                            ? "border-foreground bg-accent text-accent-foreground"
                            : "border-border bg-background"
                        )}
                      >
                        {isChecked && <Check className="size-3 stroke-[3]" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          {/* 3. Area Popover */}
          <Popover>
            <PopoverTrigger
              type="button"
              className={cn(
                "inline-flex items-center justify-center h-10 rounded-none border-2 border-foreground bg-background px-3 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] hover:bg-muted cursor-pointer gap-1.5 transition-colors",
                filters.area.length > 0 && "bg-primary/20 border-primary"
              )}
            >
              <MapPin className="size-3.5 text-primary shrink-0" />
              <span>এলাকা / ইউনিয়ন</span>
              {filters.area.length > 0 && (
                <span className="grid size-4.5 place-items-center rounded-none border border-foreground bg-primary text-[10px] font-bold text-foreground px-1">
                  {toBnDigits(filters.area.length)}
                </span>
              )}
              <ChevronDown className="size-3 text-muted-foreground shrink-0" />
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-80 rounded-none border-2 border-foreground bg-card p-3 shadow-[4px_4px_0_var(--foreground)] space-y-2 z-50"
            >
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-bold text-foreground">
                  শিবচরের এলাকা নির্বাচন করুন
                </span>
                {filters.area.length > 0 && (
                  <button
                    type="button"
                    onClick={() => updateQuery({ area: [] })}
                    className="text-[11px] font-bold text-destructive hover:underline cursor-pointer"
                  >
                    মুছুন
                  </button>
                )}
              </div>
              <Input
                value={areaSearch}
                onChange={(e) => setAreaSearch(e.target.value)}
                placeholder="এলাকা খুঁজুন..."
                className="h-8 rounded-none border-2 border-border bg-background text-xs placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-foreground"
              />
              <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto pr-1">
                {filteredAreas.map((area) => {
                  const isChecked = filters.area.includes(area.slug);

                  return (
                    <button
                      key={area.slug}
                      type="button"
                      onClick={() => toggleArea(area.slug)}
                      className={cn(
                        "flex items-center justify-between px-2 py-1 text-xs font-medium border text-left transition-colors cursor-pointer",
                        isChecked
                          ? "border-foreground bg-primary/15 font-bold text-foreground"
                          : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      <span className="truncate pr-1 text-[11px]">{area.nameBn}</span>
                      <span
                        className={cn(
                          "grid size-3.5 shrink-0 place-items-center border transition-colors",
                          isChecked
                            ? "border-foreground bg-primary text-foreground"
                            : "border-border bg-background"
                        )}
                      >
                        {isChecked && <Check className="size-2.5 stroke-[3]" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          {/* 4. Sort Select */}
          <div className="w-40">
            <Select
              value={currentSort}
              onValueChange={(val) => updateQuery({ sort: val || "newest" })}
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

          {/* Reset button if active */}
          {activeFiltersCount > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleClearAll}
              className="h-10 rounded-none border-2 border-dashed border-destructive text-xs font-bold text-destructive hover:bg-destructive/10 cursor-pointer gap-1"
              title="সব ফিল্টার মুছে ফেলুন"
            >
              <RotateCcw className="size-3.5" />
              <span>রিসেট</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
