import { PageFrame } from "@/components/page-frame";
import { AreaMapBoard } from "@/components/sections/map/area-map-board";
import { MapReadingNotes } from "@/components/sections/map/map-reading-notes";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({ title: "রিপোর্টের এলাকা-চিত্র", description: "শিবচরের ইউনিয়নভিত্তিক নাগরিক প্রতিবেদনের গোপনীয়তা-সুরক্ষিত aggregate view।", path: "/map" });

export default function MapPage() {
  return <PageFrame eyebrow="এলাকা পর্যবেক্ষণ / শিবচর" title="রিপোর্টের এলাকা-চিত্র" copy="কোন এলাকায় কী ধরনের রিপোর্ট নথিভুক্ত হচ্ছে, তার একটি গোপনীয়তা-সুরক্ষিত aggregate view। এটি কখনো অভিযোগকারীর অবস্থান দেখায় না।"><AreaMapBoard /><MapReadingNotes /></PageFrame>;
}
