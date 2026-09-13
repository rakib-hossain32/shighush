import { PageFrame } from "@/components/page-frame";
import { TrackAccessForm } from "@/components/sections/track/track-access-form";
import { TrackExpectations } from "@/components/sections/track/track-expectations";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "গোপন কেস ট্র্যাকিং পোর্টাল",
  description:
    "Case ID ও Secret Token দিয়ে নিজের অভিযোগের সুরক্ষিত ও বেনামি অগ্রগতি পর্যবেক্ষণ করুন।",
  path: "/track",
  index: false,
});

export default function TrackPage() {
  return (
    <PageFrame
      badgeText="ব্যক্তিগত ও এনক্রিপ্টেড স্পেস"
      breadcrumbs={[{ label: "কেস ট্র্যাকিং" }]}
      copy="অভিযোগ জমা দেওয়ার পরে পাওয়া Case ID ও Secret Token দিয়ে আপনার ব্যক্তিগত কেস স্পেসে প্রবেশ করুন। এই তথ্য কারও সঙ্গে শেয়ার করবেন না।"
      eyebrow="গোপন কেস ট্র্যাকিং / সুরক্ষিত পোর্টাল"
      title="আপনার নথির বর্তমান অগ্রগতি দেখুন"
    >
      <div className="space-y-6">
        <TrackAccessForm />
        <TrackExpectations />
      </div>
    </PageFrame>
  );
}
