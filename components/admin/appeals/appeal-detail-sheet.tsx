"use client";

import Link from "next/link";
import { FileText, ExternalLink, ShieldAlert } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { MetaBadge } from "@/components/ui/status-badge";
import { APPEAL_REASON_META, APPEAL_STATUS_META } from "@/lib/domain/enums";
import { formatBnDateTime } from "@/lib/format";
import type { Appeal } from "@/services";
import { AppealContactPanel } from "./appeal-contact-panel";
import { AppealDecisionForm } from "./appeal-decision-form";
import {
  appealCategoryLabel,
  appealReportHref,
  isAppealPending,
  type AppealStatusUpdater,
} from "./appeal-utils";

export function AppealDetailSheet({
  appeal,
  open,
  onOpenChange,
  onStatusUpdate,
}: {
  appeal: Appeal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate: AppealStatusUpdater;
}) {
  if (!appeal) return null;
  const reportHref = appealReportHref(appeal);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="data-[side=right]:w-full data-[side=right]:sm:max-w-2xl gap-0 overflow-hidden rounded-none border-l-2 border-foreground">
        <SheetHeader className="border-b-2 border-border bg-muted/40 px-5 py-5 pr-14">
          <SheetTitle className="text-lg font-bold">আপিল পর্যালোচনা</SheetTitle>
          <SheetDescription className="break-all font-mono text-xs">
            Appeal #{appeal.id}
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="flex flex-wrap gap-2">
            <MetaBadge meta={APPEAL_STATUS_META[appeal.status]} />
            <MetaBadge meta={APPEAL_REASON_META[appeal.reason]} />
          </div>
          {appeal.reason === "privacy_risk" && isAppealPending(appeal) && (
            <Alert className="rounded-none border-2" variant="destructive">
              <ShieldAlert />
              <AlertTitle>গোপনীয়তার ঝুঁকি</AlertTitle>
              <AlertDescription>
                ব্যক্তিগত তথ্য প্রকাশের অভিযোগ। অগ্রাধিকার ভিত্তিতে পর্যালোচনা
                প্রয়োজন।
              </AlertDescription>
            </Alert>
          )}
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-bold">
              <FileText className="size-4" /> সংশ্লিষ্ট রিপোর্ট
            </h3>
            <p className="break-words text-base font-semibold">
              {appeal.reportTitle || "রিপোর্টের শিরোনাম পাওয়া যায়নি"}
            </p>
            <dl className="grid grid-cols-1 gap-3 bg-muted/40 p-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Case ID</dt>
                <dd className="mt-1 break-all font-mono font-semibold">
                  {appeal.caseId || "উল্লেখ নেই"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">প্রতিষ্ঠান</dt>
                <dd className="mt-1 break-words">
                  {appeal.institutionName || "উল্লেখ নেই"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">রিপোর্টের ধরন</dt>
                <dd className="mt-1">
                  {appealCategoryLabel(appeal.reportCategory)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">আপিল জমা</dt>
                <dd className="mt-1">{formatBnDateTime(appeal.receivedAt)}</dd>
              </div>
            </dl>
            {reportHref && (
              <Button
                asChild
                className="rounded-none border-2 border-foreground shadow-[2px_2px_0_var(--foreground)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                variant="outline"
              >
                <Link
                  href={reportHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink /> মূল রিপোর্ট খুলুন
                </Link>
              </Button>
            )}
          </section>
          <section className="space-y-3 border-t border-border pt-5">
            <h3 className="text-sm font-bold">আবেদনকারী কী পরিবর্তন চাইছেন?</h3>
            <p className="break-words whitespace-pre-wrap text-sm leading-7">
              {appeal.detail}
            </p>
          </section>
          <AppealContactPanel appeal={appeal} />
          {appeal.resolution && (
            <section className="space-y-2">
              <h3 className="text-sm font-bold">সংরক্ষিত সিদ্ধান্ত</h3>
              <p className="break-words whitespace-pre-wrap bg-muted/40 p-3 text-sm leading-7">
                {appeal.resolution}
              </p>
              {appeal.resolvedAt && (
                <p className="text-xs text-muted-foreground">
                  সিদ্ধান্ত: {formatBnDateTime(appeal.resolvedAt)}
                </p>
              )}
            </section>
          )}
          <AppealDecisionForm
            key={appeal.id}
            appeal={appeal}
            onStatusUpdate={onStatusUpdate}
            onDone={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
