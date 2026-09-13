import { AlertCircle, ShieldCheck } from "lucide-react";

export function DataNotice() {
  return (
    <div className="flex items-start gap-3.5 border-2 border-border bg-secondary/40 p-4 sm:p-5 shadow-[3px_3px_0_var(--foreground)] text-foreground">
      <AlertCircle className="size-5 text-primary shrink-0 mt-0.5" />
      <div className="space-y-1 w-full">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-xs font-bold font-heading uppercase tracking-wider text-foreground">
            নাগরিক তথ্য ও মেথডোলজি ডিসক্লেমার
          </h4>
          <span className="inline-flex items-center gap-1 border border-border bg-background px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
            <ShieldCheck className="size-3 text-primary" />
            AGGREGATE DATA VIEW
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-1">
          এখানে প্রদর্শিত পরিসংখ্যানগুলো শিবচরের সাধারণ নাগরিকদের জমা দেওয়া ও প্রাথমিক ফিল্টারিং পার হওয়া প্রতিবেদনের সমষ্টি। এগুলো কোনো একক ব্যক্তির বিরুদ্ধে আইনি রায় নয়, বরং প্রশাসনিক স্বচ্ছতা ও জনসেবার সার্বিক চিত্র তুলে ধরার উন্মুক্ত উদ্যোগ।
        </p>
      </div>
    </div>
  );
}
