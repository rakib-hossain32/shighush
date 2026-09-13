import Link from "next/link";
import { ArrowUpRight, ShieldAlert } from "lucide-react";

import { AppealForm } from "@/components/sections/appeal/appeal-form";
import { AppealGuidance } from "@/components/sections/appeal/appeal-guidance";
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
      <div className="space-y-8">
        {/* Priority Alert (Neo-Brutalist Box) */}
        <div className="flex items-start gap-3.5 border-2 border-primary bg-primary/10 p-4 sm:p-5 shadow-[3px_3px_0_var(--foreground)]">
          <ShieldAlert className="size-5 text-primary shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-foreground leading-relaxed">
            <strong className="text-primary font-bold">জরুরি গোপনীয়তা ঝুঁকি?</strong>{" "}
            নথিতে ব্যক্তিগত পরিচয় (নাম, ফোন, এনআইডি, মুখাবয়ব) প্রকাশ পেয়েছে মনে হলে Case ID-সহ অনতিবিলম্বে আবেদন করুন। এ ধরনের আবেদন সর্বোচ্চ অগ্রাধিকারে ৪৮ ঘণ্টার মধ্যে পর্যালোচনা করা হয়।
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]">
          <AppealForm />
          <AppealGuidance />
        </div>

        {/* Bottom cross-link */}
        <div className="border-t-2 border-border pt-6 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
          <p className="text-muted-foreground">
            নিজের দাখিলকৃত রিপোর্টের বর্তমান অগ্রগতি জানতে চান?
          </p>
          <Link
            href="/track"
            className="inline-flex items-center gap-1.5 border-2 border-border bg-card px-4 py-2 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:border-foreground hover:shadow-none cursor-pointer"
          >
            <span>গোপন কেস ট্র্যাকিং পোর্টালে যান</span>
            <ArrowUpRight className="size-3.5 ml-1" />
          </Link>
        </div>
      </div>
    </PageFrame>
  );
}
