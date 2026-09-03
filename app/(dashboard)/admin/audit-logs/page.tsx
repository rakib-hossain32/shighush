import { AccessDenied } from "@/components/admin/access-denied";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  CellStack,
  DataTable,
  type Column,
} from "@/components/admin/data-table";
import { MetaBadge, StatusBadge } from "@/components/ui/status-badge";
import { guard } from "@/lib/auth/dal";
import { USER_ROLE_META } from "@/lib/domain/enums";
import { formatBnDateTime } from "@/lib/format";
import { getAuditLogs, type AuditLogEntry } from "@/services";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "অডিট লগ",
  description: "স্টাফের প্রতিটি সিদ্ধান্তের অপরিবর্তনীয় রেকর্ড।",
  index: false,
});

/** Action slug → Bengali label. Unknown actions fall back to the raw slug, never blank. */
const ACTION_LABEL: Record<
  string,
  { label: string; tone: "success" | "warning" | "danger" | "info" }
> = {
  "report.publish": { label: "নথি প্রকাশ", tone: "success" },
  "report.redact": { label: "তথ্য রিডাকশন", tone: "warning" },
  "report.reject": { label: "নথি প্রত্যাখ্যান", tone: "danger" },
  "report.remove": { label: "নথি অপসারণ", tone: "danger" },
  "report.request_info": { label: "অতিরিক্ত তথ্য চাওয়া", tone: "warning" },
  "user.create": { label: "স্টাফ যোগ", tone: "info" },
  "user.role_change": { label: "ভূমিকা পরিবর্তন", tone: "danger" },
  "institution.create": { label: "প্রতিষ্ঠান যোগ", tone: "info" },
  "person.publish_name": { label: "ব্যক্তির নাম প্রকাশ", tone: "danger" },
};

export default async function AdminAuditLogPage() {
  const access = await guard("audit:read", "/admin/audit-logs");
  if (!access.allowed) {
    return (
      <AccessDenied capability={access.capability} role={access.session.role} />
    );
  }

  const response = await getAuditLogs({ page: 1, limit: 100 });
  const entries = response.data;

  const columns: Array<Column<AuditLogEntry>> = [
    {
      key: "summary",
      header: "কাজ",
      primary: true,
      cell: (entry) => (
        <CellStack
          subtitle={`${entry.target.type} · ${entry.target.id}`}
          title={entry.summary}
        />
      ),
    },
    {
      key: "action",
      header: "ধরন",
      hideBelow: "md",
      cell: (entry) => {
        const meta = ACTION_LABEL[entry.action];
        return meta ? (
          <StatusBadge size="sm" tone={meta.tone}>
            {meta.label}
          </StatusBadge>
        ) : (
          <span className="text-xs text-muted-foreground">{entry.action}</span>
        );
      },
    },
    {
      key: "actor",
      header: "কে",
      hideBelow: "sm",
      cell: (entry) => (
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-sm">{entry.actor.name}</span>
          <MetaBadge meta={USER_ROLE_META[entry.actor.role]} short size="sm" />
        </span>
      ),
    },
    {
      key: "at",
      header: "কখন",
      align: "end",
      cell: (entry) => (
        <span className="text-xs text-muted-foreground">
          {formatBnDateTime(entry.at)}
        </span>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader
        description="কে, কখন, কোন নথিতে কী সিদ্ধান্ত নিয়েছেন। এই লগ কখনো সম্পাদনা বা মুছে ফেলা যায় না — আপিল ও স্বচ্ছতার ভিত্তি এটাই।"
        title="অডিট লগ"
      />

      <DataTable
        columns={columns}
        empty={{ title: "এখনো কোনো কার্যক্রম রেকর্ড হয়নি" }}
        rowKey={(entry) => entry.id}
        rows={entries}
      />
    </>
  );
}
