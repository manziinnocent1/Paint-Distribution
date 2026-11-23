import { Link } from "react-router-dom";
import type { DashboardProduct } from "../../types/dashboard.types";
import { formatCurrency } from "../../utils/dashboard-formatters";

interface TopSellingProductsProps {
  products: DashboardProduct[];
}

export function TopSellingProducts({ products }: TopSellingProductsProps) {
  return (
    <div className="space-y-4">
      {products.slice(0, 5).map((product, index) => (
        <div key={product.id} className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-600">
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">
              {product.productName}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {product.quantitySold} {product.unit ?? "units"} sold
            </p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-slate-800">
            {formatCurrency(product.totalRevenue)}
          </p>
        </div>
      ))}

      {products.length === 0 && (
        <p className="py-6 text-center text-sm text-slate-500">
          No top-selling products available.
        </p>
      )}

      <Link
        to="/products"
        className="inline-flex text-sm font-semibold text-blue-600 hover:underline"
      >
        View all products
      </Link>
    </div>
  );
}
