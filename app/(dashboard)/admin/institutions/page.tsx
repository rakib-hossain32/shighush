import Link from "next/link";
import { ExternalLinkIcon, PlusIcon } from "lucide-react";

import { AccessDenied } from "@/components/admin/access-denied";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CellStack, DataTable, type Column } from "@/components/admin/data-table";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { MetaBadge } from "@/components/ui/status-badge";
import { guard } from "@/lib/auth/dal";
import { can } from "@/lib/auth/permissions";
import {
  INSTITUTION_CATEGORY_META,
  INSTITUTION_TYPE_META,
  OFFICE_LEVEL_META,
} from "@/lib/domain/enums";
import { areaName } from "@/lib/domain/geo";
import { institutionFilterSchema, parseFilters } from "@/lib/domain/schemas";
import { formatBnNumber, formatBnPercent } from "@/lib/format";
import { getInstitutions, type Institution } from "@/services";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "প্রতিষ্ঠান",
  description: "canonical প্রতিষ্ঠান তালিকা ও তাদের রেকর্ড।",
  index: false,
});

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminInstitutionsPage({ searchParams }: PageProps) {
  const access = await guard("institution:read", "/admin/institutions");
  if (!access.allowed) {
    return <AccessDenied capability={access.capability} role={access.session.role} />;
  }

  // Moderators read this registry; only Admin may edit it. Same page, different affordances.
  const mayEdit = can(access.session.role, "institution:write");

  const raw = await searchParams;
  const filters = parseFilters(institutionFilterSchema, raw);
  const response = await getInstitutions({
    page: filters.page,
    limit: 20,
    search: filters.search,
    area: filters.area,
  });
  const institutions = response.data;
  const meta = response.meta;

  const columns: Array<Column<Institution>> = [
    {
      key: "name",
      header: "প্রতিষ্ঠান",
      primary: true,
      cell: (institution) => (
        <CellStack
          subtitle={`${INSTITUTION_CATEGORY_META[institution.category].label} · ${areaName(institution.location.area)}`}
          title={institution.nameBn}
        />
      ),
    },
    {
      key: "type",
      header: "ধরন",
      hideBelow: "lg",
      cell: (institution) => (
        <MetaBadge meta={INSTITUTION_TYPE_META[institution.type]} short size="sm" />
      ),
    },
    {
      key: "level",
      header: "স্তর",
      hideBelow: "xl",
      cell: (institution) => (
        <span className="text-sm text-muted-foreground">
          {OFFICE_LEVEL_META[institution.officeLevel].label}
        </span>
      ),
    },
    {
      key: "reports",
      header: "রিপোর্ট",
      align: "end",
      cell: (institution) => (
        <span className="font-bold tabular-nums">
          {formatBnNumber(institution.metrics?.totalReports ?? 0)}
        </span>
      ),
    },
    {
      key: "evidence",
      header: "প্রমাণ",
      align: "end",
      hideBelow: "sm",
      cell: (institution) => (
        <span className="text-sm tabular-nums text-muted-foreground">
          {formatBnPercent(institution.metrics?.evidenceRate ?? 0)}
        </span>
      ),
    },
    {
      key: "public",
      header: "",
      align: "end",
      hideBelow: "md",
      cell: (institution) => (
        <Link
          className="inline-flex items-center gap-1 text-xs font-bold underline"
          href={`/institutions/${institution.slug}`}
          rel="noreferrer"
          target="_blank"
        >
          পাবলিক <ExternalLinkIcon className="size-3" />
        </Link>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader
        actions={
          mayEdit && (
            <Button disabled>
              <PlusIcon />
              নতুন প্রতিষ্ঠান
            </Button>
          )
        }
        description={
          mayEdit
            ? "রিপোর্টে উল্লিখিত দফতরকে canonical তালিকায় যুক্ত করুন। নাম বদলালে পুরোনো রিপোর্টের লিংক অক্ষত থাকবে।"
            : "canonical প্রতিষ্ঠান তালিকা। সম্পাদনার অনুমতি শুধু অ্যাডমিনের।"
        }
        title="প্রতিষ্ঠান রেজিস্ট্রি"
      >
        <form
          action="/admin/institutions"
          className="flex flex-wrap items-center gap-3 border border-border bg-card p-4"
          method="GET"
        >
          <label className="flex min-w-0 flex-1 items-center gap-2 border border-border bg-background px-3 py-2">
            <span className="sr-only">প্রতিষ্ঠান খুঁজুন</span>
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              defaultValue={filters.search ?? ""}
              name="search"
              placeholder="প্রতিষ্ঠান বা এলাকার নাম"
              type="search"
            />
          </label>
          <Button size="sm" type="submit">
            খুঁজুন
          </Button>
        </form>
      </AdminPageHeader>

      <DataTable
        columns={columns}
        empty={{
          title: "কোনো প্রতিষ্ঠান পাওয়া যায়নি",
          description: "অন্য নাম দিয়ে খুঁজুন, অথবা অনুসন্ধান খালি রেখে সম্পূর্ণ তালিকা দেখুন।",
        }}
        rowKey={(institution) => institution.slug}
        rows={institutions}
      />

      <Pagination basePath="/admin/institutions" meta={meta} params={raw} />
    </>
  );
}
