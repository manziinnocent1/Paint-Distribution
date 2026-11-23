import { useQuery } from "@tanstack/react-query";
import { pricingService } from "../services/pricingService";
import type { PricingFilters } from "../types/pricing.types";

export const pricingKeys = {
  all: ["pricing"] as const,
  lists: () => [...pricingKeys.all, "list"] as const,
  list: (filters: PricingFilters, page: number, pageSize: number) =>
    [...pricingKeys.lists(), filters, page, pageSize] as const,
  details: () => [...pricingKeys.all, "detail"] as const,
  detail: (id: string) => [...pricingKeys.details(), id] as const,
  stats: () => [...pricingKeys.all, "stats"] as const,
  history: (id: string) => [...pricingKeys.all, "history", id] as const,
  priceLists: () => [...pricingKeys.all, "price-lists"] as const,
  rules: () => [...pricingKeys.all, "rules"] as const,
};

export function usePricing(
  filters: PricingFilters = {},
  page = 1,
  pageSize = 10,
) {
  return useQuery({
    queryKey: pricingKeys.list(filters, page, pageSize),
    queryFn: () => pricingService.getAll(filters, page, pageSize),
  });
}

export function usePricingStats() {
  return useQuery({
    queryKey: pricingKeys.stats(),
    queryFn: () => pricingService.getStats(),
  });
}

export function usePriceLists() {
  return useQuery({
    queryKey: pricingKeys.priceLists(),
    queryFn: () => pricingService.getPriceLists(),
  });
}

export function usePricingRules() {
  return useQuery({
    queryKey: pricingKeys.rules(),
    queryFn: () => pricingService.getRules(),
  });
}