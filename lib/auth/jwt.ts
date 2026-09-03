/**
 * HS256 JWT verification with zero dependencies.
 *
 * Why hand-rolled rather than `jose`: the project uses pnpm with strict isolation, so
 * `jose` is not resolvable without adding a dependency, and `jsonwebtoken` (which the
 * Express API uses to *sign*) is a Node-only CommonJS package that cannot run in
 * `proxy.ts`. `crypto.subtle` is available in both the Node and Edge runtimes and is the
 * same primitive those libraries call.
 *
 * This is verification only — no signing, no algorithm negotiation. `alg` is pinned to
 * HS256 and anything else is rejected outright, which closes the classic
 * algorithm-confusion hole (a token claiming `alg: "none"`, or an RS256 token verified as
 * an HMAC with the public key as the secret). `crypto.subtle.verify` does the comparison,
 * so there is no hand-written equality check to leak timing.
 *
 * The secret is shared with the Express API: it signs, we verify. Both are our servers,
 * and sharing one secret is simpler and less error-prone than re-issuing a second token
 * with its own key and rotation story.
 */

import "server-only";

export type SessionClaims = {
  /** Mongo `_id` of the staff user. */
  id: string;
  role: "Admin" | "Moderator";
  /** Seconds since epoch. */
  iat?: number;
  exp?: number;
};

/** Distinguishes "no session" from "tampered token" for logging, without leaking detail. */
export type VerifyFailure =
  | "missing"
  | "malformed"
  | "unsupported_alg"
  | "bad_signature"
  | "expired"
  | "not_yet_valid"
  | "bad_claims"
  | "misconfigured";

export type VerifyResult =
  | { ok: true; claims: SessionClaims }
  | { ok: false; reason: VerifyFailure };

const encoder = new TextEncoder();

/** Clock skew tolerance between the API host and this host. */
const LEEWAY_SECONDS = 30;

function getSecret(): string | null {
  const secret = process.env.JWT_SECRET;
  // A short secret is not a secret. Refuse rather than verify weakly.
  if (!secret || secret.length < 16) return null;
  return secret;
}

function base64UrlToBytes(input: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]*$/.test(input)) return null;
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  try {
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

function decodeJsonSegment(segment: string): unknown | null {
  const bytes = base64UrlToBytes(segment);
  if (!bytes) return null;
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

/**
 * Verify a token and return its claims. Never throws: every failure is a typed reason,
 * so a caller cannot accidentally treat an exception path as "authenticated".
 */
export async function verifyJwt(token: string | undefined | null): Promise<VerifyResult> {
  if (!token) return { ok: false, reason: "missing" };

  const secret = getSecret();
  if (!secret) return { ok: false, reason: "misconfigured" };

  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, reason: "malformed" };

  const [headerSegment, payloadSegment, signatureSegment] = parts;

  const header = decodeJsonSegment(headerSegment) as { alg?: string; typ?: string } | null;
  if (!header) return { ok: false, reason: "malformed" };
  if (header.alg !== "HS256") return { ok: false, reason: "unsupported_alg" };
  if (header.typ !== undefined && header.typ !== "JWT") {
    return { ok: false, reason: "malformed" };
  }

  const signature = base64UrlToBytes(signatureSegment);
  if (!signature) return { ok: false, reason: "malformed" };

  let valid: boolean;
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    valid = await crypto.subtle.verify(
      "HMAC",
      key,
      // `Uint8Array` is an acceptable BufferSource; copy into a fresh buffer so the
      // exact byte range is unambiguous across runtimes.
      signature.slice().buffer as ArrayBuffer,
      encoder.encode(`${headerSegment}.${payloadSegment}`),
    );
  } catch {
    return { ok: false, reason: "misconfigured" };
  }

  // Signature first: never inspect claims from an unverified token.
  if (!valid) return { ok: false, reason: "bad_signature" };

  const payload = decodeJsonSegment(payloadSegment) as Record<string, unknown> | null;
  if (!payload || typeof payload !== "object") return { ok: false, reason: "malformed" };

  const now = Math.floor(Date.now() / 1000);

  if (typeof payload.exp === "number") {
    if (now > payload.exp + LEEWAY_SECONDS) return { ok: false, reason: "expired" };
  } else {
    // A staff token with no expiry is a permanent credential. Reject it.
    return { ok: false, reason: "bad_claims" };
  }

  if (typeof payload.nbf === "number" && now + LEEWAY_SECONDS < payload.nbf) {
    return { ok: false, reason: "not_yet_valid" };
  }

  const id = payload.id;
  const role = payload.role;
  if (typeof id !== "string" || id.length === 0) return { ok: false, reason: "bad_claims" };
  if (role !== "Admin" && role !== "Moderator") return { ok: false, reason: "bad_claims" };

  return {
    ok: true,
    claims: {
      id,
      role,
      iat: typeof payload.iat === "number" ? payload.iat : undefined,
      exp: payload.exp,
    },
  };
}

/**
 * Expiry of a token without verifying it. Only for deciding when to refresh a cookie —
 * never for an authorization decision.
 */
export function peekExpiry(token: string | undefined | null): Date | null {
  if (!token) return null;
  const segment = token.split(".")[1];
  if (!segment) return null;
  const payload = decodeJsonSegment(segment) as { exp?: unknown } | null;
  if (!payload || typeof payload.exp !== "number") return null;
  return new Date(payload.exp * 1000);
}
