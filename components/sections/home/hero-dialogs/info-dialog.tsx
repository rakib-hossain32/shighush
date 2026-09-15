"use client";

import React from "react";
import {
  Shield,
  FileText,
  Paperclip,
  CheckCircle,
  FolderOpen,
  ArrowLeft,
  Check,
  Lock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Step & Info data                                                    */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    title: "অভিযোগ",
    heading: "আপনার অভিজ্ঞতা, আপনার ভাষায়।",
    icon: "file",
    text: "কী ঘটেছে, কোথায় ঘটেছে এবং কোন সেবা পেতে সমস্যা হয়েছে তা স্পষ্টভাবে লিখুন। পরিচয় প্রকাশ বাধ্যতামূলক নয়; ঘটনার সুনির্দিষ্ট ও প্রাসঙ্গিক তথ্যই সবচেয়ে গুরুত্বপূর্ণ।",
    note: "নাগরিকের নিরাপত্তা ও গোপনীয়তা রক্ষা শিঘুষ প্ল্যাটফর্মের সর্বোচ্চ অগ্রাধিকার।",
  },
  {
    title: "মডারেশন",
    heading: "প্রকাশের আগে, দায়িত্বশীল পর্যালোচনা।",
    icon: "shield",
    text: "নাগরিকের নিরাপত্তা সুরক্ষিত রাখতে মডারেশন দল সংবেদনশীল ব্যক্তিগত তথ্য (PII) অপসারণ ও পরিমার্জন (Redact) করে থাকে। নিরপেক্ষ যাচাই শেষে প্রতিবেদনটি জনস্বার্থে প্রকাশের জন্য প্রস্তুত হয়।",
    note: "দায়িত্বপ্রাপ্ত মডারেটর দল প্রতিটি নথি নীতিমালার আলোকে পর্যালোচনা করেন।",
  },
  {
    title: "প্রমাণ",
    heading: "তথ্যের পাশে, প্রাসঙ্গিক প্রমাণ।",
    icon: "clip",
    text: "অভিযোগের সপক্ষে রসিদ, সংশ্লিষ্ট চিঠি, ছবি, অডিও বা ভিডিও সংযুক্ত করুন। প্রকাশের সময় ব্যক্তিগত পরিচয় ও সংবেদনশীল অংশ সুরক্ষিতভাবে আড়াল করা হয়।",
    note: "সকল ফাইল এনক্রিপ্ট অবস্থায় সুরক্ষিত ক্লাউড স্টোরেজে সংরক্ষিত থাকে।",
  },
  {
    title: "যাচাই",
    heading: "যাচাইয়ের স্তর, সবার কাছে স্পষ্ট।",
    icon: "check",
    text: "প্রতিটি নথির জন্য সুনির্দিষ্ট যাচাই স্তর নির্ধারিত থাকে: অযাচাইকৃত, প্রমাণ সংযুক্ত, একাধিক সূত্রে সমর্থিত বা সরকারি নথিভুক্ত। কোন স্তর পর্যন্ত পরীক্ষা করা হয়েছে, তা নথিতে স্পষ্টভাবে দৃশ্যমান থাকে।",
    note: "যাচাইকরণ প্রক্রিয়া অভিযোগের প্রামাণিকতা ও নির্ভরতা বৃদ্ধি করে।",
  },
  {
    title: "প্রকাশ",
    heading: "পরিচয় নয়, প্রকাশ্যে আসুক তথ্য।",
    icon: "folder",
    text: "দায়িত্বশীল পর্যালোচনা শেষে নাগরিক প্রতিবেদন জনসাধারণের জন্য উন্মুক্ত হয়। প্রদানকৃত অনন্য কেস ট্র্যাকিং কোড দিয়ে অভিযোগকারী যেকোনো সময় নথির অগ্রগতি দেখতে পারেন।",
    note: "প্রকাশিত নথি শিবচরে প্রাতিষ্ঠানিক স্বচ্ছতা ও নাগরিক জবাবদিহিতা নিশ্চিত করতে ভূমিকা রাখে।",
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
      "শিঘুষ প্ল্যাটফর্মে নাগরিকের ব্যক্তিগত পরিচয় সম্পূর্ণ সুরক্ষিত। অভিযোগ জমা দেওয়ার ক্ষেত্রে আপনার নাম, মোবাইল নম্বর বা ইমেইল প্রদান বাধ্যতামূলক নয়।",
      "সংযুক্ত প্রমাণের ক্ষেত্রে মডারেশন দল সব ধরনের সংবেদনশীল তথ্য (যেমন: জাতীয় পরিচয়পত্র নম্বর, মোবাইল নম্বর, ব্যক্তিগত স্বাক্ষর) সুরক্ষিতভাবে পরিমার্জন (Redact) করে থাকে।",
      "রিপোর্ট জমা দেওয়ার পর নাগরিককে একটি গোপন এককালীন ট্র্যাকিং টোকেন দেওয়া হয়, যা দিয়ে অভিযোগকারী ছাড়া আর কেউ অভ্যন্তরীণ বার্তা আদান-প্রদান দেখতে পারে না।",
    ],
  },
  about: {
    kicker: "SHIGHUSH / RESPONSIBLE RECORDS",
    title: "স্বচ্ছতার পক্ষে। নাগরিকের পাশে।",
    paragraphs: [
      "শিঘুষ শিবচরের জনসেবা, অনিয়ম ও নাগরিক অভিজ্ঞতার একটি স্বাধীন, দায়িত্বশীল ও অনুসন্ধানযোগ্য নাগরিক রেকর্ড প্ল্যাটফর্ম।",
      "ঘুষ, হয়রানি, সেবা-বঞ্চনা বা ক্ষমতার অপব্যবহারের ঘটনাগুলোকে জনস্বার্থে নথিবদ্ধ করা এবং সংশ্লিষ্ট প্রতিষ্ঠানের দায়িত্বশীলতা নিশ্চিত করাই এর মূল লক্ষ্য।",
      "প্রকাশিত সকল প্রতিবেদন নাগরিকের অভিজ্ঞতার সুনির্দিষ্ট রেকর্ড হিসেবে সংরক্ষিত থাকে, যা স্থানীয় সেবা ব্যবস্থার টেকসই সংস্কারে সরাসরি সহায়তা করে।",
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Subcomponent: Step/Context Icon (Strictly rounded-none)            */
/* ------------------------------------------------------------------ */
function InfoContextIcon({ name }: { name: string }) {
  switch (name) {
    case "file":
      return <FileText className="size-5 text-primary" />;
    case "clip":
      return <Paperclip className="size-5 text-primary" />;
    case "check":
      return <CheckCircle className="size-5 text-primary" />;
    case "folder":
      return <FolderOpen className="size-5 text-primary" />;
    case "shield":
    default:
      return <Shield className="size-5 text-primary" />;
  }
}

/* ------------------------------------------------------------------ */
/*  Subcomponent: Exhibit Preview Card (Strictly rounded-none)         */
/* ------------------------------------------------------------------ */
function ExhibitCard({
  recordId,
  fileName,
  kind,
}: {
  recordId: string;
  fileName: string;
  kind: string;
}) {
  return (
    <div className="rounded-none border-2 border-foreground bg-card p-5 text-center shadow-[3px_3px_0_var(--foreground)] space-y-3">
      <div className="flex items-center justify-center gap-1.5 text-[11px] font-black tracking-wider text-muted-foreground uppercase font-mono">
        <Lock className="size-3 text-primary" />
        <span>SHIGHUSH / VERIFIED EXHIBIT</span>
      </div>
      <h4 className="font-heading font-black text-base text-foreground">
        {fileName}
      </h4>
      <p className="text-xs text-muted-foreground  font-medium">
        রেফারেন্স কেস: <span className="font-black text-foreground">{recordId}</span> ({kind})
      </p>
      <div className="space-y-1.5 py-1">
        <div className="h-1 bg-border rounded-none w-full"></div>
        <div className="h-1 bg-border/60 rounded-none w-3/4 mx-auto"></div>
        <div className="h-1 bg-border rounded-none w-full"></div>
      </div>
      <p className="text-[11px] font-bold text-muted-foreground">
        ব্যক্তিগত পরিচয় ও সংবেদনশীল তথ্য সুরক্ষিতভাবে পরিমার্জিত
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Props & Main Component                                             */
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
  let kicker = "SHIGHUSH / RESPONSIBLE RECORDS";
  let title = "";
  let icon = "shield";
  let paragraphs: string[] = [];
  let note: string | null = null;
  let isExhibit = false;

  if (exhibitData) {
    isExhibit = true;
    kicker = `${exhibitData.recordId} / EXHIBIT`;
    title = exhibitData.fileName;
    icon = "file";
    paragraphs = [
      "এই ফাইলটি নাগরিক অভিযোগের সপক্ষে সংযুক্ত প্রমাণ হিসেবে নথিভুক্ত। মডারেশন দল কর্তৃক পর্যালোচিত ও ব্যক্তিগত তথ্য পরিমার্জিত।",
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
      <DialogContent className="max-h-[88vh] overflow-x-hidden overflow-y-auto rounded-none! border-2 border-foreground bg-card p-0 shadow-[6px_6px_0_var(--foreground)] sm:max-w-lg">
        {/* Modal Header */}
        <DialogHeader className="border-b-2 border-foreground bg-muted/40 px-5 py-4 text-left sm:px-6">
          <span className="inline-block rounded-none border border-foreground bg-background px-2 py-0.5  text-[10px] font-black tracking-wider text-muted-foreground uppercase shadow-[1px_1px_0_var(--foreground)] w-fit">
            {kicker}
          </span>
          <DialogTitle className="font-heading text-lg sm:text-xl font-black text-foreground leading-snug mt-1.5">
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Modal Body */}
        <div className="space-y-4 px-5 py-5 sm:px-6 text-sm">
          {isExhibit && exhibitData ? (
            <ExhibitCard
              recordId={exhibitData.recordId}
              fileName={exhibitData.fileName}
              kind={exhibitData.kind}
            />
          ) : (
            <div className="size-10 rounded-none border-2 border-foreground bg-muted/60 grid place-items-center shadow-[2px_2px_0_var(--foreground)]">
              <InfoContextIcon name={icon} />
            </div>
          )}

          {/* Content paragraphs */}
          <div className="space-y-2.5">
            {paragraphs.map((text, i) => (
              <p key={i} className="text-xs sm:text-sm leading-relaxed text-foreground font-medium">
                {text}
              </p>
            ))}
          </div>

          {/* Note callout box (Strictly rounded-none) */}
          {note && (
            <div className="rounded-none border-2 border-foreground bg-muted/40 p-3.5 text-xs leading-relaxed text-foreground font-bold shadow-[2px_2px_0_var(--foreground)]">
              {note}
            </div>
          )}
        </div>

        {/* Modal Footer (Strictly rounded-none) */}
        <DialogFooter className="flex flex-row items-center justify-between border-t-2 border-foreground bg-muted/40 px-5 py-3.5 sm:px-6">
          {onBackToRecord && isExhibit ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToRecord}
              className="cursor-pointer rounded-none gap-1 text-xs text-foreground hover:bg-muted font-bold"
            >
              <ArrowLeft className="size-3.5" />
              <span>নথিতে ফিরুন</span>
            </Button>
          ) : (
            <div />
          )}

          <DialogClose
            render={
              <Button
                variant="default"
                size="sm"
                className="cursor-pointer rounded-none gap-1.5 font-black border-2 border-foreground shadow-[3px_3px_0_var(--foreground)] bg-primary text-primary-foreground hover:opacity-95"
              />
            }
          >
            <span>বুঝেছি</span>
            <Check className="size-3.5 stroke-[3]" />
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
