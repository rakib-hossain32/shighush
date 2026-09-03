import { PlusIcon } from "lucide-react";

import { AccessDenied } from "@/components/admin/access-denied";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  CellStack,
  DataTable,
  type Column,
} from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { MetaBadge } from "@/components/ui/status-badge";
import { guard } from "@/lib/auth/dal";
import { can, capabilitiesFor } from "@/lib/auth/permissions";
import { USER_ROLE_META } from "@/lib/domain/enums";
import { formatBnDate, formatBnNumber, formatBnRelative } from "@/lib/format";
import { getUsers, type StaffUser } from "@/services";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "ব্যবহারকারী",
  description: "মডারেটর ও অ্যাডমিন অ্যাকাউন্ট।",
  index: false,
});

export default async function AdminUsersPage() {
  const access = await guard("user:read", "/admin/users");
  if (!access.allowed) {
    return (
      <AccessDenied capability={access.capability} role={access.session.role} />
    );
  }

  const mayWrite = can(access.session.role, "user:write");
  const response = await getUsers({ page: 1, limit: 50 });
  const users = response.data;

  const columns: Array<Column<StaffUser>> = [
    {
      key: "name",
      header: "নাম",
      primary: true,
      cell: (user) => <CellStack subtitle={user.email} title={user.name} />,
    },
    {
      key: "role",
      header: "ভূমিকা",
      cell: (user) => <MetaBadge meta={USER_ROLE_META[user.role]} size="sm" />,
    },
    {
      key: "capabilities",
      header: "অনুমতি",
      align: "end",
      hideBelow: "lg",
      cell: (user) => (
        <span className="text-sm tabular-nums text-muted-foreground">
          {formatBnNumber(capabilitiesFor(user.role).length)}টি
        </span>
      ),
    },
    {
      key: "created",
      header: "যোগদান",
      align: "end",
      hideBelow: "xl",
      cell: (user) => (
        <span className="text-xs text-muted-foreground">
          {formatBnDate(user.createdAt)}
        </span>
      ),
    },
    {
      key: "lastLogin",
      header: "সর্বশেষ লগইন",
      align: "end",
      hideBelow: "sm",
      cell: (user) => (
        <span className="text-xs text-muted-foreground">
          {user.lastLoginAt ? formatBnRelative(user.lastLoginAt) : "কখনো নয়"}
        </span>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader
        actions={
          mayWrite && (
            <Button disabled>
              <PlusIcon />
              নতুন স্টাফ
            </Button>
          )
        }
        description="মডারেটর ও অ্যাডমিন অ্যাকাউন্ট। ভূমিকা পরিবর্তনের প্রতিটি ঘটনা audit log-এ সংরক্ষিত হয়।"
        title="ব্যবহারকারী"
      />

      <DataTable
        columns={columns}
        empty={{ title: "কোনো স্টাফ অ্যাকাউন্ট নেই" }}
        rowKey={(user) => user.id}
        rows={users}
      />

      <p className="text-xs leading-6 text-muted-foreground">
        মনে রাখুন: অভিযোগ জমা দিতে কোনো অ্যাকাউন্ট লাগে না। এখানে শুধু
        প্ল্যাটফর্ম পরিচালনার দায়িত্বে থাকা ব্যক্তিরা আছেন।
      </p>
    </>
  );
}
