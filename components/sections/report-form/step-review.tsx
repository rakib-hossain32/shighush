"use client";

/**
 * Step 4 — Review & Submit.
 *
 * Every group carries an edit button that jumps straight back to the step that owns it,
 * so correcting a typo in the institution name does not mean clicking "পূর্ববর্তী ধাপ"
 * three times. Optional fields left blank read "দেওয়া হয়নি" rather than a bare dash —
 * the reporter should be able to tell a deliberate omission from a rendering gap.
 */

import type { ReactNode } from "react";
import { Controller } from "react-hook-form";
import { CheckCircle2Icon, ShieldCheckIcon, SquarePenIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  REPORT_CATEGORY_META,
  DATE_PRECISION_META,
  MONEY_TYPE_META,
  type ReportCategory,
  type DatePrecision,
  type MoneyType,
} from "@/lib/domain/enums";
import { cn } from "@/lib/utils";
import { officeNameBn } from "@/lib/domain/office-name";

import { FieldError } from "./field";
import { useReportForm } from "./form-context";

const NOT_PROVIDED = "দেওয়া হয়নি";

function SummaryRow({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="border-b border-border/60 pb-2">
      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <p
        className={cn(
          "mt-0.5 wrap-break-word",
          muted ? "font-normal text-muted-foreground" : "font-bold text-foreground",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function SummaryGroup({
  title,
  step,
  children,
}: {
  title: string;
  step: number;
  children: ReactNode;
}) {
  const { goToStep } = useReportForm();

  return (
    <section className="space-y-2.5">
      <div className="flex items-center justify-between gap-2 border-b-2 border-border pb-1.5">
        <h5 className="text-[11px] font-bold uppercase tracking-wider text-foreground">
          {title}
        </h5>
        <button
          className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-none border border-border bg-background px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          onClick={() => goToStep(step)}
          type="button"
        >
          <SquarePenIcon aria-hidden="true" className="size-3" />
          সম্পাদনা
          <span className="sr-only"> — {title}</span>
        </button>
      </div>
      <div className="grid gap-3 text-xs sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function StepReview() {
  const { form, selectedCategory, scenario } = useReportForm();
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  const title = watch("title");
  const institutionName = watch("institutionName");
  const institutionNameUnknown = watch("institutionNameUnknown");
  const officeName = officeNameBn(watch("officeName"));
  const incidentDate = watch("incidentDate");
  const incidentDatePrecision = watch("incidentDatePrecision") as
    | DatePrecision
    | undefined;
  const moneyAmount = watch("moneyAmount");
  const moneyType = watch("moneyType") as MoneyType | undefined;
  const officialFee = watch("officialFee");
  const accusedDesignation = watch("accusedDesignation");
  const accusedName = watch("accusedName");
  const serviceName = watch("serviceName");
  const referenceNumber = watch("referenceNumber");
  const narrative = watch("narrative");

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="rounded-none border-2 border-foreground bg-card p-4 shadow-[4px_4px_0_var(--foreground)] sm:p-5">
        <div className="mb-4 flex flex-col gap-2 border-b-2 border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="grid size-7 shrink-0 place-items-center rounded-none border-2 border-foreground bg-primary text-primary-foreground">
              <ShieldCheckIcon aria-hidden="true" className="size-4" />
            </span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              রিপোর্টের সারসংক্ষেপ
            </h4>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {scenario && (
              <Badge
                className="rounded-none border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary"
                variant="outline"
              >
                {scenario.badge}
              </Badge>
            )}
            <Badge
              className="rounded-none border-foreground bg-background px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground"
              variant="outline"
            >
              চূড়ান্ত যাচাই
            </Badge>
          </div>
        </div>

        <div className="space-y-5">
          <SummaryGroup step={0} title="ঘটনার প্রেক্ষাপট">
            <SummaryRow label="অভিযোগের শিরোনাম" value={title || NOT_PROVIDED} />
            <SummaryRow
              label="প্রতিষ্ঠান"
              muted={!institutionName && !institutionNameUnknown}
              value={institutionNameUnknown ? "নাম জানা নেই" : institutionName || NOT_PROVIDED}
            />
            <SummaryRow
              label="অভিযোগের ধরন"
              value={
                selectedCategory
                  ? REPORT_CATEGORY_META[selectedCategory as ReportCategory]?.label
                  : "—"
              }
            />
            <SummaryRow
              label="শাখা / অফিস"
              muted={!officeName}
              value={officeName || NOT_PROVIDED}
            />
            <SummaryRow
              label="ঘটনার সময়"
              value={
                <>
                  {incidentDate || "—"}{" "}
                  {incidentDatePrecision && incidentDatePrecision !== "exact" && (
                    <span className="font-normal text-muted-foreground">
                      ({DATE_PRECISION_META[incidentDatePrecision]?.label})
                    </span>
                  )}
                </>
              }
            />
          </SummaryGroup>

          <SummaryGroup step={2} title="পরিস্থিতি-নির্দিষ্ট তথ্য">
            {/* Money reads differently depending on whether this scenario needed it at
                all — "প্রযোজ্য নয়" is information, not an omission. */}
            {moneyAmount !== undefined ? (
              <SummaryRow
                label="অর্থের পরিমাণ"
                value={
                  <>
                    ৳{moneyAmount.toLocaleString("bn-BD")}{" "}
                    {moneyType && moneyType !== "unknown" && (
                      <span className="font-normal text-muted-foreground">
                        ({MONEY_TYPE_META[moneyType]?.label})
                      </span>
                    )}
                    {officialFee !== undefined ? (
                      <span className="ml-1 text-[11px] font-normal text-muted-foreground">
                        [সরকারি ফি: ৳{officialFee.toLocaleString("bn-BD")}]
                      </span>
                    ) : null}
                  </>
                }
              />
            ) : (
              <SummaryRow
                label="আর্থিক লেনদেন"
                muted
                value={
                  scenario?.needsMoney
                    ? NOT_PROVIDED
                    : `প্রযোজ্য নয় (${scenario?.badge || "অ-আর্থিক"})`
                }
              />
            )}

            <SummaryRow
              label="অভিযুক্ত কর্মকর্তা"
              muted={!accusedDesignation && !accusedName}
              value={
                accusedDesignation || accusedName
                  ? `${accusedDesignation || "—"}${accusedName ? ` (${accusedName})` : ""}`
                  : NOT_PROVIDED
              }
            />

            <SummaryRow
              label="সেবা ও রেফারেন্স"
              muted={!serviceName && !referenceNumber}
              value={
                serviceName || referenceNumber
                  ? `${serviceName || "—"}${referenceNumber ? ` [নং: ${referenceNumber}]` : ""}`
                  : NOT_PROVIDED
              }
            />
          </SummaryGroup>
        </div>

        {/* Narrative preview */}
        {narrative && (
          <div className="mt-5 border-t-2 border-border pt-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                বিবরণ পূর্বরূপ
              </span>
              <span className="text-[10px] text-muted-foreground">
                {narrative.length.toLocaleString("bn-BD")} অক্ষর
              </span>
            </div>
            <p className="mt-1 line-clamp-4 rounded-none border border-border bg-muted/20 p-2.5 text-xs leading-relaxed text-foreground/90">
              {narrative}
            </p>
          </div>
        )}
      </div>

      {/* Anonymous inbox */}
      <div className="rounded-none border-2 border-border bg-background p-4 shadow-[2px_2px_0_var(--foreground)]">
        <label
          className="flex cursor-pointer items-start gap-3"
          htmlFor="enableAnonymousInbox"
        >
          <Controller
            control={control}
            name="enableAnonymousInbox"
            render={({ field }) => (
              <Checkbox
                checked={!!field.value}
                className="mt-0.5 rounded-none border-2 border-foreground"
                id="enableAnonymousInbox"
                onChange={(e) =>
                  field.onChange((e.target as HTMLInputElement).checked)
                }
              />
            )}
          />
          <span className="space-y-1">
            <Label
              className="cursor-pointer text-xs font-bold uppercase tracking-wider text-foreground"
              htmlFor="enableAnonymousInbox"
            >
              গোপন Inbox চালু রাখুন
            </Label>
            <span className="block text-[11px] leading-relaxed text-muted-foreground">
              মডারেটর আপনার পরিচয় না জেনেই অতিরিক্ত তথ্য বা প্রমাণের জন্য যোগাযোগ করতে পারবেন।
            </span>
          </span>
        </label>
      </div>

      {/* Mandatory consents */}
      <div className="space-y-4 rounded-none border-2 border-foreground bg-background p-4 shadow-[2px_2px_0_var(--foreground)] sm:p-5">
        <div className="flex items-center gap-2 border-b-2 border-border pb-2.5">
          <CheckCircle2Icon aria-hidden="true" className="size-4 shrink-0 text-primary" />
          <p className="text-xs font-bold uppercase tracking-wider text-foreground">
            সম্মতি ও নাগরিক দায়বদ্ধতা
          </p>
        </div>

        <div className="space-y-1.5" id="truthAcknowledged">
          <label
            className="flex cursor-pointer items-start gap-3"
            htmlFor="truthAcknowledgedInput"
          >
            <Controller
              control={control}
              name="truthAcknowledged"
              render={({ field }) => (
                <Checkbox
                  aria-invalid={!!errors.truthAcknowledged}
                  checked={!!field.value}
                  className="mt-0.5 rounded-none border-2 border-foreground"
                  id="truthAcknowledgedInput"
                  onChange={(e) =>
                    field.onChange((e.target as HTMLInputElement).checked)
                  }
                />
              )}
            />
            <span className="select-none text-xs leading-relaxed text-foreground">
              আমার জানা অনুযায়ী এই তথ্য সত্য ও বস্তুনিষ্ঠ এবং আমি কোনো ব্যক্তিগত গোপন তথ্য
              (যেমন ফোন নম্বর, NID বা ব্যক্তিগত ঠিকানা) উল্লেখ করিনি।{" "}
              <span aria-hidden="true" className="font-bold text-primary">
                *
              </span>
            </span>
          </label>
          <FieldError className="pl-7">
            {errors.truthAcknowledged?.message}
          </FieldError>
        </div>

        <div className="space-y-1.5" id="policyAcknowledged">
          <label
            className="flex cursor-pointer items-start gap-3"
            htmlFor="policyAcknowledgedInput"
          >
            <Controller
              control={control}
              name="policyAcknowledged"
              render={({ field }) => (
                <Checkbox
                  aria-invalid={!!errors.policyAcknowledged}
                  checked={!!field.value}
                  className="mt-0.5 rounded-none border-2 border-foreground"
                  id="policyAcknowledgedInput"
                  onChange={(e) =>
                    field.onChange((e.target as HTMLInputElement).checked)
                  }
                />
              )}
            />
            <span className="select-none text-xs leading-relaxed text-foreground">
              আমি শিঘুষ প্ল্যাটফর্মের প্রকাশ ও গোপনীয়তা নীতি পড়েছি এবং মেনে নিচ্ছি।{" "}
              <span aria-hidden="true" className="font-bold text-primary">
                *
              </span>
            </span>
          </label>
          <FieldError className="pl-7">
            {errors.policyAcknowledged?.message}
          </FieldError>
        </div>
      </div>

      {/* §13 — hidden honeypot. A real browser leaves this empty. */}
      <input
        aria-hidden="true"
        autoComplete="off"
        className="hidden"
        tabIndex={-1}
        type="text"
        {...register("contactReason")}
      />
    </div>
  );
}
