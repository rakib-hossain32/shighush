import Link from "next/link";

const periods = [
  ["today", "আজ"],
  ["7d", "গত ৭ দিন"],
  ["30d", "গত ৩০ দিন"],
  ["year", "চলতি বছর"],
] as const;

export function AnalyticsFilterBar({ period }: { period: string }) {
  return <section className="border-y-2 border-foreground py-5">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div><p className="text-sm font-bold">সময় বেছে নিন</p><p className="mt-1 text-xs text-muted-foreground">সব সংখ্যা প্রকাশিত রিপোর্ট থেকে সমষ্টি করা হয়েছে।</p></div>
      <div className="flex flex-wrap gap-2">{periods.map(([value,label]) => <Link key={value} href={`/statistics?period=${value}`} className={`border px-3 py-2 text-sm font-bold transition ${period === value ? "border-foreground bg-secondary text-secondary-foreground" : "border-border bg-card hover:border-foreground"}`}>{label}</Link>)}</div>
    </div>
  </section>;
}
