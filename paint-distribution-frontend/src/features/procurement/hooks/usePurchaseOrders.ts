import { useQuery } from "@tanstack/react-query";
import { procurementService } from "../services/procurementService";
import { procurementKeys } from "./useProcurement";

export function usePurchaseOrders() {
  return useQuery({
    queryKey: procurementKeys.orders(),
    queryFn: () => procurementService.getPurchaseOrders(),
  });
}

export function usePurchaseOrder(id: string) {
  return useQuery({
    queryKey: [...procurementKeys.orders(), id],
    queryFn: () => procurementService.getPurchaseOrderById(id),
    enabled: Boolean(id),
  });
}