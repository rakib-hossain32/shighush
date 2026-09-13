import Link from "next/link";
import { ArrowUpRight, MapPin, MapPinned, ShieldAlert, Sparkles } from "lucide-react";

const unions = [
  { name: "শিবচর পৌরসভা", type: "পৌর এলাকা", count: "৮টি নথি" },
  { name: "কাঁঠালবাড়ী", type: "ঘাট ও চর এলাকা", count: "৫টি নথি" },
  { name: "পাঁচচর", type: "বাণিজ্যিক জংশন", count: "৪টি নথি" },
  { name: "মাদবরেরচর", type: "নদী তীরবর্তী", count: "৩টি নথি" },
  { name: "কুতুবপুর", type: "গ্রামীণ ইউনিয়ন", count: "৩টি নথি" },
  { name: "বাঁশকান্দি", type: "কৃষি ও বাজার", count: "২টি নথি" },
  { name: "উমেদপুর", type: "সীমান্তবর্তী এলাকা", count: "২টি নথি" },
  { name: "দ্বিতীয়খণ্ড", type: "আবাসিক ও কৃষি", count: "১টি নথি" },
];

export function LocationSection() {
  return (
    <section className="relative border-b-2 border-border bg-card/40 py-18 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          {/* Left Column: Context & Privacy Pledge */}
          <div>
            <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold tracking-wider text-primary">
              <MapPinned className="size-3.5" />
              <span>১০ — ভৌগোলিক ম্যাপিং / হটস্পট ওভারভিউ</span>
            </div>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              সমস্যার সঠিক অবস্থান<br className="hidden sm:inline" />
              বোঝা সহজ করুন।
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              শিবচরের বিভিন্ন ইউনিয়ন, পৌরসভা ও ঘাট এলাকায় কোন ধরনের ভোগান্তি বা
              অনিয়মের প্রবণতা বেশি, তা একটি গোপনীয়তা-সুরক্ষিত সমন্বিত মানচিত্রে
              উপস্থাপন করা হয়েছে।
            </p>

            <div className="mt-6 flex items-start gap-3 border border-border bg-background p-4 text-xs leading-relaxed text-muted-foreground">
              <ShieldAlert className="size-4 shrink-0 text-primary mt-0.5" />
              <p>
                <strong className="text-foreground">গোপনীয়তা নিশ্চিত:</strong>{" "}
                মানচিত্রটি শুধুমাত্র ইউনিয়নভিত্তিক সমষ্টিগত ডেটা প্রদর্শন করে;
                কোনো অভিযোগকারীর সঠিক অবস্থান বা ঠিকানা কখনো উন্মুক্ত করা হয় না।
              </p>
            </div>

            <div className="mt-8">
              <Link
                href="/map"
                className="group inline-flex items-center gap-2 border-2 border-foreground bg-primary px-6 py-3.5 text-sm font-bold text-foreground shadow-[3px_3px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
              >
                <span>ইন্টারেক্টিভ মানচিত্র খুলুন</span>
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Area Matrix */}
          <div className="border-2 border-border bg-background p-6 sm:p-8 shadow-[4px_4px_0_var(--foreground)]">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  শিবচরের অন্তর্ভুক্ত ইউনিয়নসমূহ
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  এলাকাভিত্তিক নাগরিক রেকর্ড প্রিভিউ
                </p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" />
                <span>ম্যাপিং সক্রিয়</span>
              </span>
            </div>

            {/* Union Chips Grid */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {unions.map((union) => (
                <Link
                  key={union.name}
                  href={`/map`}
                  className="group flex items-center justify-between border border-border bg-muted/30 p-3.5 transition-all hover:border-foreground hover:bg-muted/70 hover:shadow-[2px_2px_0_var(--foreground)]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="grid size-7 place-items-center bg-background border border-border text-primary group-hover:border-primary">
                      <MapPin className="size-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground group-hover:text-primary">
                        {union.name}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {union.type}
                      </span>
                    </div>
                  </div>

                  <span className="rounded-none border border-border/80 bg-background px-2 py-0.5  text-[11px] font-semibold text-foreground">
                    {union.count}
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-6 border-t border-border/70 pt-4 text-center">
              <Link
                href="/map"
                className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
              >
                মানচিত্রে শিবচরের সব ইউনিয়ন ও ক্লাস্টার ভিউ দেখুন →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
