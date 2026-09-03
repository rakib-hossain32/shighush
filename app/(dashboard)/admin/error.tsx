"use client";

import { useEffect } from "react";
import { AlertTriangleIcon, RotateCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Dashboard error boundary.
 *
 * The message shown to staff is deliberately generic. `error.digest` is the server-side
 * correlation id Next.js provides; the underlying message and stack stay on the server so
 * a database error cannot spill schema details onto a screen that may be shared or
 * screenshotted during an incident.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin]", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl py-12">
      <div className="border-2 border-foreground bg-card p-6 sm:p-8">
        <span className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangleIcon className="size-6" />
        </span>

        <h1 className="mt-6 text-2xl font-bold tracking-tight">কিছু একটা ভুল হয়েছে</h1>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          পাতাটি লোড করা যায়নি। আবার চেষ্টা করুন — সমস্যা থেকে গেলে নিচের কোডটি সহ
          কারিগরি দলকে জানান।
        </p>

        {error.digest && (
          <p className="mono mt-4 border border-border bg-muted p-3 text-xs">
            ত্রুটি কোড: {error.digest}
          </p>
        )}

        <div className="mt-7 flex flex-wrap gap-3">
          <Button onClick={reset}>
            <RotateCcwIcon />
            আবার চেষ্টা করুন
          </Button>
        </div>
      </div>
    </div>
  );
}
