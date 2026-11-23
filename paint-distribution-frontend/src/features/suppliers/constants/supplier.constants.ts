import type {
  SupplierStatus,
  SupplierType,
} from "../types/supplier.types";

export const SUPPLIERS_QUERY_KEYS = {
  all: ["suppliers"] as const,
  lists: () => [...SUPPLIERS_QUERY_KEYS.all, "list"] as const,
  list: (filters: unknown, page: number, pageSize: number) =>
    [...SUPPLIERS_QUERY_KEYS.lists(), filters, page, pageSize] as const,
  details: () => [...SUPPLIERS_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) =>
    [...SUPPLIERS_QUERY_KEYS.details(), id] as const,
  stats: () => [...SUPPLIERS_QUERY_KEYS.all, "stats"] as const,
  timeline: (id: string) =>
    [...SUPPLIERS_QUERY_KEYS.all, "timeline", id] as const,
};

export const SUPPLIER_STATUSES: {
  value: SupplierStatus;
  label: string;
}[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
];

export const SUPPLIER_TYPES: {
  value: SupplierType;
  label: string;
}[] = [
  { value: "manufacturer", label: "Manufacturer" },
  { value: "distributor", label: "Distributor" },
  { value: "wholesaler", label: "Wholesaler" },
  { value: "retailer", label: "Retailer" },
  { value: "other", label: "Other" },
];

export const SUPPLIER_CURRENCIES = [
  { value: "RWF", label: "Rwandan Franc (RWF)" },
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "KES", label: "Kenyan Shilling (KES)" },
  { value: "UGX", label: "Ugandan Shilling (UGX)" },
  { value: "TZS", label: "Tanzanian Shilling (TZS)" },
];

export const DEFAULT_SUPPLIER_CURRENCY = "RWF";

export const DEFAULT_SUPPLIERS_PAGE_SIZE = 10;

export const SUPPLIER_PAYMENT_TERMS = [
  "Cash on delivery",
  "7 days",
  "15 days",
  "30 days",
  "45 days",
  "60 days",
  "Custom agreement",
];