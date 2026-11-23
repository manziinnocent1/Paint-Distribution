import type { DashboardDateFilter } from "../../types/dashboard.types";
import { DASHBOARD_DATE_RANGES } from "../../constants/dashboard.constants";

interface DashboardDateFilterProps {
  value: DashboardDateFilter;
  onChange: (value: DashboardDateFilter) => void;
}

export function DashboardDateFilter({
  value,
  onChange,
}: DashboardDateFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor="dashboard-date-range" className="sr-only">
        Select dashboard date range
      </label>

      <select
        id="dashboard-date-range"
        value={value.range}
        onChange={(event) =>
          onChange({
            range: event.target.value as DashboardDateFilter["range"],
            startDate: value.startDate,
            endDate: value.endDate,
          })
        }
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        {DASHBOARD_DATE_RANGES.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {value.range === "custom" && (
        <>
          <label className="sr-only" htmlFor="dashboard-start-date">
            Start date
          </label>
          <input
            id="dashboard-start-date"
            type="date"
            value={value.startDate ?? ""}
            onChange={(event) =>
              onChange({ ...value, startDate: event.target.value })
            }
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />

          <label className="sr-only" htmlFor="dashboard-end-date">
            End date
          </label>
          <input
            id="dashboard-end-date"
            type="date"
            value={value.endDate ?? ""}
            min={value.startDate}
            onChange={(event) =>
              onChange({ ...value, endDate: event.target.value })
            }
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </>
      )}
    </div>
  );
}
