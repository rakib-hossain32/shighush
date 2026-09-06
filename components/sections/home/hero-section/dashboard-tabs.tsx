import { Clock, Landmark, MapPinned } from "lucide-react";
import type { TabType } from "./types";

interface DashboardTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
  const tabs = [
    { id: "latest" as const, label: "সর্বশেষ নথি", icon: Clock },
    { id: "categories" as const, label: "প্রতিষ্ঠান চিত্র", icon: Landmark },
    { id: "hotspots" as const, label: "হটস্পট", icon: MapPinned },
  ];

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/80 p-1 text-xs font-bold">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 transition-all ${
              isActive
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="size-3.5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
