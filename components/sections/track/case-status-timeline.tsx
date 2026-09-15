import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Clock3,
  FileCheck2,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  REPORT_STATUS_META,
  VERIFICATION_LEVEL_META,
  type ReportStatus,
} from "@/lib/domain/enums";
import type { CaseTrackResult } from "@/services/reports/reports.service";

const STATUS_PROGRESS_ORDER: ReportStatus[] = [
  "submitted",
  "under_review",
  "needs_info",
  "published",
];

function formatDateBn(dateString?: string | null): string {
  if (!dateString) return "অপেক্ষমাণ";
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

export function CaseStatusTimeline({ report }: { report: CaseTrackResult }) {
  const currentStatus = report.status;
  const isRejected = currentStatus === "rejected" || currentStatus === "removed";

  const getStepState = (stepIndex: number) => {
    if (isRejected) {
      return stepIndex === 0 ? "completed" : "rejected";
    }
    if (currentStatus === "published" || currentStatus === "resolved" || currentStatus === "archived") {
      return "completed";
    }
    if (currentStatus === "under_review" || currentStatus === "needs_info") {
      if (stepIndex === 0) return "completed";
      if (stepIndex === 1) return "current";
      return "pending";
    }
    // submitted or draft
    if (stepIndex === 0) return "current";
    return "pending";
  };

  const steps = [
    {
      icon: CheckCircle2,
      title: "জমা গ্রহণ ও এনক্রিপশন সম্পন্ন",
      date: formatDateBn(report.submittedAt),
      stepIndex: 0,
      description:
        "আপনার নাগরিক প্রতিবেদনটি নিরাপদে ডাটাবেজে এনক্রিপ্ট হয়ে জমা হয়েছে। মেটাডাটা স্ক্রাবিং সম্পন্ন হয়েছে।",
    },
    {
      icon: Clock3,
      title: "গোপনীয়তা ও মডারেশন রিভিউ",
      date: currentStatus === "under_review" || currentStatus === "needs_info" ? "বর্তমানে চলমান" : (getStepState(1) === "completed" ? "সম্পন্ন" : "পরবর্তী ধাপ"),
      stepIndex: 1,
      description:
        "মডারেটর টিম ব্যক্তিগত তথ্য (PII) ফিল্টার করছে এবং ভাষা নিরপেক্ষ করার প্রক্রিয়া চালাচ্ছে।",
    },
    {
      icon: FileCheck2,
      title: "প্রমাণ ও সত্যতা যাচাই",
      date: getStepState(2) === "completed" ? "সম্পন্ন" : "পরবর্তী ধাপ",
      stepIndex: 2,
      description:
        "সংযুক্ত প্রমাণপত্র এবং সংশ্লিষ্ট সরকারি অফিসের নিয়মের সঙ্গে সামঞ্জস্য পরীক্ষা করে যাচাইকরণ স্তর নির্ধারণ করা হবে।",
    },
    {
      icon: isRejected ? XCircle : ShieldCheck,
      title: isRejected ? "কেস পর্যালোচনা সমাপ্ত (প্রত্যাখ্যাত)" : "পাবলিক নথিতে প্রকাশ ও কেস সমাপ্তি",
      date: report.publishedAt ? formatDateBn(report.publishedAt) : "চূড়ান্ত ধাপ",
      stepIndex: 3,
      description: isRejected
        ? "নীতিমালা অনুযায়ী এই অভিযোগটি জনস্বার্থে প্রকাশযোগ্য হিসেবে বিবেচিত হয়নি।"
        : "পর্যালোচনা সফলভাবে শেষ হলে প্রতিবেদনটি জনস্বার্থে 'অভিযোগের রেকর্ড' তালিকায় প্রকাশিত হয়।",
    },
  ];

  const statusMeta = REPORT_STATUS_META[currentStatus] || {
    label: currentStatus,
    short: currentStatus,
    tone: "neutral" as const,
  };

  const verification = VERIFICATION_LEVEL_META[report.verificationLevel] || {
    label: report.verificationLevel,
    short: report.verificationLevel,
    tone: "muted" as const,
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.8fr)_minmax(280px,1.2fr)]">
      {/* Timeline Section */}
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader className="border-b border-border/60 pb-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                  CASE PROGRESS TRACKER
                </span>
                <Badge variant="outline" className=" text-[10px]">
                  ID: {report.caseId}
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  {verification.label}
                </Badge>
              </div>
              <CardTitle className="mt-1 font-heading text-xl font-bold">
                {report.publicTitle || "আপনার অভিযোগের বর্তমান অগ্রগতি"}
              </CardTitle>
            </div>
            <span className="grid size-9 place-items-center rounded-lg bg-secondary text-primary">
              <Clock className="size-4.5" />
            </span>
          </div>

          <CardDescription className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>বিভাগ: <strong className="text-foreground">{report.category}</strong></span>
            <span>এলাকা: <strong className="text-foreground">{report.area}</strong></span>
            <span>বর্তমান অবস্থা: <strong className="text-primary">{statusMeta.label}</strong></span>
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="relative space-y-7 before:absolute before:bottom-2 before:left-4 before:top-2 before:w-0.5 before:bg-border/60">
            {steps.map((step) => {
              const Icon = step.icon;
              const state = getStepState(step.stepIndex);
              const isCurrent = state === "current";
              const isCompleted = state === "completed";
              const isStepRejected = state === "rejected";

              return (
                <div key={step.title} className="relative flex items-start gap-4 pl-2">
                  <span
                    className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
                      isStepRejected
                        ? "border border-destructive bg-destructive/10 text-destructive"
                        : isCompleted
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : isCurrent
                        ? "animate-pulse bg-secondary text-primary ring-4 ring-primary/20"
                        : "border border-border bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="size-4" />
                  </span>

                  <div className="flex-1 space-y-1.5 pt-0.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3
                        className={`text-sm font-bold font-heading ${
                          isStepRejected
                            ? "text-destructive"
                            : isCurrent
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <Badge
                        variant={
                          isStepRejected
                            ? "destructive"
                            : isCompleted
                            ? "default"
                            : isCurrent
                            ? "secondary"
                            : "outline"
                        }
                        className="text-[10px] font-semibold"
                      >
                        {step.date}
                      </Badge>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-border/60 pt-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/track">
              <ArrowLeft className="mr-1.5 size-3.5" />
              অন্য কেস খুঁজুন
            </Link>
          </Button>

          <Button asChild variant="outline" size="sm">
            <Link href="/reports">
              প্রকাশিত অন্যান্য নথি দেখুন
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Safe Message Space / Reporter Inbox */}
      <div className="space-y-5">
        <Card className="border-border/80 bg-card">
          <CardHeader className="border-b border-border/60 pb-3">
            <div className="flex items-center gap-2 text-primary">
              <MessageSquare className="size-4.5" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                SAFE INBOX
              </span>
            </div>
            <CardTitle className="mt-1 font-heading text-base font-bold">
              মডারেটরের বার্তা ও স্ট্যাটাস
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5 pt-4 text-xs">
            {report.moderatorNote ? (
              <div className="space-y-1.5 rounded-lg border border-primary/40 bg-secondary/40 p-3.5">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="font-semibold text-foreground">মডারেশন নোট</span>
                  <span>{formatDateBn(report.updatedAt)}</span>
                </div>
                <p className="text-xs leading-relaxed text-foreground/90">
                  {report.moderatorNote}
                </p>
              </div>
            ) : null}

            <div className="space-y-1.5 rounded-lg border border-border/60 bg-secondary/20 p-3.5">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground">মডারেশন ডেস্ক (স্বয়ংক্রিয়)</span>
                <span>{formatDateBn(report.submittedAt)}</span>
              </div>
              <p className="text-xs leading-relaxed text-foreground/90">
                আপনার প্রতিবেদনটি পর্যালোচনা তালিকায় অন্তর্ভুক্ত হয়েছে। স্ট্যাটাস আপডেট এখানে স্বয়ংক্রিয়ভাবে দৃশ্যমান হবে।
              </p>
            </div>

            <p className="text-[11px] text-muted-foreground">
              আপনার পরিচয় সম্পূর্ণ গোপন রয়েছে। এটি একটি জিরো-নলেজ ট্র্যাকিং চ্যানেল।
            </p>
          </CardContent>
        </Card>

        {/* Security & Action reminder */}
        <Alert className="border-primary/30 bg-secondary/30">
          <ShieldAlert className="size-4 text-primary" />
          <AlertTitle className="text-xs font-bold">
            সংশোধনী প্রয়োজন?
          </AlertTitle>
          <AlertDescription className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            যদি আপনার দাখিল করা তথ্যে কোনো ভুল থাকে বা আপনি কোনো ভুলবশত ব্যক্তিগত তথ্য জমা দিয়ে থাকেন, তবে দ্রুত{" "}
            <Link href="/appeal" className="font-bold text-primary underline">
              আপিল বা সংশোধনী ডেস্কে
            </Link>{" "}
            অনুরোধ পাঠান।
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
