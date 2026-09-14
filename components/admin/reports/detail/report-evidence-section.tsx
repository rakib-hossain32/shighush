import {
  Download,
  Eye,
  EyeOff,
  FileCheck,
  FileIcon,
  FileQuestion,
  FileText,
  Headphones,
  Image as ImageIcon,
  ShieldCheck,
  Video,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { MetaBadge } from "@/components/ui/status-badge";
import {
  EVIDENCE_TYPE_META,
  EVIDENCE_VISIBILITY_META,
  type EvidenceType,
} from "@/lib/domain/enums";
import { formatBnNumber } from "@/lib/format";
import type { EvidenceSummary, ModerationReport } from "@/services/_shared/types";

export function ReportEvidenceSection({ report }: { report: ModerationReport }) {
  const evidenceList = report.evidence ?? [];

  return (
    <div className="border-2 border-foreground bg-card shadow-[3px_3px_0_var(--foreground)]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-foreground bg-secondary/40 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="grid size-8 place-items-center border border-foreground bg-primary text-foreground">
            <FileCheck className="size-4" />
          </div>
          <div>
            <h2 className="font-heading text-sm font-bold text-foreground sm:text-base">
              সংযুক্ত প্রমাণ ও ফাইল ({formatBnNumber(evidenceList.length)})
            </h2>
            <p className="text-xs text-muted-foreground">
              অভিযোগের সত্যতা যাচাইয়ের প্রমাণপত্র, অডিও, ভিডিও ও রসিদ
            </p>
          </div>
        </div>

        <Badge
          className="rounded-none border-2 border-foreground bg-background text-xs font-bold text-foreground"
          variant="outline"
        >
          {evidenceList.length > 0 ? "প্রমাণ সংযুক্ত" : "প্রমাণহীন"}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        {evidenceList.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {evidenceList.map((item) => (
              <EvidenceCard item={item} key={item.id} />
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-border bg-muted/20 p-6 text-center">
            <FileQuestion className="mx-auto size-8 text-muted-foreground/60" />
            <p className="mt-2 text-sm font-bold text-foreground">
              কোনো প্রমাণ বা ফাইল সংযুক্ত করা হয়নি
            </p>
            <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-muted-foreground">
              প্রমাণ না থাকা অভিযোগটি মিথ্যা নির্দেশ করে না, তবে মডারেশন নীতি অনুযায়ী এই নথির
              যাচাইয়ের স্তর <strong>“অযাচাইকৃত”</strong> রাখা বাঞ্চনীয়।
            </p>
          </div>
        )}

        {/* Security & Confidentiality Notice */}
        <div className="mt-5 flex items-start gap-2.5 rounded-none border border-border bg-muted/40 p-3.5 text-xs leading-relaxed text-muted-foreground">
          <EyeOff className="mt-0.5 size-4 shrink-0 text-primary" />
          <div>
            <strong className="text-foreground">গোপনীয়তা সুরক্ষা নীতি:</strong>{" "}
            “গোপন” চিহ্নিত কোনো প্রমাণ পাবলিক পেজে প্রদর্শিত বা ডাউনলোডযোগ্য হবে না। জনস্বার্থে
            প্রকাশ করতে চাইলে ব্যক্তিগত অংশ আড়াল (redact) করে আলাদা কপি তৈরি করতে হবে।
          </div>
        </div>
      </div>
    </div>
  );
}

function EvidenceCard({ item }: { item: EvidenceSummary }) {
  const typeMeta = EVIDENCE_TYPE_META[item.type];
  const visibilityMeta = EVIDENCE_VISIBILITY_META[item.visibility];

  return (
    <div className="flex flex-col justify-between rounded-none border-2 border-border bg-background p-4 transition-all hover:border-foreground">
      <div className="space-y-2">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <EvidenceTypeIcon type={item.type} />
            <span className="font-mono text-[11px] font-bold text-muted-foreground uppercase">
              {typeMeta?.label || item.type}
            </span>
          </div>

          <MetaBadge meta={visibilityMeta} size="sm" />
        </div>

        {/* Title & Detail */}
        <div>
          <h4 className="text-sm font-bold text-foreground line-clamp-1">
            {item.title}
          </h4>
          {item.detail && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {item.detail}
            </p>
          )}
        </div>
      </div>

      {/* Review Actions if paths available */}
      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
        {item.visibility === "redacted_public" && item.publicPath ? (
          <a
            className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
            href={item.publicPath}
            rel="noreferrer"
            target="_blank"
          >
            <Eye className="size-3.5" />
            <span>পাবলিক ফাইল দেখুন</span>
          </a>
        ) : item.reviewPath ? (
          <a
            className="inline-flex items-center gap-1 font-bold text-foreground hover:underline"
            href={item.reviewPath}
            rel="noreferrer"
            target="_blank"
          >
            <Download className="size-3.5" />
            <span>রিভিউ ফাইল দেখুন</span>
          </a>
        ) : (
          <span className="text-[11px] text-muted-foreground">
            ফাইল প্রিভিউ অভ্যন্তরীণ
          </span>
        )}
      </div>
    </div>
  );
}

function EvidenceTypeIcon({ type }: { type: EvidenceType }) {
  switch (type) {
    case "audio":
      return <Headphones className="size-4 text-primary" />;
    case "video":
      return <Video className="size-4 text-primary" />;
    case "image":
      return <ImageIcon className="size-4 text-primary" />;
    case "document":
      return <FileText className="size-4 text-primary" />;
    default:
      return <FileIcon className="size-4 text-primary" />;
  }
}
