"use server";

import { revalidatePath } from "next/cache";

import { assertCapability } from "@/lib/auth/dal";
import { moderationDecisionSchema } from "@/lib/domain/schemas";
import type { Capability } from "@/lib/auth/permissions";

/**
 * Moderation Server Actions.
 *
 * Two rules hold for every action here:
 *
 *  1. **Re-check the capability.** The buttons that trigger these are already hidden from
 *     a Moderator who lacks the permission, but a Server Action is a public endpoint —
 *     anyone who can reach the page can POST to it. `assertCapability` is the real check;
 *     hiding the button is only an affordance.
 *
 *  2. **Validate with the same schema the form uses.** `moderationDecisionSchema` enforces
 *     the rules that matter to the archive: publishing requires a verification level and a
 *     neutral title (§16.5), and rejecting or removing requires a written reason so the
 *     decision can be audited and appealed (§16.8).
 *
 * The writes themselves are stubs until Phase 2 wires the Express API. The signatures,
 * validation and authorization are final, so wiring is one `await apiRequest(...)` per
 * function rather than a rewrite.
 */

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
    await assertCapability(capability);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    return {
      error: message.startsWith("FORBIDDEN")
        ? "এই সিদ্ধান্ত নেওয়ার অনুমতি আপনার নেই। একজন অ্যাডমিনের সঙ্গে যোগাযোগ করুন।"
        : "সেশনের মেয়াদ শেষ হয়েছে। আবার লগইন করুন।",
    };
  }

  // TODO(Phase 2): PATCH /api/v1/admin/reports/:id/status — plus an `auditLogs` entry
  // recording actor, decision and redaction notes (§10, §16.8).

  revalidatePath("/admin/reports");
  revalidatePath(`/admin/reports/${parsed.data.reportId}`);
  revalidatePath("/admin");

  return { ok: true };
}

/** Claims a report so two moderators do not review the same item (§16.1). */
export async function assignToMe(reportId: string): Promise<ModerationState> {
  try {
    await assertCapability("report:review");
  } catch {
    return { error: "এই কাজের অনুমতি নেই।" };
  }

  // TODO(Phase 2): POST /api/v1/admin/reports/:id/assign
  revalidatePath(`/admin/reports/${reportId}`);
  return { ok: true };
}
