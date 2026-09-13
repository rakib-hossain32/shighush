import {
  CheckCircle2,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";

const capabilities = [
  {
    icon: CheckCircle2,
    badge: "লাইভ স্ট্যাটাস",
    title: "বর্তমান পর্যায় পর্যবেক্ষণ",
    description:
      "দাখিল, গোপনীয়তা পর্যালোচনা, প্রমাণ যাচাই, অতিরিক্ত তথ্যের প্রয়োজন বা চূড়ান্ত প্রকাশনা—প্রতিটি ধাপের রিয়েলটাইম টাইমস্ট্যাম্পসহ অগ্রগতি দেখতে পাবেন।",
  },
  {
    icon: MessageSquareText,
    badge: "এনক্রিপ্টেড চ্যাট",
    title: "দ্বিমুখী বেনামি বার্তা",
    description:
      "মডারেটর যদি কোনো অস্পষ্টতা বা অতিরিক্ত প্রমাণের জন্য বার্তা পাঠান, আপনি আপনার পরিচয় সম্পূর্ণ গোপন রেখে সরাসরি এই কেস স্পেস থেকে উত্তর দিতে পারবেন।",
  },
  {
    icon: ShieldCheck,
    badge: "সম্পূর্ণ বিচ্ছিন্ন",
    title: "তথ্য ও ক্রেডেনশিয়াল পৃথকীকরণ",
    description:
      "পাবলিক প্ল্যাটফর্মে যে রিপোর্ট প্রদর্শিত হয়, তার সঙ্গে আপনার ট্র্যাকিং ক্রেডেনশিয়াল সম্পূর্ণ ভিন্ন স্তরে সংরক্ষিত থাকে, যা বাইরের কারো পক্ষে ডিকোড করা অসম্ভব।",
  },
];

export function TrackExpectations() {
  return (
    <section className="mt-12 space-y-6">
      <div className="border-b-2 border-border pb-4">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
          PRIVATE CASE CAPABILITIES
        </span>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground font-heading mt-1">
          গোপন কেস স্পেসে আপনি কী কী দেখতে পাবেন
        </h2>
        <p className="text-xs text-muted-foreground mt-1 ">
          আপনার দাখিলকৃত রিপোর্টের পূর্ণ নিয়ন্ত্রণ ও পর্যবেক্ষণ ক্ষমতা আপনার হাতে
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {capabilities.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.title}
              className="flex flex-col justify-between border-2 border-border bg-card p-5 sm:p-6 transition-all hover:border-foreground hover:shadow-[3px_3px_0_var(--foreground)] hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between gap-2 border-b-2 border-border pb-3">
                  <span className="grid size-9 place-items-center border-2 border-border bg-background text-primary">
                    <Icon className="size-4.5" />
                  </span>
                  <span className="border border-primary/40 bg-primary/10 px-2 py-0.5  text-[10px] font-bold text-primary">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold mt-3 font-heading text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground mt-2">
                  {item.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
