"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group font-sans"
      style={{
        fontFamily: "var(--font-bangla), sans-serif",
      }}
      richColors
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast font-sans group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-2 group-[.toaster]:border-foreground group-[.toaster]:shadow-[3px_3px_0_var(--foreground)] rounded-none font-medium text-sm",
          title: "font-sans font-bold text-foreground",
          description: "font-sans group-[.toast]:text-muted-foreground text-xs",
          actionButton:
            "font-sans rounded-none font-bold group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "font-sans rounded-none font-bold group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error: "group-[.toaster]:border-destructive",
          success: "group-[.toaster]:border-emerald-600",
        },
      }}
      {...props}
    />
  );
}
