"use client";

import { useActionState, useState } from "react";
import {
  BadgeCheckIcon,
  Loader2Icon,
  MessageSquareIcon,
  SendIcon,
  ShieldXIcon,
  TrashIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  submitModerationDecision,
  type ModerationState,
} from "@/app/(dashboard)/admin/reports/actions";
import { VERIFICATION_LEVELS, VERIFICATION_LEVEL_META } from "@/lib/domain/enums";
import type { ModerationReport } from "@/services/_shared/types";

/**
 * The decision panel — the one screen where a citizen's report becomes public, or does not.
 *
 * Two design choices worth stating:
 *
 *  1. **The decision picks the form.** Rather than one long form with every field always
 *     visible, choosing "প্রকাশ করুন" reveals the fields §16.5 requires for publication
 *     (verification level, neutral public title, redaction notes), while "প্রত্যাখ্যান"
 *     reveals the reason field §16.8 requires. A moderator sees only what their decision
 *     actually needs.
 *
 *  2. **`canRemove` comes from the server session, never from a client role read.** The
 *     Server Action re-checks the same capability, so hiding the button is convenience,
 *     not the boundary.
 */

const DECISIONS = [
  {
    value: "publish",
    label: "প্রকাশ করুন",
    icon: BadgeCheckIcon,
    hint: "রিডাক্ট করা বিবরণ ও যাচাইয়ের স্তরসহ নথিটি পাবলিক হবে।",
    tone: "success" as const,
  },
  {
    value: "request_info",
    label: "অতিরিক্ত তথ্য চান",
    icon: MessageSquareIcon,
    hint: "গোপন case space-এ অভিযোগকারীকে প্রশ্ন পাঠানো হবে। নথি পাবলিক হবে না।",
    tone: "warning" as const,
  },
  {
    value: "reject",
    label: "প্রত্যাখ্যান করুন",
    icon: ShieldXIcon,
    hint: "নীতিমালার সঙ্গে না মিললে। কারণ লেখা বাধ্যতামূলক।",
    tone: "danger" as const,
  },
  {
    value: "remove",
    label: "প্রকাশিত নথি সরান",
    icon: TrashIcon,
    hint: "শুধু অ্যাডমিন। পাবলিক আর্কাইভ থেকে সরানো হবে, কিন্তু audit log থাকবে।",
    tone: "danger" as const,
    adminOnly: true,
  },
];

export function ModerationDecisionForm({
  report,
  canRemove,
}: {
  report: ModerationReport;
  canRemove: boolean;
}) {
  const [state, formAction, isPending] = useActionState<ModerationState, FormData>(
    submitModerationDecision,
    {},
  );
  const [decision, setDecision] = useState<string>("publish");

  const available = DECISIONS.filter((option) => !option.adminOnly || canRemove);
  const active = available.find((option) => option.value === decision) ?? available[0];

  return (
    <form action={formAction} className="grid gap-5 border-2 border-foreground bg-card p-5">
      <input name="reportId" type="hidden" value={report.id} />

      <div>
        <h2 className="text-lg font-bold">সিদ্ধান্ত নিন</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          প্রতিটি সিদ্ধান্ত audit log-এ কে, কখন ও কেন — সহ সংরক্ষিত হয়।
        </p>
      </div>

      {state.error && (
        <p
          className="border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
          role="alert"
        >
          {state.error}
        </p>
      )}

      {state.ok && (
        <p className="border border-secondary bg-secondary/20 p-3 text-sm font-medium">
          সিদ্ধান্ত সংরক্ষিত হয়েছে।
        </p>
      )}

      <fieldset className="grid gap-2">
        <legend className="sr-only">সিদ্ধান্তের ধরন</legend>
        {available.map((option) => {
          const Icon = option.icon;
          const selected = decision === option.value;

          return (
            <label
              className={`flex cursor-pointer gap-3 border p-3 transition ${
                selected ? "border-foreground bg-muted" : "border-border hover:border-foreground"
              }`}
              key={option.value}
            >
              <input
                checked={selected}
                className="mt-1 size-4 accent-primary"
                name="decision"
                onChange={() => setDecision(option.value)}
                type="radio"
                value={option.value}
              />
              <span className="min-w-0">
                <span className="flex items-center gap-2 font-bold">
                  <Icon className="size-4 text-primary" />
                  {option.label}
                  {option.adminOnly && (
                    <StatusBadge size="sm" tone="danger">
                      অ্যাডমিন
                    </StatusBadge>
                  )}
                </span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  {option.hint}
                </span>
              </span>
            </label>
          );
        })}
      </fieldset>

      {decision === "publish" && (
        <div className="grid gap-4 border-t border-border pt-4">
          <div className="grid gap-2">
            <Label className="text-sm font-bold" htmlFor="verificationLevel">
              যাচাইয়ের স্তর
            </Label>
            <select
              className="h-10 border border-border bg-background px-3 text-sm font-medium outline-none focus:border-primary"
              defaultValue={report.verificationLevel}
              id="verificationLevel"
              name="verificationLevel"
            >
              {VERIFICATION_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {VERIFICATION_LEVEL_META[level].label}
                </option>
              ))}
            </select>
            {state.fieldErrors?.verificationLevel && (
              <p className="text-xs text-destructive">{state.fieldErrors.verificationLevel}</p>
            )}
            <p className="text-xs leading-5 text-muted-foreground">
              প্রমাণ সংযুক্ত থাকলেই সত্যতা প্রমাণিত হয় না — “একাধিক সূত্রে সমর্থিত” শুধু
              স্বাধীন দ্বিতীয় প্রতিবেদন থাকলে দিন।
            </p>
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-bold" htmlFor="publicTitle">
              পাবলিক শিরোনাম (নিরপেক্ষ ভাষায়)
            </Label>
            <Input
              className="h-10 border border-border bg-background px-3"
              defaultValue={report.title}
              id="publicTitle"
              name="publicTitle"
              placeholder="যেমন: সেবা পেতে অতিরিক্ত অর্থ চাওয়ার অভিযোগ"
            />
            {state.fieldErrors?.publicTitle && (
              <p className="text-xs text-destructive">{state.fieldErrors.publicTitle}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-bold" htmlFor="publicSummary">
              পাবলিক সারসংক্ষেপ
            </Label>
            <Textarea
              className="min-h-24 border border-border bg-background p-3 leading-7"
              defaultValue={report.summary}
              id="publicSummary"
              name="publicSummary"
              placeholder="ঘটনাটি সংক্ষেপে, দোষ সাব্যস্ত না করে লিখুন।"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-bold" htmlFor="redactionNotes">
              কী সরানো হলো ও কেন
            </Label>
            <Textarea
              className="min-h-20 border border-border bg-background p-3 leading-7"
              defaultValue={report.redactionNotes ?? ""}
              id="redactionNotes"
              name="redactionNotes"
              placeholder="যেমন: অভিযোগকারীর মোবাইল নম্বর ও NID অপসারিত; অভিযুক্তের নাম §৭ অনুযায়ী গোপন।"
            />
            <p className="text-xs leading-5 text-muted-foreground">
              এটি আপিলের সময় সবচেয়ে গুরুত্বপূর্ণ রেকর্ড। খালি রাখবেন না।
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-2 border-t border-border pt-4">
        <Label className="text-sm font-bold" htmlFor="moderatorNote">
          অভ্যন্তরীণ নোট
          {(decision === "reject" || decision === "remove") && (
            <span className="ml-1 text-destructive">*</span>
          )}
        </Label>
        <Textarea
          className="min-h-20 border border-border bg-background p-3 leading-7"
          id="moderatorNote"
          name="moderatorNote"
          placeholder={
            decision === "reject" || decision === "remove"
              ? "কেন প্রত্যাখ্যান বা অপসারণ করা হলো, তা স্পষ্ট লিখুন।"
              : "সহকর্মীদের জন্য নোট — কখনো পাবলিক হয় না।"
          }
        />
        {state.fieldErrors?.moderatorNote && (
          <p className="text-xs text-destructive">{state.fieldErrors.moderatorNote}</p>
        )}
      </div>

      <Button className="h-11 w-full" disabled={isPending} type="submit">
        {isPending ? (
          <>
            <Loader2Icon className="animate-spin" />
            সংরক্ষণ হচ্ছে…
          </>
        ) : (
          <>
            <SendIcon />
            {active?.label ?? "সিদ্ধান্ত সংরক্ষণ করুন"}
          </>
        )}
      </Button>
    </form>
  );
}
