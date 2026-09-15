"use server";

import { z } from "zod";
import { submitAppeal } from "@/services";
import { isApiError } from "@/services/_shared/api-error";

/**
 * Appeal submission schema with validation
 */
const appealSchema = z.object({
  caseId: z.string().min(1, "Case ID প্রয়োজন"),
  reason: z.enum([
    "incorrect_info",
    "privacy_risk",
    "institution_response",
    "other",
  ]),
  description: z
    .string()
    .min(20, "কমপক্ষে ২০টি অক্ষর লিখুন")
    .max(2000, "সর্বোচ্চ ২০০০ অক্ষর"),
  contactEmail: z.string().email("সঠিক ইমেইল প্রদান করুন").optional().or(z.literal("")),
});

export type AppealFormInput = z.infer<typeof appealSchema>;

/**
 * Server action to submit appeal
 */
export async function submitAppealAction(input: AppealFormInput) {
  try {
    // Validate input
    const validated = appealSchema.parse(input);

    // Submit to backend
    const response = await submitAppeal<
      typeof validated,
      { id: string; caseId: string; status: string }
    >(validated);

    return {
      success: true,
      data: response.data,
      message: response.message || "আপিল সফলভাবে জমা হয়েছে",
    };
  } catch (error) {
    console.error("Appeal submission error:", error);

    if (isApiError(error)) {
      return {
        success: false,
        error: error.message || "আপিল জমা দিতে সমস্যা হয়েছে",
      };
    }

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || "ফর্মে ত্রুটি আছে",
      };
    }

    return {
      success: false,
      error: "অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
    };
  }
}
