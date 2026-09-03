import Link from "next/link";
import { getReports } from "@/services";
import { REPORT_STATUS_META } from "@/lib/domain/enums";
import type { PublicReport } from "@/services/_shared/types";

export async function RecentReportsSection() {
  let reports: PublicReport[] = [];

  try {
    const response = await getReports({
      limit: 3,
    });
    reports = response.data || [];
  } catch (error) {
    console.error('Failed to fetch recent reports:', error);
    // Show empty state if API fails
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-18 lg:px-8">
      <div className="flex justify-between border-b-2 border-foreground pb-6">
        <div>
          <p className="mono text-[10px] tracking-[.18em] text-primary">
            ০০১ / সর্বশেষ নথি
          </p>
          <h2 className="display mt-2 text-4xl font-bold">যা দেখা যাচ্ছে</h2>
        </div>
        <Link className="self-end font-bold underline" href="/reports">
          সব দেখুন →
        </Link>
      </div>

      {reports.length > 0 ? (
        <div className="divide-y-2 divide-foreground">
          {reports.map((report) => {
            const statusLabel =
              REPORT_STATUS_META[report.status]?.label || report.status;
            const title = report.title || report.summary || 'রিপোর্ট';
            const meta = `${report.institution.nameBn} · ${
              report.location.area || 'শিবচর'
            }`;

            return (
              <article
                key={report.id}
                className="grid gap-3 py-7 md:grid-cols-[80px_1fr_auto]"
              >
                <p className="mono text-xs text-muted-foreground">
                  শি-{String(report.publicId).padStart(4, '0')}
                </p>
                <div>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{meta}</p>
                </div>
                <span className="h-fit w-fit rounded-full bg-secondary px-3 py-1 text-xs font-bold">
                  {statusLabel}
                </span>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center text-muted-foreground">
          <p>এখনো কোনো রিপোর্ট প্রকাশিত হয়নি।</p>
        </div>
      )}
    </section>
  );
}
