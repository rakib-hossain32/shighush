"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  CheckIcon,
  CopyIcon,
  FileTextIcon,
  Loader2Icon,
  LockIcon,
  SendIcon,
  TriangleAlertIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { submitReportAction } from "@/app/(public)/report/new/actions";
import {
  reportSubmitSchema,
  type ReportSubmitInput,
} from "@/lib/domain/schemas";
import { type ReportCategory } from "@/lib/domain/enums";
import { hasBlockingPii } from "@/lib/domain/pii";

import {
  ReportFormContext,
  FORM_STEPS,
  CATEGORY_SCENARIOS,
  FIELD_LABELS,
  STEP_FIELDS,
} from "./form-context";
import { StepProgress } from "./step-progress";
import { StepContext } from "./step-context";
import { StepNarrative } from "./step-narrative";
import { StepDetails } from "./step-details";
import { StepReview } from "./step-review";

/**
 * `scrollIntoView` is a script API — the `scroll-behavior: auto` that `globals.css`
 * forces under `prefers-reduced-motion` does not govern it, so it has to be checked here.
 */
function scrollBehavior(): ScrollBehavior {
  if (typeof window === "undefined") return "auto";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

export function ReportSubmissionForm() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState<string>("");
  const [secretToken, setSecretToken] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  /** Gates the error summary: only worth showing once the reporter has tried to move on. */
  const [attemptedAdvance, setAttemptedAdvance] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<ReportSubmitInput>({
    resolver: zodResolver(reportSubmitSchema) as Resolver<ReportSubmitInput>,
    mode: "onTouched",
    defaultValues: {
      institutionName: "",
      officeName: "",
      category: undefined,
      area: undefined,
      incidentDate: "",
      incidentDatePrecision: "exact",
      narrative: "",
      moneyAmount: undefined,
      moneyType: "unknown",
      officialFee: undefined,
      accusedName: "",
      accusedDesignation: "",
      serviceName: "",
      referenceNumber: "",
      enableAnonymousInbox: false,
      truthAcknowledged: undefined,
      policyAcknowledged: undefined,
      contactReason: "",
    },
  });

  const {
    watch,
    trigger,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isDirty, isSubmitting: formSubmitting },
  } = form;

  const selectedCategory = watch("category") as ReportCategory | undefined;
  const narrative = watch("narrative") || "";
  const hasPii = hasBlockingPii(narrative);

  const scenario = selectedCategory
    ? CATEGORY_SCENARIOS[selectedCategory]
    : null;
  const needsMoney = scenario?.needsMoney ?? false;

  /* ---------------------------------------------------------------- *
   * Navigation feedback
   * ---------------------------------------------------------------- */

  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({
      behavior: scrollBehavior(),
      block: "start",
    });
  }, []);

  /**
   * Move the viewport and the keyboard to the first thing that needs attention.
   *
   * Resolves the field by id. Every control is given an id matching its schema key —
   * including the two `role="radiogroup"` wrappers, which have no single input to point
   * at. That is deliberate rather than going through RHF's `setFocus`: several controls
   * here are Base UI popups or `<Controller>`-driven radio groups, none of which reliably
   * carry a focusable RHF ref.
   */
  const focusFirstError = useCallback(
    (names: string[]) => {
      const target = names
        .map((name) => document.getElementById(name))
        .find((el): el is HTMLElement => el !== null);

      if (!target) {
        scrollToForm();
        return;
      }

      target.scrollIntoView({ behavior: scrollBehavior(), block: "center" });

      const focusable = target.matches("input, textarea, select, button")
        ? target
        : target.querySelector<HTMLElement>(
            "input:not([type='hidden']), textarea, select, button, [tabindex]:not([tabindex='-1'])",
          );
      // preventScroll: the scrollIntoView above already placed it, centred.
      focusable?.focus({ preventScroll: true });
    },
    [scrollToForm],
  );

  /* ---------------------------------------------------------------- *
   * Step validation
   * ---------------------------------------------------------------- */

  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    if (currentStep === 0) {
      return trigger([
        "institutionName",
        "category",
        "area",
        "incidentDate",
        "incidentDatePrecision",
        "officeName",
      ]);
    }
    if (currentStep === 1) {
      const isValid = await trigger(["narrative"]);
      if (hasPii) {
        return false;
      }
      return isValid;
    }
    if (currentStep === 2) {
      const values = getValues();
      const fieldsToValidate: (keyof ReportSubmitInput)[] = [];
      let hasManualErrors = false;

      // Financial scenarios: moneyAmount is REQUIRED
      if (needsMoney) {
        if (!values.moneyAmount && values.moneyAmount !== 0) {
          form.setError("moneyAmount", {
            type: "manual",
            message: "এই ধরনের অভিযোগে ঘুষ/চাঁদার পরিমাণ অবশ্যই দিতে হবে",
          });
          hasManualErrors = true;
        } else {
          fieldsToValidate.push("moneyAmount");
        }
        if (!values.moneyType || values.moneyType === "unknown") {
          form.setError("moneyType", {
            type: "manual",
            message: "টাকা চাওয়া হয়েছে না দেওয়া হয়েছে, তা বেছে নিন",
          });
          hasManualErrors = true;
        } else {
          fieldsToValidate.push("moneyType");
        }
      } else {
        // Non-financial: only validate if user actually entered something
        if (values.moneyAmount !== undefined && values.moneyAmount !== null) {
          fieldsToValidate.push("moneyAmount", "moneyType");
        }
      }

      if (values.officialFee !== undefined && values.officialFee !== null) {
        fieldsToValidate.push("officialFee");
      }
      if (values.accusedName || values.accusedDesignation) {
        fieldsToValidate.push("accusedName", "accusedDesignation");
      }
      if (values.serviceName) {
        fieldsToValidate.push("serviceName");
      }
      if (values.referenceNumber) {
        fieldsToValidate.push("referenceNumber");
      }

      if (hasManualErrors) return false;
      if (fieldsToValidate.length > 0) {
        return trigger(fieldsToValidate);
      }
      return true;
    }
    return true;
  }, [currentStep, trigger, getValues, hasPii, needsMoney, form]);

  /** Errors on the current step, in the order the step presents them. */
  const stepErrors = useMemo(() => {
    return (STEP_FIELDS[currentStep] ?? [])
      .filter((name) => Boolean(errors[name]))
      .map((name) => ({
        name: name as string,
        label: FIELD_LABELS[name] ?? (name as string),
        message: String(errors[name]?.message ?? ""),
      }));
  }, [currentStep, errors]);

  /** Step 2 can also be blocked by PII, which is not a field-level error. */
  const blockedByPii = currentStep === 1 && hasPii;
  const showErrorSummary =
    attemptedAdvance && (stepErrors.length > 0 || blockedByPii);

  const goNext = useCallback(async () => {
    setAttemptedAdvance(true);
    const isValid = await validateCurrentStep();

    if (!isValid) {
      // Read errors after validation has settled them.
      const failing = (STEP_FIELDS[currentStep] ?? [])
        .filter((name) => Boolean(form.formState.errors[name]))
        .map(String);
      focusFirstError(failing.length > 0 ? failing : ["narrative"]);
      return;
    }

    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
      setAttemptedAdvance(false);
      scrollToForm();
    }
  }, [currentStep, validateCurrentStep, focusFirstError, scrollToForm, form]);

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      setAttemptedAdvance(false);
      scrollToForm();
    }
  }, [currentStep, scrollToForm]);

  const goToStep = useCallback(
    async (stepIndex: number) => {
      if (stepIndex === currentStep) return;

      if (stepIndex < currentStep) {
        setCurrentStep(stepIndex);
        setAttemptedAdvance(false);
        scrollToForm();
        return;
      }
      // Forward jumps are only allowed one step at a time, and only if valid.
      if (stepIndex === currentStep + 1) {
        await goNext();
      }
    },
    [currentStep, goNext, scrollToForm],
  );

  /* ---------------------------------------------------------------- *
   * Unsaved-work guard
   *
   * Warns before the tab closes, and deliberately stores NOTHING. This is an anonymous
   * whistleblowing form: a narrative naming a public official must not be left sitting in
   * localStorage on a phone that may be shared, borrowed, or seized.
   * ---------------------------------------------------------------- */

  useEffect(() => {
    if (isSuccess || !isDirty) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, isSuccess]);

  /* ---------------------------------------------------------------- *
   * Submit
   * ---------------------------------------------------------------- */

  const onSubmit = async (data: ReportSubmitInput) => {
    if (hasPii) return;

    setServerError(null);
    setIsSubmitting(true);

    try {
      const result = await submitReportAction(data);
      if (result.success && result.caseId) {
        toast.success("অভিযোগ সফলভাবে জমা হয়েছে!", {
          description: `ট্র্যাকিং কোড: ${result.caseId} — নিরাপদে সংরক্ষণ করুন।`,
          duration: 8000,
        });
        setTrackingId(result.caseId);
        if (result.secretToken) {
          setSecretToken(result.secretToken);
        }
        setIsSuccess(true);
      } else {
        const errMsg =
          result.error || "অভিযোগ জমা দেওয়া যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।";
        setServerError(errMsg);
        toast.error("অভিযোগ জমা ব্যর্থ হয়েছে", { description: errMsg });
      }
    } catch {
      const errMsg = "সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করুন।";
      setServerError(errMsg);
      toast.error("নেটওয়ার্ক সমস্যা", { description: errMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = useCallback(() => {
    setAttemptedAdvance(true);
    const failing = (STEP_FIELDS[currentStep] ?? [])
      .filter((name) => Boolean(form.formState.errors[name]))
      .map(String);
    focusFirstError(failing);
  }, [currentStep, focusFirstError, form]);

  const handleCopyTrackingId = async () => {
    if (!trackingId) return;
    try {
      await navigator.clipboard.writeText(trackingId);
      setCopied(true);
      toast.success("Case ID কপি করা হয়েছে!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleCopySecretToken = async () => {
    if (!secretToken) return;
    try {
      await navigator.clipboard.writeText(secretToken);
      setTokenCopied(true);
      toast.success("Secret Token কপি করা হয়েছে!");
      setTimeout(() => setTokenCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const contextValue = useMemo(
    () => ({
      form,
      currentStep,
      selectedCategory,
      scenario,
      needsMoney,
      goToStep,
    }),
    [form, currentStep, selectedCategory, scenario, needsMoney, goToStep],
  );

  /* ---------------------------------------------------------------- *
   * Success view
   * ---------------------------------------------------------------- */

  if (isSuccess) {
    return (
      <div className="space-y-6 rounded-none border-2 border-foreground bg-card p-5 text-center shadow-[6px_6px_0_var(--foreground)] sm:p-10">
        <div className="mx-auto grid size-14 place-items-center rounded-none border-2 border-emerald-600 bg-emerald-500/10 text-emerald-700 shadow-[2px_2px_0_var(--foreground)] dark:text-emerald-300">
          <CheckCircle2Icon aria-hidden="true" className="size-8" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
            SUBMISSION CONFIRMED
          </span>
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            আপনার অভিযোগ সফলভাবে গৃহীত হয়েছে
          </h2>
          <p className="mx-auto max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
            তথ্যটি আমাদের এনক্রিপ্টেড মডারেশন কিউতে পাঠানো হয়েছে। একজন স্বাধীন মডারেটর
            ব্যক্তিগত তথ্যের সুরক্ষা নিশ্চিত করে এটি পর্যালোচনা করবেন।
          </p>
        </div>

        {/* Tracking Codes Vault Card */}
        <div className="mx-auto max-w-md space-y-4 rounded-none border-2 border-foreground bg-muted/30 p-4 text-left shadow-[4px_4px_0_var(--foreground)] sm:p-5">
          {/* Case ID */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              ১. আপনার Case ID (ট্র্যাকিং কোড)
            </p>
            <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 rounded-none border-2 border-foreground bg-background p-2.5">
              <span className="select-all  text-lg font-extrabold tracking-wider text-foreground">
                {trackingId}
              </span>
              <Button
                className="h-8 cursor-pointer gap-1.5 rounded-none border-2 border-foreground bg-background text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                onClick={handleCopyTrackingId}
                size="sm"
                type="button"
                variant="outline"
              >
                {copied ? (
                  <>
                    <CheckIcon aria-hidden="true" className="size-3.5 text-emerald-600" />
                    কপি হয়েছে
                  </>
                ) : (
                  <>
                    <CopyIcon aria-hidden="true" className="size-3.5" />
                    কপি করুন
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Secret Token */}
          {secretToken && (
            <div>
              <p className=" text-[11px] font-bold uppercase tracking-wider text-destructive">
                ২. আপনার Secret Token (এককালীন গোপন চাবি)
              </p>
              <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 rounded-none border-2 border-foreground bg-background p-2.5">
                <span className="max-w-60 select-all break-all font-mono text-xs font-semibold text-foreground">
                  {secretToken}
                </span>
                <Button
                  className="h-8 cursor-pointer gap-1.5 rounded-none border-2 border-foreground bg-background text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                  onClick={handleCopySecretToken}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {tokenCopied ? (
                    <>
                      <CheckIcon aria-hidden="true" className="size-3.5 text-emerald-600" />
                      কপি হয়েছে
                    </>
                  ) : (
                    <>
                      <CopyIcon aria-hidden="true" className="size-3.5" />
                      কপি করুন
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          <p className="text-[11px] leading-relaxed text-muted-foreground">
            ⚠️ এই দুটি তথ্য কোথাও নিরাপদ স্থানে সংরক্ষণ করুন। ট্র্যাকিং পেজে স্ট্যাটাস দেখতে এই দুটি তথ্যই প্রয়োজন হবে।
          </p>
        </div>

        {/* What happens next */}
        <ol className="mx-auto max-w-md space-y-2 rounded-none border-2 border-border bg-background p-4 text-left">
          <li className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            এরপর কী হবে
          </li>
          {[
            "একজন স্বাধীন মডারেটর তথ্যগুলো পর্যালোচনা করবেন।",
            "অনিচ্ছাকৃত ব্যক্তিগত তথ্য থাকলে তা মুছে দেওয়া হবে।",
            "যাচাই শেষে নথিটি পাবলিক আর্কাইভে প্রকাশিত হবে।",
          ].map((line, idx) => (
            <li className="flex items-start gap-2 text-xs text-foreground" key={line}>
              <span className="grid size-4 shrink-0 place-items-center border border-foreground bg-background text-[9px] font-bold">
                {(idx + 1).toLocaleString("bn-BD")}
              </span>
              <span className="leading-relaxed text-muted-foreground">{line}</span>
            </li>
          ))}
        </ol>

        <div className="flex flex-col items-stretch justify-center gap-3 pt-2 min-[420px]:flex-row min-[420px]:items-center">
          {secretToken ? (
            <Button
              asChild
              className="cursor-pointer rounded-none border-2 border-foreground bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-[2px_2px_0_var(--foreground)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            >
              <Link href={`/track/${encodeURIComponent(trackingId)}?token=${encodeURIComponent(secretToken)}`}>
                এখনই স্ট্যাটাস ট্র্যাক করুন
              </Link>
            </Button>
          ) : null}

          <Button
            className="cursor-pointer rounded-none border-2 border-foreground bg-background px-4 py-2 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            onClick={() => {
              reset();
              setCurrentStep(0);
              setIsSuccess(false);
              setCopied(false);
              setTokenCopied(false);
              setSecretToken("");
              setTrackingId("");
              setAttemptedAdvance(false);
            }}
            variant="outline"
          >
            আরেকটি অভিযোগ দাখিল করুন
          </Button>

          <Button
            asChild
            className="cursor-pointer rounded-none border-2 border-foreground bg-background px-4 py-2 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            variant="outline"
          >
            <Link href="/reports">সকল রিপোর্ট দেখুন</Link>
          </Button>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- *
   * Wizard
   * ---------------------------------------------------------------- */

  return (
    <ReportFormContext.Provider value={contextValue}>
      <form
        className="scroll-mt-24 rounded-none border-2 border-foreground bg-card shadow-[6px_6px_0_var(--foreground)] sm:scroll-mt-28 lg:scroll-mt-32"
        noValidate
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        ref={formRef}
      >
        {/* Form Header */}
        <div className="border-b-2 border-foreground bg-muted/20 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="grid size-8 sm:size-9 shrink-0 place-items-center rounded-none border-2 border-foreground bg-background text-primary shadow-[2px_2px_0_var(--foreground)]">
                <FileTextIcon aria-hidden="true" className="size-4" />
              </span>
              <div className="min-w-0">
                <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-primary block leading-none mb-0.5">
                  WHISTLEBLOWER DESK
                </span>
                <h2 className="font-heading text-sm sm:text-base font-bold text-foreground truncate">
                  অভিযোগের বিবরণ ফরম
                </h2>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 rounded-none border border-foreground bg-background px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-foreground shadow-[2px_2px_0_var(--foreground)]">
              <LockIcon aria-hidden="true" className="size-3 text-primary" />
              <span className="hidden xs:inline">১০০% বেনামি ও সুরক্ষিত</span>
              <span className="xs:hidden">বেনামি</span>
            </div>
          </div>
        </div>

        <StepProgress currentStep={currentStep} onStepSelect={goToStep} />

        {/* Step Body */}
        <div className="p-4 sm:min-h-104 sm:p-7">
          {serverError && (
            <div
              className="mb-5 rounded-none border-2 border-destructive bg-destructive/10 p-3.5 shadow-[2px_2px_0_var(--foreground)]"
              role="alert"
            >
              <div className="flex items-start gap-2.5">
                <TriangleAlertIcon
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-destructive"
                />
                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-bold text-destructive">
                    অভিযোগ সাবমিট ব্যর্থ হয়েছে
                  </p>
                  <p className="text-[11px] leading-relaxed text-destructive/90">
                    {serverError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {showErrorSummary && (
            <div
              className="mb-5 rounded-none border-2 border-destructive bg-destructive/10 p-3.5 shadow-[2px_2px_0_var(--foreground)]"
              role="alert"
            >
              <div className="flex items-start gap-2.5">
                <TriangleAlertIcon
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-destructive"
                />
                <div className="min-w-0 space-y-1.5">
                  <p className="text-xs font-bold text-destructive">
                    এগিয়ে যাওয়ার আগে নিচের বিষয়গুলো ঠিক করুন
                  </p>
                  <ul className="space-y-1">
                    {blockedByPii && (
                      <li className="text-[11px] leading-relaxed text-destructive/90">
                        বিবরণে ব্যক্তিগত তথ্য (ফোন, NID বা ইমেইল) রয়ে গেছে — সেটি মুছে দিন।
                      </li>
                    )}
                    {stepErrors.map((item) => (
                      <li key={item.name}>
                        <button
                          className="cursor-pointer text-left text-[11px] leading-relaxed text-destructive/90 underline underline-offset-2 hover:text-destructive"
                          onClick={() => focusFirstError([item.name])}
                          type="button"
                        >
                          <span className="font-bold">{item.label}:</span>{" "}
                          {item.message}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {currentStep === 0 && <StepContext />}
          {currentStep === 1 && <StepNarrative />}
          {currentStep === 2 && <StepDetails />}
          {currentStep === 3 && <StepReview />}
        </div>

        {/* Navigation — sticks to the bottom of the viewport on a phone so Back/Next
            stay reachable part-way through a long step. Static from `sm` up. */}
        <div className="sticky bottom-0 z-10 flex items-center justify-between gap-3 border-t-2 border-foreground bg-card p-4 sm:static sm:bg-muted/20 sm:p-6">
          {currentStep > 0 ? (
            <Button
              className="cursor-pointer gap-2 rounded-none border-2 border-foreground bg-background text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
              onClick={goBack}
              type="button"
              variant="outline"
            >
              <ArrowLeftIcon aria-hidden="true" className="size-4" />
              <span className="hidden min-[380px]:inline">পূর্ববর্তী ধাপ</span>
              <span className="min-[380px]:hidden">পূর্ববর্তী</span>
            </Button>
          ) : (
            <div />
          )}

          {currentStep < FORM_STEPS.length - 1 ? (
            <Button
              className="cursor-pointer gap-2 rounded-none border-2 border-foreground bg-primary text-xs font-bold text-primary-foreground shadow-[2px_2px_0_var(--foreground)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
              onClick={goNext}
              type="button"
            >
              পরবর্তী ধাপ
              <ArrowRightIcon aria-hidden="true" className="size-4" />
            </Button>
          ) : (
            <Button
              className="cursor-pointer gap-2 rounded-none border-2 border-foreground bg-primary text-xs font-bold text-primary-foreground shadow-[2px_2px_0_var(--foreground)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
              disabled={isSubmitting || formSubmitting || hasPii}
              type="submit"
            >
              {isSubmitting || formSubmitting ? (
                <>
                  <Loader2Icon aria-hidden="true" className="size-4 animate-spin" />
                  জমা দেওয়া হচ্ছে…
                </>
              ) : (
                <>
                  <SendIcon aria-hidden="true" className="size-4" />
                  <span className="hidden min-[380px]:inline">
                    নিরাপদে রিপোর্ট জমা দিন
                  </span>
                  <span className="min-[380px]:hidden">জমা দিন</span>
                </>
              )}
            </Button>
          )}
        </div>

        {/* Blocking PII on the final step — the submit button is disabled, so say why. */}
        {hasPii && currentStep === 3 && (
          <div
            className="rounded-none border-t-2 border-destructive bg-destructive/10 p-3 text-center"
            role="alert"
          >
            <p className="text-xs font-bold text-destructive">
              ⚠ বিবরণে ব্যক্তিগত তথ্য চিহ্নিত হয়েছে। অনুগ্রহ করে{" "}
              <button
                className="cursor-pointer underline underline-offset-2"
                onClick={() => goToStep(1)}
                type="button"
              >
                ধাপ ২-এ ফিরে গিয়ে
              </button>{" "}
              ব্যক্তিগত তথ্য মুছে দিন।
            </p>
          </div>
        )}
      </form>
    </ReportFormContext.Provider>
  );
}
