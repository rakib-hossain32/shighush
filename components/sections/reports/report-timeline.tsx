import {
  BadgeCheck,
  CircleDot,
  Eye,
  MessageSquareText,
  ShieldX,
} from "lucide-react";

import { StatusDot } from "@/components/ui/status-badge";
import { REPORT_STATUS_META } from "@/lib/domain/enums";
import { formatBnDate } from "@/lib/format";
import type { PublicReport, ReportStatus } from "@/services/_shared/types";

/**
 * Renders the report's actual `timeline` from the API rather than three hardcoded steps,
 * so a report that was sent back for more information, or resolved after an institution
 * replied, shows that history instead of a fictional straight line.
 */
const STATUS_ICON: Partial<Record<ReportStatus, typeof CircleDot>> = {
  submitted: CircleDot,
  under_review: Eye,
  needs_info: MessageSquareText,
  published: BadgeCheck,
  resolved: BadgeCheck,
  rejected: ShieldX,
  removed: ShieldX,
};

export function ReportTimeline({ report }: { report: PublicReport }) {
  const events = report.timeline ?? [];
  if (events.length === 0) return null;

  return (
    <section className="border-t-2 border-foreground pt-7">
      <p className="mono text-[11px] font-bold tracking-[.15em] text-primary">
        নথির সময়রেখা
      </p>

      <ol className="mt-6 grid gap-4 md:grid-cols-3">
        {events.map((event) => {
          const meta = REPORT_STATUS_META[event.status];
          const Icon = STATUS_ICON[event.status] ?? CircleDot;

          return (
            <li
              className="relative border-l-2 border-secondary pl-4"
              key={event.id}
            >
              <span className="absolute -left-2.5 top-0 grid size-5 place-items-center rounded-full bg-secondary text-secondary-foreground">
                <Icon className="size-3" />
              </span>

              <StatusDot tone={meta.tone}>
                <span className="font-bold">{meta.label}</span>
              </StatusDot>

              <p className="mt-1 text-xs text-muted-foreground">
                {formatBnDate(event.at)}
              </p>

              {event.note && (
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                  {event.note}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {/* §16.7 — an institution's reply is appended, never merged into the report body. */}
      {report.responses && report.responses.length > 0 && (
        <div className="mt-8 grid gap-4">
          <p className="mono text-[11px] font-bold tracking-[.15em] text-primary">
            প্রতিষ্ঠানের জবাব
          </p>
          {report.responses.map((response) => (
            <article
              className="border-l-4 border-foreground bg-muted p-5"
              key={response.id}
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <StatusDot tone={response.verified ? "success" : "warning"}>
                  <span className="font-bold">
                    {response.verified
                      ? "যাচাইকৃত প্রতিনিধির জবাব"
                      : "জবাব — প্রতিনিধি যাচাই হয়নি"}
                  </span>
                </StatusDot>
                <span className="text-muted-foreground">
                  {formatBnDate(response.respondedAt)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7">{response.body}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
