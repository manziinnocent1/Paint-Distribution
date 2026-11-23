import { Package } from "lucide-react";
import type { InventorySummary } from "../../types/dashboard.types";
import { formatCurrency, formatNumber } from "../../utils/dashboard-formatters";

interface InventoryCardProps {
  summary: InventorySummary;
}

export function InventoryCard({ summary }: InventoryCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="rounded-lg bg-orange-50 p-2 text-orange-600">
          <Package size={20} />
        </span>
        <span className="text-sm font-medium text-slate-600">
          Inventory summary
        </span>
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-900">
        {formatCurrency(summary.totalInventoryValue)}
      </p>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs">
        <span className="text-slate-500">
          {formatNumber(summary.totalProducts)} products
        </span>
        <span className="font-medium text-orange-600">
          {summary.lowStockCount} low stock
        </span>
        <span className="font-medium text-red-600">
          {summary.outOfStockCount} out of stock
        </span>
      </div>
    </div>
  );
}
