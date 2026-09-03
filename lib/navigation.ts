export const navLinks = [
  { label: "অভিযোগ", href: "/reports" },
  { label: "প্রতিষ্ঠান", href: "/institutions" },
  { label: "মানচিত্র", href: "/map" },
  { label: "তুলনা", href: "/statistics" },
  { label: "পদ্ধতি", href: "/methodology" },
];

export function isRouteActive(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}
