import Link from "next/link";
import { ArrowUpRight, ShieldAlert } from "lucide-react";
import { PageFrame } from "@/components/page-frame";
import { AppealForm } from "@/components/sections/appeal/appeal-form";
import { AppealGuidance } from "@/components/sections/appeal/appeal-guidance";
import { createPageMetadata } from "@/lib/seo";
export const metadata = createPageMetadata({ title: "আপিল ও সংশোধনী অনুরোধ", description: "ভুল তথ্য, privacy ঝুঁকি বা প্রাসঙ্গিক জবাবের জন্য review request পাঠান।", path: "/appeal", index: false });

export default function AppealPage() {
  return <PageFrame eyebrow="আপিল / সংশোধনী অনুরোধ" title="কোনো নথি নিয়ে আপত্তি আছে?" copy="ভুল তথ্য, ব্যক্তিগত গোপনীয়তার ঝুঁকি, বা প্রতিষ্ঠানের প্রাসঙ্গিক জবাব যুক্ত করতে চাইলে এখানে review request পাঠান।">
    <div className="mb-8 flex gap-3 border-l-4 border-primary bg-muted p-5 text-sm leading-6"><ShieldAlert className="mt-0.5 size-5 shrink-0 text-primary"/><p>জরুরি privacy risk থাকলে নথির ID-সহ সংক্ষেপে আবেদন করুন। ভুলভাবে প্রকাশিত ব্যক্তিগত তথ্য review-এর সময় অগ্রাধিকার পাবে।</p></div>
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px]"><AppealForm/><AppealGuidance/></div>
    <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">আপনার নিজের submitted report-এর অবস্থান জানতে চান? <Link href="/track" className="font-bold text-foreground underline">গোপন tracking page-এ যান <ArrowUpRight className="inline size-4"/></Link></div>
  </PageFrame>;
}
