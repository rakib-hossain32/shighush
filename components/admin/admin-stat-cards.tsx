import Link from "next/link";
import {
  ArrowUpRightIcon,
  MinusIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatBnNumber, toBnDigits } from "@/lib/format";
import type { OverviewMetric } from "@/services";

/**
 * KPI row for the dashboard overview.
 *
 * Derived from the template's `stats.tsx` (same four-card layout, same trend affordance)
 * but rewritten for two reasons the original could not handle:
 *
 *  1. **Theme tokens.** `delta.tsx` hardcodes `emerald-500` / `red-500`, which are not in
 *     this product's palette and would not follow a token change. `TrendPill` uses
 *     `--secondary` and `--destructive`.
 *
 *  2. **`lowerIsBetter`.** The template declared the flag in its `Stat` type and then
 *     never used it, so a growing review queue rendered as green "good news". Here a rise
 *     in queue depth or privacy alerts is correctly shown as a regression.
 */
export function AdminStatCards({ metrics }: { metrics: OverviewMetric[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const body = (
          <Card className="h-full border-border shadow-none transition-colors group-hover:border-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-normal text-muted-foreground">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p className="font-semibold text-3xl tabular-nums text-foreground">
                {formatBnNumber(metric.value)}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <TrendPill
                  delta={metric.delta}
                  lowerIsBetter={metric.lowerIsBetter}
                />
                <span className="text-muted-foreground">{metric.footnote}</span>
              </div>
            </CardContent>
          </Card>
        );

        // Every tile is a shortcut into the filtered list it summarises, so a number is
        // never a dead end.
        return metric.href ? (
          <Link className="group relative" href={metric.href} key={metric.key}>
            {body}
            <ArrowUpRightIcon className="absolute right-4 top-4 size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ) : (
          <div key={metric.key}>{body}</div>
        );
      })}
    </div>
  );
}

function TrendPill({
  delta,
  lowerIsBetter,
}: {
  delta: number | null;
  lowerIsBetter: boolean;
}) {
  if (delta === null || Number.isNaN(delta)) {
    return (
      <span className="inline-flex items-center gap-1 text-muted-foreground">
        <MinusIcon className="size-3.5" />
        তুলনার ভিত্তি নেই
      </span>
    );
  }

  const rounded = Math.abs(delta) < 0.05 ? 0 : delta;
  // "Good" depends on the metric: fewer reports awaiting review is an improvement.
  const isImprovement = lowerIsBetter ? rounded < 0 : rounded > 0;
  const Icon =
    rounded === 0 ? MinusIcon : rounded > 0 ? TrendingUpIcon : TrendingDownIcon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-bold tabular-nums",
        rounded === 0 && "text-muted-foreground",
        rounded !== 0 && isImprovement && "text-secondary-foreground",
        rounded !== 0 && !isImprovement && "text-destructive",
      )}
    >
      <Icon className="size-3.5" />
      {toBnDigits(Math.abs(rounded).toFixed(1))}%
    </span>
  );
}
