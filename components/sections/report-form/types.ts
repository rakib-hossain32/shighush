/**
 * Canonical types, scenario configurations, and schemas for the report submission wizard.
 *
 * `CATEGORY_SCENARIOS` is the single place the form learns how a given complaint type
 * behaves. Everything the wizard adapts — which fields it demands, how it phrases the
 * money panel, what it suggests the reporter write — is read from here, so adding or
 * retuning a category never means hunting through four step components.
 */

import type { UseFormReturn } from "react-hook-form";
import type { ReportSubmitInput } from "@/lib/domain/schemas";
import type { ReportCategory } from "@/lib/domain/enums";

export type ReportFormValues = ReportSubmitInput;

export type ScenarioType =
  | "bribery"
  | "extortion"
  | "harassment"
  | "service_denial"
  | "abuse_of_power"
  | "procurement"
  | "fraud"
  | "general";

/**
 * One line of the "what this category will ask you for" checklist shown right after the
 * reporter picks a category. This is the contract the form makes with the reporter up
 * front, so it must stay in sync with what `StepDetails` actually renders.
 */
export interface ScenarioRequirement {
  label: string;
  required: boolean;
}

export interface CategoryScenario {
  type: ScenarioType;
  title: string;
  badge: string;
  /** Full explanation, shown once the category is chosen. */
  hint: string;
  /** One compact line for the category tile — must fit two lines at 360px. */
  shortHint: string;
  needsMoney: boolean;
  moneyTitle?: string;
  /** Drives the up-front checklist. Order = the order the wizard asks for them. */
  requirements: ScenarioRequirement[];
  narrativePlaceholder: string;
  narrativeTips: string[];
}

export const CATEGORY_SCENARIOS: Record<ReportCategory, CategoryScenario> = {
  bribery: {
    type: "bribery",
    title: "ঘুষ ও অতিরিক্ত অর্থ দাবি",
    badge: "আর্থিক লেনদেন",
    hint: "ঘুষ বা অতিরিক্ত অর্থ দাবি/প্রদানের ঘটনা। সরকারি ফি কত ছিল এবং অতিরিক্ত কত চাওয়া হয়েছে তা উল্লেখ করুন।",
    shortHint: "সেবার বিনিময়ে সরকারি ফির বাইরে বাড়তি টাকা দাবি বা গ্রহণ।",
    needsMoney: true,
    moneyTitle: "ঘুষ বা অতিরিক্ত অর্থের বিবরণ",
    requirements: [
      { label: "ঘটনার বিবরণ", required: true },
      { label: "দাবিকৃত বা প্রদত্ত টাকার পরিমাণ", required: true },
      { label: "টাকা চাওয়া হয়েছে না দেওয়া হয়েছে", required: true },
      { label: "সরকারি নির্ধারিত ফি", required: false },
      { label: "কর্মকর্তার পদবি", required: false },
    ],
    narrativePlaceholder:
      "যেমন: সহকারী কমিশনার (ভূমি) অফিসে নামজারি আবেদনের পর অফিস সহকারী সরকারি ফি ১১৫০ টাকার বাইরে অতিরিক্ত ৫,০০০ টাকা দাবি করেন। টাকা না দিলে ফাইল আটকে রাখার কথা বলেন...",
    narrativeTips: [
      "সরকারি ফি ও অতিরিক্ত দাবিকৃত টাকার পার্থক্য উল্লেখ করুন",
      "টাকা নগদে নাকি মোবাইল ব্যাংকিংয়ে চাওয়া হয়েছে তা লিখুন",
      "কোন সেবার বিনিময়ে ঘুষ চাওয়া হয়েছে তা নির্দিষ্ট করুন",
    ],
  },
  extortion: {
    type: "extortion",
    title: "চাঁদাবাজি ও জোরপূর্বক অর্থ আদায়",
    badge: "আর্থিক নিপীড়ন",
    hint: "চাঁদাবাজি, জোরপূর্বক অর্থ আদায় বা হুমকির তথ্য দিন। পরিস্থিতি ও দাবিকৃত অঙ্ক উল্লেখ করুন।",
    shortHint: "হুমকি বা ভয় দেখিয়ে জোর করে চাঁদা বা অর্থ আদায়ের চেষ্টা।",
    needsMoney: true,
    moneyTitle: "দাবিকৃত বা প্রদত্ত চাঁদার বিবরণ",
    requirements: [
      { label: "ঘটনার বিবরণ ও হুমকির ধরন", required: true },
      { label: "দাবিকৃত চাঁদার পরিমাণ", required: true },
      { label: "টাকা চাওয়া হয়েছে না দেওয়া হয়েছে", required: true },
      { label: "অভিযুক্তের পরিচিতি বা পদবি", required: false },
    ],
    narrativePlaceholder:
      "যেমন: দোকান সংস্কারের কাজ চলার সময় স্থানীয় কতিপয় ব্যক্তি এসে ব্যবসা বন্ধের হুমকি দিয়ে ৫০,০০০ টাকা চাঁদা দাবি করে...",
    narrativeTips: [
      "চাঁদা না দিলে কী হুমকি বা ভয়ভীতি দেখানো হয়েছে তা লিখুন",
      "কোনো অর্থ প্রদান করতে বাধ্য হলে তার পরিমাণ দিন",
      "ঘটনার সময়, স্থান ও পারিপার্শ্বিক অবস্থা শান্ত ভাষায় বর্ণনা করুন",
    ],
  },
  harassment: {
    type: "harassment",
    title: "হয়রানি ও অসদাচরণ",
    badge: "অ-আর্থিক হয়রানি",
    hint: "মৌখিক, মানসিক, শারীরিক হুমকি বা অযথা ফাইল আটকে কালক্ষেপণের ঘটনা। এখানে কোনো আর্থিক তথ্যের প্রয়োজন নেই।",
    shortHint: "দুর্ব্যবহার, ভীতি প্রদর্শন বা অযথা ঘোরানো — টাকার লেনদেন ছাড়াই।",
    needsMoney: false,
    requirements: [
      { label: "ঘটনার বিবরণ ও হয়রানির ধরন", required: true },
      { label: "কর্মকর্তার পদবি বা দফতর", required: false },
      { label: "সাক্ষী বা প্রমাণ", required: false },
    ],
    narrativePlaceholder:
      "যেমন: উপজেলা সমাজসেবা কার্যালয়ে প্রতিবন্ধী ভাতার কার্ডের খোঁজ নিতে গেলে সংশ্লিষ্ট কর্মকর্তা কোনো সদুত্তর না দিয়ে বারবার দুর্ব্যবহার করেন এবং রুম থেকে বের করে দেন...",
    narrativeTips: [
      "হয়রানির ধরন (মৌখিক দুর্ব্যবহার, মানসিক চাপ, ভীতি প্রদর্শন) লিখুন",
      "এটি প্রথমবার ঘটেছে নাকি বারবার ঘটছে তা উল্লেখ করুন",
      "সাক্ষী বা ডিজিটাল প্রমাণ (কল রেকর্ড, মেসেজ) থাকলে জানান",
    ],
  },
  service_denial: {
    type: "service_denial",
    title: "নাগরিক সেবা-বঞ্চনা",
    badge: "প্রশাসনিক অবহেলা",
    hint: "বৈধ সেবা প্রাপ্তিতে অযৌক্তিক বাধা বা দীর্ঘসূত্রিতা। কত দিন ধরে সেবাটি আটকে আছে তা উল্লেখ করুন।",
    shortHint: "প্রাপ্য সেবা আটকে রাখা বা অযৌক্তিক দীর্ঘসূত্রিতা।",
    needsMoney: false,
    requirements: [
      { label: "ঘটনার বিবরণ ও কত দিন ধরে আটকে আছে", required: true },
      { label: "কাঙ্ক্ষিত সেবার নাম", required: false },
      { label: "আবেদন বা চালান নম্বর", required: false },
    ],
    narrativePlaceholder:
      "যেমন: পৌরসভার জন্ম নিবন্ধন সংশোধনের সকল কাগজপত্র জমা দেওয়ার পর নির্ধারিত ৩০ কর্মদিবস পার হলেও এখনো সনদ দেওয়া হয়নি। বারবার যোগাযোগ করলেও সন্তোষজনক কারণ জানানো হচ্ছে না...",
    narrativeTips: [
      "আবেদন জমা দেওয়ার তারিখ ও আবেদন/রেফারেন্স নম্বর দিন",
      "সেবা অস্বীকারের কী কারণ বা অজুহাত দেখানো হয়েছে তা লিখুন",
      "কত দিন ধরে আপনি ঘুরছেন তা উল্লেখ করুন",
    ],
  },
  abuse_of_power: {
    type: "abuse_of_power",
    title: "ক্ষমতার অপব্যবহার ও বেআইনি প্রভাব",
    badge: "আইনবহির্ভূত আচরণ",
    hint: "সরকারি বা প্রাতিষ্ঠানিক পদের অপব্যবহার করে নাগরিকের অধিকার ক্ষুণ্ণ করা বা অন্যায় সুবিধা আদায়ের ঘটনা।",
    shortHint: "পদের অপব্যবহার করে বেআইনি নির্দেশ বা অন্যায় সুবিধা আদায়।",
    needsMoney: false,
    requirements: [
      { label: "ঘটনার বিবরণ ও কী ক্ষতি হয়েছে", required: true },
      { label: "কর্মকর্তার পদবি বা দফতর", required: false },
      { label: "সংশ্লিষ্ট নথি বা প্রমাণ", required: false },
    ],
    narrativePlaceholder:
      "যেমন: সংশ্লিষ্ট কর্মকর্তা ব্যক্তিগত আক্রোশে আইন বহির্ভূত নির্দেশ দিয়ে সীমানা নির্ধারণের কার্যক্রম স্থগিত করে দেন এবং হুমকি দেন...",
    narrativeTips: [
      "কর্মকর্তার পদবি ও কোন ক্ষমতার অপব্যবহার হয়েছে তা স্পষ্ট করুন",
      "আইন বা বিধির কোন অংশ লঙ্ঘন করা হয়েছে (জানা থাকলে) লিখুন",
      "এর ফলে আপনার কী ক্ষতি হয়েছে তা নিরপেক্ষভাবে লিখুন",
    ],
  },
  procurement_irregularity: {
    type: "procurement",
    title: "টেন্ডার ও ক্রয় অনিয়ম",
    badge: "সরকারি অর্থ অপচয়",
    hint: "উন্নয়ন কাজ, কেনাকাটা বা ঠিকাদারি প্রক্রিয়ায় অনিয়ম, নিম্নমানের কাজ বা ভুয়া বিল ভাউচারের তথ্য।",
    shortHint: "উন্নয়ন কাজ বা কেনাকাটায় নিম্নমান, ভুয়া বিল বা দরপত্র অনিয়ম।",
    needsMoney: true,
    moneyTitle: "প্রকল্প বাজেট বা আনুমানিক আর্থিক অনিয়ম",
    requirements: [
      { label: "অনিয়মের বিবরণ", required: true },
      { label: "প্রকল্প বাজেট বা আনুমানিক অঙ্ক", required: true },
      { label: "অঙ্কটি দাবিকৃত না ব্যয়কৃত", required: true },
      { label: "প্রকল্পের নাম বা দরপত্র নম্বর", required: false },
    ],
    narrativePlaceholder:
      "যেমন: ইউনিয়ন পরিষদের রাস্তা সংস্কার প্রকল্পে নির্ধারিত স্পেসিফিকেশন অনুযায়ী সামগ্রী ব্যবহার না করে নিম্নমানের ইট ব্যবহার করা হচ্ছে এবং কাজ শেষ না করেই বিল উত্তোলনের চেষ্টা চলছে...",
    narrativeTips: [
      "প্রকল্পের নাম, স্থান বা দরপত্র নম্বর উল্লেখ করুন",
      "কাজের স্পেসিফিকেশনে কী গড়মিল তা লিখুন",
      "ছবি বা নথিপত্র প্রমাণ থাকলে তা যুক্ত করুন",
    ],
  },
  fraud: {
    type: "fraud",
    title: "প্রতারণা ও বিশ্বাসভঙ্গ",
    badge: "আর্থিক ক্ষতি",
    hint: "সরকারি চাকরির মিথ্যা আশ্বাস, জাল কাগজপত্র তৈরি বা সেবার নামে ভুয়া আশ্বাসে অর্থ আত্মসাৎ।",
    shortHint: "মিথ্যা আশ্বাস বা জাল কাগজপত্র দিয়ে অর্থ আত্মসাৎ।",
    needsMoney: true,
    moneyTitle: "প্রতারণায় আত্মসাৎকৃত অর্থের পরিমাণ",
    requirements: [
      { label: "প্রতারণার বিবরণ", required: true },
      { label: "আত্মসাৎকৃত অর্থের পরিমাণ", required: true },
      { label: "টাকা চাওয়া হয়েছে না দেওয়া হয়েছে", required: true },
      { label: "লেনদেনের রশিদ বা প্রমাণ", required: false },
    ],
    narrativePlaceholder:
      "যেমন: অমুক দফতরে চাকরি পাইয়ে দেওয়ার কথা বলে নকল নিয়োগপত্র দিয়ে ৩ লক্ষ টাকা আত্মসাৎ করা হয়েছে...",
    narrativeTips: [
      "কী সেবা বা সুবিধার মিথ্যা আশ্বাস দেওয়া হয়েছিল তা লিখুন",
      "অর্থ লেনদেনের রশিদ, চেক বা ব্যাংক স্টেটমেন্টের বিবরণ দিন",
      "প্রতারক চক্র বা মধ্যস্বত্বভোগীর ভূমিকা বিস্তারিত লিখুন",
    ],
  },
  other: {
    type: "general",
    title: "অন্যান্য নাগরিক অভিযোগ",
    badge: "সাধারণ অভিযোগ",
    hint: "উপরের কোনো শ্রেণিতে না পড়লে নাগরিক স্বার্থসংশ্লিষ্ট যেকোনো অনিয়ম বা অভিজ্ঞতার বিবরণ দিন।",
    shortHint: "উপরের কোনোটিতে না পড়লে — যেকোনো নাগরিক অনিয়মের অভিজ্ঞতা।",
    needsMoney: false,
    requirements: [
      { label: "কী ঘটেছে, কখন ও কোথায়", required: true },
      { label: "সংশ্লিষ্ট কর্মকর্তার পদবি", required: false },
      { label: "কাগজপত্র বা প্রমাণ", required: false },
    ],
    narrativePlaceholder:
      "আপনার সুনির্দিষ্ট অভিজ্ঞতার কথা নিরপেক্ষ, শান্ত ও তথ্যবহুল ভাষায় বর্ণনা করুন...",
    narrativeTips: [
      "কী ঘটেছে, কখন ঘটেছে এবং কোথায় ঘটেছে তা স্পষ্ট লিখুন",
      "কাগজপত্র বা প্রমাণের রেফারেন্স দিন",
    ],
  },
};

export const FORM_STEPS = [
  {
    id: "context" as const,
    label: "ঘটনার প্রেক্ষাপট",
    shortLabel: "প্রেক্ষাপট",
    /** Shown under the step title so the reporter knows what this step is for. */
    summary: "কোন দফতর, কী ধরনের সমস্যা, কোথায় ও কবে ঘটেছে।",
  },
  {
    id: "narrative" as const,
    label: "ঘটনার বিবরণ",
    shortLabel: "বিবরণ",
    summary: "নিজের ভাষায় কী ঘটেছে তা লিখুন — ব্যক্তিগত তথ্য ছাড়া।",
  },
  {
    id: "details" as const,
    label: "পরিস্থিতি-নির্দিষ্ট তথ্য",
    shortLabel: "নির্দিষ্ট তথ্য",
    summary: "আপনার বেছে নেওয়া ধরন অনুযায়ী প্রয়োজনীয় বাড়তি তথ্য।",
  },
  {
    id: "review" as const,
    label: "যাচাই ও জমা",
    shortLabel: "জমা দিন",
    summary: "সব তথ্য একবার দেখে নিয়ে সম্মতি দিয়ে জমা দিন।",
  },
] as const;

export type StepId = (typeof FORM_STEPS)[number]["id"];

/**
 * Which fields each step owns, in the order the step presents them.
 *
 * Drives two things: the error summary listing, and which field the wizard scrolls to and
 * focuses when the reporter presses "পরবর্তী ধাপ" on an invalid step. Keep in sync with
 * the step components' visual order — the first entry is the first thing on screen.
 */
export const STEP_FIELDS: ReadonlyArray<ReadonlyArray<keyof ReportSubmitInput>> = [
  [
    "institutionName",
    "category",
    "area",
    "officeName",
    "incidentDate",
    "incidentDatePrecision",
  ],
  ["narrative"],
  [
    "moneyAmount",
    "moneyType",
    "officialFee",
    "serviceName",
    "referenceNumber",
    "accusedDesignation",
    "accusedName",
  ],
  ["truthAcknowledged", "policyAcknowledged", "contactReason"],
];

/**
 * Human labels for the error summary. Without these the summary would show raw schema
 * keys (`institutionName`), which tells a Bengali-speaking reporter nothing.
 */
export const FIELD_LABELS: Partial<Record<keyof ReportSubmitInput, string>> = {
  institutionName: "প্রতিষ্ঠানের নাম",
  category: "অভিযোগের ধরন",
  area: "ঘটনার এলাকা",
  officeName: "শাখা / অফিসের নাম",
  incidentDate: "ঘটনার তারিখ",
  incidentDatePrecision: "তারিখের নির্ভুলতা",
  narrative: "ঘটনার বিবরণ",
  moneyAmount: "টাকার পরিমাণ",
  moneyType: "টাকা চাওয়া না দেওয়া",
  officialFee: "সরকারি নির্ধারিত ফি",
  serviceName: "সেবার নাম",
  referenceNumber: "রেফারেন্স নম্বর",
  accusedDesignation: "কর্মকর্তার পদবি",
  accusedName: "কর্মকর্তার নাম",
  truthAcknowledged: "তথ্যের সত্যতা",
  policyAcknowledged: "নীতিমালায় সম্মতি",
  contactReason: "ফর্ম যাচাই",
};

export interface ReportFormContextValue {
  form: UseFormReturn<ReportSubmitInput>;
  currentStep: number;
  selectedCategory: ReportCategory | undefined;
  scenario: CategoryScenario | null;
  needsMoney: boolean;
  /** Lets the review step offer "edit this section" jumps back to an earlier step. */
  goToStep: (stepIndex: number) => void;
}
