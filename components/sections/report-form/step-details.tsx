"use client";

/**
 * Step 3 — Details: the step that actually adapts to the reporter's situation.
 *
 * Financial scenarios (bribery, extortion, fraud, procurement) get a prominent, required
 * money panel. Non-financial ones (harassment, service denial, abuse of power) never ask
 * for money at all — it is tucked into a collapsible for the rare case where an amount
 * came up anyway. Service-denial promotes the application/reference fields, since a
 * tracking number is the single most useful thing a moderator can chase.
 */

import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import {
  BanknoteIcon,
  ChevronDownIcon,
  FileTextIcon,
  InfoIcon,
  ReceiptIcon,
  UserIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  MONEY_TYPES,
  MONEY_TYPE_META,
  type MoneyType,
} from "@/lib/domain/enums";
import { cn } from "@/lib/utils";

import { EvidenceUpload } from "./evidence-upload";
import {
  Field,
  FieldError,
  FormSection,
  OptionalBadge,
  FIELD_INPUT,
  describedBy,
} from "./field";
import { useReportForm } from "./form-context";

/** Empty strings and unparseable input become `undefined`, not `NaN`. */
const parseOptionalNumber = (val: unknown) => {
  if (val === "" || val === null || val === undefined) return undefined;
  const num = Number(val);
  return isNaN(num) ? undefined : num;
};

const bdt = (n: number) => `৳${n.toLocaleString("bn-BD")}`;

/* ------------------------------------------------------------------ *
 * Money type — a binary choice, so two buttons rather than a dropdown
 * ------------------------------------------------------------------ */

function MoneyTypeChoice({
  includeUnknown,
  invalid,
}: {
  includeUnknown: boolean;
  invalid: boolean;
}) {
  const { form } = useReportForm();
  const options = includeUnknown
    ? MONEY_TYPES
    : MONEY_TYPES.filter((type) => type !== "unknown");

  return (
    <Controller
      control={form.control}
      name="moneyType"
      render={({ field }) => (
        <div
          aria-invalid={invalid || undefined}
          aria-label="টাকা চাওয়া হয়েছে না দেওয়া হয়েছে"
          className={cn(
            "grid gap-2",
            options.length > 2 ? "grid-cols-3" : "grid-cols-2",
          )}
          id="moneyType"
          role="radiogroup"
        >
          {options.map((type, idx) => {
            const selected = field.value === type;
            const inputId = `moneyType-${type}`;

            return (
              <label className="relative block cursor-pointer" key={type} htmlFor={inputId}>
                <input
                  checked={selected}
                  className="peer sr-only"
                  id={inputId}
                  name="moneyType"
                  onBlur={field.onBlur}
                  onChange={() => field.onChange(type)}
                  ref={idx === 0 ? field.ref : undefined}
                  type="radio"
                  value={type}
                />
                <span
                  className={cn(
                    "flex h-11 items-center justify-center rounded-none border-2 px-2 text-center text-xs font-bold transition-all",
                    "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
                    selected
                      ? "border-foreground bg-primary text-primary-foreground shadow-[2px_2px_0_var(--foreground)]"
                      : "border-border bg-background text-foreground hover:border-foreground",
                    invalid && !selected && "border-destructive/50",
                  )}
                >
                  {MONEY_TYPE_META[type as MoneyType].label}
                </span>
              </label>
            );
          })}
        </div>
      )}
    />
  );
}

/* ------------------------------------------------------------------ *
 * Money fields — one implementation, two presentations
 *
 * Previously the required and optional branches were separate markup, and the optional
 * one rendered no error node at all. Since the schema raises `moneyType` when an amount
 * is present without a type, entering an amount in the optional panel blocked the step
 * with nothing on screen to explain why. Sharing the body fixes that by construction.
 * ------------------------------------------------------------------ */

function MoneyFields({ required }: { required: boolean }) {
  const { form } = useReportForm();
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const moneyAmount = watch("moneyAmount");
  const officialFee = watch("officialFee");

  const overcharge =
    typeof moneyAmount === "number" &&
    typeof officialFee === "number" &&
    moneyAmount > officialFee
      ? moneyAmount - officialFee
      : null;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          error={errors.moneyAmount?.message}
          id="moneyAmount"
          label="টাকার পরিমাণ"
          required={required}
        >
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground"
            >
              ৳
            </span>
            <Input
              aria-describedby={describedBy("moneyAmount")}
              aria-invalid={!!errors.moneyAmount}
              className={cn(FIELD_INPUT, "pl-8")}
              id="moneyAmount"
              inputMode="numeric"
              placeholder="যেমন: ২৫০০"
              type="number"
              {...register("moneyAmount", { setValueAs: parseOptionalNumber })}
            />
          </div>
        </Field>

        <div className="space-y-2">
          <span className="block text-xs font-bold uppercase tracking-wider text-foreground">
            টাকা চাওয়া হয়েছে না দেওয়া হয়েছে?
            {required && (
              <>
                {" "}
                <span aria-hidden="true" className="font-bold text-primary">
                  *
                </span>
                <span className="sr-only">(আবশ্যক)</span>
              </>
            )}
          </span>
          <MoneyTypeChoice
            includeUnknown={!required}
            invalid={!!errors.moneyType}
          />
          <FieldError>{errors.moneyType?.message}</FieldError>
        </div>
      </div>

      {/* Official fee — only meaningful alongside an amount, so it lives with it. */}
      <Field
        error={errors.officialFee?.message}
        hint="গেজেটেড ফি জানা থাকলে দিন — সরকারি ফির চেয়ে কত বেশি চাওয়া হয়েছে তা পরিমাপযোগ্য হবে।"
        id="officialFee"
        label={
          <>
            সরকারি নির্ধারিত ফি{" "}
            <span className="font-normal normal-case text-muted-foreground">
              (যদি জানা থাকে)
            </span>
          </>
        }
      >
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground"
          >
            ৳
          </span>
          <Input
            aria-describedby={describedBy("officialFee")}
            className={cn(FIELD_INPUT, "pl-8")}
            id="officialFee"
            inputMode="numeric"
            placeholder="যেমন: ১১৫০"
            type="number"
            {...register("officialFee", { setValueAs: parseOptionalNumber })}
          />
        </div>
      </Field>

      {/* The whole reason the gazetted fee is collected — surfaced instead of left
          for a moderator to work out by hand. */}
      {overcharge !== null && (
        <div
          aria-live="polite"
          className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-none border-2 border-foreground bg-primary/10 px-3 py-2"
        >
          <ReceiptIcon aria-hidden="true" className="size-3.5 shrink-0 text-primary" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            সরকারি ফির অতিরিক্ত
          </span>
          <span className="text-sm font-extrabold tabular-nums text-foreground">
            {bdt(overcharge)}
          </span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * A collapsible header that stacks on a phone
 * ------------------------------------------------------------------ */

function DisclosureHeader({
  icon: Icon,
  title,
  note,
  open,
}: {
  icon: typeof BanknoteIcon;
  title: string;
  note?: string;
  open: boolean;
}) {
  return (
    <CollapsibleTrigger className="flex w-full cursor-pointer items-start justify-between gap-3 p-3.5 text-left transition-colors hover:bg-muted/40">
      <span className="flex min-w-0 items-start gap-2.5">
        <span className="grid size-7 shrink-0 place-items-center rounded-none border-2 border-border bg-background text-primary">
          <Icon aria-hidden="true" className="size-3.5" />
        </span>
        <span className="min-w-0">
          <span className="block text-xs font-bold uppercase tracking-wider text-foreground">
            {title}
          </span>
          {note && (
            <span className="mt-0.5 block text-[11px] leading-relaxed text-muted-foreground">
              {note}
            </span>
          )}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2 pt-0.5">
        <span className="hidden min-[420px]:inline">
          <OptionalBadge />
        </span>
        <ChevronDownIcon
          aria-hidden="true"
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </span>
    </CollapsibleTrigger>
  );
}

/* ------------------------------------------------------------------ *
 * Step
 * ------------------------------------------------------------------ */

export function StepDetails() {
  const { form, scenario, selectedCategory, needsMoney } = useReportForm();
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const isServiceDenial = selectedCategory === "service_denial";
  const isHarassment = selectedCategory === "harassment";

  const [moneyOpen, setMoneyOpen] = useState(
    () => watch("moneyAmount") !== undefined || watch("officialFee") !== undefined,
  );
  // Opens itself when it already holds data, so stepping back from review never hides
  // something the reporter typed.
  const [serviceOpen, setServiceOpen] = useState(
    () => Boolean(watch("serviceName") || watch("referenceNumber")),
  );

  const hasMoneyError = Boolean(
    errors.moneyAmount || errors.moneyType || errors.officialFee,
  );
  const hasServiceError = Boolean(errors.serviceName || errors.referenceNumber);

  /**
   * A collapsed panel must never hide the reason the step refuses to advance. The money
   * panel in particular can fail validation from inside: entering an amount without
   * choosing চাওয়া/দেওয়া trips the schema's `superRefine`, and before this the error had
   * nowhere to appear.
   */
  useEffect(() => {
    if (hasMoneyError) setMoneyOpen(true);
  }, [hasMoneyError]);

  useEffect(() => {
    if (hasServiceError) setServiceOpen(true);
  }, [hasServiceError]);

  return (
    <div className="space-y-6">
      {/* Scenario banner */}
      <div className="flex items-start gap-3 rounded-none border-2 border-foreground bg-muted/20 p-3.5 shadow-[2px_2px_0_var(--foreground)] sm:p-4">
        <span className="grid size-8 shrink-0 place-items-center rounded-none border-2 border-foreground bg-background text-primary">
          <InfoIcon aria-hidden="true" className="size-4" />
        </span>
        <div className="min-w-0 space-y-1 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-foreground">
              {scenario ? scenario.title : "অতিরিক্ত তথ্য"}
            </span>
            <Badge
              className="rounded-none border-foreground bg-background px-1.5 py-0 text-[9px] font-bold"
              variant="outline"
            >
              {needsMoney ? "আর্থিক অভিযোগ" : "প্রশাসনিক / আচরণগত অভিযোগ"}
            </Badge>
          </div>
          <p className="leading-relaxed text-muted-foreground">
            {needsMoney
              ? "এই ধরনের অভিযোগে অর্থের সুনির্দিষ্ট অঙ্ক ও লেনদেনের মাধ্যম উল্লেখ করা তদন্তের জন্য অত্যন্ত গুরুত্বপূর্ণ।"
              : isHarassment
                ? "হয়রানির অভিযোগে কোনো আর্থিক তথ্যের প্রয়োজন নেই। সংশ্লিষ্ট কর্মকর্তা ও ঘটনার পরিস্থিতির বিবরণই যথেষ্ট।"
                : isServiceDenial
                  ? "সেবা-বঞ্চনার ক্ষেত্রে কোন সেবাটি কত দিন ধরে আটকে রাখা হয়েছে এবং আবেদন নম্বর জানা থাকলে তা উল্লেখ করুন।"
                  : "এই ধাপের তথ্যগুলো ঐচ্ছিক। যত বেশি তথ্য দেবেন, অভিযোগের সত্যতা যাচাই তত সহজ হবে।"}
          </p>
        </div>
      </div>

      {/* ── Money ──────────────────────────────────────────────────────── */}
      {needsMoney ? (
        <FormSection
          badge={
            <Badge
              className="rounded-none border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary"
              variant="outline"
            >
              প্রয়োজনীয় তথ্য
            </Badge>
          }
          icon={BanknoteIcon}
          title={scenario?.moneyTitle || "অর্থ-সংক্রান্ত তথ্য"}
          tone="accent"
        >
          <MoneyFields required />
        </FormSection>
      ) : (
        <Collapsible
          className="rounded-none border-2 border-border bg-background"
          onOpenChange={setMoneyOpen}
          open={moneyOpen}
        >
          <DisclosureHeader
            icon={BanknoteIcon}
            note="সাধারণত হয়রানি বা সেবা-বঞ্চনায় অর্থের তথ্য লাগে না — তবে থাকলে যোগ করুন"
            open={moneyOpen}
            title="এই ঘটনায় কি কোনো অর্থ বা ফির দাবি ছিল?"
          />
          <CollapsibleContent className="border-t-2 border-border p-4">
            <MoneyFields required={false} />
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* ── Service & application reference ────────────────────────────── */}
      {isServiceDenial ? (
        <FormSection
          badge={
            <Badge
              className="rounded-none border-foreground bg-background px-2 py-0.5 text-[10px] font-bold"
              variant="outline"
            >
              সেবা-বঞ্চনা ট্র্যাক করতে সহায়ক
            </Badge>
          }
          footnote="রেফারেন্স নম্বর প্রকাশ করার আগে মডারেটর সংবেদনশীল অংশ মুছে দেবেন।"
          icon={FileTextIcon}
          title="আবেদন ও সেবার বিবরণ"
        >
          <ServiceFields
            errors={{
              serviceName: errors.serviceName?.message,
              referenceNumber: errors.referenceNumber?.message,
            }}
            register={register}
            serviceLabel="কাঙ্ক্ষিত সেবার নাম"
            servicePlaceholder="যেমন: ই-নামজারি / জন্ম নিবন্ধন সংশোধন"
          />
        </FormSection>
      ) : (
        <Collapsible
          className="rounded-none border-2 border-border bg-background"
          onOpenChange={setServiceOpen}
          open={serviceOpen}
        >
          <DisclosureHeader
            icon={FileTextIcon}
            note="আবেদন বা চালান নম্বর থাকলে যাচাই অনেক দ্রুত হয়"
            open={serviceOpen}
            title="সেবার নাম ও রেফারেন্স নম্বর"
          />
          <CollapsibleContent className="border-t-2 border-border p-4">
            <ServiceFields
              errors={{
                serviceName: errors.serviceName?.message,
                referenceNumber: errors.referenceNumber?.message,
              }}
              register={register}
              serviceLabel="সেবার নাম"
              servicePlaceholder="যেমন: ড্রাইভিং লাইসেন্স / নামজারি"
            />
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* ── Accused official ───────────────────────────────────────────── */}
      <FormSection
        badge={
          <Badge
            className="rounded-none border-border px-1.5 py-0 text-[9px] font-normal"
            variant="outline"
          >
            পদবি যথেষ্ট (নাম ঐচ্ছিক)
          </Badge>
        }
        footnote="§৭ সুরক্ষা নীতি: শুধু পদবি দিলেও রিপোর্ট সম্পূর্ণ গ্রহণযোগ্য। নির্দিষ্ট ব্যক্তির নাম দিলে তা যাচাই করে মডারেটর ব্যবস্থা নেবেন।"
        icon={UserIcon}
        title="অভিযুক্ত কর্মকর্তা / ব্যক্তির তথ্য"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            error={errors.accusedDesignation?.message}
            id="accusedDesignation"
            label="কর্মকর্তার পদবি বা দফতর"
          >
            <Input
              aria-describedby={describedBy("accusedDesignation")}
              aria-invalid={!!errors.accusedDesignation}
              className={FIELD_INPUT}
              id="accusedDesignation"
              placeholder="যেমন: সার্ভেয়ার / অফিস সহকারী"
              {...register("accusedDesignation")}
            />
          </Field>

          <Field
            error={errors.accusedName?.message}
            id="accusedName"
            label={
              <>
                কর্মকর্তার নাম{" "}
                <span className="font-normal normal-case text-muted-foreground">
                  (শুধু নিশ্চিত হলে)
                </span>
              </>
            }
          >
            <Input
              aria-describedby={describedBy("accusedName")}
              aria-invalid={!!errors.accusedName}
              className={FIELD_INPUT}
              id="accusedName"
              placeholder="ঐচ্ছিক"
              {...register("accusedName")}
            />
          </Field>
        </div>
      </FormSection>

      {/* ── Evidence ───────────────────────────────────────────────────── */}
      <EvidenceUpload />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Service / reference pair — identical in both presentations
 * ------------------------------------------------------------------ */

function ServiceFields({
  register,
  serviceLabel,
  servicePlaceholder,
  errors,
}: {
  register: ReturnType<typeof useReportForm>["form"]["register"];
  serviceLabel: string;
  servicePlaceholder: string;
  errors: { serviceName?: string; referenceNumber?: string };
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field error={errors.serviceName} id="serviceName" label={serviceLabel}>
        <Input
          aria-describedby={describedBy("serviceName")}
          className={FIELD_INPUT}
          id="serviceName"
          placeholder={servicePlaceholder}
          {...register("serviceName")}
        />
      </Field>

      <div id="field-referenceNumber">
        <Field
          error={errors.referenceNumber}
          id="referenceNumber"
          label="আবেদন বা চালান নম্বর"
        >
          <Input
            aria-describedby={describedBy("referenceNumber")}
            className={FIELD_INPUT}
            id="referenceNumber"
            placeholder="যেমন: আবেদন আইডি / ডায়েরি নং"
            {...register("referenceNumber")}
          />
        </Field>
      </div>
    </div>
  );
}
