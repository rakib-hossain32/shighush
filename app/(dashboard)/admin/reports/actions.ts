"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { isReviewable } from "@/lib/domain/moderation";

import { assertCapability } from "@/lib/auth/dal";
import { moderationDecisionSchema } from "@/lib/domain/schemas";
import type { Capability } from "@/lib/auth/permissions";
import { updateReportStatus, assignReport, redactReport, getModerationReport } from "@/services";

export type ModerationState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

/** `report:remove` is Admin-only; the others are open to Moderators. See `permissions.ts`. */
const CAPABILITY_BY_DECISION: Record<string, Capability> = {
  publish: "report:publish",
  request_info: "report:review",
  reject: "report:review",
  remove: "report:remove",
};

export async function submitModerationDecision(
  _previous: ModerationState,
  formData: FormData,
): Promise<ModerationState> {
  const raw = {
    reportId: String(formData.get("reportId") ?? ""),
    decision: String(formData.get("decision") ?? ""),
    publicNarrative: String(formData.get("publicNarrative") ?? "") || undefined,
    expectedUpdatedAt: String(formData.get("expectedUpdatedAt") ?? "") || undefined,
    verificationLevel: formData.get("verificationLevel")
      ? String(formData.get("verificationLevel"))
      : undefined,
    publicTitle: formData.get("publicTitle")
      ? String(formData.get("publicTitle"))
      : undefined,
    publicSummary: formData.get("publicSummary")
      ? String(formData.get("publicSummary"))
      : undefined,
    redactionNotes: formData.get("redactionNotes")
      ? String(formData.get("redactionNotes"))
      : undefined,
    moderatorNote: formData.get("moderatorNote")
      ? String(formData.get("moderatorNote"))
      : undefined,
  };

  const parsed = moderationDecisionSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      fieldErrors[key] ??= issue.message;
    }
    return { error: "সিদ্ধান্তটি সংরক্ষণ করা যায়নি", fieldErrors };
  }

  const capability = CAPABILITY_BY_DECISION[parsed.data.decision];
  try {
    const session = await assertCapability(capability);
    const current = await getModerationReport(parsed.data.reportId);
    if (!current?.data) return { error: "নথিটি পাওয়া যায়নি।" };
    if (session.role !== "Admin" && current.data.assignedTo?.id !== session.userId) return { error: "এই নথির দায়িত্ব আপনার কাছে নেই।" };
    if (parsed.data.decision !== "remove" && !isReviewable(current.data)) return { error: "এই নথির পর্যালোচনা শেষ হয়েছে। আবার প্রকাশ করা যাবে না।" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    return {
      error: message.startsWith("FORBIDDEN")
        ? "এই সিদ্ধান্ত নেওয়ার অনুমতি আপনার নেই। একজন অ্যাডমিনের সঙ্গে যোগাযোগ করুন।"
        : "সেশনের মেয়াদ শেষ হয়েছে। আবার লগইন করুন।",
    };
  }

  try {
    await updateReportStatus(parsed.data.reportId, {
      decision: parsed.data.decision,
      publicNarrative: parsed.data.publicNarrative,
      expectedUpdatedAt: parsed.data.expectedUpdatedAt,
      verificationLevel: parsed.data.verificationLevel,
      publicTitle: parsed.data.publicTitle,
      publicSummary: parsed.data.publicSummary,
      redactionNotes: parsed.data.redactionNotes,
      moderatorNote: parsed.data.moderatorNote,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "সার্ভারে সিদ্ধান্ত সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।";
    return { error: message };
  }

  revalidatePath("/admin/reports");
  revalidatePath(`/admin/reports/${parsed.data.reportId}`);
  revalidatePath("/admin");
  revalidatePath("/reports");

  revalidateTag("reports", { expire: 0 });
  revalidateTag(`report:${parsed.data.reportId}`, { expire: 0 });
  redirect(`/admin/reports?notice=${parsed.data.decision === "request_info" ? "saved" : "completed"}`);
}

/** Only an admin may choose or clear a report's assigned moderator. */
export async function assignModerator(_previous: ModerationState, formData: FormData): Promise<ModerationState> {
  try {
    await assertCapability("user:write");
    const reportId = String(formData.get("reportId") ?? "");
    const moderatorId = String(formData.get("moderatorId") ?? "");
    if (!/^[a-f0-9]{24}$/i.test(reportId)) return { error: "নথিটি পাওয়া যায়নি।" };
    await assignReport(reportId, moderatorId || null);
    revalidatePath("/admin/reports");
    revalidatePath(`/admin/reports/${reportId}`);
    revalidateTag("moderation-queue", { expire: 0 });
    revalidateTag(`report:${reportId}`, { expire: 0 });
    return { ok: true };
  } catch (error) {
    return { error: error instanceof Error && !error.message.startsWith("FORBIDDEN") ? error.message : "শুধু অ্যাডমিন মডারেটর নির্বাচন করতে পারবেন।" };
  }
}

/** Redacts sensitive information from narrative */
export async function redactReportAction(
  reportId: string,
  narrative: string
): Promise<ModerationState> {
  try {
    await assertCapability("report:redact");
  } catch {
    return { error: "ব্যক্তিগত তথ্য রিডাক্ট করার অনুমতি নেই।" };
  }

  try {
    await redactReport(reportId, { narrative });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "রিডাকশন সংরক্ষণ করা সম্ভব হয়নি।";
    return { error: message };
  }

  revalidatePath(`/admin/reports/${reportId}`);
  return { ok: true };
}

