"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

/* ------------------------------------------------------------------ */
/*  Step & Info data                                                    */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    title: "অভিযোগ",
    heading: "আপনার অভিজ্ঞতা, আপনার ভাষায়।",
    icon: "file",
    text: "কী ঘটেছে, কোথায় ঘটেছে এবং কোন সেবা পেতে সমস্যা হয়েছে তা লিখুন। নাম, ফোন বা ইমেইল দেওয়া প্রয়োজন নেই। ঘটনাসংশ্লিষ্ট তথ্যই সবচেয়ে গুরুত্বপূর্ণ।",
    note: "এই সংস্করণে ফর্ম পূরণ করলে শুধু আপনার বর্তমান ট্যাবে একটি নমুনা নথি তৈরি হয়।",
  },
  {
    title: "মডারেশন",
    heading: "প্রকাশের আগে, দায়িত্বশীল পর্যালোচনা।",
    icon: "shield",
    text: "প্রস্তাবিত মডারেশন ধাপে সংবেদনশীল ব্যক্তিগত তথ্য, পুনরাবৃত্তি এবং ক্ষতিকর বিষয়বস্তু পরীক্ষা করা হবে। রিপোর্টটি এই পর্যায়ে গ্রহণ করা হলেও অভিযোগ সত্য বলে ঘোষণা করা হয় না।",
    note: "এখানে কোনো মডারেশন দল বা স্বয়ংক্রিয় যাচাই যুক্ত নেই। প্রদর্শিত অবস্থাগুলো নমুনা।",
  },
  {
    title: "প্রমাণ",
    heading: "তথ্যের পাশে, প্রাসঙ্গিক প্রমাণ।",
    icon: "clip",
    text: "রসিদ, নথি বা প্রাসঙ্গিক ছবি সংযুক্ত করুন। ব্যক্তিগত পরিচয় বা অন্যের সংবেদনশীল তথ্য আছে কি না দেখে নিন। এই ডেমোতে প্রতিটি ফাইল সর্বোচ্চ ১০ MB এবং মোট তিনটি ফাইল যুক্ত করা যায়।",
    note: "আপনার ফাইল কোনো সার্ভারে আপলোড হয় না। মূল ফাইলের ব্যাকআপ নিজের কাছে রাখুন।",
  },
  {
    title: "যাচাই",
    heading: "যাচাইয়ের স্তর, সবার কাছে স্পষ্ট।",
    icon: "check",
    text: "প্রস্তাবিত তিন স্তর হলো: তথ্যের পূর্ণতা দেখা, সংযুক্ত প্রমাণ পর্যালোচনা এবং স্বাধীন সূত্রের সঙ্গে মিলিয়ে দেখা। কোন স্তর পর্যন্ত পরীক্ষা করা হয়েছে, নথিতে তা স্পষ্ট থাকবে।",
    note: "বোর্ডের VERIFIED ও ০৩/০৩ চিহ্ন কেবল নকশার কাল্পনিক উদাহরণ। এটি বাস্তব যাচাই, দোষের প্রমাণ বা আইনি সিদ্ধান্ত নয়।",
  },
  {
    title: "প্রকাশ",
    heading: "পরিচয় নয়, প্রকাশ্যে আসুক তথ্য।",
    icon: "folder",
    text: "পর্যালোচনা শেষে প্রকাশযোগ্য তথ্য একটি অনুসন্ধানযোগ্য নাগরিক নথি হতে পারে। রিপোর্ট আইডি দিয়ে নথির অবস্থার পরিবর্তন অনুসরণ করা যাবে। ব্যক্তিগত পরিচয় প্রকাশের বিষয়টি আলাদাভাবে নিয়ন্ত্রিত হওয়া প্রয়োজন।",
    note: "ডেমোতে নতুন অভিযোগ বাস্তবে প্রকাশিত হয় না এবং অন্য ব্যবহারকারী দেখতে পান না।",
  },
];

const INFO_DATA: Record<
  string,
  { kicker: string; title: string; paragraphs: string[] }
> = {
  privacy: {
    kicker: "SHIGHUSH / RESPONSIBLE RECORDS",
    title: "পরিচয় নয়, তথ্যই গুরুত্বপূর্ণ।",
    paragraphs: [
      "এই ডেমোতে নাম, ফোন নম্বর বা ইমেইল নেওয়া হয় না। আপনার লেখা রিপোর্ট এবং নির্বাচিত ফাইল শুধু বর্তমান ব্রাউজার ট্যাবের মেমরিতে থাকে। কোনো রিপোর্ট বা ফাইল সার্ভারে পাঠানো হয় না। রিফ্রেশ বা ট্যাব বন্ধ করলে নতুন নথি মুছে যায়।",
      "ফাইলের ভেতর বা ছবির মেটাডেটায় ব্যক্তিগত তথ্য থাকতে পারে। এই ডেমো ফাইল থেকে মেটাডেটা মুছে দেয় না। তাই বাস্তব পরিচয়, সংবেদনশীল নথি বা অন্যের ব্যক্তিগত তথ্য ব্যবহার করবেন না।",
      "কেবল আপনার লাইট বা ডার্ক মোড পছন্দ ব্রাউজারে সংরক্ষিত থাকে। ফন্ট ও Tailwind CDN থেকে লোড হয়। এটি পূর্ণাঙ্গ নিরাপদ রিপোর্টিং ব্যবস্থা বা সম্পূর্ণ অজ্ঞাতপরিচয় থাকার নিশ্চয়তা নয়।",
    ],
  },
  about: {
    kicker: "SHIGHUSH / RESPONSIBLE RECORDS",
    title: "স্বচ্ছতার পক্ষে। নাগরিকের পাশে।",
    paragraphs: [
      "shighush একটি Bangla-first নাগরিক জবাবদিহিতা প্ল্যাটফর্মের ধারণা। ঘুষ, হয়রানি, সেবা বঞ্চনা বা ক্ষমতার অপব্যবহারের অভিজ্ঞতাকে দায়িত্বশীল, অনুসন্ধানযোগ্য নথিতে রূপ দেওয়াই এর লক্ষ্য।",
      "এই পৃষ্ঠাটি সেই ধারণার একটি ইন্টারঅ্যাকটিভ প্রোটোটাইপ। এখানে দেখানো রিপোর্ট, যাচাই চিহ্ন এবং সংযুক্ত প্রমাণ কাল্পনিক। এটি কোনো সরকারি প্রতিষ্ঠান, জরুরি সেবা বা বাস্তব অভিযোগ গ্রহণকারী সংস্থা নয়।",
      "বাস্তব ব্যবহারের আগে সুরক্ষিত সার্ভার, প্রমাণ সংরক্ষণ, সম্মতি ও তথ্য সুরক্ষা নীতি এবং দায়িত্বশীল মডারেশন ব্যবস্থা যুক্ত করা প্রয়োজন।",
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Icon helper (inline SVG use from global sprite)                    */
/* ------------------------------------------------------------------ */
function SpriteIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <svg className={`icon ${className}`.trim()} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export interface ExhibitData {
  recordId: string;
  fileName: string;
  kind: string;
}

interface InfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** "privacy" | "about" for info pages, or a step index 0-4 */
  infoKey: string | number | null;
  exhibitData?: ExhibitData | null;
  onBackToRecord?: () => void;
}

export function InfoDialog({
  open,
  onOpenChange,
  infoKey,
  exhibitData,
  onBackToRecord,
}: InfoDialogProps) {
  // Determine content based on infoKey or exhibitData
  let kicker = "SHIGHUSH / RESPONSIBLE RECORDS";
  let title = "";
  let icon = "shield";
  let paragraphs: string[] = [];
  let note: string | null = null;
  let isExhibit = false;

  if (exhibitData) {
    isExhibit = true;
    kicker = `${exhibitData.recordId} / SAMPLE EXHIBIT`;
    title = exhibitData.fileName;
    icon = "file";
    paragraphs = [
      "এটি সংযুক্ত প্রমাণের একটি কাল্পনিক দৃশ্য। কোনো বাস্তব আবেদনপত্র বা রসিদ নয়। আপনার নিজের ডেমো নথিতে ফাইল যুক্ত করলে বর্তমান ট্যাব থেকে সেই ফাইল ডাউনলোড করতে পারবেন।",
    ];
  } else if (typeof infoKey === "number") {
    const step = STEPS[infoKey];
    if (step) {
      kicker = `SHIGHUSH / STEP 0${infoKey + 1} OF 05`;
      title = step.heading;
      icon = step.icon;
      paragraphs = [step.text];
      note = step.note;
    }
  } else if (typeof infoKey === "string" && INFO_DATA[infoKey]) {
    const info = INFO_DATA[infoKey];
    kicker = info.kicker;
    title = info.title;
    icon = infoKey === "privacy" ? "shield" : "file";
    paragraphs = info.paragraphs;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-135">
        <DialogHeader className="space-y-1.5 pb-1">
          <Badge
            variant="outline"
            className="w-fit font-mono text-[10px] tracking-wider text-muted-foreground uppercase"
          >
            {kicker}
          </Badge>
          <DialogTitle className="text-xl font-semibold leading-tight">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          {isExhibit && exhibitData ? (
            <Card className="border-dashed bg-muted/20 text-center">
              <CardContent className="space-y-2 p-4">
                <span className="mono text-[10px] tracking-wider text-muted-foreground uppercase">
                  SHIGHUSH / SAMPLE ONLY
                </span>
                <h4 className="font-semibold text-sm">নমুনা {exhibitData.kind}</h4>
                <p className="text-xs text-muted-foreground">রেফারেন্স: {exhibitData.recordId}</p>
                <div className="h-1 bg-border/60 rounded w-full my-2"></div>
                <div className="h-1 bg-border/40 rounded w-2/3 mx-auto"></div>
                <div className="h-1 bg-border/60 rounded w-full my-2"></div>
                <p className="text-[11px] text-muted-foreground/80">পরিচয় ও সংবেদনশীল তথ্য গোপন</p>
              </CardContent>
            </Card>
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-muted/50">
              <SpriteIcon name={icon} className="h-6 w-6" />
            </div>
          )}

          {/* Content paragraphs */}
          {paragraphs.map((text, i) => (
            <p key={i} className="text-sm leading-7 text-muted-foreground">
              {text}
            </p>
          ))}

          {/* Note (for steps) with shadcn Card */}
          {note && (
            <Card className="border-border bg-muted/30">
              <CardContent className="p-3 text-xs leading-6 text-muted-foreground">
                {note}
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between border-t border-border pt-4">
          {onBackToRecord && isExhibit ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToRecord}
              className="-ml-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground"
            >
              ← নথিতে ফিরে যান
            </Button>
          ) : (
            <div />
          )}
          <DialogClose
            render={
              <Button
                variant="default"
                size="sm"
                className="gap-2 cursor-pointer"
              />
            }
          >
            বুঝেছি
            <SpriteIcon name="check" className="h-4 w-4" />
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
