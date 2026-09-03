import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading state for public pages during server-side rendering or data fetching.
 *
 * Provides skeleton UI that roughly matches common page layouts (header, content blocks)
 * to reduce layout shift when content arrives.
 */
export default function PublicLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header skeleton */}
      <div className="mb-8 flex flex-col gap-3">
        <Skeleton className="h-10 w-2/3 max-w-md" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>

      {/* Content blocks skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
    </div>
  );
}
