import * as React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label?: string;
    direction: "up" | "down" | "neutral";
  };
  iconColor?: string;
  className?: string;
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  iconColor = "bg-blue-50 text-blue-600",
  className,
  loading = false,
}: StatCardProps) {
  const TrendIcon =
    trend?.direction === "up"
      ? TrendingUp
      : trend?.direction === "down"
        ? TrendingDown
        : Minus;

  return (
    <Card className={cn("min-w-0", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>

          {loading ? (
            <div className="mt-3 h-8 w-28 animate-pulse rounded-md bg-gray-200" />
          ) : (
            <h3 className="mt-2 break-words text-2xl font-bold tracking-tight text-gray-900">
              {value}
            </h3>
          )}
        </div>

        {icon && (
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              iconColor,
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {(description || trend) && !loading && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs font-semibold",
                trend.direction === "up" && "text-green-600",
                trend.direction === "down" && "text-red-600",
                trend.direction === "neutral" && "text-gray-500",
              )}
            >
              <TrendIcon className="h-3.5 w-3.5" />
              {Math.abs(trend.value)}%
            </span>
          )}

          {trend?.label && (
            <span className="text-xs text-gray-500">{trend.label}</span>
          )}

          {description && (
            <span className="text-xs text-gray-500">{description}</span>
          )}
        </div>
      )}
    </Card>
  );
}
