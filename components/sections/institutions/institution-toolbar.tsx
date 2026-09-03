import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { INSTITUTION_CATEGORIES, INSTITUTION_CATEGORY_META } from "@/lib/domain/enums";
import { formatBnCount } from "@/lib/format";

/**
 * A plain `<form method="GET">`. Submitting rewrites the query string, the Server
 * Component re-renders with the new filter, and the browser back button works — no
 * client state, no `useState`, no hydration cost. The field names are exactly the keys
 * in `institutionFilterSchema`, so the URL is the contract.
 */
export function InstitutionToolbar({
  count,
  search,
  category,
}: {
  count: number;
  search?: string;
  category: readonly string[];
}) {
  const selected = category[0] ?? "";

  return (
    <form
      action="/institutions"
      className="flex flex-col gap-4 border-y-2 border-foreground py-5 sm:flex-row sm:items-center sm:justify-between"
      method="GET"
    >
      <label className="flex min-w-0 items-center gap-3 border border-border bg-card px-3 py-3 sm:w-105">
        <Search className="size-4 shrink-0 text-primary" />
        <span className="sr-only">প্রতিষ্ঠান বা সেবার নাম</span>
        <input
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          defaultValue={search ?? ""}
          name="search"
          placeholder="প্রতিষ্ঠান বা সেবার নাম খুঁজুন"
          type="search"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 border border-border bg-card px-3 py-3 text-sm font-bold">
          <span className="sr-only">সেবার শ্রেণি</span>
          <select
            className="bg-transparent text-sm font-bold outline-none"
            defaultValue={selected}
            name="category"
          >
            <option value="">সব শ্রেণি</option>
            {INSTITUTION_CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {INSTITUTION_CATEGORY_META[value].label}
              </option>
            ))}
          </select>
        </label>

        <Button className="h-11 px-5" type="submit">
          দেখুন
        </Button>

        <span className="text-sm text-muted-foreground">
          {formatBnCount(count)} পাওয়া গেছে
        </span>
      </div>
    </form>
  );
}
