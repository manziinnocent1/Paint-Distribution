import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, History, Warehouse } from "lucide-react";

import { Button } from "@/components/ui/button";

import { InventoryStats, StockFilters, StockTable } from "../components";

import { useInventory, useInventoryStats } from "../hooks/useInventory";
import { useWarehouses } from "../hooks/useWarehouses";

import { DEFAULT_STOCK_FILTERS } from "../constants/inventory.constants";
import type { StockFilters as StockFiltersType } from "../types/inventory.types";

export function InventoryPage() {
  const [filters, setFilters] = useState<StockFiltersType>(
    DEFAULT_STOCK_FILTERS,
  );

  const { data, isLoading, error } = useInventory(filters);
  const { data: stats, isLoading: statsLoading } = useInventoryStats();
  const { data: warehouses = [] } = useWarehouses();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor stock levels, quantities, and warehouse inventory.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link to="/inventory/movements">
              <History className="mr-2 h-4 w-4" />
              Movements
            </Link>
          </Button>

          <Button variant="outline" asChild>
            <Link to="/inventory/warehouses">
              <Warehouse className="mr-2 h-4 w-4" />
              Warehouses
            </Link>
          </Button>

          <Button asChild>
            <Link to="/inventory/adjustment">
              <Plus className="mr-2 h-4 w-4" />
              Adjust stock
            </Link>
          </Button>
        </div>
      </div>

      <InventoryStats stats={stats} isLoading={statsLoading} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Stock records</h2>
          <p className="text-sm text-muted-foreground">
            Browse inventory across all warehouses.
          </p>
        </div>

        <Button variant="outline" size="sm" asChild>
          <Link to="/inventory/low-stock">View low stock</Link>
        </Button>
      </div>

      <StockFilters
        filters={filters}
        warehouses={warehouses}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_STOCK_FILTERS)}
      />

      {error ? (
        <div className="rounded-lg border border-destructive/30 p-6 text-sm text-destructive">
          Unable to load inventory. Please try again.
        </div>
      ) : isLoading ? (
        <div className="rounded-lg border p-10 text-center text-sm text-muted-foreground">
          Loading inventory...
        </div>
      ) : (
        <>
          <StockTable
            items={data?.results ?? []}
            ordering={filters.ordering}
            onSort={(ordering) =>
              setFilters((current) => ({ ...current, ordering }))
            }
          />

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <p>
              Showing {data?.results.length ?? 0} of {data?.count ?? 0} stock
              records
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!data || data.page <= 1}
                onClick={() =>
                  setFilters((current) => ({
                    ...current,
                    page: Math.max(1, (current.page ?? 1) - 1),
                  }))
                }
              >
                Previous
              </Button>

              <span>
                Page {data?.page ?? 1} of {data?.totalPages ?? 1}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={!data || data.page >= data.totalPages}
                onClick={() =>
                  setFilters((current) => ({
                    ...current,
                    page: (current.page ?? 1) + 1,
                  }))
                }
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
