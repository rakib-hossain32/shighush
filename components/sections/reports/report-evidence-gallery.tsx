import { FileAudio, FileImage, FileText, Play, ShieldCheck, Video } from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";
import { EVIDENCE_TYPE_META } from "@/lib/domain/enums";
import type { EvidenceType, PublicReport } from "@/services/_shared/types";

const MEDIA_ICON: Record<EvidenceType, typeof FileImage> = {
  image: FileImage,
  video: Video,
  audio: FileAudio,
  document: FileText,
};

export function ReportEvidenceGallery({ report }: { report: PublicReport }) {
  // `PublicReport.evidence` is already filtered to `redacted_public` upstream — a private
  // file cannot reach this component. The copy below states that guarantee to the reader.
  const items = report.evidence;

  return (
    <section className="border-t-2 border-foreground pt-7">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className=" text-[11px] font-bold tracking-[.15em] text-primary">
            সংযুক্ত প্রমাণ
          </p>
          <h2 className="display mt-2 text-3xl font-bold">যাচাইযোগ্য সংযুক্তি</h2>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" />
          শুধু redacted সংস্করণ
        </span>
      </div>

      {items.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = MEDIA_ICON[item.type];
            const isVideo = item.type === "video";

            return (
              <article
                className="group overflow-hidden border border-border bg-card"
                key={item.id}
              >
                <div
                  className={`relative grid h-34 place-items-center ${
                    isVideo ? "bg-foreground text-background" : "bg-muted"
                  }`}
                >
                  <Icon
                    className={`size-10 ${isVideo ? "text-secondary" : "text-primary"}`}
                  />
                  {isVideo && (
                    <span className="absolute grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Play className="ml-0.5 size-4 fill-current" />
                    </span>
                  )}
                  <StatusBadge className="absolute left-3 top-3" size="sm" tone="neutral">
                    {EVIDENCE_TYPE_META[item.type].label}
                  </StatusBadge>
                </div>

                <div className="p-4">
                  <p className="font-bold">{item.title}</p>
                  {item.detail && (
                    <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                  )}
                  <button className="mt-4 text-sm font-bold underline" type="button">
                    নিরাপদ preview দেখুন
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 border border-dashed border-border bg-muted p-6 text-sm text-muted-foreground">
          এই প্রকাশিত নথিতে public-safe প্রমাণ সংযুক্ত নেই। ব্যক্তিগত বা unredacted ফাইল কখনো
          public করা হয় না।
        </div>
      )}
    </section>
  );
}
