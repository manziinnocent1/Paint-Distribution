"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "../../../../lib/utils";

/* ============================================================
   LABEL COMPONENT
============================================================ */

export interface LabelProps extends React.ComponentPropsWithoutRef<
  typeof LabelPrimitive.Root
> {}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, ...props }, ref) => {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
});

Label.displayName = LabelPrimitive.Root.displayName;

/* ============================================================
   EXPORTS
============================================================ */

export { Label };
