import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SALE_PAYMENT_STATUSES,
  SALE_STATUSES,
} from "../constants/sales.constants";
import type { SalesFilters as Filters } from "../types/sales.types";

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

export function SalesFilters({ filters, onChange }: Props) {
  const update = (key: keyof Filters, value: string) => {
    onChange({
      ...filters,
      [key]: value === "all" ? "" : value,
    });
  };

  const clear = () => onChange({});

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search sale number or customer..."
          value={filters.search ?? ""}
          onChange={(event) => update("search", event.target.value)}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          value={filters.status || "all"}
          onValueChange={(value) => update("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sale status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sale statuses</SelectItem>
            {SALE_STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.paymentStatus || "all"}
          onValueChange={(value) => update("paymentStatus", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Payment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All payment statuses</SelectItem>
            {SALE_PAYMENT_STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="date"
          aria-label="Start date"
          value={filters.dateFrom ?? ""}
          onChange={(event) => update("dateFrom", event.target.value)}
        />

        <Input
          type="date"
          aria-label="End date"
          value={filters.dateTo ?? ""}
          min={filters.dateFrom || undefined}
          onChange={(event) => update("dateTo", event.target.value)}
        />
      </div>

      {hasFilters && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={clear}>
            <X className="mr-2 h-4 w-4" />
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
