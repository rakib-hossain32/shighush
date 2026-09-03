import { NextResponse, type NextRequest } from "next/server";

import { LOGIN_PATH, SESSION_COOKIE } from "@/lib/auth/constants";
import { verifyJwt } from "@/lib/auth/jwt";

/**
 * Next.js 16 renamed `middleware.ts` to `proxy.ts` (same runtime, same capabilities).
 * Verified against `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`
 * in this project's installed version — do not rename it back.
 *
 * This is an **optimistic** check only, exactly as the bundled authentication guide
 * prescribes: it verifies the cookie's signature and expiry, nothing more. No database
 * call, no user lookup — proxy runs on prefetches too, so anything expensive here is paid
 * on every hover.
 *
 * The real authorization boundary is `lib/auth/dal.ts`, called by the dashboard layout and
 * by every Server Action. Deleting this file would not open a hole; deleting the DAL
 * checks would.
 *
 * Scoped to `/admin` via `config.matcher` rather than running site-wide: the public
 * pages have no session concept, and the report/track surfaces must stay reachable
 * without one.
 */

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const result = await verifyJwt(token);
  const signedIn = result.ok;

  const isLoginPage = pathname === LOGIN_PATH;

  if (isLoginPage) {
    // Already signed in: skip the form. `next` is honoured so an expired-session deep
    // link lands where the user was originally going.
    if (signedIn) {
      const next = request.nextUrl.searchParams.get("next");
      const destination = next && next.startsWith("/admin") ? next : "/admin";
      return NextResponse.redirect(new URL(destination, request.url));
    }
    return NextResponse.next();
  }

  if (!signedIn) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);

    const response = NextResponse.redirect(loginUrl);
    // A token that exists but failed verification is stale or tampered with. Clearing it
    // stops a redirect loop where the cookie keeps re-triggering this branch.
    if (token && result.reason !== "missing") {
      response.cookies.delete(SESSION_COOKIE);
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
