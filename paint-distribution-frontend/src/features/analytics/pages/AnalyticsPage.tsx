import { useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import AnalyticsFilters from "../components/AnalyticsFilters";
import AnalyticsOverview from "../components/AnalyticsOverview";
import RevenueChart from "../components/RevenueChart";
import SalesChart from "../components/SalesChart";
import OrdersChart from "../components/OrdersChart";
import TopProducts from "../components/TopProducts";
import RecentSales from "../components/RecentSales";
import InventorySummary from "../components/InventorySummary";

import { useAnalytics } from "../hooks/useAnalytics";

import type { AnalyticsFilters as AnalyticsFiltersType } from "../types/analytics.types";

export default function AnalyticsPage() {
  const [filters, setFilters] = useState<AnalyticsFiltersType>({
    period: "this_month",
  });

  const { data, loading, error, refresh } = useAnalytics(filters);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor your paint distribution business performance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh data
        </button>
      </div>

      <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="mb-1 text-sm font-semibold text-gray-900">
            Dashboard filters
          </h2>

          <p className="mb-3 text-xs text-gray-500">
            Select the period for your analytics report.
          </p>

          <AnalyticsFilters filters={filters} onChange={setFilters} />
        </div>
      </div>

      {error && (
        <div className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-red-700">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>

          <button
            type="button"
            onClick={() => void refresh()}
            className="text-sm font-semibold text-red-700 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      <AnalyticsOverview
        overview={
          data?.overview ?? {
            total_revenue: 0,
            total_sales: 0,
            total_orders: 0,
            average_order_value: 0,
            total_customers: 0,
            total_products: 0,
            low_stock_products: 0,
            out_of_stock_products: 0,
          }
        }
        loading={loading}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RevenueChart data={data?.revenue_trend ?? []} loading={loading} />

        <SalesChart data={data?.sales_trend ?? []} loading={loading} />
      </div>

      <OrdersChart data={data?.orders_trend ?? []} loading={loading} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <TopProducts products={data?.top_products ?? []} loading={loading} />

        <InventorySummary
          inventory={
            data?.inventory ?? {
              total_products: 0,
              total_stock_quantity: 0,
              low_stock_products: 0,
              out_of_stock_products: 0,
              inventory_value: 0,
              in_stock_products: 0,
            }
          }
          loading={loading}
        />
      </div>

      <RecentSales sales={data?.recent_sales ?? []} loading={loading} />
    </div>
  );
}
