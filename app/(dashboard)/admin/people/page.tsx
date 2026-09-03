import { LockIcon, ShieldAlertIcon } from "lucide-react";

import { AccessDenied } from "@/components/admin/access-denied";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { guard } from "@/lib/auth/dal";
import { can } from "@/lib/auth/permissions";
import { NAME_VISIBILITIES, NAME_VISIBILITY_META } from "@/lib/domain/enums";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "ব্যক্তি-রেকর্ড",
  description: "নাম প্রকাশের নীতি ও অনুমোদিত ব্যক্তি-রেকর্ড।",
  index: false,
});

/**
 * §7 is the most legally sensitive part of the platform, so this page deliberately ships
 * as policy-first with no records yet.
 *
 * The doc requires two moderator approvals plus an appeal window before any name becomes
 * public. Building a CRUD screen before that workflow exists would create a one-click path
 * to publishing someone's name — the exact failure this project is designed to avoid.
 * The permission (`person:write`, Admin-only) and the vocabulary are in place; the
 * approval flow lands with the API in Phase 2.
 */
export default async function AdminPeoplePage() {
  const access = await guard("person:read", "/admin/people");
  if (!access.allowed) {
    return (
      <AccessDenied capability={access.capability} role={access.session.role} />
    );
  }

  const mayWrite = can(access.session.role, "person:write");

  return (
    <>
      <AdminPageHeader
        description="কোনো ব্যক্তির নাম প্রকাশ করা যাবে কি না, তা নির্ধারণের নিয়ম ও অনুমোদিত রেকর্ড।"
        title="ব্যক্তি-রেকর্ড"
      />

      <section className="flex items-start gap-3 border-l-4 border-destructive bg-destructive/5 p-5">
        <ShieldAlertIcon className="mt-0.5 size-5 shrink-0 text-destructive" />
        <div>
          <h2 className="font-bold">নাম প্রকাশের আগে</h2>
          <p className="mt-1 text-sm leading-7 text-muted-foreground">
            একটি রিপোর্ট কখনো অপরাধের চূড়ান্ত প্রমাণ নয়। কারও নাম পাবলিক করার
            আগে দুইজন মডারেটরের অনুমোদন, প্রাসঙ্গিক প্রমাণ এবং আপিলের সুযোগ —
            তিনটিই থাকতে হবে। শিরোনাম সবসময় “রিপোর্টে উল্লিখিত ব্যক্তি”, কখনোই
            “অভিযুক্ত” নয়।
          </p>
        </div>
      </section>

      <section className="border border-border bg-card p-5">
        <h2 className="text-lg font-bold">প্রকাশের স্তর</h2>
        <dl className="mt-4 grid gap-4">
          {NAME_VISIBILITIES.map((visibility) => {
            const meta = NAME_VISIBILITY_META[visibility];
            return (
              <div className="border-l-2 border-border pl-4" key={visibility}>
                <dt>
                  <StatusBadge tone={meta.tone}>{meta.short}</StatusBadge>
                </dt>
                <dd className="mt-2 text-sm leading-6 text-muted-foreground">
                  {meta.label}
                </dd>
              </div>
            );
          })}
        </dl>
      </section>

      <section className="border border-dashed border-border bg-muted/40 p-10 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-background text-primary">
          <LockIcon className="size-5" />
        </span>
        <p className="mt-4 font-bold">
          এখনো কোনো ব্যক্তি-রেকর্ড অনুমোদিত হয়নি
        </p>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
          {mayWrite
            ? "দুই-মডারেটর অনুমোদনের প্রক্রিয়া চালু হওয়ার আগ পর্যন্ত এখান থেকে নাম প্রকাশ করা যাবে না। রিপোর্টে জমা দেওয়া নাম শুধু রিভিউ পাতায় দেখা যায়।"
            : "ব্যক্তি-রেকর্ড তৈরি বা সম্পাদনার অনুমতি শুধু অ্যাডমিনের। রিপোর্টে জমা দেওয়া নাম রিভিউ পাতায় দেখা যায়।"}
        </p>
      </section>
    </>
  );
}
