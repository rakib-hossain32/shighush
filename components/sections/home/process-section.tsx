import Link from "next/link";
import { FileEdit, ScanSearch, BadgeCheck, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./section-header";

const steps = [
  {
    step: "০১",
    title: "সত্য ঘটনা নির্ভয়ে দাখিল করুন",
    icon: FileEdit,
    badge: "গোপনীয়",
    description:
      "কী ঘটেছে, সংশ্লিষ্ট দপ্তর কোনটি এবং সময়—বাস্তব সত্যটুকু পরিষ্কার ভাষায় লিখুন। নিজের নাম বা ঠিকানা লেখার প্রয়োজন নেই।",
    tip: "টিপস: বস্তুনিষ্ঠ তথ্য প্রদান করুন।",
  },
  {
    step: "০২",
    title: "প্রমাণ সংযুক্তি ও তথ্য মাস্কিং",
    icon: ScanSearch,
    badge: "সুরক্ষিত",
    description:
      "ফি রশিদ, অডিও ক্লিপ বা ছবি থাকলে আপলোড করুন। সিস্টেমে ব্যক্তিগত সংবেদনশীল তথ্য সতর্কতার সঙ্গে ঢেকে দেওয়া হয়।",
    tip: "টিপস: প্রমাণ সংযুক্তিতে বিশ্বাসযোগ্যতা বাড়ে।",
  },
  {
    step: "০৩",
    title: "নীতিগত রিভিউ ও উন্মুক্ত প্রকাশ",
    icon: BadgeCheck,
    badge: "আর্কাইভ",
    description:
      "নীতিমালার আলোকে পর্যালোচনা শেষে ইউনিক পাবলিক আইডি (যেমন: শি-০০৪২) সহ নথি প্রকাশিত হয়। সিক্রেট টোকেন দিয়ে ট্র্যাক করুন।",
    tip: "টিপস: সিক্রেট টোকেনটি সংরক্ষণ করুন।",
  },
];

export function ProcessSection() {
  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-24 border-b-2 border-border bg-background py-14 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Reusable Section Header */}
        <SectionHeader
          badgeIcon={ShieldCheck}
          badgeText="০৭ — কাজের ধারা / একটি অভিযোগের রূপান্তর"
          title={
            <>
              একটি সাধারণ অভিযোগ যেভাবে<br className="hidden sm:inline" />
              আইনসঙ্গত নাগরিক নথি হয়ে ওঠে।
            </>
          }
          action={{
            href: "/methodology",
            label: "যাচাই ও রিভিউ নীতিমালা",
          }}
        />

        {/* 2-Column Mobile Grid, 3-Column on Desktop (Proportionally Scaled) */}
        <div className="mt-8 grid grid-cols-2 gap-2.5 min-[480px]:gap-3.5 sm:mt-14 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {steps.map((item, index) => {
            const Icon = item.icon;
            const isLastOnMobile = index === 2;

            return (
              <article
                key={item.step}
                className={cn(
                  "group relative flex flex-col justify-between border-2 border-border bg-card transition-all duration-300",
                  "p-3 min-[400px]:p-4 sm:p-6 lg:p-8",
                  "hover:-translate-y-1 hover:border-foreground hover:shadow-[3px_3px_0_var(--foreground)] sm:hover:shadow-[4px_4px_0_var(--foreground)]",
                  isLastOnMobile && "col-span-2 lg:col-span-1",
                )}
              >
                {/* Step Top Bar */}
                <div className="flex items-center justify-between border-b border-border pb-2.5 sm:pb-4">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="grid size-5 min-[400px]:size-6 sm:size-7 place-items-center bg-primary  text-[10px] sm:text-xs font-bold text-primary-foreground">
                      {item.step}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-foreground">
                      ধাপ {item.step}
                    </span>
                  </div>

                  <span className="rounded-none bg-muted px-1.5 py-0.5 text-[9px] min-[400px]:text-[10px] font-semibold text-muted-foreground">
                    {item.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="my-3 min-[400px]:my-4 sm:my-6 flex-1">
                  <div className="grid size-7 min-[400px]:size-8 sm:size-11 place-items-center border border-border bg-background text-primary transition-colors group-hover:border-primary group-hover:bg-primary/10">
                    <Icon className="size-3.5 min-[400px]:size-4 sm:size-5" />
                  </div>

                  <h3 className="mt-2.5 min-[400px]:mt-3 sm:mt-5 text-xs min-[400px]:text-sm sm:text-lg lg:text-xl font-bold leading-snug text-foreground">
                    {item.title}
                  </h3>

                  <p className="mt-1.5 min-[400px]:mt-2 sm:mt-3 text-[10px] min-[400px]:text-[11px] sm:text-xs lg:text-sm leading-normal sm:leading-relaxed text-muted-foreground line-clamp-3 sm:line-clamp-none">
                    {item.description}
                  </p>
                </div>

                {/* Helpful Tip Footer */}
                <div className="border-t border-border/80 pt-2 sm:pt-3 text-[9px] min-[400px]:text-[10px] sm:text-xs italic text-muted-foreground">
                  {item.tip}
                </div>
              </article>
            );
          })}
        </div>

        {/* Action Prompt Banner */}
        <div className="mt-8 sm:mt-12 flex flex-col items-start justify-between gap-3 sm:gap-4 border border-dashed border-border bg-muted/30 p-4 sm:p-6 sm:flex-row sm:items-center sm:px-8">
          <div>
            <p className="text-xs sm:text-sm font-bold text-foreground">
              আপনার কাছে কি কোনো সেবামূলক অনিয়মের অভিজ্ঞতা আছে?
            </p>
            <p className="mt-0.5 text-[11px] sm:text-xs text-muted-foreground">
              আপনার একটি নির্ভীক তথ্য অন্য শত শত নাগরিকের অধিকার সুরক্ষিত করতে পারে।
            </p>
          </div>
          <Link
            href="/report/new"
            className="inline-flex items-center gap-2 border-2 border-foreground bg-primary px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none whitespace-nowrap cursor-pointer"
          >
            অভিযোগ নথিভুক্ত করুন
          </Link>
        </div>
      </div>
    </section>
  );
}
