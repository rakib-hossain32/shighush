import Link from "next/link";
import { ArrowUpRight, CalendarDays, FileWarning } from "lucide-react";

import { MetaBadge, StatusBadge } from "@/components/ui/status-badge";
import { REPORT_CATEGORY_META, VERIFICATION_LEVEL_META } from "@/lib/domain/enums";
import { formatBnCount, formatBnDate, formatCaseId } from "@/lib/format";
import type { PublicReport } from "@/services/_shared/types";

export function InstitutionReportList({ reports }: { reports: PublicReport[] }) {
  return (
    <section className="border border-border bg-card p-5 sm:p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            নথিভুক্ত রিপোর্ট
          </p>
          <h2 className="mt-2 text-xl font-bold">সাম্প্রতিক প্রকাশনা</h2>
        </div>
        <span className="text-sm font-bold text-muted-foreground">
          {formatBnCount(reports.length)} পাওয়া গেছে
        </span>
      </div>

      {reports.length > 0 ? (
        <div className="mt-5 divide-y divide-border border-y border-border">
          {reports.map((report) => (
            <article className="py-5" key={report.id}>
              <div className="flex flex-wrap items-center gap-2">
                <MetaBadge meta={VERIFICATION_LEVEL_META[report.verificationLevel]} />
                <StatusBadge tone="neutral">
                  {REPORT_CATEGORY_META[report.category].label}
                </StatusBadge>
                <span className=" text-[11px] font-bold text-muted-foreground">
                  {formatCaseId(report.publicId)}
                </span>
              </div>

              <Link
                className="mt-3 block text-lg font-bold leading-7 transition-colors hover:text-primary"
                href={`/reports/${report.slug}`}
              >
                {report.title}
              </Link>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">{report.summary}</p>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="size-3.5 text-primary" />
                  {formatBnDate(report.publishedAt)}
                </span>
                <Link
                  className="inline-flex items-center gap-1 font-bold text-foreground underline underline-offset-4"
                  href={`/reports/${report.slug}`}
                >
                  রিপোর্ট পড়ুন <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-border p-5">
          <FileWarning className="size-5 text-primary" />
          <p className="mt-3 font-bold">এখনো কোনো প্রকাশিত রিপোর্ট নেই</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            আপনার জানা নির্দিষ্ট ঘটনা থাকলে পরিচয় গোপন রেখে নথিভুক্ত করতে পারেন।
          </p>
          <Link
            className="mt-4 inline-flex items-center gap-1 text-sm font-bold underline underline-offset-4"
            href="/report/new"
          >
            রিপোর্ট নথিভুক্ত করুন <ArrowUpRight className="size-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
