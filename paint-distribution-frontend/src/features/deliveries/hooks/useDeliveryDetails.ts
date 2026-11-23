
import { useQuery } from "@tanstack/react-query";
import { DELIVERY_QUERY_KEYS } from "../constants/delivery.constants";
import { deliveryService } from "../services/deliveryService";

export function useDelivery(id: string | undefined) {
  return useQuery({
    queryKey: DELIVERY_QUERY_KEYS.detail(id ?? ""),
    queryFn: () => deliveryService.getDelivery(id!),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}

export function useDeliveryStatusHistory(id: string | undefined) {
  return useQuery({
    queryKey: DELIVERY_QUERY_KEYS.history(id ?? ""),
    queryFn: () => deliveryService.getStatusHistory(id!),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}
