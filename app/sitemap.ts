import type { MetadataRoute } from "next";

import { getInstitutions, getReports } from "@/services";
import { SITE_URL } from "@/lib/seo";

/**
 * Only pages that are safe to index appear here. `/report/new`, `/track`, `/appeal`,
 * `/people` and `/admin` are all `index: false` in their metadata and are additionally
 * disallowed in `robots.ts` — a sitemap entry would contradict both.
 */
const staticRoutes = [
  "/",
  "/reports",
  "/institutions",
  "/map",
  "/statistics",
  "/methodology",
  "/safety",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const url = (path: string) => new URL(path, SITE_URL).toString();

  // Fetch all published reports and institutions
  const reportsResponse = await getReports({ limit: 1000 });
  const institutionsResponse = await getInstitutions({ limit: 1000 });
  const reports = Array.isArray(reportsResponse.data)
    ? reportsResponse.data
    : [];
  const institutions = Array.isArray(institutionsResponse.data)
    ? institutionsResponse.data
    : [];

  return [
    ...staticRoutes.map((path) => ({
      url: url(path),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.8,
    })),
    ...reports.map((report) => ({
      url: url(`/reports/${report.slug}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...institutions.map((institution) => ({
      url: url(`/institutions/${institution.slug}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
