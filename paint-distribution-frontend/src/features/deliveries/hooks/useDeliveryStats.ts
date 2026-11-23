
import { useQuery } from "@tanstack/react-query";
import { DELIVERY_QUERY_KEYS } from "../constants/delivery.constants";
import { deliveryService } from "../services/deliveryService";

export function useDeliveryStats() {
  return useQuery({
    queryKey: DELIVERY_QUERY_KEYS.stats(),
    queryFn: () => deliveryService.getDeliveryStats(),
    staleTime: 30_000,
  });
}
