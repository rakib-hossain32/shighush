"use client";

import { useActionState, useState, useTransition } from "react";
import { Loader2, RefreshCw, Sparkles, UserRoundCheck } from "lucide-react";
import { assignModerator, type ModerationState } from "@/app/(dashboard)/admin/reports/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AssignReportButton({
  reportId,
  assignedId,
  moderators,
}: {
  reportId: string;
  assignedId?: string;
  moderators: Array<{ id: string; name: string }>;
}) {
  const [state, action, pending] = useActionState<ModerationState, FormData>(assignModerator, {});
  const [value, setValue] = useState(assignedId ?? "");
  const [isAutoPending, startAutoTransition] = useTransition();

  const handleAutoAssign = () => {
    startAutoTransition(async () => {
      const formData = new FormData();
      formData.append("reportId", reportId);
      formData.append("moderatorId", "auto");
      await action(formData);
    });
  };

  const isWorking = pending || isAutoPending;
  const currentAssignedMod = moderators.find((user) => user.id === value);

  return (
    <div className="space-y-3">
      <form action={action} className="grid gap-3">
        <input name="reportId" type="hidden" value={reportId} />
        <input name="moderatorId" type="hidden" value={value} />
        <Label className="sr-only" htmlFor="moderatorId">
          মডারেটর নির্বাচন করুন
        </Label>
        <Select value={value} onValueChange={(val) => setValue(val ?? "")}>
          <SelectTrigger
            className="h-10 w-full rounded-none border-2 border-border bg-background px-3 text-xs font-bold text-foreground shadow-none hover:border-foreground"
            id="moderatorId"
          >
            <SelectValue placeholder="দায়িত্বপ্রাপ্ত বাছাই করুন">
              {value === "auto"
                ? "🔄 স্বয়ংক্রিয় বণ্টন (Round Robin)"
                : currentAssignedMod?.name ??
                  (value === "" ? "দায়িত্ব দেওয়া হয়নি" : undefined)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="rounded-none border-2 border-foreground bg-card shadow-[4px_4px_0_var(--foreground)]">
            <SelectItem className="rounded-none text-xs font-medium cursor-pointer" value="">
              দায়িত্ব দেওয়া হয়নি
            </SelectItem>
            <SelectItem
              className="rounded-none text-xs font-bold text-primary cursor-pointer border-b border-border/60"
              value="auto"
            >
              🔄 স্বয়ংক্রিয় বণ্টন (Round Robin)
            </SelectItem>
            {moderators.map((user) => (
              <SelectItem className="rounded-none text-xs font-medium cursor-pointer" key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {!moderators.length && (
          <p className="text-xs leading-6 text-muted-foreground">
            কোনো Moderator পাওয়া যায়নি। আগে ব্যবহারকারী ব্যবস্থাপনা থেকে Moderator যোগ করুন।
          </p>
        )}
        {state.error && (
          <p className="text-sm text-destructive" role="alert">
            {state.error}
          </p>
        )}
        {state.ok && (
          <p className="text-sm text-secondary-foreground" role="status">
            দায়িত্ব হালনাগাদ হয়েছে।
          </p>
        )}

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button
            className="h-10 w-full cursor-pointer rounded-none border-2 border-foreground bg-primary px-3 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:pointer-events-none disabled:opacity-50"
            disabled={isWorking || (!moderators.length && !assignedId)}
            type="submit"
          >
            {pending ? <Loader2 className="animate-spin size-4" /> : <UserRoundCheck className="size-4" />}
            <span>{pending ? "সংরক্ষণ হচ্ছে…" : "দায়িত্ব সংরক্ষণ"}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleAutoAssign}
            disabled={isWorking || !moderators.length}
            className="h-10 w-full cursor-pointer rounded-none border-2 border-foreground bg-background px-3 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
          >
            {isAutoPending ? <Loader2 className="animate-spin size-4" /> : <RefreshCw className="size-3.5" />}
            <span>রাউন্ড-রবিন বণ্টন</span>
          </Button>
        </div>
      </form>

      <div className="flex items-center gap-1.5 rounded-none border border-border/80 bg-muted/30 px-2.5 py-1.5 text-[11px] text-muted-foreground">
        <Sparkles className="size-3 text-primary shrink-0" />
        <span>নতুন রিপোর্ট স্বয়ংক্রিয়ভাবে চক্রাকারে (১→২→৩) বণ্টন হয়।</span>
      </div>
    </div>
  );
}
