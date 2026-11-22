import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, RefreshCw } from "lucide-react";

import ProductFilters from "../components/ProductFilters";
import ProductTable from "../components/ProductTable";

import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useBrands } from "../hooks/useBrands";

import type { ProductFilters as ProductFiltersType } from "../types/catalog.types";

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFiltersType>({
    search: "",
    category: "",
    brand: "",
    is_active: "",
    page: 1,
    page_size: 10,
    ordering: "-created_at",
  });

  const { data, products, loading, error, refresh } = useProducts(filters);

  const { allCategories, loading: categoriesLoading } = useCategories({
    page: 1,
    page_size: 100,
  });

  const { allBrands, loading: brandsLoading } = useBrands({
    page: 1,
    page_size: 100,
  });

  const totalPages = Math.ceil((data?.count ?? 0) / filters.page_size);

  const resetFilters = () => {
    setFilters({
      search: "",
      category: "",
      brand: "",
      is_active: "",
      page: 1,
      page_size: 10,
      ordering: "-created_at",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage products available in your paint distribution catalog.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <Link
            to="/catalog/products/create"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={17} />
            Add product
          </Link>
        </div>
      </div>

      <ProductFilters
        filters={filters}
        categories={allCategories}
        brands={allBrands}
        onChange={setFilters}
        onReset={resetFilters}
      />

      {(error || categoriesLoading || brandsLoading) && (
        <p className="text-sm text-red-600">
          {error ?? "Loading filter options..."}
        </p>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {loading
            ? "Loading products..."
            : `${data?.count ?? 0} products found`}
        </p>

        <select
          value={filters.page_size}
          onChange={(event) =>
            setFilters({
              ...filters,
              page_size: Number(event.target.value),
              page: 1,
            })
          }
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          aria-label="Products per page"
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
        </select>
      </div>

      <ProductTable products={products} loading={loading} />

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
            disabled={loading || !data?.next || filters.page >= totalPages}
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
