import { AlertTriangle, CheckCircle2, Clock, FileText, UserCheck, UserX } from "lucide-react";
import { formatBnNumber } from "@/lib/format";
import type { ModerationReport } from "@/services";

type AdminReportsStatsProps = {
  total: number;
  reports: ModerationReport[];
  effectiveView?: "all" | "active" | "completed";
};

export function AdminReportsStats({ total, reports, effectiveView }: AdminReportsStatsProps) {
  const piiCount = reports.filter((r) => r.piiFindings && r.piiFindings.length > 0).length;
  const assignedCount = reports.filter((r) => Boolean(r.assignedTo)).length;
  const unassignedCount = reports.filter((r) => !r.assignedTo).length;

  const viewLabel =
    effectiveView === "completed"
      ? "সম্পন্ন ও প্রকাশিত"
      : effectiveView === "active"
        ? "চলমান কিউ"
        : "সব নথি";

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {/* Total Filtered */}
      <div className="relative rounded-none border-2 border-border bg-card p-4 shadow-[2px_2px_0_var(--foreground)] transition-all">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-bold tracking-tight">মোট ফলাফল ({viewLabel})</span>
          <FileText className="size-4 text-primary" />
        </div>
        <p className="mt-2 text-2xl font-bold font-heading tabular-nums text-foreground">
          {formatBnNumber(total)}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          বর্তমান ফিল্টার অনুযায়ী প্রাপ্ত
        </p>
      </div>

      {/* PII Alert Count */}
      <div
        className={`relative rounded-none border-2 bg-card p-4 shadow-[2px_2px_0_var(--foreground)] transition-all ${
          piiCount > 0 ? "border-destructive/60 bg-destructive/5" : "border-border"
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-bold tracking-tight ${
              piiCount > 0 ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            ব্যক্তিগত তথ্যের ঝুঁকি (PII)
          </span>
          <AlertTriangle
            className={`size-4 ${piiCount > 0 ? "text-destructive" : "text-muted-foreground"}`}
          />
        </div>
        <p
          className={`mt-2 text-2xl font-bold font-heading tabular-nums ${
            piiCount > 0 ? "text-destructive" : "text-foreground"
          }`}
        >
          {formatBnNumber(piiCount)}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          এই পাতার নথিতে সনাক্ত সতর্কতা
        </p>
      </div>

      {/* Assigned Count */}
      <div className="relative rounded-none border-2 border-border bg-card p-4 shadow-[2px_2px_0_var(--foreground)] transition-all">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-bold tracking-tight">দায়িত্বপ্রাপ্ত নথি</span>
          <UserCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <p className="mt-2 text-2xl font-bold font-heading tabular-nums text-foreground">
          {formatBnNumber(assignedCount)}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          মডারেটরদের গ্রহণকৃত কেস
        </p>
      </div>

      {/* Unassigned Count */}
      <div
        className={`relative rounded-none border-2 bg-card p-4 shadow-[2px_2px_0_var(--foreground)] transition-all ${
          unassignedCount > 0 ? "border-amber-500/50 bg-amber-500/5" : "border-border"
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-bold tracking-tight ${
              unassignedCount > 0 ? "text-amber-700 dark:text-amber-300" : "text-muted-foreground"
            }`}
          >
            দায়িত্বহীন কিউ
          </span>
          <UserX
            className={`size-4 ${
              unassignedCount > 0 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
            }`}
          />
        </div>
        <p
          className={`mt-2 text-2xl font-bold font-heading tabular-nums ${
            unassignedCount > 0 ? "text-amber-700 dark:text-amber-300" : "text-foreground"
          }`}
        >
          {formatBnNumber(unassignedCount)}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          রিভিউ করার জন্য উন্মুক্ত
        </p>
      </div>
    </div>
  );
}
