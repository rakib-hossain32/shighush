import {
  AlertTriangle,
  Clock,
  FileSearch,
  MessageSquareWarning,
  Shield,
  ShieldCheck,
  Zap,
} from "lucide-react";

const PROCESS_STEPS = [
  {
    icon: FileSearch,
    step: "১",
    title: "নথির Case ID প্রদান করুন",
    description:
      "যে প্রকাশিত নথি নিয়ে আপত্তি, তার শনাক্তকারী ID প্রদান করুন। রিপোর্টের শীর্ষে বা URL-এ এটি পাবেন।",
  },
  {
    icon: MessageSquareWarning,
    step: "২",
    title: "কারণ ও বিস্তারিত উল্লেখ করুন",
    description:
      "ভুল তথ্য, গোপনীয়তার ঝুঁকি বা প্রতিষ্ঠানের আনুষ্ঠানিক জবাব—কারণটি স্পষ্ট ও নিরপেক্ষভাবে বর্ণনা করুন।",
  },
  {
    icon: ShieldCheck,
    step: "৩",
    title: "গোপন পর্যালোচনা হবে",
    description:
      "মডারেশন টিম নথি ও আবেদন পর্যালোচনা করে ব্যবস্থা নেবে। আপিলটি কখনো প্রকাশ্যে দেখানো হবে না।",
  },
];

const SERVICE_GUARANTEES = [
  {
    icon: Zap,
    label: "জরুরি পর্যালোচনা",
    value: "২৪-৪৮ ঘণ্টা",
    note: "গোপনীয়তা ঝুঁকির ক্ষেত্রে",
    variant: "priority" as const,
  },
  {
    icon: Clock,
    label: "সাধারণ আবেদন",
    value: "৫-৭ দিন",
    note: "মডারেশন সক্ষমতা অনুযায়ী",
    variant: "default" as const,
  },
  {
    icon: Shield,
    label: "সর্বোচ্চ সুরক্ষা",
    value: "১০০%",
    note: "আপিল কখনো প্রকাশ্য নয়",
    variant: "secure" as const,
  },
];

const GUIDELINES = [
  {
    icon: ShieldCheck,
    title: "সত্য ও নিরপেক্ষ থাকুন",
    text: "শুধুমাত্র যাচাইযোগ্য তথ্য দিন। ব্যক্তিগত আক্রমণ এড়িয়ে চলুন।",
  },
  {
    icon: AlertTriangle,
    title: "ব্যক্তিগত তথ্য দেবেন না",
    text: "আপনার বা অন্যের ফোন নম্বর, NID, বা পূর্ণ নাম দেবেন না।",
  },
  {
    icon: FileSearch,
    title: "প্রমাণ যুক্ত করুন",
    text: "সম্ভব হলে দাপ্তরিক নথি বা লিংক উল্লেখ করুন।",
  },
];

export function AppealGuidanceRedesigned() {
  return (
    <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
      {/* How it Works */}
      <div className="border-2 border-border bg-card shadow-[3px_3px_0_var(--foreground)]">
        <div className="border-b-2 border-border bg-muted/30 p-5">
          <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-primary">
            HOW IT WORKS
          </span>
          <h3 className="text-base sm:text-lg font-black font-heading mt-1 text-foreground">
            আপিল প্রক্রিয়া কীভাবে কাজ করে
          </h3>
        </div>
        <div className="p-5 space-y-5">
          {PROCESS_STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center border-2 border-border bg-background text-xs font-bold text-foreground shadow-[2px_2px_0_rgba(0,0,0,0.1)]">
                  {item.step}
                </span>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-primary shrink-0" />
                    <span className="text-sm font-bold text-foreground">{item.title}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Guarantees */}
      <div className="border-2 border-border bg-card shadow-[3px_3px_0_var(--foreground)]">
        <div className="border-b-2 border-border bg-muted/30 p-5">
          <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-primary">
            SERVICE PLEDGE
          </span>
          <h3 className="text-sm sm:text-base font-black font-heading mt-1 text-foreground">
            পরিষেবা প্রতিশ্রুতি
          </h3>
        </div>
        <div className="p-5 space-y-3">
          {SERVICE_GUARANTEES.map((g) => {
            const Icon = g.icon;
            const bgColor =
              g.variant === "priority"
                ? "bg-primary/10 border-primary/30"
                : g.variant === "secure"
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-muted/50 border-border";

            return (
              <div
                key={g.label}
                className={`flex items-center justify-between gap-3 border p-3 ${bgColor}`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="size-4 text-primary shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-foreground leading-tight">
                      {g.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{g.note}</p>
                  </div>
                </div>
                <span className="border-2 border-foreground bg-background px-2.5 py-1 text-xs font-bold text-foreground tabular-nums shrink-0 shadow-[2px_2px_0_rgba(0,0,0,0.1)]">
                  {g.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Guidelines */}
      <div className="border-2 border-border bg-card shadow-[3px_3px_0_var(--foreground)]">
        <div className="border-b-2 border-border bg-muted/30 p-5">
          <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-primary">
            GUIDELINES
          </span>
          <h3 className="text-sm sm:text-base font-black font-heading mt-1 text-foreground">
            আবেদন করার নির্দেশিকা
          </h3>
        </div>
        <div className="p-5 space-y-4">
          {GUIDELINES.map((guideline) => {
            const Icon = guideline.icon;
            return (
              <div key={guideline.title} className="flex items-start gap-3">
                <div className="grid size-8 shrink-0 place-items-center border border-border bg-primary/10">
                  <Icon className="size-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">{guideline.title}</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                    {guideline.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="border-2 border-primary/50 bg-primary/5 p-4">
        <div className="flex items-start gap-2.5">
          <Shield className="size-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-primary">সম্পূর্ণ গোপনীয় প্রক্রিয়া</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
              আপনার আপিল শুধুমাত্র মডারেশন টিম দেখবে। এটি কখনো ওয়েবসাইটে প্রকাশ করা হবে না এবং
              আপনার পরিচয় সুরক্ষিত রাখা হবে।
            </p>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="border border-border bg-muted/30 p-4">
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
          দ্রুত টিপস
        </h4>
        <ul className="space-y-2 text-[11px] text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">•</span>
            <span>রিপোর্টের URL বা শিরোনাম থেকে Case ID খুঁজে নিন</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">•</span>
            <span>সংক্ষিপ্ত ও স্পষ্ট ভাষায় লিখুন</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">•</span>
            <span>প্রমাণ থাকলে লিংক বা রেফারেন্স যুক্ত করুন</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">•</span>
            <span>ব্যক্তিগত আক্রমণ এড়িয়ে তথ্যে মনোনিবেশ করুন</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
