import Link from "next/link";
import { RotateCcwIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  REPORT_CATEGORIES,
  REPORT_CATEGORY_META,
  REPORT_SORTS,
  REPORT_SORT_META,
  REPORT_STATUSES,
  REPORT_STATUS_META,
} from "@/lib/domain/enums";
import { AREAS } from "@/lib/domain/geo";
import { formatBnNumber } from "@/lib/format";
import type { ModerationQueueInput } from "@/lib/domain/schemas";

/**
 * Queue filters as a GET form — the URL is the state, exactly as on the public site.
 *
 * That matters more here: a moderator can bookmark "unverified bribery reports in
 * Kanthalbari awaiting review", paste the link to a colleague, and the back button still
 * behaves. None of that works with `useState`.
 *
 * `<select multiple>` is deliberately avoided — awkward on touch, and its value is
 * invisible until opened. Single selects submit one value each; the schema's `multi()`
 * helper still accepts repeated params when a link supplies them.
 */
export function QueueFilterBar({
  filters,
  total,
}: {
  filters: ModerationQueueInput;
  total: number;
}) {
  const hasFilter =
    Boolean(filters.search) ||
    filters.status.length > 0 ||
    filters.category.length > 0 ||
    filters.area.length > 0 ||
    filters.flaggedOnly;

  return (
    <form
      action="/admin/reports"
      className="flex flex-col gap-3 border border-border bg-card p-4"
      method="GET"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="flex min-w-0 flex-1 items-center gap-2 border border-border bg-background px-3 py-2">
          <SearchIcon className="size-4 shrink-0 text-primary" />
          <span className="sr-only">নথি, প্রতিষ্ঠান বা এলাকা</span>
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            defaultValue={filters.search ?? ""}
            name="search"
            placeholder="নথি নম্বর, শিরোনাম, প্রতিষ্ঠান বা এলাকা"
            type="search"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect
            defaultValue={filters.status[0] ?? ""}
            label="অবস্থা"
            name="status"
            options={REPORT_STATUSES.map((value) => ({
              value,
              label: REPORT_STATUS_META[value].label,
            }))}
            placeholder="সব অবস্থা"
          />
          <FilterSelect
            defaultValue={filters.category[0] ?? ""}
            label="ধরন"
            name="category"
            options={REPORT_CATEGORIES.map((value) => ({
              value,
              label: REPORT_CATEGORY_META[value].label,
            }))}
            placeholder="সব ধরন"
          />
          <FilterSelect
            defaultValue={filters.area[0] ?? ""}
            label="এলাকা"
            name="area"
            options={AREAS.map((area) => ({ value: area.slug, label: area.nameBn }))}
            placeholder="সব এলাকা"
          />
          <FilterSelect
            defaultValue={filters.sort}
            label="সাজান"
            name="sort"
            options={REPORT_SORTS.map((value) => ({
              value,
              label: REPORT_SORT_META[value].label,
            }))}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
          <input
            className="size-4 accent-destructive"
            defaultChecked={filters.flaggedOnly}
            name="flaggedOnly"
            type="checkbox"
            value="1"
          />
          শুধু গোপনীয়তা সতর্কতাযুক্ত নথি
        </label>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {formatBnNumber(total)}টি নথি
          </span>
          {hasFilter && (
            <Link
              className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground underline"
              href="/admin/reports"
            >
              <RotateCcwIcon className="size-3.5" />
              রিসেট
            </Link>
          )}
          <Button size="sm" type="submit">
            প্রয়োগ করুন
          </Button>
        </div>
      </div>
    </form>
  );
}

function FilterSelect({
  label,
  name,
  options,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex items-center gap-2 border border-border bg-background px-2.5 py-2 text-sm">
      <span className="sr-only">{label}</span>
      <select
        className="max-w-40 bg-transparent text-sm font-medium outline-none"
        defaultValue={defaultValue}
        name={name}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
