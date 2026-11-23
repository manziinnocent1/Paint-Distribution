import { Search, RotateCcw } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { STOCK_STATUS_OPTIONS } from "../constants/inventory.constants";
import type {
  StockFilters as StockFiltersType,
  Warehouse,
} from "../types/inventory.types";

interface Props {
  filters: StockFiltersType;
  warehouses: Warehouse[];
  onChange: (filters: StockFiltersType) => void;
  onReset: () => void;
}

export function StockFilters({
  filters,
  warehouses,
  onChange,
  onReset,
}: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 lg:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search product name or SKU..."
          value={filters.search ?? ""}
          onChange={(event) =>
            onChange({
              ...filters,
              search: event.target.value,
              page: 1,
            })
          }
          className="pl-9"
        />
      </div>

      <Select
        value={filters.status ?? "all"}
        onValueChange={(value) =>
          onChange({
            ...filters,
            status: value as StockFiltersType["status"],
            page: 1,
          })
        }
      >
        <SelectTrigger className="w-full lg:w-[180px]">
          <SelectValue placeholder="Stock status" />
        </SelectTrigger>

        <SelectContent>
          {STOCK_STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.warehouseId || "all"}
        onValueChange={(value) =>
          onChange({
            ...filters,
            warehouseId: value === "all" ? "" : value,
            page: 1,
          })
        }
      >
        <SelectTrigger className="w-full lg:w-[210px]">
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

      <Button variant="outline" onClick={onReset}>
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset
      </Button>
    </div>
  );
}
