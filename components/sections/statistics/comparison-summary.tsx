import { Banknote, FileText, MapPinned, ShieldCheck } from "lucide-react";

const summary = [
  [FileText, "২১", "প্রকাশিত রিপোর্ট"],
  [MapPinned, "৬", "রিপোর্ট থাকা এলাকা"],
  [Banknote, "৳ ৭২,৫০০", "রিপোর্টে উল্লিখিত অর্থ"],
  [ShieldCheck, "৪৩%", "প্রমাণ সংযুক্ত হার"],
] as const;

export function ComparisonSummary() {
  return <section className="grid gap-px border-2 border-foreground bg-foreground sm:grid-cols-2 lg:grid-cols-4">{summary.map(([Icon,value,label]) => <article className="bg-background p-5" key={label}><Icon className="size-5 text-primary"/><p className="display mt-8 text-3xl font-bold">{value}</p><p className="mt-1 text-sm text-muted-foreground">{label}</p></article>)}</section>;
}
