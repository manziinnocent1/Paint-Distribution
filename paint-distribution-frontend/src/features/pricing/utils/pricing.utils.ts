import type {
  PriceStatus,
  PriceType,
  PricingRuleType,
} from "../types/pricing.types";

export function formatPrice(
  amount: number,
  currency = "RWF",
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "RWF" ? 0 : 2,
  }).format(amount);
}

export function formatPricingDate(date?: string): string {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(date));
}

export function calculateDiscountPercentage(
  basePrice: number,
  sellingPrice: number,
): number {
  if (basePrice <= 0 || sellingPrice >= basePrice) return 0;

  return Number(
    (((basePrice - sellingPrice) / basePrice) * 100).toFixed(2),
  );
}

export function calculateAdjustedPrice(
  basePrice: number,
  adjustmentType: "percentage" | "fixed",
  adjustmentValue: number,
  direction: "increase" | "decrease" = "decrease",
): number {
  const adjustment =
    adjustmentType === "percentage"
      ? basePrice * (adjustmentValue / 100)
      : adjustmentValue;

  const result =
    direction === "increase"
      ? basePrice + adjustment
      : basePrice - adjustment;

  return Math.max(0, Number(result.toFixed(2)));
}

export function getPriceStatus(
  effectiveFrom: string,
  effectiveTo?: string,
): PriceStatus {
  const now = new Date();
  const start = new Date(effectiveFrom);
  const end = effectiveTo ? new Date(effectiveTo) : undefined;

  if (start > now) return "scheduled";
  if (end && end < now) return "expired";

  return "active";
}

export function getPriceTypeLabel(type: PriceType): string {
  const labels: Record<PriceType, string> = {
    retail: "Retail",
    wholesale: "Wholesale",
    promotional: "Promotional",
    custom: "Custom",
  };

  return labels[type];
}

export function getPricingRuleLabel(
  type: PricingRuleType,
): string {
  const labels: Record<PricingRuleType, string> = {
    percentage_discount: "Percentage discount",
    fixed_discount: "Fixed discount",
    percentage_markup: "Percentage markup",
    fixed_markup: "Fixed markup",
  };

  return labels[type];
}