import Link from "next/link";
import {
  Banknote,
  ClockAlert,
  ShieldAlert,
  FolderLock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./section-header";

const categories = [
  {
    number: "০১",
    title: "ঘুষ ও অতিরিক্ত অর্থ",
    icon: Banknote,
    accent: "text-primary border-primary/30",
    description:
      "সেবায় নির্ধারিত সরকারি ফি-এর বাইরে নগদ অর্থ দাবি, দালালের মাধ্যমে রফাদফা বা টাকা না দিলে ফাইল আটকে রাখার ঘটনা।",
    examples: ["নামজারি ও খাজনা", "হাসপাতাল বেড", "বিদ্যুৎ সংযোগ"],
    href: "/reports?category=bribery",
  },
  {
    number: "০২",
    title: "সেবা-বঞ্চনা ও বিলম্ব",
    icon: ClockAlert,
    accent: "text-amber-600 dark:text-amber-400 border-amber-500/30",
    description:
      "প্রাপ্য সেবা থেকে বঞ্চিত করা, দিনের পর দিন ফাইল টেবিলে ফেলে রাখা বা অযথা কাগজপত্র চেয়ে সেবাগ্রহীতাকে ঘোরানো।",
    examples: ["প্রত্যয়ন ও জন্মনিবন্ধন", "ভাতা কার্ড", "থানার GD"],
    href: "/reports?category=service_denial",
  },
  {
    number: "০৩",
    title: "হয়রানি ও অসদাচরণ",
    icon: ShieldAlert,
    accent: "text-rose-600 dark:text-rose-400 border-rose-500/30",
    description:
      "নাগরিকের সঙ্গে অসৌজন্যমূলক আচরণ, ভয়ভীতি প্রদর্শন, হুমকি দেওয়া কিংবা আইনি ক্ষমতার অপব্যবহার করে চাপ সৃষ্টি।",
    examples: ["পুলিশি ভয়ভীতি", "দপ্তরের দুর্ব্যবহার", "মিথ্যা জটিলতা"],
    href: "/reports?category=harassment",
  },
  {
    number: "০৪",
    title: "তথ্য গোপন ও অনিয়ম",
    icon: FolderLock,
    accent: "text-blue-600 dark:text-blue-400 border-blue-500/30",
    description:
      "সেবার সুনির্দিষ্ট সরকারি ফি চার্ট না টানানো, তথ্যের আবেদনে সাড়া না দেওয়া বা আবেদন বাতিলের লিখিত কারণ না জানানো।",
    examples: ["ফি চার্ট গোপন", "বরাদ্দ তথ্য না দেওয়া", "লিখিত কারণহীন বাতিল"],
    href: "/reports?category=other",
  },
];

export function CategoryOverviewSection() {
  return (
    <section className="relative border-b-2 border-border bg-background py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Reusable Section Header */}
        <SectionHeader
          badgeIcon={Sparkles}
          badgeText="০৫ — ক্যাটাগরি সূচি / সাধারণ অনিয়মসমূহ"
          title="কী বিষয় নিয়ে নথি করবেন?"
          description="নাগরিক সেবায় অনিয়ম সাধারণত এই চার প্রধান রূপে দেখা যায়। আপনার অভিজ্ঞতা যে ধরনেরই হোক, তা স্পষ্টভাবে লিপিবদ্ধ করুন।"
          action={{
            href: "/report/new",
            label: "নতুন রিপোর্ট শুরু করুন",
            variant: "button",
          }}
        />

        {/* 2-Column Mobile Grid, 4-Column on Desktop (Proportionally Scaled) */}
        <div className="mt-8 grid grid-cols-2 gap-2.5 min-[480px]:gap-3.5 sm:mt-14 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;

            return (
              <article
                key={cat.number}
                className={cn(
                  "group relative flex flex-col justify-between border-2 border-border bg-card transition-all duration-300",
                  "p-3 min-[400px]:p-4 sm:p-6 lg:p-7",
                  "hover:-translate-y-1 hover:border-foreground hover:shadow-[3px_3px_0_var(--foreground)] sm:hover:shadow-[4px_4px_0_var(--foreground)]",
                )}
              >
                <div>
                  {/* Card Header: Number & Icon */}
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        "grid size-7 min-[400px]:size-8 sm:size-10 place-items-center border bg-muted/40 transition-colors group-hover:bg-primary/10 group-hover:border-primary group-hover:text-primary",
                        cat.accent,
                      )}
                    >
                      <Icon className="size-3.5 min-[400px]:size-4 sm:size-5" />
                    </div>
                    <span className=" text-[10px] sm:text-xs font-bold tracking-wider text-muted-foreground">
                      {cat.number}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-3 min-[400px]:mt-4 sm:mt-6 text-xs min-[400px]:text-sm sm:text-lg lg:text-xl font-bold leading-snug text-foreground">
                    {cat.title}
                  </h3>

                  <p className="mt-1.5 min-[400px]:mt-2 sm:mt-3 text-[10px] min-[400px]:text-[11px] sm:text-xs leading-normal sm:leading-relaxed text-muted-foreground line-clamp-3 sm:line-clamp-none">
                    {cat.description}
                  </p>

                  {/* Examples Pills */}
                  <div className="mt-3 min-[400px]:mt-4 sm:mt-5 flex flex-wrap items-center gap-1 border-t border-border/70 pt-2 sm:pt-3">
                    {cat.examples.map((ex) => (
                      <span
                        key={ex}
                        className="rounded-none bg-muted px-1.5 py-0.5 text-[9px] min-[400px]:text-[10px] sm:text-[11px] font-medium text-foreground/85"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="mt-4 border-t border-border/70 pt-2.5 sm:mt-6 sm:pt-3">
                  <Link
                    href={cat.href}
                    className="inline-flex items-center gap-1 text-[10px] min-[400px]:text-[11px] sm:text-xs font-bold text-foreground transition-colors group-hover:text-primary"
                  >
                    <span>রিপোর্ট দেখুন</span>
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
