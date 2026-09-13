"use client";

/**
 * Evidence attachment picker.
 *
 * The previous version rendered a styled drop-zone over an unregistered file input with
 * no `onChange` handler: picking a file produced no visible change at all, so the control
 * read as broken. This version validates and lists what was chosen.
 *
 * It is deliberately honest about its limits. There is no storage backend yet, so nothing
 * here is transmitted — the list is labelled "এখনো আপলোড হয়নি" and the footnote says so in
 * as many words. Showing a confident upload UI for a pipeline that does not exist would be
 * worse than the silence it replaces.
 */

import { useCallback, useState } from "react";
import { PaperclipIcon, Trash2Icon, TriangleAlertIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { OptionalBadge } from "./field";

const MAX_BYTES = 10 * 1024 * 1024;
const MAX_FILES = 6;
const ACCEPT = "image/*,audio/*,video/*,.pdf,.doc,.docx";
const ACCEPTED_PREFIXES = ["image/", "audio/", "video/"];
const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx"];

function isAcceptedType(file: File): boolean {
  if (ACCEPTED_PREFIXES.some((prefix) => file.type.startsWith(prefix))) return true;
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Number((bytes / 1024).toFixed(0)).toLocaleString("bn-BD")} কেবি`;
  }
  return `${Number((bytes / (1024 * 1024)).toFixed(1)).toLocaleString("bn-BD")} এমবি`;
}

export function EvidenceUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [rejections, setRejections] = useState<string[]>([]);

  const handleSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const picked = Array.from(event.target.files ?? []);
      // Reset immediately so re-picking the same file still fires a change event.
      event.target.value = "";
      if (picked.length === 0) return;

      const problems: string[] = [];

      setFiles((current) => {
        const next = [...current];

        for (const file of picked) {
          if (next.length >= MAX_FILES) {
            problems.push(
              `সর্বোচ্চ ${MAX_FILES.toLocaleString("bn-BD")}টি ফাইল যুক্ত করা যায় — "${file.name}" বাদ পড়েছে`,
            );
            continue;
          }
          if (!isAcceptedType(file)) {
            problems.push(`"${file.name}" — এই ধরনের ফাইল সমর্থিত নয়`);
            continue;
          }
          if (file.size > MAX_BYTES) {
            problems.push(
              `"${file.name}" — ${formatSize(file.size)}, সর্বোচ্চ ১০ এমবি পর্যন্ত দেওয়া যায়`,
            );
            continue;
          }
          if (next.some((f) => f.name === file.name && f.size === file.size)) {
            problems.push(`"${file.name}" — আগেই যুক্ত করা হয়েছে`);
            continue;
          }
          next.push(file);
        }

        return next;
      });

      setRejections(problems);
    },
    [],
  );

  const removeFile = useCallback((index: number) => {
    setFiles((current) => current.filter((_, i) => i !== index));
    setRejections([]);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label
          className="text-xs font-bold uppercase tracking-wider text-foreground"
          htmlFor="evidence"
        >
          প্রমাণ সংযুক্ত করুন
        </Label>
        <OptionalBadge />
      </div>

      <label
        className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-none border-2 border-dashed border-border bg-muted/20 p-5 text-center transition-all hover:border-foreground hover:bg-muted/40 sm:p-6"
        htmlFor="evidence"
      >
        <span className="grid size-11 place-items-center rounded-none border-2 border-primary/40 bg-background text-primary transition-transform group-hover:scale-105">
          <PaperclipIcon aria-hidden="true" className="size-5" />
        </span>
        <span>
          <span className="block text-xs font-bold uppercase tracking-wider text-foreground">
            ছবি, অডিও রেকর্ড বা নথি বেছে নিন
          </span>
          <span className="mt-1 block text-[11px] leading-relaxed text-muted-foreground">
            ব্যক্তিগত তথ্য আগে ঢেকে দিন • JPG, PNG, PDF, MP3 • প্রতিটি সর্বোচ্চ ১০ এমবি
          </span>
        </span>
      </label>

      <input
        accept={ACCEPT}
        className="sr-only"
        id="evidence"
        multiple
        onChange={handleSelect}
        type="file"
      />

      {/* Rejected picks — the reporter needs to know *why* a file they chose is missing. */}
      {rejections.length > 0 && (
        <ul
          className="space-y-1 rounded-none border-2 border-destructive bg-destructive/10 p-3"
          role="alert"
        >
          {rejections.map((message) => (
            <li
              className="flex items-start gap-2 text-[11px] font-medium text-destructive"
              key={message}
            >
              <TriangleAlertIcon
                aria-hidden="true"
                className="mt-0.5 size-3 shrink-0"
              />
              <span>{message}</span>
            </li>
          ))}
        </ul>
      )}

      {files.length > 0 && (
        <div className="rounded-none border-2 border-border bg-background">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-border px-3 py-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
              নির্বাচিত ফাইল ({files.length.toLocaleString("bn-BD")})
            </span>
            <Badge
              className="rounded-none border-border px-1.5 py-0 text-[9px] font-normal"
              variant="outline"
            >
              এখনো আপলোড হয়নি
            </Badge>
          </div>

          <ul aria-live="polite" className="divide-y divide-border">
            {files.map((file, index) => (
              <li
                className="flex items-center justify-between gap-3 px-3 py-2"
                key={`${file.name}-${file.size}`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <PaperclipIcon
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-primary"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-medium text-foreground">
                      {file.name}
                    </span>
                    <span className="block text-[10px] tabular-nums text-muted-foreground">
                      {formatSize(file.size)}
                    </span>
                  </span>
                </span>
                <button
                  aria-label={`"${file.name}" সরিয়ে ফেলুন`}
                  className={cn(
                    "grid size-8 shrink-0 cursor-pointer place-items-center rounded-none border-2 border-border bg-background text-muted-foreground transition-colors",
                    "hover:border-destructive hover:text-destructive",
                  )}
                  onClick={() => removeFile(index)}
                  type="button"
                >
                  <Trash2Icon aria-hidden="true" className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-[10px] leading-relaxed text-muted-foreground">
        ফাইল সংযুক্তি এখনো সক্রিয় হয়নি — নির্বাচিত ফাইলগুলো এই মুহূর্তে সার্ভারে পাঠানো হচ্ছে না।
        ক্লাউড স্টোরেজ যুক্ত হলে এখান থেকেই আপলোড হবে, এবং সংযুক্ত ছবির EXIF ও লোকেশন ট্যাগ মুছে ফেলা হবে।
      </p>
    </div>
  );
}
