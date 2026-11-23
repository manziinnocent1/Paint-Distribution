import type {
  MovementType,
  StockStatus,
} from "../types/inventory.types";

export const STOCK_STATUS_OPTIONS: {
  label: string;
  value: StockStatus | "all";
}[] = [
  { label: "All statuses", value: "all" },
  { label: "In stock", value: "in_stock" },
  { label: "Low stock", value: "low_stock" },
  { label: "Out of stock", value: "out_of_stock" },
];

export const MOVEMENT_TYPE_OPTIONS: {
  label: string;
  value: MovementType | "all";
}[] = [
  { label: "All movements", value: "all" },
  { label: "Stock in", value: "stock_in" },
  { label: "Stock out", value: "stock_out" },
  { label: "Adjustment", value: "adjustment" },
  { label: "Transfer", value: "transfer" },
];

export const DEFAULT_STOCK_FILTERS = {
  search: "",
  status: "all" as const,
  warehouseId: "",
  category: "",
  page: 1,
  pageSize: 10,
};

export const DEFAULT_MOVEMENT_FILTERS = {
  search: "",
  movementType: "all" as const,
  warehouseId: "",
  startDate: "",
  endDate: "",
  page: 1,
  pageSize: 10,
};

export const STOCK_QUERY_KEY = ["inventory", "stock"];
export const WAREHOUSE_QUERY_KEY = ["inventory", "warehouses"];
export const MOVEMENT_QUERY_KEY = ["inventory", "movements"];
export const INVENTORY_STATS_QUERY_KEY = ["inventory", "stats"];

export const INVENTORY_ROUTES = {
  root: "/inventory",
  stock: "/inventory",
  lowStock: "/inventory/low-stock",
  movements: "/inventory/movements",
  warehouses: "/inventory/warehouses",
};