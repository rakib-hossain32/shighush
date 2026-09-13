import { Clock, FileText, MessageSquareWarning, Shield, ShieldCheck, Zap } from "lucide-react";

const steps = [
  {
    icon: FileText,
    step: "১",
    title: "নথির Case ID দিন",
    description:
      "যে প্রকাশিত নথি নিয়ে আপত্তি, তার শনাক্তকারী ID প্রদান করুন। রিপোর্টের শীর্ষে বা ব্রাউজার URL-এ এটি থাকে।",
  },
  {
    icon: MessageSquareWarning,
    step: "২",
    title: "কারণ ও বিস্তারিত লিখুন",
    description:
      "ভুল তথ্য, গোপনীয়তার ঝুঁকি বা প্রতিষ্ঠানের আনুষ্ঠানিক জবাব—কারণটি স্পষ্ট ও নিরপেক্ষভাবে উল্লেখ করুন।",
  },
  {
    icon: ShieldCheck,
    step: "৩",
    title: "গোপন পর্যালোচনা সম্পন্ন হবে",
    description:
      "মডারেশন দল নথি ও আবেদন পর্যালোচনা করে ৪৮ ঘণ্টার মধ্যে ব্যবস্থা নেবে। আপিলটি পাবলিক থাকে না।",
  },
];

const serviceGaurantees = [
  { icon: Zap, label: "জরুরি পর্যালোচনা", value: "< ৪৮ ঘণ্টা", note: "Privacy Risk কেসে" },
  { icon: Clock, label: "সাধারণ আবেদন", value: "৫–৭ দিন", note: "মডারেশন সক্ষমতা অনুযায়ী" },
  { icon: Shield, label: "সর্বোচ্চ সুরক্ষা", value: "১০০%", note: "আপিল কখনো প্রকাশ্য নয়" },
];

export function AppealGuidance() {
  return (
    <aside className="space-y-5">
      {/* How it works */}
      <div className="border-2 border-border bg-card p-5 sm:p-6 shadow-[3px_3px_0_var(--foreground)]">
        <div className="border-b-2 border-border pb-3">
          <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-primary">
            HOW IT WORKS
          </span>
          <h3 className="text-base font-bold font-heading mt-1 text-foreground">
            আপিল প্রক্রিয়া কীভাবে কাজ করে
          </h3>
        </div>
        <div className="pt-4 space-y-5">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="flex items-start gap-3">
                <span className="grid size-8 shrink-0 place-items-center border-2 border-border bg-background text-xs  font-bold text-foreground">
                  {item.step}
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Icon className="size-3.5 text-primary" />
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
      <div className="border-2 border-border bg-card p-5 shadow-[3px_3px_0_var(--foreground)]">
        <div className="border-b-2 border-border pb-3">
          <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-primary">
            SERVICE PLEDGE
          </span>
          <h3 className="text-sm font-bold font-heading mt-1 text-foreground">
            পরিষেবা প্রতিশ্রুতি
          </h3>
        </div>
        <div className="pt-4 space-y-3">
          {serviceGaurantees.map((g) => {
            const Icon = g.icon;
            return (
              <div key={g.label} className="flex items-center justify-between gap-2 border-b border-border/60 pb-2.5 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <Icon className="size-3.5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">{g.label}</p>
                    <p className="text-[11px] text-muted-foreground">{g.note}</p>
                  </div>
                </div>
                <span className="border border-border bg-background px-2 py-0.5  text-xs font-bold text-foreground tabular-nums shrink-0">
                  {g.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
