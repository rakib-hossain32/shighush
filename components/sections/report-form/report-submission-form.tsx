"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangleIcon,
  Loader2Icon,
  PaperclipIcon,
  SendIcon,
  ShieldAlertIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  DATE_PRECISIONS,
  MONEY_TYPES,
  REPORT_CATEGORIES,
  REPORT_CATEGORY_META,
  MONEY_TYPE_META,
  DATE_PRECISION_META,
} from "@/lib/domain/enums";
import { AREAS } from "@/lib/domain/geo";
import { reportSubmitSchema, type ReportSubmitInput } from "@/lib/domain/schemas";
import { detectPii, hasBlockingPii } from "@/lib/domain/pii";

/**
 * Complete report submission form with:
 * - Real-time PII detection
 * - Progressive disclosure (money/accused fields optional)
 * - Zod validation via react-hook-form
 * - Honeypot spam protection
 * - File upload UI (backend integration pending)
 */

export function ReportSubmissionForm() {
  const [showOptional, setShowOptional] = useState(false);
  const [showMoney, setShowMoney] = useState(false);
  const [showAccused, setShowAccused] = useState(false);
  
  const form = useForm<ReportSubmitInput>({
    resolver: zodResolver(reportSubmitSchema) as any,
    defaultValues: {
      category: "",
      area: "",
      incidentDatePrecision: "exact",
      moneyType: "unknown",
      enableAnonymousInbox: false,
      contactReason: "", // Honeypot
    },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const narrative = watch("narrative") || "";
  const piiFindings = detectPii(narrative);
  const hasPii = hasBlockingPii(narrative);

  const onSubmit = async (data: ReportSubmitInput) => {
    // This will be replaced with actual server action in Phase 2
    console.log("Submitting report:", data);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert("Mock submission - connect to API in Phase 2");
  };

  return (
    <form
      className="grid gap-6 border-2 border-foreground bg-card p-6 shadow-[6px_6px_0_var(--foreground)] sm:p-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Institution */}
      <div className="grid gap-2">
        <Label className="text-sm font-bold" htmlFor="institutionName">
          কোন প্রতিষ্ঠান বা দফতর? <span className="text-destructive">*</span>
        </Label>
        <Input
          id="institutionName"
          placeholder="যেমন: উপজেলা ভূমি অফিস, শিবচর"
          {...register("institutionName")}
          aria-invalid={!!errors.institutionName}
        />
        {errors.institutionName && (
          <p className="text-xs text-destructive">{errors.institutionName.message}</p>
        )}
      </div>

      {/* Category & Area */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label className="text-sm font-bold" htmlFor="category">
            অভিযোগের ধরন <span className="text-destructive">*</span>
          </Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="বেছে নিন" />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {REPORT_CATEGORY_META[category].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && (
            <p className="text-xs text-destructive">{errors.category.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label className="text-sm font-bold" htmlFor="area">
            ঘটনার এলাকা <span className="text-destructive">*</span>
          </Label>
          <Controller
            control={control}
            name="area"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger id="area">
                  <SelectValue placeholder="বেছে নিন" />
                </SelectTrigger>
                <SelectContent>
                  {AREAS.map((area) => (
                    <SelectItem key={area.slug} value={area.slug}>
                      {area.nameBn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.area && (
            <p className="text-xs text-destructive">{errors.area.message}</p>
          )}
        </div>
      </div>

      {/* Office Name (optional) */}
      <div className="grid gap-2">
        <Label className="text-sm font-bold" htmlFor="officeName">
          শাখা বা অফিসের নাম (যদি থাকে)
        </Label>
        <Input
          id="officeName"
          placeholder="যেমন: নামজারি শাখা"
          {...register("officeName")}
        />
      </div>

      {/* Incident Date */}
      <div className="grid gap-2">
        <Label className="text-sm font-bold" htmlFor="incidentDate">
          ঘটনার তারিখ বা আনুমানিক সময় <span className="text-destructive">*</span>
        </Label>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <Input
            id="incidentDate"
            type="date"
            {...register("incidentDate")}
            aria-invalid={!!errors.incidentDate}
          />
          <Controller
            control={control}
            name="incidentDatePrecision"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || "exact"} defaultValue="exact">
                <SelectTrigger className="sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATE_PRECISIONS.map((precision) => (
                    <SelectItem key={precision} value={precision}>
                      {DATE_PRECISION_META[precision].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        {errors.incidentDate && (
          <p className="text-xs text-destructive">{errors.incidentDate.message}</p>
        )}
      </div>

      {/* Narrative with PII Detection */}
      <div className="grid gap-2">
        <Label className="text-sm font-bold" htmlFor="narrative">
          কী ঘটেছে? <span className="text-destructive">*</span>
        </Label>
        <Textarea
          className="min-h-40"
          id="narrative"
          placeholder="ঘটনাটি সংক্ষেপে, শান্ত ও নিরপেক্ষ ভাষায় লিখুন। নিজের ফোন, NID, বা অপ্রয়োজনীয় ব্যক্তিগত তথ্য দেবেন না।"
          {...register("narrative")}
          aria-invalid={!!errors.narrative}
        />
        {errors.narrative && (
          <p className="text-xs text-destructive">{errors.narrative.message}</p>
        )}

        {/* PII Warnings */}
        {piiFindings.length > 0 && (
          <div className="border-l-4 border-destructive bg-destructive/10 p-4">
            <div className="flex items-start gap-3">
              <ShieldAlertIcon className="mt-0.5 size-5 shrink-0 text-destructive" />
              <div>
                <p className="font-bold text-destructive">
                  ব্যক্তিগত তথ্য শনাক্ত হয়েছে
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  {piiFindings.map((finding, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <AlertTriangleIcon className="size-3.5" />
                      {finding.label}: &quot;{finding.match}&quot;
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  মডারেটর এগুলো সরিয়ে দেবেন, তবে আগেই বাদ দিলে review দ্রুত হবে।
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Optional Fields Toggle */}
      {!showOptional && (
        <Button
          className="w-full"
          onClick={() => setShowOptional(true)}
          type="button"
          variant="outline"
        >
          + অতিরিক্ত তথ্য যোগ করুন (ঐচ্ছিক)
        </Button>
      )}

      {showOptional && (
        <div className="grid gap-6 border-t border-border pt-6">
          {/* Money Section */}
          {!showMoney && (
            <Button
              onClick={() => setShowMoney(true)}
              type="button"
              variant="ghost"
            >
              + টাকা-সংক্রান্ত তথ্য যোগ করুন
            </Button>
          )}

          {showMoney && (
            <div className="grid gap-4 rounded border border-border bg-muted p-4">
              <h3 className="font-bold">টাকা-সংক্রান্ত তথ্য</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="moneyAmount">টাকার পরিমাণ</Label>
                  <Input
                    id="moneyAmount"
                    placeholder="যেমন: ২৫০০"
                    type="number"
                    {...register("moneyAmount", { valueAsNumber: true })}
                  />
                  {errors.moneyAmount && (
                    <p className="text-xs text-destructive">
                      {errors.moneyAmount.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="moneyType">চাওয়া না দেওয়া?</Label>
                  <Controller
                    control={control}
                    name="moneyType"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value || "unknown"} defaultValue="unknown">
                        <SelectTrigger id="moneyType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MONEY_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {MONEY_TYPE_META[type].label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="officialFee">সরকারি নির্ধারিত ফি (যদি জানা থাকে)</Label>
                <Input
                  id="officialFee"
                  placeholder="যেমন: ১১৫০"
                  type="number"
                  {...register("officialFee", { valueAsNumber: true })}
                />
              </div>
            </div>
          )}

          {/* Accused Section */}
          {!showAccused && (
            <Button
              onClick={() => setShowAccused(true)}
              type="button"
              variant="ghost"
            >
              + অভিযুক্ত ব্যক্তির তথ্য যোগ করুন
            </Button>
          )}

          {showAccused && (
            <div className="grid gap-4 rounded border border-border bg-muted p-4">
              <h3 className="font-bold">অভিযুক্ত ব্যক্তির তথ্য</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="accusedDesignation">পদবি বা দফতর</Label>
                  <Input
                    id="accusedDesignation"
                    placeholder="যেমন: অফিস সহকারী"
                    {...register("accusedDesignation")}
                  />
                  {errors.accusedDesignation && (
                    <p className="text-xs text-destructive">
                      {errors.accusedDesignation.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="accusedName">নাম (শুধু তখনই দিন যদি নিশ্চিত হন)</Label>
                  <Input
                    id="accusedName"
                    placeholder="ঐচ্ছিক"
                    {...register("accusedName")}
                  />
                  {errors.accusedName && (
                    <p className="text-xs text-destructive">
                      {errors.accusedName.message}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                §৭ নীতি: নাম প্রকাশ করার আগে মডারেটর যাচাই করবেন। শুধু পদবি দিলেও রিপোর্ট কার্যকর।
              </p>
            </div>
          )}

          {/* Service Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="serviceName">সেবার নাম</Label>
              <Input
                id="serviceName"
                placeholder="যেমন: নামজারি"
                {...register("serviceName")}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="referenceNumber">রেফারেন্স নম্বর</Label>
              <Input
                id="referenceNumber"
                placeholder="যেমন: আবেদন নম্বর"
                {...register("referenceNumber")}
              />
            </div>
          </div>
        </div>
      )}

      {/* Evidence Upload (UI only - backend pending) */}
      <div className="grid gap-2">
        <Label className="text-sm font-bold" htmlFor="evidence">
          প্রমাণ সংযুক্ত করুন
        </Label>
        <label
          className="flex cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed border-border bg-muted p-8 text-center transition hover:border-primary"
          htmlFor="evidence"
        >
          <PaperclipIcon className="size-8 text-primary" />
          <div>
            <p className="font-bold">ছবি, নথি বা অডিও যুক্ত করুন</p>
            <p className="mt-1 text-sm text-muted-foreground">
              ব্যক্তিগত তথ্য আগে ঢেকে দিন
            </p>
          </div>
        </label>
        <Input
          accept="image/*,audio/*,video/*,.pdf,.doc,.docx"
          className="hidden"
          id="evidence"
          multiple
          type="file"
        />
        <p className="text-xs text-muted-foreground">
          ফাইল আপলোড API integration Phase 2-এ যুক্ত হবে
        </p>
      </div>

      {/* Anonymous Inbox */}
      <label className="flex items-start gap-3 text-sm">
        <input
          className="mt-1 size-4 accent-primary"
          type="checkbox"
          {...register("enableAnonymousInbox")}
        />
        <span>
          গোপন inbox চালু করুন — মডারেটর পরিচয় না জেনেই আপনার সঙ্গে অতিরিক্ত
          তথ্য চাইতে পারবেন
        </span>
      </label>

      {/* Honeypot (hidden) */}
      <input
        className="hidden"
        tabIndex={-1}
        type="text"
        {...register("contactReason")}
      />

      {/* Consent Checkboxes */}
      <div className="grid gap-3 border-t border-border pt-6">
        <label className="flex items-start gap-3 text-sm">
          <input
            className="mt-1 size-4 accent-primary"
            type="checkbox"
            {...register("truthAcknowledged")}
          />
          <span>
            আমার জানা অনুযায়ী এই তথ্য সঠিক এবং আমি ব্যক্তিগত গোপন তথ্য প্রকাশ
            করিনি। <span className="text-destructive">*</span>
          </span>
        </label>
        {errors.truthAcknowledged && (
          <p className="text-xs text-destructive">{errors.truthAcknowledged.message}</p>
        )}

        <label className="flex items-start gap-3 text-sm">
          <input
            className="mt-1 size-4 accent-primary"
            type="checkbox"
            {...register("policyAcknowledged")}
          />
          <span>
            আমি প্রকাশ ও গোপনীয়তা নীতি পড়েছি এবং মেনে নিচ্ছি।{" "}
            <span className="text-destructive">*</span>
          </span>
        </label>
        {errors.policyAcknowledged && (
          <p className="text-xs text-destructive">
            {errors.policyAcknowledged.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        className="h-12 w-full shadow-[4px_4px_0_var(--foreground)]"
        disabled={isSubmitting || hasPii}
        type="submit"
      >
        {isSubmitting ? (
          <>
            <Loader2Icon className="animate-spin" />
            জমা হচ্ছে…
          </>
        ) : (
          <>
            <SendIcon />
            নিরাপদে জমা দিন
          </>
        )}
      </Button>

      {hasPii && (
        <p className="text-center text-sm text-destructive">
          ব্যক্তিগত তথ্য বাদ না দিলে জমা দিতে পারবেন না
        </p>
      )}
    </form>
  );
}
