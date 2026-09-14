import type { ReactNode } from "react";
import Link from "next/link";
import {
  Banknote,
  Building2,
  Calendar,
  Clock,
  Coins,
  Lock,
  MapPin,
  UserX,
} from "lucide-react";

import { MetaBadge } from "@/components/ui/status-badge";
import { MONEY_TYPE_META } from "@/lib/domain/enums";
import { areaName } from "@/lib/domain/geo";
import { officeNameBn } from "@/lib/domain/office-name";
import {
  formatBnCurrency,
  formatBnDateTime,
  formatBnDateWithPrecision,
} from "@/lib/format";
import type { ModerationReport } from "@/services/_shared/types";

export function ReportContextGrid({ report }: { report: ModerationReport }) {
  const money = report.money;
  const overcharge =
    money?.amount !== undefined && money?.officialFee !== undefined
      ? money.amount - money.officialFee
      : undefined;

  return (
    <div className="border-2 border-foreground bg-card shadow-[3px_3px_0_var(--foreground)]">
      {/* Header */}
      <div className="border-b-2 border-foreground bg-secondary/40 px-5 py-4">
        <h2 className="font-heading text-sm font-bold text-foreground sm:text-base">
          নথির বিশদ তথ্য (Incident & Institutional Context)
        </h2>
        <p className="text-xs text-muted-foreground">
          দপ্তরের তথ্য, ঘটনার সময়কাল, আর্থিক দাবি ও জড়িত ব্যক্তিদের বিবরণ
        </p>
      </div>

      {/* Grid of Context Blocks */}
      <div className="grid gap-px bg-border sm:grid-cols-2">
        {/* Block 1: Institution & Office */}
        <ContextBlock
          icon={<Building2 className="size-4 text-primary" />}
          title="প্রতিষ্ঠান ও অবস্থান"
        >
          <div className="space-y-1.5">
            <div className="font-bold text-foreground">
              {report.institution?.slug ? (
                <Link
                  className="underline decoration-border underline-offset-4 hover:decoration-primary hover:text-primary transition-colors"
                  href={`/institutions/${report.institution.slug}`}
                  target="_blank"
                >
                  {report.institution.nameBn}
                </Link>
              ) : (
                report.institution?.nameBn || "প্রতিষ্ঠান চিহ্নিত হয়নি"
              )}
            </div>

            {officeNameBn(report.location?.officeName) && (
              <p className="text-xs text-muted-foreground">
                শাখা/দপ্তর: <span className="font-semibold text-foreground">{officeNameBn(report.location?.officeName)}</span>
              </p>
            )}

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
              <MapPin className="size-3.5 text-primary shrink-0" />
              <span>{areaName(report.location?.area)}</span>
            </div>
          </div>
        </ContextBlock>

        {/* Block 2: Incident Date & Submission */}
        <ContextBlock
          icon={<Calendar className="size-4 text-primary" />}
          title="ঘটনার সময় ও ট্র্যাকিং"
        >
          <div className="space-y-2">
            <div>
              <span className="text-xs text-muted-foreground">ঘটনার সময়কাল:</span>
              <p className="text-sm font-bold text-foreground">
                {formatBnDateWithPrecision(
                  report.incidentDate?.from,
                  report.incidentDate?.precision ?? "unknown"
                )}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground border-t border-border/60 pt-2">
              <Clock className="size-3 text-muted-foreground shrink-0" />
              <span>জমা দেওয়ার সময়: <strong>{formatBnDateTime(report.submittedAt)}</strong></span>
            </div>
          </div>
        </ContextBlock>

        {/* Block 3: Money & Bribery Details */}
        <ContextBlock
          icon={<Banknote className="size-4 text-primary" />}
          title="আর্থিক লেনদেন / ঘুষের তথ্য"
        >
          {money?.amount !== undefined ? (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-black text-foreground sm:text-lg">
                  {formatBnCurrency(money.amount)}
                </span>
                {money.type && (
                  <MetaBadge meta={MONEY_TYPE_META[money.type]} short size="sm" />
                )}
              </div>

              {money.officialFee !== undefined && (
                <div className="space-y-1 border-t border-border/60 pt-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>সরকারি নির্ধারিত ফি:</span>
                    <span className="font-semibold text-foreground">{formatBnCurrency(money.officialFee)}</span>
                  </div>
                  {overcharge !== undefined && overcharge > 0 && (
                    <div className="flex justify-between font-bold text-destructive">
                      <span>দাবিকৃত অতিরিক্ত অর্থ:</span>
                      <span>+{formatBnCurrency(overcharge)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs italic text-muted-foreground">
              এই নথিতে কোনো নির্দিষ্ট অঙ্কের আর্থিক দাবি বা ঘুষের পরিমাণ উল্লেখ করা হয়নি।
            </p>
          )}
        </ContextBlock>

        {/* Block 4: Accused Individuals (§7 Privacy Safeguard) */}
        <ContextBlock
          icon={<UserX className="size-4 text-primary" />}
          title="অভিযুক্ত ব্যক্তি(গণ)"
        >
          {report.accused && report.accused.length > 0 ? (
            <ul className="space-y-2.5">
              {report.accused.map((person, index) => (
                <li
                  className="rounded-none border border-border bg-background p-2.5 text-xs"
                  key={`accused-${index}`}
                >
                  <div className="font-bold text-foreground">
                    {person.designationSubmitted || "পদবি উল্লেখ নেই"}
                  </div>

                  {person.nameSubmitted && person.nameSubmitted !== "—" ? (
                    <div className="mt-1.5 flex items-center gap-1.5 text-destructive font-semibold">
                      <Lock className="size-3 shrink-0" />
                      <span>নাম: {person.nameSubmitted}</span>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">
                        (প্রকাশে §৭ মানুন)
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">নাম গোপন রাখা হয়েছে</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs italic text-muted-foreground">
              নির্দিষ্ট কোনো ব্যক্তির নাম বা পদবি উল্লেখ করা হয়নি (প্রাতিষ্ঠানিক স্তর)।
            </p>
          )}
        </ContextBlock>
      </div>
    </div>
  );
}

function ContextBlock({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-card p-5">
      <div className="mb-3 flex items-center gap-2 border-b border-border/60 pb-2">
        <span className="grid size-6 place-items-center bg-primary/10 text-primary">
          {icon}
        </span>
        <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}
