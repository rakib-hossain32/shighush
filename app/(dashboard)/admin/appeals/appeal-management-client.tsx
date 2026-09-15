"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileX } from "lucide-react";
import { AppealDetailSheet, AppealFilters, AppealStats, AppealsTable } from "@/components/admin/appeals";
import { Pagination } from "@/components/pagination";
import { updateAppealStatusAction } from "./actions";
import { toast } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Appeal, PaginationMeta } from "@/services";
import type { AppealDecisionStatus } from "./actions";

interface AppealManagementClientProps {
  appeals: Appeal[];
  meta: PaginationMeta;
}

export function AppealManagementClient({ appeals, meta }: AppealManagementClientProps) {
  const router = useRouter();
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleViewDetails = (appeal: Appeal) => {
    setSelectedAppeal(appeal);
    setIsSheetOpen(true);
  };

  const handleStatusUpdate = async (appealId: string, status: AppealDecisionStatus, resolution?: string) => {
    const result = await updateAppealStatusAction(appealId, status, resolution);
    
    if (result.success) {
      toast.success(result.message);
      router.refresh();
      return true;
    } else {
      toast.error(result.error);
      return false;
    }
  };

  const isEmpty = appeals.length === 0;

  return (
    <TooltipProvider><>
      {/* Stats Cards */}
      <AppealStats appeals={appeals} total={meta.total} />

      {/* Filters */}
      <AppealFilters />

      {/* Appeals List */}
      {isEmpty ? (
        <div className="border-2 border-border bg-card p-12 text-center">
          <div className="mx-auto grid size-16 place-items-center border-2 border-border bg-muted text-muted-foreground">
            <FileX className="size-8" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-foreground">
            কোনো আপিল নেই
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            প্রকাশিত নথি নিয়ে এখনো কোনো সংশোধনীর আবেদন আসেনি বা ফিল্টার অনুযায়ী কোনো ফলাফল নেই।
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AppealsTable appeals={appeals} onReview={handleViewDetails} />

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="border-t-2 border-border pt-6">
              <Pagination
                basePath="/admin/appeals"
                meta={meta}
                showSinglePage={false}
              />
            </div>
          )}
        </div>
      )}

      {/* Detail Sheet */}
      <AppealDetailSheet
        appeal={selectedAppeal}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onStatusUpdate={async (id, status, resolution) => Boolean(await handleStatusUpdate(id, status, resolution))}
      />
    </></TooltipProvider>
  );
}
