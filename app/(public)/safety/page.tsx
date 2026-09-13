import Link from "next/link";
import {
  CheckCircle2,
  EyeOff,
  FileCheck,
  FileWarning,
  HeartHandshake,
  Lock,
  LogOut,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserX,
  ArrowRight,
} from "lucide-react";

import { PageFrame } from "@/components/page-frame";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "অভিযোগকারীর নিরাপত্তা ও সুরক্ষা নীতি",
  description:
    "পরিচয় ও সংবেদনশীল তথ্য সম্পূর্ণ সুরক্ষিত রেখে কীভাবে শিবচরে নাগরিক প্রতিবেদন জমা দেবেন, তা বিস্তারিত জানুন।",
  path: "/safety",
});

const securityPillars = [
  {
    icon: UserX,
    tag: "পরিচয় সুরক্ষা",
    title: "পরিচয় সম্পূর্ণ গোপন রাখুন",
    description:
      "প্ল্যাটফর্মে নাগরিক প্রতিবেদন জমা দিতে কোনো নাম, অ্যাকাউন্ট, ফোন নম্বর বা জাতীয় পরিচয়পত্রের প্রয়োজন নেই।",
    dos: [
      "ঘটনার স্থান, সময় ও সরকারি দফতরের নাম স্পষ্টভাবে উল্লেখ করুন",
      "ব্যক্তিগত যোগাযোগের তথ্য ছাড়াই জমা দিন",
    ],
    donts: [
      "নিজের নাম, বাসার ঠিকানা বা পরিবারের পরিচয় লিখবেন না",
      "অভিযোগের মধ্যে নিজের কোনো ব্যক্তিগত নথিপত্র যুক্ত করবেন না",
    ],
  },
  {
    icon: FileWarning,
    tag: "মেটাডাটা সুরক্ষা",
    title: "প্রমাণের মেটাডাটা ও ছবি মাস্কিং",
    description:
      "ছবি বা স্ক্যান ফাইলে স্বয়ংক্রিয়ভাবে গোপন তথ্য লুকিয়ে থাকতে পারে। প্রকাশের আগে এগুলো মুছে নেওয়া জরুরি।",
    dos: [
      "সংযুক্ত ছবিতে স্বাক্ষর, মুখাবয়ব ও কিউআর কোড ব্লার বা মাস্ক করুন",
      "শিঘুষ সিস্টেম স্বয়ংক্রিয়ভাবে ছবির জিপিএস লোকেশন (EXIF) মুছে ফেলে",
    ],
    donts: [
      "ব্যাংক অ্যাকাউন্ট বা চেকের মূল নম্বর উন্মুক্ত রাখবেন না",
      "অপ্রাসঙ্গিক কারও ব্যক্তিগত নথি আপলোড করবেন না",
    ],
  },
  {
    icon: HeartHandshake,
    tag: "তথ্যভিত্তিক ভাষা",
    title: "শান্ত ও তথ্যভিত্তিক ভাষা",
    description:
      "আবেগ বা উত্তেজনার ভাষা প্রতিবেদনের বিশ্বাসযোগ্যতা কমায়। নিরপেক্ষ বর্ণনা দ্রুত আইনি ও প্রশাসনিক দৃষ্টি আকর্ষণ করে।",
    dos: [
      "সুনির্দিষ্ট দাবিকৃত টাকার অঙ্ক ও ঘুষ চাওয়ার প্রক্রিয়া বর্ণনা করুন",
      "ঘটনাক্রম ও সাক্ষীর উপস্থিতি (যদি থাকে) শান্তভাবে তুলে ধরুন",
    ],
    donts: [
      "গালিগালাজ, ব্যক্তিগত কুৎসা বা হুমকি প্রদর্শন পরিহার করুন",
      "অযাচাইকৃত অনুমানের ভিত্তিতে কাউকে একক অপরাধী ঘোষণা করবেন না",
    ],
  },
  {
    icon: Lock,
    tag: "ডিজিটাল ট্রেস",
    title: "ব্রাউজার ও নেটওয়ার্ক সতর্কতা",
    description:
      "আপনার স্থানীয় ডিভাইস বা ওয়াইফাই নেটওয়ার্কে যাতে কোনো প্রমাণ না থাকে, তার জন্য কিছু সতর্কতা অবলম্বন করুন।",
    dos: [
      "প্রাইভেট/ইনকগনিটো উইন্ডোতে ফর্ম পূরণ করতে পারেন",
      "প্রাপ্ত Case ID ও Secret Token নিরাপদে আলাদা স্থানে লিখে রাখুন",
    ],
    donts: [
      "অফিসের কম্পিউটার বা মনিটর করা পাবলিক ওয়াইফাই ব্যবহার না করাই ভালো",
      "প্রাপ্ত গোপন টোকেন কোনো সামাজিক যোগাযোগ মাধ্যমে শেয়ার করবেন না",
    ],
  },
];

export default function SafetyPage() {
  return (
    <PageFrame
      badgeText="১০০% এনক্রিপ্টেড ও বেনামি"
      breadcrumbs={[{ label: "নিরাপত্তা নীতি" }]}
      copy="শিঘুষ নাগরিকের পরিচয় সুরক্ষিত রাখতে শুরু থেকেই ডিজাইন করা হয়েছে। এখানে প্রযুক্তিগত সুরক্ষা ও আপনার ব্যক্তিগত সতর্কতার সমন্বয়ে সর্বোচ্চ নিরাপত্তা নিশ্চিত করা হয়।"
      eyebrow="নিরাপত্তা নির্দেশিকা / নাগরিক সুরক্ষা"
      title="সাহসী হোন, সতর্কও থাকুন"
      action={
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/report/new"
            className="inline-flex items-center gap-1.5 border-2 border-foreground bg-primary px-4 py-2 text-xs font-bold text-foreground shadow-[3px_3px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
          >
            <ShieldCheck className="size-4" />
            <span>নিরাপদে রিপোর্ট করুন</span>
          </Link>
          <a
            href="https://google.com"
            rel="nofollow noopener noreferrer"
            className="inline-flex items-center gap-1.5 border-2 border-border bg-background px-3.5 py-2 text-xs font-bold text-muted-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:border-foreground hover:text-foreground cursor-pointer"
          >
            <LogOut className="size-3.5" />
            <span>দ্রুত প্রস্থান (Exit)</span>
          </a>
        </div>
      }
    >
      <div className="space-y-12">
        {/* Security Guarantees Banner (Neo-Brutalist Archival Tiles) */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="border-2 border-border bg-card p-4 sm:p-5 transition-all hover:border-foreground hover:shadow-[3px_3px_0_var(--foreground)]">
            <div className="flex items-start gap-3.5">
              <span className="grid size-10 shrink-0 place-items-center border-2 border-border bg-background text-primary">
                <EyeOff className="size-5" />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground font-heading">
                  জিরো-লগ নীতি
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  রিপোর্টারের আইপি অ্যাড্রেস বা ডিভাইসের কোনো আইডেন্টিফায়ার
                  ডাটাবেজে সংরক্ষণ করা হয় না।
                </p>
              </div>
            </div>
          </div>

          <div className="border-2 border-border bg-card p-4 sm:p-5 transition-all hover:border-foreground hover:shadow-[3px_3px_0_var(--foreground)]">
            <div className="flex items-start gap-3.5">
              <span className="grid size-10 shrink-0 place-items-center border-2 border-border bg-background text-primary">
                <FileCheck className="size-5" />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground font-heading">
                  স্বয়ংক্রিয় মেটাডাটা স্ক্রাব
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  আপলোডকৃত ছবির EXIF ডেটা (GPS স্থানাঙ্ক, ক্যামেরা মডেল)
                  স্বয়ংক্রিয়ভাবে মুছে ফেলা হয়।
                </p>
              </div>
            </div>
          </div>

          <div className="border-2 border-border bg-card p-4 sm:p-5 transition-all hover:border-foreground hover:shadow-[3px_3px_0_var(--foreground)]">
            <div className="flex items-start gap-3.5">
              <span className="grid size-10 shrink-0 place-items-center border-2 border-border bg-background text-primary">
                <Lock className="size-5" />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground font-heading">
                  ক্রিপ্টোগ্রাফিক টোকেন
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  কেস ট্র্যাকিংয়ের জন্য কোনো পাসওয়ার্ড নয়, এককালীন গোপন সিক্রেট
                  কি প্রদান করা হয়।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Security Pillars Grid */}
        <section className="space-y-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between border-b-2 border-border pb-3.5">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                CORE PROTOCOLS
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground font-heading mt-1">
                নাগরিক নিরাপত্তার ৪টি মৌলিক স্তম্ভ
              </h2>
            </div>
            <p className="text-xs font-medium text-muted-foreground ">
              প্রতিটি নিয়ম আপনার পরিচয়কে ১০০% গোপন রাখতে সাহায্য করে
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {securityPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article
                  key={pillar.title}
                  className="flex flex-col justify-between border-2 border-border bg-card p-5 sm:p-6 transition-all hover:border-foreground hover:shadow-[4px_4px_0_var(--foreground)] hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 border-b-2 border-border pb-3">
                      <span className="border border-primary/40 bg-primary/10 px-2 py-0.5  text-[10px] font-bold text-primary">
                        {pillar.tag}
                      </span>
                      <span className="grid size-8 place-items-center border-2 border-border bg-background text-primary">
                        <Icon className="size-4" />
                      </span>
                    </div>

                    <h3 className="text-lg font-bold mt-3 font-heading text-foreground">
                      {pillar.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-foreground mt-1.5">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="space-y-3.5 text-xs pt-4 mt-4 border-t border-border/80">
                    <div className="border-2 border-emerald-600/30 bg-emerald-500/10 p-3 space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300 text-xs ">
                        <CheckCircle2 className="size-3.5" />
                        <span>
                          করণীয় <span className="font-mono">(DO)</span>
                        </span>
                      </div>
                      <ul className="space-y-1 text-muted-foreground pl-4 list-disc leading-relaxed">
                        {pillar.dos.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-2 border-destructive/30 bg-destructive/10 p-3 space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-destructive text-xs ">
                        <ShieldAlert className="size-3.5" />
                        <span>বর্জনীয় <span className="font-mono">(DON&apos;T)</span></span>
                      </div>
                      <ul className="space-y-1 text-muted-foreground pl-4 list-disc leading-relaxed">
                        {pillar.donts.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Live Visual Redaction Comparison Card */}
        <section className="space-y-4">
          <div className="border-b-2 border-border pb-3.5">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
              TRANSPARENCY IN PRACTICE
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground font-heading mt-1">
              রিপোর্টে কী রাখা হয় বনাম কী গোপন করা হয়
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              আমাদের মডারেশন টিম প্রতিটি রিপোর্ট প্রকাশের আগে ব্যক্তিগত তথ্য
              ফিল্টার করে
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Kept Public */}
            <div className="border-2 border-border bg-card p-5 sm:p-6 shadow-[3px_3px_0_var(--foreground)]">
              <div className="flex items-center justify-between border-b-2 border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 bg-emerald-500" />
                  <span className="text-sm font-bold text-foreground font-heading">
                    যা প্রকাশ্যে প্রদর্শিত হবে (পাবলিক)
                  </span>
                </div>
                <span className="border border-emerald-600/30 bg-emerald-500/10 px-2 py-0.5  text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  স্বচ্ছতা
                </span>
              </div>
              <div className="pt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 border border-border bg-background">
                  <span className="font-semibold text-foreground">
                    সরকারি প্রতিষ্ঠানের নাম
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    যেমন: শিবচর ভূমি অফিস
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 border border-border bg-background">
                  <span className="font-semibold text-foreground">
                    অনিয়মের বিভাগ ও প্রকৃতি
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    যেমন: অতিরিক্ত অর্থ দাবি
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 border border-border bg-background">
                  <span className="font-semibold text-foreground">
                    ঘটনাস্থল ও ইউনিয়ন
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    যেমন: শিবচর পৌরসভা
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 border border-border bg-background">
                  <span className="font-semibold text-foreground">
                    প্রাসঙ্গিক প্রমাণপত্র
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    রিডাক্টেড রশিদ বা মেমো
                  </span>
                </div>
              </div>
            </div>

            {/* Redacted & Hidden */}
            <div className="border-2 border-border bg-card p-5 sm:p-6 shadow-[3px_3px_0_var(--foreground)]">
              <div className="flex items-center justify-between border-b-2 border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 bg-destructive" />
                  <span className="text-sm font-bold text-foreground font-heading">
                    যা ১০০% গোপন রাখা হবে (রিডাক্টেড)
                  </span>
                </div>
                <span className="border border-destructive/40 bg-destructive/10 px-2 py-0.5  text-[10px] font-bold text-destructive">
                  সুরক্ষিত
                </span>
              </div>
              <div className="pt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 border border-destructive/20 bg-destructive/5">
                  <span className="font-semibold text-foreground">
                    অভিযোগকারীর নাম ও ঠিকানা
                  </span>
                  <span className="border border-destructive bg-destructive/15 text-destructive font-mono text-[10px] font-bold px-2 py-0.5">
                    REDACTED
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 border border-destructive/20 bg-destructive/5">
                  <span className="font-semibold text-foreground">
                    ফোন নম্বর ও ইমেইল আইডি
                  </span>
                  <span className="border border-destructive bg-destructive/15 text-destructive font-mono text-[10px] font-bold px-2 py-0.5">
                    REDACTED
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 border border-destructive/20 bg-destructive/5">
                  <span className="font-semibold text-foreground">
                    এনআইডি, ব্যাংক কার্ড বা মুখাবয়ব
                  </span>
                  <span className="border border-destructive bg-destructive/15 text-destructive font-mono text-[10px] font-bold px-2 py-0.5">
                    REDACTED
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 border border-destructive/20 bg-destructive/5">
                  <span className="font-semibold text-foreground">
                    আইপি অ্যাড্রেস ও ডিভাইস মেটাডাটা
                  </span>
                  <span className="border border-destructive bg-destructive/15 text-destructive font-mono text-[10px] font-bold px-2 py-0.5">
                    NOT STORED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Important Warning Notice */}
        <div className="flex items-start gap-4 border-2 border-foreground bg-secondary/50 p-5 shadow-[3px_3px_0_var(--foreground)]">
          <Shield className="size-6 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold font-heading text-foreground">
              আইনি ও নৈতিক অনুস্মারক
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              শিঘুষ একটি স্বাধীন নাগরিক তথ্যভাণ্ডার। এখানে প্রকাশিত কোনো নথি
              অপরাধের চূড়ান্ত প্রমাণ বা আদালতের রায় নয়। কোনো প্রতিষ্ঠান বা
              ব্যক্তির ভুল তথ্যে আপত্তি থাকলে প্রাতিষ্ঠানিক জবাব যুক্ত করার বা{" "}
              <Link
                href="/appeal"
                className="font-bold text-primary underline underline-offset-4"
              >
                আপিল / সংশোধনী অনুরোধ
              </Link>{" "}
              জানানোর পূর্ণ অধিকার রয়েছে।
            </p>
          </div>
        </div>

        {/* Bottom Navigation CTA */}
        <div className="border-2 border-foreground bg-card p-6 sm:p-8 shadow-[4px_4px_0_var(--foreground)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-foreground font-heading">
                এখনই নিরাপদ নাগরিক প্রতিবেদন দিতে প্রস্তুত?
              </h3>
              <p className="text-xs text-muted-foreground">
                আপনার ৫ মিনিটের অবদান শিবচরে নাগরিক সেবায় স্বচ্ছতা আনতে সাহায্য
                করবে।
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/report/new"
                className="inline-flex items-center gap-2 border-2 border-foreground bg-primary px-5 py-2.5 text-xs font-bold text-foreground shadow-[3px_3px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
              >
                <span>নতুন রিপোর্ট শুরু করুন</span>
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/track"
                className="inline-flex items-center gap-2 border-2 border-border bg-background px-4 py-2.5 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:border-foreground cursor-pointer"
              >
                পূর্বের কেস ট্র্যাক করুন
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageFrame>
  );
}
