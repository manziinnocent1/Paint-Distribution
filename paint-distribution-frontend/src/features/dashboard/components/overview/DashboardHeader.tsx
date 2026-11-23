import { RefreshCw } from "lucide-react";
import { DashboardWelcome } from "./DashboardWelcome";
import { DashboardDateFilter } from "./DashboardDateFilter";
import type { DashboardDateFilter as DateFilter } from "../../types/dashboard.types";

interface DashboardHeaderProps {
  userName?: string;
  dateFilter: DateFilter;
  onDateFilterChange: (value: DateFilter) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function DashboardHeader({
  userName,
  dateFilter,
  onDateFilterChange,
  onRefresh,
  isRefreshing = false,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
      <DashboardWelcome userName={userName} />

      <div className="flex flex-wrap items-center gap-3">
        <DashboardDateFilter value={dateFilter} onChange={onDateFilterChange} />

        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="Refresh dashboard"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>
    </div>
  );
}
