import type {
  MovementType,
  StockItem,
  StockStatus,
} from "../types/inventory.types";

export function getStockStatus(
  quantity: number,
  minimumQuantity: number,
): StockStatus {
  if (quantity <= 0) return "out_of_stock";

  if (quantity <= minimumQuantity) {
    return "low_stock";
  }

  return "in_stock";
}

export function getAvailableQuantity(stock: StockItem): number {
  return Math.max(0, stock.quantity - stock.reservedQuantity);
}

export function calculateStockValue(stock: StockItem): number {
  return stock.quantity * stock.unitCost;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatQuantity(
  quantity: number,
  unit = "units",
): string {
  return `${new Intl.NumberFormat().format(quantity)} ${unit}`;
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-RW", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function getMovementLabel(type: MovementType): string {
  const labels: Record<MovementType, string> = {
    stock_in: "Stock in",
    stock_out: "Stock out",
    adjustment: "Adjustment",
    transfer: "Transfer",
  };

  return labels[type];
}

export function getStockStatusLabel(status: StockStatus): string {
  const labels: Record<StockStatus, string> = {
    in_stock: "In stock",
    low_stock: "Low stock",
    out_of_stock: "Out of stock",
  };

  return labels[status];
}