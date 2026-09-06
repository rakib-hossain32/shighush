import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { formatBnNumber } from "@/lib/format";
import type { PaginationMeta } from "@/services/_shared/types";

/**
 * Link-based pagination. No client JavaScript: every page is a real URL, so it is
 * shareable, crawlable and back-button correct. Replaces the "আরও দেখুন" button that
 * had no handler.
 *
 * `params` is the current searchParams; `page` is overwritten and everything else
 * (filters, search, sort) is carried through.
 */
export function Pagination({
  meta,
  basePath,
  params = {},
}: {
  meta: PaginationMeta;
  basePath: string;
  params?: Record<string, string | string[] | undefined>;
}) {
  // Safety: handle undefined or invalid meta
  const safeMeta = meta || { page: 1, limit: 20, total: 0, totalPages: 1 };
  const { page = 1, totalPages = 1, total = 0 } = safeMeta;
  
  if (totalPages <= 1) return null;

  const href = (page: number) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (key === "page" || value === undefined) continue;
      for (const item of Array.isArray(value) ? value : [value]) {
        if (item !== "") query.append(key, item);
      }
    }
    if (page > 1) query.set("page", String(page));
    const qs = query.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  // A compact window around the current page, so 40 pages do not render 40 links.
  const windowStart = Math.max(1, Math.min(page - 1, totalPages - 2));
  const windowEnd = Math.min(totalPages, windowStart + 2);
  const pages = Array.from(
    { length: windowEnd - windowStart + 1 },
    (_, i) => windowStart + i,
  );

  return (
    <nav
      aria-label="পৃষ্ঠা নির্বাচন"
      className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5 text-sm"
    >
      <p className="text-muted-foreground">
        মোট {formatBnNumber(total)}টির মধ্যে পৃষ্ঠা {formatBnNumber(page)} /{" "}
        {formatBnNumber(totalPages)}
      </p>

      <div className="flex items-center gap-1.5">
        {page > 1 ? (
          <Link
            className="inline-flex items-center gap-1 border border-foreground px-3 py-2 font-bold"
            href={href(page - 1)}
            rel="prev"
          >
            <ChevronLeft className="size-4" />
            আগের
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 border border-border px-3 py-2 font-bold text-muted-foreground">
            <ChevronLeft className="size-4" />
            আগের
          </span>
        )}

        {pages.map((value) =>
          value === page ? (
            <span
              aria-current="page"
              className="min-w-9 border border-foreground bg-foreground px-3 py-2 text-center font-bold text-background"
              key={value}
            >
              {formatBnNumber(value)}
            </span>
          ) : (
            <Link
              className="min-w-9 border border-border px-3 py-2 text-center font-bold hover:border-foreground"
              href={href(value)}
              key={value}
            >
              {formatBnNumber(value)}
            </Link>
          ),
        )}

        {page < totalPages ? (
          <Link
            className="inline-flex items-center gap-1 border border-foreground px-3 py-2 font-bold"
            href={href(page + 1)}
            rel="next"
          >
            পরের
            <ChevronRight className="size-4" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 border border-border px-3 py-2 font-bold text-muted-foreground">
            পরের
            <ChevronRight className="size-4" />
          </span>
        )}
      </div>
    </nav>
  );
}
