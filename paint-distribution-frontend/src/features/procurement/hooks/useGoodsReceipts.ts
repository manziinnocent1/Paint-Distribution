import { useQuery } from "@tanstack/react-query";
import { procurementService } from "../services/procurementService";
import { procurementKeys } from "./useProcurement";

export function useGoodsReceipts() {
  return useQuery({
    queryKey: procurementKeys.receipts(),
    queryFn: () => procurementService.getGoodsReceipts(),
  });
}