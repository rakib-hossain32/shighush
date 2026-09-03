"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { isRouteActive, navLinks } from "@/lib/navigation";
import { Logo } from "@/components/logo";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";

export function Header() {
  const scrolled = useScroll(10);
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 mx-auto w-full max-w-7xl border-transparent border-b md:rounded-md md:border md:transition-all md:ease-out",
        {
          "border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50 md:top-2 md:max-w-6xl md:shadow":
            scrolled,
        },
      )}
    >
      <nav
        className={cn(
          "flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out",
          { "md:px-2": scrolled },
        )}
      >
        <Link
          aria-current={pathname === "/" ? "page" : undefined}
          className={cn(
            "rounded-md p-2  dark:hover:bg-muted/50"
          )}
          href="/"
        >
          <Logo className="h-10 w-auto" />
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          <div>
            {navLinks.map((link) => {
              const active = isRouteActive(pathname, link.href);
              return (
                <Button
                  aria-current={active ? "page" : undefined}
                  className={active ? "shadow-sm" : undefined}
                  key={link.label}
                  size="lg"
                  variant={active ? "secondary" : "ghost"}
                  render={<Link href={link.href} />}
                  nativeButton={false}
                >
                  {link.label}
                </Button>
              );
            })}
          </div>
          <Button
            aria-current={
              isRouteActive(pathname, "/track") ? "page" : undefined
            }
            size="lg"
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
            className={
              isRouteActive(pathname, "/report/new")
                ? "ring-2 ring-secondary ring-offset-2 ring-offset-background"
                : undefined
            }
            size="lg"
            render={<Link href="/report/new" />}
            nativeButton={false}
          >
            অভিযোগ করুন
          </Button>
        </div>
        <MobileNav />
      </nav>
    </header>
  );
}
