import Link from "next/link";
import { ArrowUpRight, Info, ShieldAlert } from "lucide-react";

import { AppealFormRedesigned } from "@/components/sections/appeal/appeal-form-redesigned";
import { AppealGuidanceRedesigned } from "@/components/sections/appeal/appeal-guidance-redesigned";
import { PageFrame } from "@/components/page-frame";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "আপিল ও সংশোধনী অনুরোধ পোর্টাল",
  description:
    "ভুল তথ্য, গোপনীয়তার ঝুঁকি বা প্রাতিষ্ঠানিক জবাবের জন্য গোপনীয় পর্যালোচনার অনুরোধ পাঠান।",
  path: "/appeal",
  index: false,
});

export default function AppealPage() {
  return (
    <PageFrame
      badgeText="গোপনীয় পর্যালোচনা প্রক্রিয়া"
      breadcrumbs={[{ label: "আপিল ও সংশোধনী" }]}
      copy="ভুল তথ্য, ব্যক্তিগত গোপনীয়তার ঝুঁকি, বা প্রতিষ্ঠানের প্রাসঙ্গিক আনুষ্ঠানিক জবাব যুক্ত করতে চাইলে এখানে পর্যালোচনার আবেদন পাঠান।"
      eyebrow="আপিল / সংশোধনী অনুরোধ পোর্টাল"
      title="কোনো নথিতে আপত্তি বা সংশোধন দরকার?"
    >
      <div className="space-y-7">
        {/* Priority Alert - Redesigned with stronger visual hierarchy */}
        <div className="border-2 border-destructive bg-destructive/5 shadow-[4px_4px_0_var(--foreground)]">
          <div className="border-b-2 border-destructive/30 bg-destructive/10 px-4 py-2.5 sm:px-5 sm:py-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-5 text-destructive shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-destructive uppercase tracking-wide">
                জরুরি গোপনীয়তা ঝুঁকি সতর্কতা
              </span>
            </div>
          </div>
          <div className="p-4 sm:p-5">
            <p className="text-xs sm:text-sm text-foreground leading-relaxed">
              নথিতে <strong className="text-destructive font-bold">ব্যক্তিগত পরিচয়</strong> (নাম,
              ফোন নম্বর, এনআইডি, মুখাবয়ব) প্রকাশ পেয়েছে মনে হলে অবিলম্বে Case ID-সহ আবেদন করুন।
              এ ধরনের আবেদন <strong className="text-primary font-bold">২৪-৪৮ ঘণ্টার মধ্যে</strong>{" "}
              সর্বোচ্চ অগ্রাধিকারে পর্যালোচনা করা হয়।
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="flex items-start gap-3 border border-border bg-muted/50 p-4">
          <Info className="size-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            এই পোর্টালটি প্রকাশিত নথির বিরুদ্ধে আপত্তি জানাতে বা সংশোধনের জন্য।
            নতুন অভিযোগ জমা দিতে চাইলে{" "}
            <Link href="/report/new" className="font-bold text-primary hover:underline">
              রিপোর্ট ফর্ম
            </Link>{" "}
            ব্যবহার করুন।
          </p>
        </div>

        {/* Main Layout - Responsive Grid with items-start */}
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)] lg:items-start">
          <AppealFormRedesigned />
          <AppealGuidanceRedesigned />
        </div>

        {/* Bottom Cross-link - Redesigned */}
        <div className="border-t-2 border-border pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card border border-border p-5">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                নিজের দাখিলকৃত রিপোর্টের অগ্রগতি জানতে চান?
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                গোপন ট্র্যাকিং কোড দিয়ে রিপোর্টের স্ট্যাটাস দেখুন
              </p>
            </div>
            <Link
              href="/track"
              className="inline-flex items-center gap-2 border-2 border-foreground bg-primary px-5 py-2.5 text-xs font-bold text-foreground shadow-[3px_3px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none whitespace-nowrap"
            >
              <span>কেস ট্র্যাকিং পোর্টাল</span>
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </PageFrame>
  );
}
