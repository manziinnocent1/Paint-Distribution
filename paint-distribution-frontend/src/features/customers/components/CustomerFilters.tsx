import { Search, X } from "lucide-react";

import type {
  CustomerFilters as CustomerFilterValues,
  CustomerType,
  CustomerStatus,
} from "../types/customer.types";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { CUSTOMER_SORT_OPTIONS } from "../constants/customer.constants";

interface CustomerFiltersProps {
  filters: CustomerFilterValues;
  onChange: (filters: CustomerFilterValues) => void;
}

const DEFAULT_ORDERING = "-created_at";
const DEFAULT_PAGE_SIZE = 10;

export function CustomerFilters({ filters, onChange }: CustomerFiltersProps) {
  const update = (values: Partial<CustomerFilterValues>): void => {
    onChange({
      ...filters,
      ...values,
      page: 1,
    });
  };

  const handleCustomerTypeChange = (value: string): void => {
    const customerType: CustomerType | "" =
      value === "ALL"
        ? ""
        : value === "INDIVIDUAL" || value === "BUSINESS"
          ? value
          : (filters.customer_type ?? "");

    update({ customer_type: customerType });
  };

  const handleStatusChange = (value: string): void => {
    const status: CustomerStatus | "" =
      value === "ALL"
        ? ""
        : value === "ACTIVE" || value === "INACTIVE" || value === "SUSPENDED"
          ? value
          : (filters.status ?? "");

    update({ status });
  };

  const handleOrderingChange = (value: string): void => {
    update({ ordering: value });
  };

  const reset = (): void => {
    const resetFilters: CustomerFilterValues = {
      search: "",
      customer_type: "",
      status: "",
      city: "",
      ordering: DEFAULT_ORDERING,
      page: 1,
      page_size: filters.page_size ?? DEFAULT_PAGE_SIZE,
    };

    onChange(resetFilters);
  };

  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      {/* Search */}
      <div className="relative min-w-0 flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={filters.search ?? ""}
          onChange={(event) => update({ search: event.target.value })}
          placeholder="Search by customer name, number or phone..."
          className="pl-9"
        />
      </div>

      {/* Customer Type */}
      <Select
        value={filters.customer_type || "ALL"}
        onValueChange={handleCustomerTypeChange}
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

      {/* Status */}
      <Select
        value={filters.status || "ALL"}
        onValueChange={handleStatusChange}
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

      {/* Sorting */}
      <Select
        value={filters.ordering || DEFAULT_ORDERING}
        onValueChange={handleOrderingChange}
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

      {/* Reset */}
      <Button type="button" variant="outline" onClick={reset}>
        <X className="mr-2 h-4 w-4" />
        Reset
      </Button>
    </div>
  );
}
