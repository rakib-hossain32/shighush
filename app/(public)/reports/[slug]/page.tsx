import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, BadgeCheck, CalendarDays, Landmark, MapPin } from "lucide-react";

import { PageFrame } from "@/components/page-frame";
import { ReportDetailContent } from "@/components/sections/reports/report-detail-content";
import { ReportDetailSidebar } from "@/components/sections/reports/report-detail-sidebar";
import { ReportEvidenceGallery } from "@/components/sections/reports/report-evidence-gallery";
import { ReportTimeline } from "@/components/sections/reports/report-timeline";
import { MetaBadge, StatusBadge } from "@/components/ui/status-badge";
import { REPORT_CATEGORY_META, VERIFICATION_LEVEL_META } from "@/lib/domain/enums";
import { areaName } from "@/lib/domain/geo";
import { formatBnDate, formatCaseId } from "@/lib/format";
import { getReportBySlug } from "@/services";
import { createPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const response = await getReportBySlug(slug);
    const report = response?.data;

    if (!report) {
      return createPageMetadata({
        title: "নথি পাওয়া যায়নি",
        description: "অনুরোধ করা নাগরিক প্রতিবেদনটি পাওয়া যায়নি।",
        path: `/reports/${slug}`,
        index: false,
      });
    }

    return createPageMetadata({
      title: report.title,
      description: report.summary,
      path: `/reports/${report.slug}`,
    });
  } catch {
    return createPageMetadata({
      title: "নথি পাওয়া যায়নি",
      description: "অনুরোধ করা নাগরিক প্রতিবেদনটি পাওয়া যায়নি।",
      path: `/reports/${slug}`,
      index: false,
    });
  }
}

export default async function ReportDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let report = null;
  try {
    const response = await getReportBySlug(slug);
    report = response?.data ?? null;
  } catch {
    // Handled below with notFound()
  }

  if (!report) {
    notFound();
  }

  const verificationMeta =
    VERIFICATION_LEVEL_META[report.verificationLevel] ?? {
      label: "যাচাই প্রক্রিয়াধীন",
      short: "অযাচাইকৃত",
      tone: "muted" as const,
    };

  const categoryMeta =
    REPORT_CATEGORY_META[report.category] ?? {
      label: "অন্যান্য",
      short: "অন্যান্য",
      tone: "neutral" as const,
    };

  return (
    <PageFrame
      badgeText={verificationMeta.label}
      breadcrumbs={[
        { label: "অভিযোগের রেকর্ড", href: "/reports" },
        { label: formatCaseId(report.publicId) },
      ]}
      copy={`${report.institution?.nameBn || "শিবচর"} · ${areaName(report.location?.area)} · প্রকাশিত নাগরিক প্রতিবেদন`}
      eyebrow={`নথি নং / ${formatCaseId(report.publicId)}`}
      title={report.title}
    >
      <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-border pb-5 text-sm">
        <MetaBadge
          icon={<BadgeCheck />}
          meta={verificationMeta}
        />
        <StatusBadge icon={<Landmark />} tone={categoryMeta.tone}>
          {categoryMeta.label}
        </StatusBadge>
        {report.publishedAt && (
          <StatusBadge icon={<CalendarDays />} tone="neutral">
            {formatBnDate(report.publishedAt)}
          </StatusBadge>
        )}
        {report.location?.area && (
          <StatusBadge icon={<MapPin />} tone="neutral">
            {areaName(report.location.area)}
          </StatusBadge>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-8">
          <ReportDetailContent report={report} />
          <ReportEvidenceGallery report={report} />
          <ReportTimeline report={report} />
        </div>
        <ReportDetailSidebar report={report} />
      </div>

      <div className="mt-10 pt-6 border-t border-border/60">
        <Link
          className="inline-flex items-center gap-2 text-sm  text-muted-foreground hover:text-foreground transition-colors"
          href="/reports"
        >
          <ArrowLeft className="size-4" />
          সব নথিতে ফিরুন
        </Link>
      </div>
    </PageFrame>
  );
}
