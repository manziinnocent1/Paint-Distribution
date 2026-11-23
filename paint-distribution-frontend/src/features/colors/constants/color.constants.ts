
import type { FormulaUnit, SelectOption } from "../types/color.types";

export const COLOR_QUERY_KEYS = {
  all: ["colors"] as const,
  lists: () => [...COLOR_QUERY_KEYS.all, "list"] as const,
  list: (filters: object) =>
    [...COLOR_QUERY_KEYS.lists(), filters] as const,
  details: () => [...COLOR_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) =>
    [...COLOR_QUERY_KEYS.details(), id] as const,
};

export const COLOR_FAMILY_QUERY_KEYS = {
  all: ["color-families"] as const,
  lists: () => [...COLOR_FAMILY_QUERY_KEYS.all, "list"] as const,
  list: (filters: object) =>
    [...COLOR_FAMILY_QUERY_KEYS.lists(), filters] as const,
  detail: (id: string) =>
    [...COLOR_FAMILY_QUERY_KEYS.all, "detail", id] as const,
};

export const COLOR_FORMULA_QUERY_KEYS = {
  all: ["color-formulas"] as const,
  lists: () => [...COLOR_FORMULA_QUERY_KEYS.all, "list"] as const,
  list: (filters: object) =>
    [...COLOR_FORMULA_QUERY_KEYS.lists(), filters] as const,
  detail: (id: string) =>
    [...COLOR_FORMULA_QUERY_KEYS.all, "detail", id] as const,
};

export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
};

export const COLOR_STATUS_OPTIONS: SelectOption[] = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Archived", value: "archived" },
];

export const FORMULA_UNIT_OPTIONS: {
  label: string;
  value: FormulaUnit;
}[] = [
  { label: "Milliliters (ml)", value: "ml" },
  { label: "Grams (g)", value: "g" },
  { label: "Kilograms (kg)", value: "kg" },
  { label: "Liters (l)", value: "l" },
];

export const COLOR_SORT_OPTIONS: SelectOption[] = [
  { label: "Name (A-Z)", value: "name" },
  { label: "Name (Z-A)", value: "-name" },
  { label: "Recently created", value: "-created_at" },
  { label: "Oldest first", value: "created_at" },
];

export const COLOR_FORMATS = {
  HEX: "HEX",
  RGB: "RGB",
} as const;

export const DEFAULT_COLOR = "#6366F1";

export const COLOR_HEX_PATTERN = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

export const COLOR_RGB_PATTERN =
  /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;

export const COLOR_MESSAGES = {
  CREATED: "Color created successfully.",
  UPDATED: "Color updated successfully.",
  DELETED: "Color deleted successfully.",
  FAMILY_CREATED: "Color family created successfully.",
  FAMILY_UPDATED: "Color family updated successfully.",
  FAMILY_DELETED: "Color family deleted successfully.",
  FORMULA_CREATED: "Color formula created successfully.",
  FORMULA_UPDATED: "Color formula updated successfully.",
  FORMULA_DELETED: "Color formula deleted successfully.",
};
