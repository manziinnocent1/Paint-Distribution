import type {
  GoodsReceiptStatus,
  ProcurementPriority,
  ProcurementStatus,
  PurchaseOrderStatus,
} from "../types/procurement.types";

export const PROCUREMENT_STATUSES: {
  value: ProcurementStatus;
  label: string;
}[] = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending approval" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "ordered", label: "Ordered" },
  { value: "partially_received", label: "Partially received" },
  { value: "received", label: "Received" },
  { value: "cancelled", label: "Cancelled" },
];

export const PROCUREMENT_PRIORITIES: {
  value: ProcurementPriority;
  label: string;
}[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export const PURCHASE_ORDER_STATUSES: {
  value: PurchaseOrderStatus;
  label: string;
}[] = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "sent", label: "Sent to supplier" },
  { value: "partially_received", label: "Partially received" },
  { value: "received", label: "Received" },
  { value: "cancelled", label: "Cancelled" },
];

export const GOODS_RECEIPT_STATUSES: {
  value: GoodsReceiptStatus;
  label: string;
}[] = [
  { value: "pending", label: "Pending inspection" },
  { value: "inspected", label: "Inspected" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

export const PROCUREMENT_DEPARTMENTS = [
  "Operations",
  "Inventory",
  "Sales",
  "Finance",
  "Administration",
  "Warehouse",
];

export const DEFAULT_PROCUREMENT_TAX_RATE = 0.18;
export const PROCUREMENT_CURRENCY = "RWF";
export const PROCUREMENT_PAGE_SIZE = 10;