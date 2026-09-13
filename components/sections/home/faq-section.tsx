"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  MessageSquareShare,
  ArrowUpRight,
  FileQuestion,
} from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    id: "privacy",
    question: "আমার নাম, ফোন নম্বর বা পরিচয় কি কোনো কর্মকর্তা বা পুলিশ জানতে পারবে?",
    answer:
      "না, কোনো অবস্থাতেই নয়। শিঘুষ প্ল্যাটফর্মে রিপোর্ট দাখিলের জন্য কোনো নাম, মোবাইল নম্বর, ইমেইল বা NID কার্ডের তথ্য দেওয়ার প্রয়োজন হয় না। এছাড়া কোনো প্রমাণ বা ছবি আপলোড করা হলে তাতে থাকা মুখমণ্ডল, স্বাক্ষর বা ব্যক্তিগত সংবেদনশীল অংশ রিভিউয়ার টিম সতর্কতার সাথে মাস্ক (ঢেকে) করে দেয়। আমাদের ডাটাবেজেও কোনো আইপি বা ব্যক্তিগত পরিচিতি সংরক্ষিত থাকে না।",
    badge: "নিরাপত্তা ও গোপনীয়তা",
  },
  {
    id: "evidence",
    question: "আমার কাছে কোনো ছবি বা অডিও রেকর্ড না থাকলে কি অভিযোগ করা যাবে?",
    answer:
      "হ্যাঁ, অবশ্যই করা যাবে। আপনার ঘটনাটি ‘অযাচাইকৃত নাগরিক বিবরণ’ ক্যাটাগরিতে অন্তর্ভুক্ত হবে। বাস্তব তথ্য দিয়ে ঘটনা বিস্তারিত লিখলে পরবর্তীতে একই দপ্তরের বিরুদ্ধে অন্য কারো অনুরূপ অভিযোগ বা প্রমাণ পাওয়া গেলে নথিটি স্বয়ংক্রিয়ভাবে অধিকতর বিশ্বাসযোগ্যতা পায়।",
    badge: "প্রমাণের স্তর",
  },
  {
    id: "right-to-reply",
    question: "কোনো দপ্তরের কর্মকর্তা বা কর্মচারী কি রিপোর্টের বিরুদ্ধে নিজের বক্তব্য দিতে পারবেন?",
    answer:
      "হ্যাঁ, শিঘুষ কাউকে একতরফাভাবে অভিযুক্ত করার প্ল্যাটফর্ম নয়। সংশ্লিষ্ট প্রতিষ্ঠান বা ব্যক্তি তাদের অফিশিয়াল ব্যাখ্যা বা আইনি নিষ্পত্তির তথ্য জানাতে চাইলে, প্ল্যাটফর্মে ‘দাপ্তরিক প্রতিক্রিয়া’ আকারে তা ওই নির্দিষ্ট নথির নিচে সুনির্দিষ্ট টাইমস্ট্যাম্পসহ উন্মুক্তভাবে প্রদর্শন করা হয়।",
    badge: "নিরপেক্ষতা নীতি",
  },
  {
    id: "false-reports",
    question: "ব্যক্তিগত শত্রুতা বা কাউকে ব্ল্যাকমেইল করার উদ্দেশ্যে মিথ্যা রিপোর্ট প্রতিরোধে কী ব্যবস্থা আছে?",
    answer:
      "আমাদের নিরপেক্ষ রিভিউয়ার দল প্রকাশের আগে প্রতিটি রিপোর্ট পুঙ্খানুপুঙ্খভাবে যাচাই করে। অশালীন ভাষা, ব্যক্তিগত আক্রোশ বা যাচাইহীন গুরুতর অভিযোগ সরাসরি বাতিল করা হয়। এছাড়া ভুল বা উদ্দেশ্যপ্রণোদিত তথ্যের ক্ষেত্রে যে কেউ ‘আপিল ও সংশোধন’ ফর্মের মাধ্যমে লিখিত দাবি পাঠাতে পারেন।",
    badge: "নীতিগত ফিল্টারিং",
  },
  {
    id: "tracking",
    question: "রিপোর্ট জমা দেওয়ার পর সেটির অগ্রগতি কীভাবে অনুসরণ বা ট্র্যাক করব?",
    answer:
      "রিপোর্ট জমা দেওয়ার সাথে সাথে আপনি স্ক্রিনে একটি ইউনিক ‘Case ID’ এবং একটি অত্যন্ত গোপনীয় ‘Secret Token’ পাবেন। এই দুটি তথ্য নিজের কাছে সেভ করে রাখুন। ওয়েবসাইটের ‘কেস ট্র্যাক’ অপশনে গিয়ে এই কোড দুটি দিলেই আপনার রিপোর্টটির বর্তমান অবস্থা ও মডারেশন আপডেট দেখতে পাবেন।",
    badge: "কেস ট্র্যাকিং",
  },
  {
    id: "affiliation",
    question: "শিঘুষ কি কোনো রাজনৈতিক দল বা সরকারি দপ্তরের সাথে যুক্ত?",
    answer:
      "না। শিঘুষ সম্পূর্ণ অরাজনৈতিক, স্বাধীন এবং নিরপেক্ষ নাগরিক প্রযুক্তি প্ল্যাটফর্ম। শিবচরের সাধারণ নাগরিকদের সেবামূলক অধিকার ও জবাবদিহিতা প্রতিষ্ঠার লক্ষ্যেই এটি স্থানীয় প্রযুক্তিবিদ ও সচেতন নাগরিকদের দ্বারা পরিচালিত।",
    badge: "স্বাধীন নাগরিক উদ্যোগ",
  },
];

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>("privacy");

  function toggleFaq(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <section
      id="faq"
      className="relative border-b-2 border-border bg-background py-18 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* Left Column: Context & Support Card */}
          <div className="lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold tracking-wider text-primary">
              <HelpCircle className="size-3.5" />
              <span>১১ — সচরাচর জিজ্ঞাসা / নাগরিক সহায়িকা</span>
            </div>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              আপনার মনে যত প্রশ্ন,<br className="hidden sm:inline" />
              স্বচ্ছ ও স্পষ্ট উত্তর।
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              নাগরিক হিসেবে আপনার নিরাপত্তা, রিপোর্টের সত্যতা যাচাই এবং আইনগত
              অধিকার সম্পর্কিত সাধারণ প্রশ্নগুলোর সরাসরি উত্তর এখানে দেওয়া হয়েছে।
            </p>

            {/* Support Card */}
            <div className="mt-8 border-2 border-border bg-card p-6 shadow-[4px_4px_0_var(--foreground)]">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center bg-primary/10 text-primary border border-primary/30">
                  <MessageSquareShare className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    আরও কোনো প্রশ্ন বা বিশেষ আপিল আছে?
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    আমরা নিরপেক্ষভাবে প্রতিটি বিষয়ে সহায়তা করি।
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2.5 border-t border-border/70 pt-4">
                <Link
                  href="/safety"
                  className="flex items-center justify-between text-xs font-semibold text-foreground hover:text-primary transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="size-3.5 text-primary" />
                    সম্পূর্ণ নিরাপত্তা ও সুরক্ষা গাইডলাইন
                  </span>
                  <ArrowUpRight className="size-3.5" />
                </Link>

                <Link
                  href="/appeal"
                  className="flex items-center justify-between text-xs font-semibold text-foreground hover:text-primary transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileQuestion className="size-3.5 text-primary" />
                    নথির বিরুদ্ধে আপিল বা সংশোধন ফরম
                  </span>
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Accordion */}
          <div className="space-y-3">
            {faqs.map((faq) => {
              const isOpen = openId === faq.id;

              return (
                <div
                  key={faq.id}
                  className={cn(
                    "border-2 transition-all duration-200",
                    isOpen
                      ? "border-foreground bg-card shadow-[3px_3px_0_var(--foreground)]"
                      : "border-border bg-card/40 hover:border-foreground/50",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start justify-between gap-4 p-5 text-left cursor-pointer sm:p-6"
                  >
                    <div className="space-y-1">
                      <span className="inline-block rounded-none bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                        {faq.badge}
                      </span>
                      <h3 className="text-base font-bold text-foreground sm:text-lg">
                        {faq.question}
                      </h3>
                    </div>

                    <div
                      className={cn(
                        "grid size-8 shrink-0 place-items-center border border-border bg-background transition-transform duration-200",
                        isOpen && "rotate-180 border-foreground bg-foreground text-background",
                      )}
                    >
                      <ChevronDown className="size-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-border px-5 pb-5 pt-3 sm:px-6 sm:pb-6">
                      <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground sm:leading-7">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
