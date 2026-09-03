import Link from "next/link";
import { ArrowUpRight, MapPinned, MessageSquareText, ShieldAlert } from "lucide-react";

import {
  INSTITUTION_CATEGORY_META,
  INSTITUTION_TYPE_META,
  OFFICE_LEVEL_META,
} from "@/lib/domain/enums";
import { areaName, DISTRICT_BN } from "@/lib/domain/geo";
import { formatBnCount } from "@/lib/format";
import type { Institution, InstitutionResponse } from "@/services/_shared/types";

export function InstitutionInformationPanel({
  institution,
  responses = [],
}: {
  institution: Institution;
  /** Verified replies across this institution's reports, newest first. */
  responses?: InstitutionResponse[];
}) {
  const verifiedCount = responses.filter((r) => r.verified).length;

  return (
    <aside className="space-y-5">
      <section className="border border-border bg-card p-5">
        <MapPinned className="size-5 text-primary" />
        <h2 className="mt-4 text-lg font-bold">প্রতিষ্ঠান পরিচিতি</h2>

        <dl className="mt-4 space-y-3 text-sm">
          <Row label="এলাকা">
            {areaName(institution.location.area)}, {DISTRICT_BN}
          </Row>
          <Row label="সেবার ধরন">
            {INSTITUTION_CATEGORY_META[institution.category].label}
          </Row>
          <Row label="প্রতিষ্ঠানের ধরন">
            {INSTITUTION_TYPE_META[institution.type].label}
          </Row>
          <Row label="দফতরের স্তর">{OFFICE_LEVEL_META[institution.officeLevel].label}</Row>
          {institution.website && (
            <Row label="ওয়েবসাইট">
              <a
                className="underline underline-offset-4 hover:text-primary"
                href={institution.website}
                rel="noreferrer noopener"
                target="_blank"
              >
                সরকারি পেজ
              </a>
            </Row>
          )}
          <Row label="রেকর্ডের অবস্থা">
            {institution.status === "active" ? "সক্রিয়" : "সংরক্ষিত"}
          </Row>
        </dl>
      </section>

      <section className="border border-border bg-foreground p-5 text-background">
        <MessageSquareText className="size-5 text-secondary" />
        <h2 className="mt-4 text-lg font-bold">প্রতিষ্ঠানের জবাব</h2>

        {responses.length > 0 ? (
          <p className="mt-2 text-sm leading-6 text-background/70">
            {formatBnCount(responses.length)} জবাব যুক্ত হয়েছে
            {verifiedCount > 0 && <>, যার {formatBnCount(verifiedCount)} যাচাইকৃত</>}। প্রতিটি
            জবাব মূল রিপোর্ট অপরিবর্তিত রেখে আলাদা সময়চিহ্নসহ দেখানো হয়।
          </p>
        ) : (
          <p className="mt-2 text-sm leading-6 text-background/70">
            যাচাইকৃত প্রতিনিধির কোনো জবাব এখনো যুক্ত হয়নি। সংশোধনী বা ব্যাখ্যা আলাদা
            সময়চিহ্নসহ প্রদর্শিত হবে।
          </p>
        )}

        <Link
          className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-secondary underline underline-offset-4"
          href="/appeal"
        >
          জবাব বা সংশোধনী দিন <ArrowUpRight className="size-4" />
        </Link>
      </section>

      <section className="border border-primary/30 bg-primary/5 p-5">
        <ShieldAlert className="size-5 text-primary" />
        <h2 className="mt-3 text-base font-bold">পড়ার আগে মনে রাখুন</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          রিপোর্টের সংখ্যা কোনো অপরাধের প্রমাণ নয়, এবং প্রতিষ্ঠানের আকার বা সেবাগ্রহীতার
          সংখ্যা অনুযায়ী সমন্বয় করা হয়নি। প্রমাণ, যাচাইয়ের স্তর ও প্রতিক্রিয়া একসঙ্গে
          বিবেচনা করুন।
        </p>
      </section>
    </aside>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}
