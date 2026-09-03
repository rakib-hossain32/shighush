import Link from "next/link";
import { ArrowRight, Building2, Landmark, MapPin, Stethoscope } from "lucide-react";
import { getInstitutions } from "@/services";
import type { Institution } from "@/services/_shared/types";

const iconMap: Record<string, any> = {
  'ভূমি': Landmark,
  'স্বাস্থ্য': Stethoscope,
  'আইন': Building2,
  'default': Building2,
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
    console.error('Failed to fetch institutions:', error);
  }

  return (
    <section className="bg-background py-20">
      <div className="mx-auto grid max-w-7xl gap-9 px-5 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
        <div>
          <p className="mono text-[11px] font-bold tracking-[.16em] text-primary">
            {totalCount || '--'}টি প্রতিষ্ঠান
          </p>
          <h2 className="display mt-3 text-4xl font-bold leading-tight">
            প্রতিষ্ঠান ধরে
            <br />
            চিত্র দেখুন
          </h2>
          <p className="mt-5 max-w-sm leading-7 text-muted-foreground">
            প্রতিটি প্রতিষ্ঠানের page-এ রিপোর্ট সংখ্যা, যাচাইয়ের অবস্থা এবং
            প্রাসঙ্গিক উত্তর একত্রে দেখা যাবে।
          </p>
          <Link
            href="/institutions"
            className="mt-7 inline-flex items-center gap-2 border-b-2 border-foreground pb-1 font-bold"
          >
            প্রতিষ্ঠান সূচি দেখুন <ArrowRight className="size-4" />
          </Link>
        </div>

        {institutions.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {institutions.map((institution) => {
              const Icon = getIcon(String(institution.category));
              return (
                <Link
                  href={`/institutions/${institution.slug}`}
                  key={institution.id}
                  className="group border border-border bg-card p-5 transition hover:border-foreground hover:shadow-[4px_4px_0_#10221e]"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="size-5 text-primary" />
                    <MapPin className="size-4 text-muted-foreground" />
                  </div>
                  <h3 className="mt-12 font-bold group-hover:text-primary">
                    {institution.nameBn}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {institution.category} · {institution.location.area || 'শিবচর'}
                  </p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center text-muted-foreground">
            <p>প্রতিষ্ঠান লোড হচ্ছে...</p>
          </div>
        )}
      </div>
    </section>
  );
}
