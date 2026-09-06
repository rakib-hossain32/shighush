import Link from "next/link";
import { AlertTriangleIcon, ArrowRightIcon, InboxIcon } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatCards } from "@/components/admin/admin-stat-cards";
import { CellStack, DataTable, type Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { MetaBadge, StatusBadge } from "@/components/ui/status-badge";
import { requireSession } from "@/lib/auth/dal";
import { can } from "@/lib/auth/permissions";
import { REPORT_CATEGORY_META, REPORT_STATUS_META } from "@/lib/domain/enums";
import { areaName } from "@/lib/domain/geo";
import { formatBnRelative, formatCaseId } from "@/lib/format";
import { getDashboardStats, getModerationQueue, type ModerationReport, type OverviewMetric } from "@/services";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "সারসংক্ষেপ",
  description: "মডারেশন কিউ ও প্ল্যাটফর্মের অবস্থা।",
  index: false,
});

export default async function AdminOverviewPage() {
  const session = await requireSession("/admin");
  
  const statsResponse = await getDashboardStats();
  const rawMetrics = statsResponse.data.metrics;
  
  // Safely handle piiAlerts - ensure it's an array
  const piiAlertsData = statsResponse.data.piiAlerts;
  const piiAlertsArray = Array.isArray(piiAlertsData) ? piiAlertsData : [];
  const piiAlertsCount = piiAlertsArray.length;

  // Debug: Log first item structure if available
  if (piiAlertsArray.length > 0 && process.env.NODE_ENV === 'development') {
    console.log('[DEBUG] First PII Alert:', JSON.stringify(piiAlertsArray[0], null, 2));
  }

  // Transform DashboardMetric[] to OverviewMetric[]
  const metrics: OverviewMetric[] = rawMetrics.map((metric) => ({
    ...metric,
    delta: null, // No historical data available yet
    lowerIsBetter: metric.key === "pending" || metric.key === "pii_alerts",
    footnote: "গত ৩০ দিন",
    href: 
      metric.key === "pending" 
        ? "/admin/reports?status=submitted,under_review"
        : metric.key === "pii_alerts"
        ? "/admin/reports?hasPii=true"
        : undefined,
  }));

  const queueResponse = await getModerationQueue({
    limit: 5,
    status: ["submitted", "under_review"],
  });
  // Safely handle queue response - ensure data is an array
  const awaitingReview = Array.isArray(queueResponse.data) ? queueResponse.data : [];

  // Debug: Log first item structure if available
  if (awaitingReview.length > 0 && process.env.NODE_ENV === 'development') {
    console.log('[DEBUG] First Queue Item:', JSON.stringify(awaitingReview[0], null, 2));
  }

  // Use PII alerts from dashboard stats (already contains reports with PII findings)
  const piiAlerts = piiAlertsArray.slice(0, 10);

  const mayReview = can(session.role, "report:review");

  const queueColumns: Array<Column<ModerationReport>> = [
    {
      key: "case",
      header: "নথি",
      primary: true,
      cell: (report) => {
        const institutionName = report.institution?.nameBn || report.institutionName || 'অজানা প্রতিষ্ঠান';
        const area = report.location?.area || '';
        const subtitle = area ? `${institutionName} · ${areaName(area)}` : institutionName;
        
        return (
          <CellStack
            subtitle={subtitle}
            title={report.title || formatCaseId(report.publicId)}
          />
        );
      },
    },
    {
      key: "category",
      header: "ধরন",
      hideBelow: "md",
      cell: (report) => {
        const categoryMeta = REPORT_CATEGORY_META[report.category];
        return categoryMeta ? (
          <MetaBadge meta={categoryMeta} short size="sm" />
        ) : (
          <span className="text-xs text-muted-foreground">{report.category}</span>
        );
      },
    },
    {
      key: "pii",
      header: "গোপনীয়তা",
      hideBelow: "lg",
      cell: (report) => {
        const piiCount = report.piiFindings?.length || 0;
        return piiCount > 0 ? (
          <StatusBadge icon={<AlertTriangleIcon />} size="sm" tone="danger">
            {piiCount}টি সতর্কতা
          </StatusBadge>
        ) : (
          <span className="text-xs text-muted-foreground">পরিষ্কার</span>
        );
      },
    },
    {
      key: "age",
      header: "জমা",
      align: "end",
      hideBelow: "sm",
      cell: (report) => (
        <span className="text-xs text-muted-foreground">
          {formatBnRelative(report.submittedAt)}
        </span>
      ),
    },
    {
      key: "status",
      header: "অবস্থা",
      align: "end",
      cell: (report) => {
        const statusMeta = REPORT_STATUS_META[report.status];
        return statusMeta ? (
          <MetaBadge meta={statusMeta} short size="sm" />
        ) : (
          <span className="text-xs text-muted-foreground">{report.status}</span>
        );
      },
    },
  ];

  return (
    <>
      <AdminPageHeader
        actions={
          mayReview && (
            <Button
              nativeButton={false}
              render={
                <Link href="/admin/reports?status=submitted,under_review,needs_info" />
              }
            >
              <InboxIcon />
              রিভিউ কিউ খুলুন
            </Button>
          )
        }
        description="কিউয়ের অবস্থা, গোপনীয়তা সতর্কতা এবং সাম্প্রতিক কার্যক্রম এক জায়গায়।"
        title="সারসংক্ষেপ"
      />

      <AdminStatCards metrics={metrics} />

      {mayReview && (
        <>
          <section className="grid gap-3">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">রিভিউয়ের অপেক্ষায়</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  সবচেয়ে নতুন পাঁচটি। প্রকাশের আগে ব্যক্তিগত তথ্য সরানো বাধ্যতামূলক।
                </p>
              </div>
              <Link
                className="inline-flex shrink-0 items-center gap-1 text-sm font-bold underline"
                href="/admin/reports?status=submitted,under_review,needs_info"
              >
                সব দেখুন <ArrowRightIcon className="size-4" />
              </Link>
            </div>

            <DataTable
              columns={queueColumns}
              empty={{
                title: "কিউ খালি",
                description: "এই মুহূর্তে কোনো নথি রিভিউয়ের অপেক্ষায় নেই।",
              }}
              rowHref={(report) => `/admin/reports/${report.id}`}
              rowKey={(report) => report.id}
              rows={awaitingReview}
            />
          </section>

          {piiAlerts.length > 0 && (
            <section className="grid gap-3">
              <div className="flex items-start gap-3 border-l-4 border-destructive bg-destructive/5 p-4">
                <AlertTriangleIcon className="mt-0.5 size-5 shrink-0 text-destructive" />
                <div>
                  <h2 className="font-bold">গোপনীয়তা সতর্কতা</h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    এই নথিগুলোর জমা দেওয়া বিবরণে মোবাইল নম্বর, NID বা অন্য শনাক্তকারী তথ্য
                    পাওয়া গেছে। স্বয়ংক্রিয় সরানো হয় না — মডারেটরকেই সিদ্ধান্ত নিতে হবে।
                  </p>
                </div>
              </div>

              <DataTable
                columns={queueColumns}
                empty={{ title: "কোনো সতর্কতা নেই" }}
                rowHref={(report) => `/admin/reports/${report.id}`}
                rowKey={(report) => report.id}
                rows={piiAlerts}
              />
            </section>
          )}
        </>
      )}
    </>
  );
}
