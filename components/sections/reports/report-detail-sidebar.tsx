import type { ReactNode } from "react";
import Link from "next/link";
import { BadgeCheck, Banknote, CalendarDays, Flag, Landmark, MapPin } from "lucide-react";

import { MetaBadge } from "@/components/ui/status-badge";
import { MONEY_TYPE_META, VERIFICATION_LEVEL_META } from "@/lib/domain/enums";
import { areaName } from "@/lib/domain/geo";
import { formatBnCurrency, formatBnDateWithPrecision } from "@/lib/format";
import type { PublicReport } from "@/services/_shared/types";

export function ReportDetailSidebar({ report }: { report: PublicReport }) {
  const money = report.money;
  // The gap between what was asked and the gazetted fee is the substance of a bribery
  // report, so it is stated explicitly rather than left for the reader to subtract.
  const overcharge =
    money?.amount !== undefined && money.officialFee !== undefined
      ? money.amount - money.officialFee
      : undefined;

  return (
    <aside className="grid h-fit gap-5">
      <section className="border-2 border-foreground bg-background p-5">
        <p className="mono text-[11px] font-bold tracking-[.15em] text-primary">নথি তথ্য</p>

        <dl className="mt-5 divide-y divide-border">
          <DataRow icon={<BadgeCheck />} label="যাচাইয়ের স্তর">
            <MetaBadge meta={VERIFICATION_LEVEL_META[report.verificationLevel]} />
          </DataRow>

          <DataRow icon={<CalendarDays />} label="ঘটনার সময়">
            {formatBnDateWithPrecision(
              report.incidentDate?.from,
              report.incidentDate?.precision ?? "unknown",
            )}
          </DataRow>

          <DataRow icon={<MapPin />} label="এলাকা">
            {areaName(report.location.area)}
          </DataRow>

          <DataRow icon={<Landmark />} label="প্রতিষ্ঠান">
            <Link
              className="underline underline-offset-4 hover:text-primary"
              href={`/institutions/${report.institution.slug}`}
            >
              {report.institution.nameBn}
            </Link>
          </DataRow>

          {money?.amount !== undefined && (
            <DataRow icon={<Banknote />} label="রিপোর্টে উল্লিখিত অর্থ">
              <span className="flex flex-wrap items-center gap-2">
                {formatBnCurrency(money.amount)}
                {money.type && <MetaBadge meta={MONEY_TYPE_META[money.type]} size="sm" short />}
              </span>
              {money.officialFee !== undefined && (
                <span className="mt-1.5 block text-xs font-normal leading-5 text-muted-foreground">
                  সরকারি নির্ধারিত ফি {formatBnCurrency(money.officialFee)}
                  {overcharge !== undefined && overcharge > 0 && (
                    <> · অতিরিক্ত {formatBnCurrency(overcharge)}</>
                  )}
                </span>
              )}
            </DataRow>
          )}
        </dl>
      </section>

      <section className="border border-border bg-muted p-5">
        <p className="text-sm font-bold">কোনো সমস্যা চোখে পড়েছে?</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          ভুল তথ্য, privacy risk বা হুমকি থাকলে জানান।
        </p>
        <Link
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold underline"
          href="/appeal"
        >
          <Flag className="size-4 text-primary" />
          আপিল বা flag করুন
        </Link>
      </section>
    </aside>
  );
}

function DataRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="py-4 first:pt-0">
      <dt className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="text-primary [&_svg]:size-4">{icon}</span>
        {label}
      </dt>
      <dd className="mt-2 text-sm font-bold leading-5">{children}</dd>
    </div>
  );
}
