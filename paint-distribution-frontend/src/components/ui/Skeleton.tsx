import { cn } from "../../lib/utils";

export interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

export function Skeleton({
  className,
  variant = "rectangular",
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-gray-200",
        variant === "text" && "h-4 rounded-md",
        variant === "circular" && "rounded-full",
        variant === "rectangular" && "rounded-lg",
        className,
      )}
    />
  );
}

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          className={cn("h-4", index === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      className="rounded-xl border border-gray-200 bg-white p-5"
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" variant="text" />
        <Skeleton className="h-9 w-9" />
      </div>

      <Skeleton className="mt-5 h-8 w-24" variant="text" />
      <Skeleton className="mt-3 h-3 w-32" variant="text" />
    </div>
  );
}
