import { Building2, MapPinned, ShieldCheck } from "lucide-react";

import { formatBnNumber, formatBnPercent } from "@/lib/format";

/**
 * Counts arrive as props from the page, which reads them from the same query layer the
 * cards below use. Previously these three tiles were hardcoded ("৩২", "১৮", "৪৩%") and
 * contradicted the grid underneath them.
 */
export function InstitutionSummary({
  institutionCount,
  areaCount,
  evidenceRate,
}: {
  institutionCount: number;
  areaCount: number;
  /** 0–1 across every published report. */
  evidenceRate: number;
}) {
  const tiles = [
    { icon: Building2, value: formatBnNumber(institutionCount), label: "তালিকাভুক্ত প্রতিষ্ঠান" },
    { icon: MapPinned, value: formatBnNumber(areaCount), label: "ইউনিয়ন ও পৌরসভা" },
    { icon: ShieldCheck, value: formatBnPercent(evidenceRate), label: "প্রমাণ সংযুক্ত রিপোর্ট" },
  ];

  return (
    <section className="grid divide-y divide-border border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {tiles.map(({ icon: Icon, value, label }) => (
        <article
          className="flex items-center gap-4 px-4 py-5 first:pl-0 last:pr-0"
          key={label}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
            <Icon className="size-5" />
          </span>
          <div>
            <p className="display text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
