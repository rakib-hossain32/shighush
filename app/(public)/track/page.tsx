import { PageFrame } from "@/components/page-frame";
import { TrackAccessForm } from "@/components/sections/track/track-access-form";
import { TrackExpectations } from "@/components/sections/track/track-expectations";
import { createPageMetadata } from "@/lib/seo";
export const metadata = createPageMetadata({ title: "গোপন কেস ট্র্যাকিং", description: "Case ID ও Secret Token দিয়ে নিজের অভিযোগের private status দেখুন।", path: "/track", index: false });

export default function TrackPage() {
  return <PageFrame eyebrow="গোপন কেস ট্র্যাকিং / শুধু আপনার জন্য" title="আপনার নথির অবস্থা দেখুন" copy="অভিযোগ জমা দেওয়ার পরে পাওয়া Case ID ও Secret Token দিয়ে private case space-এ প্রবেশ করুন। এই তথ্য কারও সঙ্গে শেয়ার করবেন না।"><TrackAccessForm /><TrackExpectations /></PageFrame>;
}
