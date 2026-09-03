import { PageFrame } from "@/components/page-frame";
import { PersonRecordPolicy } from "@/components/sections/person-detail/person-record-policy";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return createPageMetadata({ title: "সীমিত ব্যক্তি-রেকর্ড", description: "নাম উল্লেখের threshold, গোপনীয়তা এবং সংশোধনের অধিকার সম্পর্কে জানুন।", index: false });
}

export default function PersonPage() {
  return <PageFrame eyebrow="সীমিত ব্যক্তি-রেকর্ড / প্রকাশনীতি" title="নাম উল্লেখের আগে সুরক্ষা" copy="কোনো ব্যক্তির নাম কেবল নীতিগত threshold ও প্রাসঙ্গিক প্রমাণ পূরণ হলে সীমিতভাবে প্রদর্শনযোগ্য। একটি রিপোর্ট বা public profile কখনোই অপরাধের চূড়ান্ত সিদ্ধান্ত নয়।"><PersonRecordPolicy /></PageFrame>;
}
