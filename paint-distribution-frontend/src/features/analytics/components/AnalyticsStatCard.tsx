import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { formatNumber, formatPercentage } from "../utils/analytics.utils";

interface AnalyticsStatCardProps {
  title: string;
  value: number;
  change?: number;
  description?: string;
  icon: React.ReactNode;
  format?: "number" | "currency";
}

export default function AnalyticsStatCard({
  title,
  value,
  change,
  description,
  icon,
  format = "number",
}: AnalyticsStatCardProps) {
  const formattedValue =
    format === "currency"
      ? new Intl.NumberFormat("en-RW", {
          style: "currency",
          currency: "RWF",
          maximumFractionDigits: 0,
        }).format(value)
      : formatNumber(value);

  const isPositive = (change ?? 0) > 0;
  const isNegative = (change ?? 0) < 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <h3 className="mt-2 text-2xl font-bold text-gray-900">
            {formattedValue}
          </h3>
        </div>

        <div className="rounded-lg bg-blue-50 p-3 text-blue-600">{icon}</div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {change !== undefined && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
              isPositive
                ? "bg-green-50 text-green-700"
                : isNegative
                  ? "bg-red-50 text-red-700"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight size={14} />
            ) : isNegative ? (
              <ArrowDownRight size={14} />
            ) : (
              <Minus size={14} />
            )}

            {formatPercentage(change)}
          </span>
        )}

        {description && (
          <span className="text-xs text-gray-500">{description}</span>
        )}
      </div>
    </div>
  );
}
