import Link from "next/link";
import { AlertCircle, ArrowLeft, KeyRound, LockKeyhole } from "lucide-react";
import type { Metadata } from "next";

import { PageFrame } from "@/components/page-frame";
import { CaseStatusTimeline } from "@/components/sections/track/case-status-timeline";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/seo";
import { getReportByCase } from "@/services";

type CaseStatusPageProps = {
  params: Promise<{ caseId: string }>;
  searchParams: Promise<{ token?: string }>;
};

export async function generateMetadata({ params }: CaseStatusPageProps): Promise<Metadata> {
  const { caseId } = await params;
  return createPageMetadata({
    title: `কেস ট্র্যাকিং (${decodeURIComponent(caseId)})`,
    description: "Private case status দেখতে Secret Token প্রয়োজন।",
    index: false,
  });
}

export default async function CaseStatusPage({
  params,
  searchParams,
}: CaseStatusPageProps) {
  const { caseId } = await params;
  const { token } = await searchParams;
  const decodedId = decodeURIComponent(caseId);

  // If no token is provided in the query string
  if (!token) {
    return (
      <PageFrame
        badgeText="নিরাপত্তা যাচাই"
        breadcrumbs={[
          { label: "কেস ট্র্যাকিং", href: "/track" },
          { label: decodedId },
        ]}
        copy="এই কেসের অভ্যন্তরীণ বিবরণ দেখতে আপনার গোপন Secret Token প্রয়োজন।"
        eyebrow={`গোপন কেস / ${decodedId}`}
        title={`টোকেন আবশ্যক: ${decodedId}`}
      >
        <div className="mx-auto max-w-lg space-y-6">
          <div className="border-2 border-border bg-card p-6 shadow-[4px_4px_0_var(--foreground)]">
            <div className="flex items-center gap-3 border-b-2 border-border pb-4">
              <span className="grid size-10 place-items-center border border-border bg-background text-primary">
                <LockKeyhole className="size-5" />
              </span>
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                  AUTHENTICATION REQUIRED
                </span>
                <h2 className="mt-0.5 font-heading text-lg font-bold text-foreground">
                  Secret Token প্রদান করা হয়নি
                </h2>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              অভিযোগ দাখিলের সময় আপনাকে একটি এককালীন <strong className="text-foreground">Secret Token</strong> দেওয়া হয়েছিল। সুরক্ষার স্বার্থে টোকেন ছাড়া কোনো কেসের অগ্রগতি দেখা সম্ভব নয়।
            </p>

            <form
              action={`/track/${encodeURIComponent(decodedId)}`}
              method="GET"
              className="mt-5 space-y-4"
            >
              <div className="space-y-1.5">
                <label
                  htmlFor="tokenInput"
                  className="text-xs font-bold uppercase tracking-wider text-foreground"
                >
                  Secret Token লিখুন
                </label>
                <input
                  id="tokenInput"
                  name="token"
                  type="password"
                  required
                  placeholder="••••••••••••••••••••••••"
                  className="h-10 w-full border-2 border-border bg-background px-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/track">
                    <ArrowLeft className="mr-1.5 size-3.5" />
                    পেছনে যান
                  </Link>
                </Button>
                <Button
                  type="submit"
                  className="cursor-pointer rounded-none border-2 border-foreground bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-[2px_2px_0_var(--foreground)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                >
                  <KeyRound className="mr-1.5 size-3.5" />
                  যাচাই করুন
                </Button>
              </div>
            </form>
          </div>
        </div>
      </PageFrame>
    );
  }

  // Call the backend tracking endpoint
  let reportData: import("@/services/reports/reports.service").CaseTrackResult | null = null;
  let errorMessage = "এই Case ID এবং Secret Token দিয়ে কোনো নথি খুঁজে পাওয়া যায়নি।";

  try {
    const response = await getReportByCase(decodedId, token);
    reportData = response?.data ?? null;
  } catch (err: unknown) {
    if (err instanceof Error) {
      errorMessage = err.message;
    }
  }

  // If token is invalid or report not found
  if (!reportData) {
    return (
      <PageFrame
        badgeText="যাচাই ব্যর্থ"
        breadcrumbs={[
          { label: "কেস ট্র্যাকিং", href: "/track" },
          { label: decodedId },
        ]}
        copy="প্রদত্ত তথ্য অনুযায়ী কেসের বিবরণ লোড করা যায়নি।"
        eyebrow={`গোপন কেস / ${decodedId}`}
        title="নথি যাচাই ব্যর্থ হয়েছে"
      >
        <div className="mx-auto max-w-lg space-y-6">
          <Alert className="border-destructive/40 bg-destructive/10">
            <AlertCircle className="size-4 text-destructive" />
            <AlertTitle className="text-sm font-bold text-destructive">
              অনুমতি প্রত্যাখ্যাত বা নথি অনুপস্থিত
            </AlertTitle>
            <AlertDescription className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {errorMessage} অনুগ্রহ করে নিশ্চিত হন যে Case ID এবং Secret Token উভয়টি নির্ভুলভাবে প্রবেশ করানো হয়েছে।
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="outline" className="rounded-none border-2 border-foreground">
              <Link href="/track">
                <ArrowLeft className="mr-1.5 size-3.5" />
                ট্র্যাকিং পেজে ফিরে যান
              </Link>
            </Button>
            <Button asChild className="rounded-none border-2 border-foreground bg-primary text-primary-foreground">
              <Link href="/report/new">
                নতুন অভিযোগ দাখিল করুন
              </Link>
            </Button>
          </div>
        </div>
      </PageFrame>
    );
  }

  return (
    <PageFrame
      badgeText="এনক্রিপ্টেড স্পেস"
      breadcrumbs={[
        { label: "কেস ট্র্যাকিং", href: "/track" },
        { label: decodedId },
      ]}
      copy="Case ID ও Secret Token সফলভাবে যাচাই করা হয়েছে। নিচে আপনার রিপোর্টের বর্তমান রিয়েল-টাইম অগ্রগতি ও টাইমলাইন প্রদর্শিত হচ্ছে।"
      eyebrow={`গোপন কেস / ${decodedId}`}
      title={`অভিযোগের অগ্রগতি: ${decodedId}`}
    >
      <CaseStatusTimeline report={reportData} />
    </PageFrame>
  );
}
