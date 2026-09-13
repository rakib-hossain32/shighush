import { BadgeCheck, FileText, Landmark, ShieldCheck, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./section-header";

const levels = [
  {
    tier: "স্তর ০১",
    title: "অযাচাইকৃত (নাগরিক বিবরণ)",
    badge: "প্রাথমিক",
    icon: FileText,
    accent: "text-muted-foreground border-border",
    description:
      "নাগরিকের নিজ অভিজ্ঞতার বস্তুনিষ্ঠ বিবরণ। প্ল্যাটফর্মের ন্যূনতম গাইডলাইন, শব্দহীনতা ও সংবেদনশীল তথ্য মাস্কিং পাস করেছে।",
    points: [
      "নাগরিকের সরাসরি বক্তব্য",
      "নীতিগত ফিল্টারিং সম্পন্ন",
      "অভিজ্ঞতার উন্মুক্ত রেকর্ড",
    ],
  },
  {
    tier: "স্তর ০২",
    title: "প্রমাণ সংযুক্ত (যাচাইযোগ্য)",
    badge: "উচ্চ প্রামাণ্যতা",
    icon: BadgeCheck,
    accent: "text-primary border-primary/40",
    description:
      "অভিযোগের সপক্ষে ব্যাংক স্লিপ, সরকারি ফি রসিদ, ফটো বা অডিও রেকর্ডিং যুক্ত করা হয়েছে—যা ঘটনাটিকে প্রমাণ করে।",
    points: [
      "রসিদ বা অডিও/ছবি সংযুক্তি",
      "স্থান ও সময়ের দলিল",
      "রিভিউয়ার টিম কর্তৃক পর্যালোচিত",
    ],
  },
  {
    tier: "স্তর ০৩",
    title: "অফিসিয়াল রেকর্ড (পাবলিক)",
    badge: "আইনি দলিল",
    icon: Landmark,
    accent: "text-emerald-600 dark:text-emerald-400 border-emerald-500/40",
    description:
      "সরকারি তদন্ত রিপোর্ট, প্রশাসনিক নোটিশ, আদালত রায় বা তথ্য অধিকার (RTI) আইনে প্রাপ্ত দাপ্তরিক নথির ভিত্তিতে সমর্থিত।",
    points: [
      "দাপ্তরিক নোটিশ ও চিঠি",
      "প্রশাসনিক তদন্তের ফল",
      "তথ্য অধিকার আইনের নথি",
    ],
  },
];

export function VerificationSection() {
  return (
    <section className="relative border-b-2 border-border bg-background py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Reusable Section Header */}
        <SectionHeader
          badgeIcon={ShieldCheck}
          badgeText="০৯ — বিশ্বাসযোগ্যতার ফ্রেমওয়ার্ক / প্রমাণের মানদণ্ড"
          title={
            <>
              প্রতিটি নথির সঙ্গে স্পষ্ট থাকবে<br className="hidden sm:inline" />
              যাচাইয়ের সুনির্দিষ্ট স্তর।
            </>
          }
          description="শিঘুষ কোনো অনলাইনের ভিত্তিহীন দাবি বা গুজবের জায়গা নয়। প্রতিটি নথি তার প্রমাণের গভীরতা অনুযায়ী ৩টি স্তরে স্বচ্ছভাবে চিহ্নিত থাকে।"
          action={{
            href: "/safety",
            label: "নাগরিক সুরক্ষা নীতিমালা",
          }}
        />

        {/* 2-Column Mobile Grid, 3-Column on Desktop (Proportionally Scaled) */}
        <div className="mt-8 grid grid-cols-2 gap-2.5 min-[480px]:gap-3.5 sm:mt-14 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {levels.map((item, index) => {
            const Icon = item.icon;
            const isLastOnMobile = index === 2;

            return (
              <article
                key={item.tier}
                className={cn(
                  "group relative flex flex-col justify-between border-2 border-border bg-card transition-all duration-300",
                  "p-3 min-[400px]:p-4 sm:p-6 lg:p-8",
                  "hover:-translate-y-1 hover:border-foreground hover:shadow-[3px_3px_0_var(--foreground)] sm:hover:shadow-[4px_4px_0_var(--foreground)]",
                  isLastOnMobile && "col-span-2 lg:col-span-1",
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className=" text-[10px] sm:text-xs font-bold text-primary">
                        {item.tier}
                      </span>
                      <span className="rounded-none bg-muted px-1.5 py-0.5 text-[9px] min-[400px]:text-[10px] font-semibold text-muted-foreground">
                        {item.badge}
                      </span>
                    </div>

                    <div
                      className={cn(
                        "grid size-7 min-[400px]:size-8 sm:size-10 place-items-center border bg-background transition-colors group-hover:bg-primary/10 group-hover:border-primary group-hover:text-primary",
                        item.accent,
                      )}
                    >
                      <Icon className="size-3.5 min-[400px]:size-4 sm:size-5" />
                    </div>
                  </div>

                  <h3 className="mt-3 min-[400px]:mt-4 sm:mt-6 text-xs min-[400px]:text-sm sm:text-lg lg:text-xl font-bold leading-snug text-foreground">
                    {item.title}
                  </h3>

                  <p className="mt-1.5 min-[400px]:mt-2 sm:mt-3 text-[10px] min-[400px]:text-[11px] sm:text-xs lg:text-sm leading-normal sm:leading-relaxed text-muted-foreground line-clamp-3 sm:line-clamp-none">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 min-[400px]:mt-4 sm:mt-6 border-t border-border/80 pt-2.5 sm:pt-4">
                  <ul className="space-y-1 sm:space-y-2">
                    {item.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-1 sm:gap-2 text-[9px] min-[400px]:text-[10px] sm:text-xs font-medium leading-tight sm:leading-normal text-foreground/85"
                      >
                        <CheckCircle2 className="size-2.5 min-[400px]:size-3 sm:size-3.5 shrink-0 text-primary mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
