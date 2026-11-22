import { RefreshCw } from "lucide-react";

import InventorySummary from "../components/InventorySummary";
import AnalyticsStatCard from "../components/AnalyticsStatCard";

import { useInventoryAnalytics } from "../hooks/useInventoryAnalytics";

import { formatCurrency } from "../utils/analytics.utils";

export default function InventoryAnalyticsPage() {
  const { data, loading, error, refresh } = useInventoryAnalytics();

  const inventory = data?.inventory ?? {
    total_products: 0,
    total_stock_quantity: 0,
    low_stock_products: 0,
    out_of_stock_products: 0,
    inventory_value: 0,
    in_stock_products: 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Inventory Analytics
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor stock availability and inventory value.
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

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <InventorySummary inventory={inventory} loading={loading} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnalyticsStatCard
          title="Total stock quantity"
          value={inventory.total_stock_quantity}
          icon={<span>QTY</span>}
        />

        <AnalyticsStatCard
          title="Products in stock"
          value={inventory.in_stock_products}
          icon={<span>IN</span>}
        />

        <AnalyticsStatCard
          title="Inventory value"
          value={inventory.inventory_value}
          icon={<span>RWF</span>}
          format="currency"
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-base font-semibold text-gray-900">Stock health</h3>

        <p className="mt-1 text-sm text-gray-500">
          Product availability across your inventory.
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-gray-700">In stock</span>
              <span className="text-gray-500">
                {inventory.in_stock_products}
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-green-500"
                style={{
                  width: `${
                    inventory.total_products
                      ? (inventory.in_stock_products /
                          inventory.total_products) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-gray-700">Low stock</span>
              <span className="text-gray-500">
                {inventory.low_stock_products}
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-yellow-500"
                style={{
                  width: `${
                    inventory.total_products
                      ? (inventory.low_stock_products /
                          inventory.total_products) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-gray-700">Out of stock</span>
              <span className="text-gray-500">
                {inventory.out_of_stock_products}
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-red-500"
                style={{
                  width: `${
                    inventory.total_products
                      ? (inventory.out_of_stock_products /
                          inventory.total_products) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Total inventory value:{" "}
          <span className="font-semibold text-gray-900">
            {formatCurrency(inventory.inventory_value)}
          </span>
        </p>
      </div>
    </div>
  );
}
