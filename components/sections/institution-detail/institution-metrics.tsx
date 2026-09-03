import { BadgeCheck, Banknote, FileText, MessageSquare } from "lucide-react";

import { formatBnCurrency, formatBnNumber, formatBnPercent } from "@/lib/format";
import type { InstitutionMetrics as Metrics } from "@/services/_shared/types";

/**
 * Every figure is derived from the institution's reports (see `lib/mock/queries.ts`),
 * so these four tiles cannot disagree with the list below them — which is what happened
 * when the counts were written by hand in a fixture.
 */
export function InstitutionMetrics({
  metrics,
  reportedAmount,
}: {
  metrics: Metrics;
  /** Total BDT named across this institution's published reports. */
  reportedAmount: number;
}) {
  const tiles = [
    {
      icon: FileText,
      value: formatBnNumber(metrics.totalReports),
      label: "প্রকাশিত রিপোর্ট",
      note:
        metrics.recentReports > 0
          ? `গত ৯০ দিনে ${formatBnNumber(metrics.recentReports)}টি`
          : "গত ৯০ দিনে নতুন কিছু নেই",
    },
    {
      icon: BadgeCheck,
      value: formatBnPercent(metrics.evidenceRate),
      label: "প্রমাণ সংযুক্ত হার",
      note: "প্রকাশিত রিপোর্টের মধ্যে",
    },
    {
      icon: Banknote,
      value: reportedAmount > 0 ? formatBnCurrency(reportedAmount) : "—",
      label: "রিপোর্টে উল্লিখিত অর্থ",
      note: "অভিযোগে বলা অঙ্কের যোগফল",
    },
    {
      icon: MessageSquare,
      value: formatBnPercent(metrics.responseRate),
      label: "প্রাতিষ্ঠানিক জবাবের হার",
      note:
        metrics.responseRate > 0
          ? "জবাব আলাদা সময়চিহ্নসহ দেখানো হয়"
          : "যাচাইকৃত জবাব পাওয়া যায়নি",
    },
  ];

  return (
    <section className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
      {tiles.map(({ icon: Icon, value, label, note }) => (
        <div className="bg-card p-5" key={label}>
          <Icon className="size-5 text-primary" />
          <p className="display mt-7 text-3xl font-bold tracking-tight">{value}</p>
          <p className="mt-1 text-sm font-bold">{label}</p>
          <p className="mt-1 text-xs text-muted-foreground">{note}</p>
        </div>
      ))}
    </section>
  );
}
