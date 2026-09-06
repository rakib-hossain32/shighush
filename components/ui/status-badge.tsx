import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { Tone } from "@/lib/domain/enums";

/**
 * The single place a status colour is decided.
 *
 * Before this existed, every list card carried its own ternary — e.g.
 * `verified ? "bg-secondary" : "bg-muted"` in the report card, a different pair in the
 * institution card, a third in the queue. Adding a verification level meant hunting
 * them down, and dark mode meant editing all of them.
 *
 * Tones map to theme tokens only. No hex literals: when `--destructive` is finally
 * split from `--primary`, and when `.dark` gets its missing tokens, every badge in the
 * product corrects itself without a single component edit.
 */

const TONE_CLASS: Record<Tone, string> = {
  neutral: "border-border bg-transparent text-foreground",
  muted: "border-transparent bg-muted text-muted-foreground",
  info: "border-transparent bg-foreground text-background",
  success: "border-transparent bg-secondary text-secondary-foreground",
  // --chart-5 is the palette's amber. It is the only warning hue the theme defines.
  warning: "border-transparent bg-[var(--chart-5)] text-foreground",
  danger: "border-transparent bg-destructive/12 text-destructive",
};

/** Dot-only variant, for dense table rows where a full pill is too heavy. */
const DOT_CLASS: Record<Tone, string> = {
  neutral: "bg-muted-foreground",
  muted: "bg-muted-foreground/60",
  info: "bg-foreground",
  success: "bg-secondary",
  warning: "bg-[var(--chart-5)]",
  danger: "bg-destructive",
};

export type StatusBadgeProps = {
  tone?: Tone;
  children: ReactNode;
  /** Leading icon. Sized by the badge, so pass it without size classes. */
  icon?: ReactNode;
  size?: "sm" | "md";
  className?: string;
};

export function StatusBadge({
  tone = "neutral",
  children,
  icon,
  size = "md",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border font-bold whitespace-nowrap",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
        TONE_CLASS[tone],
        "[&_svg]:size-3.5 [&_svg]:shrink-0",
        className,
      )}
      data-slot="status-badge"
      data-tone={tone}
    >
      {icon}
      {children}
    </span>
  );
}

/**
 * Status as a coloured dot plus label. Reads more calmly than a row of pills when
 * every line in a table has one.
 */
export function StatusDot({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap",
        className,
      )}
      data-slot="status-dot"
      data-tone={tone}
    >
      <span
        aria-hidden
        className={cn("size-2 shrink-0 rounded-full", DOT_CLASS[tone])}
      />
      {children}
    </span>
  );
}

/**
 * Renders any `*_META` entry directly, so a call site never destructures label and
 * tone by hand:
 *
 *   <MetaBadge meta={VERIFICATION_LEVEL_META[report.verificationLevel]} />
 */
export function MetaBadge({
  meta,
  short = false,
  icon,
  size = "md",
  className,
}: {
  meta: { label: string; short: string; tone: Tone };
  /** Use the abbreviated label — for narrow table columns. */
  short?: boolean;
  icon?: ReactNode;
  size?: "sm" | "md";
  className?: string;
}) {
  // Safety: handle undefined or invalid meta
  if (!meta || !meta.tone) {
    return (
      <span className="text-xs text-muted-foreground">
        {meta?.label || meta?.short || 'N/A'}
      </span>
    );
  }
  
  return (
    <StatusBadge tone={meta.tone} icon={icon} size={size} className={className}>
      {short ? meta.short : meta.label}
    </StatusBadge>
  );
}
