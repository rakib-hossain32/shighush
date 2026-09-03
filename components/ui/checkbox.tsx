import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Accessible checkbox component for forms.
 *
 * Built with native <input type="checkbox"> for maximum compatibility with
 * react-hook-form register() pattern. Provides proper ARIA attributes and
 * styling to match the design system.
 *
 * Example with react-hook-form:
 * ```tsx
 * <Checkbox {...register("fieldName")} />
 * ```
 *
 * Example controlled:
 * ```tsx
 * <Checkbox checked={value} onChange={(e) => setValue(e.target.checked)} />
 * ```
 */
const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="checkbox"
    className={cn(
      "peer size-4 shrink-0 cursor-pointer appearance-none rounded border border-foreground bg-background transition-colors",
      "hover:bg-muted",
      "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "checked:border-primary checked:bg-primary",
      "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
      // Checkmark using background-image
      "checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAgM0w0LjUgOC41TDIgNiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')] checked:bg-center checked:bg-no-repeat",
      className
    )}
    {...props}
  />
));

Checkbox.displayName = "Checkbox";

export { Checkbox };
