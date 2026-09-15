import "server-only";
import { apiRequest } from "@/services/_shared/server-api-client";
import type { ApiSuccessResponse, Statistics } from "@/services/_shared/types";

export function getStatistics(params?: { period?: string; scope?: string } | string) {
  const query = typeof params === "string" ? { period: params } : params;
  return apiRequest<ApiSuccessResponse<Statistics>>("statistics", {
    query,
    tags: ["statistics"],
    revalidate: 300,
  });
}
