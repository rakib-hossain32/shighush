"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  EyeOff,
  Lock,
  PhoneCall,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { FacebookIcon } from "@/components/facebook-icon";
import { InstagramIcon } from "@/components/instagram-icon";
import { LinkedinIcon } from "@/components/linkedin-icon";
import { YoutubeIcon } from "@/components/youtube-icon";

const platformLinks = [
  { title: "অভিযোগের রেকর্ড", href: "/reports", badge: "লাইভ" },
  { title: "সেবা প্রতিষ্ঠান", href: "/institutions" },
  { title: "এলাকা ও হটস্পট ম্যাপ", href: "/map", badge: "ইন্টারঅ্যাক্টিভ" },
  { title: "তুলনামূলক পরিসংখ্যান", href: "/statistics" },
  { title: "নতুন অভিযোগ দাখিল", href: "/report/new" },
];

const policyLinks = [
  { title: "পরিচয় ও ডেটা সুরক্ষা", href: "/safety" },
  { title: "যাচাইয়ের মেথডোলজি", href: "/methodology" },
  { title: "সংশোধনী ও আপিল নীতি", href: "/appeal" },
  { title: "কেস স্ট্যাটাস ট্র্যাকিং", href: "/track" },
];

const hotlines = [
  { name: "জাতীয় জরুরি সেবা", number: "৯৯৯", note: "পুলিশ, অ্যাম্বুলেন্স, ফায়ার" },
  { name: "দুদক অভিযোগ হটলাইন", number: "১০৬", note: "দুর্নীতি দমন কমিশন" },
  { name: "সরকারি তথ্য ও সেবা", number: "৩৩৩", note: "নাগরিক সেবা ও পরামর্শ" },
];

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  { name: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { name: "YouTube", href: "https://youtube.com", icon: YoutubeIcon },
  { name: "LinkedIn", href: "https://linkedin.com", icon: LinkedinIcon },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full border-t-2 border-foreground bg-card text-foreground overflow-hidden">
      {/* Background paper-grid texture matching home page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05] bg-[size:32px_32px] [background-image:linear-gradient(var(--foreground)_1px,transparent_1px),linear-gradient(90deg,var(--foreground)_1px,transparent_1px)]"
      />

      {/* Top Banner: Civic Commitment Ribbon (Neo-Brutalist Archival Header) */}
      <div className="relative border-b-2 border-border bg-background/80 py-5 sm:py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div className="flex items-center gap-3.5">
            <span className="grid size-10 shrink-0 place-items-center border-2 border-foreground bg-primary text-foreground shadow-[2px_2px_0_var(--foreground)]">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <p className="text-sm font-bold font-heading text-foreground">
                স্বচ্ছ প্রশাসন ও নাগরিক অধিকার প্রতিষ্ঠায় শিবচরের উন্মুক্ত প্ল্যাটফর্ম
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                আপনার প্রতিটি তথ্য এনক্রিপ্টেড এবং সম্পূর্ণ পরিচয়-সুরক্ষিত।
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/track"
              className="inline-flex items-center gap-1.5 border-2 border-foreground bg-background px-3.5 py-2 text-xs font-bold text-foreground shadow-[3px_3px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
            >
              <Lock className="size-3.5 text-primary" />
              <span>অভিযোগ ট্র্যাক করুন</span>
            </Link>

            <Link
              href="/report/new"
              className="inline-flex items-center gap-1.5 border-2 border-foreground bg-primary px-4 py-2 text-xs font-bold text-foreground shadow-[3px_3px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
            >
              <span>অভিযোগ লিখুন</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Navigation Grid */}
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] xl:gap-14">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-5">
            <Link
              aria-label="শিঘুষ, হোমপেজ"
              className="group inline-flex shrink-0 items-center gap-2 sm:gap-2.5"
              href="/"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 40 44"
                className="h-8 w-7.5 text-foreground transition group-hover:text-primary sm:h-9 sm:w-8.5"
              >
                <path d="M3 3h27v28H18L7 41V31H3V3Z" fill="currentColor" />
                <path d="M11 11h12v3H11zm0 7h9v3h-9z" fill="var(--background)" />
                <path d="M30 3h7v20h-7z" fill="var(--primary)" />
              </svg>
              <span className="font-manrope text-2xl font-extrabold leading-none tracking-[-1.5px] sm:text-3xl">
                shighush<span className="text-primary">.</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
              শিবচর উপজেলার নাগরিক সেবা, অনিয়ম ও জবাবদিহিতার প্রামাণ্য নাগরিক দলিল। কোনো ব্যক্তিগত পরিচয় প্রকাশ বা সংরক্ষণ করা হয় না।
            </p>

            {/* Live Observatory Badge (Sharp Brutalist Box) */}
            <div className="inline-flex items-center gap-2 border-2 border-border bg-background px-3 py-1.5 text-xs ">
              <span className="size-2 bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-foreground">
                নোড: শিবচর উপজেলা · সার্বক্ষণিক সক্রিয়
              </span>
            </div>

            {/* Social Icons (Brutalist Square Buttons with tactile shadows) */}
            <div className="pt-2 flex items-center gap-2.5">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  className="grid size-8 place-items-center border-2 border-border bg-background text-foreground transition-all hover:border-foreground hover:bg-muted hover:shadow-[2px_2px_0_var(--foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5 cursor-pointer"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-xs  font-bold uppercase tracking-wider text-primary border-b-2 border-border pb-2">
              <span>নাগরিক পোর্টাল</span>
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {platformLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-foreground/80 transition-colors hover:text-primary"
                  >
                    <span className="transition-transform group-hover:translate-x-1">
                      {link.title}
                    </span>
                    {link.badge && (
                      <span className="border border-primary/40 bg-primary/10 px-1.5 py-0.25  text-[9px] font-bold text-primary">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Policy & Transparency */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-xs  font-bold uppercase tracking-wider text-primary border-b-2 border-border pb-2">
              <span>নীতি ও স্বচ্ছতা</span>
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {policyLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-foreground/80 transition-colors hover:text-primary"
                  >
                    <span className="transition-transform group-hover:translate-x-1">
                      {link.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <div className="inline-flex items-center gap-1.5 border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground ">
                <EyeOff className="size-3.5 text-primary" />
                <span>নো-লগ ডেটাবেজ পলিসি</span>
              </div>
            </div>
          </div>

          {/* Column 4: Emergency Helplines (Official Ticket Cards) */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-1.5 text-xs  font-bold uppercase tracking-wider text-primary border-b-2 border-border pb-2">
              <PhoneCall className="size-3.5" />
              <span>জরুরি হটলাইন সেবা</span>
            </h3>
            <div className="space-y-2.5">
              {hotlines.map((item) => (
                <div
                  key={item.number}
                  className="group border-2 border-border bg-background p-2.5 sm:p-3 transition-all hover:border-foreground hover:shadow-[3px_3px_0_var(--foreground)] hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">{item.name}</span>
                    <span className=" text-base font-extrabold text-primary tracking-wider">
                      {item.number}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t-2 border-border bg-background py-4 sm:py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p className="text-center sm:text-left">
            © {currentYear} <strong className="text-foreground">শিঘুষ (shighush)</strong> · শিবচর, মাদারীপুর। নাগরিক জবাবদিহিতার উন্মুক্ত দলিল।
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 ">
              <Lock className="size-3 text-primary" />
              ২৪৮-বিট এন্ড-টু-এন্ড এনক্রিপ্টেড
            </span>
            <span>·</span>
            <Link href="/safety" className="hover:text-primary transition-colors font-medium">
              গোপনীয়তা নীতি
            </Link>
            <span>·</span>
            <Link href="/methodology" className="hover:text-primary transition-colors font-medium">
              যাচাই নীতিমালা
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
