import type {
  Sale,
  SaleItem,
  SalePaymentStatus,
  SaleStatus,
} from "../types/sales.types";

export function calculateSaleItem(item: {
  quantity: number;
  unitPrice: number;
  discountPercentage: number;
  taxPercentage: number;
}): Pick<
  SaleItem,
  "subtotal" | "discountAmount" | "taxAmount" | "total"
> {
  const subtotal = item.quantity * item.unitPrice;
  const discountAmount = subtotal * (item.discountPercentage / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (item.taxPercentage / 100);

  return {
    subtotal,
    discountAmount,
    taxAmount,
    total: taxableAmount + taxAmount,
  };
}

export function calculateSaleTotals(items: SaleItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const discountAmount = items.reduce(
    (sum, item) => sum + item.discountAmount,
    0,
  );
  const taxAmount = items.reduce((sum, item) => sum + item.taxAmount, 0);
  const total = items.reduce((sum, item) => sum + item.total, 0);

  return {
    subtotal,
    discountAmount,
    taxAmount,
    total,
  };
}

export function getPaymentStatus(
  total: number,
  amountPaid: number,
): SalePaymentStatus {
  if (amountPaid <= 0) return "unpaid";
  if (amountPaid >= total) return "paid";
  return "partially_paid";
}

export function getSaleBalance(total: number, amountPaid: number): number {
  return Math.max(0, total - amountPaid);
}

export function formatSaleCurrency(
  amount: number,
  currency = "RWF",
): string {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "RWF" ? 0 : 2,
  }).format(amount);
}

export function formatSaleDate(date: string): string {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-RW", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function getSaleStatusLabel(status: SaleStatus): string {
  const labels: Record<SaleStatus, string> = {
    draft: "Draft",
    pending: "Pending",
    confirmed: "Confirmed",
    processing: "Processing",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return labels[status];
}

export function getSalePaymentStatusLabel(
  status: SalePaymentStatus,
): string {
  const labels: Record<SalePaymentStatus, string> = {
    unpaid: "Unpaid",
    partially_paid: "Partially paid",
    paid: "Paid",
    refunded: "Refunded",
  };

  return labels[status];
}

export function canEditSale(sale: Sale): boolean {
  return ["draft", "pending"].includes(sale.status);
}

export function canCancelSale(sale: Sale): boolean {
  return !["completed", "cancelled"].includes(sale.status);
}

export function getSaleItemCount(sale: Sale): number {
  return sale.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getSalesRevenue(sales: Sale[]): number {
  return sales
    .filter((sale) => sale.status === "completed")
    .reduce((sum, sale) => sum + sale.total, 0);
}