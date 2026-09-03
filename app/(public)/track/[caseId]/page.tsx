import { PageFrame } from "@/components/page-frame";
import { CaseStatusTimeline } from "@/components/sections/track/case-status-timeline";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createPageMetadata({ title: "গোপন কেসের অবস্থা", description: "Private case status দেখতে Secret Token প্রয়োজন।", index: false });
}

export default async function CaseStatusPage() {
  return <PageFrame eyebrow="গোপন কেস / সুরক্ষিত অবস্থা" title="আপনার অভিযোগের অগ্রগতি" copy="Case ID ও Secret Token যাচাই হওয়ার পরে শুধু আপনার জন্য এই case record ও প্রয়োজনীয় নিরাপদ বার্তা দেখা যাবে।"><CaseStatusTimeline /></PageFrame>;
}
