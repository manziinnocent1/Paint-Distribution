
import { useQuery } from "@tanstack/react-query";
import { DELIVERY_QUERY_KEYS } from "../constants/delivery.constants";
import { deliveryService } from "../services/deliveryService";
import type { DeliveryFilters } from "../types/delivery.types";

export function useDeliveries(filters: DeliveryFilters) {
  return useQuery({
    queryKey: DELIVERY_QUERY_KEYS.list(filters),
    queryFn: () => deliveryService.getDeliveries(filters),
    staleTime: 30_000,
  });
}
