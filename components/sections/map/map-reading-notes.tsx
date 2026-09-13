import Link from "next/link";
import { ArrowUpRight, FileSearch, Layers3, Scale } from "lucide-react";

const notes = [
  {
    icon: Layers3,
    badge: "ডেটা ব্যাখ্যা",
    title: "এলাকা ≠ অভিযোগকারীর অবস্থান",
    description:
      "ম্যাপে শুধু ঘটনার সাথে প্রাসঙ্গিক ইউনিয়ন বা সেবা এলাকার aggregate view দেখা যায়। অভিযোগকারীর বাসস্থান বা ডিভাইসের জিপিএস তথ্য কখনোই ব্যবহৃত হয় না।",
  },
  {
    icon: FileSearch,
    badge: "সতর্কতা",
    title: "রিপোর্ট সংখ্যা চূড়ান্ত প্রমাণ নয়",
    description:
      "একটি এলাকায় বেশি রিপোর্ট মানে ওই অঞ্চলের নাগরিকরা বেশি সচেতন বা সক্রিয় হতে পারেন—এটি সরাসরি অপরাধের পরিমাপ হিসেবে ব্যবহার করবেন না।",
  },
  {
    icon: Scale,
    badge: "পরামর্শ",
    title: "তুলনা করার আগে পদ্ধতি পড়ুন",
    description:
      "প্রমাণের স্তর, সময়সীমা এবং প্রতিষ্ঠানের আকার বিবেচনা করে তথ্য পড়ুন। দুটি ভিন্ন ইউনিয়নে একই সংখ্যক রিপোর্ট থাকলেও গুরুত্ব ভিন্ন হতে পারে।",
  },
];

export function MapReadingNotes() {
  return (
    <section className="space-y-5">
      <div className="border-b-2 border-border pb-3.5">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
          DATA INTERPRETATION GUIDE
        </span>
        <h2 className="text-xl font-extrabold tracking-tight text-foreground font-heading mt-1">
          এই ম্যাপ পড়ার আগে জেনে নিন
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {notes.map((note) => {
          const Icon = note.icon;
          return (
            <article
              key={note.title}
              className="flex flex-col justify-between border-2 border-border bg-card p-5 transition-all hover:border-foreground hover:shadow-[3px_3px_0_var(--foreground)] hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between gap-2 border-b-2 border-border pb-3">
                  <span className="grid size-8 place-items-center border-2 border-border bg-background text-primary">
                    <Icon className="size-4" />
                  </span>
                  <span className="border border-border bg-background px-2 py-0.5  text-[10px] font-bold text-muted-foreground">
                    {note.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold mt-3 font-heading text-foreground">
                  {note.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground mt-2">
                  {note.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="flex justify-end pt-2">
        <Link
          href="/methodology"
          className="inline-flex items-center gap-1.5 border-2 border-foreground bg-background px-4 py-2 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
        >
          <span>তথ্য ব্যবহারের পূর্ণ পদ্ধতি পড়ুন</span>
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}
