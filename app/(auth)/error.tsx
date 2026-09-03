"use client";

import { useEffect } from "react";
import { AlertTriangleIcon, RotateCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Auth page error boundary.
 *
 * Minimal error UI for authentication failures.
 */
export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[auth]", error);
  }, [error]);

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-md border-2 border-foreground bg-card p-6 shadow-[6px_6px_0_var(--foreground)]">
        <div className="flex flex-col items-center text-center">
          <span className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangleIcon className="size-6" />
          </span>

          <h1 className="mt-4 text-xl font-bold">লগইন সমস্যা</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            লগইন পাতা লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।
          </p>

          {error.digest && (
            <p className="mono mt-4 rounded border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
              {error.digest}
            </p>
          )}

          <Button className="mt-6" onClick={reset}>
            <RotateCcwIcon />
            আবার চেষ্টা করুন
          </Button>
        </div>
      </div>
    </div>
  );
}
