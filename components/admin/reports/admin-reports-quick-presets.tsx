import Link from "next/link";
import { Sparkles, User, ShieldAlert, Layers, CheckCheck, FolderOpen } from "lucide-react";
import type { ModerationQueueInput } from "@/lib/domain/schemas";
import type { UserRole } from "@/lib/domain/enums";

type AdminReportsQuickPresetsProps = {
  filters: ModerationQueueInput;
  role: UserRole;
};

export function AdminReportsQuickPresets({ filters, role }: AdminReportsQuickPresetsProps) {
  const isDefaultAll =
    !filters.search &&
    !filters.flaggedOnly &&
    (!filters.view || filters.view === "all") &&
    (!filters.assignment || filters.assignment === (role === "Moderator" ? "mine" : "all")) &&
    filters.status.length === 0 &&
    filters.category.length === 0 &&
    filters.area.length === 0;

  const isMine = filters.assignment === "mine";
  const isUnassigned = filters.assignment === "unassigned";
  const isFlaggedOnly = Boolean(filters.flaggedOnly);
  const isActiveView = filters.view === "active";
  const isCompletedView = filters.view === "completed";

  const presets = [
    {
      label: "সব নথি",
      href: "/admin/reports",
      icon: FolderOpen,
      isActive: isDefaultAll,
    },
    {
      label: "আমার দায়িত্ব",
      href: "/admin/reports?assignment=mine",
      icon: User,
      isActive: isMine,
    },
    {
      label: "দায়িত্বহীন কিউ",
      href: "/admin/reports?assignment=unassigned",
      icon: Layers,
      isActive: isUnassigned,
    },
    {
      label: "গোপনীয়তা সতর্কতা (PII)",
      href: "/admin/reports?flaggedOnly=1",
      icon: ShieldAlert,
      isActive: isFlaggedOnly,
    },
    {
      label: "চলমান নথি",
      href: "/admin/reports?view=active",
      icon: Layers,
      isActive: isActiveView,
    },
    {
      label: "সম্পন্ন ও প্রকাশিত",
      href: "/admin/reports?view=completed",
      icon: CheckCheck,
      isActive: isCompletedView,
    },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      <span className="mr-1 flex shrink-0 items-center gap-1 text-xs font-bold text-muted-foreground">
        <Sparkles className="size-3.5 text-primary" />
        কুইক ফিল্টার:
      </span>
      {presets.map((preset) => {
        const Icon = preset.icon;
        return (
          <Link
            key={preset.label}
            href={preset.href}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-none border-2 px-3 py-1.5 text-xs font-bold transition-all ${
              preset.isActive
                ? "border-foreground bg-primary text-foreground shadow-[2px_2px_0_var(--foreground)]"
                : "border-border bg-card text-foreground hover:border-foreground hover:shadow-[2px_2px_0_var(--foreground)] hover:-translate-y-0.5"
            }`}
          >
            <Icon className="size-3.5" />
            <span>{preset.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
