import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, RefreshCw } from "lucide-react";

import BrandTable from "../components/BrandTable";
import { useBrands } from "../hooks/useBrands";

import type { BrandFilters as BrandFiltersType } from "../types/catalog.types";

export default function BrandsPage() {
  const [filters, setFilters] = useState<BrandFiltersType>({
    search: "",
    is_active: "",
    page: 1,
    page_size: 10,
  });

  const { data, brands, loading, error, refresh } = useBrands(filters);

  const totalPages = Math.ceil((data?.count ?? 0) / filters.page_size);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Brands</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage paint manufacturers and brands in your catalog.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <Link
            to="/catalog/brands/create"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={17} />
            Add brand
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          value={filters.search ?? ""}
          onChange={(event) =>
            setFilters({
              ...filters,
              search: event.target.value,
              page: 1,
            })
          }
          placeholder="Search brands..."
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
        />

        <select
          value={filters.is_active === "" ? "" : String(filters.is_active)}
          onChange={(event) =>
            setFilters({
              ...filters,
              is_active:
                event.target.value === "" ? "" : event.target.value === "true",
              page: 1,
            })
          }
          className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"
        >
          <option value="">All statuses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <p className="text-sm text-gray-500">{data?.count ?? 0} brands found</p>

      <BrandTable brands={brands} loading={loading} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Page {filters.page} of {Math.max(totalPages, 1)}
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={filters.page <= 1 || loading}
            onClick={() =>
              setFilters((current) => ({
                ...current,
                page: current.page - 1,
              }))
            }
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>

          <button
            type="button"
            disabled={!data?.next || loading}
            onClick={() =>
              setFilters((current) => ({
                ...current,
                page: current.page + 1,
              }))
            }
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
