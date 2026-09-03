import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PageFrame } from "@/components/page-frame";
import { InstitutionInformationPanel } from "@/components/sections/institution-detail/institution-information-panel";
import { InstitutionMetrics } from "@/components/sections/institution-detail/institution-metrics";
import { InstitutionProfileHeader } from "@/components/sections/institution-detail/institution-profile-header";
import { InstitutionReportAnalysis } from "@/components/sections/institution-detail/institution-report-analysis";
import { InstitutionReportList } from "@/components/sections/institution-detail/institution-report-list";
import { INSTITUTION_CATEGORY_META } from "@/lib/domain/enums";
import { DISTRICT_BN } from "@/lib/domain/geo";
import { getInstitutionBySlug, getReports } from "@/services";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const response = await getInstitutionBySlug(slug);

  if (!response) {
    return createPageMetadata({
      title: "প্রতিষ্ঠান পাওয়া যায়নি",
      description: "অনুরোধ করা প্রতিষ্ঠানটি পাওয়া যায়নি।",
      path: `/institutions/${slug}`,
      index: false,
    });
  }

  const institution = response.data;

  return createPageMetadata({
    title: institution.nameBn,
    description: `${INSTITUTION_CATEGORY_META[institution.category].label} খাতের নাগরিক প্রতিবেদন, যাচাইয়ের অবস্থা ও জবাবদিহিতার রেকর্ড।`,
    path: `/institutions/${institution.slug}`,
  });
}

export default async function InstitutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const response = await getInstitutionBySlug(slug);
  if (!response) notFound();

  const institution = response.data;

  const reportsResponse = await getReports({ 
    institution: slug, 
    limit: 100 
  });
  const reports = reportsResponse.data;

  // Derived, not hardcoded: the previous version special-cased one slug to show "৳ ২,৫০০".
  const reportedAmount = reports.reduce(
    (sum, report) => sum + (report.money?.amount ?? 0),
    0,
  );
  const responses = reports
    .flatMap((report) => report.responses ?? [])
    .sort((a, b) => new Date(b.respondedAt).getTime() - new Date(a.respondedAt).getTime());

  return (
    <PageFrame
      copy="একটি প্রতিষ্ঠানের প্রকাশিত নাগরিক-রিপোর্ট, যাচাইয়ের অবস্থা ও জবাবদিহিতার রেকর্ড এক জায়গায় দেখুন।"
      eyebrow={`প্রতিষ্ঠান / ${INSTITUTION_CATEGORY_META[institution.category].label}`}
      title={`${institution.nameBn}, ${DISTRICT_BN}`}
    >
      <div className="space-y-6 sm:space-y-8">
        <InstitutionProfileHeader institution={institution} />

        {institution.metrics && (
          <InstitutionMetrics
            metrics={institution.metrics}
            reportedAmount={reportedAmount}
          />
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <InstitutionReportAnalysis metrics={institution.metrics} reports={reports} />
            <InstitutionReportList reports={reports} />
          </div>
          <InstitutionInformationPanel institution={institution} responses={responses} />
        </div>
      </div>
    </PageFrame>
  );
}
