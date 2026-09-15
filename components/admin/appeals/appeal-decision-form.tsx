"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, ClipboardCheck, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { Appeal } from "@/services";
import { isAppealPending, type AppealStatusUpdater } from "./appeal-utils";

export function AppealDecisionForm({ appeal, onStatusUpdate, onDone }: { appeal: Appeal; onStatusUpdate: AppealStatusUpdater; onDone: () => void }) {
  const [decision, setDecision] = useState<"upheld" | "rejected">("upheld");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  if (!isAppealPending(appeal)) return null;
  return <section className="space-y-4">
    <h3 className="flex items-center gap-2 text-sm font-bold"><ClipboardCheck className="size-4" /> পর্যালোচনার সিদ্ধান্ত</h3>
    {appeal.status === "received" && <Button className="rounded-none border-2 border-foreground shadow-[2px_2px_0_var(--foreground)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none" variant="outline" disabled={pending} onClick={() => startTransition(async () => { await onStatusUpdate(appeal.id, "in_review"); })}><ClipboardCheck /> পর্যালোচনা শুরু করুন</Button>}
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); if (!note.trim()) { setError("গ্রহণ বা খারিজের কারণ লিখুন।"); return; } setError(""); startTransition(async () => { if (await onStatusUpdate(appeal.id, decision, note.trim())) onDone(); }); }}>
      <div className="space-y-2"><Label htmlFor="appeal-decision">সিদ্ধান্ত</Label><Select value={decision} onValueChange={(value) => { if (value === "upheld" || value === "rejected") setDecision(value); }} disabled={pending}>
        <SelectTrigger id="appeal-decision" className="w-full rounded-none border-2 border-border"><SelectValue>{decision === "upheld" ? "আপিল গ্রহণ" : "আপিল খারিজ"}</SelectValue></SelectTrigger>
        <SelectContent className="rounded-none border-2 border-foreground shadow-[4px_4px_0_var(--foreground)]"><SelectItem className="rounded-none" value="upheld"><CheckCircle2 /> আপিল গ্রহণ</SelectItem><SelectItem className="rounded-none" value="rejected"><XCircle /> আপিল খারিজ</SelectItem></SelectContent>
      </Select></div>
      <div className="space-y-2"><Label htmlFor="appeal-resolution">{decision === "upheld" ? "কী ব্যবস্থা নেওয়া হয়েছে?" : "কেন খারিজ করা হচ্ছে?"} <span className="text-destructive">*</span></Label><Textarea id="appeal-resolution" value={note} onChange={(event) => { setNote(event.target.value); setError(""); }} maxLength={2000} rows={4} required disabled={pending} aria-invalid={!!error} aria-describedby="appeal-note-help" className="resize-y rounded-none border-2 border-border" />
        <p id="appeal-note-help" className="text-xs text-muted-foreground">এই নোট applicant-এর সিদ্ধান্তের ইমেইলে থাকবে। ব্যক্তিগত বা অভ্যন্তরীণ staff তথ্য লিখবেন না।</p>
        {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">আপিল গ্রহণ করলে মূল রিপোর্ট নিজে থেকে বদলাবে না। প্রয়োজনীয় সংশোধন রিপোর্টের review page-এ সম্পন্ন করুন।</p>
      <Button type="submit" variant={decision === "rejected" ? "destructive" : "default"} disabled={pending} className="w-full rounded-none border-2 border-foreground shadow-[2px_2px_0_var(--foreground)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">{pending ? <Loader2 className="animate-spin" /> : <ClipboardCheck />}{pending ? "সংরক্ষণ হচ্ছে..." : "সিদ্ধান্ত সংরক্ষণ করুন"}</Button>
    </form>
  </section>;
}
