import { EyeOff, FileCheck2, Scale } from "lucide-react";

const principles = [
  [EyeOff, "পরিচয় নয়, তথ্য মুখ্য", "অভিযোগকারীর নাম বা যোগাযোগ তথ্য প্রকাশ করা হয় না।"],
  [FileCheck2, "প্রমাণের স্তর আলাদা", "নথিতে কোন তথ্য যাচাই হয়েছে আর কোনটি হয়নি, তা স্পষ্ট থাকে।"],
  [Scale, "জবাব দেওয়ার সুযোগ", "প্রাসঙ্গিক সংশোধনী, আপিল ও প্রতিষ্ঠানের উত্তর timestamp-সহ দেখানো হয়।"],
] as const;

export function PlatformIntroSection() {
  return <section className="bg-background py-20"><div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[.9fr_1.1fr] lg:px-8"><div><p className="mono text-[11px] font-bold tracking-[.16em] text-primary">কেন শিঘুষ</p><h2 className="display mt-4 text-4xl font-bold leading-tight sm:text-5xl">শুধু অভিযোগ নয়,<br/>একটি নাগরিক রেকর্ড।</h2><p className="mt-6 max-w-md leading-8 text-muted-foreground">শিবচরের সেবাগ্রহীতার অভিজ্ঞতা যেন হারিয়ে না যায়, বরং সমস্যা বোঝা ও জবাবদিহিতার ভিত্তি হয়—সেজন্য এই প্ল্যাটফর্ম।</p></div><div className="grid gap-px overflow-hidden border-2 border-foreground bg-foreground md:grid-cols-3">{principles.map(([Icon,title,copy]) => <article key={title} className="bg-background p-6"><Icon className="size-6 text-primary"/><h3 className="mt-12 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p></article>)}</div></div></section>;
}
