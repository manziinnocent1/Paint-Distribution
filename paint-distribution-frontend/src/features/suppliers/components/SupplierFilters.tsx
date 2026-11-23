import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  SUPPLIER_STATUSES,
  SUPPLIER_TYPES,
} from "../constants/supplier.constants";

import type { SupplierFilters as SupplierFiltersType } from "../types/supplier.types";

interface SupplierFiltersProps {
  filters: SupplierFiltersType;
  onChange: (filters: SupplierFiltersType) => void;
}

export function SupplierFilters({ filters, onChange }: SupplierFiltersProps) {
  const update = (key: keyof SupplierFiltersType, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const clear = () => onChange({});

  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search suppliers by name, code, email or phone..."
          value={filters.search ?? ""}
          onChange={(event) => update("search", event.target.value)}
        />
      </div>

      <Select
        value={filters.status || "all"}
        onValueChange={(value) =>
          update("status", value === "all" ? "" : value)
        }
      >
        <SelectTrigger className="w-full lg:w-44">
          <SelectValue placeholder="Supplier status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {SUPPLIER_STATUSES.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.type || "all"}
        onValueChange={(value) => update("type", value === "all" ? "" : value)}
      >
        <SelectTrigger className="w-full lg:w-44">
          <SelectValue placeholder="Supplier type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          {SUPPLIER_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={clear}>
        <X className="mr-2 h-4 w-4" />
        Clear
      </Button>
    </div>
  );
}
