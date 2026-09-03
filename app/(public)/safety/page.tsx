import { EyeOff, FileWarning, HeartHandshake, ShieldCheck } from "lucide-react";
import { PageFrame } from "@/components/page-frame";
import { createPageMetadata } from "@/lib/seo";
export const metadata = createPageMetadata({ title: "অভিযোগকারীর নিরাপত্তা", description: "পরিচয় ও সংবেদনশীল তথ্য সুরক্ষিত রেখে কীভাবে নাগরিক প্রতিবেদন জমা দেবেন, তা জানুন।", path: "/safety" });
const rules = [
  [
    EyeOff,
    "পরিচয় প্রকাশ করবেন না",
    "নিজের নাম, ফোন, NID, বাসার ঠিকানা বা পরিবারের তথ্য লিখবেন না।",
  ],
  [
    FileWarning,
    "প্রমাণে ব্যক্তিগত তথ্য ঢাকুন",
    "ছবি বা নথিতে মুখ, QR code, স্বাক্ষর, নম্বর ও ঠিকানা থাকলে মাস্ক করুন।",
  ],
  [
    HeartHandshake,
    "শান্ত ভাষা ব্যবহার করুন",
    "ঘটনা লিখুন—গালি, হুমকি বা যাচাইহীন চূড়ান্ত রায় লিখবেন না।",
  ],
];
export default function SafetyPage() {
  return (
    <PageFrame
      eyebrow="নিরাপত্তা নীতি / আগে পড়ুন"
      title="সাহসী হোন, সতর্কও হোন"
      copy="শিঘুষ অভিযোগকারীর পরিচয় নিরাপদ রাখতে ডিজাইন করা হয়েছে। তবু অনলাইনে কিছু তথ্য একবার প্রকাশ পেলে পুরোপুরি ফেরানো কঠিন হতে পারে।"
    >
      <div className="grid gap-5 md:grid-cols-3">
        {rules.map(([Icon, title, copy]) => {
          const I = Icon as typeof ShieldCheck;
          return (
            <article
              key={title as string}
              className="border-2 border-[#10221e] p-6"
            >
              <I className="size-7 text-[#e95132]" />
              <h2 className="display mt-10 text-3xl font-bold">
                {title as string}
              </h2>
              <p className="mt-4 leading-7 text-[#365149]">{copy as string}</p>
            </article>
          );
        })}
      </div>
      <div className="mt-10 border-l-8 border-[#e95132] bg-[#ece3ce] p-6">
        <h2 className="text-xl font-bold">মনে রাখুন</h2>
        <p className="mt-2 max-w-3xl leading-7 text-[#365149]">
          প্ল্যাটফর্মে প্রকাশিত কোনো নথি অপরাধের চূড়ান্ত প্রমাণ নয়। ভুল বা
          গোপনীয়তা-ঝুঁকিপূর্ণ কনটেন্টে আপিল বা flag করার ব্যবস্থা থাকবে।
        </p>
      </div>
    </PageFrame>
  );
}
