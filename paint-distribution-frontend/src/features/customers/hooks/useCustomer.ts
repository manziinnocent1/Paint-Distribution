import { useQuery } from "@tanstack/react-query";

import { customerService } from "../services/customerService";
import type {
  Customer,
  CustomerFilters,
  PaginatedCustomers,
} from "../types/customer.types";

export const CUSTOMER_QUERY_KEYS = {
  all: ["customers"] as const,
  lists: () => [...CUSTOMER_QUERY_KEYS.all, "list"] as const,
  list: (filters: CustomerFilters) =>
    [...CUSTOMER_QUERY_KEYS.lists(), filters] as const,
  details: () => [...CUSTOMER_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CUSTOMER_QUERY_KEYS.details(), id] as const,
  addresses: (id: string) =>
    [...CUSTOMER_QUERY_KEYS.all, "addresses", id] as const,
};

/* Paginated list of customers */
export function useCustomer(filters: CustomerFilters = {}) {
  return useQuery<PaginatedCustomers, Error>({
    queryKey: CUSTOMER_QUERY_KEYS.list(filters),
    queryFn: () => customerService.getCustomers(filters),
  });
}

/* Single customer by id */
export function useCustomerDetail(id: string) {
  return useQuery<Customer, Error>({
    queryKey: CUSTOMER_QUERY_KEYS.detail(id),
    queryFn: () => customerService.getCustomer(id),
    enabled: Boolean(id),
  });
}