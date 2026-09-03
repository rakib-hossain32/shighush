"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export function DateTimePicker() {
  const [date, setDate] = React.useState<Date>();
  const [time, setTime] = React.useState<string>("12:00");

  const selectedDateTime = React.useMemo(() => {
    if (!date) return undefined;
    const [hours, minutes] = time.split(":");
    const newDate = new Date(date);
    newDate.setHours(parseInt(hours, 10));
    newDate.setMinutes(parseInt(minutes, 10));
    return newDate;
  }, [date, time]);

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left  border border-border bg-background px-3 font-medium outline-none transition focus:border-secondary focus:ring-3 focus:ring-secondary/50 hover:border-secondary/50",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDateTime ? (
              format(selectedDateTime, "PPP p")
            ) : (
              <span>যেমন: ১২ জানুয়ারি ২০২৬</span>
            )}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
        />
        <div className="p-3 border-t border-border">
          <Input 
            type="time" 
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
