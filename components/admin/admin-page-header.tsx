import type { ReactNode } from "react";

/**
 * Consistent page heading for every dashboard screen. Exists so nine pages do not each
 * invent their own `<h1>` size and spacing — and so `AppShell` supplies the padding
 * exactly once (the old admin page and the shell both applied `p-4 md:p-6`, doubling it).
 */
export function AdminPageHeader({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  /** Buttons or filters aligned to the end of the heading row. */
  actions?: ReactNode;
  /** Extra content below the heading, e.g. a filter bar. */
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </header>
  );
}
