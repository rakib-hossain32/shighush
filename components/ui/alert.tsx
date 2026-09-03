import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircleIcon, AlertTriangleIcon, CheckCircle2Icon, InfoIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Alert component for displaying contextual feedback messages.
 *
 * Supports variants: default, info, success, warning, destructive
 * 
 * Usage:
 * ```tsx
 * <Alert variant="warning">
 *   <AlertTitle>সতর্কতা</AlertTitle>
 *   <AlertDescription>
 *     এই তথ্য পরীক্ষা করুন।
 *   </AlertDescription>
 * </Alert>
 * ```
 */

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:size-5 [&>svg~*]:pl-8",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-foreground",
        info: "border-primary/50 bg-primary/10 text-primary [&>svg]:text-primary",
        success: "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400 [&>svg]:text-green-600 dark:[&>svg]:text-green-500",
        warning: "border-yellow-500/50 bg-yellow-500/10 text-yellow-800 dark:text-yellow-400 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-500",
        destructive:
          "border-destructive/50 bg-destructive/10 text-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-bold leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm leading-relaxed [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

/**
 * Alert icon helpers mapped to variants
 */
const AlertIcons = {
  default: AlertCircleIcon,
  info: InfoIcon,
  success: CheckCircle2Icon,
  warning: AlertTriangleIcon,
  destructive: AlertCircleIcon,
};

export { Alert, AlertTitle, AlertDescription, alertVariants, AlertIcons };
