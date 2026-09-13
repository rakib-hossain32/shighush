"use client";

import { useState, useActionState } from "react";
import { PlusIcon, Loader2Icon, XIcon, UserCheckIcon, ShieldCheckIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createStaffUserAction, type UserActionState } from "@/app/(dashboard)/admin/users/actions";

export function CreateUserDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<UserActionState, FormData>(
    async (prev, formData) => {
      const res = await createStaffUserAction(prev, formData);
      if (res.ok) {
        setIsOpen(false);
        toast.success("নতুন স্টাফ্ফ অ্যাকাউন্ট তৈরি হয়েছে!", {
          description: "নতুন সদস্য লগইন করে কাজ শুরু করতে পারবেন।",
        });
      } else if (res.error && !res.fieldErrors) {
        toast.error("অ্যাকাউন্ট তৈরি ব্যর্থ হয়েছে", { description: res.error });
      }
      return res;
    },
    {}
  );

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PlusIcon className="h-4 w-4" />
        নতুন স্টাফ
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-lg border-2 border-foreground bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold">নতুন স্টাফ অ্যাকাউন্ট</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                type="button"
                className="rounded-sm p-1 text-muted-foreground hover:text-foreground"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <form action={formAction} className="mt-5 space-y-4">
              {state.error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive font-medium">
                  {state.error}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="name">পুরো নাম</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="যেমন: রাশেদ মাহমুদ"
                  required
                  disabled={isPending}
                />
                {state.fieldErrors?.name && (
                  <p className="text-xs text-destructive">{state.fieldErrors.name}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">ইমেইল ঠিকানা</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="staff@shighush.com"
                  required
                  disabled={isPending}
                />
                {state.fieldErrors?.email && (
                  <p className="text-xs text-destructive">{state.fieldErrors.email}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">পাসওয়ার্ড</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  required
                  disabled={isPending}
                />
                {state.fieldErrors?.password && (
                  <p className="text-xs text-destructive">{state.fieldErrors.password}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="role">দায়িত্ব / ভূমিকা</Label>
                <select
                  id="role"
                  name="role"
                  defaultValue="Moderator"
                  disabled={isPending}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Moderator">মডারেটর (রিভিউ ও রিডাকশন)</option>
                  <option value="Admin">অ্যাডমিন (পূর্ণ নিয়ন্ত্রণ ও স্টাফ পরিচালনা)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                >
                  বাতিল
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                      তৈরি হচ্ছে...
                    </>
                  ) : (
                    <>
                      <UserCheckIcon className="h-4 w-4" />
                      অ্যাকাউন্ট তৈরি করুন
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
