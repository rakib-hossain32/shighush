import Link from "next/link";
import { LockIcon, ShieldAlertIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Capability } from "@/lib/auth/permissions";
import { USER_ROLE_META, type UserRole } from "@/lib/domain/enums";

/**
 * Rendered in place of a page body when a signed-in staff member lacks the capability.
 *
 * Chosen over Next's `forbidden()` + `forbidden.tsx`: those are experimental and require
 * `experimental.authInterrupts`, and access control on a whistleblower platform should not
 * sit on an unstable API. This also keeps the dashboard chrome intact, so the user can
 * navigate somewhere they *can* go instead of hitting a bare error screen.
 *
 * It explains which permission is missing and who to ask, rather than just refusing —
 * a Moderator hitting /admin/users should learn that this is Admin-only by design.
 */

const CAPABILITY_LABEL: Partial<Record<Capability, string>> = {
  "report:remove": "প্রকাশিত নথি অপসারণ",
  "person:write": "ব্যক্তির নাম প্রকাশের সিদ্ধান্ত",
  "user:read": "ব্যবহারকারী তালিকা দেখা",
  "user:write": "ব্যবহারকারী ব্যবস্থাপনা",
  "audit:read": "অডিট লগ দেখা",
  "settings:write": "সিস্টেম সেটিংস",
  "institution:write": "প্রতিষ্ঠান সম্পাদনা",
};

export function AccessDenied({
  capability,
  role,
}: {
  capability: Capability;
  role: UserRole;
}) {
  const action = CAPABILITY_LABEL[capability] ?? capability;

  return (
    <div className="mx-auto max-w-xl py-12">
      <div className="border-2 border-foreground bg-card p-6 sm:p-8">
        <span className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
          <LockIcon className="size-6" />
        </span>

        <h1 className="mt-6 text-2xl font-bold tracking-tight">এই অংশে প্রবেশের অনুমতি নেই</h1>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          <strong className="text-foreground">{action}</strong> — এই কাজটি শুধু অ্যাডমিনের
          জন্য সংরক্ষিত। আপনার বর্তমান ভূমিকা:
        </p>

        <StatusBadge className="mt-3" tone={USER_ROLE_META[role].tone}>
          {USER_ROLE_META[role].label}
        </StatusBadge>

        <div className="mt-6 flex items-start gap-3 border-l-4 border-secondary bg-muted p-4 text-sm leading-6">
          <ShieldAlertIcon className="mt-0.5 size-5 shrink-0 text-primary" />
          <p>
            এটি ভুল মনে হলে একজন অ্যাডমিনের সঙ্গে যোগাযোগ করুন। ভূমিকা পরিবর্তনের প্রতিটি
            ঘটনা audit log-এ সংরক্ষিত থাকে।
          </p>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Button nativeButton={false} render={<Link href="/admin" />}>
            সারসংক্ষেপে ফিরুন
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/admin/reports" />}
            variant="outline"
          >
            রিভিউ কিউ দেখুন
          </Button>
        </div>
      </div>
    </div>
  );
}
