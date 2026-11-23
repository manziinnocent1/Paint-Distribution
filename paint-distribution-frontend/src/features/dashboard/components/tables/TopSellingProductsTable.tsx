import type { DashboardProduct } from "../../types/dashboard.types";
import { formatCurrency, formatNumber } from "../../utils/dashboard-formatters";

interface TopSellingProductsTableProps {
  products: DashboardProduct[];
}

export function TopSellingProductsTable({
  products,
}: TopSellingProductsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3 font-medium">Product</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 text-right font-medium">Sold</th>
            <th className="px-4 py-3 text-right font-medium">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
            >
              <td className="px-4 py-4">
                <p className="font-semibold text-slate-800">
                  {product.productName}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {product.productCode}
                </p>
              </td>
              <td className="px-4 py-4 text-slate-600">
                {product.categoryName}
              </td>
              <td className="px-4 py-4 text-right font-medium text-slate-800">
                {formatNumber(product.quantitySold)} {product.unit ?? ""}
              </td>
              <td className="px-4 py-4 text-right font-semibold text-slate-800">
                {formatCurrency(product.totalRevenue)}
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                No product sales available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
