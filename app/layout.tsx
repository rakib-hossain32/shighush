import type { Metadata } from "next";
import { Hind_Siliguri, IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { IconSprite } from "@/components/ui/icon-sprite";

const bangla = Hind_Siliguri({
  subsets: ["bengali"],
  variable: "--font-bangla",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: {
    default: "শিঘুষ — শিবচরের নাগরিক নথি",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "শিবচরের জনসেবা, অনিয়ম ও জবাবদিহিতার প্রমাণভিত্তিক নাগরিক প্ল্যাটফর্ম।",
  applicationName: SITE_NAME,
  keywords: ["শিবচর", "নাগরিক প্রতিবেদন", "জনসেবা", "জবাবদিহিতা", "বাংলাদেশ"],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  formatDetection: { telephone: false, address: false, email: false },
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bn" className={`${bangla.variable} ${manrope.variable} ${ibmPlexMono.variable}`}>
      <body>
        <IconSprite />
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
