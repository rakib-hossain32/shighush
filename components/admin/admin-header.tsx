"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ExternalLinkIcon } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CustomSidebarTrigger } from "@/components/custom-sidebar-trigger";
import { AdminUserMenu } from "@/components/admin/admin-user-menu";
import { isNavItemActive, NAV_GROUPS } from "@/components/admin/nav";
import type { StaffUser } from "@/services/_shared/types";

/**
 * Breadcrumb is derived from the live URL.
 *
 * The previous header computed `navLinks.find(item => item.isActive)` at **module scope**,
 * so it evaluated once per process and the crumb read "Overview" on every page regardless
 * of the route.
 */
function useCrumbs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const active = NAV_GROUPS.flatMap((group) => group.items).find((item) =>
    isNavItemActive(item, pathname, searchParams),
  );

  if (active) {
    return active.path.split("?")[0] === "/admin"
      ? [{ title: active.title }]
      : [{ title: "ড্যাশবোর্ড", href: "/admin" }, { title: active.title }];
  }

  // Detail routes (e.g. /admin/reports/r-42) have no nav entry of their own.
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 2) {
    const parentPath = `/${segments.slice(0, 2).join("/")}`;
    const parent = NAV_GROUPS.flatMap((group) => group.items).find(
      (item) => item.path.split("?")[0] === parentPath,
    );
    return [
      { title: "ড্যাশবোর্ড", href: "/admin" },
      ...(parent ? [{ title: parent.title, href: parent.path }] : []),
      { title: "বিস্তারিত" },
    ];
  }

  return [{ title: "ড্যাশবোর্ড" }];
}

export function AdminHeader({ user }: { user: StaffUser }) {
  const crumbs = useCrumbs();

  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-background px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <CustomSidebarTrigger />
        <Separator
          className="mr-2 h-4 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;
              const href = "href" in crumb ? crumb.href : undefined;

              // Separator is a sibling `<li role="presentation">`, so it must not be
              // nested inside a BreadcrumbItem — that would produce `<li><li>`.
              return (
                <Fragment key={`${crumb.title}-${index}`}>
                  <BreadcrumbItem>
                    {isLast || !href ? (
                      <BreadcrumbPage className="truncate">{crumb.title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink render={<Link href={href} />}>
                        {crumb.title}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-3">
        {/* Staff constantly need to check how a record actually looks in public. */}
        <Button
          aria-label="পাবলিক সাইট নতুন ট্যাবে খুলুন"
          nativeButton={false}
          render={<Link href="/" rel="noreferrer" target="_blank" />}
          size="icon-sm"
          variant="outline"
        >
          <ExternalLinkIcon />
        </Button>

        <Separator
          className="h-4 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />

        <AdminUserMenu user={user} />
      </div>
    </header>
  );
}
