import { Building2, MapPinned, ShieldCheck } from "lucide-react";

import { formatBnNumber, formatBnPercent } from "@/lib/format";

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
    {
      icon: Building2,
      value: formatBnNumber(institutionCount),
      label: "তালিকাভুক্ত প্রতিষ্ঠান",
      note: "নিবন্ধিত ও যাচাইকৃত",
    },
    {
      icon: MapPinned,
      value: formatBnNumber(areaCount),
      label: "ইউনিয়ন ও পৌরসভা",
      note: "শিবচর উপজেলা জুড়ে",
    },
    {
      icon: ShieldCheck,
      value: formatBnPercent(evidenceRate),
      label: "প্রমাণ সংযুক্ত রিপোর্ট",
      note: "প্রকাশিত নথিতে",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {tiles.map(({ icon: Icon, value, label, note }) => (
        <div
          key={label}
          className="border-2 border-border bg-card p-4 sm:p-5 transition-all hover:border-foreground hover:shadow-[3px_3px_0_var(--foreground)]"
        >
          <div className="flex items-center gap-4">
            <span className="grid size-11 shrink-0 place-items-center border-2 border-border bg-background text-primary">
              <Icon className="size-5" />
            </span>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold  text-foreground">{value}</p>
              <p className="text-xs font-bold text-foreground mt-0.5">{label}</p>
              <p className="text-[11px] font-medium text-muted-foreground">{note}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
