"use client";

/**
 * Form context for the report submission wizard.
 * Re-exports from types.ts and provides React context hook.
 */

import { createContext, useContext } from "react";
import type { ReportFormContextValue } from "./types";

export * from "./types";

export const ReportFormContext = createContext<ReportFormContextValue | null>(
  null,
);

export function useReportForm(): ReportFormContextValue {
  const ctx = useContext(ReportFormContext);
  if (!ctx) {
    throw new Error("useReportForm must be used inside <ReportFormContext.Provider>");
  }
  return ctx;
}
