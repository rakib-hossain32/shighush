import Link from "next/link";
import {
  ExternalLink,
  Inbox,
  Radio,
  RefreshCw,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatBnDate } from "@/lib/format";
import type { Session } from "@/lib/auth/dal";

export function OverviewHeader({ session }: { session: Session }) {
  const isBanglaDate = formatBnDate(new Date());

  return (
    <div className="relative overflow-hidden border-2 border-foreground bg-card p-6 shadow-[4px_4px_0_var(--foreground)]">
      {/* Decorative accent top bar */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-none border border-foreground bg-primary px-2.5 py-0.5 text-xs font-bold text-foreground shadow-[1px_1px_0_var(--foreground)]">
              <ShieldCheck className="size-3.5" />
              {session.role === "Admin" ? "প্রধান প্রশাসক (Admin)" : "মডারেটর (Moderator)"}
            </span>

            <span className="inline-flex items-center gap-1.5 border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              মডারেশন ইঞ্জিন সক্রিয়
            </span>

            <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:inline-flex">
              <RefreshCw className="size-3 text-primary animate-spin [animation-duration:8s]" />
              রাউন্ড-রবিন অটো-বণ্টন চালু
            </span>
          </div>

          <h1 className="font-heading text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            স্বাগতম, {session.role === "Admin" ? "অ্যাডমিনিস্ট্রেটর" : "মডারেটর"} 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            আজ {isBanglaDate}। প্ল্যাটফর্মের সর্বশেষ অভিযোগ, কিউ অবস্থা, গোপনীয়তা সতর্কতা এবং সার্বিক
            মডারেশন কার্যক্রম এক নজরে পর্যবেক্ষণ করুন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            asChild
            className="h-10 rounded-none border-2 border-foreground bg-primary px-4 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            <Link href="/admin/reports?status=submitted,under_review,needs_info">
              <Inbox className="size-4" />
              রিভিউ কিউ
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-10 rounded-none border-2 border-foreground bg-background px-4 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none hover:bg-muted"
          >
            <Link href="/admin/reports?assignment=mine">
              <UserCheck className="size-4" />
              আমার দায়িত্বপ্রাপ্ত
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-10 rounded-none border-2 border-border bg-background px-3 text-xs font-bold text-muted-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:border-foreground hover:text-foreground hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-3.5" />
              পাবলিক সাইট
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
