import { useQuery } from "@tanstack/react-query";
import { salesService } from "../services/salesService";
import { SALES_QUERY_KEYS } from "../constants/sales.constants";
import type { SalesFilters } from "../types/sales.types";

export function useSales(
  filters: SalesFilters = {},
  page = 1,
  pageSize = 10,
) {
  return useQuery({
    queryKey: SALES_QUERY_KEYS.list(filters, page, pageSize),
    queryFn: () => salesService.getSales(filters, page, pageSize),
  });
}