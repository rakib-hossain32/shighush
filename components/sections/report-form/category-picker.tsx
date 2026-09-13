"use client";

/**
 * Category picker — step 1's most consequential control.
 *
 * This one choice decides whether the wizard demands money fields at all (`needsMoney`
 * in `CATEGORY_SCENARIOS`), yet it used to live inside a `<Select>`: a harassment victim
 * had no way to know they would never be asked about money, and an extortion victim had
 * no way to know they would. Tiles put that branch on screen before the reporter commits.
 *
 * Built on native `<input type="radio">` rather than buttons with `aria-checked`, which
 * buys correct group semantics and arrow-key navigation for free.
 */

import { BanknoteIcon, CheckIcon, ShieldOffIcon } from "lucide-react";
import { Controller, type Control } from "react-hook-form";

import type { ReportSubmitInput } from "@/lib/domain/schemas";
import {
  REPORT_CATEGORIES,
  REPORT_CATEGORY_META,
  type ReportCategory,
} from "@/lib/domain/enums";
import { cn } from "@/lib/utils";

import { FieldError } from "./field";
import { CATEGORY_SCENARIOS } from "./types";

const LABEL_ID = "category-picker-label";

interface CategoryPickerProps {
  control: Control<ReportSubmitInput>;
  error?: string;
}

export function CategoryPicker({ control, error }: CategoryPickerProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-xs font-bold uppercase tracking-wider text-foreground"
          id={LABEL_ID}
        >
          কী ধরনের সমস্যা?{" "}
          <span aria-hidden="true" className="font-bold text-primary">
            *
          </span>
          <span className="sr-only">(আবশ্যক)</span>
        </span>
        <span className="shrink-0 text-[11px] text-muted-foreground">
          একটি বেছে নিন
        </span>
      </div>

      <Controller
        control={control}
        name="category"
        render={({ field }) => (
          <div
            aria-labelledby={LABEL_ID}
            className="grid grid-cols-2 gap-2 sm:gap-2.5"
            id="category"
            role="radiogroup"
          >
            {REPORT_CATEGORIES.map((cat, idx) => {
              const scenario = CATEGORY_SCENARIOS[cat];
              const selected = field.value === cat;

              return (
                <label
                  className="relative block cursor-pointer select-none"
                  key={cat}
                  htmlFor={`category-${cat}`}
                >
                  <input
                    checked={selected}
                    className="peer sr-only"
                    id={`category-${cat}`}
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={() => field.onChange(cat)}
                    // Only the first radio takes the ref: `setFocus("category")` should
                    // land on the group, and focusing a radio group means focusing its
                    // first member.
                    ref={idx === 0 ? field.ref : undefined}
                    type="radio"
                    value={cat}
                  />

                  <span
                    className={cn(
                      "flex h-full flex-col gap-1 sm:gap-1.5 rounded-none border-2 p-2 sm:p-3 transition-all",
                      "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
                      selected
                        ? "border-foreground bg-primary/10 shadow-[2px_2px_0_var(--foreground)]"
                        : "border-border bg-background hover:border-foreground",
                    )}
                  >
                    <span className="flex items-start justify-between gap-1 sm:gap-1.5">
                      <span className="flex min-w-0 items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold text-foreground leading-tight">
                        {selected && (
                          <CheckIcon
                            aria-hidden="true"
                            className="size-3 sm:size-3.5 shrink-0 text-primary"
                          />
                        )}
                        <span className="min-w-0">
                          {REPORT_CATEGORY_META[cat as ReportCategory].label}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "shrink-0 rounded-none border px-1 py-0.5 sm:px-1.5 text-[8px] sm:text-[9px] font-bold",
                          selected
                            ? "border-foreground bg-primary text-primary-foreground"
                            : "border-border bg-card text-muted-foreground",
                        )}
                      >
                        {scenario.badge}
                      </span>
                    </span>

                    <span className="text-[10px] sm:text-[11px] leading-snug sm:leading-relaxed text-muted-foreground line-clamp-2">
                      {scenario.shortHint}
                    </span>

                    {/* Money requirement indicator */}
                    <span
                      className={cn(
                        "mt-auto inline-flex items-center gap-1 sm:gap-1.5 pt-0.5 sm:pt-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider",
                        scenario.needsMoney
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    >
                      {scenario.needsMoney ? (
                        <>
                          <BanknoteIcon aria-hidden="true" className="size-2.5 sm:size-3 shrink-0" />
                          <span className="truncate">টাকার অঙ্ক লাগবে</span>
                        </>
                      ) : (
                        <>
                          <ShieldOffIcon aria-hidden="true" className="size-2.5 sm:size-3 shrink-0" />
                          <span className="truncate">টাকার তথ্য লাগবে না</span>
                        </>
                      )}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        )}
      />

      <FieldError id="category-error">{error}</FieldError>
    </div>
  );
}
