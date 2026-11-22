import type { SalesDataPoint } from "../types/analytics.types";

import { formatNumber, formatShortDate } from "../utils/analytics.utils";

interface SalesChartProps {
  data: SalesDataPoint[];
  loading?: boolean;
}

export default function SalesChart({ data, loading = false }: SalesChartProps) {
  const maxSales = Math.max(...data.map((item) => item.sales), 1);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900">
        Sales performance
      </h3>

      <p className="mb-6 mt-1 text-sm text-gray-500">
        Number of sales over time
      </p>

      {loading ? (
        <div className="h-56 animate-pulse rounded-lg bg-gray-100" />
      ) : data.length === 0 ? (
        <div className="flex h-56 items-center justify-center text-sm text-gray-500">
          No sales data available.
        </div>
      ) : (
        <div className="flex h-56 items-end gap-2 overflow-x-auto border-b border-gray-100 pb-2">
          {data.map((item) => (
            <div
              key={item.date}
              className="group flex min-w-10 flex-1 flex-col items-center justify-end gap-2"
              title={`${formatShortDate(item.date)}: ${formatNumber(item.sales)} sales`}
            >
              <span className="text-xs text-gray-600">
                {formatNumber(item.sales)}
              </span>

              <div
                className="w-full max-w-12 rounded-t-md bg-indigo-500 transition-colors group-hover:bg-indigo-600"
                style={{
                  height: `${Math.max((item.sales / maxSales) * 100, 3)}%`,
                }}
              />

              <span className="whitespace-nowrap text-xs text-gray-500">
                {formatShortDate(item.date)}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
