"use client";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { FacebookIcon } from "@/components/facebook-icon";
import { InstagramIcon } from "@/components/instagram-icon";
import { LinkedinIcon } from "@/components/linkedin-icon";
import { YoutubeIcon } from "@/components/youtube-icon";
import { Logo } from "@/components/logo";
type FooterLink = { title: string; href: string; icon?: ReactNode };
type FooterSection = { label: string; links: FooterLink[] };
const footerLinks: FooterSection[] = [
  {
    label: "প্ল্যাটফর্ম",
    links: [
      { title: "অভিযোগ", href: "/reports" },
      { title: "প্রতিষ্ঠান", href: "/institutions" },
      { title: "মানচিত্র", href: "/map" },
      { title: "পরিসংখ্যান", href: "/statistics" },
    ],
  },
  {
    label: "নীতি",
    links: [
      { title: "নিরাপত্তা", href: "/safety" },
      { title: "পদ্ধতি", href: "/methodology" },
      { title: "আপিল", href: "/appeal" },
      { title: "ট্র্যাকিং", href: "/track" },
    ],
  },
  {
    label: "সামাজিক",
    links: [
      { title: "Facebook", href: "#", icon: <FacebookIcon /> },
      { title: "Instagram", href: "#", icon: <InstagramIcon /> },
      { title: "Youtube", href: "#", icon: <YoutubeIcon /> },
      { title: "LinkedIn", href: "#", icon: <LinkedinIcon /> },
    ],
  },
];
export function Footer() {
  return (
    <footer
      className={cn(
        "relative mx-auto flex w-full max-w-5xl flex-col items-center justify-center rounded-t-4xl border-t px-6 md:rounded-t-6xl md:px-8",
        "dark:bg-[radial-gradient(35%_128px_at_50%_0%,--theme(--color-foreground/.1),transparent)]",
      )}
    >
      <div className="absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/20 blur" />
      <div className="grid w-full gap-8 py-6 md:py-8 lg:grid-cols-3 lg:gap-8">
        <Animated className="space-y-4">
          <Logo className="h-10 w-auto" />
          <p className="mt-8 text-muted-foreground text-sm md:mt-0">
            শিবচরের নাগরিক অভিযোগ ও জবাবদিহিতা প্ল্যাটফর্ম।
          </p>
        </Animated>
        <div className="mt-10 grid grid-cols-3 gap-8 lg:col-span-2 lg:mt-0">
          {footerLinks.map((section, index) => (
            <Animated delay={0.1 + index * 0.1} key={section.label}>
              <h3 className="text-xs">{section.label}</h3>
              <ul className="mt-4 space-y-2 text-muted-foreground text-sm">
                {section.links.map((link) => (
                  <li key={link.title}>
                    <a
                      className="inline-flex items-center duration-250 hover:text-foreground [&_svg]:me-1.5 [&_svg]:size-3.5"
                      href={link.href}
                    >
                      {link.icon}
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </Animated>
          ))}
        </div>
      </div>
      <div className="h-px w-full bg-linear-to-r via-border" />
      <div className="flex w-full items-center justify-center py-4">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} শিঘুষ, সর্বস্বত্ব সংরক্ষিত
        </p>
      </div>
    </footer>
  );
}
function Animated({
  className,
  delay = 0.1,
  children,
}: {
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  if (reduced) return children;
  return (
    <motion.div
      className={className}
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      transition={{ delay, duration: 0.8 }}
      viewport={{ once: true }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
    >
      {children}
    </motion.div>
  );
}
