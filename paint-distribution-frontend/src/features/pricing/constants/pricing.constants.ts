import type {
  PriceStatus,
  PriceType,
  PricingRuleType,
} from "../types/pricing.types";

export const PRICE_TYPES: {
  value: PriceType;
  label: string;
}[] = [
  { value: "retail", label: "Retail" },
  { value: "wholesale", label: "Wholesale" },
  { value: "promotional", label: "Promotional" },
  { value: "custom", label: "Custom" },
];

export const PRICE_STATUSES: {
  value: PriceStatus;
  label: string;
}[] = [
  { value: "active", label: "Active" },
  { value: "scheduled", label: "Scheduled" },
  { value: "expired", label: "Expired" },
  { value: "inactive", label: "Inactive" },
];

export const PRICING_RULE_TYPES: {
  value: PricingRuleType;
  label: string;
}[] = [
  { value: "percentage_discount", label: "Percentage discount" },
  { value: "fixed_discount", label: "Fixed discount" },
  { value: "percentage_markup", label: "Percentage markup" },
  { value: "fixed_markup", label: "Fixed markup" },
];

export const PRICING_CURRENCIES = [
  { value: "RWF", label: "Rwandan Franc (RWF)" },
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
];

export const PRICING_PAGE_SIZE = 10;