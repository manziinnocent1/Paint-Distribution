import { RotateCcw, Search } from "lucide-react";

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
  NOTIFICATION_CATEGORY_OPTIONS,
  NOTIFICATION_PRIORITY_OPTIONS,
  NOTIFICATION_STATUS_OPTIONS,
} from "../constants/notification.constants";

import type { NotificationFilters as Filters } from "../types/notification.types";

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
}

export function NotificationFilters({ filters, onChange, onReset }: Props) {
  return (
    <div className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-2 xl:grid-cols-5">
      <div className="relative xl:col-span-2">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={filters.search ?? ""}
          onChange={(event) =>
            onChange({
              ...filters,
              search: event.target.value,
              page: 1,
            })
          }
          placeholder="Search notifications..."
          className="pl-9"
        />
      </div>

      <Select
        value={filters.category ?? "all"}
        onValueChange={(value) =>
          onChange({
            ...filters,
            category: value as Filters["category"],
            page: 1,
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Category" />
        </SelectTrigger>

        <SelectContent>
          {NOTIFICATION_CATEGORY_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.priority ?? "all"}
        onValueChange={(value) =>
          onChange({
            ...filters,
            priority: value as Filters["priority"],
            page: 1,
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Priority" />
        </SelectTrigger>

        <SelectContent>
          {NOTIFICATION_PRIORITY_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Select
          value={filters.status ?? "all"}
          onValueChange={(value) =>
            onChange({
              ...filters,
              status: value as Filters["status"],
              page: 1,
            })
          }
        >
          <SelectTrigger className="min-w-0 flex-1">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            {NOTIFICATION_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          aria-label="Reset filters"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2 md:col-span-2 xl:col-span-5">
        <div className="flex-1">
          <label className="mb-1 block text-xs text-muted-foreground">
            From
          </label>
          <Input
            type="date"
            value={filters.startDate ?? ""}
            onChange={(event) =>
              onChange({
                ...filters,
                startDate: event.target.value,
                page: 1,
              })
            }
          />
        </div>

        <div className="flex-1">
          <label className="mb-1 block text-xs text-muted-foreground">To</label>
          <Input
            type="date"
            value={filters.endDate ?? ""}
            onChange={(event) =>
              onChange({
                ...filters,
                endDate: event.target.value,
                page: 1,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
