/**
 * Shibchar geography — sourced from seed-data/shibchar-unions.json
 * (shibchar.madaripur.gov.bd, captured 2026-08-28).
 *
 * Area names are stored as stable English slugs and displayed in Bengali, for the
 * same reason as every other enum: a URL like `?union=kanthalbari` survives a
 * spelling correction, `?union=কাঁঠালবাড়ী` does not.
 *
 * §12 privacy note: area granularity stops at the union. There is deliberately no
 * ward, village, or coordinate field here — the platform must never be able to
 * narrow a reporter's location further than this.
 */

export const DIVISION_BN = "ঢাকা";
export const DISTRICT_BN = "মাদারীপুর";
export const UPAZILA_BN = "শিবচর";

/** The municipality is an administrative peer of the unions, not one of them. */
export const MUNICIPALITY = {
  slug: "shibchar-municipality",
  nameBn: "শিবচর পৌরসভা",
} as const;

export const UNIONS = [
  { slug: "dattapara", nameBn: "দত্তপাড়া" },
  { slug: "ditiyokhondo", nameBn: "দ্বিতীয়খণ্ড" },
  { slug: "nilkhi", nameBn: "নিলখি" },
  { slug: "bandarkhola", nameBn: "বন্দরখোলা" },
  { slug: "charjanajat", nameBn: "চরজানাজাত" },
  { slug: "madbarerchar", nameBn: "মাদবরেরচর" },
  { slug: "panchchar", nameBn: "পাঁচচর" },
  { slug: "sannyasirchar", nameBn: "সন্ন্যাসীরচর" },
  { slug: "kanthalbari", nameBn: "কাঁঠালবাড়ী" },
  { slug: "kutubpur", nameBn: "কুতুবপুর" },
  { slug: "kadirpur", nameBn: "কাদিরপুর" },
  { slug: "bhandarikandi", nameBn: "ভান্ডারীকান্দি" },
  { slug: "beheratala-dakshin", nameBn: "বহেরাতলা দক্ষিণ" },
  { slug: "beheratala-uttar", nameBn: "বহেরাতলা উত্তর" },
  { slug: "banshkandi", nameBn: "বাঁশকান্দি" },
  { slug: "umedpur", nameBn: "উমেদপুর" },
  { slug: "bhadrasan", nameBn: "ভদ্রাসন" },
  { slug: "shiruail", nameBn: "শিরুয়াইল" },
] as const;

/** Every reportable area: the municipality plus all 18 unions. */
export const AREAS = [MUNICIPALITY, ...UNIONS] as const;

export type AreaSlug = (typeof AREAS)[number]["slug"];

const AREA_BY_SLUG = new Map<string, string>(
  AREAS.map((a) => [a.slug, a.nameBn]),
);

/** Bengali name for an area slug. Falls back to the slug so unknown data stays visible. */
export function areaName(slug: string | undefined | null): string {
  if (!slug) return "এলাকা উল্লেখ নেই";
  return AREA_BY_SLUG.get(slug) ?? slug;
}

export function isAreaSlug(input: unknown): input is AreaSlug {
  return typeof input === "string" && AREA_BY_SLUG.has(input);
}

/** Options for `<Select>` and filter panels, municipality first. */
export const AREA_OPTIONS: Array<{ value: AreaSlug; label: string }> =
  AREAS.map((a) => ({
    value: a.slug,
    label: a.nameBn,
  }));
