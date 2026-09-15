"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Check,
  MapPin,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Tag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  REPORT_CATEGORIES,
  REPORT_CATEGORY_META,
  VERIFICATION_LEVELS,
  VERIFICATION_LEVEL_META,
} from "@/lib/domain/enums";
import { AREAS } from "@/lib/domain/geo";
import type { ReportFilterInput } from "@/lib/domain/schemas";
import { toBnDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = {
  filters: ReportFilterInput;
};

export function ReportsMobileSheet({ filters }: Props) {
  const [open, setOpen] = useState(false);
  const [institution, setInstitution] = useState(filters.institution ?? "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    filters.category || []
  );
  const [selectedVerification, setSelectedVerification] = useState<string[]>(
    filters.verificationLevel || []
  );
  const [selectedAreas, setSelectedAreas] = useState<string[]>(
    filters.area || []
  );
  const [areaSearch, setAreaSearch] = useState("");

  const activeCount =
    selectedCategories.length +
    selectedVerification.length +
    selectedAreas.length +
    (institution ? 1 : 0);

  const toggleItem = (
    list: string[],
    item: string,
    setter: (val: string[]) => void
  ) => {
    if (list.includes(item)) {
      setter(list.filter((i) => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handleReset = () => {
    setInstitution("");
    setSelectedCategories([]);
    setSelectedVerification([]);
    setSelectedAreas([]);
    setAreaSearch("");
  };

  const filteredAreas = AREAS.filter((a) =>
    a.nameBn.toLowerCase().includes(areaSearch.toLowerCase())
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        type="button"
        className="inline-flex items-center justify-center h-10 gap-1.5 border-2 border-foreground bg-card px-3 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] hover:bg-muted cursor-pointer transition-colors"
      >
        <SlidersHorizontal className="size-3.5 text-primary" />
        <span>ফিল্টার</span>
        {activeCount > 0 && (
          <span className="grid size-5 place-items-center rounded-none border border-foreground bg-primary text-[10px] font-bold text-foreground">
            {toBnDigits(activeCount)}
          </span>
        )}
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="max-h-[85vh] overflow-hidden border-t-2 border-foreground p-0 bg-background shadow-[0_-8px_30px_rgb(0_0_0_/_20%)] flex flex-col rounded-none"
      >
        {/* Header */}
        <SheetHeader className="border-b-2 border-border bg-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center border border-foreground bg-primary/20 text-primary rounded-none">
                <SlidersHorizontal className="size-3.5" />
              </span>
              <div>
                <SheetTitle className="text-base font-bold text-foreground font-heading">
                  ফিল্টার ও অনুসন্ধান
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  পছন্দমতো ক্যাটাগরি, এলাকা বা যাচাইয়ের স্তর নির্বাচন করুন
                </SheetDescription>
              </div>
            </div>

            {activeCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs font-bold text-destructive hover:underline cursor-pointer"
              >
                <RotateCcw className="size-3" />
                <span>সব মুছুন</span>
              </button>
            )}
          </div>
        </SheetHeader>

        {/* Scrollable Form Body */}
        <form
          action="/reports"
          method="GET"
          id="mobile-filter-form"
          className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6"
        >
          {/* Preserve search and sort */}
          {filters.search && (
            <input type="hidden" name="search" value={filters.search} />
          )}
          {filters.sort && (
            <input type="hidden" name="sort" value={filters.sort} />
          )}

          {/* Institution */}
          <div className="space-y-2">
            <label
              htmlFor="mobile-institution"
              className="flex items-center gap-1.5 text-xs font-bold text-foreground"
            >
              <Building2 className="size-3.5 text-primary" />
              <span>প্রতিষ্ঠান বা অফিস</span>
            </label>
            <Input
              id="mobile-institution"
              name="institution"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="যেমন: সাব-রেজিস্ট্রি, ভূমি অফিস..."
              className="h-10 rounded-none border-2 border-border bg-card text-xs font-medium text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-foreground"
            />
          </div>

          {/* Categories */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Tag className="size-3.5 text-primary" />
                <span>অভিযোগের ধরন</span>
              </span>
              {selectedCategories.length > 0 && (
                <span className="text-[10px] font-bold text-primary">
                  {toBnDigits(selectedCategories.length)}টি নির্বাচিত
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {REPORT_CATEGORIES.map((cat) => {
                const meta = REPORT_CATEGORY_META[cat];
                const isChecked = selectedCategories.includes(cat);

                return (
                  <label
                    key={cat}
                    className={cn(
                      "flex cursor-pointer items-center justify-between border-2 p-2.5 text-xs transition-colors",
                      isChecked
                        ? "border-foreground bg-primary/10 font-bold text-foreground shadow-[2px_2px_0_var(--foreground)]"
                        : "border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground"
                    )}
                  >
                    <span className="truncate pr-1 text-[11px] font-medium">
                      {meta.label}
                    </span>
                    <input
                      type="checkbox"
                      name="category"
                      value={cat}
                      checked={isChecked}
                      onChange={() =>
                        toggleItem(
                          selectedCategories,
                          cat,
                          setSelectedCategories
                        )
                      }
                      className="sr-only"
                    />
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
                  </label>
                );
              })}
            </div>
          </div>

          {/* Verification Levels */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <ShieldCheck className="size-3.5 text-primary" />
                <span>যাচাইয়ের স্তর</span>
              </span>
              {selectedVerification.length > 0 && (
                <span className="text-[10px] font-bold text-primary">
                  {toBnDigits(selectedVerification.length)}টি নির্বাচিত
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {VERIFICATION_LEVELS.map((lvl) => {
                const meta = VERIFICATION_LEVEL_META[lvl];
                const isChecked = selectedVerification.includes(lvl);

                return (
                  <label
                    key={lvl}
                    className={cn(
                      "flex cursor-pointer items-center justify-between border-2 p-2.5 text-xs transition-colors",
                      isChecked
                        ? "border-foreground bg-accent/20 font-bold text-foreground shadow-[2px_2px_0_var(--foreground)]"
                        : "border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground"
                    )}
                  >
                    <span className="truncate pr-1 text-[11px] font-medium">
                      {meta.label}
                    </span>
                    <input
                      type="checkbox"
                      name="verificationLevel"
                      value={lvl}
                      checked={isChecked}
                      onChange={() =>
                        toggleItem(
                          selectedVerification,
                          lvl,
                          setSelectedVerification
                        )
                      }
                      className="sr-only"
                    />
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
                  </label>
                );
              })}
            </div>
          </div>

          {/* Areas */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <MapPin className="size-3.5 text-primary" />
                <span>ইউনিয়ন বা এলাকা</span>
              </span>
              {selectedAreas.length > 0 && (
                <span className="text-[10px] font-bold text-primary">
                  {toBnDigits(selectedAreas.length)}টি নির্বাচিত
                </span>
              )}
            </div>

            <Input
              value={areaSearch}
              onChange={(e) => setAreaSearch(e.target.value)}
              placeholder="এলাকা খুঁজুন..."
              className="h-9 rounded-none border-2 border-foreground bg-card text-xs placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-foreground"
            />

            <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
              {filteredAreas.map((area) => {
                const isChecked = selectedAreas.includes(area.slug);

                return (
                  <label
                    key={area.slug}
                    className={cn(
                      "flex cursor-pointer items-center justify-between border px-2 py-1.5 text-xs transition-colors",
                      isChecked
                        ? "border-foreground bg-primary/10 font-bold text-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground"
                    )}
                  >
                    <span className="truncate pr-1 text-[11px]">
                      {area.nameBn}
                    </span>
                    <input
                      type="checkbox"
                      name="area"
                      value={area.slug}
                      checked={isChecked}
                      onChange={() =>
                        toggleItem(selectedAreas, area.slug, setSelectedAreas)
                      }
                      className="sr-only"
                    />
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
                  </label>
                );
              })}
            </div>
          </div>
        </form>

        {/* Sticky Footer */}
        <SheetFooter className="border-t-2 border-border bg-card p-4 sm:p-5 flex-row items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="flex-1 h-11 rounded-none border-2 border-border text-xs font-bold text-foreground cursor-pointer"
          >
            <RotateCcw className="size-3.5 mr-1" />
            রিসেট
          </Button>

          <Button
            type="submit"
            form="mobile-filter-form"
            className="flex-2 h-11 rounded-none border-2 border-foreground bg-primary text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] cursor-pointer"
          >
            ফলাফল দেখুন
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
