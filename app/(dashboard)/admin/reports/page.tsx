import { AlertTriangleIcon } from "lucide-react";

import { AccessDenied } from "@/components/admin/access-denied";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CellStack, DataTable, type Column } from "@/components/admin/data-table";
import { QueueFilterBar } from "@/components/admin/queue-filter-bar";
import { Pagination } from "@/components/pagination";
import { MetaBadge, StatusBadge } from "@/components/ui/status-badge";
import { guard } from "@/lib/auth/dal";
import { REPORT_CATEGORY_META, REPORT_STATUS_META, type ReportCategory, type ReportStatus } from "@/lib/domain/enums";
import { areaName } from "@/lib/domain/geo";
import { moderationQueueSchema, parseFilters } from "@/lib/domain/schemas";
import { formatBnRelative, formatCaseId } from "@/lib/format";
import { getModerationQueue, type ModerationReport } from "@/services";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "নথি ব্যবস্থাপনা",
  description: "মডারেশন কিউ ও প্রকাশিত নথির তালিকা।",
  index: false,
});

type QueuePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminReportsPage({ searchParams }: QueuePageProps) {
  const access = await guard("report:review", "/admin/reports");
  if (!access.allowed) {
    return <AccessDenied capability={access.capability} role={access.session.role} />;
  }

  const raw = await searchParams;
  const filters = parseFilters(moderationQueueSchema, raw);

  const response = await getModerationQueue({
    page: filters.page,
    limit: filters.limit,
    search: filters.search,
    status: filters.status as readonly ReportStatus[],
    category: filters.category as readonly ReportCategory[],
    area: filters.area,
    flaggedOnly: filters.flaggedOnly,
    sort: filters.sort,
  });

  const reports = response.data;
  const meta = response.meta;

  const columns: Array<Column<ModerationReport>> = [
    {
      key: "case",
      header: "নথি",
      primary: true,
      cell: (report) => (
        <CellStack
          subtitle={`${formatCaseId(report.publicId)} · ${report.institution.nameBn}`}
          title={report.title || "শিরোনাম এখনো লেখা হয়নি"}
        />
      ),
    },
    {
      key: "area",
      header: "এলাকা",
      hideBelow: "lg",
      cell: (report) => (
        <span className="text-sm text-muted-foreground">
          {areaName(report.location.area)}
        </span>
      ),
    },
    {
      key: "category",
      header: "ধরন",
      hideBelow: "md",
      cell: (report) => (
        <MetaBadge meta={REPORT_CATEGORY_META[report.category]} short size="sm" />
      ),
    },
    {
      key: "pii",
      header: "গোপনীয়তা",
      hideBelow: "lg",
      cell: (report) =>
        report.piiFindings.length > 0 ? (
          <StatusBadge icon={<AlertTriangleIcon />} size="sm" tone="danger">
            {report.piiFindings.join(", ")}
          </StatusBadge>
        ) : (
          <span className="text-xs text-muted-foreground">পরিষ্কার</span>
        ),
    },
    {
      key: "assigned",
      header: "দায়িত্বে",
      hideBelow: "xl",
      cell: (report) =>
        report.assignedTo ? (
          <span className="text-sm">{report.assignedTo.name}</span>
        ) : (
          <span className="text-xs text-muted-foreground">কেউ নেয়নি</span>
        ),
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
      cell: (report) => <MetaBadge meta={REPORT_STATUS_META[report.status]} short size="sm" />,
    },
  ];

  return (
    <>
      <AdminPageHeader
        description="জমা হওয়া ও প্রকাশিত সব নাগরিক প্রতিবেদন। প্রকাশের আগে ব্যক্তিগত তথ্য সরানো বাধ্যতামূলক।"
        title="নথি ব্যবস্থাপনা"
      >
        <QueueFilterBar filters={filters} total={meta.total} />
      </AdminPageHeader>

      <DataTable
        columns={columns}
        empty={{
          title: "এই ফিল্টারে কোনো নথি নেই",
          description:
            "ফিল্টার বদলে দেখুন, অথবা রিসেট করে সম্পূর্ণ তালিকা দেখুন। কিউ খালি থাকাও একটি ভালো খবর।",
        }}
        rowHref={(report) => `/admin/reports/${report.id}`}
        rowKey={(report) => report.id}
        rows={reports}
      />

      <Pagination basePath="/admin/reports" meta={meta} params={raw} />
    </>
  );
}
