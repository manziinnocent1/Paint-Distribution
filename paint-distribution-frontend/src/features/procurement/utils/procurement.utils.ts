import type {
  ProcurementItem,
  ProcurementRequest,
  PurchaseOrder,
  PurchaseOrderItem,
} from "../types/procurement.types";

export function formatProcurementCurrency(
  amount: number,
  currency = "RWF",
): string {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export function calculateRequestTotal(items: ProcurementItem[]): number {
  return items.reduce(
    (total, item) => total + item.quantity * item.estimatedUnitPrice,
    0,
  );
}

export function calculateOrderSubtotal(items: PurchaseOrderItem[]): number {
  return items.reduce(
    (total, item) => total + item.quantity * item.unitPrice,
    0,
  );
}

export function calculateOrderTotal(
  items: PurchaseOrderItem[],
  tax: number,
): number {
  return calculateOrderSubtotal(items) + tax;
}

export function getProcurementItemCount(
  request: ProcurementRequest,
): number {
  return request.items.reduce((total, item) => total + item.quantity, 0);
}

export function getPurchaseOrderReceivedQuantity(
  order: PurchaseOrder,
): number {
  return order.items.reduce(
    (total, item) => total + item.receivedQuantity,
    0,
  );
}

export function getPurchaseOrderRemainingQuantity(
  order: PurchaseOrder,
): number {
  return order.items.reduce(
    (total, item) =>
      total + Math.max(item.quantity - item.receivedQuantity, 0),
    0,
  );
}

export function isProcurementOverdue(
  request: ProcurementRequest,
): boolean {
  if (["received", "cancelled", "rejected"].includes(request.status)) {
    return false;
  }

  return new Date(request.requiredDate).getTime() < Date.now();
}

export function getProcurementStatusLabel(status: string): string {
  return status.replaceAll("_", " ").replace(/\b\w/g, (char) =>
    char.toUpperCase(),
  );
}

export function getProcurementInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}