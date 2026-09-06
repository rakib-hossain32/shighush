"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SAMPLE_RECORDS, type SampleRecord } from "./search-dialog";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Bangla digit converter helper                                     */
/* ------------------------------------------------------------------ */
function toBn(num: number | string): string {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/[0-9]/g, (d) => bnDigits[Number(d)]);
}

const CATEGORY_LABELS: Record<string, string> = {
  bribery: "ঘুষ / অর্থ দাবি",
  harassment: "হয়রানি",
  service: "সেবা বঞ্চনা",
  abuse: "ক্ষমতার অপব্যবহার",
  other: "অন্যান্য",
};

const WORKFLOW_STEPS = [
  { title: "অভিযোগ" },
  { title: "মডারেশন" },
  { title: "প্রমাণ" },
  { title: "যাচাই" },
  { title: "প্রকাশ" },
];

function SpriteIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <svg className={`icon ${className}`.trim()} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Props & Component                                                  */
/* ------------------------------------------------------------------ */
interface DetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recordId: string | null;
  evidenceFocus?: boolean;
  onBackToSearch?: () => void;
  onOpenExhibit?: (record: SampleRecord, fileName: string, kind: string) => void;
}

export function DetailDialog({
  open,
  onOpenChange,
  recordId,
  evidenceFocus = false,
  onBackToSearch,
  onOpenExhibit,
}: DetailDialogProps) {
  const [copied, setCopied] = useState(false);

  // Find record from sample records
  const record =
    SAMPLE_RECORDS.find((r) => r.id === recordId) || SAMPLE_RECORDS[0];

  const handleCopyId = () => {
    if (!record) return;
    navigator.clipboard.writeText(record.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-155 max-h-[88vh] overflow-y-auto">
        <DialogHeader className="space-y-1.5 pb-1">
          <div className="flex items-center gap-2">
            <span
              className="mono text-xs tracking-widest text-muted-foreground"
              lang="en"
            >
              {record.id}
            </span>
            <Badge
              variant="outline"
              className="h-4 px-1.5 py-0 text-[10px] font-mono tracking-wider text-muted-foreground uppercase"
            >
              SAMPLE RECORD
            </Badge>
          </div>
          <DialogTitle className="text-xl font-semibold leading-tight">
            {record.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* Demo Notice */}
          <div className="flex gap-2.5 p-3.5 bg-muted border-l-2 border-primary text-xs leading-relaxed rounded-r-md">
            <SpriteIcon name="shield" className="size-4 mt-0.5 shrink-0 text-foreground" />
            <p>
              এটি একটি কাল্পনিক নমুনা নথি। এখানে দেখানো প্রকাশ ও যাচাই বাস্তব ঘটনা
              নির্দেশ করে না।
            </p>
          </div>

          {/* Metadata Grid */}
          <dl className="grid grid-cols-2 gap-4 py-4 border-y border-border">
            <div>
              <dt className="text-[11px] text-muted-foreground mb-1">এলাকা</dt>
              <dd className="text-sm font-medium text-foreground break-words">{record.area}</dd>
            </div>
            <div>
              <dt className="text-[11px] text-muted-foreground mb-1">প্রতিষ্ঠান</dt>
              <dd className="text-sm font-medium text-foreground break-words">{record.institution}</dd>
            </div>
            <div>
              <dt className="text-[11px] text-muted-foreground mb-1">অভিযোগের ধরন</dt>
              <dd className="text-sm font-medium text-foreground break-words">{CATEGORY_LABELS[record.category] || record.category}</dd>
            </div>
            <div>
              <dt className="text-[11px] text-muted-foreground mb-1">নথির তারিখ</dt>
              <dd className="text-sm font-medium text-foreground break-words">{record.date}</dd>
            </div>
          </dl>

          {/* Description Section */}
          <section className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">ঘটনার বিবরণ</h3>
            <p className="text-[13.5px] leading-relaxed text-foreground bg-muted p-3.5 rounded-lg border border-border whitespace-pre-wrap break-words">{record.description}</p>
          </section>

          {/* Timeline / Progress */}
          <section className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">নথির অগ্রগতি (ডেমো)</h3>
            <ol className="grid grid-cols-5 gap-0 py-3 relative">
              {WORKFLOW_STEPS.map((step, idx) => {
                const complete = idx <= record.stage;
                return (
                  <li key={idx} className="relative text-[11px] text-center">
                    {/* Connector line */}
                    <div
                      className={cn(
                        "absolute top-3.5 h-px bg-border z-0",
                        idx === 0 ? "left-1/2 w-1/2" : idx === WORKFLOW_STEPS.length - 1 ? "left-0 w-1/2" : "left-0 w-full"
                      )}
                    />
                    <span
                      className={cn(
                        "relative z-10 mx-auto mb-2 grid size-7 place-items-center rounded-full border text-[11px] font-medium transition-colors",
                        complete
                          ? "bg-(--lime) text-(--ink) border-(--ink) font-semibold"
                          : "bg-card text-muted-foreground border-border"
                      )}
                    >
                      {complete ? (
                        <SpriteIcon name="check" className="size-3.5 stroke-[2.2]" />
                      ) : (
                        toBn(idx + 1)
                      )}
                    </span>
                    <span className={cn("block text-[11px]", complete ? "text-foreground font-medium" : "text-muted-foreground")}>
                      {step.title}
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-2 text-[11px] text-muted-foreground">
              {record.verification
                ? `নমুনা যাচাই স্তর: ${toBn(record.verification)}/৩। এটি চূড়ান্ত আইনি সিদ্ধান্ত নয়।`
                : "এখনো কোনো প্রমাণ যাচাই করা হয়নি।"}
            </p>
          </section>

          {/* Attached Evidence */}
          <section
            className={cn("mt-5", evidenceFocus && "rounded-lg p-2 ring-2 ring-primary/40")}
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
              সংযুক্ত প্রমাণ ({toBn(record.files.length)})
            </h3>
            {record.files.length === 0 ? (
              <p className="py-2 text-xs text-muted-foreground">
                এই নথিতে কোনো ফাইল যুক্ত করা হয়নি।
              </p>
            ) : (
              <div className="divide-y divide-border">
                {record.files.map((file, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (onOpenExhibit) {
                        onOpenExhibit(record, file.name, file.kind);
                      }
                    }}
                    className="group flex w-full items-center gap-3 py-3 text-left transition hover:opacity-80 cursor-pointer"
                  >
                    <SpriteIcon name="file" className="size-4.5 text-foreground shrink-0" />
                    <span className="flex-1 min-w-0">
                      <span className="block text-xs font-medium text-foreground truncate">{file.name}</span>
                      <small className="block text-[10px] text-muted-foreground">কাল্পনিক প্রমাণের নমুনা দেখুন</small>
                    </span>
                    <SpriteIcon
                      name="arrow-up-right"
                      className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground shrink-0"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer Actions with shadcn Button and Separator */}
        <Separator className="mt-2" />
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          {onBackToSearch ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToSearch}
              className="-ml-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground"
            >
              ← সব নথিতে ফিরুন
            </Button>
          ) : (
            <div />
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyId}
            className="cursor-pointer gap-1.5 text-xs"
          >
            <SpriteIcon
              name={copied ? "check" : "copy"}
              className="h-3.5 w-3.5"
            />
            {copied ? "কপি হয়েছে!" : "আইডি কপি করুন"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
