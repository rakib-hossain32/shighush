/**
 * Data Access Layer for authentication and authorization.
 *
 * This is the enforcement point, following the pattern the bundled Next.js
 * authentication guide recommends: `proxy.ts` does a cheap optimistic redirect, and the
 * real check happens here, as close to the data as possible. Every dashboard page,
 * layout and Server Action goes through these functions.
 *
 * `cache()` memoises per render pass, so a layout, a page and three leaf components that
 * each ask "who is this and what may they do" verify the token once.
 */

import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { verifyJwt, type SessionClaims } from "@/lib/auth/jwt";
import { readSessionToken } from "@/lib/auth/session";
import { can, type Capability } from "@/lib/auth/permissions";
import { getUsers, type StaffUser } from "@/services";

export type Session = {
  userId: string;
  role: SessionClaims["role"];
  expiresAt: Date | null;
};

/** Where an unauthenticated visitor is sent. */
export const LOGIN_PATH = "/admin/login";

/**
 * The verified session, or null. Never redirects — callers decide, so this is safe to use
 * in a layout that also renders a public shell.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  const token = await readSessionToken();
  const result = await verifyJwt(token);

  if (!result.ok) {
    // Deliberately quiet in production: a log line per failed probe is a log flood, and
    // the reason is not something we want to hand back to whoever is probing.
    if (process.env.NODE_ENV !== "production" && result.reason !== "missing") {
      console.warn(`[auth] session rejected: ${result.reason}`);
    }
    return null;
  }

  return {
    userId: result.claims.id,
    role: result.claims.role,
    expiresAt: result.claims.exp ? new Date(result.claims.exp * 1000) : null,
  };
});

/**
 * The session, or a redirect to login. Use at the top of any staff layout or page.
 *
 * `next` carries the original path so login can return the user where they were heading —
 * a deep link to a report in the queue survives an expired session.
 */
export async function requireSession(returnTo?: string): Promise<Session> {
  const session = await getSession();
  if (session) return session;

  const target = returnTo
    ? `${LOGIN_PATH}?next=${encodeURIComponent(returnTo)}`
    : LOGIN_PATH;
  redirect(target);
}

/**
 * Result of a capability check, for pages that should render a 403 panel in the dashboard
 * chrome rather than bounce the user somewhere else.
 *
 * Next's `forbidden()` / `unauthorized()` would express this natively, but both are
 * experimental and gated behind `experimental.authInterrupts`. A platform that handles
 * whistleblower reports should not depend on an unstable API for its access control, so
 * this returns a plain discriminated union instead.
 */
export type Guard =
  | { allowed: true; session: Session }
  | { allowed: false; session: Session; capability: Capability };

/** Check a capability without redirecting. Pages render `<AccessDenied />` on refusal. */
export async function guard(
  capability: Capability,
  returnTo?: string,
): Promise<Guard> {
  const session = await requireSession(returnTo);
  return can(session.role, capability)
    ? { allowed: true, session }
    : { allowed: false, session, capability };
}

/**
 * Hard assertion for Server Actions and Route Handlers, where there is no UI to render.
 *
 * Actions must call this even when the button that triggered them was hidden: the client
 * can invoke any action endpoint directly, so a hidden control is not a check.
 */
export async function assertCapability(
  capability: Capability,
): Promise<Session> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHENTICATED");
  if (!can(session.role, capability))
    throw new Error(`FORBIDDEN:${capability}`);
  return session;
}

/**
 * The staff record for the current session.
 *
 * Reads from fixtures today; in Phase 2 this becomes a call to the API's `/auth/me`.
 * Either way it returns a narrow projection — never a whole user document, so a password
 * hash cannot ride along into a Client Component.
 */
export const getCurrentUser = cache(async (): Promise<StaffUser | null> => {
  const session = await getSession();
  if (!session) return null;

  try {
    const response = await getUsers({ limit: 100 });
    // Check if response has data array
    if (response.data && Array.isArray(response.data)) {
      const found = response.data.find((user) => user.id === session.userId);
      if (found) return found;
    }
  } catch (error) {
    // Silently fail if user doesn't have permission to fetch users
    // This can happen for Moderators who can't access user list
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to fetch users (possibly insufficient permissions):', error);
    }
  }

  // A valid token for a user we cannot load: show the role we can prove from the token
  // rather than logging them out mid-task.
  return {
    id: session.userId,
    name: session.role === "Admin" ? "অ্যাডমিন" : "মডারেটর",
    email: "",
    role: session.role,
    createdAt: new Date(0).toISOString(),
  };
});
