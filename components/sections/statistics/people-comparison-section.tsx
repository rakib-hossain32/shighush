import Link from "next/link";
import { Eye, ShieldAlert } from "lucide-react";

export function PeopleComparisonSection() {
  return <section className="border-2 border-foreground bg-background p-6 sm:p-8"><div className="grid gap-6 lg:grid-cols-[.7fr_1.3fr]"><div><Eye className="size-6 text-primary"/><p className="mono mt-6 text-[11px] font-bold tracking-[.14em] text-primary">ব্যক্তি সংক্রান্ত রিপোর্ট</p><h2 className="display mt-2 text-3xl font-bold">নাম নয়,<br/>দায়বদ্ধতার মানদণ্ড।</h2></div><div><p className="leading-7 text-muted-foreground">কাউকে “সবচেয়ে বেশি ঘুষ নিয়েছে” বলা যাবে না। যথেষ্ট প্রমাণ ও প্রকাশ-নীতির threshold পূরণ হলে, কেবল “রিপোর্টে উল্লিখিত ব্যক্তি” হিসেবে তার সাথে সম্পর্কিত রিপোর্টের সংখ্যা, প্রমাণের স্তর এবং official record দেখানো যাবে।</p><div className="mt-6 flex items-start gap-3 border-l-4 border-secondary bg-muted p-4 text-sm"><ShieldAlert className="mt-0.5 size-5 shrink-0 text-primary"/><p>ব্যক্তির নাম ও তুলনা দেখানোর আগে নাম-প্রকাশ নীতি, আপিলের সুযোগ এবং দুইজন moderator-এর অনুমোদন বাধ্যতামূলক রাখুন।</p></div><Link href="/methodology" className="mt-6 inline-block font-bold underline">নাম প্রকাশ ও comparison policy পড়ুন →</Link></div></div></section>;
}
