"use server";

import { revalidatePath } from "next/cache";
import { updateAppealStatus } from "@/services";
import { isApiError } from "@/services/_shared/api-error";
import { assertCapability } from "@/lib/auth/dal";

export type AppealDecisionStatus = "in_review" | "upheld" | "rejected";

export async function updateAppealStatusAction(
  appealId: string,
  status: AppealDecisionStatus,
  resolution?: string
) {
  try {
    await assertCapability("appeal:handle");
    const response = await updateAppealStatus<
      { status: string; resolution?: string },
      any
    >(appealId, {
      status,
      resolution,
    });

    // Revalidate the appeals page
    revalidatePath("/admin/appeals");

    return {
      success: true,
      message: "স্ট্যাটাস আপডেট হয়েছে",
    };
  } catch (error) {
    console.error("Appeal status update error:", error);

    if (isApiError(error)) {
      return {
        success: false,
        error: error.message || "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে",
      };
    }

    return {
      success: false,
      error: "অপ্রত্যাশিত ত্রুটি ঘটেছে",
    };
  }
}
