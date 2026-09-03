/**
 * Session cookie management.
 *
 * The staff JWT lives in an httpOnly cookie, not `localStorage`. Two reasons, and the
 * second is the one that forced the change:
 *
 *  1. §12.10 requires httpOnly + secure cookies. A token readable by `document.cookie`
 *     or `localStorage` is a token any XSS can exfiltrate — on a platform whose whole
 *     promise is protecting whistleblowers, an admin session is the crown jewels.
 *
 *  2. Server Components and layouts cannot read `localStorage`. Server-side role gating
 *     is impossible without a cookie, so the old approach could only ever hide sidebar
 *     links on the client while leaving `/admin` open to a direct URL.
 */

import "server-only";

import { cookies } from "next/headers";

import { peekExpiry } from "@/lib/auth/jwt";
import { DEFAULT_SESSION_MAX_AGE_SECONDS, SESSION_COOKIE } from "@/lib/auth/constants";

export { SESSION_COOKIE };

export async function createSession(token: string): Promise<void> {
  const store = await cookies();
  const expiry = peekExpiry(token);

  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    // Plain http on localhost would drop a `secure` cookie and silently break login.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(expiry && expiry.getTime() > Date.now()
      ? { expires: expiry }
      : { maxAge: DEFAULT_SESSION_MAX_AGE_SECONDS }),
  });
}

export async function readSessionToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value;
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  // Delete, then overwrite with an expired value: some proxies ignore a bare delete.
  store.delete(SESSION_COOKIE);
  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
