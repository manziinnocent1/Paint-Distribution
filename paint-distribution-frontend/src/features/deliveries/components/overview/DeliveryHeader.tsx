import { Link } from "react-router-dom";
import { Plus, RefreshCw, Truck } from "lucide-react";

interface DeliveryHeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function DeliveryHeader({
  onRefresh,
  isRefreshing = false,
}: DeliveryHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <Truck size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Deliveries
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage shipments, delivery progress, and customer handovers.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          Refresh
        </button>

        <Link
          to="/deliveries/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={17} />
          New delivery
        </Link>
      </div>
    </div>
  );
}
