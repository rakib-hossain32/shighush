"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Shield,
  FileText,
  Copy,
  Check,
  ArrowLeft,
  Calendar,
  Building2,
  MapPin,
  Tag,
  Paperclip,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { type DisplayRecord, toDisplayRecord, CATEGORY_LABELS } from "./search-dialog";
import { cn } from "@/lib/utils";
import type { PublicReport } from "@/services/_shared/types";
import { formatCaseId, toBnDigits } from "@/lib/format";

/* ------------------------------------------------------------------ */
/*  Workflow Steps metadata                                            */
/* ------------------------------------------------------------------ */
const WORKFLOW_STEPS = [
  { title: "অভিযোগ" },
  { title: "মডারেশন" },
  { title: "প্রমাণ" },
  { title: "যাচাই" },
  { title: "প্রকাশ" },
];

/* ------------------------------------------------------------------ */
/*  Subcomponent: Notice Banner (Strictly rounded-none)                */
/* ------------------------------------------------------------------ */
function DetailNoticeCard() {
  return (
    <div className="flex items-start gap-3 rounded-none border-2 border-foreground bg-muted/40 p-3.5 text-xs font-medium leading-relaxed text-foreground shadow-[2px_2px_0_var(--foreground)]">
      <Shield className="size-4 text-primary shrink-0 mt-0.5" />
      <p>
        নাগরিক তথ্যের সুরক্ষা বজায় রেখে এই প্রতিবেদনটি দায়িত্বশীলতার সাথে পর্যালোচনা ও পরিমার্জন করে নথিবদ্ধ করা হয়েছে।
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Subcomponent: Metadata Grid (Strictly rounded-none)                */
/* ------------------------------------------------------------------ */
function DetailMetadataGrid({ record }: { record: DisplayRecord }) {
  const items = [
    {
      icon: MapPin,
      label: "এলাকা",
      value: record.area,
    },
    {
      icon: Building2,
      label: "প্রতিষ্ঠান / বিভাগ",
      value: record.institution,
    },
    {
      icon: Tag,
      label: "অভিযোগের ধরন",
      value: CATEGORY_LABELS[record.category] || record.category,
    },
    {
      icon: Calendar,
      label: "নথির তারিখ",
      value: record.date,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="flex items-center gap-3 rounded-none border-2 border-foreground bg-card p-3 shadow-[2px_2px_0_var(--foreground)]"
          >
            <div className="size-8 rounded-none border border-foreground bg-muted/60 grid place-items-center shrink-0">
              <Icon className="size-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[11px] font-black uppercase tracking-wider text-muted-foreground ">
                {item.label}
              </span>
              <span className="block text-xs font-black text-foreground truncate">
                {item.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Subcomponent: Workflow Progress Tracker (Strictly rounded-none)    */
/* ------------------------------------------------------------------ */
function DetailWorkflowProgress({ record }: { record: DisplayRecord }) {
  return (
    <div className="rounded-none border-2 border-foreground bg-card p-4 space-y-3 shadow-[2px_2px_0_var(--foreground)]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-foreground ">
          নথির অগ্রগতি ও যাচাইকরণ
        </span>
        <span className="rounded-none border border-foreground bg-background px-2 py-0.5 text-[10px] font-black shadow-[1px_1px_0_var(--foreground)]">
          যাচাই স্তর: {toBnDigits(record.verification)}/৩
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1 pt-2 relative">
        {WORKFLOW_STEPS.map((step, idx) => {
          const complete = idx <= record.stage;
          return (
            <div key={idx} className="relative text-center">
              {/* Connector line */}
              <div
                className={cn(
                  "absolute top-3.5 h-0.5 bg-border z-0",
                  idx === 0
                    ? "left-1/2 w-1/2"
                    : idx === WORKFLOW_STEPS.length - 1
                    ? "left-0 w-1/2"
                    : "left-0 w-full",
                  complete && "bg-primary"
                )}
              />

              <div
                className={cn(
                  "relative z-10 mx-auto mb-1.5 grid size-7 place-items-center rounded-none border-2 text-[11px] font-black transition-colors",
                  complete
                    ? "bg-primary text-primary-foreground border-foreground shadow-[1px_1px_0_var(--foreground)]"
                    : "bg-background text-muted-foreground border-border"
                )}
              >
                {complete ? (
                  <Check className="size-3.5 stroke-[3]" />
                ) : (
                  toBnDigits(idx + 1)
                )}
              </div>

              <span
                className={cn(
                  "block text-[11px] leading-tight",
                  complete ? "text-foreground font-black" : "text-muted-foreground font-semibold"
                )}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-muted-foreground pt-1 border-t border-border font-medium">
        {record.verification
          ? `যাচাই স্তর ${toBnDigits(record.verification)}/৩ অর্জিত। সংবেদনশীল তথ্য ও ব্যক্তিগত পরিচয় গোপন রেখে নথিবদ্ধ করা হয়েছে।`
          : "এখনও কোনো আনুষ্ঠানিক প্রমাণ যাচাই সম্পন্ন হয়নি।"}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Subcomponent: Attached Evidence List (Strictly rounded-none)       */
/* ------------------------------------------------------------------ */
function DetailEvidenceList({
  record,
  evidenceFocus,
  onOpenExhibit,
}: {
  record: DisplayRecord;
  evidenceFocus: boolean;
  onOpenExhibit?: (record: DisplayRecord, fileName: string, kind: string) => void;
}) {
  return (
    <div
      className={cn(
        "rounded-none border-2 border-foreground bg-card p-4 space-y-3 shadow-[2px_2px_0_var(--foreground)]",
        evidenceFocus && "ring-2 ring-primary"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Paperclip className="size-3.5 text-primary" />
          <span className="text-xs font-black uppercase tracking-wider text-foreground ">
            সংযুক্ত প্রমাণপত্র
          </span>
        </div>
        <span className="rounded-none border border-foreground bg-background px-2 py-0.5 text-[10px] font-black shadow-[1px_1px_0_var(--foreground)]">
          {toBnDigits(record.files.length)}টি ফাইল
        </span>
      </div>

      {record.files.length === 0 ? (
        <p className="py-2 text-xs text-muted-foreground font-medium">
          এই নথির সাথে কোনো ডিজিটাল ফাইল সরাসরি সংযুক্ত করা হয়নি।
        </p>
      ) : (
        <div className="divide-y divide-border">
          {record.files.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2.5 px-1 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-7 rounded-none bg-muted grid place-items-center shrink-0 border border-foreground">
                  <FileText className="size-3.5 text-foreground" />
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-black text-foreground truncate">
                    {file.name}
                  </span>
                  <span className="block text-[10px] text-muted-foreground ">
                    সংযুক্ত প্রমাণ কপি · {file.kind}
                  </span>
                </div>
              </div>

              {onOpenExhibit && (
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  className="cursor-pointer rounded-none gap-1 text-xs border-2 border-foreground font-black shadow-[1px_1px_0_var(--foreground)] hover:bg-muted shrink-0"
                  onClick={() => onOpenExhibit(record, file.name, file.kind)}
                >
                  <span>প্রদর্শন</span>
                  <ArrowUpRight className="size-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Props & Main Component                                             */
/* ------------------------------------------------------------------ */
interface DetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recordId: string | null;
  evidenceFocus?: boolean;
  onBackToSearch?: () => void;
  onOpenExhibit?: (record: DisplayRecord, fileName: string, kind: string) => void;
  reports?: PublicReport[];
}

export function DetailDialog({
  open,
  onOpenChange,
  recordId,
  evidenceFocus = false,
  onBackToSearch,
  onOpenExhibit,
  reports = [],
}: DetailDialogProps) {
  const [copied, setCopied] = useState(false);

  // Find matching report
  const matchingReport = reports.find(
    (r) =>
      r.id === recordId ||
      r.slug === recordId ||
      String(r.publicId) === recordId ||
      formatCaseId(r.publicId) === recordId
  );

  // If no matching report, render empty state cleanly
  if (!matchingReport) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[88vh] overflow-x-hidden overflow-y-auto rounded-none! border-2 border-foreground bg-card p-0 shadow-[6px_6px_0_var(--foreground)] sm:max-w-md">
          <DialogHeader className="border-b-2 border-foreground bg-muted/40 px-5 py-4 text-left sm:px-6">
            <DialogTitle className="font-heading text-lg font-black text-foreground">
              নথি খুঁজে পাওয়া যায়নি
            </DialogTitle>
          </DialogHeader>

          <div className="py-8 px-6 text-center space-y-4">
            <p className="text-xs text-muted-foreground font-medium">
              অনুরোধকৃত নথির রেকর্ডটি ডাটাবেজে পাওয়া যায়নি অথবা এটি পর্যালোচনার পর্যায়ে রয়েছে।
            </p>
            {onBackToSearch && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBackToSearch}
                className="cursor-pointer rounded-none border-2 border-foreground shadow-[2px_2px_0_var(--foreground)] font-black gap-2"
              >
                <ArrowLeft className="size-3.5" />
                <span>সব নথিতে ফিরুন</span>
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const record = toDisplayRecord(matchingReport);

  const handleCopyId = () => {
    navigator.clipboard.writeText(record.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-x-hidden overflow-y-auto rounded-none! border-2 border-foreground bg-card p-0 shadow-[6px_6px_0_var(--foreground)] sm:max-w-2xl">
        {/* Modal Header */}
        <DialogHeader className="border-b-2 border-foreground bg-muted/40 px-5 py-4 text-left sm:px-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-none border-2 border-foreground bg-background px-2 py-0.5 text-xs font-black  tracking-wider text-foreground shadow-[1px_1px_0_var(--foreground)]" lang="en">
              <FileText className="size-3 text-primary" />
              <span>{record.id}</span>
            </span>
            <span className="rounded-none border border-foreground bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-foreground">
              নাগরিক নথি
            </span>
          </div>
          <DialogTitle className="font-heading text-lg sm:text-xl font-black text-foreground leading-snug mt-1.5">
            {record.title}
          </DialogTitle>
        </DialogHeader>

        {/* Modal Content Body */}
        <div className="space-y-4 px-5 py-5 sm:px-6">
          {/* Information Notice */}
          <DetailNoticeCard />

          {/* Metadata Grid */}
          <DetailMetadataGrid record={record} />

          {/* Description Section */}
          <div className="rounded-none border-2 border-foreground bg-card p-4 space-y-2 shadow-[2px_2px_0_var(--foreground)]">
            <span className="text-xs font-black uppercase tracking-wider text-foreground  block">
              ঘটনার বিবরণ
            </span>
            <p className="text-xs leading-relaxed text-foreground bg-muted/40 p-3 rounded-none border border-foreground/40 whitespace-pre-wrap break-words font-medium">
              {record.description || "ঘটনার সুনির্দিষ্ট বিবরণ পর্যালোচিত অবস্থায় সংরক্ষিত রয়েছে।"}
            </p>
          </div>

          {/* Timeline / Progress */}
          <DetailWorkflowProgress record={record} />

          {/* Attached Evidence */}
          <DetailEvidenceList
            record={record}
            evidenceFocus={evidenceFocus}
            onOpenExhibit={onOpenExhibit}
          />
        </div>

        {/* Modal Footer (No horizontal overflow) */}
        <DialogFooter className="flex flex-row items-center justify-between border-t-2 border-foreground bg-muted/40 px-5 py-3.5 sm:px-6 gap-2">
          {onBackToSearch ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToSearch}
              className="cursor-pointer rounded-none gap-1 text-xs text-foreground font-bold hover:bg-muted shrink-0"
            >
              <ArrowLeft className="size-3.5" />
              <span>নথি তালিকা</span>
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyId}
              className="cursor-pointer rounded-none gap-1.5 text-xs font-black border-2 border-foreground bg-background shadow-[2px_2px_0_var(--foreground)] hover:bg-muted"
            >
              {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
              <span>{copied ? "কপি হয়েছে!" : "আইডি কপি"}</span>
            </Button>

            <Link
              href={`/reports/${record.slug || record.id}`}
              onClick={() => onOpenChange(false)}
              className="inline-flex items-center gap-1.5 rounded-none border-2 border-foreground bg-primary px-3.5 py-1.5 text-xs font-black text-primary-foreground shadow-[2px_2px_0_var(--foreground)] hover:opacity-95 transition-opacity"
            >
              <span>সম্পূর্ণ নথি</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
