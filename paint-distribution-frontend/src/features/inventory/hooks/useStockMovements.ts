import { useQuery } from "@tanstack/react-query";
import { inventoryService } from "../services/inventoryService";
import { MOVEMENT_QUERY_KEY } from "../constants/inventory.constants";
import type { StockMovementFilters } from "../types/inventory.types";

export function useStockMovements(
  filters: StockMovementFilters = {},
) {
  return useQuery({
    queryKey: [...MOVEMENT_QUERY_KEY, filters],
    queryFn: () => inventoryService.getMovements(filters),
  });
}