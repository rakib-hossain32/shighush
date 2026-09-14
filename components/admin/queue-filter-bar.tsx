"use client";

import { useState } from "react";
import Link from "next/link";
import { RotateCcwIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  REPORT_CATEGORIES,
  REPORT_CATEGORY_META,
  REPORT_SORTS,
  REPORT_SORT_META,
  REPORT_STATUSES,
  REPORT_STATUS_META,
  type UserRole,
} from "@/lib/domain/enums";
import { AREAS } from "@/lib/domain/geo";
import { formatBnNumber } from "@/lib/format";
import type { ModerationQueueInput } from "@/lib/domain/schemas";

export function QueueFilterBar({
  filters,
  total,
  role,
}: {
  filters: ModerationQueueInput;
  total: number;
  role: UserRole;
}) {
  const hasFilter =
    filters.view !== "all" ||
    Boolean(
      filters.assignment &&
      filters.assignment !== (role === "Moderator" ? "mine" : "all"),
    ) ||
    Boolean(filters.search) ||
    filters.status.length > 0 ||
    filters.category.length > 0 ||
    filters.area.length > 0 ||
    filters.flaggedOnly;

  return (
    <form
      action="/admin/reports"
      className="grid gap-4 border border-border bg-card p-4"
      method="GET"
    >
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3">
          <SearchIcon className="size-4 shrink-0 text-primary" />
          <Label className="sr-only" htmlFor="report-search">
            শিরোনাম, প্রতিষ্ঠান, শাখা বা এলাকা
          </Label>
          <Input
            className="h-10 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            defaultValue={filters.search ?? ""}
            id="report-search"
            name="search"
            placeholder="নথি নম্বর, শিরোনাম, প্রতিষ্ঠান বা শাখা"
            type="search"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect
            defaultValue={filters.view ?? "all"}
            label="ভিউ"
            name="view"
            options={[
              { value: "all", label: "সব নথি" },
              { value: "active", label: "চলমান" },
              { value: "completed", label: "সম্পন্ন / প্রকাশিত" },
            ]}
          />
          <FilterSelect
            defaultValue={
              filters.assignment ?? (role === "Moderator" ? "mine" : "all")
            }
            label="দায়িত্ব"
            name="assignment"
            options={[
              { value: "all", label: "সব দায়িত্ব" },
              { value: "mine", label: "আমার দায়িত্ব" },
              { value: "unassigned", label: "দায়িত্বহীন" },
            ]}
          />
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
            options={AREAS.map((area) => ({
              value: area.slug,
              label: area.nameBn,
            }))}
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
        <Label className="cursor-pointer text-sm">
          <Checkbox
            defaultChecked={filters.flaggedOnly}
            name="flaggedOnly"
            value="1"
          />
          শুধুমাত্র গোপনীয়তা সতর্কতাযুক্ত নথি
        </Label>
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
            ফিল্টার প্রয়োগ
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
  const [value, setValue] = useState(defaultValue ?? "");
  return (
    <div>
      <Label className="sr-only" htmlFor={name}>
        {label}
      </Label>
      <input name={name} type="hidden" value={value} />
      <Select value={value} onValueChange={(val) => setValue(val ?? "")}>
        <SelectTrigger className="max-w-44" id={name} size="sm">
          <SelectValue placeholder={placeholder ?? label}>
            {options.find((opt) => opt.value === value)?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {placeholder && <SelectItem value="">{placeholder}</SelectItem>}
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
