import { EyeOff, FileText, Info } from "lucide-react";

import { PiiHighlightedText } from "@/components/admin/pii-highlighted-text";
import { formatBnDateTime, formatBnNumber } from "@/lib/format";
import type { ModerationReport } from "@/services/_shared/types";

export function ReportRawNarrative({ report }: { report: ModerationReport }) {
  const charCount = report.rawNarrative?.length ?? 0;
  const wordCount = report.rawNarrative?.trim() ? report.rawNarrative.trim().split(/\s+/).length : 0;

  return (
    <div className="border-2 border-foreground bg-card shadow-[3px_3px_0_var(--foreground)]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-foreground bg-secondary/40 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="grid size-8 place-items-center border border-foreground bg-primary text-foreground">
            <FileText className="size-4" />
          </div>
          <div>
            <h2 className="font-heading text-sm font-bold text-foreground sm:text-base">
              জমা দেওয়া মূল বিবরণ (Raw Narrative)
            </h2>
            <p className="text-xs text-muted-foreground">
              অভিযোগকারীর নিজস্ব শব্দে বিবরণ — কোনো এডিটিং ছাড়া
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 border border-destructive/40 bg-destructive/10 px-2 py-0.5 text-[11px] font-bold text-destructive">
            <EyeOff className="size-3" />
            <span>গোপনীয় · অভ্যন্তরীণ</span>
          </span>
        </div>
      </div>

      {/* Narrative Metadata Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-5 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>
            শব্দ: <strong className="text-foreground">{formatBnNumber(wordCount)}</strong>
          </span>
          <span>·</span>
          <span>
            অক্ষর: <strong className="text-foreground">{formatBnNumber(charCount)}</strong>
          </span>
        </div>
        <div>
          জমা: <strong className="text-foreground">{formatBnDateTime(report.submittedAt)}</strong>
        </div>
      </div>

      {/* Main Narrative with PII Highlight */}
      <div className="p-5 sm:p-6">
        <PiiHighlightedText text={report.rawNarrative} />
      </div>

      {/* Bottom Guideline Notice */}
      <div className="flex items-center gap-2 border-t border-border bg-background px-5 py-3 text-xs text-muted-foreground">
        <Info className="size-3.5 shrink-0 text-primary" />
        <span>
          পাবলিক পেজে প্রকাশের জন্য এই বয়ানটি ডানপাশের <strong>সিদ্ধান্ত ফর্মে</strong> সম্পাদনা ও নিরপেক্ষ করে প্রস্তুত করুন।
        </span>
      </div>
    </div>
  );
}
