import { Search } from "lucide-react";

import { INSTITUTION_CATEGORIES, INSTITUTION_CATEGORY_META } from "@/lib/domain/enums";
import { formatBnCount } from "@/lib/format";

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
      <label className="flex min-w-0 items-center gap-3 border-2 border-border bg-card px-3.5 py-2.5 sm:w-105 transition-colors focus-within:border-foreground">
        <Search className="size-4 shrink-0 text-primary" />
        <span className="sr-only">প্রতিষ্ঠান বা সেবার নাম</span>
        <input
          className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground"
          defaultValue={search ?? ""}
          name="search"
          placeholder="প্রতিষ্ঠান বা সেবার নাম খুঁজুন..."
          type="search"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 border-2 border-border bg-card px-3.5 py-2.5 text-xs  font-bold">
          <span className="sr-only">সেবার শ্রেণি</span>
          <select
            className="bg-transparent text-xs  font-bold outline-none cursor-pointer"
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

        <button
          className="inline-flex items-center justify-center border-2 border-foreground bg-primary px-5 py-2.5 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
          type="submit"
        >
          দেখুন
        </button>

        <span className=" text-xs font-bold text-muted-foreground ml-1">
          {formatBnCount(count, "প্রতিষ্ঠান")}
        </span>
      </div>
    </form>
  );
}
