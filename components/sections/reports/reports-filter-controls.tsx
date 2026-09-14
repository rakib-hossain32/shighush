"use client";

import { useState } from "react";
import { Check, Filter, RotateCcw, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  REPORT_CATEGORIES,
  REPORT_CATEGORY_META,
  VERIFICATION_LEVELS,
  VERIFICATION_LEVEL_META,
} from "@/lib/domain/enums";
import { AREAS } from "@/lib/domain/geo";
import type { ReportFilterInput } from "@/lib/domain/schemas";
import { cn } from "@/lib/utils";

type Props = {
  filters: ReportFilterInput;
};

export function ReportsFilterControls({ filters }: Props) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<string[]>(filters.category);
  const [verification, setVerification] = useState<string[]>(filters.verificationLevel);
  const [area, setArea] = useState<string[]>(filters.area);
  const [institution, setInstitution] = useState(filters.institution ?? "");

  const activeCount = category.length + verification.length + area.length + (institution ? 1 : 0);
  const formId = "reports-filter-form";

  const toggle = (current: string[], value: string, setter: (next: string[]) => void) => {
    setter(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  const clearDraft = () => {
    setCategory([]);
    setVerification([]);
    setArea([]);
    setInstitution("");
  };

  const submitFilters = () => {
    setOpen(false);
    window.requestAnimationFrame(() => {
      (document.getElementById(formId) as HTMLFormElement | null)?.requestSubmit();
    });
  };

  const selectedLabels = [
    ...category.map((value) => REPORT_CATEGORY_META[value as keyof typeof REPORT_CATEGORY_META]?.short),
    ...verification.map((value) => VERIFICATION_LEVEL_META[value as keyof typeof VERIFICATION_LEVEL_META]?.short),
    ...area
      .map((value) => AREAS.find((item) => item.slug === value)?.nameBn)
      .filter(Boolean),
    ...(institution ? [institution] : []),
  ].filter(Boolean) as string[];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        aria-expanded={open}
        className="h-9 gap-2 border border-foreground bg-background px-3 text-xs font-bold shadow-[2px_2px_0_var(--foreground)] hover:bg-muted"
        onClick={() => setOpen(true)}
        type="button"
        variant="outline"
      >
        <Filter className="size-3.5 text-primary" />
        <span>ফিল্টার</span>
        {activeCount > 0 ? (
          <span className="grid size-5 place-items-center rounded-full bg-primary text-[10px] font-black text-primary-foreground">
            {activeCount}
          </span>
        ) : null}
      </Button>

      {selectedLabels.slice(0, 3).map((label) => (
        <Badge className="h-7 max-w-40 rounded-full border-primary/30 bg-primary/10 px-2.5 text-[11px] text-primary" key={label} variant="outline">
          <span className="truncate">{label}</span>
        </Badge>
      ))}
      {selectedLabels.length > 3 ? (
        <Badge className="h-7 rounded-full px-2.5 text-[11px]" variant="secondary">
          +{selectedLabels.length - 3}
        </Badge>
      ) : null}

      <div className="sr-only" aria-hidden="true">
        {category.map((value) => <input key={`category-${value}`} name="category" value={value} readOnly />)}
        {verification.map((value) => <input key={`verification-${value}`} name="verificationLevel" value={value} readOnly />)}
        {area.map((value) => <input key={`area-${value}`} name="area" value={value} readOnly />)}
        <input name="institution" value={institution} readOnly />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[88vh] overflow-y-auto border-2 border-foreground p-0 shadow-[6px_6px_0_var(--foreground)] sm:max-w-2xl">
          <DialogHeader className="border-b border-border bg-muted/30 px-5 py-5 text-left sm:px-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Search className="size-3.5" />
              ফলাফল সাজান
            </div>
            <DialogTitle className="text-xl font-black">আপনার প্রয়োজনের নথি খুঁজুন</DialogTitle>
            <DialogDescription>একাধিক ধরন, যাচাইয়ের স্তর বা এলাকা একসঙ্গে বেছে নিতে পারেন।</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 px-5 py-5 sm:grid-cols-2 sm:px-6">
            <FilterSection title="প্রতিষ্ঠান / অফিস" description="নাম বা শাখার অংশ লিখুন">
              <Input
                className="h-10 rounded-lg"
                onChange={(event) => setInstitution(event.target.value)}
                placeholder="যেমন: উপজেলা শিক্ষা অফিস"
                value={institution}
              />
            </FilterSection>

            <FilterSection title="প্রশাসনিক এলাকা" description="ইউনিয়ন বা পৌরসভা স্তর">
              <Select
                onValueChange={(value) => setArea(value && value !== "all" ? [value] : [])}
                value={area[0] ?? "all"}
              >
                <SelectTrigger className="h-10 rounded-lg text-sm">
                  <SelectValue placeholder="সব এলাকা" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব এলাকা</SelectItem>
                  {AREAS.map((item) => <SelectItem key={item.slug} value={item.slug}>{item.nameBn}</SelectItem>)}
                </SelectContent>
              </Select>
            </FilterSection>

            <FilterSection className="sm:col-span-2" title="অভিযোগের ধরন" description="যে ধরনের অনিয়মের নথি দেখতে চান">
              <div className="grid gap-2 sm:grid-cols-2">
                {REPORT_CATEGORIES.map((value) => (
                  <ChoiceRow
                    checked={category.includes(value)}
                    key={value}
                    label={REPORT_CATEGORY_META[value].label}
                    onChange={() => toggle(category, value, setCategory)}
                  />
                ))}
              </div>
            </FilterSection>

            <FilterSection className="sm:col-span-2" title="যাচাইয়ের স্তর" description="নথির নির্ভরযোগ্যতা অনুযায়ী বেছে নিন">
              <div className="grid gap-2 sm:grid-cols-3">
                {VERIFICATION_LEVELS.map((value) => (
                  <ChoiceRow
                    checked={verification.includes(value)}
                    key={value}
                    label={VERIFICATION_LEVEL_META[value].label}
                    onChange={() => toggle(verification, value, setVerification)}
                  />
                ))}
              </div>
            </FilterSection>
          </div>

          <DialogFooter className="flex-row items-center justify-between border-t border-border bg-muted/20 px-5 py-4 sm:px-6">
            <Button className="gap-1.5 text-xs" onClick={clearDraft} type="button" variant="ghost">
              <RotateCcw className="size-3.5" /> রিসেট
            </Button>
            <Button className="gap-1.5 px-5" onClick={submitFilters} type="button">
              <Check className="size-4" /> ফলাফল দেখুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FilterSection({ title, description, className, children }: { title: string; description: string; className?: string; children: React.ReactNode }) {
  return (
    <section className={cn("space-y-2", className)}>
      <div>
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

function ChoiceRow({ checked, label, onChange }: { checked: boolean; label: string; onChange: () => void }) {
  return (
    <label className={cn("flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-xs transition-colors", checked ? "border-primary/50 bg-primary/10 text-foreground" : "border-border bg-background hover:border-primary/40 hover:bg-muted/50")}>
      <span className="font-medium">{label}</span>
      <Checkbox checked={checked} onChange={onChange} />
    </label>
  );
}
