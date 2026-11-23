import { useQuery } from "@tanstack/react-query";
import { SUPPLIERS_QUERY_KEYS } from "../constants/supplier.constants";
import { supplierService } from "../services/supplierService";
import type { SupplierFilters } from "../types/supplier.types";

export function useSuppliers(
  filters: SupplierFilters = {},
  page = 1,
  pageSize = 10,
) {
  return useQuery({
    queryKey: SUPPLIERS_QUERY_KEYS.list(filters, page, pageSize),
    queryFn: () => supplierService.getSuppliers(filters, page, pageSize),
  });
}

export function useSupplierStats() {
  return useQuery({
    queryKey: SUPPLIERS_QUERY_KEYS.stats(),
    queryFn: supplierService.getStats,
  });
}