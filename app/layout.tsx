import type { Metadata } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const bangla = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bangla",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: { default: "শিঘুষ — শিবচরের নাগরিক নথি", template: `%s | ${SITE_NAME}` },
  description: "শিবচরের জনসেবা, অনিয়ম ও জবাবদিহিতার প্রমাণভিত্তিক নাগরিক প্ল্যাটফর্ম।",
  applicationName: SITE_NAME,
  keywords: ["শিবচর", "নাগরিক প্রতিবেদন", "জনসেবা", "জবাবদিহিতা", "বাংলাদেশ"],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  formatDetection: { telephone: false, address: false, email: false },
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bn" className={bangla.variable}>
      <body>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
