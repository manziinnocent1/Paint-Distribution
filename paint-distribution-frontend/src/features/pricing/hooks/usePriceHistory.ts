import { useQuery } from "@tanstack/react-query";
import { pricingService } from "../services/pricingService";
import { pricingKeys } from "./usePricing";

export function usePriceHistory(priceId?: string) {
  return useQuery({
    queryKey: pricingKeys.history(priceId ?? ""),
    queryFn: () => pricingService.getHistory(priceId!),
    enabled: Boolean(priceId),
  });
}