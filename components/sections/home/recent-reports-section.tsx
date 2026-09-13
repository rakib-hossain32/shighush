import Link from "next/link";
import { ArrowUpRight, FileText, MapPin, Building2, Calendar, ShieldAlert } from "lucide-react";
import { getReports } from "@/services";
import { REPORT_STATUS_META } from "@/lib/domain/enums";
import type { PublicReport } from "@/services/_shared/types";
import { formatCaseId, formatBnDate } from "@/lib/format";
import { SectionHeader } from "./section-header";

export async function RecentReportsSection() {
  let reports: PublicReport[] = [];

  try {
    const response = await getReports({
      limit: 3,
    });
    reports = response.data || [];
  } catch (error) {
    console.error("Failed to fetch recent reports:", error);
  }

  return (
    <section className="relative border-b-2 border-border bg-card/40 py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Reusable Section Header */}
        <SectionHeader
          badgeIcon={FileText}
          badgeText="০৪ — নাগরিক রেকর্ড / সাম্প্রতিক প্রকাশনা"
          title="সর্বশেষ প্রকাশিত নথি।"
          description="যাচাই ও রিভিউ প্রক্রিয়া শেষে প্রকাশিত শিবচরের জনসেবামূলক অভিযোগের হালনাগাদ রেকর্ড।"
          action={{
            href: "/reports",
            label: "সকল প্রকাশিত নথি দেখুন",
          }}
          borderBottom
        />

        {/* Reports List */}
        {reports.length > 0 ? (
          <div className="divide-y divide-border">
            {reports.map((report) => {
              const statusMeta = REPORT_STATUS_META[report.status];
              const statusLabel = statusMeta?.label || report.status;
              const title = report.title || report.summary || "নাগরিক নথি";
              const areaName = report.location?.area || "শিবচর সদর";
              const institutionName = report.institution?.nameBn || "সংশ্লিষ্ট দপ্তর";
              const formattedId = formatCaseId(report.publicId);
              const formattedDate = report.publishedAt || report.updatedAt
                ? formatBnDate(report.publishedAt || report.updatedAt)
                : "সম্প্রতি";

              return (
                <article
                  key={report.id}
                  className="group relative flex flex-col justify-between gap-3 py-5 transition-colors hover:bg-background/80 sm:flex-row sm:items-center sm:py-7 sm:px-3"
                >
                  {/* Left Column: ID & Core Details */}
                  <div className="flex flex-col gap-1.5 sm:gap-2 sm:max-w-2xl lg:max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className=" text-[11px] sm:text-xs font-bold tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-0.5">
                        {formattedId}
                      </span>
                      <span className="rounded-none bg-muted px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-foreground">
                        {statusLabel}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-muted-foreground">
                        <Calendar className="size-3" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>

                    <Link
                      href={`/reports/${report.id}`}
                      className="text-base font-bold text-foreground transition-colors group-hover:text-primary sm:text-xl"
                    >
                      {title}
                    </Link>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <Building2 className="size-3.5 text-foreground/70" />
                        {institutionName}
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1 font-medium">
                        <MapPin className="size-3.5 text-foreground/70" />
                        {areaName}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: View Case CTA */}
                  <div className="shrink-0 self-start sm:self-center">
                    <Link
                      href={`/reports/${report.id}`}
                      className="inline-flex items-center gap-1.5 border border-border bg-background px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-foreground transition-all group-hover:border-foreground group-hover:shadow-[2px_2px_0_var(--foreground)]"
                    >
                      <span>নথি পড়ুন</span>
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="my-8 border-2 border-dashed border-border bg-background p-8 text-center">
            <ShieldAlert className="mx-auto size-8 text-muted-foreground" />
            <h3 className="mt-3 text-sm sm:text-base font-bold text-foreground">
              এখনো কোনো নথি প্রকাশিত হয়নি
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              আপনার অভিযোগ জমা দিয়ে শিবচরে প্রথম নাগরিক নথি তৈরি করতে পারেন।
            </p>
            <Link
              href="/report/new"
              className="mt-4 inline-flex items-center gap-2 bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-[2px_2px_0_var(--foreground)]"
            >
              অভিযোগ জানান
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
