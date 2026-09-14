"use client";

/**
 * Step 1 — Context: complaint type, institution, office, and date.
 *
 * The category control is a tile grid rather than a dropdown (see `category-picker.tsx`):
 * it is the choice that decides whether the wizard will demand money fields, so it has to
 * be legible before the reporter invests any typing. Choosing one reveals a short
 * "what this will ask you for" checklist, so there are no surprises at step 3.
 */

import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { CalendarIcon, HelpCircle, ListChecksIcon, SparklesIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MUNICIPALITY, UNIONS, type AreaSlug } from "@/lib/domain/geo";
import { toBnDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

import { CategoryPicker } from "./category-picker";
import { DatePicker } from "./date-picker";
import {
  Field,
  FIELD_INPUT,
  FIELD_TRIGGER,
  describedBy,
} from "./field";
import { useReportForm } from "./form-context";

const OFFICE_INSTITUTION_SUGGESTIONS = [
  "উপজেলা পরিষদ, শিবচর",
  "শিবচর থানা",
  "শিবচর পৌরসভা",
  "উপজেলা প্রাথমিক শিক্ষা অফিস, শিবচর",
  "উপজেলা মাধ্যমিক শিক্ষা অফিস, শিবচর",
  "উপজেলা স্বাস্থ্য কমপ্লেক্স, শিবচর",
  "উপজেলা ভূমি অফিস, শিবচর",
  "সাব-রেজিস্ট্রার অফিস, শিবচর",
  "উপজেলা সমাজসেবা কার্যালয়, শিবচর",
  "উপজেলা কৃষি অফিস, শিবচর",
] as const;

const INSTITUTION_SUGGESTIONS = [
  ...OFFICE_INSTITUTION_SUGGESTIONS,
  ...UNIONS.map((union) => `${union.nameBn} ইউনিয়ন পরিষদ`),
];

const LOCAL_SCOPE = "ইউনিয়ন পরিষদ / পৌরসভা" as const;
const OFFICE_SCOPE = "উপজেলা / সরকারি অফিস" as const;
const OTHER_SCOPE = "অন্যান্য প্রতিষ্ঠান" as const;
type InstitutionScope = typeof LOCAL_SCOPE | typeof OFFICE_SCOPE | typeof OTHER_SCOPE;

const LOCAL_INSTITUTION_AREAS: Record<string, AreaSlug> = Object.fromEntries(
  [
    [`${MUNICIPALITY.nameBn}`, MUNICIPALITY.slug],
    ...UNIONS.map((union) => [`${union.nameBn} ইউনিয়ন পরিষদ`, union.slug]),
  ],
) as Record<string, AreaSlug>;

const BN_MONTHS = [
  { value: "01", label: "জানুয়ারি" },
  { value: "02", label: "ফেব্রুয়ারি" },
  { value: "03", label: "মার্চ" },
  { value: "04", label: "এপ্রিল" },
  { value: "05", label: "মে" },
  { value: "06", label: "জুন" },
  { value: "07", label: "জুলাই" },
  { value: "08", label: "আগস্ট" },
  { value: "09", label: "সেপ্টেম্বর" },
  { value: "10", label: "অক্টোবর" },
  { value: "11", label: "নভেম্বর" },
  { value: "12", label: "ডিসেম্বর" },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 11 }, (_, i) => {
  const y = CURRENT_YEAR - i;
  return { value: y.toString(), label: toBnDigits(y) };
});

export function StepContext() {
  const { form, scenario } = useReportForm();
  const {
    register,
    control,
    formState: { errors },
  } = form;
  const [institutionScope, setInstitutionScope] = useState<InstitutionScope | "">("");

  const currentPrecision = form.watch("incidentDatePrecision");
  const institutionName = form.watch("institutionName") || "";
  const institutionNameUnknown = form.watch("institutionNameUnknown");
  const selectedInstitutionArea = LOCAL_INSTITUTION_AREAS[institutionName];
  const institutionSuggestions = INSTITUTION_SUGGESTIONS.filter((institution) => {
    if (institutionScope === LOCAL_SCOPE) {
      return institution.includes("ইউনিয়ন পরিষদ") || institution.includes("পৌরসভা");
    }
    if (institutionScope === OFFICE_SCOPE) {
      return !institution.includes("ইউনিয়ন পরিষদ") && !institution.includes("পৌরসভা");
    }
    return institutionScope === OTHER_SCOPE;
  });

  useEffect(() => {
    if (selectedInstitutionArea && form.getValues("area") !== selectedInstitutionArea) {
      form.setValue("area", selectedInstitutionArea, { shouldValidate: true });
    }
  }, [form, selectedInstitutionArea]);
  const [isApproximate, setIsApproximate] = useState(
    Boolean(currentPrecision && currentPrecision !== "exact")
  );
  const [approxPrecision, setApproxPrecision] = useState<"month" | "year" | "unknown">(
    currentPrecision && currentPrecision !== "exact" ? currentPrecision : "month"
  );
  const [approxMonth, setApproxMonth] = useState<string>(() => {
    const val = form.getValues("incidentDate");
    if (val && val.includes("-")) {
      const parts = val.split("-");
      if (parts[1]) return parts[1];
    }
    return String(new Date().getMonth() + 1).padStart(2, "0");
  });
  const [approxYear, setApproxYear] = useState<string>(() => {
    const val = form.getValues("incidentDate");
    if (val && val.includes("-")) {
      const parts = val.split("-");
      if (parts[0]) return parts[0];
    }
    return CURRENT_YEAR.toString();
  });

  const handleApproxPrecisionChange = (type: "month" | "year" | "unknown") => {
    setApproxPrecision(type);
    form.setValue("incidentDatePrecision", type);
    if (type === "month") {
      form.setValue("incidentDate", `${approxYear}-${approxMonth}-01`, { shouldValidate: true });
    } else if (type === "year") {
      form.setValue("incidentDate", `${approxYear}-01-01`, { shouldValidate: true });
    } else {
      form.setValue("incidentDate", `${CURRENT_YEAR}-01-01`, { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-6">
      <Field
        error={errors.title?.message}
        hint="এক লাইনে অভিযোগটির মূল বিষয় লিখুন। যেমন: নাগরিক সনদের জন্য অতিরিক্ত টাকা দাবি।"
        id="title"
        label="অভিযোগের শিরোনাম বা বিষয়"
        required
      >
        <Input
          aria-describedby={describedBy("title")}
          aria-invalid={!!errors.title}
          aria-required="true"
          className={FIELD_INPUT}
          id="title"
          placeholder="যেমন: নাগরিক সনদের জন্য অতিরিক্ত টাকা দাবি"
          {...register("title")}
        />
      </Field>

      <CategoryPicker control={control} error={errors.category?.message} />

      {/* Institution */}
      <Field
        hint="এরপর নির্দিষ্ট প্রতিষ্ঠানের তালিকা দেখানো হবে।"
        id="institution-scope"
        label="প্রতিষ্ঠানের ধরন"
        required
      >
        <Select
          value={institutionScope}
          onValueChange={(value) => {
            if (!value) return;
            setInstitutionScope(value);
            form.setValue("institutionName", "", { shouldValidate: true });
            form.setValue("institutionNameUnknown", false, { shouldValidate: true });
            form.resetField("area");
          }}
        >
          <SelectTrigger
            className={FIELD_TRIGGER}
            id="institution-scope"
            size="lg"
          >
            <SelectValue placeholder="প্রতিষ্ঠানের ধরন বেছে নিন" />
          </SelectTrigger>
          <SelectContent className="rounded-none border-2 border-foreground bg-popover shadow-[4px_4px_0_var(--foreground)]">
            <SelectItem value={LOCAL_SCOPE}>
              ইউনিয়ন পরিষদ / পৌরসভা
            </SelectItem>
            <SelectItem value={OFFICE_SCOPE}>
              উপজেলা / সরকারি অফিস
            </SelectItem>
            <SelectItem value={OTHER_SCOPE}>
              অন্যান্য প্রতিষ্ঠান
            </SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field
        error={errors.institutionName?.message}
        hint="প্রতিষ্ঠানের নাম লিখে তালিকা থেকে বেছে নিন। তালিকায় না থাকলে নিজের ভাষায় নাম লিখতে পারবেন।"
        id="institutionName"
        label="কোন প্রতিষ্ঠান বা অফিসে ঘটনাটি ঘটেছে?"
        required={institutionScope !== OTHER_SCOPE || !institutionNameUnknown}
      >
        {institutionScope === OTHER_SCOPE ? (
          <Input
            aria-describedby={describedBy("institutionName")}
            aria-invalid={!!errors.institutionName}
            aria-required="true"
            className={FIELD_INPUT}
            id="institutionName"
            placeholder="প্রতিষ্ঠানের নাম লিখুন (জানা থাকলে)"
            disabled={institutionNameUnknown}
            {...register("institutionName")}
          />
        ) : (
          <Controller
            control={control}
            name="institutionName"
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value || ""}
                disabled={!institutionScope}
              >
                <SelectTrigger
                  aria-describedby={describedBy("institutionName")}
                  aria-invalid={!!errors.institutionName}
                  className={FIELD_TRIGGER}
                  id="institutionName"
                  size="lg"
                >
                  <SelectValue
                    placeholder={
                      institutionScope
                        ? "প্রতিষ্ঠান নির্বাচন করুন"
                        : "আগে প্রতিষ্ঠানের ধরন বেছে নিন"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-72 rounded-none border-2 border-foreground bg-popover shadow-[4px_4px_0_var(--foreground)]">
                  {institutionSuggestions.map((institution) => (
                    <SelectItem key={institution} value={institution}>
                      {institution}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}
      </Field>

      {institutionScope === OTHER_SCOPE && (
        <label className="flex items-start gap-2.5 border-2 border-border bg-muted/30 px-3 py-3 text-xs text-foreground">
          <input
            className="mt-0.5 size-4 accent-primary"
            type="checkbox"
            {...register("institutionNameUnknown")}
          />
          <span>
            প্রতিষ্ঠানের নাম জানা নেই
            <span className="mt-0.5 block text-[11px] text-muted-foreground">
              নাম না জানলেও অভিযোগ জমা দেওয়া যাবে। বর্ণনায় যতটুকু জানা আছে লিখুন।
            </span>
          </span>
        </label>
      )}

      {/* What this category will ask for — set expectations before step 3. */}
      {scenario && (
        <div className="rounded-none border-2 border-primary/40 bg-primary/10 p-3.5 shadow-[2px_2px_0_var(--foreground)] sm:p-4">
          <div className="flex items-start gap-2.5">
            <span className="grid size-7 shrink-0 place-items-center rounded-none border-2 border-primary/30 bg-background text-primary">
              <SparklesIcon aria-hidden="true" className="size-3.5" />
            </span>
            <div className="min-w-0 space-y-2">
              <p className="text-xs font-bold text-foreground">
                {scenario.title}
              </p>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                {scenario.hint}
              </p>

              <div className="border-t-2 border-primary/20 pt-2">
                <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  <ListChecksIcon aria-hidden="true" className="size-3" />
                  এই ধরনে যা যা লাগবে
                </p>
                <ul className="grid gap-1 min-[520px]:grid-cols-2">
                  {scenario.requirements.map((requirement) => (
                    <li
                      className="flex items-start gap-1.5 text-[11px] leading-relaxed"
                      key={requirement.label}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-1 size-1.5 shrink-0",
                          requirement.required
                            ? "bg-primary"
                            : "bg-muted-foreground/50",
                        )}
                      />
                      <span className="min-w-0 text-foreground">
                        {requirement.label}{" "}
                        <span className="text-muted-foreground">
                          ({requirement.required ? "আবশ্যক" : "ঐচ্ছিক"})
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* The selected institution already identifies the location. */}
      <div className="grid gap-6">
        <Field
          hint="বাংলায় প্রতিষ্ঠানের ভেতরের নির্দিষ্ট কক্ষ, শাখা বা উইং জানা থাকলে লিখুন"
          id="officeName"
          label="শাখা / অফিসের নাম"
          optional
        >
          <Input
            aria-describedby={describedBy("officeName")}
            className={FIELD_INPUT}
            id="officeName"
            placeholder="যেমন: নামজারি শাখা / হিসাব শাখা"
            {...register("officeName")}
          />
        </Field>
      </div>

      {/* Incident date */}
      <Field
        error={errors.incidentDate?.message}
        hint={
          isApproximate
            ? "আনুমানিক মাস বা বছর বেছে নিন"
            : "যেদিন ঘটনাটি ঘটেছে সেই নির্দিষ্ট তারিখটি নির্বাচন করুন"
        }
        id="incidentDate"
        label="ঘটনার তারিখ"
        required
      >
        {!isApproximate ? (
          <div>
            <Controller
              control={control}
              name="incidentDate"
              render={({ field }) => (
                <DatePicker
                  describedBy={describedBy("incidentDate")}
                  hasError={!!errors.incidentDate}
                  id="incidentDate"
                  onChange={(val) => {
                    field.onChange(val);
                    form.setValue("incidentDatePrecision", "exact");
                  }}
                  placeholder="তারিখ নির্বাচন করুন…"
                  value={field.value}
                />
              )}
            />
            <div className="mt-2">
              <button
                type="button"
                onClick={() => {
                  setIsApproximate(true);
                  handleApproxPrecisionChange(approxPrecision);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary underline underline-offset-2 hover:text-foreground cursor-pointer"
              >
                <HelpCircle className="size-3.5" />
                <span>সঠিক দিন মনে নেই? (আনুমানিক সময় দিন)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 rounded-none border-2 border-border bg-card p-3.5 sm:p-4 shadow-[2px_2px_0_var(--foreground)]">
            <div className="flex items-center justify-between gap-2 border-b-2 border-border pb-2.5">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <CalendarIcon className="size-3.5 text-primary" />
                <span>আনুমানিক সময় নির্বাচন</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsApproximate(false);
                  form.setValue("incidentDatePrecision", "exact");
                  form.setValue("incidentDate", "", { shouldValidate: true });
                }}
                className="text-xs font-bold text-primary underline underline-offset-2 hover:text-foreground cursor-pointer"
              >
                ক্যালেন্ডার খুলুন
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleApproxPrecisionChange("month")}
                className={cn(
                  "px-2 py-1.5 text-xs font-bold border-2 transition-all cursor-pointer",
                  approxPrecision === "month"
                    ? "border-foreground bg-primary text-primary-foreground shadow-[2px_2px_0_var(--foreground)]"
                    : "border-border bg-background text-foreground hover:border-foreground",
                )}
              >
                আনুমানিক মাস
              </button>
              <button
                type="button"
                onClick={() => handleApproxPrecisionChange("year")}
                className={cn(
                  "px-2 py-1.5 text-xs font-bold border-2 transition-all cursor-pointer",
                  approxPrecision === "year"
                    ? "border-foreground bg-primary text-primary-foreground shadow-[2px_2px_0_var(--foreground)]"
                    : "border-border bg-background text-foreground hover:border-foreground",
                )}
              >
                আনুমানিক বছর
              </button>
              <button
                type="button"
                onClick={() => handleApproxPrecisionChange("unknown")}
                className={cn(
                  "px-2 py-1.5 text-xs font-bold border-2 transition-all cursor-pointer",
                  approxPrecision === "unknown"
                    ? "border-foreground bg-primary text-primary-foreground shadow-[2px_2px_0_var(--foreground)]"
                    : "border-border bg-background text-foreground hover:border-foreground",
                )}
              >
                সময় জানা নেই
              </button>
            </div>

            {approxPrecision === "month" && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    মাস
                  </label>
                  <Select
                    value={approxMonth}
                    onValueChange={(m) => {
                      if (!m) return;
                      setApproxMonth(m);
                      form.setValue("incidentDate", `${approxYear}-${m}-01`, {
                        shouldValidate: true,
                      });
                    }}
                  >
                    <SelectTrigger className={FIELD_TRIGGER}>
                      <SelectValue placeholder="মাস বেছে নিন" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-2 border-foreground bg-popover shadow-[4px_4px_0_var(--foreground)] max-h-56">
                      {BN_MONTHS.map((mo) => (
                        <SelectItem key={mo.value} value={mo.value}>
                          {mo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    সাল / বছর
                  </label>
                  <Select
                    value={approxYear}
                    onValueChange={(y) => {
                      if (!y) return;
                      setApproxYear(y);
                      form.setValue("incidentDate", `${y}-${approxMonth}-01`, {
                        shouldValidate: true,
                      });
                    }}
                  >
                    <SelectTrigger className={FIELD_TRIGGER}>
                      <SelectValue placeholder="সাল বেছে নিন" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-2 border-foreground bg-popover shadow-[4px_4px_0_var(--foreground)] max-h-56">
                      {YEAR_OPTIONS.map((yr) => (
                        <SelectItem key={yr.value} value={yr.value}>
                          {yr.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {approxPrecision === "year" && (
              <div className="pt-1">
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  সাল / বছর
                </label>
                <Select
                  value={approxYear}
                  onValueChange={(y) => {
                    if (!y) return;
                    setApproxYear(y);
                    form.setValue("incidentDate", `${y}-01-01`, {
                      shouldValidate: true,
                    });
                  }}
                >
                  <SelectTrigger className={FIELD_TRIGGER}>
                    <SelectValue placeholder="সাল বেছে নিন" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-2 border-foreground bg-popover shadow-[4px_4px_0_var(--foreground)] max-h-56">
                    {YEAR_OPTIONS.map((yr) => (
                      <SelectItem key={yr.value} value={yr.value}>
                        {yr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {approxPrecision === "unknown" && (
              <p className="text-xs text-muted-foreground pt-1 leading-relaxed">
                নির্দিষ্ট সময় মনে না থাকলে সাধারণ আনুমানিক সময় হিসেবে সংরক্ষণ
                করা হবে।
              </p>
            )}
          </div>
        )}
      </Field>
    </div>
  );
}
