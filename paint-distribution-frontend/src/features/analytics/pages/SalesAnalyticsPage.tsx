import { useState } from "react";
import { RefreshCw } from "lucide-react";

import AnalyticsFilters from "../components/AnalyticsFilters";
import AnalyticsStatCard from "../components/AnalyticsStatCard";
import RevenueChart from "../components/RevenueChart";
import SalesChart from "../components/SalesChart";
import OrdersChart from "../components/OrdersChart";
import TopProducts from "../components/TopProducts";
import RecentSales from "../components/RecentSales";

import { useSalesAnalytics } from "../hooks/useSalesAnalytics";

import type { AnalyticsFilters as AnalyticsFiltersType } from "../types/analytics.types";

import { formatCurrency } from "../utils/analytics.utils";

export default function SalesAnalyticsPage() {
  const [filters, setFilters] = useState<AnalyticsFiltersType>({
    period: "this_month",
  });

  const { data, loading, error, refresh } = useSalesAnalytics(filters);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Analytics</h1>

          <p className="mt-1 text-sm text-gray-500">
            Analyze revenue, sales activity, and product performance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <AnalyticsFilters filters={filters} onChange={setFilters} />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AnalyticsStatCard
          title="Total revenue"
          value={data?.total_revenue ?? 0}
          icon={<span>RWF</span>}
          format="currency"
        />

        <AnalyticsStatCard
          title="Total sales"
          value={data?.total_sales ?? 0}
          icon={<span>S</span>}
        />

        <AnalyticsStatCard
          title="Total orders"
          value={data?.total_orders ?? 0}
          icon={<span>O</span>}
        />

        <AnalyticsStatCard
          title="Average order value"
          value={data?.average_order_value ?? 0}
          icon={<span>AVG</span>}
          format="currency"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RevenueChart data={data?.revenue_trend ?? []} loading={loading} />

        <SalesChart data={data?.sales_trend ?? []} loading={loading} />
      </div>

      <OrdersChart data={data?.orders_trend ?? []} loading={loading} />

      <TopProducts products={data?.top_products ?? []} loading={loading} />

      <RecentSales sales={data?.recent_sales ?? []} loading={loading} />

      <p className="text-sm text-gray-500">
        Average order value:{" "}
        <span className="font-semibold text-gray-700">
          {formatCurrency(data?.average_order_value ?? 0)}
        </span>
      </p>
    </div>
  );
}
