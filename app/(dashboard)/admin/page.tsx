import { requireSession } from "@/lib/auth/dal";
import { can } from "@/lib/auth/permissions";
import { createPageMetadata } from "@/lib/seo";
import {
  getAuditLogs,
  getDashboardStats,
  getModerationQueue,
  getStatistics,
  getUsers,
  type AuditLogEntry,
  type ModerationReport,
  type StaffUser,
} from "@/services";

import { OverviewHeader } from "@/components/admin/overview/overview-header";
import { OverviewStatCards, type DashboardStatsData } from "@/components/admin/overview/overview-stat-cards";
import { OverviewQuickTools } from "@/components/admin/overview/overview-quick-tools";
import { OverviewQueueSection } from "@/components/admin/overview/overview-queue-section";
import { OverviewCategoryDistribution } from "@/components/admin/overview/overview-category-distribution";
import { OverviewInsightsCharts } from "@/components/admin/overview/overview-insights-charts";
import { OverviewTeamAndAudit } from "@/components/admin/overview/overview-team-and-audit";

export const metadata = createPageMetadata({
  title: "সারসংক্ষেপ ও কন্ট্রোল প্যানেল",
  description: "মডারেশন কিউ, প্ল্যাটফর্মের অবস্থা ও সার্বিক কন্ট্রোল প্যানেল।",
  index: false,
});

export default async function AdminOverviewPage() {
  const session = await requireSession("/admin");

  const canManageUsers = can(session.role, "user:read");
  const canViewAudit = can(session.role, "audit:read");

  // Fetch all dashboard data concurrently with safe fallbacks
  const [
    statsRes,
    platformStatsRes,
    queueRes,
    myQueueRes,
    publishedRes,
    usersRes,
    auditRes,
  ] = await Promise.allSettled([
    getDashboardStats(),
    getStatistics({ scope: "all" }),
    getModerationQueue({
      limit: 6,
      status: ["submitted", "under_review", "needs_info"],
    }),
    getModerationQueue({
      limit: 6,
      assignment: "mine",
    }),
    getModerationQueue({
      limit: 4,
      status: ["published"],
    }),
    canManageUsers ? getUsers({ role: "Moderator" }) : Promise.resolve(null),
    canViewAudit ? getAuditLogs({ limit: 6 }) : Promise.resolve(null),
  ]);

  // Safe data unpackers
  const statsData = statsRes.status === "fulfilled" && statsRes.value?.data ? statsRes.value.data : null;
  const platformStats = platformStatsRes.status === "fulfilled" && platformStatsRes.value?.data ? platformStatsRes.value.data : null;

  const rawMetrics = statsData?.metrics || [];
  const totalCount = rawMetrics.find((m) => m.key === "total")?.value ?? 0;
  const queueCount = rawMetrics.find((m) => m.key === "queue" || m.key === "pending")?.value ?? 0;
  const publishedCount = rawMetrics.find((m) => m.key === "published")?.value ?? 0;
  const todayCount = rawMetrics.find((m) => m.key === "today")?.value ?? 0;

  // PII alerts
  const piiAlertsArray: ModerationReport[] =
    statsData?.piiAlerts && Array.isArray(statsData.piiAlerts)
      ? statsData.piiAlerts
      : [];

  // Queues
  const awaitingReview: ModerationReport[] =
    queueRes.status === "fulfilled" && Array.isArray(queueRes.value?.data)
      ? queueRes.value.data
      : [];

  const myAssigned: ModerationReport[] =
    myQueueRes.status === "fulfilled" && Array.isArray(myQueueRes.value?.data)
      ? myQueueRes.value.data
      : [];

  const recentlyPublished: ModerationReport[] =
    publishedRes.status === "fulfilled" && Array.isArray(publishedRes.value?.data)
      ? publishedRes.value.data
      : [];

  // Staff & Audits
  const moderators: StaffUser[] =
    usersRes.status === "fulfilled" && Array.isArray(usersRes.value?.data)
      ? usersRes.value.data
      : [];

  const auditLogs: AuditLogEntry[] =
    auditRes.status === "fulfilled" && Array.isArray(auditRes.value?.data)
      ? auditRes.value.data
      : [];

  // Prepared stat cards data
  const statCardsData: DashboardStatsData = {
    totalReports: totalCount,
    awaitingReview: queueCount,
    publishedReports: publishedCount,
    todayReports: todayCount,
    piiAlertsCount: piiAlertsArray.length,
    reportedAmountBdt: platformStats?.totals?.reportedAmountBdt,
  };

  const byCategory = platformStats?.byCategory || [];
  const byVerification = platformStats?.byVerification || [];
  const byArea = platformStats?.byArea || [];
  const byInstitution = platformStats?.byInstitution || [];
  const byAccused = platformStats?.byAccused || [];
  const byService = platformStats?.byService || [];

  return (
    <div className="space-y-8">
      {/* 1. Hero & Welcome Header */}
      <OverviewHeader session={session} />

      {/* 2. KPI Metrics Grid */}
      <OverviewStatCards stats={statCardsData} />

      {/* 3. Command Center Quick Tools */}
      <OverviewQuickTools
        canManageUsers={canManageUsers}
        canViewAudit={canViewAudit}
      />

      {/* 4. Tabbed Moderation Queue Section */}
      <OverviewQueueSection
        currentUserId={session.userId}
        myAssignedReports={myAssigned}
        awaitingReviewReports={awaitingReview}
        piiAlertReports={piiAlertsArray}
        recentlyPublishedReports={recentlyPublished}
      />

      {/* 5. Distribution & Integrity Breakdown */}
      <OverviewCategoryDistribution
        byCategory={byCategory}
        byVerification={byVerification}
        totalReports={totalCount}
      />

      {/* 6. Deep Insights — Area / Institution / Accused / Service */}
      <OverviewInsightsCharts
        byArea={byArea}
        byInstitution={byInstitution}
        byAccused={byAccused}
        byService={byService}
        totalReports={totalCount}
      />

      {/* 7. Moderator Team Roster & Audit Stream */}
      <OverviewTeamAndAudit
        canManageUsers={canManageUsers}
        canViewAudit={canViewAudit}
        moderators={moderators}
        auditLogs={auditLogs}
      />
    </div>
  );
}
