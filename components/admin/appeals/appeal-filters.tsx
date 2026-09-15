"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, RotateCcw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APPEAL_REASON_META, APPEAL_STATUS_META } from "@/lib/domain/enums";

const STATUS_LABELS = {
  all: "সব অবস্থা",
  received: APPEAL_STATUS_META.received.label,
  in_review: APPEAL_STATUS_META.in_review.label,
  upheld: APPEAL_STATUS_META.upheld.label,
  rejected: APPEAL_STATUS_META.rejected.label,
} as const;

const REASON_LABELS = {
  all: "সব কারণ",
  incorrect_info: APPEAL_REASON_META.incorrect_info.label,
  privacy_risk: APPEAL_REASON_META.privacy_risk.label,
  institution_response: APPEAL_REASON_META.institution_response.label,
  other: APPEAL_REASON_META.other.label,
} as const;

export function AppealFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = (searchParams.get("status") ||
    "all") as keyof typeof STATUS_LABELS;
  const reason = (searchParams.get("reason") ||
    "all") as keyof typeof REASON_LABELS;
  const search = searchParams.get("search") || "";
  const update = (key: "status" | "reason", value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") params.delete(key);
    else params.set(key, value);
    params.delete("page");
    router.push(
      params.size ? `/admin/appeals?${params.toString()}` : "/admin/appeals",
    );
  };
  const active = status !== "all" || reason !== "all" || Boolean(search);
  return (
    <div className="space-y-3">
      <form
        action="/admin/appeals"
        method="GET"
        className="flex flex-col gap-3 rounded-none border-2 border-border bg-card p-3.5 shadow-[3px_3px_0_var(--foreground)] lg:flex-row lg:items-center"
      >
        {status !== "all" && (
          <input type="hidden" name="status" value={status} />
        )}
        {reason !== "all" && (
          <input type="hidden" name="reason" value={reason} />
        )}
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Case ID বা আবেদনের বিবরণ দিয়ে খুঁজুন</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="search"
            type="search"
            defaultValue={search}
            placeholder="Case ID বা আবেদনের বিবরণ দিয়ে খুঁজুন..."
            className="h-9 w-full rounded-none border-2 border-border bg-background pl-9 pr-3 text-sm focus:border-foreground"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={status}
            onValueChange={(value) => update("status", value)}
          >
            <SelectTrigger className="h-10 min-w-40 rounded-none border-2 border-border bg-background text-xs font-bold hover:border-foreground">
              <Filter className="size-3.5 text-muted-foreground" />
              <SelectValue>
                {STATUS_LABELS[status] || STATUS_LABELS.all}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-none border-2 border-foreground shadow-[4px_4px_0_var(--foreground)]">
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <SelectItem
                  key={value}
                  value={value}
                  className="rounded-none text-xs"
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={reason}
            onValueChange={(value) => update("reason", value)}
          >
            <SelectTrigger className="h-10 min-w-44 rounded-none border-2 border-border bg-background text-xs font-bold hover:border-foreground">
              <SelectValue>
                {REASON_LABELS[reason] || REASON_LABELS.all}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-none border-2 border-foreground shadow-[4px_4px_0_var(--foreground)]">
              {Object.entries(REASON_LABELS).map(([value, label]) => (
                <SelectItem
                  key={value}
                  value={value}
                  className="rounded-none text-xs"
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="submit"
            className="h-9 rounded-none border-2 border-foreground px-4 text-xs font-bold shadow-[2px_2px_0_var(--foreground)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            খুঁজুন
          </Button>
        </div>
      </form>
      {active && (
        <div className="flex items-center justify-between gap-3 border-2 border-border bg-card px-3.5 py-2.5 text-xs shadow-[2px_2px_0_var(--foreground)]">
          <span className="text-muted-foreground">
            ফিল্টার করা ফলাফল দেখানো হচ্ছে
          </span>
          <Link
            href="/admin/appeals"
            className="inline-flex items-center gap-1 border-2 border-border bg-background px-2.5 py-1 font-bold hover:border-destructive hover:text-destructive"
          >
            <RotateCcw className="size-3" /> সব রিসেট
          </Link>
        </div>
      )}
    </div>
  );
}
