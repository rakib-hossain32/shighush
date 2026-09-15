import Link from "next/link";
import {
  ArrowRight,
  Clock,
  History,
  RefreshCw,
  Shield,
  ShieldCheck,
  User,
  Users2,
} from "lucide-react";

import { formatBnDate, formatBnNumber, formatBnRelative } from "@/lib/format";
import type { AuditLogEntry, StaffUser } from "@/services/_shared/types";

export function OverviewTeamAndAudit({
  moderators,
  auditLogs,
  canManageUsers,
  canViewAudit,
}: {
  moderators: StaffUser[];
  auditLogs: AuditLogEntry[];
  canManageUsers: boolean;
  canViewAudit: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Moderator Team Roster */}
      <div className="border-2 border-foreground bg-card p-5 shadow-[3px_3px_0_var(--foreground)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center border border-foreground bg-muted text-foreground">
                <Users2 className="size-3.5" />
              </span>
              <h3 className="font-heading text-sm font-bold text-foreground">
                মডারেটর টিম ও দায়িত্ব বণ্টন
              </h3>
            </div>
            {canManageUsers && (
              <Link
                href="/admin/users"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                টিম পরিচালনা <ArrowRight className="size-3" />
              </Link>
            )}
          </div>

          {/* Round Robin Status Banner */}
          <div className="mb-4 flex items-center justify-between border-2 border-border bg-muted/40 p-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              <span className="font-bold text-foreground">
                স্বয়ংক্রিয় বণ্টন পদ্ধতি:
              </span>
              <span className="text-muted-foreground">রাউন্ড-রবিন (১→২→৩) চক্র</span>
            </div>
            <span className="rounded-none border border-foreground bg-primary px-1.5 py-0.5 text-[10px] font-bold text-foreground shadow-[1px_1px_0_var(--foreground)]">
              {formatBnNumber(moderators.length)} জন সক্রিয়
            </span>
          </div>

          {/* Moderators list */}
          <div className="space-y-2.5">
            {moderators.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                কোনো মডারেটর যুক্ত করা হয়নি। ইউজার ব্যবস্থাপনা থেকে মডারেটর যোগ করুন।
              </p>
            ) : (
              moderators.slice(0, 5).map((mod, idx) => (
                <div
                  key={mod.id || idx}
                  className="flex items-center justify-between border border-border bg-background p-3 transition-colors hover:border-foreground"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="grid size-8 shrink-0 place-items-center border border-foreground bg-muted font-heading text-xs font-bold text-foreground">
                      {mod.name.slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-heading text-xs font-bold text-foreground">
                        {mod.name}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {mod.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="rounded-none border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-bold text-foreground">
                      {mod.role === "Admin" ? "অ্যাডমিন" : "মডারেটর"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <p className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
          নতুন কোনো অভিযোগ জমা হওয়া মাত্রই সক্রিয় মডারেটরদের মধ্যে পর্যায়ক্রমে স্বয়ংক্রিয়ভাবে দায়িত্ব নির্ধারিত হয়।
        </p>
      </div>

      {/* Live System Activity Stream */}
      <div className="border-2 border-foreground bg-card p-5 shadow-[3px_3px_0_var(--foreground)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center border border-foreground bg-muted text-foreground">
                <History className="size-3.5" />
              </span>
              <h3 className="font-heading text-sm font-bold text-foreground">
                সাম্প্রতিক সিস্টেম অডিট ট্রেইল
              </h3>
            </div>
            {canViewAudit && (
              <Link
                href="/admin/audit-logs"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                সকল অডিট লগ <ArrowRight className="size-3" />
              </Link>
            )}
          </div>

          {/* Audit Logs list */}
          <div className="space-y-2.5">
            {!canViewAudit ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                নিরাপত্তা নীতিমালার কারণে শুধুমাত্র প্রধান প্রশাসক (Admin) অডিট লগ পর্যবেক্ষণ করতে পারেন।
              </div>
            ) : auditLogs.length === 0 ? (
              <p className="py-8 text-center text-xs text-muted-foreground">
                কোনো সাম্প্রতিক অডিট কার্যকলাপ পাওয়া যায়নি।
              </p>
            ) : (
              auditLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between gap-3 border border-border bg-background p-3 transition-colors hover:border-foreground"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-heading text-xs font-bold text-foreground">
                        {log.actor?.name || "সিস্টেম"}
                      </span>
                      <span className="rounded-none border border-border bg-muted/50 px-1 py-0.2 text-[9px] font-bold text-muted-foreground">
                        {log.actor?.role === "Admin" ? "অ্যাডমিন" : "মডারেটর"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {log.summary}
                    </p>
                  </div>

                  <span className="shrink-0  text-[10px] text-muted-foreground">
                    {formatBnRelative(log.at)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <p className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
          প্ল্যাটফর্মের স্বচ্ছতা ও দায়বদ্ধতা রক্ষার্থে সকল প্রশাসনিক ও মডারেশন সিদ্ধান্ত সংরক্ষিত থাকে।
        </p>
      </div>
    </div>
  );
}
