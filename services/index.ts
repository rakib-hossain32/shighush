/**
 * Public surface of the API client layer.
 *
 * Phase 2 swap: pages currently import query functions from `@/lib/mock/queries`; the
 * signatures here match, so switching a page to live data is a one-line import change.
 */

export { ApiError, isApiError } from "@/services/_shared/api-error";
export { loginRequest } from "@/services/auth/auth.service";

// Reports
export {
  getInstitutionBySlug,
  getInstitutions,
} from "@/services/institutions/institutions.service";

// Reports
export {
  getReportBySlug,
  getReports,
  submitReport,
  getReportByCase,
  type CaseTrackResult,
} from "@/services/reports/reports.service";

// Statistics
export { getStatistics } from "@/services/statistics/statistics.service";

// Admin
export {
  getDashboardStats,
  getUsers,
  createUser,
  updateUserRole,
  getAuditLogs,
  getModerationQueue,
  getModerationReport,
  updateReportStatus,
  assignReport,
  redactReport,
  type DashboardMetric,
  type DashboardStats,
  type UserListParams,
  type AuditLogListParams,
} from "@/services/admin/admin.service";

// Appeals
export {
  getAppeals,
  getAppealById,
  submitAppeal,
  updateAppealStatus,
  type AppealListParams,
} from "@/services/appeals/appeals.service";

// Flags
export {
  getFlags,
  getFlagById,
  submitFlag,
  updateFlagStatus,
  type FlagListParams,
} from "@/services/flags/flags.service";

// People
export {
  getPeople,
  getPersonBySlug,
  createPerson,
  updatePersonVisibility,
  type PeopleListParams,
} from "@/services/people/people.service";

// Evidence
export {
  getReportEvidence,
  uploadEvidence,
  verifyEvidence,
  deleteEvidence,
} from "@/services/evidence/evidence.service";

// Types
export type * from "@/services/_shared/types";
