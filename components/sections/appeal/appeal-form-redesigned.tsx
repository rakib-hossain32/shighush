"use client";

import { useState, useTransition } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  FileText,
  Loader2,
  Lock,
  Send,
  Shield,
} from "lucide-react";
import { submitAppealAction, type AppealFormInput } from "@/app/(public)/appeal/actions";
import { toast } from "sonner";

const APPEAL_REASONS = [
  {
    id: "incorrect_info" as const,
    label: "ভুল তথ্য সংশোধন",
    badge: "তথ্যগত ত্রুটি",
    description: "নথিতে প্রকাশিত তথ্য ভুল বা অসম্পূর্ণ",
    icon: "📝",
    priority: false,
  },
  {
    id: "privacy_risk" as const,
    label: "ব্যক্তিগত তথ্য ফাঁস",
    badge: "জরুরি পর্যালোচনা",
    description: "নথিতে ব্যক্তিগত পরিচয় বা সংবেদনশীল তথ্য প্রকাশিত",
    icon: "🔒",
    priority: true,
  },
  {
    id: "institution_response" as const,
    label: "প্রতিষ্ঠানের আনুষ্ঠানিক জবাব",
    badge: "দাপ্তরিক প্রতিক্রিয়া",
    description: "প্রতিষ্ঠানের পক্ষ থেকে সরকারী বিবৃতি বা প্রমাণ যুক্ত করা",
    icon: "🏛️",
    priority: false,
  },
  {
    id: "other" as const,
    label: "অন্যান্য আপত্তি",
    badge: "সাধারণ",
    description: "অন্য কোনো কারণে পর্যালোচনা প্রয়োজন",
    icon: "💬",
    priority: false,
  },
] as const;

interface SubmittedAppeal {
  appealId: string;
  caseId: string;
  status: string;
  submittedAt: Date;
}

export function AppealFormRedesigned() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState<SubmittedAppeal | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Form state
  const [caseId, setCaseId] = useState("");
  const [selectedReason, setSelectedReason] = useState<AppealFormInput["reason"]>("incorrect_info");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [agreed, setAgreed] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!caseId.trim()) {
      newErrors.caseId = "Case ID প্রয়োজন";
    }

    if (description.length < 20) {
      newErrors.description = "কমপক্ষে ২০টি অক্ষর লিখুন";
    } else if (description.length > 2000) {
      newErrors.description = "সর্বোচ্চ ২০০০ অক্ষর";
    }

    if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      newErrors.contactEmail = "সঠিক ইমেইল প্রদান করুন";
    }

    if (!agreed) {
      newErrors.agreed = "আপনাকে অবশ্যই শর্তাবলী স্বীকার করতে হবে";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("ফর্মে কিছু ত্রুটি আছে");
      return;
    }

    startTransition(async () => {
      const result = await submitAppealAction({
        caseId: caseId.trim(),
        reason: selectedReason,
        description: description.trim(),
        contactEmail: contactEmail.trim() || undefined,
      });

      if (result.success && result.data) {
        setSubmitted({
          appealId: result.data.id,
          caseId: result.data.caseId,
          status: result.data.status,
          submittedAt: new Date(),
        });
        toast.success(result.message || "আপিল সফলভাবে জমা হয়েছে");
      } else {
        toast.error(result.error || "আপিল জমা দিতে সমস্যা হয়েছে");
      }
    });
  };

  const handleReset = () => {
    setSubmitted(null);
    setCaseId("");
    setDescription("");
    setContactEmail("");
    setAgreed(false);
    setErrors({});
    setSelectedReason("incorrect_info");
  };

  const copyAppealId = () => {
    if (submitted?.appealId) {
      navigator.clipboard.writeText(submitted.appealId);
      setCopiedId(true);
      toast.success("Appeal ID কপি হয়েছে");
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Success state
  if (submitted) {
    return (
      <div className="border-2 border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 p-6 sm:p-8 shadow-[4px_4px_0_var(--foreground)]">
        <div className="text-center space-y-5">
          {/* Success Icon */}
          <div className="mx-auto grid size-16 place-items-center border-2 border-emerald-600 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 shadow-[3px_3px_0_rgba(0,0,0,0.1)]">
            <CheckCircle2 className="size-9" />
          </div>

          {/* Success Message */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-black font-heading text-foreground">
              আপিল সফলভাবে জমা হয়েছে
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
              আপনার আপিল আমাদের মডারেশন টিমের কাছে পাঠানো হয়েছে।
              {selectedReason === "privacy_risk" && (
                <span className="block mt-1 font-semibold text-primary">
                  গোপনীয়তা সংক্রান্ত আপিল ২৪-৪৮ ঘণ্টার মধ্যে অগ্রাধিকার ভিত্তিতে পর্যালোচনা করা হবে।
                </span>
              )}
            </p>
          </div>

          {/* Appeal Details */}
          <div className="border-2 border-border bg-card p-4 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Appeal ID
              </span>
              <button
                onClick={copyAppealId}
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                {copiedId ? (
                  <>
                    <CheckCircle2 className="size-3" />
                    <span>কপি হয়েছে</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>কপি করুন</span>
                  </>
                )}
              </button>
            </div>
            <p className="font-mono text-sm font-bold text-foreground break-all">
              {submitted.appealId}
            </p>

            <div className="pt-2 border-t border-border/50 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="block text-muted-foreground font-medium">Case ID</span>
                <span className="block font-bold text-foreground mt-0.5">{submitted.caseId}</span>
              </div>
              <div>
                <span className="block text-muted-foreground font-medium">স্ট্যাটাস</span>
                <span className="inline-block mt-0.5 border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {submitted.status === "received" ? "গৃহীত" : submitted.status}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex items-start gap-2 border border-border/60 bg-muted/30 p-3 text-xs text-left">
            <Shield className="size-4 text-primary shrink-0 mt-0.5" />
            <p className="text-muted-foreground leading-relaxed">
              এই আপিলটি সম্পূর্ণ গোপনীয় এবং ওয়েবসাইটে প্রকাশ্যে দেখানো হবে না। পর্যালোচনা সম্পন্ন হলে
              {contactEmail && " আপনার প্রদত্ত ইমেইলে"} জানানো হবে।
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 border-2 border-foreground bg-background px-5 py-2.5 text-xs font-bold text-foreground shadow-[3px_3px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            >
              আরেকটি আপিল জমা দিন
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <form onSubmit={handleSubmit} className="border-2 border-border bg-card shadow-[4px_4px_0_var(--foreground)]">
      {/* Form Header */}
      <div className="border-b-2 border-border bg-muted/30 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center border-2 border-border bg-background text-primary shadow-[2px_2px_0_rgba(0,0,0,0.1)]">
              <FileText className="size-5" />
            </span>
            <div>
              <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-primary">
                APPEAL & CORRECTION REQUEST
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-heading mt-0.5 text-foreground">
                আপিল ও সংশোধনী আবেদনপত্র
              </h2>
            </div>
          </div>
          <span className="shrink-0 border border-primary/40 bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary whitespace-nowrap">
            গোপন পর্যালোচনা
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
          যথাযথ তথ্য ও নিরপেক্ষ ভাষায় লিখুন। ব্যক্তিগত আক্রমণ বা অবান্তর তথ্য এড়িয়ে চলুন।
        </p>
      </div>

      {/* Form Body */}
      <div className="p-5 sm:p-7 space-y-6">
        {/* Case ID & Contact Email */}
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Case ID */}
          <div className="space-y-2">
            <label htmlFor="caseId" className="block text-xs font-bold uppercase tracking-wider text-foreground">
              নথির Case ID <span className="text-destructive">*</span>
            </label>
            <input
              id="caseId"
              type="text"
              value={caseId}
              onChange={(e) => {
                setCaseId(e.target.value);
                setErrors((prev) => ({ ...prev, caseId: "" }));
              }}
              placeholder="যেমন: শি-০০৪২ / SG-2026-0042"
              className="h-11 w-full border-2 border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              disabled={isPending}
            />
            {errors.caseId && (
              <p className="flex items-center gap-1.5 text-[11px] text-destructive">
                <AlertCircle className="size-3" />
                {errors.caseId}
              </p>
            )}
            <p className="text-[11px] text-muted-foreground">
              রিপোর্টের শিরোনামের উপরে প্রদর্শিত শনাক্তকারী নম্বর।
            </p>
          </div>

          {/* Contact Email */}
          <div className="space-y-2">
            <label htmlFor="contactEmail" className="block text-xs font-bold uppercase tracking-wider text-foreground">
              যোগাযোগের ইমেইল (ঐচ্ছিক)
            </label>
            <input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => {
                setContactEmail(e.target.value);
                setErrors((prev) => ({ ...prev, contactEmail: "" }));
              }}
              placeholder="আপিলের সিদ্ধান্ত জানতে চাইলে..."
              className="h-11 w-full border-2 border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              disabled={isPending}
            />
            {errors.contactEmail && (
              <p className="flex items-center gap-1.5 text-[11px] text-destructive">
                <AlertCircle className="size-3" />
                {errors.contactEmail}
              </p>
            )}
            <p className="text-[11px] text-muted-foreground">
              এটি কোনো নথির সঙ্গে প্রকাশ্যে সংযুক্ত হবে না।
            </p>
          </div>
        </div>

        {/* Reason Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
            আপিল বা পর্যালোচনার কারণ <span className="text-destructive">*</span>
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            {APPEAL_REASONS.map((reason) => (
              <button
                type="button"
                key={reason.id}
                onClick={() => setSelectedReason(reason.id)}
                className={`group relative flex flex-col items-start p-4 border-2 text-left transition-all ${
                  selectedReason === reason.id
                    ? "border-primary bg-primary/5 shadow-[3px_3px_0_var(--primary)]"
                    : "border-border bg-background hover:border-foreground/50"
                } ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                disabled={isPending}
              >
                {/* Priority Badge */}
                {reason.priority && (
                  <span className="absolute -top-2 -right-2 border-2 border-destructive bg-destructive text-white px-2 py-0.5 text-[9px] font-bold shadow-[2px_2px_0_rgba(0,0,0,0.2)]">
                    জরুরি
                  </span>
                )}

                <div className="flex items-start justify-between w-full gap-3">
                  <div className="flex items-start gap-2">
                    <span className="text-2xl mt-0.5">{reason.icon}</span>
                    <div>
                      <span className="block text-sm font-bold text-foreground">{reason.label}</span>
                      <span className="block text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        {reason.description}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 border px-2 py-0.5 text-[9px] font-bold transition-colors ${
                      selectedReason === reason.id
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {reason.badge}
                  </span>
                </div>

                {/* Checkmark */}
                {selectedReason === reason.id && (
                  <div className="absolute bottom-3 right-3">
                    <div className="grid size-5 place-items-center border border-primary bg-primary text-white">
                      <CheckCircle2 className="size-3.5" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-foreground">
              বিস্তারিত বিবরণ ও সংশোধন প্রস্তাব <span className="text-destructive">*</span>
            </label>
            <span className={`text-[11px] tabular-nums ${description.length > 2000 ? "text-destructive font-bold" : "text-muted-foreground"}`}>
              {description.length} / 2000
            </span>
          </div>
          <textarea
            id="description"
            rows={6}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors((prev) => ({ ...prev, description: "" }));
            }}
            placeholder="কোন তথ্যটি সংশোধন করা দরকার, তার রেফারেন্স ও প্রয়োজনীয় ব্যাখ্যা পরিষ্কার ভাষায় উল্লেখ করুন..."
            className="w-full border-2 border-border bg-background p-3 leading-relaxed text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors resize-none"
            disabled={isPending}
          />
          {errors.description && (
            <p className="flex items-center gap-1.5 text-[11px] text-destructive">
              <AlertCircle className="size-3" />
              {errors.description}
            </p>
          )}
          <p className="text-[11px] text-muted-foreground">
            প্রমাণপত্র বা দাপ্তরিক আদেশের কোনো লিংক থাকলে বিবরণের ভেতরে উল্লেখ করতে পারেন।
          </p>
        </div>

        {/* Agreement Checkbox */}
        <div className="flex items-start gap-3 border-2 border-border bg-secondary/30 p-4">
          <input
            type="checkbox"
            id="agreed"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              setErrors((prev) => ({ ...prev, agreed: "" }));
            }}
            className="mt-1 size-4 rounded-none border-2 border-border cursor-pointer accent-primary"
            disabled={isPending}
          />
          <label htmlFor="agreed" className="text-xs leading-relaxed text-foreground cursor-pointer font-medium flex-1">
            আমি নিশ্চিত করছি যে প্রদত্ত তথ্য সত্য এবং কোনো বিভ্রান্তিকর বা উদ্দেশ্যপ্রণোদিত অসত্য তথ্য উপস্থাপন করিনি। আবেদনটি
            মডারেশন দলের পর্যালোচনার জন্য পাঠানো হবে।
          </label>
        </div>
        {errors.agreed && (
          <p className="flex items-center gap-1.5 text-[11px] text-destructive -mt-3">
            <AlertCircle className="size-3" />
            {errors.agreed}
          </p>
        )}
      </div>

      {/* Form Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-border bg-muted/30 p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="size-4 text-primary shrink-0" />
          <span>এই আবেদনটি ওয়েবসাইটে প্রকাশ্যে দেখানো হবে না</span>
        </div>

        <button
          type="submit"
          disabled={isPending || !agreed}
          className="inline-flex items-center gap-2 border-2 border-foreground bg-primary px-6 py-2.5 text-xs font-bold text-foreground shadow-[3px_3px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[3px_3px_0_var(--foreground)]"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>প্রক্রিয়াধীন...</span>
            </>
          ) : (
            <>
              <Send className="size-4" />
              <span>আপিল জমা দিন</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
