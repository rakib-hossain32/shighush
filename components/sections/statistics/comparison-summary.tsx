import { Banknote, FileText, MapPinned, ShieldCheck } from "lucide-react";

const summaryCards = [
  {
    icon: FileText,
    value: "২১",
    label: "প্রকাশিত নাগরিক রিপোর্ট",
    trend: "+৪ এই সপ্তাহে",
    subtext: "সব রিপোর্ট যাচাই প্রক্রিয়াধীন",
  },
  {
    icon: MapPinned,
    value: "৭",
    label: "হটস্পট এলাকা ও ইউনিয়ন",
    trend: "উপজেলার মোট ১৯টি অঞ্চল",
    subtext: "পৌরসভা ও ৬টি ইউনিয়ন",
  },
  {
    icon: Banknote,
    value: "৳ ৭২,৫০০",
    label: "রিপোর্টে উল্লিখিত দাবি/অর্থ",
    trend: "গড় দাবি ৳ ৩,৪৫০",
    subtext: "নাগরিকের দাবিকৃত পরিমাণ",
  },
  {
    icon: ShieldCheck,
    value: "৮৪%",
    label: "প্রমাণ সংযুক্তির হার",
    trend: "উচ্চ নির্ভরযোগ্যতা",
    subtext: "ডকুমেন্ট বা ডিজিটাল প্রমাণসহ",
  },
] as const;

export function ComparisonSummary() {
  return (
    <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {summaryCards.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="flex flex-col justify-between border-2 border-border bg-card p-4 sm:p-5 transition-all hover:border-foreground hover:shadow-[3px_3px_0_var(--foreground)] hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between gap-2 border-b-2 border-border pb-3">
                <span className="grid size-9 place-items-center border-2 border-border bg-background text-primary">
                  <Icon className="size-4.5" />
                </span>
                <span className="border border-border bg-background px-2 py-0.5  text-[10px] font-bold text-muted-foreground">
                  {item.trend}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground  tracking-tight">
                  {item.value}
                </p>
                <p className="mt-1 text-xs font-bold text-foreground font-heading">
                  {item.label}
                </p>
              </div>
            </div>

            <p className="mt-4 text-[11px] text-muted-foreground pt-3 border-t border-border/80">
              {item.subtext}
            </p>
          </div>
        );
      })}
    </section>
  );
}
