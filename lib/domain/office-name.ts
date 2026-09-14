const OFFICE_NAME_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bsub[- ]?registrar\b/gi, "সাব-রেজিস্ট্রার"],
  [/\bassistant commissioner\b/gi, "সহকারী কমিশনার"],
  [/\bprimary[- ]education\b/gi, "প্রাথমিক শিক্ষা"],
  [/\bsecondary[- ]education\b/gi, "মাধ্যমিক শিক্ষা"],
  [/\beducation\b/gi, "শিক্ষা"],
  [/\bhealth[- ]complex\b/gi, "স্বাস্থ্য কমপ্লেক্স"],
  [/\bhealth\b/gi, "স্বাস্থ্য"],
  [/\bland[- ]office\b/gi, "ভূমি অফিস"],
  [/\bpolice[- ]station\b/gi, "থানা"],
  [/\bpolice\b/gi, "পুলিশ"],
  [/\bstation\b/gi, "স্টেশন"],
  [/\bupazila\b/gi, "উপজেলা"],
  [/\bunion[- ]parishad\b/gi, "ইউনিয়ন পরিষদ"],
  [/\bparishad\b/gi, "পরিষদ"],
  [/\bmunicipality\b/gi, "পৌরসভা"],
  [/\bbranch\b/gi, "শাখা"],
  [/\baccounts?\b/gi, "হিসাব"],
  [/\boffice\b/gi, "অফিস"],
  [/\bshibchar\b/gi, "শিবচর"],
  [/\bbandarkhola\b/gi, "বন্দরখোলা"],
];

/** Display office names consistently in Bengali, including legacy English values. */
export function officeNameBn(value: string | null | undefined): string {
  if (!value?.trim()) return "";

  let normalized = value.trim();
  for (const [pattern, replacement] of OFFICE_NAME_REPLACEMENTS) {
    normalized = normalized.replace(pattern, replacement);
  }

  return normalized.replace(/\s+/g, " ").trim();
}
