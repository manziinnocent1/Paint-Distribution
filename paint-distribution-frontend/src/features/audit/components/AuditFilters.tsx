import { Search, X } from "lucide-react";

import type { AuditFilters as AuditFiltersType } from "../types/audit.types";

import { auditActions, auditEntities } from "../utils/audit.utils";

interface AuditFiltersProps {
  filters: AuditFiltersType;
  onChange: (filters: AuditFiltersType) => void;
  onReset: () => void;
}

export default function AuditFilters({
  filters,
  onChange,
  onReset,
}: AuditFiltersProps) {
  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <label
            htmlFor="audit-search"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Search audit logs
          </label>

          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              id="audit-search"
              type="text"
              value={filters.search ?? ""}
              onChange={(event) =>
                onChange({
                  ...filters,
                  search: event.target.value,
                  page: 1,
                })
              }
              placeholder="Search descriptions, users..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="audit-action"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Action
          </label>

          <select
            id="audit-action"
            value={filters.action ?? ""}
            onChange={(event) =>
              onChange({
                ...filters,
                action: event.target.value,
                page: 1,
              })
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="">All actions</option>

            {auditActions.map((action) => (
              <option key={action.value} value={action.value}>
                {action.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="audit-entity"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Entity
          </label>

          <select
            id="audit-entity"
            value={filters.entity_type ?? ""}
            onChange={(event) =>
              onChange({
                ...filters,
                entity_type: event.target.value,
                page: 1,
              })
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="">All entities</option>

            {auditEntities.map((entity) => (
              <option key={entity.value} value={entity.value}>
                {entity.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="audit-start-date"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Start date
          </label>

          <input
            id="audit-start-date"
            type="date"
            value={filters.start_date ?? ""}
            max={filters.end_date || undefined}
            onChange={(event) =>
              onChange({
                ...filters,
                start_date: event.target.value,
                page: 1,
              })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="audit-end-date"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            End date
          </label>

          <input
            id="audit-end-date"
            type="date"
            value={filters.end_date ?? ""}
            min={filters.start_date || undefined}
            onChange={(event) =>
              onChange({
                ...filters,
                end_date: event.target.value,
                page: 1,
              })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <X size={16} />
            Clear filters
          </button>
        </div>
      </div>
    </div>
  );
}
