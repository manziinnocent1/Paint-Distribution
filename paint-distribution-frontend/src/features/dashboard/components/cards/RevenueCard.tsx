import { Wallet } from "lucide-react";
import type { RevenueSummary } from "../../types/dashboard.types";
import { formatCurrency } from "../../utils/dashboard-formatters";

interface RevenueCardProps {
  summary: RevenueSummary;
}

export function RevenueCard({ summary }: RevenueCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="rounded-lg bg-blue-50 p-2 text-blue-600">
          <Wallet size={20} />
        </span>
        <span className="text-sm font-medium text-slate-600">
          Revenue summary
        </span>
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-900">
        {formatCurrency(summary.currentRevenue)}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-500">Average revenue</p>
          <p className="mt-1 font-semibold text-slate-800">
            {formatCurrency(summary.averageRevenue)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Previous period</p>
          <p className="mt-1 font-semibold text-slate-800">
            {formatCurrency(summary.previousRevenue)}
          </p>
        </div>
      </div>
    </div>
  );
}
