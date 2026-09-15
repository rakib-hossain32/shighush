import { Clock, FileText, ScanSearch, ShieldAlert } from "lucide-react";
import { formatBnNumber } from "@/lib/format";
import type { Appeal } from "@/services";

export function AppealStats({ appeals, total }: { appeals: Appeal[]; total: number }) {
  const metrics = [
    { label: "মোট আপিল", value: total, icon: FileText },
    { label: "নতুন আবেদন", value: appeals.filter((a) => a.status === "received").length, icon: Clock },
    { label: "পর্যালোচনায়", value: appeals.filter((a) => a.status === "in_review").length, icon: ScanSearch },
    { label: "জরুরি গোপনীয়তা", value: appeals.filter((a) => a.reason === "privacy_risk" && (a.status === "received" || a.status === "in_review")).length, icon: ShieldAlert, danger: true },
  ];
  return <div className="grid border-2 border-border bg-card shadow-[3px_3px_0_var(--foreground)] sm:grid-cols-2 lg:grid-cols-4">
    {metrics.map(({ label, value, icon: Icon, danger }) => <div key={label} className="flex items-center justify-between gap-3 border-b border-border p-4 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
      <div><p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p><p className={danger && value > 0 ? "mt-1 font-heading text-2xl font-black text-destructive" : "mt-1 font-heading text-2xl font-black"}>{formatBnNumber(value)}</p></div>
      <span className={danger && value > 0 ? "grid size-9 place-items-center border-2 border-destructive bg-destructive/10 text-destructive" : "grid size-9 place-items-center border-2 border-border bg-muted/50"}><Icon className="size-4" /></span>
    </div>)}
  </div>;
}
