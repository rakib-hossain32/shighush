import Link from "next/link";
import { ArrowUpRight, Building2, Clock3, MapPin, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { INSTITUTION_CATEGORY_META, INSTITUTION_TYPE_META } from "@/lib/domain/enums";
import { areaName, DISTRICT_BN } from "@/lib/domain/geo";
import { formatBnRelative } from "@/lib/format";
import type { Institution } from "@/services/_shared/types";

export function InstitutionProfileHeader({ institution }: { institution: Institution }) {
  return (
    <section className="relative overflow-hidden border border-border bg-card p-5 sm:p-7">
      <div
        aria-hidden
        className="absolute -right-10 -top-10 size-40 rounded-full border-18 border-secondary/50"
      />

      <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="success">
              {INSTITUTION_CATEGORY_META[institution.category].label}
            </StatusBadge>
            <StatusBadge tone="neutral">
              {INSTITUTION_TYPE_META[institution.type].label}
            </StatusBadge>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" />
              প্রাথমিক প্রোফাইল রেকর্ড
            </span>
          </div>

          <div className="mt-5 flex gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-foreground text-secondary">
              <Building2 className="size-6" />
            </span>
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {institution.nameBn}
              </h2>
              <p className="mt-2 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4 text-primary" />
                {areaName(institution.location.area)}, {DISTRICT_BN}
                {institution.metrics?.lastUpdatedAt && (
                  <>
                    <span className="mx-1 text-border">·</span>
                    <Clock3 className="size-4 text-primary" />
                    {formatBnRelative(institution.metrics.lastUpdatedAt)} হালনাগাদ
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            className="h-10 px-4"
            nativeButton={false}
            render={<Link href="/report/new" />}
          >
            অভিযোগ নথিভুক্ত করুন <ArrowUpRight />
          </Button>
          <Button
            className="h-10 px-4"
            nativeButton={false}
            render={<Link href={`/reports?institution=${institution.slug}`} />}
            variant="outline"
          >
            এই প্রতিষ্ঠানের সব রিপোর্ট
          </Button>
        </div>
      </div>

      <p className="relative mt-6 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
        এখানে প্রদর্শিত তথ্য নাগরিক প্রতিবেদনের সারসংক্ষেপ; এটি কোনো ব্যক্তি বা প্রতিষ্ঠানের
        বিরুদ্ধে চূড়ান্ত সিদ্ধান্ত নয়।
      </p>
    </section>
  );
}
