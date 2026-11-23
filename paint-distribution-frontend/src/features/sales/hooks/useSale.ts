import { useQuery } from "@tanstack/react-query";
import { salesService } from "../services/salesService";
import { SALES_QUERY_KEYS } from "../constants/sales.constants";

export function useSale(id: string) {
  return useQuery({
    queryKey: SALES_QUERY_KEYS.detail(id),
    queryFn: () => salesService.getSale(id),
    enabled: Boolean(id),
  });
}

export function useSaleTimeline(id: string) {
  return useQuery({
    queryKey: SALES_QUERY_KEYS.timeline(id),
    queryFn: () => salesService.getTimeline(id),
    enabled: Boolean(id),
  });
}