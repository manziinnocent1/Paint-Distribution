import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { inventoryService } from "../services/inventoryService";

import {
  INVENTORY_STATS_QUERY_KEY,
  MOVEMENT_QUERY_KEY,
  STOCK_QUERY_KEY,
  WAREHOUSE_QUERY_KEY,
} from "../constants/inventory.constants";

import type {
  StockAdjustmentValues,
  WarehouseValues,
} from "../types/inventory.types";

export function useInventoryMutations() {
  const queryClient = useQueryClient();

  const refreshInventory = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: MOVEMENT_QUERY_KEY }),
      queryClient.invalidateQueries({
        queryKey: INVENTORY_STATS_QUERY_KEY,
      }),
      queryClient.invalidateQueries({
        queryKey: WAREHOUSE_QUERY_KEY,
      }),
    ]);
  };

  const createAdjustment = useMutation({
    mutationFn: (values: StockAdjustmentValues) =>
      inventoryService.createAdjustment(values),
    onSuccess: refreshInventory,
  });

  const createWarehouse = useMutation({
    mutationFn: (values: WarehouseValues) =>
      inventoryService.createWarehouse(values),
    onSuccess: refreshInventory,
  });

  const updateWarehouse = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: WarehouseValues;
    }) => inventoryService.updateWarehouse(id, values),
    onSuccess: refreshInventory,
  });

  return {
    createAdjustment,
    createWarehouse,
    updateWarehouse,
  };
}