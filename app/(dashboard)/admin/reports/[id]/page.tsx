import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeftIcon,
  BanknoteIcon,
  CalendarDaysIcon,
  ExternalLinkIcon,
  EyeOffIcon,
  FileTextIcon,
  LandmarkIcon,
  LockIcon,
  MapPinIcon,
  UserIcon,
} from "lucide-react";

import { AccessDenied } from "@/components/admin/access-denied";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ModerationDecisionForm } from "@/components/admin/moderation-decision-form";
import { PiiHighlightedText } from "@/components/admin/pii-highlighted-text";
import { Button } from "@/components/ui/button";
import {
  MetaBadge,
  StatusBadge,
  StatusDot,
} from "@/components/ui/status-badge";
import { guard } from "@/lib/auth/dal";
import { can } from "@/lib/auth/permissions";
import {
  EVIDENCE_TYPE_META,
  EVIDENCE_VISIBILITY_META,
  MONEY_TYPE_META,
  REPORT_CATEGORY_META,
  REPORT_STATUS_META,
  VERIFICATION_LEVEL_META,
} from "@/lib/domain/enums";
import { areaName } from "@/lib/domain/geo";
import {
  formatBnCurrency,
  formatBnDateTime,
  formatBnDateWithPrecision,
  formatCaseId,
} from "@/lib/format";
import { getModerationReport } from "@/services";
import { createPageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createPageMetadata({
    title: "নথি রিভিউ",
    description: "মডারেশন রিভিউ ও প্রকাশের সিদ্ধান্ত।",
    index: false,
  });
}

export default async function ModerationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const access = await guard("report:review", `/admin/reports/${id}`);
  if (!access.allowed) {
    return (
      <AccessDenied capability={access.capability} role={access.session.role} />
    );
  }

  const response = await getModerationReport(id);
  if (!response) notFound();
  
  const report = response.data;

  const canRemove = can(access.session.role, "report:remove");
  const isPublished =
    report.status === "published" || report.status === "resolved";

  return (
    <>
      <AdminPageHeader
        actions={
          <>
            {isPublished && (
              <Button
                nativeButton={false}
                render={
                  <Link
                    href={`/reports/${report.slug}`}
                    rel="noreferrer"
                    target="_blank"
                  />
                }
                variant="outline"
              >
                <ExternalLinkIcon />
                পাবলিক পেজ
              </Button>
            )}
            <Button
              nativeButton={false}
              render={<Link href="/admin/reports" />}
              variant="ghost"
            >
              <ArrowLeftIcon />
              কিউতে ফিরুন
            </Button>
          </>
        }
        description={`${report.institution.nameBn} · ${areaName(report.location.area)}`}
        title={report.title || `নথি ${formatCaseId(report.publicId)}`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <MetaBadge meta={REPORT_STATUS_META[report.status]} />
          <MetaBadge meta={REPORT_CATEGORY_META[report.category]} />
          <MetaBadge meta={VERIFICATION_LEVEL_META[report.verificationLevel]} />
          <StatusBadge tone="neutral">
            {formatCaseId(report.publicId)}
          </StatusBadge>
          {report.assignedTo && (
            <StatusBadge icon={<UserIcon />} tone="info">
              {report.assignedTo.name} দেখছেন
            </StatusBadge>
          )}
        </div>
      </AdminPageHeader>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="grid gap-6">
          <section className="border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <FileTextIcon className="size-5 text-primary" />
              জমা দেওয়া বিবরণ
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              এটি অভিযোগকারীর মূল লেখা — কখনো পাবলিক হয়নি।
            </p>
            <div className="mt-5">
              <PiiHighlightedText text={report.rawNarrative} />
            </div>
          </section>

          <section className="border border-border bg-card p-5">
            <h2 className="text-lg font-bold">নথির তথ্য</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field icon={<LandmarkIcon />} label="প্রতিষ্ঠান">
                {report.institution.nameBn}
                {report.location.officeName && (
                  <span className="block text-xs font-normal text-muted-foreground">
                    {report.location.officeName}
                  </span>
                )}
              </Field>
              <Field icon={<MapPinIcon />} label="এলাকা">
                {areaName(report.location.area)}
              </Field>
              <Field icon={<CalendarDaysIcon />} label="ঘটনার সময়">
                {formatBnDateWithPrecision(
                  report.incidentDate?.from,
                  report.incidentDate?.precision ?? "unknown",
                )}
              </Field>
              <Field icon={<CalendarDaysIcon />} label="জমা দেওয়া হয়েছে">
                {formatBnDateTime(report.submittedAt)}
              </Field>
              {report.money?.amount !== undefined && (
                <Field icon={<BanknoteIcon />} label="উল্লিখিত অর্থ">
                  <span className="flex flex-wrap items-center gap-2">
                    {formatBnCurrency(report.money.amount)}
                    {report.money.type && (
                      <MetaBadge
                        meta={MONEY_TYPE_META[report.money.type]}
                        short
                        size="sm"
                      />
                    )}
                  </span>
                  {report.money.officialFee !== undefined && (
                    <span className="mt-1 block text-xs font-normal text-muted-foreground">
                      সরকারি ফি {formatBnCurrency(report.money.officialFee)}
                    </span>
                  )}
                </Field>
              )}
              {report.accused && report.accused.length > 0 && (
                <Field icon={<UserIcon />} label="উল্লিখিত ব্যক্তি">
                  {report.accused.map((person, index) => (
                    <span className="block" key={`accused-${index}`}>
                      {/*
                        §7: a submitted name is shown to the moderator but must not be
                        published unless the disclosure threshold is met. The designation
                        is what normally goes public.
                      */}
                      {person.designationSubmitted ?? "পদবি জানা নেই"}
                      {person.nameSubmitted && person.nameSubmitted !== "—" && (
                        <span className="ml-2 inline-flex items-center gap-1 text-xs font-normal text-destructive">
                          <LockIcon className="size-3" />
                          নাম জমা দেওয়া হয়েছে — প্রকাশের আগে §৭ দেখুন
                        </span>
                      )}
                    </span>
                  ))}
                </Field>
              )}
            </dl>
          </section>

          <section className="border border-border bg-card p-5">
            <h2 className="text-lg font-bold">সংযুক্ত প্রমাণ</h2>
            {report.evidence.length > 0 ? (
              <ul className="mt-4 grid gap-3">
                {report.evidence.map((item) => {
                  const visibility = EVIDENCE_VISIBILITY_META[item.visibility];
                  return (
                    <li
                      className="flex flex-wrap items-center justify-between gap-3 border border-border bg-background p-3"
                      key={item.id}
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium">
                          {item.title}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {EVIDENCE_TYPE_META[item.type].label}
                          {item.detail && ` · ${item.detail}`}
                        </span>
                      </span>
                      <MetaBadge meta={visibility} size="sm" />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-4 border border-dashed border-border p-4 text-sm text-muted-foreground">
                কোনো প্রমাণ সংযুক্ত নেই। এটি অভিযোগ মিথ্যা প্রমাণ করে না, তবে
                যাচাইয়ের স্তর “অযাচাইকৃত” রাখতে হবে।
              </p>
            )}
            <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
              <EyeOffIcon className="mt-0.5 size-4 shrink-0 text-primary" />
              “গোপন” চিহ্নিত ফাইল কখনো পাবলিক পেজে যায় না। প্রকাশ করতে হলে আগে
              রিডাক্ট করে আলাদা কপি তৈরি করতে হবে।
            </p>
          </section>

          {report.moderatorNotes.length > 0 && (
            <section className="border border-border bg-card p-5">
              <h2 className="text-lg font-bold">মডারেটর নোট</h2>
              <ul className="mt-4 grid gap-3">
                {report.moderatorNotes.map((note) => (
                  <li
                    className="border-l-2 border-secondary bg-muted p-3"
                    key={note.id}
                  >
                    <p className="text-sm leading-6">{note.body}</p>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {note.author} · {formatBnDateTime(note.at)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="grid h-fit gap-6">
          <ModerationDecisionForm canRemove={canRemove} report={report} />

          <section className="border border-border bg-card p-5">
            <h2 className="text-lg font-bold">সময়রেখা</h2>
            <ol className="mt-4 grid gap-3">
              {(report.timeline ?? []).map((entry) => (
                <li key={entry.id}>
                  <StatusDot tone={REPORT_STATUS_META[entry.status].tone}>
                    <span className="text-sm font-bold">
                      {REPORT_STATUS_META[entry.status].label}
                    </span>
                  </StatusDot>
                  <p className="mt-0.5 pl-4 text-xs text-muted-foreground">
                    {formatBnDateTime(entry.at)}
                    {entry.note && ` · ${entry.note}`}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="text-primary [&_svg]:size-3.5">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1 text-sm font-bold leading-6">{children}</dd>
    </div>
  );
}
