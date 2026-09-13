import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SectionHeaderAction {
  href: string;
  label: string;
  icon?: LucideIcon;
  variant?: "link" | "button";
}

export interface SectionHeaderProps {
  badgeIcon?: LucideIcon;
  badgeText: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: SectionHeaderAction;
  children?: React.ReactNode;
  className?: string;
  borderBottom?: boolean;
}

export function SectionHeader({
  badgeIcon: BadgeIcon,
  badgeText,
  title,
  description,
  action,
  children,
  className,
  borderBottom = false,
}: SectionHeaderProps) {
  const ActionIcon = action?.icon || (action?.variant === "button" ? ArrowUpRight : ArrowRight);

  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-6 lg:flex-row lg:items-end",
        borderBottom && "border-b-2 border-border pb-6 sm:pb-8",
        className,
      )}
    >
      {/* Left Column: Badge & Title */}
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 border border-primary/30 bg-primary/10 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-bold tracking-wider text-primary">
          {BadgeIcon && <BadgeIcon className="size-3 sm:size-3.5" />}
          <span>{badgeText}</span>
        </div>

        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:mt-4 sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
          {title}
        </h2>

        {description && (
          <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base leading-relaxed text-muted-foreground max-w-xl">
            {description}
          </p>
        )}
      </div>

      {/* Right Column: Optional Action or Children */}
      {(action || children) && (
        <div className="shrink-0 flex flex-col justify-end lg:pl-6">
          {action && (
            action.variant === "button" ? (
              <Link
                href={action.href}
                className="inline-flex items-center gap-2 border-2 border-foreground bg-primary px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold text-foreground shadow-[3px_3px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none whitespace-nowrap cursor-pointer"
              >
                <span>{action.label}</span>
                <ActionIcon className="size-3.5 sm:size-4" />
              </Link>
            ) : (
              <Link
                href={action.href}
                className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-foreground transition-colors hover:text-primary whitespace-nowrap cursor-pointer"
              >
                <span>{action.label}</span>
                <ActionIcon className="size-3.5 sm:size-4 text-primary transition-transform group-hover:translate-x-0.5" />
              </Link>
            )
          )}
          {children}
        </div>
      )}
    </div>
  );
}
