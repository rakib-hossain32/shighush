import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { User } from "lucide-react";

import { AccessDenied } from "@/components/admin/access-denied";
import { AssignReportButton } from "@/components/admin/assign-report-button";
import { ModerationDecisionForm } from "@/components/admin/moderation-decision-form";
import {
  ReportContextGrid,
  ReportDetailHeader,
  ReportEvidenceSection,
  ReportModerationChecklist,
  ReportNotesTimeline,
  ReportPiiAlert,
  ReportRawNarrative,
} from "@/components/admin/reports/detail";
import { guard } from "@/lib/auth/dal";
import { can } from "@/lib/auth/permissions";
import { isReviewable } from "@/lib/domain/moderation";
import { formatCaseId } from "@/lib/format";
import { createPageMetadata } from "@/lib/seo";
import { getModerationReport, getUsers } from "@/services";

export function generateMetadata(): Metadata {
  return createPageMetadata({
    title: "নথি রিভিউ ও মডারেশন",
    description: "নাগরিক অভিযোগ মডারেশন রিভিউ ও প্রকাশের সিদ্ধান্ত প্যানেল।",
    index: false,
  });
}

export default async function ModerationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const access = await guard("report:review", `/admin/reports/${id}`);
  if (!access.allowed) {
    return (
      <AccessDenied capability={access.capability} role={access.session.role} />
    );
  }

  const canAssign = can(access.session.role, "user:write");
  const [response, moderatorsResponse] = await Promise.all([
    getModerationReport(id),
    canAssign ? getUsers({ role: "Moderator", limit: 100 }) : Promise.resolve(null),
  ]);

  if (!response?.data) notFound();

  const report = response.data;
  const canRemove = can(access.session.role, "report:remove");
  const isPublished = report.status === "published" || report.status === "resolved";
  const moderators = Array.isArray(moderatorsResponse?.data)
    ? moderatorsResponse.data.map((user) => ({ id: user.id, name: user.name }))
    : [];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Top Header Component */}
      <ReportDetailHeader isPublished={isPublished} report={report} />

      {/* 2. Main 2-Column Modular Layout */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        {/* Left Column: Report Dossier & Evidence */}
        <div className="space-y-6 min-w-0">
          {/* PII & Privacy Safeguard Alert Banner */}
          <ReportPiiAlert report={report} />

          {/* Raw Complainant Narrative with PII Highlight */}
          <ReportRawNarrative report={report} />

          {/* Incident & Institutional Metadata Grid */}
          <ReportContextGrid report={report} />

          {/* Attached Evidence & Files */}
          <ReportEvidenceSection report={report} />

          {/* Internal Notes & Lifecycle Timeline */}
          <ReportNotesTimeline report={report} />
        </div>

        {/* Right Column: Moderation Decision & Action Sidebar */}
        <div className="space-y-6 xl:sticky xl:top-6 xl:h-fit">
          {/* Assignment Card (Admin only) */}
          {canAssign && (
            <div className="border-2 border-foreground bg-card p-5 shadow-[3px_3px_0_var(--foreground)]">
              <div className="mb-4 flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center border border-foreground bg-primary/20 text-primary">
                  <User className="size-4 text-foreground" />
                </span>
                <div>
                  <h3 className="font-heading text-sm font-bold text-foreground">
                    রিভিউ দায়িত্ব বণ্টন
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    নথিটির দায়িত্ব নির্দিষ্ট মডারেটরের বরাদ্দে দিন
                  </p>
                </div>
              </div>
              <AssignReportButton
                assignedId={report.assignedTo?.id}
                moderators={moderators}
                reportId={report.id}
              />
            </div>
          )}

          {/* Quick SOP Checklist for Moderators */}
          <ReportModerationChecklist />

          {/* Moderation Decision Form */}
          <ModerationDecisionForm canRemove={canRemove} report={report} />

          {/* Notice for non-reviewable reports */}
          {!isReviewable(report) && !canRemove && (
            <div className="border-2 border-border bg-muted/40 p-5 shadow-[2px_2px_0_var(--foreground)]">
              <p className="text-sm font-bold text-foreground">
                এই নথির পর্যালোচনা সম্পন্ন।
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                নথিটি ইতোমধ্যে চূড়ান্ত বা প্রকাশিত অবস্থায় রয়েছে; মডারেটর স্তরে কোনো
                নতুন অ্যাকশন আবশ্যক নয়।
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
