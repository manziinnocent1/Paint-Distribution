import { Package } from "lucide-react";

import type { TopProduct } from "../types/analytics.types";

import { formatCurrency, formatNumber } from "../utils/analytics.utils";

interface TopProductsProps {
  products: TopProduct[];
  loading?: boolean;
}

export default function TopProducts({
  products,
  loading = false,
}: TopProductsProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gray-900">
          Top-selling products
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Products ranked by sales revenue
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-lg bg-gray-100"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-10 text-center text-sm text-gray-500">
          No product sales data available.
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-600">
                {index + 1}
              </span>

              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Package size={19} />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {product.name}
                </p>

                <p className="text-xs text-gray-500">
                  {formatNumber(product.quantity_sold)} units sold
                </p>
              </div>

              <p className="whitespace-nowrap text-sm font-semibold text-gray-900">
                {formatCurrency(product.total_revenue)}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
