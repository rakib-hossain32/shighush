"use client";

import { LogOutIcon, ShieldCheckIcon, UserIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/ui/status-badge";
import { logoutAction } from "@/lib/auth/actions";
import { USER_ROLE_META } from "@/lib/domain/enums";
import { capabilitiesFor } from "@/lib/auth/permissions";
import { formatBnNumber } from "@/lib/format";
import type { StaffUser } from "@/services/_shared/types";

/**
 * Two deliberate changes from the previous `nav-user.tsx`:
 *
 *  1. `user` is a prop from the server-verified session instead of a `localStorage` read
 *     inside `useEffect` — no flash of the wrong identity, and nothing a client can forge.
 *
 *  2. The avatar is rendered locally from initials. The old version built a
 *     `ui-avatars.com/api/?name=…` URL, which sent every moderator's name to a third party
 *     on every page load. §12.2 rules out third-party requests, and on this platform the
 *     staff roster is itself sensitive.
 */
export function AdminUserMenu({ user }: { user: StaffUser }) {
  const roleMeta = USER_ROLE_META[user.role];
  const initial = user.name.trim().charAt(0) || "শ";
  const capabilityCount = capabilitiesFor(user.role).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="size-8 cursor-pointer">
          <AvatarFallback className="bg-foreground text-sm font-bold text-background">
            {initial}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <div className="flex items-start gap-3 p-2">
          <Avatar className="size-10">
            <AvatarFallback className="bg-foreground font-bold text-background">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-foreground">{user.name}</p>
            {user.email && (
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            )}
            <StatusBadge className="mt-1" size="sm" tone={roleMeta.tone}>
              {roleMeta.label}
            </StatusBadge>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-default focus:bg-transparent" disabled>
            <ShieldCheckIcon className="mr-2 size-4" />
            {formatBnNumber(capabilityCount)}টি অনুমতি সক্রিয়
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-default focus:bg-transparent" disabled>
            <UserIcon className="mr-2 size-4" />
            প্রোফাইল সম্পাদনা — শিগগির
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/*
          A form, not an onClick: logout clears an httpOnly cookie, which only the server
          can do. It also means logout works without JavaScript.
        */}
        <form action={logoutAction}>
          <button
            className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
            type="submit"
          >
            <LogOutIcon className="mr-2 size-4" />
            লগআউট
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
