import { useQuery } from "@tanstack/react-query";
import { inventoryService } from "../services/inventoryService";
import { STOCK_QUERY_KEY, INVENTORY_STATS_QUERY_KEY } from "../constants/inventory.constants";
import type { StockFilters } from "../types/inventory.types";

export function useInventory(filters: StockFilters = {}) {
  return useQuery({
    queryKey: [...STOCK_QUERY_KEY, filters],
    queryFn: () => inventoryService.getStock(filters),
  });
}

export function useInventoryStats() {
  return useQuery({
    queryKey: INVENTORY_STATS_QUERY_KEY,
    queryFn: inventoryService.getStats,
  });
}

export function useLowStock() {
  return useQuery({
    queryKey: [...STOCK_QUERY_KEY, "low-stock"],
    queryFn: inventoryService.getLowStock,
  });
}