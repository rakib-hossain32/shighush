import { AlertTriangleIcon, ShieldCheckIcon } from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";
import { detectPii, segmentByPii } from "@/lib/domain/pii";
import { formatBnNumber } from "@/lib/format";

/**
 * The submitted narrative with every detected identifier highlighted in place.
 *
 * This is the single most useful thing on the review screen. §12.12 asks for the
 * moderator to be *warned* about phone numbers, NIDs and bank details before publishing —
 * not for them to be stripped automatically, because "চূড়ান্ত সিদ্ধান্ত মানুষের". So the
 * text is shown intact and the risky spans are marked, letting a human decide what to
 * redact and what is load-bearing to the account.
 *
 * Rendering is segment-based rather than `dangerouslySetInnerHTML`: the narrative is
 * untrusted user input, and building HTML strings from it would be an XSS hole on the one
 * screen where staff read attacker-controlled text.
 */
export function PiiHighlightedText({ text }: { text: string }) {
  const findings = detectPii(text);
  const segments = segmentByPii(text, findings);
  const highSeverity = findings.filter((finding) => finding.severity === "high");

  return (
    <div className="grid gap-4">
      {findings.length > 0 ? (
        <div className="flex flex-col gap-2 border-l-4 border-destructive bg-destructive/5 p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-destructive">
            <AlertTriangleIcon className="size-4 shrink-0" />
            {formatBnNumber(findings.length)}টি সম্ভাব্য শনাক্তকারী তথ্য পাওয়া গেছে
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            প্রকাশের আগে নিচের চিহ্নিত অংশগুলো সরান বা ঢাকুন। স্বয়ংক্রিয়ভাবে কিছু মুছে
            ফেলা হয় না — সিদ্ধান্ত আপনার।
          </p>
          <ul className="flex flex-wrap gap-1.5 pt-1">
            {[...new Set(findings.map((finding) => finding.label))].map((label) => (
              <li key={label}>
                <StatusBadge size="sm" tone="danger">
                  {label}
                </StatusBadge>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheckIcon className="size-4 text-secondary" />
          স্বয়ংক্রিয় স্ক্যানে কোনো শনাক্তকারী তথ্য পাওয়া যায়নি — তবু নিজে পড়ে দেখুন।
        </p>
      )}

      <div className="whitespace-pre-wrap border border-border bg-background p-4 text-sm leading-8">
        {segments.map((segment, index) =>
          segment.finding ? (
            <mark
              className={
                segment.finding.severity === "high"
                  ? "rounded-sm bg-destructive/20 px-1 font-bold text-destructive underline decoration-destructive decoration-wavy underline-offset-4"
                  : "rounded-sm bg-[var(--chart-5)]/40 px-1 font-medium text-foreground"
              }
              key={`segment-${index}`}
              title={segment.finding.label}
            >
              {segment.text}
            </mark>
          ) : (
            <span key={`segment-${index}`}>{segment.text}</span>
          ),
        )}
      </div>

      {highSeverity.length > 0 && (
        <p className="text-xs leading-5 text-muted-foreground">
          চিহ্নিত অংশ থাকা অবস্থায়ও প্রকাশ করা যায় — কিন্তু তার আগে নিশ্চিত করুন যে ওই
          তথ্য প্রকাশযোগ্য এবং redaction note-এ কারণ লেখা আছে।
        </p>
      )}
    </div>
  );
}
