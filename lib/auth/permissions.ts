/**
 * The role → capability matrix. One table, imported by the nav, the layout, every page
 * and every Server Action, so "what can a Moderator do" has exactly one answer.
 *
 * This is why there is one dashboard and not two. A separate `/moderator` route tree
 * would duplicate every screen and then drift; instead both roles share the same pages
 * and the difference is expressed here.
 *
 * Client-safe (pure data + pure functions) so the nav can use it without a round trip.
 * It is *not* the enforcement point on its own: `requireCapability` in `lib/auth/dal.ts`
 * is what actually blocks a request, and Server Actions must re-check. Hiding a button is
 * a UX affordance, never a security boundary.
 */

import type { UserRole } from "@/lib/domain/enums";

export const CAPABILITIES = [
  /* Moderation queue */
  "report:review",
  "report:redact",
  "report:publish",
  "report:remove",
  /* Community signals */
  "flag:handle",
  "appeal:handle",
  /* Canonical registries */
  "institution:read",
  "institution:write",
  "person:read",
  "person:write",
  /* Administration */
  "user:read",
  "user:write",
  "audit:read",
  "settings:write",
] as const;

export type Capability = (typeof CAPABILITIES)[number];

const MODERATOR_CAPABILITIES: readonly Capability[] = [
  "report:review",
  "report:redact",
  "report:publish",
  "flag:handle",
  "appeal:handle",
  "institution:read",
  "person:read",
];

/**
 * Admin holds every capability. Moderator is deliberately missing three:
 *
 *  - `report:remove` — un-publishing an already public record is close to erasing the
 *    archive, so it needs the higher role and lands in the audit log.
 *  - `person:write` — §7 makes name disclosure the most legally sensitive action in the
 *    product. Until the doc's two-approver flow exists, only Admin decides.
 *  - `user:write` / `settings:write` / `audit:read` — account and audit surfaces.
 */
const MATRIX: Record<UserRole, readonly Capability[]> = {
  Admin: CAPABILITIES,
  Moderator: MODERATOR_CAPABILITIES,
};

export function can(role: UserRole, capability: Capability): boolean {
  return MATRIX[role].includes(capability);
}

export function canAll(role: UserRole, capabilities: readonly Capability[]): boolean {
  return capabilities.every((capability) => can(role, capability));
}

export function canAny(role: UserRole, capabilities: readonly Capability[]): boolean {
  return capabilities.some((capability) => can(role, capability));
}

export function capabilitiesFor(role: UserRole): readonly Capability[] {
  return MATRIX[role];
}

/**
 * Route → required capability. Used by the dashboard layout to reject a direct URL hit
 * and by the sidebar to hide links, from the same source, so the nav can never offer a
 * link that the layout will then refuse.
 *
 * Longest prefix wins, so `/admin/reports/r-42` inherits `/admin/reports`.
 */
const ROUTE_CAPABILITY: Array<{ prefix: string; capability: Capability }> = [
  { prefix: "/admin/reports", capability: "report:review" },
  { prefix: "/admin/flags", capability: "flag:handle" },
  { prefix: "/admin/appeals", capability: "appeal:handle" },
  { prefix: "/admin/institutions", capability: "institution:read" },
  { prefix: "/admin/people", capability: "person:read" },
  { prefix: "/admin/users", capability: "user:read" },
  { prefix: "/admin/audit-logs", capability: "audit:read" },
  { prefix: "/admin/settings", capability: "settings:write" },
];

/** The capability a path requires, or null when any authenticated staff member may view it. */
export function capabilityForPath(pathname: string): Capability | null {
  const match = ROUTE_CAPABILITY.filter(
    (entry) => pathname === entry.prefix || pathname.startsWith(`${entry.prefix}/`),
  ).sort((a, b) => b.prefix.length - a.prefix.length)[0];

  return match?.capability ?? null;
}

export function canAccessPath(role: UserRole, pathname: string): boolean {
  const capability = capabilityForPath(pathname);
  return capability === null || can(role, capability);
}
