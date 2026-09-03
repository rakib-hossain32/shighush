import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading state for authentication pages.
 *
 * Simple centered skeleton matching login form structure.
 */
export default function AuthLoading() {
  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Skeleton className="mx-auto h-12 w-12 rounded-full" />
        <Skeleton className="h-10 w-48 mx-auto" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
