import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";

import { AccessDenied } from "@/components/admin/access-denied";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CellStack, DataTable, type Column } from "@/components/admin/data-table";
import { MetaBadge, StatusBadge } from "@/components/ui/status-badge";
import { guard } from "@/lib/auth/dal";
import { FLAG_REASON_META } from "@/lib/domain/enums";
import { formatBnRelative } from "@/lib/format";
import { getFlags, type Flag } from "@/services";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "ফ্ল্যাগ",
  description: "নাগরিকদের পাঠানো অপব্যবহার ও গোপনীয়তা রিপোর্ট।",
  index: false,
});

const STATUS_META = {
  open: { label: "অমীমাংসিত", short: "খোলা", tone: "warning" as const },
  actioned: { label: "ব্যবস্থা নেওয়া হয়েছে", short: "ব্যবস্থা", tone: "success" as const },
  dismissed: { label: "খারিজ", short: "খারিজ", tone: "muted" as const },
};

export default async function AdminFlagsPage() {
  const access = await guard("flag:handle", "/admin/flags");
  if (!access.allowed) {
    return <AccessDenied capability={access.capability} role={access.session.role} />;
  }

  const response = await getFlags({ page: 1, limit: 50 });
  const flags = Array.isArray(response.data) ? response.data : [];

  const columns: Array<Column<Flag>> = [
    {
      key: "report",
      header: "নথি",
      primary: true,
      cell: (flag) => <CellStack subtitle={flag.detail} title={flag.reportTitle} />,
    },
    {
      key: "reason",
      header: "কারণ",
      cell: (flag) => <MetaBadge meta={FLAG_REASON_META[flag.reason]} size="sm" />,
    },
    {
      key: "raised",
      header: "জানানো হয়েছে",
      align: "end",
      hideBelow: "sm",
      cell: (flag) => (
        <span className="text-xs text-muted-foreground">{formatBnRelative(flag.raisedAt)}</span>
      ),
    },
    {
      key: "status",
      header: "অবস্থা",
      align: "end",
      cell: (flag) => <MetaBadge meta={STATUS_META[flag.status]} size="sm" />,
    },
    {
      key: "public",
      header: "",
      align: "end",
      hideBelow: "md",
      cell: (flag) => (
        <Link
          className="inline-flex items-center gap-1 text-xs font-bold underline"
          href={`/reports/${flag.reportSlug}`}
          rel="noreferrer"
          target="_blank"
        >
          পাবলিক <ExternalLinkIcon className="size-3" />
        </Link>
      ),
    },
  ];

  const openCount = flags.filter((flag) => flag.status === "open").length;

  return (
    <>
      <AdminPageHeader
        actions={
          openCount > 0 && (
            <StatusBadge tone="warning">{openCount}টি অমীমাংসিত</StatusBadge>
          )
        }
        description="নাগরিকেরা যেসব প্রকাশিত নথিতে গোপনীয়তা ঝুঁকি, ভুল তথ্য বা হুমকি চিহ্নিত করেছেন। গোপনীয়তা-সংক্রান্ত ফ্ল্যাগ সবার আগে দেখুন।"
        title="ফ্ল্যাগ"
      />

      <DataTable
        columns={columns}
        empty={{
          title: "কোনো ফ্ল্যাগ নেই",
          description: "প্রকাশিত নথি নিয়ে এখনো কেউ আপত্তি জানাননি।",
        }}
        rowHref={(flag) => `/admin/reports/${flag.reportSlug}`}
        rowKey={(flag) => flag.id}
        rows={flags}
      />
    </>
  );
}
