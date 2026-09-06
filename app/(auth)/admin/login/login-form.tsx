"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction, type LoginState } from "@/lib/auth/actions";

/**
 * Uses a Server Action rather than a client `fetch`.
 *
 * The previous version called the API from the browser and wrote the JWT to
 * `localStorage`. Now credentials post to the server, the server talks to Express, and the
 * token lands in an httpOnly cookie that client JavaScript cannot read — so an XSS on any
 * dashboard page cannot walk away with an admin session.
 *
 * Side benefit: `<form action={…}>` is a real form submission, so login works before
 * hydration and without JavaScript.
 */
export function LoginForm({ returnTo }: { returnTo?: string }) {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    loginAction,
    {},
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="reveal delay-2 w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-8 text-center">
        <h2 className="mb-2 font-heading text-3xl font-bold tracking-tight text-card-foreground">
          স্বাগতম
        </h2>
        <p className="font-sans text-sm text-muted-foreground">
          আপনার ড্যাশবোর্ডে প্রবেশ করতে লগইন করুন
        </p>
      </div>

      {state.error && (
        <div
          className="mb-6 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-center text-sm text-destructive"
          role="alert"
        >
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-6">
        {returnTo && <input name="next" type="hidden" value={returnTo} />}

        <div className="space-y-2">
          <Label className="font-semibold text-foreground" htmlFor="email">
            ইমেইল
          </Label>
          <div className="group relative">
            <Mail className="absolute left-3 top-3 size-5 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary" />
            <Input
              aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
              aria-invalid={Boolean(state.fieldErrors?.email)}
              autoComplete="email"
              className="h-11 border border-border bg-background py-2 pl-10 pr-3 font-medium outline-none transition-all duration-200 hover:border-primary/50 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20"
              defaultValue={state.values?.email || ""}
              id="email"
              key={state.values?.email}
              name="email"
              placeholder="admin@example.com"
              required
              type="email"
            />
          </div>
          {state.fieldErrors?.email && (
            <p className="mt-1 text-xs text-destructive" id="email-error">
              {state.fieldErrors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="font-semibold text-foreground" htmlFor="password">
            পাসওয়ার্ড
          </Label>
          <div className="group relative">
            <Lock className="absolute left-3 top-3 size-5 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary" />
            <Input
              aria-describedby={
                state.fieldErrors?.password ? "password-error" : undefined
              }
              aria-invalid={Boolean(state.fieldErrors?.password)}
              autoComplete="current-password"
              className="h-11 border border-border bg-background py-2 pl-10 pr-12 font-medium outline-none transition-all duration-200 hover:border-primary/50 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20"
              id="password"
              name="password"
              placeholder="••••••••"
              required
              type={showPassword ? "text" : "password"}
            />
            <button
              aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
              className="absolute right-3 top-3 rounded-sm text-muted-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              onClick={() => setShowPassword((visible) => !visible)}
              type="button"
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
          {state.fieldErrors?.password && (
            <p className="mt-1 text-xs text-destructive" id="password-error">
              {state.fieldErrors.password}
            </p>
          )}
        </div>

        <Button
          className="h-11 w-full rounded-md bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/90"
          disabled={isPending}
          type="submit"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-5 animate-spin" />
              যাচাই করা হচ্ছে…
            </>
          ) : (
            "লগইন করুন"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
        এটি শুধু মডারেটর ও অ্যাডমিনের জন্য। অভিযোগ জমা দিতে অ্যাকাউন্টের প্রয়োজন নেই।
      </p>
    </div>
  );
}
