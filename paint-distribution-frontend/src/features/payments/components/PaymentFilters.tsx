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
  PAYMENT_METHODS,
  PAYMENT_PROVIDERS,
  PAYMENT_STATUSES,
} from "../constants/payment.constants";
import type { PaymentFilters as Filters } from "../types/payment.types";

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function PaymentFilters({ filters, onChange }: Props) {
  const update = (key: keyof Filters, value: string) => {
    onChange({
      ...filters,
      [key]: value === "all" ? "all" : value,
    });
  };

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          value={filters.search ?? ""}
          onChange={(event) => update("search", event.target.value)}
          placeholder="Search payment, customer or reference..."
          className="pl-9"
        />
      </div>

      <Select
        value={filters.status ?? "all"}
        onValueChange={(value) => update("status", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {PAYMENT_STATUSES.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.method ?? "all"}
        onValueChange={(value) => update("method", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="All methods" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All methods</SelectItem>
          {PAYMENT_METHODS.map((method) => (
            <SelectItem key={method.value} value={method.value}>
              {method.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.provider ?? "all"}
        onValueChange={(value) => update("provider", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="All providers" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All providers</SelectItem>
          {PAYMENT_PROVIDERS.map((provider) => (
            <SelectItem key={provider.value} value={provider.value}>
              {provider.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
