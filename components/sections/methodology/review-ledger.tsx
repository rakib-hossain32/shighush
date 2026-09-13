import {
  EyeOff,
  FileCheck2,
  MessageSquareText,
  SearchCheck,
  Users,
} from "lucide-react";

const reviewSteps = [
  {
    step: "০১",
    title: "গোপনীয়তা ও ব্যক্তিগত তথ্য ফিল্টার (PII Scrubbing)",
    subtitle: "সবার আগে নাগরিক নিরাপত্তা",
    icon: EyeOff,
    tag: "স্বয়ংক্রিয় + ম্যানুয়াল",
    description:
      "জমা হওয়া প্রতিটি প্রতিবেদন থেকে সংবেদনশীল ব্যক্তিগত তথ্য (ব্যক্তিগত ফোন নম্বর, এনআইডি নম্বর, পাসপোর্ট, বাসার ঠিকানা, মুখাবয়ব, স্বাক্ষর ইত্যাদি) শনাক্ত করে স্থায়ীভাবে মুছে দেওয়া হয়।",
    points: [
      "ইমেজ মেটাডাটা ও এক্সিফ (GPS স্থানাঙ্ক) স্বয়ংক্রিয়ভাবে অপসারিত হয়",
      "ব্যক্তিগত যোগাযোগের তথ্য প্ল্যাটফর্মে কখনো সংরক্ষিত বা প্রকাশিত হয় না",
    ],
  },
  {
    step: "০২",
    title: "প্রমাণ ও পারিপার্শ্বিকতা যাচাই (Evidence Review)",
    subtitle: "তথ্যের ভিত্তি নিশ্চিতকরণ",
    icon: SearchCheck,
    tag: "মানব মডারেটর",
    description:
      "সংযুক্ত রসিদ, চালানপত্র, অডিও-ভিডিও ক্লিপ বা সরকারি আদেশনামার সত্যতা ও সংশ্লিষ্ট দফতরের সঙ্গে সামঞ্জস্য খতিয়ে দেখা হয়। প্রমাণ না থাকলেও প্রতিবেদন সংরক্ষণ করা হয় কিন্তু যাচাই স্তর 'অযাচাইকৃত' থাকে।",
    points: [
      "রসিদ ও সরকারি ফি-এর বিপরীতে দাবিকৃত অতিরিক্ত টাকার অনুপাত মিলিয়ে দেখা হয়",
      "একাধিক নাগরিকের প্রতিবেদনে একই দফতরের একই ব্যক্তির উল্লেখ আছে কিনা পর্যবেক্ষণ করা হয়",
    ],
  },
  {
    step: "০৩",
    title: "নিরপেক্ষ ও শান্ত ভাষায় রূপান্তর (Neutral Tone)",
    subtitle: "আইনি ও তথ্যভিত্তিক মানদণ্ড",
    icon: FileCheck2,
    tag: "ভাষাগত মানদণ্ড",
    description:
      "আবেগী ভাষা, ব্যক্তিগত আক্রোশ, গালিগালাজ বা অপবাদমূলক বাক্য পরিহার করে প্রতিবেদনটিকে একটি পেশাদার নাগরিক নথির কাঠামো প্রদান করা হয়। কাউকে একতরফাভাবে দোষী সাব্যস্ত না করে শুধু ঘটনার বিবরণ লিপিবদ্ধ থাকে।",
    points: [
      "সংক্ষিপ্ত ও স্পষ্ট শিরোনাম নির্ধারণ করা হয় (যেমন: 'নামজারি আবেদন বাবদ অতিরিক্ত ফি দাবি')",
      "ঘটনার সুনির্দিষ্ট তারিখ, ইউনিয়ন ও দাবিকৃত টাকার পরিমাণ অপরিবর্তিত থাকে",
    ],
  },
  {
    step: "০৪",
    title: "প্রকাশ, প্রাতিষ্ঠানিক জবাব ও আপিল (Open Ledger)",
    subtitle: "দ্বিপাক্ষিক জবাবদিহিতা",
    icon: MessageSquareText,
    tag: "জনস্বার্থে উন্মুক্ত",
    description:
      "রিপোর্ট প্রকাশের পর সংশ্লিষ্ট সরকারি দফতর বা ব্যক্তি তাদের দাপ্তরিক জবাব বা ব্যাখ্যা প্রদান করতে পারেন। কোনো তথ্য ভুল বা বিভ্রান্তিকর প্রমাণিত হলে তা তাৎক্ষণিক সংশোধন বা আর্কাইভ করা হয়।",
    points: [
      "প্রতিটি নথির সঙ্গে টাইমস্ট্যাম্প ও যাচাইকরণের স্তর স্পষ্ট চিহ্নিত থাকে",
      "যে কোনো ভুক্তভোগী বা কর্তৃপক্ষ ২৪/৭ আপিল বা সংশোধনের আবেদন করতে পারেন",
    ],
  },
];

export function ReviewLedger() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b-2 border-border pb-4">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
            PUBLICATION PIPELINE
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground font-heading mt-1">
            প্রতিটি নাগরিক নথির ৪-স্তরের পর্যালোচনা
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-foreground  border-2 border-border bg-card px-3 py-1.5">
          <Users className="size-3.5 text-primary" />
          <span>মানুষ দ্বারা পর্যালোচিত; এআই শুধু ফিল্টারিং সহায়ক</span>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {reviewSteps.map((step) => {
          const Icon = step.icon;
          return (
            <article
              key={step.step}
              className="flex flex-col justify-between border-2 border-border bg-card p-5 sm:p-6 transition-all hover:border-foreground hover:shadow-[3px_3px_0_var(--foreground)] hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between gap-3 border-b-2 border-border pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className=" text-2xl font-extrabold text-primary">
                      {step.step}
                    </span>
                    <span className="border border-primary/40 bg-primary/10 px-2 py-0.5  text-[10px] font-bold text-primary">
                      {step.tag}
                    </span>
                  </div>
                  <span className="grid size-9 place-items-center border-2 border-border bg-background text-primary">
                    <Icon className="size-4.5" />
                  </span>
                </div>

                <h3 className="text-base font-bold mt-3 font-heading text-foreground leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs font-bold text-primary  mt-0.5">
                  {step.subtitle}
                </p>

                <p className="text-xs leading-relaxed text-muted-foreground mt-2">
                  {step.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/80">
                <div className="border border-border bg-background p-3 space-y-1.5">
                  {step.points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-foreground/80 leading-relaxed">
                      <span className="text-primary font-bold">·</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
