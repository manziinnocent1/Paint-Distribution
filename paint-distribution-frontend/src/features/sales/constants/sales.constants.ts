import type {
  SalePaymentMethod,
  SalePaymentStatus,
  SaleStatus,
} from "../types/sales.types";

export const SALE_STATUSES: {
  value: SaleStatus;
  label: string;
}[] = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export const SALE_PAYMENT_STATUSES: {
  value: SalePaymentStatus;
  label: string;
}[] = [
  { value: "unpaid", label: "Unpaid" },
  { value: "partially_paid", label: "Partially paid" },
  { value: "paid", label: "Paid" },
  { value: "refunded", label: "Refunded" },
];

export const SALE_PAYMENT_METHODS: {
  value: SalePaymentMethod;
  label: string;
}[] = [
  { value: "cash", label: "Cash" },
  { value: "mobile_money", label: "Mobile money" },
  { value: "card", label: "Card" },
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "credit", label: "Credit" },
];

export const DEFAULT_SALE_CURRENCY = "RWF";
export const DEFAULT_SALE_TAX_PERCENTAGE = 18;
export const DEFAULT_SALE_DISCOUNT_PERCENTAGE = 0;

export const SALES_QUERY_KEYS = {
  all: ["sales"] as const,
  lists: () => [...SALES_QUERY_KEYS.all, "list"] as const,
  list: (filters: unknown, page: number, pageSize: number) =>
    [...SALES_QUERY_KEYS.lists(), filters, page, pageSize] as const,
  details: () => [...SALES_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...SALES_QUERY_KEYS.details(), id] as const,
  stats: () => [...SALES_QUERY_KEYS.all, "stats"] as const,
  timeline: (id: string) => [...SALES_QUERY_KEYS.all, "timeline", id] as const,
};