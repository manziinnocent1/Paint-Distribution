import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PROCUREMENT_DEPARTMENTS,
  PROCUREMENT_PRIORITIES,
  PROCUREMENT_STATUSES,
} from "../constants/procurement.constants";
import type {
  ProcurementFilters as Filters,
  ProcurementPriority,
  ProcurementStatus,
} from "../types/procurement.types";

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function ProcurementFilters({ filters, onChange }: Props) {
  const update = (key: keyof Filters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Input
        placeholder="Search requests..."
        value={filters.search ?? ""}
        onChange={(event) => update("search", event.target.value)}
      />

      <Select
        value={filters.status || "all"}
        onValueChange={(value) =>
          update("status", value === "all" ? "" : (value as ProcurementStatus))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {PROCUREMENT_STATUSES.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.priority || "all"}
        onValueChange={(value) =>
          update(
            "priority",
            value === "all" ? "" : (value as ProcurementPriority),
          )
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="All priorities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          {PROCUREMENT_PRIORITIES.map((priority) => (
            <SelectItem key={priority.value} value={priority.value}>
              {priority.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.department || "all"}
        onValueChange={(value) =>
          update("department", value === "all" ? "" : value)
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="All departments" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All departments</SelectItem>
          {PROCUREMENT_DEPARTMENTS.map((department) => (
            <SelectItem key={department} value={department}>
              {department}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
