import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullPage?: boolean;
  className?: string;
}

const sizes = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function LoadingState({
  message = "Loading, please wait...",
  size = "md",
  fullPage = false,
  className,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        fullPage ? "min-h-[60vh]" : "py-10",
        className,
      )}
    >
      <Loader2 className={cn("animate-spin text-blue-600", sizes[size])} />

      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

export function LoadingOverlay({
  message = "Processing...",
}: {
  message?: string;
}) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
      <div className="flex items-center gap-3 rounded-lg bg-white px-5 py-4 shadow-lg">
        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        <span className="text-sm font-medium text-gray-700">{message}</span>
      </div>
    </div>
  );
}
