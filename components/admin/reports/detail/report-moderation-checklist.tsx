"use client";

import { useState } from "react";
import { CheckSquare, Info, ListChecks } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const CHECKLIST_ITEMS = [
  {
    id: "check-pii",
    label: "ব্যক্তিগত পরিচয় ও যোগাযোগ তথ্য (ফোন, NID, ব্যাংক) রিডাক্ট করা হয়েছে",
  },
  {
    id: "check-language",
    label: "ভাষা নিরপেক্ষ, অবমাননাকর বা প্রতিহিংসামূলক শব্দমুক্ত রাখা হয়েছে",
  },
  {
    id: "check-evidence",
    label: "সংযুক্ত প্রমাণের ধরন ও গোপনীয়তা (পাবলিক/গোপন) ঠিক করা হয়েছে",
  },
  {
    id: "check-level",
    label: "প্রমাণের ওজন অনুযায়ী উপযুক্ত যাচাইয়ের স্তর নির্বাচন করা হয়েছে",
  },
];

export function ReportModerationChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checked).filter(Boolean).length;
  const isAllChecked = completedCount === CHECKLIST_ITEMS.length;

  return (
    <div className="border-2 border-foreground bg-card p-4 shadow-[3px_3px_0_var(--foreground)]">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <ListChecks className="size-4 text-primary" />
          <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
            মডারেশন সহায়িকা চেকলিস্ট
          </h3>
        </div>
        <span
          className={`text-[11px] font-bold ${
            isAllChecked ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {completedCount}/{CHECKLIST_ITEMS.length} সম্পন্ন
        </span>
      </div>

      <div className="mt-3 space-y-2.5">
        {CHECKLIST_ITEMS.map((item) => (
          <Label
            className="flex cursor-pointer items-start gap-2.5 text-xs select-none hover:text-foreground transition-colors font-normal"
            key={item.id}
          >
            <Checkbox
              checked={Boolean(checked[item.id])}
              className="mt-0.5 rounded-none border-2 border-foreground"
              onChange={() => toggle(item.id)}
            />
            <span
              className={`leading-tight ${
                checked[item.id] ? "line-through text-muted-foreground" : "text-foreground"
              }`}
            >
              {item.label}
            </span>
          </Label>
        ))}
      </div>

      <div className="mt-3.5 flex items-center gap-1.5 border-t border-border pt-2.5 text-[11px] text-muted-foreground">
        <Info className="size-3 shrink-0 text-primary" />
        <span>মডারেটরের আত্ম-যাচাইয়ের সুবিধার্থে এটি একটি স্থানীয় নির্দেশিকা।</span>
      </div>
    </div>
  );
}
