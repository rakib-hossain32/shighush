"use client";

/**
 * Safety and case-tracking content for `/report/new`.
 *
 * This used to be inlined in the page as an `<aside>` that only appeared beside the form
 * at `lg`. Below that it dropped underneath the whole four-step wizard — so on every phone
 * and tablet, the anonymity guarantee that decides whether someone is willing to start at
 * all was invisible until after they had finished.
 *
 * One source, two renderings:
 *   · `strip` — compact, sits above the form below `lg`.
 *   · `rail`  — the full cards, sticky beside the form at `lg` and up.
 */

import Link from "next/link";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  LockKeyholeIcon,
  ShieldCheckIcon,
  type LucideIcon,
} from "lucide-react";

const PLEDGES: Array<{
  icon: LucideIcon;
  /** Compact wording for the strip. */
  short: string;
  shortBody: string;
  /** Full wording for the rail. */
  title: string;
  body: string;
}> = [
  {
    icon: LockKeyholeIcon,
    short: "পরিচয়হীন",
    shortBody: "ইমেইল বা ফোন লাগবে না",
    title: "এককালীন গোপন ট্র্যাকিং কোড",
    body: "জমা দেওয়ার সাথে সাথে আপনি একটি এলোমেলো কোড পাবেন। কোনো ইমেইল বা ফোন নম্বরের দরকার নেই।",
  },
  {
    icon: ShieldCheckIcon,
    short: "PII ফিল্টার",
    shortBody: "প্রকাশের আগে যাচাই",
    title: "মডারেশন ও PII ফিল্টারিং",
    body: "পাবলিক নথিতে আসার পূর্বে নিরপেক্ষ মডারেটর কোনো অনিচ্ছাকৃত ব্যক্তিগত তথ্য বা ফোন নম্বর বাদ দেবেন।",
  },
  {
    icon: ArrowUpRightIcon,
    short: "EXIF মুছে যায়",
    shortBody: "ছবির লোকেশন ট্যাগ বাদ",
    title: "প্রমাণের মেটাডাটা অপসারণ",
    body: "সংযুক্ত যেকোনো ছবির এক্সিফ (EXIF) ও লোকেশন ট্যাগ স্বয়ংক্রিয়ভাবে মুছে সংরক্ষণ করা হয়।",
  },
];

/* ------------------------------------------------------------------ *
 * Strip — above the form, below `lg`
 * ------------------------------------------------------------------ */

export function SafetyStrip() {
  return (
    <section
      aria-label="নিরাপত্তা নিশ্চয়তা"
      className="rounded-none border-2 border-foreground bg-card shadow-[3px_3px_0_var(--foreground)] lg:hidden"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-border px-4 py-2.5">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
          WHISTLEBLOWER SAFETY
        </span>
        <span className="rounded-none border border-primary/40 bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
          ১০০% পরিচয়হীন
        </span>
      </div>

      <ul className="grid grid-cols-1 divide-y-2 divide-border min-[520px]:grid-cols-3 min-[520px]:divide-x-2 min-[520px]:divide-y-0">
        {PLEDGES.map((pledge) => (
          <li className="flex items-start gap-2.5 p-3" key={pledge.short}>
            <span className="grid size-7 shrink-0 place-items-center rounded-none border-2 border-border bg-background text-primary">
              <pledge.icon aria-hidden="true" className="size-3.5" />
            </span>
            <span className="min-w-0">
              <span className="block text-[11px] font-bold text-foreground">
                {pledge.short}
              </span>
              <span className="block text-[11px] leading-snug text-muted-foreground">
                {pledge.shortBody}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <div className="border-t-2 border-border px-3 py-2.5">
        <Link
          className="flex items-center justify-center gap-1.5 rounded-none border-2 border-foreground bg-background py-2 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          href="/safety"
        >
          <span>নিরাপত্তা ও এনক্রিপশন নীতি পড়ুন</span>
          <ArrowUpRightIcon aria-hidden="true" className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Rail — beside the form, `lg` and up
 * ------------------------------------------------------------------ */

export function SafetyRail() {
  return (
    <aside className="hidden space-y-6 lg:sticky lg:top-28 lg:block">
      {/* Whistleblower safety */}
      <div className="rounded-none border-2 border-border bg-card p-5 shadow-[3px_3px_0_var(--foreground)] xl:p-6">
        <div className="border-b-2 border-border pb-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
              WHISTLEBLOWER SAFETY
            </span>
            <span className="shrink-0 rounded-none border border-primary/40 bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
              ১০০% পরিচয়হীন
            </span>
          </div>
          <h3 className="mt-1.5 font-heading text-base font-bold text-foreground">
            আপনার নিরাপত্তা ও অধিকার সুরক্ষা
          </h3>
        </div>

        <ul className="space-y-4 pt-4 text-xs">
          {PLEDGES.map((pledge) => (
            <li className="flex items-start gap-3" key={pledge.title}>
              <span className="grid size-8 shrink-0 place-items-center rounded-none border-2 border-border bg-background text-primary">
                <pledge.icon aria-hidden="true" className="size-4" />
              </span>
              <span className="space-y-0.5">
                <span className="block font-bold text-foreground">
                  {pledge.title}
                </span>
                <span className="block leading-relaxed text-muted-foreground">
                  {pledge.body}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t-2 border-border pt-4">
          <Link
            className="flex items-center justify-center gap-1.5 rounded-none border-2 border-foreground bg-background py-2 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            href="/safety"
          >
            <span>নিরাপত্তা ও এনক্রিপশন নীতি পড়ুন</span>
            <ArrowUpRightIcon aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </div>

      <TrackingCard />
    </aside>
  );
}

/* ------------------------------------------------------------------ *
 * Case tracking — rail at `lg`+, standalone below the form on small screens
 * ------------------------------------------------------------------ */

export function TrackingCard({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-none border-2 border-border bg-card p-5 shadow-[3px_3px_0_var(--foreground)] ${className ?? ""}`}
    >
      <div className="border-b-2 border-border pb-3">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
          CASE TRACKING
        </span>
        <h3 className="mt-1 font-heading text-sm font-bold text-foreground">
          আগে অভিযোগ জমা দিয়েছেন?
        </h3>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        আপনার গোপন ট্র্যাকিং কোড ব্যবহার করে যেকোনো সময় অভিযোগের তদন্ত ও মডারেশন স্ট্যাটাস পরীক্ষা করুন।
      </p>
      <div className="pt-4">
        <Link
          className="flex items-center justify-center gap-1.5 rounded-none border-2 border-border bg-muted/30 py-2 text-xs font-bold text-foreground transition-all hover:border-foreground hover:bg-background hover:shadow-[2px_2px_0_var(--foreground)]"
          href="/track"
        >
          <span>কেস ট্র্যাকিং পোর্টালে যান</span>
          <ArrowRightIcon aria-hidden="true" className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
