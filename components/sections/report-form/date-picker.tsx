"use client";

import * as React from "react";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { FIELD_TRIGGER } from "./field";

interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
  disabled?: boolean;
  /** Set so the wizard's error summary can scroll to and focus this control. */
  id?: string;
  describedBy?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "তারিখ বেছে নিন…",
  hasError = false,
  disabled = false,
  id,
  describedBy,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const selectedDate = React.useMemo(() => {
    if (!value) return undefined;
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  }, [value]);

  const displayText = React.useMemo(() => {
    if (!selectedDate) return "";
    try {
      return format(selectedDate, "d MMMM, yyyy", { locale: bn });
    } catch {
      return value;
    }
  }, [selectedDate, value]);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      onChange(`${y}-${m}-${d}`);
    } else {
      onChange("");
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-describedby={describedBy}
        aria-invalid={hasError || undefined}
        className={cn(
          FIELD_TRIGGER,
          "flex items-center justify-between px-3 font-medium outline-none transition-colors select-none",
          "hover:border-foreground",
          hasError && "border-destructive text-destructive",
          disabled && "cursor-not-allowed opacity-50",
          !selectedDate && "text-muted-foreground",
        )}
        disabled={disabled}
        id={id}
        type="button"
      >
        <span className="flex min-w-0 items-center gap-2">
          <CalendarIcon aria-hidden="true" className="size-4 shrink-0 text-primary" />
          <span className="truncate">{displayText || placeholder}</span>
        </span>
        <ChevronDownIcon
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground"
        />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto p-0 rounded-none border-2 border-foreground bg-card shadow-[4px_4px_0_var(--foreground)]"
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          disabled={(date) => date > new Date() || date < new Date("1971-01-01")}
          className="rounded-none bg-background p-3"
        />
      </PopoverContent>
    </Popover>
  );
}
