import Link from "next/link";
import { AlertCircle, Inbox } from "lucide-react";

export function ReportFeedback({ error = false, title, description, href = "/admin/reports", action = "কিউতে ফিরুন" }: {
  error?: boolean; title: string; description: string; href?: string; action?: string;
}) {
  const Icon = error ? AlertCircle : Inbox;
  return <section className="grid justify-items-center gap-3 border border-dashed border-border bg-card px-6 py-14 text-center" role={error ? "alert" : undefined}>
    <span className="mb-1 grid size-12 place-items-center border border-border bg-secondary"><Icon className="size-6" /></span>
    <h2 className="text-lg font-bold">{title}</h2>
    <p className="max-w-md text-sm leading-7 text-muted-foreground">{description}</p>
    <Link href={href} className="mt-2 border border-foreground px-4 py-2 text-sm font-bold hover:bg-secondary">{action}</Link>
  </section>;
}
