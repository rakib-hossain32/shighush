import "server-only";
import { apiRequest } from "@/services/_shared/server-api-client";
import type { ApiSuccessResponse, Statistics } from "@/services/_shared/types";
export function getStatistics() { return apiRequest<ApiSuccessResponse<Statistics>>("statistics", { tags: ["statistics"], revalidate: 300 }); }
