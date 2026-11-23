import { useQuery } from "@tanstack/react-query";
import { salesService } from "../services/salesService";
import { SALES_QUERY_KEYS } from "../constants/sales.constants";

export function useSalesStats() {
  return useQuery({
    queryKey: SALES_QUERY_KEYS.stats(),
    queryFn: () => salesService.getStats(),
  });
}