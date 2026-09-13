"use client";

import Link from "next/link";
import { ArrowUpRight, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { MobileNav } from "@/components/mobile-nav";
import { navLinks, isRouteActive } from "@/lib/navigation";

export function Header() {
  const pathname = usePathname();
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
        "sticky top-0 z-50 w-full border-b-2 border-border bg-background/95 backdrop-blur-sm transition-all",
        scrolled && "shadow-xs",
      )}
    >
      <nav className="mx-auto flex min-h-[72px] w-[calc(100%-32px)] max-w-[1320px] items-center justify-between gap-3 min-[641px]:min-h-20 min-[641px]:w-[calc(100%-72px)] min-[961px]:min-h-[96px] min-[1201px]:w-[calc(100%-112px)]">
        {/* Brand Logo */}
        <Link
          aria-label="শিঘুষ, হোমপেজ"
          className="group inline-flex shrink-0 items-center gap-2 sm:gap-2.5"
          href="/"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 40 44"
            className="h-8 w-7.5 text-foreground transition group-hover:text-primary sm:h-9 sm:w-8.5 min-[961px]:h-10 min-[961px]:w-9"
          >
            <path d="M3 3h27v28H18L7 41V31H3V3Z" fill="currentColor" />
            <path d="M11 11h12v3H11zm0 7h9v3h-9z" fill="var(--background)" />
            <path d="M30 3h7v20h-7z" fill="var(--primary)" />
          </svg>
          <span className="font-manrope text-2xl font-extrabold leading-none tracking-[-1.5px] min-[641px]:text-3xl min-[961px]:text-4xl min-[961px]:tracking-[-2px]">
            shighush<span className="text-primary">.</span>
          </span>
        </Link>

        {/* Desktop Navigation with Active States */}
        <div className="hidden items-center gap-4 lg:gap-6 xl:gap-7 min-[961px]:flex">
          {navLinks.map((link) => {
            const active = isRouteActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative py-2.5 text-[15px] font-medium transition-colors whitespace-nowrap",
                  active
                    ? "font-bold text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-primary"
                    : "text-foreground/80 hover:text-primary hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:h-[2px] hover:after:bg-border",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Action Controls & Responsive Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 min-[961px]:gap-4">
          <button
            type="button"
            aria-label={dark ? "লাইট মোড চালু করুন" : "ডার্ক মোড চালু করুন"}
            onClick={toggleTheme}
            className="grid size-9 place-items-center border-2 border-border bg-background transition hover:border-foreground min-[641px]:size-10 cursor-pointer"
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          <Link
            className="hidden items-center gap-2 border-2 border-foreground bg-primary px-3.5 py-2 text-xs font-bold text-foreground shadow-[3px_3px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none min-[641px]:inline-flex min-[961px]:px-5 min-[961px]:py-3 min-[961px]:text-sm cursor-pointer"
            href="/report/new"
          >
            <span>অভিযোগ জানান</span>
            <ArrowUpRight className="size-4" />
          </Link>

          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
