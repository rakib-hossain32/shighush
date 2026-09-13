"use server";

import { revalidatePath } from "next/cache";
import { assertCapability } from "@/lib/auth/dal";
import { createUser, updateUserRole } from "@/services";
import { z } from "zod";

const createUserActionSchema = z.object({
  name: z.string().min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে"),
  email: z.string().email("সঠিক ইমেইল ঠিকানা দিন"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
  role: z.enum(["Admin", "Moderator"]),
});

export type UserActionState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function createStaffUserAction(
  _previous: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  try {
    await assertCapability("user:write");
  } catch {
    return { error: "নতুন স্টাফ অ্যাকাউন্ট তৈরির অনুমতি আপনার নেই।" };
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    role: String(formData.get("role") ?? "Moderator"),
  };

  const parsed = createUserActionSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      fieldErrors[key] ??= issue.message;
    }
    return { error: "ফর্ম পূরণ সঠিকভাবে সম্পন্ন হয়নি", fieldErrors };
  }

  try {
    await createUser(parsed.data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "স্টাফ অ্যাকাউন্ট তৈরি করা যায়নি।";
    return { error: message };
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/audit-logs");
  return { ok: true };
}

export async function changeUserRoleAction(
  userId: string,
  role: "Admin" | "Moderator",
): Promise<{ ok?: boolean; error?: string }> {
  try {
    await assertCapability("user:write");
  } catch {
    return { error: "ভূমিকা পরিবর্তনের অনুমতি নেই।" };
  }

  try {
    await updateUserRole(userId, role);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "ভূমিকা পরিবর্তন করা যায়নি।";
    return { error: message };
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/audit-logs");
  return { ok: true };
}
