import { useQuery } from "@tanstack/react-query";
import { procurementService } from "../services/procurementService";
import { procurementKeys } from "./useProcurement";

export function useProcurementRequest(id: string) {
  return useQuery({
    queryKey: procurementKeys.detail(id),
    queryFn: () => procurementService.getRequestById(id),
    enabled: Boolean(id),
  });
}