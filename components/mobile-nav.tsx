"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import {
  X,
  Menu,
  FileText,
  Building2,
  MapPin,
  BarChart3,
  KeyRound,
  HelpCircle,
  ShieldCheck,
  Scale,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks, secondaryLinks, isRouteActive } from "@/lib/navigation";

const navIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "/reports": FileText,
  "/institutions": Building2,
  "/map": MapPin,
  "/statistics": BarChart3,
  "/track": KeyRound,
  "/methodology": HelpCircle,
};

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [open]);

  return (
    <div className="min-[961px]:hidden">
      {/* Trigger Button */}
      <button
        type="button"
        aria-controls="mobile-navigation-drawer"
        aria-expanded={open}
        aria-label={open ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
        onClick={() => setOpen(!open)}
        className="grid size-9 place-items-center rounded-md border border-border bg-background text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-[641px]:size-10 cursor-pointer"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {/* Drawer Portal */}
      {mounted &&
        open &&
        createPortal(
          <div
            id="mobile-navigation-drawer"
            className="fixed inset-0 z-50 flex justify-end"
            role="dialog"
            aria-modal="true"
            aria-label="মোবাইল নেভিগেশন মেনু"
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-in Drawer */}
            <div className="relative z-10 flex h-full w-full max-w-[340px] flex-col border-l border-border bg-background shadow-2xl sm:max-w-[380px] animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="flex h-18 shrink-0 items-center justify-between border-b border-border px-5">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 40 44"
                    className="h-8 w-7.5 text-foreground"
                  >
                    <path d="M3 3h27v28H18L7 41V31H3V3Z" fill="currentColor" />
                    <path
                      d="M11 11h12v3H11zm0 7h9v3h-9z"
                      fill="var(--background)"
                    />
                    <path d="M30 3h7v20h-7z" fill="var(--primary)" />
                  </svg>
                  <span className="font-manrope text-2xl font-extrabold leading-none tracking-[-1.5px]">
                    shighush<span className="text-primary">.</span>
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="মেনু বন্ধ করুন"
                  className="grid size-9 place-items-center rounded-full border border-border/80 text-muted-foreground transition hover:bg-muted hover:text-foreground cursor-pointer"
                >
                  <X className="size-4.5" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-4 py-5">
                {/* Main Navigation Links */}
                <div className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  প্রধান মেনু
                </div>
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => {
                    const active = isRouteActive(pathname, link.href);
                    const Icon = navIcons[link.href] || FileText;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary"
                            : "text-foreground/80 hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={cn(
                              "size-4.5 transition-colors",
                              active
                                ? "text-primary"
                                : "text-muted-foreground group-hover:text-foreground",
                            )}
                          />
                          <span>{link.label}</span>
                        </div>

                        {active && (
                          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            সক্রিয়
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Separator */}
                <div className="my-5 border-t border-border" />

                {/* Primary Action Buttons */}
                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/report/new"
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground shadow-xs transition hover:bg-primary/90"
                  >
                    <span>অভিযোগ জানান</span>
                    <ArrowUpRight className="size-4" />
                  </Link>

                  <Link
                    href="/track"
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
                  >
                    <KeyRound className="size-4 text-muted-foreground" />
                    <span>কেস ট্র্যাক করুন</span>
                  </Link>
                </div>

                {/* Safety & Appeal Section */}
                <div className="mt-6">
                  <div className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    নিরাপত্তা ও সহায়তা
                  </div>
                  <div className="flex flex-col gap-1">
                    {secondaryLinks.map((link) => {
                      const active = isRouteActive(pathname, link.href);
                      const Icon =
                        link.href === "/safety" ? ShieldCheck : Scale;

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                            active
                              ? "bg-muted text-primary font-semibold"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          <Icon className="size-4" />
                          <span>{link.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="border-t border-border bg-muted/40 p-4 text-center text-xs text-muted-foreground">
                <p className="leading-relaxed">
                  শিবচরের নাগরিক নথি ও স্বচ্ছতা পোর্টাল
                </p>
                <p className="mt-0.5 text-[11px] opacity-75">
                  গোপনীয়তা ও নির্ভুলতা নিশ্চিত করে পরিচালিত
                </p>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
