import { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, List, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  SupplierStats,
  SupplierFilters,
  SupplierTable,
  SupplierCard,
  SupplierEmptyState,
} from "../components";

import { useSuppliers } from "../hooks/useSuppliers";
import { useSupplierMutations } from "../hooks/useSupplierMutations";

import type {
  Supplier,
  SupplierFilters as SupplierFiltersType,
} from "../types/supplier.types";

import { DEFAULT_SUPPLIERS_PAGE_SIZE } from "../constants/supplier.constants";

export function SuppliersPage() {
  const [filters, setFilters] = useState<SupplierFiltersType>({});
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"table" | "grid">("table");

  const { data, isLoading, isError, refetch } = useSuppliers(
    filters,
    page,
    DEFAULT_SUPPLIERS_PAGE_SIZE,
  );

  const { deleteSupplier } = useSupplierMutations();

  const handleDelete = (supplier: Supplier) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${supplier.name}?`,
    );

    if (confirmed) {
      deleteSupplier.mutate(supplier.id);
    }
  };

  const updateFilters = (next: SupplierFiltersType) => {
    setFilters(next);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-sm text-muted-foreground">
            Manage supplier records, contacts, products and payment information.
          </p>
        </div>

        <Button asChild>
          <Link to="/suppliers/new">
            <Plus className="mr-2 h-4 w-4" />
            Add supplier
          </Link>
        </Button>
      </div>

      <SupplierStats />

      <SupplierFilters filters={filters} onChange={updateFilters} />

      <div className="flex justify-end gap-2">
        <Button
          variant={view === "table" ? "default" : "outline"}
          size="icon"
          aria-label="Table view"
          onClick={() => setView("table")}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant={view === "grid" ? "default" : "outline"}
          size="icon"
          aria-label="Grid view"
          onClick={() => setView("grid")}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-muted-foreground">
          Loading suppliers...
        </div>
      ) : isError ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="font-medium">Unable to load suppliers.</p>
          <Button className="mt-3" variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : !data?.results.length ? (
        <SupplierEmptyState
          onCreate={() => {
            window.location.href = "/suppliers/new";
          }}
        />
      ) : view === "table" ? (
        <SupplierTable suppliers={data.results} onDelete={handleDelete} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.results.map((supplier) => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {data.page} of {data.totalPages} · {data.count} suppliers
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              disabled={page >= data.totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
