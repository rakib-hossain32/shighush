"use client";

/**
 * Step 2 — Narrative: the incident description, with scenario-specific writing guidance,
 * live PII detection, and a character counter.
 *
 * Per `lib/domain/pii.ts`, findings are surfaced as warnings and never auto-stripped —
 * silently rewriting a citizen's account of an event is both a data-integrity and a trust
 * problem. The reporter is told what was spotted and left to decide.
 */

import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  ShieldAlertIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { detectPii } from "@/lib/domain/pii";
import { cn } from "@/lib/utils";

import { Field, FIELD_TEXTAREA, describedBy } from "./field";
import { useReportForm } from "./form-context";

const NARRATIVE_MAX = 5000;
const NARRATIVE_MIN = 40;

export function StepNarrative() {
  const { form, scenario } = useReportForm();
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const narrative = watch("narrative") || "";
  const piiFindings = detectPii(narrative);
  const narrativeLength = narrative.length;

  const nearLimit = narrativeLength > NARRATIVE_MAX * 0.9;
  const belowMinimum = narrativeLength > 0 && narrativeLength < NARRATIVE_MIN;

  const placeholder =
    scenario?.narrativePlaceholder ||
    "ঘটনাটি সংক্ষেপে, শান্ত ও নিরপেক্ষ ভাষায় স্পষ্ট করে লিখুন...";

  return (
    <div className="space-y-6">
      {/* Scenario-specific writing guidance */}
      <div className="rounded-none border-2 border-primary/40 bg-primary/10 p-3.5 shadow-[2px_2px_0_var(--foreground)] sm:p-4">
        <div className="flex items-start gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-none border-2 border-primary/30 bg-background text-primary sm:size-9">
            <ShieldCheckIcon aria-hidden="true" className="size-4" />
          </span>
          <div className="min-w-0 space-y-2 text-xs">
            <p className="font-bold uppercase tracking-wider text-primary">
              {scenario ? `${scenario.title} — লেখার নির্দেশিকা` : "লেখার নির্দেশিকা"}
            </p>

            <ul className="space-y-1.5 text-foreground">
              {scenario?.narrativeTips.map((tip) => (
                <li className="flex items-start gap-2" key={tip}>
                  <CheckCircle2Icon
                    aria-hidden="true"
                    className="mt-0.5 size-3 shrink-0 text-primary"
                  />
                  <span className="min-w-0 leading-relaxed">
                    <strong>পরামর্শ:</strong> {tip}
                  </span>
                </li>
              ))}

              <li className="flex items-start gap-2">
                <CheckCircle2Icon
                  aria-hidden="true"
                  className="mt-0.5 size-3 shrink-0 text-primary"
                />
                <span className="min-w-0 leading-relaxed">
                  <strong>পদবি উল্লেখ করুন:</strong> যেমন &quot;অফিস সহকারী / ভূমি
                  কর্মকর্তা&quot; — সুনির্দিষ্ট ব্যক্তির নাম দেওয়া বাধ্যতামূলক নয়
                </span>
              </li>

              <li className="flex items-start gap-2">
                <AlertTriangleIcon
                  aria-hidden="true"
                  className="mt-0.5 size-3 shrink-0 text-destructive"
                />
                <span className="min-w-0 leading-relaxed">
                  <strong>কখনোই দেবেন না:</strong> নিজের বা অন্যের ব্যক্তিগত ফোন নম্বর,
                  NID, বা বাসার ঠিকানা
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Narrative */}
      <div>
        <Field
          adornment={
            <span
              aria-hidden="true"
              className={cn(
                "shrink-0 text-[11px] tabular-nums",
                nearLimit ? "font-bold text-destructive" : "text-muted-foreground",
              )}
            >
              {narrativeLength.toLocaleString("bn-BD")}/
              {NARRATIVE_MAX.toLocaleString("bn-BD")}
            </span>
          }
          error={errors.narrative?.message}
          hint={
            belowMinimum
              ? `আরও ${(NARRATIVE_MIN - narrativeLength).toLocaleString("bn-BD")}টি অক্ষর লিখুন — রিভিউ করার মতো যথেষ্ট বিবরণ দরকার`
              : "কী ঘটেছে, কখন এবং কোথায় — বস্তুনিষ্ঠ ভাষায় লিখুন"
          }
          id="narrative"
          label="কী ঘটেছে? বিস্তারিত বিবরণ"
          required
        >
          {/* The overflow-hidden wrapper keeps a long unbroken string from widening the
              page on a phone. */}
          <div className="w-full overflow-hidden">
            <Textarea
              aria-describedby={describedBy("narrative")}
              aria-invalid={!!errors.narrative}
              aria-required="true"
              // `field-sizing-fixed` makes rows/resize authoritative. The old
              // `[field-sizing:normal]` was not a valid value for the property, so the
              // primitive's `field-sizing-content` kept overriding rows={6}.
              className={cn(
                FIELD_TEXTAREA,
                "field-sizing-fixed max-h-[50vh] min-h-40 resize-y overflow-y-auto",
              )}
              id="narrative"
              placeholder={placeholder}
              rows={6}
              {...register("narrative")}
            />
          </div>
        </Field>

        {/* Announce the counter only when it starts to matter, so it does not chatter on
            every keystroke. */}
        <p aria-live="polite" className="sr-only">
          {nearLimit
            ? `সীমার কাছাকাছি: ${narrativeLength.toLocaleString("bn-BD")} / ${NARRATIVE_MAX.toLocaleString("bn-BD")} অক্ষর`
            : ""}
        </p>
      </div>

      {/* PII warnings */}
      {piiFindings.length > 0 && (
        <div
          className="rounded-none border-2 border-destructive bg-destructive/10 p-3.5 shadow-[2px_2px_0_var(--foreground)] sm:p-4"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <ShieldAlertIcon
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-destructive"
            />
            <div className="min-w-0">
              <p className="text-sm font-bold text-destructive">
                ব্যক্তিগত তথ্য শনাক্ত হয়েছে
              </p>
              <ul className="mt-2 space-y-1 text-xs">
                {piiFindings.map((finding) => (
                  <li
                    className="flex items-start gap-2 font-medium text-destructive/90"
                    key={`${finding.kind}-${finding.start}`}
                  >
                    <AlertTriangleIcon
                      aria-hidden="true"
                      className="mt-0.5 size-3 shrink-0"
                    />
                    <span className="min-w-0 wrap-break-word">
                      {finding.label}: &quot;{finding.match}&quot;
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-2.5 text-[11px] leading-relaxed text-muted-foreground">
                ব্যক্তিগত নিরাপত্তা রক্ষার্থে মডারেটর এগুলো মুছে দেন। আপনি নিজেই আগেই এই
                তথ্যগুলো বাদ দিলে রিপোর্টটি দ্রুত যাচাই ও গৃহীত হবে।
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
