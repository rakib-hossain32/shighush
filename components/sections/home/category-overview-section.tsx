import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [["০১", "ঘুষ ও অতিরিক্ত অর্থ", "সেবার নির্ধারিত ফি-এর বাইরে অর্থ চাওয়া বা নেওয়া"], ["০২", "সেবা-বঞ্চনা", "প্রাপ্য সেবা অযথা বিলম্ব, প্রত্যাখ্যান বা আটকে রাখা"], ["০৩", "হয়রানি", "নাগরিককে অপমান, ভয় দেখানো বা অপ্রয়োজনীয় ঘোরানো"], ["০৪", "তথ্য না দেওয়া", "সেবার নিয়ম, ফি বা সিদ্ধান্তের তথ্য গোপন রাখা"]];

export function CategoryOverviewSection() {
  return <section className="border-y border-border bg-background py-20"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="flex flex-col justify-between gap-4 border-b-2 border-foreground pb-6 sm:flex-row sm:items-end"><div><p className="mono text-[11px] font-bold tracking-[.16em] text-primary">রিপোর্টের ধরন</p><h2 className="display mt-3 text-4xl font-bold">কী নিয়ে নথি করবেন?</h2></div><Link href="/report/new" className="inline-flex items-center gap-2 font-bold underline">অভিযোগ লেখা শুরু করুন <ArrowUpRight className="size-4"/></Link></div><div className="grid border-l border-foreground md:grid-cols-2">{categories.map(([number,title,copy]) => <article className="border-b border-r border-foreground p-6 sm:p-8" key={number}><span className="mono text-xs font-bold text-primary">{number}</span><h3 className="mt-9 text-xl font-bold">{title}</h3><p className="mt-3 max-w-sm leading-7 text-muted-foreground">{copy}</p></article>)}</div></div></section>;
}
