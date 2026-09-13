"use client";

/**
 * Shared form primitives for the report wizard.
 *
 * Two jobs:
 *
 *  1. **One definition of a field's shell.** Label, required marker, optional badge,
 *     hint and error were hand-repeated ~40 times across the four step components, and
 *     had drifted (some fields showed hint *and* error, some replaced one with the
 *     other, some rendered no error at all). `<Field>` settles it.
 *
 *  2. **One definition of a control's classes.** Every call site used to carry
 *     `h-11 !h-11 … text-sm`. Two problems with that: `!h-11` is Tailwind v3 syntax and
 *     compiles to nothing under v4, and — the real bug — a bare `text-sm` override beats
 *     the primitive's `text-base` but not its `md:text-sm`, leaving inputs at 14px on
 *     phones. iOS Safari force-zooms any focused input under 16px, which is what threw
 *     the mobile layout sideways. The constants below deliberately carry **no** text-size
 *     class so `Input`/`Textarea`'s own `text-base md:text-sm` survives.
 */

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Control classes — every control sits on the same 44px touch baseline
 * ------------------------------------------------------------------ */

/** `<Input>`. No text-size class, on purpose — see the file header. */
export const FIELD_INPUT =
  "h-11 w-full rounded-none border-2 border-border bg-background focus:border-foreground";

/** `<Textarea>`. Likewise carries no text-size class. */
export const FIELD_TEXTAREA =
  "w-full max-w-full rounded-none border-2 border-border bg-background leading-relaxed focus:border-foreground";

/**
 * `<SelectTrigger>` and the date picker button. These are buttons, not text inputs, so
 * iOS never zooms them — but they sit beside inputs, so they match the 16px→14px ramp
 * for visual consistency rather than inheriting a flat 14px.
 */
export const FIELD_TRIGGER =
  "h-11 w-full rounded-none border-2 border-border bg-background text-base md:text-sm focus:border-foreground";

/* ------------------------------------------------------------------ *
 * Panel classes
 * ------------------------------------------------------------------ */

export const PANEL =
  "rounded-none border-2 border-foreground bg-card shadow-[2px_2px_0_var(--foreground)]";
export const PANEL_SOFT = "rounded-none border-2 border-border bg-background";
export const PANEL_ACCENT =
  "rounded-none border-2 border-primary/40 bg-primary/5 shadow-[2px_2px_0_var(--foreground)]";

/* ------------------------------------------------------------------ *
 * Field
 * ------------------------------------------------------------------ */

/**
 * The `aria-describedby` a control inside `<Field>` should carry.
 *
 * Names both the hint and the error node. Only one of the two is ever rendered, and
 * referencing an absent id is a no-op for assistive tech — which means the caller never
 * has to branch on whether there is currently an error.
 */
export function describedBy(id: string): string {
  return `${id}-hint ${id}-error`;
}

export interface FieldProps {
  /** Must match the control's `id`. Also seeds the hint/error node ids. */
  id: string;
  label: ReactNode;
  children: ReactNode;
  required?: boolean;
  /** Renders the standard "ঐচ্ছিক" badge on the label row. */
  optional?: boolean;
  hint?: ReactNode;
  error?: string;
  /** Right side of the label row — overrides `optional` when given. */
  adornment?: ReactNode;
  className?: string;
}

export function Field({
  id,
  label,
  children,
  required = false,
  optional = false,
  hint,
  error,
  adornment,
  className,
}: FieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <Label
          className="text-xs font-bold uppercase tracking-wider text-foreground"
          htmlFor={id}
        >
          {label}
          {required && (
            <>
              {" "}
              <span aria-hidden="true" className="font-bold text-primary">
                *
              </span>
              <span className="sr-only">(আবশ্যক)</span>
            </>
          )}
        </Label>
        {adornment ?? (optional ? <OptionalBadge /> : null)}
      </div>

      {children}

      {/* Error replaces the hint rather than stacking below it — two lines of 11px text
          under an errored field is noise on a 360px screen, and the error is the
          actionable one. */}
      {error ? (
        <p
          className="text-xs font-medium text-destructive"
          id={`${id}-error`}
          role="alert"
        >
          {error}
        </p>
      ) : hint ? (
        <p className="text-[11px] leading-relaxed text-muted-foreground" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Standalone error line, for controls that do not sit inside a `<Field>`. */
export function FieldError({
  children,
  className,
  id,
}: {
  children?: string;
  className?: string;
  id?: string;
}) {
  if (!children) return null;
  return (
    <p
      className={cn("text-xs font-medium text-destructive", className)}
      id={id}
      role="alert"
    >
      {children}
    </p>
  );
}

export function OptionalBadge({ label = "ঐচ্ছিক" }: { label?: string }) {
  return (
    <Badge
      className="shrink-0 rounded-none border border-border px-1.5 py-0 text-[9px] font-normal"
      variant="outline"
    >
      {label}
    </Badge>
  );
}

/* ------------------------------------------------------------------ *
 * Section panel — the titled box used throughout step 3
 * ------------------------------------------------------------------ */

export interface FormSectionProps {
  icon: LucideIcon;
  title: string;
  /** Right side of the header. Wraps beneath the title below `sm`. */
  badge?: ReactNode;
  tone?: "default" | "accent";
  children: ReactNode;
  footnote?: ReactNode;
  className?: string;
}

export function FormSection({
  icon: Icon,
  title,
  badge,
  tone = "default",
  children,
  footnote,
  className,
}: FormSectionProps) {
  return (
    <section
      className={cn(tone === "accent" ? PANEL_ACCENT : PANEL, "p-4", className)}
    >
      {/* Stacks below `sm` so a long Bengali title and its badge stop competing for the
          same row on a narrow screen. */}
      <div
        className={cn(
          "mb-4 flex flex-col gap-2 border-b-2 pb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3",
          tone === "accent" ? "border-primary/20" : "border-border",
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "grid size-7 shrink-0 place-items-center rounded-none border-2 bg-background text-primary",
              tone === "accent" ? "border-primary/40" : "border-foreground",
            )}
          >
            <Icon className="size-3.5" />
          </span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
            {title}
          </h4>
        </div>
        {badge ? <div className="flex shrink-0 items-center">{badge}</div> : null}
      </div>

      {children}

      {footnote ? (
        <p className="mt-2.5 text-[11px] leading-relaxed text-muted-foreground">
          {footnote}
        </p>
      ) : null}
    </section>
  );
}
