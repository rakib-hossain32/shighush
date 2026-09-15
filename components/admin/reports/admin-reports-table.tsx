import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Coins,
  MapPin,
  ShieldCheck,
  UserCheck,
  UserX,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MetaBadge, StatusBadge } from "@/components/ui/status-badge";
import {
  REPORT_CATEGORY_META,
  REPORT_STATUS_META,
} from "@/lib/domain/enums";
import { areaName } from "@/lib/domain/geo";
import { officeNameBn } from "@/lib/domain/office-name";
import { formatBnNumber, formatBnRelative, formatCaseId } from "@/lib/format";
import type { ModerationReport } from "@/services";
import { AdminReportsEmptyState } from "./admin-reports-empty-state";

type AdminReportsTableProps = {
  reports: ModerationReport[];
  hasActiveFilters?: boolean;
};

export function AdminReportsTable({ reports, hasActiveFilters }: AdminReportsTableProps) {
  if (reports.length === 0) {
    return <AdminReportsEmptyState hasActiveFilters={hasActiveFilters} />;
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card List (Hidden on md and up) */}
      <div className="flex flex-col gap-3 md:hidden">
        {reports.map((report) => {
          const categoryMeta = REPORT_CATEGORY_META[report.category];
          const statusMeta = REPORT_STATUS_META[report.status];
          const institutionName =
            report.institution?.nameBn ||
            report.institutionName ||
            "প্রতিষ্ঠানের নাম জানা নেই";
          const institutionUnknown =
            report.institutionNameUnknown ||
            institutionName === "অজানা প্রতিষ্ঠান" ||
            institutionName === "প্রতিষ্ঠানের নাম জানা নেই";
          const officeName = officeNameBn(report.location?.officeName);
          const piiCount = report.piiFindings?.length || 0;
          const href = `/admin/reports/${report.id}`;

          return (
            <div
              key={report.id}
              className="border-2 border-border bg-card p-4 shadow-[2px_2px_0_var(--foreground)] transition-all hover:border-foreground"
            >
              <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
                <span className="border-2 border-primary/40 bg-primary/10 px-2 py-0.5  text-xs font-bold text-primary">
                  {formatCaseId(report.publicId)}
                </span>
                {statusMeta && <MetaBadge meta={statusMeta} short size="sm" />}
              </div>

              <div className="mt-2.5">
                <h3 className="font-heading text-sm font-bold text-foreground">
                  {report.title || "শিরোনাম উল্লেখ করা হয়নি"}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  <span className={institutionUnknown ? "font-semibold text-amber-700 dark:text-amber-300" : ""}>
                    {institutionName}
                  </span>
                  {officeName && <span> · শাখা: {officeName}</span>}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/40 pt-2.5 text-xs text-muted-foreground">
                {categoryMeta && <MetaBadge meta={categoryMeta} short size="sm" />}

                {report.location?.area && report.location.area !== "unknown" && (
                  <span className="inline-flex items-center gap-1 text-[11px]">
                    <MapPin className="size-3 text-primary" />
                    <span>{areaName(report.location.area)}</span>
                  </span>
                )}

                {report.money?.amount !== undefined && report.money?.amount !== null && (
                  <span className="inline-flex items-center gap-1 font-semibold text-destructive">
                    <Coins className="size-3" />৳{formatBnNumber(report.money.amount)}
                  </span>
                )}

                {piiCount > 0 ? (
                  <span className="inline-flex items-center gap-1 border border-destructive/50 bg-destructive/10 px-1.5 py-0.5 text-[11px] font-bold text-destructive">
                    <AlertTriangle className="size-3" />
                    PII ঝুঁকি ({formatBnNumber(piiCount)})
                  </span>
                ) : null}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2 text-xs">
                <span className="text-[11px] text-muted-foreground">
                  {formatBnRelative(report.submittedAt)}
                </span>

                <Link
                  href={href}
                  className="inline-flex items-center gap-1 border-2 border-foreground bg-primary px-3 py-1 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                >
                  <span>রিভিউ</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Data Table (Hidden on sm and down) */}
      <div className="hidden overflow-x-auto border-2 border-border bg-card shadow-[3px_3px_0_var(--foreground)] md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 border-border bg-muted/40 hover:bg-muted/40">
              <TableHead className="py-3 pl-4 font-bold text-foreground">শিরোনাম ও প্রতিষ্ঠান</TableHead>
              <TableHead className="py-3 font-bold text-foreground">প্রশাসনিক এলাকা</TableHead>
              <TableHead className="py-3 font-bold text-foreground">ধরন</TableHead>
              <TableHead className="py-3 font-bold text-foreground">গোপনীয়তা (PII)</TableHead>
              <TableHead className="py-3 font-bold text-foreground">অর্থ</TableHead>
              <TableHead className="py-3 font-bold text-foreground">দায়িত্বে</TableHead>
              <TableHead className="py-3 text-right font-bold text-foreground">জমা</TableHead>
              <TableHead className="py-3 text-right font-bold text-foreground">অবস্থা</TableHead>
              <TableHead className="py-3 pr-4 text-right font-bold text-foreground">একশন</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {reports.map((report) => {
              const categoryMeta = REPORT_CATEGORY_META[report.category];
              const statusMeta = REPORT_STATUS_META[report.status];
              const institutionName =
                report.institution?.nameBn ||
                report.institutionName ||
                "প্রতিষ্ঠানের নাম জানা নেই";
              const institutionUnknown =
                report.institutionNameUnknown ||
                institutionName === "অজানা প্রতিষ্ঠান" ||
                institutionName === "প্রতিষ্ঠানের নাম জানা নেই";
              const officeName = officeNameBn(report.location?.officeName);
              const piiCount = report.piiFindings?.length || 0;
              const piiList = report.piiFindings || [];
              const href = `/admin/reports/${report.id}`;

              return (
                <TableRow
                  key={report.id}
                  className="group transition-colors hover:bg-primary/5"
                >
                  {/* Title & Case / Institution */}
                  <TableCell className="py-3 pl-4 align-top">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="border border-primary/40 bg-primary/10 px-1.5 py-0.5  text-[11px] font-bold text-primary">
                          {formatCaseId(report.publicId)}
                        </span>
                        <Link
                          href={href}
                          className="font-heading text-sm font-bold text-foreground transition-colors group-hover:text-primary hover:underline"
                        >
                          {report.title || "শিরোনাম উল্লেখ করা হয়নি"}
                        </Link>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
                        <span
                          className={
                            institutionUnknown
                              ? "font-semibold text-amber-700 dark:text-amber-300"
                              : ""
                          }
                        >
                          {institutionName}
                        </span>
                        {officeName && (
                          <>
                            <span>·</span>
                            <span>শাখা: {officeName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Administrative Area */}
                  <TableCell className="py-3 align-top">
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0 text-primary" />
                      <span className="truncate max-w-28">
                        {report.location?.area && report.location.area !== "unknown"
                          ? areaName(report.location.area)
                          : "উল্লেখ নেই"}
                      </span>
                    </span>
                  </TableCell>

                  {/* Category */}
                  <TableCell className="py-3 align-top">
                    {categoryMeta ? (
                      <MetaBadge meta={categoryMeta} short size="sm" />
                    ) : (
                      <span className="text-xs text-muted-foreground">{report.category}</span>
                    )}
                  </TableCell>

                  {/* Privacy / PII Findings */}
                  <TableCell className="py-3 align-top">
                    {piiCount > 0 ? (
                      <StatusBadge icon={<AlertTriangle className="size-3" />} size="sm" tone="danger">
                        {piiList.length > 1 ? `${piiList[0]} +${piiList.length - 1}` : piiList[0]}
                      </StatusBadge>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground/80">
                        <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        ঝুঁকি নেই
                      </span>
                    )}
                  </TableCell>

                  {/* Money / Bribe */}
                  <TableCell className="py-3 align-top">
                    {report.money?.amount !== undefined && report.money?.amount !== null ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-destructive">
                        <Coins className="size-3.5" />৳{formatBnNumber(report.money.amount)}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* Assigned Moderator */}
                  <TableCell className="py-3 align-top">
                    {report.assignedTo ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
                        <UserCheck className="size-3 text-emerald-600" />
                        {report.assignedTo.name}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                        <UserX className="size-3" />
                        দায়িত্বহীন
                      </span>
                    )}
                  </TableCell>

                  {/* Submitted Time */}
                  <TableCell className="py-3 text-right text-xs text-muted-foreground align-top">
                    {formatBnRelative(report.submittedAt)}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3 text-right align-top">
                    {statusMeta ? (
                      <MetaBadge meta={statusMeta} short size="sm" />
                    ) : (
                      <span className="text-xs text-muted-foreground">{report.status}</span>
                    )}
                  </TableCell>

                  {/* Review Action */}
                  <TableCell className="py-3 pr-4 text-right align-top">
                    <Link
                      href={href}
                      className="inline-flex items-center gap-1 border-2 border-foreground bg-card px-2.5 py-1 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:bg-primary hover:text-foreground hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                    >
                      <span>রিভিউ</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
