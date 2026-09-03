/**
 * Zod schemas — one definition shared by the form, the Server Action, and the
 * eventual Express route. Duplicating validation is how the two halves of a
 * codebase drift apart, which is exactly what §0 of the plan set out to prevent.
 *
 * Written against zod 3 (`z.string().email()`, not zod 4's `z.email()`).
 */

import { z } from "zod";

import {
  APPEAL_REASONS,
  DATE_PRECISIONS,
  DEFAULT_PAGE_SIZE,
  INSTITUTION_CATEGORIES,
  INSTITUTION_TYPES,
  MAX_PAGE_SIZE,
  MODERATION_STATUSES,
  MONEY_TYPES,
  REPORT_CATEGORIES,
  REPORT_SORTS,
  REPORT_STATUSES,
  VERIFICATION_LEVELS,
} from "@/lib/domain/enums";
import { AREAS } from "@/lib/domain/geo";

const areaSlugs = AREAS.map((a) => a.slug) as [string, ...string[]];

/* ------------------------------------------------------------------ *
 * Staff login
 * ------------------------------------------------------------------ */

export const loginSchema = z.object({
  email: z.string().min(1, "ইমেইল দিন").email("সঠিক ইমেইল ঠিকানা দিন"),
  password: z.string().min(6, "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/* ------------------------------------------------------------------ *
 * Report submission — §6
 * ------------------------------------------------------------------ */

export const reportSubmitSchema = z
  .object({
    /** Free text: the reporter may name an office that is not yet in our canonical list. */
    institutionName: z
      .string()
      .trim()
      .min(3, "প্রতিষ্ঠান বা দফতরের নাম লিখুন")
      .max(200, "নামটি অনেক বড় হয়ে গেছে"),

    /** Set once a moderator links the free text to a canonical institution. */
    institutionSlug: z.string().trim().optional(),

    category: z.enum(REPORT_CATEGORIES, {
      errorMap: () => ({ message: "অভিযোগের ধরন বেছে নিন" }),
    }),

    area: z.enum(areaSlugs, {
      errorMap: () => ({ message: "ঘটনার এলাকা বেছে নিন" }),
    }),

    /** Office or branch name, if narrower than the institution. Optional by design. */
    officeName: z.string().trim().max(200).optional(),

    incidentDate: z
      .string()
      .min(1, "ঘটনার তারিখ বা আনুমানিক সময় দিন")
      .refine(
        (value) => !Number.isNaN(new Date(value).getTime()),
        "তারিখটি বোঝা যাচ্ছে না",
      )
      .refine(
        (value) => new Date(value).getTime() <= Date.now(),
        "ভবিষ্যতের তারিখ দেওয়া যাবে না",
      ),

    /** §6 — an approximate date is valid and must not be presented as exact. */
    incidentDatePrecision: z.enum(DATE_PRECISIONS).default("exact"),

    narrative: z
      .string()
      .trim()
      .min(40, "ঘটনাটি অন্তত ৪০ অক্ষরে লিখুন, যাতে রিভিউ করা সম্ভব হয়")
      .max(5000, "বিবরণটি ৫০০০ অক্ষরের মধ্যে রাখুন"),

    /* ---- optional: money (§6) ---- */
    moneyAmount: z
      .number({ invalid_type_error: "সংখ্যায় লিখুন" })
      .nonnegative("ঋণাত্মক অঙ্ক হতে পারে না")
      .max(100_000_000, "অঙ্কটি অস্বাভাবিক বড়")
      .optional(),
    moneyType: z.enum(MONEY_TYPES).default("unknown"),
    /** The gazetted fee, when the reporter knows it — makes over-charging measurable. */
    officialFee: z.number().nonnegative().optional(),

    /* ---- optional: accused person (§7) ---- */
    accusedName: z.string().trim().max(120).optional(),
    accusedDesignation: z.string().trim().max(120).optional(),

    /** Service and reference number; sensitive parts are masked at review time. */
    serviceName: z.string().trim().max(200).optional(),
    referenceNumber: z.string().trim().max(80).optional(),

    /** §6 — opt in to an anonymous moderator inbox for follow-up questions. */
    enableAnonymousInbox: z.boolean().default(false),

    /* ---- consent (§6, both mandatory) ---- */
    truthAcknowledged: z.literal(true, {
      errorMap: () => ({ message: "তথ্যের সত্যতা নিশ্চিত করুন" }),
    }),
    policyAcknowledged: z.literal(true, {
      errorMap: () => ({ message: "প্রকাশ ও গোপনীয়তা নীতি মেনে নিন" }),
    }),

    /** §13 — hidden honeypot. A real browser leaves this empty. */
    contactReason: z
      .string()
      .max(0, "অনুরোধটি প্রক্রিয়া করা যায়নি")
      .optional(),
  })
  .superRefine((value, ctx) => {
    // An amount without a type, or a type without an amount, is ambiguous data.
    if (value.moneyAmount !== undefined && value.moneyType === "unknown") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["moneyType"],
        message: "টাকা চাওয়া হয়েছে না দেওয়া হয়েছে, তা বেছে নিন",
      });
    }
    // §7: a designation without a name is publishable; a name alone is not useful and
    // raises the privacy stakes for no gain.
    if (value.accusedName && !value.accusedDesignation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["accusedDesignation"],
        message: "নাম দিলে পদবি বা দফতরও লিখুন",
      });
    }
  });

export type ReportSubmitInput = z.infer<typeof reportSubmitSchema>;

/* ------------------------------------------------------------------ *
 * Appeal — §16
 * ------------------------------------------------------------------ */

export const appealSchema = z.object({
  caseId: z
    .string()
    .trim()
    .min(1, "নথির Case ID দিন")
    // Accept "শি-০০৪২", "SHI-0042", or a bare number; the API normalises.
    .max(40, "Case ID অনেক বড়"),
  reason: z.enum(APPEAL_REASONS, {
    errorMap: () => ({ message: "আপিলের কারণ বেছে নিন" }),
  }),
  detail: z
    .string()
    .trim()
    .min(30, "আপিলের কারণ অন্তত ৩০ অক্ষরে লিখুন")
    .max(3000, "বিবরণটি ৩০০০ অক্ষরের মধ্যে রাখুন"),
  policyAcknowledged: z.literal(true, {
    errorMap: () => ({ message: "শর্তটি মেনে নিন" }),
  }),
  contactReason: z.string().max(0).optional(),
});

export type AppealInput = z.infer<typeof appealSchema>;

/* ------------------------------------------------------------------ *
 * Private case tracking — §12.4
 * ------------------------------------------------------------------ */

export const trackAccessSchema = z.object({
  caseId: z.string().trim().min(1, "Case ID দিন").max(40),
  secretToken: z
    .string()
    .trim()
    .min(16, "Token-টি সম্পূর্ণ নয় — জমার সময় পাওয়া পুরো token দিন")
    .max(200),
});

export type TrackAccessInput = z.infer<typeof trackAccessSchema>;

/* ------------------------------------------------------------------ *
 * Moderation decision — §16, staff only
 * ------------------------------------------------------------------ */

export const moderationDecisionSchema = z
  .object({
    reportId: z.string().min(1),
    decision: z.enum(["publish", "request_info", "reject", "remove"]),
    verificationLevel: z.enum(VERIFICATION_LEVELS).optional(),
    /** Neutral public title/summary written by the moderator (§16.5). */
    publicTitle: z.string().trim().max(200).optional(),
    publicSummary: z.string().trim().max(1000).optional(),
    /** What was redacted and why — becomes part of the audit trail. */
    redactionNotes: z.string().trim().max(2000).optional(),
    /** Internal note, never public. */
    moderatorNote: z.string().trim().max(2000).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.decision === "publish") {
      if (!value.verificationLevel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["verificationLevel"],
          message: "প্রকাশের আগে যাচাইয়ের স্তর নির্ধারণ করুন",
        });
      }
      if (!value.publicTitle) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["publicTitle"],
          message: "প্রকাশের জন্য নিরপেক্ষ শিরোনাম লিখুন",
        });
      }
    }
    // A rejection or removal without a reason cannot be audited or appealed against.
    if (
      (value.decision === "reject" || value.decision === "remove") &&
      !value.moderatorNote
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["moderatorNote"],
        message: "কারণ না লিখে প্রত্যাখ্যান বা অপসারণ করা যাবে না",
      });
    }
  });

export type ModerationDecisionInput = z.infer<typeof moderationDecisionSchema>;

/* ------------------------------------------------------------------ *
 * Filters parsed from the URL
 *
 * URL is the state store for every list view: shareable, back-button correct,
 * server-renderable, and zero client state. These schemas coerce loosely and
 * NEVER throw — a hand-edited query string must degrade to defaults, not 500.
 * ------------------------------------------------------------------ */

const page = z.coerce.number().int().min(1).catch(1);
const limit = z.coerce
  .number()
  .int()
  .min(1)
  .max(MAX_PAGE_SIZE)
  .catch(DEFAULT_PAGE_SIZE);

/** Accepts `?category=a&category=b` and `?category=a,b` alike. */
const multi = <T extends readonly [string, ...string[]]>(values: T) =>
  z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((input) => {
      if (input === undefined) return [] as T[number][];
      const raw = Array.isArray(input) ? input : input.split(",");
      const allowed = new Set<string>(values);
      return raw
        .map((v) => v.trim())
        .filter((v): v is T[number] => allowed.has(v));
    });

export const reportFilterSchema = z.object({
  page,
  limit,
  search: z.string().trim().max(120).optional().catch(undefined),
  category: multi(REPORT_CATEGORIES as unknown as [string, ...string[]]),
  verificationLevel: multi(
    VERIFICATION_LEVELS as unknown as [string, ...string[]],
  ),
  area: multi(areaSlugs),
  institution: z.string().trim().max(120).optional().catch(undefined),
  sort: z.enum(REPORT_SORTS).catch("newest"),
});

export type ReportFilterInput = z.infer<typeof reportFilterSchema>;

export const institutionFilterSchema = z.object({
  page,
  limit,
  search: z.string().trim().max(120).optional().catch(undefined),
  // Institutions are filtered by SERVICE sector, not by complaint type. Using
  // REPORT_CATEGORIES here would silently discard every real value (`land`,
  // `healthcare`, …) because only "other" appears in both lists.
  category: multi(INSTITUTION_CATEGORIES as unknown as [string, ...string[]]),
  type: z.enum(INSTITUTION_TYPES).optional().catch(undefined),
  area: multi(areaSlugs),
});

/** Moderation queue filters — the staff equivalent, with the internal statuses. */
export const moderationQueueSchema = z.object({
  page,
  limit,
  search: z.string().trim().max(120).optional().catch(undefined),
  status: multi(REPORT_STATUSES as unknown as [string, ...string[]]),
  category: multi(REPORT_CATEGORIES as unknown as [string, ...string[]]),
  area: multi(areaSlugs),
  /** Only rows whose narrative tripped the PII detector. */
  flaggedOnly: z
    .union([z.string(), z.boolean()])
    .optional()
    .transform((v) => v === true || v === "1" || v === "true"),
  sort: z.enum(REPORT_SORTS).catch("newest"),
});

export type ModerationQueueInput = z.infer<typeof moderationQueueSchema>;

/**
 * Parse Next.js `searchParams` with a filter schema. Total function: any input
 * produces a valid filter object.
 */
export function parseFilters<S extends z.ZodType>(
  schema: S,
  searchParams: Record<string, string | string[] | undefined>,
): z.infer<S> {
  const result = schema.safeParse(searchParams);
  return result.success ? result.data : schema.parse({});
}

/** Default queue view: everything awaiting a human, newest first. */
export const DEFAULT_QUEUE_STATUSES = MODERATION_STATUSES;
