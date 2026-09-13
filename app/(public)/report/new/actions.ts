"use server";

import { submitReport } from "@/services/reports/reports.service";
import {
  reportSubmitSchema,
  type ReportSubmitInput,
} from "@/lib/domain/schemas";

export type SubmitReportResult = {
  success: boolean;
  caseId?: string;
  secretToken?: string;
  id?: string;
  message?: string;
  error?: string;
};

export async function submitReportAction(
  data: ReportSubmitInput,
): Promise<SubmitReportResult> {
  try {
    const validated = reportSubmitSchema.parse(data);

    // Call backend API service
    const response = await submitReport<
      Omit<ReportSubmitInput, "truthAcknowledged" | "policyAcknowledged">,
      { caseId: string; secretToken: string; id: string; message?: string }
    >({
      institutionName: validated.institutionName,
      category: validated.category,
      area: validated.area,
      officeName: validated.officeName,
      incidentDate: validated.incidentDate,
      incidentDatePrecision: validated.incidentDatePrecision,
      narrative: validated.narrative,
      moneyAmount: validated.moneyAmount,
      moneyType: validated.moneyType,
      officialFee: validated.officialFee,
      accusedName: validated.accusedName,
      accusedDesignation: validated.accusedDesignation,
      serviceName: validated.serviceName,
      referenceNumber: validated.referenceNumber,
      enableAnonymousInbox: validated.enableAnonymousInbox ?? false,
    });

    if (response?.data?.caseId) {
      return {
        success: true,
        caseId: response.data.caseId,
        secretToken: response.data.secretToken,
        id: response.data.id,
        message: response.data.message || "অভিযোগ সফলভাবে গৃহীত হয়েছে",
      };
    }

    return {
      success: false,
      error:
        "সার্ভার থেকে কোনো ট্র্যাকিং কোড পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
    };
  } catch (err: unknown) {
    console.error("submitReportAction error:", err);
    const message =
      err instanceof Error
        ? err.message
        : "অভিযোগ জমা দেওয়ার সময় একটি প্রযুক্তিগত ত্রুটি ঘটেছে।";
    return {
      success: false,
      error: message,
    };
  }
}
