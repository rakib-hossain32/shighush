import {
  ArrowUpRight,
  BarChart3,
  LockKeyhole,
  ShieldCheck,
  Activity,
  Zap,
} from "lucide-react";

export function HeroHeader() {
  return (
    <div className="flex max-w-4xl flex-col items-center text-center">
      {/* Location Badge */}
      <div className="group mb-8 inline-flex items-center gap-3 rounded-full border-2 border-foreground bg-card px-4 py-1.5 text-xs font-extrabold shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))]">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-secondary" />
        </span>
        <span className="tracking-wide">শিবচর, মাদারীপুর</span>
        <span className="text-border">|</span>
        <span className="flex items-center gap-1 font-mono text-primary">
          <Zap className="size-3 fill-primary text-primary" />
          লাইভ নাগরিক জবাবদিহিতা পোর্টাল
        </span>
      </div>

      {/* Headline */}
      <h1 className="display text-4xl font-black leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
        অভিযোগ থেকে{" "}
        <span className="relative my-1 inline-block px-3 py-1">
          <span className="absolute inset-0 -skew-y-1 rounded-xl border-2 border-foreground bg-secondary shadow-[4px_4px_0_0_hsl(var(--foreground))]" />
          <span className="relative z-10">জবাবদিহিতার</span>
        </span>{" "}
        স্বচ্ছ পুরো চিত্র।
      </h1>

      {/* Subtitle */}
      <p className="mt-6 max-w-2xl text-base font-semibold text-muted-foreground sm:text-xl sm:leading-relaxed">
        আপনার অভিজ্ঞতা গোপনে নথিভুক্ত করুন, সরকারি ও স্বায়ত্তশাসিত সেবার মান তদারকি
        করুন—সম্পূর্ণ পরিচয় গোপন রেখে সরাসরি নাগরিক প্রমাণের ভিত্তিতে।
      </p>

      {/* Action Buttons */}
      <div className="mt-9 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
        <a
          href="/report/new"
          className="group relative inline-flex w-full items-center justify-center gap-3 border-2 border-foreground bg-primary px-8 py-4 text-base font-black text-primary-foreground shadow-[6px_6px_0_0_hsl(var(--foreground))] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_hsl(var(--foreground))] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_hsl(var(--foreground))] sm:w-auto"
        >
          <span>নিরাপদে অভিযোগ জমা দিন</span>
          <ArrowUpRight className="size-5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>

        <a
          href="/statistics"
          className="group inline-flex w-full items-center justify-center gap-3 border-2 border-foreground bg-card px-8 py-4 text-base font-black shadow-[6px_6px_0_0_hsl(var(--foreground))] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-muted hover:shadow-[8px_8px_0_0_hsl(var(--foreground))] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_hsl(var(--foreground))] sm:w-auto"
        >
          <BarChart3 className="size-5 text-primary" />
          <span>তুলনামূলক ডেটা বিশ্লেষণ</span>
        </a>
      </div>

      {/* Trust Badges */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs font-extrabold">
        <div className="inline-flex items-center gap-2 rounded-lg border-2 border-foreground bg-card px-3.5 py-2 shadow-[2px_2px_0_0_hsl(var(--foreground))]">
          <LockKeyhole className="size-4 shrink-0 text-primary" />
          <span>১০০% পরিচয় সুরক্ষিত</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border-2 border-foreground bg-card px-3.5 py-2 shadow-[2px_2px_0_0_hsl(var(--foreground))]">
          <ShieldCheck className="size-4 shrink-0 text-secondary" />
          <span>যাচাইকৃত নথি প্রমাণ</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border-2 border-foreground bg-card px-3.5 py-2 shadow-[2px_2px_0_0_hsl(var(--foreground))]">
          <Activity className="size-4 shrink-0 text-primary" />
          <span>লাইভ এলাকা মনিটরিং</span>
        </div>
      </div>
    </div>
  );
}
