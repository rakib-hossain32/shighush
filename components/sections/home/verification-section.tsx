import { BadgeCheck, FileText, Landmark } from "lucide-react";

const levels = [["অযাচাইকৃত", "ন্যূনতম নীতিগত রিভিউ পাস করেছে", FileText], ["প্রমাণ সংযুক্ত", "প্রাসঙ্গিক নথি বা ফাইল যুক্ত আছে", BadgeCheck], ["Official record", "সরকারি বা আদালতের প্রকাশ্য নথির লিংক আছে", Landmark]] as const;

export function VerificationSection() {
  return <section className="border-y border-border bg-background py-20"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="max-w-2xl"><p className="mono text-[11px] font-bold tracking-[.16em] text-primary">বিশ্বাসযোগ্যতার ভাষা</p><h2 className="display mt-3 text-4xl font-bold">প্রতিটি নথির সঙ্গে<br/>যাচাইয়ের স্তর থাকবে</h2></div><div className="mt-10 grid divide-y divide-border border-y border-border lg:grid-cols-3 lg:divide-x lg:divide-y-0">{levels.map(([title,copy,Icon]) => <article key={title} className="p-6 first:pl-0 last:pr-0"><Icon className="size-6 text-primary"/><h3 className="mt-7 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p></article>)}</div></div></section>;
}
