"use client";

/**
 * Wizard progress indicator.
 *
 * The previous version rendered four equal columns at every width. At 360px each cell
 * ended up ~56px of usable space, so labels like "নির্দিষ্ট তথ্য" wrapped to two or three
 * lines and the four boxes came out ragged and different heights — the single biggest
 * source of visual clutter on a phone.
 *
 * So the component renders two genuinely different things:
 *   · below `sm` — one fixed-height summary row plus a segmented track. Nothing wraps.
 *   · `sm` and up — the labelled columns, with `min-w-0` + `truncate` so a long label
 *     shortens instead of reflowing the row.
 */

import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { FORM_STEPS } from "./types";

interface StepProgressProps {
  currentStep: number;
  /** Rejected silently by the parent if the target step is not yet reachable. */
  onStepSelect: (stepIndex: number) => void;
}

const bn = (n: number) => n.toLocaleString("bn-BD");

export function StepProgress({ currentStep, onStepSelect }: StepProgressProps) {
  const total = FORM_STEPS.length;
  const active = FORM_STEPS[currentStep];
  const percent = Math.round(((currentStep + 1) / total) * 100);

  return (
    <div className="border-b-2 border-border bg-background px-4 py-3 sm:px-6">
      {/* ── Phone: summary row + segmented track ─────────────────────────── */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 rounded-none border-2 border-foreground bg-primary px-1.5 py-0.5  text-[10px] font-bold text-primary-foreground">
              ধাপ {bn(currentStep + 1)}/{bn(total)}
            </span>
            <span className="truncate text-xs font-bold text-foreground">
              {active.label}
            </span>
          </div>
          <span className="shrink-0  text-[10px] font-bold tabular-nums text-muted-foreground">
            {bn(percent)}%
          </span>
        </div>

        {/* Thin bars, but each sits in a ~28px tall button so the tap target is real. */}
        <div className="mt-1.5 flex gap-1.5">
          {FORM_STEPS.map((step, idx) => {
            const reached = idx <= currentStep;
            const reachable = idx <= currentStep + 1;

            return (
              <button
                aria-current={idx === currentStep ? "step" : undefined}
                aria-label={`ধাপ ${bn(idx + 1)}: ${step.label}`}
                className="group flex-1 cursor-pointer py-2 disabled:cursor-not-allowed"
                disabled={!reachable}
                key={step.id}
                onClick={() => onStepSelect(idx)}
                type="button"
              >
                <span
                  className={cn(
                    "block h-1.5 border-2 border-foreground transition-colors",
                    reached ? "bg-primary" : "bg-background",
                    !reachable && "border-border",
                  )}
                />
              </button>
            );
          })}
        </div>

        <p className="text-[11px] leading-relaxed text-muted-foreground">
          {active.summary}
        </p>
      </div>

      {/* ── Tablet and up: labelled columns ──────────────────────────────── */}
      <ol className="hidden grid-cols-4 gap-2 sm:grid md:gap-3">
        {FORM_STEPS.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;
          const reachable = idx <= currentStep + 1;

          return (
            <li className="min-w-0" key={step.id}>
              <button
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex w-full min-w-0 cursor-pointer items-center gap-2.5 rounded-none border-2 p-2 text-left transition-all",
                  "disabled:cursor-not-allowed disabled:opacity-40",
                  isCurrent
                    ? "border-foreground bg-primary text-primary-foreground shadow-[2px_2px_0_var(--foreground)]"
                    : isCompleted
                      ? "border-border bg-muted/40 text-foreground hover:border-foreground"
                      : "border-transparent text-muted-foreground hover:border-border",
                )}
                disabled={!reachable}
                onClick={() => onStepSelect(idx)}
                type="button"
              >
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-none border-2 text-xs font-bold",
                    isCurrent
                      ? "border-primary-foreground bg-primary-foreground text-primary"
                      : isCompleted
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-muted-foreground",
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon aria-hidden="true" className="size-3.5" />
                  ) : (
                    bn(idx + 1)
                  )}
                </span>
                <span className="min-w-0 truncate text-[11px] font-bold tracking-tight">
                  <span className="hidden md:inline">{step.label}</span>
                  <span className="md:hidden">{step.shortLabel}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
