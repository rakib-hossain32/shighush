import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, Home, Shield, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PageFrameProps {
  eyebrow: string;
  title: string;
  copy?: string;
  children: ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  badgeText?: string;
  badgeVariant?: "default" | "secondary" | "outline";
  action?: ReactNode;
  stats?: Array<{ label: string; value: string | number }>;
  className?: string;
}

export function PageFrame({
  eyebrow,
  title,
  copy,
  children,
  breadcrumbs,
  badgeText,
  action,
  stats,
  className,
}: PageFrameProps) {
  const hasSidebar = Boolean(action || (stats && stats.length > 0));

  return (
    <div className={cn("min-h-screen bg-background text-foreground", className)}>
      {/* Header with Neo-Brutalist Civic Archival aesthetic & paper-grid texture */}
      <section className="relative border-b-2 border-border bg-card overflow-hidden">
        {/* Paper-grid background texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05] bg-[size:32px_32px] [background-image:linear-gradient(var(--foreground)_1px,transparent_1px),linear-gradient(90deg,var(--foreground)_1px,transparent_1px)]"
        />

        <div className="relative mx-auto max-w-7xl px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-7">
          {/* Top metadata row: Breadcrumbs / Archival Eyebrow */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border/80 pb-2.5 sm:pb-3">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
              <Link
                href="/"
                className="inline-flex items-center gap-1 font-bold text-muted-foreground transition-colors hover:text-primary"
              >
                <Home className="size-3.5" />
                <span className="hidden xs:inline">হোম</span>
              </Link>
              <ChevronRight className="size-3 text-muted-foreground/60" />
              {breadcrumbs && breadcrumbs.length > 0 ? (
                breadcrumbs.map((crumb, idx) => (
                  <span key={crumb.label} className="inline-flex items-center gap-1.5">
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="font-medium text-muted-foreground transition-colors hover:text-primary"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="font-bold text-foreground bg-muted px-1.5 py-0.5 text-[11px] sm:text-xs">
                        {crumb.label}
                      </span>
                    )}
                    {idx < breadcrumbs.length - 1 && (
                      <ChevronRight className="size-3 text-muted-foreground/60" />
                    )}
                  </span>
                ))
              ) : (
                <span className="text-[11px] font-bold tracking-wider text-primary uppercase">
                  {eyebrow}
                </span>
              )}
            </nav>

            <div className="flex items-center gap-2">
              {badgeText && (
                <div className="inline-flex items-center gap-1.5 border border-primary/40 bg-primary/10 px-2 py-0.5 text-[11px] font-bold tracking-wider text-primary">
                  <span className="size-1.5 bg-primary inline-block animate-pulse" />
                  <span>{badgeText}</span>
                </div>
              )}
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase border border-border bg-background px-2 py-0.5">
                <Shield className="size-3 text-primary" />
                <span>নাগরিক নথি</span>
              </div>
            </div>
          </div>

          {/* Main Title & Editorial Context Block */}
          <div
            className={cn(
              "py-4 sm:py-6 lg:py-7",
              hasSidebar
                ? "grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-8"
                : "max-w-4xl",
            )}
          >
            <div>
              <div className="inline-flex items-center gap-1.5 border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-primary">
                <Sparkles className="size-2.5 sm:size-3" />
                <span>{eyebrow}</span>
              </div>

              <h1 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl lg:text-4xl leading-tight">
                {title}
              </h1>
              {copy && (
                <p className="mt-1.5 max-w-3xl text-xs leading-relaxed text-muted-foreground sm:text-sm sm:leading-relaxed">
                  {copy}
                </p>
              )}
            </div>

            {/* Right-hand Sidebar (Rendered only if stats or action are provided) */}
            {hasSidebar && (
              <div className="flex flex-col gap-3 lg:items-end lg:justify-end">
                {stats && stats.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {stats.map((st) => (
                      <div
                        key={st.label}
                        className="border-2 border-border bg-background px-3 py-1.5 shadow-[2px_2px_0_var(--foreground)]"
                      >
                        <span className="block text-base sm:text-lg font-extrabold text-foreground leading-none">
                          {st.value}
                        </span>
                        <span className="text-[10px] font-medium text-muted-foreground">
                          {st.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {action && (
                  <div className="flex items-center gap-2">
                    {action}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Accent Line */}
          <div className="flex items-end gap-1.5 -mb-0.5">
            <span className="h-1 w-20 bg-primary sm:w-28" />
            <span className="h-1 w-8 bg-accent sm:w-12" />
            <span className="h-0.5 flex-1 bg-border" />
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="mx-auto max-w-7xl px-3.5 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-9">
        {children}
      </main>
    </div>
  );
}
