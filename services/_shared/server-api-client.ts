import "server-only";
import { ApiError } from "@/services/_shared/api-error";
import type { ApiQuery } from "@/services/_shared/types";

type ApiRequestOptions = Omit<RequestInit, "body" | "headers" | "method"> & {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
  query?: ApiQuery;
  revalidate?: number | false;
  tags?: string[];
  timeoutMs?: number;
};
const DEFAULT_TIMEOUT_MS = 10_000;

function getApiBaseUrl() {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl)
    throw new Error("API_BASE_URL is missing. Add it to your .env.local file.");
  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
}
function createUrl(path: string, query?: ApiQuery) {
  const url = new URL(path.replace(/^\//, ""), getApiBaseUrl());
  for (const [key, value] of Object.entries(query ?? {}))
    for (const item of Array.isArray(value) ? value : [value])
      if (item !== undefined && item !== null && item !== "")
        url.searchParams.append(key, String(item));
  return url;
}
async function getErrorPayload(response: Response) {
  if (
    !(response.headers.get("content-type") ?? "").includes("application/json")
  )
    return { message: response.statusText };
  try {
    return (await response.json()) as {
      message?: string;
      code?: string;
      details?: unknown;
      error?: { message?: string; code?: string };
    };
  } catch {
    return { message: response.statusText };
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    body,
    headers,
    query,
    revalidate = 60,
    tags,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    method = "GET",
    ...init
  } = options;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const isJsonBody = body !== undefined && !(body instanceof FormData);
  
  // Read session token from cookies for authenticated requests
  const { readSessionToken } = await import("@/lib/auth/session");
  const token = await readSessionToken();
  
  try {
    const response = await fetch(createUrl(path, query), {
      ...init,
      method,
      signal: controller.signal,
      body:
        body === undefined
          ? undefined
          : isJsonBody
            ? JSON.stringify(body)
            : body,
      headers: {
        Accept: "application/json",
        ...(isJsonBody ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      next:
        method === "GET" && revalidate !== false
          ? { revalidate, tags }
          : undefined,
      cache: method === "GET" ? init.cache : "no-store",
    });
    if (!response.ok) {
      const payload = await getErrorPayload(response);
      throw new ApiError({
        status: response.status,
        message:
          payload.message ??
          payload.error?.message ??
          "অনুরোধটি সম্পন্ন করা যায়নি।",
        code: payload.code ?? payload.error?.code,
        details: payload.details,
      });
    }
    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError")
      throw new ApiError({
        status: 408,
        message: "API response পেতে সময় শেষ হয়েছে।",
      });
    throw new ApiError({
      status: 0,
      message: "API server-এর সঙ্গে সংযোগ করা যায়নি।",
      details: error,
    });
  } finally {
    clearTimeout(timeout);
  }
}
