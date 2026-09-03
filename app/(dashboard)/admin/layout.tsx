import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import type { NavBadges } from "@/components/admin/nav";
import { getCurrentUser, requireSession } from "@/lib/auth/dal";
import { getDashboardStats, getAppeals, getFlags } from "@/services";

/**
 * The authorization boundary for the whole dashboard.
 *
 * `requireSession()` runs on the server before any child renders, so hitting `/admin`
 * directly with no cookie redirects to login — the previous version had no check at all
 * and served the dashboard to anyone who typed the URL.
 *
 * `proxy.ts` also redirects unauthenticated requests, but that is an optimistic
 * pre-filter, not the guarantee. This is the guarantee. Per-route capability checks live
 * in each page via `guard()`.
 *
 * Note the login page is NOT under this layout — it sits in the `(auth)` route group,
 * otherwise the redirect here would bounce against it forever.
 */
export default async function DashboardLayout({ children }: LayoutProps<"/admin">) {
  const session = await requireSession();
  const user = await getCurrentUser();

  // Badge counts are resolved here, once, and passed down — the sidebar stays a pure
  // presentation component and cannot start fetching on the client.
  const statsResponse = await getDashboardStats();
  const appealsResponse = await getAppeals({ status: ["received", "in_review"], limit: 100 });
  const flagsResponse = await getFlags({ status: "open", limit: 100 });

  const badges: NavBadges = {
    queue: statsResponse.data.metrics.find((metric) => metric.key === "queue")?.value ?? 0,
    pii: statsResponse.data.piiAlerts.length,
    flags: flagsResponse.data.length,
    appeals: appealsResponse.data.length,
  };

  return (
    <SidebarProvider className="relative h-svh">
      <AdminSidebar badges={badges} role={session.role} />
      {/* SidebarInset renders the `<main>` landmark, so pages must not add another. */}
      <SidebarInset className="md:peer-data-[variant=inset]:ml-0">
        {user && <AdminHeader user={user} />}
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
