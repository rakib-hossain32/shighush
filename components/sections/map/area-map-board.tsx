"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Compass,
  EyeOff,
  Filter,
  Layers,
  MapPin,
  MapPinned,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { formatBnNumber, formatBnPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

interface AreaData {
  id: string;
  name: string;
  bnName: string;
  reports: number;
  left: string;
  top: string;
  verifiedRate: number;
  topCategories: { name: string; count: number }[];
  avgResolutionDays: number;
  type: "পৌরসভা" | "ইউনিয়ন";
  summary: string;
}

const AREAS: AreaData[] = [
  {
    id: "shibchar-pourashava",
    name: "Shibchar Pourashava",
    bnName: "শিবচর পৌরসভা",
    reports: 8,
    left: "52%",
    top: "42%",
    verifiedRate: 88,
    topCategories: [
      { name: "ভূমি ও রাজস্ব", count: 4 },
      { name: "পৌর নাগরিক সেবা", count: 2 },
      { name: "স্বাস্থ্য ও স্যানিটেশন", count: 2 },
    ],
    avgResolutionDays: 4,
    type: "পৌরসভা",
    summary: "উপজেলা প্রশাসনিক কেন্দ্র ও বাজার এলাকায় সর্বোচ্চ নাগরিক ফিডব্যাক নথিভুক্ত হয়েছে।",
  },
  {
    id: "kathalbari",
    name: "Kathalbari",
    bnName: "কাঁঠালবাড়ী",
    reports: 5,
    left: "24%",
    top: "26%",
    verifiedRate: 80,
    topCategories: [
      { name: "ঘাট ও নৌ-পরিবহন", count: 3 },
      { name: "স্থানীয় প্রশাসন", count: 2 },
    ],
    avgResolutionDays: 6,
    type: "ইউনিয়ন",
    summary: "নদী তীরবর্তী ও ফেরিঘাট সংলগ্ন অঞ্চলের সেবা ও লাইসেন্স সংক্রান্ত প্রতিবেদন।",
  },
  {
    id: "panchchar",
    name: "Panchchar",
    bnName: "পাঁচচর",
    reports: 4,
    left: "66%",
    top: "22%",
    verifiedRate: 75,
    topCategories: [
      { name: "মহাসড়ক ও ট্রাফিক", count: 2 },
      { name: "পল্লী বিদ্যুৎ", count: 2 },
    ],
    avgResolutionDays: 5,
    type: "ইউনিয়ন",
    summary: "এক্সপ্রেসওয়ে সংযোগ ও বাণিজ্যিক করিডোর সংলগ্ন সেবা সংক্রান্ত নাগরিক তথ্য।",
  },
  {
    id: "banshkanthi",
    name: "Banshkanthi",
    bnName: "বাঁশকান্দি",
    reports: 3,
    left: "40%",
    top: "62%",
    verifiedRate: 67,
    topCategories: [
      { name: "কৃষি ও সেচ সহায়তা", count: 2 },
      { name: "ইউনিয়ন পরিষদ সেবা", count: 1 },
    ],
    avgResolutionDays: 7,
    type: "ইউনিয়ন",
    summary: "কৃষিপ্রধান দক্ষিণাঞ্চলের সেচ ও সার বিতরণ প্রক্রিয়া সম্পর্কিত নাগরিক রিপোর্ট।",
  },
  {
    id: "kutubpur",
    name: "Kutubpur",
    bnName: "কুতুবপুর",
    reports: 2,
    left: "74%",
    top: "54%",
    verifiedRate: 100,
    topCategories: [
      { name: "স্বাস্থ্য কমপ্লেক্স ও ক্লিনিক", count: 1 },
      { name: "রাস্তাঘাট সংস্কার", count: 1 },
    ],
    avgResolutionDays: 3,
    type: "ইউনিয়ন",
    summary: "কমিউনিটি ক্লিনিক ও গ্রামীণ যোগাযোগ অবকাঠামো সম্পর্কিত প্রামাণ্য নাগরিক দলিল।",
  },
  {
    id: "madborerchar",
    name: "Madborerchar",
    bnName: "মাদবরেরচর",
    reports: 2,
    left: "32%",
    top: "16%",
    verifiedRate: 50,
    topCategories: [
      { name: "নদীভাঙন ও ত্রাণ সহায়তা", count: 2 },
    ],
    avgResolutionDays: 8,
    type: "ইউনিয়ন",
    summary: "পদ্মা তীরবর্তী চরাঞ্চলের পুনর্বাসন ও সরকারি বরাদ্দ বিতরণ সংক্রান্ত অভিজ্ঞতা।",
  },
  {
    id: "bhadrasan",
    name: "Bhadrasan",
    bnName: "ভদ্রাসন",
    reports: 1,
    left: "60%",
    top: "76%",
    verifiedRate: 100,
    topCategories: [
      { name: "বিদ্যুৎ সংযোগ বিলম্ব", count: 1 },
    ],
    avgResolutionDays: 2,
    type: "ইউনিয়ন",
    summary: "পল্লী বিদ্যুৎ মিটার ও নতুন সংযোগ প্রদানে দীর্ঘসূত্রতার অভিযোগ।",
  },
];

const CATEGORIES = [
  "সব বিষয়",
  "ভূমি ও রাজস্ব",
  "ঘাট ও পরিবহন",
  "পৌর সেবা",
  "বিদ্যুৎ",
  "স্বাস্থ্য",
] as const;

export function AreaMapBoard() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("সব বিষয়");
  const [selectedAreaId, setSelectedAreaId] = React.useState<string | null>("shibchar-pourashava");
  const [viewMode, setViewMode] = React.useState<"map" | "list">("map");

  const selectedArea = AREAS.find((a) => a.id === selectedAreaId) || null;

  const filteredAreas = React.useMemo(() => {
    if (selectedCategory === "সব বিষয়") return AREAS;
    return AREAS.filter((a) =>
      a.topCategories.some((c) => c.name.includes(selectedCategory) || selectedCategory.includes(c.name))
    );
  }, [selectedCategory]);

  const totalReportsCount = AREAS.reduce((sum, a) => sum + a.reports, 0);

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Filters (Brutalist Ticket Pills) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="shrink-0 text-xs  font-bold text-muted-foreground mr-1 flex items-center gap-1">
            <Filter className="size-3.5 text-primary" />
            ফিল্টার:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              type="button"
              className={cn(
                "shrink-0 border-2 px-3 py-1  text-xs font-bold transition-all cursor-pointer",
                selectedCategory === cat
                  ? "border-foreground bg-primary text-foreground shadow-[2px_2px_0_var(--foreground)] -translate-y-0.5"
                  : "border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Mode Switcher (Brutalist Toggle) */}
        <div className="flex items-center border-2 border-border bg-card p-1 text-xs  font-bold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("map")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 transition-all cursor-pointer",
              viewMode === "map"
                ? "border border-foreground bg-primary text-foreground font-bold shadow-[2px_2px_0_var(--foreground)]"
                : "text-muted-foreground hover:text-foreground border border-transparent"
            )}
          >
            <Compass className="size-3.5" />
            ম্যাপ ভিউ
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 transition-all cursor-pointer",
              viewMode === "list"
                ? "border border-foreground bg-primary text-foreground font-bold shadow-[2px_2px_0_var(--foreground)]"
                : "text-muted-foreground hover:text-foreground border border-transparent"
            )}
          >
            <Layers className="size-3.5" />
            তালিকা ({formatBnNumber(filteredAreas.length)})
          </button>
        </div>
      </div>

      {/* Main Board Container (Neo-Brutalist Archival Frame) */}
      <div className="border-2 border-foreground bg-card overflow-hidden shadow-[4px_4px_0_var(--foreground)]">
        {/* Header with Geo-Metadata */}
        <div className="border-b-2 border-border p-5 sm:p-6 bg-card">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
                  CIVIC OBSERVATORY / SHIBCHAR UPAZILA
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  23°21′ N, 90°10′ E
                </span>
              </div>
              <h2 className="text-xl font-extrabold font-heading mt-1 sm:text-2xl text-foreground">
                ইউনিয়নভিত্তিক নাগরিক অভিযোগের ভৌগোলিক বিন্যাস
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs  font-bold text-primary">
                ১০০% গোপনীয়তা-সুরক্ষিত
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            নাগরিকের ব্যক্তিগত সুরক্ষার স্বার্থে সুনির্দিষ্ট বাড়ির অবস্থান গোপন রেখে ইউনিয়ন ও পৌরসভা স্তরে সামগ্রিক ডেটা প্রদর্শিত হচ্ছে।
          </p>
        </div>

        {viewMode === "map" ? (
          <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* Interactive Vector Geo Canvas with Archival Paper-Grid */}
            <div className="relative min-h-[30rem] overflow-hidden bg-[#f0ebd9] dark:bg-[#121c19] p-5 sm:min-h-[36rem] sm:p-7 select-none border-b-2 lg:border-b-0 lg:border-r-2 border-border">
              {/* Paper-grid background texture */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[size:32px_32px] [background-image:linear-gradient(var(--foreground)_1px,transparent_1px),linear-gradient(90deg,var(--foreground)_1px,transparent_1px)]"
              />

              {/* River Tributary Curve (Padma / Arial Khan) */}
              <svg
                aria-hidden="true"
                className="absolute inset-0 h-full w-full pointer-events-none opacity-40"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M -20,80 Q 200,180 320,120 T 700,280 T 1100,320"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="32"
                  strokeLinecap="round"
                  className="opacity-40 dark:opacity-25"
                />
                <path
                  d="M -20,80 Q 200,180 320,120 T 700,280 T 1100,320"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="8 6"
                  className="text-foreground/30"
                />
              </svg>

              {/* Contour outline */}
              <div
                aria-hidden="true"
                className="absolute left-[10%] top-[14%] h-[74%] w-[80%] border-2 border-dashed border-foreground/20 pointer-events-none"
              />

              {/* Canvas Overlays: Header & Controls */}
              <div className="relative z-10 flex items-center justify-between pointer-events-none">
                <span className="font-mono text-[10px] font-bold tracking-widest text-foreground uppercase border-2 border-border bg-background/90 px-3 py-1 shadow-[2px_2px_0_var(--foreground)]">
                  SHIBCHAR HOTSPOT CANVAS
                </span>
                {selectedAreaId && (
                  <button
                    onClick={() => setSelectedAreaId(null)}
                    className="pointer-events-auto border-2 border-foreground bg-background px-3 py-1  text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="size-3" />
                    রিসেট
                  </button>
                )}
              </div>

              {/* Area Markers (Tactile Neo-Brutalist Stamp Nodes) */}
              {filteredAreas.map((area) => {
                const isSelected = selectedAreaId === area.id;
                const isMajor = area.reports >= 5;

                return (
                  <div
                    key={area.id}
                    className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group/marker"
                    style={{ left: area.left, top: area.top }}
                    onClick={() => setSelectedAreaId(area.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedAreaId(area.id)}
                    aria-label={`${area.bnName}: ${area.reports}টি অভিযোগ`}
                  >
                    <div className="relative flex items-center justify-center">
                      {/* Marker Node Bubble */}
                      <div
                        className={cn(
                          "relative flex items-center justify-center  font-bold transition-all duration-200 border-2 cursor-pointer",
                          isSelected
                            ? "size-12 border-foreground bg-primary text-foreground shadow-[3px_3px_0_var(--foreground)] -translate-y-1 z-30"
                            : isMajor
                            ? "size-10 border-foreground bg-primary text-foreground shadow-[2px_2px_0_var(--foreground)] hover:-translate-y-0.5"
                            : "size-8 border-foreground bg-card text-foreground shadow-[2px_2px_0_var(--foreground)] hover:bg-primary"
                        )}
                      >
                        <span className="text-xs sm:text-sm font-extrabold">
                          {formatBnNumber(area.reports)}
                        </span>
                      </div>

                      {/* Area Name Label */}
                      <div
                        className={cn(
                          "absolute top-full mt-2 whitespace-nowrap border-2 border-foreground px-2 py-0.5  text-[11px] font-bold transition-all pointer-events-none shadow-[2px_2px_0_var(--foreground)]",
                          isSelected
                            ? "bg-foreground text-background"
                            : "bg-background text-foreground group-hover/marker:bg-foreground group-hover/marker:text-background"
                        )}
                      >
                        {area.bnName}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Bottom Canvas Indicators */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                <div className="flex items-center gap-1.5 border-2 border-border bg-background px-3 py-1.5 text-xs  text-foreground shadow-[2px_2px_0_var(--foreground)]">
                  <MapPin className="size-3.5 text-primary shrink-0" />
                  <span>মার্কারে ক্লিক করে বিস্তারিত প্রতিবেদন দেখুন</span>
                </div>

                <div className="flex items-center gap-2 border-2 border-border bg-background px-3 py-1.5 text-xs  text-muted-foreground shadow-[2px_2px_0_var(--foreground)]">
                  <span className="size-2 bg-primary" />
                  <span>রঙিন নোড = অভিযোগ ঘনত্ব</span>
                </div>
              </div>
            </div>

            {/* Sidebar Inspector Panel (Dossier Inspector) */}
            <aside className="p-5 sm:p-6 bg-card flex flex-col justify-between">
              <div className="space-y-5">
                {selectedArea ? (
                  <>
                    <div className="space-y-1.5 border-b-2 border-border pb-4">
                      <div className="flex items-center justify-between">
                        <span className="border border-border bg-background px-2 py-0.5  text-[10px] font-bold text-muted-foreground uppercase">
                          {selectedArea.type}
                        </span>
                        <span className=" text-xs text-muted-foreground">
                          {selectedArea.name}
                        </span>
                      </div>
                      <h3 className="text-2xl font-extrabold text-foreground font-heading mt-2">
                        {selectedArea.bnName}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {selectedArea.summary}
                      </p>
                    </div>

                    {/* Metric Cards Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="border-2 border-border bg-background p-3 shadow-[2px_2px_0_var(--foreground)]">
                        <span className="text-[11px] text-muted-foreground font-medium block">
                          মোট অভিযোগ
                        </span>
                        <span className="text-2xl font-extrabold text-foreground  mt-0.5 block">
                          {formatBnNumber(selectedArea.reports)}
                        </span>
                        <span className="text-[10px] text-muted-foreground ">টি নথিভুক্ত</span>
                      </div>

                      <div className="border-2 border-border bg-background p-3 shadow-[2px_2px_0_var(--foreground)]">
                        <span className="text-[11px] text-muted-foreground font-medium block">
                          যাচাইয়ের হার
                        </span>
                        <span className="text-2xl font-extrabold text-primary  mt-0.5 block">
                          {formatBnPercent(selectedArea.verifiedRate)}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold ">প্রমাণসহ</span>
                      </div>
                    </div>

                    {/* Top Issue Categories for this area */}
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-bold text-foreground uppercase  tracking-wider">
                        শীর্ষ অভিযোগের ক্ষেত্রসমূহ
                      </h4>
                      <div className="space-y-1.5">
                        {selectedArea.topCategories.map((cat) => (
                          <div
                            key={cat.name}
                            className="flex items-center justify-between border-2 border-border bg-background px-3 py-2 text-xs "
                          >
                            <span className="font-bold text-foreground">{cat.name}</span>
                            <span className="border border-primary/40 bg-primary/10 px-2 py-0.5  text-[11px] font-bold text-primary">
                              {formatBnNumber(cat.count)}টি
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-2 border-border bg-secondary/30 p-3 text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-foreground ">
                        <TrendingUp className="size-3.5 text-primary" />
                        <span>গড় নিস্পত্তি সময়</span>
                      </div>
                      <p className="leading-relaxed">
                        এই অঞ্চলে অভিযোগ নথির পর প্রাথমিক প্রতিক্রিয়া আসতে গড়ে {formatBnNumber(selectedArea.avgResolutionDays)} কার্যদিবস সময় লাগে।
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-center space-y-3">
                    <MapPinned className="size-10 mx-auto text-muted-foreground/50" />
                    <h4 className="text-sm font-bold text-foreground font-heading">কোনো এলাকা নির্বাচিত নেই</h4>
                    <p className="text-xs text-muted-foreground max-w-[220px] mx-auto">
                      ম্যাপের যে-কোনো মার্কার অথবা নিচের তালিকা থেকে একটি এলাকা নির্বাচন করুন।
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar Action Button */}
              <div className="pt-5 border-t-2 border-border mt-6">
                <Link
                  href={`/reports?area=${selectedArea ? selectedArea.id : ""}`}
                  className="inline-flex w-full items-center justify-center gap-2 border-2 border-foreground bg-primary px-4 py-3 text-xs font-bold text-foreground shadow-[3px_3px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
                >
                  <span>{selectedArea ? `${selectedArea.bnName}-এর রিপোর্ট দেখুন` : "সকল এলাকার রিপোর্ট দেখুন"}</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </aside>
          </div>
        ) : (
          /* List / Table View of all areas */
          <div className="divide-y-2 divide-border">
            <div className="p-4 bg-muted/40 grid grid-cols-12 gap-3 text-xs font-bold text-muted-foreground uppercase tracking-wider ">
              <span className="col-span-5 sm:col-span-4">এলাকার নাম ও ধরন</span>
              <span className="col-span-3 sm:col-span-3 text-center">রিপোর্ট সংখ্যা</span>
              <span className="col-span-4 sm:col-span-3 text-center">যাচাই হার</span>
              <span className="hidden sm:col-span-2 sm:block text-right">পদক্ষেপ</span>
            </div>

            {filteredAreas.map((area) => (
              <div
                key={area.id}
                className="p-4 grid grid-cols-12 gap-3 items-center hover:bg-muted/30 transition-colors"
              >
                <div className="col-span-5 sm:col-span-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground font-heading">
                      {area.bnName}
                    </span>
                    <span className="border border-border bg-background px-1.5 py-0.25  text-[10px] font-bold text-muted-foreground">
                      {area.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {area.summary}
                  </p>
                </div>

                <div className="col-span-3 sm:col-span-3 text-center">
                  <span className="border border-border bg-background px-2.5 py-1  font-bold text-xs text-foreground">
                    {formatBnNumber(area.reports)} টি
                  </span>
                </div>

                <div className="col-span-4 sm:col-span-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 ">
                    <CheckCircle2 className="size-3.5 text-primary" />
                    <span className="text-xs font-bold text-foreground">
                      {formatBnPercent(area.verifiedRate)}
                    </span>
                  </div>
                </div>

                <div className="hidden sm:col-span-2 sm:flex sm:justify-end">
                  <Link
                    href={`/reports?area=${area.id}`}
                    className="inline-flex items-center gap-1 border-2 border-foreground bg-background px-3 py-1.5 text-xs font-bold text-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                  >
                    <span>রিপোর্ট</span>
                    <ChevronRight className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Card Footer Overall Stats */}
        <div className="border-t-2 border-border p-4 bg-muted/20 flex flex-wrap items-center justify-between gap-4 text-xs  text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              মোট হটস্পট: <strong className="text-foreground">{formatBnNumber(AREAS.length)}</strong>টি
            </span>
            <span>·</span>
            <span>
              মোট নথিভুক্ত ঘটনা: <strong className="text-foreground">{formatBnNumber(totalReportsCount)}</strong>টি
            </span>
          </div>

          <div className="flex items-center gap-2">
            <EyeOff className="size-3.5 text-primary" />
            <span>কোনো নাগরিকের পরিচয় বা অবস্থান ডেটাবেজে সংরক্ষিত হয় না</span>
          </div>
        </div>
      </div>
    </div>
  );
}
