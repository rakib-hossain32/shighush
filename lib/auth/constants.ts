/**
 * Auth constants shared between server modules and `proxy.ts`.
 *
 * Deliberately its own file with no imports: `lib/auth/session.ts` is marked
 * `server-only` and pulls in `next/headers`, which `proxy.ts` must not do — proxy reads
 * cookies off the `NextRequest` instead. Both need the same cookie name, so the name
 * lives here where either can import it.
 */

export const SESSION_COOKIE = "shighush_session";

/** Where an unauthenticated visitor is sent. */
export const LOGIN_PATH = "/admin/login";

/** Fallback lifetime when a token carries no usable `exp`. Matches the API's `1d`. */
export const DEFAULT_SESSION_MAX_AGE_SECONDS = 24 * 60 * 60;
