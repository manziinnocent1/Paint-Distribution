import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { DashboardTrend } from "../../types/dashboard.types";
import { formatPercentage } from "../../utils/dashboard-formatters";

interface DashboardStatCardProps {
  title: string;
  value: string;
  description?: string;
  trend?: DashboardTrend;
  icon: LucideIcon;
  iconColor?: "blue" | "green" | "purple" | "orange" | "red";
}

const iconStyles = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
  red: "bg-red-50 text-red-600",
};

export function DashboardStatCard({
  title,
  value,
  description,
  trend,
  icon: Icon,
  iconColor = "blue",
}: DashboardStatCardProps) {
  const TrendIcon =
    trend?.direction === "up"
      ? ArrowUpRight
      : trend?.direction === "down"
        ? ArrowDownRight
        : Minus;

  const trendColor =
    trend?.direction === "up"
      ? "text-green-600"
      : trend?.direction === "down"
        ? "text-red-600"
        : "text-slate-500";

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${iconStyles[iconColor]}`}>
          <Icon size={21} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        {trend && (
          <span
            className={`inline-flex items-center gap-1 font-semibold ${trendColor}`}
          >
            <TrendIcon size={14} />
            {formatPercentage(trend.value)}
          </span>
        )}
        <span className="text-slate-500">{trend?.label ?? description}</span>
      </div>
    </article>
  );
}
