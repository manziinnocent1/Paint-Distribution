import { useQuery } from "@tanstack/react-query";
import { inventoryService } from "../services/inventoryService";
import { STOCK_QUERY_KEY } from "../constants/inventory.constants";

export function useStockItem(id: string) {
  return useQuery({
    queryKey: [...STOCK_QUERY_KEY, id],
    queryFn: () => inventoryService.getStockById(id),
    enabled: Boolean(id),
  });
}