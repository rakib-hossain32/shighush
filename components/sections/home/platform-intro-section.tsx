import { EyeOff, FileCheck2, Scale, ShieldCheck, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./section-header";

const principles = [
  {
    icon: EyeOff,
    number: "০১",
    badge: "গোপনীয়তা",
    title: "পরিচয় নয়, তথ্য মুখ্য",
    description:
      "অভিযোগকারীর নাম, মোবাইল নম্বর, NID বা ব্যক্তিগত অবস্থান কখনো উন্মুক্ত করা হয় না। সম্পূর্ণ নির্ভয়ে বাস্তব তথ্য তুলে ধরতে পারেন।",
    points: [
      "সংবেদনশীল তথ্যে স্বয়ংক্রিয় মাস্কিং",
      "ব্যক্তিগত ট্র্যাকিং কোড ভিত্তিক এক্সেস",
      "আইনি ঝুঁকি এড়াতে এনক্রিপশন",
    ],
  },
  {
    icon: FileCheck2,
    number: "০২",
    badge: "স্বচ্ছতা নীতি",
    title: "প্রমাণের স্তর আলাদা ও দৃশ্যমান",
    description:
      "নথিতে কোন তথ্য প্রত্যক্ষ প্রমাণের ভিত্তিতে যাচাই করা হয়েছে আর কোনটি নাগরিক বক্তব্য—তা স্পষ্ট লেবেল দিয়ে আলাদা রাখা হয়।",
    points: [
      "রসিদ ও অডিও/ভিডিও ফাইল সংযুক্তি",
      "অযাচাইকৃত বনাম যাচাইকৃত ফ্ল্যাগ",
      "অতিরঞ্জিত দাবি মুক্ত প্রতিবেদন",
    ],
  },
  {
    icon: Scale,
    number: "০৩",
    badge: "নিরপেক্ষতা",
    title: "সংশোধনী ও জবাবের পূর্ণ সুযোগ",
    description:
      "একপাক্ষিক রায় নয়; সংশ্লিষ্ট প্রতিষ্ঠান বা ব্যক্তির আনুষ্ঠানিক বক্তব্য বা ব্যাখ্যা থাকলে তা টাইমস্ট্যাম্পসহ নথিতে যুক্ত করা হয়।",
    points: [
      "প্রতিষ্ঠানের দাপ্তরিক প্রতিক্রিয়া",
      "স্বচ্ছ নাগরিক আপিল প্রক্রিয়া",
      "ভুল সংশোধন ও আর্কাইভ ব্যবস্থা",
    ],
  },
];

export function PlatformIntroSection() {
  return (
    <section className="relative border-b-2 border-border bg-background py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Reusable Section Header */}
        <SectionHeader
          badgeIcon={ShieldCheck}
          badgeText="০৩ — কেন শিঘুষ / মৌলিক নীতিমালা"
          title={
            <>
              শুধু অভিযোগ জমা নয়,<br className="hidden sm:inline" />
              একটি প্রামাণ্য নাগরিক রেকর্ড।
            </>
          }
          description="শিবচরের সাধারণ নাগরিকের প্রতিদিনের অভিজ্ঞতা যেন ধামাচাপা না পড়ে, বরং স্বচ্ছ প্রশাসন ও জবাবদিহিতার ঐতিহাসিক দলিল হয়—সেজন্যই এই নাগরিক উদ্যোগ।"
          action={{
            href: "/methodology",
            label: "আমাদের নীতি ও কর্মপদ্ধতি পড়ুন",
          }}
        />

        {/* 2-Column Mobile Grid, 3-Column on Desktop (Proportionally Scaled) */}
        <div className="mt-8 grid grid-cols-2 gap-2.5 min-[480px]:gap-3.5 sm:mt-14 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {principles.map((item, index) => {
            const Icon = item.icon;
            const isLastOnMobile = index === 2;

            return (
              <article
                key={item.title}
                className={cn(
                  "group relative flex flex-col justify-between border-2 border-border bg-card transition-all duration-300",
                  "p-3 min-[400px]:p-4 sm:p-6 lg:p-7",
                  "hover:-translate-y-1 hover:border-foreground hover:shadow-[3px_3px_0_var(--foreground)] sm:hover:shadow-[4px_4px_0_var(--foreground)]",
                  isLastOnMobile && "col-span-2 lg:col-span-1",
                )}
              >
                <div>
                  {/* Card Top: Icon & Number */}
                  <div className="flex items-center justify-between">
                    <div className="grid size-7 min-[400px]:size-8 sm:size-10 lg:size-11 place-items-center border border-border bg-background text-primary transition-colors group-hover:border-primary group-hover:bg-primary/10">
                      <Icon className="size-3.5 min-[400px]:size-4 sm:size-5" />
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="rounded-none bg-muted px-1.5 py-0.5 text-[9px] min-[400px]:text-[10px] sm:text-[11px] font-bold text-muted-foreground">
                        {item.badge}
                      </span>
                      <span className=" text-[10px] sm:text-xs font-bold text-muted-foreground/70">
                        {item.number}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-3 min-[400px]:mt-4 sm:mt-6 text-xs min-[400px]:text-sm sm:text-lg lg:text-xl font-bold leading-snug text-foreground">
                    {item.title}
                  </h3>

                  <p className="mt-1.5 min-[400px]:mt-2 sm:mt-3 text-[10px] min-[400px]:text-[11px] sm:text-xs lg:text-sm leading-normal sm:leading-relaxed text-muted-foreground line-clamp-3 sm:line-clamp-none">
                    {item.description}
                  </p>
                </div>

                {/* Key Bullet Features */}
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
