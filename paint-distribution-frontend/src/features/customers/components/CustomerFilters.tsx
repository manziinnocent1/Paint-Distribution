import { Search, X } from "lucide-react";

import type { CustomerFilters as CustomerFilterValues } from "../types/customer.types";

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
  CUSTOMER_DEFAULT_FILTERS,
  CUSTOMER_SORT_OPTIONS,
} from "../constants/customer.constants";

interface CustomerFiltersProps {
  filters: CustomerFilterValues;
  onChange: (filters: CustomerFilterValues) => void;
}

export function CustomerFilters({ filters, onChange }: CustomerFiltersProps) {
  const update = (values: Partial<CustomerFilterValues>) => {
    onChange({
      ...filters,
      ...values,
      page: 1,
    });
  };

  const reset = () => {
    onChange({
      ...CUSTOMER_DEFAULT_FILTERS,
      page_size: filters.page_size ?? 10,
    });
  };

  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <div className="relative min-w-0 flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search ?? ""}
          onChange={(event) => update({ search: event.target.value })}
          placeholder="Search by customer name, number or phone..."
          className="pl-9"
        />
      </div>

      <Select
        value={filters.customer_type || "ALL"}
        onValueChange={(value) =>
          update({
            customer_type:
              value === "ALL"
                ? ""
                : (value as CustomerFilterValues["customer_type"]),
          })
        }
      >
        <SelectTrigger className="w-full lg:w-40">
          <SelectValue placeholder="Customer type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All types</SelectItem>
          <SelectItem value="INDIVIDUAL">Individual</SelectItem>
          <SelectItem value="BUSINESS">Business</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.status || "ALL"}
        onValueChange={(value) =>
          update({
            status:
              value === "ALL" ? "" : (value as CustomerFilterValues["status"]),
          })
        }
      >
        <SelectTrigger className="w-full lg:w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All statuses</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="INACTIVE">Inactive</SelectItem>
          <SelectItem value="SUSPENDED">Suspended</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.ordering || "-created_at"}
        onValueChange={(value) => update({ ordering: value })}
      >
        <SelectTrigger className="w-full lg:w-44">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {CUSTOMER_SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={reset}>
        <X className="mr-2 h-4 w-4" />
        Reset
      </Button>
    </div>
  );
}
