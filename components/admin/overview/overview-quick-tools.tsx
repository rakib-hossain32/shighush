import Link from "next/link";
import {
  Building2,
  FileCheck2,
  FileSearch,
  History,
  ShieldAlert,
  UserCheck2,
  Users2,
} from "lucide-react";

export function OverviewQuickTools({ canManageUsers, canViewAudit }: { canManageUsers: boolean; canViewAudit: boolean }) {
  const tools = [
    {
      title: "আমার দায়িত্বে থাকা নথি",
      desc: "আপনাকে অর্পিত অভিযোগসমূহ পর্যালোচনা করুন",
      icon: UserCheck2,
      href: "/admin/reports?assignment=mine",
      badge: "ব্যক্তিগত কিউ",
    },
    {
      title: "যাচাইয়ের অপেক্ষমাণ কিউ",
      desc: "নতুন ও পর্যালোচনার প্রতীক্ষায় থাকা রিপোর্ট",
      icon: FileSearch,
      href: "/admin/reports?status=submitted,under_review,needs_info",
      badge: "জরুরি",
    },
    {
      title: "গোপনীয়তা ও রিডাকশন",
      desc: "NID, মোবাইল ইত্যাদি তথ্য সতর্কতাপ্রাপ্ত নথি",
      icon: ShieldAlert,
      href: "/admin/reports?flaggedOnly=true",
      badge: "PII সুরক্ষা",
    },
    {
      title: "প্রতিষ্ঠান ব্যবস্থাপনা",
      desc: "সরকারি ও স্বায়ত্তশাসিত প্রতিষ্ঠানের তালিকা",
      icon: Building2,
      href: "/admin/institutions",
      badge: "ডাটাবেজ",
    },
    ...(canManageUsers
      ? [
          {
            title: "মডারেটর ও ইউজার টিম",
            desc: "টিম মেম্বার যোগ ও ভূমিকা পরিবর্তন",
            icon: Users2,
            href: "/admin/users",
            badge: "অ্যাডমিন অনলি",
          },
        ]
      : []),
    ...(canViewAudit
      ? [
          {
            title: "সিস্টেম অডিট ট্রেইল",
            desc: "সকল মডারেশন সিদ্ধান্ত ও কার্যকলাপের লগ",
            icon: History,
            href: "/admin/audit-logs",
            badge: "নিরাপত্তা",
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-base font-bold text-foreground">
            কুইক একশন ও কমান্ড টুলস
          </h2>
          <p className="text-xs text-muted-foreground">
            জরুরি কাজের জন্য এক ক্লিকে প্রয়োজনীয় সেকশনে প্রবেশ করুন
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex items-start gap-3.5 border-2 border-border bg-card p-4 shadow-[2px_2px_0_var(--foreground)] transition-all hover:border-foreground hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            >
              <span className="grid size-9 shrink-0 place-items-center border border-foreground bg-muted text-foreground transition-colors group-hover:bg-primary group-hover:text-foreground">
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="truncate font-heading text-xs font-bold text-foreground group-hover:text-primary">
                    {tool.title}
                  </h3>
                  <span className="shrink-0 rounded-none border border-border bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {tool.badge}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                  {tool.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
