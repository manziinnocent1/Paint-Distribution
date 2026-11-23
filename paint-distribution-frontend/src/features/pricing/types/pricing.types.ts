export type PriceType =
  | "retail"
  | "wholesale"
  | "promotional"
  | "custom";

export type PriceStatus = "active" | "scheduled" | "expired" | "inactive";

export type PricingRuleType =
  | "percentage_discount"
  | "fixed_discount"
  | "percentage_markup"
  | "fixed_markup";

export interface ProductPrice {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  variantId?: string;
  variantName?: string;
  priceListId?: string;
  priceListName?: string;
  priceType: PriceType;
  status: PriceStatus;
  currency: string;
  basePrice: number;
  sellingPrice: number;
  minimumPrice?: number;
  maximumPrice?: number;
  discountPercentage?: number;
  effectiveFrom: string;
  effectiveTo?: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
}

export interface PriceList {
  id: string;
  name: string;
  code: string;
  description?: string;
  priceType: PriceType;
  currency: string;
  customerGroup?: string;
  isDefault: boolean;
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PricingRule {
  id: string;
  name: string;
  description?: string;
  type: PricingRuleType;
  value: number;
  productId?: string;
  categoryId?: string;
  priceListId?: string;
  minimumQuantity?: number;
  maximumDiscount?: number;
  startsAt: string;
  endsAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PriceHistory {
  id: string;
  priceId: string;
  previousPrice: number;
  newPrice: number;
  currency: string;
  reason: string;
  changedBy: string;
  changedAt: string;
}

export interface PricingFilters {
  search?: string;
  priceType?: PriceType | "all";
  status?: PriceStatus | "all";
  priceListId?: string;
  currency?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface PricingStats {
  totalPrices: number;
  activePrices: number;
  scheduledPrices: number;
  expiredPrices: number;
  averageSellingPrice: number;
  totalDiscounts: number;
}

export interface CreatePriceInput {
  productId: string;
  productName: string;
  productSku: string;
  variantId?: string;
  variantName?: string;
  priceListId?: string;
  priceListName?: string;
  priceType: PriceType;
  currency: string;
  basePrice: number;
  sellingPrice: number;
  minimumPrice?: number;
  maximumPrice?: number;
  effectiveFrom: string;
  effectiveTo?: string;
  description?: string;
}

export interface UpdatePriceInput extends Partial<CreatePriceInput> {
  status?: PriceStatus;
}

export interface CreatePriceListInput {
  name: string;
  code: string;
  description?: string;
  priceType: PriceType;
  currency: string;
  customerGroup?: string;
  isDefault: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface CreatePricingRuleInput {
  name: string;
  description?: string;
  type: PricingRuleType;
  value: number;
  productId?: string;
  categoryId?: string;
  priceListId?: string;
  minimumQuantity?: number;
  maximumDiscount?: number;
  startsAt: string;
  endsAt?: string;
}

export interface PriceAdjustmentInput {
  adjustmentType: "percentage" | "fixed";
  adjustmentValue: number;
  reason: string;
}

export interface PricingListResponse {
  results: ProductPrice[];
  count: number;
  page: number;
  pageSize: number;
}