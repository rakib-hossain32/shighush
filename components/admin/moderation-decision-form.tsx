"use client";

import { useActionState, useState } from "react";
import { BadgeCheck, Loader2, Send, ShieldCheck } from "lucide-react";
import {
  submitModerationDecision,
  type ModerationState,
} from "@/app/(dashboard)/admin/reports/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  VERIFICATION_LEVELS,
  VERIFICATION_LEVEL_META,
  selectOptions,
} from "@/lib/domain/enums";
import { isReviewable } from "@/lib/domain/moderation";
import { cn } from "@/lib/utils";
import type { ModerationReport } from "@/services/_shared/types";

export function ModerationDecisionForm({
  report,
  canRemove,
}: {
  report: Pick<
    ModerationReport,
    | "id"
    | "title"
    | "summary"
    | "narrative"
    | "status"
    | "verificationLevel"
    | "redactionNotes"
    | "publishedAt"
    | "updatedAt"
  >;
  canRemove: boolean;
}) {
  const [state, action, pending] = useActionState<ModerationState, FormData>(
    submitModerationDecision,
    {},
  );
  const reviewable = isReviewable(report);
  const removable =
    canRemove && ["published", "resolved"].includes(report.status);
  const [decision, setDecision] = useState(reviewable ? "publish" : "remove");
  const [preview, setPreview] = useState(false);
  const [title, setTitle] = useState(report.title ?? "");
  const [summary, setSummary] = useState(report.summary ?? "");
  const [narrative, setNarrative] = useState(report.narrative ?? "");
  if (!reviewable && !removable) return null;
  const publishing = decision === "publish" && reviewable;
  const error = (name: string) =>
    state.fieldErrors?.[name] ? (
      <p className="text-xs text-destructive">{state.fieldErrors[name]}</p>
    ) : null;
  const choices = [
    ["publish", "প্রকাশ করুন"],
    ["request_info", "পর্যালোচনায় রাখুন"],
    ["reject", "প্রত্যাখ্যান করুন"],
  ] as const;

  return (
    <form
      action={action}
      className="border-2 border-foreground bg-card"
      id="decision"
    >
      <input name="reportId" type="hidden" value={report.id} />
      {report.updatedAt && (
        <input
          name="expectedUpdatedAt"
          type="hidden"
          value={report.updatedAt}
        />
      )}
      <div className="border-b border-border bg-secondary/50 p-5">
        <p className="mb-2 text-xs font-bold text-muted-foreground">
          শেষ ধাপ · সিদ্ধান্ত
        </p>
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <ShieldCheck className="size-5" />
          {reviewable ? "পর্যালোচনা সম্পন্ন করুন" : "অ্যাডমিন নিয়ন্ত্রণ"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {reviewable
            ? "প্রকাশের আগে ব্যক্তিগত তথ্য সরিয়ে নিরপেক্ষ ভাষা নিশ্চিত করুন।"
            : "প্রকাশিত নথি সরানোর কারণ অডিট লগে সংরক্ষিত হবে।"}
        </p>
      </div>
      <fieldset className="grid min-w-0 gap-5 p-5 sm:p-6" disabled={pending}>
        {state.error && (
          <div
            className="border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
            role="alert"
          >
            {state.error}
          </div>
        )}
        {reviewable ? (
          <>
            <input name="decision" type="hidden" value={decision} />
            <div className="grid gap-2 sm:grid-cols-3">
              {choices.map(([value, label]) => (
                <Button
                  className={cn(
                    "h-auto min-h-11 justify-start whitespace-normal rounded-none border-2 p-3 text-left font-bold transition-all cursor-pointer",
                    decision === value
                      ? "border-foreground bg-primary text-foreground shadow-[2px_2px_0_var(--foreground)]"
                      : "border-border bg-background text-foreground hover:border-foreground hover:bg-muted"
                  )}
                  key={value}
                  onClick={() => {
                    setDecision(value);
                    setPreview(false);
                  }}
                  type="button"
                >
                  {label}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <input name="decision" type="hidden" value="remove" />
        )}
        {publishing && (
          <>
            <FieldLabel htmlFor="verificationLevel" label="যাচাইয়ের স্তর">
              <Select
                defaultValue={report.verificationLevel}
                items={selectOptions(
                  VERIFICATION_LEVELS,
                  VERIFICATION_LEVEL_META,
                )}
                name="verificationLevel"
              >
                <SelectTrigger
                  className="h-10 w-full rounded-none border-2 border-border bg-background px-3 text-xs font-bold text-foreground shadow-none hover:border-foreground"
                  id="verificationLevel"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none border-2 border-foreground bg-card shadow-[4px_4px_0_var(--foreground)]">
                  {VERIFICATION_LEVELS.map((level) => (
                    <SelectItem className="rounded-none text-xs font-medium cursor-pointer" key={level} value={level}>
                      {VERIFICATION_LEVEL_META[level].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {error("verificationLevel")}
            </FieldLabel>
            <FieldLabel htmlFor="publicTitle" label="পাবলিক শিরোনাম">
              <Input
                className="rounded-none border-2 border-border text-sm font-medium focus:border-foreground"
                id="publicTitle"
                maxLength={200}
                name="publicTitle"
                onChange={(event) => setTitle(event.target.value)}
                required
                value={title}
              />
              {error("publicTitle")}
            </FieldLabel>
            <FieldLabel htmlFor="publicSummary" label="পাবলিক সারসংক্ষেপ">
              <Textarea
                className="rounded-none border-2 border-border text-sm leading-relaxed focus:border-foreground"
                id="publicSummary"
                maxLength={1000}
                name="publicSummary"
                onChange={(event) => setSummary(event.target.value)}
                required
                rows={3}
                value={summary}
              />
              {error("publicSummary")}
            </FieldLabel>
            <FieldLabel htmlFor="publicNarrative" label="প্রকাশযোগ্য বিবরণ">
              <p className="text-xs font-normal leading-6 text-muted-foreground">
                মূল জমা অপরিবর্তিত থাকবে; এই সম্পাদিত সংস্করণটি প্রকাশিত হবে।
              </p>
              <Textarea
                className="rounded-none border-2 border-border text-sm leading-relaxed focus:border-foreground"
                id="publicNarrative"
                maxLength={20000}
                name="publicNarrative"
                onChange={(event) => setNarrative(event.target.value)}
                required
                rows={8}
                value={narrative}
              />
              {error("publicNarrative")}
            </FieldLabel>
            <FieldLabel htmlFor="redactionNotes" label="কী সরানো হলো এবং কেন">
              <Textarea
                className="rounded-none border-2 border-border text-sm leading-relaxed focus:border-foreground"
                defaultValue={report.redactionNotes ?? ""}
                id="redactionNotes"
                maxLength={2000}
                name="redactionNotes"
                required
                rows={2}
              />
              {error("redactionNotes")}
            </FieldLabel>
            <Button
              aria-expanded={preview}
              aria-controls="publication-preview"
              className="rounded-none border-2 border-border hover:border-foreground font-bold"
              onClick={() => setPreview(!preview)}
              type="button"
              variant="outline"
            >
              {preview ? "প্রিভিউ বন্ধ করুন" : "প্রকাশের আগে প্রিভিউ"}
            </Button>
            {preview && (
              <article
                className="grid gap-3 border-2 border-foreground bg-background p-5 shadow-[3px_3px_0_var(--foreground)]"
                id="publication-preview"
              >
                <p className=" text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  পাবলিক লেখার প্রিভিউ
                </p>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-sm font-medium leading-7">{summary}</p>
                <p className="whitespace-pre-wrap text-sm leading-8">
                  {narrative}
                </p>
              </article>
            )}
            <Label className="items-start border-2 border-border bg-accent/10 p-4 text-sm leading-7 rounded-none cursor-pointer">
              <Checkbox className="mt-1.5 rounded-none border-2 border-foreground" required />
              <span>
                লেখা ও সংযুক্ত প্রমাণ যাচাই করেছি; প্রকাশযোগ্য লেখায় ব্যক্তিগত
                তথ্য নেই এবং ভাষা নিরপেক্ষ।
              </span>
            </Label>
          </>
        )}
        {decision === "request_info" && (
          <p className="text-sm leading-7 text-muted-foreground border-l-2 border-primary pl-3">
            নথিটি রিভিউ কিউতে থাকবে। পরবর্তী করণীয় অভ্যন্তরীণ নোটে লিখুন।
          </p>
        )}
        <FieldLabel
          htmlFor="moderatorNote"
          label={
            decision === "reject" || decision === "remove"
              ? "সিদ্ধান্তের কারণ (আবশ্যক)"
              : "অভ্যন্তরীণ নোট"
          }
        >
          <Textarea
            className="rounded-none border-2 border-border text-sm leading-relaxed focus:border-foreground"
            id="moderatorNote"
            maxLength={2000}
            name="moderatorNote"
            placeholder="শুধু Admin ও Moderator-রা দেখতে পাবেন"
            required={decision === "reject" || decision === "remove"}
            rows={3}
          />
          {error("moderatorNote")}
        </FieldLabel>
        <Button
          className={cn(
            "min-h-12 w-full rounded-none border-2 border-foreground font-bold shadow-[3px_3px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer",
            decision === "reject" || decision === "remove"
              ? "bg-destructive text-destructive-foreground hover:bg-destructive"
              : "bg-primary text-foreground hover:bg-primary"
          )}
          type="submit"
        >
          {pending ? (
            <Loader2 className="animate-spin size-4" />
          ) : publishing ? (
            <BadgeCheck className="size-4" />
          ) : (
            <Send className="size-4" />
          )}
          <span>
            {pending
              ? "সংরক্ষণ হচ্ছে…"
              : publishing
                ? "যাচাই সম্পন্ন · প্রকাশ করুন"
                : decision === "remove"
                  ? "পাবলিক পেজ থেকে সরান"
                  : "সিদ্ধান্ত সংরক্ষণ করুন"}
          </span>
        </Button>
      </fieldset>
    </form>
  );
}

function FieldLabel({
  htmlFor,
  label,
  children,
}: {
  htmlFor: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Label className="grid gap-2 text-sm font-bold" htmlFor={htmlFor}>
      {label}
      {children}
    </Label>
  );
}
