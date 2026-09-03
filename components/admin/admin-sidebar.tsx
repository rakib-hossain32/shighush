"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  BuildingIcon,
  FileCheck2Icon,
  FileTextIcon,
  HelpCircleIcon,
  LayoutGridIcon,
  ScrollTextIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  SettingsIcon,
  TriangleAlertIcon,
  UsersIcon,
  GavelIcon,
  InboxIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  FOOTER_NAV,
  isNavItemActive,
  NAV_GROUPS,
  type NavBadges,
  type NavIcon,
} from "@/components/admin/nav";
import { can, type Capability } from "@/lib/auth/permissions";
import { USER_ROLE_META, type UserRole } from "@/lib/domain/enums";
import { formatBnNumber } from "@/lib/format";

const ICONS: Record<NavIcon, typeof LayoutGridIcon> = {
  overview: LayoutGridIcon,
  queue: InboxIcon,
  pending: TriangleAlertIcon,
  published: FileCheck2Icon,
  flags: ShieldAlertIcon,
  appeals: GavelIcon,
  institutions: BuildingIcon,
  people: UsersIcon,
  users: UsersIcon,
  audit: ScrollTextIcon,
  settings: SettingsIcon,
  help: HelpCircleIcon,
  policy: FileTextIcon,
};

/**
 * Role arrives as a prop from the server-verified session, not from `localStorage`.
 *
 * The old version read the role in a `useEffect`, which meant (a) the first paint always
 * showed the Moderator nav and then flickered, and (b) editing one localStorage key
 * revealed the Admin nav. Filtering now happens against the same capability matrix the
 * layout enforces, so the sidebar is a projection of real permissions.
 */
export function AdminSidebar({
  role,
  badges = {},
}: {
  role: UserRole;
  badges?: NavBadges;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const visible = (capability?: Capability) => !capability || can(role, capability);

  const groups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => visible(item.capability)),
  })).filter((group) => group.items.length > 0);

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="h-14 justify-center">
        <SidebarMenuButton render={<Link href="/admin" />} tooltip="শিঘুষ ড্যাশবোর্ড">
          <ShieldCheckIcon className="size-6 text-primary" />
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-base font-bold tracking-tight">শিঘুষ</span>
            <span className="truncate text-[10px] text-muted-foreground">
              {USER_ROLE_META[role].label} প্যানেল
            </span>
          </span>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group, groupIndex) => (
          <SidebarGroup key={group.label ?? `group-${groupIndex}`}>
            {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarMenu>
              {group.items.map((item) => {
                const Icon = ICONS[item.icon];
                const count = item.badgeKey ? badges[item.badgeKey] : undefined;

                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isNavItemActive(item, pathname, searchParams)}
                      render={<Link href={item.path} />}
                      tooltip={item.title}
                    >
                      <Icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    {count !== undefined && count > 0 && (
                      <SidebarMenuBadge>{formatBnNumber(count)}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu className="mt-2">
          {FOOTER_NAV.filter((item) => visible(item.capability)).map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  className="text-muted-foreground"
                  render={<Link href={item.path} target="_blank" />}
                  size="sm"
                  tooltip={item.title}
                >
                  <Icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
