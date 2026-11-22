import { AlertTriangle, Archive, Package, PackageX } from "lucide-react";

import type { InventoryAnalytics } from "../types/analytics.types";

import { formatCurrency, formatNumber } from "../utils/analytics.utils";

interface InventorySummaryProps {
  inventory: InventoryAnalytics;
  loading?: boolean;
}

export default function InventorySummary({
  inventory,
  loading = false,
}: InventorySummaryProps) {
  const items = [
    {
      label: "Total products",
      value: formatNumber(inventory.total_products),
      icon: <Package size={19} />,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Available stock",
      value: formatNumber(inventory.in_stock_products),
      icon: <Archive size={19} />,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Low stock",
      value: formatNumber(inventory.low_stock_products),
      icon: <AlertTriangle size={19} />,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      label: "Out of stock",
      value: formatNumber(inventory.out_of_stock_products),
      icon: <PackageX size={19} />,
      color: "text-red-600 bg-red-50",
    },
  ];

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900">
        Inventory summary
      </h3>

      <p className="mb-5 mt-1 text-sm text-gray-500">Current stock position</p>

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="h-20 animate-pulse rounded-lg bg-gray-100"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-gray-100 p-3"
            >
              <div className={`mb-3 inline-flex rounded-lg p-2 ${item.color}`}>
                {item.icon}
              </div>

              <p className="text-xl font-bold text-gray-900">{item.value}</p>

              <p className="mt-1 text-xs text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <div className="mt-5 border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-500">Estimated inventory value</p>

          <p className="mt-1 text-lg font-bold text-gray-900">
            {formatCurrency(inventory.inventory_value)}
          </p>
        </div>
      )}
    </section>
  );
}
