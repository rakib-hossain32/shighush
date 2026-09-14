import { History, MessageSquare, ShieldCheck, User } from "lucide-react";

import { StatusDot } from "@/components/ui/status-badge";
import { REPORT_STATUS_META } from "@/lib/domain/enums";
import { formatBnDateTime, formatBnNumber } from "@/lib/format";
import type { ModerationReport } from "@/services/_shared/types";

export function ReportNotesTimeline({ report }: { report: ModerationReport }) {
  const notes = report.moderatorNotes ?? [];
  const timeline = report.timeline ?? [];

  return (
    <div className="border-2 border-foreground bg-card shadow-[3px_3px_0_var(--foreground)]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-foreground bg-secondary/40 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="grid size-8 place-items-center border border-foreground bg-primary text-foreground">
            <History className="size-4" />
          </div>
          <div>
            <h2 className="font-heading text-sm font-bold text-foreground sm:text-base">
              মডারেশন নোট ও সময়রেখা (Audit & Notes)
            </h2>
            <p className="text-xs text-muted-foreground">
              অভ্যন্তরীণ টিম নোট এবং নথির অগ্রগতি ইতিহাস
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-2">
        {/* Left: Moderator Notes */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <MessageSquare className="size-4 text-primary" />
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
              অভ্যন্তরীণ মডারেটর নোট ({formatBnNumber(notes.length)})
            </h3>
          </div>

          {notes.length > 0 ? (
            <ul className="space-y-3">
              {notes.map((note) => (
                <li
                  className="border-l-3 border-primary bg-muted/50 p-3.5 text-xs"
                  key={note.id}
                >
                  <p className="leading-relaxed text-foreground whitespace-pre-wrap">
                    {note.body}
                  </p>
                  <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                      <User className="size-3 text-primary" />
                      {note.author}
                    </span>
                    <span>{formatBnDateTime(note.at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="border border-dashed border-border p-4 text-xs italic text-muted-foreground">
              এখনও কোনো অভ্যন্তরীণ মডারেটর নোট যোগ করা হয়নি। সিদ্ধান্ত ফর্মে নোট লিখলে
              তা এখানে সংরক্ষিত হবে।
            </p>
          )}
        </div>

        {/* Right: Timeline Audit Log */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <ShieldCheck className="size-4 text-primary" />
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
              নথির লাইফসাইকেল সময়রেখা
            </h3>
          </div>

          {timeline.length > 0 ? (
            <ol className="relative space-y-4 border-l-2 border-border pl-4">
              {timeline.map((entry) => {
                const meta = REPORT_STATUS_META[entry.status];
                return (
                  <li className="relative text-xs" key={entry.id}>
                    <div className="absolute -left-[21px] top-1">
                      <StatusDot tone={meta.tone} />
                    </div>

                    <div className="font-bold text-foreground">
                      {meta.label}
                    </div>

                    <p className="text-[11px] text-muted-foreground">
                      {formatBnDateTime(entry.at)}
                      {entry.note && (
                        <span className="block mt-0.5 text-foreground font-normal">
                          নোট: {entry.note}
                        </span>
                      )}
                    </p>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="border border-dashed border-border p-4 text-xs italic text-muted-foreground">
              কোনো পূর্ববর্তী সময়রেখা রেকর্ড পাওয়া যায়নি।
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
