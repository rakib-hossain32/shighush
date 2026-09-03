/**
 * Bangladesh-specific PII detection for free-text fields.
 *
 * Serves two requirements from WEBSITE_DOCUMENTATION_BN.md:
 *   §6  — tell the reporter, while they type, what must not go in the narrative.
 *   §12.12 — flag phone / email / NID / bank patterns for the moderator before publish.
 *
 * Deliberate design decisions:
 *
 *  1. **Detect, never auto-strip.** §12.12 is explicit that auto-redaction assists but
 *     "চূড়ান্ত সিদ্ধান্ত মানুষের". Silently rewriting a citizen's account of an event is
 *     both a data-integrity problem and a trust problem. We return spans; a human acts.
 *
 *  2. **Never a hard validation error on submit.** A reporter who is blocked by a regex
 *     may simply give up, and a suppressed report is a worse outcome than a report that
 *     a moderator has to redact. Findings are warnings in the UI and a checklist in the
 *     review queue.
 *
 *  3. Patterns are intentionally a little greedy. A false positive costs a moderator two
 *     seconds; a missed NID can expose someone.
 */

export const PII_KINDS = [
  "phone",
  "email",
  "nid",
  "birth_registration",
  "tin",
  "bank_or_card",
  "url",
] as const;

export type PiiKind = (typeof PII_KINDS)[number];

export type PiiFinding = {
  kind: PiiKind;
  /** Bengali explanation shown to the reporter or moderator. */
  label: string;
  /** The offending text, for highlighting. */
  match: string;
  /** Character offsets into the scanned string. */
  start: number;
  end: number;
  /** `high` blocks publication until reviewed; `medium` is advisory. */
  severity: "high" | "medium";
};

type Rule = {
  kind: PiiKind;
  pattern: RegExp;
  label: string;
  severity: "high" | "medium";
  /** Optional extra check to cut false positives. */
  refine?: (match: string) => boolean;
};

/**
 * Order matters: the most specific pattern wins an overlap. `nid` before `bank_or_card`,
 * because a 13-digit run is far more likely an NID here than a card number.
 */
const RULES: Rule[] = [
  {
    kind: "email",
    // Deliberately loose on TLD; we want detection, not RFC compliance.
    pattern: /\b[\w.+-]+@[\w-]+\.[\w.-]{2,}\b/g,
    label: "ইমেইল ঠিকানা",
    severity: "high",
  },
  {
    kind: "phone",
    // BD mobile: optional +880 / 880 / 0 prefix, operator code 13–19, 8 more digits.
    // Separators (space, dash) tolerated because people type them.
    pattern: /(?:\+?880[\s-]?|\b0)1[3-9][\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{3}\b/g,
    label: "মোবাইল নম্বর",
    severity: "high",
  },
  {
    kind: "birth_registration",
    // 17-digit BRN. Checked before NID so it is not mislabelled.
    pattern: /\b\d{17}\b/g,
    label: "জন্মনিবন্ধন নম্বর",
    severity: "high",
  },
  {
    kind: "nid",
    // Smart NID is 10 digits; legacy is 13 or 17.
    pattern: /\b(?:\d{10}|\d{13})\b/g,
    label: "জাতীয় পরিচয়পত্র (NID) নম্বর",
    severity: "high",
  },
  {
    kind: "tin",
    pattern: /\b\d{12}\b/g,
    label: "TIN নম্বর",
    severity: "high",
  },
  {
    kind: "bank_or_card",
    // 14–19 digits, optionally in 4-digit groups.
    pattern: /\b(?:\d[\s-]?){14,19}\b/g,
    label: "ব্যাংক অ্যাকাউন্ট বা কার্ড নম্বর",
    severity: "high",
    refine: (match) => match.replace(/\D/g, "").length >= 14,
  },
  {
    kind: "url",
    pattern: /\bhttps?:\/\/\S+/gi,
    label: "লিংক — এতে পরিচয় শনাক্তকারী তথ্য থাকতে পারে",
    severity: "medium",
  },
];

/**
 * Scan free text and return every PII finding, sorted by position.
 * Overlapping matches are resolved in favour of the earlier rule (see RULES order).
 */
export function detectPii(text: string | null | undefined): PiiFinding[] {
  if (!text) return [];

  // Bengali digits are equivalent to ASCII for these patterns; normalise so a number
  // typed as "০১৭..." is caught exactly like "017...".
  const normalised = text.replace(/[০-৯]/g, (d) =>
    String("০১২৩৪৫৬৭৮৯".indexOf(d)),
  );

  const findings: PiiFinding[] = [];
  const claimed: Array<[number, number]> = [];

  const overlaps = (start: number, end: number) =>
    claimed.some(([s, e]) => start < e && end > s);

  for (const rule of RULES) {
    // Fresh RegExp per pass: module-level /g patterns carry lastIndex between calls.
    const pattern = new RegExp(rule.pattern.source, rule.pattern.flags);
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(normalised)) !== null) {
      const raw = match[0];
      const start = match.index;
      const end = start + raw.length;

      // Zero-length match would loop forever.
      if (raw.length === 0) {
        pattern.lastIndex += 1;
        continue;
      }
      if (overlaps(start, end)) continue;
      if (rule.refine && !rule.refine(raw)) continue;

      claimed.push([start, end]);
      findings.push({
        kind: rule.kind,
        label: rule.label,
        // Report the ORIGINAL substring, so highlighting lines up with what the user sees.
        match: text.slice(start, end),
        start,
        end,
        severity: rule.severity,
      });
    }
  }

  return findings.sort((a, b) => a.start - b.start);
}

/** True when text contains something that must be reviewed before publication. */
export function hasBlockingPii(text: string | null | undefined): boolean {
  return detectPii(text).some((f) => f.severity === "high");
}

/**
 * Distinct findings for a summary line, e.g.
 * "মোবাইল নম্বর, ইমেইল ঠিকানা" — used in the moderation queue badge.
 */
export function summarisePii(findings: PiiFinding[]): string[] {
  return [...new Set(findings.map((f) => f.label))];
}

/**
 * Split text into segments for highlighted rendering, so the UI can show the reporter
 * exactly which characters triggered a warning without dangerouslySetInnerHTML.
 */
export function segmentByPii(
  text: string,
  findings: PiiFinding[] = detectPii(text),
): Array<{ text: string; finding?: PiiFinding }> {
  if (findings.length === 0) return [{ text }];

  const segments: Array<{ text: string; finding?: PiiFinding }> = [];
  let cursor = 0;

  for (const finding of findings) {
    if (finding.start > cursor) {
      segments.push({ text: text.slice(cursor, finding.start) });
    }
    segments.push({ text: text.slice(finding.start, finding.end), finding });
    cursor = finding.end;
  }

  if (cursor < text.length) segments.push({ text: text.slice(cursor) });
  return segments;
}
