import { Search, X } from "lucide-react";

import type {
  Brand,
  Category,
  ProductFilters as ProductFiltersType,
} from "../types/catalog.types";

interface ProductFiltersProps {
  filters: ProductFiltersType;
  categories: Category[];
  brands: Brand[];
  onChange: (filters: ProductFiltersType) => void;
  onReset: () => void;
}

export default function ProductFilters({
  filters,
  categories,
  brands,
  onChange,
  onReset,
}: ProductFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-2 xl:grid-cols-4">
      <div>
        <label
          htmlFor="product-search"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Search products
        </label>

        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            id="product-search"
            value={filters.search ?? ""}
            onChange={(event) =>
              onChange({
                ...filters,
                search: event.target.value,
                page: 1,
              })
            }
            placeholder="Name or SKU..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="product-category"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Category
        </label>

        <select
          id="product-category"
          value={filters.category ?? ""}
          onChange={(event) =>
            onChange({
              ...filters,
              category: event.target.value,
              page: 1,
            })
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="product-brand"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Brand
        </label>

        <select
          id="product-brand"
          value={filters.brand ?? ""}
          onChange={(event) =>
            onChange({
              ...filters,
              brand: event.target.value,
              page: 1,
            })
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
        >
          <option value="">All brands</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="product-status"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Status
        </label>

        <div className="flex gap-2">
          <select
            id="product-status"
            value={filters.is_active === "" ? "" : String(filters.is_active)}
            onChange={(event) =>
              onChange({
                ...filters,
                is_active:
                  event.target.value === ""
                    ? ""
                    : event.target.value === "true",
                page: 1,
              })
            }
            className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="">All statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <button
            type="button"
            onClick={onReset}
            aria-label="Clear product filters"
            title="Clear filters"
            className="rounded-lg border border-gray-300 px-3 text-gray-600 hover:bg-gray-50"
          >
            <X size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
