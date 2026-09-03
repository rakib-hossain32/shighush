"use server";

import { redirect } from "next/navigation";

import { createSession, destroySession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/domain/schemas";
import { isApiError } from "@/services/_shared/api-error";
import { loginRequest } from "@/services/auth/auth.service";

/**
 * Session Server Actions.
 *
 * Deliberately NOT under a route folder: `loginAction` is used by `(auth)/admin/login`
 * and `logoutAction` by the header inside `(dashboard)/admin`. Two route trees, one
 * implementation.
 */

export type LoginState = {
  /** Message shown above the form. */
  error?: string;
  /** Per-field messages, keyed by input name. */
  fieldErrors?: Partial<Record<"email" | "password", string>>;
  /** Preserved so the email input is not cleared on a failed attempt. */
  values?: { email: string };
};

/** Only same-site dashboard paths are accepted, so `?next=` cannot become an open redirect. */
function safeReturnTo(raw: FormDataEntryValue | null): string {
  const value = typeof raw === "string" ? raw : "";
  // Reject protocol-relative (`//evil.com`) and non-dashboard targets.
  if (!value.startsWith("/admin") || value.startsWith("//")) return "/admin";
  if (value.startsWith("/admin/login")) return "/admin";
  return value;
}

export async function loginAction(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const returnTo = safeReturnTo(formData.get("next"));

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      fieldErrors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      },
      values: { email },
    };
  }

  try {
    const { token } = await loginRequest(parsed.data.email, parsed.data.password);
    await createSession(token);
  } catch (error) {
    if (isApiError(error)) {
      // 401 stays generic: distinguishing "no such account" from "wrong password" tells
      // an attacker which staff emails are real.
      const message =
        error.status === 401
          ? "ইমেইল বা পাসওয়ার্ড সঠিক নয়"
          : error.status === 0 || error.status === 408
            ? "সার্ভারের সঙ্গে সংযোগ করা যায়নি। আবার চেষ্টা করুন।"
            : error.message;
      return { error: message, values: { email } };
    }
    return { error: "লগইন সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।", values: { email } };
  }

  // Outside the try: `redirect()` signals by throwing, and catching it here would turn a
  // successful login into an error message.
  redirect(returnTo);
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
