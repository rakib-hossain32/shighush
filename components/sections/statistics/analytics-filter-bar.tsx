import Link from "next/link";
import { CalendarRange } from "lucide-react";

import { cn } from "@/lib/utils";

const periods = [
  { value: "today", label: "আজ", badge: "দৈনিক" },
  { value: "7d", label: "গত ৭ দিন", badge: "সাপ্তাহিক" },
  { value: "30d", label: "গত ৩০ দিন", badge: "মাসিক" },
  { value: "year", label: "চলতি বছর", badge: "বার্ষিক" },
] as const;

export function AnalyticsFilterBar({ period }: { period: string }) {
  return (
    <div className="border-2 border-border bg-card p-4 sm:p-5 shadow-[3px_3px_0_var(--foreground)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CalendarRange className="size-4 text-primary" />
            <p className="text-sm font-bold text-foreground font-heading">
              পর্যবেক্ষণের সময়সীমা বেছে নিন
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            সব চার্ট ও সংখ্যা প্রকাশিত ভেরিফায়েড অভিযোগ থেকে রিয়েলটাইমে হিসাব করা হয়েছে।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {periods.map(({ value, label }) => {
            const isActive = period === value;
            return (
              <Link
                key={value}
                href={`/statistics?period=${value}`}
                className={cn(
                  "inline-flex items-center gap-1.5 border-2 px-3.5 py-1.5  text-xs font-bold transition-all",
                  isActive
                    ? "border-foreground bg-primary text-foreground shadow-[2px_2px_0_var(--foreground)] -translate-y-0.5"
                    : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
                )}
              >
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
