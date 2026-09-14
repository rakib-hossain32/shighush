import { AlertTriangle, Lock, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { detectPii } from "@/lib/domain/pii";
import { formatBnNumber } from "@/lib/format";
import type { ModerationReport } from "@/services/_shared/types";

export function ReportPiiAlert({ report }: { report: ModerationReport }) {
  const findings = detectPii(report.rawNarrative);
  const accusedWithNames = (report.accused ?? []).filter(
    (a) => a.nameSubmitted && a.nameSubmitted !== "—"
  );

  const hasPiiFindings = findings.length > 0;
  const hasAccusedNames = accusedWithNames.length > 0;

  if (!hasPiiFindings && !hasAccusedNames) {
    return null;
  }

  return (
    <div className="border-2 border-destructive bg-destructive/10 p-4 shadow-[3px_3px_0_var(--foreground)] sm:p-5">
      <div className="flex items-start gap-3">
        <div className="grid size-9 shrink-0 place-items-center border-2 border-destructive bg-destructive text-destructive-foreground">
          <AlertTriangle className="size-5" />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-heading text-sm font-black text-destructive sm:text-base">
              গোপনীয়তা ও ব্যক্তিগত তথ্যের ঝুঁকি (PII / §৭ সতর্কতা)
            </h3>
            <span className="font-mono text-xs font-bold text-destructive">
              HUMAN AUDIT REQUIRED
            </span>
          </div>

          <p className="text-xs leading-relaxed text-foreground/90 sm:text-sm">
            এই নথিতে নাগরিকের ব্যক্তিগত বা সংবেদনশীল তথ্য শনাক্ত হয়েছে। প্রকাশের পূর্বে
            অবশ্যই বিবরণটি পরীক্ষা করুন এবং নীতি অনুযায়ী নাম বা তথ্য রিডাক্ট/আড়াল করুন।
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {hasPiiFindings && (
              <Badge
                className="gap-1 rounded-none border border-destructive bg-destructive/20 text-xs font-bold text-destructive"
                variant="outline"
              >
                <ShieldAlert className="size-3" />
                <span>{formatBnNumber(findings.length)}টি শনাক্তকারী ডেটা</span>
              </Badge>
            )}

            {hasAccusedNames && (
              <Badge
                className="gap-1 rounded-none border border-destructive bg-destructive/20 text-xs font-bold text-destructive"
                variant="outline"
              >
                <Lock className="size-3" />
                <span>
                  {formatBnNumber(accusedWithNames.length)} জন অভিযুক্তের ব্যক্তিগত নাম
                  জমা পড়েছে (§৭)
                </span>
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
