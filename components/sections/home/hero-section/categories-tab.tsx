import { Landmark } from "lucide-react";
import type { CategoryStat } from "./types";

interface CategoriesTabProps {
  categories: CategoryStat[];
}

export function CategoriesTab({ categories }: CategoriesTabProps) {
  if (categories.length === 0) {
    return (
      <div className="col-span-full rounded-xl border-2 border-border bg-card p-8 text-center">
        <Landmark className="mx-auto size-12 text-muted-foreground" />
        <p className="mt-4 font-bold text-muted-foreground">কোনো ডেটা নেই</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((cat) => (
        <div
          key={cat.category}
          className="rounded-xl border-2 border-foreground bg-card p-4 shadow-[4px_4px_0_0_hsl(var(--foreground))]"
        >
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="text-xs font-bold text-muted-foreground">
              {cat.labelBn}
            </span>
            <span className="rounded bg-secondary/20 px-1.5 py-0.5 text-[10px] font-bold text-secondary">
              {cat.trend}
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-mono text-3xl font-black">
              {String(cat.count).padStart(2, "০")}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground">
              {cat.status}
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-secondary"
              style={{ width: `${Math.min((cat.count / 30) * 100, 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
