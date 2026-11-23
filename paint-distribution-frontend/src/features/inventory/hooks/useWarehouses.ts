import { useQuery } from "@tanstack/react-query";
import { inventoryService } from "../services/inventoryService";
import { WAREHOUSE_QUERY_KEY } from "../constants/inventory.constants";

export function useWarehouses() {
  return useQuery({
    queryKey: WAREHOUSE_QUERY_KEY,
    queryFn: inventoryService.getWarehouses,
  });
}