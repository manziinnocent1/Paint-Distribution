import type { OrdersDataPoint } from "../types/analytics.types";

import { formatNumber, formatShortDate } from "../utils/analytics.utils";

interface OrdersChartProps {
  data: OrdersDataPoint[];
  loading?: boolean;
}

export default function OrdersChart({
  data,
  loading = false,
}: OrdersChartProps) {
  const maxOrders = Math.max(...data.map((item) => item.orders), 1);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900">Orders overview</h3>

      <p className="mb-6 mt-1 text-sm text-gray-500">
        Orders received during the selected period
      </p>

      {loading ? (
        <div className="h-56 animate-pulse rounded-lg bg-gray-100" />
      ) : data.length === 0 ? (
        <div className="flex h-56 items-center justify-center text-sm text-gray-500">
          No order data available.
        </div>
      ) : (
        <div className="flex h-56 items-end gap-2 overflow-x-auto border-b border-gray-100 pb-2">
          {data.map((item) => (
            <div
              key={item.date}
              className="group flex min-w-10 flex-1 flex-col items-center justify-end gap-2"
              title={`${formatShortDate(item.date)}: ${formatNumber(item.orders)} orders`}
            >
              <span className="text-xs text-gray-600">
                {formatNumber(item.orders)}
              </span>

              <div
                className="w-full max-w-12 rounded-t-md bg-violet-500 transition-colors group-hover:bg-violet-600"
                style={{
                  height: `${Math.max((item.orders / maxOrders) * 100, 3)}%`,
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
