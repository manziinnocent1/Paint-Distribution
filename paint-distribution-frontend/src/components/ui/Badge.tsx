import * as React from "react";
import { cn } from "../../lib/utils";

export type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700",
  primary: "bg-blue-100 text-blue-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-700",
  info: "bg-cyan-100 text-cyan-700",
  outline: "border border-gray-300 bg-white text-gray-700",
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        variants[variant],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "success" && "bg-green-600",
            variant === "warning" && "bg-yellow-600",
            variant === "danger" && "bg-red-600",
            variant === "primary" && "bg-blue-600",
            variant === "info" && "bg-cyan-600",
            variant === "default" && "bg-gray-500",
            variant === "outline" && "bg-gray-500",
          )}
        />
      )}

      {children}
    </span>
  );
}
