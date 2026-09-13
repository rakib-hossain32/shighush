import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Check,
  FileText,
  Landmark,
  Scale,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

const verificationLevels = [
  {
    icon: ShieldAlert,
    label: "অযাচাইকৃত",
    english: "Unverified",
    toneColor: "text-amber-600 dark:text-amber-400 border-amber-500/40 bg-amber-500/10",
    description:
      "প্রতিবেদনটি মৌলিক নীতিগত ও গোপনীয়তা ফিল্টার পার করেছে, কিন্তু কোনো স্বতন্ত্র প্রমাণপত্র (রসিদ, অডিও, নথি) সংযুক্ত ছিল না।",
    meaning: "নাগরিকের প্রাথমিক অভিযোগ হিসেবে নথিভুক্ত; চূড়ান্ত প্রমাণের দাবি নয়।",
  },
  {
    icon: FileText,
    label: "প্রমাণ সংযুক্ত",
    english: "Evidence Attached",
    toneColor: "text-primary border-primary/40 bg-primary/10",
    description:
      "প্রতিবেদনের সঙ্গে দাপ্তরিক রসিদ, চালান, স্ক্রিনশট, মেমো বা ডিজিটাল ডকুমেন্টের কপি সংযুক্ত রয়েছে।",
    meaning: "দাবিকৃত ঘটনার সমর্থনে বস্তুগত প্রমাণপত্র বর্তমান এবং তা রিডাক্টেড অবস্থায় সংরক্ষিত।",
  },
  {
    icon: BadgeCheck,
    label: "সমর্থিত / একাধিক সূত্র",
    english: "Corroborated",
    toneColor: "text-emerald-600 dark:text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
    description:
      "একই সময়কালে একই দফতর বা ঘটনার ক্ষেত্রে একাধিক স্বাধীন নাগরিকের বর্ণনায় মিল পাওয়া গেছে।",
    meaning: "একাধিক স্বতন্ত্র উৎস থেকে একই ধরণের অনিয়ম বা দাবির পুনপৌনিকতা সমর্থিত।",
  },
  {
    icon: Landmark,
    label: "সরকারি নথিভুক্ত",
    english: "Official Record",
    toneColor: "text-foreground border-foreground/40 bg-foreground/10",
    description:
      "প্রকাশ্য সরকারি অডিট রিপোর্ট, আদালতের আদেশ, দুদক তদন্ত অথবা প্রাতিষ্ঠানিক তদন্ত কমিটির প্রতিবেদনের রেফারেন্স সংযুক্ত।",
    meaning: "সর্বোচ্চ স্তরের বিশ্বাসযোগ্যতা; উন্মুক্ত রাষ্ট্রীয় বা বিচারিক নথির অংশ।",
  },
];

export function VerificationGuide() {
  return (
    <div className="mt-12 space-y-8">
      <div className="border-b-2 border-border pb-4">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
          TRUST LADDER & CLASSIFICATION
        </span>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground font-heading mt-1">
          যাচাইকরণের ৪টি স্তর ও লেবেলের তাৎপর্য
        </h2>
        <p className="text-xs text-muted-foreground mt-1 ">
          পাঠক যাতে সহজেই তথ্যের ওজন বুঝতে পারেন, সেজন্য প্রতিটি প্রতিবেদনে যাচাইকরণের স্তর যুক্ত থাকে
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.85fr)_minmax(300px,1.15fr)]">
        {/* Verification Ladder Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {verificationLevels.map((lvl) => {
            const Icon = lvl.icon;
            return (
              <article
                key={lvl.english}
                className="flex flex-col justify-between border-2 border-border bg-card p-4 sm:p-5 transition-all hover:border-foreground hover:shadow-[3px_3px_0_var(--foreground)] hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b-2 border-border pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="grid size-7 place-items-center border border-border bg-background">
                        <Icon className="size-4 text-primary" />
                      </span>
                      <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                        {lvl.english}
                      </span>
                    </div>
                    <span className={`border px-2 py-0.5  text-[10px] font-bold ${lvl.toneColor}`}>
                      {lvl.label}
                    </span>
                  </div>

                  <h3 className="text-base font-bold mt-3 font-heading text-foreground">
                    {lvl.label}
                  </h3>

                  <p className="mt-1.5 leading-relaxed text-xs text-muted-foreground">
                    {lvl.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/80">
                  <div className="border border-border bg-background p-2.5 space-y-1">
                    <span className="font-bold text-foreground block text-[11px]  text-primary">
                      তাৎপর্য:
                    </span>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {lvl.meaning}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Right Aside: Right to Reply & Appeal Protocol */}
        <div className="space-y-5">
          <div className="border-2 border-foreground bg-card p-5 sm:p-6 shadow-[4px_4px_0_var(--foreground)]">
            <div className="flex items-center gap-2 text-primary border-b-2 border-border pb-3">
              <Scale className="size-4" />
              <span className="font-mono text-[10px] font-bold tracking-wider uppercase">
                RIGHT TO REPLY
              </span>
            </div>

            <h3 className="text-lg font-bold font-heading mt-3 text-foreground">
              প্রতিষ্ঠানের আত্মপক্ষ সমর্থনের অধিকার
            </h3>

            <p className="text-xs text-muted-foreground leading-relaxed mt-2">
              শিঘুষ কোনো একতরফা প্রচার মাধ্যম নয়। প্রতিবেদনে উল্লেখিত যে কোনো সরকারি প্রতিষ্ঠান, কর্মকর্তা বা ব্যক্তি লিখিত ব্যাখ্যা দিতে পারেন।
            </p>

            <div className="mt-4 border border-border bg-background p-3 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Check className="size-3.5 text-primary shrink-0" />
                <span>যাচাই সাপেক্ষে অফিশিয়াল জবাব যুক্ত হয়</span>
              </div>
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Check className="size-3.5 text-primary shrink-0" />
                <span>ভুল প্রমাণিত হলে নথি দ্রুত আপডেট বা রিমুভ হয়</span>
              </div>
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Check className="size-3.5 text-primary shrink-0" />
                <span>প্রতিটি সিদ্ধান্তের অডিট লগ সংরক্ষিত থাকে</span>
              </div>
            </div>

            <div className="mt-5">
              <Link
                href="/appeal"
                className="inline-flex w-full items-center justify-center gap-2 border-2 border-foreground bg-primary px-4 py-2.5 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
              >
                <span>আপিল বা সংশোধনী অনুরোধ পাঠান</span>
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Neutrality Pledge */}
          <div className="border-2 border-border bg-card p-4 sm:p-5 shadow-[3px_3px_0_var(--foreground)]">
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center border-2 border-border bg-background text-primary">
                <ShieldCheck className="size-4.5" />
              </span>
              <div className="space-y-1 text-xs">
                <p className="font-bold text-foreground font-heading">নিরপেক্ষতা ও স্বাধীনতা অঙ্গীকার</p>
                <p className="text-muted-foreground leading-relaxed">
                  শিঘুষ কোনো রাজনৈতিক দল, ব্যক্তি বা বাণিজ্যিক প্রতিষ্ঠানের সঙ্গে সংশ্লিষ্ট নয়। এর একমাত্র উদ্দেশ্য শিবচরে জনসেবার মানোন্নয়ন।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
