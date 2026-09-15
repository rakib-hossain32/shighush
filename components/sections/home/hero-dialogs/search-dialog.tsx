"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  RotateCcw,
  ArrowRight,
  FileText,
  CheckCircle2,
  ShieldAlert,
  ArrowUpRight,

} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import type { PublicReport } from "@/services/_shared/types";
import { formatCaseId, formatBnDate, toBnDigits } from "@/lib/format";
import { areaName } from "@/lib/domain/geo";
import { REPORT_CATEGORY_META } from "@/lib/domain/enums";

/* ------------------------------------------------------------------ */
/*  Display record type (mapped from PublicReport)                     */
/* ------------------------------------------------------------------ */
export interface DisplayRecord {
  id: string;
  slug: string;
  title: string;
  category: string;
  area: string;
  institution: string;
  description: string;
  date: string;
  status: "published" | "review";
  stage: number;
  verification: number;
  files: { name: string; kind: string }[];
}

export const CATEGORY_LABELS: Record<string, string> = {
  bribery: REPORT_CATEGORY_META.bribery.label,
  extortion: REPORT_CATEGORY_META.extortion.label,
  service_denial: REPORT_CATEGORY_META.service_denial.label,
  service: REPORT_CATEGORY_META.service_denial.label,
  harassment: REPORT_CATEGORY_META.harassment.label,
  abuse_of_power: REPORT_CATEGORY_META.abuse_of_power.label,
  abuse: REPORT_CATEGORY_META.abuse_of_power.label,
  procurement_irregularity: REPORT_CATEGORY_META.procurement_irregularity.label,
  fraud: REPORT_CATEGORY_META.fraud.label,
  other: REPORT_CATEGORY_META.other.label,
};

export const STATUS_LABELS: Record<string, string> = {
  published: "প্রকাশিত",
  review: "প্রক্রিয়াধীন",
};

/* ------------------------------------------------------------------ */
/*  Helper: map PublicReport → DisplayRecord                           */
/* ------------------------------------------------------------------ */
export function toDisplayRecord(r: PublicReport): DisplayRecord {
  return {
    id: formatCaseId(r.publicId),
    slug: r.slug || r.id,
    title: r.title || r.summary || "নাগরিক নথি",
    category: r.category || "other",
    area: r.location?.area ? areaName(r.location.area) : "শিবচর",
    institution: r.institution?.nameBn || "সংশ্লিষ্ট প্রতিষ্ঠান",
    description: r.summary || r.narrative || "",
    date: formatBnDate(r.publishedAt || r.updatedAt),
    status:
      r.status === "published" || r.status === "resolved"
        ? "published"
        : "review",
    stage: r.status === "published" || r.status === "resolved" ? 4 : 2,
    verification:
      r.verificationLevel === "official_record" ||
      r.verificationLevel === "corroborated"
        ? 3
        : r.verificationLevel === "evidence_attached"
          ? 2
          : 1,
    files: (r.evidence || []).map((e) => ({
      name: e.title,
      kind: e.type,
    })),
  };
}

/* ------------------------------------------------------------------ */
/*  Subcomponent: Quick Category Filter Pills (Strictly rounded-none)  */
/* ------------------------------------------------------------------ */
function QuickCategoryChips({
  selectedCategory,
  onSelect,
}: {
  selectedCategory: string;
  onSelect: (cat: string) => void;
}) {
  const quickCategories = [
    { key: "bribery", label: "ঘুষ / অতিরিক্ত অর্থ" },
    { key: "service_denial", label: "সেবা-বঞ্চনা" },
    { key: "abuse_of_power", label: "ক্ষমতার অপব্যবহার" },
    { key: "extortion", label: "চাঁদাবাজি" },
  ];

  return (
    <div className="space-y-1.5 pt-1">
      <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground block ">
        জনপ্রিয় অনুসন্ধান
      </span>
      <div className="flex flex-wrap gap-1.5">
        {quickCategories.map((item) => {
          const isSelected = selectedCategory === item.key;
          return (
            <button
              key={item.key}
              type="button"
              className={`cursor-pointer px-2.5 py-1 text-xs font-bold border-2 transition-all rounded-none ${
                isSelected
                  ? "border-foreground bg-primary text-primary-foreground shadow-[2px_2px_0_var(--foreground)]"
                  : "border-border bg-card text-foreground hover:border-foreground hover:bg-muted/40 shadow-[1px_1px_0_var(--foreground)]"
              }`}
              onClick={() => onSelect(isSelected ? "all" : item.key)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Subcomponent: Report Record Item Card (Matching ReportListCard)   */
/* ------------------------------------------------------------------ */
function ReportResultCard({
  record,
  onClick,
}: {
  record: DisplayRecord;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-none border-2 border-foreground bg-card p-0 shadow-[3px_3px_0_var(--foreground)] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--foreground)]"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-foreground bg-muted/40 px-3 py-2 sm:px-4">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-none border-2 border-foreground bg-background px-2 py-0.5 text-[11px] font-black  tracking-wider text-foreground shadow-[1px_1px_0_var(--foreground)]"
            lang="en"
          >
            <FileText className="size-3 text-primary" />
            <span>{record.id}</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-none border border-foreground bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-foreground">
            <span>{CATEGORY_LABELS[record.category] || record.category}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-none border border-foreground bg-background px-2 py-0.5 text-[10px] font-bold text-foreground shadow-[1px_1px_0_var(--foreground)]">
            {STATUS_LABELS[record.status]}
          </span>
          <span className="text-[10px]  font-medium text-muted-foreground">
            {record.date}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-3.5 sm:p-4 space-y-2">
        <div className="font-heading text-sm sm:text-base font-black text-foreground group-hover:text-primary transition-colors leading-snug">
          {record.title}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground border-t border-border pt-2 font-medium">
          <span className="text-foreground font-semibold">
            {record.institution}
          </span>
          <span>·</span>
          <span>{record.area}</span>
          <span className="ml-auto flex items-center gap-1 text-[11px] font-bold text-primary group-hover:underline">
            <span>বিস্তারিত দেখুন</span>
            <ArrowUpRight className="size-3" />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Props & Main Component                                             */
/* ------------------------------------------------------------------ */
interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecordClick: (recordId: string, evidenceFocus?: boolean) => void;
  reports?: PublicReport[];
}

export function SearchDialog({
  open,
  onOpenChange,
  onRecordClick,
  reports = [],
}: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "review"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const selectedCategoryLabel =
    categoryFilter === "all"
      ? "সব ধরনের অভিযোগ"
      : CATEGORY_LABELS[categoryFilter] || "সব ধরনের অভিযোগ";

  const recordsList = useMemo(() => reports.map(toDisplayRecord), [reports]);

  // Is user actively searching or filtering?
  const isFiltering =
    query.trim().length > 0 ||
    statusFilter !== "all" ||
    categoryFilter !== "all";

  // Filter all reports matching criteria
  const allMatchedRecords = useMemo(() => {
    if (!isFiltering) {
      return recordsList;
    }

    return recordsList.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (categoryFilter !== "all" && r.category !== categoryFilter)
        return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          r.id.toLowerCase().includes(q) ||
          r.slug.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.area.toLowerCase().includes(q) ||
          r.institution.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [recordsList, query, statusFilter, categoryFilter, isFiltering]);

  // REQUIREMENT: Maximum 3 reports ("sorbocho tin ti report thakbe")
  const displayedRecords = useMemo(() => {
    return allMatchedRecords.slice(0, 3);
  }, [allMatchedRecords]);

  const remainingCount = allMatchedRecords.length - displayedRecords.length;

  const handleResetFilters = () => {
    setQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-h-[88vh] overflow-hidden rounded-none! border-2 border-foreground bg-card p-0 shadow-[6px_6px_0_var(--foreground)] sm:max-w-2xl">
        {/* Header with Neo-brutalist theme bar */}
        <DialogHeader className="shrink-0 border-b-2 border-foreground bg-muted/40 px-5 py-4 text-left sm:px-6">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary font-mono">
            <Search className="size-3.5" />
            <span>SHIGHUSH / PUBLIC SEARCH</span>
          </div>
          <DialogTitle className="font-heading text-xl font-black text-foreground">
            নথিতে খুঁজুন, তথ্য জানুন
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-medium">
            শিবচরের নাগরিক অভিযোগ, যাচাইকৃত নথি ও হালনাগাদ রেকর্ড অনুসন্ধান করুন।
          </DialogDescription>
        </DialogHeader>

        {/* Modal Body with Sleek Custom Scrollbar */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-4 px-5 py-5 sm:px-6 custom-modal-scrollbar">
          {/* Search Input Bar with Icon (Strictly rounded-none) */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              className="h-11 rounded-none border-2 border-foreground bg-background py-2.5 pl-10 pr-16 text-sm font-bold shadow-[2px_2px_0_var(--foreground)] outline-none transition-all placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:border-primary"
              placeholder="কেস আইডি (যেমন: 0042), বিষয়, প্রতিষ্ঠান বা এলাকা..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 rounded-none px-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                onClick={() => setQuery("")}
              >
                মুছুন
              </Button>
            )}
          </div>

          {/* Filter Bar with Buttons and Select (Strictly rounded-none & Bengali Labels) */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div
              className="flex flex-wrap gap-1.5"
              role="group"
              aria-label="রিপোর্টের অবস্থা"
            >
              {(["all", "published", "review"] as const).map((f) => (
                <Button
                  key={f}
                  type="button"
                  size="sm"
                  variant={statusFilter === f ? "default" : "outline"}
                  className={`h-8 rounded-none border-2 border-foreground px-3 text-xs font-bold cursor-pointer transition-all ${
                    statusFilter === f
                      ? "bg-primary text-primary-foreground shadow-[2px_2px_0_var(--foreground)]"
                      : "bg-background text-foreground hover:bg-muted shadow-[1px_1px_0_var(--foreground)]"
                  }`}
                  onClick={() => setStatusFilter(f)}
                >
                  {f === "all" ? "সব স্ট্যাটাস" : STATUS_LABELS[f]}
                </Button>
              ))}
            </div>

            {/* Select with Explicit Bengali label (NO ENGLISH) */}
            <Select
              value={categoryFilter}
              onValueChange={(val) => setCategoryFilter(val ?? "all")}
            >
              <SelectTrigger
                size="default"
                className="h-8 w-40 rounded-none! border-2 border-foreground bg-background text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] cursor-pointer"
              >
                <span className="truncate">{selectedCategoryLabel}</span>
              </SelectTrigger>
              <SelectContent className="rounded-none! border-2 border-foreground bg-card shadow-[4px_4px_0_var(--foreground)]">
                <SelectItem
                  value="all"
                  className="rounded-none font-bold text-xs"
                >
                  সব ধরনের অভিযোগ
                </SelectItem>
                {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                  <SelectItem
                    key={val}
                    value={val}
                    className="rounded-none font-bold text-xs"
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* If user is idle (not filtering), show quick chips */}
          {!isFiltering && (
            <QuickCategoryChips
              selectedCategory={categoryFilter}
              onSelect={(cat) => setCategoryFilter(cat)}
            />
          )}

          {/* Section Divider & Indicator */}
          <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/80 pb-2">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              {isFiltering ? (
                <>
                  <FileText className="size-3.5 text-primary" />
                  <span>
                    ফলাফল: {toBnDigits(allMatchedRecords.length)}টি নথি পাওয়া
                    গেছে (সর্বোচ্চ ৩টি প্রদর্শিত)
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-3.5 text-primary" />
                  <span>সাম্প্রতিক ৩টি নথি</span>
                </>
              )}
            </div>

            {isFiltering && (
              <Button
                variant="ghost"
                size="xs"
                className="h-6 rounded-none gap-1 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={handleResetFilters}
              >
                <RotateCcw className="size-3" />
                <span>রিসেট</span>
              </Button>
            )}
          </div>

          {/* Results List: Maximum 3 items */}
          <div className="space-y-3">
            {displayedRecords.map((record) => (
              <ReportResultCard
                key={record.id}
                record={record}
                onClick={() => onRecordClick(record.slug || record.id)}
              />
            ))}

            {displayedRecords.length === 0 && (
              <div className="rounded-none border-2 border-dashed border-foreground/40 bg-muted/20 py-8 px-4 text-center space-y-3">
                <ShieldAlert className="size-8 mx-auto text-muted-foreground/60" />
                <p className="font-heading font-black text-sm text-foreground">
                  কোনো নথি পাওয়া যায়নি
                </p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  আপনার অনুসন্ধান অনুযায়ী কোনো রেকর্ড মেলেনি। অন্য শব্দ দিয়ে
                  খুঁজুন অথবা ফিল্টার রিসেট করুন।
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="cursor-pointer rounded-none border-2 border-foreground shadow-[2px_2px_0_var(--foreground)] font-bold mt-1"
                >
                  সব ফিল্টার সরিয়ে দিন
                </Button>
              </div>
            )}

            {/* View More Link if more than 3 records exist */}
            {remainingCount > 0 && (
              <div className="pt-2 text-center">
                <Link
                  href={
                    query.trim()
                      ? `/reports?q=${encodeURIComponent(query.trim())}`
                      : "/reports"
                  }
                  onClick={() => onOpenChange(false)}
                  className="inline-flex items-center gap-2 rounded-none border-2 border-foreground bg-background px-4 py-2 text-xs font-black text-foreground shadow-[2px_2px_0_var(--foreground)] hover:bg-muted transition-colors"
                >
                  <span>
                    আরও {toBnDigits(remainingCount)}টি নথি দেখতে সম্পূর্ণ পাতায়
                    যান
                  </span>
                  <ArrowRight className="size-3.5 text-primary" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Footer with website disclaimer & close button (Strictly rounded-none) */}
        <DialogFooter className="flex flex-row items-center justify-between border-t-2 border-foreground bg-muted/40 px-5 py-3.5 sm:px-6">
          <p className="text-[11px] font-medium leading-tight text-muted-foreground">
            নাগরিক স্বার্থে দায়িত্বশীলভাবে পর্যালোচিত নথি।
          </p>

          <DialogClose
            render={
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer rounded-none font-bold border-2 border-foreground shadow-[2px_2px_0_var(--foreground)] bg-background hover:bg-muted"
              />
            }
          >
            বন্ধ করুন
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
