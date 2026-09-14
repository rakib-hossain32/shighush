"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpDown,
  Check,
  FileText,
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  REPORT_CATEGORIES,
  REPORT_CATEGORY_META,
  REPORT_SORTS,
  REPORT_SORT_META,
  REPORT_STATUSES,
  REPORT_STATUS_META,
  type ReportCategory,
  type ReportStatus,
  type UserRole,
} from "@/lib/domain/enums";
import { AREAS } from "@/lib/domain/geo";
import { formatBnNumber } from "@/lib/format";
import type { ModerationQueueInput } from "@/lib/domain/schemas";
import { cn } from "@/lib/utils";

type AdminReportsFilterBarProps = {
  filters: ModerationQueueInput;
  total: number;
  role: UserRole;
};

const VIEW_OPTIONS = [
  { value: "all", label: "সব নথি" },
  { value: "active", label: "চলমান কিউ" },
  { value: "completed", label: "সম্পন্ন / প্রকাশিত" },
] as const;

const ASSIGNMENT_OPTIONS = [
  { value: "all", label: "সব দায়িত্ব" },
  { value: "mine", label: "আমার দায়িত্ব" },
  { value: "unassigned", label: "দায়িত্বহীন কিউ" },
] as const;

export function AdminReportsFilterBar({ filters, total, role }: AdminReportsFilterBarProps) {
  const [open, setOpen] = useState(false);

  // Draft filter states for the dialog
  const [draftView, setDraftView] = useState<string>(filters.view ?? "all");
  const [draftAssignment, setDraftAssignment] = useState<string>(
    filters.assignment ?? (role === "Moderator" ? "mine" : "all")
  );
  const [draftStatus, setDraftStatus] = useState<string[]>(filters.status);
  const [draftCategory, setDraftCategory] = useState<string[]>(filters.category);
  const [draftArea, setDraftArea] = useState<string[]>(filters.area);
  const [draftFlaggedOnly, setDraftFlaggedOnly] = useState<boolean>(Boolean(filters.flaggedOnly));
  const [draftSort, setDraftSort] = useState<string>(filters.sort ?? "newest");

  const toggleArray = (current: string[], value: string, setter: (next: string[]) => void) => {
    setter(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  const clearDraft = () => {
    setDraftView("all");
    setDraftAssignment(role === "Moderator" ? "mine" : "all");
    setDraftStatus([]);
    setDraftCategory([]);
    setDraftArea([]);
    setDraftFlaggedOnly(false);
  };

  const formId = "admin-reports-form";

  const submitFilters = () => {
    setOpen(false);
    window.requestAnimationFrame(() => {
      (document.getElementById(formId) as HTMLFormElement | null)?.requestSubmit();
    });
  };

  // Active filter items for display badges
  const activeLabels: Array<{ label: string; key: string }> = [];

  if (filters.view && filters.view !== "all") {
    const vOpt = VIEW_OPTIONS.find((opt) => opt.value === filters.view);
    if (vOpt) activeLabels.push({ label: `ভিউ: ${vOpt.label}`, key: "view" });
  }

  const defaultAssignment = role === "Moderator" ? "mine" : "all";
  if (filters.assignment && filters.assignment !== defaultAssignment) {
    const aOpt = ASSIGNMENT_OPTIONS.find((opt) => opt.value === filters.assignment);
    if (aOpt) activeLabels.push({ label: `দায়িত্ব: ${aOpt.label}`, key: "assignment" });
  }

  filters.status.forEach((st) => {
    const meta = REPORT_STATUS_META[st as ReportStatus];
    if (meta) activeLabels.push({ label: `অবস্থা: ${meta.label}`, key: `status-${st}` });
  });

  filters.category.forEach((cat) => {
    const meta = REPORT_CATEGORY_META[cat as ReportCategory];
    if (meta) activeLabels.push({ label: `ধরন: ${meta.short}`, key: `category-${cat}` });
  });

  filters.area.forEach((ar) => {
    const areaItem = AREAS.find((item) => item.slug === ar);
    if (areaItem) activeLabels.push({ label: `এলাকা: ${areaItem.nameBn}`, key: `area-${ar}` });
  });

  if (filters.flaggedOnly) {
    activeLabels.push({ label: "গোপনীয়তা সতর্কতা (PII)", key: "flaggedOnly" });
  }

  const activeCount = activeLabels.length;
  const hasFilter = activeCount > 0 || Boolean(filters.search);

  return (
    <div className="space-y-3">
      {/* Main Toolbar */}
      <form
        action="/admin/reports"
        className="flex flex-col gap-3 rounded-none border-2 border-border bg-card p-3.5 shadow-[3px_3px_0_var(--foreground)] sm:p-4 lg:flex-row lg:items-center lg:justify-between"
        id={formId}
        method="GET"
      >
        {/* Hidden inputs to preserve filters when submitting search or sort */}
        <input name="view" type="hidden" value={draftView} />
        <input name="assignment" type="hidden" value={draftAssignment} />
        {draftStatus.map((s) => (
          <input key={`status-${s}`} name="status" type="hidden" value={s} />
        ))}
        {draftCategory.map((c) => (
          <input key={`category-${c}`} name="category" type="hidden" value={c} />
        ))}
        {draftArea.map((a) => (
          <input key={`area-${a}`} name="area" type="hidden" value={a} />
        ))}
        {draftFlaggedOnly && <input name="flaggedOnly" type="hidden" value="1" />}
        <input name="sort" type="hidden" value={draftSort} />

        {/* Search Input Box */}
        <div className="relative min-w-0 flex-1 max-w-lg">
          <label className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
            <span className="sr-only">নথি নম্বর, শিরোনাম, প্রতিষ্ঠান বা শাখা দিয়ে খুঁজুন</span>
            <Input
              className="h-10 w-full rounded-none border-2 border-border bg-background pl-9 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-foreground"
              defaultValue={filters.search ?? ""}
              name="search"
              placeholder="নথি নম্বর, শিরোনাম, প্রতিষ্ঠান বা শাখা দিয়ে খুঁজুন..."
              type="search"
            />
          </label>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:justify-end">
          {/* Filter Modal Trigger Button */}
          <Button
            aria-expanded={open}
            className="h-10 rounded-none gap-2 border-2 border-border bg-background px-3.5 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:border-foreground hover:bg-muted hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
            onClick={() => setOpen(true)}
            type="button"
            variant="outline"
          >
            <Filter className="size-3.5 text-primary" />
            <span>ফিল্টার</span>
            {activeCount > 0 ? (
              <span className="grid size-5 place-items-center rounded-none border border-foreground bg-primary text-[10px] font-black text-primary-foreground">
                {activeCount}
              </span>
            ) : null}
          </Button>

          {/* Results Count */}
          <div className="hidden items-center gap-1.5 text-xs text-muted-foreground xl:flex">
            <FileText className="size-3.5 text-primary" />
            <span>
              মোট <strong className="text-foreground">{formatBnNumber(total)}</strong>টি নথি
            </span>
          </div>

          {/* Sort Dropdown (Shadcn Select) */}
          <Select value={draftSort} onValueChange={(val) => setDraftSort(val ?? "newest")}>
            <SelectTrigger className="h-10 w-auto min-w-36 gap-1.5 rounded-none border-2 border-border bg-background px-3 text-xs font-bold text-foreground shadow-none hover:border-foreground">
              <ArrowUpDown className="size-3.5 shrink-0 text-muted-foreground" />
              <SelectValue placeholder="সাজানোর ক্রম">
                {REPORT_SORT_META[draftSort as keyof typeof REPORT_SORT_META]?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-none border-2 border-foreground bg-card shadow-[4px_4px_0_var(--foreground)]">
              {REPORT_SORTS.map((value) => (
                <SelectItem className="rounded-none text-xs font-medium" key={value} value={value}>
                  {REPORT_SORT_META[value].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Submit Search Button */}
          <Button
            className="h-10 rounded-none border-2 border-foreground bg-primary px-4 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
            size="sm"
            type="submit"
          >
            খুঁজুন
          </Button>
        </div>
      </form>

      {/* Active Filter Chips & Clear Bar */}
      {hasFilter && (
        <div className="flex flex-wrap items-center gap-2 rounded-none border-2 border-border bg-card px-3.5 py-2.5 text-xs shadow-[2px_2px_0_var(--foreground)]">
          <span className="text-xs font-bold text-muted-foreground">সক্রিয় ফিল্টার:</span>

          {activeLabels.map((item) => (
            <Badge
              className="h-7 rounded-none border-2 border-primary/40 bg-primary/10 px-2.5 text-xs font-bold text-primary"
              key={item.key}
              variant="outline"
            >
              <span>{item.label}</span>
            </Badge>
          ))}

          {filters.search && (
            <Badge
              className="h-7 rounded-none border-2 border-border bg-background px-2.5 text-xs font-bold text-foreground"
              variant="outline"
            >
              <span>সার্চ: &ldquo;{filters.search}&rdquo;</span>
            </Badge>
          )}

          <Link
            className="ml-auto inline-flex items-center gap-1 rounded-none border-2 border-border bg-background px-2.5 py-1 text-xs font-bold text-foreground transition-all hover:border-destructive hover:text-destructive hover:shadow-[1px_1px_0_var(--foreground)] cursor-pointer"
            href="/admin/reports"
          >
            <RotateCcw className="size-3" />
            <span>সব রিসেট</span>
          </Link>
        </div>
      )}

      {/* Structured Filter Dialog */}
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="max-h-[88vh] overflow-y-auto rounded-none sm:rounded-none border-2 border-foreground p-0 shadow-[6px_6px_0_var(--foreground)] sm:max-w-2xl">
          <DialogHeader className="border-b-2 border-border bg-muted/40 px-5 py-5 text-left sm:px-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <SlidersHorizontal className="size-3.5" />
              <span>মডারেশন কিউ ফিল্টার</span>
            </div>
            <DialogTitle className="font-heading text-xl font-black text-foreground">
              নথি ফিল্টার ও সাজানো
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              মডারেশন সহজ করতে প্রয়োজনীয় ভিউ, দায়িত্ব ও অন্যান্য শর্ত নির্বাচন করুন।
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 px-5 py-5 sm:px-6">
            {/* View Selection */}
            <section className="space-y-2">
              <div>
                <h3 className="font-heading text-sm font-bold text-foreground">ভিউ ও ওয়ার্কফ্লো</h3>
                <p className="text-[11px] text-muted-foreground">কিউয়ের বর্তমান পর্যায় অনুযায়ী বেছে নিন</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {VIEW_OPTIONS.map((opt) => (
                  <Button
                    className={cn(
                      "h-auto cursor-pointer rounded-none border-2 px-3 py-2 text-xs font-bold transition-all",
                      draftView === opt.value
                        ? "border-foreground bg-primary text-foreground shadow-[2px_2px_0_var(--foreground)]"
                        : "border-border bg-background text-muted-foreground hover:border-foreground hover:bg-background hover:text-foreground"
                    )}
                    key={opt.value}
                    onClick={() => setDraftView(opt.value)}
                    type="button"
                    variant="outline"
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </section>

            {/* Assignment Selection */}
            <section className="space-y-2">
              <div>
                <h3 className="font-heading text-sm font-bold text-foreground">দায়িত্ব বণ্টন</h3>
                <p className="text-[11px] text-muted-foreground">কার দায়িত্বাধীন নথি দেখতে চান</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {ASSIGNMENT_OPTIONS.map((opt) => (
                  <Button
                    className={cn(
                      "h-auto cursor-pointer rounded-none border-2 px-3 py-2 text-xs font-bold transition-all",
                      draftAssignment === opt.value
                        ? "border-foreground bg-primary text-foreground shadow-[2px_2px_0_var(--foreground)]"
                        : "border-border bg-background text-muted-foreground hover:border-foreground hover:bg-background hover:text-foreground"
                    )}
                    key={opt.value}
                    onClick={() => setDraftAssignment(opt.value)}
                    type="button"
                    variant="outline"
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </section>

            {/* Privacy Alert (PII) Checkbox */}
            <section className="rounded-none border-2 border-destructive/40 bg-destructive/5 p-3.5">
              <Label className="flex cursor-pointer select-none items-center justify-between gap-3 text-xs font-bold text-destructive">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="size-4 shrink-0 text-destructive" />
                  <span>শুধুমাত্র ব্যক্তিগত তথ্যের ঝুঁকি (PII Findings) যুক্ত নথি</span>
                </span>
                <Checkbox
                  checked={draftFlaggedOnly}
                  className="rounded-none border-2 border-destructive"
                  onChange={(e) => setDraftFlaggedOnly(e.target.checked)}
                />
              </Label>
            </section>

            {/* Status Grid */}
            <section className="space-y-2">
              <div>
                <h3 className="font-heading text-sm font-bold text-foreground">নথির অবস্থা</h3>
                <p className="text-[11px] text-muted-foreground">নির্দিষ্ট অবস্থা অনুযায়ী নির্বাচন করুন</p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {REPORT_STATUSES.map((st) => {
                  const isChecked = draftStatus.includes(st);
                  const meta = REPORT_STATUS_META[st];
                  return (
                    <Label
                      className={cn(
                        "flex cursor-pointer select-none items-center justify-between gap-2 rounded-none border-2 px-3 py-2 text-xs transition-all",
                        isChecked
                          ? "border-foreground bg-primary/10 text-foreground font-bold shadow-[2px_2px_0_var(--foreground)]"
                          : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
                      )}
                      key={st}
                    >
                      <span>{meta.label}</span>
                      <Checkbox
                        checked={isChecked}
                        className="rounded-none border-2"
                        onChange={() => toggleArray(draftStatus, st, setDraftStatus)}
                      />
                    </Label>
                  );
                })}
              </div>
            </section>

            {/* Category Grid */}
            <section className="space-y-2">
              <div>
                <h3 className="font-heading text-sm font-bold text-foreground">অভিযোগের ধরন</h3>
                <p className="text-[11px] text-muted-foreground">অনিয়মের বিষয়বস্তু অনুযায়ী বেছে নিন</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {REPORT_CATEGORIES.map((cat) => {
                  const isChecked = draftCategory.includes(cat);
                  const meta = REPORT_CATEGORY_META[cat];
                  return (
                    <Label
                      className={cn(
                        "flex cursor-pointer select-none items-center justify-between gap-2 rounded-none border-2 px-3 py-2 text-xs transition-all",
                        isChecked
                          ? "border-foreground bg-primary/10 text-foreground font-bold shadow-[2px_2px_0_var(--foreground)]"
                          : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
                      )}
                      key={cat}
                    >
                      <span>{meta.label}</span>
                      <Checkbox
                        checked={isChecked}
                        className="rounded-none border-2"
                        onChange={() => toggleArray(draftCategory, cat, setDraftCategory)}
                      />
                    </Label>
                  );
                })}
              </div>
            </section>

            {/* Area Grid */}
            <section className="space-y-2">
              <div>
                <h3 className="font-heading text-sm font-bold text-foreground">প্রশাসনিক এলাকা</h3>
                <p className="text-[11px] text-muted-foreground">পৌরসভা বা ইউনিয়ন পরিষদ নির্বাচন করুন</p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {AREAS.map((ar) => {
                  const isChecked = draftArea.includes(ar.slug);
                  return (
                    <Label
                      className={cn(
                        "flex cursor-pointer select-none items-center justify-between gap-2 rounded-none border-2 px-3 py-2 text-xs transition-all",
                        isChecked
                          ? "border-foreground bg-primary/10 text-foreground font-bold shadow-[2px_2px_0_var(--foreground)]"
                          : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
                      )}
                      key={ar.slug}
                    >
                      <span className="truncate">{ar.nameBn}</span>
                      <Checkbox
                        checked={isChecked}
                        className="rounded-none border-2"
                        onChange={() => toggleArray(draftArea, ar.slug, setDraftArea)}
                      />
                    </Label>
                  );
                })}
              </div>
            </section>
          </div>

          <DialogFooter className="flex-row items-center justify-between border-t-2 border-border bg-muted/40 px-5 py-4 sm:px-6">
            <Button
              className="rounded-none gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={clearDraft}
              type="button"
              variant="ghost"
            >
              <RotateCcw className="size-3.5" />
              <span>রিসেট</span>
            </Button>
            <Button
              className="rounded-none gap-1.5 border-2 border-foreground bg-primary px-5 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
              onClick={submitFilters}
              type="button"
            >
              <Check className="size-4" />
              <span>ফিল্টার প্রয়োগ করুন</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
