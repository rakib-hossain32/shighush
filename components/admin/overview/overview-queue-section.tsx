"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileText,
  Inbox,
  ShieldAlert,
  UserCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { MetaBadge, StatusBadge } from "@/components/ui/status-badge";
import { REPORT_CATEGORY_META, REPORT_STATUS_META } from "@/lib/domain/enums";
import { areaName } from "@/lib/domain/geo";
import { formatBnCurrency, formatBnNumber, formatBnRelative, formatCaseId } from "@/lib/format";
import type { ModerationReport } from "@/services";

export function OverviewQueueSection({
  myAssignedReports,
  awaitingReviewReports,
  piiAlertReports,
  recentlyPublishedReports,
  currentUserId,
}: {
  myAssignedReports: ModerationReport[];
  awaitingReviewReports: ModerationReport[];
  piiAlertReports: ModerationReport[];
  recentlyPublishedReports: ModerationReport[];
  currentUserId: string;
}) {
  const [activeTab, setActiveTab] = useState<"mine" | "queue" | "pii" | "published">(
    myAssignedReports.length > 0 ? "mine" : "queue"
  );

  const tabs = [
    {
      id: "mine",
      label: "আমার দায়িত্বে",
      count: myAssignedReports.length,
      icon: UserCheck,
      reports: myAssignedReports,
      viewAllHref: "/admin/reports?assignment=mine",
      emptyTitle: "আপনার কিউ সম্পূর্ণ খালি",
      emptyDesc: "আপাতত আপনার দায়িত্বে কোনো নথি অমীমাংসিত নেই।",
    },
    {
      id: "queue",
      label: "রিভিউ অপেক্ষমাণ কিউ",
      count: awaitingReviewReports.length,
      icon: Clock,
      reports: awaitingReviewReports,
      viewAllHref: "/admin/reports?status=submitted,under_review,needs_info",
      emptyTitle: "রিভিউ কিউ খালি",
      emptyDesc: "এই মুহূর্তে কোনো নতুন অভিযোগ পর্যালোচনার অপেক্ষায় নেই।",
    },
    {
      id: "pii",
      label: "গোপনীয়তা সতর্কতা (PII)",
      count: piiAlertReports.length,
      icon: ShieldAlert,
      reports: piiAlertReports,
      viewAllHref: "/admin/reports?flaggedOnly=true",
      emptyTitle: "কোনো গোপনীয়তা ঝুঁকি নেই",
      emptyDesc: "বর্তমানে রিডাকশন আবশ্যক এমন কোনো নথি জমা নেই।",
    },
    {
      id: "published",
      label: "সম্প্রতি প্রকাশিত",
      count: recentlyPublishedReports.length,
      icon: CheckCircle2,
      reports: recentlyPublishedReports,
      viewAllHref: "/admin/reports?status=published",
      emptyTitle: "কোনো প্রকাশিত নথি নেই",
      emptyDesc: "সাম্প্রতিক প্রকাশিত নথির তালিকা এখানে প্রদর্শিত হবে।",
    },
  ] as const;

  const currentTabData = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div className="border-2 border-foreground bg-card shadow-[4px_4px_0_var(--foreground)]">
      {/* Header with Tab Switcher */}
      <div className="flex flex-col border-b-2 border-foreground p-5 lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground">
            অভিযোগ ও মডারেশন কিউ
          </h2>
          <p className="text-xs text-muted-foreground">
            আপনার দায়িত্বপ্রাপ্ত কাজ, অপেক্ষমাণ নতুন অভিযোগ এবং গোপনীয়তা সতর্কতা পর্যবেক্ষণ করুন
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 border-2 border-border bg-muted/40 p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "border border-foreground bg-primary text-foreground shadow-[1px_1px_0_var(--foreground)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`ml-1 rounded-none px-1.5 py-0.2 text-[10px] ${
                    isSelected
                      ? "bg-foreground text-background "
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {formatBnNumber(tab.count)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reports List */}
      <div className="divide-y divide-border">
        {currentTabData.reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <span className="grid size-12 place-items-center border-2 border-border bg-muted text-muted-foreground mb-3">
              <Inbox className="size-6" />
            </span>
            <h3 className="font-heading text-base font-bold text-foreground">
              {currentTabData.emptyTitle}
            </h3>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              {currentTabData.emptyDesc}
            </p>
          </div>
        ) : (
          currentTabData.reports.map((report) => {
            const institutionName =
              report.institution?.nameBn || report.institutionName || "অজানা প্রতিষ্ঠান";
            const area = report.location?.area || "";
            const categoryMeta = REPORT_CATEGORY_META[report.category];
            const statusMeta = REPORT_STATUS_META[report.status];
            const piiCount = report.piiFindings?.length || 0;
            const isAssignedToMe = report.assignedTo?.id === currentUserId;

            return (
              <div
                key={report.id}
                className="flex flex-col gap-4 p-4 transition-colors hover:bg-muted/25 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className=" text-xs font-bold text-primary">
                      {formatCaseId(report.publicId || report.id)}
                    </span>

                    {categoryMeta && (
                      <MetaBadge meta={categoryMeta} short size="sm" />
                    )}

                    {statusMeta && (
                      <MetaBadge meta={statusMeta} short size="sm" />
                    )}

                    {piiCount > 0 && (
                      <span className="inline-flex items-center gap-1 border border-destructive bg-destructive/10 px-1.5 py-0.5 text-[10px] font-bold text-destructive">
                        <AlertTriangle className="size-3" />
                        {formatBnNumber(piiCount)}টি সতর্কতা
                      </span>
                    )}

                    {report.assignedTo ? (
                      <span
                        className={`inline-flex items-center gap-1 border px-1.5 py-0.5 text-[10px] font-medium ${
                          isAssignedToMe
                            ? "border-accent bg-accent/20 text-foreground font-bold"
                            : "border-border bg-muted/60 text-muted-foreground"
                        }`}
                      >
                        <UserCheck className="size-3" />
                        {report.assignedTo.name}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 border border-border/80 bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        দায়িত্ব বরাদ্দ নেই
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading text-sm font-bold text-foreground">
                    <Link
                      href={`/admin/reports/${report.id}`}
                      className="hover:underline hover:text-primary transition-colors"
                    >
                      {report.title || "শিরোনামহীন অভিযোগ"}
                    </Link>
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>{institutionName}</span>
                    {area && (
                      <>
                        <span>•</span>
                        <span>{areaName(area)}</span>
                      </>
                    )}
                    {report.money?.amount && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-foreground">
                          {formatBnCurrency(report.money.amount)}
                        </span>
                      </>
                    )}
                    <span>•</span>
                    <span>{formatBnRelative(report.submittedAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    asChild
                    size="sm"
                    className="h-8 rounded-none border-2 border-foreground bg-primary px-3 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                  >
                    <Link href={`/admin/reports/${report.id}`}>
                      <Eye className="size-3.5" />
                      পর্যালোচনা করুন
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Link */}
      <div className="flex items-center justify-between border-t-2 border-foreground bg-muted/20 px-5 py-3 text-xs">
        <span className="text-muted-foreground">
          সর্বমোট {formatBnNumber(currentTabData.count)}টি নথি তালিকাভুক্ত রয়েছে
        </span>
        <Link
          href={currentTabData.viewAllHref}
          className="inline-flex items-center gap-1 font-bold text-foreground hover:text-primary underline transition-colors"
        >
          সম্পূর্ণ তালিকা দেখুন <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
