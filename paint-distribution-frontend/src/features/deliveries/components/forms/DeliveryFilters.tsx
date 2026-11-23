import { Search, X } from "lucide-react";
import {
  DELIVERY_DATE_RANGES,
  DELIVERY_STATUSES,
} from "../../constants/delivery.constants";
import type {
  DeliveryDateRange,
  DeliveryFilters as DeliveryFiltersType,
  DeliveryStatus,
} from "../../types/delivery.types";

interface DeliveryFiltersProps {
  filters: DeliveryFiltersType;
  onChange: (filters: DeliveryFiltersType) => void;
}

export function DeliveryFilters({ filters, onChange }: DeliveryFiltersProps) {
  const update = (values: Partial<DeliveryFiltersType>) => {
    onChange({ ...filters, ...values, page: 1 });
  };

  const clear = () => {
    onChange({
      ...filters,
      search: "",
      status: "ALL",
      dateRange: "all",
      page: 1,
    });
  };

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative min-w-0 flex-1">
        <Search
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={filters.search}
          onChange={(event) => update({ search: event.target.value })}
          placeholder="Search delivery, tracking, order, or customer..."
          className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <label className="sr-only" htmlFor="delivery-status-filter">
        Filter by delivery status
      </label>
      <select
        id="delivery-status-filter"
        value={filters.status}
        onChange={(event) =>
          update({
            status: event.target.value as DeliveryStatus | "ALL",
          })
        }
        className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
      >
        <option value="ALL">All statuses</option>
        {DELIVERY_STATUSES.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>

      <label className="sr-only" htmlFor="delivery-date-filter">
        Filter by date
      </label>
      <select
        id="delivery-date-filter"
        value={filters.dateRange}
        onChange={(event) =>
          update({
            dateRange: event.target.value as DeliveryDateRange,
          })
        }
        className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
      >
        {DELIVERY_DATE_RANGES.map((range) => (
          <option key={range.value} value={range.value}>
            {range.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={clear}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
      >
        <X size={15} />
        Clear
      </button>
    </div>
  );
}
