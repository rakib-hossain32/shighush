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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const response = await getReportBySlug(slug);
    const report = response.data;

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

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  try {
    const response = await getReportBySlug(slug);
    const report = response.data;

    return (
      <PageFrame
        copy={`${report.institution.nameBn} · ${areaName(report.location.area)} · প্রকাশিত নাগরিক প্রতিবেদন`}
      eyebrow={`নথি / ${formatCaseId(report.publicId)}`}
      title={report.title}
    >
      <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-border pb-5 text-sm">
        <MetaBadge
          icon={<BadgeCheck />}
          meta={VERIFICATION_LEVEL_META[report.verificationLevel]}
        />
        <StatusBadge icon={<Landmark />} tone="neutral">
          {REPORT_CATEGORY_META[report.category].label}
        </StatusBadge>
        <StatusBadge icon={<CalendarDays />} tone="neutral">
          {formatBnDate(report.publishedAt)}
        </StatusBadge>
        <StatusBadge icon={<MapPin />} tone="neutral">
          {areaName(report.location.area)}
        </StatusBadge>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="grid gap-8">
          <ReportDetailContent report={report} />
          <ReportEvidenceGallery report={report} />
          <ReportTimeline report={report} />
        </div>
        <ReportDetailSidebar report={report} />
      </div>

      <Link
        className="mt-10 inline-flex items-center gap-2 text-sm font-bold underline"
        href="/reports"
      >
        <ArrowLeft className="size-4" />
        সব নথিতে ফিরুন
      </Link>
    </PageFrame>
  );
  } catch {
    notFound();
  }
}
