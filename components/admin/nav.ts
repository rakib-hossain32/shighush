import type { Capability } from "@/lib/auth/permissions";

/**
 * The dashboard navigation tree.
 *
 * Items declare a **capability**, not a role. That is the whole point: adding a role, or
 * moving `report:remove` from Admin to Moderator, is a one-line change in
 * `lib/auth/permissions.ts` and this file needs no edit. The previous version listed
 * `roles: ["Admin"]` inline, which meant the same policy was written down in two places.
 *
 * The layout gates by the same `capabilityForPath` table, so the sidebar can never show a
 * link that the layout will then refuse — the old failure mode where seven sidebar links
 * pointed at routes that did not exist.
 *
 * Icons are named here rather than imported, so this stays a plain data module usable from
 * a Server Component; `admin-sidebar.tsx` maps names to components.
 */

export type NavIcon =
  | "overview"
  | "queue"
  | "pending"
  | "published"
  | "flags"
  | "appeals"
  | "institutions"
  | "people"
  | "users"
  | "audit"
  | "settings"
  | "help"
  | "policy";

export type NavItem = {
  title: string;
  path: string;
  icon: NavIcon;
  /** Omit for items every signed-in staff member may see. */
  capability?: Capability;
  /** Shown as a count chip; resolved by the shell, not hardcoded. */
  badgeKey?: "queue" | "flags" | "appeals" | "pii";
  /** Match this path exactly instead of by prefix (for index routes). */
  exact?: boolean;
};

export type NavGroup = {
  label?: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { title: "সারসংক্ষেপ", path: "/admin", icon: "overview", exact: true },
    ],
  },
  {
    label: "মডারেশন",
    items: [
      {
        title: "রিভিউ কিউ",
        path: "/admin/reports?status=submitted,under_review,needs_info",
        icon: "queue",
        capability: "report:review",
        badgeKey: "queue",
      },
      {
        title: "সব নথি",
        path: "/admin/reports",
        icon: "published",
        capability: "report:review",
        exact: true,
      },
      {
        title: "গোপনীয়তা সতর্কতা",
        path: "/admin/reports?flaggedOnly=1",
        icon: "pending",
        capability: "report:review",
        badgeKey: "pii",
      },
    ],
  },
  {
    label: "নাগরিক সংকেত",
    items: [
      {
        title: "ফ্ল্যাগ",
        path: "/admin/flags",
        icon: "flags",
        capability: "flag:handle",
        badgeKey: "flags",
      },
      {
        title: "আপিল",
        path: "/admin/appeals",
        icon: "appeals",
        capability: "appeal:handle",
        badgeKey: "appeals",
      },
    ],
  },
  {
    label: "রেজিস্ট্রি",
    items: [
      {
        title: "প্রতিষ্ঠান",
        path: "/admin/institutions",
        icon: "institutions",
        capability: "institution:read",
      },
      {
        title: "ব্যক্তি-রেকর্ড",
        path: "/admin/people",
        icon: "people",
        capability: "person:read",
      },
    ],
  },
  {
    label: "প্রশাসন",
    items: [
      {
        title: "ব্যবহারকারী",
        path: "/admin/users",
        icon: "users",
        capability: "user:read",
      },
      {
        title: "অডিট লগ",
        path: "/admin/audit-logs",
        icon: "audit",
        capability: "audit:read",
      },
    ],
  },
];

export const FOOTER_NAV: NavItem[] = [
  { title: "মডারেশন নীতি", path: "/methodology", icon: "policy" },
  { title: "নিরাপত্তা নির্দেশিকা", path: "/safety", icon: "help" },
];

/** Counts resolved server-side and passed to the sidebar. */
export type NavBadges = Partial<
  Record<NonNullable<NavItem["badgeKey"]>, number>
>;

/**
 * Whether a nav item should be highlighted for the current URL.
 *
 * Items carry query strings (`?status=…`), so comparison is on pathname plus the query
 * keys the item actually specifies — otherwise "রিভিউ কিউ" and "সব নথি" would both light
 * up on `/admin/reports`.
 */
export function isNavItemActive(
  item: NavItem,
  pathname: string,
  searchParams: URLSearchParams,
): boolean {
  const [itemPath, itemQuery] = item.path.split("?");

  const pathMatches = item.exact
    ? pathname === itemPath
    : pathname === itemPath || pathname.startsWith(`${itemPath}/`);

  if (!pathMatches) return false;

  if (!itemQuery) {
    // A bare path is active only when no competing filter is applied.
    return item.exact
      ? searchParams.size === 0 || pathname !== "/admin/reports"
      : true;
  }

  const expected = new URLSearchParams(itemQuery);
  for (const [key, value] of expected) {
    if (searchParams.get(key) !== value) return false;
  }
  return true;
}
