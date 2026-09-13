import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, Landmark, MapPin, Stethoscope, Shield, Zap } from "lucide-react";
import { getInstitutions } from "@/services";
import type { Institution } from "@/services/_shared/types";
import { toBnDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ভূমি: Landmark,
  স্বাস্থ্য: Stethoscope,
  আইন: Shield,
  বিদ্যুৎ: Zap,
  default: Building2,
};

function getIcon(category: string) {
  const key = Object.keys(iconMap).find((k) => category?.includes(k));
  return key ? iconMap[key] : iconMap.default;
}

export async function InstitutionPreviewSection() {
  let institutions: Institution[] = [];
  let totalCount = 0;

  try {
    const response = await getInstitutions({
      limit: 4,
    });
    institutions = response.data || [];
    totalCount = response.meta?.total || 0;
  } catch (error) {
    console.error("Failed to fetch institutions:", error);
  }

  return (
    <section className="relative border-b-2 border-border bg-card/40 py-18 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          {/* Left Column: Context & Direct CTA */}
          <div>
            <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold tracking-wider text-primary">
              <Building2 className="size-3.5" />
              <span>
                ০৮ — জবাবদিহিতার রেকর্ড / {totalCount ? toBnDigits(totalCount) : "৮"}টি দপ্তর
              </span>
            </div>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              প্রতিষ্ঠান ধরে<br className="hidden sm:inline" />
              চিত্র দেখুন।
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              শিবচরের ভূমি অফিস, হাসপাতাল, থানা কিংবা বিদ্যুৎ সরবরাহ—প্রতিটি পাবলিক
              দপ্তরের নিজস্ব প্রোফাইলে দাখিলকৃত রিপোর্ট, প্রমাণপত্রের অনুপাত এবং
              কর্তৃপক্ষের লিখিত উত্তর সংরক্ষিত থাকে।
            </p>

            <div className="mt-8">
              <Link
                href="/institutions"
                className="group inline-flex items-center gap-2 border-2 border-foreground bg-primary px-6 py-3.5 text-sm font-bold text-foreground shadow-[3px_3px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
              >
                <span>সম্পূর্ণ প্রতিষ্ঠান সূচি দেখুন</span>
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: 2x2 Institutions Grid */}
          <div>
            {institutions.length > 0 ? (
              <div className="grid grid-cols-2 gap-2.5 min-[480px]:gap-3.5 sm:gap-4">
                {institutions.map((inst) => {
                  const Icon = getIcon(String(inst.category || ""));

                  return (
                    <Link
                      key={inst.id}
                      href={`/institutions/${inst.slug}`}
                      className={cn(
                        "group relative flex flex-col justify-between border-2 border-border bg-background transition-all duration-300",
                        "p-3 min-[400px]:p-4 sm:p-5",
                        "hover:-translate-y-1 hover:border-foreground hover:shadow-[3px_3px_0_var(--foreground)] sm:hover:shadow-[4px_4px_0_var(--foreground)]",
                      )}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="grid size-7 min-[400px]:size-8 sm:size-10 place-items-center border border-border bg-muted/40 text-primary transition-colors group-hover:border-primary group-hover:bg-primary/10">
                            <Icon className="size-3.5 min-[400px]:size-4 sm:size-5" />
                          </div>
                          <span className="rounded-none bg-muted px-1.5 py-0.5 text-[9px] min-[400px]:text-[10px] font-semibold text-muted-foreground">
                            {inst.category || "সেবা"}
                          </span>
                        </div>

                        <h3 className="mt-3 min-[400px]:mt-4 sm:mt-8 text-xs min-[400px]:text-sm sm:text-base font-bold text-foreground leading-snug transition-colors group-hover:text-primary line-clamp-2">
                          {inst.nameBn}
                        </h3>

                        <div className="mt-1 sm:mt-2 flex items-center gap-1 text-[10px] min-[400px]:text-[11px] sm:text-xs text-muted-foreground">
                          <MapPin className="size-3 shrink-0 text-muted-foreground/70" />
                          <span className="truncate">{inst.location?.area || "শিবচর"}</span>
                        </div>
                      </div>

                      <div className="mt-3 min-[400px]:mt-4 sm:mt-6 flex items-center justify-between border-t border-border/70 pt-2 sm:pt-3 text-[10px] min-[400px]:text-[11px] sm:text-xs font-semibold text-foreground">
                        <span className="text-muted-foreground">রেকর্ড</span>
                        <span className="inline-flex items-center gap-0.5 group-hover:text-primary">
                          দেখুন <ArrowRight className="size-2.5 sm:size-3 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center border-2 border-dashed border-border bg-background p-8 text-center text-sm text-muted-foreground">
                দপ্তরের তথ্য লোড হচ্ছে...
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
