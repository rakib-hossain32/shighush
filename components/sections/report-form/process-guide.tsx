/**
 * "What this will involve" explainer — sits above the wizard.
 *
 * The old page dropped an anonymous reporter straight into step 1 of an unlabelled
 * four-step form with no statement of what would be asked, how long it would take, or
 * what arrives at the end. That is a lot of trust to ask for before the first keystroke,
 * and the cost of guessing wrong is high for someone documenting a public official.
 *
 * Step titles and summaries are read from `FORM_STEPS`, the same source the stepper and
 * the step headers use, so the promise made here cannot drift from what the form does.
 *
 * A server component on purpose: it is static content with no interactivity, so it stays
 * out of the client bundle.
 */

import { ClockIcon, EyeOffIcon, KeyRoundIcon, type LucideIcon } from "lucide-react";

import { FORM_STEPS } from "./types";

const ASSURANCES: Array<{ icon: LucideIcon; text: string }> = [
  { icon: ClockIcon, text: "সময় লাগবে ৫–৭ মিনিট" },
  { icon: EyeOffIcon, text: "নাম বা পরিচয় লাগবে না" },
  { icon: KeyRoundIcon, text: "শেষে গোপন ট্র্যাকিং কোড পাবেন" },
];

export function ProcessGuide() {
  return (
    <section
      aria-labelledby="process-guide-title"
      className="rounded-none border-2 border-foreground bg-card shadow-[3px_3px_0_var(--foreground)]"
    >
      <div className="flex flex-col gap-1 border-b-2 border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="min-w-0">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
            HOW IT WORKS
          </span>
          <h2
            className="font-heading text-sm font-bold text-foreground sm:text-base"
            id="process-guide-title"
          >
            জমা দেওয়ার আগে — প্রক্রিয়াটি এক নজরে
          </h2>
        </div>
        <span className="shrink-0 self-start rounded-none border-2 border-border bg-background px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:self-auto">
          {FORM_STEPS.length.toLocaleString("bn-BD")} ধাপ
        </span>
      </div>

      {/* The four steps. Numbered rather than iconed — the number is the thing the
          reporter will match against the stepper inside the form.

          Separators come from a 2px gap over a `bg-border` track rather than
          `divide-*` or nth-child borders: this grid reflows 1 → 2 → 4 columns, and the
          gap approach draws correct lines at every one of them without special-casing
          which cell sits on which edge. */}
      <ol className="grid grid-cols-1 gap-0.5 bg-border min-[560px]:grid-cols-2 lg:grid-cols-4">
        {FORM_STEPS.map((step, idx) => (
          <li
            className="flex items-start gap-2.5 bg-card p-3.5 sm:p-4"
            key={step.id}
          >
            <span
              aria-hidden="true"
              className="grid size-6 shrink-0 place-items-center rounded-none border-2 border-foreground bg-primary text-[11px] font-bold text-primary-foreground"
            >
              {(idx + 1).toLocaleString("bn-BD")}
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-bold text-foreground">
                {step.label}
              </span>
              <span className="mt-0.5 block text-[11px] leading-relaxed text-muted-foreground">
                {step.summary}
              </span>
            </span>
          </li>
        ))}
      </ol>

      <ul className="flex flex-col gap-2 border-t-2 border-border bg-muted/20 px-4 py-3 min-[480px]:flex-row min-[480px]:flex-wrap min-[480px]:items-center min-[480px]:gap-x-5 sm:px-5">
        {ASSURANCES.map((assurance) => (
          <li
            className="flex items-center gap-1.5 text-[11px] font-bold text-foreground"
            key={assurance.text}
          >
            <assurance.icon
              aria-hidden="true"
              className="size-3.5 shrink-0 text-primary"
            />
            {assurance.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
