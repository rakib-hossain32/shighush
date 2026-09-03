import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

/**
 * Crawler policy.
 *
 * The disallow list is not cosmetic: `/admin` is the staff dashboard, and `/track`,
 * `/report/new` and `/appeal` are reporter-facing surfaces whose URLs should never turn
 * up in a search result next to someone's name. Previously only `/api/` was excluded,
 * which left the admin login page indexable.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin", "/admin/", "/track", "/report/new", "/appeal", "/people"],
    },
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
  };
}
