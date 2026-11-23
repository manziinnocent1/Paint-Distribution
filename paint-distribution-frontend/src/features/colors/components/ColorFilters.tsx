import { Search, X } from "lucide-react";

import type { ColorFilters as ColorFilterValues } from "../types/color.types";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useColorFamilies } from "../hooks/useColorFamilies";

interface ColorFiltersProps {
  filters: ColorFilterValues;
  onChange: (filters: ColorFilterValues) => void;
}

export function ColorFilters({ filters, onChange }: ColorFiltersProps) {
  const { data: familyData } = useColorFamilies({
    page_size: 100,
    is_active: true,
  });

  const update = (values: Partial<ColorFilterValues>) => {
    onChange({
      ...filters,
      ...values,
      page: 1,
    });
  };

  const reset = () => {
    onChange({
      search: "",
      family: "",
      is_active: undefined,
      ordering: "-created_at",
      page: 1,
      page_size: filters.page_size ?? 10,
    });
  };

  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search ?? ""}
          onChange={(event) => update({ search: event.target.value })}
          placeholder="Search colors by name, code or HEX..."
          className="pl-9"
        />
      </div>

      <Select
        value={filters.family || "__all__"}
        onValueChange={(value) =>
          update({ family: value === "__all__" ? "" : value })
        }
      >
        <SelectTrigger className="w-full lg:w-48">
          <SelectValue placeholder="All families" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">All families</SelectItem>
          {familyData?.results.map((family) => (
            <SelectItem key={family.id} value={family.id}>
              {family.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={
          filters.is_active === undefined
            ? "all"
            : filters.is_active
              ? "active"
              : "inactive"
        }
        onValueChange={(value) =>
          update({
            is_active: value === "all" ? undefined : value === "active",
          })
        }
      >
        <SelectTrigger className="w-full lg:w-36">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
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
          <SelectItem value="name">Name A-Z</SelectItem>
          <SelectItem value="-name">Name Z-A</SelectItem>
          <SelectItem value="-created_at">Newest first</SelectItem>
          <SelectItem value="created_at">Oldest first</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={reset}>
        <X className="mr-2 h-4 w-4" />
        Reset
      </Button>
    </div>
  );
}
