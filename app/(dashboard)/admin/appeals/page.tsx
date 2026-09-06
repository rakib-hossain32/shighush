import { AccessDenied } from "@/components/admin/access-denied";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  CellStack,
  DataTable,
  type Column,
} from "@/components/admin/data-table";
import { MetaBadge, StatusBadge } from "@/components/ui/status-badge";
import { guard } from "@/lib/auth/dal";
import { APPEAL_REASON_META, APPEAL_STATUS_META } from "@/lib/domain/enums";
import { formatBnRelative } from "@/lib/format";
import { getAppeals, type Appeal } from "@/services";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "আপিল",
  description: "সংশোধনী, গোপনীয়তা ও জবাব-সংক্রান্ত আবেদন।",
  index: false,
});

export default async function AdminAppealsPage() {
  const access = await guard("appeal:handle", "/admin/appeals");
  if (!access.allowed) {
    return (
      <AccessDenied capability={access.capability} role={access.session.role} />
    );
  }

  const response = await getAppeals({ page: 1, limit: 50 });
  const appeals = Array.isArray(response.data) ? response.data : [];

  const columns: Array<Column<Appeal>> = [
    {
      key: "detail",
      header: "আবেদন",
      primary: true,
      cell: (appeal) => (
        <CellStack subtitle={`নথি ${appeal.caseId}`} title={appeal.detail} />
      ),
    },
    {
      key: "reason",
      header: "কারণ",
      hideBelow: "md",
      cell: (appeal) => (
        <MetaBadge meta={APPEAL_REASON_META[appeal.reason]} size="sm" />
      ),
    },
    {
      key: "received",
      header: "গৃহীত",
      align: "end",
      hideBelow: "sm",
      cell: (appeal) => (
        <span className="text-xs text-muted-foreground">
          {formatBnRelative(appeal.receivedAt)}
        </span>
      ),
    },
    {
      key: "status",
      header: "অবস্থা",
      align: "end",
      cell: (appeal) => (
        <MetaBadge meta={APPEAL_STATUS_META[appeal.status]} size="sm" />
      ),
    },
  ];

  const pending = appeals.filter(
    (appeal) => appeal.status === "received" || appeal.status === "in_review",
  ).length;

  return (
    <>
      <AdminPageHeader
        actions={
          pending > 0 && (
            <StatusBadge tone="warning">{pending}টি অপেক্ষমাণ</StatusBadge>
          )
        }
        description="ভুল তথ্য, গোপনীয়তার ঝুঁকি বা প্রতিষ্ঠানের জবাব যুক্ত করার আবেদন। গোপনীয়তা-সংক্রান্ত আপিল অগ্রাধিকার পায়।"
        title="আপিল ও সংশোধনী"
      />

      <DataTable
        columns={columns}
        empty={{
          title: "কোনো আপিল নেই",
          description: "প্রকাশিত নথি নিয়ে এখনো কোনো সংশোধনীর আবেদন আসেনি।",
        }}
        rowHref={(appeal) =>
          appeal.reportSlug
            ? `/admin/reports/${appeal.reportSlug}`
            : "/admin/appeals"
        }
        rowKey={(appeal) => appeal.id}
        rows={appeals}
      />
    </>
  );
}
