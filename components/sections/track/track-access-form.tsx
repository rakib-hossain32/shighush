"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Search,
  ShieldCheck,
} from "lucide-react";

export function TrackAccessForm() {
  const router = useRouter();
  const [caseId, setCaseId] = useState("");
  const [secretToken, setSecretToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = caseId.trim();
    const cleanToken = secretToken.trim();

    if (!cleanId) {
      setError(
        "অনুগ্রহ করে আপনার Case ID লিখুন (যেমন: শি-০০৪২ বা SG-2026-0042)",
      );
      return;
    }
    if (!cleanToken) {
      setError("অনুগ্রহ করে জমা দেওয়ার সময় প্রাপ্ত Secret Token লিখুন");
      return;
    }

    setError(null);
    setIsLoading(true);

    const targetSlug = encodeURIComponent(cleanId);
    router.push(`/track/${targetSlug}?token=${encodeURIComponent(cleanToken)}`);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.8fr)_minmax(280px,1.2fr)]">
      {/* Main Form Vault Card (Neo-Brutalist Dossier) */}
      <div className="border-2 border-border bg-card p-5 sm:p-7 shadow-[4px_4px_0_var(--foreground)]">
        <div className="flex items-center justify-between gap-3 border-b-2 border-border pb-5">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center border-2 border-border bg-background text-primary">
              <KeyRound className="size-5" />
            </span>
            <div>
              <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-primary">
                ENCRYPTED ACCESS PORTAL
              </span>
              <h2 className="text-xl font-bold font-heading mt-0.5 text-foreground">
                গোপন নথির বর্তমান অবস্থা দেখুন
              </h2>
            </div>
          </div>
          <span className="hidden sm:inline-flex border border-emerald-600/30 bg-emerald-500/10 px-2.5 py-1  text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
            এনক্রিপ্টেড
          </span>
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          রিপোর্ট জমা দেওয়ার পর প্রাপ্ত Case ID ও Secret Token দিন। কোনো লগইন
          বা ব্যক্তিগত অ্যাকাউন্টের প্রয়োজন নেই।
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {error && (
            <div className="border-2 border-destructive bg-destructive/10 p-3 text-xs font-bold text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="caseId"
                className="text-xs font-bold uppercase tracking-wider text-foreground "
              >
                <span className="font-mono">Case ID</span> / ট্র্যাকিং নম্বর
              </label>
              <span className="text-[11px] text-muted-foreground ">
                যেমন: শি-xxxx
              </span>
            </div>
            <input
              id="caseId"
              name="caseId"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              placeholder="আপনার কেস আইডি লিখুন..."
              className="h-11 w-full border-2 border-border bg-background px-3  text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              autoComplete="off"
              required
            />
            <p className="text-[11px] text-muted-foreground">
              রিপোর্ট জমা দেওয়ার সময় স্ক্রিনে এবং স্লিপে এই আইডিটি প্রদর্শিত
              হয়েছিল।
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="secretToken"
                className="text-xs font-bold uppercase tracking-wider text-foreground "
              >
                <span className="font-mono">Secret Token</span> (গোপন চাবি)
              </label>
              <span className="text-[11px] text-muted-foreground ">
                এককালীন টোকেন
              </span>
            </div>
            <div className="relative">
              <input
                id="secretToken"
                name="secretToken"
                type={showToken ? "text" : "password"}
                value={secretToken}
                onChange={(e) => setSecretToken(e.target.value)}
                placeholder="••••••••••••••••••••••••"
                className="h-11 w-full border-2 border-border bg-background pl-3 pr-10 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label={showToken ? "Hide token" : "Show token"}
              >
                {showToken ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              এই টোকেনটি আপনার পাসওয়ার্ডের মতোই গোপন। এটি কখনো কারো সাথে শেয়ার
              করবেন না।
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-border pt-5 mt-6">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground ">
              <ShieldCheck className="size-4 text-primary" />
              <span>জিরো-লগ ট্র্যাকিং সুরক্ষিত</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 border-2 border-foreground bg-primary px-6 py-2.5 text-xs font-bold text-foreground shadow-[3px_3px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>যাচাই হচ্ছে...</span>
              ) : (
                <>
                  <Search className="size-3.5" />
                  <span>অবস্থা দেখুন</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Security Aside Banner */}
      <div className="space-y-4">
        <div className="border-2 border-border bg-card p-5 shadow-[3px_3px_0_var(--foreground)]">
          <div className="flex items-center gap-2 text-primary border-b-2 border-border pb-3">
            <LockKeyhole className="size-4.5" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              SECURITY ADVISORY
            </span>
          </div>
          <h3 className="text-base font-bold font-heading text-foreground mt-3">
            Secret Token হারালে কী হবে?
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2">
            নাগরিকের সর্বোচ্চ গোপনীয়তা রক্ষার স্বার্থে আমাদের সার্ভারে কোনো ফোন
            নম্বর বা ইমেইল লিঙ্ক করা থাকে না। ফলে এই টোকেনটি কোনো পাসওয়ার্ড
            রিসেটের মাধ্যমে উদ্ধার করা সম্ভব নয়।
          </p>
          <div className="mt-3.5 border border-border bg-background p-3 space-y-1 text-xs">
            <span className="font-bold block text-[11px] text-primary ">
              পরামর্শ:
            </span>
            <p className="text-muted-foreground text-xs leading-relaxed">
              রিপোর্ট জমা দেওয়ার পরপরই প্রাপ্ত Case ID এবং Secret Token একটি
              ব্যক্তিগত নোটপ্যাডে বা নিরাপদ স্থানে সংরক্ষণ করুন।
            </p>
          </div>
        </div>

        <div className="border-2 border-border bg-card p-5 space-y-2">
          <span className="font-bold text-sm text-foreground block font-heading">
            নতুন কোনো অভিযোগ জমা দিতে চান?
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            আপনার কাছে শিবচরের কোনো সরকারি বা আধা-সরকারি সেবায় অনিয়মের তথ্য বা
            প্রমাণ থাকলে সম্পূর্ণ নিরাপদে জমা দিন।
          </p>
          <div className="pt-2">
            <a
              href="/report/new"
              className="inline-flex w-full items-center justify-center gap-2 border-2 border-foreground bg-background px-4 py-2 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            >
              <span>নতুন অভিযোগ শুরু করুন</span>
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
