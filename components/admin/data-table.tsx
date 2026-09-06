import type { ReactNode } from "react";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/**
 * One table for every staff list: reports, flags, appeals, institutions, people, users,
 * audit log. Each of those pages becomes a column definition plus a query call instead of
 * its own bespoke markup — the single biggest reason the dashboard is a day's work rather
 * than a week's.
 *
 * Server Component: no client JavaScript. Sorting and filtering happen through the URL
 * (see `parseFilters`), and row navigation is a real `<Link>`.
 */

export type Column<T> = {
  /** Stable identity for the column; also the React key. */
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** Right-align numerics and status columns. */
  align?: "start" | "end";
  /** Hide on narrow screens. A phone gets the first two or three columns only. */
  hideBelow?: "sm" | "md" | "lg" | "xl";
  /** Extra classes on both the `<th>` and `<td>`. */
  className?: string;
  /**
   * Marks the column that carries the row link. Exactly one column should set this when
   * `rowHref` is provided; its content becomes the clickable target.
   */
  primary?: boolean;
};

const HIDE_CLASS = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
} as const;

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  rowHref,
  empty,
  className,
}: {
  columns: Array<Column<T>>;
  rows: T[];
  rowKey: (row: T) => string;
  /** When given, the `primary` column becomes a link that covers the whole row. */
  rowHref?: (row: T) => string;
  empty: { title: string; description?: string; action?: ReactNode };
  className?: string;
}) {
  // Safety: ensure rows is always an array
  const safeRows = Array.isArray(rows) ? rows : [];
  
  if (safeRows.length === 0) {
    return (
      <div className="border border-dashed border-border bg-muted/40 p-10 text-center">
        <p className="font-bold">{empty.title}</p>
        {empty.description && (
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {empty.description}
          </p>
        )}
        {empty.action && <div className="mt-5 flex justify-center">{empty.action}</div>}
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden border border-border bg-card", className)}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column, index) => (
              <TableHead
                className={cn(
                  index === 0 && "pl-4",
                  index === columns.length - 1 && "pr-4",
                  column.align === "end" && "text-right",
                  column.hideBelow && HIDE_CLASS[column.hideBelow],
                  column.className,
                )}
                key={column.key}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {safeRows.map((row) => {
            const href = rowHref?.(row);

            return (
              // `relative` so the primary cell's link can stretch across the row via
              // `after:absolute after:inset-0`. That gives a full-row click target while
              // keeping exactly one real anchor per row — no nested links, and a screen
              // reader announces one meaningful destination instead of five.
              <TableRow className="relative h-14" key={rowKey(row)}>
                {columns.map((column, index) => {
                  const content = column.cell(row);

                  return (
                    <TableCell
                      className={cn(
                        index === 0 && "pl-4",
                        index === columns.length - 1 && "pr-4",
                        column.align === "end" && "text-right",
                        column.hideBelow && HIDE_CLASS[column.hideBelow],
                        column.className,
                      )}
                      key={column.key}
                    >
                      {href && column.primary ? (
                        <Link
                          className="font-medium after:absolute after:inset-0 after:content-[''] hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                          href={href}
                        >
                          {content}
                        </Link>
                      ) : (
                        // Above the stretched overlay, so buttons in a cell stay usable.
                        <span className="relative z-10">{content}</span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

/** Two-line cell: a title with quieter supporting text under it. */
export function CellStack({
  title,
  subtitle,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <span className="flex min-w-0 flex-col gap-0.5">
      <span className="truncate">{title}</span>
      {subtitle && (
        <span className="truncate text-xs font-normal text-muted-foreground">{subtitle}</span>
      )}
    </span>
  );
}
