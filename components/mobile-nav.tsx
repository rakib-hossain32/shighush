"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Portal, PortalBackdrop } from "@/components/portal";
import { isRouteActive, navLinks } from "@/lib/navigation";
import { XIcon, MenuIcon } from "lucide-react";
import Link from "next/link";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <div className="min-[961px]:hidden">
      <Button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label="Toggle menu"
        className="min-[961px]:hidden"
        onClick={() => setOpen(!open)}
        size="icon"
        variant="outline"
      >
        {open ? (
          <XIcon className="size-4.5" />
        ) : (
          <MenuIcon className="size-4.5" />
        )}
      </Button>
      {open && (
        <Portal className="top-14" id="mobile-menu">
          <PortalBackdrop />
          <div
            className={cn(
              "data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
              "size-full p-4",
            )}
            data-slot={open ? "open" : "closed"}
          >
            <div className="grid gap-y-2">
              {navLinks.map((link) => {
                const active = isRouteActive(pathname, link.href);
                return (
                  <Button
                    aria-current={active ? "page" : undefined}
                    className="justify-start"
                    key={link.label}
                    onClick={() => setOpen(false)}
                    variant={active ? "secondary" : "ghost"}
                    render={<a href={link.href} />}
                    nativeButton={false}
                  >
                    {link.label}
                  </Button>
                );
              })}
            </div>
            <div className="mt-12 flex flex-col gap-2">
              <Button
                aria-current={
                  isRouteActive(pathname, "/track") ? "page" : undefined
                }
                className="w-full"
                onClick={() => setOpen(false)}
                variant={
                  isRouteActive(pathname, "/track") ? "secondary" : "outline"
                }
                render={<Link href="/track" />}
                nativeButton={false}
              >
                কেস ট্র্যাক
              </Button>
              <Button
                aria-current={
                  isRouteActive(pathname, "/report/new") ? "page" : undefined
                }
                className="w-full"
                onClick={() => setOpen(false)}
                render={<a href="/report/new" />}
                nativeButton={false}
              >
                অভিযোগ করুন
              </Button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
