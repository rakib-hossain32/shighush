import { Shield, AlertTriangle } from "lucide-react";
import { AccessDenied } from "@/components/admin/access-denied";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AppealManagementClient } from "./appeal-management-client";
import { guard } from "@/lib/auth/dal";
import { getAppeals } from "@/services";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "আপিল ব্যবস্থাপনা",
  description: "সংশোধনী, গোপনীয়তা ও জবাব-সংক্রান্ত আবেদন পর্যালোচনা ও সমাধান।",
  index: false,
});

type AppealsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminAppealsPage({ searchParams }: AppealsPageProps) {
  const access = await guard("appeal:handle", "/admin/appeals");
  if (!access.allowed) {
    return (
      <AccessDenied capability={access.capability} role={access.session.role} />
    );
  }

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 50;
  const status = params.status as string | undefined;
  const reason = params.reason as string | undefined;
  const search = params.search as string | undefined;

  // Build query params
  const queryParams: any = { page, limit };
  if (status && status !== "all") queryParams.status = status;
  if (reason && reason !== "all") queryParams.reason = reason;
  if (search) queryParams.search = search;

  const response = await getAppeals(queryParams);
  const appeals = Array.isArray(response?.data) ? response.data : [];
  const meta = response?.meta || { page: 1, limit: 50, total: 0, totalPages: 0 };

  const pending = appeals.filter(
    (appeal) => appeal.status === "received" || appeal.status === "in_review"
  ).length;

  const priority = appeals.filter(
    (appeal) => appeal.reason === "privacy_risk" && (appeal.status === "received" || appeal.status === "in_review")
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        actions={
          <div className="flex items-center gap-2">
            {priority > 0 && (
              <div className="inline-flex items-center gap-1.5 border-2 border-destructive bg-destructive text-white px-3 py-1.5 text-xs font-bold shadow-[2px_2px_0_rgba(0,0,0,0.2)]">
                <Shield className="size-3.5" />
                <span>{priority}টি জরুরি</span>
              </div>
            )}
            {pending > 0 && (
              <div className="inline-flex items-center gap-1.5 border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 px-3 py-1.5 text-xs font-bold shadow-[2px_2px_0_rgba(0,0,0,0.1)]">
                <AlertTriangle className="size-3.5" />
                <span>{pending}টি অপেক্ষমাণ</span>
              </div>
            )}
          </div>
        }
        description="ভুল তথ্য, গোপনীয়তার ঝুঁকি বা প্রতিষ্ঠানের জবাব যুক্ত করার আবেদন। গোপনীয়তা-সংক্রান্ত আপিল ২৪-৪৮ ঘণ্টার মধ্যে অগ্রাধিকার পায়।"
        title="আপিল ও সংশোধনী ব্যবস্থাপনা"
      />

      {/* Priority Alert Banner */}
      {priority > 0 && (
        <div className="flex items-start gap-3 border-2 border-destructive bg-destructive/5 p-4 shadow-[3px_3px_0_var(--foreground)]">
          <Shield className="size-5 text-destructive shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold text-destructive">
              {priority}টি জরুরি গোপনীয়তা ঝুঁকির আপিল অপেক্ষমাণ
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              এই আপিলগুলো ব্যক্তিগত তথ্য ফাঁসের ঝুঁকি নিয়ে করা হয়েছে। অগ্রাধিকার ভিত্তিতে
              ২৪-৪৮ ঘণ্টার মধ্যে পর্যালোচনা করুন।
            </p>
          </div>
        </div>
      )}

      {/* Client Component with all interactive features */}
      <AppealManagementClient appeals={appeals} meta={meta} />
    </div>
  );
}
