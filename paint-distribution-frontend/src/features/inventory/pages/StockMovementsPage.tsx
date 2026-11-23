import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { StockMovementTable } from "../components";
import { useStockMovements } from "../hooks/useStockMovements";
import { useWarehouses } from "../hooks/useWarehouses";

import { MOVEMENT_TYPE_OPTIONS } from "../constants/inventory.constants";
import type { StockMovementFilters } from "../types/inventory.types";

export function StockMovementsPage() {
  const [filters, setFilters] = useState<StockMovementFilters>({
    search: "",
    movementType: "all",
    warehouseId: "",
    page: 1,
    pageSize: 10,
  });

  const { data, isLoading, error } = useStockMovements(filters);
  const { data: warehouses = [] } = useWarehouses();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/inventory">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-bold">Stock movements</h1>
          <p className="text-sm text-muted-foreground">
            Track incoming stock, outgoing stock, and adjustments.
          </p>
        </div>
      </div>

      <div className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-2 xl:grid-cols-4">
        <Input
          placeholder="Search product or reference..."
          value={filters.search ?? ""}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              search: event.target.value,
              page: 1,
            }))
          }
        />

        <Select
          value={filters.movementType ?? "all"}
          onValueChange={(value) =>
            setFilters((current) => ({
              ...current,
              movementType: value as StockMovementFilters["movementType"],
              page: 1,
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Movement type" />
          </SelectTrigger>

          <SelectContent>
            {MOVEMENT_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.warehouseId || "all"}
          onValueChange={(value) =>
            setFilters((current) => ({
              ...current,
              warehouseId: value === "all" ? "" : value,
              page: 1,
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Warehouse" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All warehouses</SelectItem>
            {warehouses.map((warehouse) => (
              <SelectItem key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Input
            type="date"
            aria-label="Start date"
            value={filters.startDate ?? ""}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                startDate: event.target.value,
                page: 1,
              }))
            }
          />

          <Input
            type="date"
            aria-label="End date"
            value={filters.endDate ?? ""}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                endDate: event.target.value,
                page: 1,
              }))
            }
          />
        </div>
      </div>

      {error ? (
        <p className="rounded-lg border p-6 text-sm text-destructive">
          Unable to load stock movements.
        </p>
      ) : isLoading ? (
        <p className="rounded-lg border p-8 text-center text-muted-foreground">
          Loading stock movements...
        </p>
      ) : (
        <>
          <StockMovementTable movements={data?.results ?? []} />

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{data?.count ?? 0} movement records</span>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={!data || data.page <= 1}
                onClick={() =>
                  setFilters((current) => ({
                    ...current,
                    page: (current.page ?? 1) - 1,
                  }))
                }
              >
                Previous
              </Button>

              <span>
                {data?.page ?? 1} / {data?.totalPages ?? 1}
              </span>

              <Button
                size="sm"
                variant="outline"
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
