"use client";

import { useTransition } from "react";
import { UserCheckIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { assignToMe } from "@/app/(dashboard)/admin/reports/actions";

export function AssignReportButton({
  reportId,
  isAssigned,
  assignedName,
}: {
  reportId: string;
  isAssigned?: boolean;
  assignedName?: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleAssign = () => {
    startTransition(async () => {
      const res = await assignToMe(reportId);
      if (res.ok) {
        toast.success("নথির রিভিউ দায়িত্ব নেওয়া হয়েছে!", {
          description: "এখন আপনি নথিটি পর্যালোচনা ও মডারেশন করতে পারবেন।",
        });
      } else {
        toast.error("দায়িত্ব নেওয়া সম্ভব হয়নি", {
          description: res.error,
        });
      }
    });
  };

  if (isAssigned) {
    return (
      <div className="flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
        <UserCheckIcon className="h-3.5 w-3.5 shrink-0" />
        <span>{assignedName ?? "দায়িত্ব নেওয়া হয়েছে"}</span>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleAssign}
      disabled={isPending}
      className="cursor-pointer gap-1.5"
    >
      {isPending ? (
        <>
          <Loader2Icon className="h-4 w-4 animate-spin" />
          দায়িত্ব নেওয়া হচ্ছে...
        </>
      ) : (
        <>
          <UserCheckIcon className="h-4 w-4 text-primary" />
          দায়িত্ব নিন
        </>
      )}
    </Button>
  );
}
