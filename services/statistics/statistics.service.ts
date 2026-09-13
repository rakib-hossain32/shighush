import "server-only";
import { apiRequest } from "@/services/_shared/server-api-client";
import type { ApiSuccessResponse, Statistics } from "@/services/_shared/types";

export function getStatistics(period?: string) {
  return apiRequest<ApiSuccessResponse<Statistics>>("statistics", {
    query: period ? { period } : undefined,
    tags: ["statistics"],
    revalidate: 300,
  });
}
