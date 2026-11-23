import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import {
  PRICE_STATUSES,
  PRICE_TYPES,
  PRICING_CURRENCIES,
} from "../constants/pricing.constants";
import type { PricingFilters as Filters } from "../types/pricing.types";

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function PricingFilters({ filters, onChange }: Props) {
  const update = (
    key: "search" | "priceType" | "status" | "currency",
    value: string,
  ) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search product, SKU or variant..."
          value={filters.search ?? ""}
          onChange={(event) => update("search", event.target.value)}
        />
      </div>

      <Select
        value={filters.priceType ?? "all"}
        onValueChange={(value) => update("priceType", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="All price types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All price types</SelectItem>
          {PRICE_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status ?? "all"}
        onValueChange={(value) => update("status", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {PRICE_STATUSES.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.currency ?? "all"}
        onValueChange={(value) =>
          update("currency", value === "all" ? "" : value)
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="All currencies" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All currencies</SelectItem>
          {PRICING_CURRENCIES.map((currency) => (
            <SelectItem key={currency.value} value={currency.value}>
              {currency.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
