import { AlertCircle, Banknote, PieChart } from "lucide-react";

import { formatBnNumber } from "@/lib/format";

const factors = [
  { factor: "ঘুষ / অতিরিক্ত অর্থ দাবি", count: 8, amount: "৳ ৪২,৫০০", percent: "৩৮%" },
  { factor: "সেবা-বঞ্চনা ও ইচ্ছাকৃত বিলম্ব", count: 6, amount: "৳ ১২,০০০", percent: "২৮%" },
  { factor: "তথ্য গোপন ও অসহযোগিতা", count: 4, amount: "—", percent: "১৯%" },
  { factor: "অপ্রয়োজনীয় কাগজপত্র তলব", count: 3, amount: "৳ ১৮,০০০", percent: "১৫%" },
];

const dates = [
  { period: "আজ", amount: "৳ ২,৫০০", note: "১টি নতুন ঘটনার তথ্য" },
  { period: "গত ৭ দিন", amount: "৳ ১৮,০০০", note: "৫টি দাবির সমষ্টি" },
  { period: "গত ৩০ দিন", amount: "৳ ৭২,৫০০", note: "২১টি নথির সমষ্টি" },
];

export function FactorAndMoneySection() {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      {/* Factor Breakdown Docket */}
      <div className="border-2 border-border bg-card shadow-[4px_4px_0_var(--foreground)] flex flex-col justify-between">
        <div>
          <div className="border-b-2 border-border p-5 sm:p-6 bg-card">
            <div className="flex items-center gap-1.5">
              <PieChart className="size-4 text-primary" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                NATURE OF ISSUES
              </span>
            </div>
            <h3 className="text-xl font-extrabold font-heading mt-1 text-foreground">
              কোন বিষয়ে বেশি অভিযোগ জমা পড়েছে?
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              অভিযোগের ধরন অনুযায়ী পরিসংখ্যান ও দাবিকৃত অর্থের বিভাজন।
            </p>
          </div>

          <div className="p-5 sm:p-6 space-y-3">
            {factors.map((item) => (
              <div
                key={item.factor}
                className="flex items-center justify-between border-2 border-border bg-background p-3.5 transition-all hover:border-foreground hover:shadow-[2px_2px_0_var(--foreground)]"
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground font-heading">
                    {item.factor}
                  </span>
                  <div className="flex items-center gap-2  text-[11px] text-muted-foreground">
                    <span>{formatBnNumber(item.count)}টি রিপোর্ট</span>
                    <span>·</span>
                    <span>সার্বিক {item.percent}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs  font-bold text-foreground block">
                    {item.amount}
                  </span>
                  <span className="text-[10px]  text-muted-foreground">উল্লেখিত অর্থ</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Money & Claims Breakdown Docket */}
      <div className="border-2 border-border bg-card shadow-[4px_4px_0_var(--foreground)] flex flex-col justify-between">
        <div>
          <div className="border-b-2 border-border p-5 sm:p-6 bg-card">
            <div className="flex items-center gap-1.5">
              <Banknote className="size-4 text-primary" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                CLAIM SUMMARIES
              </span>
            </div>
            <h3 className="text-xl font-extrabold font-heading mt-1 text-foreground">
              রিপোর্টে বর্ণিত অর্থের পরিমাণ
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              অভিযোগকারী কর্তৃক প্রতিবেদনে উল্লিখিত দাবিকৃত বা অতিরিক্ত খরচের হিসাব।
            </p>
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            <div className="grid gap-3">
              {dates.map((item) => (
                <div
                  key={item.period}
                  className="flex items-center justify-between border-2 border-border bg-background p-3.5 transition-all hover:border-foreground hover:shadow-[2px_2px_0_var(--foreground)]"
                >
                  <div>
                    <span className="text-xs font-bold text-foreground font-heading">
                      {item.period}
                    </span>
                    <p className="text-[11px]  text-muted-foreground mt-0.5">
                      {item.note}
                    </p>
                  </div>
                  <span className="text-xl font-black  text-foreground">
                    {item.amount}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-2 border-amber-500/40 bg-amber-500/10 p-3.5 flex items-start gap-2.5 text-xs text-foreground">
              <AlertCircle className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <p className="leading-relaxed">
                <strong className="font-bold">গুরুত্বপূর্ণ:</strong> এটি নাগরিকের বক্তব্যে উল্লিখিত অঙ্ক। এটি কোনো আদালতের প্রমাণিত লেনদেন বা জরিমানা নয়।
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

