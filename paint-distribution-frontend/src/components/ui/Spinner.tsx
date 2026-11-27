import { cn } from "../../lib/utils";

export interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "primary" | "white" | "gray";
  className?: string;
  label?: string;
}

const sizes = {
  xs: "h-3 w-3 border",
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[3px]",
  xl: "h-12 w-12 border-4",
};

const colors = {
  primary: "border-blue-600 border-t-transparent",
  white: "border-white border-t-transparent",
  gray: "border-gray-500 border-t-transparent",
};

export function Spinner({
  size = "md",
  color = "primary",
  className,
  label = "Loading",
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-block animate-spin rounded-full",
        sizes[size],
        colors[color],
        className,
      )}
    />
  );
}
