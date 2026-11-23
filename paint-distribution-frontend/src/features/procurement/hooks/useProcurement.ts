import { useQuery } from "@tanstack/react-query";
import { procurementService } from "../services/procurementService";
import type { ProcurementFilters } from "../types/procurement.types";

export const procurementKeys = {
  all: ["procurement"] as const,
  lists: () => [...procurementKeys.all, "list"] as const,
  list: (filters: ProcurementFilters, page: number, pageSize: number) =>
    [...procurementKeys.lists(), filters, page, pageSize] as const,
  details: () => [...procurementKeys.all, "detail"] as const,
  detail: (id: string) => [...procurementKeys.details(), id] as const,
  stats: () => [...procurementKeys.all, "stats"] as const,
  suppliers: () => [...procurementKeys.all, "suppliers"] as const,
  orders: () => [...procurementKeys.all, "orders"] as const,
  receipts: () => [...procurementKeys.all, "receipts"] as const,
};

export function useProcurement(
  filters: ProcurementFilters = {},
  page = 1,
  pageSize = 10,
) {
  return useQuery({
    queryKey: procurementKeys.list(filters, page, pageSize),
    queryFn: () => procurementService.getRequests(filters, page, pageSize),
  });
}

export function useProcurementStats() {
  return useQuery({
    queryKey: procurementKeys.stats(),
    queryFn: () => procurementService.getStats(),
  });
}

export function useProcurementSuppliers() {
  return useQuery({
    queryKey: procurementKeys.suppliers(),
    queryFn: () => procurementService.getSuppliers(),
  });
}