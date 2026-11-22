import type { RevenueDataPoint } from "../types/analytics.types";

import { formatCurrency, formatShortDate } from "../utils/analytics.utils";

interface RevenueChartProps {
  data: RevenueDataPoint[];
  loading?: boolean;
}

export default function RevenueChart({
  data,
  loading = false,
}: RevenueChartProps) {
  const maxRevenue = Math.max(...data.map((item) => item.revenue), 1);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-900">Revenue trend</h3>
        <p className="mt-1 text-sm text-gray-500">
          Revenue generated during the selected period
        </p>
      </div>

      {loading ? (
        <div className="flex h-64 animate-pulse items-end gap-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex-1 rounded-t bg-gray-100"
              style={{ height: `${30 + ((index * 13) % 60)}%` }}
            />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-gray-500">
          No revenue data available for this period.
        </div>
      ) : (
        <div className="flex h-64 items-end gap-2 overflow-x-auto border-b border-gray-100 pb-2">
          {data.map((item) => {
            const height = Math.max((item.revenue / maxRevenue) * 100, 3);

            return (
              <div
                key={item.date}
                className="group flex min-w-10 flex-1 flex-col items-center justify-end gap-2"
                title={`${formatShortDate(item.date)}: ${formatCurrency(item.revenue)}`}
              >
                <div className="invisible text-center text-xs text-gray-600 group-hover:visible">
                  {formatCurrency(item.revenue)}
                </div>

                <div
                  className="w-full max-w-12 rounded-t-md bg-blue-600 transition-colors group-hover:bg-blue-700"
                  style={{ height: `${height}%` }}
                />

                <span className="whitespace-nowrap text-xs text-gray-500">
                  {formatShortDate(item.date)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
