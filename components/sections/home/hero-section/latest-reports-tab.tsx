import { CheckCircle2, Building2, MapPin, Clock, FileText } from "lucide-react";
import type { PublicReport } from "@/services/_shared/types";
import { REPORT_CATEGORY_META } from "@/lib/domain/enums";

interface LatestReportsTabProps {
  reports: PublicReport[];
  selectedIndex: number;
  onSelectReport: (index: number) => void;
}

export function LatestReportsTab({
  reports,
  selectedIndex,
  onSelectReport,
}: LatestReportsTabProps) {
  const activeReport = reports[selectedIndex];

  return (
    <div className="grid items-start gap-6 lg:grid-cols-12">
      {/* Featured Report */}
      <div className="flex flex-col gap-4 lg:col-span-7">
        {activeReport ? (
          <div className="rounded-xl border-2 border-foreground bg-card p-5 shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all">
            <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary bg-secondary/20 px-2.5 py-0.5 text-[11px] font-extrabold text-foreground">
                  <span className="size-1.5 animate-pulse rounded-full bg-secondary" />
                  {
                    REPORT_CATEGORY_META[
                      activeReport.category as keyof typeof REPORT_CATEGORY_META
                    ]?.short
                  }
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-muted-foreground">
                শি-{String(activeReport.publicId).padStart(4, "০")}
              </span>
            </div>

            <h3 className="mt-3 text-lg font-black leading-snug">
              {activeReport.title || activeReport.summary}
            </h3>

            <div className="mt-3 grid gap-2 text-xs font-bold text-muted-foreground sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-md bg-muted p-2">
                <Building2 className="size-4 shrink-0 text-primary" />
                <span className="truncate">{activeReport.institution.nameBn}</span>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-muted p-2">
                <MapPin className="size-4 shrink-0 text-secondary" />
                <span className="truncate">
                  {activeReport.location.area || "শিবচর"}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded border border-secondary bg-secondary/20 px-2.5 py-1 font-bold text-foreground">
                  <CheckCircle2 className="size-3.5 text-secondary" />
                  {activeReport.evidence?.length || 0} টি প্রমাণ
                </span>
              </div>
              <span className="flex items-center gap-1 font-medium text-muted-foreground">
                <Clock className="size-3" />
                {new Date(activeReport.publishedAt).toLocaleDateString("bn-BD")}
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border-2 border-border bg-card p-8 text-center">
            <FileText className="mx-auto size-12 text-muted-foreground" />
            <p className="mt-4 font-bold text-muted-foreground">
              এখনো কোনো রিপোর্ট নেই
            </p>
          </div>
        )}
      </div>

      {/* Report List */}
      <div className="flex flex-col gap-2 lg:col-span-5">
        <div className="flex items-center justify-between px-1 pb-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            সর্বশেষ ভেরিফাইড ফিড
          </span>
          <span className="rounded border border-secondary bg-secondary/20 px-2 py-0.5 font-mono text-[10px] font-bold text-foreground">
            লাইভ সিঙ্ক
          </span>
        </div>

        {reports.length > 0 ? (
          reports.map((report, idx) => (
            <button
              key={report.id}
              onClick={() => onSelectReport(idx)}
              className={`group rounded-lg border-2 p-3 text-left text-xs transition-all ${
                selectedIndex === idx
                  ? "border-foreground bg-card shadow-[3px_3px_0_0_hsl(var(--foreground))]"
                  : "border-border bg-card/60 hover:border-muted-foreground hover:bg-card"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-extrabold">
                  শি-{String(report.publicId).padStart(4, "০")}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(report.publishedAt).toLocaleDateString("bn-BD", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="mt-1 line-clamp-1 font-bold group-hover:text-primary">
                {report.title || report.summary}
              </p>
            </button>
          ))
        ) : (
          <div className="rounded-lg border-2 border-border bg-card p-6 text-center text-xs text-muted-foreground">
            কোনো রিপোর্ট পাওয়া যায়নি
          </div>
        )}
      </div>
    </div>
  );
}
