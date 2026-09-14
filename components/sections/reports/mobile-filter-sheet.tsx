"use client";

import { useEffect, useState } from "react";
import { Filter, X } from "lucide-react";

import { ReportsFilterPanel } from "@/components/sections/reports/reports-filter-panel";
import type { ReportFilterInput } from "@/lib/domain/schemas";
import { Button } from "@/components/ui/button";

/**
 * Mobile filter drawer. Renders inline (not through a portal) so the fields stay inside
 * the page's `<form method="GET">` and submit with everything else — a portal would move
 * them out of the form in the DOM and silently drop the selection.
 */
export function MobileFilterSheet({ filters }: { filters: ReportFilterInput }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) =>
      event.key === "Escape" && setOpen(false);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const activeCount =
    filters.category.length +
    filters.verificationLevel.length +
    filters.area.length +
    (filters.institution ? 1 : 0) +
    (filters.search ? 1 : 0);

  return (
    <div className="border-b border-border py-3 lg:hidden">
      <Button
        className="inline-flex w-full items-center justify-center gap-2 border border-foreground bg-card px-4 py-3 text-sm font-bold"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Filter className="size-4 text-primary" />
        ফিল্টার ও সাজানো
        {activeCount > 0 && (
          <span className="grid size-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">
            {activeCount}
          </span>
        )}
      </Button>

      {open && (
        <div
          aria-label="রিপোর্ট ফিল্টার"
          aria-modal="true"
          className="fixed inset-0 z-100 lg:hidden"
          role="dialog"
        >
          <button
            aria-label="ফিল্টার বন্ধ করুন"
            className="absolute inset-0 bg-foreground/45 backdrop-blur-[1px] cursor-pointer"
            onClick={() => setOpen(false)}
            type="button"
          />

          <section className="absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-3xl border-t-2 border-foreground bg-background shadow-[0_-8px_30px_rgb(16_34_30_/_18%)]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-5 py-4">
              <div>
                <p className="text-lg font-bold">ফিল্টার ও সাজানো</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  পছন্দমতো ফলাফল দেখুন
                </p>
              </div>
              <Button
                aria-label="ফিল্টার বন্ধ করুন"
                className="grid size-9 place-items-center rounded-full border border-foreground"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="p-5">
              <ReportsFilterPanel
                className="border-0 bg-transparent p-0"
                filters={filters}
              />
              <div className="sticky bottom-0 -mx-5 -mb-5 mt-5 border-t border-border bg-background p-5">
                {/* Submits the page form, which closes the sheet by navigating. */}
                <Button
                  className="w-full bg-primary py-3.5 font-bold text-primary-foreground"
                  type="submit"
                >
                  ফিল্টার প্রয়োগ করুন
                </Button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
