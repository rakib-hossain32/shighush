import { FileText, ShieldAlert } from "lucide-react";

import type { PublicReport } from "@/services/_shared/types";

export function ReportDetailContent({ report }: { report: PublicReport }) {
  return (
    <article className="border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-2 text-primary">
        <FileText className="size-5" />
        <p className="mono text-[11px] font-bold tracking-[.15em]">PUBLIC-SAFE NARRATIVE</p>
      </div>

      <h2 className="display mt-7 text-3xl font-bold">ঘটনার বর্ণনা</h2>

      <p className="mt-5 max-w-3xl leading-8 text-muted-foreground">{report.summary}</p>

      {/* The redacted narrative, when the moderator has written one. Paragraphs are
          preserved so a reporter's structure survives review. */}
      {report.narrative
        ?.split(/\n{2,}/)
        .filter((block) => block.trim().length > 0)
        .map((block, index) => (
          <p
            className="mt-5 max-w-3xl leading-8 text-muted-foreground"
            key={`narrative-${index}`}
          >
            {block}
          </p>
        ))}

      <p className="mt-5 max-w-3xl leading-8 text-muted-foreground">
        প্রকাশের আগে নথি থেকে ব্যক্তিগত পরিচয়, যোগাযোগ তথ্য এবং সংবেদনশীল অংশ বাদ দেওয়া
        হয়েছে। এই প্রতিবেদনটি নাগরিকের অভিজ্ঞতার রেকর্ড; এটি কোনো অপরাধের চূড়ান্ত প্রমাণ
        নয়।
      </p>

      <div className="mt-8 flex gap-3 border-l-4 border-secondary bg-muted p-4 text-sm leading-6">
        <ShieldAlert className="mt-0.5 size-5 shrink-0 text-primary" />
        <p>
          নথিতে উল্লিখিত তথ্য নিয়ে আপত্তি, privacy concern বা সংশোধনী থাকলে আপিল করা যাবে।
        </p>
      </div>
    </article>
  );
}
