import { ShoppingCart } from "lucide-react";
import type { SalesSummary } from "../../types/dashboard.types";
import { formatNumber } from "../../utils/dashboard-formatters";

interface SalesCardProps {
  summary: SalesSummary;
}

export function SalesCard({ summary }: SalesCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="rounded-lg bg-green-50 p-2 text-green-600">
          <ShoppingCart size={20} />
        </span>
        <span className="text-sm font-medium text-slate-600">
          Sales summary
        </span>
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-900">
        {formatNumber(summary.totalSales)}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-500">Average sales</p>
          <p className="mt-1 font-semibold text-slate-800">
            {summary.averageSales.toFixed(1)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Previous period</p>
          <p className="mt-1 font-semibold text-slate-800">
            {formatNumber(summary.previousSales)}
          </p>
        </div>
      </div>
    </div>
  );
}
