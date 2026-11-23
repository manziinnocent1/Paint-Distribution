import { useQuery } from "@tanstack/react-query";
import { paymentService } from "../services/paymentService";
import type { PaymentFilters } from "../types/payment.types";

export const paymentKeys = {
  all: ["payments"] as const,
  lists: () => [...paymentKeys.all, "list"] as const,
  list: (filters: PaymentFilters, page: number, pageSize: number) =>
    [...paymentKeys.lists(), filters, page, pageSize] as const,
  details: () => [...paymentKeys.all, "detail"] as const,
  detail: (id: string) => [...paymentKeys.details(), id] as const,
  stats: () => [...paymentKeys.all, "stats"] as const,
};

export function usePayments(
  filters: PaymentFilters = {},
  page = 1,
  pageSize = 10,
) {
  return useQuery({
    queryKey: paymentKeys.list(filters, page, pageSize),
    queryFn: () => paymentService.getAll(filters, page, pageSize),
  });
}

export function usePaymentStats() {
  return useQuery({
    queryKey: paymentKeys.stats(),
    queryFn: () => paymentService.getStats(),
  });
}