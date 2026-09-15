"use client";

import { Copy, Mail, LockKeyhole, MailWarning } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Appeal } from "@/services";

export function AppealContactPanel({ appeal }: { appeal: Appeal }) {
  const email = appeal.contactEmail;
  const subject = `Shighush appeal ${appeal.id} | ${appeal.caseId}`;
  const body = `Case ID: ${appeal.caseId}\nAppeal ID: ${appeal.id}\n\n`;
  return (
    <section className="space-y-3 border-y border-border py-5">
      <h3 className="flex items-center gap-2 text-sm font-bold"><Mail className="size-4" /> আবেদনকারীর সঙ্গে যোগাযোগ</h3>
      {email ? <>
        <div className="flex min-w-0 items-center gap-2">
          <span className="min-w-0 flex-1 break-all text-sm font-medium">{email}</span>
          <Tooltip><TooltipTrigger render={<Button className="rounded-none" variant="ghost" size="icon" aria-label="ইমেইল কপি করুন" onClick={async () => { try { await navigator.clipboard.writeText(email); toast.success("ইমেইল কপি হয়েছে"); } catch { toast.error("কপি করা যায়নি"); } }} />}><Copy /></TooltipTrigger><TooltipContent>ইমেইল কপি করুন</TooltipContent></Tooltip>
        </div>
        <Button asChild variant="outline" className="w-full rounded-none border-2 border-foreground shadow-[2px_2px_0_var(--foreground)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none sm:w-auto"><a href={`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}><Mail /> ইমেইল লিখুন</a></Button>
        <p className="text-xs leading-relaxed text-muted-foreground">এই বোতাম আপনার email app খুলবে; dashboard থেকে কোনো message পাঠানো হবে না। Case ও Appeal ID দিয়ে একই আবেদন শনাক্ত করুন।</p>
      </> : <p className="flex items-start gap-2 text-sm text-muted-foreground"><MailWarning className="mt-0.5 size-4 shrink-0 text-amber-600" />ইমেইল দেওয়া হয়নি। এই আবেদনকারীর সঙ্গে সরাসরি যোগাযোগ করা যাবে না।</p>}
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><LockKeyhole className="size-3.5 shrink-0" /> যোগাযোগের তথ্য শুধু অনুমোদিত staff-এর জন্য।</p>
    </section>
  );
}
