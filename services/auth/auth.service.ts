/**
 * Staff authentication against the Express API.
 *
 * Server-only. The old `services/auth.ts` ran in the browser and wrote the JWT to
 * `localStorage`; this replaces it. The token now never touches client JavaScript — the
 * Server Action hands it straight to an httpOnly cookie.
 */

import "server-only";

import { apiRequest } from "@/services/_shared/server-api-client";
import type { UserRole } from "@/lib/domain/enums";

type LoginResponse = {
  success?: boolean;
  data: {
    token: string;
    user: { id: string; name: string; email: string; role: UserRole };
  };
};

/**
 * Exchange credentials for a JWT. Throws `ApiError` on rejection — the caller decides
 * what the user is told, so a 401 and a 500 can read differently in the UI without this
 * layer inventing copy.
 */
export async function loginRequest(email: string, password: string) {
  const response = await apiRequest<LoginResponse>("auth/login", {
    method: "POST",
    body: { email, password },
    revalidate: false,
  });

  return response.data;
}
