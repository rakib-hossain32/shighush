"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  FileText,
  MapPinned,
  Building2,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { toBnDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

// Animated counter component with smooth easing and Bengali numeral translation
function CountUp({
  end,
  start = 0,
  duration = 1800,
  prefix = "",
  suffix = "",
  padZero = false,
}: {
  end: number;
  start?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  padZero?: boolean;
}) {
  const [count, setCount] = useState(start);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check for reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCount(end);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();

          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutQuart
            const ease = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(start + (end - start) * ease);
            setCount(current);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, start, duration]);

  const rawNumberStr = padZero && count < 10 ? `0${count}` : String(count);
  const bnNumber = toBnDigits(rawNumberStr);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {bnNumber}
      {suffix}
    </span>
  );
}

const statsData = [
  {
    target: 36,
    suffix: "+",
    label: "মোট নথিভুক্ত অভিযোগ",
    category: "নাগরিক রিপোর্ট",
    description: "শিবচরের বিভিন্ন ইউনিয়ন থেকে জমা হওয়া যাচাইযোগ্য প্রতিবেদন",
    icon: FileText,
    accent: "border-primary/40 text-primary",
    badge: "সক্রিয় রেকর্ড",
  },
  {
    target: 12,
    suffix: "টি",
    label: "অন্তর্ভুক্ত ইউনিয়ন ও এলাকা",
    category: "ভৌগোলিক পরিধি",
    description: "পৌরসভা সদর ও প্রত্যন্ত চরাঞ্চলসহ বিস্তৃত নাগরিক নেটওয়ার্ক",
    icon: MapPinned,
    accent: "border-blue-500/40 text-blue-600 dark:text-blue-400",
    badge: "এলাকা কাভারেজ",
  },
  {
    target: 8,
    padZero: true,
    suffix: "টি",
    label: "সরকারি ও সেবামূলক প্রতিষ্ঠান",
    category: "জবাবদিহি সূচি",
    description: "ভূমি অফিস, স্বাস্থ্য কেন্দ্র, পুলিশ, বিদ্যুৎ ও স্থানীয় প্রশাসন",
    icon: Building2,
    accent: "border-amber-500/40 text-amber-600 dark:text-amber-400",
    badge: "প্রতিষ্ঠান রেকর্ড",
  },
  {
    target: 91,
    suffix: "%",
    label: "পরিচয় শতভাগ সুরক্ষিত",
    category: "নিরাপত্তা নীতি",
    description: "অভিযোগকারীদের সংবেদনশীল ব্যক্তিগত তথ্য স্বয়ংক্রিয়ভাবে মাস্ক করা",
    icon: ShieldCheck,
    accent: "border-emerald-500/40 text-emerald-600 dark:text-emerald-400",
    badge: "গোপনীয়তা নিশ্চিত",
  },
];

export function StatisticsSection() {
  return (
    <section
      id="statistics"
      className="relative border-b-2 border-border bg-card/60 py-14 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold tracking-wider text-primary">
              <Sparkles className="size-3.5" />
              <span>০২ — শিবচরের নাগরিক ডেটা ড্যাশবোর্ড</span>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              সংখ্যায় তুলে ধরা বাস্তব চিত্র।
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              শিবচরের বিভিন্ন ইউনিয়ন থেকে জমা হওয়া নাগরিক অভিযোগ, সেবা ভোগান্তি ও
              দাপ্তরিক অনিয়মের তথ্যভিত্তিক পরিসংখ্যান।
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/statistics"
              className="inline-flex items-center gap-2 border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-primary hover:bg-muted hover:text-primary shadow-xs cursor-pointer"
            >
              <span>পূর্ণাঙ্গ তুলনামূলক বিশ্লেষণ</span>
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* Statistics Cards Grid: 2 columns on mobile, 4 columns on tablet & desktop */}
        <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-4 lg:gap-6">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className={cn(
                  "group relative flex flex-col justify-between border-2 border-border bg-background p-3.5 sm:p-4.5 md:p-5 lg:p-6 transition-all duration-300",
                  "hover:-translate-y-1 hover:border-foreground/60 hover:shadow-[3px_3px_0_var(--foreground)] sm:hover:shadow-[4px_4px_0_var(--foreground)]",
                )}
              >
                {/* Top Accent Strip */}
                <div className="absolute inset-x-0 top-0 h-1 bg-border transition-colors group-hover:bg-primary" />

                <div>
                  {/* Card Header: Icon & Category Badge */}
                  <div className="flex items-center justify-between gap-1.5">
                    <div
                      className={cn(
                        "grid size-8 place-items-center border bg-muted/50 transition-colors group-hover:border-primary group-hover:bg-primary/10 group-hover:text-primary sm:size-9 md:size-10",
                        stat.accent,
                      )}
                    >
                      <Icon className="size-4 sm:size-4.5 md:size-5" />
                    </div>
                    <span className=" text-[9px] font-bold uppercase tracking-wider text-muted-foreground sm:text-[10px]">
                      {toBnDigits(`0${index + 1}`)}
                    </span>
                  </div>

                  {/* Big Animated Counter */}
                  <div className="mt-3.5 flex items-baseline gap-0.5 text-2xl font-extrabold tracking-tight text-foreground min-[380px]:text-3xl sm:mt-5 sm:text-4xl lg:text-5xl">
                    <CountUp
                      end={stat.target}
                      suffix={stat.suffix}
                      padZero={stat.padZero}
                    />
                  </div>

                  {/* Title & Category */}
                  <div className="mt-1.5 sm:mt-2">
                    <p className="text-xs font-bold leading-snug text-foreground sm:text-sm md:text-base">
                      {stat.label}
                    </p>
                    <span className="mt-0.5 inline-block text-[10px] font-semibold text-primary sm:text-[11px]">
                      {stat.badge}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-1.5 line-clamp-2 text-[10px] leading-normal text-muted-foreground sm:mt-2.5 sm:text-xs sm:leading-relaxed md:line-clamp-none">
                    {stat.description}
                  </p>
                </div>

                {/* Bottom Card Footer */}
                <div className="mt-3.5 border-t border-border/70 pt-2 text-[10px] font-medium text-muted-foreground sm:mt-5 sm:pt-3 sm:text-[11px]">
                  <span className="opacity-70">ক্যাটাগরি:</span> {stat.category}
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Bottom Assurance Banner */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 border border-dashed border-border bg-muted/40 p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary">
              i
            </span>
            <p className="text-xs sm:text-sm text-muted-foreground">
              <strong className="text-foreground">তথ্যসূত্র ও যাচাই:</strong>{" "}
              প্রতিটি সংখ্যা নাগরিক প্রতিবেদনের ওপর ভিত্তি করে সংকলিত; এটি কোনো
              আদালতের চূড়ান্ত আইনি রায় নয়।
            </p>
          </div>
          <Link
            href="/methodology"
            className="text-xs font-semibold text-primary underline-offset-4 hover:underline whitespace-nowrap"
          >
            যাচাই পদ্ধতি পড়ুন →
          </Link>
        </div>
      </div>
    </section>
  );
}
