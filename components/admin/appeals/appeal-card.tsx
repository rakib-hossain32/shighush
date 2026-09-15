"use client";

import { ArrowRight, ShieldAlert, Mail, MailWarning } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetaBadge } from "@/components/ui/status-badge";
import { APPEAL_REASON_META, APPEAL_STATUS_META } from "@/lib/domain/enums";
import { formatBnRelative } from "@/lib/format";
import type { Appeal } from "@/services";
import { isAppealPending } from "./appeal-utils";

export function AppealCard({
  appeal,
  onViewDetails,
}: {
  appeal: Appeal;
  onViewDetails: (appeal: Appeal) => void;
}) {
  const urgent = appeal.reason === "privacy_risk" && isAppealPending(appeal);
  return (
    <Card
      className={
        urgent
          ? "rounded-none border-destructive/40 shadow-none"
          : "rounded-none shadow-none"
      }
    >
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="break-all font-mono text-xs font-semibold">
            {appeal.caseId}
          </span>
          <MetaBadge meta={APPEAL_STATUS_META[appeal.status]} size="sm" />
        </div>
        <h3 className="break-words text-sm font-semibold">
          {appeal.reportTitle || "রিপোর্টের শিরোনাম পাওয়া যায়নি"}
        </h3>
        <p className="text-xs text-muted-foreground">
          {appeal.institutionName || "প্রতিষ্ঠান উল্লেখ নেই"}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <MetaBadge meta={APPEAL_REASON_META[appeal.reason]} size="sm" />
          {urgent && (
            <ShieldAlert
              className="size-4 text-destructive"
              aria-label="জরুরি গোপনীয়তা ঝুঁকি"
            />
          )}
        </div>
        <p className="line-clamp-2 break-words text-sm leading-6">
          {appeal.detail}
        </p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {appeal.contactEmail ? (
            <Mail className="size-3.5" />
          ) : (
            <MailWarning className="size-3.5 text-amber-600" />
          )}
          {appeal.contactEmail ? "ইমেইল দেওয়া হয়েছে" : "যোগাযোগের ইমেইল নেই"}
        </p>
        <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">
            {formatBnRelative(appeal.receivedAt)}
          </span>
          <Button variant="outline" onClick={() => onViewDetails(appeal)}>
            পর্যালোচনা <ArrowRight />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
