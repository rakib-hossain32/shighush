"use client";

import { useEffect } from "react";
import { AlertTriangleIcon, HomeIcon, RotateCcwIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Public page error boundary.
 *
 * Provides user-friendly error UI with options to retry or return home.
 * Error details are logged to console but not exposed to public users.
 */
export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[public]", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="border-2 border-foreground bg-card p-8 shadow-[6px_6px_0_var(--foreground)]">
        <div className="flex items-start gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangleIcon className="size-7" />
          </span>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight">কিছু একটা ভুল হয়েছে</h1>

            <p className="mt-3 leading-7 text-muted-foreground">
              দুঃখিত, এই পাতাটি লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন অথবা
              হোমপেজে ফিরে যান।
            </p>

            {error.digest && (
              <p className="mono mt-4 rounded border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
                ত্রুটি কোড: {error.digest}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={reset} variant="default">
                <RotateCcwIcon />
                আবার চেষ্টা করুন
              </Button>
              <Button
                render={<Link href="/" />}
                variant="outline"
                nativeButton={false}
              >
                <HomeIcon />
                হোমপেজে ফিরে যান
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
