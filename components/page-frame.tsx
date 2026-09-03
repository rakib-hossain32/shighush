import type { ReactNode } from "react";

export function PageFrame({
  eyebrow,
  title,
  copy,
  children,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-5 pt-6 sm:px-7 sm:pt-7 lg:px-8 lg:pt-9">
          <div className="flex items-center justify-between border-t border-foreground pt-2.5">
            <p className="mono text-[10px] font-bold tracking-[0.18em] text-primary">
              {eyebrow}
            </p>
            <p className="mono text-[10px] tracking-[0.14em] text-muted-foreground">
              শিবচর / নাগরিক রেকর্ড
            </p>
          </div>
          <div className="grid gap-6 py-7 sm:py-9 lg:grid-cols-[minmax(0,1.65fr)_minmax(230px,.65fr)] lg:items-end lg:gap-12 lg:py-11">
            <h1 className="display max-w-4xl text-[2.25rem] font-bold leading-none tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <div className="border-l-2 border-secondary pl-4 lg:mb-0.5">
              <p className="text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                {copy}
              </p>
              <p className="mt-4 text-xs font-bold leading-5 text-foreground">
                নাগরিকের তথ্য
                <br />
                সবার জবাবদিহিতা
              </p>
            </div>
          </div>
          <div className="flex items-end gap-1">
            <span className="h-1.5 w-16 bg-primary sm:w-24" />
            <span className="h-1.5 w-7 bg-secondary sm:w-10" />
            <span className="h-px flex-1 bg-border" />
          </div>
        </div>
      </section>
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-7 sm:py-10 lg:px-8 lg:py-12">
        {children}
      </main>
    </>
  );
}
