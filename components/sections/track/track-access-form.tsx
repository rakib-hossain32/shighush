import { KeyRound, LockKeyhole, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function TrackAccessForm() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_290px]">
      <section className="border border-border bg-card">
        <div className="border-b border-border p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-secondary text-secondary-foreground">
              <KeyRound className="size-5" />
            </span>
            <div>
              <p className="mono text-[10px] font-bold tracking-[0.16em] text-primary">
                PRIVATE ACCESS
              </p>
              <h2 className="mt-1 text-xl font-bold">
                আপনার case credential দিন
              </h2>
            </div>
          </div>
        </div>
        <form className="grid gap-5 p-5 sm:p-7">
          <Label className="grid gap-2 text-sm font-bold">
            Case ID
            <span className="text-xs font-normal text-muted-foreground">
              জমার পরে যে short ID পেয়েছেন
            </span>
            <Input
              name="caseId"
              autoComplete="off"
              placeholder="যেমন: শি-০০৪২"
              className="h-11 border border-border bg-background px-3 font-medium outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
            />
          </Label>
          <Label className="grid gap-2 text-sm font-bold">
            Secret Token
            <span className="text-xs font-normal text-muted-foreground">
              এটি password-এর মতো গোপন রাখুন
            </span>
            <Input
              name="secretToken"
              type="password"
              autoComplete="current-password"
              placeholder="আপনার গোপন token"
              className="h-11 border border-border bg-background px-3 font-medium outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
            />
          </Label>
          <Button type="button" className="mt-2 h-11 w-full sm:w-fit sm:px-6">
            <Search />
            অবস্থা দেখুন
          </Button>
        </form>
      </section>
      <aside className="border-t-4 border-secondary bg-foreground p-6 text-background lg:border-t-0 lg:border-l-4">
        <LockKeyhole className="size-6 text-secondary" />
        <p className="mono mt-7 text-[10px] font-bold tracking-[0.16em] text-secondary">
          SECURITY NOTE
        </p>
        <h2 className="mt-3 text-2xl font-bold leading-8">
          Token হারালে সেটি ফেরত পাওয়া যাবে না
        </h2>
        <p className="mt-4 text-sm leading-6 text-background/75">
          পরিচয় সুরক্ষার জন্য আমরা token সংরক্ষণ বা পুনরুদ্ধার করি না। Case ID
          এবং token নিরাপদ স্থানে লিখে রাখুন।
        </p>
      </aside>
    </div>
  );
}
