export type NavItem = {
  label: string;
  href: string;
  badge?: string;
};

export const navLinks: NavItem[] = [
  { label: "রিপোর্টসমূহ", href: "/reports" },
  { label: "প্রতিষ্ঠান", href: "/institutions" },
  { label: "মানচিত্র", href: "/map" },
  { label: "পরিসংখ্যান", href: "/statistics" },
  { label: "কেস ট্র্যাক", href: "/track" },
  { label: "পদ্ধতি", href: "/methodology" },
];

export const secondaryLinks: NavItem[] = [
  { label: "নিরাপত্তা নীতি", href: "/safety" },
  { label: "আপিল ও সংশোধন", href: "/appeal" },
];

export function isRouteActive(pathname: string, href: string) {
  if (!pathname || !href) return false;
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}
