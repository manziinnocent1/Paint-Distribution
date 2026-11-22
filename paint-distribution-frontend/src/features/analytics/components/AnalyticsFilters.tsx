import type {
  AnalyticsFilters as AnalyticsFiltersType,
  AnalyticsPeriod,
} from "../types/analytics.types";

interface AnalyticsFiltersProps {
  filters: AnalyticsFiltersType;
  onChange: (filters: AnalyticsFiltersType) => void;
}

const periods: { label: string; value: AnalyticsPeriod }[] = [
  { label: "Today", value: "today" },
  { label: "This week", value: "this_week" },
  { label: "This month", value: "this_month" },
  { label: "This year", value: "this_year" },
  { label: "Last 7 days", value: "last_7_days" },
  { label: "Last 30 days", value: "last_30_days" },
  { label: "Last 90 days", value: "last_90_days" },
  { label: "Custom range", value: "custom" },
];

export default function AnalyticsFilters({
  filters,
  onChange,
}: AnalyticsFiltersProps) {
  const handlePeriodChange = (period: AnalyticsPeriod) => {
    onChange({
      period,
      start_date: period === "custom" ? filters.start_date : undefined,
      end_date: period === "custom" ? filters.end_date : undefined,
    });
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label
          htmlFor="analytics-period"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Reporting period
        </label>

        <select
          id="analytics-period"
          value={filters.period}
          onChange={(event) =>
            handlePeriodChange(event.target.value as AnalyticsPeriod)
          }
          className="min-w-44 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          {periods.map((period) => (
            <option key={period.value} value={period.value}>
              {period.label}
            </option>
          ))}
        </select>
      </div>

      {filters.period === "custom" && (
        <>
          <div>
            <label
              htmlFor="analytics-start-date"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Start date
            </label>

            <input
              id="analytics-start-date"
              type="date"
              value={filters.start_date ?? ""}
              onChange={(event) =>
                onChange({
                  ...filters,
                  start_date: event.target.value,
                })
              }
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="analytics-end-date"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              End date
            </label>

            <input
              id="analytics-end-date"
              type="date"
              min={filters.start_date}
              value={filters.end_date ?? ""}
              onChange={(event) =>
                onChange({
                  ...filters,
                  end_date: event.target.value,
                })
              }
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </>
      )}
    </div>
  );
}
