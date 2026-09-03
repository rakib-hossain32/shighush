const unions = [
  ["শিবচর পৌরসভা", 8, "ঘুষ / অতিরিক্ত অর্থ"],
  ["কাঁঠালবাড়ী", 5, "সেবা-বঞ্চনা"],
  ["পাঁচচর", 4, "তথ্য না দেওয়া"],
  ["বাঁশকান্দি", 3, "হয়রানি"],
  ["কুতুবপুর", 1, "ঘুষ / অতিরিক্ত অর্থ"],
] as const;

export function UnionComparisonSection() {
  return <section className="border border-border bg-card p-6 sm:p-8"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="mono text-[11px] font-bold tracking-[.14em] text-primary">এলাকা তুলনা</p><h2 className="display mt-2 text-3xl font-bold">কোন এলাকায় বেশি রিপোর্ট?</h2></div><p className="text-xs text-muted-foreground">রিপোর্ট সংখ্যায় সাজানো</p></div><div className="mt-8 grid gap-5">{unions.map(([name,count,mainFactor]) => <div key={name}><div className="flex flex-wrap items-end justify-between gap-2"><div><p className="font-bold">{name}</p><p className="mt-1 text-xs text-muted-foreground">প্রধান উল্লিখিত বিষয়: {mainFactor}</p></div><span className="text-lg font-bold text-primary">{count} রিপোর্ট</span></div><div className="mt-2 h-2 bg-muted"><div className="h-full bg-primary" style={{ width: `${count * 12.5}%` }}/></div></div>)}</div></section>;
}
