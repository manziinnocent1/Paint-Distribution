import {
  EXPENSE_CATEGORIES,
  EXPENSE_PAYMENT_METHODS,
  EXPENSE_STATUSES,
} from "../constants/expense.constants";
import type { ExpenseFilters as ExpenseFiltersType } from "../types/expense.types";

interface ExpenseFiltersProps {
  filters: ExpenseFiltersType;
  onChange: (filters: ExpenseFiltersType) => void;
}

export function ExpenseFilters({ filters, onChange }: ExpenseFiltersProps) {
  const update = (values: Partial<ExpenseFiltersType>) => {
    onChange({ ...filters, ...values, page: 1 });
  };

  const selectClass =
    "rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <input
          type="search"
          value={filters.search}
          onChange={(event) => update({ search: event.target.value })}
          placeholder="Search expenses..."
          aria-label="Search expenses"
          className={selectClass}
        />

        <select
          value={filters.category}
          onChange={(event) =>
            update({
              category: event.target.value as ExpenseFiltersType["category"],
            })
          }
          aria-label="Filter by category"
          className={selectClass}
        >
          <option value="all">All categories</option>
          {EXPENSE_CATEGORIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(event) =>
            update({
              status: event.target.value as ExpenseFiltersType["status"],
            })
          }
          aria-label="Filter by status"
          className={selectClass}
        >
          <option value="all">All statuses</option>
          {EXPENSE_STATUSES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <select
          value={filters.paymentMethod}
          onChange={(event) =>
            update({
              paymentMethod: event.target
                .value as ExpenseFiltersType["paymentMethod"],
            })
          }
          aria-label="Filter by payment method"
          className={selectClass}
        >
          <option value="all">All payment methods</option>
          {EXPENSE_PAYMENT_METHODS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-xs text-slate-500">
          From
          <input
            type="date"
            value={filters.startDate}
            max={filters.endDate || undefined}
            onChange={(event) => update({ startDate: event.target.value })}
            className={`ml-2 ${selectClass}`}
          />
        </label>

        <label className="text-xs text-slate-500">
          To
          <input
            type="date"
            value={filters.endDate}
            min={filters.startDate || undefined}
            onChange={(event) => update({ endDate: event.target.value })}
            className={`ml-2 ${selectClass}`}
          />
        </label>

        <select
          value={filters.ordering}
          onChange={(event) =>
            update({
              ordering: event.target.value as ExpenseFiltersType["ordering"],
            })
          }
          aria-label="Sort expenses"
          className={selectClass}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="amount_high">Highest amount</option>
          <option value="amount_low">Lowest amount</option>
        </select>

        <button
          type="button"
          onClick={() =>
            onChange({
              search: "",
              category: "all",
              status: "all",
              paymentMethod: "all",
              startDate: "",
              endDate: "",
              ordering: "newest",
              page: 1,
              pageSize: filters.pageSize,
            })
          }
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}
