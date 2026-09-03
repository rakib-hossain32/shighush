import { ShieldCheck } from "lucide-react";

import { LoginForm } from "./login-form";
import { createPageMetadata } from "@/lib/seo";

/**
 * Lives in the `(auth)` route group, not `(dashboard)`.
 *
 * `(dashboard)/admin/layout.tsx` requires a session. If this page sat under that layout,
 * an unauthenticated visitor would be redirected to login by the layout, and the login
 * page would redirect them again — an infinite loop. Two route groups can both serve
 * `/admin/*` paths as long as the final URLs do not collide, and `/admin/login` does not
 * collide with `/admin`.
 */
export const metadata = createPageMetadata({
  title: "স্টাফ লগইন",
  description: "শিঘুষ মডারেশন ড্যাশবোর্ডে প্রবেশ।",
  // Not indexed here, and `robots.ts` disallows /admin as well.
  index: false,
});

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden bg-background text-foreground md:flex-row">
      <div className="grain paper-grid relative hidden flex-1 flex-col justify-center overflow-hidden bg-foreground px-12 text-background md:flex lg:px-24 xl:px-32">
        <div className="reveal delay-1 relative z-10 space-y-6">
          <div className="stamp mb-6 inline-flex items-center justify-center rounded-full border border-primary/30 bg-primary/20 p-4">
            <ShieldCheck className="size-10 text-primary" />
          </div>

          <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-primary drop-shadow-sm lg:text-5xl xl:text-6xl">
            নাগরিক অভিযোগ ও <br /> জবাবদিহিতা প্ল্যাটফর্ম
          </h1>

          <p className="max-w-lg font-sans text-lg leading-relaxed text-background/70 lg:text-xl">
            নিরাপদ, গোপনীয় এবং প্রভাবমুক্ত পরিবেশে দুর্নীতি ও অনিয়মের বিরুদ্ধে রুখে
            দাঁড়ানোর একটি স্বাধীন উদ্যোগ।
          </p>

          <p className="max-w-lg border-l-2 border-secondary pl-4 text-sm leading-6 text-background/60">
            এই প্যানেলের বড় অংশ এখনো অপ্রকাশিত ও অসম্পাদিত নথি। প্রতিটি সিদ্ধান্ত audit
            log-এ লেখা হয়।
          </p>
        </div>
      </div>

      <div className="grain relative flex flex-1 items-center justify-center bg-background p-6">
        <LoginForm returnTo={next} />
      </div>
    </div>
  );
}
