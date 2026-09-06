"use client";

import Link from "next/link";
import { ArrowUpRight, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { MobileNav } from "@/components/mobile-nav";

export function Header() {
  const scrolled = useScroll(10);
  const [dark, setDark] = useState(() =>
    typeof document === "undefined"
      ? false
      : document.documentElement.classList.contains("dark"),
  );
  function toggleTheme() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  }
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm transition-all",
        scrolled && "shadow-sm",
      )}
    >
      <nav className="mx-auto flex min-h-20 w-[calc(100%-40px)] max-w-[1320px] items-center justify-between gap-3 min-[641px]:w-[calc(100%-72px)] min-[961px]:min-h-[102px] min-[1201px]:w-[calc(100%-112px)]">
        <Link
          aria-label="শিঘুষ, হোম"
          className="group inline-flex shrink-0 items-center gap-2.5"
          href="/"
        >
          <svg aria-hidden="true" viewBox="0 0 40 44" className="h-10 w-9 text-foreground transition group-hover:text-primary"><path d="M3 3h27v28H18L7 41V31H3V3Z" fill="currentColor" /><path d="M11 11h12v3H11zm0 7h9v3h-9z" fill="var(--background)" /><path d="M30 3h7v20h-7z" fill="var(--primary)" /></svg>
          <span className="font-manrope text-2xl font-extrabold leading-none tracking-[-2px] min-[641px]:text-4xl">
            shighush<span className="text-primary">.</span>
          </span>
        </Link>
        <div className="hidden items-center gap-[33px] min-[961px]:flex">
          <Link
            className="border-b border-transparent py-3 text-sm font-medium transition hover:border-primary"
            href="/reports"
          >
            রিপোর্টসমূহ
          </Link>
          <Link
            className="border-b border-transparent py-3 text-sm font-medium transition hover:border-primary"
            href="/#how-it-works"
          >
            যেভাবে কাজ করে
          </Link>
          <Link
            className="border-b border-transparent py-3 text-sm font-medium transition hover:border-primary"
            href="/methodology"
          >
            আমাদের কথা
          </Link>
        </div>
        <div className="flex items-center gap-2 min-[641px]:gap-[22px]">
          <button
            type="button"
            aria-label={dark ? "লাইট মোড চালু করুন" : "ডার্ক মোড চালু করুন"}
            onClick={toggleTheme}
            className="grid size-[42px] place-items-center rounded-full border border-transparent transition hover:border-border hover:bg-muted"
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <Link
            className="hidden items-center gap-5 bg-foreground px-[19px] py-3 text-sm font-semibold text-background transition hover:-translate-y-0.5 min-[641px]:inline-flex"
            href="/report/new"
          >
            অভিযোগ জানান <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <MobileNav />
      </nav>
    </header>
  );
}
