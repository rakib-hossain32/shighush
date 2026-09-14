/**
 * Bengali-first formatting.
 *
 * Everything here is deliberately **deterministic and Intl-free**. `Intl.NumberFormat`
 * and `Intl.DateTimeFormat` can resolve differently under Node (ICU build dependent)
 * than in the browser, which produces React hydration mismatches on a server-rendered
 * page. Hand-rolled digit mapping and a literal month table always agree.
 *
 * Numbers use Bangladeshi grouping (৩ then ২: ১২,৫০,০০০), not Western thousands.
 */

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"] as const;

const BN_MONTHS = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
] as const;

/** Replace every ASCII digit with its Bengali counterpart. Leaves other chars alone. */
export function toBnDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

/**
 * Group with the Bangladeshi convention: rightmost three digits, then pairs.
 *   2500      → "২,৫০০"
 *   250000    → "২,৫০,০০০"
 *   12500000  → "১,২৫,০০,০০০"
 */
export function formatBnNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";

  const negative = value < 0;
  const [whole, fraction] = Math.abs(value).toString().split(".");

  let grouped: string;
  if (whole.length <= 3) {
    grouped = whole;
  } else {
    const head = whole.slice(0, -3);
    const tail = whole.slice(-3);
    grouped = `${head.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${tail}`;
  }

  const joined = fraction ? `${grouped}.${fraction}` : grouped;
  return `${negative ? "−" : ""}${toBnDigits(joined)}`;
}

/** Taka amount. Returns an em dash when no amount was reported, never "৳ ০". */
export function formatBnCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return "—";
  return `৳ ${formatBnNumber(amount)}`;
}

export function formatBnPercent(ratio: number | null | undefined, digits = 0): string {
  if (ratio === null || ratio === undefined || Number.isNaN(ratio)) return "—";
  return `${toBnDigits((ratio * 100).toFixed(digits))}%`;
}

/** "২৮ আগস্ট ২০২৬" */
export function formatBnDate(iso: string | Date | null | undefined): string {
  const date = toDate(iso);
  if (!date) return "—";
  return `${toBnDigits(date.getDate())} ${BN_MONTHS[date.getMonth()]} ${toBnDigits(date.getFullYear())}`;
}

/** "২৮ আগস্ট ২০২৬, ৪:৩০ PM" — staff screens only; public pages omit the clock. */
export function formatBnDateTime(iso: string | Date | null | undefined): string {
  const date = toDate(iso);
  if (!date) return "—";
  const hours24 = date.getHours();
  const suffix = hours24 < 12 ? "AM" : "PM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${formatBnDate(date)}, ${toBnDigits(hours12)}:${toBnDigits(minutes)} ${suffix}`;
}

/**
 * Date honouring the reporter's stated precision (§6 — incident dates are often
 * approximate, and pretending otherwise misrepresents the report).
 *   exact   → "১৮ আগস্ট ২০২৬"
 *   month   → "আগস্ট ২০২৬"
 *   year    → "২০২৬"
 *   unknown → "সময় জানা নেই"
 */
export function formatBnDateWithPrecision(
  iso: string | Date | null | undefined,
  precision: "exact" | "month" | "year" | "unknown" = "exact",
): string {
  if (precision === "unknown") return "সময় জানা নেই";
  const date = toDate(iso);
  if (!date) return "সময় জানা নেই";

  if (precision === "year") return toBnDigits(date.getFullYear());
  if (precision === "month") {
    return `${BN_MONTHS[date.getMonth()]} ${toBnDigits(date.getFullYear())}`;
  }
  return formatBnDate(date);
}

/**
 * "আজ" / "গতকাল" / "৪ দিন আগে" / "২ সপ্তাহ আগে".
 *
 * Server Components only. Rendering this in a Client Component would compare the
 * server's clock with the browser's and hydrate inconsistently. Pass `now` to pin it
 * in tests.
 */
export function formatBnRelative(
  iso: string | Date | null | undefined,
  now: Date = new Date(),
): string {
  const date = toDate(iso);
  if (!date) return "—";

  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOf(now) - startOf(date)) / 86_400_000);

  if (days < 0) return formatBnDate(date);
  if (days === 0) return "আজ";
  if (days === 1) return "গতকাল";
  if (days < 7) return `${toBnDigits(days)} দিন আগে`;
  if (days < 30) return `${toBnDigits(Math.floor(days / 7))} সপ্তাহ আগে`;
  if (days < 365) return `${toBnDigits(Math.floor(days / 30))} মাস আগে`;
  return `${toBnDigits(Math.floor(days / 365))} বছর আগে`;
}

/**
 * Publication age for archive cards: use minutes/hours for the first 48 hours,
 * then switch to the stable Bengali calendar date.
 */
export function formatBnPublishedAge(
  iso: string | Date | null | undefined,
  now: Date = new Date(),
): string {
  const date = toDate(iso);
  if (!date) return "—";

  const diffMs = now.getTime() - date.getTime();
  if (diffMs < 0 || diffMs >= 48 * 60 * 60 * 1000) {
    return formatBnDate(date);
  }

  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "এইমাত্র";
  if (minutes < 60) return `${toBnDigits(minutes)} মিনিট আগে`;

  const hours = Math.floor(minutes / 60);
  return `${toBnDigits(hours)} ঘণ্টা আগে`;
}

/**
 * Human-facing case reference: `শি-০০৪২`.
 * The API owns the numeric `publicId`; this only decorates it, so a change of prefix
 * never has to touch stored data.
 */
export function formatCaseId(publicId: number | string | null | undefined): string {
  if (publicId === null || publicId === undefined || publicId === "") return "—";
  const digits = String(publicId).replace(/\D/g, "");
  if (!digits) return String(publicId);
  return `শি-${toBnDigits(digits.padStart(4, "0"))}`;
}

/** "৩টি" — Bengali has no plural inflection here, so the counter word is enough. */
export function formatBnCount(value: number | null | undefined, unit = "টি"): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `${formatBnNumber(value)}${unit}`;
}

function toDate(input: string | Date | null | undefined): Date | null {
  if (!input) return null;
  const date = input instanceof Date ? input : new Date(input);
  return Number.isNaN(date.getTime()) ? null : date;
}
