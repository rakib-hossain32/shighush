"use client";

import { ArrowRight, Mail, MailWarning, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MetaBadge } from "@/components/ui/status-badge";
import { APPEAL_REASON_META, APPEAL_STATUS_META } from "@/lib/domain/enums";
import { formatBnRelative } from "@/lib/format";
import type { Appeal } from "@/services";
import { isAppealPending } from "./appeal-utils";

export function AppealsTable({ appeals, onReview }: { appeals: Appeal[]; onReview: (appeal: Appeal) => void }) {
  return <>
    <div className="space-y-3 md:hidden">
      {appeals.map((appeal) => <article key={appeal.id} className="border-2 border-border bg-card p-4 shadow-[2px_2px_0_var(--foreground)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
          <span className="font-mono text-xs font-bold text-primary">{appeal.caseId}</span>
          <MetaBadge meta={APPEAL_STATUS_META[appeal.status]} short size="sm" />
        </div>
        <h3 className="mt-3 break-words font-heading text-sm font-bold">{appeal.reportTitle || "রিপোর্টের শিরোনাম পাওয়া যায়নি"}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{appeal.institutionName || "প্রতিষ্ঠান উল্লেখ নেই"}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2"><MetaBadge meta={APPEAL_REASON_META[appeal.reason]} short size="sm" />{appeal.reason === "privacy_risk" && isAppealPending(appeal) && <span className="inline-flex items-center gap-1 border border-destructive bg-destructive/10 px-1.5 py-0.5 text-[10px] font-bold text-destructive"><ShieldAlert className="size-3" /> জরুরি</span>}</div>
        <p className="mt-3 line-clamp-2 break-all text-xs leading-6 text-foreground">{appeal.detail}</p>
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">{appeal.contactEmail ? <Mail className="size-3.5" /> : <MailWarning className="size-3.5 text-amber-600" />}{formatBnRelative(appeal.receivedAt)}</span>
          <Button className="h-8 rounded-none border-2 border-foreground px-3 text-xs font-bold shadow-[2px_2px_0_var(--foreground)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none" onClick={() => onReview(appeal)}>পর্যালোচনা <ArrowRight /></Button>
        </div>
      </article>)}
    </div>

    <div className="hidden overflow-x-auto border-2 border-border bg-card shadow-[3px_3px_0_var(--foreground)] md:block">
      <Table>
        <TableHeader><TableRow className="border-b-2 border-border bg-muted/40 hover:bg-muted/40">
          <TableHead className="py-3 pl-4 font-bold text-foreground">রিপোর্ট ও প্রতিষ্ঠান</TableHead>
          <TableHead className="py-3 font-bold text-foreground">আপিলের কারণ</TableHead>
          <TableHead className="py-3 font-bold text-foreground">আবেদনের সারাংশ</TableHead>
          <TableHead className="py-3 font-bold text-foreground">যোগাযোগ</TableHead>
          <TableHead className="py-3 text-right font-bold text-foreground">জমা</TableHead>
          <TableHead className="py-3 text-right font-bold text-foreground">অবস্থা</TableHead>
          <TableHead className="py-3 pr-4 text-right font-bold text-foreground">একশন</TableHead>
        </TableRow></TableHeader>
        <TableBody>{appeals.map((appeal) => {
          const urgent = appeal.reason === "privacy_risk" && isAppealPending(appeal);
          return <TableRow key={appeal.id} className={urgent ? "bg-destructive/[0.035] hover:bg-destructive/[0.07]" : "hover:bg-primary/5"}>
            <TableCell className="max-w-72 py-3 pl-4 align-top"><p className="break-all font-mono text-[11px] font-bold text-primary">{appeal.caseId}</p><p className="mt-1 break-words font-heading text-sm font-bold">{appeal.reportTitle || "শিরোনাম পাওয়া যায়নি"}</p><p className="mt-0.5 truncate text-xs text-muted-foreground">{appeal.institutionName || "প্রতিষ্ঠান উল্লেখ নেই"}</p></TableCell>
            <TableCell className="py-3 align-top"><div className="flex items-center gap-1.5"><MetaBadge meta={APPEAL_REASON_META[appeal.reason]} short size="sm" />{urgent && <ShieldAlert className="size-4 shrink-0 text-destructive" aria-label="জরুরি গোপনীয়তা ঝুঁকি" />}</div></TableCell>
            <TableCell className="max-w-96 py-3 align-top"><p className="line-clamp-2 break-all text-xs leading-5">{appeal.detail}</p></TableCell>
            <TableCell className="py-3 align-top"><span className={appeal.contactEmail ? "inline-flex items-center gap-1.5 text-xs" : "inline-flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300"}>{appeal.contactEmail ? <Mail className="size-3.5" /> : <MailWarning className="size-3.5" />}{appeal.contactEmail ? "ইমেইল আছে" : "ইমেইল নেই"}</span></TableCell>
            <TableCell className="py-3 text-right align-top text-xs text-muted-foreground">{formatBnRelative(appeal.receivedAt)}</TableCell>
            <TableCell className="py-3 text-right align-top"><MetaBadge meta={APPEAL_STATUS_META[appeal.status]} short size="sm" /></TableCell>
            <TableCell className="py-3 pr-4 text-right align-top"><Button className="h-8 rounded-none border-2 border-foreground bg-card px-3 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] hover:bg-primary hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none" variant="outline" onClick={() => onReview(appeal)}>পর্যালোচনা <ArrowRight /></Button></TableCell>
          </TableRow>;
        })}</TableBody>
      </Table>
    </div>
  </>;
}
