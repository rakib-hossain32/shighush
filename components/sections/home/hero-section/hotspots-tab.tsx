import { BarChart3, MapPinned } from "lucide-react";
import type { AreaHotspot } from "./types";

interface HotspotsTabProps {
  hotspots: AreaHotspot[];
}

export function HotspotsTab({ hotspots }: HotspotsTabProps) {
  return (
    <div className="rounded-xl border-2 border-foreground bg-foreground p-5 text-background shadow-[6px_6px_0_0_hsl(var(--foreground))]">
      <div className="flex items-center justify-between border-b border-muted-foreground pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-4 text-secondary" />
          <h4 className="text-xs font-extrabold uppercase tracking-wider">
            এলাকাভিত্তিক রিপোর্টের ঘনত্ব
          </h4>
        </div>
        <span className="rounded bg-card px-2 py-0.5  text-[10px] font-bold text-foreground">
          গত ৩০ দিনের চিত্র
        </span>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {hotspots.length > 0 ? (
          hotspots.map((hotspot) => (
            <div
              key={hotspot.area}
              className="rounded-lg border border-muted-foreground bg-foreground/50 p-3"
            >
              <div className="flex justify-between text-xs font-bold">
                <span>{hotspot.area}</span>
                <span className=" text-secondary">
                  {hotspot.count} টি নথি
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted-foreground">
                <div
                  className="h-full rounded-full bg-secondary transition-all duration-500"
                  style={{ width: `${hotspot.percentage}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full rounded-lg bg-card p-6 text-center text-foreground">
            <MapPinned className="mx-auto size-12 text-muted-foreground" />
            <p className="mt-4 font-bold text-muted-foreground">কোনো ডেটা নেই</p>
          </div>
        )}
      </div>
    </div>
  );
}
