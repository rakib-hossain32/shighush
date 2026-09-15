import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Banknote,
  CheckCircle2,
  Clock,
  FileText,
  ShieldAlert,
  Zap,
} from "lucide-react";

import { formatBnCurrency, formatBnNumber } from "@/lib/format";

export type DashboardStatsData = {
  totalReports: number;
  awaitingReview: number;
  publishedReports: number;
  todayReports: number;
  piiAlertsCount: number;
  reportedAmountBdt?: number;
};

export function OverviewStatCards({ stats }: { stats: DashboardStatsData }) {
  const cards = [
    {
      key: "total",
      label: "মোট নথিভুক্ত অভিযোগ",
      value: formatBnNumber(stats.totalReports),
      subtext: "প্ল্যাটফর্মের সর্বমোট অভিযোগ",
      icon: FileText,
      href: "/admin/reports",
      badge: null,
      accentBorder: "border-foreground",
    },
    {
      key: "queue",
      label: "রিভিউ অপেক্ষমাণ কিউ",
      value: formatBnNumber(stats.awaitingReview),
      subtext: "যাচাই ও সিদ্ধান্তের প্রতীক্ষায়",
      icon: Clock,
      href: "/admin/reports?status=submitted,under_review,needs_info",
      badge: stats.awaitingReview > 0 ? `${formatBnNumber(stats.awaitingReview)}টি বাকি` : "কিউ খালি",
      badgeTone: stats.awaitingReview > 0 ? "warning" : "neutral",
      accentBorder: stats.awaitingReview > 0 ? "border-primary" : "border-foreground",
    },
    {
      key: "published",
      label: "যাচাইকৃত প্রকাশিত নথি",
      value: formatBnNumber(stats.publishedReports),
      subtext: "নাগরিক স্বার্থে সর্বসাধারণের জন্য উন্মুক্ত",
      icon: CheckCircle2,
      href: "/admin/reports?status=published",
      badge: "জনস্বার্থে প্রকাশিত",
      badgeTone: "success",
      accentBorder: "border-foreground",
    },
    {
      key: "today",
      label: "আজকের নতুন অভিযোগ",
      value: formatBnNumber(stats.todayReports),
      subtext: "আজ মধ্যরাত থেকে বর্তমান সময় পর্যন্ত",
      icon: Zap,
      href: "/admin/reports?sort=newest",
      badge: stats.todayReports > 0 ? "আজকে সক্রিয়" : null,
      badgeTone: "neutral",
      accentBorder: "border-foreground",
    },
    {
      key: "bribe_amount",
      label: "দাবিকৃত / প্রদত্ত ঘুষ",
      value: stats.reportedAmountBdt && stats.reportedAmountBdt > 0 
        ? formatBnCurrency(stats.reportedAmountBdt) 
        : "তথ্য নেই",
      subtext: "নথিতে উল্লেখিত মোট আর্থিক দুর্নীতি",
      icon: Banknote,
      href: "/admin/reports?category=bribery,extortion",
      badge: "আর্থিক সংশ্লিষ্টতা",
      badgeTone: "primary",
      accentBorder: "border-foreground",
    },
    {
      key: "pii_alerts",
      label: "গোপনীয়তা ঝুঁকি (PII)",
      value: formatBnNumber(stats.piiAlertsCount),
      subtext: "মোবাইল/NID ইত্যাদি তথ্য চিহ্নিত",
      icon: ShieldAlert,
      href: "/admin/reports?flaggedOnly=true",
      badge: stats.piiAlertsCount > 0 ? "রিডাকশন প্রয়োজন" : "সুরক্ষিত",
      badgeTone: stats.piiAlertsCount > 0 ? "danger" : "success",
      accentBorder: stats.piiAlertsCount > 0 ? "border-destructive" : "border-foreground",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            href={card.href}
            key={card.key}
            className={`group relative flex flex-col justify-between border-2 ${card.accentBorder} bg-card p-5 shadow-[3px_3px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="grid size-9 shrink-0 place-items-center border border-foreground bg-muted/60 text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-4" />
                </span>

                <div className="flex items-center gap-1.5">
                  {card.badge && (
                    <span
                      className={`rounded-none border border-foreground px-2 py-0.5 text-[11px] font-bold shadow-[1px_1px_0_var(--foreground)] ${
                        card.badgeTone === "danger"
                          ? "bg-destructive text-destructive-foreground"
                          : card.badgeTone === "warning"
                          ? "bg-amber-400 text-foreground"
                          : card.badgeTone === "success"
                          ? "bg-accent text-accent-foreground"
                          : card.badgeTone === "primary"
                          ? "bg-primary text-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {card.badge}
                    </span>
                  )}
                  <ArrowUpRight className="size-4 text-muted-foreground opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground group-hover:opacity-100" />
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {card.label}
                </p>
                <p className="font-heading text-3xl font-black text-foreground sm:text-4xl">
                  {card.value}
                </p>
              </div>
            </div>

            <p className="mt-3 border-t border-border/80 pt-2.5 text-xs text-muted-foreground">
              {card.subtext}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
