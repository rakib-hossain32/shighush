"use client";

import { useState } from "react";
import {
  CheckCircle2,
  FileText,
  Lock,
  Send,
} from "lucide-react";

const reasons = [
  { id: "incorrect_info", label: "ভুল তথ্য সংশোধন", badge: "তথ্যগত ত্রুটি" },
  { id: "privacy_risk", label: "ব্যক্তিগত তথ্য ফাঁস (Privacy)", badge: "জরুরি পর্যালোচনা" },
  { id: "institution_response", label: "প্রতিষ্ঠানের আনুষ্ঠানিক জবাব", badge: "দাপ্তরিক প্রতিক্রিয়া" },
  { id: "other", label: "অন্যান্য আপত্তি বা মন্তব্য", badge: "সাধারণ" },
];

export function AppealForm() {
  const [caseId, setCaseId] = useState("");
  const [selectedReason, setSelectedReason] = useState("incorrect_info");
  const [detail, setDetail] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return;

    setIsLoading(true);
    // Simulate submission
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  if (isSubmitted) {
    return (
      <div className="border-2 border-foreground bg-card p-6 sm:p-8 text-center space-y-4 shadow-[4px_4px_0_var(--foreground)]">
        <div className="mx-auto grid size-12 place-items-center border-2 border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="size-7" />
        </div>
        <h3 className="text-2xl font-bold font-heading text-foreground">
          আপিল আবেদন সফলভাবে গৃহীত হয়েছে
        </h3>
        <p className="max-w-md mx-auto text-xs leading-relaxed text-muted-foreground">
          আপনার প্রদত্ত তথ্য আমাদের মডারেশন টিমের কাছে পাঠানো হয়েছে। জরুরি গোপনীয়তা ঝুঁকির আবেদন সাধারণত ২৪-৪৮ ঘণ্টার মধ্যে অগ্রাধিকার ভিত্তিতে পর্যালোচনা করা হয়।
        </p>
        <div className="pt-3">
          <button
            onClick={() => {
              setIsSubmitted(false);
              setDetail("");
              setCaseId("");
              setAgree(false);
            }}
            className="inline-flex items-center gap-1.5 border-2 border-foreground bg-background px-4 py-2 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
          >
            আরেকটি আবেদন করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-border bg-card p-5 sm:p-7 shadow-[4px_4px_0_var(--foreground)]">
      <div className="flex items-center justify-between gap-3 border-b-2 border-border pb-5">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center border-2 border-border bg-background text-primary">
            <FileText className="size-5" />
          </span>
          <div>
            <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-primary">
              REVIEW & DISPUTE DESK
            </span>
            <h2 className="text-xl font-bold font-heading mt-0.5 text-foreground">
              আপিল ও সংশোধনী আবেদনপত্র
            </h2>
          </div>
        </div>
        <span className="border border-primary/40 bg-primary/10 px-2.5 py-1  text-[10px] font-bold text-primary">
          গোপন পর্যালোচনা
        </span>
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        যথাযথ তথ্য ও নিরপেক্ষ ভাষায় লিখুন। ব্যক্তিগত আক্রমণ বা অবান্তর তথ্য এড়িয়ে চলুন।
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Case ID */}
          <div className="space-y-2">
            <label htmlFor="caseId" className="text-xs font-bold uppercase tracking-wider text-foreground ">
              নথির <span className="font-mono">Case ID</span> <span className="text-primary">*</span>
            </label>
            <input
              id="caseId"
              required
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              placeholder="যেমন: শি-০০৪২ / SG-2026-0042"
              className="h-11 w-full border-2 border-border bg-background px-3  text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
            />
            <p className="text-[11px] text-muted-foreground">
              রিপোর্টের শিরোনামের উপরে প্রদর্শিত শনাক্তকারী নম্বর।
            </p>
          </div>

          {/* Contact Email (Optional for updates) */}
          <div className="space-y-2">
            <label htmlFor="contactEmail" className="text-xs font-bold uppercase tracking-wider text-foreground ">
              যোগাযোগের ইমেইল (ঐচ্ছিক)
            </label>
            <input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="আপিলের সিদ্ধান্ত জানতে চাইলে..."
              className="h-11 w-full border-2 border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
            />
            <p className="text-[11px] text-muted-foreground">
              এটি কোনো নথির সঙ্গে প্রকাশ্যে সংযুক্ত হবে না।
            </p>
          </div>
        </div>

        {/* Reason Selection */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-foreground  block">
            আপিল বা পর্যালোচনার কারণ <span className="text-primary">*</span>
          </label>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {reasons.map((r) => (
              <button
                type="button"
                key={r.id}
                onClick={() => setSelectedReason(r.id)}
                className={`flex flex-col items-start p-3 border-2 text-left transition-all cursor-pointer ${
                  selectedReason === r.id
                    ? "border-foreground bg-primary/10 shadow-[2px_2px_0_var(--foreground)]"
                    : "border-border bg-background hover:border-foreground"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-foreground">{r.label}</span>
                  <span className={`border px-1.5 py-0.25  text-[9px] font-bold ${
                    selectedReason === r.id ? "border-primary bg-primary text-foreground" : "border-border bg-card text-muted-foreground"
                  }`}>
                    {r.badge}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Statement */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="detail" className="text-xs font-bold uppercase tracking-wider text-foreground ">
              বিস্তারিত বিবরণ ও সংশোধন প্রস্তাব <span className="text-primary">*</span>
            </label>
            <span className="text-[11px] text-muted-foreground ">
              {detail.length} অক্ষর
            </span>
          </div>
          <textarea
            id="detail"
            required
            rows={5}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="কোন তথ্যটি সংশোধন করা দরকার, তার রেফারেন্স ও প্রয়োজনীয় ব্যাখ্যা পরিষ্কার ভাষায় উল্লেখ করুন..."
            className="w-full border-2 border-border bg-background p-3 leading-relaxed text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
          />
          <p className="text-[11px] text-muted-foreground">
            প্রমাণপত্র বা দাপ্তরিক আদেশের কোনো লিংক থাকলে বিবরণের ভেতরে উল্লেখ করতে পারেন।
          </p>
        </div>

        {/* Agreement Checkbox */}
        <div className="flex items-start gap-3 border-2 border-border bg-secondary/30 p-4">
          <input
            type="checkbox"
            id="agree"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            required
            className="mt-1 size-4 rounded-none border-2 border-border cursor-pointer accent-primary"
          />
          <label htmlFor="agree" className="text-xs leading-relaxed text-foreground cursor-pointer font-medium">
            আমি নিশ্চিত করছি যে প্রদত্ত তথ্য সত্য এবং কোনো বিভ্রান্তিকর বা উদ্দেশ্যপ্রণোদিত অসত্য তথ্য উপস্থাপন করিনি। আবেদনটি মডারেশন দলের পর্যালোচনার জন্য পাঠানো হবে।
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-border pt-5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground ">
            <Lock className="size-3.5 text-primary" />
            <span>এই আবেদনটি ওয়েবসাইটে প্রকাশ্যে দেখানো হবে না</span>
          </div>

          <button
            type="submit"
            disabled={!agree || isLoading}
            className="inline-flex items-center gap-2 border-2 border-foreground bg-primary px-6 py-2.5 text-xs font-bold text-foreground shadow-[3px_3px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>প্রক্রিয়াধীন...</span>
            ) : (
              <>
                <Send className="size-3.5" />
                <span>আপিল জমা দিন</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
