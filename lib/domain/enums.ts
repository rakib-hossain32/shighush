/**
 * Canonical domain vocabulary for শিঘুষ — the single source of truth.
 *
 * Rules for this file:
 *  1. Stored/transported values are ALWAYS English snake_case slugs.
 *     Bengali text lives only in the `*_META` registries below, as display data.
 *  2. Every enum ships a `*_META` registry with `{ label, short, tone }` so the UI
 *     never hand-writes a colour ternary. Change a tone here, it changes everywhere.
 *  3. These values must stay in sync with three things:
 *       - WEBSITE_DOCUMENTATION_BN.md §4, §10, §19
 *       - seed-data/shibchar-institutions.json
 *       - the Express API + Mongoose enums
 *     The seed data is authoritative where it extends the doc (e.g. `semi_government`,
 *     `municipality`, `agriculture`) because those are real Shibchar offices.
 *
 * Client-safe: no `server-only`, no secrets. Forms and Server Components both import this.
 */

/** Semantic colour intent. Maps to theme tokens in `StatusBadge`, never to raw hex. */
export type Tone = "neutral" | "muted" | "info" | "success" | "warning" | "danger";

type Meta<T extends string> = Record<T, { label: string; short: string; tone: Tone }>;

/* ------------------------------------------------------------------ *
 * Report category — WEBSITE_DOCUMENTATION_BN.md §19
 * ------------------------------------------------------------------ */

export const REPORT_CATEGORIES = [
  "bribery",
  "extortion",
  "service_denial",
  "harassment",
  "abuse_of_power",
  "procurement_irregularity",
  "fraud",
  "other",
] as const;

export type ReportCategory = (typeof REPORT_CATEGORIES)[number];

export const REPORT_CATEGORY_META = {
  bribery: { label: "ঘুষ / অতিরিক্ত অর্থ", short: "ঘুষ", tone: "danger" },
  extortion: { label: "চাঁদাবাজি", short: "চাঁদাবাজি", tone: "danger" },
  service_denial: { label: "সেবা-বঞ্চনা", short: "সেবা-বঞ্চনা", tone: "warning" },
  harassment: { label: "হয়রানি", short: "হয়রানি", tone: "warning" },
  abuse_of_power: { label: "ক্ষমতার অপব্যবহার", short: "ক্ষমতার অপব্যবহার", tone: "danger" },
  procurement_irregularity: { label: "ক্রয়ে অনিয়ম", short: "ক্রয়-অনিয়ম", tone: "warning" },
  fraud: { label: "প্রতারণা", short: "প্রতারণা", tone: "danger" },
  other: { label: "অন্যান্য", short: "অন্যান্য", tone: "neutral" },
} satisfies Meta<ReportCategory>;

/* ------------------------------------------------------------------ *
 * Verification level — §4. This is the platform's core trust signal.
 * Order matters: it is a ladder, low → high. Never reorder without
 * checking `compareVerification` callers.
 * ------------------------------------------------------------------ */

export const VERIFICATION_LEVELS = [
  "unverified",
  "evidence_attached",
  "corroborated",
  "official_record",
] as const;

export type VerificationLevel = (typeof VERIFICATION_LEVELS)[number];

export const VERIFICATION_LEVEL_META = {
  unverified: { label: "অযাচাইকৃত", short: "অযাচাই", tone: "muted" },
  evidence_attached: { label: "প্রমাণ সংযুক্ত", short: "প্রমাণ", tone: "success" },
  corroborated: { label: "একাধিক সূত্রে সমর্থিত", short: "সমর্থিত", tone: "success" },
  official_record: { label: "সরকারি নথিভুক্ত", short: "নথিভুক্ত", tone: "info" },
} satisfies Meta<VerificationLevel>;

/** Rank on the trust ladder. Higher = more independently confirmed. */
export function verificationRank(level: VerificationLevel): number {
  return VERIFICATION_LEVELS.indexOf(level);
}

/* ------------------------------------------------------------------ *
 * Report status — full internal lifecycle, §4 + §10.
 * The public API only ever returns a status in PUBLIC_REPORT_STATUSES;
 * the moderation queue works across MODERATION_STATUSES.
 * ------------------------------------------------------------------ */

export const REPORT_STATUSES = [
  "draft",
  "submitted",
  "needs_info",
  "under_review",
  "published",
  "resolved",
  "rejected",
  "removed",
  "archived",
] as const;

export type ReportStatus = (typeof REPORT_STATUSES)[number];

export const REPORT_STATUS_META = {
  draft: { label: "খসড়া", short: "খসড়া", tone: "muted" },
  submitted: { label: "জমা হয়েছে", short: "জমা", tone: "info" },
  needs_info: { label: "অতিরিক্ত তথ্য প্রয়োজন", short: "তথ্য প্রয়োজন", tone: "warning" },
  under_review: { label: "রিভিউ চলছে", short: "রিভিউ", tone: "warning" },
  published: { label: "প্রকাশিত", short: "প্রকাশিত", tone: "success" },
  resolved: { label: "নিষ্পত্তি হয়েছে", short: "নিষ্পত্তি", tone: "success" },
  rejected: { label: "প্রত্যাখ্যাত", short: "প্রত্যাখ্যাত", tone: "danger" },
  removed: { label: "সরানো হয়েছে", short: "সরানো", tone: "danger" },
  archived: { label: "সংরক্ষিত", short: "সংরক্ষিত", tone: "neutral" },
} satisfies Meta<ReportStatus>;

/** Statuses a visitor may ever see. Anything else is staff-only. */
export const PUBLIC_REPORT_STATUSES = ["published", "resolved", "archived"] as const;
export type PublicReportStatus = (typeof PUBLIC_REPORT_STATUSES)[number];

/** Statuses that require moderator attention, in queue priority order. */
export const MODERATION_STATUSES = [
  "submitted",
  "needs_info",
  "under_review",
] as const satisfies readonly ReportStatus[];

export function isPubliclyVisible(status: ReportStatus): status is PublicReportStatus {
  return (PUBLIC_REPORT_STATUSES as readonly string[]).includes(status);
}

/* ------------------------------------------------------------------ *
 * Institution taxonomy — §10 + §19, widened by the real seed data.
 * ------------------------------------------------------------------ */

export const INSTITUTION_TYPES = [
  "government",
  "semi_government",
  "private",
  "ngo",
  "education",
  "other",
] as const;

export type InstitutionType = (typeof INSTITUTION_TYPES)[number];

export const INSTITUTION_TYPE_META = {
  government: { label: "সরকারি", short: "সরকারি", tone: "info" },
  semi_government: { label: "আধা-সরকারি", short: "আধা-সরকারি", tone: "info" },
  private: { label: "বেসরকারি", short: "বেসরকারি", tone: "neutral" },
  ngo: { label: "এনজিও", short: "এনজিও", tone: "neutral" },
  education: { label: "শিক্ষা প্রতিষ্ঠান", short: "শিক্ষা", tone: "neutral" },
  other: { label: "অন্যান্য", short: "অন্যান্য", tone: "neutral" },
} satisfies Meta<InstitutionType>;

export const OFFICE_LEVELS = [
  "national",
  "division",
  "district",
  "upazila",
  "municipality",
  "branch",
] as const;

export type OfficeLevel = (typeof OFFICE_LEVELS)[number];

export const OFFICE_LEVEL_META = {
  national: { label: "জাতীয়", short: "জাতীয়", tone: "neutral" },
  division: { label: "বিভাগীয়", short: "বিভাগ", tone: "neutral" },
  district: { label: "জেলা", short: "জেলা", tone: "neutral" },
  upazila: { label: "উপজেলা", short: "উপজেলা", tone: "neutral" },
  municipality: { label: "পৌরসভা", short: "পৌরসভা", tone: "neutral" },
  branch: { label: "শাখা", short: "শাখা", tone: "neutral" },
} satisfies Meta<OfficeLevel>;

/**
 * Service sector. Field name stays `category` to match
 * seed-data/shibchar-institutions.json without a translation step.
 */
export const INSTITUTION_CATEGORIES = [
  "land",
  "law_enforcement",
  "healthcare",
  "education",
  "utilities",
  "local_government",
  "agriculture",
  "social_services",
  "infrastructure",
  "technology",
  "statistics",
  "finance",
  "banking",
  "election",
  "transport",
  "immigration",
  "court_service",
  "private_service",
  "other",
] as const;

export type InstitutionCategory = (typeof INSTITUTION_CATEGORIES)[number];

export const INSTITUTION_CATEGORY_META = {
  land: { label: "ভূমি ও রেজিস্ট্রি", short: "ভূমি", tone: "neutral" },
  law_enforcement: { label: "আইন-শৃঙ্খলা", short: "আইন-শৃঙ্খলা", tone: "neutral" },
  healthcare: { label: "স্বাস্থ্যসেবা", short: "স্বাস্থ্য", tone: "neutral" },
  education: { label: "শিক্ষা", short: "শিক্ষা", tone: "neutral" },
  utilities: { label: "ইউটিলিটি সেবা", short: "ইউটিলিটি", tone: "neutral" },
  local_government: { label: "স্থানীয় সরকার", short: "স্থানীয় সরকার", tone: "neutral" },
  agriculture: { label: "কৃষি", short: "কৃষি", tone: "neutral" },
  social_services: { label: "সমাজসেবা", short: "সমাজসেবা", tone: "neutral" },
  infrastructure: { label: "অবকাঠামো", short: "অবকাঠামো", tone: "neutral" },
  technology: { label: "তথ্যপ্রযুক্তি", short: "প্রযুক্তি", tone: "neutral" },
  statistics: { label: "পরিসংখ্যান", short: "পরিসংখ্যান", tone: "neutral" },
  finance: { label: "অর্থ ও হিসাব", short: "অর্থ", tone: "neutral" },
  banking: { label: "ব্যাংকিং", short: "ব্যাংক", tone: "neutral" },
  election: { label: "নির্বাচন", short: "নির্বাচন", tone: "neutral" },
  transport: { label: "পরিবহন", short: "পরিবহন", tone: "neutral" },
  immigration: { label: "পাসপোর্ট ও অভিবাসন", short: "অভিবাসন", tone: "neutral" },
  court_service: { label: "আদালত সেবা", short: "আদালত", tone: "neutral" },
  private_service: { label: "বেসরকারি সেবা", short: "বেসরকারি", tone: "neutral" },
  other: { label: "অন্যান্য", short: "অন্যান্য", tone: "neutral" },
} satisfies Meta<InstitutionCategory>;

/* ------------------------------------------------------------------ *
 * Incident date, money, evidence
 * ------------------------------------------------------------------ */

export const DATE_PRECISIONS = ["exact", "month", "year", "unknown"] as const;
export type DatePrecision = (typeof DATE_PRECISIONS)[number];

export const DATE_PRECISION_META = {
  exact: { label: "নির্দিষ্ট তারিখ", short: "নির্দিষ্ট", tone: "success" },
  month: { label: "আনুমানিক মাস", short: "মাস", tone: "warning" },
  year: { label: "আনুমানিক বছর", short: "বছর", tone: "warning" },
  unknown: { label: "সময় জানা নেই", short: "অজানা", tone: "muted" },
} satisfies Meta<DatePrecision>;

export const MONEY_TYPES = ["requested", "paid", "unknown"] as const;
export type MoneyType = (typeof MONEY_TYPES)[number];

export const MONEY_TYPE_META = {
  requested: { label: "চাওয়া হয়েছে", short: "চাওয়া", tone: "warning" },
  paid: { label: "দেওয়া হয়েছে", short: "দেওয়া", tone: "danger" },
  unknown: { label: "জানা নেই", short: "অজানা", tone: "muted" },
} satisfies Meta<MoneyType>;

export const EVIDENCE_TYPES = ["image", "video", "audio", "document"] as const;
export type EvidenceType = (typeof EVIDENCE_TYPES)[number];

export const EVIDENCE_TYPE_META = {
  image: { label: "ছবি", short: "ছবি", tone: "neutral" },
  video: { label: "ভিডিও", short: "ভিডিও", tone: "neutral" },
  audio: { label: "অডিও", short: "অডিও", tone: "neutral" },
  document: { label: "নথি", short: "নথি", tone: "neutral" },
} satisfies Meta<EvidenceType>;

/** §12.5 — public and private evidence must never share a storage path. */
export const EVIDENCE_VISIBILITIES = ["private", "redacted_public"] as const;
export type EvidenceVisibility = (typeof EVIDENCE_VISIBILITIES)[number];

export const EVIDENCE_VISIBILITY_META = {
  private: { label: "গোপন (শুধু মডারেটর)", short: "গোপন", tone: "danger" },
  redacted_public: { label: "রিডাক্টেড, প্রকাশযোগ্য", short: "রিডাক্টেড", tone: "success" },
} satisfies Meta<EvidenceVisibility>;

export const VIRUS_SCAN_STATES = ["pending", "clean", "infected"] as const;
export type VirusScanState = (typeof VIRUS_SCAN_STATES)[number];

export const VIRUS_SCAN_META = {
  pending: { label: "স্ক্যান চলছে", short: "স্ক্যান", tone: "warning" },
  clean: { label: "নিরাপদ", short: "নিরাপদ", tone: "success" },
  infected: { label: "ক্ষতিকর ফাইল", short: "ক্ষতিকর", tone: "danger" },
} satisfies Meta<VirusScanState>;

/* ------------------------------------------------------------------ *
 * Person name disclosure — §7. The most legally sensitive enum here.
 * ------------------------------------------------------------------ */

export const NAME_VISIBILITIES = ["hidden", "approved", "official_record"] as const;
export type NameVisibility = (typeof NAME_VISIBILITIES)[number];

export const NAME_VISIBILITY_META = {
  hidden: { label: "নাম গোপন — পদবি ও দফতর দেখানো হবে", short: "নাম গোপন", tone: "muted" },
  approved: { label: "মডারেটর অনুমোদনে নাম প্রকাশ", short: "অনুমোদিত", tone: "warning" },
  official_record: { label: "সরকারি নথির ভিত্তিতে নাম প্রকাশ", short: "নথিভুক্ত", tone: "info" },
} satisfies Meta<NameVisibility>;

/* ------------------------------------------------------------------ *
 * Appeals & flags — §13, §16
 * ------------------------------------------------------------------ */

export const APPEAL_REASONS = [
  "incorrect_info",
  "privacy_risk",
  "institution_response",
  "other",
] as const;

export type AppealReason = (typeof APPEAL_REASONS)[number];

export const APPEAL_REASON_META = {
  incorrect_info: { label: "ভুল তথ্য", short: "ভুল তথ্য", tone: "warning" },
  privacy_risk: { label: "ব্যক্তিগত তথ্য প্রকাশ", short: "গোপনীয়তা", tone: "danger" },
  institution_response: {
    label: "প্রতিষ্ঠানের জবাব যুক্ত করা",
    short: "জবাব",
    tone: "info",
  },
  other: { label: "অন্যান্য", short: "অন্যান্য", tone: "neutral" },
} satisfies Meta<AppealReason>;

export const APPEAL_STATUSES = ["received", "in_review", "upheld", "rejected"] as const;
export type AppealStatus = (typeof APPEAL_STATUSES)[number];

export const APPEAL_STATUS_META = {
  received: { label: "গৃহীত", short: "গৃহীত", tone: "info" },
  in_review: { label: "রিভিউ চলছে", short: "রিভিউ", tone: "warning" },
  upheld: { label: "আপিল গৃহীত হয়েছে", short: "গৃহীত", tone: "success" },
  rejected: { label: "আপিল খারিজ", short: "খারিজ", tone: "danger" },
} satisfies Meta<AppealStatus>;

export const FLAG_REASONS = [
  "privacy_leak",
  "misinformation",
  "threat",
  "harassment",
  "copyright",
] as const;

export type FlagReason = (typeof FLAG_REASONS)[number];

export const FLAG_REASON_META = {
  privacy_leak: { label: "ব্যক্তিগত তথ্য ফাঁস", short: "গোপনীয়তা", tone: "danger" },
  misinformation: { label: "ভুল তথ্য", short: "ভুল তথ্য", tone: "warning" },
  threat: { label: "হুমকি", short: "হুমকি", tone: "danger" },
  harassment: { label: "হয়রানিমূলক", short: "হয়রানি", tone: "danger" },
  copyright: { label: "কপিরাইট", short: "কপিরাইট", tone: "neutral" },
} satisfies Meta<FlagReason>;

export const FLAG_STATUSES = ["open", "reviewed", "actioned", "dismissed"] as const;
export type FlagStatus = (typeof FLAG_STATUSES)[number];

export const FLAG_STATUS_META = {
  open: { label: "অপেক্ষমাণ", short: "অপেক্ষমাণ", tone: "warning" },
  reviewed: { label: "পর্যালোচিত", short: "পর্যালোচিত", tone: "info" },
  actioned: { label: "ব্যবস্থা গৃহীত", short: "গৃহীত", tone: "success" },
  dismissed: { label: "খারিজ", short: "খারিজ", tone: "muted" },
} satisfies Meta<FlagStatus>;

/* ------------------------------------------------------------------ *
 * Staff roles — must match shighush_backend/src/models/user.model.ts
 *
 * The doc (§3) also lists Verifier and Institution representative.
 * Both are deliberately folded into Moderator for the MVP: a third role
 * multiplies the permission matrix without changing any screen yet.
 * ------------------------------------------------------------------ */

export const USER_ROLES = ["Admin", "Moderator"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const USER_ROLE_META = {
  Admin: { label: "অ্যাডমিন", short: "অ্যাডমিন", tone: "danger" },
  Moderator: { label: "মডারেটর", short: "মডারেটর", tone: "info" },
} satisfies Meta<UserRole>;

/* ------------------------------------------------------------------ *
 * Sorting & pagination
 * ------------------------------------------------------------------ */

export const REPORT_SORTS = ["newest", "oldest", "most_evidence"] as const;
export type ReportSort = (typeof REPORT_SORTS)[number];

export const REPORT_SORT_META = {
  newest: { label: "নতুন আগে", short: "নতুন", tone: "neutral" },
  oldest: { label: "পুরোনো আগে", short: "পুরোনো", tone: "neutral" },
  most_evidence: { label: "সবচেয়ে বেশি প্রমাণ", short: "প্রমাণ", tone: "neutral" },
} satisfies Meta<ReportSort>;

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

/**
 * Turn a `*_META` registry into `<Select>` / filter options, in declaration order.
 *
 *   selectOptions(REPORT_CATEGORIES, REPORT_CATEGORY_META)
 *   // → [{ value: "bribery", label: "ঘুষ / অতিরিক্ত অর্থ" }, ...]
 */
export function selectOptions<T extends string>(
  values: readonly T[],
  meta: Meta<T>,
): Array<{ value: T; label: string }> {
  return values.map((value) => ({ value, label: meta[value].label }));
}

/** Narrowing guard for untrusted input (searchParams, form data, API payloads). */
export function isOneOf<T extends string>(
  values: readonly T[],
  input: unknown,
): input is T {
  return typeof input === "string" && (values as readonly string[]).includes(input);
}
