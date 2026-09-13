"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  FileText,
  LockKeyhole,
  MapPinned,
  Paperclip,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

type ModalKey =
  | "report"
  | "privacy"
  | "evidence"
  | "verification"
  | "complaint"
  | "moderation"
  | "proof"
  | "publish";

const modalCopy: Record<
  ModalKey,
  { kicker: string; title: string; body: string }
> = {
  report: {
    kicker: "SG-2026-0042 / SAMPLE RECORD",
    title: "সেবা পেতে অতিরিক্ত অর্থ দাবি",
    body: "এটি একটি কাল্পনিক নমুনা নথি। এখানে দেখানো প্রকাশ ও যাচাই বাস্তব ঘটনা বা চূড়ান্ত আইনি সিদ্ধান্ত নির্দেশ করে না।",
  },
  privacy: {
    kicker: "SHIGHUSH / PRIVACY",
    title: "পরিচয় সুরক্ষিত",
    body: "নাম নয়, তথ্যই গুরুত্বপূর্ণ। অভিযোগ প্রকাশের আগে ব্যক্তিগত ও সংবেদনশীল তথ্য বাদ দেওয়ার নীতিগত প্রক্রিয়া অনুসরণ করা হয়।",
  },
  evidence: {
    kicker: "EXHIBIT A + B",
    title: "প্রমাণ সংযুক্ত",
    body: "নথি_০১.pdf এবং রসিদ_০২.jpg—দুটি কাল্পনিক নমুনা প্রমাণ এই রেকর্ডের সঙ্গে যুক্ত আছে।",
  },
  verification: {
    kicker: "EVIDENCE VERIFICATION",
    title: "যাচাই স্তর ০৩ / ০৩",
    body: "তথ্য ও সংযুক্ত প্রমাণ পর্যালোচনার নমুনা স্তর। এই চিহ্ন কোনো ব্যক্তি বা প্রতিষ্ঠানের বিরুদ্ধে চূড়ান্ত সিদ্ধান্ত নয়।",
  },
  complaint: {
    kicker: "STEP 01",
    title: "আপনার অভিজ্ঞতা জানান",
    body: "কী ঘটেছে, কোথায় এবং কোন প্রতিষ্ঠানে—নিজের ভাষায় লিখুন। নাম বা ফোন নম্বর দেওয়া প্রয়োজন নেই।",
  },
  moderation: {
    kicker: "STEP 02",
    title: "দায়িত্বশীল মডারেশন",
    body: "ব্যক্তিগত তথ্য, ক্ষতিকর বিষয়বস্তু এবং পুনরাবৃত্ত রিপোর্ট পরীক্ষা করা হয়। জমা পড়া মানেই প্রকাশিত বা প্রমাণিত নয়।",
  },
  proof: {
    kicker: "STEP 03",
    title: "প্রমাণকে নথিবদ্ধ করুন",
    body: "প্রাসঙ্গিক রসিদ, ছবি বা নথি যুক্ত করুন। সংবেদনশীল তথ্য আগে ঢেকে দেওয়ার বিষয়টি বিবেচনা করুন।",
  },
  publish: {
    kicker: "STEP 05",
    title: "প্রকাশ ও অগ্রগতি",
    body: "প্রকাশযোগ্য তথ্য একটি অনুসন্ধানযোগ্য নথিতে রূপ নেয় এবং রিপোর্ট আইডি দিয়ে অগ্রগতি দেখা যায়।",
  },
};

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden border-b border-[#d8d2c4] bg-[#f7f3e9] text-[#10221e] dark:border-[rgb(247_243_233_/_0.22)] dark:bg-[#10221e] dark:text-[#f7f3e9]">
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[60px] right-0 top-0 -z-10 w-[53%] [background-image:linear-gradient(rgb(16_34_30_/_0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(16_34_30_/_0.05)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:linear-gradient(90deg,transparent,#000_22%,#000)] dark:[background-image:linear-gradient(rgb(247_243_233_/_0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(247_243_233_/_0.05)_1px,transparent_1px)]"
      />
      <div className="mx-auto w-[calc(100%-40px)] max-w-[1320px] min-[641px]:w-[calc(100%-72px)] min-[1201px]:w-[calc(100%-112px)]">
        <div className="grid items-center gap-8 py-[35px] min-[641px]:py-[47px] min-[961px]:grid-cols-[1.04fr_1fr] min-[961px]:gap-7 min-[961px]:py-[47px] min-[1201px]:py-[51px]">
          <div className="relative z-10 pb-1">
            <p className="flex items-center gap-[11px] text-xs font-semibold tracking-[.045em]">
              <span className="relative size-[13px] text-primary">
                <i className="absolute left-0 top-[5px] h-[3px] w-full bg-current" />
                <i className="absolute left-[5px] top-0 h-full w-[3px] bg-current" />
              </span>
              নাগরিক কণ্ঠ • তথ্য • জবাবদিহিতা
            </p>
            <h1 className="mt-[22px] text-[clamp(49px,12.8vw,73px)] font-bold leading-[1.19] tracking-[-.035em] min-[641px]:text-[clamp(57px,6.2vw,75px)] min-[961px]:mt-[25px] min-[961px]:text-[clamp(65px,9.5vw,83px)] min-[1201px]:text-[clamp(62px,5.86vw,86px)]">
              অভিযোগ চাপা
              <br />
              পড়ে থাকতে
              <br />
              <span className="relative inline-block pb-[5px] text-primary">
                হবে না।
                <svg
                  aria-hidden
                  viewBox="0 0 280 14"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 h-[13px] w-full"
                >
                  <path
                    d="M2 8C69 1 173 1 278 6M36 12c74-6 155-6 218-3"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                </svg>
              </span>
            </h1>
            <p className="mt-6 text-[clamp(16px,4.4vw,21px)] font-semibold leading-[1.6] min-[641px]:mt-7 min-[961px]:mt-[29px]">
              জানান। নথিবদ্ধ করুন। অনুসরণ করুন।
            </p>
            <p className="mt-2 max-w-[390px] text-sm leading-[1.9] text-muted-foreground min-[641px]:max-w-[445px] min-[641px]:text-[15px] min-[961px]:mt-[11px] min-[961px]:text-base min-[961px]:leading-[1.85]">
              ঘুষ, হয়রানি কিংবা সেবা থেকে বঞ্চনা। পরিচয় গোপন রেখে অভিযোগ জানান,
              প্রমাণ যুক্ত করুন, আর যাচাই থেকে প্রকাশ পর্যন্ত প্রতিটি ধাপের
              অগ্রগতি জানুন।
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-6 min-[641px]:mt-7 min-[961px]:mt-[30px] min-[961px]:gap-[29px]">
              <Link
                href="/report/new"
                className="group inline-flex min-h-[52px] items-center gap-[17px] border border-primary bg-primary px-5 py-2.5 text-[19px] font-bold text-sidebar transition hover:-translate-y-1 hover:shadow-[4px_4px_0_var(--foreground)] min-[641px]:min-h-14 min-[641px]:gap-6 min-[641px]:px-6 min-[641px]:py-3 min-[961px]:text-xl"
              >
                অভিযোগ জানান{" "}
                <ArrowUpRight className="size-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/reports"
                className="group inline-flex items-center gap-2 border-b border-foreground px-0 py-2.5 text-sm font-semibold transition hover:gap-3 hover:border-primary min-[641px]:gap-[13px] min-[641px]:py-3 min-[641px]:text-base min-[961px]:hover:gap-[19px]"
              >
                রিপোর্ট খুঁজুন <Search className="size-[17px]" />
              </Link>
            </div>
            <p className="mt-[17px] flex items-center gap-2 text-[11px] text-muted-foreground min-[641px]:mt-5 min-[961px]:mt-[21px] min-[961px]:text-xs">
              <ShieldCheck className="size-4 fill-accent text-foreground" />
              পরিচয় প্রকাশ বাধ্যতামূলক নয়
            </p>
          </div>
          <EvidenceBoard />
        </div>
        <div className="flex min-h-[77px] flex-col justify-center gap-2 border-t border-border py-4 text-xs min-[641px]:min-h-[66px] min-[641px]:flex-row min-[641px]:items-center min-[641px]:justify-between min-[641px]:py-0 min-[641px]:text-[13px]">
          <Link
            href="#how-it-works"
            className="group inline-flex items-center gap-[13px] font-medium"
          >
            <ArrowDown className="size-4 transition group-hover:translate-y-1" />
            একটি অভিযোগ যেভাবে নথি হয়ে ওঠে
          </Link>
          <p className="text-[11px] text-muted-foreground">
            প্রকাশিত তথ্য নাগরিক-প্রতিবেদন; চূড়ান্ত আইনি সিদ্ধান্ত নয়।
          </p>
        </div>
      </div>
    </section>
  );
}

function EvidenceBoard() {
  const [active, setActive] = useState<ModalKey | null>(null);
  return (
    <>
      <figure className="relative aspect-[560/618] w-full max-w-[588px] justify-self-end">
        <figcaption className="sr-only">
          নমুনা নথির ইন্টারঅ্যাকটিভ প্রমাণ বোর্ড
        </figcaption>
        <div className="absolute inset-0">
          <div className="absolute left-[7%] right-[2%] top-[1%] flex justify-between font-mono text-[9px] tracking-[.1em] text-muted-foreground">
            <span>THE CIVIC EVIDENCE BOARD</span>
            <span className="inline-flex items-center gap-2 font-sans tracking-normal">
              <i className="size-2 rounded-full bg-primary" />
              নমুনা নথি
            </span>
          </div>
          <span
            aria-hidden
            className="absolute left-[3%] top-[5%] select-none font-manrope text-[clamp(70px,8vw,98px)] font-extrabold tracking-[-.075em] text-foreground/[.095]"
          >
            shighush
          </span>
          <svg
            aria-hidden
            viewBox="0 0 560 618"
            className="absolute inset-0 size-full text-foreground"
          >
            <path
              d="M100 250H30V493H125M454 129h60v213M351 481v56h86"
              fill="none"
              stroke="currentColor"
              strokeDasharray="3 5"
              opacity=".3"
            />
            <circle cx="30" cy="250" r="3" fill="var(--primary)" />
            <circle cx="514" cy="187" r="3" fill="var(--primary)" />
            <circle cx="351" cy="537" r="3" fill="var(--primary)" />
          </svg>
          <div className="absolute left-[12.1%] top-[21%] h-[59.4%] w-[65.9%] rotate-2 border border-border bg-secondary">
            <span className="absolute -top-6 left-4 border border-border bg-card px-3 py-1 font-mono text-[8px]">
              PUBLIC RECORD / 042
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActive("report")}
            className="absolute left-[12.1%] top-[20.2%] z-10 h-[60.3%] w-[65.9%] rotate-[-5.5deg] border border-foreground/30 bg-card p-[5%] text-left shadow-[0_.7em_1.6em_rgb(0_0_0_/_0.18)] transition hover:-translate-y-1 hover:rotate-[-3.5deg]"
          >
            <span className="absolute -left-px top-[7%] h-[13%] w-1 bg-primary" />
            <span className="absolute -top-[4%] right-[15%] h-[11%] w-[4%] -rotate-12 rounded-full border-2 border-muted-foreground" />
            <div className="flex items-center justify-between border-b border-border pb-[4%]">
              <strong className="text-2xl tracking-[-.07em]">
                shighush<span className="text-primary">.</span>
              </strong>
              <span className="font-mono text-right text-[8px] leading-relaxed">
                CITIZEN RECORD
                <br />
                SG-2026-0042
              </span>
            </div>
            <span className="mt-[7%] flex items-center gap-2 text-[9px]">
              <FileText className="size-3" />
              একটি রিপোর্ট / ০০৪২
            </span>
            <strong className="mt-[3%] block text-[clamp(20px,2vw,28px)] leading-[1.4]">
              সেবা পেতে
              <br />
              অতিরিক্ত অর্থ দাবি
            </strong>
            <span className="mt-[3%] block text-[10px] text-muted-foreground">
              ভূমি সেবা · শিবচর, মাদারীপুর
            </span>
            <div className="mt-[7%] border-t border-dashed border-border pt-[5%]">
              <span className="text-[8px] text-muted-foreground">
                ঘটনার বিবরণ / সংবেদনশীল তথ্য গোপন
              </span>
              <div className="mt-3 space-y-2">
                <i className="block h-1 w-[72%] bg-foreground" />
                <i className="block h-1 w-[90%] bg-foreground/20" />
                <i className="block h-1 w-[80%] bg-foreground" />
                <i className="block h-1 w-[65%] bg-foreground/30" />
              </div>
            </div>
            <span className="absolute bottom-[14%] left-[8%] -rotate-12 border-[3px] border-primary bg-card px-2 py-1 text-[clamp(13px,1.5vw,20px)] font-extrabold tracking-[.09em] text-primary shadow-[inset_0_0_0_2px_var(--card)]">
              VERIFIED
            </span>
            <span className="absolute bottom-[5%] left-[5%] right-[5%] flex justify-between border-t border-border pt-[3%] text-[8px]">
              <span className="flex items-center gap-1">
                <LockKeyhole className="size-3" />
                পরিচয় গোপন
              </span>
              <span className="font-mono">১৮.০২.২০২৬ · ১০:৪২</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActive("privacy")}
            className="absolute right-[.15%] top-[12%] z-30 flex min-h-[18%] w-[35%] rotate-7 items-center gap-3 border border-accent/40 bg-sidebar px-[5%] py-[5%] text-left text-sidebar-foreground shadow-lg transition hover:-translate-y-1 hover:rotate-3"
          >
            <ShieldCheck className="size-6 shrink-0 text-accent" />
            <span className="text-[clamp(9px,1vw,13px)] font-semibold">
              পরিচয় সুরক্ষিত
              <small className="mt-1 block text-[8px] opacity-75">
                নাম নয়, তথ্যই গুরুত্বপূর্ণ
              </small>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActive("evidence")}
            className="absolute bottom-[20.5%] right-[1%] z-20 w-[42%] rotate-7 border border-foreground/25 bg-secondary p-[4%] text-left shadow-lg transition hover:-translate-y-1 hover:rotate-3"
          >
            <span className="flex justify-between text-[12px] font-semibold">
              প্রমাণ সংযুক্ত <Paperclip className="size-4" />
            </span>
            <span className="mt-[7%] flex items-center gap-2 border-t border-border pt-[7%]">
              <i className="grid size-9 place-items-center border border-foreground bg-background text-[7px] not-italic">
                PDF
              </i>
              <i className="grid size-9 place-items-center border border-foreground bg-background text-[7px] not-italic">
                JPG
              </i>
              <span className="text-[8px] leading-relaxed">
                নথি_০১.pdf
                <br />
                রসিদ_০২.jpg
                <br />
                ২টি ফাইল সংযুক্ত
              </span>
            </span>
            <span className="mt-[7%] block border-t border-border pt-2 font-mono text-[6px]">
              EXHIBIT A + B / DOCUMENTED
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActive("verification")}
            className="absolute bottom-[13.5%] left-[20%] z-30 flex w-[48%] -rotate-3 items-center gap-3 border border-sidebar/30 bg-accent p-[4%] text-left text-sidebar shadow-lg transition hover:-translate-y-1 hover:rotate-[-1deg]"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-sidebar">
              <Check className="size-5" />
            </span>
            <span className="flex-1">
              <small className="font-mono text-[6px] tracking-[.1em]">
                EVIDENCE VERIFICATION
              </small>
              <strong className="block text-[13px]">যাচাই স্তর</strong>
              <span className="mt-1 flex gap-1">
                <i className="h-1 w-8 bg-sidebar" />
                <i className="h-1 w-8 bg-sidebar" />
                <i className="h-1 w-8 bg-sidebar/50" />
              </span>
            </span>
            <span className="font-mono text-[8px]">০৩ / ০৩</span>
          </button>
          <span className="absolute bottom-[10%] right-[1%] -rotate-6 text-right text-xs text-muted-foreground">
            পরিচয় নয়,
            <br />
            তথ্যই সামনে।
          </span>
          <ol className="absolute bottom-0 left-[7%] right-0 flex items-center justify-between border-t border-border pt-2">
            {[
              ["complaint", "অভিযোগ"],
              ["moderation", "মডারেশন"],
              ["proof", "প্রমাণ"],
              ["verification", "যাচাই"],
              ["publish", "প্রকাশ"],
            ].map(([key, label], index) => (
              <li key={key} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActive(key as ModalKey)}
                  className="flex items-center gap-1 px-1 py-2 text-[9px] font-medium hover:underline"
                >
                  <i
                    className={`size-1.5 rounded-full ${key === "verification" ? "bg-accent" : "bg-foreground"}`}
                  />
                  {label}
                </button>
                {index < 4 && <ArrowRight className="size-3 opacity-50" />}
              </li>
            ))}
          </ol>
        </div>
      </figure>
      <HeroModal active={active} onClose={() => setActive(null)} />
    </>
  );
}

function HeroModal({
  active,
  onClose,
}: {
  active: ModalKey | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!active) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", close);
      document.body.style.overflow = "";
    };
  }, [active, onClose]);
  if (!active) return null;
  const content = modalCopy[active];
  return (
    <div
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
      className="fixed inset-0 z-[100] grid place-items-center bg-sidebar/80 p-5 backdrop-blur-sm"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="hero-modal-title"
        className="relative w-full max-w-xl border border-foreground/40 bg-card p-7 shadow-[8px_8px_0_var(--primary)] sm:p-9"
      >
        <button
          autoFocus
          type="button"
          onClick={onClose}
          aria-label="বন্ধ করুন"
          className="absolute right-4 top-4 grid size-9 place-items-center border border-border hover:bg-muted"
        >
          <X className="size-4" />
        </button>
        <p className="font-mono text-[10px] font-semibold tracking-[.14em] text-primary">
          {content.kicker}
        </p>
        <h2
          id="hero-modal-title"
          className="mt-4 pr-10 text-3xl font-bold leading-tight"
        >
          {content.title}
        </h2>
        <p className="mt-5 text-base leading-8 text-muted-foreground">
          {content.body}
        </p>
        <div className="mt-7 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="border border-foreground bg-foreground px-5 py-3 font-semibold text-background"
          >
            ফিরে যান
          </button>
        </div>
      </section>
    </div>
  );
}
