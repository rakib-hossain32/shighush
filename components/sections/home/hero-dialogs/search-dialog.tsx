"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/* ------------------------------------------------------------------ */
/*  Sample records (same as reference HTML)                            */
/* ------------------------------------------------------------------ */
export interface SampleRecord {
  id: string;
  title: string;
  category: string;
  area: string;
  institution: string;
  description: string;
  date: string;
  status: "published" | "review";
  stage: number;
  verification: number;
  files: { name: string; sample: boolean; kind: string }[];
}

export const SAMPLE_RECORDS: SampleRecord[] = [
  {
    id: "SG-2026-0042",
    title: "সেবা পেতে অতিরিক্ত অর্থ দাবি",
    category: "bribery",
    area: "শিবচর পৌরসভা",
    institution: "স্থানীয় ভূমি সেবা কেন্দ্র (নমুনা)",
    description:
      "এটি একটি কাল্পনিক নমুনা রিপোর্ট। সেবা গ্রহণের সময় নির্ধারিত ফি ছাড়াও অতিরিক্ত অর্থ চাওয়ার একটি পরিস্থিতি দেখানো হয়েছে।",
    date: "১৮ ফেব্রুয়ারি ২০২৬",
    status: "published",
    stage: 4,
    verification: 3,
    files: [
      { name: "নথি_০১.pdf", sample: true, kind: "আবেদনপত্র" },
      { name: "রসিদ_০২.jpg", sample: true, kind: "রসিদ" },
    ],
  },
  {
    id: "SG-2026-0041",
    title: "নির্ধারিত সময়ে সেবা না পাওয়ার অভিযোগ",
    category: "service",
    area: "পাঁচচর",
    institution: "নাগরিক সেবা কেন্দ্র (নমুনা)",
    description:
      "এটি একটি কাল্পনিক নমুনা। নির্ধারিত সময় পার হওয়ার পরেও নাগরিক সেবা না পাওয়ার একটি পরিস্থিতি দেখানো হয়েছে।",
    date: "১৭ ফেব্রুয়ারি ২০২৬",
    status: "review",
    stage: 1,
    verification: 0,
    files: [],
  },
  {
    id: "SG-2026-0039",
    title: "সেবাগ্রহীতার সঙ্গে হয়রানিমূলক আচরণ",
    category: "harassment",
    area: "কাঁঠালবাড়ী",
    institution: "জনসেবা কার্যালয় (নমুনা)",
    description:
      "এটি একটি কাল্পনিক নমুনা রিপোর্ট। সেবা নিতে এসে হয়রানির সম্মুখীন হওয়ার অভিযোগ কীভাবে নথিতে দেখা যেতে পারে, তার একটি উদাহরণ।",
    date: "১৫ ফেব্রুয়ারি ২০২৬",
    status: "published",
    stage: 4,
    verification: 2,
    files: [{ name: "আবেদন_০১.pdf", sample: true, kind: "আবেদনপত্র" }],
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  bribery: "ঘুষ / অর্থ দাবি",
  harassment: "হয়রানি",
  service: "সেবা বঞ্চনা",
  abuse: "ক্ষমতার অপব্যবহার",
  other: "অন্যান্য",
};

const STATUS_LABELS: Record<string, string> = {
  published: "প্রকাশিত",
  review: "প্রক্রিয়াধীন",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecordClick: (recordId: string, evidenceFocus?: boolean) => void;
}

export function SearchDialog({ open, onOpenChange, onRecordClick }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "review">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = useMemo(() => {
    return SAMPLE_RECORDS.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          r.id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.area.toLowerCase().includes(q) ||
          r.institution.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [query, statusFilter, categoryFilter]);

  const handleResetFilters = () => {
    setQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-155 max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <p className="mono text-xs tracking-widest text-muted-foreground" lang="en">
            SHIGHUSH / PUBLIC RECORDS
          </p>
          <DialogTitle className="text-xl font-semibold leading-tight">
            নথিতে খুঁজুন, তথ্য জানুন।
          </DialogTitle>
          <DialogDescription className="text-sm">
            নমুনা রিপোর্ট ও এই ট্যাবে তৈরি নথি খুঁজে দেখুন।
          </DialogDescription>
        </DialogHeader>

        {/* Search input with shadcn Input */}
        <div className="relative">
          <svg
            className="icon absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          >
            <use href="#i-search" />
          </svg>
          <Input
            type="search"
            className="h-10 border border-border bg-background py-2 pl-10 pr-12 font-medium outline-none transition-all duration-200 hover:border-primary/50 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20"
            placeholder="রিপোর্ট আইডি, বিষয় বা এলাকা দিয়ে খুঁজুন"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>

        {/* Filters with shadcn Button and Select */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="রিপোর্টের অবস্থা">
            {(["all", "published", "review"] as const).map((f) => (
              <Button
                key={f}
                type="button"
                size="sm"
                variant={statusFilter === f ? "default" : "outline"}
                className="h-7 rounded-full px-3 text-xs cursor-pointer"
                onClick={() => setStatusFilter(f)}
              >
                {f === "all" ? "সব নথি" : STATUS_LABELS[f]}
              </Button>
            ))}
          </div>

          <Select
            value={categoryFilter}
            onValueChange={(val) => setCategoryFilter(val ?? "all")}
          >
            <SelectTrigger size="sm" className="w-44 text-xs cursor-pointer">
              <SelectValue placeholder="সব ধরনের অভিযোগ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সব ধরনের অভিযোগ</SelectItem>
              {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                <SelectItem key={val} value={val}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results count & reset */}
        <div
          className="flex items-center justify-between text-xs text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          <span>{filtered.length}টি নথি পাওয়া গেছে</span>
          {(query || statusFilter !== "all" || categoryFilter !== "all") && (
            <Button
              variant="ghost"
              size="xs"
              className="h-6 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={handleResetFilters}
            >
              ফিল্টার রিসেট
            </Button>
          )}
        </div>

        {/* Results list with shadcn Card & Badge */}
        <div className="space-y-2.5">
          {filtered.map((record) => (
            <Card
              key={record.id}
              size="sm"
              onClick={() => onRecordClick(record.id)}
              className="cursor-pointer transition-all hover:border-foreground/40 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onRecordClick(record.id);
                }
              }}
            >
              <CardContent className="p-3.5 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="mono text-[11px] tracking-wider text-muted-foreground"
                    lang="en"
                  >
                    {record.id}
                  </span>
                  <Badge
                    variant={record.status === "published" ? "secondary" : "outline"}
                    className="text-[10px] font-medium"
                  >
                    {STATUS_LABELS[record.status]}
                  </Badge>
                </div>
                <div className="text-sm font-medium leading-snug text-foreground">
                  {record.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {CATEGORY_LABELS[record.category]} · {record.area}
                </div>
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div className="space-y-3 py-10 text-center">
              <p className="text-sm text-muted-foreground">কোনো নথি পাওয়া যায়নি।</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="cursor-pointer"
              >
                সব ফিল্টার সরিয়ে দিন
              </Button>
            </div>
          )}
        </div>

        {/* Disclaimer with shadcn Separator */}
        <Separator className="my-1" />
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          সব উদাহরণ কাল্পনিক। ডেমোতে তৈরি নথি অন্য কেউ দেখতে পান না; রিফ্রেশ করলে সেগুলো
          মুছে যায়।
        </p>
      </DialogContent>
    </Dialog>
  );
}
