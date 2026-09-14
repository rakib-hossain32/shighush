/**
 * API response contract. Mirrors the Express API in WEBSITE_DOCUMENTATION_BN.md §10–§11.
 *
 * Every enum-shaped field imports its type from `@/lib/domain/enums` — this file must
 * never re-declare a union inline. That duplication is what previously let
 * `lib/report-data.ts` drift into Bengali string literals while this file used English
 * slugs, leaving the codebase with two incompatible `PublicReport` types.
 *
 * Client-safe (types only, plus the enum re-exports).
 */

import type {
  AppealReason,
  AppealStatus,
  DatePrecision,
  EvidenceType,
  EvidenceVisibility,
  FlagReason,
  InstitutionCategory,
  InstitutionType,
  MoneyType,
  NameVisibility,
  OfficeLevel,
  ReportCategory,
  ReportSort,
  ReportStatus,
  UserRole,
  VerificationLevel,
  VirusScanState,
} from "@/lib/domain/enums";

/**
 * Re-exported so a component can take every type it needs from one import.
 * These are aliases of the `@/lib/domain/enums` definitions, never redeclarations.
 */
export type {
  AppealReason,
  AppealStatus,
  DatePrecision,
  EvidenceType,
  EvidenceVisibility,
  FlagReason,
  InstitutionCategory,
  InstitutionType,
  MoneyType,
  NameVisibility,
  OfficeLevel,
  ReportCategory,
  ReportSort,
  ReportStatus,
  Tone,
  UserRole,
  VerificationLevel,
  VirusScanState,
} from "@/lib/domain/enums";

/* ------------------------------------------------------------------ *
 * Transport primitives
 * ------------------------------------------------------------------ */

export type ApiQueryValue = string | number | boolean | null | undefined;
export type ApiQuery = Record<string, ApiQueryValue | ApiQueryValue[] | readonly ApiQueryValue[]>;

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiListResponse<T> = { data: T[]; meta: PaginationMeta };
export type ApiSuccessResponse<T> = { data: T };

/** Location, capped at union granularity — see the §12 note in `lib/domain/geo.ts`. */
export type ApiLocation = {
  division?: string;
  district?: string;
  upazila?: string;
  /** Union or municipality slug from `AREAS`. */
  area?: string;
  officeName?: string;
};

export type IncidentDate = {
  from?: string;
  to?: string;
  precision?: DatePrecision;
};

export type ReportedMoney = {
  amount?: number;
  currency?: string;
  type?: MoneyType;
  /** Gazetted fee, when known — the gap is the story. */
  officialFee?: number;
};

/* ------------------------------------------------------------------ *
 * Query params
 * ------------------------------------------------------------------ */

export type ReportListParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: ReportCategory | ReportCategory[];
  institution?: string;
  area?: string | string[];
  verificationLevel?: VerificationLevel | VerificationLevel[];
  sort?: ReportSort;
};

export type InstitutionListParams = {
  page?: number;
  limit?: number;
  search?: string;
  type?: InstitutionType;
  category?: InstitutionCategory | InstitutionCategory[];
  area?: string | string[];
};

/** Staff-only. Adds the internal statuses and the PII filter. */
export type ModerationListParams = {
  view?: "all" | "active" | "completed";
  assignment?: "all" | "mine" | "unassigned";
  page?: number;
  limit?: number;
  search?: string;
  status?: ReportStatus | ReportStatus[] | readonly ReportStatus[];
  category?: ReportCategory | ReportCategory[] | readonly ReportCategory[];
  area?: string | string[];
  flaggedOnly?: boolean;
  sort?: ReportSort;
};

/* ------------------------------------------------------------------ *
 * Public read models
 * ------------------------------------------------------------------ */

export type EvidenceSummary = {
  id: string;
  type: EvidenceType;
  /** Moderator-written caption. Never the original filename (§15). */
  title: string;
  detail?: string;
  visibility: EvidenceVisibility;
  /** Present only when `visibility === "redacted_public"`. */
  publicPath?: string;
  /** Authenticated moderation response only. */
  reviewPath?: string;
  metadataRemovedAt?: string;
};

export type InstitutionRef = {
  id: string;
  nameBn: string;
  slug: string;
};

/**
 * A published report as a visitor sees it.
 *
 * There is intentionally no reporter field of any kind on this type — not an id,
 * not a hash. If it cannot be represented here, it cannot leak from a page (§15).
 */
export type PublicReport = {
  id: string;
  /** Numeric id behind the `শি-০০৪২` display form; render via `formatCaseId`. */
  publicId: number;
  slug: string;
  title: string;
  summary: string;
  narrative?: string;
  category: ReportCategory;
  status: ReportStatus;
  verificationLevel: VerificationLevel;
  institution: InstitutionRef;
  /** Fallback field when institution is not populated */
  institutionName?: string;
  /** True when the reporter explicitly could not identify the institution. */
  institutionNameUnknown?: boolean;
  location: ApiLocation;
  incidentDate?: IncidentDate;
  money?: ReportedMoney;
  evidence: EvidenceSummary[];
  /** Institution's right-to-reply, kept separate from the report body (§16.7). */
  responses?: InstitutionResponse[];
  timeline?: ReportTimelineEntry[];
  publishedAt: string;
  updatedAt: string;
};

export type InstitutionResponse = {
  id: string;
  institutionId: string;
  body: string;
  respondedAt: string;
  /** Whether the responder's authority to speak for the institution was verified. */
  verified: boolean;
};

export type ReportTimelineEntry = {
  id: string;
  status: ReportStatus;
  note?: string;
  at: string;
};

export type InstitutionMetrics = {
  totalReports: number;
  /** Last 90 days (§8). */
  recentReports: number;
  /** 0–1. Render with `formatBnPercent`. */
  evidenceRate: number;
  /** 0–1. Share of reports the institution has replied to. */
  responseRate: number;
  byCategory: Array<{ category: ReportCategory; count: number }>;
  /**
   * §8 weighted total. Present but NOT a corruption ranking — the doc forbids
   * presenting it as one, and `servicePopulation` is unavailable, so no rate is derived.
   */
  weightedReports?: number;
  lastUpdatedAt?: string;
};

export type Institution = {
  serviceArea: any;
  id: string;
  nameBn: string;
  nameEn?: string;
  slug: string;
  type: InstitutionType;
  category: InstitutionCategory;
  officeLevel: OfficeLevel;
  parentInstitutionSlug?: string;
  location: ApiLocation & { addressPublic?: string };
  website?: string;
  status: "active" | "archived";
  metrics?: InstitutionMetrics;
};

/** §7 — a person record exists only where the disclosure threshold is met. */
export type PublicPerson = {
  id: string;
  slug: string;
  /** Absent unless `nameVisibility !== "hidden"`. */
  fullName?: string;
  nameVisibility: NameVisibility;
  designation?: string;
  institution?: InstitutionRef;
  publicNote?: string;
  sourceLinks: string[];
  reportCount: number;
};

export type Statistics = {
  totals: {
    reports: number;
    institutions: number;
    evidenceAttachedReports: number;
    reportedAmountBdt?: number;
  };
  byCategory: Array<{ category: ReportCategory; count: number }>;
  byVerification: Array<{ level: VerificationLevel; count: number }>;
  byArea: Array<{ area: string; count: number; topCategory?: ReportCategory }>;
  trend: Array<{ period: string; count: number }>;
  generatedAt: string;
  /** Echoed back so a chart can state the window it is describing. */
  period?: string;
};

/* ------------------------------------------------------------------ *
 * Private case tracking (§12.4)
 * ------------------------------------------------------------------ */

export type CaseStatus = {
  publicId: number;
  status: ReportStatus;
  timeline: ReportTimelineEntry[];
  /** Moderator ↔ reporter messages, when the anonymous inbox is enabled. */
  messages: Array<{
    id: string;
    from: "moderator" | "reporter";
    body: string;
    at: string;
  }>;
  slug?: string;
};

/** Returned once, at submission time, and never retrievable again (§12.4). */
export type ReportSubmitResult = {
  publicId: number;
  caseId: string;
  secretToken: string;
};

/* ------------------------------------------------------------------ *
 * Staff read models
 * ------------------------------------------------------------------ */

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  lastLoginAt?: string;
};

/**
 * A report inside the moderation queue. Carries the private fields a moderator needs
 * and a visitor must never receive, so the two shapes stay distinguishable by type.
 */
export type ModerationReport = PublicReport & {
  /** Submitted narrative before redaction. */
  rawNarrative: string;
  /** PII labels detected in `rawNarrative` — see `lib/domain/pii.ts`. */
  piiFindings: string[];
  accused?: Array<{ nameSubmitted?: string; designationSubmitted?: string }>;
  moderatorNotes: Array<{
    id: string;
    author: string;
    body: string;
    at: string;
  }>;
  redactionNotes?: string;
  submittedAt: string;
  /** Set once a moderator takes the item, to avoid two people reviewing one report. */
  assignedTo?: { id: string; name: string };
};

export type Appeal = {
  id: string;
  caseId: string;
  reportSlug?: string;
  reason: AppealReason;
  detail: string;
  status: AppealStatus;
  receivedAt: string;
  resolvedAt?: string;
};

export type Flag = {
  id: string;
  reportSlug: string;
  reportTitle: string;
  reason: FlagReason;
  detail?: string;
  status: "open" | "actioned" | "dismissed";
  raisedAt: string;
};

/** §10 `auditLogs` — append-only. Every staff decision lands here. */
export type AuditLogEntry = {
  id: string;
  actor: { id: string; name: string; role: UserRole };
  action: string;
  target: {
    type: "report" | "institution" | "person" | "user" | "appeal" | "flag";
    id: string;
  };
  summary: string;
  at: string;
};

export type EvidenceRecord = EvidenceSummary & {
  reportSlug: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  sha256: string;
  virusScan: VirusScanState;
  reviewedAt?: string;
};

/* ------------------------------------------------------------------ *
 * Dashboard metrics
 * ------------------------------------------------------------------ */

export type OverviewMetric = {
  key: string;
  label: string;
  value: number;
  delta: number | null;
  lowerIsBetter: boolean;
  footnote: string;
  href?: string;
};
