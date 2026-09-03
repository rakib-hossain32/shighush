import { Skeleton } from "@/components/ui/skeleton";

/**
 * Streamed while a dashboard page resolves its session and data.
 *
 * Mirrors the real layout — header block, stat row, table — so the page does not jump
 * when content arrives. A spinner would be less work and a worse experience.
 */
export default function AdminLoading() {
  return (
    <>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton className="h-28" key={`stat-${index}`} />
        ))}
      </div>

      <Skeleton className="h-72" />
    </>
  );
}
