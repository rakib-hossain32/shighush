import Link from "next/link";
import { ArrowUpRight, BadgeCheck, EyeOff, FileSearch, Scale, ShieldAlert, ShieldCheck } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const requirements = [
  {
    number: "০১",
    icon: FileSearch,
    title: "নির্দিষ্ট ঘটনার সত্যতা ও প্রেক্ষাপট",
    copy: "দফতর, সময়, নির্দিষ্ট সেবা এবং ঘটনার বস্তুনিষ্ঠ বর্ণনায় পর্যাপ্ত স্বচ্ছতা ও প্রাসঙ্গিকতা থাকতে হবে। অস্পষ্ট বা উদ্দেশ্যপ্রণোদিত দাবি সরাসরি প্রত্যাখ্যাত হয়।",
    tag: "প্রাথমিক শর্ত",
  },
  {
    number: "০২",
    icon: BadgeCheck,
    title: "সংযুক্ত প্রমাণ বা নির্ভরযোগ্য উৎস",
    copy: "নাম বা পদবি পাবলিক ডেটাবেজে তালিকাভুক্ত করার আগে অকাট্য ডকুমেন্টারি প্রমাণ বা প্রকাশ্য সরকারি/আদালত নথির সঙ্গে মিল থাকা আবশ্যক।",
    tag: "যাচাই নীতি",
  },
  {
    number: "০৩",
    icon: EyeOff,
    title: "ব্যক্তিগত ক্ষতির ঝুঁকি ও গোপনীয়তা পর্যালোচনা",
    copy: "বাসার ঠিকানা, ব্যক্তিগত ফোন নম্বর, পরিবারের সদস্যদের তথ্য বা ব্যক্তিগত জীবনের সাথে জড়িত বিষয়াবলি কঠোরভাবে গোপন ও মুছে ফেলা হয়।",
    tag: "সুরক্ষা নীতি",
  },
];

export function PersonRecordPolicy() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      {/* Main Disclosure Protocol Card */}
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader className="border-b border-border/70 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
              DISCLOSURE THRESHOLD & DUE PROCESS
            </span>
            <Badge variant="secondary" className="text-xs font-semibold">
              <ShieldCheck className="size-3.5 mr-1 text-primary" />
              ব্যতিক্রমী প্রকাশ নীতি
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold font-heading mt-2">
            নাম প্রকাশ একটি সাধারণ নিয়ম নয়, এটি সতর্ক ব্যতিক্রম
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-1.5 leading-relaxed max-w-2xl">
            প্রতিবেদনে কারও নাম এলেই তা স্বয়ংক্রিয়ভাবে পাবলিক প্রোফাইলে যায় না। তথ্যের বস্তুনিষ্ঠতা, অকাট্য প্রমাণ এবং ক্ষতির ঝুঁকি—এই তিন স্তরের নিরপেক্ষ পর্যালোচনার পরই কেবল সীমিত আকারে দায়িত্বশীলতার স্বার্থে তথ্য উপস্থাপিত হয়।
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-border/60">
          {requirements.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.number}
                className="p-5 sm:p-6 grid gap-4 sm:grid-cols-[48px_minmax(0,1fr)] items-start hover:bg-muted/20 transition-colors"
              >
                <div className="grid size-12 place-items-center rounded-xl bg-secondary font-heading font-black text-primary text-xl">
                  {item.number}
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-primary" />
                      <h3 className="text-base font-bold text-foreground font-heading">
                        {item.title}
                      </h3>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-semibold">
                      {item.tag}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.copy}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Sidebar: Public Profile Rules & Appeal */}
      <aside className="space-y-5">
        <Card className="border-foreground bg-foreground text-background shadow-xs">
          <CardHeader className="pb-3">
            <EyeOff className="size-6 text-primary" />
            <span className="font-mono text-[10px] font-bold tracking-widest text-muted uppercase">
              ETHICAL CIVIC BOUNDARIES
            </span>
            <CardTitle className="text-xl font-bold font-heading text-background">
              ব্যক্তিগত আক্রমণ নয়, প্রশাসনিক স্বচ্ছতা
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs leading-relaxed text-background/80">
            এই প্ল্যাটফর্মে কখনোই ব্যক্তির বাসস্থান, ব্যক্তিগত ফোন নম্বর, জাতীয় পরিচয়পত্র (NID), ব্যাংক হিসাব, পরিবার বা সামাজিক মর্যাদাহানিকর অশালীন তথ্য সংরক্ষিত বা প্রকাশিত হবে না।
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-4 text-primary" />
              <CardTitle className="text-sm font-bold font-heading">
                ভুল সংশোধন বা প্রত্যাহারের অধিকার
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-muted-foreground leading-relaxed">
            <p>
              কোনো তথ্যে তথ্যগত ভুল থাকলে বা সংশ্লিষ্ট কর্মকর্তা/ব্যক্তির দাপ্তরিক প্রতিক্রিয়া প্রদানের প্রয়োজন হলে দ্রুততম সময়ে আপিল বা সংশোধনী অনুরোধ দাখিল করতে পারেন।
            </p>
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" size="sm">
              <Link href="/appeal">
                সংশোধনী বা আপিল অনুরোধ
                <ArrowUpRight className="size-3.5 ml-1.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
